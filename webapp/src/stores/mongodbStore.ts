import { defineStore } from 'pinia'
import { authenticationStore } from './authenticationStore'

const authStore = authenticationStore()
const dataSource = import.meta.env.VITE_MONGODB_DATA_SOURCE
const databaseName = import.meta.env.VITE_MONGODB_DATABASE

export const mongodbStore = defineStore('mongodbStore', {
    state: () => {
        return {
            restaurantDb: authStore.user.mongoClient(dataSource).db(databaseName),
        }
    },
    actions: {
        getInventoryCollection() {
            return this.restaurantDb.collection('inventory')
        }
    }
})