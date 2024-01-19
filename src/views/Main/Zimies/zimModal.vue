<template>
    <CModal size="xl">
        <CModalHeader>
            <CModalTitle>
                <h2>{{ zim.znumber }}</h2>
            </CModalTitle>
        </CModalHeader>
        <CModalBody>
            <CRow class="nav">
                <CButton :color="bcolor1" class="navbut"
                    @click="but1 = !but1, but2 = false, but3 = false, but4 = false, color()">
                    Στοιχεία Ζημίας
                </CButton>
                <CButton :color="bcolor3" class="navbut"
                    @click="but3 = !but3, but1 = false, but2 = false, but4 = false, color()">
                    Αρχεία Ζημίας
                </CButton>
            </CRow>
            <CCollapse :visible="but1">
                <CCard class="mt-3">
                    <CCardBody class="cbody">
                        <CTable striped bordered>
                            <CTableHead>
                                <CTableRow style="text-align: center;">
                                    <CTableHeaderCell scope="col">Αριθμός Ζημίας</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Ονοματεπώνυμο Πελάτη</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Αριθμός Συμβολαίου</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Ασφαλιστική</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Ποσό</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Ημερομηνία Καταχώρησης</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Κατάσταση</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                <CTableRow style="text-align: center;">
                                    <CTableDataCell>{{ zim.znumber }}</CTableDataCell>
                                    <CTableDataCell>{{ zim.name }} {{ zim.surname }}</CTableDataCell>
                                    <CTableDataCell>{{ zim.conumber }}</CTableDataCell>
                                    <CTableDataCell>{{ zim.iname }}</CTableDataCell>
                                    <CTableDataCell>{{ zim.poso }}</CTableDataCell>
                                    <CTableDataCell>{{ zim.inputdate }}</CTableDataCell>
                                    <CTableDataCell v-if="zim.status == 1">Σε Εκρεμότητα</CTableDataCell>
                                    <CTableDataCell v-if="zim.status == 2">Εγκρίθηκε</CTableDataCell>
                                </CTableRow>
                                <CTableRow v-if="zim == ''" style="text-align: center;">
                                    <CTableDataCell colspan="10">Δεν υπάρχουν διαθέσιμα δεδομένα στον πίνακα
                                    </CTableDataCell>
                                </CTableRow>
                            </CTableBody>
                        </CTable>
                    </CCardBody>
                </CCard>
            </CCollapse>
            <CCollapse :visible="but3">
                <CCard class="mt-3">
                    <CCardBody class="files">
                        <div v-for="(entry, id) in files" :item="entry" :key="id" class="download">
                            <CButton @click="download(entry.id, entry.filename)"> <br>
                                <CIcon :icon="icon.cilArrowThickToBottom" height="32"></CIcon> {{ entry.filename }}
                            </CButton>
                        </div>
                    </CCardBody>
                </CCard>
            </CCollapse>
        </CModalBody>
    </CModal>
</template>

<script>
import { CModalBody } from '@coreui/vue';
import * as icon from '@coreui/icons';
import axios from 'axios';

export default {
    props: {
        zim: Object,
        files: [],
    },

    setup() {
        return {
            icon,
        }
    },

    data() {
        return {
            but1: true,
            but3: false,
            bcolor1: '',
            bcolor3: '',
        }
    },

    mounted() {
        this.color()

    },

    methods: {
        color() {
            if (this.but1) {
                this.bcolor1 = 'dark'
                this.bcolor3 = ''
            } else if (this.but3) {
                this.bcolor3 = 'dark'
                this.bcolor1 = ''
            }
        },

        download(id, name) {
            axios.get(`/download/${id}`, { responseType: 'blob' })
                .then(response => {
                    const contentDisposition = response.headers['content-disposition'];

                    let filename = name;

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
        },
    },

    components: { CModalBody }
}
</script>

<style scoped>
.nav {
    display: flex;
    justify-content: center;
    text-align: center;
    align-items: center;
}

.navbut {
    flex: 1;
    font-size: 1.5rem;
    border-right: 1px solid;
    border-left: 1px solid;
    border-radius: 0;

}

.files {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}

.download {
    border: 1px solid;
    border-radius: 20px;
    text-align: center;
}

</style>