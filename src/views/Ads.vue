<template>
  <v-container>
    <v-row>
      <AdsForm />
    </v-row>

    <AdsTable />
  </v-container>
</template>
<script>
  import AdsForm from "../components/forms/AdsForm";
  import AdsTable from "../components/tables/AdsTable";
  export default {
    components: {
      AdsForm,
      AdsTable,
    },
  };
</script>
