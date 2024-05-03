import React, { useState, useRef, useEffect,useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import AdminSubdevisionService from "../../../API/Services/AdminService/AdminSubdevisionService";
import SubdivisionOffcanvas from "./SubdivisionOffcanvas";
import MainPagetitle from "../../layouts/MainPagetitle";
import { Offcanvas, Form } from "react-bootstrap";
import AdminBuilderService from "../../../API/Services/AdminService/AdminBuilderService";
import { debounce } from "lodash";
import { DownloadTableExcel, downloadExcel } from 'react-export-table-to-excel';
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import ClipLoader from "react-spinners/ClipLoader";
import DateComponent from "../../components/date/DateFormat";
import AccessField from "../../components/AccssFieldComponent/AccessFiled";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import PriceComponent from "../../components/Price/PriceComponent";
import { Row, Col, Card } from 'react-bootstrap';

const SubdivisionList = () => {
  const [Error, setError] = useState("");
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [BuilderList, setBuilderList] = useState([]);
  const [BuilderListCount, setBuilderListCount] = useState('');
  const [TotalBuilderListCount, setTotalBuilderListCount] = useState('');

  const [exportmodelshow, setExportModelShow] = useState(false)
  const [selectedColumns, setSelectedColumns] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPage = 10;
  const lastIndex = currentPage * recordsPage;
  const firstIndex = lastIndex - recordsPage;
  const [npage, setNpage] = useState(0);
  const number = [...Array(npage + 1).keys()].slice(1);

  const [filterQuery, setFilterQuery] = useState({
    status: "",
    product_type: "",
    reporting: "",
    builder_id:""
  });

  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const [manageAccessOffcanvas, setManageAccessOffcanvas] = useState(false);
  const [accessList, setAccessList] = useState({});
  const [accessRole, setAccessRole] = useState("Admin");
  const [accessForm, setAccessForm] = useState({});
  const [role, setRole] = useState("Admin");
  const [checkedItems, setCheckedItems] = useState({}); // State to manage checked items
  const fieldList = AccessField({ tableName: "subdivisions" });
  const headers = [
    { label: 'Status', key: 'firstname' },
    { label: 'Reporting', key: 'lastname' },
    { label: 'Builder', key: 'nickname' },
    { label: 'Name', key: 'zipcode' },
    { label: 'Product Type', key: 'city' },
    { label: 'Area', key: 'with' },
    { label: 'Masterplan', key: 'without' },
    { label: 'Zipcode', key: 'reentries' },
    { label: 'Total Lots', key: 'rakes' },
    { label: 'Lot Width', key: 'firstname' },
    { label: 'Lot Size', key: 'lastname' },
    { label: 'Zoning', key: 'nickname' },
    { label: 'Age Restricted', key: 'zipcode' },
    { label: 'All Single Story', key: 'city' },
    { label: 'Gated', key: 'with' },
    { label: 'Location', key: 'without' },
    { label: 'Juridiction', key: 'reentries' },
    { label: 'Latitude', key: 'rakes' },
    { label: 'Longitude', key: 'zipcode' },
    { label: 'Gas Provider', key: 'city' },
    { label: 'HOA Fee', key: 'with' },
    { label: 'Masterplan Fee', key: 'without' },
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
    { label: 'Min Sqft Active', key: 'min_sqft_active_current' },
    { label: 'Max Base Price All', key: 'max_base_price_all' },
    { label: 'Max Sqft Active Current', key: 'max_sqft_active_current' },
    { label: 'Avg Net Traffic Per Month This Year', key: 'avg_net_traffic_per_month_this_year' },
    { label: 'Avg Net Sales Per Month This Year', key: 'avg_net_sales_per_month_this_year' },
    { label: 'Avg Closings Per Month This Year', key: 'avg_closings_per_month_this_year' },
    { label: 'Avg Net Sales Per Month Since Open', key: 'avg_net_sales_per_month_since_open' },
    { label: 'Avg Net Sales Per Month Last 3 Months', key: 'avg_net_sales_per_month_last_three_months' },
    { label: 'Max Week Ending', key: 'max_week_ending' },
    { label: 'Min Week Ending', key: 'min_week_ending' },
    { label: 'Sqft Group', key: 'sqft_group' },
    { label: 'Price Group', key: 'price_group' },
    { label: 'Month Net Sold', key: 'month_net_sold' },
    { label: 'Year Net Sold', key: 'year_net_sold' }
  ];
  const columns = [
    { label: 'Status', key: 'firstname' },
    { label: 'Reporting', key: 'lastname' },
    { label: 'Builder', key: 'nickname' },
    { label: 'Name', key: 'zipcode' },
    { label: 'Product Type', key: 'city' },
    { label: 'Area', key: 'with' },
    { label: 'Masterplan', key: 'without' },
    { label: 'Zipcode', key: 'reentries' },
    { label: 'Total Lots', key: 'rakes' },
    { label: 'Lot Width', key: 'firstname' },
    { label: 'Lot Size', key: 'lastname' },
    { label: 'Zoning', key: 'nickname' },
    { label: 'Age Restricted', key: 'zipcode' },
    { label: 'All Single Story', key: 'city' },
    { label: 'Gated', key: 'with' },
    { label: 'Location', key: 'without' },
    { label: 'Juridiction', key: 'reentries' },
    { label: 'Latitude', key: 'rakes' },
    { label: 'Longitude', key: 'zipcode' },
    { label: 'Gas Provider', key: 'city' },
    { label: 'HOA Fee', key: 'with' },
    { label: 'Masterplan Fee', key: 'without' },
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
    { label: 'Min Sqft Active', key: 'min_sqft_active_current' },
    { label: 'Max Base Price All', key: 'max_base_price_all' },
    { label: 'Max Sqft Active Current', key: 'max_sqft_active_current' },
    { label: 'Avg Net Traffic Per Month This Year', key: 'avg_net_traffic_per_month_this_year' },
    { label: 'Avg Net Sales Per Month This Year', key: 'avg_net_sales_per_month_this_year' },
    { label: 'Avg Closings Per Month This Year', key: 'avg_closings_per_month_this_year' },
    { label: 'Avg Net Sales Per Month Since Open', key: 'avg_net_sales_per_month_since_open' },
    { label: 'Avg Net Sales Per Month Last 3 Months', key: 'avg_net_sales_per_month_last_three_months' },
    { label: 'Max Week Ending', key: 'max_week_ending' },
    { label: 'Min Week Ending', key: 'min_week_ending' },
    { label: 'Sqft Group', key: 'sqft_group' },
    { label: 'Price Group', key: 'price_group' },
    { label: 'Month Net Sold', key: 'month_net_sold' },
    { label: 'Year Net Sold', key: 'year_net_sold' }
  ];
 
  const handleColumnToggle = (column) => {
    const updatedColumns = selectedColumns.includes(column)
      ? selectedColumns.filter((col) => col !== column)
      : [...selectedColumns, column];
      console.log(updatedColumns);
    setSelectedColumns(updatedColumns);
  //   newdata.map((nw, i) =>
  //   [nw === "Name" ? row.firstname : '', nw === "Surname" ? row.lastname : '', nw === "Nickname" ? row.nickname : '', nw === "ZipCode" ? row.zipcode : '', nw === "City" ? row.city : '', nw === "Registrations with check-in" ? row.with : '', nw === "Registrations without check-in" ? row.without : '', nw === "Cumulated Buy-in bounty Re-entries" ? row.reentries : '', nw === "Cumulated rakes" ? row.rakes : '']
  // )
   

  };
  useEffect(() => {
    console.log(fieldList); // You can now use fieldList in this component
  }, [fieldList]);

  const checkFieldExist = (fieldName) => {
    return fieldList.includes(fieldName.trim());
  }; 
  const handleDownloadExcel = () => {
    setExportModelShow(false)
    setSelectedColumns('')
    var tableHeaders;
    if (selectedColumns.length > 0) {
      tableHeaders = selectedColumns;
    } else {
      tableHeaders = headers.map((c) => c.label);
    }
    var newdata = tableHeaders.map((element) => { return element })
 
    const tableData = BuilderList.map((row) => 
    newdata.map((nw, i) =>
    [
      nw === "Status" ? (row.status===1 && "Active" || row.status===0 && "Sold Out" || row.status===2 && "Future") : '', 
      nw === "Reporting" ?(row.reporting===1 && "Yes" || row.status===0 && "No") : '', 
      nw === "Builder" ? row.builder.name : '', 
      nw === "Name" ? row.name : '', 
      nw === "Product Type" ? row.product_type : '', 
      nw === "Area" ? row.area : '', 
      nw === "Masterplan" ? row.masterplan_id : '', 
      nw === "Zipcode" ? row.zipcode : '', 
      nw === "Total Lots" ? row.totallots : '', 
      nw === "Lot Width" ? row.lotwidth : '', 
      nw === "Lot Size" ? row.lotsize : '', 
      nw === "Zoning" ? row.zoning : '', 
      nw === "Age Restricted" ? (row.age===1 && "Yes" || row.age===0 && "No") : '', 
      nw === "All Single Story" ? (row.single===1 && "Yes" || row.single===0 && "No") : '', 
      nw === "Gated" ? (row.gated===1 && "Yes" || row.gated===0 && "No"):'', 
      nw === "Location" ? row.location : '', 
      nw === "Juridiction" ? row.juridiction : '', 
      nw === "Latitude" ? row.lat : '', 
      nw === "Longitude" ? row.lng : '', 
      nw === "Gas Provider" ? row.gasprovider : '', 
      nw === "HOA Fee" ? row.hoafee : '', 
      nw === "Masterplan Fee" ? row.masterplanfee : '', 
      nw === "Parcel Group" ? row.parcel : '', 
      nw === "Phone" ? row.phone : '', 
      nw === "Website" ?  row.builder.website : '', 
      nw === "FK Builder Id" ?  row.builder.builder_code : '',
      nw === 'Total Closings' ? row.total_closings: ' ',
      nw === 'Total Permits' ? row.total_permits: ' ',
      nw === 'Total Net Sales' ? row.total_net_sales: ' ',
      nw === 'Months Open' ? row.months_open: ' ',
      nw === 'Latest Traffic/Sales Data' ? row.latest_traffic_data: ' ',
      nw === 'Latest Lots Released' ? row.latest_lots_released: ' ',
      nw === 'Latest Standing Inventory' ? row.latest_standing_inventory: ' ',
      nw === 'Unsold Lots' ? row.unsold_lots: ' ',
      nw === 'Avg Sqft All' ? row.avg_sqft_all: ' ',
      nw === 'Avg Sqft Active' ? row.avg_sqft_active: ' ',
      nw === 'Avg Base Price All' ? row.avg_base_price_all: ' ',
      nw === 'Avg Base Price Active' ? row.avg_base_price_active: ' ',
      nw === 'Min Sqft All' ? row.min_sqft_all: ' ',
      nw === 'Min Sqft Active' ? row.min_sqft_active: ' ',
      nw === 'Max Sqft All' ? row.max_sqft_all: ' ',
      nw === 'Max Sqft Active' ? row.max_sqft_active: ' ',
      nw === 'Min Base Price All' ? row.min_base_price_all: ' ',
      nw === 'Min Sqft Active' ? row.min_sqft_active_current: ' ',
      nw === 'Max Base Price All' ? row.max_base_price_all: ' ',
      nw === 'Max Sqft Active Current' ? row.max_sqft_active_current: ' ',
      nw === 'Avg Net Traffic Per Month This Year' ? row.avg_net_traffic_per_month_this_year: ' ',
      nw === 'Avg Net Sales Per Month This Year' ? row.avg_net_sales_per_month_this_year: ' ',
      nw === 'Avg Closings Per Month This Year' ? row.avg_closings_per_month_this_year: ' ',
      nw === 'Avg Net Sales Per Month Since Open' ? row.avg_net_sales_per_month_since_open: ' ',
      nw === 'Avg Net Sales Per Month Last 3 Months' ? row.avg_net_sales_per_month_last_three_months: ' ',
      nw === 'Max Week Ending' ? row.max_week_ending: ' ',
      nw === 'Min Week Ending' ? row.min_week_ending: ' ',
      nw === 'Sqft Group' ? row.sqft_group: ' ',
      nw === 'Price Group' ? row.price_group: ' ',
      nw === 'Month Net Sold' ? row.month_net_sold: ' ',
      nw === 'Year Net Sold' ? row.year_net_sold:''
  
    ]
    ),
  )
    downloadExcel({
      fileName: "Sub Division List",
      sheet: "Sub Division List",
      tablePayload: {
        header: tableHeaders,
        body: tableData
      },
    });
  }
  
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
  const [builderListDropDown, setBuilderListDropDown] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  
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
  const subdivision = useRef();
  const [show, setShow] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const [selectedFileError, setSelectedFileError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleClose = () => setShow(false);


  const getbuilderlist = async (pageNumber) => {
    try {
      const response = await AdminSubdevisionService.index(
        pageNumber,
        searchQuery,
      );
      const responseData = await response.json();
      setLoading(false);
      setIsLoading(false);
      setNpage(Math.ceil(responseData.total / recordsPage));
      setBuilderList(responseData.data);
      setBuilderListCount(responseData.total)
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
      getbuilderlist(currentPage);
    } else {
      navigate("/");
    }
  }, [currentPage]);

  const handleDelete = async (e) => {
    try {
      let responseData = await AdminSubdevisionService.destroy(e).json();
      if (responseData.status === true) {
        getbuilderlist();
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
    getbuilderlist();
  };

  const handleRowClick = async (id) => {
    try {
      let responseData = await AdminSubdevisionService.show(id).json();
      setSubdivisionDetails(responseData);
      console.log(responseData);
      console.log(SubdivisionDetails.status);
      console.log(BuilderList);
      setShowOffcanvas(true);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(errorJson.message);
      }
    }
  };
  const getbuilderDoplist = async () => {
    try {
      const response = await AdminBuilderService.index();
      const responseData = await response.json();
      setBuilderListDropDown(responseData.data);
    } catch (error) {
      console.log(error);
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(errorJson.message);
      }
    }
  };
  useEffect(() => {
    getbuilderDoplist();
  }, []);

  const debouncedHandleSearch = useRef(
    debounce((value) => {
      setSearchQuery(value);
    }, 1000)
  ).current;

  useEffect(() => {
    getbuilderlist();
  }, [searchQuery]);

  const HandleSearch = (e) => {
    setIsLoading(true);
    const query = e.target.value.trim();
    debouncedHandleSearch(`&q=${query}`);
  };

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
      status: "",
      product_type: "",
      reporting: "",
      builder_id:"",
    });
  };

  const [value, setValue] = React.useState("1");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleProductRedirect = () => {
    navigate("/productlist");
  };
  const handlePermitRedirect = () => {
    navigate("/permitlist");
  };
  const handleClosingRedirect = () => {
    navigate("/closingsalelist");
  };
  const handleTraficRedirect = () => {
    navigate("/trafficsalelist");
  };
  const handleLandRedirect = () => {
    navigate("/landsalelist");
  };
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key) {
      direction = sortConfig.direction === "asc" ? "desc" : "asc";
    }
    setSortConfig({ key, direction });
  };


  const exportToExcelData = async () => {
    try {
        const bearerToken = JSON.parse(localStorage.getItem('usertoken'));
        const response = await axios.get(
          `${process.env.REACT_APP_IMAGE_URL}api/admin/subdivision/export`
          // 'https://hbrapi.rigicgspl.com/api/admin/subdivision/export'

          , {
            responseType: 'blob',
            headers: {
                'Authorization': `Bearer ${bearerToken}`
            }
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'subdivision.xlsx');
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
    console.log('logs',event.target);
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
        console.log(iFile);
        const inputData = {
          csv: iFile,
        };
        try {
          let responseData = await AdminSubdevisionService.import(inputData).json();
          setSelectedFile("");
          document.getElementById("fileInput").value = null;
          setLoading(false);
          swal("Imported Sucessfully").then((willDelete) => {
            if (willDelete) {
              navigate("/subdivisionlist");
              setShow(false);
            }
          });
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
  

  return (
    <>
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
                  <div className="tbl-caption d-flex justify-content-between text-wrap align-items-center">
                    <div className="d-flex text-nowrap justify-content-between align-items-center">
                      <h4 className="heading mb-0">Subdivision List</h4>
                      <div
                        class="btn-group mx-5"
                        role="group"
                        aria-label="Basic example"
                      >
                        <button class="btn btn-secondary cursor-none">
                          {" "}
                          <i class="fas fa-search"></i>
                        </button>
                        <Form.Control
                          type="text"
                          style={{
                            borderTopLeftRadius: "0",
                            borderBottomLeftRadius: "0",
                          }}
                          onChange={HandleSearch}
                          placeholder="Quick Search"
                        />
                      </div>
                    </div>
                    <div className="d-flex">
                    <button onClick={() => setExportModelShow(true)} className="btn btn-primary btn-sm me-1"> <i class="fas fa-file-excel"></i></button>
                    {/* <button onClick={exportToExcelData} className="btn btn-primary btn-sm me-1"> <i class="fas fa-file-excel"></i></button> */}
                      <button
                        className="btn btn-primary btn-sm me-1"
                        onClick={() => setManageAccessOffcanvas(true)}
                      >
                        {" "}
                        Field Access
                      </button>
                      <Button
                        className="btn-sm me-1"
                        variant="secondary"
                        onClick={handlBuilderClick}
                      >
                        Import
                      </Button>
                      <Dropdown>
                        <Dropdown.Toggle
                          variant="success"
                          className="btn-sm"
                          id="dropdown-basic"
                        >
                          <i className="fa fa-filter"></i>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <h5 className="">Filter Options</h5>
                          <div className="border-top">
                            <div className="mt-3">
                              <label className="form-label">
                                Builder: <span className="text-danger"></span>
                              </label>
                              <select
                                className="default-select form-control"
                                value={filterQuery.builder_id}
                                name="builder_id"
                                onChange={HandleFilter}
                              >
                                {/* <option data-display="Select">Please select</option> */}
                                <option value="">All</option>
                                {builderListDropDown.map((element) => (
                                  <option value={element.id}>
                                    {element.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="mt-3 mb-1">
                              <label className="form-label">
                                Status: <span className="text-danger"></span>
                              </label>
                              <select
                                className="default-select form-control"
                                value={filterQuery.status}
                                name="status"
                                onChange={HandleFilter}
                              >
                                {/* <option data-display="Select">Please select</option> */}
                                <option value="">All</option>
                                <option value="1">Active</option>
                                <option value="0">Sold Out</option>
                                <option value="2">Future</option>
                              </select>
                            </div>
                          </div>
                          <div className="mb-3">
                            <label className="form-label">
                              Product Type:{" "}
                              <span className="text-danger"></span>
                            </label>
                            <select
                              className="default-select form-control"
                              name="product_type"
                              value={filterQuery.product_type}
                              onChange={HandleFilter}
                            >
                              <option value="">All</option>
                              <option value="DET">DET</option>
                              <option value="ATT">ATT</option>
                              <option value="HR">HR</option>
                              <option value="AC">AC</option>
                            </select>
                          </div>
                          <div className="mb-3">
                            <label className="form-label">
                              Reporting: <span className="text-danger"></span>
                            </label>
                            <select
                              className="default-select form-control"
                              name="reporting"
                              value={filterQuery.reporting}
                              onChange={HandleFilter}
                            >
                              <option value="">All</option>
                              <option value="1">Yes</option>
                              <option value="0">No</option>
                            </select>
                          </div>
                          <div className="d-flex justify-content-end">
                            <Button
                              className="btn-sm"
                              onClick={HandleCancelFilter}
                              variant="secondary"
                            >
                              Reset
                            </Button>
                          </div>
                        </Dropdown.Menu>
                      </Dropdown>

                      <Link
                        to={"#"}
                        className="btn btn-primary btn-sm ms-1"
                        data-bs-toggle="offcanvas"
                        onClick={() => subdivision.current.showEmployeModal()}
                      >
                        + Add Subdivision
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
                              <strong> No.</strong>
                            </th>
                            {checkFieldExist("Status") && (
                              <th onClick={() => requestSort("status")}>
                                <strong> Status</strong>
                                {sortConfig.key !== "status" ? "↑↓" : ""}

                                {sortConfig.key === "status" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("Reporting") && (
                              <th onClick={() => requestSort("reporting")}>
                                <strong> Reporting</strong>
                                {sortConfig.key !== "reporting" ? "↑↓" : ""}
                                {sortConfig.key === "reporting" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("Builder") && (
                              <th onClick={() => requestSort("builderName")}>
                                <strong> Builder</strong>
                                {sortConfig.key !== "builderName" ? "↑↓" : ""}
                                {sortConfig.key === "builderName" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("Builder") && (
                              <th onClick={() => requestSort("Name")}>
                                <strong> Name</strong>
                                {sortConfig.key !== "name" ? "↑↓" : ""}
                                {sortConfig.key === "name" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("Product Type") && (
                              <th onClick={() => requestSort("product_type")}>
                                <strong> Product Type</strong>
                                {sortConfig.key !== "product_type" ? "↑↓" : ""}
                                {sortConfig.key === "product_type" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("Area") && (
                              <th onClick={() => requestSort("area")}>
                                <strong> Area</strong>
                                {sortConfig.key !== "area" ? "↑↓" : ""}
                                {sortConfig.key === "area" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("Product Type") && (
                              <th onClick={() => requestSort("masterplan_id")}>
                                <strong> Masterplan</strong>
                                {sortConfig.key !== "masterplan_id" ? "↑↓" : ""}
                                {sortConfig.key === "masterplan_id" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("Zipcode") && (
                              <th onClick={() => requestSort("zipcode")}>
                                <strong> Zipcode</strong>
                                {sortConfig.key !== "zipcode" ? "↑↓" : ""}
                                {sortConfig.key === "zipcode" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("Total Lots") && (
                              <th onClick={() => requestSort("totallots")}>
                                <strong> Total Lots</strong>
                                {sortConfig.key !== "totallots" ? "↑↓" : ""}
                                {sortConfig.key === "totallots" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("Lot Width") && (
                              <th onClick={() => requestSort("lotwidth")}>
                                <strong>Lot Width</strong>
                                {sortConfig.key !== "lotwidth" ? "↑↓" : ""}
                                {sortConfig.key === "lotwidth" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("Lot Size") && (
                              <th onClick={() => requestSort("lotsize")}>
                                <strong> Lot Size</strong>
                                {sortConfig.key !== "lotsize" ? "↑↓" : ""}
                                {sortConfig.key === "lotsize" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("Zoning") && (
                              <th onClick={() => requestSort("zoning")}>
                                <strong> Zoning</strong>
                                {sortConfig.key !== "zoning" ? "↑↓" : ""}
                                {sortConfig.key === "zoning" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("Age Restricted") && (
                              <th onClick={() => requestSort("age")}>
                                <strong> Age Restricted</strong>
                                {sortConfig.key !== "age" ? "↑↓" : ""}
                                {sortConfig.key === "age" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("All Single Story") && (
                              <th onClick={() => requestSort("single")}>
                                <strong> All Single Story</strong>
                                {sortConfig.key !== "single" ? "↑↓" : ""}
                                {sortConfig.key === "single" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("Gated") && (
                              <th onClick={() => requestSort("gated")}>
                                <strong> Gated</strong>
                                {sortConfig.key !== "gated" ? "↑↓" : ""}
                                {sortConfig.key === "gated" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("Location") && (
                              <th>
                                <strong> Location</strong>
                              </th>
                            )}
                            {checkFieldExist("Juridiction") && (
                              <th onClick={() => requestSort("juridiction")}>
                                <strong> Juridiction</strong>
                                {sortConfig.key !== "juridiction" ? "↑↓" : ""}
                                {sortConfig.key === "juridiction" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("Latitude") && (
                              <th onClick={() => requestSort("lat")}>
                                <strong>Latitude</strong>
                                {sortConfig.key !== "lat" ? "↑↓" : ""}
                                {sortConfig.key === "lat" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("Longitude") && (
                              <th onClick={() => requestSort("lng")}>
                                <strong> Longitude</strong>
                                {sortConfig.key !== "lng" ? "↑↓" : ""}
                                {sortConfig.key === "lng" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("Gas Provider") && (
                              <th onClick={() => requestSort("gasprovider")}>
                                <strong> Gas Provider</strong>
                                {sortConfig.key !== "gasprovider" ? "↑↓" : ""}
                                {sortConfig.key === "gasprovider" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("HOA Fee") && (
                              <th onClick={() => requestSort("hoafee")}>
                                <strong> HOA Fee</strong>
                                {sortConfig.key !== "hoafee" ? "↑↓" : ""}
                                {sortConfig.key === "hoafee" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("Masterplan Fee") && (
                              <th onClick={() => requestSort("masterplanfee")}>
                                <strong> Masterplan Fee</strong>
                                {sortConfig.key !== "masterplanfee" ? "↑↓" : ""}
                                {sortConfig.key === "masterplanfee" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("Parcel Group") && (
                              <th onClick={() => requestSort("parcel")}>
                                <strong> Parcel Group</strong>
                                {sortConfig.key !== "parcel" ? "↑↓" : ""}
                                {sortConfig.key === "parcel" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("Phone") && (
                              <th onClick={() => requestSort("phone")}>
                                <strong> Phone</strong>
                                {sortConfig.key !== "phone" ? "↑↓" : ""}
                                {sortConfig.key === "phone" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("Website") && (
                              <th>
                                <strong> Website</strong>
                                {sortConfig.key !== "website" ? "↑↓" : ""}
                                {sortConfig.key === "website" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("Date Added") && (
                              <th onClick={() => requestSort("dateadded")}>
                                <strong> Date Added</strong>
                                {sortConfig.key !== "dateadded" ? "↑↓" : ""}
                                {sortConfig.key === "dateadded" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("__pkSubID") && (
                              <th
                                onClick={() => requestSort("subdivision_code")}
                              >
                                <strong> __pkSubID </strong>
                                {sortConfig.key !== "subdivision_code"
                                  ? "↑↓"
                                  : ""}
                                {sortConfig.key === "subdivision_code" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("_fkBuilderID") && (
                              <th onClick={() => requestSort("builderCode")}>
                                <strong> _fkBuilderID </strong>
                                {sortConfig.key !== "builderCode" ? "↑↓" : ""}
                                {sortConfig.key === "builderCode" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("Total Closings") && (
                            <th onClick={() => requestSort("total_closings")}>
                                <strong> Total Closings </strong>
                                {sortConfig.key !== "total_closings" ? "↑↓" : ""}
                                {sortConfig.key === "total_closings" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                              )}
                            {checkFieldExist("Total Permits") && (                     
                              <th onClick={() => requestSort("total_permits")}>
                                <strong> Total Permits </strong>
                                {sortConfig.key !== "total_permits" ? "↑↓" : ""}
                                {sortConfig.key === "total_permits" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                              {checkFieldExist("Total Net Sales") && (
                              <th onClick={() => requestSort("total_net_sales")}>
                                <strong> Total Net Sales </strong>
                                {sortConfig.key !== "total_net_sales" ? "↑↓" : ""}
                                {sortConfig.key === "total_net_sales" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                               )}
                              {checkFieldExist("Months Open") && (
                              <th onClick={() => requestSort("months_open")}>
                                <strong> Months Open </strong>
                                {sortConfig.key !== "months_open" ? "↑↓" : ""}
                                {sortConfig.key === "months_open" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                              {checkFieldExist("Latest Traffic/Sales Data") && (
                              <th onClick={() => requestSort("latest_traffic_data")}>
                                <strong> Latest Traffic/Sales Data </strong>
                                {sortConfig.key !== "latest_traffic_data" ? "↑↓" : ""}
                                {sortConfig.key === "latest_traffic_data" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                             )}
                              {checkFieldExist("Latest Lots Released") && (
                              <th onClick={() => requestSort("latest_lots_released")}>
                                <strong> Latest Lots Released </strong>
                                {sortConfig.key !== "latest_lots_released" ? "↑↓" : ""}
                                {sortConfig.key === "latest_lots_released" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                              )}
                              {checkFieldExist("Latest Standing Inventory") && (
                              <th onClick={() => requestSort("latest_standing_inventory")}>
                                <strong> Latest Standing Inventory </strong>
                                {sortConfig.key !== "latest_standing_inventory" ? "↑↓" : ""}
                                {sortConfig.key === "latest_standing_inventory" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                               )}
                              {checkFieldExist("Unsold Lots") && (
                              <th onClick={() => requestSort("unsold_lots")}>
                                <strong> Unsold Lots </strong>
                                {sortConfig.key !== "unsold_lots" ? "↑↓" : ""}
                                {sortConfig.key === "unsold_lots" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                              )}
                              {checkFieldExist("Avg Sqft All") && (
                              <th onClick={() => requestSort("avg_sqft_all")}>
                                <strong> Avg Sqft All </strong>
                                {sortConfig.key !== "avg_sqft_all" ? "↑↓" : ""}
                                {sortConfig.key === "avg_sqft_all" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                              )}
                              {checkFieldExist("Avg Sqft Active") && (
                              <th onClick={() => requestSort("avg_sqft_active")}>
                                <strong> Avg Sqft Active </strong>
                                {sortConfig.key !== "avg_sqft_active" ? "↑↓" : ""}
                                {sortConfig.key === "avg_sqft_active" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                              {checkFieldExist("Avg Base Price All") && (
                              <th onClick={() => requestSort("avg_base_price_all")}>
                                <strong> Avg Base Price All </strong>
                                {sortConfig.key !== "avg_base_price_all" ? "↑↓" : ""}
                                {sortConfig.key === "avg_base_price_all" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                               )}
                              {checkFieldExist("Avg Base Price Active") && (
                              <th onClick={() => requestSort("avg_base_price_active")}>
                                <strong> Avg Base Price Active </strong>
                                {sortConfig.key !== "avg_base_price_active" ? "↑↓" : ""}
                                {sortConfig.key === "avg_base_price_active" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                              )}
                              {checkFieldExist("Min Sqft All") && (
                              <th onClick={() => requestSort("min_sqft_all")}>
                                <strong> Min Sqft All </strong>
                                {sortConfig.key !== "min_sqft_all" ? "↑↓" : ""}
                                {sortConfig.key === "min_sqft_all" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                               )}
                              {checkFieldExist("Min Sqft Active") && (
                              <th onClick={() => requestSort("min_sqft_active")}>
                                <strong> Min Sqft Active </strong>
                                {sortConfig.key !== "min_sqft_active" ? "↑↓" : ""}
                                {sortConfig.key === "min_sqft_active" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                              )}
                              {checkFieldExist("Max Sqft All") && (
                              <th onClick={() => requestSort("max_sqft_all")}>
                                <strong> Max Sqft All </strong>
                                {sortConfig.key !== "max_sqft_all" ? "↑↓" : ""}
                                {sortConfig.key === "max_sqft_all" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                              )}
                              {checkFieldExist("Max Sqft Active") && (
                              <th onClick={() => requestSort("max_sqft_active")}>
                                <strong> Max Sqft Active </strong>
                                {sortConfig.key !== "max_sqft_active" ? "↑↓" : ""}
                                {sortConfig.key === "max_sqft_active" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                                   )}
                              {checkFieldExist("Min Base Price All") && (
                              <th onClick={() => requestSort("min_base_price_all")}>
                                <strong> Min Base Price All </strong>
                                {sortConfig.key !== "min_base_price_all" ? "↑↓" : ""}
                                {sortConfig.key === "min_base_price_all" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                              )}
                              {checkFieldExist("Min Sqft Active") && (
                              <th onClick={() => requestSort("min_sqft_active_current")}>
                                <strong> Min Sqft Active </strong>
                                {sortConfig.key !== "min_sqft_active_current" ? "↑↓" : ""}
                                {sortConfig.key === "min_sqft_active_current" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                              )}
                              {checkFieldExist("Max Base Price All") && (
                              <th onClick={() => requestSort("max_base_price_all")}>
                                <strong> Max Base Price All </strong>
                                {sortConfig.key !== "max_base_price_all" ? "↑↓" : ""}
                                {sortConfig.key === "max_base_price_all" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                              )}
                              {checkFieldExist("Max Sqft Active") && (
                              <th onClick={() => requestSort("max_sqft_active_current")}>
                                <strong> Max Sqft Active </strong>
                                {sortConfig.key !== "max_sqft_active_current" ? "↑↓" : ""}
                                {sortConfig.key === "max_sqft_active_current" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                               )}
                              {checkFieldExist("Avg Net Traffic Per Month This Year") && (
                              <th onClick={() => requestSort("avg_net_traffic_per_month_this_year")}>
                                <strong> Avg Net Traffic Per Month This Year </strong>
                                {sortConfig.key !== "avg_net_traffic_per_month_this_year" ? "↑↓" : ""}
                                {sortConfig.key === "avg_net_traffic_per_month_this_year" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                               )}
                              {checkFieldExist("Avg Net Sales Per Month This Year") && (
                              <th onClick={() => requestSort("avg_net_sales_per_month_this_year")}>
                                <strong> Avg Net Sales Per Month This Year </strong>
                                {sortConfig.key !== "avg_net_sales_per_month_this_year" ? "↑↓" : ""}
                                {sortConfig.key === "avg_net_sales_per_month_this_year" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                             )}
                              {checkFieldExist("Avg Closings Per Month This Year") && (
                              <th onClick={() => requestSort("avg_closings_per_month_this_year")}>
                                <strong> Avg Closings Per Month This Year </strong>
                                {sortConfig.key !== "avg_closings_per_month_this_year" ? "↑↓" : ""}
                                {sortConfig.key === "avg_closings_per_month_this_year" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                              )}
                              {checkFieldExist("Avg Net Sales Per Month Since Open") && (
                              <th onClick={() => requestSort("avg_net_sales_per_month_since_open")}>
                                <strong> Avg Net Sales Per Month Since Open </strong>
                                {sortConfig.key !== "avg_net_sales_per_month_since_open" ? "↑↓" : ""}
                                {sortConfig.key === "avg_net_sales_per_month_since_open" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                               )}
                              {checkFieldExist("Avg Net Sales Per Month Last 3 Months") && (
                              <th onClick={() => requestSort("avg_net_sales_per_month_last_three_months")}>
                                <strong> Avg Net Sales Per Month Last 3 Months </strong>
                                {sortConfig.key !== "avg_net_sales_per_month_last_three_months" ? "↑↓" : ""}
                                {sortConfig.key === "avg_net_sales_per_month_last_three_months" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                              )}
                              {checkFieldExist("Max Week Ending") && (
                              <th onClick={() => requestSort("max_week_ending")}>
                                <strong> Max Week Ending </strong>
                                {sortConfig.key !== "max_week_ending" ? "↑↓" : ""}
                                {sortConfig.key === "max_week_ending" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                               )}
                              {checkFieldExist("Min Week Ending") && (
                              <th onClick={() => requestSort("min_week_ending")}>
                                <strong> Min Week Ending </strong>
                                {sortConfig.key !== "min_week_ending" ? "↑↓" : ""}
                                {sortConfig.key === "min_week_ending" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                                )}
                              {checkFieldExist("Sqft Group") && (
                              <th onClick={() => requestSort("sqft_group")}>
                                <strong> Sqft Group </strong>
                                {sortConfig.key !== "sqft_group" ? "↑↓" : ""}
                                {sortConfig.key === "sqft_group" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                               )}
                              {checkFieldExist("Price Group") && (
                              <th onClick={() => requestSort("price_group")}>
                                <strong> Price Group </strong>
                                {sortConfig.key !== "price_group" ? "↑↓" : ""}
                                {sortConfig.key === "price_group" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                              )}
                              {checkFieldExist("Month Net Sold") && (
                              <th onClick={() => requestSort("month_net_sold")}>
                                <strong> Month Net Sold </strong>
                                {sortConfig.key !== "month_net_sold" ? "↑↓" : ""}
                                {sortConfig.key === "month_net_sold" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                              )}
                              {checkFieldExist("Year Net Sold") && (
                              <th onClick={() => requestSort("year_net_sold")}>
                                <strong> Year Net Sold </strong>
                                {sortConfig.key !== "year_net_sold" ? "↑↓" : ""}
                                {sortConfig.key === "year_net_sold" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                              
                            )}
                            {checkFieldExist("Action") && (
                              <th>
                                {" "}
                                <strong> Action </strong>
                              </th>
                            )}
                          </tr>
                        </thead>
                        <tbody style={{ textAlign: "center" }}>
                          {BuilderList !== null && BuilderList.length > 0 ? (
                            BuilderList.map((element, index) => (
                              <tr
                                onClick={() => handleRowClick(element.id)}
                                key={element.id}
                                style={{
                                  textAlign: "center",
                                  cursor: "pointer",
                                }}
                              >
                                <td>{index + 1}</td>
                                {checkFieldExist("Status") && (
                                  <td>
                                    {element.status === 1 && "Active"}
                                    {element.status === 0 && "Sold Out"}
                                    {element.status === 2 && "Future"}
                                  </td>
                                )}
                                {checkFieldExist("Reporting") && (
                                  <td>
                                    {element.reporting === 1 && "Yes"}
                                    {element.reporting === 0 && "No"}
                                  </td>
                                )}
                                {checkFieldExist("Builder") && (
                                  <td>{element.builder.name}</td>
                                )}
                                {checkFieldExist("Name") && (
                                  <td>{element.name}</td>
                                )}
                                {checkFieldExist("Product Type") && (
                                  <td>{element.product_type}</td>
                                )}
                                {checkFieldExist("Area") && (
                                  <td>{element.area}</td>
                                )}
                                {checkFieldExist("Masterplan") && (
                                  <td>{element.masterplan_id}</td>
                                )}
                                {checkFieldExist("Zipcode") && (
                                  <td>{element.zipcode}</td>
                                )}
                                {checkFieldExist("Total Lots") && (
                                  <td>{element.totallots}</td>
                                )}
                                {checkFieldExist("Lot Width") && (
                                  <td>{element.lotwidth}</td>
                                )}
                                {checkFieldExist("Lot Size") && (
                                  <td>{element.lotsize}</td>
                                )}
                                {checkFieldExist("Zoning") && (
                                  <td>{element.zoning}</td>
                                )}
                                {checkFieldExist("Age Restricted") && (
                                  <td>
                                    {element.age === 1 && "Yes"}
                                    {element.age === 0 && "No"}
                                  </td>
                                )}
                                {checkFieldExist("All Single Story") && (
                                  <td>
                                    {element.single === 1 && "Yes"}
                                    {element.single === 0 && "No"}
                                  </td>
                                )}
                                {checkFieldExist("Gated") && (
                                  <td>
                                    {element.gated === 1 && "Yes"}
                                    {element.gated === 0 && "No"}
                                  </td>
                                )}
                                {checkFieldExist("Location") && (
                                  <td>{element.location}</td>
                                )}
                                {checkFieldExist("Juridiction") && (
                                  <td>{element.juridiction}</td>
                                )}
                                {checkFieldExist("Latitude") && (
                                  <td>{element.lat}</td>
                                )}
                                {checkFieldExist("Longitude") && (
                                  <td>{element.lng}</td>
                                )}
                                {checkFieldExist("Gas Provider") && (
                                  <td>{element.gasprovider}</td>
                                )}
                                {checkFieldExist("HOA Fee") && (
                                  <td>{element.hoafee}</td>
                                )}
                                {checkFieldExist("Masterplan Fee") && (
                                  <td>{element.masterplanfee}</td>
                                )}
                                {checkFieldExist("Parcel Group") && (
                                  <td>{element.parcel}</td>
                                )}
                                {checkFieldExist("Phone") && (
                                  <td>{element.phone}</td>
                                )}
                                {checkFieldExist("Website") && (
                                  <td>{element.builder.website}</td>
                                )}
                                {checkFieldExist("Date Added") && (
                                  <td>
                                    <DateComponent date={element.dateadded} />
                                  </td>
                                )}
                                {checkFieldExist("__pkSubID") && (
                                  <td>{element.subdivision_code}</td>
                                )}
                                {checkFieldExist("_fkBuilderID") && (
                                  <td>{element.builder.builder_code}</td>
                                )}
                                <td>{element.total_closings}</td>
                                <td>{element.total_permits}</td>
                                <td>{element.total_net_sales}</td>
                                <td>{element.months_open}</td>
                                <td>
                                  <DateComponent date={element.latest_traffic_data} />
                                  </td>
                                <td>{element.latest_lots_released}</td>
                                <td>{element.latest_standing_inventory}</td>
                                <td>{element.unsold_lots}</td>
                                <td>{element.avg_sqft_all}</td>
                                <td>{element.avg_sqft_active}</td>
                               <td>{<PriceComponent price={element.avg_base_price_all} /> || "NA"}</td>
                                <td>{<PriceComponent price={element.avg_base_price_active} /> || "NA"}</td>
                                <td>{element.min_sqft_all}</td>
                                <td>{element.min_sqft_active}</td>
                                <td>{element.max_sqft_all}</td>
                                <td>{element.max_sqft_active}</td>
                                <td>{<PriceComponent price={element.min_base_price_all} /> || "NA"}</td>
                                <td>{element.min_sqft_active_current}</td>
                                <td>{<PriceComponent price={element.max_base_price_all} /> || "NA"}</td>
                                <td>{element.max_sqft_active_current}</td>
                                <td>{element.avg_net_traffic_per_month_this_year}</td>
                                <td>{element.avg_net_sales_per_month_this_year}</td>
                                <td>{element.avg_closings_per_month_this_year}</td>
                                <td>{element.avg_net_sales_per_month_since_open}</td>
                                <td>{element.avg_net_sales_per_month_last_three_months}</td>
                                <td>{<DateComponent date={element.max_week_ending} /> || "NA"}</td>
                                <td>{<DateComponent date={element.min_week_ending} /> || "NA"}</td>
                                <td>{element.sqft_group}</td>
                                <td>{element.price_group}</td>
                                <td>{element.month_net_sold}</td>
                                <td>{element.year_net_sold}</td>
                                {checkFieldExist("Action") && (
                                  <td style={{ textAlign: "center" }}>
                                    <div>
                                      <Link
                                        to={`/subdivisionUpdate/${element.id}`}
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
                                )}
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
                 <div className="d-sm-flex text-center justify-content-between align-items-center">
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SubdivisionOffcanvas
        ref={subdivision}
        Title="Add Subdivision"
        parentCallback={handleCallback}
      />
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
            Subdivision Details
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
                    <Tab label="Subdivision Details" value="1" />
                    <Tab label="Products" value="2" />
                    <Tab label="Permits" value="3" />
                    <Tab label="Traffic & Sales" value="4" />
                    <Tab label="Closings" value="5" />
                    <Tab label="Land Sales" value="6" />
                  </TabList>
                </Box>
                <TabPanel value="1" className="p-0">
                  <div className="card">
                    <div className="card-body p-0">
                      <div className="row">
                        <div className="col-xl-4 mt-4">
                          <label className="">Builder :</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.builder &&
                              SubdivisionDetails.builder.name !== undefined
                                ? SubdivisionDetails.builder.name
                                : "NA"}
                            </span>
                          </div>
                        </div>
                        <div className="col-xl-4 mt-4">
                          <label className="">Subdivision Code:</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.subdivision_code || "NA"}
                            </span>
                          </div>
                        </div>
                        <div className="col-xl-4 mt-4">
                          <label className="">Name:</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.name || "NA"}
                            </span>
                          </div>
                        </div>
                        <div className="col-xl-4 mt-4">
                          <label className="">Status :</label>
                          <div>
                            <span className="fw-bold">
                              <span className="fw-bold">
                                {SubdivisionDetails.status === 1 && "Active"}
                                {SubdivisionDetails.status === 0 && "De-acitve"}
                                {SubdivisionDetails.status === 2 && "Future"}
                              </span>
                            </span>
                          </div>
                        </div>

                        <div className="col-xl-4 mt-4">
                          <label className="">Reporting :</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.reporting === 1 && "Yes"}
                              {SubdivisionDetails.reporting === 0 && "No"}
                            </span>
                          </div>
                        </div>
                        <div className="col-xl-4 mt-4">
                          <label className="">Product Type:</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.product_type || "NA"}
                            </span>
                          </div>
                        </div>
                        <div className="col-xl-4 mt-4">
                          <label className="">Phone:</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.phone || "NA"}
                            </span>
                          </div>
                        </div>
                        <div className="col-xl-4 mt-4">
                          <label className="">Open Since:</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.opensince || "NA"}
                            </span>
                          </div>
                        </div>

                        <div className="col-xl-4 mt-4">
                          <label className="">Age Restricted:</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.reporting === 0 && "No"}
                              {SubdivisionDetails.reporting === 1 && "Yes"}
                              {SubdivisionDetails.reporting === "" && "NA"}
                            </span>
                          </div>
                        </div>
                        <div className="col-xl-4 mt-4">
                          <label className="">All Single Story :</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.reporting === 0 && "No"}
                              {SubdivisionDetails.reporting === 1 && "Yes"}
                              {SubdivisionDetails.reporting === "" && "NA"}
                            </span>
                          </div>
                        </div>
                        <div className="col-xl-4 mt-4">
                          <label className="">First Permit Date:</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.firstpermitdate || "NA"}
                            </span>
                          </div>
                        </div>
                        <div className="col-xl-4 mt-4">
                          <label className="">Masterplan:</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.masterplan_id || "NA"}
                            </span>
                          </div>
                        </div>
                        <div className="col-xl-4 mt-4">
                          <label className="">Latitude:</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.lat || "NA"}
                            </span>
                          </div>
                        </div>
                        <div className="col-xl-4 mt-4">
                          <label className="">Longitude:</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.lng || "NA"}
                            </span>
                          </div>
                        </div>
                        <div className="col-xl-4 mt-4">
                          <label className="">Area:</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.area || "NA"}
                            </span>
                          </div>
                        </div>
                        <div className="col-xl-4 mt-4">
                          <label className="">Juridiction:</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.juridiction || "NA"}
                            </span>
                          </div>
                        </div>
                        <div className="col-xl-4 mt-4">
                          <label className="">Zipcode:</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.zipcode || "NA"}
                            </span>
                          </div>
                        </div>
                        <div className="col-xl-4 mt-4">
                          <label className="">Parcel:</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.parcel || "NA"}
                            </span>
                          </div>
                        </div>

                        <div className="col-xl-4 mt-4">
                          <label className="">Cross Street:</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.crossstreet || "NA"}
                            </span>
                          </div>
                        </div>

                        <div className="col-xl-4 mt-4">
                          <label className="">Total Lots :</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.totallots || "NA"}
                            </span>
                          </div>
                        </div>

                        <div className="col-xl-4 mt-4">
                          <label className="">Unsold Lots :</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.unsoldlots || "NA"}
                            </span>
                          </div>
                        </div>
                        <div className="col-xl-4 mt-4">
                          <label className="">Lot Width :</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.lotwidth || "NA"}
                            </span>
                          </div>
                        </div>

                        <div className="col-xl-4 mt-4">
                          <label className="">Stading Inventory :</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.stadinginventory || "NA"}
                            </span>
                          </div>
                        </div>

                        <div className="col-xl-4 mt-4">
                          <label className="">Lot Size :</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.lotsize || "NA"}
                            </span>
                          </div>
                        </div>

                        <div className="col-xl-4 mt-4">
                          <label className="">Permits :</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.permits || "NA"}
                            </span>
                          </div>
                        </div>

                        <div className="col-xl-4 mt-4">
                          <label className="">Net Sales :</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.netsales || "NA"}
                            </span>
                          </div>
                        </div>

                        <div className="col-xl-4 mt-4">
                          <label className="">Closing :</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.closing || "NA"}
                            </span>
                          </div>
                        </div>

                        <div className="col-xl-4 mt-4">
                          <label className="">Months Open:</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.monthsopen || "NA"}
                            </span>
                          </div>
                        </div>

                        <div className="col-xl-4 mt-4">
                          <label className="">Gated :</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.gated || "NA"}
                            </span>
                          </div>
                        </div>

                        <div className="col-xl-4 mt-4">
                          <label className="">Sqft Group :</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.sqftgroup || "NA"}
                            </span>
                          </div>
                        </div>

                        <div className="col-xl-4 mt-4">
                          <label className="">Lot Released :</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.lotreleased || "NA"}
                            </span>
                          </div>
                        </div>

                        <div className="col-xl-4 mt-4">
                          <label className="">Dollar Group :</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.lat || "NA"}
                            </span>
                          </div>
                        </div>

                        <div className="col-xl-4 mt-4">
                          <label className="">Master Plan Fee :</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.masterplanfee || "NA"}
                            </span>
                          </div>
                        </div>

                        <div className="col-xl-4 mt-4">
                          <label className="">Last Weekly Data :</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.lastweeklydata || "NA"}
                            </span>
                          </div>
                        </div>

                        <div className="col-xl-4 mt-4">
                          <label className="">Date Added :</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.dateadded || "NA"}
                            </span>
                          </div>
                        </div>

                        <div className="col-xl-4 mt-4">
                          <label className="">Zoning :</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.zoning || "NA"}
                            </span>
                          </div>
                        </div>

                        <div className="col-xl-4 mt-4">
                          <label className="">Gas Provider :</label>
                          <div>
                            <span className="fw-bold">
                              {SubdivisionDetails.gasprovider || "NA"}
                            </span>
                          </div>
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
                            className="table ItemsCheckboxSec dataTable no-footer mb-0"
                          >
                            <thead>
                              <tr style={{ textAlign: "center" }}>
                                <th>
                                  <strong>No.</strong>
                                </th>
                                <th>
                                  <strong>Name</strong>
                                </th>
                                <th>
                                  <strong>Product Code</strong>
                                </th>
                                <th>
                                  <strong>Stories</strong>
                                </th>
                                <th>
                                  <strong>Recent Price</strong>
                                </th>
                                <th>
                                  <strong>Recent Price SQFT</strong>
                                </th>
                              </tr>
                            </thead>
                            <tbody style={{ textAlign: "center" }}>
                              {SubdivisionDetails.products &&
                              Array.isArray(SubdivisionDetails.products) &&
                              SubdivisionDetails.products.length > 0 ? (
                                SubdivisionDetails.products.map(
                                  (element, index) => (
                                    <tr
                                      onClick={handleProductRedirect}
                                      key={element.id}
                                      style={{
                                        textAlign: "center",
                                        cursor: "pointer",
                                      }}
                                    >
                                      <td>{index + 1}</td>
                                      <td>{element.name}</td>
                                      <td>{element.product_code}</td>
                                      <td>{element.stories}</td>
                                      <td>{element.recentprice}</td>
                                      <td>{element.recentpricesqft}</td>
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
                            className="table ItemsCheckboxSec dataTable no-footer mb-0"
                          >
                            <thead>
                              <tr style={{ textAlign: "center" }}>
                                <th>No.</th>
                                <th>Permit Number</th>
                                <th>Owner</th>
                                <th>Contractor</th>
                                <th>Description</th>
                                <th>Address</th>
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
                                        handlePermitRedirect(element.id)
                                      }
                                      key={element.id}
                                      style={{
                                        textAlign: "center",
                                        cursor: "pointer",
                                      }}
                                    >
                                      <td>{index + 1}</td>
                                      <td>{element.permitnumber}</td>
                                      <td>{element.owner}</td>
                                      <td>{element.contractor}</td>
                                      <td>{element.description}</td>
                                      <td>{element.address1}</td>
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
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody style={{ textAlign: "center" }}>
                              {SubdivisionDetails.traficSales &&
                              Array.isArray(SubdivisionDetails.traficSales) &&
                              SubdivisionDetails.traficSales.length > 0 ? (
                                SubdivisionDetails.traficSales.map(
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
                                      <td>
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
                            className="table ItemsCheckboxSec dataTable no-footer mb-0"
                          >
                            <thead>
                              <tr style={{ textAlign: "center" }}>
                                <th>No.</th>
                                <th>Seller Leagal</th>
                                <th>Address</th>
                                <th>Buyer</th>
                                <th>Closing Date</th>
                                <th>Closing Price</th>
                                <th>Loan Amount</th>
                                <th>Document</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody style={{ textAlign: "center" }}>
                              {SubdivisionDetails.get_closing &&
                              Array.isArray(SubdivisionDetails.get_closing) &&
                              SubdivisionDetails.get_closing.length > 0 ? (
                                SubdivisionDetails.get_closing.map(
                                  (element, index) => (
                                    <tr
                                      onClick={handleClosingRedirect}
                                      key={element.id}
                                      style={{
                                        textAlign: "center",
                                        cursor: "pointer",
                                      }}
                                    >
                                      <td>{index + 1}</td>
                                      <td>{element.sellerleagal}</td>
                                      <td>{element.address}</td>
                                      <td>{element.buyer}</td>
                                      <td>{element.closingdate}</td>
                                      <td>{element.closingprice}</td>
                                      <td>{element.loanamount}</td>
                                      <td>{element.document}</td>
                                      <td>
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
                <TabPanel value="6" className="p-0">
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
                                  <strong> No. </strong>
                                </th>
                                <th>
                                  <strong>Seller</strong>
                                </th>
                                <th>
                                  <strong> Buyer</strong>
                                </th>
                                <th>
                                  <strong> Location</strong>
                                </th>
                                <th>
                                  <strong> Notes</strong>
                                </th>
                                <th>
                                  <strong> Price</strong>
                                </th>
                                <th>
                                  <strong> date</strong>
                                </th>

                                <th>
                                  {" "}
                                  <strong>Action</strong>
                                </th>
                              </tr>
                            </thead>
                            <tbody style={{ textAlign: "center" }}>
                              {SubdivisionDetails.landsales &&
                              Array.isArray(SubdivisionDetails.landsales) &&
                              SubdivisionDetails.landsales.length > 0 ? (
                                SubdivisionDetails.landsales.map(
                                  (element, index) => (
                                    <tr
                                      onClick={handleLandRedirect}
                                      key={element.id}
                                      style={{
                                        textAlign: "center",
                                        cursor: "pointer",
                                      }}
                                    >
                                      {" "}
                                      <td>{index + 1}</td>
                                      <td>{element.seller}</td>
                                      <td>{element.buyer}</td>
                                      <td>{element.location}</td>
                                      <td>{element.notes}</td>
                                      <td>{element.price}</td>
                                      <td>{element.date}</td>
                                      <td>
                                        <div className="d-flex justify-content-center">
                                          <Link
                                            to={`/landsaleupdate/${element.id}`}
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
      <SubdivisionOffcanvas
        ref={subdivision}
        Title="Add Subdivision"
        parentCallback={handleCallback}
      />
      <Modal show={exportmodelshow} onHide={setExportModelShow}>
        <>
          <Modal.Header>
          <Modal.Title>Export</Modal.Title>
          <button
            className="btn-close"
            aria-label="Close"
            onClick={() => setExportModelShow(false)}
          ></button>
          </Modal.Header>
          <Modal.Body>
          <Row>
            <ul className='list-unstyled'>
            {columns.map((col) => (
              <li key={col.label}>
              <label className='form-check'>
                <input
                  type="checkbox"
                  className='form-check-input'
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
    </>
  );
};

export default SubdivisionList;
