import store from '../store'

export const requireAuth = (to, from, next) => {
  if (store.getters.name1 === '') {
    next('/')
  } else {
    next()
  }
}
