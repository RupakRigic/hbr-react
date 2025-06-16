import React, { useState, useEffect, useRef, Fragment } from "react";
import AdminProductService from "../../../API/Services/AdminService/AdminProductService";
import { Link, useLocation, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import ProductOffcanvas from "./ProductOffcanvas";
import MainPagetitle from "../../layouts/MainPagetitle";
import { Offcanvas, Form, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import ClipLoader from "react-spinners/ClipLoader";
import AdminSubdevisionService from "../../../API/Services/AdminService/AdminSubdevisionService";
import PriceComponent from "../../components/Price/PriceComponent";
import DateComponent from "../../components/date/DateFormat";
import AccessField from "../../components/AccssFieldComponent/AccessFiled";
import Modal from "react-bootstrap/Modal";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import ColumnReOrderPopup from "../../popup/ColumnReOrderPopup";
import BulkProductUpdate from "./BulkProductUpdate";
import AdminBuilderService from "../../../API/Services/AdminService/AdminBuilderService";
import { MultiSelect } from "react-multi-select-component";
import '../../pages/Subdivision/subdivisionList.css';
import Swal from "sweetalert2";

const ProductList = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const page = JSON.parse(queryParams.get("page")) === 1 ? null : JSON.parse(queryParams.get("page"));

  const [excelLoading, setExcelLoading] = useState(false);
  const [excelDownload, setExcelDownload] = useState(false);

  const SyestemUserRole = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).role
    : "";

  const [selectedLandSales, setSelectedLandSales] = useState([]);
  const bulkProduct = useRef();

  const handleEditCheckboxChange = (e, userId) => {
    if (e.target.checked) {
      setSelectedLandSales((prevSelectedUsers) => [...prevSelectedUsers, userId]);
    } else {
      setSelectedLandSales((prevSelectedUsers) => prevSelectedUsers.filter((id) => id !== userId));
    }
  };


  const [AllProductListExport, setAllBuilderExport] = useState([]);
  const [Error, setError] = useState("");
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(localStorage.getItem("searchQueryByProductFilter_Product") ? JSON.parse(localStorage.getItem("searchQueryByProductFilter_Product")) : "");
  const [productList, setProductList] = useState([]);
  const [productListCount, setProductsListCount] = useState('');
  const [subdivisionListDropDown, setSubdivisionListDropDown] = useState([]);
  const [exportmodelshow, setExportModelShow] = useState(false)
  const [selectAll, setSelectAll] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([]);

  const [builderDropDown, setBuilderDropDown] = useState([]);
  const [masterPlanDropDownList, setMasterPlanDropDownList] = useState([]);
  const [selectedBuilderName, setSelectedBuilderName] = useState([]);
  const [selectedSubdivisionName, setSelectedSubdivisionName] = useState([]);
  const [selectedMasterPlan, setSelectedMasterPlan] = useState([]);
  const [selectedAge, setSelectedAge] = useState([]);
  const [selectedSingle, setSelectedSingle] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);

  const resetSelection = () => {
    setSelectAll(false);
    setSelectedColumns([]);
  };

  const [manageFilterOffcanvas, setManageFilterOffcanvas] = useState(false);

  const headers = [
    { label: 'Status', key: 'Status' },
    { label: 'Builder Name', key: 'buildername' },
    { label: 'Subdivision Name', key: 'subdivname' },
    { label: 'Product Name', key: 'producutname' },
    { label: 'Square Footage', key: 'squarefootage' },
    { label: 'Stories', key: 'stories' },
    { label: 'Bedrooms', key: 'bedrooms' },
    { label: 'Bathrooms', key: 'bathrooms' },
    { label: 'Garage', key: 'garage' },
    { label: 'Current Base Price', key: 'currentbaseprice' },
    { label: 'Current Price Per SQFT', key: 'currentprice' },
    { label: 'Product Website', key: 'productwebsite' },
    { label: 'Product Type', key: 'producttype' },
    { label: 'Area', key: 'area' },
    { label: 'Master Plan', key: 'masterplan' },
    { label: 'ZIP Code', key: 'zipcode' },
    { label: 'Lot Width', key: 'lotwidth' },
    { label: 'Lot Size', key: 'lotsize' },
    { label: 'Zoning', key: 'zoning' },
    { label: 'Age Restricted', key: 'agerestricted' },
    { label: 'All Single Story', key: 'singlestory' },
    { label: 'Product ID', key: 'productid' },
    { label: 'Fk Sub ID', key: 'fksubid' },
    { label: 'Price Change Since Open', key: 'productid' },
    { label: 'Price Change Last 12 Months', key: 'fksubid' },
  ];

  const exportColumns = [
    { label: 'Status', key: 'status' },
    { label: 'Builder Name', key: 'builderName' },
    { label: 'Subdivision Name', key: 'subdivisionName' },
    { label: 'Product Name', key: 'name' },
    { label: 'Square Footage', key: 'sqft' },
    { label: 'Stories', key: 'stories' },
    { label: 'Bedrooms', key: 'bedroom' },
    { label: 'Bathrooms', key: 'bathroom' },
    { label: 'Garage', key: 'garage' },
    { label: 'Current Base Price', key: 'latestBasePrice' },
    { label: 'Current Price Per SQFT', key: 'currentprice' },
    { label: 'Product Website', key: 'productwebsite' },
    { label: 'Product Type', key: 'producttype' },
    { label: 'Area', key: 'area' },
    { label: 'Master Plan', key: 'masterplan' },
    { label: 'ZIP Code', key: 'zipcode' },
    { label: 'Lot Width', key: 'lotwidth' },
    { label: 'Lot Size', key: 'lotsize' },
    { label: 'Zoning', key: 'zoning' },
    { label: 'Age Restricted', key: 'agerestricted' },
    { label: 'All Single Story', key: 'singlestory' },
    { label: 'Product ID', key: 'productid' },
    { label: 'Fk Sub ID', key: 'fksubid' },
    { label: 'Price Change Since Open', key: 'pricechangesinceopen' },
    { label: 'Price Change Last 12 Months', key: 'pricechangelasttwelvemonths' },
  ];

  const [filterQuery, setFilterQuery] = useState({
    status: localStorage.getItem("product_status_Product") ? JSON.parse(localStorage.getItem("product_status_Product")) : "",
    builder_name: localStorage.getItem("builder_name_Product") ? JSON.parse(localStorage.getItem("builder_name_Product")) : "",
    subdivision_name: localStorage.getItem("subdivision_name_Product") ? JSON.parse(localStorage.getItem("subdivision_name_Product")) : "",
    name: localStorage.getItem("product_name_Product") ? JSON.parse(localStorage.getItem("product_name_Product")) : "",
    sqft: localStorage.getItem("sqft_Product") ? JSON.parse(localStorage.getItem("sqft_Product")) : "",
    stories: localStorage.getItem("stories_Product") ? JSON.parse(localStorage.getItem("stories_Product")) : "",
    bedroom: localStorage.getItem("bedroom_Product") ? JSON.parse(localStorage.getItem("bedroom_Product")) : "",
    bathroom: localStorage.getItem("bathroom_Product") ? JSON.parse(localStorage.getItem("bathroom_Product")) : "",
    garage: localStorage.getItem("garage_Product") ? JSON.parse(localStorage.getItem("garage_Product")) : "",
    current_base_price: localStorage.getItem("current_base_price_Product") ? JSON.parse(localStorage.getItem("current_base_price_Product")) : "",
    product_type: localStorage.getItem("product_type_Product") ? JSON.parse(localStorage.getItem("product_type_Product")) : "",
    area: localStorage.getItem("area_Product") ? JSON.parse(localStorage.getItem("area_Product")) : "",
    masterplan_id: localStorage.getItem("masterplan_id_Product") ? JSON.parse(localStorage.getItem("masterplan_id_Product")) : "",
    zipcode: localStorage.getItem("zipcode_Product") ? JSON.parse(localStorage.getItem("zipcode_Product")) : "",
    lotwidth: localStorage.getItem("lotwidth_Product") ? JSON.parse(localStorage.getItem("lotwidth_Product")) : "",
    lotsize: localStorage.getItem("lotsize_Product") ? JSON.parse(localStorage.getItem("lotsize_Product")) : "",
    age: localStorage.getItem("age_Product") ? JSON.parse(localStorage.getItem("age_Product")) : "",
    single: localStorage.getItem("single_Product") ? JSON.parse(localStorage.getItem("single_Product")) : "",
  });
  const [filterQueryCalculation, setFilterQueryCalculation] = useState({
    recentpricesqft: "",
    price_changes_since_open: "",
    price_changes_last_12_Month: "",
  });

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
      const response = await AdminProductService.export(currentPage, sortConfigString, searchQuery, "", is_calculated).json();
      if(response.status){
        const tableData = productList?.map((row) => {
          const mappedRow = {};
          tableHeaders.forEach((header) => {
            switch (header) {
              case "Status":
                mappedRow[header] = (row.status === 1 && "Active") || (row.status === 0 && "Sold Out") || (row.status === 2 && "Future") || (row.status === 3 && "Closed");
                break;
              case "Builder Name":
                mappedRow[header] = row.subdivision ? row.subdivision.builder.name : '';
                break;
              case "Subdivision Name":
                mappedRow[header] = row.subdivision ? row.subdivision.name : '';
                break;
              case "Product Name":
                mappedRow[header] = row.name;
                break;
              case "Square Footage":
                mappedRow[header] = row.sqft;
                break;
              case "Stories":
                mappedRow[header] = row.stories;
                break;
              case "Bedrooms":
                mappedRow[header] = row.bedroom;
                break;
              case "Bathrooms":
                mappedRow[header] = row.bathroom;
                break;
              case "Garage":
                mappedRow[header] = row.garage;
                break;
              case "Current Base Price":
                mappedRow[header] = row.recentprice;
                break;
              case "Current Price Per SQFT":
                mappedRow[header] = row.recentpricesqft;
                break;
              case "Product Website":
                mappedRow[header] = row.website;
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
              case "ZIP Code":
                mappedRow[header] = row.zipcode;
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
                mappedRow[header] = (row.age === 1 && "Yes") || (row.age === 0 && "No") || '';
                break;
              case "All Single Story":
                mappedRow[header] = (row.single === 1 && "Yes") || (row.single === 0 && "No") || '';
                break;
              case "Product ID":
                mappedRow[header] = row.product_code;
                break;
              case "Fk Sub ID":
                mappedRow[header] = row.subdivision_code;
                break;
              case "Price Change Since Open":
                mappedRow[header] = row.price_changes_since_open ? row.price_changes_since_open + '%' : "";
                break;
              case "Price Change Last 12 Months":
                mappedRow[header] = row.price_changes_last_12_Month ? row.price_changes_last_12_Month + '%' : "";
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
            saveAs(data, 'products.xlsx');
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
        const response = await AdminProductService.export(currentPage, sortConfigString, searchQuery, exportColumn, "").blob();
        const downloadUrl = URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.setAttribute('download', `products.xlsx`);
        document.body.appendChild(a);
        setExcelDownload(false);
        setExportModelShow(false);
        swal({
          text: "Download Completed"
        }).then((willDelete) => {
          if (willDelete) {
            a.click();
            a.parentNode.removeChild(a);
            setSelectedColumns([]);
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const [isFormLoading, setIsFormLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const product = useRef();

  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [sortConfig, setSortConfig] = useState(() => {
    const savedSortConfig = localStorage.getItem("sortConfigProducts");
    return savedSortConfig ? JSON.parse(savedSortConfig) : [];
  });
  const [selectedFields, setSelectedFields] = useState(() => {
    const saved = localStorage.getItem("selectedFieldsProducts");
    return saved ? JSON.parse(saved) : [];
  });
  const [selectionOrder, setSelectionOrder] = useState(() => {
    const saved = localStorage.getItem("selectionOrderProducts");
    return saved ? JSON.parse(saved) : {};
  });
  const [sortOrders, setSortOrders] = useState(() => {
    const saved = localStorage.getItem("sortOrdersProducts");
    return saved ? JSON.parse(saved) : {};
  });
  const [pageChange, setPageChange] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPage = 100;
  const lastIndex = currentPage * recordsPage;
  const firstIndex = lastIndex - recordsPage;
  const [npage, setNpage] = useState(0);
  const number = [...Array(npage + 1).keys()].slice(1);

  const [ProductDetails, SetProductDetails] = useState({
    subdivision: "",
    product_code: "",
    name: "",
    status: "",
    stories: "",
    garage: "",
    pricechange: "",
    bathroom: "",
    recentprice: "",
    bedroom: "",
    recentpricesqft: "",
    sqft: "",
  });

  const clearProductDetails = () => {
    SetProductDetails({
      subdivision: "",
      product_code: "",
      name: "",
      status: "",
      stories: "",
      garage: "",
      pricechange: "",
      bathroom: "",
      recentprice: "",
      bedroom: "",
      recentpricesqft: "",
      sqft: "",
    });
  };

  const [manageAccessOffcanvas, setManageAccessOffcanvas] = useState(false);
  const [accessList, setAccessList] = useState({});
  const [accessRole, setAccessRole] = useState("Admin");
  const [accessForm, setAccessForm] = useState({});
  const [role, setRole] = useState("Admin");
  const [manageAccessField, setManageAccessField] = useState(false);
  const [fieldList, setFieldList] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  // const fieldList = AccessField({ tableName: "products" });
  const [show, setShow] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const [selectedFileError, setSelectedFileError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleClose = () => setShow(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [columns, setColumns] = useState([]);
  const [draggedColumns, setDraggedColumns] = useState(columns);
  const [filter, setFilter] = useState(false);
  const [normalFilter, setNormalFilter] = useState(false);

  const [calculationData, setCalculationData] = useState({});
  const [handleCallBack, setHandleCallBack] = useState(false);
  const [canvasShowAdd, seCanvasShowAdd] = useState(false);
  const [canvasShowEdit, seCanvasShowEdit] = useState(false);

  const [squareFootageOption, setSquareFootageOption] = useState("");
  const [storiesOption, setStoriesOption] = useState("");
  const [bedRoomsOption, setBedRoomsOption] = useState("");
  const [bathRoomsOption, setBathRoomsOption] = useState("");
  const [garageOption, setGarageOption] = useState("");
  const [currentBasePriceOption, setCurrentBasePriceOption] = useState("");
  const [currentPricePerSQFTOption, setCurrentPricePerSQFTOption] = useState("");
  const [lotWidthOption, setLotWidthOption] = useState("");
  const [lotSizeOption, setLotSizeOption] = useState("");
  const [priceChangeSinceOpenOption, setPriceChangeSinceOpenOption] = useState("");
  const [priceChangeLast12MonthsOption, setPriceChangeLast12MonthsOption] = useState("");

  const [squareFootageResult, setSquareFootageResult] = useState(0);
  const [storiesResult, setStoriesResult] = useState(0);
  const [bedRoomsResult, setBedRoomsResult] = useState(0);
  const [bathRoomsResult, setBathRoomsResult] = useState(0);
  const [garageResult, setGarageResult] = useState(0);
  const [currentBasePriceResult, setCurrentBasePriceResult] = useState(0);
  const [currentPricePerSQFTResult, setCurrentPricePerSQFTResult] = useState(0);
  const [lotWidthResult, setLotWidthResult] = useState(0);
  const [lotSizeResult, setLotSizeResult] = useState(0);
  const [priceChangeSinceOpenResult, setPriceChangeSinceOpenResult] = useState(0);
  const [priceChangeLast12MonthsResult, setPriceChangeLast12MonthsResult] = useState(0);

  const [selectedBuilderIDByFilter, setSelectedBuilderIDByFilter] = useState([]);

  const handleSortingPopupClose = () => setShowSortingPopup(false);
  const [showSortingPopup, setShowSortingPopup] = useState(false);
  const [fieldOptions, setFieldOptions] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const checkFieldExist = (fieldName) => {
    return fieldList.includes(fieldName.trim());
  };


  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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

  useEffect(() => {
    if (handleCallBack && calculationData) {
      Object.entries(calculationData).forEach(([field, value]) => {
        handleSelectChange(value, field);
      });
    }
  }, [handleCallBack, AllProductListExport, productList]);

  useEffect(() => {
    if (selectedLandSales?.length === 0) {
      setHandleCallBack(false);
    }
  }, [selectedLandSales]);

  useEffect(() => {
    const productID = JSON.parse(localStorage.getItem("product_id"));
    if(productID){
      handleRowClick(productID);
    }
  }, []);

  useEffect(() => {
    if(manageFilterOffcanvas) {
      SubdivisionByBuilderIDList(selectedBuilderIDByFilter);
    }
  }, [selectedBuilderIDByFilter, manageFilterOffcanvas]);

  useEffect(() => {
    if (selectedSubdivisionName?.length === 0) {
      setFilterQuery(prevState => ({
        ...prevState,
        subdivision_name: ""
      }));
    }
  }, [selectedSubdivisionName]);

  useEffect(() => {
    if (selectedFields) {
      localStorage.setItem("selectedFieldsProducts", JSON.stringify(selectedFields));
    }
    if (selectionOrder) {
      localStorage.setItem("selectionOrderProducts", JSON.stringify(selectionOrder));
    }
    if (sortOrders) {
      localStorage.setItem("sortOrdersProducts", JSON.stringify(sortOrders));
    }
  }, [selectedFields, selectionOrder, sortOrders]);

  useEffect(() => {
    if (localStorage.getItem("selectedStatusByProductFilter_Product")) {
      const selectedStatus = JSON.parse(localStorage.getItem("selectedStatusByProductFilter_Product"));
      handleSelectStatusChange(selectedStatus);
    }
    if (localStorage.getItem("selectedBuilderNameByFilter_Product")) {
      const selectedBuilderName = JSON.parse(localStorage.getItem("selectedBuilderNameByFilter_Product"));
      handleSelectBuilderNameChange(selectedBuilderName);
    }
    if (localStorage.getItem("selectedSubdivisionNameByFilter_Product")) {
      const selectedSubdivisionName = JSON.parse(localStorage.getItem("selectedSubdivisionNameByFilter_Product"));
      handleSelectSubdivisionNameChange(selectedSubdivisionName);
    }
    if (localStorage.getItem("selectedMasterPlanByFilter_Product")) {
      const selectedMasterPlan = JSON.parse(localStorage.getItem("selectedMasterPlanByFilter_Product"));
      handleSelectMasterPlanChange(selectedMasterPlan);
    }
    if (localStorage.getItem("selectedAgeByFilter_Product")) {
      const selectedAge = JSON.parse(localStorage.getItem("selectedAgeByFilter_Product"));
      handleSelectAgeChange(selectedAge);
    }
    if (localStorage.getItem("selectedSingleByFilter_Product")) {
      const selectedSingle = JSON.parse(localStorage.getItem("selectedSingleByFilter_Product"));
      handleSelectSingleChange(selectedSingle);
    }
  }, []);

  const stringifySortConfig = (sortConfig) => {
    return sortConfig.map((sort) => `${sort.key}:${sort.direction}`).join(",");
  };

  const getproductList = async (pageNumber, sortConfig, searchQuery) => {
    setIsLoading(true);
    setExcelLoading(true);
    setSearchQuery(searchQuery);
    setCurrentPage(pageNumber);
    localStorage.setItem("searchQueryByProductFilter_Product", JSON.stringify(searchQuery));
    try {
      let sortConfigString = "";
      if (sortConfig !== null) {
        sortConfigString = "&sortConfig=" + stringifySortConfig(sortConfig);
      }
      const response = await AdminProductService.index(
        pageNumber,
        sortConfigString,
        searchQuery,
      );
      const responseData = await response.json();
      setIsLoading(false);
      setExcelLoading(false);
      setPageChange(false);
      setProductList(responseData.data);
      setNpage(Math.ceil(responseData.meta.total / recordsPage));
      setProductsListCount(responseData.meta.total);
      setHandleCallBack(true);
      if (responseData.meta.total > 100) {
        if(!pageChange){
          FetchAllPages(searchQuery, sortConfig, responseData.data, responseData.meta.total);
        }
      } else {
        if(!pageChange){
          setAllBuilderExport(responseData.data);
        }
      }
    } catch (error) {
      setIsLoading(false);
      setExcelLoading(false);
      console.log(error);
      if (error.name === "HTTPError") {
        setIsLoading(false);
        const errorJson = await error.response.json();
        setError(errorJson.message);
      }
    }
  };

  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  const FetchAllPages = async (searchQuery, sortConfig, productList, productListCount) => {
    setExcelLoading(true);
    const totalPages = Math.ceil(productListCount / recordsPage);
    let allData = productList;
    if (page !== null) {
      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        // await delay(1000);
        if (pageNum === page) continue;
        const pageResponse = await AdminProductService.index(pageNum, searchQuery, sortConfig ? `&sortConfig=${stringifySortConfig(sortConfig)}` : "");
        const pageData = await pageResponse.json();
        allData = allData.concat(pageData.data);
      }
      setAllBuilderExport(allData);
      setExcelLoading(false);
      setHandleCallBack(true);
    } else {
      for (let page = 2; page <= totalPages; page++) {
        // await delay(1000);
        const pageResponse = await AdminProductService.index(page, searchQuery, sortConfig ? `&sortConfig=${stringifySortConfig(sortConfig)}` : "");
        const pageData = await pageResponse.json();
        allData = allData.concat(pageData.data);
      }
      setAllBuilderExport(allData);
      setExcelLoading(false);
      setHandleCallBack(true);
    }
  }

  useEffect(() => {
    setSearchQuery(filterString());
  }, [filterQuery]);

  useEffect(() => {
    if(manageFilterOffcanvas){
      GetBuilderDropDownList();
      GetMasterPlanDropDownList();
    }
  }, [manageFilterOffcanvas]);

  useEffect(() => {
    if (localStorage.getItem("usertoken")) {
      if(page === currentPage){
        return;
      } else {
        getproductList(page === null ? currentPage : JSON.parse(page), sortConfig, searchQuery);
      }
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

  const GetMasterPlanDropDownList = async () => {
    try {
      const response = await AdminBuilderService.masterPlanDropDown();
      const responseData = await response.json();
      const formattedData = responseData.map((masterPlan) => ({
        label: masterPlan.label,
        value: masterPlan.value,
      }));
      setMasterPlanDropDownList(formattedData);
    } catch (error) {
      console.log("Error fetching master plan list:", error);
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        console.log(errorJson);
      }
    }
  };

  useEffect(() => {
    if (filter) {
      applyFilters();
    }
  }, [filterQueryCalculation]);

  const handleDelete = async (e) => {
    try {
      let responseData = await AdminProductService.destroy(e).json();
      if (responseData.status === true) {
        getproductList(currentPage, sortConfig, searchQuery);
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
      let responseData = await AdminProductService.bulkdestroy(id).json();
      if (responseData.status === true) {
        getproductList(currentPage, sortConfig, searchQuery);
      }
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(errorJson.message);
      }
    }
  };

  const handleCallback = () => {
    getproductList(currentPage, sortConfig, searchQuery);
    setSelectedLandSales([]);
  };

  const HandleRole = (e, role) => {
    if(e) {
      setRole(e.target.value);
      setAccessRole(e.target.value);
    } else {
      setRole(role);
      setAccessRole(role);
    }
  };

  const handleAccessForm = async (e) => {
    e.preventDefault();
    var userData = {
      form: accessForm,
      role: role,
      table: "products",
    };
    try {
      const data = await AdminProductService.manageAccessFields(userData).json();
      if (data.status === true) {
        setManageAccessOffcanvas(false);
        setManageAccessField(true);
      }
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(errorJson.message.substr(0, errorJson.message.lastIndexOf(".")));
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

  useEffect(() => {
    if(localStorage.getItem("user")){
      const userRole = JSON.parse(localStorage.getItem("user")).role;
      HandleRole("", userRole);
    }
  },[]);

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
      const response = await AdminProductService.accessField();
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

  const handleRowClick = async (id) => {
    setShowOffcanvas(true);
    setIsFormLoading(true);
    try {
      let responseData = await AdminProductService.show(id).json();
      SetProductDetails(responseData);
      setIsFormLoading(false);
      localStorage.removeItem("product_id");
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
      status: "",
      builder_name: "",
      subdivision_name: "",
      name: "",
      sqft: "",
      stories: "",
      bedroom: "",
      bathroom: "",
      garage: "",
      current_base_price: "",
      product_type: "",
      area: "",
      masterplan_id: "",
      zipcode: "",
      lotwidth: "",
      lotsize: "",
      age: "",
      single: ""
    })
    setFilterQueryCalculation({
      recentpricesqft: "",
      price_changes_since_open: "",
      price_changes_last_12_Month: ""
    });
    setSelectedStatus([]);
    setSelectedBuilderName([]);
    setSelectedSubdivisionName([]);
    setSelectedAge([]);
    setSelectedSingle([]);
    setSelectedBuilderIDByFilter([]);
    setManageFilterOffcanvas(false);
    getproductList(1, sortConfig, "");
    localStorage.removeItem("selectedStatusByProductFilter_Product");
    localStorage.removeItem("selectedBuilderNameByFilter_Product");
    localStorage.removeItem("selectedSubdivisionNameByFilter_Product");
    localStorage.removeItem("selectedAgeByFilter_Product");
    localStorage.removeItem("selectedSingleByFilter_Product");
    localStorage.removeItem("product_status_Product");
    localStorage.removeItem("builder_name_Product");
    localStorage.removeItem("subdivision_name_Product");
    localStorage.removeItem("product_name_Product");
    localStorage.removeItem("sqft_Product");
    localStorage.removeItem("stories_Product");
    localStorage.removeItem("bedroom_Product");
    localStorage.removeItem("bathroom_Product");
    localStorage.removeItem("garage_Product");
    localStorage.removeItem("current_base_price_Product");
    localStorage.removeItem("product_type_Product");
    localStorage.removeItem("area_Product");
    localStorage.removeItem("masterplan_id_Product");
    localStorage.removeItem("zipcode_Product");
    localStorage.removeItem("lotwidth_Product");
    localStorage.removeItem("lotsize_Product");
    localStorage.removeItem("age_Product");
    localStorage.removeItem("single_Product");
    localStorage.removeItem("setProductFilter_Product");
  };

  const formatDate = (inputDate) => {
    const dateObj = new Date(inputDate);
    return `${dateObj.getMonth() + 1}/${dateObj.getDate()}/${dateObj.getFullYear()}`;
  };

  const handlePriceClick = (id, date) => {
    const formattedDate = formatDate(date);
    navigate("/filterbaseprice");
    localStorage.setItem("from_BasePrice", JSON.stringify(formattedDate));
    localStorage.setItem("to_BasePrice", JSON.stringify(formattedDate));
    localStorage.setItem("price_id", JSON.stringify(id));
    localStorage.setItem("setBasePriceFilter", true);
  };

  const handleFileChange = async (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUploadClick = async () => {
    const file = selectedFile;

    if (file && file.type === "text/csv") {
      setLoading(true);
      setSelectedFileError("");
      setError("");
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
          let responseData = await AdminProductService.import(inputData).json();
          setSelectedFile("");
          document.getElementById("fileInput").value = null;
          setLoading(false);
          console.log(responseData);
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
                getproductList(currentPage, sortConfig, searchQuery);
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
                  getproductList(currentPage, sortConfig, searchQuery);
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
      setError("");
    } else {
      setSelectedFile("");
      setSelectedFileError("Please select a CSV file.");
    }
  };

  const handlBuilderClick = (e) => {
    setShow(true);
  };

  const HandleFilterForm = (e) => {
    const isAnyFilterApplied = Object.values(filterQuery).some(query => query !== "");
    if (!isAnyFilterApplied) {
      localStorage.removeItem("setProductFilter");
    }
    e.preventDefault();
    getproductList(1, sortConfig, searchQuery);
    setManageFilterOffcanvas(false);
    localStorage.setItem("selectedStatusByProductFilter_Product", JSON.stringify(selectedStatus));
    localStorage.setItem("selectedBuilderNameByFilter_Product", JSON.stringify(selectedBuilderName));
    localStorage.setItem("selectedSubdivisionNameByFilter_Product", JSON.stringify(selectedSubdivisionName));
    localStorage.setItem("selectedAgeByFilter_Product", JSON.stringify(selectedAge));
    localStorage.setItem("selectedSingleByFilter_Product", JSON.stringify(selectedSingle));
    localStorage.setItem("product_status_Product", JSON.stringify(filterQuery.status));
    localStorage.setItem("builder_name_Product", JSON.stringify(filterQuery.builder_name));
    localStorage.setItem("subdivision_name_Product", JSON.stringify(filterQuery.subdivision_name));
    localStorage.setItem("product_name_Product", JSON.stringify(filterQuery.name));
    localStorage.setItem("sqft_Product", JSON.stringify(filterQuery.sqft));
    localStorage.setItem("stories_Product", JSON.stringify(filterQuery.stories));
    localStorage.setItem("bedroom_Product", JSON.stringify(filterQuery.bedroom));
    localStorage.setItem("bathroom_Product", JSON.stringify(filterQuery.bathroom));
    localStorage.setItem("garage_Product", JSON.stringify(filterQuery.garage));
    localStorage.setItem("current_base_price_Product", JSON.stringify(filterQuery.current_base_price));
    localStorage.setItem("product_type_Product", JSON.stringify(filterQuery.product_type));
    localStorage.setItem("area_Product", JSON.stringify(filterQuery.area));
    localStorage.setItem("masterplan_id_Product", JSON.stringify(filterQuery.masterplan_id));
    localStorage.setItem("zipcode_Product", JSON.stringify(filterQuery.zipcode));
    localStorage.setItem("lotwidth_Product", JSON.stringify(filterQuery.lotwidth));
    localStorage.setItem("lotsize_Product", JSON.stringify(filterQuery.lotsize));
    localStorage.setItem("age_Product", JSON.stringify(filterQuery.age));
    localStorage.setItem("single_Product", JSON.stringify(filterQuery.single));
    localStorage.setItem("searchQueryByProductFilter_Product", JSON.stringify(searchQuery));
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
    localStorage.setItem("draggedColumnsProducts", JSON.stringify(draggedColumns));
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
    const draggedColumns = JSON.parse(localStorage.getItem("draggedColumnsProducts"));
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

    if (AllProductListExport.length === 0) {
      setProductList(productList);
      return;
    }

    let filtered = AllProductListExport;

    const applyNumberFilter = (items, query, key) => {
      if (query) {
        let operator = '=';
        let value = query;

      const match = query.match(/^(>=|<=|!=|>|<|=)(.*)$/);

          if (match) {
            operator = match[1]; // the operator (>=, <=, >, <, =, !=)
            value = match[2].trim(); // the numeric or string value
          }

        const numberValue = parseFloat(value);
        if (!isNaN(numberValue)) {
          return items.filter(item => {
            const itemValue = parseFloat(item[key]);
            if (operator === '>') return itemValue > numberValue;
            if (operator === '<') return itemValue < numberValue;
            if (operator === '>=') return itemValue >= numberValue;
            if (operator === '<=') return itemValue <= numberValue;
            if (operator === '!=') return itemValue != numberValue;

            return itemValue === numberValue;
          });
        }
      }
      return items;
    };

    filtered = applyNumberFilter(filtered, filterQueryCalculation.recentpricesqft, 'recentpricesqft');
    filtered = applyNumberFilter(filtered, filterQueryCalculation.price_changes_since_open, 'price_changes_since_open');
    filtered = applyNumberFilter(filtered, filterQueryCalculation.price_changes_last_12_Month, 'price_changes_last_12_Month');

    if (isAnyFilterApplied && !normalFilter) {
      setProductList(filtered.slice(0, 100));
      setProductsListCount(filtered.length);
      setNpage(Math.ceil(filtered.length / recordsPage));
      setNormalFilter(false);
      if(isAnyFilterApplied){
        setFilter(true);
      } else {
        setFilter(false);
      }
    } else {
      setProductList(filtered.slice(0, 100));
      setProductsListCount(filtered.length);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilterQueryCalculation(prevFilterQuery => ({
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

  const statusOptions = [
    { value: "1", label: "Active" },
    { value: "0", label: "Sold Out" },
    { value: "2", label: "Future" },
    { value: "3", label: "Closed" }
  ];

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
  }

  const handleSelectSubdivisionNameChange = (selectedItems) => {
    const selectedNames = selectedItems.map(item => item.label).join(', ');
    setSelectedSubdivisionName(selectedItems);
    setFilterQuery(prevState => ({
      ...prevState,
      subdivision_name: selectedNames
    }));
    setNormalFilter(true);
  };

  const handleSelectMasterPlanChange = (selectedItems) => {
    const selectedValues = selectedItems.map(item => item.value).join(', ');
    setSelectedMasterPlan(selectedItems);
    setFilterQuery(prevState => ({
      ...prevState,
      masterplan_id: selectedValues
    }));
    setNormalFilter(true);
  };

  const handleSelectAgeChange = (selectedItems) => {
    const selectedNames = selectedItems.map(item => item.value).join(', ');
    setSelectedAge(selectedItems);
    setFilterQuery(prevState => ({
      ...prevState,
      age: selectedNames
    }));
    setNormalFilter(true);
  };

  const handleSelectSingleChange = (selectedItems) => {
    const selectedNames = selectedItems.map(item => item.value).join(', ');
    setSelectedSingle(selectedItems);
    setFilterQuery(prevState => ({
      ...prevState,
      single: selectedNames
    }));
    setNormalFilter(true);
  };

  const handleSelectStatusChange = (selectedItems) => {
    const selectedNames = selectedItems.map(item => item.value).join(', ');
    setSelectedStatus(selectedItems);
    setFilterQuery(prevState => ({
      ...prevState,
      status: selectedNames
    }));
    setNormalFilter(true);
  };

  function camelCaseToReadable(str) {
    const result = str.replace(/([A-Z])/g, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1);
  }

  const addToBuilderList = () => {
    let subdivisionList = productList.map((data) => data.subdivision)

    navigate('/google-map-locator', {
      state: {
        subdivisionList: subdivisionList,
        product: true
      },
    });
  };

  const totalSumFields = (field) => {
    if (field == "sqft") {
      if (filter) {
        return productList.reduce((sum, products) => {
          return sum + Math.floor(products.sqft || 0);
        }, 0);
      } else {
        return AllProductListExport.reduce((sum, products) => {
          return sum + (products.sqft || 0);
        }, 0);
      }
    }
    if (field == "stories") {
      if (filter) {
        return productList.reduce((sum, products) => {
          return sum + Math.floor(products.stories || 0);
        }, 0);
      } else {
        return AllProductListExport.reduce((sum, products) => {
          return sum + (products.stories || 0);
        }, 0);
      }
    }
    if (field == "bedroom") {
      if (filter) {
        return productList.reduce((sum, products) => {
          return sum + Math.floor(products.bedroom || 0);
        }, 0);
      } else {
        return AllProductListExport.reduce((sum, products) => {
          return sum + (products.bedroom || 0);
        }, 0);
      }
    }
    if (field == "bathroom") {
      if (filter) {
        return productList.reduce((sum, products) => {
          return sum + Math.floor(products.bathroom || 0);
        }, 0);
      } else {
        return AllProductListExport.reduce((sum, products) => {
          return sum + (products.bathroom || 0);
        }, 0);
      }
    }
    if (field == "garage") {
      if (filter) {
        return productList.reduce((sum, products) => {
          return sum + Math.floor(products.garage || 0);
        }, 0);
      } else {
        return AllProductListExport.reduce((sum, products) => {
          return sum + (products.garage || 0);
        }, 0);
      }
    }
    if (field == "recentprice") {
      if (filter) {
        return productList.reduce((sum, products) => {
          return sum + Math.floor(products.recentprice || 0);
        }, 0);
      } else {
        return AllProductListExport.reduce((sum, products) => {
          return sum + Math.floor(products.recentprice || 0);
        }, 0);
      }
    }
    if (field == "recentpricesqft") {
      if (filter) {
        return productList.reduce((sum, products) => {
          return sum + Math.floor(products.recentpricesqft || 0);
        }, 0);
      } else {
        return AllProductListExport.reduce((sum, products) => {
          return sum + Math.floor(products.recentpricesqft || 0);
        }, 0);
      }
    }
    if (field == "lotwidth") {
      if (filter) {
        return productList.reduce((sum, products) => {
          return sum + Math.floor(products.subdivision.lotwidth || 0);
        }, 0);
      } else {
        return AllProductListExport.reduce((sum, products) => {
          return sum + (products.subdivision && products.subdivision.lotwidth || 0);
        }, 0);
      }
    }
    if (field == "lotsize") {
      if (filter) {
        return productList.reduce((sum, products) => {
          return sum + Math.floor(products.subdivision.lotsize || 0);
        }, 0);
      } else {
        return AllProductListExport.reduce((sum, products) => {
          return sum + (products.subdivision && products.subdivision.lotsize || 0);
        }, 0);
      }
    }
    if (field == "price_changes_since_open") {
      if (filter) {
        return productList.reduce((sum, products) => {
          return sum + (products.price_changes_since_open || 0);
        }, 0);
      } else {
        return AllProductListExport.reduce((sum, products) => {
          return sum + (products.price_changes_since_open || 0);
        }, 0);
      }
    }
    if (field == "price_changes_last_12_Month") {
      if (filter) {
        return productList.reduce((sum, products) => {
          return sum + (products.price_changes_last_12_Month || 0);
        }, 0);
      } else {
        return AllProductListExport.reduce((sum, products) => {
          return sum + (products.price_changes_last_12_Month || 0);
        }, 0);
      }
    }
  };

  const averageFields = (field) => {
    const sum = totalSumFields(field);
    if (filter) {
      return sum / productList.length;
    } else {
      return sum / AllProductListExport.length;
    }
  };

  const handleSelectChange = (value, field) => {
    setCalculationData((prevData) => ({
      ...prevData,
      [field]: value,  // Store field and value together
    }));

    switch (field) {
      case "sqft":
        setSquareFootageOption(value);

        if (value === 'sum') {
          setSquareFootageResult(totalSumFields(field));
        } else if (value === 'avg') {
          setSquareFootageResult(averageFields(field));
        }
        break;

      case "stories":
        setStoriesOption(value);

        if (value === 'sum') {
          setStoriesResult(totalSumFields(field));
        } else if (value === 'avg') {
          setStoriesResult(averageFields(field));
        }
        break;

      case "bedroom":
        setBedRoomsOption(value);

        if (value === 'sum') {
          setBedRoomsResult(totalSumFields(field));
        } else if (value === 'avg') {
          setBedRoomsResult(averageFields(field));
        }
        break;

      case "bathroom":
        setBathRoomsOption(value);

        if (value === 'sum') {
          setBathRoomsResult(totalSumFields(field));
        } else if (value === 'avg') {
          setBathRoomsResult(averageFields(field));
        }
        break;

      case "garage":
        setGarageOption(value);

        if (value === 'sum') {
          setGarageResult(totalSumFields(field));
        } else if (value === 'avg') {
          setGarageResult(averageFields(field));
        }
        break;

      case "recentprice":
        setCurrentBasePriceOption(value);

        if (value === 'sum') {
          setCurrentBasePriceResult(totalSumFields(field));
        } else if (value === 'avg') {
          setCurrentBasePriceResult(averageFields(field));
        }
        break;

      case "recentpricesqft":
        setCurrentPricePerSQFTOption(value);

        if (value === 'sum') {
          setCurrentPricePerSQFTResult(totalSumFields(field));
        } else if (value === 'avg') {
          setCurrentPricePerSQFTResult(averageFields(field));
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

      case "price_changes_since_open":
        setPriceChangeSinceOpenOption(value);

        if (value === 'sum') {
          setPriceChangeSinceOpenResult(totalSumFields(field));
        } else if (value === 'avg') {
          setPriceChangeSinceOpenResult(averageFields(field));
        }
        break;

      case "price_changes_last_12_Month":
        setPriceChangeLast12MonthsOption(value);

        if (value === 'sum') {
          setPriceChangeLast12MonthsResult(totalSumFields(field));
        } else if (value === 'avg') {
          setPriceChangeLast12MonthsResult(averageFields(field));
        }
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    const fieldOptions = fieldList
      .filter((field) => field !== 'Action' && field !== 'Price Change Since Open' && field !== 'Price Change Last 12 Months' && field !== 'Current Price Per SQFT')
      .map((field) => {
        let value = field.charAt(0).toLowerCase() + field.slice(1).replace(/\s+/g, '');

        if (value === 'planStatus') {
          value = 'status';
        }
        if (value === 'productName') {
          value = 'name';
        }
        if (value === 'squareFootage') {
          value = 'sqft';
        }
        if (value === 'bedrooms') {
          value = 'bedroom';
        }
        if (value === 'bathrooms') {
          value = 'bathroom';
        }
        if (value === 'currentBasePrice') {
          value = 'recentprice';
        }
        if (value === 'productWebsite') {
          value = 'website';
        }
        if (value === 'productType') {
          value = 'product_type';
        }
        if (value === 'masterPlan') {
          value = 'masterplan_id';
        }
        if (value === 'zIPCode') {
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
          value = 'created_at';
        }
        if (value === '__pkProductID') {
          value = 'product_code';
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
    console.log(5555);
    setShowSortingPopup(true);
  };

  const handleApplySorting = () => {
    const sortingConfig = selectedFields.map((field) => ({
      key: field.value,
      direction: sortOrders[field.value] || 'asc',
    }));
    localStorage.setItem("sortConfigProducts", JSON.stringify(sortingConfig));
    setSortConfig(sortingConfig);
    getproductList(currentPage, sortingConfig, searchQuery);
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
              setSelectedLandSales(productList.map((user) => user.id));
            } else if (selectedOption === "all") {
              setIsSelectAll(true);
              setSelectCheckBox(true);
              setSelectedLandSales(AllProductListExport.map((user) => user.id));
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
        mainTitle="Product"
        pageTitle="Product"
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
                      <h4 className="heading mb-0">Product List</h4>
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
                        <div className="d-flex" style={{ marginTop: "10px" }}>
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
                          <button disabled={excelDownload || productList?.length === 0} onClick={() => setExportModelShow(true)} className="btn btn-primary btn-sm me-1" title="Export .csv">
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
                          <button disabled={excelDownload || productList?.length === 0} onClick={() => setExportModelShow(true)} className="btn btn-primary btn-sm me-1" title="Export .csv">
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
                            title="Map"
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
                              Add Product
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
                        className="table ItemsCheckboxSec dataTable no-footer mb-0 product-table"
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
                                  {column.label}
                                  {column.id != "action" && sortConfig.some(
                                    (item) => item.key === (
                                      column.id == "plan Status" ? "status" :
                                      column.id == "product Name" ? "name" :
                                      column.id == "square Footage" ? "sqft" :
                                      column.id == "bedrooms" ? "bedroom" :
                                      column.id == "bathrooms" ? "bathroom" :
                                      column.id == "current Base Price" ? "recentprice" :
                                      column.id == "product Website" ? "website" :
                                      column.id == "product Type" ? "product_type" :
                                      column.id == "master Plan" ? "masterplan_id" :
                                      column.id == "zIP Code" ? "zipcode" :
                                      column.id == "lot Width" ? "lotwidth" :
                                      column.id == "lot Size" ? "lotsize" :
                                      column.id == "age Restricted" ? "age" :
                                      column.id == "all Single Story" ? "single" :
                                      column.id == "date Added" ? "created_at" :
                                      column.id == "__pkProductID" ? "product_code" :
                                      column.id == "_fkSubID" ? "subdivision_code" : toCamelCase(column.id))
                                  ) && (
                                      <span>
                                        {column.id != "action" && sortConfig.find(
                                          (item) => item.key === (
                                            column.id == "plan Status" ? "status" :
                                            column.id == "product Name" ? "name" :
                                            column.id == "square Footage" ? "sqft" :
                                            column.id == "bedrooms" ? "bedroom" :
                                            column.id == "bathrooms" ? "bathroom" :
                                            column.id == "current Base Price" ? "recentprice" :
                                            column.id == "product Website" ? "website" :
                                            column.id == "product Type" ? "product_type" :
                                            column.id == "master Plan" ? "masterplan_id" :
                                            column.id == "zIP Code" ? "zipcode" :
                                            column.id == "lot Width" ? "lotwidth" :
                                            column.id == "lot Size" ? "lotsize" :
                                            column.id == "age Restricted" ? "age" :
                                            column.id == "all Single Story" ? "single" :
                                            column.id == "date Added" ? "created_at" :
                                            column.id == "__pkProductID" ? "product_code" :
                                            column.id == "_fkSubID" ? "subdivision_code" : toCamelCase(column.id))
                                        ).direction === "asc" ? "↑" : "↓"}
                                      </span>
                                    )}
                                </strong>

                                {(!excelLoading) && (column.id !== "plan Status" && column.id !== "builder Name" && column.id !== "subdivision Name" && column.id !== "product Name" &&
                                  column.id !== "product Website" && column.id !== "product Type" && column.id !== "area" && column.id !== "master Plan" &&
                                  column.id !== "zIP Code" && column.id !== "zoning" && column.id !== "age Restricted" && column.id !== "all Single Story" && column.id !== "date Added" &&
                                  column.id !== "__pkProductID" && column.id !== "_fkSubID" && column.id !== "action"
                                ) &&
                                  (
                                    <>
                                      <br />
                                      <select className="custom-select"
                                        value={
                                          column.id == "square Footage" ? squareFootageOption :
                                          column.id == "stories" ? storiesOption :
                                          column.id == "bedrooms" ? bedRoomsOption :
                                          column.id == "bathrooms" ? bathRoomsOption :
                                          column.id == "garage" ? garageOption :
                                          column.id == "current Base Price" ? currentBasePriceOption :
                                          column.id == "current Price Per SQFT" ? currentPricePerSQFTOption :
                                          column.id == "lot Width" ? lotWidthOption :
                                          column.id == "lot Size" ? lotSizeOption :
                                          column.id == "price Change Since Open" ? priceChangeSinceOpenOption :
                                          column.id == "price Change Last 12 Months" ? priceChangeLast12MonthsOption : ""
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

                                        onChange={(e) => column.id == "square Footage" ? handleSelectChange(e.target.value, "sqft") :
                                          column.id == "stories" ? handleSelectChange(e.target.value, "stories") :
                                          column.id == "bedrooms" ? handleSelectChange(e.target.value, "bedroom") :
                                          column.id == "bathrooms" ? handleSelectChange(e.target.value, "bathroom") :
                                          column.id == "garage" ? handleSelectChange(e.target.value, "garage") :
                                          column.id == "current Base Price" ? handleSelectChange(e.target.value, "recentprice") :
                                          column.id == "current Price Per SQFT" ? handleSelectChange(e.target.value, "recentpricesqft") :
                                          column.id == "lot Width" ? handleSelectChange(e.target.value, "lotwidth") :
                                          column.id == "lot Size" ? handleSelectChange(e.target.value, "lotsize") :
                                          column.id == "price Change Since Open" ? handleSelectChange(e.target.value, "price_changes_since_open") :
                                          column.id == "price Change Last 12 Months" ? handleSelectChange(e.target.value, "price_changes_last_12_Month") : ""}
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
                                  {column.id == "plan Status" &&
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
                                  {column.id == "square Footage" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{squareFootageResult.toFixed(2)}</td>
                                  }
                                  {column.id == "stories" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{storiesResult.toFixed(2)}</td>
                                  }
                                  {column.id == "bedrooms" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{bedRoomsResult.toFixed(2)}</td>
                                  }
                                  {column.id == "bathrooms" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{bathRoomsResult.toFixed(2)}</td>
                                  }
                                  {column.id == "garage" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{garageResult.toFixed(2)}</td>
                                  }
                                  {column.id == "current Base Price" &&
                                    <td key={column.id} style={{ textAlign: "center" }}><PriceComponent price={currentBasePriceResult} /></td>
                                  }
                                  {column.id == "current Price Per SQFT" &&
                                    <td key={column.id} style={{ textAlign: "center" }}><PriceComponent price={currentPricePerSQFTResult} /></td>
                                  }
                                  {column.id == "product Website" &&
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
                                  {column.id == "zIP Code" &&
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
                                  {column.id == "__pkProductID" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "_fkSubID" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                  {column.id == "price Change Since Open" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{priceChangeSinceOpenResult.toFixed(1)}</td>
                                  }
                                  {column.id == "price Change Last 12 Months" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{priceChangeLast12MonthsResult.toFixed(1)}</td>
                                  }
                                  {column.id == "action" &&
                                    <td key={column.id} style={{ textAlign: "center" }}></td>
                                  }
                                </>
                              ))}
                            </tr>
                          }
                          {productList !== null && productList.length > 0 ? (
                            productList.map((element, index) => (
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
                                    {column.id == "plan Status" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>
                                        {element.status === 1 && "Active"}
                                        {element.status === 0 && "Sold Out"}
                                        {element.status === 2 && "Future"}
                                        {element.status === 3 && "Closed"}
                                      </td>
                                    }
                                    {column.id == "builder Name" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.subdivision.builder.name}</td>
                                    }
                                    {column.id == "subdivision Name" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.subdivision.name}</td>
                                    }
                                    {column.id == "product Name" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.name}</td>
                                    }
                                    {column.id == "square Footage" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.sqft}</td>
                                    }
                                    {column.id == "stories" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.stories}</td>
                                    }
                                    {column.id == "bedrooms" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.bedroom}</td>
                                    }
                                    {column.id == "bathrooms" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.bathroom}</td>
                                    }
                                    {column.id == "garage" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.garage}</td>
                                    }
                                    {column.id == "current Base Price" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.recentprice != "" ? <PriceComponent price={element.recentprice} /> : ""}</td>
                                    }
                                    {column.id == "current Price Per SQFT" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.recentpricesqft != "" ? <PriceComponent price={element.recentpricesqft} /> : "" }</td>
                                    }
                                    {column.id == "product Website" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.website}</td>
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
                                    {column.id == "zIP Code" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.zipcode}</td>
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
                                    {column.id == "date Added" &&
                                      <td key={column.id} style={{ textAlign: "center" }}><DateComponent date={element.created_at} /></td>
                                    }
                                    {column.id == "__pkProductID" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.product_code}</td>
                                    }
                                    {column.id == "_fkSubID" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.subdivision_code}</td>
                                    }
                                    {column.id == "price Change Since Open" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.price_changes_since_open != "" ? element.price_changes_since_open + '%' : ""}</td>
                                    }
                                    {column.id == "price Change Last 12 Months" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.price_changes_last_12_Month != "" ?  element.price_changes_last_12_Month + '%' : ""}</td>
                                    }
                                    {column.id == "action" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>
                                        <div className="d-flex justify-content-center">
                                          <Link
                                            to={`/productupdate/${element.id}?page=${currentPage}`}
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
                              <td></td>
                              <td></td>
                              <td></td>
                              <td>No data found</td>
                              <td colSpan="25"></td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    )}
                  </div>
                  <div className="d-sm-flex text-center justify-content-between align-items-center dataTables_wrapper no-footer">
                    <div className="dataTables_info">
                      Showing {lastIndex - recordsPage + 1} to {lastIndex} of{" "}
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

      <ProductOffcanvas
        canvasShowAdd={canvasShowAdd}
        seCanvasShowAdd={seCanvasShowAdd}
        Title="Add Product"
        parentCallback={handleCallback}
      />

      <BulkProductUpdate
        canvasShowEdit={canvasShowEdit}
        seCanvasShowEdit={seCanvasShowEdit}
        Title={selectedLandSales?.length  === 1 ? "Edit Product" : "Bulk Edit Products"}
        parentCallback={handleCallback}
        selectedLandSales={selectedLandSales}
      />

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Import Product CSV Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mt-3">
            <input type="file" id="fileInput" onChange={handleFileChange} />
          </div>
          <p className="text-danger d-flex justify-content-center align-item-center mt-1">
            {selectedFileError || Error}
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
        show={manageFilterOffcanvas}
        onHide={setManageFilterOffcanvas}
        className="offcanvas-end customeoff"
        placement="end"
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="modal-title" id="#gridSystemModal">
            Filter Products{" "}
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
                      PLAN STATUS:{" "}
                    </label>
                    <MultiSelect
                      name="status"
                      options={statusOptions}
                      value={selectedStatus}
                      onChange={handleSelectStatusChange}
                      placeholder={"Select Plan Status"}
                    />
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
                      PRODUCT NAME :{" "}
                    </label>
                    <input value={filterQuery.name} name="name" className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">
                      SQUARE FOOTAGE:{" "}
                    </label>
                    <input name="sqft" value={filterQuery.sqft} className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">
                      STORIES:{" "}
                    </label>
                    <input name="stories" value={filterQuery.stories} className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">
                      BEDROOMS:{" "}
                    </label>
                    <input value={filterQuery.bedroom} name="bedroom" className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">
                      BATHROOMS:{" "}
                    </label>
                    <input value={filterQuery.bathroom} name="bathroom" className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">
                      GARAGE:{" "}
                    </label>
                    <input type="text" name="garage" value={filterQuery.garage} className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">
                      CURRENT BASE PRICE:{" "}
                    </label>
                    <input type="text" value={filterQuery.current_base_price} name="current_base_price" className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">
                      PRODUCT TYPE:{" "}
                    </label>
                    <input value={filterQuery.product_type} name="product_type" className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">
                      AREA:{" "}
                    </label>
                    <input value={filterQuery.area} name="area" className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-3 ">
                    <label className="form-label">MASTER PLAN:{" "}</label>
                    <MultiSelect
                      name="masterplan_id"
                      options={masterPlanDropDownList}
                      value={selectedMasterPlan}
                      onChange={handleSelectMasterPlanChange}
                      placeholder="Select Master Plan"
                    />
                    {/* <input value={filterQuery.masterplan_id} name="masterplan_id" className="form-control" onChange={HandleFilter} /> */}
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
            <br />
            {excelLoading ? <div style={{ textAlign: "center" }}><ClipLoader color="#4474fc" /></div> :
              <>
                <h5 className="">Calculation Filter Options</h5>
                <div className="border-top">
                  <div className="row">
                    <div className="col-md-3 mt-3 mb-3">
                      <label className="form-label">CURRENT PRICE PER SQFT:{" "}</label>
                      <input style={{ marginTop: "20px" }} value={filterQueryCalculation.recentpricesqft} name="recentpricesqft" className="form-control" onChange={handleInputChange} />
                    </div>
                    <div className="col-md-3 mt-3 mb-3">
                      <label className="form-label">PRICE CHANGE SINCE OPEN:{" "}</label>
                      <input value={filterQueryCalculation.price_changes_since_open} name="price_changes_since_open" className="form-control" onChange={handleInputChange} />
                    </div>
                    <div className="col-md-3 mt-3 mb-3">
                      <label className="form-label">PRICE CHANGE LAST 12 MONTHS:{" "}</label>
                      <input value={filterQueryCalculation.price_changes_last_12_Month} name="price_changes_last_12_Month" className="form-control" onChange={handleInputChange} />
                    </div>
                  </div>
                </div></>}
          </div>
        </div>
      </Offcanvas>

      <Offcanvas
        show={showOffcanvas}
        onHide={setShowOffcanvas}
        className="offcanvas-end customeoff"
        placement="end"
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="modal-title" id="#gridSystemModal">
            Product Details{" "}
          </h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => { setShowOffcanvas(false); clearProductDetails(); setValue("1"); }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        {isFormLoading ? (
          <div className="d-flex justify-content-center align-items-center mt-5">
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
                      <Tab label="Products Details" value="1" />
                      <Tab label="Base Price" value="2" />
                    </TabList>
                  </Box>
                  <TabPanel value="1" className="p-0">
                    <div style={{ marginTop: "10px" }}>
                      <span className="fw-bold" style={{ fontSize: "22px" }}>
                        {ProductDetails.subdivision.builder?.name || "NA"}
                      </span><br />
                      <span className="fw-bold" style={{ fontSize: "40px" }}>
                        {ProductDetails.subdivision !== null && ProductDetails.subdivision.name !== undefined
                          ? ProductDetails.subdivision.name
                          : "NA"
                        }
                      </span><br />
                      <label className="" style={{ fontSize: "22px" }}><b>PRODUCT TYPE:</b>&nbsp;<span>{ProductDetails.subdivision?.product_type || "NA"}</span></label>

                      <hr style={{ borderTop: "2px solid black", width: "60%", marginTop: "10px" }}></hr>

                      <div className="d-flex" style={{ marginTop: "5px" }}>
                        <div className="fs-18" style={{ width: "180px" }}><span><b>AREA:</b></span>&nbsp;<span>{ProductDetails.subdivision?.area || "NA"}</span></div>
                        <div className="fs-18"><span><b>MASTER PLAN:</b></span>&nbsp;<span>{ProductDetails.subdivision?.masterplan_id || "NA"}</span></div>
                      </div>
                      <label className="fs-18" style={{ marginTop: "5px" }}><b>ZIP CODE:</b>&nbsp;<span>{ProductDetails.subdivision?.zipcode || "NA"}</span></label><br />
                      <label className="fs-18"><b>CROSS STREETS:</b>&nbsp;<span>{ProductDetails.subdivision?.crossstreet || "NA"}</span></label><br />
                      <label className="fs-18"><b>JURISDICTION:</b>&nbsp;<span>{ProductDetails.subdivision?.juridiction || "NA"}</span></label>

                      <hr style={{ borderTop: "2px solid black", width: "60%", marginTop: "10px" }}></hr>

                      <div className="d-flex" style={{ marginTop: "5px" }}>
                        <div className="fs-18" style={{ width: "300px" }}><span><b>STATUS:</b></span>&nbsp;<span>        {ProductDetails.status === 1 && "Active"}
                          {ProductDetails.status === 0 && "Sold Out"}
                          {ProductDetails.status === 2 && "Future"}
                          {ProductDetails.status === 3 && "Closed"}</span></div>
                        <div className="fs-18"><span><b>RECENT PRICE:</b></span>&nbsp;<span>{(<PriceComponent price={ProductDetails.recentprice} />
                        ) || "NA"}</span></div>
                      </div>
                      <div className="d-flex" style={{ marginTop: "5px" }}>
                        <div className="fs-18" style={{ width: "300px" }}><span><b>SQFT:</b></span>&nbsp;<span>{ProductDetails.sqft || "NA"}</span></div>
                        <div className="fs-18"><span><b>$ per SQFT:</b></span>&nbsp;<span>
                          {(<PriceComponent price={ProductDetails.recentprice / ProductDetails.sqft} />
                          ) || "NA"}
                        </span></div>
                      </div>
                      <div className="d-flex" style={{ marginTop: "5px" }}>
                        <div className="fs-18" style={{ width: "300px" }}><span><b>STORIES:</b></span>&nbsp;<span>{ProductDetails.stories || "NA"}</span></div>
                        <div className="fs-18"><span><b>PRICE CHANGE:</b></span>&nbsp;<span>{ProductDetails.pricechange || "NA"}</span></div>
                      </div>
                      <div className="d-flex" style={{ marginTop: "5px" }}>
                        <div className="fs-18" style={{ width: "300px" }}><span><b>BEDROOMS:</b></span>&nbsp;<span>{ProductDetails.bedroom || "NA"}</span></div>
                      </div>
                      <div className="d-flex" style={{ marginTop: "5px" }}>
                        <div className="fs-18" style={{ width: "300px" }}><span><b>BATHROOMS:</b></span>&nbsp;<span>{ProductDetails.bathroom || "NA"}</span></div>
                      </div>
                      <div className="d-flex" style={{ marginTop: "5px" }}>
                        <div className="fs-18" style={{ width: "300px" }}><span><b>GARAGE:</b></span>&nbsp;<span>{ProductDetails.garage || "NA"}</span></div>
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
                              className="table ItemsCheckboxSec dataTable no-footer product-table-price mb-0"
                            >
                              <thead>
                                <tr style={{ textAlign: "center" }}>
                                  <th><strong>No.</strong></th>
                                  <th><strong>Base Price</strong></th>
                                  <th><strong>Date</strong></th>
                                </tr>
                              </thead>
                              <tbody style={{ textAlign: "center" }}>
                                {ProductDetails.base_price &&
                                  Array.isArray(ProductDetails.base_price) &&
                                  ProductDetails.base_price.length > 0 ? (
                                  ProductDetails.base_price.map(
                                    (element, index) => (
                                      <tr
                                        onClick={() => handlePriceClick(element.id, element.date)}
                                        key={element.id}
                                        style={{
                                          textAlign: "center",
                                          cursor: "pointer",
                                        }}
                                      >
                                        <td>{index + 1}</td>
                                        <td>{element.baseprice ? <PriceComponent price={element.baseprice} /> : ""}</td>
                                        <td style={{ textAlign: "center" }}>{element.date ? <DateComponent date={element.date} /> : ""}</td>
                                      </tr>
                                    )
                                  )
                                ) : (
                                  <tr>
                                    <td
                                      colSpan="3"
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
            Manage Product Fields Access{" "}
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
              <option value="Staff">Staff</option>
              <option value="Standard User">Standard User</option>
              <option value="Data Uploader">Data Uploader</option>
              <option value="Account Admin">Account Admin</option>
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
              disabled={excelDownload}
              onClick={handleDownloadExcel}
            >
              {excelDownload ? "Downloading..." : "Download"}
            </button>
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

      <AccessField 
        tableName={"products"}
        setFieldList={setFieldList}
        manageAccessField={manageAccessField}
        setManageAccessField={setManageAccessField}
      />

    </Fragment>
  );
};

export default ProductList;
