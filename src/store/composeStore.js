import {defineStore} from 'pinia'
import {axiosInst} from "../lib/api.js";
import {ref, watch} from 'vue'
import { useApiStore } from './apiStore.js';

export const useComposeStore = defineStore('compose-store', () => {

    // state
    const composeObjs = ref([])
    const fixedHoldObjs = ref([])
    const totMoney = ref(0)
    const totPositiveNum = ref(0)
    const totPoleNum = ref(0)
    const totEarnMoney = ref(0)
    const totEarnRate = ref(null)
    const totSetBuy = ref(0)
    const totPlanBuy = ref(0)
    const diffBuySet = ref(0)

    // action
    async function getAllCompose() {
        try {
            const response = await axiosInst.get("dt-plans/api/compose/get-all-compose")
            if (response.status == 200) {
                composeObjs.value = await response.data;
            } else {
                console.error("axios get all compose failed: ", response)
                composeObjs.value = []
            }
        } catch (error) {
            console.log("axios get all compose error: ", error)
            composeObjs.value = []
        }
    }

    async function addOrRemoveCompose(_fund_id, _fund_name, _compose_name, _plan_money = 30) {
        try {
            const response = await axiosInst.post("dt-plans/api/compose/update-compose", {
                'fund_id': _fund_id,
                'fund_name': _fund_name,
                'compose_name': _compose_name,
                'plan_money': _plan_money
            })
            if (response.status == 200) {
                // await response.data
                useApiStore().pop_alert_msg("加入/移除组合成功: " + _fund_name)
                await getAllCompose()
            } else {
                console.error("axios add/remove compose failed: ", response)
            }
        } catch (error) {
            console.log("axios add/remove compose error: ", error)
        }
    }

    async function setComposeProperty(_fund_id, _fund_name, _compose_name, _money, _buyin_source) {
        try {
            const response = await axiosInst.post("dt-plans/api/compose/set-compose-prop", {
                'fund_id': _fund_id,
                'fund_name': _fund_name,
                'compose_name': _compose_name,
                'money': _money,
                'buyin_source': _buyin_source,
                'set_sold_date': 'F'
            })
            if (response.status == 200) {
                // await response.data
                useApiStore().pop_alert_msg("更改组合成功: " + _fund_name)
                await getAllCompose()
            } else {
                console.error("axios set compose property failed: ", response)
            }
        } catch (error) {
            console.log("axios set compose property error: ", error)
        }
    }

    async function setComposeSoldDate(_fund_id, _fund_name, _compose_name, _money, _buyin_source) {
        try {
            const response = await axiosInst.post("dt-plans/api/compose/set-compose-prop", {
                'fund_id': _fund_id,
                'fund_name': _fund_name,
                'compose_name': _compose_name,
                'money': _money,
                'buyin_source': _buyin_source,
                'set_sold_date': 'T'
            })
            if (response.status == 200) {
                // await response.data
                useApiStore().pop_alert_msg("设置组合卖出成功: " + _fund_name)
                await getAllCompose()
            } else {
                console.error("axios set compose sold date failed: ", response)
            }
        } catch (error) {
            console.log("axios set compose sold date error: ", error)
        }
    }

    async function getComposeFixedHold(_compose_name) {
        try {
            const response = await axiosInst.get("dt-plans/api/compose/fixed_hold_objs/" + _compose_name)
            if (response.status == 200) {
                fixedHoldObjs.value = await response.data;
            } else {
                console.error("axios get compose fixed hold failed: ", response)
                fixedHoldObjs.value = []
            }
        } catch (error) {
            console.log("axios get compose fixed hold error: ", error)
            fixedHoldObjs.value = []
        }
    }

    return {
        composeObjs,
        fixedHoldObjs,
        totMoney,
        totPositiveNum,
        totPoleNum,
        totEarnMoney,
        totEarnRate,
        totSetBuy,
        totPlanBuy,
        diffBuySet,
        getAllCompose,
        addOrRemoveCompose,
        setComposeProperty,
        setComposeSoldDate,
        getComposeFixedHold
    }
});