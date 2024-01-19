<template>
  <CRow>
    <CCol :xs="3">
      <CWidgetStatsC class="mb-3" :value="totalCus" inverse color="success" title="ΠΕΛΑΤΕΣ"
        @click="this.$router.push('/Customers')" style="cursor: pointer;">
        <template #icon>
          <CIcon icon="cil-people" height="36" />
        </template>
      </CWidgetStatsC>
    </CCol>
    <CCol :xs="3">
      <CWidgetStatsC class="mb-3" :value="totalCon" inverse color="info" title="Συμβολαια"
        @click="this.$router.push('/Contracts')" style="cursor: pointer;">
        <template #icon>
          <CIcon :icon="icon.cilClipboard" height="36"></CIcon>
        </template>
      </CWidgetStatsC>
    </CCol>
    <CCol :xs="3">
      <CWidgetStatsC class="mb-3" :value="topay" inverse color="warning" title="Προσ πληρωμη"
        @click="this.$router.push('/ToPay')" style="cursor: pointer;">
        <template #icon>
          <CIcon :icon="icon.cilAlarm" height="36" />
        </template>
      </CWidgetStatsC>
    </CCol>
    <CCol :xs="3">
      <CWidgetStatsC class="mb-3" :value="ligoun" inverse color="danger" title="ληγουν σε 31 μερεσ"
        @click="this.$router.push('/Expire')" style="cursor: pointer;">
        <template #icon>
          <CIcon :icon="icon.cilBellExclamation" height="36" />
        </template>
      </CWidgetStatsC>
    </CCol>
  </CRow>
  <CRow style="margin-top: 10%;">
    <CCol :xs="4">
      <CWidgetStatsF color="primary" :padding="false" title="Σύνολο Πωλησεων (Μεικτα)" :value="smikta">
        <template #icon>
          <CIcon icon="cil-Euro" size="xxl" />
        </template>
      </CWidgetStatsF>
    </CCol>
    <CCol :xs="4">
      <CWidgetStatsF color="info" :padding="false" title="Σύνολο Πωλησεων (Προμηθεια)" :value="sprom">
        <template #icon>
          <CIcon icon="cil-Euro" size="xxl" />
        </template>
      </CWidgetStatsF>
    </CCol>
    <CCol :xs="4">
      <CWidgetStatsF color="warning" :padding="false" title="Πωλησεις Τρεχων Μηνας (Μεικτα)" :value="stm">
        <template #icon>
          <CIcon icon="cil-Euro" size="xxl" />
        </template>
      </CWidgetStatsF>
    </CCol>
  </CRow>
  
</template>

<script>
import axios from 'axios';
import { addDays, format } from 'date-fns';
import { CIcon } from '@coreui/icons-vue';
import * as icon from '@coreui/icons';


export default {
  components: {
    CIcon,
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
      ligoun: '0',
      topay: '0',
      todayDate: new Date(),
      futureDate: null,
      smikta: 0,
      sprom: 0,
      stm: 0,

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
      this.futureDate = format(this.futureDate, 'yyyy-MM-dd');
      this.todayDate = format(this.todayDate, 'yyyy-MM-dd')
      axios.get('/contracts-customer').then(res => {
        this.table2 = res.data
        this.totalCon = res.data.length
        var j = 0
        var t = 0
        for (var i = 0; i < res.data.length; i++) {
          var dateParts = res.data[i].enddate.split('-');
          var formattedDate = dateParts[2] + '-' + dateParts[1] + '-' + dateParts[0];

          var date = new Date(formattedDate);
          var dat = format(date, 'yyyy-MM-dd')


          if (dat >= this.todayDate && dat <= this.futureDate) {
            j += 1

          }

          if (j > 0) {
            this.ligoun = j
          }
          var dateParts2 = res.data[i].paydate.split('-');
          var formattedDate2 = dateParts2[2] + '-' + dateParts2[1] + '-' + dateParts2[0];

          var date2 = new Date(formattedDate2);
          var dat2 = format(date2, 'yyyy-MM-dd')

          if (dat2 >= this.todayDate && dat2 <= this.futureDate && res.data[i].ispaid == 0 && res.data[i].paymentmethod != 4) {
            if (dat >= this.todayDate && dat <= this.futureDate) {
              console.log(dat2)
            } else {
              t += 1
            }
          }
          if (t > 0) {
            this.topay = t
          }



        }

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed, so we add 1

        console.log(currentMonth)
        var filteredArray = this.table2.filter(obj => {
          const [year, month, day] = obj.startdate.split('-');
          const objDate = new Date(day, month - 1, year);
          

          // Check if the month matches the current month
          return objDate.getMonth() + 1 === currentMonth;
        });

        var numb2 = 0
        for (i = 0; i < filteredArray.length; i++) {
          numb2 += parseInt(filteredArray[i].mikta)
          this.stm = numb2.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        }

        var numb = 0
        var numbe = 0
        for (i = 0; i < res.data.length; i++) {
          numbe += parseInt(res.data[i].mikta)
          numb += parseFloat(res.data[i].promithia)
          this.sprom = numb.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          this.smikta = numbe.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        }
      })

    },
  }
}
</script>