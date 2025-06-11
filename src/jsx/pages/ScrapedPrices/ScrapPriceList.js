import React, { useState, useEffect, Fragment } from "react";
import AdminPriceService from "../../../API/Services/AdminService/AdminPriceService";
import AdminScrapPriceService from "../../../API/Services/AdminService/AdminScrapPriceService";
import PriceComponent from "../../components/Price/PriceComponent";
import { Link, useLocation, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import MainPagetitle from "../../layouts/MainPagetitle";
import Button from "react-bootstrap/Button";
import ClipLoader from "react-spinners/ClipLoader";
import DateComponent from "../../components/date/DateFormat";
import AccessField from "../../components/AccssFieldComponent/AccessFiled";
import Modal from "react-bootstrap/Modal";
import ColumnReOrderPopup from "../../popup/ColumnReOrderPopup";
import { Offcanvas, Form } from "react-bootstrap";
import AdminBuilderService from "../../../API/Services/AdminService/AdminBuilderService";
import AdminSubdevisionService from "../../../API/Services/AdminService/AdminSubdevisionService";
import { MultiSelect } from "react-multi-select-component";
import '../../pages/Subdivision/subdivisionList.css';
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";

const ScrapPriceList = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const page = JSON.parse(queryParams.get("page")) === 1 ? null : JSON.parse(queryParams.get("page"));

  const [searchQuery, setSearchQuery] = useState(localStorage.getItem("searchQueryByScrapedBasePricesFilter") ? JSON.parse(localStorage.getItem("searchQueryByScrapedBasePricesFilter")) : "");
  const [showPopup, setShowPopup] = useState(false);
  const handlePopupClose = () => setShowPopup(false);
  const [message, setMessage] = useState(false);
  const [excelLoading, setExcelLoading] = useState(false);

  const SyestemUserRole = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).role
    : "";

  const [manageFilterOffcanvas, setManageFilterOffcanvas] = useState(false);
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
            setSelectedLandSales(scrapedPriceList?.map((user) => user.id));
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

  const [filterQuery, setFilterQuery] = useState({
    builder_name: localStorage.getItem("builder_name_ScrapedBasePrice") ? JSON.parse(localStorage.getItem("builder_name_ScrapedBasePrice")) : "",
    subdivision_name: localStorage.getItem("subdivision_name_ScrapedBasePrice") ? JSON.parse(localStorage.getItem("subdivision_name_ScrapedBasePrice")) : "",
    name: localStorage.getItem("product_name_ScrapedBasePrice") ? JSON.parse(localStorage.getItem("product_name_ScrapedBasePrice")) : "",
    scraped_price: localStorage.getItem("product_scraped_price_ScrapedBasePrice") ? JSON.parse(localStorage.getItem("product_scraped_price_ScrapedBasePrice")) : "",
    product_code: localStorage.getItem("product_code_ScrapedBasePrice") ? JSON.parse(localStorage.getItem("product_code_ScrapedBasePrice")) : "",
    website: localStorage.getItem("website_ScrapedBasePrice") ? JSON.parse(localStorage.getItem("website_ScrapedBasePrice")) : "",
    scraped_date: localStorage.getItem("scraped_date_ScrapedBasePrice") ? JSON.parse(localStorage.getItem("scraped_date_ScrapedBasePrice")) : "",
  });

  const [normalFilter, setNormalFilter] = useState(false);

  const [Error, setError] = useState("");
  const navigate = useNavigate();
  const [scrapedPriceList, setScrapedPriceList] = useState([]);
  const [manageAccessOffcanvas, setManageAccessOffcanvas] = useState(false);
  const [accessList, setAccessList] = useState({});
  const [accessRole, setAccessRole] = useState("Admin");
  const [accessForm, setAccessForm] = useState({});
  const [role, setRole] = useState("Admin");
  const [checkedItems, setCheckedItems] = useState({});
  const [manageAccessField, setManageAccessField] = useState(false);
  const [fieldList, setFieldList] = useState([]);
  const [productListCount, setProductListCount] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [columns, setColumns] = useState([]);
  const [draggedColumns, setDraggedColumns] = useState(columns);
  const [selectedLandSales, setSelectedLandSales] = useState([]);

  const [builderDropDown, setBuilderDropDown] = useState([]);
  const [subdivisionListDropDown, setSubdivisionListDropDown] = useState([]);
  const [selectedBuilderName, setSelectedBuilderName] = useState([]);
  const [selectedSubdivisionName, setSelectedSubdivisionName] = useState([]);
  const [selectedBuilderIDByFilter, setSelectedBuilderIDByFilter] = useState([]);

  const [sortConfig, setSortConfig] = useState(() => {
    const savedSortConfig = localStorage.getItem("sortConfigBasePrices");
    return savedSortConfig ? JSON.parse(savedSortConfig) : [];
  });
  const [selectedFields, setSelectedFields] = useState(() => {
    const saved = localStorage.getItem("selectedFieldsBasePrices");
    return saved ? JSON.parse(saved) : [];
  });
  const [selectionOrder, setSelectionOrder] = useState(() => {
    const saved = localStorage.getItem("selectionOrderBasePrices");
    return saved ? JSON.parse(saved) : {};
  });
  const [sortOrders, setSortOrders] = useState(() => {
    const saved = localStorage.getItem("sortOrdersBasePrices");
    return saved ? JSON.parse(saved) : {};
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [AllProductListExport, setAllBuilderExport] = useState([]);
  const [pageChange, setPageChange] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPage = 100;
  const lastIndex = currentPage * recordsPage;
  const firstIndex = lastIndex - recordsPage;
  const [npage, setNpage] = useState(0);
  const number = [...Array(npage + 1).keys()].slice(1);

  const [calculationData, setCalculationData] = useState({});
  const [handleCallBack, setHandleCallBack] = useState(false);
  const [canvasShowAdd, seCanvasShowAdd] = useState(false);
  const [canvasShowEdit, seCanvasShowEdit] = useState(false);

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

  const HandleRole = (e) => {
    setRole(e.target.value);
    setAccessRole(e.target.value);
  };

  const handleAccessForm = async (e) => {
    e.preventDefault();

    var userData = {
      form: accessForm,
      role: role,
      table: "scraped_product_prices",
    };

    try {
      const data = await AdminScrapPriceService.manageAccessFields(userData).json();
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
    if (selectedLandSales?.length === 0) {
      setHandleCallBack(false);
    }
  }, [selectedLandSales]);

  useEffect(() => {
    if (manageFilterOffcanvas) {
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
      localStorage.setItem("selectedFieldsBasePrices", JSON.stringify(selectedFields));
    }
    if (selectionOrder) {
      localStorage.setItem("selectionOrderBasePrices", JSON.stringify(selectionOrder));
    }
    if (sortOrders) {
      localStorage.setItem("sortOrdersBasePrices", JSON.stringify(sortOrders));
    }
  }, [selectedFields, selectionOrder, sortOrders]);

  useEffect(() => {
    if (localStorage.getItem("selectedBuilderNameByFilter_ScrapedBasePrice")) {
      const selectedBuilderName = JSON.parse(localStorage.getItem("selectedBuilderNameByFilter_ScrapedBasePrice"));
      handleSelectBuilderNameChange(selectedBuilderName);
    }
    if (localStorage.getItem("selectedSubdivisionNameByFilter_ScrapedBasePrice")) {
      const selectedSubdivisionName = JSON.parse(localStorage.getItem("selectedSubdivisionNameByFilter_ScrapedBasePrice"));
      handleSelectSubdivisionNameChange(selectedSubdivisionName);
    }
  }, []);

  useEffect(() => {
    setSearchQuery(filterString());
  }, [filterQuery]);

  useEffect(() => {
    if (localStorage.getItem("usertoken")) {
      if (page === currentPage) {
        return;
      } else {
        GetScrapedPriceList(page === null ? currentPage : JSON.parse(page), sortConfig, searchQuery);
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

  // const ProductBySubdivisionIDList = async (subdivisionId) => {
  //   try {
  //     const response = await AdminProductService.productBySubdivision(subdivisionId);
  //     const responseData = await response.json();
  //     const formattedData = responseData?.map((product) => ({
  //       label: product.name,
  //       value: product.id,
  //     }));
  //     // const filter = formattedData?.filter(data => data.value === productCode?.value);
  //     // handleProductCode(filter?.length > 0 ? filter[0] : filter?.length == 0 ? [] : formattedData[0]);
  //     setProductListDropDown(formattedData);
  //   } catch (error) {
  //     console.log("Error fetching builder list:", error);
  //     if (error.name === "HTTPError") {
  //       const errorJson = await error.response.json();
  //       setError(errorJson.message);
  //     }
  //   }
  // };

  useEffect(() => {
    if (manageFilterOffcanvas) {
      GetBuilderDropDownList();
    }
  }, [manageFilterOffcanvas]);

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
      const response = await AdminScrapPriceService.accessField();
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

  const stringifySortConfig = (sortConfig) => {
    return sortConfig.map((sort) => `${sort.key}:${sort.direction}`).join(",");
  };

  const GetScrapedPriceList = async (pageNumber, sortConfig, searchQuery) => {
    setIsLoading(true);
    setExcelLoading(true);
    setSearchQuery(searchQuery);
    setCurrentPage(pageNumber);
    localStorage.setItem("searchQueryByScrapedBasePricesFilter", JSON.stringify(searchQuery));
    try {
      let sortConfigString = "";
      if (sortConfig !== null) {
        sortConfigString = "&sortConfig=" + stringifySortConfig(sortConfig);
      }
      const response = await AdminScrapPriceService.index(
        pageNumber,
        sortConfigString,
        searchQuery
      );
      const responseData = await response.json();
      setIsLoading(false);
      setExcelLoading(false);
      setPageChange(false);
      setScrapedPriceList(responseData.data);
      setNpage(Math.ceil(responseData.meta.total / recordsPage));
      setProductListCount(responseData.meta.total);
      setHandleCallBack(true);
      // if (responseData.meta.total > 100) {
      //   if (!pageChange) {
      //     FetchAllPages(searchQuery, sortConfig, responseData.data, responseData.meta.total);
      //   }
      // } else {
      //   if (!pageChange) {
      //     setAllBuilderExport(responseData.data);
      //   }
      // }
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
    if (page !== null) {
      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        // await delay(1000);
        if (pageNum === page) continue;
        const pageResponse = await AdminScrapPriceService.index(pageNum, searchQuery, sortConfig ? `&sortConfig=${stringifySortConfig(sortConfig)}` : "");
        const pageData = await pageResponse.json();
        allData = allData.concat(pageData.data);
      }
      setAllBuilderExport(allData);
      setExcelLoading(false);
      setHandleCallBack(true);
    } else {
      for (let page = 2; page <= totalPages; page++) {
        // await delay(1000);
        const pageResponse = await AdminPriceService.index(page, searchQuery, sortConfig ? `&sortConfig=${stringifySortConfig(sortConfig)}` : "");
        const pageData = await pageResponse.json();
        allData = allData.concat(pageData.data);
      }
      setAllBuilderExport(allData);
      setExcelLoading(false);
      setHandleCallBack(true);
    }
  };

  const handleDelete = async (e) => {
    try {
      let responseData = await AdminPriceService.destroy(e).json();
      if (responseData.status === true) {
        GetScrapedPriceList(currentPage, sortConfig, searchQuery);
      }
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(errorJson.message);
      }
    }
  };

  const handleBulkApprove = async (id) => {
    try {
      let responseData = await AdminScrapPriceService.bulkapprove(id).json();
      if (responseData.status === true) {
        GetScrapedPriceList(currentPage, sortConfig, searchQuery);
      }
    } catch (error) {
      if (error.name === "HTTPError") {
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

  const handleSelectBuilderNameChange = (selectedItems) => {
    const selectedNames = selectedItems.map(item => item.label).join(', ');
    const selectedValues = selectedItems.map(item => item.value);
    setSelectedBuilderName(selectedItems);
    setSelectedBuilderIDByFilter(selectedValues);
    setFilterQuery(prevState => ({
      ...prevState,
      builder_name: selectedNames
    }));
    setNormalFilter(true);
  };

  const handleSelectSubdivisionNameChange = (selectedItems) => {
    const selectedNames = selectedItems.map(item => item.label).join(', ');
    setSelectedSubdivisionName(selectedItems);
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
      builder_name: "",
      subdivision_name: "",
      name: "",
      scraped_price: "",
      product_code: "",
      website: "",
      scraped_date: ""
    });
    setSelectedBuilderName([]);
    setSelectedSubdivisionName([]);
    setSelectedBuilderIDByFilter([]);
    GetScrapedPriceList(1, sortConfig, "");
    setManageFilterOffcanvas(false);
    localStorage.removeItem("selectedBuilderNameByFilter_ScrapedBasePrice");
    localStorage.removeItem("selectedSubdivisionNameByFilter_ScrapedBasePrice");
    localStorage.removeItem("builder_name_ScrapedBasePrice");
    localStorage.removeItem("subdivision_name_ScrapedBasePrice");
    localStorage.removeItem("product_name_ScrapedBasePrice");
    localStorage.removeItem("product_scraped_price_ScrapedBasePrice");
    localStorage.removeItem("product_code_ScrapedBasePrice");
    localStorage.removeItem("website_ScrapedBasePrice");
    localStorage.removeItem("scraped_date_ScrapedBasePrice");
  };

  const parseDate = (dateString) => {
    const [month, day, year] = dateString.split('/');
    return new Date(year, month - 1, day);
  };

  const handleFilterScrapedDate = (date) => {
    if (date) {
      const formattedDate = date.toLocaleDateString('en-US'); // Formats date to "MM/DD/YYYY"
      setFilterQuery((prevFilterQuery) => ({
        ...prevFilterQuery,
        scraped_date: formattedDate,
      }));
    } else {
      setFilterQuery((prevFilterQuery) => ({
        ...prevFilterQuery,
        scraped_date: '',
      }));
    }
    setNormalFilter(true);
  };

  const HandlePopupDetailClick = (e) => {
    setShowPopup(true);
  };

  const HandleFilterForm = (e) => {
    e.preventDefault();
    GetScrapedPriceList(1, sortConfig, searchQuery);
    setManageFilterOffcanvas(false);
    localStorage.setItem("selectedBuilderNameByFilter_ScrapedBasePrice", JSON.stringify(selectedBuilderName));
    localStorage.setItem("selectedSubdivisionNameByFilter_ScrapedBasePrice", JSON.stringify(selectedSubdivisionName));
    localStorage.setItem("builder_name_ScrapedBasePrice", JSON.stringify(filterQuery.builder_name));
    localStorage.setItem("subdivision_name_ScrapedBasePrice", JSON.stringify(filterQuery.subdivision_name));
    localStorage.setItem("product_name_ScrapedBasePrice", JSON.stringify(filterQuery.name));
    localStorage.setItem("product_scraped_price_ScrapedBasePrice", JSON.stringify(filterQuery.scraped_price));
    localStorage.setItem("product_code_ScrapedBasePrice", JSON.stringify(filterQuery.product_code));
    localStorage.setItem("website_ScrapedBasePrice", JSON.stringify(filterQuery.website));
    localStorage.setItem("scraped_date_ScrapedBasePrice", JSON.stringify(filterQuery.scraped_date));
    localStorage.setItem("searchQueryByScrapedBasePricesFilter", JSON.stringify(searchQuery));
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
    localStorage.setItem("draggedColumnsScrapPrices", JSON.stringify(draggedColumns));
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
    const draggedColumns = JSON.parse(localStorage.getItem("draggedColumnsScrapPrices"));
    if (draggedColumns) {
      setColumns(draggedColumns);
    } else {
      const mappedColumns = fieldList.map((data) => ({
        id: data.charAt(0).toLowerCase() + data.slice(1),
        label: data
      }));
      setColumns(mappedColumns);
      // alert(JSON.stringify(mappedColumns))
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
      }).join('');
  }

  useEffect(() => {
    const fieldOptions = fieldList
      .filter((field) => field !== 'Action' && field !== 'Approve')
      .map((field) => {
        let value = field.charAt(0).toLowerCase() + field.slice(1).replace(/\s+/g, '');

        if (value === 'scrapedPrices') {
          value = 'scraped_price';
        }
        if (value === 'productCode') {
          value = 'product_code';
        }
        if (value === 'scrapedDate') {
          value = 'scraped_date';
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
    localStorage.setItem("sortConfigBasePrices", JSON.stringify(sortingConfig));
    setSortConfig(sortingConfig);
    GetScrapedPriceList(currentPage, sortingConfig, searchQuery);
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
  const [editing, setEditing] = useState(null); // { rowId, value }

  const handleSave = async (rowId, rawValue) => {
    if (rawValue == null) return;

    const cleanValue =
      rawValue === "" || isNaN(parseFloat(rawValue))
        ? "0.00"
        : parseFloat(rawValue).toFixed(2);

    try {
      const data = await AdminScrapPriceService.bulkupdate(rowId,
        {
          id: rowId,
          scraped_price: cleanValue,
        }).json();

      if (data.status === true) {
        // Update the UI immediately
        setScrapedPriceList((prev) =>
          prev.map((item) =>
            item.id === rowId ? { ...item, scraped_price: cleanValue } : item
          )
        );
        console.log("Saved successfully");
      } else {
        console.error("Save failed: ", data);
      }
    } catch (error) {
      console.error("Save failed:", error);
    }

    setEditing(null); // Close the editor in any case
  };

  return (
    <Fragment>
      <MainPagetitle
        mainTitle="Scraped Base Price"
        pageTitle="Scraped Base Price"
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
                      <h4 className="heading mb-0">Scraped Base Price List</h4>
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
                          {/* <button disabled={excelDownload || scrapedPriceList?.length === 0} onClick={() => setExportModelShow(true)} className="btn btn-primary btn-sm me-1" title="Export .csv">
                            <div style={{ fontSize: "11px" }}>
                              <i class="fas fa-file-export" />&nbsp;
                              {excelDownload ? "Downloading..." : "Export"}
                            </div>
                          </button> */}
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

                          {/* <button disabled={excelDownload || scrapedPriceList?.length === 0} onClick={() => setExportModelShow(true)} className="btn btn-primary btn-sm me-1" title="Export .csv">
                            <div style={{ fontSize: "11px" }}>
                              <i class="fas fa-file-export" />&nbsp;
                              {excelDownload ? "Downloading..." : "Export"}
                            </div>
                          </button> */}

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

                          {/* <Button
                            className="btn-sm me-1"
                            variant="secondary"
                            onClick={handlBuilderClick}
                          >
                            <div style={{ fontSize: "11px" }}>
                              <i className="fas fa-file-import" />&nbsp;
                              Import
                            </div>
                          </Button> */}

                          {/* <input
                            type="file"
                            id="fileInput"
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                          /> */}

                          {/* <Link
                            to={"#"}
                            className="btn btn-primary btn-sm ms-1"
                            data-bs-toggle="offcanvas"
                            onClick={() => seCanvasShowAdd(true)}
                          >
                            <div style={{ fontSize: "11px" }}>
                              <i className="fa fa-plus" />&nbsp;
                              Add Base Price
                            </div>
                          </Link> */}

                          {/* <Link
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
                          </Link> */}

                          <button
                            className="btn btn-success btn-sm me-1"
                            style={{ marginLeft: "3px" }}
                            onClick={() => selectedLandSales.length > 0 ? swal({
                              title: "Are you sure?",
                              icon: "warning",
                              buttons: true,
                              dangerMode: true,
                            }).then((willDelete) => {
                              if (willDelete) {
                                handleBulkApprove(selectedLandSales);
                              }
                            }) : swal({
                              title: "Please select at least one row.",
                              icon: "warning",
                            })}
                          >
                            <div style={{ fontSize: "11px" }}>
                              <i className="fa fa-check" />&nbsp;
                              Approve
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
                        className="table ItemsCheckboxSec dataTable no-footer mb-0 scrap-table"
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
                                  {column.id == "product Code" ? "Product Code" : column.label}
                                  {column.id != "action" && column.id != "approve" && sortConfig.some(
                                    (item) => item.key === (
                                      column.id == "builder Name" ? "builderName" :
                                        column.id == "subdivision Name" ? "subdivisionName" :
                                          column.id == "product Name" ? "productName" :
                                            column.id == "scraped Prices" ? "scraped_price" :
                                              column.id == "product Code" ? "product_code" :
                                                column.id == "website" ? "website" :
                                                  column.id == "scraped Date" ? "scraped_date" : toCamelCase(column.id))
                                  ) && (
                                      <span>
                                        {column.id != "action" && sortConfig.find(
                                          (item) => item.key === (
                                            column.id == "builder Name" ? "builderName" :
                                              column.id == "subdivision Name" ? "subdivisionName" :
                                                column.id == "product Name" ? "productName" :
                                                  column.id == "scraped Prices" ? "scraped_price" :
                                                    column.id == "product Code" ? "product_code" :
                                                      column.id == "website" ? "website" :
                                                        column.id == "scraped Date" ? "scraped_date" : toCamelCase(column.id))
                                        ).direction === "asc" ? "↑" : "↓"}
                                      </span>
                                    )}
                                </strong>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody style={{ textAlign: "center" }}>
                          {scrapedPriceList !== null && scrapedPriceList.length > 0 ? (
                            scrapedPriceList.map((element, index) => (
                              <tr
                                onClick={(e) => {
                                  if (e.target.type == "checkbox") {
                                    return;
                                  } else if (e.target.className == "btn btn-danger shadow btn-xs sharp" || e.target.className == "fa fa-trash") {
                                    return;
                                  } else {
                                    // handleRowClick(element.id);
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
                                    {column.id == "approve" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>
                                        <button
                                          onClick={() => {
                                            if (element.id) {
                                              swal({
                                                title: "Are you sure?",
                                                icon: "warning",
                                                buttons: true,
                                                dangerMode: true,
                                              }).then((willDelete) => {
                                                if (willDelete) {
                                                  handleBulkApprove(element.id);
                                                }
                                              });
                                            }
                                          }}
                                          className="btn btn-success btn-sm ms-1">
                                          <div style={{ fontSize: "11px" }}>
                                            <i className="fa fa-check" />&nbsp;
                                            Approve
                                          </div>
                                        </button>
                                      </td>
                                    }
                                    {column.id == "builder Name" &&
                                      <td key={column.id} style={{ textAlign: "center" }} >{element?.product?.subdivision?.builder?.name}</td>
                                    }
                                    {column.id == "subdivision Name" &&
                                      <td key={column.id} style={{ textAlign: "center" }} >{element?.product?.subdivision?.name}</td>
                                    }
                                    {column.id == "product Name" &&
                                      <td key={column.id} style={{ textAlign: "center" }} >{element.product && element.product && element.product.name}</td>
                                    }
                                    {column.id == "scraped Prices" &&
                                      <td style={{ textAlign: "center" }}>
                                        {editing?.rowId === element.id ? (
                                          <div className="d-flex align-items-center">
                                            <div className="flex-grow-1">
                                              <input
                                                type="text"
                                                value={editing?.value || ""}
                                                onChange={(e) =>
                                                  setEditing({ ...editing, value: e.target.value })
                                                }
                                                onKeyDown={(e) => {
                                                  if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    handleSave(element.id, editing.value);
                                                  }
                                                }}
                                                autoFocus
                                                style={{ width: "80px", textAlign: "center" }}
                                              />
                                            </div>
                                            <button
                                              onMouseDown={(e) => {
                                                e.stopPropagation(); // prevent td click from firing
                                                handleSave(element.id, editing.value);
                                              }}
                                              className="btn btn-primary btn-sm ms-1"
                                            >
                                              Save
                                            </button>
                                          </div>
                                        ) : (
                                          <div className="d-flex align-items-center">
                                            <div className="flex-grow-1">
                                              <PriceComponent price={parseFloat(element.scraped_price)} />
                                            </div>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setEditing({
                                                  rowId: element.id,
                                                  value: element.scraped_price || "",
                                                });
                                              }}
                                              className="btn btn-primary shadow btn-xs sharp ms-2"
                                            >
                                              <i className="fas fa-pencil-alt"></i>
                                            </button>
                                          </div>
                                        )}
                                      </td>
                                    }
                                    {column.id == "product Code" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.product && element.product && element.product.product_code}</td>
                                    }
                                    {column.id == "website" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>{element.product && element.product.website}</td>
                                    }
                                    {column.id == "scraped Date" &&
                                      <td key={column.id} style={{ textAlign: "center" }}><DateComponent date={element.scraped_date} /></td>
                                    }
                                    {column.id == "action" &&
                                      <td key={column.id} style={{ textAlign: "center" }}>
                                        <div className="d-flex justify-content-center">
                                          <Link
                                            to={`/priceupdate/${element.id}?page=${currentPage}`}
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

      {/* Filter Canvas */}
      <Offcanvas
        show={manageFilterOffcanvas}
        onHide={setManageFilterOffcanvas}
        className="offcanvas-end customeoff"
        placement="end"
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="modal-title" id="#gridSystemModal">
            Filter Scraped Base Price{" "}
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
                  <div className="col-md-4 mt-2">
                    <label className="form-label">BUILDER NAME:</label>
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
                  <div className="col-md-4 mt-2">
                    <label className="form-label">SUBDIVISION NAME:</label>
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
                  <div className="col-md-4 mt-2">
                    <label className="form-label">PRODUCT NAME :</label>
                    {/* <Form.Group controlId="tournamentList">
                      <MultiSelect
                        name="name"
                        options={productListDropDown}
                        value={selectedProductName}
                        onChange={handleSelectProductNameChange}
                        placeholder={"Select Product Name"}
                      />
                    </Form.Group> */}
                    <input value={filterQuery.name} name="name" className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-4 mt-3">
                    <label className="form-label">PRODUCT SCRAPED PRICES :</label>
                    <input value={filterQuery.scraped_price} name="scraped_price" className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-4 mt-3">
                    <label className="form-label">PRODUCT CODE :</label>
                    <input value={filterQuery.product_code} name="product_code" className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-4 mt-3">
                    <label className="form-label">WEBSITE :</label>
                    <input value={filterQuery.website} name="website" className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-4 mt-3">
                    <label className="form-label">SCRAPED DATE :</label>
                    <DatePicker
                      name="scrapescraped_dated_date"
                      className="form-control"
                      selected={filterQuery.scraped_date ? parseDate(filterQuery.scraped_date) : null}
                      onChange={handleFilterScrapedDate}
                      dateFormat="MM/dd/yyyy"
                      placeholderText="mm/dd/yyyy"
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
          </div>
        </div>
      </Offcanvas>

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

      {/* Manage Access field */}
      <Offcanvas
        show={manageAccessOffcanvas}
        onHide={setManageAccessOffcanvas}
        className="offcanvas-end customeoff"
        placement="end"
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="modal-title" id="#gridSystemModal">
            Manage Scraped Base Price Fields Access{" "}
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

      <AccessField
        tableName={"scraped_product_prices"}
        setFieldList={setFieldList}
        manageAccessField={manageAccessField}
        setManageAccessField={setManageAccessField}
      />

    </Fragment>
  );
};

export default ScrapPriceList;
