<script>
import quasarUtil from '../utils/quasar-util'
import { mapState } from 'vuex'
import { SET_VIEW_COIN } from '../store'

export default {
  props: ['coin'],
  name: 'coin',
  components: {
    ...quasarUtil.getQComponents()
  },
  data () {
    return {}
  },
  computed: {
    ...mapState(['config', 'coinIsView']),
    getItem () {
      return this.$route.query
    }
  },
  methods: {
    getIconByStatus (status) {
      return ({
        0: 'remove',
        4: 'remove',
        1: 'arrow_drop_up',
        2: 'arrow_drop_down'
      })[status]
    },
    getSymbol (currency) {
      return ({
        'USD': '$',
        'EUR': '€'
      })[currency]
    },
    getPriceFormatted (price) {
      return parseFloat(parseFloat(price).toFixed(8))
    },
    closeCoin () {
      this.$store.commit(SET_VIEW_COIN, false)
      this.$router.go(-1)
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

