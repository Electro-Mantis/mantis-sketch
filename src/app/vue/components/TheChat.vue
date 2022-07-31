<template>
    <div class="chat-wrap">
        <div class="chat-header">
            <div class="chat-header__name" :style="{color: player.color}">{{player.name}}</div>
            <div class="chat-header__score">{{player.score}}</div>
        </div>
        <div class="chat-list-wrap window-module" ref="chatlist">
            <ul class="chat-list">
                <li :class="{'chat-item': true, 'chat-item--notification': !message.player}" v-for="message in messages" :key="message.time">
                    <div v-if="message.player" class="chat-item__name" :style="{color: message.player.color}">{{message.player.name}}</div>
                    <div class="chat-item__message">{{message.message}}</div>
                </li>
            </ul>
        </div>

        <div class="chat-typing" v-if="typingString !== ''">{{typingString}}</div>
        
        <form class="chat-form" @submit.prevent="sendMessage()">
            <input class="window-module" type="text" v-model="messageInput" @input="setTypingActive" @keyup="setTypingInactive" placeholder="Type here to Guess / Chat">
        </form>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { throttle, debounce } from '../../../shared/debounce'

export default {
    name:'TheChat',

    computed: {
        ...mapState('chat', [
            'messages',
        ]),

        ...mapState('users', [
            'player',
            'players',
        ]),

        ...mapGetters('chat', [
            'messageCount',
        ]),

        ...mapGetters('users', [
            'typingPlayers',
        ]),

        typingString() {
            // If we have no typers
            if(!this.typingPlayers.length) {
                return '';
            }

            // If we only have one typer
            if(this.typingPlayers.length === 1) {
                return this.typingPlayers[0].name + ' is typing';

            // If we have under 4 typers
            } else if(typingPlayers.length < 4) {
                return this.typingPlayers.map(p => p.name).join(', ').replace(/, ([^,]*)$/, ' and $1') + ' are typing';

            // If we have more
            } else {
                return 'Several people are typing';
            }
        }
    },

    watch: {
        messageCount() {
            this.$nextTick(() => {
                this.$refs.chatlist.scrollTop = this.$refs.chatlist.scrollHeight;
            });
        }
    },

    data() {
        return {
            messageInput: '',
        };
    },

    methods: {
        sendMessage() {
            this.$socket.emit('message', {
                message: this.messageInput,
                playerID: this.player.id,
            });
            this.messageInput = '';
        },

        setTypingActive: throttle(function() {
            console.log('started typing');
            this.$socket.emit('type-start', {
                id: this.player.id,
            });
        }, 500),

        setTypingInactive: debounce(function() {
            console.log('stopped typing');
            this.$socket.emit('type-end', {
                id: this.player.id,
            });
        }, 500),
    }
}
</script>

<style scoped>
.chat-wrap {
    display: flex;
    flex-direction: column;
    height: 1fr;
    position: relative;
}

.chat-header {
    font-size: 25px;
    padding: 16px;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    background: var(--color-background);
    /* border-radius: 16px; */
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
    position: relative;
}

.chat-list-wrap {
    flex: 1;
    overflow-y: scroll;
    overflow-x: hidden;
    background: var(--color-background);
    margin-top: 0.75rem;
}


.chat-list {
    padding: 0;
    margin: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    min-height: 100%;
}

.chat-item {
    display: block;
    padding: 5px;
    padding-left: 15px;
    position: relative;
    border-top: solid 2px #ededed;
}

.chat-typing {
    padding-top: 10px;
    opacity: .5;
    font-style: italic;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 100%;
    position: absolute;
    top: 100%;
    left: 0;
}

.chat-item--notification {
    font-weight: bold;
    color: rgb(125, 125, 125);
}

.chat-item:nth-child(odd) {
    background-image: var(--background-stripes);
}

.chat-item__name {
    display: inline-block;
    font-weight: bold;
    margin-right: 0.25em;
}

.chat-item__message {
    display: inline;
}

.chat-form {
    display: flex;
    margin-top: 16px;
}

.chat-form input {
    flex: 1;
    padding: 16px;
    background: var(--color-background);
    outline: none;
}
</style>
