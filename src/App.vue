<script>
import { mapState } from 'vuex'
import quasarUtil from './utils/quasar-util'
import { types } from './store'

/*
 * Root component
 */
export default {
  name: 'app',
  components: {
    ...quasarUtil.getQComponents()
  },
  data () {
    return {
      thisRealTime: false
    }
  },
  beforeMount () {
    this.thisRealTime = this.realTime
  },
  methods: {
    changeRealTime () {
      this.$store.commit(types.SET_REAL_TIME, !this.realTime)
      this.$store.dispatch(types.FETCH_DATA_LIST)
    }
  },
  computed: {
    ...mapState(['data', 'realTime', 'error', 'config'])
  }
}
</script>

<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
    <q-layout
      ref="layout"
      view="lHh Lpr fFf">
      <router-view />
      <!-- Footer -->
      <q-toolbar slot="footer" color="indigo-10">
        <q-toolbar-title>
          <q-alert
            class="alert-footer"
            color="red"
            icon="warning"
            v-if="realTime" >
            {{ $t('realtime_active') }}
          </q-alert>
          <span slot="subtitle" v-if="data.socket && !error">
            <q-icon name="fiber_manual_record" color="green" /> {{ $t('connectedto') }}
              <a style="color: white" target="blank" href="https://www.cryptocompare.com">CryptoCompare</a>
          </span>
          <span slot="subtitle" v-else>
            <q-icon name="fiber_manual_record" color="red" /> {{ $t('disconnected') }}
          </span>
          <span slot="subtitle" style="float: right;">
            <q-toggle :value="realTime" color="deep-orange-13" @focus="changeRealTime"/></span>
        </q-toolbar-title>
      </q-toolbar>
    </q-layout>
  </div>
</template>

<style lang="scss">
.no-decoration {
  text-decoration: none;
}

.icon-white {
  color: white;
}
.icon-close {
  float: right;
  margin-right: -10px;
}
.config-title {
  display: inline-block;
  margin-top: 5px;
}
.alert-footer {
  position: fixed;
  bottom: 50px;
  left: 0;
  width: 100%;
  opacity: .9;
  font-size: .9rem;

  .q-alert-icon, .q-alert-content {
    padding: 0.4rem;
  }
}

.fixed-position {
  position: fixed!important;
}
.crypto-logo {
  width: 30px;
  vertical-align: middle;
  margin-left: -13px;
}
</style>
