<template>
<div class="box">
  <div class="wrapper">
    <h5>Registrera konto</h5>
    <div class="info" v-if="showVerifyMessage">Titta i din inkorg och verifiera din mailadress</div>
    <div class="error" v-else-if="error">
        <q-icon size="24px" name="warning"></q-icon>
        <p v-if="error">{{error.data}} </p>
    </div>
    <q-input label="Email" v-model="user.email"></q-input>
    <q-input type="password" label="Password" v-model="user.password"></q-input>
    <q-btn  class="q-mt-lg" :loading="isLoading" no-caps color="primary" @click="registerAccount()">Registrera dig!</q-btn>
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
                this.showVerifyMessage = true;
                this.isLoading = false;
            } catch (error) {
                this.error = error.response;
                this.isLoading = false;
            }
  
        },
    },
    data() {
        return {
            isLoading: Boolean,
            showVerifyMessage: false,
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


.info {
    padding: 1em; 
    background-color: #3E5669;
    color: white;
    font-weight: 700;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
}
.error {
    padding: 1em; 
    background-color:#E36565; 
    color: white;
    font-weight: 700;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
}

.error p {
    margin: 6px 0 0 0;
}
</style>
