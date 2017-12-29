<script>
import quasarUtil from '../utils/quasar-util'
import { mapState } from 'vuex'
import { SET_VIEW_COIN } from '../store'

export default {
  props: ['item'],
  name: 'coin-list-item',
  components: {
    ...quasarUtil.getQComponents()
  },
  data () {
    return {}
  },
  computed: {
    ...mapState(['config'])
  },
  methods: {
    getIconByStatus (status) {
      return ({
        0: 'remove',
        4: 'remove',
        1: 'arrow_drop_up',
        2: 'arrow_drop_down'
      })[status]
    },
    getSymbol (currency) {
      return ({
        'USD': '$',
        'EUR': '€'
      })[currency]
    },
    getPriceFormatted (price) {
      return parseFloat(parseFloat(price).toFixed(8))
    },
    viewCoin () {
      this.$store.commit(SET_VIEW_COIN, true)
      this.$router.push({ path: '/coin', query: this.item })
    }
  }
}
</script>

<template>
  <q-item class="currency-list-item" @click="viewCoin(item)">
    <q-item-side class="currency-list-item-name">
      {{ item.FROM_CURRENCY }}/{{ item.TO_CURRENCY }}
      <small class="currency-list-item-volume light-paragraph" style="display: block;">
        {{ config.default_exchange }}
      </small>
    </q-item-side>
    <q-item-main :class="`currency-list-item__${item.FLAG_RESPONSE}`">
      <q-item-tile class="currency-list-item-price" label>
        {{ getSymbol(item.TO_CURRENCY) }} {{ getPriceFormatted(item.PRICE) }}
      </q-item-tile>
      <small class="currency-list-item-volume light-paragraph">{{ item.LAST_UPDATE_FORMAT }}</small>
    </q-item-main>
    <q-item-side right>
      <q-icon :name="getIconByStatus (item.FLAG_RESPONSE)"
        :class="`currency-list-item__${item.FLAG_RESPONSE}`"
        size="2.5rem"/>
    </q-item-side>
  </q-item>
</template>

<style lang="scss" scoped>
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

