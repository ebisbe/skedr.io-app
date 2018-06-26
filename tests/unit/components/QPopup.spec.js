import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuetify from 'Vuetify'
import QPopup from '@/components/QPopup'

const localVue = createLocalVue()
localVue.use(Vuetify)

const createCmp = propsData => shallowMount(QPopup, { propsData, localVue })
describe('QPopup.vue', () => {
  describe('Properties', () => {
    it('requires data array', () => {
      const data = [{ title: 'Title 1' }]
      const wrapper = createCmp({ data })
      expect(wrapper.props().dialog).toBe(false)
      expect(wrapper.props().data).toMatchObject(data)
      expect(wrapper.props().loading).toBe(false)
      expect(wrapper.props().toolbarTitle).toBe('Popup')
      expect(wrapper.props().listTitle).toBe('Data')
      expect(wrapper.props().noDataText).toBe('No data available')
      expect(wrapper.props().filterPlaceholder).toBe('Filter data')
      expect(wrapper.props().itemText).toBe('title')
    })
  })

  describe('Computed Properties', () => {
    it('filters data by title', () => {
      const wrapper = createCmp({ data: [{ title: 'Title1' }, { title: 'Dog' }] })
      expect(wrapper.vm.filteredData.length).toBe(2)
      wrapper.setData({ filterWord: 'title' })
      expect(wrapper.vm.filteredData.length).toBe(1)
      expect(wrapper.vm.filteredData[0]).toMatchObject({ title: 'Title1' })
    })

    it("filters data by ':sel'", () => {
      const wrapper = createCmp({
        data: [{ title: 'Title 1', selected: false }, { title: 'Dog', selected: true }]
      })
      wrapper.setData({
        filterWord: ':sel'
      })

      expect(wrapper.vm.filteredData.length).toBe(1)
      expect(wrapper.vm.filteredData[0]).toMatchObject({ title: 'Dog', selected: true })
    })

    it("filters data by ':inpool'", () => {
      const wrapper = createCmp({
        data: [{ title: 'Title 1', alreadyInGroup: false }, { title: 'Dog', alreadyInGroup: true }]
      })
      wrapper.setData({
        filterWord: ':inpool'
      })

      expect(wrapper.vm.filteredData.length).toBe(1)
      expect(wrapper.vm.filteredData[0]).toMatchObject({ title: 'Dog', alreadyInGroup: true })
    })

    it('returns selected elements only', () => {
      const wrapper = createCmp({ data: [{ title: '1', selected: false }, { title: '2', selected: true }] })
      expect(wrapper.vm.selectedData.length).toBe(1)
      expect(wrapper.vm.selectedData[0].title).toBe('2')
    })
  })

  describe('Methods', () => {
    //TODO Update both tests to
    // expect(wrapper.vm.selectedData.length).toBe(0)
    // when v2.6 of VUE is release
    it('clear selected data', () => {
      const wrapper = createCmp({ data: [{ title: 'Title', selected: true }] })

      expect(wrapper.vm.selectedData.length).toBe(1)
      wrapper.vm.clearSelected()
      expect(wrapper.props().data.filter(data => data.selected === true).length).toBe(0)
    })

    it('clears data when closing the popup', () => {
      const wrapper = createCmp({ data: [{ title: 'Title', selected: true }] })

      expect(wrapper.vm.selectedData.length).toBe(1)
      wrapper.vm.closePopUp()

      expect(wrapper.emitted().close).toMatchObject([[]])
      expect(wrapper.props().data.filter(data => data.selected === true).length).toBe(0)
    })
  })
})
