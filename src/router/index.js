import Vue from 'vue'
import Router from 'vue-router'

const AppToolbar = () => import('./AppToolbar.vue')
const RightBar = () => import('./RightBar.vue')

const Group = () => import('../views/Group.vue')
const Login = () => import('../views/Login.vue')
const Signup = () => import('../views/Signup.vue')
const Scheduled = () => import('../views/Scheduled.vue')
const Photostream = () => import('../views/Photostream.vue')

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
