<template>
    <CAlert color="warning" :visible="live">Επιτυχής Διαγραφή Χρήστη</CAlert>
    <CAlert color="success" :visible="live2">Επιτυχής Επεξεργασία Χρήστη</CAlert>
    <CTable striped bordered>
        <CTableHead>
            <CTableRow style="text-align: center;">
                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                <CTableHeaderCell scope="col">'Ονομα</CTableHeaderCell>
                <CTableHeaderCell scope="col">Έπώνυμο</CTableHeaderCell>
                <CTableHeaderCell scope="col">Username</CTableHeaderCell>
                <CTableHeaderCell scope="col">Password</CTableHeaderCell>
                <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                <CTableHeaderCell scope="col">Επεξεργασία</CTableHeaderCell>
                <CTableHeaderCell scope="col">Διαγραφή</CTableHeaderCell>
            </CTableRow>
        </CTableHead>
        <CTableBody>
            <CTableRow v-for="(entry, id) in table" :item="entry" :key="id" style="text-align: center;">
                <CTableDataCell>{{ id + 1 }}</CTableDataCell>
                <CTableDataCell>{{ entry.name }}</CTableDataCell>
                <CTableDataCell>{{ entry.surname }}</CTableDataCell>
                <CTableDataCell>{{ entry.username }}</CTableDataCell>
                <CTableDataCell>*******</CTableDataCell>
                <CTableDataCell>{{ entry.email }}</CTableDataCell>
                <CTableDataCell>
                    <CButton style="color: rgb(39, 98, 185);" @click="() => { edit = true, etable = entry }">
                        <CIcon :icon="icon.cilPencil" height="32"></CIcon>
                    </CButton>
                </CTableDataCell>
                <CTableDataCell>
                    <CButton style="color: rgb(165, 49, 45);" @click="deletecus(entry.id, id)">
                        <CIcon :icon="icon.cilXCircle" height="32"></CIcon>
                    </CButton>
                </CTableDataCell>
            </CTableRow>
        </CTableBody>
    </CTable>
    <CModal alignment="center" scrollable :visible="edit" @close="() => { edit = false}">
        <CForm @submit.prevent="upd">
            <CModalHeader>
                <CModalTitle>Επεξεργασία</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CFormLabel style="margin-right: 5px; margin-left: 5px;">Όνομα</CFormLabel>
                <CFormInput type="text" :placeholder="etable.name" v-model="etable.name"></CFormInput>
                <CFormLabel style="margin-right: 5px; margin-left: 5px;">Επώνυμο</CFormLabel>
                <CFormInput type="text" :placeholder="etable.surname" v-model="etable.surname"></CFormInput>
                <CFormLabel style="margin-right: 5px; margin-left: 5px;">Username</CFormLabel>
                <CFormInput type="text" :placeholder="etable.username" v-model="etable.username"></CFormInput>
                <CFormLabel style="margin-right: 5px; margin-left: 5px;">Password</CFormLabel>
                <CFormInput type="text" :placeholder="etable.password" v-model="etable.password"></CFormInput>
                <CFormLabel style="margin-right: 5px; margin-left: 5px;">Email</CFormLabel>
                <CFormInput type="text" :placeholder="etable.email" v-model="etable.email"></CFormInput>
            </CModalBody>
            <CModalFooter>
                <CButton type="submit" color="primary">Ανανέωση</CButton>
            </CModalFooter>
        </CForm>
    </CModal>
</template>

<script>
import axios from 'axios';
import * as icon from '@coreui/icons';
export default {
    data() {
        return {
            table: [],
            live: false,
            live2: false,
            edit: false,
            etable: Object,
        }
    },

    setup() {
        return {
            icon,
        }
    },

    created() {
        this.getusers()
    },

    methods: {
        getusers() {
            axios.get('/users').then(res => { this.table = res.data })
        },

        upd() {
            if (confirm('Είστε σίγουρος ότι θέλετε να γίνει Αποστολή;')) {
                axios.patch(`/users/${this.etable.id}`, {
                    name: this.etable.name,
                    surname: this.etable.surname,
                    username: this.etable.username,
                    password: this.etable.password,
                    email: this.etable.email
                }).then(this.live2 = true, this.edit= false)
            }

            setTimeout(() => {
                this.live2 = false;
            }, 3000);
        },

        deletecus(id, j) {
            if (confirm('Είστε σίγουρος ότι θέλετε να γίνει διαγραφή;')) {
                axios.delete('/users', {
                    data: { id: id }
                }).then(this.table.splice(j, 1), this.live = true).catch(err => console.log(err, id))
            }
            setTimeout(() => {
                this.live = false;
            }, 3000);
        },
    }

}
</script>