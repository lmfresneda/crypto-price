<script>
import quasarUtil from '../utils/quasar-util'
import { mapState } from 'vuex'
import { types } from '../store'
import data from '../data'

export default {
  props: ['onclose'],
  components: {
    ...quasarUtil.getQComponents()
  },
  data () {
    return {
      exchange: null,
      defaultLanguage: ''
    }
  },
  beforeDestroy () {
    this.$store.commit(types.SET_VIEW_CHILDREN, false)
  },
  async beforeMount () {
    this.thisRealTime = this.realTime
    this.defaultLanguage = await data.getLocale()
  },
  watch: {
    async defaultLanguage () {
      await data.setLocale(this.defaultLanguage)
      this.$i18n.locale = this.defaultLanguage
    },
    'config.default_exchange': function () {
      this.$store.commit(types.SET_EXCHANGE, this.config.default_exchange)
      this.$store.dispatch(types.FETCH_DATA_LIST)
    }
  },
  computed: {
    ...mapState(['config', 'realTime'])
  },
  methods: {
    closeConfig () {
      this.$router.go(-1)
    },
    changeRealTime () {
      this.$store.commit(types.SET_REAL_TIME, !this.realTime)
      this.$store.dispatch(types.FETCH_DATA_LIST)
    }
  }
}
</script>

<template>
  <div>
    <!-- Header -->
    <q-toolbar slot="header" color="indigo-10" class="fixed-position" style="z-index: 999;">
      <q-toolbar-title>
        <span class="config-title">{{ $t('configuration.title') }}</span>
        <q-icon
          class="icon-close icon-white"
          @click="closeConfig()"
          name="close" size="2rem"/>
      </q-toolbar-title>
    </q-toolbar>

    <q-list class="settings-app">

      <!-- Real time -->
      <div class="settings-panel">
        <p>
          <q-toggle
            :value.sync="realTime"
            left-label
            :label="$t('realtime')"
            @focus="changeRealTime"
            color="indigo-10" />
        </p>
        <q-alert
          color="red"
          icon="warning"
          v-if="realTime" >
          {{ $t('configuration.advice_realtime') }}
        </q-alert>
        <q-alert
          color="indigo-5"
          icon="touch_app"
          v-if="!realTime" >
          {{ $t('configuration.advice_dragging') }}
        </q-alert>
      </div>

      <!-- Lenguage -->
      <div class="settings-panel">
        <div class="settings-panel-title">
          {{ $t('languages.title') }}:
        </div>
        <q-list>
          <q-item class="item-exchange" tag="label" v-for="key in ['en', 'es', 'fr', 'it', 'de']" :key="key">
            <q-item-side>
              <q-radio v-model="defaultLanguage" :val="key" color="indigo-10"/>
            </q-item-side>
            <q-item-main>
              <q-item-tile label>{{ $t(`languages.${key}`) }}</q-item-tile>
            </q-item-main>
          </q-item>
        </q-list>
      </div>

      <!-- Exchange -->
      <div class="settings-panel">
        <div class="settings-panel-title">
          {{ $t('configuration.exchange') }}:
          <small>{{ $t('configuration.change_exchange') }}</small>
        </div>
        <q-list>
          <q-item class="item-exchange" tag="label" v-for="key in Object.keys(config.exchanges).sort()" :key="key">
            <q-item-side>
              <q-radio v-model="config.default_exchange" :val="key" color="indigo-10"/>
            </q-item-side>
            <q-item-main>
              <q-item-tile label>{{ key }}</q-item-tile>
            </q-item-main>
          </q-item>
        </q-list>
      </div>

      <!-- Información -->
      <div class="settings-panel" id="settings-panel-advice">
        <div class="settings-panel-title">
          {{ $t('configuration.advice') }}:
        </div>
        <q-alert
          color="dark"
          style="font-size: .8em"
          icon="info" >
          {{ $t('configuration.advice_info') }}
        </q-alert>
      </div>

      <!-- Agradecimientos -->
      <div class="settings-panel settings-panel-thanks">
        <p>Built with <a href="http://quasar-framework.org" target="blank">Quasar Framework</a></p>
        <p>Data thanks to <a href="https://www.cryptocompare.com" target="blank">CryptoCompare</a></p>
      </div>

      <!-- Legal -->
      <div class="settings-panel settings-panel-legal">
        <p>{{ $t('configuration.advice_relation') }}</p>
        <p>{{ $t('configuration.advice_quasar') }}</p>
        <p>{{ $t('configuration.advice_cryptocompare') }}</p>
      </div>
    </q-list>
  </div>
</template>

<style scoped lang="scss">
.item-exchange {
  min-height: 30px;
  padding: 4px 16px;
}
.settings-app {
  padding: 10px;
}
.settings-panel {
  margin: 20px 0px;

  &:first-child {
    margin: 0px;
    margin-top: 50px;
  }

  &-title {
    margin-bottom: 10px;

    small {
      display: block;
      margin: 5px 0px;
      color: rgb(155, 155, 155);
      font-size: .7rem;
    }
  }
}

.settings-panel-thanks {
  margin-top: 30px;
  > p {
    text-align: center;
    font-size: .8em;
    line-height: 9px;
  }
}
.settings-panel-legal {
  margin-bottom: 60px;
  > p {
    font-size: .6em;
    line-height: 11px;
    color: #9c9c9c;
    margin-bottom: 2px;
  }
}
</style>
