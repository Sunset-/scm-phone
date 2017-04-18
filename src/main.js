import Vue from 'vue';
import Mint from 'mint-ui';
import config from './config';
import SunsetMini from './components/common/index';
import Sunset from './sunset';
import Base from './base';
import './style/index.scss';

window.Sunset = Sunset;
Vue.use(Mint);
Vue.use(SunsetMini);

import App from './App.vue'

new Vue({
  el: 'body',
  components: {
    App
  }
})