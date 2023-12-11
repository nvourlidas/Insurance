<template>
    <CAlert color="success" :visible="live">Επιτυχημέμη Εισαγωγή Συμβολαίου</CAlert>
    <CCard>
        <CForm @submit.prevent="Add">
            <CCardHeader style="text-align: center; padding: 20px; background-color: rgba(100, 100, 96, 0.158);">
                <h3>Νέο Συμβόλαιο</h3>
            </CCardHeader>
            <CCardBody>
                <CRow :xs="{ gutter: 2 }" style="padding: 20px;">
                    <CCol md>
                        <CFormLabel style="font-size: 20px; font-weight: bold;">Αριθμός Συμβολαίου</CFormLabel>
                        <CFormInput type="text" floatingLabel="Αριθμός Συμβολαίου" placeholder="Αριθμός Συμβολαίου"
                            v-model="connumber" />

                    </CCol>
                    <CCol md>
                        <CFormLabel style="font-size: 20px; font-weight: bold;">ΑΦΜ Πελάτη</CFormLabel>
                        <CFormInput type="text" floatingLabel="ΑΦΜ Πελάτη" placeholder="ΑΦΜ Πελάτη" v-model="afmpelati" />
                    </CCol>
                </CRow>
                <CRow :xs="{ gutter: 2 }" style="padding: 20px;">
                    <CCol md>
                        <CFormLabel style="font-size: 20px; font-weight: bold;">Ημ. Έναρξης</CFormLabel>
                        <VueDatePicker v-model="startdate" placeholder="Ημερομηνία Έναρξης" format="dd-MM-yyyy" model-type="yyyy-MM-dd"></VueDatePicker>

                    </CCol>
                    <CCol md>
                        <CFormLabel style="font-size: 20px; font-weight: bold;">Ημ. Λήξης</CFormLabel>
                        <VueDatePicker v-model="enddate" placeholder="Ημερομηνία Λήξης" format="dd-MM-yyyy" model-type="yyyy-MM-dd"></VueDatePicker>
                    </CCol>
                    <CRow :xs="{ gutter: 2 }" style="padding: 20px; text-align: center;">
                        <CCol md>
                            <CFormLabel style="font-size: 20px; font-weight: bold;">Καθαρά</CFormLabel>
                            <CInputGroup class="mb-3">
                                <CInputGroupText>€</CInputGroupText>
                                <CFormInput type="number" placeholder="0.00" v-model="clean" />
                            </CInputGroup>

                        </CCol>
                        <CCol md>
                            <CFormLabel style="font-size: 20px; font-weight: bold;">Μεικτά</CFormLabel>
                            <CInputGroup class="mb-3">
                                <CInputGroupText>€</CInputGroupText>
                                <CFormInput type="number" placeholder="0.00" v-model="mikta" />
                            </CInputGroup>
                        </CCol>
                        <CCol md>
                            <CFormLabel style="font-size: 20px; font-weight: bold;">Προμήθεια</CFormLabel>
                            <CInputGroup class="mb-3">
                                <CInputGroupText>€</CInputGroupText>
                                <CFormInput type="number" placeholder="0.00" v-model="prom" />
                            </CInputGroup>
                        </CCol>
                    </CRow>
                </CRow>
                <CRow :xs="{ gutter: 2 }" style="padding: 20px;">
                    <CCol md>
                        <CFormLabel style="font-size: 20px; font-weight: bold;">Ασφαλιστική</CFormLabel>
                        <CFormSelect size="lg" class="mb-3" v-model="asfal">
                            <option v-for="entry in insur" :key="entry.inid" :value="entry.inid"> {{ entry.name }}</option>
                        </CFormSelect>
                    </CCol>
                    <CCol md>
                        <CFormLabel style="font-size: 20px; font-weight: bold;">Κλάδος</CFormLabel>
                        <CFormSelect size="lg" class="mb-3" v-model="branch">
                            <option>Κλάδος</option>
                            <option value="1">ΑΥΤΟΚΙΝΗΤΟΥ</option>
                            <option value="2">ΖΩΗΣ</option>
                            <option value="3">ΥΓΕΙΑΣ</option>
                            <option value="4">ΠΕΡΙΟΥΣΙΑΣ</option>
                            <option value="5">ΑΣΤΙΚΗΣ ΕΥΘΥΝΗΣ</option>
                            <option value="6">ΧΡΗΜΑΤΙΚΩΝ ΑΠΩΛΕΙΩΝ</option>
                            <option value="7">ΝΟΜΙΚΗΣ ΠΡΟΣΤΑΣΙΑΣ</option>
                            <option value="8">ΤΑΞΙΔΙΩΤΙΚΗ</option>
                            <option value="9">ΤΕΧΝΙΚΩΝ ΑΣΦΑΛΗΣΕΩΝ</option>
                            <option value="10">ΜΕΤΑΦΟΡΩΝ</option>
                        </CFormSelect>
                    </CCol>
                </CRow>
                <CRow :xs="{ gutter: 2 }" style="padding: 20px;">
                    <CCol md>
                        <CFormLabel style="font-size: 20px; font-weight: bold;">Ομαδικό</CFormLabel>
                        <CFormSelect size="lg" class="mb-3" v-model="omadiko">
                            <option>Ομαδικό</option>
                            <option value="1">ΝΑΙ</option>
                            <option value="2">ΟΧΙ</option>
                        </CFormSelect>
                    </CCol>
                    <CCol md>
                        <CFormLabel style="font-size: 20px; font-weight: bold;">Τρόπος Πληρωμής</CFormLabel>
                        <CFormSelect size="lg" class="mb-3" v-model="method">
                            <option>Τρόπος Πληρωμής</option>
                            <option value="1">Μηνιαία</option>
                            <option value="2">3μηνη</option>
                            <option value="3">6μηνη</option>
                            <option value="4">Ετήσια</option>
                            <option value="5">'Εως Λήξη Συμβολαίου</option>
                        </CFormSelect>
                    </CCol>
                </CRow>
            </CCardBody>
            <CCardFooter style="text-align: center; padding: 20px;">
                <CButton type="submit" size="lg" color="primary">
                    <CIcon :icon="icon.cilSave" size="xl"/> Εισαγωγή Συμβολαίου
                </CButton>
            </CCardFooter>
        </CForm>
    </CCard>
</template>

<script>
import { CCardBody } from '@coreui/vue';
import axios from 'axios';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { CIcon } from '@coreui/icons-vue';
import * as icon from '@coreui/icons';

export default {
    data() {
        return {
            connumber: '',
            afmpelati: '',
            startdate: '',
            enddate: '',
            clean: '',
            mikta: '',
            prom: '',
            asfal: '',
            branch: '',
            status: '',
            method: '',
            omadiko: '',
            live: false,
            insur: [],
        };
    },
    setup() {
        return {
            icon,
        }
    },

    created(){
        this.getInsuranes()
    },
    methods: {
        Add() {
            if (confirm("Είστε σίγουρος ότι θέτε να γίνει Αποστολή;")) {
                axios.post('/contracts', {
                    afm: this.afmpelati,
                    conumber: this.connumber,
                    insuranceid: this.asfal,
                    branchid: this.branch,
                    startdate: this.startdate,
                    enddate: this.enddate,
                    clear: this.clean,
                    mikta: this.mikta,
                    promithia: this.prom,
                    paymentmethod: this.method,
                    omadiko: this.omadiko
                }).catch(err => console.log(err))

                this.connumber =''
                this.afmpelati = ''
                this.startdate = ''
                this.enddate = ''
                this.clean = ''
                this.mikta = ''
                this.prom = ''
                this.asfal = ''
                this.branch = ''
                this.status =''
                this.method = ''
                this.omadiko= ''
                this.live = true
            }
            setTimeout(() => {
                this.live = false;
            }, 3000);
        },

        getInsuranes(){
            axios.get('/insurances')
            .then(res=>{
                this.insur=res.data
                console.log(this.insur)
            })
                
        }
    },
    components: { CCardBody, VueDatePicker, CIcon }
}
</script>