import {defineStore} from 'pinia'
import {axiosInst} from "../lib/api.js";
import {ref, watch} from 'vue'
import { useApiStore } from './apiStore.js';
import { getTodayStr} from "../lib/commonUtils.js";

export const useBuyInOutStore = defineStore('buyInOut-store', () => {

    // state
    const buyoutRecords = ref([])
    const buyout_records_map = ref({})
    const buyin_records = ref([])
    const wav_reports = ref([])

    // action
    async function getAllBuyoutRecords() {
        buyout_records_map.value = {}
        try {
            const response = await axiosInst.get("api/buy-out-records")
            if (response.status == 200) {
                buyoutRecords.value = await response.data;
                if (buyoutRecords.value.length > 0) {
                    buyoutRecords.value.forEach(item => {
                        if (buyout_records_map.value.hasOwnProperty(item['fund_id'].trim())) {
                        } else {
                            buyout_records_map.value[item['fund_id'].trim()] = new Object()
                        }
                        buyout_records_map.value[item['fund_id'].trim()][item['fund_order'].trim()] = true
                    })
                }
            } else {
                console.error("axios get all buyout records failed: ", response)
            }
        } catch (error) {
            console.log("axios get all buyout records error: ", error)
        }
    }

    function fundCanBeBuyOut(_fund_id_temp, _fund_order_temp) {
        let _fund_id = _fund_id_temp.trim();
        let _fund_order = _fund_order_temp.trim();
        if (!buyout_records_map.value.hasOwnProperty(_fund_id)) {
            return true
        } else {
            if (!buyout_records_map.value[_fund_id].hasOwnProperty(_fund_order)) {
                return true
            }
        }
        return false
    }

    async function soldComposeFixedHold(_fund_id, _fund_name, one_hold_obj_end, _hold_objs) {
        let _phone_num_array = [];
        let _trade_date_array = [];
        let _fund_order_array = [];
        let _amount_array = [];
        let _distance_natural_array = [];
        let _fund_id_array = [];
        let _fund_name_array = [];
        let _buyin_source_array = [];

        for (let _idx = 0; _idx < _hold_objs.length; _idx++) {
            let _loop_obj = _hold_objs[_idx];
            let _phone_num = '13426156189';
            let _trade_date = getTodayStr();
            let _fund_order = _loop_obj['fund_order'];
            let _amount = _loop_obj['amount'];
            let _distance_natural = _loop_obj['distance_natural'];
            let _buyin_source = _loop_obj['buyin_source'];
            if (_buyin_source == null || _buyin_source == '') {
                _buyin_source = 'zfb';
            }
            if (!fundCanBeBuyOut(_fund_id, _fund_order)) {
                console.warn("****** bypass fund id: ", _fund_id, " with fund order: ", _fund_order, " as it already buy out!");
                continue;
            }
            _fund_id_array.push(_fund_id);
            _fund_name_array.push(_fund_name);
            _phone_num_array.push(_phone_num);
            _trade_date_array.push(_trade_date);
            _fund_order_array.push(_fund_order);
            _amount_array.push(_amount);
            _distance_natural_array.push(_distance_natural);
            _buyin_source_array.push(_buyin_source);
            if (_loop_obj['fund_order'] == one_hold_obj_end['fund_order']) {
                break;
            }
        }
        try {
            const response = await axiosInst.post("api/buy-out-bulk", {
                'phone_num_array': _phone_num_array,
                'fund_id_array': _fund_id_array,
                'trade_date_array': _trade_date_array,
                'amount_array': _amount_array,
                'fund_order_array': _fund_order_array,
                'fund_name_array': _fund_name_array,
                'distance_natural_array': _distance_natural_array,
                'buyin_source_array': _buyin_source_array
            })
            if (response.status === 200) {
                useApiStore().pop_alert_msg("批量卖出成功: " + _fund_name, " 级别更新至4.3")
                await getAllBuyoutRecords()
            } else {
                console.error("axios remove local dyn values failed: ", response)
            }
        } catch (error) {
            console.log("axios remove local dyn values failed: ", error)
        }
    }

    async function buyOutFixedFund(_fund_id, _fund_name, one_hold_obj) {
        let _phone_num = '13426156189';
        let _trade_date = getTodayStr();
        let _fund_order = one_hold_obj['fund_order'];
        let _amount = one_hold_obj['amount'];
        let _distance_natural = one_hold_obj['distance_natural'];
        let _buyin_source = one_hold_obj['buyin_source'];
        if (_buyin_source == null || _buyin_source == '') {
            _buyin_source = 'zfb';
        }

        try {
            const response = await axiosInst.post("api/buy-out", {
                'phone_num': _phone_num,
                'fund_id': _fund_id,
                'trade_date': _trade_date,
                'amount': _amount,
                'fund_order': _fund_order,
                'fund_name': _fund_name,
                'distance_natural': _distance_natural,
                'buyin_source': _buyin_source
            })
            if (response.status === 200) {
                useApiStore().pop_alert_msg("删除记录成功: " + _fund_name)
                await getAllBuyoutRecords()
            } else {
                console.error("axios remove record failed: ", response)
            }
        } catch (error) {
            console.log("axios remove record failed: ", error)
        }
    }

    async function getAllBuyinRecords() {
        try {
            const response = await axiosInst.get("api/buy-in-records")
            if (response.status == 200) {
                buyin_records.value = await response.data;
            } else {
                console.error("axios get all buyin records failed: ", response)
            }
        } catch (error) {
            console.log("axios get all buyin records error: ", error)
        }
    }

    async function custBuyIn(cust_fund_id, cust_fund_name) {
        try {
            const response = await axiosInst.post("api/buy-in", {
                'phone_num': '13426156189',
                'fund_id': cust_fund_id,
                'trade_date': getTodayStr(),
                'money': 10,
                'probe_date': "cust-probe-date",
                'probe_type': "cust-probe-type",
                'fund_name': cust_fund_name,
                'buyin_source': "tt",
                'buy_type': 100
            })
            if (response.status == 200) {
                await response.data
                useApiStore().pop_alert_msg("更新经理成功: " + cust_fund_name)
                await getAllBuyinRecords()
            } else {
                console.error("axios set compose sold date failed: ", response)
            }
        } catch (error) {
            console.log("axios set compose sold date error: ", error)
        }
    }

    async function getFundWavReport() {
        try {
            const response = await axiosInst.get("api/get-wav-data")
            if (response.status == 200) {
                wav_reports.value = await response.data;
            } else {
                console.error("axios get wav report failed: ", response)
            }
        } catch (error) {
            console.log("axios get wav report error: ", error)
        }
    }

    return {
        buyoutRecords,
        buyin_records,
        buyout_records_map,
        wav_reports,
        getAllBuyoutRecords,
        fundCanBeBuyOut,
        soldComposeFixedHold,
        buyOutFixedFund,
        getAllBuyinRecords,
        custBuyIn,
        getFundWavReport
    }

});