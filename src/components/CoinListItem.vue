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
    <q-item-main :class="item.IS_OLD ? 'currency-list-item__old' : `currency-list-item__${item.FLAG_RESPONSE}`">
      <q-item-tile class="currency-list-item-price" label>
        {{ item.TO_CURRENCY | getSymbol }} {{ item.PRICE | getPriceFormatted }}
      </q-item-tile>
      <small class="currency-list-item-volume light-paragraph">{{ item.LAST_UPDATE_FORMAT }}</small>
    </q-item-main>
    <q-item-side right v-if="item.IS_OLD">
      <span class="currency-list-item-label-old">{{ $t('old') }}</span>
    </q-item-side>
    <q-item-side right v-else>
      <q-icon :name="item.FLAG_RESPONSE | getIconByStatus"
        :class="`currency-list-item__${item.FLAG_RESPONSE}`"
        size="2.5rem"/>
    </q-item-side>
  </q-item>
</template>

<style lang="scss">
.currency-list-item {
  font-size: 1.1rem;
  border-bottom: 1px solid rgb(233, 233, 233);

  &-price {
    margin-bottom: -5px;
  }
  &-volume {
    font-size: .7rem;
    color: rgb(128, 128, 128);
    white-space:nowrap;
    display:inline-block;
  }
  &-name {
    min-width: 27%;
  }
  &__1 {
    color: rgb(3, 179, 3);
  }
  &__2 {
    color: rgb(255, 0, 0);
  }
  &__4,
  &__0 {
    color: rgb(62, 62, 62);
  }
  &__old {
    color: rgb(128, 128, 128);
  }
  &-label-old {
    border-radius: 2px;
    padding: 5px;
    font-size: .8em;
    color: rgb(247, 247, 0);
    background-color: rgb(240, 0, 0);
    min-width: 50px;
    text-align: center;
  }
}
</style>

