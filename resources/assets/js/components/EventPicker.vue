<template>
  <div class="event-picker-container">
    <h1 class="title">Referencia de eventos</h1>
    <table id="events" style="width: 100%; padding-right: 1em;">
      <tbody>
        <tr v-for="item of EventsType" :key="item.id" @click="select(item.id)" class="selectable">
          <td width="20%" class="text-center" style="">
            <canvas width="20px" height="20px" style="border: 2px solid white;" v-bind:style="{ background: item.color }"></canvas>
          </td>
          <td width="65%" style="font-variant: small-caps;">
            {{ item.name }}
          </td>
          <td width="20%" style="color: #04f06a;" class="text-center">
            <font-awesome-icon icon="check-square" v-show="selected == item.id"/>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="buttons-container">
      <div class="btn-group" role="group" aria-label="Events buttons">
        <button @click="addNewEventType()" class="btn btn-sm btn-danger" type="button" data-toggle="modal" data-target="#typeEventPick">
          <span>
            <font-awesome-icon icon="calendar-plus"/>
          </span>
          Tipo de evento
        </button>
        <button class="btn btn-sm btn-primary" type="button" data-toggle="modal" data-target="#eventModal">
          <font-awesome-icon icon="calendar-day"/>
          Eventos
        </button>
        <button @click="editSelected()" class="btn btn-sm btn-success" type="button" data-toggle="modal" data-target="#typeEventPick">
          <font-awesome-icon icon="edit"/>
          Editar
        </button>
      </div>
    </div>
    <!-- Modal TIPO de EVENTO -->
    <div class="modal fade" id="typeEventPick" tabindex="-1" role="dialog" aria-labelledby="typeEventPickLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="typeEventPickLabel" v-text="modalText"></h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form class="form">
              <div class="form-group mx-sm-3 mb-2">
                <label for="eventName">Nombre: </label>
                <input type="text" class="form-control" id="eventName" placeholder="Nombre del evento" v-model="ETName">
              </div>
              <div class="form-group mb-2 ml-3">
                <label for="colorPick">Color: </label>
                <sketch-picker id="colorPick" v-model="colors"></sketch-picker>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button @click="dismissData()" type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
            <button @click="saveEventType(edit)" type="button" class="btn btn-primary">{{ edit ? "Guardar" : "Agregar" }}</button>
            <button @click="deleteEvent()" v-show="Edit" type="button" class="btn btn-danger">Eliminar</button>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal TIPO de EVENTO -->
    <div class="modal fade" id="eventModal" tabindex="-1" role="dialog" aria-labelledby="EventModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="EventModalLabel">Eventos</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-4">
                <div class="list-group" id="list-tab" role="tablist">
                  <a v-for="event of Events" :key="event.id" class="list-group-item list-group-item-action" id="list-home-list" data-toggle="list" :href="'#list-'+event.id" role="tab" aria-controls="home">
                    {{ event.name }}
                  </a>
                </div>
              </div>
              <div class="col-8">
                <div class="tab-content" id="nav-tabContent">
                  <div v-for="event of Events" :key="event.id" class="tab-pane fade" :id="'list-'+event.id" role="tabpanel" aria-labelledby="list">
                    <h1>{{event.name}}</h1>
                    <p>Inicio: {{ event.startDate }} | Final: {{ event.endDate }}</p>
                    <small>ID de tipo: {{ event.typeId }}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-primary">Aceptar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import { Sketch } from 'vue-color';
import store from '../store/store';
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
});
export default {
  props: {
    eventstype: Array,
    events: Array
  },
  data: function () {
    return {
      array: [
        { id: 1, name: "Nombre del evento", eventType: 1, startDate: "1/1/2018", endDate: "10/1/2018" },
      ],      
      period: {},
      iSelected: 0,
      eSelected: 0,
      colors: '#090B10',
      ETName: '',
      modText: 'Agregar nuevo tipo de evento',
      eventTArray: [],
      eventArray: [],
      edit: false
    }
  },
  created: function() {
    this.EventsType = this.eventstype;
    this.Events = this.events;
    this.selected = this.EventsType[0].id;
    this.eventSelect = this.Events[this.Events.length - 1].id;
    /* JUST TO FETCH */
    // store.dispatch("fetchEventsType", {self: this});
    // store.dispatch("fetchEvents", {self: this});
  },
  computed: {
    selected: {
      get: function() {
        return this.iSelected;
      },
      set: function(item) {
        this.iSelected = item;
      }
    },
    eventSelect: {
      get: function() {
        return this.eSelected;
      },
      set: function(item) {
        this.eSelected = item;
      }
    },
    EventsType: {
      get: function() {
        return this.eventTArray;
      },
      set: function(array) {
        this.eventTArray = array;
      }
    },
    Events: {
      get: function() {
        return this.eventArray;
      },
      set: function(array) {
        this.eventArray = array;
      }
    },
    modalText: {
      get: function() {
        return this.modText;
      },
      set: function(text) {
        this.modText = text;
      }
    },
    Edit: {
      get: function() {
        return this.edit;
      },
      set: function(val) {
        this.edit = val;
      }
    }
  },
  methods:{
    refreshEventsType: function(){
      this.EventsType = store.state.eventsType;
    },
    refreshEvents: function() {
      this.Events = store.state.events;
    },
    select: function (id) {
      this.selected = id;
    },
    dismissData: function () {
      this.modalText = 'Agregar nuevo tipo de evento';
      this.colors = '#090B10';
      this.ETName = '';
    },
    addNewEventType: function() {
      this.dismissData();
      this.Edit = false;
    },
    saveEventType: function (edit) {
      let el = this;
      if(el.ETName == ''){
        Toast.fire({
          type: 'warning',
          title: 'El nombre no puede estar vacío'
        })
        return;
      }
      if(edit){
        el.updateEl();
      } else {
        el.saveNew();
      }
    },
    editSelected: function (){
      this.Edit = true;
      this.modalText = 'Editar tipo de evento';
      let selectedEvent = {};
      for (let i = 0; i < this.EventsType.length; i++) {
        let event = this.EventsType[i];
        if(this.selected == event.id){
          selectedEvent = event;
          break;
        }
      }
      this.colors = selectedEvent.color;
      this.ETName = selectedEvent.name;
    },
    saveNew: function () {
      let el = this;
      fetch('/api/eventType',{
        method: 'POST',
        body: JSON.stringify({
          name: el.ETName,
          color: el.colors.hex != undefined ? el.colors.hex : el.colors
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
    updateEl: function () {
      let el = this;
      fetch(`/api/eventType/${el.selected}`,{
        method: 'PUT',
        body: JSON.stringify({
          name: el.ETName,
          color: el.colors.hex != undefined ? el.colors.hex : el.colors
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
          title: 'Actualizado correctamente'
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
          fetch(`/api/eventType/${el.selected}`,{
            method: 'DELETE',
          })
          .then(res => res.json())
          .catch(err => console.error(err))
          .then(function(res){
            $('#typeEventPick').modal('hide');
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
      fetch('/api/eventType')
      .then(res => res.json())
      .catch(err => console.error(err))
      .then(function(res){
        el.EventsType = res;
        $('#typeEventPick').modal('hide');
        el.dismissData();
      })
    }
  },
  components: {
    'sketch-picker': Sketch
  }
}
</script>

<style scoped>
  * {
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  }
  canvas {
    padding-left: 0;
    padding-right: 0;
    margin-left: auto;
    margin-right: auto;
    margin-top: 0.35em;
    margin-bottom: 0.35em;
    display: block;
  }

  .event-picker-container {
    width: 100%;
    height: 100%;
    background: rgb(9, 11, 16);
    color: white;
    border-radius: 10px;
  }

  #typeEventPick, #eventModal {
    color: black;
  }

  .title {
    padding-left: 0.5em;
    margin-top: 0.5rem;
  }

  .list {
    list-style: none;
  }

  .selectable {
    -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Safari */
      -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Firefox */
          -ms-user-select: none; /* Internet Explorer/Edge */
              user-select: none; /* Non-prefixed version, currently
                                    supported by Chrome and Opera */
    cursor: pointer;
  }

  #events tr:hover {
    background-color: rgba(50, 50, 50, 0.5);
    border-radius: 10px;
  }

  .buttons-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0.5rem;
    margin-top: 1rem;
  }

</style>
