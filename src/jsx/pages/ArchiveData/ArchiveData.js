import React, { Fragment, useEffect, useState } from 'react';
import MainPagetitle from '../../layouts/MainPagetitle';
import { Link, useNavigate } from "react-router-dom";
import ClipLoader from 'react-spinners/ClipLoader';
import { Button, Offcanvas } from 'react-bootstrap';
import Modal from "react-bootstrap/Modal";
import Select from 'react-select';
import DatePicker from "react-datepicker";
import AdminBuilderService from '../../../API/Services/AdminService/AdminBuilderService';
import { MultiSelect } from 'react-multi-select-component';
import { Form } from "react-bootstrap";
import swal from "sweetalert";
import AdminSubdevisionService from '../../../API/Services/AdminService/AdminSubdevisionService';
import AdminClosingService from '../../../API/Services/AdminService/AdminClosingService';

const ArchiveData = () => {
    const navigate = useNavigate();
    const SyestemUserRole = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).role : "";
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPage = 100;
    const lastIndex = currentPage * recordsPage;
    const [npage, setNpage] = useState(0);
    const number = [...Array(npage + 1).keys()].slice(1);
    const [fieldList, setFieldList] = useState([]);
    const [selectedFields, setSelectedFields] = useState([]);
    const [archiveList, setArchiveList] = useState([]);
    const [monthData, setMonthData] = useState([]);
    const [yearData, setYearData] = useState([]);
    const [archiveListCount, setArchiveListCount] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [message, setMessage] = useState("");
    const [archiveDataId, setArchiveDataId] = useState("");
    const [selectedYear, setSelectedYear] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState([]);
    const [showFilterPopupLoading, setShowFilterPopupLoading] = useState(false);
    const [showFilterPopup, setShowFilterPopup] = useState(false);
    const HandleFilterPopupShow = (id) => {
        setShowFilterPopup(true);
        setArchiveDataId(id);
        ArchiveDataDateRange(id);
    };
    const HandleFilterPopupClose = () => {
        setShowFilterPopup(false);
        setSelectedYear([]);
        setSelectedMonth([]);
    };

    const [selectedTypeName, setSelectedTypeName] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [filterQuery, setFilterQuery] = useState({});

    const [dropdowns, setDropdowns] = useState({
        builder: [],
        subdivision: [],
        masterPlan: [],
        lender: []
    });

    const [selected, setSelected] = useState({
        builder_name: [],
        subdivision_name: [],
        product_type: [],
        area: [],
        masterplan_id: [],
        age: [],
        single: [],
        closing_type: [],
        lender: []
    });

    const updateFilter = (name, value) => setFilterQuery(prev => ({ ...prev, [name]: value }));

    const prePage = () => {
        if (currentPage !== 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const changeCPage = (id) => {
        setCurrentPage(id);
    };

    const nextPage = () => {
        if (currentPage !== npage) {
            setCurrentPage(currentPage + 1);
        }
    };

    const [showPopup, setShowPopup] = useState(false);
    const HandlePopupShow = () => {
        setShowPopup(true);
    };
    const HandlePopupClose = () => {
        setShowPopup(false);
        setSelectedType("");
        setSelectedTypeName("");
        setSelectedFields([]);
        setFilterQuery({});
        setSelected({
            builder_name: [],
            subdivision_name: [],
            product_type: [],
            area: [],
            masterplan_id: [],
            age: [],
            single: [],
            closing_type: [],
            lender: []
        });
        setDropdowns({
            builder: [],
            subdivision: [],
            masterPlan: [],
            lender: []
        });
    };

    useEffect(() => {
        GetArchieveList();
    }, []);

    useEffect(() => {
        if (showPopup) {
            GetBuilderDropDownList();
            GetMasterPlanDropDownList();
            GetLenderList();
        }
    }, [showPopup]);

    useEffect(() => {
        if (showPopup) {
            SubdivisionByBuilderIDList(selected?.builder_name?.map(data => data.value));
        }
    }, [selected?.builder_name, showPopup]);

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
            setDropdowns((prev) => ({
                ...prev,
                builder: formattedData,
            }));
        } catch (error) {
            console.log("Error fetching builder list:", error);
            if (error.name === "HTTPError") {
                const errorJson = await error.response.json();
                console.log(errorJson);
            }
        }
    };

    const SubdivisionByBuilderIDList = async (selectedBuilderIDByFilter) => {
        try {
            var userData = {
                builder_ids: selectedBuilderIDByFilter
            }
            const response = await AdminSubdevisionService.subdivisionbybuilderidlist(userData);
            const responseData = await response.json();
            const formattedData = responseData.data.map((subdivision) => ({
                label: subdivision.name,
                value: subdivision.id,
            }));
            setDropdowns((prev) => ({
                ...prev,
                subdivision: formattedData,
            }));
        } catch (error) {
            console.log("Error fetching subdivision list:", error);
            if (error.name === "HTTPError") {
                const errorJson = await error.response.json();
                console.log(errorJson);
            }
        }
    };

    const GetMasterPlanDropDownList = async () => {
        try {
            const response = await AdminBuilderService.masterPlanDropDown();
            const responseData = await response.json();
            const formattedData = responseData.map((masterPlan) => ({
                label: masterPlan.label,
                value: masterPlan.value,
            }));
            setDropdowns((prev) => ({
                ...prev,
                masterPlan: formattedData,
            }));
        } catch (error) {
            console.log("Error fetching master plan list:", error);
            if (error.name === "HTTPError") {
                const errorJson = await error.response.json();
                console.log(errorJson);
            }
        }
    };

    const GetLenderList = async () => {
        try {
            let response = await AdminClosingService.lender()
            let responseData = await response.json()
            const formattedData = responseData.map((lender) => ({
                label: lender.lender,
                value: lender.lender,
            }));
            setDropdowns((prev) => ({
                ...prev,
                lender: formattedData,
            }));
        } catch (error) {
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();
                console.log(errorJson.message);
            }
        }
    };

    const GetArchieveList = async () => {
        setIsLoading(true);
        try {
            const response = await AdminBuilderService.getArchiveList();
            const responseData = await response.json();
            if (responseData?.status == false) {
                setIsLoading(false);
            } else {
                setArchiveList(responseData);
                setNpage(Math.ceil(responseData.length / recordsPage));
                setArchiveListCount(responseData.length);
                setIsLoading(false);
            }
        } catch (error) {
            console.log(error);
            setIsLoading(false);
            if (error.name === "HTTPError") {
                console.log(error.name);
            }
        }
    };

    const ArchiveDataDateRange = async (id) => {
        setShowFilterPopupLoading(true);
        try {
            const response = await AdminBuilderService.archive_data_date_range(id).json();
            if (response.status) {
                setMonthData(response.month);
                setYearData(response.year);
                setShowFilterPopupLoading(false);
            } else {
                setShowFilterPopupLoading(false);
            }
        } catch (error) {
            console.log(error);
            setShowFilterPopupLoading(false);
            if (error.name === "HTTPError") {
                console.log(error.name);
            }
        }
    };

    const ArchiveDataShow = async () => {
        if (selectedYear?.length === 0 || selectedMonth?.length === 0) {
            setMessage("Please selecet required fields.");
            return;
        } else {
            navigate(`/archivedata-update/${archiveDataId}`);
            HandleFilterPopupClose();
        }
    };

    const HandlePopupSave = async () => {
        if (selectedType == "" || filterQuery.from == "" || filterQuery.to == "" || selectedFields.length == 0) {
            setMessage("Please selecet required fields.");
            return;
        }
        // setShowPopup(false);
        setIsLoading(true);
        try {
            let selectedValues = selectedFields.map(item => item.value);
            let selectedValueString = selectedValues.join(', ');
            let selectedValuesArray = selectedValueString.split(', ').map(item => item.trim());
            var userData = {
                "type": selectedType,
                "start_date": filterQuery.from,
                "end_date": filterQuery.to,
                "fields": selectedValuesArray
            }
            const response = await AdminBuilderService.archiveDownloadData(searchQuery, userData);
            const responseData = await response.json();
            if (responseData.status == true) {
                swal(responseData.message).then((willDelete) => {
                    if (willDelete) {
                        HandlePopupClose();
                        GetArchieveList();
                        setIsLoading(false);
                    }
                });
            } else {
                swal(responseData.message).then((willDelete) => {
                    if (willDelete) {
                        HandlePopupClose();
                        setIsLoading(false);
                    }
                });
            }
        } catch (error) {
            console.log(error);
            setIsLoading(false);
            if (error.name === "HTTPError") {
                console.log(error.name);
            }
        }
    };

    const handleDownload = async (e, filepath, filename) => {
        e.preventDefault();
        try {
            const fileUrl = `${process.env.REACT_APP_IMAGE_URL}${filepath}`;
            const link = document.createElement('a');
            link.href = fileUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Download failed:', error);
        }
    };

    const handleDelete = async (e) => {
        console.log(e);
        try {
            let responseData = await AdminBuilderService.destroyArchive(e).json();
            if (responseData.status === true) {
                swal(responseData.message).then((willDelete) => {
                    if (willDelete) {
                        GetArchieveList();
                    }
                });
            }
        } catch (error) {
            if (error.name === "HTTPError") {
                const errorJson = await error.response.json();
                console.log(errorJson);
            }
        }
    };

    const HandleTable = async (tableName) => {
        setMessage("");
        setSelectedFields([]);
        setFilterQuery({});
        setSelected({
            builder_name: [],
            subdivision_name: [],
            product_type: [],
            area: [],
            masterplan_id: [],
            age: [],
            single: [],
            closing_type: [],
            lender: []
        });
        setSelectedType(tableName.value);
        setSelectedTypeName(tableName.label);
        try {
            const response = await AdminBuilderService.getRoleFieldList(tableName.value);
            const responseData = await response.json();
            setFieldList(responseData);
        } catch (error) {
            console.log(error);
            if (error.name === "HTTPError") {
                console.log(error.name);
            }
        }
    };

    const handleMultiSelectChange = (field, selectedItems, valueField = 'value', labelField = 'label') => {
        const values = selectedItems.map(item => item[valueField]).join(', ');
        const labels = selectedItems.map(item => item[labelField]).join(', ');
        setSelected(prev => ({
            ...prev,
            [field]: selectedItems
        }));

        if(field == "builder_name" || field == "subdivision_name") {
            updateFilter(field, labels);
        } else {
            updateFilter(field, values);
        }
    };

    const handleDateChange = (field, date) => {
        if (!date) return;
        const formattedDate = date.toLocaleDateString('en-US');
        updateFilter(field, formattedDate);
    };

    const parseDate = (dateString) => {
        const [month, day, year] = dateString.split('/');
        return new Date(year, month - 1, day);
    };

    const renderInput = (name, label, type = "text") => (
        <div className="col-md-3 mt-3">
            <label className="form-label">{label}</label>
            <input
                name={name}
                type={type}
                value={filterQuery[name] || ''}
                className="form-control"
                onChange={(e) => updateFilter(name, e.target.value)}
            />
        </div>
    );

    const renderSelect = (name, label, options, selectedField, valueField = 'value', labelField = 'label') => (
        <div className="col-md-3 mt-3">
            <label className="form-label">{label}</label>
            <MultiSelect
                name={name}
                options={options}
                value={selected[selectedField]}
                onChange={(items) => handleMultiSelectChange(name, items, valueField, labelField)}
                placeholder={`Select ${label}`}
            />
        </div>
    );

    const renderDate = (name, label) => (
        <div className="col-md-3 mt-3">
            <label className="form-label">{label}{" "}<span className="text-danger">*</span></label>
            <DatePicker
                name={name}
                className="form-control"
                selected={filterQuery[name] ? parseDate(filterQuery[name]) : null}
                onChange={(date) => handleDateChange(name, date)}
                dateFormat="MM/dd/yyyy"
                placeholderText="mm/dd/yyyy"
            />
        </div>
    );

    const renderCommonFields = () => (
        <>
            {renderDate("from", "From")}
            {renderDate("to", "To")}
            {renderSelect("builder_name", "Builder Name", dropdowns.builder, "builder_name")}
            {renderSelect("subdivision_name", "Subdivision Name", dropdowns.subdivision, "subdivision_name")}
            {renderSelect("product_type", "Product Type", productTypeOptions, "product_type")}
            {renderSelect("area", "Area", areaOption, "area")}
            {renderSelect("masterplan_id", "Master Plan", dropdowns.masterPlan, "masterplan_id")}
            {renderInput("zipcode", "Zip Code")}
            {renderInput("lotwidth", "Lot Width")}
            {renderInput("lotsize", "Lot Size")}
            {renderSelect("age", "Age Restricted", ageOptions, "age")}
            {renderSelect("single", "All Single Story", singleOptions, "single")}
        </>
    );

    const renderFieldsByType = () => {
        switch (selectedTypeName) {
            case "Permits":
                return (
                    <>
                        {renderCommonFields()}
                        {renderInput("address2", "Address Number")}
                        {renderInput("address1", "Address Name")}
                        {renderInput("parcel", "Parcel Number")}
                        {renderInput("sqft", "Square Footage")}
                        {renderInput("lotnumber", "Lot Number")}
                        {renderInput("permitnumber", "Permit Number")}
                        {renderInput("plan", "Plan")}
                    </>
                );

            case "Weekly Traffic & Sales":
                return (
                    <>
                        {renderCommonFields()}
                        {renderInput("weeklytraffic", "Weekly Traffic")}
                        {renderInput("cancelations", "Weekly Cancellations")}
                        {renderInput("netsales", "Weekly Net Sales")}
                        {renderInput("totallots", "Total Lots")}
                        {renderInput("lotreleased", "Lots Released for Sales")}
                        {renderInput("unsoldinventory", "Unsold Standing Inventory")}
                        {renderInput("zoning", "Zoning")}
                    </>
                );

            case "Base Prices":
                return (
                    <>
                        {renderCommonFields()}
                        {renderInput("name", "Product Name")}
                        {renderInput("sqft", "Square Footage")}
                        {renderInput("stories", "Stories")}
                        {renderInput("bedroom", "Bedrooms")}
                        {renderInput("bathroom", "Bathrooms")}
                        {renderInput("garage", "Garage")}
                        {renderInput("price_per_sqft", "Price Per SQFT")}
                    </>
                );

            case "Closings":
                return (
                    <>
                        {renderCommonFields()}
                        {renderSelect("closing_type", "Closing Type", closingType, "closing_type")}
                        {renderInput("document", "Doc")}
                        {renderInput("closingprice", "Closing Price")}
                        {renderInput("address", "Address")}
                        {renderInput("parcel", "Parcel Number")}
                        {renderInput("sellerleagal", "Seller Legal Name")}
                        {renderInput("buyer", "Buyer")}
                        {renderSelect("lender", "Lender", dropdowns.lender, "lender")}
                        {renderInput("loanamount", "Loan Amount")}
                    </>
                );
            
            case "Land Sales":
                return (
                    <>
                        {renderDate("from", "From")}
                        {renderDate("to", "To")}
                        {renderSelect("builder_name", "Builder Name", dropdowns.builder, "builder_name")}
                        {renderSelect("subdivision_name", "Subdivision Name", dropdowns.subdivision, "subdivision_name")}
                        {renderInput("seller", "Seller")}
                        {renderInput("buyer", "Buyer")}
                        {renderInput("location", "Location")}
                        {renderInput("notes", "Notes")}
                        {renderInput("price", "Price")}
                        {renderInput("priceperunit", "Price Per")}
                        {renderInput("parcel", "Parcel")}
                        {renderInput("doc", "Doc")}
                        {renderInput("noofunit", "Size")}
                        {renderInput("typeofunit", "Size MS")}
                    </>
                );
            default:
                return null;
        }
    };

    const HandleFiels = (selectedItems) => {
        setMessage("");
        setSelectedFields(selectedItems);
    };

    const ageOptions = [
        { value: "1", label: "Yes" },
        { value: "0", label: "No" }
    ];

    const singleOptions = [
        { value: "1", label: "Yes" },
        { value: "0", label: "No" }
    ];

    const areaOption = [
        { value: "BC", label: "BC" },
        { value: "E", label: "E" },
        { value: "H", label: "H" },
        { value: "IS", label: "IS" },
        { value: "L", label: "L" },
        { value: "MSQ", label: "MSQ" },
        { value: "MV", label: "MV" },
        { value: "NLV", label: "NLV" },
        { value: "NW", label: "NW" },
        { value: "P", label: "P" },
        { value: "SO", label: "SO" },
        { value: "SW", label: "SW" }
    ];

    const productTypeOptions = [
        { value: "DET", label: "DET" },
        { value: "ATT", label: "ATT" },
        { value: "HR", label: "HR" },
        { value: "AC", label: "AC" }
    ];

    const closingType = [
        { value: "NEW", label: "NEW" },
        { value: "RESALES", label: "RESALES" },
    ];

    const typeOptions = [
        { value: 'permits', label: 'Permits' },
        { value: 'traffic', label: 'Weekly Traffic & Sales' },
        { value: 'prices', label: 'Base Prices' },
        { value: 'closing', label: 'Closings' },
        { value: 'landsale', label: 'Land Sales' }
    ];

    const fieldsOptions = fieldList
        ?.filter(element => element !== "Action")
        .map(element => ({
            value: element,
            label: element
        }));

    const yearsOptions = yearData?.map(element => ({
        value: element,
        label: element
    }));

    const monthsOptions = monthData?.map(element => ({
        value: element,
        label: element
    }));

    const HandleYearSelect = (selectedOption) => {
        setSelectedYear(selectedOption);
        localStorage.setItem("selectedYear", JSON.stringify(selectedOption));
    };

    const HandleMonthSelect = (selectedOption) => {
        setSelectedMonth(selectedOption);
        localStorage.setItem("selectedMonth", JSON.stringify(selectedOption));
    };

    return (
        <Fragment>
            <MainPagetitle mainTitle="Archive Data" pageTitle="Archive Data" parentTitle="Home" />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xl-12">
                        <div className="card">
                            <div className="card-body p-0">
                                <div className="table-responsive active-projects style-1 ItemsCheckboxSec shorting">
                                    <div className="tbl-caption d-flex justify-content-between text-wrap align-items-center pb-0">
                                        <div className="d-flex text-nowrap justify-content-between align-items-center">
                                            <h4 className="heading mb-0">Archive Data List</h4>
                                        </div>
                                        {SyestemUserRole == "Data Uploader" || SyestemUserRole == "User" || SyestemUserRole == "Tester" || SyestemUserRole == "Standard User" ? ("") : (
                                            <div className="d-flex justify-content-between">
                                                <div>
                                                    <Button
                                                        className="btn-sm me-2"
                                                        variant="primary"
                                                        onClick={() => HandlePopupShow()}
                                                    >
                                                        <i class="bi bi-plus"></i> Add Download Request
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="d-sm-flex text-center justify-content-between align-items-center dataTables_wrapper no-footer">
                                        <div className="dataTables_info">
                                            Showing {lastIndex - recordsPage + 1} to {lastIndex} of{" "}
                                            {archiveListCount} entries
                                        </div>
                                        <div
                                            className="dataTables_paginate paging_simple_numbers justify-content-center"
                                            id="example2_paginate"
                                        >
                                            <Link
                                                className="paginate_button previous disabled"
                                                to="#"
                                                onClick={prePage}
                                            >
                                                <i className="fa-solid fa-angle-left" />
                                            </Link>
                                            <span>
                                                {number.map((n, i) => {
                                                    if (number.length > 4) {
                                                        if (
                                                            i === 0 ||
                                                            i === number.length - 1 ||
                                                            Math.abs(currentPage - n) <= 1 ||
                                                            (i === 1 && n === 2) ||
                                                            (i === number.length - 2 &&
                                                                n === number.length - 1)
                                                        ) {
                                                            return (
                                                                <Link
                                                                    className={`paginate_button ${currentPage === n ? "current" : ""
                                                                        } `}
                                                                    key={i}
                                                                    onClick={() => changeCPage(n)}
                                                                >
                                                                    {n}
                                                                </Link>
                                                            );
                                                        } else if (i === 1 || i === number.length - 2) {
                                                            return <span key={i}>...</span>;
                                                        } else {
                                                            return null;
                                                        }
                                                    } else {
                                                        return (
                                                            <Link
                                                                className={`paginate_button ${currentPage === n ? "current" : ""
                                                                    } `}
                                                                key={i}
                                                                onClick={() => changeCPage(n)}
                                                            >
                                                                {n}
                                                            </Link>
                                                        );
                                                    }
                                                })}
                                            </span>

                                            <Link
                                                className="paginate_button next"
                                                to="#"
                                                onClick={nextPage}
                                            >
                                                <i className="fa-solid fa-angle-right" />
                                            </Link>
                                        </div>
                                    </div>
                                    <div
                                        id="employee-tbl_wrapper"
                                        className="dataTables_wrapper no-footer"
                                    >
                                        {isLoading ? (
                                            <div className="d-flex justify-content-center align-items-center mb-5">
                                                <ClipLoader color="#4474fc" />
                                            </div>
                                        ) : (
                                            <table
                                                id="empoloyees-tblwrapper"
                                                className="table ItemsCheckboxSec dataTable no-footer mb-0"
                                            >
                                                <thead>
                                                    <tr style={{ textAlign: "center" }}>
                                                        <th>No.</th>
                                                        <th>Type</th>
                                                        <th>Start Date</th>
                                                        <th>End Date</th>
                                                        <th>File Name</th>
                                                        <th>Download</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {archiveList !== null && archiveList.length > 0 ? (
                                                        archiveList.map((element, index) => (
                                                            <tr style={{ textAlign: "center" }}>
                                                                <td>{index + 1}</td>
                                                                <td>
                                                                    {
                                                                        element.type == "permits" ? "Permits" :
                                                                        element.type == "traffic" ? "Traffic Sales" : 
                                                                        element.type == "prices" ? "Product Prices" : 
                                                                        element.type == "closing" ? "Closings" : 
                                                                        element.type == "landsale" ? "Land Sales" : "-"
                                                                    }
                                                                </td>
                                                                <td>{element.start_date}</td>
                                                                <td>{element.end_date}</td>
                                                                <td style={{ textAlign: "center" }}>{element.filename}</td>
                                                                <td key={element.id} style={{ textAlign: "center" }}>
                                                                    <div className="d-flex justify-content-center">
                                                                        <Link
                                                                            onClick={(e) => {
                                                                                if (element.download_status == 1) {
                                                                                    swal({
                                                                                        title: "Are you sure to download?",
                                                                                        buttons: true,
                                                                                        dangerMode: false,
                                                                                    }).then((willDelete) => {
                                                                                        if (willDelete) {
                                                                                            handleDownload(e, element.filepath, element.filename);
                                                                                        }
                                                                                    })
                                                                                } else {
                                                                                    return;
                                                                                }
                                                                            }
                                                                            }
                                                                            className={"btn btn-primary shadow btn-xs sharp"}
                                                                            style={element.download_status == 1 ? { cursor: "Pointer" } : { cursor: "not-allowed" }}
                                                                        >
                                                                            {element.download_status == 1 ? <i className="fa fa-download"></i>
                                                                                :
                                                                                <i className="fa fa-download" style={{ cursor: "not-allowed" }}></i>
                                                                            }
                                                                        </Link>
                                                                    </div>
                                                                </td>
                                                                <td key={element.id} style={{ textAlign: "center" }}>
                                                                    <div className="d-flex justify-content-center">
                                                                        <Link
                                                                            className="btn btn-success shadow btn-xs sharp me-2"
                                                                            onClick={() => HandleFilterPopupShow(element.id)}
                                                                        >
                                                                            <i className="fas fa-pencil-alt"></i>
                                                                        </Link>
                                                                        <Link
                                                                            onClick={() =>
                                                                                swal({
                                                                                    title: "Are you sure?",
                                                                                    icon: "warning",
                                                                                    buttons: true,
                                                                                    dangerMode: true,
                                                                                }).then((willDelete) => {
                                                                                    if (willDelete) {
                                                                                        handleDelete(element.id);
                                                                                    }
                                                                                })
                                                                            }
                                                                            className="btn btn-danger shadow btn-xs sharp"
                                                                        >
                                                                            <i className="fa fa-trash"></i>
                                                                        </Link>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))) : (
                                                        <tr>
                                                            <td colSpan="7" style={{ textAlign: "center" }}>
                                                                No data found
                                                            </td>
                                                        </tr>)}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                    <div className="d-sm-flex text-center justify-content-between align-items-center dataTables_wrapper no-footer">
                                        <div className="dataTables_info">
                                            Showing {lastIndex - recordsPage + 1} to {lastIndex} of{" "}
                                            {archiveListCount} entries
                                        </div>
                                        <div
                                            className="dataTables_paginate paging_simple_numbers justify-content-center"
                                            id="example2_paginate"
                                        >
                                            <Link
                                                className="paginate_button previous disabled"
                                                to="#"
                                                onClick={prePage}
                                            >
                                                <i className="fa-solid fa-angle-left" />
                                            </Link>
                                            <span>
                                                {number.map((n, i) => {
                                                    if (number.length > 4) {
                                                        if (
                                                            i === 0 ||
                                                            i === number.length - 1 ||
                                                            Math.abs(currentPage - n) <= 1 ||
                                                            (i === 1 && n === 2) ||
                                                            (i === number.length - 2 &&
                                                                n === number.length - 1)
                                                        ) {
                                                            return (
                                                                <Link
                                                                    className={`paginate_button ${currentPage === n ? "current" : ""
                                                                        } `}
                                                                    key={i}
                                                                    onClick={() => changeCPage(n)}
                                                                >
                                                                    {n}
                                                                </Link>
                                                            );
                                                        } else if (i === 1 || i === number.length - 2) {
                                                            return <span key={i}>...</span>;
                                                        } else {
                                                            return null;
                                                        }
                                                    } else {
                                                        return (
                                                            <Link
                                                                className={`paginate_button ${currentPage === n ? "current" : ""
                                                                    } `}
                                                                key={i}
                                                                onClick={() => changeCPage(n)}
                                                            >
                                                                {n}
                                                            </Link>
                                                        );
                                                    }
                                                })}
                                            </span>

                                            <Link
                                                className="paginate_button next"
                                                to="#"
                                                onClick={nextPage}
                                            >
                                                <i className="fa-solid fa-angle-right" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Download Request Canvas  */}
            <Offcanvas
                show={showPopup}
                onHide={setShowPopup}
                className="offcanvas-end customeoff"
                placement="end"
            >
                <div className="offcanvas-header border-bottom">
                    <h5 className="modal-title" id="#gridSystemModal">{selectedTypeName ? selectedTypeName + " " + "Request" : "Download Request"}</h5>
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => HandlePopupClose()}
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div className="offcanvas-body">
                    <div className="container-fluid">
                        <div className="">
                            <form onSubmit={""}>
                                <div className='row'>
                                    <div className="col-md-3 mt-3" style={{ width: "50%" }}>
                                        <label className="form-label">Data Type:{" "}<span className="text-danger">*</span></label>
                                        <Select
                                            options={typeOptions}
                                            onChange={(selectedOption) => HandleTable(selectedOption)}
                                            placeholder="Select a Data Type..."
                                            styles={{
                                                container: (provided) => ({
                                                    ...provided,
                                                    width: '100%',
                                                    color: 'black'
                                                }),
                                                menu: (provided) => ({
                                                    ...provided,
                                                    width: '100%',
                                                    color: 'black'
                                                }),
                                            }}
                                        />
                                    </div>
                                    {selectedTypeName && 
                                        <div className="col-md-3 mt-3" style={{ width: "50%" }}>
                                            <div>
                                                <label className="form-label">Fields:{" "}<span className="text-danger">*</span></label>
                                                <Form.Group controlId="tournamentList">
                                                    <MultiSelect
                                                        options={fieldsOptions}
                                                        value={selectedFields}
                                                        onChange={(selectedOption) => HandleFiels(selectedOption)}
                                                        placeholder="Search and select a fields..."
                                                        styles={{
                                                            container: (provided) => ({
                                                                ...provided,
                                                                width: '100%',
                                                                color: 'black'
                                                            }),
                                                            menu: (provided) => ({
                                                                ...provided,
                                                                width: '100%',
                                                                color: 'black'
                                                            }),
                                                        }}
                                                    />
                                                </Form.Group>
                                            </div>
                                        </div>
                                    }
                                </div>
                                {/* <h5 className='mt-3'>
                                    {selectedTypeName ? selectedTypeName + " " + "Request" : ""}
                                </h5> */}
                                <div className="row">
                                    {renderFieldsByType()}
                                </div>
                            </form>
                        </div>
                        &nbsp;
                        <div className="d-flex justify-content-between">
                            <Button className="btn-sm" variant="secondary" onClick={HandlePopupClose}>
                                Close
                            </Button>
                            <Button className="btn-sm" variant="primary" onClick={() => HandlePopupSave()}>
                                Apply
                            </Button>
                        </div>
                    </div>
                </div>
            </Offcanvas>

            {/* Filter Archive Data Popup */}
            <Modal show={showFilterPopup} onHide={HandleFilterPopupShow}>
                <Modal.Header HandleFilterPopupClose>
                    <Modal.Title>Filter Archive Data Update</Modal.Title>
                    <button
                        className="btn-close"
                        aria-label="Close"
                        onClick={() => HandleFilterPopupClose()}
                    ></button>
                </Modal.Header>
                {showFilterPopupLoading ? (
                    <div className="d-flex justify-content-center align-items-center mb-5 mt-5">
                        <ClipLoader color="#4474fc" />
                    </div>
                ) : (
                    <Modal.Body>
                        <div className="row">
                            <div className="col-md-3 mt-1" style={{ width: "200px" }}>
                                <label className="form-label">Select Year:{" "}<span className="text-danger">*</span></label>
                                <Select
                                    options={yearsOptions}
                                    onChange={(selectedOption) => HandleYearSelect(selectedOption)}
                                    placeholder="Select Year"
                                    styles={{
                                        container: (provided) => ({
                                            ...provided,
                                            width: '100%',
                                            color: 'black'
                                        }),
                                        menu: (provided) => ({
                                            ...provided,
                                            width: '100%',
                                            color: 'black'
                                        }),
                                    }}
                                />
                            </div>
                            <div className="col-md-3 mt-1" style={{ width: "200px" }}>
                                <label className="form-label">Select Month:{" "}<span className="text-danger">*</span></label>
                                <Select
                                    options={monthsOptions}
                                    onChange={(selectedOption) => HandleMonthSelect(selectedOption)}
                                    placeholder="Select Month"
                                    styles={{
                                        container: (provided) => ({
                                            ...provided,
                                            width: '100%',
                                            color: 'black'
                                        }),
                                        menu: (provided) => ({
                                            ...provided,
                                            width: '100%',
                                            color: 'black'
                                        }),
                                    }}
                                />
                            </div>
                            <div className="text-danger" style={{ marginTop: "10px", fontSize: "13px" }}>
                                {message}
                            </div>
                        </div>
                    </Modal.Body>
                )}
                <Modal.Footer>
                    <Button variant="primary" onClick={() => ArchiveDataShow()}>
                        Apply
                    </Button>
                    <Button variant="primary" onClick={HandleFilterPopupClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    )
}

export default ArchiveData;
