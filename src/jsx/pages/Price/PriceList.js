import React, { useState, useEffect, useRef, Fragment } from "react";
import AdminPriceService from "../../../API/Services/AdminService/AdminPriceService";
import PriceComponent from "../../components/Price/PriceComponent";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import PriceOffcanvas from "./PriceOffcanvas";
import MainPagetitle from "../../layouts/MainPagetitle";
import Button from "react-bootstrap/Button";
import ClipLoader from "react-spinners/ClipLoader";
import DateComponent from "../../components/date/DateFormat";
import AccessField from "../../components/AccssFieldComponent/AccessFiled";
import Modal from "react-bootstrap/Modal";
import ColumnReOrderPopup from "../../popup/ColumnReOrderPopup";
import { Offcanvas, Form, Row } from "react-bootstrap";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import BulkPriceUpdate from "./BulkPriceUpdate";
import AdminBuilderService from "../../../API/Services/AdminService/AdminBuilderService";
import AdminSubdevisionService from "../../../API/Services/AdminService/AdminSubdevisionService";
import { MultiSelect } from "react-multi-select-component";
import DatePicker from "react-datepicker";
import AdminProductService from "../../../API/Services/AdminService/AdminProductService";
import moment from 'moment';
import '../../pages/Subdivision/subdivisionList.css';
import Swal from "sweetalert2";

const PriceList = () => {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [searchQuery, setSearchQuery] = useState(localStorage.getItem("searchQueryByBasePricesFilter") ? JSON.parse(localStorage.getItem("searchQueryByBasePricesFilter")) : "");
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState(false);
  const [excelLoading, setExcelLoading] = useState(false);
  const [excelDownload, setExcelDownload] = useState(false);
  const handlePopupClose = () => setShowPopup(false);
  const resetSelection = () => {
    setSelectAll(false);
    setSelectedColumns([]);
  };

  const SyestemUserRole = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).role
    : "";

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  };

  const handleSelectAllToggle = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    if (newSelectAll) {
      setSelectedColumns(exportColumns.map(col => col.label));
    } else {
      setSelectedColumns([]);
    }
  };

  const [exportmodelshow, setExportModelShow] = useState(false)
  const [selectedArea, setSelectedArea] = useState([]);
  const [selectedMasterPlan, setSelectedMasterPlan] = useState([]);
  const [productTypeStatus, setProductTypeStatus] = useState([]);

  const handleColumnToggle = (column) => {
    const updatedColumns = selectedColumns.includes(column)
      ? selectedColumns.filter((col) => col !== column)
      : [...selectedColumns, column];
    console.log(updatedColumns);
    setSelectedColumns(updatedColumns);
    setSelectAll(updatedColumns.length === exportColumns.length);
  };

  const [manageFilterOffcanvas, setManageFilterOffcanvas] = useState(false);
  const [samePage, setSamePage] = useState(false);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [selectCheckBox, setSelectCheckBox] = useState(false);

  const exportColumns = [
    { label: 'Date', key: 'date' },
    { label: 'Builder Name', key: 'BuilderName' },
    { label: 'Subdivision Name', key: 'SubdivisionName' },
    { label: 'Product Name', key: 'name' },
    { label: 'Square Footage', key: 'sqft' },
    { label: 'Stories', key: 'stories' },
    { label: 'Bedrooms', key: 'bedroom' },
    { label: 'Bathrooms', key: 'bathrooms' },
    { label: 'Garage', key: 'garrage' },
    { label: 'Base Price', key: 'basePrice' },
    { label: 'Price Per SQFT', key: 'recentpricesqft' },
    { label: 'Product Type', key: 'productType' },
    { label: 'Area', key: 'area' },
    { label: 'Master Plan', key: 'masterplan_id' },
    { label: 'Zip Code', key: 'zipcode' },
    { label: 'Lot Width', key: 'lotwidth' },
    { label: 'Lot Size', key: 'lotsize' },
    { label: 'Zoning', key: 'zoning' },
    { label: 'Age Restricted', key: 'age' },
    { label: 'All Single Story', key: 'single' },
    { label: '__pkPriceID', key: 'id' },
    { label: '_fkProductID', key: 'product_code' },
  ];

  const headers = [
    { label: 'Date', key: 'date' },
    { label: 'Builder Name', key: 'BuilderName' },
    { label: 'Subdivision Name', key: 'SubdivisionName' },
    { label: 'Product Name', key: 'name' },
    { label: 'Square Footage', key: 'sqft' },
    { label: 'Stories', key: 'stories' },
    { label: 'Bedrooms', key: 'bedroom' },
    { label: 'Bathrooms', key: 'bathrooms' },
    { label: 'Garage', key: 'garrage' },
    { label: 'Base Price', key: 'basePrice' },
    { label: 'Price Per SQFT', key: 'recentpricesqft' },
    { label: 'Product Type', key: 'productType' },
    { label: 'Area', key: 'area' },
    { label: 'Master Plan', key: 'masterplan_id' },
    { label: 'Zip Code', key: 'zipcode' },
    { label: 'Lot Width', key: 'lotwidth' },
    { label: 'Lot Size', key: 'lotsize' },
    { label: 'Zoning', key: 'zoning' },
    { label: 'Age Restricted', key: 'age' },
    { label: 'All Single Story', key: 'single' },
    { label: '__pkPriceID', key: 'id' },
    { label: '_fkProductID', key: 'product_code' },

  ];

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
            setSelectedLandSales(priceList?.map((user) => user.id));
          } else if (selectedOption === "all") {
            setIsSelectAll(true);
            setSelectCheckBox(true);
            setSelectedLandSales(AllProductListExport?.map((user) => user.id));
          }
        }
      });
    } else {
      setSelectCheckBox(false);
      setSelectedLandSales([]);
    }
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
      const response = await AdminPriceService.export(currentPage, sortConfigString, searchQuery, "", is_calculated).json();
      if (response.status) {
        const tableData = priceList?.map((row) => {
          return tableHeaders.map((header) => {
            switch (header) {
              case "Date":
                return row.date ? row.date : "" || '';
              case "Builder Name":
                return row.product.subdivision &&
                  row.product.subdivision.builder?.name;
              case "Subdivision Name":
                return row.product.subdivision &&
                  row.product.subdivision?.name;
              case "Product Name":
                return row.product.name || '';
              case "Square Footage":
                return row.product.sqft
              case "Stories":
                return row.product.stories || '';
              case "Bedrooms":
                return row.product.bedroom || '';
              case "Bathrooms":
                return row.product.bathroom || '';
              case "Garage":
                return row.product.garage || '';
              case "Base Price":
                return row.baseprice || '';
              case "Price Per SQFT":
                return row.price_per_sqft || '';
              case "Product Type":
                return row.product.subdivision.product_type || '';
              case "Area":
                return row.product.subdivision.area || '';
              case "Master Plan":
                return row.product.subdivision.masterplan_id || '';
              case "Zip Code":
                return row.product.subdivision.zipcode || '';
              case "Lot Width":
                return row.product.subdivision.lotwidth || '';
              case "Lot Size":
                return row.product.subdivision.lotsize || '';
              case "Zoning":
                return row.product.subdivision.zoning || '';
              case "Age Restricted":
                return row.product.subdivision.age == 1 ? "Yes" : row.product.subdivision.age == 0 ? "No" : '';
              case "All Single Story":
                return row.product.subdivision.single == 1 ? "Yes" : row.product.subdivision.single == 0 ? "No" : '';
              case "__pkPriceID":
                return row.id || '';
              case "_fkProductID":
                return row.product.product_code || '';
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

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Worksheet');

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(data, 'prices.xlsx');

        resetSelection();
        setExportModelShow(false);
        setExcelDownload(false);
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
        const response = await AdminPriceService.export(currentPage, sortConfigString, searchQuery, exportColumn, "").blob();
        const downloadUrl = URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.setAttribute('download', `prices.xlsx`);
        document.body.appendChild(a);
        a.click();
        a.parentNode.removeChild(a);
        setExcelDownload(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const [filterQuery, setFilterQuery] = useState({
    from: localStorage.getItem("from_BasePrice") ? JSON.parse(localStorage.getItem("from_BasePrice")) : "",
    to: localStorage.getItem("to_BasePrice") ? JSON.parse(localStorage.getItem("to_BasePrice")) : "",
    builder_name: localStorage.getItem("builder_name_BasePrice") ? JSON.parse(localStorage.getItem("builder_name_BasePrice")) : "",
    subdivision_name: localStorage.getItem("subdivision_name_BasePrice") ? JSON.parse(localStorage.getItem("subdivision_name_BasePrice")) : "",
    name: localStorage.getItem("product_name_BasePrice") ? JSON.parse(localStorage.getItem("product_name_BasePrice")) : "",
    sqft: localStorage.getItem("sqft_BasePrice") ? JSON.parse(localStorage.getItem("sqft_BasePrice")) : "",
    stories: localStorage.getItem("stories_BasePrice") ? JSON.parse(localStorage.getItem("stories_BasePrice")) : "",
    bedroom: localStorage.getItem("bedroom_BasePrice") ? JSON.parse(localStorage.getItem("bedroom_BasePrice")) : "",
    bathroom: localStorage.getItem("bathroom_BasePrice") ? JSON.parse(localStorage.getItem("bathroom_BasePrice")) : "",
    garage: localStorage.getItem("garage_BasePrice") ? JSON.parse(localStorage.getItem("garage_BasePrice")) : "",
    baseprice: localStorage.getItem("baseprice_BasePrice") ? JSON.parse(localStorage.getItem("baseprice_BasePrice")) : "",
    product_type: localStorage.getItem("product_type_BasePrice") ? JSON.parse(localStorage.getItem("product_type_BasePrice")) : "",
    area: localStorage.getItem("area_BasePrice") ? JSON.parse(localStorage.getItem("area_BasePrice")) : "",
    masterplan_id: localStorage.getItem("masterplan_id_BasePrice") ? JSON.parse(localStorage.getItem("masterplan_id_BasePrice")) : "",
    zipcode: localStorage.getItem("zipcode_BasePrice") ? JSON.parse(localStorage.getItem("zipcode_BasePrice")) : "",
    lotwidth: localStorage.getItem("lotwidth_BasePrice") ? JSON.parse(localStorage.getItem("lotwidth_BasePrice")) : "",
    lotsize: localStorage.getItem("lotsize_BasePrice") ? JSON.parse(localStorage.getItem("lotsize_BasePrice")) : "",
    age: localStorage.getItem("age_BasePrice") ? JSON.parse(localStorage.getItem("age_BasePrice")) : "",
    single: localStorage.getItem("single_BasePrice") ? JSON.parse(localStorage.getItem("single_BasePrice")) : "",
    price_per_sqft: ""
  });
  const [filterQueryCalculation, setFilterQueryCalculation] = useState({
    price_per_sqft: ""
  });
  const [filter, setFilter] = useState(false);
  const [normalFilter, setNormalFilter] = useState(false);

  const [Error, setError] = useState("");
  const navigate = useNavigate();
  const [priceList, setPriceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const [selectedFileError, setSelectedFileError] = useState("");
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [PriceDetails, setPriceDetails] = useState({
    product: "",
    baseprice: "",
    date: "",
  });
  const clearPriceDetails = () => {
    setPriceDetails({
      product: "",
      baseprice: "",
      date: "",
    });
  };
  const [manageAccessOffcanvas, setManageAccessOffcanvas] = useState(false);
  const [accessList, setAccessList] = useState({});
  const [accessRole, setAccessRole] = useState("Admin");
  const [accessForm, setAccessForm] = useState({});
  const [role, setRole] = useState("Admin");
  const [checkedItems, setCheckedItems] = useState({});
  const fieldList = AccessField({ tableName: "prices" });
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [productListCount, setProductListCount] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [columns, setColumns] = useState([]);
  const [draggedColumns, setDraggedColumns] = useState(columns);
  const [selectedLandSales, setSelectedLandSales] = useState([]);
  const [sortConfig, setSortConfig] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [AllProductListExport, setAllBuilderExport] = useState([]);
  const [ProductList, setProductList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPage = 100;
  const lastIndex = currentPage * recordsPage;
  const firstIndex = lastIndex - recordsPage;
  const [npage, setNpage] = useState(0);
  const number = [...Array(npage + 1).keys()].slice(1);

  const [squareFootageOption, setSquareFootageOption] = useState("");
  const [storiesOption, setStoriesOption] = useState("");
  const [bedroomsOption, setBedroomsOption] = useState("");
  const [bathroomOption, setBathroomOption] = useState("");
  const [garageOption, setGarageOption] = useState("");
  const [basePriceOption, setBasePriceOption] = useState("");
  const [pricePerSQFTOption, setPricePerSQFTOption] = useState("");
  const [lotWidthOption, setLotWidthOption] = useState("");
  const [lotSizeOption, setLotSizeOption] = useState("");

  const [squareFootageResult, setSquareFootageResult] = useState(0);
  const [storiesResult, setStoriesResult] = useState(0);
  const [bedroomsResult, setBedroomsResult] = useState(0);
  const [bathroomResult, setBathroomResult] = useState(0);
  const [garageResult, setGarageResult] = useState(0);
  const [basePriceResult, setBasePriceResult] = useState(0);
  const [pricePerSQFTResult, setPricePerSQFTResult] = useState(0);
  const [lotWidthResult, setLotWidthResult] = useState(0);
  const [lotSizeResult, setLotSizeResult] = useState(0);

  const handleSortingPopupClose = () => setShowSortingPopup(false);
  const [showSortingPopup, setShowSortingPopup] = useState(false);
  const [fieldOptions, setFieldOptions] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);
  const [selectionOrder, setSelectionOrder] = useState({});
  const [sortOrders, setSortOrders] = useState({});

  const HandleRole = (e) => {
    setRole(e.target.value);
    setAccessRole(e.target.value);
  };

  const handleAccessForm = async (e) => {
    e.preventDefault();

    var userData = {
      form: accessForm,
      role: role,
      table: "prices",
    };

    try {
      const data = await AdminPriceService.manageAccessFields(userData).json();
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
    if (localStorage.getItem("selectedBuilderNameByFilter_BasePrice")) {
      const selectedBuilderName = JSON.parse(localStorage.getItem("selectedBuilderNameByFilter_BasePrice"));
      handleSelectBuilderNameChange(selectedBuilderName);
    }
    if (localStorage.getItem("selectedSubdivisionNameByFilter_BasePrice")) {
      const selectedSubdivisionName = JSON.parse(localStorage.getItem("selectedSubdivisionNameByFilter_BasePrice"));
      handleSelectSubdivisionNameChange(selectedSubdivisionName);
    }
    if (localStorage.getItem("productTypeStatusByFilter_BasePrice")) {
      const productTypeStatus = JSON.parse(localStorage.getItem("productTypeStatusByFilter_BasePrice"));
      handleSelectProductTypeChange(productTypeStatus);
    }
    if (localStorage.getItem("selectedAreaByFilter_BasePrice")) {
      const selectedArea = JSON.parse(localStorage.getItem("selectedAreaByFilter_BasePrice"));
      handleSelectAreaChange(selectedArea);
    }
    if (localStorage.getItem("selectedMasterPlanByFilter_BasePrice")) {
      const selectedMasterPlan = JSON.parse(localStorage.getItem("selectedMasterPlanByFilter_BasePrice"));
      handleSelectMasterPlanChange(selectedMasterPlan);
    }
    if (localStorage.getItem("selectedAgeByFilter_BasePrice")) {
      const selectedAge = JSON.parse(localStorage.getItem("selectedAgeByFilter_BasePrice"));
      handleSelectAgeChange(selectedAge);
    }
    if (localStorage.getItem("selectedSingleByFilter_BasePrice")) {
      const selectedSingle = JSON.parse(localStorage.getItem("selectedSingleByFilter_BasePrice"));
      handleSelectSingleChange(selectedSingle);
    }
  }, []);

  useEffect(() => {
    setSearchQuery(filterString());
  }, [filterQuery]);

  useEffect(() => {
    if (localStorage.getItem("usertoken")) {
      getpriceList(currentPage, sortConfig, searchQuery);
    } else {
      navigate("/");
    }
  }, [currentPage]);

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
        setError(errorJson.message);
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

  const applyFilters = () => {
    const isAnyFilterApplied = Object.values(filterQueryCalculation).some(query => query !== "");

    if (AllProductListExport.length === 0) {
      setPriceList(priceList);
      return;
    }

    let filtered = AllProductListExport;

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

    filtered = applyNumberFilter(filtered, filterQueryCalculation.price_per_sqft, 'price_per_sqft');


    if (isAnyFilterApplied) {
      setPriceList(filtered.slice(0, 100));
      setProductListCount(filtered.length);
      setNpage(Math.ceil(filtered.length / recordsPage));
      setFilter(true);
      setNormalFilter(false);
    } else {
      setPriceList(filtered.slice(0, 100));
      setProductListCount(filtered.length);
      setNpage(Math.ceil(filtered.length / recordsPage));
      setCurrentPage(1);
      setFilter(false);
      setNormalFilter(false);
    }
  };

  useEffect(() => {
    applyFilters();
  }, [filterQueryCalculation]);

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
      const response = await AdminPriceService.accessField();
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

  const product = useRef();

  const stringifySortConfig = (sortConfig) => {
    return sortConfig.map((sort) => `${sort.key}:${sort.direction}`).join(",");
  };

  const bulkPrice = useRef();

  const getpriceList = async (pageNumber, sortConfig, searchQuery) => {
    setIsLoading(true);
    setExcelLoading(true);
    setSearchQuery(searchQuery);
    localStorage.setItem("searchQueryByBasePricesFilter", JSON.stringify(searchQuery));
    try {
      let sortConfigString = "";
      if (sortConfig !== null) {
        sortConfigString = "&sortConfig=" + stringifySortConfig(sortConfig);
      }
      const response = await AdminPriceService.index(
        pageNumber,
        sortConfigString,
        searchQuery
      );
      const responseData = await response.json();
      setIsLoading(false);
      setExcelLoading(false);
      setPriceList(responseData.data);
      setNpage(Math.ceil(responseData.meta.total / recordsPage));
      setProductListCount(responseData.meta.total);
      if (responseData.meta.total > 100) {
        FetchAllPages(searchQuery, sortConfig, responseData.data, responseData.meta.total);
      } else {
        setAllBuilderExport(responseData.data);
      }
    } catch (error) {
      if (error.name === "HTTPError") {
        setIsLoading(false);
        setExcelLoading(false);
        const errorJson = await error.response.json();
        setError(errorJson.message);
      }
    }
    setIsLoading(false);
  };

  // const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  const FetchAllPages = async (searchQuery, sortConfig, priceList, productListCount) => {
    setExcelLoading(true);
    const totalPages = Math.ceil(productListCount / recordsPage);
    let allData = priceList;
    for (let page = 2; page <= totalPages; page++) {
      // await delay(1000);
      const pageResponse = await AdminPriceService.index(page, searchQuery, sortConfig ? `&sortConfig=${stringifySortConfig(sortConfig)}` : "");
      const pageData = await pageResponse.json();
      allData = allData.concat(pageData.data);
    }
    setAllBuilderExport(allData);
    setExcelLoading(false);
  }


  const handleDelete = async (e) => {
    try {
      let responseData = await AdminPriceService.destroy(e).json();
      if (responseData.status === true) {
        getpriceList(currentPage, sortConfig, searchQuery);
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
      let responseData = await AdminPriceService.bulkdestroy(id).json();
      if (responseData.status === true) {
        getpriceList(currentPage, sortConfig, searchQuery);
      }
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(errorJson.message);
      }
    }
  };

  const handleCallback = () => {
    getpriceList(currentPage, sortConfig, searchQuery);
  };

  const handleRowClick = async (id) => {
    setShowOffcanvas(true);
    setIsFormLoading(true);
    try {
      let responseData = await AdminPriceService.show(id).json();
      setPriceDetails(responseData);
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

  const [builderDropDown, setBuilderDropDown] = useState([]);
  const [SubdivisionList, SetSubdivisionList] = useState([]);
  const [selectedBuilderName, setSelectedBuilderName] = useState([]);
  const [selectedSubdivisionName, setSelectedSubdivisionName] = useState([]);
  const [selectedAge, setSelectedAge] = useState([]);
  const [selectedSingle, setSelectedSingle] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);

  const HandleFilter = (e) => {
    const { name, value } = e.target;
    setFilterQuery((prevFilterQuery) => ({
      ...prevFilterQuery,
      [name]: value,
    }));
    setNormalFilter(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilterQueryCalculation(prevFilterQuery => ({
      ...prevFilterQuery,
      [name]: value
    }));
    setFilter(true);
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
    setNormalFilter(true);
  };

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
      name: "",
      builder_name: "",
      subdivision_name: "",
      sqft: "",
      stories: "",
      bedroom: "",
      bathroom: "",
      garage: "",
      baseprice: "",
      product_type: "",
      area: "",
      masterplan_id: "",
      zipcode: "",
      lotwidth: "",
      lotsize: "",
      zoning: "",
      age: "",
      single: ""
    });
    setFilterQueryCalculation({
      price_per_sqft: ""
    })
    setSelectedBuilderName([]);
    setSelectedSubdivisionName([]);
    setProductTypeStatus([]);
    setSelectedArea([]);
    setSelectedMasterPlan([]);
    setSelectedAge([]);
    setSelectedSingle([]);
    getpriceList(1, sortConfig, "");
    setManageFilterOffcanvas(false);
    localStorage.removeItem("selectedBuilderNameByFilter_BasePrice");
    localStorage.removeItem("selectedSubdivisionNameByFilter_BasePrice");
    localStorage.removeItem("productTypeStatusByFilter_BasePrice");
    localStorage.removeItem("selectedAreaByFilter_BasePrice");
    localStorage.removeItem("selectedMasterPlanByFilter_BasePrice");
    localStorage.removeItem("selectedAgeByFilter_BasePrice");
    localStorage.removeItem("selectedSingleByFilter_BasePrice");
    localStorage.removeItem("from_BasePrice");
    localStorage.removeItem("to_BasePrice");
    localStorage.removeItem("builder_name_BasePrice");
    localStorage.removeItem("subdivision_name_BasePrice");
    localStorage.removeItem("product_name_BasePrice");
    localStorage.removeItem("sqft_BasePrice");
    localStorage.removeItem("stories_BasePrice");
    localStorage.removeItem("bedroom_BasePrice");
    localStorage.removeItem("bathroom_BasePrice");
    localStorage.removeItem("garage_BasePrice");
    localStorage.removeItem("baseprice_BasePrice");
    localStorage.removeItem("product_type_BasePrice");
    localStorage.removeItem("area_BasePrice");
    localStorage.removeItem("masterplan_id_BasePrice");
    localStorage.removeItem("zipcode_BasePrice");
    localStorage.removeItem("lotwidth_BasePrice");
    localStorage.removeItem("lotsize_BasePrice");
    localStorage.removeItem("age_BasePrice");
    localStorage.removeItem("single_BasePrice");
    localStorage.removeItem("setBasePriceFilter");
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
    setNormalFilter(true);
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
    setNormalFilter(true);
  };

  const parseDate = (dateString) => {
    const [month, day, year] = dateString.split('/');
    return new Date(year, month - 1, day);
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
        const inputData = {
          csv: iFile,
        };
        console.log(inputData);
        try {
          let responseData = await AdminPriceService.import(inputData).json();
          setSelectedFile("");
          console.log(responseData)
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
                getpriceList(currentPage, sortConfig, searchQuery);
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
                  getpriceList(currentPage, sortConfig, searchQuery);
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
      if (totaldays < 184) {
        e.preventDefault();
        getpriceList(1, sortConfig, searchQuery);
        setManageFilterOffcanvas(false);
        localStorage.setItem("selectedBuilderNameByFilter_BasePrice", JSON.stringify(selectedBuilderName));
        localStorage.setItem("selectedSubdivisionNameByFilter_BasePrice", JSON.stringify(selectedSubdivisionName));
        localStorage.setItem("productTypeStatusByFilter_BasePrice", JSON.stringify(productTypeStatus));
        localStorage.setItem("selectedAreaByFilter_BasePrice", JSON.stringify(selectedArea));
        localStorage.setItem("selectedMasterPlanByFilter_BasePrice", JSON.stringify(selectedMasterPlan));
        localStorage.setItem("selectedAgeByFilter_BasePrice", JSON.stringify(selectedAge));
        localStorage.setItem("selectedSingleByFilter_BasePrice", JSON.stringify(selectedSingle));
        localStorage.setItem("from_BasePrice", JSON.stringify(filterQuery.from));
        localStorage.setItem("to_BasePrice", JSON.stringify(filterQuery.to));
        localStorage.setItem("builder_name_BasePrice", JSON.stringify(filterQuery.builder_name));
        localStorage.setItem("subdivision_name_BasePrice", JSON.stringify(filterQuery.subdivision_name));
        localStorage.setItem("product_name_BasePrice", JSON.stringify(filterQuery.name));
        localStorage.setItem("sqft_BasePrice", JSON.stringify(filterQuery.sqft));
        localStorage.setItem("stories_BasePrice", JSON.stringify(filterQuery.stories));
        localStorage.setItem("bedroom_BasePrice", JSON.stringify(filterQuery.bedroom));
        localStorage.setItem("bathroom_BasePrice", JSON.stringify(filterQuery.bathroom));
        localStorage.setItem("garage_BasePrice", JSON.stringify(filterQuery.garage));
        localStorage.setItem("baseprice_BasePrice", JSON.stringify(filterQuery.baseprice));
        localStorage.setItem("product_type_BasePrice", JSON.stringify(filterQuery.product_type));
        localStorage.setItem("area_BasePrice", JSON.stringify(filterQuery.area));
        localStorage.setItem("masterplan_id_BasePrice", JSON.stringify(filterQuery.masterplan_id));
        localStorage.setItem("zipcode_BasePrice", JSON.stringify(filterQuery.zipcode));
        localStorage.setItem("lotwidth_BasePrice", JSON.stringify(filterQuery.lotwidth));
        localStorage.setItem("lotsize_BasePrice", JSON.stringify(filterQuery.lotsize));
        localStorage.setItem("age_BasePrice", JSON.stringify(filterQuery.age));
        localStorage.setItem("single_BasePrice", JSON.stringify(filterQuery.single));
        localStorage.setItem("searchQueryByBasePricesFilter", JSON.stringify(searchQuery));
      } else {
        setShowPopup(true);
        setMessage("Please select date between 183 days.");
        return;
      }
    }
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

  const GetProductDropDownList = async () => {
    try {
      const response = await AdminProductService.productDropDown();
      const responseData = await response.json();
      const formattedData = responseData.map((product) => ({
        label: product.name,
        value: product.id,
      }));
      setProductList(formattedData);
    } catch (error) {
      console.log("Error fetching builder list:", error);
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(errorJson.message);
      }
    }
  };

  useEffect(() => {
    GetProductDropDownList();
  }, []);

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
      }).join('');
  }

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

  const totalSumFields = (field) => {
    if (field == "sqft") {
      return AllProductListExport.reduce((sum, prices) => {
        return sum + (prices.product && prices.product.sqft || 0);
      }, 0);
    }
    if (field == "stories") {
      return AllProductListExport.reduce((sum, prices) => {
        return sum + (prices.product && prices.product.stories || 0);
      }, 0);
    }
    if (field == "bedroom") {
      return AllProductListExport.reduce((sum, prices) => {
        return sum + (prices.product && prices.product.bedroom || 0);
      }, 0);
    }
    if (field == "bathroom") {
      return AllProductListExport.reduce((sum, prices) => {
        return sum + (prices.product && prices.product.bathroom || 0);
      }, 0);
    }
    if (field == "garage") {
      return AllProductListExport.reduce((sum, prices) => {
        return sum + (prices.product && prices.product.garage || 0);
      }, 0);
    }
    if (field == "baseprice") {
      return AllProductListExport.reduce((sum, prices) => {
        return sum + (prices.baseprice || 0);
      }, 0);
    }
    if (field == "price_per_sqft") {
      if (filter) {
        return priceList.reduce((sum, prices) => {
          return sum + (prices.price_per_sqft || 0);
        }, 0);
      } else {
        return AllProductListExport.reduce((sum, prices) => {
          return sum + (prices.price_per_sqft || 0);
        }, 0);
      }
    }
    if (field == "lotwidth") {
      return AllProductListExport.reduce((sum, prices) => {
        return sum + (prices.product && prices.product.subdivision.lotwidth || 0);
      }, 0);
    }
    if (field == "lotsize") {
      return AllProductListExport.reduce((sum, prices) => {
        return sum + (prices.product && prices.product.subdivision.lotsize || 0);
      }, 0);
    }
  };

  const averageFields = (field) => {
    if (field == "price_per_sqft") {
      const sum = totalSumFields(field);
      if (filter) {
        return sum / priceList.length;
      } else {
        return sum / AllProductListExport.length;
      }
    } else {
      const sum = totalSumFields(field);
      return sum / AllProductListExport.length;
    }
  };

  const handleSelectChange = (e, field) => {
    const value = e.target.value;

    switch (field) {
      case "sqft":
        setSquareFootageOption(value);
        setStoriesOption("");
        setBedroomsOption("");
        setBathroomOption("");
        setGarageOption("");
        setBasePriceOption("");
        setPricePerSQFTOption("");
        setLotWidthOption("");
        setLotSizeOption("");

        setStoriesResult(0);
        setBedroomsResult(0);
        setBathroomResult(0);
        setGarageResult(0);
        setBasePriceResult(0);
        setPricePerSQFTResult(0);
        setLotWidthResult(0);
        setLotSizeResult(0);

        if (value === 'sum') {
          setSquareFootageResult(totalSumFields(field));
        } else if (value === 'avg') {
          setSquareFootageResult(averageFields(field));
        }
        break;

      case "stories":
        setStoriesOption(value);
        setSquareFootageOption("");
        setBedroomsOption("");
        setBathroomOption("");
        setGarageOption("");
        setBasePriceOption("");
        setPricePerSQFTOption("");
        setLotWidthOption("");
        setLotSizeOption("");

        setSquareFootageResult(0);
        setBedroomsResult(0);
        setBathroomResult(0);
        setGarageResult(0);
        setBasePriceResult(0);
        setPricePerSQFTResult(0);
        setLotWidthResult(0);
        setLotSizeResult(0);

        if (value === 'sum') {
          setStoriesResult(totalSumFields(field));
        } else if (value === 'avg') {
          setStoriesResult(averageFields(field));
        }
        break;

      case "bedroom":
        setBedroomsOption(value);
        setSquareFootageOption("");
        setStoriesOption("");
        setBathroomOption("");
        setGarageOption("");
        setBasePriceOption("");
        setPricePerSQFTOption("");
        setLotWidthOption("");
        setLotSizeOption("");

        setSquareFootageResult(0);
        setStoriesResult(0);
        setBathroomResult(0);
        setGarageResult(0);
        setBasePriceResult(0);
        setPricePerSQFTResult(0);
        setLotWidthResult(0);
        setLotSizeResult(0);

        if (value === 'sum') {
          setBedroomsResult(totalSumFields(field));
        } else if (value === 'avg') {
          setBedroomsResult(averageFields(field));
        }
        break;

      case "bathroom":
        setBathroomOption(value);
        setSquareFootageOption("");
        setStoriesOption("");
        setBedroomsOption("");
        setGarageOption("");
        setBasePriceOption("");
        setPricePerSQFTOption("");
        setLotWidthOption("");
        setLotSizeOption("");

        setSquareFootageResult(0);
        setStoriesResult(0);
        setBedroomsResult(0);
        setGarageResult(0);
        setBasePriceResult(0);
        setPricePerSQFTResult(0);
        setLotWidthResult(0);
        setLotSizeResult(0);

        if (value === 'sum') {
          setBathroomResult(totalSumFields(field));
        } else if (value === 'avg') {
          setBathroomResult(averageFields(field));
        }
        break;

      case "garage":
        setGarageOption(value);
        setSquareFootageOption("");
        setStoriesOption("");
        setBedroomsOption("");
        setBathroomOption("");
        setBasePriceOption("");
        setPricePerSQFTOption("");
        setLotWidthOption("");
        setLotSizeOption("");

        setSquareFootageResult(0);
        setStoriesResult(0);
        setBedroomsResult(0);
        setBathroomResult(0);
        setBasePriceResult(0);
        setPricePerSQFTResult(0);
        setLotWidthResult(0);
        setLotSizeResult(0);

        if (value === 'sum') {
          setGarageResult(totalSumFields(field));
        } else if (value === 'avg') {
          setGarageResult(averageFields(field));
        }
        break;

      case "baseprice":
        setBasePriceOption(value);
        setSquareFootageOption("");
        setStoriesOption("");
        setBedroomsOption("");
        setBathroomOption("");
        setGarageOption("");
        setPricePerSQFTOption("");
        setLotWidthOption("");
        setLotSizeOption("");

        setSquareFootageResult(0);
        setStoriesResult(0);
        setBedroomsResult(0);
        setBathroomResult(0);
        setGarageResult(0);
        setPricePerSQFTResult(0);
        setLotWidthResult(0);
        setLotSizeResult(0);

        if (value === 'sum') {
          setBasePriceResult(totalSumFields(field));
        } else if (value === 'avg') {
          setBasePriceResult(averageFields(field));
        }
        break;

      case "price_per_sqft":
        setPricePerSQFTOption(value);
        setSquareFootageOption("");
        setStoriesOption("");
        setBedroomsOption("");
        setBathroomOption("");
        setGarageOption("");
        setBasePriceOption("");
        setLotWidthOption("");
        setLotSizeOption("");

        setSquareFootageResult(0);
        setStoriesResult(0);
        setBedroomsResult(0);
        setBathroomResult(0);
        setGarageResult(0);
        setBasePriceResult(0);
        setLotWidthResult(0);
        setLotSizeResult(0);

        if (value === 'sum') {
          setPricePerSQFTResult(totalSumFields(field));
        } else if (value === 'avg') {
          setPricePerSQFTResult(averageFields(field));
        }
        break;

      case "lotwidth":
        setLotWidthOption(value);
        setSquareFootageOption("");
        setStoriesOption("");
        setBedroomsOption("");
        setBathroomOption("");
        setGarageOption("");
        setBasePriceOption("");
        setPricePerSQFTOption("");
        setLotSizeOption("");

        setSquareFootageResult(0);
        setStoriesResult(0);
        setBedroomsResult(0);
        setBathroomResult(0);
        setGarageResult(0);
        setBasePriceResult(0);
        setPricePerSQFTResult(0);
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
        setStoriesOption("");
        setBedroomsOption("");
        setBathroomOption("");
        setGarageOption("");
        setBasePriceOption("");
        setPricePerSQFTOption("");
        setLotWidthOption("");

        setSquareFootageResult(0);
        setStoriesResult(0);
        setBedroomsResult(0);
        setBathroomResult(0);
        setGarageResult(0);
        setBasePriceResult(0);
        setPricePerSQFTResult(0);
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
      .filter((field) => field !== 'Action' && field !== 'Price Per SQFT')
      .map((field) => {
        let value = field.charAt(0).toLowerCase() + field.slice(1).replace(/\s+/g, '');

        if (value === 'squreFootage') {
          value = 'sqft';
        }
        if (value === 'bedrooms') {
          value = 'bedroom';
        }
        if (value === 'basePrice') {
          value = 'baseprice';
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
        if (value === 'ageRestricted') {
          value = 'age';
        }
        if (value === 'allSingleStory') {
          value = 'single';
        }
        if (value === '__pkPriceID') {
          value = 'id';
        }
        if (value === '_fkProductID') {
          value = '_fkProductID';
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
    getpriceList(currentPage, sortingConfig, searchQuery);
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
    <Fragment>
      <MainPagetitle
        mainTitle="Base Price"
        pageTitle="Base Price"
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
                      <h4 className="heading mb-0">Base Price List</h4>
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

                    <div className="mt-2" style={{width: "100%"}}>
                      {SyestemUserRole == "Data Uploader" ||
                        SyestemUserRole == "User" || SyestemUserRole == "Standard User" ? (
                        <div style={{ marginTop: "10px" }}>
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
                          <button disabled={excelDownload} onClick={() => setExportModelShow(true)} className="btn btn-primary btn-sm me-1" title="Export .csv">
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
                          <button disabled={excelDownload} onClick={() => setExportModelShow(true)} className="btn btn-primary btn-sm me-1" title="Export .csv">
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
                          <input
                            type="file"
                            id="fileInput"
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                          />
                          <Link
                            to={"#"}
                            className="btn btn-primary btn-sm ms-1"
                            data-bs-toggle="offcanvas"
                            onClick={() => product.current.showEmployeModal()}
                          >
                            <div style={{ fontSize: "11px" }}>
                              <i className="fa fa-plus" />&nbsp;
                              Add Base Price
                            </div>
                          </Link>
                          <Link
                            to={"#"}
                            className="btn btn-primary btn-sm ms-1"
                            data-bs-toggle="offcanvas"
                            onClick={() => selectedLandSales.length > 0 ? bulkPrice.current.showEmployeModal() : swal({
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
                      Showing {lastIndex - recordsPage} to {lastIndex} of{" "}
                      {productListCount} entries
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
                        className="table ItemsCheckboxSec dataTable no-footer mb-0 price-table"
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
                              <th style={{ textAlign: "center" }} key={column.id}>
                                <strong>
                                  {column.id == "squre Footage" ? "Square Footage" : column.label}
                                  {column.id != "action" && sortConfig.some(
                                    (item) => item.key === (
                                      column.id == "date" ? "date" :
                                      column.id == "product Type" ? "product_type" :
                                      column.id == "master Plan" ? "masterplan_id" :
                                      column.id == "zip Code" ? "zipcode" :
                                      column.id == "squre Footage" ? "sqft" :
                                      column.id == "bedrooms" ? "bedroom" :
                                      column.id == "base Price" ? "baseprice" :
                                      column.id == "price Per SQFT" ? "perSQFT" :
                                      column.id == "lot Width" ? "lotwidth" :
                                      column.id == "lot Size" ? "lotsize" :
                                      column.id == "age Restricted" ? "age" :
                                      column.id == "all Single Story" ? "single" :
                                      column.id == "__pkPriceID" ? "id" :
                                      column.id == "_fkProductID" ? "_fkProductID" : toCamelCase(column.id))
                                  ) && (
                                      <span>
                                        {column.id != "action" && sortConfig.find(
                                          (item) => item.key === (
                                            column.id == "date" ? "date" :
                                            column.id == "product Type" ? "product_type" :
                                            column.id == "master Plan" ? "masterplan_id" :
                                            column.id == "zip Code" ? "zipcode" :
                                            column.id == "squre Footage" ? "sqft" :
                                            column.id == "bedrooms" ? "bedroom" :
                                            column.id == "base Price" ? "baseprice" :
                                            column.id == "price Per SQFT" ? "perSQFT" :
                                            column.id == "lot Width" ? "lotwidth" :
                                            column.id == "lot Size" ? "lotsize" :
                                            column.id == "age Restricted" ? "age" :
                                            column.id == "all Single Story" ? "single" :
                                            column.id == "__pkPriceID" ? "id" :
                                            column.id == "_fkProductID" ? "_fkProductID" : toCamelCase(column.id))
                                        ).direction === "asc" ? "↑" : "↓"}
                                      </span>
                                    )}
                                </strong>

                                {(!excelLoading) && (column.id !== "date" && column.id !== "builder Name" && column.id !== "subdivision Name" && column.id !== "product Name" &&
                                  column.id !== "product Type" && column.id !== "area" && column.id !== "master Plan" && column.id !== "zip Code" && column.id !== "zoning" &&
                                  column.id !== "age Restricted" && column.id !== "all Single Story" && column.id !== "__pkPriceID" && column.id !== "_fkProductID" && column.id !== "action"
                                ) &&
                                  (
                                    <>
                                      <br />
                                      <select className="custom-select"
                                        value={
                                          column.id == "squre Footage" ? squareFootageOption :
                                          column.id == "stories" ? storiesOption :
                                          column.id == "bedrooms" ? bedroomsOption :
                                          column.id == "bathroom" ? bathroomOption :
                                          column.id == "garage" ? garageOption :
                                          column.id == "base Price" ? basePriceOption :
                                          column.id == "price Per SQFT" ? pricePerSQFTOption :
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
                                          column.id == "stories" ? handleSelectChange(e, "stories") :
                                          column.id == "bedrooms" ? handleSelectChange(e, "bedroom") :
                                          column.id == "bathroom" ? handleSelectChange(e, "bathroom") :
                                          column.id == "garage" ? handleSelectChange(e, "garage") :
                                          column.id == "base Price" ? handleSelectChange(e, "baseprice") :
                                          column.id == "price Per SQFT" ? handleSelectChange(e, "price_per_sqft") :
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
                                  {column.id == "product Name" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "squre Footage" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{squareFootageResult.toFixed(2)}</td>
                                  }
                                  {column.id == "stories" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{storiesResult.toFixed(2)}</td>
                                  }
                                  {column.id == "bedrooms" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{bedroomsResult.toFixed(2)}</td>
                                  }
                                  {column.id == "bathroom" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{bathroomResult.toFixed(2)}</td>
                                  }
                                  {column.id == "garage" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{garageResult.toFixed(2)}</td>
                                  }
                                  {column.id == "base Price" &&
                                    <td key={column.id} style={{ textAlign: "center" }}><PriceComponent price={basePriceResult} /></td>
                                  }
                                  {column.id == "price Per SQFT" &&
                                    <td key={column.id} style={{ textAlign: "center" }}><PriceComponent price={pricePerSQFTResult} /></td>
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
                                  {column.id == "__pkPriceID" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "_fkProductID" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "action" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                </>
                              ))}
                            </tr>
                          }
                          {priceList !== null && priceList.length > 0 ? (
                            priceList.map((element, index) => (
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
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.product && element.product && element.product.subdivision &&
                                        element.product && element.product.subdivision.builder?.name}</td>
                                    }
                                    {column.id == "subdivision Name" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.product && element.product && element.product.subdivision &&
                                        element.product && element.product.subdivision?.name}</td>
                                    }
                                    {column.id == "product Name" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.product && element.product && element.product.name}</td>
                                    }
                                    {column.id == "squre Footage" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.product && element.product && element.product.sqft}</td>
                                    }
                                    {column.id == "stories" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.product && element.product && element.product.stories}</td>
                                    }
                                    {column.id == "bedrooms" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.product && element.product && element.product.bedroom}</td>
                                    }
                                    {column.id == "bathroom" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.product && element.product && element.product.bathroom}</td>
                                    }
                                    {column.id == "garage" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.product && element.product && element.product.garage}</td>
                                    }
                                    {column.id == "base Price" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{<PriceComponent price={element.baseprice} />}</td>
                                    }
                                    {column.id == "price Per SQFT" &&
                                      <td key={column.id} style={{ textAlign: "center" }}><PriceComponent price={element.price_per_sqft} /></td>
                                    }
                                    {column.id == "product Type" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.product && element.product && element.product.subdivision.product_type}</td>
                                    }
                                    {column.id == "area" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.product && element.product && element.product.subdivision.area}</td>
                                    }
                                    {column.id == "master Plan" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.product && element.product && element.product.subdivision.masterplan_id}</td>
                                    }
                                    {column.id == "zip Code" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.product && element.product && element.product.subdivision.zipcode}</td>
                                    }
                                    {column.id == "lot Width" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.product && element.product.subdivision.lotwidth}</td>
                                    }
                                    {column.id == "lot Size" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.product && element.product.subdivision.lotsize}</td>
                                    }
                                    {column.id == "zoning" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.product && element.product.subdivision.zoning}</td>
                                    }
                                    {column.id == "age Restricted" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.product && element.product.subdivision.age == 1 ? "Yes" : "No"}</td>
                                    }
                                    {column.id == "all Single Story" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.product && element.product.subdivision.single == 1 ? "Yes" : "No"}</td>
                                    }
                                    {column.id == "__pkPriceID" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.id}</td>
                                    }
                                    {column.id == "_fkProductID" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.product && element.product.product_code}</td>
                                    }
                                    {column.id == "action" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>
                                        <div className="d-flex justify-content-center">
                                          <Link
                                            to={`/priceupdate/${element.id}`}
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
                              <td colSpan="11" style={{ textAlign: "center" }}>
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
                      Showing {lastIndex - recordsPage} to {lastIndex} of{" "}
                      {productListCount} entries
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
      </div>

      <PriceOffcanvas
        ref={product}
        Title="Add Base Price"
        parentCallback={handleCallback}
        productList={ProductList}
      />

      <BulkPriceUpdate
        ref={bulkPrice}
        Title="Bulk Edit Base Price"
        parentCallback={handleCallback}
        selectedLandSales={selectedLandSales}
        productList={ProductList}
      />

      <Offcanvas
        show={showOffcanvas}
        onHide={setShowOffcanvas}
        className="offcanvas-end customeoff"
        placement="end"
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="modal-title" id="#gridSystemModal">
            Base Price Details{" "}
          </h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => { setShowOffcanvas(false); clearPriceDetails(); }}
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
                  {PriceDetails.product && PriceDetails.product.subdivision.builder?.name || "NA"}
                </span><br />
                <span className="fw-bold" style={{ fontSize: "40px" }}>
                  {PriceDetails.product && PriceDetails.product.subdivision !== null && PriceDetails.product.subdivision.name !== undefined
                    ? PriceDetails.product.subdivision.name
                    : "NA"
                  }
                </span><br />
                <label className="" style={{ fontSize: "22px" }}><b>PRODUCT NAME:</b>&nbsp;<span>{PriceDetails.product.name || "NA"}</span></label><br />

                <label className="" style={{ fontSize: "22px" }}><b>PRODUCT TYPE:</b>&nbsp;<span>{PriceDetails.product.subdivision?.product_type || "NA"}</span></label><br />

                <hr style={{ borderTop: "2px solid black", width: "60%", marginTop: "10px" }}></hr>

                <div className="d-flex" style={{ marginTop: "5px" }}>
                  <div className="fs-18" style={{ width: "180px" }}><span><b>AREA:</b></span>&nbsp;<span>{PriceDetails.product.subdivision?.area || "NA"}</span></div>
                  <div className="fs-18"><span><b>MASTER PLAN:</b></span>&nbsp;<span>{PriceDetails.product.subdivision?.masterplan_id || "NA"}</span></div>
                </div>
                <label className="fs-18" style={{ marginTop: "5px" }}><b>ZIP CODE:</b>&nbsp;<span>{PriceDetails.product.subdivision?.zipcode || "NA"}</span></label><br />
                <label className="fs-18"><b>CROSS STREETS:</b>&nbsp;<span>{PriceDetails.product.subdivision?.crossstreet || "NA"}</span></label><br />
                <label className="fs-18"><b>JURISDICTION:</b>&nbsp;<span>{PriceDetails.product.subdivision?.juridiction || "NA"}</span></label>

                <hr style={{ borderTop: "2px solid black", width: "60%", marginTop: "10px" }}></hr>

                <div className="d-flex" style={{ marginTop: "5px" }}>
                  <div className="fs-18" style={{ width: "300px" }}><span><b>STATUS:</b></span>&nbsp;<span>        {PriceDetails.product && PriceDetails.product.status === 1 && "Active"}
                    {PriceDetails.product.status === 0 && "Sold Out"}
                    {PriceDetails.product.status === 2 && "Future"}
                    {PriceDetails.product.status === 3 && "Closed"}</span></div>
                  <div className="fs-18"><span><b>RECENT PRICE:</b></span>&nbsp;<span>{(<PriceComponent price={PriceDetails.baseprice} />
                  ) || "NA"}</span></div>
                </div>
                <div className="d-flex" style={{ marginTop: "5px" }}>
                  <div className="fs-18" style={{ width: "300px" }}><span><b>SQFT:</b></span>&nbsp;<span>{PriceDetails.product && PriceDetails.product.sqft || "NA"}</span></div>
                  <div className="fs-18"><span><b>$ per SQFT:</b></span>&nbsp;<span>
                    {(<PriceComponent price={PriceDetails.product && PriceDetails.product.current_price_per_sqft} />
                    ) || "NA"}
                  </span></div>
                </div>
                <div className="d-flex" style={{ marginTop: "5px" }}>
                  <div className="fs-18" style={{ width: "300px" }}><span><b>STORIES:</b></span>&nbsp;<span>{PriceDetails.product.stories || "NA"}</span></div>
                  <div className="fs-18"><span><b>DATE:</b></span>&nbsp;<span>  {<DateComponent date={PriceDetails.date} /> || "NA"}</span></div>
                </div>
                <div className="d-flex" style={{ marginTop: "5px" }}>
                  <div className="fs-18" style={{ width: "300px" }}><span><b>BEDROOMS:</b></span>&nbsp;<span>{PriceDetails.product && PriceDetails.product.bedroom || "NA"}</span></div>
                </div>
                <div className="d-flex" style={{ marginTop: "5px" }}>
                  <div className="fs-18" style={{ width: "300px" }}><span><b>BATHROOMS:</b></span>&nbsp;<span>{PriceDetails.product && PriceDetails.product.bathroom || "NA"}</span></div>
                </div>
                <div className="d-flex" style={{ marginTop: "5px" }}>
                  <div className="fs-18" style={{ width: "300px" }}><span><b>GARAGE:</b></span>&nbsp;<span>{PriceDetails.product && PriceDetails.product.garage || "NA"}</span></div>
                </div>
              </div>
            </div>
          </div>)}
      </Offcanvas>
      <Offcanvas
        show={manageFilterOffcanvas}
        onHide={setManageFilterOffcanvas}
        className="offcanvas-end customeoff"
        placement="end"
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="modal-title" id="#gridSystemModal">
            Filter Base Price{" "}
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
                  <div className="col-md-3 mt-2">
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
                  <div className="col-md-3 mt-2">
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
                  <div className="col-md-3 mt-2">
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
                  <div className="col-md-3 mt-2">
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
                  <div className="col-md-3 mt-2">
                    <label className="form-label">
                      PRODUCT NAME :{" "}
                    </label>
                    <input value={filterQuery.name} name="name" className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-2">
                    <label className="form-label">
                      SQUARE FOOTAGE:{" "}
                    </label>
                    <input name="sqft" value={filterQuery.sqft} className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-2">
                    <label className="form-label">
                      STORIES:{" "}
                    </label>
                    <input name="stories" value={filterQuery.stories} className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-2">
                    <label className="form-label">
                      BEDROOMS:{" "}
                    </label>
                    <input value={filterQuery.bedroom} name="bedroom" className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-2">
                    <label className="form-label">
                      BATH ROOMS:{" "}
                    </label>
                    <input value={filterQuery.bathroom} name="bathroom" className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-2">
                    <label className="form-label">
                      GARAGE:{" "}
                    </label>
                    <input type="text" name="garage" value={filterQuery.garage} className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-2">
                    <label className="form-label">
                      BASE PRICE:{" "}
                    </label>
                    <input name="baseprice" value={filterQuery.baseprice} className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-2 mb-3">
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
                  <div className="col-md-3 mt-2 mb-3">
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
                  <div className="col-md-3 mt-2 mb-3">
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
                  <div className="col-md-3 mt-2 mb-3">
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
                  <div className="col-md-3 mt-2 mb-3">
                    <label className="form-label">
                      LOT WIDTH:{" "}
                    </label>
                    <input value={filterQuery.lotwidth} name="lotwidth" className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-2 mb-3">
                    <label className="form-label">
                      LOT SIZE:{" "}
                    </label>
                    <input value={filterQuery.lotsize} name="lotsize" className="form-control" onChange={HandleFilter} />
                  </div>

                  <div className="col-md-3 mt-2 mb-3">
                    <label htmlFor="exampleFormControlInput8" className="form-label">AGE RESTRICTED:{" "}</label>
                    <MultiSelect
                      name="age"
                      options={ageOptions}
                      value={selectedAge}
                      onChange={handleSelectAgeChange}
                      placeholder={"Select Age"}
                    />
                  </div>
                  <div className="col-md-3 mt-2 mb-3">
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
            <div className="d-flex justify-content-between mt-3">
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
                    <div className="col-md-3 mt-3">
                      <label className="form-label">
                        PRICE PER SQFT:{" "}
                      </label>
                      <input name="price_per_sqft" value={filterQueryCalculation.price_per_sqft} className="form-control" onChange={handleInputChange} />
                    </div>
                  </div>
                </div>
              </>
            }
          </div>
        </div>
      </Offcanvas>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Import Base Price CSV Data</Modal.Title>
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

      <Modal show={exportmodelshow} onHide={() => setExportModelShow(true)}>
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
                      {col.label == "Squre Footage" ? "Square Footage" : col.label}
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
              disabled={excelDownload}
              onClick={handleDownloadExcel}
            >
              {excelDownload ? "Downloading..." : "Download"}
            </button>
          </Modal.Footer>
        </>
      </Modal>
      <Offcanvas
        show={manageAccessOffcanvas}
        onHide={setManageAccessOffcanvas}
        className="offcanvas-end customeoff"
        placement="end"
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="modal-title" id="#gridSystemModal">
            Manage Price Fields Access{" "}
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
                            {element.field_name == "Squre Footage" ? "Square Footage" : element.field_name}
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
    </Fragment>
  );
};

export default PriceList;
