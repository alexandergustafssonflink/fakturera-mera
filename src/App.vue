<template>
    <div class="app-wrapper">
    <nav-bar />
    <div class="page-wrapper">
        <router-view />
    </div>
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

html, body {
    background-color: #fafafa;
    
}
a {
    text-decoration: none;
    color: inherit;
}

.page-wrapper {
    /* max-width: 1200px;
    min-width: 900px; */
    display: flex;
    justify-content: center;
    /* flex-direction: column; */
}
#app {
    display: flex;
    justify-content: center;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.box {
    padding: 1.5em;
    background-color: white;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;;
    transition: 0.3s ease;
    border-radius: 0.5em;
}
.container {
    min-width: 900px;
    max-width: 1400px;
}

</style>
