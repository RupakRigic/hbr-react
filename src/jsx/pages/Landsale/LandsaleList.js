import React, { useState, useEffect, useRef } from "react";

import AdminLandsaleService from "../../../API/Services/AdminService/AdminLandsaleService";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import LandsaleOffcanvas from "./LandsaleOffcanvas";
import MainPagetitle from "../../layouts/MainPagetitle";
import Button from "react-bootstrap/Button";
import AdminBuilderService from "../../../API/Services/AdminService/AdminBuilderService";
import Modal from "react-bootstrap/Modal";
import { Offcanvas, Form } from "react-bootstrap";
import AdminSubdevisionService from "../../../API/Services/AdminService/AdminSubdevisionService";
import { debounce } from "lodash";
import ClipLoader from "react-spinners/ClipLoader";

const LandsaleList = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [Error, setError] = useState("");
  const navigate = useNavigate();
  const [LandsaleList, setLandsaleList] = useState([]);
  // const [currentPage, setCurrentPage] = useState(1);
  // const recordsPage = 20;
  // const lastIndex = currentPage * recordsPage;
  // const firstIndex = lastIndex - recordsPage;
  // const records = LandsaleList.slice(firstIndex, lastIndex);
  // const npage = Math.ceil(LandsaleList.length / recordsPage);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const [selectedFileError, setSelectedFileError] = useState("");
  const [BuilderList, setBuilderList] = useState([]);
  const [BuilderCode, setBuilderCode] = useState("");
  const [SubdivisionList, setSubdivisionList] = useState([]);
  const [SubdivisionCode, setSubdivisionCode] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  // const number = [...Array(npage + 1).keys()].slice(1);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [landSaleDetails, setLandSaleDetails] = useState({
    seller: "",
    buyer: "",
    location: "",
    date: "",
    parcel: "",
    price: "",
    typeofunit: "",
    priceperunit: "",
    noofunit: "",
    notes: "",
    doc: "",
    zoning: "",
    lat: "",
    lng: "",
    area: "",
    zip: "",
    subdivision: "",
  });

  const [isLoading, setIsLoading] = useState(true);

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

  const landsale = useRef();

  const getLandsaleList = async () => {
    try {
      const response = await AdminLandsaleService.index(searchQuery);
      const responseData = await response.json();
      setLandsaleList(responseData);
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
      getLandsaleList();
    } else {
      navigate("/");
    }
  }, []);
  const handleDelete = async (e) => {
    try {
      let responseData = await AdminLandsaleService.destroy(e).json();
      if (responseData.status === true) {
        getLandsaleList();
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
    getLandsaleList();
  };

  const handleFileChange = async (e) => {
    setSelectedFile(e.target.files[0]);
  };
  const handleUploadClick = async () => {
    const file = selectedFile;
    if (BuilderCode == "select" || BuilderCode == "") {
      setSelectedFileError("Please select builder.");

      return false;
    }
    if (SubdivisionCode == "select" || SubdivisionCode == "") {
      setSelectedFileError("Please select Subdivision.");

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
          subdivision_id: SubdivisionCode,
        };

        try {
          let responseData = await AdminLandsaleService.import(
            inputData
          ).json();
          setSelectedFile("");
          document.getElementById("fileInput").value = null;
          setLoading(false);
          swal("Imported Sucessfully").then((willDelete) => {
            if (willDelete) {
              navigate("/landsalelist");
              setBuilderCode("");
              setShow(false);
            }
          });
          getLandsaleList();
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
      let response = await AdminBuilderService.index();
      let responseData = await response.json();
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

  const getsubdivisionlist = async () => {
    try {
      let response = await AdminSubdevisionService.index();
      let responseData = await response.json();

      setSubdivisionList(responseData);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(errorJson.message);
      }
    }
  };
  useEffect(() => {
    getsubdivisionlist();
  }, []);

  useEffect(() => {
    getsubdivisionlist();
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
  const handleSubdivisionCode = (code) => {
    setSubdivisionCode(code.target.value);
  };
  const handleRowClick = async (id) => {
    try {
      let responseData = await AdminLandsaleService.show(id).json();
      setLandSaleDetails(responseData);
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
    }, 300)
  ).current;

  useEffect(() => {
    getLandsaleList();
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


  return (
    <>
      <MainPagetitle
        mainTitle="Land sales"
        pageTitle="Land Sales"
        parentTitle="Home"
      />
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-12">
            <div className="card" style={{overflow:"auto"}}>
              <div className="card-body p-0">
                <div className="table-responsive active-projects style-1 ItemsCheckboxSec shorting">
                  <div className="tbl-caption d-flex justify-content-between text-wrap align-items-center">
                    <div className="d-flex text-nowrap justify-content-between align-items-center">
                      <h4 className="heading mb-0">Land Sale List</h4>
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
                          style={{ borderTopLeftRadius: '0',borderBottomLeftRadius: '0' }}
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
                        onClick={() => landsale.current.showEmployeModal()}
                      >
                        + Add Land Sale
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
                            <strong> No. </strong>
                          </th>
                          <th>
                            <strong>Builder Name</strong>
                          </th>
                          <th>
                            <strong>Subdivision Name</strong>
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
                        {LandsaleList !== null && LandsaleList.length > 0 ? (
                          LandsaleList.map((element, index) => (
                            <tr
                              onClick={() => handleRowClick(element.id)}
                              key={element.id}
                              style={{ textAlign: "center", cursor: "pointer" }}
                            >
                              {" "}
                              <td>{index + 1}</td>
                              <td>
                                {element.subdivision &&
                                  element.subdivision.builder?.name}
                              </td>
                              <td>
                                {element.subdivision &&
                                  element.subdivision?.name}
                              </td>
                              <td>{element.seller}</td>
                              <td>{element.buyer}</td>
                              <td>{element.location}</td>
                              <td>{element.notes}</td>
                              <td>{element.price}</td>
                              <td>{element.date}</td>
                              <td>
                                <div className="d-flex">
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
                        {LandsaleList.length < lastIndex
                          ? LandsaleList.length
                          : lastIndex}{" "}
                        of {LandsaleList.length} entries
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
      <LandsaleOffcanvas
        ref={landsale}
        Title="Add Landsale"
        parentCallback={handleCallback}
      />

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Import landsale CSV Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label className="mt-1">Select Builder:</label>
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
          <label className="mt-1">Select Subdivision:</label>
          <Form.Select
            onChange={handleSubdivisionCode}
            value={SubdivisionCode}
            className="default-select form-control"
          >
            <option value="">Select Subdivision</option>
            {SubdivisionList.map((element) => (
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
            Land Sale Details{" "}
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
                  {landSaleDetails.subdivision !== null &&
                  landSaleDetails.subdivision.name !== undefined
                    ? landSaleDetails.subdivision.name
                    : "NA"}
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Seller :</label>
                <div>
                  <span className="fw-bold">
                    {landSaleDetails.seller || "NA"}
                  </span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Buyer :</label>
                <div>
                  <span className="fw-bold">
                    {landSaleDetails.buyer || "NA"}
                  </span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Location :</label>
                <div>
                  <span className="fw-bold">
                    {landSaleDetails.location || "NA"}
                  </span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Date :</label>
                <div>
                  <span className="fw-bold">
                    {landSaleDetails.date || "NA"}
                  </span>
                </div>
              </div>
              <div className="col-xl-4 mt-4">
                <label className="">Parcel :</label>
                <div>
                  <span className="fw-bold">
                    {landSaleDetails.parcel || "NA"}
                  </span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Price :</label>
                <div>
                  <span className="fw-bold">
                    {landSaleDetails.price || "NA"}
                  </span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Type of Unit :</label>
                <div>
                  <span className="fw-bold">
                    {landSaleDetails.typeofunit || "NA"}
                  </span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Price Per Unit :</label>
                <div>
                  <span className="fw-bold">
                    {landSaleDetails.priceperunit || "NA"}
                  </span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">No. Of Unit :</label>
                <div>
                  <span className="fw-bold">
                    {landSaleDetails.noofunit || "NA"}
                  </span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Notes :</label>
                <div>
                  <span className="fw-bold">
                    {landSaleDetails.notes || "NA"}
                  </span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Doc :</label>
                <div>
                  <span className="fw-bold">{landSaleDetails.doc || "NA"}</span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Zoning :</label>
                <div>
                  <span className="fw-bold">
                    {landSaleDetails.zoning || "NA"}
                  </span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Latitude :</label>
                <div>
                  <span className="fw-bold">{landSaleDetails.lat || "NA"}</span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Longitude :</label>
                <div>
                  <span className="fw-bold">{landSaleDetails.lng || "NA"}</span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Area :</label>
                <div>
                  <span className="fw-bold">
                    {landSaleDetails.area || "NA"}
                  </span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Zipcode :</label>
                <div>
                  <span className="fw-bold">{landSaleDetails.zip || "NA"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Offcanvas>
    </>
  );
};

export default LandsaleList;
