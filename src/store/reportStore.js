import {defineStore} from 'pinia'
import {axiosInst} from "../lib/api.js";
import {ref} from 'vue'
import { useApiStore } from './apiStore.js';

export const useReportStore = defineStore('report-store', () => {
    // state
    const dynRecordObjs = ref([])

    // action
    async function requireDynValues(_fund_ids) {
        try {
            const response = await axiosInst.post("dt-plans/api/get-dynValues", {
                'fund_ids': _fund_ids
            })
            if (response.status === 200) {
                // await getZskb()
                return true
            } else {
                console.error("axios require dyn values failed: ", response)
                return false
            }
        } catch (error) {
            console.log("axios require dyn values failed: ", error)
            return false
        }
    }

    async function getRecordsAndRates(_refresh) {
        try {
            const response = await axiosInst.get("dt-plans/api/get-fund-records-rate/" + _refresh)
            if (response.status === 200) {
                dynRecordObjs.value = await response.data
            } else {
                console.error("axios get records and rates failed: ", response)
                dynRecordObjs.value = []
            }
        } catch (error) {
            console.log("axios get records and rates failed: ", error)
            dynRecordObjs.value = []
        }
    }

    async function removeLocalDynvalue(_fund_id, _fund_name) {
        try {
            const response = await axiosInst.post("dt-plans/api/remove-dynValues/" + _fund_id)
            if (response.status === 200) {
                useApiStore().pop_alert_msg("删除报告成功: " + _fund_name)
                await getRecordsAndRates('refresh')
            } else {
                console.error("axios remove local dyn values failed: ", response)
            }
        } catch (error) {
            console.log("axios remove local dyn values failed: ", error)
        }
    }

    return {
        dynRecordObjs,
        requireDynValues,
        getRecordsAndRates,
        removeLocalDynvalue
    }
});