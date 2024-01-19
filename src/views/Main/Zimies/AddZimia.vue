<template>
    <CAlert color="success" :visible="live">Επιτυχημέμη Εισαγωγή Ζημίας</CAlert>
    <CCard>
        <CForm @submit.prevent="Add">
            <CCardHeader style="text-align: center; padding: 20px; background-color: rgba(100, 100, 96, 0.158);">
                <h3>Νέα Ζημία</h3>
            </CCardHeader>
            <CCardBody>
                <CRow :xs="{ gutter: 2 }" style="padding: 20px;">
                    <!-- <CCol md>
                        <CFormLabel style="font-size: 20px; font-weight: bold;">Αριθμός Ζημίας</CFormLabel>
                        <CFormInput type="text" floatingLabel="Αριθμός Ζημίας" placeholder="Αριθμός Ζημίας"
                            v-model="znumber" required/>

                    </CCol> -->
                    <CCol md>
                        <CFormLabel style="font-size: 20px; font-weight: bold;">ΑΦΜ Πελάτη</CFormLabel>
                        <CFormInput type="text" floatingLabel="ΑΦΜ Πελάτη" placeholder="ΑΦΜ Πελάτη" v-model="searchQuery" />
                        <CFormSelect size="sm" class="mb-3" multiple v-model="cid" @click="changecon" :html-size="2"
                            required>
                            <option v-for="entry in filteredItems" :key="entry.cid" :value="entry.cid"> {{ entry.afm }} ({{
                                entry.name }} {{ entry.surname }})
                            </option>
                        </CFormSelect>
                    </CCol>

                </CRow>
                <CRow :xs="{ gutter: 2 }" style="padding: 20px;">
                    <CCol md>
                        <CFormLabel style="font-size: 20px; font-weight: bold;">Αριθμός Συμβολαίου</CFormLabel>
                        <CFormInput type="text" floatingLabel="Αριθμός Συμβολαίου" placeholder="Αριθμός Συμβολαίου"
                            v-model="searchQuery2" />
                        <CFormSelect size="sm" class="mb-3" multiple v-model="conid" :html-size="2" @click="getins"
                            required>
                            <option v-for="entry in filteredItems2" :key="entry.conid" :value="entry.conid"> {{
                                entry.conumber }} ({{ entry.iname }} , {{ entry.bname }})</option>
                        </CFormSelect>
                    </CCol>

                </CRow>
                <CRow :xs="{ gutter: 2 }" style="padding: 20px; text-align: center;">
                    <CCol md>

                        <CFormLabel style="font-size: 20px; font-weight: bold;">Ποσό Ζημίας</CFormLabel>
                        <CInputGroup class="mb-3">
                            <CInputGroupText>€</CInputGroupText>
                            <CFormInput type="text" placeholder="0.00" v-model="poso" required />
                        </CInputGroup>
                    </CCol>
                    <!-- <CCol md>
                        <CFormLabel style="font-size: 20px; font-weight: bold;">Κατάσταση</CFormLabel>
                        <CFormSelect size="lg" class="mb-3" v-model="status" required>
                            <option value="1">Σε εκρεμότητα</option>
                            <option value="2">Εγκρίθηκε</option>

                        </CFormSelect>
                    </CCol>
                    <CCol md>
                        <CFormLabel style="font-size: 20px; font-weight: bold;">Ημ. Καταχώρησης</CFormLabel>
                        <VueDatePicker v-model="inputdate" placeholder="Ημερομηνία Καταχώρησης" format="dd-MM-yyyy"
                            model-type="yyyy-MM-dd" required></VueDatePicker>
                    </CCol> -->
                </CRow>

            </CCardBody>
            <CCardFooter style="text-align: center; padding: 20px;">
                <CButton type="submit" size="lg" color="primary">
                    <CIcon :icon="icon.cilSave" size="xl" /> Εισαγωγή Ζημίας
                </CButton>
            </CCardFooter>
        </CForm>
    </CCard>
</template>

<script>
import { CCardBody } from '@coreui/vue';
import axios from 'axios';
// import VueDatePicker from '@vuepic/vue-datepicker';
// import '@vuepic/vue-datepicker/dist/main.css';
import { CIcon } from '@coreui/icons-vue';
import * as icon from '@coreui/icons';


export default {
    data() {
        return {
            znumber: '',
            cid: '',
            conid: '',
            asfal: '',
            poso: '',
            inputdate: '',
            status: 1,
            cfile: '',
            live: false,
            insur: [],
            cus: [],
            con: [],
            todayDate: new Date(),
            searchQuery: '',
            searchQuery2: '',
            filtercon: [],
        };
    },
    setup() {
        return {
            icon,
        }
    },

    created() {
        this.getcustomers()
        this.getcon()
    },

    computed: {
        filteredItems() {
            return this.cus.filter(item =>
                Object.values(item)
                    .join(' ')
                    .toLowerCase()
                    .includes(this.searchQuery.toLowerCase())
            );
        },
        filteredItems2() {

            return this.filtercon.filter(item =>
                Object.values(item)
                    .join(' ')
                    .toLowerCase()
                    .includes(this.searchQuery2.toLowerCase())
            );
        },
    },
    methods: {
        Add() {
            if (confirm("Είστε σίγουρος ότι θέλετε να γίνει Αποστολή;")) {
                axios.post('/zimies', {
                    znumber: '-',
                    insidid: this.asfal,
                    customerid: this.cid,
                    poso: this.poso,
                    contractid: this.conid,
                    status: '-',
                    inputdate: '-'
                }).then(res => {
                    setTimeout(() => {this.$router.push('/MZimies')}, 1000)
                    console.log(res)
                    })
                    .catch(err => console.log(err))

                this.znumber = ''
                this.asfal = ''
                this.cid = ''
                this.poso = ''
                this.status = 1
                this.conid = ''
                this.inputdate = ''
                this.cfile = ''
                this.todayDate = new Date()

                this.live = true


            }
            setTimeout(() => {
                this.live = false;
            }, 3000);
        },

        getcustomers() {
            axios.get('/customer').then(res => {
                this.cus = res.data
            })
        },
        getcon() {
            axios.get('/contracts-customer').then(res => {
                this.con = res.data
            })
        },

        changecon() {
            this.filtercon = this.con.filter(obj => obj.custid == this.cid)
        },

        getins() {
            const result = this.con.find(item => item.conid == this.conid);
            this.asfal = result.insuranceid;
        }
    },


    components: { CCardBody, CIcon }
}
</script>