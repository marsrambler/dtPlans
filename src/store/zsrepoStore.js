import {defineStore} from 'pinia'
import {axiosInst} from "../lib/api.js";
import {ref, watch} from 'vue'
import { useApiStore } from './apiStore.js';

export const useZsRepoStore = defineStore('zsrepo-store', () => {
   // state
   const zsRepoObjs = ref([])
   const zsRepoHides = ref([])
   const zsRepoExcludes = ref([])

   // action
   async function getZsRepo() {
      try {
         const response = await axiosInst.get("dt-plans/api/repository/zhi-shu")
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

   async function getZsRepoHides() {
      try {
         const response = await axiosInst.get("dt-plans/api/get-hide-repo")
         if (response.status == 200) {
            zsRepoHides.value = await response.data
         } else {
            console.error("axios get zsRepoHides failed: ", response)
            zsRepoHides.value = []
         }
      } catch (error) {
         console.log("axios get zsRepoHides error: ", error)
         zsRepoHides.value = []
      }
   }

   async function addZsRepoHide(_fund_id, _fund_name) {
      try {
         const response = await axiosInst.post("dt-plans/api/add-hide-repo", {
            'fund_id': _fund_id
         })
         if (response.status == 200) {
            // await response.data
            useApiStore().pop_alert_msg("隐藏成功: " + _fund_name)
            await getZsRepoHides()
         } else {
            console.error("axios add zsRepoHides failed: ", response)
         }
      } catch (error) {
         console.log("axios add zsRepoHides error: ", error)
      }
   }

   async function getZsRepoExclude() {
      try {
         const response = await axiosInst.get("dt-plans/api/get-exclude-repo")
         if (response.status == 200) {
            zsRepoExcludes.value = await response.data
         } else {
            console.error("axios get zsRepoExcludes failed: ", response)
            zsRepoExcludes.value = []
         }
      } catch (error) {
         console.log("axios get zsRepoExcludes error: ", error)
         zsRepoExcludes.value = []
      }
   }

   async function excludeRepo(_fund_id, _fund_name) {
      try {
         const response = await axiosInst.post("dt-plans/api/exclude-repo", {
            'fund_id': _fund_id
         })
         if (response.status == 200) {
            // await response.data
            useApiStore().pop_alert_msg("排除成功: " + _fund_name)
            await getZsRepoExclude()
         } else {
            console.error("axios exclude repo failed: ", response)
         }
      } catch (error) {
         console.log("axios exclude repo error: ", error)
      }
   }

   return {
      zsRepoObjs,
      zsRepoHides,
      zsRepoExcludes,
      getZsRepo,
      getZsRepoHides,
      addZsRepoHide,
      getZsRepoExclude,
      excludeRepo
   }
});