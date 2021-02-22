import defaultSettings from '@/settings'
import {objectEvaluate} from "@/utils/common";

const {
  isFixHeader,
  isShowLogo,
  isShowTag,
  isShowBreadcrumb,
  isShowFooter,
  isNight,
  isVertical,
  isUniqueOpened,
  layoutSize,
  pagingSize
} = defaultSettings;

const type = {
  CHANGE_SETTING: 'CHANGE_SETTING',
  RESTORE_SETTING: 'RESTORE_SETTING'
};

const state = {
  isFixHeader,
  isShowLogo,
  isShowTag,
  isShowBreadcrumb,
  isShowFooter,
  isNight,
  isVertical,
  isUniqueOpened,
  layoutSize,
  pagingSize
};

const getters = {
  setting: state => state
};

const mutations = {
  [type.CHANGE_SETTING](state, {key, value}) {
    if (Object.prototype.hasOwnProperty.call(state, key)) {
      state[key] = value
    }
  },
  [type.RESTORE_SETTING](state) {
    objectEvaluate(state, defaultSettings)
  }
};

const actions = {
  changeSetting: ({commit}, setting) => {
    commit(type.CHANGE_SETTING, setting)
  },
  restoreSetting: ({commit}) => {
    commit(type.RESTORE_SETTING)
  }
};

export default {
  state,
  getters,
  mutations,
  actions
}
