import axios from "axios";
import {useApiStore} from "../store/apiStore.js";

const restBaseUrl = "http://192.168.43.118:8080/dt-plans/"
export const axiosInst = axios.create({
    baseURL: restBaseUrl,
    headers: {
        "Content-Type": "application/json"
    }
});

export const axiosSetup = () => {
    axiosInst.interceptors.request.use(
        (config) => {
            console.log("###### axios interceptor request fulfill")
            console.log("config.url: ", config.url)
            console.log("config.method: ", config.method)
            console.log("config.headers: ", config.headers)
            console.log("config.params: ", config.params)
            //const apiStore = useApiStore()
            useApiStore().push_request_url(config.url.trim(), config.method)
            return config;
        },
        (error) => {
            console.log("###### axios interceptor request reject")
            console.log("error: ", error)
            //const apiStore = useApiStore()
            useApiStore().push_error_msg(error.message, error.config.baseURL + error.config.url)
            return Promise.reject(error);
        }
    );
    axiosInst.interceptors.response.use(
        (resp) => {
            console.log("###### axios interceptor response fulfill")
            console.log("resp.headers: ", resp.headers)
            console.log("resp.config: ", resp.config)
            console.log("resp.request: ", resp.request)
            //const apiStore = useApiStore()
            if (resp.status !== 200) {
                resp.data = []
                useApiStore().push_error_msg(resp.statusText, resp.config.url.trim() + " returns: " + resp.status)
            } else {
                useApiStore().push_response_url(resp.config.url.trim(), resp.config.method)
            }
            return resp;
        },
        (error) => {
            console.log("###### axios interceptor response reject")
            console.log("error: ", error)
            useApiStore().push_error_msg(error.message, error.config.baseURL + error.config.url)
            return Promise.reject(error);
        }
    )
};