const socket = {
  state: () => ({
    socketUserId: '',
    socketUserName: '',
  }),

  getters: {
    socketUserId: state => state.socketUserId,
    socketUserName: state => state.socketUserName,
  },

  mutations: {
    updateSocketUserId(state, id) {
      state.socketUserId = id;
    },
    updateSocketUserName(state, socketUserName) {
      state.socketUserName = socketUserName;
    },
  },
  namespaced: true,
};

export default socket;
