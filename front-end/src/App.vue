<template>
  <v-app :style="{background: 'linear-gradient(180deg, #1F4690 52%, #3A5BA0 72%)'}">
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
      return axios.post(url, body, {headers: {'authorization': this.$cookies.get('authorization')}}).then(response => {
          if(redirect)
            this.$router.push('/'+redirect)
          if(message)
            this.exibirMensagem((messageText?messageText:response.data.message), cor)
        if(response.headers.authorization)
          this.$cookies.set('authorization', response.headers.authorization)
        if(response.headers.user_id)
          this.$cookies.set('user_id', response.headers.user_id)
      })
      .catch(e => {
          if(e.response.status == 403){
            if(e.response.data.type == 'permission')
              this.exibirMensagem(e.response.data.message, 'error')
            else{
              if(this.$router.currentRoute.path != '/login'){
                this.exibirMensagem(e.response.data.message, 'error')
                this.$router.push('/login')
              }
            }
          }
          if(e.response.status == 400){
            this.exibirMensagem(e.response.data.message, 'error')
          }
      })
    },
    async get(pro, url, redirect, message, messageText, cor){
      const promisse = axios.get(url, {headers: {'authorization': this.$cookies.get('authorization')}})
      if(pro){
          return promisse.then(response => {
            if(redirect)
              this.$router.push('/'+redirect)
            if(message)
              this.exibirMensagem((messageText?messageText:response.data.message), cor)
          if(response.headers.authorization)
            this.$cookies.set('authorization', response.headers.authorization)
        })
        .catch(e => {
          if(e.response.status == 403){
            if(e.response.data.type == 'permission')
              this.exibirMensagem(e.response.data.message, 'error')
            else{
                if(this.$router.currentRoute.path != '/login'){
                  this.exibirMensagem(e.response.data.message, 'error')
                  this.$router.push('/login')
                }
            }
            }
            if(e.response.status == 400){
              this.exibirMensagem(e.response.data.message, 'error')
            }
        })
      }
      else{
        return promisse
      }
    },
    patch(url, body, redirect, message, messageText, cor){
      return axios.patch(url, body, {headers: {
        'authorization': this.$cookies.get('authorization'),
        'user_id': this.$cookies.get('user_id'),
        }}).then(response => {
          if(redirect)
            this.$router.push('/'+redirect)
          if(message)
            this.exibirMensagem((messageText?messageText:response.data.message), cor)
        if(response.headers.authorization)
          this.$cookies.set('authorization', response.headers.authorization)
      })
      .catch(e => {
          if(e.response.status == 403){
            if(e.response.data.type == 'permission')
              this.exibirMensagem(e.response.data.message, 'error')
            else{
              if(this.$router.currentRoute.path != '/login'){
                this.exibirMensagem(e.response.data.message, 'error')
                this.$router.push('/login')
              }
            }
          }
          if(e.response.status == 400){
            this.exibirMensagem(e.response.data.message, 'error')
          }
      })
    },
  },
  created() {
    if(this.$router.currentRoute.path != '/login'){
      this.get(true,'/calendar/user/profile')
    }
    else{
      this.$cookies.set('authorization','')
    }
  },
};
</script>
