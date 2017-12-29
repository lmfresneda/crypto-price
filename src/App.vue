<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
/*
 * Root component
 */
export default {}
</script>

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
</style>
