require('./calendario.js');

Vue.component('app', require('./components/frontend/App.vue'));

const app = new Vue({
  el: '#app'
});


$(document).ready(function () {
  $('.evtype').selectpicker();
});