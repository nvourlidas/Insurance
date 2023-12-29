<template>
  <CRow>
    <CCol :xs="4">
      <CWidgetStatsC class="mb-3" :value="totalCus" inverse color="success" title="ΠΕΛΑΤΕΣ"
        @click="this.$router.push('/Customers')" style="cursor: pointer;">
        <template #icon>
          <CIcon icon="cil-people" height="36" />
        </template>
      </CWidgetStatsC>
    </CCol>
    <CCol :xs="4">
      <CWidgetStatsC class="mb-3" :value="totalCon" inverse color="info" title="Συμβολαια"
        @click="this.$router.push('/Contracts')" style="cursor: pointer;">
        <template #icon>
          <CIcon :icon="icon.cilClipboard" height="36"></CIcon>
        </template>
      </CWidgetStatsC>
    </CCol>
    <CCol :xs="4">
      <CWidgetStatsC class="mb-3" :value="ligoun" inverse color="danger" title="ληγουν σε 31 μερεσ"
        @click="this.$router.push('/Expire')" style="cursor: pointer;">
        <template #icon>
          <CIcon :icon="icon.cilBellExclamation" height="36" />
        </template>
      </CWidgetStatsC>
    </CCol>
    <CCol :xs="4">
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
      <CWidgetStatsF color="primary" :padding="false" title="Σνολο Πωλησεων (Μεικτα)" :value="smikta">
        <template #icon>
          <CIcon icon="cil-Euro" size="xxl" />
        </template>
      </CWidgetStatsF>
    </CCol>
    <CCol :xs="4">
      <CWidgetStatsF color="info" :padding="false" title="Σνολο Πωλησεων (Προμηθεια)" :value="sprom">
        <template #icon>
          <CIcon icon="cil-Euro" size="xxl" />
        </template>
      </CWidgetStatsF>
    </CCol>
    <CCol :xs="4">
      <CWidgetStatsF color="warning" :padding="false" title="Title" value="$1.999,50">
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
      smikta: 0,
      sprom: 0,
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
      axios.get('/contracts-insurance').then(res => {
        this.table2 = res.data
        this.totalCon = res.data.length
        var j = 0
        for (var i = 0; i < res.data.length; i++) {
          var dateParts = res.data[i].enddate.split('-');
          var formattedDate = dateParts[2] + '-' + dateParts[1] + '-' + dateParts[0];

          var date = new Date(formattedDate);
          var dat =format(date, 'yyyy-MM-dd')

          console.log(dat);
          if (dat >= this.todayDate && dat <= this.futureDate) {
            j += 1
          }
        }
        this.ligoun = j
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