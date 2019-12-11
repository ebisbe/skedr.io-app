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
          pool: photos
        },
        getters: poolGetters
      }
    }
  })
const createCmp = (propsData, photos = []) =>
  shallowMount(comp, {
    propsData,
    store: createStore(photos)
  })
const photo = { id: 'myId', urlSq: '', urlM: 'something' }
describe('Photo.vue', () => {
  describe('Computed Properties', () => {
    it('generate correct link to the photo', () => {
      const wrapper = createCmp({ photo })
      expect(wrapper.vm.photoLink).toBe('https://www.flickr.com/photos/username/myId')
    })

    it('prints a half star', () => {
      const wrapper = createCmp({ photo })
      expect(wrapper.vm.star).toBe('star_border')
    })

    it('prints a full star', () => {
      const favPhoto = photo
      favPhoto.totalFavs = 1
      const wrapper = createCmp({ photo: favPhoto })
      expect(wrapper.vm.star).toBe('star')
    })

    it('checks if the current photo is in the pool', () => {
      const wrapper = createCmp(
        { photo },
        {
          myId: { photoId: 'myId', urlSq: '' }
        }
      )
      expect(wrapper.vm.isPhotoInPool).toBe(true)
    })

    it('checks the payload', () => {
      const wrapper = createCmp({ photo })
      expect(wrapper.vm.payload).toMatchObject({ id: 'myId', item: photo })
    })
  })
})
