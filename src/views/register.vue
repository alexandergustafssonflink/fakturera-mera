<template>
<div class="box">
  <div class="wrapper">
    <h3>Registrera konto</h3>
    <q-input label="Email" v-model="user.email"></q-input>
    <q-input type="password" label="Password" v-model="user.password"></q-input>
    <q-btn  class="q-mt-lg" no-caps color="primary" @click="registerAccount()">Registrera dig!</q-btn>
    <h3>{{error}}</h3>
    <router-view />
  </div>
</div>
</template>

<script>
import axios from "axios";
// import store from "./store";
import { useQuasar } from "quasar"

export default {
    name: 'Register',
    components: {
    },
    methods: {
        async registerAccount() {
            try {
                await axios.post("http://localhost:3000/api/user/register", this.user);
                this.quasar.notify({
                    message: "Konto är uppskapat och du kan nu logga in",
                    type: "positive",
                    position: "center"
                });
                this.$router.push("/login")
            } catch (error) {
                this.error = error.response;
            }
  
        },
    },
    data() {
        return {
            quasar: useQuasar(),
            user: {
                // email: "johnnybonny@heja.se",
                // password: "connyhej"
            },
            error: ""
        };
    },
}
</script>

<style scoped>

.box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: fit-content;
    margin-top: 50px;
}
.wrapper {
    min-width: 300px;
    max-width: 500px;
}
</style>
