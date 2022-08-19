<template>
    <q-card class="q-pa-md invoice-modal">
        <h6 class="q-mb-none q-mt-none">Kundens uppgifter</h6>
        <div class="customer-info flex">
            <div class="left">
                <q-input @blur="getCustomer()" dense label="Kundnummer" v-model="invoice.customerNumber"></q-input>
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
            <h6 class="q-mb-none q-mt-none">Fakturainformation (Max: 5 rader)</h6>
            <q-btn :disable="invoice.invoiceRows.length > 4" @click="invoice.invoiceRows.push( { description: '', amount: '' });" color="primary" outline no-caps label="Lägg till rad" icon="add"></q-btn>
        </div>
        <div class="invoice-info">
            <div>
                <div v-for="invoiceRow, i in invoice.invoiceRows" :key="i" class="invoice-row">
                    <q-input dense label="Beskrivning" v-model="invoiceRow.description"></q-input>
                    <q-input @blur="calculateAmount()" dense class="q-ml-md" label="À pris exkl moms" v-model="invoiceRow.amount" :rules="[(val) => (val !== null && val !== '' && !/[a-zA-Z]/.test(val)) ||'Ange ett korrekt belopp',]"></q-input>
                    <q-input dense @blur="calculateAmount()" label="Antal" class="q-ml-md" v-model="invoiceRow.quantity" :rules="[(val) => (val !== null && val !== '' && !/[a-zA-Z]/.test(val)) ||'Ange ett korrekt antal i siffror',]"></q-input>
                    <q-btn v-if="i > 0" @click="invoice.invoiceRows.splice(i, 1); calculateAmount()" class="q-ml-md" dense flat color="red" outline no-cap icon="remove"></q-btn>
                </div>
                <div class="flex q-mt-lg">
                    <!-- <q-select class="select-moms" dense label="Momssats" :options="[0.06, 0.12, 0.25]" v-model="invoice.momsRate" /> -->
                    <q-select class="select-moms" dense label="Momssats" :options="[{'label': '6%', 'value': 0.06}, {'label': '12%', 'value': 0.12}, {'label': '25%', 'value': 0.25}]" v-model="invoice.momsRate" />
                    <q-input class="q-ml-md"  dense label="Dröjsmålsränta (%)" v-model="invoice.interest"></q-input>
                    <!-- <q-checkbox v-model="invoice.cost" label="Fakturaavgift 25kr"></q-checkbox> -->
                </div>
            </div>
            <div class="q-mt-md invoice-sum">
                <h6 class="q-mb-sm q-mt-none">Summering</h6>
                <p class="q-mb-none text-weight-bold">Belopp: {{invoice.invoiceSum}}</p>
                <p class="q-mb-none text-weight-bold">Moms: {{invoice.momsSum}}</p>
                <p class="q-mb-none text-weight-bold">Totalt (SEK): {{invoice.totalSum}}</p>
            </div>
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
        <div class="q-mt-xl">
            <q-btn color="primary" @click="$emit('closeModal')" no-caps outline class="q-mr-sm">Avbryt</q-btn> <q-btn :disabled="!invoice.customerNumber || !invoice.id || !invoice.customerName || !invoice.customerAdress || !invoice.zip || !invoice.city || !invoice.invoiceRows[0].amount || !invoice.interest || !invoice.invoiceDate || !invoice.invoiceDueDate" no-caps color="green" @click="createInvoice()">Skapa faktura </q-btn>
        </div>
    </q-card>
</template>

<script>
import axios from "axios";
import { useQuasar } from 'quasar';

export default {
    name: 'CreateInvoice',
    watch: {
        momsRate: {
            handler() {
                this.calculateAmount();
            }
        }
    },
    computed: {
        momsRate() {
        return this.invoice.momsRate
        },
    },
    components: {
    },
    methods: {
        async createInvoice(){
            try {
                await axios.post(process.env.VUE_APP_API_URL +'/invoices', this.invoice, {
                headers: {
                    "auth-token": localStorage.token
                }});
                // await this.getInvoices();
               this.$emit("closeModal");
                this.quasar.notify({
                    message: "Fakturan skapades",
                    type: "positive",
                    position: "center"
                });
            } catch (error) {
                console.log(error);
                this.quasar.notify({
                    message: "Något gick fel när fakturan skapades",
                    type: "negative",
                    position: "center"
                });
            }
            this.$emit("getInvoices");

            },
            calculateAmount() {
                let sum = 0;
                this.invoice.invoiceRows.forEach(row => {
                    if(row.amount && row.quantity) {
                        sum = sum + Number(row.amount) * Number(row.quantity)
                    }
                })
                
                if(!isNaN(sum)) {
                    this.invoice.invoiceSum = sum;
                } else {
                    this.invoice.invoiceSum = "-"
                }
                if(!isNaN(Math.trunc(sum * this.invoice.momsRate.value))) {
                    this.invoice.momsSum = Math.trunc(sum * this.invoice.momsRate.value);
                } else {
                    this.invoice.momsSum = "-"
                }

                if(!isNaN(this.invoice.invoiceSum + this.invoice.momsSum)) {
                    this.invoice.totalSum = this.invoice.invoiceSum + this.invoice.momsSum;
                } else {
                    this.invoice.totalSum = "-"
                }
            },
            async getCustomer() {
                const { data } = await axios.get(process.env.VUE_APP_API_URL + '/invoices/customer/' + this.invoice.customerNumber, {
                headers: {
                    "auth-token": localStorage.token
                }});
                if(data.length > 0) {
                    this.invoice.customerName = data[0].customerName;
                    this.invoice.customerAdress = data[0].customerAdress;
                    this.invoice.zip = data[0].zip;
                    this.invoice.id = data[0].id;
                    this.invoice.city = data[0].city;
                }
            }
        },
    data() {
        return {
            quasar: useQuasar(),
            isLoading: Boolean,
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
                        amount: "",
                        quantity: ""
                    }
                ],
                momsRate: {'label': "25%", 'value': 0.25 },
                invoiceSum: 0,
                momsSum: 0,
                totalSum: 0,
                cost: false,
                invoiceDate: "",
                invoiceDueDate: "",
                interest: ""
            },
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
}
</script>

<style scoped>

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

.select-moms {
    min-width: 175px;
}

.interest-wrapper {
    max-width: 400px;
}

.invoice-row {
    display: flex;
    /* justify-content: space-between; */
}

.invoice-info {
    display: flex;
    justify-content: space-between;
}

.invoice-sum {
    padding: 1em 1em 2em 1em;
    border-radius: 5px;
    background-color: #3EA39F;
    color: white;
    min-width: 200px;
}

.invoice-sum h6 {
    font-weight: 700 !important;
}

.invoice-dates p {
    font-weight: bold;
    opacity: 0.7
}
</style>
