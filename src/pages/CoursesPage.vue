<template>
  <h2 class="text-h5 mb-4">Courses</h2>

  <v-card class="pa-4 mb-6">
    <v-row dense>
      <v-col cols="12" md="4">
        <v-text-field label="Code" v-model="course.code" />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field label="Name" v-model="course.name" />
      </v-col>
      <v-col cols="12" md="2">
        <v-text-field label="Units" type="number" v-model="course.units" />
      </v-col>

      <v-col cols="12">
        <v-btn color="primary" @click="save">Add Course</v-btn>
      </v-col>
    </v-row>
  </v-card>

  <v-card>
    <v-data-table :items="courses" :headers="headers" />
  </v-card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../api/axios";

const course = ref({ code: "", name: "", units: 3 });
const courses = ref([]);

const headers = [
  { title: "ID", value: "id" },
  { title: "Code", value: "code" },
  { title: "Name", value: "name" },
  { title: "Units", value: "units" },
];

const load = async () => {
  courses.value = (await api.get("/courses")).data;
};

const save = async () => {
  await api.post("/courses", course.value);
  course.value = { code: "", name: "", units: 3 };
  load();
};

onMounted(load);
</script>
