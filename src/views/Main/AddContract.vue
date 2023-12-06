<template>
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
                        <CFormInput type="date" floatingLabel="Ημ. Έναρξης" placeholder="Ημ. Έναρξης" v-model="startdate"
                            pattern="\d{2}/\d{2}/\d{2}" />

                    </CCol>
                    <CCol md>
                        <CFormLabel style="font-size: 20px; font-weight: bold;">Ημ. Λήξης</CFormLabel>
                        <CFormInput type="date" floatingLabel="Ημ. Λήξης" placeholder="Ημ. Λήξης" v-model="enddate"
                            pattern="\d{2}/\d{2}/\d{2}" />
                    </CCol>
                    <CRow :xs="{ gutter: 2 }" style="padding: 20px; text-align: center;">
                        <CCol md>
                            <CFormLabel style="font-size: 20px; font-weight: bold;">Καθαρά</CFormLabel>
                            <CInputGroup class="mb-3">                               
                                <CInputGroupText>€</CInputGroupText>
                                <CFormInput type="number" placeholder="0.00" v-model="clean"/>
                            </CInputGroup>

                        </CCol>
                        <CCol md>
                            <CFormLabel style="font-size: 20px; font-weight: bold;">Μεικτά</CFormLabel>
                            <CInputGroup class="mb-3">                         
                                <CInputGroupText>€</CInputGroupText>
                                <CFormInput type="number" placeholder="0.00" v-model="mikta"/>
                            </CInputGroup>
                        </CCol>
                        <CCol md>
                            <CFormLabel style="font-size: 20px; font-weight: bold;">Προμήθεια</CFormLabel>
                            <CInputGroup class="mb-3">                         
                                <CInputGroupText>€</CInputGroupText>
                                <CFormInput type="number" placeholder="0.00" v-model="prom"/>
                            </CInputGroup>
                        </CCol>
                    </CRow>
                </CRow>
                <CRow :xs="{ gutter: 2 }" style="padding: 20px;">
                    <CCol md>
                        <CFormLabel style="font-size: 20px; font-weight: bold;">Ασφαλιστική</CFormLabel>
                        <CFormSelect size="lg" class="mb-3" v-model="asfal">
                            <option>Ασφαλιστική</option>
                            <option value="1">Interamerican</option>
                            <option value="2">NN</option>
                            <option value="3">Αγροτική Ασφαλιστική</option>
                        </CFormSelect>
                    </CCol>
                    <CCol md>
                        <CFormLabel style="font-size: 20px; font-weight: bold;">Κλάδος</CFormLabel>
                        <CFormSelect size="lg" class="mb-3" v-model="branch">
                            <option>Κλάδος</option>
                            <option value="1">Υγείας</option>
                            <option value="2">Σπιτιού</option>
                            <option value="3">Αυτοκινήτου</option>
                        </CFormSelect>
                    </CCol>
                </CRow>
                <CRow :xs="{ gutter: 2 }" style="padding: 20px;">
                    <CCol md>
                        <CFormLabel style="font-size: 20px; font-weight: bold;">Κατάσταση Πληρωμής</CFormLabel>
                        <CFormSelect size="lg" class="mb-3" v-model="status">
                            <option>Εξοφλημένο</option>
                            <option value="1">ΝΑΙ</option>
                            <option value="2">ΟΧΙ</option>
                        </CFormSelect>
                    </CCol>
                    <CCol md>
                        <CFormLabel style="font-size: 20px; font-weight: bold;">Τρόπος Πληρωμής</CFormLabel>
                        <CFormSelect size="lg" class="mb-3" v-model="method">
                            <option>Τρόπος Πληρωμής</option>
                            <option value="1">Δόσεις</option>
                            <option value="2">Ολική Εξόφληση</option>
                        </CFormSelect>
                    </CCol>
                </CRow>
            </CCardBody>
            <CCardFooter style="text-align: center; padding: 20px;">
                <CButton type="submit" size="bg" color="primary">
                        <CIcon name="cil-check-circle" /> Εισαγωγή Συμβολαίου
                    </CButton>
            </CCardFooter>
        </CForm>
    </CCard>
</template>

<script>
import { CCardBody } from '@coreui/vue';
import axios from 'axios';

export default {
    data() {
        return {
            connumber:'',
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
        };
    },
    methods: {
        Add() {
            axios.post('/contracts',{
                afm:this.afmpelati,
                conumber:this.connumber,
                insuranceid: this.asfal,
                branchid:this.branch,
                startdate:this.startdate,
                enddate: this.enddate,
                clear: this.clean,
                mikta:this.mikta,
                promithia: this.prom,
                paymentmethod: this.method
            }).catch(err => console.log(err));
        }
    },
    components: { CCardBody }
}
</script>