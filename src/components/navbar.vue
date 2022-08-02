<template>
    <div class="container" v-if="this.$route.name !== 'login'">
        <router-link to="/">
            <q-btn unelevated no-caps label="home"></q-btn>
        </router-link>
        <router-link to="/invoices" v-if="loggedIn">
            <q-btn unelevated no-caps label="Invoices"></q-btn>
        </router-link>
        <q-btn v-if="loggedIn" unelevated no-caps @click="logOut()" label="Log out"></q-btn>
    </div>
</template>

<script>

export default {
    name: 'Home',
    components: {
    },
    methods: {
        logOut() {
            localStorage.removeItem("token")
            this.$router.push("/login")
        }
    },
    data() {
        return {
            loggedIn: Boolean
        }
    },
    created() {
        if(this.$store.state.isLoggedIn) {
            this.loggedIn = true;
        }
    }
}
</script>

<style>

</style>
