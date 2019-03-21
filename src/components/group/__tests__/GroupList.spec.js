import { shallowMount, mount } from '@vue/test-utils'
import Vue from 'vue'
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import Comp from '../GroupList.vue'

Vue.use(Vuetify)
Vue.use(Vuex)

describe('GroupList.vue', () => {
  it('shows a group', () => {
    const wrapper = shallowMount(Comp, {
      store: new Vuex.Store({
        modules: {
          tagsFilter: {
            namespaced: true,
            state: {
              items: { tag1: true }
            }
          }
        }
      }),
      propsData: {
        tags: ['tag1', 'tag2', 'tag3'],
        group: {
          groupId: 'groupId',
          title: 'Group Title',
          poolCount: 1000000000,
          members: 200,
          photoLimitOptOut: true
        }
      }
    })
    expect(wrapper).toMatchSnapshot()
  })

  it('tags watch must change manageTags to false', () => {
    const wrapper = shallowMount(Comp, {
      store: new Vuex.Store({
        modules: {
          tagsFilter: {
            namespaced: true,
            state: {
              items: { tag1: true }
            }
          }
        }
      }),
      propsData: { group: { groupId: 'groupId', title: 'Group Title', photoLimitOptOut: true } }
    })
    wrapper.vm.manageTags = true
    expect(wrapper.vm.manageTags).toBe(true)
    wrapper.setProps({ tags: ['tag1'] })
    expect(wrapper.vm.manageTags).toBe(false)
  })

  it('hovers over the element to show the link', done => {
    const wrapper = mount(Comp, {
      propsData: { group: { groupId: 'groupId', title: 'Group Title', photoLimitOptOut: true } }
    })
    expect(wrapper.vm.hover).toBe(false)
    wrapper.find('div > div').trigger('mouseover')
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.hover).toBe(true)
      done()
    })
  })
})
