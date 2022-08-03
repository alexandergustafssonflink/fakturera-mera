<template>
<div class="container">
    <div class="header">
        <h3>Invoices</h3>
        <q-btn icon="post_add"  no-caps color="primary" outline @click="createInvoiceOpened = true">Create invoice</q-btn>
    </div>
    <q-table :pagination="pagination" title="Invoices" :rows="invoices" :columns="columns" row-key="name"/>
</div>
<q-dialog v-model="createInvoiceOpened">
    <q-card class="q-pa-md invoice-modal">
        <h6 class="q-mb-none q-mt-none">Kundens uppgifter</h6>
        <div class="customer-info flex">
            <div class="left">
                <q-input dense label="Kundnummer" v-model="invoice.customerNumber"></q-input>
                <q-input dense label="Kundens namn" v-model="invoice.customerName"></q-input>
                <q-input dense label="Postnummer" v-model="invoice.zip"></q-input>
            </div>
            <div class="right q-ml-md">
                <q-input dense label="Person / organisations-nummer" v-model="invoice.id"></q-input>
                <q-input dense label="Kundens adress" v-model="invoice.customerAdress"></q-input>
                <q-input dense label="Ort" v-model="invoice.city"></q-input>
            </div>
        </div>
        <div class="invoice-row-header q-mt-lg">
            <h6 class="q-mb-none q-mt-none">Fakturainformation</h6>
            <q-btn @click="invoice.invoiceRows.push( { description: '', amount: '' });" color="primary" outline no-caps label="Lägg till rad" icon="add"></q-btn>
        </div>
        <div v-for="invoiceRow, i in invoice.invoiceRows" :key="i" class="invoice-row">
            <q-input dense label="Beskrivning" v-model="invoiceRow.description"></q-input>
            <q-input dense class="q-ml-md" label="Belopp" v-model="invoiceRow.amount"></q-input>
            <q-btn v-if="i > 0" @click="invoice.invoiceRows.splice(i, 1)" class="q-ml-md" flat color="red" outline no-cap icon="remove"></q-btn>
        </div>
        <div class="invoice-dates flex q-mt-lg">
            <div>
                <p class="q-mb-none">Fakturadatum</p>
                <q-date :locale="seLocale" label="Fakturadatum" v-model="invoice.invoiceDate" />
            </div>
            <div class="q-ml-lg">
                <p class="q-mb-none">Förfallodatum</p>
                <q-date dense label="Förfallodatum" :locale="seLocale" v-model="invoice.invoiceDueDate" />
            </div>
        </div>
        <div class="interest-wrapper q-mt-lg">
            <q-input label="Dröjsmålsränta (%)" v-model="invoice.interest"></q-input>
        </div>
        <div class="q-mt-xl">
            <q-btn color="primary" @click="createInvoiceOpened = false;" no-caps outline class="q-mr-sm">Avbryt</q-btn> <q-btn no-caps color="green" @click="createInvoice()">Skapa faktura </q-btn>
        </div>
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
                }});
                await this.getInvoices();
                this.createInvoiceOpened = false;
            } catch (error) {
                console.log(error);
            }


            },
        async getInvoices() {
            const data = await axios.get('http://localhost:3000/api/invoices', {
            headers: {
            "auth-token": localStorage.token
        }})

        this.invoices = data.data
        }
    },
    data() {
        return {
            invoices: [],
            invoice: {
                customerNumber: "",
                id: "", 
                customerName: "",
                customerAdress: "",
                zip: "",
                city: "",
                invoiceRows: [
                    {
                        description: "",
                        amount: ""
                    }
                ],
                invoiceDate: "",
                invoiceDueDate: "",
                interest: ""
            },
            pagination: {
                rowsPerPage: 50
            },
            createInvoiceOpened: false,
            columns: [
            { name: "customerNumber", label: "Kundnummer", align: "left", field: "customerNumber", sortable: true },
            { name: "id", label: "id", align: "left", field: "id", sortable: true },
            { name: "customerName", label: "Namn", field: "customerName", sortable: true },
            { name: "customerAdress", align: "center", label: "Adress", field: "customerAdress", sortable: true },
            { name: "zip", label: "Postnr", field: "zip", sortable: true },
            { name: "city", label: "Ort", field: "city", sortable: true },                          
            { name: "invoiceDate",  label: "Fakturadatum", field: "invoiceDate", sortable: true },
            { name: "invoiceDueDate", label: "Förfallodatum", field: "invoiceDueDate", sortable: true },
            { name: "interest",  label: "Räntesats", field: "interest", sortable: true },

        ],
        seLocale: {
        /* starting with Sunday */
        days: 'Måndag_Tisdag_Onsdag_Torsdag_Fredag_Lördag_Söndag'.split('_'),
        daysShort: 'Mån_Tis_Ons_Tors_Fre_Lör_Sön'.split('_'),
        months: 'Januari_Februari_Mars_April_Maj_Juni_Juli_Augusti_September_Oktober_November_December'.split('_'),
        monthsShort: 'Jan_Feb_Mar_Apr_Maj_Jun_Jul_Aug_Sep_Okt_Nov_Dec'.split('_'),
        firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
        format24h: true,
        pluralDay: 'dagar'
      }
        }
    },

    async created() {
        this.getInvoices();
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

.customer-info {
    max-width: 400px;
}

.invoice-modal {
    width: 900px;
    max-width: unset !important;
    padding: 3em;
}

.invoice-row-header {
    display: flex;
    justify-content: space-between
}

.interest-wrapper {
    max-width: 400px;
}

.invoice-row {
    display: flex;
    /* justify-content: space-between; */
}
</style>
