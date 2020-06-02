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
        <form class="chat-form" @submit.prevent="sendMessage()">
            <input type="text" v-model="messageInput">
        </form>
    </div>
</template>

<script>
export default {
    name:'TheChat',
    props: {
        messages: {
            type: Array,
            required: true,
        },
        player: {
            type: Object,
            required: true,
        }
    },

    computed: {
        messageCount() {
            return this.messages.length;
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
                player: this.player,
            });
            this.messageInput = '';
        }
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

.chat-item {
    display: block;
    padding: 5px;
    padding-left: 15px;
    position: relative;
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
