import Vue from 'vue';
import Vuex from 'vuex';
import post from './post';
import socket from './socket';

const state = () => ({
  isFirst: true,
});

const getters = {
  isFirst: state => state.isFirst,
};

const mutations = {
  updateIsFirst: (state, payload) => {
    state.isFirst = payload;
  },
};

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    post,
    socket,
  },
  state,
  getters,
  mutations,
});

export default store;
