<template>
  <div class="admin-container">
      <div class="grid-item">
      <event-picker 
        v-bind:eventstype="eventstype"
        v-bind:events="events"
      ></event-picker>
    </div>
    <div class="grid-item">
      <calendar 
        v-bind:events="events"
      ></calendar>
    </div>
  </div>
</template>

<script>
import EventPicker from './components/EventPicker.vue';
import Calendar from './components/Calendar.vue';
import store from './store/store';
export default {
  props: {
    eventstype: Array,
    events: Array
  },
  data: function () {
    return {

    }
  },
  created: function(){
    console.log(store.state);
  },
  computed: {
    
  },
  components: {
    'event-picker': EventPicker,
    'calendar': Calendar
  }
}
</script>

<style>

</style>
