<!-- 文字及背景样式 参照https://tomotoes.com/ 与 https://zhengrh.com/ -->
<template>
  <div class="blog-layout">
    <div
      class="home-cover"
      v-if="isFirst"
      :class="{ 'scroll-top': !showCover }"
      @wheel="onMouseWheel"
      @transitionend.self="coverTransitionEnd"
    >
      <div class="home-cover-container">
        <canvas class="home-background" id="fluid-canvas"></canvas>
        <div class="type-area" :style="typerAreaStyle"></div>
        <div class="arrow-wrapper fade" :class="{ in: showBtn }" @click="onMouseWheel">
          <div class="arrow arrow-1"></div>
          <div class="arrow arrow-2"></div>
        </div>
      </div>
      <svg
        class="shape"
        width="100%"
        height="100vh"
        preserveAspectRatio="none"
        viewBox="0 0 1440 800"
        xmlns:pathdata="http://www.codrops.com/"
        style="fill: rgb(41, 42, 44);"
      >
        <path
          d="M-44-50C-52.71 28.52 15.86 8.186 184 14.69 383.3 22.39 462.5 12.58 638 14 835.5 15.6 987 6.4 1194 13.86 1661 30.68 1652-36.74 1582-140.1 1512-243.5 15.88-589.5-44-50Z"
        ></path>
      </svg>
      <!-- <el-button class="scroll-btn" type="text" v-show="showBtn" @click="onMouseWheel">
        <i class="iconfont icon-arrow-down" />
      </el-button> -->
    </div>
    <div class="container" @wheel="onContainerMouseWheel">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import WebGLFluid from '@/utils/webgl-fluid-simulation.js';
import Typer from '@/utils/typer.js';
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'BlogLayout',
  components: {},
  data() {
    return {
      showCover: true,
      showBtn: false,
      // 鼠标向上滚动计数器
      wheelTop: 0,
      // 调试好的页面基础高度
      baseHeight: 1297,
      // 浏览器高度
      clientHeight: 1297,
      typeHTML: `
      <p class="large-font">Doco</p>
      <p>Do Cool</p>`,
    };
  },
  computed: {
    // 只有第一次进入页面时显示webGl动画
    ...mapGetters(['isFirst']),
    typerAreaStyle() {
      return {
        // transform: `scale(${this.clientHeight / this.baseHeight})`,
      };
    },
  },
  created() {},
  mounted() {
    this.clientHeight = window.innerHeight;
    window.onresize = () => {
      this.clientHeight = window.innerHeight;
    };
    const fluidEl = document.querySelector('#fluid-canvas');
    if (fluidEl) WebGLFluid(fluidEl);
    const el = document.querySelector('.type-area');
    Typer(el, { html: this.typeHTML }, () => {
      this.showBtn = true;
    });
  },
  beforeDestroy() {
    this.updateIsFirst(false);
  },
  methods: {
    ...mapMutations(['updateIsFirst']),
    onMouseWheel(e) {
      e.preventDefault();
      if (!this.showBtn) return;
      // 鼠标滚轮向下滚动
      if (!e.wheelDelta || e.wheelDelta < 0) {
        const el = document.querySelector('.shape path');
        el.style.animationName = 'svgAnimation';
        this.showCover = false;
      }
    },
    coverTransitionEnd() {
      this.$nextTick(() => {
        // this.updateIsFirst(false);
      });
    },
    onContainerMouseWheel(e) {
      if (e) return;
      if (this.$route.path !== '/') {
        return;
      }
      const wrapperTop = this.$refs.scrollbar.$refs.wrap.scrollTop;
      // 鼠标向上滚动 && 页面中滚动框已滚到最上
      if (e.wheelDelta > 0 && Number(wrapperTop) === 0) {
        this.wheelTop++;
      } else {
        this.wheelTop = 0;
      }
      if (this.wheelTop > 4) {
        this.$nextTick(() => {
          this.wheelTop = 0;
        });
      }
    },
  },
};
</script>

<style lang="scss">
.blog-layout {
  .fade {
    opacity: 0;
    transition: all 1s;
    transform: translateY(200px);
    &.in {
      opacity: 1;
      transform: none;
    }
  }
  .home-cover {
    z-index: 100;
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    user-select: none;
    transition: all ease-in-out 1.5s;
    &.scroll-top {
      transform: translateY(-200vh);
    }
    .home-cover-container {
      z-index: 10;
      width: 100vw;
      height: 100vh;
      // 容器与svg间有1px空白
      margin-bottom: -1px;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(30, 31, 33, 1);
    }
    .home-background {
      z-index: -1;
      position: absolute;
      width: 100vw;
      height: 100%;
    }
    .type-area {
      margin-bottom: 25px;
      // font: 200 6vw/1 "Comic Sans MS","Helvetica Neue","Microsoft Yahei","Microsoft Yahei",-apple-system,sans-serif;
      text-shadow: #452d2d 0 0 1px, #fffffb 0 0 1px, #fffffb 0 0 2px;
      color: #fff;
      font-size: 6rem;
      text-align: center;
      line-height: 1;
      animation: whiteShadow 1.5s ease-in-out infinite alternate;
      .large-font {
        font-size: 10rem;
      }
    }
    @keyframes whiteShadow {
      0% {
        text-shadow: 0 0 1px #fff, 0 0 2px #fff, 0 0 3px #fff, 0 0 5px #333, 0 0 8px #333, 0 0 9px #333, 0 0 10px #333,
          0 0 15px #333;
      }

      to {
        text-shadow: 0 0 0.5px #fff, 0 0 1px #fff, 0 0 1.5px #fff, 0 0 2px #333, 0 0 4px #333, 0 0 5px #333,
          0 0 6px #333, 0 0 8px #333;
      }
    }
    span {
      animation: letter-glow 0.7s 0s ease both;
      &:first-child {
        animation-delay: 50ms;
      }

      &:nth-child(2) {
        animation-delay: 0.1s;
      }

      &:nth-child(3) {
        animation-delay: 0.15s;
      }

      &:nth-child(4) {
        animation-delay: 0.2s;
      }

      &:nth-child(5) {
        animation-delay: 0.25s;
      }

      &:nth-child(6) {
        animation-delay: 0.3s;
      }

      &:nth-child(7) {
        animation-delay: 0.35s;
      }
    }
    // 文字从左向右发光
    @keyframes letter-glow {
      0% {
        opacity: 0;
        text-shadow: 0 0 1px hsla(0, 0%, 100%, 0.1);
      }

      66% {
        opacity: 1;
        text-shadow: 0 0 20px hsla(0, 0%, 100%, 0.9);
      }

      77% {
        opacity: 1;
      }

      to {
        opacity: 0.7;
        text-shadow: 0 0 20px hsla(0, 0%, 100%, 0.2);
      }
    }
    .arrow-wrapper {
      cursor: pointer;
      position: absolute;
      height: 3vh;
      width: 20px;
      top: 92vh;
    }
    .arrow {
      position: absolute;
      left: 3px;
      top: 3vh;
      transform-origin: 50% 50%;
      transform: translate3d(-50%, 0, 0);
      &:after,
      &:before {
        background: #fff;
        content: '';
        display: block;
        height: 3px;
        position: absolute;
        top: 0;
        left: 0;
        width: 13px;
        box-shadow: 1px 1px 20px 0 #fff;
      }
      &:before {
        transform: rotate(45deg) translateX(-10%);
        transform-origin: top left;
      }
      &:after {
        transform: rotate(-45deg) translateX(10%);
        transform-origin: top right;
      }
      &.arrow-1 {
        animation: arrow-movement 2s ease-in-out infinite;
      }
      &.arrow-2 {
        animation: arrow-movement 2s 1s ease-in-out infinite;
      }
    }
    @keyframes arrow-movement {
      0% {
        opacity: 0;
        top: 0;
      }
      70% {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    }
    svg.shape path {
      // animation: svgAnimation 1s ease-out 1 forwards;
      // animation-name: svgAnimation;
      animation-duration: 1s;
      animation-timing-function: ease-out;
      animation-iteration-count: 1;
      animation-fill-mode: forwards;
    }
    @keyframes svgAnimation {
      0% {
        d: path(
          'M-44-50C-52.71 28.52 15.86 8.186 184 14.69 383.3 22.39 462.5 12.58 638 14 835.5 15.6 987 6.4 1194 13.86 1661 30.68 1652-36.74 1582-140.1 1512-243.5 15.88-589.5-44-50Z'
        );
      }
      100% {
        d: path(
          'M -44,-50 C -137.1,117.4 67.86,445.5 236,452 435.3,459.7 500.5,242.6 676,244 873.5,245.6 957,522.4 1154,594 1593,753.7 1793,226.3 1582,-126 1371,-478.3 219.8,-524.2 -44,-50 Z'
        );
      }
    }
  }
  .container {
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
  }
}
</style>
