import { shallowMount } from '@vue/test-utils'
import comp from '../PhotoScheduled'
import Vue from 'vue'
import Vuetify from 'vuetify'
import Vuex from 'vuex'

Vue.use(Vuetify)
Vue.use(Vuex)

import { getters } from '@/store/modules/schedulerPool'
const createStore = (photos = {}) =>
  new Vuex.Store({
    modules: {
      schedulerPool: {
        namespaced: true,
        state: {
          pool: photos
        },
        getters
      }
    }
  })
const createComp = (propsData, photos = {}) => shallowMount(comp, { propsData, store: createStore(photos) })

describe('PhotoScheduled.vue', () => {
  const photo = {
    photoId: 'photoId',
    groupId: 'groupId',
    message: 'Some message',
    photo: {
      title: 'Some title',
      secret: 'secret',
      server: 'server',
      farm: 'farm'
    }
  }

  describe('Properties', () => {
    it('requires a Photo Flickr Object', () => {
      const wrapper = createComp({ photo })
      expect(wrapper.props().photo).toBe(photo)
    })
  })

  describe('Computed Properties', () => {
    it('returns the url for a photo at flickr', () => {
      const wrapper = createComp({ photo })
      const url = 'https://farmfarm.staticflickr.com/server/photoId_secret_q.jpg'
      expect(wrapper.vm.url_q).toBe(url)
    })

    it('checks the payload', () => {
      const wrapper = createComp({ photo })
      expect(wrapper.vm.payload).toMatchObject({ id: 'groupId-photoId', item: photo })
    })
  })

  it('matches snapshot', () => {
    const wrapper = createComp({ photo })
    expect(wrapper).toMatchSnapshot()
  })
})
