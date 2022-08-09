<template>
<div class="container">
    <div class="header">
        <h3>Fakturor</h3>
        <q-btn icon="post_add"  no-caps color="primary" outline @click="createInvoiceOpened = true">Skapa faktura</q-btn>
    </div>
    <q-skeleton v-if="isLoading" height="400px"></q-skeleton>
    <!-- <q-table :pagination="pagination" title="Invoices" :rows="invoices" :columns="columns" row-key="name"/> -->
    <q-table v-else :rows="invoices" :columns="columns" :pagination = pagination>
        <template v-slot:header="props">
            <q-tr :props="props">
                <q-th v-for="col in props.cols" :key="col.name" :props="props">
                    {{col.label}}
                </q-th>
            </q-tr>
        </template>
        <template #body="props">
            <q-tr :props="props" @click="goToInvoice(props.row._id)">
                <q-td key="customerNumber" no-hover :props="props" class="text-weight-bold">
                    {{ props.row.customerNumber }}
                </q-td>
                <q-td key="id" no-hover :props="props" class="description-cell">
                    {{ props.row.id }}
                </q-td>
                <q-td key="customerName" no-hover :props="props">
                    {{ props.row.customerName }}
                </q-td>
                <q-td key="customerAdress" no-hover :props="props">
                    {{ props.row.customerAdress }}
                </q-td>
                <q-td key="zip" no-hover :props="props">
                    {{ props.row.zip }}
                </q-td>
                <q-td key="city" no-hover :props="props">
                    {{ props.row.city }}
                </q-td>
                <q-td key="invoiceDate" no-hover :props="props">
                    {{ props.row.invoiceDate }}
                </q-td>
                <q-td key="invoiceDueDate" no-hover :props="props">
                    {{ props.row.invoiceDueDate }}
                </q-td>
                <q-td key="interest" no-hover :props="props">
                    {{ props.row.interest }}
                </q-td>
            </q-tr>
        </template>
    </q-table>
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
        <div class="invoice-info">
            <div>
                <div v-for="invoiceRow, i in invoice.invoiceRows" :key="i" class="invoice-row">
                    <q-input dense label="Beskrivning" v-model="invoiceRow.description"></q-input>
                    <q-input @blur="calculateAmount()" dense class="q-ml-md" label="À pris exkl moms" v-model="invoiceRow.amount"></q-input>
                    <q-input dense @blur="calculateAmount()" label="Antal" class="q-ml-md" v-model="invoiceRow.quantity"></q-input>
                    <q-btn v-if="i > 0" @click="invoice.invoiceRows.splice(i, 1)" class="q-ml-md" flat color="red" outline no-cap icon="remove"></q-btn>
                </div>
                <div class="flex q-mt-lg">
                    <!-- <q-select class="select-moms" dense label="Momssats" :options="[0.06, 0.12, 0.25]" v-model="invoice.momsRate" /> -->
                    <q-select class="select-moms" dense label="Momssats" :options="[{'label': '6%', 'value': 0.06}, {'label': '12%', 'value': 0.12}, {'label': '25%', 'value': 0.25}]" v-model="invoice.momsRate" />
                    <q-input class="q-ml-md"  dense label="Dröjsmålsränta (%)" v-model="invoice.interest"></q-input>
                    <q-checkbox v-model="invoice.cost" label="Fakturaavgift 25kr"></q-checkbox>
                </div>
            </div>
            <div class="q-mt-xl invoice-sum">
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
        <!-- <div class="interest-wrapper q-mt-lg">
            
        </div> -->
        <div class="q-mt-xl">
            <q-btn color="primary" @click="createInvoiceOpened = false;" no-caps outline class="q-mr-sm">Avbryt</q-btn> <q-btn no-caps color="green" @click="createInvoice()">Skapa faktura </q-btn>
        </div>
    </q-card>
</q-dialog>
</template>

<script>
import axios from "axios";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useQuasar } from 'quasar';

export default {
    name: 'Invoices',
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
        }
    },
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


            },
            calculateAmount() {
                let sum = 0;
                this.invoice.invoiceRows.forEach(row => {
                    if(row.amount && row.quantity) {
                        sum = sum + Number(row.amount) * Number(row.quantity)
                    }
                })
                this.invoice.invoiceSum = sum;
                this.invoice.momsSum = Math.trunc(sum * this.invoice.momsRate.value);
                this.invoice.totalSum = this.invoice.invoiceSum + this.invoice.momsSum;
            },
            async getInvoices() {
            this.isLoading = true;
            const data = await axios.get('http://localhost:3000/api/invoices', {
            headers: {
            "auth-token": localStorage.token
        }})
            this.invoices = data.data;
            this.isLoading = false;
        },
        async generateInvoicePdf() {
            let canvas = await html2canvas(this.$refs.invoiceTemplate);
            var img = canvas.toDataURL("image/png");
            const doc = new jsPDF();
            doc.addImage(img,'JPEG',20,20);
            doc.save('test.pdf');
        },
        goToInvoice(id) {
            this.$router.push("/invoices/" + id)
        }
    },
    data() {
        return {
            quasar: useQuasar(),
            isLoading: Boolean,
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
            pagination: {
                rowsPerPage: 50
            },
            createInvoiceOpened: false,
            columns: [
            { name: "customerNumber", label: "Kundnummer", align: "left", field: "customerNumber", sortable: true },
            { name: "id", label: "id", align: "left", field: "id", sortable: true },
            { name: "customerName", label: "Namn", field: "customerName", sortable: true },
            { name: "customerAdress", label: "Adress", field: "customerAdress", sortable: true },
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
    padding: 1em;
    border-radius: 5px;
    background-color: #3EA39F;
    color: white;
    min-width: 200px;
}
</style>
