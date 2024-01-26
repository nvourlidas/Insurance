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
                <CTableHeaderCell scope="col">Ανανέωση</CTableHeaderCell>
                <CTableHeaderCell scope="col">Ενημερώθηκε</CTableHeaderCell>
                <CTableHeaderCell scope="col">Διαγραφή</CTableHeaderCell>
            </CTableRow>
        </CTableHead>
        <CTableBody>
            <CTableRow v-for="(entry, id) in paginatedData" :item="entry" :key="id" style="text-align: center;">
                <CTableDataCell :class="{ 'red': checkdate2(entry.enddate), 'yellow': checkdate(entry.enddate) }">{{ id + 1 }}</CTableDataCell>
                <CTableDataCell>{{ entry.conumber }}</CTableDataCell>
                <CTableDataCell>
                    <div v-for="(e, id2) in table2" :item="e" :key="id2">
                        <p v-if="e.cid == entry.custid">{{ e.name }} {{ e.surname }}</p>
                    </div>
                </CTableDataCell>
                <CTableDataCell>{{ entry.iname }}</CTableDataCell>
                <CTableDataCell>{{ entry.pinakida }}</CTableDataCell>
                <CTableDataCell :class="{ 'red': checkdate2(entry.enddate), 'yellow': checkdate(entry.enddate) }">{{ entry.enddate }}</CTableDataCell>
                <CTableDataCell>
                    <CButton style="color: rgb(65, 45, 165);" @click="showModal(entry.conid)">
                        <CIcon :icon="icon.cilDescription" height="32"></CIcon>
                    </CButton>
                </CTableDataCell>
                <CTableDataCell>
                    <CButton style="color: rgb(41, 177, 64);" @click="showModal2(entry.conid)">
                        <CIcon :icon="icon.cilReload" height="32"></CIcon>
                    </CButton>

                </CTableDataCell>
                <CTableDataCell>
                    <!-- <CFormSwitch v-if="entry.inform == 0" @click="inform(entry.conid,id)" id="formSwitchCheckDefault" size="xl"/>
                    <CFormSwitch v-if="entry.inform == 1" disabled id="formSwitchCheckDefault"/> -->
                    <CButton v-if="entry.inform == 0" style="color: rgb(2, 2, 2);" @click="inform(entry.conid, id)">
                        <CIcon :icon="icon.cilToggleOff" height="32"></CIcon>
                    </CButton>
                    <CButton v-if="entry.inform == 1" style="color: rgb(21, 161, 8); border: none;" disabled>
                        <CIcon :icon="icon.cilToggleOn" height="32"></CIcon>
                    </CButton>
                </CTableDataCell>
                <CTableDataCell>
                    <CButton style="color: rgb(165, 49, 45);" @click="deletecon(entry.conid, id)">
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
    <ConModal :visible="xlDemo" @close="xlDemo = false" :cus="cus" :con="con" :files="files" :mod="0" :zimies="zimies"
        :omadcus="omadcus">
    </ConModal>
    <reloadModal :visible="modal2" @close-modal="closeModalHandler" :con="con"></reloadModal>
</template>
<script>
import { CButton, CTableBody } from '@coreui/vue';
import axios from 'axios';
import { CIcon } from '@coreui/icons-vue';
import * as icon from '@coreui/icons';
import ConModal from './ConModel.vue'
import reloadModal from './reloadModal.vue'
import { addDays, format } from 'date-fns';
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
            todayDate: new Date(),
            futureDate: null,
            futureDate2: null,
            files: [],
            modal2: false,
            zimies: [],
            live: false,
            omadcus: [],
        };
    },
    created() {
        axios.get('/contracts-customer').then(res => {
            this.futureDate = addDays(this.todayDate, 31);
            this.futureDate2 = addDays(this.todayDate, 6);
            this.futureDate = format(this.futureDate, 'yyyy-MM-dd');
            this.futureDate2 = format(this.futureDate2, 'yyyy-MM-dd');
            this.todayDate = format(this.todayDate, 'yyyy-MM-dd')


            var j = 0
            for (var i = 0; i < res.data.length; i++) {
                var dateParts = res.data[i].enddate.split('-');
                var formattedDate = dateParts[2] + '-' + dateParts[1] + '-' + dateParts[0];

                var date = new Date(formattedDate);
                var dat = format(date, 'yyyy-MM-dd')
                if (dat <= this.futureDate) {
                    this.table[j] = res.data[i]
                    j++
                }

            }
            this.sunolo = this.table.length
        });
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

        checkdate(date) {
            const parts = date.split("-"); // Split the string into day, month, and year parts
            const formattedDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).toISOString().split("T")[0];

            if(formattedDate >= this.todayDate && formattedDate <= this.futureDate2){
                return true
            }else {
                return false
            }

        },

        checkdate2(date) {
            const parts = date.split("-"); // Split the string into day, month, and year parts
            const formattedDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).toISOString().split("T")[0];

            if(formattedDate <= this.todayDate){
                return true
            }else {
                return false
            }

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

        inform(id, t) {
            var i = 1
            if (confirm('Είστε σίγουρος ότι έχει γίνει ενημέρωση;')) {
                axios.patch(`/contracts/${id}`, {
                    inform: i
                }).then(this.table[t].inform = i)
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

        showModal2(id) {
            this.modal2 = true
            for (var i = 0; i < this.table.length; i++) {
                if (id == this.table[i].conid) {
                    this.con = this.table[i]
                }
            }
        },

        closeModalHandler(id) {
            this.modal2 = false;
            this.table.splice(1, id)
        },

        downloadExcel() {
            if (this.searchQuery.length === 0) {
                var data = this.table
            } else {
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
            XLSX.writeFile(wb, 'Συμβόλαια-Λήξη.xlsx');

        },

    },
    components: { CTableBody, CButton, CIcon, ConModal, reloadModal },
    setup() {
        return {
            icon,
        }
    },
}
</script>

<style scoped>
/* label {
    display: inline-block;
    background-color: none;
    color: rgb(41, 177, 64);
    padding: 0.5rem;
    font-family: sans-serif;
    border-radius: 0.3rem;
    cursor: pointer;
} */

.excel:hover {
    background-color: rgb(16, 124, 65);
    color: aliceblue;
}

.top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 2%;

}

.red {
    background-color: rgba(206, 16, 16, 0.699);
    color: rgb(255, 255, 255);
}

.yellow {
    background-color: rgba(245, 242, 32, 0.726);
}
</style>