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
          v-if="loading_statistics == false"
          :title="option.title"
          :icon="option.icon"
          :statistics="option.statistics"
          :color="option.color" />
      </v-col>
      <v-col
        cols="12"
        sm="6"
        md="3"
        lg="3"
        v-for="(n, index) in 4"
        :key="'A' + index"
        class="mt-2">
        <v-card
          class="card-skeleton"
          v-if="loading_statistics == true"
          max-width="250">
          <v-skeleton-loader
            class="mx-auto"
            max-width="300"
            type="list-item-avatar-three-line"></v-skeleton-loader>
        </v-card>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="6">
        <v-card class="card" width="100%" :height="415">
          <v-card-title class="d-flex justify-center pb-0 mb-0"
            >احصائيات الطلبات المكتملة و المرفوضه</v-card-title
          >
          <LineChartGenerator
            :width="width"
            :height="height"
            :chart-options="options"
            :chart-data="chart_week" />
        </v-card>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="6">
        <v-card class="card" width="100%" :height="415">
          <v-card-title class="d-flex justify-center pb-0 mb-0"
            >احصائيات العلامات التجاريه و المنتجات
          </v-card-title>
          <Pie
            v-if="loading_statistics == false"
            :width="width"
            :height="353"
            :chart-options="chartOptions"
            :chart-data="chartData" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import CardStatistics from "../components/layout/CardStatistics.vue";
  import { Line as LineChartGenerator, Pie } from "vue-chartjs/legacy";

  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    ArcElement,
    LinearScale,
    CategoryScale,
    PointElement,
  } from "chart.js";
  Title, Tooltip, Legend, ArcElement, CategoryScale;
  ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    ArcElement,
    LinearScale,
    CategoryScale,
    PointElement
  );

  export default {
    components: { LineChartGenerator, Pie, CardStatistics },

    name: "BarChart",
    props: {
      width: {
        type: Number,
        default: 400,
      },
      height: {
        type: Number,
        default: 270,
      },
    },

    data() {
      return {
        Data: {
          labels: ["January", "February", "March", "April", "May", "June"],
          datasets: [
            {
              label: "الطلبات المكتملة",
              borderColor: "#624fc6",
              pointStyle: "circle",
              pointRadius: 7,
              pointHoverRadius: 13,
              backgroundColor: "rgba(98,79,198, 0.5)",

              data: [10, 20, 12, 25, 30, 33],
            },
            {
              label: "الطلبات المرفوضة",
              borderColor: "#FF6384",
              pointStyle: "circle",
              pointRadius: 7,
              pointHoverRadius: 13,
              backgroundColor: "rgba(255,99,132, 0.5)",

              data: [2, 3, 5, 2, 7, 10],
            },
          ],
        },
        options: {
          responsive: true,
          interaction: {
            intersect: false,
            axis: "x",
          },
          stacked: false,
          plugins: {
            legend: {
              labels: {
                // This more specific font property overrides the global property
                font: {
                  size: 14,
                  family: "'Cairo', sans-serif",
                  weight: "bold",
                },
              },
            },
          },
        },

        chartOptions: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                // This more specific font property overrides the global property
                font: {
                  size: 14,
                  family: "'Cairo', sans-serif",
                  weight: "bold",
                },
              },
            },
          },
        },

        pending_orders: "",
        deliverd_orders: "",
        users: "",
        products: "",
      };
    },

    computed: {
      statistics() {
        return this.$store.state.statistics;
      },
      chartData() {
        return this.$store.state.chartData;
      },
      chart_week() {
        return this.$store.state.chart_week;
      },
      loading_statistics() {
        return this.$store.state.loading_statistics;
      },
    },

    mounted() {
      this.$store.dispatch("getStatistics");
    },
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
  .card-skeleton {
    direction: ltr;

    border-radius: 20px !important;
    box-shadow: 0px 0px 0px 0px !important;
  }
</style>
