import Vue from 'vue';
import Vuex from 'vuex';

// Modules
import chat from './modules/chat';
import users from './modules/users';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        chat,
        users,
    },
});
