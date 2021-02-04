export const state = () => ({
  isFirst: true,
});

export const getters = {
  isFirst: state => state.isFirst,
};

export const mutations = {
  updateIsFirst: (state, payload) => {
    state.isFirst = payload;
  },
};
