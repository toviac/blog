export const state = () => ({
  postList: [],
});

export const getters = {
  postList: state => state.postList,
};

export const mutations = {
  updatePostList: (state, payload) => {
    state.postList = payload;
  },
};
