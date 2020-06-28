<template>
    <div class="sign-in" v-if="isConnected && !player">
        <form @submit.prevent="signIn()" class="form form--register">
            <div class="avatar-wrap">
                <canvas-avatar 
                    :brush-color="color"
                    :brushSize="size"
                    :size-x="128"
                    :size-y="128"
                    v-model="playerAvatar"
                />
                <div class="label">Draw your Avatar</div>
            </div>
            <tool-colorpicker/>
            <tool-brushsize/>
            <div class="field">
                <label for="player-name">Player Name</label>
                <input id="player-name" type="text" v-model="playerName" placeholder="Enter Your Name" required>
            </div>
            
            <button class="button" type="submit">Let's Go</button>
        </form>
    </div>
    <div class="main-window" v-else-if="isConnected">
        <the-player-list :players="players"/>
        <the-powerups/>
        <the-status/>
        <the-board/>
        <the-toolbar/>
        <the-chat/>
    </div>
    <div class="error" v-else>
        Loading...
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
import { v1 as uuidv1 } from 'uuid';
import { randomColor } from '../util/colors';

import TheChat from './components/TheChat.vue';
import ThePlayerList from './components/ThePlayerList.vue';
import TheToolbar from './components/TheToolbar.vue';
import TheStatus from './components/TheStatus.vue';
import TheBoard from './components/TheBoard.vue';
import ThePowerups from './components/ThePowerups.vue';

import CanvasAvatar from './components/canvas/canvas-avatar.vue';

import ToolColorpicker from './components/tools/tool-colorpicker.vue';
import ToolBrushsize from './components/tools/tool-brushsize.vue';

export default {
    name: 'appRoot',
    components: {
        TheChat,
        ThePlayerList,
        TheBoard,
        TheToolbar,
        TheStatus,
        ThePowerups,

        CanvasAvatar,

        ToolColorpicker,
        ToolBrushsize,
    },
    data() {
        return {
            isConnected: false,
            players: [],

            player: null,
            playerName: '',
            playerAvatar: null,

            brushSize: 10,
        };
    },
    computed: {
        color: {
            get() {
                return this.$store.state.draw.color;
            },
            set(value) {
                this.setColor(value);
            },
        },
        size: {
            get() {
                return this.$store.state.draw.size;
            },
            set(value) {
                this.setSize(value);
            },
        }
    },
    sockets: {
        connect() {
            this.isConnected = true;
        },

        disconnect() {
            this.isConnected = false;
        },

        retrievePlayerData(player) {
            this.$set(this, 'player', player);
        },
    },
    methods: {
        ...mapMutations('draw', [
            'setSize',
            'setColor',
        ]),
        getSavedID() {
            return localStorage.getItem('playerID');
        },
        signIn() {
            const id = 'player-' + uuidv1()
            this.player = {
                id: id,
                name: this.playerName,
                color: this.color,
                avatar: this.playerAvatar,
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

        this.playerColor = randomColor();
    }
};
</script>

<style>
:root {
    --c--black:#0c120c;
    --c--gray: #4e504b;
    --c--gray-dk: #343532;
    --c--white: #eceafa;
    --c--green: #8fb339;
    --c--green-lt: #b7ce63;

    --color-background: var(--c--gray-dk);
    --color-font: var(--c--white);
    --color-primary: var(--c--green);
    --color-secondary: var(--c--green-lt);
}

html {
    padding: 0;
}

body {
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: Sans-Serif;
    height: 100vh;
    background: var(--c--gray);
    color: var(--color-font);
}

img,
canvas {
    background: #fff;
}

canvas {
    cursor: crosshair;
}

input,
select,
textarea {
    background: transparent;
    border: solid 2px;
    color: inherit;
    font-size: 1em;
    border: solid 2px transparent;
    transition: color .25s, border-color .25s, background-color .25s;
}

input:focus,
select:focus,
textarea:focus {
    border-color: var(--color-secondary); 
}

.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0,0,0,0);
    border: 0;
}

.button {
    background: transparent;
    padding: 1em;
    border-radius: 5px;
    color: inherit;
    font-weight: bold;
    border: 0;
    box-shadow: 2px 2px 4px rgba(0,0,0,.25);
    background: var(--color-background);
    color: var(--color-font);
    cursor: pointer;
    border: solid 2px transparent;
    transition: color .25s, border-color .25s, background-color .25s;
}

.button svg{
    opacity: .5;
}

.button.active {
    background: var(--color-primary);
    color: var(--color-background);
}

.button:hover,
.button:focus,
.button:active,
.button.active {
    outline: none;
    border-color: var(--color-secondary);
}

.button.active svg {
    opacity: 1;
}

*::-webkit-scrollbar {
    width: 2px;
}

*::-webkit-scrollbar-thumb {
    background: transparent;
}

*:hover::-webkit-scrollbar-thumb {
    background: currentColor;
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
  grid-template-columns: 250px 1fr 350px;
  grid-template-rows: 60px 600px 125px;
  grid-template-areas: "Players Status Chat" "Players Board Chat" "Powerups Tools Chat";
}

.chat-wrap { grid-area: Chat; }

.board-wrap { grid-area: Board; }

.player-wrap { grid-area: Players; }

.toolbar-wrap { grid-area: Tools; }

.status-wrap { grid-area: Status; }

.powerups-wrap { grid-area: Powerups; }

.form--register {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.form--register input {
    margin-left: 15px;
}

.form--register .field {
    margin-top: 15px;
    display: flex;
    align-items: center;
}

.form--register .avatar-canvas {
    margin-bottom: 8px;
}

.form--register .avatar-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 1em;
}

.field input[type='text'] {
    border: 0;
    border-bottom: 2px solid;
    padding: 0;
    padding-bottom: 0.5em;
}

.field input[type='color'] {
    width: 1.5em;
    height: 1.5em;
    border-radius: 100px;
    overflow: hidden;
    padding: 0;
}

.field + .button {
    margin-top: 1em;
}

.field__value {
    margin-left: 8px;
}
</style>
