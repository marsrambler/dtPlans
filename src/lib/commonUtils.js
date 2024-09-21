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

function getHitStyle(_val, _for_pos=true) {
    if (_for_pos) {
        if (_val > 0) {
          return 'purple_card';
        } else if (_val < 0) {
          return 'grey_card';
        }
        return 'white_card';
    } else {
        if (_val > 0) {
          return 'darkgreen_card';
        } else if (_val < 0) {
          return 'grey_card';
        }
        return 'white_card';
    }
}

function getTodayStr() {
    Date.prototype.Format = function (fmt) {
        let o = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S": this.getMilliseconds()
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (let k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
    return new Date().Format("yyyy-MM-dd");
}

function get_suggestion_by_wav(wav_obj) {
    let _dur_str_st = '<span style="color: red; position: relative;">回报快<span style="font-size: 0.8rem;position: absolute;top: 0.8rem;left: 1.1rem;color: black;font-weight: bold;border: solid 1px black;border-radius: 5px;line-height: 0.9rem; padding: 2px 2px 0px 1px;">买</span></span>';
    let _dur_str_md = '<span style="color: orange; position: relative;">回报中<span style="font-size: 0.8rem;position: absolute;top: 0.8rem;left: 1.1rem;color: black;font-weight: bold;border: solid 1px black;border-radius: 5px;line-height: 0.9rem; padding: 2px 2px 0px 1px;">买</span></span>';
    let _dur_str_lg = '<span style="color: blue; position: relative;">回报慢<span style="font-size: 0.8rem;position: absolute;top: 0.8rem;left: 1.1rem;color: black;font-weight: bold;border: solid 1px black;border-radius: 5px;line-height: 0.9rem; padding: 2px 2px 0px 1px;">买</span></span>';

    let _earn_str_hi = '<span style="color: red;position: relative;">盈利高<span style="font-size: 0.8rem;position: absolute;top: 0.8rem;left: 1.1rem;color: darkviolet;font-weight: bold;border: solid 1px darkviolet;border-radius: 5px;line-height: 0.9rem; padding: 2px 2px 0px 1px;">卖</span></span>';
    let _earn_str_md = '<span style="color: orange;position: relative;">盈利中<span style="font-size: 0.8rem;position: absolute;top: 0.8rem;left: 1.1rem;color: darkviolet;font-weight: bold;border: solid 1px darkviolet;border-radius: 5px;line-height: 0.9rem; padding: 2px 2px 0px 1px;">卖</span></span>'
    let _earn_str_lo = '<span style="color: blue;position: relative;">盈利低<span style="font-size: 0.8rem;position: absolute;top: 0.8rem;left: 1.1rem;color: darkviolet;font-weight: bold;border: solid 1px darkviolet;border-radius: 5px;line-height: 0.9rem; padding: 2px 2px 0px 1px;">卖</span></span>'

    let _sugg_str = '';
    if (wav_obj['wav_dur_level'] < 3) {
        _sugg_str += _dur_str_st
        _sugg_str += '<span>&nbsp;</span>'
        if (wav_obj['wav_earn_level'] < 5) {
            _sugg_str += _earn_str_hi
        } else if (wav_obj['wav_earn_level'] < 8) {
            _sugg_str += _earn_str_md
        } else {
            _sugg_str += _earn_str_lo
        }
    } else if (wav_obj['wav_dur_level'] < 6) {
        _sugg_str += _dur_str_md
        _sugg_str += '<span>&nbsp;</span>'
        if (wav_obj['wav_earn_level'] < 3) {
            _sugg_str += _earn_str_hi
        } else if (wav_obj['wav_earn_level'] < 7) {
            _sugg_str += _earn_str_md
        } else {
            _sugg_str += _earn_str_lo
        }
    } else {
        _sugg_str += _dur_str_lg
        _sugg_str += '<span>&nbsp;</span>'
        if (wav_obj['wav_earn_level'] < 3) {
            _sugg_str += _earn_str_hi
        } else if (wav_obj['wav_earn_level'] < 5) {
            _sugg_str += _earn_str_md
        } else {
            _sugg_str += _earn_str_lo
        }
    }
    return _sugg_str;
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
    getHitStyle,
    getTodayStr,
    get_suggestion_by_wav
}