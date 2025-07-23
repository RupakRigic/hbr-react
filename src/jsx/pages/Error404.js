import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Error404 = () => {
   const [token, setToken] = useState(null);
   const [userRole, setUserRole] = useState(null);
   const navigate = useNavigate();

   useEffect(() => {
      const token = localStorage.getItem("usertoken");
      const userRole = JSON.parse(localStorage.getItem("user"))?.role;
      setToken(token);
      setUserRole(userRole);

      if (token) {
         if (userRole == "Admin" || userRole == "Staff" || userRole == "Tester") {
            navigate("/dashboard");
         } else if (userRole == "Data Uploader") {
            const subscription = JSON.parse(localStorage.getItem("is_subscribed"));
            // if (subscription == 1) {
            //   navigate("/weekly-data");
            // } else {
            //   navigate("/subscriptionplan");
            // }
            navigate("/weekly-data");

         } else if (userRole == "Standard User") {
            navigate("/weekly-data");
         } else if (userRole == "Account Admin") {
            const subscription = JSON.parse(localStorage.getItem("is_subscribed"));
            if (subscription == 1) {
               navigate("/weekly-data");
            } else {
               navigate("/weekly-data");
               // navigate("/subscriptionplan");
            }
         } else {
            navigate("/weekly-data");
            // navigate("/subscriptionlist");
         }
      } else {
         localStorage.clear();
         navigate("/");
      }
   }, []);

   const handleRedirect = () => {
      if (token) {
         if (userRole == "Admin" || userRole == "Staff" || userRole == "Tester") {
            navigate("/dashboard");
         } else if (userRole == "Data Uploader") {
            const subscription = JSON.parse(localStorage.getItem("is_subscribed"));
            // if (subscription == 1) {
            //   navigate("/weekly-data");
            // } else {
            //   navigate("/subscriptionplan");
            // }
            navigate("/weekly-data");

         } else if (userRole == "Standard User") {
            navigate("/weekly-data");
         } else if (userRole == "Account Admin") {
            const subscription = JSON.parse(localStorage.getItem("is_subscribed"));
            if (subscription == 1) {
               navigate("/weekly-data");
            } else {
               navigate("/weekly-data");
               // navigate("/subscriptionplan");
            }
         } else {
            navigate("/weekly-data");
            // navigate("/subscriptionlist");
         }
      }
   };

   return (
      <div className="authincation h-100">
         <div className="container h-100">
            <div className="row justify-content-center h-100 align-items-center">
               <div className="col-md-6">
                  <div className="error-page">
                     <div className="error-inner text-center">
                        <div className="dz-error" data-text="404">404</div>
                        <h4 className="error-head">
                           <i className="fa fa-exclamation-triangle text-warning"></i> The page you were looking for is not found!
                        </h4>
                        <div>
                           <button className="btn btn-secondary" onClick={handleRedirect}>
                              BACK TO HOMEPAGE
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Error404;
