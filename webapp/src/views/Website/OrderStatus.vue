<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { authenticationStore } from '../../stores/authenticationStore';
const router = useRouter();

let currentOrder = ref(localStorage.getItem('currentOrderNumber'));
const authStore = authenticationStore();

async function makeVideoCall() {
    await fetch(import.meta.env.VITE_API_URL + '/api/website/video-call', {
        method: 'POST',
        body: JSON.stringify({
            orderNumber: currentOrder.value
        }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + authStore.token
        }
    })
        .then(resp => resp.json())
        .then(data => {
            window.open(data.guest_url);
        })
        .catch(err => console.log(err));
}

</script>
<template>
    <main class="container mx-auto px-4">
        <h1 class="text-3xl font-bold">Order Status</h1>
        <div>Your Order Number - {{ currentOrder }}</div>

        <hr class="my-4" />
        <div class="grid grid-cols-2">
            <div class="v-full align-middle">Problem with your order?</div>
            <div><button  class="text-right bg-green-500 rounded p-2 my-4 text-white" @click="makeVideoCall">Video Call</button></div>
        </div>

        <div class="my-4 text-right"><a class="text-right bg-red-500 rounded p-2 my-4 text-white" @click="$router.push({name: 'website.auth.logout'})">Log out</a></div>
    </main>
</template>