import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Class from '../views/Class.vue';
import Login from '../views/Login.vue';
import AdminPanel from '../views/AdminPanel.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
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
];

// Router code copied from demo folder here: https://github.com/antoine92190/vue-advanced-chat
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/login'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('user');
  if (authRequired && !loggedIn) {
    return next('/login');
  }

  next();
});

export default router;
