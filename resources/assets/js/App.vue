<template>
<div>
  <header class="header" :class="$mq" style="display: block;">
    <div class="row" style="margin: 0;">
      <div class="col-md-2"></div>
      <div class="col-md-8">
        <h1>Calendario ITESCAM</h1>
      </div>
      <div id="configs" class="col-md-2" style="display: flex;align-items: center; justify-content: center;">
        <div class="dropdown dropleft">
          <button class="btn btn-dark dropdown-toggle mr-1" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <font-awesome-icon class="icon" icon="user"/>
          </button>
          <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <div class="dropdown-divider"></div>
            <a class="dropdown-item disabled" href="javascript:void(0)">Usuario: {{ username }}</a>
          </div>
        </div>
        <!-- Aquí van los componentes para configurar la fecha del calendario que se publicará -->
        <div class="dropdown dropleft">
          <button class="btn btn-dark dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <font-awesome-icon class="icon" icon="cogs"/>
          </button>
          <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <h6 class="dropdown-header">Acciones</h6>
            <a  class="dropdown-item" :class="{ disabled: !canPublish || activePeriod == currentPeriod }"
                @click="activateCurrentCalendar"
                href="javascript:void(0)">Marcar 'activo' este calendario
            </a>
            <a  class="dropdown-item" :class="{ disabled: !canPublish }"
                @click="publishApprovedEvents"
                href="javascript:void(0)">Publicar eventos de este ciclo
            </a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item disabled" href="javascript:void(0)">Activo: {{ activePeriod }}</a>
          </div>
        </div>
      </div>
    </div>
  </header>
  <!-- Button trigger modal -->
  <a v-if="canCreateEvents" id="addEvent" href="javascript:void(0)" role="button" class="float" :class="$mq" title="Añadir evento" data-toggle="modal" data-target="#addNewEvent">
    <font-awesome-icon class="icon" icon="calendar-plus"/>
  </a>

  <div class="admin-container" :class="$mq">
    <div id="eventpicker" :class="$mq">
    <event-picker
      v-bind:eventstype="EventsType"
      v-bind:events="Events"
      v-bind:user="User"
      v-bind:classifs="classifs"
      v-on:eventsChange="updateEvents"
      v-on:eventsTChange="updateEventsType"
      v-on:toggleEditEvent="toggleEditEvent"
    ></event-picker>
    </div>
    <div id="calendar" :class="$mq">
      <calendar
        v-bind:eventstype="EventsType"
        v-bind:events="Events"
        v-bind:current="activePeriod"
        v-bind:hasuser="hasuser"
        v-on:changeCalendar="getCurrentEvents"
      ></calendar>
    </div>
  </div>

  <!-- Modal -->
  <div class="modal fade" id="addNewEvent" tabindex="-1" role="dialog" aria-labelledby="addNewEventModal" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ modText }}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="dismissData">
              <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
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
                <!--input class="form-control" type="date" name="startDate" v-model="startDate" id="startDate"-->
                <datepicker v-model="startDate" name="startDate" id="startDate" :language="es" placeholder="Dia Mes Año"></datepicker>
                
              </div>
              <div class="col-6 form-group">
                <label for="endDate">Fecha de final</label>
                <!--input class="form-control" type="date" name="endDate" v-model="endDate" id="endDate"-->
                <datepicker v-model="endDate" name="endDate" id="endDate" :language="es" placeholder="Dia Mes Año"></datepicker>
              </div>
            </div>
            <div class="row">
              <div class="col-12 form-group">
                <label for="evname"> Status del evento: </label>
                <select class="form-control" v-model="evstat" name="evstat" id="evstat" data-show-content="true">
                  <option value="" disabled>No seleccionado</option>
                  <option v-for="eventstat in eventStatus" :key="eventstat.id" :value="eventstat.id">
                    {{ eventstat.name }}
                  </option>
                </select>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="dismissData" data-dismiss="modal">Cancelar</button>
          <button v-show="edit" type="button" class="btn btn-danger" @click="deleteEvent">Eliminar</button>
          <button type="button" class="btn btn-primary" @click="[ edit ? saveUpdated() : saveNewEv() ]">Guardar</button>
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
import Datepicker from 'vuejs-datepicker';
import moment from 'moment';
import store from './store/store';
import Swal from 'sweetalert2';
import { User, EventStatus, Status } from './calendar';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
});

const url = document.querySelector('[name="site-url"]').content;

export default {
  props: {
    eventstype: Array,
    classifs: Array,
    published: String,
    currentperiod: String,
    hasuser: Number,
    uuser: Object
  },
  data: function () {
    return {
      eventss: [],
      eventsstype: [],
      currentPeriod: '',
      user: {},
      activePeriod: '',
      eventStatus: [],
      // DATA FOR EVENTS
      edit: false,
      modText: 'Nuevo evento',
      evid: '',
      evname: '',
      evtype: '',
      evstat: 2,
      color: '#FFFFFF',
      desc: '',
      startDate: '',
      endDate: '',
      show: false
    }
  },
  created: function(){
    let el = this;
    el.currentPeriod = el.currentperiod;
    el.activePeriod = el.published;
    el.Events = [];
    el.EventsType = el.eventstype;
    el.User = new User(this.uuser);
    el.eventStatus = EventStatus;
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
    },
    /** Start Permission Props */
    canCreateEvents: function() {
      let el = this;
      if(el.User instanceof User)
        return el.User.canCreateOfficialEvents();
      return false;
    },
    canPublish: function() {
      let el = this;
      if(el.User instanceof User)
        return el.User.canPublish();
      return false;
    },
    username: function() {
      return this.uuser.username;
    }
    /** End Permission Props */
  },
  methods: {
    updateEvents: function (value){
      this.Events = value;
    },
    updateEventsType: function (value){
      this.EventsType = value;
    },
    saveNewEv: function () {
      let el = this;
      el.startDate = moment(el.startDate).format('YYYY-MM-DD');
      el.endDate = moment(el.endDate).format('YYYY-MM-DD');
      fetch(`${url}/event`,{
        method: 'POST',
        credentials: "same-origin",
        body: JSON.stringify({
          typeId: el.evtype,
          name: el.evname,
          description: el.desc,
          visible: el.show,
          startDate: el.startDate,
          endDate: el.endDate,
          status: el.evstat,
          username: el.User.user.username
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
    saveUpdated: function() {
      let el = this;
      el.startDate = moment(el.startDate).format('YYYY-MM-DD');
      el.endDate = moment(el.endDate).format('YYYY-MM-DD');
      fetch(`${url}/event/${el.evid}`,{
        method: 'PUT',
        credentials: "same-origin",
        body: JSON.stringify({
          typeId: el.evtype,
          name: el.evname,
          description: el.desc,
          visible: el.show,
          startDate: el.startDate,
          endDate: el.endDate,
          status: el.evstat,
          username: el.User.user.username
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
    deleteEvent: function() {
      let el = this;
      const swalWithBootstrapButtons = Swal.mixin({
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        // buttonsStyling: false,
      })

      swalWithBootstrapButtons.fire({
        title: '¿Está seguro?',
        text: "No será capaz de revetir esta acción!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, elimínalo!',
        cancelButtonText: 'No',
        reverseButtons: true
      }).then((result) => {
        if (result.value) {
          fetch(`${url}/event/${el.evid}`,{
            method: 'DELETE',
            credentials: "same-origin",
            body: JSON.stringify({
              username: el.user.user.username
            }),
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then(res => res.json())
          .catch(err => console.error(err))
          .then(function(res){
            $('#addNewEvent').modal('hide');
            el.dismissData();
            Toast.fire({
              type: 'success',
              title: 'Eliminado correctamente'
            })
            el.callApi();
          })
        }
      })
    },
    callApi: function () {
      let el = this;
      el.fetchEvents(el.currentPeriod)
      .then(ready => {
        $('#addNewEvent').modal('hide');
        el.dismissData();
      })
    },
    dismissData: function () {
      let el = this;
      el.modText = 'Nuevo evento';
      el.evtype = '';
      el.evname = '';
      el.desc = '';
      el.evstat = 1;
      el.startDate = '';
      el.endDate = '';
      el.color = '#FFFFFF';
      el.edit = false;
    },
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
        fetch(`${url}/events/getEvents`,{
          method: 'POST',
          credentials: "same-origin",
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
    },
    activateCurrentCalendar: function() {
      let el = this;
      fetch(`${url}/configuration/activateCalendar`,{
        method: 'POST',
        credentials: "same-origin",
        body: JSON.stringify({
          activeCalendar: el.currentPeriod
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .catch(err => console.error(err))
      .then(res => {
        if(res.status == 200) {
          Toast.fire({
            type: 'success',
            title: 'Marcado como activo'
          })
          el.activePeriod = res.activeCalendar
        } else {
          Toast.fire({
            type: 'error',
            title: 'Hubo un error inesperado'
          })
        }
      })

    },

    publishApprovedEvents: function() {
      let el = this;
      let events = el.Events.filter(event => event.status == Status.APPROVED).map(event => event.id);
      fetch(`${url}/events/publishEvents`,{
        method: 'POST',
        credentials: "same-origin",
        body: JSON.stringify({
          events: events
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .catch(err => console.error(err))
      .then(res => {
        if(res.status == 200) {
          Toast.fire({
            type: 'success',
            title: res.message
          })
          el.fetchEvents(el.currentPeriod);
        } else {
          Toast.fire({
            type: 'error',
            title: 'Hubo un error inesperado'
          })
        }
      })
    },

    logout: function() {
      fetch('/logout', {method: 'POST'})
      .then(res => location.replace(res.url))
      .catch(error => console.error(error));
    },

    toggleEditEvent: function(event) {
      let el = this;
      el.modText = `Editar: ${event.name}`;
      el.evtype = event.typeId;
      el.evname = event.name;
      el.desc = event.description;
      el.startDate = event.startDate;
      el.endDate = event.endDate;
      el.evstat = event.status;
      el.evid = event.id;
      el.edit = true;
      $('#addNewEvent').modal();
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
    'event-picker': EventPicker,
    'calendar': Calendar,
    Datepicker
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
