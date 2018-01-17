import Vue from 'vue'
import Vuex from 'vuex'
import { date } from 'quasar'
import CCC from './utils/ccc'
import data from './data'

export const types = {
  // MUTATIONS
  SET_REAL_TIME: 'SET_REAL_TIME',
  SET_CONFIG: 'SET_CONFIG',
  SET_EXCHANGE: 'SET_EXCHANGE',
  SET_SUBSCRIPTION: 'SET_SUBSCRIPTION',
  SET_DATA_LIST: 'SET_DATA_LIST',
  SET_DATA_LIST_MANUAL: 'SET_DATA_LIST_MANUAL',
  CLEAR_DATA_LIST: 'CLEAR_DATA_LIST',
  CONNECT_SOCKET: 'CONNECT_SOCKET',
  DISCONNECT_SOCKET: 'DISCONNECT_SOCKET',
  SET_VIEW_CHILDREN: 'SET_VIEW_CHILDREN',
  // ACTIONS
  FETCH_CONFIG: 'FETCH_CONFIG',
  FETCH_DATA_LIST_SOCKET: 'FETCH_DATA_LIST_SOCKET',
  FETCH_DATA_LIST_MANUAL: 'FETCH_DATA_LIST_MANUAL',
  FETCH_DATA_LIST: 'FETCH_DATA_LIST'
}

function complete (curr, state) {
  curr.FROM_CURRENCY_NAME = state.config.coins[curr.FROM_CURRENCY].name
  curr.CODE = `${curr.FROM_CURRENCY}${curr.TO_CURRENCY}`
  curr.LAST_UPDATE_FORMAT = date.formatDate(parseInt(curr.LAST_UPDATE) * 1000, 'DD/MM/YYYY HH:mm:ss')
  // if (!curr.LAST_UPDATE_FORMAT) date.formatDate(Date.now() * 1000, 'DD/MM/YYYY HH:mm:ss')
  return curr
}

const store = new Vuex.Store({
  state: {
    coinIsView: false,
    error: false,
    realTime: false,
    config: {
      name: 'Crypto Price',
      version: '0.1',
      url_ws: '',
      base_api: '',
      default_exchange: '',
      exchanges: {},
      coins: {}
    },
    data: {
      // coins: { BTCEUR: { "TYPE_REQUEST": "2","EXCHANGE": "Coinbase","FROM_CURRENCY": "BTC","TO_CURRENCY": "EUR","FLAG_RESPONSE": "1","PRICE": "12277.99","LAST_UPDATE": "1514242037","LAST_VOLUME": "0.01","LAST_VOLUME_TO": "122.7799","LAST_TRADE_ID": "8449851","VOLUME_24H": "2715.157033440003","VOLUME_24H_TO": "33930403.52727755","MASKINT": "ce9","FROM_CURRENCY_NAME": "Bitcoin","CODE": "BTCEUR"}, BTCUSD: { "TYPE_REQUEST": "2", "EXCHANGE": "Coinbase", "FROM_CURRENCY": "BTC", "TO_CURRENCY": "USD", "FLAG_RESPONSE": "1", "PRICE": "14028", "LAST_UPDATE": "1514242026", "LAST_VOLUME": "0.0435", "LAST_VOLUME_TO": "610.218", "LAST_TRADE_ID": "30443482", "VOLUME_24H": "13617.2430543098", "VOLUME_24H_TO": "192684660.2930932", "MASKINT": "ce9", "FROM_CURRENCY_NAME": "Bitcoin", "CODE": "BTCUSD" },ETHEUR: { "TYPE_REQUEST": "2", "EXCHANGE": "Coinbase", "FROM_CURRENCY": "ETH", "TO_CURRENCY": "EUR", "FLAG_RESPONSE": "4", "PRICE": "645.14", "LAST_UPDATE": "1514242036", "LAST_VOLUME": "0.38010989", "LAST_VOLUME_TO": "245.2240944346", "LAST_TRADE_ID": "1634165", "VOLUME_24H": "13966.408100649995", "VOLUME_24H_TO": "8960102.318214871", "MASKINT": "ce9", "FROM_CURRENCY_NAME": "Ethereum", "CODE": "ETHEUR" },ETHUSD: { "TYPE_REQUEST": "2", "EXCHANGE": "Coinbase", "FROM_CURRENCY": "ETH", "TO_CURRENCY": "USD", "FLAG_RESPONSE": "1", "PRICE": "739.52", "LAST_UPDATE": "1514242039", "LAST_VOLUME": "1.33895782", "LAST_VOLUME_TO": "990.1860870464001", "LAST_TRADE_ID": "23364020", "VOLUME_24H": "118979.29718321083", "VOLUME_24H_TO": "86667723.77441208", "MASKINT": "ce9", "FROM_CURRENCY_NAME": "Ethereum", "CODE": "ETHUSD" },LTCEUR: { "TYPE_REQUEST": "2", "EXCHANGE": "Coinbase", "FROM_CURRENCY": "LTC", "TO_CURRENCY": "EUR", "FLAG_RESPONSE": "4", "PRICE": "237.56", "LAST_UPDATE": "1514241896", "LAST_VOLUME": "18.61762498", "LAST_VOLUME_TO": "4422.8029902488", "LAST_TRADE_ID": "1673294", "VOLUME_24H": "33050.905374400056", "VOLUME_24H_TO": "8092820.760336431", "MASKINT": "237.8", "FROM_CURRENCY_NAME": "Litecoin", "CODE": "LTCEUR" },LTCUSD: { "TYPE_REQUEST": "2", "EXCHANGE": "Coinbase", "FROM_CURRENCY": "LTC", "TO_CURRENCY": "USD", "FLAG_RESPONSE": "2", "PRICE": "273.04", "LAST_UPDATE": "1514242036", "LAST_VOLUME": "5.263158", "LAST_VOLUME_TO": "1437.05266032", "LAST_TRADE_ID": "20874768", "VOLUME_24H": "299333.6382803516", "VOLUME_24H_TO": "83243996.29385762", "MASKINT": "ce9", "FROM_CURRENCY_NAME": "Litecoin", "CODE": "LTCUSD" }}, // eslint-disable-line
      coins: {},
      subscription: [],
      socket: null,
      search: null
    }
  },
  getters: {
    getDefaultExchange (state) {
      return state.config.default_exchange
    },
    // devuelve la lista de monedas en forma de array ordenado
    // alfabéticamente por el par
    getDataCoinsList (state) {
      return Object.keys(state.data.coins).map(k => state.data.coins[k])
        .sort((a, b) => {
          if (a.CODE > b.CODE) return 1
          if (a.CODE < b.CODE) return -1
          return 0
        })
    }
  },
  mutations: {
    // indica si se está viendo una segunda pantalla
    [types.SET_VIEW_CHILDREN] (state, view) {
      state.coinIsView = view
    },
    // cambia el realtime si/no
    [types.SET_REAL_TIME] (state, payload) {
      state.realTime = payload
      data.setRealTime(state.realTime)
    },
    // guarda la configuración
    [types.SET_CONFIG] (state, payload) {
      state.config = payload
    },
    // cambia el exchange
    [types.SET_EXCHANGE] (state, exchange) {
      data.setExchange(exchange)
      state.config.default_exchange = exchange
    },
    [types.SET_SUBSCRIPTION] (state, payload) {
      state.data.subscription = payload
    },
    // formatea los datos del ws de salida y los guarda
    [types.SET_DATA_LIST] (state, message) {
      // formatear la lista con lo que venga y actualizar list
      const data = CCC.CURRENCY.getObjectFromMessage(message)
      if (data.codeResponse && data.codeResponse === CCC.STATIC.TYPE.TOO_MANY_CONNECTIONS) {
        state.error = true
        return
      }

      if (data && data.EXCHANGE === state.config.default_exchange) {
        const dataComplete = complete(data, state)

        if (dataComplete.FLAG_RESPONSE === CCC.CURRENCY.FLAGS.PRICEUNCHANGED.toString()) {
          // hay que buscar la anterior y darle precio
          const anterior = state.data.coins[dataComplete.CODE]
          // const anterior = state.data.list.find(d => d.CODE === dataComplete.CODE)
          dataComplete.PRICE = anterior ? anterior.PRICE : dataComplete.PRICE
        }
        if (dataComplete.LAST_UPDATE) {
          dataComplete.IS_OLD =
            date.getDateDiff(new Date(), new Date(parseInt(dataComplete.LAST_UPDATE) * 1000), 'hours') > 3
        }
        Vue.set(state.data.coins, dataComplete.CODE, dataComplete)
      }
    },
    // formatea los datos manuales de salida y los guarda
    [types.SET_DATA_LIST_MANUAL] (state, data) {
      const resultObj = []
      data.forEach(({ RAW }) => {
        Object.keys(RAW).forEach((keyRaw) => {
          Object.keys(RAW[keyRaw]).forEach((curr) => {
            resultObj.push(RAW[keyRaw][curr])
          })
        })
      })

      resultObj.forEach((res) => {
        const obj = CCC.CURRENCY.getObjectFromObject(res)
        const objComplete = complete(obj, state)
        // revisar si es muy antiguo el dato

        if (objComplete.LAST_UPDATE) {
          objComplete.IS_OLD =
            date.getDateDiff(new Date(), new Date(parseInt(objComplete.LAST_UPDATE) * 1000), 'hours') > 3
        }
        Vue.set(state.data.coins, objComplete.CODE, objComplete)
      })
    },
    [types.CLEAR_DATA_LIST] (state) {
      Vue.set(state.data, 'coins', {})
      // state.data.list = []
    },
    // gestiona la conexión al ws
    [types.CONNECT_SOCKET] (state) {
      if (!state.data.socket) {
        state.data.socket = data.getSocket(state.config.url_ws, 'm', (message) => {
          store.commit(types.SET_DATA_LIST, message)
        })
      }

      state.data.socket.emit('SubAdd', { subs: state.data.subscription })
    },
    // emite el evento SubRemove al ws
    [types.DISCONNECT_SOCKET] (state) {
      state.data.socket.emit('SubRemove', { subs: state.data.subscription })
      state.data.socket.close()
      state.data.socket.disconnect()
      state.data.socket = null
    }
  },
  actions: {
    // trae la configuración
    async [types.FETCH_CONFIG] ({ commit, state }) {
      const configStorage = await data.getConfig()
      commit(types.SET_CONFIG, configStorage)

      const configRealTime = data.getRealTime()
      if (configRealTime !== undefined && configRealTime !== null) {
        commit(types.SET_REAL_TIME, configRealTime)
      }
    },
    // realiza la petición de datos por socket
    async [types.FETCH_DATA_LIST_SOCKET] ({ commit, state }) {
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
      commit(types.SET_SUBSCRIPTION, subs)
      commit(types.CONNECT_SOCKET)
    },
    // realiza la petición de datos de forma manual
    async [types.FETCH_DATA_LIST_MANUAL] ({ commit, state }) {
      // pedir las monedas de forma manual

      const arProm = []

      const coinsToUsd = state.config.exchanges[state.config.default_exchange]
        .filter(coin => coin.split('|')[1].split(',').indexOf('USD') !== -1)
        .map(coin => coin.split('|')[0])
      const coinsToEur = state.config.exchanges[state.config.default_exchange]
        .filter(coin => coin.split('|')[1].split(',').indexOf('EUR') !== -1)
        .map(coin => coin.split('|')[0])
      const urlRequestToUsd =
        `${state.config.base_api}pricemultifull?tsyms=USD&e=${state.config.default_exchange}&fsyms=${coinsToUsd.join(',')}`

      const urlRequestToEur =
        `${state.config.base_api}pricemultifull?tsyms=EUR&e=${state.config.default_exchange}&fsyms=${coinsToEur.join(',')}`

      if (coinsToUsd.length) {
        arProm.push(fetch(urlRequestToUsd, {
          compress: false
        }).then(res => res.json()))
      }
      if (coinsToEur.length) {
        arProm.push(fetch(urlRequestToEur, {
          compress: false
        }).then(res => res.json()))
      }
      const result = await Promise.all(arProm)

      commit(types.SET_DATA_LIST_MANUAL, result)
    },
    // realiza la petición de datos, bien por pull to refresh o bien a socket
    async [types.FETCH_DATA_LIST] ({ commit, state, dispatch }) {
      commit(types.CLEAR_DATA_LIST)
      if (state.data.socket && state.data.subscription.length && !state.error) {
        // desconectar del ws
        commit(types.DISCONNECT_SOCKET)
      }

      if (state.realTime) return dispatch(types.FETCH_DATA_LIST_SOCKET)
      else return dispatch(types.FETCH_DATA_LIST_MANUAL)
    }
  }
})

export default store
