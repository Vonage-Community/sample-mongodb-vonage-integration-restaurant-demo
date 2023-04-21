<script lang="ts">
export default {};
</script>

<script setup lang="ts">
import ConversationClient from 'nexmo-client'
import { createToaster } from '@meforma/vue-toaster'
import { authenticationStore } from '../stores/authenticationStore';

const authStore = authenticationStore();
const toaster = createToaster({ dismissable: true });

async function boot() {
    const data = await fetch(import.meta.env.VITE_API_URL + '/jwt', {
        method: 'POST',
        body: JSON.stringify({username: authStore.username}),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + authStore.token
        }
    })
        .then(resp => resp.json())
        .catch(err => console.log(err));
    
    const jwt = data.token
    const conversationID = data.conversation

    const client = new ConversationClient({ debug: true })
    let app = await client.createSession(jwt)
    const conversation = await app.getConversation(conversationID)

    conversation.on("support_request", async (sender: any, event: any) => {
        toaster.show(`${event.body.email} has request support: <a target="_blank" href="${event.body.host_url}">Join Meeting</a>`);
    });
}

boot()
</script>
<template>
    
</template>