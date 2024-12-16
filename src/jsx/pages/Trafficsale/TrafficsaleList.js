import React, { useState, useEffect, useRef } from "react";
import AdminTrafficsaleService from "../../../API/Services/AdminService/AdminTrafficsaleService";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import TrafficsaleOffcanvas from "./TrafficsaleOffcanvas";
import MainPagetitle from "../../layouts/MainPagetitle";
import { Offcanvas, Form, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import ClipLoader from "react-spinners/ClipLoader";
import DateComponent from "../../components/date/DateFormat";
import AccessField from "../../components/AccssFieldComponent/AccessFiled";
import Modal from "react-bootstrap/Modal";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import ColumnReOrderPopup from "../../popup/ColumnReOrderPopup";
import BulkTrafficUpdate from "./BulkTrafficUpdate";
import AdminSubdevisionService from "../../../API/Services/AdminService/AdminSubdevisionService";
import AdminBuilderService from "../../../API/Services/AdminService/AdminBuilderService";
import { MultiSelect } from "react-multi-select-component";
import DatePicker from "react-datepicker";
import moment from 'moment';
import '../../pages/Subdivision/subdivisionList.css';

const TrafficsaleList = () => {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const [excelLoading, setExcelLoading] = useState(true);
  const [selectedFileError, setSelectedFileError] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [selectedArea, setSelectedArea] = useState([]);
  const [selectedMasterPlan, setSelectedMasterPlan] = useState([]);
  const [productTypeStatus, setProductTypeStatus] = useState([]);
  const [SubdivisionList, SetSubdivisionList] = useState([]);
  const [builderDropDown, setBuilderDropDown] = useState([]);
  const [selectedBuilderName, setSelectedBuilderName] = useState([]);
  const [selectedSubdivisionName, setSelectedSubdivisionName] = useState([]);
  const [selectedAge, setSelectedAge] = useState([]);
  const [selectedSingle, setSelectedSingle] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [selectedLandSales, setSelectedLandSales] = useState([]);
  const navigate = useNavigate();
  const [Error, setError] = useState("");
  const [trafficsaleList, setTrafficsaleList] = useState([]);
  const [trafficListCount, setTrafficListCount] = useState('');
  const [manageFilterOffcanvas, setManageFilterOffcanvas] = useState(false);
  const [searchQuery, setSearchQuery] = useState(localStorage.getItem("searchQueryByWeeklyTrafficFilter") ? JSON.parse(localStorage.getItem("searchQueryByWeeklyTrafficFilter")) : "");
  const [sortConfig, setSortConfig] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [AllTrafficListExport, setAllTrafficistExport] = useState([]);
  const [exportmodelshow, setExportModelShow] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPage = 100;
  const lastIndex = currentPage * recordsPage;
  const firstIndex = lastIndex - recordsPage;
  const [npage, setNpage] = useState(0);
  const number = [...Array(npage + 1).keys()].slice(1);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [TrafficDetails, setTrafficDetails] = useState({
    subdivision: "",
    weekending: "",
    weeklytraffic: "",
    grosssales: "",
    cancelations: "",
    netsales: "",
    lotreleased: "",
    unsoldinventory: "",
    status: "",
  });
  const [manageAccessOffcanvas, setManageAccessOffcanvas] = useState(false);
  const [accessList, setAccessList] = useState({});
  const [accessRole, setAccessRole] = useState("Admin");
  const [accessForm, setAccessForm] = useState({});
  const [role, setRole] = useState("Admin");
  const [checkedItems, setCheckedItems] = useState({});
  const fieldList = AccessField({ tableName: "traffic" });
  const [openDialog, setOpenDialog] = useState(false);
  const [columns, setColumns] = useState([]);
  const [draggedColumns, setDraggedColumns] = useState(columns);
  const [filter, setFilter] = useState(false);
  const [normalFilter, setNormalFilter] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState(false);
  const handlePopupClose = () => setShowPopup(false);
  const [filterQuery, setFilterQuery] = useState({
    from: localStorage.getItem("from_TrafficSale") ? JSON.parse(localStorage.getItem("from_TrafficSale")) : "",
    to: localStorage.getItem("to_TrafficSale") ? JSON.parse(localStorage.getItem("to_TrafficSale")) : "",
    builder_name: localStorage.getItem("builder_name_TrafficSale") ? JSON.parse(localStorage.getItem("builder_name_TrafficSale")) : "",
    subdivision_name: localStorage.getItem("subdivision_name_TrafficSale") ? JSON.parse(localStorage.getItem("subdivision_name_TrafficSale")) : "",
    weeklytraffic: localStorage.getItem("weeklytraffic_TrafficSale") ? JSON.parse(localStorage.getItem("weeklytraffic_TrafficSale")) : "",
    cancelations: localStorage.getItem("cancelations_TrafficSale") ? JSON.parse(localStorage.getItem("cancelations_TrafficSale")) : "",
    netsales: localStorage.getItem("netsales_TrafficSale") ? JSON.parse(localStorage.getItem("netsales_TrafficSale")) : "",
    totallots: localStorage.getItem("totallots_TrafficSale") ? JSON.parse(localStorage.getItem("totallots_TrafficSale")) : "",
    lotreleased: localStorage.getItem("lotreleased_TrafficSale") ? JSON.parse(localStorage.getItem("lotreleased_TrafficSale")) : "",
    unsoldinventory: localStorage.getItem("unsoldinventory_TrafficSale") ? JSON.parse(localStorage.getItem("unsoldinventory_TrafficSale")) : "",
    product_type: localStorage.getItem("product_type_TrafficSale") ? JSON.parse(localStorage.getItem("product_type_TrafficSale")) : "",
    area: localStorage.getItem("area_TrafficSale") ? JSON.parse(localStorage.getItem("area_TrafficSale")) : "",
    masterplan_id: localStorage.getItem("masterplan_id_TrafficSale") ? JSON.parse(localStorage.getItem("masterplan_id_TrafficSale")) : "",
    zipcode: localStorage.getItem("zipcode_TrafficSale") ? JSON.parse(localStorage.getItem("zipcode_TrafficSale")) : "",
    lotwidth: localStorage.getItem("lotwidth_TrafficSale") ? JSON.parse(localStorage.getItem("lotwidth_TrafficSale")) : "",
    lotsize: localStorage.getItem("lotsize_TrafficSale") ? JSON.parse(localStorage.getItem("lotsize_TrafficSale")) : "",
    zoning: localStorage.getItem("zoning_TrafficSale") ? JSON.parse(localStorage.getItem("zoning_TrafficSale")) : "",
    age: localStorage.getItem("age_TrafficSale") ? JSON.parse(localStorage.getItem("age_TrafficSale")) : "",
    single: localStorage.getItem("single_TrafficSale") ? JSON.parse(localStorage.getItem("single_TrafficSale")) : "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);

  const [weeklyTrafficOption, setWeeklyTrafficOption] = useState("");
  const [weeklyGrossSalesOption, setWeeklyGrossSalesOption] = useState("");
  const [weeklyCancellationsOption, setWeeklyCancellationsOption] = useState("");
  const [weeklyNetSalesOption, setWeeklyNetSalesOption] = useState("");
  const [totalLotsOption, setTotalLotsOption] = useState("");
  const [weeklyLotsReleaseForSaleOption, setWeeklyLotsReleaseForSaleOption] = useState("");
  const [weeklyUnsoldStandingInventoryOption, setWeeklyUnsoldStandingInventoryOption] = useState("");
  const [lotWidthOption, setLotWidthOption] = useState("");
  const [lotSizeOption, setLotSizeOption] = useState("");

  const [weeklyTrafficResult, setWeeklyTrafficResult] = useState(0);
  const [weeklyGrossSalesResult, setWeeklyGrossSalesResult] = useState(0);
  const [weeklyCancellationsResult, setWeeklyCancellationsResult] = useState(0);
  const [weeklyNetSalesResult, setWeeklyNetSalesResult] = useState(0);
  const [totalLotsResult, setTotalLotsResult] = useState(0);
  const [weeklyLotsReleaseForSaleResult, setWeeklyLotsReleaseForSaleResult] = useState(0);
  const [weeklyUnsoldStandingInventoryResult, setWeeklyUnsoldStandingInventoryResult] = useState(0);
  const [lotWidthResult, setLotWidthResult] = useState(0);
  const [lotSizeResult, setLotSizeResult] = useState(0);

  const handleSortingPopupClose = () => setShowSortingPopup(false);
  const [showSortingPopup, setShowSortingPopup] = useState(false);
  const [fieldOptions, setFieldOptions] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);
  const [selectionOrder, setSelectionOrder] = useState({});
  const [sortOrders, setSortOrders] = useState({});


  const SyestemUserRole = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).role
    : "";

  const handleSelectBuilderNameChange = (selectedItems) => {
    const selectedValues = selectedItems.map(item => item.value);
    setSelectedValues(selectedValues);
    setSelectedBuilderName(selectedItems);

    const selectedNames = selectedItems.map(item => item.label).join(', ');
    setFilterQuery(prevState => ({
      ...prevState,
      builder_name: selectedNames
    }));
    setNormalFilter(true);
  }

  const handleSelectSubdivisionNameChange = (selectedItems) => {
    const selectedValues = selectedItems.map(item => item.value);
    setSelectedValues(selectedValues);
    setSelectedSubdivisionName(selectedItems);

    const selectedNames = selectedItems.map(item => item.label).join(', ');
    setFilterQuery(prevState => ({
      ...prevState,
      subdivision_name: selectedNames
    }));
    setNormalFilter(true);
  }

  useEffect(() => {
    if(localStorage.getItem("selectedBuilderNameByFilter_TrafficSale")) {
      const selectedBuilderName = JSON.parse(localStorage.getItem("selectedBuilderNameByFilter_TrafficSale"));
      handleSelectBuilderNameChange(selectedBuilderName);
    }
    if(localStorage.getItem("selectedSubdivisionNameByFilter_TrafficSale")) {
      const selectedSubdivisionName = JSON.parse(localStorage.getItem("selectedSubdivisionNameByFilter_TrafficSale"));
      handleSelectSubdivisionNameChange(selectedSubdivisionName);
    }
    if(localStorage.getItem("productTypeStatusByFilter_TrafficSale")) {
      const productTypeStatus = JSON.parse(localStorage.getItem("productTypeStatusByFilter_TrafficSale"));
      handleSelectProductTypeChange(productTypeStatus);
    }
    if(localStorage.getItem("selectedAreaByFilter_TrafficSale")) {
      const selectedArea = JSON.parse(localStorage.getItem("selectedAreaByFilter_TrafficSale"));
      handleSelectAreaChange(selectedArea);
    }
    if(localStorage.getItem("selectedMasterPlanByFilter_TrafficSale")) {
      const selectedMasterPlan = JSON.parse(localStorage.getItem("selectedMasterPlanByFilter_TrafficSale"));
      handleSelectMasterPlanChange(selectedMasterPlan);
    }
    if(localStorage.getItem("selectedAgeByFilter_TrafficSale")) {
      const selectedAge = JSON.parse(localStorage.getItem("selectedAgeByFilter_TrafficSale"));
      handleSelectAgeChange(selectedAge);
    }
    if(localStorage.getItem("selectedSingleByFilter_TrafficSale")) {
      const selectedSingle = JSON.parse(localStorage.getItem("selectedSingleByFilter_TrafficSale"));
      handleSelectSingleChange(selectedSingle);
    }
}, []);

  useEffect(() => {
    setSearchQuery(filterString());
  }, [filterQuery]);

  useEffect(() => {
    if (localStorage.getItem("usertoken")) {
      gettrafficsaleList(currentPage, sortConfig, searchQuery);
    } else {
      navigate("/");
    }
  }, [currentPage]);

  const bulkTrafficsale = useRef();

  const handleEditCheckboxChange = (e, userId) => {
    if (e.target.checked) {
      setSelectedLandSales((prevSelectedUsers) => [...prevSelectedUsers, userId]);
    } else {
      setSelectedLandSales((prevSelectedUsers) => prevSelectedUsers.filter((id) => id !== userId));
    }
  };

  const HandlePopupDetailClick = (e) => {
    setShowPopup(true);
  };

  const HandleFilterForm = (e) => {
    if (filterQuery.from == "" || filterQuery.to == "") {
      setShowPopup(true);
      if(filterQuery.from == "" && filterQuery.to == "") {
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
        gettrafficsaleList(currentPage, sortConfig, searchQuery);
        setManageFilterOffcanvas(false);
        localStorage.setItem("selectedBuilderNameByFilter_TrafficSale", JSON.stringify(selectedBuilderName));
        localStorage.setItem("selectedSubdivisionNameByFilter_TrafficSale", JSON.stringify(selectedSubdivisionName));
        localStorage.setItem("productTypeStatusByFilter_TrafficSale", JSON.stringify(productTypeStatus));
        localStorage.setItem("selectedAreaByFilter_TrafficSale", JSON.stringify(selectedArea));
        localStorage.setItem("selectedMasterPlanByFilter_TrafficSale", JSON.stringify(selectedMasterPlan));
        localStorage.setItem("selectedAgeByFilter_TrafficSale", JSON.stringify(selectedAge));
        localStorage.setItem("selectedSingleByFilter_TrafficSale", JSON.stringify(selectedSingle));
        localStorage.setItem("from_TrafficSale", JSON.stringify(filterQuery.from));
        localStorage.setItem("to_TrafficSale", JSON.stringify(filterQuery.to));
        localStorage.setItem("builder_name_TrafficSale", JSON.stringify(filterQuery.builder_name));
        localStorage.setItem("subdivision_name_TrafficSale", JSON.stringify(filterQuery.subdivision_name));
        localStorage.setItem("weeklytraffic_TrafficSale", JSON.stringify(filterQuery.weeklytraffic));
        localStorage.setItem("cancelations_TrafficSale", JSON.stringify(filterQuery.cancelations));
        localStorage.setItem("netsales_TrafficSale", JSON.stringify(filterQuery.netsales));
        localStorage.setItem("totallots_TrafficSale", JSON.stringify(filterQuery.totallots));
        localStorage.setItem("lotreleased_TrafficSale", JSON.stringify(filterQuery.lotreleased));
        localStorage.setItem("unsoldinventory_TrafficSale", JSON.stringify(filterQuery.unsoldinventory));
        localStorage.setItem("product_type_TrafficSale", JSON.stringify(filterQuery.product_type));
        localStorage.setItem("area_TrafficSale", JSON.stringify(filterQuery.area));
        localStorage.setItem("masterplan_id_TrafficSale", JSON.stringify(filterQuery.masterplan_id));
        localStorage.setItem("zipcode_TrafficSale", JSON.stringify(filterQuery.zipcode));
        localStorage.setItem("lotwidth_TrafficSale", JSON.stringify(filterQuery.lotwidth));
        localStorage.setItem("lotsize_TrafficSale", JSON.stringify(filterQuery.lotsize));
        localStorage.setItem("zoning_TrafficSale", JSON.stringify(filterQuery.zoning));
        localStorage.setItem("age_TrafficSale", JSON.stringify(filterQuery.age));
        localStorage.setItem("single_TrafficSale", JSON.stringify(filterQuery.single));
        localStorage.setItem("searchQueryByWeeklyTrafficFilter", JSON.stringify(searchQuery));
      } else {
        setShowPopup(true);
        setMessage("Please select date between 366 days.");
        return;
      }
    }
  };

  const resetSelection = () => {
    setSelectAll(false);
    setSelectedColumns([]);
  };

  const clearTrafficDetails = () => {
    setTrafficDetails({
      subdivision: "",
      weekending: "",
      weeklytraffic: "",
      grosssales: "",
      cancelations: "",
      netsales: "",
      lotreleased: "",
      unsoldinventory: "",
      status: "",
    });
  };

  const checkFieldExist = (fieldName) => {
    return fieldList.includes(fieldName.trim());
  };

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
    console.log(selectedItems);
    const selectedValues = selectedItems.map(item => item.value).join(', ');
    console.log(selectedValues);
    setSelectedArea(selectedItems);
    setFilterQuery(prevState => ({
      ...prevState,
      area: selectedValues
    }));
    setNormalFilter(true);
  };

  const productTypeOptions = [
    { value: "DET", label: "DET" },
    { value: "ATT", label: "ATT" },
    { value: "HR", label: "HR" },
    { value: "AC", label: "AC" }
  ];

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
    console.log(selectedItems);
    const selectedValues = selectedItems.map(item => item.value).join(', ');
    console.log(selectedValues);
    setSelectedMasterPlan(selectedItems);
    setFilterQuery(prevState => ({
      ...prevState,
      masterplan_id: selectedValues
    }));
    setNormalFilter(true);
  };

  const headers = [
    { label: 'Week Ending', key: 'WeekEnding' },
    { label: 'Builder Name', key: 'BuilderName' },
    { label: 'Subdivision Name', key: 'SubdivisionName' },
    { label: 'Weekly Traffic', key: 'WeeklyTraffic' },
    { label: 'Weekly Gross Sales', key: 'WeeklyGrossSales' },
    { label: 'Weekly Cancellations', key: 'WeeklyCancellations' },
    { label: 'Weekly Net Sales', key: 'WeeklyNetSales' },
    { label: 'Total Lots', key: 'TotalLots' },
    { label: 'Weekly Lots Release For Sale', key: 'WeeklyLotsReleaseForSale' },
    { label: 'Weekly Unsold Standing Inventory', key: 'WeeklyUnsoldStandingInventory' },
    { label: 'Product Type', key: 'ProductType' },
    { label: 'Area', key: 'Area' },
    { label: 'Master Plan', key: 'MasterPlan' },
    { label: 'Zip Code', key: 'ZipCode' },
    { label: 'Lot Width', key: 'LotWidth' },
    { label: 'Lot Size', key: 'LotSize' },
    { label: 'Zoning', key: 'Zoning' },
    { label: 'Age Restricted', key: 'AgeRestricted' },
    { label: 'All Single Story', key: 'AllSingleStory' },
    { label: 'Pk Record id', key: 'pkRecordID' },
    { label: 'Fk Sub id', key: 'fkSubID' },

  ];

  const exportColumns = [
    { label: 'Week Ending', key: 'WeekEnding' },
    { label: 'Builder Name', key: 'BuilderName' },
    { label: 'Subdivision Name', key: 'SubdivisionName' },
    { label: 'Weekly Traffic', key: 'WeeklyTraffic' },
    { label: 'Weekly Gross Sales', key: 'WeeklyGrossSales' },
    { label: 'Weekly Cancellations', key: 'WeeklyCancellations' },
    { label: 'Weekly Net Sales', key: 'WeeklyNetSales' },
    { label: 'Total Lots', key: 'TotalLots' },
    { label: 'Weekly Lots Release For Sale', key: 'WeeklyLotsReleaseForSale' },
    { label: 'Weekly Unsold Standing Inventory', key: 'WeeklyUnsoldStandingInventory' },
    { label: 'Product Type', key: 'ProductType' },
    { label: 'Area', key: 'Area' },
    { label: 'Master Plan', key: 'MasterPlan' },
    { label: 'Zip Code', key: 'ZipCode' },
    { label: 'Lot Width', key: 'LotWidth' },
    { label: 'Lot Size', key: 'LotSize' },
    { label: 'Zoning', key: 'Zoning' },
    { label: 'Age Restricted', key: 'AgeRestricted' },
    { label: 'All Single Story', key: 'AllSingleStory' },
    { label: 'Pk Record id', key: 'pkRecordID' },
    { label: 'Fk Sub id', key: 'fkSubID' },
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
  console.log('trafficsaleList : ', trafficsaleList);

  const handleDownloadExcel = () => {
    setExportModelShow(false);
    setSelectedColumns("");

    let tableHeaders;
    if (selectedColumns.length > 0) {
      tableHeaders = selectedColumns;
    } else {
      tableHeaders = headers.map((c) => c.label);
    }

    const tableData = AllTrafficListExport.map((row) => {
      return tableHeaders.map((header) => {
        switch (header) {
          case "Week Ending":
            return row.weekending || '';
          case "Builder Name":
            return row.subdivision?.builder?.name || '';
          case "Subdivision Name":
            return row.subdivision?.name || '';
          case "Weekly Traffic":
            return row.weeklytraffic || '';
          case "Weekly Gross Sales":
            return row.grosssales || '';
          case "Weekly Cancellations":
            return row.cancelations || '';
          case "Weekly Net Sales":
            return row.netsales || '';
          case "Total Lots":
            return row.subdivision?.totallots || '';
          case "Weekly Lots Release For Sale":
            return row.lotreleased || '';
          case "Weekly Unsold Standing Inventory":
            return row.unsoldinventory || '';
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
          case "Pk Record id":
            return row.id || '';
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

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Weekly Traffic & Sales List');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'Weekly_Traffic_Sales_List.xlsx');

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
      table: "traffic",
    };
    try {
      const data = await AdminTrafficsaleService.manageAccessFields(
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
      const response = await AdminTrafficsaleService.accessField();
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
  };

  function changeCPage(id) {
    setCurrentPage(id);
  };

  function nextPage() {
    if (currentPage !== npage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const trafficsale = useRef();

  const stringifySortConfig = (sortConfig) => {
    return sortConfig.map((sort) => `${sort.key}:${sort.direction}`).join(",");
  };

  const gettrafficsaleList = async (currentPage, sortConfig, searchQuery) => {
    setIsLoading(true);
    setSearchQuery(searchQuery);
    localStorage.setItem("searchQueryByWeeklyTrafficFilter", JSON.stringify(searchQuery));
    try {
      let sortConfigString = "";
      if (sortConfig !== null) {
        sortConfigString = "&sortConfig=" + stringifySortConfig(sortConfig);
      }
      const response = await AdminTrafficsaleService.index(
        currentPage, 
        sortConfigString, 
        searchQuery
      );
      const responseData = await response.json();
      setIsLoading(false);
      setTrafficsaleList(responseData.data);
      setNpage(Math.ceil(responseData.total / recordsPage));
      setTrafficListCount(responseData.total);
      if(responseData.total > 100) {
        FetchAllPages(searchQuery, sortConfig, responseData.data, responseData.total);
      } else {
        setExcelLoading(false);
        setAllTrafficistExport(responseData.data);
      }
    } catch (error) {
      if (error.name === "HTTPError") {
        setIsLoading(false);
        const errorJson = await error.response.json();
        setError(errorJson.message);
      }
    }
  };

  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  const FetchAllPages = async (searchQuery, sortConfig, trafficsaleList, trafficListCount) => {
    setExcelLoading(true);
    // const response = await AdminTrafficsaleService.index(1, searchQuery, sortConfig ? `&sortConfig=${stringifySortConfig(sortConfig)}` : "");
    // const responseData = await response.json();
    const totalPages = Math.ceil(trafficListCount / recordsPage);
    let allData = trafficsaleList;
    for (let page = 2; page <= totalPages; page++) {
      // await delay(1000);
      const pageResponse = await AdminTrafficsaleService.index(page, searchQuery, sortConfig ? `&sortConfig=${stringifySortConfig(sortConfig)}` : "");
      const pageData = await pageResponse.json();
      allData = allData.concat(pageData.data);
    }
    setAllTrafficistExport(allData);
    setExcelLoading(false);
  };

  const handleDelete = async (e) => {
    try {
      let responseData = await AdminTrafficsaleService.destroy(e).json();
      if (responseData.status === true) {
        gettrafficsaleList(currentPage, sortConfig, searchQuery);
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
      let responseData = await AdminTrafficsaleService.bulkdestroy(id).json();
      if (responseData.status === true) {
        gettrafficsaleList(currentPage, sortConfig, searchQuery);
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
    gettrafficsaleList(currentPage, sortConfig, searchQuery);
  };

  const handleRowClick = async (id) => {
    setShowOffcanvas(true);
    setIsFormLoading(true);
    try {
      let responseData = await AdminTrafficsaleService.show(id).json();
      setTrafficDetails(responseData);
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
    setFilterQuery({
      from: "",
      to: "",
      builder_name: "",
      subdivision_name: "",
      weeklytraffic: "",
      cancelations: "",
      netsales: "",
      totallots: "",
      lotreleased: "",
      unsoldinventory: "",
      product_type: "",
      area: "",
      masterplan_id: "",
      zipcode: "",
      lotwidth: "",
      lotsize: "",
      zoning: "",
      age: "",
      single: "",
      grosssales: "",
    });
    setSelectedBuilderName([]);
    setSelectedSubdivisionName([]);
    setProductTypeStatus([]);
    setSelectedArea([]);
    setSelectedMasterPlan([]);
    setSelectedAge([]);
    setSelectedSingle([]);
    setManageFilterOffcanvas(false);
    gettrafficsaleList(1, sortConfig, "");
    localStorage.removeItem("selectedBuilderNameByFilter_TrafficSale");
    localStorage.removeItem("selectedSubdivisionNameByFilter_TrafficSale");
    localStorage.removeItem("productTypeStatusByFilter_TrafficSale");
    localStorage.removeItem("selectedAreaByFilter_TrafficSale");
    localStorage.removeItem("selectedMasterPlanByFilter_TrafficSale");
    localStorage.removeItem("selectedAgeByFilter_TrafficSale");
    localStorage.removeItem("selectedSingleByFilter_TrafficSale");
    localStorage.removeItem("from_TrafficSale");
    localStorage.removeItem("to_TrafficSale");
    localStorage.removeItem("builder_name_TrafficSale");
    localStorage.removeItem("subdivision_name_TrafficSale");
    localStorage.removeItem("weeklytraffic_TrafficSale");
    localStorage.removeItem("cancelations_TrafficSale");
    localStorage.removeItem("netsales_TrafficSale");
    localStorage.removeItem("totallots_TrafficSale");
    localStorage.removeItem("lotreleased_TrafficSale");
    localStorage.removeItem("unsoldinventory_TrafficSale");
    localStorage.removeItem("product_type_TrafficSale");
    localStorage.removeItem("area_TrafficSale");
    localStorage.removeItem("masterplan_id_TrafficSale");
    localStorage.removeItem("zipcode_TrafficSale");
    localStorage.removeItem("lotwidth_TrafficSale");
    localStorage.removeItem("lotsize_TrafficSale");
    localStorage.removeItem("zoning_TrafficSale");
    localStorage.removeItem("age_TrafficSale");
    localStorage.removeItem("single_TrafficSale");
    localStorage.removeItem("setTrafficFilter");
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
    const isAnyFilterApplied = Object.values(filterQuery).some(query => query !== "");

    if (AllTrafficListExport.length === 0) {
      setTrafficsaleList(trafficsaleList);
      return;
    }

    let filtered = AllTrafficListExport;

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

    filtered = applyNumberFilter(filtered, filterQuery.grosssales, 'grosssales');

    if (isAnyFilterApplied && !normalFilter) {
      setTrafficsaleList(filtered.slice(0, 100));
      setTrafficListCount(filtered.length);
      setNpage(Math.ceil(filtered.length / recordsPage));
      setFilter(false);
      setNormalFilter(false);
    } else {
      setTrafficsaleList(filtered.slice(0, 100));
      setTrafficListCount(filtered.length);
      setNpage(Math.ceil(filtered.length / recordsPage));
      setCurrentPage(1);
      setFilter(false);
      setNormalFilter(false);
    }
  };

  useEffect(() => {
    if (filter) {
      applyFilters();
    }
  }, [filterQuery]);

  const GetBuilderDropDownList = async () => {
    try {
        const response = await AdminBuilderService.builderDropDown();
        const responseData = await response.json();
        const formattedData = responseData.map((builder) => ({
            label: builder.name,
            value: builder.id,
        }));
        setBuilderDropDown(formattedData);
    } catch (error) {
        console.log("Error fetching builder list:", error);
        if (error.name === "HTTPError") {
            const errorJson = await error.response.json();
            console.log(errorJson);
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
        SetSubdivisionList(formattedData);
    } catch (error) {
        console.log("Error fetching subdivision list:", error);
        if (error.name === "HTTPError") {
            const errorJson = await error.response.json();
            setError(errorJson.message);
        }
    }
};

  useEffect(() => {
    GetBuilderDropDownList();
    GetSubdivisionDropDownList();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilterQuery(prevFilterQuery => ({
      ...prevFilterQuery,
      [name]: value
    }));
    setFilter(true);
  };

  const ageOptions = [
    { value: "1", label: "Yes" },
    { value: "0", label: "No" }
  ];

  const singleOptions = [
    { value: "1", label: "Yes" },
    { value: "0", label: "No" }
  ];

  const handleSelectAgeChange = (selectedItems) => {
    const selectedValues = selectedItems.map(item => item.value);
    setSelectedValues(selectedValues);
    setSelectedAge(selectedItems);

    const selectedNames = selectedItems.map(item => item.value).join(', ');
    setFilterQuery(prevState => ({
      ...prevState,
      age: selectedNames
    }));
    setNormalFilter(true);
  };

  const handleSelectSingleChange = (selectedItems) => {
    const selectedValues = selectedItems.map(item => item.value);
    setSelectedValues(selectedValues);
    setSelectedSingle(selectedItems);

    const selectedNames = selectedItems.map(item => item.value).join(', ');
    setFilterQuery(prevState => ({
      ...prevState,
      single: selectedNames
    }));
    setNormalFilter(true);
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
          let responseData = await AdminTrafficsaleService.import(inputData).json();
          setSelectedFile("");
          document.getElementById("fileInput").value = null;
          console.log(responseData);
          setLoading(false);
          if (responseData.failed_records > 0) {
            let message = responseData.message;
            const problematicRows = responseData.failed_records_details.map(detail => detail.row).join(', ');
            message += ' Problematic Record Rows: ' + problematicRows + '.';
            message += ' Record Imported: ' + responseData.successful_records;
            message += '. Failed Record Count: ' + responseData.failed_records;
            message += '. Last Row: ' + responseData.last_processed_row;
            setShow(false);
            swal(message).then((willDelete) => {
              if (willDelete) {
                gettrafficsaleList(currentPage, sortConfig, searchQuery);
              }
            });
          } else {
            if(responseData.message) {
              let message = responseData.message;
              setShow(false);
              swal(message).then((willDelete) => {
                if (willDelete) {
                  gettrafficsaleList(currentPage, sortConfig, searchQuery);
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

  const handleFilterDateFrom = (date) => {
    setNormalFilter(true);
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
    setNormalFilter(true);
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

  const totalSumFields = (field) => {
    if(field == "weeklytraffic") {
      return AllTrafficListExport.reduce((sum, traficSales) => {
        return sum + (traficSales.weeklytraffic || 0);
      }, 0);
    }
    if(field == "grosssales") {
      if(filter){
        return trafficsaleList.reduce((sum, traficSales) => {
          return sum + (traficSales.grosssales || 0);
        }, 0);
      } else {
        return AllTrafficListExport.reduce((sum, traficSales) => {
          return sum + (traficSales.grosssales || 0);
        }, 0);
      }
    }
    if(field == "cancelations") {
      return AllTrafficListExport.reduce((sum, traficSales) => {
        return sum + (traficSales.cancelations || 0);
      }, 0);
    }
    if(field == "netsales") {
      return AllTrafficListExport.reduce((sum, traficSales) => {
        return sum + (traficSales.netsales || 0);
      }, 0);
    }
    if(field == "totallots") {
      return AllTrafficListExport.reduce((sum, traficSales) => {
        return sum + (traficSales.subdivision && traficSales.subdivision.totallots || 0);
      }, 0);
    }
    if(field == "lotreleased") {
      return AllTrafficListExport.reduce((sum, traficSales) => {
        return sum + (traficSales.lotreleased || 0);
      }, 0);
    }
    if(field == "unsoldinventory") {
      return AllTrafficListExport.reduce((sum, traficSales) => {
        return sum + (traficSales.unsoldinventory || 0);
      }, 0);
    }
    if(field == "lotwidth") {
      return AllTrafficListExport.reduce((sum, traficSales) => {
        return sum + (traficSales.subdivision && traficSales.subdivision.lotwidth || 0);
      }, 0);
    }
    if(field == "lotsize") {
      return AllTrafficListExport.reduce((sum, traficSales) => {
        return sum + (traficSales.subdivision && traficSales.subdivision.lotsize || 0);
      }, 0);
    }
  };

  const averageFields = (field) => {
    const sum = totalSumFields(field);
    if(field == "grosssales") {
      if(filter){
        return sum / trafficsaleList.length;
      } else{
        return sum / AllTrafficListExport.length;
      }
    } else {
      const sum = totalSumFields(field);
      return sum / AllTrafficListExport.length;
    }
  };

  const handleSelectChange = (e, field) => {
    const value = e.target.value;

    switch (field) {
      case "weeklytraffic":
        setWeeklyTrafficOption(value);
        setWeeklyGrossSalesOption("");
        setWeeklyCancellationsOption("");
        setWeeklyNetSalesOption("");
        setTotalLotsOption("");
        setWeeklyLotsReleaseForSaleOption("");
        setWeeklyUnsoldStandingInventoryOption("");
        setLotWidthOption("");
        setLotSizeOption("");

        setWeeklyGrossSalesResult(0);
        setWeeklyCancellationsResult(0);
        setWeeklyNetSalesResult(0);
        setTotalLotsResult(0);
        setWeeklyLotsReleaseForSaleResult(0);
        setWeeklyUnsoldStandingInventoryResult(0);
        setLotWidthResult(0);
        setLotSizeResult(0);

        if (value === 'sum') {
          setWeeklyTrafficResult(totalSumFields(field));
        } else if (value === 'avg') {
          setWeeklyTrafficResult(averageFields(field));
        }
        break;

      case "grosssales":
        setWeeklyGrossSalesOption(value);
        setWeeklyTrafficOption("");
        setWeeklyCancellationsOption("");
        setWeeklyNetSalesOption("");
        setTotalLotsOption("");
        setWeeklyLotsReleaseForSaleOption("");
        setWeeklyUnsoldStandingInventoryOption("");
        setLotWidthOption("");
        setLotSizeOption("");

        setWeeklyTrafficResult(0);
        setWeeklyCancellationsResult(0);
        setWeeklyNetSalesResult(0);
        setTotalLotsResult(0);
        setWeeklyLotsReleaseForSaleResult(0);
        setWeeklyUnsoldStandingInventoryResult(0);
        setLotWidthResult(0);
        setLotSizeResult(0);
  
        if (value === 'sum') {
          setWeeklyGrossSalesResult(totalSumFields(field));
        } else if (value === 'avg') {
          setWeeklyGrossSalesResult(averageFields(field));
        }
        break;

      case "cancelations":
        setWeeklyCancellationsOption(value);
        setWeeklyTrafficOption("");
        setWeeklyGrossSalesOption("");
        setWeeklyNetSalesOption("");
        setTotalLotsOption("");
        setWeeklyLotsReleaseForSaleOption("");
        setWeeklyUnsoldStandingInventoryOption("");
        setLotWidthOption("");
        setLotSizeOption("");

        setWeeklyTrafficResult(0);
        setWeeklyGrossSalesResult(0);
        setWeeklyNetSalesResult(0);
        setTotalLotsResult(0);
        setWeeklyLotsReleaseForSaleResult(0);
        setWeeklyUnsoldStandingInventoryResult(0);
        setLotWidthResult(0);
        setLotSizeResult(0);
  
        if (value === 'sum') {
          setWeeklyCancellationsResult(totalSumFields(field));
        } else if (value === 'avg') {
          setWeeklyCancellationsResult(averageFields(field));
        }
        break;

      case "netsales":
        setWeeklyNetSalesOption(value);
        setWeeklyTrafficOption("");
        setWeeklyGrossSalesOption("");
        setWeeklyCancellationsOption("");
        setTotalLotsOption("");
        setWeeklyLotsReleaseForSaleOption("");
        setWeeklyUnsoldStandingInventoryOption("");
        setLotWidthOption("");
        setLotSizeOption("");

        setWeeklyTrafficResult(0);
        setWeeklyGrossSalesResult(0);
        setWeeklyCancellationsResult(0);
        setTotalLotsResult(0);
        setWeeklyLotsReleaseForSaleResult(0);
        setWeeklyUnsoldStandingInventoryResult(0);
        setLotWidthResult(0);
        setLotSizeResult(0);
  
        if (value === 'sum') {
          setWeeklyNetSalesResult(totalSumFields(field));
        } else if (value === 'avg') {
          setWeeklyNetSalesResult(averageFields(field));
        }
        break;

      case "totallots":
        setTotalLotsOption(value);
        setWeeklyTrafficOption("");
        setWeeklyGrossSalesOption("");
        setWeeklyCancellationsOption("");
        setWeeklyNetSalesOption("");
        setWeeklyLotsReleaseForSaleOption("");
        setWeeklyUnsoldStandingInventoryOption("");
        setLotWidthOption("");
        setLotSizeOption("");

        setWeeklyTrafficResult(0);
        setWeeklyGrossSalesResult(0);
        setWeeklyCancellationsResult(0);
        setWeeklyNetSalesResult(0);
        setWeeklyLotsReleaseForSaleResult(0);
        setWeeklyUnsoldStandingInventoryResult(0);
        setLotWidthResult(0);
        setLotSizeResult(0);
  
        if (value === 'sum') {
          setTotalLotsResult(totalSumFields(field));
        } else if (value === 'avg') {
          setTotalLotsResult(averageFields(field));
        }
        break;

      case "lotreleased":
        setWeeklyLotsReleaseForSaleOption(value);
        setWeeklyTrafficOption("");
        setWeeklyGrossSalesOption("");
        setWeeklyCancellationsOption("");
        setWeeklyNetSalesOption("");
        setTotalLotsOption("");
        setWeeklyUnsoldStandingInventoryOption("");
        setLotWidthOption("");
        setLotSizeOption("");

        setWeeklyTrafficResult(0);
        setWeeklyGrossSalesResult(0);
        setWeeklyCancellationsResult(0);
        setWeeklyNetSalesResult(0);
        setTotalLotsResult(0);
        setWeeklyUnsoldStandingInventoryResult(0);
        setLotWidthResult(0);
        setLotSizeResult(0);
  
        if (value === 'sum') {
          setWeeklyLotsReleaseForSaleResult(totalSumFields(field));
        } else if (value === 'avg') {
          setWeeklyLotsReleaseForSaleResult(averageFields(field));
        }
        break;

      case "unsoldinventory":
        setWeeklyUnsoldStandingInventoryOption(value);
        setWeeklyTrafficOption("");
        setWeeklyGrossSalesOption("");
        setWeeklyCancellationsOption("");
        setWeeklyNetSalesOption("");
        setTotalLotsOption("");
        setWeeklyLotsReleaseForSaleOption("");
        setLotWidthOption("");
        setLotSizeOption("");

        setWeeklyTrafficResult(0);
        setWeeklyGrossSalesResult(0);
        setWeeklyCancellationsResult(0);
        setWeeklyNetSalesResult(0);
        setTotalLotsResult(0);
        setWeeklyLotsReleaseForSaleResult(0);
        setLotWidthResult(0);
        setLotSizeResult(0);
  
        if (value === 'sum') {
          setWeeklyUnsoldStandingInventoryResult(totalSumFields(field));
        } else if (value === 'avg') {
          setWeeklyUnsoldStandingInventoryResult(averageFields(field));
        }
        break;

      case "lotwidth":
        setLotWidthOption(value);
        setWeeklyTrafficOption("");
        setWeeklyGrossSalesOption("");
        setWeeklyCancellationsOption("");
        setWeeklyNetSalesOption("");
        setTotalLotsOption("");
        setWeeklyLotsReleaseForSaleOption("");
        setWeeklyUnsoldStandingInventoryOption("");
        setLotSizeOption("");

        setWeeklyTrafficResult(0);
        setWeeklyGrossSalesResult(0);
        setWeeklyCancellationsResult(0);
        setWeeklyNetSalesResult(0);
        setTotalLotsResult(0);
        setWeeklyLotsReleaseForSaleResult(0);
        setWeeklyUnsoldStandingInventoryResult(0);
        setLotSizeResult(0);
  
        if (value === 'sum') {
          setLotWidthResult(totalSumFields(field));
        } else if (value === 'avg') {
          setLotWidthResult(averageFields(field));
        }
        break;

      case "lotsize":
        setLotSizeOption(value);
        setWeeklyTrafficOption("");
        setWeeklyGrossSalesOption("");
        setWeeklyCancellationsOption("");
        setWeeklyNetSalesOption("");
        setTotalLotsOption("");
        setWeeklyLotsReleaseForSaleOption("");
        setWeeklyUnsoldStandingInventoryOption("");
        setLotWidthOption("");

        setWeeklyTrafficResult(0);
        setWeeklyGrossSalesResult(0);
        setWeeklyCancellationsResult(0);
        setWeeklyNetSalesResult(0);
        setTotalLotsResult(0);
        setWeeklyLotsReleaseForSaleResult(0);
        setWeeklyUnsoldStandingInventoryResult(0);
        setLotWidthResult(0);
  
        if (value === 'sum') {
          setLotSizeResult(totalSumFields(field));
        } else if (value === 'avg') {
          setLotSizeResult(averageFields(field));
        }
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    const fieldOptions = fieldList
      .filter((field) => field !== 'Action')
      .map((field) => {
        let value = field.charAt(0).toLowerCase() + field.slice(1).replace(/\s+/g, '');

        if (value === 'weekEnding') {
          value = 'weekending';
        }
        if (value === 'weeklyTraffic') {
          value = 'weeklytraffic';
        }
        if (value === 'weeklyGrossSales') {
          value = 'grosssales';
        }
        if (value === 'weeklyCancellations') {
          value = 'cancelations';
        }
        if (value === 'weeklyNetSales') {
          value = 'netsales';
        }
        if (value === 'totalLots') {
          value = 'totallots';
        }
        if (value === 'weeklyLotsReleaseForSale') {
          value = 'lotreleased';
        }
        if (value === 'weeklyUnsoldStandingInventory') {
          value = 'unsoldinventory';
        }
        if (value === 'productType') {
          value = 'product_type';
        }
        if (value === 'area') {
          value = 'area';
        }
        if (value === 'masterPlan') {
          value = 'masterplan_id';
        }
        if (value === 'zipCode') {
          value = 'zipcode';
        }
        if (value === 'lotWidth') {
          value = 'lotwidth';
        }
        if (value === 'lotSize') {
          value = 'lotsize';
        }
        if (value === 'zoning') {
          value = 'zoning';
        }
        if (value === 'ageRestricted') {
          value = 'age';
        }
        if (value === 'allSingleStory') {
          value = 'single';
        }
        if (value === 'dateAdded') {
          value = 'created_at';
        }
        if (value === '__pkRecordID') {
          value = 'id';
        }
        if (value === '_fkSubID') {
          value = 'subdivision_code';
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
    gettrafficsaleList(currentPage, sortingConfig, searchQuery);
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
        mainTitle="Weekly Traffic & Sales"
        pageTitle="Weekly Traffic & Sales"
        parentTitle="Home"
      />
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-12">
            <div className="card">
              <div className="card-body p-0">
                <div className="table-responsive active-projects style-1 ItemsCheckboxSec shorting">
                  <div className="tbl-caption d-flex justify-content-between text-wrap align-items-center pb-3">
                    <div className="d-flex text-nowrap justify-content-between align-items-center">
                      <h4 className="heading mb-0">
                        Weekly Traffic & Sales List
                      </h4>
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
                        <div className="d-flex" style={{ marginTop: "10px" }}>
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
                        <button onClick={() => setExportModelShow(true)} className="btn btn-primary btn-sm me-1" title="Export .csv">
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
                      <div className="d-flex" style={{ marginTop: "10px" }}>
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
                        <button onClick={() => setExportModelShow(true)} className="btn btn-primary btn-sm me-1" title="Export .csv">
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
                          onClick={() => trafficsale.current.showEmployeModal()}
                        >
                          + Add Weekly Traffic & Sale
                        </Link>
                        <Link
                          to={"#"}
                          className="btn btn-primary btn-sm ms-1"
                          data-bs-toggle="offcanvas"
                          onClick={() => bulkTrafficsale.current.showEmployeModal()}
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
                      {trafficListCount} entries
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
                        className="table ItemsCheckboxSec dataTable no-footer mb-0 traffic-table"
                      >
                        <thead>
                          <tr style={{ textAlign: "center" }}>
                            {" "}
                            <th>
                              <input
                                type="checkbox"
                                style={{
                                  cursor: "pointer",
                                }}
                                checked={selectedLandSales.length === trafficsaleList.length}
                                onChange={(e) =>
                                  e.target.checked
                                    ? setSelectedLandSales(trafficsaleList.map((user) => user.id))
                                    : setSelectedLandSales([])
                                }
                              />
                            </th>
                            <th>No.</th>
                            {columns.map((column) => (
                              <th style={{ textAlign: "center", cursor: "pointer" }} key={column.id}>
                                <strong>
                                  {column.id == "weekly Lots Release For Sale" ? "Weekly Lots Released for Sale" : column.label}
                                  {column.id != "action" && sortConfig.some(
                                    (item) => item.key === (
                                      column.id == "week Ending" ? "weekending" :
                                      column.id == "weekly Traffic" ? "weeklytraffic" :
                                      column.id == "weekly Gross Sales" ? "grosssales" :
                                      column.id == "weekly Cancellations" ? "cancelations" :
                                      column.id == "weekly Net Sales" ? "netsales" :
                                      column.id == "total Lots" ? "totallots" :
                                      column.id == "weekly Lots Release For Sale" ? "lotreleased" :
                                      column.id == "weekly Unsold Standing Inventory" ? "unsoldinventory" :
                                      column.id == "product Type" ? "product_type" :
                                      column.id == "area" ? "area" :
                                      column.id == "master Plan" ? "masterplan_id" :
                                      column.id == "zip Code" ? "zipcode" :
                                      column.id == "lot Width" ? "lotwidth" :
                                      column.id == "lot Size" ? "lotsize" :
                                      column.id == "zoning" ? "zoning" :
                                      column.id == "age Restricted" ? "age" :
                                      column.id == "all Single Story" ? "single" :
                                      column.id == "date Added" ? "created_at" :
                                      column.id == "__pkRecordID" ? "id" :
                                      column.id == "_fkSubID" ? "subdivision_code" : toCamelCase(column.id))
                                  ) && (
                                    <span>
                                      {column.id != "action" && sortConfig.find(
                                        (item) => item.key === (column.id == "week Ending" ? "weekending" :
                                          column.id == "weekly Traffic" ? "weeklytraffic" :
                                          column.id == "weekly Gross Sales" ? "grosssales" :
                                          column.id == "weekly Cancellations" ? "cancelations" :
                                          column.id == "weekly Net Sales" ? "netsales" :
                                          column.id == "total Lots" ? "totallots" :
                                          column.id == "weekly Lots Release For Sale" ? "lotreleased" :
                                          column.id == "weekly Unsold Standing Inventory" ? "unsoldinventory" :
                                          column.id == "product Type" ? "product_type" :
                                          column.id == "area" ? "area" :
                                          column.id == "master Plan" ? "masterplan_id" :
                                          column.id == "zip Code" ? "zipcode" :
                                          column.id == "lot Width" ? "lotwidth" :
                                          column.id == "lot Size" ? "lotsize" :
                                          column.id == "zoning" ? "zoning" :
                                          column.id == "age Restricted" ? "age" :
                                          column.id == "all Single Story" ? "single" :
                                          column.id == "date Added" ? "created_at" :
                                          column.id == "__pkRecordID" ? "id" :
                                          column.id == "_fkSubID" ? "subdivision_code" : toCamelCase(column.id))
                                      ).direction === "asc" ? "↑" : "↓"}
                                    </span>
                                  )}
                                </strong>

                                {(!excelLoading) && (column.id !== "week Ending" && column.id !== "builder Name" && column.id !== "subdivision Name" && column.id !== "product Type" && 
                                  column.id !== "address Name" && column.id !== "parcel Number" && column.id !== "contractor" && column.id !== "owner" && 
                                  column.id !== "area" && column.id !== "master Plan" && column.id !== "zip Code" && column.id !== "zoning" && column.id !== "age Restricted" &&
                                  column.id !== "all Single Story" && column.id !== "date Added" && column.id !== "__pkRecordID" && column.id !== "_fkSubID" && column.id !== "action"
                                ) && 
                                  (
                                    <>
                                    <br />
                                      <select className="custom-select" 
                                        value={
                                          column.id == "weekly Traffic" ? weeklyTrafficOption : 
                                          column.id == "weekly Gross Sales" ? weeklyGrossSalesOption : 
                                          column.id == "weekly Cancellations" ? weeklyCancellationsOption : 
                                          column.id == "weekly Net Sales" ? weeklyNetSalesOption : 
                                          column.id == "total Lots" ? totalLotsOption : 
                                          column.id == "weekly Lots Release For Sale" ? weeklyLotsReleaseForSaleOption : 
                                          column.id == "weekly Unsold Standing Inventory" ? weeklyUnsoldStandingInventoryOption : 
                                          column.id == "lot Width" ? lotWidthOption : 
                                          column.id == "lot Size" ? lotSizeOption : ""
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
                                        
                                        onChange={(e) => column.id == "weekly Traffic" ? handleSelectChange(e, "weeklytraffic") :
                                          column.id == "weekly Gross Sales" ? handleSelectChange(e, "grosssales") :
                                          column.id == "weekly Cancellations" ? handleSelectChange(e, "cancelations") :
                                          column.id == "weekly Net Sales" ? handleSelectChange(e, "netsales") :
                                          column.id == "total Lots" ? handleSelectChange(e, "totallots") :
                                          column.id == "weekly Lots Release For Sale" ? handleSelectChange(e, "lotreleased") :
                                          column.id == "weekly Unsold Standing Inventory" ? handleSelectChange(e, "unsoldinventory") :
                                          column.id == "lot Width" ? handleSelectChange(e, "lotwidth") :
                                          column.id == "lot Size" ? handleSelectChange(e, "lotsize") : ""}
                                      >
                                        <option style={{color: "black", fontSize: "10px"}} value="" disabled>CALCULATION</option>
                                        <option style={{color: "black", fontSize: "10px"}} value="sum">Sum</option>
                                        <option style={{color: "black", fontSize: "10px"}} value="avg">Avg</option>
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
                                  {column.id == "week Ending" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "builder Name" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "subdivision Name" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "weekly Traffic" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{weeklyTrafficResult.toFixed(2)}</td>
                                  }
                                  {column.id == "weekly Gross Sales" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{weeklyGrossSalesResult.toFixed(2)}</td>
                                  }
                                  {column.id == "weekly Cancellations" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{weeklyCancellationsResult.toFixed(2)}</td>
                                  }
                                  {column.id == "weekly Net Sales" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{weeklyNetSalesResult.toFixed(2)}</td>
                                  }
                                  {column.id == "total Lots" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{totalLotsResult.toFixed(2)}</td>
                                  }
                                  {column.id == "weekly Lots Release For Sale" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{weeklyLotsReleaseForSaleResult.toFixed(2)}</td>
                                  }
                                  {column.id == "weekly Unsold Standing Inventory" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{weeklyUnsoldStandingInventoryResult.toFixed(2)}</td>
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
                                  {column.id == "date Added" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "__pkRecordID" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "_fkSubID" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "action" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                </>
                              ))}
                            </tr>
                          }
                          {trafficsaleList !== null && trafficsaleList.length > 0 ? (
                            trafficsaleList.map((element, index) => (
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
                                    {column.id == "week Ending" &&
                                      <td key={column.id} style={{ textAlign: "center" }}><DateComponent date={element.weekending} /></td>
                                    }
                                    {column.id == "builder Name" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.subdivision && element.subdivision.builder?.name}</td>
                                    }
                                    {column.id == "subdivision Name" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.subdivision && element.subdivision?.name}</td>
                                    }
                                    {column.id == "weekly Traffic" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.weeklytraffic}</td>
                                    }
                                    {column.id == "weekly Gross Sales" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.grosssales}</td>
                                    }
                                    {column.id == "weekly Cancellations" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.cancelations}</td>
                                    }
                                    {column.id == "weekly Net Sales" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.netsales}</td>
                                    }
                                    {column.id == "total Lots" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.subdivision.totallots}</td>
                                    }
                                    {column.id == "weekly Lots Release For Sale" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.lotreleased}</td>
                                    }
                                    {column.id == "weekly Unsold Standing Inventory" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.unsoldinventory}</td>
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
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.subdivision && element.subdivision?.lotwidth}</td>
                                    }
                                    {column.id == "lot Size" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.subdivision && element.subdivision?.lotsize}</td>
                                    }
                                    {column.id == "zoning" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.subdivision && element.subdivision?.zoning}</td>
                                    }
                                    {column.id == "age Restricted" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.subdivision &&
                                        element.subdivision.age === 1 &&
                                        "Yes"}
                                        {element.subdivision &&
                                          element.subdivision.age === 0 &&
                                          "No"}
                                      </td>
                                    }
                                    {column.id == "all Single Story" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.subdivision &&
                                        element.subdivision.single === 1 &&
                                        "Yes"}
                                        {element.subdivision &&
                                          element.subdivision.single === 0 &&
                                          "No"}
                                      </td>
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
                  <div className="d-sm-flex text-center justify-content-between align-items-center dataTables_wrapper no-footer">
                    <div className="dataTables_info">
                      Showing {lastIndex - recordsPage + 1} to {lastIndex} of{" "}
                      {trafficListCount} entries
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

      <TrafficsaleOffcanvas
        ref={trafficsale}
        Title="Add Weekly Traffic & Sale"
        parentCallback={handleCallback}
      />

      <BulkTrafficUpdate
        ref={bulkTrafficsale}
        Title="Bulk Edit Weekly Trafic sale"
        parentCallback={handleCallback}
        selectedLandSales={selectedLandSales}
      />

      <Offcanvas
        show={showOffcanvas}
        onHide={setShowOffcanvas}
        className="offcanvas-end customeoff"
        placement="end"
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="modal-title" id="#gridSystemModal">
            Weekly Traffic & Sales Details{" "}
          </h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => { setShowOffcanvas(false); clearTrafficDetails(); }}
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
              <div className="row">
                <div className="col-xl-4 mt-4">
                  <label className="">Subdivision:</label>
                  <div className="fw-bolder">
                    {TrafficDetails.subdivision !== null &&
                      TrafficDetails.subdivision.name !== undefined
                      ? TrafficDetails.subdivision.name
                      : "NA"}
                  </div>
                </div>

                <div className="col-xl-4 mt-4">
                  <label className="">Week Ending:</label>
                  <div>
                    <span className="fw-bold">
                      {<DateComponent date={TrafficDetails.weekending} /> || "NA"}
                    </span>
                  </div>
                </div>

                <div className="col-xl-4 mt-4">
                  <label className="">Weekly Traffic :</label>
                  <div>
                    <span className="fw-bold">
                      {TrafficDetails.weeklytraffic || "NA"}
                    </span>
                  </div>
                </div>

                <div className="col-xl-4 mt-4">
                  <label className="">Gross Sales :</label>
                  <div>
                    <span className="fw-bold">
                      {TrafficDetails.grosssales || "NA"}
                    </span>
                  </div>
                </div>

                <div className="col-xl-4 mt-4">
                  <label className="">Cancelations :</label>
                  <div>
                    <span className="fw-bold">
                      <span className="fw-bold">
                        {TrafficDetails.cancelations || "NA"}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="col-xl-4 mt-4">
                  <label className="">Net Sales :</label>
                  <div>
                    <span className="fw-bold">
                      {TrafficDetails.netsales || "NA"}
                    </span>
                  </div>
                </div>

                <div className="col-xl-4 mt-4">
                  <label className="">Lot Released :</label>
                  <div>
                    <span className="fw-bold">
                      {TrafficDetails.lotreleased || "NA"}
                    </span>
                  </div>
                </div>

                <div className="col-xl-4 mt-4">
                  <label className="">Status :</label>
                  <div>
                    <span className="fw-bold">
                      {TrafficDetails.status === 1 && "Active"}
                      {TrafficDetails.status === 0 && "De-acitve"}
                    </span>
                  </div>
                </div>
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
            Manage Weekly Traffic & Sales Fields Access{" "}
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
            Filter Weekly Traffic & Sales{" "}
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
                        options={builderDropDown}
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
                        options={SubdivisionList}
                        value={selectedSubdivisionName}
                        onChange={handleSelectSubdivisionNameChange}
                        placeholder={"Select Subdivision Name"}
                      />
                    </Form.Group>
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">
                      WEEKLY TRAFFIC :{" "}
                    </label>
                    <input value={filterQuery.weeklytraffic} name="weeklytraffic" className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">
                      WEEKLY CANCELLATIONS:{" "}
                    </label>
                    <input name="cancelations" value={filterQuery.cancelations} className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">
                      WEEKLY NET SALES:{" "}
                    </label>
                    <input name="netsales" value={filterQuery.netsales} className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">
                      TOTAL LOTS:{" "}
                    </label>
                    <input value={filterQuery.totallots} name="totallots" className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">
                      WEEKLY LOTS RELEASE FOR SALE:{" "}
                    </label>
                    <input value={filterQuery.lotreleased} name="lotreleased" className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">
                      WEEKLY UNSOLD STANDING INVENTORY:{" "}
                    </label>
                    <input type="unsoldinventory" value={filterQuery.unsoldinventory} name="unsoldinventory" className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-3 mb-3">
                    <label className="form-label">
                      PRODUCT TYPE:{" "}
                    </label>
                    <MultiSelect
                      name="product_type"
                      options={productTypeOptions}
                      value={productTypeStatus}
                      onChange={handleSelectProductTypeChange}
                      placeholder="Select Prodcut Type"
                    />
                  </div>
                  <div className="col-md-3 mt-3 mb-3">
                    <label className="form-label">
                      AREA:{" "}
                    </label>
                    <MultiSelect
                      name="area"
                      options={areaOption}
                      value={selectedArea}
                      onChange={handleSelectAreaChange}
                      placeholder="Select Area"
                    />
                  </div>
                  <div className="col-md-3 mt-3 mb-3">
                    <label className="form-label">
                      MASTERPLAN:{" "}
                    </label>
                    <MultiSelect
                      name="masterplan_id"
                      options={masterPlanOption}
                      value={selectedMasterPlan}
                      onChange={handleSelectMasterPlanChange}
                      placeholder="Select Area"
                    />
                  </div>
                  <div className="col-md-3 mt-3 mb-3">
                    <label className="form-label">
                      ZIP CODE:{" "}
                    </label>
                    <input 
                      type="text" 
                      name="zipcode" 
                      value={filterQuery.zipcode} 
                      className="form-control" 
                      onChange={HandleFilter} 
                      pattern="[0-9, ]*"
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9, ]/g, '');
                      }}
                    />
                  </div>
                  <div className="col-md-3 mt-3 mb-3">
                    <label className="form-label">
                      LOT WIDTH:{" "}
                    </label>
                    <input value={filterQuery.lotwidth} name="lotwidth" className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-3 mb-3">
                    <label className="form-label">
                      LOT SIZE:{" "}
                    </label>
                    <input value={filterQuery.lotsize} name="lotsize" className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-3 mb-3">
                    <label className="form-label">
                      ZONING:{" "}
                    </label>
                    <input value={filterQuery.zoning} name="zoning" className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-3 mb-3">
                    <label htmlFor="exampleFormControlInput8" className="form-label">AGE RESTRICTED:{" "}</label>
                    <MultiSelect
                      name="age"
                      options={ageOptions}
                      value={selectedAge}
                      onChange={handleSelectAgeChange}
                      placeholder={"Select Age"}
                    />
                  </div>
                  <div className="col-md-3 mt-3 mb-3">
                    <label htmlFor="exampleFormControlInput8" className="form-label">All SINGLE STORY:{" "}</label>
                    <MultiSelect
                      name="single"
                      options={singleOptions}
                      value={selectedSingle}
                      onChange={handleSelectSingleChange}
                      placeholder={"Select Single"}
                    />
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
            <br />
            {excelLoading ? <div style={{ textAlign: "center" }}><ClipLoader color="#4474fc" /></div> :
              <>
                <h5 className="">Calculation Filter Options</h5>
                <div className="border-top">
                  <div className="row">
                    <div className="col-md-3 mt-3 mb-3">
                      <label className="form-label">WEEKLY GROSS SALES:{" "}</label>
                      <input value={filterQuery.grosssales} name="grosssales" className="form-control" onChange={handleInputChange} />
                    </div>
                  </div>
                </div>
              </>
            }
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
                  const fieldOrder = selectionOrder[field.value];

                  return (
                    <div key={index} className="form-check d-flex align-items-center mb-2" style={{ width: '100%', height: "20px", marginTop: "20px" }}>
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
                        <label className="form-check-label mb-0" htmlFor={`field-checkbox-${index}`} style={{cursor: "pointer" , width: "150px"}}>
                          {isChecked && <span>{fieldOrder}. </span>}
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
          <Button variant="secondary" onClick={handleSortingPopupClose} style={{marginRight: "10px"}}>Close</Button>
          <Button variant="success" onClick={() => handleApplySorting(selectedFields, sortOrders)}>Apply</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Import Weekly Traffic & Sales CSV Data</Modal.Title>
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
    </>
  );
};

export default TrafficsaleList;
