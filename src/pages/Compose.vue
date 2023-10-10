<template>
  <div :style="topSecClass">
    <div id="op_pane" :style="{ 'height': opPaneHeight + 'rem' }" class="grid_pane_c12">
      <div>组合名称</div>
      <select class="form-select nr_select" style="grid-column: 2 / span 2;" v-model="compose_name">
        <option v-for="option in buy_in_from_plan" v-bind:value="option.source_val">
          {{ option.source_name }}
        </option>
      </select>
      <input class="btn btn-warning btn-sm" type="button" value="刷新">
    </div>
    <table id="table_header" class="table table-bordered" style="margin-bottom: 0;">
      <thead style="">
      <tr :style="{'height': tabHeaderHeight + 'rem'}">
        <th :style="{'width': colWidMap['col_1'] + 'rem'}">
        </th>
        <th :style="{'width': colWidMap['col_2'] + 'rem'}">
        </th>
        <th :style="{'width': colWidMap['col_3'] + 'rem'}">
        </th>
        <th :style="{'width': colWidMap['col_4'] + 'rem'}">
        </th>
        <th :style="{'width': colWidMap['col_5'] + 'rem'}">
        </th>
        <th :style="{'width': colWidMap['col_6'] + 'rem'}">
        </th>
        <th :style="{'width': colWidMap['col_7'] + 'rem'}">
        </th>
        <th :style="{'width': colWidMap['col_8'] + 'rem'}">
        </th>
        <th :style="{'width': colWidMap['col_9'] + 'rem'}">
        </th>
        <th :style="{'width': colWidMap['col_10'] + 'rem'}">
        </th>
        <th :style="{'width': colWidMap['col_11'] + 'rem'}">
        </th>
        <th :style="{'width': colWidMap['col_12'] + 'rem'}">
        </th>
      </tr>
      </thead>
      <tbody>
      </tbody>
    </table>
  </div>

  <div style="position: relative;">
    <table id="cust_table_content" class="table table-bordered cust_table_cls"
           :style="{'position': 'absolute', 'top': tabContTopPos + 'rem', 'min-width': minPaneWidth + 'rem'}">
      <thead style="">
      <tr>
        <th :style="{'width': colWidMap['col_1'] + 'rem'}"></th>
        <th :style="{'width': colWidMap['col_2'] + 'rem'}"></th>
        <th :style="{'width': colWidMap['col_3'] + 'rem'}"></th>
        <th :style="{'width': colWidMap['col_4'] + 'rem'}"></th>
        <th :style="{'width': colWidMap['col_5'] + 'rem'}"></th>
        <th :style="{'width': colWidMap['col_6'] + 'rem'}"></th>
        <th :style="{'width': colWidMap['col_7'] + 'rem'}"></th>
        <th :style="{'width': colWidMap['col_8'] + 'rem'}"></th>
        <th :style="{'width': colWidMap['col_9'] + 'rem'}"></th>
        <th :style="{'width': colWidMap['col_10'] + 'rem'}"></th>
        <th :style="{'width': colWidMap['col_11'] + 'rem'}"></th>
        <th :style="{'width': colWidMap['col_12'] + 'rem'}"></th>
      </tr>
      </thead>
      <tbody>
      <template v-for="oneRow in composeViewObjs" :key="oneRow.fund_id">
        <tr v-bind:id="oneRow.fund_id">
          <td>
            {{oneRow.fund_id}}
          </td>
          <td>
            {{oneRow.fund_name}}
          </td>
          <td>
            <div>
              {{ oneRow?.kbObj.statistics.min_earn_str }}
            </div>
            <div>
              {{ oneRow?.kbObj.statistics.min_earn_aux_str }}
            </div>
            <div>
              {{ oneRow?.kbObj.statistics.min_earn_tri_str }}
            </div>
          </td>
          <td>
            <div>
              {{ oneRow?.kbObj.statistics.avg_earn_str }}
            </div>
            <div>
              {{ oneRow?.kbObj.statistics.avg_earn_aux_str }}
            </div>
            <div>
              {{ oneRow?.kbObj.statistics.avg_earn_tri_str }}
            </div>
          </td>
          <td>
            <div>
              {{ oneRow?.kbObj.statistics.max_earn_str }}
            </div>
            <div>
              {{ oneRow?.kbObj.statistics.max_earn_aux_str }}
            </div>
            <div>
              {{ oneRow?.kbObj.statistics.max_earn_tri_str }}
            </div>
          </td>
          <td>
          </td>
          <td>
          </td>
          <td>
          </td>
          <td>
          </td>
          <td>
          </td>
          <td>
          </td>
          <td>
            <button type="button" class="btn btn-primary" @click="oneRow['show_detail'] = !oneRow['show_detail'];">
              详情
            </button>
          </td>
        </tr>
        <template v-if="oneRow['show_detail']">
          <tr>
            <td colspan="12" id="table_container">
              <div>
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th></th>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td>1</td>
                    <td>2</td>
                    <td>3</td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </td>
          </tr>
        </template>
      </template>
      </tbody>
    </table>
  </div>

</template>

<script setup>
import '../assets/style.scss'
import '../style.css'
import {
  opPaneHeight,
  tabHeaderHeight,
  tabContTopPos,
  minPaneWidth,
  topSecClass,
  getPosColor,
  getNegColor,
  getHitStyle
} from "../lib/commonUtils.js"
import { onMounted, computed, ref, watch, nextTick } from "vue";
import { storeToRefs } from 'pinia'
import {useComposeStore} from "../store/composeStore.js";
import {useZskbStore} from "../store/zskbStore.js"

const composeStore = useComposeStore()
const {composeObjs, fixedHoldObjs} = storeToRefs(composeStore)
const {getAllCompose, setComposeProperty, getComposeFixedHold} = composeStore
const zskbStore = useZskbStore()
const {zskbObjs} = storeToRefs(zskbStore)

const buy_in_from_plan = [
  {'source_name': '全部', 'source_val': 'all'},
  {'source_name': '橄榄树', 'source_val': 'ovtree'},
  {'source_name': '海豚', 'source_val': 'dolphin'},
  {'source_name': '三叉戟', 'source_val': 'trident'}
]

const colWidMap = {
  'col_1': 4,
  'col_2': 8,
  'col_3': 3,
  'col_4': 3,
  'col_5': 3,
  'col_6': 4,
  'col_7': 3,
  'col_8': 11,
  'col_9': 4.5,
  'col_10': 4.5,
  'col_11': 4.5,
  'col_12': 5
}

const compose_name = ref('all')
watch(compose_name, () => {
  getComposeFixedHold(compose_name.value)
}, {immediate: true})

const composeViewObjs = ref([])
watch([composeObjs, compose_name, zskbObjs], () => {
  composeViewObjs.value = []
  if (composeObjs && composeObjs.value && composeObjs.value.length > 0) {
    if (compose_name.value === 'all') {
      composeObjs.value.forEach(item => {
        composeViewObjs.value.push(...item['compose_objs'])
      })
    } else {
      composeViewObjs.value = composeObjs.value.find(item => item['compose_name'] === compose_name.value)['compose_objs']
    }
  }
  if (zskbObjs && zskbObjs.value && zskbObjs.value.length > 0 && composeViewObjs.value.length > 0) {
    composeViewObjs.value.forEach(item => {
      item['kbObj'] = zskbObjs.value.find(elem => elem['fund_id'] === item['fund_id'])
    })
  }
}, {immediate: true})

</script>

<style scoped>
.cust_table_cls th {
  line-height: 0 !important;
  padding: 0 !important;
}

.cust_table_cls td {
  padding: 0.5rem 0.5rem 0.5rem 0.5rem !important;
  vertical-align: middle !important;
}

#table_container {
  padding: 0 !important;
}
</style>