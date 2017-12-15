import Vue from 'vue'
import Router from 'vue-router'
import Group from './pages/Group.vue'
import Home from './pages/Home.vue'
import Toolbar from './Toolbar.vue'
import AppToolbar from './AppToolbar.vue'
import RightBar from './RightBar.vue'
import Login from './pages/Login.vue'
import Signup from './pages/Signup.vue'
import Scheduled from './pages/Scheduled.vue'
import Dashboard from './pages/Dashboard.vue'
import Photostream from './pages/Photostream.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      components: {
        default: Home,
        toolbar: Toolbar
      }
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      components: {
        default: Dashboard,
        toolbar: AppToolbar,
        rightbar: RightBar
      },
      meta: {requiresAuth: true}
    },
    {
      path: '/groups',
      name: 'Group',
      components: {
        default: Group,
        toolbar: AppToolbar,
        rightBar: RightBar
      },
      meta: {requiresAuth: true}
    },
    {
      path: '/scheduled',
      name: 'Scheduled photos',
      components: {
        default: Scheduled,
        toolbar: AppToolbar,
        rightBar: RightBar
      },
      meta: {requiresAuth: true}
    },
    {
      path: '/photostream',
      name: 'Photostream',
      components: {
        default: Photostream,
        toolbar: AppToolbar,
        rightBar: RightBar
      },
      meta: {requiresAuth: true}
    },
    {
      path: '/login',
      name: 'Login',
      components: {
        default: Login,
        toolbar: Toolbar
      }
    },
    {
      path: '/signup',
      name: 'Signup',
      components: {
        default: Signup,
        toolbar: Toolbar
      }
    }
  ]
})
