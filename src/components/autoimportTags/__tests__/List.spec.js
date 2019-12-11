import { shallowMount } from '@vue/test-utils'
import Component from '../List.vue'
import Vue from 'vue'
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import { getters } from '@/store/modules/tagsFilter'
Vue.use(Vuetify)
Vue.use(Vuex)

const createCmp = ({ propsData, mocks, store }) =>
  shallowMount(Component, {
    propsData,
    mocks,
    store
  })
const createStore = items =>
  new Vuex.Store({
    modules: {
      tagsFilter: {
        namespaced: true,
        state: {
          items
        },
        getters
      }
    }
  })
describe('List.vue', () => {
  it('is loading', () => {
    const mocks = {
      $apollo: {
        queries: {
          groupTagsList: {
            loading: true
          }
        }
      }
    }
    const wrapper = createCmp({ mocks })
    expect(wrapper).toMatchSnapshot()
  })
  it('has an error', () => {
    const mocks = {
      $apollo: {
        queries: {
          groupTagsList: {
            loading: false
          }
        }
      }
    }
    const wrapper = createCmp({ mocks })
    wrapper.setData({ error: true })
    expect(wrapper).toMatchSnapshot()
  })

  it('has no results', () => {
    const mocks = {
      $apollo: {
        queries: {
          groupTagsList: {
            loading: false
          }
        }
      }
    }
    const wrapper = createCmp({ mocks })
    wrapper.setData({
      groupTagsList: []
    })
    expect(wrapper).toMatchSnapshot()
  })

  it('has 3 results one is filtered', () => {
    const mocks = {
      $apollo: {
        error: false,
        queries: {
          groupTagsList: {
            loading: false
          }
        }
      }
    }
    const store = createStore({ tag1: false, tag2: true })
    const wrapper = createCmp({ mocks, store })
    wrapper.setData({
      groupTagsList: [
        { group: { title: 'B' }, tags: ['tag2', 'tagB'], groupId: 'groupId1' },
        { group: { title: 'A' }, tags: ['tag2', 'tagA'], groupId: 'groupId2' },
        { group: { title: ':a' }, tags: ['taga'], groupId: 'groupId3' }
      ]
    })
    expect(wrapper).toMatchSnapshot()
  })
})
