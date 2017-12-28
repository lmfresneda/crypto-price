const CCC = {

  STATIC: {

    TYPE: {
      TRADE: '0',
      FEEDNEWS: '1',
      CURRENT: '2',
      LOADCOMPLATE: '3',
      COINPAIRS: '4',
      CURRENTAGG: '5',
      TOPLIST: '6',
      TOPLISTCHANGE: '7',
      ORDERBOOK: '8',
      FULLORDERBOOK: '9',
      ACTIVATION: '10',

      TRADECATCHUP: '100',
      NEWSCATCHUP: '101',

      TRADECATCHUPCOMPLETE: '300',
      NEWSCATCHUPCOMPLETE: '301',

      TOO_MANY_CONNECTIONS: '401'
    }

  },

  CURRENCY: {

    FLAGS: {
      PRICEUP: 1,
      PRICEDOWN: 2,
      PRICEUNCHANGED: 4,
      1: 'PRICEUP',
      2: 'PRICEDOWN',
      4: 'PRICEUNCHANGED'
    },

    getKey (currentObject) {
      return `${currentObject.TYPE}~${currentObject.MARKET}~${currentObject.FROMSYMBOL}~${currentObject.TOSYMBOL}`
    },

    getObject (message, mapping) {
      const msgSplit = message.split('~')
      const fieldsSplit = mapping.split('~')
      if (msgSplit.length <= 4) return { codeResponse: msgSplit[0] }

      const result = {}
      for (let i = 0; i < fieldsSplit.length; i++) {
        const field = fieldsSplit[i]
        const data = msgSplit[i]
        result[field] = data
      }
      return result
    }

  }

}

export default CCC
