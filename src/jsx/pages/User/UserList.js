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

const UserList = () => {
  const [Error, setError] = useState("");
  const navigate = useNavigate();
  const [userList, setUserList] = useState([]);
  // const [currentPage, setCurrentPage] = useState(1);
  // const recordsPage = 20;
  // const lastIndex = currentPage * recordsPage;
  // const firstIndex = lastIndex - recordsPage;
  // const records = userList.slice(firstIndex, lastIndex);
  // const npage = Math.ceil(userList.length / recordsPage);
  // const number = [...Array(npage + 1).keys()].slice(1);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [UserDetails, setUserDetails] = useState({
    builder: "",
    name: "",
    email: "",
    roles: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filterQuery, setFilterQuery] = useState({
    role: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  // function prePage() {
  //   if (currentPage !== 1) {
  //     setCurrentPage(currentPage - 1);
  //   }
  // }
  // function changeCPage(id) {
  //   setCurrentPage(id);
  // }
  // function nextPage() {
  //   if (currentPage !== npage) {
  //     setCurrentPage(currentPage + 1);
  //   }
  // }

  const product = useRef();
  const getuserList = async () => {
    try {
      const response = await AdminUserRoleService.index(searchQuery);
      const responseData = await response.json();
      setUserList(responseData);
      setIsLoading(false);

    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(errorJson.message);
      }
    }
  };
  useEffect(() => {
    if (localStorage.getItem("usertoken")) {
      getuserList();
    } else {
      navigate("/");
    }
  }, []);
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
      debouncedHandleSearch(`?q=${query}`);
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

    return queryString ? `?${queryString}` : "";
  };

  const HandleCancelFilter = (e) => {
    setFilterQuery({
      role: "",
    });
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
                  <div className="tbl-caption d-flex justify-content-between text-wrap align-items-center">
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
                          style={{ borderTopLeftRadius: '0',borderBottomLeftRadius: '0' }}
                          onChange={HandleSearch}
                          placeholder="Quick Search"
                        />
                      </div>
                    </div>
                    <div className="d-flex">
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
                                <option value="Data Uploader">Data Uploader</option>
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
                          <th>
                            <strong>Name</strong>
                          </th>
                          <th>
                            <strong>Email</strong>
                          </th>
                          <th>
                            <strong>Role</strong>
                          </th>
                          <th>
                            <strong>Builder</strong>
                          </th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody style={{ textAlign: "center" }}>
                        {userList !== null && userList.length > 0 ? (
                          userList.map((element, index) => (
                            <tr
                              onClick={() => handleRowClick(element.id)}
                              key={element.id}
                              style={{ textAlign: "center", cursor: "pointer" }}
                            >
                              <td>{index + 1}</td>
                              <td>{element.name}</td>
                              <td>{element.email}</td>
                              {element.roles.length > 0 ? (
                                element.roles.map((role) => (
                                  <td key={role.id}>{role.name}</td>
                                ))
                              ) : (
                                <td>Admin</td>
                              )}
                              {element.builder ? (
                                <td>{element.builder.name}</td>
                              ) : (
                                <td>NA</td>
                              )}
                              <td>
                                <div className="d-flex">
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
                    {/* <div className="d-sm-flex text-center justify-content-between align-items-center">
                      <div className="dataTables_info">
                        Showing {lastIndex - recordsPage + 1} to{" "}
                        {userList.length < lastIndex
                          ? userList.length
                          : lastIndex}{" "}
                        of {userList.length} entries
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
                          {number.map((n, i) => (
                            <Link
                              className={`paginate_button ${
                                currentPage === n ? "current" : ""
                              } `}
                              key={i}
                              onClick={() => changeCPage(n)}
                            >
                              {n}
                            </Link>
                          ))}
                        </span>
                        <Link
                          className="paginate_button next"
                          to="#"
                          onClick={nextPage}
                        >
                          <i className="fa-solid fa-angle-right" />
                        </Link>
                      </div>
                    </div> */}
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
    </>
  );
};

export default UserList;
