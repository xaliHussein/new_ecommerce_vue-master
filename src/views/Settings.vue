<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="pb-8">
        <v-card class="setting mt-3">
          <v-img height="210px" src="../assets/background.jpg">
            <v-app-bar flat color="rgba(0, 0, 0, 0)">
              <v-spacer></v-spacer>
            </v-app-bar>

            <v-card-title class="white--text mt-2" dir="rtl">
              <v-avatar size="100">
                <Icon icon="mdi:user-circle" color="white" width="30" />
              </v-avatar>
              <h4 class="mr-3">{{ full_name }}</h4>
            </v-card-title>
          </v-img>
          <v-card-text>
            <v-tabs v-model="tab" dir="rtl">
              <v-tabs-slider></v-tabs-slider>

              <v-tab @click="tab = 0"> <h3>اسم المستخدم</h3></v-tab>

              <v-tab @click="tab = 1"> <h3>رقم الهاتف</h3></v-tab>

              <v-tab @click="tab = 2"> <h3>كلمة المرور</h3></v-tab>
            </v-tabs>

            <v-tabs-items v-model="tab">
              <v-tab-item
                v-for="i in 3"
                :key="i"
                transition="scroll-x-transition">
                <UserName v-if="tab == 0" />
                <NumberPhone v-if="tab == 1" />
                <Password v-if="tab == 2" />
              </v-tab-item>
            </v-tabs-items>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
  import UserName from "../components/settings/UserName.vue";
  import NumberPhone from "../components/settings/NumberPhone.vue";
  import Password from "../components/settings/Password.vue";
  export default {
    components: { UserName, NumberPhone, Password },
    data() {
      return {
        tab: 0,
      };
    },
    computed: {
      full_name() {
        return this.$store.state.full_name;
      },
      server() {
        return this.$store.state.server;
      },
      loading() {
        return this.$store.state.UserModule.pop_loading;
      },
    },
  };
</script>
<style scoped>
  .setting {
    border-radius: 25px;
    box-shadow: 0px 0px 0px 0px !important;
  }
</style>
