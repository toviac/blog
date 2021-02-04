<!-- practice-detail -->
<template>
  <components :is="component"></components>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      component: () => import(`./${this.$route.params.component}`),
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
