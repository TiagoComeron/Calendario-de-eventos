<template>
    <v-container class="justify-center" fill-height>
        <v-card class="pa-10" elevation="2">
            <v-form ref="form"  lazy-validation>
                <v-btn
                    block
                    color="error"
                    elevation="4"
                    v-on:click.prevent="logout"
                >Não clique aqui</v-btn>
            </v-form>
        </v-card>
    </v-container>
</template>

<script>

export default {
    // eslint-disable-next-line
    name: 'Home',
    data: () => ({
    }),
    methods: {
        logout() {
            this.$root.$children[0].get(`/calendar/logout`, 'login', true, 'Retornando a tela de login.', 'success')
        },
    },
    created(){
        console.log("Home");
        this.$cookies.get('authorization')
    }
}
</script>