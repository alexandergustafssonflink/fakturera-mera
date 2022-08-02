<template>
<div class="container">
    <div class="header">
        <h3>Invoices</h3>
        <q-btn no-caps color="primary" outline @click="createInvoiceOpened = true">Create invoice</q-btn>
    </div>
    <q-table title="Invoices" :rows="invoices" :columns="columns" row-key="name"/>
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
            createInvoiceOpened: false,
            columns: [
            { name: "name", label: "Name", align: "left", field: "name", sortable: true },
            { name: "description", align: "center", label: "Description", field: "description", sortable: true },
            { name: "amount", align: "center", label: "Amount", field: "amount", sortable: true }
        ]
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

h3 {
    text-align: left;
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
} */
</style>
