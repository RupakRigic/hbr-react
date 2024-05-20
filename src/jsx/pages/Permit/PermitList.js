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
import { DownloadTableExcel, downloadExcel } from "react-export-table-to-excel";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import BulkPermitUpdate from "./BulkPermitUpdate";
import ColumnReOrderPopup from "../../popup/ColumnReOrderPopup";
import Select from "react-select";
import AdminSubdevisionService from "../../../API/Services/AdminService/AdminSubdevisionService";

const PermitList = () => {
  const [SubdivisionList, SetSubdivisionList] = useState([]);

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
  const [builderDropDown, setBuilderDropDown] = useState([]);

  
  useEffect(() => {
    const fetchBuilderList = async () => {
      try {
        const response = await AdminBuilderService.builderDropDown();
        const data = await response.json();
        setBuilderDropDown(data);
      } catch (error) {
        console.log("Error fetching builder list:", error);
      }
    };

    fetchBuilderList();
  }, []);

  console.log(SubdivisionList);

  const getSubdivisionList = async () => {

    try {

        let response = await AdminSubdevisionService.index()
        let responseData = await response.json()

        SetSubdivisionList(responseData.data)

    } catch (error) {
        if (error.name === 'HTTPError') {
            const errorJson = await error.response.json();

            setError(errorJson.message)
        }
    }
}
useEffect(() => {
    if (localStorage.getItem('usertoken')) {

        getSubdivisionList();

    }
    else {
        navigate('/');
    }

  
}, [])

  const [selectedLandSales, setSelectedLandSales] = useState([]);
  const bulkPermit = useRef();
  const handleEditCheckboxChange = (e, userId) => {
    if (e.target.checked) {
      setSelectedLandSales((prevSelectedUsers) => [...prevSelectedUsers, userId]);
    } else {
      setSelectedLandSales((prevSelectedUsers) => prevSelectedUsers.filter((id) => id !== userId));
    }
  };
  
  
  const handleRemoveSelected = () => {
      const newSortConfig = sortConfig.filter(item => selectedCheckboxes.includes(item.key));
      setSortConfig(newSortConfig);
      setSelectedCheckboxes([]);
  };
  const [AllPermitListExport, setAllPermitListExport] = useState([]);
  const [showSort, setShowSort] = useState(false);
  const handleSortClose = () => setShowSort(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [Error, setError] = useState("");
  var imageUrl = process.env.REACT_APP_Builder_IMAGE_URL;
  const [permitList, setPermitList] = useState([]);
  const [permitListCount, setPermitListCount] = useState("");
  const [TotalPermitListCount, setTotalPermitListCount] = useState("");
  const [manageFilterOffcanvas, setManageFilterOffcanvas] = useState(false);
  const [filterQuery, setFilterQuery] = useState({
    date:"",
    builder_name:"",
    subdivision_name:"",
    address2:"",
    address1:"",
    parcel:"",
    contractor:"",
    sqft:"",
    owner:"",
    lotnumber:"",
    permitnumber:"",
    plan:"",
    sublegalname:"",
    value:"",
    product_type:"",
    area:"",
    masterplan_id:"",
    
  });
  const HandleCancelFilter = (e) => {
    setFilterQuery({
      status: "",
      subdivision_id: "",
    });
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

  const HandleFilterForm = (e) =>
    {
      e.preventDefault();
      console.log(555);
      getPermitList(currentPage,searchQuery);
    };
  

  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState([]);
  useEffect(() => {
    setSelectedCheckboxes(sortConfig.map(col => col.key));
}, [sortConfig]);
const [selectedCheckboxes, setSelectedCheckboxes] = useState(sortConfig.map(col => col.key));
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [exportmodelshow, setExportModelShow] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPage = 100;
  const lastIndex = currentPage * recordsPage;
  const firstIndex = lastIndex - recordsPage;
  const [npage, setNpage] = useState(0);
  const number = [...Array(npage + 1).keys()].slice(1);

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

  const [openDialog, setOpenDialog] = useState(false);
  const [columns, setColumns] = useState([]);
  const [draggedColumns, setDraggedColumns] = useState(columns);

  useEffect(() => {
    console.log("list field : ", fieldList); // You can now use fieldList in this component
  }, [fieldList]);

  const checkFieldExist = (fieldName) => {
    return fieldList.includes(fieldName.trim());
  };
  const HandleSelectChange = (selectedOption) => {
    setFilterQuery((prevFilterQuery) => ({
      ...prevFilterQuery,
      builder_name: selectedOption.name,
    }));
  };
  const HandleSubSelectChange = (selectedOption) => {
    setFilterQuery((prevFilterQuery) => ({
      ...prevFilterQuery,
      subdivision_name: selectedOption.name,
    }));
  };

  const headers = [
    { label: "Date", key: "Date" },
    { label: "Builder Name", key: "BuilderName" },
    { label: "Subdivision Name", key: "SubdivisionName" },
    { label: "Address Number", key: "AddressNumber" },
    { label: "Address Name", key: "AddressName" },
    { label: "Parcel Number", key: "ParcelNumber" },
    { label: "Contractor", key: "Contractor" },
    { label: "Squre Footage", key: "SqureFootage" },
    { label: "Owner", key: "Owner" },
    { label: "Lot Number", key: "LotNumber" },
    { label: "Permit Number", key: "PermitNumber" },
    { label: "Plan", key: "Plan" },
    { label: "Sub Legal Name", key: "SubLegalName" },
    { label: "Value", key: "Value" },
    { label: "Product Type", key: "ProductType" },
    { label: "Area", key: "Area" },
    { label: "Master Plan", key: "MasterPlan" },
    { label: "Zip Code", key: "ZipCode" },
    { label: "Lot Width", key: "LotWidth" },
    { label: "Lot Size", key: "LotSize" },
    { label: "Zoning", key: "Zoning" },
    { label: "Age Restricted", key: "AgeRestricted" },
    { label: "All Single Story", key: "AllSingleStory" },
    { label: "Permit id", key: "PermitID" },
    { label: "Fk sub id", key: "fkSubID" },
  ];
  const excelcolumns = [
    { label: "Date", key: "Date" },
    { label: "Builder Name", key: "BuilderName" },
    { label: "Subdivision Name", key: "SubdivisionName" },
    { label: "Address Number", key: "AddressNumber" },
    { label: "Address Name", key: "AddressName" },
    { label: "Parcel Number", key: "ParcelNumber" },
    { label: "Contractor", key: "Contractor" },
    { label: "Squre Footage", key: "SqureFootage" },
    { label: "Owner", key: "Owner" },
    { label: "Lot Number", key: "LotNumber" },
    { label: "Permit Number", key: "PermitNumber" },
    { label: "Plan", key: "Plan" },
    { label: "Sub Legal Name", key: "SubLegalName" },
    { label: "Value", key: "Value" },
    { label: "Product Type", key: "ProductType" },
    { label: "Area", key: "Area" },
    { label: "Master Plan", key: "MasterPlan" },
    { label: "Zip Code", key: "ZipCode" },
    { label: "Lot Width", key: "LotWidth" },
    { label: "Lot Size", key: "LotSize" },
    { label: "Zoning", key: "Zoning" },
    { label: "Age Restricted", key: "AgeRestricted" },
    { label: "All Single Story", key: "AllSingleStory" },
    { label: "Permit id", key: "PermitID" },
    { label: "Fk sub id", key: "fkSubID" },
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
  
    let tableHeaders;
    if (selectedColumns.length > 0) {
      tableHeaders = selectedColumns;
    } else {
      tableHeaders = headers.map((c) => c.label);
    }
  
    const tableData = AllPermitListExport.map((row) => {
      return tableHeaders.map((header) => {
        switch (header) {
          case "Date":
            return row.date || '';
          case "Builder Name":
            return row.subdivision?.builder.name || '';
          case "Subdivision Name":
            return row.subdivision?.name || '';
          case "Address Number":
            return row.address1 || '';
          case "Address Name":
            return row.address2 || '';
          case "Parcel Number":
            return row.parcel || '';
          case "Contractor":
            return row.contractor || '';
          case "Square Footage":
            return row.sqft || '';
          case "Owner":
            return row.owner || '';
          case "Lot Number":
            return row.lotnumber || '';
          case "Permit Number":
            return row.permitnumber || '';
          case "Plan":
            return row.plan || '';
          case "Sub Legal Name":
            return row.subdivision?.name || '';
          case "Value":
            return row.value || '';
          case "Product Type":
            return row.subdivision?.product_type || '';
          case "Area":
            return row.subdivision?.area || '';
          case "Master Plan":
            return row.subdivision?.masterplan_id || '';
          case "Zip Code":
            return row.subdivision?.zipcode || '';
          case "Lot Width":
            return row.subdivision?.lotwidth || '';
          case "Lot Size":
            return row.subdivision?.lotsize || '';
          case "Zoning":
            return row.subdivision?.zoning || '';
          case "Age Restricted":
            return (row.subdivision?.age === 1 ? "Yes" : "No") || '';
          case "All Single Story":
            return (row.subdivision?.single === 1 ? "Yes" : "No") || '';
          case "Permit id":
            return row.permitnumber || '';
          case "Fk sub id":
            return row.subdivision?.subdivision_code || '';
          default:
            return '';
        }
      });
    });
  
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([tableHeaders, ...tableData]);
  
    // Optionally apply styles to the headers
    const headerRange = XLSX.utils.decode_range(worksheet['!ref']);
    for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
      const cell = worksheet[XLSX.utils.encode_cell({ r: 0, c: C })];
      if (!cell.s) cell.s = {};
      cell.s.font = { name: 'Calibri', sz: 11, bold: false };
    }
  
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Permit');
  
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'Permit.xlsx');
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
      table: "permits",
    };
    try {
      const data = await AdminPermitService.manageAccessFields(userData).json();
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

  const permit = useRef();
  const stringifySortConfig = (sortConfig) => {
    return sortConfig.map((sort) => `${sort.key}:${sort.direction}`).join(",");
  };
  const getPermitList = async (currentPage) => {
    try {
      let sortConfigString = "";
      if (sortConfig !== null) {
        sortConfigString = "&sortConfig=" + stringifySortConfig(sortConfig);
      }
      const response = await AdminPermitService.index(currentPage,sortConfigString,searchQuery);
      const responseData = await response.json();
      setPermitList(responseData.data);
      setNpage(Math.ceil(responseData.total / recordsPage));
      console.log(permitList);
      setIsLoading(false);
      setPermitListCount(responseData.total);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(errorJson.message);
      }
    }
  };
  useEffect(() => {
    console.log(currentPage);
    getPermitList(currentPage);
    fetchAllPages(searchQuery, sortConfig);
  }, [currentPage]);

  async function fetchAllPages(searchQuery, sortConfig) {
    const response = await AdminPermitService.index(1, searchQuery, sortConfig ? `&sortConfig=${stringifySortConfig(sortConfig)}` : "");
    const responseData = await response.json();
    const totalPages = Math.ceil(responseData.total / recordsPage);
    let allData = responseData.data;
    for (let page = 2; page <= totalPages; page++) {
      const pageResponse = await AdminPermitService.index(page, searchQuery, sortConfig ? `&sortConfig=${stringifySortConfig(sortConfig)}` : "");
      const pageData = await pageResponse.json();
      allData = allData.concat(pageData.data);
    }
    setAllPermitListExport(allData);
  }
  console.log(AllPermitListExport);
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

    debouncedHandleSearch(`&=${query}`);
  };

  
    const HandleFilter = (e) => {
      const { name, value } = e.target;
      setFilterQuery((prevFilterQuery) => ({
        ...prevFilterQuery,
        [name]: value,
      }));
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
    getPermitList(currentPage, sortConfig);
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
  
  useEffect(() => {
    const mappedColumns = fieldList.map((data) => ({
      id: data.charAt(0).toLowerCase() + data.slice(1),
      label: data
    }));
    setColumns(mappedColumns);
  }, [fieldList]);
  
  const toCamelCase = (str) => {
    return str
      .toLowerCase()
      .split(' ')
      .map((word, index) => {
        if (index === 0) {
          return word;
        }
          return word.charAt(0).toUpperCase() + word.slice(1);
      })
    .join('');
  }

  return (
    <>
      <MainPagetitle mainTitle="Permit" pageTitle="Permit" parentTitle="Home" />
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-12">
            <div className="card" style={{ overflow: "auto" }}>
              <div className="card-body p-0">
                <div className="table-responsive active-projects style-1 ItemsCheckboxSec shorting">
                  <div className="tbl-caption d-flex justify-content-between text-wrap align-items-center pb-0">
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
                      <ColumnReOrderPopup
                        open={openDialog}
                        fieldList={fieldList}
                        handleCloseDialog={handleCloseDialog}
                        handleSaveDialog={handleSaveDialog}
                        draggedColumns={draggedColumns}
                        handleColumnOrderChange={handleColumnOrderChange}
                      />
                    </div>
                    <div>
                      <button className="btn btn-primary btn-sm me-1" onClick={handleOpenDialog}>
                        Set Columns Order
                      </button>

                                        <Button
                            className="btn-sm me-1"
                            variant="secondary"
                            onClick={HandleSortDetailClick}
                          >
                            <i class="fa-solid fa-sort"></i>
                     </Button>
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
                      <button className="btn btn-success btn-sm me-1" onClick={() => setManageFilterOffcanvas(true)}>
                      <i className="fa fa-filter" />
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
                      <Link
                        to={"#"}
                        className="btn btn-primary btn-sm ms-1"
                        data-bs-toggle="offcanvas"
                        onClick={() => bulkPermit.current.showEmployeModal()}
                      >
                        Bulk Edit
                      </Link>
                    </div>
                  </div>
                  <div className="d-sm-flex text-center justify-content-between align-items-center dataTables_wrapper no-footer">
                      <div className="dataTables_info">
                        Showing {lastIndex - recordsPage + 1} to {lastIndex} of{" "}
                        {permitListCount} entries
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
                                checked={selectedLandSales.length === permitList.length}
                                onChange={(e) =>
                                  e.target.checked
                                    ? setSelectedLandSales(permitList.map((user) => user.id))
                                    : setSelectedLandSales([])
                                }
                              />
                            </th>
                            <th>
                              <strong>No.</strong>
                            </th>
                            {columns.map((column) => (
                              <th style={{ textAlign: "center", cursor: "pointer" }} key={column.id} onClick={() => column.id != ("action") ? requestSort(
                                column.id == "parcel Number" ? "parcel" : 
                                (column.id == "squre Footage" ? "sqft" : 
                                (column.id == "lot Number" ? "lotnumber" : 
                                (column.id == ("permit Number" || "__pkPermitID") ? "permitnumber" : 
                                (column.id == "sub Legal Name" ? "Sublegal_name" : 
                                (column.id == "lot Size" ? "lotsize" : 
                                (column.id == "age Restricted" ? "age" : 
                                (column.id == "all Single Story" ? "stories" : 
                                (column.id == "date Added" ? "created_at" : 
                                (column.id == "_fkSubID" ? "subdivisionCode" : toCamelCase(column.id))))))))))) : ""}>
                                <strong>
                                  {column.label}
                                  {column.id != "action" && sortConfig.some(
                                    (item) => item.key === toCamelCase(column.id)
                                    ) ? (
                                    <span>
                                      {column.id != "action" && sortConfig.find(
                                        (item) => item.key === toCamelCase(column.id)
                                        ).direction === "asc" ? "↑" : "↓"}
                                    </span>
                                    ) : (
                                    column.id != "action" && <span>↑↓</span>
                                  )}
                                </strong>
                              </th>
                            ))}
                            {/* {checkFieldExist("Date") && (
                              <th onClick={() => requestSort("date")}>
                                <strong>Date </strong>
                                {sortConfig.some(
                                  (item) => item.key === "date"
                                ) ? (
                                  <span>
                                    {sortConfig.find(
                                      (item) => item.key === "date"
                                    ).direction === "asc"
                                      ? "↑"
                                      : "↓"}
                                  </span>
                                ) : (
                                  <span>↑↓</span>
                                )}
                              </th>
                            )} */}

                            {/* {checkFieldExist("Builder Name") && (
                              <th onClick={() => requestSort("builderName")}>
                                <strong>Builder Name</strong>
                                {sortConfig.some(
                                  (item) => item.key === "builderName"
                                ) ? (
                                  <span>
                                    {sortConfig.find(
                                      (item) => item.key === "builderName"
                                    ).direction === "asc"
                                      ? "↑"
                                      : "↓"}
                                  </span>
                                ) : (
                                  <span>↑↓</span>
                                )}
                              </th>
                            )} */}

                            {/* {checkFieldExist("Subdivision Name") && (
                              <th
                                onClick={() => requestSort("subdivisionName")}
                              >
                                <strong>Subdivision Name</strong>
                                {sortConfig.some(
                                  (item) => item.key === "subdivisionName"
                                ) ? (
                                  <span>
                                    {sortConfig.find(
                                      (item) => item.key === "subdivisionName"
                                    ).direction === "asc"
                                      ? "↑"
                                      : "↓"}
                                  </span>
                                ) : (
                                  <span>↑↓</span>
                                )}
                              </th>
                            )} */}


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

                            {/* <th onClick={() => requestSort("address2")}>
                              <strong>Full Address</strong>
                              {sortConfig.some(
                                  (item) => item.key === "address2"
                                ) ? (
                                  <span>
                                    {sortConfig.find(
                                      (item) => item.key === "address2"
                                    ).direction === "asc"
                                      ? "↑"
                                      : "↓"}
                                  </span>
                                ) : (
                                  <span>↑↓</span>
                                )}
                            </th> */}

                            {/* {checkFieldExist("Parcel Number") && (
                              <th onClick={() => requestSort("parcel")}>
                                <strong>Parcel Number</strong>
                                {sortConfig.some(
                                  (item) => item.key === "parcel"
                                ) ? (
                                  <span>
                                    {sortConfig.find(
                                      (item) => item.key === "parcel"
                                    ).direction === "asc"
                                      ? "↑"
                                      : "↓"}
                                  </span>
                                ) : (
                                  <span>↑↓</span>
                                )}
                              </th>
                            )} */}

                            {/* {checkFieldExist("Contractor") && (
                              <th onClick={() => requestSort("contractor")}>
                                <strong>Contractor</strong>
                                {sortConfig.some(
                                  (item) => item.key === "contractor"
                                ) ? (
                                  <span>
                                    {sortConfig.find(
                                      (item) => item.key === "contractor"
                                    ).direction === "asc"
                                      ? "↑"
                                      : "↓"}
                                  </span>
                                ) : (
                                  <span>↑↓</span>
                                )}
                              </th>
                            )} */}

                            {/* {checkFieldExist("Squre Footage") && (
                              <th onClick={() => requestSort("sqft")}>
                                <strong>Squre Footage</strong>
                                {sortConfig.some(
                                  (item) => item.key === "sqft"
                                ) ? (
                                  <span>
                                    {sortConfig.find(
                                      (item) => item.key === "sqft"
                                    ).direction === "sqft"
                                      ? "↑"
                                      : "↓"}
                                  </span>
                                ) : (
                                  <span>↑↓</span>
                                )}
                              </th>
                            )} */}

                            {/* {checkFieldExist("Owner") && (
                              <th onClick={() => requestSort("owner")}>
                                <strong>Owner</strong>
                                {sortConfig.some(
                                  (item) => item.key === "owner"
                                ) ? (
                                  <span>
                                    {sortConfig.find(
                                      (item) => item.key === "owner"
                                    ).direction === "asc"
                                      ? "↑"
                                      : "↓"}
                                  </span>
                                ) : (
                                  <span>↑↓</span>
                                )}
                              </th>
                            )} */}

                            {/* {checkFieldExist("Lot Number") && (
                              <th onClick={() => requestSort("lotnumber")}>
                                <strong>Lot Number</strong>
                                {sortConfig.some(
                                  (item) => item.key === "lotnumber"
                                ) ? (
                                  <span>
                                    {sortConfig.find(
                                      (item) => item.key === "lotnumber"
                                    ).direction === "asc"
                                      ? "↑"
                                      : "↓"}
                                  </span>
                                ) : (
                                  <span>↑↓</span>
                                )}
                              </th>
                            )} */}

                            {/* {checkFieldExist("Permit Number") && (
                              <th onClick={() => requestSort("permitnumber")}>
                                <strong>Permit Number</strong>
                                {sortConfig.some(
                                  (item) => item.key === "permitnumber"
                                ) ? (
                                  <span>
                                    {sortConfig.find(
                                      (item) => item.key === "permitnumber"
                                    ).direction === "asc"
                                      ? "↑"
                                      : "↓"}
                                  </span>
                                ) : (
                                  <span>↑↓</span>
                                )}
                              </th>
                            )} */}

                            {/* {checkFieldExist("Plan") && (
                              <th onClick={() => requestSort("plan")}>
                                <strong>Plan</strong>
                                {sortConfig.some(
                                  (item) => item.key === "plan"
                                ) ? (
                                  <span>
                                    {sortConfig.find(
                                      (item) => item.key === "plan"
                                    ).direction === "asc"
                                      ? "↑"
                                      : "↓"}
                                  </span>
                                ) : (
                                  <span>↑↓</span>
                                )}
                              </th>
                            )} */}

                            {/* {checkFieldExist("Sub Legal Name") && (
                              <th>
                                <strong>Sub Legal Name</strong>
                                {sortConfig.some(
                                  (item) => item.key === "Sublegal_name"
                                ) ? (
                                  <span>
                                    {sortConfig.find(
                                      (item) => item.key === "Sublegal_name"
                                    ).direction === "asc"
                                      ? "↑"
                                      : "↓"}
                                  </span>
                                ) : (
                                  <span>↑↓</span>
                                )}
                              </th>
                            )} */}

                            {/* {checkFieldExist("Value") && (
                              <th onClick={() => requestSort("value")}>
                                <strong>Value</strong>
                                {sortConfig.some(
                                  (item) => item.key === "value"
                                ) ? (
                                  <span>
                                    {sortConfig.find(
                                      (item) => item.key === "value"
                                    ).direction === "asc"
                                      ? "↑"
                                      : "↓"}
                                  </span>
                                ) : (
                                  <span>↑↓</span>
                                )}
                              </th>
                            )} */}

                            {/* {checkFieldExist("Product Type") && (
                              <th onClick={() => requestSort("productType")}>
                                <strong>Product Type</strong>
                                {sortConfig.some(
                                  (item) => item.key === "productType"
                                ) ? (
                                  <span>
                                    {sortConfig.find(
                                      (item) => item.key === "productType"
                                    ).direction === "asc"
                                      ? "↑"
                                      : "↓"}
                                  </span>
                                ) : (
                                  <span>↑↓</span>
                                )}
                              </th>
                            )} */}

                            {/* {checkFieldExist("Area") && (
                              <th onClick={() => requestSort("area")}>
                                <strong>Area</strong>
                                {sortConfig.some(
                                  (item) => item.key === "area"
                                ) ? (
                                  <span>
                                    {sortConfig.find(
                                      (item) => item.key === "area"
                                    ).direction === "asc"
                                      ? "↑"
                                      : "↓"}
                                  </span>
                                ) : (
                                  <span>↑↓</span>
                                )}
                              </th>
                            )} */}

                            {/* {checkFieldExist("Master Plan") && (
                              <th onClick={() => requestSort("masterPlan")}>
                                <strong>Master Plan</strong>
                                {sortConfig.some(
                                  (item) => item.key === "masterPlan"
                                ) ? (
                                  <span>
                                    {sortConfig.find(
                                      (item) => item.key === "masterPlan"
                                    ).direction === "asc"
                                      ? "↑"
                                      : "↓"}
                                  </span>
                                ) : (
                                  <span>↑↓</span>
                                )}
                              </th>
                            )} */}

                            {/* {checkFieldExist("Zip Code") && (
                              <th onClick={() => requestSort("zipCode")}>
                                <strong>Zip Code</strong>
                                {sortConfig.some(
                                  (item) => item.key === "zipCode"
                                ) ? (
                                  <span>
                                    {sortConfig.find(
                                      (item) => item.key === "zipCode"
                                    ).direction === "asc"
                                      ? "↑"
                                      : "↓"}
                                  </span>
                                ) : (
                                  <span>↑↓</span>
                                )}
                              </th>
                            )} */}

                            {/* {checkFieldExist("Lot Width") && (
                              <th onClick={() => requestSort("lotWidth")}>
                                <strong>Lot Width</strong>
                                {sortConfig.some(
                                  (item) => item.key === "lotWidth"
                                ) ? (
                                  <span>
                                    {sortConfig.find(
                                      (item) => item.key === "lotWidth"
                                    ).direction === "asc"
                                      ? "↑"
                                      : "↓"}
                                  </span>
                                ) : (
                                  <span>↑↓</span>
                                )}
                              </th>
                            )} */}

                            {/* {checkFieldExist("Lot Size") && (
                              <th onClick={() => requestSort("lotsize")}>
                                <strong>Lot Size</strong>
                                {sortConfig.some(
                                  (item) => item.key === "lotsize"
                                ) ? (
                                  <span>
                                    {sortConfig.find(
                                      (item) => item.key === "lotsize"
                                    ).direction === "asc"
                                      ? "↑"
                                      : "↓"}
                                  </span>
                                ) : (
                                  <span>↑↓</span>
                                )}
                              </th>
                            )} */}

                            {/* {checkFieldExist("Zoning") && (
                              <th onClick={() => requestSort("zoning")}>
                                <strong>Zoning</strong>
                                {sortConfig.some(
                                  (item) => item.key === "zoning"
                                ) ? (
                                  <span>
                                    {sortConfig.find(
                                      (item) => item.key === "zoning"
                                    ).direction === "asc"
                                      ? "↑"
                                      : "↓"}
                                  </span>
                                ) : (
                                  <span>↑↓</span>
                                )}
                              </th>
                            )} */}

                            {/* {checkFieldExist("Age Restricted") && (
                              <th onClick={() => requestSort("age")}>
                                <strong>Age Restricted</strong>
                                {sortConfig.some(
                                  (item) => item.key === "age"
                                ) ? (
                                  <span>
                                    {sortConfig.find(
                                      (item) => item.key === "age"
                                    ).direction === "asc"
                                      ? "↑"
                                      : "↓"}
                                  </span>
                                ) : (
                                  <span>↑↓</span>
                                )}
                              </th>
                            )} */}

                            {/* {checkFieldExist("All Single Story") && (
                              <th onClick={() => requestSort("stories")}>
                                <strong>All Single Story</strong>
                                {sortConfig.some(
                                  (item) => item.key === "stories"
                                ) ? (
                                  <span>
                                    {sortConfig.find(
                                      (item) => item.key === "stories"
                                    ).direction === "asc"
                                      ? "↑"
                                      : "↓"}
                                  </span>
                                ) : (
                                  <span>↑↓</span>
                                )}
                              </th>
                            )} */}

                            {/* {checkFieldExist("Date Added") && (
                              <th onClick={() => requestSort("created_at")}>
                                <strong>Date Added</strong>
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
                              </th>
                            )} */}

                            {/* {checkFieldExist("__pkPermitID") && (
                              <th onClick={() => requestSort("permitnumber")}>
                                <strong>__pkPermitID</strong>
                                {sortConfig.some(
                                  (item) => item.key === "permitnumber"
                                ) ? (
                                  <span>
                                    {sortConfig.find(
                                      (item) => item.key === "permitnumber"
                                    ).direction === "asc"
                                      ? "↑"
                                      : "↓"}
                                  </span>
                                ) : (
                                  <span>↑↓</span>
                                )}
                              </th>
                            )} */}

                            {/* {checkFieldExist("_fkSubID") && (
                              <th
                                onClick={() => requestSort("subdivisionCode")}
                              >
                                <strong>_fkSubID </strong>
                                {sortConfig.some(
                                  (item) => item.key === "subdivisionCode"
                                ) ? (
                                  <span>
                                    {sortConfig.find(
                                      (item) => item.key === "subdivisionCode"
                                    ).direction === "asc"
                                      ? "↑"
                                      : "↓"}
                                  </span>
                                ) : (
                                  <span>↑↓</span>
                                )}
                              </th>
                            )} */}

                            {/* {checkFieldExist("Action") && (
                              <th>
                                <strong>Action</strong>
                              </th>
                            )} */}

                          </tr>
                        </thead>
                        <tbody style={{ textAlign: "center" }}>
                          {permitList != null && permitList.length > 0 ? (
                            permitList.map((element, index) => (
                              <tr
                              onClick={(e) => {
                                if(e.target.type !== "checkbox"){
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
                                    checked={selectedLandSales.includes(element.id)}
                                    onChange={(e) => handleEditCheckboxChange(e, element.id)}
                                    style={{
                                      cursor: "pointer",
                                    }}
                                  />
                                </td>
                                <td>{index + 1}</td>
                                {columns.map((column) => (
                                  <>
                                  {column.id == "date" &&
                                    <td key={column.id} style={{ textAlign: "center" }}><DateComponent date={element.date} /></td>
                                  }
                                  {column.id == "builder Name" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.subdivision && element.subdivision.builder?.name}</td>
                                  }
                                  {column.id == "subdivision Name" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.subdivision && element.subdivision?.name}</td>
                                  }
                                  {column.id == "address Number" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.address1}</td>
                                  }
                                  {column.id == "address Name" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.address2}</td>
                                  }
                                  {column.id == "parcel Number" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.parcel}</td>
                                  }
                                  {column.id == "contractor" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.contractor}</td>
                                  }
                                  {column.id == "squre Footage" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.sqft}</td>
                                  }
                                  {column.id == "owner" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.owner}</td>
                                  }
                                  {column.id == "lot Number" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.lotnumber}</td>
                                  }
                                  {column.id == "permit Number" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.permitnumber}</td>
                                  }
                                  {column.id == "plan" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.plan === "" || element.plan === null ? "NA" : element.plan}</td>
                                  }
                                  {column.id == "sub Legal Name" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.subdivision && element.subdivision?.name}</td>
                                  }
                                  {column.id == "value" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.value}</td>
                                  }
                                  {column.id == "product Type" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.subdivision && element.subdivision?.product_type}</td>
                                  }
                                  {column.id == "area" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.subdivision && element.subdivision?.area}</td>
                                  }
                                  {column.id == "master Plan" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.subdivision && element.subdivision?.masterplan_id}</td>
                                  }
                                  {column.id == "zip Code" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.subdivision && element.subdivision?.zipcode}</td>
                                  }
                                  {column.id == "lot Width" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.subdivision && element.subdivision?.lotwidth}</td>
                                  }
                                  {column.id == "lot Size" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.subdivision && element.subdivision?.lotsize}</td>
                                  }
                                  {column.id == "zoning" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.subdivision && element.subdivision?.zoning}</td>
                                  }
                                  {column.id == "age Restricted" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>
                                      {element.subdivision && element.subdivision.age === 1 && "Yes"}
                                      {element.subdivision && element.subdivision.age === 0 && "No"}
                                    </td>
                                  }
                                  {column.id == "all Single Story" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>
                                      {element.subdivision && element.subdivision.single === 1 && "Yes"}
                                      {element.subdivision && element.subdivision.single === 0 && "No"}
                                    </td>
                                  }
                                  {column.id == "date Added" &&
                                    <td key={column.id} style={{ textAlign: "center" }}><DateComponent date={element.created_at} /></td>
                                  }
                                  {column.id == "__pkPermitID" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.permitnumber}</td>
                                  }
                                  {column.id == "_fkSubID" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.subdivision && element.subdivision?.subdivision_code}</td>
                                  }
                                  {column.id == "action" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>
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
                                  }
                                  
                                  </>
                                ))}
                                

                                {/* <td>
                                  {element.address2 + " " + element.address1}
                                </td> */}

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
      <PermitOffcanvas
        ref={permit}
        Title="Add Permit"
        parentCallback={handleCallback}
      />
        <BulkPermitUpdate
        ref={bulkPermit}
        Title="Bulk Edit Permit sale"
        parentCallback={handleCallback}
        selectedLandSales={selectedLandSales}
      />
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
                                <span>
                                {columns.find(column => column.key === col.key)?.label !== undefined
        ? columns.find(column => column.key === col.key)?.label
        : col.key}
        
                                        
                                </span>:<span>{col.direction}</span>
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
      <Offcanvas
        show={manageFilterOffcanvas}
        onHide={setManageFilterOffcanvas}
        className="offcanvas-end customeoff"
        placement="end"
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="modal-title" id="#gridSystemModal">
            Filter Permits{" "}
          </h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setManageFilterOffcanvas(false)}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="offcanvas-body">
          <div className="container-fluid">
          <div className="">
                            <form onSubmit={HandleFilterForm}>
                              <div className="row">
                              <div className="col-md-3 mt-3">
                                  <label className="form-label">
                                  DATE:{" "}
                                    <span className="text-danger"></span>
                                  </label>
                                  <input name="date" type="date"className="form-control" value={filterQuery.date} onChange={HandleFilter}/>

                              </div>
                              <div className="col-md-3 mt-3">
                              <label className="form-label">
                                BUILDER NAME:{" "}
                                    <span className="text-danger"></span>
                                  </label>
                                  <Form.Group controlId="tournamentList">
                          <Select
                            options={builderDropDown}
                            onChange={HandleSelectChange}
                            getOptionValue={(option) => option.name}
                            getOptionLabel={(option) => option.name}
                            value={builderDropDown.name}
                            name="builder_name"
                          ></Select>
                        </Form.Group>
                              </div>
                              <div className="col-md-3 mt-3">
                              <label className="form-label">
                                SUBDIVISION NAME:{" "}
                                    <span className="text-danger"></span>
                                  </label>
                                  <Form.Group controlId="tournamentList">
                          <Select
                            options={SubdivisionList}
                            onChange={HandleSubSelectChange}
                            getOptionValue={(option) => option.name}
                            getOptionLabel={(option) => option.name}
                            value={SubdivisionList.name}
                            name="subdivision_name"
                          ></Select>
                        </Form.Group>                              </div>
                              <div className="col-md-3 mt-3">
                                <label className="form-label">
                                ADDRESS NUMBER:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input name="address2" value={filterQuery.address2} className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3">
                                <label className="form-label">
                                ADDRESS NAME:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input name="address1" value={filterQuery.address1} className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3">
                                <label className="form-label">
                                PARCEL NUMBER:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input value={filterQuery.parcel} name="parcel" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3">
                                <label className="form-label">
                                CONTRACTOR:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input value={filterQuery.contractor} name="contractor" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3">
                                <label className="form-label">
                                SQUARE FOOTAGE:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input type="text" value={filterQuery.sqft} name="sqft" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3">
                                <label className="form-label">
                                OWNER:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input type="text" value={filterQuery.owner} name="owner" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3">
                                <label className="form-label">
                                LOT NUMBER:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input  value={filterQuery.lotnumber} name="lotnumber" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3">
                                <label className="form-label">
                                PERMIT NUMBER:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input value={filterQuery.permitnumber} name="permitnumber" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3 ">
                                <label className="form-label">
                                PLAN:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input value={filterQuery.plan} name="plan" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3 mb-3">
                                <label className="form-label">
                                SUB LEGAL NAME:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input value={filterQuery.sublegalname} name="sublegalname" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3 mb-3">
                                <label className="form-label">
                                VALUE:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input value={filterQuery.value} name="value" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3 mb-3">
                                <label className="form-label">
                                PRODUCT TYPE:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input value={filterQuery.product_type} name="product_type" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3 mb-3">
                                <label className="form-label">
                                AREA:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input value={filterQuery.area} name="area" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3 mb-3">
                                <label className="form-label">
                                MASTERPLAN:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input value={filterQuery.masterplan_id} name="masterplan_id" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3 mb-3">
                                <label className="form-label">
                                ZIP CODE:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input value={filterQuery.zipcode} name="zipcode" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3 mb-3">
                                <label className="form-label">
                                LOT WIDTH:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input value={filterQuery.lotwidth} name="lotwidth" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3 mb-3">
                                <label className="form-label">
                                LOT SIZE:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input value={filterQuery.lotsize} name="lotsize" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3 mb-3">
                                <label className="form-label">
                                ZONING:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input value={filterQuery.zoning} name="zoning" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3 mb-3">
                              <label htmlFor="exampleFormControlInput8" className="form-label">AGE RESTRICTED</label>
                              <select className="default-select form-control" name="age" onChange={HandleFilter} >
                                    <option value="">Select age Restricted</option>
                                        <option value="1">Yes</option>
                                        <option value="0">No</option>
                              </select>                               
                              </div>
                              <div className="col-md-3 mt-3 mb-3">
                              <label htmlFor="exampleFormControlInput8" className="form-label">All SINGLE STORY<span className="text-danger">*</span></label>
                                    <select className="default-select form-control" name="single" onChange={HandleFilter} >
                                        <option value="">Select Story</option>
                                        <option value="1">Yes</option>
                                        <option value="0">No</option>
                                    </select>          
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
    </>
  );
};

export default PermitList;
