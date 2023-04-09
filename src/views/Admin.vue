<template>
  <v-container>
    <v-card class="mt-5" v-if="user_type == 2">
      <v-toolbar dark color="secondary">
        <v-toolbar-title align-center>اضافة أدمن جديد</v-toolbar-title>
      </v-toolbar>
      <v-card-text> <addUserForm></addUserForm></v-card-text>
    </v-card>
    <v-divider></v-divider>
    <v-card class="mt-5"> <adminsTable></adminsTable> </v-card>
  </v-container>
</template>
<script>
import addUserForm from "../components/forms/addUserForm.vue";

import adminsTable from "../components/tables/adminsTable.vue";
export default {
  components: {
    adminsTable,
    addUserForm,
  },
  computed: {
    user_type() {
      return localStorage.getItem("user_type");
    },
  },
};
</script>
