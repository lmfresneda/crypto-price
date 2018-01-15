import quasarUtil from './utils/quasar-util'

function getIconByStatus (status) {
  return ({
    0: 'remove',
    4: 'remove',
    1: 'arrow_drop_up',
    2: 'arrow_drop_down'
  })[status]
}

function getSymbol (currency) {
  return ({
    'USD': '$',
    'EUR': '€'
  })[currency]
}

function getPriceFormatted (price) {
  return parseFloat(parseFloat(price).toFixed(8))
}

function formatTsToHumanDate (ts) {
  if (ts.toString().length === 10) ts = parseInt(ts) * 1000
  return quasarUtil.getDateUtil().formatDate(ts, 'DD-MM-YY HH:mm:ss')
}

export default {
  getIconByStatus,
  getSymbol,
  getPriceFormatted,
  formatTsToHumanDate
}
