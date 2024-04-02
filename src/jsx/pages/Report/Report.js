import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import AdminBuilderService from "../../../API/Services/AdminService/AdminBuilderService";
import RechartJs from "../../components/charts/rechart";
import MainPagetitle from "../../layouts/MainPagetitle";
import "./Report.css";
import AdminWeeklyDataService from "../../../API/Services/AdminService/AdminWeeklyDataService";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import AdminReportService from "../../../API/Services/AdminService/AdminReportService";
import moment from "moment";
import axios from "axios";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Hidden } from "@mui/material";

const BuilderTable = () => {
  const [Error, setError] = useState("");
  var imageUrl = process.env.REACT_APP_Builder_IMAGE_URL;
  const [weekEndDates, setWeekEndDates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [reportList, setReportList] = useState([]);
  const recordsPage = 10;
  const lastIndex = currentPage * recordsPage;
  const firstIndex = lastIndex - recordsPage;
  const records = reportList.slice(firstIndex, lastIndex);
  const npage = Math.ceil(reportList.length / recordsPage);
  const number = [...Array(npage + 1).keys()].slice(1);
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
  const [show, setShow] = useState(false);
  const currentDate = moment();
  const firstDayOfMonth = currentDate.startOf("month").format("YYYY-MM-DD");
  const lastDayOfMonth = currentDate.endOf("month").format("YYYY-MM-DD");
  const [startDate, setStartDate] = useState(firstDayOfMonth);
  const [endDate, setEndDate] = useState(lastDayOfMonth);
  const [reportType, setReportType] = useState("Active List Of LV New Home");
  const [uploadReportType, setUploadReportType] = useState("Active List Of LV New Home");
  console.log(uploadReportType);
  const [pdfData, setPdfData] = useState();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [pdfUrl, setPdfUrl] = useState("");
  const [value, setValue] = React.useState("1");
  const navigate = useNavigate();
  const [selectedEndDate, setSelectedEndDate] = useState();
  const [selectedFile, setSelectedFile] = useState('');
  const [selectedFileError, setSelectedFileError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("usertoken")) {
      getWeekEndDate();
    } else {
      navigate("/");
    }
  }, []);
  const handleSelectChange = (event) => {
    setSelectedEndDate(event.target.value);
    localStorage.setItem("enddate", event.target.value);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleModalClick = () => {
    navigate("/report-list");
  };
  const getWeekEndDate = async () => {
    try {
      let responseData = await AdminWeeklyDataService.getdate().json();
      setWeekEndDates(responseData.dates);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(errorJson.message);
      }
    }
  };

  const getreportlist = async () => {
    try {
      const response = await AdminReportService.reportList();
      const responseData = await response.json();
      setReportList(responseData);
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
      getreportlist();
    } else {
      navigate("/");
    }
  }, []);
  const handlePreview = async (e) => {
    localStorage.setItem("start_date", startDate);
    localStorage.setItem("end_date", endDate);
    localStorage.setItem("report_type", reportType);

    const reportdata = {
      type: reportType,
      start_date: startDate,
      end_date: endDate,
    };
    const bearerToken = JSON.parse(localStorage.getItem("usertoken"));
    try {
      const response = await axios.post(
        "https://hbrapi.rigicgspl.com/api/admin/report/export-reports",
        // "http://127.0.0.1:8000/api/admin/report/export-reports",

        reportdata,
        {
          responseType: "arraybuffer",
          headers: {
            Accept: "application/pdf", // Set Accept header to indicate that we expect a PDF response
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );
      handlePdfResponse(response);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(errorJson.message);
      }
    }
  };

  const handlePdfResponse = (response) => {
    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    //  window.open(url);
    setPdfUrl(url);
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleString();
    return formattedDate;
  };

  const handleSaverRport = () => {
    const reportdata = {
      type: reportType,
      start_date: startDate,
      end_date: endDate,
    };
    try {
      let responseData = AdminReportService.pdfSave(reportdata).json();
      swal("Report Saved Succesfully").then((willDelete) => {
        if (willDelete) {
          navigate("/report");
        }
      });
      getreportlist();
    } catch (error) {
      console.log(error);
      if (error.name === "HTTPError") {
        const errorJson = error.response.json();
        setError(errorJson.message);
      }
    }
  };
  const handleDelete = async (e) => {
    try {
      let responseData = await AdminReportService.destroyReport(e).json();
      if (responseData.status === true) {
        getreportlist();
      }
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(errorJson.message);
      }
    }
  };

  const handleReportPreview = (content) => {
    const blob = base64toBlob(content);
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
  };

  const base64toBlob = (base64Data) => {
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: "application/pdf" });
    return blob;
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file && file.type === "application/pdf") {
      const fileReader = new FileReader()
      fileReader.readAsDataURL(file)

      fileReader.onload = () => {
          var image = fileReader.result
          setSelectedFile(image);
      }

      setSelectedFileError("")
    } else {
      setSelectedFile('');
      setSelectedFileError("Please select a PDF file.");
    }
  };

  const handleUploadClick = () => {
    document.getElementById("fileInput").click();
  };
  const handleUploadFile = async  () =>{

    if(!selectedFile)
    {
      setSelectedFileError('Please select Report file.')

      return false;
    }
    const inputData = {
      pdf_file :  selectedFile ? selectedFile.split(',')[1] : "",
      type:uploadReportType
    };
      try {
        let responseData = await AdminReportService.uploadReport(inputData).json();
        swal("Report Saved Succesfully").then((willDelete) => {
          if (willDelete) {
            navigate("/report");
          }
        });
        getreportlist();
      } catch (error) {
        console.log(error);
        if (error.name === "HTTPError") {
          const errorJson = error.response.json();
          setError(errorJson.message);
        }
      }

  }
  return (
    <>
      <MainPagetitle mainTitle="Report" pageTitle="Report" parentTitle="Home" />
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-6">
            <Box sx={{ width: "100%", typography: "body1" }}>
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <TabList
                    onChange={handleChange}
                    aria-label="lab API tabs example"
                  >
                    <Tab label="Report List" value="1" />
                    <Tab label="Add/Generate Report" value="2" />
                  </TabList>
                </Box>
                <TabPanel value="1" className="p-0">
                  <div className="card">
                    <div className="card-body p-0">
                      <div
                        id="employee-tbl_wrapper"
                        className="dataTables_wrapper no-footer table-responsive active-projects style-1 ItemsCheckboxSec shorting"
                      >
                        <table
                          id="empoloyees-tblwrapper"
                          className="table ItemsCheckboxSec dataTable no-footer mb-0"
                        >
                          <thead>
                            <tr style={{ textAlign: "center" }}>
                              <th>
                                <strong>Name</strong>
                              </th>
                              <th>
                                <strong>Report</strong>
                              </th>
                              <th>
                                <strong>Saved at</strong>
                              </th>

                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody style={{ textAlign: "center" }}>
                            {records.map((element, index) => {
                              return (
                                <tr style={{ textAlign: "center" }}>
                                  <td>
                                    <a
                                      href="#"
                                      onClick={(e) =>
                                        handleReportPreview(element.content)
                                      }
                                      className="text-decoration-none"
                                    >
                                      {element.name}
                                    </a>
                                  </td>

                                  <td>
                                    <a
                                      href="#"
                                      onClick={(e) =>
                                        handleReportPreview(element.content)
                                      }
                                      className="text-decoration-none"
                                    >
                                      {element.report_type.length > 20
                                        ? element.report_type.substring(0, 20) +
                                          "...   "
                                        : element.report_type}
                                    </a>
                                  </td>
                                  <td>
                                    <a
                                      href="#"
                                      onClick={(e) =>
                                        handleReportPreview(element.content)
                                      }
                                      className="text-decoration-none"
                                    >
                                      {formatDate(element.created_at)}
                                    </a>
                                  </td>
                                  <td>
                                    <div className="d-flex justify-content-center">
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
                              );
                            })}
                          </tbody>
                        </table>
                        <div className="d-sm-flex text-center justify-content-end align-items-center">
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
                        </div>
                      </div>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel value="2" className="p-0">
                  <div className="card">
                    <div className="card-body p-0">
                      <div className="active-projects style-1 ItemsCheckboxSec shorting border-bottom">
                        <div className="tbl-caption d-flex text-wrap">
                          <h3 className="mb-0">Add Existing Report</h3>
                        </div>
                        <div className="dataTables_wrapper no-footer">
                          <div className="row mb-3">
                            <div className="d-flex align-items-center d-flex  align-items-center">
                              <div className="col-md-3">
                                <div className="ms-4">Select Report</div>
                              </div>
                              <div className="col-md-6">
                                <select
                                  onChange={(e) =>
                                    setUploadReportType(e.target.value)
                                  }
                                  value={uploadReportType}
                                  className="form-control-select"
                                >
                                  <option>Active List Of LV New Home</option>
                                  <option>Annual Report</option>
                                  <option>Area Summaries Report</option>
                                  <option>Closing on Google Earth</option>
                                  <option>Closing Report(PDF) </option>
                                  <option>Closing Report(XLS) </option>
                                  <option>Land Sales on Google Earth</option>
                                  <option>
                                    LV Quartley Traffic and Sales Summary
                                  </option>
                                  <option>Market Share Analysis Report</option>
                                  <option>Permits Rankings Report</option>
                                  <option>Subdivision Analysis Report</option>
                                  <option>The Las vegas land Report</option>
                                  <option>
                                    The Las vegas land Report EXCEL
                                  </option>
                                  <option>
                                    Weekly Traffic and Sales Watch
                                  </option>
                                  <option>WTSD on Google Earth</option>
                                  <option>WTSD Report Excel</option>
                                </select>
                              </div>
                              <div className="col-md-3 ms-4">
                                <Button
                                  className="btn-sm"
                                  onClick={handleUploadClick}
                                  variant="primary"
                                >
                                  Select FIle
                                </Button>
                                <input
                                  type="file"
                                  id="fileInput"
                                  style={{ display: "none" }}
                                  onChange={handleFileChange}
                                />
                              </div>
                            </div>
                            {/* <div className="row mb-3 d-flex justify-content-center"> */}
                            <div
                              className="
                                d-flex justify-content-center align-item-center text-danger"
                            >
                              <p>{selectedFileError}</p>
                            </div>
                            <div
                              className="
                                d-flex justify-content-center align-item-center text-success"
                            >
                              <p>{selectedFile != '' ? selectedFile.name : ''}</p>
                            </div>
                            <div
                              className="
                                d-flex justify-content-center align-item-center mt-3"
                            >
                              <div>
                                <Button
                                  className="btn-sm"
                                  variant="primary"
                                  onClick={handleUploadFile}
                                >
                                  Upload File
                                </Button>
                              </div>
                            </div>
                            {/* </div> */}
                          </div>
                        </div>
                      </div>
                      <div className="active-projects style-1 ItemsCheckboxSec shorting">
                        <div className="tbl-caption d-flex text-wrap">
                          <h3 className="mb-0">Generate New Report</h3>
                        </div>
                        <div className="dataTables_wrapper no-footer">
                          <div className="row">
                            <div className="col-md-12">
                              <div className="d-flex">
                                <p className="text-center ms-4">
                                  Select Week ending date and click continue
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-7 d-flex align-items-center">
                              <div className="col-md-6">
                                <div className="ms-4">Select Period</div>
                              </div>
                              <div className="me-2 mb-2">
                                <input
                                  type="date"
                                  className="form-control"
                                  onChange={(e) => setStartDate(e.target.value)}
                                  value={startDate}
                                />
                              </div>
                              <div className="mb-2">
                                <input
                                  type="date"
                                  className="form-control"
                                  value={endDate}
                                  onChange={(e) => setEndDate(e.target.value)}
                                />
                              </div>
                            </div>

                            <div className="mb-2 col-md-7 d-flex align-items-center d-flex  align-items-center">
                              <span className="col-md-6">
                                <div className="ms-4">Select Report</div>
                              </span>

                              <select
                                onChange={(e) => setReportType(e.target.value)}
                                value={reportType}
                                className="form-control-select"
                              >
                                <option>Active List Of LV New Home</option>
                                <option>Annual Report</option>
                                <option>Area Summaries Report</option>
                                <option>Closing on Google Earth</option>
                                <option>Closing Report(PDF) </option>
                                <option>Closing Report(XLS) </option>
                                <option>Land Sales on Google Earth</option>
                                <option>
                                  LV Quartley Traffic and Sales Summary
                                </option>
                                <option>Market Share Analysis Report</option>
                                <option>Permits Rankings Report</option>
                                <option>Subdivision Analysis Report</option>
                                <option>The Las vegas land Report</option>
                                <option>The Las vegas land Report EXCEL</option>
                                <option>Weekly Traffic and Sales Watch</option>
                                <option>WTSD on Google Earth</option>
                                <option>WTSD Report Excel</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-md-7 d-flex">
                            <div className="ms-4 mb-4">
                              <a
                                className="btn btn-primary me-2"
                                onClick={handleSaverRport}
                              >
                                Save
                              </a>
                              <a
                                onClick={handlePreview}
                                className="btn btn-primary"
                              >
                                Preview
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabPanel>
              </TabContext>
            </Box>
          </div>
          <div className="col-xl-6 mt-5">
            {pdfUrl && (
              <embed
                src={pdfUrl}
                type="application/pdf"
                width="600"
                height="470"
              />
            )}
          </div>
        </div>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>The Report's Name</Modal.Title>
        </Modal.Header>
        <Modal.Body>Please enter the name for this report</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            cancel
          </Button>
          <Button variant="primary" onClick={handleModalClick}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BuilderTable;
