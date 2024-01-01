<template>
  <div :style="topSecClass">
    <div id="op_pane" :style="{ 'height': opPaneHeight + 'rem' }" class="grid_pane_c12">
      <div>请求ID号(,)</div>
      <input type="text" v-model="requireFundIds" class="form-control-plaintext search_box"
        style="grid-column: 2 / span 3; padding-left: 0.5rem;">
      <input class="btn btn-primary btn-sm" type="button" value="请求" @click="requireDynValues4ui();">
      <input class="btn btn-warning btn-sm" type="button" value="刷新" @click="getRecordsAndRates('refresh');">
      <input class="btn btn-secondary btn-sm" type="button" v-bind:value="canAddAllFlag? '全选' : '取消'" 
      @click="allAllFundIntoRequestList();">
      <input type="text" v-model="searchFundName" class="form-control-plaintext search_box"
             style="grid-column: 8 / span 2; padding-left: 0.5rem;" @keyup.enter="excuteSearchFund()">
      <input class="btn btn-primary btn-sm" type="button" value="查找" @click="excuteSearchFund();">
    </div>
    <table id="table_header" class="table table-bordered" style="margin-bottom: 0;">
      <thead style="">
        <tr :style="{ 'height': tabHeaderHeight + 'rem' }">
          <th :style="{ 'width': colWidMap['col_1'] + 'rem' }">
            <div class="w50_w_br">
              <span>名称</span>
            </div>
            <div class="w50_w_br" @click="sortByField('update_date')" style="border: none;">
              <template v-if="sortFieldName === 'update_date'">
                <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
                <span v-else><i class="bi bi-arrow-down"></i></span>
              </template>
              <span>更新</span>
            </div>
          </th>
          <th :style="{ 'width': colWidMap['col_2'] + 'rem' }">
            <span>收益率</span>
          </th>
          <th :style="{ 'width': colWidMap['col_3'] + 'rem' }" @click="sortByField('hold_days')">
            <template v-if="sortFieldName === 'hold_days'">
              <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
              <span v-else><i class="bi bi-arrow-down"></i></span>
            </template>
            <span>买入</span>
          </th>
          <th :style="{ 'width': colWidMap['col_4'] + 'rem' }" @click="sortByField('last_sold')">
            <template v-if="sortFieldName === 'last_sold'">
              <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
              <span v-else><i class="bi bi-arrow-down"></i></span>
            </template>
            <span>卖出</span>
          </th>
          <th :style="{ 'width': colWidMap['col_5'] + 'rem' }" @click="sortByField('action_times')">
            <template v-if="sortFieldName === 'action_times'">
              <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
              <span v-else><i class="bi bi-arrow-down"></i></span>
            </template>
            <span>次数</span>
          </th>
          <th :style="{ 'width': colWidMap['col_6'] + 'rem' }" @click="sortByField('sold_perc')">
            <template v-if="sortFieldName === 'sold_perc'">
              <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
              <span v-else><i class="bi bi-arrow-down"></i></span>
            </template>
            <span>卖出时</span>
          </th>
          <th :style="{ 'width': colWidMap['col_7'] + 'rem' }" @click="sortByField('latest_perc')">
            <template v-if="sortFieldName === 'latest_perc'">
              <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
              <span v-else><i class="bi bi-arrow-down"></i></span>
            </template>
            <span>最近值</span>
          </th>
          <th :style="{ 'width': colWidMap['col_8'] + 'rem' }">
            <span>操作</span>
          </th>
        </tr>
      </thead>
      <tbody>
      </tbody>
    </table>
  </div>

  <div style="position: relative;">
    <table id="table_content" class="table table-bordered"
      :style="{ 'position': 'absolute', 'top': tabContTopPos + 'rem', 'min-width': minPaneWidth + 'rem' }">
      <thead style="">
        <tr>
          <th :style="{ 'width': colWidMap['col_1'] + 'rem' }"></th>
          <th :style="{ 'width': colWidMap['col_2'] + 'rem' }"></th>
          <th :style="{ 'width': colWidMap['col_3'] + 'rem' }"></th>
          <th :style="{ 'width': colWidMap['col_4'] + 'rem' }"></th>
          <th :style="{ 'width': colWidMap['col_5'] + 'rem' }"></th>
          <th :style="{ 'width': colWidMap['col_6'] + 'rem' }"></th>
          <th :style="{ 'width': colWidMap['col_7'] + 'rem' }"></th>
          <th :style="{ 'width': colWidMap['col_8'] + 'rem' }"></th>
        </tr>
      </thead>
      <tbody>
        <template v-for="oneRow in dynRecordObjs" :key="oneRow.fund_id">
          <tr v-bind:id="oneRow.fund_id" 
              :ref="(el) => { if (el) { rowElements[oneRow.fund_id] = el; } }"
              v-bind:class="{ sel_row: oneRow['currSelected'] }">
            <td v-bind:class="{ sel_row: oneRow['currSelected'] }">
              <div>{{ oneRow.fund_id }}</div>
              <div>{{ oneRow.fund_name }}</div>
              <div>净值日:&nbsp;<span class="text-bg-danger">{{ oneRow.statistics?.latest_price_date }}</span></div>
            </td>
            <td v-bind:class="{ sel_row: oneRow['currSelected'] }">
              <template v-if="zskbViewObjs && zskbViewObjs[oneRow.fund_id]">
                <div>
                  {{ zskbViewObjs[oneRow.fund_id]['statistics']['min_earn_str'] }}&nbsp;
                  {{ zskbViewObjs[oneRow.fund_id]['statistics']['avg_earn_str'] }}&nbsp;
                  {{ zskbViewObjs[oneRow.fund_id]['statistics']['max_earn_str'] }}
                </div>
                <div>
                  {{ zskbViewObjs[oneRow.fund_id]['statistics']['min_earn_aux_str'] }}&nbsp;
                  {{ zskbViewObjs[oneRow.fund_id]['statistics']['avg_earn_aux_str'] }}&nbsp;
                  {{ zskbViewObjs[oneRow.fund_id]['statistics']['max_earn_aux_str'] }}
                </div>
                <div>
                  {{ zskbViewObjs[oneRow.fund_id]['statistics']['min_earn_tri_str'] }}&nbsp;
                  {{ zskbViewObjs[oneRow.fund_id]['statistics']['avg_earn_tri_str'] }}&nbsp;
                  {{ zskbViewObjs[oneRow.fund_id]['statistics']['max_earn_tri_str'] }}
                </div>
              </template>
            </td>
            <td v-bind:class="{ sel_row: oneRow['currSelected'] }">
              <div>起:&nbsp;{{ oneRow.statistics?.buy_first_day }}</div>
              <div>止:&nbsp;{{ oneRow.statistics?.buy_last_day }}</div>
              <div>计:&nbsp;{{ oneRow.statistics?.tot_exchange_days }}天</div>
              <div>共:&nbsp;{{ oneRow.statistics?.tot_hold_days }}天</div>
            </td>
            <td style="line-height: 1.2rem;" v-bind:class="{ sel_row: oneRow['currSelected'] }">
              <template v-if="oneRow.soldHistoryWrapper" :key="one_sold.date_str">
                <template v-for="(one_sold, index) in oneRow.soldHistoryWrapper">
                  <span v-if="index === oneRow.soldHistoryWrapper.length - 1" class="text-bg-danger">{{ one_sold?.date_str }}</span>
                  <span v-else>{{ one_sold?.date_str }},&nbsp;</span>
                </template>
              </template>
            </td>
            <td v-bind:class="{ sel_row: oneRow['currSelected'] }">
              <div>买:&nbsp;{{ oneRow.statistics?.buy_times }}</div>
              <div>卖:&nbsp;{{ oneRow.statistics?.sold_times }}</div>
              <div>加:&nbsp;{{ oneRow.statistics?.asc_money_times }}</div>
              <div>减:&nbsp;{{ oneRow.statistics?.desc_money_times }}</div>
            </td>
            <td style="line-height: 1.2rem;" v-bind:class="{ sel_row: oneRow['currSelected'] }">
              <div class="text-bg-danger">卖:&nbsp;{{ oneRow.statistics?.last_sold_profit?.currStatistics?.tot_profit_perc_str }}</div>
              <template v-if="oneRow.statistics &&
                oneRow.statistics.last_sold_wide_profit &&
                oneRow.statistics.last_sold_wide_profit.length > 4">
                <div>上:&nbsp;{{ oneRow.statistics.last_sold_wide_profit[0]?.profit_perc_str }}</div>
                <div>深:&nbsp;{{ oneRow.statistics.last_sold_wide_profit[1]?.profit_perc_str }}</div>
                <div>沪:&nbsp;{{ oneRow.statistics.last_sold_wide_profit[2]?.profit_perc_str }}</div>
                <div>中:&nbsp;{{ oneRow.statistics.last_sold_wide_profit[3]?.profit_perc_str }}</div>
                <div>创:&nbsp;{{ oneRow.statistics.last_sold_wide_profit[4]?.profit_perc_str }}</div>
              </template>
            </td>
            <td style="line-height: 1.2rem;" v-bind:class="{ sel_row: oneRow['currSelected'] }">
              <div>卖:&nbsp;{{ oneRow.statistics?.latest_price_date_profit?.tot_profit_perc_str }}</div>
              <template v-if="oneRow.statistics &&
                oneRow.statistics.latest_price_date_wide_profit &&
                oneRow.statistics.latest_price_date_wide_profit.length > 4">
                <div>上:&nbsp;{{ oneRow.statistics.latest_price_date_wide_profit[0]?.profit_perc_str }}</div>
                <div>深:&nbsp;{{ oneRow.statistics.latest_price_date_wide_profit[1]?.profit_perc_str }}</div>
                <div>沪:&nbsp;{{ oneRow.statistics.latest_price_date_wide_profit[2]?.profit_perc_str }}</div>
                <div>中:&nbsp;{{ oneRow.statistics.latest_price_date_wide_profit[3]?.profit_perc_str }}</div>
                <div>创:&nbsp;{{ oneRow.statistics.latest_price_date_wide_profit[4]?.profit_perc_str }}</div>
              </template>
            </td>
            <td style="text-align: center; padding-top: 0 !important; padding-bottom: 0 !important;" 
            v-bind:class="{ sel_row: oneRow['currSelected'] }">
              <div class="flex_col" style="height: 9rem;">
                <button type="button" class="btn btn-primary" @click="genReport(oneRow)">
                  报告
                </button>
                <button type="button" class="btn btn-secondary" @click="addFundId4UpdateDynValue(oneRow['fund_id'])">
                  <template v-if="oneRow['add_refresh_flag']">
                    ✓刷新
                  </template>
                  <template v-else>
                    刷新
                  </template>
                </button>
                <button type="button" class="btn btn-warning" @click="removeLocalDynvalue(oneRow['fund_id'], oneRow['fund_name'])">
                  删除
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="currDynValue && currDynValue['fund_id'] == oneRow['fund_id']">
            <td colspan=8>
              <div class="op_pane flex_act_pane">
                <button type="button" class="btn btn-secondary from_ctl_nr" @click="yAxisTopAdjTimes += 1;">
                  增加顶
                </button>
                <button type="button" class="btn btn-secondary from_ctl_nr" @click="yAxisTopAdjTimes -= 1;">
                  减小顶
                </button>
                <button type="button" class="btn btn-secondary from_ctl_nr" @click="yAxisBtmAdjTimes += 1;">
                  增加底
                </button>
                <button type="button" class="btn btn-secondary from_ctl_nr" @click="yAxisBtmAdjTimes -= 1;">
                  减小底
                </button>
                <button type="button" class="btn btn-secondary from_ctl_nr" @click="picHeightAdjVal += 20;">
                  增加高
                </button>
                <button type="button" class="btn btn-secondary from_ctl_nr" @click="picHeightAdjVal -= 20;">
                  减小高
                </button>
                <input type="text" class="from_ctl_nr" style="width: 6.5rem;" v-model="oneRow['remove_asc_or_desc_or_sold_date']">
                <button type="button" class="btn btn-secondary from_ctl_nr" @click="remove_Asc_or_Desc_or_Sold_Date(oneRow)"
                        v-bind:disabled="!oneRow['remove_date_type'] || oneRow['remove_date_type'] ===''">
                  <template v-if="!oneRow['remove_date_type'] || oneRow['remove_date_type'] ===''">
                    移除选择
                  </template>
                  <template v-else-if="oneRow['remove_date_type'] === 'asc'">
                    移除+
                  </template>
                  <template v-else-if="oneRow['remove_date_type'] === 'desc'">
                    移除-
                  </template>
                  <template v-else-if="oneRow['remove_date_type'] === 'sold'">
                    移除卖
                  </template>
                </button>
                <input type="text" class="from_ctl_nr" style="width: 6.5rem;" v-model="oneRow['cut_buy_date_left_or_right']">
                <!--
                <button type="button" class="btn btn-secondary from_ctl_nr" @click="cutBuyDate_left(oneRow)"
                v-bind:disabled="!oneRow['cut_buy_date_left_or_right'] || oneRow['cut_buy_date_left_or_right'] === ''">
                  左截取
                </button>
                -->
                <button type="button" class="btn btn-secondary from_ctl_nr" @click="cutBuyDate_right(oneRow)"
                        v-bind:disabled="!oneRow['cut_buy_date_left_or_right'] || oneRow['cut_buy_date_left_or_right'] === ''">
                  右截取
                </button>
                <button type="button" class="btn btn-primary from_ctl_nr" @click="genTextReport()">
                  文档
                </button>
              </div>
              <div id="hc_container">
                <highcharts :constructor-type="'stockChart'" :options="chartOptions" />
              </div>
            </td>
          </tr>
        </template>
      </tbody>
      <tfoot>
      <tr style="line-height: 5rem; border-color: white;">
        <td colspan="8">
          &nbsp;
        </td>
      </tr>
      </tfoot>
    </table>
  </div>
  <div class="modal fade" id="reportDialog" tabindex="-1">
    <div class="modal-dialog" style="max-width: 48rem;">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ cfmDlgTitle }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <template v-if="cfmDlgType === 'get dynvalues'">
            <h6 style="word-break:break-all;">{{ cfmDlgCont }}:&nbsp;{{ requireFundIds }}</h6>
            <h6 class="bg-danger" v-if="requireFundIds.trim().length === 0">非法的请求ID</h6>
          </template>
          <template v-if="cfmDlgType === 'gen report'">
            <textarea style="width: 100%; height: 30rem;">{{ cfmDlgCont }}</textarea>
          </template>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
          <template v-if="cfmDlgType === 'get dynvalues'">
            <button type="button" class="btn btn-primary" v-bind:disabled="requireFundIds.trim().length === 0"
              @click.prevent="executeAction();">确认</button>
          </template>
        </div>
      </div>
    </div>
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
  topSecClass
} from "../lib/commonUtils.js"
import { onMounted, computed, ref, watch, nextTick } from "vue";
import { storeToRefs } from 'pinia'
import { useZskbStore } from '../store/zskbStore';
import { useReportStore } from "../store/reportStore.js";
import { Modal, Alert } from "bootstrap";

const zskbStore = useZskbStore()
const { zskbObjs } = storeToRefs(zskbStore)

const reportStore = useReportStore()
const { dynRecordObjs } = storeToRefs(reportStore)
const { requireDynValues, getRecordsAndRates, removeLocalDynvalue } = reportStore

const colWidMap = {
  'col_1': 6,
  'col_2': 5,
  'col_3': 5,
  'col_4': 4,
  'col_5': 3,
  'col_6': 3.5,
  'col_7': 3.5,
  'col_8': 4
}

// getRecordsAndRates('no')

const zskbViewObjs = ref({})
watch(zskbObjs, () => {
  zskbObjs.value.forEach(element => {
    zskbViewObjs.value[element['fund_id']] = element
  })
}, {immediate: true})

const cfmDlgTitle = ref("")
const cfmDlgCont = ref("")
const cfmDlgType = ref("")
const dlgController = ref({ reportDlg: null })

onMounted(() => {
  dlgController.value.reportDlg = new Modal('#reportDialog', {})
})

const requireFundIds = ref("")
watch(requireFundIds, () => {
  dynRecordObjs.value.forEach(obj => {
      obj['add_refresh_flag'] = false
  })

  let _fundIds = requireFundIds.value.split(",")
  _fundIds.forEach(element => {
    if (element.trim().length === 6) {
      dynRecordObjs.value.forEach(obj => {
        if (obj.fund_id === element.trim()) {
          obj['add_refresh_flag'] = true
        }
      })
    }
  })
})

function requireDynValues4ui() {
  cfmDlgTitle.value = "确认"
  cfmDlgCont.value = "要请求动态数据吗"
  cfmDlgType.value = "get dynvalues"
  dlgController.value.reportDlg.show()
}

function executeAction() {
  if (cfmDlgType.value === "get dynvalues") {
    requireDynValues(requireFundIds.value)
  }
  dlgController.value.reportDlg.hide()
}

function addFundId4UpdateDynValue(_fund_id) {
  if (requireFundIds.value.trim() === '') {
    requireFundIds.value = _fund_id.trim()
  } else if (requireFundIds.value.indexOf(_fund_id.trim()) === -1) {
    requireFundIds.value = requireFundIds.value.trim() + ',' + _fund_id.trim()
  } else {
    let _fundIds = requireFundIds.value.split(",")
    let _fundIds_filtered = _fundIds.filter((elem) => elem !== _fund_id)
    requireFundIds.value = _fundIds_filtered.join(",")
  }
  if (!requireFundIds.value || requireFundIds.value.trim() === '') {
    canAddAllFlag.value = true
  } else {
    canAddAllFlag.value = false
  }
}

const canAddAllFlag = ref(true)
function allAllFundIntoRequestList() {
  if (!requireFundIds.value || requireFundIds.value.trim() === '') {
    if (dynRecordObjs && dynRecordObjs.value && dynRecordObjs.value.length > 0) {
      dynRecordObjs.value.forEach(elem => {
        addFundId4UpdateDynValue(elem['fund_id'])
      })
    }
    canAddAllFlag.value = false
  } else {
    requireFundIds.value = ""
    canAddAllFlag.value = true
  }
}

const searchFundName = ref("")
function excuteSearchFund() {
  dynRecordObjs.value.forEach((elem) => {
    elem['currSelected'] = false
  });
  if (searchFundName.value.trim() === '') {
    return
  }
  let _foundCnt = 0
  let arr = searchFundName.value.trim().split(" ")
  dynRecordObjs.value.forEach((elem) => {
    if (arr.length === 1) {
      let _cond_1 = arr[0].trim()
      if (elem['fund_name'].indexOf(_cond_1) !== -1) {
        elem['currSelected'] = true
        _foundCnt += 1
      }
    } else if (arr.length === 2) {
      let _cond_1 = arr[0].trim()
      let _cond_2 = arr[1].trim()
      if (elem['fund_name'].indexOf(_cond_1) !== -1 && elem['fund_name'].indexOf(_cond_2) !== -1) {
        elem['currSelected'] = true
        _foundCnt += 1
      }
    }
  })
  if (_foundCnt > 0) {
    sortByField('selected')
  } else {
    searchFundName.value = ""  
  }
}

const chartOptions = ref({
  rangeSelector: {
    selected: 6
  },
  chart: {
    height: 400
  },
  title: {
    text: '',
    style: {
      color: 'red'
    }
  },

  tooltip: {
    style: {
      width: '120px'
    },
    valueDecimals: 2,
    shared: true,
    formatter: function () {
      return new Date(this.x).toISOString().split("T")[0]
    }
  },

  yAxis: {
    title: {
      text: '指数走势'
    },
    labels: {
      enabled: false
    }
  },

  series: [
    {
      name: '指数净值',
      data: [], //priceData4draw.value,//priceData4draw.value,
      id: 'dataseries'
      // the event marker flags
    },
    {
      name: '买入点',
      data: [],
      id: 'dataseries1',
      type: 'scatter',
      // the event marker flags
      marker: {
        symbol: 'circle',
        radius: 2,
        // lineWidth: 2,
        // lineColor: ''
        fillColor: 'red',
        enabled: true
      },
      events: {
        click: function (e) {
          let _date_str = new Date(e.point.category).toISOString().split("T")[0]
          console.log("buy series click: ", e.point.category, " date_str: ", _date_str)
          fillInBuyDate(_date_str)
        }
      }
    },
    {
      name: '卖出点',
      data: [],
      id: 'dataseries2',
      type: 'scatter',
      // the event marker flags
      marker: {
        symbol: 'circle',
        radius: 4,
        // lineWidth: 2,
        // lineColor: ''
        fillColor: 'darkgreen',
        enabled: true
      },
      events: {
        click: function (e) {
          let _date_str = new Date(e.point.category).toISOString().split("T")[0]
          console.log("sold points series click: ", e.point.category, " date_str: ", _date_str)
          fillInSoldDate(_date_str)
        }
      }
    },
    {
      // asc money flag points
      name: '增加点',
      type: 'flags',
      data: [],
      onSeries: 'dataseries',
      shape: 'circlepin',
      width: 9,
      height: 9,
      lineWidth: 1,
      color: 'purple',
      style: {
        color: 'purple',
        fontSize: 15
      },
      events: {
        click: function (e) {
          let _date_str = new Date(e.point.category).toISOString().split("T")[0]
          console.log("asc flags series click: ", e.point.category, " date_str: ", _date_str)
          fillInAscDate(_date_str)
        }
      }
    },
    {
      // desc money flag points
      name: '减少点',
      type: 'flags',
      data: [],
      onSeries: 'dataseries',
      shape: 'circlepin',
      width: 9,
      height: 9,
      lineWidth: 1,
      color: 'blue',
      style: {
        color: 'blue',
        fontSize: 15
        // borderWidth: 3,
        // borderColor: 'red'
      },
      events: {
        click: function (e) {
          let _date_str = new Date(e.point.category).toISOString().split("T")[0]
          console.log("desc flags series click: ", e.point.category, " date_str: ", _date_str)
          fillInDescDate(_date_str)
        }
      }
    },
    {
      // buy flag points
      name: '买入标',
      type: 'flags',
      data: [],
      onSeries: 'dataseries',
      shape: 'circlepin',
      width: 20,
      height: 16,
      lineWidth: 2,
      color: 'red',
      style: {
        color: 'red'
      },
      events: {
        click: function (e) {
          console.log("buy flags series click: ", e)
        }
      }
    },
    {
      // sold flag points
      name: '卖出标',
      type: 'flags',
      data: [],
      onSeries: 'dataseries',
      shape: 'circlepin',
      width: 20,
      height: 16,
      lineWidth: 2,
      color: 'darkgreen',
      style: {
        color: 'darkgreen'
      },
      events: {
        click: function (e) {
          let _date_str = new Date(e.point.category).toISOString().split("T")[0]
          console.log("sold flag series click: ", e.point.category, " date_str: ", _date_str)
          fillInSoldDate(_date_str)
        }
      }
    }
  ]
});

const currDynValue = ref(null)
const minPriceVal = ref(0)
const maxPriceVal = ref(0)
const priceDistance = ref(0)

watch(currDynValue, () => {
  if (!currDynValue.value) {
    return
  }
  chartOptions.value['series'][0]['data'] = []
  chartOptions.value['series'][1]['data'] = []
  chartOptions.value['series'][2]['data'] = []
  chartOptions.value['series'][3]['data'] = []
  chartOptions.value['series'][4]['data'] = []
  chartOptions.value['series'][5]['data'] = []
  chartOptions.value['series'][6]['data'] = []


  let _price_arr = []
  // price list 
  chartOptions.value['title']['text'] = currDynValue.value['fund_id'] + " "
    + currDynValue.value['fund_name'] + " " + currDynValue.value['statistics']['tot_exchange_days'] + "天"
    + " 盈利" + " " + currDynValue.value['statistics'].last_sold_profit.currStatistics.tot_profit_perc_str

  let percList4draw = currDynValue.value['percList4draw']
  percList4draw.forEach(element => {
    let _timestamp = Date.parse(element[0])
    let _price = element[1]
    chartOptions.value['series'][0]['data'].push([_timestamp, _price])
    _price_arr.push(_price)
  });

  _price_arr.sort()
  minPriceVal.value = _price_arr[0]
  maxPriceVal.value = _price_arr[_price_arr.length - 1]
  priceDistance.value = maxPriceVal.value - minPriceVal.value

  // buy list
  let buyList4draw = currDynValue.value['buyList4draw']
  buyList4draw.forEach(element => {
    let _timestamp = Date.parse(element[0])
    let _price = element[1]
    chartOptions.value['series'][1]['data'].push([_timestamp, _price])
  })

  // sold list
  let soldList4draw = currDynValue.value['soldList4draw']
  soldList4draw.forEach(element => {
    let _timestamp = Date.parse(element['date_str'])
    let _price = element['accu_price_4_draw']
    chartOptions.value['series'][2]['data'].push([_timestamp, _price])
  })

  // buy flag list
  let _firstBuyTime = Date.parse(currDynValue.value['statistics']['buy_first_day'])
  chartOptions.value['series'][5]['data'].push({
    x: _firstBuyTime,
    title: '买入'
  })

  // sold flag list
  soldList4draw.forEach(element => {
    let _timestamp = Date.parse(element['date_str'])
    chartOptions.value['series'][6]['data'].push({
      x: _timestamp,
      title: '卖出'
    })
  })

  // money asc flag list
  let moneyAscChange4draw = currDynValue.value['moneyAscChange4draw']
  moneyAscChange4draw.forEach(element => {
    let _timestamp = Date.parse(element['date_str'])
    chartOptions.value['series'][3]['data'].push({
      x: _timestamp,
      title: '+'
    })
  })

  // money desc flag list
  let moneyDescChange4draw = currDynValue.value['moneyDescChange4draw']
  moneyDescChange4draw.forEach(element => {
    let _timestamp = Date.parse(element['date_str'])
    chartOptions.value['series'][4]['data'].push({
      x: _timestamp,
      title: '-'
    })
  })
}, {
  deep: true
})

function fillInAscDate(_date_str) {
  if (!currDynValue.value) {
    return
  }
  currDynValue.value['remove_asc_or_desc_or_sold_date'] = _date_str
  currDynValue.value['remove_date_type'] = 'asc'
  currDynValue.value['cut_buy_date_left_or_right'] = ""
}

function fillInDescDate(_date_str) {
  if (!currDynValue.value) {
    return
  }
  currDynValue.value['remove_asc_or_desc_or_sold_date'] = _date_str
  currDynValue.value['remove_date_type'] = 'desc'
  currDynValue.value['cut_buy_date_left_or_right'] = ""
}

function fillInSoldDate(_date_str) {
  if (!currDynValue.value) {
    return
  }
  currDynValue.value['remove_asc_or_desc_or_sold_date'] = _date_str
  currDynValue.value['remove_date_type'] = 'sold'
  currDynValue.value['cut_buy_date_left_or_right'] = ""
}

function fillInBuyDate(_date_str) {
  if (!currDynValue.value) {
    return
  }
  currDynValue.value['cut_buy_date_left_or_right'] = _date_str
  currDynValue.value['remove_asc_or_desc_or_sold_date'] = ""
  currDynValue.value['remove_date_type'] = ''
}

function removeAscDateByStr(_date_str, oneRow, _equal = true, _to_right = true) {
  let moneyAscChange4draw = currDynValue.value['moneyAscChange4draw']
  const date_match = _equal? (elem) => elem['date_str'] === _date_str : _to_right? (elem) => elem['date_str'] >= _date_str : (elem) => elem['date_str'] <= _date_str
  let _idx = moneyAscChange4draw.findIndex(date_match)
  if (_idx === -1) {
    return false
  }
  moneyAscChange4draw.splice(_idx, 1)
  oneRow['statistics']['adjust_money_times'] -= 1
  oneRow['statistics']['asc_money_times'] -= 1
  oneRow['statistics']['asc_money_dates'].splice(_idx, 1)
  return true
}

function removeAscDate(oneRow) {
  if (!oneRow['remove_asc_or_desc_or_sold_date'] || !currDynValue.value) {
    return
  }
  removeAscDateByStr(oneRow['remove_asc_or_desc_or_sold_date'].trim(), oneRow)
}

function removeDescDateByStr(_date_str, oneRow, _equal = true, _to_right = true) {
  let moneyDescChange4draw = currDynValue.value['moneyDescChange4draw']
  const date_match = _equal? (elem) => elem['date_str'] === _date_str : _to_right? (elem) => elem['date_str'] >= _date_str : (elem) => elem['date_str'] <= _date_str
  let _idx = moneyDescChange4draw.findIndex(date_match)
  if (_idx === -1) {
    return false
  }
  moneyDescChange4draw.splice(_idx, 1)
  oneRow['statistics']['adjust_money_times'] -= 1
  oneRow['statistics']['desc_money_times'] -= 1
  oneRow['statistics']['desc_money_dates'].splice(_idx, 1)
  return true
}

function removeDescDate(oneRow) {
  if (!oneRow['remove_asc_or_desc_or_sold_date'] || !currDynValue.value) {
    return
  }
  removeDescDateByStr(oneRow['remove_asc_or_desc_or_sold_date'].trim(), oneRow)
}

function removeSoldDateByStr(_date_str, oneRow) {
  let soldList4draw = currDynValue.value['soldList4draw']
  const date_match = (elem) => elem['date_str'] === _date_str
  let _idx = soldList4draw.findIndex(date_match)
  if (_idx === -1 || _idx === soldList4draw.length - 1) {
    return false
  }
  soldList4draw.splice(_idx, 1)

  let soldHistoryWrapper = currDynValue.value['soldHistoryWrapper']
  _idx = soldHistoryWrapper.findIndex(date_match)
  if (_idx === -1 || _idx === soldHistoryWrapper.length - 1) {
    return false
  }
  soldHistoryWrapper.splice(_idx, 1)
  oneRow['statistics']['sold_times'] -= 1
}

function removeSoldDate(oneRow) {
  if (!oneRow['remove_asc_or_desc_or_sold_date'] || !currDynValue.value) {
    return
  }
  removeSoldDateByStr(oneRow['remove_asc_or_desc_or_sold_date'].trim(), oneRow)
}

function remove_Asc_or_Desc_or_Sold_Date(oneRow) {
  if (!oneRow['remove_date_type']) {
    return;
  }
  if (oneRow['remove_date_type'] === 'asc') {
    removeAscDate(oneRow)
  } else if (oneRow['remove_date_type'] === 'desc') {
    removeDescDate(oneRow)
  } else if (oneRow['remove_date_type'] === 'sold') {
    removeSoldDate(oneRow)
  }
  oneRow['remove_asc_or_desc_or_sold_date'] = ""
  oneRow['remove_date_type'] = ''
}

function cutBuyDate_left(oneRow) {
  if (!oneRow['cut_buy_date_left_or_right'] || !currDynValue.value) {
    return
  }
  let buyList4draw = currDynValue.value['buyList4draw']
  let laterThans = buyList4draw.filter((obj) => obj[0] > oneRow['cut_buy_date_left_or_right'])
  currDynValue.value['buyList4draw'] = [...laterThans]
  oneRow['statistics']['buy_times'] = laterThans.length

  while (removeAscDateByStr(oneRow['cut_buy_date_left_or_right'], oneRow, false, false)) {
  }
  while (removeDescDateByStr(oneRow['cut_buy_date_left_or_right'], oneRow, false, false)) {
  }
  oneRow['cut_buy_date_left_or_right'] = ""
}

function cutBuyDate_right(oneRow) {
  if (!oneRow['cut_buy_date_left_or_right'] || !currDynValue.value) {
    return
  }
  let buyList4draw = currDynValue.value['buyList4draw']
  let earlierThans = buyList4draw.filter((obj) => obj[0] < oneRow['cut_buy_date_left_or_right'])
  currDynValue.value['buyList4draw'] = [...earlierThans]
  oneRow['statistics']['buy_times'] = earlierThans.length

  while (removeAscDateByStr(oneRow['cut_buy_date_left_or_right'], oneRow, false, true)) {
  }
  while (removeDescDateByStr(oneRow['cut_buy_date_left_or_right'], oneRow, false, true)) {
  }
  oneRow['cut_buy_date_left_or_right'] = ""
}

const sortFieldName = ref('')
const sortFieldFlag = ref(true)
function sortByField(_field) {
  if (sortFieldName.value === _field) {
    sortFieldFlag.value = !sortFieldFlag.value
  } else {
    sortFieldName.value = _field
    sortFieldFlag.value = true
  }
  if (_field === 'update_date') {
    if (sortFieldFlag.value) {
      dynRecordObjs.value.sort((a, b) => {
        let a_val = '9999-99-99', b_val = '9999-99-99'
        if (a['statistics'] && a['statistics']['latest_price_date']) {
          a_val = a['statistics']['latest_price_date'].replaceAll("-", "")
        }
        if (b['statistics'] && b['statistics']['latest_price_date']) {
          b_val = b['statistics']['latest_price_date'].replaceAll("-", "")
        }
        return parseInt(a_val) - parseInt(b_val)
      });
    } else {
      dynRecordObjs.value.sort((a, b) => {
        let a_val = '9999-99-99', b_val = '9999-99-99'
        if (a['statistics'] && a['statistics']['latest_price_date']) {
          a_val = a['statistics']['latest_price_date'].replaceAll("-", "")
        }
        if (b['statistics'] && b['statistics']['latest_price_date']) {
          b_val = b['statistics']['latest_price_date'].replaceAll("-", "")
        }
        return parseInt(b_val) - parseInt(a_val)
      });
    }
  }
  else if (_field === 'hold_days') {
    if (sortFieldFlag.value) {
      dynRecordObjs.value.sort((a, b) => {
        let a_val = 0, b_val = 0
        if (a['statistics'] && a['statistics']['tot_hold_days']) {
          a_val = a['statistics']['tot_hold_days']
        }
        if (b['statistics'] && b['statistics']['tot_hold_days']) {
          b_val = b['statistics']['tot_hold_days']
        }
        return a_val - b_val
      });
    } else {
      dynRecordObjs.value.sort((a, b) => {
        let a_val = 0, b_val = 0
        if (a['statistics'] && a['statistics']['tot_hold_days']) {
          a_val = a['statistics']['tot_hold_days']
        }
        if (b['statistics'] && b['statistics']['tot_hold_days']) {
          b_val = b['statistics']['tot_hold_days']
        }
        return b_val - a_val
      });
    }
  }
  else if (_field === 'last_sold') {
    if (sortFieldFlag.value) {
      dynRecordObjs.value.sort((a, b) => {
        let a_val = '9999-99-99', b_val = '9999-99-99'
        if (a['soldHistoryWrapper'] && a['soldHistoryWrapper'].length > 0 && a['soldHistoryWrapper'][a['soldHistoryWrapper'].length - 1]['date_str']) {
          a_val = a['soldHistoryWrapper'][a['soldHistoryWrapper'].length - 1]['date_str'].replaceAll("-", "")
        }
        if (b['soldHistoryWrapper'] && b['soldHistoryWrapper'].length > 0 && b['soldHistoryWrapper'][b['soldHistoryWrapper'].length - 1]['date_str']) {
          b_val = b['soldHistoryWrapper'][b['soldHistoryWrapper'].length - 1]['date_str'].replaceAll("-", "")
        }
        return parseInt(a_val) - parseInt(b_val)
      });
    } else {
      dynRecordObjs.value.sort((a, b) => {
        let a_val = '9999-99-99', b_val = '9999-99-99'
        if (a['soldHistoryWrapper'] && a['soldHistoryWrapper'].length > 0 && a['soldHistoryWrapper'][a['soldHistoryWrapper'].length - 1]['date_str']) {
          a_val = a['soldHistoryWrapper'][a['soldHistoryWrapper'].length - 1]['date_str'].replaceAll("-", "")
        }
        if (b['soldHistoryWrapper'] && b['soldHistoryWrapper'].length > 0 && b['soldHistoryWrapper'][b['soldHistoryWrapper'].length - 1]['date_str']) {
          b_val = b['soldHistoryWrapper'][b['soldHistoryWrapper'].length - 1]['date_str'].replaceAll("-", "")
        }
        return parseInt(b_val) - parseInt(a_val)
      });
    }
  }
  else if (_field === 'action_times') {
    if (sortFieldFlag.value) {
      dynRecordObjs.value.sort((a, b) => {
        let a_val = 0, b_val = 0
        if (a['statistics'] && a['statistics']['buy_times']) {
          a_val = a['statistics']['buy_times']
        }
        if (a['statistics'] && a['statistics']['sold_times']) {
          a_val = a['statistics']['sold_times']
        }
        if (b['statistics'] && b['statistics']['buy_times']) {
          b_val = b['statistics']['buy_times']
        }
        if (b['statistics'] && b['statistics']['sold_times']) {
          b_val = b['statistics']['sold_times']
        }
        return a_val - b_val
      });
    } else {
      dynRecordObjs.value.sort((a, b) => {
        let a_val = 0, b_val = 0
        if (a['statistics'] && a['statistics']['buy_times']) {
          a_val = a['statistics']['buy_times']
        }
        if (a['statistics'] && a['statistics']['sold_times']) {
          a_val = a['statistics']['sold_times']
        }
        if (b['statistics'] && b['statistics']['buy_times']) {
          b_val = b['statistics']['buy_times']
        }
        if (b['statistics'] && b['statistics']['sold_times']) {
          b_val = b['statistics']['sold_times']
        }
        return b_val - a_val
      });
    }
  } else if (_field === 'sold_perc') {
    if (sortFieldFlag.value) {
      dynRecordObjs.value.sort((a, b) => {
        let a_val = 0, b_val = 0
        if (a['statistics'] && a['statistics']['last_sold_profit'] &&
            a['statistics']['last_sold_profit']['currStatistics'] &&
            a['statistics']['last_sold_profit']['currStatistics']['tot_profit_perc']) {
          a_val = a['statistics']['last_sold_profit']['currStatistics']['tot_profit_perc']
        }
        if (b['statistics'] && b['statistics']['last_sold_profit'] &&
            b['statistics']['last_sold_profit']['currStatistics'] &&
            b['statistics']['last_sold_profit']['currStatistics']['tot_profit_perc']) {
          b_val = b['statistics']['last_sold_profit']['currStatistics']['tot_profit_perc']
        }
        return a_val - b_val
      });
    } else {
      dynRecordObjs.value.sort((a, b) => {
        let a_val = 0, b_val = 0
        if (a['statistics'] && a['statistics']['last_sold_profit'] &&
            a['statistics']['last_sold_profit']['currStatistics'] &&
            a['statistics']['last_sold_profit']['currStatistics']['tot_profit_perc']) {
          a_val = a['statistics']['last_sold_profit']['currStatistics']['tot_profit_perc']
        }
        if (b['statistics'] && b['statistics']['last_sold_profit'] &&
            b['statistics']['last_sold_profit']['currStatistics'] &&
            b['statistics']['last_sold_profit']['currStatistics']['tot_profit_perc']) {
          b_val = b['statistics']['last_sold_profit']['currStatistics']['tot_profit_perc']
        }
        return b_val - a_val
      });
    }
  } else if (_field === 'latest_perc') {
    if (sortFieldFlag.value) {
      dynRecordObjs.value.sort((a, b) => {
        let a_val = 0, b_val = 0
        if (a['statistics'] && a['statistics']['latest_price_date_profit'] &&
            a['statistics']['latest_price_date_profit']['tot_profit_perc']) {
          a_val = a['statistics']['latest_price_date_profit']['tot_profit_perc']
        }
        if (b['statistics'] && b['statistics']['latest_price_date_profit'] &&
            b['statistics']['latest_price_date_profit']['tot_profit_perc']) {
          b_val = b['statistics']['latest_price_date_profit']['tot_profit_perc']
        }
        return a_val - b_val
      });
    } else {
      dynRecordObjs.value.sort((a, b) => {
        let a_val = 0, b_val = 0
        if (a['statistics'] && a['statistics']['latest_price_date_profit'] &&
            a['statistics']['latest_price_date_profit']['tot_profit_perc']) {
          a_val = a['statistics']['latest_price_date_profit']['tot_profit_perc']
        }
        if (b['statistics'] && b['statistics']['latest_price_date_profit'] &&
            b['statistics']['latest_price_date_profit']['tot_profit_perc']) {
          b_val = b['statistics']['latest_price_date_profit']['tot_profit_perc']
        }
        return b_val - a_val
      });
    }
  } else if (_field === 'selected') {
    dynRecordObjs.value.sort((a, b) => {
      if (a.hasOwnProperty('currSelected') && b.hasOwnProperty('currSelected')) {
        if (a['currSelected'] && b['currSelected']) {
          return 0
        } else if (a['currSelected']) {
          return -1
        }
        return 1
      } else if (!a.hasOwnProperty('currSelected')) {
        return 1
      } else {
        return -1
      }
    });
  }
  scrollViewBySelection()
}

function scrollViewBySelection() {
  nextTick(() => {
    const func = elem => elem['currSelected']
    let _idx = dynRecordObjs.value.findIndex(func)
    if (_idx != -1) {
      let _rowObj = dynRecordObjs.value[_idx]
      rowElements.value[_rowObj['fund_id']].scrollIntoView({block: "center", behavior: "smooth"})
    }
  })
}

function genReport(oneRow) {
  if (currDynValue.value === null ||
  currDynValue.value['fund_id'] != oneRow['fund_id']) {
    yAxisTopAdjTimes.value = 0;
    yAxisBtmAdjTimes.value = 0;
    picHeightAdjVal.value = 400;
    currDynValue.value = oneRow;
  } else {
    currDynValue.value = null
  }
}

const yAxisTopAdjTimes = ref(0)
const yAxisBtmAdjTimes = ref(0)
const picHeightAdjVal = ref(400)

watch([yAxisTopAdjTimes, yAxisBtmAdjTimes, picHeightAdjVal], () => {
  chartOptions.value['chart']['height'] = picHeightAdjVal.value

  chartOptions.value.yAxis.max = maxPriceVal.value + priceDistance.value * 0.5 * yAxisTopAdjTimes.value
  chartOptions.value.yAxis.softMax += maxPriceVal.value + priceDistance.value * 0.5 * yAxisTopAdjTimes.value

  chartOptions.value.yAxis.min = minPriceVal.value - priceDistance.value * 0.5 * yAxisBtmAdjTimes.value
  chartOptions.value.yAxis.softMin = minPriceVal.value - priceDistance.value * 0.5 * yAxisBtmAdjTimes.value
})

function transDate(_date_str) {
  //"2022-01-19"
  let _array = _date_str.split("-")
  return _array[0] + "年" + _array[1] + "月" + _array[2] + "日"
}

function genTextReport() {
  if (currDynValue.value == null) {
    return
  }
  let fundObj = currDynValue.value
  let report_txt = "    " + fundObj['fund_id'] + "，" + fundObj['fund_name'] + "，" + "共持有操作"
  + fundObj['statistics']['tot_exchange_days'] + "天，买入" + fundObj['statistics']['buy_times']
  + "次，卖出" + fundObj['statistics']['sold_times'] + "次，买入金额调整" + fundObj['statistics']['adjust_money_times']
  + "次，盈利" + fundObj['statistics']['last_sold_profit']['currStatistics']['tot_profit_perc_str'] + "。\r\n"
  + "    " + transDate(fundObj['statistics']['buy_first_day']) + "经过估值查询，" + fundObj['fund_id'] + "估值处于较低位，是值得买入的时间点。"
  + "考虑" + fundObj['fund_id'] + "属于xx型基金，它的资金活跌度较高(??)。结合历年数据计算，" + fundObj['fund_id'] + "持有一年期最差、平均、最好年化收益率分别是";

  if (zskbViewObjs.value && zskbViewObjs.value[fundObj['fund_id']]) {
    report_txt += zskbViewObjs.value[fundObj.fund_id]['statistics']['min_earn_str'] + "，"
    report_txt += zskbViewObjs.value[fundObj.fund_id]['statistics']['avg_earn_str'] + "，"
    report_txt += zskbViewObjs.value[fundObj.fund_id]['statistics']['max_earn_str'] + "；"
  } else {
    report_txt += "xx，xx，xx；"
  }
  report_txt += "持有两年期最差、平均、最好年化收益率分别是"
  if (zskbViewObjs.value && zskbViewObjs.value[fundObj['fund_id']]) {
    report_txt += zskbViewObjs.value[fundObj.fund_id]['statistics']['min_earn_aux_str'] + "，"
    report_txt += zskbViewObjs.value[fundObj.fund_id]['statistics']['avg_earn_aux_str'] + "，"
    report_txt += zskbViewObjs.value[fundObj.fund_id]['statistics']['max_earn_aux_str'] + "；"
  } else {
    report_txt += "xx，xx，xx；"
  }
  report_txt += "持有三年期最差、平均、最好年化收益率分别是"
  if (zskbViewObjs.value && zskbViewObjs.value[fundObj['fund_id']]) {
    report_txt += zskbViewObjs.value[fundObj.fund_id]['statistics']['min_earn_tri_str'] + "，"
    report_txt += zskbViewObjs.value[fundObj.fund_id]['statistics']['avg_earn_tri_str'] + "，"
    report_txt += zskbViewObjs.value[fundObj.fund_id]['statistics']['max_earn_tri_str'] + "；"
  } else {
    report_txt += "xx，xx，xx；"
  }
  report_txt += "历史数据表现较好。\r\n"
  report_txt += "    于当日开始实施分批买入，每交易日买入一份。分别于"
  if (fundObj['statistics']['asc_money_dates'] && fundObj['statistics']['asc_money_dates'].length > 0) {
    fundObj['statistics']['asc_money_dates'].forEach(elem => {
      report_txt += transDate(elem) + "、"
    })
  } else {
    report_txt += "???"
  }
  report_txt += "增加买入资金，共" + fundObj['statistics']['asc_money_times'] + "次；分别于"
  if (fundObj['statistics']['desc_money_dates'] && fundObj['statistics']['desc_money_dates'].length > 0) {
    fundObj['statistics']['desc_money_dates'].forEach(elem => {
      report_txt += transDate(elem) + "、"
    })
  } else {
    report_txt += "???"
  }
  report_txt += "减少买入资金，共" + fundObj['statistics']['desc_money_times'] + "次；分别于"
  if (fundObj['soldList4draw'] && fundObj['soldList4draw'].length > 0) {
    fundObj['soldList4draw'].forEach(elem => {
      report_txt += transDate(elem['date_str']) + "、"
    })
  } else {
    report_txt += "???"
  }
  report_txt += "依次逢高卖出份额，共" + fundObj['soldList4draw'].length + "次。截止最后一次卖出时，总盈利率为"
  report_txt += fundObj['statistics']['last_sold_profit']['currStatistics']['tot_profit_perc_str'] + "。好于以下宽指涨幅："
  if (fundObj['statistics']['last_sold_wide_profit'] && fundObj['statistics']['last_sold_wide_profit'].length >= 5) {
    report_txt += "同时期上证指数涨幅为" + fundObj['statistics']['last_sold_wide_profit'][0]['profit_perc_str']
    report_txt += "，深证指数涨幅为" + fundObj['statistics']['last_sold_wide_profit'][1]['profit_perc_str']
    report_txt += "，沪深300指数涨幅为" + fundObj['statistics']['last_sold_wide_profit'][2]['profit_perc_str']
    report_txt += "，中证500指数涨幅为" + fundObj['statistics']['last_sold_wide_profit'][3]['profit_perc_str']
    report_txt += "，创业板涨幅为" + fundObj['statistics']['last_sold_wide_profit'][4]['profit_perc_str']
  } else {
    report_txt += "???"
  }
  report_txt += "\r\n"
  report_txt += "    如果在调整方面更加优化，收益应该能更进一步。由此可见，即使在漫长的熊市，如果能结合价值面和技术面分析，采用分批买入，并及时调整买入资金量，依然可以获得收益。\r\n"
  report_txt += "    本文为学习交流经验使用，不构成投资推荐。股市有风险，入市需谨慎。"

  cfmDlgTitle.value = "报告文档"
  cfmDlgCont.value = report_txt
  cfmDlgType.value = "gen report"
  dlgController.value.reportDlg.show()
}

const rowElements = ref({})

</script>

<style scoped></style>