<script>
import quasarUtil from '../utils/quasar-util'
import { mapState, mapGetters } from 'vuex'
import { types } from '../store'
import data from '../data'

export default {
  props: ['from', 'to'],
  name: 'coin',
  components: {
    ...quasarUtil.getQComponents()
  },
  data () {
    return {
      dataTrend: [],
      dataFrom: null,
      dataTo: null,
      image: null,
      name: ''
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
      this.$store.commit(types.SET_VIEW_CHILDREN, false)
      this.$router.push({ name: 'CoinList' })
    },
    async refresher (done) {
      await this.$store.dispatch(types.FETCH_DATA_LIST)
      done()
    }
  },
  async beforeMount () {
    console.log(this.config)
    const datos = await data.getHistoLast(
      this.from, this.to, this.config.default_exchange)
    this.dataFrom = quasarUtil.getDateUtil().formatDate(datos[0].time * 1000, 'DD-MM-YY HH:mm:ss')
    this.dataTo = quasarUtil.getDateUtil().formatDate(datos[datos.length - 1].time * 1000, 'DD-MM-YY HH:mm:ss')
    this.dataTrend = datos.map(c => c.open)
    this.image = await data.getUrlCoinImage(this.from)
    this.name = await data.getNameCoin(this.from)
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
      v-show="coinIsView"
      :handler="refresher"
      pull-message=""
      refresh-message=""
      :disable="realTime">
      <div class="coin-info">
        <div class="coin-info-image">
          <img :src="image" v-if="image" />
        </div>
        <div class="coin-info-pair">
          {{ name }}
        </div>
        <div class="coin-info-coin">
          <div :class="`coin-info-coin--price currency-list-item__${getItem.FLAG_RESPONSE}`">
            {{ getItem.TO_CURRENCY | getSymbol }}  {{ getItem.PRICE | getPriceFormatted }} <q-icon :name="getItem.FLAG_RESPONSE | getIconByStatus"
              :class="`currency-list-item__${getItem.FLAG_RESPONSE}`"
              size="2.5rem"/>
          </div>
          <div class="coin-info-coin--date">
            Last update {{ getItem.LAST_UPDATE_FORMAT }}
          </div>
        </div>
      </div>

      <div class="coin-trend">
        <div class="coin-trend-title">
          Last trends
        </div>
        <trend
          :data="dataTrend"
          :gradient="['#FF5733', '#008AE0', '#07CA00']"
          auto-draw
          :stroke-width="2"
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
    </q-pull-to-refresh>
  </div>
  <div v-else>
    Loading...
  </div>
</template>

<style lang="scss" scoped>
.coin-toolbar {
  z-index: 9999; // for hide pull to refresh arrow
}
.coin-info {
  padding: 20px;
}
.coin-info-coin {
  text-align: center;

  &--price {
    font-size: 1.2em;
  }
  &--date {
    font-size: .8em;
    color: rgb(100, 100, 100);
  }
}
.coin-info-image {
  text-align: center;
  img {
    max-height: 100px;
  }
}
.coin-info-pair {
  text-align: center;
  font-size: 2em;
}

.coin-trend {
  padding: 8px;
  svg {
    padding: 8px 0px;
    border: 1px solid rgb(85, 85, 85);
  }
}
.coin-trend-title {
  text-align: center;
  color: rgb(85, 85, 85);
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
</style>

