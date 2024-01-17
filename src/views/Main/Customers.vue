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
        <CButton @click="downloadExcel" style="border: 1px solid; margin-right: -20%;">
            <CIcon :icon="icon.cilList" size="xl"></CIcon> Excel
        </CButton>
        <CButton @click="downloadPDF" style="border: 1px solid; margin-left: -5%;">
            <CIcon :icon="icon.cibAdobeAcrobatReader" size="xl"></CIcon> PDF
        </CButton>
        <CButton color="success" variant="ghost" @click="this.$router.push('/AddCustomer')" style=" height: 55px;"><b>
                <CIcon :icon="icon.cilUserPlus" size="xl"></CIcon> Νέος Πελάτης
            </b> </CButton>
    </div>
    <CTable striped bordered>
        <CTableHead>
            <CTableRow style="text-align: center;">
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
                    <CButton style="color: rgb(165, 49, 45);" @click="deletecus(entry.cid)">
                        <CIcon :icon="icon.cilXCircle" height="32"></CIcon>
                    </CButton>
                </CTableDataCell>
            </CTableRow>
            <CTableRow v-if="paginatedData.length === 0" style="text-align: center;">
                <CTableDataCell colspan="7">Δεν υπάρχουν διαθέσιμα δεδομένα στον πίνακα</CTableDataCell>
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
import CusModal from './CusModel.vue'
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


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

        deletecus(id) {
            if (confirm('Είστε σίγουρος ότι θέλετε να γίνει διαγραφή;')) {
                axios.delete('/customer', {
                    data: { id: id }
                }).then(this.table.splice(1,id)).catch(err => console.log(err, id))
            }
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
                })
                .catch(error => {
                    console.error(error);
                });
        },

        downloadExcel() {
            const data = this.table;

            
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

        downloadPDF() {
            const pdf = new jsPDF();
            pdf.setFont('times', 'normal');
            const columns = ['Όνομα', 'Επίθετο', 'Email', 'Κινητό', 'Σταθερό', 'Τ.Κ.', 'Ημερομηνία Γέννησης', 'ΑΦΜ'];
            const data = this.table.map(obj => [obj.name, obj.surname, obj.email, obj.cellphone, obj.phone, obj.postcode, obj.birthday, obj.afm]);

            pdf.autoTable({
                head: [columns],
                body: data,
            });
            pdf.save('Πελάτες.pdf');
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