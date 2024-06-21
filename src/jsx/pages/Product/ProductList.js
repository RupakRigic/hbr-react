import React, { useState, useEffect, useRef } from "react";

import AdminProductService from "../../../API/Services/AdminService/AdminProductService";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import ProductOffcanvas from "./ProductOffcanvas";
import MainPagetitle from "../../layouts/MainPagetitle";
import { Offcanvas, Form, Row } from "react-bootstrap";
import { debounce } from "lodash";
import Dropdown from "react-bootstrap/Dropdown";
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
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import { DownloadTableExcel, downloadExcel } from 'react-export-table-to-excel';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import ColumnReOrderPopup from "../../popup/ColumnReOrderPopup";
import BulkProductUpdate from "./BulkProductUpdate";
import Select from "react-select";
import AdminBuilderService from "../../../API/Services/AdminService/AdminBuilderService";
import { MultiSelect } from "react-multi-select-component";



const ProductList = () => {
  const [excelLoading, setExcelLoading] = useState(true);

  const SyestemUserRole = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user")).role
  : "";

  const HandleSortDetailClick = (e) =>
    {
        setShowSort(true);
    }
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
  const bulkProduct = useRef();

  const handleEditCheckboxChange = (e, userId) => {
    if (e.target.checked) {
      setSelectedLandSales((prevSelectedUsers) => [...prevSelectedUsers, userId]);
    } else {
      setSelectedLandSales((prevSelectedUsers) => prevSelectedUsers.filter((id) => id !== userId));
    }
  };
  
  
  const [AllProductListExport, setAllBuilderExport] = useState([]);
  const [showSort, setShowSort] = useState(false);
  const handleSortClose = () => setShowSort(false);
  const [Error, setError] = useState("");
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [productList, setProductList] = useState([]);
  const [productListCount, setProductsListCount] = useState('');

  const [BuilderList, setBuilderList] = useState([]);
  const [exportmodelshow, setExportModelShow] = useState(false)
  const [selectAll, setSelectAll] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([]); 
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
    { label: 'Bed Rooms', key: 'bedrooms' },
    { label: 'Bath Rooms', key: 'bathrooms' },
    { label: 'Garage', key: 'garage' },
    { label: 'Current Base Price', key: 'currentbaseprice' },
    { label: 'Current Price Per SQFT', key: 'currentprice' },
    { label: 'Product Website', key: 'productwebsite' },
    { label: 'Product Type', key: 'producttype' },
    { label: 'Area', key: 'area' },
    { label: 'Master Plan', key: 'masterplan' },
    { label: 'Zip Code', key: 'zipcode' },
    { label: 'Lot Width', key: 'lotwidth' },
    { label: 'Lot Size', key: 'lotsize' },
    { label: 'Zoning', key: 'zoning' },
    { label: 'Age Restrictedr', key: 'agerestrictedr' },
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
    { label: 'Bed Rooms', key: 'bedroom' },
    { label: 'Bath Rooms', key: 'bathroom' },
    { label: 'Garage', key: 'garage' },
    { label: 'Current Base Price', key: 'latestBasePrice' },
    { label: 'Current Price Per SQFT', key: 'currentprice' },
    { label: 'Product Website', key: 'productwebsite' },
    { label: 'Product Type', key: 'producttype' },
    { label: 'Area', key: 'area' },
    { label: 'Master Plan', key: 'masterplan' },
    { label: 'Zip Code', key: 'zipcode' },
    { label: 'Lot Width', key: 'lotwidth' },
    { label: 'Lot Size', key: 'lotsize' },
    { label: 'Zoning', key: 'zoning' },
    { label: 'Age Restrictedr', key: 'agerestrictedr' },
    { label: 'All Single Story', key: 'singlestory' },
    { label: 'Product ID', key: 'productid' },
    { label: 'Fk Sub ID', key: 'fksubid' }, 
    { label: 'Price Change Since Open', key: 'pricechangesinceopen' },
    { label: 'Price Change Last 12 Months', key: 'pricechangelasttwelvemonths' }, 
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

  const calculatedField = [
    {
      "Active Communities": null,
      "Closing This Year": null,
      "Permits This Year": null,
      "Net Sales this year": null,
      "Current Avg Base Price": null,
      "Median Closing Price This Year": null,
      "Median Closing Price Last Year": null,
      "Avg Net Sales Per Month This Year ": null,
      "Avg Closings Per Month This Year": null,
      "Total Closings": null,
      "Total Permits": null,
      "Total Net Sales": null,
    },
  ];

  function handleLabelExist(lable)
  {

    return calculatedField.some(field => field.hasOwnProperty(lable));
 
  }

  const totalSumFields = (label) => {
    if (!handleLabelExist(label)) {
      return 0;
    }
    label = label
    .toLowerCase()      
    .replace(/\s+/g, '_');
    return AllProductListExport.reduce((sum, builder) => {
      return sum + (builder[label] || 0);
    }, 0);
  };
  
  const handleColumnToggle = (column) => {
    const updatedColumns = selectedColumns.includes(column)
      ? selectedColumns.filter((col) => col !== column)
      : [...selectedColumns, column];
      console.log(updatedColumns);
    setSelectedColumns(updatedColumns);  
    setSelectAll(updatedColumns.length === exportColumns.length);
  };
  console.log('data',productList);
  const handleDownloadExcel = () => {
    setExportModelShow(false);
    setSelectedColumns('');
  
    let tableHeaders;
    if (selectedColumns.length > 0) {
      tableHeaders = selectedColumns;
    } else {
      tableHeaders = headers.map((c) => c.label);
    }
  
    const tableData = AllProductListExport.map((row) => {
      const mappedRow = {};
      tableHeaders.forEach((header) => {
        switch (header) {
          case "Status":
            mappedRow[header] = (row.status === 1 && "Active") || (row.status === 0 && "Sold Out") || (row.status === 2 && "Future");
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
          case "Bed Rooms":
            mappedRow[header] = row.bedroom;
            break;
          case "Bath Rooms":
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
            mappedRow[header] = row.Website;
            break;
          case "Product Type":
            mappedRow[header] = row.subdivision ? row.subdivision.product_type : '';
            break;
          case "Area":
            mappedRow[header] = row.subdivision ? row.subdivision.area : '';
            break;
          case "Master Plan":
            mappedRow[header] = row.subdivision ? row.subdivision.masterplan_id : '';
            break;
          case "Zip Code":
            mappedRow[header] = row.subdivision ? row.subdivision.zipcode : '';
            break;
          case "Lot Width":
            mappedRow[header] = row.subdivision ? row.subdivision.lotwidth : '';
            break;
          case "Lot Size":
            mappedRow[header] = row.subdivision ? row.subdivision.lotsize : '';
            break;
          case "Zoning":
            mappedRow[header] = row.subdivision ? row.subdivision.zoning : '';
            break;
          case "Age Restricted":
            mappedRow[header] = (row.subdivision && row.subdivision.age === 1 && "Yes") || (row.subdivision && row.subdivision.age === 0 && "No") || '';
            break;
          case "All Single Story":
            mappedRow[header] = (row.subdivision && row.subdivision.single === 1 && "Yes") || (row.subdivision && row.subdivision.single === 0 && "No") || '';
            break;
          case "Product ID":
            mappedRow[header] = row.product_code;
            break;
          case "Fk Sub ID":
            mappedRow[header] = row.subdivision ? row.subdivision.subdivision_code : '';
            break;
          case "Price Change Since Open":
            mappedRow[header] = row.price_changes_since_open+'%';
            break;
          case "Price Change Last 12 Months":
            mappedRow[header] = row.price_changes_last_12_Month+'%';
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
  
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Product');
  
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'Product.xlsx');

    resetSelection();
    setExportModelShow(false);
  };
  

  const [filterQuery, setFilterQuery] = useState({
    status:"",
    subdivision_name:"",
    name:"",
    sqft:"",
    stories:"",
    bedroom:"",
    bathroom:"",
    garage:"",
    current_base_price:"",
    product_type:"",
    area:"",
    masterplan_id:"",
    zipcode:"",
    lotsize:"",
    zoning:"",
    age:"",
    single:"",
    current_price_per_sqft:"",
    price_changes_since_open:"",
    price_changes_last_12_Month:"",
  });

  const [isLoading, setIsLoading] = useState(true);

  const product = useRef();

  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [sortConfig, setSortConfig] = useState([]);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState(sortConfig.map(col => col.key));
  useEffect(() => {
    setSelectedCheckboxes(sortConfig.map(col => col.key));
}, [sortConfig]);
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

  const [manageAccessOffcanvas, setManageAccessOffcanvas] = useState(false);
  const [accessList, setAccessList] = useState({});
  const [accessRole, setAccessRole] = useState("Admin");
  const [accessForm, setAccessForm] = useState({});
  const [role, setRole] = useState("Admin");
  const [checkedItems, setCheckedItems] = useState({}); 
  const fieldList = AccessField({ tableName: "products" });
  const [show, setShow] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const [selectedFileError, setSelectedFileError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleClose = () => setShow(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [columns, setColumns] = useState([]);
  const [draggedColumns, setDraggedColumns] = useState(columns);

  useEffect(() => {
    console.log('data',fieldList);
  }, [fieldList]);

  const checkFieldExist = (fieldName) => {
    return fieldList.includes(fieldName.trim());
  };
 
  
  const [value, setValue] = React.useState("1");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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

  const stringifySortConfig = (sortConfig) => {
    return sortConfig.map((sort) => `${sort.key}:${sort.direction}`).join(",");
  };
  const getproductList = async (pageNumber) => {
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
      setLoading(false);
      setProductList(responseData.data);
      setNpage(Math.ceil(responseData.total / recordsPage));
      setProductsListCount(responseData.total);
      setIsLoading(false);  
    } catch (error) {
      console.log(error);
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(errorJson.message);
      }
    }
  };

    async function fetchAllPages(searchQuery, sortConfig) {
    const response = await AdminProductService.index(1, searchQuery, sortConfig ? `&sortConfig=${stringifySortConfig(sortConfig)}` : "");
    const responseData = await response.json();
    const totalPages = Math.ceil(responseData.total / recordsPage);
    let allData = responseData.data;
    for (let page = 2; page <= totalPages; page++) {
      const pageResponse = await AdminProductService.index(page, searchQuery, sortConfig ? `&sortConfig=${stringifySortConfig(sortConfig)}` : "");
      const pageData = await pageResponse.json();
      allData = allData.concat(pageData.data);
    }
    setAllBuilderExport(allData);
    setExcelLoading(false);
  }


  useEffect(() => {
    if (localStorage.getItem("usertoken")) {
      getproductList(currentPage);
      fetchAllPages(searchQuery, sortConfig)
    } else {
      navigate("/");
    }
  }, [currentPage]);

  const handleDelete = async (e) => {
    try {
      let responseData = await AdminProductService.destroy(e).json();
      if (responseData.status === true) {
        getproductList();
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
        getproductList();
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
    getproductList();
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
      table: "products",
    };
    try {
      const data = await AdminProductService.manageAccessFields(
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
    try {
      let responseData = await AdminProductService.show(id).json();
      SetProductDetails(responseData);
      console.log(responseData);

      setShowOffcanvas(true);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(errorJson.message);
      }
    }
  };
  const debouncedHandleSearch = useRef(
    debounce((value) => {
      setSearchQuery(value);
    }, 1000)
  ).current;

  // useEffect(() => {
  //   getproductList();
  // }, [searchQuery]);

  // const HandleSearch = (e) => {
  //   setIsLoading(true);
  //   const query = e.target.value.trim();
  //   debouncedHandleSearch(`&q=${query}`);
  // };
  // useEffect(() => {
  //   setSearchQuery(filterString());
  // }, [filterQuery]);

  const HandleFilter = (e) => {
    const { name, value } = e.target;
    setFilterQuery((prevFilterQuery) => ({
      ...prevFilterQuery,
      [name]: value,
    }));
  };
  // const HandleSelectChange = (selectedOption) => {
  //   setFilterQuery((prevFilterQuery) => ({
  //     ...prevFilterQuery,
  //     subdivision_name: selectedOption.name,
  //   }));
  // };

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
      status:"",
      builder_name:"",
      name:"",
      sqft:"",
      stories:"",
      bedroom:"",
      bathroom:"",
      garage:"",
      current_base_price:"",
      product_type:"",
      area:"",
      masterplan_id:"",
      zipcode:"",
      lotsize:"",
      zoning:"",
      age:"",
      single:"",
      current_price_per_sqft:"",
      price_changes_since_open:"",
      price_changes_last_12_Month:"",
    });
  };
  const handlePriceClick = () => {
    navigate("/pricelist");
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
    getproductList(currentPage, sortConfig);
  };

  const getbuilderlist = async () => {
    try {
      const response = await AdminSubdevisionService.index(searchQuery);
      const responseData = await response.json();
      const formattedData = responseData.data.map((subdivision) => ({
        label: subdivision.name,
        value: subdivision.id,
      }));
      setBuilderList(formattedData);
      setIsLoading(false);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(errorJson.message);
      }
    }
  };
  useEffect(() => {
    if (localStorage.getItem("usertoken")) {
      getbuilderlist();
    } else {
      navigate("/");
    }
  }, []);
  const exportToExcelData = async () => {
    try {
        const bearerToken = JSON.parse(localStorage.getItem('usertoken'));
        const response = await axios.get(
          `${process.env.REACT_APP_IMAGE_URL}api/admin/product/export`
          // 'https://hbrapi.rigicgspl.com/api/admin/product/export'

          , {
            responseType: 'blob',
            headers: {
                'Authorization': `Bearer ${bearerToken}`
            }
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'products.xlsx');
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
        let responseData = await AdminProductService.import(inputData).json();
        setSelectedFile("");
        document.getElementById("fileInput").value = null;
        setLoading(false);
        if (responseData.message) {
          console.log(responseData);
          let message = responseData.message;
          if (responseData.failed_records > 0) {
              const problematicRows = responseData.failed_records_details.map(detail => detail.row).join(', ');
              message += ' Problematic Record Rows: ' + problematicRows+'.';
          }
          message += '. Record Imported: ' + responseData.successful_records;
          message += '. Failed Record Count: ' + responseData.failed_records;
          message += '. Last Row: ' + responseData.last_processed_row;

          swal(message).then((willDelete) => {
              if (willDelete) {
                  navigate("/productList");
                  setShow(false);
              }
          });
      } else {
        console.log(responseData);
          swal('Error: ' + responseData);
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
const handlBuilderClick = (e) => {
  setShow(true);
};

const HandleFilterForm = (e) =>
  {
    e.preventDefault();
    console.log(555);
    getproductList(currentPage,searchQuery);
    setManageFilterOffcanvas(false)

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
    if(AllProductListExport.length === 0){
      setProductList(productList);
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

    filtered = applyNumberFilter(filtered, filterQuery.current_price_per_sqft, 'current_price_per_sqft');
    filtered = applyNumberFilter(filtered, filterQuery.price_changes_since_open, 'price_changes_since_open');
    filtered = applyNumberFilter(filtered, filterQuery.price_changes_last_12_Month, 'price_changes_last_12_Month');
    
    setProductList(filtered.slice(0, 100));
  };
  
  useEffect(() => {
    applyFilters();
  }, [filterQuery]);

  const [builderDropDown, setBuilderDropDown] = useState([]);
  const [selectedBuilderName, setSelectedBuilderName] = useState([]);
  const [selectedSubdivisionName, setSelectedSubdivisionName] = useState([]);
  const [selectedAge, setSelectedAge] = useState([]);
  const [selectedSingle, setSelectedSingle] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
 const [selectedValues, setSelectedValues] = useState([]);
  
  useEffect(() => {
    const fetchBuilderList = async () => {
      try {
        const response = await AdminBuilderService.builderDropDown();
        const data = await response.json();
        const formattedData = data.map((builder) => ({
          label: builder.name,
          value: builder.id,
        }));
        setBuilderDropDown(formattedData);
      } catch (error) {
        console.log("Error fetching builder list:", error);
      }
    };

    fetchBuilderList();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilterQuery(prevFilterQuery => ({
      ...prevFilterQuery,
      [name]: value
    }));
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
    { value: "2", label: "Future" }
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

  const handleSelectSubdivisionNameChange  = (selectedItems) => {  
    const selectedValues = selectedItems.map(item => item.value);
    const selectedNames = selectedItems.map(item => item.label).join(', ');

    setSelectedValues(selectedValues);
    setSelectedSubdivisionName(selectedItems);
    setFilterQuery(prevState => ({
      ...prevState,
      subdivision_name: selectedNames
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
  };
  
  const handleSelectSingleChange  = (selectedItems) => {  
    const selectedValues = selectedItems.map(item => item.value);
    const selectedNames = selectedItems.map(item => item.value).join(', ');

    setSelectedValues(selectedValues);
    setSelectedSingle(selectedItems);
    
    setFilterQuery(prevState => ({
      ...prevState,
      single: selectedNames
  }));
  };

  const handleSelectStatusChange  = (selectedItems) => {  
    const selectedValues = selectedItems.map(item => item.value);
    const selectedNames = selectedItems.map(item => item.value).join(', ');

    setSelectedValues(selectedValues);
    setSelectedStatus(selectedItems);

    setFilterQuery(prevState => ({
      ...prevState,
      status: selectedNames
  }));
  };

  return (
    <>
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
                        {/* <button class="btn btn-secondary cursor-none">
                          {" "}
                          <i class="fas fa-search"></i>
                        </button> */}
                        {/* <Form.Control
                          type="text"
                          style={{
                            borderTopLeftRadius: "0",
                            borderBottomLeftRadius: "0",
                          }}
                          onChange={HandleSearch}
                          placeholder="Quick Search"
                        /> */}
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
                      SyestemUserRole == "User" ||  SyestemUserRole == "Standard User" ? (
                        ""
                      ) : (
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

                      <button
                        className="btn btn-primary btn-sm me-1"
                        onClick={() => setManageAccessOffcanvas(true)}
                      >
                        {" "}
                        Field Access
                      </button>
                      <button className="btn btn-success btn-sm me-1" onClick={() => setManageFilterOffcanvas(true)}>
                      <i className="fa fa-filter" />
                    </button>                         <Button
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
                        onClick={() => product.current.showEmployeModal()}
                      >
                        + Add Product
                      </Link>


                      <Link
                        to={"#"}
                        className="btn btn-primary btn-sm ms-1"
                        data-bs-toggle="offcanvas"
                        onClick={() => bulkProduct.current.showEmployeModal()}
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
                                checked={selectedLandSales.length === productList.length}
                                onChange={(e) =>
                                  e.target.checked
                                    ? setSelectedLandSales(productList.map((user) => user.id))
                                    : setSelectedLandSales([])
                                }
                              />
                            </th>
                            <th>
                              <strong>No.</strong>
                            </th>
                            {columns.map((column) => (
                              <th style={{ textAlign: "center", cursor: "pointer" }} key={column.id} onClick={() => column.id != "action" ? requestSort(
                                column.id == "plan Status" ? "status" : 
                                column.id == "product Name" ? "name" : 
                                column.id == "square Footage" ? "sqft" : 
                                column.id == "bed Rooms" ? "bedroom" : 
                                column.id == "bath Rooms" ? "bathroom" : 
                                column.id == "current Base Price" ? "latestBasePrice" : 
                                column.id == "current Price Per SQFT" ? "curren_price_per_sqft" : 
                                column.id == "product Type" ? "product_type" : 
                                column.id == "age Restricted" ? "age" : 
                                column.id == "all Single Story" ? "stories" : 
                                column.id == "date Added" ? "created_at" : 
                                column.id == "__pkProductID" ? "product_code" : 
                                column.id == "_fkSubID" ? "subdivsion_code" : 
                                column.id == "price Change Since Open" ? "price_change_since_open" : 
                                column.id == "price Change Last 12 Months" ? "subdivisionCode" : toCamelCase(column.id)) : ""}>
                                <strong>
                                  {column.id == "bath Rooms" ? "Bathrooms" : column.label}
                                  {column.id != "action" && sortConfig.some(
                                    (item) => item.key === (
                                      column.id == "plan Status" ? "status" : 
                                      column.id == "product Name" ? "name" : 
                                      column.id == "square Footage" ? "sqft" : 
                                      column.id == "bed Rooms" ? "bedroom" : 
                                      column.id == "bath Rooms" ? "bathroom" : 
                                      column.id == "current Base Price" ? "latestBasePrice" : 
                                      column.id == "current Price Per SQFT" ? "curren_price_per_sqft" : 
                                      column.id == "product Type" ? "product_type" : 
                                      column.id == "age Restricted" ? "age" : 
                                      column.id == "all Single Story" ? "stories" : 
                                      column.id == "date Added" ? "created_at" : 
                                      column.id == "__pkProductID" ? "product_code" : 
                                      column.id == "_fkSubID" ? "subdivsion_code" : 
                                      column.id == "price Change Since Open" ? "price_change_since_open" : 
                                      column.id == "price Change Last 12 Months" ? "subdivisionCode" : toCamelCase(column.id))
                                    ) ? (
                                    <span>
                                      {column.id != "action" && sortConfig.find(
                                        (item) => item.key === (
                                          column.id == "plan Status" ? "status" : 
                                          column.id == "product Name" ? "name" : 
                                          column.id == "square Footage" ? "sqft" : 
                                          column.id == "bed Rooms" ? "bedroom" : 
                                          column.id == "bath Rooms" ? "bathroom" : 
                                          column.id == "current Base Price" ? "latestBasePrice" : 
                                          column.id == "current Price Per SQFT" ? "curren_price_per_sqft" : 
                                          column.id == "product Type" ? "product_type" : 
                                          column.id == "age Restricted" ? "age" : 
                                          column.id == "all Single Story" ? "stories" : 
                                          column.id == "date Added" ? "created_at" : 
                                          column.id == "__pkProductID" ? "product_code" : 
                                          column.id == "_fkSubID" ? "subdivsion_code" : 
                                          column.id == "price Change Since Open" ? "price_change_since_open" : 
                                          column.id == "price Change Last 12 Months" ? "subdivisionCode" : toCamelCase(column.id))
                                        ).direction === "asc" ? "↑" : "↓"}
                                    </span>
                                    ) : (
                                    column.id != "action" && <span>↑↓</span>
                                  )}
                                </strong>
                              </th>
                            ))}

                            {/* {checkFieldExist("Plan Status") && (
                              <th onClick={() => requestSort("status")}>
                                <strong>Plan Status</strong>
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

                            {/* {checkFieldExist("Builder Name") && (
                              <th onClick={() => requestSort("builderName")}>
                                <strong>Builder Name</strong>
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

                            {/* {checkFieldExist("Subdivision Name") && (
                              <th
                                onClick={() => requestSort("subdivisionName")}
                              >
                                <strong>Subdivision Name</strong>

                                {sortConfig.some(
                                  (item) => item.key === "subdivisionName"
                                ) ? (
                                  <span>
                                    {sortConfig.find(
                                      (item) => item.key === "subdivisionName"
                                    ).direction === "asc"
                                      ? "↑"
                                      : "↓"}
                                  </span>
                                ) : (
                                  <span>↑↓</span>
                                )}
                              </th>
                            )} */}

                            {/* {checkFieldExist("Product Name") && (
                              <th onClick={() => requestSort("name")}>
                                <strong>Product Name</strong>
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

                            {/* {checkFieldExist("Square Footage") && (
                              <th onClick={() => requestSort("sqft")}>
                                <strong>Square Footage</strong>
                                {sortConfig.some(
                                  (item) => item.key === "sqft"
                                ) ? (
                                  <span>
                                    {sortConfig.find(
                                      (item) => item.key === "sqft"
                                    ).direction === "asc"
                                      ? "↑"
                                      : "↓"}
                                  </span>
                                ) : (
                                  <span>↑↓</span>
                                )}
                              </th>
                            )} */}

                            {/* {checkFieldExist("Stories") && (
                              <th onClick={() => requestSort("stories")}>
                                <strong>Stories</strong>
                                {sortConfig.some(
                                  (item) => item.key === "stories"
                                ) ? (
                                  <span>
                                    {sortConfig.find(
                                      (item) => item.key === "stories"
                                    ).direction === "asc"
                                      ? "↑"
                                      : "↓"}
                                  </span>
                                ) : (
                                  <span>↑↓</span>
                                )}
                              </th>
                            )} */}

                            {/* {checkFieldExist("Bed Rooms") && (
                              <th onClick={() => requestSort("bedroom")}>
                                <strong>Bed Rooms</strong>
                                {sortConfig.some(
                                  (item) => item.key === "bedroom"
                                ) ? (
                                  <span>
                                    {sortConfig.find(
                                      (item) => item.key === "bedroom"
                                    ).direction === "asc"
                                      ? "↑"
                                      : "↓"}
                                  </span>
                                ) : (
                                  <span>↑↓</span>
                                )}
                              </th>
                            )} */}

                            {/* {checkFieldExist("Bath Rooms") && (
                              <th onClick={() => requestSort("bathroom")}>
                                <strong>Bath Rooms</strong>
                                {sortConfig.some(
                                  (item) => item.key === "bathroom"
                                ) ? (
                                  <span>
                                    {sortConfig.find(
                                      (item) => item.key === "bathroom"
                                    ).direction === "asc"
                                      ? "↑"
                                      : "↓"}
                                  </span>
                                ) : (
                                  <span>↑↓</span>
                                )}
                              </th>
                            )} */}

                            {/* {checkFieldExist("Garage") && (
                              <th onClick={() => requestSort("garage")}>
                                <strong>Garage</strong>
                                {sortConfig.some(
                                  (item) => item.key === "garage"
                                ) ? (
                                  <span>
                                    {sortConfig.find(
                                      (item) => item.key === "garage"
                                    ).direction === "asc"
                                      ? "↑"
                                      : "↓"}
                                  </span>
                                ) : (
                                  <span>↑↓</span>
                                )}
                              </th>
                            )} */}

                            {/* {checkFieldExist("Current Base Price") && (
                              <th onClick={() => requestSort("latestBasePrice")}>
                                <strong>Current Base Price</strong>
                                {sortConfig.some(
                                  (item) => item.key === "latestBasePrice"
                                ) ? (
                                  <span>
                                    {sortConfig.find(
                                      (item) => item.key === "latestBasePrice"
                                    ).direction === "asc"
                                      ? "↑"
                                      : "↓"}
                                  </span>
                                ) : (
                                  <span>↑↓</span>
                                )}
                              </th>
                            )} */}

                            {/* {checkFieldExist("Current Price Per SQFT") && (
                              <th
                                onClick={() => requestSort("curren_price_per_sqft")}
                              >
                                <strong>Current Price Per SQFT</strong>
                                {sortConfig.some(
                                  (item) => item.key === "curren_price_per_sqft"
                                ) ? (
                                  <span>
                                    {sortConfig.find(
                                      (item) => item.key === "curren_price_per_sqft"
                                    ).direction === "asc"
                                      ? "↑"
                                      : "↓"}
                                  </span>
                                ) : (
                                  <span>↑↓</span>
                                )}
                              </th>
                            )}   */}

                            {/* {checkFieldExist("Product Website") && ( */}
                              {/* <th */}
                              {/* // onClick={() => requestSort("recentpricesqft")} */}
                              {/* > */}
                                {/* <strong>Product Website</strong> */}
                                {/* {sortConfig.key !== "recentpricesqft"
                                ? "↑↓"
                                : ""}
                              {sortConfig.key === "recentpricesqft" && (
                                <span>
                                  {sortConfig.direction === "asc" ? "↑" : "↓"}
                                </span>
                              )} */}
                              {/* </th> */}
                            {/* )} */}

                            {/* {checkFieldExist("Product Type") && (
                              <th onClick={() => requestSort("product_type")}>
                                <strong>Product Type</strong>
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
                                <strong>Area</strong>
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

                            {/* {checkFieldExist("Master Plan") && (
                              <th onClick={() => requestSort("masterPlan")}>
                                <strong>Master Plan</strong>
                                {sortConfig.some(
                                  (item) => item.key === "stmasterPlanatus"
                                ) ? (
                                  <span>
                                    {sortConfig.find(
                                      (item) => item.key === "masterPlan"
                                    ).direction === "asc"
                                      ? "↑"
                                      : "↓"}
                                  </span>
                                ) : (
                                  <span>↑↓</span>
                                )}
                              </th>
                            )} */}

                            {/* {checkFieldExist("Zip Code") && (
                              <th onClick={() => requestSort("zipCode")}>
                                <strong>Zip Code</strong>
                                {sortConfig.some(
                                  (item) => item.key === "zipCode"
                                ) ? (
                                  <span>
                                    {sortConfig.find(
                                      (item) => item.key === "zipCode"
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
                              <th onClick={() => requestSort("lotWidth")}>
                                <strong>Lot Width</strong>
                                {sortConfig.some(
                                  (item) => item.key === "lotWidth"
                                ) ? (
                                  <span>
                                    {sortConfig.find(
                                      (item) => item.key === "lotWidth"
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
                                <strong>Lot Size</strong>
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
                                <strong>Zoning</strong>
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
                                <strong>Age Restricted</strong>
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
                              <th onClick={() => requestSort("stories")}>
                                <strong>All Single Story</strong>
                                {sortConfig.some(
                                  (item) => item.key === "stories"
                                ) ? (
                                  <span>
                                    {sortConfig.find(
                                      (item) => item.key === "stories"
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
                                <strong>Date Added</strong>
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

                            {/* {checkFieldExist("__pkProductID") && (
                              <th onClick={() => requestSort("product_code")}>
                                <strong>__pkProductID</strong>
                                {sortConfig.some(
                                  (item) => item.key === "product_code"
                                ) ? (
                                  <span>
                                    {sortConfig.find(
                                      (item) => item.key === "product_code"
                                    ).direction === "asc"
                                      ? "↑"
                                      : "↓"}
                                  </span>
                                ) : (
                                  <span>↑↓</span>
                                )}
                              </th>
                            )} */}

                            {/* {checkFieldExist("_fkSubID") && (
                              <th
                                onClick={() => requestSort("subdivsion_code")}
                              >
                                <strong>_fkSubID</strong>
                                {sortConfig.some(
                                  (item) => item.key === "subdivsion_code"
                                ) ? (
                                  <span>
                                    {sortConfig.find(
                                      (item) => item.key === "subdivsion_code"
                                    ).direction === "asc"
                                      ? "↑"
                                      : "↓"}
                                  </span>
                                ) : (
                                  <span>↑↓</span>
                                )}
                              </th>
                            )} */}

                          {/* {checkFieldExist("Price Change Since Open") && (
                              <th
                                onClick={() => requestSort("price_change_since_open")}
                              >
                                <strong>Price Change Since Open</strong>
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

                      {/* {checkFieldExist("Price Change Last 12 Months") && (
                              <th
                                onClick={() => requestSort("subdivisionCode")}
                              >
                                <strong>Price Change Last 12 Months</strong>
                                {sortConfig.some(
                                  (item) => item.key === "subdivisionCode"
                                ) ? (
                                  <span>
                                    {sortConfig.find(
                                      (item) => item.key === "subdivisionCode"
                                    ).direction === "asc"
                                      ? "↑"
                                      : "↓"}
                                  </span>
                                ) : (
                                  <span>↑↓</span>
                                )}
                            </th>
                  )} */}

                            {/* {checkFieldExist("Action") && <th>Action</th>} */}

                          </tr>
                        </thead>
                        <tbody style={{ textAlign: "center" }}>
                          {productList !== null && productList.length > 0 ? (
                            productList.map((element, index) => (
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
                                    {column.id == "plan Status" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>
                                        {element.status === 1 && "Active"}
                                        {element.status === 0 && "Sold Out"}
                                        {element.status === 2 && "Future"}
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
                                    {column.id == "bed Rooms" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.bedroom}</td>
                                    }
                                    {column.id == "bath Rooms" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.bathroom}</td>
                                    }
                                    {column.id == "garage" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.garage}</td>
                                    }
                                    {column.id == "current Base Price" &&
                                      <td key={column.id} style={{ textAlign: "center" }}><PriceComponent price={element.latest_base_price} /></td>
                                    }
                                    {column.id == "current Price Per SQFT" &&
                                      <td key={column.id} style={{ textAlign: "center" }}><PriceComponent price={element.current_price_per_sqft} /></td>
                                    }
                                    {column.id == "product Website" &&
                                      <td key={column.id} style={{ textAlign: "center" }}></td>
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
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.subdivision.lotwidth}</td>
                                    }
                                    {column.id == "lot Size" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.subdivision.lotsize}</td>
                                    }
                                    {column.id == "zoning" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.subdivision.zoning}</td>
                                    }
                                    {column.id == "age Restricted" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>
                                        {element.subdivision.age === 1 && "Yes"}
                                        {element.subdivision.age === 0 && "No"}
                                      </td>
                                    }
                                    {column.id == "all Single Story" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>
                                        {element.subdivision.single === 1 && "Yes"}
                                        {element.subdivision.single === 0 && "No"}
                                      </td>
                                    }
                                    {column.id == "date Added" &&
                                      <td key={column.id} style={{ textAlign: "center" }}><DateComponent date={element.created_at} /></td>
                                    }
                                    {column.id == "__pkProductID" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.product_code}</td>
                                    }
                                    {column.id == "_fkSubID" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.subdivision.subdivision_code}</td>
                                    }
                                    {column.id == "price Change Since Open" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.price_changes_since_open+'%'}</td>
                                    }
                                    {column.id == "price Change Last 12 Months" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.price_changes_last_12_Month+'%'}</td>
                                    }
                                    {column.id == "action" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>
                                        <div className="d-flex justify-content-center">
                                          <Link
                                            to={`/productupdate/${element.id}`}
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
      <ProductOffcanvas
        ref={product}
        Title="Add Product"
        parentCallback={handleCallback}
      />

    <BulkProductUpdate
        ref={bulkProduct}
        Title="Bulk Edit Product sale"
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
                                    <span className="text-danger"></span>
                                  </label>
                                  <MultiSelect
                                    name="status"
                                    options={statusOptions}
                                    value={selectedStatus}
                                    onChange={handleSelectStatusChange }
                                    placeholder={"Select Plan Status"} 
                                  />
                                  {/* <select
                                    className="default-select form-control"
                                    value={filterQuery.status}
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
                                <label className="form-label">BUILDER NAME:{" "}</label>
                                  <Form.Group controlId="tournamentList">
                                    <MultiSelect
                                      name="builder_name"
                                      options={builderDropDown}
                                      value={selectedBuilderName}
                                      onChange={handleSelectBuilderNameChange }
                                      placeholder={"Select Builder Name"} 
                                    />
                                  </Form.Group>
                              </div>
                              <div className="col-md-3 mt-3">
                                <label className="form-label">
                                SUBDIVISION NAME:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <Form.Group controlId="tournamentList">
                                    <MultiSelect
                                      name="subdivision_name"
                                      options={BuilderList}
                                      value={selectedSubdivisionName}
                                      onChange={handleSelectSubdivisionNameChange }
                                      placeholder={"Select Subdivision Name"} 
                                    />
                                  </Form.Group>
                                {/* <Form.Group controlId="tournamentList">
                          <Select
                            options={BuilderList}
                            onChange={HandleSelectChange}
                            getOptionValue={(option) => option.name}
                            getOptionLabel={(option) => option.name}
                            value={BuilderList.name}
                            name="subdivision_name"
                          ></Select>
                        </Form.Group>   */}

                              </div>
                              <div className="col-md-3 mt-3">
                                <label className="form-label">
                                PRODUCT NAME :{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input  value={filterQuery.name} name="name" className="form-control"  onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3">
                                <label className="form-label">
                                SQUARE FOOTAGE:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input name="sqft" value={filterQuery.sqft} className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3">
                                <label className="form-label">
                                STORIES:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input name="stories" value={filterQuery.stories} className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3">
                                <label className="form-label">
                                BEDROOMS:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input value={filterQuery.bedroom} name="bedroom" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3">
                                <label className="form-label">
                                BATH ROOMS:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input value={filterQuery.bathroom} name="bathroom" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3">
                                <label className="form-label">
                                GARAGE:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input type="text" name="garage" value={filterQuery.garage} className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3">
                                <label className="form-label">
                                CURRENT BASE PRICE:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input type="text" value={filterQuery.current_base_price} name="current_base_price" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3">
                                <label className="form-label">
                                PRODUCT TYPE:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input value={filterQuery.product_type} name="product_type" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3">
                                <label className="form-label">
                                AREA:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input value={filterQuery.area} name="area" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3 ">
                                <label className="form-label">
                                MASTER PLAN:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input value={filterQuery.masterplan_id} name="masterplan_id" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3 mb-3">
                                <label className="form-label">
                                ZIP CODE:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input value={filterQuery.zipcode} name="zipcode" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3 mb-3">
                                <label className="form-label">
                                LOT WIDTH:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input value={filterQuery.lotwidth} name="lotwidth" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3 mb-3">
                                <label className="form-label">
                                LOT SIZE:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input value={filterQuery.lotsize} name="lotsize" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3 mb-3">
                                <label className="form-label">
                                ZONING:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input value={filterQuery.zoning} name="zoning" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3 mb-3">
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
                              </select>                                 */}
                              </div>
                              <div className="col-md-3 mt-3 mb-3">
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
                                    </select>           */}
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
                            {excelLoading ? <div style={{ textAlign: "center"}}><ClipLoader color="#4474fc" /></div> :
                            <>
                            <h5 className="">Calculation Filter Options</h5>
                            <div className="border-top">
                              <div className="row">
                                <div className="col-md-3 mt-3 mb-3">
                                  <label className="form-label">CURRENT PRICE PER SQFT:{" "}</label>
                                  <input style={{marginTop: "20px"}} value={filterQuery.current_price_per_sqft} name="current_price_per_sqft" className="form-control" onChange={handleInputChange} />
                                </div>
                                <div className="col-md-3 mt-3 mb-3">
                                  <label className="form-label">PRICE CHANGE SINCE OPEN:{" "}</label>
                                  <input value={filterQuery.price_changes_since_open} name="price_changes_since_open" className="form-control" onChange={handleInputChange} />
                                </div>
                                <div className="col-md-3 mt-3 mb-3">
                                  <label className="form-label">PRICE CHANGE LAST 12 MONTHS:{" "}</label>
                                  <input value={filterQuery.price_changes_last_12_Month} name="price_changes_last_12_Month" className="form-control" onChange={handleInputChange} />
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
                    <Tab label="Products Details" value="1" />
                    <Tab label="Base Price" value="2" />
                  </TabList>
                </Box>
                <TabPanel value="1" className="p-0">
                  <div className="row">
                    <div className="col-xl-4 mt-4">
                      <label className="">Subdivision:</label>
                      <div>
                        <span className="fw-bold">
                          {ProductDetails.subdivision.name || "NA"}
                        </span>
                      </div>
                    </div>

                    <div className="col-xl-4 mt-4">
                      <label className="">Product Code:</label>
                      <div>
                        <span className="fw-bold">
                          {ProductDetails.product_code || "NA"}
                        </span>
                      </div>
                    </div>

                    <div className="col-xl-4 mt-4">
                      <label className="">Name :</label>
                      <div>
                        <span className="fw-bold">
                          {ProductDetails.name || "NA"}
                        </span>
                      </div>
                    </div>

                    <div className="col-xl-4 mt-4">
                      <label className="">Stories:</label>
                      <div>
                        <span className="fw-bold">
                          {ProductDetails.stories || "NA"}
                        </span>
                      </div>
                    </div>

                    <div className="col-xl-4 mt-4">
                      <label className="">Status:</label>
                      <div>
                        <span className="fw-bold">
                          {ProductDetails.status === 1 && "Active"}
                          {ProductDetails.status === 0 && "Sold Out"}
                          {ProductDetails.status === 2 && "Future"}
                        </span>
                      </div>
                    </div>

                    <div className="col-xl-4 mt-4">
                      <label className="">Garage:</label>
                      <div>
                        <span className="fw-bold">
                          {ProductDetails.garage || "NA"}
                        </span>
                      </div>
                    </div>

                    <div className="col-xl-4 mt-4">
                      <label className="">Price Change:</label>
                      <div>
                        <span className="fw-bold">
                          {(
                            <PriceComponent
                              price={ProductDetails.pricechange}
                            />
                          ) || "NA"}
                        </span>
                      </div>
                    </div>

                    <div className="col-xl-4 mt-4">
                      <label className="">Bathroom:</label>
                      <div>
                        <span className="fw-bold">
                          {ProductDetails.bathroom || "NA"}
                        </span>
                      </div>
                    </div>

                    <div className="col-xl-4 mt-4">
                      <label className="">Recent Price:</label>
                      <div>
                        <span className="fw-bold">
                          {(
                            <PriceComponent
                              price={ProductDetails.recentprice}
                            />
                          ) || "NA"}
                        </span>
                      </div>
                    </div>

                    <div className="col-xl-4 mt-4">
                      <label className="">Bedroom :</label>
                      <div>
                        <span className="fw-bold">
                          {ProductDetails.bedroom || "NA"}
                        </span>
                      </div>
                    </div>

                    <div className="col-xl-4 mt-4">
                      <label className="">Recent Price SQFT:</label>
                      <div>
                        <span className="fw-bold">
                          {(
                            <PriceComponent
                              price={ProductDetails.recentpricesqft}
                            />
                          ) || "NA"}
                        </span>
                      </div>
                    </div>

                    <div className="col-xl-4 mt-4">
                      <label className="">SQFT:</label>
                      <div>
                        <span className="fw-bold">
                          {ProductDetails.sqft || "NA"}
                        </span>
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
                                  <strong>Product Code</strong>
                                </th>
                                <th>
                                  <strong>Base Price</strong>
                                </th>
                                <th className="d-flex justify-content-end">
                                  <strong>Date</strong>
                                </th>
                              </tr>
                            </thead>
                            <tbody style={{ textAlign: "center" }}>
                              {ProductDetails.base_price &&
                              Array.isArray(ProductDetails.base_price) &&
                              ProductDetails.base_price.length > 0 ? (
                                ProductDetails.base_price.map(
                                  (element, index) => (
                                    <tr
                                      onClick={handlePriceClick}
                                      key={element.id}
                                      style={{
                                        textAlign: "center",
                                        cursor: "pointer",
                                      }}
                                    >
                                      <td>{index + 1}</td>

                                      <td>{ProductDetails.product_code}</td>
                                      <td>
                                        <PriceComponent
                                          price={element.baseprice}
                                        />{" "}
                                      </td>
                                      <td>
                                        <DateComponent date={element.date} />
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
                            {element.field_name == "Bath Rooms" ? "Bathrooms" : element.field_name}
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
                {col.label == "Bath Rooms" ? "Bathrooms" : col.label}
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
                                />
                                <label className="form-check-label" htmlFor={`checkbox-${col.key}`}>
                                <span>{columns.find(column => column.key === col.key)?.label || col.key}</span>:<span>{col.direction}</span>
                                    
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

export default ProductList;
