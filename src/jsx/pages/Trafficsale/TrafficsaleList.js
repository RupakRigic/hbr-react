import React, { useState, useEffect, useRef } from "react";

import AdminTrafficsaleService from "../../../API/Services/AdminService/AdminTrafficsaleService";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import TrafficsaleOffcanvas from "./TrafficsaleOffcanvas";
import MainPagetitle from "../../layouts/MainPagetitle";
import { Offcanvas, Form } from "react-bootstrap";
import { debounce } from "lodash";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import ClipLoader from "react-spinners/ClipLoader";

const TrafficsaleList = () => {
  const [Error, setError] = useState("");

  const [trafficsaleList, setTrafficsaleList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // const [currentPage, setCurrentPage] = useState(1);
  // const recordsPage = 20;
  // const lastIndex = currentPage * recordsPage;
  // const firstIndex = lastIndex - recordsPage;
  // const records = trafficsaleList.slice(firstIndex, lastIndex);
  // const npage = Math.ceil(trafficsaleList.length / recordsPage);
  // const number = [...Array(npage + 1).keys()].slice(1);
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

  const [filterQuery, setFilterQuery] = useState({
    status: "",
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

  const trafficsale = useRef();

  const gettrafficsaleList = async () => {
    console.log(searchQuery);
    try {
      const response = await AdminTrafficsaleService.index(searchQuery);
      const responseData = await response.json();
      setTrafficsaleList(responseData);
      setIsLoading(false);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(errorJson.message);
      }
    }
  };
  useEffect(() => {
    gettrafficsaleList();
  }, []);
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

  const debouncedHandleSearch = useRef(
    debounce((value) => {
      setSearchQuery(value);
    }, 1000)
  ).current;

  useEffect(() => {
    gettrafficsaleList();
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

    return queryString ? `?${queryString}` : "";
  };

  const HandleCancelFilter = (e) => {
    setFilterQuery({
      status: "",
    });
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
                  <div className="tbl-caption d-flex justify-content-between text-wrap align-items-center">
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
                            <div className="mt-3 mb-3">
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
                                <option value="0">De-active</option>
                              </select>
                            </div>
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
                        onClick={() => trafficsale.current.showEmployeModal()}
                      >
                        + Add Weekly Traffic & Sale
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
                            <th>No.</th>
                            <th>Builder Name</th>
                            <th>Subdivision Name</th>
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
                          {trafficsaleList !== null &&
                          trafficsaleList.length > 0 ? (
                            trafficsaleList.map((element, index) => (
                              <tr
                                onClick={() => handleRowClick(element.id)}
                                key={element.id}
                                style={{
                                  textAlign: "center",
                                  cursor: "pointer",
                                }}
                              >
                                <td>{index + 1}</td>
                                <td>
                                  {element.subdivision &&
                                    element.subdivision.builder?.name}
                                </td>
                                <td>
                                  {element.subdivision &&
                                    element.subdivision?.name}
                                </td>
                                <td>{element.weekending}</td>
                                <td>{element.weeklytraffic}</td>
                                <td>{element.grosssales}</td>
                                <td>{element.cancelations}</td>
                                <td>{element.netsales}</td>
                                <td>{element.lotreleased}</td>
                                <td>{element.unsoldinventory}</td>
                                <td>
                                  <div className="d-flex">
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
                        {trafficsaleList.length < lastIndex
                          ? trafficsaleList.length
                          : lastIndex}{" "}
                        of {trafficsaleList.length} entries
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
      <TrafficsaleOffcanvas
        ref={trafficsale}
        Title="Add Weekly Traffic & Sale"
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
                    {TrafficDetails.weekending || "NA"}
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
                <label className="">Unsold Inventory:</label>
                <div>
                  <span className="fw-bold">
                    {TrafficDetails.unsoldinventory || "NA"}
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
    </>
  );
};

export default TrafficsaleList;
