import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './types'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    name: 'sang',
  },
  getters: {
    name: s => s.name,
  },
  mutations: {
    [types.SET_NAME]: (s, name) => {
      s.name = name
    },
  },
  actions: {
    [types.PLAY_GAME]: ({ commit }, name) => {
      commit(types.SET_NAME, name)
    },
  },
})
