import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
Vue.config.debug = true;
const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  state: {
    events: [],
    eventsType: []
  },
  getters: {
    allEvents(state) {
      return state.events;
    },
    allEventsType(state) {
      return state.eventsType;
    }
  },
  actions: {
    fetchEvents({commit}, {self}) {
      fetch("/api/event")
      .then(res => res.json())
      .catch((error) => {
        console.log(error);
      })
      .then(res => {
        commit("FETCH_EVENTS", res);
        self.refreshEvents();
      });
    },
    fetchEventsType({commit}, {self}) {
      fetch("/api/eventType")
      .then(res => res.json())
      .catch((error) => {
        console.log(error);
      })
      .then(res => {
        commit("FETCH_EVENTS_TYPE", res);
        self.refreshEventsType();
      });
    }
  },
  mutations: {
    FETCH_EVENTS(state, events) {
      state.events = events;
    },
    FETCH_EVENTS_TYPE(state, eventsType) {
      state.eventsType = eventsType;
    }
  },
  strict: debug
})