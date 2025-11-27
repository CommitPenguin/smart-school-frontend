import { createRouter, createWebHistory } from "vue-router";

import SchedulerPage from "../pages/SchedulerPage.vue";
import GroupsPage from "../pages/GroupsPage.vue";
import CoursesPage from "../pages/CoursesPage.vue";
import InstructorsPage from "../pages/InstructorsPage.vue";
import RoomsPage from "../pages/RoomsPage.vue";

const routes = [
  { path: "/", redirect: "/scheduler" },
  { path: "/scheduler", component: SchedulerPage },
  { path: "/groups", component: GroupsPage },
  { path: "/courses", component: CoursesPage },
  { path: "/instructors", component: InstructorsPage },
  { path: "/rooms", component: RoomsPage },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
