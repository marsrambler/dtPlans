<template>
  <div :style="topSecClass">
    <div id="op_pane" :style="{ 'height': opPaneHeight + 'rem' }" class="grid_pane">
      <div>请求ID号(,)&nbsp;</div>
      <input type="text" v-model="requireFundIds" class="form-control-plaintext search_box"
        style="grid-column: 2 / span 2">
      <input class="btn btn-primary btn-sm" type="button" value="请求" @click="requireDynValues4ui();">
    </div>
    <table id="table_header" class="table table-bordered" style="margin-bottom: 0;">
      <thead style="">
        <tr :style="{ 'height': tabHeaderHeight + 'rem' }">
          <th :style="{ 'width': colWidMap['col_1'] + 'rem' }">
            <span>名称</span>
          </th>
          <th :style="{ 'width': colWidMap['col_2'] + 'rem' }">
            <span>收益率</span>
          </th>
          <th :style="{ 'width': colWidMap['col_3'] + 'rem' }">
            <span>买入</span>
          </th>
          <th :style="{ 'width': colWidMap['col_4'] + 'rem' }">
            <span>卖出</span>
          </th>
          <th :style="{ 'width': colWidMap['col_5'] + 'rem' }">
            <span>次数</span>
          </th>
          <th :style="{ 'width': colWidMap['col_6'] + 'rem' }">
            <span>卖出时</span>
          </th>
          <th :style="{ 'width': colWidMap['col_7'] + 'rem' }">
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
          <tr>
            <td>
              <div>{{ oneRow.fund_id }}</div>
              <div>{{ oneRow.fund_name }}</div>
              <div>净值日:&nbsp;{{ oneRow.statistics?.latest_price_date }}</div>
              <button type="button" class="btn btn-warning" 
                @click="removeLocalDynvalue(oneRow['fund_id'])">
                  删除
                </button>
            </td>
            <td>
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
            <td>
              <div>起:&nbsp;{{ oneRow.statistics?.buy_first_day }}</div>
              <div>止:&nbsp;{{ oneRow.statistics?.buy_last_day }}</div>
              <div>计:&nbsp;{{ oneRow.statistics?.tot_exchange_days }}天</div>
              <div>共:&nbsp;{{ oneRow.statistics?.tot_hold_days }}天</div>
            </td>
            <td>
              <template v-if="oneRow.soldHistoryWrapper">
                <div v-for="one_sold in oneRow.soldHistoryWrapper">
                  {{ one_sold?.date_str }}
                </div>
              </template>
            </td>
            <td>
              <div>买:&nbsp;{{ oneRow.statistics?.buy_times }}</div>
              <div>卖:&nbsp;{{ oneRow.statistics?.sold_times }}</div>
              <div>加:&nbsp;{{ oneRow.statistics?.asc_money_times }}</div>
              <div>减:&nbsp;{{ oneRow.statistics?.desc_money_times }}</div>
            </td>
            <td>
              <div>卖:&nbsp;{{ oneRow.statistics?.last_sold_profit?.currStatistics?.tot_profit_perc_str }}</div>
              <template
                v-if="oneRow.statistics && 
                oneRow.statistics.last_sold_wide_profit && 
                oneRow.statistics.last_sold_wide_profit.length > 4">
                <div>上:&nbsp;{{ oneRow.statistics.last_sold_wide_profit[0]?.profit_perc_str }}</div>
                <div>深:&nbsp;{{ oneRow.statistics.last_sold_wide_profit[1]?.profit_perc_str }}</div>
                <div>沪:&nbsp;{{ oneRow.statistics.last_sold_wide_profit[2]?.profit_perc_str }}</div>
                <div>中:&nbsp;{{ oneRow.statistics.last_sold_wide_profit[3]?.profit_perc_str }}</div>
                <div>创:&nbsp;{{ oneRow.statistics.last_sold_wide_profit[4]?.profit_perc_str }}</div>
              </template>
            </td>
            <td>
              <div>卖:&nbsp;{{ oneRow.statistics?.latest_price_date_profit?.tot_profit_perc_str }}</div>
              <template
                v-if="oneRow.statistics && 
                oneRow.statistics.latest_price_date_wide_profit && 
                oneRow.statistics.latest_price_date_wide_profit.length > 4">
                <div>上:&nbsp;{{ oneRow.statistics.latest_price_date_wide_profit[0]?.profit_perc_str }}</div>
                <div>深:&nbsp;{{ oneRow.statistics.latest_price_date_wide_profit[1]?.profit_perc_str }}</div>
                <div>沪:&nbsp;{{ oneRow.statistics.latest_price_date_wide_profit[2]?.profit_perc_str }}</div>
                <div>中:&nbsp;{{ oneRow.statistics.latest_price_date_wide_profit[3]?.profit_perc_str }}</div>
                <div>创:&nbsp;{{ oneRow.statistics.latest_price_date_wide_profit[4]?.profit_perc_str }}</div>
              </template>
            </td>
            <td style="text-align: center;">
              <div class="flex_col" style="height: 8rem;">
                <button type="button" class="btn btn-primary" 
                @click="yAxisTopAdjTimes=0; yAxisBtmAdjTimes=0; currDynValue=oneRow;">
                  报告
                </button>
                <div>
                  <button type="button" class="btn btn-secondary btn_nr"
                  @click="addyAxisTopMargin()">
                    +Y顶
                  </button>
                  <button type="button" class="btn btn-secondary btn_nr"
                  @click="minusAxisTopMargin()">
                    -Y顶
                  </button>
                </div>
                <div>
                  <button type="button" class="btn btn-secondary btn_nr" 
                  @click="addyAxisBtmMargin()">
                    +Y底
                  </button>
                  <button type="button" class="btn btn-secondary btn_nr"
                  @click="minusAxisBtmMargin()">
                    -Y底
                  </button>
                </div>
            </div>
            </td>
          </tr>
          <tr v-if="currDynValue && currDynValue['fund_id'] == oneRow['fund_id']">
            <td colspan=8>
              <div id="hc_container">
                <highcharts :constructor-type="'stockChart'" :options="chartOptions" />
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>

  <div class="modal fade" id="reportDialog" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ cfmDlgTitle }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <h6>{{ cfmDlgCont }}:&nbsp;{{ requireFundIds }}</h6>
          <h6 class="bg-danger" v-if="requireFundIds.trim().length === 0">非法的请求ID</h6>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
          <button type="button" class="btn btn-primary" v-bind:disabled="requireFundIds.trim().length === 0"
            @click.prevent="executeAction();">确认</button>
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
import { Modal } from "bootstrap";

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

getRecordsAndRates()

const zskbViewObjs = ref({})
watch(zskbObjs, () => {
  zskbObjs.value.forEach(element => {
    zskbViewObjs.value[element['fund_id']] = element
  })
})

const cfmDlgTitle = ref("")
const cfmDlgCont = ref("")
const cfmDlgType = ref("")

const dlgController = ref({ reportDlg: null })
onMounted(() => {
  dlgController.value.reportDlg = new Modal('#reportDialog', {})
})

const requireFundIds = ref("")

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

const chartOptions = ref({
  rangeSelector: {
    selected: 6
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
    shared: true
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
      }
    },
    {
      // asc money flag points
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
      }
    },
    {
      // desc money flag points
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
      }
    },
    {
      // buy flag points
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
      }
    },
    {
      // sold flag points
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

})

const yAxisTopAdjTimes = ref(0)
const yAxisBtmAdjTimes = ref(0)

function addyAxisTopMargin() {
  yAxisTopAdjTimes.value += 1
  chartOptions.value.yAxis.max = maxPriceVal.value + priceDistance.value * 0.5 * yAxisTopAdjTimes.value
  chartOptions.value.yAxis.softMax += maxPriceVal.value + priceDistance.value * 0.5 * yAxisTopAdjTimes.value
}

function minusAxisTopMargin() {
  yAxisTopAdjTimes.value -= 1
  chartOptions.value.yAxis.max = maxPriceVal.value + priceDistance.value * 0.5 * yAxisTopAdjTimes.value
  chartOptions.value.yAxis.softMax += maxPriceVal.value + priceDistance.value * 0.5 * yAxisTopAdjTimes.value
}

function addyAxisBtmMargin() {
  yAxisBtmAdjTimes.value += 1
  chartOptions.value.yAxis.min = minPriceVal.value - priceDistance.value * 0.5 * yAxisBtmAdjTimes.value
  chartOptions.value.yAxis.softMin = minPriceVal.value - priceDistance.value * 0.5 * yAxisBtmAdjTimes.value
}

function minusAxisBtmMargin() {
  yAxisBtmAdjTimes.value -= 1
  chartOptions.value.yAxis.min = minPriceVal.value - priceDistance.value * 0.5 * yAxisBtmAdjTimes.value
  chartOptions.value.yAxis.softMin = minPriceVal.value - priceDistance.value * 0.5 * yAxisBtmAdjTimes.value
}

</script>

<style scoped></style>