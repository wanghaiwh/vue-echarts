import Vue from 'vue'
import Router from 'vue-router'
import home from '@/views/index';
import login from '@/views/login';
import Cookies from "js-cookie";
Vue.use(Router)

const router = new Router({
    routes: [
        {
            path: '',
            redirect: 'login',
        },
        {
            path: '/login',
            component: login, 
        },
        {
            path: '/home',
            name: '/home',
            component: home,
        }
    ]
})
export default router

router.beforeEach((to, from, next) => {
    if (Cookies.get("token")) {
        next()
    } else {    
      if (to.path === "/login") {
        next()
      } else {
        next('/login')
      }
    }
  })
  
