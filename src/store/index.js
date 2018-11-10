import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './types'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    name1: 'sang',
    name2: 'sang1',
  },
  getters: {
    name1: s => s.name1,
    name2: s => s.name2,
  },
  mutations: {
    [types.SET_NAME_1]: (s, name) => {
      s.name1 = name
    },
    [types.SET_NAME_2]: (s, name) => {
      s.name2 = name
    },
  },
  actions: {
    [types.PLAYER_1]: ({ commit }, name) => {
      commit(types.SET_NAME_1, name)
    },
    [types.PLAYER_2]: ({ commit }, name) => {
      commit(types.SET_NAME_2, name)
    },
  },
})
