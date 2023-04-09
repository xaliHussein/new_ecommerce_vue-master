<template>
  <v-container>
    <v-row>
      <CategoryForm />
    </v-row>

    <CategoriesTable />
  </v-container>
</template>
<script>
  import CategoryForm from "../components/forms/CategoryForm.vue";
  import CategoriesTable from "../components/tables/CategoriesTable.vue";
  export default {
    components: {
      CategoryForm,
      CategoriesTable,
    },
  };
</script>
