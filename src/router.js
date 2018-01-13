import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

function load (component) {
  // '@' is aliased to src/components
  return () => import(`@/${component}.vue`)
}

export default new VueRouter({

  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),

  routes: [
    {
      path: '/',
      name: 'CoinList',
      component: load('CoinList'),
      children: [
        { path: ':from/:to', name: 'Coin', component: load('Coin'), props: true }
      ]
    },
    {
      path: '/config',
      name: 'Configuration',
      component: load('Configuration')
    }
  ]
})
