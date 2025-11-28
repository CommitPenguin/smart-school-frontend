<template>
  <div>
    <h2 class="text-h5 mb-4">Instructors</h2>

    <!-- Add New Instructor -->
    <v-card class="pa-4 mb-6">
      <v-row dense>
        <v-col cols="12" md="4">
          <v-text-field
            label="First Name"
            v-model="form.first_name"
            :error-messages="errors.first_name"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            label="Last Name"
            v-model="form.last_name"
            :error-messages="errors.last_name"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            label="Email"
            v-model="form.email"
            :error-messages="errors.email"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="text-right">
          <v-btn color="primary" @click="saveInstructor">
            Add Instructor
          </v-btn>
        </v-col>
      </v-row>

    </v-card>

    <!-- Table -->
    <v-card>
      <v-data-table
        :items="instructors"
        :headers="headers"
        item-value="id"
      >
        <template #item.actions="{ item }">
          <v-btn icon="mdi-pencil" size="small" @click="openEdit(item)" />
          <v-btn icon="mdi-delete" size="small" @click="openDelete(item)" />
        </template>
      </v-data-table>
    </v-card>

    <!-- EDIT DIALOG -->
    <v-dialog v-model="editDialog" max-width="600px">
      <v-card class="pa-4">
        <h3>Edit Instructor</h3>

        <v-row dense class="mt-4">
          <v-col cols="12" md="4">
            <v-text-field
              label="First Name"
              v-model="editForm.first_name"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              label="Last Name"
              v-model="editForm.last_name"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              label="Email"
              v-model="editForm.email"
            />
          </v-col>
        </v-row>

        <v-btn color="primary" class="mt-4" @click="updateInstructor">
          Save Changes
        </v-btn>
        <v-btn variant="text" class="mt-4" @click="editDialog = false">
          Cancel
        </v-btn>
      </v-card>
    </v-dialog>

    <!-- DELETE CONFIRM -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card class="pa-4 text-center">
        <h3>Delete Instructor?</h3>
        <p>This action cannot be undone.</p>

        <v-btn color="error" class="mt-3" @click="deleteInstructor">
          Delete
        </v-btn>
        <v-btn variant="text" class="mt-3" @click="deleteDialog = false">
          Cancel
        </v-btn>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../api/axios";

const instructors = ref([]);
const errors = ref({});

// TABLE HEADERS
const headers = [
  { title: "ID", value: "id" },
  { title: "First Name", value: "first_name" },
  { title: "Last Name", value: "last_name" },
  { title: "Email", value: "email" },
  { title: "Actions", value: "actions", sortable: false },
];

// LOAD DATA
const loadInstructors = async () => {
  const res = await api.get("/instructors");
  instructors.value = res.data;
};

// CREATE FORM
const form = ref({
  first_name: "",
  last_name: "",
  email: "",
});

// SAVE
const saveInstructor = async () => {
  errors.value = {};

  try {
    await api.post("/instructors", form.value);
    form.value = { first_name: "", last_name: "", email: "" };
    loadInstructors();
  } catch (e) {
    if (e.response?.status === 422) {
      errors.value = e.response.data.errors;
    }
  }
};

// EDIT
const editDialog = ref(false);
const editForm = ref({});
let selectedId = null;

const openEdit = (item) => {
  selectedId = item.id;
  editForm.value = { ...item };
  editDialog.value = true;
};

const updateInstructor = async () => {
  await api.put(`/instructors/${selectedId}`, editForm.value);
  editDialog.value = false;
  loadInstructors();
};

// DELETE
const deleteDialog = ref(false);
let deleteId = null;

const openDelete = (item) => {
  deleteId = item.id;
  deleteDialog.value = true;
};

const deleteInstructor = async () => {
  await api.delete(`/instructors/${deleteId}`);
  deleteDialog.value = false;
  loadInstructors();
};

onMounted(loadInstructors);
</script>
