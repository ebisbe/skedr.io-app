const toolbar = () => import(/* webpackChunkName: "bar" */ '@/components/layout/AppToolbar.vue')
//const shareImage = () => import(/* webpackChunkName: "bar" */ '@/components/navigationDrawers/ShareImage.vue')
const menu = () =>
  import(/* webpackChunkName: "bar" */ '@/components/navigationDrawers/MenuDrawer.vue')
const tagList = () =>
  import(/* webpackChunkName: "bar" */ '@/components/navigationDrawers/TagList.vue')

const AutoimporTags = () =>
  import(/* webpackChunkName: "autoimportTags" */ '../pages/AutoimportTagsPage.vue')
const AutoimporTagsList = () =>
  import(/* webpackChunkName: "autoimportTags" */ '@/components/autoimportTags/List.vue')
const AutoimporTagsSearch = () =>
  import(/* webpackChunkName: "autoimportTags" */ '@/components/autoimportTags/Search.vue')

const LoginPage = () => import(/* webpackChunkName: "signin" */ '../pages/LoginPage.vue')
const LoginUser = () =>
  import(/* webpackChunkName: "signin" */ '../components/authentication/LoginUser.vue')
const ResetPassword = () =>
  import(/* webpackChunkName: "resetPassword" */ '../components/authentication/ResetPassword.vue')
const SignupUser = () =>
  import(/* webpackChunkName: "signup" */ '../components/authentication/SignupUser.vue')
const ConfirmAccount = () =>
  import(/* webpackChunkName: "confirmaccount" */ '../components/authentication/ConfirmAccount.vue')

const Scheduled = () => import(/* webpackChunkName: "scheduled" */ '../pages/ScheduledPage.vue')
const Profile = () => import(/* webpackChunkName: "profile" */ '../pages/ProfilePage.vue')

const Photostream = () =>
  import(/* webpackChunkName: "photostream" */ '../pages/PhotostreamPage.vue')

export default [
  {
    path: '/autoimport-tags',
    name: 'AutoimportTags',
    components: {
      default: AutoimporTags,
      toolbar,
      leftDrawer: menu,
      rightBar: tagList
    },
    redirect: { name: 'AutoimportTagsList' },
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: 'list',
        name: 'AutoimportTagsList',
        component: AutoimporTagsList,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'search',
        name: 'AutoimportTagsSearch',
        component: AutoimporTagsSearch,
        meta: {
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: '/scheduled',
    name: 'Scheduled photos',
    components: {
      default: Scheduled,
      toolbar,
      leftDrawer: menu,
      rightBar: null
    },
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/photostream',
    name: 'Photostream',
    components: {
      default: Photostream,
      toolbar,
      leftDrawer: menu,
      rightBar: null
    },
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    components: {
      default: Profile,
      toolbar,
      leftDrawer: menu,
      rightBar: null
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
        path: 'confirm-account',
        name: 'ConfirmAccount',
        component: ConfirmAccount
      }
    ],
    redirect: { name: 'Login' },
    components: {
      default: LoginPage,
      leftDrawer: null,
      toolbar: null
    }
  },
  {
    path: '/',
    redirect: { name: 'AutoimportTags' }
  },
  {
    path: '*',
    redirect: { name: 'Login' }
  }
]
