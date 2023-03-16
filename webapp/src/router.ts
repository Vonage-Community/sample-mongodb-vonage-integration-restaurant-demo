
import { createRouter, createWebHistory } from "vue-router"
import { authenticationStore } from "./stores/authenticationStore";

const routes = [
    {
        path: '/',
        name: 'home',
        redirect: { name: 'inventory.home'}
    },
    {
        path: '/inventory',
        name: 'inventory.home',
        component: () => import('@/views/Inventory.vue'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/login',
        name: 'auth.login',
        component: () => import('@/views/Login.vue'),
    },
    {
        path: '/logout',
        name: 'auth.logout',
        component: () => import('@/views/Logout.vue'),
    },
    {
        path: '/notifications',
        name: 'notifications.home',
        component: () => import('@/views/Notifications.vue'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/pos/orders',
        name: 'pos.orders',
        component: () => import('@/views/Kitchen/Orders.vue'),
    },
    {
        path: '/website/login',
        name: 'website.auth.login',
        component: () => import('@/views/Website/Login.vue'),
    },
    {
        path: '/website/logout',
        name: 'website.auth.logout',
        component: () => import('@/views/Website/Logout.vue'),
    },
    {
        path: '/website/order',
        name: 'website.order',
        component: () => import('@/views/Website/Order.vue'),
        meta: {
            requiresWebsiteAuth: true
        }
    },
    {
        path: '/website/confirm',
        name: 'website.order.confirm',
        component: () => import('@/views/Website/ConfirmOrder.vue'),
        meta: {
            requiresWebsiteAuth: true
        }
    },
    {
        path: '/website/order-status',
        name: 'website.order.status',
        component: () => import('@/views/Website/OrderStatus.vue'),
        meta: {
            requiresWebsiteAuth: true
        }
    }
]
const router = createRouter({
    history: createWebHistory(),
    routes: routes,
});

router.beforeEach(async (to, from, next) => {
    const authStore = authenticationStore()

    if (to.matched.some(record => record.meta.requiresAuth)) {
        const token = localStorage.getItem('token');

        if (authStore.user) {
            next()
        }

        return next('/login')
    }

    if (to.matched.some(record => record.meta.requiresWebsiteAuth)) {
        if (authStore.token) {
            next()
        }

        return next('/website/login')
    }

    next()
});

export default router