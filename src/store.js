import Vuex from 'vuex'
import fetch from 'node-fetch'
import { LocalStorage } from 'quasar'
import io from 'socket.io-client'
import config from './assets/config'
import CCC from './utils/ccc'

const KEY_WEB_STORE = '__CONFIG_CRYPTO_APP__'

const store = new Vuex.Store({
  state: {
    error: false,
    config: {
      name: 'Crypto Price',
      version: '1.0',
      url_ws: '',
      base_api: '',
      default_exchange: '',
      exchanges: {},
      coins: {},
      map_response: ''
    },
    data: {
      formatting: false,
      // list: [{ "TYPE_REQUEST": "2", "EXCHANGE": "Coinbase", "FROM_CURRENCY": "BTC", "TO_CURRENCY": "EUR", "FLAG_RESPONSE": "1", "PRICE": "12277.99", "LAST_UPDATE": "1514242037", "LAST_VOLUME": "0.01", "LAST_VOLUME_TO": "122.7799", "LAST_TRADE_ID": "8449851", "VOLUME_24H": "2715.157033440003", "VOLUME_24H_TO": "33930403.52727755", "MASKINT": "ce9", "FROM_CURRENCY_NAME": "Bitcoin", "CODE": "BTCEUR" }, { "TYPE_REQUEST": "2", "EXCHANGE": "Coinbase", "FROM_CURRENCY": "BTC", "TO_CURRENCY": "USD", "FLAG_RESPONSE": "1", "PRICE": "14028", "LAST_UPDATE": "1514242026", "LAST_VOLUME": "0.0435", "LAST_VOLUME_TO": "610.218", "LAST_TRADE_ID": "30443482", "VOLUME_24H": "13617.2430543098", "VOLUME_24H_TO": "192684660.2930932", "MASKINT": "ce9", "FROM_CURRENCY_NAME": "Bitcoin", "CODE": "BTCUSD" }, { "TYPE_REQUEST": "2", "EXCHANGE": "Coinbase", "FROM_CURRENCY": "ETH", "TO_CURRENCY": "EUR", "FLAG_RESPONSE": "4", "PRICE": "645.14", "LAST_UPDATE": "1514242036", "LAST_VOLUME": "0.38010989", "LAST_VOLUME_TO": "245.2240944346", "LAST_TRADE_ID": "1634165", "VOLUME_24H": "13966.408100649995", "VOLUME_24H_TO": "8960102.318214871", "MASKINT": "ce9", "FROM_CURRENCY_NAME": "Ethereum", "CODE": "ETHEUR" }, { "TYPE_REQUEST": "2", "EXCHANGE": "Coinbase", "FROM_CURRENCY": "ETH", "TO_CURRENCY": "USD", "FLAG_RESPONSE": "1", "PRICE": "739.52", "LAST_UPDATE": "1514242039", "LAST_VOLUME": "1.33895782", "LAST_VOLUME_TO": "990.1860870464001", "LAST_TRADE_ID": "23364020", "VOLUME_24H": "118979.29718321083", "VOLUME_24H_TO": "86667723.77441208", "MASKINT": "ce9", "FROM_CURRENCY_NAME": "Ethereum", "CODE": "ETHUSD" }, { "TYPE_REQUEST": "2", "EXCHANGE": "Coinbase", "FROM_CURRENCY": "LTC", "TO_CURRENCY": "EUR", "FLAG_RESPONSE": "4", "PRICE": "237.56", "LAST_UPDATE": "1514241896", "LAST_VOLUME": "18.61762498", "LAST_VOLUME_TO": "4422.8029902488", "LAST_TRADE_ID": "1673294", "VOLUME_24H": "33050.905374400056", "VOLUME_24H_TO": "8092820.760336431", "MASKINT": "237.8", "FROM_CURRENCY_NAME": "Litecoin", "CODE": "LTCEUR" }, { "TYPE_REQUEST": "2", "EXCHANGE": "Coinbase", "FROM_CURRENCY": "LTC", "TO_CURRENCY": "USD", "FLAG_RESPONSE": "2", "PRICE": "273.04", "LAST_UPDATE": "1514242036", "LAST_VOLUME": "5.263158", "LAST_VOLUME_TO": "1437.05266032", "LAST_TRADE_ID": "20874768", "VOLUME_24H": "299333.6382803516", "VOLUME_24H_TO": "83243996.29385762", "MASKINT": "ce9", "FROM_CURRENCY_NAME": "Litecoin", "CODE": "LTCUSD" }], // eslint-disable-line
      list: [], // eslint-disable-line
      subscription: [],
      socket: null,
      search: null
    }
  },
  getters: {
    getDefaultExchange (state) {
      return state.config.default_exchange
    }
  },
  mutations: {
    SET_CONFIG (state, payload) {
      state.config = payload
      LocalStorage.set(KEY_WEB_STORE, payload)
    },
    SET_EXCHANGE (state, exchange) {
      const configStorage = LocalStorage.get.item(KEY_WEB_STORE)
      if (configStorage) {
        configStorage.default_exchange = exchange
        LocalStorage.set(KEY_WEB_STORE, configStorage)
      }

      state.config.default_exchange = exchange
    },
    SET_SUBSCRIPTION (state, payload) {
      state.data.subscription = payload
    },
    // formatea los datos de salida y los guarda
    SET_DATA_LIST (state, message) {
      // formatear la lista con lo que venga y actualizar list
      const data = CCC.CURRENCY.getObject(message, state.config.map_response)
      if (data.codeResponse) {
        if (data.codeResponse === CCC.STATIC.TYPE.TOO_MANY_CONNECTIONS) {
          state.error = true
        }
        return
      }

      if (data !== null && data.EXCHANGE === state.config.default_exchange) {
        data.FROM_CURRENCY_NAME = state.config.coins[data.FROM_CURRENCY].name
        data.CODE = `${data.FROM_CURRENCY}${data.TO_CURRENCY}`

        state.data.list = state.data.list.filter(d => d.CODE !== data.CODE)
        state.data.list.push(data)
      }
      state.data.list.sort((a, b) => {
        if (a.CODE > b.CODE) return 1
        if (a.CODE < b.CODE) return -1
        return 0
      })
    },
    CLEAR_DATA_LIST (state) {
      state.data.list = []
    },
    // gestiona la conexión al ws
    CONNECT_SOCKET (state) {
      if (!state.data.socket) {
        const socket = io(state.config.url_ws, { forceNew: true })
        state.data.socket = socket
        state.data.socket.on('m', function (message) {
          store.commit('SET_DATA_LIST', message)
        })
      }
      state.data.socket.emit('SubAdd', { subs: state.data.subscription })
    },
    // emite el evento SubRemove al ws
    SubRemove (state) {
      state.data.socket.emit('SubRemove', { subs: state.data.subscription })
      state.data.socket.close()
      state.data.socket.disconnect()
      state.data.socket = null
    }
  },
  actions: {
    // trae la configuración
    async FETCH_CONFIG ({ commit, state }) {
      // miramos si la tenemos en caché
      const configStorage = LocalStorage.get.item(KEY_WEB_STORE)
      if (configStorage) commit('SET_CONFIG', configStorage)
      else {
        // si no la tenemos, la pedimos
        const data = await fetch(config.url_config).then((res) => res.json())
        // data.default_exchange = 'Coinbase'
        commit('SET_CONFIG', data)
      }
    },
    // forma los datos para las subscripciones
    async FETCH_DATA_LIST ({ commit, state }) {
      if (state.data.socket && state.data.subscription.length && !state.error) {
        // desconectar del ws
        commit('CLEAR_DATA_LIST')
        commit('SubRemove')
      }

      console.log(state.config.default_exchange)

      // formar las peticiones para el ws
      const subs = state.config.exchanges[state.config.default_exchange].reduce((prev, coincurr) => {
        const coin = coincurr.split('|')[0]
        const curr = coincurr.split('|')[1]
        curr.split(',').forEach((cur) => {
          prev.push(CCC.CURRENCY.getKey({
            TYPE: CCC.STATIC.TYPE.CURRENT,
            MARKET: state.config.default_exchange,
            FROMSYMBOL: coin,
            TOSYMBOL: cur
          }))
        })
        return prev
      }, [])
      commit('SET_SUBSCRIPTION', subs)
      commit('CONNECT_SOCKET')
    }
  }
})

export default store
