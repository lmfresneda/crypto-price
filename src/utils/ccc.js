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

    MAP_NORMAL: 'TYPE_REQUEST~EXCHANGE~FROM_CURRENCY~TO_CURRENCY~FLAG_RESPONSE~PRICE~LAST_UPDATE~LAST_VOLUME~LAST_VOLUME_TO~LAST_TRADE_ID~VOLUME_24H~VOLUME_24H_TO~MASKINT',
    MAP_NOCHANGED: 'TYPE_REQUEST~EXCHANGE~FROM_CURRENCY~TO_CURRENCY~FLAG_RESPONSE~LAST_UPDATE~LAST_VOLUME~LAST_VOLUME_TO~LAST_TRADE_ID~VOLUME_24H~VOLUME_24H_TO~MASKINT',
    MAP_PRICEMULTI: {
      FLAGS: 'FLAG_RESPONSE',
      FROMSYMBOL: 'FROM_CURRENCY',
      LASTUPDATE: 'LAST_UPDATE',
      LASTVOLUME: 'LAST_VOLUME',
      LASTVOLUMETO: 'LAST_VOLUME_TO',
      MARKET: 'EXCHANGE',
      PRICE: 'PRICE',
      TOSYMBOL: 'TO_CURRENCY',
      TYPE: 'TYPE_REQUEST',
      VOLUME24HOUR: 'VOLUME_24H',
      VOLUME24HOURTO: 'VOLUME_24H_TO'
    },

    getKey (currentObject) {
      return `${currentObject.TYPE}~${currentObject.MARKET}~${currentObject.FROMSYMBOL}~${currentObject.TOSYMBOL}`
    },

    getObjectFromMessage (message) {
      const msgSplit = message.split('~')

      const fieldsChanged = CCC.CURRENCY.MAP_NORMAL.split('~')

      if (msgSplit.length <= 4) return { codeResponse: msgSplit[0] }

      let result = {}
      for (let i = 0; i < fieldsChanged.length; i++) {
        const field = fieldsChanged[i]
        const data = msgSplit[i]
        result[field] = data
      }

      if (result.FLAG_RESPONSE === CCC.CURRENCY.FLAGS.PRICEUNCHANGED.toString() &&
        Object.keys(result).length < fieldsChanged.length) {
        // hay que recalcular
        const fieldsNochanged = CCC.CURRENCY.MAP_NOCHANGED.split('~')
        result = {}
        for (let i = 0; i < fieldsNochanged.length; i++) {
          const field = fieldsNochanged[i]
          const data = msgSplit[i]
          result[field] = data
        }
      }

      return result
    },
    getObjectFromObject (obj) {
      return Object.keys(CCC.CURRENCY.MAP_PRICEMULTI).reduce((prev, now) => {
        prev[CCC.CURRENCY.MAP_PRICEMULTI[now]] = obj[now]
        return prev
      }, {})
    }

  }

}

export default CCC
