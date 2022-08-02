<template>
<div class="container">
    <h1>Invoices</h1>
    <q-btn @click="createInvoiceOpened = true">Create invoice</q-btn>
    <div v-for="invoice in invoices" :key="invoice._id">
        <p>{{invoice.name}}</p>
        <p>{{invoice.description}}</p>
        <p>{{invoice.amount}}</p>
    </div>
</div>
<q-dialog v-model="createInvoiceOpened">
    <q-card class="q-pa-md">
        <q-input label="Name" v-model="invoice.name"></q-input>
        <q-input label="Description" v-model="invoice.description"></q-input>
        <q-input label="Amount" v-model="invoice.amount"></q-input>
        <q-btn color="primary" @click="createInvoiceOpened = false;" no-caps outline class="q-mr-sm">Cancel</q-btn> <q-btn no-caps color="red" @click="createInvoice()">Create invoice</q-btn>
    </q-card>
</q-dialog>
</template>

<script>
import axios from "axios";

export default {
    name: 'Invoices',
    components: {
    },
    methods: {
        async createInvoice(){
            try {
                await axios.post('http://localhost:3000/api/invoices', this.invoice, {
                headers: {
                "auth-token": localStorage.token
                }})
            } catch (error) {
                console.log(error);
            }


            }
    },
    data() {
        return {
            invoices: [],
            invoice: {},
            createInvoiceOpened: false
        }
    },

    async created() {
        const data = await axios.get('http://localhost:3000/api/invoices', {
            headers: {
            "auth-token": localStorage.token
        }})

        this.invoices = data.data
    }
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
