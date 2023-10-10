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
          ID名称信息
        </th>
        <th :style="{'width': colWidMap['col_2'] + 'rem'}">
          最小
        </th>
        <th :style="{'width': colWidMap['col_3'] + 'rem'}">
          平均
        </th>
        <th :style="{'width': colWidMap['col_4'] + 'rem'}">
          最大
        </th>
        <th :style="{'width': colWidMap['col_5'] + colWidMap['col_6'] + 'rem'}" colspan="2">
          <div>
            <div class="w50_w_br">
              <span>高点</span>
            </div>
            <div class="w50_w_br" style="border: none;">
              <span>低点</span>
            </div>
          </div>
        </th>
        <th :style="{'width': colWidMap['col_7'] + 'rem'}">
          持有情况
        </th>
        <th :style="{'width': colWidMap['col_8'] + 'rem'}">
          购入设定
        </th>
        <th :style="{'width': colWidMap['col_9'] + 'rem'}">
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
      </tr>
      </thead>
      <tbody>
      <template v-for="oneRow in composeViewObjs" :key="oneRow.fund_id">
        <tr v-bind:id="oneRow.fund_id">
          <td>
            <template v-if="oneRow['kbObj']">
              <div>{{oneRow.fund_id}}&nbsp;
                <span style="font-size: 1rem; font-style: italic;text-decoration: underline;">
                  {{oneRow.kbObj.statistics.last_perc_date_str}}
                </span>
              </div>
              <div>{{oneRow.fund_name}}&nbsp;
                <span style="font-size: 1rem; font-style: italic;text-decoration: underline;">
                  {{oneRow.kbObj.statistics.fund_perc_len}}
                </span>
              </div>
              <div>
                <span v-bind:class="getCardStyle(oneRow.kbObj.statistics.day_200_thres)">&nbsp;</span>
                <span v-bind:class="getCardStyle(oneRow.kbObj.statistics.day_300_thres)">&nbsp;</span>
                <span v-bind:class="getCardStyle(oneRow.kbObj.statistics.day_400_thres)">&nbsp;</span>
                <span v-bind:class="getCardStyle(oneRow.kbObj.statistics.day_500_thres)">&nbsp;</span>
                <span v-bind:class="getCardStyle(oneRow.kbObj.statistics.day_600_thres)">&nbsp;</span>
              </div>
            </template>
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
            <template v-if="oneRow['kbObj']">
              <div style="height: 2.2em; position: relative;"
                   v-bind:class="getPosColor(oneRow.kbObj.positive.positive_reach_len)">
                  <span v-if="oneRow.kbObj.positive.positive_reach_len >= 4" class="icon_pos">
                  <i class="bi bi-arrow-up-circle-fill"></i>
                  <span class="lv_font">{{ oneRow.kbObj.positive.positive_reach_len }}</span>
                  </span>
              </div>
              <div style="height: 2.2em; position: relative;"
                   v-bind:class="getNegColor(oneRow.kbObj.negative.negative_reach_len)">
                <span v-if="oneRow.kbObj.negative.negative_reach_len >= 3" class="icon_pos">
                <i class="bi bi-arrow-down-circle-fill"></i>
                  <span class="lv_font">{{ oneRow.kbObj.negative.negative_reach_len }}</span>
                </span>
              </div>
            </template>
          </td>
          <td>
            <template v-if="oneRow['kbObj']">
              <div style="height: 2.2em;">
                <span v-bind:class="getHitStyle(oneRow.kbObj.positive.day_5_positive_reach)">&nbsp;</span>
                <span v-bind:class="getHitStyle(oneRow.kbObj.positive.day_10_positive_reach)">&nbsp;</span>
                <span v-bind:class="getHitStyle(oneRow.kbObj.positive.day_20_positive_reach)">&nbsp;</span>
                <span v-bind:class="getHitStyle(oneRow.kbObj.positive.day_60_positive_reach)">&nbsp;</span>
                <span v-bind:class="getHitStyle(oneRow.kbObj.positive.day_90_positive_reach)">&nbsp;</span>
                <span v-bind:class="getHitStyle(oneRow.kbObj.positive.day_120_positive_reach)">&nbsp;</span>
                <span v-bind:class="getHitStyle(oneRow.kbObj.positive.day_160_positive_reach)">&nbsp;</span>
                <span v-bind:class="getHitStyle(oneRow.kbObj.positive.day_220_positive_reach)">&nbsp;</span>
              </div>
              <div style="height: 2.2em;">
                <span v-bind:class="getHitStyle(oneRow.kbObj.negative.day_5_negative_reach)">&nbsp;</span>
                <span v-bind:class="getHitStyle(oneRow.kbObj.negative.day_10_negative_reach)">&nbsp;</span>
                <span v-bind:class="getHitStyle(oneRow.kbObj.negative.day_20_negative_reach)">&nbsp;</span>
                <span v-bind:class="getHitStyle(oneRow.kbObj.negative.day_60_negative_reach)">&nbsp;</span>
                <span v-bind:class="getHitStyle(oneRow.kbObj.negative.day_90_negative_reach)">&nbsp;</span>
                <span v-bind:class="getHitStyle(oneRow.kbObj.negative.day_120_negative_reach)">&nbsp;</span>
                <span v-bind:class="getHitStyle(oneRow.kbObj.negative.day_160_negative_reach)">&nbsp;</span>
                <span v-bind:class="getHitStyle(oneRow.kbObj.negative.day_220_negative_reach)">&nbsp;</span>
              </div>
            </template>
          </td>
          <td>
            <template v-if="oneRow['kbObj']">
              <div>
                持有:
              </div>
              <div>
                盈利:
              </div>
              <div>
                计:
              </div>
            </template>
          </td>
          <td>
            <div>
              当前:
            </div>
            <div>
              决策:
            </div>
            <div>
              保存
            </div>
          </td>
          <td>
            <button type="button" class="btn btn-primary" @click="oneRow['show_detail'] = !oneRow['show_detail'];">
              详情
            </button>
          </td>
        </tr>
        <template v-if="oneRow['show_detail']">
          <tr>
            <td colspan="9" id="table_container">
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
  getCardStyle,
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
  'col_1': 12,
  'col_2': 3,
  'col_3': 3,
  'col_4': 3,
  'col_5': 3,
  'col_6': 10,
  'col_7': 7,
  'col_8': 7,
  'col_9': 4
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
  /*
  if (zskbObjs && zskbObjs.value && zskbObjs.value.length > 0 && composeViewObjs.value.length > 0) {
    composeViewObjs.value.forEach(item => {
      item['kbObj'] = zskbObjs.value.find(elem => elem['fund_id'] === item['fund_id'])
    })
  }*/
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