require(`quasar/dist/quasar.${__THEME}.css`)
import fetch from 'node-fetch'
import Vue from 'vue'
import Vuex from 'vuex'
import VueI18n from 'vue-i18n'
import VueTrend from 'vuetrend'
import Quasar, { AddressbarColor } from 'quasar'
import data from './data'
import router from './router'
import filters from './filters'
import messages from './i18n'

global.fetch = fetch // apply fetch polyfill

AddressbarColor.set('#1a237e')

Vue.config.productionTip = false

Vue.use(Quasar) // Install Quasar Framework
Vue.use(VueTrend) // Install VueTrend https://github.com/QingWei-Li/vue-trend
Vue.use(Vuex) // Install Vuex
Vue.use(VueI18n) // Install i18n https://github.com/kazupon/vue-i18n

// Add global filters
Object.keys(filters).forEach(key => Vue.filter(key, filters[key]))

if (__THEME === 'mat') {
  require('quasar-extras/roboto-font')
}
import 'quasar-extras/material-icons'

Quasar.start(async () => {
  const locale = await data.getLocale()
  const i18n = new VueI18n({
    locale,
    messages
  })

  /* eslint-disable no-new */
  new Vue({
    el: '#q-app',
    router,
    i18n,
    store: require('./store').default,
    render: h => h(require('./App').default)
  })
})
