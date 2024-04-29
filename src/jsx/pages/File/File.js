import React, { useState, useEffect, useRef } from "react";

import AdminCSVFileService from "../../../API/Services/AdminService/AdminCSVFileService";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import FileOffcanvas from "./FileOffcanvas";
import MainPagetitle from "../../layouts/MainPagetitle";
import { Offcanvas, Form } from "react-bootstrap";
import { debounce } from "lodash";
import ClipLoader from "react-spinners/ClipLoader";
import AccessField from "../../components/AccssFieldComponent/AccessFiled";

const File = () => {
  const [Error, setError] = useState("");
  const navigate = useNavigate();
  const [productList, setProductList] = useState([]);
  const [fileListCount, setFileListCount] = useState('');
  const [TotalFileListCount, setTotalFileListCount] = useState('');
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  // const [currentPage, setCurrentPage] = useState(1);
  // const recordsPage = 20;
  // const lastIndex = currentPage * recordsPage;
  // const firstIndex = lastIndex - recordsPage;
  // const records = productList.slice(firstIndex, lastIndex);
  // const npage = Math.ceil(productList.length / recordsPage)
  // const number = [...Array(npage + 1).keys()].slice(1)
  // function prePage() {
  //     if (currentPage !== 1) {
  //         setCurrentPage(currentPage - 1)
  //     }
  // }
  // function changeCPage(id) {
  //     setCurrentPage(id);
  // }
  // function nextPage() {
  //     if (currentPage !== npage) {
  //         setCurrentPage(currentPage + 1)
  //     }
  // }

  const [manageAccessOffcanvas, setManageAccessOffcanvas] = useState(false);
  const [accessList, setAccessList] = useState({});
  const [accessRole, setAccessRole] = useState("Admin");
  const [accessForm, setAccessForm] = useState({});
  const [role, setRole] = useState("Admin");
  const [checkedItems, setCheckedItems] = useState({}); // State to manage checked items
  const fieldList = AccessField({ tableName: "csv" });

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
      table: "csv",
    };
    try {
      const data = await AdminCSVFileService.manageAccessFields(
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
      const response = await AdminCSVFileService.accessField();
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

  const File = useRef();

  const getproductList = async () => {
    try {
      const response = await AdminCSVFileService.index(searchQuery);
      const responseData = await response.json();
      setProductList(responseData);
      setIsLoading(false);
      setFileListCount(responseData.length);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(errorJson.message);
      }
    }
  };
  useEffect(() => {
    if (localStorage.getItem("usertoken")) {
      getproductList();
    } else {
      navigate("/");
    }
  }, []);
  const getproductListCount = async () => {
    try {
      const response = await AdminCSVFileService.index();
      const responseData = await response.json();
      setTotalFileListCount(responseData.length);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setError(errorJson.message);
      }
    }
  };
  useEffect(() => {
    if (localStorage.getItem("usertoken")) {
      getproductListCount();
    } else {
      navigate("/");
    }
  }, []);
  const handleDelete = async (e) => {
    try {
      let responseData = await AdminCSVFileService.destroy(e).json();
      if (responseData.status === true) {
        getproductList();
      }
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(errorJson.message);
      }
    }
  };
  const handleCallback = () => {
    getproductList();
  };
  const debouncedHandleSearch = useRef(
    debounce((value) => {
      setSearchQuery(value);
    }, 1000)
  ).current;

  useEffect(() => {
    getproductList();
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
    const sorted = [...productList];
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
          a.subdivision.builder &&
          b.subdivision.builder
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

  return (
    <>
      <MainPagetitle mainTitle="File" pageTitle="File" parentTitle="Home" />
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-12">
            <div className="card">
              <div className="card-body p-0">
                <div className="table-responsive active-projects style-1 ItemsCheckboxSec shorting">
                  <div className="tbl-caption d-flex justify-content-between text-wrap align-items-center">
                    <div className="d-flex text-nowrap justify-content-between align-items-center">
                      <h4 className="heading mb-0">File List</h4>
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
                      <button
                        className="btn btn-primary btn-sm me-1"
                        onClick={() => setManageAccessOffcanvas(true)}
                      >
                        {" "}
                        Field Access
                      </button>
                      <Link
                        to={"#"}
                        className="btn btn-primary btn-sm ms-1"
                        data-bs-toggle="offcanvas"
                        onClick={() => File.current.showEmployeModal()}
                      >
                        + Add File
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
                            {checkFieldExist("Title") && (
                              <th onClick={() => requestSort("name")}>
                                <strong>
                                  Title
                                  {sortConfig.key !== "name" ? "↑↓" : ""}
                                  {sortConfig.key === "name" && (
                                    <span>
                                      {sortConfig.direction === "asc"
                                        ? "↑"
                                        : "↓"}
                                    </span>
                                  )}
                                </strong>
                              </th>
                            )}{" "}
                            {checkFieldExist("Download") && (
                              <th>
                                <strong>Download</strong>
                              </th>
                            )}
                            {checkFieldExist("Action") && (
                              <th className="d-flex justify-content-end">
                                <strong>Action</strong>
                              </th>
                            )}
                          </tr>
                        </thead>
                        <tbody style={{ textAlign: "center" }}>
                          {sortedData() !== null && sortedData().length > 0 ? (
                            sortedData().map((element, index) => (
                              <tr style={{ textAlign: "center" }}>
                                <td>{index + 1}</td>
                                {checkFieldExist("Title") && (
                                  <td>{element.name}</td>
                                )}
                                {checkFieldExist("Download") && (
                                  <td>
                                    <a
                                      href={
                                        process.env.REACT_APP_IMAGE_URL +
                                        "Files/" +
                                        element.csv
                                      }
                                    >
                                      Click Here
                                    </a>
                                  </td>
                                )}
                                {checkFieldExist("Action") && (
                                  <td>
                                    <div>
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
                    <div className="dataTables_info">
                         Showing {fileListCount} of {TotalFileListCount} 
                      </div>
                    {/* <div className="d-sm-flex text-center justify-content-between align-items-center">
                      <div className="dataTables_info">
                        Showing {lastIndex - recordsPage + 1} to{" "}
                        {productList.length < lastIndex
                          ? productList.length
                          : lastIndex}{" "}
                        of {productList.length} entries
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
      <FileOffcanvas
        ref={File}
        Title="Add File"
        parentCallback={handleCallback}
      />
      <Offcanvas
        show={manageAccessOffcanvas}
        onHide={setManageAccessOffcanvas}
        className="offcanvas-end customeoff"
        placement="end"
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="modal-title" id="#gridSystemModal">
            Manage Files Fields Access{" "}
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

export default File;
