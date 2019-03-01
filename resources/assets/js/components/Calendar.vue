<template>
  <div class="calendar-container">
    <div class="row">
      <div class="col-md-12">
        <div class="title">
          <h1 class="no-text-select" v-text="periodName"></h1>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="year" v-for="year of period.years" :key="year.id">
        <div class="year-wrapper">
          <h1 class="text-center no-text-select">{{ year.value }}</h1>
          <div class="month-wrapper">
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
                      {{ day.value > 0 ? day.value: "" }}
                      <!-- day.value > 0 ? ((typeof day.events !== "undefined" && day.events.length > 0) ? day.events.length+"EV" : day.value): "" -->
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
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
    current: String
  },
  data: function () {
    return {
      calendar: {},
      selectedPeriod: '',
      currentPeriod: [],
      selectedYears: []
    }
  },
  created: function () {
    this.selectedPeriod = this.current;
    this.selectedYears = this.current.split('-').map(year => parseInt(year));
    let years = this.selectedYears;
    this.currentPeriod = years;
    this.calendar = new Calendar(new Date(1,8,years[0]), new Date(31,8,years[1]));
    this.calendar.setEvents(this.events);
    this.calendar.setEventsType(this.eventstype);
    this.calendar.populateDayWEvents();
    this.calendar.addPeriod(this.calendar.period);
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
    },
    period: function (newVal, oldVal){
      console.log(newVal, oldVal);
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
    background: #2c3e50;
    color: black;
    justify-content: center;
    border-radius: 10px;
    height: 100%;
  }
  .title {
    text-align: center;
    padding-top: 1rem;
    color: white;
  }
  .content {
    padding: 1em;
    margin: 1rem;
    background: white;
    display: grid;
    grid-template-rows: 40% 40%;
  }
  .year {
    display: grid;
  }

  .month {
    display: flex;
    margin-left: 0.7em;
    margin-right: 0.7em;
  }

  .month-wrapper {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-evenly;
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

  /* Responsive Classes */
  /* .tablet .calendar-container,
  .mobile .calendar-container {

  } */
</style>
