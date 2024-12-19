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
    const [activeKey, setActiveKey] = useState("login");

    useEffect(() => {
        if (localStorage.getItem("usertoken")) {
            GetUserLoginAnalyticsList(params.id);
            GetUserLogoutAnalyticsList(params.id);
        } else {
            navigate("/");
        }
    }, []);

    const GetUserLoginAnalyticsList = async (id) => {
        setIsLoading(true);
        try {
            const responseData = await AdminUserRoleService.userloginanalytics(id).json();
            if (responseData.status) {
                setUserLoginAnalyticsList(responseData.data.activity);
                setUserName(responseData.data.user);
            }
        } catch (error) {
            if (error.name === "HTTPError") {
                const errorJson = await error.response.json();
                setError(errorJson.message);
            }
        }
        setIsLoading(false);
    };

    const GetUserLogoutAnalyticsList = async (id) => {
        setIsLoading(true);
        try {
            const responseData = await AdminUserRoleService.userlogoutnanalytics(id).json();
            if (responseData.status) {
                setUserLogoutAnalyticsList(responseData.data.activity);
                setUserName(responseData.data.user);
            }
        } catch (error) {
            if (error.name === "HTTPError") {
                const errorJson = await error.response.json();
                setError(errorJson.message);
            }
        }
        setIsLoading(false);
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
                                        <Tab
                                            eventKey="login"
                                            title={
                                                <span style={{ fontWeight: activeKey === "login" ? "bold" : "normal" }}>
                                                    Login Details
                                                </span>
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
                                                            {userLoginAnalyticsList !== null && userLoginAnalyticsList.length > 0 ? (
                                                                userLoginAnalyticsList.map((element, index) => (
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
                                        <Tab eventKey="logout"
                                            title={
                                                <span style={{ fontWeight: activeKey === "logout" ? "bold" : "normal" }}>
                                                    Logout Details
                                                </span>
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
                                                            {userLogoutAnalyticsList !== null && userLogoutAnalyticsList.length > 0 ? (
                                                                userLogoutAnalyticsList.map((element, index) => (
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