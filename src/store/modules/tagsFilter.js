import Vue from 'vue'

export const state = {
  items: {}
}

export const getters = {
  isEmpty: ({ items }) => Object.values(items).indexOf(true) === -1
}

export const mutations = {
  upsert: ({ items }, tag) => Vue.set(items, tag, !items[tag]),
  clear: state => (state.items = {})
}
