<template>
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      
      <CRow class="justify-content-center">
        
        <CCol :md="8">
          <CCardGroup>
            <CCard class="p-4">
              <CAlert color="danger" :visible="live">Τα στοιχεία είναι Λανθασμένα</CAlert>
              <CCardBody style="text-align: center; justify-content: center; align-items: center;">
                <CForm @submit.prevent="login">
                  <h1>Σύνδεση</h1>
                  <p class="text-medium-emphasis">Σύνδεση στον Λογαριασμό σας</p>
                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon icon="cil-user" />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Username"
                      autocomplete="username"
                      v-model="username"
                    />
                  </CInputGroup>
                  <CInputGroup class="mb-4">
                    <CInputGroupText>
                      <CIcon icon="cil-lock-locked" />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      autocomplete="current-password"
                      v-model="password"
                    />
                  </CInputGroup>
                  <CRow style="display: flex; justify-content: center;">
                    <CCol :xs="6">
                      <CButton type="submit" color="primary" class="px-5"> Login </CButton>
                    </CCol>
                    <!-- <CCol :xs="6" class="text-right">
                      <CButton color="link" class="px-0">
                        Forgot password?
                      </CButton>
                    </CCol> -->
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
            <!-- <CCard class="text-white bg-primary py-5" style="width: 44%">
              <CCardBody class="text-center">
                <div>
                  <h2>Sign up</h2>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </p>
                  <CButton color="light" variant="outline" class="mt-3">
                    Register Now!
                  </CButton>
                </div>
              </CCardBody>
            </CCard> -->
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Login',

  data() {
    return {
      username: '',
      password: '',
      userid: '',
      live: false,

    }
  },

  methods: {
    login() {
      axios.post('https://app.tselebi.gr/InsuranceLogin/login/login.php', { username: this.username, password: this.password })
        .then(resp => {
          if (resp.data.res == 1) {
            localStorage.setItem('token', resp.data.jwt);
            this.userid = resp.data.userid;
            this.$router.push('/dashboard')
          } else {
            this.live= true
          }
        })
        .catch(err => console.log(err));
    },
    validator(val) {
      return val ? val.length >= 1 : false
    },
  },
}

</script>
