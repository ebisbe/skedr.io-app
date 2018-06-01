import Vue from 'vue'
import Router from 'vue-router'
import Group from '../views/Group.vue'
import AppToolbar from './AppToolbar.vue'
import RightBar from './RightBar.vue'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'
import Scheduled from '../views/Scheduled.vue'
import Photostream from '../views/Photostream.vue'
import { AuthFilter } from '../amplify'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/groups',
      name: 'Group',
      components: {
        default: Group,
        toolbar: AppToolbar,
        rightBar: RightBar
      }
    },
    {
      path: '/scheduled',
      name: 'Scheduled photos',
      components: {
        default: Scheduled,
        toolbar: AppToolbar,
        rightBar: RightBar
      }
    },
    {
      path: '/',
      name: 'Photostream',
      components: {
        default: Photostream,
        toolbar: AppToolbar,
        rightBar: RightBar
      }
    },
    {
      path: '/login',
      name: 'Login',
      components: {
        default: Login,
        toolbar: null
      }
    },
    {
      path: '/signup',
      name: 'Signup',
      components: {
        default: Signup,
        toolbar: null
      }
    }
  ]
})

router.beforeEach(AuthFilter)

export default router
