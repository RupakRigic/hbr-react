/// Menu
import React, { useContext, useEffect, useReducer, useState } from "react";
import Collapse from 'react-bootstrap/Collapse';
/// Link
import { Link } from "react-router-dom";
import { DataUploaderMenuList } from './DataUploaderMenu';
import { CommanDataType } from './DataUploaderMenu';
import { WeeklyTrafficAndSales_ProductPricing } from './DataUploaderMenu';
import { NewHomeClosings } from './DataUploaderMenu';
import { NewHomePermits } from './DataUploaderMenu';
import { LandSales } from './DataUploaderMenu';
import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import { ThemeContext } from "../../../context/ThemeContext";

const reducer = (previousState, updatedState) => ({
  ...previousState,
  ...updatedState,
});

const initialState = {
  active: "",
  activeSubmenu: "",
};

const UserSideBar = () => {
  const {
    iconHover,
    sidebarposition,
    headerposition,
    sidebarLayout,
  } = useContext(ThemeContext);

  const [state, setState] = useReducer(reducer, initialState);
  const [activePlan, setActivePlan] = useState(false);
  //For scroll
  const [hideOnScroll, setHideOnScroll] = useState(true);
  const [subscriptionDataTypes, setSubscriptionDataTypes] = useState([]);
  const [userMenuList, setUserMenuList] = useState([]);

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("is_subscribed")) == 1) {
      const subscription_data_types = JSON.parse(localStorage.getItem("subscription_data_types"));
      if (subscription_data_types) {
        const titles = subscription_data_types?.data?.map(module => module.title);
        setSubscriptionDataTypes(titles);
      }
      setActivePlan(true);
      localStorage.setItem("subscriptionActivePlan", true);
    }
  }, [activePlan]);

  useEffect(() => {
    if (subscriptionDataTypes?.length > 0) {
      const subscription = JSON.parse(localStorage.getItem("is_subscribed"));
      const subscription_end_at = JSON.parse(localStorage.getItem("subscription_end_at"));
      const subscriptionEndDate = new Date(subscription_end_at);
      const currentDate = new Date();

      if (subscription == 1 && currentDate <= subscriptionEndDate) {
        const mergedMenuList = new Set(CommanDataType);

        subscriptionDataTypes.forEach((type) => {
          if (type === "Weekly Traffic & Sales + Product Pricing") {
            WeeklyTrafficAndSales_ProductPricing.forEach(item => mergedMenuList.add(item));
          } else if (type === "New Home Closings") {
            NewHomeClosings.forEach(item => mergedMenuList.add(item));
          } else if (type === "New Home Permits") {
            NewHomePermits.forEach(item => mergedMenuList.add(item));
          } else if (type === "Land Sales") {
            LandSales.forEach(item => mergedMenuList.add(item));
          } else {
            DataUploaderMenuList.forEach(item => mergedMenuList.add(item));
          }
        });

        const desiredOrder = [
          'Dashboard',
          'Builders',
          'Subdivisions',
          'Products',
          'Permits',
          'Weekly Traffic & Sales',
          'Base Prices',
          'Closings',
          'Land Sales',
          'Reports',
          'Archive Data',
          'Subscription',
        ];

        const sortedMenuList = Array.from(mergedMenuList).sort((a, b) => {
          return desiredOrder.indexOf(a.title) - desiredOrder.indexOf(b.title);
        });

        setUserMenuList(sortedMenuList);
      }
    } else {
      setUserMenuList(DataUploaderMenuList);
    }
  }, [subscriptionDataTypes]);

  useScrollPosition(
    ({ prevPos, currPos }) => {
      const isShow = currPos.y > prevPos.y
      if (isShow !== hideOnScroll) setHideOnScroll(isShow)
    },
    [hideOnScroll]
  );

  const handleMenuActive = status => {
    setState({ active: status });
    if (state.active === status) {
      setState({ active: "" });
    }
  };

  const handleSubmenuActive = (status) => {
    setState({ activeSubmenu: status });
    if (state.activeSubmenu === status) {
      setState({ activeSubmenu: "" });
    }
  };

  /// Path
  let path = window.location.pathname;
  path = path.split("/");
  path = path[path.length - 1];

  return (
    <div
      className={`deznav  border-right ${iconHover} ${sidebarposition.value === "fixed" &&
        sidebarLayout.value === "horizontal" &&
        headerposition.value === "static"
        ? hideOnScroll > 120
          ? "fixed"
          : ""
        : ""
        }`}
    >
      <div className="deznav-scroll">
        <ul className="metismenu" id="menu">
          {userMenuList.map((data, index) => {
            let menuClass = data.classsChange;
            if (menuClass === "menu-title") {
              return (
                <li className={menuClass} key={index} >{data.title}</li>
              )
            } else {
              return (
                <li className={` ${state.active === data.title ? 'mm-active' : ''}`}
                  key={index}
                >

                  {data.content && data.content.length > 0 ?
                    <>
                      <Link to={"#"}
                        className="has-arrow"
                        onClick={() => { handleMenuActive(data.title) }}
                      >
                        <div className="menu-icon">
                          {data.iconStyle}
                        </div>
                        {" "}<span className="nav-text">{data.title}
                          {
                            data.update && data.update.length > 0 ?
                              <span className="badge badge-xs badge-danger ms-2">{data.update}</span>
                              :
                              ''
                          }
                        </span>
                      </Link>
                      <Collapse in={state.active === data.title ? true : false}>
                        <ul className={`${menuClass === "mm-collapse" ? "mm-show" : ""}`}>
                          {data.content && data.content.map((data, index) => {
                            return (
                              <li key={index}
                                className={`${state.activeSubmenu === data.title ? "mm-active" : ""}`}
                              >
                                {data.content && data.content.length > 0 ?
                                  <>
                                    <Link to={data.to} className={data.hasMenu ? 'has-arrow' : ''}
                                      onClick={() => { handleSubmenuActive(data.title) }}
                                    >
                                      {data.title}
                                    </Link>
                                    <Collapse in={state.activeSubmenu === data.title ? true : false}>
                                      <ul className={`${menuClass === "mm-collapse" ? "mm-show" : ""}`}>
                                        {data.content && data.content.map((data, ind) => {
                                          return (
                                            <li key={ind}>
                                              <Link className={`${path === data.to ? "mm-active" : ""}`} to={data.to}>{data.title}</Link>
                                            </li>
                                          )
                                        })}
                                      </ul>
                                    </Collapse>
                                  </>
                                  :
                                  <Link to={data.to}>
                                    {data.title}
                                  </Link>
                                }

                              </li>

                            )
                          })}
                        </ul>
                      </Collapse>
                    </>
                    :
                    <Link to={data.to} >
                      <div className="menu-icon">
                        {data.iconStyle}
                      </div>
                      {" "}<span className="nav-text">{data.title}</span>
                      {
                        data.update && data.update.length > 0 ?
                          <span className="badge badge-xs badge-danger ms-2">{data.update}</span>
                          :
                          ''
                      }
                    </Link>
                  }

                </li>
              )
            }
          })}
        </ul>
      </div>
    </div>
  );
};

export default UserSideBar;