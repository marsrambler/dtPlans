<template>
<div style="position: relative; border: solid 1px blue;">
  <div style="position: fixed; height: 10em; border: solid 2px green;">

  </div>
  <div style="height: 100rem; background-color: red;">

  </div>
  <!--
  <div style="position: fixed; z-index: 1000;">
    <div style="height: 3.5rem;">
    操作面板
    </div>
    <table class="table table-bordered" style="table-layout: fixed;">
      <thead style="">
        <tr style="height: 3rem;">
          <th :style="{'width': colWidMap['col_1'] + 'rem'}">
            估值
          </th>
          <th  :style="{'width': colWidMap['col_2'] + 'rem'}" @click="sortByField('fund_type')">
            <template v-if="sortFieldName === 'fund_type'">
            <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
            <span v-else><i class="bi bi-arrow-down"></i></span>
          </template>
          <span>Type</span>
          </th>
          <th :style="{'width': colWidMap['col_3'] + 'rem'}" @click="sortByField('cluster_id')">
            <template v-if="sortFieldName === 'cluster_id'">
              <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
              <span v-else><i class="bi bi-arrow-down"></i></span>
            </template>
            <span>Cluster</span>
          </th>
          <th :style="{'width': colWidMap['col_4'] + colWidMap['col_5'] + colWidMap['col_6'] + 'rem'}" colspan="3">
            <div>Statistics</div>
            <div>
              <div style="display: inline-block; width: 33.3%;" @click="sortByField('min_earn')">
                <template v-if="sortFieldName === 'min_earn'">
                  <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
                  <span v-else><i class="bi bi-arrow-down"></i></span>
                </template>
                <span>最小</span>
              </div>
              <div style="display: inline-block; width: 33.3%;" @click="sortByField('avg_earn')">
                <template v-if="sortFieldName === 'avg_earn'">
                  <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
                  <span v-else><i class="bi bi-arrow-down"></i></span>
                </template>
                <span>平均</span>
              </div>
              <div style="display: inline-block; width: 33.3%;" @click="sortByField('max_earn')">
                <template v-if="sortFieldName === 'max_earn'">
                  <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
                  <span v-else><i class="bi bi-arrow-down"></i></span>
                </template>
                <span>最大</span>
              </div>
            </div>
          </th>
          <th :style="{'width': colWidMap['col_7'] + colWidMap['col_8'] + 'rem'}" colspan="2">
            <div>Positive</div>
            <div>
              <div style="display: inline-block; width: 50%;" @click="sortByField('positive')">
                <template v-if="sortFieldName === 'positive'">
                  <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
                  <span v-else><i class="bi bi-arrow-down"></i></span>
                </template>
                <span>高点</span>
              </div>
              <div style="display: inline-block; width: 50%;" @click="sortByField('negative')">
                <template v-if="sortFieldName === 'negative'">
                  <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
                  <span v-else><i class="bi bi-arrow-down"></i></span>
                </template>
                <span>低点</span>
              </div>
            </div>          
          </th>
          <th :style="{'width': colWidMap['col_9'] + colWidMap['col_10'] + colWidMap['col_11'] + 'rem'}"  colspan="3">
          </th>
          <th style="cursor:pointer; text-align: center;">
          </th>
        </tr>
      </thead>
      <tbody>
      </tbody>
    </table>
  </div>
  -->
  <!--
  <table class="table table-bordered" style="position: absolute; top: 7rem; table-layout: fixed;">
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
      <th></th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="oneRow in zskbObjs" v-bind:id="oneRow.fund_id">
      <td>
        <div>
          {{oneRow.fund_id}}
        </div>
        <div>
          {{oneRow.fund_name}}
        </div>
        <div>
          <span v-bind:class="getCardStyle(oneRow.statistics.day_200_thres)">&nbsp;</span>
          <span v-bind:class="getCardStyle(oneRow.statistics.day_300_thres)">&nbsp;</span>
          <span v-bind:class="getCardStyle(oneRow.statistics.day_400_thres)">&nbsp;</span>
          <span v-bind:class="getCardStyle(oneRow.statistics.day_500_thres)">&nbsp;</span>
          <span v-bind:class="getCardStyle(oneRow.statistics.day_600_thres)">&nbsp;</span>
          <span>{{oneRow.statistics.fund_perc_len}}</span>
        </div>
      </td>
      <td style="text-align: center;">
        {{typeMapObj[oneRow.indexType]}}
      </td>
      <td style="text-align: center;">
        {{oneRow.statistics.cluster_id}}
      </td>
      <td style="text-align: center;">
        <div>
          {{oneRow.statistics.min_earn_str}}
        </div>
        <div>
          {{oneRow.statistics.min_earn_aux_str}}
        </div>
        <div>
          {{oneRow.statistics.min_earn_tri_str}}
        </div>
      </td>
      <td style="text-align: center;">
        <div>
          {{oneRow.statistics.avg_earn_str}}
        </div>
        <div>
          {{oneRow.statistics.avg_earn_aux_str}}
        </div>
        <div>
          {{oneRow.statistics.avg_earn_tri_str}}
        </div>
      </td>
      <td style="text-align: center;">
        <div>
          {{oneRow.statistics.max_earn_str}}
        </div>
        <div>
          {{oneRow.statistics.max_earn_aux_str}}
        </div>
        <div>
          {{oneRow.statistics.max_earn_tri_str}}
        </div>
      </td>
      <td style="text-align: center;">
        <div style="height: 2.2em; position: relative;" v-bind:class="getPosColor(oneRow.positive.positive_reach_len)">
          <span v-if="oneRow.positive.positive_reach_len >= 4" class="icon_pos">
          <i class="bi bi-arrow-up-circle-fill"></i>
          <span class="lv_font">{{oneRow.positive.positive_reach_len}}</span>
          </span>
        </div>
        <div style="height: 2.2em; position: relative;" v-bind:class="getNegColor(oneRow.negative.negative_reach_len)">
          <span v-if="oneRow.negative.negative_reach_len >= 3" class="icon_pos">
          <i class="bi bi-arrow-down-circle-fill"></i>
            <span class="lv_font">{{oneRow.negative.negative_reach_len}}</span>
          </span>
        </div>
      </td>
      <td style="">
        <div style="height: 2.2em;">
          <span v-bind:class="getHitStyle(oneRow.positive.day_5_positive_reach)">&nbsp;</span>
          <span v-bind:class="getHitStyle(oneRow.positive.day_10_positive_reach)">&nbsp;</span>
          <span v-bind:class="getHitStyle(oneRow.positive.day_20_positive_reach)">&nbsp;</span>
          <span v-bind:class="getHitStyle(oneRow.positive.day_60_positive_reach)">&nbsp;</span>
          <span v-bind:class="getHitStyle(oneRow.positive.day_90_positive_reach)">&nbsp;</span>
          <span v-bind:class="getHitStyle(oneRow.positive.day_120_positive_reach)">&nbsp;</span>
          <span v-bind:class="getHitStyle(oneRow.positive.day_160_positive_reach)">&nbsp;</span>
          <span v-bind:class="getHitStyle(oneRow.positive.day_220_positive_reach)">&nbsp;</span>
        </div>
        <div style="height: 2.2em;">
          <span v-bind:class="getHitStyle(oneRow.negative.day_5_negative_reach)">&nbsp;</span>
          <span v-bind:class="getHitStyle(oneRow.negative.day_10_negative_reach)">&nbsp;</span>
          <span v-bind:class="getHitStyle(oneRow.negative.day_20_negative_reach)">&nbsp;</span>
          <span v-bind:class="getHitStyle(oneRow.negative.day_60_negative_reach)">&nbsp;</span>
          <span v-bind:class="getHitStyle(oneRow.negative.day_90_negative_reach)">&nbsp;</span>
          <span v-bind:class="getHitStyle(oneRow.negative.day_120_negative_reach)">&nbsp;</span>
          <span v-bind:class="getHitStyle(oneRow.negative.day_160_negative_reach)">&nbsp;</span>
        </div>
      </td>
      <td style="text-align: center;">
        <select class="form-select" v-model="oneRow['esti_pe']['ding']">
						<option v-for="option in buy_in_esti_sugg_full" v-bind:value="option.source_val">
						{{option.source_name}}
					</option>
				</select>
      </td>
      <td style="text-align: center;">
        <select class="form-select" v-model="oneRow['esti_pe']['zhi']">
						<option v-for="option in buy_in_esti_sugg_full" v-bind:value="option.source_val">
						{{option.source_name}}
					</option>
				</select>
      </td>
      <td style="text-align: center;">
        <select class="form-select" v-model="oneRow['esti_pe']['wei']">
						<option v-for="option in buy_in_esti_sugg_full" v-bind:value="option.source_val">
						{{option.source_name}}
					</option>
				</select>
      </td>
      <td style="text-align: center;">
        <select class="form-select">
						<option v-for="option in buy_in_from_plan" v-bind:value="option.source_val">
						{{option.source_name}}
					</option>
				</select>
      </td>
    </tr>
    </tbody>
  </table>
-->
  <!-- <table class="table" style="position: fixed; border: solid 1px red; height: 10rem;">
    <thead>
      <tr>
        <th>head--1</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>td--1</td>
      </tr>
    </tbody>
  </table>
  <table class="table" style="position: absolute; border: solid 1px green; top: 10rem;">
    <thead>
      <tr>
        <th>head--2</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>td--2</td>
      </tr>
    </tbody>
  </table> -->
</div>
</template>

<script setup>
import '../assets/style.scss'
import '../style.css'
import {storeToRefs} from 'pinia'
import {useZskbStore} from "../store/zskbStore.js";
const zskbStore = useZskbStore()
const {zskbObjs, sortFieldName, sortFieldFlag} = storeToRefs(zskbStore)
const {sortByField, getZskb} = zskbStore
const typeMapObj = ['宽指', '主题', '行业', 'QDII']

const buy_in_esti_sugg_full = [
				{'source_name': '未知', 'source_val': -2},
				{'source_name': '持有', 'source_val': 0},
				{'source_name': '买入', 'source_val': 1},
				{'source_name': '卖出', 'source_val': -1}
			]

const buy_in_from_plan = [
				{'source_name': '无计划', 'source_val': 0},
				{'source_name': '橄榄树', 'source_val': 1},
				{'source_name': '三叉戟', 'source_val': 2},
        {'source_name': '海豚', 'source_val': 3}
			]

const colWidMap = {
  'col_1': 8,
  'col_2': 3,
  'col_3': 2,
  'col_4': 4,
  'col_5': 4,
  'col_6': 4,
  'col_7': 3,
  'col_8': 12,
  'col_9': 3,
  'col_10': 3,
  'col_11': 3,
  'col_12': 4
}

getZskb();

function getCardStyle(_val) {
  if (_val <= 0.2) {
    return 'blue_card';
  } else if (_val <= 0.4) {
    return 'skyblue_card';
  } else if (_val <= 0.6) {
    return 'grey_card';
  } else if (_val <= 0.8) {
    return 'yellow_card';
  } else {
    return 'red_card';
  }
}

function getHitStyle(_val) {
  if (_val > 0) {
    return 'purple_card';
  } else if (_val < 0) {
    return 'grey_card';
  }
  return 'white_card';
}

function getPosColor(_val) {
  if (_val >= 8) {
    return 'red_8';
  } else if (_val >= 7) {
    return 'red_7';
  } else if (_val >= 6) {
    return 'red_6';
  } else if (_val >= 5) {
    return 'red_5';
  } else {
    return 'red_other';
  }
}

function getNegColor(_val) {
  if (_val >= 7) {
    return 'blue_7';
  } else if (_val >= 6) {
    return 'blue_6';
  } else if (_val >= 5) {
    return 'blue_5';
  } else if (_val >= 4) {
    return 'blue_4';
  } else {
    return 'blue_3';
  }
}
</script>

<style scoped>
table {
  table-layout: fixed;
}
</style>