<template>
  <CHeader position="sticky" class="mb-4" >
    <CContainer fluid class="main">
      <CHeaderToggler class="ps-1" @click="$store.commit('toggleSidebar')">
        <CIcon icon="cil-menu" size="lg" />
      </CHeaderToggler>
      <CButton class="but" color="success" variant="outline" @click="goTo(1)"><b><CIcon :icon="icon.cilUserPlus" size="xl"></CIcon> Νέος Πελάτης</b> </CButton>
      <CButton class="but" color="info" variant="outline" @click="goTo(2)"><b><CIcon :icon="icon.cilClipboard" size="xl"></CIcon> Νέο Συμβόλαιο </b></CButton>
    </CContainer>
  </CHeader>
</template>

<script>
import { logo } from '@/assets/brand/logo'
import { CIcon } from '@coreui/icons-vue';
import * as icon from '@coreui/icons';
export default {
  name: 'AppHeader',
  components: {
    CIcon
  },
  setup() {
    return {
      logo,
      icon,
    }
  },

  methods:{
    goTo(n){
      if(n==1){
        this.$router.push('/AddCustomer');
      }else{
        this.$router.push('/AddContract');
      }
    }
  }
}
</script>

<style scoped>

.main{
  display: flex;
  align-items: center;
  justify-content: start;
}

.but{
  
  margin-right: 1%;
}
</style>