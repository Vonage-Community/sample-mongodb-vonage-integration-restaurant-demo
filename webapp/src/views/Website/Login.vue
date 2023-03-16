<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router';

import { authenticationStore } from '../../stores/authenticationStore';

const router = useRouter();
const username = ref('')
const password = ref('')

const registerUsername = ref('')
const registerPassword = ref('')
const registerPhoneNumber = ref('')
const showRegisterPane = ref(false)
const tempJWT = ref('')
const tfaPin = ref('')
let verifyId: string | null = null;
const authStore = authenticationStore()

const login = async () => {
    fetch(import.meta.env.VITE_API_URL + '/api/website/authenticate', {
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
        .then(async (json) => {
            console.log(json)
            tempJWT.value = json.token
            verifyId = json.verifyId
            
            return
        })
        .catch(err => console.log(err));
}

const verify = async() => {
    fetch(import.meta.env.VITE_API_URL + '/api/website/authenticate/verify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token: tempJWT.value,
            verifyId,
            tfaPin: tfaPin.value
        })
    })
        .then(resp => resp.json())
        .then(async (json) => {
            console.log(json)
            authStore.setToken(json.token)
            router.push({ name: 'website.order' });
            
            return
        })
        .catch(err => console.log(err));
    
}

const register = async () => {
    fetch(import.meta.env.VITE_API_URL + '/api/website/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: registerUsername.value,
            password: registerPassword.value,
            phone: registerPhoneNumber.value,
        })
    })
        .then(resp => showRegisterPane.value = false)
        .catch(err => console.log(err));

}
</script>

<template>
    <main class="container mx-auto text-center">
        <div class="card shadow-xl bg-base-200">
            <div class="card-body">
                <div v-if="tempJWT">
                    <h2 class="card-title">Enter your 2FA Code</h2>
                    <form @submit.prevent="verify" class="form-control gap-4 mt-4">
                        <div class="input-group">
                                <span class="w-1/4">2FA Code</span>
                                <input type="text" v-model="tfaPin" class="input input-bordered w-full"/>
                            </div>

                        <input type="submit" class="btn btn-primary" value="Submit" />

                    </form>
                </div>
                <div v-else>
                    <div v-if="showRegisterPane">
                        <h2 class="card-title">Register</h2>
                        
                        <form @submit.prevent="register" class="form-control gap-4 mt-4">
                            <div class="input-group">
                                <span class="w-1/4">Username</span>
                                <input type="text" v-model="registerUsername" class="input input-bordered w-full"/>
                            </div>
                            <div class="input-group">
                                <span class="w-1/4">Password</span>
                                <input type="text" v-model="registerPassword" class="input input-bordered w-full"/>
                            </div>
                            <div class="input-group">
                                <span class="w-1/4">Phone Number</span>
                                <input type="text" v-model="registerPhoneNumber" class="input input-bordered w-full"/>
                            </div>

                            <input type="submit" class="btn btn-primary" value="Register" />

                            <div>
                                <a @click="showRegisterPane = false" class="underline">Or sign in</a>
                            </div>
                        </form>
                    </div>
                    <div v-else>
                        <h2 class="card-title">Log In for Deliciousness</h2>
                        <form @submit.prevent="login" class="form-control gap-4 mt-4">
                            <div class="input-group">
                                <span class="w-1/4">Username</span>
                                <input type="text" v-model="username" class="input input-bordered w-full"/>
                            </div>
                            <div class="input-group">
                                <span class="w-1/4">Password</span>
                                <input type="password" v-model="password" class="input input-bordered w-full"/>
                            </div>

                            <input type="submit" class="btn btn-primary " value="Log In To Order" />

                            <div>
                                <a @click="showRegisterPane = true" class="underline">Or sign up for flavor</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>