<template>
  <v-container>
    <v-card class="mb-5">
      <v-toolbar dark color="secondary">
        <v-toolbar-title align-center>اضافة اعلان جديد</v-toolbar-title>
      </v-toolbar>
      <v-card-text> <adsForm></adsForm></v-card-text>
    </v-card>
    <v-divider></v-divider>
    <v-card class="mt-5"> <adsTable></adsTable> </v-card>
    <v-divider></v-divider>
  </v-container>
</template>
<script>
import adsForm from "../components/forms/adsForm.vue";
import adsTable from "../components/tables/adsTable.vue";
export default {
  components: {
    adsForm,
    adsTable,
  },
};
</script>
