import Vue from 'vue'
import Router from 'vue-router'
import Group from './pages/Group.vue'
import Home from './pages/Home.vue'
import AppToolbar from './AppToolbar.vue'
import RightBar from './RightBar.vue'
import Login from './pages/Login.vue'
import Signup from './pages/Signup.vue'
import Scheduled from './pages/Scheduled.vue'
import Photostream from './pages/Photostream.vue'
import store from '../store'
import { AuthFilter } from '../amplify'

Vue.use(Router)

const mainTitle = 'Skedr.io - Improved Flickr groups workflow'

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
      },
      meta: {
        requiresAuth: true,
        title: 'Groups'
      }
    },
    {
      path: '/scheduled',
      name: 'Scheduled photos',
      components: {
        default: Scheduled,
        toolbar: AppToolbar,
        rightBar: RightBar
      },
      meta: {
        requiresAuth: true,
        title: 'Scheduled photos'
      }
    },
    {
      path: '/',
      name: 'Photostream',
      components: {
        default: Photostream,
        toolbar: AppToolbar,
        rightBar: RightBar
      },
      meta: {
        requiresAuth: true,
        title: 'Photostream'
      }
    },
    {
      path: '/login',
      name: 'Login',
      components: {
        default: Login,
        toolbar: null
      },
      meta: {
        title: `Login - ${mainTitle}`,
        description:
          'Login with your Flickr account into Skedr.io. Access a whole new interface that helps to manage your flickr photos in groups.'
      }
    },
    {
      path: '/signup',
      name: 'Signup',
      components: {
        default: Signup,
        toolbar: null
      },
      meta: {
        title: `Signup - ${mainTitle}`,
        description:
          'Signup into Skedr.io. You need a Flickr account to be able to use this product. Go to Flickr.com to create one and comeback to signup.'
      }
    }
  ]
})

router.beforeEach(AuthFilter)
router.beforeEach(async (to, from, next) => {
  document.title = to.meta.title
  document.querySelector('meta[name="description"]').setAttribute('content', to.meta.description)
  store.commit('setPageTitle', to.name)
  next()
})

export default router
