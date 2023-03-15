<script setup lang="ts">
import { useRouter } from 'vue-router';
import { authenticationStore } from "../../stores/authenticationStore";
import { shoppingCartStore } from '../../stores/shoppingCartStore';

const authStore = authenticationStore()
const cartStore = shoppingCartStore()
const router = useRouter();

async function submitOrder() {
    const ids = cartStore.currentOrder.map((dish: any) => dish.id);
    await fetch(import.meta.env.VITE_API_URL + '/api/website/order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + authStore.token
        },
        body: JSON.stringify({
            items: ids,
        })
    })
        .then(resp => resp.json())
        .then(async (data) => {
            localStorage.setItem('currentOrderNumber', data.id)
            router.push({name: 'website.order.status'})
        })
        .catch(err => console.log(err));
}
</script>
<template>
    <main class="container mx-auto px-4">
        <h1 class="text-3xl font-bold">Confirm Your Order</h1>
        <div class="grid grid-cols-1 gap-4">
            <div 
                v-for="dish in cartStore.currentOrder"
                :key="dish.name"
                class="card card-side bg-base-300 shadow-xl">
                    <figure><img src="https://picsum.photos/300/200"></figure>
                    <div class="card-body">
                        <h2 class="card-title">{{ dish.name }}</h2>
                        <p>$ {{ dish.price / 100 }}</p>
                    </div>
            </div>
        </div>

        <div class="grid grid-cols-2">
            <div class="my-4 text-left"><a  class="btn btn-secondary" @click="$router.push({name: 'website.order'})">Go Back to Menu</a></div>
            <div class="my-4 text-right"><a  class="btn btn-primary" @click="submitOrder()">Submit Order</a><br/></div>
        </div>
        
        
        
    </main>
</template>