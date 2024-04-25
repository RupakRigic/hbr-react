import React, { useState, useEffect, useRef } from "react";

import AdminPermitService from "../../../API/Services/AdminService/AdminPermitService";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import PermitOffcanvas from "./PermitOffcanvas";
import MainPagetitle from "../../layouts/MainPagetitle";
import Button from "react-bootstrap/Button";
import AdminBuilderService from "../../../API/Services/AdminService/AdminBuilderService";
import Modal from "react-bootstrap/Modal";
import { Offcanvas, Form, Row } from "react-bootstrap";
import { debounce } from "lodash";
import ClipLoader from "react-spinners/ClipLoader";
import DateComponent from "../../components/date/DateFormat";
import AccessField from "../../components/AccssFieldComponent/AccessFiled";
import axios from "axios";
import { DownloadTableExcel, downloadExcel } from 'react-export-table-to-excel';

const PermitList = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [Error, setError] = useState("");
  var imageUrl = process.env.REACT_APP_Builder_IMAGE_URL;
  const [permitList, setPermitList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [exportmodelshow, setExportModelShow] = useState(false)

  // const [currentPage, setCurrentPage] = useState(1);
  // const recordsPage = 15;
  // const lastIndex = currentPage * recordsPage;
  // const firstIndex = lastIndex - recordsPage;
  // const records = permitList.slice(firstIndex, lastIndex);
  // const npage = Math.ceil(permitList.length / recordsPage);
  // const number = [...Array(npage + 1).keys()].slice(1);

  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const [selectedFileError, setSelectedFileError] = useState("");
  const navigate = useNavigate();
  const [BuilderList, setBuilderList] = useState([]);
  const [BuilderCode, setBuilderCode] = useState("");
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [PermitDetails, SetPermitDetails] = useState({
    subdivision: "",
    parcel: "",
    contractor: "",
    description: "",
    date: "",
    dateadded: "",
    lotnumber: "",
    owner: "",
    plan: "",
    sqft: "",
    value: "",
    permitnumber: "",
    address1: "",
    address2: "",
  });
  const [manageAccessOffcanvas, setManageAccessOffcanvas] = useState(false);
  const [accessList, setAccessList] = useState({});
  const [accessRole, setAccessRole] = useState("Admin");
  const [accessForm, setAccessForm] = useState({});
  const [role, setRole] = useState("Admin");
  const [checkedItems, setCheckedItems] = useState({}); // State to manage checked items
  const fieldList = AccessField({ tableName: "permits" });

  useEffect(() => {
    console.log('list field : ',fieldList); // You can now use fieldList in this component
  }, [fieldList]);

  const checkFieldExist = (fieldName) => {
    return fieldList.includes(fieldName.trim());
  };

    
  const headers = [
    { label: 'Date', key: 'Date' },
    { label: 'Builder Name', key: 'BuilderName' },
    { label: 'Subdivision Name', key: 'SubdivisionName' },
    { label: 'Address Number', key: 'AddressNumber' },
    { label: 'Address Name', key: 'AddressName' },
    { label: 'Parcel Number', key: 'ParcelNumber' },
    { label: 'Contractor', key: 'Contractor' },
    { label: 'Squre Footage', key: 'SqureFootage' },
    { label: 'Owner', key: 'Owner' },
    { label: 'Lot Number', key: 'LotNumber' },
    { label: 'Permit Number', key: 'PermitNumber' },
    { label: 'Plan', key: 'Plan' },
    { label: 'Sub Legal Name', key: 'SubLegalName' },
    { label: 'Value', key: 'Value' },
    { label: 'Product Type', key: 'ProductType' },
    { label: 'Area', key: 'Area' },
    { label: 'Master Plan', key: 'MasterPlan' },
    { label: 'Zip Code', key: 'ZipCode' },
    { label: 'Lot Width', key: 'LotWidth' },
    { label: 'Lot Size', key: 'LotSize' }, 
    { label: 'Zoning', key: 'Zoning' },
    { label: 'Age Restricted', key: 'AgeRestricted' },
    { label: 'All Single Story', key: 'AllSingleStory' },
    { label: 'Permit id', key: 'PermitID' },
    { label: 'Fk sub id', key: 'fkSubID' }, 
     
  ];
  const columns = [
    
    { label: 'Date', key: 'Date' },
    { label: 'Builder Name', key: 'BuilderName' },
    { label: 'Subdivision Name', key: 'SubdivisionName' },
    { label: 'Address Number', key: 'AddressNumber' },
    { label: 'Address Name', key: 'AddressName' },
    { label: 'Parcel Number', key: 'ParcelNumber' },
    { label: 'Contractor', key: 'Contractor' },
    { label: 'Squre Footage', key: 'SqureFootage' },
    { label: 'Owner', key: 'Owner' },
    { label: 'Lot Number', key: 'LotNumber' },
    { label: 'Permit Number', key: 'PermitNumber' },
    { label: 'Plan', key: 'Plan' },
    { label: 'Sub Legal Name', key: 'SubLegalName' },
    { label: 'Value', key: 'Value' },
    { label: 'Product Type', key: 'ProductType' },
    { label: 'Area', key: 'Area' },
    { label: 'Master Plan', key: 'MasterPlan' },
    { label: 'Zip Code', key: 'ZipCode' },
    { label: 'Lot Width', key: 'LotWidth' },
    { label: 'Lot Size', key: 'LotSize' },
    { label: 'Zoning', key: 'Zoning' },
    { label: 'Age Restricted', key: 'AgeRestricted' },
    { label: 'All Single Story', key: 'AllSingleStory' },
    { label: 'Permit id', key: 'PermitID' },
    { label: 'Fk sub id', key: 'fkSubID' }, 
  ];
  const handleColumnToggle = (column) => {
    const updatedColumns = selectedColumns.includes(column)
      ? selectedColumns.filter((col) => col !== column)
      : [...selectedColumns, column];
      console.log(updatedColumns);
    setSelectedColumns(updatedColumns);  
  };
  console.log('permitList : ',permitList);
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
 
    const tableData = permitList.map((row) => 
    newdata.map((nw, i) =>
    [ 
        nw === "Date" ?  row.date : '',
        nw === "Builder Name" ?  row.subdivision?.builder.name : '',
        nw === "Subdivision Name" ?  row.subdivision?.name : '',
        nw === "Address Number" ?  row.address1 : '',
        nw === "Address Name" ?  row.address2 : '',
        nw === "Parcel Number" ?  row.parcel : '',
        nw === "Contractor" ?  row.contractor : '',
        nw === "Squre Footage" ?  row.sqft : '',
        nw === "Owner" ?  row.owner : '',
        nw === "Lot Number" ?  row.lotnumber : '',
        nw === "Permit Number" ?  row.permitnumber : '',
        nw === "Plan" ?  row.plan : '',
        nw === "Sub Legal Name" ?  row.subdivision?.name : '',
        nw === "Value" ?  row.value : '',
        nw === "Product Type" ?  row.subdivision?.product_type : '',
        nw === "Area" ?  row.subdivision?.area : '',
        nw === "Master Plan" ?  row.subdivision?.masterplan_id : '',
        nw === "Zip Code" ?  row.subdivision?.zipcode : '',
        nw === "Lot Width" ?  row.subdivision?.lotwidth : '',
        nw === "Lot Size" ?  row.subdivision?.lotsize : '',
        nw === "Zoning" ?  row.subdivision?.zoning : '', 
        nw === "Age Restricted" ? (row.subdivision?.age === 1 && "Yes" || row.subdivision?.age === 0 && "No") : '', 
        nw === "All Single Story" ? (row.subdivision?.single === 1 && "Yes" || row.subdivision?.single === 0 && "No") : '',  
        nw === "Permit id" ?  row.permitnumber : '',
        nw === "Fk sub id" ?  row.subdivision?.subdivision_code : '',     
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

  const HandleRole = (e) => {
    setRole(e.target.value);
    setAccessRole(e.target.value);
  };
  const handleAccessForm = async (e) => {
    e.preventDefault();
    var userData = {
      form: accessForm,
      role: role,
      table: "permits",
    };
    try {
      const data = await AdminPermitService.manageAccessFields(userData).json();
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
      const response = await AdminPermitService.accessField();
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

  const permit = useRef();

  const getPermitList = async () => {
    try {
      const response = await AdminPermitService.index(searchQuery);
      const responseData = await response.json();
      setPermitList(responseData);
      setIsLoading(false);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(errorJson.message);
      }
    }
  };
  useEffect(() => {
    getPermitList();
  }, []);
  const handleDelete = async (e) => {
    try {
      let responseData = await AdminPermitService.destroy(e).json();
      if (responseData.status === true) {
        getPermitList();
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
    getPermitList();
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
          let responseData = await AdminPermitService.import(inputData).json();
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
  const getbuilderlist = async () => {
    try {
      const response = await AdminBuilderService.index();
      const responseData = await response.json();
      setBuilderList(responseData);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(errorJson.message);
      }
    }
  };
  useEffect(() => {
    getbuilderlist();
  }, []);

  useEffect(() => {
    getbuilderlist();
  }, []);

  const handlBuilderClick = (e) => {
    setShow(true);
  };
  const handleModalClick = () => {
    navigate("/report-list");
  };
  const handleBuilderCode = (code) => {
    setBuilderCode(code.target.value);
  };
  const handleRowClick = async (id) => {
    try {
      let responseData = await AdminPermitService.show(id).json();
      SetPermitDetails(responseData);
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
    getPermitList();
  }, [searchQuery]);

  const HandleSearch = (e) => {
    setIsLoading(true);
    const query = e.target.value.trim();

    debouncedHandleSearch(`?q=${query}`);
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key) {
      direction = sortConfig.direction === "asc" ? "desc" : "asc";
    }
    setSortConfig({ key, direction });
  };
  const sortedData = () => {
    const sorted = [...permitList];
    if (sortConfig.key !== "") {
      sorted.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === "builderName") {
          aValue =
            (a.subdivision &&
              a.subdivision.builder &&
              a.subdivision.builder.name) ||
            "";
          bValue =
            (b.subdivision &&
              b.subdivision.builder &&
              b.subdivision.builder.name) ||
            "";
        } else if (sortConfig.key === "subdivisionName") {
          aValue = (a.subdivision && a.subdivision.name) || "";
          bValue = (b.subdivision && b.subdivision.name) || "";
        }

        aValue = typeof aValue === "string" ? aValue.toLowerCase() : aValue;
        bValue = typeof bValue === "string" ? bValue.toLowerCase() : bValue;

        // Sorting logic
        if (aValue === bValue) return 0;
        return sortConfig.direction === "asc"
          ? aValue < bValue
            ? -1
            : 1
          : aValue > bValue
          ? -1
          : 1;
      });
    }
    return sorted;
  };
  const exportToExcelData = async () => {
    try {
      const bearerToken = JSON.parse(localStorage.getItem("usertoken"));
      const response = await axios.get(
        `${process.env.REACT_APP_IMAGE_URL}api/admin/permit/export`,
        // "https://hbrapi.rigicgspl.com/api/admin/permit/export",
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
      link.setAttribute("download", "permit.xlsx");
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

  return (
    <>
      <MainPagetitle mainTitle="Permit" pageTitle="Permit" parentTitle="Home" />
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-12">
            <div className="card" style={{ overflow: "auto" }}>
              <div className="card-body p-0">
                <div className="table-responsive active-projects style-1 ItemsCheckboxSec shorting">
                  <div className="tbl-caption d-flex justify-content-between text-wrap align-items-center">
                    <div className="d-flex text-nowrap justify-content-between align-items-center">
                      <h4 className="heading mb-0">Permit List</h4>
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
                    <div>
                      {/* <button
                        onClick={exportToExcelData}
                        className="btn btn-primary btn-sm me-1"
                      >
                        {" "}
                        <i class="fas fa-file-excel"></i>
                      </button> */}
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

                      <Link
                        to={"#"}
                        className="btn btn-primary btn-sm ms-1"
                        data-bs-toggle="offcanvas"
                        onClick={() => permit.current.showEmployeModal()}
                      >
                        + Add Permit
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
                            {checkFieldExist("Date") && (
                              <th onClick={() => requestSort("date")}>
                                <strong>Date </strong>
                                {sortConfig.key !== "date" ? "↑↓" : ""}
                                {sortConfig.key === "date" && (
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

                            {/* {checkFieldExist("Date") && (
                              <th onClick={() => requestSort("Address Name")}>
                                <strong>Address Name</strong>
                                {sortConfig.key !== "address1" ? "↑↓" : ""}
                                {sortConfig.key === "address1" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("Address Number") && (
                              <th onClick={() => requestSort("address2")}>
                                <strong>Address Number</strong>
                                {sortConfig.key !== "address2" ? "↑↓" : ""}
                                {sortConfig.key === "address2" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )} */}
                            
                            <th onClick={() => requestSort("address2")}>
                              <strong>Full Address</strong>
                              {sortConfig.key !== "address2" ? "↑↓" : ""}
                              {sortConfig.key === "address2" && (
                                <span>
                                  {sortConfig.direction === "asc" ? "↑" : "↓"}
                                </span>
                              )}
                            </th>
                           
                            {checkFieldExist("Parcel Number") && (
                              <th onClick={() => requestSort("address2")}>
                                <strong>Parcel Number</strong>
                                {sortConfig.key !== "parcel" ? "↑↓" : ""}
                                {sortConfig.key === "parcel" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("Contractor") && (
                              <th onClick={() => requestSort("contractor")}>
                                <strong>Contractor</strong>
                                {sortConfig.key !== "contractor" ? "↑↓" : ""}
                                {sortConfig.key === "contractor" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("Squre Footage") && (
                              <th onClick={() => requestSort("sqft")}>
                                <strong>Squre Footage</strong>
                                {sortConfig.key !== "sqft" ? "↑↓" : ""}
                                {sortConfig.key === "sqft" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("Owner") && (
                              <th onClick={() => requestSort("owner")}>
                                <strong>Owner</strong>
                                {sortConfig.key !== "owner" ? "↑↓" : ""}
                                {sortConfig.key === "owner" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("Date") && (
                              <th onClick={() => requestSort("Lot Number")}>
                                <strong>Lot Number</strong>
                                {sortConfig.key !== "lotnumber" ? "↑↓" : ""}
                                {sortConfig.key === "lotnumber" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("Permit Number") && (
                              <th onClick={() => requestSort("permitnumber")}>
                                <strong>Permit Number</strong>
                                {sortConfig.key !== "permitnumber" ? "↑↓" : ""}
                                {sortConfig.key === "permitnumber" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("Plan") && (
                              <th onClick={() => requestSort("plan")}>
                                <strong>Plan</strong>
                                {sortConfig.key !== "plan" ? "↑↓" : ""}
                                {sortConfig.key === "plan" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("Sub Legal Name") && (
                              <th
                              // onClick={() => requestSort("plan")}
                              >
                                <strong>Sub Legal Name</strong>
                                {/* {sortConfig.key !== "plan" ? "↑↓" : ""}
                              {sortConfig.key === "plan" && (
                                <span>
                                  {sortConfig.direction === "asc" ? "↑" : "↓"}
                                </span>
                              )} */}
                              </th>
                            )}
                            {checkFieldExist("Value") && (
                              <th onClick={() => requestSort("Value")}>
                                <strong>Value</strong>
                                {sortConfig.key !== "value" ? "↑↓" : ""}
                                {sortConfig.key === "value" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
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
                                {sortConfig.key !== "Area" ? "↑↓" : ""}
                                {sortConfig.key === "Area" && (
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
                            {checkFieldExist("__pkPermitID") && (
                              <th onClick={() => requestSort("permitnumber ")}>
                                <strong>__pkPermitID</strong>
                                {sortConfig.key !== "permitnumber" ? "↑↓" : ""}
                                {sortConfig.key === "permitnumber" && (
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
                                <strong>_fkSubID </strong>
                                {sortConfig.key !== "subdivisionCode "
                                  ? "↑↓"
                                  : ""}
                                {sortConfig.key === "subdivisionCode" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("Action") && (
                              <th>
                                <strong>Action</strong>
                              </th>
                            )}
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
                                {checkFieldExist("Date") && (
                                  <td>
                                    <DateComponent date={element.date} />
                                  </td>
                                )}
                                {checkFieldExist("Builder Name") && (
                                  <td>
                                    {element.subdivision &&
                                      element.subdivision.builder?.name}
                                  </td>
                                )}
                                {checkFieldExist("Subdivision Name") && (
                                  <td>
                                    {element.subdivision &&
                                      element.subdivision?.name}
                                  </td>
                                )}
                                  <td>{element.address2 +" "+ element.address1}</td>
                                {/* {checkFieldExist("Address Number") && (
                                  <td>{element.address2}</td>
                                )}
                                {checkFieldExist("Address Name") && (
                                  <td>{element.address1}</td>
                                )} */}
                                {checkFieldExist("Parcel Number") && (
                                  <td>{element.parcel}</td>
                                )}
                                {checkFieldExist("Contractor") && (
                                  <td>{element.contractor}</td>
                                )}
                                {checkFieldExist("Squre Footage") && (
                                  <td>{element.sqft}</td>
                                )}
                                {checkFieldExist("Owner") && (
                                  <td>{element.owner}</td>
                                )}
                                {checkFieldExist("Lot Number") && (
                                  <td>{element.lotnumber}</td>
                                )}
                                {checkFieldExist("Permit Number") && (
                                  <td>{element.permitnumber}</td>
                                )}
                                {checkFieldExist("Plan") && (
                                  <td>
                                    {element.plan === "" ||
                                    element.plan === null
                                      ? "NA"
                                      : element.plan}
                                  </td>
                                )}
                                {checkFieldExist("Sub Legal Name") && (
                                  <td>
                                    {element.subdivision &&
                                      element.subdivision?.name}
                                  </td>
                                )}
                                {checkFieldExist("Value") && (
                                  <td>{element.value}</td>
                                )}
                                {checkFieldExist("Product Type") && (
                                  <td>
                                    {element.subdivision &&
                                      element.subdivision?.product_type}
                                  </td>
                                )}
                                {checkFieldExist("Area") && (
                                  <td>
                                    {element.subdivision &&
                                      element.subdivision?.area}
                                  </td>
                                )}
                                {checkFieldExist("Master Plan") && (
                                  <td>
                                    {element.subdivision &&
                                      element.subdivision?.masterplan_id}
                                  </td>
                                )}
                                {checkFieldExist("Zip Code") && (
                                  <td>
                                    {element.subdivision &&
                                      element.subdivision?.zipcode}
                                  </td>
                                )}
                                {checkFieldExist("Lot Width") && (
                                  <td>
                                    {element.subdivision &&
                                      element.subdivision?.lotwidth}
                                  </td>
                                )}
                                {checkFieldExist("Lot Size") && (
                                  <td>
                                    {element.subdivision &&
                                      element.subdivision?.lotsize}
                                  </td>
                                )}
                                {checkFieldExist("Zoning") && (
                                  <td>
                                    {element.subdivision &&
                                      element.subdivision?.zoning}
                                  </td>
                                )}
                                {checkFieldExist("Age Restricted") && (
                                  <td>
                                    {element.subdivision &&
                                      element.subdivision.age === 1 &&
                                      "Yes"}
                                    {element.subdivision &&
                                      element.subdivision.age === 0 &&
                                      "No"}
                                  </td>
                                )}
                                {checkFieldExist("All Single Story") && (
                                  <td>
                                    {element.subdivision &&
                                      element.subdivision.single === 1 &&
                                      "Yes"}
                                    {element.subdivision &&
                                      element.subdivision.single === 0 &&
                                      "No"}
                                  </td>
                                )}
                                {checkFieldExist("Date Added") && (
                                  <td>
                                    <DateComponent date={element.created_at} />
                                  </td>
                                )}
                                {checkFieldExist("__pkPermitID") && (
                                  <td>{element.permitnumber}</td>
                                )}
                                {checkFieldExist("_fkSubID") && (
                                  <td>
                                    {element.subdivision &&
                                      element.subdivision?.subdivision}
                                  </td>
                                )}
                                {checkFieldExist("Action") && (
                                  <td>
                                    <div className="d-flex justify-content-center">
                                      <Link
                                        to={`/permitupdate/${element.id}`}
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
                      <div className="dataTables_info">
                        Showing {lastIndex - recordsPage + 1} to{" "}
                        {permitList.length < lastIndex
                          ? permitList.length
                          : lastIndex}{" "}
                        of {permitList.length} entries
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
      <PermitOffcanvas
        ref={permit}
        Title="Add Permit"
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
            Permit Details{" "}
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
                <label className="">Subdivision:</label>
                <div>
                  {PermitDetails.subdivision !== null &&
                  PermitDetails.subdivision.name !== undefined
                    ? PermitDetails.subdivision.name
                    : "NA"}
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Parcel:</label>
                <div>
                  <span className="fw-bold">
                    {PermitDetails.parcel || "NA"}
                  </span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Contractor :</label>
                <div>
                  <span className="fw-bold">
                    {PermitDetails.contractor || "NA"}
                  </span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Description:</label>
                <div>
                  <span className="fw-bold">
                    {PermitDetails.description || "NA"}
                  </span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Date:</label>
                <div>
                  <span className="fw-bold">
                    <span className="fw-bold">
                      {<DateComponent date={PermitDetails.date} /> || "NA"}
                    </span>
                  </span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Date Added:</label>
                <div>
                  <span className="fw-bold">
                    {<DateComponent date={PermitDetails.dateadded} /> || "NA"}
                  </span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Lot Number:</label>
                <div>
                  <span className="fw-bold">
                    {PermitDetails.lotnumber || "NA"}
                  </span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Owner:</label>
                <div>
                  <span className="fw-bold">{PermitDetails.owner || "NA"}</span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Plan :</label>
                <div>
                  <span className="fw-bold">{PermitDetails.plan || "NA"}</span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">SQFT:</label>
                <div>
                  <span className="fw-bold">{PermitDetails.sqft || "NA"}</span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Value:</label>
                <div>
                  <span className="fw-bold">{PermitDetails.value || "NA"}</span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Permit Number:</label>
                <div>
                  <span className="fw-bold">
                    {PermitDetails.permitnumber || "NA"}
                  </span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Address 1:</label>
                <div>
                  <span className="fw-bold">
                    {PermitDetails.address1 || "NA"}
                  </span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Address 2:</label>
                <div>
                  <span className="fw-bold">
                    {PermitDetails.address2 || "NA"}
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
            Manage Permit Fields Access{" "}
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

export default PermitList;
