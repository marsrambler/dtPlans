<template>
  <div :style="topSecClass">
    <div id="op_pane" :style="{ 'height': opPaneHeight + 'rem' }" class="grid_pane_c10">
      <div>总数&nbsp;<span class="badge bg-success">{{ currTotNum }}</span><!--
      --></div>
      <div style="cursor: pointer;" @click="clearSelected()">
        选择&nbsp;<span class="badge bg-warning text-dark">{{ currSelectedNum }}</span>
      </div>
      <div style="">
        丢失&nbsp;<span class="badge bg-warning text-bg-danger">{{ lostConvgNum }}</span>
      </div>
      <div style="position: relative; top:4px;"><!--
        --><input class="form-check-input" type="checkbox" id="chk_hidden" v-model="showHides"><!--
        -->&nbsp;<label for="chk_hidden">隐藏</label>&nbsp;<span class="badge bg-dark" style="cursor: pointer;position:relative;top:-1px;" @click="clearAllHides()">{{
          currRepoHideNum }}</span><!--
      --></div>
      <input type="text" class="form-control-plaintext search_box" style="grid-column: 5 / span 2;" v-model="searchCond"
        @keyup.enter="searchByCond()">
      <input class="btn btn-primary btn-sm" type="button" value="查找" @click="searchByCond()">
      <input class="btn btn-primary btn-sm" type="button" value="前移选择" @click="sortByField('selected')">
      <input class="btn btn-warning btn-sm" type="button" value="隐藏选择" @click="hideSelected()">
      <!--
      <input class="btn btn-warning btn-sm" type="button" value="刷新" @click="getZskb()">
      -->
    </div>
    <table id="table_header" class="table table-bordered" style="margin-bottom: 0;">
      <thead style="">
        <tr :style="{ 'height': tabHeaderHeight + 'rem' }">
          <th :style="{ 'width': colWidMap['col_1'] + 'rem' }">
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
          <th :style="{ 'width': colWidMap['col_2'] + 'rem' }" @click="sortByField('avg_convg_days')">
            <template v-if="sortFieldName === 'avg_convg_days'">
              <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
              <span v-else><i class="bi bi-arrow-down"></i></span>
            </template><!--
          --><span>收敛</span>
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
          <th :style="{ 'width': colWidMap['col_9'] + 'rem' }">
            <template v-if="sortFieldName === 'esti_pe_ding'">
              <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
              <span v-else><i class="bi bi-arrow-down"></i></span>
            </template>
            <span>变动</span>
          </th>
          <th :style="{ 'width': colWidMap['col_10'] + 'rem' }" @click="sortByField('hold_money')">
            <template v-if="sortFieldName === 'hold_money'">
              <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
              <span v-else><i class="bi bi-arrow-down"></i></span>
            </template>
            <span>持有</span>
          </th>
          <th :style="{ 'width': colWidMap['col_11'] + 'rem' }" @click="sortByField('compose_plan')">
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
        </tr>
      </thead>
      <tbody>
        <template v-for="oneRow in convgViewObjs" :key="oneRow.fund_id">
          <template v-if="((!showHides && !oneRow['hide_disp']) || showHides)">
            <template v-if="oneRow['lost_in_dtconvg']">
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
                </td>
                <td v-bind:class="{ sel_row: oneRow['currSelected'] }" colspan="9">
                  <span style="color: red; font-weight: 900;">数据已缺失，原因：经理更换或盈利率已经不满足收敛条件。</span>
                </td>
                <td class="nr_td" v-bind:class="{ sel_row: oneRow['currSelected'] }">
                  <div class="grid_1">
                    <template v-if="oneRow['compose_plan'] && oneRow['compose_plan'] !== 'noplan'">
                      <div>
                        <template v-if="oneRow['compose_plan'] === 'ovtree'">
                          <span class="badge bg-primary text-bg-success big_badge">
                            橄榄树
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
            </template>
            <template v-else>
              <tr v-bind:id="oneRow.fund_id" style="cursor: pointer;" @click="selOrDesRow(oneRow)"
                v-bind:class="{ sel_row: oneRow['currSelected'] }"
                :ref="(el) => { if (el) { rowElements[oneRow.fund_id] = el; } }">
                <td v-bind:class="{ sel_row: oneRow['currSelected'] }">
                  <div>
                    {{ oneRow.fund_id }}
                    <template
                      v-if="oneRow['statistics']['perc_not_update_days'] && oneRow['statistics']['perc_not_update_days'] - 1 >= 3">
                      <span class="badge bg-danger">缺失: {{ oneRow.statistics.perc_not_update_days }}</span>
                    </template>
                    <span v-if="oneRow['exclude_repo']" class="badge bg-dark" style="margin-left: 0.5rem;">已排除</span>
                    <input v-else class="btn btn-danger btn-sm" style="margin-left: 0.5rem;" type="button" value="永远排除"
                      @click.stop="addConvgExclude(oneRow.fund_id, oneRow.fund_name)">
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
                    <span>{{ oneRow.fund_perc_len }}</span>
                  </div>
                </td>
                <td v-bind:class="{ sel_row: oneRow['currSelected'] }" style="text-align: center;">
                  <div><span style="text-decoration: underline; font-size: 0.9rem;">P50</span>&nbsp;{{
                    oneRow['p50_convg_dur'] }}</div>
                  <div><span style="text-decoration: underline; font-size: 0.9rem;">P65</span>&nbsp;{{
                    oneRow['p65_convg_dur'] }}</div>
                  <div><span style="text-decoration: underline; font-size: 0.9rem;">P80</span>&nbsp;{{
                    oneRow['p80_convg_dur'] }}</div>
                  <div style="height: 2.5rem; line-height: 2.5rem; border-top: solid 1px darkgray; margin-top: 0.5rem;"
                    @click.stop="switchDtlPicDisp(oneRow)"
                    :style="{ 'background-color': (oneRow['show_dtl_pic'] ? 'cornsilk' : ''), 'font-style': (oneRow['show_dtl_pic'] ? 'italic' : '') }">
                    <span>详图</span>
                  </div>
                </td>
                <td v-bind:class="{ sel_row: oneRow['currSelected'] }">
                  {{ oneRow.cluster_id }}
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
                    <span v-bind:class="getHitStyle(oneRow.positive.day_200_positive_reach)">&nbsp;</span>
                  </div>
                  <div style="height:1.8em;margin-top:5px;">
                    <span v-bind:class="getHitStyle(oneRow.negative.day_5_negative_reach, false)">&nbsp;</span>
                    <span v-bind:class="getHitStyle(oneRow.negative.day_10_negative_reach, false)">&nbsp;</span>
                    <span v-bind:class="getHitStyle(oneRow.negative.day_20_negative_reach, false)">&nbsp;</span>
                    <span v-bind:class="getHitStyle(oneRow.negative.day_60_negative_reach, false)">&nbsp;</span>
                    <span v-bind:class="getHitStyle(oneRow.negative.day_90_negative_reach, false)">&nbsp;</span>
                    <span v-bind:class="getHitStyle(oneRow.negative.day_120_negative_reach, false)">&nbsp;</span>
                    <span v-bind:class="getHitStyle(oneRow.negative.day_160_negative_reach, false)">&nbsp;</span>
                    <span v-bind:class="getHitStyle(oneRow.negative.day_200_negative_reach, false)">&nbsp;</span>
                  </div>
                  <div style="height: 3em; margin-top: 0.4rem; border-top: solid 1px darkgray; cursor: pointer;"
                    :style="{ 'background-color': (oneRow['show_wav'] ? 'cornsilk' : ''), 'font-style': (oneRow['show_wav'] ? 'italic' : '') }"
                    v-if="oneRow.wav_obj" @click.stop="switchWavDisp(oneRow);">
                    <div>
                      <span>{{ oneRow.wav_obj.avg_duration }}日</span>
                      <span>&nbsp;{{ oneRow.wav_obj.avg_exp_earn }}%</span>
                      <span>&nbsp;{{ oneRow.wav_obj.avg_exp_cnt }}次</span>
                      <span
                        :style="{ 'color': (oneRow.wav_obj.wav_dur_level < 3 ? 'red' : oneRow.wav_obj.wav_dur_level < 6 ? 'orange' : ''), 'font-weight': 'bold' }">
                        &nbsp;L{{ oneRow.wav_obj.wav_dur_level }}
                      </span>
                    </div>
                    <div style="margin-top: -6px;">
                      <span v-html="get_suggestion_by_wav(oneRow.wav_obj)"></span>
                    </div>
                  </div>
                </td>
                <td class="nr_td" v-bind:class="{ sel_row: oneRow['currSelected'] }">
                  <div style="text-align: center; font-size: 0.9rem; border-radius: 0.5rem;"
                    :class="oneRow['manager_disp_class']">
                    <div style="font-size: inherit;">{{ oneRow['manager_disp_1st_line'] }}</div>
                    <div style="font-size: inherit;">{{ oneRow['manager_disp_2nd_line'] }}</div>
                  </div>
                  <div class="right_pad">
                    <button type="button" class="btn btn-outline-danger mw4_ctl" style="margin-top: 0.3rem;"
                      @click.stop="custBuyIn(oneRow.fund_id, oneRow.fund_name)" v-bind:disabled="!oneRow['canGenMgr']">更新
                    </button>
                  </div>
                </td>
                <td class="nr_td" v-bind:class="{ sel_row: oneRow['currSelected'] }">
                  <template v-if="oneRow['tot_money']">
                    <div style="font-size: 0.9rem;" :class="oneRow['already_hold_money_class']">
                      已持:&nbsp;{{ oneRow['tot_money'] }}</div>
                    <div style="font-size: 0.9rem;" :class="oneRow['already_hold_dates_class']">
                      日:&nbsp;{{ oneRow['distance_disp_str'] }}</div>
                    <div style="font-size: 0.9rem;" :class="oneRow['already_hold_rate_class']">
                      计:&nbsp;{{ oneRow['tot_rate_str'] }}</div>
                  </template>
                </td>
                <td class="nr_td" v-bind:class="{ sel_row: oneRow['currSelected'] }">
                  <div class="grid_1">
                    <template v-if="oneRow['compose_plan'] && oneRow['compose_plan'] === 'noplan'">
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
                <td colspan="11" style="background-color: lightblue;">
                  <img v-bind:src="'../wav-report/' + oneRow['fund_id'] + '.png'"
                    style="width: 100%; height: 100%; max-width: 100%;" class="img-fluid" alt="Responsive image">
                </td>
              </tr>
              <tr v-if="oneRow['show_dtl_pic']">
                <td colspan="11" style="background-color: lightblue;">
                  <img v-bind:src="'../dt_plans_web/dtPlans/' + oneRow['fund_id'] + '.png'"
                    style="width: 100%; height: 100%; max-width: 100%;" class="img-fluid" alt="Responsive image">
                </td>
              </tr>
            </template>
          </template>
        </template>
      </tbody>
      <tfoot>
        <tr style="line-height: 5rem; border-color: white;">
          <td colspan="11">
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
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { storeToRefs } from 'pinia'
import { useConvgStore } from "../store/convgStore.js";
import { useComposeStore } from "../store/composeStore.js";
import { Modal } from "bootstrap";
import { useBuyInOutStore } from "../store/buyInOutStore.js";

const convgStore = useConvgStore()
const { convgObjs, convgExcludes } = storeToRefs(convgStore)
const { getAllConvg, getConvgExcludes, addConvgExclude } = convgStore
const composeStore = useComposeStore()
const { composeObjs } = storeToRefs(composeStore)
const { addOrRemoveCompose, } = composeStore
const buyInOutStore = useBuyInOutStore()
const { buyin_records, wav_reports } = storeToRefs(buyInOutStore)
const { getAllBuyinRecords, custBuyIn, calculatePlanMoney } = buyInOutStore

const buy_in_from_plan = [
  { 'source_name': '无计划', 'source_val': 'noplan' },
  { 'source_name': '海豚', 'source_val': 'dolphin' }
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
  'col_9': 7,
  'col_10': 5,
  'col_11': 5
}

getAllConvg()
getConvgExcludes()

const lostConvgNum = ref(0)
const convgViewObjs = ref([])

watch([convgObjs, convgExcludes, buyin_records], () => {
  convgViewObjs.value = convgObjs.value

  if (convgExcludes && convgExcludes.value && convgExcludes.value.length > 0) {
    convgViewObjs.value.forEach(elem => {
      if (convgExcludes.value.indexOf(elem['fund_id']) != -1) {
        elem['exclude_repo'] = true
      } else {
        elem['exclude_repo'] = false
      }
    })
  }
  convgViewObjs.value.forEach(elem => {
    if (elem['manager_info_2']) {
      let _manager_info = elem['manager_info_2']
      let _elements = _manager_info.split(",");
      let _element_0 = _elements[0];
      // manager display 1st line
      elem['manager_disp_1st_line'] = ""
      if (_element_0.trim() == "" || _elements.length < 2) {
        elem['manager_disp_1st_line'] = ""
      } else {
        let _element_1 = _elements[1];
        if (_element_1.trim() == "") {
          elem['manager_disp_1st_line'] = _element_0
        } else {
          elem['manager_disp_1st_line'] = _element_0 + "," + _element_1
        }
      }
      // manager display 2nd line
      let _last_element = _elements[_elements.length - 1];
      if (_last_element.trim() == '') {
        _last_element = _elements[_elements.length - 2];
      }
      elem['manager_disp_2nd_line'] = _last_element.trim();
    }
    // manager display class
    elem['manager_disp_class'] = ''
    if (elem['manager_has_change']) {
      if (elem['manager_has_change_str'] >= 1095) {
        elem['manager_disp_class'] = 'manager_above_year_3_with_change'
      } else if (elem['manager_has_change_str'] >= 730) {
        elem['manager_disp_class'] = 'manager_above_year_2_with_change'
      } else if (elem['manager_has_change_str'] >= 365) {
        elem['manager_disp_class'] = 'manager_above_year_1_with_change'
      } else if (elem['manager_has_change_str'] >= 182) {
        elem['manager_disp_class'] = 'manager_above_year_half_with_change'
      } else {
        elem['manager_disp_class'] = 'manager_above_year_0_with_change'
      }
    } else {
      if (elem['manager_has_change_str'] >= 1095) {
        elem['manager_disp_class'] = 'manager_above_year_3_without_change'
      } else if (elem['manager_has_change_str'] >= 730) {
        elem['manager_disp_class'] = 'manager_above_year_2_without_change'
      } else if (elem['manager_has_change_str'] >= 365) {
        elem['manager_disp_class'] = 'manager_above_year_1_without_change'
      } else if (elem['manager_has_change_str'] >= 182) {
        elem['manager_disp_class'] = 'manager_above_year_half_without_change'
      } else {
        elem['manager_disp_class'] = 'manager_above_year_0_without_change'
      }
    }
    // already hold buyin
    elem['distance_disp_str'] = ''
    if (!elem['distances'] || elem['distances'].length == 0) {
    } else {
      let _start_idx = 0;
      if (elem['distances'].length >= 2) { // only disp the last 2 days
        _start_idx = elem['distances'].length - 2;
      } else {
        _start_idx = elem['distances'].length - 1;
      }
      for (let _idx = _start_idx; _idx < elem['distances'].length; _idx++) {
        if (_idx == _start_idx) {
        } else {
          elem['distance_disp_str'] += "|";
        }
        elem['distance_disp_str'] += elem['distances'][_idx].toString();
      }
    }
    // already hold money class
    if (elem['tot_money']) {
      if (elem['tot_money'] >= 4000) {
        elem['already_hold_money_class'] = 'extr_big_already_buy';
      } else if (elem['tot_money'] >= 3000) {
        elem['already_hold_money_class'] = 'very_big_already_buy';
      } else if (elem['tot_money'] >= 2000) {
        elem['already_hold_money_class'] = 'big_already_buy';
      } else if (elem['tot_money'] >= 1000) {
        elem['already_hold_money_class'] = 'middle_already_buy';
      } else if (elem['tot_money'] >= 500) {
        elem['already_hold_money_class'] = 'small_already_buy';
      } else {
        elem['already_hold_money_class'] = 'emtpy_already_buy';
      }
    } else {
      elem['already_hold_money_class'] = 'emtpy_already_buy';
    }
    // already hold dates class
    if (elem['distances'] && elem['distances'].length > 0) {
      let _last_distance = elem['distances'][elem['distances'].length - 1];
      if (_last_distance >= 360) {
        elem['already_hold_dates_class'] = 'extr_big_already_buy';
      } else if (_last_distance >= 180) {
        elem['already_hold_dates_class'] = 'very_big_already_buy';
      } else if (_last_distance >= 90) {
        elem['already_hold_dates_class'] = 'big_already_buy';
      } else if (_last_distance >= 30) {
        elem['already_hold_dates_class'] = 'middle_already_buy';
      } else if (_last_distance >= 7) {
        elem['already_hold_dates_class'] = 'small_already_buy';
      } else {
        elem['already_hold_dates_class'] = 'emtpy_already_buy';
      }
    } else {
      elem['already_hold_dates_class'] = 'emtpy_already_buy';
    }
    // already hold rate class
    if (elem['tot_rate']) {
      if (elem['tot_rate'] <= -0.35) {
        elem['already_hold_rate_class'] = 'extr_big_already_buy';
      } else if (elem['tot_rate'] <= -0.275) {
        elem['already_hold_rate_class'] = 'very_big_already_buy';
      } else if (elem['tot_rate'] <= -0.2) {
        elem['already_hold_rate_class'] = 'big_already_buy';
      } else if (elem['tot_rate'] <= -0.1) {
        elem['already_hold_rate_class'] = 'middle_already_buy';
      } else if (elem['tot_rate'] < 0) {
        elem['already_hold_rate_class'] = 'small_already_buy';
      } else {
        elem['already_hold_rate_class'] = 'emtpy_already_buy';
      }
    } else {
      elem['already_hold_rate_class'] = 'emtpy_already_buy';
    }
  })

  lostConvgNum.value = 0
  convgViewObjs.value.forEach(elem => {
    if (elem['lost_in_dtconvg']) {
      lostConvgNum.value++
    }
  })

  let _ovtree_fund_ids = composeObjs.value.find(item => item['compose_name'] === 'ovtree')['compose_objs'].map(item => item['fund_id'])
  let _ovtree_fund_objs = composeObjs.value.find(item => item['compose_name'] === 'ovtree')['compose_objs']
  let _dolphin_fund_ids = composeObjs.value.find(item => item['compose_name'] === 'dolphin')['compose_objs'].map(item => item['fund_id'])
  let _dolphin_fund_objs = composeObjs.value.find(item => item['compose_name'] === 'dolphin')['compose_objs']
  let _trident_fund_ids = composeObjs.value.find(item => item['compose_name'] === 'trident')['compose_objs'].map(item => item['fund_id'])
  let _trident_fund_objs = composeObjs.value.find(item => item['compose_name'] === 'trident')['compose_objs']
  let _gdngoat_fund_ids = composeObjs.value.find(item => item['compose_name'] === 'gdngoat')['compose_objs'].map(item => item['fund_id'])
  let _gdngoat_fund_objs = composeObjs.value.find(item => item['compose_name'] === 'gdngoat')['compose_objs']

  convgViewObjs.value.forEach(elem => {
    if (!buyin_records.value || buyin_records.value.length === 0) {
      elem['canGenMgr'] = true
    } else {
      const func = buyin => buyin['fund_id'] === elem['fund_id']
      let _idx = buyin_records.value.findIndex(func)
      if (_idx != -1) {
        elem['canGenMgr'] = false
      } else {
        elem['canGenMgr'] = true
      }
    }

    if (_ovtree_fund_ids.indexOf(elem['fund_id']) != -1) {
        //elem['compose_plan'] = 'ovtree'
        elem['compose_obj'] = _ovtree_fund_objs.find(_obj => _obj['fund_id'] === elem['fund_id'])
      } else if (_dolphin_fund_ids.indexOf(elem['fund_id']) != -1) {
        //elem['compose_plan'] = 'dolphin'
        elem['compose_obj'] = _dolphin_fund_objs.find(_obj => _obj['fund_id'] === elem['fund_id'])
      } else if (_trident_fund_ids.indexOf(elem['fund_id']) != -1) {
        //elem['compose_plan'] = 'trident'
        elem['compose_obj'] = _trident_fund_objs.find(_obj => _obj['fund_id'] === elem['fund_id'])
      } else if (_gdngoat_fund_ids.indexOf(elem['fund_id']) != -1) {
        //elem['compose_plan'] = 'gdngoat'
        elem['compose_obj'] = _gdngoat_fund_objs.find(_obj => _obj['fund_id'] === elem['fund_id'])
      } else {
        //elem['compose_plan'] = 'noplan'
        elem['compose_obj'] = null
        if (elem.hasOwnProperty('compose_plan') && elem['compose_plan'] != 'noplan') {
          console.warn("DtConvg page find compose_obj failed: ", elem['fund_id'], elem['fund_name']);
        }
      }

      calculatePlanMoney('dtconvg', elem)
  })

}, { immediate: true })

getAllBuyinRecords()

const currTotNum = computed(() => {
  return convgViewObjs.value.length
})

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
  convgViewObjs.value.forEach((elem) => elem['currSelected'] = false)
}

const currSelectedNum = ref(0)

watch(convgViewObjs, () => {
  let _filtered = convgViewObjs.value.filter((elem => elem['currSelected']))
  currSelectedNum.value = _filtered.length
  let _filtered_2 = convgViewObjs.value.filter((elem) => elem['hide_disp'])
  currRepoHideNum.value = _filtered_2.length
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
      convgViewObjs.value.sort((a, b) => {
        return a['statistics']['perc_not_update_days'] - b['statistics']['perc_not_update_days'];
      });
    } else {
      convgViewObjs.value.sort((a, b) => {
        return b['statistics']['perc_not_update_days'] - a['statistics']['perc_not_update_days'];
      });
    }
  } else if (_field === 'cluster_id') {
    if (sortFieldFlag.value) {
      convgViewObjs.value.sort((a, b) => {
        return a['cluster_id'] - b['cluster_id'];
      });
    } else {
      convgViewObjs.value.sort((a, b) => {
        return b['cluster_id'] - a['cluster_id'];
      });
    }
  } else if (_field === 'avg_convg_days') {
    if (sortFieldFlag.value) {
      convgViewObjs.value.sort((a, b) => {
        return a['avg_convg_days'] - b['avg_convg_days'];
      });
    } else {
      convgViewObjs.value.sort((a, b) => {
        return b['avg_convg_days'] - a['avg_convg_days'];
      });
    }
  } else if (_field === 'min_earn') {
    if (sortFieldFlag.value) {
      convgViewObjs.value.sort((a, b) => {
        return a['statistics']['min_sort_tot_earn'] - b['statistics']['min_sort_tot_earn'];
      });
    } else {
      convgViewObjs.value.sort((a, b) => {
        return b['statistics']['min_sort_tot_earn'] - a['statistics']['min_sort_tot_earn'];
      });
    }
  } else if (_field === 'avg_earn') {
    if (sortFieldFlag.value) {
      convgViewObjs.value.sort((a, b) => {
        return a['statistics']['avg_sort_tot_earn'] - b['statistics']['avg_sort_tot_earn'];
      });
    } else {
      convgViewObjs.value.sort((a, b) => {
        return b['statistics']['avg_sort_tot_earn'] - a['statistics']['avg_sort_tot_earn'];
      });
    }
  } else if (_field === 'max_earn') {
    if (sortFieldFlag.value) {
      convgViewObjs.value.sort((a, b) => {
        return a['statistics']['max_sort_tot_earn'] - b['statistics']['max_sort_tot_earn'];
      });
    } else {
      convgViewObjs.value.sort((a, b) => {
        return b['statistics']['max_sort_tot_earn'] - a['statistics']['max_sort_tot_earn'];
      });
    }
  } else if (_field === 'positive') {
    if (sortFieldFlag.value) {
      convgViewObjs.value.sort((a, b) => {
        return a['positive']['positive_reach_len'] - b['positive']['positive_reach_len'];
      });
    } else {
      convgViewObjs.value.sort((a, b) => {
        return b['positive']['positive_reach_len'] - a['positive']['positive_reach_len'];
      });
    }
  } else if (_field === 'negative') {
    if (sortFieldFlag.value) {
      convgViewObjs.value.sort((a, b) => {
        return a['negative']['negative_reach_len'] - b['negative']['negative_reach_len'];
      });
    } else {
      convgViewObjs.value.sort((a, b) => {
        return b['negative']['negative_reach_len'] - a['negative']['negative_reach_len'];
      });
    }
  } else if (_field === 'wav_rate') {
    if (sortFieldFlag.value) {
      convgViewObjs.value.sort((a, b) => {
        return a['wav_obj']['wav_sort_level'] - b['wav_obj']['wav_sort_level'];
      });
    } else {
      convgViewObjs.value.sort((a, b) => {
        return b['wav_obj']['wav_sort_level'] - a['wav_obj']['wav_sort_level'];
      });
    }
  } else if (_field === 'day_xxx_thres') {
    if (sortFieldFlag.value) {
      convgViewObjs.value.sort((a, b) => {
        return a['statistics']['day_sort_tot_thres'] - b['statistics']['day_sort_tot_thres'];
      });
    } else {
      convgViewObjs.value.sort((a, b) => {
        return b['statistics']['day_sort_tot_thres'] - a['statistics']['day_sort_tot_thres'];
      });
    }
  } else if (_field === 'fund_len') {
    if (sortFieldFlag.value) {
      convgViewObjs.value.sort((a, b) => {
        return a['fund_perc_len'] - b['fund_perc_len'];
      });
    } else {
      convgViewObjs.value.sort((a, b) => {
        return b['fund_perc_len'] - a['fund_perc_len'];
      });
    }
  } else if (_field === 'esti_pe_ding') {
    if (sortFieldFlag.value) {
      convgViewObjs.value.sort((a, b) => {
        return a['esti_pe']['ding'] - b['esti_pe']['ding'];
      });
    } else {
      convgViewObjs.value.sort((a, b) => {
        return b['esti_pe']['ding'] - a['esti_pe']['ding'];
      });
    }
  } else if (_field === 'esti_pe_zhi') {
    if (sortFieldFlag.value) {
      convgViewObjs.value.sort((a, b) => {
        return a['esti_pe']['zhi'] - b['esti_pe']['zhi'];
      });
    } else {
      convgViewObjs.value.sort((a, b) => {
        return b['esti_pe']['zhi'] - a['esti_pe']['zhi'];
      });
    }
  } else if (_field === 'hold_money') {
    if (sortFieldFlag.value) {
      convgViewObjs.value.sort((a, b) => {
        let _m_a = 0;
        let _m_b = 0;
        if (a['tot_money']) _m_a = a['tot_money'];
        if (b['tot_money']) _m_b = b['tot_money'];
        return _m_a - _m_b;
      });
    } else {
      convgViewObjs.value.sort((a, b) => {
        let _m_a = 0;
        let _m_b = 0;
        if (a['tot_money']) _m_a = a['tot_money'];
        if (b['tot_money']) _m_b = b['tot_money'];
        return _m_b - _m_a;
      });
    }
  } else if (_field === 'compose_plan') {
    if (sortFieldFlag.value) {
      convgViewObjs.value.sort((a, b) => {
        let _a_compose = a['compose_plan']
        let _a_val = (_a_compose === 'noplan') ? 100 : (_a_compose === 'ovtree') ? 0 : (_a_compose === 'dolphin') ? 1 : (_a_compose === 'trident') ? 2 : (_a_compose === 'gdngoat') ? 3 : 4
        let _b_compose = b['compose_plan']
        let _b_val = (_b_compose === 'noplan') ? 100 : (_b_compose === 'ovtree') ? 0 : (_b_compose === 'dolphin') ? 1 : (_b_compose === 'trident') ? 2 : (_b_compose === 'gdngoat') ? 3 : 4
        return _a_val - _b_val
      });
    } else {
      convgViewObjs.value.sort((a, b) => {
        let _a_compose = a['compose_plan']
        let _a_val = (_a_compose === 'noplan') ? 100 : (_a_compose === 'ovtree') ? 0 : (_a_compose === 'dolphin') ? 1 : (_a_compose === 'trident') ? 2 : (_a_compose === 'gdngoat') ? 3 : 4
        let _b_compose = b['compose_plan']
        let _b_val = (_b_compose === 'noplan') ? 100 : (_b_compose === 'ovtree') ? 0 : (_b_compose === 'dolphin') ? 1 : (_b_compose === 'trident') ? 2 : (_b_compose === 'gdngoat') ? 3 : 4
        return _b_val - _a_val
      });
    }
  } else if (_field === 'selected') {
    convgViewObjs.value.sort((a, b) => {
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
      let _idx = convgViewObjs.value.findIndex(func)
      if (_idx != -1) {
        let _rowObj = convgViewObjs.value[_idx]
        rowElements.value[_rowObj['fund_id']].scrollIntoView({ block: "center", behavior: "smooth" })
      }
    } else {
      let _fund_id = convgViewObjs.value[0]['fund_id']
      rowElements.value[_fund_id].scrollIntoView({ block: "center", behavior: "smooth" })
    }
  })
}

const rowElements = ref({})

const searchCond = ref()

function searchByCond() {
  if (searchCond.value.trim() === '') {
    clearSelected()
    return
  }
  let _foundCnt = 0
  let arr = searchCond.value.trim().split(" ")
  convgViewObjs.value.forEach((elem) => {
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
    searchCond.value = ""
  }
}

const showHides = ref(false)
const currRepoHideNum = ref(0)
function hideSelected() {
  convgViewObjs.value.forEach(elem => {
    if (elem['currSelected']) {
      elem['hide_disp'] = true
    } else {
      elem['hide_disp'] = false
    }
  })
}

function clearAllHides() {
  convgViewObjs.value.forEach(elem => {
    elem['hide_disp'] = false
  })
}

function switchWavDisp(oneRowObj) {
  if (!oneRowObj.hasOwnProperty('show_wav')) {
    oneRowObj['show_wav'] = true;
  } else {
    oneRowObj['show_wav'] = !oneRowObj['show_wav'];
  }
}

function switchDtlPicDisp(oneRowObj) {
  if (!oneRowObj.hasOwnProperty('show_dtl_pic')) {
    oneRowObj['show_dtl_pic'] = true;
  } else {
    oneRowObj['show_dtl_pic'] = !oneRowObj['show_dtl_pic'];
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

.manager_above_year_3_with_change {
  border: dashed 3px black;
  background-color: purple;
  color: white;
}

.manager_above_year_3_without_change {
  border: solid 3px white;
  background-color: purple;
  color: white;
}

.manager_above_year_2_with_change {
  border: dashed 3px black;
  background-color: red;
  color: white;
}

.manager_above_year_2_without_change {
  border: solid 3px white;
  background-color: red;
  color: white;
}

.manager_above_year_1_with_change {
  border: dashed 3px black;
  background-color: orange;
  color: white;
}

.manager_above_year_1_without_change {
  border: solid 3px white;
  background-color: orange;
  color: white;
}

.manager_above_year_half_with_change {
  border: dashed 3px black;
  background-color: pink;
  color: white;
}

.manager_above_year_half_without_change {
  border: solid 3px white;
  background-color: pink;
  color: white;
}

.manager_above_year_0_with_change {
  border: dashed 3px black;
  color: #08c;
}

.manager_above_year_0_without_change {
  border: solid 3px white;
  color: #08c;
}

.emtpy_already_buy {
  cursor: pointer;
  border: solid 2px white;
}

.small_already_buy {
  cursor: pointer;
  border: solid 2px #FFCCCC;
  background-color: #FFCCCC;
  color: white;
}

.middle_already_buy {
  cursor: pointer;
  border: solid 2px #FF9966;
  background-color: #FF9966;
  color: white;
}

.big_already_buy {
  cursor: pointer;
  border: solid 2px #FF6666;
  background-color: #FF6666;
  color: white;
}

.very_big_already_buy {
  cursor: pointer;
  border: solid 2px red;
  background-color: red;
  color: white;
}

.extr_big_already_buy {
  cursor: pointer;
  border: solid 2px purple;
  background-color: purple;
  color: white;
}</style>