import {computed, ref, watch} from 'vue'

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

const typeMapObj = {0: '宽指', 1: '主题', 2: '行业', 3:'QDII'}
const type_map_objs_4_select = [
    {'source_name': '宽指', 'source_val': 0},
    {'source_name': '主题', 'source_val': 1},
    {'source_name': '行业', 'source_val': 2},
    {'source_name': 'QDII', 'source_val': 3},
]

const navHeight = ref(3.5)
const opPaneTopPos = navHeight
const opPaneHeight = ref(3)
const tabHeaderHeight = ref(2)
const topSectHeight = ref(opPaneHeight.value + tabHeaderHeight.value)
const tabContTopPos = ref(navHeight.value + topSectHeight.value)
const minPaneWidth = ref(72)

const topSecClass = ref({
    'position': 'fixed',
    'top': opPaneTopPos.value + 'rem',
    'height': topSectHeight.value + 'rem',
    'z-index': 100,
    'background-color': 'rgba(255,255,255,1)',
    'width': '100%',
    'min-width': minPaneWidth.value + 'rem'
})

const infoPaneHeight = ref(0)
const infoTopSectHeight = ref(0)
const infoTabContTopPos = ref(0)
const infoTopSecClass = ref({})

watch(infoPaneHeight, () => {
    infoTopSectHeight.value = infoPaneHeight.value + opPaneHeight.value + tabHeaderHeight.value
    infoTabContTopPos.value = navHeight.value + infoTopSectHeight.value
    infoTopSecClass.value = {
        'position': 'fixed',
        'top': opPaneTopPos.value + 'rem',
        'height': infoTopSectHeight.value + 'rem',
        'z-index': 100,
        'background-color': 'rgba(255,255,255,1)',
        'width': '100%',
        'min-width': minPaneWidth.value + 'rem'
    }
}, {immediate: true})

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
    if (_val >= 8) {
      return 'blue_8';
    } else if (_val >= 7) {
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

function getHitStyle(_val) {
    if (_val > 0) {
      return 'purple_card';
    } else if (_val < 0) {
      return 'grey_card';
    }
    return 'white_card';
}

export {
    navHeight,
    opPaneTopPos,
    opPaneHeight,
    tabHeaderHeight,
    topSectHeight,
    tabContTopPos,
    minPaneWidth,
    getCardStyle,
    typeMapObj,
    type_map_objs_4_select,
    topSecClass,
    infoPaneHeight,
    infoTopSectHeight,
    infoTabContTopPos,
    infoTopSecClass,
    getPosColor,
    getNegColor,
    getHitStyle
}