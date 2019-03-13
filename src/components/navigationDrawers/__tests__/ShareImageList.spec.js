import { shallowMount, mount } from '@vue/test-utils'
import comp from '../ShareImageList.vue'
import Vue from 'vue'
import Vuex from 'vuex'
import Vuetify from 'vuetify'

Vue.use(Vuetify)
Vue.use(Vuex)

describe('ShareImageList', () => {
  it('renders a list element', () => {
    const wrapper = shallowMount(comp, {
      propsData: { photo: { photoId: 'photoId', title: 'title', urlSq: 'urlSq' } }
    })
    expect(wrapper).toMatchSnapshot()
  })

  it('is a public photo', () => {
    const wrapper = shallowMount(comp, {
      propsData: { photo: { isPublic: true } }
    })
    expect(wrapper.vm.isPrivate).toBe(false)
  })

  it('removes the photo from the pool', () => {
    const actions = { 'pool/remove': jest.fn() }
    const wrapper = mount(comp, {
      propsData: { photo: { photoId: 'photoId' } },
      store: new Vuex.Store({
        actions,
        modules: {
          namespaced: true,
          pool: {}
        }
      })
    })
    const result = wrapper.find('button').trigger('click')
    expect(actions['pool/remove']).toHaveBeenCalled()
  })
})
