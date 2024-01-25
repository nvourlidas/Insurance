<template>
    <COffcanvasBody>
        <CTable striped bordered>
            <CTableHead>
                <CTableRow style="text-align: center;">
                    <CTableHeaderCell scope="col">Αριθμός Συμβολαίου</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Ασφαλιστική</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Κλάδος Ασφάλησης</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Χαρακτηριστικό</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Ημερομηνία 'Εναρξης</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Ημερομηνία Λήξης</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Καθαρά</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Μεικτά</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Προμήθεια</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Μέθοδος Πληρωμής</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Ομαδικό</CTableHeaderCell>
                </CTableRow>
            </CTableHead>
            <CTableBody>
                <CTableRow style="text-align: center;">
                    <CTableDataCell>{{ body.conumber }}</CTableDataCell>
                    <CTableDataCell>{{ body.iname }}</CTableDataCell>
                    <CTableDataCell>{{ body.bname }}</CTableDataCell>
                    <CTableDataCell>{{ body.pinakida }}</CTableDataCell>
                    <CTableDataCell>{{ body.startdate }}</CTableDataCell>
                    <CTableDataCell>{{ body.enddate }}</CTableDataCell>
                    <CTableDataCell>{{ body.clear }}</CTableDataCell>
                    <CTableDataCell>{{ body.mikta }}</CTableDataCell>
                    <CTableDataCell>{{ body.promithia }}</CTableDataCell>
                    <CTableDataCell v-if="body.paymentmethod == 1">Μηνιαία</CTableDataCell>
                    <CTableDataCell v-if="body.paymentmethod == 2">3μηνη</CTableDataCell>
                    <CTableDataCell v-if="body.paymentmethod == 3">6μηνη</CTableDataCell>
                    <CTableDataCell v-if="body.paymentmethod == 4">'Εως Λήξη Συμβολαίου</CTableDataCell>
                    <CTableDataCell v-if="body.omadiko == 1">NAI</CTableDataCell>
                    <CTableDataCell v-if="body.omadiko == 2">ΟΧΙ</CTableDataCell>
                </CTableRow>
            </CTableBody>
        </CTable>
        <h3>Αρχεία Συμβολαίου</h3>
        <CCard class="mt-3">
                    <CCardBody class="files">
                        <div v-for="(entry, id) in confiles" :item="entry" :key="id" class="download">
                            <CButton @click="download(entry.id, entry.filename)"> <br>
                                <CIcon :icon="icon.cilCloudDownload" height="32"></CIcon> {{ entry.filename }}
                            </CButton>

                            
                            <CButton style="color: rgb(165, 49, 45);" @click="deletefile(entry.id)"> 
                                <CIcon :icon="icon.cilXCircle" height="42"></CIcon>
                            </CButton>
                        </div>
                    </CCardBody>
                </CCard>
    </COffcanvasBody>
</template>

<script>
import { CIcon } from '@coreui/icons-vue';
import * as icon from '@coreui/icons';
import axios from 'axios';
export default {
    props: {
        body: Object,
        confiles: [],
    },
    setup() {
        return {
            icon,
        }
    },

    methods: {
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
        },

        deletefile(id) {
            if (confirm('Είστε σίγουρος ότι θέλετε να γίνει διαγραφή;')) {
                axios.delete(`/files/${id}`).then(this.$emit('close')).catch(err => console.log(err, id))
            }
        },
    },

    components: { CIcon}
}
</script>

<style scoped>
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