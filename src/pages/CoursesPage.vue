<template>
  <div>
    <!-- Page Header -->
    <div class="d-flex justify-space-between align-center mb-4">
      <h2 class="text-h5">Courses</h2>

      <v-btn color="primary" @click="openCreateDialog">
        Add Course
      </v-btn>
    </div>

    <!-- Table -->
    <v-card>
      <template v-slot:text>
        <v-text-field
          v-model="search"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          single-line
        ></v-text-field>
      </template>
      <v-data-table
        :items="courses"
        :headers="headers"
        :search="search"
        v-model:sort-by="sortBy"
        item-value="id"
      >
        <template #item.actions="{ item }">
          <v-btn icon="mdi-pencil" size="small" @click="openEditDialog(item)" />
          <v-btn icon="mdi-delete" size="small" @click="openDelete(item)" />
        </template>
      </v-data-table>
    </v-card>

    <!-- CREATE / EDIT DIALOG -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card class="pa-4">
        <h3>{{ isEditing ? 'Edit Course' : 'Add Course' }}</h3>

        <v-row dense class="mt-4">
          <v-col cols="12" md="4">
            <v-text-field
              label="Code"
              v-model="form.code"
              :error-messages="errors.code"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              label="Name"
              v-model="form.name"
              :error-messages="errors.name"
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field
              type="number"
              label="Units"
              v-model="form.units"
              :error-messages="errors.units"
            />
          </v-col>
        </v-row>

        <v-btn color="primary" class="mt-4" @click="saveCourse">
          {{ isEditing ? "Save Changes" : "Create" }}
        </v-btn>
        <v-btn variant="text" class="mt-4" @click="closeDialog">
          Cancel
        </v-btn>
      </v-card>
    </v-dialog>

    <!-- DELETE CONFIRM -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card class="pa-4 text-center">
        <h3>Delete Course?</h3>
        <p>This action cannot be undone.</p>

        <v-btn color="error" class="mt-3" @click="deleteCourse">
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

  const search = ref('');
  const sortBy = ref([{ key: 'code', order: 'asc' }]);

  const courses = ref([]);

  const headers = [
    { title: "ID", key: "id" },
    { title: "Code", key: "code" },
    { title: "Name", key: "name" },
    { title: "Units", key: "units" },
    { title: "Actions", key: "actions", sortable: false },
  ];

  // ----------------------
  // LOAD ALL COURSES
  // ----------------------
  const loadCourses = async () => {
    courses.value = (await api.get("/courses")).data;
  };

  // ----------------------
  // CRUD STATE
  // ----------------------
  const dialog = ref(false);
  const isEditing = ref(false);
  const errors = ref({});

  const form = ref({
    code: "",
    name: "",
    units: 3,
  });

  // ----------------------
  // CREATE / EDIT
  // ----------------------
  const openCreateDialog = () => {
    isEditing.value = false;
    form.value = { code: "", name: "", units: 3 };
    errors.value = {};
    dialog.value = true;
  };

  let selectedId = null;

  const openEditDialog = (item) => {
    isEditing.value = true;
    selectedId = item.id;
    form.value = { ...item };
    errors.value = {};
    dialog.value = true;
  };

  const saveCourse = async () => {
    errors.value = {};

    try {
      if (isEditing.value) {
        await api.put(`/courses/${selectedId}`, form.value);
      } else {
        await api.post("/courses", form.value);
      }

      dialog.value = false;
      loadCourses();
    } catch (e) {
      if (e.response?.status === 422) {
        errors.value = e.response.data.errors;
      }
    }
  };

  const closeDialog = () => {
    dialog.value = false;
  };

  // ----------------------
  // DELETE
  // ----------------------
  const deleteDialog = ref(false);
  let deleteId = null;

  const openDelete = (item) => {
    deleteId = item.id;
    deleteDialog.value = true;
  };

  const deleteCourse = async () => {
    await api.delete(`/courses/${deleteId}`);
    deleteDialog.value = false;
    loadCourses();
  };

  onMounted(loadCourses);
</script>
