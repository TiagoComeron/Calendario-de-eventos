<template>
  <v-container class="pa-0 pt-8">
    <v-app-bar :color="'#1F4690'" class="d-flex justify-end "  app>
        <v-row>
          <v-col>
            <v-btn color="secondary" elevation="4" @click.stop="dialogUser = true, editingUser = true">Editar Perfil</v-btn>
              <v-dialog
              v-model="dialogUser"
              persistent
              max-width="500px"
              @click:outside="dialogUser = false,editingUser = false"
              >
              <v-card class="pa-10" elevation="2">
                  <register :user="user" :editing="editingUser" :dialog="dialogUser" @closeDialog="dialogUser = false, editingUser = false"/>
              </v-card>
              </v-dialog>
          </v-col>
          <v-col>
            <v-btn color="error" elevation="4" v-on:click.prevent="logout">Sair</v-btn>
          </v-col>
        </v-row>
    </v-app-bar>
    <v-card class="pa-10 ma-md-13 " elevation="2">
      <v-row class="fill-height">
        <v-col>
          <v-sheet height="64">
            <v-toolbar flat>
              <v-btn
                outlined
                class="mr-sm-0 mr-md-4"
                color="grey darken-2"
                  @click.stop="dialogEvent = true"
              >Novo evento</v-btn>
              <v-dialog
              v-model="dialogEvent"
              persistent
              max-width="500px"
              @click:outside="dialogEvent = false" >
                <v-card class="pa-10" elevation="2">
                    <event :dialogEvent="dialogEvent" :new="true" @closeDialog="dialogEvent = false" @reloadCalendar="updateRange({})"/>
                </v-card>
              </v-dialog>
              <v-btn
                outlined
                class="mr-4 d-none d-md-block"
                color="grey darken-2"
                @click="setToday"
              >
                Hoje
              </v-btn>
              <v-btn fab text small color="grey darken-2" @click="prev">
                <v-icon small> mdi-chevron-left </v-icon>
              </v-btn>
              <v-btn fab text small color="grey darken-2" @click="next">
                <v-icon small> mdi-chevron-right </v-icon>
              </v-btn>
              <v-toolbar-title v-if="$refs.calendar">
                {{ $refs.calendar.title }}
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-menu bottom right>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    outlined
                    color="grey darken-2"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <span>{{ typeToLabel[type] }}</span>
                    <v-icon right> mdi-menu-down </v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item @click="type = 'day'">
                    <v-list-item-title>Dia</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="type = 'week'">
                    <v-list-item-title>Semana</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="type = 'month'">
                    <v-list-item-title>Mês</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="type = '4day'">
                    <v-list-item-title>4 dias</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-toolbar>
          </v-sheet>
          <v-sheet height="600">
            <v-calendar
              ref="calendar"
              v-model="focus"
              color="primary"
              locale="pt-BR"
              :events="events"
              :event-color="getEventColor"
              :type="type"
              @click:event="showEvent"
              @click:more="viewDay"
              @click:date="viewDay"
              @change="updateRange"
            >
              <template v-slot:event="{ event }">
                <span class="pl-2">
                {{event.name}}
                </span>
              </template>
            </v-calendar>
            <v-menu
              v-model="selectedOpen"
              :close-on-content-click="false"
              :activator="selectedElement"
              offset-x
            >
              <v-card color="grey lighten-4" min-width="350px" flat>
                <v-toolbar :color="selectedEvent.color" dark>
                  <v-btn @click="editing = !editing" icon>
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn icon>
                    <v-icon @click="delRecord(selectedEvent)" >mdi-trash-can</v-icon>
                  </v-btn>
                </v-toolbar>
                <event 
                  :selectedOpen="selectedOpen" 
                  :selectedEvent="selectedEvent" 
                  :editing="editing" 
                  @reloadCalendar="updateRange({})" 
                  @closeShow="selectedOpen=false;"
                />
              </v-card>
            </v-menu>
          </v-sheet>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import Event from "./shared/Event.vue";
import Register from './shared/Register.vue'

export default {
  // eslint-disable-next-line
  name: "Home",
  components: {
    Event,
    Register
  },
  data: () => ({
    user: null,
    dialogEvent: false,
    dialogUser: false,
    focus: "",
    type: "month",
    typeToLabel: {
      month: "Mês",
      week: "Semana",
      day: "Dia",
      "4day": "4 Dias",
    },
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    colors: ["#293462", "#F24C4C", "#EC9B3B", "#FFE5B4", "#371B58", "#1363DF"],
    items: [{ title: "Sair" }],
    editing: false,
    editingUser: true
  }),
  mounted() {
    this.$refs.calendar.checkChange();
    this.setUser()
  },
  methods: {
    async delRecord(event) {
		console.log(event);
		const body = {
			id: event.id
		};

		this.$root.$children[0]
        .delete(
          `/calendar/event/delete/`+body.id,
          body,
          false,
          true,
          "Evento deletado com sucesso.",
          "success"
        )
        .then(() => {
          this.updateRange({});
          this.selectedOpen=false
        });

	},
    async setUser(){
      const response = await this.$root.$children[0].get(false,`/calendar/user/profile`)
      this.user = response.data
    },
    logout() {
      this.$root.$children[0].get(
        true,
        `/calendar/logout`,
        "login",
        true,
        "Retornando a tela de login.",
        "success"
      );
    },
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = "";
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => (this.selectedOpen = true))
        );
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        requestAnimationFrame(() => requestAnimationFrame(() => open()));
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    async updateRange({ start, end }) {
      const events = [];

      const response = await this.$root.$children[0].get(
        false,
        `/calendar/event/findAll`
      );
      if (response.data) {
        for (let i = 0; i < response.data.length; i++) {
          const event = response.data[i];
          start = new Date(event.event_begin);
          end = new Date(event.event_end);
          const allDay = this.rnd(0, 3) === 0;
          events.push({
            id: event._id,
            name: event.name,
            description: event.description,
            start: start,
            end: end,
            guests: event.guests,
            color: this.colors[this.rnd(0, this.colors.length - 1)],
            timed: !allDay,
          });
        }
      }

      this.events = events;
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
  },
};
</script>