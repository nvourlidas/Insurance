<template>
    <CInputGroup class="mb-3" size="lg">
        <CInputGroupText id="inputGroup-sizing-lg" style="border: 2px solid;">Αναζήτηση</CInputGroupText>
        <CFormInput aria-label="Username" aria-describedby="inputGroup-sizing-lg" v-model="searchQuery"
            style="width: 20%; border: 2px solid;" />
    </CInputGroup>
    <div class="top">
        <div>
        <CButton color="primary" variant="outline" disabled style="margin-right: 20px; padding: 10px;">
            <CIcon :icon="icon.cilClipboard" class="flex-shrink-0 me-2" width="24" height="24" />
            Σύνολο Συμβολαίων: <b>{{ sunolo }}</b>
        </CButton>
        <CButton @click="downloadExcel" class="excel" style="border: 1px solid; padding: 7px 20px;">
            <CIcon :icon="icon.cilAlignLeft" size="xl" style="margin-right: 7px;"></CIcon> Excel
        </CButton>
    </div>
        <CButton color="info" variant="ghost" @click="this.$router.push('/AddContract')" style=" height: 55px;"><b>
                <CIcon :icon="icon.cilClipboard" size="xl"></CIcon> Νέο Συμβόλαιο
            </b> </CButton>
    </div>
    <CAlert color="warning" :visible="live">Επιτυχής Διαγραφή Συμβολαίου</CAlert>
    
    <CFormSelect size="lg" class="mb-3" v-model="asfalid" v-on:change="getTable">
        <option>Επιλογή Κλάδου Ασφάλησης</option>
        <option v-for="entry in asfal" :key="entry.bid" :value="entry.bid"> {{ entry.bname }}</option>
    </CFormSelect>
    <CTable striped bordered>
        <CTableHead>
            <CTableRow style="text-align: center;">
                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                <CTableHeaderCell scope="col">Αριθμός Συμβολαίου</CTableHeaderCell>
                <CTableHeaderCell scope="col">Ονοματεπώνυμο Πελάτη</CTableHeaderCell>
                <CTableHeaderCell scope="col">Ασφαλιστική</CTableHeaderCell>
                <CTableHeaderCell scope="col">Χαρακτηριστικό</CTableHeaderCell>
                <CTableHeaderCell scope="col">Ημερομηνία Λήξης</CTableHeaderCell>
                <CTableHeaderCell scope="col">Λεπτομέριες</CTableHeaderCell>
                <CTableHeaderCell scope="col">Εισαγωγή Αρχείου</CTableHeaderCell>
                <CTableHeaderCell scope="col">Διαγραφή</CTableHeaderCell>
            </CTableRow>
        </CTableHead>
        <CTableBody>
            <CTableRow v-for="(entry, id) in paginatedData" :item="entry" :key="id" style="text-align: center;">
                <CTableDataCell>{{ id+1 }}</CTableDataCell>
                <CTableDataCell>{{ entry.conumber }}</CTableDataCell>
                <CTableDataCell>
                    <div v-for="(e, id2) in table2" :item="e" :key="id2">
                        <p v-if="e.cid == entry.custid">{{ e.name }} {{ e.surname }}</p>
                    </div>
                </CTableDataCell>
                <CTableDataCell>{{ entry.iname }}</CTableDataCell>
                <CTableDataCell>{{ entry.pinakida }}</CTableDataCell>
                <CTableDataCell>{{ entry.enddate }}</CTableDataCell>
                <CTableDataCell>
                    <CButton style="color: rgb(65, 45, 165);" @click="showModal(entry.conid)">
                        <CIcon :icon="icon.cilDescription" height="32"></CIcon>
                    </CButton>
                </CTableDataCell>
                <CTableDataCell>
                    <input type="file" id="upload" hidden />
                    <label for="upload">
                        <CIcon :icon="icon.cilCloudUpload" height="32"></CIcon>
                    </label>
                </CTableDataCell>
                <CTableDataCell>
                    <CButton style="color: rgb(165, 49, 45);" @click="deletecon(entry.conid, id)">
                        <CIcon :icon="icon.cilXCircle" height="32"></CIcon>
                    </CButton>
                </CTableDataCell>
            </CTableRow>
            <CTableRow v-if="table.length === 0" style="text-align: center;">
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
    <ConModal :visible="xlDemo" @close="xlDemo = false" :cus="cus" :con="con" :files="files" :zimies="zimies"
        :omadcus="omadcus"></ConModal>
</template>
<script>
import { CButton, CTableBody } from '@coreui/vue';
import axios from 'axios';
import { CIcon } from '@coreui/icons-vue';
import * as icon from '@coreui/icons';
import ConModal from './ConModel.vue'
import * as XLSX from 'xlsx';

export default {
    data() {
        return {
            table: [],
            table2: [],
            stable: [],
            asfal: [],
            asfalid: '',
            xlDemo: false,
            cus: '',
            con: '',
            currentPage: 1,
            itemsPerPage: 10,
            searchQuery: '',
            sunolo: 0,
            files: [],
            zimies: [],
            live: false,
            omadcus: [],
        };
    },
    created() {
        this.getTable
        axios.get('/customer').then(res => { this.table2 = res.data })
        axios.get('/branches')
            .then(res => {
                this.asfal = res.data
            })

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

        getTable: function () {
            axios.get('/contracts-customer').then(res => {
                var j = 0
                this.table = []
                for (var i = 0; i < res.data.length; i++) {
                    if (res.data[i].bid == this.asfalid) {
                        this.table[j] = res.data[i]
                        j++
                    }
                }
                this.sunolo = this.table.length
            })
        },

        deletecon(id, j) {
            if (confirm('Είστε σίγουρος ότι θέλετε να γίνει διαγραφή;')) {
                axios.delete('/contracts', {
                    data: { id: id }
                }).then(this.table.splice(j, 1), this.live = true).catch(err => console.log(err, id))
            }
            setTimeout(() => {
                this.live = false;
            }, 3000);
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
            })

            axios.get('/zimies').then(res => {
                var t = 0
                this.zimies = []
                for (var i = 0; i < res.data.length; i++) {
                    if (res.data[i].contractid == id) {
                        this.zimies[t] = res.data[i]
                        t++
                    }
                }
            })

            axios.get(`/omadika/${id}`).then(res => {
                this.omadcus = res.data
            })
        },

        downloadExcel() {
            const data = this.paginatedData;

            
            const columnsToExport = [
                { header: 'Αριθμός Συμβολαίου', key: 'conumber' },
                { header: 'Όνομα Πελάτη', key: 'name' },
                { header: 'Επίθετο Πελάτη', key: 'surname' },
                { header: 'Ασφαλιστική', key: 'iname' },
                { header: 'Κλάδος', key: 'bname' },
                { header: 'Χαρακτηριστικό', key: 'pinakida' },
                { header: 'Ημερομηνία Εναρξης', key: 'startdate' },
                { header: 'Ημερομηνία Λήξης', key: 'enddate' },
                { header: 'Καθαρά', key: 'clear' },
                { header: 'Μεικτά', key: 'mikta' },
                { header: 'Προμήθεια', key: 'promithia' },
            ];

            // Extract only the selected columns from the data
            const filteredData = data.map(item => {
                const filteredItem = {};
                columnsToExport.forEach(column => {
                    filteredItem[column.header] = item[column.key];
                });
                return filteredItem;
            });

            // Create a worksheet with custom columns and headers
            const ws = XLSX.utils.json_to_sheet(filteredData, { header: columnsToExport.map(column => column.header) });

            // Create a new workbook and append the worksheet
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

            // Save the workbook as an Excel file
            XLSX.writeFile(wb, 'Συμβόλαια.xlsx');

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

.excel:hover{
    background-color: rgb(16,124,65);
    color: aliceblue;
}

.top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 2%;

}</style>