import IO from '../model/clientIO'

export default {
  install(Vue) {
    Vue.prototype.$io = new IO()
  },
}
