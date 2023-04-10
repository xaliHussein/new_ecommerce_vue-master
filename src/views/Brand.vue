<template>
  <v-container>
    <v-row>
      <BrandForm />
    </v-row>

    <BrandsTable />
  </v-container>
</template>
<script>
  import BrandForm from "../components/forms/BrandForm";
  import BrandsTable from "../components/tables/BrandsTable";
  export default {
    components: {
      BrandForm,
      BrandsTable,
    },
  };
</script>
