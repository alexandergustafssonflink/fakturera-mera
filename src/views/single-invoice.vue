<template>
<div class="container">
    <q-spinner v-if="isLoading"></q-spinner>
    <div class="invoice-wrapper q-mt-lg box" v-else>
        <div ref="invoiceTemplate" class="invoice-template">
            <div class="header">
                <div class="upper-left">
                    <div class="logo-wrapper">
                        <img ref="logo" class="logo" v-if="invoice.userInfo.logoUrl" :src="invoice.userInfo.logoUrl" alt="" crossorigin>
                        <h6 v-else>{{invoice.userInfo.companyName}}</h6>
                    </div>
                    <p class="text-weight-bold customer-no">Kundnummer: {{invoice.customerNumber}}</p>
                </div>
                
                <div class="header-right">
                    <h5 class="q-ma-none text-weight-bold">Faktura</h5>
                    <div class="flex">
                        <div class="invoice-date q-mr-md">
                            <p class="text-weight-bold">Datum</p>
                            <p>{{invoice.invoiceDate.split("/").join("-")}}</p>   
                        </div>
                        <div class="invoice-no">
                            <p class="text-weight-bold">Fakturanummer</p>
                            <p>{{invoice.invoiceNo}}</p>   
                        </div>
                    </div>
                    <div class="adress q-mt-xl">
                        <p>{{invoice.customerName}}</p>
                        <p>{{invoice.customerAdress}}</p>
                        <p>{{invoice.zip}} {{invoice.city}}</p>
                    </div>
                </div>                

            </div>
            <div class="greeting-section q-mt-xl">
                <p>{{invoice.userInfo.invoiceText}}</p>
            </div>

            <div class="specification-section q-mt-xl">
                <table>
                    <tr class="table-header">
                        <th>Beskrivning</th>
                        <th>Antal</th>
                        <th>À pris</th>
                        <th>Summa</th>
                    </tr>
                    <tr v-for="row, i in invoice.invoiceRows" :key="i">
                        <td>{{row.description}}</td>
                        <td>{{row.quantity}}</td>
                        <td>{{row.amount}}</td>
                        <td>{{row.quantity * row.amount}}</td>
                    </tr>
                </table>
                <table class="q-mt-sm">
                    <tr class="table-header gray">
                        <th>Summa exkl moms</th>
                        <th>Moms ({{invoice.momsRate.label}})</th>
                        <th>Valuta</th>
                        <th>Summa</th>
                    </tr>
                    <tr>
                        <td>{{invoice.invoiceSum}}</td>
                        <td>{{invoice.momsSum}}</td>
                        <td>SEK</td>
                        <td>{{invoice.totalSum}}</td>
                    </tr>
                </table>
                <div class="payment-wrapper q-mt-xl">
                    <div class="payment-info">
                        <h5 class="q-mb-none">Summa att betala (SEK): <span class="text-weight-bold">{{invoice.totalSum}}</span> </h5>
                        <h5>{{invoice.userInfo.paymentType}}: {{invoice.userInfo.paymentNo}}</h5>
                        <h5>Betalningsreferens: {{invoice.invoiceNo}}</h5>
                        <h5>Betalas senast: {{invoice.invoiceDueDate.split("/").join("-")}}</h5>
                    </div>
                </div>
                <p class="duedate-info">Vid utebliven betalning debiteras en påminnelseavgift om 60kr, samt dröjsmålränta från förfallodatumet om {{invoice.interest}}%.</p>
            </div>
            <div class="invoice-footer flex justify-between">
                <div>
                    <p class="text-weight-bold">Postadress </p>
                    <p>{{invoice.userInfo.companyName}}</p>
                    <p>{{invoice.userInfo.adress}}</p>
                    <p class="flex"><span>{{invoice.userInfo.zip}}</span> <span>{{invoice.userInfo.city}}</span></p>
                </div>
                <div>
                    <p class="text-weight-bold">Kontaktinformation </p>
                    <p>{{invoice.userInfo.email}}</p>
                    <p>{{invoice.userInfo.phone}}</p>
                </div>
                <div>
                    <p class="text-weight-bold">Orgnr/F-skatt </p>
                    <p>{{invoice.userInfo.id}}</p>
                    <p class="text-weight-bold">Momsregistreringsnummer </p>
                    <p>{{invoice.userInfo.momsNo}}</p>
                </div>
                <div>
                    <p class="text-weight-bold">Betalningsmottagare </p>
                    <p>{{invoice.userInfo?.companyName}}</p>
                    <p>{{invoice.userInfo.paymentType}}: {{invoice.userInfo.paymentNo}}</p>
                    <!-- <p v-if="invoice.userInfo.paymentType == 'Bankgiro'">Bankgiro: {{invoice.userInfo.paymentNo}}  </p>
                    <p v-else>Plusgiro: {{invoice.userInfo.paymentNo}}  </p> -->
                </div>
            </div>
        </div>
    </div>
    <q-btn no-caps color="primary" class="q-mt-lg" icon="download" @click="generateInvoicePdf()">Ladda ner pdf</q-btn>
</div>
</template>

<script>
import axios from "axios";
import { jsPDF } from "jspdf";
// import html2canvas from "html2canvas";

export default {
    name: 'SingleInvoice',
    components: {
    },
    methods: {
        async getInvoice() {
            const data = await axios.get(process.env.VUE_APP_API_URL + '/invoices/' + this.$route.path.split("/invoices/")[1], {
            headers: {
            "auth-token": localStorage.token
        }})

        this.invoice = data.data[0];
        },
        async generateInvoicePdf() {
            let pdf = new jsPDF('p', 'pt', 'a4');
            let pWidth = pdf.internal.pageSize.width;
            let srcWidth = this.$refs.invoiceTemplate.scrollWidth;
            let margin = 30; 
            let scale = (pWidth - margin * 2) / srcWidth;
            
            pdf.html(this.$refs.invoiceTemplate, {
                x: margin,
                y: margin,
                html2canvas: {
                    scale: scale,
                },
                callback: function () {
                    window.open(pdf.output('bloburl'));
                }
            });
        }
    },
            // old version
            // let canvas = await html2canvas(this.$refs.invoiceTemplate,
            //     {
            //         useCORS	:true
            //     });
            // let img = canvas.toDataURL("image/png");
            // const doc = new jsPDF();
            // doc.addImage(img,'JPEG',10,10);
            // doc.save("Faktura " + this.invoice.invoiceNo + ".pdf");
            // console.log(this.$refs.logo);
    data() {
        return {
            isLoading: Boolean,
            invoice: {
                customerNumber: "",
                id: "",
                invoiceNo: null,
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
        }
    },

    async created() {
        this.isLoading = true;
        await this.getInvoice();
        this.isLoading = false;
    }
}
</script>

<style scoped>

p {
    margin: 0;
    text-align: left;
}

.invoice-template {
    width: 21cm;
    height: 29.7cm;
    background-color: white;
    position: relative;
}

.invoice-wrapper {
    display: flex;
    justify-content: center;
    background-color: white;
    padding-top: 3em;
    padding-bottom: 3em;
}

.header {
    display: flex;
    justify-content: space-between;
    /* align-items: center; */
}

.adress p {
    font-size: 18px;
}

.logo {
    align-self: baseline;
}

.customer-no {
    margin-top: 20px;
    font-size: 20px
}

.header h5 {
    text-align: left;
}

.specification-section table {
    width: 100%;
}

.specification-section table th {
    text-align: left;
    padding: 0.25em;
}

.specification-section table td {
    text-align: left;
}

.table-header {
    background-color: black;
    color: white;
    padding: 1em;
}

.table-header.gray {
    background-color: gray;
    color: white;
    padding: 1em;
}

.invoice-footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    border-top: solid 2px black;
    padding-top: 1em;
}

.payment-wrapper {
    display: flex;
    justify-content: center;
}

.payment-info h5 {
    margin: 0;
    text-align: left;
}
.payment-info {
    padding: 2em; 
    border: solid 2px black;
    border-radius: 4px;
    width: fit-content;
}

.duedate-info {
    margin-top: 48px; 
}

.logo-wrapper {
    width: 200px;
    height: 100px;
    
}

.logo {
    float: left;
    width: 50%;
    height: auto;
    max-height: 200px;
    
}

</style>
