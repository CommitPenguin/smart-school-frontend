<template>
  <v-card class="pa-4">
    <v-row dense>
      <v-col cols="12" md="4">
        <v-select
          label="Group"
          v-model="form.group_id"
          :items="groups"
          item-title="name"
          item-value="id"
          @update:model-value="checkLock"
        />
      </v-col>

      <v-col cols="12" md="4">
        <v-select
          label="Course"
          v-model="form.course_id"
          :items="courses"
          item-title="code"
          item-value="id"
          @update:model-value="checkLock"
        />
      </v-col>

      <v-col cols="12" md="4">
        <v-select
          label="Instructor"
          v-model="form.instructor_id"
          :items="instructors"
          :disabled="locked"
          item-title="full_name"
          item-value="id"
        />
      </v-col>

      <v-col cols="12" md="4">
        <v-select
          label="Room"
          v-model="form.room_id"
          :items="rooms"
          item-title="name"
          item-value="id"
        />
      </v-col>

      <v-col cols="6" md="3">
        <v-select label="Day" v-model="form.day" :items="days" />
      </v-col>

      <v-col cols="6" md="2">
        <v-text-field type="time" v-model="form.start" label="Start" />
      </v-col>

      <v-col cols="6" md="2">
        <v-text-field type="time" v-model="form.end" label="End" />
      </v-col>

      <v-col cols="12">
        <v-btn color="primary" @click="save" :loading="loading">
          Save
        </v-btn>
        <span class="text-red ms-2">{{ error }}</span>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../api/axios";

const emit = defineEmits(["saved"]);

const groups = ref([]);
const courses = ref([]);
const instructors = ref([]);
const rooms = ref([]);
const locked = ref(false);

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const form = ref({
  group_id: null,
  course_id: null,
  instructor_id: null,
  room_id: null,
  day: "Monday",
  start: "",
  end: "",
});

const loadLookups = async () => {
  groups.value = (await api.get("/groups")).data;
  courses.value = (await api.get("/courses")).data;
  instructors.value = (await api.get("/instructors")).data;
  rooms.value = (await api.get("/rooms")).data;
};

onMounted(loadLookups);

// check instructor lock
const checkLock = async () => {
  if (!form.value.group_id || !form.value.course_id) return;

  const res = await api.get("/instructor-lock", {
    params: {
      group_id: form.value.group_id,
      course_id: form.value.course_id,
    },
  });

  if (res.data.locked) {
    locked.value = true;
    form.value.instructor_id = res.data.instructor.id;
  } else {
    locked.value = false;
    form.value.instructor_id = null;
  }
};

const loading = ref(false);
const error = ref("");

const save = async () => {
  loading.value = true;
  error.value = "";

  try {
    await api.post("/schedule", {
      group_id: form.value.group_id,
      course_id: form.value.course_id,
      instructor_id: form.value.instructor_id,
      room_id: form.value.room_id,
      day_of_week: form.value.day,
      start_time: form.value.start,
      end_time: form.value.end,
    });

    emit("saved");
    form.value.start = "";
    form.value.end = "";
  } catch (e) {
    error.value = e.response?.data?.message || "Error saving schedule";
  }

  loading.value = false;
};
</script>
