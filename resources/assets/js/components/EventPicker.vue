<template>
  <div class="event-picker-container">
    <a @click="[ true ? slideEvTypes() : displayEvTypes() ]"
      :class="$mq"
      id="slider"
      draggable="false"
      href="javascript:void(0)" role="button" class="float">
      <font-awesome-icon v-show="toggled" class="icon" icon="angle-double-left"/>
      <font-awesome-icon v-show="!toggled" class="icon" icon="angle-double-right"/>
    </a>
    <h3 class="title non-user-select">Referencia de eventos</h3>
    <div id="wrapper">
      <table id="events" style="width: 100%; padding-right: 1em; margin: -1px;">
        <tbody>
          <tr v-for="item of EventsType" :key="item.id" @click="select(item.id)" class="selectable">
            <td width="20%" class="text-center" style="">
              <canvas width="20px" height="20px" style="border: 2px solid #FFFFFF;" v-bind:style="{ background: item.color }"></canvas>
            </td>
            <td width="65%" style="font-variant: small-caps;">
              {{ item.name }}
            </td>
            <td width="20%" style="color: #04f06a;" class="text-center">
              <font-awesome-icon icon="check-square" v-show="selected == item.id && canEditEventTypes"/>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="buttons-container">
      <div class="btn-group" role="group" aria-label="Events buttons">
        <button @click="addNewEventType()" class="btn btn-sm btn-danger" :disabled="!canCreateEventTypes" type="button" data-toggle="modal" data-target="#typeEventPick">
          <span>
            <font-awesome-icon :icon="['fab','elementor']"/>
          </span>
          {{ !($mq == 'mobile'||$mq=='tablet') ? 'Tipo de evento' : ''}}
        </button>
        <button class="btn btn-sm btn-primary" type="button" data-toggle="modal" data-target="#eventModal">
          <font-awesome-icon icon="calendar-week"/>
          {{ !($mq == 'mobile'||$mq=='tablet') ? 'Eventos' : ''}}
        </button>
        <button @click="editSelected()" class="btn btn-sm btn-success" :disabled="!canEditEventTypes" type="button" data-toggle="modal" data-target="#typeEventPick">
          <font-awesome-icon icon="edit"/>
          {{ !($mq == 'mobile'||$mq=='tablet') ? 'Editar' : ''}}
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
              <div class="form-group mb-3 ml-3">
                <label for="colorPick">Color: </label>
                <sketch-picker id="colorPick" v-model="colors"></sketch-picker>
              </div>
              <div class="form-row">
                <div class="col align-self-center ml-3">
                  <div class="custom-control custom-checkbox">
                    <input type="checkbox" class="custom-control-input" id="evtypeRequired" v-model="ETRequired">
                    <label class="custom-control-label" for="evtypeRequired">Requerido</label>
                  </div>
                </div>
                <div class="col">
                  <div class="form-group mx-sm-3 mb-2">
                    <label for="eventName">Número requerido: </label>
                    <input type="number" min="0" class="form-control" id="countRequired" v-model="ETCountRequired">
                  </div>
                </div>
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
                    <div class="card">
                      <div class="card-body">
                        <h4 class="card-title">{{event.name}}</h4>
                        <p class="card-text mb-2"><strong>Inicio</strong>: {{ toLocale(event.startDate) }}</p>
                        <p class="card-text mb-2"><strong>Final</strong>: {{ toLocale(event.endDate) }}</p>
                        <table style="padding-right: 1em;">
                          <tr>
                            <tbody>
                              <td>
                                <canvas width="20px" height="20px" style="border: 2px solid black;" v-bind:style="{ background: getETColor(event.typeId) }"></canvas>
                              </td>
                              <td class="pl-1">
                                <small>{{ getETName(event.typeId) }}</small>
                              </td>
                              <td class="pl-1">
                                <small style="text-transform: capitalize;">| <strong>Clasificación: </strong> {{ getETClassification(event.typeId) }}</small>
                              </td>
                            </tbody>
                          </tr>
                        </table>
                        <h6 class="card-subtitle mb-2 mt-2 text-muted">Descripción:</h6>
                        <p class="card-text">{{ event.description }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Si no hay eventos para este año, mostrar una tarjeta -->
            <div v-show="Events.length == 0" class="card text-center text-white bg-danger mb-3" style="width: 100%;">
              <div class="card-header">Oh vaya!</div>
              <div class="card-body">
                <h5 class="card-title">No hay eventos!</h5>
                <p class="card-text">Parece que nadie ha añadido eventos para este ciclo.</p>
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
import { setTimeout } from 'timers';
import { User } from '../calendar';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
});

function selectFirstEvent(){
  let query = document.querySelector('[id="list-tab"]');
  if(query.childNodes.length > 0){
    let evSelect =  query.childNodes[0];
    query.childNodes.forEach(child => {
      if(child != evSelect && child.classList.contains("active") && child.classList.contains("show")){
        child.classList.remove('active', 'show');
        document.querySelector(`[id="${child.hash.substring(1)}"]`).classList.remove('active', 'show');
      }
    });
    evSelect.classList.add('active', 'show');
    document.querySelector(`[id="${evSelect.hash.substring(1)}"]`).classList.add('active', 'show');
  }
}

export default {
  props: {
    eventstype: Array,
    events: Array,
    classifs: Array,
    user: Object
  },
  data: function () {
    return {
      iSelected: 0,
      eSelected: 0,
      colors: '#090B10',
      ETName: '',
      ETRequired: false,
      ETCountRequired: 0,
      classificationId: 1,
      modText: 'Agregar nuevo tipo de evento',
      eventTArray: [],
      eventArray: [],
      edit: false,
      toggled: false
    }
  },
  created: function() {
    let el = this;
    el.EventsType = el.eventstype;
    el.selected = el.EventsType[0].id;

    new Promise((resolve, reject)=>{

      setTimeout(() => {
        el.Events = el.events;
      }, 2000);

      setTimeout(() => {
        resolve("ready")
      }, 2500);

    }).then(response => { selectFirstEvent(); })
    // el.eventSelect = el.Events[el.Events.length - 1].id;

    /* JUST TO FETCH */
    // store.dispatch("fetchEventsType", {self: this});
    // store.dispatch("fetchEvents", {self: this});
  },
  mounted: function() {
    // let back = document.getElementsByClassName('modal-backdrop');
    // console.log(back);
  },
  watch: {
    $mq: function(nue, old){
      if(old == 'tablet' || old == 'mobile'){
        if(nue == 'desktop' || nue == 'laptop'){
          this.toggled = false;
          let slid = document.getElementById('slider');
          let evpicker = document.getElementById('eventpicker');
          evpicker.style.width = '0px';
          slid.classList.remove('slide-in');
          slid.classList.add('slide-out');
        }
      }
    },
    events: function(nue, old) {
      this.Events = nue;
      setTimeout(() => { selectFirstEvent(); }, 500);
    }
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
        this.$emit('eventsTChange', array);
        this.eventTArray = array;
      }
    },
    Events: {
      get: function() {
        return this.eventArray;
      },
      set: function(array) {
        this.$emit('eventsChange', array);
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
    },
    /** Start Permission Props*/
    canEditEventTypes: function () {
      let el = this;
      if(el.user instanceof User)
        return el.user.canEditEventTypes();
      return false;
    },
    canCreateEventTypes: function () {
      let el = this;
      if(el.user instanceof User)
        return el.user.canCreateEventTypes();
      return false;
    }
    /** End Permission Props*/
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
      this.ETRequired = false;
      this.ETCountRequired = 0;
      this.classificationId = 1;
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
      let el = this;
      el.Edit = true;
      el.modalText = 'Editar tipo de evento';
      let selectedEvent = el.EventsType.find(item => el.selected == item.id);
      this.colors = selectedEvent.color;
      this.ETName = selectedEvent.name;
      this.ETRequired = selectedEvent.required;
      this.ETCountRequired = selectedEvent['count_required'];
      this.classificationId = selectedEvent.classification.id;
    },
    saveNew: function () {
      let el = this;
      fetch('/eventType',{
        method: 'POST',
        credentials: "same-origin",
        body: JSON.stringify({
          name: el.ETName,
          color: el.colors.hex != undefined ? el.colors.hex : el.colors,
          required: el.ETRequired,
          count: el.ETCountRequired
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
      fetch(`/eventType/${el.selected}`,{
        method: 'PUT',
        credentials: "same-origin",
        body: JSON.stringify({
          name: el.ETName,
          color: el.colors.hex != undefined ? el.colors.hex : el.colors,
          required: el.ETRequired,
          count: el.ETCountRequired
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
          fetch(`/eventType/${el.selected}`,{
            method: 'DELETE',
            credentials: "same-origin"
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
      fetch('/eventType')
      .then(res => res.json())
      .catch(err => console.error(err))
      .then(function(res){
        el.EventsType = res;
        $('#typeEventPick').modal('hide');
        el.dismissData();
      })
    },
    getETColor: function(id) {
      let evtype = this.EventsType.find(et => et.id == id);
      return evtype.color;
    },
    getETName: function(id) {
      let evtype = this.EventsType.find(et => et.id == id);
      return evtype.name;
    },
    getETClassification: function(id) {
      let evtype = this.EventsType.find(et => et.id == id);
      return evtype.classification.name;
    },
    slideEvTypes: function(){
      let slid = document.getElementById('slider');
      let evpicker = document.getElementById('eventpicker');
      if(this.toggled){
        evpicker.style.width = '0px';
        slid.classList.remove('slide-in');
        slid.classList.add('slide-out');
      } else {
        evpicker.style.width = '300px';
        slid.classList.remove('slide-out');
        slid.classList.add('slide-in');
      }
      this.toggled = !this.toggled;
    },
    displayEvTypes: function(){
      console.log('now display');
    },
    toLocale: function(date) {
      return new Date(`${date} 00:00:00`).toLocaleDateString('es-ES', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
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

  #wrapper {
    width: 100%;
  }

  .event-picker-container {
    width: 100%;
    height: 100%;
    background: #2c3e50;
    color: white;
    border-radius: 10px;
    border: 1px solid yellowgreen;
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

  #colorPick {
    margin: 0 auto;
  }

  #classifs {
    text-transform: capitalize;
  }

  #events tr {
    display: flex;
    align-items: center;
  }

  #events tr:hover {
    background-color: rgba(50, 50, 50, 0.5);
    border-radius: 10px;
  }

  #events tbody {
    display: block;
    height: 409px;
    overflow: auto;
  }

  #events tbody::-webkit-scrollbar {
    width: 12px;
    background-color: #559;
  }

  #events tbody::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    background-color: #559;
    /* border: solid 3px transparent; */
  }

  #events tbody::-webkit-scrollbar-thumb {
    box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    background-color: #2c3e50;
    /* border: solid 3px transparent; */
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
