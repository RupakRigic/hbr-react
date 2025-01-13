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
import ClipLoader from "react-spinners/ClipLoader";
import DateComponent from "../../components/date/DateFormat";
import AccessField from "../../components/AccssFieldComponent/AccessFiled";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import BulkPermitUpdate from "./BulkPermitUpdate";
import ColumnReOrderPopup from "../../popup/ColumnReOrderPopup";
import { MultiSelect } from "react-multi-select-component";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AdminSubdevisionService from "../../../API/Services/AdminService/AdminSubdevisionService";
import moment from 'moment';
import '../../pages/Subdivision/subdivisionList.css';
import Swal from "sweetalert2";

const PermitList = () => {
  const [excelLoading, setExcelLoading] = useState(true);
  const [SubdivisionList, SetSubdivisionList] = useState([]);
  const [builderDropDown, setBuilderDropDown] = useState([]);
  const [selectedBuilderName, setSelectedBuilderName] = useState([]);
  const [selectedSubdivisionName, setSelectedSubdivisionName] = useState([]);
  const [selectedAge, setSelectedAge] = useState([]);
  const [selectedSingle, setSelectedSingle] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [selectedArea, setSelectedArea] = useState([]);
  const [selectedMasterPlan, setSelectedMasterPlan] = useState([]);
  const [productTypeStatus, setProductTypeStatus] = useState([]);
  const [selectedLandSales, setSelectedLandSales] = useState([]);
  const [selectCheckBox, setSelectCheckBox] = useState(false);
  const [samePage, setSamePage] = useState(false);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [AllPermitListExport, setAllPermitListExport] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [Error, setError] = useState("");
  const [permitList, setPermitList] = useState([]);
  const [permitListCount, setPermitListCount] = useState("");
  const [manageFilterOffcanvas, setManageFilterOffcanvas] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState(false);
  const handlePopupClose = () => setShowPopup(false);
  const [filterQuery, setFilterQuery] = useState({
    from: localStorage.getItem("from_Permit") ? JSON.parse(localStorage.getItem("from_Permit")) : "",
    to: localStorage.getItem("to_Permit") ? JSON.parse(localStorage.getItem("to_Permit")) : "",
    builder_name: localStorage.getItem("builder_name_Permit") ? JSON.parse(localStorage.getItem("builder_name_Permit")) : "",
    subdivision_name: localStorage.getItem("subdivision_name_Permit") ? JSON.parse(localStorage.getItem("subdivision_name_Permit")) : "",
    address2: localStorage.getItem("address2_Permit") ? JSON.parse(localStorage.getItem("address2_Permit")) : "",
    address1: localStorage.getItem("address1_Permit") ? JSON.parse(localStorage.getItem("address1_Permit")) : "",
    parcel: localStorage.getItem("parcel_Permit") ? JSON.parse(localStorage.getItem("parcel_Permit")) : "",
    sqft: localStorage.getItem("sqft_Permit") ? JSON.parse(localStorage.getItem("sqft_Permit")) : "",
    lotnumber: localStorage.getItem("lotnumber_Permit") ? JSON.parse(localStorage.getItem("lotnumber_Permit")) : "",
    permitnumber: localStorage.getItem("permitnumber_Permit") ? JSON.parse(localStorage.getItem("permitnumber_Permit")) : "",
    plan: localStorage.getItem("plan_Permit") ? JSON.parse(localStorage.getItem("plan_Permit")) : "",
    product_type: localStorage.getItem("product_type_Permit") ? JSON.parse(localStorage.getItem("product_type_Permit")) : "",
    area: localStorage.getItem("area_Permit") ? JSON.parse(localStorage.getItem("area_Permit")) : "",
    masterplan_id: localStorage.getItem("masterplan_id_Permit") ? JSON.parse(localStorage.getItem("masterplan_id_Permit")) : "",
    zipcode: localStorage.getItem("zipcode_Permit") ? JSON.parse(localStorage.getItem("zipcode_Permit")) : "",
    lotwidth: localStorage.getItem("lotwidth_Permit") ? JSON.parse(localStorage.getItem("lotwidth_Permit")) : "",
    lotsize: localStorage.getItem("lotsize_Permit") ? JSON.parse(localStorage.getItem("lotsize_Permit")) : "",
    age: localStorage.getItem("age_Permit") ? JSON.parse(localStorage.getItem("age_Permit")) : "",
    single: localStorage.getItem("single_Permit") ? JSON.parse(localStorage.getItem("single_Permit")) : "",
  });
  const [searchQuery, setSearchQuery] = useState(localStorage.getItem("searchQueryByPermitsFilter") ? JSON.parse(localStorage.getItem("searchQueryByPermitsFilter")) : "");
  const [isLoading, setIsLoading] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [exportmodelshow, setExportModelShow] = useState(false);

  const [pageChange, setPageChange] = useState(false);
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

  const [squareFootageOption, setSquareFootageOption] = useState("");
  const [valueOption, setValueOption] = useState("");
  const [lotWidthOption, setLotWidthOption] = useState("");
  const [lotSizeOption, setLotSizeOption] = useState("");

  const [squareFootageResult, setSquareFootageResult] = useState(0);
  const [valueResult, setValueResult] = useState(0);
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

  const bulkPermit = useRef();

  const handleEditCheckboxChange = (e, userId) => {
    if (e.target.checked) {
      setSelectedLandSales((prevSelectedUsers) => [...prevSelectedUsers, userId]);
    } else {
      setSelectedLandSales((prevSelectedUsers) => prevSelectedUsers.filter((id) => id !== userId));
    }
  };

  const HandleCancelFilter = (e) => {
    setFilterQuery({
      from: "",
      to: "",
      date: "",
      builder_name: "",
      subdivision_name: "",
      address2: "",
      address1: "",
      parcel: "",
      sqft: "",
      lotnumber: "",
      permitnumber: "",
      plan: "",
      product_type: "",
      area: "",
      masterplan_id: "",
      zipcode: "",
      lotwidth: "",
      lotsize: "",
      age: "",
      single: ""
    });
    setSelectedBuilderName([]);
    setSelectedSubdivisionName([]);
    setProductTypeStatus([]);
    setSelectedArea([]);
    setSelectedMasterPlan([]);
    setSelectedAge([]);
    setSelectedSingle([]);
    setManageFilterOffcanvas(false);
    getPermitList(1, sortConfig, "");
    localStorage.removeItem("selectedBuilderNameByFilter_Permit");
    localStorage.removeItem("selectedSubdivisionNameByFilter_Permit");
    localStorage.removeItem("productTypeStatusByFilter_Permit");
    localStorage.removeItem("selectedAreaByFilter_Permit");
    localStorage.removeItem("selectedMasterPlanByFilter_Permit");
    localStorage.removeItem("selectedAgeByFilter_Permit");
    localStorage.removeItem("selectedSingleByFilter_Permit");
    localStorage.removeItem("from_Permit");
    localStorage.removeItem("to_Permit");
    localStorage.removeItem("builder_name_Permit");
    localStorage.removeItem("subdivision_name_Permit");
    localStorage.removeItem("address2_Permit");
    localStorage.removeItem("address1_Permit");
    localStorage.removeItem("parcel_Permit");
    localStorage.removeItem("sqft_Permit");
    localStorage.removeItem("lotnumber_Permit");
    localStorage.removeItem("permitnumber_Permit");
    localStorage.removeItem("plan_Permit");
    localStorage.removeItem("product_type_Permit");
    localStorage.removeItem("area_Permit");
    localStorage.removeItem("masterplan_id_Permit");
    localStorage.removeItem("zipcode_Permit");
    localStorage.removeItem("lotwidth_Permit");
    localStorage.removeItem("lotsize_Permit");
    localStorage.removeItem("age_Permit");
    localStorage.removeItem("single_Permit");
    localStorage.removeItem("setPermitFilter");
  };

  useEffect(() => {
    if (localStorage.getItem("selectedBuilderNameByFilter_Permit")) {
      const selectedBuilderName = JSON.parse(localStorage.getItem("selectedBuilderNameByFilter_Permit"));
      handleSelectBuilderNameChange(selectedBuilderName);
    }
    if (localStorage.getItem("selectedSubdivisionNameByFilter_Permit")) {
      const selectedSubdivisionName = JSON.parse(localStorage.getItem("selectedSubdivisionNameByFilter_Permit"));
      handleSelectSubdivisionNameChange(selectedSubdivisionName);
    }
    if (localStorage.getItem("productTypeStatusByFilter_Permit")) {
      const productTypeStatus = JSON.parse(localStorage.getItem("productTypeStatusByFilter_Permit"));
      handleSelectProductTypeChange(productTypeStatus);
    }
    if (localStorage.getItem("selectedAreaByFilter_Permit")) {
      const selectedArea = JSON.parse(localStorage.getItem("selectedAreaByFilter_Permit"));
      handleSelectAreaChange(selectedArea);
    }
    if (localStorage.getItem("selectedMasterPlanByFilter_Permit")) {
      const selectedMasterPlan = JSON.parse(localStorage.getItem("selectedMasterPlanByFilter_Permit"));
      handleSelectMasterPlanChange(selectedMasterPlan);
    }
    if (localStorage.getItem("selectedAgeByFilter_Permit")) {
      const selectedAge = JSON.parse(localStorage.getItem("selectedAgeByFilter_Permit"));
      handleSelectAgeChange(selectedAge);
    }
    if (localStorage.getItem("selectedSingleByFilter_Permit")) {
      const selectedSingle = JSON.parse(localStorage.getItem("selectedSingleByFilter_Permit"));
      handleSelectSingleChange(selectedSingle);
    }
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

  useEffect(() => {
    if (localStorage.getItem("usertoken")) {
      getPermitList(currentPage, sortConfig, searchQuery);
    } else {
      navigate("/");
    }
  }, [currentPage]);

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
        getPermitList(currentPage, sortConfig, searchQuery);
        setManageFilterOffcanvas(false);
        localStorage.setItem("selectedBuilderNameByFilter_Permit", JSON.stringify(selectedBuilderName));
        localStorage.setItem("selectedSubdivisionNameByFilter_Permit", JSON.stringify(selectedSubdivisionName));
        localStorage.setItem("productTypeStatusByFilter_Permit", JSON.stringify(productTypeStatus));
        localStorage.setItem("selectedAreaByFilter_Permit", JSON.stringify(selectedArea));
        localStorage.setItem("selectedMasterPlanByFilter_Permit", JSON.stringify(selectedMasterPlan));
        localStorage.setItem("selectedAgeByFilter_Permit", JSON.stringify(selectedAge));
        localStorage.setItem("selectedSingleByFilter_Permit", JSON.stringify(selectedSingle));
        localStorage.setItem("from_Permit", JSON.stringify(filterQuery.from));
        localStorage.setItem("to_Permit", JSON.stringify(filterQuery.to));
        localStorage.setItem("builder_name_Permit", JSON.stringify(filterQuery.builder_name));
        localStorage.setItem("subdivision_name_Permit", JSON.stringify(filterQuery.subdivision_name));
        localStorage.setItem("address2_Permit", JSON.stringify(filterQuery.address2));
        localStorage.setItem("address1_Permit", JSON.stringify(filterQuery.address1));
        localStorage.setItem("parcel_Permit", JSON.stringify(filterQuery.parcel));
        localStorage.setItem("sqft_Permit", JSON.stringify(filterQuery.sqft));
        localStorage.setItem("lotnumber_Permit", JSON.stringify(filterQuery.lotnumber));
        localStorage.setItem("permitnumber_Permit", JSON.stringify(filterQuery.permitnumber));
        localStorage.setItem("plan_Permit", JSON.stringify(filterQuery.plan));
        localStorage.setItem("product_type_Permit", JSON.stringify(filterQuery.product_type));
        localStorage.setItem("area_Permit", JSON.stringify(filterQuery.area));
        localStorage.setItem("masterplan_id_Permit", JSON.stringify(filterQuery.masterplan_id));
        localStorage.setItem("zipcode_Permit", JSON.stringify(filterQuery.zipcode));
        localStorage.setItem("lotwidth_Permit", JSON.stringify(filterQuery.lotwidth));
        localStorage.setItem("lotsize_Permit", JSON.stringify(filterQuery.lotsize));
        localStorage.setItem("age_Permit", JSON.stringify(filterQuery.age));
        localStorage.setItem("single_Permit", JSON.stringify(filterQuery.single));
        localStorage.setItem("searchQueryByPermitsFilter", JSON.stringify(searchQuery));
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

  const clearPermitDetails = () => {
    SetPermitDetails({
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
  };

  const checkFieldExist = (fieldName) => {
    return fieldList.includes(fieldName.trim());
  };

  const handleSelectBuilderNameChange = (selectedItems) => {
    const selectedValues = selectedItems.map(item => item.value);

    setSelectedValues(selectedValues);
    setSelectedBuilderName(selectedItems);

    const selectedNames = selectedItems.map(item => item.label).join(', ');
    setFilterQuery(prevState => ({
      ...prevState,
      builder_name: selectedNames
    }));
  }

  const handleSelectSubdivisionNameChange = (selectedItems) => {
    const selectedValues = selectedItems.map(item => item.value);
    const selectedNames = selectedItems.map(item => item.label).join(', ');

    setSelectedValues(selectedValues);
    setSelectedSubdivisionName(selectedItems);

    setFilterQuery(prevState => ({
      ...prevState,
      subdivision_name: selectedNames
    }));
  }

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

  const exportColumns = [
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
            return row.address2 || '';
          case "Address Name":
            return row.address1 || '';
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
      setPageChange(true);
      setCurrentPage(currentPage - 1);
    }
  };

  function changeCPage(id) {
    setCurrentPage(id);
    setPageChange(true);
  };

  function nextPage() {
    if (currentPage !== npage) {
      setPageChange(true);
      setCurrentPage(currentPage + 1);
    }
  };

  const permit = useRef();

  const stringifySortConfig = (sortConfig) => {
    return sortConfig.map((sort) => `${sort.key}:${sort.direction}`).join(",");
  };

  const getPermitList = async (currentPage, sortConfig, searchQuery) => {
    setIsLoading(true);
    setSearchQuery(searchQuery);
    localStorage.setItem("searchQueryByPermitsFilter", JSON.stringify(searchQuery));
    try {
      let sortConfigString = "";
      if (sortConfig !== null) {
        sortConfigString = "&sortConfig=" + stringifySortConfig(sortConfig);
      }
      const response = await AdminPermitService.index(
        currentPage,
        sortConfigString,
        searchQuery
      );
      const responseData = await response.json();
      setIsLoading(false);
      setPageChange(false);
      setPermitList(responseData.data);
      setNpage(Math.ceil(responseData.total / recordsPage));
      setPermitListCount(responseData.total);
      if (responseData.total > 100) {
        if(!pageChange){
          FetchAllPages(searchQuery, sortConfig, responseData.data, responseData.total);
        }
      } else {
        setExcelLoading(false);
        if(!pageChange){
          setAllPermitListExport(responseData.data);
        }
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

  const FetchAllPages = async (searchQuery, sortConfig, permitList, permitListCount) => {
    setExcelLoading(true);
    // const response = await AdminPermitService.index(1, searchQuery, sortConfig ? `&sortConfig=${stringifySortConfig(sortConfig)}` : "");
    // const responseData = await response.json();
    const totalPages = Math.ceil(permitListCount / recordsPage);
    let allData = permitList;
    for (let page = 2; page <= totalPages; page++) {
      // await delay(1000);
      const pageResponse = await AdminPermitService.index(page, searchQuery, sortConfig ? `&sortConfig=${stringifySortConfig(sortConfig)}` : "");
      const pageData = await pageResponse.json();
      allData = allData.concat(pageData.data);
    }
    setAllPermitListExport(allData);
    setExcelLoading(false);
  };

  const handleDelete = async (e) => {
    try {
      let responseData = await AdminPermitService.destroy(e).json();
      if (responseData.status === true) {
        getPermitList(currentPage, sortConfig, searchQuery);
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
      let responseData = await AdminPermitService.bulkdestroy(id).json();
      if (responseData.status === true) {
        getPermitList(currentPage, sortConfig, searchQuery);
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
    getPermitList(currentPage, sortConfig, searchQuery);
  };

  const handleFileChange = async (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUploadClick = async () => {
    if (selectedFile && selectedFile.type === "text/csv") {
      setLoading(true);
      const formData = new FormData();
      formData.append("csv", selectedFile);

      try {
        const response = await AdminPermitService.import(formData);

        if (response.status !== 200) {
          throw new Error('HTTPError');
        }

        setSelectedFile(null);
        document.getElementById("fileInput").value = null;
        setLoading(false);
        
        if (response.data.failed_records > 0) {
          let message = [];
          const problematicRows = response.data.failed_records_details.map(detail => detail.row).join(', ');
          const problematicRowsError = response.data.failed_records_details.map(detail => detail.error).join(', ');
          message += '\nRecord Imported: ' + response.data.successful_records;
          message += '\nFailed Record Count: ' + response.data.failed_records;
          message += '\nProblematic Record Rows: ' + problematicRows + '.';
          message += '\nErrors: ' + problematicRowsError + '.';
          message += '\nLast Row: ' + response.data.last_processed_row;
          setShow(false);
          swal({
            title: response.data.message,
            text: message,
          }).then((willDelete) => {
            if (willDelete) {
              getPermitList(currentPage, sortConfig, searchQuery);
            }
          });
        } else {
          if (response.data.message) {
            let message = [];
            const updatedRows = response.data.updated_records_details.map(detail => detail.row).join(', ');
            message += '\nUpdated Record Count: ' + response.data.updated_records_count;
            message += '\nUpdated Record Rows: ' + updatedRows + '.';
            setShow(false);
            swal({
              title: response.data.message,
              text: message,
            }).then((willDelete) => {
              if (willDelete) {
                getPermitList(currentPage, sortConfig, searchQuery);
              }
            });
          }
        }
      } catch (error) {
        let errorMessage = "An error occurred. Please try again.";
        if (error.response && error.response.data) {
          errorMessage = error.response.data.message;
        }
        setSelectedFile(null);
        setError(errorMessage);
        document.getElementById("fileInput").value = null;
        setLoading(false);
      }
    } else {
      setSelectedFile(null);
      setError("Please select a CSV file.");
    }
  };

  const handlBuilderClick = (e) => {
    setShow(true);
  };

  const handleRowClick = async (id) => {
    setShowOffcanvas(true);
    setIsFormLoading(true);
    try {
      let responseData = await AdminPermitService.show(id).json();
      SetPermitDetails(responseData);
      console.log(responseData);
      setIsFormLoading(false);
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
  };

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
        console.log(errorJson);
      }
    }
  };

  useEffect(() => {
    GetBuilderDropDownList();
    GetSubdivisionDropDownList();
  }, []);

  const addToBuilderList = () => {
    let subdivisionList = permitList.map((data) => data.subdivision)

    navigate('/google-map-locator', {
      state: {
        subdivisionList: subdivisionList,
        permits: true
      },
    });
  };

  const totalSumFields = (field) => {
    if (field == "sqft") {
      return AllPermitListExport.reduce((sum, permits) => {
        return sum + (permits.sqft || 0);
      }, 0);
    }
    if (field == "value") {
      return AllPermitListExport.reduce((sum, permits) => {
        return sum + (permits.value || 0);
      }, 0);
    }
    if (field == "lotwidth") {
      return AllPermitListExport.reduce((sum, permits) => {
        return sum + (permits.subdivision && permits.subdivision.lotwidth || 0);
      }, 0);
    }
    if (field == "lotsize") {
      return AllPermitListExport.reduce((sum, permits) => {
        return sum + (permits.subdivision && permits.subdivision.lotsize || 0);
      }, 0);
    }
  };

  const averageFields = (field) => {
    const sum = totalSumFields(field);
    return sum / AllPermitListExport.length;
  };

  const handleSelectChange = (e, field) => {
    const value = e.target.value;

    switch (field) {
      case "sqft":
        setSquareFootageOption(value);
        setValueOption("");
        setLotWidthOption("");
        setLotSizeOption("");

        setValueResult(0);
        setLotWidthResult(0);
        setLotSizeResult(0);

        if (value === 'sum') {
          setSquareFootageResult(totalSumFields(field));
        } else if (value === 'avg') {
          setSquareFootageResult(averageFields(field));
        }
        break;

      case "value":
        setValueOption(value);
        setSquareFootageOption("");
        setLotWidthOption("");
        setLotSizeOption("");

        setSquareFootageResult(0);
        setLotWidthResult(0);
        setLotSizeResult(0);

        if (value === 'sum') {
          setValueResult(totalSumFields(field));
        } else if (value === 'avg') {
          setValueResult(averageFields(field));
        }
        break;

      case "lotwidth":
        setLotWidthOption(value);
        setSquareFootageOption("");
        setValueOption("");
        setLotSizeOption("");

        setSquareFootageResult(0);
        setValueResult(0);
        setLotSizeResult(0);

        if (value === 'sum') {
          setLotWidthResult(totalSumFields(field));
        } else if (value === 'avg') {
          setLotWidthResult(averageFields(field));
        }
        break;

      case "lotsize":
        setLotSizeOption(value);
        setSquareFootageOption("");
        setValueOption("");
        setLotWidthOption("");

        setSquareFootageResult(0);
        setValueResult(0);
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

        if (value === 'addressNumber') {
          value = 'address2';
        }
        if (value === 'addressName') {
          value = 'address1';
        }
        if (value === 'parcelNumber') {
          value = 'parcel';
        }
        if (value === 'squreFootage') {
          value = 'sqft';
        }
        if (value === 'lotNumber') {
          value = 'lotnumber';
        }
        if (value === 'permitNumber') {
          value = 'permitnumber';
        }
        if (value === 'subLegalName') {
          value = 'sublegal_name';
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
        if (value === 'lotWidth') {
          value = 'lotwidth';
        }
        if (value === 'lotSize') {
          value = 'lotsize';
        }
        if (value === 'dateAdded') {
          value = 'created_at';
        }
        if (value === 'ageRestricted') {
          value = 'age';
        }
        if (value === 'allSingleStory') {
          value = 'single';
        }
        if (value === '__pkPermitID') {
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
    getPermitList(currentPage, sortingConfig, searchQuery);
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
            setSelectedLandSales(permitList.map((user) => user.id));
          } else if (selectedOption === "all") {
            setIsSelectAll(true);
            setSelectCheckBox(true);
            setSelectedLandSales(AllPermitListExport.map((user) => user.id));
          }
        }
      });
    } else {
      setSelectCheckBox(false);
      setSelectedLandSales([]);
    }
  };

  return (
    <>
      <MainPagetitle mainTitle="Permit" pageTitle="Permit" parentTitle="Home" />
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-12">
            <div className="card">
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
                              Columns Order
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
                          <button onClick={() => !excelLoading ? setExportModelShow(true) : ""} className="btn btn-primary btn-sm me-1" title="Export .csv">
                            {excelLoading ?
                              <div class="spinner-border spinner-border-sm" role="status" />
                              :
                              <div style={{ fontSize: "11px" }}>
                                <i class="fas fa-file-export" />&nbsp;
                                Export
                              </div>
                            }
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
                              Columns Order
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
                          <button onClick={() => !excelLoading ? setExportModelShow(true) : ""} className="btn btn-primary btn-sm me-1" title="Export .csv">
                            {excelLoading ?
                              <div class="spinner-border spinner-border-sm" role="status" />
                              :
                              <div style={{ fontSize: "11px" }}>
                                <i class="fas fa-file-export" />&nbsp;
                                Export
                              </div>
                            }
                          </button>
                          <button className="btn btn-success btn-sm me-1" onClick={() => setManageFilterOffcanvas(true)} title="Filter">
                            <div style={{ fontSize: "11px" }}>
                              <i className="fa fa-filter" />&nbsp;
                              Filter
                            </div>
                          </button>
                          <Button
                            className="btn btn-primary btn-sm me-1"
                            onClick={() => !excelLoading ? addToBuilderList : ""}
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
                            onClick={() => permit.current.showEmployeModal()}
                          >
                            <div style={{ fontSize: "11px" }}>
                              <i className="fa fa-plus" />&nbsp;
                              Add Permit
                            </div>
                          </Link>
                          <Link
                            to={"#"}
                            className="btn btn-primary btn-sm ms-1"
                            data-bs-toggle="offcanvas"
                            onClick={() => bulkPermit.current.showEmployeModal()}
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
                            }) : swal({
                              title: "No record selected.",
                              icon: "warning",
                              buttons: true,
                              dangerMode: true,
                            })}
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
                        className="table ItemsCheckboxSec dataTable no-footer mb-0 permit-table"
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
                              <strong>No.</strong>
                            </th>
                            {columns.map((column) => (
                              <th style={{ textAlign: "center", cursor: "pointer" }} key={column.id}>
                                <strong>
                                  {column.id == "squre Footage" ? "Square Footage" : column.label}
                                  {column.id != "action" && sortConfig.some(
                                    (item) => item.key === (
                                      column.id == "address Number" ? "address2" :
                                      column.id == "address Name" ? "address1" :
                                      column.id == "parcel Number" ? "parcel" :
                                      column.id == "squre Footage" ? "sqft" :
                                      column.id == "lot Number" ? "lotnumber" :
                                      column.id == "permit Number" ? "permitnumber" :
                                      column.id == "sub Legal Name" ? "sublegal_name" :
                                      column.id == "product Type" ? "product_type" :
                                      column.id == "master Plan" ? "masterplan_id" :
                                      column.id == "zip Code" ? "zipcode" :
                                      column.id == "lot Width" ? "lotwidth" :
                                      column.id == "lot Size" ? "lotsize" :
                                      column.id == "age Restricted" ? "age" :
                                      column.id == "all Single Story" ? "single" :
                                      column.id == "date Added" ? "created_at" :
                                      column.id == "__pkPermitID" ? "id" :
                                      column.id == "_fkSubID" ? "subdivision_code" : toCamelCase(column.id))
                                  ) && (
                                      <span>
                                        {column.id != "action" && sortConfig.find(
                                          (item) => item.key === (
                                            column.id == "address Number" ? "address2" :
                                            column.id == "address Name" ? "address1" :
                                            column.id == "parcel Number" ? "parcel" :
                                            column.id == "squre Footage" ? "sqft" :
                                            column.id == "lot Number" ? "lotnumber" :
                                            column.id == "permit Number" ? "permitnumber" :
                                            column.id == "sub Legal Name" ? "sublegal_name" :
                                            column.id == "product Type" ? "product_type" :
                                            column.id == "master Plan" ? "masterplan_id" :
                                            column.id == "zip Code" ? "zipcode" :
                                            column.id == "lot Width" ? "lotwidth" :
                                            column.id == "lot Size" ? "lotsize" :
                                            column.id == "age Restricted" ? "age" :
                                            column.id == "all Single Story" ? "single" :
                                            column.id == "date Added" ? "created_at" :
                                            column.id == "__pkPermitID" ? "id" :
                                            column.id == "_fkSubID" ? "subdivision_code" : toCamelCase(column.id))
                                        ).direction === "asc" ? "↑" : "↓"}
                                      </span>
                                    )}
                                </strong>

                                {(!excelLoading) && (column.id !== "date" && column.id !== "builder Name" && column.id !== "subdivision Name" && column.id !== "address Number" &&
                                  column.id !== "address Name" && column.id !== "parcel Number" && column.id !== "contractor" && column.id !== "owner" &&
                                  column.id !== "lot Number" && column.id !== "permit Number" && column.id !== "plan" && column.id !== "sub Legal Name" && column.id !== "product Type" &&
                                  column.id !== "area" && column.id !== "master Plan" && column.id !== "zip Code" && column.id !== "zoning" && column.id !== "age Restricted" &&
                                  column.id !== "all Single Story" && column.id !== "date Added" && column.id !== "__pkPermitID" && column.id !== "_fkSubID" && column.id !== "action"
                                ) &&
                                  (
                                    <>
                                      <br />
                                      <select className="custom-select"
                                        value={
                                          column.id == "squre Footage" ? squareFootageOption :
                                          column.id == "value" ? valueOption :
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

                                        onChange={(e) => column.id == "squre Footage" ? handleSelectChange(e, "sqft") :
                                          column.id == "value" ? handleSelectChange(e, "value") :
                                          column.id == "lot Width" ? handleSelectChange(e, "lotwidth") :
                                          column.id == "lot Size" ? handleSelectChange(e, "lotsize") : ""}
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
                                  {column.id == "date" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "builder Name" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "subdivision Name" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "address Number" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "address Name" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "parcel Number" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "contractor" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "squre Footage" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{squareFootageResult.toFixed(2)}</td>
                                  }
                                  {column.id == "owner" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "lot Number" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "permit Number" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "plan" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "sub Legal Name" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "value" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{valueResult.toFixed(2)}</td>
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
                                  {column.id == "__pkPermitID" &&
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
                          {permitList != null && permitList.length > 0 ? (
                            permitList.map((element, index) => (
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
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.address2}</td>
                                    }
                                    {column.id == "address Name" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.address1}</td>
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
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.sublegal_name}</td>
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
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.id}</td>
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
                          {isChecked && <span>{fieldOrder}. </span>}
                          {field.label == "Squre Footage" ? "Square Footage" : field.label}
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
            onClick={() => { setShowOffcanvas(false); clearPermitDetails(); }}
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
                <span className="fw-bold" style={{ fontSize: "22px" }}>
                  {PermitDetails?.subdivision?.builder?.name || "NA"}
                </span><br />
                <span className="fw-bold" style={{ fontSize: "40px" }}>
                  {PermitDetails.subdivision !== null && PermitDetails.subdivision.name !== undefined
                    ? PermitDetails?.subdivision?.name
                    : "NA"
                  }
                </span><br />
                <label className="" style={{ fontSize: "22px" }}><b>PRODUCT TYPE:</b>&nbsp;<span>{PermitDetails.subdivision?.product_type || "NA"}</span></label>

                <hr style={{ borderTop: "2px solid black", width: "60%", marginTop: "10px" }}></hr>

                <div className="d-flex" style={{ marginTop: "5px" }}>
                  <div className="fs-18" style={{ width: "180px" }}><span><b>AREA:</b></span>&nbsp;<span>{PermitDetails.subdivision?.area || "NA"}</span></div>
                  <div className="fs-18"><span><b>MASTER PLAN:</b></span>&nbsp;<span>{PermitDetails.subdivision?.masterplan_id || "NA"}</span></div>
                </div>
                <label className="fs-18" style={{ marginTop: "5px" }}><b>ZIP CODE:</b>&nbsp;<span>{PermitDetails.subdivision?.zipcode || "NA"}</span></label><br />
                <label className="fs-18"><b>CROSS STREETS:</b>&nbsp;<span>{PermitDetails.subdivision?.crossstreet || "NA"}</span></label><br />
                <label className="fs-18"><b>JURISDICTION:</b>&nbsp;<span>{PermitDetails.subdivision?.juridiction || "NA"}</span></label>

                <hr style={{ borderTop: "2px solid black", width: "60%", marginTop: "10px" }}></hr>

                <div className="d-flex" style={{ marginTop: "5px" }}>
                  <div className="fs-18" style={{ width: "300px" }}><span><b>PARCEL:</b></span>&nbsp;<span>{PermitDetails.parcel || "NA"}</span></div>
                  <div className="fs-18"><span><b>LOT NUMBER:</b></span>&nbsp;<span>{PermitDetails.lotnumber || "NA"}</span></div>
                </div>
                <div className="d-flex" style={{ marginTop: "5px" }}>
                  <div className="fs-18" style={{ width: "300px" }}><span><b>ADDRESS:</b></span>&nbsp;<span>{PermitDetails.address2 || "NA"} {PermitDetails.address1 || "NA"}</span></div>
                  <div className="fs-18"><span><b>SQFT:</b></span>&nbsp;<span>{PermitDetails.sqft || "NA"}</span></div>
                </div>
                <div className="d-flex" style={{ marginTop: "5px" }}>
                  <div className="fs-18" style={{ width: "300px" }}><span><b>DATE:</b></span>&nbsp;<span>{<DateComponent date={PermitDetails.date} /> || "NA"}</span></div>
                  <div className="fs-18"><span><b>VALUE:</b></span>&nbsp;<span>{PermitDetails.value || "NA"}</span></div>
                </div>
                <div className="d-flex" style={{ marginTop: "5px" }}>
                  <div className="fs-18" style={{ width: "300px" }}><span><b>CONTRACTOR:</b></span>&nbsp;<span>{PermitDetails.contractor || "NA"}</span></div>
                  <div className="fs-18"><span><b>PERMIT #:</b></span>&nbsp;<span>{PermitDetails.permitnumber || "NA"}</span></div>
                </div>

                <label className="fs-18"><b>OWNER:</b>&nbsp;<span>{PermitDetails.owner || "NA"}</span></label><br />
                <label className="fs-18"><b>DESCRIPTION:</b>&nbsp;<span>{PermitDetails.description || "NA"}</span></label>
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
                      ADDRESS NUMBER:{" "}
                    </label>
                    <input name="address2" value={filterQuery.address2} className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">
                      ADDRESS NAME:{" "}
                    </label>
                    <input name="address1" value={filterQuery.address1} className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">
                      PARCEL NUMBER:{" "}
                    </label>
                    <input value={filterQuery.parcel} name="parcel" className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">
                      SQUARE FOOTAGE:{" "}
                    </label>
                    <input type="text" value={filterQuery.sqft} name="sqft" className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">
                      LOT NUMBER:{" "}
                    </label>
                    <input value={filterQuery.lotnumber} name="lotnumber" className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">
                      PERMIT NUMBER:{" "}
                    </label>
                    <input value={filterQuery.permitnumber} name="permitnumber" className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-3 ">
                    <label className="form-label">
                      PLAN:{" "}
                    </label>
                    <input value={filterQuery.plan} name="plan" className="form-control" onChange={HandleFilter} />
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
    </>
  );
};

export default PermitList;
