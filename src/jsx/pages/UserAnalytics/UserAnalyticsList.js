import React, { Fragment, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';
import { Tabs, Tab } from 'react-bootstrap';
import AdminUserRoleService from '../../../API/Services/AdminService/AdminUserRoleService';
import MainPagetitle from '../../layouts/MainPagetitle';

const UserAnalyticsList = () => {
    const navigate = useNavigate();
    const params = useParams();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [userName, setUserName] = useState("");
    const [userActivityLogList, setUserActivityLogList] = useState([]);
    const [userActivityLogListCount, setUserActivityLogListCount] = useState(0);
    const [activeKey, setActiveKey] = useState("login");
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPage = 10;
    const lastIndex = currentPage * recordsPage;
    const [npage, setNpage] = useState(0);
    const number = [...Array(npage + 1).keys()].slice(1);

    useEffect(() => {
        if (localStorage.getItem("usertoken")) {
            GetUserActivityLog(params.id);
        } else {
            navigate("/");
        }
    }, [currentPage, activeKey]);

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

    const GetUserActivityLog = async (id) => {
        setIsLoading(true);
        try {
            var userData = {
                activity_type: activeKey
            }

            const responseData = await AdminUserRoleService.activity_log(id, userData).json();

            if (responseData.status) {
                setIsLoading(false);
                setUserActivityLogList(responseData.activity.data);
                setNpage(Math.ceil(responseData.activity.meta.total / recordsPage));
                setUserActivityLogListCount(responseData.activity.meta.total);
                setUserName(responseData.user);
            }
        } catch (error) {
            setIsLoading(false);
            if (error.name === "HTTPError") {
                const errorJson = await error.response.json();
                setError(errorJson.message);
            }
        }
    };

    return (
        <Fragment>
            <MainPagetitle mainTitle="User Analytics List" pageTitle="User Analytics List" parentTitle="Users" link="/userlist" />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xl-12">
                        <div className="card">
                            <div className="card-body p-0">
                                <div className="table-responsive active-projects style-1 ItemsCheckboxSec shorting">
                                    <div className="tbl-caption d-flex justify-content-between text-wrap align-items-center pb-0">
                                        <div className="d-flex text-nowrap justify-content-between align-items-center">
                                            <h4 className="heading mb-0">User Analytics List</h4>
                                            <div className="btn-group mx-5" role="group" aria-label="Basic example"></div>
                                        </div>
                                        <div className="d-flex ml-auto">
                                            <div style={{ color: "black", fontSize: "15px" }}>
                                                <i className="fa-solid fa-user" />&nbsp;
                                                {userName.charAt(0).toUpperCase() + userName.slice(1)}
                                            </div>
                                        </div>
                                    </div>
                                    <Tabs
                                        activeKey={activeKey}
                                        onSelect={(key) => setActiveKey(key)}
                                        className="mb-3 custom-tabs mt-2"
                                    >
                                        <Tab eventKey="login"
                                            title={
                                                <span style={{ fontWeight: activeKey === "login" ? "bold" : "normal" }}>Login Details</span>
                                            }
                                        >
                                            <div
                                                id="employee-tbl_wrapper"
                                                className="dataTables_wrapper no-footer"
                                                style={{ marginTop: "-14px" }}
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
                                                                <th><strong>No.</strong></th>
                                                                <th>Logged In At</th>
                                                                <th>Last Used At</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody style={{ textAlign: "center" }}>
                                                            {userActivityLogList !== null && userActivityLogList?.length > 0 ? (
                                                                userActivityLogList?.map((element, index) => (
                                                                    <tr>
                                                                        <td>{(currentPage - 1) * 10 + (index + 1)}</td>
                                                                        <td style={{ textAlign: "center" }}>{element.loggedin_at}</td>
                                                                        <td style={{ textAlign: "center" }}>{element.last_used_at}</td>
                                                                    </tr>
                                                                ))
                                                            ) : (
                                                                <tr>
                                                                    <td colSpan="3" style={{ textAlign: "center" }}>
                                                                        No data found
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                )}

                                            </div>
                                        </Tab>
                                        <Tab eventKey="logout"
                                            title={
                                                <span style={{ fontWeight: activeKey === "logout" ? "bold" : "normal" }}>Logout Details</span>
                                            }
                                        >
                                            <div
                                                id="employee-tbl_wrapper"
                                                className="dataTables_wrapper no-footer"
                                                style={{ marginTop: "-14px" }}
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
                                                                <th><strong>No.</strong></th>
                                                                <th>Logged Out At</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody style={{ textAlign: "center" }}>
                                                            {userActivityLogList !== null && userActivityLogList?.length > 0 ? (
                                                                userActivityLogList?.map((element, index) => (
                                                                    <tr>
                                                                        <td>{(currentPage - 1) * 10 + (index + 1)}</td>
                                                                        <td style={{ textAlign: "center" }}>{element.logged_out_at}</td>
                                                                    </tr>
                                                                ))
                                                            ) : (
                                                                <tr>
                                                                    <td colSpan="3" style={{ textAlign: "center" }}>
                                                                        No data found
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                )}

                                            </div>
                                        </Tab>
                                        <Tab eventKey="export file"
                                            title={
                                                <span style={{ fontWeight: activeKey === "export file" ? "bold" : "normal" }}>Export Details</span>
                                            }
                                        >
                                            <div
                                                id="employee-tbl_wrapper"
                                                className="dataTables_wrapper no-footer"
                                                style={{ marginTop: "-14px" }}
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
                                                                <th><strong>No.</strong></th>
                                                                <th>Module</th>
                                                                <th>Filename</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody style={{ textAlign: "center" }}>
                                                            {userActivityLogList !== null && userActivityLogList?.length > 0 ? (
                                                                userActivityLogList?.map((element, index) => (
                                                                    <tr>
                                                                        <td>{(currentPage - 1) * 10 + (index + 1)}</td>
                                                                        <td style={{ textAlign: "center" }}>{element.exported_module}</td>
                                                                        <td style={{ textAlign: "center" }}>{element.exported_filename}</td>
                                                                    </tr>
                                                                ))
                                                            ) : (
                                                                <tr>
                                                                    <td colSpan="3" style={{ textAlign: "center" }}>
                                                                        No data found
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                )}

                                            </div>
                                        </Tab>
                                        <Tab eventKey="Weeklydata Input"
                                            title={
                                                <span style={{ fontWeight: activeKey === "Weeklydata Input" ? "bold" : "normal" }}>Weekly Data Details</span>
                                            }
                                        >
                                            <div
                                                id="employee-tbl_wrapper"
                                                className="dataTables_wrapper no-footer"
                                                style={{ marginTop: "-14px" }}
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
                                                                <th><strong>No.</strong></th>
                                                                <th>Builder Name</th>
                                                                <th>Week Ending Date</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody style={{ textAlign: "center" }}>
                                                            {userActivityLogList !== null && userActivityLogList?.length > 0 ? (
                                                                userActivityLogList?.map((element, index) => (
                                                                    <tr>
                                                                        <td>{(currentPage - 1) * 10 + (index + 1)}</td>
                                                                        <td style={{ textAlign: "center" }}>{element.builder_name}</td>
                                                                        <td style={{ textAlign: "center" }}>{element.week_ending_date}</td>
                                                                    </tr>
                                                                ))
                                                            ) : (
                                                                <tr>
                                                                    <td colSpan="3" style={{ textAlign: "center" }}>
                                                                        No data found
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                )}
                                            </div>
                                        </Tab>
                                    </Tabs>
                                    <div className="d-sm-flex text-center justify-content-between align-items-center dataTables_wrapper no-footer">
                                        <div className="dataTables_info">
                                            Showing {lastIndex - recordsPage + 1} to {lastIndex} of{" "}
                                            {userActivityLogListCount} entries
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
        </Fragment>
    );
};

export default UserAnalyticsList;