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
                            v-model="connumber" required/>

                    </CCol>
                    <CCol md>
                        <CFormLabel style="font-size: 20px; font-weight: bold;">ΑΦΜ Πελάτη</CFormLabel>
                        <CFormInput type="text" floatingLabel="ΑΦΜ Πελάτη" placeholder="ΑΦΜ Πελάτη" v-model="searchQuery" />
                        <CFormSelect size="lg" multiple  class="mb-3" v-model="afmpelati" :html-size="2" required>
                            
                            <option v-for="entry in filteredItems" :key="entry.afm" :value="entry.afm"> {{ entry.afm }} ({{ entry.name  }} {{ entry.surname }})</option>
                        </CFormSelect>
                        
                    </CCol>
                </CRow>
                <CRow :xs="{ gutter: 2 }" style="padding: 20px;">
                    <CCol md>
                        <CFormLabel style="font-size: 20px; font-weight: bold;">Ημ. Έναρξης</CFormLabel>
                        <VueDatePicker v-model="startdate" placeholder="Ημερομηνία Έναρξης" format="dd-MM-yyyy"
                            model-type="yyyy-MM-dd" required></VueDatePicker>

                    </CCol>
                    <CCol md>
                        <CFormLabel style="font-size: 20px; font-weight: bold;">Ημ. Λήξης</CFormLabel>
                        <VueDatePicker v-model="enddate" placeholder="Ημερομηνία Λήξης" format="dd-MM-yyyy"
                            model-type="yyyy-MM-dd" required></VueDatePicker>
                    </CCol>
                    <CRow :xs="{ gutter: 2 }" style="padding: 20px; text-align: center;">
                        <CCol md>
                            <CFormLabel style="font-size: 20px; font-weight: bold;">Καθαρά</CFormLabel>
                            <CInputGroup class="mb-3">
                                <CInputGroupText>€</CInputGroupText>
                                <CFormInput type="text" placeholder="0.00" v-model="clean" required/>
                            </CInputGroup>

                        </CCol>
                        <CCol md>
                            <CFormLabel style="font-size: 20px; font-weight: bold;">Μεικτά</CFormLabel>
                            <CInputGroup class="mb-3">
                                <CInputGroupText>€</CInputGroupText>
                                <CFormInput type="text" placeholder="0.00" v-model="mikta" required/>
                            </CInputGroup>
                        </CCol>
                        <CCol md>
                            <CFormLabel style="font-size: 20px; font-weight: bold;">Προμήθεια</CFormLabel>
                            <CInputGroup class="mb-3">
                                <CInputGroupText>€</CInputGroupText>
                                <CFormInput type="text" placeholder="0.00" v-model="prom" required/>
                            </CInputGroup>
                        </CCol>
                    </CRow>
                </CRow>
                <CRow :xs="{ gutter: 2 }" style="padding: 20px;">
                    <CCol md>
                        <CFormLabel style="font-size: 20px; font-weight: bold;">Ασφαλιστική</CFormLabel>
                        <CFormSelect size="lg" class="mb-3" v-model="asfal" required>
                            <option>Επιλογή Ασφαλιστικής</option>
                            <option v-for="entry in insur" :key="entry.inid" :value="entry.inid"> {{ entry.iname }}</option>
                        </CFormSelect>
                    </CCol>
                    <CCol md>
                        <CFormLabel style="font-size: 20px; font-weight: bold;">Κλάδος</CFormLabel>
                        <CFormSelect size="lg" class="mb-3" v-model="branch" required>
                            <option>Επιλογή Κλάδου</option>
                            <option v-for="entry in bran" :key="entry.bid" :value="entry.bid"> {{ entry.bname }}</option>
                        </CFormSelect>
                    </CCol>
                    <CCol md v-if="branch == 1">
                        <CFormLabel style="font-size: 20px; font-weight: bold;">Χαρακτηριστικό</CFormLabel>
                        <CFormInput type="text" floatingLabel="Χαρακτηριστικό" placeholder="Χαρακτηριστικό"
                            v-model="pinakida" />

                    </CCol>
                </CRow>
                <CRow :xs="{ gutter: 2 }" style="padding: 20px;">
                    <CCol md>
                        <CFormLabel style="font-size: 20px; font-weight: bold;">Ομαδικό</CFormLabel>
                        <CFormSelect size="lg" class="mb-3" v-model="omadiko">
                            <option value="2">ΟΧΙ</option>
                            <option value="1">ΝΑΙ</option>

                        </CFormSelect>
                    </CCol>
                    <CCol md>
                        <CFormLabel style="font-size: 20px; font-weight: bold;">Τρόπος Πληρωμής</CFormLabel>
                        <CFormSelect size="lg" class="mb-3" v-model="method">
                            <option value="4">'Εως Λήξη Συμβολαίου</option>
                            <option value="1">Μηνιαία</option>
                            <option value="2">3μηνη</option>
                            <option value="3">6μηνη</option>

                        </CFormSelect>
                    </CCol>
                </CRow>
                <CFormInput type="file" id="upload" @change="handleFileChange" hidden />
                <label for="upload"
                    style="margin: 1%; border: 1px solid; padding: 20px; border-radius: 30px; cursor: pointer;"><b> Ανέβασμα
                        αρχείου Συμβολαίου </b>
                    <CIcon :icon="icon.cilCloudUpload" height="32"></CIcon>
                </label>
                {{ coid }}
            </CCardBody>
            <CCardFooter style="text-align: center; padding: 20px;">
                <CButton type="submit" size="lg" color="primary">
                    <CIcon :icon="icon.cilSave" size="xl" /> Εισαγωγή Συμβολαίου
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
import { format } from 'date-fns';

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
            method: 4,
            pinakida: '',
            omadiko: 2,
            cfile: '',
            live: false,
            insur: [],
            bran: [],
            cus:[],
            coid: '',
            paydate: '',
            ispaid: '',
            todayDate: new Date(),
            searchQuery: '',
        };
    },
    setup() {
        return {
            icon,
        }
    },

    created() {
        this.getInsuranes()
        this.getBranches()
        this.getcustomers()
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
    },
    methods: {
        Add() {
            this.getpaydate()
            console.log(this.paydate)
            if (confirm("Είστε σίγουρος ότι θέλετε να γίνει Αποστολή;")) {
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
                    omadiko: this.omadiko,
                    pinakida: this.pinakida,
                    ispaid: this.ispaid,
                    paydate: this.paydate
                }).then(res => { this.upload(res.data.id)})
                    .catch(err => console.log(err))

                this.connumber = ''
                this.afmpelati = ''
                this.startdate = ''
                this.enddate = ''
                this.clean = ''
                this.mikta = ''
                this.prom = ''
                this.asfal = ''
                this.branch = ''
                this.status = ''
                this.method = 4
                this.omadiko = 2
                this.pinakida = ''
                this.paydate = ''
                this.ispaid = ''
                this.todayDate= new Date()

                this.live = true

               
            }
            setTimeout(() => {
                this.live = false;
            }, 3000);
        },

        getInsuranes() {
            axios.get('/insurances')
                .then(res => {
                    this.insur = res.data
                })

        },

        getBranches() {
            axios.get('/branches')
                .then(res => {
                    this.bran = res.data
                })
        },

        getcustomers(){
            axios.get('/customer').then(res => {
                this.cus = res.data
            })
        },

        handleFileChange(event) {
            this.cfile = event.target.files[0];
        },

        upload(id){
            if(this.cfile){
            const formData = new FormData();
                const blob = new Blob([this.cfile], { type: 'application/octet-stream;charset=utf-8' });
                formData.append('file', blob, this.cfile.name);
                formData.append('filename', this.cfile.name);
                formData.append('cuid', 0);
                formData.append('coid', id);
                formData.append('zimid', 0);

                axios.post('/upload', formData)
                    .then(response => {
                        console.log(response.data, formData);
                    })
                    .catch(error => {
                        console.error(error);
                    });
                }
        },

        getpaydate(){
            this.todayDate = format(this.todayDate, 'yyyy-MM-dd')
            const parts = this.todayDate.split("-");
                var month = parseInt(parts[1].padStart(2, '0'), 10)
                var year = parseInt(parts[0].padStart(2, '0'),10)
                var ldm =''
            if (this.method == 1) {
                if(month == 12){
                    year += 1
                    month = 0
                }
                const firstDayOfNextMonth = new Date(year, month +1, 1);
                const lastDayOfMonth = new Date(firstDayOfNextMonth - 1);
                ldm =lastDayOfMonth.getDate()

                month += 1
                if(month<10){
                    this.paydate = year + '-0' + month  + '-' + ldm
                }else{
                    this.paydate = year + '-' + month  + '-' + ldm
                }
                this.ispaid = 0
            }else if(this.method == 2){
                if(month +3 > 12){
                    year += 1
                    month = month + 3 -12
                }else{
                    month += 3
                }
                const firstDayOfNextMonth = new Date(year, month, 1);
                const lastDayOfMonth = new Date(firstDayOfNextMonth - 1);
                ldm =lastDayOfMonth.getDate()

                
                if(month<10){
                    this.paydate = year + '-0' + month  + '-' + ldm
                }else{
                    this.paydate = year + '-' + month  + '-' + ldm
                }
                this.ispaid = 0
            }else if(this.method == 3){
                if(month + 6 > 12){
                    year += 1
                    month = month + 6 -12
                }else{
                    month += 6
                }
                const firstDayOfNextMonth = new Date(year, month, 1);
                const lastDayOfMonth = new Date(firstDayOfNextMonth - 1);
                ldm =lastDayOfMonth.getDate()

                
                if(month<10){
                    this.paydate = year + '-0' + month  + '-' + ldm
                }else{
                    this.paydate = year + '-' + month  + '-' + ldm
                }
                this.ispaid = 0
            }else{
                this.paydate = this.enddate
                this.ispaid = 1
            }
        },
    },


    components: { CCardBody, VueDatePicker, CIcon }
}
</script>