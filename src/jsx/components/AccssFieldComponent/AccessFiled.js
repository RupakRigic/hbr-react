import React, { useState, useEffect } from "react";
import AdminBuilderService from '../../../API/Services/AdminService/AdminBuilderService';
import { useNavigate } from "react-router-dom";

export const AccessField = ({ tableName }) => {
    const [fieldList, setFieldList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getAccessList = async () => {
        
            try {   
                const response = await AdminBuilderService.getRoleFieldList(tableName);
                const responseData = await response.json();
                setFieldList(responseData);
            } catch (error) {
                console.log(error);
                if (error.name === "HTTPError") {
                    // Handle error
                }
            }
        };

        if (localStorage.getItem("usertoken")) {
            getAccessList();
        } else {
            navigate("/");
        }
    }, [navigate, tableName]);

    return fieldList; 
};

export default AccessField;
