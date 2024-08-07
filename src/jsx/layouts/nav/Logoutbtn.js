import React, { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminUserService from '../../../API/Services/AdminService/AdminUserService';

const LogoutPage = () => {
  const navigate = useNavigate();

  const onLogout = async () => {
    try {
      const data = await AdminUserService.logout().json();
      if (data.status == true) {
        localStorage.removeItem("usertoken");
        localStorage.removeItem("user");
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
        navigate('/');
      } else {
        console.log(data.message);
      }
    } catch (error) {

    }
  };
  
  return (
    <Fragment>
      <button className="btn btn-primary btn-sm" onClick={onLogout}>Logout</button>
    </Fragment>
  )
};

export default LogoutPage;