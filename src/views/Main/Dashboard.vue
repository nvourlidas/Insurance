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
  <FullCalendar style="margin-top: 50px;"></FullCalendar>
</template>

<script>
import axios from 'axios';
//import { addDays, format } from 'date-fns';
import { CIcon } from '@coreui/icons-vue';
import * as icon from '@coreui/icons';
// import Calendar from './Calendar.vue'
import FullCalendar from './FullCalendar.vue';


export default {
  components: {
    CIcon,
    FullCalendar,

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
      ligoun: 0,
      topay: 0,
      today: new Date().toISOString().replace(/T.*$/, ''),
      futureDate: null,
      smikta: 0,
      sprom: 0,
      stm: 0,
      enddates: [],
      paydates: [],

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
      const todayDate = new Date(this.today);
      const nextMonthDate = new Date(todayDate);
      nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
      this.futureDate = nextMonthDate.toISOString().replace(/T.*$/, '');

      axios.get('/contracts-customer').then(res => {
        this.table2 = res.data
        this.totalCon = res.data.length


        for (var i = 0; i < this.totalCon; i++) {
          const endDateStr = this.table2[i].enddate;
          const payDateStr = this.table2[i].paydate;

          if (endDateStr) { // Check if enddate is not null or undefined
            const endDate = new Date(endDateStr);

            if (!isNaN(endDate)) { // Check if the date is valid
              this.enddates[i] = endDate.toISOString().replace(/T.*$/, '');
              if (this.enddates[i] < this.futureDate) {
                this.ligoun += 1
              }
            } else {
              console.error(`Invalid date value at index ${i}: ${endDateStr}`);
            }
          } else {
            console.warn(`Skipping null or undefined enddate at index ${i}`);
          }

          if (payDateStr) { // Check if enddate is not null or undefined

            const payDate = new Date(payDateStr);

            if (!isNaN(payDate)) { // Check if the date is valid
              this.paydates[i] = payDate.toISOString().replace(/T.*$/, '');
              if (this.paydates[i] < this.futureDate && res.data[i].ispaid === 0 && res.data[i].paymentmethod != 4) {
                this.topay += 1
              }
            } else {
              console.error(`Invalid date value at index ${i}: ${endDateStr}`);
            }
          } else {
            console.warn(`Skipping null or undefined enddate at index ${i}`);
          }
        }


        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed, so we add 1

        
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