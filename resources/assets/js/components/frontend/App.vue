<template>
<div>
  <header class="header" :class="$mq">
    <h1>Calendario ITESCAM</h1>
  </header>

  <div class="admin-container" :class="$mq">
    <div id="eventpicker" :class="$mq">
    <event-types
      v-bind:eventstype="EventsType"
      v-bind:events="Events"
    ></event-types>
    </div>
    <div id="calendar" :class="$mq">
      <calendar
        v-bind:eventstype="EventsType"
        v-bind:events="Events"
        v-bind:current="currentPeriod"
        v-on:changeCalendar="getCurrentEvents"
      ></calendar>
    </div>
  </div>

</div>
</template>

<script>
import EventTypes from './EventTypes.vue';
import Calendar from '../Calendar.vue';
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
});

export default {
  props: {
    eventstype: Array,
    currentperiod: String
  },
  data: function () {
    return {
      eventss: [],
      eventsstype: [],
      currentPeriod: '', //This will also be a prop
      evname: '',
      evtype: '',
      color: '#FFFFFF',
      desc: '',
      startDate: '',
      endDate: '',
      show: false
    }
  },
  created: function(){
    // this.Events = this.events;
    this.currentPeriod = this.currentperiod;
    this.Events = [];
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
  },
  methods: {
    getCurrentEvents: function(period) {
      let el = this;
      el.currentPeriod = period;
      el.fetchEvents(period);
    },
    fetchEvents: function(period) {
      let el = this;
      const start = "-08-01"; const end = "-08-31"
      let response = new Promise((resolve, reject) => {
        let years = period.split('-').map(year => parseInt(year));
        fetch('/api/events/getEvents',{
          method: 'POST',
          body: JSON.stringify({ startDate: `${years[0]}${start}`, endDate: `${years[1]}${end}` }),
          headers:{
            'Content-Type': 'application/json'
          }
        })
        .then(res => res.json())
        .catch(err => reject(err))
        .then(res => {
          el.Events = res
          resolve("ready")
        })
      })
      return response;
    }
  },
  watch: {
    evtype: function (nue, old) {
      if(nue != '')
        this.color = this.EventsType.find(item => item.id == nue).color;
    },
    currentPeriod: function(nue, old) {
      this.fetchEvents(nue);
    }
  },
  components: {
    'event-types': EventTypes,
    'calendar': Calendar
  }
}
</script>

<style scoped>
  * {
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  }
  canvas {
    display: inline-block;
    margin-bottom: -2px;
  }

  .non-selectable {
    -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Safari */
      -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Firefox */
          -ms-user-select: none; /* Internet Explorer/Edge */
              user-select: none; /* Non-prefixed version, currently
                                    supported by Chrome and Opera */
    cursor: pointer;
  }
</style>
