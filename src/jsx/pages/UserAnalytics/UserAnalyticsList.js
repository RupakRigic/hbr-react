import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
    const [userLoginAnalyticsList, setUserLoginAnalyticsList] = useState([]);
    const [userLogoutAnalyticsList, setUserLogoutAnalyticsList] = useState([]);
    const [userActivityLogList, setUserActivityLogList] = useState([]);
    const [activeKey, setActiveKey] = useState("loginDetail");

    useEffect(() => {
        if (localStorage.getItem("usertoken")) {
            if (activeKey === "loginDetail") {
                GetUserLoginAnalyticsList(params.id);
            } else if (activeKey === "logoutDetail") {
                GetUserLogoutAnalyticsList(params.id);
            } else if (activeKey === "export file" || activeKey === "Weeklydata Input") {
                GetUserActivityLog(params.id);
            } else {
                return;
            }
        } else {
            navigate("/");
        }
    }, [activeKey]);

    const GetUserLoginAnalyticsList = async (id) => {
        setIsLoading(true);
        try {
            const responseData = await AdminUserRoleService.userloginanalytics(id).json();
            if (responseData.status) {
                setIsLoading(false);
                setUserLoginAnalyticsList(responseData.data.activity);
                setUserName(responseData.data.user);
            }
        } catch (error) {
            setIsLoading(false);
            if (error.name === "HTTPError") {
                const errorJson = await error.response.json();
                setError(errorJson.message);
            }
        }
    };

    const GetUserLogoutAnalyticsList = async (id) => {
        setIsLoading(true);
        try {
            const responseData = await AdminUserRoleService.userlogoutnanalytics(id).json();
            if (responseData.status) {
                setIsLoading(false);
                setUserLogoutAnalyticsList(responseData.data.activity);
                setUserName(responseData.data.user);
            }
        } catch (error) {
            setIsLoading(false);
            if (error.name === "HTTPError") {
                const errorJson = await error.response.json();
                setError(errorJson.message);
            }
        }
    };

    const GetUserActivityLog = async (id) => {
        setIsLoading(true);
        try {
            var userData = {
                activitytype: activeKey
            }

            const responseData = await AdminUserRoleService.activity_log(id, userData).json();

            if (responseData.status) {
                setIsLoading(false);
                setUserActivityLogList(responseData.data.activity);
                setUserName(responseData.data.user);
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
        <div>
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
                                        <Tab eventKey="loginDetail"
                                            title={
                                                <span style={{ fontWeight: activeKey === "loginDetail" ? "bold" : "normal" }}>Login Details</span>
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
                                                            {userLoginAnalyticsList !== null && userLoginAnalyticsList?.length > 0 ? (
                                                                userLoginAnalyticsList?.map((element, index) => (
                                                                    <tr>
                                                                        <td>{index + 1}</td>
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
                                        <Tab eventKey="logoutDetail"
                                            title={
                                                <span style={{ fontWeight: activeKey === "logoutDetail" ? "bold" : "normal" }}>Logout Details</span>
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
                                                            {userLogoutAnalyticsList !== null && userLogoutAnalyticsList?.length > 0 ? (
                                                                userLogoutAnalyticsList?.map((element, index) => (
                                                                    <tr>
                                                                        <td>{index + 1}</td>
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
                                                                <th>Logged In At</th>
                                                                <th>Last Used At</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody style={{ textAlign: "center" }}>
                                                            {userActivityLogList !== null && userActivityLogList?.length > 0 ? (
                                                                userActivityLogList?.map((element, index) => (
                                                                    <tr>
                                                                        <td>{index + 1}</td>
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
                                                                <th>Logged In At</th>
                                                                <th>Last Used At</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody style={{ textAlign: "center" }}>
                                                            {userActivityLogList !== null && userActivityLogList?.length > 0 ? (
                                                                userActivityLogList?.map((element, index) => (
                                                                    <tr>
                                                                        <td>{index + 1}</td>
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
                                    </Tabs>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserAnalyticsList;