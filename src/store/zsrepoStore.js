import {defineStore} from 'pinia'
import {axiosInst} from "../lib/api.js";
import {ref} from 'vue'

export const useZsRepoStore = defineStore('zsrepo-store', () => {
   // state
   const zsRepoObjs = ref([])

   // action
   async function getZsRepo() {
      try {
         const response = await axiosInst.get("api/repository/zhi-shu")
         if (response.status == 200) {
            zsRepoObjs.value = await response.data;
         } else {
            console.error("axios get zsRepo failed: ", response)
            zsRepoObjs.value = []
         }
      } catch (error) {
         console.log("axios get zsRepo error: ", error)
         zsRepoObjs.value = []
      }
   }

   return {
      zsRepoObjs,
      getZsRepo
   }
});