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
        component: Compose
    },
    {
        path: '/repo/',
        component: Zsrepo
    },
    {
        path: '/kanban/',
        component: Zskb
    },
    {
        path: '/report/',
        component: Report
    },
    {
        path: '/recycle/',
        component: RepoRecycle
    },
    {
        path: '/aggressive/',
        component: Aggressive
    },
    {
        path: '/convg/',
        component: DtConvg
    }
]

export default createRouter({
    history: createWebHashHistory(import.meta.env.VITE_BASE_ROUTE_URL),
    routes})
