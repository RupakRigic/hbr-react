import React, { useState, useEffect, useRef } from "react";

import AdminPermitService from "../../../API/Services/AdminService/AdminPermitService";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import PermitOffcanvas from "./PermitOffcanvas";
import MainPagetitle from "../../layouts/MainPagetitle";
import Button from "react-bootstrap/Button";
import AdminBuilderService from "../../../API/Services/AdminService/AdminBuilderService";
import Modal from "react-bootstrap/Modal";
import { Offcanvas, Form } from "react-bootstrap";
import { debounce } from "lodash";
import ClipLoader from "react-spinners/ClipLoader";

const PermitList = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [Error, setError] = useState("");
  var imageUrl = process.env.REACT_APP_Builder_IMAGE_URL;
  const [permitList, setPermitList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  // const [currentPage, setCurrentPage] = useState(1);
  // const recordsPage = 15;
  // const lastIndex = currentPage * recordsPage;
  // const firstIndex = lastIndex - recordsPage;
  // const records = permitList.slice(firstIndex, lastIndex);
  // const npage = Math.ceil(permitList.length / recordsPage);
  // const number = [...Array(npage + 1).keys()].slice(1);

  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const [selectedFileError, setSelectedFileError] = useState("");
  const navigate = useNavigate();
  const [BuilderList, setBuilderList] = useState([]);
  const [BuilderCode, setBuilderCode] = useState("");
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [PermitDetails, SetPermitDetails] = useState({
    subdivision: "",
    parcel: "",
    contractor: "",
    description: "",
    date: "",
    dateadded: "",
    lotnumber: "",
    owner: "",
    plan: "",
    sqft: "",
    value: "",
    permitnumber: "",
    address1: "",
    address2: "",
  });

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

  const permit = useRef();

  const getPermitList = async () => {
    try {
      const response = await AdminPermitService.index(searchQuery);
      const responseData = await response.json();
      setPermitList(responseData);
      setIsLoading(false);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(errorJson.message);
      }
    }
  };
  useEffect(() => {
    getPermitList();
  }, []);
  const handleDelete = async (e) => {
    try {
      let responseData = await AdminPermitService.destroy(e).json();
      if (responseData.status === true) {
        getPermitList();
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
    getPermitList();
  };
  const handleFileChange = async (e) => {
    setSelectedFile(e.target.files[0]);
  };
  const handleUploadClick = async () => {
    const file = selectedFile;
    if (BuilderCode == "select" || BuilderCode == "") {
      setSelectedFileError("Please select builder");

      return false;
    }

    if (file && file.type === "text/csv") {
      setLoading(true);
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = async () => {
        var iFile = fileReader.result;
        setSelectedFile(iFile);
        const inputData = {
          csv: iFile,
          builder_id: BuilderCode,
        };
        try {
          let responseData = await AdminPermitService.import(inputData).json();
          setSelectedFile("");
          document.getElementById("fileInput").value = null;
          setLoading(false);
          swal("Imported Sucessfully").then((willDelete) => {
            if (willDelete) {
              navigate("/permitlist");
              setBuilderCode("");
              setShow(false);
            }
          });
          getPermitList();
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

  const getbuilderlist = async () => {
    try {
      const response = await AdminBuilderService.index();
      const responseData = await response.json();
      setBuilderList(responseData);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(errorJson.message);
      }
    }
  };
  useEffect(() => {
    getbuilderlist();
  }, []);

  useEffect(() => {
    getbuilderlist();
  }, []);

  const handlBuilderClick = (e) => {
    setShow(true);
  };
  const handleModalClick = () => {
    navigate("/report-list");
  };
  const handleBuilderCode = (code) => {
    setBuilderCode(code.target.value);
  };
  const handleRowClick = async (id) => {
    try {
      let responseData = await AdminPermitService.show(id).json();
      SetPermitDetails(responseData);
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
    getPermitList();
  }, [searchQuery]);

  const HandleSearch = (e) => {
    setIsLoading(true);
    const query = e.target.value.trim();

    debouncedHandleSearch(`?q=${query}`);
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key) {
      direction = sortConfig.direction === "asc" ? "desc" : "asc";
    }
    setSortConfig({ key, direction });
  };
  const sortedData = () => {
    const sorted = [...permitList];
    if (sortConfig.key !== "") {
      sorted.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
  
        if (sortConfig.key === 'builderName') {
          aValue = (a.subdivision && a.subdivision.builder && a.subdivision.builder.name) || '';
          bValue = (b.subdivision && b.subdivision.builder && b.subdivision.builder.name) || '';
        } else if (sortConfig.key === 'subdivisionName') {
          aValue = (a.subdivision && a.subdivision.name) || '';
          bValue = (b.subdivision && b.subdivision.name) || '';
        }
  
        aValue = typeof aValue === 'string' ? aValue.toLowerCase() : aValue;
        bValue = typeof bValue === 'string' ? bValue.toLowerCase() : bValue;
  
        // Sorting logic
        if (aValue === bValue) return 0;
        return sortConfig.direction === 'asc' ? (aValue < bValue ? -1 : 1) : (aValue > bValue ? -1 : 1);
      });
    }
    return sorted;
  };
  

  return (
    <>
      <MainPagetitle mainTitle="Permit" pageTitle="Permit" parentTitle="Home" />
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-12">
            <div className="card" style={{ overflow: "auto" }}>
              <div className="card-body p-0">
                <div className="table-responsive active-projects style-1 ItemsCheckboxSec shorting">
                  <div className="tbl-caption d-flex justify-content-between text-wrap align-items-center">
                    <div className="d-flex text-nowrap justify-content-between align-items-center">
                      <h4 className="heading mb-0">Permit List</h4>
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
                      <Button
                        className="btn-sm"
                        variant="secondary"
                        onClick={handlBuilderClick}
                      >
                        Import
                      </Button>

                      <Link
                        to={"#"}
                        className="btn btn-primary btn-sm ms-1"
                        data-bs-toggle="offcanvas"
                        onClick={() => permit.current.showEmployeModal()}
                      >
                        + Add Permit
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
                            <th onClick={() => requestSort("date")}>
                              <strong>Date </strong>
                              {sortConfig.key !== "date" ? "↑↓" : ""}
                              {sortConfig.key === "date" && (
                                <span>
                                  {sortConfig.direction === "asc" ? "↑" : "↓"}
                                </span>
                              )}
                            </th>
                            <th onClick={() => requestSort("builderName")}>
                              <strong>Builder Name</strong>
                              {sortConfig.key !== "builderName" ? "↑↓" : ""}
                              {sortConfig.key === "builderName" && (
                                <span>
                                  {sortConfig.direction === "asc" ? "↑" : "↓"}
                                </span>
                              )}
                            </th>
                            <th onClick={() => requestSort("subdivisionName")}>
                              <strong>Subdivision Name</strong>
                              {sortConfig.key !== "subdivisionName" ? "↑↓" : ""}
                              {sortConfig.key === "subdivisionName" && (
                                <span>
                                  {sortConfig.direction === "asc" ? "↑" : "↓"}
                                </span>
                              )}
                            </th>
                            <th onClick={() => requestSort("address2")}>
                              <strong>Address Number</strong>
                              {sortConfig.key !== "address2" ? "↑↓" : ""}
                              {sortConfig.key === "address2" && (
                                <span>
                                  {sortConfig.direction === "asc" ? "↑" : "↓"}
                                </span>
                              )}
                            </th>
                            <th onClick={() => requestSort("address2")}>
                              <strong>Address Name</strong>
                              {sortConfig.key !== "address1" ? "↑↓" : ""}
                              {sortConfig.key === "address1" && (
                                <span>
                                  {sortConfig.direction === "asc" ? "↑" : "↓"}
                                </span>
                              )}
                            </th>
                            <th onClick={() => requestSort("address2")}>
                              <strong>Parcel Number</strong>
                              {sortConfig.key !== "parcel" ? "↑↓" : ""}
                              {sortConfig.key === "parcel" && (
                                <span>
                                  {sortConfig.direction === "asc" ? "↑" : "↓"}
                                </span>
                              )}
                            </th>
                            <th onClick={() => requestSort("contractor")}>
                              <strong>Contractor</strong>
                              {sortConfig.key !== "contractor" ? "↑↓" : ""}
                              {sortConfig.key === "contractor" && (
                                <span>
                                  {sortConfig.direction === "asc" ? "↑" : "↓"}
                                </span>
                              )}
                            </th>
                            <th onClick={() => requestSort("sqft")}>
                              <strong>Squre Footage</strong>
                              {sortConfig.key !== "sqft" ? "↑↓" : ""}
                              {sortConfig.key === "sqft" && (
                                <span>
                                  {sortConfig.direction === "asc" ? "↑" : "↓"}
                                </span>
                              )}
                            </th>
                            <th onClick={() => requestSort("owner")}>
                              <strong>Owner</strong>
                              {sortConfig.key !== "owner" ? "↑↓" : ""}
                              {sortConfig.key === "owner" && (
                                <span>
                                  {sortConfig.direction === "asc" ? "↑" : "↓"}
                                </span>
                              )}
                            </th>
                            <th onClick={() => requestSort("lotnumber")}>
                              <strong>Lot Number</strong>
                              {sortConfig.key !== "lotnumber" ? "↑↓" : ""}
                              {sortConfig.key === "lotnumber" && (
                                <span>
                                  {sortConfig.direction === "asc" ? "↑" : "↓"}
                                </span>
                              )}
                            </th>
                            <th onClick={() => requestSort("permitnumber")}>
                              <strong>Permit Number</strong>
                              {sortConfig.key !== "permitnumber" ? "↑↓" : ""}
                              {sortConfig.key === "permitnumber" && (
                                <span>
                                  {sortConfig.direction === "asc" ? "↑" : "↓"}
                                </span>
                              )}
                            </th>
                            <th onClick={() => requestSort("plan")}>
                              <strong>Plan</strong>
                              {sortConfig.key !== "plan" ? "↑↓" : ""}
                              {sortConfig.key === "plan" && (
                                <span>
                                  {sortConfig.direction === "asc" ? "↑" : "↓"}
                                </span>
                              )}
                            </th>
                            <th 
                            // onClick={() => requestSort("plan")}
                            >
                              <strong>Sub Legal Name</strong>
                              {/* {sortConfig.key !== "plan" ? "↑↓" : ""}
                              {sortConfig.key === "plan" && (
                                <span>
                                  {sortConfig.direction === "asc" ? "↑" : "↓"}
                                </span>
                              )} */}
                            </th>
                            <th onClick={() => requestSort("Value")}>
                              <strong>Value</strong>
                              {sortConfig.key !== "value" ? "↑↓" : ""}
                              {sortConfig.key === "value" && (
                                <span>
                                  {sortConfig.direction === "asc" ? "↑" : "↓"}
                                </span>
                              )}
                            </th>
                            <th onClick={() => requestSort("productType")}>
                              <strong>Product Type</strong>
                              {sortConfig.key !== "productType" ? "↑↓" : ""}
                              {sortConfig.key === "productType" && (
                                <span>
                                  {sortConfig.direction === "asc" ? "↑" : "↓"}
                                </span>
                              )}
                            </th>
                            <th onClick={() => requestSort("area")}>
                              <strong>Area</strong>
                              {sortConfig.key !== "Area" ? "↑↓" : ""}
                              {sortConfig.key === "Area" && (
                                <span>
                                  {sortConfig.direction === "asc" ? "↑" : "↓"}
                                </span>
                              )}
                            </th>
                  
                            <th onClick={() => requestSort("masterPlan")}>
                              <strong>Master Plan</strong>
                              {sortConfig.key !== "masterPlan" ? "↑↓" : ""}
                              {sortConfig.key === "masterPlan" && (
                                <span>
                                  {sortConfig.direction === "asc" ? "↑" : "↓"}
                                </span>
                              )}
                            </th>{" "}
                            <th onClick={() => requestSort("zipCode")}>
                              <strong>Zip Code</strong>
                              {sortConfig.key !== "zipCode" ? "↑↓" : ""}
                              {sortConfig.key === "zipCode" && (
                                <span>
                                  {sortConfig.direction === "asc" ? "↑" : "↓"}
                                </span>
                              )}
                            </th>{" "}
                            <th onClick={() => requestSort("lotWidth")}>
                              <strong>Lot Width</strong>
                              {sortConfig.key !== "lotWidth"
                                ? "↑↓"
                                : ""}
                              {sortConfig.key === "lotWidth" && (
                                <span>
                                  {sortConfig.direction === "asc" ? "↑" : "↓"}
                                </span>
                              )}
                            </th>
                            <th onClick={() => requestSort("lotsize")}>
                              <strong>Lot Size</strong>
                              {sortConfig.key !== "lotsize"
                                ? "↑↓"
                                : ""}
                              {sortConfig.key === "lotsize" && (
                                <span>
                                  {sortConfig.direction === "asc" ? "↑" : "↓"}
                                </span>
                              )}
                            </th>
                            <th onClick={() => requestSort("zoning")}>
                              <strong>Zoning</strong>
                              {sortConfig.key !== "zoning"
                                ? "↑↓"
                                : ""}
                              {sortConfig.key === "zoning" && (
                                <span>
                                  {sortConfig.direction === "asc" ? "↑" : "↓"}
                                </span>
                              )}
                            </th>
                            <th onClick={() => requestSort("age")}>
                              <strong>Age Restricted</strong>
                              {sortConfig.key !== "age"
                                ? "↑↓"
                                : ""}
                              {sortConfig.key === "age" && (
                                <span>
                                  {sortConfig.direction === "asc" ? "↑" : "↓"}
                                </span>
                              )}
                            </th>
                            <th onClick={() => requestSort("stories")}>
                              <strong>All Single Story</strong>
                              {sortConfig.key !== "stories"
                                ? "↑↓"
                                : ""}
                              {sortConfig.key === "stories" && (
                                <span>
                                  {sortConfig.direction === "asc" ? "↑" : "↓"}
                                </span>
                              )}
                            </th>
                            <th onClick={() => requestSort("created_at")}>
                              <strong>Date Added</strong>
                              {sortConfig.key !== "created_at"
                                ? "↑↓"
                                : ""}
                              {sortConfig.key === "created_at" && (
                                <span>
                                  {sortConfig.direction === "asc" ? "↑" : "↓"}
                                </span>
                              )}
                            </th>
                            <th onClick={() => requestSort("permitnumber ")}>
                              <strong>__pkPermitID</strong>
                              {sortConfig.key !== "permitnumber"
                                ? "↑↓"
                                : ""}
                              {sortConfig.key === "permitnumber" && (
                                <span>
                                  {sortConfig.direction === "asc" ? "↑" : "↓"}
                                </span>
                              )}
                            </th>
                            <th onClick={() => requestSort("subdivisionCode")}>
                              <strong>_fkSubID </strong>
                              {sortConfig.key !== "subdivisionCode "
                                ? "↑↓"
                                : ""}
                              {sortConfig.key === "subdivisionCode" && (
                                <span>
                                  {sortConfig.direction === "asc" ? "↑" : "↓"}
                                </span>
                              )}
                            </th>
                            <th>
                              <strong>Action</strong>
                            </th>
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
                                <td>{element.date}</td>

                                <td>
                                  {element.subdivision &&
                                    element.subdivision.builder?.name}
                                </td>
                                <td>
                                  {element.subdivision &&
                                    element.subdivision?.name}
                                </td>

                                <td>{element.address2}</td>
                                <td>{element.address1}</td>
                                <td>{element.parcel}</td>
                                <td>{element.contractor}</td>
                                <td>{element.address1}{" "}{element.address2}</td>
                                <td>{element.owner}</td>
                                <td>{element.lotnumber}</td>
                                <td>{element.permitnumber}</td>
                                <td>{element.plan === '' || element.plan ===null? 'NA' : element.plan}</td>
                                <td>
                                  {element.subdivision &&
                                    element.subdivision?.name}
                                </td>
                                <td>{element.value}</td>
                                <td>
                                  {element.subdivision &&
                                    element.subdivision?.product_type}
                                </td>
                                <td>
                                  {element.subdivision &&
                                    element.subdivision?.area}
                                </td>
                                <td>
                                  {element.subdivision &&
                                    element.subdivision?.masterplan_id}
                                </td>
                                <td>
                                  {element.subdivision &&
                                    element.subdivision?.zipcode}
                                </td>
                                <td>
                                  {element.subdivision &&
                                    element.subdivision?.lotwidth}
                                </td>
                                <td>
                                  {element.subdivision &&
                                    element.subdivision?.lotsize}
                                </td>
                                <td>
                                  {element.subdivision &&
                                    element.subdivision?.zoning}
                                </td>
                                <td>
                                  { element.subdivision && element.subdivision.age=== 1 && "Yes"}
                                  {element.subdivision && element.subdivision.age === 0 && "No"}
                                </td>
                                <td>
                                  { element.subdivision && element.subdivision.single === 1 && "Yes"}
                                  { element.subdivision && element.subdivision.single === 0 && "No"}
                                </td>

                                <td>
                                {new Date(
                                    element.created_at
                                  ).toLocaleString()}
                                </td>
                                <td>
                                  {element.permitnumber}
                                </td>
                                <td>
                                  {element.subdivision &&
                                    element.subdivision?.subdivision}
                                </td>
                                <td>
                                  <div className="d-flex justify-content-center">
                                    <Link
                                      to={`/permitupdate/${element.id}`}
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
                        {permitList.length < lastIndex
                          ? permitList.length
                          : lastIndex}{" "}
                        of {permitList.length} entries
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
      <PermitOffcanvas
        ref={permit}
        Title="Add Permit"
        parentCallback={handleCallback}
      />
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Import Permit CSV Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Select Builder:
          <Form.Select
            onChange={handleBuilderCode}
            value={BuilderCode}
            className="default-select form-control"
          >
            <option value="">Select Builder</option>
            {BuilderList.map((element) => (
              <option value={element.id}>{element.name}</option>
            ))}
          </Form.Select>
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
            Permit Details{" "}
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
                <div>
                  {PermitDetails.subdivision !== null &&
                  PermitDetails.subdivision.name !== undefined
                    ? PermitDetails.subdivision.name
                    : "NA"}
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Parcel:</label>
                <div>
                  <span className="fw-bold">
                    {PermitDetails.parcel || "NA"}
                  </span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Contractor :</label>
                <div>
                  <span className="fw-bold">
                    {PermitDetails.contractor || "NA"}
                  </span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Description:</label>
                <div>
                  <span className="fw-bold">
                    {PermitDetails.description || "NA"}
                  </span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Date:</label>
                <div>
                  <span className="fw-bold">
                    <span className="fw-bold">
                      {PermitDetails.date || "NA"}
                    </span>
                  </span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Date Added:</label>
                <div>
                  <span className="fw-bold">
                    {PermitDetails.dateadded || "NA"}
                  </span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Lot Number:</label>
                <div>
                  <span className="fw-bold">
                    {PermitDetails.lotnumber || "NA"}
                  </span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Owner:</label>
                <div>
                  <span className="fw-bold">{PermitDetails.owner || "NA"}</span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Plan :</label>
                <div>
                  <span className="fw-bold">{PermitDetails.plan || "NA"}</span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">SQFT:</label>
                <div>
                  <span className="fw-bold">{PermitDetails.sqft || "NA"}</span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Value:</label>
                <div>
                  <span className="fw-bold">{PermitDetails.value || "NA"}</span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Permit Number:</label>
                <div>
                  <span className="fw-bold">
                    {PermitDetails.permitnumber || "NA"}
                  </span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Address 1:</label>
                <div>
                  <span className="fw-bold">
                    {PermitDetails.address1 || "NA"}
                  </span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Address 2:</label>
                <div>
                  <span className="fw-bold">
                    {PermitDetails.address2 || "NA"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Offcanvas>
    </>
  );
};

export default PermitList;
