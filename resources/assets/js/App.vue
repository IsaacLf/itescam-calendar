<template>
<div>
  <header class="header" :class="$mq">
    <h1>Calendario ITESCAM</h1>
  </header>
  <!-- Button trigger modal -->
  <a v-if="User.admin" id="addEvent" href="javascript:void(0)" role="button" class="float" :class="$mq" title="Añadir evento" data-toggle="modal" data-target="#addNewEvent">
    <font-awesome-icon class="icon" icon="calendar-plus"/>
  </a>

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

  <!-- Modal -->
  <div class="modal fade" id="addNewEvent" tabindex="-1" role="dialog" aria-labelledby="addNewEventModal" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Nuevo evento</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
          <!--
          $table->integer('typeId');
          $table->string('name")->nullable();
          $table->text('description');
          $table->boolean('visible');
          $table->date('startDate');
          $table->date('endDate')->nullable();
          -->
          <form>
            <div class="row">
              <div class="col-6 form-group">
                <label for="evname">Nombre del evento</label>
                <input type="text" v-model="evname"
                  class="form-control" name="evname" id="evname" aria-describedby="namehelp" placeholder="p. Ej: Aniversario">
              </div>
              <div class="col-6 form-group">
                <label for="evname">
                  Tipo de evento:
                  <canvas width="65px" height="12px" style="border: 2px solid #090B10;" v-bind:style="{ background: color }"></canvas>
                  </label>
                <select class="form-control" v-model="evtype" name="evtype" id="evtype" data-show-content="true">
                  <option value="" disabled>No seleccionado</option>
                  <option v-for="eventt in EventsType" :key="eventt.id" :value="eventt.id">
                    {{ eventt.name }}
                  </option>
                </select>
              </div>
            </div>
            <div class="row">
              <div class="col-12 form-group">
                <label for="desc">Descripción:</label>
                <textarea class="form-control" v-model="desc" name="desc" id="desc" cols="60" rows="4"></textarea>
              </div>
            </div>
            <div class="row">
              <div class="col-6 form-group">
                <label for="startDate">Fecha de inicio</label>
                <input class="form-control" type="date" name="startDate" v-model="startDate" id="startDate">
              </div>
              <div class="col-6 form-group">
                <label for="endDate">Fecha de final</label>
                <input class="form-control" type="date" name="endDate" v-model="endDate" id="endDate">
              </div>
            </div>
            <div class="row">
              <div class="col-12 form-group text-center">
                <label class="non-selectable" for="show">Visible para el público general: </label>
                <input type="checkbox" name="show" id="show" v-model="show">
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
          <button type="button" class="btn btn-primary" @click="saveNewEv">Guardar</button>
        </div>
      </div>
    </div>
  </div>
  <!-- End Of NEW Event Modal -->
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
      currentPeriod: '2017-2018', //This will also be a prop
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
    updateEventsType: function (value){
      // console.log("Entré a UpdateEventsT [App]", value);
      this.EventsType = value;
    },
    saveNewEv: function () {
      let el = this;
      fetch('/api/event',{
        method: 'POST',
        body: JSON.stringify({
          typeId: el.evtype,
          name: el.name,
          description: el.desc,
          visible: el.show,
          startDate: el.startDate,
          endDate: el.endDate
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .catch(err => console.error(err))
      .then(function(res) {
        Toast.fire({
          type: 'success',
          title: 'Agregado correctamente'
        })
        el.callApi();
      })
    },
    callApi: function () {
      let el = this;
      fetch('/api/event')
      .then(res => res.json())
      .catch(err => console.error(err))
      .then(function(res){
        el.Events = res;
        $('#addNewEvent').modal('hide');
        el.dismissData();
      })
    },
    dismissData: function () {
      let el = this;
      el.evtype = '';
      el.name = '';
      el.desc = '';
      el.show = false;
      el.startDate = '';
      el.endDate = '';
    }
  },
  watch: {
    evtype: function (nue, old) {
      this.color = this.EventsType.find(item => item.id == nue).color;
    }
  },
  components: {
    'event-picker': EventPicker,
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
