<template>
  <div class="blog-page">
    <article-card v-for="item in postList" :key="item.id" :item="item" @click.native="cardClick(item.id)">
    </article-card>
  </div>
</template>

<script>
import ArticleCard from '@/components/ArticleCard.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    ArticleCard,
  },
  async asyncData({ $axios, store }) {
    if (!store.getters['post/postList'].length) {
      const { list } = await $axios.$get('/api/post/list');
      store.commit('post/updatePostList', list);
    }
    return {};
  },
  computed: {
    ...mapGetters('post', ['postList']),
  },
  methods: {
    cardClick(id) {
      this.$router.push(`/blog/${id}`);
    },
  },
};
</script>

<style lang="scss">
.blog-page {
  padding-bottom: 10px;
}
</style>
