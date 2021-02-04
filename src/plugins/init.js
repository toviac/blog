export default ({ store, $axios }) => {
  let list = store.getters['post/postList'];
  if (!list.length) {
    $axios.$get('/api/post/list').then(data => {
      list = data.list;
      store.commit('post/updatePostList', list);
    });
  }
};
