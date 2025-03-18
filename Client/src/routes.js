import React, { Suspense, Fragment, lazy } from "react";
import { Switch, Redirect, Route } from "react-router-dom";

import AdminLayout from "./dashboard/Landing/Landing";
// import UserLayout from './dashboard/Landing/Landing'
import AuthGuard, {
  TechnicianGuard,
  UserGuard,
} from "./components/Auth/AuthGuard";

import { BASE_URL } from "./config/constant";
import TechnicianLayout from "./dashboard/Layout/technicaian";
export const renderRoutes = (routes = []) => (
  <Suspense fallback={<div />}>
    <Switch>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Component = route.component;

        // Conditionally add props if the Layout is not a Fragment
        const propsL = Layout !== Fragment ? { title: route.title } : {};

        return (
          <Route
            key={i}
            path={route.path}
            exact={route.exact}
            render={(props) => (
              <Guard>
                <Layout {...propsL}>
                  {route.routes ? (
                    renderRoutes(route.routes)
                  ) : (
                    <Component {...props} />
                  )}
                </Layout>
              </Guard>
            )}
          />
        );
      })}
    </Switch>
  </Suspense>
);

// export const renderRoutes = (routes = []) => (
//   <Suspense fallback={<div />}>
//     <Switch>
//       {routes.map((route, i) => {
//         const Guard = route.guard || Fragment;
//         const Layout = route.layout || Fragment;
//         const Component = route.component;
//         const propsL = { title: route.title };
//         return (
//           <Route
//             key={i}
//             path={route.path}
//             exact={route.exact}
//             render={(props) => (
//               <Guard>
//                 <Layout {...propsL}>
//                   {route.routes ? (
//                     renderRoutes(route.routes)
//                   ) : (
//                     <Component {...props} />
//                   )}
//                 </Layout>
//               </Guard>
//             )}
//           />
//         );
//       })}
//     </Switch>
//   </Suspense>
// );

const SimpleAdmin = () => {
  return <div>Simple Admin Page</div>;
};

const routes = [
  {
    exact: true,
    // layout: UserLayout,
    path: "/",
    component: lazy(() => import("./components/Home")),
  },
  {
    path: "/users/activation/:id",
    component: lazy(() => import("./components/Home")),
  },
  {
    path: "/users/password/reset/:id",
    component: lazy(() => import("./components/Home")),
  },
  {
    path: "/users/email/reset/:id",
    component: lazy(() => import("./components/Home")),
  },
  {
    path: "/payment/successful",
    component: lazy(() => import("./components/buttons/Success")),
  },
  {
    path: "/payment/cancelled",
    component: lazy(() => import("./components/buttons/Error")),
  },
  {
    path: "/service/:id",
    component: lazy(() => import("./components/SinglePage/SinglePage")),
  },
  {
    exact: true,
    path: "/profile",
    title: "Dashboard",
    component: lazy(() => import("./components/ProfileEditor/ProfileEditor")),
  },
  {
    path: "/user/*",
    guard: UserGuard,
    routes: [
      {
        path: "/service/:id",
        component: lazy(() => import("./components/SinglePage/SinglePage")),
      },
    ],
  },
  {
    // path: "/technician/*",
    path: "/technician/",
    layout: TechnicianLayout,
    guard: TechnicianGuard,
    routes: [
      {
        exact: true,
        path: "/technician/dashboard",
        title: "Dashboard",
        component: lazy(() => import("./dashboard/Home/ActiveOrders")),
      },
      {
        exact: true,
        path: "/technician/orderStatus",
        title: "Order Status",
        component: lazy(() => import("./dashboard/OrderStatus/OrderStatus")),
      },
      {
        exact: true,
        path: "/technician/payment",
        title: "Order Status",
        component: lazy(() => import("./dashboard/Payment/Payment")),
      },
      {
        path: "*",
        exact: true,
        component: () => <Redirect to={BASE_URL} />,
      },
    ],
  },
  {
    // path: "/admin/*",
    path: "/admin/",
    layout: AdminLayout,
    guard: AuthGuard,
    routes: [
      {
        exact: true,
        path: "/admin/dashboard",
        title: "Dashboard",
        component: lazy(() => import("./dashboard/Home/DashHome")),
      },
      {
        exact: true,
        path: "/admin/dashboard/services",
        title: "Services",
        component: lazy(() => import("./dashboard/Services/DashHome")),
      },
      {
        exact: true,
        path: "/admin/dashboard/technician",
        title: "Services",
        component: lazy(() => import("./dashboard/Technician/Technician")),
      },
      {
        exact: true,
        path: "/admin/dashboard/admins",
        title: "Services",
        component: lazy(() => import("./dashboard/Admin/Admin")),
      },
      {
        exact: true,
        path: "/admin/dashboard/services/create",
        title: "Create Services",
        component: lazy(() => import("./dashboard/Services/Create")),
      },
      {
        exact: true,
        path: "/admin/dashboard/services/edit/:id",
        title: "Edit Services",
        component: lazy(() => import("./dashboard/Services/Create")),
      },
      {
        exact: true,
        path: "/admin/dashboard/manageAdmin",
        title: "Create Admins",
        component: lazy(() => import("./dashboard/Manage/Create")),
      },
      {
        path: "*",
        exact: true,
        component: () => <Redirect to={BASE_URL} />,
      },
    ],
  },
  {
    path: "*",
    exact: true,
    component: () => <Redirect to={BASE_URL} />,
  },
];

export default routes;
