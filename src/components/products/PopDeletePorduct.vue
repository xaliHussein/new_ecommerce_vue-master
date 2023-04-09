<template>
  <v-row justify="center">
    <v-dialog :value="value" persistent max-width="390">
      <v-card>
        <v-toolbar class="d-flex justify-center" color="#624fc6">
          <h2 style="color: white">حذف المنتج</h2>
        </v-toolbar>
        <v-card-title class="mt-4 d-flex justify-end"
          ><h4>هل أنت متأكد من عملية الحذف</h4></v-card-title
        >

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-col cols="auto">
            <v-btn outlined color="#C62828" v-on:click="$emit('popClose')">
              <h4>اغلاق</h4>
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn
              v-on:click="$emit('deleteProduct')"
              :loading="loading"
              color="#624fc6"
              class="px-4"
              elevation="4">
              <h4 style="color: white; font-size: 17px">تاكيد</h4>
              <template v-slot:loader>
                <span class="custom-loader">
                  <v-icon color="white">mdi-cached</v-icon>
                </span>
              </template>
            </v-btn>
          </v-col>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
  export default {
    props: {
      value: Boolean,
    },
    computed: {
      loading() {
        return this.$store.state.ProductsMoudle.pop_loading;
      },
    },
  };
</script>
