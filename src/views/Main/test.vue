<template>
    <div>
        {{ table }} <br>
        


    </div>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            todayDate: new Date().toISOString().replace(/T.*$/, ''),
            futureDate: null,
            futureDate2: null,
            table2: [],
            table: [],
            enddates: [],
            paydates: [],
            ligoun: 0,
            topay: 0,
            smikta: 0,
            sprom: 0,
            stm: 0,
        }
    },

    created() {
        const todayDate = new Date(this.todayDate);
        const nextMonthDate = new Date(todayDate);
        nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
        this.futureDate = nextMonthDate.toISOString().replace(/T.*$/, '');

        axios.get('/contracts-customer').then(res => {
            this.table2 = res.data
            const totalCon = res.data.length


            var j=0;
            for (var i = 0; i < totalCon; i++) {
                const endDateStr = this.table2[i].enddate;
                const payDateStr = this.table2[i].paydate;

                if (endDateStr) { // Check if enddate is not null or undefined
                    const endDate = new Date(endDateStr);

                    if (!isNaN(endDate)) { // Check if the date is valid
                        this.enddates[i] = endDate.toISOString().replace(/T.*$/, '');
                        if (this.enddates[i] > this.todayDate && this.enddates[i] < this.futureDate) {
                            this.table[j] = res.data[i]
                            j++
                        }
                    } else {
                        console.error(`Invalid date value at index ${i}: ${endDateStr}`);
                    }
                } else {
                    console.warn(`Skipping null or undefined enddate at index ${i}`);
                }

                if (endDateStr) { // Check if enddate is not null or undefined

                    const payDate = new Date(payDateStr);

                    if (!isNaN(payDate)) { // Check if the date is valid
                        this.paydates[i] = payDate.toISOString().replace(/T.*$/, '');
                        if (this.paydates[i] > this.todayDate && this.paydates[i] < this.futureDate) {
                            this.topay += 1
                        }
                    } else {
                        console.error(`Invalid date value at index ${i}: ${endDateStr}`);
                    }
                } else {
                    console.warn(`Skipping null or undefined enddate at index ${i}`);
                }
            }


        })

    }
}
</script>


for (var i = 0; i < res.data.length; i++) {
    var dateParts = res.data[i].paydate.split('-');
    var formattedDate = dateParts[2] + '-' + dateParts[1] + '-' + dateParts[0];
    var date = new Date(formattedDate);
    var dat = format(date, 'yyyy-MM-dd')

    var dateParts2 = res.data[i].enddate.split('-');
    var formattedDate2 = dateParts2[2] + '-' + dateParts2[1] + '-' + dateParts2[0];
    var date2 = new Date(formattedDate2);
    var dat2 = format(date2, 'yyyy-MM-dd')
    if (dat <= this.futureDate && res.data[i].ispaid === 0 && res.data[i].paymentmethod != 4) {
        if (dat2 <= this.futureDate) {
            console.log(dat2)
        } else {
            this.table[j] = res.data[i]
            j++
        }
    }

}