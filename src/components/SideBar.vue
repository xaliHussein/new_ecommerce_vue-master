<template>
  <div>
    <v-app-bar
      color="white"
      app
      clipped-right
      clipped-left
      elevation="4"
      v-if="!$route.path.includes('login')">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>MEDO STORE</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer
      :clipped="clipped"
      v-model="drawer"
      nable-resize-watcher
      app
      right
      color="white"
      v-if="!$route.path.includes('login')">
      <v-sheet class="pa-4">
        <div class="text-center">
          <v-avatar class="mb-2" size="70">
            <Icon icon="mdi:user-circle" color="#624fc6" width="30" />
          </v-avatar>
          <h3>{{ full_name }}</h3>
        </div>
      </v-sheet>

      <v-divider></v-divider>

      <v-list nav>
        <v-list-item-group mandatory v-model="model" color="#624fc6">
          <v-list-item
            v-for="(opation, index) in opations"
            :key="index"
            :to="opation.link"
            @change="model == index">
            <v-list-item-content>
              <v-list-item-title class="d-flex justify-end">
                <h3>{{ opation.title }}</h3>
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <Icon :icon="opation.icon" color="#1f424a" width="30" />
            </v-list-item-icon>
          </v-list-item>
        </v-list-item-group>
        <div class="d-flex justify-center mt-3 mb-5">
          <v-btn
            class="btn-logout"
            x-large
            @click="logout"
            color="#624fc6"
            outlined>
            <h4>تسجيل خروج</h4>
            <Icon icon="majesticons:logout-line" color="#624fc6" width="32" />
          </v-btn>
        </div>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>
<script>
  export default {
    data: () => ({
      drawer: true,
      model: 0,
      group: null,
      clipped: false,
      opations: [
        { title: "الرئسية", icon: "ic:round-home", link: "/" },
        {
          title: "الاقسام",
          icon: "material-symbols:format-list-bulleted",
          link: "categories",
        },
        {
          title: "العلامات التجارية",
          icon: "material-symbols:list-alt-add-rounded",
          link: "brands",
        },
        {
          title: "الخصومات",
          icon: "mdi:discount",
          link: "coupons",
        },
        {
          title: "الاعلانات",
          icon: "material-symbols:ads-click",
          link: "ads",
        },
        {
          title: "المنتجات",
          icon: "material-symbols:shopping-cart-rounded",
          link: "products",
        },
        {
          title: "الطلبات",
          icon: "material-symbols:order-play-rounded",
          link: "orders",
        },
        {
          title: "المستخدمين",
          icon: "fa-solid:users",
          link: "users",
        },
        {
          title: "المشرفون",
          icon: "material-symbols:admin-panel-settings-rounded",
          link: "admins",
        },
        {
          title: "تواصل معنا",
          icon: "pixelarticons:contact-plus",
          link: "contact-us",
        },
        {
          title: "اعدادات الحساب",
          icon: "uiw:setting",
          link: "settings",
        },
      ],
    }),
    mounted() {
      if (localStorage.getItem("token")) {
        this.$store.dispatch("UserModule/info_auth");
      }
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
    methods: {
      logout() {
        this.$store.dispatch("resetFields");
        this.$store.dispatch("logout");
      },
    },
  };
</script>

<style scoped>
  .btn-logout {
    margin-bottom: 30px;
    border-radius: 15px !important;
  }
</style>
