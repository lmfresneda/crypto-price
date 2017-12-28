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
    QSelect
  },
  data () {
    return {
      exchange: null
    }
  },
  computed: {
    ...mapState(['config', 'data', 'error'])
  },
  watch: {
    'config.default_exchange': function () {
      this.fetchData()
    }
  },
  methods: {
    async fetchData () {
      await this.$store.dispatch('FETCH_DATA_LIST')
    }
  },
  async beforeMount () {
    await this.$store.dispatch('FETCH_CONFIG')
    await this.fetchData()
  }
}
</script>

<template>
  <q-layout
    ref="layout"
    view="lHh Lpr fFf">
    <q-toolbar slot="header" color="indigo-10">
      <q-toolbar-title>
        {{ config.name }}
      </q-toolbar-title>
    </q-toolbar>

    <div>
      <q-list>
        <q-collapsible icon="settings" label="Configuration">
          <p>Exchange:</p>
          <q-list>
            <q-item tag="label" v-for="key in Object.keys(config.exchanges)" :key="key">
              <q-item-side>
                <q-radio v-model="config.default_exchange" :val="key" color="indigo-10"/>
              </q-item-side>
              <q-item-main>
                <q-item-tile label>{{ key }}</q-item-tile>
              </q-item-main>
            </q-item>
          </q-list>
        </q-collapsible>
      </q-list>
    </div>

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

    <q-list class="currency-list" >
      <q-item v-for="item in data.list" :key="item.CODE" class="currency-list-item">
        <q-item-side class="currency-list-item-name">
          {{ item.FROM_CURRENCY }}/{{ item.TO_CURRENCY }}
        </q-item-side>
        <q-item-main :class="`currency-list-item__${item.FLAG_RESPONSE}`">
          <q-item-tile class="currency-list-item-price" label>{{ item.TO_CURRENCY === 'USD' ? '$' : '€'}} {{ parseFloat(parseFloat(item.PRICE).toFixed(8)) }}</q-item-tile>
          <small class="currency-list-item-volume light-paragraph"><strong>24H:</strong> {{ parseFloat(parseFloat(item.VOLUME_24H).toFixed(8)) }}</small>
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
      <q-inner-loading :visible="data.list.length === 0" v-if="!error">
        <q-spinner-puff size="80px" color="indigo-10"></q-spinner-puff>
      </q-inner-loading>
    </q-list>

    <!-- Footer -->
    <q-toolbar slot="footer" color="indigo-10">
      <q-toolbar-title>
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
</style>
