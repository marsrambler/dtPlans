<template>
  <nav class="navbar fixed-top navbar-expand-sm navbar-dark bg-dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">
        <img width=32 height=32 style="border-radius: 16px;" src="/images/poseidon.png">
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav" style="gap: 0.5rem;">
          <router-link to="/" class="nav-item nav-link">组合</router-link>
          <router-link to="/repo" class="nav-item nav-link">仓库</router-link>
          <router-link to="/kanban" class="nav-item nav-link">看板</router-link>
          <router-link to="/recycle" class="nav-item nav-link">回收</router-link>
          <router-link to="/aggressive" class="nav-item nav-link">主动</router-link>
          <router-link to="/convg" class="nav-item nav-link">优选</router-link>
          <router-link to="/report" class="nav-item nav-link">报告</router-link>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button"
              data-bs-toggle="dropdown" aria-expanded="false">
              <span v-if="isSynced" style="color: lime;">已同步</span>
              <span v-else style="color: darkgray;">未同步</span>
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink"
              style="background-color: black; padding: 0;">
              <li>
                <button style="width: 100%; border-radius: 0;" type="button" class="btn btn-secondary"
                  @click="runKanban4ui();">运行看板</button>
              </li>
              <li>
                <button style="width: 100%; border-radius: 0;" type="button" class="btn btn-secondary"
                  @click="syncKanban4ui();">同步看板</button>
              </li>
              <li>
                <button style="width: 100%; border-radius: 0;" type="button" class="btn btn-secondary"
                  @click="syncCluster4ui();">同步集群</button>
              </li>              
            </ul>
          </li>
        </ul>
        <span class="text-bg-dark">{{uptTime}}</span>
        <span style="cursor: pointer; margin-left: 1rem;">
          <a href="../" class="text-info">
            去综合门户
          </a>
        </span>

        <div style="display: flex; margin-left: 1rem; column-gap: 0.5rem;">

          <div style="display: flex; align-items: center; color: white;">
            <div style="display: inline-block; width: 1.5rem;">
              持:
            </div>
            <div style="display: inline-block; text-align: center;">
              <div style="font-size: 0.8rem;margin-bottom: -3px;font-weight: bold;">{{ totMoney }}</div>
              <div class="sep_line" style="margin:0;"></div>
              <div style="margin-top: -2px;">
                <span class="blink_me badge bg-danger" style="font-size: 0.8rem;">
                  高点:&nbsp;{{ totPositiveNum }}
                </span>
              </div>
            </div>
          </div>

          <div style="display: flex; align-items: center; color: white;">
            <div style="display: inline-block; width: 1.5rem">盈:</div>
              <template v-if="totEarnMoney > 0 && totMoney > 0">
                <div style="display: inline-block;" class="badge bg-danger">
                  <div style="font-size: 0.8rem;">{{ totEarnMoney }}</div>
                  <div class="sep_line"></div>
                  <div style="font-size: 0.8rem;">{{ totEarnRate }}</div>
                </div>
              </template>
              <template v-else-if="totMoney > 0">
                <div style="display: inline-block;" class="badge bg-success">
                  <div style="font-size: 0.8rem;">{{ totEarnMoney }}</div>
                  <div class="sep_line"></div>
                  <div style="font-size: 0.8rem;">{{ totEarnRate }}</div>
                </div>
              </template>
              <template v-else>
                <div style="display: inline-block; margin-left: 0.5rem; margin-right: 0.5rem;">
                  <div style="font-size: 0.8rem;">0</div>
                  <div class="sep_line"></div>
                  <div style="font-size: 0.8rem;">0</div>                  
                </div>
              </template>
          </div>
          
          <div style="display: flex; align-items: center; color: white;">
            <div style="display: inline-block; width: 1.5rem">设:</div>
            <div style="display: inline-block; margin-left: 0.5rem;">
              <div style="font-size: 0.8rem; font-weight: bold; margin-bottom: -3px; text-align: center;">{{ totSetBuy }}</div>
              <div class="sep_line"></div>
                <template v-if="diffBuySet >= 0.1">
                  <div class="badge bg-warning"
                    style="font-size: 0.8rem; font-weight: bold; line-height: 0.8 !important;; display: block !important;">{{ totPlanBuy }}
                  </div>
                </template>
                <template v-else-if="diffBuySet <= -0.1">
                  <div class="badge bg-danger"
                    style="font-size: 0.8rem; line-height: 0.8 !important;; display: block !important;">{{ totPlanBuy }}
                  </div>
                </template>
                <template v-else>
                  <div style="font-size: 0.8rem; font-weight: bold; margin-top: -3px;">{{ totPlanBuy }}</div>
                </template>
            </div>
          </div>
          
        </div>

      </div>
    </div>
  </nav>
  <div class="modal fade" id="cfmDialog" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{cfmDlgTitle}}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <h6>{{cfmDlgCont}}</h6>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
          <button type="button" class="btn btn-primary" @click.prevent="runOrSyncKanban();">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref, computed, watch} from 'vue'
import { getSyncStatus, runKanban, syncKanban, syncCluster } from "../lib/opApi.js";
import {Modal} from "bootstrap";
import { useZskbStore } from "../store/zskbStore";
import {storeToRefs} from 'pinia'
import { useComposeStore } from '../store/composeStore';

const zskbStore = useZskbStore()
const {rtRates} = storeToRefs(zskbStore)

const composeStore = useComposeStore()
const { totMoney, totPositiveNum, totPoleNum, totEarnMoney, totEarnRate, totSetBuy, totPlanBuy, diffBuySet } = storeToRefs(composeStore)

const cfmDlgTitle = ref("")
const cfmDlgCont = ref("")
const cfmDlgType = ref("")

const server_status_objs = ref(null) 
const isSynced = computed(() => {
  if (server_status_objs.value == null) {
		return false
	} else if (server_status_objs.value['curr_date'] === server_status_objs.value['latest_probe_date'] 
  && server_status_objs.value['curr_date'] === server_status_objs.value['latest_subs_date']) {
		return true
	} else {
		return false
	}
})

const uptTime = ref("")
watch(rtRates, () => {
  if (rtRates.value.hasOwnProperty('current_time') && rtRates.value.hasOwnProperty('kanban_time')) {
    if (rtRates.value['current_time'] > rtRates.value['kanban_time']) {
      uptTime.value = rtRates.value['current_time']
    } else {
      uptTime.value = rtRates.value['kanban_time']
    }
  } else {
    uptTime.value = ""
  }
}, {immediate: true})

const dlgController = ref({cfmDlg: null})
onMounted(async () => {
  dlgController.value.cfmDlg = new Modal('#cfmDialog', {})
  server_status_objs.value = await getSyncStatus()
})

function runKanban4ui() {
  cfmDlgTitle.value = "确认"
  cfmDlgCont.value = "要在服务器上运行看板吗？"
  cfmDlgType.value = "run kanban"
  dlgController.value.cfmDlg.show()
}

function syncKanban4ui() {
  cfmDlgTitle.value = "确认"
  cfmDlgCont.value = "要同步看板数据吗？"
  cfmDlgType.value = "sync kanban"
  dlgController.value.cfmDlg.show()
}

function syncCluster4ui() {
  cfmDlgTitle.value = "确认"
  cfmDlgCont.value = "要同步android集群数据吗？"
  cfmDlgType.value = "sync cluster"
  dlgController.value.cfmDlg.show()
}

function runOrSyncKanban() {
  if (cfmDlgType.value === "run kanban") {
    runKanban()
  } else if (cfmDlgType.value === "sync kanban") {
    syncKanban()
  } else if (cfmDlgType.value === "sync cluster") {
    syncCluster()
  }
  dlgController.value.cfmDlg.hide()
}

</script>

<style scoped>
a.router-link-exact-active {
  background-color: cyan;
  color: red;
  border: solid 1px cyan;
  /*border-radius: 1px;*/
  font-weight: 900;
}

.blink_me {
  animation: blinker 10s linear infinite;
}

@keyframes blinker {
  50% {
    opacity: 0;
  }
}

.sep_line {
  height: 1px;
  border: solid 1px white;
  margin: 2px -8px;
  box-sizing: border-box;
}
</style>