import {defineStore} from 'pinia'
import {axiosInst} from "../lib/api.js";
import {ref} from 'vue'
import { useApiStore } from './apiStore.js';

export const useZskbStore = defineStore('zskb-store', () => {
    // state
    const zskbObjs = ref([])
    const rtRates = ref({})

    // action
    async function getRtRates() {
        try {
            const response = await axiosInst.get("dt-plans/api/kanban/rt_rates")
            if (response.status === 200) {
                rtRates.value = await response.data;
            } else {
                console.error("axios get rt rates failed: ", response)
                rtRates.value = {}
            }
        } catch (error) {
            console.log("axios get rt rates error: ", error)
            rtRates.value = {}
        }
    }

    async function getZskb() {
        try {
            const response = await axiosInst.get("dt-plans/api/kanban/zhi-shu")
            if (response.status === 200) {
                zskbObjs.value = await response.data;
            } else {
                console.error("axios get zskb failed: ", response)
                zskbObjs.value = []
            }
        } catch (error) {
            console.log("axios get zskb error: ", error)
            zskbObjs.value = []
        }
    }

    async function removeKanban(_fund_id, _fund_name) {
        try {
            const response = await axiosInst.post("dt-plans/api/remove-kanban", {
                'fund_id': _fund_id,
                'fund_name': _fund_name
            })
            if (response.status === 200) {
                useApiStore().pop_alert_msg("移出看板成功: " + _fund_name)
                await getZskb()
                return true
            } else {
                console.error("axios remove kanban failed: ", response)
                return false
            }
        } catch (error) {
            console.log("axios remove kanban failed: ", error)
            return false
        }
    }

    async function addKanban(_fund_id, _fund_name, _index_type, _index_url, _spider_version) {
        try {
            const response = await axiosInst.post("dt-plans/api/add-kanban", {
                'fund_type': 'zhi-shu',
                'fund_id': _fund_id,
                'fund_name': _fund_name,
                'index_type': _index_type,
                'index_url': _index_url,
                'specialSpider': _spider_version
            })
            if (response.status == 200) {
                await getZskb()
                useApiStore().pop_alert_msg("加入看板成功: " + _fund_name)
                return true
            } else {
                console.error("axios add kanban failed: ", response)
                return false
            }
        } catch (error) {
            console.log("axios add kanban failed: ", error)
            return false
        }
    }

    return {
        zskbObjs,
        rtRates,
        getRtRates,
        getZskb,
        removeKanban,
        addKanban
    }
});