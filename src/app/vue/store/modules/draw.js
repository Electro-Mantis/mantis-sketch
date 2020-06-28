import Vue from 'vue';
import Vuex from 'vuex';

export default {
    namespaced: true,
    state: {
        color: '#000000',
        size: 10,
        minSize: 2,
        maxSize: 60,
        toolType: 'brush',
    },

    mutations: {
        setColor(state, payload) {
            Vue.set(state, 'color', payload);
        },
        setSize(state, payload) {
            Vue.set(state, 'size', Math.min(Math.max(payload, state.minSize), state.maxSize));
        },
        setToolType(state, payload) {
            Vue.set(state, 'toolType', payload);
        },
    }
};
