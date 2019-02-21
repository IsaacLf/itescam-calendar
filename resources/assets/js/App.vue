<template>
  <div class="admin-container">
      <div class="grid-item">
      <event-picker 
        v-bind:eventstype="EventsType"
        v-bind:events="Events"
        v-on:eventsChange="updateEvents"
        v-on:eventsTChange="updateEventsType"
      ></event-picker>
    </div>
    <div class="grid-item">
      <calendar 
        v-bind:eventstype="EventsType"
        v-bind:events="Events"
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
      eventss: [],
      eventsstype: []
    }
  },
  created: function(){
    // console.log(store.state);
    this.Events = this.events;
    this.EventsType = this.eventstype;
  },
  computed: {
    Events: {
      set: function(val){
        this.eventss = val;
      },
      get: function(){
        return this.eventss;
      }
    },
    EventsType: {
      set: function(val){
        this.eventsstype = val;
      },
      get: function(){
        return this.eventsstype;
      }
    }
  },
  methods: {
    updateEvents: function (value){
      // console.log("Entré a UpdateEvents [App]", value);
      this.Events = value;
    },
    updateEventsType: function(value){
      // console.log("Entré a UpdateEventsT [App]", value);
      this.EventsType = value;
    }
  },
  components: {
    'event-picker': EventPicker,
    'calendar': Calendar
  }
}
</script>

<style>

</style>
