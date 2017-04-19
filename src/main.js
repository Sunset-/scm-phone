import Vue from 'vue';
import Router from 'vue-router';
import Mint from 'mint-ui';
import config from './config';
import SunsetMini from './components/common/index';
import Sunset from './sunset';
import Base from './base';
import './style/index.scss';

window.Sunset = Sunset;
Vue.use(Router);
Vue.use(Mint);
Vue.use(SunsetMini);

import App from './App.vue';
import SignStore from './components/SignStore';
//订单
import Orders from './components/order/Orders.vue';
import OrderDetail from './components/order/OrderDetail.vue';
//对账单
import StatementPage from './components/statement/Statements.vue';
import StatementDetail from './components/statement/StatementDetail.vue';
//销售
import Sales from './components/sale/Sales.vue';

var router = new Router();

window.Router = router;

router.map({
  '/order': {
    component: Orders,
    subRoutes: {
      '/detail': {
        component: OrderDetail
      }
    }
  },
  '/statement': {
    component: StatementPage,
    subRoutes: {
      '/detail': {
        component: StatementDetail
      }
    }
  },
  '/sale': {
    component: Sales
  }
});


SignStore.currentUser().then(res => {
  router.start(App, 'app');
});