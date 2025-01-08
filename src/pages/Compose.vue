<template>
  <div :style="topSecClass">
    <div id="op_pane" :style="{ 'height': opPaneHeight + 'rem' }" class="grid_pane_c10">
      <div style="margin-right:0.5rem;">
        <select class="form-select" style="width: 6.5rem;" v-model="compose_name">
          <option v-for="option in buy_in_from_plan" v-bind:value="option.source_val">
            {{ option.source_name }}
          </option>
        </select>
      </div>

      <div class="form-check form_check_cust">
          <input class="form-check-input" type="checkbox" id="to_be_sold" v-model="show4SoldOnly">
          <label class="form-check-label" for="to_be_sold">待卖&nbsp;</label>
          <span class="badge bg-warning" style="position: relative; top: -1px;">{{ tot4SoldNum }}</span>
      </div>
      <div class="form-check form_check_cust">
          <input class="form-check-input" type="checkbox" id="to_be_buy" v-model="showPauseOnly">
          <label class="form-check-label" for="to_be_buy">待买&nbsp;</label>
          <span class="badge bg-warning" style="position: relative; top: -1px;">{{ totPauseNum }}</span>
      </div>
      <div class="form-check form_check_cust">
          <input class="form-check-input" type="checkbox" id="to_be_adj" v-model="showAdjustOnly">
          <label class="form-check-label" for="to_be_adj">调整&nbsp;</label>
          <span class="badge bg-warning" style="position: relative; top: -1px;">{{ totAdjustNum }}</span>
      </div>
      <div class="form-check form_check_cust">
          <input class="form-check-input" type="checkbox" id="to_be_thres" v-model="showPoleOnly">
          <label class="form-check-label" for="to_be_thres">突破&nbsp;</label>
          <span class="badge bg-warning" style="position: relative; top: -1px;">{{ totPoleNum }}</span>
      </div>
      <div class="form-check form_check_cust">
        <input class="form-check-input" type="checkbox" id="to_be_note" v-model="showNoteOnly">
        <label class="form-check-label" for="to_be_note">笔记&nbsp;</label>
        <span class="badge bg-warning" style="position: relative; top: -1px;">{{ totNoteNum }}</span>
      </div>

      <div style="cursor: pointer;" @click="clearSelected()">
        &nbsp;选择&nbsp;<span class="badge bg-warning text-dark">{{ currSelectedNum }}</span>
      </div>
      
      <input type="text" class="form-control-plaintext search_box" style="" v-model="searchCond"
             @keyup.enter="searchByCond()">
      <input class="btn btn-primary btn-sm" type="button" value="查找" @click="searchByCond()">
      <template v-if="currSelectedNum > 0">
        <input class="btn btn-primary btn-sm" type="button" value="前移选择" @click="sortByField('selected')">
      </template>

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
              <div class="w33_w_br">
                <div class="w50_w_br" @click="sortByField('short_wav')">
                  <template v-if="sortFieldName === 'short_wav'">
                    <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
                    <span v-else><i class="bi bi-arrow-down"></i></span>
                  </template>
                  <span style="font-size:0.9rem;">短时</span>
                </div>
                <div class="w50_w_br" @click="sortByField('positive')" style="border: none;">
                  <template v-if="sortFieldName === 'positive'">
                  <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
                  <span v-else><i class="bi bi-arrow-down"></i></span>
                  </template>
                  <span style="font-size:0.9rem;">高点</span>
                </div>
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
            <div class="w50_w_br" @click="sortByField('cont_start')">
              <template v-if="sortFieldName === 'cont_start'">
                <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
                <span v-else><i class="bi bi-arrow-down"></i></span>
              </template>
              <span>连购</span>
            </div>
            <div class="w50_w_br" @click="sortByField('cont_stop')" style="border: none;">
              <template v-if="sortFieldName === 'cont_stop'">
                <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
                <span v-else><i class="bi bi-arrow-down"></i></span>
              </template>
              <span>连停</span>
            </div>
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
                <div style="display: flex; align-items: center; column-gap: 3px;">
                  <template v-if="oneRow['compose_name'] === 'ovtree'">
                    <span class="badge bg-primary text-bg-success big_badge">
                      橄榄树
                    </span>
                  </template>
                  <template v-else-if="oneRow['compose_name'] === 'flyhorse'">
                    <span class="badge bg-secondary text-bg-success big_badge">
                      飞马
                    </span>                    
                  </template>
                  <template v-else-if="oneRow['compose_name'] === 'medusa'">
                    <span class="badge text-bg-success big_badge" style="background-color:purple !important;">
                      美杜莎
                    </span>
                  </template>                   
                  <template v-else-if="oneRow['compose_name'] === 'dolphin'">
                    <span class="badge bg-info text-bg-success big_badge">
                      海豚
                    </span>
                  </template>
                  <template v-else-if="oneRow['compose_name'] === 'trident'">
                    <span class="badge bg-success text-bg-success big_badge">
                      三叉戟
                    </span>
                  </template>
                  <template v-else-if="oneRow['compose_name'] === 'gdngoat'">
                    <span class="badge bg-danger text-bg-success big_badge">
                      金毛羊
                    </span>
                  </template>
                  <template v-if="oneRow['refer_compose_name']">
                      <template v-if="oneRow['refer_compose_name'] === 'flyhorse'">
                        <span class="badge bg-secondary text-bg-success big_badge">
                          飞马
                        </span>   
                      </template>
                      <template v-else-if="oneRow['refer_compose_name'] === 'ovtree'">
                        <span class="badge bg-primary text-bg-success big_badge">
                          橄榄树
                        </span>
                      </template>
                      <template v-else-if="oneRow['refer_compose_name'] === 'medusa'">
                        <span class="badge text-bg-success big_badge" style="background-color:purple !important;">
                          美杜莎
                        </span>                            
                      </template>
                      <template v-else-if="oneRow['refer_compose_name'] === 'dolphin'">
                        <span class="badge bg-info text-bg-success big_badge">
                          海豚
                        </span>                            
                      </template>
                      <template v-else-if="oneRow['refer_compose_name'] === 'trident'">
                        <span class="badge bg-success text-bg-success big_badge">
                          三叉戟
                        </span>                            
                      </template>
                      <template v-else-if="oneRow['refer_compose_name'] === 'gdngoat'">
                        <span class="badge bg-danger text-bg-success big_badge">
                          金毛羊
                        </span>                            
                      </template>
                      <template v-else-if="oneRow['refer_compose_name'] === 'big_pool' || oneRow['refer_compose_name'] === 'bigpool'">
                        <span class="badge bg-warning text-bg-success big_badge">
                          大池
                        </span>
                      </template>
                  </template>                  
                  <span style="padding: 1px 3px; border-radius: 5px; border: solid 1px darkgreen; color: darkgreen; cursor: pointer;margin-left:5px;"
                  @click.stop="addBuyOrSoldNote(oneRow['fund_id'], oneRow['fund_name'], true, false, oneRow['compose_name'])">
                    想买<template v-if="buyOrSoldObj[oneRow['fund_id']] && buyOrSoldObj[oneRow['fund_id']]['buy_times']">({{buyOrSoldObj[oneRow['fund_id']]['buy_times']}})</template>
                  </span>
                  <span style="padding: 1px 3px; border-radius: 5px; border: solid 1px chocolate; color: chocolate; cursor: pointer;margin-left:5px;"
                  @click.stop="addBuyOrSoldNote(oneRow['fund_id'], oneRow['fund_name'], false, true, oneRow['compose_name'])">
                    想卖<template v-if="buyOrSoldObj[oneRow['fund_id']] && buyOrSoldObj[oneRow['fund_id']]['sold_times']">({{buyOrSoldObj[oneRow['fund_id']]['sold_times']}})</template>
                  </span>
                </div>
                <div>
                  <template v-if="oneRow['has_bonus']">
                    <span style="color: red; font-weight: bold;">{{ oneRow.fund_id }}&nbsp;</span>
                  </template>
                  <template v-else>
                    <span style="">{{ oneRow.fund_id }}&nbsp;</span>
                  </template>
                </div>
                <template v-if="noteObjs[oneRow['fund_id']] && noteObjs[oneRow['fund_id']]['full_comments'] && noteObjs[oneRow['fund_id']]['full_comments'].length > 0">
                  <div style="position: relative;--tooltip-left:0rem;--tooltip-top:1.5rem;"
                       v-bind:data-title="noteObjs[oneRow['fund_id']]['full_comments']" data-float-no-pos-sm="">{{ oneRow.fund_name }}
                    <template v-if="noteObjs && noteObjs[oneRow['fund_id']] && noteObjs[oneRow['fund_id']]['note_objs'] && noteObjs[oneRow['fund_id']]['note_objs'].length > 0">
                        <span style="font-weight:bold;color:red;border:solid 1px red;border-radius:5px; padding:0 5px 0 3px;font-size:0.9rem;margin-left:0.2rem;margin-right:0.2rem;">
                        {{noteObjs[oneRow['fund_id']]['note_objs'].length}}
                        </span>
                    </template>
                    <template v-if="oneRow['last_sold_date']">
                      <a v-bind:href="baseUrl4Report + oneRow['fund_id']" _target="blank" style="text-decoration: none" title="看走势">
                        <span style="color:red;font-weight: bold;font-size:1.1rem;">售:&nbsp;{{ oneRow['last_sold_date'] }}
                          <template v-if="oneRow.hasOwnProperty('last_sold_days') && oneRow['last_sold_days'] != null">
                          &nbsp;|&nbsp;{{ oneRow['last_sold_days'] }}日
                          </template>
                        </span>
                      </a>
                    </template>
                  </div>
                </template>
                <template v-else>
                  <div>{{ oneRow.fund_name }}&nbsp;
                    <template v-if="oneRow['last_sold_date']">
                      <a v-bind:href="baseUrl4Report + oneRow['fund_id']" _target="blank" style="text-decoration: none" title="看走势">
                        <span style="color:red;font-weight: bold;font-size:1.1rem;">售:&nbsp;{{ oneRow['last_sold_date'] }}
                          <template v-if="oneRow.hasOwnProperty('last_sold_days') && oneRow['last_sold_days'] != null">
                          &nbsp;|&nbsp;{{ oneRow['last_sold_days'] }}日
                          </template>
                        </span>
                      </a>
                    </template>
                  </div>
                </template>
                <template v-if="oneRow.hasOwnProperty('lossFlag') && oneRow['lossFlag']">
                  <div style="display:inline-block;color:red;padding:2px;font-size:0.9rem;font-weight:bold;border:solid 1px red;border-radius:5px;margin-right:0.5rem;">损</div>
                </template>
                <template v-if="oneRow.hasOwnProperty('show_enable_loss_btn') && oneRow['show_enable_loss_btn']">
                  <button type="button" class="btn btn-danger" style="font-size: 0.8rem;padding-left:5px;padding-right:5px;margin-right:0.5rem;"
                        @click.stop="setComposeProperty_wrapper(oneRow['fund_id'], oneRow['fund_name'], oneRow['compose_name'], -2, oneRow['buyin_source'], true)">
                        设止损</button>
                </template>
                <template v-if="oneRow.hasOwnProperty('show_disable_loss_btn') && oneRow['show_disable_loss_btn']">
                  <button type="button" class="btn btn-secondary" style="font-size: 0.8rem;padding-left:5px;padding-right:5px;"
                        @click.stop="setComposeProperty_wrapper(oneRow['fund_id'], oneRow['fund_name'], oneRow['compose_name'], -1, oneRow['buyin_source'], false)">
                        去止损</button>
                </template>
              </td>
              <td colspan="2" v-bind:class="{ sel_row: oneRow['currSelected'] }">
                <template v-if="oneRow['kbObj'] && oneRow.kbObj.positive">
                  <div style="height: 1.8em; position: relative; text-align: center;"
                    v-bind:class="getPosColor(oneRow.kbObj.positive.positive_reach_len)">
                    <template v-if="oneRow.hasOwnProperty('quant_obj') && oneRow['quant_obj']['max_hitted']">
                      <a v-bind:href="baseUrl4ProbeNav + oneRow['fund_id'] + '&cust_fund_name=' + oneRow['fund_name'] + '&cust_buyin_type=' + 'fixed_buyin_append'" 
                      target="_blank" style="cursor: pointer; text-decoration: none;"
                      @mouseover="oneRow['show_temp_quant_tip']=true;"
                      @mouseleave="oneRow['show_temp_quant_tip']=false;">
                        <span class="icon_pos_left" style="color: red;">
                          <i class="bi bi-arrow-up-circle-fill"></i>
                          <div style="" class="icon_tri">
                            <div>{{ oneRow['quant_obj']['rate_str'] }}</div>
                            <div style="border-top: solid 2px darkgrey;">{{ oneRow['quant_obj']['max_str'] }}</div>
                          </div>
                        </span>
                      </a>
                      <template v-if="oneRow['show_temp_quant_tip']">
                        <span class="hover_tip">
                          若高点明显则不应追加
                        </span>
                      </template>
                    </template>
                  </div>
                  <div style="height: 1.8em; position: relative; text-align: center;"
                    v-bind:class="getNegColor(oneRow.kbObj.negative.negative_reach_len)">
                    <template v-if="oneRow.hasOwnProperty('quant_obj') && oneRow['quant_obj']['min_hitted']">
                      <span class="icon_pos_left" style="color: darkgreen;">
                        <i class="bi bi-arrow-down-circle-fill"></i>
                        <div style="" class="icon_tri">
                          <div>{{ oneRow['quant_obj']['rate_str'] }}</div>
                          <div style="border-top: solid 2px darkgrey;">{{ oneRow['quant_obj']['min_str'] }}</div>
                        </div>
                      </span>
                    </template>
                  </div>
                </template>
              </td>              
              <td colspan="3" v-bind:class="{ sel_row: oneRow['currSelected'] }">
                <span style="color: red; font-weight: 900;">已缺失，可能是经理更换或业绩不再收敛。</span>
              </td>
              <td style="line-height: 1.6;" v-bind:class="{ sel_row: oneRow['currSelected'] }">
                <template v-if="oneRow['kbObj']">
                  <div @click.stop="suggestCompose4Ui($event, oneRow)"
                      style="cursor: pointer; margin-bottom: 0.3rem; text-decoration: underline;color:darkgreen;font-weight: bold;">
                    速决策(^q)
                  </div>
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
                    <template v-if="oneRow['hold_accu_pure_profit']">
                      <span
                        :style="{ color: (oneRow['hold_accu_pure_profit'] >= 0 ? 'red' : 'darkgreen'), 'font-weight': 'bold' }">
                        {{ oneRow['hold_accu_pure_profit'] }}
                      </span>
                    </template>
                  </div>
                  <div>
                    计:&nbsp;
                    <template v-if="oneRow['hold_accu_pure_percent_str']">
                      <span
                        :style="{ color: (oneRow['hold_accu_pure_profit'] >= 0 ? 'red' : 'darkgreen'), 'font-weight': 'bold' }">
                        {{ oneRow['hold_accu_pure_percent_str'] }}
                      </span>
                    </template>
                  </div>
                </template>
                <template v-if="oneRow.hasOwnProperty('money') && oneRow['money'] > 0 && (!buyout_future_objs.hasOwnProperty(oneRow['fund_id']) || !buyout_future_objs[oneRow['fund_id']])">
                  <button type="button" class="btn btn-secondary" style="font-size: 0.8rem; margin-right: 0.5rem;padding-left:5px;padding-right:5px"
                          @click.stop="removeFixedFund4TodayUi(oneRow['fund_id'], oneRow['fund_name'], oneRow)">
                    撤今日
                  </button>
                </template>
                <template v-else-if="oneRow.hasOwnProperty('money') && oneRow['money'] > 0 && (buyout_future_objs.hasOwnProperty(oneRow['fund_id']) && buyout_future_objs[oneRow['fund_id']] != null)">
                  <span class="badge bg-success text-bg-success big_badge" style="margin-right: 0.5rem;padding-left:5px;padding-right:5px">
                    已撤
                  </span>
                </template>
                <button type="button" class="btn btn-primary" style="font-size: 0.8rem;padding-left:5px;padding-right:5px;"
                        @click.stop="switchWriteNote(oneRow)">
                  笔记<template v-if="noteObjs && noteObjs[oneRow['fund_id']] && noteObjs[oneRow['fund_id']]['note_objs'] && noteObjs[oneRow['fund_id']]['note_objs'].length > 0">
                    ({{noteObjs[oneRow['fund_id']]['note_objs'].length}})
                  </template>
                </button>
              </td>
              <td style="line-height: 2rem;" v-bind:class="{ sel_row: oneRow['currSelected'] }">
                <div style="display:flex;align-items:center;">
                  <span style="text-wrap:nowrap;">账户:&nbsp;&nbsp;</span>
                  <select class="form-select nr_select" @click.stop v-model="oneRow['buyin_source']"
                  :style="{
                  'color': oneRow['buyin_source'] === 'jd'? 'blue': 
                           oneRow['buyin_source'] === 'tt'? 'chocolate':
                           oneRow['buyin_source'] === 'ths'? 'deeppink':
                           oneRow['buyin_source'] === 'zfb'? 'purple':
                           oneRow['buyin_source'] === 'gt'? 'indigo':
                           oneRow['buyin_source'] === 'wx'? 'olive':
                           oneRow['buyin_source'] === 'zs'? 'crimson': 'red',
                  'border-color': oneRow['buyin_source'] === 'jd'? 'blue': 
                           oneRow['buyin_source'] === 'tt'? 'chocolate':
                           oneRow['buyin_source'] === 'ths'? 'deeppink':
                           oneRow['buyin_source'] === 'zfb'? 'purple':
                           oneRow['buyin_source'] === 'gt'? 'indigo':
                           oneRow['buyin_source'] === 'wx'? 'olive':
                           oneRow['buyin_source'] === 'zs'? 'crimson': 'red',
                  'max-width': '6.2rem'}">
                    <option v-for="option in buy_in_sources_options" v-bind:value="option.source_val">
                      {{ option.source_name }}
                    </option>
                  </select>
                </div>
                <div style="height:0.5rem;"></div>                
                <div>
                  当前:&nbsp;
                  <input type="number" style="width: 4rem; border-radius: 5px;" v-model="oneRow['money']" @click.stop>
                </div>
                <div>
                  决策:&nbsp;&nbsp;{{ oneRow['adjust_money'] }}
                  <template v-if="oneRow['adjust_money']">
                    <span class="red_card less_height" v-if="oneRow['money'] - oneRow['adjust_money'] >= 5">&nbsp;</span><!--
                    --><span class="darkgolden_card less_height"
                      v-if="oneRow['adjust_money'] - oneRow['money'] >= 5">&nbsp;</span><!--
                    --><span class="red_card less_height"
                      v-if="oneRow['money'] - oneRow['adjust_money'] >= 10">&nbsp;</span><!--
                    --><span class="darkgolden_card less_height"
                      v-if="oneRow['adjust_money'] - oneRow['money'] >= 10">&nbsp;</span><!--
                    --><span class="red_card less_height"
                      v-if="oneRow['money'] - oneRow['adjust_money'] >= 15">&nbsp;</span><!--
                    --><span class="darkgolden_card less_height"
                      v-if="oneRow['adjust_money'] - oneRow['money'] >= 15">&nbsp;</span><!--
                    --><span class="red_card less_height"
                      v-if="oneRow['money'] - oneRow['adjust_money'] >= 20">&nbsp;</span><!--
                    --><span class="darkgolden_card less_height"
                      v-if="oneRow['adjust_money'] - oneRow['money'] >= 20">&nbsp;</span>
                    <template v-if="false">
                      <!--
                      --><span class="red_card less_height"
                        v-if="oneRow['money'] - oneRow['adjust_money'] >= 25">&nbsp;</span><!--
                      --><span class="darkgolden_card less_height"
                        v-if="oneRow['adjust_money'] - oneRow['money'] >= 25">&nbsp;</span><!--
                      --><span class="red_card less_height"
                        v-if="oneRow['money'] - oneRow['adjust_money'] >= 30">&nbsp;</span><!--
                      --><span class="darkgolden_card less_height"
                        v-if="oneRow['adjust_money'] - oneRow['money'] >= 30">&nbsp;</span><!--
                      --><span class="red_card less_height"
                        v-if="oneRow['money'] - oneRow['adjust_money'] >= 35">&nbsp;</span><!--
                      --><span class="darkgolden_card less_height"
                        v-if="oneRow['adjust_money'] - oneRow['money'] >= 35">&nbsp;</span><!--
                      --><span class="red_card less_height"
                        v-if="oneRow['money'] - oneRow['adjust_money'] >= 40">&nbsp;</span><!--
                      --><span class="darkgolden_card less_height"
                        v-if="oneRow['adjust_money'] - oneRow['money'] >= 40">&nbsp;</span>
                    </template>
                  </template>
                </div>
                <div style="text-wrap:nowrap;">
                  <span style="font-size: 1rem; font-style: italic;text-decoration: underline;">{{
                    oneRow['last_adjust_money_date'] }}</span>&nbsp;
                  <input class="btn btn-outline-danger btn-sm" style="width:3.5rem;" type="button" value="保存"
                    @click.stop="setComposeProperty_wrapper(oneRow['fund_id'], oneRow['fund_name'], oneRow['compose_name'], parseInt(oneRow['money']), oneRow['buyin_source'], oneRow['lossFlag'])">
                </div>
              </td>
              <td style="text-align: center;" v-bind:class="{ sel_row: oneRow['currSelected'] }">
                <template v-if="contStartStopObj.hasOwnProperty(oneRow['fund_id']) && contStartStopObj[oneRow['fund_id']]['start_stop_obj'] && contStartStopObj[oneRow['fund_id']]['start_stop_obj']['cont_stop_flag']">
                  <div style="color: darkgreen; text-decoration: none;">
                    <span style="font-weight: bold; text-decoration: none;position: relative;--tooltip-left:-8rem;--tooltip-top:-2rem;"
                    data-title="若连停小于10交易日则不宜启动" data-float-no-pos="">
                      连停&nbsp;
                      <template v-if="oneRow.hasOwnProperty('money') && oneRow['money'] > 0">
                        <span style="font-weight:bold;">刚启动</span>
                      </template>
                      <template v-else>
                        <span :style="{
                          'font-size':
                          contStartStopObj[oneRow['fund_id']]['start_stop_obj']['stop_days'] >= 30? '1.3rem':
                          contStartStopObj[oneRow['fund_id']]['start_stop_obj']['stop_days'] >= 20? '1.2rem':
                          contStartStopObj[oneRow['fund_id']]['start_stop_obj']['stop_days'] >= 10? '1.1rem': '1rem',
                          'font-weight':
                          contStartStopObj[oneRow['fund_id']]['start_stop_obj']['stop_days'] >= 10? 'bold': 'normal',
                          'text-decoration':
                          contStartStopObj[oneRow['fund_id']]['start_stop_obj']['stop_days'] >= 10? 'none': 'line-through'
                        }">
                        {{contStartStopObj[oneRow['fund_id']]['start_stop_obj']['stop_days']}}日
                        </span>
                      </template>
                    </span>
                  </div>
                </template>
                <template v-if="contStartStopObj.hasOwnProperty(oneRow['fund_id']) && contStartStopObj[oneRow['fund_id']]['start_stop_obj'] && contStartStopObj[oneRow['fund_id']]['start_stop_obj']['cont_start_flag']">
                  <div style="color: red; text-decoration: none;">
                    <span style="font-weight: bold; text-decoration: none;position: relative;--tooltip-left:-10rem;--tooltip-top:-2rem;"
                    data-title="若连购小于20交易日则不宜停止" data-float-no-pos="">
                      连购&nbsp;
                      <template v-if="oneRow.hasOwnProperty('money') && oneRow['money'] < 0">
                        <span style="font-weight:bold;">刚停止</span>
                      </template>
                      <template v-else>
                        <span :style="{
                          'font-size':
                          contStartStopObj[oneRow['fund_id']]['start_stop_obj']['start_days'] >= 60? '1.3rem':
                          contStartStopObj[oneRow['fund_id']]['start_stop_obj']['start_days'] >= 40? '1.2rem':
                          contStartStopObj[oneRow['fund_id']]['start_stop_obj']['start_days'] >= 20? '1.1rem': '1rem',
                          'font-weight':
                          contStartStopObj[oneRow['fund_id']]['start_stop_obj']['start_days'] >= 20? 'bold': 'normal',
                          'text-decoration':
                          contStartStopObj[oneRow['fund_id']]['start_stop_obj']['start_days'] >= 20? 'none': 'line-through'
                        }">
                        {{contStartStopObj[oneRow['fund_id']]['start_stop_obj']['start_days']}}日
                        </span>
                      </template>
                    </span>
                  </div>
                </template>
                <template v-if="true"> <!-- v-if="oneRow.hasOwnProperty('last_pause_days') && oneRow['last_pause_days'] >= 5" -->
                  <a v-bind:href="baseUrl4Report + oneRow['fund_id']" _target="blank" style="display:inline-block;height:3rem;line-height:3;color:red;">
                    <span style="line-height: 3;">看走势</span>
                  </a>
                  <br>
                </template>
                <template v-if="oneRow['fixedHoldObj'] && oneRow['fixedHoldObj']['hold_objs'] && oneRow['fixedHoldObj']['hold_objs'].length > 0">
                  <button type="button" class="btn"
                    :class="{ 'btn-primary': !oneRow['fixedHoldObj']['disp_flag'], 'btn-secondary': oneRow['fixedHoldObj']['disp_flag'] }"
                    @click.stop="oneRow['fixedHoldObj']['disp_flag'] = !oneRow['fixedHoldObj']['disp_flag'];">
                    <template v-if="!oneRow['fixedHoldObj']['disp_flag']">展开</template>
                    <template v-else>折叠</template>
                  </button>
                  <br>
                </template>
                <template v-else>
                  <button type="button" class="btn btn-warning" @click.stop="removeCompose4Ui($event, oneRow)">
                    移除
                  </button>
                  <br>
                </template>
              </td>
            </tr>
            <tr v-if="oneRow['show_write_note']">
              <td colspan="9" style="background-color: lightblue;">
                <div style="display: flex;flex-direction: row;flex-wrap: nowrap;column-gap: 0.5rem;align-items: center;">
                  <div style="display: inline-block;">日期:</div>
                  <input type="text" class=""
                         style="display: inline-block;border-radius:5px;border-width: 0;outline:none;width:6.5rem;"
                         v-model="oneRow['write_note_date']">
                  <div style="display: inline-block;">盈利:</div>
                  <input type="text" class=""
                         style="display: inline-block;border-radius:5px;border-width: 0;outline:none;width:4rem;"
                         v-model="oneRow['write_note_perc']">
                  <div style="display: inline-block;">日记:</div>
                  <input type="text" class=""
                         style="display: inline-block;border-radius:5px;border-width: 0;outline:none;flex-grow:0.9;"
                         v-model="oneRow['write_note_comments']">
                  <button type="button" class="btn btn-warning"
                          style="font-size:0.9rem;display:inline-block;width:6rem;"
                          v-bind:disabled="
                          (!oneRow['write_note_date'] || oneRow['write_note_date'].trim() == '')
                       || (
                           (!oneRow['write_note_perc'] || oneRow['write_note_perc'].trim() == '')
                           &&(!oneRow['write_note_comments'] || oneRow['write_note_comments'].trim() == '')
                          )
                       || (oneRow['write_note_perc'].trim() != ''
                           && oneRow['write_note_perc'].indexOf('%') == -1
                          )
                          "
                          @click="updateFundNotes(oneRow);">
                    保存
                  </button>
                  <button type="button" class="btn btn-danger"
                          style="font-size:0.9rem;display:inline-block;width:6rem;"
                          v-bind:disabled="!oneRow['write_note_date'] || oneRow['write_note_date'].trim() == ''"
                          @click="removeFundNotes(oneRow);">
                    删除
                  </button>
                  <template v-if="oneRow['note_objs'].length > 0">
                    <div style="display:inline-block;flex-grow:0.1;color:darkgreen;">共({{oneRow['note_objs'].length}})条</div>
                    <button type="button" class="btn btn-secondary"
                            style="font-size:0.8rem;display:inline-block;width:4rem;"
                            v-bind:disabled="oneRow['curr_note_idx'] <= 0"
                            @click="navigateNote(oneRow, true)">
                      前向
                    </button>
                    <button type="button" class="btn btn-secondary"
                            style="font-size:0.8rem;display:inline-block;width:4rem;"
                            v-bind:disabled="oneRow['curr_note_idx'] >= oneRow['note_objs'].length - 1"
                            @click="navigateNote(oneRow, false)">
                      后向
                    </button>
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
                <div style="display: flex; align-items: center; column-gap: 3px;">
                  <template v-if="oneRow['compose_name'] === 'ovtree'">
                    <span class="badge bg-primary text-bg-success big_badge">
                      橄榄树
                    </span>
                  </template>
                  <template v-else-if="oneRow['compose_name'] === 'flyhorse'">
                    <span class="badge bg-secondary text-bg-success big_badge">
                      飞马
                    </span>                   
                  </template>
                  <template v-else-if="oneRow['compose_name'] === 'medusa'">
                    <span class="badge text-bg-success big_badge" style="background-color:purple !important;">
                      美杜莎
                    </span>
                  </template>                   
                  <template v-else-if="oneRow['compose_name'] === 'dolphin'">
                    <span class="badge bg-info text-bg-success big_badge">
                      海豚
                    </span>
                  </template>
                  <template v-else-if="oneRow['compose_name'] === 'trident'">
                    <span class="badge bg-success text-bg-success big_badge">
                      三叉戟
                    </span>
                  </template>
                  <template v-else-if="oneRow['compose_name'] === 'gdngoat'">
                    <span class="badge bg-danger text-bg-success big_badge">
                      金毛羊
                    </span>
                  </template>
                  <template v-if="oneRow['refer_compose_name']">
                      <template v-if="oneRow['refer_compose_name'] === 'flyhorse'">
                        <span class="badge bg-secondary text-bg-success big_badge">
                          飞马
                        </span>   
                      </template>
                      <template v-else-if="oneRow['refer_compose_name'] === 'ovtree'">
                        <span class="badge bg-primary text-bg-success big_badge">
                          橄榄树
                        </span>
                      </template>
                      <template v-else-if="oneRow['refer_compose_name'] === 'medusa'">
                        <span class="badge text-bg-success big_badge" style="background-color:purple !important;">
                          美杜莎
                        </span>                            
                      </template>
                      <template v-else-if="oneRow['refer_compose_name'] === 'dolphin'">
                        <span class="badge bg-info text-bg-success big_badge">
                          海豚
                        </span>                            
                      </template>
                      <template v-else-if="oneRow['refer_compose_name'] === 'trident'">
                        <span class="badge bg-success text-bg-success big_badge">
                          三叉戟
                        </span>                            
                      </template>
                      <template v-else-if="oneRow['refer_compose_name'] === 'gdngoat'">
                        <span class="badge bg-danger text-bg-success big_badge">
                          金毛羊
                        </span>                            
                      </template>
                      <template v-else-if="oneRow['refer_compose_name'] === 'big_pool' || oneRow['refer_compose_name'] === 'bigpool'">
                        <span class="badge bg-warning text-bg-success big_badge">
                          大池
                        </span>                            
                      </template>                      
                    </template>                    
                  <span style="padding: 1px 3px; border-radius: 5px; border: solid 1px darkgreen; color: darkgreen; cursor: pointer; margin-left:5px;"
                  @click.stop="addBuyOrSoldNote(oneRow['fund_id'], oneRow['fund_name'], true, false, oneRow['compose_name'])">
                    想买<template v-if="buyOrSoldObj[oneRow['fund_id']] && buyOrSoldObj[oneRow['fund_id']]['buy_times']">({{buyOrSoldObj[oneRow['fund_id']]['buy_times']}})</template>
                  </span>
                  <span style="padding: 1px 3px; border-radius: 5px; border: solid 1px chocolate; color: chocolate; cursor: pointer; margin-left:5px;"
                  @click.stop="addBuyOrSoldNote(oneRow['fund_id'], oneRow['fund_name'], false, true, oneRow['compose_name'])">
                    想卖<template v-if="buyOrSoldObj[oneRow['fund_id']] && buyOrSoldObj[oneRow['fund_id']]['sold_times']">({{buyOrSoldObj[oneRow['fund_id']]['sold_times']}})</template>
                  </span>
                </div>
                <div>
                  <template v-if="oneRow['fixedHoldObj'] && oneRow['fixedHoldObj']['has_bonus']">
                    <span style="color: red; font-weight: bold;">{{ oneRow.fund_id }}&nbsp;</span>
                  </template>
                  <template v-else>
                    <span style="">{{ oneRow.fund_id }}&nbsp;</span>
                  </template>
                  <template v-if="oneRow['kbObj']">
                    <span style="font-size: 1rem; font-style: italic;text-decoration: underline;">
                      {{ oneRow?.kbObj?.statistics?.last_perc_date_str }}
                    </span>
                  </template>
                </div>
                <template v-if="noteObjs[oneRow['fund_id']] && noteObjs[oneRow['fund_id']]['full_comments'] && noteObjs[oneRow['fund_id']]['full_comments'].length > 0">
                  <div style="position: relative;--tooltip-left:0rem;--tooltip-top:1.5rem;"
                       v-bind:data-title="noteObjs[oneRow['fund_id']]['full_comments']" data-float-no-pos-sm="">{{ oneRow.fund_name }}
                    <template v-if="noteObjs && noteObjs[oneRow['fund_id']] && noteObjs[oneRow['fund_id']]['note_objs'] && noteObjs[oneRow['fund_id']]['note_objs'].length > 0">
                        <span style="font-weight:bold;color:red;border:solid 1px red;border-radius:5px; padding:0 5px 0 3px;font-size:0.9rem;margin-left:0.2rem;margin-right:0.2rem;">
                        {{noteObjs[oneRow['fund_id']]['note_objs'].length}}
                        </span>
                    </template>
                    <template v-if="oneRow['kbObj']">
                      <span style="font-size: 1rem; font-style: italic;text-decoration: underline;">
                        {{ oneRow.kbObj.statistics.fund_perc_len }}
                      </span>
                    </template>
                    <template v-if="oneRow['last_sold_date']">
                      <a v-bind:href="baseUrl4Report + oneRow['fund_id']" _target="blank" style="text-decoration: none" title="看走势">
                        <span style="color:red;font-weight: bold;font-size:1.1rem;">&nbsp;&nbsp;售:&nbsp;{{ oneRow['last_sold_date'] }}
                          <template v-if="oneRow.hasOwnProperty('last_sold_days') && oneRow['last_sold_days'] != null">
                          &nbsp;|&nbsp;{{ oneRow['last_sold_days'] }}日
                          </template>
                        </span>
                      </a>
                    </template>
                  </div>
                </template>
                <template v-else>
                  <div>{{ oneRow.fund_name }}&nbsp;
                    <template v-if="oneRow['kbObj']">
                      <span style="font-size: 1rem; font-style: italic;text-decoration: underline;">
                        {{ oneRow.kbObj?.statistics?.fund_perc_len }}
                      </span>
                    </template>
                    <template v-if="oneRow['last_sold_date']">
                      <a v-bind:href="baseUrl4Report + oneRow['fund_id']" _target="blank" style="text-decoration: none" title="看走势">
                        <span style="color:red;font-weight: bold;font-size:1.1rem;">&nbsp;&nbsp;售:&nbsp;{{ oneRow['last_sold_date'] }}
                          <template v-if="oneRow.hasOwnProperty('last_sold_days') && oneRow['last_sold_days'] != null">
                          &nbsp;|&nbsp;{{ oneRow['last_sold_days'] }}日
                          </template>
                        </span>
                      </a>
                    </template>
                  </div>
                </template>
                <div style="margin-top:8px;">
                  <template v-if="oneRow['kbObj'] && oneRow.kbObj.statistics">
                    <span v-bind:class="getCardStyle(oneRow.kbObj.statistics.day_200_thres)">&nbsp;</span>
                    <span v-bind:class="getCardStyle(oneRow.kbObj.statistics.day_300_thres)">&nbsp;</span>
                    <span v-bind:class="getCardStyle(oneRow.kbObj.statistics.day_400_thres)">&nbsp;</span>
                    <span v-bind:class="getCardStyle(oneRow.kbObj.statistics.day_500_thres)">&nbsp;</span>
                    <span v-bind:class="getCardStyle(oneRow.kbObj.statistics.day_600_thres)">&nbsp;</span>
                  </template>
                  <template v-if="oneRow.hasOwnProperty('lossFlag') && oneRow['lossFlag']">
                    <div style="display:inline-block;color:red;padding:2px;font-size:0.9rem;font-weight:bold;border:solid 1px red;border-radius:5px;margin-left:0.5rem; margin-right:0.5rem;">损</div>
                  </template>
                  <template v-if="oneRow.hasOwnProperty('show_enable_loss_btn') && oneRow['show_enable_loss_btn']">
                    <button type="button" class="btn btn-danger" style="font-size: 0.8rem;padding-left:5px;padding-right:5px;margin-right:0.5rem;"
                          @click.stop="setComposeProperty_wrapper(oneRow['fund_id'], oneRow['fund_name'], oneRow['compose_name'], -2, oneRow['buyin_source'], true)">
                          设止损</button>
                  </template>
                  <template v-if="oneRow.hasOwnProperty('show_disable_loss_btn') && oneRow['show_disable_loss_btn']">
                    <button type="button" class="btn btn-secondary" style="font-size: 0.8rem;padding-left:5px;padding-right:5px;"
                          @click.stop="setComposeProperty_wrapper(oneRow['fund_id'], oneRow['fund_name'], oneRow['compose_name'], -1, oneRow['buyin_source'], false)">
                          去止损</button>
                  </template>                  
                </div>
              </td>
              <td v-bind:class="{ sel_row: oneRow['currSelected'] }" style="line-height:1.1;">
                <div>
                  {{ oneRow?.kbObj?.statistics?.min_earn_str }}
                </div>
                <div>
                  {{ oneRow?.kbObj?.statistics?.min_earn_aux_str }}
                </div>
                <div>
                  {{ oneRow?.kbObj?.statistics?.min_earn_tri_str }}
                </div>
                <template v-if="oneRow.hasOwnProperty('quant_obj') && oneRow['quant_obj'] != null &&
                 oneRow['quant_obj'].hasOwnProperty('histo') && oneRow['quant_obj']['histo'] != null">
                  <div style="height: 1px; border-top:solid 1px darkgray; margin: 5px 0 5px 0;"></div>
                  <div style="height:5rem;line-height:1.1;position:relative;--tooltip-left:-3rem;--tooltip-top:-2rem;"
                  data-title="短时行情波动情况" data-float-no-pos="">
                    <div style="font-weight: bold; color: red;font-size: 0.9rem;">
                      启{{ oneRow['quant_obj']['histo']['max_hitted_times'] }}
                    </div>
                    <div style="font-weight: bold; color: darkgreen;font-size: 0.9rem;margin-top:0.1rem;">
                      停{{ oneRow['quant_obj']['histo']['min_hitted_times'] }}
                    </div>
                    <template v-if="latest_sold_stat_obj && latest_sold_stat_obj[oneRow['fund_id']]">
                      <div style="letter-spacing:-1;margin-top:0.5rem;font-size:0.9rem;text-wrap:nowrap;">
                        卖{{latest_sold_stat_obj[oneRow['fund_id']]['days_from_last_sold']}}日
                      </div>
                      <div :style="{
                      'color': latest_sold_stat_obj[oneRow['fund_id']]['rate_from_last_sold'] >= 0? 'red': 'darkgreen',
                      'font-weight': 'bold'}">
                        {{latest_sold_stat_obj[oneRow['fund_id']]['rate_from_last_sold_str']}}
                      </div>
                    </template>
                  </div>                 
                </template>
                <template v-else>
                  <div style="height: 1px; border-top:solid 1px darkgray; margin: 5px 0 5px 0;"></div>
                  <div style="height: 5rem;">
                    <div style="font-weight: bold; color: darkgreen;font-size: 0.9rem;">&nbsp;</div>
                    <div style="font-weight: bold; color: darkgreen;font-size: 0.9rem;">&nbsp;</div>
                    <template v-if="latest_sold_stat_obj && latest_sold_stat_obj[oneRow['fund_id']]">
                      <template v-if="latest_sold_stat_obj[oneRow['fund_id']]['days_from_last_sold']">
                        <div style="letter-spacing:-1;margin-top:0.5rem;font-size:0.9rem;text-wrap:nowrap;">
                          卖{{latest_sold_stat_obj[oneRow['fund_id']]['days_from_last_sold']}}日
                        </div>
                      </template>
                      <div :style="{
                      'color': latest_sold_stat_obj[oneRow['fund_id']]['rate_from_last_sold'] >= 0? 'red': 'darkgreen',
                      'font-weight': 'bold'}">
                        {{latest_sold_stat_obj[oneRow['fund_id']]['rate_from_last_sold_str']}}
                      </div>
                    </template>
                  </div>
                </template>
              </td>
              <td v-bind:class="{ sel_row: oneRow['currSelected'] }" style="line-height:1.1;">
                <div>
                  {{ oneRow?.kbObj?.statistics?.avg_earn_str }}
                </div>
                <div>
                  {{ oneRow?.kbObj?.statistics?.avg_earn_aux_str }}
                </div>
                <div>
                  {{ oneRow?.kbObj?.statistics?.avg_earn_tri_str }}
                </div>
                <template v-if="oneRow.hasOwnProperty('quant_obj') && oneRow['quant_obj'] != null &&
                 oneRow['quant_obj'].hasOwnProperty('histo') && oneRow['quant_obj']['histo'] != null &&
                 oneRow['quant_obj']['histo'].hasOwnProperty('latest_hitted_obj') && 
                 oneRow['quant_obj']['histo']['latest_hitted_obj'] != null &&
                 oneRow['quant_obj']['histo']['latest_hitted_obj']['max_hitted'] && 
                 !oneRow['quant_obj']['histo']['latest_hitted_obj']['same_as_today']">        
                  <div style="height: 1px; border-top:solid 1px darkgray; margin: 5px 0 5px 0;"></div>
                  <div style="height: 5rem;">
                    <a v-bind:href="baseUrl4ProbeNav + oneRow['fund_id'] + '&cust_fund_name=' + oneRow['fund_name'] + '&cust_buyin_type=' + 'fixed_buyin_append'" 
                      target="_blank" style="cursor: pointer; text-decoration: none;">
                      <div style="position: relative; text-align: center; color: darkgreen; height: 1.2rem;--tooltip-left:-3rem;--tooltip-top:-2rem;"
                      data-title="若高点明显则不应追加" data-float-no-pos="">
                        <span class="icon_pos_left" style="color:red;top:-5px; left:1rem;">
                          <div>
                            <i class="bi bi-arrow-up-circle-fill"></i>
                          </div>
                        </span>
                      </div>
                      <div style="height: 1.8em; position: relative; text-align: center; color: red;--tooltip-left:-3rem;--tooltip-top:-2rem;"
                      data-title="若高点明显则不应追加" data-float-no-pos="">
                        <div style="line-height: 0.9; font-size: 0.8rem;">
                          <div style="font-size:0.9rem;font-weight: bold;">
                            {{ oneRow['quant_obj']['histo']['latest_hitted_obj']['rate_str'] }}
                          </div>
                          <div style="font-size:0.9rem;font-weight: bold;border-top: solid 2px darkgrey;">
                            {{ oneRow['quant_obj']['histo']['latest_hitted_obj']['max_str'] }}
                          </div>
                        </div>
                      </div>
                      <div 
                      style="text-align: center; color: red; font-size: 0.9rem;font-weight: bold;position: relative;--tooltip-left:-10rem;--tooltip-top:-2rem;"
                      :style="{
                        'text-decoration': oneRow['quant_obj']['histo']['latest_hitted_obj']['distance_days']>10? 'line-through': 'none'
                      }"
                      data-title="启动信号越小越不应该停止,大于10个交易日逐步失效" data-float-no-pos="">
                        {{ oneRow['quant_obj']['histo']['latest_hitted_obj']['distance_days'] }}日
                      </div>
                    </a>
                  </div>
                </template>
                <template v-else-if="oneRow.hasOwnProperty('quant_obj') && oneRow['quant_obj'] != null &&
                 oneRow['quant_obj'].hasOwnProperty('histo') && oneRow['quant_obj']['histo'] != null &&
                 oneRow['quant_obj']['histo'].hasOwnProperty('latest_hitted_obj') && 
                 oneRow['quant_obj']['histo']['latest_hitted_obj'] != null &&
                 oneRow['quant_obj']['histo']['latest_hitted_obj']['min_hitted'] &&
                 !oneRow['quant_obj']['histo']['latest_hitted_obj']['same_as_today']">
                  <div style="height: 1px; border-top:solid 1px darkgray; margin: 5px 0 5px 0;"></div>
                  <div style="height: 5rem;">
                    <div style="position: relative; text-align: center; color: darkgreen; height: 1.2rem;--tooltip-left:-3rem;--tooltip-top:-2rem;"
                    data-title="若低点明显则不应减少" data-float-no-pos="">
                      <span class="icon_pos_left" style="color: darkgreen; top:-5px; left:1rem;">
                        <div>
                          <i class="bi bi-arrow-down-circle-fill"></i>
                        </div>
                      </span>
                    </div>
                    <div style="height: 1.8em; text-align: center; color: darkgreen;">
                      <div style="line-height: 0.9; font-size: 0.9rem;position:relative;--tooltip-left:-3rem;--tooltip-top:-2rem;" 
                      data-title="若低点明显则不应减少" data-float-no-pos="">
                        <div style="font-size: 0.9rem; font-weight: bold;">
                          {{ oneRow['quant_obj']['histo']['latest_hitted_obj']['rate_str'] }}
                        </div>
                        <div style="border-top: solid 2px darkgrey; font-size: 0.9rem;font-weight: bold;">
                          {{ oneRow['quant_obj']['histo']['latest_hitted_obj']['min_str'] }}
                        </div>
                      </div>
                    </div>
                    <div 
                    style="text-align: center; color: darkgreen; font-size: 0.9rem;font-weight: bold;position: relative;--tooltip-left:-10rem;--tooltip-top:-2rem;"
                    :style="{
                        'text-decoration': oneRow['quant_obj']['histo']['latest_hitted_obj']['distance_days']>5? 'line-through':'none'
                      }"
                      data-title="停止信号越小越不应该启动,大于5个交易日逐步失效" data-float-no-pos="">
                        {{ oneRow['quant_obj']['histo']['latest_hitted_obj']['distance_days'] }}日
                      </div>                    
                  </div>
                </template>
                <template v-else>
                  <div style="height: 1px; border-top:solid 1px darkgray; margin: 5px 0 5px 0;"></div>
                  <div style="height: 5rem;">
                    <div style="font-weight: bold; color: darkgreen;font-size: 0.9rem;">&nbsp;</div>
                    <div style="font-weight: bold; color: darkgreen;font-size: 0.9rem;">&nbsp;</div>
                  </div>
                </template>
              </td>
              <td v-bind:class="{ sel_row: oneRow['currSelected'] }" style="line-height:1.1;">
                <div>
                  {{ oneRow?.kbObj?.statistics?.max_earn_str }}
                </div>
                <div>
                  {{ oneRow?.kbObj?.statistics?.max_earn_aux_str }}
                </div>
                <div>
                  {{ oneRow?.kbObj?.statistics?.max_earn_tri_str }}
                </div>
                <template v-if="true">
                  <div style="height: 1px; border-top:solid 1px darkgray; margin: 5px 0 5px 0;"></div>
                  <div style="height: 5rem;">
                    <div style="font-weight: bold; color: darkgreen;font-size: 0.9rem;">&nbsp;</div>
                    <div style="font-weight: bold; color: darkgreen;font-size: 0.9rem;">&nbsp;</div>
                  </div>
                </template>
              </td>
              <td v-bind:class="{ sel_row: oneRow['currSelected'] }" style="padding-left: 2px !important; padding-right: 2px !important;">
                <template v-if="oneRow['kbObj'] && oneRow.kbObj.positive">
                  <div style="height: 1.8em; position: relative; text-align: center;"
                    v-bind:class="getPosColor(oneRow.kbObj.positive.positive_reach_len)">
                    <template v-if="oneRow.hasOwnProperty('quant_obj') && oneRow['quant_obj']['max_hitted']">
                      <a v-bind:href="baseUrl4ProbeNav + oneRow['fund_id'] + '&cust_fund_name=' + oneRow['fund_name'] + '&cust_buyin_type=' + 'fixed_buyin_append'" 
                      target="_blank" style="cursor: pointer; text-decoration: none;--tooltip-left:-3rem;--tooltip-top:-2rem;"
                      data-title="若高点明显则不应追加" data-float-no-pos="">
                        <span class="icon_pos_left" style="color: red;">
                          <i class="bi bi-arrow-up-circle-fill"></i>
                          <div style="" class="icon_tri">
                            <div>{{ oneRow['quant_obj']['rate_str'] }}</div>
                            <div style="border-top: solid 2px darkgrey;">{{ oneRow['quant_obj']['max_str'] }}</div>
                          </div>
                        </span>
                      </a>
                    </template>
                    <span v-if="oneRow.kbObj.positive.positive_reach_len >= 4" class="icon_pos_right">
                      <i class="bi bi-arrow-up-circle-fill"></i>
                      <span class="lv_font">{{ oneRow.kbObj.positive.positive_reach_len }}</span>
                    </span>
                  </div>
                  <div style="height: 1.8em; position: relative; text-align: center;"
                    v-bind:class="getNegColor(oneRow.kbObj.negative.negative_reach_len)">
                    <template v-if="oneRow.hasOwnProperty('quant_obj') && oneRow['quant_obj']['min_hitted']">
                      <a v-bind:href="baseUrl4ProbeNav + oneRow['fund_id'] + '&cust_fund_name=' + oneRow['fund_name'] + '&cust_buyin_type=' + 'fixed_buyin_append'" 
                      target="_blank" style="cursor: pointer; text-decoration: none;--tooltip-left:-3rem;--tooltip-top:-2rem;"
                      data-title="若低点明显则不应减少" data-float-no-pos="">
                        <span class="icon_pos_left" style="color: darkgreen;">
                          <i class="bi bi-arrow-down-circle-fill"></i>
                          <div style="" class="icon_tri">
                            <div>{{ oneRow['quant_obj']['rate_str'] }}</div>
                            <div style="border-top: solid 2px darkgrey;">{{ oneRow['quant_obj']['min_str'] }}</div>
                          </div>
                        </span>
                      </a>
                    </template>
                    <span v-if="oneRow.kbObj.negative.negative_reach_len >= 3" class="icon_pos_right">
                      <i class="bi bi-arrow-down-circle-fill"></i>
                      <span class="lv_font">{{ oneRow.kbObj.negative.negative_reach_len }}</span>
                    </span>
                  </div>
                  <template v-if="oneRow['kbObj'].hasOwnProperty('p50_convg_dur_rank')">
                    <div style="height: 3em; margin-top: 0.4rem; border-top: solid 1px darkgray; padding-left: 1rem;">
                      <div style="font-size: 0.9rem; ">P50:&nbsp;{{ oneRow['kbObj']['p50_convg_dur_rank'] }}</div>
                      <div style="font-size: 0.9rem; margin-top: -6px;">P65:&nbsp;{{ oneRow['kbObj']['p65_convg_dur_rank']
                      }}</div>
                      <div style="font-size: 0.9rem; margin-top: -6px;">P80:&nbsp;{{ oneRow['kbObj']['p80_convg_dur_rank']
                      }}</div>
                    </div>
                  </template>
                  <template v-else>
                    <div style="height: 3em; position: relative;">
                    </div>
                  </template>
                </template>
              </td>
              <td style="text-align: center;" v-bind:class="{ sel_row: oneRow['currSelected'] }">
                <template v-if="oneRow['kbObj'] && oneRow.kbObj.positive">
                  <div style="height:1.8em;">
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
                  <div style="height:1.8em;margin-top:5px;">
                    <span v-bind:class="getHitStyle(oneRow.kbObj.negative.day_5_negative_reach, false)">&nbsp;</span>
                    <span v-bind:class="getHitStyle(oneRow.kbObj.negative.day_10_negative_reach, false)">&nbsp;</span>
                    <span v-bind:class="getHitStyle(oneRow.kbObj.negative.day_20_negative_reach, false)">&nbsp;</span>
                    <span v-bind:class="getHitStyle(oneRow.kbObj.negative.day_60_negative_reach, false)">&nbsp;</span>
                    <span v-bind:class="getHitStyle(oneRow.kbObj.negative.day_90_negative_reach, false)">&nbsp;</span>
                    <span v-bind:class="getHitStyle(oneRow.kbObj.negative.day_120_negative_reach, false)">&nbsp;</span>
                    <span v-bind:class="getHitStyle(oneRow.kbObj.negative.day_160_negative_reach, false)">&nbsp;</span>
                    <template v-if="oneRow.kbObj.negative.hasOwnProperty('day_200_negative_reach', false)">
                      <span v-bind:class="getHitStyle(oneRow.kbObj.negative.day_200_negative_reach, false)">&nbsp;</span>
                    </template>
                    <template v-else>
                      <span v-bind:class="getHitStyle(oneRow.kbObj.negative.day_220_negative_reach, false)">&nbsp;</span>
                    </template>
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
                </template>
              </td>
              <td style="line-height: 1.6;" v-bind:class="{ sel_row: oneRow['currSelected'] }">
                <template v-if="oneRow['kbObj']">
                  <div @click.stop="suggestCompose4Ui($event, oneRow)"
                       style="cursor: pointer; margin-bottom: 0.3rem; text-decoration: underline;color:darkgreen;font-weight: bold;">
                    速决策(^q)
                  </div>
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
                        :style="{ color: (accu_pure_profit >= 0 ? 'red' : 'darkgreen'), 'font-weight': 'bold' }">
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
                        :style="{ color: (accu_pure_profit >= 0 ? 'red' : 'darkgreen'), 'font-weight': 'bold' }">
                        {{ accu_pure_percent_str }}
                      </span>
                    </template>
                  </div>
                </template>
                <template v-if="oneRow.hasOwnProperty('money') && oneRow['money'] > 0 && (!buyout_future_objs.hasOwnProperty(oneRow['fund_id']) || !buyout_future_objs[oneRow['fund_id']])">
                  <button type="button" class="btn btn-secondary" style="font-size: 0.8rem; margin-right: 0.5rem;padding-left:5px;padding-right:5px"
                          @click.stop="removeFixedFund4TodayUi(oneRow['fund_id'], oneRow['fund_name'], oneRow)">
                    撤今日
                  </button>
                </template>
                <template v-else-if="oneRow.hasOwnProperty('money') && oneRow['money'] > 0 && (buyout_future_objs.hasOwnProperty(oneRow['fund_id']) && buyout_future_objs[oneRow['fund_id']] != null)">
                  <span class="badge bg-success text-bg-success big_badge" style="margin-right: 0.5rem;padding-left:5px;padding-right:5px">
                    已撤
                  </span>
                </template>
                <button type="button" class="btn btn-primary" style="font-size: 0.8rem;padding-left:5px;padding-right:5px;"
                        @click.stop="switchWriteNote(oneRow)">
                  笔记<template v-if="noteObjs && noteObjs[oneRow['fund_id']] && noteObjs[oneRow['fund_id']]['note_objs'] && noteObjs[oneRow['fund_id']]['note_objs'].length > 0">
                    ({{noteObjs[oneRow['fund_id']]['note_objs'].length}})
                  </template>
                </button>
              </td>
              <td style="line-height: 2rem;" v-bind:class="{ sel_row: oneRow['currSelected'] }">
                <div style="display:flex;align-items:center;">
                  <span style="text-wrap:nowrap;">账户:&nbsp;&nbsp;</span>
                  <select class="form-select nr_select" @click.stop v-model="oneRow['buyin_source']" 
                  :style="{
                  'color': oneRow['buyin_source'] === 'jd'? 'blue': 
                           oneRow['buyin_source'] === 'tt'? 'chocolate':
                           oneRow['buyin_source'] === 'ths'? 'deeppink':
                           oneRow['buyin_source'] === 'zfb'? 'purple':
                           oneRow['buyin_source'] === 'gt'? 'indigo':
                           oneRow['buyin_source'] === 'wx'? 'olive':
                           oneRow['buyin_source'] === 'zs'? 'crimson': 'red',
                  'border-color': oneRow['buyin_source'] === 'jd'? 'blue': 
                           oneRow['buyin_source'] === 'tt'? 'chocolate':
                           oneRow['buyin_source'] === 'ths'? 'deeppink':
                           oneRow['buyin_source'] === 'zfb'? 'purple':
                           oneRow['buyin_source'] === 'gt'? 'indigo':
                           oneRow['buyin_source'] === 'wx'? 'olive':
                           oneRow['buyin_source'] === 'zs'? 'crimson': 'red',
                  'max-width': '6.2rem'}">
                    <option v-for="option in buy_in_sources_options" v-bind:value="option.source_val">
                      {{ option.source_name }}
                    </option>
                  </select>
                </div>                 
                <template v-if="oneRow.hasOwnProperty('plan_buyin_money')">
                  <div :style="{'color': oneRow['plan_buyin_money'] - oneRow['money'] >=10? '#f96' : 
                    oneRow['money'] - oneRow['plan_buyin_money'] >=10? 'red' : '',
                    'font-weight': Math.abs(oneRow['plan_buyin_money'] - oneRow['money']) >=10? 'bold': 'normal'}"
                    style="height: 1.8rem;">
                    初始:&nbsp;&nbsp;{{ oneRow['plan_buyin_money'] }}
                  </div>
                </template>
                <template v-else>
                  <div style="height:0.5rem;"></div>  
                </template>
                <div style="height: 1.8rem;">
                  当前:&nbsp;
                  <input type="number" style="width: 4rem; border-radius: 5px;" v-model="oneRow['money']" @click.stop>
                </div>
                <div style="height: 1.8rem;">
                  决策:&nbsp;&nbsp;{{ oneRow['adjust_money'] }}
                  <template v-if="oneRow['adjust_money']">
                    <span class="red_card less_height" v-if="oneRow['money'] - oneRow['adjust_money'] >= 5">&nbsp;</span><!--
                    --><span class="darkgolden_card less_height"
                      v-if="oneRow['adjust_money'] - oneRow['money'] >= 5">&nbsp;</span><!--
                    --><span class="red_card less_height"
                      v-if="oneRow['money'] - oneRow['adjust_money'] >= 10">&nbsp;</span><!--
                    --><span class="darkgolden_card less_height"
                      v-if="oneRow['adjust_money'] - oneRow['money'] >= 10">&nbsp;</span><!--
                    --><span class="red_card less_height"
                      v-if="oneRow['money'] - oneRow['adjust_money'] >= 15">&nbsp;</span><!--
                    --><span class="darkgolden_card less_height"
                      v-if="oneRow['adjust_money'] - oneRow['money'] >= 15">&nbsp;</span><!--
                    --><span class="red_card less_height"
                      v-if="oneRow['money'] - oneRow['adjust_money'] >= 20">&nbsp;</span><!--
                    --><span class="darkgolden_card less_height"
                      v-if="oneRow['adjust_money'] - oneRow['money'] >= 20">&nbsp;</span>
                    <template v-if="false">
                      <!--
                      --><span class="red_card less_height"
                        v-if="oneRow['money'] - oneRow['adjust_money'] >= 25">&nbsp;</span><!--
                      --><span class="darkgolden_card less_height"
                        v-if="oneRow['adjust_money'] - oneRow['money'] >= 25">&nbsp;</span><!--
                      --><span class="red_card less_height"
                        v-if="oneRow['money'] - oneRow['adjust_money'] >= 30">&nbsp;</span><!--
                      --><span class="darkgolden_card less_height"
                        v-if="oneRow['adjust_money'] - oneRow['money'] >= 30">&nbsp;</span><!--
                      --><span class="red_card less_height"
                        v-if="oneRow['money'] - oneRow['adjust_money'] >= 35">&nbsp;</span><!--
                      --><span class="darkgolden_card less_height"
                        v-if="oneRow['adjust_money'] - oneRow['money'] >= 35">&nbsp;</span><!--
                      --><span class="red_card less_height"
                        v-if="oneRow['money'] - oneRow['adjust_money'] >= 40">&nbsp;</span><!--
                      --><span class="darkgolden_card less_height"
                        v-if="oneRow['adjust_money'] - oneRow['money'] >= 40">&nbsp;</span>
                    </template>
                  </template>
                </div>
                <div style="height: 1.8rem;text-wrap:nowrap;">
                  <span style="font-size: 1rem; font-style: italic;text-decoration: underline;">{{
                    oneRow['last_adjust_money_date'] }}</span>&nbsp;
                  <input class="btn btn-outline-danger btn-sm" style="width:3.5rem;" type="button" value="保存"
                    @click.stop="setComposeProperty_wrapper(oneRow['fund_id'], oneRow['fund_name'], oneRow['compose_name'], parseInt(oneRow['money']), oneRow['buyin_source'], oneRow['lossFlag'])">
                </div>
              </td>
              <td style="text-align: center;" v-bind:class="{ sel_row: oneRow['currSelected'] }">
                <template v-if="contStartStopObj.hasOwnProperty(oneRow['fund_id']) && contStartStopObj[oneRow['fund_id']]['start_stop_obj'] && contStartStopObj[oneRow['fund_id']]['start_stop_obj']['cont_stop_flag']">
                  <div style="color: darkgreen; text-decoration: none;">
                    <span style="font-weight: bold; text-decoration: none;position: relative;--tooltip-left:-8rem;--tooltip-top:-2rem;"
                    data-title="若连停小于10交易日则不宜启动" data-float-no-pos="">
                      连停&nbsp;
                      <template v-if="oneRow.hasOwnProperty('money') && oneRow['money'] > 0">
                        <span style="font-weight:bold;">刚启动</span>
                      </template>
                      <template v-else>
                        <span :style="{
                          'font-size':
                          contStartStopObj[oneRow['fund_id']]['start_stop_obj']['stop_days'] >= 30? '1.3rem':
                          contStartStopObj[oneRow['fund_id']]['start_stop_obj']['stop_days'] >= 20? '1.2rem':
                          contStartStopObj[oneRow['fund_id']]['start_stop_obj']['stop_days'] >= 10? '1.1rem': '1rem',
                          'font-weight':
                          contStartStopObj[oneRow['fund_id']]['start_stop_obj']['stop_days'] >= 10? 'bold': 'normal',
                          'text-decoration':
                          contStartStopObj[oneRow['fund_id']]['start_stop_obj']['stop_days'] >= 10? 'none': 'line-through'
                        }">
                        {{contStartStopObj[oneRow['fund_id']]['start_stop_obj']['stop_days']}}日
                        </span>
                      </template>
                    </span>
                  </div>
                </template>
                <template v-if="contStartStopObj.hasOwnProperty(oneRow['fund_id']) && contStartStopObj[oneRow['fund_id']]['start_stop_obj'] && contStartStopObj[oneRow['fund_id']]['start_stop_obj']['cont_start_flag']">
                  <div style="color: red; text-decoration: none;">
                    <span style="font-weight: bold; text-decoration: none;position: relative;--tooltip-left:-8rem;--tooltip-top:-2rem;"
                    data-title="若连购小于20交易日则不宜停止" data-float-no-pos="">
                      连购&nbsp;
                      <template v-if="oneRow.hasOwnProperty('money') && oneRow['money'] < 0">
                        <span style="font-weight:bold;">刚停止</span>
                      </template>
                      <template v-else>
                        <span :style="{
                          'font-size':
                          contStartStopObj[oneRow['fund_id']]['start_stop_obj']['start_days'] >= 60? '1.3rem':
                          contStartStopObj[oneRow['fund_id']]['start_stop_obj']['start_days'] >= 40? '1.2rem':
                          contStartStopObj[oneRow['fund_id']]['start_stop_obj']['start_days'] >= 20? '1.1rem': '1rem',
                          'font-weight':
                          contStartStopObj[oneRow['fund_id']]['start_stop_obj']['start_days'] >= 20? 'bold': 'normal',
                          'text-decoration':
                          contStartStopObj[oneRow['fund_id']]['start_stop_obj']['start_days'] >= 20? 'none': 'line-through'
                        }">
                        {{contStartStopObj[oneRow['fund_id']]['start_stop_obj']['start_days']}}日
                        </span>
                      </template>
                    </span>
                  </div>
                </template>
                <template v-if="true"> <!-- v-if="oneRow.hasOwnProperty('last_pause_days') && oneRow['last_pause_days'] >= 5" -->
                  <a v-bind:href="baseUrl4Report + oneRow['fund_id']" _target="blank" style="display:inline-block;height:3rem;line-height:3;color:red;">
                    <span style="line-height: 3;">看走势</span>
                  </a>
                  <br>
                </template>
                <template v-if="oneRow['fixedHoldObj'] && oneRow['fixedHoldObj']['hold_objs'] && oneRow['fixedHoldObj']['hold_objs'].length > 0">
                  <button type="button" class="btn"
                    :class="{ 'btn-primary': !oneRow['fixedHoldObj']['disp_flag'], 'btn-secondary': oneRow['fixedHoldObj']['disp_flag'] }"
                    @click.stop="oneRow['fixedHoldObj']['disp_flag'] = !oneRow['fixedHoldObj']['disp_flag'];">
                    <template v-if="!oneRow['fixedHoldObj']['disp_flag']">展开</template>
                    <template v-else>折叠</template>
                  </button>
                  <br>
                </template>
                <template v-else>
                  <button type="button" class="btn btn-warning" @click.stop="removeCompose4Ui($event, oneRow)">
                    移除
                  </button>
                  <br>
                </template>

              </td>
            </tr>
            <tr v-if="oneRow['show_wav']">
              <td colspan="9" style="background-color: lightblue;">
                <img v-bind:src="'../wav-report/' + oneRow['fund_id'] + '.png'"
                  style="width: 100%; height: 100%; max-width: 100%;" class="img-fluid" alt="Responsive image">
              </td>
            </tr>
            <tr v-if="oneRow['show_write_note']">
              <td colspan="9" style="background-color: lightblue;">
                <div style="display: flex;flex-direction: row;flex-wrap: nowrap;column-gap: 0.5rem;align-items: center;">
                  <div style="display: inline-block;">日期:</div>
                  <input type="text" class=""
                         style="display: inline-block;border-radius:5px;border-width: 0;outline:none;width:6.5rem;"
                         v-model="oneRow['write_note_date']">
                  <div style="display: inline-block;">盈利:</div>
                  <input type="text" class=""
                         style="display: inline-block;border-radius:5px;border-width: 0;outline:none;width:4rem;"
                         v-model="oneRow['write_note_perc']">
                  <div style="display: inline-block;">日记:</div>
                  <input type="text" class=""
                         style="display: inline-block;border-radius:5px;border-width: 0;outline:none;flex-grow:0.9;"
                         v-model="oneRow['write_note_comments']">
                  <button type="button" class="btn btn-warning"
                          style="font-size:0.9rem;display:inline-block;width:6rem;"
                          v-bind:disabled="
                          (!oneRow['write_note_date'] || oneRow['write_note_date'].trim() == '')
                       || (
                           (!oneRow['write_note_perc'] || oneRow['write_note_perc'].trim() == '')
                           &&(!oneRow['write_note_comments'] || oneRow['write_note_comments'].trim() == '')
                          )
                       || (oneRow['write_note_perc'].trim() != ''
                           && oneRow['write_note_perc'].indexOf('%') == -1
                          )
                          "
                          @click="updateFundNotes(oneRow);">
                    保存
                  </button>
                  <button type="button" class="btn btn-danger"
                          style="font-size:0.9rem;display:inline-block;width:6rem;"
                          v-bind:disabled="!oneRow['write_note_date'] || oneRow['write_note_date'].trim() == ''"
                          @click="removeFundNotes(oneRow);">
                    删除
                  </button>
                  <template v-if="oneRow['note_objs'].length > 0">
                    <div style="display:inline-block;flex-grow:0.1;color:darkgreen;">共({{oneRow['note_objs'].length}})条</div>
                    <button type="button" class="btn btn-secondary"
                            style="font-size:0.8rem;display:inline-block;width:4rem;"
                            v-bind:disabled="oneRow['curr_note_idx'] <= 0"
                            @click="navigateNote(oneRow, true)">
                      前向
                    </button>
                    <button type="button" class="btn btn-secondary"
                            style="font-size:0.8rem;display:inline-block;width:4rem;"
                            v-bind:disabled="oneRow['curr_note_idx'] >= oneRow['note_objs'].length - 1"
                            @click="navigateNote(oneRow, false)">
                      后向
                    </button>
                  </template>
                </div>
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
                        <tr
                          :set="cust_color = (one_hold_obj['accu_pure_percent'] < 0 ? 'darkgreen' : (one_hold_obj['accu_pure_percent'] < 1 ? 'darkgrey' : 'red'))">
                          <td :style="{ color: cust_color, 'text-align': 'center' }">
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
                          <td :style="{ color: cust_color }">
                            {{ one_hold_obj['dateStr'] }}
                          </td>
                          <td :style="{ color: cust_color }">
                            至:&nbsp;{{ one_hold_obj['lastPriceDateStr'] }}
                          </td>
                          <td :style="{ color: cust_color }">
                            {{ one_hold_obj['distance'] }}日
                          </td>
                          <td :style="{ color: cust_color }">
                            金额:&nbsp;{{ one_hold_obj['accu_money'] }}
                          </td>
                          <td :style="{ color: cust_color }">
                            份额:&nbsp;{{ one_hold_obj['accu_pure_amount'] }}
                          </td>
                          <td :style="{ color: cust_color }">
                            盈:&nbsp;{{ one_hold_obj['accu_pure_profit'] }}
                          </td>
                          <td :style="{ color: cust_color }">
                            合:&nbsp;
                            <span :class="{ 'circle_border': one_hold_obj['max_pole'] }">
                              {{ one_hold_obj['accu_pure_percent_str'] }}
                            </span>
                          </td>
                          <td :style="{ color: cust_color }">
                            <div>
                              <span style="">单:&nbsp;</span><!--
                              --><span style="">{{ one_hold_obj['pure_percent_str'] }}</span>
                            </div>
                            <div v-if="one_hold_obj['has_thresh_flag']">
                              <span v-if="one_hold_obj['max_earn_yr1_flag']" class="purple_card standard_height">&nbsp;</span><!--
                          --><span v-if="one_hold_obj['avg_earn_yr1_flag']" class="red_card standard_height">&nbsp;</span><!--
                          --><span v-if="!one_hold_obj['max_earn_yr1_flag'] && !one_hold_obj['avg_earn_yr1_flag']"
                                class="white_card standard_height">&nbsp;</span><!--
                          --><span v-if="one_hold_obj['max_earn_yr2_flag']" class="purple_card standard_height">&nbsp;</span><!--
                          --><span v-if="one_hold_obj['avg_earn_yr2_flag']" class="red_card standard_height">&nbsp;</span><!--
                          --><span v-if="!one_hold_obj['max_earn_yr2_flag'] && !one_hold_obj['avg_earn_yr2_flag']"
                                class="white_card standard_height">&nbsp;</span><!--
                          --><span v-if="one_hold_obj['max_earn_yr3_flag']" class="purple_card standard_height">&nbsp;</span><!--
                          --><span v-if="one_hold_obj['avg_earn_yr3_flag']" class="red_card standard_height">&nbsp;</span><!--
                          --><span v-if="!one_hold_obj['max_earn_yr3_flag'] && !one_hold_obj['avg_earn_yr3_flag']"
                                class="white_card standard_height">&nbsp;</span>
                            </div>
                          </td>
                          <td :style="{ color: cust_color }">
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
                                @click="removeFixedFundUi(oneRow['fund_id'], oneRow['fund_name'], one_hold_obj, oneRow)">
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
        <tr style="line-height: 5rem; border-color: white;height:5rem;">
          <td colspan="9" style="padding:0 !important;vertical-align:top !important;">
            <div style="background-color: cornsilk;padding:0px !important;display:none;">
              <div style="text-decoration: underline;line-height:1.8;padding: 5px 5px 5px 1rem;background-color:chocolate;color:white;">自定义加入组合</div>
              <div style="display:flex;flex-direction:row;column-gap:0.5rem;align-items:center;line-height:1.8;padding:5px 1rem 10px 1rem;">
                <span>ID</span>
                <input type="text" style="width: 6rem; border-radius: 5px;" v-model="custAddFundId" @click.stop>
                <span>Name</span>
                <input type="text" style="width: 6rem; border-radius: 5px; flex-grow: 0.9;" v-model="custAddFundName" @click.stop>
                <span>组合</span>
                <select class="form-select" @click.stop v-model="custAddComposeName" style="width: 5rem; flex-grow:0.05;">
                  <template v-for="option in buy_in_from_plan">
                    <template v-if="option.source_val != 'all'">
                      <option v-bind:value="option.source_val">
                        {{ option.source_name }}
                      </option>
                    </template>
                  </template>
                </select>
                <span>金额</span>
                <input type="number" style="width: 4rem; border-radius: 5px;" v-model="custAddMoney" @click.stop>
                <button type="button" class="btn btn-outline-danger mw4_ctl" @click.stop="custAddCompose4Ui()"
                v-bind:disabled="custAddFundId==null||custAddFundId.length != 6||custAddFundName==''||custAddComposeName==null">保存
                </button>
              </div>
            </div>
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
          <template v-if="fixed_remove_type == 'remove old'">
            <h5 class="modal-title">删除确认</h5>
          </template>
          <template v-else-if="fixed_remove_type == 'remove today'">
            <h5 class="modal-title">撤销确认</h5>
          </template>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <template v-if="fixed_remove_type == 'remove old'">
            <h6>以下将被删除: </h6>
            <h6>{{ fund_id_remove }}&nbsp;{{ fund_name_remove }}&nbsp; {{ one_hold_obj_remove?.dateStr }}</h6>
          </template>
          <template v-else-if="fixed_remove_type == 'remove today'">
            <h6>以下将被撤销: </h6>
            <h6>定投金额将会被设置为 0, 注意更新定投账户。</h6>
            <h6>{{ fund_id_remove }}&nbsp;{{ fund_name_remove }}</h6>
          </template>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
          <button type="button" class="btn btn-primary" @click.prevent="removeFixedFund()">卖出
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal fade" id="removeComposeDialog" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">移出确认</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <h6>以下将被移出: </h6>
          <template v-if="toBeRemoveFundFromCompose">
            <h6>{{ toBeRemoveFundFromCompose['fund_name'] }}&nbsp;移出:&nbsp;{{ toBeRemoveFundFromCompose['compose_name'] }}</h6>
          </template>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
          <button type="button" class="btn btn-warning" @click.prevent="removeCompose()">移出
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal fade" id="suggComposeDialog" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">操作建议</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <template v-if="toBeSuggestCompose">
            <h6>{{toBeSuggestCompose['fund_id']}}&nbsp;{{ toBeSuggestCompose['fund_name'] }}</h6>
            <template v-for="one_sugg in totSuggObjs">
              <div>
                <div style="display: inline-block; width: 10rem;font-weight: bold;color: chocolate;">
                  {{one_sugg['sugg_key']}}
                </div>
                <div style="display: inline-block;color: red;font-weight: bold;">
                  {{one_sugg['sugg_val']}}
                </div>
              </div>
            </template>
          </template>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-warning" @click.prevent="hideSuggUi()">确认
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal fade" id="custAddComposeDialog" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">加入确认</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <h6>以下将被加入进组合: </h6>
          <div>ID: {{custAddFundId}}</div>
          <div>Name: {{custAddFundName}}</div>
          <div>组合：{{custAddComposeName}}</div>
          <div>Money：{{custAddMoney}}</div>
          <template v-if="custAddError != ''">
          <div style="color:red;font-weight:bold;">错误：{{custAddError}}</div>
          </template>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click.prevent="cancelCustAddCompose()">取消</button>
          <button type="button" class="btn btn-warning" @click.prevent="custAddComposeLogic()">加入
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
  get_suggestion_by_wav, getTodayStr
} from "../lib/commonUtils.js"
import {onMounted, computed, ref, watch, nextTick, onUnmounted, onActivated, onDeactivated} from "vue";
import { storeToRefs } from 'pinia'
import { useComposeStore } from "../store/composeStore.js";
import { useZskbStore } from "../store/zskbStore.js"
import { Modal } from "bootstrap";
import { useBuyInOutStore } from "../store/buyInOutStore.js";
import { useReportStore } from "../store/reportStore.js";
import { useRoute } from 'vue-router'

const route = useRoute()
const composeStore = useComposeStore()
const { composeObjs, compose_name, fixedHoldObjs, fixedHoldObjs_full, totMoney, totPositiveNum, totPoleNum, totEarnMoney, totEarnRate, totSetBuy, totPlanBuy, diffBuySet, totInitBuy, noteObjs } = storeToRefs(composeStore)
const { getAllCompose, setComposeProperty, setComposeSoldDate, getComposeFixedHold, addOrRemoveCompose, getFundNotes4Edit, updateFundNotes, removeFundNotes } = composeStore
const buyInOutStore = useBuyInOutStore()
const { buyoutRecords, wav_reports, buyout_future_objs, contStartStopObj, buyOrSoldObj, fund_buy_ratio_config, curr_compose_name} = storeToRefs(buyInOutStore)
const { getAllBuyoutRecords, soldComposeFixedHold, buyOutFixedFund, calculatePlanMoney, buyOutFixedFundOfToday, getAllBuyoutFutureRecords, addBuyOrSoldNote, getBuyOrSoldNote } = buyInOutStore
const zskbStore = useZskbStore()
const { zskbObjs } = storeToRefs(zskbStore)
const reportStore = useReportStore()
const { latest_sold_stat_obj } = storeToRefs(reportStore)

const buy_in_from_plan = [
  { 'source_name': '全部', 'source_val': 'all' },
  { 'source_name': '橄榄树', 'source_val': 'ovtree' },
  { 'source_name': '飞马', 'source_val': 'flyhorse' },
  { 'source_name': '美杜莎', 'source_val': 'medusa' },    
  { 'source_name': '海豚', 'source_val': 'dolphin' },
  { 'source_name': '三叉戟', 'source_val': 'trident' },
  { 'source_name': '金毛羊', 'source_val': 'gdngoat' }
]

const buy_in_sources_options = [
  { 'source_name': '支付宝', 'source_val': 'zfb' },
  { 'source_name': '微信', 'source_val': 'wx' },
  { 'source_name': '天天', 'source_val': 'tt' },
  { 'source_name': '国泰', 'source_val': 'gt' },
  { 'source_name': '京东', 'source_val': 'jd' },
  { 'source_name': '同花顺', 'source_val': 'ths' },
  { 'source_name': '招商', 'source_val': 'zs' }
]

const colWidMap = {
  'col_1': 10,
  'col_2': 3,
  'col_3': 3,
  'col_4': 3,
  'col_5': 5,
  'col_6': 10,
  'col_7': 7,
  'col_8': 8,
  'col_9': 6.5
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

//const compose_name = ref('all')

watch([compose_name, fixedHoldObjs_full], () => {
  if (!fixedHoldObjs_full.value || fixedHoldObjs_full.value.length === 0) {
    console.warn("**** fixedHoldObjs_full is empty, compose-hold-buyin worker is inprogress?")
    return;
  }
  getComposeFixedHold(compose_name.value)
  curr_compose_name.value = compose_name.value
}, { immediate: true })

const composeViewObjs = ref([])
const show4SoldOnly = ref(false)
const showPauseOnly = ref(false)
const showAdjustOnly = ref(false)
const showPoleOnly = ref(false)
const showNoteOnly = ref(false)
const tot4SoldNum = ref(0)
const totPauseNum = ref(0)
const totAdjustNum = ref(0)
const totNoteNum = ref(0)

const tot_plan_money_gdngoat = ref(0)
const tot_set_money_gdngoat = ref(0)
const tot_plan_money_ovtree = ref(0)
const tot_set_money_ovtree = ref(0)
const tot_plan_money_flyhorse = ref(0)
const tot_set_money_flyhorse = ref(0)
const tot_plan_money_medusa = ref(0)
const tot_set_money_medusa = ref(0)
const tot_plan_money_dolphin = ref(0)
const tot_set_money_dolphin = ref(0)
const tot_plan_money_trident = ref(0)
const tot_set_money_trident = ref(0)
const pop_up_warn_timer = ref(null)
const tot_warning_msg = ref("")
const pop_up_warn_times = ref(0)
const pop_up_warn_period = ref(1000)
const page_is_displayed = ref(true)

function processLossFlag4Elem(elem) {
  if (!fund_buy_ratio_config.value) {
    return
  }
  if (!fund_buy_ratio_config.value['lossSetting'] || !fund_buy_ratio_config.value['lossSetting'][elem['compose_name']]) {
    return
  }
  let _lossSetting = fund_buy_ratio_config.value['lossSetting'][elem['compose_name']]
  if (!elem.hasOwnProperty('lossFlag')) {
    elem['lossFlag'] = false
  }

  elem['show_enable_loss_btn'] = false
  elem['show_disable_loss_btn'] = false
  elem['show_popup_msg'] = false
  elem['popup_msg'] = ''
  //oneRow['fixedHoldObj'] && oneRow['fixedHoldObj']['hold_objs'] && oneRow['fixedHoldObj']['hold_objs'].length > 0
  if (!elem['fixedHoldObj'] || !elem['fixedHoldObj']['hold_objs'] || elem['fixedHoldObj']['hold_objs'].length === 0) {
    return;
  }
  let _accu_money = elem['fixedHoldObj']['hold_objs'][elem['fixedHoldObj']['hold_objs'].length - 1]['accu_money']
  let _accu_pure_profit = elem['fixedHoldObj']['hold_objs'][elem['fixedHoldObj']['hold_objs'].length - 1]['accu_pure_percent']
  if ((_accu_money >= _lossSetting['money_h'] && _accu_pure_profit <= _lossSetting['rate_h'])
    || (_accu_money >= _lossSetting['money_m'] && _accu_pure_profit <= _lossSetting['rate_m'])
    || (_accu_money >= _lossSetting['money_l'] && _accu_pure_profit <= _lossSetting['rate_l'])) {
    // 达到 设止损 程度
    if (elem['lossFlag']) {
      // 已经 有止损标志 了，什么都不做
      console.warn(elem['compose_name'] + " " +  elem['fund_id'] + elem['fund_name'] + " already has lossFalg, do nothing")
    } else {
      elem['show_enable_loss_btn'] = true
      elem['show_popup_msg'] = true
      elem['popup_msg'] = elem['compose_name'] + " " +  elem['fund_id'] + elem['fund_name'] + "," + "需要 '设止损'"
      console.warn("$$$$ ", elem['popup_msg'])
    }
  } else {
    // 达到 去止损 程度
    if (!elem['lossFlag']) {
      // 本来就 没有止损标志，什么都不做
      //console.warn(elem['compose_name'] + " " +  elem['fund_id'] + elem['fund_name'] + " has NO lossFalg, do nothing")
    } else {
      elem['show_disable_loss_btn'] = true
      elem['show_popup_msg'] = true
      elem['popup_msg'] = elem['compose_name'] + " " +  elem['fund_id'] + elem['fund_name'] + "," + "需要 '去止损'"
      console.warn("$$$$ ", elem['popup_msg'])
    }
  }
}

watch([composeObjs, compose_name, fixedHoldObjs, buyoutRecords, noteObjs, show4SoldOnly, showPauseOnly, showAdjustOnly, showPoleOnly, showNoteOnly], () => {
  if (composeObjs && composeObjs.value && composeObjs.value.length > 0) {
    composeObjs.value.forEach(elem => {
      if (elem['compose_objs'] && elem['compose_objs'].length > 0) {
        elem['compose_objs'].forEach(_obj => {
          _obj['show_temp_quant_tip'] = false
          _obj['write_note_date'] = getTodayStr()
          _obj['write_note_perc'] = ''
          _obj['write_note_comments'] = ''
          _obj['note_objs'] = []
          _obj['curr_note_idx'] = -1
        })
      }
    })
  }
  composeViewObjs.value = []
  if (composeObjs && composeObjs.value && composeObjs.value.length > 0) {
    if (compose_name.value === 'all') {
      composeObjs.value.forEach(item => {
        if (!show4SoldOnly.value && !showPauseOnly.value && !showAdjustOnly.value && !showPoleOnly.value && !showNoteOnly.value) {
          composeViewObjs.value.push(...item['compose_objs'])
        } else {
          item['compose_objs'].forEach(_obj => {
            let _added_in = false
            if (show4SoldOnly.value) {
              if (_obj['lost_in_aggressive'] || _obj['lost_in_dtconvg'] || (_obj.hasOwnProperty('money') && _obj['money'] === -2)) {
                composeViewObjs.value.push(_obj)
                _added_in = true
              }
            }
            if (showPauseOnly.value && !_added_in) {
              if ((_obj.hasOwnProperty('money') && _obj['money'] === -1) &&
                (!_obj['lost_in_aggressive'] && !_obj['lost_in_dtconvg'])) {
                composeViewObjs.value.push(_obj)
                _added_in = true
              }
            }
            if (showAdjustOnly.value && !_added_in) {
              if (_obj.hasOwnProperty('money') && _obj.hasOwnProperty('adjust_money')) {
                if (_obj['money'] != null && _obj['adjust_money'] != null) {
                  if (Math.abs(_obj['money'] - _obj['adjust_money']) >= 3) {
                    composeViewObjs.value.push(_obj)
                    _added_in = true
                  }
                }
              }
            }
            if (showPoleOnly.value && !_added_in) {
              if (_obj.hasOwnProperty("quant_obj") && _obj['quant_obj']['hitted']) {
                composeViewObjs.value.push(_obj)
                _added_in = true
              }
            }
            if (showNoteOnly.value && !_added_in) {
              if (noteObjs.value.hasOwnProperty(_obj['fund_id']) && noteObjs.value[_obj['fund_id']].hasOwnProperty('note_objs')
                  && noteObjs.value[_obj['fund_id']]['note_objs'].length > 0) {
                composeViewObjs.value.push(_obj)
              }
            }
          })
        }
      })
    } else {
      if (!show4SoldOnly.value && !showPauseOnly.value && !showAdjustOnly.value && !showPoleOnly.value && !showNoteOnly.value) {
        composeViewObjs.value = composeObjs.value.find(item => item['compose_name'] === compose_name.value)['compose_objs']
      } else {
        let _match_composes = composeObjs.value.find(item => item['compose_name'] === compose_name.value)
        _match_composes['compose_objs'].forEach(_obj => {
          let _added_in = false
          if (show4SoldOnly.value) {
            if (_obj['lost_in_aggressive'] || _obj['lost_in_dtconvg'] || (_obj.hasOwnProperty('money') && _obj['money'] === -2)) {
              composeViewObjs.value.push(_obj)
              _added_in = true
            }
          }
          if (showPauseOnly.value && !_added_in) {
            if ((_obj.hasOwnProperty('money') && _obj['money'] === -1) &&
              (!_obj['lost_in_aggressive'] && !_obj['lost_in_dtconvg'])) {
              composeViewObjs.value.push(_obj)
              _added_in = true
            }
          }
          if (showAdjustOnly.value && !_added_in) {
            if (_obj.hasOwnProperty('money') && _obj.hasOwnProperty('adjust_money')) {
              if (_obj['money'] != null && _obj['adjust_money'] != null) {
                if (Math.abs(_obj['money'] - _obj['adjust_money']) >= 3) {
                  composeViewObjs.value.push(_obj)
                  _added_in = true
                }
              }
            }
          }
          if (showPoleOnly.value && !_added_in) {
              if (_obj.hasOwnProperty("quant_obj") && _obj['quant_obj']['hitted']) {
                composeViewObjs.value.push(_obj)
                _added_in = true
              }
          }
          if (showNoteOnly.value && !_added_in) {
            if (noteObjs.value.hasOwnProperty(_obj['fund_id']) && noteObjs.value[_obj['fund_id']].hasOwnProperty('note_objs')
                && noteObjs.value[_obj['fund_id']]['note_objs'].length > 0) {
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
  totInitBuy.value = 0
  totPositiveNum.value = 0
  tot4SoldNum.value = 0
  totPauseNum.value = 0
  totAdjustNum.value = 0
  totPoleNum.value = 0
  totNoteNum.value = 0
  tot_plan_money_gdngoat.value = 0
  tot_set_money_gdngoat.value = 0
  tot_plan_money_ovtree.value = 0
  tot_set_money_ovtree.value = 0  
  tot_plan_money_flyhorse.value = 0
  tot_set_money_flyhorse.value = 0
  tot_plan_money_medusa.value = 0
  tot_set_money_medusa.value = 0
  tot_plan_money_dolphin.value = 0
  tot_set_money_dolphin.value = 0
  tot_plan_money_trident.value = 0
  tot_set_money_trident.value = 0

  let _need_special_logic = true;
  if (show4SoldOnly.value || showPauseOnly.value || showAdjustOnly.value || showPoleOnly.value || showNoteOnly.value) {
    _need_special_logic = false;
  }

  if (composeViewObjs.value.length > 0) {

    if (_need_special_logic) {
      composeViewObjs.value.forEach(elem => {
        calculatePlanMoney('compose', elem)
      })
    }

    // 各个组合的特殊处理 --- 引入情绪周期
    let _tot_plan_money_gdngoat = 0;
    let _tot_plan_money_ovtree = 0;
    let _tot_plan_money_flyhorse = 0;    
    let _tot_plan_money_medusa = 0;
    let _tot_plan_money_dolphin = 0;
    let _tot_plan_money_trident = 0;

    let _tot_adj_money_gdngoat = 0;
    let _tot_adj_money_ovtree = 0;
    let _tot_adj_money_flyhorse = 0;    
    let _tot_adj_money_medusa = 0;
    let _tot_adj_money_dolphin = 0;
    let _tot_adj_money_trident = 0;

    composeViewObjs.value.forEach(elem => {
      if (!_need_special_logic) {
        return;
      }
      if (elem['compose_name'] === 'gdngoat') {
        if (!elem.hasOwnProperty('plan_buyin_money')) {
          console.error("elem in gdngoat has no plan_buyin_money: ", elem['fund_id']);
        } else if (elem['money'] > -2 && elem['plan_buyin_money'] > 0) {
          _tot_plan_money_gdngoat += elem['plan_buyin_money']
        }
        if (!elem.hasOwnProperty('adjust_money')) {
          console.log("elem in gdngoat has no adjust_money: ", elem['fund_id']);
        } else if (elem['money'] > -2 && elem['adjust_money'] > 0) {
          _tot_adj_money_gdngoat += elem['adjust_money']
        }        
      } else if (elem['compose_name'] === 'ovtree') {
        if (!elem.hasOwnProperty('plan_buyin_money')) {
          console.error("elem in ovtree has no plan_buyin_money: ", elem['fund_id']);
        } else if (elem['money'] > -2 && elem['plan_buyin_money'] > 0) {
          _tot_plan_money_ovtree += elem['plan_buyin_money']
        }
        if (!elem.hasOwnProperty('adjust_money')) {
          console.log("elem in ovtree has no adjust_money: ", elem['fund_id']);
        } else if (elem['money'] > -2 && elem['adjust_money'] > 0) {
          _tot_adj_money_ovtree += elem['adjust_money']
        }        
      } else if (elem['compose_name'] === 'flyhorse') {
        if (!elem.hasOwnProperty('plan_buyin_money')) {
          console.error("elem in flyhorse has no plan_buyin_money: ", elem['fund_id']);
        } else if (elem['money'] > -2 && elem['plan_buyin_money'] > 0) {
          _tot_plan_money_flyhorse += elem['plan_buyin_money']
        }
        if (!elem.hasOwnProperty('adjust_money')) {
          console.log("elem in flyhorse has no adjust_money: ", elem['fund_id']);
        } else if (elem['money'] > -2 && elem['adjust_money'] > 0) {
          _tot_adj_money_flyhorse += elem['adjust_money']
        }        
      } else if (elem['compose_name'] === 'medusa') {
        if (!elem.hasOwnProperty('plan_buyin_money')) {
          console.error("elem in medusa has no plan_buyin_money: ", elem['fund_id']);
        } else if (elem['money'] > -2 && elem['plan_buyin_money'] > 0) {
          _tot_plan_money_medusa += elem['plan_buyin_money']
        }
        if (!elem.hasOwnProperty('adjust_money')) {
          console.log("elem in medusa has no adjust_money: ", elem['fund_id']);
        } else if (elem['money'] > -2 && elem['adjust_money'] > 0) {
          _tot_adj_money_medusa += elem['adjust_money']
        }        
      } else if (elem['compose_name'] === 'dolphin') {
        if (!elem.hasOwnProperty('plan_buyin_money')) {
          console.error("elem in dolphin has no plan_buyin_money: ", elem['fund_id']);
        } else if (elem['money'] > -2 && elem['plan_buyin_money'] > 0) {
          _tot_plan_money_dolphin += elem['plan_buyin_money']
        }
        if (!elem.hasOwnProperty('adjust_money')) {
          console.log("elem in dolphin has no adjust_money: ", elem['fund_id']);
        } else if (elem['money'] > -2 && elem['adjust_money'] > 0) {
          _tot_adj_money_dolphin += elem['adjust_money']
        }        
      } else if (elem['compose_name'] === 'trident') {
        if (!elem.hasOwnProperty('plan_buyin_money')) {
          console.error("elem in trident has no plan_buyin_money: ", elem['fund_id']);
        } else if (elem['money'] > -2 && elem['plan_buyin_money'] > 0) {
          _tot_plan_money_trident += elem['plan_buyin_money']
        }
        if (!elem.hasOwnProperty('adjust_money')) {
          console.log("elem in trident has no adjust_money: ", elem['fund_id']);
        } else if (elem['money'] > -2 && elem['adjust_money'] > 0) {
          _tot_adj_money_trident += elem['adjust_money']
        }        
      }
    })

    console.log("$$$$$$ rough plan_buyin_money begin $$$$$$")
    console.log("$$$$$$ _tot_plan_money_gdngoat: ", _tot_plan_money_gdngoat, " _tot_adj_money_gdngoat: ", _tot_adj_money_gdngoat)
    console.log("$$$$$$ _tot_plan_money_ovtree: ", _tot_plan_money_ovtree, " _tot_adj_money_ovtree: ", _tot_adj_money_ovtree)
    console.log("$$$$$$ _tot_plan_money_flyhorse: ", _tot_plan_money_flyhorse, " _tot_adj_money_flyhorse: ", _tot_adj_money_flyhorse)
    console.log("$$$$$$ _tot_plan_money_medusa: ", _tot_plan_money_medusa, " _tot_adj_money_medusa: ", _tot_adj_money_medusa)
    console.log("$$$$$$ _tot_plan_money_dolphin: ", _tot_plan_money_dolphin, " _tot_adj_money_dolphin: ", _tot_adj_money_dolphin)
    console.log("$$$$$$ _tot_plan_money_trident: ", _tot_plan_money_trident, " _tot_adj_money_trident: ", _tot_adj_money_trident)                
    console.log("$$$$$$ rough plan_buyin_money end $$$$$$")

    composeViewObjs.value.forEach(elem => {
      if (!_need_special_logic) {
        return;
      }
      if (elem['compose_name'] === 'gdngoat') {
        if (!elem.hasOwnProperty('plan_buyin_money')) {
          console.error("elem in gdngoat has no plan_buyin_money: ", elem['fund_id']);
        } else if (elem['money'] > -2 && elem['plan_buyin_money'] > 0) {
          elem['plan_buyin_money'] = Math.round(elem['plan_buyin_money'] * fund_buy_ratio_config.value['money_probe_buy'] / _tot_plan_money_gdngoat)
        } else {
          elem['plan_buyin_money'] = 0
        }
      } else if (elem['compose_name'] === 'ovtree' && fund_buy_ratio_config.value['max_money_for_B_stock'] 
      && fund_buy_ratio_config.value['trendFactor'] && fund_buy_ratio_config.value['trendFactor'].hasOwnProperty('ovtree')) {
        if (!elem.hasOwnProperty('plan_buyin_money')) {
          console.error("elem in ovtree has no plan_buyin_money: ", elem['fund_id']);
        } else if (elem['money'] > -2 && elem['plan_buyin_money'] > 0) {
          if (fund_buy_ratio_config.value['trendFactor']['ovtree'] != null) {
            elem['plan_buyin_money'] = Math.round(elem['plan_buyin_money'] * fund_buy_ratio_config.value['max_money_for_B_stock'] * fund_buy_ratio_config.value['trendFactor']['ovtree'] / _tot_plan_money_ovtree)
          } else {
            elem['plan_buyin_money'] = Math.round(elem['plan_buyin_money'] * fund_buy_ratio_config.value['max_money_for_B_stock'] / _tot_plan_money_ovtree)
          }
        } else {
          elem['plan_buyin_money'] = 0
        }
      } else if (elem['compose_name'] === 'flyhorse' && fund_buy_ratio_config.value['max_money_for_fut'] 
      && fund_buy_ratio_config.value['trendFactor'] && fund_buy_ratio_config.value['trendFactor'].hasOwnProperty('flyhorse')) {
        if (!elem.hasOwnProperty('plan_buyin_money')) {
          console.error("elem in flyhorse has no plan_buyin_money: ", elem['fund_id']);
        } else if (elem['money'] > -2 && elem['plan_buyin_money'] > 0) {
          if (fund_buy_ratio_config.value['trendFactor']['flyhorse'] != null) {
            elem['plan_buyin_money'] = Math.round(elem['plan_buyin_money'] * fund_buy_ratio_config.value['max_money_for_fut'] * fund_buy_ratio_config.value['trendFactor']['flyhorse'] / _tot_plan_money_flyhorse)
          } else {
            elem['plan_buyin_money'] = Math.round(elem['plan_buyin_money'] * fund_buy_ratio_config.value['max_money_for_fut'] / _tot_plan_money_flyhorse)
          }
        } else {
          elem['plan_buyin_money'] = 0
        }
      } else if (elem['compose_name'] === 'medusa' && fund_buy_ratio_config.value['max_money_for_unknow'] 
      && fund_buy_ratio_config.value['trendFactor'] && fund_buy_ratio_config.value['trendFactor'].hasOwnProperty('medusa')) {
        if (!elem.hasOwnProperty('plan_buyin_money')) {
          console.error("elem in medusa has no plan_buyin_money: ", elem['fund_id']);
        } else if (elem['money'] > -2 && elem['plan_buyin_money'] > 0) {
          if (fund_buy_ratio_config.value['trendFactor']['medusa'] != null) {
            elem['plan_buyin_money'] = Math.round(elem['plan_buyin_money'] * fund_buy_ratio_config.value['max_money_for_unknow'] * fund_buy_ratio_config.value['trendFactor']['medusa'] / _tot_plan_money_medusa)
          } else {
            elem['plan_buyin_money'] = Math.round(elem['plan_buyin_money'] * fund_buy_ratio_config.value['max_money_for_unknow'] / _tot_plan_money_medusa)
          }
        } else {
          elem['plan_buyin_money'] = 0
        }
      } else if (elem['compose_name'] === 'dolphin' && fund_buy_ratio_config.value['max_money_for_A_deb'] 
      && fund_buy_ratio_config.value['trendFactor'] && fund_buy_ratio_config.value['trendFactor'].hasOwnProperty('dolphin')) {
        if (!elem.hasOwnProperty('plan_buyin_money')) {
          console.error("elem in dolphin has no plan_buyin_money: ", elem['fund_id']);
        } else if (elem['money'] > -2 && elem['plan_buyin_money'] > 0) {
          if (fund_buy_ratio_config.value['trendFactor']['dolphin'] != null) {
            elem['plan_buyin_money'] = Math.round(elem['plan_buyin_money'] * fund_buy_ratio_config.value['max_money_for_A_deb'] * fund_buy_ratio_config.value['trendFactor']['dolphin'] / _tot_plan_money_dolphin)
          } else {
            elem['plan_buyin_money'] = Math.round(elem['plan_buyin_money'] * fund_buy_ratio_config.value['max_money_for_A_deb'] / _tot_plan_money_dolphin)
          }
        } else {
          elem['plan_buyin_money'] = 0
        }        
      } else if (elem['compose_name'] === 'trident' && fund_buy_ratio_config.value['max_money_for_B_deb'] 
      && fund_buy_ratio_config.value['trendFactor'] && fund_buy_ratio_config.value['trendFactor'].hasOwnProperty('trident')) {
        if (!elem.hasOwnProperty('plan_buyin_money')) {
          console.error("elem in trident has no plan_buyin_money: ", elem['fund_id']);
        } else if (elem['money'] > -2 && elem['plan_buyin_money'] > 0) {
          if (fund_buy_ratio_config.value['trendFactor']['trident'] != null) {
            elem['plan_buyin_money'] = Math.round(elem['plan_buyin_money'] * fund_buy_ratio_config.value['max_money_for_B_deb'] * fund_buy_ratio_config.value['trendFactor']['trident'] / _tot_plan_money_trident)
          } else {
            elem['plan_buyin_money'] = Math.round(elem['plan_buyin_money'] * fund_buy_ratio_config.value['max_money_for_B_deb'] / _tot_plan_money_trident)
          }
        } else {
          elem['plan_buyin_money'] = 0
        }       
      }
    })

    composeViewObjs.value.forEach(elem => {
      if (!_need_special_logic) {
        return;
      }
      if (elem['compose_name'] === 'gdngoat') {
        if (!elem.hasOwnProperty('plan_buyin_money')) {
          console.error("elem in gdngoat has no plan_buyin_money: ", elem['fund_id']);
        } else if (elem['money'] > -2 && elem['plan_buyin_money'] > 0) {
          tot_plan_money_gdngoat.value += elem['plan_buyin_money']
        }
        if (elem['money'] > 0) {
          tot_set_money_gdngoat.value += elem['money']
        }
      } else if (elem['compose_name'] === 'ovtree' && fund_buy_ratio_config.value['max_money_for_B_stock'] 
      && fund_buy_ratio_config.value['trendFactor'] && fund_buy_ratio_config.value['trendFactor'].hasOwnProperty('ovtree')) {
        if (!elem.hasOwnProperty('plan_buyin_money')) {
          console.error("elem in ovtree has no plan_buyin_money: ", elem['fund_id']);
        } else if (elem['money'] > -2 && elem['plan_buyin_money'] > 0) {
          tot_plan_money_ovtree.value += elem['plan_buyin_money']
        }
        if (elem['money'] > 0) {
          tot_set_money_ovtree.value += elem['money']
        }        
      } else if (elem['compose_name'] === 'flyhorse' && fund_buy_ratio_config.value['max_money_for_fut'] 
      && fund_buy_ratio_config.value['trendFactor'] && fund_buy_ratio_config.value['trendFactor'].hasOwnProperty('flyhorse')) {
        if (!elem.hasOwnProperty('plan_buyin_money')) {
          console.error("elem in flyhorse has no plan_buyin_money: ", elem['fund_id']);
        } else if (elem['money'] > -2 && elem['plan_buyin_money'] > 0) {
          tot_plan_money_flyhorse.value += elem['plan_buyin_money']
        }
        if (elem['money'] > 0) {
          tot_set_money_flyhorse.value += elem['money']
        }        
      } else if (elem['compose_name'] === 'medusa' && fund_buy_ratio_config.value['max_money_for_unknow'] 
      && fund_buy_ratio_config.value['trendFactor'] && fund_buy_ratio_config.value['trendFactor'].hasOwnProperty('medusa')) {
        if (!elem.hasOwnProperty('plan_buyin_money')) {
          console.error("elem in medusa has no plan_buyin_money: ", elem['fund_id']);
        } else if (elem['money'] > -2 && elem['plan_buyin_money'] > 0) {
          tot_plan_money_medusa.value += elem['plan_buyin_money']
        }
        if (elem['money'] > 0) {
          tot_set_money_medusa.value += elem['money']
        }        
      } else if (elem['compose_name'] === 'dolphin' && fund_buy_ratio_config.value['max_money_for_A_deb'] 
      && fund_buy_ratio_config.value['trendFactor'] && fund_buy_ratio_config.value['trendFactor'].hasOwnProperty('dolphin')) {
        if (!elem.hasOwnProperty('plan_buyin_money')) {
          console.error("elem in dolphin has no plan_buyin_money: ", elem['fund_id']);
        } else if (elem['money'] > -2 && elem['plan_buyin_money'] > 0) {
          tot_plan_money_dolphin.value += elem['plan_buyin_money']
        }
        if (elem['money'] > 0) {
          tot_set_money_dolphin.value += elem['money']
        }        
      } else if (elem['compose_name'] === 'trident' && fund_buy_ratio_config.value['max_money_for_B_deb'] 
      && fund_buy_ratio_config.value['trendFactor'] && fund_buy_ratio_config.value['trendFactor'].hasOwnProperty('trident')) {
        if (!elem.hasOwnProperty('plan_buyin_money')) {
          console.error("elem in trident has no plan_buyin_money: ", elem['fund_id']);
        } else if (elem['money'] > -2 && elem['plan_buyin_money'] > 0) {
          tot_plan_money_trident.value += elem['plan_buyin_money']
        }
        if (elem['money'] > 0) {
          tot_set_money_trident.value += elem['money']
        }        
      }
    })

    console.log("$$$$$$ recalc plan_buyin_money begin $$$$$$")
    console.log("$$$$$$ tot_plan_money_gdngoat.value: ", tot_plan_money_gdngoat.value, " tot_set_money_gdngoat.value: ", tot_set_money_gdngoat.value)
    console.log("$$$$$$ tot_plan_money_ovtree.value: ", tot_plan_money_ovtree.value, " tot_set_money_ovtree.value: ", tot_set_money_ovtree.value)
    console.log("$$$$$$ tot_plan_money_flyhorse.value: ", tot_plan_money_flyhorse.value, " tot_set_money_flyhorse.value: ", tot_set_money_flyhorse.value)
    console.log("$$$$$$ tot_plan_money_medusa.value: ", tot_plan_money_medusa.value, " tot_set_money_medusa.value: ", tot_set_money_medusa.value)
    console.log("$$$$$$ tot_plan_money_dolphin.value: ", tot_plan_money_dolphin.value, " tot_set_money_dolphin.value: ", tot_set_money_dolphin.value)
    console.log("$$$$$$ tot_plan_money_trident.value: ", tot_plan_money_trident.value, " tot_set_money_trident: ", tot_set_money_trident.value)                
    console.log("$$$$$$ recalc plan_buyin_money end $$$$$$")

    let _today_str_4_adj = getTodayStr()

    composeViewObjs.value.forEach(elem => {
      if (!_need_special_logic) {
        return;
      }
      if (elem['compose_name'] === 'gdngoat') {
        if (!elem.hasOwnProperty('adjust_money') || !elem.hasOwnProperty('last_adjust_money_date')) {
          console.log("elem in gdngoat has no adjust_money or last_adjust_money_date: ", elem['fund_id']);
        } else if (elem['money'] > -2 && elem['adjust_money'] > 0) {
          if (tot_plan_money_gdngoat.value > 0 && _tot_adj_money_gdngoat > 0 && _today_str_4_adj != elem['last_adjust_money_date']) {
            elem['adjust_money'] = Math.floor(elem['adjust_money'] * tot_plan_money_gdngoat.value / _tot_adj_money_gdngoat)
          }
        } else {
          elem['adjust_money'] = 0
        }        
      } else if (elem['compose_name'] === 'ovtree') {
        if (!elem.hasOwnProperty('adjust_money') || !elem.hasOwnProperty('last_adjust_money_date')) {
          console.log("elem in ovtree has no adjust_money or last_adjust_money_date: ", elem['fund_id']);
        } else if (elem['money'] > -2 && elem['adjust_money'] > 0) {
          if (tot_plan_money_ovtree.value > 0 && _tot_adj_money_ovtree > 0 && _today_str_4_adj != elem['last_adjust_money_date']) {
            elem['adjust_money'] = Math.floor(elem['adjust_money'] * tot_plan_money_ovtree.value / _tot_adj_money_ovtree)
          }
        } else {
          elem['adjust_money'] = 0
        }      
      } else if (elem['compose_name'] === 'flyhorse') {
        if (!elem.hasOwnProperty('adjust_money') || !elem.hasOwnProperty('last_adjust_money_date')) {
          console.log("elem in flyhorse has no adjust_money or last_adjust_money_date: ", elem['fund_id']);
        } else if (elem['money'] > -2 && elem['adjust_money'] > 0) {
          if (tot_plan_money_flyhorse.value > 0 && _tot_adj_money_flyhorse > 0 && _today_str_4_adj != elem['last_adjust_money_date']) {
            elem['adjust_money'] = Math.floor(elem['adjust_money'] * tot_plan_money_flyhorse.value / _tot_adj_money_flyhorse)
          }
        } else {
          elem['adjust_money'] = 0
        }       
      } else if (elem['compose_name'] === 'medusa') {
        if (!elem.hasOwnProperty('adjust_money') || !elem.hasOwnProperty('last_adjust_money_date')) {
          console.log("elem in medusa has no adjust_money or last_adjust_money_date: ", elem['fund_id']);
        } else if (elem['money'] > -2 && elem['adjust_money'] > 0) {
          if (tot_plan_money_medusa.value > 0 && _tot_adj_money_medusa > 0 && _today_str_4_adj != elem['last_adjust_money_date']) {
            elem['adjust_money'] = Math.floor(elem['adjust_money'] * tot_plan_money_medusa.value / _tot_adj_money_medusa)
          }
        } else {
          elem['adjust_money'] = 0
        } 
      } else if (elem['compose_name'] === 'dolphin') {
        if (!elem.hasOwnProperty('adjust_money') || !elem.hasOwnProperty('last_adjust_money_date')) {
          console.log("elem in dolphin has no adjust_money or last_adjust_money_date: ", elem['fund_id']);
        } else if (elem['money'] > -2 && elem['adjust_money'] > 0) {
          if (tot_plan_money_dolphin.value > 0 && _tot_adj_money_dolphin > 0 && _today_str_4_adj != elem['last_adjust_money_date']) {
            elem['adjust_money'] = Math.floor(elem['adjust_money'] * tot_plan_money_dolphin.value / _tot_adj_money_dolphin)
          }
        } else {
          elem['adjust_money'] = 0
        }      
      } else if (elem['compose_name'] === 'trident') {
        if (!elem.hasOwnProperty('adjust_money') || !elem.hasOwnProperty('last_adjust_money_date')) {
          console.log("elem in trident has no adjust_money or last_adjust_money_date: ", elem['fund_id']);
        } else if (elem['money'] > -2 && elem['adjust_money'] > 0) {
          if (tot_plan_money_trident.value > 0 && _tot_adj_money_trident > 0 && _today_str_4_adj != elem['last_adjust_money_date']) {
            elem['adjust_money'] = Math.floor(elem['adjust_money'] * tot_plan_money_trident.value / _tot_adj_money_trident)
          }
        } else {
          elem['adjust_money'] = 0
        } 
      }
    })

    // 处理 设止损 和 去止损 逻辑
    composeViewObjs.value.forEach(elem => {
      processLossFlag4Elem(elem, fund_buy_ratio_config);
    })
  }

  let _tot_warning_msg = ""
  
  if (tot_plan_money_gdngoat.value > tot_set_money_gdngoat.value) {
    if ((tot_plan_money_gdngoat.value - tot_set_money_gdngoat.value) / tot_plan_money_gdngoat.value >= 0.1
        || (tot_plan_money_gdngoat.value - tot_set_money_gdngoat.value >= 20)) {
      if (fund_buy_ratio_config.value['buyoutDistance'] && ((fund_buy_ratio_config.value['buyoutDistance']['gdngoat'] != null 
           && fund_buy_ratio_config.value['buyoutDistance']['gdngoat'] > 3) 
           || fund_buy_ratio_config.value['buyoutDistance']['gdngoat'] === null)) {
        _tot_warning_msg += "金毛羊需要增大金额" + parseInt(tot_plan_money_gdngoat.value - tot_set_money_gdngoat.value).toString() + 
        "元, 预设" + parseInt(tot_plan_money_gdngoat.value).toString() + 
        "元, 已设" + parseInt(tot_set_money_gdngoat.value).toString() + "元" + "<br>";
      } else if (fund_buy_ratio_config.value['buyoutDistance'] && fund_buy_ratio_config.value['buyoutDistance']['gdngoat'] != null
        && fund_buy_ratio_config.value['buyoutDistance']['gdngoat'] <= 3) {
        console.warn("#### gdngoat卖出不足3日，无须增大金额，不弹窗告警")
      }
    }
  } else if (tot_plan_money_gdngoat.value < tot_set_money_gdngoat.value) {
    if ((tot_set_money_gdngoat.value - tot_plan_money_gdngoat.value) / tot_set_money_gdngoat.value >= 0.1
        || (tot_set_money_gdngoat.value - tot_plan_money_gdngoat.value >= 20)) {
      _tot_warning_msg += "金毛羊需要缩小金额" + parseInt(tot_set_money_gdngoat.value - tot_plan_money_gdngoat.value).toString() + 
      "元, 预设" + parseInt(tot_plan_money_gdngoat.value).toString() + 
      "元, 已设" + parseInt(tot_set_money_gdngoat.value).toString() + "元" + "<br>";
    }
  }

  if (fund_buy_ratio_config.value['max_money_for_B_stock'] 
      && fund_buy_ratio_config.value['trendFactor'] && fund_buy_ratio_config.value['trendFactor'].hasOwnProperty('ovtree') 
      && fund_buy_ratio_config.value['trendFactor']['ovtree'] != null 
      && fund_buy_ratio_config.value['fund_limit_setting'] && fund_buy_ratio_config.value['fund_limit_setting']['ovtree_enable']) {
    if (tot_plan_money_ovtree.value > tot_set_money_ovtree.value) {
      if ((tot_plan_money_ovtree.value - tot_set_money_ovtree.value) / tot_plan_money_ovtree.value >= 0.1
         || (tot_plan_money_ovtree.value - tot_set_money_ovtree.value >= 20)) {
        if (fund_buy_ratio_config.value['buyoutDistance'] && ((fund_buy_ratio_config.value['buyoutDistance']['ovtree'] != null 
             && fund_buy_ratio_config.value['buyoutDistance']['ovtree'] > 3) 
             || fund_buy_ratio_config.value['buyoutDistance']['ovtree'] === null)) {
          _tot_warning_msg += "橄榄树需要增大金额" + parseInt(tot_plan_money_ovtree.value - tot_set_money_ovtree.value).toString() 
          + "元, 预设" + parseInt(tot_plan_money_ovtree.value).toString() + "元, 已设" 
          + parseInt(tot_set_money_ovtree.value).toString() + "元" + "<br>";
        } else if (fund_buy_ratio_config.value['buyoutDistance'] && fund_buy_ratio_config.value['buyoutDistance']['ovtree'] != null
          && fund_buy_ratio_config.value['buyoutDistance']['ovtree'] <= 3) {
            console.warn("#### ovtree卖出不足3日，无须增大金额，不弹窗告警")
          }
      }
    } else if (tot_plan_money_ovtree.value < tot_set_money_ovtree.value) {
      if ((tot_set_money_ovtree.value - tot_plan_money_ovtree.value) / tot_set_money_ovtree.value >= 0.1
          || (tot_set_money_ovtree.value - tot_plan_money_ovtree.value >= 20)) {
        _tot_warning_msg += "橄榄树需要缩小金额" + parseInt(tot_set_money_ovtree.value - tot_plan_money_ovtree.value).toString() 
        + "元, 预设" + parseInt(tot_plan_money_ovtree.value).toString() + "元, 已设" 
        + parseInt(tot_set_money_ovtree.value).toString() + "元" + "<br>";
      }
    }
  } 
  
  if (fund_buy_ratio_config.value['max_money_for_fut'] 
      && fund_buy_ratio_config.value['trendFactor'] && fund_buy_ratio_config.value['trendFactor'].hasOwnProperty('flyhorse') 
      && fund_buy_ratio_config.value['trendFactor']['flyhorse'] != null
      && fund_buy_ratio_config.value['fund_limit_setting'] && fund_buy_ratio_config.value['fund_limit_setting']['flyhorse_enable']) {
    if (tot_plan_money_flyhorse.value > tot_set_money_flyhorse.value) {
      if ((tot_plan_money_flyhorse.value - tot_set_money_flyhorse.value) / tot_plan_money_flyhorse.value >= 0.1
          || (tot_plan_money_flyhorse.value - tot_set_money_flyhorse.value >= 20)) {
        if (fund_buy_ratio_config.value['buyoutDistance'] && ((fund_buy_ratio_config.value['buyoutDistance']['flyhorse'] != null 
            && fund_buy_ratio_config.value['buyoutDistance']['flyhorse'] > 3) 
            || fund_buy_ratio_config.value['buyoutDistance']['flyhorse'] === null)) {
          _tot_warning_msg += "飞马需要增大金额" + parseInt(tot_plan_money_flyhorse.value - tot_set_money_flyhorse.value).toString() 
          + "元, 预设" + parseInt(tot_plan_money_flyhorse.value).toString() + "元, 已设" 
          + parseInt(tot_set_money_flyhorse.value).toString() + "元" + "<br>";
        } else if (fund_buy_ratio_config.value['buyoutDistance'] && fund_buy_ratio_config.value['buyoutDistance']['flyhorse'] != null
          && fund_buy_ratio_config.value['buyoutDistance']['flyhorse'] <= 3) {
            console.warn("#### flyhorse卖出不足3日，无须增大金额，不弹窗告警")
          }
      }
    } else if (tot_plan_money_flyhorse.value < tot_set_money_flyhorse.value) {
      if ((tot_set_money_flyhorse.value - tot_plan_money_flyhorse.value) / tot_set_money_flyhorse.value >= 0.1
          || (tot_set_money_flyhorse.value - tot_plan_money_flyhorse.value >= 20)) {
        _tot_warning_msg += "飞马需要缩小金额" + parseInt(tot_set_money_flyhorse.value - tot_plan_money_flyhorse.value).toString() 
        + "元, 预设" + parseInt(tot_plan_money_flyhorse.value).toString() + "元, 已设" 
        + parseInt(tot_set_money_flyhorse.value).toString() + "元" + "<br>";
      }
    }
  }
  
  if (fund_buy_ratio_config.value['max_money_for_unknow'] 
      && fund_buy_ratio_config.value['trendFactor'] && fund_buy_ratio_config.value['trendFactor'].hasOwnProperty('medusa') 
      && fund_buy_ratio_config.value['trendFactor']['medusa'] != null
      && fund_buy_ratio_config.value['fund_limit_setting'] && fund_buy_ratio_config.value['fund_limit_setting']['medusa_enable']) {
    if (tot_plan_money_medusa.value > tot_set_money_medusa.value) {
      if ((tot_plan_money_medusa.value - tot_set_money_medusa.value) / tot_plan_money_medusa.value >= 0.1
          || (tot_plan_money_medusa.value - tot_set_money_medusa.value >= 20)) {
        if (fund_buy_ratio_config.value['buyoutDistance'] && ((fund_buy_ratio_config.value['buyoutDistance']['medusa'] != null 
            && fund_buy_ratio_config.value['buyoutDistance']['medusa'] > 3) 
            || fund_buy_ratio_config.value['buyoutDistance']['medusa'] === null)) {
          _tot_warning_msg += "美杜莎需要增大金额" + parseInt(tot_plan_money_medusa.value - tot_set_money_medusa.value).toString() 
          + "元, 预设" + parseInt(tot_plan_money_medusa.value).toString() + "元, 已设" 
          + parseInt(tot_set_money_medusa.value).toString() + "元" + "<br>";
        } else if (fund_buy_ratio_config.value['buyoutDistance'] && fund_buy_ratio_config.value['buyoutDistance']['medusa'] != null 
          && fund_buy_ratio_config.value['buyoutDistance']['medusa'] <= 3) {
            console.warn("#### medusa卖出不足3日，无须增大金额，不弹窗告警")
          }
      }
    } else if (tot_plan_money_medusa.value < tot_set_money_medusa.value) {
      if ((tot_set_money_medusa.value - tot_plan_money_medusa.value) / tot_set_money_medusa.value >= 0.1
          || (tot_set_money_medusa.value - tot_plan_money_medusa.value >= 20)) {
        _tot_warning_msg += "美杜莎需要缩小金额" + parseInt(tot_set_money_medusa.value - tot_plan_money_medusa.value).toString() 
        + "元, 预设" + parseInt(tot_plan_money_medusa.value).toString() + "元, 已设" 
        + parseInt(tot_set_money_medusa.value).toString() + "元" + "<br>";
      }
    }
  }
  
  if (fund_buy_ratio_config.value['max_money_for_A_deb'] 
      && fund_buy_ratio_config.value['trendFactor'] && fund_buy_ratio_config.value['trendFactor'].hasOwnProperty('dolphin') 
      && fund_buy_ratio_config.value['trendFactor']['dolphin'] != null
      && fund_buy_ratio_config.value['fund_limit_setting'] && fund_buy_ratio_config.value['fund_limit_setting']['dolphin_enable']) {
    if (tot_plan_money_dolphin.value > tot_set_money_dolphin.value) {
      if ((tot_plan_money_dolphin.value - tot_set_money_dolphin.value) / tot_plan_money_dolphin.value >= 0.1
          || (tot_plan_money_dolphin.value - tot_set_money_dolphin.value >= 20)) {
        if (fund_buy_ratio_config.value['buyoutDistance'] && ((fund_buy_ratio_config.value['buyoutDistance']['dolphin'] != null 
            && fund_buy_ratio_config.value['buyoutDistance']['dolphin'] > 3) 
            || fund_buy_ratio_config.value['buyoutDistance']['dolphin'] === null)) {        
          _tot_warning_msg += "海豚需要增大金额" + parseInt(tot_plan_money_dolphin.value - tot_set_money_dolphin.value).toString() 
          + "元, 预设" + parseInt(tot_plan_money_dolphin.value).toString() + "元, 已设" 
          + parseInt(tot_set_money_dolphin.value).toString() + "元" + "<br>";
        } else if (fund_buy_ratio_config.value['buyoutDistance'] && fund_buy_ratio_config.value['buyoutDistance']['dolphin'] != null 
          && fund_buy_ratio_config.value['buyoutDistance']['dolphin'] <= 3) {
            console.warn("#### dolphin卖出不足3日，无须增大金额，不弹窗告警")
          }
      }
    } else if (tot_plan_money_dolphin.value < tot_set_money_dolphin.value) {
      if ((tot_set_money_dolphin.value - tot_plan_money_dolphin.value) / tot_set_money_dolphin.value >= 0.1
          || (tot_set_money_dolphin.value - tot_plan_money_dolphin.value >= 20)) {
        _tot_warning_msg += "海豚需要缩小金额" + parseInt(tot_set_money_dolphin.value - tot_plan_money_dolphin.value).toString() 
        + "元, 预设" + parseInt(tot_plan_money_dolphin.value).toString() + "元, 已设" 
        + parseInt(tot_set_money_dolphin.value).toString() + "元" + "<br>";
      }
    }
  }
  
  if (fund_buy_ratio_config.value['max_money_for_B_deb'] 
      && fund_buy_ratio_config.value['trendFactor'] && fund_buy_ratio_config.value['trendFactor'].hasOwnProperty('trident') 
      && fund_buy_ratio_config.value['trendFactor']['trident'] != null
      && fund_buy_ratio_config.value['fund_limit_setting'] && fund_buy_ratio_config.value['fund_limit_setting']['trident_enable']) {
    if (tot_plan_money_trident.value > tot_set_money_trident.value) {
      if ((tot_plan_money_trident.value - tot_set_money_trident.value) / tot_plan_money_trident.value >= 0.1
          || (tot_plan_money_trident.value - tot_set_money_trident.value >= 20)) {
        if (fund_buy_ratio_config.value['buyoutDistance'] && ((fund_buy_ratio_config.value['buyoutDistance']['trident'] != null 
        && fund_buy_ratio_config.value['buyoutDistance']['trident'] > 3) 
        || fund_buy_ratio_config.value['buyoutDistance']['trident'] === null)) {    
          _tot_warning_msg += "三叉戟需要增大金额" + parseInt(tot_plan_money_trident.value - tot_set_money_trident.value).toString() 
          + "元, 预设" + parseInt(tot_plan_money_trident.value).toString() + "元, 已设" 
          + parseInt(tot_set_money_trident.value).toString() + "元" + "<br>";
        } else if (fund_buy_ratio_config.value['buyoutDistance'] && fund_buy_ratio_config.value['buyoutDistance']['trident'] != null 
          && fund_buy_ratio_config.value['buyoutDistance']['trident'] <= 3) {
            console.warn("#### trident卖出不足3日，无须增大金额，不弹窗告警")
          }
      }
    } else if (tot_plan_money_trident.value < tot_set_money_trident.value) {
      if ((tot_set_money_trident.value - tot_plan_money_trident.value) / tot_set_money_trident.value >= 0.1
          || (tot_set_money_trident.value - tot_plan_money_trident.value >= 20)) {
        _tot_warning_msg += "三叉戟需要缩小金额" + parseInt(tot_set_money_trident.value - tot_plan_money_trident.value).toString() 
        + "元, 预设" + parseInt(tot_plan_money_trident.value).toString() + "元, 已设" 
        + parseInt(tot_set_money_trident.value).toString() + "元" + "<br>";
      }
    }
  }

  if (composeViewObjs.value.length > 0) {
    composeViewObjs.value.forEach(elem => {
      if (elem['show_popup_msg']) {
        _tot_warning_msg += elem['popup_msg'] + " <br>"
      }
    })
  }

  tot_warning_msg.value = _tot_warning_msg
  if (pop_up_warn_timer.value) {
    clearInterval(pop_up_warn_timer.value)
    pop_up_warn_timer.value = null
    pop_up_warn_times.value = 0
    pop_up_warn_period.value = 1000
  }
  const body = document.getElementsByTagName('body')[0];
  let search_elem = document.getElementById('cust_alert_id');
  if (search_elem) {
    search_elem.style.visibility = 'hidden'
    body.removeChild(search_elem);
  } 
  if (fund_buy_ratio_config.value && fund_buy_ratio_config.value['fund_limit_setting'] 
  && fund_buy_ratio_config.value && fund_buy_ratio_config.value['fund_limit_setting']['popup_msg']
  && tot_warning_msg.value !== '' && page_is_displayed.value) {
    startForeverPopupWarnTimer()
  }

  //
  composeViewObjs.value.forEach(elem => {
      let fixedHoldObj = elem['fixedHoldObj']
      if (fixedHoldObj && fixedHoldObj['hold_objs'] && fixedHoldObj['hold_objs'].length > 0) {
        let lastHoldObj = fixedHoldObj['hold_objs'][fixedHoldObj['hold_objs'].length - 1]
        totMoney.value += lastHoldObj['accu_money']
        totEarnMoney.value += lastHoldObj['accu_pure_profit']
      }
      if (elem['money'] > 0) {
        totSetBuy.value += elem['money']
      }
      if (elem['adjust_money'] > 0) {
        totPlanBuy.value += elem['adjust_money']
      }
      if (elem['plan_buyin_money'] > 0) {
        totInitBuy.value += elem['plan_buyin_money']
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
        || (elem.hasOwnProperty('lost_in_dtconvg') && elem['lost_in_dtconvg'])
        || (elem.hasOwnProperty('money') && elem['money'] === -2)) {
        tot4SoldNum.value = tot4SoldNum.value + 1
      } else if (elem.hasOwnProperty('money') && elem['money'] === -1) {
        totPauseNum.value = totPauseNum.value + 1
      } else if (elem.hasOwnProperty('money') && elem.hasOwnProperty('adjust_money') &&
        elem['money'] != null && elem['adjust_money'] != null &&
        Math.abs(elem['money'] - elem['adjust_money']) >= 3) {
        totAdjustNum.value = totAdjustNum.value + 1
      }

      if (elem.hasOwnProperty('quant_obj') && elem['quant_obj']['hitted']) {
        totPoleNum.value = totPoleNum.value + 1
      }
      
      if (noteObjs.value.hasOwnProperty(elem['fund_id']) && noteObjs.value[elem['fund_id']].hasOwnProperty('note_objs')
          && noteObjs.value[elem['fund_id']]['note_objs'].length > 0) {
        totNoteNum.value = totNoteNum.value + 1
      }
    })

    if (totMoney.value > 0) {
      let _earn_rate = totEarnMoney.value / totMoney.value * 100
      totEarnRate.value = _earn_rate.toFixed(0) + '%'
    }
    if (totSetBuy.value != 0) {
      diffBuySet.value = (totPlanBuy.value - totSetBuy.value) / totSetBuy.value
    }
    
    scrollViewBySelection();

}, { immediate: true })

function startForeverPopupWarnTimer() {
  pop_up_warn_timer.value = setInterval(popUpWarnLogic, pop_up_warn_period.value)
}

function popUpWarnLogic() {
  if (pop_up_warn_timer.value) {
    clearInterval(pop_up_warn_timer.value)
    pop_up_warn_timer.value = null
  }
  const body = document.getElementsByTagName('body')[0];
  let search_elem = document.getElementById('cust_alert_id');
  if (search_elem) {
    search_elem.style.visibility = 'hidden'
    body.removeChild(search_elem);
  }
  if (tot_warning_msg.value === '') {
    pop_up_warn_times.value = 0
    pop_up_warn_period.value = 1000
  } else {
    pop_up_warn_times.value += 1
    if (pop_up_warn_times.value === 1) {
      pop_up_warn_period.value = 5000
    } else if (pop_up_warn_times.value === 2) {
      pop_up_warn_period.value = 6000
    } else if (pop_up_warn_times.value === 3) {
      pop_up_warn_period.value = 8000
    } else if (pop_up_warn_times.value <= 10) {
      pop_up_warn_period.value *= pop_up_warn_times.value * 1.25
    } else if (pop_up_warn_times.value <= 20) {
      pop_up_warn_period.value *= pop_up_warn_times.value * 1.175
    } else {
      pop_up_warn_period.value *= pop_up_warn_times.value * 1.1
    }
    if (pop_up_warn_period.value >= 30 * 1000) {
      pop_up_warn_period.value = 30 * 1000
    }
    if (page_is_displayed.value) {
      if (show4SoldOnly.value || showPauseOnly.value || showAdjustOnly.value || showPoleOnly.value || showNoteOnly.value) {
      } else {
        alert(tot_warning_msg.value)
      }
      startForeverPopupWarnTimer()
    }
  }
}

watch([composeViewObjs, noteObjs], () => {
  if (composeViewObjs.value.length > 0 && noteObjs.value) {
    composeViewObjs.value.forEach(elem => {
      if (noteObjs.value.hasOwnProperty(elem['fund_id'])) {
        if (noteObjs.value[elem['fund_id']].hasOwnProperty('note_objs')) {
          elem['note_objs'] = noteObjs.value[elem['fund_id']]['note_objs']
        }
      }
    })
  }
}, { immediate: true })

getAllBuyoutRecords()
getAllBuyoutFutureRecords()
getFundNotes4Edit()

/*
* sold by bulk
* */
const dlgController = ref({ soldDlg: null, removeDlg: null, removeFromComposeDlg: null, suggestDlg: null, custAddDlg: null})
const searchCond = ref()
const searchTimer = ref(null)
const searchByFundIdFoundFlag = ref(false)
const searchByFundIdTimes = ref(0)
const baseUrl4ProbeNav = ref("")
const baseUrl4Report = ref("")

onMounted(() => {
  dlgController.value.soldDlg = new Modal('#soldDialog', {})
  dlgController.value.removeDlg = new Modal('#removeDialog', {})
  dlgController.value.removeFromComposeDlg = new Modal('#removeComposeDialog', {})
  dlgController.value.suggestDlg = new Modal('#suggComposeDialog', {})
  dlgController.value.custAddDlg = new Modal('#custAddComposeDialog', {})

  /*
  * logic moved to onActivated
  * */
  
  let _prot = window.location.protocol;
  let _host = window.location.hostname;
  baseUrl4ProbeNav.value = _prot + "//" + _host + "/index.html?cust_fund_id="
  baseUrl4Report.value = _prot + "//" + _host + "/dt_plans_web/#/report?fund_id="

  // 快捷键
  document.addEventListener('keydown', function(e) {
    console.log("*** quick keyboard press: ", e.keyCode);
    if (e.ctrlKey && e.keyCode === 81) {
      // ctrl + q
      suggestComposeLogic()
    } else if (e.ctrlKey && e.keyCode === 90) {
      // ctrl + z
      clearSelected()
    } else if (e.ctrlKey && e.shiftKey && e.keyCode === 83) {
      // ctrl + shift + s
      sortByField('selected')
    } else if (e.keyCode === 27) {
      // ESC
      hideSuggUi()
      clearSelected()
    }
  })
})

onActivated( () => {
  if (route.query.hasOwnProperty('dt_compose') && route.query['dt_compose']) {
    if (['ovtree', 'dolphin', 'trident', 'gdngoat', 'flyhorse', 'medusa'].indexOf(route.query['dt_compose'].trim()) !== -1) {
      compose_name.value = route.query['dt_compose'].trim();
    } else {
      console.error("Internal error as query string can not find: ", route.query['dt_compose'])
    }
  }
  if (route.query.hasOwnProperty('dt_fund_id') && route.query['dt_fund_id']) {
    searchCond.value = route.query['dt_fund_id'].trim();
    searchByFundIdTimes.value = 0
    if (searchCond.value.length === 6) {
      searchTimer.value = setInterval(() => {
        searchByCond()
        if (searchByFundIdFoundFlag.value || searchByFundIdTimes.value >= 10) {
          if (searchTimer.value) {
            console.warn("clear search timer in compose page")
            clearInterval(searchTimer.value)
          }
        }
      }, 1000)
    }
  }
  page_is_displayed.value = true
  if (!pop_up_warn_timer.value) {
    startForeverPopupWarnTimer()
  }
})

onDeactivated(() => {
  if (pop_up_warn_timer.value) {
    clearInterval(pop_up_warn_timer.value)
    pop_up_warn_timer.value = null
  }
  pop_up_warn_times.value = 0
  pop_up_warn_period.value = 1000
  page_is_displayed.value = false
})

onUnmounted(() => {
  if (searchTimer.value) {
    console.warn("clear search timer in compose page")
    clearInterval(searchTimer.value)
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
  dlgController.value.soldDlg.hide()
  await soldComposeFixedHold(fund_id_sold.value, fund_name_sold.value, one_hold_obj_end.value, hold_objs.value)
  await setComposeSoldDate(fund_one_row_obj.value['fund_id'], fund_one_row_obj.value['fund_name'], fund_one_row_obj.value['compose_name'], -1, fund_one_row_obj.value['buyin_source'])
}

const fund_id_remove = ref('')
const fund_name_remove = ref('')
const one_hold_obj_remove = ref(null)
const fixed_remove_type = ref('')
const fund_obj_remove = ref(null)

async function removeFixedFundUi(_fund_id, _fund_name, _one_hold_obj, _oneRow) {
  fixed_remove_type.value = 'remove old'
  fund_id_remove.value = _fund_id
  fund_name_remove.value = _fund_name
  one_hold_obj_remove.value = _one_hold_obj
  fund_obj_remove.value = _oneRow
  dlgController.value.removeDlg.show();
}

async function removeFixedFund() {
  if (fixed_remove_type.value == 'remove old') {
    buyOutFixedFund(fund_id_remove.value, fund_name_remove.value, one_hold_obj_remove.value)
    dlgController.value.removeDlg.hide()
  } else if (fixed_remove_type.value == 'remove today') {
    await buyOutFixedFundOfToday(fund_id_remove.value, fund_name_remove.value);
    await setComposeProperty(fund_obj_remove.value['fund_id'], fund_obj_remove.value['fund_name'], fund_obj_remove.value['compose_name'], -1, fund_obj_remove.value['buyin_source'], fund_obj_remove.value['lossFlag']);
    dlgController.value.removeDlg.hide()
  } else {
    console.error("internal error as remove fund type does not match.")
  }
}

async function removeFixedFund4TodayUi(_fund_id, _fund_name, _oneRow) {
  fixed_remove_type.value = 'remove today'
  fund_id_remove.value = _fund_id
  fund_name_remove.value = _fund_name
  fund_obj_remove.value = _oneRow
  dlgController.value.removeDlg.show();
}

const toBeRemoveFundFromCompose = ref(null)
function removeCompose4Ui(event, oneRowObj) {
  event.stopPropagation()
  toBeRemoveFundFromCompose.value = oneRowObj;
  dlgController.value.removeFromComposeDlg.show();
}

async function removeCompose() {
  dlgController.value.removeFromComposeDlg.hide()
  await addOrRemoveCompose(toBeRemoveFundFromCompose.value['fund_id'], toBeRemoveFundFromCompose.value['fund_name'], 
  toBeRemoveFundFromCompose.value['compose_name'])
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

if (_field === 'day_xxx_thres') {
    if (sortFieldFlag.value) {
      composeViewObjs.value.sort((a, b) => {
        let a_val = 999;
        let b_val = 999;
        if (a['kbObj'] && a['kbObj']['statistics'] && a['kbObj']['statistics'].hasOwnProperty('day_sort_tot_thres')) {
          a_val = a['kbObj']['statistics']['day_sort_tot_thres']
        }
        if (b['kbObj'] && b['kbObj']['statistics'] && b['kbObj']['statistics'].hasOwnProperty('day_sort_tot_thres')) {
          b_val = b['kbObj']['statistics']['day_sort_tot_thres']
        }
        return a_val - b_val;
      });
    } else {
      composeViewObjs.value.sort((a, b) => {
        let a_val = -999;
        let b_val = -999;
        if (a['kbObj'] && a['kbObj']['statistics'] && a['kbObj']['statistics'].hasOwnProperty('day_sort_tot_thres')) {
          a_val = a['kbObj']['statistics']['day_sort_tot_thres']
        }
        if (b['kbObj'] && b['kbObj']['statistics'] && b['kbObj']['statistics'].hasOwnProperty('day_sort_tot_thres')) {
          b_val = b['kbObj']['statistics']['day_sort_tot_thres']
        }
        return b_val - a_val;
      });
    }
  } else if (_field === 'min_earn') {
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
  } else if (_field === 'short_wav') {
    if (sortFieldFlag.value) {
      composeViewObjs.value.sort((a, b) => {
        let _a_val = -9999
        let _b_val = -9999
        if (a.hasOwnProperty('quant_obj') && a['quant_obj'] && a['quant_obj'].hasOwnProperty('histo') && a['quant_obj']['histo']) {
          _a_val = a['quant_obj']['histo']['max_hitted_times'] - a['quant_obj']['histo']['min_hitted_times'] 
        }
        if (b.hasOwnProperty('quant_obj') && b['quant_obj'] && b['quant_obj'].hasOwnProperty('histo') && b['quant_obj']['histo']) {
          _b_val = b['quant_obj']['histo']['max_hitted_times'] - b['quant_obj']['histo']['min_hitted_times'] 
        }
        return _a_val - _b_val 
      });
    } else {
      composeViewObjs.value.sort((a, b) => {
        let _a_val = -9999
        let _b_val = -9999
        if (a.hasOwnProperty('quant_obj') && a['quant_obj'] && a['quant_obj'].hasOwnProperty('histo') && a['quant_obj']['histo']) {
          _a_val = a['quant_obj']['histo']['max_hitted_times'] - a['quant_obj']['histo']['min_hitted_times'] 
        }
        if (b.hasOwnProperty('quant_obj') && b['quant_obj'] && b['quant_obj'].hasOwnProperty('histo') && b['quant_obj']['histo']) {
          _b_val = b['quant_obj']['histo']['max_hitted_times'] - b['quant_obj']['histo']['min_hitted_times'] 
        }
        return _b_val - _a_val
      });
    }
  } else if (_field === 'positive') {
    if (sortFieldFlag.value) {
      composeViewObjs.value.sort((a, b) => {
        if (a['kbObj'] && a['kbObj']['positive'] && b['kbObj'] && b['kbObj']['positive']) {
          if (a['kbObj']['positive']['positive_reach_len'] != b['kbObj']['positive']['positive_reach_len']) {
            return a['kbObj']['positive']['positive_reach_len'] - b['kbObj']['positive']['positive_reach_len'];
          } else {
            if (a['kbObj'] && a['kbObj']['negative'] && b['kbObj'] && b['kbObj']['negative']) {
              return b['kbObj']['negative']['negative_reach_len'] - a['kbObj']['negative']['negative_reach_len'];
            } else {
              return 0;
            }
          }
        } else {
          return 0;
        }
      });
    } else {
      composeViewObjs.value.sort((a, b) => {
        if (a['kbObj'] && a['kbObj']['positive'] && b['kbObj'] && b['kbObj']['positive']) {
          if (a['kbObj']['positive']['positive_reach_len'] != b['kbObj']['positive']['positive_reach_len']) {
            return b['kbObj']['positive']['positive_reach_len'] - a['kbObj']['positive']['positive_reach_len'];
          } else {
            if (a['kbObj'] && a['kbObj']['negative'] && b['kbObj'] && b['kbObj']['negative']) {
              return a['kbObj']['negative']['negative_reach_len'] - b['kbObj']['negative']['negative_reach_len'];
            } else {
              return 0;
            }
          }
        } else {
          return 0;
        }
      });
    }
  } else if (_field === 'negative') {
    if (sortFieldFlag.value) {
      composeViewObjs.value.sort((a, b) => {
        if (a['kbObj'] && a['kbObj']['negative'] && b['kbObj'] && b['kbObj']['negative']) {
          if (a['kbObj']['negative']['negative_reach_len'] !=  b['kbObj']['negative']['negative_reach_len']) {
            return a['kbObj']['negative']['negative_reach_len'] - b['kbObj']['negative']['negative_reach_len'];
          } else {
            if (a['kbObj'] && a['kbObj']['positive'] && b['kbObj'] && b['kbObj']['positive']) {
              return b['kbObj']['positive']['positive_reach_len'] - a['kbObj']['positive']['positive_reach_len'];
            } else {
              return 0;
            }
          }
        } else {
          return 0;
        }
      });
    } else {
      composeViewObjs.value.sort((a, b) => {
        if (a['kbObj'] && a['kbObj']['negative'] && b['kbObj'] && b['kbObj']['negative']) {
          if (a['kbObj']['negative']['negative_reach_len'] !=  b['kbObj']['negative']['negative_reach_len']) {
            return b['kbObj']['negative']['negative_reach_len'] - a['kbObj']['negative']['negative_reach_len'];
          } else {
            if (a['kbObj'] && a['kbObj']['positive'] && b['kbObj'] && b['kbObj']['positive']) {
              return a['kbObj']['positive']['positive_reach_len'] - b['kbObj']['positive']['positive_reach_len'];
            } else {
              return 0;
            }            
          }
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
        return _a - _b
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
        return _a - _b
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
  } else if (_field === 'cont_start') {
    if (sortFieldFlag.value) {
      composeViewObjs.value.sort((a, b) => {
        let _start_days_a = -9999
        let _start_days_b = -9999
        if (contStartStopObj.value.hasOwnProperty(a['fund_id']) && contStartStopObj.value[a['fund_id']]['start_stop_obj'] && contStartStopObj.value[a['fund_id']]['start_stop_obj']['start_days']) {
          _start_days_a = contStartStopObj.value[a['fund_id']]['start_stop_obj']['start_days']
        }
        if (contStartStopObj.value.hasOwnProperty(b['fund_id']) && contStartStopObj.value[b['fund_id']]['start_stop_obj'] && contStartStopObj.value[b['fund_id']]['start_stop_obj']['start_days']) {
          _start_days_b = contStartStopObj.value[b['fund_id']]['start_stop_obj']['start_days']
        }
        return _start_days_a - _start_days_b;
      });
    } else {
      composeViewObjs.value.sort((a, b) => {
        let _start_days_a = -9999
        let _start_days_b = -9999
        if (contStartStopObj.value.hasOwnProperty(a['fund_id']) && contStartStopObj.value[a['fund_id']]['start_stop_obj'] && contStartStopObj.value[a['fund_id']]['start_stop_obj']['start_days']) {
          _start_days_a = contStartStopObj.value[a['fund_id']]['start_stop_obj']['start_days']
        }
        if (contStartStopObj.value.hasOwnProperty(b['fund_id']) && contStartStopObj.value[b['fund_id']]['start_stop_obj'] && contStartStopObj.value[b['fund_id']]['start_stop_obj']['start_days']) {
          _start_days_b = contStartStopObj.value[b['fund_id']]['start_stop_obj']['start_days']
        }
        return  _start_days_b - _start_days_a;
      });
    }
  } else if (_field === 'cont_stop') {
    if (sortFieldFlag.value) {
      composeViewObjs.value.sort((a, b) => {
        let _stop_days_a = -9999
        let _stop_days_b = -9999
        if (contStartStopObj.value.hasOwnProperty(a['fund_id']) && contStartStopObj.value[a['fund_id']]['start_stop_obj'] && contStartStopObj.value[a['fund_id']]['start_stop_obj']['stop_days']) {
          _stop_days_a = contStartStopObj.value[a['fund_id']]['start_stop_obj']['stop_days']
        }
        if (contStartStopObj.value.hasOwnProperty(b['fund_id']) && contStartStopObj.value[b['fund_id']]['start_stop_obj'] && contStartStopObj.value[b['fund_id']]['start_stop_obj']['stop_days']) {
          _stop_days_b = contStartStopObj.value[b['fund_id']]['start_stop_obj']['stop_days']
        }
        return _stop_days_a - _stop_days_b;
      });
    } else {
      composeViewObjs.value.sort((a, b) => {
        let _stop_days_a = -9999
        let _stop_days_b = -9999
        if (contStartStopObj.value.hasOwnProperty(a['fund_id']) && contStartStopObj.value[a['fund_id']]['start_stop_obj'] && contStartStopObj.value[a['fund_id']]['start_stop_obj']['stop_days']) {
          _stop_days_a = contStartStopObj.value[a['fund_id']]['start_stop_obj']['stop_days']
        }
        if (contStartStopObj.value.hasOwnProperty(b['fund_id']) && contStartStopObj.value[b['fund_id']]['start_stop_obj'] && contStartStopObj.value[b['fund_id']]['start_stop_obj']['stop_days']) {
          _stop_days_b = contStartStopObj.value[b['fund_id']]['start_stop_obj']['stop_days']
        }
        return  _stop_days_b - _stop_days_a;
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
        if (rowElements.value[_rowObj['fund_id']]) {
            rowElements.value[_rowObj['fund_id']].scrollIntoView({ block: "center", behavior: "smooth" })
        }
      }
    } else if (composeViewObjs.value.length > 0) {
      let _fund_id = composeViewObjs.value[0]['fund_id']
      if (rowElements.value[_fund_id]) {
          rowElements.value[_fund_id].scrollIntoView({ block: "center", behavior: "smooth" })
      }
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

function switchWriteNote(oneRowObj) {
  alignWriteNote(oneRowObj)
  if (!oneRowObj.hasOwnProperty('show_write_note')) {
    oneRowObj['show_write_note'] = true;
  } else {
    oneRowObj['show_write_note'] = !oneRowObj['show_write_note'];
  }
}

function alignWriteNote(oneRowObj) {
  if (noteObjs.value && noteObjs.value.hasOwnProperty(oneRowObj['fund_id'])) {
    oneRowObj['note_objs'] = noteObjs.value[oneRowObj['fund_id']]['note_objs']
  } else {
    oneRowObj['note_objs'] = []
  }
  let _today_str = getTodayStr()
  if (oneRowObj['note_objs'].length > 0) {
    let _last_note = oneRowObj['note_objs'][oneRowObj['note_objs'].length - 1]
    if (_last_note['date_str'] == _today_str) {
      oneRowObj['write_note_date'] = _last_note['date_str']
      oneRowObj['write_note_perc'] = _last_note['perc_str']
      oneRowObj['write_note_comments'] = _last_note['comments']
      oneRowObj['curr_note_idx'] = oneRowObj['note_objs'].length - 1
    } else {
      oneRowObj['write_note_date'] = getTodayStr()
      oneRowObj['write_note_perc'] = ''
      oneRowObj['write_note_comments'] = ''
      oneRowObj['curr_note_idx'] = -1
    }
  } else {
    oneRowObj['write_note_date'] = getTodayStr()
    oneRowObj['write_note_perc'] = ''
    oneRowObj['write_note_comments'] = ''
    oneRowObj['curr_note_idx'] = -1
  }
}

function navigateNote(oneRowObj, bPrev=true) {
  if (!oneRowObj['note_objs'] || oneRowObj['note_objs'].length == 0) {
    return
  }
  if (bPrev) {
    oneRowObj['curr_note_idx'] -= 1
    if (oneRowObj['curr_note_idx'] <= 0) {
      oneRowObj['curr_note_idx'] = 0
    }
  } else {
    oneRowObj['curr_note_idx'] += 1
    if (oneRowObj['curr_note_idx'] >= oneRowObj['note_objs'].length - 1) {
      oneRowObj['curr_note_idx'] = oneRowObj['note_objs'].length - 1
    }
  }
  let _one_note = oneRowObj['note_objs'][oneRowObj['curr_note_idx']]
  oneRowObj['write_note_date'] = _one_note['date_str']
  oneRowObj['write_note_perc'] = _one_note['perc_str']
  oneRowObj['write_note_comments'] = _one_note['comments']
}

function selOrDesRow(oneRowObj) {
  if (oneRowObj.hasOwnProperty('currSelected')) {
    oneRowObj['currSelected'] = !oneRowObj['currSelected']
  } else {
    oneRowObj['currSelected'] = true
  }

  if (oneRowObj['currSelected']) {
    toBeSuggestCompose.value = oneRowObj
  }
}

function clearSelected() {
  composeViewObjs.value.forEach((elem) => elem['currSelected'] = false)
}

function searchByCond() {
  clearSelected()
  if (!searchCond.value || searchCond.value.trim() === '') {
    return
  }
  let _foundCnt = 0
  let _checkStrBackup = searchCond.value
  let _testStr = _checkStrBackup.replace(/[0-9]/g, "")
  let _pureStr = _testStr.trim()
  if (_pureStr.length === 0 && searchCond.value.length === 6) {
    searchByFundIdTimes.value += 1
    // fund id
    let _fundId = searchCond.value.trim()
    composeViewObjs.value.forEach((elem) => {
      if (elem['fund_id'] === _fundId) {
        elem['currSelected'] = true
        _foundCnt += 1
        searchByFundIdFoundFlag.value = true
      }
    })
  } else {
    // fund name
    let arr = searchCond.value.trim().split(" ")
    composeViewObjs.value.forEach((elem) => {
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
    if (_foundCnt === 1) {
    }
    if (searchByFundIdFoundFlag.value) {
      let _elems = document.getElementsByTagName("body");
      let _body = _elems[0];
      let _warning = document.getElementById("warning_wnd");
      if (_warning) {
        console.warn("clear warn wnd");
        _body.removeChild(_warning);
      }
      let _quant_wnd = document.getElementById("quant_wnd");
      if (_quant_wnd) {
        console.warn("clear quant wnd");
        _body.removeChild(_quant_wnd);
      }
    }
  } else {
    if (_pureStr.length === 0 && searchCond.value.length === 6) {
    } else {
      searchCond.value = ""
    }
    alert("根据id和名称都没有找到");
  }
}

const toBeSuggestCompose = ref(null)
const totSuggObjs = ref([])
function suggestComposeLogic() {
  if (!toBeSuggestCompose.value) {
    return
  }
  totSuggObjs.value = []
  let oneRowObj = toBeSuggestCompose.value
  if (oneRowObj.hasOwnProperty('money') && oneRowObj['money'] <= -2) {
    totSuggObjs.value.push({
      "sugg_key": "当前已设置为出售",
      "sugg_val": "不应该启动"
    })
  }
  if (contStartStopObj.value.hasOwnProperty(oneRowObj['fund_id'])
      && contStartStopObj.value[oneRowObj['fund_id']]['start_stop_obj']
      && contStartStopObj.value[oneRowObj['fund_id']]['start_stop_obj']['cont_stop_flag']) {
    if (contStartStopObj.value[oneRowObj['fund_id']]['start_stop_obj']['stop_days'] < 10) {
      totSuggObjs.value.push({
        "sugg_key": "当前连停<10",
        "sugg_val": "不建议启动"
      })
    } else {
      totSuggObjs.value.push({
        "sugg_key": "当前连停>=10",
        "sugg_val": "可以启动"
      })
    }
  }
  if (contStartStopObj.value.hasOwnProperty(oneRowObj['fund_id'])
      && contStartStopObj.value[oneRowObj['fund_id']]['start_stop_obj']
      && contStartStopObj.value[oneRowObj['fund_id']]['start_stop_obj']['cont_start_flag']) {
    if (contStartStopObj.value[oneRowObj['fund_id']]['start_stop_obj']['start_days'] < 20) {
      totSuggObjs.value.push({
        "sugg_key": "当前连购<20",
        "sugg_val": "不建议停止"
      })
    } else {
      totSuggObjs.value.push({
        "sugg_key": "当前连购>=20",
        "sugg_val": "可以停止"
      })
    }
  }

  if (oneRowObj.hasOwnProperty('kbObj') && oneRowObj['kbObj'] &&
      oneRowObj['kbObj'].hasOwnProperty('positive') && oneRowObj['kbObj']['positive'] &&
      oneRowObj['kbObj']['positive'].hasOwnProperty('positive_reach_len')) {
    if (oneRowObj['kbObj']['positive']['positive_reach_len'] >= 5) {
      totSuggObjs.value.push({
        "sugg_key": "当前已处于高点",
        "sugg_val": "不建议启动"
      })
    }
    if (oneRowObj['kbObj']['positive']['positive_reach_len'] >= 7) {
      totSuggObjs.value.push({
        "sugg_key": "当前已处于非常高点",
        "sugg_val": "不建议启动，建议停止(减额/卖出)"
      })
    }
  }
  if (oneRowObj.hasOwnProperty('kbObj') && oneRowObj['kbObj'] &&
      oneRowObj['kbObj'].hasOwnProperty('negative') && oneRowObj['kbObj']['negative'] &&
      oneRowObj['kbObj']['negative'].hasOwnProperty('negative_reach_len')) {
    if (oneRowObj['kbObj']['negative']['negative_reach_len'] >= 3) {
      totSuggObjs.value.push({
        "sugg_key": "当前已处于低点",
        "sugg_val": "可以启动"
      })
    }
    if (oneRowObj['kbObj']['negative']['negative_reach_len'] >= 6) {
      totSuggObjs.value.push({
        "sugg_key": "当前已处于非常低点",
        "sugg_val": "可以启动，增额"
      })
    }
  }

  if (oneRowObj.hasOwnProperty('quant_obj') && oneRowObj['quant_obj']['max_hitted']) {
    totSuggObjs.value.push({
      "sugg_key": "当前向上突破",
      "sugg_val": "可以启动"
    })
  }
  if (oneRowObj.hasOwnProperty('quant_obj') && oneRowObj['quant_obj']['min_hitted']) {
    totSuggObjs.value.push({
      "sugg_key": "当前向下突破",
      "sugg_val": "可以停止"
    })
  }

  if (oneRowObj.hasOwnProperty('quant_obj') && oneRowObj['quant_obj'] != null &&
  oneRowObj['quant_obj'].hasOwnProperty('histo') && oneRowObj['quant_obj']['histo'] != null &&
  oneRowObj['quant_obj']['histo'].hasOwnProperty('latest_hitted_obj') && 
  oneRowObj['quant_obj']['histo']['latest_hitted_obj'] != null &&
  oneRowObj['quant_obj']['histo']['latest_hitted_obj']['max_hitted']) {
    if (!oneRowObj['quant_obj']['histo']['latest_hitted_obj']['same_as_today'] && 
    oneRowObj['quant_obj']['histo']['latest_hitted_obj']['distance_days'] < 10) {
      totSuggObjs.value.push({
        "sugg_key": "近期向上突破",
        "sugg_val": "可以启动"
      })
    }
  }

  if (oneRowObj.hasOwnProperty('quant_obj') && oneRowObj['quant_obj'] != null &&
  oneRowObj['quant_obj'].hasOwnProperty('histo') && oneRowObj['quant_obj']['histo'] != null &&
  oneRowObj['quant_obj']['histo'].hasOwnProperty('latest_hitted_obj') && 
  oneRowObj['quant_obj']['histo']['latest_hitted_obj'] != null &&
  oneRowObj['quant_obj']['histo']['latest_hitted_obj']['min_hitted']) {
    if (!oneRowObj['quant_obj']['histo']['latest_hitted_obj']['same_as_today'] && 
    oneRowObj['quant_obj']['histo']['latest_hitted_obj']['distance_days'] < 5) {
      totSuggObjs.value.push({
        "sugg_key": "近期向下突破",
        "sugg_val": "可以停止"
      })
    }
  }

  if (oneRowObj.hasOwnProperty('quant_obj') && oneRowObj['quant_obj'] != null &&
  oneRowObj['quant_obj'].hasOwnProperty('histo') && oneRowObj['quant_obj']['histo'] != null) {
    let _max_hitted_times = oneRowObj['quant_obj']['histo']['max_hitted_times']
    let _min_hitted_times = oneRowObj['quant_obj']['histo']['min_hitted_times']
    if (_max_hitted_times * 1.6 >= _min_hitted_times) {
      totSuggObjs.value.push({
        "sugg_key": "短时波动上行",
        "sugg_val": "可以启动，增额"
      })
    } else if (_max_hitted_times * 2 <= _min_hitted_times) {
      totSuggObjs.value.push({
        "sugg_key": "短时波动下行",
        "sugg_val": "可以停止，减额"
      })
    }
  }

  if (latest_sold_stat_obj.value && latest_sold_stat_obj.value[oneRowObj['fund_id']]) {
    if (oneRowObj['kbObj'] && oneRowObj['kbObj']['statistics']) {
      let _min_earn = oneRowObj['kbObj']['statistics']['min_earn'];
      let _rate_from_last_sold = latest_sold_stat_obj.value[oneRowObj['fund_id']]['rate_from_last_sold'] * 100
      if (_rate_from_last_sold < 0 && _min_earn < 0) {
          if (_rate_from_last_sold <= _min_earn * 0.6) {
              totSuggObjs.value.push({
                "sugg_key": "自卖出已下降" + latest_sold_stat_obj.value[oneRowObj['fund_id']]['rate_from_last_sold_str'],
                "sugg_val": "建议可启动"
              })
          }
      } else if (_rate_from_last_sold <= 0 && _min_earn >= 0) {
          totSuggObjs.value.push({
            "sugg_key": "自卖出已下降" + latest_sold_stat_obj.value[oneRowObj['fund_id']]['rate_from_last_sold_str'],
            "sugg_val": "建议可启动"
          })                   
      } else if (_rate_from_last_sold >= 0 && _min_earn <= 0) {                        
      } else if (_rate_from_last_sold > 0 && _min_earn > 0) {
          if (_rate_from_last_sold <= _min_earn * 0.4) {
              totSuggObjs.value.push({
                "sugg_key": "自卖出已上升" + latest_sold_stat_obj.value[oneRowObj['fund_id']]['rate_from_last_sold_str'],
                "sugg_val": "建议可启动"
              })                           
          }
      }       
    }
  }

  // if (oneRowObj.hasOwnProperty('money') && oneRowObj.hasOwnProperty('adjust_money') &&
  //     oneRowObj['money'] != null && oneRowObj['adjust_money'] != null) {
  //   if (oneRowObj['money'] >= 0) {
  //     if (oneRowObj['money'] > oneRowObj['adjust_money']) {
  //       totSuggObjs.value.push({
  //         "sugg_key": "当前行情上行",
  //         "sugg_val": "可以停止(减额/卖出)"
  //       })
  //     }
  //     if (oneRowObj['money'] < oneRowObj['adjust_money']) {
  //       totSuggObjs.value.push({
  //         "sugg_key": "当前业绩下行",
  //         "sugg_val": "可以启动(增额)"
  //       })
  //     }
  //   }
  // }

  dlgController.value.suggestDlg.show();
}

function suggestCompose4Ui(event, oneRowObj) {
  event.stopPropagation()
  toBeSuggestCompose.value = oneRowObj;
  suggestComposeLogic()
}

function hideSuggUi() {
  if (dlgController.value.suggestDlg) {
    dlgController.value.suggestDlg.hide()
  }
}

const custAddFundId = ref(null)
const custAddFundName = ref('')
const custAddComposeName = ref(null)
const custAddMoney = ref(0)
const custAddError = ref('')

function custAddCompose4Ui() {
  custAddError.value = ''
  dlgController.value.custAddDlg.show();
}

async function custAddComposeLogic() {
  if (isNaN(parseInt(custAddFundId.value))) {
    custAddError.value = '非法的fund id'
    return
  }
  for (let _comp_obj of composeObjs.value) {
    if (_comp_obj['compose_objs'] && _comp_obj['compose_objs'].length > 0) {
      let _result = _comp_obj['compose_objs'].findIndex(elem => elem['fund_id'] == custAddFundId.value)
      if (_result != -1) {
        custAddError.value = '组合中已经存在fund id'
        return
      }
    }
  }
  dlgController.value.custAddDlg.hide();
  await addOrRemoveCompose(custAddFundId.value, custAddFundName.value, custAddComposeName.value, custAddMoney.value);
  custAddFundId.value = ''
  custAddFundName.value = ''
  custAddComposeName.value = null
  custAddMoney.value = 0
}

function cancelCustAddCompose() {
  if (dlgController.value.custAddDlg) {
    dlgController.value.custAddDlg.hide();
  }
  custAddError.value = ''
}

async function setComposeProperty_wrapper(_fund_id, _fund_name, _compose_name, _money, _buyin_source, _loss_flag) {
  let _show4SoldOnly  = show4SoldOnly.value
  let _showPauseOnly  = showPauseOnly.value
  let _showAdjustOnly = showAdjustOnly.value
  let _showPoleOnly   = showPoleOnly.value
  let _showNoteOnly   = showNoteOnly.value

  await setComposeProperty(_fund_id, _fund_name, _compose_name, _money, _buyin_source, _loss_flag);

  show4SoldOnly.value = false
  showPauseOnly.value = false
  showAdjustOnly.value = false
  showPoleOnly.value = false
  showNoteOnly.value = false

  setTimeout(function() {
    show4SoldOnly.value  = _show4SoldOnly
    showPauseOnly.value  = _showPauseOnly
    showAdjustOnly.value = _showAdjustOnly
    showPoleOnly.value   = _showPoleOnly
    showNoteOnly.value   = _showNoteOnly
  }, 1500)
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

.standard_height {
  line-height: 1rem;
}

.icon_tri {
  display: inline-block;
  font-size: 0.8rem;
  line-height: 0.9;
  position: absolute;
  top: 6px;
  font-weight: normal; 
  padding-left: 3px;
}

.hover_tip {
  background-color: red;
  color: white;
  font-weight: bold;
  position: absolute;
  font-size: 0.9rem;
  left: -4rem;
  top: 2rem;
  border-radius: 5px;
  /* width: 11.5rem; */
  text-align: center;
  padding: 2px 5px 2px 5px;
}

</style>
