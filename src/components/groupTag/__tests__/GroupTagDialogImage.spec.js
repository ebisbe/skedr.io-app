import { shallowMount } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import Comp from '../GroupTagDialogImage.vue'
import Vuex from 'vuex'
import { getters } from '@/store/modules/user'

Vue.use(Vuetify)
Vue.use(Vuex)

const createStore = items =>
  new Vuex.Store({
    modules: {
      user: {
        namespaced: true,
        state: {
          username: 'userId'
        },
        getters
      }
    }
  })

describe('GroupTagDialogImage', () => {
  it('snapshopt', () => {
    const store = createStore()
    const wrapper = shallowMount(Comp, {
      store,
      propsData: { photoId: 'photoId', secret: 'secret', farm: 1, server: 12 }
    })
    expect(wrapper).toMatchSnapshot()
  })
})
