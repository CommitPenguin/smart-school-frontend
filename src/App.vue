<template>
  <v-app>
    <v-main class="pa-4">
      <v-container>
        <h1 class="mb-6">Time Scheduler</h1>
        <schedule-form @created="fetchSchedule" />
        <v-divider class="my-6" />
        <schedule-list :entries="schedule" />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import ScheduleForm from "./components/ScheduleForm.vue";
import ScheduleList from "./components/ScheduleList.vue";

const schedule = ref([]);

const api = axios.create({
  baseURL: "http://localhost:8000/api", // adjust if needed
});

const fetchSchedule = async () => {
  const res = await api.get("/schedule");
  schedule.value = res.data;
};

onMounted(() => {
  fetchSchedule();
});
</script>
