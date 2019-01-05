import { shallowMount } from '@vue/test-utils'
import component from '../GroupTagDialog'
import Vuetify from 'vuetify'
import Vue from 'vue'

Vue.use(Vuetify)
const createComp = propsData => shallowMount(component, { propsData })
describe('GroupTagDialog component', () => {
  describe('Computed properties', () => {
    it('has no new tag', () => {
      const wrapper = createComp({ title: '', group: { groupId: '123@N08' }, tags: ['firstTag'], manageTags: true })
      expect(wrapper.vm.canSave).toBe(false)
    })
    it('adds a tag', () => {
      const wrapper = createComp({ title: '', group: { groupId: '123@N08' }, tags: ['firstTag'], manageTags: true })
      wrapper.vm.comboTags.push('something')
      expect(wrapper.vm.canSave).toBe(true)
    })
    it('adds a new tag and deletes the previous one', () => {
      const wrapper = createComp({ title: '', group: { groupId: '123@N08' }, tags: ['firstTag'], manageTags: true })
      wrapper.vm.comboTags = ['secondTag']
      expect(wrapper.vm.canSave).toBe(true)
    })
    it('deletes all tags from list', () => {
      const wrapper = createComp({ title: '', group: { groupId: '123@N08' }, tags: ['firstTag'], manageTags: true })
      wrapper.vm.comboTags = []
      expect(wrapper.vm.canSave).toBe(true)
    })
  })
})
