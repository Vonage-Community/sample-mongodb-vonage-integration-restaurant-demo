<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('')
const password = ref('')

const login = async () => {
    fetch(import.meta.env.VITE_API_URL + '/api/authenticate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username.value,
            password: password.value,
        })
    })
        .then(resp => resp.json())
        .then(json => {
            localStorage.setItem('token', json.token);
            router.push({ name: 'inventory.home' });
        })
        .catch(err => console.log(err));

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