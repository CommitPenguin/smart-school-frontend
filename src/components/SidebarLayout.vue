<template>
  <v-app>
    <!-- Drawer -->
    <v-navigation-drawer
      app
      permanent
      width="260"
      color="surface"
      class="elevation-3"
    >
      <v-list>
        <v-list-item class="px-4 py-4">
          <v-list-item-title class="text-h6 font-weight-bold">
            Smart School
          </v-list-item-title>
        </v-list-item>

        <v-divider />

        <v-list-item
          v-for="item in menu"
          :key="item.title"
          link
          router
          :to="item.to"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Main -->
    <v-main>
      <v-container fluid class="pa-6">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
const menu = [
  { title: "Scheduler", to: "/scheduler" },
  { title: "Groups", to: "/groups" },
  { title: "Courses", to: "/courses" },
  { title: "Instructors", to: "/instructors" },
  { title: "Rooms", to: "/rooms" },
];
</script>

<style>
/* Remove potential CSS interference */
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>
