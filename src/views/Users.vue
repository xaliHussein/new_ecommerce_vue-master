<template>
  <v-container>
    <!-- <v-card class="mt-5">
      <v-toolbar dark color="secondary">
        <v-toolbar-title align-center>اضافة مستخدم جديد</v-toolbar-title>
      </v-toolbar>
      <v-card-text> <addUserForm></addUserForm></v-card-text>
    </v-card> -->
    <!-- <v-row><AddUserForm /></v-row> -->

    <UsersTable />
  </v-container>
</template>
<script>
  // import AddUserForm from "../components/forms/AddUserForm.vue";

  import UsersTable from "../components/tables/UsersTable";
  export default {
    components: {
      UsersTable,
      // AddUserForm,
    },
  };
</script>
