import React, { Fragment, useEffect, useState } from "react";
import MainPagetitle from "../../layouts/MainPagetitle";
import { Link, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import ClipLoader from "react-spinners/ClipLoader";
import swal from "sweetalert";
import Swal from "sweetalert2";
import AdminCCAPNService from "../../../API/Services/AdminService/AdminCCAPNService";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import DateComponent from "../../components/date/DateFormat";
import AdminBuilderService from "../../../API/Services/AdminService/AdminBuilderService";
import { Form, Offcanvas } from "react-bootstrap";
import Select from "react-select";
import AdminSubdevisionService from "../../../API/Services/AdminService/AdminSubdevisionService";
import InputMask from "react-input-mask";
import { MultiSelect } from "react-multi-select-component";

const CCAPNList = () => {
  const [selectedLandSales, setSelectedLandSales] = useState([]);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterQuery, setFilterQuery] = useState({
    parcel: "",
    address: "",
    builder_name: "",
    subdivision_name: "",
    subdivision_code: ""
  });
  const [BuilderList, setBuilderList] = useState([]);
  const [selectedSubdivisionId, setSelectedSubdivisionId] = useState([]);
  const [selectedBuilderId, setSelectedBuilderId] = useState([]);
  const [selectedSubdivisionNameFilter, setSelectedSubdivisionNameFilter] = useState([]);
  const [selectedBuilderNameFilter, setSelectedBuilderNameFilter] = useState([]);
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
  const [show, setShow] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const [selectedFileError, setSelectedFileError] = useState("");
  const [showSortingPopup, setShowSortingPopup] = useState(false);
  const HandleSortingPopupShow = () => setShowSortingPopup(true);
  const handleSortingPopupClose = () => setShowSortingPopup(false);
  const [selectedFields, setSelectedFields] = useState(() => {
    const saved = localStorage.getItem("selectedFieldsCCAPNs");
    return saved ? JSON.parse(saved) : [];
  });
  const [selectionOrder, setSelectionOrder] = useState(() => {
    const saved = localStorage.getItem("selectionOrderCCAPNs");
    return saved ? JSON.parse(saved) : {};
  });
  const [sortOrders, setSortOrders] = useState(() => {
    const saved = localStorage.getItem("sortOrdersCCAPNs");
    return saved ? JSON.parse(saved) : {};
  });
  const [sortConfig, setSortConfig] = useState([]);
  const [manageFilterOffcanvas, setManageFilterOffcanvas] = useState(false);
  const [builderDropDown, setBuilderDropDown] = useState([]);
  const [subdivisionDropDown, setSubdivisionDropDown] = useState([]);

  useEffect(() => {
    if(selectedFields){
      localStorage.setItem("selectedFieldsCCAPNs", JSON.stringify(selectedFields));
    }
    if(selectionOrder){
      localStorage.setItem("selectionOrderCCAPNs", JSON.stringify(selectionOrder));
    }
    if(sortOrders){
      localStorage.setItem("sortOrdersCCAPNs", JSON.stringify(sortOrders));
    }
  }, [selectedFields, selectionOrder, sortOrders]);

  useEffect(() => {
    setSearchQuery(filterString());
  }, [filterQuery]);

  useEffect(() => {
    getbuilderDoplist();
    GetBuilderDropDownList();
    GetSubdivisionDropDownList();
  }, []);

  useEffect(() => {
    if (localStorage.getItem("usertoken")) {
      if (!manageFilterOffcanvas) {
        GetCCAPNList(currentPage, sortConfig, searchQuery);
      }
    } else {
      navigate("/");
    }
  }, [currentPage, searchQuery]);

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

  const GetBuilderDropDownList = async () => {
    try {
      const response = await AdminBuilderService.builderDropDown();
      const responseData = await response.json();
      const formattedData = responseData.map((builder) => ({
        label: builder.name,
        value: builder.id,
      }));
      setBuilderDropDown(formattedData);
    } catch (error) {
      setError("Something went wrong!");
    }
  };

  const GetSubdivisionDropDownList = async () => {
    try {
      const response = await AdminSubdevisionService.subdivisionDropDown();
      const responseData = await response.json();
      const formattedData = responseData.data.map((subdivision) => ({
        label: subdivision.name,
        value: subdivision.id,
      }));
      setSubdivisionDropDown(formattedData);
    } catch (error) {
      setError("Something went wrong!");
    }
  };

  const getbuilderlist = async (builderId) => {
    try {
      const response = await AdminSubdevisionService.Subdivisionbybuilderid(builderId);
      const responseData = await response.json();
      const formattedData = responseData.data.map((subdivision) => ({
        label: subdivision.name,
        value: subdivision.id,
      }));
      setBuilderList(formattedData);
      setIsLoading(false);
    } catch (error) {
      setError("Something went wrong!");
    }
  };

  const handleSelectBuilderNameChange = (e) => {
    setSelectedBuilderId(e);
    getbuilderlist(e.value);
  };

  const handleSelectBuilderNameChangeFilter = (selectedItems) => {
    const selectedNames = selectedItems.map(item => item.label).join(', ');
    setSelectedBuilderNameFilter(selectedItems);
    setFilterQuery(prevState => ({
      ...prevState,
      builder_name: selectedNames
    }));
  }

  const handleSelectSubdivisionNameChangeFilter = (selectedItems) => {
    const selectedNames = selectedItems.map(item => item.label).join(', ');
    setSelectedSubdivisionNameFilter(selectedItems);
    setFilterQuery(prevState => ({
      ...prevState,
      subdivision_name: selectedNames
    }));
  };



  const fieldOptions = [
    { value: "builderName", label: "Builder" },
    { value: "subdivisionName", label: "Subdivision" },
    { value: "parcel", label: "Parcel Number" },
    { value: "loc_strno", label: "Full Address" },
    { value: "ll_x", label: "Latitude" },
    { value: "ll_y", label: "Longitude" },
    { value: "subdivision_code", label: "Sub ID" },
    { value: "permits", label: "Permits" },
    { value: "closings", label: "Closings" },
    { value: "updated_at", label: "Modification Date" },
  ];

  const handleApplySorting = () => {
    const sortingConfig = selectedFields.map((field) => ({
      key: field.value,
      direction: sortOrders[field.value] || 'asc',
    }));
    setSortConfig(sortingConfig)
    GetCCAPNList(currentPage, sortingConfig, searchQuery);
    handleSortingPopupClose();
  };

  const handleSelectSubdivisionNameChange = (e) => {
    setSelectedSubdivisionId(e);
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
    setError("");
    setSelectedFileError("");
    // GetCCAPNList(currentPage, sortConfig, searchQuery);
  };

  const SyestemUserRole = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).role
    : "";

  const getbuilderDoplist = async () => {
    try {
      const response = await AdminBuilderService.builderDropDown();
      const responseData = await response.json();
      const formattedData = responseData.map((builder) => ({
        label: builder.name,
        value: builder.id,
      }));
      setBuilderListDropDown(formattedData);
    } catch (error) {
      setError("Something went wrong!");
    }
  };

  const stringifySortConfig = (sortConfig) => {
    return sortConfig.map((sort) => `${sort.key}:${sort.direction}`).join(",");
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
      setNpage(Math.ceil(responseData.meta.total / recordsPage));
      setFileListCount(responseData.meta.total);
    } catch (error) {
      setIsLoading(false);
      setError("Something went wrong!");
    }
    setIsLoading(false);
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

            document.getElementById("fileInput").value = null;

            if (response.data.status) {
              setShow(false);
              swal(response.data.message).then((willDelete) => {
                if (willDelete) {
                  GetCCAPNList(currentPage, sortConfig, searchQuery);
                }
              });
            } else {
                setShow(false);
                swal(response.data.message).then((willDelete) => {
                  if (willDelete) {
                    GetCCAPNList(currentPage, sortConfig, searchQuery);
                  }
                });
            }
          }
        } catch (error) {
          setSelectedFile("");
          setError("Something went wrong!");
          document.getElementById("fileInput").value = null;
          setIsLoading(false);
          break;
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
            subdivision_id: selectedSubdivisionId?.value,
          };
          const data = await AdminCCAPNService.bulkupdate(selectedLandSales, userData).json();
          if (data.status === true) {
            swal("Ccapn Updated Succesfully").then((willDelete) => {
              if (willDelete) {
                setShowOffcanvas(false);
                setSelectedBuilderId([]);
                setSelectedSubdivisionId([]);
                setSelectedLandSales([]);
                setSelectedBuilderNameFilter([]);
                setSelectedSubdivisionNameFilter([]);
                GetCCAPNList(currentPage, sortConfig, searchQuery);
              }
            });
          } else {
            Swal.fire({
              icon: 'error',
              html: `Something went wrong!`,
              confirmButtonText: 'OK',
              showCancelButton: false,
            });
          }
        } catch (error) {
          Swal.fire({
            icon: 'error',
            html: `Something went wrong!`,
            confirmButtonText: 'OK',
            showCancelButton: false,
          });
        }
      }
    });
  };

  const handleSortingCheckboxChange = (e, field) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setSelectedFields([...selectedFields, field]);
      setSelectionOrder((prevOrder) => ({
        ...prevOrder,
        [field.value]: Object.keys(prevOrder).length + 1,
      }));
    } else {
      setSelectedFields(selectedFields.filter((selected) => selected.value !== field.value));
      setSelectionOrder((prevOrder) => {
        const newOrder = { ...prevOrder };
        delete newOrder[field.value];
        const remainingFields = selectedFields.filter((selected) => selected.value !== field.value);
        remainingFields.forEach((field, index) => {
          newOrder[field.value] = index + 1;
        });
        return newOrder;
      });
    }
  };

  const handleSortOrderChange = (fieldValue, order) => {
    setSortOrders({
      ...sortOrders,
      [fieldValue]: order,
    });
  };

  const handleSelectAllChange = (e) => {
    if (e.target.checked) {
      setSelectedFields(fieldOptions);
      const newOrder = {};
      fieldOptions.forEach((field, index) => {
        newOrder[field.value] = index + 1;
      });
      setSelectionOrder(newOrder);
    } else {
      setSelectedFields([]);
      setSelectionOrder({});
    }
  };

  const HandleFilterForm = (e) => {
    e.preventDefault();
    GetCCAPNList(1, sortConfig, searchQuery);
    setManageFilterOffcanvas(false);
  };

  const HandleCancelFilter = (e) => {
    e.preventDefault();
    setFilterQuery({
      parcel: "",
      address: "",
      builder_name: "",
      subdivision_name: "",
      subdivision_code: "",
    });
    setSelectedBuilderNameFilter([]);
    setSelectedSubdivisionNameFilter([]);
    GetCCAPNList(1, sortConfig, "");
  }

  return (
    <Fragment>
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
                            value={selectedBuilderId}
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
                                zIndex: 999
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
                            value={selectedSubdivisionId}
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
                                zIndex: 999
                              }),
                            }}
                          />
                        </Form.Group>
                      </div>
                      <button
                        onClick={handleSubmit}
                        className="btn btn-sm btn-primary me-3"
                      >
                        Assign
                      </button>
                    </div>

                    <div className="mt-2">
                      {SyestemUserRole == "Data Uploader" ||
                        SyestemUserRole == "User" ||
                        SyestemUserRole == "Standard User" ? (
                        ""
                      ) : (
                        <div className="d-flex justify-content-between">
                          <div className="me-3">
                            <Button
                              className="btn-sm"
                              variant="secondary"
                              onClick={HandleSortingPopupShow}
                              title="Sorted Fields"
                            >
                              <div style={{ fontSize: "11px" }}>
                                <i class="fa-solid fa-sort" />&nbsp;
                                Sort
                              </div>
                            </Button>
                          </div>

                          <div className="me-3">
                            <button className="btn btn-success btn-sm me-1" onClick={() => setManageFilterOffcanvas(true)} title="Filter">
                              <div style={{ fontSize: "11px" }}>
                                <i className="fa fa-filter" />&nbsp;
                                Filter
                              </div>
                            </button>
                          </div>

                          <div>
                            <Button
                              className="btn-sm me-1"
                              variant="secondary"
                              onClick={handlBuilderClick}
                            >
                              <div style={{ fontSize: "11px" }}>
                                <i className="fas fa-file-import" />&nbsp;
                                Import
                              </div>
                            </Button>
                          </div>
                        </div>
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
                      style={{width: "360px"}}
                    >
                      <Link
                        className="paginate_button previous disabled"
                        to="#"
                        onClick={prePage}
                        style={{width: "50px"}}
                      >
                        <i className="fa-solid fa-angle-left" />
                      </Link>
                      <span style={{width : "215px"}}>
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
                                  style={{width: "50px"}}
                                >
                                  {n}
                                </Link>
                              );
                            } else if (i === 1 || i === number.length - 2) {
                              return <span key={i} style={{width: "50px"}}>...</span>;
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
                                style={{width: "50px"}}
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
                        style={{width: "50px"}}
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
                                checked={selectedLandSales.length === ccapnList.length}
                                onChange={(e) =>
                                  e.target.checked
                                    ? setSelectedLandSales(
                                      ccapnList.map((user) => user.id)
                                    )
                                    : setSelectedLandSales([])
                                }
                              />
                            </th>
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
                                    checked={selectedLandSales.includes(element.id)}
                                    onChange={(e) => handleEditCheckboxChange(e, element.id)}
                                    style={{
                                      cursor: "pointer",
                                    }}
                                  />
                                </td>
                                <td style={{ textAlign: "center" }}>{index + 1}</td>
                                <td style={{ textAlign: "center" }}>{element?.subdivision?.builder?.name}</td>
                                <td style={{ textAlign: "center" }}>{element?.subdivision?.name}</td>
                                <td style={{ textAlign: "center" }}>{element?.parcel}</td>
                                <td style={{ textAlign: "center" }}>{(element?.loc_strno == 0 || element?.loc_strno == null) ? "" : (element?.loc_strno + " " + element?.loc_strname)}</td>
                                <td style={{ textAlign: "center" }}>{element?.ll_x}</td>
                                <td style={{ textAlign: "center" }}>{element?.ll_y}</td>
                                <td style={{ textAlign: "center" }}>{element?.subdivision?.subdivision_code}</td>
                                <td style={{ textAlign: "center" }}>{element?.permit}</td>
                                <td style={{ textAlign: "center" }}>{element?.closing}</td>
                                <td style={{ textAlign: "center" }}><DateComponent date={element.updated_at} /></td>
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
                  <div className="d-sm-flex text-center justify-content-between align-items-center dataTables_wrapper no-footer">
                    <div className="dataTables_info">
                      Showing {lastIndex - recordsPage + 1} to {lastIndex} of{" "}
                      {fileListCount} entries
                    </div>
                    <div
                      className="dataTables_paginate paging_simple_numbers justify-content-center"
                      id="example2_paginate"
                      style={{width: "360px"}}
                    >
                      <Link
                        className="paginate_button previous disabled"
                        to="#"
                        onClick={prePage}
                        style={{width: "50px"}}
                      >
                        <i className="fa-solid fa-angle-left" />
                      </Link>
                      <span style={{width : "215px"}}>
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
                                  style={{width: "50px"}}
                                >
                                  {n}
                                </Link>
                              );
                            } else if (i === 1 || i === number.length - 2) {
                              return <span key={i} style={{width: "50px"}}>...</span>;
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
                                style={{width: "50px"}}
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
                        style={{width: "50px"}}
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
                    value={selectedBuilderId}
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
                        zIndex: 999
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
                    value={selectedSubdivisionId}
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
                        zIndex: 999
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
          <p className="text-danger mt-2">
            {selectedFileError || Error}
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

      {/* Sorting */}
      <Modal show={showSortingPopup} onHide={HandleSortingPopupShow}>
        <Modal.Header handleSortingPopupClose>
          <Modal.Title>Sorted Fields</Modal.Title>
          <button
            className="btn-close"
            aria-label="Close"
            onClick={() => handleSortingPopupClose()}
          ></button>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <div className="row">
            <div style={{ marginTop: "-15px" }}>
              <label className="form-label" style={{ fontWeight: "bold", fontSize: "15px" }}>List of Fields:</label>
              <div className="field-checkbox-list">
                <div className="form-check d-flex align-items-center mb-2" style={{ width: '100%' }}>
                  <div className="d-flex align-items-center" style={{ flex: '0 0 40%' }}>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="select-all-fields"
                      checked={selectedFields.length === fieldOptions.length}
                      onChange={handleSelectAllChange}
                      style={{ marginRight: '0.2rem', cursor: "pointer" }}
                    />
                    <label className="form-check-label mb-0" htmlFor="select-all-fields" style={{ width: "150px", cursor: "pointer" }}>
                      Select All
                    </label>
                  </div>
                </div>

                {fieldOptions.map((field, index) => {
                  const isChecked = selectedFields.some(selected => selected.value === field.value);
                  const fieldOrder = selectionOrder[field.value]; // Get the selection order

                  return (
                    <div key={index} className="form-check d-flex align-items-center mb-2" style={{ width: '100%', height: "40px" }}>
                      <div className="d-flex align-items-center" style={{ flex: '0 0 40%' }}>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={`field-checkbox-${index}`}
                          value={field.value}
                          checked={isChecked}
                          onChange={(e) => handleSortingCheckboxChange(e, field)}
                          style={{ marginRight: '0.2rem', cursor: "pointer" }}
                        />
                        <label className="form-check-label mb-0" htmlFor={`field-checkbox-${index}`} style={{ width: "150px", cursor: "pointer" }}>
                          {isChecked && <span>{fieldOrder}. </span>}
                          {field.label}
                        </label>
                      </div>

                      {isChecked && (
                        <div className="radio-group d-flex" style={{ flex: '0 0 60%', paddingTop: "5px" }}>
                          <div className="form-check form-check-inline" style={{ flex: '0 0 50%' }}>
                            <input
                              type="radio"
                              className="form-check-input"
                              name={`sortOrder-${field.value}`}
                              id={`asc-${field.value}`}
                              value="asc"
                              checked={sortOrders[field.value] === 'asc' || !sortOrders[field.value]}
                              onChange={() => handleSortOrderChange(field.value, 'asc')}
                              style={{ cursor: "pointer" }}
                            />
                            <label className="form-check-label mb-0" htmlFor={`asc-${field.value}`} style={{ cursor: "pointer", marginLeft: "-40px" }}>
                              Ascending
                            </label>
                          </div>
                          <div className="form-check form-check-inline" style={{ flex: '0 0 50%' }}>
                            <input
                              type="radio"
                              className="form-check-input"
                              name={`sortOrder-${field.value}`}
                              id={`desc-${field.value}`}
                              value="desc"
                              checked={sortOrders[field.value] === 'desc'}
                              onChange={() => handleSortOrderChange(field.value, 'desc')}
                              style={{ cursor: "pointer" }}
                            />
                            <label className="form-check-label mb-0" htmlFor={`desc-${field.value}`} style={{ cursor: "pointer", marginLeft: "-30px" }}>
                              Descending
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleSortingPopupClose} style={{ marginRight: "10px" }}>Close</Button>
          <Button variant="success" onClick={() => handleApplySorting(selectedFields, sortOrders)}>Apply</Button>
        </Modal.Footer>
      </Modal>

      {/* Filter Canvas */}
      <Offcanvas
        show={manageFilterOffcanvas}
        onHide={setManageFilterOffcanvas}
        className="offcanvas-end customeoff"
        placement="end"
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="modal-title" id="#gridSystemModal">
            Filter CCAPNs{" "}
          </h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setManageFilterOffcanvas(false)}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="offcanvas-body">
          <div className="container-fluid">
            <div className="">
              <form>
                <div className="row">
                  <div className="col-md-4 mt-3">
                    <label className="form-label">Parcel:</label>
                    <InputMask
                      // mask="999-99-999-999"
                      maskChar=""
                      type="search"
                      name="parcel"
                      value={filterQuery.parcel}
                      className="form-control"
                      onChange={HandleFilter}
                    />
                  </div>
                  <div className="col-md-4 mt-3">
                    <label className="form-label">Address:</label>
                    <input type="search" name="address" className="form-control" value={filterQuery.address} onChange={HandleFilter} />
                  </div>
                  <div className="col-md-4 mt-3">
                    <label className="form-label">Subdivision Code:</label>
                    <input type="search" name="subdivision_code" value={filterQuery.subdivision_code} className="form-control" onChange={HandleFilter} />
                  </div>
                  <div className="col-md-4 mt-3">
                    <label className="form-label">BUILDER NAME:</label>
                    <Form.Group controlId="tournamentList">
                      <MultiSelect
                        name="builder_name"
                        options={builderDropDown || []}
                        value={selectedBuilderNameFilter}
                        onChange={handleSelectBuilderNameChangeFilter}
                        placeholder={"Select Builder Name"}
                      />
                    </Form.Group>
                  </div>
                  <div className="col-md-4 mt-3">
                    <label className="form-label">SUBDIVISION NAME:</label>
                    <Form.Group controlId="tournamentList">
                      <MultiSelect
                        name="subdivision_name"
                        options={subdivisionDropDown || []}
                        value={selectedSubdivisionNameFilter}
                        onChange={handleSelectSubdivisionNameChangeFilter}
                        placeholder={"Select Subdivision Name"}
                      />
                    </Form.Group>
                  </div>
                </div>
              </form>
            </div>
            <br />
            <div className="d-flex justify-content-between">
              <Button
                className="btn-sm"
                variant="secondary"
                onClick={HandleCancelFilter}
              >
                Reset
              </Button>
              <Button
                className="btn-sm"
                variant="primary"
                onClick={HandleFilterForm}
              >
                Filter
              </Button>
            </div>
          </div>
        </div>
      </Offcanvas>
    </Fragment>
  );
};

export default CCAPNList;