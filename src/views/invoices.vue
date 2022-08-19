<template>
<div class="container">
    <div class="header">
        <h3>Fakturor</h3>
        <q-btn icon="post_add"  no-caps color="primary" outline @click="createInvoiceOpened = true" :disabled="userSettingsEmpty">Skapa faktura</q-btn>
    </div>
    <div v-if="userSettingsEmpty" class="settings-empty-message">
        <h6 class="q-mb-sm q-mt-none">Hej!</h6>
        <p> Innan du skapar en faktura så behöver du lägga till lite inställningar...</p>
        <q-btn no-caps @click="$router.push('/settings')">Ta mig dit!</q-btn>
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
    <create-invoice @closeModal="createInvoiceOpened = false" @getInvoices="getInvoices()" />
</q-dialog>
<div v-if="showCookieBanner">
    <cookie-banner  @approveCookies="approveCookies()" />
</div>

</template>

<script>
import axios from "axios";
import { useQuasar } from 'quasar';
import CreateInvoice from "./create-invoice.vue";
import CookieBanner from "@/components/cookie-banner.vue";

export default {
    name: 'Invoices',
    components: {
        CreateInvoice,
        CookieBanner
    },
    methods: {
            async getInvoices() {
            this.isLoading = true;
            const data = await axios.get(process.env.VUE_APP_API_URL + '/invoices', {
            headers: {
            "auth-token": localStorage.token
        }})
            this.invoices = data.data;
            this.isLoading = false;
        },
        async getUserSettings() {
            let data = await axios.get(process.env.VUE_APP_API_URL + '/user', {
                headers: {
                    "auth-token": localStorage.token
                }});
            if(data) {
                this.userInfo = data.data.userInfo;
            } 

            if(this.userInfo == undefined) {
                this.userSettingsEmpty = true;
            } else if(!this.userInfo.companyName) {
                this.userSettingsEmpty = true;
            }

        },
        goToInvoice(id) {
            this.$router.push("/invoices/" + id)
        },
        approveCookies() {
            if(!this.userInfo) {
                this.userInfo = {
                    approveCookies: true
                }
            } else {
                this.userInfo.approveCookies = true
            }
            this.showCookieBanner = false;
            axios.put(process.env.VUE_APP_API_URL + '/user', this.userInfo, {
                headers: {
                    "auth-token": localStorage.token
                }}); 
        }
    },
    data() {
        return {
            userInfo: null,
            userSettingsEmpty: false,
            showCookieBanner: false,
            quasar: useQuasar(),
            isLoading: Boolean,
            invoices: [],
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
        }
    },

    async created() {
        await this.getInvoices();
        await this.getUserSettings();

        if(!this.userInfo) {
            this.showCookieBanner = true;
        } else if (!this.userInfo.approveCookies) {
            this.showCookieBanner = true;
        }
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

.settings-empty-message {
    padding: 1em;
    background: #3E5669;
    color: white; 
    border-radius: 5px;
    margin-bottom: 1em;
}

:deep(tbody tr:hover) {
    background: #edefff;
    transition: 0.3s ease;
    cursor: pointer;
}

:deep(thead th) {
    font-weight: 700;
}

:deep(table tr:nth-child(2n):hover) {
    background: #edefff;
}

:deep(table tr:nth-child(2n)) {
    background: whitesmoke
}
</style>
