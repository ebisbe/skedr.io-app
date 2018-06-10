import Vue from 'vue'
import Router from 'vue-router'

const Toolbar = () => import(/* webpackChunkName: "bar" */ './Toolbar.vue')
const RightBar = () => import(/* webpackChunkName: "bar" */ './RightBar.vue')

const Group = () => import(/* webpackChunkName: "group" */ '../views/Group.vue')
const GroupView = () => import(/* webpackChunkName: "group" */ '../views/GroupView.vue')
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
      path: '/group',
      name: 'Group',
      components: {
        default: Group,
        toolbar: Toolbar,
        rightBar: RightBar
      },
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/group/:groupId',
      name: 'Group View',
      components: {
        default: GroupView,
        toolbar: Toolbar,
        rightBar: RightBar
      },
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/scheduled',
      name: 'Scheduled photos',
      components: {
        default: Scheduled,
        toolbar: Toolbar,
        rightBar: RightBar
      },
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/',
      name: 'Photostream',
      components: {
        default: Photostream,
        toolbar: Toolbar,
        rightBar: RightBar
      },
      meta: {
        requiresAuth: true
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
