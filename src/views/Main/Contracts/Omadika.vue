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
            <CIcon :icon="icon.cilAlignLeft" size="xl" style="margin-right: 7px;"></CIcon>Excel
        </CButton>
    </div>
        <CButton color="info" variant="ghost" @click="this.$router.push('/AddContract')" style=" height: 55px;"><b>
                <CIcon :icon="icon.cilClipboard" size="xl"></CIcon> Νέο Συμβόλαιο
            </b> </CButton>
    </div>
    <CAlert color="warning" :visible="live">Επιτυχής Διαγραφή Συμβολαίου</CAlert>
    <CAlert color="success" :visible="live2">Επιτυχής Εισαγωγή Αρχείου</CAlert>
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
                <CTableHeaderCell scope="col">Εισαγωγή Αρχείου</CTableHeaderCell>
                <CTableHeaderCell scope="col">Διαγραφή</CTableHeaderCell>
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
                    <input type="file" id="upload" hidden @change="upload">
                    <label for="upload">
                        <CIcon :icon="icon.cilCloudUpload" height="32" @click="changeid(entry.conid)"></CIcon>
                    </label>
                </CTableDataCell>
                <CTableDataCell>
                    <CButton style="color: rgb(165, 49, 45);" @click="deletecon(entry.conid)">
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
    <ConModal :visible="xlDemo" @close="xlDemo = false" :cus="cus" :con="con" :files="files" :table2="table2" :insur="insur"
        :branch="branch" :mod="1" :zimies="zimies" :omadcus="omadcus"></ConModal>
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
            xlDemo: false,
            cus: '',
            con: '',
            currentPage: 1,
            itemsPerPage: 20,
            searchQuery: '',
            sunolo: '',
            files: [],
            file: '',
            insur: [],
            branch: [],
            zimies: [],
            live: false,
            live2: false,
            omadcus: [],
            
        };
    },
    created() {
        axios.get('/contracts-customer').then(res => { this.table = res.data.filter(item => item.omadiko === 1)
             this.sunolo = this.table.length 
            });
        axios.get('/customer').then(res => { this.table2 = res.data })
        
            
        
        

    },



    computed: {
        sortedArray() {
            return this.table.slice().sort((a, b) => {
                const dateA = this.parseDate(a.enddate);
                const dateB = this.parseDate(b.enddate);
                return dateA - dateB;
            });
        },
        totalPages() {
            return Math.ceil(this.sortedArray.length / this.itemsPerPage);
        },
        paginatedData() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            if (this.searchQuery.length === 0) {
                return this.sortedArray.slice(start, end);
            } else {
                return this.sortedArray.filter(item =>
                    Object.values(item)
                        .join(' ')
                        .toLowerCase()
                        .includes(this.searchQuery.toLowerCase())
                );
            }
        },
    },

    methods: {
        parseDate(dateString) {
            const [day, month, year] = dateString.split('-');
            return new Date(`${year}-${month}-${day}`);
        },
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

        deletecon(id) {
            if (confirm('Είστε σίγουρος ότι θέλετε να γίνει διαγραφή;')) {
                axios.delete('/contracts', {
                    data: { id: id }
                }).then(this.live = true).catch(err => console.log(err, id))
                const indexToRemove = this.table.findIndex(item => item.conid === id)
                    this.table.splice(indexToRemove, 1)
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

            axios.get(`/omadika/${id}`).then(res => {
                this.omadcus = res.data
            })
        },

        changeid(coid) {
            this.id = coid
        },

        upload(event) {
            this.file = event.target.files[0];
            const formData = new FormData();
            const blob = new Blob([this.file], { type: 'application/octet-stream;charset=utf-8' });
            formData.append('file', blob, this.file.name);
            formData.append('filename', this.file.name);
            formData.append('cuid', 0);
            formData.append('coid', this.id);
            formData.append('zimid', 0);

            axios.post('/upload', formData)
                .then(response => {
                    console.log(response.data, formData);
                    this.live2 = true
                })
                .catch(error => {
                    console.error(error);
                });
                setTimeout(() => {
                this.live2 = false;
            }, 3000);
        },

        downloadExcel() {
            if (this.searchQuery.length === 0){
                var data = this.table
            }else{
                 data = this.paginatedData;
            }

            
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

.red {
    background-color: rgba(206, 16, 16, 0.699);
    color: rgb(255, 255, 255);
}

.yellow {
    background-color: rgba(245, 242, 32, 0.726);
}

.top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 2%;

}</style>