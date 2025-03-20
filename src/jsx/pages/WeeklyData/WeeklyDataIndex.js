import React, { useState, useRef, useEffect, Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminWeeklyDataService from "../../../API/Services/AdminService/AdminWeeklyDataService";
import SubdivisionOffcanvas from "./SubdivisionOffcanvas";
import 'react-toastify/dist/ReactToastify.css';
import ClipLoader from "react-spinners/ClipLoader";
import MainPagetitle from "../../layouts/MainPagetitle";
import FutureSubdivisionPopup from "./FutureSubdivisionPopup";
import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert";
import '../../pages/Subdivision/subdivisionList.css';

const WeeklyDataIndex = () => {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [builderId, setBuilderId] = useState('');
  const [Error, setError] = useState("");
  const [BuilderList, setBuilderList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPage = 50;
  const lastIndex = currentPage * recordsPage;
  const firstIndex = lastIndex - recordsPage;
  const records = BuilderList.slice(firstIndex, lastIndex);
  const npage = Math.ceil(BuilderList.length / recordsPage);
  const number = [...Array(npage + 1).keys()].slice(1);
  const subdivision = useRef();
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [netSale, setNetSale] = useState(false);
  const [reset, setReset] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState(false);
  const [status, setStatus] = useState(false);
  const [event, setEvent] = useState([]);

  const handlePopupClose = () => setShowPopup(false);

  const handleCallback = () => {
    getWeeklyList();
  };

  const prePage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
      setFormData(formData);
    }
  };

  const changeCPage = (id) => {
    setCurrentPage(id);
    setFormData(formData);
  };

  const nextPage = () => {
    if (currentPage !== npage) {
      setCurrentPage(currentPage + 1);
      setFormData(formData);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("usertoken")) {
      getWeeklyList();
    } else {
      navigate("/");
    }
  }, []);

  const getWeeklyList = async (reset) => {
    setIsLoading(true);
    try {
      let weekending = localStorage.getItem('enddate');
      let builder_id = localStorage.getItem('builderId');

      const response = await AdminWeeklyDataService.index(weekending, builder_id).json();

      const updatedData = response?.data?.map((element) => ({
        ...element,
        net_sales:
          element.trafic_sales[0].grosssales -
          element.trafic_sales[0].cancelations,
      }));

      setIsLoading(false);
      setBuilderList(updatedData);

      if (reset) {
        swal("Data Reset Successfully");
      }
    } catch (error) {
      setIsLoading(false);
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(errorJson.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
    setIsLoading(false);
  };

  const handleChange = (event, id) => {
    setNetSale(true);
    setReset(false);
    const { name, value } = event.target;
    const numericValue = value === "0" ? "0" : value.replace(/^0+/, "").replace(/[^0-9]/g, "");
    setFormData((prevState) => ({
      ...prevState,
      [id]: {
        ...prevState[id],
        [name]: numericValue,
      },
    }));
  };

  const WeeklyTraffic = (id, data) => {
    const grossSales = formData[id]?.weeklytraffic || data.weeklytraffic;
    return grossSales;
  };

  const GrossSales = (id, data) => {
    const grossSales = formData[id]?.grosssales || data.grosssales;
    return grossSales;
  };

  const Cancelations = (id, data) => {
    const cancelations = formData[id]?.cancelations || data.cancelations;
    return cancelations;
  };

  const calculateNetSales = (id, data) => {
    const grossSales = formData[id]?.grosssales || data.grosssales;
    const cancelations = formData[id]?.cancelations || data.cancelations;
    return grossSales - cancelations;
  };

  const LotReleased = (id, data) => {
    const lotreleased = formData[id]?.lotreleased || data.lotreleased;
    return lotreleased;
  };

  const UnSoldInventory = (id, data) => {
    const unsoldinventory = formData[id]?.unsoldinventory || data.unsoldinventory;
    return unsoldinventory;
  };

  const handleStatusChange = async (event) => {
    const trElement = event.target.closest("tr");
    const inputElements = trElement.querySelectorAll("input");
    const createFormData = {};
    inputElements.forEach((input) => {
      createFormData[input.name] = input.value;
    });
    createFormData.week_ending_date = localStorage.getItem("enddate");
    createFormData.status = true;
    try {
      const data = await AdminWeeklyDataService.store(createFormData).json();
      if (data.status === true) {
        getWeeklyList();
        setShowPopup(false);
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

  const handleReset = () => {
    setReset(true);
    getWeeklyList(true);
  }

  const handleOpenDialog = () => {
    setShowModal(true);
  };

  const handlePopupOpen = (event) => {
    setShowPopup(true);
    setStatus(true);
    setEvent(event);
    setMessage("Are you sure want to change the status of the record?");
  }

  const HandlePopupDetailClick = (e) => {
    setShowPopup(true);
  };

  const GeneratePDF = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    let weekending = localStorage.getItem('enddate');
    let builder_id = localStorage.getItem('builderId');

    const reportdata = {
      weekending: weekending,
      builder_id: builder_id
    };

    const bearerToken = JSON.parse(localStorage.getItem("usertoken"));

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_IMAGE_URL}api/admin/weekly/download_pdf`,
        reportdata, {
        responseType: "arraybuffer",
        headers: {
          Accept: "application/pdf",
          Authorization: `Bearer ${bearerToken}`,
        },
      }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });

      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `Weekly Data Reporting.pdf`;

      document.body.appendChild(link);
      link.click();
      setIsLoading(false);
      document.body.removeChild(link);
    } catch (error) {
      if (error.response && error.response.data) {
        console.error("Error downloading PDF:", error.response.data);
        setError("Something went wrong");
      }
    }
  };

  const SaveAll = async (e) => {
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      swal("No changes are available.").then((willDelete) => {
        if (willDelete) {
          return;
        }
      });
    } else {
      try {
        const data = await AdminWeeklyDataService.update_all_data(localStorage.getItem("enddate"), formData).json();
        if (data.status === true) {
          swal("Data Saved Successfully").then((willDelete) => {
            if (willDelete) {
              getWeeklyList();
            }
          });
        }
      } catch (error) {
        if (error.name === "HTTPError") {
          const errorJson = await error.response.json();
          setError(errorJson.message.substr(0, errorJson.message.lastIndexOf(".")));
        }
      }
    }
  };

  return (
    <Fragment>
      <MainPagetitle
        mainTitle="Data Reporting"
        pageTitle="Data Reporting"
        parentTitle="Home"
      />
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-12">
            <div className="card">
              <div className="card-body p-0">
                <div className="table-responsive active-projects style-1 ItemsCheckboxSec shorting">
                  <div className="tbl-caption d-flex justify-content-between text-wrap align-items-center">
                    <h4 className="heading mb-0">Data Reporting List</h4>
                    <div className="d-flex">
                      <Button
                        className="btn btn-primary btn-sm me-1"
                        onClick={(e) =>
                          swal({
                            title: "Are you sure?",
                            text: "Generate the PDF the data that they've entered.",
                            icon: "warning",
                            buttons: {
                              cancel: "No",
                              confirm: "Yes"
                            },
                            dangerMode: false,
                          }).then((willGenerate) => {
                            if (willGenerate) {
                              GeneratePDF(e);
                            }
                          })
                        }
                      >
                        Generate PDF
                      </Button>

                      <button className="btn btn-primary btn-sm me-1"
                        onClick={() => handleOpenDialog()}
                      >
                        Add Future Subdivision
                      </button>
                      <Link
                        to={"#"}
                        className="btn btn-primary btn-sm ms-1"
                        data-bs-toggle="offcanvas"
                        onClick={() => subdivision.current.showEmployeModal()}
                      >
                        + Add Subdivision
                      </Link>
                      <button className="btn btn-primary btn-sm me-1"
                        style={{ marginLeft: "5px" }}
                        onClick={(e) => SaveAll(e)}
                      >
                        Save All
                      </button>
                      <button className="btn btn-primary btn-sm me-1"
                        onClick={() => swal({
                          title: "Are you sure?",
                          text: "Reset the data that they've entered.",
                          icon: "warning",
                          buttons: {
                            cancel: "No",
                            confirm: "Yes"
                          },
                          dangerMode: false,
                        }).then((willGenerate) => {
                          if (willGenerate) {
                            handleReset();
                          }
                        })
                        }
                      >
                        Cancel
                      </button>
                      <button className="btn btn-primary btn-sm me-1"
                        onClick={() => {
                          navigate("/weekly-data");
                          localStorage.removeItem('enddate');
                          localStorage.removeItem('builderId');
                        }}
                      >
                        Go Back
                      </button>
                    </div>
                  </div>
                  <div className="d-sm-flex text-center justify-content-between align-items-center dataTables_wrapper no-footer">
                    <div className="dataTables_info">
                      Showing {lastIndex - recordsPage + 1} to {lastIndex} of{" "}
                      {BuilderList?.length} entries
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
                      <div className="d-flex justify-content-center align-items-center mt-5 mb-5">
                        <ClipLoader color="#4474fc" />
                      </div>
                    ) : (
                      <table
                        id="empoloyees-tblwrapper"
                        className="table ItemsCheckboxSec dataTable no-footer mb-0 datareporting-table"
                      >
                        <thead>
                          <tr style={{ textAlign: "center" }}>
                            <th><strong>Week Ending</strong></th>
                            <th><strong>Sold Out?</strong></th>
                            <th><strong>Subdivision</strong></th>
                            <th><strong>Weekly Traffic</strong></th>
                            <th><strong>Gross Sales</strong></th>
                            <th><strong>-</strong></th>
                            <th><strong>cancelations</strong></th>
                            <th><strong>=</strong></th>
                            <th><strong>Net Sales</strong></th>
                            <th><strong>Current Lots Released</strong></th>
                            <th><strong>Current Unsold Standing Inventory</strong></th>
                          </tr>
                        </thead>
                        <tbody style={{ textAlign: "center", position: "relative", zIndex: "0" }}>
                          {records?.length > 0 ?
                            records.map((element) => {
                              const currentId = element.trafic_sales[0].subdivision_id;
                              return (
                                <tr key={currentId} style={{ textAlign: "center" }}>
                                  <td>{element.trafic_sales[0].weekending}</td>
                                  <td>
                                    <Button variant="primary" onClick={(event) => handlePopupOpen(event)}>
                                      Sold Out
                                    </Button>
                                  </td>
                                  <td>{element.name}</td>
                                  <td>
                                    <input
                                      type="text"
                                      defaultValue={
                                        element.trafic_sales[0].weeklytraffic
                                      }
                                      value={reset ? element.trafic_sales[0].weeklytraffic : (netSale ? WeeklyTraffic(currentId, element.trafic_sales[0]) : element.trafic_sales[0].weeklytraffic)}
                                      className="form-control"
                                      name="weeklytraffic"
                                      onChange={(event) => handleChange(event, currentId)}
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      value={reset ? element.trafic_sales[0].grosssales : (netSale ? GrossSales(currentId, element.trafic_sales[0]) : element.trafic_sales[0].grosssales)}
                                      className="form-control"
                                      name="grosssales"
                                      onChange={(event) => handleChange(event, currentId)}
                                    />
                                  </td>
                                  <td></td>
                                  <td>
                                    <input
                                      type="text"
                                      value={reset ? element.trafic_sales[0].cancelations : (netSale ? Cancelations(currentId, element.trafic_sales[0]) : element.trafic_sales[0].cancelations)}
                                      className="form-control"
                                      name="cancelations"
                                      onChange={(event) => handleChange(event, currentId)}
                                    />
                                  </td>
                                  <td></td>
                                  <td>{reset ? element.net_sales : (netSale ? calculateNetSales(currentId, element.trafic_sales[0]) : element.net_sales)}</td>
                                  <td>
                                    <input
                                      type="text"
                                      value={reset ? element.trafic_sales[0].lotreleased : (netSale ? LotReleased(currentId, element.trafic_sales[0]) : element.trafic_sales[0].lotreleased)}
                                      className="form-control"
                                      name="lotreleased"
                                      onChange={(event) => handleChange(event, currentId)}
                                    />
                                  </td>
                                  <td>
                                    <td>
                                      <input
                                        type="hidden"
                                        name="subdivision_id"
                                        value={
                                          element.trafic_sales[0].subdivision_id
                                        }
                                      />
                                      <input
                                        type="text"
                                        value={reset ? element.trafic_sales[0].unsoldinventory : (netSale ? UnSoldInventory(currentId, element.trafic_sales[0]) : element.trafic_sales[0].unsoldinventory)}
                                        className="form-control"
                                        name="unsoldinventory"
                                        onChange={(event) => handleChange(event, currentId)}
                                      />
                                    </td>
                                  </td>
                                </tr>
                              );
                            }
                            ) : (
                              <tr>
                                <td colSpan="11" style={{ textAlign: "center" }}>
                                  No data found
                                </td>
                              </tr>
                            )
                          }
                        </tbody>
                      </table>
                    )}
                  </div>
                  <div className="d-sm-flex text-center justify-content-between align-items-center dataTables_wrapper no-footer">
                    <div className="dataTables_info">
                      Showing {lastIndex - recordsPage + 1} to {lastIndex} of{" "}
                      {BuilderList?.length} entries
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

      <SubdivisionOffcanvas
        ref={subdivision}
        Title="Add Subdivision"
        parentCallback={handleCallback}
      />

      <FutureSubdivisionPopup
        show={showModal}
        BuilderList={BuilderList}
        setBuilderId={setBuilderId}
        handleClose={() => setShowModal(false)}
        getWeeklyList={() => getWeeklyList()}
      />

      {/* Popup */}
      <Modal show={showPopup} onHide={HandlePopupDetailClick}>
        <Modal.Header handlePopupClose>
          <Modal.Title>Status change confirmation</Modal.Title>
          <button
            className="btn-close"
            aria-label="Close"
            onClick={() => handlePopupClose()}
          ></button>
        </Modal.Header>
        <Modal.Body style={{ fontSize: "14px", color: "black" }}>
          {message}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => handlePopupClose()}>
            NO
          </Button>
          <Button variant="primary" onClick={() => status ? handleStatusChange(event) : ''}>
            YES
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};

export default WeeklyDataIndex;
