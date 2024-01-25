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
            <CAlert color="success" :visible="live2">Επιτυχής Εισαγωγή Κλάδου</CAlert>
            <CAlert color="warning" :visible="live">Επιτυχής Διαγραφή Κλάδου</CAlert>
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
                    <CButton style="color: rgb(165, 49, 45);" @click="deletein(entry.bid, id)">
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
            live: false,
            live2: false,
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
            axios.post('/branches', {
                bname: this.name
            }).then(res => {
                this.table.push({ bid: res.data.id, bname: this.name }),
                this.live2 = true,
                this.vis = false,
                this.name = ''
            }).catch(err => console.log(err))
            setTimeout(() => {
                this.live2 = false;
            }, 3000);
        },

        deletein(id, j) {
            if (confirm('Είστε σίγουρος ότι θέλετε να γίνει διαγραφή;')) {
                axios.delete(`/branches/${id}`).then(this.table.splice(j, 1), this.live = true).catch(err => console.log(err, id))
            }
            setTimeout(() => {
                this.live = false;
            }, 3000);
        },
    }
}

</script>