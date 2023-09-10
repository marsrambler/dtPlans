import {computed, ref} from 'vue'

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
const minPaneWidth = ref(60)

const topSecClass = ref({
    'position': 'fixed',
    'top': opPaneTopPos.value + 'rem',
    'height': topSectHeight.value + 'rem',
    'z-index': 100,
    'background-color': 'rgba(255,255,255,1)',
    'width': '100%',
    'min-width': minPaneWidth.value + 'rem'
})


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
    topSecClass
}