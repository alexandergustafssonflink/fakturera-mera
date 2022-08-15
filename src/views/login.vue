<template>
<div class="box">
  <div class="wrapper">
    <h3>Logga in!</h3>
    <q-input label="Name" v-model="user.email"></q-input>
    <q-input type="password" label="Password" v-model="user.password"></q-input>
    <q-btn :loading="isLoading" class="q-mt-lg" no-caps color="primary" @click="login()">Login</q-btn>
    <h3>{{error}}</h3>
    <p  class="q-mt-lg q-mb-sm">Har du inget konto?</p>
    <q-btn outline no-caps color="primary" @click="this.$router.push('/register')">Registrera dig</q-btn>
    <!-- <router-view /> -->
  </div>
</div>
</template>

<script>
import axios from "axios";

export default {
    name: 'Login',
    components: {
    },
    methods: {
        async login() {
            this.isLoading = true;
            try {
                const token = await axios.post(process.env.VUE_APP_API_URL + "/user/login", this.user);
                if(token) {
                    this.$store.commit('login', token);
                    localStorage.setItem("token", token.data)
                    
                }

                setTimeout(() => {
                    this.isLoading = false;
                    this.$router.push("/invoices")
                }, 1000);
            } catch (error) {
                this.error = error.response;
            }
            
        },
    },
    data() {
        return {
            isLoading: false,
            user: {
                email: "johnnybonny@heja.se",
                password: "connyhej"
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
