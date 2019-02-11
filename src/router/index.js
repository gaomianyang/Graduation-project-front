import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login.vue'
import Welcome from '@/components/Welcome.vue'

Vue.use(VueRouter)

export default new VueRouter({
  mode: 'history',
  routes: [
  {
    path: '/Welcome',
    name: 'Welcome',
    component: Welcome
  },
  {
    path: '/Login',
    name: 'Login',
    component: Login
  },
  {
     path: '**',   // 错误路由[写在最后一个]
     redirect: '/Welcome'   //重定向
  }
]
})
