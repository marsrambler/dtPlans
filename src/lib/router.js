import {createRouter} from 'vue-router'
import {createWebHistory, createWebHashHistory} from 'vue-router'
import Zskb from "../pages/Zskb.vue";
import Zsrepo from "../pages/Zsrepo.vue";
import Compose from "../pages/Compose.vue";
import Report from "../pages/Report.vue";
import RepoRecycle from "../pages/RepoRecycle.vue";
import Aggressive from "../pages/Aggressive.vue";
import DtConvg from "../pages/DtConvg.vue";
/* composite*/
const routes = [
    {
        path: '/',
        component: Compose,
        meta: {
            keepalive: true
        }
    },
    {
        path: '/repo/',
        component: Zsrepo,
        meta: {
            keepalive: true
        }
    },
    {
        path: '/kanban/',
        component: Zskb,
        meta: {
            keepalive: true
        }
    },
    {
        path: '/report/',
        component: Report,
        meta: {
            keepalive: false
        }
    },
    {
        path: '/recycle/',
        component: RepoRecycle,
        meta: {
            keepalive: true
        }
    },
    {
        path: '/aggressive/',
        component: Aggressive,
        meta: {
            keepalive: true
        }
    },
    {
        path: '/convg/',
        component: DtConvg,
        meta: {
            keepalive: true
        }
    }
]

export default createRouter({
    history: createWebHashHistory(import.meta.env.VITE_BASE_ROUTE_URL),
    routes})
