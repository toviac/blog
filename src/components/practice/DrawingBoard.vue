<!-- 你画我猜: 画板 -->
<template>
  <div class="drawing-board">
    <div class="msg" v-if="!this.keyWord">
      <span>{{ message }}</span>
      <el-button v-if="!this.userName" size="mini" @click="btnStart">Start</el-button>
    </div>
    <div class="msg" v-else>
      <span>{{ keyWord }}</span>
      <el-button size="mini" @click="btnUndo">Undo</el-button>
      <el-button size="mini" @click="btnClear">Clear</el-button>
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
        lineWidth: 2,
      },
      drawing: false,
      drawingDot: false,
      step: [],
      stepList: [],
    };
  },
  computed: {
    message() {
      if (this.userName) return `${this.userName} is drawing...`;
      return 'Game is not started';
    },
  },
  watch: {},
  created() {},
  mounted() {
    this.initCanvas();
  },
  methods: {
    btnStart() {
      this.$emit('start-game');
    },
    btnUndo() {
      this.$emit('undo');
    },
    btnClear() {
      this.$emit('clear');
    },
    initCanvas() {
      const canvas = document.querySelector('#board-canvas');
      this.ctx = canvas.getContext('2d');
      this.ctx.strokeSyle = this.color;
      this.ctx.lineWidth = this.current.lineWidth;
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
      this.drawingDot = true;
      this.current.x = e.offsetX || (e.touches && e.touches[0].offsetX);
      this.current.y = e.offsetY || (e.touches && e.touches[0].offsetY);

      setTimeout(() => {
        if (this.drawingDot) {
          let r = this.current.lineWidth;
          let x = this.current.x;
          let y = this.current.y;
          const draw = () => {
            r = r + this.current.lineWidth / 60;
            this.drawDot(x, y, r, this.current.color, true);
            if (r < this.current.lineWidth * 1.5 && this.drawingDot) {
              console.log('=> ', r < this.current.lineWidth * 1.5);
              requestAnimationFrame(draw);
            }
          };
          requestAnimationFrame(draw);
        }
      }, 300);
    },
    onMouseUp(e) {
      if (!this.keyWord) return;
      if (!this.drawing) return;
      this.drawing = false;
      this.drawingDot = false;
      this.drawLine(
        this.current.x,
        this.current.y,
        e.offsetX || (e.touches && e.touches[0].offsetX),
        e.offsetY || (e.touches && e.touches[0].offsetY),
        this.current.color,
        true,
      );
      this.$emit('draw-end');
    },
    onMouseMove(e) {
      if (!this.keyWord) return;
      if (!this.drawing) return;
      if (this.drawingDot) {
        this.drawingDot = false;
        this.$emit('draw-end');
      }
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
    onDrawingDot({ x, y, radius, color }) {
      const w = this.canvas.width;
      const h = this.canvas.height;
      this.drawDot(x * w, y * h, radius, color);
    },
    // 单次绘制结束
    onDrawEnd() {
      this.stepList.push(this.step);
      console.log('draw-end: ', this.step, this.stepList);
      this.step = [];
    },
    onUndo() {
      this.stepList.pop();
      this.clearRect();
      this.stepList.forEach(step => {
        step.forEach(i => {
          if (i.x0 || i.y0) {
            this.drawLine(i.x0, i.y0, i.x1, i.y1, i.color);
          } else {
            this.drawDot(i.x, i.y, i.radius, i.color);
          }
        });
      });
    },
    drawLine(x0, y0, x1, y1, color, emit) {
      this.ctx.beginPath();
      this.ctx.moveTo(x0, y0);
      this.ctx.lineTo(x1, y1);
      this.ctx.strokeStyle = color;
      this.ctx.stroke();
      this.ctx.closePath();
      this.step.push({ x0, y0, x1, y1, color });

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
    drawDot(x, y, radius, color = '#000', emit) {
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, 360, false);
      this.ctx.fillStyle = color;
      this.ctx.fill();
      this.ctx.closePath();
      this.step.push({ x, y, radius, color });
      if (!emit) return;
      var w = this.canvas.width;
      var h = this.canvas.height;

      this.$emit('drawing-dot', {
        x: x / w,
        y: y / h,
        radius,
        color,
      });
    },
    clearRect() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.step = [];
      this.stepList = [];
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
