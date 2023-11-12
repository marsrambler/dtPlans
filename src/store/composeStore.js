import {defineStore} from 'pinia'
import {axiosInst} from "../lib/api.js";
import {ref, watch} from 'vue'
import { useApiStore } from './apiStore.js';

export const useComposeStore = defineStore('compose-store', () => {
    // state
    const composeObjs = ref([])
    const fixedHoldObjs = ref([])
    const buyoutRecords = ref([])
    const buyout_records_map = ref({})

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

    async function addOrRemoveCompose(_fund_id, _fund_name, _compose_name) {
        try {
            const response = await axiosInst.post("dt-plans/api/compose/update-compose", {
                'fund_id': _fund_id,
                'fund_name': _fund_name,
                'compose_name': _compose_name
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
                'buyin_source': _buyin_source
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

    function getTodayStr() {
        Date.prototype.Format = function (fmt) {
            let o = {
                "M+": this.getMonth() + 1,
                "d+": this.getDate(),
                "h+": this.getHours(),
                "m+": this.getMinutes(),
                "s+": this.getSeconds(),
                "q+": Math.floor((this.getMonth() + 3) / 3),
                "S": this.getMilliseconds()
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (let k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }
        return new Date().Format("yyyy-MM-dd");
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
                useApiStore().pop_alert_msg("批量卖出成功: " + _fund_name)
                await getAllBuyoutRecords()
            } else {
                console.error("axios remove local dyn values failed: ", response)
            }
        } catch (error) {
            console.log("axios remove local dyn values failed: ", error)
        }
    }

    async function buyOutFixedFund(_fund_id, _fund_name, one_hold_obj) {
        var _phone_num = '13426156189';
        var _trade_date = getTodayStr();
        var _fund_order = one_hold_obj['fund_order'];
        var _amount = one_hold_obj['amount'];
        var _distance_natural = one_hold_obj['distance_natural'];
        var _buyin_source = one_hold_obj['buyin_source'];
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

    return {
        composeObjs,
        fixedHoldObjs,
        buyoutRecords,
        buyout_records_map,
        getAllCompose,
        addOrRemoveCompose,
        setComposeProperty,
        getComposeFixedHold,
        getAllBuyoutRecords,
        soldComposeFixedHold,
        buyOutFixedFund
    }
});