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
import ContactUs from "../views/ContactUs.vue";
import Settings from "../views/Settings.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    beforeEnter: loggedIn,
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
  },
  {
    path: "/brands",
    name: "Brands",
    component: Brands,
    beforeEnter: loggedIn,
  },
  {
    path: "/coupons",
    name: "Coupons",
    component: Coupons,
    beforeEnter: loggedIn,
  },
  {
    path: "/ads",
    name: "Ads",
    component: Ads,
    beforeEnter: loggedIn,
  },

  {
    path: "/products",
    name: "Products",
    component: Products,
    beforeEnter: loggedIn,
  },
  {
    path: "/users",
    name: "Users",
    component: Users,
    beforeEnter: loggedIn,
  },
  {
    path: "/orders",
    name: "Orders",
    component: Orders,
    beforeEnter: loggedIn,
  },
  {
    path: "/admins",
    name: "admins",
    component: Admin,
    beforeEnter: loggedIn,
  },
  {
    path: "/contact-us",
    name: "contact-us",
    component: ContactUs,
    beforeEnter: loggedIn,
  },
  {
    path: "/settings",
    name: "settings",
    component: Settings,
    beforeEnter: loggedIn,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

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
