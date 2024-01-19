<template>
    <CModal alignment="center" >
        <CForm @submit.prevent="sent">
            <CModalHeader>
                <CModalTitle>Αποστολή Ζημίας</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CCol md>
                    <CFormLabel style="font-size: 20px; font-weight: bold;">Αριθμός Ζημίας</CFormLabel>
                        <CFormInput type="text" floatingLabel="Αριθμός Ζημίας" placeholder="Αριθμός Ζημίας"
                            v-model="znumber" required/>
                </CCol>
                <CCol md>
                    <CFormLabel style="font-size: 20px; font-weight: bold;">Ημερομηνία Καταχώρησης</CFormLabel>
                    <VueDatePicker v-model="inputdate" placeholder="Ημερομηνία Καταχώρησης" format="dd-MM-yyyy"
                        model-type="yyyy-MM-dd"></VueDatePicker>
                </CCol>
            </CModalBody>
            <CModalFooter>
                <CButton type="submit" color="primary">Αποστολή</CButton>
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
        zim: Object,
    },
    data(){
        return {
            znumber:'',
            inputdate: '',
            status: 1,
        }
    },

    methods: {
        sent(){
            var id = this.zim.zid
            if (confirm("Είστε σίγουρος ότι θέλετε να γίνει Αποστολή;")){
                axios.patch(`/zimies/${id}`, {
                    znumber: this.znumber,
                    inputdate: this.inputdate,
                    status: this.status
                }).then(this.$emit('close-modal', id))
                .then(res => {
                    setTimeout(() => {this.$router.push('/Zimies')}, 1000)
                    console.log(res)
                    })
            }
        }
    },
    components: {VueDatePicker },
}
</script>