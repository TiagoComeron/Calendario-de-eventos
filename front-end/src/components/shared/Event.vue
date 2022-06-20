<template>
  <div>
  <h2>{{this.new?'Criar Evento':''}}</h2>
  <v-form v-if="this.editing || this.new" class="px-5" ref="formRegister" @submit.prevent="editar" lazy-validation>
    <v-container>
      <v-row>
        <v-col cols="12" class="mr-5">
          <v-row>
            <v-text-field
              v-model="name"
              label="Título"
              :rules="rulesTitle"
            ></v-text-field>
          </v-row>
          <v-row>
            <v-text-field
              v-model="description"
              label="Descrição"
              :rules="rulesDescription"
            ></v-text-field>
          </v-row>
        </v-col>
        <v-col>
          <v-row>
          </v-row>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-menu
            ref="menuStart"
            v-model="menuStart"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="dateFormatted"
                :rules="rulesStart"
                @blur="date = parseDate(dateFormatted)"
                label="De:"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="start"
              locale="pt-BR"
              :active-picker.sync="activePicker"
              :max="
                new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                  .toISOString()
                  .substr(0, 10)
              "
              min="1950-01-01"
              @change="saveStart"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <v-col>
          <v-menu
            ref="menuEnd"
            v-model="menuEnd"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="dateFormattedEnd"
                :rules="rulesEnd"
                @blur="dateEnd = parseDate(dateFormattedEnd)"
                label="Até(Opcional):"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="end"
              locale="pt-BR"
              :active-picker.sync="activePicker"
              :max="
                new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                  .toISOString()
                  .substr(0, 10)
              "
              min="1950-01-01"
              @change="saveEnd"
            ></v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn block color="primary" elevation="4" type="submit"
            >{{(this.editing?'Salvar':'Criar')}}</v-btn
          >
        </v-col>
      </v-row>
    </v-container>
  </v-form>
  <v-container class="px-5" v-if="!this.editing && !this.new">
    <v-row>
      <v-col>
      <h2 class="font-weight-black">
      {{name}}
      </h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
      <span>
      {{description}}
      </span>
      </v-col>
    </v-row>
    <!-- Aqui ficará a exibição do inicio e término do evento<v-row>
      <v-col>
        <span>
        Começa em: {{start}}
        </span>
      </v-col>
      <v-col>
        <span v-if="!!end">
        Até: {{end}}
        </span>
      </v-col>
    </v-row> -->
  </v-container>
  </div>
</template>

<script>
export default {
  name: "NewEvent",

  data() {
    return {
      id: '',
      name: '',
      description: '',
      start: null,
      end: null,
      show: false,
      activePicker: null,
      menuStart: false,
      menuEnd: false,
      date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      dateFormatted: null,
      // dateFormatted: this.formatDate(
      //   new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      //     .toISOString()
      //     .substr(0, 10)
      // ),
      dateEnd: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      dateFormattedEnd: null,
      rulesTitle: [
          value => !!value || 'Required.',
      ],
      rulesDescription: [
          value => (value && value.length >= 8) || 'Min 8 characters',
      ],
      rulesStart: [
          value => (!!value) || 'Required.',
          value => ((new Date(value) <= new Date(this.end)) || this.end == null) || 'Data inicial deve ser menor'
      ],
      rulesEnd: [
        value => (new Date(value) >= new Date(this.start) || !this.end) || 'Data final deve ser maior.'
      ]
    };
  },
  mounted() {
      if(this.selectedOpen){
        this.id = this.selectedEvent.id,
        this.name = this.selectedEvent.name,
        this.description = this.selectedEvent.description
      }  
    },
  props: {
    selectedOpen: { type: Boolean },
    selectedEvent: { type: Object },
    editing: { type: Boolean },
    new: { type: Boolean },
  },
  watch: {
    start(val) {
      this.dateFormatted = this.formatDate(val);
    },
    end(val) {
      this.dateFormattedEnd = this.formatDate(val);
    },
    selectedOpen(){
      console.log(this.selectedEvent);
      this.id = this.selectedEvent.id,
      this.name = this.selectedEvent.name,
      this.description = this.selectedEvent.description
    }
  },
  computed: {
    computedDateFormatted() {
      return this.formatDate(this.date);
    },
    computedDateFormattedEnd() {
      return this.formatDate(this.dateEnd);
    },
  },
  methods: {
    editar() {

      if (!this.$refs.formRegister.validate()) return;

      const body = {
        name: this.name,
        description: this.description,
        event_begin: this.start,
        event_end: this.end,
      };

      if(this.editing){
        this.$root.$children[0]
        .patch(
          `/calendar/event/update/`+this.id,
          body,
          false,
          true,
          "Evento alterado com sucesso.",
          "success"
        )
        .then(() => {
          this.$emit("reloadCalendar");
          this.$emit("closeShow");
        });
      }
      else{
        this.$root.$children[0]
        .post(
          `/calendar/event/create/`,
          body,
          false,
          true,
          "Evento criado com sucesso.",
          "success"
        )
        .then(() => {
          this.$emit("closeDialog");
          this.$emit("reloadCalendar");
        });
      }

    },
    saveStart(start) {
      this.$refs.menuStart.save(start);
    },
    saveEnd(end) {
      this.$refs.menuEnd.save(end);
    },
    formatDate(date) {
      if (!date) return null;
      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    },
    parseDate(date) {
      if (!date) return null;
      const [month, day, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
  },
};
</script>
