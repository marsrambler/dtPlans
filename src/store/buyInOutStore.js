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
    const buyout_future_objs = ref({})
    const contStartStopObj = ref({})
    const buyOrSoldObj = ref({})
    const fund_buy_ratio_config = ref({})
    const curr_compose_name = ref('all')

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
        let _tot_money = 0;

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
                _tot_money = one_hold_obj_end['accu_money']
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
                'buyin_source_array': _buyin_source_array,
                'tot_money': _tot_money
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
                'buyin_source': _buyin_source,
                'action-type': 'remove'
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
    
    // async function custBuyIn(cust_fund_id, cust_fund_name) {
    //     try {
    //         const response = await axiosInst.post("api/buy-in", {
    //             'phone_num': '13426156189',
    //             'fund_id': cust_fund_id,
    //             'trade_date': getTodayStr(),
    //             'money': 10,
    //             'probe_date': "cust-probe-date",
    //             'probe_type': "cust-probe-type",
    //             'fund_name': cust_fund_name,
    //             'buyin_source': "tt",
    //             'buy_type': 100
    //         })
    //         if (response.status == 200) {
    //             await response.data
    //             useApiStore().pop_alert_msg("更新经理成功: " + cust_fund_name)
    //             await getAllBuyinRecords()
    //         } else {
    //             console.error("axios set compose sold date failed: ", response)
    //         }
    //     } catch (error) {
    //         console.log("axios set compose sold date error: ", error)
    //     }
    // }

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

    async function buyOutFixedFundOfToday(_fund_id, _fund_name) {
        try {
            const response = await axiosInst.post("api/buy-out-future", {
                'phone_num': "13426156189",
                'fund_id': _fund_id,
                'fund_name': _fund_name
            })
            if (response.status == 200) {
                await response.data
                useApiStore().pop_alert_msg("撤销今日定投成功: " + _fund_name)
                await getAllBuyoutFutureRecords()
            } else {
                console.error("axios buyOutFixedFundOfToday failed: ", response)
            }
        } catch (error) {
            console.log("axios buyOutFixedFundOfToday error: ", error)
        }
    }

    function calculatePlanMoney(_page_type, elem) {
        if (_page_type === 'zskb') {
            elem['plan_buyin_money'] = 60
            if (elem.hasOwnProperty('compose_obj') && elem['compose_obj'] && elem['compose_obj']['quant_obj'] && elem['compose_obj']['quant_obj']['histo']) {
                let _max_hitted_times = elem['compose_obj']['quant_obj']['histo']['max_hitted_times']
                let _min_hitted_times = elem['compose_obj']['quant_obj']['histo']['min_hitted_times']
                if (_max_hitted_times > _min_hitted_times) {
                    for (let idx = 0; idx < _max_hitted_times - _min_hitted_times; idx++) {
                        elem['plan_buyin_money'] = elem['plan_buyin_money'] * 0.8
                    }
                } else if (_min_hitted_times > _max_hitted_times) {
                    for (let idx = 0; idx < _min_hitted_times - _max_hitted_times; idx++) {
                        elem['plan_buyin_money'] = elem['plan_buyin_money']
                    }
                }
            }
            if (elem.hasOwnProperty('statistics') && elem['statistics'] && elem['statistics'].hasOwnProperty('min_sort_tot_earn')) {
                let _min_tot_earn = elem['statistics']['min_sort_tot_earn']
                if (_min_tot_earn != null) {
                    if (_min_tot_earn < -45) {
                        elem['plan_buyin_money'] = elem['plan_buyin_money'] * 0.5
                    } else if (_min_tot_earn < -30) {
                        elem['plan_buyin_money'] = elem['plan_buyin_money'] * 0.6
                    } else if (_min_tot_earn < -15) {
                        elem['plan_buyin_money'] = elem['plan_buyin_money'] * 0.7
                    } else if (_min_tot_earn < 0) {
                        elem['plan_buyin_money'] = elem['plan_buyin_money'] * 0.8
                    }
                } else {
                    console.error("zskb page has no statistics/min_sort_tot_earn for elem: ", elem);
                }
            } else {
                console.error("zskb page has no statistics/min_sort_tot_earn for elem: ", elem);
            }

            if (elem.hasOwnProperty('size') && elem['size'] < 1100) {
                elem['plan_buyin_money'] = elem['plan_buyin_money'] - 5
            }
            if (elem.hasOwnProperty('size') && elem['size'] < 880) {
                elem['plan_buyin_money'] = elem['plan_buyin_money'] - 5
            }
            if (elem['wav_obj'] && elem['wav_obj']['wav_sort_level']) {
                if (elem['wav_obj']['wav_sort_level'] > 2.5) {
                    elem['plan_buyin_money'] = elem['plan_buyin_money'] - 5
                }
                if (elem['wav_obj']['wav_sort_level'] > 5) {
                    elem['plan_buyin_money'] = elem['plan_buyin_money'] - 5
                }
                if (elem['wav_obj']['wav_sort_level'] > 7.5) {
                    elem['plan_buyin_money'] = elem['plan_buyin_money'] - 5
                }
            }
            if (elem['plan_buyin_money'] < 10) {
                elem['plan_buyin_money'] = 10
            }
            elem['plan_buyin_money'] = parseInt(elem['plan_buyin_money']);

        } else if (_page_type === 'aggressive') {
            if (!fund_buy_ratio_config.value || !fund_buy_ratio_config.value.hasOwnProperty('feeling_factor')) {
                elem['plan_buyin_money'] = 60
            } else {
                let _factor = fund_buy_ratio_config.value['feeling_factor'];
                elem['plan_buyin_money'] = parseInt(150 * _factor)
            }            
            if (elem.hasOwnProperty('compose_obj') && elem['compose_obj'] && elem['compose_obj']['quant_obj'] && elem['compose_obj']['quant_obj']['histo']) {
                let _max_hitted_times = elem['compose_obj']['quant_obj']['histo']['max_hitted_times']
                let _min_hitted_times = elem['compose_obj']['quant_obj']['histo']['min_hitted_times']
                if (_max_hitted_times > _min_hitted_times) {
                    for (let idx = 0; idx < _max_hitted_times - _min_hitted_times; idx++) {
                        elem['plan_buyin_money'] = elem['plan_buyin_money'] * 0.8
                    }
                } else if (_min_hitted_times > _max_hitted_times) {
                    for (let idx = 0; idx < _min_hitted_times - _max_hitted_times; idx++) {
                        elem['plan_buyin_money'] = elem['plan_buyin_money']
                    }
                }
            }

            if (elem.hasOwnProperty('statistics') && elem['statistics'] && elem['statistics'].hasOwnProperty('min_sort_tot_earn')) {
                let _min_tot_earn = elem['statistics']['min_sort_tot_earn']
                if (_min_tot_earn != null) {
                    if (_min_tot_earn < -45) {
                        elem['plan_buyin_money'] = elem['plan_buyin_money'] * 0.5
                    } else if (_min_tot_earn < -30) {
                        elem['plan_buyin_money'] = elem['plan_buyin_money'] * 0.6
                    } else if (_min_tot_earn < -15) {
                        elem['plan_buyin_money'] = elem['plan_buyin_money'] * 0.7
                    } else if (_min_tot_earn < 0) {
                        elem['plan_buyin_money'] = elem['plan_buyin_money'] * 0.8
                    }
                } else {
                    console.error("aggressive page has no statistics/min_sort_tot_earn for elem: ", elem);
                }
            } else {
                console.error("aggressive page has no statistics/min_sort_tot_earn for elem: ", elem);
            }

            if (!elem['p50_convg_dur_rank'] || !elem['p65_convg_dur_rank'] || !elem['p80_convg_dur_rank']) {
                elem['plan_buyin_money'] = elem['plan_buyin_money'] - 10
            }
            if (elem['avg_convg_days'] && elem['avg_convg_days'] >= 150) {
                elem['plan_buyin_money'] = elem['plan_buyin_money'] - 5
            }
            if (elem['avg_convg_days'] && elem['avg_convg_days'] >= 180) {
                elem['plan_buyin_money'] = elem['plan_buyin_money'] - 5
            }
            if (elem['size'] && elem['size'] < 1100) {
                elem['plan_buyin_money'] = elem['plan_buyin_money'] - 5
            }
            if (elem['size'] && elem['size'] < 880) {
                elem['plan_buyin_money'] = elem['plan_buyin_money'] - 5
            }
            if (elem['wav_obj'] && elem['wav_obj']['wav_sort_level']) {
                if (elem['wav_obj']['wav_sort_level'] > 2.5) {
                    elem['plan_buyin_money'] = elem['plan_buyin_money'] - 5
                }
                if (elem['wav_obj']['wav_sort_level'] > 5) {
                    elem['plan_buyin_money'] = elem['plan_buyin_money'] - 5
                }
                if (elem['wav_obj']['wav_sort_level'] > 7.5) {
                    elem['plan_buyin_money'] = elem['plan_buyin_money'] - 5
                }
            }

            if (elem['plan_buyin_money'] < 10) {
                elem['plan_buyin_money'] = 10
            }
            elem['plan_buyin_money'] = parseInt(elem['plan_buyin_money']);

        } else if (_page_type === 'dtconvg') {
            elem['plan_buyin_money'] = 60
            if (elem.hasOwnProperty('compose_obj') && elem['compose_obj'] && elem['compose_obj']['quant_obj'] && elem['compose_obj']['quant_obj']['histo']) {
                let _max_hitted_times = elem['compose_obj']['quant_obj']['histo']['max_hitted_times']
                let _min_hitted_times = elem['compose_obj']['quant_obj']['histo']['min_hitted_times']
                if (_max_hitted_times > _min_hitted_times) {
                    for (let idx = 0; idx < _max_hitted_times - _min_hitted_times; idx++) {
                        elem['plan_buyin_money'] = elem['plan_buyin_money'] * 0.8
                    }
                } else if (_min_hitted_times > _max_hitted_times) {
                    for (let idx = 0; idx < _min_hitted_times - _max_hitted_times; idx++) {
                        elem['plan_buyin_money'] = elem['plan_buyin_money']
                    }
                }
            }

            if (elem.hasOwnProperty('statistics') && elem['statistics'] && elem['statistics'].hasOwnProperty('min_sort_tot_earn')) {
                let _min_tot_earn = elem['statistics']['min_sort_tot_earn']
                if (_min_tot_earn != null) {
                    if (_min_tot_earn < -45) {
                        elem['plan_buyin_money'] = elem['plan_buyin_money'] * 0.5
                    } else if (_min_tot_earn < -30) {
                        elem['plan_buyin_money'] = elem['plan_buyin_money'] * 0.6
                    } else if (_min_tot_earn < -15) {
                        elem['plan_buyin_money'] = elem['plan_buyin_money'] * 0.7
                    } else if (_min_tot_earn < 0) {
                        elem['plan_buyin_money'] = elem['plan_buyin_money'] * 0.8
                    }
                } else {
                    console.error("dtconvg page has no statistics/min_sort_tot_earn for elem: ", elem);
                }
            } else {
                console.error("dtconvg page has no statistics/min_sort_tot_earn for elem: ", elem);
            }

            if (elem['size'] && elem['size'] < 1100) {
                elem['plan_buyin_money'] = elem['plan_buyin_money'] - 5
            }
            if (elem['size'] && elem['size'] < 880) {
                elem['plan_buyin_money'] = elem['plan_buyin_money'] - 5
            }
            if (elem['wav_obj'] && elem['wav_obj']['wav_sort_level']) {
                if (elem['wav_obj']['wav_sort_level'] > 2.5) {
                    elem['plan_buyin_money'] = elem['plan_buyin_money'] - 5
                }
                if (elem['wav_obj']['wav_sort_level'] > 5) {
                    elem['plan_buyin_money'] = elem['plan_buyin_money'] - 5
                }
                if (elem['wav_obj']['wav_sort_level'] > 7.5) {
                    elem['plan_buyin_money'] = elem['plan_buyin_money'] - 5
                }
            }

            if (elem['plan_buyin_money'] < 10) {
                elem['plan_buyin_money'] = 10
            }
            elem['plan_buyin_money'] = parseInt(elem['plan_buyin_money']);
            
        } else if (_page_type === 'compose') {
            if (elem['compose_name'] === 'gdngoat') {
                elem['plan_buyin_money'] = 60
                if (elem['quant_obj'] && elem['quant_obj']['histo']) {
                    let _max_hitted_times = elem['quant_obj']['histo']['max_hitted_times']
                    let _min_hitted_times = elem['quant_obj']['histo']['min_hitted_times']
                    if (_max_hitted_times > _min_hitted_times) {
                        for (let idx = 0; idx < _max_hitted_times - _min_hitted_times; idx++) {
                            elem['plan_buyin_money'] = elem['plan_buyin_money'] * 0.8
                        }
                    } else if (_min_hitted_times > _max_hitted_times) {
                        for (let idx = 0; idx < _min_hitted_times - _max_hitted_times; idx++) {
                            elem['plan_buyin_money'] = elem['plan_buyin_money']
                        }
                    }
                }

                if (elem.hasOwnProperty('kbObj') && elem['kbObj'] && elem['kbObj'].hasOwnProperty('statistics') && elem['kbObj']['statistics'] && elem['kbObj']['statistics'].hasOwnProperty('min_sort_tot_earn')) {
                    let _min_tot_earn = elem['kbObj']['statistics']['min_sort_tot_earn']
                    if (_min_tot_earn != null) {
                        if (_min_tot_earn < -45) {
                            elem['plan_buyin_money'] = elem['plan_buyin_money'] * 0.5
                        } else if (_min_tot_earn < -30) {
                            elem['plan_buyin_money'] = elem['plan_buyin_money'] * 0.6
                        } else if (_min_tot_earn < -15) {
                            elem['plan_buyin_money'] = elem['plan_buyin_money'] * 0.7
                        } else if (_min_tot_earn < 0) {
                            elem['plan_buyin_money'] = elem['plan_buyin_money'] * 0.8
                        }
                    } else {
                        console.error("compose page/gdngoat has no statistics/min_sort_tot_earn for elem: ", elem);
                    }
                } else {
                    console.error("compose page/gdngoat has no statistics/min_sort_tot_earn for elem: ", elem);
                }

                if (elem['kbObj'] && (!elem['kbObj']['p50_convg_dur_rank'] || !elem['kbObj']['p65_convg_dur_rank'] || !elem['kbObj']['p80_convg_dur_rank'])) {
                    elem['plan_buyin_money'] = elem['plan_buyin_money'] - 10
                }
                if (elem['kbObj'] && elem['kbObj']['avg_convg_days'] && elem['kbObj']['avg_convg_days'] >= 150) {
                    elem['plan_buyin_money'] = elem['plan_buyin_money'] - 5
                }
                if (elem['kbObj'] && elem['kbObj']['avg_convg_days'] && elem['kbObj']['avg_convg_days'] >= 180) {
                    elem['plan_buyin_money'] = elem['plan_buyin_money'] - 5
                }
                if (elem['kbObj'] && elem['kbObj']['size'] && elem['kbObj']['size'] < 1100) {
                    elem['plan_buyin_money'] = elem['plan_buyin_money'] - 5
                }
                if (elem['kbObj'] && elem['kbObj']['size'] && elem['kbObj']['size'] < 880) {
                    elem['plan_buyin_money'] = elem['plan_buyin_money'] - 5
                }
                if (elem['wav_obj'] && elem['wav_obj']['wav_sort_level']) {
                    if (elem['wav_obj']['wav_sort_level'] > 2.5) {
                        elem['plan_buyin_money'] = elem['plan_buyin_money'] - 5
                    }
                    if (elem['wav_obj']['wav_sort_level'] > 5) {
                        elem['plan_buyin_money'] = elem['plan_buyin_money'] - 5
                    }
                    if (elem['wav_obj']['wav_sort_level'] > 7.5) {
                        elem['plan_buyin_money'] = elem['plan_buyin_money'] - 5
                    }
                }

                if (elem['plan_buyin_money'] < 10) {
                    elem['plan_buyin_money'] = 10
                }
                elem['plan_buyin_money'] = parseInt(elem['plan_buyin_money']);

            } else if (elem['compose_name'] === 'ovtree' || elem['compose_name'] === 'flyhorse' || elem['compose_name'] === 'medusa' || elem['compose_name'] === 'trident') {
                // 计算规则 和 具体的种类是绑定的，不能更改
                elem['plan_buyin_money'] = 60
                if (elem['quant_obj'] && elem['quant_obj']['histo']) {
                    let _max_hitted_times = elem['quant_obj']['histo']['max_hitted_times']
                    let _min_hitted_times = elem['quant_obj']['histo']['min_hitted_times']
                    if (_max_hitted_times > _min_hitted_times) {
                        for (let idx = 0; idx < _max_hitted_times - _min_hitted_times; idx++) {
                            elem['plan_buyin_money'] = elem['plan_buyin_money'] * 0.8
                        }
                    } else if (_min_hitted_times > _max_hitted_times) {
                        for (let idx = 0; idx < _min_hitted_times - _max_hitted_times; idx++) {
                            elem['plan_buyin_money'] = elem['plan_buyin_money']
                        }
                    }
                }

                if (elem.hasOwnProperty('kbObj') && elem['kbObj'] && elem['kbObj'].hasOwnProperty('statistics') && elem['kbObj']['statistics'] && elem['kbObj']['statistics'].hasOwnProperty('min_sort_tot_earn')) {
                    let _min_tot_earn = elem['kbObj']['statistics']['min_sort_tot_earn']
                    if (_min_tot_earn != null) {
                        if (_min_tot_earn < -45) {
                            elem['plan_buyin_money'] = elem['plan_buyin_money'] * 0.5
                        } else if (_min_tot_earn < -30) {
                            elem['plan_buyin_money'] = elem['plan_buyin_money'] * 0.6
                        } else if (_min_tot_earn < -15) {
                            elem['plan_buyin_money'] = elem['plan_buyin_money'] * 0.7
                        } else if (_min_tot_earn < 0) {
                            elem['plan_buyin_money'] = elem['plan_buyin_money'] * 0.8
                        }
                    } else {
                        console.warn("compose page/ovtree/trident/flyhorse/medusa has no statistics/min_sort_tot_earn for elem: ", elem);
                    }
                } else {
                    console.warn("compose page/ovtree/trident/flyhorse/medusa has no statistics/min_sort_tot_earn for elem: ", elem);
                }

                if (elem['kbObj'] && elem['kbObj']['statistics'] && elem['kbObj']['statistics']['fund_perc_len'] && elem['kbObj']['statistics']['fund_perc_len'] < 1100) {
                    elem['plan_buyin_money'] = elem['plan_buyin_money'] - 5
                }
                if (elem['kbObj'] && elem['kbObj']['statistics'] && elem['kbObj']['statistics']['fund_perc_len'] && elem['kbObj']['statistics']['fund_perc_len'] < 880) {
                    elem['plan_buyin_money'] = elem['plan_buyin_money'] - 5
                }
                if (elem['wav_obj'] && elem['wav_obj']['wav_sort_level']) {
                    if (elem['wav_obj']['wav_sort_level'] > 2.5) {
                        elem['plan_buyin_money'] = elem['plan_buyin_money'] - 5
                    }
                    if (elem['wav_obj']['wav_sort_level'] > 5) {
                        elem['plan_buyin_money'] = elem['plan_buyin_money'] - 5
                    }
                    if (elem['wav_obj']['wav_sort_level'] > 7.5) {
                        elem['plan_buyin_money'] = elem['plan_buyin_money'] - 5
                    }
                }

                if (elem['plan_buyin_money'] < 10) {
                    elem['plan_buyin_money'] = 10
                }
                elem['plan_buyin_money'] = parseInt(elem['plan_buyin_money']);

            } else if (elem['compose_name'] === 'dolphin') {
                elem['plan_buyin_money'] = 60
                if (elem['quant_obj'] && elem['quant_obj']['histo']) {
                    let _max_hitted_times = elem['quant_obj']['histo']['max_hitted_times']
                    let _min_hitted_times = elem['quant_obj']['histo']['min_hitted_times']
                    if (_max_hitted_times > _min_hitted_times) {
                        for (let idx = 0; idx < _max_hitted_times - _min_hitted_times; idx++) {
                            elem['plan_buyin_money'] = elem['plan_buyin_money'] * 0.8
                        }
                    } else if (_min_hitted_times > _max_hitted_times) {
                        for (let idx = 0; idx < _min_hitted_times - _max_hitted_times; idx++) {
                            elem['plan_buyin_money'] = elem['plan_buyin_money']
                        }
                    }
                }

                if (elem.hasOwnProperty('kbObj') && elem['kbObj'] && elem['kbObj'].hasOwnProperty('statistics') && elem['kbObj']['statistics'] && elem['kbObj']['statistics'].hasOwnProperty('min_sort_tot_earn')) {
                    let _min_tot_earn = elem['kbObj']['statistics']['min_sort_tot_earn']
                    if (_min_tot_earn != null) {
                        if (_min_tot_earn < -45) {
                            elem['plan_buyin_money'] = elem['plan_buyin_money'] * 0.5
                        } else if (_min_tot_earn < -30) {
                            elem['plan_buyin_money'] = elem['plan_buyin_money'] * 0.6
                        } else if (_min_tot_earn < -15) {
                            elem['plan_buyin_money'] = elem['plan_buyin_money'] * 0.7
                        } else if (_min_tot_earn < 0) {
                            elem['plan_buyin_money'] = elem['plan_buyin_money'] * 0.8
                        }
                    } else {
                        console.error("compose page/dolphin has no statistics/min_sort_tot_earn for elem: ", elem);
                    }
                } else {
                    console.error("compose page/dolphin has no statistics/min_sort_tot_earn for elem: ", elem);
                }

                if (elem['kbObj'] && elem['kbObj']['statistics'] && elem['kbObj']['statistics']['fund_perc_len'] && elem['kbObj']['statistics']['fund_perc_len'] < 1100) {
                    elem['plan_buyin_money'] = elem['plan_buyin_money'] - 5
                }
                if (elem['kbObj'] && elem['kbObj']['statistics'] && elem['kbObj']['statistics']['fund_perc_len'] && elem['kbObj']['statistics']['fund_perc_len'] < 880) {
                    elem['plan_buyin_money'] = elem['plan_buyin_money'] - 5
                }
                if (elem['wav_obj'] && elem['wav_obj']['wav_sort_level']) {
                    if (elem['wav_obj']['wav_sort_level'] > 2.5) {
                        elem['plan_buyin_money'] = elem['plan_buyin_money'] - 5
                    }
                    if (elem['wav_obj']['wav_sort_level'] > 5) {
                        elem['plan_buyin_money'] = elem['plan_buyin_money'] - 5
                    }
                    if (elem['wav_obj']['wav_sort_level'] > 7.5) {
                        elem['plan_buyin_money'] = elem['plan_buyin_money'] - 5
                    }
                }

                if (elem['plan_buyin_money'] < 10) {
                    elem['plan_buyin_money'] = 10
                }
                elem['plan_buyin_money'] = parseInt(elem['plan_buyin_money']);

            } else {
                console.error("Not implement compose name: ", elem['compose_name']);
            }
        }
    }

    async function getAllBuyoutFutureRecords() {
        try {
            const response = await axiosInst.get("api/buy-out-future")
            if (response.status == 200) {
                let _objs = await response.data;
                let _trans_objs = {}
                if (_objs && _objs.length > 0) {
                    _objs.forEach(elem => {
                        _trans_objs[elem['fund_id']] = elem
                    })
                }
                buyout_future_objs.value = _trans_objs
            } else {
                console.error("axios get buyout future records failed: ", response)
            }
        } catch (error) {
            console.log("axios get buyout future records error: ", error)
        }
    }

    async function getContStartStop() {
        try {
            const response = await axiosInst.get("api/get_cont_start_stop")
            if (response.status == 200) {
                contStartStopObj.value = await response.data;
            } else {
                console.error("axios get cont start stop failed: ", response)
            }
        } catch (error) {
            console.log("axios get cont start stop error: ", error)
        }
    }

    async function addBuyOrSoldNote(fund_id, fund_name, for_buy, for_sold, _compose_name='') {
        if (!for_buy && !for_sold) {
            console.error("buy or sold should be selected at least one");
            return;
        }
        var compose_name = '';
        if (_compose_name == 'ovtree') {
            compose_name = '橄榄树';
        } else if (_compose_name == 'flyhorse') {
            compose_name = '飞马';
        } else if (_compose_name == 'medusa') {
            compose_name = '美杜莎';
        } else if (_compose_name == 'dolphin') {
            compose_name = '海豚';
        } else if (_compose_name == 'trident') {
            compose_name = '三叉戟';
        } else if (_compose_name == 'gdngoat') {
            compose_name = '金毛羊';
        } else if (_compose_name == 'bigpool') {
            compose_name = '大池';
        }
        try {
            const response = await axiosInst.post("api/add_sold_buy_notes", {
                'fund_id': fund_id,
                'fund_name': fund_name,
                'date_str': getTodayStr(),
                'for_buy': for_buy,
                'for_sold': for_sold,
                'compose_name': compose_name
            })
            if (response.status == 200) {
                await response.data
                useApiStore().pop_alert_msg("登记买入卖出成功: " + fund_name)
                await getBuyOrSoldNote();
            } else {
                console.error("axios add buy or sold note failed: ", response)
            }
        } catch (error) {
            console.log("axios add buy or sold note error: ", error)
        }
    }

    async function getBuyOrSoldNote() {
        try {
            const response = await axiosInst.get("api/get_sold_buy_notes")
            if (response.status == 200) {
                let _ret_objs = await response.data;
                for (let _key in _ret_objs) {
                  let _sold_times = 0;
                  let _buy_times = 0;
                  if (_ret_objs[_key] && _ret_objs[_key].length > 0) {
                      _ret_objs[_key].forEach(elem => {
                        if (elem['for_buy']) {
                          _buy_times += 1;
                        }
                        if (elem['for_sold']) {
                          _sold_times += 1;
                        }
                      });
                  }
                  buyOrSoldObj.value[_key] = new Object;
                  buyOrSoldObj.value[_key]['buy_times'] = _buy_times;
                  buyOrSoldObj.value[_key]['sold_times'] = _sold_times;
                }                 
            } else {
                console.error("axios get buy or sold failed: ", response)
            }
        } catch (error) {
            console.log("axios get buy or sold error: ", error)
        }
    }

    async function getFundAndBuyRatioConfig() {
        fund_buy_ratio_config.value = {}
        try {
            const response = await axiosInst.get("api/fund-and-buy-ratio")
            if (response.status == 200) {
                fund_buy_ratio_config.value = await response.data;
            } else {
                console.error("axios getFundAndBuyRatioConfig failed: ", response)
            }
        } catch (error) {
            console.log("axios getFundAndBuyRatioConfig error: ", error)
        }
    }

    return {
        buyoutRecords,
        buyin_records,
        buyout_records_map,
        wav_reports,
        buyout_future_objs,
        contStartStopObj,
        buyOrSoldObj,
        fund_buy_ratio_config,
        curr_compose_name,
        getAllBuyoutRecords,
        fundCanBeBuyOut,
        soldComposeFixedHold,
        buyOutFixedFund,
        getAllBuyinRecords,
        //custBuyIn,
        getFundWavReport,
        buyOutFixedFundOfToday,
        calculatePlanMoney,
        getAllBuyoutFutureRecords,
        getContStartStop,
        addBuyOrSoldNote,
        getBuyOrSoldNote,
        getFundAndBuyRatioConfig
    }

});