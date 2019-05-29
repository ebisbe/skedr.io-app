import _sortBy from 'lodash/sortBy'
import Vue from 'vue'
import { filters } from '@/mixins'

export const state = () => ({
  pool: {}
})

export const getters = {
  ids: ({ pool }) => Object.keys(pool),
  items: ({ pool }) => Object.values(pool),
  total: (state, getters) => getters.ids.length,
  inPool: ({ pool }) => id => pool[id] !== undefined,
  hasItems: (state, getters) => getters.total > 0,

  orderByTitle: ({ pool }) => _sortBy(pool, [({ title = '' }) => filters.methods.sanitize(title)]),
  list: (state, getters) =>
    getters.orderByTitle
      .map(({ title = '' }) => title)
      .filter(title => title !== '')
      .join(', ')
}

export const mutations = {
  add: ({ pool }, { id, item }) => Vue.set(pool, id, item),
  remove: ({ pool }, id) => Vue.delete(pool, id),
  clear: state => (state.pool = {})
}
