import React, { useState, useEffect, useRef } from "react";
import AdminClosingService from "../../../API/Services/AdminService/AdminClosingService";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import ClosingOffcanvas from "./ClosingOffcanvas";
import MainPagetitle from "../../layouts/MainPagetitle";
import Button from "react-bootstrap/Button";
import { Offcanvas, Form, Row } from "react-bootstrap";
import ClipLoader from "react-spinners/ClipLoader";
import PriceComponent from "../../components/Price/PriceComponent";
import DateComponent from "../../components/date/DateFormat";
import AccessField from "../../components/AccssFieldComponent/AccessFiled";
import Modal from "react-bootstrap/Modal";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import ColumnReOrderPopup from "../../popup/ColumnReOrderPopup";
import BulkClosingUpdate from "./BulkClosingUpdate";
import AdminBuilderService from "../../../API/Services/AdminService/AdminBuilderService";
import AdminSubdevisionService from "../../../API/Services/AdminService/AdminSubdevisionService";
import { MultiSelect } from "react-multi-select-component";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import '../../pages/Subdivision/subdivisionList.css';

const ClosingList = () => {
  const [excelLoading, setExcelLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState([]);
  const [selectedArea, setSelectedArea] = useState([]);
  const [selectedMasterPlan, setSelectedMasterPlan] = useState([]);
  const [productTypeStatus, setProductTypeStatus] = useState([]);
  const [seletctedLender, setSelectedLender] = useState([]);
  const [seletctedClosingType, setSelectedClosingType] = useState([]);
  const [lenderList, setLenderList] = useState([]);
  const [AllClosingListExport, setAllClosingListExport] = useState([]);
  const [Error, setError] = useState("");
  const [ClosingList, setClosingList] = useState([]);
  const [closingListCount, setClosingListCount] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPage = 100;
  const lastIndex = currentPage * recordsPage;
  const firstIndex = lastIndex - recordsPage;
  const [npage, setNpage] = useState(0);
  const number = [...Array(npage + 1).keys()].slice(1);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [exportmodelshow, setExportModelShow] = useState(false)
  const [selectedFileError, setSelectedFileError] = useState("");
  const [show, setShow] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const [loading, setLoading] = useState(false);
  const handleClose = () => setShow(false);
  const navigate = useNavigate();
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [searchQuery, setSearchQuery] = useState(localStorage.getItem("searchQueryByClosingsFilter") ? JSON.parse(localStorage.getItem("searchQueryByClosingsFilter")) : "");
  const [manageFilterOffcanvas, setManageFilterOffcanvas] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState(false);
  const handlePopupClose = () => setShowPopup(false);
  const [filterQuery, setFilterQuery] = useState({
    from: localStorage.getItem("from_Closing") ? JSON.parse(localStorage.getItem("from_Closing")) : "",
    to: localStorage.getItem("to_Closing") ? JSON.parse(localStorage.getItem("to_Closing")) : "",
    closing_type: localStorage.getItem("closing_type_Closing") ? JSON.parse(localStorage.getItem("closing_type_Closing")) : "",
    document: localStorage.getItem("document_Closing") ? JSON.parse(localStorage.getItem("document_Closing")) : "",
    builder_name: localStorage.getItem("builder_name_Closing") ? JSON.parse(localStorage.getItem("builder_name_Closing")) : "",
    subdivision_name: localStorage.getItem("subdivision_name_Closing") ? JSON.parse(localStorage.getItem("subdivision_name_Closing")) : "",
    closingprice: localStorage.getItem("closingprice_Closing") ? JSON.parse(localStorage.getItem("closingprice_Closing")) : "",
    address: localStorage.getItem("address_Closing") ? JSON.parse(localStorage.getItem("address_Closing")) : "",
    parcel: localStorage.getItem("parcel_Closing") ? JSON.parse(localStorage.getItem("parcel_Closing")) : "",
    sellerleagal: localStorage.getItem("sellerleagal_Closing") ? JSON.parse(localStorage.getItem("sellerleagal_Closing")) : "",
    buyer: localStorage.getItem("buyer_Closing") ? JSON.parse(localStorage.getItem("buyer_Closing")) : "",
    lender_name: localStorage.getItem("lender_name_Closing") ? JSON.parse(localStorage.getItem("lender_name_Closing")) : "",
    loanamount: localStorage.getItem("loanamount_Closing") ? JSON.parse(localStorage.getItem("loanamount_Closing")) : "",
    product_type: localStorage.getItem("product_type_Closing") ? JSON.parse(localStorage.getItem("product_type_Closing")) : "",
    area: localStorage.getItem("area_Closing") ? JSON.parse(localStorage.getItem("area_Closing")) : "",
    masterplan_id: localStorage.getItem("masterplan_id_Closing") ? JSON.parse(localStorage.getItem("masterplan_id_Closing")) : "",
    zipcode: localStorage.getItem("zipcode_Closing") ? JSON.parse(localStorage.getItem("zipcode_Closing")) : "",
    lotwidth: localStorage.getItem("lotwidth_Closing") ? JSON.parse(localStorage.getItem("lotwidth_Closing")) : "",
    lotsize: localStorage.getItem("lotsize_Closing") ? JSON.parse(localStorage.getItem("lotsize_Closing")) : "",
    age: localStorage.getItem("age_Closing") ? JSON.parse(localStorage.getItem("age_Closing")) : "",
    single: localStorage.getItem("single_Closing") ? JSON.parse(localStorage.getItem("single_Closing")) : "",
  });
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
  const [draggedColumns, setDraggedColumns] = useState(columns);
  const [selectedLandSales, setSelectedLandSales] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [builderDropDown, setBuilderDropDown] = useState([]);
  const [SubdivisionList, SetSubdivisionList] = useState([]);
  const [selectedBuilderName, setSelectedBuilderName] = useState([]);
  const [selectedSubdivisionName, setSelectedSubdivisionName] = useState([]);
  const [selectedAge, setSelectedAge] = useState([]);
  const [selectedSingle, setSelectedSingle] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);

  const [closingPriceOption, setClosingPriceOption] = useState("");
  const [loanAmountOption, setLoanAmountOption] = useState("");
  const [lotWidthOption, setLotWidthOption] = useState("");
  const [lotSizeOption, setLotSizeOption] = useState("");

  const [closingPriceResult, setClosingPriceResult] = useState(0);
  const [loanAmountResult, setLoanAmountResult] = useState(0);
  const [lotWidthResult, setLotWidthResult] = useState(0);
  const [lotSizeResult, setLotSizeResult] = useState(0);

  const handleSortingPopupClose = () => setShowSortingPopup(false);
  const [showSortingPopup, setShowSortingPopup] = useState(false);
  const [fieldOptions, setFieldOptions] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);
  const [selectionOrder, setSelectionOrder] = useState({});
  const [sortOrders, setSortOrders] = useState({});

  useEffect(() => {
    if (localStorage.getItem("seletctedClosingTypeByFilter_Closing")) {
      const seletctedClosingType = JSON.parse(localStorage.getItem("seletctedClosingTypeByFilter_Closing"));
      handleSelectClosingTypeChange(seletctedClosingType);
    }
    if (localStorage.getItem("selectedBuilderNameByFilter_Closing")) {
      const selectedBuilderName = JSON.parse(localStorage.getItem("selectedBuilderNameByFilter_Closing"));
      handleSelectBuilderNameChange(selectedBuilderName);
    }
    if (localStorage.getItem("selectedSubdivisionNameByFilter_Closing")) {
      const selectedSubdivisionName = JSON.parse(localStorage.getItem("selectedSubdivisionNameByFilter_Closing"));
      handleSelectSubdivisionNameChange(selectedSubdivisionName);
    }
    if (localStorage.getItem("seletctedLenderByFilter_Closing")) {
      const seletctedLender = JSON.parse(localStorage.getItem("seletctedLenderByFilter_Closing"));
      handleSelectLenderChange(seletctedLender);
    }
    if (localStorage.getItem("productTypeStatusByFilter_Closing")) {
      const productTypeStatus = JSON.parse(localStorage.getItem("productTypeStatusByFilter_Closing"));
      handleSelectProductTypeChange(productTypeStatus);
    }
    if (localStorage.getItem("selectedAreaByFilter_Closing")) {
      const selectedArea = JSON.parse(localStorage.getItem("selectedAreaByFilter_Closing"));
      handleSelectAreaChange(selectedArea);
    }
    if (localStorage.getItem("selectedMasterPlanByFilter_Closing")) {
      const selectedMasterPlan = JSON.parse(localStorage.getItem("selectedMasterPlanByFilter_Closing"));
      handleSelectMasterPlanChange(selectedMasterPlan);
    }
    if (localStorage.getItem("selectedAgeByFilter_Closing")) {
      const selectedAge = JSON.parse(localStorage.getItem("selectedAgeByFilter_Closing"));
      handleSelectAgeChange(selectedAge);
    }
    if (localStorage.getItem("selectedSingleByFilter_Closing")) {
      const selectedSingle = JSON.parse(localStorage.getItem("selectedSingleByFilter_Closing"));
      handleSelectSingleChange(selectedSingle);
    }
  }, []);

  const SyestemUserRole = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).role : "";

  const resetSelection = () => {
    setSelectAll(false);
    setSelectedColumns([]);
  };

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
      getClosingList(currentPage, sortConfig, searchQuery);
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
        console.log(555);
        getClosingList(currentPage, sortConfig, searchQuery);
        setManageFilterOffcanvas(false);
        localStorage.setItem("seletctedClosingTypeByFilter_Closing", JSON.stringify(seletctedClosingType));
        localStorage.setItem("selectedBuilderNameByFilter_Closing", JSON.stringify(selectedBuilderName));
        localStorage.setItem("selectedSubdivisionNameByFilter_Closing", JSON.stringify(selectedSubdivisionName));
        localStorage.setItem("seletctedLenderByFilter_Closing", JSON.stringify(seletctedLender));
        localStorage.setItem("productTypeStatusByFilter_Closing", JSON.stringify(productTypeStatus));
        localStorage.setItem("selectedAreaByFilter_Closing", JSON.stringify(selectedArea));
        localStorage.setItem("selectedMasterPlanByFilter_Closing", JSON.stringify(selectedMasterPlan));
        localStorage.setItem("selectedAgeByFilter_Closing", JSON.stringify(selectedAge));
        localStorage.setItem("selectedSingleByFilter_Closing", JSON.stringify(selectedSingle));
        localStorage.setItem("from_Closing", JSON.stringify(filterQuery.from));
        localStorage.setItem("to_Closing", JSON.stringify(filterQuery.to));
        localStorage.setItem("closing_type_Closing", JSON.stringify(filterQuery.closing_type));
        localStorage.setItem("document_Closing", JSON.stringify(filterQuery.document));
        localStorage.setItem("builder_name_Closing", JSON.stringify(filterQuery.builder_name));
        localStorage.setItem("subdivision_name_Closing", JSON.stringify(filterQuery.subdivision_name));
        localStorage.setItem("closingprice_Closing", JSON.stringify(filterQuery.closingprice));
        localStorage.setItem("address_Closing", JSON.stringify(filterQuery.address));
        localStorage.setItem("parcel_Closing", JSON.stringify(filterQuery.parcel));
        localStorage.setItem("sellerleagal_Closing", JSON.stringify(filterQuery.sellerleagal));
        localStorage.setItem("buyer_Closing", JSON.stringify(filterQuery.buyer));
        localStorage.setItem("lender_name_Closing", JSON.stringify(filterQuery.lender_name));
        localStorage.setItem("loanamount_Closing", JSON.stringify(filterQuery.loanamount));
        localStorage.setItem("product_type_Closing", JSON.stringify(filterQuery.product_type));
        localStorage.setItem("area_Closing", JSON.stringify(filterQuery.area));
        localStorage.setItem("masterplan_id_Closing", JSON.stringify(filterQuery.masterplan_id));
        localStorage.setItem("zipcode_Closing", JSON.stringify(filterQuery.zipcode));
        localStorage.setItem("lotwidth_Closing", JSON.stringify(filterQuery.lotwidth));
        localStorage.setItem("lotsize_Closing", JSON.stringify(filterQuery.lotsize));
        localStorage.setItem("age_Closing", JSON.stringify(filterQuery.age));
        localStorage.setItem("single_Closing", JSON.stringify(filterQuery.single));
        localStorage.setItem("searchQueryByClosingsFilter", JSON.stringify(searchQuery));
      } else {
        setShowPopup(true);
        setMessage("Please select date between 366 days.");
        return;
      }
    }
  };

  const HandleCancelFilter = () => {
    setFilterQuery({
      closing_type: "",
      from: "",
      to: "",
      document: "",
      builder_name: "",
      subdivision_name: "",
      closingprice: "",
      address: "",
      parcel: "",
      sellerleagal: "",
      buyer: "",
      lender_name: "",
      loanamount: "",
      product_type: "",
      area: "",
      masterplan_id: "",
      zipcode: "",
      lotwidth: "",
      lotsize: "",
      age: "",
      single: ""
    });
    setSelectedClosingType([]);
    setSelectedBuilderName([]);
    setSelectedSubdivisionName([]);
    setSelectedLender([]);
    setProductTypeStatus([]);
    setSelectedArea([]);
    setSelectedMasterPlan([]);
    setSelectedAge([]);
    setSelectedSingle([]);
    setManageFilterOffcanvas(false);
    getClosingList(1, sortConfig, "");
    localStorage.removeItem("seletctedClosingTypeByFilter_Closing");
    localStorage.removeItem("selectedBuilderNameByFilter_Closing");
    localStorage.removeItem("selectedSubdivisionNameByFilter_Closing");
    localStorage.removeItem("seletctedLenderByFilter_Closing");
    localStorage.removeItem("productTypeStatusByFilter_Closing");
    localStorage.removeItem("selectedAreaByFilter_Closing");
    localStorage.removeItem("selectedMasterPlanByFilter_Closing");
    localStorage.removeItem("selectedAgeByFilter_Closing");
    localStorage.removeItem("selectedSingleByFilter_Closing");
    localStorage.removeItem("from_Closing");
    localStorage.removeItem("to_Closing");
    localStorage.removeItem("closing_type_Closing");
    localStorage.removeItem("document_Closing");
    localStorage.removeItem("builder_name_Closing");
    localStorage.removeItem("subdivision_name_Closing");
    localStorage.removeItem("closingprice_Closing");
    localStorage.removeItem("address_Closing");
    localStorage.removeItem("parcel_Closing");
    localStorage.removeItem("sellerleagal_Closing");
    localStorage.removeItem("buyer_Closing");
    localStorage.removeItem("lender_name_Closing");
    localStorage.removeItem("loanamount_Closing");
    localStorage.removeItem("product_type_Closing");
    localStorage.removeItem("area_Closing");
    localStorage.removeItem("masterplan_id_Closing");
    localStorage.removeItem("zipcode_Closing");
    localStorage.removeItem("lotwidth_Closing");
    localStorage.removeItem("lotsize_Closing");
    localStorage.removeItem("age_Closing");
    localStorage.removeItem("single_Closing");
    localStorage.removeItem("setClosingFilter");
  };

  const clearClosingDetails = () => {
    setClosingDetails({
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
  };

  const UpdateFromCcapn = async () => {
    try {
      const response = await AdminClosingService.ccapnUpdate({});
      const responseData = await response.json();
      console.log(responseData);
    } catch (error) {
      console.log(error);
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(errorJson.message);
      }
    }
  }

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

  const exportColumns = [
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

  const closingsale = useRef();

  const stringifySortConfig = (sortConfig) => {
    return sortConfig.map((sort) => `${sort.key}:${sort.direction}`).join(",");
  };

  const bulkClosing = useRef();

  const getClosingList = async (currentPage, sortConfig, searchQuery) => {
    setIsLoading(true);
    setSearchQuery(searchQuery);
    localStorage.setItem("searchQueryByClosingsFilter", JSON.stringify(searchQuery));
    try {
      let sortConfigString = "";
      if (sortConfig !== null) {
        sortConfigString = "&sortConfig=" + stringifySortConfig(sortConfig);
      }
      const response = await AdminClosingService.index(
        currentPage,
        sortConfigString,
        searchQuery
      );
      const responseData = await response.json();
      setIsLoading(false);
      setClosingList(responseData.data);
      setNpage(Math.ceil(responseData.total / recordsPage));
      setClosingListCount(responseData.total);
      if (responseData.total > 100) {
        FetchAllPages(searchQuery, sortConfig, responseData.data, responseData.total);
      } else {
        setExcelLoading(false);
        setAllClosingListExport(responseData.data);
      }
    } catch (error) {
      if (error.name === "HTTPError") {
        setIsLoading(false);
        const errorJson = await error.response.json();
        setError(errorJson.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  const FetchAllPages = async (searchQuery, sortConfig, ClosingList, closingListCount) => {
    setExcelLoading(true);
    // const response = await AdminClosingService.index(1, searchQuery, sortConfig ? `&sortConfig=${stringifySortConfig(sortConfig)}` : "");
    // const responseData = await response.json();
    const totalPages = Math.ceil(closingListCount / recordsPage);
    let allData = ClosingList;
    for (let page = 2; page <= totalPages; page++) {
      // await delay(1000);
      const pageResponse = await AdminClosingService.index(page, searchQuery, sortConfig ? `&sortConfig=${stringifySortConfig(sortConfig)}` : "");
      const pageData = await pageResponse.json();
      allData = allData.concat(pageData.data);
    }
    setAllClosingListExport(allData);
    setExcelLoading(false);
  }

  const handleDelete = async (e) => {
    try {
      let responseData = await AdminClosingService.destroy(e).json();
      if (responseData.status === true) {
        getClosingList(currentPage, sortConfig, searchQuery);
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
      let responseData = await AdminClosingService.bulkdestroy(id).json();
      if (responseData.status === true) {
        getClosingList(currentPage, sortConfig, searchQuery);
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
          console.log(responseData);
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
                getClosingList(currentPage, sortConfig, searchQuery);
              }
            });
          } else {
            if (responseData.message) {
              let message = responseData.message;
              setShow(false);
              swal(message).then((willDelete) => {
                if (willDelete) {
                  getClosingList(currentPage, sortConfig, searchQuery);
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

  const handleCallback = () => {
    // Update the name in the component's state
    getClosingList(currentPage, sortConfig, searchQuery);
  };


  const handleRowClick = async (id) => {
    setShowOffcanvas(true);
    setIsFormLoading(true);
    try {
      let responseData = await AdminClosingService.show(id).json();
      setClosingDetails(responseData);
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
        setError(errorJson.message);
      }
    }
  };

  const GetLenderList = async () => {
    try {
      let response = await AdminClosingService.lender()
      let responseData = await response.json()
      const formattedData = responseData.map((lender) => ({
        label: lender.lender,
        value: lender.lender,
      }));
      setLenderList(formattedData)
    } catch (error) {
      if (error.name === 'HTTPError') {
        const errorJson = await error.response.json();
        console.log(errorJson.message);
      }
    }
  };

  useEffect(() => {
    GetBuilderDropDownList();
    GetSubdivisionDropDownList();
    GetLenderList();
  }, []);

  const ageOptions = [
    { value: "1", label: "Yes" },
    { value: "0", label: "No" }
  ];

  const singleOptions = [
    { value: "1", label: "Yes" },
    { value: "0", label: "No" }
  ];

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
    setSelectedValues(selectedValues);
    setSelectedSubdivisionName(selectedItems);
    const selectedNames = selectedItems.map(item => item.label).join(', ');
    setFilterQuery(prevState => ({
      ...prevState,
      subdivision_name: selectedNames
    }));
  }

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
    console.log(selectedItems);
    const selectedValues = selectedItems.map(item => item.value).join(', ');
    console.log(selectedValues);
    setSelectedMasterPlan(selectedItems);
    setFilterQuery(prevState => ({
      ...prevState,
      masterplan_id: selectedValues
    }));
  };

  const handleSelectLenderChange = (selectedItems) => {
    console.log(selectedItems);
    const selectedValues = selectedItems.map(item => item.value).join(', ');
    console.log(selectedValues);
    setSelectedLender(selectedItems);
    setFilterQuery(prevState => ({
      ...prevState,
      lender: selectedValues
    }));
  };

  const closingType = [
    { value: "NEW", label: "NEW" },
    { value: "RESALES", label: "RESALES" },
  ];

  const handleSelectClosingTypeChange = (selectedItems) => {
    const selectedValues = selectedItems.map(item => item.value);
    setSelectedValues(selectedValues);
    setSelectedClosingType(selectedItems);
    const selectedNames = selectedItems.map(item => item.label).join(', ');
    setFilterQuery(prevState => ({
      ...prevState,
      closing_type: selectedNames
    }));
  };

  const addToBuilderList = () => {
    let subdivisionList = ClosingList.map((data) => data.subdivision)

    navigate('/google-map-locator', {
      state: {
        subdivisionList: subdivisionList,
        closings: true
      },
    });
  };

  const totalSumFields = (field) => {
    if (field == "closingprice") {
      return AllClosingListExport.reduce((sum, closings) => {
        return sum + (closings.closingprice || 0);
      }, 0);
    }
    if (field == "loanamount") {
      return AllClosingListExport.reduce((sum, closings) => {
        return sum + (closings.loanamount || 0);
      }, 0);
    }
    if (field == "lotwidth") {
      return AllClosingListExport.reduce((sum, closings) => {
        return sum + (closings.subdivision && closings.subdivision.lotwidth || 0);
      }, 0);
    }
    if (field == "lotsize") {
      return AllClosingListExport.reduce((sum, closings) => {
        return sum + (closings.subdivision && closings.subdivision.lotsize || 0);
      }, 0);
    }
  };

  const averageFields = (field) => {
    const sum = totalSumFields(field);
    return sum / AllClosingListExport.length;
  };

  const handleSelectChange = (e, field) => {
    const value = e.target.value;

    switch (field) {
      case "closingprice":
        setClosingPriceOption(value);
        setLoanAmountOption("");
        setLotWidthOption("");
        setLotSizeOption("");

        setLoanAmountResult(0);
        setLotWidthResult(0);
        setLotSizeResult(0);

        if (value === 'sum') {
          setClosingPriceResult(totalSumFields(field));
        } else if (value === 'avg') {
          setClosingPriceResult(averageFields(field));
        }
        break;

      case "loanamount":
        setLoanAmountOption(value);
        setClosingPriceOption("");
        setLotWidthOption("");
        setLotSizeOption("");

        setClosingPriceResult(0);
        setLotWidthResult(0);
        setLotSizeResult(0);

        if (value === 'sum') {
          setLoanAmountResult(totalSumFields(field));
        } else if (value === 'avg') {
          setLoanAmountResult(averageFields(field));
        }
        break;

      case "lotwidth":
        setLotWidthOption(value);
        setClosingPriceOption("");
        setLoanAmountOption("");
        setLotSizeOption("");

        setClosingPriceResult(0);
        setLoanAmountResult(0);
        setLotSizeResult(0);

        if (value === 'sum') {
          setLotWidthResult(totalSumFields(field));
        } else if (value === 'avg') {
          setLotWidthResult(averageFields(field));
        }
        break;

      case "lotsize":
        setLotSizeOption(value);
        setClosingPriceOption("");
        setLoanAmountOption("");
        setLotWidthOption("");

        setClosingPriceResult(0);
        setLoanAmountResult(0);
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

        if (value === 'closingType') {
          value = 'closing_type';
        }
        if (value === 'closingPrice') {
          value = 'closingprice';
        }
        if (value === 'parcelNumber') {
          value = 'parcel';
        }
        if (value === 'subLegalName') {
          value = 'sublegal_name';
        }
        if (value === 'sellerLegalName') {
          value = 'sellerleagal';
        }
        if (value === 'buyerName') {
          value = 'buyer';
        }
        if (value === 'doc') {
          value = 'document';
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
        if (value === 'ageRestricted') {
          value = 'age';
        }
        if (value === 'allSingleStory') {
          value = 'single';
        }
        if (value === 'dateAdded') {
          value = 'dateadded';
        }
        if (value === '__pkRecordID') {
          value = 'id';
        }
        if (value === '_fkSubID') {
          value = 'subdivision_code';
        }
        if (value === 'loanAmount') {
          value = 'loanamount';
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
    getClosingList(currentPage, sortingConfig, searchQuery);
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
        mainTitle="Closings"
        pageTitle="Closings"
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
                      <h4 className="heading mb-0">Closing List</h4>
                      <div
                        class="btn-group mx-5"
                        role="group"
                        aria-label="Basic example"
                      >
                        {SyestemUserRole == "Admin" &&
                          <button class="btn btn-secondary cursor-none" onClick={UpdateFromCcapn}>
                            {" "}
                            Update with CCAPNs
                          </button>}
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

                    <div className="mt-2" style={{width: "100%"}}>
                      {SyestemUserRole == "Data Uploader" ||
                        SyestemUserRole == "User" || SyestemUserRole == "Standard User" ? (
                        <div className="d-flex" style={{ marginTop: "10px" }}>
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
                            onClick={() => closingsale.current.showEmployeModal()}
                          >
                            <div style={{ fontSize: "11px" }}>
                              <i className="fa fa-plus" />&nbsp;
                              Add Closing
                            </div>
                          </Link>
                          <Link
                            to={"#"}
                            className="btn btn-primary btn-sm ms-1"
                            data-bs-toggle="offcanvas"
                            onClick={() => bulkClosing.current.showEmployeModal()}
                          >
                            <div style={{ fontSize: "11px" }}>
                              <i className="fa fa-pencil" />&nbsp;
                              Bulk Edit
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
                              Bulk Delete
                            </div>
                          </button>
                        </div>
                      )}
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
                        className="table ItemsCheckboxSec dataTable no-footer mb-0 closing-table"
                      >
                        <thead>
                          <tr style={{ textAlign: "center" }}>
                            <th>
                              <input
                                type="checkbox"
                                style={{
                                  cursor: "pointer",
                                }}
                                checked={selectedLandSales.length === ClosingList.length}
                                onChange={(e) =>
                                  e.target.checked
                                    ? setSelectedLandSales(ClosingList.map((user) => user.id))
                                    : setSelectedLandSales([])
                                }
                              />
                            </th>
                            <th>No.</th>
                            {columns.map((column) => (
                              <th style={{ textAlign: "center", cursor: "pointer" }} key={column.id}>
                                <strong>
                                  {column.label}
                                  {column.id != "action" && sortConfig.some(
                                    (item) => item.key === (
                                      column.id == "closing Type" ? "closing_type" :
                                        column.id == "closing Price" ? "closingprice" :
                                          column.id == "parcel Number" ? "parcel" :
                                            column.id == "sub Legal Name" ? "sublegal_name" :
                                              column.id == "seller Legal Name" ? "sellerleagal" :
                                                column.id == "buyer Name" ? "buyer" :
                                                  column.id == "doc" ? "document" :
                                                    column.id == "product Type" ? "product_type" :
                                                      column.id == "master Plan" ? "masterplan_id" :
                                                        column.id == "zip Code" ? "zipcode" :
                                                          column.id == "lot Width" ? "lotwidth" :
                                                            column.id == "lot Size" ? "lotsize" :
                                                              column.id == "age Restricted" ? "age" :
                                                                column.id == "all Single Story" ? "single" :
                                                                  column.id == "date Added" ? "dateadded" :
                                                                    column.id == "__pkRecordID" ? "id" :
                                                                      column.id == "_fkSubID" ? "subdivision_code" :
                                                                        column.id == "loan Amount" ? "loanamount" : toCamelCase(column.id))
                                  ) && (
                                      <span>
                                        {column.id != "action" && sortConfig.find(
                                          (item) => item.key === (
                                            column.id == "closing Type" ? "closing_type" :
                                              column.id == "closing Price" ? "closingprice" :
                                                column.id == "parcel Number" ? "parcel" :
                                                  column.id == "sub Legal Name" ? "sublegal_name" :
                                                    column.id == "seller Legal Name" ? "sellerleagal" :
                                                      column.id == "buyer Name" ? "buyer" :
                                                        column.id == "doc" ? "document" :
                                                          column.id == "product Type" ? "product_type" :
                                                            column.id == "master Plan" ? "masterplan_id" :
                                                              column.id == "zip Code" ? "zipcode" :
                                                                column.id == "lot Width" ? "lotwidth" :
                                                                  column.id == "lot Size" ? "lotsize" :
                                                                    column.id == "age Restricted" ? "age" :
                                                                      column.id == "all Single Story" ? "single" :
                                                                        column.id == "date Added" ? "dateadded" :
                                                                          column.id == "__pkRecordID" ? "id" :
                                                                            column.id == "_fkSubID" ? "subdivision_code" :
                                                                              column.id == "loan Amount" ? "loanamount" : toCamelCase(column.id))
                                        ).direction === "asc" ? "↑" : "↓"}
                                      </span>
                                    )}
                                </strong>

                                {(!excelLoading) && (column.id !== "closing Type" && column.id !== "closing Date" && column.id !== "doc" &&
                                  column.id !== "builder Name" && column.id !== "subdivision Name" && column.id !== "address" && column.id !== "parcel Number" &&
                                  column.id !== "sub Legal Name" && column.id !== "seller Legal Name" && column.id !== "buyer Name" && column.id !== "lender" && column.id !== "type" &&
                                  column.id !== "product Type" && column.id !== "area" && column.id !== "master Plan" && column.id !== "zip Code" && column.id !== "zoning" && column.id !== "age Restricted" &&
                                  column.id !== "all Single Story" && column.id !== "date Added" && column.id !== "__pkRecordID" && column.id !== "_fkSubID" && column.id !== "action"
                                ) &&
                                  (
                                    <>
                                      <br />
                                      <select className="custom-select"
                                        value={
                                          column.id == "closing Price" ? closingPriceOption :
                                            column.id == "loan Amount" ? loanAmountOption :
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

                                        onChange={(e) => column.id == "closing Price" ? handleSelectChange(e, "closingprice") :
                                          column.id == "loan Amount" ? handleSelectChange(e, "loanamount") :
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
                                  {column.id == "closing Type" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "closing Date" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "doc" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "builder Name" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "subdivision Name" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "closing Price" &&
                                    <td key={column.id} style={{ textAlign: "center" }}><PriceComponent price={closingPriceResult} /></td>
                                  }
                                  {column.id == "address" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "parcel Number" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "sub Legal Name" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "seller Legal Name" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "buyer Name" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "lender" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "loan Amount" &&
                                    <td key={column.id} style={{ textAlign: "center" }}><PriceComponent price={loanAmountResult} /></td>
                                  }
                                  {column.id == "type" &&
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
                          {ClosingList !== null && ClosingList.length > 0 ? (
                            ClosingList.map((element, index) => (
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
                                      <td key={column.id} style={{ textAlign: "center" }}><PriceComponent price={element.loanamount} /></td>
                                    }
                                    {column.id == "type" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.type}</td>
                                    }
                                    {column.id == "product Type" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.subdivision && element.subdivision.product_type}</td>
                                    }
                                    {column.id == "area" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.subdivision && element.subdivision.area}</td>
                                    }
                                    {column.id == "master Plan" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.subdivision && element.subdivision.masterplan_id}</td>
                                    }
                                    {column.id == "zip Code" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.subdivision && element.subdivision.zipcode}</td>
                                    }
                                    {column.id == "lot Width" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.subdivision && element.subdivision.lotwidth}</td>
                                    }
                                    {column.id == "lot Size" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.subdivision && element.subdivision.lotsize}</td>
                                    }
                                    {column.id == "zoning" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.subdivision && element.subdivision.zoning}</td>
                                    }
                                    {column.id == "age Restricted" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.subdivision && element.subdivision.age == "1" ? "Yes" : "No"}</td>
                                    }
                                    {column.id == "all Single Story" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.subdivision && element.subdivision.single == "1" ? "Yes" : "No"}</td>
                                    }
                                    {column.id == "date Added" &&
                                      <td key={column.id} style={{ textAlign: "center" }}><DateComponent date={element.subdivision && element.subdivision.dateadded} /></td>
                                    }
                                    {column.id == "__pkRecordID" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.id}</td>
                                    }
                                    {column.id == "_fkSubID" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.subdivision && element.subdivision.subdivision_code}</td>
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

      <ClosingOffcanvas
        ref={closingsale}
        Title="Add Closing"
        parentCallback={handleCallback}
      />

      <BulkClosingUpdate
        ref={bulkClosing}
        Title="Bulk Edit Closings"
        parentCallback={handleCallback}
        selectedLandSales={selectedLandSales}
      />

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Import Closings CSV Data</Modal.Title>
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
            onClick={() => { setShowOffcanvas(false); clearClosingDetails(); }}
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
                  {ClosingDetails.subdivision.builder?.name || "NA"}
                </span><br />
                <span className="fw-bold" style={{ fontSize: "40px" }}>
                  {ClosingDetails.subdivision !== null && ClosingDetails.subdivision.name !== undefined
                    ? ClosingDetails.subdivision.name
                    : "NA"
                  }
                </span><br />
                <label className="" style={{ fontSize: "22px" }}><b>PRODUCT TYPE:</b>&nbsp;<span>{ClosingDetails.subdivision?.product_type || "NA"}</span></label>

                <hr style={{ borderTop: "2px solid black", width: "60%", marginTop: "10px" }}></hr>

                <div className="d-flex" style={{ marginTop: "5px" }}>
                  <div className="fs-18" style={{ width: "180px" }}><span><b>AREA:</b></span>&nbsp;<span>{ClosingDetails.subdivision?.area || "NA"}</span></div>
                  <div className="fs-18"><span><b>MASTER PLAN:</b></span>&nbsp;<span>{ClosingDetails.subdivision?.masterplan_id || "NA"}</span></div>
                </div>
                <label className="fs-18" style={{ marginTop: "5px" }}><b>ZIP CODE:</b>&nbsp;<span>{ClosingDetails.subdivision?.zipcode || "NA"}</span></label><br />
                <label className="fs-18"><b>CROSS STREETS:</b>&nbsp;<span>{ClosingDetails.subdivision?.crossstreet || "NA"}</span></label><br />
                <label className="fs-18"><b>JURISDICTION:</b>&nbsp;<span>{ClosingDetails.subdivision?.juridiction || "NA"}</span></label>

                <hr style={{ borderTop: "2px solid black", width: "60%", marginTop: "10px" }}></hr>

                <div className="d-flex" style={{ marginTop: "5px" }}>
                  <div className="fs-18" style={{ width: "300px" }}><span><b>PARCEL:</b></span>&nbsp;<span>{ClosingDetails.parcel || "NA"}</span></div>
                  <div className="fs-18"><span><b>LENDER:</b></span>&nbsp;<span>{ClosingDetails.lender || "NA"}</span></div>
                </div>
                <div className="d-flex" style={{ marginTop: "5px" }}>
                  <div className="fs-18" style={{ width: "300px" }}><span><b>ADDRESS:</b></span>&nbsp;<span>{ClosingDetails.address || "NA"}</span></div>
                  <div className="fs-18"><span><b>LOAN AMT:</b></span>&nbsp;<span>{<PriceComponent price={ClosingDetails.loanamount} /> || "NA"}</span></div>
                </div>
                <div className="d-flex" style={{ marginTop: "5px" }}>
                  <div className="fs-18" style={{ width: "300px" }}><span><b>CLOSING PRICE:</b></span>&nbsp;<span>{<PriceComponent price={ClosingDetails.closingprice} /> || "NA"}</span></div>
                  <div className="fs-18"><span><b>CLOSING TYPE:</b></span>&nbsp;<span>{ClosingDetails.closing_type || "NA"}</span></div>
                </div>
                <div className="d-flex" style={{ marginTop: "5px" }}>
                  <div className="fs-18" style={{ width: "300px" }}><span><b>DATE:</b></span>&nbsp;<span>{<DateComponent date={ClosingDetails.closingdate} /> || "NA"}</span></div>
                </div>
                <div className="d-flex" style={{ marginTop: "5px" }}>
                  <div className="fs-18" style={{ width: "300px" }}><span><b>DOC:</b></span>&nbsp;<span>{ClosingDetails.document || "NA"}</span></div>
                </div>

                <label className="fs-18"><b>BUYER:</b>&nbsp;<span>{ClosingDetails.buyer || "NA"}</span></label><br />
                <label className="fs-18"><b>SELLER:</b>&nbsp;<span>{ClosingDetails.sellerleagal || "NA"}</span></label><br />
                <label className="fs-18"><b>SUB LEGAL NAME:</b>&nbsp;<span>{ClosingDetails.sublegal_name || "NA"}</span></label>

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
            Filter Closings{" "}
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
                    <label className="form-label">CLOSING TYPE:{" "}</label>
                    <Form.Group controlId="tournamentList">
                      <MultiSelect
                        name="closing_type"
                        options={closingType}
                        value={seletctedClosingType}
                        onChange={handleSelectClosingTypeChange}
                        placeholder={"Select Closing Type"}
                      />
                    </Form.Group>
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">DOC:{" "}</label>
                    <input name="document" value={filterQuery.document} className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">BUILDER NAME:{" "}</label>
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
                    <label className="form-label">SUBDIVISION NAME:{" "}</label>
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
                    <label className="form-label">CLOSING PRICE:{" "}</label>
                    <input name="closingprice" value={filterQuery.closingprice} className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">ADDRESS:{" "}</label>
                    <input name="address" value={filterQuery.address} className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">PARCEL NUMBER:{" "}</label>
                    <input value={filterQuery.parcel} name="parcel" className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">SELLER LEGAL NAME:{" "}</label>
                    <input value={filterQuery.sellerleagal} name="sellerleagal" className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">BUYER NAME:{" "}</label>
                    <input value={filterQuery.buyer} name="buyer" className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">LENDER:{" "}</label>
                    <Form.Group controlId="tournamentList">
                      <MultiSelect
                        name="lender_name"
                        options={lenderList}
                        value={seletctedLender}
                        onChange={handleSelectLenderChange}
                        placeholder={"Select Lender"}
                      />
                    </Form.Group>
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">LOAN AMOUNT:{" "}</label>
                    <input value={filterQuery.loanamount} name="loanamount" className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-3 mb-3">
                    <label className="form-label">PRODUCT TYPE:{" "}</label>
                    <MultiSelect
                      name="product_type"
                      options={productTypeOptions}
                      value={productTypeStatus}
                      onChange={handleSelectProductTypeChange}
                      placeholder="Select Prodcut Type"
                    />
                  </div>
                  <div className="col-md-3 mt-3 mb-3">
                    <label className="form-label">AREA:{" "}</label>
                    <MultiSelect
                      name="area"
                      options={areaOption}
                      value={selectedArea}
                      onChange={handleSelectAreaChange}
                      placeholder="Select Area"
                    />
                  </div>
                  <div className="col-md-3 mt-3 mb-3">
                    <label className="form-label">MASTERPLAN:{" "}</label>
                    <MultiSelect
                      name="masterplan_id"
                      options={masterPlanOption}
                      value={selectedMasterPlan}
                      onChange={handleSelectMasterPlanChange}
                      placeholder="Select Area"
                    />
                  </div>
                  <div className="col-md-3 mt-3 mb-3">
                    <label className="form-label">ZIP CODE:{" "}</label>
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
                  <div className="col-md-3 mt-3">
                    <label className="form-label">LOT WIDTH:{" "}</label>
                    <input value={filterQuery.lotwidth} name="lotwidth" className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">LOT SIZE:{" "}</label>
                    <input value={filterQuery.lotsize} name="lotsize" className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">AGE RESTRICTED:{" "}</label>
                    <MultiSelect
                      name="age"
                      options={ageOptions}
                      value={selectedAge}
                      onChange={handleSelectAgeChange}
                      placeholder={"Select Age"}
                    />
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">ALL SINGLE STORY:{" "}</label>
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

export default ClosingList;
