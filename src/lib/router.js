import {createRouter} from 'vue-router'
import {createWebHistory} from 'vue-router'
import Homepage from '../pages/Home.vue';
import SignInComponent from '../pages/SignIn.vue';
import Cart from '../pages/Cart.vue';
import Zskb from "../pages/Zskb.vue";

const routes = [
    {
        path: '/',
        component: Zskb
        // component: Homepage
    },

    {
        path: '/sign-in/',
        component: SignInComponent
    },

    {
        path: '/cart/',
        component: Cart
    },
]

export default createRouter({
    history: createWebHistory(),
    routes})

// export default function (history) {
//     return createRouter({
//         history,
//         routes
//     })
// }