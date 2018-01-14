import { LocalStorage } from 'quasar'
import io from 'socket.io-client'
import locale2 from 'locale2'
import config from './assets/config'
import quasarUtil from './utils/quasar-util'

export const KEY_WEB_STORE_REALTIME = '__REALTIME_CRYPTO_APP__'
export const KEY_WEB_STORE_CONFIG = '__CONFIG_CRYPTO_APP__'
export const KEY_WEB_STORE_LANG = '__LANG_CRYPTO_APP__'

function setRealTime (realTime) {
  LocalStorage.set(KEY_WEB_STORE_REALTIME, realTime)
}

function getRealTime () {
  return LocalStorage.get.item(KEY_WEB_STORE_REALTIME)
}

function setConfig (config) {
  LocalStorage.set(KEY_WEB_STORE_CONFIG, config)
}

function setExchange (exchange) {
  const configStorage = LocalStorage.get.item(KEY_WEB_STORE_CONFIG)
  if (configStorage) {
    configStorage.default_exchange = exchange
    LocalStorage.set(KEY_WEB_STORE_CONFIG, configStorage)
  }
}

// indica si una configuración es inválida o antigua
function configIsInvalid (config) {
  return !config || // si no existe
    !config.__date__ || // si no se le ha añadido marca de tiempo
    quasarUtil.getDateUtil().getDateDiff(
      new Date(),
      new Date(config.__date__),
      'minutes') > 120 // si tiene más de 2 horas
}

async function getConfig () {
  if (process.env.NODE_ENV === 'development') {
    const fromDev = require('../config-app')
    console.log('** Requested config from local (development) **')
    console.log(fromDev)
    return fromDev
  }

  const configStorage = LocalStorage.get.item(KEY_WEB_STORE_CONFIG)
  // el config guardado lo mantenemos durante 2 horas, no más
  if (configStorage && !configIsInvalid(configStorage)) {
    return configStorage
  } else {
    // si no la tenemos, la pedimos
    try {
      const data = await fetch(config.url_config, {
        compress: false
      }).then((res) => res.json())
      // añadimos la marca de tiempo
      data.__date__ = Date.now()
      // y la guardamos
      setConfig(data)
      return data
    } catch (error) {
      console.log('Error when getConfig', error)
      const fromDev = require('../config-app')
      console.log('** Requested config from local (error fetch) **')
      console.log(fromDev)
      return fromDev
    }
  }
}

function getSocket (url, event, callback, forceNew = true) {
  const socket = io(url, { forceNew })
  socket.on('m', callback)
  return socket
}

async function getHistoLast (from, to, exchange) {
  const config = await getConfig()
  const url = `${config.base_api}histominute?fsym=${from}&tsym=${to}&aggregate=3&e=${exchange}&limit=300`
  const datos = await fetch(url, {
    compress: false
  }).then((res) => res.json())
  return datos.Data
}

async function getPriceInDate (from, to, ts, exchange) {
  const config = await getConfig()
  const url = `${config.base_api}pricehistorical?fsym=${from}&tsyms=${to}&ts=${ts}&e=${exchange}`
  const datos = await fetch(url, {
    compress: false
  }).then((res) => res.json())
  return datos[from][to]
}

async function getUrlCoinImage (coin) {
  const config = await getConfig()
  return `${config.base_image}${config.coins[coin].image}`
}
async function getNameCoin (coin) {
  const config = await getConfig()
  return config.coins[coin].name
}

async function getLocale () {
  const storedLang = LocalStorage.get.item(KEY_WEB_STORE_LANG)
  if (storedLang) return storedLang

  const browserLang = (locale2 || 'en').split('-')[0]
  LocalStorage.set(KEY_WEB_STORE_LANG, browserLang)
  return browserLang
}
async function setLocale (locale) {
  LocalStorage.set(KEY_WEB_STORE_LANG, locale)
}

export default {
  setConfig,
  getSocket,
  getConfig,
  getLocale,
  setLocale,
  setRealTime,
  setExchange,
  getRealTime,
  getNameCoin,
  getHistoLast,
  getPriceInDate,
  getUrlCoinImage
}
