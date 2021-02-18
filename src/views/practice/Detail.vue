<!-- practice-detail -->
<template>
  <components :is="component"></components>
</template>

<script>
import { list } from './Index.vue';

export default {
  components: {},
  data() {
    const componentName = list.find(i => i.id === `${this.$route.params.component}`).component;
    return {
      component: () => import(`./${componentName}`),
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>
<style lang="scss"></style>
