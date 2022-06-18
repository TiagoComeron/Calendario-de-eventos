<template>
    <v-container class="justify-center" fill-height fluid>
        <v-card class="pa-10" elevation="2">
            <p>Calendário de eventos</p>
            <div>
                <v-text-field
                v-model="username"
                label="Username"
                :rules="rulesUsername"
                hide-details="auto"
                ></v-text-field>
                <v-text-field v-model="password" :rules="rulesPassword" label="Senha"></v-text-field>
            </div>
            <v-btn
                block
                color="primary"
                elevation="4"
                v-on:click.prevent="loginUser"
            >Login</v-btn>
        </v-card>
    </v-container>
</template>

<script>
export default {
    // eslint-disable-next-line
    name: 'Login',
    data: () => ({
        username: '',
        password: '',
        rulesUsername: [
            value => !!value || 'Required.',
        ],
        rulesPassword: [
            value => !!value || 'Required.',
            value => (value && value.length >= 3) || 'Min 8 characters',
        ],
    }),
    methods: {
        loginUser() {
            console.log(this.$root)
            // this.$router.push('/home')
        }
    }
}
</script>