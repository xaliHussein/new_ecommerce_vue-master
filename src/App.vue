<template>
  <v-app id="app">
    <v-main>
      <side-bar></side-bar>
      <v-snackbar v-model="snackbar" shaped :multi-line="true">
        <div v-for="(text, index) in textSnackbar.split('\n')" :key="index">
          {{ index == 0 ? "" : index + "-" }} {{ text }}
        </div>
        <template v-slot:action="{ attrs }">
          <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
            أغلاق
          </v-btn>
        </template>
      </v-snackbar>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
  import sideBar from "./components/SideBar.vue";
  export default {
    name: "App",

    data: () => ({}),
    components: {
      sideBar,
    },

    computed: {
      snackbar: {
        set: function () {
          this.$store.dispatch("snackbarToggle", { toggle: false });
        },
        get: function () {
          return this.$store.state.snackbar;
        },
      },
      textSnackbar: function () {
        return this.$store.state.textSnackbar;
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
