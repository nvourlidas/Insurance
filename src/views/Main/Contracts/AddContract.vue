<template>
    <CAlert color="success" :visible="live">Επιτυχής Εισαγωγή Συμβολαίου</CAlert>
    <CAlert color="danger" :visible="live2">Αποτυχία Εισαγωγής Συμβολαίου. Δοκιμάστε Ξανά</CAlert>
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
                        <CFormLabel style="font-size: 20px; font-weight: bold;">Αναζήτηση με ΑΦΜ Πελάτη</CFormLabel>
                        <CFormInput type="text" floatingLabel="Αναζήτηση με ΑΦΜ Πελάτη" placeholder="ΑΦΜ Πελάτη"
                            v-model="searchQuery" />
                        <CFormSelect size="lg" multiple class="mb-3" v-model="afmpelati" :html-size="5">

                            <option v-for="entry in filteredItems" :key="entry.afm" :value="entry.afm"> {{ entry.afm }} ({{
                                entry.name }} {{ entry.surname }})</option>
                        </CFormSelect>
                    </CCol>
                </CRow>
                <CRow :xs="{ gutter: 2 }" style="padding: 20px;">
                    <CCol md>
                        <CFormLabel style="font-size: 20px; font-weight: bold;">Ημ. Έναρξης</CFormLabel>
                        <VueDatePicker v-model="startdate" placeholder="Ημερομηνία Έναρξης" format="dd-MM-yyyy"
                            model-type="yyyy-MM-dd"></VueDatePicker>

                    </CCol>
                    <CCol md>
                        <CFormLabel style="font-size: 20px; font-weight: bold;">Ημ. Λήξης</CFormLabel>
                        <VueDatePicker v-model="enddate" placeholder="Ημερομηνία Λήξης" format="dd-MM-yyyy"
                            model-type="yyyy-MM-dd"></VueDatePicker>
                    </CCol>
                    <CRow :xs="{ gutter: 2 }" style="padding: 20px; text-align: center;">
                        <CCol md>
                            <CFormLabel style="font-size: 20px; font-weight: bold;">Καθαρά</CFormLabel>
                            <CInputGroup class="mb-3">
                                <CInputGroupText>€</CInputGroupText>
                                <CFormInput type="text" placeholder="0.00" v-model="clean" />
                            </CInputGroup>

                        </CCol>
                        <CCol md>
                            <CFormLabel style="font-size: 20px; font-weight: bold;">Μεικτά</CFormLabel>
                            <CInputGroup class="mb-3">
                                <CInputGroupText>€</CInputGroupText>
                                <CFormInput type="text" placeholder="0.00" v-model="mikta" />
                            </CInputGroup>
                        </CCol>
                        <CCol md>
                            <CFormLabel style="font-size: 20px; font-weight: bold;">Προμήθεια</CFormLabel>
                            <CInputGroup class="mb-3">
                                <CInputGroupText>€</CInputGroupText>
                                <CFormInput type="text" placeholder="0.00" v-model="prom" />
                            </CInputGroup>
                        </CCol>
                    </CRow>
                </CRow>
                <CRow :xs="{ gutter: 2 }" style="padding: 20px;">
                    <CCol md>
                        <CFormLabel style="font-size: 20px; font-weight: bold;">Ασφαλιστική</CFormLabel>
                        <CFormSelect size="lg" class="mb-3" v-model="asfal">
                            <option>Επιλογή Ασφαλιστικής</option>
                            <option v-for="entry in insur" :key="entry.inid" :value="entry.inid"> {{ entry.iname }}</option>
                        </CFormSelect>
                    </CCol>
                    <CCol md>
                        <CFormLabel style="font-size: 20px; font-weight: bold;">Κλάδος</CFormLabel>
                        <CFormSelect size="lg" class="mb-3" v-model="branch">
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
                <CRow v-if="omadiko == 1">
                    <CCol md>
                        <CFormLabel style="font-size: 20px; font-weight: bold;">Προσθήκη Πελατών Σε Ομαδικό</CFormLabel>
                        <CFormInput type="text" floatingLabel="Αναζήτηση με  ΑΦΜ Πελάτη"
                            placeholder="Αναζήτηση με  ΑΦΜ Πελάτη" v-model="searchQuery" />
                        <!-- <CFormSelect size="lg" class="mb-6" v-model="teamcus" multiple :html-size="6">
                            <option v-for="entry in filteredItems" :key="entry.cid" :value="entry.cid"> {{ entry.afm }} ({{
                                entry.name }} {{ entry.surname }})</option>
                        </CFormSelect> -->
                        <!-- <div v-for="entry in filteredItems" :key="entry.cid">
                            <input type="checkbox" :value="entry" v-model="teamcus" id="cust" />
                            <label :for="entry.cid">{{ entry.afm }} ({{
                                entry.name }} {{ entry.surname }})</label>
                        </div> -->
                        <div class="custom-select">
                            <div class="selected-values" @click="toggleDropdown">
                                <span v-if="teamcus.length === 0">Επιλογή Πελατών</span>
                                <span v-else>
                                    Επιλεγμένοι Πελάτες: {{ teamcus.map(item => item.afm).join(', ') }}
                                </span>
                            </div>

                            <div v-show="dropdownVisible" class="dropdown">
                                <div v-for="entry in filteredItems" :key="entry.cid">
                                    <input type="checkbox" :value="entry" v-model="teamcus" id="color" />
                                    <label :for="entry.cid">{{ entry.afm }} ({{
                                        entry.name }} {{ entry.surname }})</label>
                                </div>
                            </div>
                        </div>
                    </CCol>
                    <CCol md>
                        <h3>Επιλεγμένοι Πελάτες</h3>
                        <div class="selected">
                            <ul>
                                <li v-for="e in teamcus" :key="e.cid">{{ e.afm }} ({{ e.name }} {{ e.surname }})</li>
                            </ul>
                        </div>
                    </CCol>
                </CRow>
                <CFormInput type="file" id="upload" @change="handleFileChange" hidden />
                <label for="upload"
                    style="margin: 1%; border: 1px solid; padding: 20px; border-radius: 30px; cursor: pointer;"><b> Ανέβασμα
                        αρχείου Συμβολαίου </b>
                    <CIcon :icon="icon.cilCloudUpload" height="32"></CIcon>
                </label>
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
            live2: false,
            insur: [],
            bran: [],
            cus: [],
            coid: '',
            paydate: '',
            ispaid: '',
            todayDate: new Date(),
            searchQuery: '',
            teamcus: [],
            dropdownVisible: false
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
                    paydate: this.paydate,
                    inform: 0,
                    customers: this.teamcus
                }).then(res => { this.upload(res.data.id), this.live = true })
                    .catch(err => { console.log(err), this.live2 = true })

                this.connumber = ''
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
                this.todayDate = new Date()




            }
            setTimeout(() => {
                this.live = false;
                this.live2 = false;
            }, 3000);
        },

        toggleDropdown() {
            this.dropdownVisible = !this.dropdownVisible;
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

        getcustomers() {
            axios.get('/customer').then(res => {
                this.cus = res.data
            })
        },

        handleFileChange(event) {
            this.cfile = event.target.files[0];
        },

        upload(id) {
            if (this.cfile) {
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

        getpaydate() {
            var original = new Date(this.startdate);
            var newDate = new Date(original);



            if (this.method == 1) {
                if (newDate < this.todayDate) {
                    newDate.setMonth(this.todayDate.getMonth() + 1);
                    newDate = new Date(newDate)
                    const formattedNewDate = `${this.todayDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}-${String(original.getDate()).padStart(2, '0')}`;
                    this.paydate = formattedNewDate
                } else {
                    newDate.setMonth(newDate.getMonth() + 1);

                    newDate = format(newDate, 'yyyy-MM-dd')
                    this.paydate = newDate
                }
                this.ispaid = 0
                console.log(this.paydate)
            } else if (this.method == 2) {
                if (newDate < this.todayDate) {
                    newDate.setMonth(this.todayDate.getMonth() + 3);
                    newDate = new Date(newDate)
                    const formattedNewDate = `${this.todayDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}-${String(original.getDate()).padStart(2, '0')}`;
                    this.paydate = formattedNewDate
                } else {
                    newDate.setMonth(newDate.getMonth() + 1);

                    newDate = format(newDate, 'yyyy-MM-dd')
                    this.paydate = newDate
                }
                this.ispaid = 0
                console.log(this.paydate)
            } else if (this.method == 3) {
                if (newDate < this.todayDate) {
                    newDate.setMonth(this.todayDate.getMonth() + 6);
                    newDate = new Date(newDate)
                    const formattedNewDate = `${this.todayDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}-${String(original.getDate()).padStart(2, '0')}`;
                    this.paydate = formattedNewDate
                } else {
                    newDate.setMonth(newDate.getMonth() + 1);

                    newDate = format(newDate, 'yyyy-MM-dd')
                    this.paydate = newDate
                }
                this.ispaid = 0
                console.log(this.paydate)
            } else {
                this.paydate = this.enddate
                this.ispaid = 1
            }

        },
    },


    components: { CCardBody, VueDatePicker, CIcon }
}
</script>

<style scoped>
.custom-select {
    position: relative;
    width: 100%;
    margin-bottom: 5%;
}

.selected-values {
    cursor: pointer;
    padding: 10px;
    border: 1px solid #ccc;
}

.dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    border: 1px solid #ccc;
    background-color: #fff;
    max-height: 200px;
    overflow-y: auto;
    z-index: 1;
}

.dropdown div {
    padding: 5px;
    display: flex;
    align-items: center;
}

.dropdown input {
    margin-right: 5px;
}

.selected {
    border: 1px solid;
    border-radius: 20px;
    overflow-y: scroll;
    font-size: 19px;
    max-height: 200px;
}
</style>