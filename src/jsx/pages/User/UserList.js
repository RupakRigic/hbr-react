import React, { useState, useEffect, useRef, Fragment } from "react";
import AdminUserRoleService from "../../../API/Services/AdminService/AdminUserRoleService";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import UserOffcanvas from "./UserOffcanvas";
import MainPagetitle from "../../layouts/MainPagetitle";
import { Offcanvas } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import ClipLoader from "react-spinners/ClipLoader";
import AccessField from "../../components/AccssFieldComponent/AccessFiled";
import ColumnReOrderPopup from "../../popup/ColumnReOrderPopup";
import BulkUserUpdateOffcanvas from "./BulkUserUpdateOffcanvas";
import Modal from "react-bootstrap/Modal";
import { MultiSelect } from "react-multi-select-component";

const UserList = () => {
  const navigate = useNavigate();
  const product = useRef();
  const bulkproduct = useRef();

  const [showSort, setShowSort] = useState(false);
  const handleSortClose = () => setShowSort(false);
  const [Error, setError] = useState("");
  const [userList, setUserList] = useState([]);
  const [userListCount, setUserCount] = useState('');
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
  const [selectedRole, setSelectedRole] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterQuery, setFilterQuery] = useState({
    role: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState([]);
  const [fieldOptions, setFieldOptions] = useState([]);
  const handleSortingPopupClose = () => setShowSortingPopup(false);
  const [showSortingPopup, setShowSortingPopup] = useState(false);
  const [selectedFields, setSelectedFields] = useState([]);
  const [selectionOrder, setSelectionOrder] = useState({});
  const [selectedCheckboxes, setSelectedCheckboxes] = useState(sortConfig.map(col => col.key));
  const [sortOrders, setSortOrders] = useState({});

  useEffect((currentPage) => {
    if (localStorage.getItem("usertoken")) {
      getuserList(currentPage, sortConfig, searchQuery);
    } else {
      navigate("/");
    }
  }, [currentPage]);

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

  useEffect(() => {
    if (localStorage.getItem("usertoken")) {
      getAccesslist();
    } else {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    setSelectedCheckboxes(sortConfig.map(col => col.key));
  }, [sortConfig]);

  const HandleSortDetailClick = (e) => {
    setShowSort(true);
  };

  const handleSortCheckboxChange = (e, key) => {
    if (e.target.checked) {
      setSelectedCheckboxes(prev => [...prev, key]);
    } else {
      setSelectedCheckboxes(prev => prev.filter(item => item !== key));
    }
  };

  const SyestemUserRole = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).role : "";

  const handleRemoveSelected = () => {
    const newSortConfig = sortConfig.filter(item => selectedCheckboxes.includes(item.key));
    setSortConfig(newSortConfig);
    setSelectedCheckboxes([]);
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
        setError(errorJson.message.substr(0, errorJson.message.lastIndexOf(".")));
      }
    }
  };

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
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(errorJson.message);
      }
    }
  };



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

  const stringifySortConfig = (sortConfig) => {
    return sortConfig.map((sort) => `${sort.key}:${sort.direction}`).join(",");
  };

  const getuserList = async (currentPage, sortConfig, searchQuery) => {
    setIsLoading(true);
    try {
      let sortConfigString = "";

      if (sortConfig !== null) {
        sortConfigString = "&sortConfig=" + stringifySortConfig(sortConfig);
      }

      const response = await AdminUserRoleService.index(currentPage, sortConfigString, searchQuery);

      const responseData = await response.json();
      setUserList(responseData.data);
      setNpage(Math.ceil(responseData.meta.total / recordsPage));
      setUserCount(responseData.meta.total);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(errorJson.message);
      }
    }
  };

  const handleDelete = async (e) => {
    try {
      let responseData = await AdminUserRoleService.destroy(e).json();
      if (responseData.status === true) {
        getuserList(currentPage, sortConfig, searchQuery);
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
        getuserList(currentPage, sortConfig, searchQuery);
      }
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(errorJson.message);
      }
    }
  };

  const handleCallback = () => {
    getuserList(currentPage, sortConfig, searchQuery);
  };
  const handleRowClick = async (id) => {
    setShowOffcanvas(true);
    setIsFormLoading(true);
    try {
      let responseData = await AdminUserRoleService.show(id).json();
      setUserDetails(responseData);
      setIsFormLoading(false);
    } catch (error) {
      if (error.name === "HTTPError") {
        setIsFormLoading(false);
        const errorJson = await error.response.json();
        setError(errorJson.message);
      }
    }
  };

  useEffect(() => {
    setSearchQuery(filterString());
  }, [filterQuery]);

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

  const handleSelectRoleChange = (selectedItems) => {
    setSelectedRole(selectedItems);
  }
  useEffect(() => {
    const fieldOptions = fieldList
      .filter((field) => field !== 'Action' && field !== 'Price Change Since Open' && field !== 'Price Change Last 12 Months' && field !== 'Current Price Per SQFT')
      .map((field) => {
        let value = field.charAt(0).toLowerCase() + field.slice(1).replace(/\s+/g, '');

        if (value === 'planStatus') {
          value = 'status';
        }
        if (value === 'productName') {
          value = 'name';
        }
        if (value === 'squareFootage') {
          value = 'sqft';
        }
        if (value === 'bedRooms') {
          value = 'bedroom';
        }
        if (value === 'bathRooms') {
          value = 'bathroom';
        }
        if (value === 'currentBasePrice') {
          value = 'recentprice';
        }
        if (value === 'productWebsite') {
          value = 'website';
        }
        if (value === 'productType') {
          value = 'product_type';
        }
        if (value === 'masterPlan') {
          value = 'masterplan_id';
        }
        if (value === 'zipCode') {
          value = 'zipcode';
        }
        if (value === 'lotWidth') {
          value = 'lotwidth';
        }
        if (value === 'lotSize') {
          value = 'lotsize';
        }
        if (value === 'ageRestricted') {
          value = 'age';
        }
        if (value === 'allSingleStory') {
          value = 'single';
        }
        if (value === 'dateAdded') {
          value = 'created_at';
        }
        if (value === '__pkProductID') {
          value = 'product_code';
        }
        if (value === '_fkSubID') {
          value = 'subdivision_code';
        }
        return {
          value: value,
          label: field,
        };
      });
    setFieldOptions(fieldOptions);
  }, [fieldList]);


  const HandleSortingPopupDetailClick = (e) => {
    setShowSortingPopup(true);
  };
  const handleSelectAllChange = (e) => {
    if (e.target.checked) {
      setSelectedFields(fieldOptions);
      const newOrder = {};
      fieldOptions.forEach((field, index) => {
        newOrder[field.value] = index + 1;
      });
      setSelectionOrder(newOrder);
    } else {
      setSelectedFields([]);
      setSelectionOrder({});
    }
  };
  const handleSortingCheckboxChange = (e, field) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setSelectedFields([...selectedFields, field]);
      setSelectionOrder((prevOrder) => ({
        ...prevOrder,
        [field.value]: Object.keys(prevOrder).length + 1,
      }));
    } else {
      setSelectedFields(selectedFields.filter((selected) => selected.value !== field.value));
      setSelectionOrder((prevOrder) => {
        const newOrder = { ...prevOrder };
        delete newOrder[field.value];
        const remainingFields = selectedFields.filter((selected) => selected.value !== field.value);
        remainingFields.forEach((field, index) => {
          newOrder[field.value] = index + 1;
        });
        return newOrder;
      });
    }
  };
  const handleSortOrderChange = (fieldValue, order) => {
    setSortOrders({
      ...sortOrders,
      [fieldValue]: order,
    });
  };

  const handleApplySorting = () => {
    const sortingConfig = selectedFields.map((field) => ({
      key: field.value,
      direction: sortOrders[field.value] || 'asc',
    }));
    setSortConfig(sortingConfig)
    getuserList(currentPage, sortingConfig, searchQuery);
    handleSortingPopupClose();
  };

  return (
    <Fragment>
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
                      <div class="btn-group mx-5" role="group" aria-label="Basic example"></div>
                      <ColumnReOrderPopup
                        open={openDialog}
                        fieldList={fieldList}
                        handleCloseDialog={handleCloseDialog}
                        handleSaveDialog={handleSaveDialog}
                        draggedColumns={draggedColumns}
                        handleColumnOrderChange={handleColumnOrderChange}
                      />
                    </div>
                    <div className="mt-2" style={{ width: "100%" }}>
                      {SyestemUserRole == "Data Uploader" ||
                        SyestemUserRole == "User" || SyestemUserRole == "Standard User" ? (
                        <div className="d-flex">
                          <button className="btn btn-primary btn-sm me-1" onClick={handleOpenDialog} title="Column Order">
                            <div style={{ fontSize: "11px" }}>
                              <i className="fa-solid fa-list" />&nbsp;
                              Columns Order
                            </div>
                          </button>
                          <Button
                            className="btn-sm me-1"
                            variant="secondary"
                            onClick={HandleSortingPopupDetailClick}
                            title="Sorted Fields"
                          >
                            <div style={{ fontSize: "11px" }}>
                              <i class="fa-solid fa-sort" />&nbsp;
                              Sort
                            </div>
                          </Button>
                          <Dropdown>
                            <Dropdown.Toggle
                              variant="success"
                              className="btn-sm"
                              id="dropdown-basic"
                              title="Filter"
                            >
                              <div style={{ fontSize: "11px" }}>
                                <i className="fa fa-filter" />&nbsp;
                                Filter
                              </div>
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                              <h5 className="">Filter Options</h5>
                              <div className="border-top">
                                <div className="mt-3 mb-3">
                                  <label className="form-label">
                                    Role:
                                  </label>
                                  <MultiSelect
                                    name="role"
                                    options={roleOptions}
                                    value={selectedRole}
                                    onChange={handleSelectRoleChange}
                                    placeholder={"Select Role"}
                                  />
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
                            <div style={{ fontSize: "11px" }}>
                              <i className="fa-solid fa-list"></i>&nbsp;
                              Columns Order
                            </div>
                          </button>
                          <Button
                            className="btn-sm me-1"
                            variant="secondary"
                            onClick={HandleSortingPopupDetailClick}
                            title="Sorted Fields"
                          >
                            <div style={{ fontSize: "11px" }}>
                              <i class="fa-solid fa-sort"></i>&nbsp;
                              Sort
                            </div>
                          </Button>
                          <Dropdown>
                            <Dropdown.Toggle
                              variant="success"
                              className="btn-sm btn-sm me-1"
                              id="dropdown-basic"
                              title="Filter"
                            >
                              <i className="fa fa-filter" />&nbsp;
                              Filter
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                              <h5 className="">Filter Options</h5>
                              <div className="border-top">
                                <div className="mt-3 mb-3">
                                  <label className="form-label">
                                    Role:
                                  </label>
                                  <MultiSelect
                                    name="role"
                                    options={roleOptions}
                                    value={selectedRole}
                                    onChange={handleSelectRoleChange}
                                    placeholder={"Select Role"}
                                  />
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
                          <button
                            className="btn btn-primary btn-sm me-1"
                            onClick={() => setManageAccessOffcanvas(true)}
                          >
                            <div style={{ fontSize: "11px" }}>
                              <i className="fa fa-shield" />&nbsp;
                              Field Access
                            </div>
                          </button>
                          <Link
                            to={"#"}
                            className="btn btn-primary btn-sm me-1"
                            data-bs-toggle="offcanvas"
                            onClick={() => product.current.showEmployeModal()}
                          >
                            <div style={{ fontSize: "11px" }}>
                              <i className="fa fa-plus" />&nbsp;
                              Add User
                            </div>
                          </Link>
                          <Link
                            to={"#"}
                            className="btn btn-primary btn-sm me-1"
                            data-bs-toggle="offcanvas"
                            onClick={() => bulkproduct.current.showEmployeModal()}
                          >
                            <div style={{ fontSize: "11px" }}>
                              <i className="fa fa-pencil" />&nbsp;
                              Edit
                            </div>
                          </Link>
                          <button
                            className="btn btn-danger btn-sm me-1"
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
                            <div style={{ fontSize: "11px" }}>
                              <i className="fa fa-trash" />&nbsp;
                              Bulk Delete
                            </div>
                          </button>
                        </div>
                      )}
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
                              <th style={{ textAlign: "center", cursor: "pointer" }} key={column.id}>
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
                                    {column.id == "first Name" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.name}</td>
                                    }
                                    {column.id == "last Name" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.last_name}</td>
                                    }
                                    {column.id == "email" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.email}</td>
                                    }
                                    {column.id == "role" &&
                                      // <td key={column.id} style={{ textAlign: "center" }}>{element.roles.length > 0 ? element.roles[0].name : "Admin"}</td>
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.roles.length == 2 ? element.roles[0].name + " & " + element.roles[1].name : element.roles.length == 1 ? element.roles[0].name : "NA"}</td>
                                    }
                                    {column.id == "company" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.company}</td>
                                    }
                                    {column.id == "notes" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.notes}</td>
                                    }
                                    {column.id == "builder" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.builder ? element.builder : "NA"}</td>
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
                                          <Link
                                            to={`/useranalytics/${element.id}`}
                                            className="btn btn-primary shadow btn-xs sharp me-1"
                                          >
                                            <i class="fa-regular fa-eye"></i>
                                          </Link>
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
      <UserOffcanvas
        ref={product}
        Title="Add User"
        parentCallback={handleCallback}
      />
      <BulkUserUpdateOffcanvas
        ref={bulkproduct}
        Title="Bulk Edit Users"
        userSelectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
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
            onClick={() => { setShowOffcanvas(false); clearPriceDetails(); }}
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
              <div className="d-flex" style={{ width: "100%", height: "10%" }}>
                <div className="d-flex" style={{ width: "50%" }}>
                  <div>
                    <label className="fw-bold" style={{ fontSize: "15px" }}>First Name:</label>
                  </div>
                  <div style={{ fontSize: "15px", marginLeft: "10px", borderColor: "black", width: "250px" }}>
                    <span style={{ marginLeft: "5px" }}>{UserDetails.name || "NA"}</span>
                  </div>
                </div>
                <div className="d-flex" style={{ width: "50%" }}>
                  <div>
                    <label className="fw-bold" style={{ fontSize: "15px" }}>Role:</label>
                  </div>
                  <div style={{ fontSize: "15px", marginLeft: "10px", borderColor: "black", width: "250px" }}>
                    <span style={{ marginLeft: "5px" }}>
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
              </div>
              <div className="col-xl-4 mt-4 d-flex" style={{ width: "100%" }}>
                <div>
                  <label className="fw-bold" style={{ fontSize: "15px" }}>Last Name:</label>
                </div>
                <div style={{ fontSize: "15px", marginLeft: "10px", borderColor: "black", width: "250px" }}>
                  <span style={{ marginLeft: "5px" }}>{UserDetails.last_name || "NA"}</span>
                </div>
              </div>

              <div className="col-xl-4 mt-4 d-flex" style={{ width: "100%" }}>
                <div>
                  <label className="fw-bold" style={{ marginLeft: "35px", fontSize: "15px" }}>Email:</label>
                </div>
                <div style={{ fontSize: "15px", marginLeft: "10px", borderColor: "black", width: "250px" }}>
                  <span style={{ marginLeft: "5px" }}>{UserDetails.email || "NA"}</span>
                </div>
              </div>

              <div className="col-xl-4 mt-4 d-flex" style={{ width: "100%" }}>
                <div>
                  <label className="fw-bold" style={{ fontSize: "15px", marginLeft: "5px" }}>Company:</label>
                </div>
                <div style={{ fontSize: "15px", marginLeft: "10px", borderColor: "black", width: "250px" }}>
                  <span style={{ marginLeft: "5px" }}>{UserDetails.company || "NA"}</span>
                </div>
              </div>

              <div className="col-xl-4 mt-4 d-flex" style={{ width: "100%" }}>
                <div>
                  <label className="fw-bold" style={{ fontSize: "15px", marginLeft: "30px" }}>Notes:</label>
                </div>
                <div style={{ fontSize: "15px", marginLeft: "10px", borderColor: "black", width: "250px", height: "250px" }}>
                  <span style={{ marginLeft: "5px" }}>{UserDetails.notes || "NA"}</span>
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
              Select Role:
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

      {/* Sorting */}
      <Modal show={showSortingPopup} onHide={HandleSortingPopupDetailClick}>
        <Modal.Header handleSortingPopupClose>
          <Modal.Title>Sorted Fields</Modal.Title>
          <button
            className="btn-close"
            aria-label="Close"
            onClick={() => handleSortingPopupClose()}
          ></button>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <div className="row">
            <div style={{ marginTop: "-15px" }}>
              <label className="form-label" style={{ fontWeight: "bold", fontSize: "15px" }}>List of Fields:</label>
              <div className="field-checkbox-list">
                <div className="form-check d-flex align-items-center mb-2" style={{ width: '100%' }}>
                  <div className="d-flex align-items-center" style={{ flex: '0 0 40%' }}>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="select-all-fields"
                      checked={selectedFields.length === fieldOptions.length}
                      onChange={handleSelectAllChange}
                      style={{ marginRight: '0.2rem', cursor: "pointer" }}
                    />
                    <label className="form-check-label mb-0" htmlFor="select-all-fields" style={{ width: "150px", cursor: "pointer" }}>
                      Select All
                    </label>
                  </div>
                </div>

                {fieldOptions.map((field, index) => {
                  const isChecked = selectedFields.some(selected => selected.value === field.value);
                  const fieldOrder = selectionOrder[field.value];

                  return (
                    <div key={index} className="form-check d-flex align-items-center mb-2" style={{ width: '100%', height: "20px" }}>
                      <div className="d-flex align-items-center" style={{ flex: '0 0 40%' }}>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={`field-checkbox-${index}`}
                          value={field.value}
                          checked={isChecked}
                          onChange={(e) => handleSortingCheckboxChange(e, field)}
                          style={{ marginRight: '0.2rem', cursor: "pointer" }}
                        />
                        <label className="form-check-label mb-0" htmlFor={`field-checkbox-${index}`} style={{ width: "150px", cursor: "pointer" }}>
                          {isChecked && <span>{fieldOrder}. </span>}
                          {field.label}
                        </label>
                      </div>

                      {isChecked && (
                        <div className="radio-group d-flex" style={{ flex: '0 0 60%', paddingTop: "5px" }}>
                          <div className="form-check form-check-inline" style={{ flex: '0 0 50%' }}>
                            <input
                              type="radio"
                              className="form-check-input"
                              name={`sortOrder-${field.value}`}
                              id={`asc-${field.value}`}
                              value="asc"
                              checked={sortOrders[field.value] === 'asc' || !sortOrders[field.value]}
                              onChange={() => handleSortOrderChange(field.value, 'asc')}
                              style={{ cursor: "pointer" }}
                            />
                            <label className="form-check-label mb-0" htmlFor={`asc-${field.value}`} style={{ cursor: "pointer", marginLeft: "-40px" }}>
                              Ascending
                            </label>
                          </div>
                          <div className="form-check form-check-inline" style={{ flex: '0 0 50%' }}>
                            <input
                              type="radio"
                              className="form-check-input"
                              name={`sortOrder-${field.value}`}
                              id={`desc-${field.value}`}
                              value="desc"
                              checked={sortOrders[field.value] === 'desc'}
                              onChange={() => handleSortOrderChange(field.value, 'desc')}
                              style={{ cursor: "pointer" }}
                            />
                            <label className="form-check-label mb-0" htmlFor={`desc-${field.value}`} style={{ cursor: "pointer", marginLeft: "-30px" }}>
                              Descending
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleSortingPopupClose} style={{ marginRight: "10px" }}>Close</Button>
          <Button variant="success" onClick={() => handleApplySorting(selectedFields, sortOrders)}>Apply</Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};

export default UserList;
