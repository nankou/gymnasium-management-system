import router from '@/router'

/* 布局设置 */
const type = {
  SET_ACTIVE: 'SET_ACTIVE',
  CLEAR_TAGS: 'CLEAR_TAGS',
  ADD_TAGS: 'ADD_TAGS',
  DELETE_TAGS: 'DELETE_TAGS',
  SET_BREADCRUMB: 'SET_BREADCRUMB'
};

const state = {
  active: '首页',
  breadcrumb: [],
  tags: [{title: "首页", name: "home", cache: false, indexPath: []}]
};

const getters = {
  active: state => state.active,
  tags: state => state.tags,
  breadcrumb: state => state.breadcrumb
};

const mutations = {
  [type.SET_ACTIVE](state, active) {
    if (active) state.active = active;
    else state.active = '首页'
  },
  [type.SET_BREADCRUMB](state, breadcrumb) {
    if (breadcrumb) state.breadcrumb = breadcrumb;
    else state.breadcrumb = []
  },
  [type.CLEAR_TAGS](state, tags) {
    if (tags) state.tags = tags;
    else state.tags = [{title: "首页", name: "home", cache: false, indexPath: []}]
  },
  [type.ADD_TAGS](state, tag) {
    let isExist = state.tags.some(item => {
      return item.title === tag.title;
    });
    if (!isExist) state.tags.push(tag);
  },
  [type.DELETE_TAGS](state, title) {
    let index = state.tags.findIndex(item => {
      if (item.title === title) return true;
    });
    if (state.active !== title) {
      state.tags.splice(index, 1);
      return;
    }
    let nextTag;
    index === state.tags.length - 1
      ? (nextTag = state.tags[index - 1])
      : (nextTag = state.tags[index + 1]);
    router.push({name: nextTag.name});
    state.active = nextTag.title;
    state.breadcrumb = nextTag.indexPath;
    state.tags.splice(index, 1);
  }
};

const actions = {
  setActive: ({commit}, active) => {
    commit(type.SET_ACTIVE, active)
  },
  clearTags: ({commit}, tags) => {
    commit(type.CLEAR_TAGS, tags)
  },
  addTags: ({commit}, tags) => {
    commit(type.ADD_TAGS, tags)
  },
  deleteTags: ({commit}, index) => {
    commit(type.DELETE_TAGS, index)
  },
  setBreadcrumb: ({commit}, breadcrumb) => {
    commit(type.SET_BREADCRUMB, breadcrumb)
  }
};


export default {
  state,
  getters,
  mutations,
  actions
}
