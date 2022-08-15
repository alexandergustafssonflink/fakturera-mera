<template>
<div class="box">
  <div class="wrapper">
    <h3>Registrera konto</h3>
    <q-input label="Email" v-model="user.email"></q-input>
    <q-input type="password" label="Password" v-model="user.password"></q-input>
    <q-btn  class="q-mt-lg" :loading="isLoading" no-caps color="primary" @click="registerAccount()">Registrera dig!</q-btn>
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
                this.isLoading = true;
                await axios.post(process.env.VUE_APP_API_URL + "/user/register", this.user);
                setTimeout(() => {
                this.isLoading = false;
                this.quasar.notify({
                    message: "Konto är uppskapat och du kan nu logga in",
                    type: "positive",
                    position: "center"
                });
                this.$router.push("/login")
                }, 3000);
                
            } catch (error) {
                this.error = error.response;
            }
  
        },
    },
    data() {
        return {
            isLoading: Boolean,
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
