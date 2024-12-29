import {axiosInst} from "../lib/api.js";
import { useApiStore } from "../store/apiStore.js";

async function getSyncStatus() {
    try {
        const response = await axiosInst.get("api/check-server-status")
        if (response.status == 200) {
            const server_status_objs = await response.data
            return server_status_objs
        } else {
            console.error("check server status failed: ", response)
            return null
        }
    } catch (error) {
        console.log("check server status failed: ", error)
        return null
    }    
}

async function runKanban(for_run) {
    try {
        const response = await axiosInst.post("dt-plans/api/run-kanban", {
            'for_run': for_run
        })
        if (response.status == 200) {
            if (for_run) {
                useApiStore().pop_alert_msg("发送运行看板成功")
            } else {
                useApiStore().pop_alert_msg("发送保存看板成功")
            }
            return true
        } else {
            if (for_run) {
                console.error("run kanban failed: ", response)
            } else {
                console.error("save kanban failed: ", response)
            }
            return false
        }
    } catch (error) {
        if (for_run) {
            console.log("run kanban failed: ", error)
        } else {
            console.log("save kanban failed: ", error)
        }
        return false
    }
}

async function syncKanban() {
    try {
        const response = await axiosInst.get("api/sync-server")
        if (response.status == 200) {
            useApiStore().pop_alert_msg("同步看板成功，请刷新页面")
            return true
        } else {
            console.error("sync kanban failed: ", response)
            return false
        }
    } catch (error) {
        console.log("sync kanban failed: ", error)
        return false
    }
}

async function syncCluster() {
    try {
        const response = await axiosInst.get("api/sync-fe-cluster")
        if (response.status == 200) {
            useApiStore().pop_alert_msg("同步android集群成功")
            return true
        } else {
            console.error("sync cluster failed: ", response)
            return false
        }
    } catch (error) {
        console.log("sync cluster failed: ", error)
        return false
    }
}

export {
    getSyncStatus,
    runKanban,
    syncKanban,
    syncCluster
}