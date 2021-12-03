import Vue from 'vue';
import VueRouter from 'vue-router';
import { firebase } from '../firestore/index';

Vue.use(VueRouter);

const Class = () => import('../views/Class.vue');
const Home = () => import('../views/Home.vue');
const Login = () => import('../views/Login.vue');
const AdminPanel = () => import('../views/AdminPanel.vue');
const UserProfile = () => import('../views/UserProfile.vue');

const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
  },
  {
    path: '/class/:id',
    name: 'Class',
    component: Class,
  },
  {
    path: '/adminpanel',
    name: 'Admin',
    component: AdminPanel,
  },
  {
    path: '/userprofile',
    name: 'profile',
    component: UserProfile,
  },
];

// Router code adapted from demo folder here: https://github.com/Jebasuthan/Vue-Facebook-Google-oAuth
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/login'];
  const authRequired = !publicPages.includes(to.path);
  const user = firebase.auth().currentUser;
  if (authRequired && user === null) {
    return next('/login');
  }
  if (to.path === '/login' && user !== null) {
    return next('/home');
  }

  return next();
});

export default router;
