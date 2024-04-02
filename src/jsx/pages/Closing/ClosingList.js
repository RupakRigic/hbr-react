import React, { useState, useEffect, useRef } from "react";

import AdminClosingService from "../../../API/Services/AdminService/AdminClosingService";
import { Link, useNavigate} from "react-router-dom";
import swal from "sweetalert";
import ClosingOffcanvas from "./ClosingOffcanvas";
import MainPagetitle from "../../layouts/MainPagetitle";
import Button from "react-bootstrap/Button";
import { Offcanvas,Form } from "react-bootstrap";
import { debounce } from 'lodash';
import ClipLoader from "react-spinners/ClipLoader";

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
  const [selectedFile, setSelectedFile] = useState("");
  const [selectedFileError, setSelectedFileError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [ClosingDetails, setClosingDetails] = useState({
    "subdivision": "",
    "sellerleagal": "",
    "address": "",
    "buyer":"",
    "lender": "",
    "closingdate": "",
    "closingprice":"",
    "loanamount":"",
    "document":""
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

  const handleFileChange =  async (event) => {
    const file = event.target.files[0];

    if (file && file.type === "text/csv") {
      setLoading(true)
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = async() => {
        var iFile = fileReader.result;
        setSelectedFile(iFile);
       const inputData =
        {
            csv:iFile
        };
        try {
            let responseData = await AdminClosingService.import(inputData).json();
            setSelectedFile("")
            document.getElementById("fileInput").value = null;
            setLoading(false)
            swal("Imported Sucessfully").then((willDelete) => {
              if (willDelete) {
                navigate("/closingsalelist");
              }
            });
            getClosingList();
          } catch (error) {
            console.log(error);
            if (error.name === "HTTPError") {
              const errorJson =  error.response.json();
              setSelectedFile("")
              setError(errorJson.message);
              document.getElementById("fileInput").value = null;
              setLoading(false)
            }
          }
      };

      setSelectedFileError("");
    } else {
      setSelectedFile("");
      setSelectedFileError("Please select a CSV file.");
    }
  };

  const handleCallback = () => {
    // Update the name in the component's state
    getClosingList();
  };
  const handleUploadClick = () => {
    document.getElementById("fileInput").click();
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

  const debouncedHandleSearch = useRef(debounce((value) => {
    setSearchQuery(value);
  }, 1000)).current;

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
            <div className="card" style={{overflow:"auto"}}>
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
                          <i class="fas fa-search"></i>        </button>
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
                        onClick={handleUploadClick}
                        disabled={loading}
                      >
                        
                        {loading ? 'Loading..' : 'Import'}

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
                          <th>Builder Name</th>
                          <th>Subdivision Name</th>
                          <th>Seller</th>
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
                      {ClosingList !== null && ClosingList.length > 0 ? (
                          ClosingList.map((element, index) => (
                            <tr 
                            onClick={() => handleRowClick(element.id)}
                            key={element.id}
                            style={{ textAlign: "center", cursor: "pointer" }}>           
                              <td>{index + 1}</td>
                              <td>
                                {element.subdivision &&
                                  element.subdivision.builder?.name}
                              </td>
                              <td>
                                {element.subdivision &&
                                  element.subdivision?.name}
                              </td>
                              <td>{element.sellerleagal}</td>
                              <td>{element.address}</td>
                              <td>{element.buyer}</td>
                              <td>{element.closingdate}</td>
                              <td>{element.closingprice}</td>
                              <td>{element.loanamount}</td>
                              <td>{element.document}</td>
                              <td>
                                <div className="d-flex">
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
                <label className="">Address  :</label>
                <div>
                  <span className="fw-bold">
                    {ClosingDetails.address || "NA"}
                  </span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Buyer  :</label>
                <div>
                  <span className="fw-bold">
                    {ClosingDetails.buyer || "NA"}
                  </span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Lender  :</label>
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
                    {ClosingDetails.closingdate || "NA"}
                  </span>
                </div>
              </div>
              
              <div className="col-xl-4 mt-4">
                <label className="">Closing Price :</label>
                <div>
                  <span className="fw-bold">
                    {ClosingDetails.closingprice || "NA"}
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
    </>
  );
};

export default ClosingList;
