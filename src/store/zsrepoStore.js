import {defineStore} from 'pinia'
import {axiosInst} from "../lib/api.js";
import {ref, watch} from 'vue'
import { useApiStore } from './apiStore.js';

export const useZsRepoStore = defineStore('zsrepo-store', () => {
   // state
   const zsRepoObjs = ref([])
   const zsRepoHides = ref([])
   const zsRepoExcludes = ref([])
   const zsRepoBases = ref([])
   const zsRepoRecycles = ref([])
   const zsRepoRecycleHides = ref([])

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

   async function removeZsRepoHide(_fund_id, _fund_name) {
      try {
         const response = await axiosInst.post("dt-plans/api/remove-hide-repo", {
            'fund_id': _fund_id
         })
         if (response.status == 200) {
            // await response.data
            useApiStore().pop_alert_msg("取消隐藏成功: " + _fund_name)
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

   async function includeRepo(_fund_id, _fund_name) {
      try {
         const response = await axiosInst.post("dt-plans/api/include-repo", {
            'fund_id': _fund_id
         })
         if (response.status == 200) {
            // await response.data
            useApiStore().pop_alert_msg("加入成功: " + _fund_name)
            await getZsRepoExclude()
         } else {
            console.error("axios include repo failed: ", response)
         }
      } catch (error) {
         console.log("axios include repo error: ", error)
      }
   }

   async function saveRepoBase(_fund_ids) {
      try {
         const response = await axiosInst.post("dt-plans/api/repository/save-repo-base", {
            'fund_ids': _fund_ids
         })
         if (response.status == 200) {
            // await response.data
            useApiStore().pop_alert_msg("保存基准成功")
            await getRepoBase()
         } else {
            console.error("axios save repo base failed: ", response)
         }
      } catch (error) {
         console.log("axios save repo base error: ", error)
      }
   }

   async function getRepoBase() {
      try {
         const response = await axiosInst.get("dt-plans/api/repository/get-repo-base")
         if (response.status == 200) {
            zsRepoBases.value = await response.data
         } else {
            console.error("axios get repo base failed: ", response)
            zsRepoBases.value = []
         }
      } catch (error) {
         console.log("axios get repo base error: ", error)
         zsRepoBases.value = []
      }
   }

   async function getRepoRecycles() {
      try {
         const response = await axiosInst.get("dt-plans/api/repository/get-repo-recycle")
         if (response.status == 200) {
            zsRepoRecycles.value = await response.data
         } else {
            console.error("axios get repo recycle failed: ", response)
            zsRepoRecycles.value = []
         }
      } catch (error) {
         console.log("axios get repo recycle error: ", error)
         zsRepoRecycles.value = []
      }
   }

   async function getRepoRecycleHides() {
      try {
         const response = await axiosInst.get("dt-plans/api/repository/get-repo-recycle-hide")
         if (response.status == 200) {
            zsRepoRecycleHides.value = await response.data
         } else {
            console.error("axios get repo recycle hide failed: ", response)
            zsRepoRecycleHides.value = []
         }
      } catch (error) {
         console.log("axios get repo recycle hide error: ", error)
         zsRepoRecycleHides.value = []
      }
   }

   async function updateRepoRecycleHides(_hide_str) {
      try {
         const response = await axiosInst.post("dt-plans/api/repository/update-repo-recycle-hide", {
            'hide_str': _hide_str
         })
         if (response.status == 200) {
            // await response.data
            useApiStore().pop_alert_msg("更新隐藏成功：" + _hide_str)
            await getRepoRecycleHides()
         } else {
            console.error("axios save repo recycle hide failed: ", response)
         }
      } catch (error) {
         console.log("axios save repo recycle hide error: ", error)
      }
   }

   async function sortRepoRecycleHides(_tot_str) {
      try {
         const response = await axiosInst.post("dt-plans/api/repository/sort-repo-recycle-hide", {
            'tot_str': _tot_str
         })
         if (response.status == 200) {
            // await response.data
            useApiStore().pop_alert_msg("排序成功")
            await getRepoRecycleHides()
         } else {
            console.error("axios sort repo recycle hide failed: ", response)
         }
      } catch (error) {
         console.log("axios sort repo recycle hide error: ", error)
      }
   }

   return {
      zsRepoObjs,
      zsRepoHides,
      zsRepoExcludes,
      zsRepoBases,
      zsRepoRecycles,
      zsRepoRecycleHides,
      getZsRepo,
      getZsRepoHides,
      addZsRepoHide,
      removeZsRepoHide,
      getZsRepoExclude,
      excludeRepo,
      includeRepo,
      saveRepoBase,
      getRepoBase,
      getRepoRecycles,
      getRepoRecycleHides,
      updateRepoRecycleHides,
      sortRepoRecycleHides
   }
});