<script setup>
import TopNavbar from "./components/TopNavbar.vue";

import {onUpdated} from "vue";
import {Toast} from 'bootstrap'
import {useApiStore} from "./store/apiStore.js";
import {storeToRefs} from 'pinia'
import {useZsRepoStore} from "./store/zsrepoStore";
import {useZskbStore} from "./store/zskbStore";

const apiStore = useApiStore()
const {requestMsgObjs, errorMsgObjs, isApiInProgress, isAlertVisible, alertMsg} = storeToRefs(apiStore)
const zsrepoStore = useZsRepoStore()
const {getZsRepo, getZsRepoHides, getZsRepoExclude, getRepoBase, getRepoRecycles, getRepoRecycleHides} = zsrepoStore
const zskbStore = useZskbStore()
const {getRtRates, getZskb} = zskbStore

onUpdated(() => {
  const hiddenToasts = errorMsgObjs.value.filter((obj) => {
    return obj.show != true;
  });
  hiddenToasts.forEach(function (error) {
    let errorToast = document.getElementById(error.id);
    let toast = new Toast(errorToast);
    toast.show();
    error.show = true;
    errorToast.addEventListener('hidden.bs.toast', function () {
      const indexOfObject = errorMsgObjs.value.findIndex((item) => {
        return item.id === error.id;
      });
      if (indexOfObject !== -1) {
        errorMsgObjs.value.splice(indexOfObject, 1);
        requestMsgObjs.value = [];
      }
    });
  });
});

getZsRepo()
getZsRepoHides()
getZsRepoExclude()
getRepoBase()
getZskb()
getRtRates()
getRepoRecycles()
getRepoRecycleHides()

</script>

<template>
  <TopNavbar></TopNavbar>
  <router-view></router-view>

  <div v-if="isApiInProgress" style="position: absolute; left: 50%; top: 50%;">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>

  <div ref="container" class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
    <div v-for="item in errorMsgObjs" v-bind:id="item.id" class="toast fade opacity-75 bg-danger" role="alert"
         aria-live="assertive" aria-atomic="true" data-bs-autohide="false" :key="item.id">
      <div class="toast-header bg-danger">
        <strong class="me-auto text-white">{{ item.type }}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body text-white error-body">{{ item.msg }}</div>
    </div>
  </div>
  <div class="alert alert-success position-fixed top-0 end-0" role="alert"
       v-if="isAlertVisible" style="z-index: 1100;">
    {{ alertMsg }}
  </div>
</template>

<style scoped>
html,
body {
  background-color: #112933 !important;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
