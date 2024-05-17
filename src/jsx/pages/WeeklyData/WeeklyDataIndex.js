import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import AdminWeeklyDataService from "../../../API/Services/AdminService/AdminWeeklyDataService";
import WeeklyDataOffcanvas from "./WeeklyDataOffcanvas";
import SubdivisionOffcanvas from "./SubdivisionOffcanvas";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import MainPagetitle from "../../layouts/MainPagetitle";
import AdminSubdevisionService from "../../../API/Services/AdminService/AdminSubdevisionService";
const WeeklyDataIndex = () => {
  const [Error, setError] = useState("");
  const [BuilderList, setBuilderList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPage = 20;
  const lastIndex = currentPage * recordsPage;
  const firstIndex = lastIndex - recordsPage;
  const records = BuilderList.slice(firstIndex, lastIndex);
  const npage = Math.ceil(BuilderList.length / recordsPage);
  const number = [...Array(npage + 1).keys()].slice(1);
  const subdivision = useRef();
  const [formData, setFormData] = useState({});

  const handleCallback = () => {
    getWeeklyList();
  };
  const navigate = useNavigate();
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
  useEffect(() => {
    if (localStorage.getItem("usertoken")) {
      getWeeklyList();
    } else {
      navigate("/");
    }
  }, []);
  const getWeeklyList = async () => {
    try {
      const response = await AdminWeeklyDataService.index(
        localStorage.getItem("enddate"),
        localStorage.getItem("builderId")
      );
      const responseData = await response.json();
      console.log(responseData);
      const updatedData = responseData.map((element) => ({
        ...element,
        net_sales:
          element.weekly_data[0].gross_sales -
          element.weekly_data[0].cancelations,
      }));
  
      setBuilderList(updatedData);
    } catch (error) {
      console.log(444);
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(errorJson.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };
  
  useEffect(() => {
    getWeeklyList();
  }, []);
  const handleDelete = async (e) => {
    try {
      let responseData = await AdminWeeklyDataService.destroy(e).json();
      if (responseData.status === true) {
        getWeeklyList();
      }
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(errorJson.message);
      }
    }
  };


  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };


  const handleStatusChange = async (event,id) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (id == undefined) {
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
          console.log("created sucessfully");
          getWeeklyList();
        }
      } catch (error) {
        if (error.name === "HTTPError") {
          const errorJson = await error.response.json();

          setError(
            errorJson.message.substr(0, errorJson.message.lastIndexOf("."))
          );
        }
      }
    } else {
      if(formData.status =='on')
      {
        formData.status = false;
      }else{
        formData.status = true;
      }
      try {
        const data = await AdminWeeklyDataService.put(id, formData).json();
        if (data.status === true) {
          getWeeklyList();
          setFormData({});
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

  };
  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const handleSubmit = async (event, id) => {
    event.preventDefault();
    
    if (id == undefined) {
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
        }
      } catch (error) {
        if (error.name === "HTTPError") {
          const errorJson = await error.response.json();

          setError(
            errorJson.message.substr(0, errorJson.message.lastIndexOf("."))
          );
        }
      }
    } else {
      try {
        const data = await AdminWeeklyDataService.put(id, formData).json();
        if (data.status === true) {
            getWeeklyList();
          setFormData({});
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
  };

  return (
    <>
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
                    <Link
                        to={"#"}
                        className="btn btn-primary btn-sm ms-1"
                        data-bs-toggle="offcanvas"
                        onClick={() => subdivision.current.showEmployeModal()}
                      >
                        + Add Subdivision
                      </Link>
                  </div>
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
                            <strong> Week Ending &nbsp;</strong>
                          </th>
                          <th>
                            <strong> Status</strong>
                          </th>
                          <th>
                            <strong> Subdivision</strong>
                          </th>
                          <th>
                            <strong> Weekly Traffic </strong>
                          </th>
                          <th>
                            <strong> Gross Sales </strong>
                          </th>
                          <th>
                            <strong> - </strong>
                          </th>
                          <th>
                            <strong> cancelations </strong>
                          </th>
                          <th>
                            <strong> = </strong>
                          </th>
                          <th>
                            <strong> Net Sales</strong>
                          </th>
                          <th>
                            <strong> Current Lots Released </strong>
                          </th>
                          <th>
                            <strong>Current Unsold Standing Inventory</strong>
                          </th>
                          <th>
                            {" "}
                            {/* <strong> Action </strong> */}
                          </th>
                        </tr>
                      </thead>
                      <tbody style={{ textAlign: "center" }}>
                        {records.map((element, index) => {
                          return (
                            
                            <tr style={{ textAlign: "center" }}>
                              <td>{element.weekly_data[0].week_ending_date}</td>
                              <td>
                                <div class="form-check form-switch">
                                  <input
                                    name="status"
                                    class="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    id="flexSwitchCheckDefault"
                                    //defaultChecked={element.weekly_data[0].status}
                                    onChange={(event) =>
                                      {
                                        handleStatusChange(
                                          event,
                                          element.weekly_data[0].id,
                                        )
                                      } 
                                    }
                                    />
                                </div>
                              </td>
                              <td>{element.name}</td>
                              <td>
                                <input
                                  type="number"
                                  defaultValue={
                                    element.weekly_data[0].weekly_traffic
                                  }
                                  className="form-control"
                                  name="weekly_traffic"
                                  onKeyDown={(event) => {
                                    if (event.key == "Enter") {
                                      handleSubmit(
                                        event,
                                        element.weekly_data[0].id,
                                        element
                                      );
                                    }
                                  }}
                                  onChange={handleChange}
                                />{" "}
                              </td>
                              <td>
                                <input
                                  type="number"
                                  defaultValue={
                                    element.weekly_data[0].gross_sales
                                  }
                                  className="form-control"
                                  name="gross_sales"
                                  onKeyDown={(event) => {
                                    if (event.key == "Enter") {
                                      handleSubmit(
                                        event,
                                        element.weekly_data[0].id,
                                        element
                                      );
                                    }
                                  }}
                                  onChange={handleChange}
                                />{" "}
                              </td>
                              <td></td>
                              <td>
                                <input
                                  type="number"
                                  defaultValue={
                                    element.weekly_data[0].cancelations
                                  }
                                  className="form-control"
                                  name="cancelations"
                                  onKeyDown={(event) => {
                                    if (event.key == "Enter") {
                                      handleSubmit(
                                        event,
                                        element.weekly_data[0].id,
                                        element
                                      );
                                    }
                                  }}
                                  onChange={handleChange}
                                />{" "}
                              </td>
                              <td></td>
                              <td>{element.net_sales}</td>
                              <td>
                                <input
                                  type="number"
                                  defaultValue={
                                    element.weekly_data[0].current_lots_released
                                  }
                                  className="form-control"
                                  name="current_lots_released"
                                  onKeyDown={(event) => {
                                    if (event.key == "Enter") {
                                      handleSubmit(
                                        event,
                                        element.weekly_data[0].id,
                                        element
                                      );
                                    }
                                  }}
                                  onChange={handleChange}
                                />{" "}
                              </td>
                              <td>
                                <td>
                                  <input
                                    type="hidden"
                                    name="subdivision_id"
                                    value={
                                      element.weekly_data[0].subdivision_id
                                    }
                                  />
                                  <input
                                    type="number"
                                    defaultValue={
                                      element.weekly_data[0]
                                        .current_un_sold_standing_inventory
                                    }
                                    className="form-control"
                                    name="current_un_sold_standing_inventory"
                                    onKeyDown={(event) => {
                                      if (event.key == "Enter") {
                                        handleSubmit(
                                          event,
                                          element.weekly_data[0].id,
                                          element
                                        );
                                      }
                                    }}
                                    onChange={handleChange}
                                  />{" "}
                                      
                              </td>
                              </td>
                            </tr>
                           
                          );
                        })}
                      </tbody>
                    </table>
                    <div className="d-sm-flex text-center justify-content-between align-items-center">
                      <div className="dataTables_info">
                        Showing {lastIndex - recordsPage + 1} to{" "}
                        {BuilderList.length < lastIndex
                          ? BuilderList.length
                          : lastIndex}{" "}
                        of {BuilderList.length} entries
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
      {/* <WeeklyDataOffcanvas
        ref={subdivision}
        Title="Add Subdivision"
        parentCallback={handleCallback}
      /> */}
    </>
  );
};

export default WeeklyDataIndex;
