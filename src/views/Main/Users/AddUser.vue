<template>
    <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
            <CRow class="justify-content-center">
                <CCol :md="9" :lg="7" :xl="6">
                    <CCard class="mx-4">
                        <CAlert color="success" :visible="live">Επιτυχημέμη Εισαγωγή Χρήστη</CAlert>
                        <CAlert color="danger" :visible="live2">Αποτυχία Εισαγωγής Χρήστη. Δοκιμάστε Ξανά</CAlert>
                        <CCardBody class="p-4">
                            <CForm @submit.prevent="Add">
                                <h1>Νέος Χρήστης</h1>
                                <p class="text-medium-emphasis">Εισαγωγή Νέου Χρήστη</p>
                                <CInputGroup class="mb-3">
                                    <CInputGroupText>
                                        <CIcon icon="cil-user" />
                                    </CInputGroupText>
                                    <CFormInput placeholder="Username" autocomplete="username" v-model="username" />
                                </CInputGroup>
                                <CInputGroup class="mb-3">
                                    <CInputGroupText>
                                        <CIcon icon="cil-lock-locked" />
                                    </CInputGroupText>
                                    <CFormInput type="password" placeholder="Password" autocomplete="new-password"
                                        v-model="password" />
                                </CInputGroup>
                                <CInputGroup class="mb-3">
                                    <CInputGroupText>
                                        <CIcon icon="cil-user" />
                                    </CInputGroupText>
                                    <CFormInput placeholder="Όνομα" autocomplete="Όνομα" v-model="name" />
                                </CInputGroup>
                                <CInputGroup class="mb-3">
                                    <CInputGroupText>
                                        <CIcon icon="cil-user" />
                                    </CInputGroupText>
                                    <CFormInput placeholder="Επώνυμο" autocomplete="Επώνυμο" v-model="surname" />
                                </CInputGroup>
                                <CInputGroup class="mb-3">
                                    <CInputGroupText>@</CInputGroupText>
                                    <CFormInput placeholder="Email" autocomplete="email" v-model="email" />
                                </CInputGroup>


                                <div class="d-grid">
                                    <CButton type="submit" color="success">Εισαγωγή Χρήστη</CButton>
                                </div>
                            </CForm>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </CContainer>
    </div>
</template>
  
<script>
import axios from 'axios'
export default {
    name: 'Register',

    data() {
        return {
            username: '',
            password: '',
            name: '',
            surname: '',
            email: '',
            live: false,
            live2: false,
        }
    },

    methods: {
        Add() {
            if (confirm("Είστε σίγουρος ότι θέλετε να γίνει Αποστολή;")) {
                axios.post('/users', {
                    name: this.name,
                    surname: this.surname,
                    username: this.username,
                    passwoed: this.password,
                    email: this.email
                }).then(this.live = true).catch(err => { console.log(err), this.live2 = true })

                this.username = ''
                this.password = ''
                this.name = ''
                this.surname = ''
                this.email = ''

            }

            setTimeout(() => {
                this.live = false;
                this.live2 = false
            }, 3000);
        }
    }
}
</script>
  