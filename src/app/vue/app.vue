<template>
    <div class="sign-in" v-if="isConnected && !player">
        <form @submit.prevent="signIn()">
            <input type="text" v-model="playerName" placeholder="Enter Your Name" required>
            <input type="color" v-model="playerColor">
            <button>Let's Go</button>
        </form>
    </div>
    <div class="main-window" v-else-if="isConnected">
        <the-player-list :players="players"/>
        <the-status/>
        <the-board/>
        <the-toolbar/>
        <the-chat :messages="messages" :player="player"/>
    </div>
    <div class="error" v-else>
        Loading...
    </div>
</template>

<script>
import { v1 as uuidv1 } from 'uuid';
import TheChat from './components/TheChat.vue';
import ThePlayerList from './components/ThePlayerList.vue';
import TheToolbar from './components/TheToolbar.vue';
import TheStatus from './components/TheStatus.vue';
import TheBoard from './components/TheBoard.vue';

export default {
    name: 'appRoot',
    components: {
        TheChat,
        ThePlayerList,
        TheBoard,
        TheToolbar,
        TheStatus,
    },
    data() {
        return {
            isConnected: false,
            messages: [],
            players: [],

            player: null,
            playerName: '',
            playerColor: '',
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
            this.messages.push(data);
        },

        refreshPlayers(list) {
            this.$set(this, 'players', list);
        },

        retrievePlayerData(player) {
            this.$set(this, 'player', player);
        },
    },
    methods: {
        getSavedID() {
            return localStorage.getItem('playerID');
        },
        signIn() {
            const id = 'player-' + uuidv1()
            this.player = {
                id: id,
                name: this.playerName,
                color: this.playerColor,
                score: 0,
            };
            localStorage.setItem('playerID', id);
            this.$socket.emit('sign-in', this.player);
        },
        signOut(event) {
            alert(this.player);
            this.$socket.emit('sign-out', this.player.id);
            return null;
        }
    },
    created() {
        // Register the sign off event
        window.addEventListener("beforeunload", this.signOut);
    },
    mounted() {
        const id = this.getSavedID();
        if(id) {
            this.$socket.emit('sign-in', {
                oldid: id,
            });
        }
    }
};
</script>

<style>
body {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    font-family: Sans-Serif;
}
</style>

<style scoped>
.main-window {
  width: 1500px;
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
  padding: 15px;
  display: grid;
  grid-template-columns: 200px 1fr 300px;
  grid-template-rows: 60px 600px 120px;
  grid-gap: 15px;
  grid-template-areas: "Players Status Chat" "Players Board Chat" "Players Tools Chat";
}

.chat-wrap { grid-area: Chat; }

.board-wrap { grid-area: Board; }

.player-wrap { grid-area: Players; }

.toolbar-wrap { grid-area: Tools; }

.status-wrap { grid-area: Status; }

.powerups-wrap { grid-area: Powerups; }
</style>
