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
            Σύνολο Ζημιων: <b>{{ sunolo }}</b>
        </CButton>
        <CButton @click="downloadExcel" class="excel" style="border: 1px solid; padding: 7px 20px;">
            <CIcon :icon="icon.cilAlignLeft" size="xl" style="margin-right: 7px;"></CIcon>Excel
        </CButton>
    </div>
        <CButton color="success" variant="ghost" @click="this.$router.push('/AddZimia')" style=" height: 55px;"><b>
                <CIcon :icon="icon.cilDollar" size="xl"></CIcon> Νέα Ζημία
            </b> </CButton>
    </div>
    <CAlert color="warning" :visible="live">Επιτυχής Διαγραφή Ζημίας</CAlert>
    <CTable striped bordered>
        <CTableHead>
            <CTableRow style="text-align: center;">
                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                <CTableHeaderCell scope="col">Αριθμός Ζημίας</CTableHeaderCell>
                <CTableHeaderCell scope="col">Ονοματεπώνυμο Πελάτη</CTableHeaderCell>
                <CTableHeaderCell scope="col">Αριθμός Συμβολαίου</CTableHeaderCell>
                <CTableHeaderCell scope="col">Ασφαλιστική</CTableHeaderCell>
                <CTableHeaderCell scope="col">Λεπτομέριες</CTableHeaderCell>
                <CTableHeaderCell scope="col">Κατάσταση</CTableHeaderCell>
                <CTableHeaderCell scope="col">Εισαγωγή Αρχείου</CTableHeaderCell>
                <CTableHeaderCell scope="col">Διαγραφή</CTableHeaderCell>
            </CTableRow>
        </CTableHead>
        <CTableBody>
            <CTableRow v-for="(entry, id) in paginatedData" :item="entry" :key="id" style="text-align: center;">
                <CTableDataCell>{{ id+1 }}</CTableDataCell>
                <CTableDataCell>{{ entry.znumber }}</CTableDataCell>
                <CTableDataCell>{{ entry.name }} {{ entry.surname }}</CTableDataCell>
                <CTableDataCell>{{ entry.conumber }}</CTableDataCell>
                <CTableDataCell>{{ entry.iname }}</CTableDataCell>
                <CTableDataCell>
                    <CButton style="color: rgb(65, 45, 165);" @click="showModal(entry.zid)">
                        <CIcon :icon="icon.cilDescription" height="32"></CIcon>
                    </CButton>
                </CTableDataCell>
                <CTableDataCell><CButton v-if="entry.status == 1" style="color: rgb(2, 2, 2);" @click="status(entry.zid,id)">
                        <CIcon :icon="icon.cilToggleOff" height="32"></CIcon>
                    </CButton>
                    <CButton v-if="entry.status == 2" style="color: rgb(21, 161, 8); border: none;" disabled>
                        <CIcon :icon="icon.cilToggleOn" height="32"></CIcon>
                    </CButton>
                </CTableDataCell>
                <CTableDataCell>
                    <input type="file" id="upload" hidden @change="upload">
                    <label for="upload">
                        <CIcon :icon="icon.cilCloudUpload" height="32" @click="changeid(entry.zid)"></CIcon>
                    </label>
                </CTableDataCell>
                <CTableDataCell>
                    <CButton style="color: rgb(165, 49, 45);" @click="deletezim(entry.zid, id)">
                        <CIcon :icon="icon.cilXCircle" height="32"></CIcon>
                    </CButton>
                </CTableDataCell>
            </CTableRow>
            <CTableRow v-if="paginatedData.length === 0" style="text-align: center;">
                <CTableDataCell colspan="10">Δεν υπάρχουν διαθέσιμα δεδομένα στον πίνακα</CTableDataCell>
            </CTableRow>
        </CTableBody>
    </CTable>
    <CRow>
        <CCol md style="display: flex;">
            <CFormLabel style="font-size: 15px;">Εγγραφές Ανά Σελίδα</CFormLabel>
            <CFormSelect size="sm" class="mb-2" style="width: 10%; height: 40px;" v-model="itemsPerPage">
                <option value="20">20</option>
                <option value="10">10</option>
                <option value="30">30</option>
                <option value="40">40</option>
                <option value="50">50</option>
            </CFormSelect>
        </CCol>
        <CCol md>
            <CPagination size="lg" align="center" aria-label="Page navigation example">
                <CPaginationItem @click="prevPage" :disabled="currentPage === 1" style="cursor: pointer;">&laquo;
                    Προηγούμενη
                </CPaginationItem>
                <CPaginationItem style="cursor: pointer;" v-for="pageNumber in totalPages" :key="pageNumber"
                    :class="{ active: pageNumber === currentPage }" @click="changePage(pageNumber)">{{ pageNumber }}
                </CPaginationItem>
                <CPaginationItem style="cursor: pointer;" @click="nextPage" :disabled="currentPage === totalPages">Επόμενη
                    &raquo;
                </CPaginationItem>
            </CPagination>
        </CCol>
    </CRow>
    <zimModal :visible="xlDemo" @close="xlDemo = false" :zim="zim"  :files="files"></zimModal>
</template>

<script>
import { CButton, CTableBody } from '@coreui/vue';
import axios from 'axios';
import { CIcon } from '@coreui/icons-vue';
import * as icon from '@coreui/icons';
import * as XLSX from 'xlsx';
import zimModal from './zimModal.vue'


export default {
    data() {
        return {
            table: [],
            xlDemo: false,
            zim: '',
            files: [],
            currentPage: 1,
            itemsPerPage: 20,
            searchQuery: '',
            sunolo: '',
            file: null,
            id: '',
            live: false,
        };
    },
    created() {
        axios.get('/zimies').then(res => { this.table = res.data.filter(obj => obj.znumber != '-'), this.sunolo = this.table.length});
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

        deletezim(id, j) {
            if (confirm('Είστε σίγουρος ότι θέλετε να γίνει διαγραφή;')) {
                axios.delete(`/zimies/${id}`).then(this.table.splice(j,1), this.live = true).catch(err => console.log(err, id))
            }
        },
        showModal(id) {
            this.xlDemo = true;
            for (var i = 0; i < this.table.length; i++) {
                if (id == this.table[i].zid) {
                    this.zim = this.table[i]
                }
            }
           console.log(this.zim)

            axios.get('/files').then(res => {
                var c = 0
                this.files = []
                for (var i = 0; i < res.data.length; i++) {
                    if (res.data[i].zimid == id) {
                        this.files[c] = res.data[i]
                        c++
                    }
                }
            })
        },

        status(id,t) {
            var i =2
            if (confirm('Είστε σίγουρος ότι έχει γίνει ενημέρωση;')) {
                axios.patch(`/zimies/${id}`, {
                   status: i
                }).then(this.table[t].status = i)
            }
        },

        //     handleFileChange(event) {
        //   this.file = event.target.files[0];
        //     },

        changeid(cuid) {
            this.id = cuid

        },

        upload(event) {
            this.file = event.target.files[0];
            const formData = new FormData();
            const blob = new Blob([this.file], { type: 'application/octet-stream;charset=utf-8' });
            formData.append('file', blob, this.file.name);
            formData.append('filename', this.file.name);
            formData.append('cuid', 0);
            formData.append('coid', 0);
            formData.append('zimid', this.id);

            axios.post('/upload', formData)
                .then(response => {
                    console.log(response.data, formData);
                })
                .catch(error => {
                    console.error(error);
                });
        },

        downloadExcel() {
            if (this.searchQuery.length === 0){
                var data = this.table
            }else{
                 data = this.paginatedData;
            }

            
            const columnsToExport = [
                { header: 'Όνομα', key: 'name' },
                { header: 'Επίθετο', key: 'surname' },
                { header: 'Αριθμός Ζημίας', key: 'znumber' },
                { header: 'Αριθμός Συμβολαίου', key: 'conumber' },
                { header: 'Ασφαλιστική', key: 'iname' },
                { header: 'Ποσό', key: 'poso' },
                { header: 'Ημερομηνία Καταχώρησης', key: 'inputdate' },
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
            XLSX.writeFile(wb, 'Ζημίες.xlsx');
        },
    },

    components: { CTableBody, CButton, CIcon, zimModal },
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

}
</style>