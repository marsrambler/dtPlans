import {createRouter} from 'vue-router'
import {createWebHistory, createWebHashHistory} from 'vue-router'
import Zskb from "../pages/Zskb.vue";
import Zsrepo from "../pages/Zsrepo.vue";
import Compose from "../pages/Compose.vue";
import Report from "../pages/Report.vue";
import RepoRecycle from "../pages/RepoRecycle.vue";

const routes = [
    {
        path: '/',
        component: Zsrepo
    },
    {
        path: '/kanban/',
        component: Zskb
    },
    {
        path: '/composite/',
        component: Compose
    },
    {
        path: '/report/',
        component: Report
    },
    ,
    {
        path: '/recycle/',
        component: RepoRecycle
    }
]

export default createRouter({
    history: createWebHashHistory(import.meta.env.VITE_BASE_ROUTE_URL),
    routes})
