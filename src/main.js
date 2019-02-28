import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Vuex from 'vuex'

Vue.config.productionTip = false
Vue.use(ElementUI);
// Vue.prototype.$axios = axios
Vue.use(VueAxios,axios);
Vue.use(Vuex);


new Vue({
    router,
    render: h => h(App),
}).$mount('#app')
