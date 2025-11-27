<template>
  <h2 class="text-h5 mb-4">Groups</h2>

  <v-card class="pa-4 mb-6">
    <v-text-field label="Group Name" v-model="name" />

    <v-btn color="primary" class="mt-2" @click="save">Add</v-btn>
  </v-card>

  <v-card>
    <v-data-table :items="groups" :headers="headers" />
  </v-card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../api/axios";

const name = ref("");
const groups = ref([]);

const headers = [
  { title: "ID", value: "id" },
  { title: "Name", value: "name" },
];

const load = async () => {
  groups.value = (await api.get("/groups")).data;
};

const save = async () => {
  if (!name.value) return;

  await api.post("/groups", { name: name.value });
  name.value = "";
  load();
};

onMounted(load);
</script>
