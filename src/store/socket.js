export const state = () => ({
  socketUserId: '',
  socketUserName: '',
});

export const getters = {
  socketUserId: state => state.socketUserId,
  socketUserName: state => state.socketUserName,
};

export const mutations = {
  updateSocketUserId(state, id) {
    state.socketUserId = id;
  },
  updateSocketUserName(state, socketUserName) {
    state.socketUserName = socketUserName;
  },
};
