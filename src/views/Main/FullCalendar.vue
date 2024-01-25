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
import axios from 'axios';



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
                events: this.fetchEvents,
                eventClick: this.handleEventClick,
                eventsSet: this.handleEvents,
                eventResize: this.handleEventResize,
                eventDrop: this.handleEventDrop,
                locals: [allLocales],
                locale: 'el'
            }
        }
    },

    methods: {
        async fetchEvents() {
            try {
                const res = await axios.get('/calendar');
                var events = []

                for (var i = 0; i < res.data.length; i++) {

                    const newallday = res.data[i].allDay == 1 ? false : true;
                    events[i] = {
                        id: res.data[i].id,
                        title: res.data[i].title,
                        start: res.data[i].start,
                        end: res.data[i].end,
                        allDay: newallday
                    }

                }
                return events;
            } catch (error) {
                console.error('Error fetching events:', error);
                return [];
            }
        },

        handleDateSelect(selectInfo) {
            let title = prompt('Επιλέξτε έναν Τίτλο για το Event σας!')
            let calendarApi = selectInfo.view.calendar

            calendarApi.unselect() // clear date selection

            if (title) {
                const newEvent = {
                    //id: createEventId(),
                    title,
                    start: selectInfo.startStr,
                    end: selectInfo.endStr,
                    allDay: selectInfo.allDay
                }
                this.createEventOnServer(newEvent);
                calendarApi.addEvent(newEvent);
            }



            console.log(calendarApi)
        },

        createEventOnServer(newEvent) {
            axios.post('/calendar', newEvent).catch(err => console.log(err))
        },

        handleEventClick(clickInfo) {
            if (confirm(`Είστε σίγουρος ότι θέλετε να διαγράψετε αυτό το Event '${clickInfo.event.title}'`)) {
                clickInfo.event.remove()
                axios.delete('/calendar', {
                    data: { id: clickInfo.event.id }
                }).catch(err => console.log(err, clickInfo.event.id))
            }

            console.log(clickInfo.event.id)
        },

        handleEvents(events) {
            this.currentEvents = events
        },

        handleEventResize(resizeInfo) {
            const updatedEvent = {
                id: resizeInfo.event.id,
                end: resizeInfo.event.endStr,
            };
            this.updateEventOnServer(updatedEvent);
        },

        handleEventDrop(dropInfo) {
            const updatedEvent = {
                id: dropInfo.event.id,
                start: dropInfo.event.startStr,
                end: dropInfo.event.endStr,
            };

            // Send the updated event data to the server using Axios
            this.updateEventOnServer(updatedEvent);
        },

        async updateEventOnServer(updatedEvent) {
            console.log(updatedEvent)
            try {
                await axios.patch(`/calendar/${updatedEvent.id}`, {
                    start: updatedEvent.end,
                    end: updatedEvent.end
                });
                console.log('Event updated successfully on the server');
            } catch (error) {
                console.error('Error updating event on the server:', error);
            }
        },
    },


    components: { FullCalendar }
}
</script>

<style>
.fc {
    /* the calendar root */

    margin: 0 auto;
    background-color: white;
    box-shadow: 0 500px 20px -5px rgba(0, 0, 0, 0.125);
}
</style>