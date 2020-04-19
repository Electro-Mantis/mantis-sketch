<template>
  <div class="main-window">
    <p v-if="isConnected">We're connected to the server!</p>
    <p>Message from server: "{{ socketMessage }}"</p>
    <button @click="pingServer()">Ping Server</button>
  </div>
</template>
<script>
export default {
  name: 'appRoot',
  data() {
    return {
      title: 'Hello World',
      isConnected: false,
      socketMessage: ''
    };
  },

  sockets: {
    connect() {
      this.isConnected = true;
    },

    disconnect() {
      this.isConnected = false;
    },

    messageChannel(data) {
      this.socketMessage = data;
    }
  },

  methods: {
    pingServer() {
      this.$socket.emit('pingServer', 'PING!');
    }
  }
};
</script>
