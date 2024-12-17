import React, { Fragment, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';
import AdminUserRoleService from '../../../API/Services/AdminService/AdminUserRoleService';

const UserAnalyticsList = () => {
    const navigate = useNavigate();
    const params = useParams();

    const [isLoading, setIsLoading] = useState(false);
    const [Error, setError] = useState("");
    const [userName, setUserName] = useState("");
    const [userAnalyticsList, setUserAnalyticsList] = useState([]);

    useEffect(() => {
        if (localStorage.getItem("usertoken")) {
            GetUserAnalyticsList(params.id);
        } else {
            navigate("/");
        }
    }, []);

    const GetUserAnalyticsList = async (id) => {
        setIsLoading(true);
        try {
            const responseData = await AdminUserRoleService.useranalytics(id).json();
            if (responseData.status) {
                setUserAnalyticsList(responseData.data.activity);
                setUserName(responseData.data.user);
                setIsLoading(false);
            }
        } catch (error) {
            setIsLoading(false);
            if (error.name === "HTTPError") {
                const errorJson = await error.response.json();
                setError(errorJson.message);
            }
        }
        setIsLoading(false);
    };

    return (
        <Fragment>
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
                                    <div
                                        id="employee-tbl_wrapper"
                                        className="dataTables_wrapper no-footer"
                                        style={{ marginTop: "10px" }}
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
                                                    {userAnalyticsList !== null && userAnalyticsList.length > 0 ? (
                                                        userAnalyticsList.map((element, index) => (
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