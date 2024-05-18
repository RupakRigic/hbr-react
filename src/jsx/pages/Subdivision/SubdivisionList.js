import React, { useState, useRef, useEffect,useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import AdminSubdevisionService from "../../../API/Services/AdminService/AdminSubdevisionService";
import SubdivisionOffcanvas from "./SubdivisionOffcanvas";
import MainPagetitle from "../../layouts/MainPagetitle";
import { Offcanvas, Form } from "react-bootstrap";
import AdminBuilderService from "../../../API/Services/AdminService/AdminBuilderService";
import { debounce } from "lodash";
import { DownloadTableExcel, downloadExcel } from 'react-export-table-to-excel';
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
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
import PriceComponent from "../../components/Price/PriceComponent";
import { Row, Col, Card } from 'react-bootstrap';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import BulkSubdivisionUpdate from "./BulkSubdivisionUpdate";


const SubdivisionList = () => {

  const handleSortCheckboxChange = (e, key) => {
    if (e.target.checked) {
        setSelectedCheckboxes(prev => [...prev, key]);
    } else {
        setSelectedCheckboxes(prev => prev.filter(item => item !== key));
    }
};

const handleRemoveSelected = () => {
    const newSortConfig = sortConfig.filter(item => selectedCheckboxes.includes(item.key));
    setSortConfig(newSortConfig);
    setSelectedCheckboxes([]);
};

const [selectedLandSales, setSelectedLandSales] = useState([]);
const bulkSubdivision = useRef();

const handleEditCheckboxChange = (e, userId) => {
  if (e.target.checked) {
    setSelectedLandSales((prevSelectedUsers) => [...prevSelectedUsers, userId]);
  } else {
    setSelectedLandSales((prevSelectedUsers) => prevSelectedUsers.filter((id) => id !== userId));
  }
};
const [showSort, setShowSort] = useState(false);
const handleSortClose = () => setShowSort(false);
  const [Error, setError] = useState("");
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [BuilderList, setBuilderList] = useState([]);
  const [BuilderListCount, setBuilderListCount] = useState('');
  const [TotalBuilderListCount, setTotalBuilderListCount] = useState('');
  const [AllBuilderListExport, setAllBuilderExport] = useState([]);

  const [exportmodelshow, setExportModelShow] = useState(false)
  const [selectedColumns, setSelectedColumns] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPage = 25;
  const lastIndex = currentPage * recordsPage;
  const firstIndex = lastIndex - recordsPage;
  const [npage, setNpage] = useState(0);
  const number = [...Array(npage + 1).keys()].slice(1);

  const [filterQuery, setFilterQuery] = useState({
    status: "",
    product_type: "",
    reporting: "",
    builder_name:"",
    name:"",
    product_type:"",
    area:"",
    masterplan_id:"",
    zipcode:"",
    lotwidth:"",
    lotsize:"",
    zoning:"",
    age:"",
    single:"",
    gated:"",
    juridiction:"",
    gasprovider:"",
    hoafee:"",
    masterplan_id:""
  });

  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const [manageAccessOffcanvas, setManageAccessOffcanvas] = useState(false);
  const [manageFilterOffcanvas, setManageFilterOffcanvas] = useState(false);

  const [accessList, setAccessList] = useState({});
  const [accessRole, setAccessRole] = useState("Admin");
  const [accessForm, setAccessForm] = useState({});
  const [role, setRole] = useState("Admin");
  const [checkedItems, setCheckedItems] = useState({}); // State to manage checked items
  const fieldList = AccessField({ tableName: "subdivisions" });
  const headers = [
    { label: 'Status', key: 'firstname' },
    { label: 'Reporting', key: 'lastname' },
    { label: 'Builder', key: 'nickname' },
    { label: 'Name', key: 'zipcode' },
    { label: 'Product Type', key: 'city' },
    { label: 'Area', key: 'with' },
    { label: 'Masterplan', key: 'without' },
    { label: 'Zipcode', key: 'reentries' },
    { label: 'Total Lots', key: 'rakes' },
    { label: 'Lot Width', key: 'firstname' },
    { label: 'Lot Size', key: 'lastname' },
    { label: 'Zoning', key: 'nickname' },
    { label: 'Age Restricted', key: 'zipcode' },
    { label: 'All Single Story', key: 'city' },
    { label: 'Gated', key: 'with' },
    { label: 'Location', key: 'without' },
    { label: 'Juridiction', key: 'reentries' },
    { label: 'Latitude', key: 'rakes' },
    { label: 'Longitude', key: 'zipcode' },
    { label: 'Gas Provider', key: 'city' },
    { label: 'HOA Fee', key: 'with' },
    { label: 'Masterplan Fee', key: 'without' },
    { label: 'Parcel Group', key: 'reentries' },
    { label: 'Phone', key: 'rakes' },
    { label: 'Website', key: 'with' },
    { label: 'FK Builder Id', key: 'BuilderID' },
    { label: 'Total Closings', key: 'total_closings' },
    { label: 'Total Permits', key: 'total_permits' },
    { label: 'Total Net Sales', key: 'total_net_sales' },
    { label: 'Months Open', key: 'months_open' },
    { label: 'Latest Traffic/Sales Data', key: 'latest_traffic_data' },
    { label: 'Latest Lots Released', key: 'latest_lots_released' },
    { label: 'Latest Standing Inventory', key: 'latest_standing_inventory' },
    { label: 'Unsold Lots', key: 'unsold_lots' },
    { label: 'Avg Sqft All', key: 'avg_sqft_all' },
    { label: 'Avg Sqft Active', key: 'avg_sqft_active' },
    { label: 'Avg Base Price All', key: 'avg_base_price_all' },
    { label: 'Avg Base Price Active', key: 'avg_base_price_active' },
    { label: 'Min Sqft All', key: 'min_sqft_all' },
    { label: 'Min Sqft Active', key: 'min_sqft_active' },
    { label: 'Max Sqft All', key: 'max_sqft_all' },
    { label: 'Max Sqft Active', key: 'max_sqft_active' },
    { label: 'Min Base Price All', key: 'min_base_price_all' },
    { label: 'Min Sqft Active', key: 'min_sqft_active_current' },
    { label: 'Max Base Price All', key: 'max_base_price_all' },
    { label: 'Max Sqft Active Current', key: 'max_sqft_active_current' },
    { label: 'Avg Net Traffic Per Month This Year', key: 'avg_net_traffic_per_month_this_year' },
    { label: 'Avg Net Sales Per Month This Year', key: 'avg_net_sales_per_month_this_year' },
    { label: 'Avg Closings Per Month This Year', key: 'avg_closings_per_month_this_year' },
    { label: 'Avg Net Sales Per Month Since Open', key: 'avg_net_sales_per_month_since_open' },
    { label: 'Avg Net Sales Per Month Last 3 Months', key: 'avg_net_sales_per_month_last_three_months' },
    { label: 'Max Week Ending', key: 'max_week_ending' },
    { label: 'Min Week Ending', key: 'min_week_ending' },
    { label: 'Sqft Group', key: 'sqft_group' },
    { label: 'Price Group', key: 'price_group' },
    { label: 'Month Net Sold', key: 'month_net_sold' },
    { label: 'Year Net Sold', key: 'year_net_sold' }
  ];
  const columns = [
    { label: 'Status', key: 'is_active' },
    { label: 'Reporting', key: 'reporting' },
    { label: 'Builder', key: 'builder_name' },
    { label: 'Name', key: 'name' },
    { label: 'Product Type', key: 'product_type' },
    { label: 'Area', key: 'area' },
    { label: 'Masterplan', key: 'masteplan_id' },
    { label: 'Zipcode', key: 'zipcode' },
    { label: 'Total Lots', key: 'totallots' },
    { label: 'Lot Width', key: 'lotwidth' },
    { label: 'Lot Size', key: 'lotsize' },
    { label: 'Zoning', key: 'zoning' },
    { label: 'Age Restricted', key: 'age' },
    { label: 'All Single Story', key: 'single' },
    { label: 'Gated', key: 'gated' },
    { label: 'Location', key: 'location' },
    { label: 'Juridiction', key: 'juridiction' },
    { label: 'Latitude', key: 'lat' },
    { label: 'Longitude', key: 'lng' },
    { label: 'Gas Provider', key: 'gasprovider' },
    { label: 'HOA Fee', key: 'hoafee' },
    { label: 'Masterplan Fee', key: 'masterplanfee' },
    { label: 'Parcel Group', key: 'parcel' },
    { label: 'Phone', key: 'phone' },
    { label: 'Website', key: 'website' },
    { label: 'FK Builder Id', key: 'builder_code' },
    { label: 'Total Closings', key: 'total_closings' },
    { label: 'Total Permits', key: 'total_permits' },
    { label: 'Total Net Sales', key: 'total_net_sales' },
    { label: 'Months Open', key: 'months_open' },
    { label: 'Latest Traffic/Sales Data', key: 'latest_traffic_data' },
    { label: 'Latest Lots Released', key: 'latest_lots_released' },
    { label: 'Latest Standing Inventory', key: 'latest_standing_inventory' },
    { label: 'Unsold Lots', key: 'unsold_lots' },
    { label: 'Avg Sqft All', key: 'avg_sqft_all' },
    { label: 'Avg Sqft Active', key: 'avg_sqft_active' },
    { label: 'Avg Base Price All', key: 'avg_base_price_all' },
    { label: 'Avg Base Price Active', key: 'avg_base_price_active' },
    { label: 'Min Sqft All', key: 'min_sqft_all' },
    { label: 'Min Sqft Active', key: 'min_sqft_active' },
    { label: 'Max Sqft All', key: 'max_sqft_all' },
    { label: 'Max Sqft Active', key: 'max_sqft_active' },
    { label: 'Min Base Price All', key: 'min_base_price_all' },
    { label: 'Min Sqft Active', key: 'min_sqft_active_current' },
    { label: 'Max Base Price All', key: 'max_base_price_all' },
    { label: 'Max Sqft Active Current', key: 'max_sqft_active_current' },
    { label: 'Avg Net Traffic Per Month This Year', key: 'avg_net_traffic_per_month_this_year' },
    { label: 'Avg Net Sales Per Month This Year', key: 'avg_net_sales_per_month_this_year' },
    { label: 'Avg Closings Per Month This Year', key: 'avg_closings_per_month_this_year' },
    { label: 'Avg Net Sales Per Month Since Open', key: 'avg_net_sales_per_month_since_open' },
    { label: 'Avg Net Sales Per Month Last 3 Months', key: 'avg_net_sales_per_month_last_three_months' },
    { label: 'Max Week Ending', key: 'max_week_ending' },
    { label: 'Min Week Ending', key: 'min_week_ending' },
    { label: 'Sqft Group', key: 'sqft_group' },
    { label: 'Price Group', key: 'price_group' },
    { label: 'Month Net Sold', key: 'month_net_sold' },
    { label: 'Year Net Sold', key: 'year_net_sold' },
    { label: 'Date Added', key: 'created_at' }
  ];
 
  const handleColumnToggle = (column) => {
    const updatedColumns = selectedColumns.includes(column)
      ? selectedColumns.filter((col) => col !== column)
      : [...selectedColumns, column];
      console.log(updatedColumns);
    setSelectedColumns(updatedColumns);
  //   newdata.map((nw, i) =>
  //   [nw === "Name" ? row.firstname : '', nw === "Surname" ? row.lastname : '', nw === "Nickname" ? row.nickname : '', nw === "ZipCode" ? row.zipcode : '', nw === "City" ? row.city : '', nw === "Registrations with check-in" ? row.with : '', nw === "Registrations without check-in" ? row.without : '', nw === "Cumulated Buy-in bounty Re-entries" ? row.reentries : '', nw === "Cumulated rakes" ? row.rakes : '']
  // )
   

  };
  useEffect(() => {
    console.log(fieldList); // You can now use fieldList in this component
  }, [fieldList]);

  const checkFieldExist = (fieldName) => {
    return fieldList.includes(fieldName.trim());
  }; 
  const handleDownloadExcel = () => {
    setExportModelShow(false);
    setSelectedColumns('');
  
    let tableHeaders;
    if (selectedColumns.length > 0) {
      tableHeaders = selectedColumns;
    } else {
      tableHeaders = headers.map((c) => c.label);
    }
  
    const tableData = AllBuilderListExport.map((row) => {
      const mappedRow = {};
      tableHeaders.forEach((header) => {
        switch (header) {
          case "Status":
            mappedRow[header] = (row.status === 1 && "Active") || (row.status === 0 && "Sold Out") || (row.status === 2 && "Future");
            break;
          case "Reporting":
            mappedRow[header] = (row.reporting === 1 && "Yes") || (row.status === 0 && "No");
            break;
          case "Builder":
            mappedRow[header] = row.builder ? row.builder.name : '';
            break;
          case "Name":
            mappedRow[header] = row.name;
            break;
          case "Product Type":
            mappedRow[header] = row.product_type;
            break;
          case "Area":
            mappedRow[header] = row.area;
            break;
          case "Masterplan":
            mappedRow[header] = row.masterplan_id;
            break;
          case "Zipcode":
            mappedRow[header] = row.zipcode;
            break;
          case "Total Lots":
            mappedRow[header] = row.totallots;
            break;
          case "Lot Width":
            mappedRow[header] = row.lotwidth;
            break;
          case "Lot Size":
            mappedRow[header] = row.lotsize;
            break;
          case "Zoning":
            mappedRow[header] = row.zoning;
            break;
          case "Age Restricted":
            mappedRow[header] = (row.age === 1 && "Yes") || (row.age === 0 && "No");
            break;
          case "All Single Story":
            mappedRow[header] = (row.single === 1 && "Yes") || (row.single === 0 && "No");
            break;
          case "Gated":
            mappedRow[header] = (row.gated === 1 && "Yes") || (row.gated === 0 && "No");
            break;
          case "Location":
            mappedRow[header] = row.location;
            break;
          case "Juridiction":
            mappedRow[header] = row.juridiction;
            break;
          case "Latitude":
            mappedRow[header] = row.lat;
            break;
          case "Longitude":
            mappedRow[header] = row.lng;
            break;
          case "Gas Provider":
            mappedRow[header] = row.gasprovider;
            break;
          case "HOA Fee":
            mappedRow[header] = row.hoafee;
            break;
          case "Masterplan Fee":
            mappedRow[header] = row.masterplanfee;
            break;
          case "Parcel Group":
            mappedRow[header] = row.parcel;
            break;
          case "Phone":
            mappedRow[header] = row.phone;
            break;
          case "Website":
            mappedRow[header] = row.builder ? row.builder.website : '';
            break;
          case "FK Builder Id":
            mappedRow[header] = row.builder ? row.builder.builder_code : '';
            break;
          case 'Total Closings':
            mappedRow[header] = row.total_closings;
            break;
          case 'Total Permits':
            mappedRow[header] = row.total_permits;
            break;
          case 'Total Net Sales':
            mappedRow[header] = row.total_net_sales;
            break;
          case 'Months Open':
            mappedRow[header] = row.months_open;
            break;
          case 'Latest Traffic/Sales Data':
            mappedRow[header] = row.latest_traffic_data;
            break;
          case 'Latest Lots Released':
            mappedRow[header] = row.latest_lots_released;
            break;
          case 'Latest Standing Inventory':
            mappedRow[header] = row.latest_standing_inventory;
            break;
          case 'Unsold Lots':
            mappedRow[header] = row.unsold_lots;
            break;
          case 'Avg Sqft All':
            mappedRow[header] = row.avg_sqft_all;
            break;
          case 'Avg Sqft Active':
            mappedRow[header] = row.avg_sqft_active;
            break;
          case 'Avg Base Price All':
            mappedRow[header] = row.avg_base_price_all;
            break;
          case 'Avg Base Price Active':
            mappedRow[header] = row.avg_base_price_active;
            break;
          case 'Min Sqft All':
            mappedRow[header] = row.min_sqft_all;
            break;
          case 'Min Sqft Active':
            mappedRow[header] = row.min_sqft_active;
            break;
          case 'Max Sqft All':
            mappedRow[header] = row.max_sqft_all;
            break;
          case 'Max Sqft Active':
            mappedRow[header] = row.max_sqft_active;
            break;
          case 'Min Base Price All':
            mappedRow[header] = row.min_base_price_all;
            break;
          case 'Min Sqft Active':
            mappedRow[header] = row.min_sqft_active_current;
            break;
          case 'Max Base Price All':
            mappedRow[header] = row.max_base_price_all;
            break;
          case 'Max Sqft Active Current':
            mappedRow[header] = row.max_sqft_active_current;
            break;
          case 'Avg Net Traffic Per Month This Year':
            mappedRow[header] = row.avg_net_traffic_per_month_this_year;
            break;
          case 'Avg Net Sales Per Month This Year':
            mappedRow[header] = row.avg_net_sales_per_month_this_year;
            break;
          case 'Avg Closings Per Month This Year':
            mappedRow[header] = row.avg_closings_per_month_this_year;
            break;
          case 'Avg Net Sales Per Month Since Open':
            mappedRow[header] = row.avg_net_sales_per_month_since_open;
            break;
          case 'Avg Net Sales Per Month Last 3 Months':
            mappedRow[header] = row.avg_net_sales_per_month_last_three_months;
            break;
          case 'Max Week Ending':
            mappedRow[header] = row.max_week_ending;
            break;
          case 'Min Week Ending':
            mappedRow[header] = row.min_week_ending;
            break;
          case 'Sqft Group':
            mappedRow[header] = row.sqft_group;
            break;
          case 'Price Group':
            mappedRow[header] = row.price_group;
            break;
          case 'Month Net Sold':
            mappedRow[header] = row.month_net_sold;
            break;
          case 'Year Net Sold':
            mappedRow[header] = row.year_net_sold;
            break;
          default:
            mappedRow[header] = '';
        }
      });
      return mappedRow;
    });
  
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(tableData, { header: tableHeaders });
  
    // Optionally apply styles to the headers
    const headerRange = XLSX.utils.decode_range(worksheet['!ref']);
    for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
      const cell = worksheet[XLSX.utils.encode_cell({ r: 0, c: C })];
      if (!cell.s) cell.s = {};
      cell.s.font = { name: 'Calibri', sz: 11, bold: false };
    }
  
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sub Division List');
  
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'Sub Division List.xlsx');
  };
  
  const [SubdivisionDetails, setSubdivisionDetails] = useState({
    builder_id: "",
    subdivision_code: "",
    name: "",
    status: "",
    reporting: "",
    product_type: "",
    phone: "",
    opensince: "",
    age: "",
    single: "",
    firstpermitdate: "",
    masterplan_id: "",
    lat: "",
    lng: "",
    area: "",
    juridiction: "",
    zipcode: "",
    parcel: "",
    crossstreet: "",
    totallots: "",
    unsoldlots: "",
    lotreleased: "",
    lotwidth: "",
    stadinginventory: "",
    lotsize: "",
    permits: "",
    netsales: "",
    closing: "",
    monthsopen: "",
    gated: "",
    sqftgroup: "",
    dollargroup: "",
    masterplanfee: "",
    lastweeklydata: "",
    dateadded: "",
    zoning: "",
    gasprovider: "",
  });
  const [builderListDropDown, setBuilderListDropDown] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState([]);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState(sortConfig.map(col => col.key));
  useEffect(() => {
    setSelectedCheckboxes(sortConfig.map(col => col.key));
}, [sortConfig]);
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
  const HandleSortDetailClick = (e) =>
    {
        setShowSort(true);
    }
  const subdivision = useRef();
  const [show, setShow] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const [selectedFileError, setSelectedFileError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleClose = () => setShow(false);
  console.log(BuilderList);

  const stringifySortConfig = (sortConfig) => {
    return sortConfig.map((sort) => `${sort.key}:${sort.direction}`).join(",");
  };
  const getbuilderlist = async (pageNumber) => {
    try {
      let sortConfigString = "";
      if (sortConfig !== null) {
        sortConfigString = "&sortConfig=" + stringifySortConfig(sortConfig);
      }
      console.log(sortConfig);
      const response = await AdminSubdevisionService.index(
        pageNumber,
        sortConfigString,
        searchQuery,
      );
      const responseData = await response.json();
      setLoading(false);
      setIsLoading(false);
      setNpage(Math.ceil(responseData.total / recordsPage));
      setBuilderList(responseData.data);
      setBuilderListCount(responseData.total)
    } catch (error) {
      console.log(error);
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(errorJson.message);
      }
    }
  };
  
console.log(AllBuilderListExport)
  useEffect(() => {
    if (localStorage.getItem("usertoken")) {
      getbuilderlist(currentPage);
      fetchAllPages(searchQuery, sortConfig)
    } else {
      navigate("/");
    }
  }, [currentPage]);

  async function fetchAllPages(searchQuery, sortConfig) {
    const response = await AdminSubdevisionService.index(1, searchQuery, sortConfig ? `&sortConfig=${stringifySortConfig(sortConfig)}` : "");
    const responseData = await response.json();
    const totalPages = Math.ceil(responseData.total / recordsPage);
    let allData = responseData.data;
  
    for (let page = 2; page <= totalPages; page++) {
      const pageResponse = await AdminSubdevisionService.index(page, searchQuery, sortConfig ? `&sortConfig=${stringifySortConfig(sortConfig)}` : "");
      const pageData = await pageResponse.json();
      allData = allData.concat(pageData.data);
    }
    setAllBuilderExport(allData);
  }


  const handleDelete = async (e) => {
    try {
      let responseData = await AdminSubdevisionService.destroy(e).json();
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
    // Update the name in the component's state
    getbuilderlist();
  };

  const handleRowClick = async (id) => {
    try {
      let responseData = await AdminSubdevisionService.show(id).json();
      setSubdivisionDetails(responseData);
      console.log(responseData);
      console.log(SubdivisionDetails.status);
      console.log(BuilderList);
      setShowOffcanvas(true);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(errorJson.message);
      }
    }
  };
  const getbuilderDoplist = async () => {
    try {
      const response = await AdminBuilderService.index();
      const responseData = await response.json();
      setBuilderListDropDown(responseData.data);
    } catch (error) {
      console.log(error);
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(errorJson.message);
      }
    }
  };
  useEffect(() => {
    getbuilderDoplist();
  }, []);

  const debouncedHandleSearch = useRef(
    debounce((value) => {
      setSearchQuery(value);
    }, 1000)
  ).current;

  // useEffect(() => {
  //   getbuilderlist();
  // }, [searchQuery]);
  const HandleFilterForm = (e) =>
    {
      e.preventDefault();
      console.log(555);
      getbuilderlist(currentPage,searchQuery);
    };

  const HandleSearch = (e) => {
    setIsLoading(true);
    const query = e.target.value.trim();
    debouncedHandleSearch(`&q=${query}`);
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

    return queryString ? `&${queryString}` : "";
  };

  const HandleCancelFilter = (e) => {
    setFilterQuery(
      {
        status: "",
        product_type: "",
        reporting: "",
        builder_name:"",
        name:"",
        product_type:"",
        area:"",
        masterplan_id:"",
        zipcode:"",
        lotwidth:"",
        lotsize:"",
        zoning:"",
        age:"",
        single:"",
        gated:"",
        juridiction:"",
        gasprovider:"",
        hoafee:"",
        masterplan_id:""
      });
      getbuilderlist(currentPage,searchQuery);
  };

  const [value, setValue] = React.useState("1");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleProductRedirect = () => {
    navigate("/productlist");
  };
  const handlePermitRedirect = () => {
    navigate("/permitlist");
  };
  const handleClosingRedirect = () => {
    navigate("/closingsalelist");
  };
  const handleTraficRedirect = () => {
    navigate("/trafficsalelist");
  };
  const handleLandRedirect = () => {
    navigate("/landsalelist");
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


  const exportToExcelData = async () => {
    try {
        const bearerToken = JSON.parse(localStorage.getItem('usertoken'));
        const response = await axios.get(
          `${process.env.REACT_APP_IMAGE_URL}api/admin/subdivision/export`
          // 'https://hbrapi.rigicgspl.com/api/admin/subdivision/export'

          , {
            responseType: 'blob',
            headers: {
                'Authorization': `Bearer ${bearerToken}`
            }
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'subdivision.xlsx');
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
  const HandleRole = (e) => {
    setRole(e.target.value);
    setAccessRole(e.target.value);
  };
  const handleAccessForm = async (e) => {
    e.preventDefault();
    var userData = {
      form: accessForm,
      role: role,
      table: "subdivisions",
    };
    try {
      const data = await AdminSubdevisionService.manageAccessFields(
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
    console.log('logs',event.target);
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
      const response = await AdminSubdevisionService.accessField();
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
          let responseData = await AdminSubdevisionService.import(inputData).json();
          setSelectedFile("");
          document.getElementById("fileInput").value = null;
          setLoading(false);
          swal("Imported Sucessfully").then((willDelete) => {
            if (willDelete) {
              navigate("/subdivisionlist");
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
        mainTitle="Subdivision"
        pageTitle="Subdivision"
        parentTitle="Home"
      />
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-12">
            <div className="card">
              <div className="card-body p-0">
                <div className="table-responsive active-projects style-1 ItemsCheckboxSec shorting">
                  <div className="tbl-caption d-flex justify-content-between text-wrap align-items-center pb-0">
                    <div className="d-flex text-nowrap justify-content-between align-items-center">
                      <h4 className="heading mb-0">Subdivision List</h4>
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
                    <Button
                            className="btn-sm me-1"
                            variant="secondary"
                            onClick={HandleSortDetailClick}
                          >
                            <i class="fa-solid fa-sort"></i>
                          </Button>
                    <button onClick={() => setExportModelShow(true)} className="btn btn-primary btn-sm me-1"> <i class="fas fa-file-excel"></i></button>
                    {/* <button onClick={exportToExcelData} className="btn btn-primary btn-sm me-1"> <i class="fas fa-file-excel"></i></button> */}
                   
                    <Link
                        to={"/google-map-locator"}
                        className="btn btn-primary btn-sm me-1"
                      >
                        <i class="fa fa-map-marker" aria-hidden="true"></i>
                      </Link>

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
                        onClick={() => subdivision.current.showEmployeModal()}
                      >
                        + Add Subdivision
                      </Link>
                      <Link
                        to={"#"}
                        className="btn btn-primary btn-sm ms-1"
                        data-bs-toggle="offcanvas"
                        onClick={() => bulkSubdivision.current.showEmployeModal()}
                      >
                        Bulk Edit
                      </Link>
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
                                checked={selectedLandSales.length === BuilderList.length}
                                onChange={(e) =>
                                  e.target.checked
                                    ? setSelectedLandSales(BuilderList.map((user) => user.id))
                                    : setSelectedLandSales([])
                                }
                              />
                            </th>
                            <th>
                              <strong> No.</strong>
                            </th>
                            {checkFieldExist("Status") && (
                              <th onClick={() => requestSort("status")}>
                                <strong> Status</strong>
                                {sortConfig.some(
                                    (item) => item.key === "status"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "status"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                              </th>
                            )}
                            {checkFieldExist("Reporting") && (
                              <th onClick={() => requestSort("reporting")}>
                                <strong> Reporting</strong>
                                {sortConfig.some(
                                    (item) => item.key === "reporting"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "reporting"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                              </th>
                            )}
                            {checkFieldExist("Builder") && (
                              <th onClick={() => requestSort("builderName")}>
                                <strong> Builder</strong>
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
                            )}
                            {checkFieldExist("Name") && (
                              <th onClick={() => requestSort("name")}>
                                <strong> Name</strong>
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
                            {checkFieldExist("Product Type") && (
                              <th onClick={() => requestSort("product_type")}>
                                <strong> Product Type</strong>
                                {sortConfig.some(
                                    (item) => item.key === "product_type"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "product_type"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                              </th>
                            )}
                            {checkFieldExist("Area") && (
                              <th onClick={() => requestSort("area")}>
                                <strong> Area</strong>
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
                            )}
                            {checkFieldExist("Product Type") && (
                              <th onClick={() => requestSort("masterplan_id")}>
                                <strong> Masterplan</strong>
                                {sortConfig.some(
                                    (item) => item.key === "masterplan_id"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "masterplan_id"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                              </th>
                            )}
                            {checkFieldExist("Zipcode") && (
                              <th onClick={() => requestSort("zipcode")}>
                                <strong> Zipcode</strong>
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
                            {checkFieldExist("Total Lots") && (
                              <th onClick={() => requestSort("totallots")}>
                                <strong> Total Lots</strong>
                                {sortConfig.some(
                                    (item) => item.key === "totallots"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "totallots"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                              </th>
                            )}
                            {checkFieldExist("Lot Width") && (
                              <th onClick={() => requestSort("lotwidth")}>
                                <strong>Lot Width</strong>
                                {sortConfig.some(
                                    (item) => item.key === "lotwidth"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "lotwidth"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                              </th>
                            )}
                            {checkFieldExist("Lot Size") && (
                              <th onClick={() => requestSort("lotsize")}>
                                <strong> Lot Size</strong>
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
                            )}
                            {checkFieldExist("Zoning") && (
                              <th onClick={() => requestSort("zoning")}>
                                <strong> Zoning</strong>
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
                            )}
                            {checkFieldExist("Age Restricted") && (
                              <th onClick={() => requestSort("age")}>
                                <strong> Age Restricted</strong>
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
                            )}
                            {checkFieldExist("All Single Story") && (
                              <th onClick={() => requestSort("single")}>
                                <strong> All Single Story</strong>
                                {sortConfig.some(
                                    (item) => item.key === "single"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "single"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                              </th>
                            )}
                            {checkFieldExist("Gated") && (
                              <th onClick={() => requestSort("gated")}>
                                <strong> Gated</strong>
                                {sortConfig.some(
                                    (item) => item.key === "gated"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "gated"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                              </th>
                            )}
                            {checkFieldExist("Location") && (
                              <th>
                                <strong> Location</strong>
                              </th>
                            )}
                            {checkFieldExist("Juridiction") && (
                              <th onClick={() => requestSort("juridiction")}>
                                <strong> Juridiction</strong>
                                {sortConfig.some(
                                    (item) => item.key === "juridiction"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "juridiction"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                              </th>
                            )}
                            {checkFieldExist("Latitude") && (
                              <th onClick={() => requestSort("lat")}>
                                <strong>Latitude</strong>
                                {sortConfig.some(
                                    (item) => item.key === "lat"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "lat"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                              </th>
                            )}
                            {checkFieldExist("Longitude") && (
                              <th onClick={() => requestSort("lng")}>
                                <strong> Longitude</strong>
                                {sortConfig.some(
                                    (item) => item.key === "lng"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "lng"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                              </th>
                            )}
                            {checkFieldExist("Gas Provider") && (
                              <th onClick={() => requestSort("gasprovider")}>
                                <strong> Gas Provider</strong>
                                {sortConfig.some(
                                    (item) => item.key === "gasprovider"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "gasprovider"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                              </th>
                            )}
                            {checkFieldExist("HOA Fee") && (
                              <th onClick={() => requestSort("hoafee")}>
                                <strong> HOA Fee</strong>
                                {sortConfig.some(
                                    (item) => item.key === "hoafee"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "hoafee"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                              </th>
                            )}
                            {checkFieldExist("Masterplan Fee") && (
                              <th onClick={() => requestSort("masterplanfee")}>
                                <strong> Masterplan Fee</strong>
                                {sortConfig.some(
                                    (item) => item.key === "masterplanfee"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "masterplanfee"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                              </th>
                            )}
                            {checkFieldExist("Parcel Group") && (
                              <th onClick={() => requestSort("parcel")}>
                                <strong> Parcel Group</strong>
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
                            )}
                            {checkFieldExist("Phone") && (
                              <th onClick={() => requestSort("phone")}>
                                <strong> Phone</strong>
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
                            {checkFieldExist("Website") && (
                              <th>
                                <strong> Website</strong>
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
                            {checkFieldExist("Date Added") && (
                              <th onClick={() => requestSort("created_at")}>
                                <strong> Date Added</strong>
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
                            )}
                            {checkFieldExist("__pkSubID") && (
                              <th
                                onClick={() => requestSort("subdivision_code")}
                              >
                                <strong> __pkSubID </strong>
                                {sortConfig.some(
                                    (item) => item.key === "subdivision_code"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "subdivision_code"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                              </th>
                            )}
                            {checkFieldExist("_fkBuilderID") && (
                              <th onClick={() => requestSort("builder_code")}>
                                <strong> _fkBuilderID </strong>
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
                              </th>
                            )}
                            {checkFieldExist("Total Closings") && (
                            <th onClick={() => requestSort("total_closings")}>
                                <strong> Total Closings </strong>
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
                              </th>
                              )}
                            {checkFieldExist("Total Permits") && (                     
                              <th onClick={() => requestSort("total_permits")}>
                                <strong> Total Permits </strong>
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
                              </th>
                            )}
                              {checkFieldExist("Total Net Sales") && (
                              <th onClick={() => requestSort("total_net_sales")}>
                                <strong> Total Net Sales </strong>
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
                              </th>
                               )}
                              {checkFieldExist("Months Open") && (
                              <th onClick={() => requestSort("months_open")}>
                                <strong> Months Open </strong>
                                {sortConfig.some(
                                    (item) => item.key === "months_open"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "months_open"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                              </th>
                            )}
                              {checkFieldExist("Latest Traffic/Sales Data") && (
                              <th onClick={() => requestSort("latest_traffic_data")}>
                                <strong> Latest Traffic/Sales Data </strong>
                                {sortConfig.some(
                                    (item) => item.key === "latest_traffic_data"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "latest_traffic_data"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                              </th>
                             )}
                              {checkFieldExist("Latest Lots Released") && (
                              <th onClick={() => requestSort("latest_lots_released")}>
                                <strong> Latest Lots Released </strong>
                                {sortConfig.some(
                                    (item) => item.key === "latest_lots_released"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "latest_lots_released"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                              </th>
                              )}
                              {checkFieldExist("Latest Standing Inventory") && (
                              <th onClick={() => requestSort("latest_standing_inventory")}>
                                <strong> Latest Standing Inventory </strong>
                                {sortConfig.some(
                                    (item) => item.key === "latest_standing_inventory"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "latest_standing_inventory"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                              </th>
                               )}
                              {checkFieldExist("Unsold Lots") && (
                              <th onClick={() => requestSort("unsold_lots")}>
                                <strong> Unsold Lots </strong>
                                {sortConfig.some(
                                    (item) => item.key === "unsold_lots"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "unsold_lots"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                              </th>
                              )}
                              {checkFieldExist("Avg Sqft All") && (
                              <th onClick={() => requestSort("avg_sqft_all")}>
                                <strong> Avg Sqft All </strong>
                                {sortConfig.some(
                                    (item) => item.key === "avg_sqft_all"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "avg_sqft_all"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                              </th>
                              )}
                              {checkFieldExist("Avg Sqft Active") && (
                              <th onClick={() => requestSort("avg_sqft_active")}>
                                <strong> Avg Sqft Active </strong>
                                {sortConfig.some(
                                    (item) => item.key === "avg_sqft_active"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "avg_sqft_active"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                              </th>
                            )}
                              {checkFieldExist("Avg Base Price All") && (
                              <th onClick={() => requestSort("avg_base_price_all")}>
                                <strong> Avg Base Price All </strong>
                                {sortConfig.some(
                                    (item) => item.key === "avg_base_price_all"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "avg_base_price_all"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                              </th>
                               )}
                              {checkFieldExist("Avg Base Price Active") && (
                              <th onClick={() => requestSort("avg_base_price_active")}>
                                <strong> Avg Base Price Active </strong>
                                {sortConfig.some(
                                    (item) => item.key === "avg_base_price_active"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "avg_base_price_active"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                              </th>
                              )}
                              {checkFieldExist("Min Sqft All") && (
                              <th onClick={() => requestSort("min_sqft_all")}>
                                <strong> Min Sqft All </strong>
                                {sortConfig.some(
                                    (item) => item.key === "min_sqft_all"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "min_sqft_all"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                              </th>
                               )}
                              {checkFieldExist("Min Sqft Active") && (
                              <th onClick={() => requestSort("min_sqft_active")}>
                                <strong> Min Sqft Active </strong>
                                {sortConfig.some(
                                    (item) => item.key === "min_sqft_active"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "min_sqft_active"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                              </th>
                              )}
                              {checkFieldExist("Max Sqft All") && (
                              <th onClick={() => requestSort("max_sqft_all")}>
                                <strong> Max Sqft All </strong>
                                {sortConfig.some(
                                    (item) => item.key === "max_sqft_all"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "max_sqft_all"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                              </th>
                              )}
                              {checkFieldExist("Max Sqft Active") && (
                              <th onClick={() => requestSort("max_sqft_active")}>
                                <strong> Max Sqft Active </strong>
                                {sortConfig.some(
                                    (item) => item.key === "max_sqft_active"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "max_sqft_active"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                              </th>
                                   )}
                              {checkFieldExist("Min Base Price All") && (
                              <th onClick={() => requestSort("min_base_price_all")}>
                                <strong> Min Base Price All </strong>
                                {sortConfig.some(
                                    (item) => item.key === "min_base_price_all"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "min_base_price_all"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                              </th>
                              )}
                              {checkFieldExist("Min Sqft Active") && (
                              <th onClick={() => requestSort("min_sqft_active_current")}>
                                <strong> Min Sqft Active </strong>
                                {sortConfig.some(
                                    (item) => item.key === "min_sqft_active_current"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "min_sqft_active_current"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                              </th>
                              )}
                              {checkFieldExist("Max Base Price All") && (
                              <th onClick={() => requestSort("max_base_price_all")}>
                                <strong> Max Base Price All </strong>
                                {sortConfig.some(
                                    (item) => item.key === "max_base_price_all"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "max_base_price_all"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                              </th>
                              )}
                              {checkFieldExist("Max Sqft Active") && (
                              <th onClick={() => requestSort("max_sqft_active_current")}>
                                <strong> Max Sqft Active </strong>
                                {sortConfig.some(
                                    (item) => item.key === "max_sqft_active_current"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "max_sqft_active_current"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                              </th>
                               )}
                              {checkFieldExist("Avg Net Traffic Per Month This Year") && (
                              <th onClick={() => requestSort("avg_net_traffic_per_month_this_year")}>
                                <strong> Avg Net Traffic Per Month This Year </strong>
                                {sortConfig.some(
                                    (item) => item.key === "avg_net_traffic_per_month_this_year"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "avg_net_traffic_per_month_this_year"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                              </th>
                               )}
                              {checkFieldExist("Avg Net Sales Per Month This Year") && (
                              <th onClick={() => requestSort("avg_net_sales_per_month_this_year")}>
                                <strong> Avg Net Sales Per Month This Year </strong>
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
                              </th>
                             )}
                              {checkFieldExist("Avg Closings Per Month This Year") && (
                              <th onClick={() => requestSort("avg_closings_per_month_this_year")}>
                                <strong> Avg Closings Per Month This Year </strong>
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
                              </th>
                              )}
                              {checkFieldExist("Avg Net Sales Per Month Since Open") && (
                              <th onClick={() => requestSort("avg_net_sales_per_month_since_open")}>
                                <strong> Avg Net Sales Per Month Since Open </strong>
                                {sortConfig.some(
                                    (item) => item.key === "avg_net_sales_per_month_since_open"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "avg_net_sales_per_month_since_open"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                              </th>
                               )}
                              {checkFieldExist("Avg Net Sales Per Month Last 3 Months") && (
                              <th onClick={() => requestSort("avg_net_sales_per_month_last_three_months")}>
                                <strong> Avg Net Sales Per Month Last 3 Months </strong>
                                {sortConfig.some(
                                    (item) => item.key === "avg_net_sales_per_month_last_three_months"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "avg_net_sales_per_month_last_three_months"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                              </th>
                              )}
                              {checkFieldExist("Max Week Ending") && (
                              <th onClick={() => requestSort("max_week_ending")}>
                                <strong> Max Week Ending </strong>
                                {sortConfig.some(
                                    (item) => item.key === "max_week_ending"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "max_week_ending"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                              </th>
                               )}
                              {checkFieldExist("Min Week Ending") && (
                              <th onClick={() => requestSort("min_week_ending")}>
                                <strong> Min Week Ending </strong>
                                {sortConfig.some(
                                    (item) => item.key === "min_week_ending"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "min_week_ending"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                              </th>
                                )}
                              {checkFieldExist("Sqft Group") && (
                              <th onClick={() => requestSort("sqft_group")}>
                                <strong> Sqft Group </strong>
                                {sortConfig.some(
                                    (item) => item.key === "sqft_group"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "sqft_group"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                              </th>
                               )}
                              {checkFieldExist("Price Group") && (
                              <th onClick={() => requestSort("price_group")}>
                                <strong> Price Group </strong>
                                {sortConfig.some(
                                    (item) => item.key === "price_group"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "price_group"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                              </th>
                              )}
                              {checkFieldExist("Month Net Sold") && (
                              <th onClick={() => requestSort("month_net_sold")}>
                                <strong> Month Net Sold </strong>
                                {sortConfig.some(
                                    (item) => item.key === "month_net_sold"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "month_net_sold"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                              </th>
                              )}
                              {checkFieldExist("Year Net Sold") && (
                              <th onClick={() => requestSort("year_net_sold")}>
                                <strong> Year Net Sold </strong>
                                {sortConfig.some(
                                    (item) => item.key === "year_net_sold"
                                  ) ? (
                                    <span>
                                      {sortConfig.find(
                                        (item) => item.key === "year_net_sold"
                                      ).direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  ) : (
                                    <span>↑↓</span>
                                  )}
                              </th>
                              
                            )}
                            {checkFieldExist("Action") && (
                              <th>
                                {" "}
                                <strong> Action </strong>
                              </th>
                            )}
                          </tr>
                        </thead>
                        <tbody style={{ textAlign: "center" }}>
                          {BuilderList !== null && BuilderList.length > 0 ? (
                            BuilderList.map((element, index) => (
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
                                {checkFieldExist("Status") && (
                                  <td>
                                    {element.status === 1 && "Active"}
                                    {element.status === 0 && "Sold Out"}
                                    {element.status === 2 && "Future"}
                                  </td>
                                )}
                                {checkFieldExist("Reporting") && (
                                  <td>
                                    {element.reporting === 1 && "Yes"}
                                    {element.reporting === 0 && "No"}
                                  </td>
                                )}
                                {checkFieldExist("Builder") && (
                                  <td>{element.builder.name}</td>
                                )}
                                {checkFieldExist("Name") && (
                                  <td>{element.name}</td>
                                )}
                                {checkFieldExist("Product Type") && (
                                  <td>{element.product_type}</td>
                                )}
                                {checkFieldExist("Area") && (
                                  <td>{element.area}</td>
                                )}
                                {checkFieldExist("Masterplan") && (
                                  <td>{element.masterplan_id}</td>
                                )}
                                {checkFieldExist("Zipcode") && (
                                  <td>{element.zipcode}</td>
                                )}
                                {checkFieldExist("Total Lots") && (
                                  <td>{element.totallots}</td>
                                )}
                                {checkFieldExist("Lot Width") && (
                                  <td>{element.lotwidth}</td>
                                )}
                                {checkFieldExist("Lot Size") && (
                                  <td>{element.lotsize}</td>
                                )}
                                {checkFieldExist("Zoning") && (
                                  <td>{element.zoning}</td>
                                )}
                                {checkFieldExist("Age Restricted") && (
                                  <td>
                                    {element.age === 1 && "Yes"}
                                    {element.age === 0 && "No"}
                                  </td>
                                )}
                                {checkFieldExist("All Single Story") && (
                                  <td>
                                    {element.single === 1 && "Yes"}
                                    {element.single === 0 && "No"}
                                  </td>
                                )}
                                {checkFieldExist("Gated") && (
                                  <td>
                                    {element.gated === 1 && "Yes"}
                                    {element.gated === 0 && "No"}
                                  </td>
                                )}
                                {checkFieldExist("Location") && (
                                  <td>{element.location}</td>
                                )}
                                {checkFieldExist("Juridiction") && (
                                  <td>{element.juridiction}</td>
                                )}
                                {checkFieldExist("Latitude") && (
                                  <td>{element.lat}</td>
                                )}
                                {checkFieldExist("Longitude") && (
                                  <td>{element.lng}</td>
                                )}
                                {checkFieldExist("Gas Provider") && (
                                  <td>{element.gasprovider}</td>
                                )}
                                {checkFieldExist("HOA Fee") && (
                                  <td>{element.hoafee}</td>
                                )}
                                {checkFieldExist("Masterplan Fee") && (
                                  <td>{element.masterplanfee}</td>
                                )}
                                {checkFieldExist("Parcel Group") && (
                                  <td>{element.parcel}</td>
                                )}
                                {checkFieldExist("Phone") && (
                                  <td>{element.phone}</td>
                                )}
                                {checkFieldExist("Website") && (
                                  <td>{element.builder.website}</td>
                                )}
                                {checkFieldExist("Date Added") && (
                                  <td>
                                    <DateComponent date={element.dateadded} />
                                  </td>
                                )}
                                {checkFieldExist("__pkSubID") && (
                                  <td>{element.subdivision_code}</td>
                                )}
                                {checkFieldExist("_fkBuilderID") && (
                                  <td>{element.builder.builder_code}</td>
                                )}
                                <td>{element.total_closings}</td>
                                <td>{element.total_permits}</td>
                                <td>{element.total_net_sales}</td>
                                <td>{element.months_open}</td>
                                <td>
                                  <DateComponent date={element.latest_traffic_data} />
                                 </td>
                                <td>{element.latest_lots_released}</td>
                                <td>{element.latest_standing_inventory}</td>
                                <td>{element.unsold_lots}</td>
                                <td>{element.avg_sqft_all}</td>
                                <td>{element.avg_sqft_active}</td>
                               <td>{<PriceComponent price={element.avg_base_price_all} /> || "NA"}</td>
                                <td>{<PriceComponent price={element.avg_base_price_active} /> || "NA"}</td>
                                <td>{element.min_sqft_all}</td>
                                <td>{element.min_sqft_active}</td>
                                <td>{element.max_sqft_all}</td>
                                <td>{element.max_sqft_active}</td>
                                <td>{<PriceComponent price={element.min_base_price_all} /> || "NA"}</td>
                                <td>{element.min_sqft_active_current}</td>
                                <td>{<PriceComponent price={element.max_base_price_all} /> || "NA"}</td>
                                <td>{element.max_sqft_active_current}</td>
                                <td>{element.avg_net_traffic_per_month_this_year}</td>
                                <td>{element.avg_net_sales_per_month_this_year}</td>
                                <td>{element.avg_closings_per_month_this_year}</td>
                                <td>{element.avg_net_sales_per_month_since_open}</td>
                                <td>{element.avg_net_sales_per_month_last_three_months}</td>
                                <td>{<DateComponent date={element.max_week_ending} /> || "NA"}</td>
                                <td>{<DateComponent date={element.min_week_ending} /> || "NA"}</td>
                                <td>{element.sqft_group}</td>
                                <td>{element.price_group}</td>
                                <td>{element.month_net_sold}</td>
                                <td>{element.year_net_sold}</td>
                                {checkFieldExist("Action") && (
                                  <td style={{ textAlign: "center" }}>
                                    <div>
                                      <Link
                                        to={`/subdivisionUpdate/${element.id}`}
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
                              <td colSpan="15" style={{ textAlign: "center" }}>
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
      <SubdivisionOffcanvas
        ref={subdivision}
        Title="Add Subdivision"
        parentCallback={handleCallback}
      />
    <BulkSubdivisionUpdate
        ref={bulkSubdivision}
        Title="Bulk Edit Subdivision sale"
        parentCallback={handleCallback}
        selectedLandSales={selectedLandSales}
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
                                  <span>{columns.find(column => column.key === col.key)?.label}</span>:<span>{col.direction}</span>
                                    
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
            Subdivision Details
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
                    <Tab label="Subdivision Details" value="1" />
                    <Tab label="Products" value="2" />
                    <Tab label="Permits" value="3" />
                    <Tab label="Traffic & Sales" value="4" />
                    <Tab label="Closings" value="5" />
                    <Tab label="Land Sales" value="6" />
                  </TabList>
                </Box>
                <TabPanel value="1" className="p-0">
                  <div className="card">
                    <div className="card-body p-0">
                      <div className="row">
                        <div className="col-xl-4 mt-4">
                          <label className="">Builder :</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.builder &&
                              SubdivisionDetails.builder.name !== undefined
                                ? SubdivisionDetails.builder.name
                                : "NA"}
                            </span>
                          </div>
                        </div>
                        <div className="col-xl-4 mt-4">
                          <label className="">Subdivision Code:</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.subdivision_code || "NA"}
                            </span>
                          </div>
                        </div>
                        <div className="col-xl-4 mt-4">
                          <label className="">Name:</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.name || "NA"}
                            </span>
                          </div>
                        </div>
                        <div className="col-xl-4 mt-4">
                          <label className="">Status :</label>
                          <div>
                            <span className="fw-bold">
                              <span className="fw-bold">
                                {SubdivisionDetails.status === 1 && "Active"}
                                {SubdivisionDetails.status === 0 && "De-acitve"}
                                {SubdivisionDetails.status === 2 && "Future"}
                              </span>
                            </span>
                          </div>
                        </div>

                        <div className="col-xl-4 mt-4">
                          <label className="">Reporting :</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.reporting === 1 && "Yes"}
                              {SubdivisionDetails.reporting === 0 && "No"}
                            </span>
                          </div>
                        </div>
                        <div className="col-xl-4 mt-4">
                          <label className="">Product Type:</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.product_type || "NA"}
                            </span>
                          </div>
                        </div>
                        <div className="col-xl-4 mt-4">
                          <label className="">Phone:</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.phone || "NA"}
                            </span>
                          </div>
                        </div>
                        <div className="col-xl-4 mt-4">
                          <label className="">Open Since:</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.opensince || "NA"}
                            </span>
                          </div>
                        </div>

                        <div className="col-xl-4 mt-4">
                          <label className="">Age Restricted:</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.reporting === 0 && "No"}
                              {SubdivisionDetails.reporting === 1 && "Yes"}
                              {SubdivisionDetails.reporting === "" && "NA"}
                            </span>
                          </div>
                        </div>
                        <div className="col-xl-4 mt-4">
                          <label className="">All Single Story :</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.reporting === 0 && "No"}
                              {SubdivisionDetails.reporting === 1 && "Yes"}
                              {SubdivisionDetails.reporting === "" && "NA"}
                            </span>
                          </div>
                        </div>
                        <div className="col-xl-4 mt-4">
                          <label className="">First Permit Date:</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.firstpermitdate || "NA"}
                            </span>
                          </div>
                        </div>
                        <div className="col-xl-4 mt-4">
                          <label className="">Masterplan:</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.masterplan_id || "NA"}
                            </span>
                          </div>
                        </div>
                        <div className="col-xl-4 mt-4">
                          <label className="">Latitude:</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.lat || "NA"}
                            </span>
                          </div>
                        </div>
                        <div className="col-xl-4 mt-4">
                          <label className="">Longitude:</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.lng || "NA"}
                            </span>
                          </div>
                        </div>
                        <div className="col-xl-4 mt-4">
                          <label className="">Area:</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.area || "NA"}
                            </span>
                          </div>
                        </div>
                        <div className="col-xl-4 mt-4">
                          <label className="">Juridiction:</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.juridiction || "NA"}
                            </span>
                          </div>
                        </div>
                        <div className="col-xl-4 mt-4">
                          <label className="">Zipcode:</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.zipcode || "NA"}
                            </span>
                          </div>
                        </div>
                        <div className="col-xl-4 mt-4">
                          <label className="">Parcel:</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.parcel || "NA"}
                            </span>
                          </div>
                        </div>

                        <div className="col-xl-4 mt-4">
                          <label className="">Cross Street:</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.crossstreet || "NA"}
                            </span>
                          </div>
                        </div>

                        <div className="col-xl-4 mt-4">
                          <label className="">Total Lots :</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.totallots || "NA"}
                            </span>
                          </div>
                        </div>

                        <div className="col-xl-4 mt-4">
                          <label className="">Unsold Lots :</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.unsoldlots || "NA"}
                            </span>
                          </div>
                        </div>
                        <div className="col-xl-4 mt-4">
                          <label className="">Lot Width :</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.lotwidth || "NA"}
                            </span>
                          </div>
                        </div>

                        <div className="col-xl-4 mt-4">
                          <label className="">Stading Inventory :</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.stadinginventory || "NA"}
                            </span>
                          </div>
                        </div>

                        <div className="col-xl-4 mt-4">
                          <label className="">Lot Size :</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.lotsize || "NA"}
                            </span>
                          </div>
                        </div>

                        <div className="col-xl-4 mt-4">
                          <label className="">Permits :</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.permits || "NA"}
                            </span>
                          </div>
                        </div>

                        <div className="col-xl-4 mt-4">
                          <label className="">Net Sales :</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.netsales || "NA"}
                            </span>
                          </div>
                        </div>

                        <div className="col-xl-4 mt-4">
                          <label className="">Closing :</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.closing || "NA"}
                            </span>
                          </div>
                        </div>

                        <div className="col-xl-4 mt-4">
                          <label className="">Months Open:</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.monthsopen || "NA"}
                            </span>
                          </div>
                        </div>

                        <div className="col-xl-4 mt-4">
                          <label className="">Gated :</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.gated || "NA"}
                            </span>
                          </div>
                        </div>

                        <div className="col-xl-4 mt-4">
                          <label className="">Sqft Group :</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.sqftgroup || "NA"}
                            </span>
                          </div>
                        </div>

                        <div className="col-xl-4 mt-4">
                          <label className="">Lot Released :</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.lotreleased || "NA"}
                            </span>
                          </div>
                        </div>

                        <div className="col-xl-4 mt-4">
                          <label className="">Dollar Group :</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.lat || "NA"}
                            </span>
                          </div>
                        </div>

                        <div className="col-xl-4 mt-4">
                          <label className="">Master Plan Fee :</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.masterplanfee || "NA"}
                            </span>
                          </div>
                        </div>

                        <div className="col-xl-4 mt-4">
                          <label className="">Last Weekly Data :</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.lastweeklydata || "NA"}
                            </span>
                          </div>
                        </div>

                        <div className="col-xl-4 mt-4">
                          <label className="">Date Added :</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.dateadded || "NA"}
                            </span>
                          </div>
                        </div>

                        <div className="col-xl-4 mt-4">
                          <label className="">Zoning :</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.zoning || "NA"}
                            </span>
                          </div>
                        </div>

                        <div className="col-xl-4 mt-4">
                          <label className="">Gas Provider :</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.gasprovider || "NA"}
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
                            className="table ItemsCheckboxSec dataTable no-footer mb-0"
                          >
                            <thead>
                              <tr style={{ textAlign: "center" }}>
                                <th>
                                  <strong>No.</strong>
                                </th>
                                <th>
                                  <strong>Name</strong>
                                </th>
                                <th>
                                  <strong>Product Code</strong>
                                </th>
                                <th>
                                  <strong>Stories</strong>
                                </th>
                                <th>
                                  <strong>Recent Price</strong>
                                </th>
                                <th>
                                  <strong>Recent Price SQFT</strong>
                                </th>
                              </tr>
                            </thead>
                            <tbody style={{ textAlign: "center" }}>
                              {SubdivisionDetails.products &&
                              Array.isArray(SubdivisionDetails.products) &&
                              SubdivisionDetails.products.length > 0 ? (
                                SubdivisionDetails.products.map(
                                  (element, index) => (
                                    <tr
                                      onClick={handleProductRedirect}
                                      key={element.id}
                                      style={{
                                        textAlign: "center",
                                        cursor: "pointer",
                                      }}
                                    >
                                      <td>{index + 1}</td>
                                      <td>{element.name}</td>
                                      <td>{element.product_code}</td>
                                      <td>{element.stories}</td>
                                      <td>{element.recentprice}</td>
                                      <td>{element.recentpricesqft}</td>
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
                <TabPanel value="3" className="p-0">
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
                                <th>No.</th>
                                <th>Permit Number</th>
                                <th>Owner</th>
                                <th>Contractor</th>
                                <th>Description</th>
                                <th>Address</th>
                              </tr>
                            </thead>
                            <tbody style={{ textAlign: "center" }}>
                              {SubdivisionDetails.get_permits &&
                              Array.isArray(SubdivisionDetails.get_permits) &&
                              SubdivisionDetails.get_permits.length > 0 ? (
                                SubdivisionDetails.get_permits.map(
                                  (element, index) => (
                                    <tr
                                      onClick={() =>
                                        handlePermitRedirect(element.id)
                                      }
                                      key={element.id}
                                      style={{
                                        textAlign: "center",
                                        cursor: "pointer",
                                      }}
                                    >
                                      <td>{index + 1}</td>
                                      <td>{element.permitnumber}</td>
                                      <td>{element.owner}</td>
                                      <td>{element.contractor}</td>
                                      <td>{element.description}</td>
                                      <td>{element.address1}</td>
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
                <TabPanel value="4" className="p-0">
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
                                {" "}
                                <th>No.</th>
                                <th>Week Ending</th>
                                <th>Weekly Traffic</th>
                                <th>Gross Sales</th>
                                <th>Cancelations</th>
                                <th>Net Sales</th>
                                <th>Lot Released</th>
                                <th>Unsold Inventory</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody style={{ textAlign: "center" }}>
                              {SubdivisionDetails.traficSales &&
                              Array.isArray(SubdivisionDetails.traficSales) &&
                              SubdivisionDetails.traficSales.length > 0 ? (
                                SubdivisionDetails.traficSales.map(
                                  (element, index) => (
                                    <tr
                                      onClick={handleTraficRedirect}
                                      key={element.id}
                                      style={{
                                        textAlign: "center",
                                        cursor: "pointer",
                                      }}
                                    >
                                      <td>{index + 1}</td>
                                      <td>{element.weekending}</td>
                                      <td>{element.weeklytraffic}</td>
                                      <td>{element.grosssales}</td>
                                      <td>{element.cancelations}</td>
                                      <td>{element.netsales}</td>
                                      <td>{element.lotreleased}</td>
                                      <td>{element.unsoldinventory}</td>
                                      <td>
                                        <div className="d-flex justify-content-center">
                                          <Link
                                            to={`/trafficsaleupdate/${element.id}`}
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
                                    </tr>
                                  )
                                )
                              ) : (
                                <tr>
                                  <td
                                    colSpan="9"
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
                <TabPanel value="5" className="p-0">
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
                                <th>No.</th>
                                <th>Seller Leagal</th>
                                <th>Address</th>
                                <th>Buyer</th>
                                <th>Closing Date</th>
                                <th>Closing Price</th>
                                <th>Loan Amount</th>
                                <th>Document</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody style={{ textAlign: "center" }}>
                              {SubdivisionDetails.get_closing &&
                              Array.isArray(SubdivisionDetails.get_closing) &&
                              SubdivisionDetails.get_closing.length > 0 ? (
                                SubdivisionDetails.get_closing.map(
                                  (element, index) => (
                                    <tr
                                      onClick={handleClosingRedirect}
                                      key={element.id}
                                      style={{
                                        textAlign: "center",
                                        cursor: "pointer",
                                      }}
                                    >
                                      <td>{index + 1}</td>
                                      <td>{element.sellerleagal}</td>
                                      <td>{element.address}</td>
                                      <td>{element.buyer}</td>
                                      <td>{element.closingdate}</td>
                                      <td>{element.closingprice}</td>
                                      <td>{element.loanamount}</td>
                                      <td>{element.document}</td>
                                      <td>
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
                <TabPanel value="6" className="p-0">
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
                                  <strong> No. </strong>
                                </th>
                                <th>
                                  <strong>Seller</strong>
                                </th>
                                <th>
                                  <strong> Buyer</strong>
                                </th>
                                <th>
                                  <strong> Location</strong>
                                </th>
                                <th>
                                  <strong> Notes</strong>
                                </th>
                                <th>
                                  <strong> Price</strong>
                                </th>
                                <th>
                                  <strong> date</strong>
                                </th>

                                <th>
                                  {" "}
                                  <strong>Action</strong>
                                </th>
                              </tr>
                            </thead>
                            <tbody style={{ textAlign: "center" }}>
                              {SubdivisionDetails.landsales &&
                              Array.isArray(SubdivisionDetails.landsales) &&
                              SubdivisionDetails.landsales.length > 0 ? (
                                SubdivisionDetails.landsales.map(
                                  (element, index) => (
                                    <tr
                                      onClick={handleLandRedirect}
                                      key={element.id}
                                      style={{
                                        textAlign: "center",
                                        cursor: "pointer",
                                      }}
                                    >
                                      {" "}
                                      <td>{index + 1}</td>
                                      <td>{element.seller}</td>
                                      <td>{element.buyer}</td>
                                      <td>{element.location}</td>
                                      <td>{element.notes}</td>
                                      <td>{element.price}</td>
                                      <td>{element.date}</td>
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
            Manage Subdivision Fields Access{" "}
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
            Filter Subdivision{" "}
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
                                    STATUS:{" "}
                                    <span className="text-danger"></span>
                                  </label>
                                  <select
                                    className="default-select form-control"
                                    value={filterQuery.is_active}
                                    name="status"
                                    onChange={HandleFilter}
                                  >
                                    <option value="">All</option>
                                    <option value="1">Active</option>
                                    <option value="0">Sold Out</option>
                                    <option value="2">Future</option>
                                  </select>
                              </div>
                              <div className="col-md-3 mt-3">
                                  <label className="form-label">
                                    REPORTING:{" "}
                                    <span className="text-danger"></span>
                                  </label>
                                  <select
                                    className="default-select form-control"
                                    value={filterQuery.is_active}
                                    name="reporting"
                                    onChange={HandleFilter}
                                  >
                                    <option value="">All</option>
                                    <option value="1">Yes</option>
                                    <option value="0">No</option>
                                  </select>
                              </div>
                              <div className="col-md-3 mt-3">
                                <label className="form-label">
                                  BUILDER NAME:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input name="builder_name" className="form-control" value={filterQuery.builder_name} onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3">
                                <label className="form-label">
                                NAME :{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input  value={filterQuery.name} name="name" className="form-control"  onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3">
                              <label htmlFor="exampleFormControlInput6" className="form-label"> Product Type <span className="text-danger"></span></label>
                                    <select className="default-select form-control" name="product_type" onChange={HandleFilter} >
                                        <option value="">Select Product Type</option>
                                         <option value="DET">DET</option>
                                        <option value="ATT">ATT</option>
                                        <option value="HR">HR</option>
                                        <option value="AC">AC</option>
                                    </select> 
                              </div>
                              <div className="col-md-3 mt-3">
                                <label className="form-label">
                                AREA:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input name="area" value={filterQuery.area} className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3">
                                <label className="form-label">
                                MASTERPLAN:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input value={filterQuery.masterplan_id} name="masterplan_id" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3">
                                <label className="form-label">
                                ZIP CODE:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input value={filterQuery.zipcode} name="zipcode" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3">
                                <label className="form-label">
                                LOT WIDTH:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input type="number" name="lotwidth" value={filterQuery.lotwidth} className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3">
                                <label className="form-label">
                                LOT SIZE:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input type="lotsize" value={filterQuery.lotsize} name="avg_closings_per_month_this_year" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3">
                                <label className="form-label">
                                ZONING:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input  value={filterQuery.zoning} name="zoning" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3">
                              <label htmlFor="exampleFormControlInput8" className="form-label">AGE RESTRICTED</label>
                              <select className="default-select form-control" name="age" onChange={HandleFilter} >
                                    <option value="">Select age Restricted</option>
                                        <option value="1">Yes</option>
                                        <option value="0">No</option>
                              </select>    
                              </div>
                              <div className="col-md-3 mt-3 ">
                              <label htmlFor="exampleFormControlInput8" className="form-label">All SINGLE STORY<span className="text-danger">*</span></label>
                                    <select className="default-select form-control" name="single" onChange={HandleFilter} >
                                        <option value="">Select Story</option>
                                        <option value="1">Yes</option>
                                        <option value="0">No</option>
                                    </select>    
                              </div>
                              <div className="col-md-3 mt-3 mb-3">
                              <label htmlFor="exampleFormControlInput28" className="form-label">GATED<span className="text-danger">*</span></label>
                                    <select className="default-select form-control" 
                                    onChange={HandleFilter} 
                                    value={filterQuery.gated}
                                    name="gated"
                                    > 
                                        <option value="">Select Gate</option>
                                        <option value="1">Yes</option>
                                        <option value="0">No</option>
                                    </select>                                </div>
                              <div className="col-md-3 mt-3 mb-3">
                                <label className="form-label">
                                JURISDICTION:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input value={filterQuery.juridiction} name="juridiction" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3 mb-3">
                                <label className="form-label">
                                GAS PROVIDER:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input value={filterQuery.gasprovider} name="gasprovider" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3 mb-3">
                                <label className="form-label">
                                HOA FEE:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input value={filterQuery.hoafee} name="hoafee" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3 mb-3">
                                <label className="form-label">
                                MASTERPLAN FEE:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input value={filterQuery.masterplanfee} name="masterplanfee" className="form-control" onChange={HandleFilter}/>
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
      <SubdivisionOffcanvas
        ref={subdivision}
        Title="Add Subdivision"
        parentCallback={handleCallback}
      />
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

export default SubdivisionList;
