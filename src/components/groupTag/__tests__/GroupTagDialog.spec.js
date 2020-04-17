import { shallowMount } from '@vue/test-utils'
import component from '../GroupTagDialog'
import Vuetify from 'vuetify'
import Vue from 'vue'

Vue.use(Vuetify)
Vue.directive('t', key => key)
const createComp = propsData =>
  shallowMount(component, {
    propsData,
    stubs: ['ApolloQuery', 'ApolloMutation'],
    mocks: {
      $i18n: {
        t: key => key
      },
      $t: key => key
    }
  })
describe('GroupTagDialog component', () => {
  describe('Computed properties', () => {
    it('has no new tag', () => {
      const wrapper = createComp({
        group: {
          title: '',
          groupId: '123@N08'
        },
        groupTag: {
          tags: ['firstTag']
        },
        manageTags: true
      })
      expect(wrapper.vm.canSave).toBe(false)
    })

    it('adds a tag', () => {
      const wrapper = createComp({
        group: {
          title: '',
          groupId: '123@N08'
        },
        groupTag: {
          tags: ['firstTag']
        },
        manageTags: true
      })
      wrapper.vm.comboTags = ['firstTag', 'firstTag 1AA!@#$%']
      expect(wrapper.vm.comboTags).toMatchObject(['firsttag', 'firsttag1aa'])
      expect(wrapper.vm.canSave).toBe(true)
    })

    it('adds a new tag and deletes the previous one', () => {
      const wrapper = createComp({
        group: {
          title: '',
          groupId: '123@N08'
        },
        groupTag: {
          tags: ['firstTag']
        },
        manageTags: true
      })
      wrapper.vm.comboTags = ['secondTag']
      expect(wrapper.vm.canSave).toBe(true)
    })

    it('useAnd to true joins all tags in one to make one call to flickr', () => {
      const wrapper = createComp({
        group: {
          title: '',
          groupId: '123@N08'
        },
        groupTag: {
          tags: [],
          useAnd: true
        },
        manageTags: true
      })
      wrapper.vm.useAnd = true
      wrapper.vm.comboTags = ['firstTag', 'secondTag']
      expect(wrapper.vm.useAnd).toBe(true)
      expect(wrapper.vm.comboTags).toMatchObject(['firsttag', 'secondtag'])
      expect(wrapper.vm.tagsForSearch).toMatchObject(['firsttag, secondtag'])
      expect(wrapper.vm.canSave).toBe(true)
    })

    it('useAnd to true with NO tags returns empty array', () => {
      const wrapper = createComp({
        group: {
          title: '',
          groupId: '123@N08'
        },
        groupTag: undefined,
        manageTags: true
      })
      wrapper.vm.useAnd = true
      expect(wrapper.vm.useAnd).toBe(true)
      expect(wrapper.vm.comboTags).toMatchObject([])
      expect(wrapper.vm.tagsForSearch).toMatchObject([])
    })

    it('deletes all tags from list', () => {
      const wrapper = createComp({
        group: {
          title: '',
          groupId: '123@N08'
        },
        groupTag: {
          tags: ['firstTag']
        },
        manageTags: true
      })
      wrapper.vm.comboTags = []
      expect(wrapper.vm.canSave).toBe(true)
    })
  })
  describe('Methods', () => {
    it('removes a tag from the comboTags', () => {
      const wrapper = createComp({
        group: {
          title: '',
          groupId: '123@N08'
        },
        groupTag: {
          tags: ['firstTag']
        },
        manageTags: true
      })
      wrapper.vm.remove('firsttag')
      expect(wrapper.vm.comboTags).toMatchObject([])
    })
  })
})
