import React, { useState } from "react";
import { connect } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";

import AdminUserService from "../../API/Services/AdminService/AdminUserService";
import logo from "../../images/logo/hrb-logo.png";
import LogoWhite from "../../images/logo/logofull-white.png";
import bg6 from "../../images/background/bg6.jpg";

function Login(props) {
  const [heartActive, setHeartActive] = useState(true);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  let errorsObj = { email: "", password: "" };
  const [errors, setErrors] = useState(errorsObj);
  const [password, setPassword] = useState("");
  var d = new Date();

  const onLogin = async (e) => {
    e.preventDefault();
    let error = false;
    const errorObj = { ...errorsObj };
    if (email === "") {
      errorObj.email = "Email is Required";
      error = true;
    }
    if (password === "") {
      errorObj.password = "Password is Required";
      error = true;
    }
    setErrors(errorObj);
    if (error) {
      return;
    } else {
      try {
        const data = await AdminUserService.login(email, password).json();
        localStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("usertoken", JSON.stringify(data.idToken));
        const user = JSON.parse(localStorage.getItem("user"));
        console.log(user);
        if (user != "") {
          const userRole = JSON.parse(localStorage.getItem("user")).role;
          console.log(userRole);
          if (userRole == "Admin") {
            navigate("/dashboard");
            localStorage.removeItem("selectedBuilderNameByFilter");
            localStorage.removeItem("selectedStatusByBuilderFilter");
            localStorage.removeItem("selectedCompanyTypeByFilter");
            localStorage.removeItem("builder_name");
            localStorage.removeItem("is_active");
            localStorage.removeItem("active_communities");
            localStorage.removeItem("company_type");
            localStorage.removeItem("searchQueryByBuilderFilter");
            localStorage.removeItem("selectedStatusBySubdivisionFilter");
            localStorage.removeItem("selectedReportingByFilter");
            localStorage.removeItem("productTypeStatusByFilter");
            localStorage.removeItem("selectedAreaByFilter");
            localStorage.removeItem("selectedMasterPlanByFilter");
            localStorage.removeItem("seletctedZipcodeByFilter");
            localStorage.removeItem("selectedAgeByFilter");
            localStorage.removeItem("selectedSingleByFilter");
            localStorage.removeItem("selectedGatedByFilter");
            localStorage.removeItem("selectedJurisdicitionByFilter");
            localStorage.removeItem("seletctedGasProviderByFilter");
            localStorage.removeItem("subdivision_status");
            localStorage.removeItem("reporting");
            localStorage.removeItem("subdivision_name");
            localStorage.removeItem("product_type");
            localStorage.removeItem("area");
            localStorage.removeItem("masterplan_id");
            localStorage.removeItem("zipcode");
            localStorage.removeItem("lotwidth");
            localStorage.removeItem("lotsize");
            localStorage.removeItem("age");
            localStorage.removeItem("single");
            localStorage.removeItem("gated");
            localStorage.removeItem("juridiction");
            localStorage.removeItem("gasprovider");
            localStorage.removeItem("from");
            localStorage.removeItem("to");
            localStorage.removeItem("searchQueryBySubdivisionFilter");
            localStorage.removeItem("selectedStatusByProductFilter");
            localStorage.removeItem("selectedSubdivisionNameByFilter");
            localStorage.removeItem("product_status");
            localStorage.removeItem("product_name");
            localStorage.removeItem("sqft");
            localStorage.removeItem("stories");
            localStorage.removeItem("bedroom");
            localStorage.removeItem("bathroom");
            localStorage.removeItem("garage");
            localStorage.removeItem("current_base_price");
            localStorage.removeItem("searchQueryByProductFilter");
            localStorage.removeItem("address2");
            localStorage.removeItem("address1");
            localStorage.removeItem("parcel");
            localStorage.removeItem("lotnumber");
            localStorage.removeItem("permitnumber");
            localStorage.removeItem("plan");
            localStorage.removeItem("searchQueryByPermitsFilter");
            localStorage.removeItem("weeklytraffic");
            localStorage.removeItem("cancelations");
            localStorage.removeItem("netsales");
            localStorage.removeItem("totallots");
            localStorage.removeItem("lotreleased");
            localStorage.removeItem("unsoldinventory");
            localStorage.removeItem("zoning");
            localStorage.removeItem("searchQueryByWeeklyTrafficFilter");
            localStorage.removeItem("selectedStatusByProductFilter");
            localStorage.removeItem("baseprice");
            localStorage.removeItem("searchQueryByBasePricesFilter");
            localStorage.removeItem("seletctedClosingTypeByFilter");
            localStorage.removeItem("seletctedLenderByFilter");
            localStorage.removeItem("closing_type");
            localStorage.removeItem("document");
            localStorage.removeItem("closingprice");
            localStorage.removeItem("address");
            localStorage.removeItem("sellerleagal");
            localStorage.removeItem("buyer");
            localStorage.removeItem("lender_name");
            localStorage.removeItem("loanamount");
            localStorage.removeItem("searchQueryByClosingsFilter");
            localStorage.removeItem("seller");
            localStorage.removeItem("location");
            localStorage.removeItem("notes");
            localStorage.removeItem("price");
            localStorage.removeItem("priceperunit");
            localStorage.removeItem("noofunit");
            localStorage.removeItem("typeofunit");
            localStorage.removeItem("searchQueryByLandSalesFilter");
            localStorage.removeItem("firstTime");
          } else if (userRole == "Data Uploader") {
            navigate("/weekly-data");
          } else {
            navigate("/report");
          }
        }
      } catch (error) {
        setErrors(error);
        console.log(error);
      }
    }
  };
  return (
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
                            <form className=" dz-form pb-3" onSubmit={onLogin}>
                              <h3 className="form-title m-t0">
                                Personal Information
                              </h3>
                              <div className="dz-separator-outer m-b5">
                                <div className="dz-separator bg-primary style-liner"></div>
                              </div>
                              <p>
                                Enter your e-mail address and your password.{" "}
                              </p>
                              <p className="text-danger">{errors.message} </p>

                              <div className="form-group mb-3">
                                <input
                                  type="email"
                                  className="form-control"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                />
                                {errors.email && (
                                  <div className="text-danger fs-12">
                                    {errors.email}
                                  </div>
                                )}
                              </div>
                              <div className="form-group mb-3">
                                <input
                                  type="password"
                                  className="form-control"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                />
                                {errors.password && (
                                  <div className="text-danger fs-12">
                                    {errors.password}
                                  </div>
                                )}
                              </div>
                              <div className="form-group text-left mb-5">
                                <button
                                  type="submit"
                                  className="btn btn-primary dz-xs-flex m-r5"
                                >
                                  login
                                </button>
                                <span className="form-check d-inline-block ms-2">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="check1"
                                    name="example1"
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="check1"
                                  >
                                    Remember me
                                  </label>
                                </span>
                              </div>
                              {/* <div className="dz-social">
																<h5 className="form-title fs-20">Sign In With</h5>
																<ul className="dz-social-icon dz-border dz-social-icon-lg text-white">
																	<li><a target="_blank" href="https://www.facebook.com/dexignzone" className="fab fa-facebook-f btn-facebook"></a></li>
																	<li><a target="_blank" href="mailto:dexignzones@gmail.com" className="fab fa-google-plus-g btn-google-plus"></a></li>
																	<li><a target="_blank" href="https://www.linkedin.com/in/dexignzone" className="fab fa-linkedin-in btn-linkedin"></a></li>
																	<li><a target="_blank" href="https://twitter.com/dexignzones" className="fab fa-twitter btn-twitter"></a></li>
																</ul>
															</div> */}
                            </form>
                            {/* <div className="text-center bottom">
															<NavLink to="/page-register" className="btn btn-primary button-md btn-block" >
																Create an account
															</NavLink>
														</div> */}
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
  );
}

const mapStateToProps = (state) => {
  return {
    errorMessage: state.auth.errorMessage,
    successMessage: state.auth.successMessage,
    showLoading: state.auth.showLoading,
  };
};
export default connect(mapStateToProps)(Login);
