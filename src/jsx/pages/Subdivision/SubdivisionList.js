import React, { useState, useRef, useEffect,useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
import ColumnReOrderPopup from "../../popup/ColumnReOrderPopup";
import Select from "react-select";
import { Link } from 'react-router-dom';
import GoogleMapLocator from "./GoogleMapLocator";
import { MultiSelect } from "react-multi-select-component";


const SubdivisionList = () => {
  const [excelLoading, setExcelLoading] = useState(true);
  const handleSortCheckboxChange = (e, key) => {
    if (e.target.checked) {
        setSelectedCheckboxes(prev => [...prev, key]);
    } else {
        setSelectedCheckboxes(prev => prev.filter(item => item !== key));
    }
};
  const addToBuilderList = () => {
    navigate('/google-map-locator',{
      state: { subdivisionList: BuilderList },
    });
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
  const [selectAll, setSelectAll] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const resetSelection = () => {
    setSelectAll(false);
    setSelectedColumns([]);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPage = 100;
  const lastIndex = currentPage * recordsPage;
  const firstIndex = lastIndex - recordsPage;
  const [npage, setNpage] = useState(0);
  const number = [...Array(npage + 1).keys()].slice(1);

  const [filter, setFilter] = useState(false);
  const [normalFilter, setNormalFilter] = useState(false);

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
    masterplan_id:"",
    months_open:"",
    latest_lots_released:"",
    latest_standing_inventory:"",
    avg_sqft_all:"",
    avg_sqft_active:"",
    avg_base_price_all:"",
    avg_base_price_active:"",
    min_sqft_all:"",
    min_sqft_active:"",
    max_sqft_all:"",
    max_sqft_active:"",
    min_base_price_all:"",
    min_sqft_active_current:"",
    max_base_price_all:"",
    max_sqft_active_current:"",
    avg_net_traffic_per_month_this_year:"",
    avg_net_sales_per_month_this_year:"",
    avg_closings_per_month_this_year:"",
    avg_net_sales_per_month_since_open:"",
    avg_net_sales_per_month_last_three_months:"",
    sqft_group:"",
    price_group:"",
    month_net_sold:"",
    year_net_sold:"",
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

  const [openDialog, setOpenDialog] = useState(false);
  const [columns, setColumns] = useState([]);
  const [draggedColumns, setDraggedColumns] = useState(columns);

  const [totalClosingsOption, setTotalClosingsOption] = useState("");
  const [totalPermitsOption, setTotalPermitsOption] = useState("");
  const [totalNetSalesOption, setTotalNetSalesOption] = useState("");
  const [monthsOpenOption, setMonthsOpenOption] = useState("");
  const [latestLotsReleasedOption, setLatestLotsReleasedOption] = useState("");
  const [latestStandingInventoryOption, setLatestStandingInventoryOption] = useState("");
  const [unsoldLotsOption, setUnsoldLotsOption] = useState("");
  const [avgSqftAllOption, setAvgSqftAllOption] = useState("");
  const [avgSqftActiveOption, setAvgSqftActiveOption] = useState("");
  const [avgBasePriceAllOption, setAvgBasePriceAllOption] = useState("");
  const [avgBasePriceActiveOption, setAvgBasePriceActiveOption] = useState("");
  const [minSqftAllOption, setMinSqftAllOption] = useState("");
  const [maxSqftAllOption, setMaxSqftAllOption] = useState("");
  const [minBasePriceAllOption, setMinBasePriceAllOption] = useState("");
  const [minSqftActiveOption, setMinSqftActiveOption] = useState("");
  const [maxBasePriceAllOption, setMaxBasePriceAllOption] = useState("");
  const [maxSqftActiveOption, setMaxSqftActiveOption] = useState("");
  const [avgNetTrafficPerMonthThisYearOption, setAvgNetTrafficPerMonthThisYearOption] = useState("");
  const [avgNetSalesPerMonthThisYearOption, setAvgNetSalesPerMonthThisYearOption] = useState("");
  const [avgClosingsPerMonthThisYearOption, setAvgClosingsPerMonthThisYearOption] = useState("");
  const [avgNetSalesPerMonthSinceOpenOption, setAvgNetSalesPerMonthSinceOpenOption] = useState("");
  const [avgNetSalesPerMonthLastThreeMonthsOption, setAvgNetSalesPerMonthLastThreeMonthsOption] = useState("");
  const [monthNetSoldOption, setMonthNetSoldOption] = useState("");
  const [yearNetSoldOption, setYearNetSoldOption] = useState("");
  const [avgClosingPriceOption, setAvgClosingPriceOption] = useState("");
  const [permitsThisYearOption, setPermitsThisYearOption] = useState("");
  const [medianClosingPriceSinceOpenOption, setMedianClosingPriceSinceOpenOption] = useState("");
  const [medianClosingPriceThisYearOption, setMedianClosingPriceThisYearOption] = useState("");



  const [totalClosingsResult, setTotalClosingsResult] = useState(0);
  const [totalPermitsResult, setTotalPermitsResult] = useState(0);
  const [totalNetSalesResult, setTotalNetSalesResult] = useState(0);
  const [monthsOpenResult, setMonthsOpenResult] = useState(0);
  const [latestLotsReleasedResult, setLatestLotsReleasedResult] = useState(0);
  const [latestStandingInventoryResult, setLatestStandingInventoryResult] = useState(0);
  const [unsoldLotsResult, setUnsoldLotsResult] = useState(0);
  const [avgSqftAllResult, setAvgSqftAllResult] = useState(0);
  const [avgSqftActiveResult, setAvgSqftActiveResult] = useState(0);
  const [avgBasePriceAllResult, setAvgBasePriceAllResult] = useState(0);
  const [avgBasePriceActiveResult, setAvgBasePriceActiveResult] = useState(0);
  const [minSqftAllResult, setMinSqftAllResult] = useState(0);
  const [maxSqftAllResult, setMaxSqftAllResult] = useState(0);
  const [minBasePriceAllResult, setMinBasePriceAllResult] = useState(0);
  const [minSqftActiveResult, setMinSqftActiveResult] = useState(0);
  const [maxBasePriceAllResult, setMaxBasePriceAllResult] = useState(0);
  const [maxSqftActiveResult, setMaxSqftActiveResult] = useState(0);
  const [avgNetTrafficPerMonthThisYearResult, setAvgNetTrafficPerMonthThisYearResult] = useState(0);
  const [avgNetSalesPerMonthThisYearResult, setAvgNetSalesPerMonthThisYearResult] = useState(0);
  const [avgClosingsPerMonthThisYearResult, setAvgClosingsPerMonthThisYearResult] = useState(0);
  const [avgNetSalesPerMonthSinceOpenResult, setAvgNetSalesPerMonthSinceOpenResult] = useState(0);
  const [avgNetSalesPerMonthLastThreeMonthsResult, setAvgNetSalesPerMonthLastThreeMonthsResult] = useState(0);
  const [monthNetSoldResult, setMonthNetSoldResult] = useState(0);
  const [yearNetSoldResult, setYearNetSoldResult] = useState(0);
  const [avgClosingPriceResult, setAvgClosingPriceResult] = useState(0);
  const [permitsThisYearResult, setPermitsThisYearResult] = useState(0);
  const [medianClosingPriceSinceOpenResult, setMedianClosingPriceSinceOpenResult] = useState(0);
  const [medianClosingPriceThisYearResult, setMedianClosingPriceThisYearResult] = useState(0);

  const [selectedBuilderName, setSelectedBuilderName] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [selectedReporting, setSelectedReporting] = useState([]);
  const [selectedAge, setSelectedAge] = useState([]);
  const [selectedSingle, setSelectedSingle] = useState([]);
  const [selectedGated, setSelectedGated] = useState([]);
  const [productTypeStatus, setProductTypeStatus] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);

  const headers = [
    { label: 'Status', key: 'firstname' },
    { label: 'Reporting', key: 'lastname' },
    { label: 'Builder', key: 'nickname' },
    { label: 'Name', key: 'zipcode' },
    { label: 'Product Type', key: 'city' },
    { label: 'Area', key: 'with' },
    { label: 'Master Plan', key: 'without' },
    { label: 'Zipcode', key: 'reentries' },
    { label: 'Total Lots', key: 'rakes' },
    { label: 'Lot Width', key: 'firstname' },
    { label: 'Lot Size', key: 'lastname' },
    { label: 'Zoning', key: 'nickname' },
    { label: 'Age Restricted', key: 'zipcode' },
    { label: 'All Single Story', key: 'city' },
    { label: 'Gated', key: 'with' },
    { label: 'Cross Streets', key: 'without' },
    { label: 'Juridiction', key: 'reentries' },
    { label: 'Latitude', key: 'rakes' },
    { label: 'Longitude', key: 'zipcode' },
    { label: 'Gas Provider', key: 'city' },
    { label: 'HOA Fee', key: 'with' },
    { label: 'Master Plan Fee', key: 'without' },
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
    { label: 'Avg Traffic Per Month This Year', key: 'avg_net_traffic_per_month_this_year' },
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
    { label: 'Open Since', key: 'opensince' }

  ];
  const exportColumns = [
    { label: 'Status', key: 'is_active' },
    { label: 'Reporting', key: 'reporting' },
    { label: 'Builder', key: 'builder_name' },
    { label: 'Name', key: 'name' },
    { label: 'Product Type', key: 'product_type' },
    { label: 'Area', key: 'area' },
    { label: 'Master Plan', key: 'masteplan_id' },
    { label: 'Zip Code', key: 'zipcode' },
    { label: 'Total Lots', key: 'totallots' },
    { label: 'Lot Width', key: 'lotwidth' },
    { label: 'Lot Size', key: 'lotsize' },
    { label: 'Zoning', key: 'zoning' },
    { label: 'Age Restricted', key: 'age' },
    { label: 'All Single Story', key: 'single' },
    { label: 'Gated', key: 'gated' },
    { label: 'Cross Streets', key: 'location' },
    { label: 'Juridiction', key: 'juridiction' },
    { label: 'Latitude', key: 'lat' },
    { label: 'Longitude', key: 'lng' },
    { label: 'Gas Provider', key: 'gasprovider' },
    { label: 'HOA Fee', key: 'hoafee' },
    { label: 'Master Plan Fee', key: 'masterplanfee' },
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
    { label: 'Avg Traffic Per Month This Year', key: 'avg_net_traffic_per_month_this_year' },
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
    { label: 'Open Since', key: 'opensince' },
    { label: 'Avg Closing Price', key: 'avg_closing_price' },
    { label: 'Permits This Year', key: 'permit_this_year' },
    { label: 'Median Closing Price Since Open', key: 'median_closing_price_since_open' },
    { label: 'Median Closing Price This Year', key: 'median_closing_price_this_year' },
    { label: 'Date Added', key: 'created_at' },
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
    setSelectedColumns(updatedColumns);
    setSelectAll(updatedColumns.length === exportColumns.length);
  //   newdata.map((nw, i) =>
  //   [nw === "Name" ? row.firstname : '', nw === "Surname" ? row.lastname : '', nw === "Nickname" ? row.nickname : '', nw === "ZipCode" ? row.zipcode : '', nw === "City" ? row.city : '', nw === "Registrations with check-in" ? row.with : '', nw === "Registrations without check-in" ? row.without : '', nw === "Cumulated Buy-in bounty Re-entries" ? row.reentries : '', nw === "Cumulated rakes" ? row.rakes : '']
  // )
   

  };
  useEffect(() => {
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
          case "Master Plan":
            mappedRow[header] = row.masterplan_id;
            break;
          case "Zip Code":
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
          case "Cross Streets":
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
          case "Master Plan Fee":
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
          case "Date Added":
            mappedRow[header] = row.dateadded;
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
          case 'Avg Traffic Per Month This Year':
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
          case 'Open Since':
            mappedRow[header] = <DateComponent date={row.year_net_sold} /> ;
            break;
          case 'Avg Closing Price':
            mappedRow[header] = row.avg_closing_price;
            break;
          case 'Permits This Year':
            mappedRow[header] = row.permit_this_year;
            break;
          case 'Median Closing Price Since Open':
            mappedRow[header] = row.median_closing_price_since_open;
            break;
          case 'Median Closing Price This Year':
            mappedRow[header] = row.median_closing_price_this_year;
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

    resetSelection();
    setExportModelShow(false);
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
  console.log(BuilderList);

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

  const stringifySortConfig = (sortConfig) => {
    return sortConfig.map((sort) => `${sort.key}:${sort.direction}`).join(",");
  };
  const getbuilderlist = async (pageNumber) => {
    try {
      let sortConfigString = "";
      if (sortConfig !== null) {
        sortConfigString = "&sortConfig=" + stringifySortConfig(sortConfig);
      }
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
    setExcelLoading(false);
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

  const handleBulkDelete = async (id) => {
    try {
      let responseData = await AdminSubdevisionService.bulkdestroy(id).json();
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
      const response = await AdminBuilderService.builderDropDown();
      const responseData = await response.json();
      const formattedData = responseData.map((builder) => ({
        label: builder.name,
        value: builder.id,
      }));
      setBuilderListDropDown(formattedData);
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
      setFilter(true);
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
    setNormalFilter(true);
  };

  const HandleSelectChange = (selectedOption) => {
    setFilterQuery((prevFilterQuery) => ({
      ...prevFilterQuery,
      builder_name: selectedOption.name,
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
        masterplan_id:"",
        months_open:"",
        latest_lots_released:"",
        latest_standing_inventory:"",
        avg_sqft_all:"",
        avg_sqft_active:"",
        avg_base_price_all:"",
        avg_base_price_active:"",
        min_sqft_all:"",
        min_sqft_active:"",
        max_sqft_all:"",
        max_sqft_active:"",
        min_base_price_all:"",
        min_sqft_active_current:"",
        max_base_price_all:"",
        max_sqft_active_current:"",
        avg_traffic_per_month_this_year:"",
        avg_net_sales_per_month_this_year:"",
        avg_closings_per_month_this_year:"",
        avg_net_sales_per_month_since_open:"",
        avg_net_sales_per_month_last_three_months:"",
        sqft_group:"",
        price_group:"",
        month_net_sold:"",
        year_net_sold:""
      });
      getbuilderlist();
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

  const calculatedField = [
    {
      "Latest Lots Released": null,
      "Latest Standing Inventory": null,
      "Avg Sqft All": null,
      "Avg Sqft Active": null,
      "Avg Base Price All": null,
      "Avg Base Price Active": null,
      "Min Sqft All": null,
      "Min Sqft Active": null,
      "Max Sqft All": null,
      "Max Sqft Active": null,
      "Min Base Price All": null,
      "Min Base Price Active": null,
      "Max Base Price All": null,
      "Max Base Price Active": null,
      "Avg Traffic Per Month This Year": null,
      "Avg Net Sales Per Month This Year": null,
      "Avg Closings Per Month This Year": null,
      "Avg Net Sales Per Month Since Open": null,
      "Avg Net Sales Per Month Last 3 Month": null,
      "Month Net Sold": null,
      "Year Net Sold": null,
      'Total Closings':null,
      'Total Permits':null,
      'Total Net Sales':null,


    },
  ];
  

  // function handleLabelExist(lable)
  // {

  //     console.log(lable);
  //     console.log(calculatedField.some(field => field.hasOwnProperty(lable)));

  //     return calculatedField.some(field => field.hasOwnProperty(lable));
 
  // }

  // const totalSumFields = (label) => {
  //   console.log(AllBuilderListExport);
  //   console.log(label);
  
  //   // return 0 if the label doesn't exist
  //   if (!handleLabelExist(label)) {
  //     return 0;
  //   }
  
  //   label = label.toLowerCase().replace(/\s+/g, '_');
  
  //   const sum = AllBuilderListExport.reduce((sum, builder) => {
  //     return sum + (builder[label] || 0);
  //   }, 0);
  
  //   return sum.toFixed(2);
  // };
  



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
      const response = await AdminSubdevisionService.accessField();
      const responseData = await response.json();
      setAccessList(responseData);
    } catch (error) {
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
        const inputData = {
          csv: iFile,
        };

        console.log(inputData);
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
    if(AllBuilderListExport.length === 0){
      setBuilderList(BuilderList);;
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

    filtered = applyNumberFilter(filtered, filterQuery.months_open, 'months_open');
    filtered = applyNumberFilter(filtered, filterQuery.latest_lots_released, 'latest_lots_released');
    filtered = applyNumberFilter(filtered, filterQuery.latest_standing_inventory, 'latest_standing_inventory');
    filtered = applyNumberFilter(filtered, filterQuery.avg_sqft_all, 'avg_sqft_all');
    filtered = applyNumberFilter(filtered, filterQuery.avg_sqft_active, 'avg_sqft_active');
    filtered = applyNumberFilter(filtered, filterQuery.avg_base_price_all, 'avg_base_price_all');
    filtered = applyNumberFilter(filtered, filterQuery.avg_base_price_active, 'avg_base_price_active');
    filtered = applyNumberFilter(filtered, filterQuery.min_sqft_all, 'min_sqft_all');
    filtered = applyNumberFilter(filtered, filterQuery.min_sqft_active, 'min_sqft_active');
    filtered = applyNumberFilter(filtered, filterQuery.max_sqft_all, 'max_sqft_all');
    filtered = applyNumberFilter(filtered, filterQuery.max_sqft_active, 'max_sqft_active');
    filtered = applyNumberFilter(filtered, filterQuery.min_base_price_all, 'min_base_price_all');
    filtered = applyNumberFilter(filtered, filterQuery.min_sqft_active_current, 'min_sqft_active_current');
    filtered = applyNumberFilter(filtered, filterQuery.max_base_price_all, 'max_base_price_all');
    filtered = applyNumberFilter(filtered, filterQuery.max_sqft_active_current, 'max_sqft_active_current');
    filtered = applyNumberFilter(filtered, filterQuery.avg_net_traffic_per_month_this_year, 'avg_net_traffic_per_month_this_year');
    filtered = applyNumberFilter(filtered, filterQuery.avg_net_sales_per_month_this_year, 'avg_net_sales_per_month_this_year');
    filtered = applyNumberFilter(filtered, filterQuery.avg_closings_per_month_this_year, 'avg_closings_per_month_this_year');
    filtered = applyNumberFilter(filtered, filterQuery.avg_net_sales_per_month_since_open, 'avg_net_sales_per_month_since_open');
    filtered = applyNumberFilter(filtered, filterQuery.avg_net_sales_per_month_last_three_months, 'avg_net_sales_per_month_last_three_months');
    filtered = applyNumberFilter(filtered, filterQuery.month_net_sold, 'month_net_sold');
    filtered = applyNumberFilter(filtered, filterQuery.year_net_sold, 'year_net_sold');

    if (filterQuery.sqft_group) {
      filtered = filtered.filter((item) =>
        item.sqft_group.toString().includes(filterQuery.sqft_group)
      );
    }
    if (filterQuery.price_group) {
      filtered = filtered.filter((item) =>
        item.price_group.toString().includes(filterQuery.price_group)
      );
    }

    const isAnyFilterApplied = Object.values(filterQuery).some(query => query !== "");

    if (isAnyFilterApplied && !normalFilter) {
      setBuilderList(filtered.slice(0, 100));
      setFilter(true);
      setNormalFilter(false);
    } else {
      setBuilderList(filtered.slice(0, 100));
      setCurrentPage(1);
      setFilter(false);
      setNormalFilter(false);
      setTotalClosingsOption("");
      setTotalPermitsOption("");
      setTotalNetSalesOption("");
      setMonthsOpenOption("");
      setLatestLotsReleasedOption("");
      setLatestStandingInventoryOption("");
      setUnsoldLotsOption("");
      setAvgSqftAllOption("");
      setAvgSqftActiveOption("");
      setAvgBasePriceAllOption("");
      setAvgBasePriceActiveOption("");
      setMinSqftAllOption("");
      setMaxSqftAllOption("");
      setMinBasePriceAllOption("");
      setMinSqftActiveOption("");
      setMaxBasePriceAllOption("");
      setMaxSqftActiveOption("");
      setAvgNetTrafficPerMonthThisYearOption("");
      setAvgNetSalesPerMonthThisYearOption("");
      setAvgClosingsPerMonthThisYearOption("");
      setAvgNetSalesPerMonthSinceOpenOption("");
      setAvgNetSalesPerMonthLastThreeMonthsOption("");
      setMonthNetSoldOption("");
      setYearNetSoldOption("");
      setTotalClosingsResult(0);
      setTotalPermitsResult(0);
      setTotalNetSalesResult(0);
      setMonthsOpenResult(0);
      setLatestLotsReleasedResult(0);
      setLatestStandingInventoryResult(0);
      setUnsoldLotsResult(0);
      setAvgSqftAllResult(0);
      setAvgSqftActiveResult(0);
      setAvgBasePriceAllResult(0);
      setAvgBasePriceActiveResult(0);
      setMinSqftAllResult(0);
      setMaxSqftAllResult(0);
      setMinBasePriceAllResult(0);
      setMinSqftActiveResult(0);
      setMaxBasePriceAllResult(0);
      setMaxSqftActiveResult(0);
      setAvgNetTrafficPerMonthThisYearResult(0);
      setAvgNetSalesPerMonthThisYearResult(0);
      setAvgClosingsPerMonthThisYearResult(0);
      setAvgNetSalesPerMonthSinceOpenResult(0);
      setAvgNetSalesPerMonthLastThreeMonthsResult(0);
      setMonthNetSoldResult(0);
      setYearNetSoldResult(0);
    }

    setBuilderList(filtered);
  };
  
  useEffect(() => {
    applyFilters();
  }, [filterQuery]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilterQuery(prevFilterQuery => ({
      ...prevFilterQuery,
      [name]: value
    }));
    setFilter(true);
    setNormalFilter(false);
  };

  const totalSumFields = (field) => {
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
      } else{
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.total_net_sales || 0);
        }, 0);
      }
    }
    if(field == "months_open") {
      if(filter){
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.months_open || 0);
        }, 0);
      } else{
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.months_open || 0);
        }, 0);
      }
    }
    if(field == "latest_lots_released") {
      if(filter){
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.latest_lots_released || 0);
        }, 0);
      } else{
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.latest_lots_released || 0);
        }, 0);
      }
    }
    if(field == "latest_standing_inventory") {
      if(filter){
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.latest_standing_inventory || 0);
        }, 0);
      } else{
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.latest_standing_inventory || 0);
        }, 0);
      }
    }
    if(field == "unsold_lots") {
      if(filter){
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.unsold_lots || 0);
        }, 0);
      } else{
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.unsold_lots || 0);
        }, 0);
      }
    }
    if(field == "avg_sqft_all") {
      if(filter){
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.avg_sqft_all || 0);
        }, 0);
      } else{
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.avg_sqft_all || 0);
        }, 0);
      }
    }
    if(field == "avg_sqft_active") {
      if(filter){
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.avg_sqft_active || 0);
        }, 0);
      } else{
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.avg_sqft_active || 0);
        }, 0);
      }
    }
    if(field == "avg_base_price_all") {
      if(filter){
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.avg_base_price_all || 0);
        }, 0);
      } else{
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.avg_base_price_all || 0);
        }, 0);
      }
    }
    if(field == "avg_base_price_active") {
      if(filter){
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.avg_base_price_active || 0);
        }, 0);
      } else{
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.avg_base_price_active || 0);
        }, 0);
      }
    }
    if(field == "min_sqft_all") {
      if(filter){
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.min_sqft_all || 0);
        }, 0);
      } else{
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.min_sqft_all || 0);
        }, 0);
      }
    }
    if(field == "max_sqft_all") {
      if(filter){
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.max_sqft_all || 0);
        }, 0);
      } else{
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.max_sqft_all || 0);
        }, 0);
      }
    }
    if(field == "min_base_price_all") {
      if(filter){
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.min_base_price_all || 0);
        }, 0);
      } else{
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.min_base_price_all || 0);
        }, 0);
      }
    }
    if(field == "min_sqft_active") {
      if(filter){
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.min_sqft_active || 0);
        }, 0);
      } else{
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.min_sqft_active || 0);
        }, 0);
      }
    }
    if(field == "max_base_price_all") {
      if(filter){
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.max_base_price_all || 0);
        }, 0);
      } else{
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.max_base_price_all || 0);
        }, 0);
      }
    }
    if(field == "max_sqft_active") {
      if(filter){
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.max_sqft_active || 0);
        }, 0);
      } else{
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.max_sqft_active || 0);
        }, 0);
      }
    }
    if(field == "avg_net_traffic_per_month_this_year") {
      if(filter){
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.avg_net_traffic_per_month_this_year || 0);
        }, 0);
      } else{
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.avg_net_traffic_per_month_this_year || 0);
        }, 0);
      }
    }
    if(field == "avg_net_sales_per_month_this_year") {
      if(filter){
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.avg_net_sales_per_month_this_year || 0);
        }, 0);
      } else{
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
      } else{
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.avg_closings_per_month_this_year || 0);
        }, 0);
      }
    }
    if(field == "avg_net_sales_per_month_since_open") {
      if(filter){
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.avg_net_sales_per_month_since_open || 0);
        }, 0);
      } else{
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.avg_net_sales_per_month_since_open || 0);
        }, 0);
      }
    }
    if(field == "avg_net_sales_per_month_last_three_months") {
      if(filter){
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.avg_net_sales_per_month_last_three_months || 0);
        }, 0);
      } else{
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.avg_net_sales_per_month_last_three_months || 0);
        }, 0);
      }
    }
    if(field == "month_net_sold") {
      if(filter){
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.month_net_sold || 0);
        }, 0);
      } else{
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.month_net_sold || 0);
        }, 0);
      }
    }
    if(field == "year_net_sold") {
      if(filter){
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.year_net_sold || 0);
        }, 0);
      } else{
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.year_net_sold || 0);
        }, 0);
      }
    }
    if(field == "avg_closing_price") {
      if(filter){
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.avg_closing_price || 0);
        }, 0);
      } else{
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.avg_closing_price || 0);
        }, 0);
      }
    }
    if(field == "permit_this_year") {
      if(filter){
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.permit_this_year || 0);
        }, 0);
      } else{
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.permit_this_year || 0);
        }, 0);
      }
    }
    if(field == "median_closing_price_since_open") {
      if(filter){
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.median_closing_price_since_open || 0);
        }, 0);
      } else{
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.median_closing_price_since_open || 0);
        }, 0);
      }
    }
    if(field == "median_closing_price_this_year") {
      if(filter){
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.median_closing_price_this_year || 0);
        }, 0);
      } else{
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.median_closing_price_this_year || 0);
        }, 0);
      }
    }
  };

  const averageFields = (field) => {
    const sum = totalSumFields(field);
    if(filter){
      return sum / BuilderList.length;
    } else{
      return sum / AllBuilderListExport.length;
    }
  };

  const handleSelectChange = (e, field) => {
    const value = e.target.value;
    
    switch (field) {
      case "total_closings":
        setTotalClosingsOption(value);
        setTotalPermitsOption("");
        setTotalNetSalesOption("");
        setMonthsOpenOption("");
        setLatestLotsReleasedOption("");
        setLatestStandingInventoryOption("");
        setUnsoldLotsOption("");
        setAvgSqftAllOption("");
        setAvgSqftActiveOption("");
        setAvgBasePriceAllOption("");
        setAvgBasePriceActiveOption("");
        setMinSqftAllOption("");
        setMaxSqftAllOption("");
        setMinBasePriceAllOption("");
        setMinSqftActiveOption("");
        setMaxBasePriceAllOption("");
        setMaxSqftActiveOption("");
        setAvgNetTrafficPerMonthThisYearOption("");
        setAvgNetSalesPerMonthThisYearOption("");
        setAvgClosingsPerMonthThisYearOption("");
        setAvgNetSalesPerMonthSinceOpenOption("");
        setAvgNetSalesPerMonthLastThreeMonthsOption("");
        setMonthNetSoldOption("");
        setYearNetSoldOption("");
        setAvgClosingPriceOption("");
        setPermitsThisYearOption("");
        setMedianClosingPriceSinceOpenOption("");
        setMedianClosingPriceThisYearOption("");

        setTotalPermitsResult(0);
        setTotalNetSalesResult(0);
        setMonthsOpenResult(0);
        setLatestLotsReleasedResult(0);
        setLatestStandingInventoryResult(0);
        setUnsoldLotsResult(0);
        setAvgSqftAllResult(0);
        setAvgSqftActiveResult(0);
        setAvgBasePriceAllResult(0);
        setAvgBasePriceActiveResult(0);
        setMinSqftAllResult(0);
        setMaxSqftAllResult(0);
        setMinBasePriceAllResult(0);
        setMinSqftActiveResult(0);
        setMaxBasePriceAllResult(0);
        setMaxSqftActiveResult(0);
        setAvgNetTrafficPerMonthThisYearResult(0);
        setAvgNetSalesPerMonthThisYearResult(0);
        setAvgClosingsPerMonthThisYearResult(0);
        setAvgNetSalesPerMonthSinceOpenResult(0);
        setAvgNetSalesPerMonthLastThreeMonthsResult(0);
        setMonthNetSoldResult(0);
        setYearNetSoldResult(0);
        setAvgClosingPriceResult(0);
        setPermitsThisYearResult(0);
        setMedianClosingPriceSinceOpenResult(0);
        setMedianClosingPriceThisYearResult(0);

        if (value === 'sum') {
          setTotalClosingsResult(totalSumFields(field));
        } else if (value === 'avg') {
          setTotalClosingsResult(averageFields(field));
        }
        break;

      case "total_permits":
        setTotalPermitsOption(value);
        setTotalClosingsOption("");
        setTotalNetSalesOption("");
        setMonthsOpenOption("");
        setLatestLotsReleasedOption("");
        setLatestStandingInventoryOption("");
        setUnsoldLotsOption("");
        setAvgSqftAllOption("");
        setAvgSqftActiveOption("");
        setAvgBasePriceAllOption("");
        setAvgBasePriceActiveOption("");
        setMinSqftAllOption("");
        setMaxSqftAllOption("");
        setMinBasePriceAllOption("");
        setMinSqftActiveOption("");
        setMaxBasePriceAllOption("");
        setMaxSqftActiveOption("");
        setAvgNetTrafficPerMonthThisYearOption("");
        setAvgNetSalesPerMonthThisYearOption("");
        setAvgClosingsPerMonthThisYearOption("");
        setAvgNetSalesPerMonthSinceOpenOption("");
        setAvgNetSalesPerMonthLastThreeMonthsOption("");
        setMonthNetSoldOption("");
        setYearNetSoldOption("");
        setAvgClosingPriceOption("");
        setPermitsThisYearOption("");
        setMedianClosingPriceSinceOpenOption("");
        setMedianClosingPriceThisYearOption("");

        setTotalClosingsResult(0);
        setTotalNetSalesResult(0);
        setMonthsOpenResult(0);
        setLatestLotsReleasedResult(0);
        setLatestStandingInventoryResult(0);
        setUnsoldLotsResult(0);
        setAvgSqftAllResult(0);
        setAvgSqftActiveResult(0);
        setAvgBasePriceAllResult(0);
        setAvgBasePriceActiveResult(0);
        setMinSqftAllResult(0);
        setMaxSqftAllResult(0);
        setMinBasePriceAllResult(0);
        setMinSqftActiveResult(0);
        setMaxBasePriceAllResult(0);
        setMaxSqftActiveResult(0);
        setAvgNetTrafficPerMonthThisYearResult(0);
        setAvgNetSalesPerMonthThisYearResult(0);
        setAvgClosingsPerMonthThisYearResult(0);
        setAvgNetSalesPerMonthSinceOpenResult(0);
        setAvgNetSalesPerMonthLastThreeMonthsResult(0);
        setMonthNetSoldResult(0);
        setYearNetSoldResult(0);
        setAvgClosingPriceResult(0);
        setPermitsThisYearResult(0);
        setMedianClosingPriceSinceOpenResult(0);
        setMedianClosingPriceThisYearResult(0);

        if (value === 'sum') {
          setTotalPermitsResult(totalSumFields(field));
        } else if (value === 'avg') {
          setTotalPermitsResult(averageFields(field));
        }
        break;

      case "total_net_sales":
        setTotalNetSalesOption(value);
        setTotalClosingsOption("");
        setTotalPermitsOption("");
        setMonthsOpenOption("");
        setLatestLotsReleasedOption("");
        setLatestStandingInventoryOption("");
        setUnsoldLotsOption("");
        setAvgSqftAllOption("");
        setAvgSqftActiveOption("");
        setAvgBasePriceAllOption("");
        setAvgBasePriceActiveOption("");
        setMinSqftAllOption("");
        setMaxSqftAllOption("");
        setMinBasePriceAllOption("");
        setMinSqftActiveOption("");
        setMaxBasePriceAllOption("");
        setMaxSqftActiveOption("");
        setAvgNetTrafficPerMonthThisYearOption("");
        setAvgNetSalesPerMonthThisYearOption("");
        setAvgClosingsPerMonthThisYearOption("");
        setAvgNetSalesPerMonthSinceOpenOption("");
        setAvgNetSalesPerMonthLastThreeMonthsOption("");
        setMonthNetSoldOption("");
        setYearNetSoldOption("");
        setAvgClosingPriceOption("");
        setPermitsThisYearOption("");
        setMedianClosingPriceSinceOpenOption("");
        setMedianClosingPriceThisYearOption("");

        setTotalClosingsResult(0);
		    setTotalPermitsResult(0);
        setMonthsOpenResult(0);
        setLatestLotsReleasedResult(0);
        setLatestStandingInventoryResult(0);
        setUnsoldLotsResult(0);
        setAvgSqftAllResult(0);
        setAvgSqftActiveResult(0);
        setAvgBasePriceAllResult(0);
        setAvgBasePriceActiveResult(0);
        setMinSqftAllResult(0);
        setMaxSqftAllResult(0);
        setMinBasePriceAllResult(0);
        setMinSqftActiveResult(0);
        setMaxBasePriceAllResult(0);
        setMaxSqftActiveResult(0);
        setAvgNetTrafficPerMonthThisYearResult(0);
        setAvgNetSalesPerMonthThisYearResult(0);
        setAvgClosingsPerMonthThisYearResult(0);
        setAvgNetSalesPerMonthSinceOpenResult(0);
        setAvgNetSalesPerMonthLastThreeMonthsResult(0);
        setMonthNetSoldResult(0);
        setYearNetSoldResult(0);
        setAvgClosingPriceResult(0);
        setPermitsThisYearResult(0);
        setMedianClosingPriceSinceOpenResult(0);
        setMedianClosingPriceThisYearResult(0);

        if (value === 'sum') {
          setTotalNetSalesResult(totalSumFields(field));
        } else if (value === 'avg') {
          setTotalNetSalesResult(averageFields(field));
        }
        break;

      case "months_open":
        setMonthsOpenOption(value);
        setTotalClosingsOption("");
        setTotalPermitsOption("");
        setTotalNetSalesOption("");
        setLatestLotsReleasedOption("");
        setLatestStandingInventoryOption("");
        setUnsoldLotsOption("");
        setAvgSqftAllOption("");
        setAvgSqftActiveOption("");
        setAvgBasePriceAllOption("");
        setAvgBasePriceActiveOption("");
        setMinSqftAllOption("");
        setMaxSqftAllOption("");
        setMinBasePriceAllOption("");
        setMinSqftActiveOption("");
        setMaxBasePriceAllOption("");
        setMaxSqftActiveOption("");
        setAvgNetTrafficPerMonthThisYearOption("");
        setAvgNetSalesPerMonthThisYearOption("");
        setAvgClosingsPerMonthThisYearOption("");
        setAvgNetSalesPerMonthSinceOpenOption("");
        setAvgNetSalesPerMonthLastThreeMonthsOption("");
        setMonthNetSoldOption("");
        setYearNetSoldOption("");
        setAvgClosingPriceOption("");
        setPermitsThisYearOption("");
        setMedianClosingPriceSinceOpenOption("");
        setMedianClosingPriceThisYearOption("");

        setTotalClosingsResult(0);
        setTotalPermitsResult(0);
        setTotalNetSalesResult(0);
        setLatestLotsReleasedResult(0);
        setLatestStandingInventoryResult(0);
        setUnsoldLotsResult(0);
        setAvgSqftAllResult(0);
        setAvgSqftActiveResult(0);
        setAvgBasePriceAllResult(0);
        setAvgBasePriceActiveResult(0);
        setMinSqftAllResult(0);
        setMaxSqftAllResult(0);
        setMinBasePriceAllResult(0);
        setMinSqftActiveResult(0);
        setMaxBasePriceAllResult(0);
        setMaxSqftActiveResult(0);
        setAvgNetTrafficPerMonthThisYearResult(0);
        setAvgNetSalesPerMonthThisYearResult(0);
        setAvgClosingsPerMonthThisYearResult(0);
        setAvgNetSalesPerMonthSinceOpenResult(0);
        setAvgNetSalesPerMonthLastThreeMonthsResult(0);
        setMonthNetSoldResult(0);
        setYearNetSoldResult(0);
        setAvgClosingPriceResult(0);
        setPermitsThisYearResult(0);
        setMedianClosingPriceSinceOpenResult(0);
        setMedianClosingPriceThisYearResult(0);

        if (value === 'sum') {
          setMonthsOpenResult(totalSumFields(field));
        } else if (value === 'avg') {
          setMonthsOpenResult(averageFields(field));
        }
        break;

      case "latest_lots_released":
        setLatestLotsReleasedOption(value);
        setTotalClosingsOption("");
        setTotalPermitsOption("");
        setTotalNetSalesOption("");
        setMonthsOpenOption("");
        setLatestStandingInventoryOption("");
        setUnsoldLotsOption("");
        setAvgSqftAllOption("");
        setAvgSqftActiveOption("");
        setAvgBasePriceAllOption("");
        setAvgBasePriceActiveOption("");
        setMinSqftAllOption("");
        setMaxSqftAllOption("");
        setMinBasePriceAllOption("");
        setMinSqftActiveOption("");
        setMaxBasePriceAllOption("");
        setMaxSqftActiveOption("");
        setAvgNetTrafficPerMonthThisYearOption("");
        setAvgNetSalesPerMonthThisYearOption("");
        setAvgClosingsPerMonthThisYearOption("");
        setAvgNetSalesPerMonthSinceOpenOption("");
        setAvgNetSalesPerMonthLastThreeMonthsOption("");
        setMonthNetSoldOption("");
        setYearNetSoldOption("");
        setAvgClosingPriceOption("");
        setPermitsThisYearOption("");
        setMedianClosingPriceSinceOpenOption("");
        setMedianClosingPriceThisYearOption("");

        setTotalClosingsResult(0);
        setTotalPermitsResult(0);
        setTotalNetSalesResult(0);
        setMonthsOpenResult(0);
        setLatestStandingInventoryResult(0);
        setUnsoldLotsResult(0);
        setAvgSqftAllResult(0);
        setAvgSqftActiveResult(0);
        setAvgBasePriceAllResult(0);
        setAvgBasePriceActiveResult(0);
        setMinSqftAllResult(0);
        setMaxSqftAllResult(0);
        setMinBasePriceAllResult(0);
        setMinSqftActiveResult(0);
        setMaxBasePriceAllResult(0);
        setMaxSqftActiveResult(0);
        setAvgNetTrafficPerMonthThisYearResult(0);
        setAvgNetSalesPerMonthThisYearResult(0);
        setAvgClosingsPerMonthThisYearResult(0);
        setAvgNetSalesPerMonthSinceOpenResult(0);
        setAvgNetSalesPerMonthLastThreeMonthsResult(0);
        setMonthNetSoldResult(0);
        setYearNetSoldResult(0);
        setAvgClosingPriceResult(0);
        setPermitsThisYearResult(0);
        setMedianClosingPriceSinceOpenResult(0);
        setMedianClosingPriceThisYearResult(0);

        if (value === 'sum') {
          setLatestLotsReleasedResult(totalSumFields(field));
        } else if (value === 'avg') {
          setLatestLotsReleasedResult(averageFields(field));
        }
        break;

      case "latest_standing_inventory":
        setLatestStandingInventoryOption(value);
        setTotalClosingsOption("");
        setTotalPermitsOption("");
        setTotalNetSalesOption("");
        setMonthsOpenOption("");
        setLatestLotsReleasedOption("");
        setUnsoldLotsOption("");
        setAvgSqftAllOption("");
        setAvgSqftActiveOption("");
        setAvgBasePriceAllOption("");
        setAvgBasePriceActiveOption("");
        setMinSqftAllOption("");
        setMaxSqftAllOption("");
        setMinBasePriceAllOption("");
        setMinSqftActiveOption("");
        setMaxBasePriceAllOption("");
        setMaxSqftActiveOption("");
        setAvgNetTrafficPerMonthThisYearOption("");
        setAvgNetSalesPerMonthThisYearOption("");
        setAvgClosingsPerMonthThisYearOption("");
        setAvgNetSalesPerMonthSinceOpenOption("");
        setAvgNetSalesPerMonthLastThreeMonthsOption("");
        setMonthNetSoldOption("");
        setYearNetSoldOption("");
        setAvgClosingPriceOption("");
        setPermitsThisYearOption("");
        setMedianClosingPriceSinceOpenOption("");
        setMedianClosingPriceThisYearOption("");

        setTotalClosingsResult(0);
        setTotalPermitsResult(0);
        setTotalNetSalesResult(0);
        setMonthsOpenResult(0);
        setLatestLotsReleasedResult(0);
        setUnsoldLotsResult(0);
        setAvgSqftAllResult(0);
        setAvgSqftActiveResult(0);
        setAvgBasePriceAllResult(0);
        setAvgBasePriceActiveResult(0);
        setMinSqftAllResult(0);
        setMaxSqftAllResult(0);
        setMinBasePriceAllResult(0);
        setMinSqftActiveResult(0);
        setMaxBasePriceAllResult(0);
        setMaxSqftActiveResult(0);
        setAvgNetTrafficPerMonthThisYearResult(0);
        setAvgNetSalesPerMonthThisYearResult(0);
        setAvgClosingsPerMonthThisYearResult(0);
        setAvgNetSalesPerMonthSinceOpenResult(0);
        setAvgNetSalesPerMonthLastThreeMonthsResult(0);
        setMonthNetSoldResult(0);
        setYearNetSoldResult(0);
        setAvgClosingPriceResult(0);
        setPermitsThisYearResult(0);
        setMedianClosingPriceSinceOpenResult(0);
        setMedianClosingPriceThisYearResult(0);

        if (value === 'sum') {
          setLatestStandingInventoryResult(totalSumFields(field));
        } else if (value === 'avg') {
          setLatestStandingInventoryResult(averageFields(field));
        }
        break;

      case "unsold_lots":
        setUnsoldLotsOption(value);
        setTotalClosingsOption("");
        setTotalPermitsOption("");
        setTotalNetSalesOption("");
        setMonthsOpenOption("");
        setLatestLotsReleasedOption("");
        setLatestStandingInventoryOption("");
        setAvgSqftAllOption("");
        setAvgSqftActiveOption("");
        setAvgBasePriceAllOption("");
        setAvgBasePriceActiveOption("");
        setMinSqftAllOption("");
        setMaxSqftAllOption("");
        setMinBasePriceAllOption("");
        setMinSqftActiveOption("");
        setMaxBasePriceAllOption("");
        setMaxSqftActiveOption("");
        setAvgNetTrafficPerMonthThisYearOption("");
        setAvgNetSalesPerMonthThisYearOption("");
        setAvgClosingsPerMonthThisYearOption("");
        setAvgNetSalesPerMonthSinceOpenOption("");
        setAvgNetSalesPerMonthLastThreeMonthsOption("");
        setMonthNetSoldOption("");
        setYearNetSoldOption("");
        setAvgClosingPriceOption("");
        setPermitsThisYearOption("");
        setMedianClosingPriceSinceOpenOption("");
        setMedianClosingPriceThisYearOption("");

        setTotalClosingsResult(0);
        setTotalPermitsResult(0);
        setTotalNetSalesResult(0);
        setMonthsOpenResult(0);
        setLatestLotsReleasedResult(0);
        setLatestStandingInventoryResult(0);
        setAvgSqftAllResult(0);
        setAvgSqftActiveResult(0);
        setAvgBasePriceAllResult(0);
        setAvgBasePriceActiveResult(0);
        setMinSqftAllResult(0);
        setMaxSqftAllResult(0);
        setMinBasePriceAllResult(0);
        setMinSqftActiveResult(0);
        setMaxBasePriceAllResult(0);
        setMaxSqftActiveResult(0);
        setAvgNetTrafficPerMonthThisYearResult(0);
        setAvgNetSalesPerMonthThisYearResult(0);
        setAvgClosingsPerMonthThisYearResult(0);
        setAvgNetSalesPerMonthSinceOpenResult(0);
        setAvgNetSalesPerMonthLastThreeMonthsResult(0);
        setMonthNetSoldResult(0);
        setYearNetSoldResult(0);
        setAvgClosingPriceResult(0);
        setPermitsThisYearResult(0);
        setMedianClosingPriceSinceOpenResult(0);
        setMedianClosingPriceThisYearResult(0);

        if (value === 'sum') {
          setUnsoldLotsResult(totalSumFields(field));
        } else if (value === 'avg') {
          setUnsoldLotsResult(averageFields(field));
        }
        break;

      case "avg_sqft_all":
        setAvgSqftAllOption(value);
        setTotalClosingsOption("");
        setTotalPermitsOption("");
        setTotalNetSalesOption("");
        setMonthsOpenOption("");
        setLatestLotsReleasedOption("");
        setLatestStandingInventoryOption("");
        setUnsoldLotsOption("");
        setAvgSqftActiveOption("");
        setAvgBasePriceAllOption("");
        setAvgBasePriceActiveOption("");
        setMinSqftAllOption("");
        setMaxSqftAllOption("");
        setMinBasePriceAllOption("");
        setMinSqftActiveOption("");
        setMaxBasePriceAllOption("");
        setMaxSqftActiveOption("");
        setAvgNetTrafficPerMonthThisYearOption("");
        setAvgNetSalesPerMonthThisYearOption("");
        setAvgClosingsPerMonthThisYearOption("");
        setAvgNetSalesPerMonthSinceOpenOption("");
        setAvgNetSalesPerMonthLastThreeMonthsOption("");
        setMonthNetSoldOption("");
        setYearNetSoldOption("");
        setAvgClosingPriceOption("");
        setPermitsThisYearOption("");
        setMedianClosingPriceSinceOpenOption("");
        setMedianClosingPriceThisYearOption("");

        setTotalClosingsResult(0);
        setTotalPermitsResult(0);
        setTotalNetSalesResult(0);
        setMonthsOpenResult(0);
        setLatestLotsReleasedResult(0);
        setLatestStandingInventoryResult(0);
        setUnsoldLotsResult(0);
        setAvgSqftActiveResult(0);
        setAvgBasePriceAllResult(0);
        setAvgBasePriceActiveResult(0);
        setMinSqftAllResult(0);
        setMaxSqftAllResult(0);
        setMinBasePriceAllResult(0);
        setMinSqftActiveResult(0);
        setMaxBasePriceAllResult(0);
        setMaxSqftActiveResult(0);
        setAvgNetTrafficPerMonthThisYearResult(0);
        setAvgNetSalesPerMonthThisYearResult(0);
        setAvgClosingsPerMonthThisYearResult(0);
        setAvgNetSalesPerMonthSinceOpenResult(0);
        setAvgNetSalesPerMonthLastThreeMonthsResult(0);
        setMonthNetSoldResult(0);
        setYearNetSoldResult(0);
        setAvgClosingPriceResult(0);
        setPermitsThisYearResult(0);
        setMedianClosingPriceSinceOpenResult(0);
        setMedianClosingPriceThisYearResult(0);

        if (value === 'sum') {
          setAvgSqftAllResult(totalSumFields(field));
        } else if (value === 'avg') {
          setAvgSqftAllResult(averageFields(field));
        }
        break;

      case "avg_sqft_active":
        setAvgSqftActiveOption(value);
        setTotalClosingsOption("");
        setTotalPermitsOption("");
        setTotalNetSalesOption("");
        setMonthsOpenOption("");
        setLatestLotsReleasedOption("");
        setLatestStandingInventoryOption("");
        setUnsoldLotsOption("");
        setAvgSqftAllOption("");
        setAvgBasePriceAllOption("");
        setAvgBasePriceActiveOption("");
        setMinSqftAllOption("");
        setMaxSqftAllOption("");
        setMinBasePriceAllOption("");
        setMinSqftActiveOption("");
        setMaxBasePriceAllOption("");
        setMaxSqftActiveOption("");
        setAvgNetTrafficPerMonthThisYearOption("");
        setAvgNetSalesPerMonthThisYearOption("");
        setAvgClosingsPerMonthThisYearOption("");
        setAvgNetSalesPerMonthSinceOpenOption("");
        setAvgNetSalesPerMonthLastThreeMonthsOption("");
        setMonthNetSoldOption("");
        setYearNetSoldOption("");
        setAvgClosingPriceOption("");
        setPermitsThisYearOption("");
        setMedianClosingPriceSinceOpenOption("");
        setMedianClosingPriceThisYearOption("");

        setTotalClosingsResult(0);
        setTotalPermitsResult(0);
        setTotalNetSalesResult(0);
        setMonthsOpenResult(0);
        setLatestLotsReleasedResult(0);
        setLatestStandingInventoryResult(0);
        setUnsoldLotsResult(0);
        setAvgSqftAllResult(0);
        setAvgBasePriceAllResult(0);
        setAvgBasePriceActiveResult(0);
        setMinSqftAllResult(0);
        setMaxSqftAllResult(0);
        setMinBasePriceAllResult(0);
        setMinSqftActiveResult(0);
        setMaxBasePriceAllResult(0);
        setMaxSqftActiveResult(0);
        setAvgNetTrafficPerMonthThisYearResult(0);
        setAvgNetSalesPerMonthThisYearResult(0);
        setAvgClosingsPerMonthThisYearResult(0);
        setAvgNetSalesPerMonthSinceOpenResult(0);
        setAvgNetSalesPerMonthLastThreeMonthsResult(0);
        setMonthNetSoldResult(0);
        setYearNetSoldResult(0);
        setAvgClosingPriceResult(0);
        setPermitsThisYearResult(0);
        setMedianClosingPriceSinceOpenResult(0);
        setMedianClosingPriceThisYearResult(0);

        if (value === 'sum') {
          setAvgSqftActiveResult(totalSumFields(field));
        } else if (value === 'avg') {
          setAvgSqftActiveResult(averageFields(field));
        }
        break;

      case "avg_base_price_all":
        setAvgBasePriceAllOption(value);
        setTotalClosingsOption("");
        setTotalPermitsOption("");
        setTotalNetSalesOption("");
        setMonthsOpenOption("");
        setLatestLotsReleasedOption("");
        setLatestStandingInventoryOption("");
        setUnsoldLotsOption("");
        setAvgSqftAllOption("");
        setAvgSqftActiveOption("");
        setAvgBasePriceActiveOption("");
        setMinSqftAllOption("");
        setMaxSqftAllOption("");
        setMinBasePriceAllOption("");
        setMinSqftActiveOption("");
        setMaxBasePriceAllOption("");
        setMaxSqftActiveOption("");
        setAvgNetTrafficPerMonthThisYearOption("");
        setAvgNetSalesPerMonthThisYearOption("");
        setAvgClosingsPerMonthThisYearOption("");
        setAvgNetSalesPerMonthSinceOpenOption("");
        setAvgNetSalesPerMonthLastThreeMonthsOption("");
        setMonthNetSoldOption("");
        setYearNetSoldOption("");
        setAvgClosingPriceOption("");
        setPermitsThisYearOption("");
        setMedianClosingPriceSinceOpenOption("");
        setMedianClosingPriceThisYearOption("");

        setTotalClosingsResult(0);
        setTotalPermitsResult(0);
        setTotalNetSalesResult(0);
        setMonthsOpenResult(0);
        setLatestLotsReleasedResult(0);
        setLatestStandingInventoryResult(0);
        setUnsoldLotsResult(0);
        setAvgSqftAllResult(0);
        setAvgSqftActiveResult(0);
        setAvgBasePriceActiveResult(0);
        setMinSqftAllResult(0);
        setMaxSqftAllResult(0);
        setMinBasePriceAllResult(0);
        setMinSqftActiveResult(0);
        setMaxBasePriceAllResult(0);
        setMaxSqftActiveResult(0);
        setAvgNetTrafficPerMonthThisYearResult(0);
        setAvgNetSalesPerMonthThisYearResult(0);
        setAvgClosingsPerMonthThisYearResult(0);
        setAvgNetSalesPerMonthSinceOpenResult(0);
        setAvgNetSalesPerMonthLastThreeMonthsResult(0);
        setMonthNetSoldResult(0);
        setYearNetSoldResult(0);
        setAvgClosingPriceResult(0);
        setPermitsThisYearResult(0);
        setMedianClosingPriceSinceOpenResult(0);
        setMedianClosingPriceThisYearResult(0);

        if (value === 'sum') {
          setAvgBasePriceAllResult(totalSumFields(field));
        } else if (value === 'avg') {
          setAvgBasePriceAllResult(averageFields(field));
        }
        break;

      case "avg_base_price_active":
        setAvgBasePriceActiveOption(value);
        setTotalClosingsOption("");
        setTotalPermitsOption("");
        setTotalNetSalesOption("");
        setMonthsOpenOption("");
        setLatestLotsReleasedOption("");
        setLatestStandingInventoryOption("");
        setUnsoldLotsOption("");
        setAvgSqftAllOption("");
        setAvgSqftActiveOption("");
        setAvgBasePriceAllOption("");
        setMinSqftAllOption("");
        setMaxSqftAllOption("");
        setMinBasePriceAllOption("");
        setMinSqftActiveOption("");
        setMaxBasePriceAllOption("");
        setMaxSqftActiveOption("");
        setAvgNetTrafficPerMonthThisYearOption("");
        setAvgNetSalesPerMonthThisYearOption("");
        setAvgClosingsPerMonthThisYearOption("");
        setAvgNetSalesPerMonthSinceOpenOption("");
        setAvgNetSalesPerMonthLastThreeMonthsOption("");
        setMonthNetSoldOption("");
        setYearNetSoldOption("");
        setAvgClosingPriceOption("");
        setPermitsThisYearOption("");
        setMedianClosingPriceSinceOpenOption("");
        setMedianClosingPriceThisYearOption("");

        setTotalClosingsResult(0);
        setTotalPermitsResult(0);
        setTotalNetSalesResult(0);
        setMonthsOpenResult(0);
        setLatestLotsReleasedResult(0);
        setLatestStandingInventoryResult(0);
        setUnsoldLotsResult(0);
        setAvgSqftAllResult(0);
        setAvgSqftActiveResult(0);
        setAvgBasePriceAllResult(0);
        setMinSqftAllResult(0);
        setMaxSqftAllResult(0);
        setMinBasePriceAllResult(0);
        setMinSqftActiveResult(0);
        setMaxBasePriceAllResult(0);
        setMaxSqftActiveResult(0);
        setAvgNetTrafficPerMonthThisYearResult(0);
        setAvgNetSalesPerMonthThisYearResult(0);
        setAvgClosingsPerMonthThisYearResult(0);
        setAvgNetSalesPerMonthSinceOpenResult(0);
        setAvgNetSalesPerMonthLastThreeMonthsResult(0);
        setMonthNetSoldResult(0);
        setYearNetSoldResult(0);
        setAvgClosingPriceResult(0);
        setPermitsThisYearResult(0);
        setMedianClosingPriceSinceOpenResult(0);
        setMedianClosingPriceThisYearResult(0);

        if (value === 'sum') {
          setAvgBasePriceActiveResult(totalSumFields(field));
        } else if (value === 'avg') {
          setAvgBasePriceActiveResult(averageFields(field));
        }
        break;

      case "min_sqft_all":
        setMinSqftAllOption(value);
        setTotalClosingsOption("");
        setTotalPermitsOption("");
        setTotalNetSalesOption("");
        setMonthsOpenOption("");
        setLatestLotsReleasedOption("");
        setLatestStandingInventoryOption("");
        setUnsoldLotsOption("");
        setAvgSqftAllOption("");
        setAvgSqftActiveOption("");
        setAvgBasePriceAllOption("");
        setAvgBasePriceActiveOption("");
        setMaxSqftAllOption("");
        setMinBasePriceAllOption("");
        setMinSqftActiveOption("");
        setMaxBasePriceAllOption("");
        setMaxSqftActiveOption("");
        setAvgNetTrafficPerMonthThisYearOption("");
        setAvgNetSalesPerMonthThisYearOption("");
        setAvgClosingsPerMonthThisYearOption("");
        setAvgNetSalesPerMonthSinceOpenOption("");
        setAvgNetSalesPerMonthLastThreeMonthsOption("");
        setMonthNetSoldOption("");
        setYearNetSoldOption("");
        setAvgClosingPriceOption("");
        setPermitsThisYearOption("");
        setMedianClosingPriceSinceOpenOption("");
        setMedianClosingPriceThisYearOption("");

        setTotalClosingsResult(0);
        setTotalPermitsResult(0);
        setTotalNetSalesResult(0);
        setMonthsOpenResult(0);
        setLatestLotsReleasedResult(0);
        setLatestStandingInventoryResult(0);
        setUnsoldLotsResult(0);
        setAvgSqftAllResult(0);
        setAvgSqftActiveResult(0);
        setAvgBasePriceAllResult(0);
        setAvgBasePriceActiveResult(0);
        setMaxSqftAllResult(0);
        setMinBasePriceAllResult(0);
        setMinSqftActiveResult(0);
        setMaxBasePriceAllResult(0);
        setMaxSqftActiveResult(0);
        setAvgNetTrafficPerMonthThisYearResult(0);
        setAvgNetSalesPerMonthThisYearResult(0);
        setAvgClosingsPerMonthThisYearResult(0);
        setAvgNetSalesPerMonthSinceOpenResult(0);
        setAvgNetSalesPerMonthLastThreeMonthsResult(0);
        setMonthNetSoldResult(0);
        setYearNetSoldResult(0);
        setAvgClosingPriceResult(0);
        setPermitsThisYearResult(0);
        setMedianClosingPriceSinceOpenResult(0);
        setMedianClosingPriceThisYearResult(0);

        if (value === 'sum') {
          setMinSqftAllResult(totalSumFields(field));
        } else if (value === 'avg') {
          setMinSqftAllResult(averageFields(field));
        }
        break;

      case "max_sqft_all":
        setMaxSqftAllOption(value);
        setTotalClosingsOption("");
        setTotalPermitsOption("");
        setTotalNetSalesOption("");
        setMonthsOpenOption("");
        setLatestLotsReleasedOption("");
        setLatestStandingInventoryOption("");
        setUnsoldLotsOption("");
        setAvgSqftAllOption("");
        setAvgSqftActiveOption("");
        setAvgBasePriceAllOption("");
        setAvgBasePriceActiveOption("");
        setMinSqftAllOption("");
        setMinBasePriceAllOption("");
        setMinSqftActiveOption("");
        setMaxBasePriceAllOption("");
        setMaxSqftActiveOption("");
        setAvgNetTrafficPerMonthThisYearOption("");
        setAvgNetSalesPerMonthThisYearOption("");
        setAvgClosingsPerMonthThisYearOption("");
        setAvgNetSalesPerMonthSinceOpenOption("");
        setAvgNetSalesPerMonthLastThreeMonthsOption("");
        setMonthNetSoldOption("");
        setYearNetSoldOption("");
        setAvgClosingPriceOption("");
        setPermitsThisYearOption("");
        setMedianClosingPriceSinceOpenOption("");
        setMedianClosingPriceThisYearOption("");

        setTotalClosingsResult(0);
        setTotalPermitsResult(0);
        setTotalNetSalesResult(0);
        setMonthsOpenResult(0);
        setLatestLotsReleasedResult(0);
        setLatestStandingInventoryResult(0);
        setUnsoldLotsResult(0);
        setAvgSqftAllResult(0);
        setAvgSqftActiveResult(0);
        setAvgBasePriceAllResult(0);
        setAvgBasePriceActiveResult(0);
        setMinSqftAllResult(0);
        setMinBasePriceAllResult(0);
        setMinSqftActiveResult(0);
        setMaxBasePriceAllResult(0);
        setMaxSqftActiveResult(0);
        setAvgNetTrafficPerMonthThisYearResult(0);
        setAvgNetSalesPerMonthThisYearResult(0);
        setAvgClosingsPerMonthThisYearResult(0);
        setAvgNetSalesPerMonthSinceOpenResult(0);
        setAvgNetSalesPerMonthLastThreeMonthsResult(0);
        setMonthNetSoldResult(0);
        setYearNetSoldResult(0);
        setAvgClosingPriceResult(0);
        setPermitsThisYearResult(0);
        setMedianClosingPriceSinceOpenResult(0);
        setMedianClosingPriceThisYearResult(0);

        if (value === 'sum') {
          setMaxSqftAllResult(totalSumFields(field));
        } else if (value === 'avg') {
          setMaxSqftAllResult(averageFields(field));
        }
        break;

      case "min_base_price_all":
        setMinBasePriceAllOption(value);
        setTotalClosingsOption("");
        setTotalPermitsOption("");
        setTotalNetSalesOption("");
        setMonthsOpenOption("");
        setLatestLotsReleasedOption("");
        setLatestStandingInventoryOption("");
        setUnsoldLotsOption("");
        setAvgSqftAllOption("");
        setAvgSqftActiveOption("");
        setAvgBasePriceAllOption("");
        setAvgBasePriceActiveOption("");
        setMinSqftAllOption("");
        setMaxSqftAllOption("");
        setMinSqftActiveOption("");
        setMaxBasePriceAllOption("");
        setMaxSqftActiveOption("");
        setAvgNetTrafficPerMonthThisYearOption("");
        setAvgNetSalesPerMonthThisYearOption("");
        setAvgClosingsPerMonthThisYearOption("");
        setAvgNetSalesPerMonthSinceOpenOption("");
        setAvgNetSalesPerMonthLastThreeMonthsOption("");
        setMonthNetSoldOption("");
        setYearNetSoldOption("");
        setAvgClosingPriceOption("");
        setPermitsThisYearOption("");
        setMedianClosingPriceSinceOpenOption("");
        setMedianClosingPriceThisYearOption("");

        setTotalClosingsResult(0);
        setTotalPermitsResult(0);
        setTotalNetSalesResult(0);
        setMonthsOpenResult(0);
        setLatestLotsReleasedResult(0);
        setLatestStandingInventoryResult(0);
        setUnsoldLotsResult(0);
        setAvgSqftAllResult(0);
        setAvgSqftActiveResult(0);
        setAvgBasePriceAllResult(0);
        setAvgBasePriceActiveResult(0);
        setMinSqftAllResult(0);
        setMaxSqftAllResult(0);
        setMinSqftActiveResult(0);
        setMaxBasePriceAllResult(0);
        setMaxSqftActiveResult(0);
        setAvgNetTrafficPerMonthThisYearResult(0);
        setAvgNetSalesPerMonthThisYearResult(0);
        setAvgClosingsPerMonthThisYearResult(0);
        setAvgNetSalesPerMonthSinceOpenResult(0);
        setAvgNetSalesPerMonthLastThreeMonthsResult(0);
        setMonthNetSoldResult(0);
        setYearNetSoldResult(0);
        setAvgClosingPriceResult(0);
        setPermitsThisYearResult(0);
        setMedianClosingPriceSinceOpenResult(0);
        setMedianClosingPriceThisYearResult(0);

        if (value === 'sum') {
          setMinBasePriceAllResult(totalSumFields(field));
        } else if (value === 'avg') {
          setMinBasePriceAllResult(averageFields(field));
        }
        break;

      case "min_sqft_active":
        setMinSqftActiveOption(value);
        setTotalClosingsOption("");
        setTotalPermitsOption("");
        setTotalNetSalesOption("");
        setMonthsOpenOption("");
        setLatestLotsReleasedOption("");
        setLatestStandingInventoryOption("");
        setUnsoldLotsOption("");
        setAvgSqftAllOption("");
        setAvgSqftActiveOption("");
        setAvgBasePriceAllOption("");
        setAvgBasePriceActiveOption("");
        setMinSqftAllOption("");
        setMaxSqftAllOption("");
        setMinBasePriceAllOption("");
        setMaxBasePriceAllOption("");
        setMaxSqftActiveOption("");
        setAvgNetTrafficPerMonthThisYearOption("");
        setAvgNetSalesPerMonthThisYearOption("");
        setAvgClosingsPerMonthThisYearOption("");
        setAvgNetSalesPerMonthSinceOpenOption("");
        setAvgNetSalesPerMonthLastThreeMonthsOption("");
        setMonthNetSoldOption("");
        setYearNetSoldOption("");
        setAvgClosingPriceOption("");
        setPermitsThisYearOption("");
        setMedianClosingPriceSinceOpenOption("");
        setMedianClosingPriceThisYearOption("");

        setTotalClosingsResult(0);
        setTotalPermitsResult(0);
        setTotalNetSalesResult(0);
        setMonthsOpenResult(0);
        setLatestLotsReleasedResult(0);
        setLatestStandingInventoryResult(0);
        setUnsoldLotsResult(0);
        setAvgSqftAllResult(0);
        setAvgSqftActiveResult(0);
        setAvgBasePriceAllResult(0);
        setAvgBasePriceActiveResult(0);
        setMinSqftAllResult(0);
        setMaxSqftAllResult(0);
        setMinBasePriceAllResult(0);
        setMaxBasePriceAllResult(0);
        setMaxSqftActiveResult(0);
        setAvgNetTrafficPerMonthThisYearResult(0);
        setAvgNetSalesPerMonthThisYearResult(0);
        setAvgClosingsPerMonthThisYearResult(0);
        setAvgNetSalesPerMonthSinceOpenResult(0);
        setAvgNetSalesPerMonthLastThreeMonthsResult(0);
        setMonthNetSoldResult(0);
        setYearNetSoldResult(0);
        setAvgClosingPriceResult(0);
        setPermitsThisYearResult(0);
        setMedianClosingPriceSinceOpenResult(0);
        setMedianClosingPriceThisYearResult(0);

        if (value === 'sum') {
          setMinSqftActiveResult(totalSumFields(field));
        } else if (value === 'avg') {
          setMinSqftActiveResult(averageFields(field));
        }
        break;

      case "max_base_price_all":
        setMaxBasePriceAllOption(value);
        setTotalClosingsOption("");
        setTotalPermitsOption("");
        setTotalNetSalesOption("");
        setMonthsOpenOption("");
        setLatestLotsReleasedOption("");
        setLatestStandingInventoryOption("");
        setUnsoldLotsOption("");
        setAvgSqftAllOption("");
        setAvgSqftActiveOption("");
        setAvgBasePriceAllOption("");
        setAvgBasePriceActiveOption("");
        setMinSqftAllOption("");
        setMaxSqftAllOption("");
        setMinBasePriceAllOption("");
        setMinSqftActiveOption("");
        setMaxSqftActiveOption("");
        setAvgNetTrafficPerMonthThisYearOption("");
        setAvgNetSalesPerMonthThisYearOption("");
        setAvgClosingsPerMonthThisYearOption("");
        setAvgNetSalesPerMonthSinceOpenOption("");
        setAvgNetSalesPerMonthLastThreeMonthsOption("");
        setMonthNetSoldOption("");
        setYearNetSoldOption("");
        setAvgClosingPriceOption("");
        setPermitsThisYearOption("");
        setMedianClosingPriceSinceOpenOption("");
        setMedianClosingPriceThisYearOption("");

        setTotalClosingsResult(0);
        setTotalPermitsResult(0);
        setTotalNetSalesResult(0);
        setMonthsOpenResult(0);
        setLatestLotsReleasedResult(0);
        setLatestStandingInventoryResult(0);
        setUnsoldLotsResult(0);
        setAvgSqftAllResult(0);
        setAvgSqftActiveResult(0);
        setAvgBasePriceAllResult(0);
        setAvgBasePriceActiveResult(0);
        setMinSqftAllResult(0);
        setMaxSqftAllResult(0);
        setMinBasePriceAllResult(0);
        setMinSqftActiveResult(0);
        setMaxSqftActiveResult(0);
        setAvgNetTrafficPerMonthThisYearResult(0);
        setAvgNetSalesPerMonthThisYearResult(0);
        setAvgClosingsPerMonthThisYearResult(0);
        setAvgNetSalesPerMonthSinceOpenResult(0);
        setAvgNetSalesPerMonthLastThreeMonthsResult(0);
        setMonthNetSoldResult(0);
        setYearNetSoldResult(0);
        setAvgClosingPriceResult(0);
        setPermitsThisYearResult(0);
        setMedianClosingPriceSinceOpenResult(0);
        setMedianClosingPriceThisYearResult(0);

        if (value === 'sum') {
          setMaxBasePriceAllResult(totalSumFields(field));
        } else if (value === 'avg') {
          setMaxBasePriceAllResult(averageFields(field));
        }
        break;

      case "max_sqft_active":
        setMaxSqftActiveOption(value);
        setTotalClosingsOption("");
        setTotalPermitsOption("");
        setTotalNetSalesOption("");
        setMonthsOpenOption("");
        setLatestLotsReleasedOption("");
        setLatestStandingInventoryOption("");
        setUnsoldLotsOption("");
        setAvgSqftAllOption("");
        setAvgSqftActiveOption("");
        setAvgBasePriceAllOption("");
        setAvgBasePriceActiveOption("");
        setMinSqftAllOption("");
        setMaxSqftAllOption("");
        setMinBasePriceAllOption("");
        setMinSqftActiveOption("");
        setMaxBasePriceAllOption("");
        setAvgNetTrafficPerMonthThisYearOption("");
        setAvgNetSalesPerMonthThisYearOption("");
        setAvgClosingsPerMonthThisYearOption("");
        setAvgNetSalesPerMonthSinceOpenOption("");
        setAvgNetSalesPerMonthLastThreeMonthsOption("");
        setMonthNetSoldOption("");
        setYearNetSoldOption("");
        setAvgClosingPriceOption("");
        setPermitsThisYearOption("");
        setMedianClosingPriceSinceOpenOption("");
        setMedianClosingPriceThisYearOption("");

        setTotalClosingsResult(0);
        setTotalPermitsResult(0);
        setTotalNetSalesResult(0);
        setMonthsOpenResult(0);
        setLatestLotsReleasedResult(0);
        setLatestStandingInventoryResult(0);
        setUnsoldLotsResult(0);
        setAvgSqftAllResult(0);
        setAvgSqftActiveResult(0);
        setAvgBasePriceAllResult(0);
        setAvgBasePriceActiveResult(0);
        setMinSqftAllResult(0);
        setMaxSqftAllResult(0);
        setMinBasePriceAllResult(0);
        setMinSqftActiveResult(0);
        setMaxBasePriceAllResult(0);
        setAvgNetTrafficPerMonthThisYearResult(0);
        setAvgNetSalesPerMonthThisYearResult(0);
        setAvgClosingsPerMonthThisYearResult(0);
        setAvgNetSalesPerMonthSinceOpenResult(0);
        setAvgNetSalesPerMonthLastThreeMonthsResult(0);
        setMonthNetSoldResult(0);
        setYearNetSoldResult(0);
        setAvgClosingPriceResult(0);
        setPermitsThisYearResult(0);
        setMedianClosingPriceSinceOpenResult(0);
        setMedianClosingPriceThisYearResult(0);

        if (value === 'sum') {
          setMaxSqftActiveResult(totalSumFields(field));
        } else if (value === 'avg') {
          setMaxSqftActiveResult(averageFields(field));
        }
        break;

      case "avg_net_traffic_per_month_this_year":
        setAvgNetTrafficPerMonthThisYearOption(value);
        setTotalClosingsOption("");
        setTotalPermitsOption("");
        setTotalNetSalesOption("");
        setMonthsOpenOption("");
        setLatestLotsReleasedOption("");
        setLatestStandingInventoryOption("");
        setUnsoldLotsOption("");
        setAvgSqftAllOption("");
        setAvgSqftActiveOption("");
        setAvgBasePriceAllOption("");
        setAvgBasePriceActiveOption("");
        setMinSqftAllOption("");
        setMaxSqftAllOption("");
        setMinBasePriceAllOption("");
        setMinSqftActiveOption("");
        setMaxBasePriceAllOption("");
        setMaxSqftActiveOption("");
        setAvgNetSalesPerMonthThisYearOption("");
        setAvgClosingsPerMonthThisYearOption("");
        setAvgNetSalesPerMonthSinceOpenOption("");
        setAvgNetSalesPerMonthLastThreeMonthsOption("");
        setMonthNetSoldOption("");
        setYearNetSoldOption("");
        setAvgClosingPriceOption("");
        setPermitsThisYearOption("");
        setMedianClosingPriceSinceOpenOption("");
        setMedianClosingPriceThisYearOption("");

        setTotalClosingsResult(0);
        setTotalPermitsResult(0);
        setTotalNetSalesResult(0);
        setMonthsOpenResult(0);
        setLatestLotsReleasedResult(0);
        setLatestStandingInventoryResult(0);
        setUnsoldLotsResult(0);
        setAvgSqftAllResult(0);
        setAvgSqftActiveResult(0);
        setAvgBasePriceAllResult(0);
        setAvgBasePriceActiveResult(0);
        setMinSqftAllResult(0);
        setMaxSqftAllResult(0);
        setMinBasePriceAllResult(0);
        setMinSqftActiveResult(0);
        setMaxBasePriceAllResult(0);
        setMaxSqftActiveResult(0);
        setAvgNetSalesPerMonthThisYearResult(0);
        setAvgClosingsPerMonthThisYearResult(0);
        setAvgNetSalesPerMonthSinceOpenResult(0);
        setAvgNetSalesPerMonthLastThreeMonthsResult(0);
        setMonthNetSoldResult(0);
        setYearNetSoldResult(0);
        setAvgClosingPriceResult(0);
        setPermitsThisYearResult(0);
        setMedianClosingPriceSinceOpenResult(0);
        setMedianClosingPriceThisYearResult(0);

        if (value === 'sum') {
          setAvgNetTrafficPerMonthThisYearResult(totalSumFields(field));
        } else if (value === 'avg') {
          setAvgNetTrafficPerMonthThisYearResult(averageFields(field));
        }
        break;

      case "avg_net_sales_per_month_this_year":
        setAvgNetSalesPerMonthThisYearOption(value);
        setTotalClosingsOption("");
        setTotalPermitsOption("");
        setTotalNetSalesOption("");
        setMonthsOpenOption("");
        setLatestLotsReleasedOption("");
        setLatestStandingInventoryOption("");
        setUnsoldLotsOption("");
        setAvgSqftAllOption("");
        setAvgSqftActiveOption("");
        setAvgBasePriceAllOption("");
        setAvgBasePriceActiveOption("");
        setMinSqftAllOption("");
        setMaxSqftAllOption("");
        setMinBasePriceAllOption("");
        setMinSqftActiveOption("");
        setMaxBasePriceAllOption("");
        setMaxSqftActiveOption("");
        setAvgNetTrafficPerMonthThisYearOption("");
        setAvgClosingsPerMonthThisYearOption("");
        setAvgNetSalesPerMonthSinceOpenOption("");
        setAvgNetSalesPerMonthLastThreeMonthsOption("");
        setMonthNetSoldOption("");
        setYearNetSoldOption("");
        setAvgClosingPriceOption("");
        setPermitsThisYearOption("");
        setMedianClosingPriceSinceOpenOption("");
        setMedianClosingPriceThisYearOption("");

        setTotalClosingsResult(0);
        setTotalPermitsResult(0);
        setTotalNetSalesResult(0);
        setMonthsOpenResult(0);
        setLatestLotsReleasedResult(0);
        setLatestStandingInventoryResult(0);
        setUnsoldLotsResult(0);
        setAvgSqftAllResult(0);
        setAvgSqftActiveResult(0);
        setAvgBasePriceAllResult(0);
        setAvgBasePriceActiveResult(0);
        setMinSqftAllResult(0);
        setMaxSqftAllResult(0);
        setMinBasePriceAllResult(0);
        setMinSqftActiveResult(0);
        setMaxBasePriceAllResult(0);
        setMaxSqftActiveResult(0);
        setAvgNetTrafficPerMonthThisYearResult(0);
        setAvgClosingsPerMonthThisYearResult(0);
        setAvgNetSalesPerMonthSinceOpenResult(0);
        setAvgNetSalesPerMonthLastThreeMonthsResult(0);
        setMonthNetSoldResult(0);
        setYearNetSoldResult(0);
        setAvgClosingPriceResult(0);
        setPermitsThisYearResult(0);
        setMedianClosingPriceSinceOpenResult(0);
        setMedianClosingPriceThisYearResult(0);

        if (value === 'sum') {
          setAvgNetSalesPerMonthThisYearResult(totalSumFields(field));
        } else if (value === 'avg') {
          setAvgNetSalesPerMonthThisYearResult(averageFields(field));
        }
        break;

      case "avg_closings_per_month_this_year":
        setAvgClosingsPerMonthThisYearOption(value);
        setTotalClosingsOption("");
        setTotalPermitsOption("");
        setTotalNetSalesOption("");
        setMonthsOpenOption("");
        setLatestLotsReleasedOption("");
        setLatestStandingInventoryOption("");
        setUnsoldLotsOption("");
        setAvgSqftAllOption("");
        setAvgSqftActiveOption("");
        setAvgBasePriceAllOption("");
        setAvgBasePriceActiveOption("");
        setMinSqftAllOption("");
        setMaxSqftAllOption("");
        setMinBasePriceAllOption("");
        setMinSqftActiveOption("");
        setMaxBasePriceAllOption("");
        setMaxSqftActiveOption("");
        setAvgNetTrafficPerMonthThisYearOption("");
        setAvgNetSalesPerMonthThisYearOption("");
        setAvgNetSalesPerMonthSinceOpenOption("");
        setAvgNetSalesPerMonthLastThreeMonthsOption("");
        setMonthNetSoldOption("");
        setYearNetSoldOption("");
        setAvgClosingPriceOption("");
        setPermitsThisYearOption("");
        setMedianClosingPriceSinceOpenOption("");
        setMedianClosingPriceThisYearOption("");

        setTotalClosingsResult(0);
        setTotalPermitsResult(0);
        setTotalNetSalesResult(0);
        setMonthsOpenResult(0);
        setLatestLotsReleasedResult(0);
        setLatestStandingInventoryResult(0);
        setUnsoldLotsResult(0);
        setAvgSqftAllResult(0);
        setAvgSqftActiveResult(0);
        setAvgBasePriceAllResult(0);
        setAvgBasePriceActiveResult(0);
        setMinSqftAllResult(0);
        setMaxSqftAllResult(0);
        setMinBasePriceAllResult(0);
        setMinSqftActiveResult(0);
        setMaxBasePriceAllResult(0);
        setMaxSqftActiveResult(0);
        setAvgNetTrafficPerMonthThisYearResult(0);
        setAvgNetSalesPerMonthThisYearResult(0);
        setAvgNetSalesPerMonthSinceOpenResult(0);
        setAvgNetSalesPerMonthLastThreeMonthsResult(0);
        setMonthNetSoldResult(0);
        setYearNetSoldResult(0);
        setAvgClosingPriceResult(0);
        setPermitsThisYearResult(0);
        setMedianClosingPriceSinceOpenResult(0);
        setMedianClosingPriceThisYearResult(0);

        if (value === 'sum') {
          setAvgClosingsPerMonthThisYearResult(totalSumFields(field));
        } else if (value === 'avg') {
          setAvgClosingsPerMonthThisYearResult(averageFields(field));
        }
        break;

      case "avg_net_sales_per_month_since_open":
        setAvgNetSalesPerMonthSinceOpenOption(value);
        setTotalClosingsOption("");
        setTotalPermitsOption("");
        setTotalNetSalesOption("");
        setMonthsOpenOption("");
        setLatestLotsReleasedOption("");
        setLatestStandingInventoryOption("");
        setUnsoldLotsOption("");
        setAvgSqftAllOption("");
        setAvgSqftActiveOption("");
        setAvgBasePriceAllOption("");
        setAvgBasePriceActiveOption("");
        setMinSqftAllOption("");
        setMaxSqftAllOption("");
        setMinBasePriceAllOption("");
        setMinSqftActiveOption("");
        setMaxBasePriceAllOption("");
        setMaxSqftActiveOption("");
        setAvgNetTrafficPerMonthThisYearOption("");
        setAvgNetSalesPerMonthThisYearOption("");
        setAvgClosingsPerMonthThisYearOption("");
        setAvgNetSalesPerMonthLastThreeMonthsOption("");
        setMonthNetSoldOption("");
        setYearNetSoldOption("");
        setAvgClosingPriceOption("");
        setPermitsThisYearOption("");
        setMedianClosingPriceSinceOpenOption("");
        setMedianClosingPriceThisYearOption("");

        setTotalClosingsResult(0);
        setTotalPermitsResult(0);
        setTotalNetSalesResult(0);
        setMonthsOpenResult(0);
        setLatestLotsReleasedResult(0);
        setLatestStandingInventoryResult(0);
        setUnsoldLotsResult(0);
        setAvgSqftAllResult(0);
        setAvgSqftActiveResult(0);
        setAvgBasePriceAllResult(0);
        setAvgBasePriceActiveResult(0);
        setMinSqftAllResult(0);
        setMaxSqftAllResult(0);
        setMinBasePriceAllResult(0);
        setMinSqftActiveResult(0);
        setMaxBasePriceAllResult(0);
        setMaxSqftActiveResult(0);
        setAvgNetTrafficPerMonthThisYearResult(0);
        setAvgNetSalesPerMonthThisYearResult(0);
        setAvgClosingsPerMonthThisYearResult(0);
        setAvgNetSalesPerMonthLastThreeMonthsResult(0);
        setMonthNetSoldResult(0);
        setYearNetSoldResult(0);
        setAvgClosingPriceResult(0);
        setPermitsThisYearResult(0);
        setMedianClosingPriceSinceOpenResult(0);
        setMedianClosingPriceThisYearResult(0);

        if (value === 'sum') {
          setAvgNetSalesPerMonthSinceOpenResult(totalSumFields(field));
        } else if (value === 'avg') {
          setAvgNetSalesPerMonthSinceOpenResult(averageFields(field));
        }
        break;

      case "avg_net_sales_per_month_last_three_months":
        setAvgNetSalesPerMonthLastThreeMonthsOption(value);
        setTotalClosingsOption("");
        setTotalPermitsOption("");
        setTotalNetSalesOption("");
        setMonthsOpenOption("");
        setLatestLotsReleasedOption("");
        setLatestStandingInventoryOption("");
        setUnsoldLotsOption("");
        setAvgSqftAllOption("");
        setAvgSqftActiveOption("");
        setAvgBasePriceAllOption("");
        setAvgBasePriceActiveOption("");
        setMinSqftAllOption("");
        setMaxSqftAllOption("");
        setMinBasePriceAllOption("");
        setMinSqftActiveOption("");
        setMaxBasePriceAllOption("");
        setMaxSqftActiveOption("");
        setAvgNetTrafficPerMonthThisYearOption("");
        setAvgNetSalesPerMonthThisYearOption("");
        setAvgClosingsPerMonthThisYearOption("");
        setAvgNetSalesPerMonthSinceOpenOption("");
        setMonthNetSoldOption("");
        setYearNetSoldOption("");
        setAvgClosingPriceOption("");
        setPermitsThisYearOption("");
        setMedianClosingPriceSinceOpenOption("");
        setMedianClosingPriceThisYearOption("");

        setTotalClosingsResult(0);
        setTotalPermitsResult(0);
        setTotalNetSalesResult(0);
        setMonthsOpenResult(0);
        setLatestLotsReleasedResult(0);
        setLatestStandingInventoryResult(0);
        setUnsoldLotsResult(0);
        setAvgSqftAllResult(0);
        setAvgSqftActiveResult(0);
        setAvgBasePriceAllResult(0);
        setAvgBasePriceActiveResult(0);
        setMinSqftAllResult(0);
        setMaxSqftAllResult(0);
        setMinBasePriceAllResult(0);
        setMinSqftActiveResult(0);
        setMaxBasePriceAllResult(0);
        setMaxSqftActiveResult(0);
        setAvgNetTrafficPerMonthThisYearResult(0);
        setAvgNetSalesPerMonthThisYearResult(0);
        setAvgClosingsPerMonthThisYearResult(0);
        setAvgNetSalesPerMonthSinceOpenResult(0);
        setMonthNetSoldResult(0);
        setYearNetSoldResult(0);
        setAvgClosingPriceResult(0);
        setPermitsThisYearResult(0);
        setMedianClosingPriceSinceOpenResult(0);
        setMedianClosingPriceThisYearResult(0);

        if (value === 'sum') {
          setAvgNetSalesPerMonthLastThreeMonthsResult(totalSumFields(field));
        } else if (value === 'avg') {
          setAvgNetSalesPerMonthLastThreeMonthsResult(averageFields(field));
        }
        break;

      case "month_net_sold":
        setMonthNetSoldOption(value);
        setTotalClosingsOption("");
        setTotalPermitsOption("");
        setTotalNetSalesOption("");
        setMonthsOpenOption("");
        setLatestLotsReleasedOption("");
        setLatestStandingInventoryOption("");
        setUnsoldLotsOption("");
        setAvgSqftAllOption("");
        setAvgSqftActiveOption("");
        setAvgBasePriceAllOption("");
        setAvgBasePriceActiveOption("");
        setMinSqftAllOption("");
        setMaxSqftAllOption("");
        setMinBasePriceAllOption("");
        setMinSqftActiveOption("");
        setMaxBasePriceAllOption("");
        setMaxSqftActiveOption("");
        setAvgNetTrafficPerMonthThisYearOption("");
        setAvgNetSalesPerMonthThisYearOption("");
        setAvgClosingsPerMonthThisYearOption("");
        setAvgNetSalesPerMonthSinceOpenOption("");
        setAvgNetSalesPerMonthLastThreeMonthsOption("");
        setYearNetSoldOption("");
        setAvgClosingPriceOption("");
        setPermitsThisYearOption("");
        setMedianClosingPriceSinceOpenOption("");
        setMedianClosingPriceThisYearOption("");

        setTotalClosingsResult(0);
        setTotalPermitsResult(0);
        setTotalNetSalesResult(0);
        setMonthsOpenResult(0);
        setLatestLotsReleasedResult(0);
        setLatestStandingInventoryResult(0);
        setUnsoldLotsResult(0);
        setAvgSqftAllResult(0);
        setAvgSqftActiveResult(0);
        setAvgBasePriceAllResult(0);
        setAvgBasePriceActiveResult(0);
        setMinSqftAllResult(0);
        setMaxSqftAllResult(0);
        setMinBasePriceAllResult(0);
        setMinSqftActiveResult(0);
        setMaxBasePriceAllResult(0);
        setMaxSqftActiveResult(0);
        setAvgNetTrafficPerMonthThisYearResult(0);
        setAvgNetSalesPerMonthThisYearResult(0);
        setAvgClosingsPerMonthThisYearResult(0);
        setAvgNetSalesPerMonthSinceOpenResult(0);
        setAvgNetSalesPerMonthLastThreeMonthsResult(0);
        setYearNetSoldResult(0);
        setAvgClosingPriceResult(0);
        setPermitsThisYearResult(0);
        setMedianClosingPriceSinceOpenResult(0);
        setMedianClosingPriceThisYearResult(0);

        if (value === 'sum') {
          setMonthNetSoldResult(totalSumFields(field));
        } else if (value === 'avg') {
          setMonthNetSoldResult(averageFields(field));
        }
        break;

      case "year_net_sold":
        setYearNetSoldOption(value);
        setTotalClosingsOption("");
        setTotalPermitsOption("");
        setTotalNetSalesOption("");
        setMonthsOpenOption("");
        setLatestLotsReleasedOption("");
        setLatestStandingInventoryOption("");
        setUnsoldLotsOption("");
        setAvgSqftAllOption("");
        setAvgSqftActiveOption("");
        setAvgBasePriceAllOption("");
        setAvgBasePriceActiveOption("");
        setMinSqftAllOption("");
        setMaxSqftAllOption("");
        setMinBasePriceAllOption("");
        setMinSqftActiveOption("");
        setMaxBasePriceAllOption("");
        setMaxSqftActiveOption("");
        setAvgNetTrafficPerMonthThisYearOption("");
        setAvgNetSalesPerMonthThisYearOption("");
        setAvgClosingsPerMonthThisYearOption("");
        setAvgNetSalesPerMonthSinceOpenOption("");
        setAvgNetSalesPerMonthLastThreeMonthsOption("");
        setMonthNetSoldOption("");
        setAvgClosingPriceOption("");
        setPermitsThisYearOption("");
        setMedianClosingPriceSinceOpenOption("");
        setMedianClosingPriceThisYearOption("");

        setTotalClosingsResult(0);
        setTotalPermitsResult(0);
        setTotalNetSalesResult(0);
        setMonthsOpenResult(0);
        setLatestLotsReleasedResult(0);
        setLatestStandingInventoryResult(0);
        setUnsoldLotsResult(0);
        setAvgSqftAllResult(0);
        setAvgSqftActiveResult(0);
        setAvgBasePriceAllResult(0);
        setAvgBasePriceActiveResult(0);
        setMinSqftAllResult(0);
        setMaxSqftAllResult(0);
        setMinBasePriceAllResult(0);
        setMinSqftActiveResult(0);
        setMaxBasePriceAllResult(0);
        setMaxSqftActiveResult(0);
        setAvgNetTrafficPerMonthThisYearResult(0);
        setAvgNetSalesPerMonthThisYearResult(0);
        setAvgClosingsPerMonthThisYearResult(0);
        setAvgNetSalesPerMonthSinceOpenResult(0);
        setAvgNetSalesPerMonthLastThreeMonthsResult(0);
        setMonthNetSoldResult(0);
        setAvgClosingPriceResult(0);
        setPermitsThisYearResult(0);
        setMedianClosingPriceSinceOpenResult(0);
        setMedianClosingPriceThisYearResult(0);

        if (value === 'sum') {
          setYearNetSoldResult(totalSumFields(field));
        } else if (value === 'avg') {
          setYearNetSoldResult(averageFields(field));
        }
        break;

        case "avg_closing_price":
        setAvgClosingPriceOption(value);
        setTotalClosingsOption("");
        setTotalPermitsOption("");
        setTotalNetSalesOption("");
        setMonthsOpenOption("");
        setLatestLotsReleasedOption("");
        setLatestStandingInventoryOption("");
        setUnsoldLotsOption("");
        setAvgSqftAllOption("");
        setAvgSqftActiveOption("");
        setAvgBasePriceAllOption("");
        setAvgBasePriceActiveOption("");
        setMinSqftAllOption("");
        setMaxSqftAllOption("");
        setMinBasePriceAllOption("");
        setMinSqftActiveOption("");
        setMaxBasePriceAllOption("");
        setMaxSqftActiveOption("");
        setAvgNetTrafficPerMonthThisYearOption("");
        setAvgNetSalesPerMonthThisYearOption("");
        setAvgClosingsPerMonthThisYearOption("");
        setAvgNetSalesPerMonthSinceOpenOption("");
        setAvgNetSalesPerMonthLastThreeMonthsOption("");
        setMonthNetSoldOption("");
        setPermitsThisYearOption("");
        setMedianClosingPriceSinceOpenOption("");
        setMedianClosingPriceThisYearOption("");

        setTotalClosingsResult(0);
        setTotalPermitsResult(0);
        setTotalNetSalesResult(0);
        setMonthsOpenResult(0);
        setLatestLotsReleasedResult(0);
        setLatestStandingInventoryResult(0);
        setUnsoldLotsResult(0);
        setAvgSqftAllResult(0);
        setAvgSqftActiveResult(0);
        setAvgBasePriceAllResult(0);
        setAvgBasePriceActiveResult(0);
        setMinSqftAllResult(0);
        setMaxSqftAllResult(0);
        setMinBasePriceAllResult(0);
        setMinSqftActiveResult(0);
        setMaxBasePriceAllResult(0);
        setMaxSqftActiveResult(0);
        setAvgNetTrafficPerMonthThisYearResult(0);
        setAvgNetSalesPerMonthThisYearResult(0);
        setAvgClosingsPerMonthThisYearResult(0);
        setAvgNetSalesPerMonthSinceOpenResult(0);
        setAvgNetSalesPerMonthLastThreeMonthsResult(0);
        setMonthNetSoldResult(0);
        setPermitsThisYearResult(0);
        setMedianClosingPriceSinceOpenResult(0);
        setMedianClosingPriceThisYearResult(0);

        if (value === 'sum') {
          setAvgClosingPriceResult(totalSumFields(field));
        } else if (value === 'avg') {
          setAvgClosingPriceResult(averageFields(field));
        }
        break;

        case "permit_this_year":
        setPermitsThisYearOption(value);
        setTotalClosingsOption("");
        setTotalPermitsOption("");
        setTotalNetSalesOption("");
        setMonthsOpenOption("");
        setLatestLotsReleasedOption("");
        setLatestStandingInventoryOption("");
        setUnsoldLotsOption("");
        setAvgSqftAllOption("");
        setAvgSqftActiveOption("");
        setAvgBasePriceAllOption("");
        setAvgBasePriceActiveOption("");
        setMinSqftAllOption("");
        setMaxSqftAllOption("");
        setMinBasePriceAllOption("");
        setMinSqftActiveOption("");
        setMaxBasePriceAllOption("");
        setMaxSqftActiveOption("");
        setAvgNetTrafficPerMonthThisYearOption("");
        setAvgNetSalesPerMonthThisYearOption("");
        setAvgClosingsPerMonthThisYearOption("");
        setAvgNetSalesPerMonthSinceOpenOption("");
        setAvgNetSalesPerMonthLastThreeMonthsOption("");
        setMonthNetSoldOption("");
        setAvgClosingPriceOption("");
        setMedianClosingPriceSinceOpenOption("");
        setMedianClosingPriceThisYearOption("");

        setTotalClosingsResult(0);
        setTotalPermitsResult(0);
        setTotalNetSalesResult(0);
        setMonthsOpenResult(0);
        setLatestLotsReleasedResult(0);
        setLatestStandingInventoryResult(0);
        setUnsoldLotsResult(0);
        setAvgSqftAllResult(0);
        setAvgSqftActiveResult(0);
        setAvgBasePriceAllResult(0);
        setAvgBasePriceActiveResult(0);
        setMinSqftAllResult(0);
        setMaxSqftAllResult(0);
        setMinBasePriceAllResult(0);
        setMinSqftActiveResult(0);
        setMaxBasePriceAllResult(0);
        setMaxSqftActiveResult(0);
        setAvgNetTrafficPerMonthThisYearResult(0);
        setAvgNetSalesPerMonthThisYearResult(0);
        setAvgClosingsPerMonthThisYearResult(0);
        setAvgNetSalesPerMonthSinceOpenResult(0);
        setAvgNetSalesPerMonthLastThreeMonthsResult(0);
        setMonthNetSoldResult(0);
        setAvgClosingPriceResult(0);
        setMedianClosingPriceSinceOpenResult(0);
        setMedianClosingPriceThisYearResult(0);

        if (value === 'sum') {
          setPermitsThisYearResult(totalSumFields(field));
        } else if (value === 'avg') {
          setPermitsThisYearResult(averageFields(field));
        }
        break;

        case "median_closing_price_since_open":
        setMedianClosingPriceSinceOpenOption(value);
        setTotalClosingsOption("");
        setTotalPermitsOption("");
        setTotalNetSalesOption("");
        setMonthsOpenOption("");
        setLatestLotsReleasedOption("");
        setLatestStandingInventoryOption("");
        setUnsoldLotsOption("");
        setAvgSqftAllOption("");
        setAvgSqftActiveOption("");
        setAvgBasePriceAllOption("");
        setAvgBasePriceActiveOption("");
        setMinSqftAllOption("");
        setMaxSqftAllOption("");
        setMinBasePriceAllOption("");
        setMinSqftActiveOption("");
        setMaxBasePriceAllOption("");
        setMaxSqftActiveOption("");
        setAvgNetTrafficPerMonthThisYearOption("");
        setAvgNetSalesPerMonthThisYearOption("");
        setAvgClosingsPerMonthThisYearOption("");
        setAvgNetSalesPerMonthSinceOpenOption("");
        setAvgNetSalesPerMonthLastThreeMonthsOption("");
        setMonthNetSoldOption("");
        setAvgClosingPriceOption("");
        setPermitsThisYearOption("");
        setMedianClosingPriceThisYearOption("");

        setTotalClosingsResult(0);
        setTotalPermitsResult(0);
        setTotalNetSalesResult(0);
        setMonthsOpenResult(0);
        setLatestLotsReleasedResult(0);
        setLatestStandingInventoryResult(0);
        setUnsoldLotsResult(0);
        setAvgSqftAllResult(0);
        setAvgSqftActiveResult(0);
        setAvgBasePriceAllResult(0);
        setAvgBasePriceActiveResult(0);
        setMinSqftAllResult(0);
        setMaxSqftAllResult(0);
        setMinBasePriceAllResult(0);
        setMinSqftActiveResult(0);
        setMaxBasePriceAllResult(0);
        setMaxSqftActiveResult(0);
        setAvgNetTrafficPerMonthThisYearResult(0);
        setAvgNetSalesPerMonthThisYearResult(0);
        setAvgClosingsPerMonthThisYearResult(0);
        setAvgNetSalesPerMonthSinceOpenResult(0);
        setAvgNetSalesPerMonthLastThreeMonthsResult(0);
        setMonthNetSoldResult(0);
        setAvgClosingPriceResult(0);
        setPermitsThisYearResult(0);
        setMedianClosingPriceThisYearResult(0);

        if (value === 'sum') {
          setMedianClosingPriceSinceOpenResult(totalSumFields(field));
        } else if (value === 'avg') {
          setMedianClosingPriceSinceOpenResult(averageFields(field));
        }
        break;

        case "median_closing_price_this_year":
        setMedianClosingPriceThisYearOption(value);
        setTotalClosingsOption("");
        setTotalPermitsOption("");
        setTotalNetSalesOption("");
        setMonthsOpenOption("");
        setLatestLotsReleasedOption("");
        setLatestStandingInventoryOption("");
        setUnsoldLotsOption("");
        setAvgSqftAllOption("");
        setAvgSqftActiveOption("");
        setAvgBasePriceAllOption("");
        setAvgBasePriceActiveOption("");
        setMinSqftAllOption("");
        setMaxSqftAllOption("");
        setMinBasePriceAllOption("");
        setMinSqftActiveOption("");
        setMaxBasePriceAllOption("");
        setMaxSqftActiveOption("");
        setAvgNetTrafficPerMonthThisYearOption("");
        setAvgNetSalesPerMonthThisYearOption("");
        setAvgClosingsPerMonthThisYearOption("");
        setAvgNetSalesPerMonthSinceOpenOption("");
        setAvgNetSalesPerMonthLastThreeMonthsOption("");
        setMonthNetSoldOption("");
        setAvgClosingPriceOption("");
        setPermitsThisYearOption("");
        setMedianClosingPriceSinceOpenOption("");

        setTotalClosingsResult(0);
        setTotalPermitsResult(0);
        setTotalNetSalesResult(0);
        setMonthsOpenResult(0);
        setLatestLotsReleasedResult(0);
        setLatestStandingInventoryResult(0);
        setUnsoldLotsResult(0);
        setAvgSqftAllResult(0);
        setAvgSqftActiveResult(0);
        setAvgBasePriceAllResult(0);
        setAvgBasePriceActiveResult(0);
        setMinSqftAllResult(0);
        setMaxSqftAllResult(0);
        setMinBasePriceAllResult(0);
        setMinSqftActiveResult(0);
        setMaxBasePriceAllResult(0);
        setMaxSqftActiveResult(0);
        setAvgNetTrafficPerMonthThisYearResult(0);
        setAvgNetSalesPerMonthThisYearResult(0);
        setAvgClosingsPerMonthThisYearResult(0);
        setAvgNetSalesPerMonthSinceOpenResult(0);
        setAvgNetSalesPerMonthLastThreeMonthsResult(0);
        setMonthNetSoldResult(0);
        setAvgClosingPriceResult(0);
        setPermitsThisYearResult(0);
        setMedianClosingPriceSinceOpenResult(0);

        if (value === 'sum') {
          setMedianClosingPriceThisYearResult(totalSumFields(field));
        } else if (value === 'avg') {
          setMedianClosingPriceThisYearResult(averageFields(field));
        }
        break;

      default:
        break;
    }
  };

  

  const statusOptions = [
    { value: "1", label: "Active" },
    { value: "0", label: "Sold Out" },
    { value: "2", label: "Future" }
  ];

  const reportingOptions = [
    { value: "1", label: "Yes" },
    { value: "0", label: "No" }
  ];

  const ageOptions = [
    { value: "1", label: "Yes" },
    { value: "0", label: "No" }
  ];

  const singleOptions = [
    { value: "1", label: "Yes" },
    { value: "0", label: "No" }
  ];

  const gatedOptions = [
    { value: "1", label: "Yes" },
    { value: "0", label: "No" }
  ];

  const productTypeOptions = [
    { value: "DET", label: "DET" },
    { value: "ATT", label: "ATT" },
    { value: "HR", label: "HR" },
    { value: "AC", label: "AC" }
  ];

  const handleSelectBuilderNameChange  = (selectedItems) => {  
    const selectedValues = selectedItems.map(item => item.value);
    const selectedNames = selectedItems.map(item => item.label).join(', ');
    setSelectedValues(selectedValues);
    setSelectedBuilderName(selectedItems);
    setFilterQuery(prevState => ({
      ...prevState,
      builder_name: selectedNames
  }));
  }

  const handleSelectStatusChange  = (selectedItems) => {  
    const selectedValues = selectedItems.map(item => item.value);
    const selectedNames = selectedItems.map(item => item.value).join(', ');
    setSelectedValues(selectedValues);
    setSelectedStatus(selectedItems);
    setFilterQuery(prevState => ({
      ...prevState,
      status: selectedNames
  }));
  }

  const handleSelectReportingChange  = (selectedItems) => {  
    const selectedValues = selectedItems.map(item => item.value);
    const selectedNames = selectedItems.map(item => item.value).join(', ');

    setSelectedValues(selectedValues);
    setSelectedReporting(selectedItems);
    setFilterQuery(prevState => ({
      ...prevState,
      reporting: selectedNames
  }));
  }

  const handleSelectProductTypeChange  = (selectedItems) => {  
    const selectedValues = selectedItems.map(item => item.value);
    const selectedNames = selectedItems.map(item => item.value).join(', ');

    setSelectedValues(selectedValues);
    setProductTypeStatus(selectedItems);
    setFilterQuery(prevState => ({
      ...prevState,
      product_type: selectedNames
  }));
  }

  const handleSelectAgeChange  = (selectedItems) => {  
    const selectedValues = selectedItems.map(item => item.value);
    const selectedNames = selectedItems.map(item => item.value).join(', ');

    setSelectedValues(selectedValues);
    setSelectedAge(selectedItems);
    setFilterQuery(prevState => ({
      ...prevState,
      age: selectedNames
  }));
  }

  const handleSelectSingleChange  = (selectedItems) => {  
    const selectedValues = selectedItems.map(item => item.value);
    const selectedNames = selectedItems.map(item => item.value).join(', ');

    setSelectedValues(selectedValues);
    setSelectedSingle(selectedItems);

    setFilterQuery(prevState => ({
      ...prevState,
      age: selectedNames
  }));
  }

  const handleSelectGatedChange  = (selectedItems) => {  
    const selectedValues = selectedItems.map(item => item.value);
    const selectedNames = selectedItems.map(item => item.value).join(', ');

    setSelectedValues(selectedValues);
    setSelectedGated(selectedItems);

    setFilterQuery(prevState => ({
      ...prevState,
      gated: selectedNames
  }));
  }

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
                      <ColumnReOrderPopup
                        open={openDialog}
                        fieldList={fieldList}
                        handleCloseDialog={handleCloseDialog}
                        handleSaveDialog={handleSaveDialog}
                        draggedColumns={draggedColumns}
                        handleColumnOrderChange={handleColumnOrderChange}
                      />
                    </div>
                    <div className="d-flex" style={{marginTop: "10px"}}>
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
                    {/* <button onClick={exportToExcelData} className="btn btn-primary btn-sm me-1"> <i class="fas fa-file-excel"></i></button> */}
                   
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
                            {columns.map((column) => (
                              <th style={{ textAlign: "center", cursor: "pointer" }} key={column.id} onClick={(e) => (column.id == "action" || column.id == "cross Streets" || column.id == "website") ? "" : e.target.type !== "select-one" ? requestSort(
                                column.id == "builder" ? "builderName" : 
                                column.id == "product Type" ? "product_type" : 
                                column.id == "master Plan" ? "masterplan_id" : 
                                column.id == "total Lots" ? "totallots" : 
                                column.id == "lot Width" ? "lotwidth" : 
                                column.id == "lot Size" ? "lotsize" : 
                                column.id == "age Restricted" ? "age" : 
                                column.id == "all Single Story" ? "single" : 
                                column.id == "latitude" ? "lat" : 
                                column.id == "longitude" ? "lng" : 
                                column.id == "gas Provider" ? "gasprovider" : 
                                column.id == "hOA Fee" ? "hoafee" : 
                                column.id == "master Plan Fee" ? "masterplanfee" : 
                                column.id == "parcel Group" ? "parcel" : 
                                column.id == "date Added" ? "created_at" : 
                                column.id == "__pkSubID" ? "subdivision_code" : 
                                column.id == "_fkBuilderID" ? "builder_code" : 
                                column.id == "total Closings" ? "total_closings" : 
                                column.id == "total Permits" ? "total_permits" : 
                                column.id == "total Net Sales" ? "total_net_sales" : 
                                column.id == "months Open" ? "months_open" : 
                                column.id == "latest Traffic/Sales Data" ? "latest_traffic_data" : 
                                column.id == "latest Lots Released" ? "latest_lots_released" : 
                                column.id == "latest Standing Inventory" ? "latest_standing_inventory" : 
                                column.id == "unsold Lots" ? "unsold_lots" : 
                                column.id == "avg Sqft All" ? "avg_sqft_all" : 
                                column.id == "avg Sqft Active" ? "avg_sqft_active" : 
                                column.id == "avg Base Price All" ? "avg_base_price_all" : 
                                column.id == "avg Base Price Active" ? "avg_base_price_active" : 
                                column.id == "min Sqft All" ? "min_sqft_all" : 
                                column.id == "max Sqft All" ? "max_sqft_all" : 
                                column.id == "max Sqft Active" ? "max_sqft_active_current" : 
                                column.id == "min Base Price All" ? "min_base_price_all" : 
                                column.id == "min Sqft Active" ? "min_sqft_active_current" : 
                                column.id == "max Base Price All" ? "max_base_price_all" : 
                                column.id == "avg Traffic Per Month This Year" ? "avg_net_traffic_per_month_this_year" : 
                                column.id == "avg Net Sales Per Month This Year" ? "avg_net_sales_per_month_this_year" : 
                                column.id == "avg Closings Per Month This Year" ? "avg_closings_per_month_this_year" : 
                                column.id == "avg Net Sales Per Month Since Open" ? "avg_net_sales_per_month_since_open" : 
                                column.id == "avg Net Sales Per Month Last 3 Months" ? "avg_net_sales_per_month_last_three_months" : 
                                column.id == "max Week Ending" ? "max_week_ending" : 
                                column.id == "min Week Ending" ? "min_week_ending" : 
                                column.id == "sqft Group" ? "sqft_group" : 
                                column.id == "price Group" ? "price_group" : 
                                column.id == "month Net Sold" ? "month_net_sold" : 
                                column.id == "year Net Sold" ? "year_net_sold" : 
                                column.id == "parcel" ? "parcel" : toCamelCase(column.id)) : ""}>
                                <strong>
                           
                                  {column.label}
                                  {column.id != "action" && sortConfig.some(
                                    (item) => item.key === (
                                      column.id == "builder" ? "builderName" : 
                                      column.id == "product Type" ? "product_type" : 
                                      column.id == "master Plan" ? "masterplan_id" : 
                                      column.id == "total Lots" ? "totallots" : 
                                      column.id == "lot Width" ? "lotwidth" : 
                                      column.id == "lot Size" ? "lotsize" : 
                                      column.id == "age Restricted" ? "age" : 
                                      column.id == "all Single Story" ? "single" : 
                                      column.id == "latitude" ? "lat" : 
                                      column.id == "longitude" ? "lng" : 
                                      column.id == "gas Provider" ? "gasprovider" : 
                                      column.id == "hOA Fee" ? "hoafee" : 
                                      column.id == "master Plan Fee" ? "masterplanfee" : 
                                      column.id == "parcel Group" ? "parcel" : 
                                      column.id == "date Added" ? "created_at" : 
                                      column.id == "__pkSubID" ? "subdivision_code" : 
                                      column.id == "_fkBuilderID" ? "builder_code" : 
                                      column.id == "total Closings" ? "total_closings" : 
                                      column.id == "total Permits" ? "total_permits" : 
                                      column.id == "total Net Sales" ? "total_net_sales" : 
                                      column.id == "months Open" ? "months_open" : 
                                      column.id == "latest Traffic/Sales Data" ? "latest_traffic_data" : 
                                      column.id == "latest Lots Released" ? "latest_lots_released" : 
                                      column.id == "latest Standing Inventory" ? "latest_standing_inventory" : 
                                      column.id == "unsold Lots" ? "unsold_lots" : 
                                      column.id == "avg Sqft All" ? "avg_sqft_all" : 
                                      column.id == "avg Sqft Active" ? "avg_sqft_active" : 
                                      column.id == "avg Base Price All" ? "avg_base_price_all" : 
                                      column.id == "avg Base Price Active" ? "avg_base_price_active" : 
                                      column.id == "min Sqft All" ? "min_sqft_all" : 
                                      column.id == "max Sqft All" ? "max_sqft_all" : 
                                      column.id == "max Sqft Active" ? "max_sqft_active_current" : 
                                      column.id == "min Base Price All" ? "min_base_price_all" : 
                                      column.id == "min Sqft Active" ? "min_sqft_active_current" : 
                                      column.id == "max Base Price All" ? "max_base_price_all" : 
                                      column.id == "avg Traffic Per Month This Year" ? "avg_net_traffic_per_month_this_year" : 
                                      column.id == "avg Net Sales Per Month This Year" ? "avg_net_sales_per_month_this_year" : 
                                      column.id == "avg Closings Per Month This Year" ? "avg_closings_per_month_this_year" : 
                                      column.id == "avg Net Sales Per Month Since Open" ? "avg_net_sales_per_month_since_open" : 
                                      column.id == "avg Net Sales Per Month Last 3 Months" ? "avg_net_sales_per_month_last_three_months" : 
                                      column.id == "max Week Ending" ? "max_week_ending" : 
                                      column.id == "min Week Ending" ? "min_week_ending" : 
                                      column.id == "sqft Group" ? "sqft_group" : 
                                      column.id == "price Group" ? "price_group" : 
                                      column.id == "month Net Sold" ? "month_net_sold" : 
                                      column.id == "year Net Sold" ? "year_net_sold" : 
                                      column.id == "avg Closing Price" ? "avg_closing_price" : 
                                      column.id == "parcel" ? "parcel" : toCamelCase(column.id))
                                    ) ? (
                                    <span>
                                      {column.id != "action" && sortConfig.find(
                                        (item) => item.key === (
                                          column.id == "builder" ? "builderName" : 
                                          column.id == "product Type" ? "product_type" : 
                                          column.id == "master Plan" ? "masterplan_id" : 
                                          column.id == "total Lots" ? "totallots" : 
                                          column.id == "lot Width" ? "lotwidth" : 
                                          column.id == "lot Size" ? "lotsize" : 
                                          column.id == "age Restricted" ? "age" : 
                                          column.id == "all Single Story" ? "single" : 
                                          column.id == "latitude" ? "lat" : 
                                          column.id == "longitude" ? "lng" : 
                                          column.id == "gas Provider" ? "gasprovider" : 
                                          column.id == "hOA Fee" ? "hoafee" : 
                                          column.id == "master Plan Fee" ? "masterplanfee" : 
                                          column.id == "parcel Group" ? "parcel" : 
                                          column.id == "date Added" ? "created_at" : 
                                          column.id == "__pkSubID" ? "subdivision_code" : 
                                          column.id == "_fkBuilderID" ? "builder_code" : 
                                          column.id == "total Closings" ? "total_closings" : 
                                          column.id == "total Permits" ? "total_permits" : 
                                          column.id == "total Net Sales" ? "total_net_sales" : 
                                          column.id == "months Open" ? "months_open" : 
                                          column.id == "latest Traffic/Sales Data" ? "latest_traffic_data" : 
                                          column.id == "latest Lots Released" ? "latest_lots_released" : 
                                          column.id == "latest Standing Inventory" ? "latest_standing_inventory" : 
                                          column.id == "unsold Lots" ? "unsold_lots" : 
                                          column.id == "avg Sqft All" ? "avg_sqft_all" : 
                                          column.id == "avg Sqft Active" ? "avg_sqft_active" : 
                                          column.id == "avg Base Price All" ? "avg_base_price_all" : 
                                          column.id == "avg Base Price Active" ? "avg_base_price_active" : 
                                          column.id == "min Sqft All" ? "min_sqft_all" : 
                                          column.id == "max Sqft All" ? "max_sqft_all" : 
                                          column.id == "max Sqft Active" ? "max_sqft_active_current" : 
                                          column.id == "min Base Price All" ? "min_base_price_all" : 
                                          column.id == "min Sqft Active" ? "min_sqft_active_current" : 
                                          column.id == "max Base Price All" ? "max_base_price_all" : 
                                          column.id == "avg Traffic Per Month This Year" ? "avg_net_traffic_per_month_this_year" : 
                                          column.id == "avg Net Sales Per Month This Year" ? "avg_net_sales_per_month_this_year" : 
                                          column.id == "avg Closings Per Month This Year" ? "avg_closings_per_month_this_year" : 
                                          column.id == "avg Net Sales Per Month Since Open" ? "avg_net_sales_per_month_since_open" : 
                                          column.id == "avg Net Sales Per Month Last 3 Months" ? "avg_net_sales_per_month_last_three_months" : 
                                          column.id == "max Week Ending" ? "max_week_ending" : 
                                          column.id == "min Week Ending" ? "min_week_ending" : 
                                          column.id == "sqft Group" ? "sqft_group" : 
                                          column.id == "price Group" ? "price_group" : 
                                          column.id == "month Net Sold" ? "month_net_sold" : 
                                          column.id == "year Net Sold" ? "year_net_sold" : 
                                          column.id == "parcel" ? "parcel" : toCamelCase(column.id))
                                        ).direction === "asc" ? "↑" : "↓"}
                                    </span>
                                    ) : ((column.id == "action" || column.id == "cross Streets" || column.id == "website") ? "" : <span>↑↓</span>
                                  )}
                                </strong>
                                
                                {(!excelLoading) && (column.id !== "action" && column.id !== "status" && column.id !== "reporting" && column.id !== "builder" && column.id !== "name" &&
                                  column.id !== "product Type" && column.id !== "area" && column.id !== "master Plan" && column.id !== "zip Code" && column.id !== "total Lots" &&
                                  column.id !== "lot Width" && column.id !== "lot Size" && column.id !== "zoning" && column.id !== "age Restricted" && column.id !== "all Single Story" &&
                                  column.id !== "gated" && column.id !== "cross Streets" && column.id !== "juridiction" && column.id !== "latitude" && column.id !== "longitude" &&
                                  column.id !== "gas Provider" && column.id !== "hOA Fee" && column.id !== "master Plan Fee" && column.id !== "parcel Group" && column.id !== "phone" &&
                                  column.id !== "website" && column.id !== "date Added" && column.id !== "__pkSubID" && column.id !== "_fkBuilderID" && column.id !== "latest Traffic/Sales Data" &&
                                  column.id !== "max Week Ending" && column.id !== "min Week Ending" && column.id !== "sqft Group" && column.id !== "price Group" && column.id !== "open Since"
                                ) && (
                                    <>
                                    
                                      <select value={column.id == "total Closings" ? totalClosingsOption : column.id == "total Permits" ? totalPermitsOption : 
                                        column.id == "total Net Sales" ? totalNetSalesOption : column.id == "months Open" ? monthsOpenOption : 
                                        column.id == "latest Lots Released" ? latestLotsReleasedOption : column.id == "latest Standing Inventory" ? latestStandingInventoryOption :
                                        column.id == "unsold Lots" ? unsoldLotsOption : column.id == "avg Sqft All" ? avgSqftAllOption :
                                        column.id == "avg Sqft Active" ? avgSqftActiveOption : column.id == "avg Base Price All" ? avgBasePriceAllOption :
                                        column.id == "avg Base Price Active" ? avgBasePriceActiveOption : column.id == "min Sqft All" ? minSqftAllOption :
                                        column.id == "max Sqft All" ? maxSqftAllOption : column.id == "min Base Price All" ? minBasePriceAllOption : 
                                        column.id == "min Sqft Active" ? minSqftActiveOption : column.id == "max Base Price All" ? maxBasePriceAllOption :
                                        column.id == "max Sqft Active" ? maxSqftActiveOption : column.id == "avg Net Traffic Per Month This Year" ? avgNetTrafficPerMonthThisYearOption : 
                                        column.id == "avg Net Sales Per Month This Year" ? avgNetSalesPerMonthThisYearOption : column.id == "avg Closings Per Month This Year" ? avgClosingsPerMonthThisYearOption :
                                        column.id == "avg Net Sales Per Month Since Open" ? avgNetSalesPerMonthSinceOpenOption : column.id == "avg Net Sales Per Month Last 3 Months" ? avgNetSalesPerMonthLastThreeMonthsOption :
                                        column.id == "month Net Sold" ? monthNetSoldOption : column.id == "year Net Sold" ? yearNetSoldOption :
                                        column.id == "avg Closing Price" ? avgClosingPriceOption : column.id == "permits This Year" ? permitsThisYearOption :
                                        column.id == "median Closing Price Since Open" ? medianClosingPriceSinceOpenOption : column.id == "median Closing Price This Year" ? medianClosingPriceThisYearOption : ""} 
                                      style={{cursor: "pointer", marginLeft: '10px'}} 
                                      onChange={(e) => column.id == "total Closings" ? handleSelectChange(e, "total_closings") : 
                                        column.id == "total Permits" ? handleSelectChange(e, "total_permits") :
                                        column.id == "total Net Sales" ? handleSelectChange(e, "total_net_sales") :
                                        column.id == "months Open" ? handleSelectChange(e, "months_open") :
                                        column.id == "latest Lots Released" ? handleSelectChange(e, "latest_lots_released") :
                                        column.id == "latest Standing Inventory" ? handleSelectChange(e, "latest_standing_inventory") :
                                        column.id == "unsold Lots" ? handleSelectChange(e, "unsold_lots") :
                                        column.id == "avg Sqft All" ? handleSelectChange(e, "avg_sqft_all") :
                                        column.id == "avg Sqft Active" ? handleSelectChange(e, "avg_sqft_active") :
                                        column.id == "avg Base Price All" ? handleSelectChange(e, "avg_base_price_all") :
                                        column.id == "avg Base Price Active" ? handleSelectChange(e, "avg_base_price_active") :
                                        column.id == "min Sqft All" ? handleSelectChange(e, "min_sqft_all") :
                                        column.id == "max Sqft All" ? handleSelectChange(e, "max_sqft_all") :
                                        column.id == "min Base Price All" ? handleSelectChange(e, "min_base_price_all") :
                                        column.id == "min Sqft Active" ? handleSelectChange(e, "min_sqft_active") :
                                        column.id == "max Base Price All" ? handleSelectChange(e, "max_base_price_all") :
                                        column.id == "max Sqft Active" ? handleSelectChange(e, "max_sqft_active") :
                                        column.id == "avg Net Traffic Per Month This Year" ? handleSelectChange(e, "avg_net_traffic_per_month_this_year") :
                                        column.id == "avg Net Sales Per Month This Year" ? handleSelectChange(e, "avg_net_sales_per_month_this_year") :
                                        column.id == "avg Closings Per Month This Year" ? handleSelectChange(e, "avg_closings_per_month_this_year") :
                                        column.id == "avg Net Sales Per Month Since Open" ? handleSelectChange(e, "avg_net_sales_per_month_since_open") :
                                        column.id == "avg Net Sales Per Month Last 3 Months" ? handleSelectChange(e, "avg_net_sales_per_month_last_three_months") :
                                        column.id == "month Net Sold" ? handleSelectChange(e, "month_net_sold") :
                                        column.id == "year Net Sold" ? handleSelectChange(e, "year_net_sold") : 
                                        column.id == "avg Closing Price" ? handleSelectChange(e, "avg_closing_price") : 
                                        column.id == "permits This Year" ? handleSelectChange(e, "permit_this_year") : 
                                        column.id == "median Closing Price Since Open" ? handleSelectChange(e, "median_closing_price_since_open") : 
                                        column.id == "median Closing Price This Year" ? handleSelectChange(e, "median_closing_price_this_year") : ""}>
                                        <option value="" disabled>CALCULATION</option>
                                        <option value="sum">Sum</option>
                                        <option value="avg">Avg</option>
                                      </select>
                                      
                                      <br />
                                    </>
                                  )}
                              </th>
                            ))}
                            {/* <th>
                              <strong>Open Since</strong>
                            </th> */
                          }
                            {/* {checkFieldExist("Status") && (
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
                            )} */}

                            {/* {checkFieldExist("Reporting") && (
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
                            )} */}

                            {/* {checkFieldExist("Builder") && (
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
                            )} */}

                            {/* {checkFieldExist("Name") && (
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
                            )} */}

                            {/* {checkFieldExist("Product Type") && (
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
                            )} */}

                            {/* {checkFieldExist("Area") && (
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
                            )} */}

                            {/* {checkFieldExist("Product Type") && (
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
                            )} */}

                            {/* {checkFieldExist("Zipcode") && (
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
                            )} */}

                            {/* {checkFieldExist("Total Lots") && (
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
                            )} */}

                            {/* {checkFieldExist("Lot Width") && (
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
                            )} */}

                            {/* {checkFieldExist("Lot Size") && (
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
                            )} */}

                            {/* {checkFieldExist("Zoning") && (
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
                            )} */}

                            {/* {checkFieldExist("Age Restricted") && (
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
                            )} */}

                            {/* {checkFieldExist("All Single Story") && (
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
                            )} */}

                            {/* {checkFieldExist("Gated") && (
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
                            )} */}

                            {/* {checkFieldExist("Location") && (
                              <th>
                                <strong> Location</strong>
                              </th>
                            )} */}

                            {/* {checkFieldExist("Juridiction") && (
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
                            )} */}

                            {/* {checkFieldExist("Latitude") && (
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
                            )} */}

                            {/* {checkFieldExist("Longitude") && (
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
                            )} */}

                            {/* {checkFieldExist("Gas Provider") && (
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
                            )} */}

                            {/* {checkFieldExist("HOA Fee") && (
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
                            )} */}

                            {/* {checkFieldExist("Masterplan Fee") && (
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
                            )} */}

                            {/* {checkFieldExist("Parcel Group") && (
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
                            )} */}

                            {/* {checkFieldExist("Phone") && (
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
                            )} */}

                            {/* {checkFieldExist("Website") && (
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
                            )} */}

                            {/* {checkFieldExist("Date Added") && (
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
                            )} */}

                            {/* {checkFieldExist("__pkSubID") && (
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
                            )} */}

                            {/* {checkFieldExist("_fkBuilderID") && (
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
                            )} */}

                            {/* {checkFieldExist("Total Closings") && (
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
                              )} */}

                            {/* {checkFieldExist("Total Permits") && (                     
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
                            )} */}

                              {/* {checkFieldExist("Total Net Sales") && (
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
                               )} */}

                              {/* {checkFieldExist("Months Open") && (
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
                            )} */}

                              {/* {checkFieldExist("Latest Traffic/Sales Data") && (
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
                             )} */}

                              {/* {checkFieldExist("Latest Lots Released") && (
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
                              )} */}

                              {/* {checkFieldExist("Latest Standing Inventory") && (
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
                               )} */}

                              {/* {checkFieldExist("Unsold Lots") && (
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
                              )} */}

                              {/* {checkFieldExist("Avg Sqft All") && (
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
                              )} */}

                              {/* {checkFieldExist("Avg Sqft Active") && (
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
                            )} */}

                              {/* {checkFieldExist("Avg Base Price All") && (
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
                               )} */}

                              {/* {checkFieldExist("Avg Base Price Active") && (
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
                              )} */}

                              {/* {checkFieldExist("Min Sqft All") && (
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
                               )} */}

                              {/* {checkFieldExist("Min Sqft Active") && (
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
                              )} */}

                              {/* {checkFieldExist("Max Sqft All") && (
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
                              )} */}

                              {/* {checkFieldExist("Max Sqft Active") && (
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
                                   )} */}

                              {/* {checkFieldExist("Min Base Price All") && (
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
                              )} */}

                              {/* {checkFieldExist("Min Sqft Active") && (
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
                              )} */}
                              
                              {/* {checkFieldExist("Max Base Price All") && (
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
                              )} */}

                              {/* {checkFieldExist("Max Sqft Active") && (
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
                               )} */}

                              {/* {checkFieldExist("Avg Net Traffic Per Month This Year") && (
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
                               )} */}

                              {/* {checkFieldExist("Avg Net Sales Per Month This Year") && (
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
                             )} */}

                              {/* {checkFieldExist("Avg Closings Per Month This Year") && (
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
                              )} */}

                              {/* {checkFieldExist("Avg Net Sales Per Month Since Open") && (
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
                               )} */}

                              {/* {checkFieldExist("Avg Net Sales Per Month Last 3 Months") && (
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
                              )} */}

                              {/* {checkFieldExist("Max Week Ending") && (
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
                               )} */}

                              {/* {checkFieldExist("Min Week Ending") && (
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
                                )} */}

                              {/* {checkFieldExist("Sqft Group") && (
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
                               )} */}

                              {/* {checkFieldExist("Price Group") && (
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
                              )} */}

                              {/* {checkFieldExist("Month Net Sold") && (
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
                              )} */}

                              {/* {checkFieldExist("Year Net Sold") && (
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
                              
                            )} */}

                            {/* {checkFieldExist("Action") && (
                              <th>
                                {" "}
                                <strong> Action </strong>
                              </th>
                            )} */}

                          </tr>
                        </thead>
                        <tbody style={{ textAlign: "center" }}>
                        {!excelLoading &&
                          <tr>
                            <td></td>
                            <td></td>
                            {columns.map((column) => (
                              <>
                                {column.id == "status" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "reporting" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "builder" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "name" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "product Type" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "area" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "master Plan" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "zip Code" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "total Lots" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "lot Width" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "lot Size" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "zoning" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "age Restricted" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "all Single Story" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "gated" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "cross Streets" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "juridiction" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "latitude" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "longitude" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "gas Provider" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "hOA Fee" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "master Plan Fee" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "parcel Group" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "phone" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "website" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "date Added" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "__pkSubID" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "_fkBuilderID" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
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
                                {column.id == "months Open" &&
                                  <td key={column.id} style={{ textAlign: "center" }}>{monthsOpenResult.toFixed(2)}</td>
                                }
                                {column.id == "latest Traffic/Sales Data" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "latest Lots Released" &&
                                  <td key={column.id} style={{ textAlign: "center" }}>{latestLotsReleasedResult.toFixed(2)}</td>
                                }
                                {column.id == "latest Standing Inventory" &&
                                  <td key={column.id} style={{ textAlign: "center" }}>{latestStandingInventoryResult.toFixed(2)}</td>
                                }
                                {column.id == "unsold Lots" &&
                                  <td key={column.id} style={{ textAlign: "center" }}>{unsoldLotsResult.toFixed(2)}</td>
                                }
                                {column.id == "avg Sqft All" &&
                                  <td key={column.id} style={{ textAlign: "center" }}>{avgSqftAllResult.toFixed(2)}</td>
                                }
                                {column.id == "avg Sqft Active" &&
                                  <td key={column.id} style={{ textAlign: "center" }}>{avgSqftActiveResult.toFixed(2)}</td>
                                }
                                {column.id == "avg Base Price All" &&
                                  <td key={column.id} style={{ textAlign: "center" }}>{avgBasePriceAllResult.toFixed(2)}</td>
                                }
                                {column.id == "avg Base Price Active" &&
                                  <td key={column.id} style={{ textAlign: "center" }}>{avgBasePriceActiveResult.toFixed(2)}</td>
                                }
                                {column.id == "min Sqft All" &&
                                  <td key={column.id} style={{ textAlign: "center" }}>{minSqftAllResult.toFixed(2)}</td>
                                }
                                {column.id == "max Sqft All" &&
                                  <td key={column.id} style={{ textAlign: "center" }}>{maxSqftAllResult.toFixed(2)}</td>
                                }
                                {column.id == "min Base Price All" &&
                                  <td key={column.id} style={{ textAlign: "center" }}>{minBasePriceAllResult.toFixed(2)}</td>
                                }
                                {column.id == "min Sqft Active" &&
                                  <td key={column.id} style={{ textAlign: "center" }}>{minSqftActiveResult.toFixed(2)}</td>
                                }
                                {column.id == "max Base Price All" &&
                                  <td key={column.id} style={{ textAlign: "center" }}>{maxBasePriceAllResult.toFixed(2)}</td>
                                }
                                {column.id == "max Sqft Active" &&
                                  <td key={column.id} style={{ textAlign: "center" }}>{maxSqftActiveResult.toFixed(2)}</td>
                                }
                                {column.id == "avg Traffic Per Month This Year" &&
                                  <td key={column.id} style={{ textAlign: "center" }}>{avgNetTrafficPerMonthThisYearResult.toFixed(2)}</td>
                                }
                                {column.id == "avg Net Sales Per Month This Year" &&
                                  <td key={column.id} style={{ textAlign: "center" }}>{avgNetSalesPerMonthThisYearResult.toFixed(2)}</td>
                                }
                                {column.id == "avg Closings Per Month This Year" &&
                                  <td key={column.id} style={{ textAlign: "center" }}>{avgClosingsPerMonthThisYearResult.toFixed(2)}</td>
                                }
                                {column.id == "avg Net Sales Per Month Since Open" &&
                                  <td key={column.id} style={{ textAlign: "center" }}>{avgNetSalesPerMonthSinceOpenResult.toFixed(2)}</td>
                                }
                                {column.id == "avg Net Sales Per Month Last 3 Months" &&
                                  <td key={column.id} style={{ textAlign: "center" }}>{avgNetSalesPerMonthLastThreeMonthsResult.toFixed(2)}</td>
                                }
                                {column.id == "max Week Ending" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "min Week Ending" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "sqft Group" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "price Group" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "month Net Sold" &&
                                  <td key={column.id} style={{ textAlign: "center" }}>{monthNetSoldResult.toFixed(2)}</td>
                                }
                                {column.id == "year Net Sold" &&
                                  <td key={column.id} style={{ textAlign: "center" }}>{yearNetSoldResult.toFixed(2)}</td>
                                }
                                {column.id == "open Since" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "avg Closing Price" &&
                                  <td key={column.id} style={{ textAlign: "center" }}>{avgClosingPriceResult.toFixed(2)}</td>
                                }
                                {column.id == "permits This Year" &&
                                  <td key={column.id} style={{ textAlign: "center" }}>{permitsThisYearResult.toFixed(2)}</td>
                                }
                                {column.id == "median Closing Price Since Open" &&
                                  <td key={column.id} style={{ textAlign: "center" }}>{medianClosingPriceSinceOpenResult.toFixed(2)}</td>
                                }
                                {column.id == "median Closing Price This Year" &&
                                  <td key={column.id} style={{ textAlign: "center" }}>{medianClosingPriceThisYearResult.toFixed(2)}</td>
                                }
                                {column.id == "action" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                              </>
                            ))}
                          </tr>}
                          {/* {!excelLoading &&
                          <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td style={{textAlign: "center"}}>{totalClosingsResult.toFixed(2)}</td>
                            <td style={{textAlign: "center"}}>{totalPermitsResult.toFixed(2)}</td>
                            <td style={{textAlign: "center"}}>{totalNetSalesResult.toFixed(2)}</td>
                            <td style={{textAlign: "center"}}>{monthsOpenResult.toFixed(2)}</td>
                            <td></td>
                            <td style={{textAlign: "center"}}>{latestLotsReleasedResult.toFixed(2)}</td>
                            <td style={{textAlign: "center"}}>{latestStandingInventoryResult.toFixed(2)}</td>
                            <td style={{textAlign: "center"}}>{unsoldLotsResult.toFixed(2)}</td>
                            <td style={{textAlign: "center"}}>{avgSqftAllResult.toFixed(2)}</td>
                            <td style={{textAlign: "center"}}>{avgSqftActiveResult.toFixed(2)}</td>
                            <td style={{textAlign: "center"}}>{avgBasePriceAllResult.toFixed(2)}</td>
                            <td style={{textAlign: "center"}}>{avgBasePriceActiveResult.toFixed(2)}</td>
                            <td style={{textAlign: "center"}}>{minSqftAllResult.toFixed(2)}</td>
                            <td style={{textAlign: "center"}}>{maxSqftAllResult.toFixed(2)}</td>
                            <td style={{textAlign: "center"}}>{minBasePriceAllResult.toFixed(2)}</td>
                            <td style={{textAlign: "center"}}>{minSqftActiveResult.toFixed(2)}</td>
                            <td style={{textAlign: "center"}}>{maxBasePriceAllResult.toFixed(2)}</td>
                            <td style={{textAlign: "center"}}>{maxSqftActiveResult.toFixed(2)}</td>
                            <td style={{textAlign: "center"}}>{avgNetTrafficPerMonthThisYearResult.toFixed(2)}</td>
                            <td style={{textAlign: "center"}}>{avgNetSalesPerMonthThisYearResult.toFixed(2)}</td>
                            <td style={{textAlign: "center"}}>{avgClosingsPerMonthThisYearResult.toFixed(2)}</td>
                            <td style={{textAlign: "center"}}>{avgNetSalesPerMonthSinceOpenResult.toFixed(2)}</td>
                            <td style={{textAlign: "center"}}>{avgNetSalesPerMonthLastThreeMonthsResult.toFixed(2)}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td style={{textAlign: "center"}}>{monthNetSoldResult}</td>
                            <td style={{textAlign: "center"}}>{yearNetSoldResult}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                          </tr>} */}
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
                                {columns.map((column) => (
                                  <>
                                  {column.id == "status" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>
                                      {element.status === 1 && "Active"}
                                      {element.status === 0 && "Sold Out"}
                                      {element.status === 2 && "Future"}
                                    </td>
                                  }
                                  {column.id == "reporting" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>
                                      {element.reporting === 1 && "Yes"}
                                      {element.reporting === 0 && "No"} 
                                    </td>
                                  }
                                  {column.id == "builder" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.builder.name}</td>
                                  }
                                  {column.id == "name" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.name}</td>
                                  }
                                  {column.id == "product Type" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.product_type}</td>
                                  }
                                  {column.id == "area" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.area}</td>
                                  }
                                  {column.id == "master Plan" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.masterplan_id}</td>
                                  }
                                  {column.id == "zip Code" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.zipcode}</td>
                                  }
                                  {column.id == "total Lots" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.totallots}</td>
                                  }
                                  {column.id == "lot Width" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.lotwidth}</td>
                                  }
                                  {column.id == "lot Size" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.lotsize}</td>
                                  }
                                  {column.id == "zoning" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.zoning}</td>
                                  }
                                  {column.id == "age Restricted" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>
                                      {element.age === 1 && "Yes"}
                                      {element.age === 0 && "No"}
                                    </td>
                                  }
                                  {column.id == "all Single Story" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>
                                      {element.single === 1 && "Yes"}
                                      {element.single === 0 && "No"}
                                    </td>
                                  }
                                  {column.id == "gated" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>
                                      {element.gated === 1 && "Yes"}
                                      {element.gated === 0 && "No"}
                                    </td>
                                  }
                                  {column.id == "cross Streets" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.location}</td>
                                  }
                                  {column.id == "juridiction" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.juridiction}</td>
                                  }
                                  {column.id == "latitude" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.lat}</td>
                                  }
                                  {column.id == "longitude" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.lng}</td>
                                  }
                                  {column.id == "gas Provider" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.gasprovider}</td>
                                  }
                                  {column.id == "hOA Fee" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.hoafee}</td>
                                  }
                                  {column.id == "master Plan Fee" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.masterplanfee}</td>
                                  }
                                  {column.id == "parcel Group" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.parcel}</td>
                                  }
                                  {column.id == "phone" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.phone}</td>
                                  }
                                  {column.id == "website" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.builder.website}</td>
                                  }
                                  {column.id == "date Added" &&
                                    <td key={column.id} style={{ textAlign: "center" }}><DateComponent date={element.dateadded} /></td>
                                  }
                                  {column.id == "__pkSubID" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.subdivision_code}</td>
                                  }
                                  {column.id == "_fkBuilderID" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.builder.builder_code}</td>
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
                                  {column.id == "months Open" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.months_open}</td>
                                  }
                                  {column.id == "latest Traffic/Sales Data" &&
                                    <td key={column.id} style={{ textAlign: "center" }}><DateComponent date={element.latest_traffic_data} /></td>
                                  }
                                  {column.id == "latest Lots Released" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.latest_lots_released}</td>
                                  }
                                  {column.id == "latest Standing Inventory" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.latest_standing_inventory}</td>
                                  }
                                  {column.id == "unsold Lots" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.unsold_lots}</td>
                                  }
                                  {column.id == "avg Sqft All" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.avg_sqft_all}</td>
                                  }
                                  {column.id == "avg Sqft Active" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.avg_sqft_active}</td>
                                  }
                                  {column.id == "avg Base Price All" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{<PriceComponent price={element.avg_base_price_all} /> || "NA"}</td>
                                  }
                                  {column.id == "avg Base Price Active" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{<PriceComponent price={element.avg_base_price_active} /> || "NA"}</td>
                                  }
                                  {column.id == "min Sqft All" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.min_sqft_all}</td>
                                  }
                                  {column.id == "max Sqft All" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.max_sqft_all}</td>
                                  }
                                  {column.id == "min Base Price All" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{<PriceComponent price={element.min_base_price_all} /> || "NA"}</td>
                                  }
                                  {column.id == "min Sqft Active" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.min_sqft_active}</td>
                                  }
                                  {column.id == "max Base Price All" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{<PriceComponent price={element.max_base_price_all} /> || "NA"}</td>
                                  }
                                  {column.id == "max Sqft Active" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.max_sqft_active}</td>
                                  }
                                  {column.id == "avg Traffic Per Month This Year" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.avg_net_traffic_per_month_this_year}</td>
                                  }
                                  {column.id == "avg Net Sales Per Month This Year" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.avg_net_sales_per_month_this_year}</td>
                                  }
                                  {column.id == "avg Closings Per Month This Year" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.avg_closings_per_month_this_year}</td>
                                  }
                                  {column.id == "avg Net Sales Per Month Since Open" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.avg_net_sales_per_month_since_open}</td>
                                  }
                                  {column.id == "avg Net Sales Per Month Last 3 Months" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.avg_net_sales_per_month_last_three_months}</td>
                                  }
                                  {column.id == "max Week Ending" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{<DateComponent date={element.max_week_ending} /> || "NA"}</td>
                                  }
                                  {column.id == "min Week Ending" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{<DateComponent date={element.min_week_ending} /> || "NA"}</td>
                                  }
                                  {column.id == "sqft Group" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.sqft_group}</td>
                                  }
                                  {column.id == "price Group" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.price_group}</td>
                                  }
                                  {column.id == "month Net Sold" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.month_net_sold}</td>
                                  }
                                  {column.id == "year Net Sold" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.year_net_sold}</td>
                                  }
                                    {column.id == "open Since" &&
                                    <td key={column.id} style={{ textAlign: "center" }}> <DateComponent date={element.opensince}/></td>
                                  }
                                  {column.id == "avg Closing Price" &&
                                    <td key={column.id} style={{ textAlign: "center" }}> <PriceComponent price={element.avg_closing_price}/></td>
                                  }
                                  {column.id == "permits This Year" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.permit_this_year}</td>
                                  }
                                  {column.id == "median Closing Price Since Open" &&
                                    <td key={column.id} style={{ textAlign: "center" }}> <PriceComponent price={element.median_closing_price_since_open}/></td>
                                  }
                                  {column.id == "median Closing Price This Year" &&
                                    <td key={column.id} style={{ textAlign: "center" }}><PriceComponent price={element.median_closing_price_this_year}/></td>
                                  }

                                  {column.id == "action" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>
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
                                  }
                                  </>
                                ))}
                                  
                                    {/* <td style={{ textAlign: "center" }}>{element.opensince}</td> */}
                                  

                                {/* {checkFieldExist("__pkSubID") && (
                                  <td>{element.subdivision_code}</td>
                                )} */}
                                {/* <td>{element.min_sqft_active_current}</td> */}
                                {/* <td>{element.max_sqft_active_current}</td> */}
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
                        {/* <tbody>
                          {!excelLoading && 
                            <tr>
                              <td></td>
                              <td></td>
                              {columns.map((column) => (
                                <>
                                {column.id == "status" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "reporting" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "builder" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "name" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "product Type" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "area" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "master Plan" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "zip Code" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "total Lots" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "lot Width" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "lot Size" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "zoning" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "age Restricted" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "all Single Story" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "gated" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "cross Streets" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "juridiction" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "latitude" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "longitude" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "gas Provider" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "hOA Fee" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "master Plan Fee" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "parcel Group" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "phone" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "website" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "date Added" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "__pkSubID" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "_fkBuilderID" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "total Closings" &&
                                  <td  key={ filter ? BuilderList.total_closings : AllBuilderListExport.total_closings} style={{ textAlign: "center" }}>
                                    <select 
                                        value={totalClosingsOption} 
                                        onChange={(e) => handleSelectChange(e, "total_closings")}
                                        placeholder="CALCULATE"
                                      >
                                        <option value="" disabled>CALCULATE</option>
                                        <option value="sum">Sum</option>
                                        <option value="avg">Avg</option>
                                      </select>
                                      <br/>
                                      <span>{totalClosingsResult.toFixed(2)}</span>
                                  </td>
                                }
                                {column.id == "total Permits" &&
                                  <td key={filter ? BuilderList.total_permits : AllBuilderListExport.total_permits} style={{ textAlign: "center" }}>
                                    <select
                                      value={totalPermitsOption}
                                      onChange={(e) => handleSelectChange(e, "total_permits")}
                                      placeholder="CALCULATE"
                                    >
                                      <option value="" disabled>CALCULATE</option>
                                      <option value="sum">Sum</option>
                                      <option value="avg">Avg</option>
                                    </select>
                                    <br />
                                    <span>{totalPermitsResult.toFixed(2)}</span>
                                  </td>
                                }
                                {column.id == "total Net Sales" &&
                                  <td key={filter ? BuilderList.total_net_sales : AllBuilderListExport.total_net_sales} style={{ textAlign: "center" }}>
                                    <select
                                      value={totalNetSalesOption}
                                      onChange={(e) => handleSelectChange(e, "total_net_sales")}
                                      placeholder="CALCULATE"
                                    >
                                      <option value="" disabled>CALCULATE</option>
                                      <option value="sum">Sum</option>
                                      <option value="avg">Avg</option>
                                    </select>
                                    <br />
                                    <span>{totalNetSalesResult.toFixed(2)}</span>
                                  </td>
                                }
                                {column.id == "months Open" &&
                                  <td key={filter ? BuilderList.months_open : AllBuilderListExport.months_open} style={{ textAlign: "center" }}>
                                      <select
                                        value={monthsOpenOption}
                                        onChange={(e) => handleSelectChange(e, "months_open")}
                                        placeholder="CALCULATE"
                                      >
                                        <option value="" disabled>CALCULATE</option>
                                        <option value="sum">Sum</option>
                                        <option value="avg">Avg</option>
                                      </select>
                                      <br />
                                      <span>{monthsOpenResult.toFixed(2)}</span>
                                  </td>
                                }
                                {column.id == "latest Traffic/Sales Data" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "latest Lots Released" &&
                                  <td key={filter ? BuilderList.latest_lots_released : AllBuilderListExport.latest_lots_released} style={{ textAlign: "center" }}>
                                    <select
                                        value={latestLotsReleasedOption}
                                        onChange={(e) => handleSelectChange(e, "latest_lots_released")}
                                        placeholder="CALCULATE"
                                      >
                                        <option value="" disabled>CALCULATE</option>
                                        <option value="sum">Sum</option>
                                        <option value="avg">Avg</option>
                                      </select>
                                      <br />
                                      <span>{latestLotsReleasedResult.toFixed(2)}</span>
                                  </td>
                                }
                                {column.id == "latest Standing Inventory" &&
                                  <td key={filter ? BuilderList.latest_standing_inventory : AllBuilderListExport.latest_standing_inventory} style={{ textAlign: "center" }}>
                                      <select
                                        value={latestStandingInventoryOption}
                                        onChange={(e) => handleSelectChange(e, "latest_lots_released")}
                                        placeholder="CALCULATE"
                                      >
                                        <option value="" disabled>CALCULATE</option>
                                        <option value="sum">Sum</option>
                                        <option value="avg">Avg</option>
                                      </select>
                                      <br />
                                      <span>{latestStandingInventoryResult.toFixed(2)}</span>
                                  </td>
                                }
                                {column.id == "unsold Lots" &&
                                  <td key={filter ? BuilderList.unsold_lots : AllBuilderListExport.unsold_lots} style={{ textAlign: "center" }}>
                                      <select
                                        value={unsoldLotsOption}
                                        onChange={(e) => handleSelectChange(e, "latest_lots_released")}
                                        placeholder="CALCULATE"
                                      >
                                        <option value="" disabled>CALCULATE</option>
                                        <option value="sum">Sum</option>
                                        <option value="avg">Avg</option>
                                      </select>
                                      <br />
                                      <span>{unsoldLotsResult.toFixed(2)}</span>
                                  </td>
                                }
                                {column.id == "avg Sqft All" &&
                                  <td key={filter ? BuilderList.avg_sqft_all : AllBuilderListExport.avg_sqft_all} style={{ textAlign: "center" }}>
                                      <select
                                        value={avgSqftAllOption}
                                        onChange={(e) => handleSelectChange(e, "avg_sqft_all")}
                                        placeholder="CALCULATE"
                                      >
                                        <option value="" disabled>CALCULATE</option>
                                        <option value="sum">Sum</option>
                                        <option value="avg">Avg</option>
                                      </select>
                                      <br />
                                      <span>{avgSqftAllResult.toFixed(2)}</span>
                                  </td>
                                }
                                {column.id == "avg Sqft Active" &&
                                  <td key={filter ? BuilderList.avg_sqft_active : AllBuilderListExport.avg_sqft_active} style={{ textAlign: "center" }}>
                                      <select
                                        value={avgSqftActiveOption}
                                        onChange={(e) => handleSelectChange(e, "avg_sqft_active")}
                                        placeholder="CALCULATE"
                                      >
                                        <option value="" disabled>CALCULATE</option>
                                        <option value="sum">Sum</option>
                                        <option value="avg">Avg</option>
                                      </select>
                                      <br />
                                      <span>{avgSqftActiveResult.toFixed(2)}</span>
                                  </td>
                                }
                                {column.id == "avg Base Price All" &&
                                  <td key={filter ? BuilderList.avg_base_price_all : AllBuilderListExport.avg_base_price_all} style={{ textAlign: "center" }}>
                                      <select
                                        value={avgBasePriceAllOption}
                                        onChange={(e) => handleSelectChange(e, "avg_base_price_all")}
                                        placeholder="CALCULATE"
                                      >
                                        <option value="" disabled>CALCULATE</option>
                                        <option value="sum">Sum</option>
                                        <option value="avg">Avg</option>
                                      </select>
                                      <br />
                                      <span>{avgBasePriceAllResult.toFixed(2)}</span>
                                  </td>
                                }
                                {column.id == "avg Base Price Active" &&
                                  <td key={filter ? BuilderList.avg_base_price_active : AllBuilderListExport.avg_base_price_active} style={{ textAlign: "center" }}>
                                      <select
                                        value={avgBasePriceActiveOption}
                                        onChange={(e) => handleSelectChange(e, "avg_base_price_active")}
                                        placeholder="CALCULATE"
                                      >
                                        <option value="" disabled>CALCULATE</option>
                                        <option value="sum">Sum</option>
                                        <option value="avg">Avg</option>
                                      </select>
                                      <br />
                                      <span>{avgBasePriceActiveResult.toFixed(2)}</span>
                                  </td>
                                }
                                {column.id == "min Sqft All" &&
                                  <td key={filter ? BuilderList.min_sqft_all : AllBuilderListExport.min_sqft_all} style={{ textAlign: "center" }}>
                                      <select
                                        value={minSqftAllOption}
                                        onChange={(e) => handleSelectChange(e, "min_sqft_all")}
                                        placeholder="CALCULATE"
                                      >
                                        <option value="" disabled>CALCULATE</option>
                                        <option value="sum">Sum</option>
                                        <option value="avg">Avg</option>
                                      </select>
                                      <br />
                                      <span>{minSqftAllResult.toFixed(2)}</span>
                                  </td>
                                }
                                {column.id == "max Sqft All" &&
                                  <td key={filter ? BuilderList.max_sqft_all : AllBuilderListExport.max_sqft_all} style={{ textAlign: "center" }}>
                                      <select
                                        value={maxSqftAllOption}
                                        onChange={(e) => handleSelectChange(e, "max_sqft_all")}
                                        placeholder="CALCULATE"
                                      >
                                        <option value="" disabled>CALCULATE</option>
                                        <option value="sum">Sum</option>
                                        <option value="avg">Avg</option>
                                      </select>
                                      <br />
                                      <span>{maxSqftAllResult.toFixed(2)}</span>
                                  </td>
                                }
                                {column.id == "min Base Price All" &&
                                  <td key={filter ? BuilderList.min_base_price_all : AllBuilderListExport.min_base_price_all} style={{ textAlign: "center" }}>
                                      <select
                                        value={minBasePriceAllOption}
                                        onChange={(e) => handleSelectChange(e, "min_base_price_all")}
                                        placeholder="CALCULATE"
                                      >
                                        <option value="" disabled>CALCULATE</option>
                                        <option value="sum">Sum</option>
                                        <option value="avg">Avg</option>
                                      </select>
                                      <br />
                                      <span>{minBasePriceAllResult.toFixed(2)}</span>
                                  </td>
                                }
                                {column.id == "min Sqft Active" &&
                                  <td key={filter ? BuilderList.min_sqft_active : AllBuilderListExport.min_sqft_active} style={{ textAlign: "center" }}>
                                      <select
                                        value={minSqftActiveOption}
                                        onChange={(e) => handleSelectChange(e, "min_sqft_active")}
                                        placeholder="CALCULATE"
                                      >
                                        <option value="" disabled>CALCULATE</option>
                                        <option value="sum">Sum</option>
                                        <option value="avg">Avg</option>
                                      </select>
                                      <br />
                                      <span>{minSqftActiveResult.toFixed(2)}</span>
                                  </td>
                                }
                                {column.id == "max Base Price All" &&
                                  <td key={filter ? BuilderList.max_base_price_all : AllBuilderListExport.max_base_price_all} style={{ textAlign: "center" }}>
                                      <select
                                        value={maxBasePriceAllOption}
                                        onChange={(e) => handleSelectChange(e, "max_base_price_all")}
                                        placeholder="CALCULATE"
                                      >
                                        <option value="" disabled>CALCULATE</option>
                                        <option value="sum">Sum</option>
                                        <option value="avg">Avg</option>
                                      </select>
                                      <br />
                                      <span>{maxBasePriceAllResult.toFixed(2)}</span>
                                  </td>
                                }
                                {column.id == "max Sqft Active" &&
                                  <td key={filter ? BuilderList.max_sqft_active : AllBuilderListExport.max_sqft_active} style={{ textAlign: "center" }}>
                                      <select
                                        value={maxSqftActiveOption}
                                        onChange={(e) => handleSelectChange(e, "max_sqft_active")}
                                        placeholder="CALCULATE"
                                      >
                                        <option value="" disabled>CALCULATE</option>
                                        <option value="sum">Sum</option>
                                        <option value="avg">Avg</option>
                                      </select>
                                      <br />
                                      <span>{maxSqftActiveResult.toFixed(2)}</span>
                                  </td>
                                }
                                {column.id == "avg Traffic Per Month This Year" &&
                                  <td key={filter ? BuilderList.avg_net_traffic_per_month_this_year : AllBuilderListExport.avg_net_traffic_per_month_this_year} style={{ textAlign: "center" }}>
                                      <select
                                        value={avgNetTrafficPerMonthThisYearOption}
                                        onChange={(e) => handleSelectChange(e, "avg_net_traffic_per_month_this_year")}
                                        placeholder="CALCULATE"
                                      >
                                        <option value="" disabled>CALCULATE</option>
                                        <option value="sum">Sum</option>
                                        <option value="avg">Avg</option>
                                      </select>
                                      <br />
                                      <span>{avgNetTrafficPerMonthThisYearResult.toFixed(2)}</span>
                                  </td>
                                }
                                {column.id == "avg Net Sales Per Month This Year" &&
                                  <td key={filter ? BuilderList.avg_net_sales_per_month_this_year : AllBuilderListExport.avg_net_sales_per_month_this_year} style={{ textAlign: "center" }}>
                                    <select
                                        value={avgNetSalesPerMonthThisYearOption}
                                        onChange={(e) => handleSelectChange(e, "avg_net_sales_per_month_this_year")}
                                        placeholder="CALCULATE"
                                      >
                                        <option value="" disabled>CALCULATE</option>
                                        <option value="sum">Sum</option>
                                        <option value="avg">Avg</option>
                                      </select>
                                      <br />
                                      <span>{avgNetSalesPerMonthThisYearResult.toFixed(2)}</span>
                                  </td>
                                }
                                {column.id == "avg Closings Per Month This Year" &&
                                  <td key={filter ? BuilderList.avg_closings_per_month_this_year : AllBuilderListExport.avg_closings_per_month_this_year} style={{ textAlign: "center" }}>
                                    <select
                                        value={avgClosingsPerMonthThisYearOption}
                                        onChange={(e) => handleSelectChange(e, "avg_closings_per_month_this_year")}
                                        placeholder="CALCULATE"
                                      >
                                        <option value="" disabled>CALCULATE</option>
                                        <option value="sum">Sum</option>
                                        <option value="avg">Avg</option>
                                      </select>
                                      <br />
                                      <span>{avgClosingsPerMonthThisYearResult.toFixed(2)}</span>
                                  </td>
                                }
                                {column.id == "avg Net Sales Per Month Since Open" &&
                                  <td key={filter ? BuilderList.avg_net_sales_per_month_since_open : AllBuilderListExport.avg_net_sales_per_month_since_open} style={{ textAlign: "center" }}>
                                    <select
                                        value={avgNetSalesPerMonthSinceOpenOption}
                                        onChange={(e) => handleSelectChange(e, "avg_net_sales_per_month_since_open")}
                                        placeholder="CALCULATE"
                                      >
                                        <option value="" disabled>CALCULATE</option>
                                        <option value="sum">Sum</option>
                                        <option value="avg">Avg</option>
                                      </select>
                                      <br />
                                      <span>{avgNetSalesPerMonthSinceOpenResult.toFixed(2)}</span>
                                  </td>
                                }
                                {column.id == "avg Net Sales Per Month Last 3 Months" &&
                                  <td key={filter ? BuilderList.avg_net_sales_per_month_last_three_months : AllBuilderListExport.avg_net_sales_per_month_last_three_months} style={{ textAlign: "center" }}>
                                    <select
                                        value={avgNetSalesPerMonthLastThreeMonthsOption}
                                        onChange={(e) => handleSelectChange(e, "avg_net_sales_per_month_last_three_months")}
                                        placeholder="CALCULATE"
                                      >
                                        <option value="" disabled>CALCULATE</option>
                                        <option value="sum">Sum</option>
                                        <option value="avg">Avg</option>
                                      </select>
                                      <br />
                                      <span>{avgNetSalesPerMonthLastThreeMonthsResult.toFixed(2)}</span>
                                  </td>
                                }
                                {column.id == "max Week Ending" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "min Week Ending" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "sqft Group" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "price Group" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "month Net Sold" &&
                                  <td key={filter ? BuilderList.month_net_sold : AllBuilderListExport.month_net_sold} style={{ textAlign: "center" }}>
                                    <select
                                        value={monthNetSoldOption}
                                        onChange={(e) => handleSelectChange(e, "month_net_sold")}
                                        placeholder="CALCULATE"
                                      >
                                        <option value="" disabled>CALCULATE</option>
                                        <option value="sum">Sum</option>
                                        <option value="avg">Avg</option>
                                      </select>
                                      <br />
                                      <span>{monthNetSoldResult.toFixed(2)}</span>
                                  </td>
                                }
                                {column.id == "year Net Sold" &&
                                  <td key={filter ? BuilderList.year_net_sold : AllBuilderListExport.year_net_sold} style={{ textAlign: "center" }}>
                                    <select
                                        value={yearNetSoldOption}
                                        onChange={(e) => handleSelectChange(e, "year_net_sold")}
                                        placeholder="CALCULATE"
                                      >
                                        <option value="" disabled>CALCULATE</option>
                                        <option value="sum">Sum</option>
                                        <option value="avg">Avg</option>
                                      </select>
                                      <br />
                                      <span>{yearNetSoldResult.toFixed(2)}</span>
                                  </td>
                                }
                                  {column.id == "open Since" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                                {column.id == "action" &&
                                  <td key={column.id} style={{ textAlign: "center" }}></td>
                                }
                              </>
                            ))}
                          </tr>}
                        </tbody> */}
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
                  <div className="d-flex">

                    <div style={{width: "60%"}}>

                      <div style={{marginTop: "10px"}}>
                        <span className="fw-bold fs-20">
                          {SubdivisionDetails.builder && SubdivisionDetails.builder.name !== undefined
                            ? SubdivisionDetails.builder.name
                            : "NA"}
                        </span><br />
                        <span className="fw-bold fs-30">
                          {SubdivisionDetails.name || "NA"}
                        </span><br />
                        <span className="fs-18">
                          {SubdivisionDetails.builder?.website || "NA"}
                        </span><br />
                      
                        <label className="fs-18" style={{marginTop: "10px"}}><b>PHONE:</b>&nbsp;<span>{SubdivisionDetails.phone || "NA"}</span></label><br />
                        <label className="fs-18"><b>PRODUCT TYPE:</b>&nbsp;<span>{SubdivisionDetails.product_type || "NA"}</span></label><br />
                        <label className="fs-18"><b>OPEN SINCE:</b>&nbsp;<span>{SubdivisionDetails.opensince || "NA"}</span></label><br />
                        <label className="fs-18"><b>AGE RESTRICTED:</b>&nbsp;
                          <span className="fw-bold">
                            {SubdivisionDetails.reporting === 0 && "No"}
                            {SubdivisionDetails.reporting === 1 && "Yes"}
                            {SubdivisionDetails.reporting === "" && "NA"}
                          </span>
                        </label><br />
                        <label className="fs-18"><b>ALL SINGLE-STORY:</b>&nbsp;
                          <span className="fw-bold">
                            {SubdivisionDetails.reporting === 0 && "No"}
                            {SubdivisionDetails.reporting === 1 && "Yes"}
                            {SubdivisionDetails.reporting === "" && "NA"}
                          </span>
                        </label><br />
                        <label className="fs-18"><b>GATED:</b>&nbsp;<span>{SubdivisionDetails.gated || "NA"}</span></label>

                        <hr style={{borderTop:"2px solid black", width: "80%",marginTop: "0px", marginBottom: "10px"}}></hr>

                        <div className="d-flex" style={{marginTop: "5px"}}>
                          <div className="fs-18" style={{width: "180px"}}><span><b>AREA:</b></span>&nbsp;<span>{SubdivisionDetails.area || "NA"}</span></div>
                          <div className="fs-18"><span><b>MASTER PLAN:</b></span>&nbsp;<span>{SubdivisionDetails.area || "NA"}</span></div>
                        </div>
                        <label className="fs-18" style={{marginTop: "5px"}}><b>ZIP CODE:</b>&nbsp;<span>{SubdivisionDetails.zipcode || "NA"}</span></label><br />
                        <label className="fs-18"><b>CROSS STREETS:</b>&nbsp;<span>{SubdivisionDetails.crossstreet || "NA"}</span></label><br />
                        <label className="fs-18"><b>JURISDICTION:</b>&nbsp;<span>{SubdivisionDetails.juridiction || "NA"}</span></label>
                        <div className="d-flex" style={{marginTop: "0px"}}>
                          <div className="fs-18" style={{width: "180px"}}><span><b>LATITUDE:</b></span>&nbsp;<span>{SubdivisionDetails.lat || "NA"}</span></div>
                          <div className="fs-18"><span><b>LONGITUDE:</b></span>&nbsp;<span>{SubdivisionDetails.lng || "NA"}</span></div>
                        </div>
                        <label className="fs-18" style={{marginTop: "5px"}}><b>PARCEL:</b>&nbsp;<span>{SubdivisionDetails.parcel || "NA"}</span></label>

                        <hr style={{borderTop:"2px solid black", width: "80%",marginTop: "0px", marginBottom: "10px"}}></hr>

                        <div className="d-flex" style={{marginTop: "5px"}}>
                          <div className="fs-18" style={{width: "180px"}}><span><b>TOTAL LOTS:</b></span>&nbsp;<span>{SubdivisionDetails.totallots || "NA"}</span></div>
                          <div className="fs-18"><span><b>TOTAL RELEASED:</b></span>&nbsp;<span>{SubdivisionDetails.lotreleased || "NA"}</span></div>
                        </div>
                        <div className="d-flex" style={{marginTop: "5px"}}>
                          <div className="fs-18" style={{width: "180px"}}><span><b>UNSOLD LOTS:</b></span>&nbsp;<span>{SubdivisionDetails.unsoldlots || "NA"}</span></div>
                          <div className="fs-18"><span><b>STANDING INVENTORY:</b></span>&nbsp;<span>{SubdivisionDetails.stadinginventory || "NA"}</span></div>
                        </div>
                        <div className="d-flex" style={{marginTop: "5px"}}>
                          <div className="fs-18" style={{width: "180px"}}><span><b>LOT WIDTH:</b></span>&nbsp;<span>{SubdivisionDetails.lotwidth || "NA"}</span></div>
                          <div className="fs-18"><span><b>LOT SIZE:</b></span>&nbsp;<span>{SubdivisionDetails.lotsize || "NA"}</span></div>
                        </div>

                        <hr style={{borderTop:"2px solid black", width: "80%",marginTop: "5px", marginBottom: "10px"}}></hr>

                        <div className="d-flex" style={{marginTop: "5px"}}>
                          <div className="fs-18" style={{width: "180px"}}><span><b>HOA FEE:</b></span>&nbsp;<span>{SubdivisionDetails.hoafee || "NA"}</span></div>
                          <div className="fs-18"><span><b>MASTER PLAN FEE:</b></span>&nbsp;<span>{SubdivisionDetails.masterplanfee || "NA"}</span></div>
                        </div>
                        <label className="fs-18" style={{marginTop: "5px", marginBottom: "5px"}}><b>GAS PROVIDER:</b>&nbsp;<span>{SubdivisionDetails.gasprovider || "NA"}</span></label><br />
                        <label className="fs-18"><b>ZONING:</b>&nbsp;<span>{SubdivisionDetails.zoning || "NA"}</span></label>

                      </div>
                    </div>

                    <div style={{width: "40%"}}>

                      <div className="d-flex" style={{marginTop: "10px"}}>
                        <div style={{width: "50%"}}>
                          <label className="fs-20" style={{marginBottom: "0px"}}><b>STATUS:</b></label>
                          <div>
                            <span className="" style={{marginTop: "1px"}}>
                              {SubdivisionDetails.status === 1 && "Active"}
                              {SubdivisionDetails.status === 0 && "De-acitve"}
                              {SubdivisionDetails.status === 2 && "Future"}
                            </span>
                          </div>
                        </div>
                        <div>
                        <label className="fs-20" style={{marginBottom: "0px"}}><b>REPORTING?:</b></label>
                          <div>
                            <span className="" style={{marginTop: "1px"}}>
                              {SubdivisionDetails.reporting === 1 && "Yes"}
                              {SubdivisionDetails.reporting === 0 && "No"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="fs-20" style={{ marginBottom: "0px"}}><b>CURRENT AVG BASE ASKING $:</b></label>
                        <div >
                          <span className="">{<PriceComponent price={SubdivisionDetails.avg_base_price_active} /> || "NA"}</span>
                        </div>
                        <label className="fs-20"><b>CURRENT AVG SQFT:</b>&nbsp;<span style={{fontSize: "16px"}}>{SubdivisionDetails.avg_sqft_active || "NA"}</span></label>
                      </div>

                      <div style={{border : "1px solid black", marginTop: "10px"}}>
                        <div style={{marginLeft: "5px"}}>
                          <label className="fs-20" style={{marginBottom: "0px"}}><b>TOTAL SINCE OPEN:</b></label><br />
                          <label style={{marginLeft: "15px"}}>NET SALES:&nbsp;{SubdivisionDetails.total_net_sales || "NA"}</label><br />
                          <label style={{marginLeft: "15px"}}>PERMITS:&nbsp;{SubdivisionDetails.total_permits || "NA"}</label><br />
                          <label style={{marginLeft: "15px"}}>CLOSINGS:&nbsp;{SubdivisionDetails.total_closings || "NA"}</label><br />
                          <label style={{marginLeft: "15px"}}>NET SALES PER MO:&nbsp;{SubdivisionDetails.avg_net_sales_per_month_since_open || "NA"}</label><br />
                          <label style={{marginLeft: "15px"}}>CLOSINGS PER MO:&nbsp;</label><br />
                          <label style={{marginLeft: "15px"}}>MED. CLOSINGS $:&nbsp;{<PriceComponent price={SubdivisionDetails.median_closing_price_since_open}/> || "NA"}</label><br />

                          <label className="fs-20" style={{marginBottom: "0px"}}><b>THIS YEAR:</b></label><br />
                          <label style={{marginLeft: "15px"}}>NET SALES:&nbsp;{SubdivisionDetails.year_net_sold || "NA"}</label><br />
                          <label style={{marginLeft: "15px"}}>PERMITS:&nbsp;{SubdivisionDetails.permit_this_year || "NA"}</label><br />
                          <label style={{marginLeft: "15px"}}>CLOSINGS:&nbsp;</label><br />
                          <label style={{marginLeft: "15px"}}>MED. CLOSINGS $:&nbsp;{<PriceComponent price={SubdivisionDetails.median_closing_price_this_year}/> || "NA"}</label><br />
                          <label style={{marginLeft: "15px"}}>NET SALES PER MO:&nbsp;{SubdivisionDetails.avg_net_sales_per_month_this_year || "NA"}</label><br />
                          <label style={{marginLeft: "15px"}}>CLOSINGS PER MO:&nbsp;{SubdivisionDetails.avg_closings_per_month_this_year || "NA"}</label><br />
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
                                  <MultiSelect
                                     name="status"
                                     options={statusOptions}
                                      value={selectedStatus}
                                      onChange={handleSelectStatusChange }
                                     placeholder={"Select Status"} 
                                  />
                                  {/* <select
                                    className="default-select form-control"
                                    value={filterQuery.is_active}
                                    name="status"
                                    onChange={HandleFilter}
                                  >
                                    <option value="">All</option>
                                    <option value="1">Active</option>
                                    <option value="0">Sold Out</option>
                                    <option value="2">Future</option>
                                  </select> */}
                              </div>
                              <div className="col-md-3 mt-3">
                                  <label className="form-label">
                                    REPORTING:{" "}
                                    <span className="text-danger"></span>
                                  </label>
                                  <MultiSelect
                                     name="reporting"
                                     options={reportingOptions}
                                      value={selectedReporting}
                                      onChange={handleSelectReportingChange }
                                     placeholder={"Select Reporting"} 
                                  />
                                  {/* <select
                                    className="default-select form-control"
                                    value={filterQuery.is_active}
                                    name="reporting"
                                    onChange={HandleFilter}
                                  >
                                    <option value="">All</option>
                                    <option value="1">Yes</option>
                                    <option value="0">No</option>
                                  </select> */}
                              </div>
                              <div className="col-md-3 mt-3">
                                {/* <label className="form-label">
                                  BUILDER NAME:{" "}
                                  <span className="text-danger"></span>
                                </label>

                                <input name="builder_name" className="form-control" value={filterQuery.builder_name} onChange={HandleFilter}/>
                              */}
                                <label className="form-label">
                                BUILDER NAME:{" "}
                                    <span className="text-danger"></span>
                                  </label>
                                  <Form.Group controlId="tournamentList">
                                    <MultiSelect
                                      name="builder_name"
                                      options={builderListDropDown}
                                      value={selectedBuilderName}
                                      onChange={handleSelectBuilderNameChange }
                                      placeholder={"Select Builder Name"} 
                                    />
                                  </Form.Group>
                                  {/* <Form.Group controlId="tournamentList">
                          <Select
                            options={builderListDropDown}
                            onChange={HandleSelectChange}
                            getOptionValue={(option) => option.name}
                            getOptionLabel={(option) => option.name}
                            value={builderListDropDown.name}
                            name="builder_name"
                          ></Select>
                        </Form.Group> */}
                             
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
                              <MultiSelect
                                name="product_type"
                                options={productTypeOptions}
                                value={productTypeStatus}
                                onChange={handleSelectProductTypeChange }
                                placeholder="Select Status" 
                              />
                                {/* <select className="default-select form-control" name="product_type" onChange={HandleFilter} >
                                    <option value="">Select Product Type</option>
                                     <option value="DET">DET</option>
                                    <option value="ATT">ATT</option>
                                    <option value="HR">HR</option>
                                    <option value="AC">AC</option>
                                </select>  */}
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
                                MASTER PLAN:{" "}
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
                                <input type="text" name="lotwidth" value={filterQuery.lotwidth} className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3">
                                <label className="form-label">
                                LOT SIZE:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input type="text" value={filterQuery.lotsize} name="lotsize" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3">
                                <label className="form-label">
                                ZONING:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input  value={filterQuery.zoning} name="zoning" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3">
                              <label htmlFor="exampleFormControlInput8" className="form-label">AGE RESTRICTED:{" "}</label>
                              <MultiSelect
                                name="age"
                                options={ageOptions}
                                value={selectedAge}
                                onChange={handleSelectAgeChange }
                                placeholder={"Select Age"} 
                              />
                              {/* <select className="default-select form-control" name="age" onChange={HandleFilter} >
                                    <option value="">Select age Restricted</option>
                                        <option value="1">Yes</option>
                                        <option value="0">No</option>
                              </select>     */}
                              </div>
                              <div className="col-md-3 mt-3 ">
                              <label htmlFor="exampleFormControlInput8" className="form-label">All SINGLE STORY:{" "}</label>
                              <MultiSelect
                                name="single"
                                options={singleOptions}
                                value={selectedSingle}
                                onChange={handleSelectSingleChange }
                                placeholder={"Select Single"} 
                              />
                                    {/* <select className="default-select form-control" name="single" onChange={HandleFilter} >
                                        <option value="">Select Story</option>
                                        <option value="1">Yes</option>
                                        <option value="0">No</option>
                                    </select>     */}
                              </div>
                              <div className="col-md-3 mt-3 mb-3">
                              <label htmlFor="exampleFormControlInput28" className="form-label">GATED:{" "}</label>
                              <MultiSelect
                                name="gated"
                                options={gatedOptions}
                                value={selectedGated}
                                onChange={handleSelectGatedChange }
                                placeholder={"Select Gated"} 
                              />
                                    {/* <select className="default-select form-control" 
                                    onChange={HandleFilter} 
                                    value={filterQuery.gated}
                                    name="gated"
                                    > 
                                        <option value="">Select Gate</option>
                                        <option value="1">Yes</option>
                                        <option value="0">No</option>
                                    </select> */}
                                                                    </div>
                              <div className="col-md-3 mt-3 mb-3">
                                <label className="form-label">
                                JURISDICTION:{" "}
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
                                MASTER PLAN FEE:{" "}
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
                            <br/>
                            {excelLoading ? <div style={{ textAlign: "center"}}><ClipLoader color="#4474fc" /></div> :
                            <>
                            <h5 className="">Calculation Filter Options</h5>
                            <div className="border-top">
                              <div className="row">
                                <div className="col-md-3 mt-3 mb-3">
                                  <label className="form-label">MONTHS OPEN:{" "}</label>
                                  <input style={{marginTop: "20px"}} value={filterQuery.months_open} name="months_open" className="form-control" onChange={handleInputChange} />
                                </div>
                                <div className="col-md-3 mt-3 mb-3">
                                  <label className="form-label">LATEST LOTS RELEASED:{" "}</label>
                                  <input style={{marginTop: "20px"}} value={filterQuery.latest_lots_released} name="latest_lots_released" className="form-control" onChange={handleInputChange} />
                                </div>
                                <div className="col-md-3 mt-3 mb-3">
                                  <label className="form-label">LATEST STANDING INVENTORY:{" "}</label>
                                  <input value={filterQuery.latest_standing_inventory} name="latest_standing_inventory" className="form-control" onChange={handleInputChange} />
                                </div>
                                <div className="col-md-3 mt-3 mb-3">
                                  <label className="form-label">AVG SQFT ALL:{" "}</label>
                                  <input style={{marginTop: "20px"}} value={filterQuery.avg_sqft_all} name="avg_sqft_all" className="form-control" onChange={handleInputChange} />
                                </div>
                                <div className="col-md-3 mt-3 mb-3">
                                  <label className="form-label">AVG SQFT ACTIVE:{" "}</label>
                                  <input value={filterQuery.avg_sqft_active} name="avg_sqft_active" className="form-control" onChange={handleInputChange} />
                                </div>
                                <div className="col-md-3 mt-3 mb-3">
                                  <label className="form-label">AVG BASE PRICE ALL:{" "}</label>
                                  <input value={filterQuery.avg_base_price_all} name="avg_base_price_all" className="form-control" onChange={handleInputChange} />
                                </div>
                                <div className="col-md-3 mt-3 mb-3">
                                  <label className="form-label">AVG BASE PRICE ACTIVE:{" "}</label>
                                  <input value={filterQuery.avg_base_price_active} name="avg_base_price_active" className="form-control" onChange={handleInputChange} />
                                </div>
                                <div className="col-md-3 mt-3 mb-3">
                                  <label className="form-label">MIN SQFT ALL:{" "}</label>
                                  <input value={filterQuery.min_sqft_all} name="min_sqft_all" className="form-control" onChange={handleInputChange} />
                                </div>
                                <div className="col-md-3 mt-3 mb-3">
                                  <label className="form-label">MIN SQFT ACTIVE:{" "}</label>
                                  <input value={filterQuery.min_sqft_active} name="min_sqft_active" className="form-control" onChange={handleInputChange} />
                                </div>
                                <div className="col-md-3 mt-3 mb-3">
                                  <label className="form-label">MAX SQFT ALL:{" "}</label>
                                  <input value={filterQuery.max_sqft_all} name="max_sqft_all" className="form-control" onChange={handleInputChange} />
                                </div>
                                <div className="col-md-3 mt-3 mb-3">
                                  <label className="form-label">MAX SQFT ACTIVE:{" "}</label>
                                  <input value={filterQuery.max_sqft_active} name="max_sqft_active" className="form-control" onChange={handleInputChange} />
                                </div>
                                <div className="col-md-3 mt-3 mb-3">
                                  <label className="form-label">MIN BASE PRICE ALL:{" "}</label>
                                  <input value={filterQuery.min_base_price_all} name="min_base_price_all" className="form-control" onChange={handleInputChange} />
                                </div>
                                <div className="col-md-3 mt-3 mb-3">
                                  <label className="form-label">MIN BASE PRICE ACTIVE:{" "}</label>
                                  <input value={filterQuery.min_sqft_active_current} name="min_sqft_active_current" className="form-control" onChange={handleInputChange} />
                                </div>
                                <div className="col-md-3 mt-3 mb-3">
                                  <label className="form-label">MAX BASE PRICE ALL:{" "}</label>
                                  <input value={filterQuery.max_base_price_all} name="max_base_price_all" className="form-control" onChange={handleInputChange} />
                                </div>
                                <div className="col-md-3 mt-3 mb-3">
                                  <label className="form-label">MAX BASE PRICE ACTIVE:{" "}</label>
                                  <input value={filterQuery.max_sqft_active_current} name="max_sqft_active_current" className="form-control" onChange={handleInputChange} />
                                </div>
                                <div className="col-md-3 mt-3 mb-3">
                                  <label className="form-label">AVG TRAFFIC PER MONTH THIS YEAR:{" "}</label>
                                  <input value={filterQuery.avg_net_traffic_per_month_this_year} name="avg_net_traffic_per_month_this_year" className="form-control" onChange={handleInputChange} />
                                </div>
                                <div className="col-md-3 mt-3 mb-3">
                                  <label className="form-label">AVG NET SALES PER MONTH THIS YEAR:{" "}</label>
                                  <input value={filterQuery.avg_net_sales_per_month_this_year} name="avg_net_sales_per_month_this_year" className="form-control" onChange={handleInputChange} />
                                </div><div className="col-md-3 mt-3 mb-3">
                                  <label className="form-label">AVG CLOSINGS PER MONTH THIS YEAR:{" "}</label>
                                  <input value={filterQuery.avg_closings_per_month_this_year} name="avg_closings_per_month_this_year" className="form-control" onChange={handleInputChange} />
                                </div>
                                <div className="col-md-3 mt-3 mb-3">
                                  <label className="form-label">AVG NET SALES PER MONTH SINCE OPEN:{" "}</label>
                                  <input value={filterQuery.avg_net_sales_per_month_since_open} name="avg_net_sales_per_month_since_open" className="form-control" onChange={handleInputChange} />
                                </div>
                                <div className="col-md-3 mt-3 mb-3">
                                  <label className="form-label">AVG NET SALES PER MONTH LAST 3 MONTH:{" "}</label>
                                  <input value={filterQuery.avg_net_sales_per_month_last_three_months} name="avg_net_sales_per_month_last_three_months" className="form-control" onChange={handleInputChange} />
                                </div>
                                <div className="col-md-3 mt-3 mb-3">
                                  <label className="form-label">SQFT GROUP:{" "}</label>
                                  <input type="text" value={filterQuery.sqft_group} name="sqft_group" className="form-control" onChange={handleInputChange} />
                                </div>
                                <div className="col-md-3 mt-3 mb-3">
                                  <label className="form-label">PRICE GROUP:{" "}</label>
                                  <input type="text" value={filterQuery.price_group} name="price_group" className="form-control" onChange={handleInputChange} />
                                </div>
                                <div className="col-md-3 mt-3 mb-3">
                                  <label className="form-label">MONTH NET SOLD:{" "}</label>
                                  <input value={filterQuery.month_net_sold} name="month_net_sold" className="form-control" onChange={handleInputChange} />
                                </div>
                                <div className="col-md-3 mt-3 mb-3">
                                  <label className="form-label">YEAR NET SOLD:{" "}</label>
                                  <input value={filterQuery.year_net_sold} name="year_net_sold" className="form-control" onChange={handleInputChange} />
                                </div>
                              </div>
                            </div></>}
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
            onClick={() => { resetSelection(); setExportModelShow(false); }}
          ></button>
          </Modal.Header>
          <Modal.Body>
          <Row>
            <ul className='list-unstyled'>
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
              <label className='form-check'>
                <input
                  type="checkbox"
                  className='form-check-input'
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
          <button varient="primary" class="btn btn-primary" onClick={handleDownloadExcel}>Download</button>
          </Modal.Footer>
        </>
      </Modal>
    </>
  );
};

export default SubdivisionList;
