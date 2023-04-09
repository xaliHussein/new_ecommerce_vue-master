<template>
  <v-container>
    <v-row justify="center" dir="rtl">
      <v-dialog :value="value" scrollable max-width="900px" dir="rtl">
        <v-card>
          <v-toolbar class="d-flex justify-center" color="#624fc6">
            <h2 style="color: white">تفاصيل الطلب</h2>
          </v-toolbar>

          <v-card-text id="printMe" dir="rtl">
            <v-row dir="rtl">
              <v-col sm="12" md="12" lg="12" justify="center" dir="rtl">
                <div class="title text-center" justify="center" dir="rtl">
                  <h2
                    style="
                      margin: 0 auto;
                      border-top: 1px dashed #bbb;
                      padding: 10px;
                      text-align: center;
                      letter-spacing: 2px;
                    ">
                    شركة اعمدة الشموخ للمقاولات العامة المحدودة
                  </h2>
                  <h2
                    style="
                      margin: 0 auto;
                      padding: 10px;
                      text-align: center;
                      letter-spacing: 2px;
                    ">
                    وتجهيز الكونكريت
                  </h2>
                </div>
                <div class="numbers" justify="center">
                  <p style="margin: 0 auto; padding: 10px; text-align: center">
                    <b>07711119970 - 07811119970 - 07705333603</b>
                  </p>
                </div>
                <hr />
                <div>
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
                      v-if="item.offer != null">
                      {{
                        (item.price - (item.price / 100) * item.offer)
                          | formatNumber
                      }}
                      IQD
                    </td>
                    <td
                      class="text-center font-weight-black"
                      style="direction: ltr"
                      v-else>
                      {{ item.price | formatNumber }} IQD
                    </td>
                    <td
                      class="text-center font-weight-black"
                      style="direction: ltr; color: green"
                      v-if="item.offer != null">
                      {{ item.offer }} %
                    </td>
                    <td
                      class="text-center font-weight-black"
                      style="direction: ltr"
                      v-else>
                      لايوجد
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
                        السعر النهائي : IQD
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
            <v-spacer></v-spacer>
            <v-col cols="auto">
              <v-btn color="#624fc6" v-print="'#printMe'">
                <h4 style="color: white">طباعة</h4>
              </v-btn>
            </v-col>
            <v-col cols="auto">
              <v-btn outlined color="#C62828" v-on:click="$emit('popClose')">
                <h4>اغلاق</h4>
              </v-btn>
            </v-col>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>
<script>
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
  };
</script>
