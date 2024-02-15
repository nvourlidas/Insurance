<template>
    <CModal alignment="center" >
        <CForm @submit.prevent="reload">
            <CModalHeader>
                <CModalTitle>Αριθμός Συμβολαίου: {{ con.conumber }}</CModalTitle>
            </CModalHeader>
            <CModalBody>

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
                <CCol md>
                        <CFormLabel style="font-size: 20px; font-weight: bold;">Τρόπος Πληρωμής</CFormLabel>
                        <CFormSelect size="lg" class="mb-3" v-model="method">
                            <option value="4">'Εως Λήξη Συμβολαίου</option>
                            <option value="1">Μηνιαία</option>
                            <option value="2">3μηνη</option>
                            <option value="3">6μηνη</option>
                        </CFormSelect>
                    </CCol>
                    <CRow :xs="{ gutter: 2 }" style="text-align: center;">
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
                    <CFormInput type="file" id="upload" @change="handleFileChange" hidden />
                <label for="upload"
                    style="margin: 1%; border: 1px solid; padding: 20px; border-radius: 30px; cursor: pointer;"><b> Επιιλογή
                        αρχείου Συμβολαίου </b>
                    <CIcon :icon="icon.cilCloudUpload" height="32"></CIcon>
                </label>
            </CModalBody>
            <CModalFooter>
                <CButton type="submit" color="primary">Ανανέωση</CButton>
            </CModalFooter>
        </CForm>
    </CModal>
</template>

<script>
 import axios from 'axios';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { format } from 'date-fns';
import { CIcon } from '@coreui/icons-vue';
import * as icon from '@coreui/icons';

export default {
    props: {
        con: Object,
    },
    data(){
        return {
            startdate: '',
            enddate: '',
            clean: '',
            mikta: '',
            prom: '',
            method: 4,
            paydate: '',
            ispaid: '',
            cfile: '',
            todayDate: new Date(),
        }
    },

    setup() {
        return {
            icon,
        }
    },

    methods: {
        reload(){
            var id = this.con.conid
            this.getpaydate()
            if (confirm("Είστε σίγουρος ότι θέλετε να γίνει Ανανέωση;")){
                axios.patch(`/contracts/${id}`, {
                    startdate: this.startdate,
                    enddate: this.enddate,
                    paymentmethod: this.method,
                    paydate: this.paydate,
                    ispaid: this.ispaid,
                    clear: this.clean,
                    mikta: this.mikta,
                    promithia: this.prom,
                    inform: 0
                }).then(this.$emit('reload', id))
                this.upload(id)
            }
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

            console.log(this.paydate)

        },
    },
    components: {VueDatePicker, CIcon },
}
</script>