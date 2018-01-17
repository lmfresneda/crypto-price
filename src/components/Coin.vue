<script>
import quasarUtil from '../utils/quasar-util'
import { mapState, mapGetters } from 'vuex'
import { types } from '../store'
import data from '../data'
import CCC from '../utils/ccc'

export default {
  props: ['from', 'to'],
  name: 'coin',
  components: {
    ...quasarUtil.getQComponents()
  },
  data () {
    return {
      dataTrend: [],
      trades: [],
      sub: null,
      dataFrom: null,
      dataTo: null,
      priceOld: null,
      image: null,
      name: '',
      socket: null
    }
  },
  computed: {
    ...mapState(['config', 'coinIsView', 'realTime']),
    ...mapGetters(['getDataCoinsList']),
    getItem () {
      const coin = this.getDataCoinsList.find(c => c.CODE === `${this.from}${this.to}`)
      return coin
    }
  },
  methods: {
    closeCoin () {
      this.$router.push({ name: 'CoinList' })
    },
    async refresher (done) {
      await this.$store.dispatch(types.FETCH_DATA_LIST)
      if (!this.realTime) this.closeSocket()
      this.openSocket()
      done()
    },
    closeSocket () {
      if (this.socket) {
        this.socket.emit('SubRemove', { subs: [this.sub] })
        this.socket.close()
        this.socket.disconnect()
        this.socket = null
      }
    },
    openSocket () {
      if (!this.socket) {
        this.trades = []
        this.socket = data.getSocket(this.config.url_ws, 'm', (message) => {
          // cada trade
          const trade = CCC.CURRENCY.getObjectFromMessage(message, CCC.CURRENCY.MAP_TRADE)
          if (trade && trade.FLAG_RESPONSE &&
            trade.FLAG_RESPONSE !== CCC.CURRENCY.FLAGS.UNKNOWN.toString()) {
            if (this.trades.length >= 30) {
              // sacar el último
              this.trades.pop()
            }
            this.trades.unshift(trade)
            if (this.trades.length >= 30 && !this.realTime) {
              // cerramos el socket porque no estamos en tiempo real
              this.closeSocket()
            }
          }
        })
        this.sub = CCC.CURRENCY.getKey({
          TYPE: CCC.STATIC.TYPE.TRADE,
          MARKET: this.config.default_exchange,
          FROMSYMBOL: this.from,
          TOSYMBOL: this.to
        })
        this.socket.emit('SubAdd', { subs: [this.sub] })
      }
    }
  },
  beforeDestroy () {
    this.closeSocket()
    this.$store.commit(types.SET_VIEW_CHILDREN, false)
  },
  async beforeMount () {
    console.log(this.config)
    const datos = await data.getHistoLast(
      this.from, this.to, this.config.default_exchange)
    if (datos && datos.length && datos.length > 1) {
      const dateFrom = datos[0].time * 1000
      const dateTo = datos[datos.length - 1].time * 1000
      this.dataFrom = quasarUtil.getDateUtil().formatDate(dateFrom, 'DD-MM-YY HH:mm:ss')
      this.dataTo = quasarUtil.getDateUtil().formatDate(dateTo, 'DD-MM-YY HH:mm:ss')
      this.dataTrend = datos.map(c => c.close)
      // sacamos el precio de la moneda en el momento de 'dateFrom'
      this.priceOld =
        await data.getPriceInDate(this.from, this.to, dateFrom, this.config.default_exchange)
    }
    // this.image = await data.getUrlCoinImage(this.from)
    this.name = await data.getNameCoin(this.from)

    // abrir socket para últimos movimientos
    this.openSocket()
  }
}
</script>

<template>
  <div v-if="coinIsView && getItem">
    <!-- Header -->
    <q-toolbar class="coin-toolbar" slot="header" color="indigo-10">
      <q-toolbar-title>
        <span class="config-title">{{ getItem.FROM_CURRENCY }}/{{ getItem.TO_CURRENCY }}</span>
        <q-icon
          class="icon-close icon-white"
          @click="closeCoin()"
          name="close" size="2rem"/>
      </q-toolbar-title>
    </q-toolbar>

    <q-pull-to-refresh
      style="padding-top: 50px;"
      v-show="coinIsView"
      :handler="refresher"
      :release-message="$t('releasetorefresh')"
      pull-message=""
      refresh-message=""
      :disable="realTime">

      <div class="coin-info">
        <div class="coin-info-image">
          <img :src="`statics/coins/${from}.png`" />
        </div>
        <div class="coin-info-pair">
          {{ name }}
        </div>
        <div class="coin-info-coin">
          <div :class="`coin-info-coin--price currency-list-item__${getItem.FLAG_RESPONSE}`">
            {{ getItem.TO_CURRENCY | getSymbol }} {{ getItem.PRICE | getPriceFormatted }} <q-icon :name="getItem.FLAG_RESPONSE | getIconByStatus"
              :class="`currency-list-item__${getItem.FLAG_RESPONSE}`"
              size="2.5rem"/>
          </div>
          <div class="coin-info-coin--date">
            {{ $t('coin.last_update') }} {{ getItem.LAST_UPDATE_FORMAT }}
          </div>
        </div>
      </div>

      <div v-if="dataTrend && dataTrend.length" class="coin-trend">
        <div class="coin-trend-title">{{ $t('coin.last_trends') }}</div>
        <div class="coin-info-trend" v-if="priceOld">
          <div class="coin-info-trend__from">
            {{ getItem.TO_CURRENCY | getSymbol }} {{ priceOld | getPriceFormatted }}
          </div>
          <div class="coin-info-trend__to">
            {{ config.default_exchange }}
          </div>
        </div>
        <trend
          :data="dataTrend"
          :gradient="['#ff00ff', '#00ffff', '#ffff00']"
          auto-draw
          :auto-draw-duration="1000"
          :stroke-opacity=".8"
          :stroke-width="1"
          :padding="0" >
        </trend>
        <div class="coin-info-trend" v-if="dataFrom && dataTo">
          <div class="coin-info-trend__from">
            {{ dataFrom }}
          </div>
          <div class="coin-info-trend__to">
            {{ dataTo }}
          </div>
        </div>
      </div>
      <div v-else class="coin-trend">
        <div class="coin-trend-title">
          {{ $t('coin.no_trend_data') }}
        </div>
      </div>

      <div class="coin-trades">
        <div class="coin-trades-title">
          {{ $t('coin.last_trades') }} {{ realTime ? '' : '(30 max)' }}
        </div>
        <table class="coin-trades-table fit">
          <thead>
            <tr>
              <th class="gt-sm">ID</th>
              <th>{{ $t('coin.type') }}</th>
              <th>{{ $t('coin.price') }}</th>
              <th>{{ $t('coin.quantity') }}</th>
              <th>{{ $t('coin.total') }}</th>
              <th class="gt-xs">{{ $t('coin.date') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr :class="`coin-trades-table--tr_${trade.FLAG_RESPONSE}`" v-for="(trade, index) in trades" :key="index">
              <td class="gt-sm">{{ trade.TRADE_ID }}</td>
              <td>{{ trade.FLAG_RESPONSE === '1' ? 'BUY' : 'SELL' }}</td>
              <td>{{ getItem.TO_CURRENCY | getSymbol }} {{ trade.PRICE | getPriceFormatted }}</td>
              <td>{{ trade.QUANTITY }}</td>
              <td>{{ getItem.TO_CURRENCY | getSymbol }} {{ trade.TOTAL | getPriceFormatted }}</td>
              <td class="gt-xs">{{ trade.TIMESTAMP | formatTsToHumanDate }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="coin-exchange">
        {{ $t('coin.info_from') }} <strong>{{ config.default_exchange }}</strong>
      </div>
    </q-pull-to-refresh>
  </div>
  <div v-else>
    {{ $t('loading') }}...
  </div>
</template>

<style lang="scss" scoped>
.coin-toolbar {
  z-index: 9999; // for hide pull to refresh arrow
  position: fixed;
}

.coin-info {
  padding: 20px;

  &-coin {
    text-align: center;

    &--price {
      font-size: 1.2em;
    }
    &--date {
      font-size: .8em;
      color: rgb(100, 100, 100);
    }
  }
  &-image {
    text-align: center;
    img {
      max-height: 100px;
    }
  }
  &-pair {
    text-align: center;
    font-size: 2em;
  }
}

.coin-trend {
  padding: 8px;
  svg {
    padding: 8px 0px;
    border: 1px solid rgb(85, 85, 85);
    background-color: #131313;
  }

  &-title {
    text-align: center;
    color: rgb(85, 85, 85);
  }
}

.coin-info-trend {
  div {
    color: rgb(85, 85, 85);
    font-size: .7em;
  }

  &__from {
    float: left;
  }
  &__to {
    float: right;
  }
}

.coin-trades {
  padding: 9px;
  margin-top: 15px;

  &-title {
    text-align: center;
    color: rgb(85, 85, 85);
    margin-bottom: 5px;
  }

  &-table{
    font-size: .7em;
    color: white;
    border-collapse: collapse!important;
    border: 1px solid rgb(141, 141, 141);

    th {
      text-align: left;
      color: rgb(56, 56, 56);
    }

    tr:nth-child(even) {background: #f1f1f1}
    tr:nth-child(odd) {background: #fffdfd}

    td {
      padding: 2px;
      border: 0px;
    }

    &--tr_1 {
      color: #00c143;
    }
    &--tr_2 {
      color: #e42f2f;
    }
  }
}

.coin-exchange {
  color: rgb(85, 85, 85);
  margin-top: 10px;
  margin-bottom: 100px;
  text-align: center;
}
</style>

