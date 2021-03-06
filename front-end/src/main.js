import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import cookies from 'vue-cookies'

Vue.config.productionTip = false

Vue.use(cookies);

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
