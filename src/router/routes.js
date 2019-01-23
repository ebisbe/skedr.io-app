const toolbar = () => import(/* webpackChunkName: "bar" */ '@/components/layout/AppToolbar.vue')
const shareImageBar = () => import(/* webpackChunkName: "bar" */ '@/components/layout/ShareImageBar.vue')
const tagListBar = () => import(/* webpackChunkName: "bar" */ '@/components/layout/TagListBar.vue')

const AutoimporTags = () => import(/* webpackChunkName: "autoimportTags" */ '../pages/AutoimportTagsPage.vue')
const AutoimporTagsList = () => import(/* webpackChunkName: "autoimportTags" */ '@/components/autoimportTags/List.vue')
const AutoimporTagsSearch = () =>
  import(/* webpackChunkName: "autoimportTags" */ '@/components/autoimportTags/Search.vue')

const LoginPage = () => import(/* webpackChunkName: "signin" */ '../pages/LoginPage.vue')
const LoginUser = () => import(/* webpackChunkName: "signin" */ '../components/authentication/LoginUser.vue')
const ResetPassword = () =>
  import(/* webpackChunkName: "resetPassword" */ '../components/authentication/ResetPassword.vue')
const SignupUser = () => import(/* webpackChunkName: "signup" */ '../components/authentication/SignupUser.vue')
const ConfirmEmail = () =>
  import(/* webpackChunkName: "confirmEmail" */ '../components/authentication/ConfirmEmail.vue')

const Scheduled = () => import(/* webpackChunkName: "scheduled" */ '../pages/ScheduledPage.vue')

const Photostream = () => import(/* webpackChunkName: "photostream" */ '../pages/PhotostreamPage.vue')

export default [
  {
    path: '/autoimport-tags',
    name: 'AutoimportTags',
    components: {
      default: AutoimporTags,
      toolbar,
      rightBar: tagListBar
    },
    redirect: { name: 'AutoimportTagsList' },
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: 'list',
        name: 'AutoimportTagsList',
        component: AutoimporTagsList
      },
      {
        path: 'search',
        name: 'AutoimportTagsSearch',
        component: AutoimporTagsSearch
      }
    ]
  },
  {
    path: '/scheduled',
    name: 'Scheduled photos',
    components: {
      default: Scheduled,
      toolbar,
      rightBar: shareImageBar
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
      toolbar,
      rightBar: shareImageBar
    },
    meta: {
      requiresAuth: true
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
      },
      {
        path: 'confirm-email',
        name: 'ConfirmEmail',
        component: ConfirmEmail
      }
    ],
    redirect: { name: 'Login' },
    components: {
      default: LoginPage,
      toolbar: null
    }
  },
  {
    path: '*',
    redirect: { name: 'Login' }
  }
]
