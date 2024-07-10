import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { MultiSelect } from 'react-multi-select-component';
import { useLocation, useNavigate } from "react-router-dom";
import AdminBuilderService from '../../../API/Services/AdminService/AdminBuilderService';

const FilterBuilder = () => {
    
    const [searchQuery, setSearchQuery] = useState("");
    const [filterQuery, setFilterQuery] = useState({
        name: "",
        is_active: "",
        active_communities: "",
        closing_this_year: "",
        permits_this_year: "",
        net_sales_this_year: "",
        current_avg_base_Price: "",
        avg_net_sales_per_month_this_year: "",
        avg_closings_per_month_this_year: "",
        company_type: "",
        city: "",
        zipcode: "",
        officeaddress1: "",
        coporate_officeaddress_zipcode: "",
        stock_market: "",
        date_of_latest_closing: "",
        date_of_first_closing: "",
        total_net_sales: "",
        total_permits: "",
        total_closings: "",
        median_closing_price_last_year: "",
        median_closing_price_this_year: "",
    });

    const [selectedBuilderName, setSelectedBuilderName] = useState([]);
    console.log("selectedBuilderName",selectedBuilderName);
    const [selectedStatus, setSelectedStatus] = useState([]);
    const [selectedCompanyType, setSelectedCompanyType] = useState([]);
    const [builderDropDown, setBuilderDropDown] = useState([]);

    const statusOptions = [
        { value: "1", label: "Yes" },
        { value: "0", label: "No" }
    ];

    const companyTypOptions = [
        { value: "Public", label: "Public" },
        { value: "Private", label: "Private" }
    ];

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (localStorage.getItem("usertoken")) {
            fetchBuilderList();
        } else {
            navigate("/");
        }
    }, []);

    useEffect(() => {
        if (location.state) {
            const { selectedBuilderName, selectedStatus, active_communities, selectedCompanyType } = location.state;
            setSelectedBuilderName(selectedBuilderName || []);
            setSelectedStatus(selectedStatus || []);
            setFilterQuery(prevState => ({
                ...prevState,
                active_communities: active_communities || "",
                name: selectedBuilderName.map(item => item.label).join(', '),
                is_active: selectedStatus.map(item => item.value).join(', '),
                company_type: selectedCompanyType.map(item => item.value).join(', ')
            }));
        }
    }, [location.state]);

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

    const fetchBuilderList = async () => {
        try {
            const response = await AdminBuilderService.builderDropDown();
            const data = await response.json();
            const formattedData = data.map((builder) => ({
                label: builder.name,
                value: builder.id,
            }));
            setBuilderDropDown(formattedData);
        } catch (error) {
            console.log("Error fetching builder list:", error);
        }
    };

    const handleSelectBuilderNameChange = (selectedItems) => {
        const selectedNames = selectedItems.map(item => item.label).join(', ');

        setSelectedBuilderName(selectedItems);
        setFilterQuery(prevState => ({
            ...prevState,
            name: selectedNames
        }));
    };

    const handleSelectStatusChange = (selectedItems) => {
        const selectedValues = selectedItems.map(item => item.value).join(', ');

        setSelectedStatus(selectedItems);
        setFilterQuery(prevState => ({
            ...prevState,
            is_active: selectedValues
        }));
    };

    const handleSelectCompanyTypeChange = (selectedItems) => {
        const selectedValues = selectedItems.map(item => item.value).join(', ');

        setSelectedCompanyType(selectedItems);
        setFilterQuery(prevState => ({
            ...prevState,
            company_type: selectedValues
        }));
    };

    const HandleFilterForm = (e) => {
        e.preventDefault();
        navigate("/builderList", { state: { 
            searchQuery: searchQuery.replace(/^"",|,""$/g, ''),
            selectedBuilderName,
            selectedStatus,
            active_communities: filterQuery.active_communities,
            selectedCompanyType
        } });
    };

    const HandleCancelFilter = () => {
        setFilterQuery({
            name: "",
            is_active: "",
            active_communities: "",
            closing_this_year: "",
            permits_this_year: "",
            net_sales_this_year: "",
            current_avg_base_Price: "",
            avg_net_sales_per_month_this_year: "",
            avg_closings_per_month_this_year: "",
            company_type: "",
            city: "",
            zipcode: "",
            officeaddress1: "",
            coporate_officeaddress_zipcode: "",
            stock_market: "",
            date_of_latest_closing: "",
            date_of_first_closing: "",
            total_net_sales: "",
            total_permits: "",
            total_closings: "",
            median_closing_price_last_year: "",
            median_closing_price_this_year: "",
        });
        setSelectedBuilderName([]);
        setSelectedStatus([]);
        setSelectedCompanyType([]);
    };

    const HandleFilter = (e) => {
        const { name, value } = e.target;
        setFilterQuery((prevFilterQuery) => ({
            ...prevFilterQuery,
            [name]: value,
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(value);
        setFilterQuery(prevFilterQuery => ({
            ...prevFilterQuery,
            [name]: value
        }));
    };

    return (
        <div className="container mt-5">
            <h2>Filter Builder</h2>
            <form onSubmit={HandleFilterForm}>
                <div className="row">
                    <div className="col-md-6 mt-3">
                        <label className="form-label">
                            BUILDER NAME:
                            <span className="text-danger">*</span>
                        </label>
                        <MultiSelect
                            name="name"
                            options={builderDropDown}
                            value={selectedBuilderName}
                            onChange={handleSelectBuilderNameChange}
                            placeholder="Select Builder Name"
                        />
                    </div>
                    <div className="col-md-6 mt-3">
                        <label className="form-label">
                            ACTIVE:
                            <span className="text-danger">*</span>
                        </label>
                        <MultiSelect
                            name="is_active"
                            options={statusOptions}
                            value={selectedStatus}
                            onChange={handleSelectStatusChange}
                            placeholder="Select Status"
                        />
                    </div>
                    <div className="col-md-6 mt-3">
                        <label className="form-label">
                            ACTIVE COMMUNITIES:
                            <span className="text-danger">*</span>
                        </label>
                        <input
                            type="number"
                            value={filterQuery.active_communities}
                            name="active_communities"
                            className="form-control"
                            onChange={HandleFilter}
                        />
                    </div>
                    <div className="col-md-6 mt-3">
                        <label className="form-label">
                            COMPANY TYPE:
                            <span className="text-danger">*</span>
                        </label>
                        <MultiSelect
                            name="company_type"
                            options={companyTypOptions}
                            value={selectedCompanyType}
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
                {/* <br />
                <h5 className="">Calculation Filter Options</h5>
                <div className="border-top">
                    <div className="row">
                        <div className="col-md-4 mt-3 mb-3">
                            <label className="form-label">CLOSINGS THIS YEAR:{" "}</label>
                            <input value={filterQuery.closing_this_year} name="closing_this_year" className="form-control" onChange={handleInputChange} />
                        </div>
                        <div className="col-md-4 mt-3 mb-3">
                            <label className="form-label">PERMITS THIS YEAR:{" "}</label>
                            <input value={filterQuery.permits_this_year} name="permits_this_year" className="form-control" onChange={handleInputChange} />
                        </div>
                        <div className="col-md-4 mt-3 mb-3">
                            <label className="form-label">NET SALES THIS YEAR:{" "}</label>
                            <input value={filterQuery.net_sales_this_year} name="net_sales_this_year" className="form-control" onChange={handleInputChange} />
                        </div>
                        <div className="col-md-4 mt-3 mb-3">
                            <label className="form-label">CURRENT AVG BASE PRICE:{" "}</label>
                            <input style={{ marginTop: "20px" }} value={filterQuery.current_avg_base_Price} name="current_avg_base_Price" className="form-control" onChange={handleInputChange} />
                        </div>
                        <div className="col-md-4 mt-3 mb-3">
                            <label className="form-label">AVG NET SALES PER MONTH THIS YEAR:{" "}</label>
                            <br />
                            <input value={filterQuery.avg_net_sales_per_month_this_year} name="avg_net_sales_per_month_this_year" className="form-control" onChange={handleInputChange} />
                        </div>
                        <div className="col-md-4 mt-3 mb-3">
                            <label className="form-label">AVG CLOSINGS PER MONTH THIS YEAR:{" "}</label>
                            <input value={filterQuery.avg_closings_per_month_this_year} name="avg_closings_per_month_this_year" className="form-control" onChange={handleInputChange} />
                        </div>
                        <div className="col-md-4 mt-3 mb-3">
                            <label className="form-label">MEDIAN CLOSING PRICE THIS YEAR:{" "}</label>
                            <input value={filterQuery.median_closing_price_this_year} name="median_closing_price_this_year" className="form-control" onChange={handleInputChange} />
                        </div>
                        <div className="col-md-4 mt-3 mb-3">
                            <label className="form-label">MEDIAN CLOSING PRICE LAST YEAR:{" "}</label>
                            <input value={filterQuery.median_closing_price_last_year} name="median_closing_price_last_year" className="form-control" onChange={handleInputChange} />
                        </div>
                        <div className="col-md-4 mt-3 mb-3">
                            <label className="form-label">TOTAL CLOSINGS:{" "}</label>
                            <input value={filterQuery.total_closings} name="total_closings" className="form-control" onChange={handleInputChange} />
                        </div>
                        <div className="col-md-4 mt-3 mb-3">
                            <label className="form-label">TOTAL PERMITS:{" "}</label>
                            <input value={filterQuery.total_permits} name="total_permits" className="form-control" onChange={handleInputChange} />
                        </div>
                        <div className="col-md-4 mt-3 mb-3">
                            <label className="form-label">TOTAL NET SALES :{" "}</label>
                            <input value={filterQuery.total_net_sales} name="total_net_sales" className="form-control" onChange={handleInputChange} />
                        </div>
                        <div className="col-md-4 mt-3 mb-3">
                            <label className="form-label">DATE OF FIRST CLOSING  :{" "}</label>
                            <input value={filterQuery.date_of_first_closing} name="date_of_first_closing" className="form-control" onChange={handleInputChange} />
                        </div>
                        <div className="col-md-4 mt-3 mb-3">
                            <label className="form-label">DATE OF LATEST CLOSING  :{" "}</label>
                            <input value={filterQuery.date_of_latest_closing} name="date_of_latest_closing" className="form-control" onChange={handleInputChange} />
                        </div>
                    </div>
                </div> */}
            </form>
        </div>
    );
};

export default FilterBuilder;
