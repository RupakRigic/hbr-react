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
        localStorage.removeItem("selectedStatusByFilter");
        localStorage.removeItem("selectedCompanyTypeByFilter");
        localStorage.removeItem("name");
        localStorage.removeItem("is_active");
        localStorage.removeItem("active_communities");
        localStorage.removeItem("company_type");
        localStorage.removeItem("searchQueryByFilter");
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