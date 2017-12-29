<script>
import quasarUtil from '../utils/quasar-util'
import { mapState } from 'vuex'
import {
  SET_REAL_TIME,
  FETCH_DATA_LIST,
  SET_EXCHANGE
} from '../store'

export default {
  props: ['onclose'],
  components: {
    ...quasarUtil.getQComponents()
  },
  data () {
    return {
      exchange: null,
      thisRealTime: false
    }
  },
  watch: {
    'config.default_exchange': function () {
      this.$store.commit(SET_EXCHANGE, this.config.default_exchange)
      this.$store.dispatch(FETCH_DATA_LIST)
    },
    thisRealTime () {
      this.$store.commit(SET_REAL_TIME, this.thisRealTime)
      this.$store.dispatch(FETCH_DATA_LIST)
    }
  },
  computed: {
    ...mapState(['config', 'realTime'])
  }
}
</script>

<template>
  <div>
    <!-- Header -->
    <q-toolbar slot="header" color="indigo-10" class="fixed-position">
      <q-toolbar-title>
        <span class="config-title">Configuration</span>
        <q-icon
          class="icon-close icon-white"
          @click="onclose()"
          name="close" size="2rem"/>
      </q-toolbar-title>
    </q-toolbar>

    <q-list class="settings-app">
      <div class="settings-panel">
        <div class="settings-panel-title">
          Exchange:
          <small>Change your preference exchange</small>
        </div>
        <q-list>
          <q-item class="item-exchange" tag="label" v-for="key in Object.keys(config.exchanges)" :key="key">
            <q-item-side>
              <q-radio v-model="config.default_exchange" :val="key" color="indigo-10"/>
            </q-item-side>
            <q-item-main>
              <q-item-tile label>{{ key }}</q-item-tile>
            </q-item-main>
          </q-item>
        </q-list>
      </div>

      <div class="settings-panel">
        <p>
          <q-toggle
            v-model="thisRealTime"
            left-label
            label="Real Time"
            color="indigo-10" />
        </p>
        <q-alert
          color="red"
          icon="warning"
          v-if="realTime" >
          Attention, real time can consume a lot of your data. Are you sure?
        </q-alert>
        <q-alert
          color="indigo-5"
          icon="touch_app"
          v-if="!realTime" >
          You can update data by dragging the coin list to bottom
        </q-alert>
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

  .settings-panel-title {
    margin-bottom: 10px;

    small {
      display: block;
      margin: 5px 0px;
      color: rgb(155, 155, 155);
      font-size: .7rem;
    }
  }
}
.fixed-position {
  position: fixed!important;
}
</style>
