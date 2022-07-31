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
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;700&display=swap');

:root {
    --c--black:#0c120c;
    --c--gray: #5c6880;
    --c--gray-dk: #2d3e64;
    --c--white: #eceafa;

    --color-background: white;
    --color-module: white;
    --color-border: #28300a;
    --color-font: #28300a;
    --color-primary: #bada55;
    --color-secondary: #28300a;

    --background-stripes: repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 10px,
        #ededed 10px,
        #ededed 11px,
        transparent 12px
    );
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
    background-color: var(--color-background);
    font-family: 'IBM Plex Mono', monospace;
    box-shadow: inset 0 0 0 10px var(--color-border);
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
    border: solid 2px var(--color-border);
    color: inherit;
    font-size: 1em;
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
    color: inherit;
    font-weight: bold;
    border: solid 2px var(--color-border);
    background: var(--color-background);
    color: var(--color-font);
    cursor: pointer;
}

.button.active {
    background: var(--color-border);
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

input[type=range] {
  -webkit-appearance: none;
  margin: 18px 0;
  width: 100%;
  border: 0;
}
input[type=range]::-webkit-slider-runnable-track {
  width: 100%;
  height: .5rem;
  cursor: pointer;
  background: var(--color-border);
}
input[type=range]::-webkit-slider-thumb {
  box-shadow: 2px 2px var(--color-border);
  border: 2px solid var(--color-border);
  height: 1.5rem;
  width: .75rem;
  background: var(--color-background);
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -.5rem;
}
input[type=range]::-moz-range-track {
  width: 100%;
  height: .5rem;
  cursor: pointer;
  background: var(--color-border);
}
input[type=range]::-moz-range-thumb {
  box-shadow: 2px 2px var(--color-border);
  border: 2px solid var(--color-border);
  height: 1.5rem;
  width: .75rem;
  background: var(--color-background);
  cursor: pointer;
  appearance: none;
  margin-top: -.5rem;
  border-radius: 0;
}

.window-module {
    background-color: var(--color-module);
    border: solid 2px var(--color-border);
    background-image: var(--background-stripes);
    box-shadow: .25rem .25rem 0 var(--color-border);
}
</style>

<style scoped>
.main-window {
  width: 1300px;
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
  padding: 1rem;
  gap: 1rem;
  display: grid;
  grid-template-columns: 250px 1fr 300px;
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
