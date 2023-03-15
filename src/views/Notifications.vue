<script lang="ts">
export default {};
</script>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ConversationClient from 'nexmo-client'
import { createToaster } from '@meforma/vue-toaster'

const router = useRouter();
const events = ref(Array())
const toaster = createToaster({ dismissable: true });

async function boot() {
    const jwt = await fetch(import.meta.env.VITE_API_URL + '/jwt')
        .then(resp => resp.json())
        .then(data => data.token)
        .catch(err => console.log(err));

    const client = new ConversationClient({ debug: true })
    let app = await client.createSession(jwt)
    const conversation = await app.getConversation('CON-84e4de29-0632-4edd-814b-b56efd90d609')

    conversation.on("support_request", async (sender: any, event: any) => {
        toaster.show(`${event.body.email} has request support: <a target="_blank" href="${event.body.host_url}">Join Meeting</a>`);
    });
}

boot()
</script>
<template>
    
</template>