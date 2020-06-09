<template>
    <div class="chat-wrap">
        <div class="chat-header">
            <div class="chat-header__name" :style="{color: player.color}">{{player.name}}</div>
            <div class="chat-header__score">{{player.score}}</div>
        </div>
        <div class="chat-list-wrap" ref="chatlist">
            <ul class="chat-list">
                <li :class="{'chat-item': true, 'chat-item--notification': !message.player}" v-for="message in messages" :key="message.time">
                    <div v-if="message.player" class="chat-item__name" :style="{color: message.player.color}">{{message.player.name}}</div>
                    <div class="chat-item__message">{{message.message}}</div>
                </li>
            </ul>
        </div>

        <div class="chat-typing" v-if="typingString !== ''">{{typingString}}</div>
        
        <form class="chat-form" @submit.prevent="sendMessage()">
            <input type="text" v-model="messageInput" @input="setTypingActive" @keyup="setTypingInactive">
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
    border: 2px solid;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    height: 1fr;
}

.chat-header {
    font-size: 25px;
    padding: 15px;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    border-bottom: 2px solid;
}

.chat-list-wrap {
    flex: 1;
    overflow-y: scroll;
    overflow-x: hidden;
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

.chat-typing,
.chat-item {
    display: block;
    padding: 5px;
    padding-left: 15px;
    position: relative;
}

.chat-typing {
    padding-bottom: 10px;
    opacity: .5;
    font-style: italic;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 100%;
}

.chat-item--notification {
    font-weight: bold;
    color: rgb(125, 125, 125);
}

.chat-item:nth-child(odd) {
    background-color: rgba(0,0,0,.05);
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
    border-top: 2px solid;
}

.chat-form input {
    flex: 1;
    padding: 5px;
    border: 0;
    border-radius: 0;
}
</style>
