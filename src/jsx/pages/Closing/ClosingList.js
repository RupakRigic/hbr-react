import React, { useState, useEffect, useRef } from "react";

import AdminClosingService from "../../../API/Services/AdminService/AdminClosingService";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import ClosingOffcanvas from "./ClosingOffcanvas";
import MainPagetitle from "../../layouts/MainPagetitle";
import Button from "react-bootstrap/Button";
import { Offcanvas, Form } from "react-bootstrap";
import { debounce } from "lodash";
import ClipLoader from "react-spinners/ClipLoader";
import PermitList from "../Permit/PermitList";
import PriceComponent from "../../components/Price/PriceComponent";
import DateComponent from "../../components/date/DateFormat";
import AccessField from "../../components/AccssFieldComponent/AccessFiled";
import axios from "axios";
import Modal from "react-bootstrap/Modal";

const ClosingList = () => {
  const [Error, setError] = useState("");

  const [ClosingList, setClosingList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  // const recordsPage = 20;
  // const lastIndex = currentPage * recordsPage;
  // const firstIndex = lastIndex - recordsPage;
  // const records = ClosingList.slice(firstIndex, lastIndex);
  // const npage = Math.ceil(ClosingList.length / recordsPage);
  // const number = [...Array(npage + 1).keys()].slice(1);
  const [selectedFileError, setSelectedFileError] = useState("");
  const [show, setShow] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const [loading, setLoading] = useState(false);
  const handleClose = () => setShow(false);
  const navigate = useNavigate();
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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
      table: "closing",
    };
    try {
      const data = await AdminClosingService.manageAccessFields(
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

  const closingsale = useRef();

  const getClosingList = async () => {
    try {
      const response = await AdminClosingService.index(searchQuery);
      const responseData = await response.json();
      setClosingList(responseData);
      setIsLoading(false);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(errorJson.message);
      }
    }
  };
  useEffect(() => {
    getClosingList();
  }, []);
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
          setLoading(false);
          swal("Imported Sucessfully").then((willDelete) => {
            if (willDelete) {
              navigate("/subdivisionlist");
              setShow(false);
            }
          });
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
    try {
      let responseData = await AdminClosingService.show(id).json();
      setClosingDetails(responseData);
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
    getClosingList();
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
    const sorted = [...ClosingList];
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
        if (
          sortConfig.key === "builderName" &&
          a.subdivision.builder.name &&
          b.subdivision.builder.name
        ) {
          aValue = String(a.subdivision.builder.name).toLowerCase();
          bValue = String(b.subdivision.builder.name).toLowerCase();
        }

        if (
          sortConfig.key === "subdivisionName" &&
          a.subdivision &&
          b.subdivision
        ) {
          aValue = String(a.subdivision.name).toLowerCase();
          bValue = String(b.subdivision.name).toLowerCase();
        }
        if (
          sortConfig.key === "productType" &&
          a.subdivision &&
          b.subdivision
        ) {
          aValue = String(a.subdivision.product_type).toLowerCase();
          bValue = String(b.subdivision.product_type).toLowerCase();
        }
        if (sortConfig.key === "area" && a.subdivision && b.subdivision) {
          aValue = String(a.subdivision.area).toLowerCase();
          bValue = String(b.subdivision.area).toLowerCase();
        }
        if (sortConfig.key === "masterPlan" && a.subdivision && b.subdivision) {
          aValue = String(a.subdivision.masterplan_id).toLowerCase();
          bValue = String(b.subdivision.masterplan_id).toLowerCase();
        }
        if (sortConfig.key === "zipCode" && a.subdivision && b.subdivision) {
          aValue = String(a.subdivision.zipcode).toLowerCase();
          bValue = String(b.subdivision.zipcode).toLowerCase();
        }
        if (sortConfig.key === "lotWidth" && a.subdivision && b.subdivision) {
          aValue = String(a.subdivision.lotwidth).toLowerCase();
          bValue = String(b.subdivision.lotwidth).toLowerCase();
        }
        if (sortConfig.key === "lotsize" && a.subdivision && b.subdivision) {
          aValue = String(a.subdivision.lotsize).toLowerCase();
          bValue = String(b.subdivision.lotsize).toLowerCase();
        }
        if (sortConfig.key === "zoning" && a.subdivision && b.subdivision) {
          aValue = String(a.subdivision.zoning).toLowerCase();
          bValue = String(b.subdivision.zoning).toLowerCase();
        }
        if (sortConfig.key === "age" && a.subdivision && b.subdivision) {
          aValue = String(a.subdivision.age).toLowerCase();
          bValue = String(b.subdivision.age).toLowerCase();
        }
        if (
          sortConfig.key === "subdivisionCode" &&
          a.subdivision &&
          b.subdivision
        ) {
          aValue = String(a.subdivision.subdivision_code).toLowerCase();
          bValue = String(b.subdivision.subdivision_code).toLowerCase();
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
          `${process.env.REACT_APP_IMAGE_URL}api/admin/closing/export`
          // 'https://hbrapi.rigicgspl.com/api/admin/closing/export'

          ,
           {
            responseType: 'blob',
            headers: {
                'Authorization': `Bearer ${bearerToken}`
            }
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'closings.xlsx');
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
                  <div className="tbl-caption d-flex justify-content-between text-wrap align-items-center">
                    <div className="d-flex text-nowrap justify-content-between align-items-center">
                      <h4 className="heading mb-0">Closing List</h4>
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
                            <th>No.</th>
                            {checkFieldExist("Closing Type") && (
                              <th>Closing Type</th>
                            )}{" "}
                            {checkFieldExist("Closing Date") && (
                              <th onClick={() => requestSort("closingdate")}>
                                Closing Date
                                {sortConfig.key !== "closingdate" ? "↑↓" : ""}
                                {sortConfig.key === "closingdate" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "}
                            {checkFieldExist("Doc") && (
                              <th onClick={() => requestSort("document")}>
                                Doc
                                {sortConfig.key !== "document" ? "↑↓" : ""}
                                {sortConfig.key === "document" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
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
                            )}{" "}
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
                            {checkFieldExist("Closing Price") && (
                              <th onClick={() => requestSort("closingprice")}>
                                Closing Price
                                {sortConfig.key !== "closingprice" ? "↑↓" : ""}
                                {sortConfig.key === "closingprice" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "}
                            {checkFieldExist("Address") && (
                              <th onClick={() => requestSort("address")}>
                                Address
                                {sortConfig.key !== "address" ? "↑↓" : ""}
                                {sortConfig.key === "address" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "}
                            {checkFieldExist("Parcel Number") && <th>Parcel Number</th>}
                            {checkFieldExist("Sub Legal Name") && (
                              <th
                                onClick={() => requestSort("subdivisionName")}
                              >
                                Sub Legal Name
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
                            {checkFieldExist("Seller Legal Name") && (
                              <th onClick={() => requestSort("sellerleagal")}>
                                Seller Legal Name
                                {sortConfig.key !== "sellerleagal" ? "↑↓" : ""}
                                {sortConfig.key === "sellerleagal" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "}
                            {checkFieldExist("Buyer Name") && (
                              <th onClick={() => requestSort("buyer")}>
                                Buyer Name
                                {sortConfig.key !== "buyer" ? "↑↓" : ""}
                                {sortConfig.key === "buyer" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "}
                            {checkFieldExist("Lender") && (
                              <th>
                                Lender
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
                            {checkFieldExist("Loan Amount") && (
                              <th onClick={() => requestSort("loanamount")}>
                                Loan Amount
                                {sortConfig.key !== "loanamount" ? "↑↓" : ""}
                                {sortConfig.key === "loanamount" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}
                              </th>
                            )}{" "}
                            {checkFieldExist("Type") && (
                              <th>
                                Type
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
                            {checkFieldExist("Product Type") && (
                              <th>
                                Product Type{" "}
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
                            {checkFieldExist("Area") && (
                              <th>
                                Area
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
                            {checkFieldExist("Master Plan") && (
                              <th>
                                Master Plan
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
                            {checkFieldExist("Zip Code") && (
                              <th>
                                Zip Code{" "}
                                {sortConfig.key !== "subdivisionName"
                                  ? "↑↓"
                                  : ""}
                                {sortConfig.key === "subdivisionName" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}{" "}
                              </th>
                            )}{" "}
                            {checkFieldExist("Lot Width") && (
                              <th>
                                Lot Width{" "}
                                {sortConfig.key !== "subdivisionName"
                                  ? "↑↓"
                                  : ""}
                                {sortConfig.key === "subdivisionName" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}{" "}
                              </th>
                            )}{" "}
                            {checkFieldExist("Lot Size") && (
                              <th>
                                Lot Size{" "}
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
                            {checkFieldExist("Zoning") && (
                              <th>
                                Zoning{" "}
                                {sortConfig.key !== "subdivisionName"
                                  ? "↑↓"
                                  : ""}
                                {sortConfig.key === "subdivisionName" && (
                                  <span>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                  </span>
                                )}{" "}
                              </th>
                            )}{" "}
                            {checkFieldExist("Age Restricted") && (
                              <th>
                                Age Restricted{" "}
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
                            {checkFieldExist("All Single Story") && (
                              <th>
                                All Single Story{" "}
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
                            {checkFieldExist("Date Added") && (
                              <th>
                                Date Added{" "}
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
                            {checkFieldExist("__pkRecordID") && (
                              <th>
                                __pkRecordID
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
                            {checkFieldExist("_fkSubID") && (
                              <th>
                                _fkSubID
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
                                {checkFieldExist("Closing Type") && <td>{element.closing_type}</td>}{" "}
                                {checkFieldExist("Closing Date") && (
                                  <td>
                                    <DateComponent date={element.closingdate} />
                                  </td>
                                )}{" "}
                                {checkFieldExist("Doc") && (
                                  <td>{element.document}</td>
                                )}{" "}
                                {checkFieldExist("Builder Name") && (
                                  <td>
                                    {element.subdivision &&
                                      element.subdivision.builder?.name}
                                  </td>
                                )}{" "}
                                {checkFieldExist("Subdivision Name") && (
                                  <td>
                                    {element.subdivision &&
                                      element.subdivision?.name}
                                  </td>
                                )}{" "}
                                {checkFieldExist("Closing Price") && (
                                  <td>
                                    {" "}
                                    <PriceComponent
                                      price={element.closingprice}
                                    />
                                  </td>
                                )}{" "}
                                {checkFieldExist("Address") && (
                                  <td>{element.address}</td>
                                )}{" "}
                                {checkFieldExist("Parcel Number") && (
                                  <td>{element.parcel}</td>
                                )}{" "}
                                {checkFieldExist("Sub Legal Name") && (
                                  <td>
                                    {element.sublegal_name}
                                  </td>
                                )}{" "}
                                {checkFieldExist("Seller Legal Name") && (
                                  <td>{element.sellerleagal}</td>
                                )}{" "}
                                {checkFieldExist("Buyer Name") && (
                                  <td>{element.buyer}</td>
                                )}{" "}
                                {checkFieldExist("Lender") && (
                                  <td>{element.lender}</td>
                                )}{" "}
                                {checkFieldExist("Loan Amount") && (
                                  <td>{element.loanamount}</td>
                                )}{" "}
                                {checkFieldExist("Type") && <td>NA</td>}{" "}
                                {checkFieldExist("Product Type") && (
                                  <td>{element.subdivision.product_type}</td>
                                )}{" "}
                                {checkFieldExist("Area") && (
                                  <td>{element.subdivision.area}</td>
                                )}{" "}
                                {checkFieldExist("Master Plan") && (
                                  <td>{element.subdivision.masterplan_id}</td>
                                )}{" "}
                                {checkFieldExist("Zip Code") && (
                                  <td>{element.subdivision.zipcode}</td>
                                )}{" "}
                                {checkFieldExist("Lot Width") && (
                                  <td>{element.subdivision.lotwidth}</td>
                                )}{" "}
                                {checkFieldExist("Lot Size") && (
                                  <td>{element.subdivision.lotsize}</td>
                                )}{" "}
                                {checkFieldExist("Zoning") && (
                                  <td>{element.subdivision.zoning}</td>
                                )}{" "}
                                {checkFieldExist("Age Restricted") && (
                                  <td>
                                    {element.subdivision.age == "1"
                                      ? "Yes"
                                      : "No"}
                                  </td>
                                )}{" "}
                                {checkFieldExist("All Single Story") && (
                                  <td>
                                    {element.subdivision.single == "1"
                                      ? "Yes"
                                      : "No"}
                                  </td>
                                )}{" "}
                                {checkFieldExist("Date Added") && (
                                  <td>
                                    <DateComponent date={element.created_at} />
                                  </td>
                                )}{" "}
                                {checkFieldExist("__pkRecordID") && (
                                  <td>{element.id}</td>
                                )}{" "}
                                {checkFieldExist("_fkSubID") && (
                                  <td>
                                    {element.subdivision.subdivision_code}
                                  </td>
                                )}{" "}
                                {checkFieldExist("Action") && (
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
                        {ClosingList.length < lastIndex
                          ? ClosingList.length
                          : lastIndex}{" "}
                        of {ClosingList.length} entries
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
      <ClosingOffcanvas
        ref={closingsale}
        Title="Add Closing"
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
            Closing Details{" "}
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
                <label className="">Subdivision :</label>
                <div className="fw-bolder">
                  {ClosingDetails.subdivision !== null &&
                  ClosingDetails.subdivision.name !== undefined
                    ? ClosingDetails.subdivision.name
                    : "NA"}
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Seller Leagal :</label>
                <div>
                  <span className="fw-bold">
                    {ClosingDetails.sellerleagal || "NA"}
                  </span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Address :</label>
                <div>
                  <span className="fw-bold">
                    {ClosingDetails.address || "NA"}
                  </span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Buyer :</label>
                <div>
                  <span className="fw-bold">
                    {ClosingDetails.buyer || "NA"}
                  </span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Lender :</label>
                <div>
                  <span className="fw-bold">
                    {ClosingDetails.lender || "NA"}
                  </span>
                </div>
              </div>
              <div className="col-xl-4 mt-4">
                <label className="">Closing Date :</label>
                <div>
                  <span className="fw-bold">
                    {<DateComponent date={ClosingDetails.closingdate} /> ||
                      "NA"}
                  </span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Closing Price :</label>
                <div>
                  <span className="fw-bold">
                    {<PriceComponent price={ClosingDetails.closingprice} /> ||
                      "NA"}
                  </span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Loan Amount :</label>
                <div>
                  <span className="fw-bold">
                    {ClosingDetails.loanamount || "NA"}
                  </span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Document :</label>
                <div>
                  <span className="fw-bold">
                    {ClosingDetails.document || "NA"}
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

export default ClosingList;
