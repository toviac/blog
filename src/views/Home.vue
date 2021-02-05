<template>
  <div class="default-layout">
    <nav-bar></nav-bar>
    <el-scrollbar id="scroll-box" ref="scrollbar" class="scroll-bar" wrap-style="overflow-x: hidden;">
      <div class="grid-layout">
        <transition name="fade-transform" mode="out-in">
          <router-view />
        </transition>
        <side-list></side-list>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import SideList from '@/components/SideList.vue';

export default {
  name: 'DefaultLayout',
  components: {
    NavBar,
    SideList,
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {},
};
</script>

<style lang="scss">
.default-layout {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  height: 100vh;
  background-color: #fff;
  .scroll-bar {
    flex-grow: 1;
    width: 100%;
    .el-scrollbar__wrap {
      // 元素自带-17px, don't know why
      // 为了隐藏系统scrollbar, 下面的样式firefox,ie兼容性不佳
      margin-bottom: 0 !important;
      margin-right: 0 !important;
      &::-webkit-scrollbar {
        display: none;
      }
    }
    .el-scrollbar__view {
      // scrollbar最内层元素
      padding: 10px;
      .grid-layout {
        width: 1040px;
        max-width: 100%;
        margin: 0 auto;
        display: grid;
        grid-template-columns: calc(100% - 320px) 300px;
        grid-column-gap: 20px;
        grid-template-areas: 'main side';
        .side-list {
          grid-area: side;
        }
      }
    }
  }
  .fade-transform-leave-active,
  .fade-transform-enter-active {
    transition: all 0.5s;
  }
  .fade-transform-enter {
    opacity: 0;
    transform: translateX(-20px);
  }
  .fade-transform-leave-to {
    opacity: 0;
    transform: translateX(20px);
  }
}
</style>
