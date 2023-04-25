<template>
  <v-app id="app">
    <v-main>
      <side-bar></side-bar>
      <SnackBar v-if="snackbar" :snack_message="snack_message" />
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
  import sideBar from "./components/SideBar.vue";
  import SnackBar from "./components/layout/Snackbar";
  export default {
    name: "App",

    data: () => ({}),
    components: {
      sideBar,
      SnackBar,
    },

    computed: {
      snackbar() {
        return this.$store.getters.snackbar;
      },

      snack_message() {
        return this.$store.state.snack_message;
      },
    },
  };
</script>

<style>
  #app {
    background-color: #e0e4e4;
    font-family: "Cairo", sans-serif;
  }
  .scroll {
    margin-left: 2px;
  }
  ::-webkit-scrollbar {
    width: 10px;
  }
  ::-webkit-scrollbar-track {
    background: #e6e6e6;
    border-left: 1px solid #dadada;
    border-radius: 100px;
  }
  ::-webkit-scrollbar-thumb {
    background-image: linear-gradient(180deg, #ad519c 0%, #624fc6 99%);
    border: solid 1px #e6e6e6;
    border-radius: 100px;
  }
  .custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }

  @-moz-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-o-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
