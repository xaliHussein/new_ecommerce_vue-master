<template>
  <v-container>
    <v-row>
      <v-col
        cols="12"
        sm="6"
        md="3"
        v-for="(option, index) in statistics"
        class="mt-2"
        :key="index">
        <CardStatistics
          :title="option.title"
          :icon="option.icon"
          :statistics="option.statistics"
          :color="option.color" />
      </v-col>
    </v-row>

    <OrdersTable />
  </v-container>
</template>

<script>
  // @ is an alias to /src
  import OrdersTable from "../components/tables/OrdersTable.vue";
  import CardStatistics from "../components/layout/CardStatistics.vue";

  export default {
    name: "Home",
    data() {
      return {
        pending_orders: "",
        deliverd_orders: "",
        users: "",
        products: "",
      };
    },
    components: { OrdersTable, CardStatistics },
    computed: {
      statistics() {
        return this.$store.state.statistics;
      },
    },
    methods: {
      getStatistics() {
        this.$store.dispatch("getStatistics");
      },
    },
    created() {
      this.getStatistics();
    },
    // mounted() {
    //   this.pending_orders = this.statistics[0].pending_orders;
    //   this.deliverd_orders = this.statistics[0].deliverd_orders;
    //   this.users = this.statistics[0].users;
    //   this.products = this.statistics[0].products;
    // },
  };
</script>
<style>
  :root {
    --red: hsl(0, 78%, 62%);
    --cyan: hsl(180, 62%, 55%);
    --orange: hsl(34, 97%, 64%);
    --blue: hsl(212, 86%, 64%);
    --varyDarkBlue: hsl(234, 12%, 34%);
    --grayishBlue: hsl(229, 6%, 66%);
    --veryLightGray: hsl(0, 0%, 98%);
    --weight1: 200;
    --weight2: 400;
    --weight3: 600;
  }

  body {
    font-size: 15px;
    background-color: var(--veryLightGray);
  }

  .attribution {
    font-size: 11px;
    text-align: center;
  }
  .attribution a {
    color: hsl(228, 45%, 44%);
  }

  h1:first-of-type {
    font-weight: var(--weight1);
    color: var(--varyDarkBlue);
  }

  h1:last-of-type {
    color: var(--varyDarkBlue);
  }

  @media (max-width: 400px) {
    h1 {
      font-size: 1.5rem;
    }
  }

  .box p {
    color: #000;
  }

  .box {
    border-radius: 5px;
    box-shadow: 0px 30px 40px -20px var(--grayishBlue);
    padding: 30px;
    margin: 20px;
  }

  @media (max-width: 450px) {
    .box {
      height: 200px;
    }
  }

  @media (max-width: 950px) and (min-width: 450px) {
    .box {
      text-align: center;
      height: 180px;
    }
  }

  h2 {
    color: var(--varyDarkBlue);
    font-weight: var(--weight3);
  }

  @media (min-width: 950px) {
    .row1-container {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .row2-container {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .box-down {
      position: relative;
      top: 150px;
    }
    .box {
      width: 20%;
    }
    .header p {
      width: 30%;
    }
  }
</style>
