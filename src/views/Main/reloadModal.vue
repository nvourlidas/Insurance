<template>
    <CModal alignment="center" >
        <CForm @submit.prevent="reload">
            <CModalHeader>
                <CModalTitle>{{ con.conumber }}</CModalTitle>
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
export default {
    props: {
        con: Object,
    },
    data(){
        return {
            startdate: '',
            enddate: '',
        }
    },

    methods: {
        reload(){
            var id = this.con.conid
            if (confirm("Είστε σίγουρος ότι θέλετε να γίνει Ανανέωση;")){
                axios.patch(`/contracts/${id}`, {
                    startdate: this.startdate,
                    enddate: this.enddate
                }).then(this.$emit('close-modal', id))
            }
        }
    },
    components: {VueDatePicker },
}
</script>