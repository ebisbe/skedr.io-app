import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import Comp from '../ShareDialog'
import Vuex from 'vuex'
import { getters as groupsGet, mutations as groupsMutations } from '@/store/modules/groupsPool'
import { getters as poolGet, actions as poolActions } from '@/store/modules/pool'
import { getters as userGet } from '@/store/modules/user'

Vue.use(Vuetify)
Vue.use(Vuex)

const localVue = createLocalVue()

const createStore = (photos = [], groups = {}) =>
  new Vuex.Store({
    modules: {
      groupsPool: {
        namespaced: true,
        state: { pool: groups },
        mutations: groupsMutations,
        getters: groupsGet
      },
      pool: {
        namespaced: true,
        state: { pool: photos },
        actions: poolActions,
        getters: poolGet
      },
      user: {
        namespaced: true,
        state: {
          username: 'userId'
        },
        getters: userGet
      }
    }
  })

const createCmp = (propsData, store) =>
  shallowMount(Comp, {
    localVue,
    propsData,
    vuetify: new Vuetify(),
    store,
    stubs: ['ApolloQuery', 'ApolloMutation']
  })
describe('ShareDialog', () => {
  describe('methods', () => {
    const baseStore = createStore()
    it('closes the dialog without clearing the pool', () => {
      const wrapper = createCmp({ showDialog: true }, baseStore)
      wrapper.vm.search = 'something'

      const clearSharedPool = jest.fn()
      const clearGroupPool = jest.fn()
      wrapper.setMethods({ clearSharedPool, clearGroupPool })

      wrapper.vm.closeDialog()

      expect(wrapper.vm.search).toBe('')
      expect(wrapper.emitted().close).toBeTruthy()
      expect(clearSharedPool).not.toHaveBeenCalled()
      expect(clearGroupPool).not.toHaveBeenCalled()
    })
    it('closes the dialog clearing the pool', () => {
      const wrapper = createCmp({ showDialog: true }, baseStore)
      wrapper.vm.search = 'something'
      const clearSharedPool = jest.fn()
      const clearGroupPool = jest.fn()
      wrapper.setMethods({ clearSharedPool, clearGroupPool })
      wrapper.vm.closeDialog(true)

      expect(wrapper.vm.search).toBe('')
      expect(wrapper.emitted().close).toBeTruthy()
      expect(clearSharedPool).toHaveBeenCalled()
      expect(clearGroupPool).toHaveBeenCalled()
    })
  })
})
