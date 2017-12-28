<script>
import {
  QLayout,
  QCollapsible,
  QToolbar,
  QToolbarTitle,
  QIcon,
  QCard,
  QCardTitle,
  QCardMedia,
  QCardMain,
  QCardSeparator,
  QList,
  QItemSeparator,
  QItem,
  QItemSide,
  QItemTile,
  QItemMain,
  QInnerLoading,
  QSpinnerPuff,
  QRadio,
  QToggle,
  QAlert,
  QPullToRefresh,
  QSelect
} from 'quasar'
import { mapState } from 'vuex'

export default {
  name: 'index',
  components: {
    QLayout,
    QCollapsible,
    QToolbar,
    QToolbarTitle,
    QIcon,
    QCard,
    QCardTitle,
    QCardMedia,
    QCardMain,
    QCardSeparator,
    QList,
    QItemSeparator,
    QItem,
    QItemSide,
    QItemTile,
    QItemMain,
    QInnerLoading,
    QSpinnerPuff,
    QRadio,
    QToggle,
    QAlert,
    QPullToRefresh,
    QSelect
  },
  data () {
    return {
      exchange: null,
      thisRealTime: false
    }
  },
  computed: {
    ...mapState(['config', 'data', 'error', 'realTime'])
  },
  watch: {
    'config.default_exchange': function () {
      this.$store.commit('SET_EXCHANGE', this.config.default_exchange)
      this.fetchData()
    },
    thisRealTime () {
      this.$store.commit('SET_REAL_TIME', this.thisRealTime)
      this.$store.dispatch('FETCH_DATA_LIST')
    }
  },
  methods: {
    async fetchData () {
      await this.$store.dispatch('FETCH_DATA_LIST')
    },
    async refresher (done) {
      // refrescar la lista sin real time
      await this.$store.dispatch('FETCH_DATA_LIST')
      done()
    }
  },
  async beforeMount () {
    await this.$store.dispatch('FETCH_CONFIG')
    await this.fetchData()
    this.thisRealTime = this.realTime
  }
}
</script>

<template>
  <q-layout
    ref="layout"
    view="lHh Lpr fFf">
    <!-- Header -->
    <q-toolbar slot="header" color="indigo-10">
      <q-toolbar-title>
        {{ config.name }}
      </q-toolbar-title>
    </q-toolbar>

    <!-- Settings -->
    <q-list class="settings-app">
      <q-collapsible icon="settings" label="Configuration">
        <div class="settings-panel">
          <p>Exchange:</p>
          <q-list>
            <q-item tag="label" v-for="key in Object.keys(config.exchanges)" :key="key" style="min-height: 30px;padding: 4px 16px;">
              <q-item-side>
                <q-radio v-model="config.default_exchange" :val="key" color="indigo-10"/>
              </q-item-side>
              <q-item-main>
                <q-item-tile label>{{ key }}</q-item-tile>
              </q-item-main>
            </q-item>
          </q-list>
        </div>

        <div class="settings-panel">
          <p>
            <q-toggle
              v-model="thisRealTime"
              left-label
              label="Real Time"
              color="indigo-10" />
          </p>
          <q-alert
            color="red"
            icon="warning"
            v-if="realTime" >
            Attention, real time can consume a lot of your data. Are you sure?
          </q-alert>
          <q-alert
            color="indigo-5"
            icon="touch_app"
            v-if="!realTime" >
            You can update data by dragging the coin list to bottom
          </q-alert>
        </div>
      </q-collapsible>
    </q-list>

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

    <!-- Coin List -->
    <q-pull-to-refresh
      :handler="refresher"
      pull-message=""
      refresh-message=""
      :distance="10"
      style="top: 50px;"
      :disable="realTime">
      <q-list class="currency-list" >
        <q-item v-for="item in data.list" :key="item.CODE" class="currency-list-item">
          <q-item-side class="currency-list-item-name">
            {{ item.FROM_CURRENCY }}/{{ item.TO_CURRENCY }}
            <small class="currency-list-item-volume light-paragraph" style="display: block;">{{ config.default_exchange }}</small>
          </q-item-side>
          <q-item-main :class="`currency-list-item__${item.FLAG_RESPONSE}`">
            <q-item-tile class="currency-list-item-price" label>{{ item.TO_CURRENCY === 'USD' ? '$' : '€'}} {{ parseFloat(parseFloat(item.PRICE).toFixed(8)) }}</q-item-tile>
            <small class="currency-list-item-volume light-paragraph">{{ item.LAST_UPDATE_FORMAT }}</small>
          </q-item-main>
          <q-item-side right>
            <q-icon name="arrow_drop_up"
              class="currency-list-item__1"
              size="2.5rem"
              v-if="item.FLAG_RESPONSE == '1'"/>
            <q-icon name="arrow_drop_down"
              class="currency-list-item__2"
              size="2.5rem"
              v-if="item.FLAG_RESPONSE == '2'"/>
            <q-icon name="remove"
              class="currency-list-item__4"
              size="2.5rem"
              v-if="item.FLAG_RESPONSE == '0' || item.FLAG_RESPONSE == '4'"/>
          </q-item-side>
        </q-item>
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

<style lang="stylus">
.currency-list {
  border: 0;
}
.currency-list-item {
  font-size: 1.1rem;
  border-bottom: 1px solid #e9e9e9;
}
.currency-list-item-price {
  margin-bottom: -5px;
}
.currency-list-item-volume {
  font-size: .7rem;
  color: grey;
  white-space:nowrap;
  display:inline-block;
}
.currency-list-item-name {
  min-width: 27%;
}
.currency-list-item__1 {
  color: #00be00;
}
.currency-list-item__2 {
  color: #f00;
}
.currency-list-item__4,
.currency-list-item__0 {
  color: #3e3e3e;
}
.settings-app {
  position: fixed;
  width: 100%;
  z-index: 9999;
  background-color: white;
}
.settings-panel {
  margin: 20px 0px;

  &:first-child {
    margin: 0px;
  }
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
