<template>
  <CHeader position="sticky" class="mb-4" >
    <CContainer fluid class="main">
      <CHeaderToggler class="ps-1" @click="$store.commit('toggleSidebar')">
        <CIcon icon="cil-menu" size="lg" />
      </CHeaderToggler>
     <div style="flex:1">
      <CButton class="but" color="success" variant="outline" @click="goTo(1)"><b><CIcon :icon="icon.cilUserPlus" size="xl"></CIcon> Νέος Πελάτης</b> </CButton>
      <CButton class="but" color="info" variant="outline" @click="goTo(2)"><b><CIcon :icon="icon.cilClipboard" size="xl"></CIcon> Νέο Συμβόλαιο </b></CButton>
    </div>
    
      <CButton class="but" color="danger" variant="outline" @click="logout()"><b><CIcon :icon="icon.cilAccountLogout" size="xl"></CIcon> Αποσύνδεση</b> </CButton>
    
    </CContainer>
    
  </CHeader>
</template>

<script>
import axios from 'axios';
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

  data() {
    return {
      token: localStorage.getItem('token'),
      user: [],
      userid: localStorage.getItem('userid'),
    }
  },

  created() {
    axios.post('https://app.tselebi.gr/InsuranceLogin/login/validate.php', { jwt: this.token })
      .then(resp => {
        if (resp.data.res != 1) {
          this.user = resp.data.user
          localStorage.setItem('userid', resp.data.user.userid)

        } else {
          this.$router.push('/pages/login')
        }
      })
      .catch(err => console.log(err));
    console.log(this.token)
  },

  methods:{
    goTo(n){
      if(n==1){
        this.$router.push('/AddCustomer');
      }else{
        this.$router.push('/AddContract');
      }
    },
    logout() {
          localStorage.removeItem('token');
          localStorage.removeItem('userid')
          this.$router.push('/pages/login');
          console.log(this.token)
    },
  }
}
</script>

<style scoped>

.main{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
}

.but{
  
  margin-right: 1%;
}
</style>