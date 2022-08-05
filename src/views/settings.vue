<template>
  <div class="container">
    <h3>Inställningar</h3>
    <div class="information">
        <div class="company-information">
            <h5 class="q-mb-sm">Företagsuppgifter</h5>
            <q-input v-model="userInfo.id" label="Organisationsnummer" />
            <q-input v-model="userInfo.companyName" label="Företagsnamn" />
            <q-input v-model="userInfo.adress" label="Adress" />
            <q-input v-model="userInfo.zip" label="Postnummer" />
            <q-input v-model="userInfo.city" label="Ort" />
            <q-input v-model="userInfo.email" label="E-mail" />
            <q-input v-model="userInfo.phone" label="Telefon" />
        </div>
        <div class="q-ml-xl payment-information">
            <h5 class="q-mb-sm">Betalningsuppgifter</h5>
            <q-input v-model="userInfo.momsNo" label="Momsregistreringsnummer" />
            <div class="flex payment-info">
                <q-select v-model="userInfo.paymentType" class="payment-type q-mr-sm" :options="['Bankgiro', 'Plusgiro']" label="BG / PG" />
                <q-input v-model="userInfo.paymentNo" label="Nummer" />
            </div>
            <q-btn class="save-btn" color="primary" label="Spara" no-caps @click="saveUser()"></q-btn>
        </div>
        
        
    </div>
    
  </div>
</template>

<script>
import axios from "axios";
import { useQuasar } from "quasar";
// import store from "./store";

export default {
    name: 'Settings',
    components: {
    },
    methods: {
        async saveUser() {
            axios.put('http://localhost:3000/api/user', this.userInfo, {
            headers: {
                "auth-token": localStorage.token
            }}); 
            this.quasar.notify({
                    message: "Dina inställningar är sparade",
                    type: "positive",
                    position: "center"
                });    
        },
        async getUser() {
            let data = await axios.get('http://localhost:3000/api/user', {
                headers: {
                    "auth-token": localStorage.token
                }});
            if(data) {
                this.userInfo = data.data.userInfo;
            }
        }
    },
    data() {
        return {
            quasar: useQuasar(),
            userInfo: {
                id: "",
                companyName: "",
                adress: "",
                zip: "",
                city: "",
                email: "",
                phone: "",
                momsNo: "",
                paymentType: "",
                paymentNo: ""
            }
        }
    },
    created() {
        this.getUser();
    }
}
</script>

<style scoped>
    .information {
        display: flex;
    }

    .company-information {
        min-width: 300px;
    }

    .payment-information {
        position: relative;
    }

    .payment-info {
        justify-content: space-between;
    }

    .save-btn   {
        position: absolute;
        bottom: 0px;
        right: 0px;
    }

    .payment-type {
        min-width: 100px;
    }
    h3 {
        text-align: left;
    }
    h5 {
        text-align: left;
    }
</style>
