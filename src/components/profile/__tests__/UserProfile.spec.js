import { shallowMount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import Vue from 'vue'
import Vuex from 'vuex'
import comp from '../UserProfile'
import { mutations } from '@/store/modules/user'

Vue.use(Vuetify)
Vue.use(Vuex)

const createStore = ({ email_verified = true, actions = {} } = {}) =>
  new Vuex.Store({
    modules: {
      user: {
        namespaced: true,
        state: {
          user: {
            attributes: {
              name: 'Enric',
              family_name: 'Bisbe Gil',
              email: 'email@domain.com',
              email_verified
            }
          }
        },
        mutations,
        actions
      }
    }
  })

const createComp = dataStore => shallowMount(comp, { store: createStore(dataStore) })

describe('UserProfile', () => {
  it('tests the snapshot with email verified', () => {
    const wrapper = createComp()
    expect(wrapper).toMatchSnapshot()
  })
  it('tests the snapshot without the email verified', () => {
    const wrapper = createComp({ email_verified: false })
    expect(wrapper).toMatchSnapshot()
  })

  describe('Computed properties', () => {
    it('sets name', () => {
      const wrapper = createComp()
      expect(wrapper.vm.disableUploadBtn).toBe(true)
      wrapper.vm.name = 'Name'
      expect(wrapper.vm.name).toBe('Name')
      expect(wrapper.vm.disableUploadBtn).toBe(false)
    })
    it('sets family name', () => {
      const wrapper = createComp()
      expect(wrapper.vm.disableUploadBtn).toBe(true)
      wrapper.vm.family_name = 'Family Name'
      expect(wrapper.vm.family_name).toBe('Family Name')
      expect(wrapper.vm.disableUploadBtn).toBe(false)
    })
    it('sets email', () => {
      const wrapper = createComp()
      expect(wrapper.vm.disableUploadBtn).toBe(true)
      wrapper.vm.email = 'email'
      expect(wrapper.vm.email).toBe('email')
      expect(wrapper.vm.disableUploadBtn).toBe(false)
    })
    it('opens the dialog', () => {
      const wrapper = createComp({ email_verified: false })
      expect(wrapper.vm.openDialog).toBe(true)
    })
    it('validates code is a six value number', () => {
      const wrapper = createComp()
      wrapper.vm.code = '123456'
      expect(wrapper.vm.isCodeValid).toBe(true)
    })
  })
  describe('Methods', () => {
    it('updates a user attributes', async () => {
      const updateUserAttributes = jest.fn()
      const wrapper = createComp({ actions: { updateUserAttributes } })
      wrapper.vm.code = '123456'
      wrapper.vm.disableUploadBtn = false

      await wrapper.vm.updateUser()

      expect(updateUserAttributes).toHaveBeenCalledTimes(1)
      expect(wrapper.vm.code).toBe('')
      expect(wrapper.vm.disableUploadBtn).toBe(true)
      expect(wrapper.vm.loadingBtn).toBe(false)
      expect(wrapper.vm.closeDialog).toBe(false)
    })
    it('confirms email', async () => {
      const confirmEmailCode = jest.fn()
      const wrapper = createComp({ actions: { confirmEmailCode } })

      await wrapper.vm.confirmEmail()

      expect(confirmEmailCode).toHaveBeenCalledTimes(1)
      expect(wrapper.vm.loadingBtn).toBe(false)
      expect(wrapper.vm.closeDialog).toBe(false)
    })
  })
})
