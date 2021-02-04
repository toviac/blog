const post = {
  state: () => ({
    postList: [],
  }),

  getters: {
    postList: state => state.postList,
  },

  mutations: {
    updatePostList: (state, payload) => {
      state.postList = payload;
    },
  },
  namespaced: true,
};

export default post;
