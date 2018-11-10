import store from '../store'

export const requireAuth = (to, from, next) => {
  if (store.getters.name1 === '' || store.getters.name2 === '') {
    next('/')
  } else {
    next()
  }
}
