import React, { useState, useEffect, useRef } from "react";

import AdminUserRoleService from "../../../API/Services/AdminService/AdminUserRoleService";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import UserOffcanvas from "./UserOffcanvas";
import MainPagetitle from "../../layouts/MainPagetitle";
import { Offcanvas } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { debounce } from "lodash";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import ClipLoader from "react-spinners/ClipLoader";
import AccessField from "../../components/AccssFieldComponent/AccessFiled";

const UserList = () => {
  const [Error, setError] = useState("");
  const navigate = useNavigate();
  const [userList, setUserList] = useState([]);
  const [userListCount, setUserCount] = useState('');
  const [TotaluserListCount, setTotalUserCount] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPage = 100;
  const lastIndex = currentPage * recordsPage;
  const firstIndex = lastIndex - recordsPage;
  const [npage, setNpage] = useState(0);
  const number = [...Array(npage + 1).keys()].slice(1);

  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [UserDetails, setUserDetails] = useState({
    builder: "",
    name: "",
    email: "",
    roles: "",
  });

  const [manageAccessOffcanvas, setManageAccessOffcanvas] = useState(false);
  const [accessList, setAccessList] = useState({});
  const [accessRole, setAccessRole] = useState("Admin");
  const [accessForm, setAccessForm] = useState({});
  const [role, setRole] = useState("Admin");
  const [checkedItems, setCheckedItems] = useState({}); // State to manage checked items
  const fieldList = AccessField({ tableName: "users" });

  useEffect(() => {
    console.log(fieldList); // You can now use fieldList in this component
  }, [fieldList]);

  const checkFieldExist = (fieldName) => {
    return fieldList.includes(fieldName.trim());
  };

  const HandleRole = (e) => {
    setRole(e.target.value);
    setAccessRole(e.target.value);
  };
  const handleAccessForm = async (e) => {
    e.preventDefault();
    var userData = {
      form: accessForm,
      role: role,
      table: "users",
    };
    try {
      const data = await AdminUserRoleService.manageAccessFields(
        userData
      ).json();
      if (data.status === true) {
        setManageAccessOffcanvas(false);
      }
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(
          errorJson.message.substr(0, errorJson.message.lastIndexOf("."))
        );
      }
    }
  };

  useEffect(() => {
    if (Array.isArray(accessList)) {
      const initialCheckedState = {};
      accessList.forEach((element) => {
        initialCheckedState[element.field_name] =
          element.role_name.includes(accessRole);
      });
      setCheckedItems(initialCheckedState);
    }
  }, [accessList, accessRole]);

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setCheckedItems((prevCheckedItems) => ({
      ...prevCheckedItems,
      [name]: checked,
    }));
    setAccessForm((prevAccessForm) => ({
      ...prevAccessForm,
      [name]: checked,
    }));
  };

  const getAccesslist = async () => {
    try {
      const response = await AdminUserRoleService.accessField();
      const responseData = await response.json();
      setAccessList(responseData);
      console.log(responseData);
    } catch (error) {
      console.log(error);
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(errorJson.message);
      }
    }
  };
  useEffect(() => {
    if (localStorage.getItem("usertoken")) {
      getAccesslist();
    } else {
      navigate("/");
    }
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterQuery, setFilterQuery] = useState({
    role: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState([]);

  function prePage() {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  }
  function changeCPage(id) {
    setCurrentPage(id);
  }
  function nextPage() {
    if (currentPage !== npage) {
      setCurrentPage(currentPage + 1);
    }
  }

  const product = useRef();
  const stringifySortConfig = (sortConfig) => {
    return sortConfig.map((sort) => `${sort.key}:${sort.direction}`).join(",");
  };
  const getuserList = async () => {
    try {
      let sortConfigString = "";
      if (sortConfig !== null) {
        sortConfigString = "&sortConfig=" + stringifySortConfig(sortConfig);
      }
      const response = await AdminUserRoleService.index(currentPage,sortConfigString,searchQuery);
      const responseData = await response.json();
      setUserList(responseData.data);
      setNpage(Math.ceil(responseData.total / recordsPage));
      setUserCount(responseData.total);
      setIsLoading(false);

    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(errorJson.message);
      }
    }
  };
  useEffect((currentPage) => {
    if (localStorage.getItem("usertoken")) {
      getuserList(currentPage);
    } else {
      navigate("/");
    }
  }, [currentPage]);

  const handleDelete = async (e) => {
    try {
      let responseData = await AdminUserRoleService.destroy(e).json();
      if (responseData.status === true) {
        getuserList();
      }
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(errorJson.message);
      }
    }
  };
  const handleCallback = () => {
    getuserList();
  };
  const handleRowClick = async (id) => {
    try {
      let responseData = await AdminUserRoleService.show(id).json();
      setUserDetails(responseData);
      console.log(responseData);
      setShowOffcanvas(true);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(errorJson.message);
      }
    }
  };
  const debouncedHandleSearch = useRef(
    debounce((value) => {
      setSearchQuery(value);
    }, 1000)
  ).current;

  useEffect(() => {
    getuserList();
  }, [searchQuery]);

  const HandleSearch = (e) => {
    setIsLoading(true);
    const query = e.target.value.trim();
    if (query) {
      debouncedHandleSearch(`&q=${query}`);
    } else {
      setSearchQuery("");
    }
  };
  useEffect(() => {
    setSearchQuery(filterString());
  }, [filterQuery]);

  const HandleFilter = (e) => {
    const { name, value } = e.target;
    setFilterQuery((prevFilterQuery) => ({
      ...prevFilterQuery,
      [name]: value,
    }));
  };

  const filterString = () => {
    const queryString = Object.keys(filterQuery)
      .map(
        (key) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(filterQuery[key])}`
      )
      .join("&");

    return queryString ? `&${queryString}` : "";
  };

  const HandleCancelFilter = (e) => {
    setFilterQuery({
      role: "",
    });
  };
  const requestSort = (key) => {
    let direction = "asc";

    const newSortConfig = [...sortConfig];
    const keyIndex = sortConfig.findIndex((item) => item.key === key);
    if (keyIndex !== -1) {
      direction = sortConfig[keyIndex].direction === "asc" ? "desc" : "asc";
      newSortConfig[keyIndex].direction = direction;
    } else {
      newSortConfig.push({ key, direction });
    }
    setSortConfig(newSortConfig);
    getuserList(currentPage, sortConfig);
  };


  return (
    <>
      <MainPagetitle mainTitle="User" pageTitle="User" parentTitle="Home" />
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-12">
            <div className="card">
              <div className="card-body p-0">
                <div className="table-responsive active-projects style-1 ItemsCheckboxSec shorting">
                <div className="tbl-caption d-flex justify-content-between text-wrap align-items-center pb-0">
                    <div className="d-flex text-nowrap justify-content-between align-items-center">
                      <h4 className="heading mb-0">User List</h4>
                      <div
                        class="btn-group mx-5"
                        role="group"
                        aria-label="Basic example"
                      >
                        <button class="btn btn-secondary cursor-none">
                          {" "}
                          <i class="fas fa-search"></i>{" "}
                        </button>
                        <Form.Control
                          type="text"
                          style={{
                            borderTopLeftRadius: "0",
                            borderBottomLeftRadius: "0",
                          }}
                          onChange={HandleSearch}
                          placeholder="Quick Search"
                        />
                      </div>
                    </div>
                    <div className="d-flex">
                      <button
                        className="btn btn-primary btn-sm me-1"
                        onClick={() => setManageAccessOffcanvas(true)}
                      >
                        {" "}
                        Field Access
                      </button>
                      <Dropdown>
                        <Dropdown.Toggle
                          variant="success"
                          className="btn-sm"
                          id="dropdown-basic"
                        >
                          <i className="fa fa-filter"></i>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <h5 className="">Filter Options</h5>
                          <div className="border-top">
                            <div className="mt-3 mb-3">
                              <label className="form-label">
                                Role: <span className="text-danger"></span>
                              </label>
                              <select
                                className="default-select form-control"
                                value={filterQuery.role}
                                name="role"
                                onChange={HandleFilter}
                              >
                                {/* <option data-display="Select">Please select</option> */}
                                <option value="">All</option>
                                <option value="User">User</option>
                                <option value="Data Uploader">
                                  Data Uploader
                                </option>
                              </select>
                            </div>
                          </div>
                          <div className="d-flex justify-content-end">
                            <Button
                              className="btn-sm"
                              onClick={HandleCancelFilter}
                              variant="secondary"
                            >
                              Reset
                            </Button>
                          </div>
                        </Dropdown.Menu>
                      </Dropdown>
                      <Link
                        to={"#"}
                        className="btn btn-primary btn-sm ms-1"
                        data-bs-toggle="offcanvas"
                        onClick={() => product.current.showEmployeModal()}
                      >
                        + Add User
                      </Link>
                    </div>
                  </div>
                  <div className="d-sm-flex text-center justify-content-between align-items-center dataTables_wrapper no-footer">
                      <div className="dataTables_info">
                        Showing {lastIndex - recordsPage + 1} to {lastIndex} of{" "}
                        {userListCount} entries
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
                                    className={`paginate_button ${
                                      currentPage === n ? "current" : ""
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
                                  className={`paginate_button ${
                                    currentPage === n ? "current" : ""
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
                  <div
                    id="employee-tbl_wrapper"
                    className="dataTables_wrapper no-footer"
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
                              <strong>No.</strong>
                            </th>
                            {checkFieldExist("Name") && (
                              <th onClick={() => requestSort("name")}>
                                <strong>
                                  Name
                                  {sortConfig.key !== "name" ? "↑↓" : ""}
                                  {sortConfig.key === "name" && (
                                    <span>
                                      {sortConfig.direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  )}
                                </strong>
                              </th>
                            )}
                            {checkFieldExist("Email") && (
                              <th onClick={() => requestSort("email")}>
                                <strong>
                                  Email
                                  {sortConfig.key !== "email" ? "↑↓" : ""}
                                  {sortConfig.key === "email" && (
                                    <span>
                                      {sortConfig.direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  )}
                                </strong>
                              </th>
                            )}
                            {checkFieldExist("Role") && (
                              <th onClick={() => requestSort("role")}>
                                <strong>
                                  Role
                                  {sortConfig.key !== "role" ? "↑↓" : ""}
                                  {sortConfig.key === "role" && (
                                    <span>
                                      {sortConfig.direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  )}
                                </strong>
                              </th>
                            )}
                            {checkFieldExist("Builder") && (
                              <th onClick={() => requestSort("builderName")}>
                                <strong>Builder</strong>
                                {sortConfig.key !== "builderName" ? "↑↓" : ""}
                                {sortConfig.key === "builderName" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("Action  ") && <th>Action</th>}
                          </tr>
                        </thead>
                        <tbody style={{ textAlign: "center" }}>
                          {userList !== null && userList.length > 0 ? (
                            userList.map((element, index) => (
                              <tr
                                onClick={() => handleRowClick(element.id)}
                                style={{
                                  textAlign: "center",
                                  cursor: "pointer",
                                }}
                              >
                                <td>{index + 1}</td>
                                {checkFieldExist("Name") && (
                                  <td>{element.name}</td>
                                )}
                                {checkFieldExist("Email") && (
                                  <td>{element.email}</td>
                                )}

                                {element.roles.length > 0
                                  ? element.roles.map((role) => (
                                      <React.Fragment key={role.id}>
                                        {checkFieldExist("Role") && (
                                          <td>{role.name}</td>
                                        )}
                                      </React.Fragment>
                                    ))
                                  : checkFieldExist("Builder") && <td>Admin</td>}

                                {element.builder ? (
                                  <>
                                    {checkFieldExist("Builder") && (
                                      <td>{element.builder.name}</td>
                                    )}
                                  </>
                                ) : (
                                  checkFieldExist("Builder") && <td>NA</td>
                                )}
  {checkFieldExist("Action") && (
                                <td>
                                  <div className="d-flex justify-content-center">
                                    <Link
                                      to={`/userupdate/${element.id}`}
                                      className="btn btn-primary shadow btn-xs sharp me-1"
                                    >
                                      <i className="fas fa-pencil-alt"></i>
                                    </Link>
                                    {element.roles.length > 0
                                      ? element.roles.map((role) => (
                                          <Link
                                            onClick={() =>
                                              swal({
                                                title: "Are you sure?",

                                                icon: "warning",
                                                buttons: true,
                                                dangerMode: true,
                                              }).then((willDelete) => {
                                                if (willDelete) {
                                                  handleDelete(element.id);
                                                }
                                              })
                                            }
                                            className="btn btn-danger shadow btn-xs sharp"
                                          >
                                            <i className="fa fa-trash"></i>
                                          </Link>
                                        ))
                                      : ""}
                                  </div>
                                </td>
                                )}
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="7" style={{ textAlign: "center" }}>
                                No data found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    )}
     
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <UserOffcanvas
        ref={product}
        Title="Add User"
        parentCallback={handleCallback}
      />
      <Offcanvas
        show={showOffcanvas}
        onHide={setShowOffcanvas}
        className="offcanvas-end customeoff"
        placement="end"
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="modal-title" id="#gridSystemModal">
            User Sale Details{" "}
          </h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowOffcanvas(false)}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="offcanvas-body">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xl-4 mt-4">
                <label className="">Name :</label>
                <div className="fw-bolder">{UserDetails.name || "NA"}</div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Email :</label>
                <div>
                  <span className="fw-bold">{UserDetails.email || "NA"}</span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Role :</label>
                <div>
                  <span className="fw-bold">
                    {UserDetails.roles.length > 0 ? (
                      UserDetails.roles.map((role) => (
                        <td key={role.id}>{role.name}</td>
                      ))
                    ) : (
                      <td>Admin</td>
                    )}
                  </span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Builder :</label>
                <div>
                  <span className="fw-bold">
                    {UserDetails.builder.name || "NA"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Offcanvas>
      <Offcanvas
        show={manageAccessOffcanvas}
        onHide={setManageAccessOffcanvas}
        className="offcanvas-end customeoff"
        placement="end"
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="modal-title" id="#gridSystemModal">
            Manage User Fields Access{" "}
          </h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setManageAccessOffcanvas(false)}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="offcanvas-body">
          <div className="container-fluid">
            <label className="form-label">
              Select Role: <span className="text-danger"></span>
            </label>
            <select
              className="default-select form-control"
              name="manage_role_fields"
              onChange={HandleRole}
              value={role}
            >
              <option value="Admin">Admin</option>
              <option value="Data Uploader">Data Uploader</option>
              <option value="User">User</option>
            </select>
            <form onSubmit={handleAccessForm}>
              <div className="row">
                {Array.isArray(accessList) &&
                  accessList.map((element, index) => (
                    <div className="col-md-4" key={index}>
                      <div className="mt-5">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            // defaultChecked={(() => {
                            //   const isChecked = element.role_name.includes(accessRole);
                            //   console.log(accessRole);
                            //   console.log(isChecked);
                            //   return isChecked;
                            // })()}
                            checked={checkedItems[element.field_name]}
                            onChange={handleCheckboxChange}
                            name={element.field_name}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`flexCheckDefault${index}`}
                          >
                            {element.field_name}
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              <button type="submit" className="btn btn-primary mt-3">
                Submit
              </button>
            </form>
          </div>
        </div>
      </Offcanvas>
    </>
  );
};

export default UserList;
