<template>
<div>
  <table class="table table-hover">
    <thead>
    <tr>
      <th scope="col" style="cursor: pointer; text-align: center;">
        Id/Name
      </th>
      <th scope="col" style="cursor: pointer; text-align: center;" @click="sortByField('fund_type')">
        <template v-if="sortFieldName === 'fund_type'">
          <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
          <span v-else><i class="bi bi-arrow-down"></i></span>
        </template>
        <span>Type</span>
      </th>
      <th scope="col" style="cursor: pointer; text-align: center;" @click="sortByField('cluster_id')">
        <template v-if="sortFieldName === 'cluster_id'">
          <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
          <span v-else><i class="bi bi-arrow-down"></i></span>
        </template>
        <span>Cluster</span>
      </th>
      <th scope="col" style="cursor: pointer; text-align: center;" colspan="3">
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
      <th scope="col" style="cursor:pointer; text-align: center;" colspan="2">
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
    </tr>
    </thead>
    <tbody>
    <tr v-for="oneRow in zskbObjs" v-bind:id="oneRow.fund_id">
      <td scope="row">
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
      <td>
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
      <td>
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
      <td>
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
      <td style="width: 4em;">
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
      <td>
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
    </tr>
    </tbody>
  </table>
</div>
</template>

<script setup>
import '../assets/style.scss'
import {storeToRefs} from 'pinia'
import {useZskbStore} from "../store/zskbStore.js";
const zskbStore = useZskbStore()
const {zskbObjs, sortFieldName, sortFieldFlag} = storeToRefs(zskbStore)
const {sortByField, getZskb} = zskbStore
const typeMapObj = ['宽指', '主题', '行业', 'QDII']

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
  th {
    border-left: solid 1px black;
    border-right: solid 1px black;
  }
</style>