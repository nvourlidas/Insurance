<!-- TodoCalendar.vue -->
<template>
  <div class="calendar">
    <div class="header">
      <button @click="prevMonth">&lt;</button>
      <h2>{{ currentMonth.format('MMMM YYYY') }}</h2>
      <button @click="nextMonth">&gt;</button>
    </div>
    <table>
      <thead>
        <tr>
          <th v-for="day in days" :key="day">{{ day }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="week in calendar" :key="week">
          <td v-for="day in week" :key="day.date.format('YYYY-MM-DD')" @click="selectDate(day)">
            {{ day.date.format('D') }}
            <ul v-if="day.tasks.length">
              <li v-for="task in day.tasks" :key="task"><b>{{ task }}</b></li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import moment from 'moment';
export default {
  data() {
    return {
      currentMonth: moment(),
      days: ['Δευ', 'Τρι', 'Τετ', 'Πεμ', 'Παρ', 'Σαβ', 'Κυρ'],
      calendar: [],
      tasks: [
        { date: '2024-01-10', task: 'Task 1' },
        { date: '2024-01-15', task: 'Task 2' },
        // Add more tasks as needed
      ],
    };
  },
  mounted() {
    this.generateCalendar();
  },
  methods: {
    generateCalendar() {
      this.calendar = []; // Clear previous data

      // Determine the first day of the month
      const firstDayOfMonth = this.currentMonth.clone().startOf('month');

      // Determine the total number of days in the month
      const daysInMonth = this.currentMonth.daysInMonth();

      // Determine the weekday of the first day (0 for Sunday, 1 for Monday, etc.)
      // const startDayOfWeek = firstDayOfMonth.day();

      // Create an array representing the calendar structure
      let calendarRow = [];

      // Add empty cells for days before the first day of the month
      // for (let i = 0; i < startDayOfWeek; i++) {
      //   calendarRow.push({
      //     date: null,
      //     tasks: [],
      //   });
      // }

      // Continue with the logic to populate the rest of the calendar
      for (let i = 0; i < daysInMonth; i++) {
        const currentDay = firstDayOfMonth.clone().add(i, 'days');
        const dayTasks = this.getTasksForDate(currentDay);

        calendarRow.push({
          date: currentDay,
          tasks: dayTasks,
        });

        // Start a new row for each week (Sunday to Saturday)
        if (currentDay.day() === 6 || i === daysInMonth - 1) {
          this.calendar.push(calendarRow);
          calendarRow = [];
        }
      }
    },

    getTasksForDate(date) {
      // Return tasks for the given date
      return this.tasks
        .filter(task => moment(task.date).isSame(date, 'day'))
        .map(task => task.task);
    },

    nextMonth() {
      this.currentMonth.add(1, 'month');
      this.generateCalendar();
    },
    prevMonth() {
      this.currentMonth.subtract(1, 'month');
      this.generateCalendar();
    },
    selectDate(day) {
      console.log(day.date.format('YYYY-MM-DD'))
    },
  },
};
</script>

<style scoped>
.calendar {
  max-width: 100%;
  margin: auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
  
}

th,
td {
  padding: 30px;
  border: 1px solid #ddd;
  text-align: center;
  background-color: rgb(179, 207, 229);
}

td:hover {
  background-color: #f5f5f5;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  margin-bottom: 5px;
}
</style>
