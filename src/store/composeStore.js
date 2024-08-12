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
    const noteObjs = ref([])
    const noteReportObjs = ref([])

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

    async function getFundNotes4Edit() {
        try {
            const response = await axiosInst.get("api/get-fund-notes/single")
            if (response.status == 200) {
                let _ret_objs = await response.data;
                for (let _key in _ret_objs) {
                    let full_comments = ''
                    if (_ret_objs[_key].hasOwnProperty('note_objs') && _ret_objs[_key]['note_objs'].length > 0) {
                        for (let idx = 0; idx < _ret_objs[_key]['note_objs'].length; idx++) {
                            full_comments += _ret_objs[_key]['note_objs'][idx]['date_str'] + " " + _ret_objs[_key]['note_objs'][idx]['perc_str'] + " " + _ret_objs[_key]['note_objs'][idx]['comments']
                            if (idx != _ret_objs[_key]['note_objs'].length - 1) {
                                full_comments += " &#10;"
                            }
                        }
                    }
                    const div = document.createElement('div')
                    div.innerHTML = full_comments;
                    _ret_objs[_key]['full_comments'] = div.innerHTML;
                }
                noteObjs.value = _ret_objs;
            } else {
                console.error("axios get all writing notes failed: ", response)
                noteObjs.value = []
            }
        } catch (error) {
            console.log("axios get all writing notes error: ", error)
            noteObjs.value = []
        }
    }

    async function getFundNotes4Report() {
        try {
            const response = await axiosInst.get("api/get-fund-notes/all")
            if (response.status == 200) {
                noteReportObjs.value = await response.data;
            } else {
                console.error("axios get all combined notes failed: ", response)
                noteReportObjs.value = []
            }
        } catch (error) {
            console.log("axios get all combined notes error: ", error)
            noteReportObjs.value = []
        }
    }

    async function updateFundNotes(rowObj) {
        try {
            const response = await axiosInst.post("api/add-or-update-fund-notes", {
                'fund_id': rowObj['fund_id'],
                'fund_name': rowObj['fund_name'],
                'write_note_date': rowObj['write_note_date'],
                'write_note_perc': (!rowObj['write_note_perc'] || rowObj['write_note_perc'].trim() == '')?'-999%' : rowObj['write_note_perc'],
                'write_note_comments': rowObj['write_note_comments']
            })
            if (response.status == 200) {
                // await response.data
                useApiStore().pop_alert_msg("写入日记成功: " + rowObj['fund_name'])
                await getFundNotes4Edit()
                await getFundNotes4Report()
            } else {
                console.error("axios add or update note failed: ", response)
            }
        } catch (error) {
            console.log("axios add or update note error: ", error)
        }
    }

    async function removeFundNotes(rowObj) {
        try {
            const response = await axiosInst.post("api/remove-fund-notes", {
                'fund_id': rowObj['fund_id'],
                'fund_name': rowObj['fund_name'],
                'write_note_date': rowObj['write_note_date']
            })
            if (response.status == 200) {
                // await response.data
                useApiStore().pop_alert_msg("删除日记成功: " + rowObj['fund_name'])
                await getFundNotes4Edit()
                await getFundNotes4Report()
            } else {
                console.error("axios remove note failed: ", response)
            }
        } catch (error) {
            console.log("axios remove note error: ", error)
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
        noteObjs,
        noteReportObjs,
        getAllCompose,
        addOrRemoveCompose,
        setComposeProperty,
        setComposeSoldDate,
        getComposeFixedHold,
        getFundNotes4Edit,
        getFundNotes4Report,
        updateFundNotes,
        removeFundNotes
    }
});