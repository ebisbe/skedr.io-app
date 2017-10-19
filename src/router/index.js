import Vue from 'vue'
import Router from 'vue-router'
import Group from './Group.vue'
import Home from './Home.vue'
import Toolbar from './Toolbar.vue'
import RightBar from './RightBar.vue'

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
      },
      meta: {
        logged: false
      }
    },
    {
      path: '/groups',
      name: 'Group',
      components: {
        default: Group,
        toolbar: Toolbar,
        rightBar: RightBar
      },
      meta: {
        logged: true
      }
    }
  ]
})
