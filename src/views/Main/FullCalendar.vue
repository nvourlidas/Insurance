<template>
    <FullCalendar :options="calendarOptions"> </FullCalendar>
</template>

<script>


// import { defineComponent } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import allLocales from '@fullcalendar/core/locales-all';



export default {
    data() {
        return {
            calendarOptions: {
                plugins: [
                    dayGridPlugin,
                    timeGridPlugin,
                    interactionPlugin,
                    
                ],
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                },
                buttonText: {
                    today: 'Σήμερα',
                    month: 'Μήνας',
                    week: 'Εβδομάδα',
                    day: 'Μέρα',
                    list: 'Λίστα'
                },
                selectable: true,
                editable: true,
                selectMirror: true,
                dayMaxEvents: true,
                select: this.handleDateSelect,
                eventClick: this.handleEventClick,
                eventsSet: this.handleEvents,
                locals: [allLocales],
                locale: 'el'
            }
        }
    },

    methods: {
        handleDateSelect(selectInfo) {
            let title = prompt('Επιλέξτε έναν Τίτλο για το Event σας!')
            let calendarApi = selectInfo.view.calendar

            calendarApi.unselect() // clear date selection

            if (title) {
                calendarApi.addEvent({
                    //id: createEventId(),
                    title,
                    start: selectInfo.startStr,
                    end: selectInfo.endStr,
                    allDay: selectInfo.allDay
                })
            }

            console.log(calendarApi.currentData.viewTitle)
        },

        handleEventClick(clickInfo) {
            if (confirm(`Είστε σίγουρος ότι θέλετε να διαγράψετε αυτό το Event '${clickInfo.event.title}'`)) {
                clickInfo.event.remove()
            }
        },

        handleEvents(events) {
            this.currentEvents = events
        },
    },


    components: { FullCalendar }
}
</script>

<style>
.fc { /* the calendar root */
  
  margin: 0 auto;
  background-color: white;
  box-shadow: 0 500px 20px -5px rgba(0, 0, 0, 0.125);
}
</style>