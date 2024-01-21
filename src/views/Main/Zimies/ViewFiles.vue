<template>
    <CModal>
        <CModalHeader>
            <CModalTitle>
                <h2>Προβολή Αρχείων</h2>
            </CModalTitle>
        </CModalHeader>
        <CModalBody>
            <CCard class="mt-3">
                <CCardBody class="files">
                    <div v-for="(entry, id) in files" :item="entry" :key="id" class="download">
                        <CButton @click="download(entry.id, entry.filename)"> <br>
                            <CIcon :icon="icon.cilCloudDownload" height="32"></CIcon> {{ entry.filename }}
                        </CButton>
                    </div>
                </CCardBody>
            </CCard>
        </CModalBody>
    </CModal>
</template>

<script>
import { CModal, CModalBody } from '@coreui/vue';
import * as icon from '@coreui/icons';
import axios from 'axios';

export default {
    props: {
        files: [],
    },

    data(){
        return {
            
        }
    },

    setup() {
        return {
            icon,
        }
    },

    methods: {
        download(id, name) {
            axios.get(`/download/${id}`, { responseType: 'blob' })
                .then(response => {
                    const contentDisposition = response.headers['content-disposition'];

                    let filename = name;

                    if (contentDisposition) {
                        const match = contentDisposition.match(/filename="(.+)"/);
                        if (match) {
                            filename = match[1];
                        }
                    }

                    const blob = new Blob([response.data]);
                    const link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = filename;
                    link.click();
                })
                .catch(error => {
                    console.error(error);
                });
        }
    },
    components: { CModal, CModalBody }
}
</script>


<style scoped>

.files {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 20px;
}

.download {
    border: 1px solid;
    border-radius: 20px;
    text-align: center;
}
</style>