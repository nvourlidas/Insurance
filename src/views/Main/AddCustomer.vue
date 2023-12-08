<template>
    <CAlert color="success" :visible="live">Επιτυχημέμη Εισαγωγή Πελάτη</CAlert>
    <CCard>
        <CForm @submit.prevent="Add">
            <CCardHeader style="text-align: center; padding: 20px; background-color: rgba(100, 100, 96, 0.158);">
                <h3>Νέος Πελάτης</h3>
            </CCardHeader>
            <CCardBody>

                <CRow :xs="{ gutter: 2 }" style="padding: 20px;">
                    <CCol md>
                            <CFormLabel style="font-size: 20px; font-weight: bold;">Όνομα</CFormLabel>
                            <CFormInput type="text" floatingLabel="Όνομα" placeholder="Όνομα" v-model="name" />
                        
                    </CCol>
                    <CCol md>
                        <CFormLabel style="font-size: 20px; font-weight: bold;">Επίθετο</CFormLabel> 
                            <CFormInput type="text" floatingLabel="Επίθετο" placeholder="Όνομα" v-model="surname" />
                        
                    </CCol>
                </CRow>
                <CRow :xs="{ gutter: 2 }" style="padding: 20px;">
                    <CCol md>
                        <CFormLabel style="font-size: 20px; font-weight: bold;">Email</CFormLabel>
                            <CFormInput type="email" floatingLabel="Email"  placeholder="Email" v-model="email" />
                        
                    </CCol>
                    <CCol md>
                            <CFormLabel style="font-size: 20px; font-weight: bold;">Κινητό</CFormLabel>
                            <CFormInput type="tel" floatingLabel="Κινητό" placeholder="Κινητό" v-model="cellphone" />
                        
                    </CCol>
                </CRow>
                <CRow :xs="{ gutter: 2 }" style="padding: 20px;">
                    <CCol md>
                        <CFormLabel style="font-size: 20px; font-weight: bold;">ΑΦΜ</CFormLabel>
                            <CFormInput type="text" floatingLabel="ΑΦΜ" placeholder="ΑΦΜ" v-model="afm" />
                        
                    </CCol>
                    <CCol md>
                        <CFormLabel style="font-size: 20px; font-weight: bold;">Σταθερό</CFormLabel>
                            <CFormInput type="tel" floatingLabel="Σταθερό" placeholder="Σταθερό" v-model="phone" />
                        
                    </CCol>
                </CRow>
                <CRow :xs="{ gutter: 2 }" style="padding: 20px;">
                    <CCol md>
                        <CFormLabel style="font-size: 20px; font-weight: bold;">Τ.Κ.</CFormLabel>
                            <CFormInput type="text" floatingLabel="Τ.Κ." placeholder="T.K." v-model="tk" />
                        
                    </CCol>
                    <CCol md>
                        <CFormLabel style="font-size: 20px; font-weight: bold;">Ημερομηνία Γέννησης</CFormLabel>
                        <VueDatePicker v-model="birthdate" placeholder="Ημερομηνία Γέννησης" format="dd-MM-yyyy" model-type="dd-MM-yyyy"></VueDatePicker>
                    </CCol>
                </CRow>
                <CRow :xs="{ gutter: 2 }" style="padding: 20px;">
                    <CCol md>
                        <CFormLabel style="font-size: 20px; font-weight: bold;">Φύλλο</CFormLabel>
                        <CFormSelect size="lg" class="mb-3" v-model="gender">
                            <option>Φύλο</option>
                            <option value="A">Άνδρας</option>
                            <option value="G">Γυναίκα</option>
                        </CFormSelect>
                    </CCol>
                    <CCol md>
                        <CFormLabel style="font-size: 20px; font-weight: bold;">Ιδιότητα</CFormLabel>
                        <CFormSelect size="lg" class="mb-3" v-model="status">
                            <option>Ιδιότητα</option>
                            <option value="A">Φυσικό Πρόσωπο</option>
                            <option value="N">Νομικό Πρόσωπο</option>
                        </CFormSelect>
                    </CCol>
                </CRow>
            </CCardBody>
            <CCardFooter style="text-align: center; padding: 20px;">
                <CButton type="submit" size="lg" color="primary">
                        <CIcon name="cil-check-circle" /> Εισαγωγή Πελάτη
                    </CButton>
            </CCardFooter>
        </CForm>
    </CCard>
</template>

<script>
import { CCardHeader, CFormLabel } from '@coreui/vue';
import axios from 'axios';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

export default {
    data() {
        return {
            name: '',
            surname: '',
            email: '',
            cellphone: '',
            afm: '',
            phone: '',
            tk: '',
            birthdate: '',
            gender: '',
            status: '',
            live: false,
        };
    },

    methods:{
        Add(){
            if (confirm("Είστε σίγουρος ότι θέτε να γίνει Αποστολή;")) {
            axios.post('/customer', {
                name: this.name,
                surname: this.surname,
                email: this.email,
                cellphone: this.cellphone,
                phone: this.phone,
                gender: this.gender,
                postcode: this.tk,
                property: this.status,
                birthday: this.birthdate,
                afm: this.afm
            }).catch(err => console.log(err))

            this.name= '',
            this.surname= '',
            this.email= '',
            this.cellphone= '',
            this.afm= '',
            this.phone= '',
            this.tk= '',
            this.birthdate= '',
            this.gender= '',
            this.status= '',
            this.live= true
        }

        setTimeout(() => {
                this.live = false;
            }, 3000);
    },
},
    components: { CCardHeader, CFormLabel, VueDatePicker }
}
</script>