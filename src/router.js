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
      component: load('CoinList'),
      children: [
        { path: 'coin', component: load('Coin'), props: true }
      ]
    },
    {
      path: '/config',
      component: load('Configuration')
    },

    // Always leave this last one
    { path: '*', component: load('Error404') } // Not found
  ]
})
