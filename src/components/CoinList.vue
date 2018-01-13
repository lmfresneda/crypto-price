<script>
import quasarUtil from '../utils/quasar-util'
import { mapState, mapGetters } from 'vuex'
import { types } from '../store'
import Configuration from './Configuration'
import CoinListItem from './CoinListItem'

export default {
  name: 'coin-list',
  components: {
    ...quasarUtil.getQComponents(),
    Configuration,
    CoinListItem
  },
  data () {
    return {
      exchange: null,
      thisRealTime: false
    }
  },
  computed: {
    ...mapState(['config', 'data', 'error', 'realTime', 'coinIsView']),
    ...mapGetters(['getDataCoinsList'])
  },
  watch: {
    'config.default_exchange': function () {
      this.$store.commit(types.SET_EXCHANGE, this.config.default_exchange)
      this.fetchData()
    },
    thisRealTime () {
      if (this.realTime === this.thisRealTime) return
      this.$store.commit(types.SET_REAL_TIME, this.thisRealTime)
      this.$store.dispatch(types.FETCH_DATA_LIST)
    }
  },
  methods: {
    async fetchData () {
      await this.$store.dispatch(types.FETCH_DATA_LIST)
    },
    async refresher (done) {
      await this.$store.dispatch(types.FETCH_DATA_LIST)
      done()
    },
    viewConfig () {
      this.$store.commit(types.SET_VIEW_CHILDREN, true)
      this.$router.push({ name: 'Configuration' })
    }
  },
  async beforeMount () {
    await this.$store.dispatch(types.FETCH_CONFIG)
    this.thisRealTime = this.realTime
  }
}
</script>

<template>
  <q-layout
    ref="layout"
    view="lHh Lpr fFf">

    <!-- Header -->
    <q-toolbar slot="header" color="indigo-10" v-show="!coinIsView">
      <q-toolbar-title>
        {{ config.name }} <q-icon @click="viewConfig()" name="settings" size="1.5rem" style="float: right"/>
      </q-toolbar-title>
    </q-toolbar>

    <!-- If error -->
    <q-card v-if="error">
      <q-card-media>
        <img src="~assets/error.jpg">
      </q-card-media>
      <q-card-title>
        An error has occurred
      </q-card-title>
      <q-card-main>
        <p class="text-faded">Change the current exchange or try again later</p>
      </q-card-main>
    </q-card>

    <router-view></router-view>

    <!-- Coin List -->
    <q-pull-to-refresh
      v-show="!coinIsView"
      :handler="refresher"
      pull-message=""
      refresh-message=""
      :disable="realTime">
      <q-list class="currency-list" >
        <coin-list-item
          :item="item"
          v-for="item in getDataCoinsList"
          :key="item.CODE"></coin-list-item>
      </q-list>
    </q-pull-to-refresh>

    <q-inner-loading :visible="getDataCoinsList.length === 0" v-if="!error">
      <q-spinner-puff size="80px" color="indigo-10"></q-spinner-puff>
    </q-inner-loading>

  </q-layout>
</template>

<style scoped lang="scss">
.currency-list {
  border: 0;
  margin-bottom: 85px;
}
</style>
