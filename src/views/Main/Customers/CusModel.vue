<template>
    <CModal fullscreen size="xl" @close="onModalClose">
        <CModalHeader>
            <CModalTitle>
                <h2>{{ cus.name }} {{ cus.surname }}</h2>
            </CModalTitle>
        </CModalHeader>
        <CModalBody>
            <CRow class="nav">
                <CButton :color="bcolor1" class="navbut"
                    @click="but1 = !but1, but2 = false, but3 = false, but4 = false, color()">
                    Στοιχεία Πελάτη
                </CButton>
                <CButton :color="bcolor2" class="navbut"
                    @click="but2 = !but2, but1 = false, but3 = false, but4 = false, color()">
                    Συμβόλαια Πελάτη
                </CButton>
                <CButton :color="bcolor3" class="navbut"
                    @click="but3 = !but3, but1 = false, but2 = false, but4 = false, color()">
                    Αρχεία Πελάτη
                </CButton>
                <CButton :color="bcolor4" class="navbut"
                    @click="but4 = !but4, but1 = false, but2 = false, but3 = false, color()">
                    Ζημίες
                </CButton>
            </CRow>
            <CCollapse :visible="but1">
                <CCard class="mt-3">
                    <CTable striped bordered>
                        <CTableHead>
                            <CTableRow style="text-align: center;">
                                <CTableHeaderCell scope="col">Ονοματεπώνυμο</CTableHeaderCell>
                                <CTableHeaderCell scope="col">ΑΦΜ</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Κινητό</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Σταθερό</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Φύλο</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Τ.Κ.</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Ημερομηνία Γέννησης</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Ιδιότητα</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Επεξεργασία</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            <CTableRow style="text-align: center;">
                                <CTableDataCell>{{ cus.name }} {{ cus.surname }}</CTableDataCell>
                                <CTableDataCell>{{ cus.afm }}</CTableDataCell>
                                <CTableDataCell>{{ cus.email }}</CTableDataCell>
                                <CTableDataCell>{{ cus.cellphone }}</CTableDataCell>
                                <CTableDataCell>{{ cus.phone }}</CTableDataCell>
                                <CTableDataCell v-if="cus.gender == 'A'">Άνδρας</CTableDataCell>
                                <CTableDataCell v-if="cus.gender == 'G'">Γυναίκα</CTableDataCell>
                                <CTableDataCell>{{ cus.postcode }}</CTableDataCell>
                                <CTableDataCell>{{ cus.birthday }}</CTableDataCell>
                                <CTableDataCell v-if="cus.property == 'A'">Φυσικό Πρόσωπο</CTableDataCell>
                                <CTableDataCell v-if="cus.property == 'N'">Νομικό Πρόσωπο</CTableDataCell>
                                <CTableDataCell>
                                    <CButton style="color: rgb(65, 45, 165);" @click="vis = !vis, table = cus">
                                        <CIcon :icon="icon.cilPen" height="25"></CIcon>
                                    </CButton>
                                </CTableDataCell>
                            </CTableRow>
                            <CTableRow v-if="cus.length === 0" style="text-align: center;">
                                <CTableDataCell colspan="10">Δεν υπάρχουν διαθέσιμα δεδομένα στον πίνακα</CTableDataCell>
                            </CTableRow>
                        </CTableBody>
                    </CTable>

                    <CForm style="width: 50%; margin-top: 15px;" v-if="vis" @submit.prevent="upd">
                        <div class="edit">
                            <CFormLabel style="margin-right: 5px; margin-left: 5px;">Όνομα</CFormLabel>
                            <CFormInput type="text" :placeholder="table.name" v-model="table.name"></CFormInput>
                        </div>
                        <div class="edit">
                            <CFormLabel style="margin-right: 5px; margin-left: 5px;">Επίθετο</CFormLabel>
                            <CFormInput type="text" :placeholder="table.surname" v-model="table.surname"></CFormInput>
                        </div>
                        <div class="edit">
                            <CFormLabel style="margin-right: 5px; margin-left: 5px;">ΑΦΜ</CFormLabel>
                            <CFormInput type="text" :placeholder="table.afm" v-model="table.afm"></CFormInput>
                        </div>
                        <div class="edit">
                            <CFormLabel style="margin-right: 5px; margin-left: 5px;">Email</CFormLabel>
                            <CFormInput type="text" :placeholder="table.email" v-model="table.email"></CFormInput>
                        </div>
                        <div class="edit">
                            <CFormLabel style="margin-right: 5px; margin-left: 5px;">Κινητό</CFormLabel>
                            <CFormInput type="text" :placeholder="table.cellphone" v-model="table.cellphone"></CFormInput>
                        </div>
                        <div class="edit">
                            <CFormLabel style="margin-right: 5px; margin-left: 5px;">Σταθερό</CFormLabel>
                            <CFormInput type="text" :placeholder="table.phone" v-model="table.phone"></CFormInput>
                        </div>
                        <div class="edit">
                            <CFormLabel style="margin-right: 5px; margin-left: 5px;">Τ.Κ.</CFormLabel>
                            <CFormInput type="text" :placeholder="table.postcode" v-model="table.postcode"></CFormInput>
                        </div>
                        <div class="edit">
                            <CFormLabel style="margin-right: 5px; margin-left: 5px;">Ιδιότητα</CFormLabel>
                            <CFormSelect size="sm" class="mb-3" v-model="table.property">
                                <option value="A">Φυσικό Πρόσωπο</option>
                                <option value="N">Νομικό Πρόσωπο</option>
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
                </CCard>
            </CCollapse>
            <CCollapse :visible="but2">
                <CCard class="mt-3">
                    <CCardBody>
                        <CTable striped bordered>
                            <CTableHead>
                                <CTableRow style="text-align: center;">
                                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Αριθμός Συμβολαίου</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Ασφαλιστική</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Κλάδος Ασφάλησης</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Χαρακτηριστικό</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Λήξη Συμβολαίου</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Ομαδικό</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Λεπτομέριες</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Διαγραφή</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                <CTableRow v-for="(entry, id) in con" :item="entry" :key="id" style="text-align: center;">
                                    <CTableDataCell>{{ id + 1 }}</CTableDataCell>
                                    <CTableDataCell>{{ entry.conumber }}</CTableDataCell>
                                    <CTableDataCell>{{ entry.iname }}</CTableDataCell>
                                    <CTableDataCell>{{ entry.bname }}
                                    </CTableDataCell>
                                    <CTableDataCell>{{ entry.pinakida }}</CTableDataCell>
                                    <CTableDataCell>{{ entry.enddate }}</CTableDataCell>
                                    <CTableDataCell v-if="entry.omadiko == 1">NAI</CTableDataCell>
                                    <CTableDataCell v-if="entry.omadiko == 2">ΟΧΙ</CTableDataCell>
                                    <CTableDataCell>
                                        <CButton style="color: rgb(65, 45, 165);"
                                            @click="lept = !lept, getconbody(entry.conid)">
                                            <CIcon :icon="icon.cilArrowThickBottom" height="25"></CIcon>
                                        </CButton>
                                    </CTableDataCell>
                                    <CTableDataCell>
                                        <CButton style="color: rgb(165, 49, 45);" @click="deletecon(entry.conid)">
                                            <CIcon :icon="icon.cilXCircle" height="32"></CIcon>
                                        </CButton>
                                    </CTableDataCell>
                                </CTableRow>
                                <CTableRow v-for="(entry, id) in omad" :item="entry" :key="id" style="text-align: center;">
                                    <CTableDataCell>{{ id + 1 }}</CTableDataCell>
                                    <CTableDataCell>{{ entry.conumber }}</CTableDataCell>
                                    <CTableDataCell>{{ entry.iname }}</CTableDataCell>
                                    <CTableDataCell>{{ entry.bname }}
                                    </CTableDataCell>
                                    <CTableDataCell>{{ entry.pinakida }}</CTableDataCell>
                                    <CTableDataCell>{{ entry.enddate }}</CTableDataCell>
                                    <CTableDataCell v-if="entry.omadiko == 1">NAI</CTableDataCell>
                                    <CTableDataCell v-if="entry.omadiko == 2">ΟΧΙ</CTableDataCell>
                                    <CTableDataCell>
                                        <CButton style="color: rgb(65, 45, 165);"
                                            @click="lept = !lept, getconbody(entry.conid)">
                                            <CIcon :icon="icon.cilArrowThickBottom" height="25"></CIcon>
                                        </CButton>
                                    </CTableDataCell>
                                    <CTableDataCell>
                                        <CButton style="color: rgb(165, 49, 45);" @click="deletecon(entry.conid)">
                                            <CIcon :icon="icon.cilXCircle" height="32"></CIcon>
                                        </CButton>
                                    </CTableDataCell>
                                </CTableRow>
                                <CTableRow v-if="con.length === 0" style="text-align: center;">
                                    <CTableDataCell colspan="9">Δεν υπάρχουν διαθέσιμα δεδομένα στον πίνακα</CTableDataCell>
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
                                <CIcon :icon="icon.cilCloudDownload" height="32"></CIcon> {{ entry.filename }}
                            </CButton>

                            <CButton style="color: rgb(165, 49, 45); flex: right;" @click="deletefile(entry.id)">
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
        </CModalBody>
        <COffcanvas placement="bottom" :visible="lept" @hide="() => { lept = !lept }">
            <COffcanvasHeader>
                <COffcanvasTitle>Λεπτομέριες Συμβολαίου</COffcanvasTitle>
                <CCloseButton class="text-reset" @click="() => { lept = false }" />
            </COffcanvasHeader>
            <OffCanvas @close="lept = false" :body="conbody" :confiles="confiles"></OffCanvas>
        </COffcanvas>
    </CModal>
</template>

<script>
import { CButton, CRow } from '@coreui/vue';
import { CIcon } from '@coreui/icons-vue';
import * as icon from '@coreui/icons';
import OffCanvas from './OffCanvas.vue';
import axios from 'axios';
// import VueDatePicker from '@vuepic/vue-datepicker';
// import '@vuepic/vue-datepicker/dist/main.css';
// //import { format } from 'date-fns';
// import moment from 'moment';

export default {
    props: {
        cus: Object,
        con: [],
        files: [],
        zimies: [],
        omad: [],
    },
    setup() {
        return {
            icon,
        }
    },
    data() {
        return {
            but1: true,
            but2: false,
            but3: false,
            but4: false,
            bcolor1: '',
            bcolor2: '',
            bcolor3: '',
            bcolor4: '',
            lept: false,
            conbody: Object,
            vis: false,
            table: Object,
            table2: this.con,
            confiles: [],



        }
    },

    mounted() {
        this.color()
    },

    methods: {
        color() {
            if (this.but1) {
                this.bcolor1 = 'dark'
                this.bcolor2 = ''
                this.bcolor3 = ''
                this.bcolor4 = ''
            } else if (this.but2) {
                this.bcolor2 = 'dark'
                this.bcolor1 = ''
                this.bcolor3 = ''
                this.bcolor4 = ''
            } else if (this.but3) {
                this.bcolor3 = 'dark'
                this.bcolor1 = ''
                this.bcolor2 = ''
                this.bcolor4 = ''
            } else {
                this.bcolor3 = ''
                this.bcolor1 = ''
                this.bcolor2 = ''
                this.bcolor4 = 'dark'
            }
        },

        onModalClose(){
            this.vis = false
        },


        getconbody(id) {
            axios.get('/contracts-customer').then(res => {
                for (var i = 0; i < res.data.length; i++) {
                    if (res.data[i].conid == id) {
                        this.conbody = res.data[i]
                    }
                }
            })


            axios.get('/files').then(res => {
                var c = 0
                this.confiles = []
                for (var i = 0; i < res.data.length; i++) {
                    if (res.data[i].coid == id) {
                        this.confiles[c] = res.data[i]
                        c++
                    }
                }
            })
            console.log(this.confiles)
        },
        deletecon(id) {
            if (confirm('Είστε σίγουρος ότι θέλετε να γίνει διαγραφή;')) {
                axios.delete('/contracts', {
                    data: { id: id }
                }).then(this.$emit('close')).catch(err => console.log(err, id))
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

        upd() {
            var id = this.cus.cid


            axios.patch(`/customer/${id}`, {
                name: this.table.name,
                afm: this.table.afm,
                surname: this.table.surname,
                email: this.table.email,
                cellphone: this.table.cellphone,
                phone: this.table.phone,
                postcode: this.table.postcode,
                property: this.table.property
            }).then(this.vis = false)
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
    components: { CButton, CIcon, OffCanvas, CRow }
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