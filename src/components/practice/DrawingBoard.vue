<!-- 你画我猜: 画板 -->
<template>
  <div class="drawing-board">
    <div class="msg">{{ message }}</div>
    <canvas id="board-canvas" width="500" height="500" style="border: 1px solid #999;"></canvas>
  </div>
</template>

<script>
import socket from '@/plugins/socket.io';

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
      socket: null,
      key: '',
      ctx: null,
      canvasWidth: 500,
      canvasHeight: 500,
      message: '',
    };
  },
  computed: {
    isShowBoard() {
      return !this.key;
    },
  },
  watch: {},
  created() {},
  mounted() {
    this.initCanvas();
  },
  methods: {
    initCanvas() {
      const canvas = document.querySelector('#board-canvas');
      this.ctx = canvas.getContext('2d');
      this.ctx.strokeSyle = '#000';
    },
    async initSocket() {
      this.socket = await socket.connect({
        userName: this.userName,
        namespace: 'draw',
        room: 'public',
      });
      this.socket.on('drawing', data => {
        this.message = `${data.userName} is drawing...`;
        this.draw({ beginX: data.beginX, beginY: data.beginY, endX: data.endX, endY: data.endY });
      });
      this.socket.on('clear', () => {
        console.log('socket: clear canvas!');
        this.onClear();
      });
    },
    onDrawing({ beginX, beginY, endX, endY }) {
      const { ctx } = this;
      ctx.beginPath();
      ctx.moveTo(beginX, beginY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    },
    onClear() {
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      if (this.key) {
        this.socket.emit('clear');
      }
    },
    onSuccess(userName) {
      this.$confirm({
        message: `${userName} has won this game!`,
      });
    },
    onNewGame() {
      this.socket.emit('start');
      const { ctx } = this;
      ctx.onMouseDown = e => {
        const { offsetX, offsetY } = e;
        ctx.beginPath(offsetX, offsetY);
        ctx.moveTo();
        // const begin = { beginX: e.offsetX, beginY: e.offsetY };
        this.onDrawing();
      };
    },
  },
};
</script>
<style lang="scss"></style>
