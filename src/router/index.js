import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login.vue'
import Welcome from '@/components/Welcome.vue'
import Register from '@/components/Register.vue'
import Info from '@/components/Info.vue'
import Store from '@/vuex/store'


Vue.use(VueRouter)

const router = new VueRouter({
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
    component: Login,
    meta: {
        pRequireAuth: true // 添加该字段，表示进入这个路由是登录禁止的
    }
  },
  {
    path: '/Register',
    name: 'Register',
    component: Register,
    meta: {
        pRequireAuth: true // 添加该字段，表示进入这个路由是登录禁止的
    }
  },
  {
      path: '/Info',
      name: 'Info',
      component: Info,
      meta: {
          requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
      }
  },
  {
     path: '**',   // 错误路由[写在最后一个]
     redirect: '/Welcome'   //重定向
  },
]
})

var storeTemp = Store;
router.beforeEach((to, from, next) => {
    if (!storeTemp.state.token) {
        storeTemp.commit("saveToken",window.localStorage.Token)
    }
    if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
        if (window.localStorage.Token&&window.localStorage.Token.length>=128) {  // 通过vuex state获取当前的token是否存在
            next();
        }
        else {
            next({
                path: '/Login',
                query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
            })
        }
    }
    else if(to.meta.pRequireAuth){  // 判断该路由是否登录禁用
        if (!window.localStorage.Token||window.localStorage.Token.length<=128) {  // 通过vuex state获取当前的token是否存在
            next();
        }
        else{
            next({
                path: '/Info',
                query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
            });
        }
    }
    else{
        next();
    }
})

export default router;

