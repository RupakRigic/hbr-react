import React, { useState, useEffect, useRef } from "react";

import AdminClosingService from "../../../API/Services/AdminService/AdminClosingService";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import ClosingOffcanvas from "./ClosingOffcanvas";
import MainPagetitle from "../../layouts/MainPagetitle";
import Button from "react-bootstrap/Button";
import { Offcanvas, Form, Row } from "react-bootstrap";
import { debounce } from "lodash";
import ClipLoader from "react-spinners/ClipLoader";
import PermitList from "../Permit/PermitList";
import PriceComponent from "../../components/Price/PriceComponent";
import DateComponent from "../../components/date/DateFormat";
import AccessField from "../../components/AccssFieldComponent/AccessFiled";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import { DownloadTableExcel, downloadExcel } from 'react-export-table-to-excel'; 
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import ColumnReOrderPopup from "../../popup/ColumnReOrderPopup";

const ClosingList = () => {


  const [sortConfig, setSortConfig] = useState([]);
  const [showSort, setShowSort] = useState(false);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState(sortConfig.map(col => col.key));
  const [AllClosingListExport, setAllClosingListExport] = useState([]);


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
  

  
      
  const [Error, setError] = useState(""); 
  const [ClosingList, setClosingList] = useState([]);
  const [closingListCount, setClosingListCount] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPage = 100;
  const lastIndex = currentPage * recordsPage;
  const firstIndex = lastIndex - recordsPage;
  const [npage, setNpage] = useState(0);
  const number = [...Array(npage + 1).keys()].slice(1);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [exportmodelshow, setExportModelShow] = useState(false)
  const [selectedFileError, setSelectedFileError] = useState("");
  const [show, setShow] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const [loading, setLoading] = useState(false);
  const handleClose = () => setShow(false);
  const navigate = useNavigate();
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [ClosingDetails, setClosingDetails] = useState({
    subdivision: "",
    sellerleagal: "",
    address: "",
    buyer: "",
    lender: "",
    closingdate: "",
    closingprice: "",
    loanamount: "",
    document: "",
  });

  const [manageAccessOffcanvas, setManageAccessOffcanvas] = useState(false);
  const [accessList, setAccessList] = useState({});
  const [accessRole, setAccessRole] = useState("Admin");
  const [accessForm, setAccessForm] = useState({});
  const [role, setRole] = useState("Admin");
  const [checkedItems, setCheckedItems] = useState({}); // State to manage checked items
  const fieldList = AccessField({ tableName: "closing" });

  const [openDialog, setOpenDialog] = useState(false);
  const [columns, setColumns] = useState([]);
  console.log(columns);
  const [draggedColumns, setDraggedColumns] = useState(columns);

  useEffect(() => {
    console.log('fieldList data : ',fieldList); // You can now use fieldList in this component
  }, [fieldList]);

  const checkFieldExist = (fieldName) => {
    return fieldList.includes(fieldName.trim());
  };

  
  const headers = [
    { label: 'Closing Type', key: 'Closing_Type' },  
    { label: 'Closing Date', key: 'Closing_Date' }, 
    { label: 'Doc', key: 'Doc' }, 
    { label: 'Builder Name', key: 'Builder_Name' }, 
    { label: 'Subdivision Name', key: 'Subdivision_Name' }, 
    { label: 'Closing Price', key: 'Closing+Price' }, 
    { label: 'Address', key: 'Address' }, 
    { label: 'Parcel Number', key: 'Parcel_Number' }, 
    { label: 'Sub Legal Name', key: 'Sub_Legal_Name' }, 
    { label: 'Seller Legal Name', key: 'Seller_Legal Name' }, 
    { label: 'Buyer Name', key: 'Buyer_Name' }, 
    { label: 'Lender', key: 'Lender' }, 
    { label: 'Loan Amount', key: 'Loan_Amount' }, 
    { label: 'Type', key: 'Type' }, 
    { label: 'Product Type', key: 'Product_Type' }, 
    { label: 'Area', key: 'Area' }, 
    { label: 'Master Plan', key: 'Master_Plan' }, 
    { label: 'Zip Code', key: 'Zip_Code' }, 
    { label: 'Lot Width', key: 'Lot_Width' }, 
    { label: 'Lot Size', key: 'Lot_Size' }, 
    { label: 'Zoning', key: 'Zoning' }, 
    { label: 'Age Restricted', key: 'Age_Restricted' }, 
    { label: 'All Single Story', key: 'All_Single_Story' },  
    { label: 'Fk Sub Id', key: 'fkSubID' }, 
     
  ];
  const sortcolumns = [
    { label: 'Closing Type', key: 'Closing_Type' },  
    { label: 'Closing Date', key: 'Closing_Date' }, 
    { label: 'Doc', key: 'Doc' }, 
    { label: 'Builder Name', key: 'Builder_Name' }, 
    { label: 'Subdivision Name', key: 'Subdivision_Name' }, 
    { label: 'Closing Price', key: 'Closing+Price' }, 
    { label: 'Address', key: 'Address' }, 
    { label: 'Parcel Number', key: 'Parcel_Number' }, 
    { label: 'Sub Legal Name', key: 'Sub_Legal_Name' }, 
    { label: 'Seller Legal Name', key: 'Seller_Legal Name' }, 
    { label: 'Buyer Name', key: 'Buyer_Name' }, 
    { label: 'Lender', key: 'Lender' }, 
    { label: 'Loan Amount', key: 'Loan_Amount' }, 
    { label: 'Type', key: 'Type' }, 
    { label: 'Product Type', key: 'Product_Type' }, 
    { label: 'Area', key: 'Area' }, 
    { label: 'Master Plan', key: 'Master_Plan' }, 
    { label: 'Zip Code', key: 'Zip_Code' }, 
    { label: 'Lot Width', key: 'Lot_Width' }, 
    { label: 'Lot Size', key: 'Lot_Size' }, 
    { label: 'Zoning', key: 'Zoning' }, 
    { label: 'Age Restricted', key: 'Age_Restricted' }, 
    { label: 'All Single Story', key: 'All_Single_Story' },  
    { label: 'Fk Sub Id', key: 'fkSubID' }, 
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
  
    const tableData = AllClosingListExport.map((row) => {
      return tableHeaders.map((header) => {
        switch (header) {
          case "Closing Type":
            return row.closing_type || '';
          case "Closing Date":
            return row.closingdate || '';
          case "Doc":
            return row.document || '';
          case "Builder Name":
            return row.subdivision?.builder?.name || '';
          case "Subdivision Name":
            return row.subdivision?.name || '';
          case "Closing Price":
            return row.closingprice || '';
          case "Address":
            return row.address || '';
          case "Parcel Number":
            return row.parcel || '';
          case "Sub Legal Name":
            return row.sublegal_name || '';
          case "Seller Legal Name":
            return row.sellerleagal || '';
          case "Buyer Name":
            return row.buyer || '';
          case "Lender":
            return row.lender || '';
          case "Loan Amount":
            return row.loanamount || '';
          case "Type":
            return row.type || '';
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
            return row.subdivision?.age === 1 ? "Yes" : row.subdivision?.age === 0 ? "No" : '';
          case "All Single Story":
            return row.subdivision?.single === 1 ? "Yes" : row.subdivision?.single === 0 ? "No" : '';
          case "Fk Sub Id":
            return row.subdivision?.subdivision_code || '';
          default:
            return '';
        }
      });
    });
  
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([tableHeaders, ...tableData]);
  
    const headerRange = XLSX.utils.decode_range(worksheet['!ref']);
    for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
      const cell = worksheet[XLSX.utils.encode_cell({ r: 0, c: C })];
      if (!cell.s) cell.s = {};
      cell.s.font = { name: 'Calibri', sz: 11, bold: false };
    }
  
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Closing');
  
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'Closing.xlsx');
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
      table: "closing",
    };
    try {
      const data = await AdminClosingService.manageAccessFields(
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
      const response = await AdminClosingService.accessField();
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

  const [isLoading, setIsLoading] = useState(true);

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

  const closingsale = useRef();
  const stringifySortConfig = (sortConfig) => {
    return sortConfig.map((sort) => `${sort.key}:${sort.direction}`).join(",");
  };

  const getClosingList = async (currentPage) => {
    try {
      let sortConfigString = "";
      if (sortConfig !== null) {
        sortConfigString = "&sortConfig=" + stringifySortConfig(sortConfig);
      }
      const response = await AdminClosingService.index(currentPage,sortConfigString,searchQuery);
      const responseData = await response.json();
      console.log(responseData.data);
      setClosingList(responseData.data);
      setNpage(Math.ceil(responseData.total / recordsPage));
      setClosingListCount(responseData.total);
      setIsLoading(false)
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(errorJson.message);
      }
    }
  };

  useEffect(() => {
    if (localStorage.getItem("usertoken")) {
      getClosingList(currentPage);
      fetchAllPages(searchQuery, sortConfig)
    } else {
      navigate("/");
    }
  }, [currentPage]);

  async function fetchAllPages(searchQuery, sortConfig) {
    const response = await AdminClosingService.index(1, searchQuery, sortConfig ? `&sortConfig=${stringifySortConfig(sortConfig)}` : "");
    const responseData = await response.json();
    const totalPages = Math.ceil(responseData.total / recordsPage);
    let allData = responseData.data;
    for (let page = 2; page <= totalPages; page++) {
      const pageResponse = await AdminClosingService.index(page, searchQuery, sortConfig ? `&sortConfig=${stringifySortConfig(sortConfig)}` : "");
      const pageData = await pageResponse.json();
      allData = allData.concat(pageData.data);
    }
    setAllClosingListExport(allData);
  }

  const handleDelete = async (e) => {
    try {
      let responseData = await AdminClosingService.destroy(e).json();
      if (responseData.status === true) {
        getClosingList();
      }
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(errorJson.message);
      }
    }
  };

  const handleFileChange = async (e) => {
    setSelectedFile(e.target.files[0]);
  };
  const handleUploadClick = async () => {
    const file = selectedFile;
    console.log(file);
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
          let responseData = await AdminClosingService.import(inputData).json();
          setSelectedFile("");
          document.getElementById("fileInput").value = null;
          setLoading(false);
          swal("Imported Sucessfully").then((willDelete) => {
            if (willDelete) {
              navigate("/subdivisionlist");
              setShow(false);
            }
          });
          getClosingList();
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

  const handleCallback = () => {
    // Update the name in the component's state
    getClosingList();
  };


  const handleRowClick = async (id) => {
    try {
      let responseData = await AdminClosingService.show(id).json();
      setClosingDetails(responseData);
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
    getClosingList();
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
    getClosingList(currentPage, sortConfig);
  };



  const exportToExcelData = async () => {
    try {
        const bearerToken = JSON.parse(localStorage.getItem('usertoken'));
        const response = await axios.get(
          `${process.env.REACT_APP_IMAGE_URL}api/admin/closing/export`
          // 'https://hbrapi.rigicgspl.com/api/admin/closing/export'

          ,
           {
            responseType: 'blob',
            headers: {
                'Authorization': `Bearer ${bearerToken}`
            }
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'closings.xlsx');
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
      <MainPagetitle
        mainTitle="Closings"
        pageTitle="Closings"
        parentTitle="Home"
      />
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-12">
            <div className="card" style={{ overflow: "auto" }}>
              <div className="card-body p-0">
                <div className="table-responsive active-projects style-1 ItemsCheckboxSec shorting">
                  <div className="tbl-caption d-flex justify-content-between text-wrap align-items-center pb-0">
                    <div className="d-flex text-nowrap justify-content-between align-items-center">
                      <h4 className="heading mb-0">Closing List</h4>
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
                    {/* <button onClick={exportToExcelData} className="btn btn-primary btn-sm me-1"> <i class="fas fa-file-excel"></i></button> */}
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
                        onClick={() => closingsale.current.showEmployeModal()}
                      >
                        + Add Closing
                      </Link>
                    </div>
                  </div>
                  <div className="d-sm-flex text-center justify-content-between align-items-center dataTables_wrapper no-footer">
                      <div className="dataTables_info">
                        Showing {lastIndex - recordsPage + 1} to {lastIndex} of{" "}
                        {closingListCount} entries
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
                            <th>No.</th>
                            {columns.map((column) => (
                              <th style={{ textAlign: "center", cursor: "pointer" }} key={column.id} onClick={() => column.id != ("action") ? requestSort(
                                column.id == "closing Type" ? "closing_type" : 
                                (column.id == "closing Price" ? "closingprice" : 
                                (column.id == "Parcel Number" ? "parcel" : 
                                (column.id == "sub Legal Name" ? "subdivisionName" : 
                                (column.id == "seller Legal Name" ? "sellerleagal" : 
                                (column.id == "buyer Name" ? "buyer" : 
                                (column.id == "loan Amount" ? "loanamount" : toCamelCase(column.id)))))))) : ""}>
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
                            {/* {checkFieldExist("Closing Type") && (
                              <th onClick={() => requestSort("closing_type")}>
                                Closing Type
                             {sortConfig.key !== "closing_type" ? "↑↓" : ""}
                                {sortConfig.key === "closing_type" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("Closing Date") && (
                              <th onClick={() => requestSort("closingdate")}>
                                Closing Date
                                {sortConfig.key !== "closingdate" ? "↑↓" : ""}
                                {sortConfig.key === "closingdate" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("Doc") && (
                            )}{" "}
                            {checkFieldExist("Closing Date Actual") && (
                              <th onClick={() => requestSort("closingdate")}>
                                Closing Date
                                {sortConfig.key !== "closingdate" ? "↑↓" : ""}
                                {sortConfig.key === "closingdate" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "}
                            {checkFieldExist("Doc") && (
                              <th onClick={() => requestSort("document")}>
                                Doc
                                {sortConfig.key !== "document" ? "↑↓" : ""}
                                {sortConfig.key === "document" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("Builder Name") && (
                              <th onClick={() => requestSort("builderName")}>
                                Builder Name
                                {sortConfig.key !== "builderName" ? "↑↓" : ""}
                                {sortConfig.key === "builderName" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("Subdivision Name") && (
                              <th
                                onClick={() => requestSort("subdivisionName")}
                              >
                                Subdivision Name
                                {sortConfig.key !== "subdivisionName"
                                  ? "↑↓"
                                  : ""}
                                {sortConfig.key === "subdivisionName" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("Closing Price") && (
                              <th onClick={() => requestSort("closingprice")}>
                                Closing Price
                                {sortConfig.key !== "closingprice" ? "↑↓" : ""}
                                {sortConfig.key === "closingprice" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("Address") && (
                              <th onClick={() => requestSort("address")}>
                                Address
                                {sortConfig.key !== "address" ? "↑↓" : ""}
                                {sortConfig.key === "address" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("Parcel Number") && 
                            <th onClick={() => requestSort("parcel")}>
                              Parcel Number                              
                              {sortConfig.key !== "parcel" ? "↑↓" : ""}
                                {sortConfig.key === "parcel" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                            </th>
                            } */}

                            {/* {checkFieldExist("Sub Legal Name") && (
                              <th
                                onClick={() => requestSort("subdivisionName")}
                              >
                                Sub Legal Name
                                {sortConfig.key !== "subdivisionName"
                                  ? "↑↓"
                                  : ""}
                                {sortConfig.key === "subdivisionName" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("Seller Legal Name") && (
                              <th onClick={() => requestSort("sellerleagal")}>
                                Seller Legal Name
                                {sortConfig.key !== "sellerleagal" ? "↑↓" : ""}
                                {sortConfig.key === "sellerleagal" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("Buyer Name") && (
                              <th onClick={() => requestSort("buyer")}>
                                Buyer Name
                                {sortConfig.key !== "buyer" ? "↑↓" : ""}
                                {sortConfig.key === "buyer" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("Lender") && (
                              <th>
                                Lender
                                {sortConfig.key !== "subdivisionName"
                                  ? "↑↓"
                                  : ""}
                                {sortConfig.key === "subdivisionName" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("Loan Amount") && (
                              <th onClick={() => requestSort("loanamount")}>
                                Loan Amount
                                {sortConfig.key !== "loanamount" ? "↑↓" : ""}
                                {sortConfig.key === "loanamount" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("Type") && (
                              <th>
                                Type
                                {sortConfig.key !== "subdivisionName"
                                  ? "↑↓"
                                  : ""}
                                {sortConfig.key === "subdivisionName" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("Product Type") && (
                              <th>
                                Product Type{" "}
                                {sortConfig.key !== "subdivisionName"
                                  ? "↑↓"
                                  : ""}
                                {sortConfig.key === "subdivisionName" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("Area") && (
                              <th>
                                Area
                                {sortConfig.key !== "subdivisionName"
                                  ? "↑↓"
                                  : ""}
                                {sortConfig.key === "subdivisionName" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("Master Plan") && (
                              <th>
                                Master Plan
                                {sortConfig.key !== "subdivisionName"
                                  ? "↑↓"
                                  : ""}
                                {sortConfig.key === "subdivisionName" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("Zip Code") && (
                              <th>
                                Zip Code{" "}
                                {sortConfig.key !== "subdivisionName"
                                  ? "↑↓"
                                  : ""}
                                {sortConfig.key === "subdivisionName" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}{" "}
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("Lot Width") && (
                              <th>
                                Lot Width{" "}
                                {sortConfig.key !== "subdivisionName"
                                  ? "↑↓"
                                  : ""}
                                {sortConfig.key === "subdivisionName" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}{" "}
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("Lot Size") && (
                              <th>
                                Lot Size{" "}
                                {sortConfig.key !== "subdivisionName"
                                  ? "↑↓"
                                  : ""}
                                {sortConfig.key === "subdivisionName" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("Zoning") && (
                              <th>
                                Zoning{" "}
                                {sortConfig.key !== "subdivisionName"
                                  ? "↑↓"
                                  : ""}
                                {sortConfig.key === "subdivisionName" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}{" "}
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("Age Restricted") && (
                              <th>
                                Age Restricted{" "}
                                {sortConfig.key !== "subdivisionName"
                                  ? "↑↓"
                                  : ""}
                                {sortConfig.key === "subdivisionName" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("All Single Story") && (
                              <th>
                                All Single Story{" "}
                                {sortConfig.key !== "subdivisionName"
                                  ? "↑↓"
                                  : ""}
                                {sortConfig.key === "subdivisionName" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("Date Added") && (
                              <th>
                                Date Added{" "}
                                {sortConfig.key !== "subdivisionName"
                                  ? "↑↓"
                                  : ""}
                                {sortConfig.key === "subdivisionName" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("__pkRecordID") && (
                              <th>
                                __pkRecordID
                                {sortConfig.key !== "subdivisionName"
                                  ? "↑↓"
                                  : ""}
                                {sortConfig.key === "subdivisionName" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("_fkSubID") && (
                              <th>
                                _fkSubID
                                {sortConfig.key !== "subdivisionName"
                                  ? "↑↓"
                                  : ""}
                                {sortConfig.key === "subdivisionName" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("Action") && <th>Action</th>} */}
                            
                          </tr>
                        </thead>
                        <tbody style={{ textAlign: "center" }}>
                          {ClosingList !== null && ClosingList.length > 0 ? (
                            ClosingList.map((element, index) => (
                              <tr
                                onClick={() => handleRowClick(element.id)}
                                style={{
                                  textAlign: "center",
                                  cursor: "pointer",
                                }}
                              >
                                <td>{index + 1}</td>
                                {columns.map((column) => (
                                  <>
                                  {column.id == "closing Type" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.closing_type}</td>
                                  }
                                  {column.id == "closing Date" &&
                                    <td key={column.id} style={{ textAlign: "center" }}><DateComponent date={element.closingdate} /></td>
                                  }
                                  {column.id == "doc" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.document}</td>
                                  }
                                  {column.id == "builder Name" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.subdivision &&
                                      element.subdivision.builder?.name}</td>
                                  }
                                  {column.id == "subdivision Name" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.subdivision &&
                                      element.subdivision?.name}</td>
                                  }
                                  {column.id == "closing Price" &&
                                    <td key={column.id} style={{ textAlign: "center" }}><PriceComponent price={element.closingprice} /></td>
                                  }
                                  {column.id == "address" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.address}</td>
                                  }
                                  {column.id == "parcel Number" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.parcel}</td>
                                  }
                                  {column.id == "sub Legal Name" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.sublegal_name}</td>
                                  }
                                  {column.id == "seller Legal Name" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.sellerleagal}</td>
                                  }
                                  {column.id == "buyer Name" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.buyer}</td>
                                  }
                                  {column.id == "lender" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.lender}</td>
                                  }
                                  {column.id == "loan Amount" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.loanamount}</td>
                                  }
                                  {column.id == "type" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>NA</td>
                                  }
                                  {column.id == "product Type" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.subdivision.product_type}</td>
                                  }
                                  {column.id == "area" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.subdivision.area}</td>
                                  }
                                  {column.id == "master Plan" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.subdivision.masterplan_id}</td>
                                  }
                                  {column.id == "zip Code" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.subdivision.zipcode}</td>
                                  }
                                  {column.id == "lot Width" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.subdivision.lotwidth}</td>
                                  }
                                  {column.id == "lot Size" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.subdivision.lotsize}</td>
                                  }
                                  {column.id == "zoning" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.subdivision.zoning}</td>
                                  }
                                  {column.id == "age Restricted" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.subdivision.age == "1" ? "Yes" : "No"}</td>
                                  }
                                  {column.id == "all Single Story" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.subdivision.single == "1" ? "Yes" : "No"}</td>
                                  }
                                  {column.id == "date Added" &&
                                    <td key={column.id} style={{ textAlign: "center" }}><DateComponent date={element.created_at} /></td>
                                  }
                                  {column.id == "__pkRecordID" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.id}</td>
                                  }
                                  {column.id == "_fkSubID" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.subdivision.subdivision_code}</td>
                                  }
                                  {column.id == "action" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>
                                      <div className="d-flex justify-content-center">
                                        <Link
                                          to={`/closingsaleupdate/${element.id}`}
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
      <ClosingOffcanvas
        ref={closingsale}
        Title="Add Closing"
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
            Closing Details{" "}
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
                <label className="">Subdivision :</label>
                <div className="fw-bolder">
                  {ClosingDetails.subdivision !== null &&
                  ClosingDetails.subdivision.name !== undefined
                    ? ClosingDetails.subdivision.name
                    : "NA"}
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Seller Leagal :</label>
                <div>
                  <span className="fw-bold">
                    {ClosingDetails.sellerleagal || "NA"}
                  </span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Address :</label>
                <div>
                  <span className="fw-bold">
                    {ClosingDetails.address || "NA"}
                  </span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Buyer :</label>
                <div>
                  <span className="fw-bold">
                    {ClosingDetails.buyer || "NA"}
                  </span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Lender :</label>
                <div>
                  <span className="fw-bold">
                    {ClosingDetails.lender || "NA"}
                  </span>
                </div>
              </div>
              <div className="col-xl-4 mt-4">
                <label className="">Closing Date :</label>
                <div>
                  <span className="fw-bold">
                    {<DateComponent date={ClosingDetails.closingdate} /> ||
                      "NA"}
                  </span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Closing Price :</label>
                <div>
                  <span className="fw-bold">
                    {<PriceComponent price={ClosingDetails.closingprice} /> ||
                      "NA"}
                  </span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Loan Amount :</label>
                <div>
                  <span className="fw-bold">
                    {ClosingDetails.loanamount || "NA"}
                  </span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Document :</label>
                <div>
                  <span className="fw-bold">
                    {ClosingDetails.document || "NA"}
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
            Manage Closings Fields Access{" "}
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
            {sortcolumns.map((col) => (
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

export default ClosingList;
