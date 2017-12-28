<script>
import {
  QItemSeparator, QItem, QItemSide, QItemMain
} from 'quasar'
export default {
  props: ['item'],
  components: {
    QItemSeparator, QItem, QItemSide, QItemMain
  },
  data () {
    return {}
  }
}
</script>

<template>
  <div>
    <q-item>{{ item.CODE }}</q-item>
    <q-item-separator />
  </div>
</template>

<style>
</style>
