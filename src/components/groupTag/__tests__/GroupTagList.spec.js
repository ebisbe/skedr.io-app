import { createLocalVue, shallowMount, mount } from '@vue/test-utils'
import Vue from 'vue'
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import Comp from '../GroupTagList.vue'

Vue.use(Vuetify)
Vue.use(Vuex)
const localVue = createLocalVue()

describe('GroupTagList.vue', () => {
  it('shows a group', () => {
    const wrapper = shallowMount(Comp, {
      localVue,
      vuetify: new Vuetify(),
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
        group: {
          id: 'groupId',
          title: 'Group Title',
          poolCount: 1000000000,
          members: 200,
          icon: '',
          photoLimitOptOut: true
        },
        groupTag: {
          tags: ['tag1', 'tag2', 'tag3']
        }
      }
    })
    expect(wrapper).toMatchSnapshot()
  })

  it('tags watch must change manageTags to false', async () => {
    const wrapper = shallowMount(Comp, {
      localVue,
      vuetify: new Vuetify(),
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
        group: {
          id: 'groupId',
          title: 'Group Title',
          photoLimitOptOut: true,
          icon: ''
        },
        groupTag: {
          tags: []
        }
      }
    })
    wrapper.vm.manageTags = true
    expect(wrapper.vm.manageTags).toBe(true)
    await wrapper.setProps({ groupTag: { tags: ['tag1'] } })
    expect(wrapper.vm.manageTags).toBe(false)
  })

  it('hovers over the element to show the link', done => {
    const wrapper = mount(Comp, {
      localVue,
      vuetify: new Vuetify(),
      propsData: {
        group: {
          id: 'groupId',
          title: 'Group Title',
          photoLimitOptOut: true,
          icon: ''
        },
        groupTag: {
          tags: []
        }
      },
      // Mocks is needed due to use mount() https://github.com/kazupon/vue-i18n/issues/323
      // otherwise should be handled by i18n_test.js configs
      mocks: {
        $i18n: {
          t: key => key
        },
        $t: key => key
      }
    })
    expect(wrapper.vm.hover).toBe(false)
    wrapper.find('div > div').trigger('mouseover')
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.hover).toBe(true)
      done()
    })
  })
})
