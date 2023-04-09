<template>
  <div>
    <v-app-bar
      color="white"
      app
      clipped-right
      clipped-left
      elevation="4"
      v-if="!$route.path.includes('login')">
      <!-- this app  عملها تخلي الناف بار فوق سايد بار يعني تخلي عنصر هو اول شي  -->
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
          <v-avatar class="mb-2" color="grey darken-1" size="70">
            <img src="/images/FullLogo.png" />
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
          title: "الماركات",
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
          title: "الادمنية",
          icon: "material-symbols:admin-panel-settings-rounded",
          link: "admins",
        },
        {
          title: "الاعدادات",
          icon: "icon-park-solid:setting",
          link: "settings",
        },
      ],
    }),
    computed: {
      full_name() {
        return this.$store.state.full_name;
      },
    },
    methods: {
      signOut: function () {
        this.$store.dispatch("resetFields");
        this.user_type = -1;
        console.log("in log out ");
        localStorage.removeItem("token");
        localStorage.removeItem("user_name");
        this.$store.dispatch("logout").then(() => {
          this.$router.replace("/login");
        });
      },
    },

    //  هاي تخلي الدرور يختفي عند الضغط على اي زر تريدة
    // watch: {
    //   group() {
    //     this.drawer = false;
    //   },
    // },
  };
</script>

<style></style>
