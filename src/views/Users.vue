<template>
  <v-container>
    <!-- <v-card class="mt-5">
      <v-toolbar dark color="secondary">
        <v-toolbar-title align-center>اضافة مستخدم جديد</v-toolbar-title>
      </v-toolbar>
      <v-card-text> <addUserForm></addUserForm></v-card-text>
    </v-card> -->
    <v-divider></v-divider>
    <v-card class="mt-5"> <usersTable></usersTable> </v-card>
  </v-container>
</template>
<script>
// import addUserForm from "../components/forms/addUserForm.vue";

import usersTable from "../components/tables/usersTable.vue";
export default {
  components: {
    usersTable,
    // addUserForm,
  },
};
</script>
