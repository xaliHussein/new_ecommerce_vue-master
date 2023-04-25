<template>
  <v-container>
    <v-row>
      <AddUserForm />
    </v-row>

    <AdminsTable />
  </v-container>
</template>
<script>
  import AddUserForm from "../components/forms/AddUserForm";
  import AdminsTable from "../components/tables/AdminsTable";
  export default {
    components: {
      AdminsTable,
      AddUserForm,
    },
  };
</script>
