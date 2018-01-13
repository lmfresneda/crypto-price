require(`quasar/dist/quasar.${__THEME}.css`)
import fetch from 'node-fetch'
import Vue from 'vue'
import Vuex from 'vuex'
import VueTrend from 'vuetrend'
import Quasar, { AddressbarColor } from 'quasar'
import router from './router'
import filters from './filters'

if (!global.fetch) global.fetch = fetch // apply fetch polyfill

AddressbarColor.set('#e8e8e8')

Vue.config.productionTip = false

Vue.use(Quasar) // Install Quasar Framework

Vue.use(VueTrend) // Install VueTrend https://github.com/QingWei-Li/vue-trend

Vue.use(Vuex) // Install Vuex

// Add global filters
Object.keys(filters).forEach(key => Vue.filter(key, filters[key]))

if (__THEME === 'mat') {
  require('quasar-extras/roboto-font')
}
import 'quasar-extras/material-icons'

Quasar.start(() => {
  /* eslint-disable no-new */
  new Vue({
    el: '#q-app',
    router,
    store: require('./store').default,
    render: h => h(require('./App').default)
  })
})
