<template>
  <v-form ref="formRegister" @submit.prevent="login" lazy-validation>
    <h2 class="mb-4" >{{this.editing?'Editar Perfil':''}}</h2>
    <v-container>
      <v-row>
        <v-col class="mr-5">
          <v-row>
            <v-text-field
              v-model="username"
              label="Usuário"
              :rules="rulesUsername"
            ></v-text-field>
          </v-row>
          <v-row>
            <v-text-field
              v-model="password"
              :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show ? 'text' : 'password'"
              @click:append="show = !show"
              :rules="rulesPassword"
              label="Senha"
            ></v-text-field>
          </v-row>
        </v-col>
        <v-col>
          <v-row>
            <v-text-field
              v-model="first_name"
              :rules="rulesUsername"
              label="Primeiro nome"
            ></v-text-field>
          </v-row>
          <v-row>
            <v-text-field
              v-model="last_name"
              :rules="rulesUsername"
              label="Ultimo nome"
            ></v-text-field>
          </v-row>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="dateFormatted"
                @blur="date = parseDate(dateFormatted)"
                label="Data de nascimento"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="birth_date"
              locale="pt-BR"
              :active-picker.sync="activePicker"
              :max="
                new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                  .toISOString()
                  .substr(0, 10)
              "
              min="1950-01-01"
              @change="save"
            ></v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn block color="primary" elevation="4" type="submit"
            >{{(!this.editing?'Cadastrar':'Salvar')}}</v-btn
          >
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
export default {
  // eslint-disable-next-line
  name: "Register",

  data() {
    return {
      username: "",
      password: "",
      first_name: "",
      last_name: "",
      show: false,
      birth_date: null,
      activePicker: null,
      menu: false,
      date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      dateFormatted: this.formatDate(
        new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substr(0, 10)
      ),
      rulesUsername: [
          value => !!value || 'Required.',
      ],
      rulesPassword: [
          value => !!value || 'Required.',
          value => (value && value.length >= 8) || 'Min 8 characters',
      ],
    };
  },
  props: {
    dialog: { type: Boolean },
    editing: { type: Boolean },
    user: { type: Object },
  },
  mounted() {
    if(this.editing){
      this.username = this.user.username
      this.password = this.user.password
      this.first_name = this.user.first_name
      this.last_name = this.user.last_name
      this.birth_date = this.user.birth_date.substr(0, 10)
    }
  },
  watch: {
    birth_date(val) {
      this.dateFormatted = this.formatDate(val);
    },
  },
  computed: {
    computedDateFormatted() {
      return this.formatDate(this.date);
    },
  },
  methods: {
    login() {
      if (!this.$refs.formRegister.validate()) return;

      const body = {
        username: this.username,
        password: this.password,
        first_name: this.first_name,
        last_name: this.last_name,
        birth_date: this.birth_date,
      };

      this.$root.$children[0]
        .post(
          `/calendar/register`,
          body,
          "",
          true,
          "Usuário criado com sucesso",
          "success"
        )
        .then(() => {
          this.$emit("closeDialog");
        });

      (this.username = ""),
        (this.password = ""),
        (this.first_name = ""),
        (this.last_name = ""),
        (this.birth_date = null);
    },
    save(birth_date) {
      this.$refs.menu.save(birth_date);
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
