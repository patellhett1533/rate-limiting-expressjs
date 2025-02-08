import express from "express";
import userRoute from "./user.route";
import commonRoute from "./common.route";
import notificationRoute from "./notification.route";

const router = express.Router();

const defaultRoutes = [
  {
    path: "/user",
    route: userRoute,
  },
  {
    path: "/notification",
    route: notificationRoute,
  },
  {
    path: "/common",
    route: commonRoute,
  },
];

defaultRoutes.forEach(route => {
  router.use(route.path, route.route);
});

export default router;
