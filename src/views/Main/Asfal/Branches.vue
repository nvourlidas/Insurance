<template>
    <CButton color="primary" variant="ghost" @click="vis = !vis" style=" height: 55px; margin-bottom: 20px;"><b>
                <CIcon :icon="icon.cilPlus" size="xl"></CIcon> Εισαγωγή Κλάδου
            </b> </CButton>
            <CForm @submit.prevent="Add" v-if="vis">
                <CRow :xs="{ gutter: 2 }" style="padding: 20px;">
                <CCol md>
                <CFormInput size="sm" type="text" floatingLabel="Κλάδος" placeholder="Κλάδος" v-model="name" />
            </CCol>
            <CCol md>
                <CButton type="submit" size="md" color="primary">
                    <CIcon :icon="icon.cilSave" size="lg" /> Εισαγωγή Κλάδου
                </CButton>
            </CCol>
        </CRow>
            </CForm>
    <CTable striped bordered>
        <CTableHead>
            <CTableRow style="text-align: center;">
                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                <CTableHeaderCell scope="col">Κλάδος Ασφάλισης</CTableHeaderCell>
                <CTableHeaderCell scope="col">Διαγραφή</CTableHeaderCell>
            </CTableRow>
        </CTableHead>
        <CTableBody>
            <CTableRow v-for="(entry, id) in table" :item="entry" :key="id" style="text-align: center;">
                <CTableDataCell>{{ id+1 }}</CTableDataCell>
                <CTableDataCell>{{ entry.bname }}</CTableDataCell>
                <CTableDataCell>
                    <CButton style="color: rgb(165, 49, 45);" @click="deletecus(entry.inid)">
                        <CIcon :icon="icon.cilXCircle" height="32"></CIcon>
                    </CButton>
                </CTableDataCell>
            </CTableRow>
        </CTableBody>
    </CTable>
</template>

<script>
import axios from 'axios'
import * as icon from '@coreui/icons';

export default {
    data(){
        return {
            table: [],
            name: '',
            vis: false,
        }
    },

    setup() {
        return {
            icon,
        }
    },

    created(){
        this.getins()
    },

    methods: {
        getins(){
            axios.get('/branches').then(res => {this.table = res.data})
        },

        Add(){
            console.log(4)
        }
    }
}

</script>