<template>
  <div :style="topSecClass">
    <div id="op_pane" :style="{ 'height': opPaneHeight + 'rem'}" class="grid_pane">
      <div>总数:&nbsp;<span class="badge bg-success">{{ currTotNum }}</span>
      </div>
      <div>隐藏:&nbsp;<span class="badge bg-dark">{{ currRepoHideNum }}</span>
      </div>
      <div style="cursor: pointer;" @click="clearSelected()">
        选择:&nbsp;<span class="badge bg-warning text-dark">{{ currSelectedNum }}</span>
      </div>
      <div class="form-check" style="display: inline-block;">
        <input class="form-check-input" type="checkbox" v-model="showHides">
        <label class="form-check-label" for="flexCheckDefault">显示隐藏</label>
      </div>
      <input class="btn btn-primary btn-sm" type="button" value="前移选择" @click="sortByField('selected')">
      <!--
      <input class="btn btn-info btn-sm" type="button" value="隐藏选择">
      <input class="btn btn-info btn-sm" type="button" value="清除隐藏">
      -->
      <input type="text" class="form-control-plaintext search_box"
             style="grid-column: 6 / span 2;"
             v-model="searchCond" @keyup.enter="searchByCond()">
      <input class="btn btn-primary btn-sm" type="button" value="查找" @click="searchByCond()">
      <input class="btn btn-warning btn-sm" type="button" value="刷新" @click="getZsRepo()">
    </div>
    <table id="table_header" class="table table-bordered" style="margin-bottom: 0;">
      <thead style="">
      <tr :style="{ 'height': tabHeaderHeight + 'rem' }">
        <th :style="{ 'width': colWidMap['col_1'] + 'rem' }">
          <span>名称</span>
        </th>
        <th :style="{ 'width': colWidMap['col_2'] + 'rem' }" @click="sortByField('cluster_id')">
          <template v-if="sortFieldName === 'cluster_id'">
            <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
            <span v-else><i class="bi bi-arrow-down"></i></span>
          </template>
          <span>簇</span>
        </th>
        <th :style="{ 'width': colWidMap['col_3'] + colWidMap['col_4'] + colWidMap['col_5'] + 'rem' }" colspan="3">
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
        <th :style="{ 'width': colWidMap['col_6'] + 'rem' }" @click="sortByField('day_xxx_thres')">
          <template v-if="sortFieldName === 'day_xxx_thres'">
            <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
            <span v-else><i class="bi bi-arrow-down"></i></span>
          </template>
          <span>趋势</span>
        </th>
        <th :style="{ 'width': colWidMap['col_7'] + 'rem' }" @click="sortByField('fund_len')">
          <template v-if="sortFieldName === 'fund_len'">
            <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
            <span v-else><i class="bi bi-arrow-down"></i></span>
          </template>
          <span>长度</span>
        </th>
        <th :style="{ 'width': colWidMap['col_8'] + 'rem' }" @click="sortByField('in_kanban')">
          <template v-if="sortFieldName === 'in_kanban'">
            <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
            <span v-else><i class="bi bi-arrow-down"></i></span>
          </template><!--
          --><span>看板</span>
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
      <template v-for="oneRow in zsRepoViewObjs" :key="oneRow.fund_id">
        <tr v-bind:id="oneRow.fund_id" style="cursor: pointer;" @click="selOrDesRow(oneRow)"
            v-bind:class="{ sel_row: oneRow['currSelected'] }" :ref="(el) => (rowElements[oneRow.fund_id] = el)">
          <td v-bind:class="{ sel_row: oneRow['currSelected'] }">
            <div>
                <span style="margin-right: 0.5rem;">
                  {{ oneRow.fund_id }}
                </span>
              <span v-if="oneRow['in_kanban']" class="badge bg-danger" style="margin-right: 0.2rem;">已看板</span>
              <span v-else-if="oneRow['hide_repo']" class="badge bg-dark">已隐藏</span>
              <input v-else class="btn btn-warning btn-sm" type="button" value="隐藏"
                     @click.stop="addZsRepoHide(oneRow.fund_id, oneRow.fund_name)">
              <template v-if="oneRow['hide_repo']">
                <span v-if="oneRow['exclude_repo']" class="badge bg-dark">已排除</span>
                <input v-else class="btn btn-danger btn-sm" style="margin-left: 0.5rem;" type="button" value="永远排除"
                       @click.stop="addZsRepoHide(oneRow.fund_id, oneRow.fund_name)">
              </template>
            </div>
            <div>
              {{ oneRow.fund_name }}
            </div>
          </td>
          <td v-bind:class="{ sel_row: oneRow['currSelected'] }">
            {{ oneRow.cluster_id }}
          </td>
          <td v-bind:class="{ sel_row: oneRow['currSelected'] }">
            <div>
              {{ oneRow.min_earn_str }}
            </div>
            <div>
              {{ oneRow.min_earn_aux_str }}
            </div>
            <div>
              {{ oneRow.min_earn_tri_str }}
            </div>
          </td>
          <td v-bind:class="{ sel_row: oneRow['currSelected'] }">
            <div>
              {{ oneRow.avg_earn_str }}
            </div>
            <div>
              {{ oneRow.avg_earn_aux_str }}
            </div>
            <div>
              {{ oneRow.avg_earn_tri_str }}
            </div>
          </td>
          <td v-bind:class="{ sel_row: oneRow['currSelected'] }">
            <div>
              {{ oneRow.max_earn_str }}
            </div>
            <div>
              {{ oneRow.max_earn_aux_str }}
            </div>
            <div>
              {{ oneRow.max_earn_tri_str }}
            </div>
          </td>
          <td style="text-align: left;" v-bind:class="{ sel_row: oneRow['currSelected'] }">
            <span v-bind:class="getCardStyle(oneRow.day_200_thres)">&nbsp;</span>
            <span v-bind:class="getCardStyle(oneRow.day_300_thres)">&nbsp;</span>
            <span v-bind:class="getCardStyle(oneRow.day_400_thres)">&nbsp;</span>
            <span v-bind:class="getCardStyle(oneRow.day_500_thres)">&nbsp;</span>
            <span v-bind:class="getCardStyle(oneRow.day_600_thres)">&nbsp;</span>
          </td>
          <td v-bind:class="{ sel_row: oneRow['currSelected'] }">
            <span>{{ oneRow.fund_perc_len }}</span>
          </td>
          <td style="text-align: center;" v-bind:class="{ sel_row: oneRow['currSelected'] }">
            <button type="button" class="btn btn-primary"
                    @click.stop="showPlanDtlPane($event, oneRow)">
              详情
            </button>
          </td>
        </tr>
        <tr v-if="oneRow['showPlanDtl']">
          <td colspan="8" style="background-color: lightblue;">
            <div :style="{height: opPaneHeight + 'rem', 'line-height': opPaneHeight + 'rem'}">
              <div class="flex_row">
                <label>类型:&nbsp;</label>
                <select class="form-select" style="width: 6rem;" v-model="oneRow['indexType']">
                  <option v-for="option in type_map_objs_4_select" v-bind:value="option.source_val">
                    {{ option.source_name }}
                  </option>
                </select>
                <label>URL:&nbsp;</label>
                <input type="text" class="form-control-plaintext input_box_br" style="max-width: 25rem;" v-model="oneRow['indexUrl']">
                <label>Spider:&nbsp;</label>
                <select class="form-select nr_select" style="width: 5rem;" v-model="oneRow['specialSpider']" @click.stop>
                  <option v-for="option in spider_versions" v-bind:value="option.source_val">
                    {{ option.source_name }}
                  </option>
                </select>
                <button type="button" class="btn btn-primary"
                        @click="tobeAddOrRemoveObj = oneRow; tobeAddErrorMsg = ''; dlgController.addKbDlg.show();">
                  加入看板
                </button>
                <button type="button" class="btn btn-warning" v-if="oneRow['in_kanban']"
                        @click="tobeAddOrRemoveObj = oneRow; dlgController.rmKbDlg.show();">
                  移出看板
                </button>
              </div>
            </div>
          </td>
        </tr>
      </template>
      </tbody>
    </table>
  </div>
  <div class="modal fade" id="rmKbDialog" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">移出确认</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <h6>从看板移出以下: </h6>
          <h6>{{ tobeAddOrRemoveObj?.fund_id }}&nbsp;{{ tobeAddOrRemoveObj?.fund_name }}</h6>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
          <button type="button" class="btn btn-primary" @click.prevent="removeKanban4ui()">移出看板</button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal fade" id="addKbDialog" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">增加确认</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <h6>以下被加入看板: </h6>
          <h6>{{ tobeAddOrRemoveObj?.fund_id }}&nbsp;{{ tobeAddOrRemoveObj?.fund_name }}</h6>
          <h6>URL:&nbsp;{{ tobeAddOrRemoveObj?.indexUrl }}</h6>
          <h6>Type:&nbsp;{{ tobeAddOrRemoveObj?.indexType }}</h6>
          <h6>Spider:&nbsp;{{ tobeAddOrRemoveObj?.specialSpider }}</h6>
          <h6 class="bg-danger" v-if="tobeAddErrorMsg.length > 0">{{ tobeAddErrorMsg }}</h6>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
          <button type="button" class="btn btn-primary" @click.prevent="addKanban4ui()"
                  v-bind:disabled="tobeAddErrorMsg.length > 0">加入看板
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
  getCardStyle,
  type_map_objs_4_select,
  topSecClass
} from "../lib/commonUtils.js"
import {onMounted, computed, ref, watch, nextTick} from "vue";
import {storeToRefs} from 'pinia'
import {useZsRepoStore} from "../store/zsrepoStore.js";
import {useZskbStore} from '../store/zskbStore';
import {Modal} from 'bootstrap';

const zsRepoStore = useZsRepoStore()
const {zsRepoObjs, zsRepoHides, zsRepoExcludes} = storeToRefs(zsRepoStore)
const {addZsRepoHide, getZsRepo, excludeRepo} = zsRepoStore

const zskbStore = useZskbStore()
const {zskbObjs} = storeToRefs(zskbStore)
const {removeKanban, addKanban} = zskbStore

const colWidMap = {
  'col_1': 8,
  'col_2': 3,
  'col_3': 4,
  'col_4': 4,
  'col_5': 4,
  'col_6': 5,
  'col_7': 3,
  'col_8': 3
}

const spider_versions = [
  {'source_name': 'v1', 'source_val': 'v1'},
  {'source_name': 'v2', 'source_val': 'v2'}
]

const showHides = ref(false)
const zsRepoViewObjs = ref([])

watch([zsRepoObjs, zskbObjs, zsRepoHides, zsRepoExcludes, showHides], () => {
  const _kb_fund_ids = zskbObjs.value.map(elem => elem['fund_id'])
  zsRepoObjs.value.forEach((elem) => {
    if (_kb_fund_ids.indexOf(elem['fund_id']) != -1) {
      elem['in_kanban'] = true
      let _searches = zskbObjs.value.filter((kbObj) => kbObj['fund_id'] === elem['fund_id'])
      elem['indexType'] = _searches[0]['indexType']
      elem['indexUrl'] = _searches[0]['indexUrl']
      if (_searches[0].hasOwnProperty("specialSpider") && _searches[0]['specialSpider'] === "v2") {
        elem['specialSpider'] = "v2"
      } else {
        elem['specialSpider'] = "v1"
      }
    } else {
      elem['in_kanban'] = false
    }
    if (zsRepoHides.value.indexOf(elem['fund_id']) != -1) {
      elem['hide_repo'] = true
    } else {
      elem['hide_repo'] = false
    }
    if (zsRepoExcludes.value.indexOf(elem['fund_id']) != -1) {
      elem['exclude_repo'] = true
    } else {
      elem['exclude_repo'] = false
    }
  })
  if (showHides.value) {
    zsRepoViewObjs.value = zsRepoObjs.value
  } else {
    zsRepoViewObjs.value = zsRepoObjs.value.filter(elem => !elem['hide_repo'])
  }
}, {immediate: true})

const currTotNum = computed(() => {
  return zsRepoViewObjs.value.length
})

function showPlanDtlPane(event, oneRowObj) {
  if (oneRowObj.hasOwnProperty('showPlanDtl')) {
    oneRowObj['showPlanDtl'] = !oneRowObj['showPlanDtl']
  } else {
    oneRowObj['showPlanDtl'] = true
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
  zsRepoViewObjs.value.forEach((elem) => elem['currSelected'] = false)
}

const currSelectedNum = ref(0)
const currRepoHideNum = ref(0)

watch(zsRepoViewObjs, () => {
  let _filtered_1 = zsRepoViewObjs.value.filter((elem => elem['currSelected']))
  currSelectedNum.value = _filtered_1.length
  let _filtered_2 = zsRepoViewObjs.value.filter((elem) => elem['hide_repo'])
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
  if (_field === 'cluster_id') {
    if (sortFieldFlag.value) {
      zsRepoViewObjs.value.sort((a, b) => {
        return a['cluster_id'] - b['cluster_id'];
      });
    } else {
      zsRepoViewObjs.value.sort((a, b) => {
        return b['cluster_id'] - a['cluster_id'];
      });
    }
  } else if (_field === 'min_earn') {
    if (sortFieldFlag.value) {
      zsRepoViewObjs.value.sort((a, b) => {
        return a['min_sort_tot_earn'] - b['min_sort_tot_earn'];
      });
    } else {
      zsRepoViewObjs.value.sort((a, b) => {
        return b['min_sort_tot_earn'] - a['min_sort_tot_earn'];
      });
    }
  } else if (_field === 'avg_earn') {
    if (sortFieldFlag.value) {
      zsRepoViewObjs.value.sort((a, b) => {
        return a['avg_sort_tot_earn'] - b['avg_sort_tot_earn'];
      });
    } else {
      zsRepoViewObjs.value.sort((a, b) => {
        return b['avg_sort_tot_earn'] - a['avg_sort_tot_earn'];
      });
    }
  } else if (_field === 'max_earn') {
    if (sortFieldFlag.value) {
      zsRepoViewObjs.value.sort((a, b) => {
        return a['max_sort_tot_earn'] - b['max_sort_tot_earn'];
      });
    } else {
      zsRepoViewObjs.value.sort((a, b) => {
        return b['max_sort_tot_earn'] - a['max_sort_tot_earn'];
      });
    }
  } else if (_field === 'day_xxx_thres') {
    if (sortFieldFlag.value) {
      zsRepoViewObjs.value.sort((a, b) => {
        return a['day_sort_tot_thres'] - b['day_sort_tot_thres'];
      });
    } else {
      zsRepoViewObjs.value.sort((a, b) => {
        return b['day_sort_tot_thres'] - a['day_sort_tot_thres'];
      });
    }
  } else if (_field === 'fund_len') {
    if (sortFieldFlag.value) {
      zsRepoViewObjs.value.sort((a, b) => {
        return a['fund_perc_len'] - b['fund_perc_len'];
      });
    } else {
      zsRepoViewObjs.value.sort((a, b) => {
        return b['fund_perc_len'] - a['fund_perc_len'];
      });
    }
  } else if (_field === 'in_kanban') {
    if (sortFieldFlag.value) {
      zsRepoViewObjs.value.sort((a, b) => {
        return a['in_kanban'] - b['in_kanban'];
      });
    } else {
      zsRepoViewObjs.value.sort((a, b) => {
        return b['in_kanban'] - a['in_kanban'];
      });
    }
  } else if (_field === 'selected') {
    zsRepoViewObjs.value.sort((a, b) => {
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
    if (currSelectedNum.value >= 1) {
      const func = elem => elem['currSelected'] && !elem['hide_repo']
      let _idx = zsRepoViewObjs.value.findIndex(func)
      if (_idx != -1) {
        let _rowObj = zsRepoViewObjs.value[_idx]
        rowElements.value[_rowObj['fund_id']].scrollIntoView({block: "center", behavior: "smooth"})
      }
    } else {
      let _fund_id = zsRepoViewObjs.value[0]['fund_id']
      rowElements.value[_fund_id].scrollIntoView({block: "center", behavior: "smooth"})
    }
  })
}

const tobeAddOrRemoveObj = ref(null)
const tobeAddErrorMsg = ref("")
const dlgController = ref({rmKbDlg: null, addKbDlg: null})
onMounted(() => {
  dlgController.value.rmKbDlg = new Modal('#rmKbDialog', {})
  dlgController.value.addKbDlg = new Modal('#addKbDialog', {})
})

async function removeKanban4ui() {
  if (tobeAddOrRemoveObj.value) {
    const retval = await removeKanban(tobeAddOrRemoveObj.value['fund_id'], tobeAddOrRemoveObj.value['fund_name'])
    if (retval) {
      dlgController.value.rmKbDlg.hide()
    }
  }
}

async function addKanban4ui() {
  if (tobeAddOrRemoveObj.value) {
    if (tobeAddOrRemoveObj.value['indexType'] === null || !tobeAddOrRemoveObj.value['indexUrl']
        || tobeAddOrRemoveObj.value['specialSpider'] === null) {
      tobeAddErrorMsg.value = "非法的类型或URL"
      return
    } else {
      tobeAddErrorMsg.value = ""
    }
    const retval = await addKanban(tobeAddOrRemoveObj.value['fund_id'], tobeAddOrRemoveObj.value['fund_name'],
        tobeAddOrRemoveObj.value['indexType'], tobeAddOrRemoveObj.value['indexUrl'], tobeAddOrRemoveObj.value['specialSpider'])
    if (retval) {
      dlgController.value.addKbDlg.hide()
    }
  }
}

const rowElements = ref({})
const searchCond = ref("")

function searchByCond() {
  if (searchCond.value.trim() === '') {
    clearSelected()
    return
  }
  let _foundCnt = 0
  let arr = searchCond.value.trim().split(" ")
  zsRepoObjs.value.forEach((elem) => {
    if (arr.length === 1) {
      let _cond_1 = arr[0].trim()
      if (elem['fund_name'].indexOf(_cond_1) !== -1) {
        elem['currSelected'] = true
        if (!elem['hide_repo']) {
          _foundCnt += 1
        }
      }
    } else if (arr.length === 2) {
      let _cond_1 = arr[0].trim()
      let _cond_2 = arr[1].trim()
      if (elem['fund_name'].indexOf(_cond_1) !== -1 && elem['fund_name'].indexOf(_cond_2) !== -1) {
        elem['currSelected'] = true
        if (!elem['hide_repo']) {
          _foundCnt += 1
        }
      }
    }
  })
  if (_foundCnt > 0) {
    sortByField('selected')
  } else {
    searchCond.value = ""
  }
}
</script>

<style scoped></style>