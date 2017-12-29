<script>
import quasarUtil from '../utils/quasar-util'
import { mapState } from 'vuex'
import {
  SET_REAL_TIME,
  SET_EXCHANGE,
  FETCH_CONFIG,
  FETCH_DATA_LIST
} from '../store'
import Configuration from './Configuration'
import CoinListItem from './CoinListItem'

export default {
  name: 'index',
  components: {
    ...quasarUtil.getQComponents(),
    Configuration,
    CoinListItem
  },
  data () {
    return {
      exchange: null,
      thisRealTime: false,
      openConfigModal: false
    }
  },
  computed: {
    ...mapState(['config', 'data', 'error', 'realTime', 'coinIsView'])
  },
  watch: {
    'config.default_exchange': function () {
      this.$store.commit(SET_EXCHANGE, this.config.default_exchange)
      this.fetchData()
    },
    thisRealTime () {
      this.$store.commit(SET_REAL_TIME, this.thisRealTime)
      this.$store.dispatch(FETCH_DATA_LIST)
    }
  },
  methods: {
    async fetchData () {
      await this.$store.dispatch(FETCH_DATA_LIST)
    },
    async refresher (done) {
      await this.$store.dispatch(FETCH_DATA_LIST)
      done()
    },
    openCloseConfigModal (open) {
      this.openConfigModal = open
    }
  },
  async beforeMount () {
    await this.$store.dispatch(FETCH_CONFIG)
    await this.fetchData()
    this.thisRealTime = this.realTime
  }
}
</script>

<template>
  <q-layout
    ref="layout"
    view="lHh Lpr fFf">

    <q-modal  v-model="openConfigModal" ref="configModal">
      <q-modal-layout>
        <configuration :onclose="() => { openConfigModal = false }"></configuration>
      </q-modal-layout>
    </q-modal>
    <!-- Header -->
    <q-toolbar slot="header" color="indigo-10" v-show="!coinIsView">
      <q-toolbar-title>
        {{ config.name }} <q-icon @click="openCloseConfigModal(true)" name="settings" size="1.5rem" style="float: right"/>
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
          v-for="item in data.list"
          :key="item.CODE"></coin-list-item>
      </q-list>
    </q-pull-to-refresh>

    <q-inner-loading :visible="data.list.length === 0" v-if="!error">
      <q-spinner-puff size="80px" color="indigo-10"></q-spinner-puff>
    </q-inner-loading>

    <!-- Footer -->
    <q-toolbar slot="footer" color="indigo-10">
      <q-toolbar-title>
        <q-alert
          class="alert-footer"
          color="red"
          icon="warning"
          v-if="realTime" >
          Real Time is active
        </q-alert>
        <span slot="subtitle" v-if="data.socket && !error">
          <q-icon name="fiber_manual_record" color="green" /> connected to
            <a style="color: white" target="blank" href="https://www.cryptocompare.com">CryptoCompare</a>
        </span>
        <span slot="subtitle" v-else>
          <q-icon name="fiber_manual_record" color="red" /> disconnected
        </span>
        <span slot="subtitle" style="float: right;">{{ config.version }}</span>
      </q-toolbar-title>
    </q-toolbar>
  </q-layout>
</template>

<style scoped lang="scss">
.currency-list {
  border: 0;
}
.alert-footer {
  position: fixed;
  bottom: 50px;
  left: 0;
  width: 100%;
  opacity: .7;
  font-size: .9rem;

  .q-alert-icon, .q-alert-content {
    padding: 0.4rem;
  }
}
</style>
