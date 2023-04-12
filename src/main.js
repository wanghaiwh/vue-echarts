import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview';
import './assets/less/index.less';
import * as echarts from 'echarts';
import img from './lib/img'
import utils from "./lib/utils";
import element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/font/font.css'
import JSEncrypt from "jsencrypt"; //引入模块
import api from "./utils/interface"
// 配置cookie
import Cookies from 'js-cookie'
import http from './utils/http';  //此处问http文件的路径
// 我们在main.js中用常量创建一个bus，然后将它放入Vue实例的原型对象中。
const bus = new Vue()
Vue.prototype.$bus = bus;
Vue.prototype.$http = http;
Vue.prototype.$api = api.commonUrl
Vue.prototype.$jsEncrypt = JSEncrypt; //配置全局变量
Vue.prototype.$echarts = echarts;
Vue.prototype.$images = img
Vue.config.productionTip = false;
Vue.use(iView);
Vue.use(utils)
Vue.use(element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
