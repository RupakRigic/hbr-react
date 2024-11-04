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
        localStorage.setItem("is_subscribed", JSON.stringify(data.is_subscribed));
        const user = JSON.parse(localStorage.getItem("user"));
        console.log(user);
        if (user != "") {
          const userRole = JSON.parse(localStorage.getItem("user")).role;
          console.log(userRole);
          if(!userRole) {
            alert(user.message);
            return;
          }
          // Builder
          localStorage.removeItem("selectedBuilderNameByFilterBuilder");
          localStorage.removeItem("selectedStatusByBuilderFilterBuilder");
          localStorage.removeItem("selectedCompanyTypeByFilterBuilder");
          localStorage.removeItem("builder_name_Builder");
          localStorage.removeItem("is_active_Builder");
          localStorage.removeItem("active_communities_Builder");
          localStorage.removeItem("company_type_Builder");
          localStorage.removeItem("searchQueryByBuilderFilter_Builder");
          localStorage.removeItem("setBuilderFilter");

          // Subdivision
          localStorage.removeItem("selectedStatusBySubdivisionFilter_Subdivision");
          localStorage.removeItem("selectedReportingByFilter_Subdivision");
          localStorage.removeItem("selectedBuilderNameByFilter_Subdivision");
          localStorage.removeItem("productTypeStatusByFilter_Subdivision");
          localStorage.removeItem("selectedAreaByFilter_Subdivision");
          localStorage.removeItem("selectedMasterPlanByFilter_Subdivision");
          localStorage.removeItem("selectedAgeByFilter_Subdivision");
          localStorage.removeItem("selectedSingleByFilter_Subdivision");
          localStorage.removeItem("selectedGatedByFilter_Subdivision");
          localStorage.removeItem("selectedJurisdicitionByFilter_Subdivision");
          localStorage.removeItem("seletctedGasProviderByFilter_Subdivision");
          localStorage.removeItem("subdivision_status_Subdivision");
          localStorage.removeItem("reporting_Subdivision");
          localStorage.removeItem("subdivision_name_Subdivision");
          localStorage.removeItem("builder_name_Subdivision");
          localStorage.removeItem("product_type_Subdivision");
          localStorage.removeItem("area_Subdivision");
          localStorage.removeItem("masterplan_id_Subdivision");
          localStorage.removeItem("zipcode_Subdivision");
          localStorage.removeItem("lotwidth_Subdivision");
          localStorage.removeItem("lotsize_Subdivision");
          localStorage.removeItem("age_Subdivision");
          localStorage.removeItem("single_Subdivision");
          localStorage.removeItem("gated_Subdivision");
          localStorage.removeItem("juridiction_Subdivision");
          localStorage.removeItem("gasprovider_Subdivision");
          localStorage.removeItem("from_Subdivision");
          localStorage.removeItem("to_Subdivision");
          localStorage.removeItem("searchQueryBySubdivisionFilter_Subdivision");
          localStorage.removeItem("setSubdivisionFilter");

          // Product
          localStorage.removeItem("selectedStatusByProductFilter_Product");
          localStorage.removeItem("selectedBuilderNameByFilter_Product");
          localStorage.removeItem("selectedSubdivisionNameByFilter_Product");
          localStorage.removeItem("selectedAgeByFilter_Product");
          localStorage.removeItem("selectedSingleByFilter_Product");
          localStorage.removeItem("product_status_Product");
          localStorage.removeItem("builder_name_Product");
          localStorage.removeItem("subdivision_name_Product");
          localStorage.removeItem("product_name_Product");
          localStorage.removeItem("sqft_Product");
          localStorage.removeItem("stories_Product");
          localStorage.removeItem("bedroom_Product");
          localStorage.removeItem("bathroom_Product");
          localStorage.removeItem("garage_Product");
          localStorage.removeItem("current_base_price_Product");
          localStorage.removeItem("product_type_Product");
          localStorage.removeItem("area_Product");
          localStorage.removeItem("masterplan_id_Product");
          localStorage.removeItem("zipcode_Product");
          localStorage.removeItem("lotwidth_Product");
          localStorage.removeItem("lotsize_Product");
          localStorage.removeItem("age_Product");
          localStorage.removeItem("single_Product");
          localStorage.removeItem("searchQueryByProductFilter_Product");
          localStorage.removeItem("setProductFilter");

          // Permit
          localStorage.removeItem("selectedBuilderNameByFilter_Permit");
          localStorage.removeItem("selectedSubdivisionNameByFilter_Permit");
          localStorage.removeItem("productTypeStatusByFilter_Permit");
          localStorage.removeItem("selectedAreaByFilter_Permit");
          localStorage.removeItem("selectedMasterPlanByFilter_Permit");
          localStorage.removeItem("selectedAgeByFilter_Permit");
          localStorage.removeItem("selectedSingleByFilter_Permit");
          localStorage.removeItem("from_Permit");
          localStorage.removeItem("to_Permit");
          localStorage.removeItem("builder_name_Permit");
          localStorage.removeItem("subdivision_name_Permit");
          localStorage.removeItem("address2_Permit");
          localStorage.removeItem("address1_Permit");
          localStorage.removeItem("parcel_Permit");
          localStorage.removeItem("sqft_Permit");
          localStorage.removeItem("lotnumber_Permit");
          localStorage.removeItem("permitnumber_Permit");
          localStorage.removeItem("plan_Permit");
          localStorage.removeItem("product_type_Permit");
          localStorage.removeItem("area_Permit");
          localStorage.removeItem("masterplan_id_Permit");
          localStorage.removeItem("zipcode_Permit");
          localStorage.removeItem("lotwidth_Permit");
          localStorage.removeItem("lotsize_Permit");
          localStorage.removeItem("age_Permit");
          localStorage.removeItem("single_Permit");
          localStorage.removeItem("searchQueryByPermitsFilter");
          localStorage.removeItem("setPermitFilter");

          // Weekly Traffic & Sales
          localStorage.removeItem("selectedBuilderNameByFilter_TrafficSale");
          localStorage.removeItem("selectedSubdivisionNameByFilter_TrafficSale");
          localStorage.removeItem("productTypeStatusByFilter_TrafficSale");
          localStorage.removeItem("selectedAreaByFilter_TrafficSale");
          localStorage.removeItem("selectedMasterPlanByFilter_TrafficSale");
          localStorage.removeItem("selectedAgeByFilter_TrafficSale");
          localStorage.removeItem("selectedSingleByFilter_TrafficSale");
          localStorage.removeItem("from_TrafficSale");
          localStorage.removeItem("to_TrafficSale");
          localStorage.removeItem("builder_name_TrafficSale");
          localStorage.removeItem("subdivision_name_TrafficSale");
          localStorage.removeItem("weeklytraffic_TrafficSale");
          localStorage.removeItem("cancelations_TrafficSale");
          localStorage.removeItem("netsales_TrafficSale");
          localStorage.removeItem("totallots_TrafficSale");
          localStorage.removeItem("lotreleased_TrafficSale");
          localStorage.removeItem("unsoldinventory_TrafficSale");
          localStorage.removeItem("product_type_TrafficSale");
          localStorage.removeItem("area_TrafficSale");
          localStorage.removeItem("masterplan_id_TrafficSale");
          localStorage.removeItem("zipcode_TrafficSale");
          localStorage.removeItem("lotwidth_TrafficSale");
          localStorage.removeItem("lotsize_TrafficSale");
          localStorage.removeItem("zoning_TrafficSale");
          localStorage.removeItem("age_TrafficSale");
          localStorage.removeItem("single_TrafficSale");
          localStorage.removeItem("searchQueryByWeeklyTrafficFilter");
          localStorage.removeItem("setTrafficFilter");

          // Base Price
          localStorage.removeItem("selectedBuilderNameByFilter_BasePrice");
          localStorage.removeItem("selectedSubdivisionNameByFilter_BasePrice");
          localStorage.removeItem("productTypeStatusByFilter_BasePrice");
          localStorage.removeItem("selectedAreaByFilter_BasePrice");
          localStorage.removeItem("selectedMasterPlanByFilter_BasePrice");
          localStorage.removeItem("selectedAgeByFilter_BasePrice");
          localStorage.removeItem("selectedSingleByFilter_BasePrice");
          localStorage.removeItem("selectedStatusBySubdivisionFilter_BasePrice");
          localStorage.removeItem("selectedStatusByProductFilter_BasePrice");
          localStorage.removeItem("from_BasePrice");
          localStorage.removeItem("to_BasePrice");
          localStorage.removeItem("builder_name_BasePrice");
          localStorage.removeItem("subdivision_name_BasePrice");
          localStorage.removeItem("product_name_BasePrice");
          localStorage.removeItem("sqft_BasePrice");
          localStorage.removeItem("stories_BasePrice");
          localStorage.removeItem("bedroom_BasePrice");
          localStorage.removeItem("bathroom_BasePrice");
          localStorage.removeItem("garage_BasePrice");
          localStorage.removeItem("baseprice_BasePrice");
          localStorage.removeItem("product_type_BasePrice");
          localStorage.removeItem("area_BasePrice");
          localStorage.removeItem("masterplan_id_BasePrice");
          localStorage.removeItem("zipcode_BasePrice");
          localStorage.removeItem("lotwidth_BasePrice");
          localStorage.removeItem("lotsize_BasePrice");
          localStorage.removeItem("age_BasePrice");
          localStorage.removeItem("single_BasePrice");
          localStorage.removeItem("product_status_BasePrice");
          localStorage.removeItem("subdivision_status_BasePrice");
          localStorage.removeItem("searchQueryByBasePricesFilter");
          localStorage.removeItem("setBasePriceFilter");

          // Closing
          localStorage.removeItem("seletctedClosingTypeByFilter_Closing");
          localStorage.removeItem("selectedBuilderNameByFilter_Closing");
          localStorage.removeItem("selectedSubdivisionNameByFilter_Closing");
          localStorage.removeItem("seletctedLenderByFilter_Closing");
          localStorage.removeItem("productTypeStatusByFilter_Closing");
          localStorage.removeItem("selectedAreaByFilter_Closing");
          localStorage.removeItem("selectedMasterPlanByFilter_Closing");
          localStorage.removeItem("selectedAgeByFilter_Closing");
          localStorage.removeItem("selectedSingleByFilter_Closing");
          localStorage.removeItem("from_Closing");
          localStorage.removeItem("to_Closing");
          localStorage.removeItem("closing_type_Closing");
          localStorage.removeItem("document_Closing");
          localStorage.removeItem("builder_name_Closing");
          localStorage.removeItem("subdivision_name_Closing");
          localStorage.removeItem("closingprice_Closing");
          localStorage.removeItem("address_Closing");
          localStorage.removeItem("parcel_Closing");
          localStorage.removeItem("sellerleagal_Closing");
          localStorage.removeItem("buyer_Closing");
          localStorage.removeItem("lender_name_Closing");
          localStorage.removeItem("loanamount_Closing");
          localStorage.removeItem("product_type_Closing");
          localStorage.removeItem("area_Closing");
          localStorage.removeItem("masterplan_id_Closing");
          localStorage.removeItem("zipcode_Closing");
          localStorage.removeItem("lotwidth_Closing");
          localStorage.removeItem("lotsize_Closing");
          localStorage.removeItem("age_Closing");
          localStorage.removeItem("single_Closing");
          localStorage.removeItem("searchQueryByClosingsFilter");
          localStorage.removeItem("setClosingFilter");

          // Land Sale
          localStorage.removeItem("selectedBuilderNameByFilter_LandSale");
          localStorage.removeItem("selectedSubdivisionNameByFilter_LandSale");
          localStorage.removeItem("from_LandSale");
          localStorage.removeItem("to_LandSale");
          localStorage.removeItem("builder_name_LandSale");
          localStorage.removeItem("subdivision_name_LandSale");
          localStorage.removeItem("seller_LandSale");
          localStorage.removeItem("buyer_LandSale");
          localStorage.removeItem("location_LandSale");
          localStorage.removeItem("notes_LandSale");
          localStorage.removeItem("price_LandSale");
          localStorage.removeItem("priceperunit_LandSale");
          localStorage.removeItem("parcel_LandSale");
          localStorage.removeItem("document_LandSale");
          localStorage.removeItem("noofunit_LandSale");
          localStorage.removeItem("typeofunit_LandSale");
          localStorage.removeItem("searchQueryByLandSalesFilter");
          localStorage.removeItem("setLansSaleFilter");
          if (userRole == "Admin") {
            navigate("/dashboard");
          } else if (userRole == "Standard User" || userRole == "Data Uploader") {
            navigate("/subscriptionlist");
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
