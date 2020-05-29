import Vue from 'vue';
import App from './vue/app.vue';
import VueSocketIO from 'vue-socket.io';

Vue.use(
  new VueSocketIO({
    debug: true,
    connection: 'http://localhost:8080'
  })
);

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
