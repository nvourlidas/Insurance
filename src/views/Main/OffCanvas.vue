<template>
    <COffcanvasBody>
        <div class="main">
            <div class="item1">
                <h3 style="margin-bottom: 2%;">Λεπτομέριες Συμβολαίου</h3>
                <p><b>Έναρξη:</b> {{ body.startdate }}</p>
                <p><b>Λήξη:</b> {{ body.enddate }}</p>
                <p><b>Καθαρά:</b> {{ body.clear }} €</p>
                <p><b>Μεικτά:</b> {{ body.mikta }} €</p>
                <p><b>Προμήθεια:</b> {{ body.promithia }} €</p>
            </div>
            <div class="item2">
                <h3>Καλύψεις Συμβολαίου</h3>
            </div>
            <div class="item3">
                <h3>Ζημίες</h3>
            </div>
        </div>
    </COffcanvasBody>
</template>

<script>
export default {
    props: {
        body: Object
    },
}
</script>

<style scoped>

.main{
    display: flex;
    justify-content: center;
    text-align: center;
    align-items: center;
}

.item1{
    flex: 1;
}
.item2{
    flex: 1;
}
.item3{
    flex: 1;
}
</style>