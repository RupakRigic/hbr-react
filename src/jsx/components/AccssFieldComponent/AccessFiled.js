import React, { useEffect } from "react";
import AdminBuilderService from '../../../API/Services/AdminService/AdminBuilderService';
import { useNavigate } from "react-router-dom";

export const AccessField = (props) => {
    const { tableName, setFieldList, manageAccessField, setManageAccessField } = props;
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("usertoken")) {
            getAccessList();
        } else {
            navigate("/");
        }
    }, [manageAccessField]);

    const getAccessList = async () => {
        try {
            const response = await AdminBuilderService.getRoleFieldList(tableName);
            const responseData = await response.json();
            setFieldList(responseData);
            setManageAccessField(false);
        } catch (error) {
            console.log(error);
            if (error.name === "HTTPError") {
                // Handle error
            }
        }
    };
};

export default AccessField;
