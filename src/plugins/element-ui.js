// 全局引入
import Vue from 'vue';
// import ElementUI from 'element-ui';
import {
  Card,
  Menu,
  MenuItem,
  Input,
  ButtonGroup,
  Button,
  Dialog,
  Loading,
  Form,
  FormItem,
  RadioGroup,
  Radio,
  Message,
  MessageBox,
  Tag,
} from 'element-ui';

// Vue.use(ElementUI);
Vue.use(Card);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Input);
Vue.use(ButtonGroup);
Vue.use(Button);
Vue.use(Dialog);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(RadioGroup);
Vue.use(Radio);
Vue.use(Loading);
Vue.use(Tag);

Vue.prototype.$message = Message;
Vue.prototype.$alert = MessageBox.alert;
