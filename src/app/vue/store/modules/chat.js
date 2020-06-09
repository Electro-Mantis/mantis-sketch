import Vue from 'vue';
import Vuex from 'vuex';

export default {
    namespaced: true,

    state: {
        messages: [],
    },

    mutations: {
        $_pushMessage(state, payload) {
            state.messages.push(payload);
        }
    },

    getters: {
        messageCount(state) {
            return state.messages.length;
        },
    },

    actions: {
        SOCKET_messageChannel(context, payload) {
            context.commit('$_pushMessage', payload);
        }
    },
}
