// const Dashboard = () => import('../pages/Dashboard/Dashboard.js');
import Dashboard from "../pages/Dashboard/Dashboard.js";

export const routes = [
  {
    path: "/",
    component: Dashboard,
  },
  {
    path: "/hello",
    component: () => import("../pages/Task/index.js"),
    children: [
      {
        path: "/hello/tasks",
        component: () => import("../pages/Task/Task.js"),
        children: [
          {
            path: "/hello/tasks/:id",
            component: () => import("../pages/Task/[id].js"),
          },
          {
            path: "/hello/tasks/wow",
            component: () => import("../pages/Task/Wow.js"),
          },
        ],
      },
    ],
  },
  // {
  //   path: '/calendar',
  //   component: () => import('../pages/Calendar/index.js'),
  // },
];
