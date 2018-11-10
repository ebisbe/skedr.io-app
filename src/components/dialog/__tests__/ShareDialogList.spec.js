import { shallowMount } from '@vue/test-utils'
import comp from '../ShareDialogList'
import Vue from 'vue'
import Vuetify from 'vuetify'
import Group from '@/classes/Group'

Vue.use(Vuetify)

describe('ShareDialogList.vue', () => {
  const createCmp = propsData => shallowMount(comp, { propsData })

  describe('Properties', () => {
    it('requires a group Object', () => {
      createCmp({ group: new Group({}) })
    })
  })

  describe('Computed Properties', () => {
    it("throttles text is '∞'", () => {
      const wrapper = createCmp({ group: new Group({ throttleRemaining: null }) })
      expect(wrapper.vm.throttleText).toBe('∞')
    })

    it("throttles text is '&'", () => {
      const wrapper = createCmp({ group: new Group({ throttleRemaining: 1, throttleCount: 0 }) })
      expect(wrapper.vm.throttleText).toBe('&mdash;')
    })

    it("throttles text is '5/15'", () => {
      const wrapper = createCmp({ group: new Group({ throttleRemaining: 5, throttleCount: 15 }) })
      expect(wrapper.vm.throttleText).toBe('5/15')
    })

    it("useBadge is true when throttleMode is 'disabled'", () => {
      const wrapper = createCmp({ group: new Group({ throttleMode: 'disabled' }) })
      expect(wrapper.vm.useBadge).toBeTruthy()
    })

    it('useBadge is true when alreadyInGroup', () => {
      const wrapper = createCmp({ group: new Group({ alreadyInGroup: true }) })
      expect(wrapper.vm.useBadge).toBeTruthy()
    })

    it('useBadge is true when selected', () => {
      const wrapper = createCmp({ group: new Group({ selected: true }) })
      expect(wrapper.vm.useBadge).toBeTruthy()
    })

    it("uses 'SUCCESS' badgeColor", () => {
      const wrapper = createCmp({ group: new Group({ selected: true }) })
      expect(wrapper.vm.badgeColor).toBe('success')
    })

    it("uses 'GREY' badgeColor", () => {
      const wrapper = createCmp({ group: new Group({ selected: false }) })
      expect(wrapper.vm.badgeColor).toBe('grey')
    })

    it("uses 'CLEAR' badgeType", () => {
      const wrapper = createCmp({ group: new Group({ throttleMode: 'disabled' }) })
      expect(wrapper.vm.badgeType).toBe('clear')
    })

    it("uses 'CHECK' badgeType", () => {
      const wrapper = createCmp({ group: new Group({ throttleMode: 'day' }) })
      expect(wrapper.vm.badgeType).toBe('check')
    })

    it('cannot select a disabled group', () => {
      const wrapper = createCmp({ group: new Group({ alreadyInGroup: true, selected: false }) })
      wrapper.vm.select()
      expect(wrapper.props().group.selected).toBe(false)
    })
  })

  describe('Methods', () => {
    it('unselects a group', () => {
      const wrapper = createCmp({ group: new Group({}) })
      wrapper.props().group.selected = true
      wrapper.vm.select()
      expect(wrapper.props().group.selected).toBe(false)
    })
  })
})
