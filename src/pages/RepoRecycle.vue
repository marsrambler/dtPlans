<template>
  <div :style="infoTopSecClass">
    <div id="op_pane" :style="{ 'height': opPaneHeight + infoPaneHeight + 'rem'}">
      <FlexContainer :item-array=zsRepoRecycleHides
                     :use-filter="useFilterCond"
                     :simplifyMode="beSimplify"
                     @click-item="popUpRmCfmDialog($event)"
                     @height-changed="containerResized"
                     @filter-changed="useFilterCond = $event"
                     @mode-changed="beSimplify = !beSimplify"
                     @order-filter="popUpOrderDialog">
      </FlexContainer>
      <div :style="{ 'height': opPaneHeight + 'rem'}" class="grid_pane_c12">
        <div>总数:&nbsp;<span class="badge bg-success">{{ currTotNum }}</span>
        </div>
        <div style="cursor: pointer;" @click="clearSelected()">
          选择:&nbsp;<span class="badge bg-warning text-dark">{{ currSelectedNum }}</span>
        </div>
        <div style="cursor: pointer;" @click="clearHidden()">
          隐藏:&nbsp;<span class="badge bg-dark">{{ currRepoHideNum }}</span>
        </div>
        <input type="text" class="form-control-plaintext search_box" style="grid-column: 4 / span 2;"
               ref="filter_input" @keyup.enter="updateRepoRecycleHides4Ui($refs.filter_input.value)">
        <input class="btn btn-warning btn-sm" type="button" value="过滤"
               @click="updateRepoRecycleHides4Ui($refs.filter_input.value)">
        <input type="text" class="form-control-plaintext search_box" style="grid-column: 7 / span 2;"
               ref="search_input" @keyup.enter="searchByCond($refs.search_input.value)">
        <input class="btn btn-primary btn-sm" type="button" value="查找" @click="searchByCond($refs.search_input.value)">
        <input class="btn btn-primary btn-sm" type="button" value="前移选择" @click="sortByField('selected')">
        <input class="btn btn-warning btn-sm" type="button" value="隐藏选择" @click="hideSelected">
        <input class="btn btn-warning btn-sm" type="button" value="刷新" @click="getRepoRecycles()">
      </div>
    </div>
    <table id="table_header" class="table table-bordered" style="margin-bottom: 0;">
      <thead style="">
      <tr :style="{ 'height': tabHeaderHeight + 'rem' }">
        <th :style="{ 'width': colWidMap['col_1'] + 'rem' }">
          <div>
            <div class="w50_w_br">
              <span>ID</span>
            </div>
            <div class="w50_w_br" @click="sortByField('perc_not_update_days')" style="border: none;">
              <template v-if="sortFieldName === 'perc_not_update_days'">
                <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
                <span v-else><i class="bi bi-arrow-down"></i></span>
              </template>
              <span>更新</span>
            </div>
          </div>
        </th>
        <th :style="{ 'width': colWidMap['col_2'] + 'rem' }">
          <span>名称</span>
        </th>
        <th :style="{ 'width': colWidMap['col_3'] + 'rem' }" @click="sortByField('fund_perc_len')">
          <template v-if="sortFieldName === 'fund_perc_len'">
            <span v-if="sortFieldFlag"><i class="bi bi-arrow-up"></i></span>
            <span v-else><i class="bi bi-arrow-down"></i></span>
          </template>
          <span>长度</span>
        </th>
        <th :style="{ 'width': colWidMap['col_4'] + 'rem' }">
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
           :style="{ 'position': 'absolute', 'top': infoTabContTopPos + 'rem', 'min-width': minPaneWidth + 'rem' }">
      <thead style="">
      <tr>
        <th :style="{ 'width': colWidMap['col_1'] + 'rem' }"></th>
        <th :style="{ 'width': colWidMap['col_2'] + 'rem' }"></th>
        <th :style="{ 'width': colWidMap['col_3'] + 'rem' }"></th>
        <th :style="{ 'width': colWidMap['col_4'] + 'rem' }"></th>
      </tr>
      </thead>
      <tbody>
      <template v-for="oneRow in recycleViewObjs" :key="oneRow.fund_id">
        <template v-if="!oneRow['hide_repo']">
          <tr style="cursor: pointer;" @click="selOrDesRow(oneRow)" v-bind:id="oneRow.fund_id"
              v-bind:class="{ sel_row: oneRow['currSelected'] }" :ref="(el) => {if (el) {rowElements[oneRow.fund_id] = el}}">
            <td v-bind:class="{ sel_row: oneRow['currSelected'] }">
                <span>
                  {{ oneRow.fund_id }}
                  <template v-if="oneRow['perc_not_update_days'] && oneRow['perc_not_update_days'] - 1 >= 3">
                    <div style="font-size: 0.85rem;">
                      {{ oneRow.last_perc_date_str }} <span
                        class="badge bg-danger">缺失: {{ oneRow.perc_not_update_days }}</span>
                    </div>
                  </template>
                </span>
            </td>
            <td v-bind:class="{ sel_row: oneRow['currSelected'] }">
              {{ oneRow.fund_name }}
            </td>
            <td v-bind:class="{ sel_row: oneRow['currSelected'] }">
              {{ oneRow.fund_perc_len }}
            </td>
            <td style="text-align: center;" v-bind:class="{ sel_row: oneRow['currSelected'] }">
              <button type="button" class="btn btn-primary"
                      @click.stop="includeRepo(oneRow['fund_id'], oneRow['fund_name'])">
                找回
              </button>
            </td>
          </tr>
        </template>
      </template>
      </tbody>
      <tfoot>
      <tr style="line-height: 5rem; border-color: white;">
        <td colspan="4">
          &nbsp;
        </td>
      </tr>
      </tfoot>
    </table>
  </div>
  <div class="modal fade" id="sortDialog" tabindex="-1">
    <div class="modal-dialog" style="max-width: 60rem;">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">排序</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <textarea style="width: 100%; height: 28rem;" v-model="recycleHides4Sort"></textarea>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click.prevent="saveOrderedFilter();">保存</button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal fade" id="rmCfmDialog" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">确认</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          要移除: {{rmFilterStr}} 吗?
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
          <button type="button" class="btn btn-primary" @click.prevent="rmFilterLogic">删除</button>
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
  minPaneWidth,
  infoTopSecClass,
  infoPaneHeight,
  infoTabContTopPos
} from "../lib/commonUtils.js"
import {ref, watch, nextTick, computed, onUpdated, onMounted} from "vue";
import {storeToRefs} from 'pinia'
import {useZsRepoStore} from "../store/zsrepoStore.js";
import {useZskbStore} from '../store/zskbStore';
import FlexContainer from "../components/FlexContainer.vue";
import {Modal} from "bootstrap";

const zsRepoStore = useZsRepoStore()
const {
  zsRepoObjs,
  zsRepoHides,
  zsRepoExcludes,
  zsRepoBases,
  zsRepoRecycles,
  zsRepoRecycleHides
} = storeToRefs(zsRepoStore)
const {
  addZsRepoHide,
  getZsRepo,
  excludeRepo,
  includeRepo,
  saveRepoBase,
  getRepoRecycles,
  getRepoRecycleHides,
  updateRepoRecycleHides,
  sortRepoRecycleHides
} = zsRepoStore

const zskbStore = useZskbStore()
const {zskbObjs} = storeToRefs(zskbStore)
const {removeKanban, addKanban} = zskbStore
const useFilterCond = ref(true)
const beSimplify = ref(true)
const colWidMap = {
  'col_1': 5,
  'col_2': 8,
  'col_3': 4,
  'col_4': 5
}

const recycleViewObjs = ref([])

watch([zsRepoRecycles, zsRepoRecycleHides, useFilterCond], () => {
  recycleViewObjs.value = zsRepoRecycles.value
  if (zsRepoRecycleHides.value.length > 0 && useFilterCond.value) {
    zsRepoRecycleHides.value.forEach((elem) => {
      if (elem.indexOf('&<') !== -1) {
        let _flt_len = parseInt(elem.trim().replace('&<', "").trim())
        recycleViewObjs.value = recycleViewObjs.value.filter((one_view) => one_view['fund_perc_len'] > _flt_len)
      } else {
        let _arr = elem.trim().split(" ")
        if (_arr.length === 1) {
          let _cond_1 = _arr[0].trim()
          if (_cond_1.length > 0) {
            recycleViewObjs.value = recycleViewObjs.value.filter((one_view) => one_view['fund_name'].indexOf(_cond_1) === -1)
          }
        } else if (_arr.length === 2) {
          let _cond_1 = _arr[0].trim()
          let _cond_2 = _arr[1].trim()
          if (_cond_1.length > 0 && _cond_2.length > 0) {
            recycleViewObjs.value = recycleViewObjs.value.filter((one_view) => !(one_view['fund_name'].indexOf(_cond_1) !== -1 && one_view['fund_name'].indexOf(_cond_2) !== -1))
          }
        }
      }
    })
  }
}, {immediate: true})

const dlgController = ref({ sortDlg: null }, {rmCfmDlg: null})
onMounted(() => {
  dlgController.value.sortDlg = new Modal('#sortDialog', {})
  dlgController.value.rmCfmDlg = new Modal('#rmCfmDialog', {})
})

const recycleHides4Sort = ref("")
function popUpOrderDialog() {
  recycleHides4Sort.value = ""
  zsRepoRecycleHides.value.forEach((elem) => {
    if (elem.indexOf("---") !== -1) {
      recycleHides4Sort.value += '\n' + elem + "# " + '\n'
    } else {
      recycleHides4Sort.value += elem + "# "
    }
  })
  dlgController.value.sortDlg.show()
}

function saveOrderedFilter() {
  let _arr = recycleHides4Sort.value.replaceAll("\n", "").split("#")
  let _tot_str = ''
  _arr.forEach((elem) => {
    if (elem.trim().length > 0) {
      _tot_str += elem.trim() + ','
    }
  })
  sortRepoRecycleHides(_tot_str)
  dlgController.value.sortDlg.hide()
}

const rmFilterStr = ref("")
function popUpRmCfmDialog(_hide_str) {
  rmFilterStr.value = _hide_str
  dlgController.value.rmCfmDlg.show()
}

function rmFilterLogic() {
  updateRepoRecycleHides(rmFilterStr.value)
  dlgController.value.rmCfmDlg.hide()
}

const currTotNum = computed(() => {
  return recycleViewObjs.value.length
})

function selOrDesRow(oneRowObj) {
  if (oneRowObj.hasOwnProperty('currSelected')) {
    oneRowObj['currSelected'] = !oneRowObj['currSelected']
  } else {
    oneRowObj['currSelected'] = true
  }
}

const currSelectedNum = ref(0)
const currRepoHideNum = ref(0)

watch(recycleViewObjs, () => {
  let _filtered_1 = recycleViewObjs.value.filter((elem => elem['currSelected']))
  currSelectedNum.value = _filtered_1.length
  let _filtered_2 = recycleViewObjs.value.filter((elem) => elem['hide_repo'])
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
      recycleViewObjs.value.sort((a, b) => {
        return a['perc_not_update_days'] - b['perc_not_update_days'];
      });
    } else {
      recycleViewObjs.value.sort((a, b) => {
        return b['perc_not_update_days'] - a['perc_not_update_days'];
      });
    }
  } else if (_field === 'fund_perc_len') {
    if (sortFieldFlag.value) {
      recycleViewObjs.value.sort((a, b) => {
        return a['fund_perc_len'] - b['fund_perc_len'];
      });
    } else {
      recycleViewObjs.value.sort((a, b) => {
        return b['fund_perc_len'] - a['fund_perc_len'];
      });
    }
  } else if (_field === 'selected') {
    recycleViewObjs.value.sort((a, b) => {
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
    })
  }
  scrollViewBySelection()
}

function scrollViewBySelection() {
  nextTick(() => {
    if (currSelectedNum.value >= 1) {
      const func = elem => elem['currSelected'] && !elem['hide_repo']
      let _idx = recycleViewObjs.value.findIndex(func)
      if (_idx != -1) {
        let _rowObj = recycleViewObjs.value[_idx]
        rowElements.value[_rowObj['fund_id']].scrollIntoView({block: "center", behavior: "smooth"})
      }
    } else {
      let _fund_id = recycleViewObjs.value[0]['fund_id']
      rowElements.value[_fund_id].scrollIntoView({block: "center", behavior: "smooth"})
    }
  })
}

const rowElements = ref({})
const filter_input = ref(null)

function updateRepoRecycleHides4Ui(_hide_input_str) {
  let _hide_str = _hide_input_str.trim()
  if (_hide_str.length === 0) {
    return
  }
  let _arr = _hide_str.split(" ")
  let _arr_new = _arr.filter((elem) => elem.length > 0)
  _hide_str = _arr_new.join(" ")
  updateRepoRecycleHides(_hide_str)
  filter_input.value.value = ""
}

const search_input = ref(null)

function searchByCond(_search_val) {
  if (_search_val.trim() === '') {
    clearSelected()
    return
  }
  let _foundCnt = 0
  let arr = _search_val.trim().split(" ")
  recycleViewObjs.value.forEach((elem) => {
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
    search_input.value.value = ""
  }
}

function clearSelected() {
  recycleViewObjs.value.forEach((elem) => elem['currSelected'] = false)
}

function hideSelected() {
  recycleViewObjs.value.forEach((elem) => {
    if (elem['currSelected']) {
      elem['hide_repo'] = true
    } else {
      elem['hide_repo'] = false
    }
  })
}

function clearHidden() {
  recycleViewObjs.value.forEach((elem) => elem['hide_repo'] = false)
}

function containerResized(param0, param1) {
  console.log("receiver container resized: ", param0, param1)
  infoPaneHeight.value = param0
}

</script>

<style scoped>
</style>