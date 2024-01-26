<template>
    <CInputGroup class="mb-3" size="lg">
        <CInputGroupText id="inputGroup-sizing-lg" style="border: 2px solid;">Αναζήτηση</CInputGroupText>
        <CFormInput aria-label="Username" aria-describedby="inputGroup-sizing-lg" v-model="searchQuery"
            style="width: 20%; border: 2px solid;" />
    </CInputGroup>
    <div class="uplaod"> 
        <input type="file" id="upload" hidden @change="Add" style="cursor: pointer;">
        <label for="upload"><b style="cursor: pointer;">
            <CIcon :icon="icon.cilCloudUpload" height="32"></CIcon> Εισαγωγή Αρχείου</b>
        </label>
    </div>
    <CAlert color="success" :visible="live2">Επιτυχής Εισαγωγή Αρχείου</CAlert>
    <CAlert color="warning" :visible="live">Επιτυχής Διαγραφή Αρχείου</CAlert>
    <CTable striped bordered>
        <CTableHead>
            <CTableRow style="text-align: center;">
                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                <CTableHeaderCell scope="col">Όνομα Αρχείου</CTableHeaderCell>
                <CTableHeaderCell scope="col">Άνοιγμα Αρχείου</CTableHeaderCell>
                <CTableHeaderCell scope="col">Διαγραφή</CTableHeaderCell>
            </CTableRow>
        </CTableHead>
        <CTableBody>
            <CTableRow v-for="(entry, id) in paginatedData" :item="entry" :key="id" style="text-align: center;">
                <CTableDataCell>{{ id + 1 }}</CTableDataCell>
                <CTableDataCell>{{ entry.filename }}</CTableDataCell>
                <CTableDataCell>
                    <CButton style="color: rgb(17, 16, 16);" @click="download(entry.id, entry.filename)">
                        <CIcon :icon="icon.cilCloudDownload" height="32"></CIcon>
                    </CButton>
                </CTableDataCell>
                <CTableDataCell>
                    <CButton style="color: rgb(165, 49, 45);" @click="deletefile(entry.id, id)">
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
</template>

<script>
import axios from 'axios'
import * as icon from '@coreui/icons';

export default {
    data() {
        return {
            table: [],
            live: false,
            live2: false,
            currentPage: 1,
            itemsPerPage: 20,
            searchQuery: '',
        }
    },

    setup() {
        return {
            icon,
        }
    },

    created() {
        this.getfiles()
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

        getfiles() {
            axios.get('/files').then(res => {
                var j = 0
                for (var i = 0; i < res.data.length; i++) {
                    if (res.data[i].cuid === 0 && res.data[i].coid === 0 && res.data[i].zimid === 0) {
                        this.table[j] = res.data[i]
                        j++

                    }
                }
            })
        },

        changeid(cuid) {
            this.id = cuid

        },

        Add(event) {
            this.file = event.target.files[0];
            const formData = new FormData();
            const blob = new Blob([this.file], { type: 'application/octet-stream;charset=utf-8' });
            formData.append('file', blob, this.file.name);
            formData.append('filename', this.file.name);
            formData.append('cuid', 0);
            formData.append('coid', 0);
            formData.append('zimid', 0);

            axios.post('/upload', formData)
                .then(response => {
                    console.log(response.data, formData);
                    this.live2 = true
                    this.table.push({
                        filename: this.file.name
                    })
                })
                .catch(error => {
                    console.error(error);
                });
            setTimeout(() => {
                this.live2 = false;
            }, 3000);
        },

        deletefile(id, j) {
            if (confirm('Είστε σίγουρος ότι θέλετε να γίνει διαγραφή;')) {
                axios.delete(`/files/${id}`).then(this.live = true, this.table.splice(j, 1)).catch(err => console.log(err, id))
            }

            setTimeout(() => {
                this.live = false;
            }, 3000);
        },

        download(id, name) {
            axios.get(`/download/${id}`, { responseType: 'blob' })
                .then(response => {
                    const contentDisposition = response.headers['content-disposition'];

                    let filename = name; // Default filename

                    if (contentDisposition) {
                        const match = contentDisposition.match(/filename="(.+)"/);
                        if (match) {
                            filename = match[1];
                        }
                    }

                    const blob = new Blob([response.data]);
                    const link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = filename;
                    link.click();
                })
                .catch(error => {
                    console.error(error);
                });
        }
    },
}
</script>

<style scoped>
.uplaod {
    padding: 10px;
    border: none;
    margin-bottom: 30px;
    width: 20%;
    text-align: center;
    border-radius: 10px;
    color: rgba(50, 6, 248, 0.829);
    transition: 0.15s ease;
    cursor: pointer;
}

.uplaod:hover {
    background-color: rgba(50, 6, 248, 0.74);
    color: aliceblue;
    border: none;
}
</style>