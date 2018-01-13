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

export default {
  getIconByStatus,
  getSymbol,
  getPriceFormatted
}
