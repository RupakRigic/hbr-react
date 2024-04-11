import React, { useState, useEffect, useRef } from "react";

import AdminPriceService from "../../../API/Services/AdminService/AdminPriceService";
import PriceComponent from "../../components/Price/PriceComponent";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import PriceOffcanvas from "./PriceOffcanvas";
import MainPagetitle from "../../layouts/MainPagetitle";
import Button from "react-bootstrap/Button";
import { Offcanvas, Form } from "react-bootstrap";
import { debounce } from "lodash";
import ClipLoader from "react-spinners/ClipLoader";
import DateComponent from "../../components/date/DateFormat";
import AccessField from "../../components/AccssFieldComponent/AccessFiled";
import axios from "axios";

const PriceList = () => {
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
  const [manageAccessOffcanvas, setManageAccessOffcanvas] = useState(false);
  const [accessList, setAccessList] = useState({});
  const [accessRole, setAccessRole] = useState("Admin");
  const [accessForm, setAccessForm] = useState({});
  const [role, setRole] = useState("Admin");
  const [checkedItems, setCheckedItems] = useState({}); // State to manage checked items
  const fieldList = AccessField({ tableName: "prices" });

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
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  // function prePage() {
  //   if (currentPage !== 1) {
  //     setCurrentPage(currentPage - 1);
  //   }
  // }
  // function changeCPage(id) {
  //   setCurrentPage(id);
  // }
  // function nextPage() {
  //   if (currentPage !== npage) {
  //     setCurrentPage(currentPage + 1);
  //   }
  // }

  const product = useRef();

  const getpriceList = async () => {
    try {
      const response = await AdminPriceService.index(searchQuery);
      const responseData = await response.json();
      setPriceList(responseData);
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
      getpriceList();
    } else {
      navigate("/");
    }
  }, []);
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
  const handleCallback = () => {
    // Update the name in the component's state
    getpriceList();
  };
  const handleFileChange = async (event) => {
    const file = event.target.files[0];

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
        try {
          let responseData = await AdminPriceService.import(inputData).json();
          setSelectedFile("");
          document.getElementById("fileInput").value = null;
          setLoading(false);
          swal("Imported Sucessfully").then((willDelete) => {
            if (willDelete) {
              navigate("/priceList");
            }
          });
          getpriceList();
        } catch (error) {
          console.log(error);
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

  const handleUploadClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleRowClick = async (id) => {
    try {
      let responseData = await AdminPriceService.show(id).json();
      setPriceDetails(responseData);
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

  useEffect(() => {
    getpriceList();
  }, [searchQuery]);

  const HandleSearch = (e) => {
    setIsLoading(true);
    const query = e.target.value.trim();
    if (query) {
      debouncedHandleSearch(`?q=${query}`);
    } else {
      setSearchQuery("");
    }
  };
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key) {
      direction = sortConfig.direction === "asc" ? "desc" : "asc";
    }
    setSortConfig({ key, direction });
  };
  const sortedData = () => {
    const sorted = [...priceList];
    if (sortConfig.key !== "") {
      sorted.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (aValue === null || bValue === null) {
          aValue = aValue || "";
          bValue = bValue || "";
        }
        if (typeof aValue === "string") {
          aValue = aValue.toLowerCase();
        }
        if (typeof bValue === "string") {
          bValue = bValue.toLowerCase();
        }

        if (sortConfig.key === "productName" && a.product && b.product) {
          aValue = String(a.product.name).toLowerCase();
          bValue = String(b.product.name).toLowerCase();
        }

        if (sortConfig.key === "productCode" && a.product && b.product) {
          aValue = String(a.product.product_code).toLowerCase();
          bValue = String(b.product.product_code).toLowerCase();
        }
        if (
          sortConfig.key === "builderName" &&
          a.product.subdivision.builder &&
          b.product.subdivision.builder
        ) {
          aValue = String(a.product.subdivision.builder.name).toLowerCase();
          bValue = String(b.product.subdivision.builder.name).toLowerCase();
        }
        if (sortConfig.key === "sqft" && a.product.sqft && b.product.sqft) {
          aValue = String(a.product.sqft).toLowerCase();
          bValue = String(b.product.sqft).toLowerCase();
        }
        if (
          sortConfig.key === "stories" &&
          a.product.stories &&
          b.product.stories
        ) {
          aValue = String(a.product.stories).toLowerCase();
          bValue = String(b.product.stories).toLowerCase();
        }
        if (
          sortConfig.key === "garage" &&
          a.product.garage &&
          b.product.garage
        ) {
          aValue = String(a.product.garage).toLowerCase();
          bValue = String(b.product.garage).toLowerCase();
        }
        if (
          sortConfig.key === "bathroom" &&
          a.product.bathroom &&
          b.product.bathroom
        ) {
          aValue = String(a.product.bathroom).toLowerCase();
          bValue = String(b.product.bathroom).toLowerCase();
        }
        if (
          sortConfig.key === "perSQFT" &&
          a.product.recentpricesqft &&
          b.product.recentpricesqft
        ) {
          aValue = String(a.product.recentpricesqft).toLowerCase();
          bValue = String(b.product.recentpricesqft).toLowerCase();
        }
        if (
          sortConfig.key === "productType" &&
          a.product.subdivision.product_type &&
          b.product.subdivision.product_type
        ) {
          aValue = String(a.product.subdivision.product_type).toLowerCase();
          bValue = String(b.product.subdivision.product_type).toLowerCase();
        }
        if (
          sortConfig.key === "area" &&
          a.product.subdivision.area &&
          b.product.subdivision.area
        ) {
          aValue = String(a.product.subdivision.area).toLowerCase();
          bValue = String(b.product.subdivision.area).toLowerCase();
        }
        if (
          sortConfig.key === "bedroom" &&
          a.product.bedroom &&
          b.product.bedroom
        ) {
          aValue = String(a.product.bedroom).toLowerCase();
          bValue = String(b.product.bedroom).toLowerCase();
        }

        if (
          sortConfig.key === "lotWidth" &&
          a.product.subdivision.lotwidth &&
          b.product.subdivision.lotwidth
        ) {
          aValue = String(a.product.subdivision.lotwidth).toLowerCase();
          bValue = String(b.product.subdivision.lotwidth).toLowerCase();
        }
        if (
          sortConfig.key === "lotsize" &&
          a.product.subdivision.lotsize &&
          b.product.subdivision.lotsize
        ) {
          aValue = String(a.product.subdivision.lotsize).toLowerCase();
          bValue = String(b.product.subdivision.lotsize).toLowerCase();
        }
        if (
          sortConfig.key === "zoning" &&
          a.product.subdivision.zoning &&
          b.product.subdivision.zoning
        ) {
          aValue = String(a.product.subdivision.zoning).toLowerCase();
          bValue = String(b.product.subdivision.zoning).toLowerCase();
        }
        if (
          sortConfig.key === "ageRestricted" &&
          a.product.subdivision.age &&
          b.product.subdivision.age
        ) {
          aValue = String(a.product.subdivision.age).toLowerCase();
          bValue = String(b.product.subdivision.age).toLowerCase();
        }
        if (
          sortConfig.key === "stories" &&
          a.product.subdivision.stories &&
          b.product.subdivision.stories
        ) {
          aValue = String(a.product.subdivision.stories).toLowerCase();
          bValue = String(b.product.subdivision.stories).toLowerCase();
        }
        if (
          sortConfig.key === "_fkProductID" &&
          a.product.product_code &&
          b.product.product_code
        ) {
          aValue = String(a.product.product_code).toLowerCase();
          bValue = String(b.product.product_code).toLowerCase();
        }
        if (
          sortConfig.key === "subdivisionName" &&
          a.product.subdivision &&
          b.product.subdivision
        ) {
          aValue = String(a.product.subdivision.name).toLowerCase();
          bValue = String(b.product.subdivision.name).toLowerCase();
        }
        if (typeof aValue === "number" && typeof bValue === "number") {
          if (sortConfig.direction === "asc") {
            return aValue - bValue;
          } else {
            return bValue - aValue;
          }
        } else {
          if (sortConfig.direction === "asc") {
            return aValue.localeCompare(bValue);
          } else {
            return bValue.localeCompare(aValue);
          }
        }
      });
    }
    return sorted;
  };

  const exportToExcelData = async () => {
    try {
        const bearerToken = JSON.parse(localStorage.getItem('usertoken'));
        const response = await axios.get(
          // 'http://127.0.0.1:8000/api/admin/price/export'
          'https://hbrapi.rigicgspl.com/api/admin/price/export'
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
                  <div className="tbl-caption d-flex justify-content-between text-wrap align-items-center">
                    <div className="d-flex text-nowrap justify-content-between align-items-center">
                      <h4 className="heading mb-0">Base Price List</h4>
                      <div
                        class="btn-group mx-5"
                        role="group"
                        aria-label="Basic example"
                      >
                        <button class="btn btn-secondary cursor-none">
                          {" "}
                          <i class="fas fa-search"></i>{" "}
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
                    <div>
                    <button onClick={exportToExcelData} className="btn btn-primary btn-sm me-1"> <i class="fas fa-file-excel"></i></button>
                      <button
                        className="btn btn-primary btn-sm me-1"
                        onClick={() => setManageAccessOffcanvas(true)}
                      >
                        {" "}
                        Field Access
                      </button>
                      <Button
                        className="btn-sm"
                        variant="secondary"
                        onClick={handleUploadClick}
                        disabled={loading}
                      >
                        {loading ? "Loading.." : "Import"}
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
                              <strong>No.</strong>
                            </th>
                            {checkFieldExist("Date") && (
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
                            )}{" "}
                            {checkFieldExist("Builder Name") && (
                              <th onClick={() => requestSort("builderName")}>
                                Builder Name
                                {sortConfig.key !== "builderName" ? "↑↓" : ""}
                                {sortConfig.key === "builderName" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("Subdivision Name") && (
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
                            )}{" "}
                            {checkFieldExist("Product Name") && (
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
                            )}{" "}
                            {checkFieldExist("Squre Footage") && (
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
                            )}{" "}
                            {checkFieldExist("Stories") && (
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
                            )}{" "}
                            {checkFieldExist("Bedrooms") && (
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
                            )}{" "}
                            {checkFieldExist("Bathroom") && (
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
                            )}{" "}
                            {checkFieldExist("Garage") && (
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
                            )}{" "}
                            {checkFieldExist("Base Price") && (
                              <th onClick={() => requestSort("baseprice")}>
                                <strong>Base Price</strong>
                                {sortConfig.key !== "baseprice" ? "↑↓" : ""}
                                {sortConfig.key === "baseprice" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "}
                            {checkFieldExist("Price Per SQFT") && (
                              <th onClick={() => requestSort("perSQFT")}>
                                <strong>Price Per SQFT</strong>
                                {sortConfig.key !== "perSQFT" ? "↑↓" : ""}
                                {sortConfig.key === "perSQFT" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "}
                            {checkFieldExist("Product Type") && (
                              <th onClick={() => requestSort("productType")}>
                                <strong>Product Type</strong>
                                {sortConfig.key !== "productType" ? "↑↓" : ""}
                                {sortConfig.key === "productType" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "}
                            {checkFieldExist("Area") && (
                              <th onClick={() => requestSort("area")}>
                                <strong>Area</strong>
                                {sortConfig.key !== "area" ? "↑↓" : ""}
                                {sortConfig.key === "area" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "}
                            {checkFieldExist("Master Plan") && (
                              <th
                              // onClick={() => requestSort("masterplan_id")}
                              >
                                <strong>Master Plan</strong>
                                {/* {sortConfig.key !== "masterplan_id" ? "↑↓" : ""}
                              {sortConfig.key === "masterplan_id" && (
                                <span>
                                  {sortConfig.direction === "asc" ? "↑" : "↓"}
                                </span>
                              )} */}
                              </th>
                            )}{" "}
                            {checkFieldExist("Zip Code") && (
                              <th
                              //  onClick={() => requestSort("zipcode")}
                              >
                                <strong>Zip Code</strong>
                                {/* {sortConfig.key !== "zipcode"
                                  ? "↑↓"
                                  : ""}
                                {sortConfig.key === "zipcode" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )} */}
                              </th>
                            )}{" "}
                            {checkFieldExist("Lot Width") && (
                              <th onClick={() => requestSort("lotWidth")}>
                                <strong>Lot Width</strong>
                                {sortConfig.key !== "lotWidth" ? "↑↓" : ""}
                                {sortConfig.key === "lotWidth" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "}
                            {checkFieldExist("Lot Size") && (
                              <th onClick={() => requestSort("lotsize")}>
                                <strong>Lot Size</strong>
                                {sortConfig.key !== "lotsize" ? "↑↓" : ""}
                                {sortConfig.key === "lotsize" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "}
                            {checkFieldExist("Zoning") && (
                              <th onClick={() => requestSort("zoning")}>
                                <strong>Zoning</strong>
                                {sortConfig.key !== "zoning" ? "↑↓" : ""}
                                {sortConfig.key === "zoning" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "}
                            {checkFieldExist("Age Restricted") && (
                              <th
                              // onClick={() => requestSort("ageRestricted")}
                              >
                                <strong>Age Restricted</strong>
                                {/* {sortConfig.key !== "ageRestricted"
                                ? "↑↓"
                                : ""}
                              {sortConfig.key === "ageRestricted" && (
                                <span>
                                  {sortConfig.direction === "asc" ? "↑" : "↓"}
                                </span>
                              )} */}
                              </th>
                            )}{" "}
                            {checkFieldExist("All Single Story") && (
                              <th onClick={() => requestSort("stories")}>
                                <strong>All Single Story</strong>
                                {sortConfig.key !== "stories" ? "↑↓" : ""}
                                {sortConfig.key === "stories" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "}
                            {checkFieldExist("__pkPriceID") && (
                              <th onClick={() => requestSort("id")}>
                                <strong>__pkPriceID </strong>
                                {sortConfig.key !== "id" ? "↑↓" : ""}
                                {sortConfig.key === "id" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "}
                            {checkFieldExist("_fkProductID") && (
                              <th onClick={() => requestSort("_fkProductID")}>
                                <strong>_fkProductID </strong>
                                {sortConfig.key !== "_fkProductID" ? "↑↓" : ""}
                                {sortConfig.key === "_fkProductID" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}
                            {checkFieldExist("Action") && <th>Action</th>}
                          </tr>
                        </thead>
                        <tbody style={{ textAlign: "center" }}>
                          {sortedData() !== null && sortedData().length > 0 ? (
                            sortedData().map((element, index) => (
                              <tr
                                onClick={() => handleRowClick(element.id)}
                                key={element.id}
                                style={{
                                  textAlign: "center",
                                  cursor: "pointer",
                                }}
                              >
                                <td>{index + 1}</td>
                                {checkFieldExist("Date") && (
                                  <td>
                                    <DateComponent date={element.created_at} />
                                  </td>
                                )}{" "}
                                {checkFieldExist("Builder Name") && (
                                  <td>
                                    {element.product.subdivision &&
                                      element.product.subdivision.builder?.name}
                                  </td>
                                )}{" "}
                                {checkFieldExist("Subdivision Name") && (
                                  <td>
                                    {element.product.subdivision &&
                                      element.product.subdivision?.name}
                                  </td>
                                )}{" "}
                                {checkFieldExist("Product Name") && (
                                  <td>{element.product.name}</td>
                                )}{" "}
                                {checkFieldExist("Squre Footage") && (
                                  <td>{element.product.sqft}</td>
                                )}{" "}
                                {checkFieldExist("Stories") && (
                                  <td>{element.product.stories}</td>
                                )}{" "}
                                {checkFieldExist("Bedrooms") && (
                                  <td>{element.product.bedroom}</td>
                                )}{" "}
                                {checkFieldExist("Bathroom") && (
                                  <td>{element.product.bathroom}</td>
                                )}{" "}
                                {checkFieldExist("Garage") && (
                                  <td>{element.product.garage}</td>
                                )}{" "}
                                {checkFieldExist("Base Price") && (
                                  <td>
                                    <PriceComponent price={element.baseprice} />
                                  </td>
                                )}{" "}
                                {checkFieldExist("Price Per SQFT") && (
                                  <td>
                                    <PriceComponent
                                      price={element.product.recentpricesqft}
                                    />
                                  </td>
                                )}{" "}
                                {checkFieldExist("Product Type") && (
                                  <td>
                                    {element.product.subdivision.product_type}
                                  </td>
                                )}{" "}
                                {checkFieldExist("Area") && (
                                  <td>{element.product.subdivision.area}</td>
                                )}{" "}
                                {checkFieldExist("Master Plan") && (
                                  <td>
                                    {element.product.subdivision.masterplan_id}
                                  </td>
                                )}{" "}
                                {checkFieldExist("Zip Code") && (
                                  <td>{element.product.subdivision.zipcode}</td>
                                )}{" "}
                                {checkFieldExist("Lot Width") && (
                                  <td>
                                    {element.product.subdivision.lotwidth}
                                  </td>
                                )}{" "}
                                {checkFieldExist("Lot Size") && (
                                  <td>{element.product.subdivision.lotsize}</td>
                                )}{" "}
                                {checkFieldExist("Zoning") && (
                                  <td>{element.product.subdivision.zoning}</td>
                                )}{" "}
                                {checkFieldExist("Age Restricted") && (
                                  <td>
                                    {element.product.subdivision.age == 1
                                      ? "Yes"
                                      : "No"}
                                  </td>
                                )}{" "}
                                {checkFieldExist("All Single Story") && (
                                  <td>
                                    {element.product.subdivision.single == 1
                                      ? "Yes"
                                      : "No"}
                                  </td>
                                )}{" "}
                                {checkFieldExist("__pkPriceID") && (
                                  <td>{element.id}</td>
                                )}{" "}
                                {checkFieldExist("_fkProductID") && (
                                  <td>{element.product.product_code}</td>
                                )}{" "}
                                {checkFieldExist("Action") && (
                                  <td>
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
                                )}
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
                    {/* <div className="d-sm-flex text-center justify-content-between align-items-center">
                      <div className="dataTables_info">
                        Showing {lastIndex - recordsPage + 1} to{" "}
                        {priceList.length < lastIndex
                          ? priceList.length
                          : lastIndex}{" "}
                        of {priceList.length} entries
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
                          {number.map((n, i) => (
                            <Link
                              className={`paginate_button ${
                                currentPage === n ? "current" : ""
                              } `}
                              key={i}
                              onClick={() => changeCPage(n)}
                            >
                              {n}
                            </Link>
                          ))}
                        </span>
                        <Link
                          className="paginate_button next"
                          to="#"
                          onClick={nextPage}
                        >
                          <i className="fa-solid fa-angle-right" />
                        </Link>
                      </div>
                    </div> */}
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
            onClick={() => setShowOffcanvas(false)}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="offcanvas-body">
          <div className="container-fluid">
            <div className="row">
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
    </>
  );
};

export default PriceList;
