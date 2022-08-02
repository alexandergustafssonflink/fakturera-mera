<template>
  <div class="container">
    <nav-bar />
    <!-- <h1>Login!</h1>
    <q-input label="Name" v-model="user.email"></q-input>
    <q-input label="password" v-model="user.password"></q-input>
    <q-btn @click="login()">Login</q-btn>
    <h3>{{error}}</h3> -->
    <router-view />
  </div>
</template>

<script>
// import axios from "axios";
import NavBar from "@/components/navbar.vue";

export default {
    name: 'App',
    components: {
        NavBar
    },
    // methods: {
    //     async login() {
    //         try {
    //             const token = await axios.post("http://localhost:3000/api/user/login", this.user);
    //             if(token) {
    //                 console.log("LOGGED IN!");
    //                 this.$store.commit('login', token);
    //                 console.log(this.$store.state.isLoggedIn());
    //                 localStorage.setItem("token", token.data)
    //                 console.log(localStorage);
    //             }
    //         } catch (error) {
    //             this.error = error.response.data;
    //         }
  
    //     },
    // },
    // data() {
    //     return {
    //         user: {
    //             email: "johnnybonny@heja.se",
    //             password: "connyhej"
    //         },
    //         error: ""
    //     };
    // },
    // created() {
    //    this.$store.state.isLoggedIn();
    // }
}
</script>

<style>

.container {
    max-width: 500px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
