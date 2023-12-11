<template>
    <CRow>
        <CCol :xs="4">
            <CWidgetStatsC class="mb-3" :value="totalCus" inverse color="success" title="ΠΕΛΑΤΕΣ" @click="this.$router.push('/Customers')" style="cursor: pointer;">
                <template #icon>
                    <CIcon icon="cil-people" height="36" />
                </template>
            </CWidgetStatsC>
        </CCol>
        <CCol :xs="4">
            <CWidgetStatsC class="mb-3" :value="totalCon" inverse color="info" title="Συμβολαια">
                <template #icon>
                    <CIcon :icon="icon.cilClipboard" height="36"></CIcon>
                </template>
            </CWidgetStatsC>
        </CCol>
        <CCol :xs="4">
            <CWidgetStatsC class="mb-3" :value="ligoun" inverse color="danger" title="ληγουν σε 31 μερεσ" @click="this.$router.push('/AddCustomer')" style="cursor: pointer;">
                <template #icon>
                    <CIcon :icon="icon.cilBellExclamation"  height="36" />
                </template>
            </CWidgetStatsC>
        </CCol>
    </CRow>
</template>

<script>
import axios from 'axios';
import { addDays, format } from 'date-fns';
import { CIcon } from '@coreui/icons-vue';
import * as icon from '@coreui/icons';

export default {
    components:{
        CIcon
    },
    setup() {
    return {
      icon,
    }
  },
    data() {
        return {
            table: [],
            totalCus: '',
            table2: [],
            totalCon: '',
            ligoun: '',
            todayDate: new Date(),
            futureDate: null,
        }
    },

    created() {
        this.getCus()
        this.getCon()
        
    },

    methods: {
        getCus() {
            axios.get('/customer').then(res => {
                this.table = res.data
                this.totalCus = this.table.length
            })
        },
        getCon() {
            this.futureDate = addDays(this.todayDate, 31);
            this.futureDate = format(this.futureDate, 'dd-MM-yyyy');
            axios.get('/contracts-insurance').then(res => {
                this.table2 = res.data
                this.totalCon = res.data.length
                // this.ligoun=0
                // for (var i = 0; i < res.data.length; i++) {
                //     var date = res.data[i].enddate
                //     if (date >= this.futureDate) {
                //         this.ligoun += 1
                //     }
                //     console.log(this.futureDate)
                // }
                var expires = res.data.filter(item => item.enddate <= this.futureDate);
                this.ligoun = expires.length
                console.log(expires)
            })
            
        },
    }
}
</script>