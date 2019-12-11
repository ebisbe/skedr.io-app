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
        title: '',
        groupId: '123@N08',
        tags: ['firstTag'],
        manageTags: true
      })
      expect(wrapper.vm.canSave).toBe(false)
    })
    it('adds a tag', () => {
      const wrapper = createComp({
        title: '',
        groupId: '123@N08',
        tags: ['firstTag'],
        manageTags: true
      })
      wrapper.vm.comboTags = ['firstTag', 'firstTag 1AA!@#$%']
      expect(wrapper.vm.comboTags).toMatchObject(['firsttag', 'firsttag1aa'])
      expect(wrapper.vm.canSave).toBe(true)
    })
    it('adds a new tag and deletes the previous one', () => {
      const wrapper = createComp({
        title: '',
        groupId: '123@N08',
        tags: ['firstTag'],
        manageTags: true
      })
      wrapper.vm.comboTags = ['secondTag']
      expect(wrapper.vm.canSave).toBe(true)
    })
    it('deletes all tags from list', () => {
      const wrapper = createComp({
        title: '',
        groupId: '123@N08',
        tags: ['firstTag'],
        manageTags: true
      })
      wrapper.vm.comboTags = []
      expect(wrapper.vm.canSave).toBe(true)
    })
  })
  describe('Methods', () => {
    it('removes a tag from the comboTags', () => {
      const wrapper = createComp({
        title: '',
        groupId: '123@N08',
        tags: ['firstTag'],
        manageTags: true
      })
      wrapper.vm.remove('firsttag')
      expect(wrapper.vm.comboTags).toMatchObject([])
    })
  })
})
