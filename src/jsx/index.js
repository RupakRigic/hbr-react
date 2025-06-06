import React, { Fragment } from "react";
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
// Notify Admin List
import NotifyAdminList from "./pages/NotifyAdmin/NotifyAdminList";
/// Table
import BuilderTable from "./pages/Builder/BuilderList";
import SubdivisionList from "./pages/Subdivision/SubdivisionList";
import SubdivisionUpdate from "./pages/Subdivision/SubdivisionUpdate";
import ProductListList from "./pages/Product/ProductList";
import UserListList from "./pages/User/UserList";
import AccountAdminUser from "./pages/User/AccountAdminUser";

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
import FilterBuilder from "./pages/Builder/FilterBuilder";
import FilterSubdivision from "./pages/Subdivision/FilterSubdivision";
import FilterLandSales from "./pages/Landsale/FilterLandSales";
import FilterBasePrice from "./pages/Price/FilterBasePrice";
import FilterProducts from "./pages/Product/FilterProducts";
import FilterPermits from "./pages/Permit/FilterPermits";
import FilterWeeklyTrafficAndSales from "./pages/Trafficsale/FilterWeeklyTrafficAndSales";
import FilterClosings from "./pages/Closing/FilterClosings";
import ArchiveData from "./pages/ArchiveData/ArchiveData";
import SubscriberList from "./pages/Subscriber/SubscriberList";
import SubscriptionPlan from "./pages/SubscriptionPlan/SubscriptionPlan";
import ThankYouPage from "./pages/ThankYouPage";
import SubscriptionList from "./pages/SubscriptionPlan/SubscriptionList";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import UserAnalyticsList from "./pages/UserAnalytics/UserAnalyticsList";
import ArchiveDataUpdate from "./pages/ArchiveData/ArchiveDataUpdate";
import ScrapPriceList from "./pages/ScrapedPrices/ScrapPriceList";

const allroutes = [
  // Dashboard
  { url: "", 
    component: <Login /> 
  },
  { url: "dashboard", component: <Home />, 
    allowedRoles: ["Admin","Standard User",'Account Admin'] 
  },
  { url: "/builderList", 
    component: <BuilderTable />, 
    allowedRoles: ["Admin", "Data Uploader", "User","Standard User",'Account Admin'] 
  },
  {
    url: "/subdivisionlist",
    component: <SubdivisionList />,
    allowedRoles: ["Admin","Standard User",'Account Admin'],
  },
  {
    url: "subdivisionUpdate/:id",
    component: <SubdivisionUpdate />,
    allowedRoles: ["Admin","Standard User"],
  },
  {
    url: "builderUpdate/:id",
    component: <BuilderUpdate />,
    allowedRoles: ["Admin","Standard User"],
  },
  {
    url: "/priceList",
    component: <PriceList />,
    allowedRoles: ["Admin","Standard User"],
  },
  {
    url: "/priceupdate/:id",
    component: <PriceUpdate />,
    allowedRoles: ["Admin","Standard User"],
  },
  {
    url: "/productlist",
    component: <ProductListList />,
    allowedRoles: ["Admin","Standard User",'Account Admin'],
  },
  {
    url: "/productupdate/:id",
    component: <ProductUpdate />,
    allowedRoles: ["Admin","Standard User"],
  },
  { url: "/userlist", 
    component: <UserListList />, 
    allowedRoles: ["Admin","Standard User"] 
  },
  { url: "/userlist/accountAdmin", 
    component: <AccountAdminUser />, 
    allowedRoles: ["Account Admin"] 
  },
  { url: "/useranalytics/:id", 
    component: <UserAnalyticsList />, 
    allowedRoles: ["Admin","Standard User"] 
  },
  {
    url: "/userupdate/:id",
    component: <UserUpdate />,
    allowedRoles: ["Admin","Standard User"],
  },
  { url: "/permitlist", 
    component: <PermitList />, 
    allowedRoles: ["Admin","Standard User"] 
  },
  {
    url: "/permitupdate/:id",
    component: <PermitUpdate />,
    allowedRoles: ["Admin","Standard User"],
  },
  {
    url: "/landsalelist",
    component: <LandsaleList />,
    allowedRoles: ["Admin","Standard User",'Account Admin'],
  },
  {
    url: "/landsaleupdate/:id",
    component: <LandsaleUpdate />,
    allowedRoles: ["Admin","Standard User"],
  },
  {
    url: "/trafficsalelist",
    component: <TrafficsaleList />,
    allowedRoles: ["Admin","Standard User",'Account Admin'],
  },
  {
    url: "/trafficsaleupdate/:id",
    component: <TrafficsaleUpdate />,
    allowedRoles: ["Admin","Standard User"],
  },
  {
    url: "/closingsalelist",
    component: <ClosingList />,
    allowedRoles: ["Admin","Standard User",'Account Admin'],
  },
  {
    url: "/closingsaleupdate/:id",
    component: <ClosingUpdate />,
    allowedRoles: ["Admin","Standard User"],
  },
  // { url: "/statistics", component: <Statistics />, allowedRoles: ["Admin"] },
  {
    url: "/weekly-data",
    component: <WeeklyData />,
    allowedRoles: ["Admin", "Data Uploader","Standard User","Account Admin"],
  },
  {
    url: "/weekly-data-index",
    component: <WeeklyDataIndex />,
    allowedRoles: ["Admin", "Data Uploader","Standard User","Account Admin"],
  },
  { url: "/files", 
    component: <File />, 
    allowedRoles: ["Admin","Standard User"] 
  },
  { url: "/report", 
    component: <Report />, 
    allowedRoles: ["Admin", "User","Standard User",'Account Admin'] 
  },
  {
    url: "/report-list",
    component: <ReportList />,
    allowedRoles: ["Admin", "User","Standard User",'Account Admin'],
  },
  {
    url: "/google-map-locator",
    component: <GoogleMapLocator />,
    allowedRoles: ["Admin", "User","Standard User"],
  },
  {
    url: "/ccapn",
    component: <CCAPNList />,
    allowedRoles: ["Admin", "User","Standard User"],
  },
  {
    url: "/downloading-archive-data",
    component: <ArchiveData />,
    allowedRoles: ["Admin", "User","Standard User",'Account Admin'],
  },
  {
    url: "/archivedata-update/:id",
    component: <ArchiveDataUpdate />,
    allowedRoles: ["Admin"],
  },
  {
    url: "/subscriberlist",
    component: <SubscriberList />,
    allowedRoles: ["Admin"],
  },
  {
    url: "/subscriptionplan",
    component: <SubscriptionPlan />,
    allowedRoles: ["Data Uploader", "Standard User","Account Admin"],
  },
  {
    url: "/subscriptionlist",
    component: <SubscriptionList />,
    allowedRoles: ["Data Uploader", "Standard User","Account Admin"],
  },
  {
    url: "/filterbuilder",
    component: <FilterBuilder />,
    allowedRoles: ["Admin", "User","Standard User",'Account Admin'],
  },
  {
    url: "/filtersubdivision",
    component: <FilterSubdivision />,
    allowedRoles: ["Admin", "User","Standard User",'Account Admin'],
  },
  {
    url: "/filterlandsales",
    component: <FilterLandSales />,
    allowedRoles: ["Admin", "User","Standard User",'Account Admin'],
  },
  {
    url: "/filterbaseprice",
    component: <FilterBasePrice />,
    allowedRoles: ["Admin", "User","Standard User",'Account Admin'],
  },
   {
    url: "/scrapepricelist",
    component: <ScrapPriceList />,
    allowedRoles: ["Admin", "User","Standard User",'Account Admin'],
  },
  {
    url: "/filterproducts",
    component: <FilterProducts />,
    allowedRoles: ["Admin", "User","Standard User",'Account Admin'],
  },
  {
    url: "/filterpermits",
    component: <FilterPermits />,
    allowedRoles: ["Admin", "User","Standard User",'Account Admin'],
  },
  {
    url: "/filterweeklytrafficandsales",
    component: <FilterWeeklyTrafficAndSales />,
    allowedRoles: ["Admin", "User","Standard User",'Account Admin'],
  },
  {
    url: "/filterclosings",
    component: <FilterClosings />,
    allowedRoles: ["Admin", "User","Standard User",'Account Admin'],
  },
  {
    url: "/notifyuserlist",
    component: <NotifyAdminList />,
    allowedRoles: ["Admin"],
  },
  // {
  //   url: "/thank-you",
  //   component: <ThankYouPage />,
  //   allowedRoles: ["User","Standard User"],
  // },
];

const Markup = () => {
  const userData = JSON.parse(localStorage.getItem('user'));
  let currentRole = '';
  let isSubscribed = '1';
  if(userData) {
    currentRole = userData.role;
    isSubscribed = userData.is_subscribed;
  }

  const allowedRoles = [currentRole]; // Example: Assuming the current user has the role 'Admin'

  const filteredRoutes = allroutes.filter((route) => {
    // Check if the route's allowedRoles array contains any role that matches the current user's role
    return (
      route.allowedRoles &&
      route.allowedRoles.some((role) => allowedRoles.includes(role))
    );
  });

  const finalRoutes = filteredRoutes.filter((route) => {
    // If not subscribed, only allow weekly-data
    if (isSubscribed === "0" && !allowedRoles?.includes("Admin")) {
      return route.url === "/weekly-data" || route.url === "/weekly-data-index";
    }
    return true;
  });

  function NotFound() {
    return <Error404 />;
  }

  return (
    <Fragment>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/page-error-404" element={<Error404 />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route element={<MainLayout />}>
          {finalRoutes?.map((data, i) => (
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
    </Fragment>
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
