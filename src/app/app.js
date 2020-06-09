import Vue from 'vue';
import Vuex from 'vuex';
import VueSocketIO from 'vue-socket.io';

import App from './vue/app.vue';
import store from './vue/store';

const url = window.location;
const connectionUrl = url.protocol + '//' + url.host

Vue.use(Vuex);

Vue.use(
  new VueSocketIO({
    debug: process.env.NODE_ENV === 'development',
    connection: connectionUrl,
    vuex: {
      store,
      actionPrefix: 'SOCKET_',
    }
  })
);

new Vue({
  el: '#app',
  store,
  render(output) {
    return output(App);
  }
});

// Needed for Hot Module Replacement
if(typeof(module.hot) !== 'undefined') {
  module.hot.accept() // eslint-disable-line no-undef  
}
