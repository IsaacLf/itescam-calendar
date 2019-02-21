import store from './store/store';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import App from './App.vue';
library.add(fas)
Vue.component('app', require('./App.vue'));
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false

const app = new Vue({
  el: '#app',
  store,  
});


$(document).ready(function () {
  let evSelect =  document.querySelector('[id="list-tab"]').childNodes[0];
  evSelect.classList.add('active', 'show'); 
  document.querySelector(`[id="${evSelect.hash.substring(1)}"]`).classList.add('active', 'show');
});