/// Menu
import React, { useContext, useEffect, useReducer, useState } from "react";
import Collapse from 'react-bootstrap/Collapse';
/// Link
import { Link } from "react-router-dom";
import { MenuList, TesterDataReportingMenuList } from './Menu';
import { TesterMenuList } from './Menu';
import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import { ThemeContext } from "../../../context/ThemeContext";
import { StaffMenuList } from "./StaffMenu";


const reducer = (previousState, updatedState) => ({
  ...previousState,
  ...updatedState,
});

const initialState = {
  active: "",
  activeSubmenu: "",
};

const SideBar = () => {
  const {
    iconHover,
    sidebarposition,
    headerposition,
    sidebarLayout,
  } = useContext(ThemeContext);

  const [state, setState] = useReducer(reducer, initialState);
  const [menuItems, setMenuItems] = useState([]);


  //For scroll
  const [hideOnScroll, setHideOnScroll] = useState(true)
  const [userRole, setUserRole] = useState("");
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

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role || "";
    let list = (role.toLowerCase() == 'tester' || role.toLowerCase() == 'tester data uploader & tester account admin' || role.toLowerCase() == 'tester account admin' || role.toLowerCase() == 'tester data uploader') ? TesterMenuList : MenuList;
    setUserRole(role);
    if (role.toLowerCase() == 'tester' || role.toLowerCase() == 'tester account admin') {
      list = list?.filter((item) => item.title != 'Data Reporting');
    }
    setMenuItems(list);
  }, []);

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
      {userRole == "Staff" ?
        <div className="deznav-scroll">
          <ul className="metismenu" id="menu">
            {StaffMenuList?.map((data, index) => {
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
        : (
          <div className="deznav-scroll">
            <ul className="metismenu" id="menu">
              {menuItems?.map((data, index) => {
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
        )
      }
    </div>
  );
};

export default SideBar;