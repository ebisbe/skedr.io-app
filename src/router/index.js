import Vue from 'vue'
import Router from 'vue-router'
import GroupList from '../components/GroupList.vue'
import GroupView from '../components/GroupView.vue'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Signup from '../components/Signup.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/groups',
      name: 'Group',
      component: GroupList,
      meta: { requiresAuth: true }
    },
    {
      path: '/groups/:group_id',
      name: 'GroupView',
      component: GroupView,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    }
  ]
})
