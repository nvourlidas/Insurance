<template>
    <CInputGroup class="mb-3" size="lg">
        <CInputGroupText id="inputGroup-sizing-lg" style="border: 2px solid;">Αναζήτηση</CInputGroupText>
        <CFormInput aria-label="Username" aria-describedby="inputGroup-sizing-lg" v-model="searchQuery"
            style="width: 20%; border: 2px solid;" />
    </CInputGroup>
    <div class="top">
        <CButton color="primary" variant="outline" disabled>
            <CIcon :icon="icon.cilClipboard" class="flex-shrink-0 me-2" width="24" height="24" />
            Σύνολο Συμβολαίων: <b>{{ sunolo }}</b>
        </CButton>
        <CButton color="info" variant="ghost" @click="this.$router.push('/AddContract')" style=" height: 55px;"><b>
                <CIcon :icon="icon.cilClipboard" size="xl"></CIcon> Νέο Συμβόλαιο
            </b> </CButton>
    </div>
    <CTable striped bordered>
        <CTableHead>
            <CTableRow style="text-align: center;">
                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                <CTableHeaderCell scope="col">Αριθμός Συμβολαίου</CTableHeaderCell>
                <CTableHeaderCell scope="col">Ονοματεπώνυμο Πελάτη</CTableHeaderCell>
                <CTableHeaderCell scope="col">Ασφαλιστική</CTableHeaderCell>
                <CTableHeaderCell scope="col">Χαρακτηριστικό</CTableHeaderCell>
                <CTableHeaderCell scope="col">Ημερομηνία Επόμενης Πληρωμής</CTableHeaderCell>
                <CTableHeaderCell scope="col">Λεπτομέριες</CTableHeaderCell>
                <CTableHeaderCell scope="col">Ενημερώθηκε</CTableHeaderCell>
                <CTableHeaderCell scope="col">Πληρωμή</CTableHeaderCell>             
            </CTableRow>
        </CTableHead>
        <CTableBody>
            <CTableRow v-for="(entry, id) in paginatedData" :item="entry" :key="id" style="text-align: center;">
                <CTableDataCell>{{ id + 1 }}</CTableDataCell>
                <CTableDataCell>{{ entry.conumber }}</CTableDataCell>
                <CTableDataCell>
                    <div v-for="(e, id2) in table2" :item="e" :key="id2">
                        <p v-if="e.cid == entry.custid">{{ e.name }} {{ e.surname }}</p>
                    </div>
                </CTableDataCell>
                <CTableDataCell>{{ entry.iname }}</CTableDataCell>
                <CTableDataCell>{{ entry.pinakida }}</CTableDataCell>
                <CTableDataCell>{{ entry.paydate }}</CTableDataCell>
                <CTableDataCell>
                    <CButton style="color: rgb(65, 45, 165);" @click="showModal(entry.conid)">
                        <CIcon :icon="icon.cilDescription" height="32"></CIcon>
                    </CButton>
                </CTableDataCell>
                <CTableDataCell>
                    <!-- <CFormSwitch v-if="entry.inform == 0" @click="inform(entry.conid,id)" id="formSwitchCheckDefault" size="xl"/>
                    <CFormSwitch v-if="entry.inform == 1" disabled id="formSwitchCheckDefault"/> -->
                    <CButton v-if="entry.inform == 0" style="color: rgb(8, 8, 8);" @click="inform(entry.conid,id)">
                        <CIcon :icon="icon.cilToggleOff" height="32"></CIcon>
                    </CButton>
                    <CButton v-if="entry.inform == 1" style="color: rgb(21, 161, 8); border: none;" disabled>
                        <CIcon :icon="icon.cilToggleOn" height="32"></CIcon>
                    </CButton>
                </CTableDataCell>
                <CTableDataCell>
                    <CButton style="color: rgb(41, 177, 64);" @click="pay(entry.conid, id)">
                        <CIcon :icon="icon.cilCash" height="32"></CIcon>
                    </CButton>
                </CTableDataCell>             
            </CTableRow>
            <CTableRow v-if="paginatedData.length === 0" style="text-align: center;">
                <CTableDataCell colspan="8">Δεν υπάρχουν διαθέσιμα δεδομένα στον πίνακα</CTableDataCell>
            </CTableRow>
        </CTableBody>
    </CTable>
    {{ checked }}
    <CPagination size="lg" align="center" aria-label="Page navigation example">
        <CPaginationItem @click="prevPage" :disabled="currentPage === 1" style="cursor: pointer;">&laquo; Προηγούμενη
        </CPaginationItem>
        <CPaginationItem style="cursor: pointer;" v-for="pageNumber in totalPages" :key="pageNumber"
            :class="{ active: pageNumber === currentPage }" @click="changePage(pageNumber)">{{ pageNumber }}
        </CPaginationItem>
        <CPaginationItem style="cursor: pointer;" @click="nextPage" :disabled="currentPage === totalPages">Επόμενη &raquo;
        </CPaginationItem>
    </CPagination>
    <ConModal :visible="xlDemo" @close="xlDemo = false" :cus="cus" :con="con" :files="files" :mod="0" :zimies="zimies" :omadcus="omadcus">
    </ConModal>
</template>
<script>
import { CButton, CTableBody } from '@coreui/vue';
import axios from 'axios';
import { CIcon } from '@coreui/icons-vue';
import * as icon from '@coreui/icons';
import ConModal from './ConModel.vue'
import { addDays, format } from 'date-fns';




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
            itemsPerPage: 10,
            searchQuery: '',
            sunolo: '',
            todayDate: new Date(),
            futureDate: null,
            files: [],
            zimies: [],
            omadcus: [],
        };
    },
    created() {
        axios.get('/contracts-customer').then(res => {
            this.futureDate = addDays(this.todayDate, 31);
            this.futureDate = format(this.futureDate, 'yyyy-MM-dd');
            this.todayDate = format(this.todayDate, 'yyyy-MM-dd')

            var j = 0
            for (var i = 0; i < res.data.length; i++) {
                var dateParts = res.data[i].paydate.split('-');
                var formattedDate = dateParts[2] + '-' + dateParts[1] + '-' + dateParts[0];
                var date = new Date(formattedDate);
                var dat = format(date, 'yyyy-MM-dd')

                var dateParts2 = res.data[i].enddate.split('-');
                var formattedDate2 = dateParts2[2] + '-' + dateParts2[1] + '-' + dateParts2[0];
                var date2 = new Date(formattedDate2);
                var dat2 = format(date2, 'yyyy-MM-dd')
                if (dat <= this.futureDate && res.data[i].ispaid === 0 && res.data[i].paymentmethod != 4) {
                    if (dat2 >= this.todayDate && dat2 <= this.futureDate) {
                        console.log(dat2)
                    } else {
                        this.table[j] = res.data[i]
                        j++
                    }
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

        deletecus(id) {
            if (confirm('Είστε σίγουρος ότι θέλετε να γίνει διαγραφή;')) {
                axios.delete('/customer', {
                    data: { id: id }
                }).catch(err => console.log(err, id))
            }
        },


        inform(id,t) {
            var i =1
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

        pay(id, t) {
            const con = this.table.find(obj => obj.conid === id)
            const parts = con.paydate.split("-");
            var month = parseInt(parts[1].padStart(2, '0'), 10)
            var year = parseInt(parts[2].padStart(2, '0'), 10)
            var day = parseInt(parts[0].padStart(2, '0'), 10)
            var date = year + '-' + month + '-' + day
            var newDate = new Date(date);



            if (con.paymentmethod == 1) {
                newDate.setMonth(newDate.getMonth() + 1);
                newDate = format(newDate, 'yyyy-MM-dd')
                
            }else if (con.paymentmethod == 2) {
                newDate.setMonth(newDate.getMonth() + 3);
                newDate = format(newDate, 'yyyy-MM-dd')
                
            }else if (con.paymentmethod == 3) {
                newDate.setMonth(newDate.getMonth() + 6);
                newDate = format(newDate, 'yyyy-MM-dd')
                
            }

            if (confirm("Είστε σίγουρος ότι θέλετε να γίνει Ανανέωση;")){
                axios.patch(`/contracts/${id}`, {
                    paydate: newDate,
                }).then(this.table[t].paydate = newDate)
            }

            // const parts = this.todayDate.split("-");
            //     var month = parseInt(parts[1].padStart(2, '0'), 10)
            //     var year = parseInt(parts[0].padStart(2, '0'),10)
            //     var paydate = ''
            //     var ldm =''
            // if (con.paymentmethod == 1) {
            //     if(month == 12){
            //         year += 1
            //         month = 0
            //     }
            //     const firstDayOfNextMonth = new Date(year, month +1, 1);
            //     const lastDayOfMonth = new Date(firstDayOfNextMonth - 1);
            //     ldm =lastDayOfMonth.getDate()

            //     month += 1
            //     if(month<10){
            //         paydate = year + '-0' + month  + '-' + ldm
            //     }else{
            //         paydate = year + '-' + month  + '-' + ldm
            //     }

            // }else if(con.paymentmethod == 2){
            //     if(month +3 > 12){
            //         year += 1
            //         month = month + 3 -12
            //     }else{
            //         month += 3
            //     }
            //     const firstDayOfNextMonth = new Date(year, month, 1);
            //     const lastDayOfMonth = new Date(firstDayOfNextMonth - 1);
            //     ldm =lastDayOfMonth.getDate()


            //     if(month<10){
            //         paydate = year + '-0' + month  + '-' + ldm
            //     }else{
            //         paydate = year + '-' + month  + '-' + ldm
            //     }
            // }else if(con.paymentmethod == 3){
            //     if(month + 6 > 12){
            //         year += 1
            //         month = month + 6 -12
            //     }else{
            //         month += 6
            //     }
            //     const firstDayOfNextMonth = new Date(year, month, 1);
            //     const lastDayOfMonth = new Date(firstDayOfNextMonth - 1);
            //     ldm =lastDayOfMonth.getDate()


            //     if(month<10){
            //         paydate = year + '-0' + month  + '-' + ldm
            //     }else{
            //         paydate = year + '-' + month  + '-' + ldm
            //     }
            // }

            
        },


    },
    components: { CTableBody, CButton, CIcon, ConModal },
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

.top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 2%;

}
</style>