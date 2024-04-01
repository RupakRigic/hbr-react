import React, { useState, useEffect, useRef } from "react";

import AdminPriceService from "../../../API/Services/AdminService/AdminPriceService";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import PriceOffcanvas from "./PriceOffcanvas";
import MainPagetitle from "../../layouts/MainPagetitle";
import Button from "react-bootstrap/Button";
import { Offcanvas, Form } from "react-bootstrap";
import { debounce } from "lodash";
import ClipLoader from "react-spinners/ClipLoader";

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
  const [searchQuery, setSearchQuery] = useState("");
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
                          <th>
                            <strong>Builder Name</strong>
                          </th>
                          <th>
                            <strong>Subdivision Name</strong>
                          </th>
                          <th>
                            <strong>Product Name</strong>
                          </th>
                          <th>
                            <strong>Product Code</strong>
                          </th>
                          <th>
                            <strong>Base Price</strong>
                          </th>
                          <th>
                            <strong>Date</strong>
                          </th>

                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody style={{ textAlign: "center" }}>
                        {priceList !== null && priceList.length > 0 ? (
                          priceList.map((element, index) => (
                            <tr
                              onClick={() => handleRowClick(element.id)}
                              key={element.id}
                              style={{ textAlign: "center", cursor: "pointer" }}
                            >
                              <td>{index + 1}</td>
                              <td>
                                {element.product.subdivision &&
                                  element.product.subdivision.builder?.name}
                              </td>
                              <td>
                                {element.product.subdivision &&
                                  element.product.subdivision?.name}
                              </td>
                              <td>{element.product.name}</td>

                              <td>{element.product.product_code}</td>
                              <td>{element.baseprice}</td>
                              <td>{element.date}</td>
                              <td>
                                <div className="d-flex justify-content-end">
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
                    {PriceDetails.baseprice || "NA"}
                  </span>
                </div>
              </div>

              <div className="col-xl-4 mt-4">
                <label className="">Date :</label>
                <div>
                  <span className="fw-bold">{PriceDetails.date || "NA"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Offcanvas>
    </>
  );
};

export default PriceList;
