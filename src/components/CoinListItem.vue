<script>
import quasarUtil from '../utils/quasar-util'
import { mapState } from 'vuex'
import { types } from '../store'

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
    viewCoin () {
      this.$store.commit(types.SET_VIEW_CHILDREN, true)
      this.$router.push({
        name: 'Coin',
        params: { from: this.item.FROM_CURRENCY, to: this.item.TO_CURRENCY }
      })
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
        {{ item.TO_CURRENCY | getSymbol }} {{ item.PRICE | getPriceFormatted }}
      </q-item-tile>
      <small class="currency-list-item-volume light-paragraph">{{ item.LAST_UPDATE_FORMAT }}</small>
    </q-item-main>
    <q-item-side right>
      <q-icon :name="item.FLAG_RESPONSE | getIconByStatus"
        :class="`currency-list-item__${item.FLAG_RESPONSE}`"
        size="2.5rem"/>
    </q-item-side>
  </q-item>
</template>

<style lang="scss">
.currency-list-item {
  font-size: 1.1rem;
  border-bottom: 1px solid #e9e9e9;

  &-price {
    margin-bottom: -5px;
  }
  &-volume {
    font-size: .7rem;
    color: grey;
    white-space:nowrap;
    display:inline-block;
  }
  &-name {
    min-width: 27%;
  }
  &__1 {
    color: #00be00;
  }
  &__2 {
    color: #f00;
  }
  &__4,
  &__0 {
    color: #3e3e3e;
  }
}
</style>

