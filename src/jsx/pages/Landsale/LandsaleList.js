import React, { useState, useEffect, useRef } from "react";

import AdminLandsaleService from "../../../API/Services/AdminService/AdminLandsaleService";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import LandsaleOffcanvas from "./LandsaleOffcanvas";
import MainPagetitle from "../../layouts/MainPagetitle";
import Button from "react-bootstrap/Button";
import AdminBuilderService from "../../../API/Services/AdminService/AdminBuilderService";
import Modal from "react-bootstrap/Modal";
import { Offcanvas, Form, Row } from "react-bootstrap";
import AdminSubdevisionService from "../../../API/Services/AdminService/AdminSubdevisionService";
import { debounce } from "lodash";
import ClipLoader from "react-spinners/ClipLoader";
import PriceComponent from "../../components/Price/PriceComponent";
import DateComponent from "../../components/date/DateFormat";
import AccessField from "../../components/AccssFieldComponent/AccessFiled";
import axios from "axios";
import { DownloadTableExcel, downloadExcel } from "react-export-table-to-excel";
import TrafficsaleList from "../Trafficsale/TrafficsaleList";
import ColumnReOrderPopup from "../../popup/ColumnReOrderPopup";
import BulkLandsaleUpdate from "./BulkLandsaleUpdate";

const LandsaleList = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [Error, setError] = useState("");
  const navigate = useNavigate();
  const [LandsaleList, setLandsaleList] = useState([]);
  const [landSaleListCount, setlandSaleListCount] = useState("");
  const [TotalLandsaleListCount, setTotallandSaleListCount] = useState("");

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
  const [BuilderList, setBuilderList] = useState([]);
  const [BuilderCode, setBuilderCode] = useState("");
  const [SubdivisionList, setSubdivisionList] = useState([]);
  const [SubdivisionCode, setSubdivisionCode] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  // const number = [...Array(npage + 1).keys()].slice(1);
  const [sortConfig, setSortConfig] = useState([]);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [landSaleDetails, setLandSaleDetails] = useState({
    seller: "",
    buyer: "",
    location: "",
    date: "",
    parcel: "",
    price: "",
    typeofunit: "",
    priceperunit: "",
    noofunit: "",
    notes: "",
    doc: "",
    zoning: "",
    lat: "",
    lng: "",
    area: "",
    zip: "",
    subdivision: "",
  });

  const [manageAccessOffcanvas, setManageAccessOffcanvas] = useState(false);
  const [accessList, setAccessList] = useState({});
  const [accessRole, setAccessRole] = useState("Admin");
  const [accessForm, setAccessForm] = useState({});
  const [role, setRole] = useState("Admin");
  const [checkedItems, setCheckedItems] = useState({}); // State to manage checked items
  const fieldList = AccessField({ tableName: "landsale" });

  const [openDialog, setOpenDialog] = useState(false);
  const [columns, setColumns] = useState([]);
  console.log("columns",columns);
  const [draggedColumns, setDraggedColumns] = useState(columns);
  const [selectedLandSales, setSelectedLandSales] = useState([]);
  console.log("selectedLandSales",selectedLandSales);

  useEffect(() => {
    console.log(fieldList); // You can now use fieldList in this component
  }, [fieldList]);

  const checkFieldExist = (fieldName) => {
    return fieldList.includes(fieldName.trim());
  };

  const headers = [
    { label: "Builder Name", key: "Builder_Name" },
    { label: "Subdivision Name", key: "Subdivision_Name" },
    { label: "Seller", key: "Seller" },
    { label: "Buyer", key: "Buyer" },
    { label: "Location", key: "Location" },
    { label: "Notes", key: "Notes" },
    { label: "Price", key: "Price" },
  ];
  const sortColumns = [
    { label: "Builder Name", key: "Builder_Name" },
    { label: "Subdivision Name", key: "Subdivision_Name" },
    { label: "Seller", key: "Seller" },
    { label: "Buyer", key: "Buyer" },
    { label: "Location", key: "Location" },
    { label: "Notes", key: "Notes" },
    { label: "Price", key: "Price" },
  ];
  const handleColumnToggle = (column) => {
    const updatedColumns = selectedColumns.includes(column)
      ? selectedColumns.filter((col) => col !== column)
      : [...selectedColumns, column];
    console.log("load upadate:  ", updatedColumns);
    setSelectedColumns(updatedColumns);
  };

  const handleDownloadExcel = () => {
    setExportModelShow(false);
    setSelectedColumns("");
    console.log("click dataa D : ", selectedColumns);
    var tableHeaders;
    if (selectedColumns.length > 0) {
      tableHeaders = selectedColumns;
    } else {
      tableHeaders = headers.map((c) => c.label);
    }
    var newdata = tableHeaders.map((element) => {
      return element;
    });

    const tableData = LandsaleList.map((row) =>
      newdata.map((nw, i) => [
        nw === "Builder Name" ? row.subdivision?.builder?.name : "",
        nw === "Subdivision Name" ? row.subdivision?.name : "",
        nw === "Seller" ? row.seller : "",
        nw === "Buyer" ? row.buyer : "",
        nw === "Location" ? row.location : "",
        nw === "Notes" ? row.notes : "",
        nw === "Price" ? row.price + "/" + row.typeofunit : "",
      ])
    );

    downloadExcel({
      fileName: "Land sales",
      sheet: "Land sales",
      tablePayload: {
        header: tableHeaders,
        body: tableData,
      },
    });
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
      table: "landsale",
    };
    try {
      const data = await AdminLandsaleService.manageAccessFields(
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
      const response = await AdminLandsaleService.accessField();
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

  const landsale = useRef();
  const bulklandsale = useRef();
  const stringifySortConfig = (sortConfig) => {
    return sortConfig.map((sort) => `${sort.key}:${sort.direction}`).join(",");
  };
  const getLandsaleList = async (currentPage) => {
    try {
      let sortConfigString = "";
      if (sortConfig !== null) {
        sortConfigString = "&sortConfig=" + stringifySortConfig(sortConfig);
      }
      const response = await AdminLandsaleService.index(
        currentPage,
        sortConfigString,
        searchQuery
      );
      const responseData = await response.json();
      setLandsaleList(responseData.data);
      setNpage(Math.ceil(responseData.total / recordsPage));
      setlandSaleListCount(responseData.total);
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
      getLandsaleList(currentPage);
    } else {
      navigate("/");
    }
  }, [currentPage]);

  const handleDelete = async (e) => {
    try {
      let responseData = await AdminLandsaleService.destroy(e).json();
      if (responseData.status === true) {
        getLandsaleList();
      }
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(errorJson.message);
      }
    }
  };
  const handleCallback = () => {
    getLandsaleList();
  };

  const getbuilderlist = async () => {
    try {
      let response = await AdminBuilderService.index();
      let responseData = await response.json();
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

  const getsubdivisionlist = async () => {
    debugger
    try {
      let response = await AdminSubdevisionService.index();
      let responseData = await response.json();

      setSubdivisionList(responseData.data);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(errorJson.message);
      }
    }
  };
  useEffect(() => {
    getsubdivisionlist();
  }, []);

  const handleModalClick = () => {
    navigate("/report-list");
  };
  const handleBuilderCode = (code) => {
    setBuilderCode(code.target.value);
  };
  const handleSubdivisionCode = (code) => {
    setSubdivisionCode(code.target.value);
  };
  const handleRowClick = async (id) => {
    try {
      let responseData = await AdminLandsaleService.show(id).json();
      setLandSaleDetails(responseData);
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
    }, 300)
  ).current;

  useEffect(() => {
    getLandsaleList();
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
    getLandsaleList(currentPage, sortConfig);
  };

  const exportToExcelData = async () => {
    try {
      const bearerToken = JSON.parse(localStorage.getItem("usertoken"));
      const response = await axios.get(
        `${process.env.REACT_APP_IMAGE_URL}api/admin/builder/export`,
        // 'https://hbrapi.rigicgspl.com/api/admin/builder/export'
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
      link.setAttribute("download", "landsales.xlsx");
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
          let responseData = await AdminLandsaleService.import(
            inputData
          ).json();
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
  console.log(sortConfig);

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
      setSelectedLandSales((prevSelectedUsers) => [...prevSelectedUsers, userId]);
    } else {
      setSelectedLandSales((prevSelectedUsers) => prevSelectedUsers.filter((id) => id !== userId));
    }
  };

  useEffect(() => {
    const mappedColumns = fieldList.map((data) => ({
      id: data.charAt(0).toLowerCase() + data.slice(1),
      label: data
    }));
    setColumns(mappedColumns);
  }, [fieldList]);

  return (
    <>
      <MainPagetitle
        mainTitle="Land sales"
        pageTitle="Land Sales"
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
                      <h4 className="heading mb-0">Land Sale List</h4>
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
                      <Link
                        to={"#"}
                        className="btn btn-primary btn-sm ms-1"
                        data-bs-toggle="offcanvas"
                        onClick={() => landsale.current.showEmployeModal()}
                      >
                        + Add Land Sale
                      </Link>
                      <Link
                        to={"#"}
                        className="btn btn-primary btn-sm ms-1"
                        data-bs-toggle="offcanvas"
                        onClick={() => bulklandsale.current.showEmployeModal()}
                      >
                        Bulk Edit
                      </Link>
                    </div>
                  </div>
                  <div className="d-sm-flex text-center justify-content-between align-items-center dataTables_wrapper no-footer">
                      <div className="dataTables_info">
                        Showing {lastIndex - recordsPage + 1} to {lastIndex} of{" "}
                        {TrafficsaleList} entries
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
                                checked={selectedLandSales.length === LandsaleList.length}
                                onChange={(e) =>
                                  e.target.checked
                                    ? setSelectedLandSales(LandsaleList.map((user) => user.id))
                                    : setSelectedLandSales([])
                                }
                              />
                            </th>
                            <th>
                              <strong> No. </strong>
                            </th>

                            {columns.map((column) => (
                              <th style={{ textAlign: "center", cursor: "pointer" }} key={column.id}>
                                <strong>
                                  {column.label}
                                </strong>
                              </th>
                            ))}

                            {/* {checkFieldExist("Builder Name") && (
                              <th onClick={() => requestSort("builderName")}>
                                Builder Name
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
                            )}{" "} */}

                            {/* {checkFieldExist("Subdivision Name") && (
                              <th
                                onClick={() => requestSort("subdivisionName")}
                              >
                                Subdivision Name
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
                            )}{" "} */}

                            {/* {checkFieldExist("Seller") && (
                              <th onClick={() => requestSort("seller")}>
                                <strong>
                                  Seller
                                  {sortConfig.some(
                                    (item) => item.key === "seller"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "seller"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                                </strong>
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("Buyer") && (
                              <th onClick={() => requestSort("buyer")}>
                                <strong>
                                  {" "}
                                  Buyer
                                  {sortConfig.some(
                                    (item) => item.key === "buyer"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "buyer"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                                </strong>
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("Location") && (
                              <th onClick={() => requestSort("location")}>
                                <strong>
                                  {" "}
                                  Location
                                  {sortConfig.some(
                                  (item) => item.key === "location"
                                ) ? (
                                  <span>
                                    {sortConfig.find(
                                      (item) => item.key === "location"
                                    ).direction === "asc"
                                      ? "↑"
                                      : "↓"}
                                  </span>
                                ) : (
                                  <span>↑↓</span>
                                )}
                                </strong>
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("Notes") && (
                              <th onClick={() => requestSort("notes")}>
                                <strong>
                                  Notes
                                  {sortConfig.key !== "notes" ? "↑↓" : ""}
                                  {sortConfig.key === "notes" && (
                                    <span>
                                      {sortConfig.direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  )}
                                </strong>
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("Price") && (
                              <th onClick={() => requestSort("price")}>
                                <strong>
                                  {" "}
                                  Price
                                  {sortConfig.some(
                                  (item) => item.key === "price"
                                ) ? (
                                  <span>
                                    {sortConfig.find(
                                      (item) => item.key === "price"
                                    ).direction === "asc"
                                      ? "↑"
                                      : "↓"}
                                  </span>
                                ) : (
                                  <span>↑↓</span>
                                )}
                                </strong>
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("Date") && (
                              <th onClick={() => requestSort("date")}>
                                <strong>
                                  {" "}
                                  Date
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
                                </strong>
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("Action") && (
                              <th>
                                {" "}
                                <strong>Action</strong>
                              </th>
                            )} */}

                          </tr>
                        </thead>
                        <tbody style={{ textAlign: "center" }}>
                          {LandsaleList !== null && LandsaleList.length > 0 ? (
                            LandsaleList.map((element, index) => (
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
                                    {column.id == "builder Name" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.subdivision && element.subdivision.builder?.name}</td>
                                    }
                                    {column.id == "subdivision Name" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.subdivision && element.subdivision?.name}</td>
                                    }
                                    {column.id == "seller" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.seller}</td>
                                    }
                                    {column.id == "buyer" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.buyer}</td>
                                    }
                                    {column.id == "location" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.location}</td>
                                    }
                                    {column.id == "notes" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.notes}</td>
                                    }
                                    {column.id == "price" &&
                                      <td key={column.id} style={{ textAlign: "center" }}><PriceComponent price={element.price} />/{" "}
                                      {element.typeofunit}</td>
                                    }
                                    {column.id == "date" &&
                                      <td key={column.id} style={{ textAlign: "center" }}><DateComponent date={element.date} /></td>
                                    }
                                    {column.id == "action" && 
                                      <td key={column.id} style={{ textAlign: "center" }}>
                                        <div className="d-flex justify-content-center">
                                          <Link
                                            to={`/landsaleupdate/${element.id}`}
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

                                {/* {checkFieldExist("Builder Name") && (
                                  <td>
                                    {element.subdivision &&
                                      element.subdivision.builder?.name}
                                  </td>
                                )}{" "} */}

                                {/* {checkFieldExist("Subdivision Name") && (
                                  <td>
                                    {element.subdivision &&
                                      element.subdivision?.name}
                                  </td>
                                )}{" "} */}

                                {/* {checkFieldExist("Seller") && (
                                  <td>{element.seller}</td>
                                )}{" "} */}

                                {/* {checkFieldExist("Buyer") && (
                                  <td>{element.buyer}</td>
                                )}{" "} */}

                                {/* {checkFieldExist("Location") && (
                                  <td>{element.location}</td>
                                )}{" "} */}

                                {/* {checkFieldExist("Notes") && (
                                  <td>{element.notes}</td>
                                )}{" "} */}

                                {/* {checkFieldExist("Price") && (
                                  <td>
                                    <PriceComponent price={element.price} />/{" "}
                                    {element.typeofunit}
                                  </td>
                                )}{" "} */}

                                {/* {checkFieldExist("Date") && (
                                  <td>
                                    <DateComponent date={element.date} />
                                  </td>
                                )}{" "} */}

                                {/* {checkFieldExist("Action") && (
                                  <td>
                                    <div className="d-flex justify-content-center">
                                      <Link
                                        to={`/landsaleupdate/${element.id}`}
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
                                )} */}

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
      <LandsaleOffcanvas
        ref={landsale}
        Title="Add Landsale"
        parentCallback={handleCallback}
      />
      <BulkLandsaleUpdate
        ref={bulklandsale}
        Title="Bulk Edit Land Sales"
        parentCallback={handleCallback}
        selectedLandSales={selectedLandSales}
      />

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Import Land Sale CSV Data</Modal.Title>
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
            Land Sale Details{" "}
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
                  {landSaleDetails.subdivision !== null &&
                  landSaleDetails.subdivision.name !== undefined
                    ? landSaleDetails.subdivision.name
                    : "NA"}
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Seller :</label>
                <div>
                  <span className="fw-bold">
                    {landSaleDetails.seller || "NA"}
                  </span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Buyer :</label>
                <div>
                  <span className="fw-bold">
                    {landSaleDetails.buyer || "NA"}
                  </span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Location :</label>
                <div>
                  <span className="fw-bold">
                    {landSaleDetails.location || "NA"}
                  </span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Date :</label>
                <div>
                  <span className="fw-bold">
                    {<DateComponent date={landSaleDetails.date} /> || "NA"}
                  </span>
                </div>
              </div>
              <div className="col-xl-4 mt-4">
                <label className="">Parcel :</label>
                <div>
                  <span className="fw-bold">
                    {landSaleDetails.parcel || "NA"}
                  </span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Price :</label>
                <div>
                  <span className="fw-bold">
                    {<PriceComponent price={landSaleDetails.price} /> || "NA"}
                  </span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Type of Unit :</label>
                <div>
                  <span className="fw-bold">
                    {landSaleDetails.typeofunit || "NA"}
                  </span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Price Per Unit :</label>
                <div>
                  <span className="fw-bold">
                    {landSaleDetails.priceperunit || "NA"}
                  </span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">No. Of Unit :</label>
                <div>
                  <span className="fw-bold">
                    {landSaleDetails.noofunit || "NA"}
                  </span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Notes :</label>
                <div>
                  <span className="fw-bold">
                    {landSaleDetails.notes || "NA"}
                  </span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Doc :</label>
                <div>
                  <span className="fw-bold">{landSaleDetails.doc || "NA"}</span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Zoning :</label>
                <div>
                  <span className="fw-bold">
                    {landSaleDetails.zoning || "NA"}
                  </span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Latitude :</label>
                <div>
                  <span className="fw-bold">{landSaleDetails.lat || "NA"}</span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Longitude :</label>
                <div>
                  <span className="fw-bold">{landSaleDetails.lng || "NA"}</span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Area :</label>
                <div>
                  <span className="fw-bold">
                    {landSaleDetails.area || "NA"}
                  </span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Zipcode :</label>
                <div>
                  <span className="fw-bold">{landSaleDetails.zip || "NA"}</span>
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
            Manage Weekly Traffic & Sales List Fields Access{" "}
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
              <ul className="list-unstyled">
                {sortColumns.map((col) => (
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

export default LandsaleList;
