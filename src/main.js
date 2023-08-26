import "/src/assets/style.scss"
import "@popperjs/core"
import "bootstrap"
import './style.css'

import { createApp } from 'vue'
import App from './App.vue'
import store from "./lib/store.js";
import router from './lib/router.js'
import {axiosSetup} from "./lib/api.js";

axiosSetup()

const app =createApp(App)
app.use(router).use(store).mount("#app")
// createApp(App).mount('#app')
