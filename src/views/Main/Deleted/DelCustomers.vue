<template>
    <CInputGroup class="mb-3" size="lg">
        <CInputGroupText id="inputGroup-sizing-lg" style="border: 2px solid;">Αναζήτηση</CInputGroupText>
        <CFormInput aria-label="Username" aria-describedby="inputGroup-sizing-lg" v-model="searchQuery"
            style="width: 20%; border: 2px solid;" />
    </CInputGroup>
    <div class="top">
        <CButton color="primary" variant="outline" disabled>
            <CIcon :icon="icon.cilUser" class="flex-shrink-0 me-2" width="24" height="24" />
            Σύνολο Πελατών: <b>{{ sunolo }}</b>
        </CButton>
    </div>
    <CAlert color="success" :visible="live">Επιτυχής Επαναφορά Πελάτη</CAlert>
    <CAlert color="danger" :visible="live2">Επιτυχής Ολική Διαγραφή Πελάτη</CAlert>
    <CTable striped bordered>
        <CTableHead>
            <CTableRow style="text-align: center;">
                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                <CTableHeaderCell scope="col">Ονοματεπώνυμο</CTableHeaderCell>
                <CTableHeaderCell scope="col">ΑΦΜ</CTableHeaderCell>
                <CTableHeaderCell scope="col">Κινητό</CTableHeaderCell>
                <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                <CTableHeaderCell scope="col">Λεπτομέριες</CTableHeaderCell>
                <CTableHeaderCell scope="col">Επαναφορά Πελάτη</CTableHeaderCell>
                <CTableHeaderCell scope="col">Οριστική Διαγραφή</CTableHeaderCell>
            </CTableRow>
        </CTableHead>
        <CTableBody>
            <CTableRow v-for="(entry, id) in paginatedData" :item="entry" :key="id" style="text-align: center;">
                <CTableDataCell>{{ id+1 }}</CTableDataCell>
                <CTableDataCell>{{ entry.name }} {{ entry.surname }}</CTableDataCell>
                <CTableDataCell>{{ entry.afm }}</CTableDataCell>
                <CTableDataCell>{{ entry.cellphone }}</CTableDataCell>
                <CTableDataCell>{{ entry.email }}</CTableDataCell>
                <CTableDataCell>
                    <CButton style="color: rgb(65, 45, 165);" @click="showModal(entry.cid)">
                        <CIcon :icon="icon.cilAddressBook" height="32"></CIcon>
                    </CButton>
                </CTableDataCell>
                <CTableDataCell>
                    <CButton style="color: rgb(35, 172, 58);" @click="returncus(entry.cid, j)">
                        <CIcon :icon="icon.cilActionRedo" height="32"></CIcon>
                    </CButton>
                </CTableDataCell>
                <CTableDataCell>
                    <CButton style="color: rgb(165, 49, 45);" @click="deletecus(entry.cid, j)">
                        <CIcon :icon="icon.cilXCircle" height="32"></CIcon>
                    </CButton>
                </CTableDataCell>
            </CTableRow>
            <CTableRow v-if="paginatedData.length === 0" style="text-align: center;">
                <CTableDataCell colspan="8">Δεν υπάρχουν διαθέσιμα δεδομένα στον πίνακα</CTableDataCell>
            </CTableRow>
        </CTableBody>
    </CTable>
    <CPagination size="lg" align="center" aria-label="Page navigation example">
        <CPaginationItem @click="prevPage" :disabled="currentPage === 1" style="cursor: pointer;">&laquo; Προηγούμενη
        </CPaginationItem>
        <CPaginationItem style="cursor: pointer;" v-for="pageNumber in totalPages" :key="pageNumber"
            :class="{ active: pageNumber === currentPage }" @click="changePage(pageNumber)">{{ pageNumber }}
        </CPaginationItem>
        <CPaginationItem style="cursor: pointer;" @click="nextPage" :disabled="currentPage === totalPages">Επόμενη &raquo;
        </CPaginationItem>
    </CPagination>
    <CusModal :visible="xlDemo" @close="xlDemo = false" :cus="cus" :con="con" :files="files" :zimies="zimies"></CusModal>
</template>

<script>
import { CButton, CTableBody } from '@coreui/vue';
import axios from 'axios';
import { CIcon } from '@coreui/icons-vue';
import * as icon from '@coreui/icons';
import CusModal from '../Customers/CusModel.vue'

export default {
    data() {
        return {
            table: [],
            xlDemo: false,
            cus: '',
            con: [],
            files: [],
            currentPage: 1,
            itemsPerPage: 10,
            searchQuery: '',
            sunolo: '',
            file: null,
            id: '',
            zimies: [],
            live: false,
            live2: false,
        }
    },

    created() {
        axios.get('/deleted_customer').then(res => { this.table = res.data, this.sunolo = res.data.length });
    },

    computed: {
        totalPages() {
            return Math.ceil(this.table.length / this.itemsPerPage);
        },
        paginatedData() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            if (this.searchQuery.length === 0) {
                return this.table.slice(start, end);
            } else {
                return this.table.filter(item =>
                    Object.values(item)
                        .join(' ')
                        .toLowerCase()
                        .includes(this.searchQuery.toLowerCase())
                );
            }
        },
    },

    methods: {
        changePage(pageNumber) {
            this.currentPage = pageNumber;
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        },

        deletecus(id, j) {
            if (confirm('Είστε σίγουρος ότι θέλετε να γίνει οριστική διαγραφή;')) {
                axios.delete(`/perma-delete/${id}`).then(this.table.splice(j,1), this.live2 = true).catch(err => console.log(err, id))
            }

            setTimeout(() => {
                this.live2 = false;
            }, 3000);
        },
        showModal(id) {
            this.xlDemo = true;
            for (var i = 0; i < this.table.length; i++) {
                if (id == this.table[i].cid) {
                    this.cus = this.table[i]
                }
            }
            axios.get('/contracts-insurance').then(res => {
                var j = 0;
                this.con = []
                for (var i = 0; i < res.data.length; i++) {
                    if (res.data[i].custid == id) {
                        this.con[j] = res.data[i]
                        j++
                    }
                }
            })

            axios.get('/files').then(res => {
                var c = 0
                this.files = []
                for (var i = 0; i < res.data.length; i++) {
                    if (res.data[i].cuid == id) {
                        this.files[c] = res.data[i]
                        c++
                    }
                }
            })

            axios.get('/zimies').then(res => {
                var t =0
                this.zimies = []
                for(var i=0; i<res.data.length; i++){
                    if(res.data[i].customerid == id){
                        this.zimies[t] = res.data[i]
                        t++
                    }
                }
            })
        },

        returncus(cuid, j) {
            if (confirm('Είστε σίγουρος ότι θέλετε να γίνει Επαναφορά;')) {
                axios.delete('/deletedcustomer', {
                    data: { id: cuid }
                }).then(this.table.splice(j,1),this.live = true ).catch(err => console.log(err, cuid))
            }
            setTimeout(() => {
                this.live = false;
            }, 3000);

        },

    },

    components: { CTableBody, CButton, CIcon, CusModal },
    setup() {
        return {
            icon,
        }
    },
}

</script>

<style scoped>
label {
    display: inline-block;
    background-color: none;
    color: black;
    padding: 0.5rem;
    font-family: sans-serif;
    border-radius: 0.3rem;
    cursor: pointer;
}

.top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 2%;

}
</style>