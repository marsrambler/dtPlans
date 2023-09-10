import "/src/assets/style.scss"
import "@popperjs/core"
import "bootstrap"
import './style.css'

import { createApp } from 'vue'
import App from './App.vue'

import Highcharts from "highcharts";
import StockModule from "highcharts/modules/stock";
import HighchartsVue from "highcharts-vue";
import exportingInit from 'highcharts/modules/exporting'
import offline_exporting from 'highcharts/modules/offline-exporting'
import export_data from 'highcharts/modules/export-data.src'

import store from "./lib/store.js";
import router from './lib/router.js'
import {axiosSetup} from "./lib/api.js";

StockModule(Highcharts);
exportingInit(Highcharts)
export_data(Highcharts)
offline_exporting(Highcharts)

axiosSetup()

const app =createApp(App)
app.use(router).use(store).use(HighchartsVue).mount("#app")
// createApp(App).mount('#app')
