import React from "react";
import { useSelector } from "react-redux";
import { Routes, Route, Outlet } from "react-router-dom";

/// Css
import "./index.css";
/// Layout
import Nav from "./layouts/nav";
import Footer from "./layouts/Footer";
import ScrollToTop from "./layouts/ScrollToTop";
import Home from "./components/Dashboard/Home";
import Login from "./pages/Login";
/// Table
import BuilderTable from "./pages/Builder/BuilderList";
import SubdivisionList from "./pages/Subdivision/SubdivisionList";
import SubdivisionUpdate from "./pages/Subdivision/SubdivisionUpdate";
import ProductListList from "./pages/Product/ProductList";
import UserListList from "./pages/User/UserList";
import UserUpdate from "./pages/User/UserUpdate";
import ProductUpdate from "./pages/Product/ProductUpdate";
import PermitList from "./pages/Permit/PermitList";
import PermitUpdate from "./pages/Permit/PermitUpdate";
import LandsaleList from "./pages/Landsale/LandsaleList";
import LandsaleUpdate from "./pages/Landsale/LandsaleUpdate";
import TrafficsaleList from "./pages/Trafficsale/TrafficsaleList";
import TrafficsaleUpdate from "./pages/Trafficsale/TranfficsaleUpdate";
import ClosingList from "./pages/Closing/ClosingList";
import ClosingUpdate from "./pages/Closing/ClosingUpdate";
import Statistics from "./pages/Statistics/Statistics";
import WeeklyData from "./pages/WeeklyData/WeeklyData";
import WeeklyDataIndex from "./pages/WeeklyData/WeeklyDataIndex";
import File from "./pages/File/File";
import Report from "./pages/Report/Report";
import ReportList from "./pages/Report/ReportList";
import Error404 from "./pages/Error404";
import Error403 from "./pages/Error403";
import PriceList from "./pages/Price/PriceList";
import PriceUpdate from "./pages/Price/PriceUpdate";

import BuilderUpdate from "./pages/Builder/BuilderUpdate";
import GoogleMapLocator from "./pages/Subdivision/GoogleMapLocator";
import CCAPNList from "./pages/CCAPN/CCAPNList";
const allroutes = [
  // Dashboard
  { url: "", component: <Login /> },
  { url: "dashboard", component: <Home />, allowedRoles: ["Admin"] },

  { url: "/builderList", component: <BuilderTable />, allowedRoles: ["Admin", "Data Uploader", "User"] },
  {
    url: "/subdivisionlist",
    component: <SubdivisionList />,
    allowedRoles: ["Admin"],
  },
  {
    url: "subdivisionUpdate/:id",
    component: <SubdivisionUpdate />,
    allowedRoles: ["Admin"],
  },
  {
    url: "builderUpdate/:id",
    component: <BuilderUpdate />,
    allowedRoles: ["Admin"],
  },
  {
    url: "/priceList",
    component: <PriceList />,
    allowedRoles: ["Admin"],
  },
  {
    url: "/priceupdate/:id",
    component: <PriceUpdate />,
    allowedRoles: ["Admin"],
  },
  {
    url: "/productlist",
    component: <ProductListList />,
    allowedRoles: ["Admin"],
  },
  {
    url: "/productupdate/:id",
    component: <ProductUpdate />,
    allowedRoles: ["Admin"],
    allowedRoles: ["Admin"],
  },
  { url: "/userlist", component: <UserListList />, allowedRoles: ["Admin"] },
  {
    url: "/userupdate/:id",
    component: <UserUpdate />,
    allowedRoles: ["Admin"],
  },
  { url: "/permitlist", component: <PermitList />, allowedRoles: ["Admin"] },
  {
    url: "/permitupdate/:id",
    component: <PermitUpdate />,
    allowedRoles: ["Admin"],
  },
  {
    url: "/landsalelist",
    component: <LandsaleList />,
    allowedRoles: ["Admin"],
  },
  {
    url: "/landsaleupdate/:id",
    component: <LandsaleUpdate />,
    allowedRoles: ["Admin"],
  },
  {
    url: "/trafficsalelist",
    component: <TrafficsaleList />,
    allowedRoles: ["Admin"],
  },
  {
    url: "/trafficsaleupdate/:id",
    component: <TrafficsaleUpdate />,
    allowedRoles: ["Admin"],
  },
  {
    url: "/closingsalelist",
    component: <ClosingList />,
    allowedRoles: ["Admin"],
  },
  {
    url: "/closingsaleupdate/:id",
    component: <ClosingUpdate />,
    allowedRoles: ["Admin"],
  },
  // { url: "/statistics", component: <Statistics />, allowedRoles: ["Admin"] },
  {
    url: "/weekly-data",
    component: <WeeklyData />,
    allowedRoles: ["Admin", "Data Uploader"],
  },
  {
    url: "/weekly-data-index",
    component: <WeeklyDataIndex />,
    allowedRoles: ["Admin", "Data Uploader"],
  },
  { url: "/files", component: <File />, allowedRoles: ["Admin"] },
  { url: "/report", component: <Report />, allowedRoles: ["Admin", "User"] },
  {
    url: "/report-list",
    component: <ReportList />,
    allowedRoles: ["Admin", "User"],
  },
  {
    url: "/google-map-locator",
    component: <GoogleMapLocator />,
    allowedRoles: ["Admin", "User"],
  },
  {
    url: "/ccapn",
    component: <CCAPNList />,
    allowedRoles: ["Admin", "User"],
  },
];

const Markup = () => {
  const userData = JSON.parse(localStorage.getItem('user'));
  let currentRole = '';
  if(userData)
  {
    currentRole = userData.role;
  }

  const allowedRoles = [currentRole]; // Example: Assuming the current user has the role 'Admin'

  const filteredRoutes = allroutes.filter((route) => {
    // Check if the route's allowedRoles array contains any role that matches the current user's role
    return (
      route.allowedRoles &&
      route.allowedRoles.some((role) => allowedRoles.includes(role))
    );
  });

  function NotFound() {
    const url = filteredRoutes.map((route) => route.url);
    let path = window.location.pathname;
    path = path.split("/");
    path = path[path.length - 1];
    if (url.indexOf(path) <= 0) {
      return <Error404 />;
    }
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/page-error-404" element={<Error404 />} />
        <Route element={<MainLayout />}>
          {filteredRoutes.map((data, i) => (
            <Route
              key={i}
              exact
              path={`${data.url}`}
              element={data.component}
            />
          ))}
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ScrollToTop />
    </>
  );
};

function MainLayout() {
  const sideMenu = useSelector((state) => state.sideMenu);
  return (
    <div id="main-wrapper" className={`show ${sideMenu ? "menu-toggle" : ""}`}>
      <Nav />
      <div
        className="content-body"
        style={{ minHeight: window.screen.height - 45 }}
      >
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default Markup;
