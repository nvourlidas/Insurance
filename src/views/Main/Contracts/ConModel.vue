<template>
    <CModal fullscreen size="xl" @close="onModalClose">
        <CModalHeader>
            <CModalTitle>
                <h2>Αριθμός Συμβολαίου: {{ con.conumber }}</h2>
            </CModalTitle>
        </CModalHeader>
        <CModalBody>
            <CRow class="nav">
                <CButton :color="bcolor1" class="navbut"
                    @click="but1 = !but1, but2 = false, but3 = false, but4 = false, but5 = false, color()">
                    Στοιχεία Συμβολαίου
                </CButton>
                <CButton :color="bcolor5" class="navbut" v-if="con.omadiko == 1"
                    @click="but5 = !but5, but1 = false, but2 = false, but4 = false, but3 = false, color()">
                    Πελάτες
                </CButton>
                <CButton :color="bcolor3" class="navbut"
                    @click="but3 = !but3, but1 = false, but2 = false, but4 = false, but5 = false, color()">
                    Αρχεία Συμβολαίου
                </CButton>
                <CButton :color="bcolor4" class="navbut"
                    @click="but4 = !but4, but1 = false, but2 = false, but3 = false, but5 = false, color()">
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
                                    <CTableHeaderCell scope="col">Ονοματεπώνυμο Πελάτη</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Ασφαλιστική</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Κλάδος Ασφάλησης</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Χαρακτηριστικό</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Ημερομηνία 'Εναρξης</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Ημερομηνία Λήξης</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Καθαρά</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Μεικτά</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Προμήθεια</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Μέθοδος Πληρωμής</CTableHeaderCell>
                                    <CTableHeaderCell scope="col" v-if="con.paymentmethod != 4">Ημερομηνία Επόμενης Πληρωμής</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Ομαδικό</CTableHeaderCell>
                                    <CTableHeaderCell scope="col" v-if="mod == 1">Επεξεργασία</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                <CTableRow style="text-align: center;">
                                    <CTableDataCell>{{ con.conumber }}</CTableDataCell>
                                    <CTableDataCell>{{ cus.name }} {{ cus.surname }}</CTableDataCell>
                                    <CTableDataCell>{{ con.iname }}</CTableDataCell>
                                    <CTableDataCell>{{ con.bname }}
                                    </CTableDataCell>
                                    <CTableDataCell>{{ con.pinakida }}</CTableDataCell>
                                    <CTableDataCell>{{ con.startdate }}</CTableDataCell>
                                    <CTableDataCell>{{ formatdate(con.enddate) }}</CTableDataCell>
                                    <CTableDataCell>{{ con.clear }}</CTableDataCell>
                                    <CTableDataCell>{{ con.mikta }}</CTableDataCell>
                                    <CTableDataCell>{{ con.promithia }}</CTableDataCell>
                                    <CTableDataCell v-if="con.paymentmethod == 1">Μηνιαία</CTableDataCell>
                                    <CTableDataCell v-if="con.paymentmethod == 2">3μηνη</CTableDataCell>
                                    <CTableDataCell v-if="con.paymentmethod == 3">6μηνη</CTableDataCell>
                                    <CTableDataCell v-if="con.paymentmethod == 4">'Εως Λήξη Συμβολαίου</CTableDataCell>
                                    <CTableDataCell v-if="con.paymentmethod != 4">{{ formatdate(con.paydate) }}</CTableDataCell>
                                    <CTableDataCell v-if="con.omadiko == 1">NAI</CTableDataCell>
                                    <CTableDataCell v-if="con.omadiko == 2">ΟΧΙ</CTableDataCell>
                                    <CTableDataCell v-if="mod == 1">
                                        <CButton style="color: rgb(65, 45, 165);" @click="vis = !vis, table = con">
                                            <CIcon :icon="icon.cilPen" height="25"></CIcon>
                                        </CButton>
                                    </CTableDataCell>
                                </CTableRow>
                                <CTableRow v-if="con.length === 0" style="text-align: center;">
                                    <CTableDataCell colspan="10">Δεν υπάρχουν διαθέσιμα δεδομένα στον πίνακα
                                    </CTableDataCell>
                                </CTableRow>
                            </CTableBody>
                        </CTable>
                        <!-- <div  v-for="(item, index) in test" :key="index">
                            <div v-for="(e, i) in customers" :key="i">
                                <p v-if="e.cid == item"> {{ e.name }}</p>
                            </div>
                        </div> -->
                        <CForm style="width: 80%; margin-top: 15px;" v-if="vis" @submit.prevent="upd">
                            <div class="edit">
                                <CFormLabel style="margin-right: 5px; margin-left: 5px;">Αριθμός Συμβολαίου</CFormLabel>
                                <CFormInput type="text" :placeholder="table.conumber" v-model="table.conumber"></CFormInput>
                            </div>
                            <div class="edit">
                                <CFormLabel style="margin-right: 5px; margin-left: 5px;">ΑΦΜ Πελάτη</CFormLabel>
                                <CFormInput type="text" floatingLabel="ΑΦΜ Πελάτη" placeholder="ΑΦΜ Πελάτη"
                                    v-model="searchQuery" />
                                <CFormSelect size="sm" class="mb-3" multiple v-model="table.custid" :html-size="2">
                                    <option v-for="entry in filteredItems" :key="entry.cid" :value="entry.cid"> {{
                                        entry.afm }} ({{ entry.name }} {{ entry.surname }})
                                    </option>
                                </CFormSelect>
                            </div>
                            <div class="edit">
                                <CFormLabel style="margin-right: 5px; margin-left: 5px;">Ασφαλιστική</CFormLabel>
                                <CFormSelect size="sm" class="mb-3" v-model="table.insuranceid">
                                    <option>Επιλογή Ασφαλιστικής</option>
                                    <option v-for="entry in insur" :key="entry.inid" :value="entry.inid"> {{ entry.iname }}
                                    </option>
                                </CFormSelect>
                            </div>
                            <div class="edit">
                                <CFormLabel style="margin-right: 5px; margin-left: 5px;">Κλάδος</CFormLabel>
                                <CFormSelect size="sm" class="mb-3" v-model="table.branchid">
                                    <option>Επιλογή Κλάδου</option>
                                    <option v-for="entry in branch" :key="entry.bid" :value="entry.bid"> {{ entry.bname }}
                                    </option>
                                </CFormSelect>
                            </div>
                            <div class="edit" v-if="table.branchid == 1">
                                <CFormLabel style="margin-right: 5px; margin-left: 5px;">Χαρακτηριστικό</CFormLabel>
                                <CFormInput type="text" :placeholder="table.pinakida" v-model="table.pinakida">
                                </CFormInput>
                            </div>
                            <div class="edit">
                                <CFormLabel style="margin-right: 5px; margin-left: 5px;">Καθαρά</CFormLabel>
                                <CInputGroup class="mb-3">
                                    <CInputGroupText>€</CInputGroupText>
                                    <CFormInput type="text" :placeholder="table.clear" v-model="table.clear" />
                                </CInputGroup>
                            </div>
                            <div class="edit">
                                <CFormLabel style="margin-right: 5px; margin-left: 5px;">Μεικτά</CFormLabel>
                                <CInputGroup class="mb-3">
                                    <CInputGroupText>€</CInputGroupText>
                                    <CFormInput type="text" :placeholder="table.mikta" v-model="table.mikta" />
                                </CInputGroup>
                            </div>
                            <div class="edit">
                                <CFormLabel style="margin-right: 5px; margin-left: 5px;">Προμήθεια</CFormLabel>
                                <CInputGroup class="mb-3">
                                    <CInputGroupText>€</CInputGroupText>
                                    <CFormInput type="text" :placeholder="table.promithia" v-model="table.promithia" />
                                </CInputGroup>
                            </div>
                            <div class="edit">
                                <CFormLabel style="margin-right: 5px; margin-left: 5px;">Μέθοδος Πληρωμής</CFormLabel>
                                <CFormSelect size="sm" class="mb-3" v-model="table.paymentmethod">
                                    <option value="4">'Εως Λήξη Συμβολαίου</option>
                                    <option value="1">Μηνιαία</option>
                                    <option value="2">3μηνη</option>
                                    <option value="3">6μηνη</option>
                                </CFormSelect>
                            </div>
                            <div class="edit">
                                <CFormLabel style="margin-right: 5px; margin-left: 5px;">Ομαδικό</CFormLabel>
                                <CFormSelect size="sm" class="mb-3" v-model="table.omadiko">
                                    <option value="2">ΟΧΙ</option>
                                    <option value="1">ΝΑΙ</option>
                                </CFormSelect>
                            </div>
                            <div class="edit">
                                <CButton type="submit" size="sm" color="primary" style="margin-right: 10px;">
                                    <CIcon :icon="icon.cilSave" size="sm" /> Αποθήκευση
                                </CButton>
                                <CButton size="sm" color="danger" @click="vis = !vis">
                                    <CIcon :icon="icon.cilAccountLogout" size="sm" /> Ακύρωση
                                </CButton>
                            </div>
                        </CForm>
                    </CCardBody>
                </CCard>
            </CCollapse>

            <CCollapse :visible="but3">
                <CCard class="mt-3">
                    <CCardBody class="files">
                        <div v-for="(entry, id) in files" :item="entry" :key="id" class="download">
                            <CButton @click="download(entry.id, entry.filename)"> <br>
                                <CIcon :icon="icon.cilCloudDownload" height="32"></CIcon> {{ entry.filename }}
                            </CButton>

                            <CButton style="color: rgb(165, 49, 45);" @click="deletefile(entry.id)">
                                <CIcon :icon="icon.cilXCircle" height="42"></CIcon>
                            </CButton>
                        </div>
                    </CCardBody>
                </CCard>
            </CCollapse>
            <CCollapse :visible="but4">
                <CCard class="mt-3">
                    <CCardBody>
                        <CTable striped bordered>
                            <CTableHead>
                                <CTableRow style="text-align: center;">
                                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Αριθμός Ζημίας</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Ονοματεπώνυμο Πελάτη</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Αριθμός Συμβολαίου</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Ασφαλιστική</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Ποσό</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Ημερομηνία Καταχώρησης</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Κατάσταση</CTableHeaderCell>

                                    <CTableHeaderCell scope="col">Διαγραφή</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                <CTableRow v-for="(entry, id) in zimies" :item="entry" :key="id"
                                    style="text-align: center;">
                                    <CTableDataCell>{{ id + 1 }}</CTableDataCell>
                                    <CTableDataCell>{{ entry.znumber }}</CTableDataCell>
                                    <CTableDataCell>{{ entry.name }} {{ entry.surname }}</CTableDataCell>
                                    <CTableDataCell>{{ entry.conumber }}</CTableDataCell>
                                    <CTableDataCell>{{ entry.iname }}</CTableDataCell>
                                    <CTableDataCell>{{ entry.poso }}</CTableDataCell>
                                    <CTableDataCell>{{ entry.inputdate }}</CTableDataCell>
                                    <CTableDataCell v-if="entry.status == 1">Σε Εκρεμότητα</CTableDataCell>
                                    <CTableDataCell v-if="entry.status == 2">Εγκρίθηκε</CTableDataCell>

                                    <CTableDataCell>
                                        <CButton style="color: rgb(165, 49, 45);" @click="deletezim(entry.zid)">
                                            <CIcon :icon="icon.cilXCircle" height="32"></CIcon>
                                        </CButton>
                                    </CTableDataCell>
                                </CTableRow>
                                <CTableRow v-if="zimies.length === 0" style="text-align: center;">
                                    <CTableDataCell colspan="9">Δεν υπάρχουν διαθέσιμα δεδομένα στον πίνακα</CTableDataCell>
                                </CTableRow>
                            </CTableBody>
                        </CTable>
                    </CCardBody>
                </CCard>
            </CCollapse>
            <CCollapse :visible="but5">
                <CCard class="mt-3">
                    <CCardHeader>
                        <CButton color="primary" variant="ghost" @click="vis2 = !vis2"
                            style=" height: 55px; margin-bottom: 20px;"><b>
                                <CIcon :icon="icon.cilPlus" size="xl"></CIcon> Εισαγωγή Πελάτη
                            </b> </CButton>
                        <CForm @submit.prevent="Add" v-if="vis2">
                            <CRow :xs="{ gutter: 2 }" style="padding: 20px;">
                                <CCol md>
                                    <CFormLabel style="margin-right: 5px; margin-left: 5px;">Αναζήτηση ΑΦΜ Πελάτη
                                    </CFormLabel>
                                    <CFormInput type="text" floatingLabel="Αναζήτηση ΑΦΜ Πελάτη"
                                        placeholder="Αναζήτηση ΑΦΜ Πελάτη" v-model="searchQuery" />
                                    <CFormSelect size="sm" class="mb-3" v-model="cuid" :html-size="2">
                                        <option v-for="entry in filteredItems" :key="entry.cid" :value="entry.cid"> {{
                                            entry.afm }} ({{ entry.name }} {{ entry.surname }})
                                        </option>
                                    </CFormSelect>
                                    <CButton type="submit" size="md" color="primary">
                                        <CIcon :icon="icon.cilSave" size="lg" /> Εισαγωγή Πελάτη
                                    </CButton>
                                </CCol>
                            </CRow>
                        </CForm>
                    </CCardHeader>
                    <CCardBody class="cbody">
                        <CTable striped bordered>
                            <CTableHead>
                                <CTableRow style="text-align: center;">
                                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Ονοματεπώνυμο</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">ΑΦΜ</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Κινητό</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Σταθερό</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Φύλο</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Τ.Κ.</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Ημερομηνία Γέννησης</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Ιδιότητα</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Αφαίρεση</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                <CTableRow v-for="(entry, id) in omadcus" :item="entry" :key="id"
                                    style="text-align: center;">
                                    <CTableDataCell>{{ id + 1 }}</CTableDataCell>
                                    <CTableDataCell>{{ entry.name }} {{ entry.surname }}</CTableDataCell>
                                    <CTableDataCell>{{ entry.afm }}</CTableDataCell>
                                    <CTableDataCell>{{ entry.email }}</CTableDataCell>
                                    <CTableDataCell>{{ entry.cellphone }}</CTableDataCell>
                                    <CTableDataCell>{{ entry.phone }}</CTableDataCell>
                                    <CTableDataCell v-if="entry.gender == 'A'">Άνδρας</CTableDataCell>
                                    <CTableDataCell v-if="entry.gender == 'G'">Γυναίκα</CTableDataCell>
                                    <CTableDataCell>{{ entry.postcode }}</CTableDataCell>
                                    <CTableDataCell>{{ entry.birthday }}</CTableDataCell>
                                    <CTableDataCell v-if="entry.property == 'A'">Φυσικό Πρόσωπο</CTableDataCell>
                                    <CTableDataCell v-if="entry.property == 'N'">Νομικό Πρόσωπο</CTableDataCell>
                                    <CTableDataCell>
                                        <CButton style="color: rgb(189, 62, 62);" @click="remove(entry.cuid)">
                                            <CIcon :icon="icon.cilBan" height="25"></CIcon>
                                        </CButton>
                                    </CTableDataCell>
                                </CTableRow>
                                <CTableRow v-if="omadcus.length === 0" style="text-align: center;">
                                    <CTableDataCell colspan="11">Δεν υπάρχουν διαθέσιμα δεδομένα στον πίνακα
                                    </CTableDataCell>
                                </CTableRow>
                            </CTableBody>
                        </CTable>
                    </CCardBody>
                </CCard>
            </CCollapse>
        </CModalBody>
    </CModal>
</template>

<script>
import { CButton } from '@coreui/vue';
//import { CIcon } from '@coreui/icons-vue';
import * as icon from '@coreui/icons';
import axios from 'axios';
// import VueDatePicker from '@vuepic/vue-datepicker';
// import '@vuepic/vue-datepicker/dist/main.css';
//import { format } from 'date-fns';

//import moment from 'moment';

export default {
    props: {
        cus: Object,
        con: Object,
        files: [],
        table2: [],
        insur: [],
        branch: [],
        mod: Number,
        zimies: [],
        omadcus: [],
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
            but5: false,
            bcolor1: '',
            bcolor3: '',
            bcolor4: '',
            bcolor5: '',
            vis: false,
            vis2: false,
            conbody: Object,
            table: Object,
            searchQuery: '',
            cuid: '',
        }
    },

    mounted() {
        this.color()

    },

    computed: {
        filteredItems() {

            return this.table2.filter(item =>
                Object.values(item)
                    .join(' ')
                    .toLowerCase()
                    .includes(this.searchQuery.toLowerCase())
            );

        },
    },

    methods: {
        color() {
            if (this.but1) {
                this.bcolor1 = 'dark'
                this.bcolor3 = ''
                this.bcolor4 = ''
                this.bcolor5 = ''
            } else if (this.but3) {
                this.bcolor3 = 'dark'
                this.bcolor1 = ''
                this.bcolor4 = ''
                this.bcolor5 = ''
            } else if (this.but4) {
                this.bcolor3 = ''
                this.bcolor1 = ''
                this.bcolor4 = 'dark'
                this.bcolor5 = ''
            } else {
                this.bcolor3 = ''
                this.bcolor1 = ''
                this.bcolor4 = ''
                this.bcolor5 = 'dark'
            }
        },

        onModalClose() {
            this.vis = false
        },

        Add() {
            if (confirm('Είστε σίγουρος ότι θέλετε να γίνει Εισαγωγή;')) {
                axios.post('/omadika', {
                    coid: this.con.conid,
                    cuid: this.cuid
                }).then(this.$emit('close'), this.vis2 = false).catch(err => console.log(err))
            }
        },

        deletezim(id) {
            if (confirm('Είστε σίγουρος ότι θέλετε να γίνει διαγραφή;')) {
                axios.delete(`/zimies/${id}`).then(this.$emit('close')).catch(err => console.log(err, id))
            }
        },

        deletefile(id) {
            if (confirm('Είστε σίγουρος ότι θέλετε να γίνει διαγραφή;')) {
                axios.delete(`/files/${id}`).then(this.$emit('close')).catch(err => console.log(err, id))
            }
        },

        remove(id) {
            if (confirm('Είστε σίγουρος ότι θέλετε να γίνει Αφαίρεση;')) {
                axios.delete('/omadika', {
                    data: {
                        cuid: id,
                        coid: this.con.conid
                    }
                }).then(this.$emit('close')).catch(err => console.log(err, id))
            }
        },

        formatdate(date2) {
            const date = new Date(date2);

            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
            const year = date.getFullYear();

            const formattedDate = `${day}-${month}-${year}`;

            return formattedDate
        },

        upd() {
            var id = this.con.conid

            axios.patch(`/contracts/${id}`, {
                conumber: this.table.conumber,
                custid: this.table.custid,
                insuranceid: this.table.insuranceid,
                branchid: this.table.branchid,
                clear: this.table.clear,
                mikta: this.table.mikta,
                promithia: this.table.promithia,
                paymentmethod: this.table.paymentmethod,
                omadiko: this.table.omadiko,
                pinakida: this.table.pinakida,
            }).then(this.vis = false)
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
        }
    },
    components: { CButton }
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

.edit {
    display: flex;
    margin: 10px;
}

.files {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}

.download {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border: 1px solid;
    border-radius: 20px;
    text-align: center;
}
</style>