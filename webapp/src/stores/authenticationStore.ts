import { defineStore } from 'pinia'
import * as Realm from 'realm-web'

const realmApp = new Realm.App({id: 'application-0-cguah'})

export const authenticationStore = defineStore('authenticationStore', {
    state: () => {
        return {
            token: null,
            user: null,
        }
    },
    actions: {
        async login(username, password) {
            const creds = Realm.Credentials.emailPassword(username, password);
            this.user = await realmApp.logIn(creds)
            return this.user
        },
        setToken(token: string) {
            this.token = token
        },
        logout() {
            this.token = null
        }
    }
})