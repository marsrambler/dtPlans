<template>
  <div :style="topSecClass">
    <div id="op_pane" :style="{ 'height': opPaneHeight + 'rem' }" class="grid_pane_c8">
      <div style="display:flex;flex-wrap:nowrap;align-items:center;">
        <select class="form-select" style="width:6.2rem;font-size:0.95rem;" v-model="report_select">
          <option v-for="option in report_select_option" v-bind:value="option.source_val">
            {{ option.source_name }}
          </option>
        </select>
        <div style="display:inline-block;margin-left:2px;font-size:0.95rem;text-wrap:nowrap;">({{dynRecordObjs.length}})</div>
      </div>
      <!--
      <div style="grid-column: 2 / span 3; display: flex; flex-wrap: nowrap; column-gap: 0.5rem; align-items: center;">
        <div style="font-size:0.95rem; text-wrap: nowrap;">({{dynRecordObjs.length}})&nbsp;请求ID/,</div>
        <input type="text" v-model="requireFundIds" class="form-control-plaintext search_box"
          style="padding-left:0.2rem;padding-right:0.2rem;">      
      </div>
      <input class="btn btn-primary btn-sm" type="button" value="请求" @click="requireDynValues4ui();">
      -->
      <!--
      <input class="btn btn-info btn-sm" type="button" v-bind:value="canAddAllFlag? '全选' : '取消'"
      @click="allAllFundIntoRequestList();">
      -->
      <input type="text" v-model="searchFundNameOrFundId" class="form-control-plaintext search_box"
             style="padding-left: 0.2rem;" @keyup.enter="excuteSearchFund()">
      <input class="btn btn-primary btn-sm" type="button" value="查找" @click="excuteSearchFund();">
      <input class="btn btn-warning btn-sm" type="button" value="清除浏览器数据" @click="syncServerData()">
      <div class="form-check form_check_cust" style="margin-left: 1rem;">
        <input class="form-check-input" type="checkbox" id="inc_perc" v-model="inc_earn_perc">
        <label class="form-check-label" for="inc_perc">盈利曲线</label>
      </div>
      <div class="form-check form_check_cust" style="margin-left: 1rem;">
        <input class="form-check-input" type="checkbox" id="inc_comments" v-model="inc_comments">
        <label class="form-check-label" for="inc_comments">笔记弹幕</label>
      </div>
      <div class="form-check form_check_cust" style="margin-left: 0rem;">
        <input class="form-check-input" type="checkbox" id="show_latest" v-model="onlyShowLatest">
        <label class="form-check-label" for="show_latest">仅看最近</label>
      </div>
      <input class="btn btn-primary btn-sm" type="button" value="请求全部净值" @click="requireDynValues4ui(true);">
    </div>
    <table id="table_header" class="table table-bordered" style="margin-bottom: 0;">
      <thead style="">
        <tr :style="{ 'height': tabHeaderHeight + 'rem' }">
          <th :style="{ 'width': colWidMap['col_1'] + 'rem' }">
            <div class="w50_w_br" @click="sortByField('update_date')">
              <template v-if="sortFieldName === 'update_date'">
                <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
                <span v-else><i class="bi bi-arrow-down"></i></span>
              </template>
              <span>更新</span>
            </div>
            <div class="w50_w_br" @click="sortByField('avg_hold_days')" style="border: none;">
              <template v-if="sortFieldName === 'avg_hold_days'">
                <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
                <span v-else><i class="bi bi-arrow-down"></i></span>
              </template>
              <span style="font-size:0.9rem;">平均持有期</span>
            </div>
          </th>
          <th :style="{ 'width': colWidMap['col_2'] + 'rem' }">
            <div class="w50_w_br" @click="sortByField('min_earn')">
              <template v-if="sortFieldName === 'min_earn'">
                <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
                <span v-else><i class="bi bi-arrow-down"></i></span>
              </template>
              <span>回撤</span>
            </div>
            <div class="w50_w_br" @click="sortByField('earn_per_year')" style="border: none;">
              <template v-if="sortFieldName === 'earn_per_year'">
                <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
                <span v-else><i class="bi bi-arrow-down"></i></span>
              </template>
              <span>年化</span>
            </div>            
          </th>
          <th :style="{ 'width': colWidMap['col_3'] + 'rem' }">
            <div class="w50_w_br" @click="sortByField('hold_length')">
              <template v-if="sortFieldName === 'hold_length'">
                <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
                <span v-else><i class="bi bi-arrow-down"></i></span>
              </template>
              <span style="font-size:0.8rem;">总持有期</span>
            </div> 
            <div class="w50_w_br" @click="sortByField('buyin_weight')" style="border: none;">
              <template v-if="sortFieldName === 'buyin_weight'">
                <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
                <span v-else><i class="bi bi-arrow-down"></i></span>
              </template>
              <span>权重</span>
            </div>
          </th>
          <th :style="{ 'width': colWidMap['col_4'] + 'rem' }">
            <div class="w50_w_br" @click="sortByField('last_sold')">
              <template v-if="sortFieldName === 'last_sold'">
                <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
                <span v-else><i class="bi bi-arrow-down"></i></span>
              </template>
              <span>卖出</span>
            </div>
            <div class="w50_w_br" @click="sortByField('rate_after_sold')" style="border: none;">
              <template v-if="sortFieldName === 'rate_after_sold'">
                <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
                <span v-else><i class="bi bi-arrow-down"></i></span>
              </template>
              <span>走势</span>
            </div>
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
              <div style="height:5rem;white-space:nowrap;">
                <div style="display: flex; align-items: center;">
                  <span>
                  {{ oneRow.fund_id }}
                  </span>
                  <span style="padding: 1px 3px; border-radius: 5px; border: solid 1px darkgreen; color: darkgreen; margin-left: 0.5rem; margin-right: 0.5rem; cursor: pointer;"
                  @click.stop="addBuyOrSoldNote(oneRow['fund_id'], oneRow['fund_name'], true, false,
                    (oneRow['tranStateObj'] && oneRow['tranStateObj']['compose_plan'])? oneRow['tranStateObj']['compose_plan'] : ''
                  )">
                  想买<template v-if="buyOrSoldObj[oneRow['fund_id']] && buyOrSoldObj[oneRow['fund_id']]['buy_times']">({{buyOrSoldObj[oneRow['fund_id']]['buy_times']}})</template>
                  </span>
                  <span style="padding: 1px 3px; border-radius: 5px; border: solid 1px chocolate; color: chocolate; cursor: pointer;"
                  @click.stop="addBuyOrSoldNote(oneRow['fund_id'], oneRow['fund_name'], false, true,
                    (oneRow['tranStateObj'] && oneRow['tranStateObj']['compose_plan'])? oneRow['tranStateObj']['compose_plan'] : ''
                  )">
                  想卖<template v-if="buyOrSoldObj[oneRow['fund_id']] && buyOrSoldObj[oneRow['fund_id']]['sold_times']">({{buyOrSoldObj[oneRow['fund_id']]['sold_times']}})</template>
                  </span>                
                </div>
                <template v-if="noteObjs[oneRow['fund_id']] && noteObjs[oneRow['fund_id']]['full_comments'] && noteObjs[oneRow['fund_id']]['full_comments'].length > 0">
                  <div style="position: relative;--tooltip-left:0rem;--tooltip-top:1.5rem;cursor: pointer;display:flex;align-items:center;justify-content:start;flex-wrap:nowrap;padding-top:5px;padding-bottom:5px;"
                       v-bind:data-title="noteObjs[oneRow['fund_id']]['full_comments']" data-float-no-pos-sm="" @click.stop="switchWriteNote(oneRow)">
                    <template v-if="noteObjs && noteObjs[oneRow['fund_id']] && noteObjs[oneRow['fund_id']]['note_objs'] && noteObjs[oneRow['fund_id']]['note_objs'].length > 0">
                          <span style="font-weight:bold;color:red;border:solid 1px red;border-radius:5px; padding:0 5px 0 3px;font-size:0.9rem;margin-left:0.2rem;margin-right:0.2rem;">
                          {{noteObjs[oneRow['fund_id']]['note_objs'].length}}
                          </span>
                    </template>
                    <span style="display:inline-block;max-width:10rem;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;">
                      {{ oneRow.fund_name }}
                    </span>
                  </div>
                </template>
                <template v-else>
                  <div style="cursor:pointer;padding-top:5px;padding-bottom:5px;text-wrap:nowrap;" @click.stop="switchWriteNote(oneRow)">
                    <span style="display:inline-block;max-width:12rem;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;">
                      {{ oneRow.fund_name }}
                    </span>
                  </div>
                </template>
                <div>净值日:&nbsp;<span class="text-bg-warning">{{ oneRow.statistics?.latest_price_date }}</span></div>
              </div>

              <div style="margin-top: 5px;padding-top:5px;line-height:1.2;">
                <template v-if="!onlyShowLatest">
                  <div>
                    <template v-if="oneRow['statistics'] && oneRow['statistics']['tot_exchange_days_natural']">
                      <span style="font-size:0.9rem;">总持:&nbsp;{{ oneRow.statistics.tot_exchange_days_natural }}日</span>
                    </template>                  
                    <template v-if="oneRow.hasOwnProperty('real_sold_times')">
                      <span style="margin-left:5px;font-size:0.9rem;">实卖:&nbsp;{{ oneRow.real_sold_times }}次</span>
                    </template>
                  </div>
                </template>
                <template v-if="oneRow.hasOwnProperty('avg_sold_natural_days')">
                  <div style="font-size:0.9rem;">
                    <template v-if="!onlyShowLatest">
                      平均持有:&nbsp;
                    </template>
                    <template v-else>
                      单次持有:&nbsp;
                    </template>
                    {{ oneRow.avg_sold_natural_days }}日
                  </div>
                </template>
                <template v-if="oneRow['statistics'] && oneRow['statistics']['last_sold_profit'] && oneRow['statistics']['last_sold_profit']['currStatistics'] && oneRow['statistics']['last_sold_profit']['currStatistics']['tot_profit_perc_str']">
                  <div style="font-size:0.9rem;">
                    <template v-if="!onlyShowLatest">
                      平均盈利:&nbsp;
                    </template>
                    <template v-else>
                      单次盈利:&nbsp;
                    </template>                    
                    <span :style="{
                      'color':  oneRow['statistics']['last_sold_profit']['currStatistics']['tot_profit_perc'] >= 0? 'red': 'darkgreen',
                      'font-weight': 'bold',
                      'font-size': '0.9rem'
                    }">
                      {{ oneRow['statistics']['last_sold_profit']['currStatistics']['tot_profit_perc_str'] }}
                    </span>
                  </div>
                </template>
                <template v-if="oneRow['trans_profit_per_year_str']">
                  <div style="font-size:0.9rem;">折合年化:&nbsp;
                    <span :style="{
                      'color': oneRow['trans_profit_per_year'] >= 0? 'red': 'darkgreen',
                      'font-weight': 'bold',
                      'font-size': '0.9rem'
                    }">
                      {{ oneRow['trans_profit_per_year_str'] }}
                    </span>
                  </div>
                </template>                                    
              </div>
            </td>
            <td v-bind:class="{ sel_row: oneRow['currSelected'] }">
              <template v-if="zskbViewObjs && zskbViewObjs[oneRow.fund_id]">
                <div style="height:5rem;line-height:1.7;">
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
                </div>
                <template v-if="fundBuyWeight.hasOwnProperty(oneRow.fund_id)">
                  <div style="margin-top:5px;padding-top:5px;text-align:right;display:flex;align-items:center;justify-content:end;flex-wrap:nowrap;text-wrap:nowrap;column-gap:3px;">
                    <template v-if="oneRow['tranStateObj'] && oneRow['tranStateObj']['compose_plan'] && oneRow['tranStateObj']['compose_plan'] === 'ovtree'">
                      <span class="badge bg-primary text-bg-success big_badge stack_2_info">
                        橄榄树
                      </span>
                    </template>
                    <template v-else-if="oneRow['tranStateObj'] && oneRow['tranStateObj']['compose_plan'] && oneRow['tranStateObj']['compose_plan'] === 'flyhorse'">
                      <span class="badge bg-secondary text-bg-success big_badge stack_2_info">
                        飞马
                      </span>
                    </template>
                    <template v-else-if="oneRow['tranStateObj'] && oneRow['tranStateObj']['compose_plan'] && oneRow['tranStateObj']['compose_plan'] === 'medusa'">
                      <span class="badge text-bg-success big_badge stack_2_info" style="background-color:purple !important;">
                        美杜莎
                      </span>
                    </template>                                            
                    <template v-else-if="oneRow['tranStateObj'] && oneRow['tranStateObj']['compose_plan'] && oneRow['tranStateObj']['compose_plan'] === 'dolphin'">
                        <span class="badge bg-info text-bg-success big_badge stack_2_info">
                          海豚
                        </span>
                    </template>
                    <template v-else-if="oneRow['tranStateObj'] && oneRow['tranStateObj']['compose_plan'] && oneRow['tranStateObj']['compose_plan'] === 'trident'">
                        <span class="badge bg-success text-bg-success big_badge stack_2_info">
                          三叉戟
                        </span>
                    </template>
                    <template v-else-if="oneRow['tranStateObj'] && oneRow['tranStateObj']['compose_plan'] && oneRow['tranStateObj']['compose_plan'] === 'gdngoat'">
                        <span class="badge bg-danger text-bg-success big_badge stack_2_info">
                          金毛羊
                        </span>
                    </template>
                    <template v-else-if="oneRow['tranStateObj'] && oneRow['tranStateObj']['compose_plan'] && oneRow['tranStateObj']['compose_plan'] === 'bigpool'">
                        <span class="badge bg-warning text-bg-success big_badge stack_2_info">
                          大池
                        </span>
                    </template>
                    <template v-else>
                        <span class="badge bg-dark text-bg-success big_badge para_info" style="font-size:0.7rem !important;padding:1px 12px !important;">
                          无
                        </span>
                    </template>                  
                    <span style="font-size:0.9rem;text-wrap:nowrap;">权重:</span>
                    <!--
                    <span :style="{
                    'color': fundBuyWeight[oneRow.fund_id] > 100? 'red' : fundBuyWeight[oneRow.fund_id] < 100? 'darkgreen' : 'black', 
                    'font-weight': fundBuyWeight[oneRow.fund_id] != 100? 'bold' : 'normal'}">
                    {{fundBuyWeight[oneRow.fund_id]}}
                    </span>
                    -->
                    <input type="number" style="width:4rem;border-radius:5px;" 
                    :style="{
                    'color': fundBuyWeight[oneRow.fund_id] > 100? 'red' : fundBuyWeight[oneRow.fund_id] < 100? 'darkgreen' : 'black', 
                    'font-weight': fundBuyWeight[oneRow.fund_id] != 100? 'bold' : 'normal'}"
                    v-model="fundBuyWeight[oneRow.fund_id]" @click.stop>
                  </div>
                </template>
                <!--
                <div style="display:flex;margin-top:5px;column-gap:8px;">
                  <button type="button" class="btn btn-outline-danger" style="font-size:0.9rem !important;padding-left:2px;padding-right:2px;" 
                  @click="setFundWeightFromUI(oneRow, 'inc', fundBuyWeight[oneRow.fund_id])">
                    增加权重
                  </button>
                  <button type="button" class="btn btn-outline-primary" style="font-size:0.9rem !important;padding-left:2px;padding-right:2px;" 
                  @click="setFundWeightFromUI(oneRow, 'dec', fundBuyWeight[oneRow.fund_id])">
                    减小权重
                  </button>
                </div>
                -->
                <div style="display:flex;margin-top:5px;column-gap:8px;align-items:center;justify-content:end;">
                  <button type="button" class="btn btn-outline-primary" style="font-size:0.9rem !important;padding-left:2px;padding-right:2px;"
                  :style="{
                  'font-weight': (fundBuyWeightTest.hasOwnProperty(oneRow.fund_id) && fundBuyWeightTest[oneRow.fund_id])? 'bold': ''
                  }" 
                  @click="setFundWeightFromUI(oneRow, 'test', fundBuyWeight[oneRow.fund_id])">
                    测试权重
                    <template v-if="fundBuyWeightTest.hasOwnProperty(oneRow.fund_id) && fundBuyWeightTest[oneRow.fund_id]">
                    *
                    </template>
                  </button>                
                  <button type="button" class="btn btn-outline-danger" style="font-size:0.9rem !important;padding-left:2px;padding-right:2px;" 
                  @click="setFundWeightFromUI(oneRow, 'set', fundBuyWeight[oneRow.fund_id])">
                    设置权重
                  </button>
                </div>
              </template>
            </td>
            <td v-bind:class="{ sel_row: oneRow['currSelected'] }">
              <!--
              <div style="height: 7rem; overflow: hidden; text-overflow: ellipsis; word-break: break-all;">
              -->
                <div>起:&nbsp;{{ oneRow.statistics?.buy_first_day }}</div>
                <div>止:&nbsp;{{ oneRow.statistics?.buy_last_day }}</div>
                <div>计:&nbsp;{{ oneRow.statistics?.tot_exchange_days }}天</div>
                <div>共:&nbsp;{{ oneRow.statistics?.tot_hold_days }}天</div>
              <!--
              </div>
              -->             
              <!--
              <template v-if="oneRow.statistics && oneRow.statistics.rate_from_last_sold">
                <div style="border-top: solid 1px gray; margin-top: 0.5rem; padding-top: 0.5rem; line-height: 1.2rem;">
                  <span v-if="oneRow.statistics.rate_from_last_sold >= 0" class="text-bg-danger">
                    &nbsp;自卖:&nbsp;{{oneRow.statistics.days_from_last_sold}}日&nbsp;
                  </span>
                  <span v-else style="color: white; background-color: darkgreen;">
                    &nbsp;自卖:&nbsp;{{oneRow.statistics.days_from_last_sold}}日&nbsp;
                  </span>
                </div>
              </template>
              -->
            </td>
            <td style="line-height:1.2rem;position:relative;" v-bind:class="{ sel_row: oneRow['currSelected'] }">
              <div style="display:flex;flex-direction:column;position:absolute;top:5px;left:5px;bottom:5px;right:5px;justify-content:space-between;">
                <div style="overflow: hidden; text-overflow: ellipsis; word-break: break-all;">
                  <template v-if="oneRow.soldHistoryWrapper_reverse" :key="one_sold.date_str">
                    <template v-for="(one_sold, index) in oneRow.soldHistoryWrapper_reverse">
                      <span v-if="index === 0 && oneRow.soldHistoryWrapper_reverse.length > 1" class="text-bg-warning">
                        {{ one_sold?.date_str }}<span v-if="oneRow.statistics && oneRow.statistics.rate_from_last_sold">
                          ({{oneRow.statistics.days_from_last_sold}})</span>
                      </span>
                      <span v-else-if="index === 0 && oneRow.soldHistoryWrapper_reverse.length === 1" class="text-bg-warning">
                        {{ one_sold?.date_str }}<span v-if="oneRow.statistics && oneRow.statistics.rate_from_last_sold">
                          ({{oneRow.statistics.days_from_last_sold}})</span>
                      </span>
                      <span v-else-if="index !== oneRow.soldHistoryWrapper_reverse.length - 1">
                        &nbsp;{{ one_sold?.date_str }}&nbsp;
                      </span>
                      <span v-else>
                        &nbsp;{{ one_sold?.date_str }}&nbsp;
                      </span>
                    </template>
                  </template>
                </div>
                <template v-if="!oneRow['soldList4draw'] || oneRow['soldList4draw'].length === 0">
                  <div style="display:flex;align-items:center;justify-content:space-around;">
                    <button type="button" class="btn btn-primary" style="font-size: 0.8rem;padding-left:5px;padding-right:5px;"
                      @click.stop="switchWriteNote(oneRow)">
                      笔记<template v-if="noteObjs && noteObjs[oneRow['fund_id']] && noteObjs[oneRow['fund_id']]['note_objs'] && noteObjs[oneRow['fund_id']]['note_objs'].length > 0">
                        ({{noteObjs[oneRow['fund_id']]['note_objs'].length}})
                      </template>
                    </button>                
                  </div>
                </template>
                <template v-else>
                <!-- template v-if="oneRow.statistics && oneRow.statistics.rate_from_last_sold" -->
                  <div style="display:flex;align-items:center;justify-content:space-evenly;">
                    <span v-if="oneRow.statistics && oneRow.statistics.rate_from_last_sold != null 
                    && oneRow.statistics.rate_from_last_sold >= 0" class="text-bg-danger" style="line-height:1.8;">
                      &nbsp;计:&nbsp;{{oneRow?.statistics?.rate_from_last_sold_str}}&nbsp;
                    </span>
                    <span v-else style="color: white; background-color:darkgreen;line-height:1.8;">
                      &nbsp;计:&nbsp;{{oneRow?.statistics?.rate_from_last_sold_str}}&nbsp;
                    </span>
                    <button type="button" class="btn btn-primary" style="font-size: 0.8rem;padding-left:5px;padding-right:5px;"
                      @click.stop="switchWriteNote(oneRow)">
                      笔记<template v-if="noteObjs && noteObjs[oneRow['fund_id']] && noteObjs[oneRow['fund_id']]['note_objs'] && noteObjs[oneRow['fund_id']]['note_objs'].length > 0">
                        ({{noteObjs[oneRow['fund_id']]['note_objs'].length}})
                      </template>
                    </button>
                  </div>
                </template>
              </div>
            </td>
            <td v-bind:class="{ sel_row: oneRow['currSelected'] }">
              <div>买:&nbsp;{{ oneRow.statistics?.buy_times }}</div>
              <div>卖:&nbsp;{{ oneRow.statistics?.sold_times }}</div>
              <div>加:&nbsp;{{ oneRow.statistics?.asc_money_times }}</div>
              <div>减:&nbsp;{{ oneRow.statistics?.desc_money_times }}</div>
              <div>追:&nbsp;{{ oneRow.statistics?.append_fixed_times }}</div>              
            </td>
            <td style="line-height: 1.2rem;" v-bind:class="{ sel_row: oneRow['currSelected'] }">
              <template v-if="oneRow.statistics && oneRow.statistics.last_sold_profit && oneRow.statistics.last_sold_profit.currStatistics && oneRow.statistics.last_sold_profit.currStatistics.tot_profit_perc_str">
                <template v-if="oneRow.statistics.last_sold_profit.currStatistics.tot_profit_perc_str[0] == '-'">
                  <div class="text-bg-success">卖:&nbsp;{{ oneRow.statistics?.last_sold_profit?.currStatistics?.tot_profit_perc_str }}</div>
                </template>
                <template v-else>
                  <div class="text-bg-danger">卖:&nbsp;{{ oneRow.statistics?.last_sold_profit?.currStatistics?.tot_profit_perc_str }}</div>
                </template>                
              </template>
              <template v-else>
                <div>卖:&nbsp;{{ oneRow.statistics?.last_sold_profit?.currStatistics?.tot_profit_perc_str }}</div>
              </template>
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
              <template v-if="oneRow.statistics && oneRow.statistics.latest_price_date_profit && oneRow.statistics.latest_price_date_profit.tot_profit_perc_str">
                <template v-if="oneRow.statistics.latest_price_date_profit.tot_profit_perc_str[0] == '-'">
                  <div class="text-bg-success">卖:&nbsp;{{ oneRow.statistics?.latest_price_date_profit?.tot_profit_perc_str }}</div>
                </template>
                <template v-else>
                  <div class="text-bg-danger">卖:&nbsp;{{ oneRow.statistics?.latest_price_date_profit?.tot_profit_perc_str }}</div>
                </template>                
              </template>
              <template v-else>
                <div>卖:&nbsp;{{ oneRow.statistics?.latest_price_date_profit?.tot_profit_perc_str }}</div>
              </template>
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
              <div class="flex_col" style="align-items:end !important;row-gap:6px;padding-right:0.6rem;"> <!-- style="height: 9rem;" -->
                <button type="button" class="btn btn-primary" @click="genReport(oneRow)">
                  详情报告
                </button>
                <!--
                <button type="button" class="btn btn-secondary" @click="addFundId4UpdateDynValue(oneRow['fund_id'])">
                  <template v-if="oneRow['add_refresh_flag']">
                    ✓刷新
                  </template>
                  <template v-else>
                    刷新
                  </template>
                </button>
                <button type="button" class="btn btn-warning" @click="removeDynFileFromUi($event, oneRow)">
                  删除
                </button>
                -->
                <button type="button" class="btn btn-secondary" @click="getFundHistoryStat(oneRow.fund_id, oneRow.fund_name)">
                  买卖历史
                </button>
                <template v-if="fundHistoryStatMap[oneRow.fund_id] && 
                (
                  (
                  fundHistoryStatMap[oneRow.fund_id]['buy_date_list'] && 
                  fundHistoryStatMap[oneRow.fund_id]['buy_date_list'].length > 0
                  ) 
                  || 
                  (
                  fundHistoryStatMap[oneRow.fund_id]['sold_date_list'] && 
                  fundHistoryStatMap[oneRow.fund_id]['sold_date_list'].length > 0                  
                  )
                ) && 
                (
                  currDynValue && currDynValue['fund_id'] && 
                  currDynValue['fund_id'] == oneRow.fund_id
                )">
                  <input type="text" class=""
                         style="border-radius:5px;border-width:1px;outline:none;width:6.5rem;"
                         v-model="fundHistoryStatMap[oneRow.fund_id]['target_date_str']">

                  <template v-if="fundHistoryStatMap[oneRow.fund_id]['target_date_str'] && fundHistoryStatMap[oneRow.fund_id]['target_date_str'].trim() != ''">
                    <div style="display:flex;flex-wrap:nowrap;text-wrap:nowrap;column-gap:5px;">
                    <button type="button" class="btn btn-warning" style="padding-left:6px !important;padding-right:6px !important;"
                    @click="removeFundHistoryStatUI(oneRow.fund_id, oneRow.fund_name, fundHistoryStatMap[oneRow.fund_id]['target_date_str'].trim(), 'buy')">
                      删买
                    </button>
                    <button type="button" class="btn btn-warning" style="padding-left:6px !important;padding-right:6px !important;"
                    @click="removeFundHistoryStatUI(oneRow.fund_id, oneRow.fund_name, fundHistoryStatMap[oneRow.fund_id]['target_date_str'].trim(), 'sold')">
                      删卖
                    </button>                    
                    </div>                  
                  </template>
                </template>                
              </div>
            </td>
          </tr>
          <tr v-if="oneRow['show_write_note']">
            <td colspan="8" style="background-color: lightblue;">
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
          <tr v-if="currDynValue && currDynValue['fund_id'] == oneRow['fund_id']">
            <td colspan=8>
              <div class="op_pane_sub flex_act_pane">
                <button type="button" class="btn btn-secondary from_ctl_nr" @click="yAxisTopAdjTimes += 1;">&nbsp;+&nbsp;顶</button>
                <button type="button" class="btn btn-secondary from_ctl_nr" @click="yAxisTopAdjTimes -= 1;">&nbsp;-&nbsp;顶</button>
                <button type="button" class="btn btn-secondary from_ctl_nr" @click="yAxisBtmAdjTimes += 1;">&nbsp;+&nbsp;底</button>
                <button type="button" class="btn btn-secondary from_ctl_nr" @click="yAxisBtmAdjTimes -= 1;">&nbsp;-&nbsp;底</button>
                <button type="button" class="btn btn-secondary from_ctl_nr" @click="picHeightAdjVal += 20;">&nbsp;+&nbsp;高</button>
                <button type="button" class="btn btn-secondary from_ctl_nr" @click="picHeightAdjVal -= 20;">&nbsp;-&nbsp;高</button>
                <input type="text" class="from_ctl_nr" style="width: 12rem;" v-model="oneRow['remove_asc_or_desc_or_sold_date']">
                <button type="button" class="btn btn-secondary from_ctl_nr" @click="remove_Asc_or_Desc_or_Sold_Date(oneRow)"
                        v-bind:disabled="!oneRow['remove_date_type'] || oneRow['remove_date_type'] ==='' || remove_inprogress">
                  <template v-if="!oneRow['remove_date_type'] || oneRow['remove_date_type'] ===''">
                    移除项
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
                <div style="line-height: 2rem;" class="flex_act_pane" v-if="oneRow['tranStateObj']">
                  <div class="para_info">
                    <div>
                      <div class="stack_2_info">总:&nbsp;{{oneRow['tranStateObj']['tot_money']}}</div>
                    </div>
                    <div class="sep_line">
                      <div class="stack_2_info">额:&nbsp;{{oneRow['tranStateObj']['money']}}</div>
                    </div>
                  </div>
                  <template v-if="oneRow['tranStateObj'].hasOwnProperty('orig_summ_level') && oneRow['tranStateObj']['orig_summ_level'] != null">
                    <div class="para_info" style="position: relative; cursor: pointer;" @mouseover="oneRow['show_summ_tip']=true;" 
                    @mouseleave="oneRow['show_summ_tip']=false;">
                      <div>
                        <div class="stack_2_info">
                          原:&nbsp;<span class="level_info"
                                        v-bind:class="getFixedRetroClassV2(oneRow['tranStateObj']['orig_summ_level'])">
                        {{ oneRow['tranStateObj']['orig_summ_level'] }}</span>
                        </div>
                      </div>
                      <div class="sep_line">
                        <div class="stack_2_info">
                          设:&nbsp;<span class="level_info"
                                        v-bind:class="getFixedRetroClassV2(oneRow['tranStateObj']['subs_summ_level'])">
                        {{ oneRow['tranStateObj']['subs_summ_level'] }}</span>
                        </div>
                      </div>
                      <template v-if="oneRow['show_summ_tip']">
                        <span style="position:absolute;left:0rem;top:3.2rem;display:inline-block;width:7rem;font-size:0.9rem;background-color:gold;
                        border-radius:5px;font-weight: bold;z-index: 100;"
                            :style="{'background-color':summ_level_tips_map[oneRow['tranStateObj']['subs_summ_level']]['bgcolor'],
                            'color':summ_level_tips_map[oneRow['tranStateObj']['subs_summ_level']]['color'],
                            'border':summ_level_tips_map[oneRow['tranStateObj']['subs_summ_level']]['bd']}"
                            >
                          {{summ_level_tips_map[oneRow['tranStateObj']['subs_summ_level']]['cmt']}}
                        </span>
                      </template>	
                    </div>
                  </template>
                  <div class="para_info">
                    <div>
                      <div class="stack_2_info">
                        盈:&nbsp;<span class="val_font_color"
                                      :style="{color: oneRow['tranStateObj']['tot_rate'] >= 0? 'red' : 'darkgreen'}">
                        {{ oneRow['tranStateObj']['tot_rate_str'] }}</span>
                      </div>
                    </div>
                    <div class="sep_line">
                      <div class="stack_2_info">
                        日:&nbsp;<span class="val_font_color"
                                      :style="{color: oneRow['tranStateObj']['rate_val'] >= 0? 'red' : 'darkgreen'}">
                        {{ oneRow['tranStateObj']['rate_str'] }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="para_info">
                    <div>
                      <template v-if="oneRow['tranStateObj'] && oneRow['tranStateObj']['compose_plan'] && oneRow['tranStateObj']['compose_plan'] === 'ovtree'">
                        <span class="badge bg-primary text-bg-success big_badge stack_2_info">
                          橄榄树
                        </span>
                      </template>
                      <template v-else-if="oneRow['tranStateObj'] && oneRow['tranStateObj']['compose_plan'] && oneRow['tranStateObj']['compose_plan'] === 'flyhorse'">
                        <span class="badge bg-secondary text-bg-success big_badge stack_2_info">
                          飞马
                        </span>
                      </template>
                      <template v-else-if="oneRow['tranStateObj'] && oneRow['tranStateObj']['compose_plan'] && oneRow['tranStateObj']['compose_plan'] === 'medusa'">
                        <span class="badge text-bg-success big_badge stack_2_info" style="background-color:purple !important;">
                          美杜莎
                        </span>
                      </template>                                            
                      <template v-else-if="oneRow['tranStateObj'] && oneRow['tranStateObj']['compose_plan'] && oneRow['tranStateObj']['compose_plan'] === 'dolphin'">
                          <span class="badge bg-info text-bg-success big_badge stack_2_info">
                            海豚
                          </span>
                      </template>
                      <template v-else-if="oneRow['tranStateObj'] && oneRow['tranStateObj']['compose_plan'] && oneRow['tranStateObj']['compose_plan'] === 'trident'">
                          <span class="badge bg-success text-bg-success big_badge stack_2_info">
                            三叉戟
                          </span>
                      </template>
                      <template v-else-if="oneRow['tranStateObj'] && oneRow['tranStateObj']['compose_plan'] && oneRow['tranStateObj']['compose_plan'] === 'gdngoat'">
                          <span class="badge bg-danger text-bg-success big_badge stack_2_info">
                            金毛羊
                          </span>
                      </template>
                      <template v-else-if="oneRow['tranStateObj'] && oneRow['tranStateObj']['compose_plan'] && oneRow['tranStateObj']['compose_plan'] === 'bigpool'">
                          <span class="badge bg-warning text-bg-success big_badge stack_2_info">
                            大池
                          </span>
                      </template>
                      <template v-else>
                          <span class="badge bg-dark text-bg-success big_badge para_info" style="font-size:0.7rem !important;padding:1px 12px !important;">
                            无
                          </span>
                      </template>
                    </div>
                    <div class="sep_line">
                      <template v-if="oneRow['tranStateObj']['orig_summ_level']">
                        <a class="stack_2_info" v-bind:href="baseUrl4ProbeNav + oneRow.fund_id" target="_blank"
                          style="cursor: pointer; text-decoration: underline; color: darkslateblue;">
                          去配置
                        </a>
                      </template>
                      <template v-else>
                        <a class="stack_2_info" v-bind:href="baseUrl4ComposeNav + oneRow.fund_id + '&dt_compose=' + oneRow['tranStateObj']['compose_plan']" target="_blank"
                          style="cursor: pointer; text-decoration: underline; color: darkslateblue;">
                          去配置
                        </a>
                      </template>
                    </div>
                  </div>
                </div>
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
          <template v-if="cfmDlgType === 'bulk dynvalues'">
            <h6 style="word-break:break-all;">{{ cfmDlgCont }}:&nbsp;全部净值</h6>
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
          <template v-if="cfmDlgType === 'bulk dynvalues'">
            <button type="button" class="btn btn-primary" @click.prevent="executeAction();">确认</button>
          </template>          
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
          <template v-if="toBeRemoveFund">
            <h6>{{ toBeRemoveFund['fund_name'] }}&nbsp;&nbsp;将被删除</h6>
          </template>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
          <button type="button" class="btn btn-warning" @click.prevent="removeDynFileLogic()">删除
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
  topSecClass, getTodayStr
} from "../lib/commonUtils.js"
import {onMounted, onUnmounted, computed, ref, watch, nextTick, onActivated} from "vue";
import { storeToRefs } from 'pinia'
import { useZskbStore } from '../store/zskbStore';
import { useReportStore } from "../store/reportStore.js";
import { Modal, Alert } from "bootstrap";
import { useComposeStore } from "../store/composeStore.js";
import { useBuyInOutStore } from '../store/buyInOutStore.js';
import { useRoute } from 'vue-router'

const route = useRoute()
const zskbStore = useZskbStore()
const { zskbObjs } = storeToRefs(zskbStore)

const reportStore = useReportStore()
const { dynRecordObjs_full, dynRecordObjs_latest, dynRecordObjs, onlyShowLatest, report_select, reportObjsReloaded, fundBuyWeight, fundBuyWeightTest, fundHistoryStatMap } = storeToRefs(reportStore)
const { requireDynValues, getRecordsAndRates, removeLocalDynvalue, getBigPoolFixedHold, getIndexRtRate, removeDate4Report, syncServerData, getFundBuyWeight, setFundBuyWeight, getFundHistoryStat, removeFundHistoryStat } = reportStore

const composeStore = useComposeStore()
const {noteObjs, noteReportObjs} = storeToRefs(composeStore)
const {getFundNotes4Report, getFundNotes4Edit, updateFundNotes, removeFundNotes} = composeStore

const buyInOutStore = useBuyInOutStore()
const { buyOrSoldObj } = storeToRefs(buyInOutStore)
const { addBuyOrSoldNote, getBuyOrSoldNote } = buyInOutStore

const colWidMap = {
  'col_1': 6,
  'col_2': 5,
  'col_3': 4.5,
  'col_4': 4.5,
  'col_5': 3,
  'col_6': 3.5,
  'col_7': 3.5,
  'col_8': 4
}

const report_select_option = [
  { 'source_name': '全部', 'source_val': 'all' },
  { 'source_name': '卖出', 'source_val': 'only_sold' },
  { 'source_name': '非卖', 'source_val': 'only_non_sold' },
  { 'source_name': '上涨', 'source_val': 'only_asc' },
  { 'source_name': '下跌', 'source_val': 'only_dsc' },
  { 'source_name': '大池', 'source_val': 'only_bigpool' },
  { 'source_name': '橄榄树', 'source_val': 'only_ovtree' },
  { 'source_name': '飞马', 'source_val': 'only_flyhorse' },
  { 'source_name': '美杜莎', 'source_val': 'only_medusa' },
  { 'source_name': '海豚', 'source_val': 'only_dolphin' },
  { 'source_name': '三叉戟', 'source_val': 'only_trident' },
  { 'source_name': '金毛羊', 'source_val': 'only_gdngoat' },
  { 'source_name': '其它', 'source_val': 'only_others' },
  { 'source_name': '>持1年', 'source_val': 'hold_gt_1year' },
  { 'source_name': '<持1年', 'source_val': 'hold_lt_1year' },
  { 'source_name': '>卖3次', 'source_val': 'sold_gt_3times' },
  { 'source_name': '<卖3次', 'source_val': 'sold_lt_3times' },
  { 'source_name': '有待办', 'source_val': 'has_todo' }
]

// getBigPoolFixedHold()
getIndexRtRate()

const zskbViewObjs = ref({})
watch(zskbObjs, () => {
  zskbObjs.value.forEach(element => {
    zskbViewObjs.value[element['fund_id']] = element
  })
}, {immediate: true})

const cfmDlgTitle = ref("")
const cfmDlgCont = ref("")
const cfmDlgType = ref("")
const dlgController = ref({ reportDlg: null, removeDlg: null})
const baseUrl4ProbeNav = ref("")
const baseUrl4ComposeNav = ref("")
const searchFundNameOrFundId = ref("")
const searchTimer = ref(null)
const searchByFundIdFoundFlag = ref(false)
const searchByFundIdTimes = ref(0)

onMounted(() => {
  dlgController.value.reportDlg = new Modal('#reportDialog', {})
  dlgController.value.removeDlg = new Modal('#removeDialog', {})

  let _prot = window.location.protocol;
  let _host = window.location.hostname;
  baseUrl4ProbeNav.value = _prot + "//" + _host + "/index.html?dt_fund_id="
  baseUrl4ComposeNav.value = _prot + "//" + _host + "/dt_plans_web/#/?dt_fund_id="

  /*
  * logic moved to onActivated
  * */
})

onActivated(() => {
  if (route.query.hasOwnProperty('fund_id') && route.query['fund_id']) {
    searchFundNameOrFundId.value = route.query['fund_id'].trim();
    searchByFundIdTimes.value = 0
    if (searchFundNameOrFundId.value.length === 6) {
      searchTimer.value = setInterval(() => {
        excuteSearchFund()
        if (searchByFundIdFoundFlag.value || searchByFundIdTimes.value >= 60) {
          if (searchTimer.value) {
            console.warn("clear search timer in report page")
            clearInterval(searchTimer.value)
          }
        }
      }, 2000)
    }
  }
  // each time goes to this page, get the fund notes again
  getFundNotes4Report()
  getFundNotes4Edit()
})

onUnmounted(() => {
  if (searchTimer.value) {
    console.warn("clear search timer in report page")
    clearInterval(searchTimer.value)
  }
})

const toBeRemoveFund = ref(null)
function removeDynFileFromUi(event, oneRow) {
  event.stopPropagation()
  toBeRemoveFund.value = oneRow;
  dlgController.value.removeDlg.show();
}

function removeDynFileLogic() {
  removeLocalDynvalue(toBeRemoveFund.value['fund_id'], toBeRemoveFund.value['fund_name'])
  dlgController.value.removeDlg.hide()
}

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

const backup_fund_id = ref(null)
watch([dynRecordObjs, reportObjsReloaded], () => {
    if (!dynRecordObjs.value || dynRecordObjs.value.length === 0) {
      return
    }
    if (backup_fund_id.value) {
      const fund_match = (elem) => elem['fund_id'] === backup_fund_id.value
      let _idx = dynRecordObjs.value.findIndex(fund_match)
      if (_idx === -1) {
        console.warn("Internal error, find dynRecordObjs failed by fund id: ", backup_fund_id.value)
      } else {
        console.log("**** restore report dyn record obj successfully, fund id: ", backup_fund_id.value)
        dynRecordObjs.value[_idx]['currSelected'] = true
        currDynValue.value = dynRecordObjs.value[_idx]
        scrollViewBySelection()
      }
      //backup_fund_id.value = null
    }
    if (reportObjsReloaded.value) {
      sortByField(sortFieldName.value, false);
      reportObjsReloaded.value = false;
    }
})

function requireDynValues4ui(_by_bulk=false) {
  cfmDlgTitle.value = "确认"
  cfmDlgCont.value = "要请求动态数据吗"
  if (!_by_bulk) {
    cfmDlgType.value = "get dynvalues"
  } else {
    cfmDlgType.value = "bulk dynvalues"
  }
  dlgController.value.reportDlg.show()
}

function executeAction() {
  if (cfmDlgType.value === "get dynvalues") {
    requireDynValues(requireFundIds.value)
  } else if (cfmDlgType.value === "bulk dynvalues") {
    let _fund_ids = dynRecordObjs.value.map(elem => elem['fund_id']).join(",")
    requireDynValues(_fund_ids)
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

function excuteSearchFund() {
  dynRecordObjs.value.forEach((elem) => {
    elem['currSelected'] = false
  });
  currDynValue.value = null
  if (searchFundNameOrFundId.value.trim() === '') {
    return
  }
  let _foundCnt = 0
  let _checkStrBackup = searchFundNameOrFundId.value
  let _testStr = _checkStrBackup.replace(/[0-9]/g, "")
  let _pureStr = _testStr.trim()
  let _searchedRow = null
  if (_pureStr.length === 0 && searchFundNameOrFundId.value.length === 6) {
    searchByFundIdTimes.value += 1
    // fund id
    let _fundId = searchFundNameOrFundId.value.trim()
    dynRecordObjs.value.forEach((elem) => {
        if (elem['fund_id'] === _fundId) {
          elem['currSelected'] = true
          _foundCnt += 1
          searchByFundIdFoundFlag.value = true
          _searchedRow = elem
        }
    })
  } else {
    // fund name
    let arr = searchFundNameOrFundId.value.trim().split(" ")
    dynRecordObjs.value.forEach((elem) => {
      if (arr.length === 1) {
        let _cond_1 = arr[0].trim()
        if (elem['fund_name'].indexOf(_cond_1) !== -1) {
          elem['currSelected'] = true
          _foundCnt += 1
          _searchedRow = elem
        }
      } else if (arr.length === 2) {
        let _cond_1 = arr[0].trim()
        let _cond_2 = arr[1].trim()
        if (elem['fund_name'].indexOf(_cond_1) !== -1 && elem['fund_name'].indexOf(_cond_2) !== -1) {
          elem['currSelected'] = true
          _foundCnt += 1
          _searchedRow = elem
        }
      }
    })
  }
  if (_foundCnt > 0) {
    sortByField('selected')
    if (_foundCnt === 1) {
      genReport(_searchedRow)
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
    if (_pureStr.length === 0 && searchFundNameOrFundId.value.length === 6) {
    } else {
      searchFundNameOrFundId.value = ""
    }
    if (report_select.value !== 'all' && report_select.value !== 'inload') {
      alert("根据id和名称都没有找到, 切换到全部种类");
      setTimeout(function() {
        report_select.value = 'all';
      }, 200)
    } else {
      alert("根据id和名称都没有找到");
    }
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
        //format: '{value}'
      }
  },

  series: [
    {
      // 0
      name: '指数净值',
      data: [], //priceData4draw.value,//priceData4draw.value,
      id: 'dataseries'
      // the event marker flags
      //yAxis: 0
    },
    {
      // 1
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
      //yAxis: 0
    },
    {
      // 2
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
      //yAxis: 0
    },
    {
      // 3
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
      //yAxis: 0
    },
    {
      // 4
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
      //yAxis: 0
    },
    {
      // 5
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
      //yAxis: 0
    },
    {
      // 6
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
      //yAxis: 0
    },
    {
      // 7
      // append flag points
      name: '追加标',
      type: 'flags',
      data: [],
      onSeries: 'dataseries',
      shape: 'circlepin',
      width: 20,
      height: 16,
      lineWidth: 2,
      color: 'purple',
      style: {
        color: 'purple'
      },
      events: {
        click: function (e) {
          // let _date_str = new Date(e.point.category).toISOString().split("T")[0]
          // console.log("sold flag series click: ", e.point.category, " date_str: ", _date_str)
          // fillInSoldDate(_date_str)
        }
      }
      //yAxis: 0
    },
    {
      // 8
      // write notes earn (positive, red) --- changed!!!
      // earn rate loop
      // width: 35,
      // height: 35,
      // name: '笔记盈利标',
      // type: 'flags',
      // data: [],
      // onSeries: 'dataseries',
      // shape: 'diamond',
      // lineWidth: 2,
      // color: 'red',
      // style: {
      //   color: 'red',
      //   fontSize: 14
      // },
      // events: {
      //   click: function (e) {
      //   }
      // }
      //yAxis: 1,
      name: '盈利曲线',
      data: []
    },
    {
      // 9
      // write notes earn (negative, red)
      // width: 35,
      // height: 35,
      // name: '笔记亏损标',
      // type: 'flags',
      // data: [],
      // onSeries: 'dataseries',
      // shape: 'diamond',
      // lineWidth: 2,
      // color: 'green',
      // style: {
      //   color: 'green',
      //   fontSize: 14
      // },
      // events: {
      //   click: function (e) {
      //   }
      // }
      name: '未使用曲线',
      data: []
      //yAxis: 0
    },
    {
      // 10
      // write notes - show notes
      // width: 100,
      // height: 16,
      name: '笔记日记标',
      type: 'flags',
      data: [],
      onSeries: 'dataseries',
      shape: 'squarebin',
      lineWidth: 2,
      color: 'black',
      style: {
        color: 'black',
        fontSize: 14
      },
      events: {
        click: function (e) {
        }
      }
      //yAxis: 0
    }
  ]
});

const currDynValue = ref(null)
const minPriceVal = ref(0)
const maxPriceVal = ref(0)
const priceDistance = ref(0)
const inc_earn_perc = ref(false)
const inc_comments = ref(false)

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
  chartOptions.value['series'][7]['data'] = []
  chartOptions.value['series'][8]['data'] = []
  chartOptions.value['series'][9]['data'] = []
  chartOptions.value['series'][10]['data'] = []

  let _title_prefix = ''
  if (onlyShowLatest.value) {
    _title_prefix = '单次'
  } else {
    _title_prefix = '平均'
  }
/*
  chartOptions.value['title']['text'] = currDynValue.value['fund_id'] + " "
    + currDynValue.value['fund_name'] + "\t\t" + currDynValue.value['statistics']['tot_exchange_days'] + "天"
    + " 盈利" + " " + currDynValue.value['statistics'].last_sold_profit.currStatistics.tot_profit_perc_str
*/
  if (onlyShowLatest.value) {
    chartOptions.value['title']['text'] = currDynValue.value['fund_id'] + " " + currDynValue.value['fund_name'] + 
    "\t\t\t" + _title_prefix + '持有(交易)' + currDynValue.value['avg_sold_natural_days'] + "天" + 
    "\t\t\t" + _title_prefix + "盈利 " + " " + currDynValue.value['statistics'].last_sold_profit.currStatistics.tot_profit_perc_str + 
    "\t\t\t" + "折合年化 " + currDynValue.value['trans_profit_per_year_str']
  } else {
    chartOptions.value['title']['text'] = currDynValue.value['fund_id'] + " " + currDynValue.value['fund_name'] + 
    "\t\t\t" + '总持有(交易)' + currDynValue.value['statistics']['tot_exchange_days_natural'] + "天" + 
    "\t\t\t" + _title_prefix + '持有(交易)' + currDynValue.value['avg_sold_natural_days'] + "天" + 
    "\t\t\t" + _title_prefix + "盈利 " + " " + currDynValue.value['statistics'].last_sold_profit.currStatistics.tot_profit_perc_str + 
    "\t\t\t" + "折合年化 " + currDynValue.value['trans_profit_per_year_str']    
  }

  let _price_arr = []
  // price list
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

  // append money list
  if (currDynValue.value.hasOwnProperty('appendFixed4draw') && currDynValue.value['appendFixed4draw'].length > 0) {
    let appendFixed4draw = currDynValue.value['appendFixed4draw']
    appendFixed4draw.forEach(element => {
      let _timestamp = Date.parse(element['date_str'])
      chartOptions.value['series'][7]['data'].push({
        x: _timestamp,
        title: '追加'
      })
    })
  }

  if (inc_earn_perc.value) {
    if (currDynValue.value['earnLoopList4draw'] && currDynValue.value['earnLoopList4draw'].length > 0) {
      currDynValue.value['earnLoopList4draw'].forEach(element => {
        let _timestamp = Date.parse(element['last_price_date'])
        let _tot_earn_rate = element['tot_earn_rate'] / (currDynValue.value['earnLoopMax'] - currDynValue.value['earnLoopMin']) * priceDistance.value / 3
        chartOptions.value['series'][8]['data'].push([_timestamp, _tot_earn_rate])
      })
    }
  }

  // write note earn positive
  // if (inc_earn_perc.value) {
  //   if (noteReportObjs.value && noteReportObjs.value.hasOwnProperty(currDynValue.value['fund_id'])) {
  //     let _note_objs = noteReportObjs.value[currDynValue.value['fund_id']]['note_objs']
  //     if (_note_objs.length > 0) {
  //       _note_objs.forEach(element => {
  //         if (element['perc_val'] >= 0) {
  //           let _timestamp = Date.parse(element['date_str'])
  //           chartOptions.value['series'][8]['data'].push({
  //             x: _timestamp,
  //             title: element['perc_str']
  //           })
  //         }
  //       })
  //     }
  //   }
  // }

  // write note earn negative
  // if (inc_earn_perc.value) {
  //   if (noteReportObjs.value && noteReportObjs.value.hasOwnProperty(currDynValue.value['fund_id'])) {
  //     let _note_objs = noteReportObjs.value[currDynValue.value['fund_id']]['note_objs']
  //     if (_note_objs.length > 0) {
  //       _note_objs.forEach(element => {
  //         if (element['perc_val'] < 0 && element['perc_val'] > -90) {
  //           let _timestamp = Date.parse(element['date_str'])
  //           chartOptions.value['series'][9]['data'].push({
  //             x: _timestamp,
  //             title: element['perc_str']
  //           })
  //         }
  //       })
  //     }
  //   }
  // }

  // write note earn negative
  if (inc_comments.value) {
    if (noteReportObjs.value && noteReportObjs.value.hasOwnProperty(currDynValue.value['fund_id'])) {
      let _note_objs = noteReportObjs.value[currDynValue.value['fund_id']]['note_objs']
      if (_note_objs.length > 0) {
        _note_objs.forEach(element => {
          let _timestamp = Date.parse(element['date_str'])
          chartOptions.value['series'][10]['data'].push({
            x: _timestamp,
            title: element['comments']
          })
        })
      }
    }
  }

  backup_fund_id.value = currDynValue.value['fund_id']

}, {
  deep: true
})

watch([inc_earn_perc, inc_comments], () => {
  if (!currDynValue.value) {
    return
  }

  chartOptions.value['series'][8]['data'] = []
  chartOptions.value['series'][9]['data'] = []
  chartOptions.value['series'][10]['data'] = []

  if (inc_earn_perc.value) {
    if (currDynValue.value['earnLoopList4draw'] && currDynValue.value['earnLoopList4draw'].length > 0) {
      currDynValue.value['earnLoopList4draw'].forEach(element => {
        let _timestamp = Date.parse(element['last_price_date'])
        let _tot_earn_rate = element['tot_earn_rate'] / (currDynValue.value['earnLoopMax'] - currDynValue.value['earnLoopMin']) * priceDistance.value / 3
        chartOptions.value['series'][8]['data'].push([_timestamp, _tot_earn_rate])
      })
    }
  }

  // write note earn positive
  // if (inc_earn_perc.value) {
  //   if (noteReportObjs.value && noteReportObjs.value.hasOwnProperty(currDynValue.value['fund_id'])) {
  //     let _note_objs = noteReportObjs.value[currDynValue.value['fund_id']]['note_objs']
  //     if (_note_objs.length > 0) {
  //       _note_objs.forEach(element => {
  //         if (element['perc_val'] >= 0) {
  //           let _timestamp = Date.parse(element['date_str'])
  //           chartOptions.value['series'][8]['data'].push({
  //             x: _timestamp,
  //             title: element['perc_str']
  //           })
  //         }
  //       })
  //     }
  //   }
  // }

  // write note earn negative
  // if (inc_earn_perc.value) {
  //   if (noteReportObjs.value && noteReportObjs.value.hasOwnProperty(currDynValue.value['fund_id'])) {
  //     let _note_objs = noteReportObjs.value[currDynValue.value['fund_id']]['note_objs']
  //     if (_note_objs.length > 0) {
  //       _note_objs.forEach(element => {
  //         if (element['perc_val'] < 0 && element['perc_val'] > -90) {
  //           let _timestamp = Date.parse(element['date_str'])
  //           chartOptions.value['series'][9]['data'].push({
  //             x: _timestamp,
  //             title: element['perc_str']
  //           })
  //         }
  //       })
  //     }
  //   }
  // }

  // write note earn negative
  if (inc_comments.value) {
    if (noteReportObjs.value && noteReportObjs.value.hasOwnProperty(currDynValue.value['fund_id'])) {
      let _note_objs = noteReportObjs.value[currDynValue.value['fund_id']]['note_objs']
      if (_note_objs.length > 0) {
        _note_objs.forEach(element => {
          let _timestamp = Date.parse(element['date_str'])
          chartOptions.value['series'][10]['data'].push({
            x: _timestamp,
            title: element['comments']
          })
        })
      }
    }
  }
}, {
  deep: true
})

function fillInAscDate(_date_str) {
  if (!currDynValue.value) {
    return
  }
  if (currDynValue.value['remove_date_type'] === 'asc') {
    if (currDynValue.value['remove_asc_or_desc_or_sold_date'].indexOf(_date_str) === -1) {
      currDynValue.value['remove_asc_or_desc_or_sold_date'] = currDynValue.value['remove_asc_or_desc_or_sold_date'] + ";" + _date_str
    }
  } else {
    currDynValue.value['remove_asc_or_desc_or_sold_date'] = _date_str
    currDynValue.value['remove_date_type'] = 'asc'
  }
  currDynValue.value['cut_buy_date_left_or_right'] = ""
}

function fillInDescDate(_date_str) {
  if (!currDynValue.value) {
    return
  }
  if (currDynValue.value['remove_date_type'] === 'desc') {
    if (currDynValue.value['remove_asc_or_desc_or_sold_date'].indexOf(_date_str) === -1) {
      currDynValue.value['remove_asc_or_desc_or_sold_date'] = currDynValue.value['remove_asc_or_desc_or_sold_date'] + ";" + _date_str
    }
  } else {
    currDynValue.value['remove_asc_or_desc_or_sold_date'] = _date_str
    currDynValue.value['remove_date_type'] = 'desc'
  }
  currDynValue.value['cut_buy_date_left_or_right'] = ""
}

function fillInSoldDate(_date_str) {
  if (!currDynValue.value) {
    return
  }
  if (currDynValue.value['remove_date_type'] === 'sold') {
    if (currDynValue.value['remove_asc_or_desc_or_sold_date'].indexOf(_date_str) === -1) {
      currDynValue.value['remove_asc_or_desc_or_sold_date'] = currDynValue.value['remove_asc_or_desc_or_sold_date'] + ";" + _date_str
    }
  } else {
    currDynValue.value['remove_asc_or_desc_or_sold_date'] = _date_str
    currDynValue.value['remove_date_type'] = 'sold'
  }
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

function removeAscDateByStr(_date_str_list, oneRow, _equal = true, _to_right = true) {
  let _arr = _date_str_list.split(";")
  for (let _itx = 0; _itx < _arr.length; _itx++) {
    let _date_str_temp = _arr[_itx]
    let _date_str = _date_str_temp.trim()
    if (_date_str == '') {
      continue;
    }
    let moneyAscChange4draw = currDynValue.value['moneyAscChange4draw']
    const date_match = _equal? (elem) => elem['date_str'] === _date_str : _to_right? (elem) => elem['date_str'] >= _date_str : (elem) => elem['date_str'] <= _date_str
    let _idx = moneyAscChange4draw.findIndex(date_match)
    if (_idx === -1) {
      console.warn("removeAscDateByStr failed: ", _date_str, "_equal: ", _equal, " _to_right: ", _to_right);
      return false
    }
    moneyAscChange4draw.splice(_idx, 1)
    oneRow['statistics']['adjust_money_times'] -= 1
    oneRow['statistics']['asc_money_times'] -= 1
    oneRow['statistics']['asc_money_dates'].splice(_idx, 1)
  }
  return true
}

function removeAscDate(oneRow) {
  if (!oneRow['remove_asc_or_desc_or_sold_date'] || !currDynValue.value) {
    return false
  }
  return removeAscDateByStr(oneRow['remove_asc_or_desc_or_sold_date'].trim(), oneRow)
}

function removeDescDateByStr(_date_str_list, oneRow, _equal = true, _to_right = true) {
  let _arr = _date_str_list.split(";")
  for (let _itx = 0; _itx < _arr.length; _itx++) {
    let _date_str_temp = _arr[_itx]
    let _date_str = _date_str_temp.trim()
    if (_date_str === '') {
      continue;
    }
    let moneyDescChange4draw = currDynValue.value['moneyDescChange4draw']
    const date_match = _equal? (elem) => elem['date_str'] === _date_str : _to_right? (elem) => elem['date_str'] >= _date_str : (elem) => elem['date_str'] <= _date_str
    let _idx = moneyDescChange4draw.findIndex(date_match)
    if (_idx === -1) {
      console.warn("removeDescDateByStr failed: ", _date_str, " _equal: ", _equal, " _to_right: ", _to_right);
      return false
    }
    moneyDescChange4draw.splice(_idx, 1)
    oneRow['statistics']['adjust_money_times'] -= 1
    oneRow['statistics']['desc_money_times'] -= 1
    oneRow['statistics']['desc_money_dates'].splice(_idx, 1)
  }
  return true
}

function removeDescDate(oneRow) {
  if (!oneRow['remove_asc_or_desc_or_sold_date'] || !currDynValue.value) {
    return false
  }
  return removeDescDateByStr(oneRow['remove_asc_or_desc_or_sold_date'].trim(), oneRow)
}

function removeSoldDateByStr(_date_str_list, oneRow) {
  let _arr = _date_str_list.split(";")
  for (let _itx = 0; _itx < _arr.length; _itx++) {
    let _date_str_temp = _arr[_itx]
    let _date_str = _date_str_temp.trim()
    if (_date_str === '') {
      continue;
    }
    let soldList4draw = currDynValue.value['soldList4draw']
    const date_match = (elem) => elem['date_str'] === _date_str
    let _idx = soldList4draw.findIndex(date_match)
    if (_idx === -1 || _idx === soldList4draw.length - 1) {
      console.warn("removeSoldDateByStr [soldList4draw] failed: ", _date_str)
      return false
    }
    soldList4draw.splice(_idx, 1)

    let soldHistoryWrapper = currDynValue.value['soldHistoryWrapper']
    _idx = soldHistoryWrapper.findIndex(date_match)
    if (_idx === -1 || _idx === soldHistoryWrapper.length - 1) {
      console.warn("removeSoldDateByStr [soldHistoryWrapper] failed: ", _date_str)
      return false
    }
    soldHistoryWrapper.splice(_idx, 1)

    let soldHistoryWrapper_reverse = currDynValue.value['soldHistoryWrapper_reverse']
    _idx = soldHistoryWrapper_reverse.findIndex(date_match)
    if (_idx === -1 || _idx === 0) {
      console.warn("removeSoldDateByStr [soldHistoryWrapper_reverse] failed: ", _date_str)
      return false
    }
    soldHistoryWrapper_reverse.splice(_idx, 1)

    oneRow['statistics']['sold_times'] -= 1
  }
  return true
}

function removeSoldDate(oneRow) {
  if (!oneRow['remove_asc_or_desc_or_sold_date'] || !currDynValue.value) {
    return false
  }
  return removeSoldDateByStr(oneRow['remove_asc_or_desc_or_sold_date'].trim(), oneRow)
}

const remove_inprogress = ref(false)

async function remove_Asc_or_Desc_or_Sold_Date(oneRow) {
  if (!oneRow['remove_date_type']) {
    return;
  }
  if (remove_inprogress.value) {
    console.warn("removing is in progress, return")
    return;
  }
  remove_inprogress.value = true
  let result = false
  if (oneRow['remove_date_type'] === 'asc') {
    result = removeAscDate(oneRow)
  } else if (oneRow['remove_date_type'] === 'desc') {
    result = removeDescDate(oneRow)
  } else if (oneRow['remove_date_type'] === 'sold') {
    result = removeSoldDate(oneRow)
  }

  if (result) {
    backup_fund_id.value = oneRow['fund_id']
    await removeDate4Report(oneRow, oneRow['remove_date_type'])
  }

  oneRow['remove_asc_or_desc_or_sold_date'] = ""
  oneRow['remove_date_type'] = ''
  remove_inprogress.value = false;
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

function sortByField(_field, _new_sort=true) {
  if (_new_sort) {
    if (sortFieldName.value === _field) {
      sortFieldFlag.value = !sortFieldFlag.value
    } else {
      sortFieldName.value = _field
      sortFieldFlag.value = true
    }
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
  else if (_field === 'avg_hold_days') {
    if (sortFieldFlag.value) {
      dynRecordObjs.value.sort((a, b) => {
        let a_val = 0, b_val = 0
        if (a['avg_sold_natural_days']) {
          a_val = a['avg_sold_natural_days']
        }
        if (b['avg_sold_natural_days']) {
          b_val = b['avg_sold_natural_days']
        }
        return a_val - b_val
      });
    } else {
      dynRecordObjs.value.sort((a, b) => {
        let a_val = 0, b_val = 0
        if (a['avg_sold_natural_days']) {
          a_val = a['avg_sold_natural_days']
        }
        if (b['avg_sold_natural_days']) {
          b_val = b['avg_sold_natural_days']
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
  else if (_field === 'rate_after_sold') {
    if (sortFieldFlag.value) {
      dynRecordObjs.value.sort((a, b) => {
        let a_val = 99, b_val = 99
        if (a['statistics'] && a['statistics']['rate_from_last_sold']) {
          a_val = a['statistics']['rate_from_last_sold']
        }
        if (b['statistics'] && b['statistics']['rate_from_last_sold']) {
          b_val = b['statistics']['rate_from_last_sold']
        }
        return a_val - b_val
      });
    } else {
      dynRecordObjs.value.sort((a, b) => {
        let a_val = 99, b_val = 99
        if (a['statistics'] && a['statistics']['rate_from_last_sold']) {
          a_val = a['statistics']['rate_from_last_sold']
        }
        if (b['statistics'] && b['statistics']['rate_from_last_sold']) {
          b_val = b['statistics']['rate_from_last_sold']
        }
        return b_val - a_val
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
  } else if (_field === 'min_earn') {
    if (sortFieldFlag.value) {
      dynRecordObjs.value.sort((a, b) => {
        let a_val = 0, b_val = 0
        if (zskbViewObjs.value[a.fund_id] && zskbViewObjs.value[a.fund_id]['statistics'] && zskbViewObjs.value[a.fund_id]['statistics']['min_sort_tot_earn']) {
          a_val = zskbViewObjs.value[a.fund_id]['statistics']['min_sort_tot_earn']
        }
        if (zskbViewObjs.value[b.fund_id] && zskbViewObjs.value[b.fund_id]['statistics'] && zskbViewObjs.value[b.fund_id]['statistics']['min_sort_tot_earn']) {
          b_val = zskbViewObjs.value[b.fund_id]['statistics']['min_sort_tot_earn']
        }        
        return a_val - b_val
      });
    } else {
      dynRecordObjs.value.sort((a, b) => {
        let a_val = 0, b_val = 0
        if (zskbViewObjs.value[a.fund_id] && zskbViewObjs.value[a.fund_id]['statistics'] && zskbViewObjs.value[a.fund_id]['statistics']['min_sort_tot_earn']) {
          a_val = zskbViewObjs.value[a.fund_id]['statistics']['min_sort_tot_earn']
        }
        if (zskbViewObjs.value[b.fund_id] && zskbViewObjs.value[b.fund_id]['statistics'] && zskbViewObjs.value[b.fund_id]['statistics']['min_sort_tot_earn']) {
          b_val = zskbViewObjs.value[b.fund_id]['statistics']['min_sort_tot_earn']
        }        
        return b_val - a_val
      });        
    }
  } else if (_field === 'earn_per_year') {
    if (sortFieldFlag.value) {
      dynRecordObjs.value.sort((a, b) => {
        let a_val = 0, b_val = 0
        if (a.hasOwnProperty('trans_profit_per_year')) {
          a_val = a['trans_profit_per_year']
        }
        if (b.hasOwnProperty('trans_profit_per_year')) {
          b_val = b['trans_profit_per_year']
        }
        return a_val - b_val        
      });
    } else {
      dynRecordObjs.value.sort((a, b) => {
        let a_val = 0, b_val = 0
        if (a.hasOwnProperty('trans_profit_per_year')) {
          a_val = a['trans_profit_per_year']
        }
        if (b.hasOwnProperty('trans_profit_per_year')) {
          b_val = b['trans_profit_per_year']
        }
        return b_val - a_val        
      });    
    }
  } else if (_field === 'buyin_weight') {
    if (sortFieldFlag.value) {
      dynRecordObjs.value.sort((a, b) => {
        let a_val = 0, b_val = 0
        if (fundBuyWeight.value[a.fund_id]) {
          a_val = fundBuyWeight.value[a.fund_id]
        }
        if (fundBuyWeight.value[b.fund_id]) {
          b_val = fundBuyWeight.value[b.fund_id]
        }
        return a_val - b_val        
      });
    } else {
      dynRecordObjs.value.sort((a, b) => {
        let a_val = 0, b_val = 0
        if (fundBuyWeight.value[a.fund_id]) {
          a_val = fundBuyWeight.value[a.fund_id]
        }
        if (fundBuyWeight.value[b.fund_id]) {
          b_val = fundBuyWeight.value[b.fund_id]
        }
        return b_val - a_val
      });    
    }
  } else if (_field === 'hold_length') {
    if (sortFieldFlag.value) {
      dynRecordObjs.value.sort((a, b) => {
        let a_val = -1, b_val = -1
        if (a['statistics'] && a['statistics']['tot_exchange_days_natural']) {
          a_val = a['statistics']['tot_exchange_days_natural']
        }
        if (b['statistics'] && b['statistics']['tot_exchange_days_natural']) {
          b_val = b['statistics']['tot_exchange_days_natural']
        }
        return a_val - b_val      
      });
    } else {
      dynRecordObjs.value.sort((a, b) => {
        let a_val = -1, b_val = -1
        if (a['statistics'] && a['statistics']['tot_exchange_days_natural']) {
          a_val = a['statistics']['tot_exchange_days_natural']
        }
        if (b['statistics'] && b['statistics']['tot_exchange_days_natural']) {
          b_val = b['statistics']['tot_exchange_days_natural']
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
      if (rowElements.value[_rowObj['fund_id']]) {
          if (rowElements.value[_rowObj['fund_id']]) {
              rowElements.value[_rowObj['fund_id']].scrollIntoView({block: "center", behavior: "smooth"})
          }
      }
    }
  })
}

function genReport(oneRow) {
  if (dynRecordObjs && dynRecordObjs.value && dynRecordObjs.value.length > 0) {
    dynRecordObjs.value.forEach(elem => {
      elem['currSelected'] = false
    })
  }
  if (currDynValue.value === null ||
  currDynValue.value['fund_id'] != oneRow['fund_id']) {
    yAxisTopAdjTimes.value = 0;
    yAxisBtmAdjTimes.value = 0;
    picHeightAdjVal.value = 400;
    currDynValue.value = oneRow;
    currDynValue.value['currSelected'] = true
  } else {
    currDynValue.value['currSelected'] = false
    currDynValue.value = null
  }
}

const yAxisTopAdjTimes = ref(0)
const yAxisBtmAdjTimes = ref(0)
const picHeightAdjVal = ref(400)

watch([yAxisTopAdjTimes, yAxisBtmAdjTimes, picHeightAdjVal], () => {
  chartOptions.value['chart']['height'] = picHeightAdjVal.value

  chartOptions.value.yAxis.max = (maxPriceVal.value + priceDistance.value * 0.5 * yAxisTopAdjTimes.value) * 1.2
  chartOptions.value.yAxis.softMax = (maxPriceVal.value + priceDistance.value * 0.5 * yAxisTopAdjTimes.value) * 1.2

  chartOptions.value.yAxis.min = (minPriceVal.value - priceDistance.value * 0.5 * yAxisBtmAdjTimes.value) * 0.8
  chartOptions.value.yAxis.softMin = (minPriceVal.value - priceDistance.value * 0.5 * yAxisBtmAdjTimes.value)
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
    fundObj['statistics']['asc_money_dates'].forEach((elem, index) => {
      report_txt += transDate(elem)
      if (index < fundObj['statistics']['asc_money_dates'].length - 1) {
        report_txt += "、"
      }
    })
  } else {
    report_txt += "???"
  }
  report_txt += "增加(定投)买入资金，共" + fundObj['statistics']['asc_money_times'] + "次；分别于"
  if (fundObj['statistics']['desc_money_dates'] && fundObj['statistics']['desc_money_dates'].length > 0) {
    fundObj['statistics']['desc_money_dates'].forEach((elem, index) => {
      report_txt += transDate(elem)
      if (index < fundObj['statistics']['desc_money_dates'].length - 1) {
        report_txt += "、"
      }
    })
  } else {
    report_txt += "???"
  }
  report_txt += "减少(定投)买入资金，共" + fundObj['statistics']['desc_money_times'] + "次；分别于"

  if (fundObj['statistics'].hasOwnProperty('append_fixed_times') && fundObj['statistics']['append_fixed_times']) {
    if (fundObj['appendFixed4draw'] && fundObj['appendFixed4draw'].length > 0) {
      fundObj['appendFixed4draw'].forEach((elem, index) => {
        report_txt += transDate(elem['date_str'])
        if (index < fundObj['appendFixed4draw'].length - 1) {
          report_txt += "、"
        }
      })
      report_txt += "追加买入资金，共" + fundObj['statistics']['append_fixed_times'] + "次；分别于"
    } else {
      report_txt += "???"
    }
  }  

  if (fundObj['soldList4draw'] && fundObj['soldList4draw'].length > 0) {
    fundObj['soldList4draw'].forEach((elem, index) => {
      report_txt += transDate(elem['date_str'])
      if (index < fundObj['soldList4draw'].length - 1) {
        report_txt += "、"
      }
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

function getFixedRetroClassV2(_int_val) {
  if (_int_val == -1) {
    return 'fixed_retro_bg_m_1';
  } else if (_int_val == 0) {
    return 'fixed_retro_bg_0';
  } else if (_int_val == 1) {
    return 'fixed_retro_bg_1';
  } else if (_int_val == 2) {
    return 'fixed_retro_bg_2';
  } else if (_int_val == 3) {
    return 'fixed_retro_bg_3';
  } else if (_int_val == 4) {
    return 'fixed_retro_bg_4';
  } else if (_int_val < 1) {
    return 'fixed_retro_bg_imp_2';
  } else if (_int_val > 4) {
    return 'fixed_retro_bg_imp_1';
  }
  return '';
}

const summ_level_tips_map = {
				'0.1': {'cmt': '持有额小|特优', 'bgcolor': 'cornsilk', 'color': 'blue', 'bd': 'dashed 2px blue'},
				'0.2': {'cmt': '持有额较小|次优', 'bgcolor': 'cornsilk', 'color': 'blue', 'bd': 'dashed 2px blue'},
				'0': {'cmt': '估值优秀', 'bgcolor': 'blue', 'color': 'white', 'bd': ''},
				'1': {'cmt': '估值良好', 'bgcolor': 'skyblue', 'color': 'white', 'bd': ''},
				'2': {'cmt': '估值中等', 'bgcolor': 'grey', 'color': 'white', 'bd': ''},
				'3': {'cmt': '估值一般', 'bgcolor': 'orange', 'color': 'white', 'bd': ''},
				'4': {'cmt': '估值较差', 'bgcolor': 'red', 'color': 'white', 'bd': ''},
				'4.1': {'cmt': '持有额较大|次差', 'bgcolor': 'cornsilk', 'color': 'red', 'bd': 'dashed 2px red'},
				'4.2': {'cmt': '持有额大|特差', 'bgcolor': 'cornsilk', 'color': 'red', 'bd': 'dashed 2px red'},
				'4.3': {'cmt': '售出近|量化停', 'bgcolor': 'cornsilk', 'color': 'red', 'bd': 'dashed 2px red'},
				'-1': {'cmt': '已经终止', 'bgcolor': 'black', 'color': 'white', 'bd': ''}
			};

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

function setFundWeightFromUI(oneRowObj, _op_type, _weight) {
  if (_op_type != 'inc' && _op_type != 'dec' && _op_type != 'set' && _op_type != 'test') {
    alert("非法的调用, _op_type is invalid");
    return
  }
  if (_weight == null) {
    alert("非法的调用, _weight is invalid");
    return
  }
  if (!oneRowObj['tranStateObj'] || !oneRowObj['tranStateObj']['compose_plan']) {
    alert("该产品不属于组合, 没法设置权重");
    return
  }
  if (['ovtree', 'flyhorse', 'medusa', 'dolphin', 'trident', 'gdngoat', 'bigpool', 'big_pool'].indexOf(oneRowObj['tranStateObj']['compose_plan']) == -1) {
    alert("该产品组合值是: " + oneRowObj['tranStateObj']['compose_plan'] + ' 无法设置权重');
    return
  }
  let _cfm_msg = ''
  if (_op_type == 'inc') {
    _cfm_msg = '确定要手动 增加 产品买入的权重: ' + oneRowObj['fund_id'] + " " + oneRowObj['fund_name'] + "?"
  } else if (_op_type == 'dec') {
    _cfm_msg = '确定要手动 减小 产品买入的权重: ' + oneRowObj['fund_id'] + " " + oneRowObj['fund_name'] + "?"
  } else if (_op_type == 'test') {
    _cfm_msg = '确定要手动 设置 产品买入的权重: ' + oneRowObj['fund_id'] + " " + oneRowObj['fund_name'] + "?"
  } else if (_op_type == 'set') {
    _cfm_msg = '确定要手动 写入 产品买入的权重: ' + oneRowObj['fund_id'] + " " + oneRowObj['fund_name'] + "?"
  }
  confirm(_cfm_msg, function() {
    setFundBuyWeight(oneRowObj['fund_id'], oneRowObj['fund_name'], oneRowObj['tranStateObj']['compose_plan'], _op_type, _weight)
  }, function() {})
}

function removeFundHistoryStatUI(_fund_id, _fund_name, _target_date, _buy_or_sold) {
  if (isNaN(_target_date) && !isNaN(Date.parse(_target_date))) {
  } else {
    alert("目标日期值非法: " + _target_date)
    return
  }
  if (_buy_or_sold != 'buy' && _buy_or_sold != 'sold') {
    alert("删除类型非法: " + _buy_or_sold)
    return  
  }
  var _tips = ""
  if (_buy_or_sold === 'buy') {
    _tips = "要清除 " + _target_date + " 之前的 买入 历史买卖数据吗?"
  } else if (_buy_or_sold === 'sold') {
    _tips = "要清除 " + _target_date + " 之前的 卖出 历史买卖数据吗?"
  }

  confirm(_tips, function() {
    removeFundHistoryStat(_fund_id, _fund_name, _target_date, _buy_or_sold)
  }, function() {})
}

</script>

<style scoped>
.para_info {
  line-height: 1.5;
  font-size: 1rem;
  padding: 5px;
  text-align: center;
}
.level_info {
  display: inline-block;
  width: 1.5em;
  text-align: center;
  border-radius: 5px;
  margin-left: 0.5em;
  padding: 1px 1px 1px 1px;
  color: white;
  font-size: 0.8em;
}
.stack_2_info {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  line-height: 1.2;
}
.fixed_retro_bg_m_1 {
  border: solid 1px black;
  background-color: black;
  color: white;
  border-radius: 5px;
  line-height: 1;
}
.fixed_retro_bg_0 {
  border: solid 1px blue;
  background-color: blue;
  border-radius: 5px;
  line-height: 1;
}
.fixed_retro_bg_1 {
  border: solid 1px skyblue;
  background-color: skyblue;
  border-radius: 5px;
  line-height: 1;
}
.fixed_retro_bg_2 {
  border: solid 1px grey;
  background-color: grey;
  border-radius: 5px;
  line-height: 1;
}
.fixed_retro_bg_3 {
  border: solid 1px orange;
  background-color: orange;
  border-radius: 5px;
  line-height: 1;
}
.fixed_retro_bg_4 {
  border: solid 1px red;
  background-color: red;
  border-radius: 5px;
  line-height: 1;
}
.fixed_retro_bg_imp_1 {
  font-size: 0.7em !important;
  border: dashed 2px red;
  color: red !important;
  font-weight: 900;
  width: 2.4em !important;
  line-height: 1;
}
.fixed_retro_bg_imp_2 {
  font-size: 0.7em !important;
  border: dashed 2px blue;
  color: blue !important;
  font-weight: 900;
  width: 2.4em !important;
  line-height: 1;
}
.val_font_color {
  display: inline-block;
  text-align: right;
  /*width: 3em;*/
  margin-right: 0.1em;
  font-weight: 600;
  font-style: italic;
  font-size: 0.9em;
}
.sep_line {
  border-top: solid 1px whitesmoke;
}
</style>
