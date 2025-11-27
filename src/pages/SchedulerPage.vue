<template>
  <div>
    <h1 class="text-h5 mb-4">Scheduler</h1>

    <schedule-form @saved="loadSchedule" />

    <v-divider class="my-6" />

    <schedule-list :entries="schedule" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../api/axios";

import ScheduleForm from "../components/ScheduleForm.vue";
import ScheduleList from "../components/ScheduleList.vue";

const schedule = ref([]);

const loadSchedule = async () => {
  const res = await api.get("/schedule");
  schedule.value = res.data;
};

onMounted(loadSchedule);
</script>
