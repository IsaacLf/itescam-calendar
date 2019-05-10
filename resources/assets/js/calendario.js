import store from './store/store';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import App from './App.vue';
import VueMq from 'vue-mq';

Vue.use(VueMq, {
  breakpoints: {
    mobile: 450,
    tablet: 1000,
    laptop: 1366,
    desktop: Infinity,
  }
})

library.add(fas, fab)
Vue.component('app', require('./App.vue'));
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false

const app = new Vue({
  el: '#app',
  store,
});


$(document).ready(function () {
  $('.evtype').selectpicker();
});