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
    <CusModal :visible="xlDemo" @close="xlDemo = false" :cus="cus" :con="con" :files="files"></CusModal>
</template>

<script>
import { CButton, CTableBody } from '@coreui/vue';
import axios from 'axios';
import { CIcon } from '@coreui/icons-vue';
import * as icon from '@coreui/icons';
import CusModal from './CusModel.vue'


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
                }).catch(err => console.log(err, id))
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
            var c=0
            this.files = []
            for (var i=0; i<res.data.length; i++){
                if(res.data[i].cuid == id){
                    this.files[c] = res.data[i]
                    c++
                }
            }
        })
        },

        //     handleFileChange(event) {
        //   this.file = event.target.files[0];
        //     },

        changeid(cuid){
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
        }



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