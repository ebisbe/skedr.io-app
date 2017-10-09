import Vue from 'vue'
import Router from 'vue-router'
import Hello from './Hello'
import Group from './Group'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/hello',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/',
      name: 'Group',
      component: Group
    }
  ]
})
