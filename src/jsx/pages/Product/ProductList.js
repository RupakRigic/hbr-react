import React, { useState, useEffect, useRef } from "react";

import AdminProductService from "../../../API/Services/AdminService/AdminProductService";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import ProductOffcanvas from "./ProductOffcanvas";
import MainPagetitle from "../../layouts/MainPagetitle";
import { Offcanvas, Form } from "react-bootstrap";
import { debounce } from "lodash";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import ClipLoader from "react-spinners/ClipLoader";

const ProductList = () => {
  const [Error, setError] = useState("");
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [productList, setProductList] = useState(null);
  // const [currentPage, setCurrentPage] = useState(1);
  // const recordsPage = 20;ProductDetails
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
  const [filterQuery, setFilterQuery] = useState({
    status: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  const product = useRef();

  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  const [ProductDetails, SetProductDetails] = useState({
    subdivision: "",
    product_code: "",
    name: "",
    status: "",
    stories: "",
    garage: "",
    pricechange: "",
    bathroom: "",
    recentprice: "",
    bedroom: "",
    recentpricesqft: "",
    sqft: "",
  });
  const [value, setValue] = React.useState("1");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getproductList = async () => {
    try {
      const response = await AdminProductService.index(searchQuery);
      const responseData = await response.json();
      setProductList(responseData);
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
      getproductList();
    } else {
      navigate("/");
    }
  }, []);
  const handleDelete = async (e) => {
    try {
      let responseData = await AdminProductService.destroy(e).json();
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
    // Update the name in the component's state
    getproductList();
  };

  const handleRowClick = async (id) => {
    try {
      let responseData = await AdminProductService.show(id).json();
      SetProductDetails(responseData);
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
    getproductList();
  }, [searchQuery]);

  const HandleSearch = (e) => {
    setIsLoading(true);
    const query = e.target.value.trim();
    debouncedHandleSearch(`?q=${query}`);
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
  const handlePriceClick = () => {
    navigate("/pricelist");
  };
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key) {
      direction = sortConfig.direction === "asc" ? "desc" : "asc";
    }
    setSortConfig({ key, direction });
  };
  const sortedData = () => {
    const sorted = [...ProductList];
    if (sortConfig.key !== "") {
      sorted.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
  
        // Check if aValue and bValue are null
        if (aValue === null || bValue === null) {
          // Handle null values by treating them as empty strings
          aValue = aValue || "";
          bValue = bValue || "";
        }
  
        // Convert string values to lowercase for case-insensitive sorting
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
        }
        if (typeof bValue === 'string') {
          bValue = bValue.toLowerCase();
        }  
        if (sortConfig.key === 'builderName' && a.subdivision.builder && b.subdivision.builder) {
          console.log(444);
          aValue = String(a.subdivision.builder.name).toLowerCase();
          bValue = String(b.subdivision.builder.name).toLowerCase();
        }
        if (sortConfig.key === 'builderCode' && a.builder && b.builder) {
          aValue = String(a.builder.builder_code).toLowerCase();
          bValue = String(b.builder.name).toLowerCase();
        }  
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          if (sortConfig.direction === 'asc') {
            return aValue - bValue;
          } else {
            return bValue - aValue;
          }
        } else {
          if (sortConfig.direction === 'asc') {
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
      <MainPagetitle
        mainTitle="Product"
        pageTitle="Product"
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
                      <h4 className="heading mb-0">Product List</h4>
                      <div
                        class="btn-group mx-5"
                        role="group"
                        aria-label="Basic example"
                      >
                        <button class="btn btn-secondary cursor-none">
                          {" "}
                          <i class="fas fa-search"></i>
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
                                <option value="0">Sold Out</option>
                                <option value="2">Future</option>
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
                        onClick={() => product.current.showEmployeModal()}
                      >
                        + Add Product
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
                            <th onClick={() => requestSort("builderName")}>
                              <strong>Builder name</strong>
                              {sortConfig.key !== "builderName"
                                ? "↑↓"
                                : ""}
                              {sortConfig.key === "builderName" && (
                                <span>
                                  {sortConfig.direction === "asc" ? "↑" : "↓"}
                                </span>
                              )}
                            </th>
                            <th>
                              <strong>Subdivision name</strong>
                            </th>
                            <th>
                              <strong>Name</strong>
                            </th>
                            <th>
                              <strong>Product Code</strong>
                            </th>
                            <th>
                              <strong>Stories</strong>
                            </th>
                            <th>
                              <strong>Recent Price</strong>
                            </th>
                            <th>
                              <strong>Recent Price SQFT</strong>
                            </th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody style={{ textAlign: "center" }}>
                          {productList !== null && productList.length > 0 ? (
                            productList.map((element, index) => (
                              <tr
                                onClick={() => handleRowClick(element.id)}
                                key={element.id}
                                style={{
                                  textAlign: "center",
                                  cursor: "pointer",
                                }}
                              >
                                <td>{index + 1}</td>
                                <td>{element.subdivision.builder.name}</td>
                                <td>{element.name}</td>
                                <td>{element.name}</td>
                                <td>{element.product_code}</td>
                                <td>{element.stories}</td>
                                <td>{element.recentprice}</td>
                                <td>{element.recentpricesqft}</td>
                                <td>
                                  <div className="d-flex">
                                    <Link
                                      to={`/productupdate/${element.id}`}
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
                                            <div className='dataTables_info'>
                                                Showing {lastIndex - recordsPage + 1} to{" "}
                                                {productList.length < lastIndex ? productList.length : lastIndex}
                                                {" "}of {productList.length} entries
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
                                                        <Link className={`paginate_button ${currentPage === n ? 'current' : ''} `} key={i}
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
      <ProductOffcanvas
        ref={product}
        Title="Add Product"
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
            Product Details{" "}
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
            <Box sx={{ width: "100%", typography: "body1" }}>
              <TabContext value={value}>
                <Box>
                  <TabList
                    onChange={handleChange}
                    aria-label="lab API tabs example"
                  >
                    <Tab label="Products Details" value="1" />
                    <Tab label="Base Price" value="2" />
                  </TabList>
                </Box>
                <TabPanel value="1" className="p-0">
                  <div className="row">
                    <div className="col-xl-4 mt-4">
                      <label className="">Subdivision:</label>
                      <div>
                        <span className="fw-bold">
                          {ProductDetails.subdivision.name || "NA"}
                        </span>
                      </div>
                    </div>

                    <div className="col-xl-4 mt-4">
                      <label className="">Product Code:</label>
                      <div>
                        <span className="fw-bold">
                          {ProductDetails.product_code || "NA"}
                        </span>
                      </div>
                    </div>

                    <div className="col-xl-4 mt-4">
                      <label className="">Name :</label>
                      <div>
                        <span className="fw-bold">
                          {ProductDetails.name || "NA"}
                        </span>
                      </div>
                    </div>

                    <div className="col-xl-4 mt-4">
                      <label className="">Stories:</label>
                      <div>
                        <span className="fw-bold">
                          {ProductDetails.stories || "NA"}
                        </span>
                      </div>
                    </div>

                    <div className="col-xl-4 mt-4">
                      <label className="">Status:</label>
                      <div>
                        <span className="fw-bold">
                          {ProductDetails.status === 1 && "Active"}
                          {ProductDetails.status === 0 && "Sold Out"}
                          {ProductDetails.status === 2 && "Future"}
                        </span>
                      </div>
                    </div>

                    <div className="col-xl-4 mt-4">
                      <label className="">Garage:</label>
                      <div>
                        <span className="fw-bold">
                          {ProductDetails.garage || "NA"}
                        </span>
                      </div>
                    </div>

                    <div className="col-xl-4 mt-4">
                      <label className="">Price Change:</label>
                      <div>
                        <span className="fw-bold">
                          {ProductDetails.pricechange || "NA"}
                        </span>
                      </div>
                    </div>

                    <div className="col-xl-4 mt-4">
                      <label className="">Bathroom:</label>
                      <div>
                        <span className="fw-bold">
                          {ProductDetails.bathroom || "NA"}
                        </span>
                      </div>
                    </div>

                    <div className="col-xl-4 mt-4">
                      <label className="">Recent Price:</label>
                      <div>
                        <span className="fw-bold">
                          {ProductDetails.recentprice || "NA"}
                        </span>
                      </div>
                    </div>

                    <div className="col-xl-4 mt-4">
                      <label className="">Bedroom :</label>
                      <div>
                        <span className="fw-bold">
                          {ProductDetails.bedroom || "NA"}
                        </span>
                      </div>
                    </div>

                    <div className="col-xl-4 mt-4">
                      <label className="">Recent Price SQFT:</label>
                      <div>
                        <span className="fw-bold">
                          {ProductDetails.recentpricesqft || "NA"}
                        </span>
                      </div>
                    </div>

                    <div className="col-xl-4 mt-4">
                      <label className="">SQFT:</label>
                      <div>
                        <span className="fw-bold">
                          {ProductDetails.sqft || "NA"}
                        </span>
                      </div>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel value="2" className="p-0">
                  <div className="card">
                    <div className="card-body p-0">
                      <div className="table-responsive active-projects style-1 ItemsCheckboxSec shorting">
                        <div
                          id="employee-tbl_wrapper"
                          className="dataTables_wrapper no-footer"
                        >
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
                                  <strong>Product Code</strong>
                                </th>
                                <th>
                                  <strong>Base Price</strong>
                                </th>
                                <th>
                                  <strong>Date</strong>
                                </th>
                              </tr>
                            </thead>
                            <tbody style={{ textAlign: "center" }}>
                              {ProductDetails.base_price &&
                              Array.isArray(ProductDetails.base_price) &&
                              ProductDetails.base_price.length > 0 ? (
                                ProductDetails.base_price.map(
                                  (element, index) => (
                                    <tr
                                      onClick={handlePriceClick}
                                      key={element.id}
                                      style={{
                                        textAlign: "center",
                                        cursor: "pointer",
                                      }}
                                    >
                                      <td>{index + 1}</td>

                                      <td>{ProductDetails.product_code}</td>
                                      <td>{element.baseprice}</td>
                                      <td>{element.date}</td>
                                    </tr>
                                  )
                                )
                              ) : (
                                <tr>
                                  <td
                                    colSpan="7"
                                    style={{ textAlign: "center" }}
                                  >
                                    No data found
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabPanel>
              </TabContext>
            </Box>
          </div>
        </div>
      </Offcanvas>
    </>
  );
};

export default ProductList;
