import React, { useState, useEffect, useRef } from "react";

import AdminPriceService from "../../../API/Services/AdminService/AdminPriceService";
import PriceComponent from "../../components/Price/PriceComponent";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import PriceOffcanvas from "./PriceOffcanvas";
import MainPagetitle from "../../layouts/MainPagetitle";
import Button from "react-bootstrap/Button";
import { debounce } from "lodash";
import ClipLoader from "react-spinners/ClipLoader";
import DateComponent from "../../components/date/DateFormat";
import AccessField from "../../components/AccssFieldComponent/AccessFiled";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import ColumnReOrderPopup from "../../popup/ColumnReOrderPopup";
import { Offcanvas, Form, Row } from "react-bootstrap";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';  
import BulkPriceUpdate from "./BulkPriceUpdate";
import Select from "react-select";
import AdminBuilderService from "../../../API/Services/AdminService/AdminBuilderService";
import AdminSubdevisionService from "../../../API/Services/AdminService/AdminSubdevisionService";
import { MultiSelect } from "react-multi-select-component";
import DatePicker from "react-datepicker";


const PriceList = () => {
  const [excelLoading, setExcelLoading] = useState(true);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const resetSelection = () => {
    setSelectAll(false);
    setSelectedColumns([]);
  };

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
  
  const handleRemoveSelected = () => {
      const newSortConfig = sortConfig.filter(item => selectedCheckboxes.includes(item.key));
      setSortConfig(newSortConfig);
      setSelectedCheckboxes([]);
  };
  const [showSort, setShowSort] = useState(false);
 const handleSortClose = () => setShowSort(false);
 const [exportmodelshow, setExportModelShow] = useState(false)
 const [AllPriceListExport, setAllPriceListExport] = useState([]);
 const [selectedArea, setSelectedArea] = useState([]);
 const [selectedMasterPlan, setSelectedMasterPlan] = useState([]);
 const [productTypeStatus, setProductTypeStatus] = useState([]);
 const [seletctedZipcode, setSelectedZipcode] = useState([]);
 console.log(AllPriceListExport);

 const handleColumnToggle = (column) => {
  const updatedColumns = selectedColumns.includes(column)
    ? selectedColumns.filter((col) => col !== column)
    : [...selectedColumns, column];
    console.log(updatedColumns);
  setSelectedColumns(updatedColumns); 
  setSelectAll(updatedColumns.length === exportColumns.length); 
};

const [manageFilterOffcanvas, setManageFilterOffcanvas] = useState(false);

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
  { label: '_fkProductID ', key: 'product_code' }, 
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
  { label: '_fkProductID ', key: 'product_code' }, 
   
];

const handleDownloadExcel = () => {
  setExportModelShow(false);
  setSelectedColumns("");

  let tableHeaders;
  if (selectedColumns.length > 0) {
    tableHeaders = selectedColumns;
  } else {
    tableHeaders = headers.map((c) => c.label);
  }
  console.log("AllPriceListExport",AllPriceListExport);

  const tableData = AllPriceListExport.map((row) => {
    return tableHeaders.map((header) => {
      switch (header) {
        case "Date":
          return row.created_at ? formatDate(row.created_at) : "" || '';
        case "Builder Name":
          return row.product.subdivision &&
          row.product.subdivision.builder?.name; 
        case "Subdivision Name":
          return row.product.subdivision &&
          row.product.subdivision?.name;
        case "Product Name":
          return row.name || '';
        case "Square Footage":
          return row.product.sqft
        case "Stories":
          return row.product.stories || '';
        case "Bedrooms":
          return row.product.bedroom || '';
        case "Bathrooms":
          return row.product.bathrooms || '';
        case "Garage":
          return row.product.garage || '';
        case "Base Price":
          return row.baseprice || '';
        case "Price Per SQFT":
          return row.product.recentpricesqft || '';
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
          return row.product.subdivision.age === 1 ? "Yes" : row.product.subdivision.age === 0 ? "No" : '';
        case "All Single Story":
          return row.product.subdivision.single === 1 ? "Yes" : row.product.subdivision.single === 0 ? "No" : '';
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

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Price List');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(data, 'Price_List.xlsx');

  resetSelection();
  setExportModelShow(false);
};

const [filterQuery, setFilterQuery] = useState({
  from:"",
  to:"",
  builder_name:"",
  name:"",
  subdivision_name:"",
  sqft:"",
  stories:"",
  bedroom:"",
  bathroom:"",
  garage:"",
  baseprice:"",
  price_per_sqft:"",
  product_type:"",
  area:"",
  masterplan_id:"",
  zipcode:"",
  lotwidth:"",
  lotsize:"",
  zoning:"",
  age:"",
  single:""
});



  // const [selectedColumns, setSelectedColumns] = useState([]);
  const [Error, setError] = useState("");
  const navigate = useNavigate();
  const [priceList, setPriceList] = useState([]);
  // const [currentPage, setCurrentPage] = useState(1);
  // const recordsPage = 20;
  // const lastIndex = currentPage * recordsPage;
  // const firstIndex = lastIndex - recordsPage;
  // const records = priceList.slice(firstIndex, lastIndex);
  // const npage = Math.ceil(priceList.length / recordsPage);
  // const number = [...Array(npage + 1).keys()].slice(1);
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
  console.log("columns",columns);
  const [draggedColumns, setDraggedColumns] = useState(columns);
  const [selectedLandSales, setSelectedLandSales] = useState([]);

  useEffect(() => {
    console.log(fieldList); // You can now use fieldList in this component
  }, [fieldList]);

  const checkFieldExist = (fieldName) => {
    return fieldList.includes(fieldName.trim());
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

  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isFormLoading, setIsFormLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState([]);
  useEffect(() => {
    setSelectedCheckboxes(sortConfig.map(col => col.key));
}, [sortConfig]);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState(sortConfig.map(col => col.key));

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPage = 100;
  const lastIndex = currentPage * recordsPage;
  const firstIndex = lastIndex - recordsPage;
  const [npage, setNpage] = useState(0);
  const number = [...Array(npage + 1).keys()].slice(1);

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

  const product = useRef();
  const stringifySortConfig = (sortConfig) => {
    return sortConfig.map((sort) => `${sort.key}:${sort.direction}`).join(",");
  };
  const bulkPrice = useRef();

  const getpriceList = async (pageNumber) => {
    try {
      let sortConfigString = "";
      if (sortConfig !== null) {
        sortConfigString = "&sortConfig=" + stringifySortConfig(sortConfig);
      }
      const response = await AdminPriceService.index(pageNumber,sortConfigString,searchQuery);
      const responseData = await response.json();
      setIsLoading(false);
      setNpage(Math.ceil(responseData.total / recordsPage));
      setPriceList(responseData.data);
      setProductListCount(responseData.total)

    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(errorJson.message);
      }
    }
  };
  useEffect(() => {
    if (localStorage.getItem("usertoken")) {
      getpriceList(currentPage);
      fetchAllPages(searchQuery, sortConfig)
    } else {
      navigate("/");
    }
  }, []);

  async function fetchAllPages(searchQuery, sortConfig) {
    const response = await AdminPriceService.index(1, searchQuery, sortConfig ? `&sortConfig=${stringifySortConfig(sortConfig)}` : "");
    const responseData = await response.json();
    const totalPages = Math.ceil(responseData.total / recordsPage);
    let allData = responseData.data;
    for (let page = 2; page <= totalPages; page++) {
      const pageResponse = await AdminPriceService.index(page, searchQuery, sortConfig ? `&sortConfig=${stringifySortConfig(sortConfig)}` : "");
      const pageData = await pageResponse.json();
      allData = allData.concat(pageData.data);
    }
    setAllPriceListExport(allData);
    setExcelLoading(false);
  }
  const handleDelete = async (e) => {
    try {
      let responseData = await AdminPriceService.destroy(e).json();
      if (responseData.status === true) {
        getpriceList();
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
        getpriceList();
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
    getpriceList();
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
  // const debouncedHandleSearch = useRef(
  //   debounce((value) => {
  //     setSearchQuery(value);
  //   }, 1000)
  // ).current;

  // useEffect(() => {
  //   getpriceList(currentPage);
  // }, [currentPage, searchQuery]);

  // const HandleSearch = (e) => {
  //   setIsLoading(true);
  //   const query = e.target.value.trim();
  //   if (query) {
  //     debouncedHandleSearch(`&q=${query}`);
  //   } else {
  //     setSearchQuery("");
  //   }
  // };

  const [builderDropDown, setBuilderDropDown] = useState([]);
  const [selectedBuilderName, setSelectedBuilderName] = useState([]);
  const [selectedSubdivisionName, setSelectedSubdivisionName] = useState([]);
  const [selectedAge, setSelectedAge] = useState([]);
  const [selectedSingle, setSelectedSingle] = useState([]);
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
  const HandleSelectChange = (selectedOption) => {
    setFilterQuery((prevFilterQuery) => ({
      ...prevFilterQuery,
      builder_name: selectedOption.name,
    }));
  };

  const handleSelectBuilderNameChange  = (selectedItems) => {  
    const selectedValues = selectedItems.map(item => item.value);
    setSelectedValues(selectedValues);
    setSelectedBuilderName(selectedItems);

    const selectedNames = selectedItems.map(item => item.label).join(', ');
    setFilterQuery(prevState => ({
      ...prevState,
      builder_name: selectedNames
  }));
  }

  const handleSelectSubdivisionNameChange  = (selectedItems) => {  
    const selectedValues = selectedItems.map(item => item.value);
    setSelectedValues(selectedValues);
    setSelectedSubdivisionName(selectedItems);
    const selectedNames = selectedItems.map(item => item.label).join(', ');
    setFilterQuery(prevState => ({
      ...prevState,
      subdivision_name: selectedNames
  }));
  }

  const HandleSubSelectChange = (selectedOption) => {
    setFilterQuery((prevFilterQuery) => ({
      ...prevFilterQuery,
      subdivision_name: selectedOption.name,
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
    setFilterQuery({
      from:"",
      to:"",
      name:"",
      builder_name:"",
      subdivision_name:"",
      sqft:"",
      stories:"",
      bedroom:"",
      bathroom:"",
      garage:"",
      baseprice:"",
      price_per_sqft:"",
      product_type:"",
      area:"",
      masterplan_id:"",
      zipcode:"",
      lotwidth:"",
      lotsize:"",
      zoning:"",
      age:"",
      single:""
    });
    setSearchQuery("");
    setManageFilterOffcanvas(false);
  };

  useEffect(() => {
    getpriceList();
  }, [filterQuery, searchQuery]);

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
    getpriceList(currentPage, sortConfig);
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
          if (responseData.data) {
            console.log(responseData);
            let message = responseData.data.message;
            if (responseData.data.failed_records > 0) {
                const problematicRows = responseData.data.failed_records_details.map(detail => detail.row).join(', ');
                message += ' Problematic Record Rows: ' + problematicRows+'.';
            }
            message += '. Record Imported: ' + responseData.data.successful_records;
            message += '. Failed Record Count: ' + responseData.data.failed_records;
            message += '. Last Row: ' + responseData.data.last_processed_row;


            swal(message).then((willDelete) => {
              if (willDelete) {
                navigate("/priceList");
                setShow(false);
              }
            });
          } else {
            swal('Error: ' + responseData.error);
            setShow(false);
          }
          getpriceList();
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
      getpriceList(currentPage,searchQuery);
      setManageFilterOffcanvas(false)

    };

  const exportToExcelData = async () => {
    try {
        const bearerToken = JSON.parse(localStorage.getItem('usertoken'));
        const response = await axios.get(
          `${process.env.REACT_APP_IMAGE_URL}api/admin/price/export`
          // 'https://hbrapi.rigicgspl.com/api/admin/price/export'
          , {
            responseType: 'blob',
            headers: {
                'Authorization': `Bearer ${bearerToken}`
            }
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'prices.xlsx');
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

const [SubdivisionList, SetSubdivisionList] = useState([]);

const getSubdivisionList = async () => {
  try {
      let response = await AdminSubdevisionService.index()
      let responseData = await response.json()
      const formattedData = responseData.data.map((subdivision) => ({
        label: subdivision.name,
        value: subdivision.id,
      }));
      SetSubdivisionList(formattedData)
  } catch (error) {
      if (error.name === 'HTTPError') {
          const errorJson = await error.response.json();
          setError(errorJson.message)
      }
  }
}
useEffect(() => {
  if (localStorage.getItem('usertoken')) {
      getSubdivisionList();
  }
  else {
      navigate('/');
  }
}, [])

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
}

const ageOptions = [
  { value: "1", label: "Yes" },
  { value: "0", label: "No" }
];

const singleOptions = [
  { value: "1", label: "Yes" },
  { value: "0", label: "No" }
];

const handleSelectAgeChange  = (selectedItems) => {  
  const selectedValues = selectedItems.map(item => item.value);
  setSelectedValues(selectedValues);
  setSelectedAge(selectedItems);
  const selectedNames = selectedItems.map(item => item.value).join(', ');
  setFilterQuery(prevState => ({
    ...prevState,
    age: selectedNames
}));
};

const handleSelectSingleChange  = (selectedItems) => {  
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
  { value: "SEVEN HILLS", label: "SEVEN HILLS"},
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

  return (
    <>
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
                        {/* <button class="btn btn-secondary cursor-none">
                          {" "}
                          <i class="fas fa-search"></i>{" "}
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
                    <div style={{marginTop: "10px"}}>
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
                    <button onClick={() => !excelLoading ? setExportModelShow(true) : ""}className="btn btn-primary btn-sm me-1">
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
                        + Add Base Price
                      </Link>
                      <Link
                        to={"#"}
                        className="btn btn-primary btn-sm ms-1"
                        data-bs-toggle="offcanvas"
                        onClick={() => bulkPrice.current.showEmployeModal()}
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
                        Showing {lastIndex - recordsPage  } to {lastIndex} of{" "}
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
                                checked={selectedLandSales.length === priceList.length}
                                onChange={(e) =>
                                  e.target.checked
                                    ? setSelectedLandSales(priceList.map((user) => user.id))
                                    : setSelectedLandSales([])
                                }
                              />
                            </th>
                            <th>
                              <strong>No.</strong>
                            </th>
                            {columns.map((column) => (
                              <th style={{ textAlign: "center", cursor: "pointer" }} key={column.id} onClick={() => column.id != "action" ? requestSort(
                                column.id == "date" ? "created_at" : 
                                column.id == "squre Footage" ? "sqft" : 
                                column.id == "bedrooms" ? "bedroom" : 
                                column.id == "base Price" ? "baseprice" : 
                                column.id == "price Per SQFT" ? "perSQFT" : 
                                column.id == "lot Size" ? "lotsize" : 
                                column.id == "all Single Story" ? "stories" : 
                                column.id == "__pkPriceID" ? "id" : 
                                column.id == "_fkProductID" ? "_fkProductID" : toCamelCase(column.id)) : ""}>
                                <strong>
                                  {column.id == "squre Footage" ? "Square Footage" : column.label}
                                  {column.id != "action" && sortConfig.some(
                                    (item) => item.key === (
                                      column.id == "date" ? "created_at" : 
                                      column.id == "squre Footage" ? "sqft" : 
                                      column.id == "bedrooms" ? "bedroom" : 
                                      column.id == "base Price" ? "baseprice" : 
                                      column.id == "price Per SQFT" ? "perSQFT" : 
                                      column.id == "lot Size" ? "lotsize" : 
                                      column.id == "all Single Story" ? "stories" : 
                                      column.id == "__pkPriceID" ? "id" : 
                                      column.id == "_fkProductID" ? "_fkProductID" : toCamelCase(column.id))
                                    ) ? (
                                    <span>
                                      {column.id != "action" && sortConfig.find(
                                        (item) => item.key === (
                                          column.id == "date" ? "created_at" : 
                                          column.id == "squre Footage" ? "sqft" : 
                                          column.id == "bedrooms" ? "bedroom" : 
                                          column.id == "base Price" ? "baseprice" : 
                                          column.id == "price Per SQFT" ? "perSQFT" : 
                                          column.id == "lot Size" ? "lotsize" : 
                                          column.id == "all Single Story" ? "stories" : 
                                          column.id == "__pkPriceID" ? "id" : 
                                          column.id == "_fkProductID" ? "_fkProductID" : toCamelCase(column.id))
                                        ).direction === "asc" ? "↑" : "↓"}
                                    </span>
                                    ) : (
                                    column.id != "action" && <span>↑↓</span>
                                  )}
                                </strong>
                              </th>
                            ))}
                            {/* {checkFieldExist("Date") && (
                              <th onClick={() => requestSort("created_at")}>
                                <strong>
                                  Date
                                  {sortConfig.key !== "created_at" ? "↑↓" : ""}
                                  {sortConfig.key === "created_at" && (
                                    <span>
                                      {sortConfig.direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  )}
                                </strong>
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("Builder Name") && (
                              <th onClick={() => requestSort("builderName")}>
                                Builder Name
                                {sortConfig.key !== "builderName" ? "↑↓" : ""}
                                {sortConfig.key === "builderName" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )} */}

                            {/* {checkFieldExist("Subdivision Name") && (
                              <th
                                onClick={() => requestSort("subdivisionName")}
                              >
                                Subdivision Name
                                {sortConfig.key !== "subdivisionName"
                                  ? "↑↓"
                                  : ""}
                                {sortConfig.key === "subdivisionName" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("Product Name") && (
                              <th onClick={() => requestSort("productName")}>
                                <strong>
                                  Product Name
                                  {sortConfig.key !== "productName" ? "↑↓" : ""}
                                  {sortConfig.key === "productName" && (
                                    <span>
                                      {sortConfig.direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  )}
                                </strong>
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("Squre Footage") && (
                              <th onClick={() => requestSort("sqft")}>
                                <strong>
                                  Squre Footage
                                  {sortConfig.key !== "sqft" ? "↑↓" : ""}
                                  {sortConfig.key === "sqft" && (
                                    <span>
                                      {sortConfig.direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  )}
                                </strong>
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("Stories") && (
                              <th onClick={() => requestSort("stories")}>
                                <strong>
                                  Stories
                                  {sortConfig.key !== "stories" ? "↑↓" : ""}
                                  {sortConfig.key === "stories" && (
                                    <span>
                                      {sortConfig.direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  )}
                                </strong>
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("Bedrooms") && (
                              <th onClick={() => requestSort("bedroom")}>
                                <strong>
                                  Bedrooms
                                  {sortConfig.key !== "bedroom" ? "↑↓" : ""}
                                  {sortConfig.key === "bedroom" && (
                                    <span>
                                      {sortConfig.direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  )}
                                </strong>
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("Bathroom") && (
                              <th onClick={() => requestSort("bathroom")}>
                                <strong>
                                  Bathroom
                                  {sortConfig.key !== "bathroom" ? "↑↓" : ""}
                                  {sortConfig.key === "bathroom" && (
                                    <span>
                                      {sortConfig.direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  )}
                                </strong>
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("Garage") && (
                              <th onClick={() => requestSort("garage")}>
                                <strong>
                                  Garage
                                  {sortConfig.key !== "garage " ? "↑↓" : ""}
                                  {sortConfig.key === "garage " && (
                                    <span>
                                      {sortConfig.direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  )}
                                </strong>
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("Base Price") && (
                              <th onClick={() => requestSort("baseprice")}>
                                <strong>Base Price</strong>
                                {sortConfig.key !== "baseprice" ? "↑↓" : ""}
                                {sortConfig.key === "baseprice" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("Price Per SQFT") && (
                              <th onClick={() => requestSort("perSQFT")}>
                                <strong>Price Per SQFT</strong>
                                {sortConfig.key !== "perSQFT" ? "↑↓" : ""}
                                {sortConfig.key === "perSQFT" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("Product Type") && (
                              <th onClick={() => requestSort("productType")}>
                                <strong>Product Type</strong>
                                {sortConfig.key !== "productType" ? "↑↓" : ""}
                                {sortConfig.key === "productType" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("Area") && (
                              <th onClick={() => requestSort("area")}>
                                <strong>Area</strong>
                                {sortConfig.key !== "area" ? "↑↓" : ""}
                                {sortConfig.key === "area" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("Master Plan") && (
                              <th
                              >
                                <strong>Master Plan</strong>
                               
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("Zip Code") && (
                              <th
                              >
                                <strong>Zip Code</strong>
                                
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("Lot Width") && (
                              <th onClick={() => requestSort("lotWidth")}>
                                <strong>Lot Width</strong>
                                {sortConfig.key !== "lotWidth" ? "↑↓" : ""}
                                {sortConfig.key === "lotWidth" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("Lot Size") && (
                              <th onClick={() => requestSort("lotsize")}>
                                <strong>Lot Size</strong>
                                {sortConfig.key !== "lotsize" ? "↑↓" : ""}
                                {sortConfig.key === "lotsize" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("Zoning") && (
                              <th onClick={() => requestSort("zoning")}>
                                <strong>Zoning</strong>
                                {sortConfig.key !== "zoning" ? "↑↓" : ""}
                                {sortConfig.key === "zoning" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("Age Restricted") && (
                              <th
                              >
                                <strong>Age Restricted</strong>
                                
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("All Single Story") && (
                              <th onClick={() => requestSort("stories")}>
                                <strong>All Single Story</strong>
                                {sortConfig.key !== "stories" ? "↑↓" : ""}
                                {sortConfig.key === "stories" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("__pkPriceID") && (
                              <th onClick={() => requestSort("id")}>
                                <strong>__pkPriceID </strong>
                                {sortConfig.key !== "id" ? "↑↓" : ""}
                                {sortConfig.key === "id" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("_fkProductID") && (
                              <th onClick={() => requestSort("_fkProductID")}>
                                <strong>_fkProductID </strong>
                                {sortConfig.key !== "_fkProductID" ? "↑↓" : ""}
                                {sortConfig.key === "_fkProductID" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )} */}

                            {/* {checkFieldExist("Action") && <th>Action</th>} */}

                          </tr>
                        </thead>
                        <tbody style={{ textAlign: "center" }}>
                          {priceList !== null && priceList.length > 0 ? (
                            priceList.map((element, index) => (
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
                                  {column.id == "date" &&
                                    <td key={column.id} style={{ textAlign: "center" }}><DateComponent date={element.created_at} /></td>
                                  }
                                  {column.id == "builder Name" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{ element.product && element.product && element.product.subdivision &&
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
                                    <td key={column.id} style={{ textAlign: "center" }}>{ element.product && element.product.subdivision.lotwidth}</td>
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
      <PriceOffcanvas
        ref={product}
        Title="Add Base Price"
        parentCallback={handleCallback}
      />
        <BulkPriceUpdate
        ref={bulkPrice}
        Title="Bulk Edit Closing"
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
            Base Price Details{" "}
          </h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => {setShowOffcanvas(false);clearPriceDetails();}}
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
            {/* <div className="row">
              <div className="col-xl-4 mt-4">
                <label className="">Product :</label>
                <div className="fw-bolder">
                  {PriceDetails.product !== null &&
                  PriceDetails.product.product_code !== undefined
                    ? PriceDetails.product.product_code
                    : "NA"}
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Base Price:</label>
                <div>
                  <span className="fw-bold">
                    {<PriceComponent price={PriceDetails.baseprice} /> || "NA"}
                  </span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Date:</label>
                <div>
                  <span className="fw-bold">
                    {<DateComponent date={PriceDetails.date} /> || "NA"}
                  </span>
                </div>
              </div>
            </div> */}
            <div style={{marginTop: "10px"}}>
              <span className="fw-bold" style={{fontSize: "22px"}}>
                {PriceDetails.product &&  PriceDetails.product.subdivision.builder?.name || "NA"}
              </span><br />
              <span className="fw-bold" style={{fontSize: "40px"}}>
                {PriceDetails.product && PriceDetails.product.subdivision !== null && PriceDetails.product.subdivision.name !== undefined
                  ? PriceDetails.product.subdivision.name
                  : "NA"
                }
              </span><br />
              <label className="" style={{fontSize: "22px"}}><b>PRODUCT NAME:</b>&nbsp;<span>{PriceDetails.product.name || "NA"}</span></label><br />

              <label className="" style={{fontSize: "22px"}}><b>PRODUCT TYPE:</b>&nbsp;<span>{PriceDetails.product.subdivision?.product_type || "NA"}</span></label><br />

              <hr style={{borderTop:"2px solid black", width: "60%", marginTop: "10px"}}></hr>

              <div className="d-flex" style={{marginTop: "5px"}}>
                <div className="fs-18" style={{width: "180px"}}><span><b>AREA:</b></span>&nbsp;<span>{PriceDetails.product.subdivision?.area || "NA"}</span></div>
                <div className="fs-18"><span><b>MASTER PLAN:</b></span>&nbsp;<span>{PriceDetails.product.subdivision?.masterplan_id || "NA"}</span></div>
              </div>
              <label className="fs-18" style={{marginTop: "5px"}}><b>ZIP CODE:</b>&nbsp;<span>{PriceDetails.product.subdivision?.zipcode || "NA"}</span></label><br />
              <label className="fs-18"><b>CROSS STREETS:</b>&nbsp;<span>{PriceDetails.product.subdivision?.crossstreet || "NA"}</span></label><br />
              <label className="fs-18"><b>JURISDICTION:</b>&nbsp;<span>{PriceDetails.product.subdivision?.juridiction || "NA"}</span></label>

              <hr style={{borderTop:"2px solid black", width: "60%", marginTop: "10px"}}></hr>

              <div className="d-flex" style={{marginTop: "5px"}}>
                <div className="fs-18" style={{width: "300px"}}><span><b>STATUS:</b></span>&nbsp;<span>        {PriceDetails.product && PriceDetails.product.status === 1 && "Active"}
                          {PriceDetails.product.status === 0 && "Sold Out"}
                          {PriceDetails.product.status === 2 && "Future"}</span></div>
                <div className="fs-18"><span><b>RECENT PRICE:</b></span>&nbsp;<span>{(<PriceComponent price={PriceDetails.baseprice}/>
                          ) || "NA"}</span></div>
              </div>
              <div className="d-flex" style={{marginTop: "5px"}}>
                <div className="fs-18" style={{width: "300px"}}><span><b>SQFT:</b></span>&nbsp;<span>{PriceDetails.product && PriceDetails.product.sqft || "NA"}</span></div>
                <div className="fs-18"><span><b>$ per SQFT:</b></span>&nbsp;<span>
                {(<PriceComponent price= {PriceDetails.product && PriceDetails.product.current_price_per_sqft}/>
                          ) || "NA"}
                  </span></div>
              </div>
              <div className="d-flex" style={{marginTop: "5px"}}>
                <div className="fs-18" style={{width: "300px"}}><span><b>STORIES:</b></span>&nbsp;<span>{PriceDetails.product.stories ||"NA"}</span></div>
                <div className="fs-18"><span><b>DATE:</b></span>&nbsp;<span>  {<DateComponent date={PriceDetails.date} /> || "NA"}</span></div>
              </div>
              <div className="d-flex" style={{marginTop: "5px"}}>
                <div className="fs-18" style={{width: "300px"}}><span><b>BEDROOMS:</b></span>&nbsp;<span>{PriceDetails.product&& PriceDetails.product.bedroom || "NA"}</span></div>
              </div>
              <div className="d-flex" style={{marginTop: "5px"}}>
                <div className="fs-18" style={{width: "300px"}}><span><b>BATHROOMS:</b></span>&nbsp;<span>{PriceDetails.product&&  PriceDetails.product.bathroom || "NA"}</span></div>
              </div>       
                  <div className="d-flex" style={{marginTop: "5px"}}>
                <div className="fs-18" style={{width: "300px"}}><span><b>GARAGE:</b></span>&nbsp;<span>{PriceDetails.product&& PriceDetails.product.garage || "NA"}</span></div>
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
                    <label className="form-label">
                      BUILDER NAME:{" "}
                    </label>
                    <Form.Group controlId="tournamentList">
                      <MultiSelect
                        name="builder_name"
                        options={builderDropDown}
                        value={selectedBuilderName}
                        onChange={handleSelectBuilderNameChange }
                        placeholder={"Select Builder Name"} 
                      />
                    </Form.Group>
                    {/* <Form.Group controlId="tournamentList">
                      <Select
                        options={builderDropDown}
                        onChange={HandleSelectChange}
                        getOptionValue={(option) => option.name}
                        getOptionLabel={(option) => option.name}
                        value={builderDropDown.name}
                        name="builder_name"
                      ></Select>
                    </Form.Group> */}
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
                        onChange={handleSelectSubdivisionNameChange }
                        placeholder={"Select Subdivision Name"} 
                      />
                    </Form.Group>
                    {/* <Form.Group controlId="tournamentList">
                      <Select
                        options={SubdivisionList}
                        onChange={HandleSubSelectChange}
                        getOptionValue={(option) => option.name}
                        getOptionLabel={(option) => option.name}
                        value={SubdivisionList.name}
                        name="subdivision_name"
                      ></Select>
                    </Form.Group>                       */}
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">
                      PRODUCT NAME :{" "}
                      <span className="text-danger"></span>
                    </label>
                    <input value={filterQuery.name} name="name" className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">
                      SQUARE FOOTAGE:{" "}
                      <span className="text-danger"></span>
                    </label>
                    <input name="sqft" value={filterQuery.sqft} className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">
                      STORIES:{" "}
                      <span className="text-danger"></span>
                    </label>
                    <input name="stories" value={filterQuery.stories} className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">
                      BEDROOMS:{" "}
                      <span className="text-danger"></span>
                    </label>
                    <input value={filterQuery.bedroom} name="bedroom" className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">
                      BATH ROOMS:{" "}
                      <span className="text-danger"></span>
                    </label>
                    <input value={filterQuery.bathroom} name="bathroom" className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">
                      GARAGE:{" "}
                      <span className="text-danger"></span>
                    </label>
                    <input type="text" name="garage" value={filterQuery.garage} className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">
                      BASE PRICE:{" "}
                      <span className="text-danger"></span>
                    </label>
                    <input name="baseprice" value={filterQuery.baseprice} className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-3">
                    <label className="form-label">
                      PRICE PER SQFT:{" "}
                      <span className="text-danger"></span>
                    </label>
                    <input name="price_per_sqft" value={filterQuery.price_per_sqft} className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-3 mb-3">
                                <label className="form-label">
                                PRODUCT TYPE:{" "}
                                  <span className="text-danger"></span>

                                </label>
                                <MultiSelect
                                name="product_type"
                                options={productTypeOptions}
                                value={productTypeStatus}
                                onChange={handleSelectProductTypeChange }
                                placeholder="Select Prodcut Type" 
                              />
                                {/* <input value={filterQuery.product_type} name="product_type" className="form-control" onChange={HandleFilter}/> */}
                              </div>
                              <div className="col-md-3 mt-3 mb-3">
                                <label className="form-label">
                                AREA:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <MultiSelect
                                name="area"
                                options={areaOption}
                                value={selectedArea}
                                onChange={handleSelectAreaChange }
                                placeholder="Select Area" 
                              />
                                {/* <input value={filterQuery.area} name="area" className="form-control" onChange={HandleFilter}/> */}
                              </div>
                              <div className="col-md-3 mt-3 mb-3">
                                <label className="form-label">
                                MASTERPLAN:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <MultiSelect
                                name="masterplan_id"
                                options={masterPlanOption}
                                value={selectedMasterPlan}
                                onChange={handleSelectMasterPlanChange }
                                placeholder="Select Area" 
                              />
                                {/* <input value={filterQuery.masterplan_id} name="masterplan_id" className="form-control" onChange={HandleFilter}/> */}
                              </div>
                              <div className="col-md-3 mt-3 mb-3">
                                <label className="form-label">
                                ZIP CODE:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <MultiSelect
                                name="zipcode"
                                options={zipCodeOption}
                                value={seletctedZipcode}
                                onChange={handleSelectZipcodeChange}
                                placeholder="Select Zipcode" 
                              />
                                {/* <input value={filterQuery.zipcode} name="zipcode" className="form-control" onChange={HandleFilter}/> */}
                              </div>
                  <div className="col-md-3 mt-3 mb-3">
                    <label className="form-label">
                      LOT WIDTH:{" "}
                      <span className="text-danger"></span>
                    </label>
                    <input value={filterQuery.lotwidth} name="lotwidth" className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-3 mt-3 mb-3">
                    <label className="form-label">
                      LOT SIZE:{" "}
                      <span className="text-danger"></span>
                    </label>
                    <input value={filterQuery.lotsize} name="lotsize" className="form-control" onChange={HandleFilter} />
                  </div>
                  {/* <div className="col-md-3 mt-3 mb-3">
                    <label className="form-label">
                      ZONING:{" "}
                      <span className="text-danger"></span>
                    </label>
                    <input value={filterQuery.zoning} name="zoning" className="form-control" onChange={HandleFilter} />
                  </div> */}
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
                    </select> */}
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
                {col.label == "Squre Footage" ? "Square Footage" : col.label}
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
    </>
  );
};

export default PriceList;
