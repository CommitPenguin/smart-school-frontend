<template>
  <v-card elevation="2">
    <v-card-title>Schedule Entries</v-card-title>
    <v-data-table :items="entries" :headers="headers" class="elevation-1">
      <template #item.group="{ item }">
        {{ item.group.name }}
      </template>

      <template #item.course="{ item }">
        {{ item.course.code }} - {{ item.course.name }}
      </template>

      <template #item.instructor="{ item }">
        {{ item.instructor.first_name }} {{ item.instructor.last_name }}
      </template>

      <template #item.room="{ item }">
        {{ item.room.name }}
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
const props = defineProps({
  entries: {
    type: Array,
    default: () => [],
  },
});

const headers = [
  { title: "Day", value: "day_of_week" },
  { title: "Start", value: "start_time" },
  { title: "End", value: "end_time" },
  { title: "Group", value: "group" },
  { title: "Course", value: "course" },
  { title: "Instructor", value: "instructor" },
  { title: "Room", value: "room" },
];
</script>
