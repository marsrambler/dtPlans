<template>
  <div :style="topSecClass">
    <div id="op_pane" :style="{ 'height': opPaneHeight + 'rem' }" class="grid_pane_c12">
      <div style="grid-column: 1 / span 2;">组合名称:&nbsp;
        <select class="form-select" style="width: 6.5rem;"  v-model="compose_name">
          <option v-for="option in buy_in_from_plan" v-bind:value="option.source_val">
            {{ option.source_name }}
          </option>
        </select>
      </div>
      <div class="form-check form_check_cust">
        <input class="form-check-input" type="checkbox" v-model="showLostOnly">
        <label class="form-check-label" for="flexCheckDefault">缺失&nbsp;</label>
        <span class="badge bg-warning">{{totLostNum}}</span>
      </div>
      <div class="form-check form_check_cust">
        <input class="form-check-input" type="checkbox" v-model="showPauseOnly">
        <label class="form-check-label" for="flexCheckDefault">暂停&nbsp;</label>
        <span class="badge bg-warning">{{totPauseNum}}</span>
      </div>
      <div>买入:&nbsp;{{totMoney}}</div>
      <div>盈利:&nbsp;
        <template v-if="totEarnMoney > 0">
          <span class="badge bg-danger">{{totEarnMoney}}</span>
        </template>
        <template v-else>
          <span class="badge bg-success">{{totEarnMoney}}</span>
        </template>
      </div>
      <div>计:&nbsp;
        <template v-if="totEarnMoney > 0">
          <span class="badge bg-danger">{{totEarnRate}}</span>
        </template>
        <template v-else>
          <span class="badge bg-success">{{totEarnRate}}</span>
        </template>
      </div>
      <div>已设:&nbsp;{{totSetBuy}}</div>
      <div>预设:&nbsp;
        <template v-if="diffBuySet >= 0.1">
          <span class="badge bg-warning">{{totPlanBuy}}</span>
        </template>
        <template v-else-if="diffBuySet <= -0.1">
          <span class="badge bg-danger">{{totPlanBuy}}</span>
        </template>
        <template v-else>
          <span>{{totPlanBuy}}</span>
        </template>
      </div>
      <template v-if="totPositiveNum > 0">
        <span class="blink_me badge bg-danger" style="line-height: 1.5rem; font-size: 1rem;">
          有高点:&nbsp;{{ totPositiveNum }}
        </span>
      </template>
      <div style="cursor: pointer;" @click="clearSelected()">
        &nbsp;选择&nbsp;<span class="badge bg-warning text-dark">{{ currSelectedNum }}</span>
      </div>
      <template v-if="currSelectedNum > 0">
        <input class="btn btn-primary btn-sm" type="button" value="前移选择" @click="sortByField('selected')">
      </template>
    </div>
    <table id="table_header" class="table table-bordered" style="margin-bottom: 0;">
      <thead style="">
      <tr :style="{ 'height': tabHeaderHeight + 'rem' }">
        <th :style="{ 'width': colWidMap['col_1'] + 'rem' }">
          <div>
            <div class="w33_w_br">
              <span>名称</span>
            </div>
            <div class="w33_w_br" @click="sortByField('fund_len')">
              <template v-if="sortFieldName === 'fund_len'">
                <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
                <span v-else><i class="bi bi-arrow-down"></i></span>
              </template>
              <span>长度</span>
            </div>
            <div class="w33_w_br" @click="sortByField('update_date')" style="border: none;">
              <template v-if="sortFieldName === 'update_date'">
                <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
                <span v-else><i class="bi bi-arrow-down"></i></span>
              </template>
              <span>更新</span>
            </div>
          </div>
        </th>
        <th :style="{ 'width': colWidMap['col_2'] + 'rem' }" @click="sortByField('min_earn')">
          <template v-if="sortFieldName === 'min_earn'">
            <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
            <span v-else><i class="bi bi-arrow-down"></i></span>
          </template>
          <span>最小</span>
        </th>
        <th :style="{ 'width': colWidMap['col_3'] + 'rem' }" @click="sortByField('avg_earn')">
          <template v-if="sortFieldName === 'avg_earn'">
            <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
            <span v-else><i class="bi bi-arrow-down"></i></span>
          </template>
          <span>平均</span>
        </th>
        <th :style="{ 'width': colWidMap['col_4'] + 'rem' }" @click="sortByField('max_earn')">
          <template v-if="sortFieldName === 'max_earn'">
            <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
            <span v-else><i class="bi bi-arrow-down"></i></span>
          </template>
          <span>最大</span>
        </th>
        <th :style="{ 'width': colWidMap['col_5'] + colWidMap['col_6'] + 'rem' }" colspan="2">
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
        <th :style="{ 'width': colWidMap['col_7'] + 'rem' }">
          <div class="w50_w_br" @click="sortByField('hold_money')">
            <template v-if="sortFieldName === 'hold_money'">
              <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
              <span v-else><i class="bi bi-arrow-down"></i></span>
            </template>
            <span>持有</span>
          </div>
          <div class="w50_w_br" @click="sortByField('hold_rate')" style="border: none;">
            <template v-if="sortFieldName === 'hold_rate'">
              <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
              <span v-else><i class="bi bi-arrow-down"></i></span>
            </template>
            <span>盈利</span>
          </div>
        </th>
        <th :style="{ 'width': colWidMap['col_8'] + 'rem' }">
          <div class="w50_w_br" @click="sortByField('buy_money')">
            <template v-if="sortFieldName === 'buy_money'">
              <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
              <span v-else><i class="bi bi-arrow-down"></i></span>
            </template>
            <span>购入</span>
          </div>
          <div class="w50_w_br" @click="sortByField('set_money')" style="border: none;">
            <template v-if="sortFieldName === 'set_money'">
              <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
              <span v-else><i class="bi bi-arrow-down"></i></span>
            </template>
            <span>设定</span>
          </div>
        </th>
        <th :style="{ 'width': colWidMap['col_9'] + 'rem' }">
        </th>
      </tr>
      </thead>
      <tbody>
      </tbody>
    </table>
  </div>

  <div style="position: relative;">
    <table id="cust_table_content" class="table table-bordered cust_table_cls"
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
      </tr>
      </thead>
      <tbody>
      <template v-for="oneRow in composeViewObjs" :key="oneRow.fund_id">
        <template v-if="oneRow['lost_in_aggressive'] || oneRow['lost_in_dtconvg']">
          <tr v-bind:id="oneRow.fund_id" style="cursor: pointer;" @click="selOrDesRow(oneRow)"
              v-bind:class="{ sel_row: oneRow['currSelected'] }"
              :ref="(el) => { if (el) { rowElements[oneRow.fund_id] = el; } }">
            <td v-bind:class="{ sel_row: oneRow['currSelected'] }">
              <div>
                <template v-if="oneRow['has_bonus']">
                  <span style="color: red; font-weight: bold;">{{ oneRow.fund_id }}&nbsp;</span>
                </template>
                <template v-else>
                  <span style="">{{ oneRow.fund_id }}&nbsp;</span>
                </template>
              </div>
              <div>{{ oneRow.fund_name }}&nbsp;
                <template v-if="oneRow['last_sold_date']">
                  <span>售:&nbsp;{{oneRow['last_sold_date']}}&nbsp;|&nbsp;{{oneRow['last_sold_days']}}</span>
                </template>
              </div>
            </td>
            <td colspan="5" v-bind:class="{ sel_row: oneRow['currSelected'] }">
              <span style="color: red; font-weight: 900;">已缺失，可能是经理更换或业绩不再收敛。</span>
            </td>
            <td style="line-height: 2rem;" v-bind:class="{ sel_row: oneRow['currSelected'] }">
              <template v-if="oneRow['kbObj']">
                <div>
                  持有:&nbsp;
                  <template v-if="oneRow['hold_accu_money']">
                      <span>
                        {{ oneRow['hold_accu_money'] }}
                      </span>
                  </template>
                </div>
                <div>
                  盈利:&nbsp;
                  <template
                      v-if="oneRow['hold_accu_pure_profit']">
                      <span :style="{color: (oneRow['hold_accu_pure_profit'] >= 0? 'red' : 'darkgreen'), 'font-weight': 'bold'}">
                        {{ oneRow['hold_accu_pure_profit'] }}
                      </span>
                  </template>
                </div>
                <div>
                  计:&nbsp;
                  <template v-if="oneRow['hold_accu_pure_percent_str']">
                      <span :style="{color: (oneRow['hold_accu_pure_profit'] >= 0? 'red' : 'darkgreen'), 'font-weight': 'bold'}">
                        {{ oneRow['hold_accu_pure_percent_str'] }}
                      </span>
                  </template>
                </div>
              </template>
            </td>
            <td style="line-height: 2rem;" v-bind:class="{ sel_row: oneRow['currSelected'] }">
              <div>
                当前:&nbsp;
                <input type="number" style="width: 4rem; border-radius: 5px;" v-model="oneRow['money']" @click.stop>
              </div>
              <div>
                决策:&nbsp;&nbsp;{{ oneRow['adjust_money'] }}
                <template v-if="oneRow['adjust_money']">
                  <span class="red_card less_height" v-if="oneRow['money'] - oneRow['adjust_money'] >= 5">&nbsp;</span><!--
                    --><span class="darkgolden_card less_height" v-if="oneRow['adjust_money'] - oneRow['money'] >= 5">&nbsp;</span><!--
                    --><span class="red_card less_height" v-if="oneRow['money'] - oneRow['adjust_money'] >= 10">&nbsp;</span><!--
                    --><span class="darkgolden_card less_height" v-if="oneRow['adjust_money'] - oneRow['money'] >= 10">&nbsp;</span><!--
                    --><span class="red_card less_height" v-if="oneRow['money'] - oneRow['adjust_money'] >= 15">&nbsp;</span><!--
                    --><span class="darkgolden_card less_height" v-if="oneRow['adjust_money'] - oneRow['money'] >= 15">&nbsp;</span><!--
                    --><span class="red_card less_height" v-if="oneRow['money'] - oneRow['adjust_money'] >= 20">&nbsp;</span><!--
                    --><span class="darkgolden_card less_height" v-if="oneRow['adjust_money'] - oneRow['money'] >= 20">&nbsp;</span><!--
                    --><span class="red_card less_height" v-if="oneRow['money'] - oneRow['adjust_money'] >= 25">&nbsp;</span><!--
                    --><span class="darkgolden_card less_height" v-if="oneRow['adjust_money'] - oneRow['money'] >= 25">&nbsp;</span><!--
                    --><span class="red_card less_height" v-if="oneRow['money'] - oneRow['adjust_money'] >= 30">&nbsp;</span><!--
                    --><span class="darkgolden_card less_height" v-if="oneRow['adjust_money'] - oneRow['money'] >= 30">&nbsp;</span><!--
                    --><span class="red_card less_height" v-if="oneRow['money'] - oneRow['adjust_money'] >= 35">&nbsp;</span><!--
                    --><span class="darkgolden_card less_height" v-if="oneRow['adjust_money'] - oneRow['money'] >= 35">&nbsp;</span><!--
                    --><span class="red_card less_height" v-if="oneRow['money'] - oneRow['adjust_money'] >= 40">&nbsp;</span><!--
                    --><span class="darkgolden_card less_height" v-if="oneRow['adjust_money'] - oneRow['money'] >= 40">&nbsp;</span>
                </template>
              </div>
              <div>
                <span style="font-size: 1rem; font-style: italic;text-decoration: underline;">{{ oneRow['last_adjust_money_date'] }}</span>&nbsp;
                <input class="btn btn-outline-danger btn-sm" type="button" value="保存"
                       @click.stop="setComposeProperty(oneRow['fund_id'], oneRow['fund_name'], oneRow['compose_name'], parseInt(oneRow['money']), oneRow['buyin_source'])">
              </div>
            </td>
            <td style="text-align: center;" v-bind:class="{ sel_row: oneRow['currSelected'] }">
              <template v-if="oneRow['fixedHoldObj']">
                <button type="button" class="btn"
                        :class="{'btn-primary': !oneRow['fixedHoldObj']['disp_flag'], 'btn-secondary': oneRow['fixedHoldObj']['disp_flag']}"
                        @click.stop="oneRow['fixedHoldObj']['disp_flag'] = !oneRow['fixedHoldObj']['disp_flag'];">
                  <template v-if="!oneRow['fixedHoldObj']['disp_flag']">展开</template>
                  <template v-else>折叠</template>
                </button>
              </template>
            </td>
          </tr>
        </template>
        <template v-else>
          <tr v-bind:id="oneRow.fund_id" style="cursor: pointer;" @click="selOrDesRow(oneRow)"
              v-bind:class="{ sel_row: oneRow['currSelected'] }"
              :ref="(el) => { if (el) { rowElements[oneRow.fund_id] = el; } }">
            <td v-bind:class="{ sel_row: oneRow['currSelected'] }">
              <div>
                <template v-if="oneRow['fixedHoldObj'] && oneRow['fixedHoldObj']['has_bonus']">
                  <span style="color: red; font-weight: bold;">{{ oneRow.fund_id }}&nbsp;</span>
                </template>
                <template v-else>
                  <span style="">{{ oneRow.fund_id }}&nbsp;</span>
                </template>                
                <template v-if="oneRow['kbObj']">
                    <span style="font-size: 1rem; font-style: italic;text-decoration: underline;">
                      {{ oneRow.kbObj.statistics.last_perc_date_str }}
                    </span>
                </template>
              </div>
              <div>{{ oneRow.fund_name }}&nbsp;
                <template v-if="oneRow['kbObj']">
                    <span style="font-size: 1rem; font-style: italic;text-decoration: underline;">
                      {{ oneRow.kbObj.statistics.fund_perc_len }}
                    </span>
                </template>
                <template v-if="oneRow['last_sold_date']">
                  <span>售:&nbsp;{{oneRow['last_sold_date']}}&nbsp;|&nbsp;{{oneRow['last_sold_days']}}</span>
                </template>
              </div>
              <div>
                <template v-if="oneRow['kbObj']">
                  <span v-bind:class="getCardStyle(oneRow.kbObj.statistics.day_200_thres)">&nbsp;</span>
                  <span v-bind:class="getCardStyle(oneRow.kbObj.statistics.day_300_thres)">&nbsp;</span>
                  <span v-bind:class="getCardStyle(oneRow.kbObj.statistics.day_400_thres)">&nbsp;</span>
                  <span v-bind:class="getCardStyle(oneRow.kbObj.statistics.day_500_thres)">&nbsp;</span>
                  <span v-bind:class="getCardStyle(oneRow.kbObj.statistics.day_600_thres)">&nbsp;</span>
                </template>
              </div>
            </td>
            <td v-bind:class="{ sel_row: oneRow['currSelected'] }">
              <div>
                {{ oneRow?.kbObj?.statistics?.min_earn_str }}
              </div>
              <div>
                {{ oneRow?.kbObj?.statistics?.min_earn_aux_str }}
              </div>
              <div>
                {{ oneRow?.kbObj?.statistics?.min_earn_tri_str }}
              </div>
            </td>
            <td v-bind:class="{ sel_row: oneRow['currSelected'] }">
              <div>
                {{ oneRow?.kbObj?.statistics?.avg_earn_str }}
              </div>
              <div>
                {{ oneRow?.kbObj?.statistics?.avg_earn_aux_str }}
              </div>
              <div>
                {{ oneRow?.kbObj?.statistics?.avg_earn_tri_str }}
              </div>
            </td>
            <td v-bind:class="{ sel_row: oneRow['currSelected'] }">
              <div>
                {{ oneRow?.kbObj?.statistics?.max_earn_str }}
              </div>
              <div>
                {{ oneRow?.kbObj?.statistics?.max_earn_aux_str }}
              </div>
              <div>
                {{ oneRow?.kbObj?.statistics?.max_earn_tri_str }}
              </div>
            </td>
            <td v-bind:class="{ sel_row: oneRow['currSelected'] }">
              <template v-if="oneRow['kbObj']">
                <div style="height: 1.8em; position: relative;"
                     v-bind:class="getPosColor(oneRow.kbObj.positive.positive_reach_len)">
                    <span v-if="oneRow.kbObj.positive.positive_reach_len >= 4" class="icon_pos">
                      <i class="bi bi-arrow-up-circle-fill"></i>
                      <span class="lv_font">{{ oneRow.kbObj.positive.positive_reach_len }}</span>
                    </span>
                </div>
                <div style="height: 1.8em; position: relative;"
                     v-bind:class="getNegColor(oneRow.kbObj.negative.negative_reach_len)">
                    <span v-if="oneRow.kbObj.negative.negative_reach_len >= 3" class="icon_pos">
                      <i class="bi bi-arrow-down-circle-fill"></i>
                      <span class="lv_font">{{ oneRow.kbObj.negative.negative_reach_len }}</span>
                    </span>
                </div>
                <div style="height: 3em; position: relative;">
                </div>
              </template>
            </td>
            <td style="text-align: center;" v-bind:class="{ sel_row: oneRow['currSelected'] }">
              <template v-if="oneRow['kbObj']">
                <div style="height: 1.8em;">
                  <span v-bind:class="getHitStyle(oneRow.kbObj.positive.day_5_positive_reach)">&nbsp;</span>
                  <span v-bind:class="getHitStyle(oneRow.kbObj.positive.day_10_positive_reach)">&nbsp;</span>
                  <span v-bind:class="getHitStyle(oneRow.kbObj.positive.day_20_positive_reach)">&nbsp;</span>
                  <span v-bind:class="getHitStyle(oneRow.kbObj.positive.day_60_positive_reach)">&nbsp;</span>
                  <span v-bind:class="getHitStyle(oneRow.kbObj.positive.day_90_positive_reach)">&nbsp;</span>
                  <span v-bind:class="getHitStyle(oneRow.kbObj.positive.day_120_positive_reach)">&nbsp;</span>
                  <span v-bind:class="getHitStyle(oneRow.kbObj.positive.day_160_positive_reach)">&nbsp;</span>
                  <template v-if="oneRow.kbObj.positive.hasOwnProperty('day_200_positive_reach')">
                    <span v-bind:class="getHitStyle(oneRow.kbObj.positive.day_200_positive_reach)">&nbsp;</span>
                  </template>
                  <template v-else>
                    <span v-bind:class="getHitStyle(oneRow.kbObj.positive.day_220_positive_reach)">&nbsp;</span>
                  </template>
                </div>
                <div style="height: 1.8em;">
                  <span v-bind:class="getHitStyle(oneRow.kbObj.negative.day_5_negative_reach)">&nbsp;</span>
                  <span v-bind:class="getHitStyle(oneRow.kbObj.negative.day_10_negative_reach)">&nbsp;</span>
                  <span v-bind:class="getHitStyle(oneRow.kbObj.negative.day_20_negative_reach)">&nbsp;</span>
                  <span v-bind:class="getHitStyle(oneRow.kbObj.negative.day_60_negative_reach)">&nbsp;</span>
                  <span v-bind:class="getHitStyle(oneRow.kbObj.negative.day_90_negative_reach)">&nbsp;</span>
                  <span v-bind:class="getHitStyle(oneRow.kbObj.negative.day_120_negative_reach)">&nbsp;</span>
                  <span v-bind:class="getHitStyle(oneRow.kbObj.negative.day_160_negative_reach)">&nbsp;</span>
                  <template v-if="oneRow.kbObj.negative.hasOwnProperty('day_200_negative_reach')">
                    <span v-bind:class="getHitStyle(oneRow.kbObj.negative.day_200_negative_reach)">&nbsp;</span>
                  </template>
                  <template v-else>
                    <span v-bind:class="getHitStyle(oneRow.kbObj.negative.day_220_negative_reach)">&nbsp;</span>
                  </template>
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
              </template>
            </td>
            <td style="line-height: 2rem;" v-bind:class="{ sel_row: oneRow['currSelected'] }">
              <template v-if="oneRow['kbObj']">
                <div>
                  持有:&nbsp;
                  <template
                      v-if="oneRow['fixedHoldObj'] && oneRow['fixedHoldObj']['hold_objs'] && oneRow['fixedHoldObj']['hold_objs'].length > 0">
                      <span
                          :set="accu_money = oneRow['fixedHoldObj']['hold_objs'][oneRow['fixedHoldObj']['hold_objs'].length - 1]['accu_money']">
                        {{ accu_money }}
                      </span>
                  </template>
                </div>
                <div>
                  盈利:
                  <template
                      v-if="oneRow['fixedHoldObj'] && oneRow['fixedHoldObj']['hold_objs'] && oneRow['fixedHoldObj']['hold_objs'].length > 0">
                      <span
                          :set="accu_pure_profit = oneRow['fixedHoldObj']['hold_objs'][oneRow['fixedHoldObj']['hold_objs'].length - 1]['accu_pure_profit']"
                          :style="{color: (accu_pure_profit >= 0? 'red' : 'darkgreen'), 'font-weight': 'bold'}">
                        {{ accu_pure_profit }}
                      </span>
                  </template>
                </div>
                <div>
                  计:
                  <template
                      v-if="oneRow['fixedHoldObj'] && oneRow['fixedHoldObj']['hold_objs'] && oneRow['fixedHoldObj']['hold_objs'].length > 0">
                      <span
                          :set="accu_pure_percent_str = oneRow['fixedHoldObj']['hold_objs'][oneRow['fixedHoldObj']['hold_objs'].length - 1]['accu_pure_percent_str']"
                          :style="{color: (accu_pure_profit >= 0? 'red' : 'darkgreen'), 'font-weight': 'bold'}">
                        {{ accu_pure_percent_str }}
                      </span>
                  </template>
                </div>
              </template>
            </td>
            <td style="line-height: 2rem;" v-bind:class="{ sel_row: oneRow['currSelected'] }">
              <div>
                当前:&nbsp;
                <input type="number" style="width: 4rem; border-radius: 5px;" v-model="oneRow['money']" @click.stop>
              </div>
              <div>
                决策:&nbsp;&nbsp;{{ oneRow['adjust_money'] }}
                <template v-if="oneRow['adjust_money']">
                  <span class="red_card less_height" v-if="oneRow['money'] - oneRow['adjust_money'] >= 5">&nbsp;</span><!--
                    --><span class="darkgolden_card less_height" v-if="oneRow['adjust_money'] - oneRow['money'] >= 5">&nbsp;</span><!--
                    --><span class="red_card less_height" v-if="oneRow['money'] - oneRow['adjust_money'] >= 10">&nbsp;</span><!--
                    --><span class="darkgolden_card less_height" v-if="oneRow['adjust_money'] - oneRow['money'] >= 10">&nbsp;</span><!--
                    --><span class="red_card less_height" v-if="oneRow['money'] - oneRow['adjust_money'] >= 15">&nbsp;</span><!--
                    --><span class="darkgolden_card less_height" v-if="oneRow['adjust_money'] - oneRow['money'] >= 15">&nbsp;</span><!--
                    --><span class="red_card less_height" v-if="oneRow['money'] - oneRow['adjust_money'] >= 20">&nbsp;</span><!--
                    --><span class="darkgolden_card less_height" v-if="oneRow['adjust_money'] - oneRow['money'] >= 20">&nbsp;</span><!--
                    --><span class="red_card less_height" v-if="oneRow['money'] - oneRow['adjust_money'] >= 25">&nbsp;</span><!--
                    --><span class="darkgolden_card less_height" v-if="oneRow['adjust_money'] - oneRow['money'] >= 25">&nbsp;</span><!--
                    --><span class="red_card less_height" v-if="oneRow['money'] - oneRow['adjust_money'] >= 30">&nbsp;</span><!--
                    --><span class="darkgolden_card less_height" v-if="oneRow['adjust_money'] - oneRow['money'] >= 30">&nbsp;</span><!--
                    --><span class="red_card less_height" v-if="oneRow['money'] - oneRow['adjust_money'] >= 35">&nbsp;</span><!--
                    --><span class="darkgolden_card less_height" v-if="oneRow['adjust_money'] - oneRow['money'] >= 35">&nbsp;</span><!--
                    --><span class="red_card less_height" v-if="oneRow['money'] - oneRow['adjust_money'] >= 40">&nbsp;</span><!--
                    --><span class="darkgolden_card less_height" v-if="oneRow['adjust_money'] - oneRow['money'] >= 40">&nbsp;</span>
                </template>
              </div>
              <div>
                <span style="font-size: 1rem; font-style: italic;text-decoration: underline;">{{ oneRow['last_adjust_money_date'] }}</span>&nbsp;
                <input class="btn btn-outline-danger btn-sm" type="button" value="保存"
                       @click.stop="setComposeProperty(oneRow['fund_id'], oneRow['fund_name'], oneRow['compose_name'], parseInt(oneRow['money']), oneRow['buyin_source'])">
              </div>
            </td>
            <td style="text-align: center;" v-bind:class="{ sel_row: oneRow['currSelected'] }">
              <template v-if="oneRow['fixedHoldObj']">
                <button type="button" class="btn"
                        :class="{'btn-primary': !oneRow['fixedHoldObj']['disp_flag'], 'btn-secondary': oneRow['fixedHoldObj']['disp_flag']}"
                        @click.stop="oneRow['fixedHoldObj']['disp_flag'] = !oneRow['fixedHoldObj']['disp_flag'];">
                  <template v-if="!oneRow['fixedHoldObj']['disp_flag']">展开</template>
                  <template v-else>折叠</template>
                </button>
              </template>
            </td>
          </tr>
          <tr v-if="oneRow['show_wav']">
            <td colspan="9" style="background-color: lightblue;">
              <img v-bind:src="'../wav-report/'+oneRow['fund_id']+'.png'"
                   style="width: 100%; height: 100%; max-width: 100%;" class="img-fluid" alt="Responsive image">
            </td>
          </tr>
        </template>
        <template
            v-if="oneRow['fixedHoldObj'] && oneRow['fixedHoldObj']['disp_flag'] && oneRow['fixedHoldObj']['hold_objs'] && oneRow['fixedHoldObj']['hold_objs'].length > 0">
          <tr>
            <td colspan="9" id="table_container">
              <div style="border: solid 2px black;">
                <table id="detail_container" class="table" style="margin-bottom: 0;">
                  <thead>
                  <tr>
                    <th :style="{ 'width': colWidMapSub['col_1'] + 'rem' }"></th>
                    <th :style="{ 'width': colWidMapSub['col_2'] + 'rem' }"></th>
                    <th :style="{ 'width': colWidMapSub['col_3'] + 'rem' }"></th>
                    <th :style="{ 'width': colWidMapSub['col_4'] + 'rem' }"></th>
                    <th :style="{ 'width': colWidMapSub['col_5'] + 'rem' }"></th>
                    <th :style="{ 'width': colWidMapSub['col_6'] + 'rem' }"></th>
                    <th :style="{ 'width': colWidMapSub['col_7'] + 'rem' }"></th>
                    <th :style="{ 'width': colWidMapSub['col_8'] + 'rem' }"></th>
                    <th :style="{ 'width': colWidMapSub['col_9'] + 'rem' }"></th>
                    <th :style="{ 'width': colWidMapSub['col_10'] + 'rem' }"></th>
                    <th :style="{ 'width': colWidMapSub['col_11'] + 'rem' }"></th>
                    <th :style="{ 'width': colWidMapSub['col_12'] + 'rem' }"></th>
                  </tr>
                  </thead>
                  <tbody>
                  <template v-for="one_hold_obj in oneRow['fixedHoldObj']['hold_objs']">
                    <tr :set="cust_color = (one_hold_obj['accu_pure_percent'] < 0? 'darkgreen' : (one_hold_obj['accu_pure_percent'] < 1? 'darkgrey' : 'red'))">
                      <td :style="{color: cust_color, 'text-align': 'center'}">
                        <template v-if="one_hold_obj['bonus_day']">
                          <span style="border: solid 1px red; border-radius: 5px;">
                          {{ one_hold_obj['fund_order'] }}
                          </span>
                        </template>
                        <template v-else>
                          <span>
                          {{ one_hold_obj['fund_order'] }}
                          </span>
                        </template>
                      </td>
                      <td :style="{color: cust_color}">
                        {{ one_hold_obj['dateStr'] }}
                      </td>
                      <td :style="{color: cust_color}">
                        至:&nbsp;{{ one_hold_obj['lastPriceDateStr'] }}
                      </td>
                      <td :style="{color: cust_color}">
                        {{ one_hold_obj['distance'] }}日
                      </td>
                      <td :style="{color: cust_color}">
                        金额:&nbsp;{{ one_hold_obj['accu_money'] }}
                      </td>
                      <td :style="{color: cust_color}">
                        份额:&nbsp;{{ one_hold_obj['accu_pure_amount'] }}
                      </td>
                      <td :style="{color: cust_color}">
                        盈:&nbsp;{{ one_hold_obj['accu_pure_profit'] }}
                      </td>
                      <td :style="{color: cust_color}">
                        合:&nbsp;
                        <span :class="{'circle_border': one_hold_obj['max_pole']}">
                          {{ one_hold_obj['accu_pure_percent_str'] }}
                        </span>
                      </td>
                      <td :style="{color: cust_color}">
                        <div>
                          <span style="">单:&nbsp;</span><!--
                              --><span style="">{{ one_hold_obj['pure_percent_str'] }}</span>
                        </div>
                        <div v-if="one_hold_obj['has_thresh_flag']">
                          <span v-if="one_hold_obj['max_earn_yr1_flag']" class="purple_card">&nbsp;</span><!--
                          --><span v-if="one_hold_obj['avg_earn_yr1_flag']" class="red_card">&nbsp;</span><!--
                          --><span v-if="!one_hold_obj['max_earn_yr1_flag'] && !one_hold_obj['avg_earn_yr1_flag']" class="white_card">&nbsp;</span><!--
                          --><span v-if="one_hold_obj['max_earn_yr2_flag']" class="purple_card">&nbsp;</span><!--
                          --><span v-if="one_hold_obj['avg_earn_yr2_flag']" class="red_card">&nbsp;</span><!--
                          --><span v-if="!one_hold_obj['max_earn_yr2_flag'] && !one_hold_obj['avg_earn_yr2_flag']" class="white_card">&nbsp;</span><!--
                          --><span v-if="one_hold_obj['max_earn_yr3_flag']" class="purple_card">&nbsp;</span><!--
                          --><span v-if="one_hold_obj['avg_earn_yr3_flag']" class="red_card">&nbsp;</span><!--
                          --><span v-if="!one_hold_obj['max_earn_yr3_flag'] && !one_hold_obj['avg_earn_yr3_flag']" class="white_card">&nbsp;</span>
                        </div>
                      </td>
                      <td :style="{color: cust_color}">
                        账户:&nbsp;{{ one_hold_obj['buyin_source'] }}
                      </td>
                      <td style="text-align: center;">
                        <template v-if="one_hold_obj['already_buyout']">
                          <span class="badge bg-secondary">已卖出</span>
                        </template>
                        <template v-else>
                          <input class="btn btn-warning btn-sm" type="button" value="卖出"
                                 @click="soldFixedFundByBulkUi(oneRow['fund_id'], oneRow['fund_name'], one_hold_obj, oneRow['fixedHoldObj']['hold_objs'], oneRow)">
                        </template>
                      </td>
                      <td style="text-align: center;">
                        <template v-if="one_hold_obj['already_buyout']">
                          <span>&nbsp;</span>
                        </template>
                        <template v-else>
                          <input class="btn btn-danger btn-sm" type="button" value="删除"
                                 @click="removeFixedFundUi(oneRow['fund_id'], oneRow['fund_name'], one_hold_obj)">
                        </template>
                      </td>
                    </tr>
                  </template>
                  </tbody>
                </table>
              </div>
            </td>
          </tr>
        </template>
      </template>
      </tbody>
      <tfoot>
      <tr style="line-height: 5rem; border-color: white;">
        <td colspan="9">
          &nbsp;
        </td>
      </tr>
      </tfoot>
    </table>
  </div>
  <div class="modal fade" id="soldDialog" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">卖出确认</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <h6>以下将被批量卖出: </h6>
          <h6>{{ fund_id_sold }}&nbsp;{{ fund_name_sold }}</h6>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
          <button type="button" class="btn btn-primary" @click.prevent="soldFixedFundByBulk()">卖出
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal fade" id="removeDialog" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">删除确认</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <h6>以下将被删除: </h6>
          <h6>{{ fund_id_remove }}&nbsp;{{ fund_name_remove }}&nbsp; {{ one_hold_obj_remove?.dateStr }}</h6>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
          <button type="button" class="btn btn-primary" @click.prevent="removeFixedFund()">卖出
          </button>
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
  topSecClass,
  getCardStyle,
  getPosColor,
  getNegColor,
  getHitStyle,
  get_suggestion_by_wav
} from "../lib/commonUtils.js"
import {onMounted, computed, ref, watch, nextTick} from "vue";
import {storeToRefs} from 'pinia'
import {useComposeStore} from "../store/composeStore.js";
import {useZskbStore} from "../store/zskbStore.js"
import {Modal} from "bootstrap";
import {useBuyInOutStore} from "../store/buyInOutStore.js";
import { useRoute } from 'vue-router'

const route = useRoute()
const composeStore = useComposeStore()
const {composeObjs, fixedHoldObjs} = storeToRefs(composeStore)
const {getAllCompose, setComposeProperty, setComposeSoldDate, getComposeFixedHold} = composeStore
const buyInOutStore = useBuyInOutStore()
const {buyoutRecords, wav_reports} = storeToRefs(buyInOutStore)
const {getAllBuyoutRecords, soldComposeFixedHold, buyOutFixedFund} = buyInOutStore
const zskbStore = useZskbStore()
const {zskbObjs} = storeToRefs(zskbStore)

const buy_in_from_plan = [
  {'source_name': '全部', 'source_val': 'all'},
  {'source_name': '橄榄树', 'source_val': 'ovtree'},
  {'source_name': '海豚', 'source_val': 'dolphin'},
  {'source_name': '三叉戟', 'source_val': 'trident'},
  {'source_name': '金毛羊', 'source_val': 'gdngoat'}
]

const colWidMap = {
  'col_1': 12,
  'col_2': 3,
  'col_3': 3,
  'col_4': 3,
  'col_5': 3,
  'col_6': 10,
  'col_7': 7,
  'col_8': 8,
  'col_9': 4
}

const colWidMapSub = {
  'col_1': 4,
  'col_2': 6,
  'col_3': 8,
  'col_4': 5,
  'col_5': 6,
  'col_6': 6,
  'col_7': 6,
  'col_8': 6,
  'col_9': 6,
  'col_10': 6,
  'col_11': 4,
  'col_12': 4
}

const compose_name = ref('all')
watch(compose_name, () => {
  getComposeFixedHold(compose_name.value)
}, {immediate: true})

const composeViewObjs = ref([])
const totMoney = ref(0)
const totEarnMoney = ref(0)
const totEarnRate = ref(null)
const totSetBuy = ref(0)
const totPlanBuy = ref(0)
const diffBuySet = ref(0)
const showLostOnly = ref(false)
const showPauseOnly = ref(false)
const totPositiveNum = ref(0)
const dtFundId = ref(null)
const totLostNum = ref(0)
const totPauseNum = ref(0)
watch([composeObjs, compose_name, fixedHoldObjs, buyoutRecords, showLostOnly, showPauseOnly], () => {
  composeViewObjs.value = []
  if (composeObjs && composeObjs.value && composeObjs.value.length > 0) {
    if (compose_name.value === 'all') {
      composeObjs.value.forEach(item => {
        if (!showLostOnly.value && !showPauseOnly.value) {
          composeViewObjs.value.push(...item['compose_objs'])
        } else {
          item['compose_objs'].forEach(_obj => {
            let _added_in = false
            if (showLostOnly.value) {
              if (_obj['lost_in_aggressive'] || _obj['lost_in_dtconvg']) {
                composeViewObjs.value.push(_obj)
                _added_in = true
              }
            }
            if (showPauseOnly.value && !_added_in) {
              if ((!_obj.hasOwnProperty('money') || _obj['money'] <= 0) &&
                  (!_obj['lost_in_aggressive'] && !_obj['lost_in_dtconvg'])) {
                composeViewObjs.value.push(_obj)
              }
            }
          })
        }
      })
    } else {
      if (!showLostOnly.value && !showPauseOnly.value) {
        composeViewObjs.value = composeObjs.value.find(item => item['compose_name'] === compose_name.value)['compose_objs']
      } else {
        let _match_composes = composeObjs.value.find(item => item['compose_name'] === compose_name.value)
        _match_composes['compose_objs'].forEach(_obj => {
          let _added_in = false
          if (showLostOnly.value) {
            if (_obj['lost_in_aggressive'] || _obj['lost_in_dtconvg']) {
              composeViewObjs.value.push(_obj)
              _added_in = true
            }
          }
          if (showPauseOnly.value && !_added_in) {
            if ((!_obj.hasOwnProperty('money') || _obj['money'] <= 0) &&
                (!_obj['lost_in_aggressive'] && !_obj['lost_in_dtconvg'])) {
              composeViewObjs.value.push(_obj)
            }
          }
        })
      }
    }
  }

  if (fixedHoldObjs.value.length > 0 && buyoutRecords.value.length > 0) {
    fixedHoldObjs.value.forEach(item => {
      if (item['hold_objs'] && item['hold_objs'].length > 0) {
        item['hold_objs'].forEach(oneHold => {
          let _searches = buyoutRecords.value.find(oneBuyout => oneBuyout['fund_id'] === item['fund_id'] && oneBuyout['fund_order'] === oneHold['fund_order'])
          if (_searches) {
            oneHold['already_buyout'] = true
          } else {
            oneHold['already_buyout'] = false
          }
        })
      }
    })
  }

  if (fixedHoldObjs.value.length > 0 && composeViewObjs.value.length > 0) {
    composeViewObjs.value.forEach(item => {
      item['fixedHoldObj'] = fixedHoldObjs.value.find(elem => elem['fund_id'] === item['fund_id'])
    })
  }

  totMoney.value = 0
  totEarnMoney.value = 0
  totEarnRate.value = ''
  totSetBuy.value = 0
  totPlanBuy.value = 0
  totPositiveNum.value = 0
  totLostNum.value = 0
  totPauseNum.value = 0

  if (composeViewObjs.value.length > 0) {
    composeViewObjs.value.forEach(elem => {
      let fixedHoldObj = elem['fixedHoldObj']
      if (fixedHoldObj && fixedHoldObj['hold_objs'] && fixedHoldObj['hold_objs'].length > 0) {
        let lastHoldObj = fixedHoldObj['hold_objs'][fixedHoldObj['hold_objs'].length - 1]
        totMoney.value += lastHoldObj['accu_money']
        totEarnMoney.value += lastHoldObj['accu_pure_profit']
        totSetBuy.value += elem['money']
        totPlanBuy.value += elem['adjust_money']
      }

      if (elem.hasOwnProperty('kbObj') && elem['kbObj'] != null) {
        let _kbOjb = elem['kbObj']
        if (_kbOjb.hasOwnProperty('positive') && _kbOjb['positive'] != null) {
          let _positive = _kbOjb['positive']
          if (_positive['positive_reach_len'] >= 5) {
            totPositiveNum.value += 1
          }
        }
      }

      if ((elem.hasOwnProperty('lost_in_aggressive') && elem['lost_in_aggressive'])
          || (elem.hasOwnProperty('lost_in_dtconvg') && elem['lost_in_dtconvg'])) {
        totLostNum.value = totLostNum.value + 1
      } else if (!elem.hasOwnProperty('money') || elem['money'] <= 0) {
        totPauseNum.value = totPauseNum.value + 1
      }


      if (dtFundId.value && dtFundId.value === elem['fund_id']) {
        elem['currSelected'] = true
        dtFundId.value = null
      }
    })

    if (totMoney.value > 0) {
      let _earn_rate = totEarnMoney.value / totMoney.value * 100
      totEarnRate.value = _earn_rate.toFixed(0) + '%'
    }
    if (totSetBuy.value != 0) {
      diffBuySet.value = (totPlanBuy.value - totSetBuy.value) / totSetBuy.value
    }
  }

  scrollViewBySelection()

}, {immediate: true})

getAllBuyoutRecords()

/*
* sold by bulk
* */
const dlgController = ref({soldDlg: null, removeDlg: null})
onMounted(() => {
  dlgController.value.soldDlg = new Modal('#soldDialog', {})
  dlgController.value.removeDlg = new Modal('#removeDialog', {})

  if (route.query.hasOwnProperty('dt_compose') && route.query['dt_compose']) {
    if (['ovtree', 'dolphin', 'trident', 'gdngoat'].indexOf(route.query['dt_compose'].trim()) !== -1) {
      compose_name.value = route.query['dt_compose'].trim();
    } else {
      console.error("Internal error as query string can not find: ", route.query['dt_compose'])
    }
  }
  if (route.query.hasOwnProperty('dt_fund_id') && route.query['dt_fund_id']) {
    dtFundId.value = route.query['dt_fund_id'].trim();
  }
})
const fund_id_sold = ref('')
const fund_name_sold = ref('')
const one_hold_obj_end = ref(null)
const hold_objs = ref([])
const fund_one_row_obj = ref(null)

async function soldFixedFundByBulkUi(_fund_id, _fund_name, _one_hold_obj_end, _hold_obj, _one_row) {
  fund_id_sold.value = _fund_id
  fund_name_sold.value = _fund_name
  one_hold_obj_end.value = _one_hold_obj_end
  hold_objs.value = _hold_obj;
  fund_one_row_obj.value = _one_row
  dlgController.value.soldDlg.show();
}

async function soldFixedFundByBulk() {
  await soldComposeFixedHold(fund_id_sold.value, fund_name_sold.value, one_hold_obj_end.value, hold_objs.value)
  await setComposeSoldDate(fund_one_row_obj.value['fund_id'], fund_one_row_obj.value['fund_name'], fund_one_row_obj.value['compose_name'], 0, fund_one_row_obj.value['buyin_source'])
  dlgController.value.soldDlg.hide()
}

const fund_id_remove = ref('')
const fund_name_remove = ref('')
const one_hold_obj_remove = ref(null)

async function removeFixedFundUi(_fund_id, _fund_name, _one_hold_obj) {
  fund_id_remove.value = _fund_id
  fund_name_remove.value = _fund_name
  one_hold_obj_remove.value = _one_hold_obj
  dlgController.value.removeDlg.show();
}

async function removeFixedFund() {
  buyOutFixedFund(fund_id_remove.value, fund_name_remove.value, one_hold_obj_remove.value)
  dlgController.value.removeDlg.hide()
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

  if (_field === 'min_earn') {
    if (sortFieldFlag.value) {
      composeViewObjs.value.sort((a, b) => {
        if (a['kbObj'] && a['kbObj']['statistics'] && a['kbObj']['statistics']['min_sort_tot_earn'] &&
            b['kbObj'] && b['kbObj']['statistics'] && b['kbObj']['statistics']['min_sort_tot_earn']) {
          return a['kbObj']['statistics']['min_sort_tot_earn'] - b['kbObj']['statistics']['min_sort_tot_earn'];
        } else {
          return 0;
        }
      });
    } else {
      composeViewObjs.value.sort((a, b) => {
        if (a['kbObj'] && a['kbObj']['statistics'] && a['kbObj']['statistics']['min_sort_tot_earn'] &&
            b['kbObj'] && b['kbObj']['statistics'] && b['kbObj']['statistics']['min_sort_tot_earn']) {
          return b['kbObj']['statistics']['min_sort_tot_earn'] - a['kbObj']['statistics']['min_sort_tot_earn'];
        } else {
          return 0;
        }
      });
    }
  } else if (_field === 'avg_earn') {
    if (sortFieldFlag.value) {
      composeViewObjs.value.sort((a, b) => {
        if (a['kbObj'] && a['kbObj']['statistics'] && a['kbObj']['statistics']['avg_sort_tot_earn'] &&
            b['kbObj'] && b['kbObj']['statistics'] && b['kbObj']['statistics']['avg_sort_tot_earn']) {
          return a['kbObj']['statistics']['avg_sort_tot_earn'] - b['kbObj']['statistics']['avg_sort_tot_earn'];
        } else {
          return 0;
        }
      });
    } else {
      composeViewObjs.value.sort((a, b) => {
        if (a['kbObj'] && a['kbObj']['statistics'] && a['kbObj']['statistics']['avg_sort_tot_earn'] &&
            b['kbObj'] && b['kbObj']['statistics'] && b['kbObj']['statistics']['avg_sort_tot_earn']) {
          return b['kbObj']['statistics']['avg_sort_tot_earn'] - a['kbObj']['statistics']['avg_sort_tot_earn'];
        } else {
          return 0;
        }
      });
    }
  } else if (_field === 'max_earn') {
    if (sortFieldFlag.value) {
      composeViewObjs.value.sort((a, b) => {
        if (a['kbObj'] && a['kbObj']['statistics'] && a['kbObj']['statistics']['max_sort_tot_earn'] &&
            b['kbObj'] && b['kbObj']['statistics'] && b['kbObj']['statistics']['max_sort_tot_earn']) {
          return a['kbObj']['statistics']['max_sort_tot_earn'] - b['kbObj']['statistics']['max_sort_tot_earn'];
        } else {
          return 0;
        }
      });
    } else {
      composeViewObjs.value.sort((a, b) => {
        if (a['kbObj'] && a['kbObj']['statistics'] && a['kbObj']['statistics']['max_sort_tot_earn'] &&
            b['kbObj'] && b['kbObj']['statistics'] && b['kbObj']['statistics']['max_sort_tot_earn']) {
          return b['kbObj']['statistics']['max_sort_tot_earn'] - a['kbObj']['statistics']['max_sort_tot_earn'];
        } else {
          return 0;
        }
      });
    }
  } else if (_field === 'positive') {
    if (sortFieldFlag.value) {
      composeViewObjs.value.sort((a, b) => {
        if (a['kbObj'] && a['kbObj']['positive'] &&
            b['kbObj'] && b['kbObj']['positive']) {
          return a['kbObj']['positive']['positive_reach_len'] - b['kbObj']['positive']['positive_reach_len'];
        } else {
          return 0;
        }
      });
    } else {
      composeViewObjs.value.sort((a, b) => {
        if (a['kbObj'] && a['kbObj']['positive'] &&
            b['kbObj'] && b['kbObj']['positive']) {
          return b['kbObj']['positive']['positive_reach_len'] - a['kbObj']['positive']['positive_reach_len'];
        } else {
          return 0;
        }
      });
    }
  } else if (_field === 'negative') {
    if (sortFieldFlag.value) {
      composeViewObjs.value.sort((a, b) => {
        if (a['kbObj'] && a['kbObj']['negative'] &&
            b['kbObj'] && b['kbObj']['negative']) {
          return a['kbObj']['negative']['negative_reach_len'] - b['kbObj']['negative']['negative_reach_len'];
        } else {
          return 0;
        }
      });
    } else {
      composeViewObjs.value.sort((a, b) => {
        if (a['kbObj'] && a['kbObj']['negative'] &&
            b['kbObj'] && b['kbObj']['negative']) {
          return b['kbObj']['negative']['negative_reach_len'] - a['kbObj']['negative']['negative_reach_len'];
        } else {
          return 0;
        }
      });
    }
  } else if (_field === 'wav_rate') {
    if (sortFieldFlag.value) {
      composeViewObjs.value.sort((a, b) => {
        return a['wav_obj']['wav_sort_level'] - b['wav_obj']['wav_sort_level'];
      });
    } else {
      composeViewObjs.value.sort((a, b) => {
        return b['wav_obj']['wav_sort_level'] - a['wav_obj']['wav_sort_level'];
      });
    }
  } else if (_field === 'hold_money') {
    if (sortFieldFlag.value) {
      composeViewObjs.value.sort((a, b) => {
        if (a['fixedHoldObj'] && a['fixedHoldObj']['hold_objs'] && a['fixedHoldObj']['hold_objs'].length > 0 &&
            b['fixedHoldObj'] && b['fixedHoldObj']['hold_objs'] && b['fixedHoldObj']['hold_objs'].length > 0) {
          return a['fixedHoldObj']['hold_objs'][a['fixedHoldObj']['hold_objs'].length - 1]['accu_money'] -
              b['fixedHoldObj']['hold_objs'][b['fixedHoldObj']['hold_objs'].length - 1]['accu_money']
        }
        return 0;
      });
    } else {
      composeViewObjs.value.sort((a, b) => {
        if (a['fixedHoldObj'] && a['fixedHoldObj']['hold_objs'] && a['fixedHoldObj']['hold_objs'].length > 0 &&
            b['fixedHoldObj'] && b['fixedHoldObj']['hold_objs'] && b['fixedHoldObj']['hold_objs'].length > 0) {
          return b['fixedHoldObj']['hold_objs'][b['fixedHoldObj']['hold_objs'].length - 1]['accu_money'] -
              a['fixedHoldObj']['hold_objs'][a['fixedHoldObj']['hold_objs'].length - 1]['accu_money']
        }
        return 0;
      });
    }
  } else if (_field === 'hold_rate') {
    if (sortFieldFlag.value) {
      composeViewObjs.value.sort((a, b) => {
        if (a['fixedHoldObj'] && a['fixedHoldObj']['hold_objs'] && a['fixedHoldObj']['hold_objs'].length > 0 &&
            b['fixedHoldObj'] && b['fixedHoldObj']['hold_objs'] && b['fixedHoldObj']['hold_objs'].length > 0) {
          return a['fixedHoldObj']['hold_objs'][a['fixedHoldObj']['hold_objs'].length - 1]['accu_pure_profit'] -
              b['fixedHoldObj']['hold_objs'][b['fixedHoldObj']['hold_objs'].length - 1]['accu_pure_profit']
        }
        return 0;
      });
    } else {
      composeViewObjs.value.sort((a, b) => {
        if (a['fixedHoldObj'] && a['fixedHoldObj']['hold_objs'] && a['fixedHoldObj']['hold_objs'].length > 0 &&
            b['fixedHoldObj'] && b['fixedHoldObj']['hold_objs'] && b['fixedHoldObj']['hold_objs'].length > 0) {
          return b['fixedHoldObj']['hold_objs'][b['fixedHoldObj']['hold_objs'].length - 1]['accu_pure_profit'] -
              a['fixedHoldObj']['hold_objs'][a['fixedHoldObj']['hold_objs'].length - 1]['accu_pure_profit']
        }
        return 0;
      });
    }
  } else if (_field === 'buy_money') {
    if (sortFieldFlag.value) {
      composeViewObjs.value.sort((a, b) => {
        let _a = (a.hasOwnProperty('money') && a['money'] !== null) ? a['money'] : -1
        let _b = (b.hasOwnProperty('money') && b['money'] !== null) ? b['money'] : -1
        return _a -_b
      });
    } else {
      composeViewObjs.value.sort((a, b) => {
        let _a = (a.hasOwnProperty('money') && a['money'] !== null) ? a['money'] : -1
        let _b = (b.hasOwnProperty('money') && b['money'] !== null) ? b['money'] : -1
        return _b - _a
      });
    }
  } else if (_field === 'set_money') {
    if (sortFieldFlag.value) {
      composeViewObjs.value.sort((a, b) => {
        let _a = (a.hasOwnProperty('adjust_money') && a['adjust_money'] !== null) ? a['adjust_money'] : -1
        let _b = (b.hasOwnProperty('adjust_money') && b['adjust_money'] !== null) ? b['adjust_money'] : -1
        return _a -_b
      });
    } else {
      composeViewObjs.value.sort((a, b) => {
        let _a = (a.hasOwnProperty('adjust_money') && a['adjust_money'] !== null) ? a['adjust_money'] : -1
        let _b = (b.hasOwnProperty('adjust_money') && b['adjust_money'] !== null) ? b['adjust_money'] : -1
        return _b - _a
      });
    }
  } else if (_field === 'fund_len') {
    if (sortFieldFlag.value) {
      composeViewObjs.value.sort((a, b) => {
        if (a['kbObj'] && a['kbObj']['statistics'] && a['kbObj']['statistics']['fund_perc_len'] &&
            b['kbObj'] && b['kbObj']['statistics'] && b['kbObj']['statistics']['fund_perc_len']) {
          return a['kbObj']['statistics']['fund_perc_len'] - b['kbObj']['statistics']['fund_perc_len'];
        } else {
          return 0;
        }
      });
    } else {
      composeViewObjs.value.sort((a, b) => {
        if (a['kbObj'] && a['kbObj']['statistics'] && a['kbObj']['statistics']['fund_perc_len'] &&
            b['kbObj'] && b['kbObj']['statistics'] && b['kbObj']['statistics']['fund_perc_len']) {
          return b['kbObj']['statistics']['fund_perc_len'] - a['kbObj']['statistics']['fund_perc_len'];
        } else {
          return 0;
        }
      });
    }
  } else if (_field === 'update_date') {
    if (sortFieldFlag.value) {
      composeViewObjs.value.sort((a, b) => {
        if (a['kbObj'] && a['kbObj']['statistics'] && a['kbObj']['statistics']['perc_not_update_days'] &&
            b['kbObj'] && b['kbObj']['statistics'] && b['kbObj']['statistics']['perc_not_update_days']) {
          return b['kbObj']['statistics']['perc_not_update_days'] - a['kbObj']['statistics']['perc_not_update_days'];
        } else {
          return 0;
        }
      });
    } else {
      composeViewObjs.value.sort((a, b) => {
        if (a['kbObj'] && a['kbObj']['statistics'] && a['kbObj']['statistics']['perc_not_update_days'] &&
            b['kbObj'] && b['kbObj']['statistics'] && b['kbObj']['statistics']['perc_not_update_days']) {
          return a['kbObj']['statistics']['perc_not_update_days'] - b['kbObj']['statistics']['perc_not_update_days'];
        } else {
          return 0;
        }
      });
    }
  } else if (_field === 'selected') {
    composeViewObjs.value.sort((a, b) => {
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
  //
  scrollViewBySelection()
}

const rowElements = ref({})
const currSelectedNum = ref(0)
watch(composeViewObjs, () => {
  let _filtered = composeViewObjs.value.filter((elem => elem['currSelected']))
  currSelectedNum.value = _filtered.length
}, {
  deep: true
})

function scrollViewBySelection() {
  nextTick(() => {
    if (currSelectedNum.value >= 1) {
      const func = elem => elem['currSelected']
      let _idx = composeViewObjs.value.findIndex(func)
      if (_idx != -1) {
        let _rowObj = composeViewObjs.value[_idx]
        rowElements.value[_rowObj['fund_id']].scrollIntoView({block: "center", behavior: "smooth"})
      }
    } else if (composeViewObjs.value.length > 0) {
      let _fund_id = composeViewObjs.value[0]['fund_id']
      rowElements.value[_fund_id].scrollIntoView({block: "center", behavior: "smooth"})
    }
  })
}

function switchWavDisp(oneRowObj) {
  if (!oneRowObj.hasOwnProperty('show_wav')) {
    oneRowObj['show_wav'] = true;
  } else {
    oneRowObj['show_wav'] = !oneRowObj['show_wav'];
  }
}

function selOrDesRow(oneRowObj) {
  if (oneRowObj.hasOwnProperty('currSelected')) {
    oneRowObj['currSelected'] = !oneRowObj['currSelected']
  } else {
    oneRowObj['currSelected'] = true
  }
}

function clearSelected() {
  composeViewObjs.value.forEach((elem) => elem['currSelected'] = false)
}
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
  padding: 0 5px 0 5px !important;
}

#detail_container td {
  padding: 3px 5px 3px 5px !important;
  background-color: cornsilk;
}

.circle_border {
  border: solid 2px red;
  border-radius: 4px;
  padding: 2px;
}

.less_height {
  line-height: 1.2rem;
}

.blink_me {
  animation: blinker 10s linear infinite;
}

@keyframes blinker {
  50% {
    opacity: 0;
  }
}
</style>