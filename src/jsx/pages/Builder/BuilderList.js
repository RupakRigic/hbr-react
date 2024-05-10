import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import AdminBuilderService from "../../../API/Services/AdminService/AdminBuilderService";
import BuilderOffcanvas from "./BuilderOffcanvas";
import { Form, Offcanvas, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import clientAuth from "../../../API/clientAuth";
import MainPagetitle from "../../layouts/MainPagetitle";
import PriceComponent from "../../components/Price/PriceComponent";
import { debounce } from "lodash";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import ClipLoader from "react-spinners/ClipLoader";
import DateComponent from "../../components/date/DateFormat";
import AccessField from "../../components/AccssFieldComponent/AccessFiled";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import { DownloadTableExcel, downloadExcel } from "react-export-table-to-excel";
import multiColumnSort from "multi-column-sort";

const BuilderTable = () => {
  const [Error, setError] = useState("");
  var imageUrl = process.env.REACT_APP_Builder_IMAGE_URL;
  const [searchQuery, setSearchQuery] = useState("");
  const [filterQuery, setFilterQuery] = useState({
    name :"",
    is_active: "",
    active_communities:"",
    closing_this_year:"",
    permits_this_year:"",
    net_sales_this_year:"",
    current_avg_base_Price:"",
    avg_net_sales_per_month_this_year:"",
    avg_closings_per_month_this_year:"",
    company_type: "",
    city:"",
    zipcode:"",
    officeaddress1:"",
    coporate_officeaddress_zipcode:"",
    stock_market:""
  });
  const [show, setShow] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const [selectedFileError, setSelectedFileError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleClose = () => setShow(false);

  const [BuilderList, setBuilderList] = useState([]);
  const [BuilderListCount, setBuilderListCount] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPage = 100;
  const lastIndex = currentPage * recordsPage;
  const firstIndex = lastIndex - recordsPage;
  const [npage, setNpage] = useState(0);
  const number = [...Array(npage + 1).keys()].slice(1);

  const navigate = useNavigate();
  const SyestemUserRole = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).role
    : "";
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [manageAccessOffcanvas, setManageAccessOffcanvas] = useState(false);
  const [accessList, setAccessList] = useState({});
  const [accessRole, setAccessRole] = useState("Admin");
  const [accessForm, setAccessForm] = useState({});
  const [role, setRole] = useState("Admin");
  const [checkedItems, setCheckedItems] = useState({});
  const fieldList = AccessField({ tableName: "builders" });
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [exportmodelshow, setExportModelShow] = useState(false);
  const [columnSeq, setcolumnSeq] = useState(false);
  const [calculationField, setCalculationField] = useState(false);
  useEffect(() => {
    console.log(fieldList);
  }, [fieldList]);

  const checkFieldExist = (fieldName) => {
    return fieldList.includes(fieldName.trim());
  };

  const headers = [
    { label: "Logo", key: "Logo" },
    { label: "Website", key: "website" },
    { label: "Builder Name", key: "name" },
    { label: "Company Type", key: "companytype" },
    { label: "LV office Phone", key: "phone" },
    { label: "LV office Email", key: "email" },
    { label: "LV office address", key: "officeaddress1" },
    { label: "LV office City", key: "city" },
    { label: "LV office Zip", key: "zipcode" },
    { label: "Current Division President", key: "current_division_president" },
    { label: "Current Land Acquisitions", key: "current_land_aquisitions" },
    { label: "Corporate Office Address ", key: "coporate_officeaddress_1" },
    { label: "Corporate Office City", key: "coporate_officeaddress_city" },
    { label: "Corporate Office State", key: "coporate_office_state" },
    { label: "Corporate Office Zip", key: "coporate_officeaddress_zipcode" },
    { label: "Stock Market", key: "stock_market" },
    { label: "Stock Symbol", key: "stock_symbol" },
    { label: "Active Communities", key: "active_communities" },
    { label: "Closing This Year", key: "closing_this_year" },
    { label: "Permits This Year", key: "permits_this_year" },
    { label: "Net Sales this year", key: "net_sales_this_year" },
    { label: "Current Avg Base Price", key: "current_avg_base_Price" },
    {
      label: "Median Closing Price This Year ",
      key: "median_closing_price_this_year",
    },
    {
      label: "Median Closing Price Last Year",
      key: "median_closing_price_last_year",
    },
    {
      label: "Avg Net Sales Per Month This Year ",
      key: "avg_net_sales_per_month_this_year",
    },
    {
      label: "Avg Closings Per Month This Year",
      key: "avg_closings_per_month_this_year",
    },
    { label: "Total Closings", key: "total_closings" },
    { label: "Total Permits", key: "total_permits" },
    { label: "Total Net Sales", key: "total_net_sales" },
    { label: "Date Of First Closing", key: "date_of_first_closing" },
    { label: "Date Of Latest Closing", key: "date_of_latest_closing" },
  ];
  const columns = [
    { label: "Logo", key: "Logo" },
    { label: "Website", key: "website" },
    { label: "Builder Name", key: "name" },
    { label: "Company Type", key: "companytype" },
    { label: "LV office Phone", key: "phone" },
    { label: "LV office Email", key: "email" },
    { label: "LV office address", key: "officeaddress1" },
    { label: "LV office City", key: "city" },
    { label: "LV office Zip", key: "zipcode" },
    { label: "Current Division President", key: "current_division_president" },
    { label: "Current Land Acquisitions", key: "current_land_aquisitions" },
    { label: "Corporate Office Address 1", key: "coporate_officeaddress_1" },
    { label: "Corporate Office City", key: "coporate_officeaddress_city" },
    { label: "Corporate Office State", key: "coporate_office_state" },
    { label: "Corporate Office Zip", key: "coporate_officeaddress_zipcode" },
    { label: "Stock Market", key: "stock_market" },
    { label: "Stock Symbol", key: "stock_symbol" },
    { label: "Active Communities", key: "active_communities" },
    { label: "Closing This Year", key: "closing_this_year" },
    { label: "Permits This Year", key: "permits_this_year" },
    { label: "Net Sales this year", key: "net_sales_this_year" },
    { label: "Current Avg Base Price", key: "current_avg_base_Price" },
    {
      label: "Median Closing Price This Year ",
      key: "median_closing_price_this_year",
    },
    {
      label: "Median Closing Price Last Year",
      key: "median_closing_price_last_year",
    },
    {
      label: "Avg Net Sales Per Month This Year ",
      key: "avg_net_sales_per_month_this_year",
    },
    {
      label: "Avg Closings Per Month This Year",
      key: "avg_closings_per_month_this_year",
    },
    { label: "Total Closings", key: "total_closings" },
    { label: "Total Permits", key: "total_permits" },
    { label: "Total Net Sales", key: "total_net_sales" },
    { label: "Date Of First Closing", key: "date_of_first_closing" },
    { label: "Date Of Latest Closing", key: "date_of_latest_closing" },
  ];

  const handleColumnToggle = (column) => {
    const updatedColumns = selectedColumns.includes(column)
      ? selectedColumns.filter((col) => col !== column)
      : [...selectedColumns, column];
    console.log(updatedColumns);
    setSelectedColumns(updatedColumns);
  };

  const handleDownloadExcel = () => {
    setExportModelShow(false);
    setSelectedColumns("");
    var tableHeaders;
    if (selectedColumns.length > 0) {
      tableHeaders = selectedColumns;
    } else {
      tableHeaders = headers.map((c) => c.label);
    }
    var newdata = tableHeaders.map((element) => {
      return element;
    });

    const tableData = BuilderList.map((row) =>
      newdata.map((nw, i) => [
        nw === "Logo" ? imageUrl + row.logo : "",
        nw === "Website" ? row.website : "",
        nw === "Builder Name" ? row.name : "",
        nw === "Company Type" ? row.company_type : "",
        nw === "LV office Phone" ? row.phone : "",
        nw === "LV office Email" ? row.email : "",
        nw === "LV office address" ? row.officeaddress1 : "",
        nw === "LV office City" ? row.city : "",
        nw === "LV office Zip code" ? row.zipcode : "",
        nw === "Current Division President"
          ? row.current_division_president
          : "",
        nw === "Current Land Acquisitions" ? row.current_land_aquisitions : "",
        nw === "Corporate Office Address" ? row.coporate_officeaddress_1 : "",
        nw === "Corporate Office City" ? row.coporate_officeaddress_city : "",
        nw === "Corporate Office State" ? row.coporate_officeaddress_2 : "",
        nw === "Corporate Office Zip" ? row.coporate_officeaddress_zipcode : "",
        nw === "Stock Market" ? row.stock_market : "",
        nw === "Stock Symbol" ? row.stock_symbol : "",
        nw === "Active Communities" ? row.active_communities : " ",
        nw === "Closing This Year" ? row.closing_this_year : " ",
        nw === "Permits This Year" ? row.permits_this_year : " ",
        nw === "Net Sales this year" ? row.net_sales_this_year : " ",
        nw === "Current Avg Base Price" ? row.current_avg_base_Price : " ",
        nw === "Median Closing Price This Year "
          ? row.median_closing_price_this_year
          : " ",
        nw === "Median Closing Price Last Year"
          ? row.median_closing_price_last_year
          : " ",
        nw === "Avg Net Sales Per Month This Year "
          ? row.avg_net_sales_per_month_this_year
          : " ",
        nw === "Avg Closings Per Month This Year"
          ? row.avg_closings_per_month_this_year
          : " ",
        nw === "Total Closings" ? row.total_closings : " ",
        nw === "Total Permits" ? row.total_permits : " ",
        nw === "Total Net Sales" ? row.total_net_sales : " ",
        nw === "Date Of First Closing" ? row.date_of_first_closing : " ",
        nw === "Date Of Latest Closing" ? row.date_of_latest_closing : " ",
      ])
    );
    downloadExcel({
      fileName: "Builders",
      sheet: "Builders",
      tablePayload: {
        header: tableHeaders,
        body: tableData,
      },
    });
  };

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
  const [data, setData] = useState([]); // Your data state
  const [sortConfig, setSortConfig] = useState([]); // Your sort configuration state

  const builder = useRef();
  const [value, setValue] = React.useState("1");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const stringifySortConfig = (sortConfig) => {
    return sortConfig.map((sort) => `${sort.key}:${sort.direction}`).join(",");
  };

  const getbuilderlist = async (pageNumber,searchQuery) => {
    try {
      let sortConfigString = "";
      if (sortConfig !== null) {
        sortConfigString = "&sortConfig=" + stringifySortConfig(sortConfig);
      }
      console.log(searchQuery);
      const response = await AdminBuilderService.index(
        pageNumber,
        searchQuery,
        sortConfigString
      );
      const responseData = await response.json();
      setBuilderList(responseData.data)
      setNpage(Math.ceil(responseData.total / recordsPage));
      setBuilderListCount(responseData.total);
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
      getbuilderlist(currentPage,searchQuery);
    } else {
      navigate("/");
    }
  }, [currentPage]);

  function prePage() {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  }
  function changeCPage(id) {
    setCurrentPage(id);
    console.log(id);
  }
  function nextPage() {
    if (currentPage !== npage) {
      setCurrentPage(currentPage + 1);
    }
  }

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

  // const debouncedHandleSearch = useRef(
  //   debounce((value) => {
  //     setSearchQuery(value);
  //   }, 1000)
  // ).current;

  // useEffect(() => {
  //   getbuilderlist();
  // }, [searchQuery]);

  useEffect(() => {
    setSearchQuery(filterString());
  }, [filterQuery]);

  const HandleFilterForm = (e) =>
  {
    e.preventDefault();
    console.log(555);
    getbuilderlist(currentPage,searchQuery);
  };

  // const HandleSearch = (e) => {
  //   setIsLoading(true);
  //   const query = e.target.value.trim();
  //   debouncedHandleSearch(`&q=${query}`);
  // };

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
    setFilterQuery(
      {
        name :"",
        is_active: "",
        active_communities:"",
        closing_this_year:"",
        permits_this_year:"",
        net_sales_this_year:"",
        current_avg_base_Price:"",
        avg_net_sales_per_month_this_year:"",
        avg_closings_per_month_this_year:"",
        company_type: "",
        city:"",
        zipcode:"",
        officeaddress1:"",
        coporate_officeaddress_zipcode:"",
        stock_market:""
      });
      getbuilderlist(currentPage,searchQuery);
  };
  const handleDetailRedirectClick = () => {
    navigate("/subdivisionlist");
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

  const handleAccessForm = async (e) => {
    e.preventDefault();
    var userData = {
      form: accessForm,
      role: role,
      table: "builders",
    };
    try {
      const data = await AdminBuilderService.manageAccessFields(
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
    getbuilderlist(currentPage, sortConfig);
  };

  useEffect(() => {
    getbuilderlist();
    setIsLoading(true);
    console.log(sortConfig);
  }, [sortConfig]);


  const HandleRole = (e) => {
    setRole(e.target.value);
    setAccessRole(e.target.value);
  };

  const exportToExcelData = async () => {
    try {
      const bearerToken = JSON.parse(localStorage.getItem("usertoken"));
      const response = await axios.get(
        `${process.env.REACT_APP_IMAGE_URL}api/admin/builder/export`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "builders.xlsx");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.log(error);
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(
          errorJson.message.substr(0, errorJson.message.lastIndexOf("."))
        );
      }
    }
  };

  const handleFileChange = async (e) => {
    setSelectedFile(e.target.files[0]);
  };
  const handleUploadClick = async () => {
    const file = selectedFile;

    if (file && file.type === "text/csv") {
      setLoading(true);
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = async () => {
        var iFile = fileReader.result;
        setSelectedFile(iFile);
        console.log(iFile);
        const inputData = {
          csv: iFile,
        };
        try {
          let responseData = await AdminBuilderService.import(inputData).json();
          setSelectedFile("");
          document.getElementById("fileInput").value = null;
          setLoading(false);
          swal("Imported Sucessfully").then((willDelete) => {
            if (willDelete) {
              navigate("/builderlist");
              setShow(false);
            }
          });
          getbuilderlist();
        } catch (error) {
          if (error.name === "HTTPError") {
            const errorJson = error.response.json();
            setSelectedFile("");
            setError(errorJson.message);
            document.getElementById("fileInput").value = null;
            setLoading(false);
          }
        }
      };

      setSelectedFileError("");
    } else {
      setSelectedFile("");
      setSelectedFileError("Please select a CSV file.");
    }
  };
  const [items, setItems] = useState(['Item 1', 'Item 2', 'Item 3']);
  const [colSeq, setcolSeq] = useState(["Logo","Website", "Builder Name", "Company Type","LV office Phone", "LV office Email","LV office address", "LV office City", "LV office Zip","Current Division President","Current Land Acquisitions","Corporate Office Address 1","Corporate Office City","Corporate Office State", "Corporate Office Zip","Stock Market", "Stock Symbol","Active Communities","Closing This Year","Permits This Year","Net Sales this year", "Current Avg Base Price","Median Closing Price This Year ",  "Median Closing Price Last Year","Avg Net Sales Per Month This Year ","Avg Closings Per Month This Year","Total Closings", "Total Permits","Total Net Sales", "Date Of First Closing","Date Of Latest Closing"]);
  const handlBuilderClick = (e) => {
    setShow(true);
  };
  const handleDragStart = (index) => (event) => {
    event.dataTransfer.setData('index', index);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const sourceIndex = event.dataTransfer.getData('index');
    const targetIndex = event.currentTarget.dataset.index;

    // Create a copy of the items array
    const newItems = [...colSeq];
    // Remove the dragged item from its original position
    const [draggedItem] = newItems.splice(sourceIndex, 1);
    // Insert the dragged item at the drop target position
    newItems.splice(targetIndex, 0, draggedItem);

    // Update the state with the new order of items
    setcolSeq(newItems);
  };
  return (
    <>
      {/* <MainPagetitle
        mainTitle="Builders"
        pageTitle="Builders"
        parentTitle="Home"
      /> */}
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-12">
            <div className="card">
              <div className="card-body p-0">
                <div className="table-responsive custom-overflow active-projects style-1 ItemsCheckboxSec shorting">
                  <div className="tbl-caption d-flex justify-content-between text-wrap align-items-center pb-0">
                    <div className="d-flex text-nowrap justify-content-between align-items-center">
                      <h4 className="heading mb-0-imp">Builder List</h4>
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
                          // onChange={HandleSearch}
                          placeholder="Quick Search"
                        />
                      </div>
                    </div>

                    <div className="mt-3">
                      {SyestemUserRole == "Data Uploader" ||
                      SyestemUserRole == "User" ? (
                        ""
                      ) : (
                        <div className="d-flex">
                          {/* <button onClick={exportToExcelData} className="btn btn-primary btn-sm me-1"> <i class="fas fa-file-excel"></i></button> */}
                          {/* <button
                            onClick={() => setcolumnSeq(true)}
                            className="btn btn-primary btn-sm me-1"
                          >
                            {" "}
                            Column Sequencing
                          </button> */}
                          <button
                            onClick={() => setExportModelShow(true)}
                            className="btn btn-primary btn-sm me-1"
                          >
                            {" "}
                            <i class="fas fa-file-excel"></i>
                          </button>
                          <button
                            className="btn btn-primary btn-sm me-1"
                            onClick={() => setManageAccessOffcanvas(true)}
                          >
                            {" "}
                            Field Access
                          </button>
                          <Button
                            className="btn-sm me-1"
                            variant="secondary"
                            onClick={handlBuilderClick}
                          >
                            Import
                          </Button>
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
                            <form onSubmit={HandleFilterForm}>
                              <div className="row">
                              <div className="col-md-4 mt-3">
                                <label className="form-label">
                                  BUILDER NAME:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input name="name" className="form-control" value={filterQuery.name} onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-4 mt-3">
                                  <label className="form-label">
                                    STATUS:{" "}
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
                              <div className="col-md-4 mt-3">
                                <label className="form-label">
                                ACTIVE COMMUNITIES :{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input type="number" value={filterQuery.active_communities} name="active_communities" className="form-control"  onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-4 mt-3">
                                <label className="form-label">
                                CLOSINGS THIS YEAR:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input type="number" value={filterQuery.closing_this_year} name="closing_this_year" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-4 mt-3">
                                <label className="form-label">
                                PERMITS THIS YEAR:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input type="number" value={filterQuery.permits_this_year} name="permits_this_year" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-4 mt-3">
                                <label className="form-label">
                                NET SALES THIS YEAR:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input type="number" value={filterQuery.net_sales_this_year} name="net_sales_this_year" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-4 mt-3">
                                <label className="form-label">
                                CURRENT AVG BASE PRICE:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input type="number" value={filterQuery.current_avg_base_Price} name="current_avg_base_Price" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-4 mt-3">
                                <label className="form-label">
                                AVG NET SALES PER MONTH THIS YEAR:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input type="number" value={filterQuery.avg_net_sales_per_month_this_year} name="avg_net_sales_per_month_this_year" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-4 mt-3">
                                <label className="form-label">
                                AVG CLOSINGS PER MONTH THIS YEAR:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input type="number" value={filterQuery.avg_closings_per_month_this_year} name="avg_closings_per_month_this_year" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-4 mt-3">
                                <label className="form-label">
                                COMPANY TYPE:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input  value={filterQuery.company_type} type="text" name="company_type" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-4 mt-3">
                                <label className="form-label">
                                LV OFFICE CITY:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input value={filterQuery.city} name="city" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-4 mt-3 ">
                                <label className="form-label">
                                LV OFFICE ZIP:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input value={filterQuery.zipcode} name="zipcode" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-4 mt-3 mb-3">
                                <label className="form-label">
                                CORPORATE OFFICE STATE:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input value={filterQuery.coporate_officeaddress_1} name="coporate_officeaddress_1" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-4 mt-3 mb-3">
                                <label className="form-label">
                                CORPORATE OFFICE ZIP:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input value={filterQuery.coporate_officeaddress_zipcode} name="coporate_officeaddress_zipcode" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-4 mt-3 mb-3">
                                <label className="form-label">
                                STOCK MARKET:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input value={filterQuery.stock_market} name="stock_market" className="form-control" onChange={HandleFilter}/>
                              </div>
                             </div>
                             </form>
                            </div>
                              <div className="d-flex justify-content-between">                 
                                <Button
                                  className="btn-sm"
                                  onClick={HandleCancelFilter}
                                  variant="secondary"
                                >
                                  Reset
                                </Button>    
                                <Button
                                  className="btn-sm"
                                  onClick={HandleFilterForm}
                                  variant="primary"
                                >
                                  Filter
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
                  <div className="d-sm-flex text-center justify-content-between align-items-center dataTables_wrapper no-footer">
                      <div className="dataTables_info">
                        Showing {lastIndex - recordsPage + 1} to {lastIndex} of{" "}
                        {BuilderListCount} entries
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
                          className="table ItemsCheckboxSec dataTable"
                        >
                          <thead>
                            <tr style={{ textAlign: "center" }}>
                              <th>
                                <strong>No.</strong>
                              </th>
                              {checkFieldExist("logo") && (
                                <th>
                                  <strong>Logo</strong>
                                </th>
                              )}
                              {checkFieldExist("website") && (
                                <th onClick={() => requestSort("website")}>
                                  <strong>Website</strong>
                                  {sortConfig.some(
                                    (item) => item.key === "website"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "website"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                                </th>
                              )}
                              {checkFieldExist("name") && (
                                <th onClick={() => requestSort("name")}>
                                  <strong>Builder Name</strong>
                                  {sortConfig.some(
                                    (item) => item.key === "name"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "name"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                                </th>
                              )}
                              {checkFieldExist("company_type") && (
                                <th onClick={() => requestSort("company_type")}>
                                  <strong>Company Type</strong>
                                  {sortConfig.some(
                                    (item) => item.key === "company_type"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "company_type"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                                </th>
                              )}
                              {checkFieldExist("email") && (
                                <th>
                                  <strong>Email</strong>
                                </th>
                              )}
                              {checkFieldExist("phone") && (
                                <th onClick={() => requestSort("phone")}>
                                  <strong>LV Office Phone</strong>
                                  {sortConfig.some(
                                    (item) => item.key === "phone"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "phone"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                                </th>
                              )}
                              {checkFieldExist("officeaddress1") && (
                                <th onClick={() => requestSort("officeaddress1")}>
                                  <strong>LV Office Address</strong>
                                  {sortConfig.some(
                                    (item) => item.key === "officeaddress1"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "officeaddress1"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                                </th>
                              )}
                              {checkFieldExist("city") && (
                                <th onClick={() => requestSort("city")}>
                                  <strong>
                                    LV Office City
                                    {sortConfig.some(
                                    (item) => item.key === "city"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "city"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                                  </strong>
                                </th>
                              )}
                              {checkFieldExist("zipcode") && (
                                <th onClick={() => requestSort("zipcode")}>
                                  <strong>LV Office Zip</strong>
                                  {sortConfig.some(
                                    (item) => item.key === "zipcode"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "zipcode"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                                </th>
                              )}
                              {checkFieldExist("current_division_president") && (
                                <th
                                  onClick={() =>
                                    requestSort("current_division_president")
                                  }
                                >
                                  <strong>Current Division President</strong>
                                  {sortConfig.some(
                                    (item) => item.key === "current_division_president"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "current_division_president"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                                </th>
                              )}
                              {checkFieldExist("current_land_aquisitions") && (
                                <th
                                  onClick={() =>
                                    requestSort("current_land_aquisitions")
                                  }
                                >
                                  <strong>
                                    Current Land Acquisitions
                                    {sortConfig.some(
                                    (item) => item.key === "current_land_aquisitions"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "current_land_aquisitions"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                                  </strong>
                                </th>
                              )}
                              {checkFieldExist("coporate_officeaddress_1") && (
                                <th
                                  onClick={() =>
                                    requestSort("coporate_officeaddress_1")
                                  }
                                >
                                  <strong>
                                    Corporate Office Address
                                    {sortConfig.some(
                                    (item) => item.key === "coporate_officeaddress_1"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "coporate_officeaddress_1"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                                  </strong>
                                </th>
                              )}
                              {checkFieldExist("coporate_officeaddress_city") && (
                                <th
                                  onClick={() =>
                                    requestSort("coporate_officeaddress_city")
                                  }
                                >
                                  <strong>
                                    Corporate Office City
                                    {sortConfig.some(
                                    (item) => item.key === "coporate_officeaddress_city"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "coporate_officeaddress_city"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                                  </strong>
                                </th>
                              )}
                              {checkFieldExist("coporate_officeaddress_2") && (
                                <th
                                  onClick={() =>
                                    requestSort("coporate_officeaddress_2")
                                  }
                                >
                                  <strong>
                                    Corporate Office State
                                    {sortConfig.some(
                                    (item) => item.key === "coporate_officeaddress_2"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "coporate_officeaddress_2"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                                  </strong>
                                </th>
                              )}
                              {checkFieldExist(
                                "coporate_officeaddress_zipcode"
                              ) && (
                                <th
                                  onClick={() =>
                                    requestSort("coporate_officeaddress_zipcode")
                                  }
                                >
                                  <strong>
                                    Corporate Office Zip
                                    {sortConfig.some(
                                    (item) => item.key === "coporate_officeaddress_zipcode"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "coporate_officeaddress_zipcode"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                                  </strong>
                                </th>
                              )}
                              {checkFieldExist("stock_market") && (
                                <th onClick={() => requestSort("stock_market")}>
                                  <strong>
                                    Stock Market
                                    {sortConfig.some(
                                    (item) => item.key === "stock_market"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "stock_market"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                                  </strong>
                                </th>
                              )}
                              {checkFieldExist("stock_symbol") && (
                                <th onClick={() => requestSort("stock_symbol")}>
                                  <strong>
                                    Stock Symbol
                                    {sortConfig.some(
                                    (item) => item.key === "stock_symbol"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "stock_symbol"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                                  </strong>
                                </th>
                              )}
                              {checkFieldExist("icon") && (
                                <th>
                                  <strong>Icon</strong>
                                </th>
                              )}
                              {checkFieldExist("builder_code") && (
                                <th onClick={() => requestSort("builder_code")}>
                                  <strong>
                                    __pkBuilderID
                                    {sortConfig.some(
                                    (item) => item.key === "builder_code"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "builder_code"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                                  </strong>
                                </th>
                              )}
                              {checkFieldExist("created_at") && (
                                <th onClick={() => requestSort("created_at")}>
                                  <strong>
                                    Date Added
                                    {sortConfig.some(
                                    (item) => item.key === "created_at"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "created_at"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                                  </strong>
                                </th>
                              )}
                              {checkFieldExist("Active Communities") && (
                                <th
                                  onClick={() =>
                                    requestSort("active_communities")
                                  }
                                >
                                  <strong>
                                    Active Communities
                                    {sortConfig.some(
                                    (item) => item.key === "active_communities"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "active_communities"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                                  </strong>
                                </th>
                              )}
                              {checkFieldExist("Closing This Year") && (
                                <th
                                  onClick={() => requestSort("closing_this_year")}
                                >
                                  <strong>
                                    Closing This Year
                                    {sortConfig.some(
                                    (item) => item.key === "closing_this_year"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "closing_this_year"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                                  </strong>
                                </th>
                              )}
                              {checkFieldExist("Permits This Year") && (
                                <th
                                  onClick={() => requestSort("permits_this_year")}
                                >
                                  <strong>
                                    Permits This Year
                                    {sortConfig.some(
                                    (item) => item.key === "permits_this_year"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "permits_this_year"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                                  </strong>
                                </th>
                              )}
                              {checkFieldExist("Net Sales this year") && (
                                <th onClick={() => requestSort("net_sales_this_year")}>
                                  <strong>
                                    Net Sales this year
                                    {sortConfig.some(
                                    (item) => item.key === "net_sales_this_year"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "net_sales_this_year"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                                  </strong>
                                </th>
                              )}
                              {checkFieldExist("Current Avg Base Price") && (
                                <th
                                  onClick={() =>
                                    requestSort("current_avg_base_Price")
                                  }
                                >
                                  <strong>
                                    Current Avg Base Price
                                    {sortConfig.some(
                                    (item) => item.key === "current_avg_base_Price"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "current_avg_base_Price"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                                  </strong>
                                </th>
                              )}
                              {checkFieldExist(
                                "Median Closing Price This Year"
                              ) && (
                                <th
                                  onClick={() =>
                                    requestSort("median_closing_price_this_year")
                                  }
                                >
                                  <strong>
                                    Median Closing Price This Year
                                    {sortConfig.some(
                                    (item) => item.key === "median_closing_price_this_year"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "median_closing_price_this_year"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                                  </strong>
                                </th>
                              )}
                              {checkFieldExist(
                                "Median Closing Price Last Year"
                              ) && (
                                <th
                                  onClick={() =>
                                    requestSort("median_closing_price_last_year")
                                  }
                                >
                                  <strong>
                                    Median Closing Price Last Year
                                    {sortConfig.some(
                                    (item) => item.key === "median_closing_price_last_year"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "median_closing_price_last_year"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                                  </strong>
                                </th>
                              )}
                              {checkFieldExist(
                                "Avg Net Sales Per Month This Year"
                              ) && (
                                <th
                                  onClick={() =>
                                    requestSort(
                                      "avg_net_sales_per_month_this_year"
                                    )
                                  }
                                >
                                  <strong>
                                    Avg Net Sales Per Month This Year
                                    {sortConfig.some(
                                    (item) => item.key === "avg_net_sales_per_month_this_year"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "avg_net_sales_per_month_this_year"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                                  </strong>
                                </th>
                              )}
                              {checkFieldExist(
                                "Avg Closings Per Month This Year"
                              ) && (
                                <th
                                  onClick={() =>
                                    requestSort(
                                      "avg_closings_per_month_this_year"
                                    )
                                  }
                                >
                                  <strong>
                                    Avg Closings Per Month This Year
                                    {sortConfig.some(
                                    (item) => item.key === "avg_closings_per_month_this_year"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "avg_closings_per_month_this_year"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                                  </strong>
                                </th>
                              )}{" "}
                              {checkFieldExist("Total Closings") && (
                                <th onClick={() => requestSort("total_closings")}>
                                  <strong>
                                    Total Closings
                                    {sortConfig.some(
                                    (item) => item.key === "total_closings"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "total_closings"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                                  </strong>
                                </th>
                              )}{" "}
                              {checkFieldExist("Total Permits") && (
                                <th onClick={() => requestSort("total_permits")}>
                                  <strong>
                                    Total Permits
                                    {sortConfig.some(
                                    (item) => item.key === "total_permits"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "total_permits"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                                  </strong>
                                </th>
                              )}{" "}
                              {checkFieldExist("Total Net Sales") && (
                                <th
                                  onClick={() => requestSort("total_net_sales")}
                                >
                                  <strong>
                                    Total Net Sales
                                    {sortConfig.some(
                                    (item) => item.key === "total_net_sales"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "total_net_sales"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                                  </strong>
                                </th>
                              )}
                              {checkFieldExist("Date Of First Closing") && (
                                <th
                                  onClick={() =>
                                    requestSort("date_of_first_closing")
                                  }
                                >
                                  <strong>
                                    Date Of First Closing
                                    {sortConfig.some(
                                    (item) => item.key === "date_of_first_closing"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "date_of_first_closing"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                                  </strong>
                                </th>
                              )}
                              {checkFieldExist("Date Of Latest Closing") && (
                                <th
                                  onClick={() =>
                                    requestSort("date_of_latest_closing")
                                  }
                                >
                                  <strong>
                                    Date Of Latest Closing
                                    {sortConfig.some(
                                    (item) => item.key === "date_of_latest_closing"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "date_of_latest_closing"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                                  </strong>
                                </th>
                              )}
                              {SyestemUserRole === "Data Uploader" ||
                              SyestemUserRole === "User" ? (
                                ""
                              ) : (
                                <th>
                                  <strong>Action</strong>
                                </th>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {BuilderList !== null && BuilderList.length > 0 ? (
                              BuilderList.map((element, index) => (
                                <tr
                                  onClick={() => handleRowClick(element.id)}
                                  key={index} 
                                  style={{
                                    textAlign: "center",
                                    cursor: "pointer",
                                  }}
                                >
                                  <td>{index + 1}</td>
                                  {checkFieldExist("logo") && (
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
                                  )}
                                  {checkFieldExist("website") && (
                                    <td>{element.website}</td>
                                  )}
                                  {checkFieldExist("name") && (
                                    <td>{element.name}</td>
                                  )}
                                  {checkFieldExist("company_type") && (
                                    <td>{element.company_type}</td>
                                  )}
                                  {checkFieldExist("phone") && (
                                    <td>{element.phone}</td>
                                  )}
                                  {checkFieldExist("email") && (
                                    <td>{element.email}</td>
                                  )}
                                  {checkFieldExist("officeaddress1") && (
                                    <td>{element.officeaddress1}</td>
                                  )}

                                  {checkFieldExist("city") && (
                                    <td>{element.city}</td>
                                  )}
                                  {checkFieldExist("zipcode") && (
                                    <td>{element.zipcode}</td>
                                  )}
                                  {checkFieldExist(
                                    "current_division_president"
                                  ) && (
                                    <td>{element.current_division_president}</td>
                                  )}
                                  {checkFieldExist(
                                    "current_land_aquisitions"
                                  ) && (
                                    <td>{element.current_land_aquisitions}</td>
                                  )}
                                  {checkFieldExist(
                                    "coporate_officeaddress_1"
                                  ) && (
                                    <td>{element.coporate_officeaddress_1}</td>
                                  )}
                                  {checkFieldExist(
                                    "coporate_officeaddress_city"
                                  ) && (
                                    <td>{element.coporate_officeaddress_city}</td>
                                  )}
                                  {checkFieldExist(
                                    "coporate_officeaddress_2"
                                  ) && (
                                    <td>{element.coporate_officeaddress_2}</td>
                                  )}
                                  {checkFieldExist(
                                    "coporate_officeaddress_zipcode"
                                  ) && (
                                    <td>
                                      {element.coporate_officeaddress_zipcode}
                                    </td>
                                  )}
                                  {checkFieldExist("stock_market") && (
                                    <td>{element.stock_market}</td>
                                  )}
                                  {checkFieldExist("stock_symbol") && (
                                    <td>{element.stock_symbol}</td>
                                  )}
                                  {checkFieldExist("icon") && (
                                    <td>{element.icon}</td>
                                  )}
                                  {checkFieldExist("builder_code") && (
                                    <td>{element.builder_code}</td>
                                  )}
                                  {checkFieldExist("created_at") && (
                                    <td>
                                      <DateComponent date={element.created_at} />
                                    </td>
                                  )}
                                  {checkFieldExist("Active Communities") && (
                                    <td>{element.active_communities}</td>
                                  )}
                                  {checkFieldExist("Closing This Year") && (
                                    <td>{element.closing_this_year}</td>
                                  )}
                                  {checkFieldExist("Permits This Year") && (
                                    <td>{element.permits_this_year}</td>
                                  )}
                                  {checkFieldExist("Net Sales this year") && (
                                    <td>{element.net_sales_this_year}</td>
                                  )}
                                  {checkFieldExist("Current Avg Base Price") && (
                                    <td>{element.current_avg_base_Price}</td>
                                  )}
                                  {checkFieldExist(
                                    "Median Closing Price This Year"
                                  ) && (
                                    <td>
                                      {element.median_closing_price_this_year}
                                    </td>
                                  )}
                                  {checkFieldExist(
                                    "Median Closing Price Last Year"
                                  ) && (
                                    <td>
                                      {element.median_closing_price_last_year}
                                    </td>
                                  )}
                                  {checkFieldExist(
                                    "Avg Net Sales Per Month This Year"
                                  ) && (
                                    <td>
                                      {element.avg_net_sales_per_month_this_year}
                                    </td>
                                  )}
                                  {checkFieldExist(
                                    "Avg Closings Per Month This Year"
                                  ) && (
                                    <td>
                                      {element.avg_closings_per_month_this_year}
                                    </td>
                                  )}
                                  {checkFieldExist("Total Closings") && (
                                    <td>{element.total_closings}</td>
                                  )}
                                  {checkFieldExist("Total Permits") && (
                                    <td>{element.total_permits}</td>
                                  )}
                                  {checkFieldExist("Total Net Sales") && (
                                    <td>{element.total_net_sales}</td>
                                  )}
                                  {checkFieldExist("Date Of First Closing") && (
                                    <td>
                                      <DateComponent
                                        date={element.date_of_first_closing}
                                      />
                                    </td>
                                  )}
                                  {checkFieldExist("Date Of Latest Closing") && (
                                    <td>
                                      <DateComponent
                                        date={element.date_of_latest_closing}
                                      />
                                    </td>
                                  )}
                                  <td>
                                    {SyestemUserRole === "Data Uploader" ||
                                    SyestemUserRole === "User" ? (
                                      ""
                                    ) : (
                                      <div className="d-flex justify-content-center">
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
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Import Permit CSV Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mt-3">
            <input type="file" id="fileInput" onChange={handleFileChange} />
          </div>
          <p className="text-danger d-flex justify-content-center align-item-center mt-1">
            {selectedFileError}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUploadClick}
            disabled={loading}
          >
            {loading ? "Loading.." : "Import"}
          </Button>
        </Modal.Footer>
      </Modal>
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
                            {element.field_name === "builder_code"
                              ? "__pkBuilderID"
                              : element.field_name === "name"
                              ? "Builder Name"
                              : element.field_name === "builder_code"
                              ? "Builder Code"
                              : element.field_name === "logo"
                              ? "Logo"
                              : element.field_name === "phone"
                              ? "LV Office Phone"
                              : element.field_name === "fax"
                              ? "Fax"
                              : element.field_name === "officeaddress1"
                              ? "LV Office Address"
                              : element.field_name === "city"
                              ? "LV Office City"
                              : element.field_name === "zipcode"
                              ? "LV Office Zip"
                              : element.field_name === "company_type"
                              ? "Company Type"
                              : element.field_name === "is_active"
                              ? "Status"
                              : element.field_name === "stock_market"
                              ? "Stock Market"
                              : element.field_name ===
                                "current_division_president"
                              ? "Current Division President"
                              : element.field_name === "stock_symbol"
                              ? "Stock Symbol "
                              : element.field_name ===
                                "current_land_aquisitions"
                              ? "Current Land Acquisitions"
                              : element.field_name ===
                                "coporate_officeaddress_1"
                              ? "Corporate Office Address"
                              : element.field_name ===
                                "coporate_officeaddress_2"
                              ? "Corporate Office State"
                              : element.field_name ===
                                "coporate_officeaddress_city"
                              ? "Corporate Office City"
                              : element.field_name ===
                                "coporate_officeaddress_zipcode"
                              ? "Corporate Office Zip"
                              : element.field_name === "officeaddress2"
                              ? "Address 2"
                              : element.field_name === "created_at"
                              ? "Date Added"
                              : element.field_name}
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
      <Modal show={exportmodelshow} onHide={setExportModelShow}>
        <>
          <Modal.Header>
            <Modal.Title>Export</Modal.Title>
            <button
              className="btn-close"
              aria-label="Close"
              onClick={() => setExportModelShow(false)}
            ></button>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <ul className="list-unstyled">
                {columns.map((col) => (
                  <li key={col.label}>
                    <label className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        onChange={() => handleColumnToggle(col.label)}
                      />
                      {col.label}
                    </label>
                  </li>
                ))}
              </ul>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <button
              varient="primary"
              class="btn btn-primary"
              onClick={handleDownloadExcel}
            >
              Download
            </button>
          </Modal.Footer>
        </>
      </Modal>
      <Modal show={columnSeq} onHide={setcolumnSeq}>
        <>
          <Modal.Header>
            <Modal.Title>Column Sequence</Modal.Title>
            <button
              className="btn-close"
              aria-label="Close"
              onClick={() => setcolumnSeq(false)}
            ></button>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <ul className="list-unstyled">
                {colSeq.map((col,index) => (
                  <li 
                    key={index}
                    draggable
                    onDragStart={handleDragStart(index)}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    data-index={index}
                    style={{ backgroundColor: 'lightblue', padding: '10px', margin: '5px', cursor: 'move' }}
                  > 
                    {col}
                  </li>
                ))}
              </ul>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <button
              varient="primary"
              class="btn btn-primary"
              onClick={handleDownloadExcel}
            >
              Save
            </button>
          </Modal.Footer>
        </>
      </Modal>
    </>
  );
};

export default BuilderTable;
