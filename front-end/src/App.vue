<template>
  <v-app>
    <!-- <v-app-bar
      app
      color="primary"
      dark
    > -->
      <!-- <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn> -->
    <!-- </v-app-bar> -->

    <!-- <v-main>
      <Login />
    </v-main> -->
    <v-snackbar
      v-model="snackbar"
      :multi-line="multiLine"
      top
      :color="corSnackbar"
      timeout='3000'
      class="mt-8"
    >
      <div class="pa-2">{{ text }}</div>
    </v-snackbar>
    <router-view/>
  </v-app>
</template>

<script>

import axios from './axios';
axios.defaults.baseURL = 'http://localhost:8080';

export default {
  name: 'App',


  data: () => ({
    snackbar: false,
    text: '',
    multiLine:true,
    corSnackbar: '',
  }),
  methods: {
    exibirMensagem(text, cor) {
      this.text = text;
      this.corSnackbar = cor;
      this.snackbar = true;
    },
    post(url, body, redirect, message, messageText, cor){
      return axios.post(url, body, {headers: {'authorization': this.$cookies.get('authorization')}})
      .then(response => {
          if(redirect)
            this.$router.push('/'+redirect)
          if(message)
            this.exibirMensagem((messageText?messageText:response.data.message), cor)
        if(response.headers.authorization)
          this.$cookies.set('authorization', response.headers.authorization)
      })
      .catch(e => {
          if(e.response.status == 403){
            this.$cookies.set('authorization','')
              if(this.$router.currentRoute.path != '/login'){
                this.exibirMensagem(e.response.data.message, 'error')
                this.$router.push('/login')
              }
          }
          if(e.response.status == 400){
            this.exibirMensagem(e.response.data.message, 'error')
          }
      })
    },
    get(url, redirect, message, messageText, cor){
      axios.get(url, {headers: {'authorization': this.$cookies.get('authorization')}})
      .then(response => {
          if(redirect)
            this.$router.push('/'+redirect)
          if(message)
            this.exibirMensagem((messageText?messageText:response.data.message), cor)
        if(response.headers.authorization)
          this.$cookies.set('authorization', response.headers.authorization)

      })
      .catch(e => {
          if(e.response.status == 403){
            this.$cookies.set('authorization','')
              if(this.$router.currentRoute.path != '/login'){
                this.exibirMensagem(e.response.data.message, 'error')
                this.$router.push('/login')
              }
          }
          if(e.response.status == 400){
            this.exibirMensagem(e.response.data.message, 'error')
          }
      })
    }
  },
  created() {
    this.get('/calendar/user/profile')
  },
};
</script>
