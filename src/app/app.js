import Vue from 'vue';
import App from './vue/app.vue';
import VueSocketIO from 'vue-socket.io';

const url = window.location;
const connectionUrl = url.protocol + '//' + url.host

Vue.use(
  new VueSocketIO({
    debug: process.env.NODE_ENV === 'development',
    connection: connectionUrl,
  })
);


console.log('env', process.env.NODE_ENV);

new Vue({
  el: '#app',
  render(output) {
    return output(App);
  }
});

// Needed for Hot Module Replacement
if(typeof(module.hot) !== 'undefined') {
  module.hot.accept() // eslint-disable-line no-undef  
}
