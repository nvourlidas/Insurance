<template>
    <CModal size="xl">
        <CModalHeader>
            <CModalTitle>
                <h2>{{ cus.name }} {{ cus.surname }}</h2>
            </CModalTitle>
        </CModalHeader>
        <CModalBody>
            <CRow class="nav">
                <CButton :color="bcolor1" class="navbut" @click="but1 = !but1, but2 = false, but3 = false, but4=false, color()">
                    Στοιχεία Πελάτη
                </CButton>
                <CButton :color="bcolor2" class="navbut" @click="but2 = !but2, but1 = false, but3 = false, but4=false, color()">
                    Συμβόλαια Πελάτη
                </CButton>
                <CButton :color="bcolor3" class="navbut" @click="but3 = !but3, but1 = false, but2 = false, but4=false, color()">
                    Αρχεία Πελάτη
                </CButton>
                <CButton :color="bcolor4" class="navbut" @click="but4 = !but4, but1 = false, but2 = false, but3=false, color()">
                    Ζημίες
                </CButton>
            </CRow>

            <CCollapse :visible="but1">
                <CCard class="mt-3">
                    <CCardBody class="cbody">
                        <p><b>Ονοματεπώνυμο:</b> {{ cus.name }} {{ cus.surname }}</p>
                        <p><b>ΑΦΜ:</b> {{ cus.afm }}</p>
                        <p><b>Email:</b> {{ cus.email }}</p>
                        <p><b>Κινητό:</b> {{ cus.cellphone }}</p>
                        <p><b>Σταθερό:</b> {{ cus.phone }}</p>
                        <p v-if="cus.gender == 'A'"><b>Φύλο:</b> Άνδρας</p>
                        <p v-if="cus.gender == 'G'"><b>Φύλο:</b> Γυναίκα</p>
                        <p><b>Τ.Κ.:</b> {{ cus.postcode }}</p>
                        <p><b>Ημερομηνία Γέννησης:</b> {{ cus.birthday }}</p>
                        <p v-if="cus.property == 'A'"><b>Ιδιότητα:</b> Φυσικό Πρόσωπο</p>
                        <p v-if="cus.property == 'N'"><b>Ιδιότητα:</b> Νομικό Πρόσωπο</p>
                    </CCardBody>
                </CCard>
            </CCollapse>
            <CCollapse :visible="but2">
                <CCard class="mt-3">
                    <CCardBody>
                        <CTable striped bordered>
                            <CTableHead>
                                <CTableRow style="text-align: center;">
                                    <CTableHeaderCell scope="col">Αριθμός Συμβολαίου</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Ασφαλιστική</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Κλάδος Ασφάλησης</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Λήξη Συμβολαίου</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Ομαδικό</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Λεπτομέριες</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Διαγραφή</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                <CTableRow v-for="(entry, id) in con" :item="entry" :key="id" style="text-align: center;">
                                    <CTableDataCell>{{ entry.conumber }}</CTableDataCell>
                                    <CTableDataCell>{{ entry.name }}</CTableDataCell>
                                    <CTableDataCell>{{ entry.bname }}</CTableDataCell>
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
                            </CTableBody>
                        </CTable>
                    </CCardBody>
                </CCard>
            </CCollapse>
            <CCollapse :visible="but3">
                <CCard class="mt-3">
                    <CCardBody>
                        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry
                        richardson ad squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson
                        cred nesciunt sapiente ea proident.
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
import { CIcon } from '@coreui/icons-vue';
import * as icon from '@coreui/icons';
import OffCanvas from './OffCanvas.vue';
import axios from 'axios';

export default {
    props: {
        cus: Object,
        con: [],
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
                this.bcolor2 = ''
                this.bcolor3 = ''
                this.bcolor4 = ''
            } else if (this.but2) {
                this.bcolor2 = 'dark'
                this.bcolor1 = ''
                this.bcolor3 = ''
                this.bcolor4 = ''
            } else if(this.but3) {
                this.bcolor3 = 'dark'
                this.bcolor1 = ''
                this.bcolor2 = ''
                this.bcolor4 = ''
            }else{
                this.bcolor3 = ''
                this.bcolor1 = ''
                this.bcolor2 = ''
                this.bcolor4 = 'dark'
            }
        },

        getconbody(id) {
            for (var i = 0; i < this.con.length; i++) {
                if (this.con[i].conid == id) {
                    this.conbody = this.con[i]
                }
            }
        },
        deletecon(id) {
            if (confirm('Είστε σίγουρος ότι θέλετε να γίνει διαγραφή;')) {
                axios.delete(`/contracts`, {
                    id: id
                }).catch(err => console.log(err, id))
            }
        },
    },
    components: { CButton, CIcon, OffCanvas }
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
</style>