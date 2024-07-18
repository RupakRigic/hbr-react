import React, { useState, useEffect, useRef } from "react";
import AdminClosingService from "../../../API/Services/AdminService/AdminClosingService";
import { Link, useLocation, useNavigate } from "react-router-dom";
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

const ClosingList = () => {
  const location = useLocation();

  const { searchQueryByFilter, seletctedClosingTypeByFilter, fromByFilter, toByFilter, documentByFilter, selectedBuilderNameByFilter, selectedSubdivisionNameByFilter, closingpriceByFilter, addressByFilter, parcelByFilter, sellerleagalByFilter, buyerByFilter, seletctedLenderByFilter, loanamountByFilter, productTypeStatusByFilter, selectedAreaByFilter, selectedMasterPlanByFilter, seletctedZipcodeByFilter, lotwidthByFilter, lotsizeByFilter, selectedAgeByFilter, selectedSingleByFilter } = location.state || {};

  const [excelLoading, setExcelLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState([]);
  const [selectedArea, setSelectedArea] = useState(selectedAreaByFilter);
  const [selectedMasterPlan, setSelectedMasterPlan] = useState(selectedMasterPlanByFilter);
  const [productTypeStatus, setProductTypeStatus] = useState(productTypeStatusByFilter);
  const [seletctedZipcode, setSelectedZipcode] = useState(seletctedZipcodeByFilter);
  const [seletctedLender, setSelectedLender] = useState(seletctedLenderByFilter);
  const [seletctedClosingType, setSelectedClosingType] = useState(seletctedClosingTypeByFilter);
  const [lenderList, setLenderList] = useState([]);
  const [showSort, setShowSort] = useState(false);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState(sortConfig.map(col => col.key));
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
  const [searchQuery, setSearchQuery] = useState(searchQueryByFilter);
  const [manageFilterOffcanvas, setManageFilterOffcanvas] = useState(false);
  const [filterQuery, setFilterQuery] = useState({
    closing_type: "",
    from: fromByFilter ? fromByFilter : "",
    to: toByFilter ? toByFilter : "",
    document: documentByFilter ? documentByFilter : "",
    builder_name: "",
    subdivision_name: "",
    closingprice: closingpriceByFilter ? closingpriceByFilter : "",
    address: addressByFilter ? addressByFilter : "",
    parcel: parcelByFilter ? parcelByFilter : "",
    sellerleagal: sellerleagalByFilter ? sellerleagalByFilter : "",
    buyer: buyerByFilter ? buyerByFilter : "",
    lender_name: "",
    loanamount: loanamountByFilter ? loanamountByFilter : "",
    product_type: "",
    area: "",
    masterplan_id: "",
    zipcode: "",
    lotwidth: lotwidthByFilter ? lotwidthByFilter : "",
    lotsize: lotsizeByFilter ? lotsizeByFilter : "",
    age: "",
    single: ""
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
  const [isLoading, setIsLoading] = useState(true);
  const [isFormLoading, setIsFormLoading] = useState(true);
  const [builderDropDown, setBuilderDropDown] = useState([]);
  const [SubdivisionList, SetSubdivisionList] = useState([]);
  const [selectedBuilderName, setSelectedBuilderName] = useState(selectedBuilderNameByFilter);
  const [selectedSubdivisionName, setSelectedSubdivisionName] = useState(selectedSubdivisionNameByFilter);
  const [selectedAge, setSelectedAge] = useState(selectedAgeByFilter);
  const [selectedSingle, setSelectedSingle] = useState(selectedSingleByFilter);
  const [selectedValues, setSelectedValues] = useState([]);

  useEffect(() => {
    setSelectedCheckboxes(sortConfig.map(col => col.key));
  }, [sortConfig]);

  useEffect(() => {
    if (seletctedClosingTypeByFilter != undefined && seletctedClosingTypeByFilter.length > 0) {
      handleSelectClosingTypeChange(seletctedClosingTypeByFilter);
    }
    if (selectedBuilderNameByFilter != undefined && selectedBuilderNameByFilter.length > 0) {
      handleSelectBuilderNameChange(selectedBuilderNameByFilter);
    }
    if (selectedSubdivisionNameByFilter != undefined && selectedSubdivisionNameByFilter.length > 0) {
      handleSelectSubdivisionNameChange(selectedSubdivisionNameByFilter);
    }
    if (seletctedLenderByFilter != undefined && seletctedLenderByFilter.length > 0) {
      handleSelectLenderChange(seletctedLenderByFilter);
    }
    if (productTypeStatusByFilter != undefined && productTypeStatusByFilter.length > 0) {
      handleSelectProductTypeChange(productTypeStatusByFilter);
    }
    if (selectedAreaByFilter != undefined && selectedAreaByFilter.length > 0) {
      handleSelectAreaChange(selectedAreaByFilter);
    }
    if (selectedMasterPlanByFilter != undefined && selectedMasterPlanByFilter.length > 0) {
      handleSelectMasterPlanChange(selectedMasterPlanByFilter);
    }
    if (seletctedZipcodeByFilter != undefined && seletctedZipcodeByFilter.length > 0) {
      handleSelectZipcodeChange(seletctedZipcodeByFilter);
    }
    if (selectedAgeByFilter != undefined && selectedAgeByFilter.length > 0) {
      handleSelectAgeChange(selectedAgeByFilter);
    }
    if (selectedSingleByFilter != undefined && selectedSingleByFilter.length > 0) {
      handleSelectSingleChange(selectedSingleByFilter);
    }
  }, [ seletctedClosingTypeByFilter, selectedBuilderNameByFilter, selectedSubdivisionNameByFilter, seletctedLenderByFilter, productTypeStatusByFilter, selectedAreaByFilter, selectedMasterPlanByFilter, seletctedZipcodeByFilter, selectedAgeByFilter, selectedSingleByFilter]);

  const SyestemUserRole = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).role : "";

  const HandleSortDetailClick = (e) => {
    setShowSort(true);
  };

  const handleSortCheckboxChange = (e, key) => {
    if (e.target.checked) {
      setSelectedCheckboxes(prev => [...prev, key]);
    } else {
      setSelectedCheckboxes(prev => prev.filter(item => item !== key));
    }
  };

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

  const HandleFilterForm = (e) => {
    e.preventDefault();
    console.log(555);
    getClosingList(currentPage, sortConfig, searchQuery);
    setManageFilterOffcanvas(false);
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
    setSelectedZipcode([]);
    setSelectedAge([]);
    setSelectedSingle([]);
    setManageFilterOffcanvas(false);
    getClosingList(1, sortConfig, "");
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

  const handleRemoveSelected = () => {
    const newSortConfig = sortConfig.filter(item => selectedCheckboxes.includes(item.key));
    setSortConfig(newSortConfig);
    setSelectedCheckboxes([]);
  };

  const handleSortClose = () => setShowSort(false);

  const checkFieldExist = (fieldName) => {
    return fieldList.includes(fieldName.trim());
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
      if(responseData.total > 100) {
        FetchAllPages(searchQuery, sortConfig);
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

  const FetchAllPages = async (searchQuery, sortConfig) => {
    setExcelLoading(true);
    const response = await AdminClosingService.index(1, searchQuery, sortConfig ? `&sortConfig=${stringifySortConfig(sortConfig)}` : "");
    const responseData = await response.json();
    const totalPages = Math.ceil(responseData.total / recordsPage);
    let allData = responseData.data;
    for (let page = 2; page <= totalPages; page++) {
      await delay(1000);
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
        getClosingList();
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
        getClosingList();
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
          if (responseData.data) {
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
                navigate("/closingsalelist");
              }
            });
          } else {
            swal('Error: ' + responseData.error);
          }
          getClosingList();
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
    getClosingList();
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
    getClosingList(currentPage, newSortConfig, searchQuery);
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

  const handleSelectZipcodeChange = (selectedItems) => {
    console.log(selectedItems);
    const selectedValues = selectedItems.map(item => item.value).join(', ');
    console.log(selectedValues);
    setSelectedZipcode(selectedItems);
    setFilterQuery(prevState => ({
      ...prevState,
      zipcode: selectedValues
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
            <div className="card" style={{ overflow: "auto" }}>
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
                        <button class="btn btn-secondary cursor-none" onClick={UpdateFromCcapn}>
                          {" "}
                          Update with CCAPNs
                        </button>
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
                      ""
                    ) : (
                      <div className="d-flex" style={{ marginTop: "10px" }}>
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
                          onClick={() => closingsale.current.showEmployeModal()}
                        >
                          + Add Closing
                        </Link>
                        <Link
                          to={"#"}
                          className="btn btn-primary btn-sm ms-1"
                          data-bs-toggle="offcanvas"
                          onClick={() => bulkClosing.current.showEmployeModal()}
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
                              <th style={{ textAlign: "center", cursor: "pointer" }} key={column.id} onClick={() => column.id != ("action") ? requestSort(
                                column.id == "closing Type" ? "closing_type" :
                                column.id == "closing Price" ? "closingprice" :
                                column.id == "Parcel Number" ? "parcel" :
                                column.id == "sub Legal Name" ? "subdivisionName" :
                                column.id == "seller Legal Name" ? "sellerleagal" :
                                column.id == "buyer Name" ? "buyer" :
                                column.id == "loan Amount" ? "loanamount" : toCamelCase(column.id)) : ""}>
                                <strong>
                                  {column.label}
                                  {column.id != "action" && sortConfig.some(
                                    (item) => item.key === (
                                      column.id == "closing Type" ? "closing_type" :
                                      column.id == "closing Price" ? "closingprice" :
                                      column.id == "sub Legal Name" ? "subdivisionName" :
                                      column.id == "seller Legal Name" ? "sellerleagal" :
                                      column.id == "buyer Name" ? "buyer" :
                                      column.id == "loan Amount" ? "loanamount" : toCamelCase(column.id))
                                  ) ? (
                                    <span>
                                      {column.id != "action" && sortConfig.find(
                                        (item) => item.key === (
                                          column.id == "closing Type" ? "closing_type" :
                                          column.id == "closing Price" ? "closingprice" :
                                          column.id == "sub Legal Name" ? "subdivisionName" :
                                          column.id == "seller Legal Name" ? "sellerleagal" :
                                          column.id == "buyer Name" ? "buyer" :
                                          column.id == "loan Amount" ? "loanamount" : toCamelCase(column.id))
                                      ).direction === "asc" ? "↑" : "↓"}
                                    </span>
                                  ) : (
                                    column.id != "action" && <span>↑↓</span>
                                  )}
                                </strong>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody style={{ textAlign: "center" }}>
                          {ClosingList !== null && ClosingList.length > 0 ? (
                            ClosingList.map((element, index) => (
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
                                      <td key={column.id} style={{ textAlign: "center" }}><DateComponent date={element.created_at} /></td>
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
                    <MultiSelect
                      name="zipcode"
                      options={zipCodeOption}
                      value={seletctedZipcode}
                      onChange={handleSelectZipcodeChange}
                      placeholder="Select Zipcode"
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
                      style={{cursor: "pointer"}}
                    />
                    <label className="form-check-label" htmlFor={`checkbox-${col.key}`} style={{cursor: "pointer"}}>
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

export default ClosingList;
