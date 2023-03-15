import { readFileSync } from "fs";
import fetch from "node-fetch";
import { tokenGenerate } from '@vonage/jwt'

export default class Conversations {
    applicationId: string
    privateKey: Buffer

    constructor(applicationId: string, privateKeyPath: string) {
        this.applicationId = applicationId;
        this.privateKey = readFileSync(privateKeyPath);
    }

    protected getAuthorizationHeader(): string {
        return 'Bearer ' + tokenGenerate(this.applicationId, this.privateKey, {
            acl: {
                "paths": {
                    "/*/users/**": {},
                    "/*/conversations/**": {},
                    "/*/sessions/**": {},
                    "/*/devices/**": {},
                    "/*/image/**": {},
                    "/*/media/**": {},
                    "/*/applications/**": {},
                    "/*/push/**": {},
                    "/*/knocking/**": {},
                    "/*/legs/**": {}
                  }
            },
        });
    }

    async addEventToConversation(conversationName: string, email: string, eventData: any) {
        const conversation: any = await this.fetchByName(conversationName);
        const member: any = await this.fetchMemberByEmail(conversationName, email);

        eventData.from = member.id;

        const event = await fetch('https://api.nexmo.com/v0.3/conversations/' + conversation.id + '/events', {
            method: 'POST',
            body: JSON.stringify(eventData),
            headers: {
                'Authorization': this.getAuthorizationHeader(),
                'Content-Type': 'application/json'
            }
        })
            .then(resp => resp.json())
            .then((data: any) => {
                console.log(data)
                return data;
            })

        return event;
    }

    async fetchByName(name: string) {
        let conversation = await fetch('https://api.nexmo.com/v0.3/conversations', {
            headers: {
                'Authorization': this.getAuthorizationHeader(),
                'Content-Type': 'application/json'
            }
        })
            .then(resp => resp.json())
            .then((data: any) => {
                for(let i = 0; i < data._embedded.conversations.length; i++) {
                    if (data._embedded.conversations[i].name === name) {
                        return data._embedded.conversations;
                    }
                }
            })
        if (!conversation) {
            conversation = await fetch('https://api.nexmo.com/v0.3/conversations', {
                method: 'POST',
                body: JSON.stringify({
                    name
                }),
                headers: {
                    'Authorization': this.getAuthorizationHeader(),
                    'Content-Type': 'application/json'
                }
            })
                .then(resp => resp.json())
                .then((data: any) => {
                    return data;
                })
        }
        return conversation[0];
    }

    async fetchEventsByConversationName(name: string) {
        const conversation: any = await this.fetchByName(name);
        const events = await fetch('https://api.nexmo.com/v0.3/conversations/' + conversation.id + '/events', {
            headers: {
                'Authorization': this.getAuthorizationHeader(),
                'Content-Type': 'application/json'
            }
        })
            .then(resp => resp.json())
            .then((data: any) => {
                return data;
            })

        return events;
    }

    async fetchMemberByEmail(conversationName: string, email: string) {
        const conversation = await this.fetchByName(conversationName);
        let member = await fetch('https://api.nexmo.com/v0.3/conversations/' + conversation.id + '/members', {
            headers: {
                'Authorization': this.getAuthorizationHeader(),
                'Content-Type': 'application/json'
            }
        })
            .then(resp => resp.json())
            .then((data: any) => {
                for(let i = 0; i < data._embedded.members.length; i++) {
                    if (data._embedded.members[i]._embedded.user.name === email) {
                        return data._embedded.members[i];
                    }
                }
            })
        if (!member) {
            const user = await this.fetchUserByEmail(email)
            member = await fetch('https://api.nexmo.com/v0.3/conversations/' + conversation.id + '/members', {
                method: 'POST',
                body: JSON.stringify({
                    user: { id: user.id },
                    state: 'joined',
                    channel: {
                        type: 'app',
                    },
                }),
                headers: {
                    'Authorization': this.getAuthorizationHeader(),
                    'Content-Type': 'application/json'
                }
            })
                .then(resp => resp.json())
                .then((data: any) => {
                    return data;
                })
        }
        return member;
    }

    async fetchUserByEmail(email: string) {
        let user = await fetch('https://api.nexmo.com/v0.3/users', {
            headers: {
                'Authorization': this.getAuthorizationHeader(),
                'Content-Type': 'application/json'
            }
        })
            .then(resp => resp.json())
            .then((data: any) => {
                for(let i = 0; i < data._embedded.users.length; i++) {
                    if (data._embedded.users[i].name === email) {
                        return data._embedded.users[i];
                    }
                }
            })
        if (!user) {
            user = await fetch('https://api.nexmo.com/v0.3/users', {
                method: 'POST',
                body: JSON.stringify({
                    name: email
                }),
                headers: {
                    'Authorization': this.getAuthorizationHeader(),
                    'Content-Type': 'application/json'
                }
            })
                .then(resp => resp.json())
                .then((data: any) => {
                    return data;
                })
        }
        return user;
    }
}