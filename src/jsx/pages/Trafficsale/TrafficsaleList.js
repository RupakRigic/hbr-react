import React, { useState, useEffect, useRef } from "react";

import AdminTrafficsaleService from "../../../API/Services/AdminService/AdminTrafficsaleService";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import TrafficsaleOffcanvas from "./TrafficsaleOffcanvas";
import MainPagetitle from "../../layouts/MainPagetitle";
import { Offcanvas, Form, Row  } from "react-bootstrap";
import { debounce } from "lodash";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import ClipLoader from "react-spinners/ClipLoader";
import DateComponent from "../../components/date/DateFormat";
import AccessField from "../../components/AccssFieldComponent/AccessFiled";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import { DownloadTableExcel, downloadExcel } from 'react-export-table-to-excel';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import ColumnReOrderPopup from "../../popup/ColumnReOrderPopup";
import BulkTrafficUpdate from "./BulkTrafficUpdate";
import Select from "react-select";
import AdminSubdevisionService from "../../../API/Services/AdminService/AdminSubdevisionService";
import AdminBuilderService from "../../../API/Services/AdminService/AdminBuilderService";
import { MultiSelect } from "react-multi-select-component";

const TrafficsaleList = () => {

  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const [excelLoading, setExcelLoading] = useState(true);
  const [selectedFileError, setSelectedFileError] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

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
  const [SubdivisionList, SetSubdivisionList] = useState([]);
  const [builderDropDown, setBuilderDropDown] = useState([]);
  const [selectedBuilderName, setSelectedBuilderName] = useState([]);
  const [selectedSubdivisionName, setSelectedSubdivisionName] = useState([]);
  const [selectedAge, setSelectedAge] = useState([]);
  const [selectedSingle, setSelectedSingle] = useState([]);
 const [selectedValues, setSelectedValues] = useState([]);


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
      builder_name: selectedNames
  }));
  }

  const HandleSubSelectChange = (selectedOption) => {
    setFilterQuery((prevFilterQuery) => ({
      ...prevFilterQuery,
      subdivision_name: selectedOption.name,
    }));
  };

  
  
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

  console.log(SubdivisionList);

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
  const [selectedLandSales, setSelectedLandSales] = useState([]);
  const bulkTrafficsale = useRef();
  const handleEditCheckboxChange = (e, userId) => {
    if (e.target.checked) {
      setSelectedLandSales((prevSelectedUsers) => [...prevSelectedUsers, userId]);
    } else {
      setSelectedLandSales((prevSelectedUsers) => prevSelectedUsers.filter((id) => id !== userId));
    }
  };
  

  const [showSort, setShowSort] = useState(false);
 const handleSortClose = () => setShowSort(false);
  const navigate = useNavigate();
  const [Error, setError] = useState("");
  const [BuilderList, setBuilderList] = useState([]);
  const [trafficsaleList, setTrafficsaleList] = useState([]);
  const [trafficListCount, setTrafficListCount] = useState('');
  const [TotaltrafficListCount, setTotalTrafficListCount] = useState('');
  const [manageFilterOffcanvas, setManageFilterOffcanvas] = useState(false);
  const HandleFilterForm = (e) =>
    {
      e.preventDefault();
      gettrafficsaleList(currentPage,searchQuery);
    };

  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState([]);
  useEffect(() => {
    setSelectedCheckboxes(sortConfig.map(col => col.key));
}, [sortConfig]);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState(sortConfig.map(col => col.key));
  const [selectAll, setSelectAll] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const resetSelection = () => {
    setSelectAll(false);
    setSelectedColumns([]);
  };
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

  useEffect(() => {
    console.log('data trafficsaleList : ',fieldList);
  }, [fieldList]);

  const checkFieldExist = (fieldName) => {
    return fieldList.includes(fieldName.trim());
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
  console.log('trafficsaleList : ',trafficsaleList);

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

  const [filterQuery, setFilterQuery] = useState({
    startDate:"",
    endDate:"",
    weekending:"",
    builder_name:"",
    subdivision_name:"",
    weeklytraffic:"",
    cancelations:"",
    netsales:"",
    lotreleased:"",
    unsoldinventory:"",
    product_type:"",
    area:"",
    masterplan_id:"",
    zipcode:"",
    lotwidth:"",
    lotsize:"",
    zoning:"",
    age:"",
    single:"",
    grosssales:"",
  });
  const [isLoading, setIsLoading] = useState(true);

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

  const trafficsale = useRef();
  const stringifySortConfig = (sortConfig) => {
    return sortConfig.map((sort) => `${sort.key}:${sort.direction}`).join(",");
  };
  const gettrafficsaleList = async (currentPage) => {
    try {
      let sortConfigString = "";
      if (sortConfig !== null) {
        sortConfigString = "&sortConfig=" + stringifySortConfig(sortConfig);
      }
      const response = await AdminTrafficsaleService.index(currentPage,sortConfigString,searchQuery);
      const responseData = await response.json();
      setTrafficsaleList(responseData.data);
      setNpage(Math.ceil(responseData.total / recordsPage));
      setTrafficListCount(responseData.total);
      setIsLoading(false);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(errorJson.message);
      }
    }
  };
  useEffect((currentPage) => {
    gettrafficsaleList(currentPage);
    fetchAllPages(searchQuery, sortConfig)
  }, [currentPage]);

  async function fetchAllPages(searchQuery, sortConfig) {
    const response = await AdminTrafficsaleService.index(1, searchQuery, sortConfig ? `&sortConfig=${stringifySortConfig(sortConfig)}` : "");
    const responseData = await response.json();
    const totalPages = Math.ceil(responseData.total / recordsPage);
    let allData = responseData.data;
    for (let page = 2; page <= totalPages; page++) {
      const pageResponse = await AdminTrafficsaleService.index(page, searchQuery, sortConfig ? `&sortConfig=${stringifySortConfig(sortConfig)}` : "");
      const pageData = await pageResponse.json();
      allData = allData.concat(pageData.data);
    }
    setAllTrafficistExport(allData);
    setExcelLoading(false);
  }
  const handleDelete = async (e) => {
    try {
      let responseData = await AdminTrafficsaleService.destroy(e).json();
      if (responseData.status === true) {
        gettrafficsaleList();
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
        gettrafficsaleList();
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
    gettrafficsaleList();
  };

  const handleRowClick = async (id) => {
    try {
      let responseData = await AdminTrafficsaleService.show(id).json();
      setTrafficDetails(responseData);
      console.log(responseData);

      setShowOffcanvas(true);
    } catch (error) {
      if (error.name === "HTTPError") {
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
  //   gettrafficsaleList();
  // }, [searchQuery]);

  // const HandleSearch = (e) => {
  //   setIsLoading(true);
  //   const query = e.target.value.trim();
  //   if (query) {
  //     debouncedHandleSearch(`&q=${query}`);
  //   } else {
  //     setSearchQuery("");
  //   }
  // };

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
      startDate:"",
      endDate:"",
      weekending:"",
      builder_name:"",
      subdivision_name:"",
      weeklytraffic:"",
      cancelations:"",
      netsales:"",
      lotreleased:"",
      unsoldinventory:"",
      product_type:"",
      area:"",
      masterplan_id:"",
      zipcode:"",
      lotwidth:"",
      lotsize:"",
      zoning:"",
      age:"",
      single:"",
      grosssales:"",
    });
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
    gettrafficsaleList(currentPage, sortConfig);
  };


  const getbuilderlist = async () => {
    try {
      const response = await AdminSubdevisionService.index(searchQuery);
      const responseData = await response.json();
      setBuilderList(responseData.data);
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
          `${process.env.REACT_APP_IMAGE_URL}api/admin/trafficsale/export`
          // 'https://hbrapi.rigicgspl.com/api/admin/trafficsale/export'

          , {
            responseType: 'blob',
            headers: {
                'Authorization': `Bearer ${bearerToken}`
            }
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'traffics.xlsx');
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
  if(AllTrafficListExport.length === 0){
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

  const applyDateRangeFilter = (items, startDateQuery, endDateQuery, key) => {
      if (startDateQuery && endDateQuery) {
          const startDate = new Date(startDateQuery);
          const endDate = new Date(endDateQuery);

          return items.filter(item => {
              const itemDate = new Date(item[key]);
              return itemDate >= startDate && itemDate <= endDate;
          });
      }
      return items;
  };

  filtered = applyDateRangeFilter(filtered, filterQuery.startDate, filterQuery.endDate, 'weekending');

  setTrafficsaleList(filtered);
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
};

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
        if (responseData.message) {
          let message = responseData.message;
          if (responseData.failed_records > 0) {
              const problematicRows = responseData.failed_records_details.map(detail => detail.row).join(', ');
              message += ' Problematic Record Rows: ' + problematicRows+'.';
          }
          message += ' Record Imported: ' + responseData.successful_records;
          message += '. Failed Record Count: ' + responseData.failed_records;
          message += '. Last Row: ' + responseData.last_processed_row;

          swal(message).then((willDelete) => {
              if (willDelete) {
                  navigate("/trafficsalelist");
              }
          });
      } else {
          swal('Error: ' + responseData.error);
      }
        gettrafficsaleList();
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
                        <button class="btn btn-secondary cursor-none">
                          {" "}
                          <i class="fas fa-search"></i>{" "}
                        </button>
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
                    {/* <button onClick={exportToExcelData} className="btn btn-primary btn-sm me-1"> <i class="fas fa-file-excel"></i></button> */}
                    <button className="btn btn-primary btn-sm me-1" onClick={handleOpenDialog}>
                      Set Columns Order
                    </button>
                    <Button
                        className="btn-sm me-1"
                        variant="secondary"
                        onClick={handlBuilderClick}
                      >
                        Import
                      </Button>
                    <Button
                            className="btn-sm me-1"
                            variant="secondary"
                            onClick={HandleSortDetailClick}
                          >
                            <i class="fa-solid fa-sort"></i>
                     </Button>
                    <button onClick={() => setExportModelShow(true)} className="btn btn-primary btn-sm me-1"> 
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
                              <th style={{ textAlign: "center", cursor: "pointer" }} key={column.id} onClick={() => column.id != "action" ? requestSort(
                                column.id == "week Ending" ? "weekending" :
                                column.id == "weekly Traffic" ? "weeklytraffic" : 
                                column.id == "weekly Gross Sales" ? "grosssales" : 
                                column.id == "weekly Cancellations" ? "cancelations" : 
                                column.id == "weekly Net Sales" ? "netsales" : 
                                column.id == "age Restricted" ? "age" : 
                                column.id == "all Single Story" ? "stories" : 
                                column.id == "date Added" ? "created_at" : 
                                column.id == "lot Size" ? "lotsize" : 
                                column.id == "_fkSubID" ? "subdivisionCode" : 
                                column.id == ("total Lots" || "weekly Lots Release For Sale" || "weekly Unsold Standing Inventory") ? "lotreleased" : toCamelCase(column.id)) : ""}>
                                <strong>
                                  {column.label}
                                  {column.id != "action" && sortConfig.some(
                                    (item) => item.key === (
                                      column.id == "week Ending" ? "weekending" :
                                      column.id == "weekly Traffic" ? "weeklytraffic" : 
                                      column.id == "weekly Gross Sales" ? "grosssales" : 
                                      column.id == "weekly Cancellations" ? "cancelations" : 
                                      column.id == "weekly Net Sales" ? "netsales" : 
                                      column.id == "age Restricted" ? "age" : 
                                      column.id == "all Single Story" ? "stories" : 
                                      column.id == "date Added" ? "created_at" : 
                                      column.id == "lot Size" ? "lotsize" : 
                                      column.id == "_fkSubID" ? "subdivisionCode" : 
                                      column.id == ("total Lots" || "weekly Lots Release For Sale" || "weekly Unsold Standing Inventory") ? "lotreleased" :toCamelCase(column.id))
                                    ) ? (
                                    <span>
                                      {column.id != "action" && sortConfig.find(
                                        (item) => item.key === (column.id == "week Ending" ? "weekending" :
                                        column.id == "weekly Traffic" ? "weeklytraffic" : 
                                        column.id == "weekly Gross Sales" ? "grosssales" : 
                                        column.id == "weekly Cancellations" ? "cancelations" : 
                                        column.id == "weekly Net Sales" ? "netsales" : 
                                        column.id == "age Restricted" ? "age" : 
                                        column.id == "all Single Story" ? "stories" : 
                                        column.id == "date Added" ? "created_at" : 
                                        column.id == "lot Size" ? "lotsize" : 
                                        column.id == "_fkSubID" ? "subdivisionCode" : 
                                        column.id == ("total Lots" || "weekly Lots Release For Sale" || "weekly Unsold Standing Inventory") ? "lotreleased" :toCamelCase(column.id))
                                        ).direction === "asc" ? "↑" : "↓"}
                                    </span>
                                    ) : (
                                    column.id != "action" && <span>↑↓</span>
                                  )}
                                </strong>
                              </th>
                            ))}
                            {/* {checkFieldExist("Week Ending") && (
                              <th onClick={() => requestSort("weekending")}>
                                Week Ending
                                {sortConfig.key !== "weekending" ? "↑↓" : ""}
                                {sortConfig.key === "weekending" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )} */}

                            {/* {checkFieldExist(" Builder Name") && (
                              <th onClick={() => requestSort("builderName")}>
                                Builder Name
                                {sortConfig.key !== "builderName" ? "↑↓" : ""}
                                {sortConfig.key === "builderName" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist(" Subdivision Name") && (
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

                            {/* {checkFieldExist(" Weekly Traffic") && (
                              <th onClick={() => requestSort("weeklytraffic")}>
                                Weekly Traffic
                                {sortConfig.key !== "weeklytraffic" ? "↑↓" : ""}
                                {sortConfig.key === "weeklytraffic" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist(" Weekly Gross Sales") && (
                              <th onClick={() => requestSort("grosssales")}>
                                Weekly Gross Sales
                                {sortConfig.key !== "grosssales" ? "↑↓" : ""}
                                {sortConfig.key === "grosssales" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("Weekly Cancellations") && (
                              <th onClick={() => requestSort("cancelations")}>
                                Weekly Cancellations
                                {sortConfig.key !== "cancelations" ? "↑↓" : ""}
                                {sortConfig.key === "cancelations" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("Weekly Net Sales") && (
                              <th onClick={() => requestSort("netsales")}>
                                Weekly Net Sales
                                {sortConfig.key !== "netsales" ? "↑↓" : ""}
                                {sortConfig.key === "netsales" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("Total Lots") && (
                              <th onClick={() => requestSort("lotreleased")}>
                                Total Lots
                                {sortConfig.key !== "lotreleased" ? "↑↓" : ""}
                                {sortConfig.key === "lotreleased" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("Weekly Lots Release For Sale") && (
                              <th onClick={() => requestSort("lotreleased")}>
                                Weekly Lots Release For Sale
                                {sortConfig.key !== "lotreleased" ? "↑↓" : ""}
                                {sortConfig.key === "lotreleased" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("Weekly Unsold Standing Inventory") && (
                              <th onClick={() => requestSort("lotreleased")}>
                                Weekly Unsold Standing Inventory
                                {sortConfig.key !== "lotreleased" ? "↑↓" : ""}
                                {sortConfig.key === "lotreleased" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("Product Type") && (
                              <th onClick={() => requestSort("productType")}>
                                Product Type{" "}
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
                                Area
                                {sortConfig.key !== "lotWidth" ? "↑↓" : ""}
                                {sortConfig.key === "lotWidth" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("Master Plan") && (
                              <th onClick={() => requestSort("masterPlan")}>
                                Master Plan{" "}
                                {sortConfig.key !== "lotWidth" ? "↑↓" : ""}
                                {sortConfig.key === "lotWidth" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("Zip Code") && (
                              <th onClick={() => requestSort("zipCode")}>
                                Zip Code{" "}
                                {sortConfig.key !== "lotWidth" ? "↑↓" : ""}
                                {sortConfig.key === "lotWidth" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
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
                              <th onClick={() => requestSort("age")}>
                                <strong>Age Restricted</strong>
                                {sortConfig.key !== "age" ? "↑↓" : ""}
                                {sortConfig.key === "age" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
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

                            {/* {checkFieldExist("Date Added") && (
                              <th onClick={() => requestSort("created_at")}>
                                <strong>Date Added</strong>
                                {sortConfig.key !== "created_at" ? "↑↓" : ""}
                                {sortConfig.key === "created_at" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("__pkRecordID") && (
                              <th>
                                __pkRecordID{" "}
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("_fkSubID") && (
                              <th
                                onClick={() => requestSort("subdivisionCode")}
                              >
                                _fkSubID
                                {sortConfig.key !== "created_at" ? "↑↓" : ""}
                                {sortConfig.key === "created_at" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "} */}

                            {/* {checkFieldExist("Action") && <th>Action</th>} */}

                          </tr>
                        </thead>
                        <tbody style={{ textAlign: "center" }}>
                          {trafficsaleList !== null && trafficsaleList.length > 0 ? (
                            trafficsaleList.map((element, index) => (
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
                                      "No"}</td>
                                  }
                                  {column.id == "all Single Story" &&
                                    <td key={column.id} style={{ textAlign: "center" }}>{element.subdivision &&
                                      element.subdivision.single === 1 &&
                                      "Yes"}
                                    {element.subdivision &&
                                      element.subdivision.single === 0 &&
                                      "No"}</td>
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
            onClick={() => setShowOffcanvas(false)}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
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
                                <label className="form-label">From:{" "}</label>
                                <input
                                    name="startDate"
                                    type="date"
                                    className="form-control"
                                    value={filterQuery.startDate}
                                    onChange={HandleFilter}
                                />
                              </div>
                              <div className="col-md-3 mt-3">
                                <label className="form-label">To:{" "}</label>
                                <input
                                    name="endDate"
                                    type="date"
                                    className="form-control"
                                    value={filterQuery.endDate}
                                    onChange={HandleFilter}
                                />
                              </div>
                              {/* <div className="col-md-3 mt-3">
                                  <label className="form-label">
                                  WEEK ENDING:{" "}
                                    <span className="text-danger"></span>
                                  </label>
                                  <input name="weekending" type="date" className="form-control" value={filterQuery.weekending} onChange={HandleFilter}/>

                              </div> */}
                              <div className="col-md-3 mt-3">
                              <label className="form-label">
                                BUILDER NAME:{" "}
                                    <span className="text-danger"></span>
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
                                    <span className="text-danger"></span>
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
                        </Form.Group>                                     */}
                        </div>
                              <div className="col-md-3 mt-3">
                                <label className="form-label">
                                WEEKLY TRAFFIC :{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input  value={filterQuery.weeklytraffic} name="weeklytraffic" className="form-control"  onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3">
                                <label className="form-label">
                                WEEKLY CANCELLATIONS:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input name="cancelations" value={filterQuery.cancelations} className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3">
                                <label className="form-label">
                                WEEKLY NET SALES:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input name="netsales" value={filterQuery.netsales} className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3">
                                <label className="form-label">
                                TOTAL LOTS:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input value={filterQuery.lotreleased} name="lotreleased" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3">
                                <label className="form-label">
                                WEEKLY LOTS RELEASE FOR SALE:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input value={filterQuery.lotreleased} name="lotreleased" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3">
                                <label className="form-label">
                                WEEKLY UNSOLD STANDING INVENTORY:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input type="unsoldinventory" value={filterQuery.unsoldinventory} name="avg_net_sales_per_month_this_year" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3">
                                <label className="form-label">
                                PRODUCT TYPE:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input type="product_type" value={filterQuery.product_type} name="avg_closings_per_month_this_year" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3">
                                <label className="form-label">
                                AREA:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input  value={filterQuery.area} name="area" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3">
                                <label className="form-label">
                                MASTER PLAN:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input value={filterQuery.masterplan_id} name="masterplan_id" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3 ">
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
                              {/* <select className="default-select form-control" name="age"  onChange={HandleFilter} >
                                    <option value="">Select age Restricted</option>
                                        <option value="1">Yes</option>
                                        <option value="0">No</option>
                              </select>                                  */}
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
                                </select>      */}
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
                                  <label className="form-label">WEEKLY GROSS SALES:{" "}</label>
                                  <input value={filterQuery.grosssales} name="grosssales" className="form-control" onChange={handleInputChange} />
                                </div>
                              </div>
                            </div></>}
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
    </>
  );
};

export default TrafficsaleList;
