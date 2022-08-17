<template>
  <div class="container">
    <h3>Inställningar</h3>
    <div class="information">
        <div class="company-information">
            <h5 class="q-mb-sm">Företagsuppgifter</h5>
            <q-input :loading="isLoading" v-model="userInfo.id" label="Organisationsnummer" />
            <q-input :loading="isLoading" v-model="userInfo.companyName" label="Företagsnamn" />
            <q-input :loading="isLoading" v-model="userInfo.adress" label="Adress" />
            <q-input :loading="isLoading" v-model="userInfo.zip" label="Postnummer" />
            <q-input :loading="isLoading" v-model="userInfo.city" label="Ort" />
            <q-input :loading="isLoading" v-model="userInfo.email" label="E-mail" />
            <q-input :loading="isLoading" v-model="userInfo.phone" label="Telefon" />
        </div>

        <div class="q-ml-xl payment-information">
            <h5 class="q-mb-sm">Betalningsuppgifter</h5>
            <q-input :loading="isLoading" v-model="userInfo.momsNo" label="Momsregistreringsnummer" />
            <div class="flex payment-info">
                <q-select v-model="userInfo.paymentType" class="payment-type q-mr-sm" :options="['Bankgiro', 'Plusgiro']" label="BG / PG" />
                <q-input :loading="isLoading" v-model="userInfo.paymentNo" label="Nummer" />
            </div>
            <q-input :loading="isLoading" type="textarea" v-model="userInfo.invoiceText" label="Fakturatext" />           
            <h5 class="q-mt-lg q-mb-md">Logotyp</h5>
            <div class="logo-wrapper">
                <img class="logo" v-if="userInfo.logoUrl" :src="userInfo.logoUrl" alt="Logo">
            </div>
            <q-btn v-if="userInfo.logoUrl" outline no-caps color="red" class="q-mb-sm" @click="userInfo.logoUrl = null" flat label="Ta bort logga"></q-btn>
            <q-input color="primary" @update:model-value="val => { file = val[0]; uploadImage() }" filled type="file" hint="Native file" />
            <q-btn class="save-btn" :disabled="!userInfo.id || !userInfo.companyName || !userInfo.adress || !userInfo.zip || !userInfo.momsNo || !userInfo.city || !userInfo.email || !userInfo.phone || !userInfo.paymentType || !userInfo.paymentNo" color="primary" label="Spara" no-caps @click="saveUser()"></q-btn>
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
            try { 
                await axios.put(process.env.VUE_APP_API_URL + '/user', this.userInfo, {
                    headers: {
                        "auth-token": localStorage.token
                    }}); 

                this.quasar.notify({
                    message: "Dina inställningar är sparade",
                    type: "positive",
                    position: "center"
                });    
            } catch (error) {
                 this.quasar.notify({
                    message: "Något gick fel när dina inställningar skulle sparas. Försök igen senare.",
                    type: "negative",
                    position: "center"
                });    
            }


        },
        async getUser() {
            this.isLoading = true;
            let data = await axios.get(process.env.VUE_APP_API_URL + '/user', {
                headers: {
                    "auth-token": localStorage.token
                }});
            if(data.data.userInfo) {
                this.userInfo = data.data.userInfo;
            }
            this.isLoading = false;
        },
        async uploadImage() {
            let { data } = await axios.get(process.env.VUE_APP_API_URL + '/user/s3url', {
                headers: {
                    "auth-token": localStorage.token
                }});
            
                await axios.put(data.url, this.file, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    },
                });

                this.userInfo.logoUrl = data.url.split("?")[0]
        }
    },
    data() {
        return {
            isLoading: Boolean,
            file: "",
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
                paymentNo: "",
                invoiceText: "",
                logoUrl: ""
            }
        }
    },
    async created() {
       await this.getUser();
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
        margin-top: 16px;
        float: right;
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

    .logo-wrapper {
    }
    .logo {
        object-fit: contain;
        width: 100%;
        height: 190px;
    }
</style>
