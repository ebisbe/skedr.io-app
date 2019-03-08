import _sortBy from 'lodash/sortBy'
import Vue from 'vue'

export const state = {
  groups: {}
}

export const getters = {
  total: ({ groups }) => Object.keys(groups).length,
  orderByTitle: ({ groups }) => _sortBy(groups, [({ title }) => title.replace(/[\W]/g, '').toLowerCase()]),
  hasItems: (state, getters) => getters.total > 0,
  list: (state, getters) => getters.orderByTitle.map(({ title }) => title).join(', '),
  inPool: ({ groups }) => id => groups[id] !== undefined
}

export const mutations = {
  add: ({ groups }, group) => Vue.set(groups, group.id, group),
  remove: ({ groups }, id) => Vue.delete(groups, id),
  clear: ({ groups }) => (groups = {})
}
