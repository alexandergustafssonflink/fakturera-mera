<template>
<div class="box">
  <div class="wrapper">
    <h3>Logga in!</h3>
    <q-input label="Name" v-model="user.email"></q-input>
    <q-input type="password" label="Password" v-model="user.password"></q-input>
    <q-btn  class="q-mt-lg" no-caps color="primary" @click="login()">Login</q-btn>
    <h3>{{error}}</h3>
    <q-btn  class="q-mt-lg" no-caps color="primary" @click="this.$router.push('/register')">Registrera dig</q-btn>
    <!-- <router-view /> -->
  </div>
</div>
</template>

<script>
import axios from "axios";
// import store from "./store";

export default {
    name: 'Login',
    components: {
    },
    methods: {
        async login() {
            try {
                const token = await axios.post("http://localhost:3000/api/user/login", this.user);
                if(token) {
                    this.$store.commit('login', token);
                    localStorage.setItem("token", token.data)
                    this.$router.push("/invoices")
                }
            } catch (error) {
                this.error = error.response;
            }
  
        },
    },
    data() {
        return {
            user: {
                email: "johnnybonny@heja.se",
                password: "connyhej"
            },
            error: ""
        };
    },
    // created() {
    //     if(localStorage.token) {
    //         this.$store.commit('login', localStorage.token)
    //     }
    // }
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
