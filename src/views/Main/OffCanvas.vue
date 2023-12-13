<template>
    <COffcanvasBody>
        <CTable striped bordered>
            <CTableHead>
                <CTableRow style="text-align: center;">
                    <CTableHeaderCell scope="col">Αριθμός Συμβολαίου</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Ασφαλιστική</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Κλάδος Ασφάλησης</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Ημερομηνία 'Εναρξης</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Ημερομηνία Λήξης</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Καθαρά</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Μεικτά</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Προμήθεια</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Μέθοδος Πληρωμής</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Ομαδικό</CTableHeaderCell>
                </CTableRow>
            </CTableHead>
            <CTableBody>
                <CTableRow style="text-align: center;">
                    <CTableDataCell>{{ body.conumber }}</CTableDataCell>
                    <CTableDataCell>{{ body.iname }}</CTableDataCell>
                    <CTableDataCell>{{ body.bname }} <p v-if="body.pinakida"> Αριθμός Κυκλοφορίας: {{ body.pinakida }}</p></CTableDataCell>
                    <CTableDataCell>{{ body.startdate }}</CTableDataCell>
                    <CTableDataCell>{{ body.enddate }}</CTableDataCell>
                    <CTableDataCell>{{ body.clear }}</CTableDataCell>
                    <CTableDataCell>{{ body.mikta }}</CTableDataCell>
                    <CTableDataCell>{{ body.promithia }}</CTableDataCell>
                    <CTableDataCell v-if="body.paymentmethod == 1">Μηνιαία</CTableDataCell>
                    <CTableDataCell v-if="body.paymentmethod == 2">3μηνη</CTableDataCell>
                    <CTableDataCell v-if="body.paymentmethod == 3">6μηνη</CTableDataCell>
                    <CTableDataCell v-if="body.paymentmethod == 4">Ετήσια</CTableDataCell>
                    <CTableDataCell v-if="body.paymentmethod == 5">'Εως Λήξη Συμβολαίου</CTableDataCell>
                    <CTableDataCell v-if="body.omadiko == 1">NAI</CTableDataCell>
                    <CTableDataCell v-if="body.omadiko == 2">ΟΧΙ</CTableDataCell>
                </CTableRow>
            </CTableBody>
        </CTable>
        <h3>Καλύψεις</h3>
        <CListGroup>
            <CListGroupItem>ΠΡΟΣΚΡΟΥΣΗ ΟΧΗΜΑΤΟΣ</CListGroupItem>
            <CListGroupItem>ΚΛΟΠΗ</CListGroupItem>
            <CListGroupItem>ΥΛΙΚΕΣ ΖΗΜΙΕΣ</CListGroupItem>
            <CListGroupItem>ΕΠΙΔΟΜΑΤΑ ΥΓΕΙΑΣ</CListGroupItem>
            <CListGroupItem>ΝΟΣΗΛΕΙΑ ΜΟΝΟ ΑΠΟ ΑΤΥΧΗΜΑ</CListGroupItem>
        </CListGroup>
    </COffcanvasBody>
</template>

<script>
export default {
    props: {
        body: Object
    },
}
</script>

<style scoped></style>