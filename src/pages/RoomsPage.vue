<template>
  <h2 class="text-h5 mb-4">Rooms</h2>

  <v-card class="pa-4 mb-6">
    <v-row dense>
      <v-col cols="12" md="6">
        <v-text-field label="Room Name" v-model="room.name" />
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          label="Capacity"
          type="number"
          v-model="room.capacity"
        />
      </v-col>

      <v-col cols="12">
        <v-btn color="primary" @click="save">Add Room</v-btn>
      </v-col>
    </v-row>
  </v-card>

  <v-card>
    <v-data-table :items="rooms" :headers="headers" />
  </v-card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../api/axios";

const room = ref({ name: "", capacity: null });
const rooms = ref([]);

const headers = [
  { title: "ID", value: "id" },
  { title: "Name", value: "name" },
  { title: "Capacity", value: "capacity" },
];

const load = async () => {
  rooms.value = (await api.get("/rooms")).data;
};

const save = async () => {
  await api.post("/rooms", room.value);
  room.value = { name: "", capacity: null };
  load();
};

onMounted(load);
</script>
