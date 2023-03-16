<script setup lang="ts">
import { ref } from 'vue';
import { mongodbStore } from '../stores/mongodbStore';

const dbStore = mongodbStore()

const newDishName = ref('');
const newDishPrice = ref(0);

let inventory = ref(Array());

async function getInventory() {
    const dishes = await dbStore.getInventoryCollection().find()
    inventory.value = Array()
    dishes.forEach(dish => {
        if (dish.name) {
            inventory.value.push(dish)
        }
    })
}

async function addInventoryItem() {
    dbStore.getInventoryCollection()
        .insertOne({
            name: newDishName.value,
            price: newDishPrice.value * 100
        })
        .then(() => {
            getInventory()
            newDishName.value = ''
            newDishPrice.value = 0
        }).catch(error => {
            console.error(error)
        });
}

async function deleteItem(id) {
    dbStore.getInventoryCollection()
        .deleteOne({_id: id})
        .then(() => {
            getInventory()
        }).catch(error => {
            console.error(error)
        });
}

await getInventory();
</script>
<template>
    <main class="container mx-auto px-4">
        <h1 class="text-3xl font-bold">Inventory</h1>
        <hr />

        <div>
            <ul>
                <li class="rounded border-2 p-4 m-2" v-for="dish in inventory" :key="dish.name">{{dish.name}} - $ {{(dish.price / 100)}} | <a @click="deleteItem(dish._id)">Delete</a></li>
            </ul>
        </div>

        <form @submit.prevent="addInventoryItem">
            <h2 class="text-2xl font-bold">Add New Dish</h2>
            <div class="grid grid-cols-4 gap-4 my-4">
                <div class="align-middle"><label><span>Dish name</span></label></div>
                <div class="col-span-3"><input class="w-full" type="text" v-model="newDishName" /></div>
                <div class="align-middle"><label><span>Dish Price</span></label></div>
                <div class="col-span-3"><input class="w-full" type="text" v-model="newDishPrice" /></div>
                <div class="col-span-4 flex flex-row-reverse">
                    <div><input class="text-right bg-sky-500 rounded p-2 text-white" type="submit" value="Add New Dish" /></div>
                </div>
            </div>
        </form>
        <hr class="mb-4"/>
        <div class="my-4 text-right"><a class="text-right bg-green-500 rounded p-2 my-4 text-white" @click="$router.push({name: 'pos.orders'})">View Orders</a></div>
        <div class="my-4 text-right"><a class="text-right bg-red-500 rounded p-2 text-white" @click="$router.push({name: 'auth.logout'})">Log out</a></div>
    </main>
</template>