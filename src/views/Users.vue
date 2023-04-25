<template>
  <v-container>
    <UsersTable />
  </v-container>
</template>
<script>
  import UsersTable from "../components/tables/UsersTable";
  export default {
    components: {
      UsersTable,
    },
  };
</script>
