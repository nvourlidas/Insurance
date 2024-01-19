import { createStore } from 'vuex'

export default createStore({
  state: {
    sidebarVisible: '',
    sidebarUnfoldable: false,
    events: [],
  },

  getters: {
    EVENTS: state => state.events
  },

  mutations: {
    toggleSidebar(state) {
      state.sidebarVisible = !state.sidebarVisible
    },
    toggleUnfoldable(state) {
      state.sidebarUnfoldable = !state.sidebarUnfoldable
    },
    updateSidebarVisible(state, payload) {
      state.sidebarVisible = payload.value
    },

    ADD_EVENT: (state, event) => {
      state.events.push(event)
    },
    UPDATE_EVENT: (state, { id, title, start, end }) => {
      let index = state.events.findIndex(_event => _event.id == id)

      state.events[index].title = title;
      state.events[index].start = start;
      state.events[index].end = end;
    },
  },
  actions: {},
  modules: {},
})
