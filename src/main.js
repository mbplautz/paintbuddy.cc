// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  // All app-level data that needs to be bound must be declared here first
  data: () => ({
    paint: {
      options: {
        color: '',
        lineWidth: 0
      },
      state: {
        dirty: false,
        canRedo: false
      }
    }
  })
});