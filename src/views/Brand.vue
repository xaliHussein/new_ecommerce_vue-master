<template>
  <v-container>
    <v-card class="mb-5">
      <v-toolbar dark color="secondary">
        <v-toolbar-title align-center>اضافة ماركة جديدة</v-toolbar-title>
      </v-toolbar>
      <v-card-text> <brandForm></brandForm></v-card-text>
    </v-card>
    <v-divider></v-divider>
    <v-card class="mt-5"> <brandsTable></brandsTable> </v-card>
    <v-divider></v-divider>
  </v-container>
</template>
<script>
import brandForm from "../components/forms/brandForm.vue";
import brandsTable from "../components/tables/brandsTable.vue";
export default {
  components: {
    brandForm,
    brandsTable,
  },
};
</script>
