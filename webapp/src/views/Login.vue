<script setup lang="ts">
import { MongoDBRealmError } from 'realm-web';
import { ref } from 'vue'
import { useRouter } from 'vue-router';
import { authenticationStore } from '../stores/authenticationStore';

const router = useRouter();
const username = ref('')
const password = ref('')
const authStore = authenticationStore()

const login = async () => {
    try {
        await authStore.login(username.value, password.value)
        router.push({ name: 'inventory.home' });
    } catch (error) {
        if (error instanceof MongoDBRealmError) {
            console.log(error.errorCode)
        }
    }
}
</script>

<template>
    <main class="container mx-auto text-center">
        <h1 class="text-2xl font-bold">Admin Login</h1>

        <form @submit.prevent="login">
            <div>
                <label>
                    <input placeholder="Username" type="text" v-model="username" />
                </label>
            </div>
            <div>
                <label>
                    <input placeholder="Password" type="password" v-model="password" />
                </label>
            </div>
            <input type="submit" class="cursor-pointer rounded bg-sky-500 hover:bg-sky-700 border-sky-900 text-white p-2 m-2" value="Log In" />
        </form>
    </main>
</template>