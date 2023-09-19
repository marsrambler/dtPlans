import { defineStore } from 'pinia'
import {computed, ref} from 'vue'

export const useApiStore = defineStore('api-store', () => {
    // state
    const requestMsgObjs = ref([])
    const errorMsgObjs = ref([])

    // getter
    const isApiInProgress = computed(() => {
        if (errorMsgObjs.value.length > 0) {
            return false
        }
        return requestMsgObjs.value.length > 0
    })

    // action
    function push_request_url(_req_url, _method) {
        requestMsgObjs.value.push({'url': _req_url, 'mothod': _method})
    }
    function push_response_url(_rsp_url, _method) {
        const func = element => element['url'] === _rsp_url.trim() && element['mothod'] === _method
        let _idx = requestMsgObjs.value.findIndex(func)
        if (_idx === -1) {
        } else {
            requestMsgObjs.value.splice(_idx, 1)
        }
    }
    function push_error_msg(_error_type, _error_msg) {
        errorMsgObjs.value.push({id: errorMsgObjs.value.length, 'type': _error_type, 'msg': _error_msg})
    }

    const isAlertVisible = ref(false)
    const alertMsg = ref("")
    function pop_alert_msg(_msg) {
        alertMsg.value = _msg
        isAlertVisible.value = true
        setTimeout(function() {
            alertMsg.value = ""
            isAlertVisible.value = false
        }, 5000)
    }

    return {
        requestMsgObjs,
        errorMsgObjs,
        isApiInProgress,
        isAlertVisible,
        alertMsg,
        push_request_url,
        push_response_url,
        push_error_msg,
        pop_alert_msg
    };
});