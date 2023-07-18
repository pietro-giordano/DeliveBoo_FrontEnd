import { createRouter, createWebHistory } from 'vue-router'
import Home from '/src/views/Home.vue'

import Restaurant from '/src/views/Restaurant.vue'

import Cart from '/src/views/Cart.vue'
import DefaultLayout from '/src/layouts/DefaultLayout.vue'
const routes = [
    {
        path:'/',
        name:'Public',
        component:DefaultLayout,
        redirect: '/',
        children:[
            {
                path:'/',
                name:'Home',
                component:Home
            },
            {
                path:'/ristorante/:slug',
                name:'restaurant',
                component:Restaurant
            },
        
            {
                path:'/cart',
                name:'Cart',
                component:Cart
            }
        ]
    },
]   
const router = createRouter({
    history: createWebHistory(),
    routes,
})
export default router