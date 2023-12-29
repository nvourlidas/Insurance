<template>
    <CModal size="xl">
        <CModalHeader>
            <CModalTitle>
                <h2>{{ con.conumber }}</h2>
            </CModalTitle>
        </CModalHeader>
        <CModalBody>
            <CRow class="nav">
                <CButton :color="bcolor1" class="navbut"
                    @click="but1 = !but1, but2 = false, but3 = false, but4 = false, color()">
                    Στοιχεία Συμβολαίου
                </CButton>
                <CButton :color="bcolor3" class="navbut"
                    @click="but3 = !but3, but1 = false, but2 = false, but4 = false, color()">
                    Αρχεία Συμβολαίου
                </CButton>
                <CButton :color="bcolor4" class="navbut"
                    @click="but4 = !but4, but1 = false, but2 = false, but3 = false, color()">
                    Ζημίες
                </CButton>
            </CRow>

            <CCollapse :visible="but1">
                <CCard class="mt-3">
                    <CCardBody class="cbody">

                        <CTable striped bordered>
                            <CTableHead>
                                <CTableRow style="text-align: center;">
                                    <CTableHeaderCell scope="col">Αριθμός Συμβολαίου</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Ασφαλιστική</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Κλάδος Ασφάλησης</CTableHeaderCell>
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
                                    <CTableDataCell>{{ con.conumber }}</CTableDataCell>
                                    <CTableDataCell>{{ con.iname }}</CTableDataCell>
                                    <CTableDataCell>{{ con.bname }} <p v-if="con.pinakida"> Αριθμός Κυκλοφορίας: {{
                                        con.pinakida }}</p>
                                    </CTableDataCell>
                                    <CTableDataCell>{{ con.startdate }}</CTableDataCell>
                                    <CTableDataCell>{{ con.enddate }}</CTableDataCell>
                                    <CTableDataCell>{{ con.clear }}</CTableDataCell>
                                    <CTableDataCell>{{ con.mikta }}</CTableDataCell>
                                    <CTableDataCell>{{ con.promithia }}</CTableDataCell>
                                    <CTableDataCell v-if="con.paymentmethod == 1">Μηνιαία</CTableDataCell>
                                    <CTableDataCell v-if="con.paymentmethod == 2">3μηνη</CTableDataCell>
                                    <CTableDataCell v-if="con.paymentmethod == 3">6μηνη</CTableDataCell>
                                    <CTableDataCell v-if="con.paymentmethod == 4">'Εως Λήξη Συμβολαίου</CTableDataCell>
                                    <CTableDataCell v-if="con.omadiko == 1">NAI</CTableDataCell>
                                    <CTableDataCell v-if="con.omadiko == 2">ΟΧΙ</CTableDataCell>
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
            <CCollapse :visible="but4">
                <CCard class="mt-3">
                    <CCardBody>
                        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry
                        richardson ad squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson
                        cred nesciunt sapiente ea proident.
                    </CCardBody>
                </CCard>
            </CCollapse>
        </CModalBody>
        <COffcanvas placement="bottom" :visible="lept" @hide="() => { lept = !lept }">
            <COffcanvasHeader>
                <COffcanvasTitle>Λεπτομέριες Συμβολαίου</COffcanvasTitle>
                <CCloseButton class="text-reset" @click="() => { lept = false }" />
            </COffcanvasHeader>
            <OffCanvas :body="conbody"></OffCanvas>
        </COffcanvas>
    </CModal>
</template>

<script>
import { CButton } from '@coreui/vue';
//import { CIcon } from '@coreui/icons-vue';
import * as icon from '@coreui/icons';
import OffCanvas from './OffCanvas.vue';
import axios from 'axios';

export default {
    props: {
        cus: Object,
        con: Object,
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
            but4: false,
            bcolor1: '',
            bcolor3: '',
            bcolor4: '',
            lept: false,
            conbody: Object


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
                this.bcolor4 = ''
            } else if (this.but3) {
                this.bcolor3 = 'dark'
                this.bcolor1 = ''

                this.bcolor4 = ''
            } else {
                this.bcolor3 = ''
                this.bcolor1 = ''
                this.bcolor4 = 'dark'
            }
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
    components: { CButton, OffCanvas }
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

.files{
    display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
}

.download{
    border: 1px solid;
    border-radius: 20px;
    text-align: center;
}

</style>