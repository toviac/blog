<template>
  <div class="blog-page">
    <article-card v-for="item in postList" :key="item.id" :item="item" @click.native="cardClick(item.id)">
    </article-card>
  </div>
</template>

<script>
import ArticleCard from '@/components/ArticleCard.vue';
import { mapGetters, mapMutations } from 'vuex';

export default {
  components: {
    ArticleCard,
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters('post', ['postList']),
  },
  created() {
    this.getList();
  },
  methods: {
    ...mapMutations('post', ['updatePostList']),
    async getList() {
      if (!this.postList.length) {
        const { list } = await this.$axios.$get('/api/post/list');
        this.updatePostList(list);
      }
    },
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
