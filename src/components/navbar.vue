<template>
    <div class="navbar" v-if="this.$route.name !== 'login'">
        <div class="inner-navbar">
            <div>
                <router-link to="/">
                    <q-btn size="18px" color="primary" outline flat no-caps label="Home"></q-btn>
                </router-link>
                <router-link to="/invoices"  v-if="loggedIn">
                    <q-btn class="q-ml-lg" size="18px" no-caps color="primary" flat outline  label="Invoices"></q-btn>
                </router-link>
            </div>
            <q-btn icon="exit_to_app" size="18px" v-if="loggedIn" flat outline color="primary" no-caps @click="logOut()" label="Log out"></q-btn>
        </div>
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
    .navbar {
        background-color: white;
        width: 100vw;
        display: flex;
        height: 80px;
        justify-content: center;
    }

    .inner-navbar {
        display: flex;
        justify-content: space-between;
        height: 100%;
        align-items: center;
        min-width: 900px;
        max-width: 1200px;
    }
    .navbar div {
        height: 100%;
        display: flex;
        align-items: center;
    }

    .navbar button {
        height: 100%;
    }
    
    .navbar a {
        height: 100%;
    }
</style>
