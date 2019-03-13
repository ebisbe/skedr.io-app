import { shallowMount, mount } from '@vue/test-utils'
import Vue from 'vue'
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import Comp from '../ShareImage.vue'

Vue.use(Vuex)
Vue.use(Vuetify)

const createStore = ({ photos, isEmpty = false, hasBackup = false, actions = {} }) =>
  new Vuex.Store({
    actions,
    modules: {
      pool: {
        namespaced: true,
        state: { photos },
        getters: { isEmpty: () => isEmpty, hasBackup: () => hasBackup }
      }
    }
  })

describe('ShareImage', () => {
  it('has one image', () => {
    const wrapper = shallowMount(Comp, {
      store: createStore({ photos: [{ photoId: 'photoId' }] })
    })

    expect(wrapper).toMatchSnapshot()
  })

  it('has no images and has backup', () => {
    const wrapper = shallowMount(Comp, {
      store: createStore({ photos: [{ photoId: 'photoId' }], isEmpty: true, hasBackup: true })
    })

    expect(wrapper).toMatchSnapshot()
  })

  describe('Actions', () => {
    it('clicks share', () => {
      const actions = { 'sharedPool/share': jest.fn() }
      const photos = [{ photoId: 'photoId' }]
      const wrapper = mount(Comp, {
        store: createStore({
          photos,
          hasBackup: false,
          actions
        }),
        stubs: ['share-dialog']
      })
      const button = wrapper.findAll('button')
      button.at(0).trigger('click')
      expect(actions['sharedPool/share']).toHaveBeenCalled()
      //expect(actions['sharedPool/share']).toHaveBeenNthCalledWith(1, { pool: photos })
    })
    it('clicks clearPool', () => {
      const actions = { 'pool/clearPool': jest.fn() }
      const wrapper = mount(Comp, {
        store: createStore({
          photos: [{ photoId: 'photoId' }],
          hasBackup: false,
          actions
        }),
        stubs: ['share-dialog']
      })
      const button = wrapper.findAll('button')
      button.at(1).trigger('click')
      expect(actions['pool/clearPool']).toHaveBeenCalled()
    })
    it('clicks restoreBackup', () => {
      const actions = { 'pool/restoreBackup': jest.fn() }
      const wrapper = mount(Comp, {
        store: createStore({
          photos: [{ photoId: 'photoId' }],
          hasBackup: true,
          actions
        }),
        stubs: ['share-dialog']
      })
      const button = wrapper.findAll('button')
      button.at(1).trigger('click')
      expect(actions['pool/restoreBackup']).toHaveBeenCalled()
    })
  })
})
