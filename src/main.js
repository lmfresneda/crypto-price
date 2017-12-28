require(`quasar/dist/quasar.${__THEME}.css`)

import Vue from 'vue'
import Vuex from 'vuex'
import Quasar, { AddressbarColor } from 'quasar'
import router from './router'

AddressbarColor.set('#e8e8e8')

Vue.config.productionTip = false

Vue.use(Quasar) // Install Quasar Framework

Vue.use(Vuex) // Install Vuex

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
