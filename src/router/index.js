import Vue from 'vue'
import Router from 'vue-router'
import Hello from './Hello'
import Group from './Group'
import Login from './Login'
import Home from './Home'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/hello',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/groups',
      name: 'Group',
      component: Group
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})
