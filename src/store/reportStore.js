import {defineStore} from 'pinia'
import {axiosInst} from "../lib/api.js";
import {ref, watch} from 'vue'
import { useApiStore } from './apiStore.js';
import {useComposeStore} from "./composeStore.js";
import {storeToRefs} from 'pinia'
import {getTodayStr} from "../lib/commonUtils.js";

export const useReportStore = defineStore('report-store', () => {
    // state
    const dynRecordObjs = ref([])
    const retroFundObj = ref(null)
    const fixedFundObjs = ref([])
    const fixedHoldObjs = ref([])
    const fixed_status_data_obj = ref(null)
    const indexRtRateObjs = ref(null)

    const composeStore = useComposeStore()
    const {composeObjs} = storeToRefs(composeStore)

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
                dynRecordObjs.value.forEach(elem => {
                    if (elem['soldHistoryWrapper'] && elem['soldHistoryWrapper'].length > 0) {
                        let _soldHistoryWrapper = [...elem['soldHistoryWrapper']] //JSON.parse(JSON.stringify(elem['soldHistoryWrapper']))
                        elem['soldHistoryWrapper_reverse'] = _soldHistoryWrapper.reverse()
                    } else {
                        elem['soldHistoryWrapper_reverse'] = []
                    }
                })
            } else {
                console.error("axios get records and rates failed: ", response)
                dynRecordObjs.value = []
            }
        } catch (error) {
            console.log("axios get records and rates failed: ", error)
            dynRecordObjs.value = []
        }
    }

    async function getRetroFunds() {
        try {
            const response = await axiosInst.get("api/probe-funds/retro-funds/unfilter")
            if (response.status === 200) {
                retroFundObj.value = await response.data
            } else {
                console.error("axios get retro funds failed: ", response)
                retroFundObj.value = []
            }
        } catch (error) {
            console.log("axios get retro funds failed: ", error)
            retroFundObj.value = []
        }
    }

    async function getFixedFunds() {
        try {
            const response = await axiosInst.get("api/fixed-funds")
            if (response.status === 200) {
                fixedFundObjs.value = await response.data
            } else {
                console.error("axios get fixed funds failed: ", response)
                fixedFundObjs.value = []
            }
        } catch (error) {
            console.log("axios get fixed funds failed: ", error)
            fixedFundObjs.value = []
        }
    }

    async function getAllComposeFixedHold(_compose_name) {
        try {
            const response = await axiosInst.get("dt-plans/api/compose/fixed_hold_objs/all")
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

    async function getBigPoolFixedHold() {
        fixed_status_data_obj.value = null
        let db;
        let _storage_name = 'fixed-hold-buyin';
        const request = indexedDB.open(_storage_name, 1);
        request.onsuccess = function(event) {
            db = event.target.result;
            console.log("open data base successfully: ", _storage_name);
            let transaction = db.transaction([_storage_name], "readwrite");
            let objectStore = transaction.objectStore(_storage_name);
            let _date_str = getTodayStr();
            let _req_qry = objectStore.get(_date_str);
            _req_qry.onsuccess = function (event) {
                let _data_objs = event.target.result.content;
                db.close();
                console.log("*** reportStore ***, query success: ", _data_objs)
                let _temp_obj = new Object;
                for (let idx = 0; idx < _data_objs.length; idx++) {
                    let _fund_id = _data_objs[idx]['fund_id']
                    let _tot_money = null
                    let _tot_rate_str = null
                    let _tot_rate = null
                    if (_data_objs[idx].hasOwnProperty('hold_objs') && _data_objs[idx]['hold_objs'] && _data_objs[idx]['hold_objs'].length > 0) {
                        _tot_money = _data_objs[idx]['hold_objs'][_data_objs[idx]['hold_objs'].length - 1]['accu_money']
                        _tot_rate_str = _data_objs[idx]['hold_objs'][_data_objs[idx]['hold_objs'].length - 1]['accu_pure_percent_str']
                        _tot_rate = _data_objs[idx]['hold_objs'][_data_objs[idx]['hold_objs'].length - 1]['accu_pure_percent']
                    }
                    _temp_obj[_fund_id] = new Object
                    _temp_obj[_fund_id]['tot_money'] = _tot_money
                    _temp_obj[_fund_id]['tot_rate'] = _tot_rate
                    _temp_obj[_fund_id]['tot_rate_str'] = _tot_rate_str
                }
                fixed_status_data_obj.value = _temp_obj
            }
            _req_qry.onerror = function (event) {
                console.error("*** reportStore *** query data base failed: ", _storage_name, event);
                db.close();
            }
        };
        request.onerror = function(event) {
            console.error("*** reportStore *** open data base failed: ", _storage_name, event);
        };
        request.onupgradeneeded = function(event) {
            console.error("*** reportStore *** onupgradeneeded: ", _storage_name, event);
        };
    }

    async function getIndexRtRate() {
        try {
            const response = await axiosInst.get("api/get-rt-index-rates")
            if (response.status == 200) {
                indexRtRateObjs.value = await response.data;
            } else {
                console.error("axios get index rt rate failed: ", response)
                indexRtRateObjs.value = []
            }
        } catch (error) {
            console.log("axios get index rt rate error: ", error)
            indexRtRateObjs.value = []
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

    watch([dynRecordObjs, retroFundObj, fixedFundObjs, composeObjs, fixedHoldObjs, fixed_status_data_obj, indexRtRateObjs], () => {
        //console.log("watch in report store: ", dynRecordObjs.value, retroFundObj.value, fixedFundObjs.value, composeObjs.value, fixedHoldObjs.value, fixed_status_data_obj.value)
        if (!dynRecordObjs.value || dynRecordObjs.value.length === 0) {
            console.warn("*** reportStore *** bypass as dynRecordObjs is null")
            return
        } else if (!retroFundObj.value) {
            console.warn("*** reportStore *** bypass as retroFundObj is null")
            return
        } else if (!fixedFundObjs.value || fixedFundObjs.value.length === 0) {
            console.warn("*** reportStore *** bypass as fixedFundObjs is null")
            return
        } else if (!composeObjs.value || composeObjs.value.length === 0) {
            console.warn("*** reportStore *** bypass as composeObjs is null")
            return
        } else if (!fixedHoldObjs.value || fixedHoldObjs.value.length === 0) {
            console.warn("*** reportStore *** bypass as fixedHoldObjs is null")
            return
        } else if (!fixed_status_data_obj.value) {
            console.warn("*** reportStore *** bypass as fixed_status_data_obj is null")
            return
        } else if (!indexRtRateObjs.value) {
            console.warn("*** reportStore *** bypass as indexRtRateObjs is null")
            return
        }
        console.log("*** reportStore *** dynRecordObjs: ", dynRecordObjs.value)
        console.log("*** reportStore *** retroFundObj: ", retroFundObj.value)
        console.log("*** reportStore *** fixedFundObjs: ", fixedFundObjs.value)
        console.log("*** reportStore *** composeObjs: ", composeObjs.value)
        console.log("*** reportStore *** fixedHoldObjs: ", fixedHoldObjs.value)
        console.log("*** reportStore *** fixed_status_data_obj: ", fixed_status_data_obj.value)
        console.log("*** reportStore *** indexRtRateObjs: ", indexRtRateObjs.value)

        dynRecordObjs.value.forEach(elem => {
            elem['show_summ_tip'] = false;
            let _tranStateObj = new Object
            elem['tranStateObj'] = _tranStateObj
            let fund_id = elem['fund_id']
            const fixed_func = fixed_obj => fixed_obj['fund_id'] === fund_id
            let _fixed_idx = fixedFundObjs.value.findIndex(fixed_func)
            if (_fixed_idx !== -1) {
                _tranStateObj['compose_plan'] = 'bigpool'
                _tranStateObj['money'] = fixedFundObjs.value[_fixed_idx]['money']
                const index_func = index_obj => index_obj['fund_id'] === fund_id
                let _index_idx = retroFundObj.value['index_objs'].findIndex(index_func)
                if (_index_idx === -1) {
                    console.error("Internal Error, can Not find index obj in retroFundObjs: ", fund_id)
                } else {
                    _tranStateObj['orig_summ_level'] = retroFundObj.value['index_objs'][_index_idx]['summ_level']
                }
                if (!retroFundObj.value['index_global_pe_obj'].hasOwnProperty(fund_id)) {
                    console.error("Internal Error, can Not find global pe obj in retroFundObjs: ", fund_id)
                } else {
                    _tranStateObj['subs_summ_level'] = retroFundObj.value['index_global_pe_obj'][fund_id]['summ_level']
                }
                if (!fixed_status_data_obj.value.hasOwnProperty(fund_id)) {
                    console.error("Internal Error, can Not find fixed hold obj in fixed_status_data_obj: ", fund_id)
                    _tranStateObj['tot_money'] = null
                    _tranStateObj['tot_rate'] = null
                    _tranStateObj['tot_rate_str'] = null
                } else {
                    _tranStateObj['tot_money'] = fixed_status_data_obj.value[fund_id]['tot_money']
                    _tranStateObj['tot_rate'] = fixed_status_data_obj.value[fund_id]['tot_rate']
                    _tranStateObj['tot_rate_str'] = fixed_status_data_obj.value[fund_id]['tot_rate_str']
                }
            } else {
                let _found_in_compose = false
                for (let _one_comp of composeObjs.value) {
                    const comp_func = comp_obj => comp_obj['fund_id'] === fund_id
                    let _comp_idx = _one_comp['compose_objs'].findIndex(comp_func)
                    if (_comp_idx !== -1) {
                        _tranStateObj['compose_plan'] = _one_comp['compose_name']
                        _tranStateObj['money'] = _one_comp['compose_objs'][_comp_idx]['money']
                        _found_in_compose = true
                        break
                    }
                }
                if (!_found_in_compose) {
                    console.error("Internal Error, can Not find in compose: ", fund_id)
                    _tranStateObj['compose_plan'] = ""
                    _tranStateObj['money'] = null
                }
                const hold_func = hold_obj => hold_obj['fund_id'] === fund_id
                let _hold_idx = fixedHoldObjs.value.findIndex(hold_func)
                if (_hold_idx !== -1) {
                    let _hold_objs = fixedHoldObjs.value[_hold_idx]['hold_objs']
                    _tranStateObj['tot_money'] = _hold_objs[_hold_objs.length - 1]['accu_money']
                    _tranStateObj['tot_rate'] = _hold_objs[_hold_objs.length - 1]['accu_pure_percent']
                    _tranStateObj['tot_rate_str'] = _hold_objs[_hold_objs.length - 1]['accu_pure_percent_str']
                } else {
                    console.error("Internal Error, can Not find in compose hold: ", fund_id)
                    _tranStateObj['tot_money'] = null
                    _tranStateObj['tot_rate'] = null
                    _tranStateObj['tot_rate_str'] = null
                }
            }
            const rate_func = rate_obj => rate_obj['fund_id'] === fund_id
            let _rate_idx = indexRtRateObjs.value['current_rates'].findIndex(rate_func)
            if (_rate_idx !== -1) {
                _tranStateObj['rate_val'] = indexRtRateObjs.value['current_rates'][_rate_idx]['rate_val']
                _tranStateObj['rate_str'] = indexRtRateObjs.value['current_rates'][_rate_idx]['rate_str']
            } else {
                _tranStateObj['rate_val'] = null
                _tranStateObj['rate_str'] = null
            }
        })
    }, {immediate: true})

    return {
        dynRecordObjs,
        retroFundObj,
        fixedFundObjs,
        fixedHoldObjs,
        fixed_status_data_obj,
        indexRtRateObjs,
        requireDynValues,
        getRecordsAndRates,
        getRetroFunds,
        getFixedFunds,
        getAllComposeFixedHold,
        getBigPoolFixedHold,
        getIndexRtRate,
        removeLocalDynvalue
    }
});