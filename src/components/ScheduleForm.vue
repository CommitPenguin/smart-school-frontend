<template>
  <v-card class="pa-4" elevation="2">
    <v-row dense>
      <!-- Group -->
      <v-col cols="12" md="4">
        <v-select
          v-model="form.group_id"
          :items="groups"
          item-title="name"
          item-value="id"
          label="Group"
          @update:model-value="onGroupOrCourseChange"
        />
      </v-col>

      <!-- Course -->
      <v-col cols="12" md="4">
        <v-select
          v-model="form.course_id"
          :items="courses"
          item-title="code"
          item-value="id"
          label="Course"
          @update:model-value="onGroupOrCourseChange"
        />
      </v-col>

      <!-- Instructor -->
      <v-col cols="12" md="4">
        <v-select
          v-model="form.instructor_id"
          :items="instructors"
          :item-title="instructorLabel"
          item-value="id"
          :label="instructorLabelText"
          :disabled="instructorLocked"
        />
      </v-col>

      <!-- Room -->
      <v-col cols="12" md="4">
        <v-select
          v-model="form.room_id"
          :items="rooms"
          item-title="name"
          item-value="id"
          label="Room"
        />
      </v-col>

      <!-- Day -->
      <v-col cols="12" md="4">
        <v-select
          v-model="form.day_of_week"
          :items="daysOfWeek"
          label="Day of Week"
        />
      </v-col>

      <!-- Time -->
      <v-col cols="6" md="2">
        <v-text-field
          v-model="form.start_time"
          label="Start Time (HH:MM)"
          placeholder="09:00"
        />
      </v-col>

      <v-col cols="6" md="2">
        <v-text-field
          v-model="form.end_time"
          label="End Time (HH:MM)"
          placeholder="10:00"
        />
      </v-col>

      <v-col cols="12">
        <v-btn :loading="loading" color="primary" @click="submit">
          Create Schedule Entry
        </v-btn>
        <span v-if="error" class="red--text ms-4">{{ error }}</span>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";

const emit = defineEmits(["created"]);

const api = axios.create({
  baseURL: "http://localhost:8000/api", // adjust
});

const groups = ref([]);
const courses = ref([]);
const instructors = ref([]);
const rooms = ref([]);

const instructorLocked = ref(false);
const loading = ref(false);
const error = ref("");

const form = ref({
  group_id: null,
  course_id: null,
  instructor_id: null,
  room_id: null,
  day_of_week: "Monday",
  start_time: "",
  end_time: "",
});

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const loadLookups = async () => {
  const [g, c, i, r] = await Promise.all([
    api.get("/groups"),
    api.get("/courses"),
    api.get("/instructors"),
    api.get("/rooms"),
  ]);

  groups.value = g.data;
  courses.value = c.data;
  instructors.value = i.data;
  rooms.value = r.data;
};

const onGroupOrCourseChange = async () => {
  error.value = "";
  instructorLocked.value = false;

  if (!form.value.group_id || !form.value.course_id) {
    form.value.instructor_id = null;
    return;
  }

  try {
    const res = await api.get("/instructor-lock", {
      params: {
        group_id: form.value.group_id,
        course_id: form.value.course_id,
      },
    });

    if (res.data.locked) {
      instructorLocked.value = true;
      form.value.instructor_id = res.data.instructor.id;
    } else {
      instructorLocked.value = false;
      form.value.instructor_id = null;
    }
  } catch (e) {
    console.error(e);
  }
};

const submit = async () => {
  error.value = "";
  loading.value = true;

  try {
    const res = await api.post("/schedule", form.value);
    emit("created", res.data);

    // reset times only
    form.value.start_time = "";
    form.value.end_time = "";
  } catch (e) {
    if (e.response && e.response.data && e.response.data.message) {
      error.value = e.response.data.message;
    } else {
      error.value = "Failed to create schedule.";
    }
  } finally {
    loading.value = false;
  }
};

const instructorLabel = (item) => {
  if (!item) return "";
  return `${item.first_name} ${item.last_name}`;
};

const instructorLabelText = computed(() =>
  instructorLocked.value ? "Instructor (locked)" : "Instructor"
);

onMounted(loadLookups);
</script>
