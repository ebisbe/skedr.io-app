import Vue from 'vue'
import Router from 'vue-router'

const AppToolbar = () => import(/* webpackChunkName: "bar" */ './AppToolbar.vue')
const RightBar = () => import(/* webpackChunkName: "bar" */ './RightBar.vue')

const Group = () => import(/* webpackChunkName: "group" */ '../views/Group.vue')
const Login = () => import(/* webpackChunkName: "signin" */ '../views/Login.vue')
const Signup = () => import(/* webpackChunkName: "signin" */ '../views/Signup.vue')
const Scheduled = () => import(/* webpackChunkName: "scheduled" */ '../views/Scheduled.vue')
const Photostream = () => import(/* webpackChunkName: "photostream" */ '../views/Photostream.vue')

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
