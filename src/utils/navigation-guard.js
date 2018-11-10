import store from '../store'

export const requireAuth = (to, from, next) => {
  if (store.getters.name === '') {
    next('/')
  } else {
    next()
  }
}
