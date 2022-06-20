<template>
    <v-container class="justify-center" fill-height fluid>
        <v-card class="pa-10" elevation="2">
            <v-form ref="form" @submit.prevent="login" lazy-validation>
                <v-row>
                <v-col>
                        <v-text-field
                        v-model="username"
                        label="Usuário"
                        :rules="rulesUsername"
                        hide-details="auto"
                        ></v-text-field>
                        <v-text-field v-model="password" 
                        :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="show ? 'text' : 'password'"
                        @click:append="show = !show"
                        :rules="rulesPassword" label="Senha"></v-text-field>
                </v-col>
                </v-row>
                <v-row>
                <v-col>
                    <v-btn
                        block
                        color="primary"
                        elevation="4"
                        type="submit"
                    >Login</v-btn>
                </v-col>
                </v-row>
                    <v-divider class="ma-3"></v-divider>
                <v-row >
                <v-col>
                    <v-btn
                        color="light"
                        width="100%"
                        @click.stop="dialog = true"
                    >Cadastrar</v-btn>
                    <v-dialog
                    v-model="dialog"
                    persistent
                    max-width="500px"
                    @click:outside="dialog = false"
                    >
                    <v-card class="pa-10" elevation="2">
                        <Register :dialog="dialog" @closeDialog="dialog = false"/>
                    </v-card>
                    </v-dialog>
                </v-col>
                </v-row>
            </v-form>
        </v-card>
    </v-container>
</template>

<script>

import Register from './shared/Register.vue'

export default {
    // eslint-disable-next-line
    name: 'Login',
    components:{
        Register
    },
    data: () => ({
        username: '',
        password: '',
        dialog: false,
        show: false,
        rulesUsername: [
            value => !!value || 'Required.',
        ],
        rulesPassword: [
            value => !!value || 'Required.',
            value => (value && value.length >= 8) || 'Min 8 characters',
        ],
    }),
    methods: {
        login() {
            if(!this.$refs.form.validate()) return
            
            const body = {
                username: this.username,
                password: this.password
            }
            this.$root.$children[0].post(`/calendar/login`, body, 'home', true, null, 'success')
        },
    },
}
</script>