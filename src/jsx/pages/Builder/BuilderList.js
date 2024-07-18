import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import AdminBuilderService from "../../../API/Services/AdminService/AdminBuilderService";
import BuilderOffcanvas from "./BuilderOffcanvas";
import { Form, Offcanvas, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import PriceComponent from "../../components/Price/PriceComponent";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import ClipLoader from "react-spinners/ClipLoader";
import DateComponent from "../../components/date/DateFormat";
import AccessField from "../../components/AccssFieldComponent/AccessFiled";
import Modal from "react-bootstrap/Modal";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import BulkBuilderUpdate from "./BulkBuilderUpdate";
import ColumnReOrderPopup from "../../popup/ColumnReOrderPopup";
import { MultiSelect } from "react-multi-select-component";

const BuilderTable = () => {
  const location = useLocation();

  const { searchQueryByFilter, selectedBuilderNameByFilter, selectedStatusByFilter, active_communitiesByFilter, selectedCompanyTypeByFilter } = location.state || {};

  const SyestemUserRole = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).role : "";

  const [excelLoading, setExcelLoading] = useState(true);

  const handleSortCheckboxChange = (e, key) => {
    if (e.target.checked) {
      setSelectedCheckboxes(prev => [...prev, key]);
    } else {
      setSelectedCheckboxes(prev => prev.filter(item => item !== key));
    }
  };

  const [selectedLandSales, setSelectedLandSales] = useState([]);
  const bulkBuilder = useRef();

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
  const [showSort, setShowSort] = useState(false);
  const handleSortClose = () => setShowSort(false);

  const [Error, setError] = useState("");
  var imageUrl = process.env.REACT_APP_Builder_IMAGE_URL;
  const [searchQuery, setSearchQuery] = useState(searchQueryByFilter);
  const [filter, setFilter] = useState(false);
  const [normalFilter, setNormalFilter] = useState(false);
  const [filterQuery, setFilterQuery] = useState({
    name: "",
    is_active: "",
    active_communities: active_communitiesByFilter ? active_communitiesByFilter : "",
    company_type: "",
  });
  const [filterQueryCalculation, setFilterQueryCalculation] = useState({
    closing_this_year: "",
    permits_this_year: "",
    net_sales_this_year: "",
    current_avg_base_Price: "",
    avg_net_sales_per_month_this_year: "",
    avg_closings_per_month_this_year: "",
    median_closing_price_this_year: "",
    median_closing_price_last_year: "",
    total_closings: "",
    total_permits: "",
    total_net_sales: "",
    date_of_first_closing: "",
    date_of_latest_closing: "",
  });
  const [show, setShow] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const [selectedFileError, setSelectedFileError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleClose = () => setShow(false);

  const [BuilderList, setBuilderList] = useState([]);
  console.log("BuilderList", BuilderList);
  const [AllBuilderListExport, setAllBuilderExport] = useState([]);

  const [BuilderListCount, setBuilderListCount] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPage = 100;
  const lastIndex = currentPage * recordsPage;
  const firstIndex = lastIndex - recordsPage;
  const [npage, setNpage] = useState(0);
  const number = [...Array(npage + 1).keys()].slice(1);

  const navigate = useNavigate();

  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [manageAccessOffcanvas, setManageAccessOffcanvas] = useState(false);
  const [manageFilterOffcanvas, setManageFilterOffcanvas] = useState(false);
  const [accessList, setAccessList] = useState({});
  const [accessRole, setAccessRole] = useState("Admin");
  const [accessForm, setAccessForm] = useState({});
  const [role, setRole] = useState("Admin");
  const [checkedItems, setCheckedItems] = useState({});
  const fieldList = AccessField({ tableName: "builders" });
  const [selectAll, setSelectAll] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const resetSelection = () => {
    setSelectAll(false);
    setSelectedColumns([]);
  };
  const [exportmodelshow, setExportModelShow] = useState(false);
  const [columnSeq, setcolumnSeq] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [columns, setColumns] = useState([]);
  console.log("columns", columns);
  const [draggedColumns, setDraggedColumns] = useState(columns);

  const [activeCommunitiesOption, setActiveCommunitiesOption] = useState("");
  const [closingThisYearOption, setClosingThisYearOption] = useState("");
  const [permitsThisYearOption, setPermitsThisYearOption] = useState("");
  const [netSalesThisYearOption, setNetSalesThisYearOption] = useState("");
  const [currentAvgBasePriceOption, setCurrentAvgBasePriceOption] = useState("");
  const [medianClosingPriceThisYearOption, setMedianClosingPriceThisYearOption] = useState("");
  const [medianClosingPriceLastYearOption, setMedianClosingPriceLastYearOption] = useState("");
  const [avgNetSalesPerMonthThisYearOption, setAvgNetSalesPerMonthThisYearOption] = useState("");
  const [avgClosingsPerMonthThisYearOption, setAvgClosingsPerMonthThisYearOption] = useState("");
  const [totalClosingsOption, setTotalClosingsOption] = useState("");
  const [totalPermitsOption, setTotalPermitsOption] = useState("");
  const [totalNetSalesOption, setTotalNetSalesOption] = useState("");

  const [activeCommunitiesResult, setActiveCommunitiesResult] = useState(0);
  const [closingThisYearResult, setClosingThisYearResult] = useState(0);
  const [permitsThisYearResult, setPermitsThisYearResult] = useState(0);
  const [netSalesThisYearResult, setNetSalesThisYearResult] = useState(0);
  const [currentAvgBasePriceResult, setCurrentAvgBasePriceResult] = useState(0);
  const [medianClosingPriceThisYearResult, setMedianClosingPriceThisYearResult] = useState(0);
  const [medianClosingPriceLastYearResult, setMedianClosingPriceLastYearResult] = useState(0);
  const [avgNetSalesPerMonthThisYearResult, setAvgNetSalesPerMonthThisYearResult] = useState(0);
  const [avgClosingsPerMonthThisYearResult, setAvgClosingsPerMonthThisYearResult] = useState(0);
  const [totalClosingsResult, setTotalClosingsResult] = useState(0);
  const [totalPermitsResult, setTotalPermitsResult] = useState(0);
  const [totalNetSalesResult, setTotalNetSalesResult] = useState(0);

  const [builderListDropDown, setBuilderListDropDown] = useState([]);
  const [selectedBuilderName, setSelectedBuilderName] = useState(selectedBuilderNameByFilter);
  const [selectedStatus, setSelectedStatus] = useState(selectedStatusByFilter);
  const [selectedCompanyType, setSelectedCompanyType] = useState(selectedCompanyTypeByFilter);

  const [selectedValues, setSelectedValues] = useState([]);

  const checkFieldExist = (fieldName) => {
    return fieldList.includes(fieldName.trim());
  };

  const headers = [
    { label: "Logo", key: "Logo" },
    { label: "Website", key: "website" },
    { label: "Builder Name", key: "name" },
    { label: "Company Type", key: "companytype" },
    { label: "LV office Phone", key: "phone" },
    { label: "LV office Email", key: "email_address" },
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
  const exportColumns = [
    { label: "Builder_code", key: "builder_code" },
    { label: "Logo", key: "Logo" },
    { label: "Website", key: "website" },
    { label: "Builder Name", key: "name" },
    { label: "Company Type", key: "company_type" },
    { label: "LV office Phone", key: "phone" },
    { label: "LV office Email", key: "email_address" },
    { label: "LV office address", key: "officeaddress1" },
    { label: "LV office City", key: "city" },
    { label: "LV office Zip", key: "zipCode" },
    { label: "Current Division President", key: "current_division_president" },
    { label: "Current Land Acquisitions", key: "current_land_aquisitions" },
    { label: "Corporate Office Address 1", key: "coporate_officeaddress_1" },
    { label: "Corporate State", key: "coporate_officeaddress_2" },
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
    console.log(updatedColumns);
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
debugger
    const tableData = (filter ? BuilderList : AllBuilderListExport).map((row) => {
      const mappedRow = {};
      tableHeaders.forEach((header) => {
        switch (header) {
          case "Builder_code":
            mappedRow[header] = row.builder_code;
            break;
          case "Logo":
            mappedRow[header] = imageUrl + row.logo;
            break;
          case "Website":
            mappedRow[header] = row.website;
            break;
          case "Builder Name":
            mappedRow[header] = row.name;
            break;
          case "Company Type":
            mappedRow[header] = row.company_type;
            break;
          case "LV office Phone":
            mappedRow[header] = row.phone;
            break;
          case "LV office Email":
            mappedRow[header] = row.email_address;
            break;
          case "LV office address":
            mappedRow[header] = row.officeaddress1;
            break;
          case "LV office City":
            mappedRow[header] = row.city;
            break;
          case "LV office Zip code":
            mappedRow[header] = row.zipcode;
            break;
          case "Current Division President":
            mappedRow[header] = row.current_division_president;
            break;
          case "Current Land Acquisitions":
            mappedRow[header] = row.current_land_aquisitions;
            break;
          case "Corporate Office Address":
            mappedRow[header] = row.coporate_officeaddress_1;
            break;
          case "Corporate Office City":
            mappedRow[header] = row.coporate_officeaddress_city;
            break;
          case "Corporate Office State":
            mappedRow[header] = row.coporate_officeaddress_2;
            break;
          case "Corporate Office Zip":
            mappedRow[header] = row.coporate_officeaddress_zipcode;
            break;
          case "Stock Market":
            mappedRow[header] = row.stock_market;
            break;
          case "Stock Symbol":
            mappedRow[header] = row.stock_symbol;
            break;
          case "Active Communities":
            mappedRow[header] = row.active_communities;
            break;
          case "Closing This Year":
            mappedRow[header] = row.closing_this_year;
            break;
          case "Permits This Year":
            mappedRow[header] = row.permits_this_year;
            break;
          case "Net Sales this year":
            mappedRow[header] = row.net_sales_this_year;
            break;
          case "Current Avg Base Price":
            mappedRow[header] = row.current_avg_base_Price;
            break;
          case "Median Closing Price This Year":
            mappedRow[header] = row.median_closing_price_this_year;
            break;
          case "Median Closing Price Last Year":
            mappedRow[header] = row.median_closing_price_last_year;
            break;
          case "Avg Net Sales Per Month This Year":
            mappedRow[header] = row.avg_net_sales_per_month_this_year;
            break;
          case "Avg Closings Per Month This Year":
            mappedRow[header] = row.avg_closings_per_month_this_year;
            break;
          case "Total Closings":
            mappedRow[header] = row.total_closings;
            break;
          case "Total Permits":
            mappedRow[header] = row.total_permits;
            break;
          case "Total Net Sales":
            mappedRow[header] = row.total_net_sales;
            break;
          case "Date Of First Closing":
            mappedRow[header] = row.date_of_first_closing;
            break;
          case "Date Of Latest Closing":
            mappedRow[header] = row.date_of_latest_closing;
            break;
          default:
            mappedRow[header] = "";
        }
      });
      return mappedRow;
    });

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(tableData, { header: tableHeaders });

    // Applying font style to header
    const headerRange = XLSX.utils.decode_range(worksheet['!ref']);
    for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
      const cell = worksheet[XLSX.utils.encode_cell({ r: 0, c: C })];
      if (!cell.s) cell.s = {};
      cell.s.font = { name: 'Calibri', sz: 11, bold: false };
    }

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Builders');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'Builders.xlsx');

    resetSelection();
    setExportModelShow(false);
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
  const clearBuilderDetails = () => {
    SetBuilderDetails({
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
  };
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState([]);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState(sortConfig.map(col => col.key));
  useEffect(() => {
    setSelectedCheckboxes(sortConfig.map(col => col.key));
  }, [sortConfig]);

  const builder = useRef();
  const [value, setValue] = React.useState("1");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const stringifySortConfig = (sortConfig) => {
    return sortConfig.map((sort) => `${sort.key}:${sort.direction}`).join(",");
  };

  const getbuilderlist = async (pageNumber, sortConfig, searchQuery) => {
    setIsLoading(true);
    setExcelLoading(true);
    setSearchQuery(searchQuery);
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
      if(responseData.total > 100) {
        FetchAllPages(searchQuery, sortConfig, responseData.data, responseData.total);
      } else {
        setExcelLoading(false);
        setAllBuilderExport(responseData.data);
      }
    } catch (error) {
      console.log(error);
      if (error.name === "HTTPError") {
        setIsLoading(false);
        const errorJson = await error.response.json();
        setError(errorJson.message);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (selectedBuilderNameByFilter != undefined && selectedBuilderNameByFilter.length > 0) {
      handleSelectBuilderNameChange(selectedBuilderNameByFilter);
    }
    if (selectedStatusByFilter != undefined && selectedStatusByFilter.length > 0) {
      handleSelectStatusChange(selectedStatusByFilter);
    }
    if (selectedCompanyTypeByFilter != undefined && selectedCompanyTypeByFilter.length > 0) {
      handleSelectCompanyTypeChange(selectedCompanyTypeByFilter);
    }
  }, [ selectedBuilderNameByFilter, selectedStatusByFilter, selectedCompanyTypeByFilter]);

  useEffect(() => {
    debugger
    setSearchQuery(filterString());
  }, [filterQuery]);

  useEffect(() => {
    if (localStorage.getItem("usertoken")) {
      getbuilderlist(currentPage, sortConfig, searchQuery);
    } else {
      navigate("/");
    }
  }, [currentPage]);

  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  const FetchAllPages = async (searchQuery, sortConfig, BuilderList, BuilderListCount) => {
    debugger
    setExcelLoading(true);
    // const response = await AdminBuilderService.index(1, searchQuery, sortConfig ? `&sortConfig=${stringifySortConfig(sortConfig)}` : "");
    // const responseData = await response.json();
    const totalPages = Math.ceil(BuilderListCount / recordsPage);
    let allData = BuilderList;
    for (let page = 2; page <= totalPages; page++) {
      // await delay(1000);
      const pageResponse = await AdminBuilderService.index(page, searchQuery, sortConfig ? `&sortConfig=${stringifySortConfig(sortConfig)}` : "");
      const pageData = await pageResponse.json();
      allData = allData.concat(pageData.data);
    }
    setAllBuilderExport(allData);
    setExcelLoading(false);
  }

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
    }
  };

  useEffect(() => {
    GetBuilderDropDownList();
  }, []);

  const [isLoading, setIsLoading] = useState(true);
  const [isFormLoading, setIsFormLoading] = useState(true);

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

  const handleBulkDelete = async (id) => {
    try {
      let responseData = await AdminBuilderService.bulkdestroy(id).json();
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
    setShowOffcanvas(true);
    setIsFormLoading(true);
    try {
      let responseData = await AdminBuilderService.show(id).json();
      SetBuilderDetails(responseData);
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

  const HandleFilterForm = (e) => {
    debugger
    e.preventDefault();
    setFilter(false);
    setNormalFilter(false);
    getbuilderlist(currentPage, sortConfig, searchQuery);
    setManageFilterOffcanvas(false);
    setActiveCommunitiesOption("");
    setClosingThisYearOption("");
    setPermitsThisYearOption("");
    setNetSalesThisYearOption("");
    setCurrentAvgBasePriceOption("");
    setMedianClosingPriceThisYearOption("");
    setMedianClosingPriceLastYearOption("");
    setAvgNetSalesPerMonthThisYearOption("");
    setAvgClosingsPerMonthThisYearOption("");
    setTotalClosingsOption("");
    setTotalPermitsOption("");
    setTotalNetSalesOption("");
    setActiveCommunitiesResult(0);
    setClosingThisYearResult(0);
    setPermitsThisYearResult(0);
    setNetSalesThisYearResult(0);
    setCurrentAvgBasePriceResult(0);
    setMedianClosingPriceThisYearResult(0);
    setMedianClosingPriceLastYearResult(0);
    setAvgNetSalesPerMonthThisYearResult(0);
    setAvgClosingsPerMonthThisYearResult(0);
    setTotalClosingsResult(0);
    setTotalPermitsResult(0);
    setTotalNetSalesResult(0);
  };

  const HandleFilter = (e) => {
    const { name, value } = e.target;
    setFilterQuery((prevFilterQuery) => ({
      ...prevFilterQuery,
      [name]: value,
    }));
    setNormalFilter(true);
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
    setFilter(false);
    setNormalFilter(false);
    setFilterQuery({
      name: "",
      is_active: "",
      active_communities: "",
      company_type: "",
    });
    setFilterQueryCalculation({
      closing_this_year: "",
      permits_this_year: "",
      net_sales_this_year: "",
      current_avg_base_Price: "",
      avg_net_sales_per_month_this_year: "",
      avg_closings_per_month_this_year: "",
      median_closing_price_this_year: "",
      median_closing_price_last_year: "",
      total_closings: "",
      total_permits: "",
      total_net_sales: "",
      date_of_first_closing: "",
      date_of_latest_closing: "",
    });
    setSelectedBuilderName([]);
    setSelectedStatus([]);
    setSelectedCompanyType([]);
    getbuilderlist(1, sortConfig, "");
    setManageFilterOffcanvas(false);
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
    getbuilderlist(currentPage, newSortConfig, searchQuery);
  };

  const HandleRole = (e) => {
    setRole(e.target.value);
    setAccessRole(e.target.value);
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
          if (responseData.data) {
            console.log(responseData);
            let message = responseData.data.message;
            if (responseData.data.failed_records > 0) {
              const problematicRows = responseData.data.failed_records_details.map(detail => detail.row).join(', ');
              message += ' Problematic Record Rows: ' + problematicRows + '.';
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
  const [colSeq, setcolSeq] = useState(["Logo", "Website", "Builder Name", "Company Type", "LV office Phone", "LV office Email", "LV office address", "LV office City", "LV office Zip", "Current Division President", "Current Land Acquisitions", "Corporate Office Address 1", "Corporate Office City", "Corporate Office State", "Corporate Office Zip", "Stock Market", "Stock Symbol", "Active Communities", "Closing This Year", "Permits This Year", "Net Sales this year", "Current Avg Base Price", "Median Closing Price This Year ", "Median Closing Price Last Year", "Avg Net Sales Per Month This Year ", "Avg Closings Per Month This Year", "Total Closings", "Total Permits", "Total Net Sales", "Date Of First Closing", "Date Of Latest Closing"]);
  const handlBuilderClick = (e) => {
    setShow(true);
  };

  const HandleSortDetailClick = (e) => {
    setShowSort(true);
  }
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

  const applyFilters = () => {
    debugger
    const isAnyFilterApplied = Object.values(filterQueryCalculation).some(query => query !== "");

    if(AllBuilderListExport.length === 0) {
      setBuilderList(BuilderList);
      return;
    }

    let filtered = AllBuilderListExport;

    const applyNumberFilter = (items, query, key) => {
      if (query) {
        let operator = '=';
        let value = query;

        if (query.startsWith('>') || query.startsWith('<') || query.startsWith('=')) {
          operator = query[0];
          value = query.slice(1);
        }

        const numberValue = parseFloat(value);
        if (!isNaN(numberValue)) {
          return items.filter(item => {
            const itemValue = parseFloat(item[key]);
            if (operator === '>') return itemValue > numberValue;
            if (operator === '<') return itemValue < numberValue;
            return itemValue === numberValue;
          });
        }
      }
      return items;
    };

    filtered = applyNumberFilter(filtered, filterQueryCalculation.closing_this_year, 'closing_this_year');
    filtered = applyNumberFilter(filtered, filterQueryCalculation.permits_this_year, 'permits_this_year');
    filtered = applyNumberFilter(filtered, filterQueryCalculation.net_sales_this_year, 'net_sales_this_year');
    filtered = applyNumberFilter(filtered, filterQueryCalculation.current_avg_base_Price, 'current_avg_base_Price');
    filtered = applyNumberFilter(filtered, filterQueryCalculation.avg_net_sales_per_month_this_year, 'avg_net_sales_per_month_this_year');
    filtered = applyNumberFilter(filtered, filterQueryCalculation.avg_closings_per_month_this_year, 'avg_closings_per_month_this_year');
    filtered = applyNumberFilter(filtered, filterQueryCalculation.total_closings, 'total_closings');
    filtered = applyNumberFilter(filtered, filterQueryCalculation.total_permits, 'total_permits');
    filtered = applyNumberFilter(filtered, filterQueryCalculation.median_closing_price_last_year, 'median_closing_price_last_year');
    filtered = applyNumberFilter(filtered, filterQueryCalculation.median_closing_price_this_year, 'median_closing_price_this_year');
    filtered = applyNumberFilter(filtered, filterQueryCalculation.total_net_sales, 'total_net_sales');
    filtered = applyNumberFilter(filtered, filterQueryCalculation.date_of_first_closing, 'date_of_first_closing');
    filtered = applyNumberFilter(filtered, filterQueryCalculation.date_of_latest_closing, 'date_of_latest_closing');    

    if (isAnyFilterApplied) {
      setBuilderList(filtered.slice(0, 100));
      setFilter(true);
      setNormalFilter(false);
    } else {
      setBuilderList(filtered.slice(0, 100));
      setCurrentPage(1);
      setFilter(false);
      setNormalFilter(false);
    }
    setActiveCommunitiesOption("");
    setClosingThisYearOption("");
    setPermitsThisYearOption("");
    setNetSalesThisYearOption("");
    setCurrentAvgBasePriceOption("");
    setMedianClosingPriceThisYearOption("");
    setMedianClosingPriceLastYearOption("");
    setAvgNetSalesPerMonthThisYearOption("");
    setAvgClosingsPerMonthThisYearOption("");
    setTotalClosingsOption("");
    setTotalPermitsOption("");
    setTotalNetSalesOption("");
    setActiveCommunitiesResult(0);
    setClosingThisYearResult(0);
    setPermitsThisYearResult(0);
    setNetSalesThisYearResult(0);
    setCurrentAvgBasePriceResult(0);
    setMedianClosingPriceThisYearResult(0);
    setMedianClosingPriceLastYearResult(0);
    setAvgNetSalesPerMonthThisYearResult(0);
    setAvgClosingsPerMonthThisYearResult(0);
    setTotalClosingsResult(0);
    setTotalPermitsResult(0);
    setTotalNetSalesResult(0);
  };

  useEffect(() => {
    applyFilters();
  }, [filterQueryCalculation]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(value);
    setFilterQueryCalculation(prevFilterQuery => ({
      ...prevFilterQuery,
      [name]: value
    }));
    setFilter(true);
  };

  const totalSumFields = (field) => {
    debugger
    if(field == "active_communities") {
      if(filter){
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.active_communities || 0);
        }, 0);
      } else {
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.active_communities || 0);
        }, 0);
      }
    }
    if(field == "closing_this_year") {
      if(filter){
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.closing_this_year || 0);
        }, 0);
      } else {
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.closing_this_year || 0);
        }, 0);
      }
    }
    if(field == "permits_this_year") {
      if(filter){
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.permits_this_year || 0);
        }, 0);
      } else{
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.permits_this_year || 0);
        }, 0);
      }
    }
    if(field == "net_sales_this_year") {
      if(filter){
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.net_sales_this_year || 0);
        }, 0);
      } else {
          return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.net_sales_this_year || 0);
        }, 0);
      }
    }
    if(field == "current_avg_base_Price") {
      if(filter){
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.current_avg_base_Price || 0);
        }, 0);
      } else {
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.current_avg_base_Price || 0);
        }, 0);
      }
    }
    if(field == "median_closing_price_this_year") {
      if(filter){
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.median_closing_price_this_year || 0);
        }, 0);
      } else {
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.median_closing_price_this_year || 0);
        }, 0);
      }
    }
    if(field == "median_closing_price_last_year") {
      if(filter){
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.median_closing_price_last_year || 0);
        }, 0);
      } else {
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.median_closing_price_last_year || 0);
        }, 0);
      }
    }
    if(field == "avg_net_sales_per_month_this_year") {
      if(filter){
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.avg_net_sales_per_month_this_year || 0);
        }, 0);
      } else {
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.avg_net_sales_per_month_this_year || 0);
        }, 0);
      }
    }
    if(field == "avg_closings_per_month_this_year") {
      if(filter){
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.avg_closings_per_month_this_year || 0);
        }, 0);
      } else {
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.avg_closings_per_month_this_year || 0);
        }, 0);
      }
    }
    if(field == "total_closings") {
      if(filter){
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.total_closings || 0);
        }, 0);
      } else {
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.total_closings || 0);
        }, 0);
      }
    }
    if(field == "total_permits") {
      if(filter){
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.total_permits || 0);
        }, 0);
      } else {
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.total_permits || 0);
        }, 0);
      }
    }
    if(field == "total_net_sales") {
      if(filter){
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.total_net_sales || 0);
        }, 0);
      } else {
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.total_net_sales || 0);
        }, 0);
      }
    }
  };

  const averageFields = (field) => {
    debugger
    const sum = totalSumFields(field);
    if(filter){
      return sum / BuilderList.length;
    } else {
      return sum / AllBuilderListExport.length;
    }
  };

  const handleSelectChange = (e, field) => {
    const value = e.target.value;

    switch (field) {
      case "active_communities":
        setActiveCommunitiesOption(value);
        setClosingThisYearOption("");
        setPermitsThisYearOption("");
        setNetSalesThisYearOption("");
        setCurrentAvgBasePriceOption("");
        setMedianClosingPriceThisYearOption("");
        setMedianClosingPriceLastYearOption("");
        setAvgNetSalesPerMonthThisYearOption("");
        setAvgClosingsPerMonthThisYearOption("");
        setTotalClosingsOption("");
        setTotalPermitsOption("");
        setTotalNetSalesOption("");

        setClosingThisYearResult(0);
        setPermitsThisYearResult(0);
        setNetSalesThisYearResult(0);
        setCurrentAvgBasePriceResult(0);
        setMedianClosingPriceThisYearResult(0);
        setMedianClosingPriceLastYearResult(0);
        setAvgNetSalesPerMonthThisYearResult(0);
        setAvgClosingsPerMonthThisYearResult(0);
        setTotalClosingsResult(0);
        setTotalPermitsResult(0);
        setTotalNetSalesResult(0);

        if (value === 'sum') {
          setActiveCommunitiesResult(totalSumFields(field));
        } else if (value === 'avg') {
          setActiveCommunitiesResult(averageFields(field));
        }
        break;

      case "closing_this_year":
        setClosingThisYearOption(value);
        setActiveCommunitiesOption("");
        setPermitsThisYearOption("");
        setNetSalesThisYearOption("");
        setCurrentAvgBasePriceOption("");
        setMedianClosingPriceThisYearOption("");
        setMedianClosingPriceLastYearOption("");
        setAvgNetSalesPerMonthThisYearOption("");
        setAvgClosingsPerMonthThisYearOption("");
        setTotalClosingsOption("");
        setTotalPermitsOption("");
        setTotalNetSalesOption("");

        setActiveCommunitiesResult(0);
        setPermitsThisYearResult(0);
        setNetSalesThisYearResult(0);
        setCurrentAvgBasePriceResult(0);
        setMedianClosingPriceThisYearResult(0);
        setMedianClosingPriceLastYearResult(0);
        setAvgNetSalesPerMonthThisYearResult(0);
        setAvgClosingsPerMonthThisYearResult(0);
        setTotalClosingsResult(0);
        setTotalPermitsResult(0);
        setTotalNetSalesResult(0);

        if (value === 'sum') {
          setClosingThisYearResult(totalSumFields(field));
        } else if (value === 'avg') {
          setClosingThisYearResult(averageFields(field));
        }
        break;

      case "permits_this_year":
        setPermitsThisYearOption(value);
        setActiveCommunitiesOption("");
        setClosingThisYearOption("");
        setNetSalesThisYearOption("");
        setCurrentAvgBasePriceOption("");
        setMedianClosingPriceThisYearOption("");
        setMedianClosingPriceLastYearOption("");
        setAvgNetSalesPerMonthThisYearOption("");
        setAvgClosingsPerMonthThisYearOption("");
        setTotalClosingsOption("");
        setTotalPermitsOption("");
        setTotalNetSalesOption("");

        setActiveCommunitiesResult(0);
        setClosingThisYearResult(0);
        setNetSalesThisYearResult(0);
        setCurrentAvgBasePriceResult(0);
        setMedianClosingPriceThisYearResult(0);
        setMedianClosingPriceLastYearResult(0);
        setAvgNetSalesPerMonthThisYearResult(0);
        setAvgClosingsPerMonthThisYearResult(0);
        setTotalClosingsResult(0);
        setTotalPermitsResult(0);
        setTotalNetSalesResult(0);

        if (value === 'sum') {
          setPermitsThisYearResult(totalSumFields(field));
        } else if (value === 'avg') {
          setPermitsThisYearResult(averageFields(field));
        }
        break;

      case "net_sales_this_year":
        setNetSalesThisYearOption(value);
        setActiveCommunitiesOption("");
        setClosingThisYearOption("");
        setPermitsThisYearOption("");
        setCurrentAvgBasePriceOption("");
        setMedianClosingPriceThisYearOption("");
        setMedianClosingPriceLastYearOption("");
        setAvgNetSalesPerMonthThisYearOption("");
        setAvgClosingsPerMonthThisYearOption("");
        setTotalClosingsOption("");
        setTotalPermitsOption("");
        setTotalNetSalesOption("");

        setActiveCommunitiesResult(0);
        setClosingThisYearResult(0);
        setPermitsThisYearResult(0);
        setCurrentAvgBasePriceResult(0);
        setMedianClosingPriceThisYearResult(0);
        setMedianClosingPriceLastYearResult(0);
        setAvgNetSalesPerMonthThisYearResult(0);
        setAvgClosingsPerMonthThisYearResult(0);
        setTotalClosingsResult(0);
        setTotalPermitsResult(0);
        setTotalNetSalesResult(0);

        if (value === 'sum') {
          setNetSalesThisYearResult(totalSumFields(field));
        } else if (value === 'avg') {
          setNetSalesThisYearResult(averageFields(field));
        }
        break;

      case "current_avg_base_Price":
        setCurrentAvgBasePriceOption(value);
        setActiveCommunitiesOption("");
        setClosingThisYearOption("");
        setPermitsThisYearOption("");
        setNetSalesThisYearOption("");
        setMedianClosingPriceThisYearOption("");
        setMedianClosingPriceLastYearOption("");
        setAvgNetSalesPerMonthThisYearOption("");
        setAvgClosingsPerMonthThisYearOption("");
        setTotalClosingsOption("");
        setTotalPermitsOption("");
        setTotalNetSalesOption("");

        setActiveCommunitiesResult(0);
        setClosingThisYearResult(0);
        setPermitsThisYearResult(0);
        setNetSalesThisYearResult(0);
        setMedianClosingPriceThisYearResult(0);
        setMedianClosingPriceLastYearResult(0);
        setAvgNetSalesPerMonthThisYearResult(0);
        setAvgClosingsPerMonthThisYearResult(0);
        setTotalClosingsResult(0);
        setTotalPermitsResult(0);
        setTotalNetSalesResult(0);

        if (value === 'sum') {
          setCurrentAvgBasePriceResult(totalSumFields(field));
        } else if (value === 'avg') {
          setCurrentAvgBasePriceResult(averageFields(field));
        }
        break;

      case "median_closing_price_this_year":
        setMedianClosingPriceThisYearOption(value);
        setActiveCommunitiesOption("");
        setClosingThisYearOption("");
        setPermitsThisYearOption("");
        setNetSalesThisYearOption("");
        setCurrentAvgBasePriceOption("");
        setMedianClosingPriceLastYearOption("");
        setAvgNetSalesPerMonthThisYearOption("");
        setAvgClosingsPerMonthThisYearOption("");
        setTotalClosingsOption("");
        setTotalPermitsOption("");
        setTotalNetSalesOption("");

        setActiveCommunitiesResult(0);
        setClosingThisYearResult(0);
        setPermitsThisYearResult(0);
        setNetSalesThisYearResult(0);
        setCurrentAvgBasePriceResult(0);
        setMedianClosingPriceLastYearResult(0);
        setAvgNetSalesPerMonthThisYearResult(0);
        setAvgClosingsPerMonthThisYearResult(0);
        setTotalClosingsResult(0);
        setTotalPermitsResult(0);
        setTotalNetSalesResult(0);

        if (value === 'sum') {
          setMedianClosingPriceThisYearResult(totalSumFields(field));
        } else if (value === 'avg') {
          setMedianClosingPriceThisYearResult(averageFields(field));
        }
        break;
      case "median_closing_price_last_year":
        setMedianClosingPriceLastYearOption(value);
        setActiveCommunitiesOption("");
        setClosingThisYearOption("");
        setPermitsThisYearOption("");
        setNetSalesThisYearOption("");
        setCurrentAvgBasePriceOption("");
        setMedianClosingPriceThisYearOption("");
        setAvgNetSalesPerMonthThisYearOption("");
        setAvgClosingsPerMonthThisYearOption("");
        setTotalClosingsOption("");
        setTotalPermitsOption("");
        setTotalNetSalesOption("");

        setActiveCommunitiesResult(0);
        setClosingThisYearResult(0);
        setPermitsThisYearResult(0);
        setNetSalesThisYearResult(0);
        setCurrentAvgBasePriceResult(0);
        setMedianClosingPriceThisYearResult(0);
        setAvgNetSalesPerMonthThisYearResult(0);
        setAvgClosingsPerMonthThisYearResult(0);
        setTotalClosingsResult(0);
        setTotalPermitsResult(0);
        setTotalNetSalesResult(0);

        if (value === 'sum') {
          setMedianClosingPriceLastYearResult(totalSumFields(field));
        } else if (value === 'avg') {
          setMedianClosingPriceLastYearResult(averageFields(field));
        }
        break;
      case "avg_net_sales_per_month_this_year":
        setAvgNetSalesPerMonthThisYearOption(value);
        setActiveCommunitiesOption("");
        setClosingThisYearOption("");
        setPermitsThisYearOption("");
        setNetSalesThisYearOption("");
        setCurrentAvgBasePriceOption("");
        setMedianClosingPriceThisYearOption("");
        setMedianClosingPriceLastYearOption("");
        setAvgClosingsPerMonthThisYearOption("");
        setTotalClosingsOption("");
        setTotalPermitsOption("");
        setTotalNetSalesOption("");

        setActiveCommunitiesResult(0);
        setClosingThisYearResult(0);
        setPermitsThisYearResult(0);
        setNetSalesThisYearResult(0);
        setCurrentAvgBasePriceResult(0);
        setMedianClosingPriceThisYearResult(0);
        setMedianClosingPriceLastYearResult(0);
        setAvgClosingsPerMonthThisYearResult(0);
        setTotalClosingsResult(0);
        setTotalPermitsResult(0);
        setTotalNetSalesResult(0);

        if (value === 'sum') {
          setAvgNetSalesPerMonthThisYearResult(totalSumFields(field));
        } else if (value === 'avg') {
          setAvgNetSalesPerMonthThisYearResult(averageFields(field));
        }
        break;
      case "avg_closings_per_month_this_year":
        setAvgClosingsPerMonthThisYearOption(value);
        setActiveCommunitiesOption("");
        setClosingThisYearOption("");
        setPermitsThisYearOption("");
        setNetSalesThisYearOption("");
        setCurrentAvgBasePriceOption("");
        setMedianClosingPriceThisYearOption("");
        setMedianClosingPriceLastYearOption("");
        setAvgNetSalesPerMonthThisYearOption("");
        setTotalClosingsOption("");
        setTotalPermitsOption("");
        setTotalNetSalesOption("");

        setActiveCommunitiesResult(0);
        setClosingThisYearResult(0);
        setPermitsThisYearResult(0);
        setNetSalesThisYearResult(0);
        setCurrentAvgBasePriceResult(0);
        setMedianClosingPriceThisYearResult(0);
        setMedianClosingPriceLastYearResult(0);
        setAvgNetSalesPerMonthThisYearResult(0);
        setTotalClosingsResult(0);
        setTotalPermitsResult(0);
        setTotalNetSalesResult(0);

        if (value === 'sum') {
          setAvgClosingsPerMonthThisYearResult(totalSumFields(field));
        } else if (value === 'avg') {
          setAvgClosingsPerMonthThisYearResult(averageFields(field));
        }
        break;
      case "total_closings":
        setTotalClosingsOption(value);
        setActiveCommunitiesOption("");
        setClosingThisYearOption("");
        setPermitsThisYearOption("");
        setNetSalesThisYearOption("");
        setCurrentAvgBasePriceOption("");
        setMedianClosingPriceThisYearOption("");
        setMedianClosingPriceLastYearOption("");
        setAvgNetSalesPerMonthThisYearOption("");
        setAvgClosingsPerMonthThisYearOption("");
        setTotalPermitsOption("");
        setTotalNetSalesOption("");

        setActiveCommunitiesResult(0);
        setClosingThisYearResult(0);
        setPermitsThisYearResult(0);
        setNetSalesThisYearResult(0);
        setCurrentAvgBasePriceResult(0);
        setMedianClosingPriceThisYearResult(0);
        setMedianClosingPriceLastYearResult(0);
        setAvgNetSalesPerMonthThisYearResult(0);
        setAvgClosingsPerMonthThisYearResult(0);
        setTotalPermitsResult(0);
        setTotalNetSalesResult(0);

        if (value === 'sum') {
          setTotalClosingsResult(totalSumFields(field));
        } else if (value === 'avg') {
          setTotalClosingsResult(averageFields(field));
        }
        break;
      case "total_permits":
        setTotalPermitsOption(value);
        setActiveCommunitiesOption("");
        setClosingThisYearOption("");
        setPermitsThisYearOption("");
        setNetSalesThisYearOption("");
        setCurrentAvgBasePriceOption("");
        setMedianClosingPriceThisYearOption("");
        setMedianClosingPriceLastYearOption("");
        setAvgNetSalesPerMonthThisYearOption("");
        setAvgClosingsPerMonthThisYearOption("");
        setTotalClosingsOption("");
        setTotalNetSalesOption("");

        setActiveCommunitiesResult(0);
        setClosingThisYearResult(0);
        setPermitsThisYearResult(0);
        setNetSalesThisYearResult(0);
        setCurrentAvgBasePriceResult(0);
        setMedianClosingPriceThisYearResult(0);
        setMedianClosingPriceLastYearResult(0);
        setAvgNetSalesPerMonthThisYearResult(0);
        setAvgClosingsPerMonthThisYearResult(0);
        setTotalClosingsResult(0);
        setTotalNetSalesResult(0);

        if (value === 'sum') {
          setTotalPermitsResult(totalSumFields(field));
        } else if (value === 'avg') {
          setTotalPermitsResult(averageFields(field));
        }
        break;
      case "total_net_sales":
        setTotalNetSalesOption(value);
        setActiveCommunitiesOption("");
        setClosingThisYearOption("");
        setPermitsThisYearOption("");
        setNetSalesThisYearOption("");
        setCurrentAvgBasePriceOption("");
        setMedianClosingPriceThisYearOption("");
        setMedianClosingPriceLastYearOption("");
        setAvgNetSalesPerMonthThisYearOption("");
        setAvgClosingsPerMonthThisYearOption("");
        setTotalClosingsOption("");
        setTotalPermitsOption("");

        setActiveCommunitiesResult(0);
        setClosingThisYearResult(0);
        setPermitsThisYearResult(0);
        setNetSalesThisYearResult(0);
        setCurrentAvgBasePriceResult(0);
        setMedianClosingPriceThisYearResult(0);
        setMedianClosingPriceLastYearResult(0);
        setAvgNetSalesPerMonthThisYearResult(0);
        setAvgClosingsPerMonthThisYearResult(0);
        setTotalClosingsResult(0);
        setTotalPermitsResult(0);

        if (value === 'sum') {
          setTotalNetSalesResult(totalSumFields(field));
        } else if (value === 'avg') {
          setTotalNetSalesResult(averageFields(field));
        }
        break;
      default:
        break;
    }
  };

  console.log(filterQuery);

  const handleSelectBuilderNameChange = (selectedItems) => {
    console.log(selectedItems);

    const selectedValues = selectedItems.map(item => item.value);
    const selectedNames = selectedItems.map(item => item.label).join(', ');

    setSelectedValues(selectedValues);
    setSelectedBuilderName(selectedItems);
    setFilterQuery(prevState => ({
      ...prevState,
      name: selectedNames
    }));
    setNormalFilter(true);
  };

  const statusOptions = [
    { value: "1", label: "Yes" },
    { value: "0", label: "No" }
  ];

  const companyTypOptions = [
    { value: "Public", label: "Public" },
    { value: "Private", label: "Private" }
  ];

  const handleSelectStatusChange = (selectedItems) => {
    const selectedValues = selectedItems.map(item => item.value).join(', ');
    setSelectedValues(selectedValues);
    setSelectedStatus(selectedItems);
    setFilterQuery(prevState => ({
      ...prevState,
      is_active: selectedValues
    }));
    setNormalFilter(true);
  };

  const handleSelectCompanyTypeChange = (selectedItems) => {
    console.log(selectedItems);
    const selectedValues = selectedItems.map(item => item.value).join(', ');
    console.log(selectedValues);
    setSelectedCompanyType(selectedItems);
    setFilterQuery(prevState => ({
      ...prevState,
      company_type: selectedValues
    }));
    setNormalFilter(true);
  };

  console.log("filter", filter);

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

                    <div className="mt-3">
                      {SyestemUserRole == "Data Uploader" ||
                        SyestemUserRole == "User" || SyestemUserRole == "Standard User" ? (
                        ""
                      ) : (
                        <div className="d-flex">
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
                            onClick={() => builder.current.showEmployeModal()}
                          >
                            + Add Builder
                          </Link>
                          <Link
                            to={"#"}
                            className="btn btn-primary btn-sm ms-1"
                            data-bs-toggle="offcanvas"
                            onClick={() => bulkBuilder.current.showEmployeModal()}
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
                        className="table ItemsCheckboxSec dataTable"
                      >
                        <thead>
                          <tr style={{ textAlign: "center" }}>
                            <th>
                              <input
                                type="checkbox"
                                style={{
                                  cursor: "pointer",
                                }}
                                checked={selectedLandSales.length === BuilderList.length}
                                onChange={(e) =>
                                  e.target.checked
                                    ? setSelectedLandSales(BuilderList.map((user) => user.id))
                                    : setSelectedLandSales([])
                                }
                              />
                            </th>
                            <th>
                              <strong>No.</strong>
                            </th>
                            {columns.map((column) => (
                              <th style={{ textAlign: "center", cursor: "pointer" }} key={column.id} onClick={(e) => (column.id == "action" || column.id == "logo") ? "" : e.target.type !== "select-one" ? requestSort(
                                column.id == "active Communities" ? "active_communities" :
                                  column.id == "closing This Year" ? "closing_this_year" :
                                  column.id == "permits This Year" ? "permits_this_year" :
                                  column.id == "net Sales this year" ? "net_sales_this_year" :
                                  column.id == "current Avg Base Price" ? "current_avg_base_Price" :
                                  column.id == "median Closing Price This Year" ? "median_closing_price_this_year" :
                                  column.id == "median Closing Price Last Year" ? "median_closing_price_last_year" :
                                  column.id == "avg Net Sales Per Month This Year" ? "avg_net_sales_per_month_this_year" :
                                  column.id == "avg Closings Per Month This Year" ? "avg_closings_per_month_this_year" :
                                  column.id == "total Closings" ? "total_closings" :
                                  column.id == "total Permits" ? "total_permits" :
                                  column.id == "total Net Sales" ? "total_net_sales" :
                                  column.id == "date Of First Closing" ? "date_of_first_closing" :
                                  column.id == "date Of Latest Closing" ? "date_of_latest_closing" : toCamelCase(column.id)) : ""}>
                                <strong>
                                  {(column.id == "action" && (SyestemUserRole != "Data Uploader" || SyestemUserRole != "User")) ? "Action" : column.label}
                                  {column.id != "action" && sortConfig.some(
                                    (item) => item.key === (
                                      column.id == "active Communities" ? "active_communities" :
                                      column.id == "closing This Year" ? "closing_this_year" :
                                      column.id == "permits This Year" ? "permits_this_year" :
                                      column.id == "net Sales this year" ? "net_sales_this_year" :
                                      column.id == "current Avg Base Price" ? "current_avg_base_Price" :
                                      column.id == "median Closing Price This Year" ? "median_closing_price_this_year" :
                                      column.id == "median Closing Price Last Year" ? "median_closing_price_last_year" :
                                      column.id == "avg Net Sales Per Month This Year" ? "avg_net_sales_per_month_this_year" :
                                      column.id == "avg Closings Per Month This Year" ? "avg_closings_per_month_this_year" :
                                      column.id == "total Closings" ? "total_closings" :
                                      column.id == "total Permits" ? "total_permits" :
                                      column.id == "total Net Sales" ? "total_net_sales" :
                                      column.id == "date Of First Closing" ? "date_of_first_closing" :
                                      column.id == "date Of Latest Closing" ? "date_of_latest_closing" : toCamelCase(column.id))
                                  ) ? (
                                    <span>
                                      {column.id != "action" && sortConfig.find(
                                        (item) => item.key === (
                                          column.id == "active Communities" ? "active_communities" :
                                          column.id == "closing This Year" ? "closing_this_year" :
                                          column.id == "permits This Year" ? "permits_this_year" :
                                          column.id == "net Sales this year" ? "net_sales_this_year" :
                                          column.id == "current Avg Base Price" ? "current_avg_base_Price" :
                                          column.id == "median Closing Price This Year" ? "median_closing_price_this_year" :
                                          column.id == "median Closing Price Last Year" ? "median_closing_price_last_year" :
                                          column.id == "avg Net Sales Per Month This Year" ? "avg_net_sales_per_month_this_year" :
                                          column.id == "avg Closings Per Month This Year" ? "avg_closings_per_month_this_year" :
                                          column.id == "total Closings" ? "total_closings" :
                                          column.id == "total Permits" ? "total_permits" :
                                          column.id == "total Net Sales" ? "total_net_sales" :
                                          column.id == "date Of First Closing" ? "date_of_first_closing" :
                                          column.id == "date Of Latest Closing" ? "date_of_latest_closing" : toCamelCase(column.id))
                                      ).direction === "asc" ? "↑" : "↓"}
                                    </span>
                                  ) : ((column.id == "action" || column.id == "logo") ? "" : <span>↑↓</span>)
                                  }
                                </strong>
                                {(!excelLoading) && (column.id !== "action" && column.id !== "email Address" && column.id !== "__pkBuilderID" && column.id !== "name" && column.id !== "logo" && column.id !== "website" && column.id !== "phone" &&
                                  column.id !== "fax" && column.id !== "office Address 1" && column.id !== "office Address State" && column.id !== "city" && column.id !== "zipcode" &&
                                  column.id !== "company Type" && column.id !== "active" && column.id !== "stock Market" && column.id !== "current Division President" && column.id !== "stock Symbol" &&
                                  column.id !== "current Land Aquisitions" && column.id !== "coporate Office Address 1" && column.id !== "corporate Office Address State" && column.id !== "coporate Office Address City" && column.id !== "coporate office address zipcode" &&
                                  column.id !== "coporate Office Address latitude" && column.id !== "coporate Office Address longitude" && column.id !== "date Of First Closing" && column.id !== "date Of Latest Closing"
                                ) && (
                                    <>
                                      <select value={column.id == "active Communities" ? activeCommunitiesOption : column.id == "closing This Year" ? closingThisYearOption :
                                        column.id == "permits This Year" ? permitsThisYearOption : column.id == "net Sales this year" ? netSalesThisYearOption :
                                        column.id == "current Avg Base Price" ? currentAvgBasePriceOption : column.id == "median Closing Price This Year" ? medianClosingPriceThisYearOption :
                                        column.id == "median Closing Price Last Year" ? medianClosingPriceLastYearOption : column.id == "avg Net Sales Per Month This Year" ? avgNetSalesPerMonthThisYearOption :
                                        column.id == "avg Closings Per Month This Year" ? avgClosingsPerMonthThisYearOption : column.id == "total Closings" ? totalClosingsOption :
                                        column.id == "total Permits" ? totalPermitsOption : column.id == "total Net Sales" ? totalNetSalesOption : ""}
                                        style={{ cursor: "pointer", marginLeft: '10px' }}
                                        onChange={(e) => column.id == "active Communities" ? handleSelectChange(e, "active_communities") :
                                          column.id == "closing This Year" ? handleSelectChange(e, "closing_this_year") :
                                          column.id == "permits This Year" ? handleSelectChange(e, "permits_this_year") :
                                          column.id == "net Sales this year" ? handleSelectChange(e, "net_sales_this_year") :
                                          column.id == "current Avg Base Price" ? handleSelectChange(e, "current_avg_base_Price") :
                                          column.id == "median Closing Price This Year" ? handleSelectChange(e, "median_closing_price_this_year") :
                                          column.id == "median Closing Price Last Year" ? handleSelectChange(e, "median_closing_price_last_year") :
                                          column.id == "avg Net Sales Per Month This Year" ? handleSelectChange(e, "avg_net_sales_per_month_this_year") :
                                          column.id == "avg Closings Per Month This Year" ? handleSelectChange(e, "avg_closings_per_month_this_year") :
                                          column.id == "total Closings" ? handleSelectChange(e, "total_closings") :
                                          column.id == "total Permits" ? handleSelectChange(e, "total_permits") :
                                          column.id == "total Net Sales" ? handleSelectChange(e, "total_net_sales") : ""}>
                                        <option value="" disabled>CALCULATION</option>
                                        <option value="sum">Sum</option>
                                        <option value="avg">Avg</option>
                                      </select>
                                      <br />
                                    </>
                                  )}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {!excelLoading &&
                            <tr>
                              <td></td>
                              <td></td>
                              {columns.map((column) => (
                                <>
                                  {column.id == "__pkBuilderID" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "name" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "logo" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "website" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "phone" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "fax" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "office Address 1" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "office Address State" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "city" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "zipcode" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "company Type" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "active" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "stock Market" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "current Division President" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "stock Symbol" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "current Land Aquisitions" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "coporate Office Address 1" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "corporate Office Address State" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "coporate Office Address City" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "coporate office address zipcode" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "coporate Office Address latitude" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "coporate Office Address longitude" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "active Communities" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{activeCommunitiesResult.toFixed(2)}</td>
                                  }
                                  {column.id == "closing This Year" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{closingThisYearResult.toFixed(2)}</td>
                                  }
                                  {column.id == "permits This Year" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{permitsThisYearResult.toFixed(2)}</td>
                                  }
                                  {column.id == "net Sales this year" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{netSalesThisYearResult.toFixed(2)}</td>
                                  }
                                  {column.id == "current Avg Base Price" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{currentAvgBasePriceResult.toFixed(2)}</td>
                                  }
                                  {column.id == "median Closing Price This Year" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{medianClosingPriceThisYearResult.toFixed(2)}</td>
                                  }
                                  {column.id == "median Closing Price Last Year" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{medianClosingPriceLastYearResult.toFixed(2)}</td>
                                  }
                                  {column.id == "avg Net Sales Per Month This Year" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{avgNetSalesPerMonthThisYearResult.toFixed(2)}</td>
                                  }
                                  {column.id == "avg Closings Per Month This Year" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{avgClosingsPerMonthThisYearResult.toFixed(2)}</td>
                                  }
                                  {column.id == "total Closings" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{totalClosingsResult.toFixed(2)}</td>
                                  }
                                  {column.id == "total Permits" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{totalPermitsResult.toFixed(2)}</td>
                                  }
                                  {column.id == "total Net Sales" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{totalNetSalesResult.toFixed(2)}</td>
                                  }
                                  {column.id == "date Of First Closing" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "date Of Latest Closing" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "email Address" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "action" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                </>
                              ))}
                            </tr>}
                          {BuilderList !== null && BuilderList.length > 0 ? (
                            BuilderList.map((element, index) => (
                              <tr
                                onClick={(e) => {
                                  if (e.target.type !== "checkbox") {
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
                                    {column.id == "__pkBuilderID" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.builder_code}</td>
                                    }
                                    {column.id == "name" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.name}</td>
                                    }
                                    {column.id == "logo" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>
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
                                    }
                                    {column.id == "website" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.website}</td>
                                    }
                                    {column.id == "phone" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.phone}</td>
                                    }
                                    {column.id == "fax" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.fax}</td>
                                    }
                                    {column.id == "office Address 1" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.officeaddress1}</td>
                                    }
                                    {column.id == "office Address State" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.officeaddress2}</td>
                                    }
                                    {column.id == "city" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.city}</td>
                                    }
                                    {column.id == "zipcode" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.zipcode}</td>
                                    }
                                    {column.id == "company Type" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.company_type}</td>
                                    }
                                    {column.id == "active" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.is_active}</td>
                                    }
                                    {column.id == "stock Market" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.stock_market}</td>
                                    }
                                    {column.id == "current Division President" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.current_division_president}</td>
                                    }
                                    {column.id == "stock Symbol" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.stock_symbol}</td>
                                    }
                                    {column.id == "current Land Aquisitions" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.current_land_aquisitions}</td>
                                    }
                                    {column.id == "coporate Office Address 1" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.coporate_officeaddress_1}</td>
                                    }
                                    {column.id == "corporate Office Address State" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.coporate_officeaddress_2}</td>
                                    }
                                    {column.id == "coporate Office Address City" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.coporate_officeaddress_city}</td>
                                    }
                                    {column.id == "coporate office address zipcode" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.coporate_officeaddress_zipcode}</td>
                                    }
                                    {column.id == "coporate Office Address latitude" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.coporate_officeaddress_lat}</td>
                                    }
                                    {column.id == "coporate Office Address longitude" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.coporate_officeaddress_lng}</td>
                                    }
                                    {column.id == "active Communities" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.active_communities}</td>
                                    }
                                    {column.id == "closing This Year" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.closing_this_year}</td>
                                    }
                                    {column.id == "permits This Year" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.permits_this_year}</td>
                                    }
                                    {column.id == "net Sales this year" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.net_sales_this_year}</td>
                                    }
                                    {column.id == "current Avg Base Price" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{<PriceComponent price={element.current_avg_base_Price} />}</td>
                                    }
                                    {column.id == "median Closing Price This Year" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{<PriceComponent price={element.median_closing_price_this_year} />}</td>
                                    }
                                    {column.id == "median Closing Price Last Year" &&
                                      <td key={column.id} style={{ textAlign: "center" }}> {<PriceComponent price={element.median_closing_price_last_year} />}</td>
                                    }
                                    {column.id == "avg Net Sales Per Month This Year" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.avg_net_sales_per_month_this_year}</td>
                                    }
                                    {column.id == "avg Closings Per Month This Year" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.avg_closings_per_month_this_year.toFixed(2)}</td>
                                    }
                                    {column.id == "total Closings" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.total_closings}</td>
                                    }
                                    {column.id == "total Permits" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.total_permits}</td>
                                    }
                                    {column.id == "total Net Sales" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.total_net_sales}</td>
                                    }
                                    {column.id == "date Of First Closing" &&
                                      <td key={column.id} style={{ textAlign: "center" }}><DateComponent date={element.date_of_first_closing} /></td>
                                    }
                                    {column.id == "date Of Latest Closing" &&
                                      <td key={column.id} style={{ textAlign: "center" }}><DateComponent date={element.date_of_latest_closing} /></td>
                                    }
                                    {column.id == "email Address" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.email_address}</td>
                                    }
                                    {column.id == "action" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>
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
      {SyestemUserRole == "Data Uploader" || SyestemUserRole == "User" ? (
        ""
      ) : (
        <>
          <BuilderOffcanvas
            ref={builder}
            Title="Add Builder"
            parentCallback={handleCallback}
          />
          <BulkBuilderUpdate
            ref={bulkBuilder}
            Title="Bulk Edit Builders"
            parentCallback={handleCallback}
            selectedLandSales={selectedLandSales}
          />
        </>
      )}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Import Builder CSV Data</Modal.Title>
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
                      <span>{exportColumns.find(column => column.key === col.key)?.label}</span>:<span>{col.direction}</span>
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
            onClick={() => { setShowOffcanvas(false); clearBuilderDetails(); }}
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
                      <div className="d-flex">
                        <div style={{ width: "65%" }}>

                          <div className="d-flex">
                            <div>
                              <label>Logo</label>
                              <div className="dz-default dlab-message upload-img mb-3">
                                <div style={{ width: "150px", height: "150px" }}>
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
                            <div>
                              <span className="fw-bold" style={{ fontSize: "30px", marginLeft: "0px" }}>
                                {BuilderDetails.name || "NA"}
                              </span>
                              <br />
                              <span style={{ fontSize: "20px", marginLeft: "0px" }}>
                                {BuilderDetails.website || "NA"}
                              </span>
                              <br />
                              <span style={{ fontSize: "14px", marginLeft: "0px" }}>
                                {BuilderDetails.email_address || "NA"}
                              </span>
                            </div>
                          </div>

                          <div className="d-block">
                            <label><b>LV OFFICE PHONE:</b> &nbsp; {BuilderDetails.phone || "NA"}</label><br />
                            <div className="d-flex">
                              <div>
                                <label><b>LV OFFICE ADDRESS:</b></label>
                              </div>
                              &nbsp;
                              <div>
                                <span>{BuilderDetails.officeaddress1 || "NA"}<br /> {BuilderDetails.city || "NA"}<br /> {BuilderDetails.zipcode || "NA"}</span>
                              </div>
                            </div>

                            <hr style={{ borderTop: "2px solid black", width: "70%" }}></hr>

                            <label><b>COMPANY TYPE:</b> &nbsp; {BuilderDetails.company_type || "NA"}</label><br />
                            <label><b>STOCK MARKET:</b> &nbsp; {BuilderDetails.stock_market || "NA"}</label><br />
                            <label><b>STOCK SYMBOL:</b> &nbsp; {BuilderDetails.stock_symbol || "NA"}</label><br />
                            <div>
                              <label style={{ marginBottom: "0px" }}><b>CORPORATE OFFICE:</b></label>
                              <div style={{ marginLeft: "30px" }}>
                                <span>{BuilderDetails.coporate_officeaddress_1 || "NA"}</span><br />
                                <span>{BuilderDetails.coporate_officeaddress_city || "NA"}, {BuilderDetails.coporate_officeaddress_2 || "NA"}</span><br />
                                <span>{BuilderDetails.coporate_officeaddress_zipcode || "NA"}</span>
                              </div>
                            </div>

                            <hr style={{ borderTop: "2px solid black", width: "70%" }}></hr>

                            <div>
                              <label style={{ marginBottom: "0px" }}><b>CURRENT DIVISION PERSIDENT:</b></label><br />
                              <span style={{ marginLeft: "15px" }}>{BuilderDetails.current_division_president || "NA"}</span>
                            </div>
                            <div style={{ marginTop: "10px" }}>
                              <label style={{ marginBottom: "0px" }}><b>CURRENT LAND AQUISITIONS:</b></label><br />
                              <span style={{ marginLeft: "15px" }}>{BuilderDetails.current_land_aquisitions || "NA"}</span>
                            </div>

                          </div>
                        </div>

                        <div style={{ width: "35%" }}>

                          <div style={{ textAlign: "center", fontSize: "20px" }}>
                            <label style={{ textAlign: "center", fontSize: "20px" }}><b><span>ACTIVE</span><br /><span style={{ marginTop: "0px" }}>COMMUNITIES</span></b></label>
                            <div style={{ border: "1px solid black", width: "40px", marginLeft: "110px" }}>
                              <span>{BuilderDetails.active_communities || "NA"}</span>
                            </div>
                          </div>

                          <div style={{ marginTop: "10px", width: "300px" }}>
                            <label style={{ fontSize: "18px" }}><b>CURRENT AVG BASE ASKING $:</b></label>
                            <span style={{ marginLeft: "100px" }}>$000,000</span>
                          </div>

                          <div style={{ border: "1px solid black", marginTop: "10px" }}>
                            <div style={{ marginLeft: "5px" }}>
                              <label style={{ marginBottom: "0px" }}><b>THIS YEAR:</b></label><br />
                              <label style={{ marginLeft: "15px" }}>NET SALES:&nbsp;{BuilderDetails.net_sales_this_year || "NA"}</label><br />
                              <label style={{ marginLeft: "15px" }}>PERMITS:&nbsp;{BuilderDetails.permits_this_year || "NA"}</label><br />
                              <label style={{ marginLeft: "15px" }}>CLOSINGS:&nbsp;{BuilderDetails.closing_this_year || "NA"}</label><br />
                              <label style={{ marginLeft: "15px" }}>MED. CLOSINGS $:&nbsp;{<PriceComponent price={BuilderDetails.median_closing_price_this_year} /> || "NA"}</label><br />
                              <label style={{ marginLeft: "15px" }}>NET SALES PER MO:&nbsp;{BuilderDetails.avg_net_sales_per_month_this_year || "NA"}</label><br />
                              <label style={{ marginLeft: "15px" }}>CLOSINGS PER MO:&nbsp;{BuilderDetails.avg_closings_per_month_this_year || "NA"}</label><br />

                              <label style={{ marginBottom: "0px" }}><b>LAST YEAR:</b></label><br />
                              <label style={{ marginLeft: "15px" }}>MED. CLOSINGS $:&nbsp;{<PriceComponent price={BuilderDetails.median_closing_price_last_year} /> || "NA"}</label><br />

                              <label style={{ marginBottom: "0px" }}><b>TOTAL:</b></label><br />
                              <label style={{ marginLeft: "15px" }}>NET SALES:&nbsp;{BuilderDetails.total_net_sales || "NA"}</label><br />
                              <label style={{ marginLeft: "15px" }}>PERMITS:&nbsp;{BuilderDetails.total_permits || "NA"}</label><br />
                              <label style={{ marginLeft: "15px" }}>CLOSINGS:&nbsp;{BuilderDetails.total_closings || "NA"}</label><br />
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

      <Offcanvas
        show={manageFilterOffcanvas}
        onHide={setManageFilterOffcanvas}
        className="offcanvas-end customeoff"
        placement="end"
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="modal-title" id="#gridSystemModal">
            Filter Builder{" "}
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
                  <div className="col-md-4 mt-3">
                    <label className="form-label">
                      BUILDER NAME:{" "}
                      <span className="text-danger"></span>
                    </label>
                    <Form.Group controlId="tournamentList">
                      <MultiSelect
                        name="name"
                        options={builderListDropDown}
                        value={selectedBuilderName}
                        onChange={handleSelectBuilderNameChange}
                        placeholder={"Select Builder Name"}
                      />
                    </Form.Group>
                  </div>
                  <div className="col-md-4 mt-3">
                    <label className="form-label">
                      ACTIVE:{" "}
                      <span className="text-danger"></span>
                    </label>
                    <MultiSelect
                      name="is_active"
                      options={statusOptions}
                      value={selectedStatus}
                      onChange={handleSelectStatusChange}
                      placeholder={"Select Status"}
                    />
                  </div>
                  <div className="col-md-4 mt-3">
                    <label className="form-label">
                      ACTIVE COMMUNITIES :{" "}
                      <span className="text-danger"></span>
                    </label>

                    <input type="number" value={filterQuery.active_communities} name="active_communities" className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-4 mt-3">
                    <label className="form-label">
                      COMPANY TYPE:{" "}
                      <span className="text-danger"></span>
                    </label>

                    <MultiSelect
                      name="company_type"
                      options={companyTypOptions}
                      value={selectedCompanyType}
                      onChange={handleSelectCompanyTypeChange}
                      placeholder={"Select Company Type"}
                    />
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
            <br />
            {excelLoading ? <div style={{ textAlign: "center" }}><ClipLoader color="#4474fc" /></div> :
              <>
                <h5 className="">Calculation Filter Options</h5>
                <div className="border-top">
                  <div className="row">
                    <div className="col-md-4 mt-3 mb-3">
                      <label className="form-label">CLOSINGS THIS YEAR:{" "}</label>
                      <input value={filterQueryCalculation.closing_this_year} name="closing_this_year" className="form-control" onChange={handleInputChange} />
                    </div>
                    <div className="col-md-4 mt-3 mb-3">
                      <label className="form-label">PERMITS THIS YEAR:{" "}</label>
                      <input value={filterQueryCalculation.permits_this_year} name="permits_this_year" className="form-control" onChange={handleInputChange} />
                    </div>
                    <div className="col-md-4 mt-3 mb-3">
                      <label className="form-label">NET SALES THIS YEAR:{" "}</label>
                      <input value={filterQueryCalculation.net_sales_this_year} name="net_sales_this_year" className="form-control" onChange={handleInputChange} />
                    </div>
                    <div className="col-md-4 mt-3 mb-3">
                      <label className="form-label">CURRENT AVG BASE PRICE:{" "}</label>
                      <input style={{ marginTop: "20px" }} value={filterQueryCalculation.current_avg_base_Price} name="current_avg_base_Price" className="form-control" onChange={handleInputChange} />
                    </div>
                    <div className="col-md-4 mt-3 mb-3">
                      <label className="form-label">AVG NET SALES PER MONTH THIS YEAR:{" "}</label>
                      <br />
                      <input value={filterQueryCalculation.avg_net_sales_per_month_this_year} name="avg_net_sales_per_month_this_year" className="form-control" onChange={handleInputChange} />
                    </div>
                    <div className="col-md-4 mt-3 mb-3">
                      <label className="form-label">AVG CLOSINGS PER MONTH THIS YEAR:{" "}</label>
                      <input value={filterQueryCalculation.avg_closings_per_month_this_year} name="avg_closings_per_month_this_year" className="form-control" onChange={handleInputChange} />
                    </div>
                    <div className="col-md-4 mt-3 mb-3">
                      <label className="form-label">MEDIAN CLOSING PRICE THIS YEAR:{" "}</label>
                      <input value={filterQueryCalculation.median_closing_price_this_year} name="median_closing_price_this_year" className="form-control" onChange={handleInputChange} />
                    </div>
                    <div className="col-md-4 mt-3 mb-3">
                      <label className="form-label">MEDIAN CLOSING PRICE LAST YEAR:{" "}</label>
                      <input value={filterQueryCalculation.median_closing_price_last_year} name="median_closing_price_last_year" className="form-control" onChange={handleInputChange} />
                    </div>
                    <div className="col-md-4 mt-3 mb-3">
                      <label className="form-label">TOTAL CLOSINGS:{" "}</label>
                      <input value={filterQueryCalculation.total_closings} name="total_closings" className="form-control" onChange={handleInputChange} />
                    </div>
                    <div className="col-md-4 mt-3 mb-3">
                      <label className="form-label">TOTAL PERMITS:{" "}</label>
                      <input value={filterQueryCalculation.total_permits} name="total_permits" className="form-control" onChange={handleInputChange} />
                    </div>
                    <div className="col-md-4 mt-3 mb-3">
                      <label className="form-label">TOTAL NET SALES :{" "}</label>
                      <input value={filterQueryCalculation.total_net_sales} name="total_net_sales" className="form-control" onChange={handleInputChange} />
                    </div>
                    <div className="col-md-4 mt-3 mb-3">
                      <label className="form-label">DATE OF FIRST CLOSING  :{" "}</label>
                      <input value={filterQueryCalculation.date_of_first_closing} name="date_of_first_closing" className="form-control" onChange={handleInputChange} />
                    </div>
                    <div className="col-md-4 mt-3 mb-3">
                      <label className="form-label">DATE OF LATEST CLOSING  :{" "}</label>
                      <input value={filterQueryCalculation.date_of_latest_closing} name="date_of_latest_closing" className="form-control" onChange={handleInputChange} />
                    </div>
                  </div>
                </div>
              </>}
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
                {colSeq.map((col, index) => (
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
