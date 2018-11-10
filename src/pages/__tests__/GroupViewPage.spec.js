import { shallowMount } from '@vue/test-utils'
import Tag from '@/classes/Tag'
import comp from '../GroupViewPage'
import Vue from 'vue'
import Vuex from 'vuex'
import Vuetify from 'vuetify'

Vue.use(Vuetify)
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user: {
      namespaced: true,
      getters: {
        userId: () => 'text'
      }
    }
  }
})

const createCmp = propsData =>
  shallowMount(comp, {
    store,
    propsData,
    mocks: {
      $route: {
        params: {
          groupId: 'groupId'
        }
      }
    }
  })

describe('GroupViewPage.vue', () => {
  describe('Computed Property', () => {
    it('gets tags from photos ', () => {
      const groupPhotos = {
        photos: [{ tags: ['tag2', 'tag1'] }, { tags: ['tag1', 'tag3'] }, { tags: ['tag1', 'tag3'] }]
      }
      const wrapper = createCmp({})
      wrapper.setData({ groupPhotos })

      expect(wrapper.vm.tags.length).toBe(3)
      expect(wrapper.vm.tags[0]).toBeInstanceOf(Tag)
      expect(wrapper.vm.tags[0].name).toBe('tag1')
      expect(wrapper.vm.tags[0].count).toBe(3)
      expect(wrapper.vm.tags[0].total).toBe(3)

      expect(wrapper.vm.tags[2].name).toBe('tag2')
      expect(wrapper.vm.tags[2].count).toBe(1)
      expect(wrapper.vm.tags[2].total).toBe(3)

      expect(wrapper.vm.tags[1].name).toBe('tag3')
      expect(wrapper.vm.tags[1].count).toBe(2)
      expect(wrapper.vm.tags[1].total).toBe(3)
    })
  })
})
