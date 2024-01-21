<template>
    <CInputGroup class="mb-3" size="lg">
        <CInputGroupText id="inputGroup-sizing-lg" style="border: 2px solid;">Αναζήτηση</CInputGroupText>
        <CFormInput aria-label="Username" aria-describedby="inputGroup-sizing-lg" v-model="searchQuery"
            style="width: 20%; border: 2px solid;" />
    </CInputGroup>
    <div class="top">
        <CButton color="primary" variant="outline" disabled>
            <CIcon :icon="icon.cilClipboard" class="flex-shrink-0 me-2" width="24" height="24" />
            Σύνολο Συμβολαίων: <b>{{ sunolo }}</b>
        </CButton>
    </div>
    <CTable striped bordered>
        <CTableHead>
            <CTableRow style="text-align: center;">
                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                <CTableHeaderCell scope="col">Αριθμός Συμβολαίου</CTableHeaderCell>
                <CTableHeaderCell scope="col">Ονοματεπώνυμο Πελάτη</CTableHeaderCell>
                <CTableHeaderCell scope="col">Ασφαλιστική</CTableHeaderCell>
                <CTableHeaderCell scope="col">Κλάδος</CTableHeaderCell>
                <CTableHeaderCell scope="col">Χαρακτηριστικό</CTableHeaderCell>
                <CTableHeaderCell scope="col">Ημερομηνία Λήξης</CTableHeaderCell>
                <CTableHeaderCell scope="col">Λεπτομέριες</CTableHeaderCell>
                <CTableHeaderCell scope="col">Επαναφορά Συμβολαίου</CTableHeaderCell>
                <CTableHeaderCell scope="col">Οριστική Διαγραφή</CTableHeaderCell>
            </CTableRow>
        </CTableHead>
        <CTableBody>
            <CTableRow v-for="(entry, id) in paginatedData" :item="entry" :key="id" style="text-align: center;">
                <CTableDataCell>{{ id+1 }}</CTableDataCell>
                <CTableDataCell>{{ entry.conumber }}</CTableDataCell>
                <CTableDataCell>{{ entry.name }} {{ entry.surname }}</CTableDataCell>
                <CTableDataCell>{{ entry.iname }}</CTableDataCell>
                <CTableDataCell>{{ entry.bname }}</CTableDataCell>
                <CTableDataCell>{{ entry.pinakida }}</CTableDataCell>
                <CTableDataCell>{{ entry.enddate }}</CTableDataCell>
                <CTableDataCell>
                    <CButton style="color: rgb(65, 45, 165);" @click="showModal(entry.conid)">
                        <CIcon :icon="icon.cilDescription" height="32"></CIcon>
                    </CButton>
                </CTableDataCell>
                <CTableDataCell>
                    <CButton style="color: rgb(35, 172, 58);" @click="returncus(entry.cid, j)">
                        <CIcon :icon="icon.cilActionRedo" height="32"></CIcon>
                    </CButton>
                </CTableDataCell>
                <CTableDataCell>
                    <CButton style="color: rgb(165, 49, 45);" @click="deletecon(entry.conid, id)">
                        <CIcon :icon="icon.cilXCircle" height="32"></CIcon>
                    </CButton>
                </CTableDataCell>
            </CTableRow>
            <CTableRow v-if="paginatedData.length === 0" style="text-align: center;">
                <CTableDataCell colspan="10">Δεν υπάρχουν διαθέσιμα δεδομένα στον πίνακα</CTableDataCell>
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
    <ConModal :visible="xlDemo" @close="xlDemo = false" :cus="cus" :con="con" :files="files" :table2="table2" :insur="insur"
        :branch="branch" :mod="1" :zimies="zimies"></ConModal>
</template>
<script>
import { CButton, CTableBody } from '@coreui/vue';
import axios from 'axios';
import { CIcon } from '@coreui/icons-vue';
import * as icon from '@coreui/icons';
import ConModal from '../Contracts/ConModel.vue'



export default {
    data() {
        return {
            table: [],
            table2: [],
            stable: [],
            xlDemo: false,
            cus: '',
            con: '',
            currentPage: 1,
            itemsPerPage: 10,
            searchQuery: '',
            sunolo: '',
            files: [],
            file: '',
            insur: [],
            branch: [],
            zimies: [],
        };
    },
    created() {
        axios.get('/delcontracts').then(res => { this.table = res.data, this.sunolo = res.data.length });
        axios.get('/customer').then(res => { this.table2 = res.data })

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
            console.log([...this.table, ...this.table2])
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

        deletecon(id, j) {
            if (confirm('Είστε σίγουρος ότι θέλετε να γίνει διαγραφή;')) {
                axios.delete('/contracts', {
                    data: { id: id }
                }).then(this.table.splice(j, 1)).catch(err => console.log(err, id))
            }
        },
        showModal(id) {
            this.xlDemo = true;
            for (var i = 0; i < this.table.length; i++) {
                if (id == this.table[i].conid) {
                    this.con = this.table[i]
                }
            }
            for (i = 0; i < this.table2.length; i++) {
                if (this.con.custid == this.table2[i].cid) {
                    this.cus = this.table2[i]
                }
            }
            axios.get('/files').then(res => {
                var c = 0
                this.files = []
                for (var i = 0; i < res.data.length; i++) {
                    if (res.data[i].coid == id) {
                        this.files[c] = res.data[i]
                        c++
                    }
                }
                axios.get('/insurances').then(res => { this.insur = res.data })
                axios.get('/branches').then(res => { this.branch = res.data })
            })

            axios.get('/zimies').then(res => {
                var t =0
                this.zimies = []
                for(var i=0; i<res.data.length; i++){
                    if(res.data[i].contractid == id){
                        this.zimies[t] = res.data[i]
                        t++
                    }
                }
            })
        },
    },
    components: { CTableBody, CButton, CIcon, ConModal },
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

}</style>