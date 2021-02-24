<!-- 你画我猜: 画板 -->
<template>
  <div class="drawing-board">
    <!-- <div class="msg"></div> -->
    <div class="msg">
      <span>{{ message }}</span>
      <el-button v-if="this.keyWord || !this.userName" size="mini" @click="btnClick">{{ btnTxt }}</el-button>
    </div>
    <canvas
      id="board-canvas"
      :width="canvasWidth"
      :height="canvasHeight"
      style="border: 1px solid #999;"
      @mousedown="onMouseDown"
      @mouseup="onMouseUp"
      @mouseout="onMouseUp"
      @mousemove="throttleMouseMove"
      @touchstart="onMouseDown"
      @touchend="onMouseUp"
      @touchcancel="onMouseUp"
      @touchmove="throttleMouseMove"
    ></canvas>
  </div>
</template>

<script>
import throttle from 'lodash.throttle';

export default {
  props: {
    keyWord: {
      type: String,
      default: '',
    },
    userName: {
      type: String,
      default: '',
    },
  },
  components: {},
  data() {
    return {
      ctx: null,
      canvas: null,
      canvasWidth: 500,
      canvasHeight: 500,
      current: {
        x: 0,
        y: 0,
        color: '#000000',
      },
      drawing: false,
    };
  },
  computed: {
    message() {
      if (this.keyWord) return this.keyWord;
      if (this.userName) return `${this.userName} is drawing...`;
      return 'Game is not started';
    },
    btnTxt() {
      if (this.keyWord) return 'Clear';
      return 'Start';
    },
  },
  watch: {},
  created() {},
  mounted() {
    this.initCanvas();
  },
  methods: {
    btnClick() {
      if (!this.keyWord && !this.userName) {
        this.$emit('start-game');
        return;
      }
      return this.$emit('clear');
    },
    initCanvas() {
      const canvas = document.querySelector('#board-canvas');
      this.ctx = canvas.getContext('2d');
      this.ctx.strokeSyle = this.color;
      this.ctx.lineWidth = 2;
      this.canvas = canvas;
      const el = document.querySelector('.drawing-board');
      const width = el.clientWidth;
      // 减去message高度
      const height = el.clientHeight - 45;
      const min = Math.min(width, height);
      canvas.width = min - 2;
      canvas.height = min - 2;
    },
    onMouseDown(e) {
      if (!this.keyWord) return;
      this.drawing = true;
      this.current.x = e.offsetX || (e.touches && e.touches[0].offsetX);
      this.current.y = e.offsetY || (e.touches && e.touches[0].offsetY);
    },
    onMouseUp(e) {
      if (!this.keyWord) return;
      if (!this.drawing) return;
      this.drawing = false;
      this.drawLine(
        this.current.x,
        this.current.y,
        e.offsetX || (e.touches && e.touches[0].offsetX),
        e.offsetY || (e.touches && e.touches[0].offsetY),
        this.current.color,
        true,
      );
    },
    onMouseMove(e) {
      if (!this.keyWord) return;
      if (!this.drawing) return;
      this.drawLine(
        this.current.x,
        this.current.y,
        e.offsetX || e.touches[0].offsetX,
        e.offsetY || e.touches[0].offsetY,
        this.current.color,
        true,
      );
      this.current.x = e.offsetX || e.touches[0].offsetX;
      this.current.y = e.offsetY || e.touches[0].offsetY;
    },
    throttleMouseMove: throttle(function(e) {
      this.onMouseMove(e);
    }, 10),
    onDrawing({ x0, y0, x1, y1, color }) {
      const w = this.canvas.width;
      const h = this.canvas.height;
      this.drawLine(x0 * w, y0 * h, x1 * w, y1 * h, color);
    },
    drawLine(x0, y0, x1, y1, color, emit) {
      this.ctx.beginPath();
      this.ctx.moveTo(x0, y0);
      this.ctx.lineTo(x1, y1);
      this.ctx.strokeStyle = color;
      this.ctx.stroke();
      this.ctx.closePath();

      if (!emit) return;
      var w = this.canvas.width;
      var h = this.canvas.height;

      this.$emit('drawing', {
        x0: x0 / w,
        y0: y0 / h,
        x1: x1 / w,
        y1: y1 / h,
        color: color,
      });
    },
    clearRect() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
  },
};
</script>
<style lang="scss">
.drawing-board {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  .msg {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
}
</style>
