import { defineStore } from 'pinia'

export const authenticationStore = defineStore('authenticationStore', {
    state: () => {
        return {
            token: null
        }
    },
    actions: {
        setToken(token: string) {
            this.token = token
        },
        logout() {
            this.token = null
        }
    }
})