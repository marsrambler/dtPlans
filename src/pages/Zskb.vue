<template>
  <div :style="topSecClass">
    <div id="op_pane" :style="{ 'height': opPaneHeight + 'rem' }" class="grid_pane_c12">
      <div>总数&nbsp;<span class="badge bg-success">{{ currTotNum }}</span><!--
      --></div>
      <div style="cursor: pointer;" @click="clearSelected()"><!--
        -->选择&nbsp;<span class="badge bg-warning text-dark">{{ currSelectedNum }}</span><!--
      --></div>
      <!--      <div>隐藏:&nbsp;<span class="badge bg-warning text-dark">{{ currSelectedNum }}</span>-->
      <!--      </div>-->
      <div class="form-check form_check_cust">
        <input class="form-check-input" type="checkbox" id="chk_w_f" v-model="wideIdxOnly">
        <label class="form-check-label" for="chk_w_f">宽基</label>
      </div>
      <div class="form-check form_check_cust">
        <input class="form-check-input" type="checkbox" id="chk_topic" v-model="topicIdxOnly">
        <label class="form-check-label" for="chk_topic">主题</label>
      </div>
      <div class="form-check form_check_cust">
        <input class="form-check-input" type="checkbox" id="chk_busi" v-model="indusIdxOnly">
        <label class="form-check-label" for="chk_busi">行业</label>
      </div>
      <div class="form-check form_check_cust">
        <input class="form-check-input" type="checkbox" id="chk_qd" v-model="qdiiIdxOnly">
        <label class="form-check-label" for="chk_qd">QDII</label>
      </div>
      <div class="form-check form_check_cust">
        <input class="form-check-input" type="checkbox" id="chk_mz" v-model="mzIdxOnly">
        <label class="form-check-label" for="chk_mz">美债</label>
      </div>      
      <input class="btn btn-primary btn-sm" type="button" value="前移选择" @click="sortByField('selected')">
      <input type="text" class="form-control-plaintext search_box" style="grid-column: 9 / span 2;" v-model="searchCond"
             @keyup.enter="searchByCond()">
      <input class="btn btn-primary btn-sm" type="button" value="查找" @click="searchByCond()">
      <input class="btn btn-warning btn-sm" type="button" value="刷新" @click="getZskb()">
    </div>
    <table id="table_header" class="table table-bordered" style="margin-bottom: 0;">
      <thead style="">
      <tr :style="{ 'height': tabHeaderHeight + 'rem' }">
        <th :style="{ 'width': colWidMap['col_1'] + 'rem' }">
          <!-- <div style="border-bottom: solid 1px whitesmoke;">信息</div> -->
          <div>
            <div class="w33_w_br" @click="sortByField('day_xxx_thres')">
              <template v-if="sortFieldName === 'day_xxx_thres'">
                <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
                <span v-else><i class="bi bi-arrow-down"></i></span>
              </template>
              <span>趋势</span>
            </div>
            <div class="w33_w_br" @click="sortByField('fund_len')">
              <template v-if="sortFieldName === 'fund_len'">
                <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
                <span v-else><i class="bi bi-arrow-down"></i></span>
              </template>
              <span>长度</span>
            </div>
            <div class="w33_w_br" @click="sortByField('perc_not_update_days')" style="border: none;">
              <template v-if="sortFieldName === 'perc_not_update_days'">
                <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
                <span v-else><i class="bi bi-arrow-down"></i></span>
              </template>
              <span>更新</span>
            </div>
          </div>
        </th>
        <th :style="{ 'width': colWidMap['col_2'] + 'rem' }" @click="sortByField('fund_type')">
          <template v-if="sortFieldName === 'fund_type'">
            <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
            <span v-else><i class="bi bi-arrow-down"></i></span>
          </template><!--
          --><span>类型</span>
        </th>
        <th :style="{ 'width': colWidMap['col_3'] + 'rem' }" @click="sortByField('cluster_id')">
          <template v-if="sortFieldName === 'cluster_id'">
            <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
            <span v-else><i class="bi bi-arrow-down"></i></span>
          </template>
          <span>簇</span>
        </th>
        <th :style="{ 'width': colWidMap['col_4'] + colWidMap['col_5'] + colWidMap['col_6'] + 'rem' }" colspan="3">
          <!-- <div style="border-bottom: solid 1px whitesmoke;">统计盈利率</div> -->
          <div>
            <div class="w33_w_br" @click="sortByField('min_earn')">
              <template v-if="sortFieldName === 'min_earn'">
                <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
                <span v-else><i class="bi bi-arrow-down"></i></span>
              </template>
              <span>最小</span>
            </div>
            <div class="w33_w_br" @click="sortByField('avg_earn')">
              <template v-if="sortFieldName === 'avg_earn'">
                <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
                <span v-else><i class="bi bi-arrow-down"></i></span>
              </template>
              <span>平均</span>
            </div>
            <div class="w33_w_br" @click="sortByField('max_earn')" style="border: none;">
              <template v-if="sortFieldName === 'max_earn'">
                <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
                <span v-else><i class="bi bi-arrow-down"></i></span>
              </template>
              <span>最大</span>
            </div>
          </div>
        </th>
        <th :style="{ 'width': colWidMap['col_7'] + colWidMap['col_8'] + 'rem' }" colspan="2">
          <!-- <div style="border-bottom: solid 1px whitesmoke;">均线高低点</div> -->
          <div>
            <div class="w33_w_br" @click="sortByField('positive')">
              <template v-if="sortFieldName === 'positive'">
                <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
                <span v-else><i class="bi bi-arrow-down"></i></span>
              </template>
              <span>高点</span>
            </div>
            <div class="w33_w_br" @click="sortByField('negative')">
              <template v-if="sortFieldName === 'negative'">
                <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
                <span v-else><i class="bi bi-arrow-down"></i></span>
              </template>
              <span>低点</span>
            </div>
            <div class="w33_w_br" @click="sortByField('wav_rate')" style="border: none;">
              <template v-if="sortFieldName === 'wav_rate'">
                <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
                <span v-else><i class="bi bi-arrow-down"></i></span>
              </template>
              <span>波动</span>
            </div>
          </div>
        </th>
        <th :style="{ 'width': colWidMap['col_9'] + colWidMap['col_10'] + colWidMap['col_11'] + 'rem' }" colspan="3">
          <!-- <div style="border-bottom: solid 1px whitesmoke;">推荐估值</div> -->
          <div>
            <div class="w33_w_br" @click="sortByField('esti_pe_ding')">
              <template v-if="sortFieldName === 'esti_pe_ding'">
                <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
                <span v-else><i class="bi bi-arrow-down"></i></span>
              </template>
              <span>螺丝钉</span>
            </div>
            <div class="w33_w_br" @click="sortByField('esti_pe_zhi')">
              <template v-if="sortFieldName === 'esti_pe_zhi'">
                <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
                <span v-else><i class="bi bi-arrow-down"></i></span>
              </template>
              <span>支付宝</span>
            </div>
            <div class="w33_w_br" @click="sortByField('esti_pe_wei')" style="border: none;">
              <template v-if="sortFieldName === 'esti_pe_wei'">
                <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
                <span v-else><i class="bi bi-arrow-down"></i></span>
              </template>
              <span>理财通</span>
            </div>
          </div>
        </th>
        <th :style="{ 'width': colWidMap['col_12'] + 'rem' }" @click="sortByField('compose_plan')">
          <template v-if="sortFieldName === 'compose_plan'">
            <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
            <span v-else><i class="bi bi-arrow-down"></i></span>
          </template><!--
          --><span>组合</span>
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
        <th :style="{ 'width': colWidMap['col_9'] + 'rem' }"></th>
        <th :style="{ 'width': colWidMap['col_10'] + 'rem' }"></th>
        <th :style="{ 'width': colWidMap['col_11'] + 'rem' }"></th>
        <th :style="{ 'width': colWidMap['col_12'] + 'rem' }"></th>
      </tr>
      </thead>
      <tbody>
      <template v-for="oneRow in zskbViewObjs" :key="oneRow.fund_id">
        <tr v-bind:id="oneRow.fund_id" style="cursor: pointer;" @click="selOrDesRow(oneRow)"
            v-bind:class="{ sel_row: oneRow['currSelected'] }"
            :ref="(el) => { if (el) { rowElements[oneRow.fund_id] = el; } }">
          <td v-bind:class="{ sel_row: oneRow['currSelected'] }">
            <div>
              {{ oneRow.fund_id }}
            </div>
            <div>
              {{ oneRow.fund_name }}
            </div>
            <div style="margin-top:8px;">
              <span v-bind:class="getCardStyle(oneRow.statistics.day_200_thres)">&nbsp;</span>
              <span v-bind:class="getCardStyle(oneRow.statistics.day_300_thres)">&nbsp;</span>
              <span v-bind:class="getCardStyle(oneRow.statistics.day_400_thres)">&nbsp;</span>
              <span v-bind:class="getCardStyle(oneRow.statistics.day_500_thres)">&nbsp;</span>
              <span v-bind:class="getCardStyle(oneRow.statistics.day_600_thres)">&nbsp;</span>
              <span>{{ oneRow.statistics.fund_perc_len }}</span>
            </div>
            <template
                v-if="oneRow['statistics']['perc_not_update_days'] && oneRow['statistics']['perc_not_update_days'] - 1 >= 3">
              <div style="font-size: 0.85rem; margin-top: 0.3rem;">
                {{ oneRow.statistics.last_perc_date_str }}&nbsp;<span
                  class="badge bg-danger">缺失: {{ oneRow.statistics.perc_not_update_days }}</span>
              </div>
            </template>
          </td>
          <td v-bind:class="{ sel_row: oneRow['currSelected'] }">
            {{ typeMapObj[oneRow.indexType] }}
          </td>
          <td v-bind:class="{ sel_row: oneRow['currSelected'] }">
            {{ oneRow.statistics.cluster_id }}
          </td>
          <td v-bind:class="{ sel_row: oneRow['currSelected'] }">
            <div>
              {{ oneRow.statistics.min_earn_str }}
            </div>
            <div>
              {{ oneRow.statistics.min_earn_aux_str }}
            </div>
            <div>
              {{ oneRow.statistics.min_earn_tri_str }}
            </div>
          </td>
          <td v-bind:class="{ sel_row: oneRow['currSelected'] }">
            <div>
              {{ oneRow.statistics.avg_earn_str }}
            </div>
            <div>
              {{ oneRow.statistics.avg_earn_aux_str }}
            </div>
            <div>
              {{ oneRow.statistics.avg_earn_tri_str }}
            </div>
          </td>
          <td v-bind:class="{ sel_row: oneRow['currSelected'] }">
            <div>
              {{ oneRow.statistics.max_earn_str }}
            </div>
            <div>
              {{ oneRow.statistics.max_earn_aux_str }}
            </div>
            <div>
              {{ oneRow.statistics.max_earn_tri_str }}
            </div>
          </td>
          <td style="text-align: left;" v-bind:class="{ sel_row: oneRow['currSelected'] }">
            <div style="height: 1.8em; position: relative;"
                 v-bind:class="getPosColor(oneRow.positive.positive_reach_len)">
                <span v-if="oneRow.positive.positive_reach_len >= 4" class="icon_pos_right">
                  <i class="bi bi-arrow-up-circle-fill"></i>
                  <span class="lv_font">{{ oneRow.positive.positive_reach_len }}</span>
                </span>
            </div>
            <div style="height: 1.8em; position: relative;"
                 v-bind:class="getNegColor(oneRow.negative.negative_reach_len)">
                <span v-if="oneRow.negative.negative_reach_len >= 3" class="icon_pos_right">
                  <i class="bi bi-arrow-down-circle-fill"></i>
                  <span class="lv_font">{{ oneRow.negative.negative_reach_len }}</span>
                </span>
            </div>
            <div style="height: 3em; position: relative;">
            </div>
          </td>
          <td v-bind:class="{ sel_row: oneRow['currSelected'] }" style="text-align: center;">
            <div style="height:1.8em;">
              <span v-bind:class="getHitStyle(oneRow.positive.day_5_positive_reach)">&nbsp;</span>
              <span v-bind:class="getHitStyle(oneRow.positive.day_10_positive_reach)">&nbsp;</span>
              <span v-bind:class="getHitStyle(oneRow.positive.day_20_positive_reach)">&nbsp;</span>
              <span v-bind:class="getHitStyle(oneRow.positive.day_60_positive_reach)">&nbsp;</span>
              <span v-bind:class="getHitStyle(oneRow.positive.day_90_positive_reach)">&nbsp;</span>
              <span v-bind:class="getHitStyle(oneRow.positive.day_120_positive_reach)">&nbsp;</span>
              <span v-bind:class="getHitStyle(oneRow.positive.day_160_positive_reach)">&nbsp;</span>
              <span v-bind:class="getHitStyle(oneRow.positive.day_220_positive_reach)">&nbsp;</span>
            </div>
            <div style="height:1.8em;margin-top:5px;">
              <span v-bind:class="getHitStyle(oneRow.negative.day_5_negative_reach, false)">&nbsp;</span>
              <span v-bind:class="getHitStyle(oneRow.negative.day_10_negative_reach, false)">&nbsp;</span>
              <span v-bind:class="getHitStyle(oneRow.negative.day_20_negative_reach, false)">&nbsp;</span>
              <span v-bind:class="getHitStyle(oneRow.negative.day_60_negative_reach, false)">&nbsp;</span>
              <span v-bind:class="getHitStyle(oneRow.negative.day_90_negative_reach, false)">&nbsp;</span>
              <span v-bind:class="getHitStyle(oneRow.negative.day_120_negative_reach, false)">&nbsp;</span>
              <span v-bind:class="getHitStyle(oneRow.negative.day_160_negative_reach, false)">&nbsp;</span>
              <span v-bind:class="getHitStyle(oneRow.negative.day_220_negative_reach, false)">&nbsp;</span>
            </div>
            <div style="height: 3em; margin-top: 0.4rem; border-top: solid 1px darkgray; cursor: pointer;"
                 :style="{'background-color': (oneRow['show_wav']? 'cornsilk' : ''), 'font-style':  (oneRow['show_wav']? 'italic' : '')}"
                 v-if="oneRow.wav_obj" @click.stop="switchWavDisp(oneRow);">
              <div>
                <span>{{oneRow.wav_obj.avg_duration}}日</span>
                <span>&nbsp;{{oneRow.wav_obj.avg_exp_earn}}%</span>
                <span>&nbsp;{{oneRow.wav_obj.avg_exp_cnt}}次</span>
                <span :style="{'color': (oneRow.wav_obj.wav_dur_level < 3? 'red' :  oneRow.wav_obj.wav_dur_level < 6? 'orange': ''), 'font-weight':  'bold'}">
                  &nbsp;L{{oneRow.wav_obj.wav_dur_level}}
                </span>
              </div>
              <div style="margin-top: -6px;">
                <span v-html="get_suggestion_by_wav(oneRow.wav_obj)"></span>
              </div>
            </div>
          </td>
          <td class="nr_td" colspan="3" v-bind:class="{ sel_row: oneRow['currSelected'] }">
            <div class="grid_r3">
              <select class="form-select nr_select" v-model="oneRow['esti_pe']['ding']" @click.stop>
                <option v-for="option in buy_in_esti_sugg_full" v-bind:value="option.source_val">
                  {{ option.source_name }}
                </option>
              </select>
              <select class="form-select nr_select" v-model="oneRow['esti_pe']['zhi']" @click.stop>
                <option v-for="option in buy_in_esti_sugg_full" v-bind:value="option.source_val">
                  {{ option.source_name }}
                </option>
              </select>
              <select class="form-select nr_select" v-model="oneRow['esti_pe']['wei']" @click.stop>
                <option v-for="option in buy_in_esti_sugg_full" v-bind:value="option.source_val">
                  {{ option.source_name }}
                </option>
              </select>
              <div></div>
              <div></div>
              <div class="right_pad">
                <button type="button" class="btn btn-outline-danger mw4_ctl" @click.stop="saveEstiPe($event, oneRow)">保存
                </button>
              </div>
            </div>
          </td>
          <td class="nr_td" v-bind:class="{ sel_row: oneRow['currSelected'] }">
            <div class="grid_1">
              <template v-if="(oneRow['compose_plan'] && oneRow['compose_plan'] === 'noplan')
              ||(!oneRow.hasOwnProperty('compose_obj') || !oneRow['compose_obj'])">
                <div style="text-wrap: nowrap; display: flex; align-items: center;">额:&nbsp;
                  <input type="number" style="width: 3.5rem; border-radius: 5px; flex-grow: 1;" 
                  v-model="oneRow['plan_buyin_money']" @click.stop>                  
               </div>
                <select class="form-select nr_select" @click.stop v-model="oneRow['target_plan']">
                  <option v-for="option in buy_in_from_plan" v-bind:value="option.source_val">
                    {{ option.source_name }}
                  </option>
                </select>
                <div class="right_pad">
                  <button type="button" class="btn btn-warning mw4_ctl" @click.stop="changeCompose($event, oneRow)"
                          v-bind:disabled="!oneRow['target_plan'] || oneRow['target_plan'] === 'noplan' 
                          || !oneRow.hasOwnProperty('plan_buyin_money') || !oneRow['plan_buyin_money'] 
                          || oneRow['plan_buyin_money'] < -1">保存
                  </button>
                </div>
              </template>
              <template v-if="oneRow['compose_plan'] && oneRow['compose_plan'] !== 'noplan'">
                <template v-if="oneRow['compose_obj']">
                  <div style="text-align: center;" 
                  :style="{'color': oneRow['plan_buyin_money'] - oneRow['compose_obj']['money'] >=10? '#f96' : 
                  oneRow['compose_obj']['money'] - oneRow['plan_buyin_money'] >=10? 'red' : '',
                  'font-weight': Math.abs(oneRow['plan_buyin_money'] - oneRow['compose_obj']['money'])>=10? 'bold':'normal'}">
                    <span style="font-size: 1rem;">初:{{oneRow['plan_buyin_money']}}&nbsp;</span>
                    <span style="font-size: 1rem;">现:{{oneRow['compose_obj']['money']}}</span>
                  </div>
                </template>
                <div>
                  <template v-if="oneRow['compose_plan'] === 'ovtree'">
                      <span class="badge bg-primary text-bg-success big_badge">
                        橄榄树
                      </span>
                  </template>
                  <template v-else-if="oneRow['compose_plan'] === 'flyhorse'">
                      <span class="badge bg-secondary text-bg-success big_badge">
                        飞马
                      </span>
                  </template>
                  <template v-else-if="oneRow['compose_plan'] === 'medusa'">
                      <span class="badge bg-warning text-bg-success big_badge">
                        美杜莎
                      </span>
                  </template>                    
                  <template v-else-if="oneRow['compose_plan'] === 'dolphin'">
                      <span class="badge bg-info text-bg-success big_badge">
                        海豚
                      </span>
                  </template>
                  <template v-else-if="oneRow['compose_plan'] === 'trident'">
                      <span class="badge bg-success text-bg-success big_badge">
                        三叉戟
                      </span>
                  </template>
                  <template v-else-if="oneRow['compose_plan'] === 'gdngoat'">
                      <span class="badge bg-danger text-bg-success big_badge">
                        金毛羊
                      </span>
                  </template>
                </div>
              </template>
            </div>
          </td>
        </tr>
        <tr v-if="oneRow['show_wav']">
          <td colspan="12" style="background-color: lightblue;">
            <img v-bind:src="'../wav-report/'+oneRow['fund_id']+'.png'"
                 style="width: 100%; height: 100%; max-width: 100%;" class="img-fluid" alt="Responsive image">
          </td>
        </tr>
      </template>
      </tbody>
      <tfoot>
      <tr style="line-height: 5rem; border-color: white;">
        <td colspan="12">
          &nbsp;
        </td>
      </tr>
      </tfoot>
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
  getCardStyle,
  typeMapObj,
  topSecClass,
  getPosColor,
  getNegColor,
  getHitStyle,
  get_suggestion_by_wav
} from "../lib/commonUtils.js"
import {computed, nextTick, ref, watch} from "vue";
import {storeToRefs} from 'pinia'
import {useZskbStore} from "../store/zskbStore.js";
import {useComposeStore} from "../store/composeStore.js";
import {useBuyInOutStore} from "../store/buyInOutStore.js";

const zskbStore = useZskbStore()
const {zskbObjs} = storeToRefs(zskbStore)
const {getZskb} = zskbStore
const composeStore = useComposeStore()
const {composeObjs} = storeToRefs(composeStore)
const {addOrRemoveCompose} = composeStore
const buyInOutStore = useBuyInOutStore()
const {wav_reports} = storeToRefs(buyInOutStore)
const {calculatePlanMoney} = buyInOutStore

const buy_in_esti_sugg_full = [
  {'source_name': '未知', 'source_val': -2},
  {'source_name': '持有', 'source_val': 0},
  {'source_name': '买入', 'source_val': 1},
  {'source_name': '卖出', 'source_val': -1}
]

const buy_in_from_plan = [
  {'source_name': '无计划', 'source_val': 'noplan'},
  {'source_name': '橄榄树', 'source_val': 'ovtree'},
  {'source_name': '飞马', 'source_val': 'flyhorse'},
  {'source_name': '美杜莎', 'source_val': 'medusa'},    
  //不能放开选择，因为后台业务逻辑严格绑定了类别
  //{'source_name': '海豚', 'source_val': 'dolphin'},
  {'source_name': '三叉戟', 'source_val': 'trident'},
  //{'source_name': '金毛羊', 'source_val': 'gdngoat'}
]

const colWidMap = {
  'col_1': 8,
  'col_2': 4,
  'col_3': 3,
  'col_4': 4,
  'col_5': 4,
  'col_6': 4,
  'col_7': 3,
  'col_8': 11,
  'col_9': 4.5,
  'col_10': 4.5,
  'col_11': 4.5,
  'col_12': 5
}

const zskbViewObjs = ref([])
const wideIdxOnly = ref(true)
const topicIdxOnly = ref(true)
const indusIdxOnly = ref(true)
const qdiiIdxOnly = ref(true)
const mzIdxOnly = ref(true)

watch([zskbObjs, wideIdxOnly, topicIdxOnly, indusIdxOnly, qdiiIdxOnly, mzIdxOnly, composeObjs], () => {
  if (wideIdxOnly.value && topicIdxOnly.value && indusIdxOnly.value && qdiiIdxOnly.value && mzIdxOnly.value) {
    zskbViewObjs.value = zskbObjs.value
  } else {
    zskbViewObjs.value = []
    if (wideIdxOnly.value) {
      zskbObjs.value.forEach(elem => {
        if (elem['indexType'] === 0) {
          zskbViewObjs.value.push(elem)
        }
      })
    }
    if (topicIdxOnly.value) {
      zskbObjs.value.forEach(elem => {
        if (elem['indexType'] === 1) {
          zskbViewObjs.value.push(elem)
        }
      })
    }
    if (indusIdxOnly.value) {
      zskbObjs.value.forEach(elem => {
        if (elem['indexType'] === 2) {
          zskbViewObjs.value.push(elem)
        }
      })
    }
    if (qdiiIdxOnly.value) {
      zskbObjs.value.forEach(elem => {
        if (elem['indexType'] === 3) {
          zskbViewObjs.value.push(elem)
        }
      })
    }
    if (mzIdxOnly.value) {
      zskbObjs.value.forEach(elem => {
        if (elem['indexType'] === 4) {
          zskbViewObjs.value.push(elem)
        }
      })
    }    
  }
  if (composeObjs && composeObjs.value && composeObjs.value.length > 0) {
    let _ovtree_fund_ids = composeObjs.value.find(item => item['compose_name'] === 'ovtree')['compose_objs'].map(item => item['fund_id'])
    let _ovtree_fund_objs = composeObjs.value.find(item => item['compose_name'] === 'ovtree')['compose_objs']
    let _flyhorse_fund_ids = composeObjs.value.find(item => item['compose_name'] === 'flyhorse')['compose_objs'].map(item => item['fund_id'])
    let _flyhorse_fund_objs = composeObjs.value.find(item => item['compose_name'] === 'flyhorse')['compose_objs']
    let _medusa_fund_ids = composeObjs.value.find(item => item['compose_name'] === 'medusa')['compose_objs'].map(item => item['fund_id'])
    let _medusa_fund_objs = composeObjs.value.find(item => item['compose_name'] === 'medusa')['compose_objs']        
    let _dolphin_fund_ids = composeObjs.value.find(item => item['compose_name'] === 'dolphin')['compose_objs'].map(item => item['fund_id'])
    let _dolphin_fund_objs = composeObjs.value.find(item => item['compose_name'] === 'dolphin')['compose_objs']
    let _trident_fund_ids = composeObjs.value.find(item => item['compose_name'] === 'trident')['compose_objs'].map(item => item['fund_id'])
    let _trident_fund_objs = composeObjs.value.find(item => item['compose_name'] === 'trident')['compose_objs']
    let _gdngoat_fund_ids = composeObjs.value.find(item => item['compose_name'] === 'gdngoat')['compose_objs'].map(item => item['fund_id'])
    let _gdngoat_fund_objs = composeObjs.value.find(item => item['compose_name'] === 'gdngoat')['compose_objs']
    zskbViewObjs.value.forEach(elem => {
      if (_ovtree_fund_ids.indexOf(elem['fund_id']) != -1) {
        elem['compose_plan'] = 'ovtree'
        elem['compose_obj'] = _ovtree_fund_objs.find(_obj => _obj['fund_id'] === elem['fund_id'])
      } else if (_flyhorse_fund_ids.indexOf(elem['fund_id']) != -1) {
        elem['compose_plan'] = 'flyhorse'
        elem['compose_obj'] = _flyhorse_fund_objs.find(_obj => _obj['fund_id'] === elem['fund_id'])
      } else if (_medusa_fund_ids.indexOf(elem['fund_id']) != -1) {
        elem['compose_plan'] = 'medusa'
        elem['compose_obj'] = _medusa_fund_objs.find(_obj => _obj['fund_id'] === elem['fund_id'])
      } else if (_dolphin_fund_ids.indexOf(elem['fund_id']) != -1) {
        elem['compose_plan'] = 'dolphin'
        elem['compose_obj'] = _dolphin_fund_objs.find(_obj => _obj['fund_id'] === elem['fund_id'])
      } else if (_trident_fund_ids.indexOf(elem['fund_id']) != -1) {
        elem['compose_plan'] = 'trident'
        elem['compose_obj'] = _trident_fund_objs.find(_obj => _obj['fund_id'] === elem['fund_id'])
      } else if (_gdngoat_fund_ids.indexOf(elem['fund_id']) != -1) {
        elem['compose_plan'] = 'gdngoat'
        elem['compose_obj'] = _gdngoat_fund_objs.find(_obj => _obj['fund_id'] === elem['fund_id'])
      } else {
        //elem['compose_plan'] = 'noplan'
        elem['compose_obj'] = null
        if (elem.hasOwnProperty('compose_plan') && elem['compose_plan'] != 'noplan') {
          console.warn("zskb page get compose_obj failed: ", elem['fund_id'], elem['fund_name']);
        }
      }
      calculatePlanMoney('zskb', elem)
    })
  }
}, {immediate: true})

const currTotNum = computed(() => {
  return zskbViewObjs.value.length
})

function saveEstiPe(event, oneRowObj) {
  event.stopPropagation()
}

function changeCompose(event, oneRowObj) {
  event.stopPropagation()
  addOrRemoveCompose(oneRowObj['fund_id'], oneRowObj['fund_name'], oneRowObj['target_plan'], oneRowObj['plan_buyin_money'])
}

function selOrDesRow(oneRowObj) {
  if (oneRowObj.hasOwnProperty('currSelected')) {
    oneRowObj['currSelected'] = !oneRowObj['currSelected']
  } else {
    oneRowObj['currSelected'] = true
  }
}

function clearSelected() {
  zskbViewObjs.value.forEach((elem) => elem['currSelected'] = false)
}

const currSelectedNum = ref(0)

watch(zskbObjs, () => {
  let _filtered = zskbObjs.value.filter((elem => elem['currSelected']))
  currSelectedNum.value = _filtered.length
}, {
  deep: true
})

const sortFieldName = ref('')
const sortFieldFlag = ref(true)

function sortByField(_field) {
  if (sortFieldName.value === _field) {
    sortFieldFlag.value = !sortFieldFlag.value
  } else {
    sortFieldName.value = _field
    sortFieldFlag.value = true
  }
  if (_field === 'perc_not_update_days') {
    if (sortFieldFlag.value) {
      zskbViewObjs.value.sort((a, b) => {
        return a['statistics']['perc_not_update_days'] - b['statistics']['perc_not_update_days'];
      });
    } else {
      zskbViewObjs.value.sort((a, b) => {
        return b['statistics']['perc_not_update_days'] - a['statistics']['perc_not_update_days'];
      });
    }
  } else if (_field === 'cluster_id') {
    if (sortFieldFlag.value) {
      zskbViewObjs.value.sort((a, b) => {
        return a['statistics']['cluster_id'] - b['statistics']['cluster_id'];
      });
    } else {
      zskbViewObjs.value.sort((a, b) => {
        return b['statistics']['cluster_id'] - a['statistics']['cluster_id'];
      });
    }
  } else if (_field === 'fund_type') {
    if (sortFieldFlag.value) {
      zskbViewObjs.value.sort((a, b) => {
        return a['indexType'] - b['indexType'];
      });
    } else {
      zskbViewObjs.value.sort((a, b) => {
        return b['indexType'] - a['indexType'];
      });
    }
  } else if (_field === 'min_earn') {
    if (sortFieldFlag.value) {
      zskbViewObjs.value.sort((a, b) => {
        return a['statistics']['min_sort_tot_earn'] - b['statistics']['min_sort_tot_earn'];
      });
    } else {
      zskbViewObjs.value.sort((a, b) => {
        return b['statistics']['min_sort_tot_earn'] - a['statistics']['min_sort_tot_earn'];
      });
    }
  } else if (_field === 'avg_earn') {
    if (sortFieldFlag.value) {
      zskbViewObjs.value.sort((a, b) => {
        return a['statistics']['avg_sort_tot_earn'] - b['statistics']['avg_sort_tot_earn'];
      });
    } else {
      zskbViewObjs.value.sort((a, b) => {
        return b['statistics']['avg_sort_tot_earn'] - a['statistics']['avg_sort_tot_earn'];
      });
    }
  } else if (_field === 'max_earn') {
    if (sortFieldFlag.value) {
      zskbViewObjs.value.sort((a, b) => {
        return a['statistics']['max_sort_tot_earn'] - b['statistics']['max_sort_tot_earn'];
      });
    } else {
      zskbViewObjs.value.sort((a, b) => {
        return b['statistics']['max_sort_tot_earn'] - a['statistics']['max_sort_tot_earn'];
      });
    }
  } else if (_field === 'positive') {
    if (sortFieldFlag.value) {
      zskbViewObjs.value.sort((a, b) => {
        if (a['positive']['positive_reach_len'] != b['positive']['positive_reach_len']) {
          return a['positive']['positive_reach_len'] - b['positive']['positive_reach_len'];
        } else {
          return b['negative']['negative_reach_len'] - a['negative']['negative_reach_len'];
        }
      });
    } else {
      zskbViewObjs.value.sort((a, b) => {
        if (a['positive']['positive_reach_len'] != b['positive']['positive_reach_len']) {
          return b['positive']['positive_reach_len'] - a['positive']['positive_reach_len'];
        } else {
          return a['negative']['negative_reach_len'] - b['negative']['negative_reach_len'];
        }
      });
    }
  } else if (_field === 'negative') {
    if (sortFieldFlag.value) {
      zskbViewObjs.value.sort((a, b) => {
        if (a['negative']['negative_reach_len'] != b['negative']['negative_reach_len']) {
          return a['negative']['negative_reach_len'] - b['negative']['negative_reach_len'];
        } else {
          return b['positive']['positive_reach_len'] - a['positive']['positive_reach_len'];
        }
      });
    } else {
      zskbViewObjs.value.sort((a, b) => {
        if (a['negative']['negative_reach_len'] != b['negative']['negative_reach_len']) {
          return b['negative']['negative_reach_len'] - a['negative']['negative_reach_len'];
        } else {
          return a['positive']['positive_reach_len'] - b['positive']['positive_reach_len'];
        }
      });
    }
  } else if (_field === 'wav_rate') {
    if (sortFieldFlag.value) {
      zskbViewObjs.value.sort((a, b) => {
        return a['wav_obj']['wav_sort_level'] - b['wav_obj']['wav_sort_level'];
      });
    } else {
      zskbViewObjs.value.sort((a, b) => {
        return b['wav_obj']['wav_sort_level'] - a['wav_obj']['wav_sort_level'];
      });
    }
  } else if (_field === 'day_xxx_thres') {
    if (sortFieldFlag.value) {
      zskbViewObjs.value.sort((a, b) => {
        return a['statistics']['day_sort_tot_thres'] - b['statistics']['day_sort_tot_thres'];
      });
    } else {
      zskbViewObjs.value.sort((a, b) => {
        return b['statistics']['day_sort_tot_thres'] - a['statistics']['day_sort_tot_thres'];
      });
    }
  } else if (_field === 'fund_len') {
    if (sortFieldFlag.value) {
      zskbViewObjs.value.sort((a, b) => {
        return a['statistics']['fund_perc_len'] - b['statistics']['fund_perc_len'];
      });
    } else {
      zskbViewObjs.value.sort((a, b) => {
        return b['statistics']['fund_perc_len'] - a['statistics']['fund_perc_len'];
      });
    }
  } else if (_field === 'esti_pe_ding') {
    if (sortFieldFlag.value) {
      zskbViewObjs.value.sort((a, b) => {
        return a['esti_pe']['ding'] - b['esti_pe']['ding'];
      });
    } else {
      zskbViewObjs.value.sort((a, b) => {
        return b['esti_pe']['ding'] - a['esti_pe']['ding'];
      });
    }
  } else if (_field === 'esti_pe_zhi') {
    if (sortFieldFlag.value) {
      zskbViewObjs.value.sort((a, b) => {
        return a['esti_pe']['zhi'] - b['esti_pe']['zhi'];
      });
    } else {
      zskbViewObjs.value.sort((a, b) => {
        return b['esti_pe']['zhi'] - a['esti_pe']['zhi'];
      });
    }
  } else if (_field === 'esti_pe_wei') {
    if (sortFieldFlag.value) {
      zskbViewObjs.value.sort((a, b) => {
        return a['esti_pe']['wei'] - b['esti_pe']['wei'];
      });
    } else {
      zskbViewObjs.value.sort((a, b) => {
        return b['esti_pe']['wei'] - a['esti_pe']['wei'];
      });
    }
  } else if (_field === 'compose_plan') {
    if (sortFieldFlag.value) {
      zskbViewObjs.value.sort((a, b) => {
        let _a_compose = a['compose_plan']
        let _a_val = (_a_compose === 'noplan') ? 100 : (_a_compose === 'ovtree') ? 0 : (_a_compose === 'dolphin') ? 1 : (_a_compose === 'trident') ? 2 : (_a_compose === 'gdngoat') ? 3 : (_a_compose === 'flyhorse') ? 4 : (_a_compose === 'medusa') ? 5 : 6
        let _b_compose = b['compose_plan']
        let _b_val = (_b_compose === 'noplan') ? 100 : (_b_compose === 'ovtree') ? 0 : (_b_compose === 'dolphin') ? 1 : (_b_compose === 'trident') ? 2 : (_b_compose === 'gdngoat') ? 3 : (_b_compose === 'flyhorse') ? 4 : (_b_compose === 'medusa') ? 5 : 6
        return _a_val - _b_val
      });
    } else {
      zskbViewObjs.value.sort((a, b) => {
        let _a_compose = a['compose_plan']
        let _a_val = (_a_compose === 'noplan') ? 100 : (_a_compose === 'ovtree') ? 0 : (_a_compose === 'dolphin') ? 1 : (_a_compose === 'trident') ? 2 : (_a_compose === 'gdngoat') ? 3 : (_a_compose === 'flyhorse') ? 4 : (_a_compose === 'medusa') ? 5 : 6
        let _b_compose = b['compose_plan']
        let _b_val = (_b_compose === 'noplan') ? 100 : (_b_compose === 'ovtree') ? 0 : (_b_compose === 'dolphin') ? 1 : (_b_compose === 'trident') ? 2 : (_b_compose === 'gdngoat') ? 3 : (_b_compose === 'flyhorse') ? 4 : (_b_compose === 'medusa') ? 5 : 6
        return _b_val - _a_val
      });
    }
  } else if (_field === 'selected') {
    zskbViewObjs.value.sort((a, b) => {
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
  // TODO: fund_plan sort
  scrollViewBySelection()
}

function scrollViewBySelection() {
  nextTick(() => {
    if (currSelectedNum.value >= 1) {
      const func = elem => elem['currSelected']
      let _idx = zskbViewObjs.value.findIndex(func)
      if (_idx != -1) {
        let _rowObj = zskbViewObjs.value[_idx]
        if (rowElements.value[_rowObj['fund_id']]) {
            rowElements.value[_rowObj['fund_id']].scrollIntoView({block: "center", behavior: "smooth"})
        }
      }
    } else {
      let _fund_id = zskbViewObjs.value[0]['fund_id']
      if (rowElements.value[_fund_id]) {
          rowElements.value[_fund_id].scrollIntoView({block: "center", behavior: "smooth"})
      }
    }
  })
}

const rowElements = ref({})

const searchCond = ref("")

function searchByCond() {
  if (searchCond.value.trim() === '') {
    clearSelected()
    return
  }
  let _foundCnt = 0
  let _checkStrBackup = searchCond.value
  let _testStr = _checkStrBackup.replace(/[0-9]/g, "")
  let _pureStr = _testStr.trim()
  if (_pureStr.length === 0 && searchCond.value.length === 6) {
    // fund id
    let _fundId = searchCond.value.trim()
    zskbViewObjs.value.forEach((elem) => {
      if (elem['fund_id'] === _fundId) {
        elem['currSelected'] = true
        _foundCnt += 1
      }
    })
  } else {
    // fund name
    let arr = searchCond.value.trim().split(" ")
    zskbViewObjs.value.forEach((elem) => {
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
  }  

  if (_foundCnt > 0) {
    sortByField('selected')
  } else {
    searchCond.value = ""
    alert("根据id和名称都没有找到");
  }
}

function switchWavDisp(oneRowObj) {
  if (!oneRowObj.hasOwnProperty('show_wav')) {
    oneRowObj['show_wav'] = true;
  } else {
    oneRowObj['show_wav'] = !oneRowObj['show_wav'];
  }
}
</script>

<style scoped>
/*.nr_select {*/
/*  width: 100%;*/
/*  padding: 0.5rem 0.1rem 0.5rem 0.1rem;*/
/*}*/

.nr_td {
  text-align: left;
  padding-left: 0.1rem !important;
  padding-right: 0.1rem !important;
}

.grid_r3 {
  display: grid;
  justify-content: space-between;
  grid-template-columns: repeat(auto-fill, 33%);
  align-items: baseline;
  row-gap: 0.5rem;
  column-gap: 0;
}

.grid_1 {
  display: grid;
  justify-content: space-between;
  grid-template-columns: repeat(auto-fill, 100%);
  align-items: baseline;
  row-gap: 0.5rem;
  column-gap: 0;
}

.mw4_ctl {
  max-width: 4rem;
}

.big_badge {
  margin: auto;
  width: 100%;
  line-height: 2.2rem;
  font-size: 0.9rem;
}
</style>
