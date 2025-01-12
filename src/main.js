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
import {useReportStore} from "./store/reportStore.js"
import {useComposeStore} from "./store/composeStore.js"

StockModule(Highcharts);
exportingInit(Highcharts)
export_data(Highcharts)
offline_exporting(Highcharts)

axiosSetup()

const app =createApp(App)
app.use(router).use(store).use(HighchartsVue).mount("#app")
// createApp(App).mount('#app')
const reportStore = useReportStore()
const { getBigPoolFixedHold, getRecordsAndRatesFromWorker, getAllComposeFixedHoldFromWorker} = reportStore
const composeStore = useComposeStore()
const { getComposeFixedHoldFromWorker } = composeStore

window.addEventListener("message", (e) => {
  if (e.data === 'dtPlan_fund-report-objs') {
    getRecordsAndRatesFromWorker();
  } else if (e.data === 'dtPlan_subs-good-funds') {

  } else if (e.data === 'dtPlan_fixed-hold-buyin') {
    getBigPoolFixedHold();
  } else if (e.data === 'dtPlan_compose-hold-buyin') {
    getComposeFixedHoldFromWorker();
    getAllComposeFixedHoldFromWorker();
  } else {
    console.log("****  has not implemented the receiver for: ", e.data)
  }
})