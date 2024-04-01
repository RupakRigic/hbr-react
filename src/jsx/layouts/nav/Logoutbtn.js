import React from 'react';
import { connect, useDispatch } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { Logout } from '../../../store/actions/AuthActions';
import { isAuthenticated } from '../../../store/selectors/AuthSelectors';
import { SVGICON } from '../../constant/theme';

import AdminUserService from '../../../API/Services/AdminService/AdminUserService';
// function withRouter(Component) {

//   function ComponentWithRouterProp(props) {
//     let location = useLocation();
//     let navigate = useNavigate();
//     let params = useParams();
//     return (
//       <Component
//         {...props}
//         router={{ location, navigate, params }}
//       />
//     );
//   }

//   return ComponentWithRouterProp;
// }

function LogoutPage() {
  const navigate = useNavigate();
  const onLogout = async () => {

    try {
      const data = await AdminUserService.logout().json();

      localStorage.removeItem("usertoken");
      localStorage.removeItem("user");

      navigate('/')

    } catch (error) {

    }

  }
  // 
  return (
    <>
      <button className="btn btn-primary btn-sm" onClick={onLogout}>Logout</button>
    </>
  )
}
// const mapStateToProps = (state) => {
//   return {
//     isAuthenticated: isAuthenticated(state),
//   };
// };

// export default withRouter(connect(mapStateToProps)(LogoutPage));
export default LogoutPage;