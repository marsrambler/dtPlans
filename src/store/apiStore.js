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

    function clean_today_data(_storage_name, _clean_func) {
        var db;
        const request = indexedDB.open(_storage_name, 1);
        request.onsuccess = function(event) {
            db = event.target.result;
            console.log("open data base successfully: ", _storage_name);
            var transaction = db.transaction([_storage_name], "readwrite");
            var objectStore = transaction.objectStore(_storage_name);
            var _date_str = get_today_str();
            var _req_cln = objectStore.delete(_date_str);
            _req_cln.onsuccess = function (event) {
                _clean_func(true, db);
            }
            _req_cln.onerror = function (event) {
                _clean_func(false, db);
            }
        };
        request.onerror = function(event) {
            console.error("open data base failed: ", _storage_name);
            _clean_func(false, null);
        };
        request.onupgradeneeded = function(event) {
            console.log("onupgradeneeded: ", _storage_name);
            _clean_func(false, null);
        };
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
        pop_alert_msg,
        clean_today_data
    };
});