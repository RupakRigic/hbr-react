import React, { useState, useEffect, useRef } from "react";

import AdminProductService from "../../../API/Services/AdminService/AdminProductService";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import ProductOffcanvas from "./ProductOffcanvas";
import MainPagetitle from "../../layouts/MainPagetitle";
import { Offcanvas, Form, Row } from "react-bootstrap";
import { debounce } from "lodash";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import ClipLoader from "react-spinners/ClipLoader";
import AdminSubdevisionService from "../../../API/Services/AdminService/AdminSubdevisionService";
import PriceComponent from "../../components/Price/PriceComponent";
import DateComponent from "../../components/date/DateFormat";
import AccessField from "../../components/AccssFieldComponent/AccessFiled";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import { DownloadTableExcel, downloadExcel } from 'react-export-table-to-excel';
 

const ProductList = () => {
  const [Error, setError] = useState("");
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [productList, setProductList] = useState(null);
  const [BuilderList, setBuilderList] = useState([]);
  const [exportmodelshow, setExportModelShow] = useState(false)
  const [selectedColumns, setSelectedColumns] = useState([]);
  // const [currentPage, setCurrentPage] = useState(1);
  // const recordsPage = 20;ProductDetails
  // const lastIndex = currentPage * recordsPage;
  // const firstIndex = lastIndex - recordsPage;
  // const records = productList.slice(firstIndex, lastIndex);
  // const npage = Math.ceil(productList.length / recordsPage)
  // const number = [...Array(npage + 1).keys()].slice(1)
  // function prePage() {
  //     if (currentPage !== 1) {
  //         setCurrentPage(currentPage - 1)
  //     }
  // }
  // function changeCPage(id) {
  //     setCurrentPage(id);
  // }
  // function nextPage() {
  //     if (currentPage !== npage) {
  //         setCurrentPage(currentPage + 1)
  //     }
  // }
 
  
  const headers = [
    { label: 'Status', key: 'Status' },
    { label: 'Builder Name', key: 'buildername' },
    { label: 'Subdivision Name', key: 'subdivname' },
    { label: 'Product Name', key: 'producutname' },
    { label: 'Square Footage', key: 'squarefootage' },
    { label: 'Stories', key: 'stories' },
    { label: 'Bed Rooms', key: 'bedrooms' },
    { label: 'Bath Rooms', key: 'bathrooms' },
    { label: 'Garage', key: 'garage' },
    { label: 'Current Base Price', key: 'currentbaseprice' },
    { label: 'Current Price Per SQFT', key: 'currentprice' },
    { label: 'Product Website', key: 'productwebsite' },
    { label: 'Product Type', key: 'producttype' },
    { label: 'Area', key: 'area' },
    { label: 'Master Plan', key: 'masterplan' },
    { label: 'Zip Code', key: 'zipcode' },
    { label: 'Lot Width', key: 'lotwidth' },
    { label: 'Lot Size', key: 'lotsize' },
    { label: 'Zoning', key: 'zoning' },
    { label: 'Age Restrictedr', key: 'agerestrictedr' },
    { label: 'All Single Story', key: 'singlestory' },
    { label: 'Product ID', key: 'productid' },
    { label: 'Fk Sub ID', key: 'fksubid' }, 
  ];
  const columns = [
    { label: 'Status', key: 'Status' },
    { label: 'Builder Name', key: 'buildername' },
    { label: 'Subdivision Name', key: 'subdivname' },
    { label: 'Product Name', key: 'producutname' },
    { label: 'Square Footage', key: 'squarefootage' },
    { label: 'Stories', key: 'stories' },
    { label: 'Bed Rooms', key: 'bedrooms' },
    { label: 'Bath Rooms', key: 'bathrooms' },
    { label: 'Garage', key: 'garage' },
    { label: 'Current Base Price', key: 'currentbaseprice' },
    { label: 'Current Price Per SQFT', key: 'currentprice' },
    { label: 'Product Website', key: 'productwebsite' },
    { label: 'Product Type', key: 'producttype' },
    { label: 'Area', key: 'area' },
    { label: 'Master Plan', key: 'masterplan' },
    { label: 'Zip Code', key: 'zipcode' },
    { label: 'Lot Width', key: 'lotwidth' },
    { label: 'Lot Size', key: 'lotsize' },
    { label: 'Zoning', key: 'zoning' },
    { label: 'Age Restrictedr', key: 'agerestrictedr' },
    { label: 'All Single Story', key: 'singlestory' },
    { label: 'Product ID', key: 'productid' },
    { label: 'Fk Sub ID', key: 'fksubid' }, 
  ];
  const handleColumnToggle = (column) => {
    const updatedColumns = selectedColumns.includes(column)
      ? selectedColumns.filter((col) => col !== column)
      : [...selectedColumns, column];
      console.log(updatedColumns);
    setSelectedColumns(updatedColumns);  
  };
  console.log('data',productList);
  const handleDownloadExcel = () => {
    setExportModelShow(false)
    setSelectedColumns('')
    var tableHeaders;
    if (selectedColumns.length > 0) {
      tableHeaders = selectedColumns;
    } else {
      tableHeaders = headers.map((c) => c.label);
    }
    var newdata = tableHeaders.map((element) => { return element })
 
    const tableData = productList.map((row) => 
    newdata.map((nw, i) =>
    [
        nw === "Status" ? (row.status===1 && "Active" || row.status===0 && "Sold Out" || row.status===2 && "Future") : '',
        nw === "Builder Name" ?  row.subdivision.builder.name : '',
        nw === "Subdivision Name" ?  row.subdivision.name : '',
        nw === "Product Name" ?  row.name : '', 
        nw === "Square Footage" ?  row.sqft : '',
        nw === "Stories" ?  row.stories : '',
        nw === "Bed Rooms" ?  row.bedroom : '',
        nw === "Bath Rooms" ?  row.bathroom : '',
        nw === "Garage" ?  row.garage : '',
        nw === "Current Base Price" ?  row.recentprice : '',
        nw === "Current Price Per SQFT" ?  row.recentpricesqft : '',
        nw === "Product Website" ?  row.Website : '',
        nw === "Product Type" ?  row.subdivision.product_type : '',
        nw === "Area" ?  row.subdivision.area : '',
        nw === "Master Plan" ?  row.subdivision.masterplan_id : '',
        nw === "Zip Code" ?  row.subdivision.zipcode : '',
        nw === "Lot Width" ?  row.subdivision.lotwidth : '',
        nw === "Lot Size" ?  row.subdivision.lotsize : '',
        nw === "Zoning" ?  row.subdivision.zoning : '',
        nw === "Age Restrictedr" ? (row.subdivision.age === 1 && "Yes" || row.subdivision.age === 0 && "No") : '', 
        nw === "All Single Story" ?   (row.subdivision.single==1 && "Yes" || row.subdivision.single===0 && "No") : '',
        nw === "Product ID" ?  row.product_code : '',
        nw === "Fk Sub ID" ?  row.subdivision.subdivision_code : '',
    ]
    ),
    
  )
 
 
    downloadExcel({
      fileName: "Sub Division List",
      sheet: "Sub Division List",
      tablePayload: {
        header: tableHeaders,
        body: tableData
      },
    });

  }

  const [filterQuery, setFilterQuery] = useState({
    status: "",
    subdivision_id: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  const product = useRef();

  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  const [ProductDetails, SetProductDetails] = useState({
    subdivision: "",
    product_code: "",
    name: "",
    status: "",
    stories: "",
    garage: "",
    pricechange: "",
    bathroom: "",
    recentprice: "",
    bedroom: "",
    recentpricesqft: "",
    sqft: "",
  });

  const [manageAccessOffcanvas, setManageAccessOffcanvas] = useState(false);
  const [accessList, setAccessList] = useState({});
  const [accessRole, setAccessRole] = useState("Admin");
  const [accessForm, setAccessForm] = useState({});
  const [role, setRole] = useState("Admin");
  const [checkedItems, setCheckedItems] = useState({}); 
  const fieldList = AccessField({ tableName: "products" });
  const [show, setShow] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const [selectedFileError, setSelectedFileError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleClose = () => setShow(false);

  useEffect(() => {
    console.log('data',fieldList);
  }, [fieldList]);

  const checkFieldExist = (fieldName) => {
    return fieldList.includes(fieldName.trim());
  };
 
  
  const [value, setValue] = React.useState("1");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getproductList = async () => {
    try {
      const response = await AdminProductService.index(searchQuery);
      const responseData = await response.json();
      setProductList(responseData);
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
      getproductList();
    } else {
      navigate("/");
    }
  }, []);
  const handleDelete = async (e) => {
    try {
      let responseData = await AdminProductService.destroy(e).json();
      if (responseData.status === true) {
        getproductList();
      }
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(errorJson.message);
      }
    }
  };
  const handleCallback = () => {
    // Update the name in the component's state
    getproductList();
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
      table: "products",
    };
    try {
      const data = await AdminProductService.manageAccessFields(
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
      const response = await AdminProductService.accessField();
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

  const handleRowClick = async (id) => {
    try {
      let responseData = await AdminProductService.show(id).json();
      SetProductDetails(responseData);
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
    getproductList();
  }, [searchQuery]);

  const HandleSearch = (e) => {
    setIsLoading(true);
    const query = e.target.value.trim();
    debouncedHandleSearch(`?q=${query}`);
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
      status: "",
      subdivision_id: "",
    });
  };
  const handlePriceClick = () => {
    navigate("/pricelist");
  };
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key) {
      direction = sortConfig.direction === "asc" ? "desc" : "asc";
    }
    setSortConfig({ key, direction });
  };
  const sortedData = () => {
    const sorted = [...productList];
    if (sortConfig.key !== "") {
      sorted.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (aValue === null || bValue === null) {
          aValue = aValue || "";
          bValue = bValue || "";
        }

        if (typeof aValue === "string") {
          aValue = aValue.toLowerCase();
        }
        if (typeof bValue === "string") {
          bValue = bValue.toLowerCase();
        }
        if (
          sortConfig.key === "builderName" &&
          a.subdivision.builder.name &&
          b.subdivision.builder.name
        ) {
          aValue = String(a.subdivision.builder.name).toLowerCase();
          bValue = String(b.subdivision.builder.name).toLowerCase();
        }

        if (
          sortConfig.key === "subdivisionName" &&
          a.subdivision &&
          b.subdivision
        ) {
          aValue = String(a.subdivision.name).toLowerCase();
          bValue = String(b.subdivision.name).toLowerCase();
        }
        if (
          sortConfig.key === "productType" &&
          a.subdivision &&
          b.subdivision
        ) {
          aValue = String(a.subdivision.product_type).toLowerCase();
          bValue = String(b.subdivision.product_type).toLowerCase();
        }
        if (sortConfig.key === "area" && a.subdivision && b.subdivision) {
          aValue = String(a.subdivision.area).toLowerCase();
          bValue = String(b.subdivision.area).toLowerCase();
        }
        if (sortConfig.key === "masterPlan" && a.subdivision && b.subdivision) {
          aValue = String(a.subdivision.masterplan_id).toLowerCase();
          bValue = String(b.subdivision.masterplan_id).toLowerCase();
        }
        if (sortConfig.key === "zipCode" && a.subdivision && b.subdivision) {
          aValue = String(a.subdivision.zipcode).toLowerCase();
          bValue = String(b.subdivision.zipcode).toLowerCase();
        }
        if (sortConfig.key === "lotWidth" && a.subdivision && b.subdivision) {
          aValue = String(a.subdivision.lotwidth).toLowerCase();
          bValue = String(b.subdivision.lotwidth).toLowerCase();
        }
        if (sortConfig.key === "lotsize" && a.subdivision && b.subdivision) {
          aValue = String(a.subdivision.lotsize).toLowerCase();
          bValue = String(b.subdivision.lotsize).toLowerCase();
        }
        if (sortConfig.key === "zoning" && a.subdivision && b.subdivision) {
          aValue = String(a.subdivision.zoning).toLowerCase();
          bValue = String(b.subdivision.zoning).toLowerCase();
        }
        if (sortConfig.key === "age" && a.subdivision && b.subdivision) {
          aValue = String(a.subdivision.age).toLowerCase();
          bValue = String(b.subdivision.age).toLowerCase();
        }
        if (
          sortConfig.key === "subdivisionCode" &&
          a.subdivision &&
          b.subdivision
        ) {
          aValue = String(a.subdivision.subdivision_code).toLowerCase();
          bValue = String(b.subdivision.subdivision_code).toLowerCase();
        }
        if (typeof aValue === "number" && typeof bValue === "number") {
          if (sortConfig.direction === "asc") {
            return aValue - bValue;
          } else {
            return bValue - aValue;
          }
        } else {
          if (sortConfig.direction === "asc") {
            return aValue.localeCompare(bValue);
          } else {
            return bValue.localeCompare(aValue);
          }
        }
      });
    }
    return sorted;
  };

  const getbuilderlist = async () => {
    try {
      const response = await AdminSubdevisionService.index(searchQuery);
      const responseData = await response.json();
      setBuilderList(responseData);
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
      getbuilderlist();
    } else {
      navigate("/");
    }
  }, []);
  const exportToExcelData = async () => {
    try {
        const bearerToken = JSON.parse(localStorage.getItem('usertoken'));
        const response = await axios.get(
          `${process.env.REACT_APP_IMAGE_URL}api/admin/product/export`
          // 'https://hbrapi.rigicgspl.com/api/admin/product/export'

          , {
            responseType: 'blob',
            headers: {
                'Authorization': `Bearer ${bearerToken}`
            }
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'products.xlsx');
        document.body.appendChild(link);
        link.click();
    } catch (error) {
        console.log(error);
        if (error.name === "HTTPError") {
            const errorJson = await error.response.json();
            setError(errorJson.message.substr(0, errorJson.message.lastIndexOf(".")));
        }
    }
}
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
        let responseData = await AdminProductService.import(inputData).json();
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
const handlBuilderClick = (e) => {
  setShow(true);
};
  return (
    <>
      <MainPagetitle
        mainTitle="Product"
        pageTitle="Product"
        parentTitle="Home"
      />
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-12">
            <div className="card">
              <div className="card-body p-0">
                <div className="table-responsive active-projects style-1 ItemsCheckboxSec shorting">
                  <div className="tbl-caption d-flex justify-content-between text-wrap align-items-center">
                    <div className="d-flex text-nowrap justify-content-between align-items-center">
                      <h4 className="heading mb-0">Product List</h4>
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
                    {/* <button onClick={exportToExcelData} className="btn btn-primary btn-sm me-1"> <i class="fas fa-file-excel"></i></button> */}
                    <button onClick={() => setExportModelShow(true)} className="btn btn-primary btn-sm me-1"> <i class="fas fa-file-excel"></i></button>

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
                            <div className="mt-3">
                              <label className="form-label">
                                Subdivision:{" "}
                                <span className="text-danger"></span>
                              </label>
                              <select
                                className="default-select form-control"
                                value={filterQuery.subdivision_id}
                                name="subdivision_id"
                                onChange={HandleFilter}
                              >
                                {/* <option data-display="Select">Please select</option> */}
                                <option value="">All</option>
                                {BuilderList.map((element) => (
                                  <option value={element.id}>
                                    {element.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="mt-3 mb-3">
                              <label className="form-label">
                                Status: <span className="text-danger"></span>
                              </label>
                              <select
                                className="default-select form-control"
                                value={filterQuery.status}
                                name="status"
                                onChange={HandleFilter}
                              >
                                {/* <option data-display="Select">Please select</option> */}
                                <option value="">All</option>
                                <option value="1">Active</option>
                                <option value="0">Sold Out</option>
                                <option value="2">Future</option>
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
                        + Add Product
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
                            {checkFieldExist("Plan Status") && (
                              <th onClick={() => requestSort("status")}>
                                <strong>Plan Status</strong>
                                {sortConfig.key !== "status" ? "↑↓" : ""}
                                {sortConfig.key === "status" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("Builder Name") && (
                              <th onClick={() => requestSort("builderName")}>
                                <strong>Builder Name</strong>
                                {sortConfig.key !== "builderName" ? "↑↓" : ""}
                                {sortConfig.key === "builderName" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("Subdivision Name") && (
                              <th
                                onClick={() => requestSort("subdivisionName")}
                              >
                                <strong>Subdivision Name</strong>

                                {sortConfig.key !== "subdivisionName"
                                  ? "↑↓"
                                  : ""}
                                {sortConfig.key === "subdivisionName" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("Product Name") && (
                              <th onClick={() => requestSort("name")}>
                                <strong>Product Name</strong>
                                {sortConfig.key !== "name" ? "↑↓" : ""}
                                {sortConfig.key === "name" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("Square Footage") && (
                              <th onClick={() => requestSort("sqft")}>
                                <strong>Square Footage</strong>
                                {sortConfig.key !== "sqft" ? "↑↓" : ""}
                                {sortConfig.key === "sqft" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("Stories") && (
                              <th onClick={() => requestSort("stories")}>
                                <strong>Stories</strong>
                                {sortConfig.key !== "stories" ? "↑↓" : ""}
                                {sortConfig.key === "stories" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("Bed Rooms") && (
                              <th onClick={() => requestSort("bedroom")}>
                                <strong>Bed Rooms</strong>
                                {sortConfig.key !== "bedroom" ? "↑↓" : ""}
                                {sortConfig.key === "bedroom" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("Bath Rooms") && (
                              <th onClick={() => requestSort("bathroom")}>
                                <strong>Bath Rooms</strong>
                                {sortConfig.key !== "bathroom" ? "↑↓" : ""}
                                {sortConfig.key === "bathroom" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("Garage") && (
                              <th onClick={() => requestSort("garage")}>
                                <strong>Garage</strong>
                                {sortConfig.key !== "garage" ? "↑↓" : ""}
                                {sortConfig.key === "garage" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("Current Base Price") && (
                              <th onClick={() => requestSort("recentprice")}>
                                <strong>Current Base Price</strong>
                                {sortConfig.key !== "recentprice" ? "↑↓" : ""}
                                {sortConfig.key === "recentprice" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("Current Price Per SQFT") && (
                              <th
                                onClick={() => requestSort("recentpricesqft")}
                              >
                                <strong>Current Price Per SQFT</strong>
                                {sortConfig.key !== "recentpricesqft"
                                  ? "↑↓"
                                  : ""}
                                {sortConfig.key === "recentpricesqft" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("Product Website") && (
                              <th
                              // onClick={() => requestSort("recentpricesqft")}
                              >
                                <strong>Product Website</strong>
                                {/* {sortConfig.key !== "recentpricesqft"
                                ? "↑↓"
                                : ""}
                              {sortConfig.key === "recentpricesqft" && (
                                <span>
                                  {sortConfig.direction === "asc" ? "↑" : "↓"}
                                </span>
                              )} */}
                              </th>
                            )}
                            {checkFieldExist("Product Type") && (
                              <th onClick={() => requestSort("productType")}>
                                <strong>Product Type</strong>
                                {sortConfig.key !== "productType" ? "↑↓" : ""}
                                {sortConfig.key === "productType" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("Area") && (
                              <th onClick={() => requestSort("area")}>
                                <strong>Area</strong>
                                {sortConfig.key !== "area" ? "↑↓" : ""}
                                {sortConfig.key === "area" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("Master Plan") && (
                              <th onClick={() => requestSort("masterPlan")}>
                                <strong>Master Plan</strong>
                                {sortConfig.key !== "masterPlan" ? "↑↓" : ""}
                                {sortConfig.key === "masterPlan" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("Zip Code") && (
                              <th onClick={() => requestSort("zipCode")}>
                                <strong>Zip Code</strong>
                                {sortConfig.key !== "zipCode" ? "↑↓" : ""}
                                {sortConfig.key === "zipCode" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("Lot Width") && (
                              <th onClick={() => requestSort("lotWidth")}>
                                <strong>Lot Width</strong>
                                {sortConfig.key !== "lotWidth" ? "↑↓" : ""}
                                {sortConfig.key === "lotWidth" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("Lot Size") && (
                              <th onClick={() => requestSort("lotsize")}>
                                <strong>Lot Size</strong>
                                {sortConfig.key !== "lotsize" ? "↑↓" : ""}
                                {sortConfig.key === "lotsize" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("Zoning") && (
                              <th onClick={() => requestSort("zoning")}>
                                <strong>Zoning</strong>
                                {sortConfig.key !== "zoning" ? "↑↓" : ""}
                                {sortConfig.key === "zoning" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("Age Restricted") && (
                              <th onClick={() => requestSort("age")}>
                                <strong>Age Restricted</strong>
                                {sortConfig.key !== "age" ? "↑↓" : ""}
                                {sortConfig.key === "age" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("All Single Story") && (
                              <th onClick={() => requestSort("stories")}>
                                <strong>All Single Story</strong>
                                {sortConfig.key !== "stories" ? "↑↓" : ""}
                                {sortConfig.key === "stories" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("Date Added") && (
                              <th onClick={() => requestSort("created_at")}>
                                <strong>Date Added</strong>
                                {sortConfig.key !== "created_at" ? "↑↓" : ""}
                                {sortConfig.key === "created_at" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("__pkProductID") && (
                              <th onClick={() => requestSort("product_code")}>
                                <strong>__pkProductID</strong>
                                {sortConfig.key !== "product_code" ? "↑↓" : ""}
                                {sortConfig.key === "product_code" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("_fkSubID") && (
                              <th
                                onClick={() => requestSort("subdivisionCode")}
                              >
                                <strong>_fkSubID</strong>
                                {sortConfig.key !== "subdivisionCode"
                                  ? "↑↓"
                                  : ""}
                                {sortConfig.key === "subdivisionCode" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            <th
                                onClick={() => requestSort("subdivisionCode")}
                              >
                                <strong>Current Base Price</strong>
                                {sortConfig.key !== "subdivisionCode"
                                  ? "↑↓"
                                  : ""}
                                {sortConfig.key === "subdivisionCode" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                            </th>
                            <th
                                onClick={() => requestSort("subdivisionCode")}
                              >
                                <strong>Current Price Per Sqft</strong>
                                {sortConfig.key !== "subdivisionCode"
                                  ? "↑↓"
                                  : ""}
                                {sortConfig.key === "subdivisionCode" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                            </th>
                            <th
                                onClick={() => requestSort("subdivisionCode")}
                              >
                                <strong>Price Change Since Open</strong>
                                {sortConfig.key !== "subdivisionCode"
                                  ? "↑↓"
                                  : ""}
                                {sortConfig.key === "subdivisionCode" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                            </th>
                            <th
                                onClick={() => requestSort("subdivisionCode")}
                              >
                                <strong>Price Change Last 12 Months</strong>
                                {sortConfig.key !== "subdivisionCode"
                                  ? "↑↓"
                                  : ""}
                                {sortConfig.key === "subdivisionCode" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                            </th>
                            {checkFieldExist("Action") && <th>Action</th>}
                          </tr>
                        </thead>
                        <tbody style={{ textAlign: "center" }}>
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
                                {checkFieldExist("Plan Status") && (
                                  <td>
                                    {element.status === 1 && "Active"}
                                    {element.status === 0 && "Sold Out"}
                                    {element.status === 2 && "Future"}
                                  </td>
                                )}{" "}
                                {checkFieldExist("Builder Name") && (
                                  <td>{element.subdivision.builder.name}</td>
                                )}
                                {checkFieldExist("Subdivision Name") && (
                                  <td>{element.subdivision.name}</td>
                                )}
                                {checkFieldExist("Product Name") && (
                                  <td>{element.name}</td>
                                )}
                                {checkFieldExist("Square Footage") && (
                                  <td>{element.sqft}</td>
                                )}
                                {checkFieldExist("Stories") && (
                                  <td>{element.stories}</td>
                                )}
                                {checkFieldExist("Bed Rooms") && (
                                  <td>{element.bedroom}</td>
                                )}
                                {checkFieldExist("Bath Rooms") && (
                                  <td>{element.bathroom}</td>
                                )}
                                {checkFieldExist("Garage") && (
                                  <td>{element.garage}</td>
                                )}
                                {checkFieldExist("Current Base Price") && (
                                  <td>
                                    <PriceComponent
                                      price={element.recentprice}
                                    />
                                  </td>
                                )}
                                {checkFieldExist("Current Price Per SQFT") && (
                                  <td>
                                    <PriceComponent
                                      price={element.recentpricesqft}
                                    />
                                  </td>
                                )}
                                {checkFieldExist("Product Website") && <td></td>}
                                {checkFieldExist("Product Type") && (
                                  <td>{element.subdivision.product_type}</td>
                                )}
                                {checkFieldExist("Area") && (
                                  <td>{element.subdivision.area}</td>
                                )}
                                {checkFieldExist("Master Plan") && (
                                  <td>{element.subdivision.masterplan_id}</td>
                                )}
                                {checkFieldExist("Zip Code") && (
                                  <td>{element.subdivision.zipcode}</td>
                                )}
                                {checkFieldExist("Lot Width") && (
                                  <td>{element.subdivision.lotwidth}</td>
                                )}
                                {checkFieldExist("Lot Size") && (
                                  <td>{element.subdivision.lotsize}</td>
                                )}
                                {checkFieldExist("Zoning") && (
                                  <td>{element.subdivision.zoning}</td>
                                )}
                                {checkFieldExist("Age Restricted") && (
                                  <td>
                                    {element.subdivision.age === 1 && "Yes"}
                                    {element.subdivision.age === 0 && "No"}
                                  </td>
                                )}
                                {checkFieldExist("All Single Story") && (
                                  <td>
                                    {element.subdivision.single === 1 && "Yes"}
                                    {element.subdivision.single === 0 && "No"}
                                  </td>
                                )}
                                {checkFieldExist("Date Added") && (
                                  <td>
                                    <DateComponent date={element.created_at} />
                                  </td>
                                )}
                                {checkFieldExist("__pkProductID") && (
                                  <td>{element.product_code}</td>
                                )}
                                {checkFieldExist("_fkSubID") && (
                                  <td>
                                    {element.subdivision.subdivision_code}
                                  </td>
                                )}
                                {checkFieldExist("Action") && (
                                  <td>
                                    <div className="d-flex justify-content-center">
                                      <Link
                                        to={`/productupdate/${element.id}`}
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
                    {/* <div className="d-sm-flex text-center justify-content-between align-items-center">
                                            <div className='dataTables_info'>
                                                Showing {lastIndex - recordsPage + 1} to{" "}
                                                {productList.length < lastIndex ? productList.length : lastIndex}
                                                {" "}of {productList.length} entries
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
                                                        <Link className={`paginate_button ${currentPage === n ? 'current' : ''} `} key={i}
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
      <ProductOffcanvas
        ref={product}
        Title="Add Product"
        parentCallback={handleCallback}
      />
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
            Product Details{" "}
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
            <Box sx={{ width: "100%", typography: "body1" }}>
              <TabContext value={value}>
                <Box>
                  <TabList
                    onChange={handleChange}
                    aria-label="lab API tabs example"
                  >
                    <Tab label="Products Details" value="1" />
                    <Tab label="Base Price" value="2" />
                  </TabList>
                </Box>
                <TabPanel value="1" className="p-0">
                  <div className="row">
                    <div className="col-xl-4 mt-4">
                      <label className="">Subdivision:</label>
                      <div>
                        <span className="fw-bold">
                          {ProductDetails.subdivision.name || "NA"}
                        </span>
                      </div>
                    </div>

                    <div className="col-xl-4 mt-4">
                      <label className="">Product Code:</label>
                      <div>
                        <span className="fw-bold">
                          {ProductDetails.product_code || "NA"}
                        </span>
                      </div>
                    </div>

                    <div className="col-xl-4 mt-4">
                      <label className="">Name :</label>
                      <div>
                        <span className="fw-bold">
                          {ProductDetails.name || "NA"}
                        </span>
                      </div>
                    </div>

                    <div className="col-xl-4 mt-4">
                      <label className="">Stories:</label>
                      <div>
                        <span className="fw-bold">
                          {ProductDetails.stories || "NA"}
                        </span>
                      </div>
                    </div>

                    <div className="col-xl-4 mt-4">
                      <label className="">Status:</label>
                      <div>
                        <span className="fw-bold">
                          {ProductDetails.status === 1 && "Active"}
                          {ProductDetails.status === 0 && "Sold Out"}
                          {ProductDetails.status === 2 && "Future"}
                        </span>
                      </div>
                    </div>

                    <div className="col-xl-4 mt-4">
                      <label className="">Garage:</label>
                      <div>
                        <span className="fw-bold">
                          {ProductDetails.garage || "NA"}
                        </span>
                      </div>
                    </div>

                    <div className="col-xl-4 mt-4">
                      <label className="">Price Change:</label>
                      <div>
                        <span className="fw-bold">
                          {(
                            <PriceComponent
                              price={ProductDetails.pricechange}
                            />
                          ) || "NA"}
                        </span>
                      </div>
                    </div>

                    <div className="col-xl-4 mt-4">
                      <label className="">Bathroom:</label>
                      <div>
                        <span className="fw-bold">
                          {ProductDetails.bathroom || "NA"}
                        </span>
                      </div>
                    </div>

                    <div className="col-xl-4 mt-4">
                      <label className="">Recent Price:</label>
                      <div>
                        <span className="fw-bold">
                          {(
                            <PriceComponent
                              price={ProductDetails.recentprice}
                            />
                          ) || "NA"}
                        </span>
                      </div>
                    </div>

                    <div className="col-xl-4 mt-4">
                      <label className="">Bedroom :</label>
                      <div>
                        <span className="fw-bold">
                          {ProductDetails.bedroom || "NA"}
                        </span>
                      </div>
                    </div>

                    <div className="col-xl-4 mt-4">
                      <label className="">Recent Price SQFT:</label>
                      <div>
                        <span className="fw-bold">
                          {(
                            <PriceComponent
                              price={ProductDetails.recentpricesqft}
                            />
                          ) || "NA"}
                        </span>
                      </div>
                    </div>

                    <div className="col-xl-4 mt-4">
                      <label className="">SQFT:</label>
                      <div>
                        <span className="fw-bold">
                          {ProductDetails.sqft || "NA"}
                        </span>
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
                            className="table ItemsCheckboxSec dataTable no-footer mb-0"
                          >
                            <thead>
                              <tr style={{ textAlign: "center" }}>
                                <th>
                                  <strong>No.</strong>
                                </th>
                                <th>
                                  <strong>Product Code</strong>
                                </th>
                                <th>
                                  <strong>Base Price</strong>
                                </th>
                                <th className="d-flex justify-content-end">
                                  <strong>Date</strong>
                                </th>
                              </tr>
                            </thead>
                            <tbody style={{ textAlign: "center" }}>
                              {ProductDetails.base_price &&
                              Array.isArray(ProductDetails.base_price) &&
                              ProductDetails.base_price.length > 0 ? (
                                ProductDetails.base_price.map(
                                  (element, index) => (
                                    <tr
                                      onClick={handlePriceClick}
                                      key={element.id}
                                      style={{
                                        textAlign: "center",
                                        cursor: "pointer",
                                      }}
                                    >
                                      <td>{index + 1}</td>

                                      <td>{ProductDetails.product_code}</td>
                                      <td>
                                        <PriceComponent
                                          price={element.baseprice}
                                        />{" "}
                                      </td>
                                      <td>
                                        <DateComponent date={element.date} />
                                      </td>
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
      </Offcanvas>
      <Offcanvas
        show={manageAccessOffcanvas}
        onHide={setManageAccessOffcanvas}
        className="offcanvas-end customeoff"
        placement="end"
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="modal-title" id="#gridSystemModal">
            Manage Product Fields Access{" "}
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
            <ul className='list-unstyled'>
            {columns.map((col) => (
              <li key={col.label}>
              <label className='form-check'>
                <input
                  type="checkbox"
                  className='form-check-input'
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
          <button varient="primary" class="btn btn-primary" onClick={handleDownloadExcel}>Download</button>
          </Modal.Footer>
        </>
      </Modal>
    </>
  );
};

export default ProductList;
