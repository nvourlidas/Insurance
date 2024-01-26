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
            Σύνολο Πελατών: <b>{{ sunolo }}</b>
        </CButton>
        <CButton @click="downloadExcel" class="excel" style="border: 1px solid; padding: 7px 20px;">
            <CIcon :icon="icon.cilAlignLeft" size="xl" style="margin-right: 7px;"></CIcon>Excel
        </CButton>
    </div>
        <CButton color="success" variant="ghost" @click="this.$router.push('/AddCustomer')" style=" height: 55px;"><b>
                <CIcon :icon="icon.cilUserPlus" size="xl"></CIcon> Νέος Πελάτης
            </b> </CButton>
    </div>
    <CAlert color="warning" :visible="live">Επιτυχής Διαγραφή Πελάτη</CAlert>
    <CAlert color="success" :visible="live2">Επιτυχής Εισαγωγή Αρχείου</CAlert>
    <CTable striped bordered>
        <CTableHead>
            <CTableRow style="text-align: center;">
                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                <CTableHeaderCell scope="col">Ονοματεπώνυμο</CTableHeaderCell>
                <CTableHeaderCell scope="col">ΑΦΜ</CTableHeaderCell>
                <CTableHeaderCell scope="col">Κινητό</CTableHeaderCell>
                <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                <CTableHeaderCell scope="col">Λεπτομέριες</CTableHeaderCell>
                <CTableHeaderCell scope="col">Εισαγωγή Αρχείου</CTableHeaderCell>
                <CTableHeaderCell scope="col">Διαγραφή</CTableHeaderCell>
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
                    <input type="file" id="upload" hidden @change="upload">
                    <label for="upload">
                        <CIcon :icon="icon.cilCloudUpload" height="32" @click="changeid(entry.cid)"></CIcon>
                    </label>
                </CTableDataCell>
                <CTableDataCell>
                    <CButton style="color: rgb(165, 49, 45);" @click="deletecus(entry.cid,id)">
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
    <CusModal :visible="xlDemo" @close="xlDemo = false" :cus="cus" :con="con" :files="files" :zimies="zimies" :omad="omad"></CusModal>
</template>

<script>
import { CButton, CTableBody } from '@coreui/vue';
import axios from 'axios';
import { CIcon } from '@coreui/icons-vue';
import * as icon from '@coreui/icons';
import CusModal from './CusModel.vue'
import * as XLSX from 'xlsx';



export default {
    data() {
        return {
            table: [],
            xlDemo: false,
            cus: '',
            con: [],
            files: [],
            currentPage: 1,
            itemsPerPage: 20,
            searchQuery: '',
            sunolo: '',
            file: null,
            id: '',
            zimies: [],
            live: false,
            live2: false,
            omad: [],
        };
    },
    created() {
        axios.get('/customer').then(res => { this.table = res.data, this.sunolo = res.data.length });
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
            if (confirm('Είστε σίγουρος ότι θέλετε να γίνει διαγραφή;')) {
                axios.delete('/customer', {
                    data: { id: id }
                }).then(this.table.splice(j,1),this.live = true).catch(err => console.log(err, id))
            }
            setTimeout(() => {
                this.live = false;
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

            axios.get(`/omadika`).then(res => {
                var k=0
                this.omad =[]
                for(var i=0; i<res.data.length; i++){
                    if(res.data[i].cuid == id){
                        this.omad[k] = res.data[i]
                        k++
                    }
                }
                
            })
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
            formData.append('cuid', this.id);
            formData.append('coid', 0);
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
                { header: 'Όνομα', key: 'name' },
                { header: 'Επίθετο', key: 'surname' },
                { header: 'ΑΦΜ', key: 'afm' },
                { header: 'Email', key: 'email' },
                { header: 'Kινητό', key: 'cellphone' },
                { header: 'Σταθερό', key: 'phone' },
                { header: 'T.K.', key: 'postcode' },
                { header: 'Ημερομηνία Γέννησης', key: 'birthday' },
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
            XLSX.writeFile(wb, 'Πελάτες.xlsx');
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