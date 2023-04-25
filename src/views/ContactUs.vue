<template>
  <v-container>
    <v-row>
      <AddContactUsForm />
    </v-row>
  </v-container>
</template>
<script>
  import AddContactUsForm from "../components/forms/AddContactUsForm.vue";
  export default {
    components: {
      AddContactUsForm,
    },
  };
</script>
