<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { shoppingCartStore } from '../../stores/shoppingCartStore';

const cartStore = shoppingCartStore()
const router = useRouter();
let inventory = ref(Array());

async function getInventory() {
    await fetch(import.meta.env.VITE_API_URL + '/api/inventory')
        .then(resp => resp.json())
        .then(data => {
            inventory.value = []
            data.forEach((dish: {name: string, price: string}) => {
                inventory.value.push(dish)
            })
        })
        .catch(err => console.log(err));
}

await getInventory();
</script>
<template>
    <main class="container mx-auto px-4">
        <h1 class="text-3xl font-bold my-4">Start Your Order</h1>
        <div class="grid gap-4 grid-cols-3">
            <div 
                v-for="dish in inventory"
                :key="dish.name"
                @click="cartStore.addItemToCart(dish)"
                class="text-center rounded-xl border-2 border-slate-200 p-4 cursor-pointer">
                    <img src="https://picsum.photos/300/200" className="mx-auto"/>
                    <span className="block lg:text-2xl sm:text-xl font-bold">{{dish.name}}</span>
                    <span className="block text-sm">$ {{(dish.price / 100)}}</span>
            </div>
        </div>

        <div class="my-4 text-right"><a class="btn btn-primary" @click="$router.push({name: 'website.order.confirm'})">Check Out</a></div>
    </main>
</template>