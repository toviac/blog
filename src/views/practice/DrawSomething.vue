<!-- 你画我猜 -->
<template>
  <div class="draw-something">
    <div class="main-area">
      <transition name="fade">
        <div v-if="showMask" class="mask">
          <el-card>
            <h3>输入昵称以连接到服务器</h3>
            <el-form
              ref="userNameForm"
              :model="emptyForm"
              :rules="rules"
              @submit.native.prevent="submitForm('userNameForm', setUserName)"
            >
              <el-form-item prop="userNameInput">
                <el-input v-model="userName"></el-input>
              </el-form-item>
              <el-button
                type="primary"
                size="mini"
                :loading="btnLoading"
                @click="submitForm('userNameForm', setUserName)"
              >
                确认
              </el-button>
            </el-form>
          </el-card>
        </div>
      </transition>
      <h1>你画我猜</h1>
      <div class="repeater-body">
        <el-form
          ref="messageForm"
          :model="emptyForm"
          :rules="rules"
          @submit.native.prevent="submitForm('messageForm', sendMsg)"
        >
          <h3 slot="label">
            输入:
          </h3>
          <el-form-item prop="messageInput">
            <el-input v-model="message" placeholder="请输入消息">
              <el-button slot="append" @click="submitForm('messageForm', sendMsg)">
                发送
              </el-button>
            </el-input>
          </el-form-item>
        </el-form>
        <h3>聊天记录:</h3>
        <el-scrollbar ref="logScrollbar" class="logs">
          <chat-bubble v-for="(item, index) in msgList" :key="index" :data="item" :side="getMsgSide(item.id)">
          </chat-bubble>
        </el-scrollbar>
        <!-- canvas -->
        <drawing-board ref="board" :user-name="userName" @drawing="handleDraw"></drawing-board>
      </div>
    </div>
    <el-card v-show="socketUserId" class="side-area">
      <span slot="header"
        >在线列表 <span v-show="onlineList.length">({{ onlineList.length }})</span></span
      >
      <el-scrollbar>
        <!-- <div v-for="item in onlineList" :key="item.id" class="online-item"> -->
        <div v-for="item in onlineList" :key="item.index" class="online-item">
          <img :src="item.userInfo.avatar || defaultAvatar" alt="" class="avatar" />
          <span class="user-name">
            {{ item.userInfo.userName }}
          </span>
        </div>
      </el-scrollbar>
    </el-card>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import socket from '@/plugins/socket.io';
import ChatBubble from '@/components/practice/ChatBubble.vue';
import defaultAvatar from '@/assets/images/default_avatar.jpg';
import DrawingBoard from '@/components/practice/DrawingBoard.vue';

export default {
  components: {
    ChatBubble,
    DrawingBoard,
  },
  data() {
    return {
      socket: null,
      defaultAvatar,
      showMask: true,
      btnLoading: false,
      userName: '',
      message: '',
      msgList: [],
      onlineList: [],
      // [Element Warn][Form]model is required for validate to work!
      emptyForm: {},
      rules: {
        userNameInput: [{ validator: this.checkNickname, trigger: 'submit' }],
        messageInput: [{ validator: this.checkMessage, trigger: 'submit' }],
      },
    };
  },
  computed: {
    ...mapGetters('socket', ['socketUserId', 'socketUserName']),
  },
  watch: {
    msgList() {
      this.$nextTick(() => {
        const wrap = document.querySelector('.logs .el-scrollbar__wrap');
        const view = document.querySelector('.logs .el-scrollbar__wrap .el-scrollbar__view');
        const bottomOffset = view.clientHeight - wrap.clientHeight;
        const distance = bottomOffset - wrap.scrollTop;
        if (!wrap || !(distance > 0)) return;
        const step = () => {
          // 增量小于1的话不会移动
          wrap.scrollTop += Math.ceil(distance / 30);
          if (wrap.scrollTop < bottomOffset) {
            requestAnimationFrame(step);
          }
        };
        requestAnimationFrame(step);
      });
    },
  },
  created() {},
  mounted() {},
  beforeDestroy() {
    this.socket.close();
    console.log('socket closed');
    this.updateSocketUserId('');
    this.updateSocketUserName('');
  },
  methods: {
    ...mapMutations('socket', ['updateSocketUserId', 'updateSocketUserName']),
    checkNickname(rule, value, callback) {
      const { userName } = this;
      if (!userName) {
        return callback(new Error('昵称不能为空'));
      }
      if (userName.length > 10) {
        return callback(new Error('昵称长度不能大于十位'));
      }
      return callback();
    },
    checkMessage(rule, value, callback) {
      const { message } = this;
      if (!message) {
        return callback(new Error('请输入消息内容'));
      }
      return callback();
    },
    submitForm(formName, callback) {
      this.$refs[formName].validate(valid => {
        if (!valid) return false;
        return callback();
      });
    },
    async setUserName() {
      this.btnLoading = true;
      try {
        const { userName } = this;
        if (!userName) return;
        await this.initSocket(userName);
        this.updateSocketUserName(userName);
        this.showMask = false;
      } catch (e) {
        this.$message({
          message: e,
          type: 'error',
        });
      }
      this.btnLoading = false;
    },
    async initSocket(userName) {
      this.socket = await socket.connect({
        userName: userName,
        namespace: 'draw',
        room: 'draw',
      });
      const { userId } = socket.query;
      this.updateSocketUserId(userId);
      this.updateSocketUserName(userName);
      // 获取在线列表
      socket.emit('online-list', { room: 'draw' }, msg => {
        console.log('current online: ', msg);
        this.onlineList = msg;
      });
      socket.on(userId, msg => {
        console.log('receive: ', msg);
      });
      // 加入
      socket.on('join', msg => {
        console.log('someone joined this room: ', msg);
        if (!this.onlineList.find(user => user.id === msg.id)) {
          this.onlineList.push(msg);
        }
      });
      // 离开
      socket.on('leave', msg => {
        console.log('someone left this room: ', msg);
        const userIndex = this.onlineList.findIndex(user => user.id === msg.id);
        if (userIndex < 0) return;
        this.onlineList.splice(userIndex, 1);
      });
      // 接收消息
      socket.on('message', msg => {
        console.log('receive msg: ', msg);
        if (msg.from.userId !== this.socketUserId) {
          this.insertMsg(msg);
        }
      });
      socket.on('drawing', msg => {
        this.$refs['board'].onDrawing(msg);
      });
    },
    getMsgSide(id) {
      return id === socket.id ? 'right' : 'left';
    },
    insertMsg(msg) {
      this.msgList.push(msg);
    },
    sendMsg() {
      const { message, socketUserId, socketUserName } = this;
      if (!message) return;

      const msg = {
        type: 'room',
        id: socket.id,
        from: {
          userId: socketUserId,
          userName: socketUserName,
        },
        to: 'public',
        message,
        timestamp: +new Date(),
      };

      socket.emit('message', msg, () => {
        console.log('send success!');
      });

      // emit('...', params, callback)
      // socket.emit('chat', msg, () => {
      //   msg.isSuccess = true;
      //   console.log('send success!');
      // });
      this.insertMsg(msg);
      this.message = '';
    },
    handleDraw(data) {
      socket.emit('drawing', data);
    },
  },
};
</script>
<style lang="scss">
.draw-something {
  // 扩展范围, 以显示侧边在线列表
  display: grid;
  grid-area: 1/1/2/3;
  grid-template-areas: 'main side';
  grid-template-columns: calc(100% - 320px) 300px;
  grid-column-gap: 20px;
  .main-area {
    position: relative;
    grid-area: main;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: calc(100vh - 100px);
    padding: 10px;
    margin: 10px 0;
    min-height: calc(100vh - 100px);
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    overflow: hidden;
    .mask {
      z-index: 1;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #80808080;
      .el-card {
        width: 50%;
        user-select: none;
        .el-form {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        .el-form-item {
          width: 100%;
          margin-bottom: 0;
        }
        h3 {
          margin-bottom: 10px;
        }
        .el-button {
          margin-top: 10px;
        }
      }
    }
    h3 {
      font-size: 16px;
      color: #2c3e50;
    }
    .repeater-body {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .el-input-group__append {
      .el-button {
        &:hover {
          border-color: transparent;
          color: inherit;
        }
      }
    }
    .logs {
      // flex-grow: 1;
      height: 300px;
      box-shadow: inset 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }
  }
  .side-area {
    display: flex;
    flex-direction: column;
    max-height: calc(100vh - 420px);
    height: calc(100vh - 420px);
    margin-top: 330px;
    margin-bottom: 10px;
    .el-card__header {
      flex-shrink: 0;
    }
    .el-card__body {
      flex-grow: 1;
      position: relative;
      .el-scrollbar {
        height: auto;
        position: absolute;
        top: 20px;
        left: 20px;
        right: 20px;
        bottom: 20px;
        border-radius: 4px;
        box-shadow: inset 0 2px 6px 0 rgba(0, 0, 0, 0.1);
      }
    }
    .online-item {
      display: flex;
      align-items: center;
      padding: 5px 10px;
      border: 1px solid #ccc;
      user-select: none;
      cursor: pointer;
      .avatar {
        flex-shrink: 0;
        margin-right: 10px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
      }
      .user-name {
        flex-grow: 1;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
      &:nth-child(1) {
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
      }
      &:nth-last-child(1) {
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
      }
      &:nth-child(n + 2) {
        border-top: none;
      }
    }
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
}
</style>
