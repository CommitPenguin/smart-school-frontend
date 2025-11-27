<template>
  <h2 class="text-h5 mb-4">Instructors</h2>

  <v-card class="pa-4 mb-6">
    <v-row dense>
      <v-col cols="12" md="4">
        <v-text-field label="First Name" v-model="inst.first_name" />
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field label="Last Name" v-model="inst.last_name" />
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field label="Email" v-model="inst.email" />
      </v-col>

      <v-col cols="12">
        <v-btn color="primary" @click="save">Add Instructor</v-btn>
      </v-col>
    </v-row>
  </v-card>

  <v-card>
    <v-data-table :items="instructors" :headers="headers" />
  </v-card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../api/axios";

const inst = ref({
  first_name: "",
  last_name: "",
  email: "",
});
const instructors = ref([]);

const headers = [
  { title: "ID", value: "id" },
  { title: "First Name", value: "first_name" },
  { title: "Last Name", value: "last_name" },
  { title: "Email", value: "email" },
];

const load = async () => {
  instructors.value = (await api.get("/instructors")).data;
};

const save = async () => {
  await api.post("/instructors", inst.value);
  inst.value = { first_name: "", last_name: "", email: "" };
  load();
};

onMounted(load);
</script>
