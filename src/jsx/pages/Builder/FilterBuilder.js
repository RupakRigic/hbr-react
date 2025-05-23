import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { MultiSelect } from 'react-multi-select-component';
import { useNavigate } from "react-router-dom";
import AdminBuilderService from '../../../API/Services/AdminService/AdminBuilderService';

const FilterBuilder = () => {
    const navigate = useNavigate();
    const [selectedBuilderNameByFilter, setSelectedBuilderNameByFilter] = useState([]);
    const [selectedStatusByFilter, setSelectedStatusByFilter] = useState([]);
    const [selectedCompanyTypeByFilter, setSelectedCompanyTypeByFilter] = useState([]);
    const [builderListDropDown, setBuilderListDropDown] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterQuery, setFilterQuery] = useState({
        name: localStorage.getItem("builder_name_Builder") ? JSON.parse(localStorage.getItem("builder_name_Builder")) : "",
        is_active: localStorage.getItem("is_active_Builder") ? JSON.parse(localStorage.getItem("is_active_Builder")) : "",
        active_communities: localStorage.getItem("active_communities_Builder") ? JSON.parse(localStorage.getItem("active_communities_Builder")) : "",
        company_type: localStorage.getItem("company_type_Builder") ? JSON.parse(localStorage.getItem("company_type_Builder")) : "",
    });


    useEffect(() => {
        if(localStorage.getItem("selectedBuilderNameByFilterBuilder")) {
            const selectedBuilderName = JSON.parse(localStorage.getItem("selectedBuilderNameByFilterBuilder"));
            handleSelectBuilderNameChange(selectedBuilderName);
        }
        if(localStorage.getItem("selectedStatusByBuilderFilterBuilder")) {
          const selectedStatus = JSON.parse(localStorage.getItem("selectedStatusByBuilderFilterBuilder"));
          handleSelectStatusChange(selectedStatus);
        }
        if(localStorage.getItem("selectedCompanyTypeByFilterBuilder")) {
          const selectedCompanyType = JSON.parse(localStorage.getItem("selectedCompanyTypeByFilterBuilder"));
          handleSelectCompanyTypeChange(selectedCompanyType);
        }
    }, []);

    useEffect(() => {
        if (localStorage.getItem("usertoken")) {
            GetBuilderDropDownList();
        } else {
            navigate("/");
        }
    }, []);

    useEffect(() => {
        setSearchQuery(filterString());
    }, [filterQuery]);

    const filterString = () => {
        const queryString = Object.keys(filterQuery)
            .map(
                (key) =>
                    `${encodeURIComponent(key)}=${encodeURIComponent(filterQuery[key])}`
            )
            .join("&");

        return queryString ? `&${queryString}` : "";
    };

    const GetBuilderDropDownList = async () => {
        try {
            const response = await AdminBuilderService.builderDropDown();
            const responseData = await response.json();
            const formattedData = responseData.map((builder) => ({
                label: builder.name,
                value: builder.id,
            }));
            setBuilderListDropDown(formattedData);
        } catch (error) {
            console.log("Error fetching builder list:", error);
            if (error.name === "HTTPError") {
                const errorJson = await error.response.json();
            }
        }
    };

    useEffect(() => {
        if(localStorage.getItem("setBuilderFilter") == "true") {
            if((searchQuery == "") || (searchQuery == "&name=&is_active=&active_communities=&company_type=")){
                return;
            } else {
                navigate("/builderList");
                localStorage.setItem("selectedBuilderNameByFilterBuilder", JSON.stringify(selectedBuilderNameByFilter));
                localStorage.setItem("selectedStatusByBuilderFilterBuilder", JSON.stringify(selectedStatusByFilter));
                localStorage.setItem("selectedCompanyTypeByFilterBuilder", JSON.stringify(selectedCompanyTypeByFilter));
                localStorage.setItem("builder_name_Builder", JSON.stringify(filterQuery.name));
                localStorage.setItem("is_active_Builder", JSON.stringify(filterQuery.is_active));
                localStorage.setItem("active_communities_Builder", JSON.stringify(filterQuery.active_communities));
                localStorage.setItem("company_type_Builder", JSON.stringify(filterQuery.company_type));
                localStorage.setItem("searchQueryByBuilderFilter_Builder", JSON.stringify(searchQuery.replace(/^"",|,""$/g, '')));
            }
        }
        
    }, [searchQuery]);

    const HandleFilterForm = (e) => {
        e.preventDefault();
        navigate("/builderList");
        localStorage.setItem("selectedBuilderNameByFilterBuilder", JSON.stringify(selectedBuilderNameByFilter));
        localStorage.setItem("selectedStatusByBuilderFilterBuilder", JSON.stringify(selectedStatusByFilter));
        localStorage.setItem("selectedCompanyTypeByFilterBuilder", JSON.stringify(selectedCompanyTypeByFilter));
        localStorage.setItem("builder_name_Builder", JSON.stringify(filterQuery.name));
        localStorage.setItem("is_active_Builder", JSON.stringify(filterQuery.is_active));
        localStorage.setItem("active_communities_Builder", JSON.stringify(filterQuery.active_communities));
        localStorage.setItem("company_type_Builder", JSON.stringify(filterQuery.company_type));
        localStorage.setItem("searchQueryByBuilderFilter_Builder", JSON.stringify(searchQuery.replace(/^"",|,""$/g, '')));
        localStorage.setItem("setBuilderFilter", true);
    };

    const handleSelectBuilderNameChange = (selectedItems) => {
        const selectedNames = selectedItems.map(item => item.label).join(', ');

        setSelectedBuilderNameByFilter(selectedItems);
        setFilterQuery(prevState => ({
            ...prevState,
            name: selectedNames
        }));
    };

    const handleSelectStatusChange = (selectedItems) => {
        const selectedValues = selectedItems.map(item => item.value).join(', ');

        setSelectedStatusByFilter(selectedItems);
        setFilterQuery(prevState => ({
            ...prevState,
            is_active: selectedValues
        }));
    };

    const handleSelectCompanyTypeChange = (selectedItems) => {
        const selectedValues = selectedItems.map(item => item.value).join(', ');

        setSelectedCompanyTypeByFilter(selectedItems);
        setFilterQuery(prevState => ({
            ...prevState,
            company_type: selectedValues
        }));
    };

    const HandleFilter = (e) => {
        const { name, value } = e.target;
        setFilterQuery((prevFilterQuery) => ({
            ...prevFilterQuery,
            [name]: value,
        }));
    };

    const HandleCancelFilter = () => {
        setFilterQuery({
            name: "",
            is_active: "",
            active_communities: "",
            company_type: "",
        });
        setSelectedBuilderNameByFilter([]);
        setSelectedStatusByFilter([]);
        setSelectedCompanyTypeByFilter([]);
    };

    const statusOptions = [
        { value: "1", label: "Yes" },
        { value: "0", label: "No" }
    ];

    const companyTypOptions = [
        { value: "Public", label: "Public" },
        { value: "Private", label: "Private" }
    ];

    return (
        <div className="container mt-5">
            <h2>Filter Builders</h2>
            <form onSubmit={HandleFilterForm}>
                <div className="row">
                    <div className="col-md-6 mt-3">
                        <label className="form-label">BUILDER NAME:</label>
                        <MultiSelect
                            name="name"
                            options={builderListDropDown}
                            value={selectedBuilderNameByFilter}
                            onChange={handleSelectBuilderNameChange}
                            placeholder="Select Builder Name"
                        />
                    </div>
                    <div className="col-md-6 mt-3">
                        <label className="form-label">ACTIVE:</label>
                        <MultiSelect
                            name="is_active"
                            options={statusOptions}
                            value={selectedStatusByFilter}
                            onChange={handleSelectStatusChange}
                            placeholder="Select Status"
                        />
                    </div>
                    <div className="col-md-6 mt-3">
                        <label className="form-label">ACTIVE COMMUNITIES:</label>
                        <input
                            type="text"
                            value={filterQuery.active_communities}
                            name="active_communities"
                            className="form-control"
                            onChange={HandleFilter}
                        />
                    </div>
                    <div className="col-md-6 mt-3">
                        <label className="form-label">COMPANY TYPE:</label>
                        <MultiSelect
                            name="company_type"
                            options={companyTypOptions}
                            value={selectedCompanyTypeByFilter}
                            onChange={handleSelectCompanyTypeChange}
                            placeholder="Select Company Type"
                        />
                    </div>
                </div>

                <div className="row mt-4">
                    <div className="col-md-6">
                        <Button
                            className="btn-sm"
                            onClick={HandleCancelFilter}
                            variant="secondary"
                        >
                            Reset
                        </Button>
                    </div>
                    <div className="col-md-6 d-flex justify-content-end">
                        <Button
                            className="btn-sm"
                            type="submit"
                            variant="primary"
                            onClick={HandleFilterForm}
                        >
                            Filter
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default FilterBuilder;
