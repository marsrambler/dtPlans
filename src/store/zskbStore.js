import {defineStore} from 'pinia'
import {axiosInst} from "../lib/api.js";
import {ref} from 'vue'

export const useZskbStore = defineStore('zskb-store', () => {
    // state
    const zskbObjs = ref([])
    const sortFieldName = ref('')
    const sortFieldFlag = ref(true)

    // action
    async function getZskb() {
        try {
            const response = await axiosInst.get("api/kanban/zhi-shu")
            if (response.status == 200) {
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

    function sortByField(_field) {
        if (sortFieldName.value === _field) {
            sortFieldFlag.value = !sortFieldFlag.value
        } else {
            sortFieldName.value = _field
            sortFieldFlag.value = true
        }
        if (_field === 'cluster_id') {
            if (sortFieldFlag.value) {
                zskbObjs.value.sort((a, b) => {
                    return a['statistics']['cluster_id'] - b['statistics']['cluster_id'];
                });
            } else {
                zskbObjs.value.sort((a, b) => {
                    return b['statistics']['cluster_id'] - a['statistics']['cluster_id'];
                });
            }
        } else if (_field === 'fund_type') {
            if (sortFieldFlag.value) {
                zskbObjs.value.sort((a, b) => {
                    return a['indexType'] - b['indexType'];
                });
            } else {
                zskbObjs.value.sort((a, b) => {
                    return b['indexType'] - a['indexType'];
                });
            }
        } else if (_field === 'min_earn') {
            if (sortFieldFlag.value) {
                zskbObjs.value.sort((a, b) => {
                    return a['statistics']['min_earn'] + a['statistics']['min_earn_aux'] + a['statistics']['min_earn_tri'] - (
                        b['statistics']['min_earn'] + b['statistics']['min_earn_aux'] + b['statistics']['min_earn_tri']);
                });
            } else {
                zskbObjs.value.sort((a, b) => {
                    return b['statistics']['min_earn'] + b['statistics']['min_earn_aux'] + b['statistics']['min_earn_tri'] - (
                        a['statistics']['min_earn'] + a['statistics']['min_earn_aux'] + a['statistics']['min_earn_tri']);
                });
            }
        } else if (_field === 'avg_earn') {
            if (sortFieldFlag.value) {
                zskbObjs.value.sort((a, b) => {
                    return a['statistics']['avg_earn'] + a['statistics']['avg_earn_aux'] + a['statistics']['avg_earn_tri'] - (
                        b['statistics']['avg_earn'] + b['statistics']['avg_earn_aux'] + b['statistics']['avg_earn_tri']);
                });
            } else {
                zskbObjs.value.sort((a, b) => {
                    return b['statistics']['avg_earn'] + b['statistics']['avg_earn_aux'] + b['statistics']['avg_earn_tri'] - (
                        a['statistics']['avg_earn'] + a['statistics']['avg_earn_aux'] + a['statistics']['avg_earn_tri']);
                });
            }
        } else if (_field === 'max_earn') {
            if (sortFieldFlag.value) {
                zskbObjs.value.sort((a, b) => {
                    return a['statistics']['max_earn'] + a['statistics']['max_earn_aux'] + a['statistics']['max_earn_tri'] - (
                        b['statistics']['max_earn'] + b['statistics']['max_earn_aux'] + b['statistics']['max_earn_tri']);
                });
            } else {
                zskbObjs.value.sort((a, b) => {
                    return b['statistics']['max_earn'] + b['statistics']['max_earn_aux'] + b['statistics']['max_earn_tri'] - (
                        a['statistics']['max_earn'] + a['statistics']['max_earn_aux'] + a['statistics']['max_earn_tri']);
                });
            }
        } else if (_field === 'positive') {
            if (sortFieldFlag.value) {
                zskbObjs.value.sort((a, b) => {
                    return a['positive']['positive_reach_len'] - b['positive']['positive_reach_len'];
                });
            } else {
                zskbObjs.value.sort((a, b) => {
                    return b['positive']['positive_reach_len'] - a['positive']['positive_reach_len'];
                });
            }
        } else if (_field === 'negative') {
            if (sortFieldFlag.value) {
                zskbObjs.value.sort((a, b) => {
                    return a['negative']['negative_reach_len'] - b['negative']['negative_reach_len'];
                });
            } else {
                zskbObjs.value.sort((a, b) => {
                    return b['negative']['negative_reach_len'] - a['negative']['negative_reach_len'];
                });
            }
        }
    }


    return {
        zskbObjs,
        sortFieldName,
        sortFieldFlag,
        getZskb,
        sortByField
    }
});