<script setup lang="ts">
import { mdiHamburger } from '@mdi/js'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiDelete } from '@mdi/js'
import { authenticationStore } from './stores/authenticationStore';
import { shoppingCartStore } from './stores/shoppingCartStore';

const authStore = authenticationStore()
const cartStore = shoppingCartStore()
const deleteIcon = mdiDelete;
</script>

<template>
  <Suspense>
    <div>
      <div class="navbar bg-base-100">
        <div class="flex-1">
          <a class="btn btn-ghost normal-case text-xl"><svg-icon :class="{inline: true}" type="mdi" :path="mdiHamburger"></svg-icon> Von Appétit</a>
        </div>
        <div class="flex-none">
          <div class="dropdown dropdown-end">
            <label tabindex="0" class="btn btn-ghost btn-circle">
              <div class="indicator">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                <span class="badge badge-sm indicator-item">{{ cartStore.currentOrder.length }}</span>
              </div>
            </label>
            <div tabindex="0" class="mt-3 card card-compact dropdown-content w-52 bg-base-100 drop-shadow">
              <div class="card-body">
                <span class="font-bold text-lg">{{  cartStore.currentOrder.length }} Items</span>
                <span  
                    v-for="dish in cartStore.currentOrder"
                    :key="dish.name"
                    class="">
                        {{dish.name}} - $ {{(dish.price / 100)}} <svg-icon type="mdi" :path="deleteIcon" @click="cartStore.removeFromCart(dish.id)" class="cursor-pointer inline"/>
                </span>
                <div class="card-action">
                  <div class="my-4 text-right"><a class="btn btn-primary" @click="$router.push({name: 'website.order.confirm'})">Check Out</a></div>
                </div>
              </div>
            </div>
          </div>
          <div class="dropdown dropdown-end">
            <label tabindex="0" class="btn btn-ghost btn-circle avatar">
              <div class="w-10 rounded-full">
                <img src="https://www.gravatar.com/avatar/00000000000000000000000000000000" /></div>
            </label>
            <ul tabindex="0" class="menu menu-compact dropdown-content mt-3 p-2 drop-shadow bg-base-100 rounded-box w-52">
              <li><a @click="$router.push({name: 'website.auth.logout'})" class="btn btn-primary">Log Out</a></li>
            </ul>
          </div>
        </div>
      </div>
      <router-view></router-view>
    </div>
  </Suspense>
</template>