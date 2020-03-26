import Vue from 'vue'
import App from './App.vue'
import vueNplayer from '../packages';
Vue.use(vueNplayer);
import 'font-awesome/css/font-awesome.css'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
