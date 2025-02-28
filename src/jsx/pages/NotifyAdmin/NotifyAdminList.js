import React, { Fragment, useEffect, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import ClipLoader from 'react-spinners/ClipLoader';
import AdminUserRoleService from '../../../API/Services/AdminService/AdminUserRoleService';
import { Link, useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";

const NotifyAdminList = () => {
  const navigate = useNavigate();

  const [Error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeKey, setActiveKey] = useState("Admin");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPage = 100;
  const lastIndex = currentPage * recordsPage;
  const [npage, setNpage] = useState(0);
  const number = [...Array(npage + 1).keys()].slice(1);
  const [notifyUserList, setNotifyUserList] = useState([]);
  const [notifyUserListCount, setNotifyUserListCount] = useState(0);
  const [selectedNotifyUsers, setSelectedNotifyUsers] = useState([]);
  const [samePage, setSamePage] = useState(false);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [selectCheckBox, setSelectCheckBox] = useState(false);


  useEffect(() => {
    if (localStorage.getItem("usertoken")) {
      NotifyUserList();
    } else {
      navigate("/");
    }
  }, [currentPage, activeKey]);

  const prePage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const changeCPage = (id) => {
    setCurrentPage(id);
  };

  const nextPage = () => {
    if (currentPage !== npage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const NotifyUserList = async () => {
    setIsLoading(true);
    try {
      var userData = {
        rolename: activeKey
      }

      const responseData = await AdminUserRoleService.notify_user_list(currentPage, userData).json();

      if (responseData.status) {
        let selectedUser = responseData.data.data.filter((data) => data.is_notifyuser == 1);
        setIsLoading(false);
        setNotifyUserList(responseData.data.data);
        setNpage(Math.ceil(responseData.data.total / recordsPage));
        setNotifyUserListCount(responseData.data.total);
        setSelectedNotifyUsers(selectedUser ? selectedUser?.map(user => user.id) : []);
      } else {
        setError(responseData.message);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        console.log(errorJson.message);
      }
    }
  };

  const NotifyUserStore = async () => {
    setIsLoading(true);
    try {
      var userData = {
        user_id: selectedNotifyUsers,
        rolename: activeKey
      }

      const responseData = await AdminUserRoleService.notify_user_store(userData).json();

      if (responseData.status) {
        setIsLoading(false);
        NotifyUserList();
      }
    } catch (error) {
      setIsLoading(false);
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(errorJson.message);
      }
    }
  };

  const handleEditNotifyCheckboxChange = (e, userId) => {
    if (e.target.checked) {
      setSelectedNotifyUsers((prevSelectedUsers) => [...prevSelectedUsers, userId]);
    } else {
      setSelectedNotifyUsers((prevSelectedUsers) => prevSelectedUsers.filter((id) => id !== userId));
    }
  };

  const handleMainCheckboxChange = (e) => {
    setSamePage(currentPage);
    if (e.target.checked) {
      Swal.fire({
        title: "Select Records",
        html: `
            <div style="text-align: left;">
              <label>
                <input type="radio" name="selection" value="visible" checked />
                Select visible records
              </label>
              <br />
              <label>
                <input type="radio" name="selection" value="all" />
                Select all records
              </label>
            </div>
          `,
        confirmButtonText: "Apply",
        showCancelButton: false,
        preConfirm: () => {
          const selectedOption = document.querySelector('input[name="selection"]:checked').value;
          return selectedOption;
        },
      }).then((result) => {
        if (result.isConfirmed) {
          const selectedOption = result.value;
          if (selectedOption === "visible") {
            setIsSelectAll(false);
            setSelectCheckBox(true);
            setSelectedNotifyUsers(notifyUserList.map((user) => user.id));
          } else if (selectedOption === "all") {
            setIsSelectAll(true);
            setSelectCheckBox(true);
            setSelectedNotifyUsers(notifyUserList.map((user) => user.id));
          }
        }
      });
    } else {
      setSelectCheckBox(false);
      setSelectedNotifyUsers([]);
    }
  };

  return (
    <Fragment>
      <div className="page-titles">
        <ol className="breadcrumb">
          <li><h5 className="bc-title">Notify Admin</h5></li>
        </ol>
      </div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-12">
            <div className="card">
              <div className="card-body p-0">
                <div className="table-responsive active-projects style-1 ItemsCheckboxSec shorting">
                  <div className="tbl-caption d-flex justify-content-between text-wrap align-items-center pb-0">
                    <div className="d-flex text-nowrap justify-content-between align-items-center">
                      <h4 className="heading mb-0">Notify Admin List</h4>
                    </div>
                    <button
                      className="btn btn-primary btn-sm me-1"
                      onClick={() => NotifyUserStore()}
                    >
                      <div style={{ fontSize: "11px" }}>
                        Save Changes
                      </div>
                    </button>
                  </div>
                  <div className="heading mb-0 mt-1" style={{ marginLeft: "20px", fontSize: "12px", color: "#f0ad4e" }}>
                    *Note: Selected admin(s) will be notified for any "Data Reporting" activity
                  </div>
                  <Tabs
                    activeKey={activeKey}
                    onSelect={(key) => setActiveKey(key)}
                    className="mb-3 custom-tabs mt-3"
                  >
                    <Tab eventKey="Admin"
                      title={
                        <span style={{ fontWeight: activeKey === "admin" ? "bold" : "normal" }}>Admin</span>
                      }
                    >
                      <div
                        id="employee-tbl_wrapper"
                        className="dataTables_wrapper no-footer"
                        style={{ marginTop: "-14px" }}
                      >
                        {isLoading ? (
                          <div className="d-flex justify-content-center align-items-center mb-5">
                            <ClipLoader color="#4474fc" />
                          </div>
                        ) : (
                          <table
                            id="empoloyees-tblwrapper"
                            className="table ItemsCheckboxSec dataTable no-footer mb-0"
                          >
                            <thead>
                              <tr style={{ textAlign: "center" }}>
                                <th>
                                  <input
                                    type="checkbox"
                                    style={{ cursor: "pointer" }}
                                    defaultChecked={(currentPage == samePage || isSelectAll) ? selectCheckBox : ""}
                                    onClick={(e) => handleMainCheckboxChange(e)}
                                  />
                                </th>
                                <th><strong>No.</strong></th>
                                <th>user Name</th>
                                <th>Email</th>
                              </tr>
                            </thead>
                            <tbody style={{ textAlign: "center" }}>
                              {notifyUserList !== null && notifyUserList?.length > 0 ? (
                                notifyUserList?.map((element, index) => (
                                  <tr>
                                    <td>
                                      <input
                                        type="checkbox"
                                        checked={selectedNotifyUsers?.includes(element.id)}
                                        onChange={(e) => handleEditNotifyCheckboxChange(e, element.id)}
                                        style={{
                                          cursor: "pointer",
                                        }}
                                      />
                                    </td>
                                    <td>{(currentPage - 1) * 100 + (index + 1)}</td>
                                    <td style={{ textAlign: "center" }}>{element.name || "" + " " + element.last_name || ""}</td>
                                    <td style={{ textAlign: "center" }}>{element.email}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="4" style={{ textAlign: "center" }}>
                                    No data found
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </Tab>
                    <Tab eventKey="Account Admin"
                      title={
                        <span style={{ fontWeight: activeKey === "accountAdmin" ? "bold" : "normal" }}>Account Admin</span>
                      }
                    >
                      <div
                        id="employee-tbl_wrapper"
                        className="dataTables_wrapper no-footer"
                        style={{ marginTop: "-14px" }}
                      >
                        {isLoading ? (
                          <div className="d-flex justify-content-center align-items-center mb-5">
                            <ClipLoader color="#4474fc" />
                          </div>
                        ) : (
                          <table
                            id="empoloyees-tblwrapper"
                            className="table ItemsCheckboxSec dataTable no-footer mb-0"
                          >
                            <thead>
                              <tr style={{ textAlign: "center" }}>
                                <th>
                                  <input
                                    type="checkbox"
                                    style={{ cursor: "pointer" }}
                                    checked={(currentPage == samePage || isSelectAll) ? selectCheckBox : ""}
                                    onClick={(e) => handleMainCheckboxChange(e)}
                                  />
                                </th>
                                <th><strong>No.</strong></th>
                                <th>User Name</th>
                                <th>Email</th>
                              </tr>
                            </thead>
                            <tbody style={{ textAlign: "center" }}>
                              {notifyUserList !== null && notifyUserList?.length > 0 ? (
                                notifyUserList?.map((element, index) => (
                                  <tr>
                                    <td>
                                      <input
                                        type="checkbox"
                                        checked={selectedNotifyUsers?.includes(element.id)}
                                        onChange={(e) => handleEditNotifyCheckboxChange(e, element.id)}
                                        style={{
                                          cursor: "pointer",
                                        }}
                                      />
                                    </td>
                                    <td>{(currentPage - 1) * 100 + (index + 1)}</td>
                                    <td style={{ textAlign: "center" }}>{element.name || "" + " " + element.last_name || ""}</td>
                                    <td style={{ textAlign: "center" }}>{element.email}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="4" style={{ textAlign: "center" }}>
                                    No data found
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </Tab>
                  </Tabs>
                  <div className="d-sm-flex text-center justify-content-between align-items-center dataTables_wrapper no-footer">
                    <div className="dataTables_info">
                      Showing {lastIndex - recordsPage + 1} to {lastIndex} of{" "}
                      {notifyUserListCount} entries
                    </div>
                    <div
                      className="dataTables_paginate paging_simple_numbers justify-content-center"
                      id="example2_paginate"
                    >
                      <Link
                        className="paginate_button previous disabled"
                        to="#"
                        onClick={prePage}
                      >
                        <i className="fa-solid fa-angle-left" />
                      </Link>
                      <span>
                        {number.map((n, i) => {
                          if (number.length > 4) {
                            if (
                              i === 0 ||
                              i === number.length - 1 ||
                              Math.abs(currentPage - n) <= 1 ||
                              (i === 1 && n === 2) ||
                              (i === number.length - 2 &&
                                n === number.length - 1)
                            ) {
                              return (
                                <Link
                                  className={`paginate_button ${currentPage === n ? "current" : ""
                                    } `}
                                  key={i}
                                  onClick={() => changeCPage(n)}
                                >
                                  {n}
                                </Link>
                              );
                            } else if (i === 1 || i === number.length - 2) {
                              return <span key={i}>...</span>;
                            } else {
                              return null;
                            }
                          } else {
                            return (
                              <Link
                                className={`paginate_button ${currentPage === n ? "current" : ""
                                  } `}
                                key={i}
                                onClick={() => changeCPage(n)}
                              >
                                {n}
                              </Link>
                            );
                          }
                        })}
                      </span>

                      <Link
                        className="paginate_button next"
                        to="#"
                        onClick={nextPage}
                      >
                        <i className="fa-solid fa-angle-right" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default NotifyAdminList;
