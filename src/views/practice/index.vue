<template>
  <div class="practice-index">
    <article-card v-for="item in list" :key="item.id" :item="item" @click.native="cardClick(item.id)"> </article-card>
  </div>
</template>

<script>
import ArticleCard from '@/components/ArticleCard.vue';

export default {
  components: {
    ArticleCard,
  },
  data() {
    return {
      // 练习列表
      list: [
        {
          author: 'admin',
          createTime: '2020-04-02',
          id: 'wowToken',
          title: '魔兽世界怀旧服: 时光徽章价格曲线',
          updateTime: '2020-04-02',
        },
        {
          author: 'admin',
          createTime: '2019-03-31',
          id: 'tree',
          title: 'Canvas绘制树形图',
          updateTime: '2019-03-31',
        },
        {
          author: 'admin',
          createTime: '2019-02-24',
          id: 'repeater',
          title: '人类的本质',
          updateTime: '2019-02-24',
        },
        {
          author: 'admin',
          createTime: '2018-01-28',
          id: 'colorfulballs',
          title: '绚丽小球',
          updateTime: '2019-01-28',
        },
      ],
    };
  },
  methods: {
    cardClick(id) {
      this.$router.push(`/practice/${id}`);
    },
  },
};
</script>

<style lang="scss"></style>
