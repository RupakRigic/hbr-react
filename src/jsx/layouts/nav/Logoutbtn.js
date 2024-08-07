import React, { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminUserService from '../../../API/Services/AdminService/AdminUserService';

const LogoutPage = () => {
  const navigate = useNavigate();

  const onLogout = async () => {
    try {
      const data = await AdminUserService.logout().json();
      if (data.status == true) {
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