import React, { useState, useRef, useEffect, Fragment } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import AdminSubdevisionService from "../../../API/Services/AdminService/AdminSubdevisionService";
import SubdivisionOffcanvas from "../../pages/WeeklyData/SubdivisionOffcanvas";
import MainPagetitle from "../../layouts/MainPagetitle";
import { Offcanvas, Form, Col } from "react-bootstrap";
import AdminBuilderService from "../../../API/Services/AdminService/AdminBuilderService";
import Button from "react-bootstrap/Button";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import ClipLoader from "react-spinners/ClipLoader";
import DateComponent from "../../components/date/DateFormat";
import AccessField from "../../components/AccssFieldComponent/AccessFiled";
import Modal from "react-bootstrap/Modal";
import PriceComponent from "../../components/Price/PriceComponent";
import { Row } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import BulkSubdivisionUpdate from "./BulkSubdivisionUpdate";
import ColumnReOrderPopup from "../../popup/ColumnReOrderPopup";
import { Link } from 'react-router-dom';
import { MultiSelect } from "react-multi-select-component";
import DatePicker from "react-datepicker";
import axios from "axios";
import './subdivisionList.css';
import Swal from "sweetalert2";

const SubdivisionList = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const page = JSON.parse(queryParams.get("page")) === 1 ? null : JSON.parse(queryParams.get("page"));

  const SyestemUserRole = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).role : "";
  const [AllBuilderListExport, setAllBuilderExport] = useState([]);
  const [excelLoading, setExcelLoading] = useState(false);
  const [excelDownload, setExcelDownload] = useState(false);

  const addToBuilderList = () => {
    navigate('/google-map-locator', {
      state: {
        subdivisionList: AllBuilderListExport,
        subdivision: true
      },
    });
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

  const [Error, setError] = useState("");
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(localStorage.getItem("searchQueryBySubdivisionFilter_Subdivision") ? JSON.parse(localStorage.getItem("searchQueryBySubdivisionFilter_Subdivision")) : "");
  const [BuilderList, setBuilderList] = useState([]);
  const [BuilderListCount, setBuilderListCount] = useState('');

  const [exportmodelshow, setExportModelShow] = useState(false)
  const [selectAll, setSelectAll] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const resetSelection = () => {
    setSelectAll(false);
    setSelectedColumns([]);
  };

  const [pageChange, setPageChange] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPage = 100;
  const lastIndex = currentPage * recordsPage;
  const firstIndex = lastIndex - recordsPage;
  const [npage, setNpage] = useState(0);
  const number = [...Array(npage + 1).keys()].slice(1);

  const [filter, setFilter] = useState(false);
  const [normalFilter, setNormalFilter] = useState(false);

  const [filterQuery, setFilterQuery] = useState({
    status: localStorage.getItem("subdivision_status_Subdivision") ? JSON.parse(localStorage.getItem("subdivision_status_Subdivision")) : "",
    reporting: localStorage.getItem("reporting_Subdivision") ? JSON.parse(localStorage.getItem("reporting_Subdivision")) : "",
    name: localStorage.getItem("subdivision_name_Subdivision") ? JSON.parse(localStorage.getItem("subdivision_name_Subdivision")) : "",
    builder_name: localStorage.getItem("builder_name_Subdivision") ? JSON.parse(localStorage.getItem("builder_name_Subdivision")) : "",
    product_type: localStorage.getItem("product_type_Subdivision") ? JSON.parse(localStorage.getItem("product_type_Subdivision")) : "",
    area: localStorage.getItem("area_Subdivision") ? JSON.parse(localStorage.getItem("area_Subdivision")) : "",
    masterplan_id: localStorage.getItem("masterplan_id_Subdivision") ? JSON.parse(localStorage.getItem("masterplan_id_Subdivision")) : "",
    zipcode: localStorage.getItem("zipcode_Subdivision") ? JSON.parse(localStorage.getItem("zipcode_Subdivision")) : "",
    lotwidth: localStorage.getItem("lotwidth_Subdivision") ? JSON.parse(localStorage.getItem("lotwidth_Subdivision")) : "",
    lotsize: localStorage.getItem("lotsize_Subdivision") ? JSON.parse(localStorage.getItem("lotsize_Subdivision")) : "",
    age: localStorage.getItem("age_Subdivision") ? JSON.parse(localStorage.getItem("age_Subdivision")) : "",
    single: localStorage.getItem("single_Subdivision") ? JSON.parse(localStorage.getItem("single_Subdivision")) : "",
    gated: localStorage.getItem("gated_Subdivision") ? JSON.parse(localStorage.getItem("gated_Subdivision")) : "",
    juridiction: localStorage.getItem("juridiction_Subdivision") ? JSON.parse(localStorage.getItem("juridiction_Subdivision")) : "",
    gasprovider: localStorage.getItem("gasprovider_Subdivision") ? JSON.parse(localStorage.getItem("gasprovider_Subdivision")) : "",
    from: localStorage.getItem("from_Subdivision") ? JSON.parse(localStorage.getItem("from_Subdivision")) : "",
    to: localStorage.getItem("to_Subdivision") ? JSON.parse(localStorage.getItem("to_Subdivision")) : "",
  });
  const [filterQueryCalculation, setFilterQueryCalculation] = useState({
    months_open: "",
    latest_lots_released: "",
    latest_standing_inventory: "",
    avg_sqft_all: "",
    avg_sqft_active: "",
    avg_base_price_all: "",
    avg_base_price_active: "",
    min_sqft_all: "",
    min_sqft_active: "",
    max_sqft_all: "",
    max_sqft_active: "",
    min_base_price_all: "",
    min_sqft_active_current: "",
    max_base_price_all: "",
    max_sqft_active_current: "",
    avg_net_traffic_per_month_this_year: "",
    avg_net_sales_per_month_this_year: "",
    avg_closings_per_month_this_year: "",
    avg_net_sales_per_month_since_open: "",
    avg_net_sales_per_month_last_three_months: "",
    month_net_sold: "",
    year_net_sold: "",
  });

  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const [manageAccessOffcanvas, setManageAccessOffcanvas] = useState(false);
  const [manageFilterOffcanvas, setManageFilterOffcanvas] = useState(false);

  const [accessList, setAccessList] = useState({});
  const [accessRole, setAccessRole] = useState("Admin");
  const [accessForm, setAccessForm] = useState({});
  const [role, setRole] = useState("Admin");
  const [checkedItems, setCheckedItems] = useState({});
  const fieldList = AccessField({ tableName: "subdivisions" });

  const [openDialog, setOpenDialog] = useState(false);
  const [columns, setColumns] = useState([]);
  const [draggedColumns, setDraggedColumns] = useState(columns);

  const [calculationData, setCalculationData] = useState({});
  const [handleCallBack, setHandleCallBack] = useState(false);
  const [canvasShowAdd, seCanvasShowAdd] = useState(false);
  const [canvasShowEdit, seCanvasShowEdit] = useState(false);

  const [totalLotsOption, setTotalLotsOption] = useState("");
  const [lotWidthOption, setLotWidthOption] = useState("");
  const [lotSizeOption, setLotSizeOption] = useState("");
  const [masterPlanFeeOption, setMasterPlanFeeOption] = useState("");
  const [hOAFeeOption, setHOAFeeOption] = useState("");
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

  const [totalLotsResult, setTotalLotsResult] = useState(0);
  const [lotWidthResult, setLotWidthResult] = useState(0);
  const [lotSizeResult, setLotSizeResult] = useState(0);
  const [hOAFeeResult, setHOAFeeResult] = useState(0);
  const [masterPlanFeeResult, setmasterPlanFeeResult] = useState(0);
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
  const [selectedSubdivisionName, setSelectedSubdivisionName] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [selectedReporting, setSelectedReporting] = useState([]);
  const [selectedAge, setSelectedAge] = useState([]);
  const [selectedSingle, setSelectedSingle] = useState([]);
  const [selectedGated, setSelectedGated] = useState([]);
  const [productTypeStatus, setProductTypeStatus] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [selectedBuilderIDByFilter, setSelectedBuilderIDByFilter] = useState([]);
  const [selectedArea, setSelectedArea] = useState([]);
  const [selectedZipCode, setSelectedZipCode] = useState([]);
  const [selectedMasterPlan, setSelectedMasterPlan] = useState([]);
  const [selectedJurisdicition, setSelectedJurisdiction] = useState([]);
  const [seletctedGasProvider, setSelectedGasProvider] = useState([]);

  const handleSortingPopupClose = () => setShowSortingPopup(false);
  const [showSortingPopup, setShowSortingPopup] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [fieldOptions, setFieldOptions] = useState([]);

  // Generate Report
  const today = new Date();
  const formattedToday = today.toISOString().split('T')[0];
  const startDate = formattedToday;
  const endDate = formattedToday;
  const [loadingReportId, setLoadingReportId] = useState(null);

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
    { label: 'Cross Streets', key: 'crossstreet' },
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
  };

  const checkFieldExist = (fieldName) => {
    return fieldList.includes(fieldName.trim());
  };

  const handleDownloadExcel = async () => {
    const isAnyFilterApplied = Object.values(filterQueryCalculation).some(query => query !== "");
    let sortConfigString = "";
    if (sortConfig !== null) {
      sortConfigString = "&sortConfig=" + stringifySortConfig(sortConfig);
    }

    setExcelDownload(true);
    if (isAnyFilterApplied) {
      let tableHeaders;
      if (selectedColumns.length > 0) {
        tableHeaders = selectedColumns;
      } else {
        tableHeaders = headers.map((c) => c.label);
      }
      const is_calculated = "&is_calculated";
      const response = await AdminSubdevisionService.export(currentPage, sortConfigString, searchQuery, "", is_calculated).json();
      if (response.status) {
        const tableData = BuilderList?.map((row) => {
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
                mappedRow[header] = row.crossstreet;
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
                mappedRow[header] = row.website ? row.website : '';
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
                mappedRow[header] = row.min_sqft_active;
                break;
              case 'Max Base Price All':
                mappedRow[header] = row.max_base_price_all;
                break;
              case 'Max Sqft Active Current':
                mappedRow[header] = row.max_sqft_active;
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
                mappedRow[header] = row.price_group.group;
                break;
              case 'Month Net Sold':
                mappedRow[header] = row.month_net_sold;
                break;
              case 'Year Net Sold':
                mappedRow[header] = row.year_net_sold;
                break;
              case 'Open Since':
                mappedRow[header] = <DateComponent date={row.opensince} />;
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

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Worksheet');

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
        setExportModelShow(false);
        setExcelDownload(false);
        swal({
          text: "Download Completed"
        }).then((willDelete) => {
          if (willDelete) {
            saveAs(data, 'subdivisions.xlsx');
            resetSelection();
          }
        });
      } else {
        setExportModelShow(false);
        setExcelDownload(false);
        return;
      }
    } else {
      try {
        var exportColumn = {
          columns: selectedColumns
        }
        const response = await AdminSubdevisionService.export(currentPage, sortConfigString, searchQuery, exportColumn, "").blob();
        const downloadUrl = URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.setAttribute('download', `subdivisions.xlsx`);
        document.body.appendChild(a);
        setExcelDownload(false);
        setExportModelShow(false);
        swal({
          text: "Download Completed"
        }).then((willDelete) => {
          if (willDelete) {
            a.click();
            a.parentNode.removeChild(a);
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
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

  const clearSubdivisionDetails = () => {
    setSubdivisionDetails({
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
  };

  const [builderListDropDown, setBuilderListDropDown] = useState([]);
  const [zipCodeDropDown, setZipCodeDropDown] = useState([]);
  const [subdivisionListDropDown, setSubdivisionListDropDown] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState(() => {
    const savedSortConfig = localStorage.getItem("sortConfigSubdivisions");
    return savedSortConfig ? JSON.parse(savedSortConfig) : [];
  });
  const [selectedFields, setSelectedFields] = useState(() => {
    const saved = localStorage.getItem("selectedFieldsSubdivisions");
    return saved ? JSON.parse(saved) : [];
  });
  const [selectionOrder, setSelectionOrder] = useState(() => {
    const saved = localStorage.getItem("selectionOrderSubdivisions");
    return saved ? JSON.parse(saved) : {};
  });
  const [sortOrders, setSortOrders] = useState(() => {
    const saved = localStorage.getItem("sortOrdersSubdivisions");
    return saved ? JSON.parse(saved) : {};
  });
  const [subdivisionID, setSubdivisionID] = useState();

  const prePage = () => {
    if (currentPage !== 1) {
      setPageChange(true);
      setCurrentPage(currentPage - 1);
    }
  };

  const changeCPage = (id) => {
    setCurrentPage(id);
    setPageChange(true);
  };

  const nextPage = () => {
    if (currentPage !== npage) {
      setPageChange(true);
      setCurrentPage(currentPage + 1);
    }
  };

  const subdivision = useRef();
  const [show, setShow] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const [selectedFileError, setSelectedFileError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleClose = () => setShow(false);

  const stringifySortConfig = (sortConfig) => {
    return sortConfig.map((sort) => `${sort.key}:${sort.direction}`).join(",");
  };

  const getbuilderlist = async (pageNumber, sortConfig, searchQuery) => {
    setIsLoading(true);
    setExcelLoading(true);
    setCurrentPage(pageNumber);
    setSearchQuery(searchQuery);
    localStorage.setItem("searchQueryBySubdivisionFilter_Subdivision", JSON.stringify(searchQuery));
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
      setExcelLoading(false);
      setPageChange(false);
      setNpage(Math.ceil(responseData.total / recordsPage));
      setBuilderList(responseData.data);
      setBuilderListCount(responseData.total);
      setHandleCallBack(true);
      if (responseData.total > 100) {
        if(!pageChange){
          FetchAllPages(searchQuery, sortConfig, responseData.data, responseData.total);
        }
      } else {
        if(!pageChange){
          setAllBuilderExport(responseData.data);
        }
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setExcelLoading(false);
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(errorJson.message);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (handleCallBack && calculationData) {
      Object.entries(calculationData).forEach(([field, value]) => {
        handleSelectChange(value, field);
      });
    }
  }, [handleCallBack, AllBuilderListExport, BuilderList]);

  useEffect(() => {
    if (selectedLandSales?.length === 0) {
      setHandleCallBack(false);
    }
  }, [selectedLandSales]);

  useEffect(() => {
    const subID = JSON.parse(localStorage.getItem("subdivision_id"));
    if(subID){
      handleRowClick(subID);
    }
  },[]);

  useEffect(() => {
    if (selectedBuilderIDByFilter?.length > 0) {
      SubdivisionByBuilderIDList(selectedBuilderIDByFilter);
    } else {
      setSelectedSubdivisionName([]);
      setSubdivisionListDropDown([]);
    }
  }, [selectedBuilderIDByFilter]);

  useEffect(() => {
    if (selectedFields) {
      localStorage.setItem("selectedFieldsSubdivisions", JSON.stringify(selectedFields));
    }
    if (selectionOrder) {
      localStorage.setItem("selectionOrderSubdivisions", JSON.stringify(selectionOrder));
    }
    if (sortOrders) {
      localStorage.setItem("sortOrdersSubdivisions", JSON.stringify(sortOrders));
    }
  }, [selectedFields, selectionOrder, sortOrders]);

  useEffect(() => {
    if (localStorage.getItem("selectedStatusBySubdivisionFilter_Subdivision")) {
      const selectedStatus = JSON.parse(localStorage.getItem("selectedStatusBySubdivisionFilter_Subdivision"));
      handleSelectStatusChange(selectedStatus);
    }
    if (localStorage.getItem("selectedReportingByFilter_Subdivision")) {
      const selectedReporting = JSON.parse(localStorage.getItem("selectedReportingByFilter_Subdivision"));
      handleSelectReportingChange(selectedReporting);
    }
    if (localStorage.getItem("selectedBuilderNameByFilter_Subdivision")) {
      const selectedBuilderName = JSON.parse(localStorage.getItem("selectedBuilderNameByFilter_Subdivision"));
      handleSelectBuilderNameChange(selectedBuilderName);
    }
    if (localStorage.getItem("selectedSubdivisionNameByFilter_Subdivision")) {
      const selectedSubdivisionName = JSON.parse(localStorage.getItem("selectedSubdivisionNameByFilter_Subdivision"));
      handleSelectSubdivisionNameChange(selectedSubdivisionName);
    }
    if (localStorage.getItem("productTypeStatusByFilter_Subdivision")) {
      const productTypeStatus = JSON.parse(localStorage.getItem("productTypeStatusByFilter_Subdivision"));
      handleSelectProductTypeChange(productTypeStatus);
    }
    if (localStorage.getItem("selectedAreaByFilter_Subdivision")) {
      const selectedArea = JSON.parse(localStorage.getItem("selectedAreaByFilter_Subdivision"));
      handleSelectAreaChange(selectedArea);
    }
    if (localStorage.getItem("selectedZipCodeByFilter_Subdivision")) {
      const selectedZipCode = JSON.parse(localStorage.getItem("selectedZipCodeByFilter_Subdivision"));
      handleSelectZipCodeChange(selectedZipCode);
    }
    if (localStorage.getItem("selectedMasterPlanByFilter_Subdivision")) {
      const selectedMasterPlan = JSON.parse(localStorage.getItem("selectedMasterPlanByFilter_Subdivision"));
      handleSelectMasterPlanChange(selectedMasterPlan);
    }
    if (localStorage.getItem("selectedAgeByFilter_Subdivision")) {
      const selectedAge = JSON.parse(localStorage.getItem("selectedAgeByFilter_Subdivision"));
      handleSelectAgeChange(selectedAge);
    }
    if (localStorage.getItem("selectedSingleByFilter_Subdivision")) {
      const selectedSingle = JSON.parse(localStorage.getItem("selectedSingleByFilter_Subdivision"));
      handleSelectSingleChange(selectedSingle);
    }
    if (localStorage.getItem("selectedGatedByFilter_Subdivision")) {
      const selectedGated = JSON.parse(localStorage.getItem("selectedGatedByFilter_Subdivision"));
      handleSelectGatedChange(selectedGated);
    }
    if (localStorage.getItem("selectedJurisdicitionByFilter_Subdivision")) {
      const selectedJurisdicition = JSON.parse(localStorage.getItem("selectedJurisdicitionByFilter_Subdivision"));
      handleSelectJurisdictionChange(selectedJurisdicition);
    }
    if (localStorage.getItem("seletctedGasProviderByFilter_Subdivision")) {
      const seletctedGasProvider = JSON.parse(localStorage.getItem("seletctedGasProviderByFilter_Subdivision"));
      handleGasProviderChange(seletctedGasProvider);
    }
  }, []);

  useEffect(() => {
    setSearchQuery(filterString());
  }, [filterQuery]);

  useEffect(() => {
    if (localStorage.getItem("usertoken")) {
      if(page === currentPage){
        return;
      } else {
        getbuilderlist(page === null ? currentPage : JSON.parse(page), sortConfig, searchQuery);
      }
    } else {
      navigate("/");
    }
  }, [currentPage]);

  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  const FetchAllPages = async (searchQuery, sortConfig, BuilderList, BuilderListCount) => {
    setExcelLoading(true);
    const totalPages = Math.ceil(BuilderListCount / recordsPage);
    let allData = BuilderList;
    if (page !== null) {
      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        // await delay(1000);
        if (pageNum === page) continue;
        const pageResponse = await AdminSubdevisionService.index(pageNum, searchQuery, sortConfig ? `&sortConfig=${stringifySortConfig(sortConfig)}` : "");
        const pageData = await pageResponse.json();
        allData = allData.concat(pageData.data);
      }
      setAllBuilderExport(allData);
      setExcelLoading(false);
      setHandleCallBack(true);
    } else {
      for (let page = 2; page <= totalPages; page++) {
        // await delay(1000);
        const pageResponse = await AdminSubdevisionService.index(page, searchQuery, sortConfig ? `&sortConfig=${stringifySortConfig(sortConfig)}` : "");
        const pageData = await pageResponse.json();
        allData = allData.concat(pageData.data);
      }
      setAllBuilderExport(allData);
      setExcelLoading(false);
      setHandleCallBack(true);
    }
  }

  const handleDelete = async (e) => {
    try {
      let responseData = await AdminSubdevisionService.destroy(e).json();
      if (responseData.status === true) {
        getbuilderlist(currentPage, sortConfig, searchQuery);
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
        getbuilderlist(currentPage, sortConfig, searchQuery);
      }
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(errorJson.message);
      }
    }
  };

  const handleCallback = () => {
    getbuilderlist(currentPage, sortConfig, searchQuery);
    setSelectedLandSales([]);
  };

  const handleRowClick = async (id) => {
    setShowOffcanvas(true);
    setIsFormLoading(true);
    setSubdivisionID(id);
    try {
      let responseData = await AdminSubdevisionService.show(id).json();
      setSubdivisionDetails(responseData);
      setIsFormLoading(false);
      localStorage.removeItem("subdivision_id");
    } catch (error) {
      if (error.name === "HTTPError") {
        setIsFormLoading(false);
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
      console.log(error);
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(errorJson.message);
      }
    }
  };

  const GetZipCodeList = async () => {
    try {
      const responseData = await AdminSubdevisionService.get_zipcode_list().json();
      const formattedData = responseData.data.map((zipcode) => ({
        label: zipcode,
        value: zipcode,
      }));
      setZipCodeDropDown(formattedData);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        console.log(errorJson);
      }
    }
  };

  const SubdivisionByBuilderIDList = async (selectedBuilderIDByFilter) => {
    try {
      var userData = {
        builder_ids: selectedBuilderIDByFilter
      }
      const response = await AdminSubdevisionService.subdivisionbybuilderidlist(userData);
      const responseData = await response.json();
      const formattedData = responseData.data.map((subdivision) => ({
        label: subdivision.name,
        value: subdivision.id,
      }));

      const validSubdivisionIds = formattedData.map(item => item.value);
      setSelectedSubdivisionName(prevSelected => prevSelected.filter(selected => validSubdivisionIds.includes(selected.value)));
      setSubdivisionListDropDown(formattedData);
    } catch (error) {
      console.log("Error fetching subdivision list:", error);
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        console.log(errorJson);
      }
    }
  };

  useEffect(() => {
      if(manageFilterOffcanvas || canvasShowAdd || canvasShowEdit){
        GetBuilderDropDownList();
        GetZipCodeList();
      }
    }, [manageFilterOffcanvas, canvasShowAdd, canvasShowEdit]);

  const HandleFilterForm = (e) => {
    const isAnyFilterApplied = Object.values(filterQuery).some(query => query !== "");
    if (!isAnyFilterApplied) {
      localStorage.removeItem("setSubdivisionFilter");
    }
    e.preventDefault();
    setFilter(false);
    setNormalFilter(false);
    getbuilderlist(1, sortConfig, searchQuery);
    setManageFilterOffcanvas(false);
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
    localStorage.setItem("selectedStatusBySubdivisionFilter_Subdivision", JSON.stringify(selectedStatus));
    localStorage.setItem("selectedReportingByFilter_Subdivision", JSON.stringify(selectedReporting));
    localStorage.setItem("selectedBuilderNameByFilter_Subdivision", JSON.stringify(selectedBuilderName));
    localStorage.setItem("productTypeStatusByFilter_Subdivision", JSON.stringify(productTypeStatus));
    localStorage.setItem("selectedAreaByFilter_Subdivision", JSON.stringify(selectedArea));
    localStorage.setItem("selectedZipCodeByFilter_Subdivision", JSON.stringify(selectedZipCode));
    localStorage.setItem("selectedMasterPlanByFilter_Subdivision", JSON.stringify(selectedMasterPlan));
    localStorage.setItem("selectedAgeByFilter_Subdivision", JSON.stringify(selectedAge));
    localStorage.setItem("selectedSingleByFilter_Subdivision", JSON.stringify(selectedSingle));
    localStorage.setItem("selectedGatedByFilter_Subdivision", JSON.stringify(selectedGated));
    localStorage.setItem("selectedJurisdicitionByFilter_Subdivision", JSON.stringify(selectedJurisdicition));
    localStorage.setItem("seletctedGasProviderByFilter_Subdivision", JSON.stringify(seletctedGasProvider));
    localStorage.setItem("subdivision_status_Subdivision", JSON.stringify(filterQuery.status));
    localStorage.setItem("reporting_Subdivision", JSON.stringify(filterQuery.reporting));
    localStorage.setItem("subdivision_name_Subdivision", JSON.stringify(filterQuery.name));
    localStorage.setItem("builder_name_Subdivision", JSON.stringify(filterQuery.builder_name));
    localStorage.setItem("product_type_Subdivision", JSON.stringify(filterQuery.product_type));
    localStorage.setItem("area_Subdivision", JSON.stringify(filterQuery.area));
    localStorage.setItem("masterplan_id_Subdivision", JSON.stringify(filterQuery.masterplan_id));
    localStorage.setItem("zipcode_Subdivision", JSON.stringify(filterQuery.zipcode));
    localStorage.setItem("lotwidth_Subdivision", JSON.stringify(filterQuery.lotwidth));
    localStorage.setItem("lotsize_Subdivision", JSON.stringify(filterQuery.lotsize));
    localStorage.setItem("age_Subdivision", JSON.stringify(filterQuery.age));
    localStorage.setItem("single_Subdivision", JSON.stringify(filterQuery.single));
    localStorage.setItem("gated_Subdivision", JSON.stringify(filterQuery.gated));
    localStorage.setItem("juridiction_Subdivision", JSON.stringify(filterQuery.juridiction));
    localStorage.setItem("gasprovider_Subdivision", JSON.stringify(filterQuery.gasprovider));
    localStorage.setItem("from_Subdivision", JSON.stringify(filterQuery.from));
    localStorage.setItem("to_Subdivision", JSON.stringify(filterQuery.to));
    localStorage.setItem("searchQueryBySubdivisionFilter_Subdivision", JSON.stringify(searchQuery));
  };
 
  console.log(SubdivisionDetails)
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
    setFilterQuery({
      status: "",
      reporting: "",
      name: "",
      builder_name: "",
      product_type: "",
      area: "",
      masterplan_id: "",
      zipcode: "",
      lotwidth: "",
      lotsize: "",
      age: "",
      single: "",
      gated: "",
      juridiction: "",
      gasprovider: "",
      from: "",
      to: "",
    });
    setFilterQueryCalculation({
      months_open: "",
      latest_lots_released: "",
      latest_standing_inventory: "",
      avg_sqft_all: "",
      avg_sqft_active: "",
      avg_base_price_all: "",
      avg_base_price_active: "",
      min_sqft_all: "",
      min_sqft_active: "",
      max_sqft_all: "",
      max_sqft_active: "",
      min_base_price_all: "",
      min_sqft_active_current: "",
      max_base_price_all: "",
      max_sqft_active_current: "",
      avg_net_traffic_per_month_this_year: "",
      avg_net_sales_per_month_this_year: "",
      avg_closings_per_month_this_year: "",
      avg_net_sales_per_month_since_open: "",
      avg_net_sales_per_month_last_three_months: "",
      month_net_sold: "",
      year_net_sold: "",
    });
    setSelectedStatus([]);
    setSelectedReporting([]);
    setSelectedBuilderName([]);
    setSelectedSubdivisionName([]);
    setProductTypeStatus([]);
    setSelectedArea([]);
    setSelectedZipCode([]);
    setSelectedMasterPlan([]);
    setSelectedAge([]);
    setSelectedSingle([]);
    setSelectedGated([]);
    setSelectedJurisdiction([]);
    setSelectedGasProvider([]);
    getbuilderlist(1, sortConfig, "");
    setManageFilterOffcanvas(false);
    localStorage.removeItem("selectedStatusBySubdivisionFilter_Subdivision");
    localStorage.removeItem("selectedReportingByFilter_Subdivision");
    localStorage.removeItem("selectedBuilderNameByFilter_Subdivision");
    localStorage.removeItem("productTypeStatusByFilter_Subdivision");
    localStorage.removeItem("selectedAreaByFilter_Subdivision");
    localStorage.removeItem("selectedZipCodeByFilter_Subdivision");
    localStorage.removeItem("selectedMasterPlanByFilter_Subdivision");
    localStorage.removeItem("selectedAgeByFilter_Subdivision");
    localStorage.removeItem("selectedSingleByFilter_Subdivision");
    localStorage.removeItem("selectedGatedByFilter_Subdivision");
    localStorage.removeItem("selectedJurisdicitionByFilter_Subdivision");
    localStorage.removeItem("seletctedGasProviderByFilter_Subdivision");
    localStorage.removeItem("subdivision_status_Subdivision");
    localStorage.removeItem("reporting_Subdivision");
    localStorage.removeItem("subdivision_name_Subdivision");
    localStorage.removeItem("builder_name_Subdivision");
    localStorage.removeItem("product_type_Subdivision");
    localStorage.removeItem("area_Subdivision");
    localStorage.removeItem("masterplan_id_Subdivision");
    localStorage.removeItem("zipcode_Subdivision");
    localStorage.removeItem("lotwidth_Subdivision");
    localStorage.removeItem("lotsize_Subdivision");
    localStorage.removeItem("age_Subdivision");
    localStorage.removeItem("single_Subdivision");
    localStorage.removeItem("gated_Subdivision");
    localStorage.removeItem("juridiction_Subdivision");
    localStorage.removeItem("gasprovider_Subdivision");
    localStorage.removeItem("from_Subdivision");
    localStorage.removeItem("to_Subdivision");
    localStorage.removeItem("setSubdivisionFilter_Subdivision");
  };

  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleProductRedirect = (id, name) => {
    navigate("/filterproducts");
    localStorage.setItem("product_name_Product", JSON.stringify(name));
    localStorage.setItem("product_id", JSON.stringify(id));
    localStorage.setItem("setProductFilter", true);
  };

  const formatDate = (inputDate) => {
    const dateObj = new Date(inputDate);
    return `${dateObj.getMonth() + 1}/${dateObj.getDate()}/${dateObj.getFullYear()}`;
  };

  const handlePermitRedirect = (id, date) => {
    const formattedDate = formatDate(date);
    navigate("/filterpermits");
    localStorage.setItem("from_Permit", JSON.stringify(formattedDate));
    localStorage.setItem("to_Permit", JSON.stringify(formattedDate));
    localStorage.setItem("permit_id", JSON.stringify(id));
    localStorage.setItem("setPermitFilter", true);
  };

  const handleClosingRedirect = (id, date) => {
    const formattedDate = formatDate(date);
    navigate("/filterclosings");
    localStorage.setItem("from_Closing", JSON.stringify(formattedDate));
    localStorage.setItem("to_Closing", JSON.stringify(formattedDate));
    localStorage.setItem("closing_id", JSON.stringify(id));
    localStorage.setItem("setClosingFilter", true);
  };

  const handleLandRedirect = (id, date) => {
    const formattedDate = formatDate(date);
    navigate("/filterlandsales");
    localStorage.setItem("from_LandSale", JSON.stringify(formattedDate));
    localStorage.setItem("to_LandSale", JSON.stringify(formattedDate));
    localStorage.setItem("landsale_id", JSON.stringify(id));
    localStorage.setItem("setLansSaleFilter", true);
  };

  // const handleTraficRedirect = () => {
  //   navigate("/trafficsalelist");
  // };

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

        try {
          let responseData = await AdminSubdevisionService.import(inputData).json();
          setSelectedFile("");
          document.getElementById("fileInput").value = null;
          setLoading(false);
          if (responseData.failed_records > 0) {
            let message = [];
            const problematicRows = responseData.failed_records_details.map(detail => detail.row).join(', ');
            const problematicRowsError = responseData.failed_records_details.map(detail => detail.error).join(', ');
            message += '\nRecord Imported: ' + responseData.successful_records;
            message += '\nFailed Record Count: ' + responseData.failed_records;
            message += '\nProblematic Record Rows: ' + problematicRows + '.';
            message += '\nErrors: ' + problematicRowsError + '.';
            message += '\nLast Row: ' + responseData.last_processed_row;
            setShow(false);
            swal({
              title: responseData.message,
              text: message,
            }).then((willDelete) => {
              if (willDelete) {
                getbuilderlist(currentPage, sortConfig, searchQuery);
              }
            });
          }  else {
            if (responseData.message) {
              let message = [];
              const updatedRows = responseData.updated_records_details.map(detail => detail.row).join(', ');
              message += '\nUpdated Record Count: ' + responseData.updated_records_count;
              message += '\nUpdated Record Rows: ' + updatedRows + '.';
              setShow(false);
              swal({
                title: responseData.message,
                text: message,
              }).then((willDelete) => {
                if (willDelete) {
                  getbuilderlist(currentPage, sortConfig, searchQuery);
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

  const handleOpenDialog = () => {
    setDraggedColumns(columns);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setDraggedColumns(columns);
    setOpenDialog(false);
  };

  const handleSaveDialog = () => {
    localStorage.setItem("draggedColumnsSubdivisions", JSON.stringify(draggedColumns));
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
    const draggedColumns = JSON.parse(localStorage.getItem("draggedColumnsSubdivisions"));
    if(draggedColumns) {
      setColumns(draggedColumns);
    } else {
      const mappedColumns = fieldList.map((data) => ({
        id: data.charAt(0).toLowerCase() + data.slice(1),
        label: data
      }));
      setColumns(mappedColumns);
    }
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
    const isAnyFilterApplied = Object.values(filterQueryCalculation).some(query => query !== "");

    if (AllBuilderListExport.length === 0) {
      setBuilderList(BuilderList)
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

    filtered = applyNumberFilter(filtered, filterQueryCalculation.months_open, 'months_open');
    filtered = applyNumberFilter(filtered, filterQueryCalculation.latest_lots_released, 'latest_lots_released');
    filtered = applyNumberFilter(filtered, filterQueryCalculation.latest_standing_inventory, 'latest_standing_inventory');
    filtered = applyNumberFilter(filtered, filterQueryCalculation.avg_sqft_all, 'avg_sqft_all');
    filtered = applyNumberFilter(filtered, filterQueryCalculation.avg_sqft_active, 'avg_sqft_active');
    filtered = applyNumberFilter(filtered, filterQueryCalculation.avg_base_price_all, 'avg_base_price_all');
    filtered = applyNumberFilter(filtered, filterQueryCalculation.avg_base_price_active, 'avg_base_price_active');
    filtered = applyNumberFilter(filtered, filterQueryCalculation.min_sqft_all, 'min_sqft_all');
    filtered = applyNumberFilter(filtered, filterQueryCalculation.min_sqft_active, 'min_sqft_active');
    filtered = applyNumberFilter(filtered, filterQueryCalculation.max_sqft_all, 'max_sqft_all');
    filtered = applyNumberFilter(filtered, filterQueryCalculation.max_sqft_active, 'max_sqft_active');
    filtered = applyNumberFilter(filtered, filterQueryCalculation.min_base_price_all, 'min_base_price_all');
    filtered = applyNumberFilter(filtered, filterQueryCalculation.min_sqft_active_current, 'min_sqft_active_current');
    filtered = applyNumberFilter(filtered, filterQueryCalculation.max_base_price_all, 'max_base_price_all');
    filtered = applyNumberFilter(filtered, filterQueryCalculation.max_sqft_active_current, 'max_sqft_active_current');
    filtered = applyNumberFilter(filtered, filterQueryCalculation.avg_net_traffic_per_month_this_year, 'avg_net_traffic_per_month_this_year');
    filtered = applyNumberFilter(filtered, filterQueryCalculation.avg_net_sales_per_month_this_year, 'avg_net_sales_per_month_this_year');
    filtered = applyNumberFilter(filtered, filterQueryCalculation.avg_closings_per_month_this_year, 'avg_closings_per_month_this_year');
    filtered = applyNumberFilter(filtered, filterQueryCalculation.avg_net_sales_per_month_since_open, 'avg_net_sales_per_month_since_open');
    filtered = applyNumberFilter(filtered, filterQueryCalculation.avg_net_sales_per_month_last_three_months, 'avg_net_sales_per_month_last_three_months');
    filtered = applyNumberFilter(filtered, filterQueryCalculation.month_net_sold, 'month_net_sold');
    filtered = applyNumberFilter(filtered, filterQueryCalculation.year_net_sold, 'year_net_sold');

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

    if (isAnyFilterApplied && !normalFilter) {
      setBuilderList(filtered.slice(0, 100));
      setBuilderListCount(filtered.length);
      setNpage(Math.ceil(filtered.length / recordsPage));
      setNormalFilter(false);
      if(isAnyFilterApplied){
        setFilter(true);
      } else {
        setFilter(false);
      }
    } else {
      setBuilderList(filtered.slice(0, 100));
      setBuilderListCount(filtered.length);
      setNpage(Math.ceil(filtered.length / recordsPage));
      setCurrentPage(1);
      setNormalFilter(false);
      if(isAnyFilterApplied){
        setFilter(true);
      } else {
        setFilter(false);
      }
    }
  };

  useEffect(() => {
    if (filter) {
      applyFilters();
    }
  }, [filterQueryCalculation]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilterQueryCalculation(prevFilterQuery => ({
      ...prevFilterQuery,
      [name]: value
    }));
    setFilter(true);
  };

  const totalSumFields = (field) => {
    if (field == "totallots") {
      if (filter) {
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.totallots || 0);
        }, 0);
      } else {
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.totallots || 0);
        }, 0);
      }
    }
    if (field == "lotwidth") {
      if (filter) {
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.lotwidth || 0);
        }, 0);
      } else {
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.lotwidth || 0);
        }, 0);
      }
    }
    if (field == "lotsize") {
      if (filter) {
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.lotsize || 0);
        }, 0);
      } else {
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.lotsize || 0);
        }, 0);
      }
    }
    if (field == "hoafee") {
      const parseHoafee = (value) => {
        if (value != "") {
          let HOAFee = value.replace(/[$,]/g, '');
          return parseFloat(HOAFee) || 0;
        } else {
          return 0;
        }
      };
      if (filter) {
        return BuilderList.reduce((sum, builder) => {
          return sum + parseHoafee(builder.hoafee);
        }, 0);
      } else {
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + parseHoafee(builder.hoafee);
        }, 0);
      }
    }
    if (field == "masterplanfee") {
      if (filter) {
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.masterplanfee || 0);
        }, 0);
      } else {
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.masterplanfee || 0);
        }, 0);
      }
    }
    if (field == "total_closings") {
      if (filter) {
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.total_closings || 0);
        }, 0);
      } else {
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.total_closings || 0);
        }, 0);
      }
    }
    if (field == "total_permits") {
      if (filter) {
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.total_permits || 0);
        }, 0);
      } else {
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.total_permits || 0);
        }, 0);
      }
    }
    if (field == "total_net_sales") {
      if (filter) {
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.total_net_sales || 0);
        }, 0);
      } else {
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.total_net_sales || 0);
        }, 0);
      }
    }
    if (field == "months_open") {
      if (filter) {
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.months_open || 0);
        }, 0);
      } else {
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.months_open || 0);
        }, 0);
      }
    }
    if (field == "latest_lots_released") {
      if (filter) {
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.latest_lots_released || 0);
        }, 0);
      } else {
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.latest_lots_released || 0);
        }, 0);
      }
    }
    if (field == "latest_standing_inventory") {
      if (filter) {
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.latest_standing_inventory || 0);
        }, 0);
      } else {
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.latest_standing_inventory || 0);
        }, 0);
      }
    }
    if (field == "unsold_lots") {
      if (filter) {
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.unsold_lots || 0);
        }, 0);
      } else {
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.unsold_lots || 0);
        }, 0);
      }
    }
    if (field == "avg_sqft_all") {
      if (filter) {
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.avg_sqft_all || 0);
        }, 0);
      } else {
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.avg_sqft_all || 0);
        }, 0);
      }
    }
    if (field == "avg_sqft_active") {
      if (filter) {
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.avg_sqft_active || 0);
        }, 0);
      } else {
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.avg_sqft_active || 0);
        }, 0);
      }
    }
    if (field == "avg_base_price_all") {
      if (filter) {
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.avg_base_price_all || 0);
        }, 0);
      } else {
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.avg_base_price_all || 0);
        }, 0);
      }
    }
    if (field == "avg_base_price_active") {
      if (filter) {
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.avg_base_price_active || 0);
        }, 0);
      } else {
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.avg_base_price_active || 0);
        }, 0);
      }
    }
    if (field == "min_sqft_all") {
      if (filter) {
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.min_sqft_all || 0);
        }, 0);
      } else {
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.min_sqft_all || 0);
        }, 0);
      }
    }
    if (field == "max_sqft_all") {
      if (filter) {
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.max_sqft_all || 0);
        }, 0);
      } else {
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.max_sqft_all || 0);
        }, 0);
      }
    }
    if (field == "min_base_price_all") {
      if (filter) {
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.min_base_price_all || 0);
        }, 0);
      } else {
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.min_base_price_all || 0);
        }, 0);
      }
    }
    if (field == "min_sqft_active") {
      if (filter) {
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.min_sqft_active || 0);
        }, 0);
      } else {
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.min_sqft_active || 0);
        }, 0);
      }
    }
    if (field == "max_base_price_all") {
      if (filter) {
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.max_base_price_all || 0);
        }, 0);
      } else {
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.max_base_price_all || 0);
        }, 0);
      }
    }
    if (field == "max_sqft_active") {
      if (filter) {
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.max_sqft_active || 0);
        }, 0);
      } else {
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.max_sqft_active || 0);
        }, 0);
      }
    }
    if (field == "avg_net_traffic_per_month_this_year") {
      if (filter) {
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.avg_net_traffic_per_month_this_year || 0);
        }, 0);
      } else {
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.avg_net_traffic_per_month_this_year || 0);
        }, 0);
      }
    }
    if (field == "avg_net_sales_per_month_this_year") {
      if (filter) {
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.avg_net_sales_per_month_this_year || 0);
        }, 0);
      } else {
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.avg_net_sales_per_month_this_year || 0);
        }, 0);
      }
    }
    if (field == "avg_closings_per_month_this_year") {
      if (filter) {
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.avg_closings_per_month_this_year || 0);
        }, 0);
      } else {
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.avg_closings_per_month_this_year || 0);
        }, 0);
      }
    }
    if (field == "avg_net_sales_per_month_since_open") {
      if (filter) {
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.avg_net_sales_per_month_since_open || 0);
        }, 0);
      } else {
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.avg_net_sales_per_month_since_open || 0);
        }, 0);
      }
    }
    if (field == "avg_net_sales_per_month_last_three_months") {
      if (filter) {
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.avg_net_sales_per_month_last_three_months || 0);
        }, 0);
      } else {
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.avg_net_sales_per_month_last_three_months || 0);
        }, 0);
      }
    }
    if (field == "month_net_sold") {
      if (filter) {
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.month_net_sold || 0);
        }, 0);
      } else {
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.month_net_sold || 0);
        }, 0);
      }
    }
    if (field == "year_net_sold") {
      if (filter) {
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.year_net_sold || 0);
        }, 0);
      } else {
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.year_net_sold || 0);
        }, 0);
      }
    }
    if (field == "avg_closing_price") {
      if (filter) {
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.avg_closing_price || 0);
        }, 0);
      } else {
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.avg_closing_price || 0);
        }, 0);
      }
    }
    if (field == "permit_this_year") {
      if (filter) {
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.permit_this_year || 0);
        }, 0);
      } else {
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.permit_this_year || 0);
        }, 0);
      }
    }
    if (field == "median_closing_price_since_open") {
      if (filter) {
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.median_closing_price_since_open || 0);
        }, 0);
      } else {
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.median_closing_price_since_open || 0);
        }, 0);
      }
    }
    if (field == "median_closing_price_this_year") {
      if (filter) {
        return BuilderList.reduce((sum, builder) => {
          return sum + (builder.median_closing_price_this_year || 0);
        }, 0);
      } else {
        return AllBuilderListExport.reduce((sum, builder) => {
          return sum + (builder.median_closing_price_this_year || 0);
        }, 0);
      }
    }
  };

  const averageFields = (field) => {
    const sum = totalSumFields(field);
    if (filter) {
      return sum / BuilderList.length;
    } else {
      return sum / AllBuilderListExport.length;
    }
  };

  const handleSelectChange = (value, field) => {
    setCalculationData((prevData) => ({
      ...prevData,
      [field]: value,  // Store field and value together
    }));

    switch (field) {
      case "totallots":
        setTotalLotsOption(value);

        if (value === 'sum') {
          setTotalLotsResult(totalSumFields(field));
        } else if (value === 'avg') {
          setTotalLotsResult(averageFields(field));
        }
        break;

      case "lotwidth":
        setLotWidthOption(value);

        if (value === 'sum') {
          setLotWidthResult(totalSumFields(field));
        } else if (value === 'avg') {
          setLotWidthResult(averageFields(field));
        }
        break;

      case "lotsize":
        setLotSizeOption(value);

        if (value === 'sum') {
          setLotSizeResult(totalSumFields(field));
        } else if (value === 'avg') {
          setLotSizeResult(averageFields(field));
        }
        break;

      case "hoafee":
        setHOAFeeOption(value);

        if (value === 'sum') {
          setHOAFeeResult(totalSumFields(field));
        } else if (value === 'avg') {
          setHOAFeeResult(averageFields(field));
        }
        break;

      case "masterplanfee":
        setMasterPlanFeeOption(value);

        if (value === 'sum') {
          setmasterPlanFeeResult(totalSumFields(field));
        } else if (value === 'avg') {
          setmasterPlanFeeResult(averageFields(field));
        }
        break;

      case "total_closings":
        setTotalClosingsOption(value);

        if (value === 'sum') {
          setTotalClosingsResult(totalSumFields(field));
        } else if (value === 'avg') {
          setTotalClosingsResult(averageFields(field));
        }
        break;

      case "total_permits":
        setTotalPermitsOption(value);

        if (value === 'sum') {
          setTotalPermitsResult(totalSumFields(field));
        } else if (value === 'avg') {
          setTotalPermitsResult(averageFields(field));
        }
        break;

      case "total_net_sales":
        setTotalNetSalesOption(value);

        if (value === 'sum') {
          setTotalNetSalesResult(totalSumFields(field));
        } else if (value === 'avg') {
          setTotalNetSalesResult(averageFields(field));
        }
        break;

      case "months_open":
        setMonthsOpenOption(value);

        if (value === 'sum') {
          setMonthsOpenResult(totalSumFields(field));
        } else if (value === 'avg') {
          setMonthsOpenResult(averageFields(field));
        }
        break;

      case "latest_lots_released":
        setLatestLotsReleasedOption(value);

        if (value === 'sum') {
          setLatestLotsReleasedResult(totalSumFields(field));
        } else if (value === 'avg') {
          setLatestLotsReleasedResult(averageFields(field));
        }
        break;

      case "latest_standing_inventory":
        setLatestStandingInventoryOption(value);

        if (value === 'sum') {
          setLatestStandingInventoryResult(totalSumFields(field));
        } else if (value === 'avg') {
          setLatestStandingInventoryResult(averageFields(field));
        }
        break;

      case "unsold_lots":
        setUnsoldLotsOption(value);

        if (value === 'sum') {
          setUnsoldLotsResult(totalSumFields(field));
        } else if (value === 'avg') {
          setUnsoldLotsResult(averageFields(field));
        }
        break;

      case "avg_sqft_all":
        setAvgSqftAllOption(value);

        if (value === 'sum') {
          setAvgSqftAllResult(totalSumFields(field));
        } else if (value === 'avg') {
          setAvgSqftAllResult(averageFields(field));
        }
        break;

      case "avg_sqft_active":
        setAvgSqftActiveOption(value);

        if (value === 'sum') {
          setAvgSqftActiveResult(totalSumFields(field));
        } else if (value === 'avg') {
          setAvgSqftActiveResult(averageFields(field));
        }
        break;

      case "avg_base_price_all":
        setAvgBasePriceAllOption(value);

        if (value === 'sum') {
          setAvgBasePriceAllResult(totalSumFields(field));
        } else if (value === 'avg') {
          setAvgBasePriceAllResult(averageFields(field));
        }
        break;

      case "avg_base_price_active":
        setAvgBasePriceActiveOption(value);

        if (value === 'sum') {
          setAvgBasePriceActiveResult(totalSumFields(field));
        } else if (value === 'avg') {
          setAvgBasePriceActiveResult(averageFields(field));
        }
        break;

      case "min_sqft_all":
        setMinSqftAllOption(value);

        if (value === 'sum') {
          setMinSqftAllResult(totalSumFields(field));
        } else if (value === 'avg') {
          setMinSqftAllResult(averageFields(field));
        }
        break;

      case "max_sqft_all":
        setMaxSqftAllOption(value);

        if (value === 'sum') {
          setMaxSqftAllResult(totalSumFields(field));
        } else if (value === 'avg') {
          setMaxSqftAllResult(averageFields(field));
        }
        break;

      case "min_base_price_all":
        setMinBasePriceAllOption(value);

        if (value === 'sum') {
          setMinBasePriceAllResult(totalSumFields(field));
        } else if (value === 'avg') {
          setMinBasePriceAllResult(averageFields(field));
        }
        break;

      case "min_sqft_active":
        setMinSqftActiveOption(value);

        if (value === 'sum') {
          setMinSqftActiveResult(totalSumFields(field));
        } else if (value === 'avg') {
          setMinSqftActiveResult(averageFields(field));
        }
        break;

      case "max_base_price_all":
        setMaxBasePriceAllOption(value);

        if (value === 'sum') {
          setMaxBasePriceAllResult(totalSumFields(field));
        } else if (value === 'avg') {
          setMaxBasePriceAllResult(averageFields(field));
        }
        break;

      case "max_sqft_active":
        setMaxSqftActiveOption(value);

        if (value === 'sum') {
          setMaxSqftActiveResult(totalSumFields(field));
        } else if (value === 'avg') {
          setMaxSqftActiveResult(averageFields(field));
        }
        break;

      case "avg_net_traffic_per_month_this_year":
        setAvgNetTrafficPerMonthThisYearOption(value);

        if (value === 'sum') {
          setAvgNetTrafficPerMonthThisYearResult(totalSumFields(field));
        } else if (value === 'avg') {
          setAvgNetTrafficPerMonthThisYearResult(averageFields(field));
        }
        break;

      case "avg_net_sales_per_month_this_year":
        setAvgNetSalesPerMonthThisYearOption(value);

        if (value === 'sum') {
          setAvgNetSalesPerMonthThisYearResult(totalSumFields(field));
        } else if (value === 'avg') {
          setAvgNetSalesPerMonthThisYearResult(averageFields(field));
        }
        break;

      case "avg_closings_per_month_this_year":
        setAvgClosingsPerMonthThisYearOption(value);

        if (value === 'sum') {
          setAvgClosingsPerMonthThisYearResult(totalSumFields(field));
        } else if (value === 'avg') {
          setAvgClosingsPerMonthThisYearResult(averageFields(field));
        }
        break;

      case "avg_net_sales_per_month_since_open":
        setAvgNetSalesPerMonthSinceOpenOption(value);

        if (value === 'sum') {
          setAvgNetSalesPerMonthSinceOpenResult(totalSumFields(field));
        } else if (value === 'avg') {
          setAvgNetSalesPerMonthSinceOpenResult(averageFields(field));
        }
        break;

      case "avg_net_sales_per_month_last_three_months":
        setAvgNetSalesPerMonthLastThreeMonthsOption(value);

        if (value === 'sum') {
          setAvgNetSalesPerMonthLastThreeMonthsResult(totalSumFields(field));
        } else if (value === 'avg') {
          setAvgNetSalesPerMonthLastThreeMonthsResult(averageFields(field));
        }
        break;

      case "month_net_sold":
        setMonthNetSoldOption(value);

        if (value === 'sum') {
          setMonthNetSoldResult(totalSumFields(field));
        } else if (value === 'avg') {
          setMonthNetSoldResult(averageFields(field));
        }
        break;

      case "year_net_sold":
        setYearNetSoldOption(value);

        if (value === 'sum') {
          setYearNetSoldResult(totalSumFields(field));
        } else if (value === 'avg') {
          setYearNetSoldResult(averageFields(field));
        }
        break;

      case "avg_closing_price":
        setAvgClosingPriceOption(value);

        if (value === 'sum') {
          setAvgClosingPriceResult(totalSumFields(field));
        } else if (value === 'avg') {
          setAvgClosingPriceResult(averageFields(field));
        }
        break;

      case "permit_this_year":
        setPermitsThisYearOption(value);

        if (value === 'sum') {
          setPermitsThisYearResult(totalSumFields(field));
        } else if (value === 'avg') {
          setPermitsThisYearResult(averageFields(field));
        }
        break;

      case "median_closing_price_since_open":
        setMedianClosingPriceSinceOpenOption(value);

        if (value === 'sum') {
          setMedianClosingPriceSinceOpenResult(totalSumFields(field));
        } else if (value === 'avg') {
          setMedianClosingPriceSinceOpenResult(averageFields(field));
        }
        break;

      case "median_closing_price_this_year":
        setMedianClosingPriceThisYearOption(value);

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
  const areaOption = [
    { value: "BC", label: "BC" },
    { value: "E", label: "E" },
    { value: "H", label: "H" },
    { value: "IS", label: "IS" },
    { value: "L", label: "DET" },
    { value: "MSQ", label: "MSQ" },
    { value: "MV", label: "MV" },
    { value: "NLV", label: "NLV" },
    { value: "NW", label: "NW" },
    { value: "P", label: "P" },
    { value: "SO", label: "SO" },
    { value: "SW", label: "SW" }
  ];

  const handleSelectAreaChange = (selectedItems) => {
    const selectedValues = selectedItems.map(item => item.value).join(', ');
    setSelectedArea(selectedItems);
    setFilterQuery(prevState => ({
      ...prevState,
      area: selectedValues
    }));
    setNormalFilter(true);
  };

  const handleSelectZipCodeChange = (selectedItems) => {
    const selectedValues = selectedItems.map(item => item.value).join(', ');
    setSelectedZipCode(selectedItems);
    setFilterQuery(prevState => ({
      ...prevState,
      zipcode: selectedValues
    }));
    setNormalFilter(true);
  };

  const masterPlanOption = [
    { value: "ALIANTE", label: "ALIANTE" },
    { value: "ANTHEM", label: "ANTHEM" },
    { value: "ARLINGTON RANCH", label: "ARLINGTON RANCH" },
    { value: "ASCAYA", label: "ASCAYA" },
    { value: "BUFFALO RANCH", label: "BUFFALO RANCH" },
    { value: "CANYON CREST", label: "CANYON CREST" },
    { value: "CANYON GATE", label: "CANYON GATE" },
    { value: "CORONADO RANCH", label: "CORONADO RANCH" },
    { value: "ELDORADO", label: "ELDORADO" },
    { value: "GREEN VALLEY", label: "GREEN VALLEY" },
    { value: "HIGHLANDS RANCH", label: "HIGHLANDS RANCH" },
    { value: "INSPIRADA", label: "INSPIRADA" },
    { value: "LAKE LAS VEGAS", label: "LAKE LAS VEGAS" },
    { value: "THE LAKES", label: "THE LAKES" },
    { value: "LAS VEGAS COUNTRY CLUB", label: "LAS VEGAS COUNTRY CLUB" },
    { value: "LONE MOUNTAIN", label: "LONE MOUNTAIN" },
    { value: "MACDONALD RANCH", label: "MACDONALD RANCH" },
    { value: "MOUNTAINS EDGE", label: "MOUNTAINS EDGE" },
    { value: "MOUNTAIN FALLS", label: "MOUNTAIN FALLS" },
    { value: "NEVADA RANCH", label: "NEVADA RANCH" },
    { value: "NEVADA TRAILS", label: "NEVADA TRAILS" },
    { value: "PROVIDENCE", label: "PROVIDENCE" },
    { value: "QUEENSRIDGE", label: "QUEENSRIDGE" },
    { value: "RED ROCK CC", label: "RED ROCK CC" },
    { value: "RHODES RANCH", label: "RHODES RANCH" },
    { value: "SEDONA RANCH", label: "SEDONA RANCH" },
    { value: "SEVEN HILLS", label: "SEVEN HILLS" },
    { value: "SILVERADO RANCH", label: "SILVERADO RANCH" },
    { value: "SILVERSTONE RANCH", label: "SILVERSTONE RANCH" },
    { value: "SKYE CANYON", label: "SKYE CANYON" },
    { value: "SKYE HILLS", label: "SKYE HILLS" },
    { value: "SPANISH TRAIL", label: "SPANISH TRAIL" },
    { value: "SOUTHERN HIGHLANDS", label: "SOUTHERN HIGHLANDS" },
    { value: "SUMMERLIN", label: "SUMMERLIN" },
    { value: "SUNRISE HIGH", label: "SUNRISE HIGH" },
    { value: "SUNSTONE", label: "SUNSTONE" },
    { value: "TUSCANY", label: "TUSCANY" },
    { value: "VALLEY VISTA", label: "VALLEY VISTA" },
    { value: "VILLAGES AT TULE SPRING", label: "VILLAGES AT TULE SPRING" },
    { value: "VISTA VERDE", label: "VISTA VERDE" },
    { value: "WESTON HILLS", label: "WESTON HILLS" },
  ];

  const handleSelectMasterPlanChange = (selectedItems) => {
    const selectedValues = selectedItems.map(item => item.value).join(', ');
    setSelectedMasterPlan(selectedItems);
    setFilterQuery(prevState => ({
      ...prevState,
      masterplan_id: selectedValues
    }));
    setNormalFilter(true);
  };

  const jurisdictionOption = [
    { value: "Boulder City", label: "Boulder City" },
    { value: "CLV", label: "CLV" },
    { value: "CC Enterprise", label: "CC Enterprise" },
    { value: "CC Indian Springs", label: "CC Indian Springs" },
    { value: "CC Laughlin", label: "CC Laughlin" },
    { value: "Lone Mtn", label: "Lone Mtn" },
    { value: "Lower Kyle Canyon", label: "Lower Kyle Canyon" },
    { value: "CC Moapa Valley", label: "CC Moapa Valley" },
    { value: "CC Mt Charleston", label: "CC Mt Charleston" },
    { value: "CC Mtn Springs", label: "CC Mtn Springs" },
    { value: "CC Paradise", label: "CC Paradise" },
    { value: "CC Searchlight", label: "CC Searchlight" },
    { value: "CC Spring Valley", label: "CC Spring Valley" },
    { value: "CC Summerlin South", label: "CC Summerlin South" },
    { value: "CC Sunrise Manor", label: "CC Sunrise Manor" },
    { value: "CC Whiteney", label: "CC Whiteney" },
    { value: "CC Winchester", label: "CC Winchester" },
    { value: "CC Unincorporated", label: "CC Unincorporated" },
    { value: "Henderson", label: "Henderson" },
    { value: "Mesquite", label: "Mesquite" },
    { value: "NLV", label: "NLV" },
    { value: "NYE", label: "NYE" },
  ];

  const handleSelectJurisdictionChange = (selectedItems) => {
    const selectedValues = selectedItems.map(item => item.value).join(', ');
    setSelectedJurisdiction(selectedItems);
    setFilterQuery(prevState => ({
      ...prevState,
      juridiction: selectedValues
    }));
    setNormalFilter(true);
  };

  const zipCodeOption = [
    { value: "89002", label: "89002" },
    { value: "89005", label: "89005" },
    { value: "89011", label: "89011" },
    { value: "89012", label: "89012" },
    { value: "89014", label: "89014" },
    { value: "89015", label: "89015" },
    { value: "89018", label: "89018" },
    { value: "89021", label: "89021" },
    { value: "89027", label: "89027" },
    { value: "89029", label: "89029" },
    { value: "89030", label: "89030" },
    { value: "89031", label: "89031" },
    { value: "89032", label: "89032" },
    { value: "89044", label: "89044" },
    { value: "89044", label: "89044" },
    { value: "89052", label: "89052" },
    { value: "89055", label: "89055" },
    { value: "89060", label: "89060" },
    { value: "89061", label: "89061" },
    { value: "89074", label: "89074" },
    { value: "89081", label: "89081" },
    { value: "89084", label: "89084" },
    { value: "89085", label: "89085" },
    { value: "89086", label: "89086" },
  ];

  const gasProviderOption = [
    { value: "SOUTHWEST GAS", label: "SOUTHWEST GAS" },
  ];

  const handleGasProviderChange = (selectedItems) => {
    const selectedValues = selectedItems.map(item => item.value).join(', ');
    setSelectedGasProvider(selectedItems);
    setFilterQuery(prevState => ({
      ...prevState,
      gasprovider: selectedValues
    }));
    setNormalFilter(true);
  };

  const handleSelectBuilderNameChange = (selectedItems) => {
    const selectedValues = selectedItems.map(item => item.value);
    const selectedNames = selectedItems.map(item => item.label).join(', ');
    setSelectedBuilderIDByFilter(selectedValues);
    setSelectedBuilderName(selectedItems);
    setFilterQuery(prevState => ({
      ...prevState,
      builder_name: selectedNames
    }));
    setNormalFilter(true);
  };

  const handleSelectSubdivisionNameChange = (selectedItems) => {
    const selectedNames = selectedItems.map(item => item.label).join(', ');
    setSelectedSubdivisionName(selectedItems);
    setFilterQuery(prevState => ({
        ...prevState,
        name: selectedNames
    }));
    setNormalFilter(true);
  };

  const handleSelectStatusChange = (selectedItems) => {
    const selectedValues = selectedItems.map(item => item.value);
    const selectedNames = selectedItems.map(item => item.value).join(', ');
    setSelectedValues(selectedValues);
    setSelectedStatus(selectedItems);
    setFilterQuery(prevState => ({
      ...prevState,
      status: selectedNames
    }));
    setNormalFilter(true);
  }

  const handleSelectReportingChange = (selectedItems) => {
    const selectedValues = selectedItems.map(item => item.value);
    const selectedNames = selectedItems.map(item => item.value).join(', ');
    setSelectedValues(selectedValues);
    setSelectedReporting(selectedItems);
    setFilterQuery(prevState => ({
      ...prevState,
      reporting: selectedNames
    }));
    setNormalFilter(true);
  }

  const handleSelectProductTypeChange = (selectedItems) => {
    const selectedValues = selectedItems.map(item => item.value);
    const selectedNames = selectedItems.map(item => item.value).join(', ');
    setSelectedValues(selectedValues);
    setProductTypeStatus(selectedItems);
    setFilterQuery(prevState => ({
      ...prevState,
      product_type: selectedNames
    }));
    setNormalFilter(true);
  }

  const handleSelectAgeChange = (selectedItems) => {
    const selectedValues = selectedItems.map(item => item.value);
    const selectedNames = selectedItems.map(item => item.value).join(', ');
    setSelectedValues(selectedValues);
    setSelectedAge(selectedItems);
    setFilterQuery(prevState => ({
      ...prevState,
      age: selectedNames
    }));
    setNormalFilter(true);
  }

  const handleSelectSingleChange = (selectedItems) => {
    const selectedValues = selectedItems.map(item => item.value);
    const selectedNames = selectedItems.map(item => item.value).join(', ');
    setSelectedValues(selectedValues);
    setSelectedSingle(selectedItems);

    setFilterQuery(prevState => ({
      ...prevState,
      single: selectedNames
    }));
    setNormalFilter(true);
  }

  const handleSelectGatedChange = (selectedItems) => {
    const selectedValues = selectedItems.map(item => item.value);
    const selectedNames = selectedItems.map(item => item.value).join(', ');
    setSelectedValues(selectedValues);
    setSelectedGated(selectedItems);

    setFilterQuery(prevState => ({
      ...prevState,
      gated: selectedNames
    }));
    setNormalFilter(true);
  }

  const handleFilterDateFrom = (date) => {
    if (date) {
      const formattedDate = date.toLocaleDateString('en-US');
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
    setNormalFilter(true);
  };

  const handleFilterDateTo = (date) => {
    if (date) {
      const formattedDate = date.toLocaleDateString('en-US');
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
    setNormalFilter(true);
  };

  const parseDate = (dateString) => {
    const [month, day, year] = dateString.split('/');
    return new Date(year, month - 1, day);
  };

  const handleDownloadReport = async () => {
    if(loadingReportId === subdivisionID){
      return;
    }
    setLoadingReportId(subdivisionID);

    const reportdata = {
      type: "Subdivision Analysis Report",
      start_date: startDate,
      end_date: endDate,
      id: subdivisionID
    };

    const bearerToken = JSON.parse(localStorage.getItem("usertoken"));
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_IMAGE_URL}api/admin/report/export-reports`,
        reportdata,
        {
          responseType: "arraybuffer",
          headers: {
            Accept: "application/pdf",
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );
      setLoadingReportId(null);
      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `SAR-${startDate}-${endDate}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      setLoadingReportId(null);
      if (error.response && error.response.data) {
        setError("Something went wrong");
      }
    }
  };

  useEffect(() => {
    const fieldOptions = fieldList
      .filter((field) => field !== 'Action' && field !== 'Total Closings'
        && field !== 'Total Permits' && field !== 'Total Net Sales'
        && field !== 'Months Open' && field !== 'Latest Traffic/Sales Data'
        && field !== 'Latest Lots Released' && field !== 'Latest Standing Inventory'
        && field !== 'Unsold Lots' && field !== 'Avg Sqft All'
        && field !== 'Avg Sqft Active' && field !== 'Avg Base Price All'
        && field !== 'Avg Base Price Active' && field !== 'Min Sqft All'
        && field !== 'Max Sqft All' && field !== 'Min Base Price All'
        && field !== 'Min Sqft Active' && field !== 'Max Base Price All'
        && field !== 'Max Sqft Active' && field !== 'Avg Traffic Per Month This Year'
        && field !== 'Avg Net Sales Per Month This Year' && field !== 'Avg Closings Per Month This Year'
        && field !== 'Avg Net Sales Per Month Since Open' && field !== 'Avg Net Sales Per Month Last 3 Months'
        && field !== 'Max Week Ending' && field !== 'Min Week Ending'
        && field !== 'Sqft Group' && field !== 'Price Group'
        && field !== 'Month Net Sold' && field !== 'Year Net Sold'
        && field !== 'Avg Closing Price' && field !== 'Permits This Year'
        && field !== 'Median Closing Price Since Open' && field !== 'Median Closing Price This Year')
      .map((field) => {
        let value = field.charAt(0).toLowerCase() + field.slice(1).replace(/\s+/g, '');

        if (value === 'builder') {
          value = 'builderName';
        }
        if (value === 'productType') {
          value = 'product_type';
        }
        if (value === 'masterPlan') {
          value = 'masterplan_id';
        }
        if (value === 'zipCode') {
          value = 'zipcode';
        }
        if (value === 'totalLots') {
          value = 'totallots';
        }
        if (value === 'lotWidth') {
          value = 'lotwidth';
        }
        if (value === 'lotSize') {
          value = 'lotsize';
        }
        if (value === 'ageRestricted') {
          value = 'age';
        }
        if (value === 'allSingleStory') {
          value = 'single';
        }
        if (value === 'crossStreets') {
          value = 'location';
        }
        if (value === 'latitude') {
          value = 'lat';
        }
        if (value === 'longitude') {
          value = 'lng';
        }
        if (value === 'gasProvider') {
          value = 'gasprovider';
        }
        if (value === 'hOAFee') {
          value = 'hoafee';
        }
        if (value === 'masterPlanFee') {
          value = 'masterplanfee';
        }
        if (value === 'parcelGroup') {
          value = 'parcel';
        }
        if (value === 'dateAdded') {
          value = 'dateadded';
        }
        if (value === '__pkSubID') {
          value = 'subdivision_code';
        }
        if (value === '_fkBuilderID') {
          value = 'builder_code';
        }
        if (value === 'openSince') {
          value = 'opensince';
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
    localStorage.setItem("sortConfigSubdivisions", JSON.stringify(sortingConfig));
    setSortConfig(sortingConfig);
    getbuilderlist(currentPage, sortingConfig, searchQuery);
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
  const [samePage, setSamePage] = useState(false);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [selectCheckBox, setSelectCheckBox] = useState(false);

  const handleMainCheckboxChange = (e) => {
    setSamePage(currentPage);
    if (e.target.checked) {
      Swal.fire({
        title: "Select Records",
        html: `
          <div style="text-align: left;">
            <label>
              <input type="radio" name="selection" value="visible" checked />
              Select visible records
            </label>
            <br />
            <label>
              <input type="radio" name="selection" value="all" />
              Select all records
            </label>
          </div>
        `,
        confirmButtonText: "Apply",
        showCancelButton: false,
        preConfirm: () => {
          const selectedOption = document.querySelector('input[name="selection"]:checked').value;
          return selectedOption;
        },
      }).then((result) => {
        if (result.isConfirmed) {
          const selectedOption = result.value;
          if (selectedOption === "visible") {
            setIsSelectAll(false);
            setSelectCheckBox(true);
            setSelectedLandSales(BuilderList.map((user) => user.id));
          } else if (selectedOption === "all") {
            setIsSelectAll(true);
            setSelectCheckBox(true);
            setSelectedLandSales(AllBuilderListExport.map((user) => user.id));
          }
        }
      });
    } else {
      setSelectCheckBox(false);
      setSelectedLandSales([]);
    }
  };

  return (
    <Fragment>
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
                        class=" mx-5"
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

                    <div className="mt-2" style={{ width: "100%" }}>
                      {SyestemUserRole == "Data Uploader" ||
                        SyestemUserRole == "User" || SyestemUserRole == "Standard User" ? (
                        <div className="d-flex">
                          <button className="btn btn-primary btn-sm me-1" onClick={handleOpenDialog} title="Column Order">
                            <div style={{ fontSize: "11px" }}>
                              <i className="fa-solid fa-list" />&nbsp;
                              Column Order
                            </div>
                          </button>
                          <Button
                            className="btn-sm me-1"
                            variant="secondary"
                            onClick={HandleSortingPopupDetailClick}
                            title="Sorted Fields"
                          >
                            <div style={{ fontSize: "11px" }}>
                              <i class="fa-solid fa-sort" />&nbsp;
                              Sort
                            </div>
                          </Button>
                          <button disabled={excelDownload || BuilderList?.length === 0} onClick={() => setExportModelShow(true)} className="btn btn-primary btn-sm me-1" title="Export .csv">
                            <div style={{ fontSize: "11px" }}>
                              <i class="fas fa-file-export" />&nbsp;
                              {excelDownload ? "Downloading..." : "Export"}
                            </div>
                          </button>
                          <button className="btn btn-success btn-sm me-1" onClick={() => setManageFilterOffcanvas(true)} title="Filter">
                            <div style={{ fontSize: "11px" }}>
                              <i className="fa fa-filter" />&nbsp;
                              Filter
                            </div>
                          </button>
                        </div>
                      ) : (
                        <div className="d-flex">
                          <button className="btn btn-primary btn-sm me-1" onClick={handleOpenDialog} title="Column Order">
                            <div style={{ fontSize: "11px" }}>
                              <i className="fa-solid fa-list"></i>&nbsp;
                              Column Order
                            </div>
                          </button>
                          <Button
                            className="btn-sm me-1"
                            variant="secondary"
                            onClick={HandleSortingPopupDetailClick}
                            title="Sorted Fields"
                          >
                            <div style={{ fontSize: "11px" }}>
                              <i class="fa-solid fa-sort"></i>&nbsp;
                              Sort
                            </div>
                          </Button>
                          <button disabled={excelDownload || BuilderList?.length === 0} onClick={() => setExportModelShow(true)} className="btn btn-primary btn-sm me-1" title="Export .csv">
                            <div style={{ fontSize: "11px" }}>
                              <i class="fas fa-file-export" />&nbsp;
                              {excelDownload ? "Downloading..." : "Export"}
                            </div>
                          </button>
                          <button className="btn btn-success btn-sm me-1" onClick={() => setManageFilterOffcanvas(true)} title="Filter">
                            <div style={{ fontSize: "11px" }}>
                              <i className="fa fa-filter" />&nbsp;
                              Filter
                            </div>
                          </button>
                          <Button
                            className="btn btn-primary btn-sm me-1"
                            onClick={() => !excelLoading ? addToBuilderList() : ""}
                          >
                            {excelLoading ?
                              <div class="spinner-border spinner-border-sm" role="status" />
                              :
                              <div style={{ fontSize: "11px" }}>
                                <i className="fa fa-map-marker" aria-hidden="true" />&nbsp;
                                Map
                              </div>
                            }
                          </Button>
                          <button
                            className="btn btn-primary btn-sm me-1"
                            onClick={() => setManageAccessOffcanvas(true)}
                          >
                            <div style={{ fontSize: "11px" }}>
                              <i className="fa fa-shield" />&nbsp;
                              Field Access
                            </div>
                          </button>
                          <Button
                            className="btn-sm me-1"
                            variant="secondary"
                            onClick={handlBuilderClick}
                          >
                            <div style={{ fontSize: "11px" }}>
                              <i className="fas fa-file-import" />&nbsp;
                              Import
                            </div>
                          </Button>
                          <Link
                            to={"#"}
                            className="btn btn-primary btn-sm ms-1"
                            data-bs-toggle="offcanvas"
                            onClick={() => seCanvasShowAdd(true)}
                          >
                            <div style={{ fontSize: "11px" }}>
                              <i className="fa fa-plus" />&nbsp;
                              Add Subdivision
                            </div>
                          </Link>
                          <Link
                            to={"#"}
                            className="btn btn-primary btn-sm ms-1"
                            data-bs-toggle="offcanvas"
                            onClick={() => selectedLandSales.length > 0 ? seCanvasShowEdit(true) : swal({
                              text: "Please select at least one record.",
                              icon: "warning",
                              dangerMode: true,
                            })}
                          >
                            <div style={{ fontSize: "11px" }}>
                              <i className="fa fa-pencil" />&nbsp;
                              Edit
                            </div>
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
                            <div style={{ fontSize: "11px" }}>
                              <i className="fa fa-trash" />&nbsp;
                              Delete
                            </div>
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
                        className="table ItemsCheckboxSec dataTable no-footer mb-0 subdivion-table"
                      >
                        <thead>
                          <tr style={{ textAlign: "center" }}>
                            <th>
                              <input
                                type="checkbox"
                                style={{ cursor: "pointer" }}
                                checked={(currentPage == samePage || isSelectAll) ? selectCheckBox : ""}
                                onClick={(e) => handleMainCheckboxChange(e)}
                              />
                            </th>
                            <th>
                              <strong> No.</strong>
                            </th>
                            {columns.map((column) => (
                              <th style={{ textAlign: "center", cursor: "pointer" }} key={column.id}>
                                <strong>
                                  {column.label}
                                  {column.id != "action" && sortConfig.some((item) => item.key === (
                                    column.id == "builder" ? "builderName" :
                                    column.id == "product Type" ? "product_type" :
                                    column.id == "master Plan" ? "masterplan_id" :
                                    column.id == "zip Code" ? "zipcode" :
                                    column.id == "total Lots" ? "totallots" :
                                    column.id == "lot Width" ? "lotwidth" :
                                    column.id == "lot Size" ? "lotsize" :
                                    column.id == "age Restricted" ? "age" :
                                    column.id == "all SingleStory" ? "single" :
                                    column.id == "cross Streets" ? "crossstreet" :
                                    column.id == "latitude" ? "lat" :
                                    column.id == "longitude" ? "lng" :
                                    column.id == "gas Provider" ? "gasprovider" :
                                    column.id == "hOA Fee" ? "hoafee" :
                                    column.id == "master Plan Fee" ? "masterplanfee" :
                                    column.id == "parcel Group" ? "parcel" :
                                    column.id == "date Added" ? "dateadded" :
                                    column.id == "__pkSubID" ? "subdivision_code" :
                                    column.id == "_fkBuilderID" ? "builder_code" :
                                    column.id == "open Since" ? "opensince" : toCamelCase(column.id))
                                ) && (
                                    <span>
                                      {column.id != "action" && sortConfig.find(
                                        (item) => item.key === (
                                          column.id == "builder" ? "builderName" :
                                          column.id == "product Type" ? "product_type" :
                                          column.id == "master Plan" ? "masterplan_id" :
                                          column.id == "zip Code" ? "zipcode" :
                                          column.id == "total Lots" ? "totallots" :
                                          column.id == "lot Width" ? "lotwidth" :
                                          column.id == "lot Size" ? "lotsize" :
                                          column.id == "age Restricted" ? "age" :
                                          column.id == "all SingleStory" ? "single" :
                                          column.id == "cross Streets" ? "crossstreet" :
                                          column.id == "latitude" ? "lat" :
                                          column.id == "longitude" ? "lng" :
                                          column.id == "gas Provider" ? "gasprovider" :
                                          column.id == "hOA Fee" ? "hoafee" :
                                          column.id == "master Plan Fee" ? "masterplanfee" :
                                          column.id == "parcel Group" ? "parcel" :
                                          column.id == "date Added" ? "dateadded" :
                                          column.id == "__pkSubID" ? "subdivision_code" :
                                          column.id == "_fkBuilderID" ? "builder_code" :
                                          column.id == "open Since" ? "opensince" : toCamelCase(column.id))
                                      ).direction === "asc" ? "↑" : "↓"}
                                    </span>
                                  )
                                  //   : ((column.id == "action" || column.id == "cross Streets" || column.id == "website") ? "" : <span>↑↓</span>
                                  // )
                                }
                              </strong>

                              {(!excelLoading) && (column.id !== "action" && column.id !== "status" && column.id !== "reporting" && column.id !== "builder" && column.id !== "name" &&
                                column.id !== "product Type" && column.id !== "area" && column.id !== "master Plan" && column.id !== "zip Code" && column.id !== "zoning" &&
                                column.id !== "age Restricted" && column.id !== "all Single Story" && column.id !== "gated" && column.id !== "cross Streets" && column.id !== "juridiction" &&
                                column.id !== "latitude" && column.id !== "longitude" && column.id !== "gas Provider" && column.id !== "parcel Group" && column.id !== "phone" &&
                                column.id !== "website" && column.id !== "date Added" && column.id !== "__pkSubID" && column.id !== "_fkBuilderID" && column.id !== "latest Traffic/Sales Data" &&
                                column.id !== "max Week Ending" && column.id !== "min Week Ending" && column.id !== "sqft Group" && column.id !== "price Group" && column.id !== "open Since"
                              ) && (
                                  <>
                                    <br />
                                    <select className="custom-select" value={column.id == "total Lots" ? totalLotsOption : column.id == "lot Width" ? lotWidthOption :
                                      column.id == "lot Size" ? lotSizeOption : column.id == "master Plan Fee" ? masterPlanFeeOption :
                                        column.id == "hOA Fee" ? hOAFeeOption : column.id == "total Closings" ? totalClosingsOption : column.id == "total Permits" ? totalPermitsOption :
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

                                      style={{
                                        cursor: "pointer",
                                        marginLeft: '0px',
                                        fontSize: "8px",
                                        padding: " 0 5px 0",
                                        height: "15px",
                                        color: "white",
                                        appearance: "auto"
                                      }}

                                      onChange={(e) => column.id == "total Lots" ? handleSelectChange(e.target.value, "totallots") :
                                        column.id == "lot Width" ? handleSelectChange(e.target.value, "lotwidth") :
                                        column.id == "lot Size" ? handleSelectChange(e.target.value, "lotsize") :
                                        column.id == "master Plan Fee" ? handleSelectChange(e.target.value, "masterplanfee") :
                                        column.id == "hOA Fee" ? handleSelectChange(e.target.value, "hoafee") :
                                        column.id == "total Closings" ? handleSelectChange(e.target.value, "total_closings") :
                                        column.id == "total Permits" ? handleSelectChange(e.target.value, "total_permits") :
                                        column.id == "total Net Sales" ? handleSelectChange(e.target.value, "total_net_sales") :
                                        column.id == "months Open" ? handleSelectChange(e.target.value, "months_open") :
                                        column.id == "latest Lots Released" ? handleSelectChange(e.target.value, "latest_lots_released") :
                                        column.id == "latest Standing Inventory" ? handleSelectChange(e.target.value, "latest_standing_inventory") :
                                        column.id == "unsold Lots" ? handleSelectChange(e.target.value, "unsold_lots") :
                                        column.id == "avg Sqft All" ? handleSelectChange(e.target.value, "avg_sqft_all") :
                                        column.id == "avg Sqft Active" ? handleSelectChange(e.target.value, "avg_sqft_active") :
                                        column.id == "avg Base Price All" ? handleSelectChange(e.target.value, "avg_base_price_all") :
                                        column.id == "avg Base Price Active" ? handleSelectChange(e.target.value, "avg_base_price_active") :
                                        column.id == "min Sqft All" ? handleSelectChange(e.target.value, "min_sqft_all") :
                                        column.id == "max Sqft All" ? handleSelectChange(e.target.value, "max_sqft_all") :
                                        column.id == "min Base Price All" ? handleSelectChange(e.target.value, "min_base_price_all") :
                                        column.id == "min Sqft Active" ? handleSelectChange(e.target.value, "min_sqft_active") :
                                        column.id == "max Base Price All" ? handleSelectChange(e.target.value, "max_base_price_all") :
                                        column.id == "max Sqft Active" ? handleSelectChange(e.target.value, "max_sqft_active") :
                                        column.id == "avg Net Traffic Per Month This Year" ? handleSelectChange(e.target.value, "avg_net_traffic_per_month_this_year") :
                                        column.id == "avg Net Sales Per Month This Year" ? handleSelectChange(e.target.value, "avg_net_sales_per_month_this_year") :
                                        column.id == "avg Closings Per Month This Year" ? handleSelectChange(e.target.value, "avg_closings_per_month_this_year") :
                                        column.id == "avg Net Sales Per Month Since Open" ? handleSelectChange(e.target.value, "avg_net_sales_per_month_since_open") :
                                        column.id == "avg Net Sales Per Month Last 3 Months" ? handleSelectChange(e.target.value, "avg_net_sales_per_month_last_three_months") :
                                        column.id == "month Net Sold" ? handleSelectChange(e.target.value, "month_net_sold") :
                                        column.id == "year Net Sold" ? handleSelectChange(e.target.value, "year_net_sold") :
                                        column.id == "avg Closing Price" ? handleSelectChange(e.target.value, "avg_closing_price") :
                                        column.id == "permits This Year" ? handleSelectChange(e.target.value, "permit_this_year") :
                                        column.id == "median Closing Price Since Open" ? handleSelectChange(e.target.value, "median_closing_price_since_open") :
                                        column.id == "median Closing Price This Year" ? handleSelectChange(e.target.value, "median_closing_price_this_year") : ""
                                      }
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
                                  <td key={column.id} style={{ textAlign: "center" }}>{totalLotsResult.toFixed(2)}</td>
                                }
                                {column.id == "lot Width" &&
                                  <td key={column.id} style={{ textAlign: "center" }}>{lotWidthResult.toFixed(2)}</td>
                                }
                                {column.id == "lot Size" &&
                                  <td key={column.id} style={{ textAlign: "center" }}>{lotSizeResult.toFixed(2)}</td>
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
                                  <td key={column.id} style={{ textAlign: "center" }}>{hOAFeeResult.toFixed(2)}</td>
                                }
                                {column.id == "master Plan Fee" &&
                                  <td key={column.id} style={{ textAlign: "center" }}>{masterPlanFeeResult.toFixed(2)}</td>
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
                        {BuilderList !== null && BuilderList.length > 0 ? (
                          BuilderList.map((element, index) => (
                            <tr
                              onClick={(e) => {
                                if (e.target.type === "checkbox") {
                                  return;
                                } else if (e.target.className === "btn btn-danger shadow btn-xs sharp" || e.target.className === "fa fa-trash") {
                                  return;
                                } else if (e.target.className === "btn btn-primary shadow btn-xs sharp me-1" || e.target.className === "fas fa-pencil-alt") {
                                  return;
                                } else if (e.target.className === "btn btn-primary shadow btn-xs sharp" || e.target.className === "fa fa-file-text") {
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
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.crossstreet}</td>
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
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.website}</td>
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
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.price_group.group}</td>
                                  }
                                  {column.id == "month Net Sold" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.month_net_sold}</td>
                                  }
                                  {column.id == "year Net Sold" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.year_net_sold}</td>
                                  }
                                  {column.id == "open Since" &&
                                    <td key={column.id} style={{ textAlign: "center" }}> <DateComponent date={element.opensince} /></td>
                                  }
                                  {column.id == "avg Closing Price" &&
                                    <td key={column.id} style={{ textAlign: "center" }}> <PriceComponent price={element.avg_closing_price} /></td>
                                  }
                                  {column.id == "permits This Year" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.permit_this_year}</td>
                                  }
                                  {column.id == "median Closing Price Since Open" &&
                                    <td key={column.id} style={{ textAlign: "center" }}> <PriceComponent price={element.median_closing_price_since_open} /></td>
                                  }
                                  {column.id == "median Closing Price This Year" &&
                                    <td key={column.id} style={{ textAlign: "center" }}><PriceComponent price={element.median_closing_price_this_year} /></td>
                                  }

                                  {column.id == "action" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>
                                      <div>
                                        <Link
                                          to={`/subdivisionUpdate/${element.id}?page=${currentPage}`}
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
                            <td colSpan="15" style={{ textAlign: "center" }}>
                              No data found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
      <SubdivisionOffcanvas
        canvasShowAdd={canvasShowAdd}
        seCanvasShowAdd={seCanvasShowAdd}
        Title="Add Subdivision"
        parentCallback={handleCallback}
      />
      <BulkSubdivisionUpdate
        canvasShowEdit={canvasShowEdit}
        seCanvasShowEdit={seCanvasShowEdit}
        Title={selectedLandSales?.length  === 1 ? "Edit Subdivision" : "Bulk Edit Subdivisions"}
        parentCallback={handleCallback}
        selectedLandSales={selectedLandSales}
        setSelectedLandSales={setSelectedLandSales}
      />

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Import Subdivision CSV Data</Modal.Title>
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
  {/* Sorting */ }
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
                    <div key={index} className="form-check d-flex align-items-center mb-2" style={{ width: '100%', height: "35px" }}>
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
      <Offcanvas
        show={showOffcanvas}
        onHide={setShowOffcanvas}
        className="offcanvas-end customeoff"
        placement="end"
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="modal-title" id="#gridSystemModal">
            Subdivision Details
            {!isFormLoading && <button
              className="btn btn-primary btn-sm me-1" 
              title="Report"
              style={{ marginLeft: "20px" }}
              onClick={() => handleDownloadReport()}
              key={subdivisionID}
            >
              {loadingReportId === subdivisionID ? (
                <div class="spinner-border spinner-border-sm" role="status" style={{ marginTop: "1px" }} />
              ) : (
                <div>
                  <i class="fa fa-file-text" aria-hidden="true" />&nbsp;
                  Report
                </div>
              )}
            </button>}
          </h5>
          
          
          <button
            type="button"
            className="btn-close"
            onClick={() => { setShowOffcanvas(false); clearSubdivisionDetails(); }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        {isFormLoading ? (
          <div className="d-flex justify-content-center align-items-center mt-5 mb-5">
            <ClipLoader color="#4474fc" />
          </div>
        ) : (
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
                      <Tab label="Closings" value="4" />
                      <Tab label="Land Sales" value="5" />
                      {/* <Tab label="Traffic & Sales" value="6" /> */}
                    </TabList>
                  </Box>
                  <TabPanel value="1" className="p-0">
                    <div className="d-flex">

                      <div style={{ width: "60%" }}>

                        <div style={{ marginTop: "10px" }}>
                          <span className="fw-bold fs-20">
                            {SubdivisionDetails.builder && SubdivisionDetails.builder.name !== undefined
                              ? SubdivisionDetails.builder.name
                              : "NA"}
                          </span><br />
                          <span className="fw-bold fs-30">
                            {SubdivisionDetails.name || "NA"}
                          </span><br />
                          <span className="fs-18">
                            {SubdivisionDetails.website || "NA"}
                          </span><br />

                          <label className="fs-18" style={{ marginTop: "10px" }}><b>PHONE:</b>&nbsp;<span>{SubdivisionDetails.phone || "NA"}</span></label><br />
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

                          <hr style={{ borderTop: "2px solid black", width: "80%", marginTop: "0px", marginBottom: "10px" }}></hr>

                          <div className="d-flex" style={{ marginTop: "5px" }}>
                            <div className="fs-18" style={{ width: "180px" }}><span><b>AREA:</b></span>&nbsp;<span>{SubdivisionDetails.area || "NA"}</span></div>
                            <div className="fs-18"><span><b>MASTER PLAN:</b></span>&nbsp;<span>{SubdivisionDetails.masterplan_id || "NA"}</span></div>
                          </div>
                          <label className="fs-18" style={{ marginTop: "5px" }}><b>ZIP CODE:</b>&nbsp;<span>{SubdivisionDetails.zipcode || "NA"}</span></label><br />
                          <label className="fs-18"><b>CROSS STREETS:</b>&nbsp;<span>{SubdivisionDetails.crossstreet || "NA"}</span></label><br />
                          <label className="fs-18"><b>JURISDICTION:</b>&nbsp;<span>{SubdivisionDetails.juridiction || "NA"}</span></label>
                          <div className="d-flex" style={{ marginTop: "0px" }}>
                            <div className="fs-18" style={{ width: "180px" }}><span><b>LATITUDE:</b></span>&nbsp;<span>{SubdivisionDetails.lat || "NA"}</span></div>
                            <div className="fs-18"><span><b>LONGITUDE:</b></span>&nbsp;<span>{SubdivisionDetails.lng || "NA"}</span></div>
                          </div>
                          <label className="fs-18" style={{ marginTop: "5px" }}><b>PARCEL:</b>&nbsp;<span>{SubdivisionDetails.parcel || "NA"}</span></label>

                          <hr style={{ borderTop: "2px solid black", width: "80%", marginTop: "0px", marginBottom: "10px" }}></hr>

                          <div className="d-flex" style={{ marginTop: "5px" }}>
                            <div className="fs-18" style={{ width: "180px" }}><span><b>TOTAL LOTS:</b></span>&nbsp;<span>{SubdivisionDetails.totallots || "NA"}</span></div>
                            <div className="fs-18"><span><b>TOTAL RELEASED:</b></span>&nbsp;<span>{SubdivisionDetails.latest_lots_released || "NA"}</span></div>
                          </div>
                          <div className="d-flex" style={{ marginTop: "5px" }}>
                            <div className="fs-18" style={{ width: "180px" }}><span><b>UNSOLD LOTS:</b></span>&nbsp;<span>{SubdivisionDetails.unsold_lots || "NA"}</span></div>
                            <div className="fs-18"><span><b>STANDING INVENTORY:</b></span>&nbsp;<span>{SubdivisionDetails.stadinginventory || "NA"}</span></div>
                          </div>
                          <div className="d-flex" style={{ marginTop: "5px" }}>
                            <div className="fs-18" style={{ width: "180px" }}><span><b>LOT WIDTH:</b></span>&nbsp;<span>{SubdivisionDetails.lotwidth || "NA"}</span></div>
                            <div className="fs-18"><span><b>LOT SIZE:</b></span>&nbsp;<span>{SubdivisionDetails.lotsize || "NA"}</span></div>
                          </div>

                          <hr style={{ borderTop: "2px solid black", width: "80%", marginTop: "5px", marginBottom: "10px" }}></hr>

                          <div className="d-flex" style={{ marginTop: "5px" }}>
                            <div className="fs-18" style={{ width: "180px" }}><span><b>HOA FEE:</b></span>&nbsp;<span>{SubdivisionDetails.hoafee || "NA"}</span></div>
                            <div className="fs-18"><span><b>MASTER PLAN FEE:</b></span>&nbsp;<span>{SubdivisionDetails.masterplanfee || "NA"}</span></div>
                          </div>
                          <label className="fs-18" style={{ marginTop: "5px", marginBottom: "5px" }}><b>GAS PROVIDER:</b>&nbsp;<span>{SubdivisionDetails.gasprovider || "NA"}</span></label><br />
                          <label className="fs-18"><b>ZONING:</b>&nbsp;<span>{SubdivisionDetails.zoning || "NA"}</span></label>

                        </div>
                      </div>

                      <div style={{ width: "40%" }}>

                        <div className="d-flex" style={{ marginTop: "10px" }}>
                          <div style={{ width: "50%" }}>
                            <label className="fs-20" style={{ marginBottom: "0px" }}><b>STATUS:</b></label>
                            <div>
                              <span className="" style={{ marginTop: "1px" }}>
                                {SubdivisionDetails.status === 1 && "Active"}
                                {SubdivisionDetails.status === 0 && "De-acitve"}
                                {SubdivisionDetails.status === 2 && "Future"}
                              </span>
                            </div>
                          </div>
                          <div>
                            <label className="fs-20" style={{ marginBottom: "0px" }}><b>REPORTING?:</b></label>
                            <div>
                              <span className="" style={{ marginTop: "1px" }}>
                                {SubdivisionDetails.reporting === 1 && "Yes"}
                                {SubdivisionDetails.reporting === 0 && "No"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="fs-20" style={{ marginBottom: "0px" }}><b>CURRENT AVG BASE ASKING $:</b></label>
                          <div >
                            <span className="">{<PriceComponent price={SubdivisionDetails.avg_base_price_active} /> || "NA"}</span>
                          </div>
                          <label className="fs-20"><b>CURRENT AVG SQFT:</b>&nbsp;<span style={{ fontSize: "16px" }}>{SubdivisionDetails.avg_sqft_active || "NA"}</span></label>
                        </div>

                        <div style={{ border: "1px solid black", marginTop: "10px" }}>
                          <div style={{ marginLeft: "5px" }}>
                            <label className="fs-20" style={{ marginBottom: "0px" }}><b>TOTAL SINCE OPEN:</b></label><br />
                            <label style={{ marginLeft: "15px" }}>NET SALES:&nbsp;{SubdivisionDetails.total_net_sales || "NA"}</label><br />
                            <label style={{ marginLeft: "15px" }}>PERMITS:&nbsp;{SubdivisionDetails.total_permits || "NA"}</label><br />
                            <label style={{ marginLeft: "15px" }}>CLOSINGS:&nbsp;{SubdivisionDetails.total_closings || "NA"}</label><br />
                            <label style={{ marginLeft: "15px" }}>NET SALES PER MO:&nbsp;{SubdivisionDetails.avg_net_sales_per_month_since_open || "NA"}</label><br />
                            <label style={{ marginLeft: "15px" }}>CLOSINGS PER MO:&nbsp;</label><br />
                            <label style={{ marginLeft: "15px" }}>MED. CLOSINGS $:&nbsp;{<PriceComponent price={SubdivisionDetails.median_closing_price_since_open} /> || "NA"}</label><br />

                            <label className="fs-20" style={{ marginBottom: "0px" }}><b>THIS YEAR:</b></label><br />
                            <label style={{ marginLeft: "15px" }}>NET SALES:&nbsp;{SubdivisionDetails.year_net_sold || "NA"}</label><br />
                            <label style={{ marginLeft: "15px" }}>PERMITS:&nbsp;{SubdivisionDetails.permit_this_year || "NA"}</label><br />
                            <label style={{ marginLeft: "15px" }}>CLOSINGS:&nbsp;</label><br />
                            <label style={{ marginLeft: "15px" }}>MED. CLOSINGS $:&nbsp;{<PriceComponent price={SubdivisionDetails.median_closing_price_this_year} /> || "NA"}</label><br />
                            <label style={{ marginLeft: "15px" }}>NET SALES PER MO:&nbsp;{SubdivisionDetails.avg_net_sales_per_month_this_year || "NA"}</label><br />
                            <label style={{ marginLeft: "15px" }}>CLOSINGS PER MO:&nbsp;{SubdivisionDetails.avg_closings_per_month_this_year || "NA"}</label><br />
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
                              className="table ItemsCheckboxSec dataTable no-footer subdivision-table-product mb-0"
                            >
                              <thead>
                                <tr style={{ textAlign: "center" }}>
                                  <th><strong>No.</strong></th>
                                  <th><strong>Name</strong></th>
                                  <th><strong>SqFt</strong></th>
                                  <th><strong>Stories</strong></th>
                                  <th><strong>Bedrooms</strong></th>
                                  <th><strong>Baths</strong></th>
                                  <th><strong>Garage</strong></th>
                                  <th><strong>Base Price</strong></th>
                                  <th><strong>$/Sqft</strong></th>
                                </tr>
                              </thead>
                              <tbody style={{ textAlign: "center" }}>
                                {SubdivisionDetails.products &&
                                  Array.isArray(SubdivisionDetails.products) &&
                                  SubdivisionDetails.products.length > 0 ? (
                                  SubdivisionDetails.products.map(
                                    (element, index) => (
                                      <tr
                                        onClick={() => handleProductRedirect(element.id, element.name)}
                                        key={element.id}
                                        style={{
                                          textAlign: "center",
                                          cursor: "pointer",
                                        }}
                                      >
                                        <td>{index + 1}</td>
                                        <td>{element.name}</td>
                                        <td>{element.sqft}</td>
                                        <td>{element.stories}</td>
                                        <td>{element.bedroom}</td>
                                        <td>{element.bathroom}</td>
                                        <td>{element.garage}</td>
                                        <td>{element.recentprice ? <PriceComponent price={element.recentprice} /> : ""}</td>
                                        <td>{element.current_price_per_sqft ? <PriceComponent price={element.current_price_per_sqft} /> : ""}</td>
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
                              className="table ItemsCheckboxSec dataTable no-footer subdivision-table-permit mb-0"
                            >
                              <thead>
                                <tr style={{ textAlign: "center" }}>
                                  <th>No.</th>
                                  <th>Date</th>
                                  <th>Address Number</th>
                                  <th>Address Name</th>
                                  <th>Parcel</th>
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
                                          handlePermitRedirect(element.id, element.date)
                                        }
                                        key={element.id}
                                        style={{
                                          textAlign: "center",
                                          cursor: "pointer",
                                        }}
                                      >
                                        <td>{index + 1}</td>
                                        <td>{<DateComponent date={element.date} />}</td>
                                        <td>{element.address2}</td>
                                        <td>{element.address1}</td>
                                        <td>{element.parcel}</td>
                                      </tr>
                                    )
                                  )
                                ) : (
                                  <tr>
                                    <td
                                      colSpan="5"
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
                              className="table ItemsCheckboxSec dataTable no-footer subdivision-table-closing mb-0"
                            >
                              <thead>
                                <tr style={{ textAlign: "center" }}>
                                  <th>No.</th>
                                  <th>Date</th>
                                  <th>Parcel</th>
                                  <th>Price</th>
                                  <th>Buyer</th>
                                  <th>Lender</th>
                                  <th>Loan Amt</th>
                                </tr>
                              </thead>
                              <tbody style={{ textAlign: "center" }}>
                                {SubdivisionDetails.get_closing &&
                                  Array.isArray(SubdivisionDetails.get_closing) &&
                                  SubdivisionDetails.get_closing.length > 0 ? (
                                  SubdivisionDetails.get_closing.map(
                                    (element, index) => (
                                      <tr
                                        onClick={() => handleClosingRedirect(element.id, element.closingdate)}
                                        key={element.id}
                                        style={{
                                          textAlign: "center",
                                          cursor: "pointer",
                                        }}
                                      >
                                        <td>{index + 1}</td>
                                        <td>{element.closingdate ? <DateComponent date={element.closingdate} /> : ""}</td>
                                        <td>{element.parcel}</td>
                                        <td>{element.closingprice ? <PriceComponent price={element.closingprice} /> : ""}</td>
                                        <td>{element.buyer}</td>
                                        <td>{element.lender}</td>
                                        <td>{element.loanamount ? <PriceComponent price={element.loanamount} /> : ""}</td>
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
                              className="table ItemsCheckboxSec dataTable no-footer subdivision-table-landsale mb-0"
                            >
                              <thead>
                                <tr style={{ textAlign: "center" }}>
                                  <th><strong>No.</strong></th>
                                  <th><strong>Date</strong></th>
                                  <th><strong>Parcel</strong></th>
                                  <th><strong>Price</strong></th>
                                  <th><strong>Size</strong></th>
                                  <th><strong>Size MS</strong></th>
                                  <th><strong>Price Per</strong></th>
                                </tr>
                              </thead>
                              <tbody style={{ textAlign: "center" }}>
                                {SubdivisionDetails.land_sales &&
                                  Array.isArray(SubdivisionDetails.land_sales) &&
                                  SubdivisionDetails.land_sales.length > 0 ? (
                                  SubdivisionDetails.land_sales.map(
                                    (element, index) => (
                                      <tr
                                        onClick={() => handleLandRedirect(element.id, element.date)}
                                        key={element.id}
                                        style={{
                                          textAlign: "center",
                                          cursor: "pointer",
                                        }}
                                      >
                                        <td>{index + 1}</td>
                                        <td>{element.date ? <DateComponent date={element.date} /> : ""}</td>
                                        <td>{element.parcel}</td>
                                        <td>{element.price ? <PriceComponent price={element.price} /> : ""}</td>
                                        <td>{element.noofunit}</td>
                                        <td>{element.typeofunit}</td>
                                        <td>{element.price_per ? <PriceComponent price={element.price_per} /> : ""}</td>
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
                  {/* <TabPanel value="6" className="p-0">
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
                                </tr>
                              </thead>
                              <tbody style={{ textAlign: "center" }}>
                                {SubdivisionDetails.trafic_sales &&
                                  Array.isArray(SubdivisionDetails.trafic_sales) &&
                                  SubdivisionDetails.trafic_sales.length > 0 ? (
                                  SubdivisionDetails.trafic_sales.map(
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
                  </TabPanel> */}
                </TabContext>
              </Box>
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
              Select Role:
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
                    <label className="form-label">STATUS:</label>
                    <MultiSelect
                      name="status"
                      options={statusOptions}
                      value={selectedStatus}
                      onChange={handleSelectStatusChange}
                      placeholder={"Select Status"}
                    />
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">REPORTING:</label>
                    <MultiSelect
                      name="reporting"
                      options={reportingOptions}
                      value={selectedReporting}
                      onChange={handleSelectReportingChange}
                      placeholder={"Select Reporting"}
                    />
                  </div>

                  <div className="col-md-3 mt-3">
                    <label className="form-label">BUILDER NAME:</label>
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
                    <label className="form-label">NAME:</label>
                    <Form.Group controlId="tournamentList">
                      <MultiSelect
                        name="name"
                        options={subdivisionListDropDown}
                        value={selectedSubdivisionName}
                        onChange={handleSelectSubdivisionNameChange}
                        placeholder={"Select Subdivision Name"}
                      />
                    </Form.Group>
                  </div>

                  <div className="col-md-3 mt-3">
                    <label htmlFor="exampleFormControlInput6" className="form-label">PRODUCT TYPE:</label>
                    <MultiSelect
                      name="product_type"
                      options={productTypeOptions}
                      value={productTypeStatus}
                      onChange={handleSelectProductTypeChange}
                      placeholder="Select Product Type"
                    />
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">AREA:</label>
                    <MultiSelect
                      name="area"
                      options={areaOption}
                      value={selectedArea}
                      onChange={handleSelectAreaChange}
                      placeholder="Select Area"
                    />
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">MASTER PLAN:</label>
                    <MultiSelect
                      name="masterplan_id"
                      options={masterPlanOption}
                      value={selectedMasterPlan}
                      onChange={handleSelectMasterPlanChange}
                      placeholder="Select Master Plan"
                    />
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">ZIP CODE:</label>
                    <Form.Group controlId="tournamentList">
                      <MultiSelect
                        name="zipcode"
                        options={zipCodeDropDown}
                        value={selectedZipCode}
                        onChange={handleSelectZipCodeChange}
                        placeholder={"Select ZipCode"}
                      />
                    </Form.Group>
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">LOT WIDTH:</label>
                    <input type="text" name="lotwidth" value={filterQuery.lotwidth} className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">LOT SIZE:</label>
                    <input type="text" value={filterQuery.lotsize} name="lotsize" className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-3">
                    <label htmlFor="exampleFormControlInput8" className="form-label">AGE RESTRICTED:</label>
                    <MultiSelect
                      name="age"
                      options={ageOptions}
                      value={selectedAge}
                      onChange={handleSelectAgeChange}
                      placeholder={"Select Age"}
                    />
                  </div>
                  <div className="col-md-3 mt-3 ">
                    <label htmlFor="exampleFormControlInput8" className="form-label">All SINGLE STORY:</label>
                    <MultiSelect
                      name="single"
                      options={singleOptions}
                      value={selectedSingle}
                      onChange={handleSelectSingleChange}
                      placeholder={"Select Single"}
                    />
                  </div>
                  <div className="col-md-3 mt-3 mb-3">
                    <label htmlFor="exampleFormControlInput28" className="form-label">GATED:</label>
                    <MultiSelect
                      name="gated"
                      options={gatedOptions}
                      value={selectedGated}
                      onChange={handleSelectGatedChange}
                      placeholder={"Select Gated"}
                    />
                  </div>
                  <div className="col-md-3 mt-3 mb-3">
                    <label className="form-label">JURISDICTION:</label>
                    <MultiSelect
                      name="juridiction"
                      options={jurisdictionOption}
                      value={selectedJurisdicition}
                      onChange={handleSelectJurisdictionChange}
                      placeholder="Select Juridiction"
                    />
                  </div>
                  <div className="col-md-3 mt-3 mb-3">
                    <label className="form-label">GAS PROVIDER:</label>
                    <MultiSelect
                      name="gasprovider"
                      options={gasProviderOption}
                      value={seletctedGasProvider}
                      onChange={handleGasProviderChange}
                      placeholder="Select Gas Provider"
                    />
                  </div>
                  <div className="d-flex flex-column mb-3" style={{ border: "1px solid #cccccc", borderRadius: "0.375rem", marginLeft: "12px", width: "50%" }}>
                    <label className="form-label" style={{ marginTop: "10px" }}>OPEN SINCE</label>
                    <hr style={{marginTop: "0px"}}/>
                    <div className="d-flex gap-4 col-md-11 mb-3" style={{ width: "100%" }}>
                      <div style={{ width: "100%" }}>
                        <label className="form-label">FROM:</label>
                        <DatePicker
                          name="from"
                          className="form-control"
                          selected={filterQuery.from ? parseDate(filterQuery.from) : null}
                          onChange={handleFilterDateFrom}
                          dateFormat="MM/dd/yyyy"
                          placeholderText="mm/dd/yyyy"
                        />
                      </div>
                      <div style={{ width: "100%" }}>
                        <label className="form-label">TO:</label>
                        <DatePicker
                          name="to"
                          className="form-control"
                          selected={filterQuery.to ? parseDate(filterQuery.to) : null}
                          onChange={handleFilterDateTo}
                          dateFormat="MM/dd/yyyy"
                          placeholderText="mm/dd/yyyy"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            &nbsp;
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
                    <div className="col-md-3 mt-3 mb-3">
                      <label className="form-label">MONTHS OPEN:</label>
                      <input style={{ marginTop: "20px" }} value={filterQueryCalculation.months_open} name="months_open" className="form-control" onChange={handleInputChange} />
                    </div>
                    <div className="col-md-3 mt-3 mb-3">
                      <label className="form-label">LATEST LOTS RELEASED:</label>
                      <input style={{ marginTop: "20px" }} value={filterQueryCalculation.latest_lots_released} name="latest_lots_released" className="form-control" onChange={handleInputChange} />
                    </div>
                    <div className="col-md-3 mt-3 mb-3">
                      <label className="form-label">LATEST STANDING INVENTORY:</label>
                      <input value={filterQueryCalculation.latest_standing_inventory} name="latest_standing_inventory" className="form-control" onChange={handleInputChange} />
                    </div>
                    <div className="col-md-3 mt-3 mb-3">
                      <label className="form-label">AVG SQFT ALL:</label>
                      <input style={{ marginTop: "20px" }} value={filterQueryCalculation.avg_sqft_all} name="avg_sqft_all" className="form-control" onChange={handleInputChange} />
                    </div>
                    <div className="col-md-3 mt-3 mb-3">
                      <label className="form-label">AVG SQFT ACTIVE:</label>
                      <input value={filterQueryCalculation.avg_sqft_active} name="avg_sqft_active" className="form-control" onChange={handleInputChange} />
                    </div>
                    <div className="col-md-3 mt-3 mb-3">
                      <label className="form-label">AVG BASE PRICE ALL:</label>
                      <input value={filterQueryCalculation.avg_base_price_all} name="avg_base_price_all" className="form-control" onChange={handleInputChange} />
                    </div>
                    <div className="col-md-3 mt-3 mb-3">
                      <label className="form-label">AVG BASE PRICE ACTIVE:</label>
                      <input value={filterQueryCalculation.avg_base_price_active} name="avg_base_price_active" className="form-control" onChange={handleInputChange} />
                    </div>
                    <div className="col-md-3 mt-3 mb-3">
                      <label className="form-label">MIN SQFT ALL:</label>
                      <input value={filterQueryCalculation.min_sqft_all} name="min_sqft_all" className="form-control" onChange={handleInputChange} />
                    </div>
                    <div className="col-md-3 mt-4 mb-3">
                      <label className="form-label">MIN SQFT ACTIVE:</label>
                      <input value={filterQueryCalculation.min_sqft_active} name="min_sqft_active" className="form-control" onChange={handleInputChange} />
                    </div>
                    <div className="col-md-3 mt-3 mb-3">
                      <label className="form-label">MAX SQFT ALL:</label>
                      <input value={filterQueryCalculation.max_sqft_all} name="max_sqft_all" className="form-control" onChange={handleInputChange} />
                    </div>
                    <div className="col-md-3 mt-3 mb-3">
                      <label className="form-label">MAX SQFT ACTIVE:</label>
                      <input value={filterQueryCalculation.max_sqft_active} name="max_sqft_active" className="form-control" onChange={handleInputChange} />
                    </div>
                    <div className="col-md-3 mt-3 mb-3">
                      <label className="form-label">MIN BASE PRICE ALL:</label>
                      <input value={filterQueryCalculation.min_base_price_all} name="min_base_price_all" className="form-control" onChange={handleInputChange} />
                    </div>
                    <div className="col-md-3 mt-3 mb-3">
                      <label className="form-label">MIN BASE PRICE ACTIVE:</label>
                      <input value={filterQueryCalculation.min_sqft_active_current} name="min_sqft_active_current" className="form-control" onChange={handleInputChange} />
                    </div>
                    <div className="col-md-3 mt-3 mb-3">
                      <label className="form-label">MAX BASE PRICE ALL:</label>
                      <input value={filterQueryCalculation.max_base_price_all} name="max_base_price_all" className="form-control" onChange={handleInputChange} />
                    </div>
                    <div className="col-md-3 mt-3 mb-3">
                      <label className="form-label">MAX BASE PRICE ACTIVE:</label>
                      <input value={filterQueryCalculation.max_sqft_active_current} name="max_sqft_active_current" className="form-control" onChange={handleInputChange} />
                    </div>
                    <div className="col-md-3 mt-3 mb-3">
                      <label className="form-label">AVG TRAFFIC PER MONTH THIS YEAR:</label>
                      <input value={filterQueryCalculation.avg_net_traffic_per_month_this_year} name="avg_net_traffic_per_month_this_year" className="form-control" onChange={handleInputChange} />
                    </div>
                    <div className="col-md-3 mt-3 mb-3">
                      <label className="form-label">AVG NET SALES PER MONTH THIS YEAR:</label>
                      <input value={filterQueryCalculation.avg_net_sales_per_month_this_year} name="avg_net_sales_per_month_this_year" className="form-control" onChange={handleInputChange} />
                    </div><div className="col-md-3 mt-3 mb-3">
                      <label className="form-label">AVG CLOSINGS PER MONTH THIS YEAR:</label>
                      <input value={filterQueryCalculation.avg_closings_per_month_this_year} name="avg_closings_per_month_this_year" className="form-control" onChange={handleInputChange} />
                    </div>
                    <div className="col-md-3 mt-3 mb-3">
                      <label className="form-label">AVG NET SALES PER MONTH SINCE OPEN:</label>
                      <input value={filterQueryCalculation.avg_net_sales_per_month_since_open} name="avg_net_sales_per_month_since_open" className="form-control" onChange={handleInputChange} />
                    </div>
                    <div className="col-md-3 mt-3 mb-3">
                      <label className="form-label">AVG NET SALES PER MONTH LAST 3 MONTH:</label>
                      <input value={filterQueryCalculation.avg_net_sales_per_month_last_three_months} name="avg_net_sales_per_month_last_three_months" className="form-control" onChange={handleInputChange} />
                    </div>
                    <div className="col-md-3 mt-3 mb-3">
                      <label className="form-label">MONTH NET SOLD:</label>
                      <input value={filterQueryCalculation.month_net_sold} name="month_net_sold" className="form-control" onChange={handleInputChange} />
                    </div>
                    <div className="col-md-3 mt-3 mb-3">
                      <label className="form-label">YEAR NET SOLD:</label>
                      <input value={filterQueryCalculation.year_net_sold} name="year_net_sold" className="form-control" onChange={handleInputChange} />
                    </div>
                  </div>
                </div></>}
          </div>
        </div>
      </Offcanvas>
      <Modal show={exportmodelshow} onHide={() => setExportModelShow(true)} size="xl">
        <Fragment>
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
              <Col lg={6}>
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
                  {exportColumns.slice(0, 32).map((col) => (
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
              </Col>

              <Col lg={6}>
                <ul className='list-unstyled'>
                  {exportColumns.slice(32, 64).map((col) => (
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
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <button varient="primary" class="btn btn-primary" disabled={excelDownload} onClick={handleDownloadExcel}>{excelDownload ? "Downloading..." : "Download"}</button>
          </Modal.Footer>
        </Fragment>
      </Modal>
    </Fragment>
  );
};

export default SubdivisionList;
