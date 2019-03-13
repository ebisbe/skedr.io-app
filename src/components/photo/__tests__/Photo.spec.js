import { shallowMount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import Vue from 'vue'
import comp from '../Photo'
import Vuex from 'vuex'
Vue.use(Vuetify)
Vue.use(Vuex)

import { getters as userGetters } from '@/store/modules/user'
import { getters as poolGetters } from '@/store/modules/pool'
const createStore = (photos = []) =>
  new Vuex.Store({
    modules: {
      user: {
        namespaced: true,
        state: {
          username: 'username'
        },
        getters: userGetters
      },
      pool: {
        namespaced: true,
        state: {
          photos
        },
        getters: poolGetters
      }
    }
  })
const createCmp = (propsData, photos = []) => shallowMount(comp, { propsData, store: createStore(photos) })
describe('Photo.vue', () => {
  describe('Computed Properties', () => {
    it('generate correct link to the photo', () => {
      const wrapper = createCmp({ photo: { id: 'myId', urlSq: '' } })
      expect(wrapper.vm.photoLink).toBe('https://www.flickr.com/photos/username/myId')
    })

    it('prints a half star', () => {
      const wrapper = createCmp({ photo: { id: 'myId', urlSq: '' } })
      expect(wrapper.vm.star).toBe('star_border')
    })

    it('prints a full star', () => {
      const wrapper = createCmp({ photo: { id: 'myId', totalFavs: 1, urlSq: '' } })
      expect(wrapper.vm.star).toBe('star')
    })

    it('hides urlM when the component is not visible', () => {
      const wrapper = createCmp({ photo: { urlSq: '' } })
      expect(wrapper.vm.bigImg).toBe('')
    })

    it('prints urlM when the component is visible', () => {
      const wrapper = createCmp({ photo: { urlM: 'urlM', urlSq: '' } })
      wrapper.vm.showObserver = false
      expect(wrapper.vm.bigImg).toBe('urlM')
    })

    it('checks if the current photo is in the pool', () => {
      const wrapper = createCmp({ photo: { id: 'myId', urlSq: '' } }, [{ photoId: 'myId', urlSq: '' }])
      expect(wrapper.vm.isPhotoInPool).toBe(true)
    })

    it('returns full image height when photo is not in the pool', () => {
      const wrapper = createCmp({ photo: { id: 'myId', urlSq: '' } })
      expect(wrapper.vm.realHeight).toBe(205)
    })

    it('returns less height of the image when photo is in the pool', () => {
      const wrapper = createCmp({ photo: { id: 'myId', urlSq: '' } }, [{ photoId: 'myId', urlSq: '' }])
      expect(wrapper.vm.realHeight).toBe(173)
    })
  })
})