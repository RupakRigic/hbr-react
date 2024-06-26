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
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Select from "react-select";
import { MultiSelect } from "react-multi-select-component";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const LandsaleList = () => {
  const [excelLoading, setExcelLoading] = useState(true);
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

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [Error, setError] = useState("");
  const navigate = useNavigate();
  const [LandsaleList, setLandsaleList] = useState([]);
  console.log("LandsaleList", LandsaleList);
  const [landSaleListCount, setlandSaleListCount] = useState("");
  const [TotalLandsaleListCount, setTotallandSaleListCount] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const resetSelection = () => {
    setSelectAll(false);
    setSelectedColumns([]);
  };
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
  const [manageFilterOffcanvas, setManageFilterOffcanvas] = useState(false);
  const [filterQuery, setFilterQuery] = useState({
    builder_name:"",
    subdivision_name:"",
    seller:"",
    buyer:"",
    location:"",
    notes:"",
    from:"",
    to:"",
    parcel:"",
    price:"",
    typeofunit:"",
    priceperunit:"",
    noofunit:"",
    doc:"",
  });
  const [builderDropDown, setBuilderDropDown] = useState([]);
  const [selectedBuilderName, setSelectedBuilderName] = useState([]);
  const [selectedSubdivisionName, setSelectedSubdivisionName] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);

  useEffect(() => {
    const fetchBuilderList = async () => {
      try {
        const response = await AdminBuilderService.builderDropDown();
        const data = await response.json();
        const formattedData = data.map((builder) => ({
          label: builder.name,
          value: builder.id,
        }));
        setBuilderDropDown(formattedData);
      } catch (error) {
        console.log("Error fetching builder list:", error);
      }
    };

    fetchBuilderList();
  }, []);

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

  const HandleFilterForm = (e) =>{
    e.preventDefault();
    console.log(555);
    getLandsaleList(currentPage, searchQuery);
    setManageFilterOffcanvas(false)
  };
  const handleFilterDateFrom = (date) => {
    if (date) {
      const formattedDate = date.toLocaleDateString('en-US'); // Formats date to "MM/DD/YYYY"
      console.log(formattedDate)

      setFilterQuery((prevFilterQuery) => ({
        ...prevFilterQuery,
        from: formattedDate,
      }));
    } else {
      setFilterQuery((prevFilterQuery) => ({
        ...prevFilterQuery,
        from: '',
      }));
    }
  };

  const handleFilterDateTo = (date) => {
    if (date) {
      const formattedDate = date.toLocaleDateString('en-US'); // Formats date to "MM/DD/YYYY"
      console.log(formattedDate)

      setFilterQuery((prevFilterQuery) => ({
        ...prevFilterQuery,
        to: formattedDate,
      }));
    } else {
      setFilterQuery((prevFilterQuery) => ({
        ...prevFilterQuery,
        to: '',
      }));
    }
  };

  const parseDate = (dateString) => {
    const [month, day, year] = dateString.split('/');
    return new Date(year, month - 1, day);
  };

  const HandleCancelFilter = (e) => {
    setFilterQuery({
      builder_name:"",
      subdivision_name:"",
      seller:"",
      buyer:"",
      location:"",
      notes:"",
      from:"",
      to:"",
      parcel:"",
      price:"",
      typeofunit:"",
      priceperunit:"",
      noofunit:"",
      doc:"",
    });
    getLandsaleList(currentPage,searchQuery);
  };

  // const number = [...Array(npage + 1).keys()].slice(1);
  const [sortConfig, setSortConfig] = useState([]);

  useEffect(() => {
    setSelectedCheckboxes(sortConfig.map(col => col.key));
}, [sortConfig]);

const [AllLandsaleListExport, setAllLandsaleListExport] = useState([]);

  const [selectedCheckboxes, setSelectedCheckboxes] = useState(sortConfig.map(col => col.key));
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

  const clearLandSaleDetails = () => {
    setLandSaleDetails({
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
  };

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
  const exportColumns = [
    { label: "Builder Name", key: "Builder_Name" },
    { label: "Subdivision Name", key: "Subdivision_Name" },
    { label: "Seller", key: "Seller" },
    { label: "Buyer", key: "Buyer" },
    { label: "Location", key: "Location" },
    { label: "Notes", key: "Notes" },
    { label: "Price", key: "Price" },
    { label: "Price Per", key: "Price" },
    { label: "Size", key: "Price" },
    { label: "Size MS", key: "Price" },
    { label: "Date", key: "Price" },
  ];

  const handleSelectAllToggle = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    if (newSelectAll) {
      setSelectedColumns(exportColumns.map(col => col.label));
    } else {
      setSelectedColumns([]);
    }
  };

  const handleColumnToggle = (column) => {
    const updatedColumns = selectedColumns.includes(column)
      ? selectedColumns.filter((col) => col !== column)
      : [...selectedColumns, column];
    console.log("load upadate:  ", updatedColumns);
    setSelectedColumns(updatedColumns);
    setSelectAll(updatedColumns.length === exportColumns.length);
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
  
    const tableData = AllLandsaleListExport.map((row) => {
      return tableHeaders.map((header) => {
        switch (header) {
          case "Builder Name":
            return row.subdivision?.builder?.name || '';
          case "Subdivision Name":
            return row.subdivision?.name || '';
          case "Seller":
            return row.seller || '';
          case "Buyer":
            return row.buyer || '';
          case "Location":
            return row.location || '';
          case "Notes":
            return row.notes || '';
          case "Price":
          return row.price ? `${row.price}/${row.typeofunit}` : '';
          case "Size":
            return row.noofunit ? `${row.noofunit}` : 0;
          case "Price Per":
          return row.price_per ? `${row.price_per}/${row.typeofunit}` : '';
          case "Size MS":
          return row.typeofunit ? `${row.typeofunit}` : '';
          case "Date":
          return row.date ? `${row.date}` : '';
          default:
            return '';
        }
      });
    });
  
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([tableHeaders, ...tableData]);
  
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Land sales');
  
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'Land_sales.xlsx');

    resetSelection();
    setExportModelShow(false);
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
  const [isFormLoading, setIsFormLoading] = useState(true);


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
    setIsLoading(true);
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
      setIsLoading(false);
      setLandsaleList(responseData.data);
      setNpage(Math.ceil(responseData.total / recordsPage));
      setlandSaleListCount(responseData.total);
    } catch (error) {
      if (error.name === "HTTPError") {
        setIsLoading(false);
        const errorJson = await error.response.json();
        setError(errorJson.message);
      }
    }
  };
  useEffect(() => {
    if (localStorage.getItem("usertoken")) {
      getLandsaleList(currentPage);
      fetchAllPages(searchQuery, sortConfig)
    } else {
      navigate("/");
    }
  }, [currentPage]);

  async function fetchAllPages(searchQuery, sortConfig) {
    const response = await AdminLandsaleService.index(1, searchQuery, sortConfig ? `&sortConfig=${stringifySortConfig(sortConfig)}` : "");
    const responseData = await response.json();
    const totalPages = Math.ceil(responseData.total / recordsPage);
    let allData = responseData.data;
    for (let page = 2; page <= totalPages; page++) {
      const pageResponse = await AdminLandsaleService.index(page, searchQuery, sortConfig ? `&sortConfig=${stringifySortConfig(sortConfig)}` : "");
      const pageData = await pageResponse.json();
      allData = allData.concat(pageData.data);
    }
    setAllLandsaleListExport(allData);
    setExcelLoading(false);
  }

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

  const handleBulkDelete = async (id) => {
    try {
      let responseData = await AdminLandsaleService.bulkdestroy(id).json();
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
      setBuilderList(responseData.data);
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

  const getSubdivisionList = async () => {
    try {
        let response = await AdminSubdevisionService.index()
        let responseData = await response.json()
        const formattedData = responseData.data.map((subdivision) => ({
          label: subdivision.name,
          value: subdivision.id,
        }));
        setSubdivisionList(formattedData)
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
    setShowOffcanvas(true);
    setIsFormLoading(true);
    try {
      let responseData = await AdminLandsaleService.show(id).json();
      setLandSaleDetails(responseData);
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
  //   }, 300)
  // ).current;

  // useEffect(() => {
  //   getLandsaleList();
  // }, [searchQuery]);

  // const HandleSearch = (e) => {
  //   setIsLoading(true);
  //   const query = e.target.value.trim();
  //   if (query) {
  //     debouncedHandleSearch(`?q=${query}`);
  //   } else {
  //     setSearchQuery("");
  //   }
  // };

  const HandleFilter = (e) => {
    const { name, value } = e.target;
    setFilterQuery((prevFilterQuery) => ({
      ...prevFilterQuery,
      [name]: value,
    }));
  };

  const HandleSelectChange = (selectedOption) => {
    setFilterQuery((prevFilterQuery) => ({
      ...prevFilterQuery,
      builder_name: selectedOption.name,
    }));
  };

  const handleSelectBuilderNameChange  = (selectedItems) => {  
    const selectedValues = selectedItems.map(item => item.value);
    setSelectedValues(selectedValues);
    setSelectedBuilderName(selectedItems);
    const selectedNames = selectedItems.map(item => item.value).join(', ');
    setFilterQuery(prevState => ({
      ...prevState,
      builder_name: selectedNames
  }));
  }

  const handleSelectSubdivisionNameChange  = (selectedItems) => {  
    const selectedValues = selectedItems.map(item => item.value);
    setSelectedValues(selectedValues);
    setSelectedSubdivisionName(selectedItems);

    const selectedNames = selectedItems.map(item => item.value).join(', ');
    setFilterQuery(prevState => ({
      ...prevState,
      subdivision_name: selectedNames
  }));
  }

  const HandleSubSelectChange = (selectedOption) => {
    setFilterQuery((prevFilterQuery) => ({
      ...prevFilterQuery,
      subdivision_name: selectedOption.name,
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
          if (responseData.data) {
            console.log(responseData);
            let message = responseData.data.message;
            if (responseData.data.failed_records > 0) {
                const problematicRows = responseData.data.failed_records_details.map(detail => detail.row).join(', ');
                message += ' Problematic Record Rows: ' + problematicRows+'.';
            }
            message += '. Record Imported: ' + responseData.data.successful_records;
            message += '. Failed Record Count: ' + responseData.data.failed_records;
            message += '. Last Row: ' + responseData.data.last_processed_row;

            swal(message).then((willDelete) => {
              if (willDelete) {
                navigate("/builderlist");
                setShow(false);
              }
            });
          } else {
            swal('Error: ' + responseData.error);
            setShow(false);
        }
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
                        ""
                      ) : (
                    <div style={{marginTop: "10px"}}>
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
                      <button onClick={() => !excelLoading ? setExportModelShow(true) : ""} className="btn btn-primary btn-sm me-1">
                        {excelLoading ? 
                          <div class="spinner-border spinner-border-sm" role="status" /> 
                          :
                          <i class="fas fa-file-excel" />
                        }
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
                      <button
                        className="btn btn-danger btn-sm me-1"
                        style={{marginLeft: "3px"}}
                        onClick={() => selectedLandSales.length > 0 ? swal({
                          title: "Are you sure?",
                          icon: "warning",
                          buttons: true,
                          dangerMode: true,
                        }).then((willDelete) => {
                          if (willDelete) {
                            handleBulkDelete(selectedLandSales);
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
                              <th style={{ textAlign: "center", cursor: "pointer" }} key={column.id} onClick={() => column.id != "action" ? requestSort(
                                column.id == "sIZE MS" ? "typeofunit" : 
                                column.id == "sIZE" ? "noofunit" : 
                                 toCamelCase(column.id)) : ""}>
                                <strong>
                                  {column.label}
                                  {column.id != "action" && sortConfig.some(
                                  (item) => item.key === (
                                    column.id == "sIZE MS" ? "typeofunit" : 
                                    column.id == "sIZE" ? "noofunit" : 
                                    toCamelCase(column.id))
                                ) ? (
                                  <span>
                                    {column.id != "action" && sortConfig.find(
                                      (item) => item.key === (
                                        column.id == "sIZE MS" ? "typeofunit" : 
                                        column.id == "sIZE" ? "noofunit" : 
                                         toCamelCase(column.id))
                                    ).direction === "asc"
                                      ? "↑"
                                      : "↓"}
                                  </span>
                                ) : (
                                  column.id != "action" && <span>↑↓</span>
                                )}
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
                            )}{" "}
                            {checkFieldExist("Price") && (
                              <th onClick={() => requestSort("noofunit")}>
                                <strong>
                                  {" "}
                                  SIZE
                                  {sortConfig.some(
                                  (item) => item.key === "noofunit"
                                ) ? (
                                  <span>
                                    {sortConfig.find(
                                      (item) => item.key === "noofunit"
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
                            {checkFieldExist("Price") && (
                              <th onClick={() => requestSort("price_per")}>
                                <strong>
                                  {" "}
                                  Price Per
                                  {sortConfig.some(
                                  (item) => item.key === "price_per"
                                ) ? (
                                  <span>
                                    {sortConfig.find(
                                      (item) => item.key === "price_per"
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
                              {checkFieldExist("Price") && (
                              <th onClick={() => requestSort("typeofunit")}>
                                <strong>
                                  {" "}
                                  Size MS
                                  {sortConfig.some(
                                  (item) => item.key === "typeofunit"
                                ) ? (
                                  <span>
                                    {sortConfig.find(
                                      (item) => item.key === "typeofunit"
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
                            {checkFieldExist("Date") && (
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
                                      <td key={column.id} style={{ textAlign: "center" }}><PriceComponent price={element.price} />
                                        {/* /{" "}
                                        {element.typeofunit} */}
                                      </td>
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
                                    {column.id == "size MS" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.typeofunit}</td>
                                    }
                                    {column.id == "size" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.noofunit}</td>
                                    }
                                    {column.id == "price Per" &&
                                      <td key={column.id} style={{ textAlign: "center" }}><PriceComponent price={element.price_per} /></td>
                                    }
                                    {column.id == "doc" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.doc}</td>
                                    }
                                      {column.id == "parcel" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.parcel}</td>
                                    }
                                    {column.id == "zip Code" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.zip}</td>
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
                                    <PriceComponent price={element.price} />{" "}
                                  </td>
                                )}{" "}
                                  {checkFieldExist("Price") && (
                                  <td>
                                    {element.noofunit}
                                  </td>
                                )}{" "}
                                {checkFieldExist("Price") && (
                                  <td>
                                    <PriceComponent price={element.price_per} />
                                  </td>
                                )}{" "}
                                  {checkFieldExist("Price") && (
                                  <td>
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
            onClick={() => {setShowOffcanvas(false);clearLandSaleDetails();}}
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
            {/* <div className="row">
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
            </div> */}
            <div style={{marginTop: "10px"}}>
              <div className="d-flex" style={{marginTop: "5px"}}>
                <div className="fs-40" style={{width:"400px", fontSize: "25px"}}><span><b>PARCEL:</b></span>&nbsp;<span>{landSaleDetails.parcel || "NA"}</span></div>
                <div className="fs-18"><span><b>DOC:</b></span>&nbsp;<span>{landSaleDetails.doc || "NA"}</span></div>
              </div>
              <div className="d-flex" style={{marginTop: "5px"}}>
              <label className="fs-18" style={{marginTop: "5px",width:"400px"}}><b>PRICE:</b>&nbsp;<span>{<PriceComponent price={landSaleDetails.price} /> || "NA"}</span></label><br />
              <label className="fs-18" style={{marginTop: "5px"}}><b>ZIPCODE:</b>&nbsp;<span>{landSaleDetails.zip || "NA"}</span></label><br />
              </div>
              <label className="fs-18"><b>DATE:</b>&nbsp;<span>{<DateComponent date={landSaleDetails.date} /> || "NA"}
              </span></label><br />
              <label className="fs-18"><b>PRICE PER:</b>&nbsp;<span>{<PriceComponent price={landSaleDetails.price_per} /> || "NA"}</span></label><br />
              <label className="fs-18"><b>SIZE:</b>&nbsp;<span>{landSaleDetails.noofunit || "NA"}</span></label><br />
              <label className="fs-18"><b>LOCATION:</b>&nbsp;<span>{landSaleDetails.location || "NA"}</span></label><br />

              <hr style={{borderTop:"2px solid black", width: "60%", marginTop: "10px"}}></hr>

              <span className="fw-bold" style={{fontSize: "25px"}}>
                {landSaleDetails.subdivision && landSaleDetails.subdivision.builder?.name || "NA"}
              </span><br />
              <span className="fw-bold" style={{fontSize: "25px"}}>
                {landSaleDetails.subdivision !== null && landSaleDetails.subdivision.name !== undefined
                  ? landSaleDetails.subdivision.name
                  : "NA"
                }
              </span><br />
              <label  className="fs-18"><b>PRODUCT TYPE:</b>&nbsp;<span>{landSaleDetails.subdivision?.product_type || "NA"}</span></label><br />
              <label  style={{width:"400px"}} className="fs-18"><b>Area:</b>&nbsp;<span>{landSaleDetails.subdivision?.area || "NA"}</span></label>
              <label   className="fs-18"><b>MASTERPLAN:</b>&nbsp;<span>{landSaleDetails.subdivision?.masterplan || "NA"}</span></label>

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

      <Offcanvas
        show={manageFilterOffcanvas}
        onHide={setManageFilterOffcanvas}
        className="offcanvas-end customeoff"
        placement="end"
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="modal-title" id="#gridSystemModal">
            Filter Land sales{" "}
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
                      BUILDER NAME:{" "}
                    </label>
                    <Form.Group controlId="tournamentList">
                      <MultiSelect
                        name="builder_name"
                        options={builderDropDown}
                        value={selectedBuilderName}
                        onChange={handleSelectBuilderNameChange }
                        placeholder={"Select Builder Name"} 
                      />
                    </Form.Group>
                    {/* <Form.Group controlId="tournamentList">
                      <Select
                        options={builderDropDown}
                        onChange={HandleSelectChange}
                        getOptionValue={(option) => option.name}
                        getOptionLabel={(option) => option.name}
                        isMulti
                        value={builderDropDown.name}
                        name="builder_name"
                      ></Select>
                    </Form.Group> */}
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">
                      SUBDIVISION NAME:{" "}
                    </label>
                    <Form.Group controlId="tournamentList">
                      <MultiSelect
                        name="subdivision_name"
                        options={SubdivisionList}
                        value={selectedSubdivisionName}
                        onChange={handleSelectSubdivisionNameChange }
                        placeholder={"Select Subdivision Name"} 
                      />
                    </Form.Group>
                    {/* <Form.Group controlId="tournamentList">
                      <Select
                        options={SubdivisionList}
                        onChange={HandleSubSelectChange}
                        getOptionValue={(option) => option.name}
                        getOptionLabel={(option) => option.name}
                        value={SubdivisionList.name}
                        name="subdivision_name"
                      ></Select>
                    </Form.Group>                               */}
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">
                      SELLER:{" "}
                    </label>
                    <input name="seller" value={filterQuery.seller} className="form-control" onChange={HandleFilter}/>
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">
                      BUYER:{" "}
                    </label>
                    <input name="buyer" value={filterQuery.buyer} className="form-control" onChange={HandleFilter}/>
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">
                      LOCATION:{" "}
                    </label>
                    <input name="location" value={filterQuery.location} className="form-control" onChange={HandleFilter}/>
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">
                      Notes:{" "}
                    </label>
                    <input name="notes" value={filterQuery.notes} className="form-control" onChange={HandleFilter}/>
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">
                      PRICE:{" "}
                    </label>
                    <input name="price" value={filterQuery.price} className="form-control" onChange={HandleFilter}/>
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">From:{" "}</label>
                    <DatePicker
        name="from"
        className="form-control"
        selected={filterQuery.from ? parseDate(filterQuery.from) : null}
        onChange={handleFilterDateFrom}
        dateFormat="MM/dd/yyyy"
        placeholderText="mm/dd/yyyy"
      />

                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">To:{" "}</label>
                    <DatePicker
        name="to"
        className="form-control"
        selected={filterQuery.to ? parseDate(filterQuery.to) : null}
        onChange={handleFilterDateTo}
        dateFormat="MM/dd/yyyy"
        placeholderText="mm/dd/yyyy"
      />
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">
                      PRICE PER:{" "}
                    </label>
                    <input name="priceperunit" value={filterQuery.priceperunit} className="form-control" onChange={HandleFilter}/>
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">
                      PARCEL:{" "}
                    </label>
                    <input name="parcel" value={filterQuery.parcel} className="form-control" onChange={HandleFilter}/>
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">
                      DOC:{" "}
                    </label>
                    <input name="doc" value={filterQuery.doc} className="form-control" onChange={HandleFilter}/>
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">
                      SIZE:{" "}
                    </label>
                    <input name="noofunit" value={filterQuery.noofunit} className="form-control" onChange={HandleFilter}/>
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">
                      SIZE MS:{" "}
                    </label>
                    <input name="typeofunit" value={filterQuery.typeofunit} className="form-control" onChange={HandleFilter}/>
                  </div>
                  
                  
                  
                  
                  {/* <div className="col-md-3 mt-3">
                    <label className="form-label">
                    zoning:{" "}
                    </label>
                    <input name="zoning" value={filterQuery.zoning} className="form-control" onChange={HandleFilter}/>
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">
                    lat:{" "}
                    </label>
                    <input name="lat" value={filterQuery.lat} className="form-control" onChange={HandleFilter}/>
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">
                    lng:{" "}
                    </label>
                    <input name="lng" value={filterQuery.lng} className="form-control" onChange={HandleFilter}/>
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">
                    area:{" "}
                    </label>
                    <input name="area" value={filterQuery.area} className="form-control" onChange={HandleFilter}/>
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">
                    zip:{" "}
                    </label>
                    <input name="zip" value={filterQuery.zip} className="form-control" onChange={HandleFilter}/>
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">
                    subdivision_id:{" "}
                    </label>
                    <input name="subdivision_id" value={filterQuery.subdivision_id} className="form-control" onChange={HandleFilter}/>
                  </div> */}
                </div>
              </form>
            </div>
            <br />
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
              onClick={() => { resetSelection(); setExportModelShow(false); }}
            ></button>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <ul className="list-unstyled">
                <li>
                  <label className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={selectAll}
                      onChange={handleSelectAllToggle}
                    />
                      Select All
                  </label>
                </li>
                {exportColumns.map((col) => (
                  <li key={col.label}>
                    <label className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={selectedColumns.includes(col.label)}
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

export default LandsaleList;
