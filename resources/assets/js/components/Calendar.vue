<template>
  <div class="calendar-container">
    <div class="title-row">
      <div class="col-md-2 align-self-center text-center">
        <div class="buttons-container">
          <div id="changePeriod" class="btn-group" role="group" aria-label="changePeriod">
            <button @click="changePeriod(false)" class="btn btn-sm btn-outline-light">
              <font-awesome-icon icon="caret-left"></font-awesome-icon>
            </button>
            <button @click="changePeriod(true)" class="btn btn-sm btn-outline-light"
            :disabled="hasuser ? false : cantGoFurther"
            >
              <font-awesome-icon icon="caret-right"></font-awesome-icon>
            </button>
          </div>
        </div>
      </div>
      <div class="col-md-8">
        <div class="title">
          <h1 class="no-text-select" v-text="periodName"></h1>
        </div>
      </div>
      <div class="col-md-2 align-self-center text-center">
        <div id="calendarViews" class="btn-group" role="group" aria-label="Second group">
          <button type="button" class="btn btn-sm btn-outline-light">
            <font-awesome-icon icon="calendar-alt"></font-awesome-icon>
          </button>
          <button type="button" class="btn btn-sm btn-outline-light">
            <font-awesome-icon icon="calendar"></font-awesome-icon>
          </button>
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
                    <td v-for="day of week.days" :key="day.id" class="no-text-select" :class="`text-${day.fontcolor}`" :style="`background: ${ day.color != undefined ? day.color : '' };`">
                      {{ day.value > 0 ? day.value: "" }}
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
    current: String,
    hasuser: Number
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
    cantGoFurther: function() {
      let current = this.currentPeriod;
      let selected = this.selectedYears;
      return (selected[0] + 1 > current[0] && selected[1] + 1 > current[1]);
    }
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
      this.calendar.populateDayWEvents();
    },
    selectedYears: function(newVal, oldVal) {
      this.$emit('changeCalendar', newVal.join('-'));
    },
    current: function(newVal, oldVal) {
      this.currentPeriod = newVal.split('-').map(year => parseInt(year));
    }
  },
  methods: {
    changePeriod: function (isNext) {
      let current = this.selectedYears;
      let change;
      if(isNext){
        change = current.map(item => item + 1);
      } else {
        change = current.map(item => item - 1);
      }
      let changePer = change.join('-');
      let periods = this.calendar.periods;
      if(!periods.find(elem => elem.name == changePer))
        this.calendar.addPeriod(this.calendar.createPeriod(new Date(1,8,change[0]), new Date(31,8,change[1])));
      this.calendar.setActivePeriod(changePer);
      this.selectedYears = change;
    }
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
  .title-row {
    display: flex;
    flex-wrap: wrap;
    padding-top: 1rem;
  }
  .title {
    text-align: center;
    padding-top: 0.5rem;
    color: white;
  }
  .content {
    padding: 1em;
    margin: 1rem;
    background: white;
    display: grid;
    grid-template-rows: auto auto;
    grid-row-gap: 0.8em;
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

  .text-white {
    color: white;
  }

  .text-dark,
  .text-black {
    color: black;
  }

  .content td {
    width: 22px;
    height: 22px;
  }

  h1.text-center {
    margin-bottom: 2rem;
  }

  #changePeriod button, #calendarViews button {
    width: 2.5rem;
  }

</style>
