import {defineStore} from 'pinia'
import {axiosInst} from "../lib/api.js";
import {ref, watch} from 'vue'
import { useApiStore } from './apiStore.js';

export const useConvgStore = defineStore('convg-store', () => {
    // state
    const convgObjs = ref([])
    const convgExcludes = ref([])

    // action
    async function getAllConvg() {
        try {
            const response = await axiosInst.get("dt-plans/api/kanban/dtconvg/")
            if (response.status == 200) {
                convgObjs.value = await response.data;
            } else {
                console.error("axios get all convg failed: ", response)
                convgObjs.value = []
            }
        } catch (error) {
            console.log("axios get all convg error: ", error)
            convgObjs.value = []
        }
    }

    async function getConvgExcludes() {
        try {
            const response = await axiosInst.get("dt-plans/api/kanban/get-exclude-dtconvg/")
            if (response.status == 200) {
                convgExcludes.value = await response.data;
            } else {
                console.error("axios get convg excludes failed: ", response)
                convgExcludes.value = []
            }
        } catch (error) {
            console.log("axios get convg excludes error: ", error)
            convgExcludes.value = []
        }
    }

    async function addConvgExclude(_fund_id, _fund_name) {
        try {
            const response = await axiosInst.post("dt-plans/api/kanban/exclude-dtconvg", {
                'fund_id': _fund_id
            })
            if (response.status === 200) {
                useApiStore().pop_alert_msg("排除优选成功: " + _fund_name)
                await getConvgExcludes()
            } else {
                console.error("axios add convg failed: ", response)
            }
        } catch (error) {
            console.log("axios add convg failed: ", error)
        }
    }

    return {
        convgObjs,
        convgExcludes,
        getAllConvg,
        getConvgExcludes,
        addConvgExclude
    }
});