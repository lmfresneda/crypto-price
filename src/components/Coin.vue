<script>
import quasarUtil from '../utils/quasar-util'
import { mapState, mapGetters } from 'vuex'
import { types } from '../store'

export default {
  props: ['from', 'to'],
  name: 'coin',
  components: {
    ...quasarUtil.getQComponents()
  },
  data () {
    return {}
  },
  computed: {
    ...mapState(['config', 'coinIsView', 'realTime']),
    ...mapGetters(['getDataCoinsList']),
    getItem () {
      const coin = this.getDataCoinsList.find(c => c.CODE === `${this.from}${this.to}`)
      return coin
    }
  },
  methods: {
    closeCoin () {
      this.$store.commit(types.SET_VIEW_CHILDREN, false)
      this.$router.push({ name: 'CoinList' })
    }
  }
}
</script>

<template>
  <div v-if="coinIsView">
    <!-- Header -->
    <q-toolbar slot="header" color="indigo-10">
      <q-toolbar-title>
        <span class="config-title">{{ getItem.FROM_CURRENCY }}/{{ getItem.TO_CURRENCY }}</span>
        <q-icon
          class="icon-close icon-white"
          @click="closeCoin()"
          name="close" size="2rem"/>
      </q-toolbar-title>
    </q-toolbar>

    {{ getItem }}
  </div>
</template>

<style lang="scss" scoped>

</style>

