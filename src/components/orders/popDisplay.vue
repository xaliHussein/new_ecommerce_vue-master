<template>
  <v-container>
    <v-row>
      <v-dialog :value="value" scrollable max-width="900px" dir="rtl">
        <v-card style="direction: rtl">
          <v-toolbar dark color="#624fc6" class="d-flex justify-center">
            <v-toolbar-title class="d-flex justify-center" align-center>
              تفاصيل الطلب
            </v-toolbar-title>
          </v-toolbar>

          <v-card-text>
            <v-row>
              <v-col sm="12" md="12" lg="12" justify="center" class="mt-4">
                <h2 class="text-center">اسم الشركة</h2>

                <h4 class="text-center mt-2 mb-2">
                  0770000000 - 0770000000 - 0770000000
                </h4>
                <hr />
                <div class="d-flex justify-center">
                  <p style="margin: 0 auto; padding: 10px; text-align: right">
                    <span style="padding-left: 30px">
                      <b>رقم الطلب : {{ order_details.serial_number }}</b>
                    </span>

                    <span style="padding-left: 30px"
                      ><b
                        >تأريخ الشراء :
                        {{
                          moment(order_details.created_at).format("YYYY-MM-DD")
                        }}
                      </b></span
                    >
                    <span style="padding-left: 75px"
                      ><b
                        >تأريخ طباعة الفاتورة :
                        {{ moment().format("YYYY-MM-DD hh:mm") }}
                      </b></span
                    >
                  </p>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-data-table
                class="mx-auto"
                :headers="headers_order"
                :items="order_details.products"
                hide-default-footer>
                <template v-slot:item="{ item }">
                  <tr>
                    <td class="text-center font-weight-black">
                      {{ item.name }}
                    </td>
                    <td
                      class="text-center font-weight-black"
                      style="direction: ltr"
                      v-if="item.pivot.offer > 0">
                      {{
                        (order.pivot.price -
                          (order.pivot.price / 100) * order.pivot.offer)
                          | formatNumber
                      }}
                      د.ع
                    </td>
                    <td
                      class="text-center font-weight-black"
                      style="direction: ltr"
                      v-else>
                      {{ item.pivot.price | formatNumber }} د.ع
                    </td>
                    <td
                      class="text-center font-weight-black"
                      style="direction: ltr">
                      {{ item.pivot.quantity }}
                    </td>

                    <td
                      class="text-center font-weight-black"
                      v-if="item.pivot.offer != null && item.pivot.offer > 0">
                      <h4 style="color: green; direction: ltr">
                        {{ item.pivot.offer }} %
                      </h4>
                    </td>
                    <td class="text-center font-weight-black" v-else>
                      <h4>لايوجد</h4>
                    </td>
                    <td class="text-center font-weight-black">
                      {{ item.code_product }}
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </v-row>
            <v-row dir="rtl">
              <v-col sm="12" md="12" lg="12" justify="center" dir="rtl">
                <div>
                  <p style="margin: 0 auto; padding: 10px; text-align: right">
                    <span style="padding-left: 30px">
                      <b>أسم المستخدم : {{ order_details.user.user_name }}</b>
                    </span>

                    <span style="padding-left: 30px"
                      ><b>
                        السعر النهائي : د.ع
                        {{ order_details.total_cost | formatNumber }}
                      </b></span
                    >
                    <span style="padding-left: 75px">
                      <b v-if="order_details.coupon != null">
                        كود الخصم :
                        {{ order_details.coupon }}
                      </b>
                      <b v-else>كود الخصم : لايوجد</b>
                    </span>
                  </p>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="#624fc6"
              class="ml-3"
              @click="exportToPDF(order_details)">
              <h4 style="color: white">طباعة</h4>
            </v-btn>
            <v-btn outlined color="#C62828" v-on:click="$emit('popClose')">
              <h4>اغلاق</h4>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>
<script>
  import { jsPDF } from "jspdf";
  import autoTable from "jspdf-autotable";
  import moment from "moment";
  export default {
    props: {
      order_details: {
        type: Object,
        require: true,
      },
      value: Boolean,
    },
    data() {
      return {
        headers_order: [
          {
            text: "أسم المنتج",
            align: "center",
            value: "product_name",
            class: "secondary white--text title",
          },
          {
            text: "سعر المنتج",
            align: "center",
            value: "product_price",
            class: "secondary white--text title",
          },
          {
            text: "الكمية",
            align: "center",
            value: "quantity",
            class: "secondary white--text title",
          },
          {
            text: "خصم",
            align: "center",
            value: "offer",
            class: "secondary white--text title",
          },
          {
            text: "كود المنتج",
            align: "center",
            value: "product_code",
            class: "secondary white--text title",
          },
        ],
      };
    },
    mounted() {
      this.$store.dispatch("SettingMoudle/getSettings");
    },
    computed: {
      settings() {
        return this.$store.state.SettingMoudle.settings;
      },
    },
    methods: {
      exportToPDF(order) {
        console.log("order", order);
        const pdf = new jsPDF("p", "pt", "A4");
        var font = this.$store.state.font.font;
        pdf.addFileToVFS("Amiri-Regular-normal.ttf", font);
        pdf.addFont(
          "Amiri-Regular-normal.ttf",
          "Amiri-Regular-normal",
          "normal"
        );

        pdf.setFont("Amiri-Regular-normal");

        var image = require("@/assets/logo.png");
        var imgLogo = new Image();
        imgLogo.src = image;
        pdf.addImage(imgLogo, 250, 40, 70, 70);
        pdf.text(262, 135, "اسم الشركة");
        let data = [];

        // احضار الطلب و وضع تفاصيله في مصفوفه وعرضه في جدول
        order.products.forEach((element) => {
          let object = {};
          object["name"] = element.name;
          object["company"] = element.brand.name;
          object["quantity"] = element.pivot.quantity;

          if (element.pivot.offer > 0) {
            object["offer"] = element.pivot.offer;
            object["price"] =
              element.pivot.price -
              (element.pivot.price / 100) * element.pivot.offer;
          } else {
            object["offer"] = "لايوجد";
            object["price"] = element.pivot.price;
          }
          data.push(object);
        });

        var body = [
          ["رقم الطلب", "مجموع", "تاريخ الشراء"],
          [
            order.serial_number,
            order.total_cost + " د.ع",
            moment(this.created_at).format("YYYY-MM-DD"),
          ],
        ];
        autoTable(pdf, {
          body: body,
          bodyStyles: { halign: "center" },
          margin: { top: 160 },
          styles: { font: "Amiri-Regular-normal" },
        });

        autoTable(pdf, {
          body: data,
          columns: [
            { header: "الكميه", dataKey: "quantity" },
            { header: "السعر", dataKey: "price" },
            { header: "خصم", dataKey: "offer" },
            { header: "اسم الشركه", dataKey: "company" },
            { header: "المنتج", dataKey: "name" },
          ],
          headStyles: { fillColor: [98, 79, 198], halign: "center" },
          bodyStyles: { halign: "center" },
          margin: { top: 173 },
          theme: "grid",
          styles: { font: "Amiri-Regular-normal" },
        });
        pdf.save(order.serial_number + ".pdf");
      },
    },
  };
</script>
