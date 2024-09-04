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
import ColumnReOrderPopup from "../../popup/ColumnReOrderPopup";
import BulkUserUpdateOffcanvas from "./BulkUserUpdateOffcanvas";
import Modal from "react-bootstrap/Modal";
import Select from "react-select";
import { MultiSelect } from "react-multi-select-component";

const UserList = () => {

  const HandleSortDetailClick = (e) =>
    {
        setShowSort(true);
    }
    const handleSortCheckboxChange = (e, key) => {
      if (e.target.checked) {
          setSelectedCheckboxes(prev => [...prev, key]);
      } else {
          setSelectedCheckboxes(prev => prev.filter(item => item !== key));
      }
  };
  const SyestemUserRole = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user")).role
  : "";
  
  const handleRemoveSelected = () => {
      const newSortConfig = sortConfig.filter(item => selectedCheckboxes.includes(item.key));
      setSortConfig(newSortConfig);
      setSelectedCheckboxes([]);
  };
  const [showSort, setShowSort] = useState(false);
  const handleSortClose = () => setShowSort(false);
  const [Error, setError] = useState("");
  const navigate = useNavigate();
  const [userList, setUserList] = useState([]);
  console.log("userList",userList);
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
  const clearPriceDetails = () => {
    setUserDetails({
      builder: "",
      name: "",
      email: "",
      roles: "",
    });
  };

  const [manageAccessOffcanvas, setManageAccessOffcanvas] = useState(false);
  const [accessList, setAccessList] = useState({});
  const [accessRole, setAccessRole] = useState("Admin");
  const [accessForm, setAccessForm] = useState({});
  const [role, setRole] = useState("Admin");
  const [checkedItems, setCheckedItems] = useState({}); // State to manage checked items
  const fieldList = AccessField({ tableName: "users" });

  const [openDialog, setOpenDialog] = useState(false);
  const [columns, setColumns] = useState([]);
  const [draggedColumns, setDraggedColumns] = useState(columns);
  const [selectedUsers, setSelectedUsers] = useState([]);
  console.log("userselect",selectedUsers);

  const [selectedRole, setSelectedRole] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);


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
        window.location.reload();
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
  const [isFormLoading, setIsFormLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState([]);
  useEffect(() => {
    setSelectedCheckboxes(sortConfig.map(col => col.key));
}, [sortConfig]);


  const [selectedCheckboxes, setSelectedCheckboxes] = useState(sortConfig.map(col => col.key));

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
  const bulkproduct = useRef();
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

  const handleBulkDelete = async (id) => {
    try {
      let responseData = await AdminUserRoleService.bulkdestroy(id).json();
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
    setShowOffcanvas(true);
    setIsFormLoading(true);
    try {
      let responseData = await AdminUserRoleService.show(id).json();
      setUserDetails(responseData);
      setIsFormLoading(false);
      console.log(responseData);
    } catch (error) {
      if (error.name === "HTTPError") {
        setIsFormLoading(false);
        const errorJson = await error.response.json();
        setError(errorJson.message);
      }
    }
  };
  // const debouncedHandleSearch = useRef(
  //   debounce((value) => {
  //     setSearchQuery(value);
  //   }, 1000)
  // ).current;

  // useEffect(() => {
  //   getuserList();
  // }, [searchQuery]);

  // const HandleSearch = (e) => {
  //   setIsLoading(true);
  //   const query = e.target.value.trim();
  //   if (query) {
  //     debouncedHandleSearch(`&q=${query}`);
  //   } else {
  //     setSearchQuery("");
  //   }
  // };
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

  const handleOpenDialog = () => {
    setDraggedColumns(columns);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setDraggedColumns(columns);
    setOpenDialog(false);
  };

  const handleSaveDialog = () => {
    setColumns(draggedColumns);
    setOpenDialog(false);
  };

  const handleColumnOrderChange = (result) => {
    if (!result.destination) {
      return;
    }
    const newColumns = Array.from(draggedColumns);
    const [movedColumn] = newColumns.splice(result.source.index, 1);
    newColumns.splice(result.destination.index, 0, movedColumn);
    setDraggedColumns(newColumns);
  };

  const handleEditCheckboxChange = (e, userId) => {
    if (e.target.checked) {
      setSelectedUsers((prevSelectedUsers) => [...prevSelectedUsers, userId]);
    } else {
      setSelectedUsers((prevSelectedUsers) => prevSelectedUsers.filter((id) => id !== userId));
    }
  };

  useEffect(() => {
    const mappedColumns = fieldList.map((data) => ({
      id: data.charAt(0).toLowerCase() + data.slice(1),
      label: data
    }));
    setColumns(mappedColumns);
  }, [fieldList]);

  const roleOptions = [
    { value: "User", label: "User" },
    { value: "Data Uploader", label: "Data Uploader" }
  ];

  const handleSelectRoleChange  = (selectedItems) => {  
    const selectedValues = selectedItems.map(item => item.value);
    setSelectedValues(selectedValues);
    setSelectedRole(selectedItems);
  }

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
                        {/* <button class="btn btn-secondary cursor-none">
                          {" "}
                          <i class="fas fa-search"></i>{" "}
                        </button> */}
                        {/* <Form.Control
                          type="text"
                          style={{
                            borderTopLeftRadius: "0",
                            borderBottomLeftRadius: "0",
                          }}
                          onChange={HandleSearch}
                          placeholder="Quick Search"
                        /> */}
                      </div>
                      <ColumnReOrderPopup
                        open={openDialog}
                        fieldList={fieldList}
                        handleCloseDialog={handleCloseDialog}
                        handleSaveDialog={handleSaveDialog}
                        draggedColumns={draggedColumns}
                        handleColumnOrderChange={handleColumnOrderChange}
                      />
                    </div>
                    {SyestemUserRole == "Data Uploader" ||
                      SyestemUserRole == "User" ||  SyestemUserRole == "Standard User" ? (
                        <div className="d-flex">
                          <button className="btn btn-primary btn-sm me-1" onClick={handleOpenDialog} title="Column Order">
                            {/* Set Columns Order */}
                            <i className="fa-solid fa-list"></i>
                          </button>
                          <Button
                            className="btn-sm me-1"
                            variant="secondary"
                            onClick={HandleSortDetailClick}
                            title="Sorted Fields"
                          >
                            <i class="fa-solid fa-sort"></i>
                          </Button>
                          <Dropdown>
                          <Dropdown.Toggle
                            variant="success"
                            className="btn-sm"
                            id="dropdown-basic"
                            title="Filter"
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
                                <MultiSelect
                                  name="role"
                                  options={roleOptions}
                                  value={selectedRole}
                                  onChange={handleSelectRoleChange }
                                  placeholder={"Select Role"} 
                                />
                                {/* <select
                                  className="default-select form-control"
                                  value={filterQuery.role}
                                  name="role"
                                  onChange={HandleFilter}
                                >
                                  <option data-display="Select">Please select</option>
                                  <option value="">All</option>
                                  <option value="User">User</option>
                                  <option value="Data Uploader">
                                    Data Uploader
                                  </option>
                                </select> */}
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
                        </div>
                      ) : (
                    <div className="d-flex">
                      <button className="btn btn-primary btn-sm me-1" onClick={handleOpenDialog} title="Column Order">
                        {/* Set Columns Order */}
                        <i className="fa-solid fa-list"></i>
                      </button>
                    <Button
                            className="btn-sm me-1"
                            variant="secondary"
                            onClick={HandleSortDetailClick}
                            title="Sorted Fields"
                          >
                            <i class="fa-solid fa-sort"></i>
                     </Button>
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
                          title="Filter"
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
                              <MultiSelect
                                name="role"
                                options={roleOptions}
                                value={selectedRole}
                                onChange={handleSelectRoleChange }
                                placeholder={"Select Role"} 
                              />
                              {/* <select
                                className="default-select form-control"
                                value={filterQuery.role}
                                name="role"
                                onChange={HandleFilter}
                              >
                                <option data-display="Select">Please select</option>
                                <option value="">All</option>
                                <option value="User">User</option>
                                <option value="Data Uploader">
                                  Data Uploader
                                </option>
                              </select> */}
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
                      <Link
                        to={"#"}
                        className="btn btn-primary btn-sm ms-1"
                        data-bs-toggle="offcanvas"
                        onClick={() => bulkproduct.current.showEmployeModal()}
                      >
                        Bulk Edit
                      </Link>
                      <button
                        className="btn btn-danger btn-sm me-1"
                        style={{marginLeft: "3px"}}
                        onClick={() => selectedUsers.length > 0 ? swal({
                          title: "Are you sure?",
                          icon: "warning",
                          buttons: true,
                          dangerMode: true,
                        }).then((willDelete) => {
                          if (willDelete) {
                            handleBulkDelete(selectedUsers);
                          }
                        }) : ""}
                      >
                        Bulk Delete
                      </button>
                    </div>
                      )}
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
                            <input
                              type="checkbox"
                              style={{
                                cursor: "pointer",
                              }}
                              checked={selectedUsers.length === userList.length}
                              onChange={(e) =>
                                e.target.checked
                                  ? setSelectedUsers(userList.map((user) => user.id))
                                  : setSelectedUsers([])
                              }
                            />
                          </th>
                            <th>
                              <strong>No.</strong>
                            </th>
                            {columns.map((column) => (
                              <th style={{ textAlign: "center", cursor: "pointer" }} key={column.id} onClick={() => column.id != "action" ? requestSort(column.id == "builder" ? "builderName" : column.id) : ""}>
                                <strong>
                                  {column.label}
                                  {column.id != "action" && sortConfig.some(
                                    (item) => item.key === (column.id == "builder" ? "builderName" : column.id)
                                    ) ? (
                                      <span>
                                        {column.id != "action" && sortConfig.find(
                                          (item) => item.key === (column.id == "builder" ? "builderName" : column.id)
                                          ).direction === "asc" ? "↑" : "↓"
                                        }
                                      </span>
                                    ) : (
                                    column.id != "action" && <span>↑↓</span>
                                  )}
                                </strong>
                              </th>
                            ))}
                            {/* {checkFieldExist("Name") && (
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
                            {checkFieldExist("Action  ") && (
                              <th>
                                Action
                              </th>
                            )} */}
                          </tr>
                        </thead>
                        <tbody style={{ textAlign: "center" }}>
                          {userList !== null && userList.length > 0 ? (
                            userList.map((element, index) => (
                              <tr
                                onClick={(e) => {
                                  if (e.target.type == "checkbox") {
                                    return;
                                  } else if (e.target.className == "btn btn-danger shadow btn-xs sharp" || e.target.className == "fa fa-trash") {
                                    return;
                                  } else {
                                    handleRowClick(element.id);
                                  }
                                }}
                                style={{
                                  textAlign: "center",
                                  cursor: "pointer",
                                }}
                              >
                                <td>
                                  <input
                                    type="checkbox"
                                    checked={selectedUsers.includes(element.id)}
                                    onChange={(e) => handleEditCheckboxChange(e, element.id)}
                                    style={{
                                      cursor: "pointer",
                                    }}
                                  />
                                </td>
                                <td>{index + 1}</td>
                                {columns.map((column) => (
                                  <>
                                  {column.id == "name" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.name}</td>
                                  }
                                  {column.id == "email" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.email}</td>
                                  }
                                  {column.id == "role" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.roles.length > 0 ? element.roles[0].name : "Admin"}</td>
                                  }
                                  {column.id == "builder" && 
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.builder ? element.builder.name : "NA"}</td>
                                  }
                                  {column.id == "action" && 
                                    <td key={column.id} style={{ textAlign: "center" }}>
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
                                  }
                                  </>
                                ))}
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
      <BulkUserUpdateOffcanvas
        ref={bulkproduct}
        Title="Bulk Edit Users"
        userSelectedUsers={selectedUsers}
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
            onClick={() => {setShowOffcanvas(false);clearPriceDetails();}}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        {isFormLoading ? (
          <div className="d-flex justify-content-center align-items-center mb-5">
            <ClipLoader color="#4474fc" />
          </div>
        ) : (
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
                  {UserDetails?.builder?.name ?? "NA"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>)}
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
              <option value="User">Standard User</option>
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
      <Modal show={showSort} onHide={HandleSortDetailClick}>
        <Modal.Header handleSortClose>
          <Modal.Title>Sorted Fields</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {sortConfig.length > 0 ? (
                sortConfig.map((col) => (
                    <div className="row" key={col.key}>
                        <div className="col-md-6">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name={col.key}
                                    defaultChecked={true}
                                    id={`checkbox-${col.key}`}
                                    onChange={(e) => handleSortCheckboxChange(e, col.key)}
                                />
                                <label className="form-check-label" htmlFor={`checkbox-${col.key}`}>
                                <span>{col.key}</span>:<span>{col.direction}</span>
                                    
                                </label>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p>N/A</p>
            )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleSortClose}>
            cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleRemoveSelected}
          >
           Clear Sort
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserList;
