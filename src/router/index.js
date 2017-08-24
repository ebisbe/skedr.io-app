import Vue from 'vue'
import Router from 'vue-router'
import GroupList from '../components/GroupList.vue'
import GroupView from '../components/GroupView.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Group',
      component: GroupList
    },
    {
      path: '/groups/:group_id',
      name: 'GroupView',
      component: GroupView
    }
  ]
})
