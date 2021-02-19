<!-- 你画我猜: 画板 -->
<template>
  <div class="drawing-board">
    <div class="msg"></div>
    <div class="msg">{{ message }}</div>
    <canvas
      id="board-canvas"
      width="500"
      height="500"
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
export default {
  props: {
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
      message: '',
      current: {
        x: 0,
        y: 0,
        color: '#000000',
      },
      drawing: false,
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.initCanvas();
  },
  methods: {
    initCanvas() {
      const canvas = document.querySelector('#board-canvas');
      this.ctx = canvas.getContext('2d');
      this.ctx.strokeSyle = this.color;
      this.ctx.lineWidth = 2;
      this.canvas = canvas;
    },
    onMouseDown(e) {
      this.drawing = true;
      this.current.x = e.offsetX || e.touches[0].offsetX;
      this.current.y = e.offsetY || e.touches[0].offsetY;
    },
    onMouseUp(e) {
      if (!this.drawing) return;
      this.drawing = false;
      this.drawLine(
        this.current.x,
        this.current.y,
        e.offsetX || e.touches[0].offsetX,
        e.offsetY || e.touches[0].offsetY,
        this.current.color,
        true,
      );
    },
    onMouseMove(e) {
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
    throttle(callback, delay = 10) {
      let previousCall = new Date().getTime();
      return function() {
        const time = new Date().getTime();

        if (time - previousCall >= delay) {
          previousCall = time;
          callback.apply(null, arguments);
        }
      };
    },
    throttleMouseMove(e) {
      this.throttle(this.onMouseMove(e));
    },
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
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    },
  },
};
</script>
<style lang="scss"></style>
