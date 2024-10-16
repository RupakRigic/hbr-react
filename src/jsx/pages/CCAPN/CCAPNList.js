import React, { useEffect, useState } from "react";
import MainPagetitle from "../../layouts/MainPagetitle";
import { Link, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import ClipLoader from "react-spinners/ClipLoader";
import swal from "sweetalert";
import AdminCCAPNService from "../../../API/Services/AdminService/AdminCCAPNService";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import DateComponent from "../../components/date/DateFormat";
import AdminBuilderService from "../../../API/Services/AdminService/AdminBuilderService";
import { Form, Offcanvas } from "react-bootstrap";
import Select from "react-select";
import AdminSubdevisionService from "../../../API/Services/AdminService/AdminSubdevisionService";
import Dropdown from "react-bootstrap/Dropdown";

const CCAPNList = () => {
  const [selectedLandSales, setSelectedLandSales] = useState([]);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterQuery, setFilterQuery] = useState({
    parcel: "",
    address: "",
  });
  const [BuilderList, setBuilderList] = useState([]);
  const [selectedSubdivisionName, setSelectedSubdivisionName] = useState("");
  const [selectedBuilderName, setSelectedBuilderName] = useState("");
  const [builderListDropDown, setBuilderListDropDown] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [Error, setError] = useState("");
  const [fileListCount, setFileListCount] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPage = 100;
  const lastIndex = currentPage * recordsPage;
  const [npage, setNpage] = useState(0);
  const number = [...Array(npage + 1).keys()].slice(1);
  const navigate = useNavigate();
  const [ccapnList, setCCAPNList] = useState([]);
  const [AllBuilderListExport, setAllBuilderExport] = useState([]);
  const [excelLoading, setExcelLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const [selectedFileError, setSelectedFileError] = useState("");

  useEffect(() => {
    setSearchQuery(filterString());
  }, [filterQuery]);

  useEffect(() => {
    getbuilderDoplist();
  }, []);

  useEffect(() => {
    if (localStorage.getItem("usertoken")) {
      GetCCAPNList(currentPage, sortConfig, searchQuery);
    } else {
      navigate("/");
    }
  }, [currentPage]);

  const prePage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const changeCPage = (id) => {
    setCurrentPage(id);
  };

  const nextPage = () => {
    if (currentPage !== npage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleEditCheckboxChange = (e, userId) => {
    if (e.target.checked) {
      setSelectedLandSales((prevSelectedUsers) => [
        ...prevSelectedUsers,
        userId,
      ]);
    } else {
      setSelectedLandSales((prevSelectedUsers) =>
        prevSelectedUsers.filter((id) => id !== userId)
      );
    }
  };

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

    return queryString ? `&${queryString}` : "";
  };
  
  const handleSelectBuilderNameChange = (e) => {
    setSelectedBuilderName(e);
    console.log(e.value);
    getbuilderlist(e.value);
  };

  const getbuilderlist = async (builderId) => {
    try {
      const response = await AdminSubdevisionService.Subdivisionbybuilderid(builderId);
      const responseData = await response.json();
      const formattedData = responseData.data.map((subdivision) => ({
        label: subdivision.name,
        value: subdivision.id,
      }));
      console.log(formattedData);
      setBuilderList(formattedData);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(errorJson.message);
      }
    }
  };

  const handleSelectSubdivisionNameChange = (e) => {
    setSelectedSubdivisionName(e.value);
  };

  const handleRowEdit = async (id) => {
    setShowOffcanvas(true);
    setSelectedLandSales((prevSelectedUsers) => [
      ...prevSelectedUsers,
      id,
    ]);
  };

  const handleClose = () => {
    setShow(false);
    // GetCCAPNList();
  };

  const SyestemUserRole = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).role
    : "";

  const stringifySortConfig = (sortConfig) => {
    return sortConfig.map((sort) => `${sort.key}:${sort.direction}`).join(",");
  };

  const getbuilderDoplist = async () => {
    try {
      const response = await AdminBuilderService.builderDropDown();
      const responseData = await response.json();
      const formattedData = responseData.map((builder) => ({
        label: builder.name,
        value: builder.id,
      }));
      setBuilderListDropDown(formattedData);
      if (formattedData.length > 0) {
        setSelectedBuilderName([
          {
            label: formattedData[0].label,
            value: formattedData[0].value,
          },
        ]);
      }
    } catch (error) {
      console.log(error);
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(errorJson.message);
      }
    }
  };

  const GetCCAPNList = async (pageNumber, sortConfig, searchQuery) => {
    setIsLoading(true);
    setSearchQuery(searchQuery);
    try {
      let sortConfigString = "";
      if (sortConfig !== null) {
        sortConfigString = "&sortConfig=" + stringifySortConfig(sortConfig);
      }
      const response = await AdminCCAPNService.index(
        pageNumber,
        searchQuery,
        sortConfigString
      );
      const responseData = await response.json();
      setIsLoading(false);
      setCCAPNList(responseData.data);
      setNpage(Math.ceil(responseData.total / recordsPage));
      setFileListCount(responseData.total);
      if (responseData.total > 100) {
        // FetchAllPages(searchQuery, sortConfig, responseData.data, responseData.total);
      } else {
        setExcelLoading(false);
        setAllBuilderExport(responseData.data);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(errorJson.message);
      }
    }
    setIsLoading(false);
  };

  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  const FetchAllPages = async (searchQuery, sortConfig, CCAPNList, ccapnListCount) => {
    const totalPages = Math.ceil(ccapnListCount / recordsPage);
    let allData = CCAPNList;

    for (let page = 2; page <= totalPages; page++) {
      await delay(1000);
      const pageResponse = await AdminCCAPNService.index(page, searchQuery, sortConfig ? `&sortConfig=${stringifySortConfig(sortConfig)}` : "");
      const pageData = await pageResponse.json();
      allData = allData.concat(pageData.data);
    }
    setAllBuilderExport(allData);
    setExcelLoading(false);
  };

  const handlBuilderClick = (e) => {
    setShow(true);
  };

  const handleFileChange = async (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const CHUNK_SIZE = 2 * 1024 * 1024;

  const handleUploadClick = async () => {
    const file = selectedFile;

    if (file && file.type === "text/csv") {
      setIsLoading(true);
      setSelectedFileError("");

      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
      let currentChunk = 0;

      while (currentChunk < totalChunks) {
        const start = currentChunk * CHUNK_SIZE;
        const end = Math.min(file.size, start + CHUNK_SIZE);
        const fileChunk = file.slice(start, end);

        const formData = new FormData();
        formData.append("chunk", fileChunk);
        formData.append("chunkIndex", currentChunk);
        formData.append("totalChunks", totalChunks);
        formData.append("fileName", file.name);
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_IMAGE_URL}api/admin/ccapn/import`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${JSON.parse(
                  localStorage.getItem("usertoken")
                )}`,
              },
            }
          );
          if (response.status !== 200) {
            throw new Error("HTTPError");
          } else {
            currentChunk++;
            console.log(`Chunk ${currentChunk}/${totalChunks} uploaded.`);
            
            document.getElementById("fileInput").value = null;

            if (response.data.failed_records > 0) {
              let message = response.data.message;
              const problematicRows = response.data.failed_records_details.map((detail) => detail.error).join(", ");
              message += " Problematic Record Rows: " + problematicRows + ".";
              message += ". Record Imported: " + response.data.successful_records;
              message += ". Failed Record Count: " + response.data.failed_records;
              message += ". Last Row: " + response.data.last_processed_row;
              setSelectedFile("");
              setIsLoading(false);
              setShow(false);
              swal(message).then((willDelete) => {
                if (willDelete) {
                  GetCCAPNList(currentPage, sortConfig, searchQuery);
                }
              });
            } else {
              if (response.data.message) {
                setSelectedFile("");
                let message = response.data.message;
                setIsLoading(false);
                setShow(false);
                swal(message).then((willDelete) => {
                  if (willDelete) {
                    GetCCAPNList(currentPage, sortConfig, searchQuery);
                  }
                });
              }
            }
          }
        } catch (error) {
          if (error.name === "HTTPError") {
            const errorJson = error.response.json();
            setSelectedFile("");
            setError(errorJson.message);
            document.getElementById("fileInput").value = null;
            setIsLoading(false);
          }
        }
      };
      setSelectedFileError("");
    } else {
      setSelectedFile("");
      setSelectedFileError("Please select a CSV file.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (selectedLandSales.length === 0) {
      setError("No selected records");
      return false;
    }
    swal({
      title: "Are you sure?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          var userData = {
            subdivision_id: selectedSubdivisionName,
          };
          console.log(userData);
          console.log(selectedLandSales);
          const data = await AdminCCAPNService.bulkupdate(
            selectedLandSales,
            userData
          ).json();
          if (data.status === true) {
            swal("Ccapn Updated Succesfully").then((willDelete) => {
              if (willDelete) {
                navigate("/ccapn");
                GetCCAPNList(currentPage, sortConfig, searchQuery);
              }
            });
          }
        } catch (error) {
          if (error.name === "HTTPError") {
            const errorJson = await error.response.json();
            setError(
              errorJson.message.substr(0, errorJson.message.lastIndexOf("."))
            );
          }
        }
      }
    });
  };

  return (
    <>
      <MainPagetitle mainTitle="CCAPNs" pageTitle="CCAPNs" parentTitle="Home" />
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-12">
            <div className="card">
              <div className="card-body p-0">
                <div className="table-responsive active-projects style-1 ItemsCheckboxSec shorting">
                  <div className="tbl-caption d-flex justify-content-between text-wrap align-items-center pb-0">
                    <div className="d-flex text-nowrap justify-content-between align-items-center">
                      <h4 className="heading mb-0">CCAPNs List</h4>

                      <div className="mx-3">
                        <Form.Group controlId="tournamentList">
                          <Select
                            name="builder_name"
                            options={builderListDropDown}
                            onChange={(e) => handleSelectBuilderNameChange(e)}
                            placeholder="Select Builder Name"
                            styles={{
                              container: (provided) => ({
                                ...provided,
                                color: 'black',
                                width: '200px',
                              }),
                              menu: (provided) => ({
                                ...provided,
                                color: 'black',
                                width: '200px',
                              }),
                            }}
                          />
                        </Form.Group>
                      </div>
                      <div className="me-3">
                        <Form.Group controlId="tournamentList">
                          <Select
                            name="subdivision_name"
                            options={BuilderList}
                            onChange={(e) => handleSelectSubdivisionNameChange(e)}
                            placeholder={"Select Subdivision Name"}
                            styles={{
                              container: (provided) => ({
                                ...provided,
                                color: 'black',
                                width: '200px',
                              }),
                              menu: (provided) => ({
                                ...provided,
                                color: 'black',
                                width: '200px',
                              }),
                            }}
                          />
                        </Form.Group>
                      </div>
                      <button
                        onClick={handleSubmit}
                        className="btn btn-sm btn-primary"
                      >
                        Assign
                      </button>
                    </div>

                    {SyestemUserRole == "Data Uploader" ||
                      SyestemUserRole == "User" ||
                      SyestemUserRole == "Standard User" ? (
                      ""
                    ) : (
                      <div className="d-flex justify-content-between">
                        <div className="me-3">
                          <Dropdown>
                            <Dropdown.Toggle
                              variant="success"
                              className="btn-sm"
                              id="dropdown-basic"
                            >
                              <i className="fa fa-filter"></i>
                            </Dropdown.Toggle>

                            <Dropdown.Menu style={{ width: "400px", overflow: "unset" }}>

                              <label className="form-label">
                                Parcel :
                              </label>
                              <input type="search" name="parcel" className="form-control" onChange={HandleFilter} />

                              <label className="form-label">
                                Address :
                              </label>
                              <input type="search" name="address" className="form-control" onChange={HandleFilter} />

                            </Dropdown.Menu>
                          </Dropdown>

                        </div>
                        <div>
                          <Button
                            className="btn-sm me-1"
                            variant="secondary"
                            onClick={handlBuilderClick}
                          >
                            Import
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="d-sm-flex text-center justify-content-between align-items-center dataTables_wrapper no-footer">
                    <div className="dataTables_info">
                      Showing {lastIndex - recordsPage + 1} to {lastIndex} of{" "}
                      {fileListCount} entries
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
                        className="table ItemsCheckboxSec dataTable no-footer mb-0 ccapns-table"
                      >
                        <thead>
                          <tr style={{ textAlign: "center" }}>
                            <th>
                              <input
                                type="checkbox"
                                style={{
                                  cursor: "pointer",
                                }}
                                checked={
                                  selectedLandSales.length === ccapnList.length
                                }
                                onChange={(e) =>
                                  e.target.checked
                                    ? setSelectedLandSales(
                                      ccapnList.map((user) => user.id)
                                    )
                                    : setSelectedLandSales([])
                                }
                              />
                            </th>{" "}
                            <th>
                              <strong>No.</strong>
                            </th>
                            <th>
                              <strong>Builder</strong>
                            </th>
                            <th>
                              <strong>Subdivision</strong>
                            </th>
                            <th>
                              <strong>Parcel Number</strong>
                            </th>
                            <th>
                              <strong>Full Address</strong>
                            </th>
                            <th>
                              <strong>Latitude</strong>
                            </th>
                            <th>
                              <strong>Longitude</strong>
                            </th>
                            <th>
                              <strong>Sub ID</strong>
                            </th>
                            <th>
                              <strong>Permits</strong>
                            </th>
                            <th>
                              <strong>Closings</strong>
                            </th>
                            <th>
                              <strong>Modification Date</strong>
                            </th>
                            <th>
                              <strong>Action</strong>
                            </th>
                          </tr>
                        </thead>
                        <tbody style={{ textAlign: "center" }}>
                          {ccapnList !== null && ccapnList.length > 0 ? (
                            ccapnList.map((element, index) => (
                              <tr style={{ textAlign: "center" }}>
                                <td>
                                  <input
                                    type="checkbox"
                                    checked={selectedLandSales.includes(
                                      element.id
                                    )}
                                    onChange={(e) =>
                                      handleEditCheckboxChange(e, element.id)
                                    }
                                    style={{
                                      cursor: "pointer",
                                    }}
                                  />
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  {index + 1}
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  {element.subdivision &&
                                    element.subdivision.builder &&
                                    element.subdivision.builder.name}
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  {element.subdivision &&
                                    element.subdivision.name}
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  {element.parcel}
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  {element.loc_strno +
                                    " " +
                                    element.loc_strname}{" "}
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  {element.ll_x}
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  {element.ll_y}
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  {element.subdivision &&
                                    element.subdivision.subdivision_code}
                                </td>
                                <td style={{ textAlign: "center" }}>-</td>
                                <td style={{ textAlign: "center" }}>-</td>
                                <td style={{ textAlign: "center" }}>
                                  <DateComponent date={element.created_at} />
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  <div className="d-flex justify-content-center">
                                    <button
                                      className="btn btn-primary shadow btn-xs sharp me-1"
                                      onClick={() => handleRowEdit(element.id)}
                                    >
                                      <i className="fas fa-pencil-alt"></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="13" style={{ textAlign: "center" }}>
                                No data found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
                <div className="d-sm-flex text-center justify-content-between align-items-center dataTables_wrapper no-footer">
                    <div className="dataTables_info">
                      Showing {lastIndex - recordsPage + 1} to {lastIndex} of{" "}
                      {fileListCount} entries
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

      <Offcanvas
        show={showOffcanvas}
        onHide={setShowOffcanvas}
        className="offcanvas-end customeoff"
        placement="end"
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="modal-title" id="#gridSystemModal">
            Updtade CCAPN{" "}
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
              <div className="col-md-4">
                <Form.Group controlId="tournamentList">
                  <Select
                    name="builder_name"
                    options={builderListDropDown}
                    value={selectedBuilderName}
                    onChange={handleSelectBuilderNameChange}
                    placeholder={"Select Builder Name"}
                    styles={{
                      container: (provided) => ({
                        ...provided,
                        color: 'black'
                      }),
                      menu: (provided) => ({
                        ...provided,
                        color: 'black'
                      }),
                    }}
                  />
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group controlId="tournamentList">
                  <Select
                    name="subdivision_name"
                    options={BuilderList}
                    value={selectedSubdivisionName}
                    onChange={handleSelectSubdivisionNameChange}
                    placeholder={"Select Subdivision Name"}
                    styles={{
                      container: (provided) => ({
                        ...provided,
                        color: 'black'
                      }),
                      menu: (provided) => ({
                        ...provided,
                        color: 'black'
                      }),
                    }}
                  />
                </Form.Group>
              </div>
              <div className="col-md-4">
                <button onClick={handleSubmit} className="btn btn-sm btn-primary">
                  Assign
                </button>

              </div>
            </div>
          </div>
        </div>
      </Offcanvas>
      <Modal show={show}>
        <Modal.Header closeButton onHide={handleClose}>
          <Modal.Title>Import CCAPNs CSV Data</Modal.Title>
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
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Import"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CCAPNList;