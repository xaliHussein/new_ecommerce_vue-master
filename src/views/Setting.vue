<template>
  <v-container>
    <v-card class="mb-5">
      <v-toolbar dark color="secondary">
        <v-toolbar-title align-center>اضافة أعدادات جديد</v-toolbar-title>
      </v-toolbar>
      <v-card-text> <addSettingForm></addSettingForm></v-card-text>
    </v-card>
  </v-container>
</template>
<script>
import addSettingForm from "../components/forms/addSettingForm.vue";
export default {
  components: {
    addSettingForm,
  },
};
</script>
