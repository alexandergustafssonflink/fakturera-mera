<template>
    <div class="navbar" v-if="this.$route.name !== 'login' && this.$route.name !== 'register' && this.$route.name !== 'verify-email'">
        <div class="inner-navbar">
            <div>
                <!-- <router-link to="/">
                    <q-btn size="18px" color="primary" outline flat no-caps label="Home"></q-btn>
                </router-link> -->
                <h5>Fakturligt.se</h5>
                <router-link to="/invoices" v-if="loggedIn">
                    <q-btn class="q-ml-xl" size="18px" no-caps :class="$route.path.includes('invoices') ? 'active' : ''" color="primary" flat outline  label="Fakturor"></q-btn>
                </router-link>
                <router-link to="/settings" v-if="loggedIn">
                    <q-btn class="q-ml-lg" size="18px" no-caps :class="$route.path.includes('settings') ? 'active' : ''" color="primary" flat outline  label="Inställningar"></q-btn>
                </router-link>
            </div>
            <q-btn icon="exit_to_app" size="18px" :loading="isLoading" v-if="loggedIn" flat outline color="primary" no-caps @click="logOut()" label="Log out"></q-btn>
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
            this.isLoading = true;
            localStorage.removeItem("token")

            setTimeout(() => {
                this.isLoading = false;
                this.$router.push("/login")
            }, 1000);
        }
    },
    data() {
        return {
            loggedIn: Boolean,
            isLoading: false
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
        box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
    }

    .inner-navbar {
        display: flex;
        justify-content: space-between;
        height: 100%;
        align-items: center;
        min-width: 1200px;
        max-width: 1400px;
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

    button.active {
        background: #3EA39F !important;
        color: white !important;
    }
</style>
