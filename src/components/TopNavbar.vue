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
          <router-link to="/" class="nav-item nav-link">仓库</router-link>
          <router-link to="/kanban" class="nav-item nav-link">看板</router-link>
          <router-link to="/composite" class="nav-item nav-link">组合</router-link>
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
            </ul>
          </li>
        </ul>
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
import {onMounted, ref, computed} from 'vue'
import { getSyncStatus, runKanban, syncKanban } from "../lib/opApi.js";
import {Modal} from "bootstrap";

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

function runOrSyncKanban() {
  if (cfmDlgType.value === "run kanban") {
    runKanban()
  } else if (cfmDlgType.value === "sync kanban") {
    syncKanban()
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
}</style>