import {defineStore} from 'pinia'
import {axiosInst} from "../lib/api.js";
import {ref, watch, toRaw} from 'vue'
import { useApiStore } from './apiStore.js';
import {useComposeStore} from "./composeStore.js";
import {storeToRefs} from 'pinia'
import {getTodayStr} from "../lib/commonUtils.js";

export const useReportStore = defineStore('report-store', () => {
    // state
    const dynRecordObjs = ref([])
    const dynRecordObjs_full = ref([])
    const dynRecordObjs_latest = ref([])
    const onlyShowLatest = ref(false)
    const report_select = ref('all')
    const reportObjsReloaded = ref(false)    
    const retroFundObj = ref(null)
    const fixedFundObjs = ref([])
    const fixedHoldObjs = ref([])
    const fixed_status_data_obj = ref(null)
    const indexRtRateObjs = ref(null)
    const removedDateObjs = ref([])

    const composeStore = useComposeStore()
    const {composeObjs} = storeToRefs(composeStore)

    const sync_in_progress = ref(false)
    const latest_sold_stat_obj = ref(null)
    const objsTransFlag = ref(false)
    const fundBuyWeight = ref({})

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

    async function syncServerData() {
        if (sync_in_progress.value) {
            useApiStore().push_error_msg("浏览器数据", " 正在清除中，请等待一会儿再试")
            return;
        }
        sync_in_progress.value = true;
        // clean indexedDB
        useApiStore().clean_today_data("fixed-hold-buyin", function(_ret_flag, _db) {
            _db.close();
            if (_ret_flag) {
                console.log("clean fixed-hold-buyin successfully");
            }
            useApiStore().clean_today_data("subs-good-funds", function(_ret_flag, _db) {
                _db.close();
                if (_ret_flag) {
                    console.log("clean subs-good-funds successfully");
                }
                useApiStore().clean_today_data("fund-report-objs", function(_ret_flag, _db) {
                    _db.close();
                    if (_ret_flag) {
                        console.log("clean fund-report-objs successfully");
                    }
                    useApiStore().clean_today_data("compose-hold-buyin", function(_ret_flag, _db) {
                        _db.close();
                        if (_ret_flag) {
                            console.log("clean compose-hold-buyin successfully");
                        }
                    });
                });            
            });            
        });
        alert("后台开始加载数据，需要等待一段时间")
        await getRecordsAndRates('refresh');
        sync_in_progress.value = false;
        useApiStore().pop_alert_msg("请手动刷新浏览器，获取更新数据");    
    }

    function get_today_str() {
        Date.prototype.Format = function(fmt) {
            var o = {
                "M+": this.getMonth() + 1,
                "d+": this.getDate(),
                "h+": this.getHours(),
                "m+": this.getMinutes(),
                "s+": this.getSeconds(),
                "q+": Math.floor((this.getMonth() + 3) / 3),
                "S": this.getMilliseconds()
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }
        return new Date().Format("yyyy-MM-dd");
    }

    function insert_raw_date(_index_db, objectStore, _item_data, _storage_name) {
        var request = objectStore.add(_item_data);
        request.onsuccess = function(event) {
            console.log("insert ", _storage_name, " storage successfully");
            _index_db.close();
            //postMessage("new");
        };
        request.onerror = function(event) {
            console.error("insert ", _storage_name, " storage failed");
        };        
    }

    function insert_in_db_force(_index_db, _item_data, _storage_name) {
        var transaction = _index_db.transaction([_storage_name], "readwrite");
        var objectStore = transaction.objectStore(_storage_name);
        var _date_str = get_today_str();
        var _req_qry = objectStore.get(_date_str);
        _req_qry.onsuccess = function (event) {
            var _req_cln = objectStore.delete(_date_str);
            _req_cln.onsuccess = function (event) {
                console.log("reportStore insert_in_db_force, successfully delete key: ", _date_str);
                insert_raw_date(_index_db, objectStore, _item_data, _storage_name);
            }
            _req_cln.onerror = function (event) {
                console.warn("reportStore insert_in_db_force, failed delete key: ", _date_str);
                insert_raw_date(_index_db, objectStore, _item_data, _storage_name);
            }
        }
        _req_qry.onerror = function (event) {
            console.warn("reportStore insert_in_db_force, query old key failed: ", _date_str);
            insert_raw_date(_index_db, objectStore, _item_data, _storage_name);
        }
    }

    function add_in_db(_raw_data, _storage_name) {
        var db;
        const request = indexedDB.open(_storage_name, 1);
        request.onsuccess = function(event) {
            db = event.target.result;
            console.log("open data base successfully: ", _storage_name);
    
            var _date_str = get_today_str();
            var _item_data = {
                'date_str': _date_str,
                'content': _raw_data
            }
            insert_in_db_force(db, _item_data, _storage_name);
        };
        request.onerror = function(event) {
            console.error("open data base failed: ", _storage_name);
        };
        request.onupgradeneeded = function(event) {
            console.log("onupgradeneeded: ", _storage_name);
            db = event.target.result;
            var objectStore;
            objectStore = db.createObjectStore(_storage_name, {
                keyPath: 'date_str'
            });
        };
    };

    // TODO: compare to get index
    // remove old index, insert at this index
    // insert into indexDB (ref: fetch-big-data.js)
    // add_in_db(_ret_objs, "fund-report-objs");
    async function getRecordsAndRates(_refresh_or_fund_id) {
        try {
            //dynRecordObjs_full.value = []
            //dynRecordObjs_latest.value = []

            const response = await axiosInst.get("dt-plans/api/get-fund-records-rate/" + _refresh_or_fund_id)
            if (response.status === 200) {
                const _response = await response.data
                if (typeof _refresh_or_fund_id !== 'undefined' && _refresh_or_fund_id != null
                    && _refresh_or_fund_id.length === 6 && _response['full'].length === 1) {
                    let _single_full = _response['full']
                    let _single_latest = _response['latest']
                    _single_full.forEach(elem => {
                        if (elem['soldHistoryWrapper'] && elem['soldHistoryWrapper'].length > 0) {
                            let _soldHistoryWrapper = [...elem['soldHistoryWrapper']] //JSON.parse(JSON.stringify(elem['soldHistoryWrapper']))
                            elem['soldHistoryWrapper_reverse'] = _soldHistoryWrapper.reverse()
                        } else {
                            elem['soldHistoryWrapper_reverse'] = []
                        }
                    })
                    _single_latest.forEach(elem => {
                        if (elem['soldHistoryWrapper'] && elem['soldHistoryWrapper'].length > 0) {
                            let _soldHistoryWrapper = [...elem['soldHistoryWrapper']] //JSON.parse(JSON.stringify(elem['soldHistoryWrapper']))
                            elem['soldHistoryWrapper_reverse'] = _soldHistoryWrapper.reverse()
                        } else {
                            elem['soldHistoryWrapper_reverse'] = []
                        }
                    })
                    let _single_full_one = _single_full[0]
                    let _single_latest_one = _single_latest[0]

                    let _temp_full_objs = dynRecordObjs_full.value
                    let _idx_full = _temp_full_objs.findIndex(elem => elem['fund_id'] === _single_full_one['fund_id'])
                    if (_idx_full === -1) {
                        console.error("Internal error findIndex single_full: ", _single_full_one['fund_id']);
                    } else {
                        _temp_full_objs.splice(_idx_full, 1, _single_full_one )
                    }

                    let _temp_latest_objs = dynRecordObjs_latest.value
                    let _idx_latest = _temp_latest_objs.findIndex(elem => elem['fund_id'] === _single_latest_one['fund_id'])
                    if (_idx_latest === -1) {
                        console.error("Internal error findIndex single_latest: ", _single_latest_one['fund_id']);
                    } else {
                        _temp_latest_objs.splice(_idx_latest, 1, _single_latest_one)
                    }

                    dynRecordObjs_full.value = _temp_full_objs
                    dynRecordObjs_latest.value = _temp_latest_objs

                    let _storage_name = "fund-report-objs"
                    let _ret_objs = {
                        'full': dynRecordObjs_full.value,
                        'latest': dynRecordObjs_latest.value
                    }
                    let _raw_objs = JSON.parse(JSON.stringify(_ret_objs));
                    add_in_db(_raw_objs, _storage_name);
                } else {
                    dynRecordObjs_full.value = _response['full']
                    dynRecordObjs_latest.value = _response['latest']
                    if (dynRecordObjs_full.value.length > 0) {
                        dynRecordObjs_full.value.forEach(elem => {
                            if (elem['soldHistoryWrapper'] && elem['soldHistoryWrapper'].length > 0) {
                                let _soldHistoryWrapper = [...elem['soldHistoryWrapper']] //JSON.parse(JSON.stringify(elem['soldHistoryWrapper']))
                                elem['soldHistoryWrapper_reverse'] = _soldHistoryWrapper.reverse()
                            } else {
                                elem['soldHistoryWrapper_reverse'] = []
                            }
                        })
                    }
                    if (dynRecordObjs_latest.value.length > 0) {
                        dynRecordObjs_latest.value.forEach(elem => {
                            if (elem['soldHistoryWrapper'] && elem['soldHistoryWrapper'].length > 0) {
                                let _soldHistoryWrapper = [...elem['soldHistoryWrapper']] //JSON.parse(JSON.stringify(elem['soldHistoryWrapper']))
                                elem['soldHistoryWrapper_reverse'] = _soldHistoryWrapper.reverse()
                            } else {
                                elem['soldHistoryWrapper_reverse'] = []
                            }
                        })
                    }
                }
            } else {
                console.error("axios get records and rates failed: ", response)
                dynRecordObjs_full.value = []
                dynRecordObjs_latest.value = []
            }
        } catch (error) {
            console.log("axios get records and rates failed: ", error)
            dynRecordObjs_full.value = []
            dynRecordObjs_latest.value = []
        }
    }

    function getRecordsAndRatesFromWorker() {
        let db;
        let _storage_name = 'fund-report-objs';
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
                //console.log("*** reportStore ***, query success: ", _data_objs)

                let dynRecordObjs_full_value = _data_objs['full']
                let dynRecordObjs_latest_value = _data_objs['latest']

                dynRecordObjs_full_value.forEach(elem => {
                    if (elem['soldHistoryWrapper'] && elem['soldHistoryWrapper'].length > 0) {
                        let _soldHistoryWrapper = [...elem['soldHistoryWrapper']] //JSON.parse(JSON.stringify(elem['soldHistoryWrapper']))
                        elem['soldHistoryWrapper_reverse'] = _soldHistoryWrapper.reverse()
                    } else {
                        elem['soldHistoryWrapper_reverse'] = []
                    }
                })
                dynRecordObjs_latest_value.forEach(elem => {
                    if (elem['soldHistoryWrapper'] && elem['soldHistoryWrapper'].length > 0) {
                        let _soldHistoryWrapper = [...elem['soldHistoryWrapper']] //JSON.parse(JSON.stringify(elem['soldHistoryWrapper']))
                        elem['soldHistoryWrapper_reverse'] = _soldHistoryWrapper.reverse()
                    } else {
                        elem['soldHistoryWrapper_reverse'] = []
                    }
                })

                let _latest_sold_stat_obj = new Object
                for (var _idx = 0; _idx < dynRecordObjs_full_value.length; _idx++) {
                    var _obj = dynRecordObjs_full_value[_idx];
                    var _fund_id = _obj['fund_id']
                    if (!_obj['soldList4draw'] || _obj['soldList4draw'].length === 0) {
                    } else {
                        _latest_sold_stat_obj[_fund_id] = {
                            'days_from_last_sold': _obj['statistics']['days_from_last_sold'],
                            'rate_from_last_sold': _obj['statistics']['rate_from_last_sold'],
                            'rate_from_last_sold_str': _obj['statistics']['rate_from_last_sold_str']
                        }
                    }
                }
                dynRecordObjs_full.value = dynRecordObjs_full_value
                dynRecordObjs_latest.value = dynRecordObjs_latest_value
                latest_sold_stat_obj.value = _latest_sold_stat_obj            
            }
            _req_qry.onerror = function (event) {
                console.error("*** reportStore *** query data base failed: ", _storage_name, event);
                db.close();
                dynRecordObjs_full.value = []
                dynRecordObjs_latest.value = []
            }
        };
        request.onerror = function(event) {
            console.error("*** reportStore *** open data base failed: ", _storage_name, event);
            dynRecordObjs_full.value = []
            dynRecordObjs_latest.value = []            
        };
        request.onupgradeneeded = function(event) {
            console.error("*** reportStore *** onupgradeneeded: ", _storage_name, event);
            dynRecordObjs_full.value = []
            dynRecordObjs_latest.value = []            
        };
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

    async function getAllComposeFixedHold() {
        // try {
        //     const response = await axiosInst.get("dt-plans/api/compose/fixed_hold_objs/all")
        //     if (response.status == 200) {
        //         fixedHoldObjs.value = await response.data;
        //     } else {
        //         console.error("axios get compose fixed hold failed: ", response)
        //         fixedHoldObjs.value = []
        //     }
        // } catch (error) {
        //     console.log("axios get compose fixed hold error: ", error)
        //     fixedHoldObjs.value = []
        // }
    }

    async function getAllComposeFixedHoldFromWorker() {
        let db;
        let _storage_name = 'compose-hold-buyin';
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
                //console.log("*** reportStore ***, query success: ", _data_objs)
                fixedHoldObjs.value = _data_objs           
            }
            _req_qry.onerror = function (event) {
                console.error("*** reportStore *** query data base failed: ", _storage_name, event);
                db.close();
                fixedHoldObjs.value = []
            }
        };
        request.onerror = function(event) {
            console.error("*** reportStore *** open data base failed: ", _storage_name, event);
            fixedHoldObjs.value = []
        };
        request.onupgradeneeded = function(event) {
            console.error("*** reportStore *** onupgradeneeded: ", _storage_name, event);
            fixedHoldObjs.value = []
        };        
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
                //console.log("*** reportStore ***, query success: ", _data_objs)
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

    // this function is useless now...
    async function removeLocalDynvalue(_fund_id, _fund_name) {
        try {
            const response = await axiosInst.post("dt-plans/api/remove-dynValues/" + _fund_id)
            if (response.status === 200) {
                useApiStore().pop_alert_msg("删除报告成功: " + _fund_name)
                //await getRecordsAndRates('refresh')
            } else {
                console.error("axios remove local dyn values failed: ", response)
            }
        } catch (error) {
            console.log("axios remove local dyn values failed: ", error)
        }
    }

    async function removeDate4Report(oneRow, remove_date_type) {
        try {
            const response = await axiosInst.post("dt-plans/api/remove-date-4-report", {
                'fund_id': oneRow['fund_id'],
                'fund_name': oneRow['fund_name'],
                'remove_date': oneRow['remove_asc_or_desc_or_sold_date'],
                'remove_date_type': remove_date_type
            })
            if (response.status === 200) {
                useApiStore().pop_alert_msg("删除指定日期成功: " + oneRow['fund_name'])
                await getRecordsAndRates(oneRow['fund_id'])
            } else {
                console.error("axios remove date for report failed: ", response)
            }
        } catch (error) {
            console.log("axios remove date for report failed: ", error)
        }
    }

    async function getRemovedDate4Report() {
        try {
            const response = await axiosInst.get("dt-plans/api/get-removed-dates")
            if (response.status == 200) {
                removedDateObjs.value = await response.data;
            } else {
                console.error("axios get removed dates failed: ", response)
                removedDateObjs.value = []
            }
        } catch (error) {
            console.log("axios get removed dates error: ", error)
            removedDateObjs.value = []
        }
    }

    function tranReportObjs(dynRecordObjs, retroFundObj, fixedFundObjs, composeObjs, fixedHoldObjs, fixed_status_data_obj, indexRtRateObjs/*, removedDateObjs*/) {
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
                    console.warn("Internal Error, can Not find index obj in retroFundObjs: ", fund_id)
                } else {
                    _tranStateObj['orig_summ_level'] = retroFundObj.value['index_objs'][_index_idx]['summ_level']
                }
                if (!retroFundObj.value['index_global_pe_obj'].hasOwnProperty(fund_id)) {
                    console.warn("Internal Error, can Not find global pe obj in retroFundObjs: ", fund_id)
                } else {
                    _tranStateObj['subs_summ_level'] = retroFundObj.value['index_global_pe_obj'][fund_id]['summ_level']
                }
                if (!fixed_status_data_obj.value.hasOwnProperty(fund_id)) {
                    console.warn("Internal Error, can Not find fixed hold obj in fixed_status_data_obj: ", fund_id)
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
                    console.warn("Internal Error, can Not find in compose: ", fund_id)
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
                    //console.warn("Internal Error, can Not find in compose hold: ", fund_id)
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
    }

    watch ([onlyShowLatest, report_select, dynRecordObjs_latest, dynRecordObjs_full, 
        retroFundObj, fixedFundObjs, composeObjs, fixedHoldObjs, fixed_status_data_obj, indexRtRateObjs/*, removedDateObjs*/], () => {
        if (!dynRecordObjs_latest.value || dynRecordObjs_latest.value.length === 0) {
            console.warn("*** reportStore *** bypass as dynRecordObjs_latest is null, load from indexDB is inprogress?")
            return
        }
        if (!dynRecordObjs_full.value || dynRecordObjs_full.value.length === 0) {
            console.warn("*** reportStore *** bypass as dynRecordObjs_full is null, load from indexDB is inprogress?")
            return
        }
        if (!retroFundObj.value) {
            console.warn("*** reportStore *** bypass as retroFundObj is null")
            return
        }
        if (!fixedFundObjs.value || fixedFundObjs.value.length === 0) {
            console.warn("*** reportStore *** bypass as fixedFundObjs is null")
            return
        }
        if (!composeObjs.value || composeObjs.value.length === 0) {
            console.warn("*** reportStore *** bypass as composeObjs is null")
            return
        }
        if (!fixedHoldObjs.value || fixedHoldObjs.value.length === 0) {
            console.warn("*** reportStore *** bypass as fixedHoldObjs is null")
            return
        }
        if (!fixed_status_data_obj.value) {
            console.warn("*** reportStore *** bypass as fixed_status_data_obj is null")
            return
        }
        if (!indexRtRateObjs.value) {
            console.warn("*** reportStore *** bypass as indexRtRateObjs is null")
            return
        }
        // if (!removedDateObjs.value) {
        //     console.warn("*** reportStore *** bypass as removedDateObjs is null")
        //     return
        // }
        
        dynRecordObjs_latest.value.forEach(elem => {
            elem['currSelected'] = false
        })

        dynRecordObjs_full.value.forEach(elem => {
            elem['currSelected'] = false
        })

        if (!objsTransFlag.value) {
            tranReportObjs(dynRecordObjs_latest, retroFundObj, fixedFundObjs, composeObjs, fixedHoldObjs, fixed_status_data_obj, indexRtRateObjs);
            tranReportObjs(dynRecordObjs_full,   retroFundObj, fixedFundObjs, composeObjs, fixedHoldObjs, fixed_status_data_obj, indexRtRateObjs);
            objsTransFlag.value = true
        }

        if (report_select.value === 'all') {
            if (onlyShowLatest.value) {
                dynRecordObjs.value = dynRecordObjs_latest.value
            } else {
                dynRecordObjs.value = dynRecordObjs_full.value
            }
        } else if (report_select.value === 'only_sold') {
            if (onlyShowLatest.value) {
                let _filterObjs = dynRecordObjs_latest.value.filter((elem) => elem['soldList4draw'] && elem['soldList4draw'].length > 0);
                dynRecordObjs.value = _filterObjs
            } else {
                let _filterObjs = dynRecordObjs_full.value.filter((elem) => elem['soldList4draw'] && elem['soldList4draw'].length > 0);
                dynRecordObjs.value = _filterObjs
            }
        } else if (report_select.value === 'only_non_sold') {
            if (onlyShowLatest.value) {
                let _filterObjs = dynRecordObjs_latest.value.filter((elem) => !elem['soldList4draw'] || elem['soldList4draw'].length === 0);
                dynRecordObjs.value = _filterObjs
            } else {
                let _filterObjs = dynRecordObjs_full.value.filter((elem) => !elem['soldList4draw'] || elem['soldList4draw'].length === 0);
                dynRecordObjs.value = _filterObjs
            }
        } else if (report_select.value === 'only_asc') {
            if (onlyShowLatest.value) {
                let _filterObjs = dynRecordObjs_latest.value.filter((elem) => elem['statistics'] && 
                    elem['statistics'].hasOwnProperty('rate_from_last_sold') && 
                    elem['statistics']['rate_from_last_sold'] >= 0.01 && 
                    elem['soldList4draw'] && 
                    elem['soldList4draw'].length > 0);
                dynRecordObjs.value = _filterObjs
            } else {
                let _filterObjs = dynRecordObjs_full.value.filter((elem) => elem['statistics'] && 
                    elem['statistics'].hasOwnProperty('rate_from_last_sold') && 
                    elem['statistics']['rate_from_last_sold'] >= 0.01 && 
                    elem['soldList4draw'] && 
                    elem['soldList4draw'].length > 0);
                dynRecordObjs.value = _filterObjs
            }
        } else if (report_select.value === 'only_dsc') {
            if (onlyShowLatest.value) {
                let _filterObjs = dynRecordObjs_latest.value.filter((elem) => elem['statistics'] && 
                    elem['statistics'].hasOwnProperty('rate_from_last_sold') && 
                    elem['statistics']['rate_from_last_sold'] < 0 && 
                    elem['soldList4draw'] && 
                    elem['soldList4draw'].length > 0);
                dynRecordObjs.value = _filterObjs
            } else {
                let _filterObjs = dynRecordObjs_full.value.filter((elem) => elem['statistics'] && 
                    elem['statistics'].hasOwnProperty('rate_from_last_sold') && 
                    elem['statistics']['rate_from_last_sold'] < 0 && 
                    elem['soldList4draw'] && 
                    elem['soldList4draw'].length > 0);
                dynRecordObjs.value = _filterObjs
            }
        } else if (report_select.value === 'only_bigpool') {
            if (onlyShowLatest.value) {
                let _filterObjs = dynRecordObjs_latest.value.filter((elem) => elem['tranStateObj'] && 
                    elem['tranStateObj'].hasOwnProperty('compose_plan') && 
                    elem['tranStateObj']['compose_plan'] === 'bigpool');
                dynRecordObjs.value = _filterObjs
            } else {
                let _filterObjs = dynRecordObjs_full.value.filter((elem) => elem['tranStateObj'] && 
                    elem['tranStateObj'].hasOwnProperty('compose_plan') && 
                    elem['tranStateObj']['compose_plan'] === 'bigpool');
                dynRecordObjs.value = _filterObjs
            }
        } else if (report_select.value === 'only_ovtree') {
            if (onlyShowLatest.value) {
                let _filterObjs = dynRecordObjs_latest.value.filter((elem) => elem['tranStateObj'] && 
                    elem['tranStateObj'].hasOwnProperty('compose_plan') && 
                    elem['tranStateObj']['compose_plan'] === 'ovtree');
                dynRecordObjs.value = _filterObjs
            } else {
                let _filterObjs = dynRecordObjs_full.value.filter((elem) => elem['tranStateObj'] && 
                    elem['tranStateObj'].hasOwnProperty('compose_plan') && 
                    elem['tranStateObj']['compose_plan'] === 'ovtree');
                dynRecordObjs.value = _filterObjs
            }
        } else if (report_select.value === 'only_flyhorse') {
            if (onlyShowLatest.value) {
                let _filterObjs = dynRecordObjs_latest.value.filter((elem) => elem['tranStateObj'] && 
                    elem['tranStateObj'].hasOwnProperty('compose_plan') && 
                    elem['tranStateObj']['compose_plan'] === 'flyhorse');
                dynRecordObjs.value = _filterObjs
            } else {
                let _filterObjs = dynRecordObjs_full.value.filter((elem) => elem['tranStateObj'] && 
                    elem['tranStateObj'].hasOwnProperty('compose_plan') && 
                    elem['tranStateObj']['compose_plan'] === 'flyhorse');
                dynRecordObjs.value = _filterObjs
            }
        } else if (report_select.value === 'only_medusa') {
            if (onlyShowLatest.value) {
                let _filterObjs = dynRecordObjs_latest.value.filter((elem) => elem['tranStateObj'] && 
                    elem['tranStateObj'].hasOwnProperty('compose_plan') && 
                    elem['tranStateObj']['compose_plan'] === 'medusa');
                dynRecordObjs.value = _filterObjs
            } else {
                let _filterObjs = dynRecordObjs_full.value.filter((elem) => elem['tranStateObj'] && 
                    elem['tranStateObj'].hasOwnProperty('compose_plan') && 
                    elem['tranStateObj']['compose_plan'] === 'medusa');
                dynRecordObjs.value = _filterObjs
            }
        } else if (report_select.value === 'only_dolphin') {
            if (onlyShowLatest.value) {
                let _filterObjs = dynRecordObjs_latest.value.filter((elem) => elem['tranStateObj'] && 
                    elem['tranStateObj'].hasOwnProperty('compose_plan') && 
                    elem['tranStateObj']['compose_plan'] === 'dolphin');
                dynRecordObjs.value = _filterObjs
            } else {
                let _filterObjs = dynRecordObjs_full.value.filter((elem) => elem['tranStateObj'] && 
                    elem['tranStateObj'].hasOwnProperty('compose_plan') && 
                    elem['tranStateObj']['compose_plan'] === 'dolphin');
                dynRecordObjs.value = _filterObjs
            }
        } else if (report_select.value === 'only_trident') {
            if (onlyShowLatest.value) {
                let _filterObjs = dynRecordObjs_latest.value.filter((elem) => elem['tranStateObj'] && 
                    elem['tranStateObj'].hasOwnProperty('compose_plan') && 
                    elem['tranStateObj']['compose_plan'] === 'trident');
                dynRecordObjs.value = _filterObjs
            } else {
                let _filterObjs = dynRecordObjs_full.value.filter((elem) => elem['tranStateObj'] && 
                    elem['tranStateObj'].hasOwnProperty('compose_plan') && 
                    elem['tranStateObj']['compose_plan'] === 'trident');
                dynRecordObjs.value = _filterObjs
            }
        } else if (report_select.value === 'only_gdngoat') {
            if (onlyShowLatest.value) {
                let _filterObjs = dynRecordObjs_latest.value.filter((elem) => elem['tranStateObj'] && 
                    elem['tranStateObj'].hasOwnProperty('compose_plan') && 
                    elem['tranStateObj']['compose_plan'] === 'gdngoat');
                dynRecordObjs.value = _filterObjs
            } else {
                let _filterObjs = dynRecordObjs_full.value.filter((elem) => elem['tranStateObj'] && 
                    elem['tranStateObj'].hasOwnProperty('compose_plan') && 
                    elem['tranStateObj']['compose_plan'] === 'gdngoat');
                dynRecordObjs.value = _filterObjs
            }
        } else if (report_select.value === 'only_others') {
            if (onlyShowLatest.value) {
                let _filterObjs = dynRecordObjs_latest.value.filter((elem) => elem['tranStateObj'] && 
                    ( 
                        (elem['tranStateObj'].hasOwnProperty('compose_plan') && 
                        elem['tranStateObj']['compose_plan'] === '') || 
                        (!elem['tranStateObj'].hasOwnProperty('compose_plan') || 
                        !elem['tranStateObj']['compose_plan'])
                    ));
                dynRecordObjs.value = _filterObjs
            } else {
                let _filterObjs = dynRecordObjs_full.value.filter((elem) => elem['tranStateObj'] && 
                    ( 
                        (elem['tranStateObj'].hasOwnProperty('compose_plan') && 
                        elem['tranStateObj']['compose_plan'] === '') || 
                        (!elem['tranStateObj'].hasOwnProperty('compose_plan') || 
                        !elem['tranStateObj']['compose_plan'])
                    ));
                dynRecordObjs.value = _filterObjs
            }
        }
        reportObjsReloaded.value = true;
    })

    async function getFundBuyWeight() {
        try {
            const response = await axiosInst.get("dt-plans/api/get-fund-buy-weight")
            if (response.status == 200) {
                let _temp_arr_objs = await response.data;
                if (_temp_arr_objs && _temp_arr_objs.length > 0) {
                    _temp_arr_objs.forEach(elem => {
                        fundBuyWeight.value[elem['fund_id']] = elem['buy_weight']
                    })
                }
            } else {
                console.error("axios get fund buy weight failed: ", response)
                fundBuyWeight.value = {}
            }
        } catch (error) {
            console.log("axios get fund buy weight error: ", error)
            fundBuyWeight.value = {}
        }
    }

    // this function is useless now...
    async function setFundBuyWeight(_fund_id, _fund_name, _compose_plan, _op_type, _weight) {
        try {
            const response = await axiosInst.post("dt-plans/api/set-fund-buy-weight", {
                'fund_id': _fund_id,
                'fund_name': _fund_name,
                'compose_plan': _compose_plan,
                'op_type': _op_type,
                'new_weight': _weight
            })
            if (response.status === 200) {
                useApiStore().pop_alert_msg("设置权重成功: " + _fund_name)
                await getFundBuyWeight()
                alert("设置权重成功后，需要手动刷新相关页面，才能更新金额。")
            } else {
                console.error("axios set fund buy weight failed: ", response)
            }
        } catch (error) {
            console.log("axios set fund buy weight failed: ", error)
        }
    }

    return {
        dynRecordObjs,
        dynRecordObjs_full,
        dynRecordObjs_latest,
        onlyShowLatest,
        report_select,
        reportObjsReloaded,        
        retroFundObj,
        fixedFundObjs,
        fixedHoldObjs,
        fixed_status_data_obj,
        indexRtRateObjs,
        removedDateObjs,
        requireDynValues,
        latest_sold_stat_obj,
        fundBuyWeight,
        getRecordsAndRates,
        getRecordsAndRatesFromWorker,
        getRetroFunds,
        getFixedFunds,
        getAllComposeFixedHold,
        getAllComposeFixedHoldFromWorker,
        getBigPoolFixedHold,
        getIndexRtRate,
        removeLocalDynvalue,
        removeDate4Report,
        getRemovedDate4Report,
        syncServerData,
        getFundBuyWeight,
        setFundBuyWeight
    }
});