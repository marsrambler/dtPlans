<template>
  <template v-if="!simplifyMode">
    <template v-if="itemArray.length > 0">
      <div id="flex_container_wnd" class="flex_row_wp" :ref="(el) => (rowElements['container'] = el)">
        <template v-for="oneItem in itemArray" :key="oneItem">
          <template v-if="oneItem.indexOf('---') == -1">
            <input class="btn btn-danger btn-sm" type="button" :value="oneItem" @click="$emit('click-item', oneItem)">
          </template>
          <template v-else>
            <span style="font-weight: bold;">&nbsp;|&nbsp;</span>
          </template>
        </template>
        <div class="form-check form_check_cust" style="display: inline-block; margin-bottom: -0.6rem;">
          <input class="form-check-input" type="checkbox" id="flexCheckDefault" v-model="useFilterMode">
          <label class="form-check-label" for="flexCheckDefault">使用过滤</label>
        </div>
        <input class="btn btn-primary btn-sm" type="button" value="排序" @click="$emit('order-filter')">
        <input class="btn btn-light btn-sm" type="button" value="折叠" @click="$emit('mode-changed')">
      </div>
    </template>
  </template>
  <template v-else>
    <template v-if="itemSubArray.length > 0">
      <div id="flex_container_wnd" class="flex_row_wp" :ref="(el) => (rowElements['container'] = el)">
        <template v-for="oneItem in itemSubArray" :key="oneItem">
          <template v-if="oneItem.indexOf('---') == -1">
            <input class="btn btn-danger btn-sm" type="button" :value="oneItem">
          </template>
          <template v-else>
            <span style="font-weight: bold;">&nbsp;|&nbsp;</span>
          </template>
        </template>
        <input class="btn btn-light btn-sm" type="button" value="展开" @click="$emit('mode-changed')">
      </div>
    </template>
  </template>
</template>

<script setup>
import '../assets/style.scss'
import '../style.css'
import {onMounted, onUpdated, ref, computed, watch} from "vue";

const props = defineProps(["itemArray", "useFilter", "simplifyMode"])
const emits = defineEmits(["click-item", "height-changed", 'filter-changed', 'order-filter', 'mode-changed'])

const remPx = parseInt(getComputedStyle(document.documentElement).fontSize)
const rowElements = ref({})
const prevHeight = ref(0)
const useFilterMode = ref(false)
const itemSubArray = ref([])

watch(
  () => props.itemArray,
  (newProps) => {
    if (newProps.length > 5) {
      itemSubArray.value = newProps.slice(0, 5)
    } else {
      itemSubArray.value = newProps.slice()
    }
  },
  {
    immediate: true
  }
)

watch(
  () => props.useFilter,
  (newProps) => {
    if (newProps !== useFilterMode.value) {
      useFilterMode.value = newProps
    }
  },
  {
  immediate: true
  }
)

watch(useFilterMode, () => {
  if (useFilterMode.value !== props.useFilter.value) {
    emits('filter-changed', useFilterMode.value)
  }
})


onUpdated(() => {
  raiseSizeEvent()
})

onMounted(() => {
  raiseSizeEvent()
})

window.addEventListener('resize', handleWndResize)
function handleWndResize() {
  raiseSizeEvent()
}

function raiseSizeEvent() {
  let _uiElem = rowElements.value['container']
  if (_uiElem) {
    let _height = _uiElem.scrollHeight ? _uiElem.scrollHeight : _uiElem.clientHeight ? _uiElem.clientHeight : _uiElem.offsetHeight
    if (_height != prevHeight.value) {
      prevHeight.value = _height
      if (props.itemArray.length === 0) {
        emits('height-changed', 0, 0)
      } else {
        emits('height-changed', _height / remPx, props.itemArray.length)
      }
    }
  } else {
    emits('height-changed', 0, 0)
  }
}

</script>

<style scoped>
.flex_row_wp {
  padding: 0.5rem 0.5rem 0 0.5rem;
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 0.3rem;
}
</style>