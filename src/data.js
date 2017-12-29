import { LocalStorage } from 'quasar'
import io from 'socket.io-client'
import fetch from 'node-fetch'
import config from './assets/config'

export const KEY_WEB_STORE_REALTIME = '__REALTIME_CRYPTO_APP__'
export const KEY_WEB_STORE_CONFIG = '__CONFIG_CRYPTO_APP__'

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

async function getConfig () {
  const configStorage = LocalStorage.get.item(KEY_WEB_STORE_CONFIG)
  if (configStorage) return configStorage
  else {
    // si no la tenemos, la pedimos
    const data = await fetch(config.url_config).then((res) => res.json())
    // y la guardamos
    setConfig(data)
    return data
  }
}

function getSocket (url, event, callback, forceNew = true) {
  const socket = io(url, { forceNew })
  socket.on('m', callback)
  return socket
}

export default {
  setRealTime,
  setConfig,
  setExchange,
  getSocket,
  getRealTime,
  getConfig
}
