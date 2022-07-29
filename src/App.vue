<template>
  <div class="container">
    <h1>Login!</h1>
    <q-input label="Name" v-model="user.email"></q-input>
    <q-input label="password" v-model="user.password"></q-input>
    <q-btn @click="login()">Login</q-btn>
    <h3>{{error}}</h3>
  </div>
</template>

<script>
import axios from "axios";

export default {
    name: 'App',
    components: {
    },
    methods: {
        async login() {
            try {
                const token = await axios.post("http://localhost:3000/api/user/login", this.user);
                console.log(token.data);
                if(token) {
                    console.log("LOGGED IN!");
                }
            } catch (error) {
                this.error = error.response.data;
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
