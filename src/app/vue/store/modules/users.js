import Vue from 'vue';
import Vuex from 'vuex';

export default {
    namespaced: true,

    state: {
        player: {},
        players: [],
    },

    mutations: {
        $_updatePlayers(state, payload) {
            Vue.set(state, 'players', payload);
        },

        $_updatePlayer(state, payload) {
            Vue.set(state, 'player', payload);
        },
    },

    getters: {
        typingPlayers(state) {
            return state.players.filter(p => p.typing);
        },
    },

    actions: {
        SOCKET_refreshPlayers(context, payload) {
            context.commit('$_updatePlayers', payload);
        },

        SOCKET_retrievePlayerData(context, payload) {
            context.commit('$_updatePlayer', payload);
        },
    }
};
