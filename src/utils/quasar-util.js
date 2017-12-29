import * as quasar from 'quasar'

function getQComponents () {
  return Object.keys(quasar)
    .filter(k => k.indexOf('Q') === 0)
    .map((k) => {
      quasar[k].componentName = k
      return quasar[k]
    })
    .reduce((prev, now) => {
      prev[now.componentName] = now
      return prev
    }, {})
}

function getDateUtil () {
  return quasar.date
}

export default {
  getQComponents,
  getDateUtil
}
