import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import AdminBuilderService from "../../../API/Services/AdminService/AdminBuilderService";
import BuilderOffcanvas from "./BuilderOffcanvas";
import { Form, Offcanvas } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import clientAuth from "../../../API/clientAuth";
import MainPagetitle from "../../layouts/MainPagetitle";
import { debounce } from "lodash";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import ClipLoader from "react-spinners/ClipLoader";

const BuilderTable = () => {
  const [Error, setError] = useState("");
  var imageUrl = process.env.REACT_APP_Builder_IMAGE_URL;
  const [searchQuery, setSearchQuery] = useState("");
  const [filterQuery, setFilterQuery] = useState({
    is_active: "",
    company_type: "",
  });
  const [BuilderList, setBuilderList] = useState(null);
  const navigate = useNavigate();
  const SyestemUserRole = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).role
    : "";
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [manageAccessOffcanvas, setManageAccessOffcanvas] = useState(false);
  const [accessList, setAccessList] = useState({});
  const [accessRole, setAccessRole] = useState("Admin");
  const userRole = JSON.parse(localStorage.getItem("user")).role;
  const [accessForm, setAccessForm] = useState({});
  const [BuilderDetails, SetBuilderDetails] = useState({
    code: "",
    name: "",
    website: "",
    phone: "",
    fax: "",
    officeaddress1: "",
    officeaddress2: "",
    city: "",
    zipcode: "",
    isActive: "",
    company_type: "",
    stock_market: "",
    current_division_president: "",
    stock_symbol: "",
    current_land_aquisitions: "",
    coporate_officeaddress_1: "",
    coporate_officeaddress_2: "",
    coporate_officeaddress_city: "",
    coporate_officeaddress_zipcode: "",
    coporate_officeaddress_lat: "",
    coporate_officeaddress_lng: "",
    logo: "",
  });
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  const builder = useRef();
  const [value, setValue] = React.useState("1");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getbuilderlist = async () => {
    try {
      const response = await AdminBuilderService.index(searchQuery);
      const responseData = await response.json();
      setBuilderList(responseData);
      setIsLoading(false);
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
      getbuilderlist();
    } else {
      navigate("/");
    }
  }, []);

  const getAccesslist = async () => {
    try {
      const response = await AdminBuilderService.accessField();
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

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("usertoken")) {
      getAccesslist();
    } else {
      navigate("/");
    }
  }, []);

  const handleDelete = async (e) => {
    try {
      let responseData = await AdminBuilderService.destroy(e).json();
      if (responseData.status === true) {
        getbuilderlist();
      }
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(errorJson.message);
      }
    }
  };

  const handleCallback = () => {
    getbuilderlist();
  };

  const handleRowClick = async (id) => {
    try {
      let responseData = await AdminBuilderService.show(id).json();
      SetBuilderDetails(responseData);
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
    getbuilderlist();
  }, [searchQuery]);

  useEffect(() => {
    setSearchQuery(filterString());
  }, [filterQuery]);

  const HandleSearch = (e) => {
    setIsLoading(true);
    const query = e.target.value.trim();
    debouncedHandleSearch(`?q=${query}`);
  };

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
      is_active: "",
      company_type: "",
    });
  };
  const handleDetailRedirectClick = () => {
    navigate("/subdivisionlist");
  };

  // const handleUnchecked =(event) =>{
  //   const isChecked = event.target.checked;
  // }

  const handleUnchecked = (event) => {
    const isChecked = event.target.checked;

    const { name, checked } = event.target;
    setAccessForm((prevAccessForm) => ({
      ...prevAccessForm,
      [name]: checked,
    }));
  };

  const handleAccessForm = (e) => {
    e.preventDefault();
    console.log("Form Data:", accessForm);
  };
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key) {
      direction = sortConfig.direction === "asc" ? "desc" : "asc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = () => {
    const sorted = [...BuilderList];
    if (sortConfig.key !== "") {
      sorted.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sorted;
  };
  return (
    <>
      <MainPagetitle
        mainTitle="Builers"
        pageTitle="Builders"
        parentTitle="Home"
      />
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-12">
            <div className="card">
              <div className="card-body p-0">
                <div className="table-responsive custom-overflow active-projects style-1 ItemsCheckboxSec shorting">
                  <div className="tbl-caption d-flex justify-content-between text-wrap align-items-center">
                    <div className="d-flex text-nowrap justify-content-between align-items-center">
                      <h4 className="heading mb-0 ">Builder List</h4>

                      <div
                        class="btn-group mx-5"
                        role="group"
                        aria-label="Basic example"
                      >
                        <button class="btn btn-secondary cursor-none">
                          {" "}
                          <i class="fas fa-search"></i>
                        </button>
                        <Form.Control
                          type="text"
                          className=""
                          style={{
                            borderTopLeftRadius: "0",
                            borderBottomLeftRadius: "0",
                          }}
                          onChange={HandleSearch}
                          placeholder="Quick Search"
                        />
                      </div>
                    </div>

                    <div>
                      {SyestemUserRole == "Data Uploader" ||
                      SyestemUserRole == "User" ? (
                        ""
                      ) : (
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
                                <div className="mt-3 mb-1">
                                  <label className="form-label">
                                    Status:{" "}
                                    <span className="text-danger"></span>
                                  </label>
                                  <select
                                    className="default-select form-control"
                                    value={filterQuery.is_active}
                                    name="is_active"
                                    onChange={HandleFilter}
                                  >
                                    {/* <option data-display="Select">Please select</option> */}
                                    <option value="">All</option>
                                    <option value="1">Active</option>
                                    <option value="0">De-active</option>
                                  </select>
                                </div>
                              </div>
                              <div className="mb-3">
                                <label className="form-label">
                                  Company Type:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <select
                                  className="default-select form-control"
                                  name="company_type"
                                  value={filterQuery.company_type}
                                  onChange={HandleFilter}
                                >
                                  {/* <option data-display="Select">Please select</option> */}
                                  <option value="">All</option>
                                  <option value="private">Private</option>
                                  <option value="public">Public</option>
                                </select>
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
                            onClick={() => builder.current.showEmployeModal()}
                          >
                            + Add Builder
                          </Link>
                        </div>
                      )}
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
                        className="table ItemsCheckboxSec dataTable"
                      >
                        <thead>
                          <tr style={{ textAlign: "center" }}>
                            <th>
                              <strong>No.</strong>
                            </th>
                            <th onClick={() => requestSort("name")}>
                              <strong>Name</strong>
                              {sortConfig.key !== "name"
                                ? "↑↓"
                                : ""}

                              {sortConfig.key === "name" && (
                                <span>
                                  {sortConfig.direction === "asc" ? "↑" : "↓"}
                                </span>
                              )}
                            </th>
                            <th>
                              <strong>Logo</strong>
                            </th>
                            <th onClick={() => requestSort("phone")}>
                              <strong>Phone</strong>
                              {sortConfig.key !== "phone"
                                ? "↑↓"
                                : ""}

                              {sortConfig.key === "phone" && (
                                <span>
                                  {sortConfig.direction === "asc" ? "↑" : "↓"}
                                </span>
                              )}
                            </th>
                            <th onClick={() => requestSort("company_type")}>
                              <strong>Company Type</strong>
                              {sortConfig.key !== "company_type"
                                ? "↑↓"
                                : ""}

                              {sortConfig.key === "company_type" && (
                                <span>
                                  {sortConfig.direction === "asc" ? "↑" : "↓"}
                                </span>
                              )}
                            </th>
                            <th onClick={() => requestSort("officeaddress1")}>

                              <strong>Office Address</strong>
                              {sortConfig.key !== "officeaddress1"
                                ? "↑↓"
                                : ""}

                              {sortConfig.key === "officeaddress1" && (
                                <span>
                                  {sortConfig.direction === "asc" ? "↑" : "↓"}
                                </span>
                              )}
                            </th>
                            <th>
                              <strong>Action</strong>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedData() !== null && sortedData().length > 0 ? (
                            sortedData().map((element, index) => (
                              <tr
                                onClick={() => handleRowClick(element.id)}
                                key={element.id}
                                style={{
                                  textAlign: "center",
                                  cursor: "pointer",
                                }}
                              >
                                <td>{index + 1}</td>
                                <td>{element.name}</td>
                                <td>
                                  <div>
                                    <img
                                      src={
                                        element.logo
                                          ? imageUrl + element.logo
                                          : ""
                                      }
                                      className="rounded-lg me-2"
                                      width="70"
                                      alt=""
                                    />
                                  </div>
                                </td>
                                <td>{element.phone}</td>
                                <td>{element.company_type}</td>
                                <td>{element.officeaddress1}</td>
                                <td>
                                  {SyestemUserRole === "Data Uploader" ||
                                  SyestemUserRole === "User" ? (
                                    ""
                                  ) : (
                                    <div className="d-flex justify-content-end">
                                      <Link
                                        to={`/builderUpdate/${element.id}`}
                                        className="btn btn-primary shadow btn-xs sharp me-1"
                                      >
                                        <i className="fas fa-pencil-alt"></i>
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
                                  )}
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
                        {BuilderList.length < lastIndex
                          ? BuilderList.length
                          : lastIndex}{" "}
                        of {BuilderList.length} entries
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
      {SyestemUserRole == "Data Uploader" || SyestemUserRole == "User" ? (
        ""
      ) : (
        <BuilderOffcanvas
          ref={builder}
          Title="Add Builder"
          parentCallback={handleCallback}
        />
      )}

      <Offcanvas
        show={showOffcanvas}
        onHide={setShowOffcanvas}
        className="offcanvas-end customeoff"
        placement="end"
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="modal-title" id="#gridSystemModal">
            Builder Details{" "}
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
            <div>
              <Box sx={{ width: "100%", typography: "body1" }}>
                <TabContext value={value}>
                  <Box>
                    <TabList
                      onChange={handleChange}
                      aria-label="lab API tabs example"
                    >
                      <Tab label="Builder Details" value="1" />
                      <Tab label="Subdivisions" value="2" />
                    </TabList>
                  </Box>
                  <TabPanel value="1" className="p-0">
                    <div className="card">
                      <div className="card-body p-0">
                        <div className="mt-3">
                          <label>Logo</label>
                          <div className="dz-default dlab-message upload-img mb-3">
                            <div>
                              {BuilderDetails.logo ? (
                                <img
                                  src={imageUrl + BuilderDetails.logo}
                                  className="rounded-lg me-2"
                                  width="70"
                                  alt=""
                                />
                              ) : (
                                "NA"
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-xl-4 mt-4">
                            <label className="">Builder Code:</label>
                            <div>
                              <span className="fw-bold">
                                {BuilderDetails.builder_code || "NA"}
                              </span>
                            </div>
                          </div>

                          <div className="col-xl-4 mt-4">
                            <label className="">Name:</label>
                            <div>
                              <span className="fw-bold">
                                {BuilderDetails.name || "NA"}
                              </span>
                            </div>
                          </div>

                          <div className="col-xl-4 mt-4">
                            <label className="">Website:</label>
                            <div>
                              <span className="fw-bold">
                                {BuilderDetails.website || "NA"}
                              </span>
                            </div>
                          </div>

                          <div className="col-xl-4 mt-4">
                            <label className="">Mobile:</label>
                            <div>
                              <span className="fw-bold">
                                {BuilderDetails.phone || "NA"}
                              </span>
                            </div>
                          </div>

                          <div className="col-xl-4 mt-4">
                            <label className="">Fax:</label>
                            <div>
                              <span className="fw-bold">
                                {BuilderDetails.fax || "NA"}
                              </span>
                            </div>
                          </div>

                          <div className="col-xl-4 mt-4">
                            <label className="">Is Active:</label>
                            <div>
                              <span className="fw-bold">
                                {BuilderDetails.status || "NA"}
                              </span>
                            </div>
                          </div>

                          <div className="col-xl-4 mt-4">
                            <label className="">Office Address 1:</label>
                            <div>
                              <span className="fw-bold">
                                {BuilderDetails.officeaddress1 || "NA"}
                              </span>
                            </div>
                          </div>

                          <div className="col-xl-4 mt-4">
                            <label className="">Office Address 2:</label>
                            <div>
                              <span className="fw-bold">
                                {BuilderDetails.officeaddress2 || "NA"}
                              </span>
                            </div>
                          </div>

                          <div className="col-xl-4 mt-4">
                            <label className="">City:</label>
                            <div>
                              <span className="fw-bold">
                                {BuilderDetails.city || "NA"}
                              </span>
                            </div>
                          </div>

                          <div className="col-xl-4 mt-4">
                            <label className="">Zipcode:</label>
                            <div>
                              <span className="fw-bold">
                                {BuilderDetails.zipcode || "NA"}
                              </span>
                            </div>
                          </div>

                          <div className="col-xl-4 mt-4">
                            <label className="">Stock Market:</label>
                            <div>
                              <span className="fw-bold">
                                {BuilderDetails.stock_market || "NA"}
                              </span>
                            </div>
                          </div>

                          <div className="col-xl-4 mt-4">
                            <label className="">
                              Current Division President:
                            </label>
                            <div>
                              <span className="fw-bold">
                                {BuilderDetails.current_division_president ||
                                  "NA"}
                              </span>
                            </div>
                          </div>

                          <div className="col-xl-4 mt-4">
                            <label className="">Stock Symbol:</label>
                            <div>
                              <span className="fw-bold">
                                {BuilderDetails.stock_symbol || "NA"}
                              </span>
                            </div>
                          </div>

                          <div className="col-xl-4 mt-4">
                            <label className="">
                              Coporate Officeaddress City :
                            </label>
                            <div>
                              <span className="fw-bold">
                                {BuilderDetails.coporate_officeaddress_city ||
                                  "NA"}
                              </span>
                            </div>
                          </div>

                          <div className="col-xl-4 mt-4">
                            <label className="">
                              Coporate Officeaddress Zipcode:
                            </label>
                            <div>
                              <span className="fw-bold">
                                {BuilderDetails.coporate_officeaddress_zipcode ||
                                  "NA"}
                              </span>
                            </div>
                          </div>

                          <div className="col-xl-4 mt-4">
                            <label className="">
                              Current Land Aquisitions:
                            </label>
                            <div>
                              <span className="fw-bold">
                                {BuilderDetails.current_land_aquisitions ||
                                  "NA"}
                              </span>
                            </div>
                          </div>

                          <div className="col-xl-4 mt-4">
                            <label className="">
                              Coporate Office Address 1:
                            </label>
                            <div>
                              <span className="fw-bold">
                                {BuilderDetails.coporate_officeaddress_1 ||
                                  "NA"}
                              </span>
                            </div>
                          </div>

                          <div className="col-xl-4 mt-4">
                            <label className="">
                              Coporate Office Address 2:
                            </label>
                            <div>
                              <span className="fw-bold">
                                {BuilderDetails.coporate_officeaddress_2 ||
                                  "NA"}
                              </span>
                            </div>
                          </div>

                          <div className="col-xl-4 mt-4">
                            <label className="">
                              Coporate Office Address Latitude:
                            </label>
                            <div>
                              <span className="fw-bold">
                                {BuilderDetails.coporate_officeaddress_lat ||
                                  "NA"}
                              </span>
                            </div>
                          </div>

                          <div className="col-xl-4 mt-4">
                            <label className="">
                              Coporate Officeaddress Longitude:
                            </label>
                            <div>
                              <span className="fw-bold">
                                {BuilderDetails.coporate_officeaddress_lng ||
                                  "NA"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel value="2" className="p-0">
                    <div className="card">
                      <div className="card-body p-0">
                        <div className="table-responsive active-projects style-1 ItemsCheckboxSec shorting">
                          <div
                            id="employee-tbl_wrapper"
                            className="dataTables_wrapper no-footer"
                          >
                            <table
                              id="empoloyees-tblwrapper"
                              className="table ItemsCheckboxSec dataTable no-footer mb-0 mt-5"
                            >
                              <thead>
                                <tr style={{ textAlign: "center" }}>
                                  <th>
                                    <strong> No.</strong>
                                  </th>
                                  <th>
                                    <strong> Subdivision Code</strong>
                                  </th>
                                  <th>
                                    <strong> Name</strong>
                                  </th>
                                  <th>
                                    <strong> Product Type</strong>
                                  </th>
                                  <th>
                                    <strong> Phone</strong>
                                  </th>
                                  <th>
                                    <strong> Gas Provider</strong>
                                  </th>
                                </tr>
                              </thead>
                              <tbody style={{ textAlign: "center" }}>
                                {BuilderDetails.subdivisions &&
                                Array.isArray(BuilderDetails.subdivisions) &&
                                BuilderDetails.subdivisions.length > 0 ? (
                                  BuilderDetails.subdivisions.map(
                                    (element, index) => (
                                      <tr
                                        onClick={handleDetailRedirectClick}
                                        key={element.id}
                                        style={{
                                          textAlign: "center",
                                          cursor: "pointer",
                                        }}
                                      >
                                        <td>{index + 1}</td>
                                        <td>{element.subdivision_code}</td>
                                        <td>{element.name}</td>
                                        <td>{element.product_type}</td>
                                        <td>{element.phone}</td>
                                        <td>{element.gasprovider}</td>
                                      </tr>
                                    )
                                  )
                                ) : (
                                  <tr>
                                    <td
                                      colSpan="7"
                                      style={{ textAlign: "center" }}
                                    >
                                      No data found
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabPanel>
                </TabContext>
              </Box>
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
            Manage Builder Fields Access{" "}
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
            >
              {/* <option data-display="Select">Please select</option> */}
              <option value="">Admin</option>
              <option value="1">Data Uploader</option>
              <option value="0">User</option>
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
                            value=""
                            defaultChecked={element.role_name.includes(
                              accessRole
                            )}
                            id={`flexCheckDefault${index}`}
                            onChange={handleUnchecked}
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
              <button type="submit" className="btn btn-primary me-3">
                Submit
              </button>
            </form>
          </div>
        </div>
      </Offcanvas>
    </>
  );
};

export default BuilderTable;
