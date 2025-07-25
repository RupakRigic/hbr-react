import React, { Fragment, useState } from "react";
import SideBar from "./SideBar";
import DataUploaderSideBar from "./DataUploaderSiderBar";
import NavHader from "./NavHader";
import Header from "./Header";

const JobieNav = ({ title, onClick: ClickToAddEvent }) => {
  const [toggle, setToggle] = useState("");
  const onClick = (name) => setToggle(toggle === name ? "" : name);
  let sidebar = null;
  const loginRole = JSON.parse(localStorage.getItem('user')).role;

  if (loginRole === "Admin" || loginRole == 'Staff'|| loginRole == 'Tester' || loginRole == 'Tester Data Uploader' || loginRole == 'Tester Account Admin' || loginRole == 'Tester Data Uploader & Tester Account Admin') {
    sidebar = <SideBar />;
  } if (loginRole === "Standard User" || loginRole == 'Data Uploader' || loginRole == 'Account Admin') {
    sidebar = <DataUploaderSideBar />;
  }

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