<template>
  <div class="calendar-container">
    <div class="title">
      <h1 class="no-text-select" v-text="periodName"></h1>
    </div>
    <div class="content">
      <div class="year" v-for="year of period.years" :key="year.id">
        <div>
          <h1 class="text-center no-text-select">{{ year.value }}</h1>
          <div class="month" v-for="month of year.months" :key="month.id">
            <table>
              <thead>
                <tr class="month-title no-text-select"><th class="text-center" colspan="7">{{ month.name }}</th></tr>
                <tr class="dweek no-text-select">
                  <td>D</td>
                  <td>L</td>
                  <td>M</td>
                  <td>M</td>
                  <td>J</td>
                  <td>V</td>
                  <td>S</td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="week of month.weeks" :key="week.id" class="week">
                  <td v-for="day of week.days" :key="day.id" class="no-text-select" :style="{ background: day.color }">
                    {{ day.value > 0 ? ((typeof day.events !== "undefined" && day.events.length > 0) ? day.events.length+"EV" : day.value): "" }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Calendar, MDate as Date } from '../calendar';
export default {
  props: {
    events: Array,
    eventstype: Array,
  },
  data: function () {
    return {
      per: {},
      done: false,
      constDays: [],
      dayArr: [],
      calendar: {}
    }
  },
  created: function () {
    let obj = new Calendar(new Date(1,8,2017), new Date(31,7,2018));
    this.calendar = obj;
    this.calendar.setEvents(this.events);
    this.calendar.setEventsType(this.eventstype);
    this.calendar.populateDayWEvents();
    this.constDays = [
      { value: 0, name: "domingo" },
      { value: 1, name: "lunes" },
      { value: 2, name: "martes" },
      { value: 3, name: "miércoles" },
      { value: 4, name: "jueves" },
      { value: 5, name: "viernes" },
      { value: 6, name: "sábado" },
    ];
    // this.per = this.calendar.period;
    console.log(this.calendar.events, this.calendar.period.years);
    // console.log(this.per);
  },
  computed: {
    period: function () { return this.calendar.period },
    periodName: function () { return  `Ciclo ${this.calendar.period.name}` },
  },
  watch:{
    events: function(newVal, oldVal){
      // console.log('Events Changed: ', newVal);
      this.calendar.setEvents(newVal);
      this.calendar.populateDayWEvents();
    },
    eventstype: function (newVal, oldVal){
      // console.log('EventsType Changed: ', newVal);
      this.calendar.setEventsType(newVal);
      this.calendar.populateDayWEvents();
    }
  },
  methods: {
  }
}
</script>

<style scoped>
  * {
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  }

  .calendar-container {
    background: black;
    color: white;
    justify-content: center;
    border-radius: 10px;
  }
  .title {
    text-align: center;
    margin-top: 0.5rem;
  }
  .content {
    padding: 1em;
    margin: 1rem;
    background: teal;
    display: grid;
    grid-template-rows: 40% 40%;
  }
  .year {
    display: grid;
  }

  .month {
    display: inline-block;
    margin-left: 0.7em;
    margin-right: 0.7em;
  }

  .month-title {
    text-transform: uppercase;
  }

  .dweek{
    text-align: center;
    border-bottom: solid 3px black;
  }

  .week td {
    font-size: x-small;
    text-align: center;
    /* border: solid 1px black; */
  }

  .no-text-select {
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
  }

  .content td {
    width: 22px;
    height: 22px;
  }

  h1.text-center {
    margin-bottom: 2rem;
  }
</style>
