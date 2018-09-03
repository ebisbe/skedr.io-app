import { shallowMount, mount } from '@vue/test-utils'
import QPoolBtn from '@/components/QPoolBtn.vue'
import Vue from 'vue'
import Vuetify from 'vuetify'
import Vuex from 'vuex'
import { getters } from '@/store/modules/pool'

Vue.use(Vuetify)
Vue.use(Vuex)

const actions = {
  updateRightDrawer: jest.fn()
}
describe('QPoolBtn.vue', () => {
  const createStore = photos =>
    new Vuex.Store({
      state: {
        rightDrawer: false
      },
      actions,
      modules: {
        pool: {
          namespaced: true,
          state: {
            photos
          },
          getters
        }
      }
    })
  const createCmp = store => shallowMount(QPoolBtn, { store })

  describe('Computed properties - PoolIcon', () => {
    it('renders filter without items in the pool', () => {
      const wrapper = createCmp(createStore([]))
      expect(wrapper.vm.poolIcon).toBe('filter')
    })

    it('renders filter with 1 item in the pool', () => {
      const wrapper = createCmp(createStore([1]))
      expect(wrapper.vm.poolIcon).toBe('filter_1')
    })

    it('renders filter with 2 item in the pool', () => {
      const wrapper = createCmp(createStore([1, 2]))
      expect(wrapper.vm.poolIcon).toBe('filter_2')
    })

    it('renders filter with 3 item in the pool', () => {
      const wrapper = createCmp(createStore([1, 2, 3]))
      expect(wrapper.vm.poolIcon).toBe('filter_3')
    })

    it('renders filter with 4 item in the pool', () => {
      const wrapper = createCmp(createStore([1, 2, 3, 4]))
      expect(wrapper.vm.poolIcon).toBe('filter_4')
    })

    it('renders filter with 5 item in the pool', () => {
      const wrapper = createCmp(createStore([1, 2, 3, 4, 5]))
      expect(wrapper.vm.poolIcon).toBe('filter_5')
    })

    it('renders filter with 6 item in the pool', () => {
      const wrapper = createCmp(createStore([1, 2, 3, 4, 5, 6]))
      expect(wrapper.vm.poolIcon).toBe('filter_6')
    })

    it('renders filter with 7 item in the pool', () => {
      const wrapper = createCmp(createStore([1, 2, 3, 4, 5, 6, 7]))
      expect(wrapper.vm.poolIcon).toBe('filter_7')
    })

    it('renders filter with 8 item in the pool', () => {
      const wrapper = createCmp(createStore([1, 2, 3, 4, 5, 6, 7, 8]))
      expect(wrapper.vm.poolIcon).toBe('filter_8')
    })

    it('renders filter with 9 item in the pool', () => {
      const wrapper = createCmp(createStore([1, 2, 3, 4, 5, 6, 7, 8, 9]))
      expect(wrapper.vm.poolIcon).toBe('filter_9')
    })

    it('renders filter with 10 item in the pool', () => {
      const wrapper = createCmp(createStore([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]))
      expect(wrapper.vm.poolIcon).toBe('filter_9_plus')
    })
  })

  describe('Computed properties - RightDrawer', () => {
    it('renturns initial store state', () => {
      const store = createStore([])
      const wrapper = mount(QPoolBtn, { store })
      expect(wrapper.vm.rightDrawer).toBe(false)
    })

    it('calls updateRightDrawer actions', () => {
      const store = createStore([])
      const wrapper = mount(QPoolBtn, { store })
      wrapper.find('button').trigger('click')
      expect(actions.updateRightDrawer).toHaveBeenCalled()
    })
  })
})
