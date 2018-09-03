import { mount } from '@vue/test-utils'
import comp from '@/components/QPhotoScheduled'
import Vue from 'vue'
import Vuetify from 'vuetify'

describe('QPhotoScheduled.vue', () => {
  Vue.use(Vuetify)

  const createComp = propsData => mount(comp, { propsData })

  const photo = {
    photoId: 'photoId',
    secret: 'secret',
    message: 'Some message',
    photo: {
      title: 'Some title',
      server: 'server',
      farm: 'farm'
    }
  }

  describe('Properties', () => {
    it('requires a Photo Flickr Object', () => {
      const wrapper = createComp({ photo })
      expect(wrapper.props().photo).toBe(photo)
    })
    it('uses default height (205px)', () => {
      const wrapper = createComp({ photo })
      expect(wrapper.props().height).toBe(205)
    })
  })

  describe('Computed Properties', () => {
    it('returns error message', () => {
      const wrapper = createComp({ photo: {} })
      expect(wrapper.vm.title).toBe('Error loading image')
    })

    it('returns the url for a photo at flickr', () => {
      const wrapper = createComp({ photo })
      const url = 'https://farmfarm.staticflickr.com/server/photoId_secret.jpg'
      expect(wrapper.vm.url).toBe(url)
    })

    it('returns the url for an unkwon photo', () => {
      const emptyPhoto = {}
      const wrapper = createComp({ photo: emptyPhoto })
      const url = 'https://fakeurl.com'
      expect(wrapper.vm.url).toBe(url)
      expect(wrapper.text()).toContain('Error loading image')
    })
  })

  describe('Rendered Component', () => {
    it('shows the title', () => {
      const wrapper = createComp({ photo })
      expect(wrapper.text()).toContain('Some title')
    })
    it('shows the message', () => {
      const wrapper = createComp({ photo })
      expect(wrapper.text()).toContain('Some message')
    })
  })
})
