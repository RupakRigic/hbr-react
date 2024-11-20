import React, { Fragment, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../images/logo/hrb-logo.png";
import LogoWhite from "../../images/logo/logofull-white.png";
import bg6 from "../../images/background/bg6.jpg";
import swal from "sweetalert";
import AdminUserService from "../../API/Services/AdminService/AdminUserService";
import { FiEye, FiEyeOff } from "react-icons/fi";

const ResetPasswordPage = (props) => {
    const [errors, setErrors] = useState("");
    const [message, setMessage] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [token, setToken] = useState("");

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const tokenFromUrl = queryParams.get("token");
        if (tokenFromUrl) {
            setToken(tokenFromUrl);  // Set the token to state
        }
    }, [location.search]);

    const handleReset = async (e) => {
        e.preventDefault();
        setErrors("");
        if (newPassword !== confirmPassword) {
            setErrors("Password does not match!");
            return;
        }

        try {
            const resetData = {
                token: token,
                password: newPassword,
                password_confirmation: confirmPassword,
            };
            const response = await AdminUserService.reset_password(resetData).json();
            if (response.status) {
                swal(response.Message).then((willDelete) => {
                    if (willDelete) {
                        navigate("/");
                    }
                });
            } else {
                swal(response.Message).then((willDelete) => {
                    if (willDelete) {
                        navigate("/");
                    }
                });
            }
        } catch (err) {
            setMessage("");
            setErrors("An error occurred. Please try again.");
        }
    };

    return (
        <Fragment>
            <div className="page-wraper">
                <div className="browse-job login-style3">
                    <div
                        className="bg-img-fix overflow-hidden"
                        style={{ background: "#fff url(" + bg6 + ")", height: "100vh" }}
                    >
                        <div className="row gx-0">
                            <div className="col-xl-4 col-lg-5 col-md-6 col-sm-12 vh-100 bg-white ">
                                <div
                                    id="mCSB_1"
                                    className="mCustomScrollBox mCS-light mCSB_vertical mCSB_inside"
                                    style={{ maxHeight: "653px" }}
                                >
                                    <div
                                        id="mCSB_1_container"
                                        className="mCSB_container"
                                        style={{
                                            position: "relative",
                                            top: "0",
                                            left: "0",
                                            dir: "ltr",
                                        }}
                                    >
                                        <div className="login-form style-2">
                                            <div className="card-body">
                                                <div className="logo-header">
                                                    <Link to={"#"} className="logo">
                                                        <img
                                                            src={logo}
                                                            alt=""
                                                            className="width-230 light-logo"
                                                        />
                                                    </Link>
                                                    <Link to={"#"} className="logo">
                                                        <img
                                                            src={LogoWhite}
                                                            alt=""
                                                            className="width-230 dark-logo"
                                                        />
                                                    </Link>
                                                </div>
                                                <div className="nav nav-tabs border-bottom-0">
                                                    <div className="tab-content w-100" id="nav-tabContent">
                                                        <div
                                                            className="tab-pane fade active show"
                                                            id="nav-personal"
                                                        >
                                                            {props.errorMessage && (
                                                                <div className="bg-red-300 text-red-900 border border-red-900 p-1 my-2">
                                                                    {props.errorMessage}
                                                                </div>
                                                            )}
                                                            {props.successMessage && (
                                                                <div className="bg-green-300 text-green-900 border border-green-900 p-1 my-2">
                                                                    {props.successMessage}
                                                                </div>
                                                            )}
                                                            <form className=" dz-form pb-3" onSubmit={handleReset}>
                                                                <h3 className="form-title m-t0">
                                                                    Reset Your Password
                                                                </h3>
                                                                <div className="dz-separator-outer m-b5">
                                                                    <div className="dz-separator bg-primary style-liner"></div>
                                                                </div>
                                                                <p className="text-danger">{errors} </p>

                                                                <div className="input-group mb-3">
                                                                    <label htmlFor="newPassword" className="form-label">
                                                                        New Password
                                                                    </label>
                                                                    <div className="input-group">
                                                                        <input
                                                                            type={showNewPassword ? "text" : "password"}
                                                                            className="form-control"
                                                                            value={newPassword}
                                                                            onChange={(e) => setNewPassword(e.target.value)}
                                                                            placeholder="Enter new password"
                                                                            aria-label="New Password"
                                                                        />
                                                                        <button
                                                                            className="btn btn-outline-light"
                                                                            type="button"
                                                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                                                            style={{ borderColor: "#cccccc", padding: "0.375rem 0.75rem" }}
                                                                        >
                                                                            {showNewPassword ? <FiEye /> : <FiEyeOff />}
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                                <div className="input-group mb-3">
                                                                    <label htmlFor="confirmPassword" className="form-label">
                                                                        Confirm Password
                                                                    </label>
                                                                    <div className="input-group">
                                                                        <input
                                                                            type={showConfirmPassword ? "text" : "password"}
                                                                            className="form-control"
                                                                            value={confirmPassword}
                                                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                                                            placeholder="Confirm your password"
                                                                            aria-label="Confirm Password"
                                                                        />
                                                                        <button
                                                                            className="btn btn-outline-light"
                                                                            type="button"
                                                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                                            style={{ borderColor: "#cccccc", padding: "0.375rem 0.75rem" }}
                                                                        >
                                                                            {showConfirmPassword ? <FiEye /> : <FiEyeOff />}
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <div className="form-group text-left mb-5">
                                                                    <button
                                                                        type="submit"
                                                                        className="btn btn-primary dz-xs-flex m-r5"
                                                                    >
                                                                        Reset
                                                                    </button>
                                                                </div>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card-footer">
                                                <div className=" bottom-footer clearfix m-t10 m-b20 row text-center">
                                                    <div className="col-lg-12 text-center">
                                                        <p>
                                                            {" "}
                                                            © 2024 Website Developed by{" "}
                                                            <a
                                                                href="https://www.rigicglobalsolutions.com/"
                                                                target="_blank"
                                                                rel="noreferrer"
                                                            >
                                                                Rigic Global Solutions Pvt Ltd
                                                            </a>{" "}
                                                            All Rights Reserved
                                                        </p>{" "}
                                                    </div>
                                                </div>
                                            </div>
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
}

export default ResetPasswordPage;