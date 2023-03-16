import { defineStore } from 'pinia'

export const shoppingCartStore = defineStore('shoppingCartStore', {
    state: () => {
        return {
            currentOrder: Array(),
            
        }
    },
    actions: {
        addItemToCart(dish: any) {
            this.currentOrder.push(dish);
        },
        removeFromCart(id: any) {
            let index: any = null;
            for(let i = 0; i < this.currentOrder.length; i++) {
                if (this.currentOrder[i].id === id) {
                    index = i;
                    break;
                }
            }

            if (index !== null) {
                this.currentOrder.splice(index, 1);
            }
            
        }
    }
})