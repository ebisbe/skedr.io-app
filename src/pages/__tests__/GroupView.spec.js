import { shallowMount } from '@vue/test-utils'
import Tag from '@/classes/Tag'
import comp from '../GroupViewPage'
import Vue from 'vue'
import Vuetify from 'vuetify'

Vue.use(Vuetify)
const createCmp = propsData =>
  shallowMount(comp, {
    propsData,
    mocks: {
      $route: {
        params: {
          groupId: 'groupId'
        }
      }
    }
  })

describe('GroupView.vue', () => {
  describe('Watch', () => {
    it('gets tags from photos ', () => {
      const photos = [{ tags: 'tag2 tag1' }, { tags: 'tag1 tag3' }, { tags: 'tag1 tag3' }]
      const wrapper = createCmp({})
      wrapper.setData({ photos })

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

  describe('Computed Properties', () => {
    it('filters tags with autoimported ones', () => {
      const tags = [new Tag('tag1'), new Tag('tag2')]
      const autoimportTags = ['tag1']
      const wrapper = createCmp({})
      wrapper.setData({ tags, autoimportTags })
      expect(wrapper.vm.selectedTags.length).toBe(1)
      expect(wrapper.vm.selectedTags[0]).toBeInstanceOf(Tag)
      expect(wrapper.vm.selectedTags[0].name).toBe('tag1')
    })
  })
})
