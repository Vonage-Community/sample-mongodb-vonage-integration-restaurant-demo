<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Notifications from '../Notifications.vue'
const router = useRouter();

const newDishName = ref('');
const newDishPrice = ref(0);

let orders = ref(Array());

async function getOrders() {
    await fetch(import.meta.env.VITE_API_URL + '/api/orders')
        .then(resp => resp.json())
        .then(data => {
            orders.value = []
            data.forEach((order: any) => {
                orders.value.push(order)
            })
        })
        .catch(err => console.log(err));
}


await getOrders();
</script>
<template>
    <Notifications />
    <main class="container mx-auto px-4">
        <h1 class="text-3xl font-bold">Current Orders</h1>
        <hr/>
        <div>
            <ul>
                <li  class="rounded border-2 p-4 m-2" v-for="order in orders" :key="order.id">
                    {{ order.id }} - {{ new Date(order.orderTime).toDateString() }}<br/>
                    <div v-if="order.meetingUrl" class="inline my-4"><a class="text-right bg-blue-500 rounded p-2 my-4 text-white" v-bind:href="order.meetingUrl" target="_blank">Enter Meeting</a></div>
                </li>
            </ul>
        </div>

        <hr />

        <div class="my-4 text-right"><a class="text-right bg-green-500 rounded p-2 my-4 text-white" @click="$router.push({name: 'home'})">Inventory</a></div>
        <div class="my-4 text-right"><a class="text-right bg-red-500 rounded p-2 text-white" @click="$router.push({name: 'auth.logout'})">Log out</a></div>
        
        
    </main>
</template>