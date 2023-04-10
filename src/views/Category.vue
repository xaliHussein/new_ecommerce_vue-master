<template>
  <v-container>
    <v-row>
      <CategoryForm />
    </v-row>

    <CategoriesTable />
  </v-container>
</template>
<script>
  import CategoryForm from "../components/forms/CategoryForm";
  import CategoriesTable from "../components/tables/CategoriesTable";
  export default {
    components: {
      CategoryForm,
      CategoriesTable,
    },
  };
</script>
