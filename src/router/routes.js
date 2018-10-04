import colors from 'vuetify/es5/util/colors'

const Toolbar = () => import(/* webpackChunkName: "bar" */ '@/components/layout/AppToolbar.vue')
const RightBar = () => import(/* webpackChunkName: "bar" */ '@/components/layout/AppRightBar.vue')

const Group = () => import(/* webpackChunkName: "group" */ '../pages/GroupPage.vue')
const GroupView = () => import(/* webpackChunkName: "group" */ '../pages/GroupViewPage.vue')
const LoginPage = () => import(/* webpackChunkName: "signin" */ '../pages/LoginPage.vue')
const LoginUser = () => import(/* webpackChunkName: "signin" */ '../components/authentication/LoginUser.vue')
const ResetPassword = () => import(/* webpackChunkName: "signin" */ '../components/authentication/ResetPassword.vue')
const SignupUser = () => import(/* webpackChunkName: "signin" */ '../components/authentication/SignupUser.vue')
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
    path: '/auth',
    children: [
      {
        path: 'login',
        name: 'Login',
        component: LoginUser
      },
      {
        path: 'reset-password',
        name: 'ResetPassword',
        component: ResetPassword
      },
      {
        path: 'sign-up',
        name: 'Signup',
        component: SignupUser
      }
    ],
    redirect: { name: 'Login' },
    components: {
      default: LoginPage,
      toolbar: null
    },
    meta: {
      hash: colors.deepPurple.base
    }
  },
  {
    path: '*',
    redirect: { name: 'Login' }
  }
]
