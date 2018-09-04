import colors from 'vuetify/es5/util/colors'

const Toolbar = () => import(/* webpackChunkName: "bar" */ '@/components/layout/AppToolbar.vue')
const RightBar = () => import(/* webpackChunkName: "bar" */ '@/components/layout/AppRightBar.vue')

const Group = () => import(/* webpackChunkName: "group" */ '../pages/GroupPage.vue')
const GroupView = () => import(/* webpackChunkName: "group" */ '../pages/GroupViewPage.vue')
const Login = () => import(/* webpackChunkName: "signin" */ '../pages/LoginPage.vue')
const Signup = () => import(/* webpackChunkName: "signin" */ '../pages/SignupPage.vue')
const Scheduled = () => import(/* webpackChunkName: "scheduled" */ '../pages/ScheduledPage.vue')
const Photostream = () => import(/* webpackChunkName: "photostream" */ '../pages/PhotostreamPage.vue')

export default [
  {
    path: '/group',
    name: 'Group',
    components: {
      default: Group,
      toolbar: Toolbar,
      rightBar: RightBar
    },
    meta: {
      requiresAuth: true,
      hash: colors.lightGreen.base
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
      requiresAuth: true,
      hash: colors.lightGreen.base
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
      requiresAuth: true,
      hash: colors.lightBlue.base
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
      requiresAuth: true,
      hash: colors.deepPurple.base
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
      hash: colors.deepPurple.base
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
      hash: colors.deepPurple.base
    }
  },
  {
    path: '*',
    redirect: '/login'
  }
]
