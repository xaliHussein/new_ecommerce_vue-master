import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/login.vue";
import store from "../store/index";
import Category from "../views/Category.vue";
import Brands from "../views/Brand.vue";
import Coupons from "../views/Coupon.vue";
import Ads from "../views/Ads.vue";
import Products from "../views/Products.vue";
import Users from "../views/Users.vue";
import Orders from "../views/Order.vue";
import Admin from "../views/Admin.vue";
import Setting from "../views/Setting.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    beforeEnter: loggedIn,
    // هاي ال meta  حتى محد يوصل لهاي صفحة اذا هو مو مسجل دخول
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    beforeEnter: redirect,
    // هاي ال meta  حتى محد يوصل لهاي صفحة اذا هو  مسجل دخول
  },
  {
    path: "/categories",
    name: "Category",
    component: Category,
    beforeEnter: loggedIn,
    // هاي ال meta  حتى محد يوصل لهاي صفحة اذا هو مو مسجل دخول
  },
  {
    path: "/brands",
    name: "Brands",
    component: Brands,
    beforeEnter: loggedIn,
    // هاي ال meta  حتى محد يوصل لهاي صفحة اذا هو مو مسجل دخول
  },
  {
    path: "/coupons",
    name: "Coupons",
    component: Coupons,
    beforeEnter: loggedIn,
    // هاي ال meta  حتى محد يوصل لهاي صفحة اذا هو مو مسجل دخول
  },
  {
    path: "/ads",
    name: "Ads",
    component: Ads,
    beforeEnter: loggedIn,
  },
  // هاي ال meta  حتى محد يوصل لهاي صفحة اذا هو مو مسجل دخول
  {
    path: "/products",
    name: "Products",
    component: Products,
    beforeEnter: loggedIn,
    // هاي ال meta  حتى محد يوصل لهاي صفحة اذا هو مو مسجل دخول
  },
  {
    path: "/users",
    name: "Users",
    component: Users,
    beforeEnter: loggedIn,
    // هاي ال meta  حتى محد يوصل لهاي صفحة اذا هو مو مسجل دخول
  },
  {
    path: "/orders",
    name: "Orders",
    component: Orders,
    beforeEnter: loggedIn,
    // هاي ال meta  حتى محد يوصل لهاي صفحة اذا هو مو مسجل دخول
  },
  {
    path: "/admins",
    name: "admins",
    component: Admin,
    beforeEnter: loggedIn,
    // هاي ال meta  حتى محد يوصل لهاي صفحة اذا هو مو مسجل دخول
  },
  {
    path: "/settings",
    name: "settings",
    component: Setting,
    beforeEnter: loggedIn,
    // هاي ال meta  حتى محد يوصل لهاي صفحة اذا هو مو مسجل دخول
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});
// router.beforeEach((to, from, next) => {
//   if (to.matched.some((record) => record.meta.requireNotLogin)) {
//     if (store.getters.isLoggedIn) {
//       next("/");
//     } else {
//       next();
//     }
//   } else if (to.matched.some((record) => record.meta.requiresAuth)) {
//     if (store.getters.isLoggedIn) {
//       next();
//       return;
//     }
//     next("/login");
//   } else {
//     next();
//   }
// });

function loggedIn(to, from, next) {
  const token = localStorage.getItem("token");
  if (!token) {
    next("/login");
  } else {
    next();
  }
}
function redirect(to, from, next) {
  const token = localStorage.getItem("token");
  if (token) {
    next("/");
  } else {
    next();
  }
}

export default router;
