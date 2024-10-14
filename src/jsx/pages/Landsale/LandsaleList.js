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
import ClipLoader from "react-spinners/ClipLoader";
import PriceComponent from "../../components/Price/PriceComponent";
import DateComponent from "../../components/date/DateFormat";
import AccessField from "../../components/AccssFieldComponent/AccessFiled";
import ColumnReOrderPopup from "../../popup/ColumnReOrderPopup";
import BulkLandsaleUpdate from "./BulkLandsaleUpdate";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { MultiSelect } from "react-multi-select-component";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import '../../pages/Subdivision/subdivisionList.css';

const LandsaleList = () => {
  const SyestemUserRole = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).role
    : "";

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [Error, setError] = useState("");
  const navigate = useNavigate();
  const [LandsaleList, setLandsaleList] = useState([]);
  console.log("LandsaleList", LandsaleList);
  const [landSaleListCount, setlandSaleListCount] = useState("");
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
  const [searchQuery, setSearchQuery] = useState(localStorage.getItem("searchQueryByLandSalesFilter") ? JSON.parse(localStorage.getItem("searchQueryByLandSalesFilter")) : "");
  const [manageFilterOffcanvas, setManageFilterOffcanvas] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState(false);
  const handlePopupClose = () => setShowPopup(false);
  const [filterQuery, setFilterQuery] = useState({
    from: localStorage.getItem("from") ? JSON.parse(localStorage.getItem("from")) : "",
    to: localStorage.getItem("to") ? JSON.parse(localStorage.getItem("to")) : "",
    builder_name: localStorage.getItem("builder_name") ? JSON.parse(localStorage.getItem("builder_name")) : "",
    subdivision_name: localStorage.getItem("subdivision_name") ? JSON.parse(localStorage.getItem("subdivision_name")) : "",
    seller: localStorage.getItem("seller") ? JSON.parse(localStorage.getItem("seller")) : "",
    buyer: localStorage.getItem("buyer") ? JSON.parse(localStorage.getItem("buyer")) : "",
    location: localStorage.getItem("location") ? JSON.parse(localStorage.getItem("location")) : "",
    notes: localStorage.getItem("notes") ? JSON.parse(localStorage.getItem("notes")) : "",
    price: localStorage.getItem("price") ? JSON.parse(localStorage.getItem("price")) : "",
    priceperunit: localStorage.getItem("priceperunit") ? JSON.parse(localStorage.getItem("priceperunit")) : "",
    parcel: localStorage.getItem("parcel") ? JSON.parse(localStorage.getItem("parcel")) : "",
    doc: localStorage.getItem("document") ? JSON.parse(localStorage.getItem("document")) : "",
    noofunit: localStorage.getItem("noofunit") ? JSON.parse(localStorage.getItem("noofunit")) : "",
    typeofunit: localStorage.getItem("typeofunit") ? JSON.parse(localStorage.getItem("typeofunit")) : "",
  });
  const [builderListDropDown, setBuilderListDropDown] = useState([]);
  const [subdivisionListDropDown, setSubdivisionListDropDown] = useState([]);
  const [selectedBuilderName, setSelectedBuilderName] = useState([]);
  const [selectedSubdivisionName, setSelectedSubdivisionName] = useState([]);
  const [sortConfig, setSortConfig] = useState([]);
  const [AllProductListExport, setAllBuilderExport] = useState([]);
  const [excelLoading, setExcelLoading] = useState(true);

  const [priceOption, setPriceOption] = useState("");
  const [pricePerOption, setPricePerOption] = useState("");
  const [sizeOption, setSizeOption] = useState("");

  const [priceResult, setPriceResult] = useState(0);
  const [pricePerResult, setPricePerResult] = useState(0);
  const [sizeResult, setSizeResult] = useState(0);
  const handleSortingPopupClose = () => setShowSortingPopup(false);
  const [showSortingPopup, setShowSortingPopup] = useState(false);
  const [fieldOptions, setFieldOptions] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);
  const [selectionOrder, setSelectionOrder] = useState({});
  const [sortOrders, setSortOrders] = useState({});

  useEffect(() => {
    if (localStorage.getItem("selectedBuilderNameByFilter")) {
      const selectedBuilderName = JSON.parse(localStorage.getItem("selectedBuilderNameByFilter"));
      handleSelectBuilderNameChange(selectedBuilderName);
    }
    if (localStorage.getItem("selectedSubdivisionNameByFilter")) {
      const selectedSubdivisionName = JSON.parse(localStorage.getItem("selectedSubdivisionNameByFilter"));
      handleSelectSubdivisionNameChange(selectedSubdivisionName);
    }
  }, []);

  useEffect(() => {
    setSearchQuery(filterString());
  }, [filterQuery]);

  useEffect(() => {
    if (localStorage.getItem("usertoken")) {
      getLandsaleList(currentPage, sortConfig, searchQuery);
    } else {
      navigate("/");
    }
  }, [currentPage]);

  const filterString = () => {
    const queryString = Object.keys(filterQuery)
      .map(
        (key) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(filterQuery[key])}`
      )
      .join("&");

    return queryString ? `&${queryString}` : "";
  };

  const HandlePopupDetailClick = (e) => {
    setShowPopup(true);
  };

  const HandleFilterForm = (e) => {
    if (filterQuery.from == "" || filterQuery.to == "") {
      setShowPopup(true);
      if (filterQuery.from == "" && filterQuery.to == "") {
        setMessage("Please select from and to date.");
      } else if (filterQuery.from == "") {
        setMessage("Please select from date.");
      } else if (filterQuery.to == "") {
        setMessage("Please select to date.");
      }
      return;
    } else {
      let startDate = moment(filterQuery.from);
      let endDate = moment(filterQuery.to);
      let days = endDate.diff(startDate, 'days', true);
      let totaldays = Math.ceil(days) + 1;
      if (totaldays < 367) {
        e.preventDefault();
        console.log(555);
        getLandsaleList(currentPage, sortConfig, searchQuery);
        setManageFilterOffcanvas(false);
        localStorage.setItem("selectedBuilderNameByFilter", JSON.stringify(selectedBuilderName));
        localStorage.setItem("selectedSubdivisionNameByFilter", JSON.stringify(selectedSubdivisionName));
        localStorage.setItem("from", JSON.stringify(filterQuery.from));
        localStorage.setItem("to", JSON.stringify(filterQuery.to));
        localStorage.setItem("builder_name", JSON.stringify(filterQuery.builder_name));
        localStorage.setItem("subdivision_name", JSON.stringify(filterQuery.subdivision_name));
        localStorage.setItem("seller", JSON.stringify(filterQuery.seller));
        localStorage.setItem("buyer", JSON.stringify(filterQuery.buyer));
        localStorage.setItem("location", JSON.stringify(filterQuery.location));
        localStorage.setItem("notes", JSON.stringify(filterQuery.notes));
        localStorage.setItem("price", JSON.stringify(filterQuery.price));
        localStorage.setItem("priceperunit", JSON.stringify(filterQuery.priceperunit));
        localStorage.setItem("parcel", JSON.stringify(filterQuery.parcel));
        localStorage.setItem("document", JSON.stringify(filterQuery.doc));
        localStorage.setItem("noofunit", JSON.stringify(filterQuery.noofunit));
        localStorage.setItem("typeofunit", JSON.stringify(filterQuery.typeofunit));
        localStorage.setItem("searchQueryByLandSalesFilter", JSON.stringify(searchQuery));
      } else {
        setShowPopup(true);
        setMessage("Please select date between 366 days.");
        return;
      }
    }
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
      builder_name: "",
      subdivision_name: "",
      seller: "",
      buyer: "",
      location: "",
      notes: "",
      from: "",
      to: "",
      parcel: "",
      price: "",
      typeofunit: "",
      priceperunit: "",
      noofunit: "",
      doc: "",
    });
    setSelectedBuilderName([]);
    setSelectedSubdivisionName([]);
    getLandsaleList(1, sortConfig, "");
    setManageFilterOffcanvas(false);
    localStorage.removeItem("selectedBuilderNameByFilter");
    localStorage.removeItem("selectedSubdivisionNameByFilter");
    localStorage.removeItem("from");
    localStorage.removeItem("to");
    localStorage.removeItem("builder_name");
    localStorage.removeItem("subdivision_name");
    localStorage.removeItem("seller");
    localStorage.removeItem("buyer");
    localStorage.removeItem("location");
    localStorage.removeItem("notes");
    localStorage.removeItem("price");
    localStorage.removeItem("priceperunit");
    localStorage.removeItem("parcel");
    localStorage.removeItem("document");
    localStorage.removeItem("noofunit");
    localStorage.removeItem("typeofunit");
    localStorage.removeItem("firstTime");
  };

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
  console.log("columns", columns);
  const [draggedColumns, setDraggedColumns] = useState(columns);
  const [selectedLandSales, setSelectedLandSales] = useState([]);
  console.log("selectedLandSales", selectedLandSales);

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

    const tableData = AllProductListExport.map((row) => {
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

  const GetBuilderDropDownList = async () => {
    try {
      const response = await AdminBuilderService.builderDropDown();
      const responseData = await response.json();
      const formattedData = responseData.map((builder) => ({
        label: builder.name,
        value: builder.id,
      }));
      setBuilderListDropDown(formattedData);
    } catch (error) {
      console.log("Error fetching builder list:", error);
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
      }
    }
  };

  const GetSubdivisionDropDownList = async () => {
    try {
      const response = await AdminSubdevisionService.subdivisionDropDown();
      const responseData = await response.json();
      const formattedData = responseData.data.map((subdivision) => ({
        label: subdivision.name,
        value: subdivision.id,
      }));
      setSubdivisionListDropDown(formattedData);
    } catch (error) {
      console.log("Error fetching subdivision list:", error);
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
      }
    }
  };

  useEffect(() => {
    GetBuilderDropDownList();
    GetSubdivisionDropDownList();
  }, []);

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

  const getLandsaleList = async (currentPage, sortConfig, searchQuery) => {
    setIsLoading(true);
    setSearchQuery(searchQuery);
    localStorage.setItem("searchQueryByLandSalesFilter", JSON.stringify(searchQuery));
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
      if (responseData.total > 100) {
        FetchAllPages(searchQuery, sortConfig, responseData.data, responseData.total);
      } else {
        setExcelLoading(false);
        setAllBuilderExport(responseData.data);
      }
    } catch (error) {
      if (error.name === "HTTPError") {
        setIsLoading(false);
        const errorJson = await error.response.json();
        setError(errorJson.message);
      }
    }
    setIsLoading(false);
  };

  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  const FetchAllPages = async (searchQuery, sortConfig, LandsaleList, landSaleListCount) => {
    setExcelLoading(true);
    // const response = await AdminLandsaleService.index(1, searchQuery, sortConfig ? `&sortConfig=${stringifySortConfig(sortConfig)}` : "");
    // const responseData = await response.json();
    const totalPages = Math.ceil(landSaleListCount / recordsPage);
    let allData = LandsaleList;
    for (let page = 2; page <= totalPages; page++) {
      await delay(1000);
      const pageResponse = await AdminLandsaleService.index(page, searchQuery, sortConfig ? `&sortConfig=${stringifySortConfig(sortConfig)}` : "");
      const pageData = await pageResponse.json();
      allData = allData.concat(pageData.data);
    }
    setAllBuilderExport(allData);
    setExcelLoading(false);
  }

  const handleDelete = async (e) => {
    try {
      let responseData = await AdminLandsaleService.destroy(e).json();
      if (responseData.status === true) {
        getLandsaleList(currentPage, sortConfig, searchQuery);
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
        getLandsaleList(currentPage, sortConfig, searchQuery);
      }
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(errorJson.message);
      }
    }
  };

  const handleCallback = () => {
    getLandsaleList(currentPage, sortConfig, searchQuery);
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

  const HandleFilter = (e) => {
    const { name, value } = e.target;
    setFilterQuery((prevFilterQuery) => ({
      ...prevFilterQuery,
      [name]: value,
    }));
  };

  const handleSelectBuilderNameChange = (selectedItems) => {
    setSelectedBuilderName(selectedItems);
    const selectedNames = selectedItems.map(item => item.label).join(', ');
    setFilterQuery(prevState => ({
      ...prevState,
      builder_name: selectedNames
    }));
  };

  const handleSelectSubdivisionNameChange = (selectedItems) => {
    setSelectedSubdivisionName(selectedItems);
    const selectedNames = selectedItems.map(item => item.label).join(', ');
    setFilterQuery(prevState => ({
      ...prevState,
      subdivision_name: selectedNames
    }));
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
          let responseData = await AdminLandsaleService.import(inputData).json();
          setSelectedFile("");
          document.getElementById("fileInput").value = null;
          setLoading(false);
          
          if (responseData.failed_records > 0) {
            let message = responseData.message;
            const problematicRows = responseData.failed_records_details.map(detail => detail.row).join(', ');
            message += ' Problematic Record Rows: ' + problematicRows + '.';
            message += '. Record Imported: ' + responseData.successful_records;
            message += '. Failed Record Count: ' + responseData.failed_records;
            message += '. Last Row: ' + responseData.last_processed_row;

            setShow(false);
            swal(message).then((willDelete) => {
              if (willDelete) {
                getLandsaleList(currentPage, sortConfig, searchQuery);
              }
            });
          } else {
            if (responseData.message) {
              let message = responseData.message;
              setShow(false);
              swal(message).then((willDelete) => {
                if (willDelete) {
                  getLandsaleList(currentPage, sortConfig, searchQuery);
                }
              });
            }
          }
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

  const addToBuilderList = () => {
    let subdivisionID = LandsaleList.filter((data) => data.subdivision_id != null);
    if (subdivisionID.length === 0) {
      setShowPopup(true);
      setMessage("Subdivion is not there in land.");
      return;
    } else {
      let subdivisionList = LandsaleList.map((data) => data.subdivision);

      navigate('/google-map-locator', {
        state: {
          subdivisionList: subdivisionList,
          landsales: true
        },
      });
    }
  };

  const totalSumFields = (field) => {
    if (field == "price") {
      return AllProductListExport.reduce((sum, landsales) => {
        return sum + (landsales.price || 0);
      }, 0);
    }
    if (field == "price_per") {
      return AllProductListExport.reduce((sum, landsales) => {
        return sum + (landsales.price_per || 0);
      }, 0);
    }
    if (field == "size") {
      return AllProductListExport.reduce((sum, landsales) => {
        return sum + (parseFloat(landsales.noofunit) || 0);
      }, 0).toFixed(2);
    }
  };

  const averageFields = (field) => {
    if (field == "size") {
      const sum = totalSumFields(field);
      return (sum / AllProductListExport.length).toFixed(2);
    } else {
      const sum = totalSumFields(field);
      return sum / AllProductListExport.length;
    }
  };

  const handleSelectChange = (e, field) => {
    const value = e.target.value;

    switch (field) {
      case "price":
        setPriceOption(value);
        setPricePerOption("");
        setSizeOption("");

        setPricePerResult(0);
        setSizeResult(0);

        if (value === 'sum') {
          setPriceResult(totalSumFields(field));
        } else if (value === 'avg') {
          setPriceResult(averageFields(field));
        }
        break;

      case "price_per":
        setPricePerOption(value);
        setPriceOption("");
        setSizeOption("");

        setPriceResult(0);
        setSizeResult(0);

        if (value === 'sum') {
          setPricePerResult(totalSumFields(field));
        } else if (value === 'avg') {
          setPricePerResult(averageFields(field));
        }
        break;

      case "size":
        setSizeOption(value);
        setPriceOption("");
        setPricePerOption("");

        setPriceResult(0);
        setPricePerResult(0);

        if (value === 'sum') {
          setSizeResult(totalSumFields(field));
        } else if (value === 'avg') {
          setSizeResult(averageFields(field));
        }
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    const fieldOptions = fieldList
      .filter((field) => field !== 'Action' && field !== 'Price Per')
      .map((field) => {
        let value = field.charAt(0).toLowerCase() + field.slice(1).replace(/\s+/g, '');

        if (value === 'sizeMS') {
          value = 'typeofunit';
        }
        if (value === 'size') {
          value = 'noofunit';
        }
        if (value === 'zipCode') {
          value = 'zip';
        }
        return {
          value: value,
          label: field,
        };
      });
    setFieldOptions(fieldOptions);
  }, [fieldList]);

  useEffect(() => {
    if (showPopup) {
      setSelectedFields([]);
      setSortOrders({});
    }
  }, [showPopup]);

  const HandleSortingPopupDetailClick = (e) => {
    setShowSortingPopup(true);
  };

  const handleApplySorting = () => {
    const sortingConfig = selectedFields.map((field) => ({
      key: field.value,
      direction: sortOrders[field.value] || 'asc',
    }));
    setSortConfig(sortingConfig)
    getLandsaleList(currentPage, sortingConfig, searchQuery);
    handleSortingPopupClose();
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
                      SyestemUserRole == "User" || SyestemUserRole == "Standard User" ? (
                      <div style={{ marginTop: "10px" }}>
                        <button className="btn btn-primary btn-sm me-1" onClick={handleOpenDialog} title="Column Order">
                          {/* Set Columns Order */}
                          <i className="fa-solid fa-list"></i>
                        </button>

                        <Button
                          className="btn-sm me-1"
                          variant="secondary"
                          onClick={HandleSortingPopupDetailClick}
                          title="Sorted Fields"
                        >
                          <i class="fa-solid fa-sort"></i>
                        </Button>
                        <button onClick={() => !excelLoading ? setExportModelShow(true) : ""} className="btn btn-primary btn-sm me-1" title="Export .csv">
                          {excelLoading ?
                            <div class="spinner-border spinner-border-sm" role="status" />
                            :
                            <i class="fas fa-file-excel" />
                          }
                        </button>
                        <button className="btn btn-success btn-sm me-1" onClick={() => setManageFilterOffcanvas(true)} title="Filter">
                          <i className="fa fa-filter" />
                        </button>
                      </div>
                    ) : (
                      <div style={{ marginTop: "10px" }}>
                        <button className="btn btn-primary btn-sm me-1" onClick={handleOpenDialog} title="Column Order">
                          {/* Set Columns Order */}
                          <i className="fa-solid fa-list"></i>
                        </button>

                        <Button
                          className="btn-sm me-1"
                          variant="secondary"
                          onClick={HandleSortingPopupDetailClick}
                          title="Sorted Fields"
                        >
                          <i class="fa-solid fa-sort"></i>
                        </Button>
                        <button onClick={() => !excelLoading ? setExportModelShow(true) : ""} className="btn btn-primary btn-sm me-1" title="Export .csv">
                          {excelLoading ?
                            <div class="spinner-border spinner-border-sm" role="status" />
                            :
                            <i class="fas fa-file-excel" />
                          }
                        </button>
                        <Button
                          className="btn btn-primary btn-sm me-1"
                          onClick={addToBuilderList}
                        >
                          <i className="fa fa-map-marker" aria-hidden="true"></i>
                        </Button>
                        <button
                          className="btn btn-primary btn-sm me-1"
                          onClick={() => setManageAccessOffcanvas(true)}
                        >
                          {" "}
                          Field Access
                        </button>
                        <button className="btn btn-success btn-sm me-1" onClick={() => setManageFilterOffcanvas(true)} title="Filter">
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
                          style={{ marginLeft: "3px" }}
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
                      {landSaleListCount} entries
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
                                  {column.id != "action" && sortConfig.some(
                                    (item) => item.key === (
                                      column.id == "size MS" ? "typeofunit" :
                                        column.id == "size" ? "noofunit" :
                                        column.id == "zip Code" ? "zip" :
                                          toCamelCase(column.id))
                                  ) && (
                                    <span>
                                      {column.id != "action" && sortConfig.find(
                                        (item) => item.key === (
                                          column.id == "size MS" ? "typeofunit" :
                                            column.id == "size" ? "noofunit" :
                                            column.id == "zip Code" ? "zip" :
                                              toCamelCase(column.id))
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  )}
                                </strong>

                                {(!excelLoading) && (column.id !== "builder Name" && column.id !== "subdivision Name" && column.id !== "seller" &&
                                  column.id !== "buyer" && column.id !== "location" && column.id !== "notes" && column.id !== "date" &&
                                  column.id !== "action" && column.id !== "size MS" && column.id !== "doc" && column.id !== "parcel" && column.id !== "zip Code") &&
                                  (
                                    <>
                                      <br />
                                      <select className="custom-select"
                                        value={
                                          column.id == "price" ? priceOption :
                                            column.id == "price Per" ? pricePerOption :
                                              column.id == "size" ? sizeOption : ""
                                        }

                                        style={{
                                          cursor: "pointer",
                                          marginLeft: '0px',
                                          fontSize: "8px",
                                          padding: " 0 5px 0",
                                          height: "15px",
                                          color: "white",
                                          appearance: "auto"
                                        }}

                                        onChange={(e) => column.id == "price" ? handleSelectChange(e, "price") :
                                          column.id == "price Per" ? handleSelectChange(e, "price_per") :
                                            column.id == "size" ? handleSelectChange(e, "size") : ""}
                                      >
                                        <option style={{ color: "black", fontSize: "10px" }} value="" disabled>CALCULATION</option>
                                        <option style={{ color: "black", fontSize: "10px" }} value="sum">Sum</option>
                                        <option style={{ color: "black", fontSize: "10px" }} value="avg">Avg</option>
                                      </select>
                                      <br />
                                    </>
                                  )}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody style={{ textAlign: "center" }}>
                          {!excelLoading &&
                            <tr>
                              <td></td>
                              <td></td>
                              {columns.map((column) => (
                                <>
                                  {column.id == "builder Name" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "subdivision Name" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "seller" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "buyer" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "location" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "notes" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "price" &&
                                    <td key={column.id} style={{ textAlign: "center" }}><PriceComponent price={priceResult} /></td>
                                  }
                                  {column.id == "date" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "action" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "size MS" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "size" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{sizeResult}</td>
                                  }
                                  {column.id == "price Per" &&
                                    <td key={column.id} style={{ textAlign: "center" }}><PriceComponent price={pricePerResult} /></td>
                                  }
                                  {column.id == "doc" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "parcel" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "zip Code" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                </>
                              ))}
                            </tr>
                          }
                          {LandsaleList !== null && LandsaleList.length > 0 ? (
                            LandsaleList.map((element, index) => (
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
                                      <td key={column.id} style={{ textAlign: "center" }}><PriceComponent price={element.price} /></td>
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
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="17" style={{ textAlign: "center" }}>
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
            <div className="d-sm-flex text-center justify-content-between align-items-center dataTables_wrapper no-footer">
                    <div className="dataTables_info">
                      Showing {lastIndex - recordsPage + 1} to {lastIndex} of{" "}
                      {landSaleListCount} entries
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
            onClick={() => { setShowOffcanvas(false); clearLandSaleDetails(); }}
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
              <div style={{ marginTop: "10px" }}>
                <div className="d-flex" style={{ marginTop: "5px" }}>
                  <div className="fs-40" style={{ width: "400px", fontSize: "25px" }}><span><b>PARCEL:</b></span>&nbsp;<span>{landSaleDetails.parcel || "NA"}</span></div>
                  <div className="fs-18"><span><b>DOC:</b></span>&nbsp;<span>{landSaleDetails.doc || "NA"}</span></div>
                </div>
                <div className="d-flex" style={{ marginTop: "5px" }}>
                  <label className="fs-18" style={{ marginTop: "5px", width: "400px" }}><b>PRICE:</b>&nbsp;<span>{<PriceComponent price={landSaleDetails.price} /> || "NA"}</span></label><br />
                  <label className="fs-18" style={{ marginTop: "5px" }}><b>ZIPCODE:</b>&nbsp;<span>{landSaleDetails.zip || "NA"}</span></label><br />
                </div>
                <label className="fs-18"><b>DATE:</b>&nbsp;<span>{<DateComponent date={landSaleDetails.date} /> || "NA"}
                </span></label><br />
                <label className="fs-18"><b>PRICE PER:</b>&nbsp;<span>{<PriceComponent price={landSaleDetails.price_per} /> || "NA"}</span></label><br />
                <label className="fs-18"><b>SIZE:</b>&nbsp;<span>{landSaleDetails.noofunit || "NA"}</span></label><br />
                <label className="fs-18"><b>LOCATION:</b>&nbsp;<span>{landSaleDetails.location || "NA"}</span></label><br />

                <hr style={{ borderTop: "2px solid black", width: "60%", marginTop: "10px" }}></hr>

                <span className="fw-bold" style={{ fontSize: "25px" }}>
                  {landSaleDetails.subdivision && landSaleDetails.subdivision.builder?.name || "NA"}
                </span><br />
                <span className="fw-bold" style={{ fontSize: "25px" }}>
                  {landSaleDetails.subdivision !== null && landSaleDetails.subdivision.name !== undefined
                    ? landSaleDetails.subdivision.name
                    : "NA"
                  }
                </span><br />
                <label className="fs-18"><b>PRODUCT TYPE:</b>&nbsp;<span>{landSaleDetails.subdivision?.product_type || "NA"}</span></label><br />
                <label style={{ width: "400px" }} className="fs-18"><b>Area:</b>&nbsp;<span>{landSaleDetails.subdivision?.area || "NA"}</span></label>
                <label className="fs-18"><b>MASTERPLAN:</b>&nbsp;<span>{landSaleDetails.subdivision?.masterplan || "NA"}</span></label>

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
                    <label className="form-label">From:{" "}
                      <span className="text-danger">*</span>
                    </label>
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
                    <label className="form-label">To:{" "}
                      <span className="text-danger">*</span>
                    </label>
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
                      BUILDER NAME:{" "}
                    </label>
                    <Form.Group controlId="tournamentList">
                      <MultiSelect
                        name="builder_name"
                        options={builderListDropDown}
                        value={selectedBuilderName}
                        onChange={handleSelectBuilderNameChange}
                        placeholder={"Select Builder Name"}
                      />
                    </Form.Group>
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">
                      SUBDIVISION NAME:{" "}
                    </label>
                    <Form.Group controlId="tournamentList">
                      <MultiSelect
                        name="subdivision_name"
                        options={subdivisionListDropDown}
                        value={selectedSubdivisionName}
                        onChange={handleSelectSubdivisionNameChange}
                        placeholder={"Select Subdivision Name"}
                      />
                    </Form.Group>
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">
                      SELLER:{" "}
                    </label>
                    <input name="seller" value={filterQuery.seller} className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">
                      BUYER:{" "}
                    </label>
                    <input name="buyer" value={filterQuery.buyer} className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">
                      LOCATION:{" "}
                    </label>
                    <input name="location" value={filterQuery.location} className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">
                      Notes:{" "}
                    </label>
                    <input name="notes" value={filterQuery.notes} className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">
                      PRICE:{" "}
                    </label>
                    <input name="price" value={filterQuery.price} className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">
                      PRICE PER:{" "}
                    </label>
                    <input name="priceperunit" value={filterQuery.priceperunit} className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">
                      PARCEL:{" "}
                    </label>
                    <input name="parcel" value={filterQuery.parcel} className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">
                      DOC:{" "}
                    </label>
                    <input name="doc" value={filterQuery.doc} className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">
                      SIZE:{" "}
                    </label>
                    <input name="noofunit" value={filterQuery.noofunit} className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">
                      SIZE MS:{" "}
                    </label>
                    <input name="typeofunit" value={filterQuery.typeofunit} className="form-control" onChange={HandleFilter} />
                  </div>
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

      {/* Popup */}
      <Modal show={showPopup} onHide={HandlePopupDetailClick}>
        <Modal.Header handlePopupClose>
          <Modal.Title>Alert</Modal.Title>
          <button
            className="btn-close"
            aria-label="Close"
            onClick={() => handlePopupClose()}
          ></button>
        </Modal.Header>
        <Modal.Body>{message}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handlePopupClose}>Close</Button>
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
                  const fieldOrder = selectionOrder[field.value]; // Get the selection order

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
                          {isChecked && <span>{fieldOrder}. </span>} {/* Display selection number */}
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
    </>
  );
};

export default LandsaleList;
