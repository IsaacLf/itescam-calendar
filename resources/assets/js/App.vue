<template>
<div>
  <header class="header" :class="$mq">
    <h1>Calendario ITESCAM</h1>
  </header>
  <a v-if="User.admin" id="addEvent" href="javascript:void(0)" role="button" class="float" :class="$mq" title="Añadir evento">
    <font-awesome-icon class="icon" icon="calendar-plus"/>
  </a>
  <!-- <a href="#!" class="float add" :class="$mq">
    <font-awesome-icon class="icon" icon="grip-lines-vertical"/>
  </a> -->
  <div class="admin-container" :class="$mq">
    <div id="eventpicker" :class="$mq">
    <event-picker
      v-bind:eventstype="EventsType"
      v-bind:events="Events"
      v-bind:user="User"
      v-on:eventsChange="updateEvents"
      v-on:eventsTChange="updateEventsType"
    ></event-picker>
    </div>
    <div id="calendar" :class="$mq">
      <calendar
        v-bind:eventstype="EventsType"
        v-bind:events="Events"
        v-bind:current="currentPeriod"
      ></calendar>
    </div>
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
      eventsstype: [],
      user: { //This will be a prop
        name: "Nose",
        admin: true
      },
      currentPeriod: '2017-2018' //This will also be a prop
    }
  },
  created: function(){
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
    },
    User: {
      set: function(val){
        this.user = val;
      },
      get: function() {
        return this.user;
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
