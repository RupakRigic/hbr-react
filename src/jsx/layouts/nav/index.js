import React, { Fragment, useState } from "react";

import SideBar from "./SideBar";
import UserSideBar from "./UserSideBar";
import DataUploaderSideBar from "./DataUploaderSiderBar";

import NavHader from "./NavHader";
import Header from "./Header";
//import RightSideBar from "./RightSideBar";


const JobieNav = ({ title, onClick: ClickToAddEvent, onClick2, onClick3 }) => {
  const [toggle, setToggle] = useState("");
  const onClick = (name) => setToggle(toggle === name ? "" : name);
  let sidebar = null;
  const loginRole = JSON.parse(localStorage.getItem('user')).role;
  if (loginRole === "Admin" || loginRole=='Data Uploader') {
    sidebar = <SideBar />;
  }if(loginRole === "Standard User" ||  loginRole=='User'){
    sidebar = <DataUploaderSideBar />;
  }
  // if(loginRole=='User'){
  //   console.log(loginRole);
  //   sidebar = <UserSideBar />;
  // }
  
  return (
    <Fragment>
	  
      <NavHader />
        
        <Header
            onNote={() => onClick("chatbox")}
            onNotification={() => onClick("notification")}
            onProfile={() => onClick("profile")}
            toggle={toggle}
            title={title}
            onBox={() => onClick("box")}
            onClick={() => ClickToAddEvent()}
          />
      {sidebar}
    </Fragment>
  );
};

export default JobieNav;
