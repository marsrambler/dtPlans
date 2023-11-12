import {defineStore} from 'pinia'
import {axiosInst} from "../lib/api.js";
import {ref, watch} from 'vue'
import { useApiStore } from './apiStore.js';

export const useAggressiveStore = defineStore('aggressive-store', () => {
    // state
    const aggressiveObjs = ref([])
    const aggressiveExcludes = ref([])

    // action
    async function getAllAggressive() {
        try {
            const response = await axiosInst.get("dt-plans/api/kanban/aggressive/")
            if (response.status == 200) {
                aggressiveObjs.value = await response.data;
            } else {
                console.error("axios get all aggressive failed: ", response)
                aggressiveObjs.value = []
            }
        } catch (error) {
            console.log("axios get all aggressive error: ", error)
            aggressiveObjs.value = []
        }
    }

    async function getAggressiveExcludes() {
        try {
            const response = await axiosInst.get("dt-plans/api/kanban/get-exclude-aggressive/")
            if (response.status == 200) {
                aggressiveExcludes.value = await response.data;
            } else {
                console.error("axios get aggressive excludes failed: ", response)
                aggressiveExcludes.value = []
            }
        } catch (error) {
            console.log("axios get aggressive excludes error: ", error)
            aggressiveExcludes.value = []
        }
    }

    async function addAggressiveExclude(_fund_id, _fund_name) {
        try {
            const response = await axiosInst.post("dt-plans/api/kanban/exclude-aggressive", {
                'fund_id': _fund_id
            })
            if (response.status === 200) {
                useApiStore().pop_alert_msg("排除主动成功: " + _fund_name)
                await getAggressiveExcludes()
            } else {
                console.error("axios add aggressive failed: ", response)
            }
        } catch (error) {
            console.log("axios add aggressive failed: ", error)
        }
    }

    return {
        aggressiveObjs,
        aggressiveExcludes,
        getAllAggressive,
        getAggressiveExcludes,
        addAggressiveExclude
    }
});