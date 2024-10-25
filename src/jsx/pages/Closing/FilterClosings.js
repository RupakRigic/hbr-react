import React, { Fragment, useEffect, useState } from 'react';
import AdminSubdevisionService from '../../../API/Services/AdminService/AdminSubdevisionService';
import AdminBuilderService from '../../../API/Services/AdminService/AdminBuilderService';
import { useNavigate } from 'react-router-dom';
import { MultiSelect } from 'react-multi-select-component';
import DatePicker from "react-datepicker";
import { Form } from "react-bootstrap";
import { Button } from 'react-bootstrap';
import AdminClosingService from '../../../API/Services/AdminService/AdminClosingService';
import moment from 'moment';
import Modal from "react-bootstrap/Modal";

const FilterClosings = () => {
    const navigate = useNavigate();
    const [seletctedClosingTypeByFilter, setSelectedClosingTypeByFilter] = useState([]);
    const [builderListDropDown, setBuilderListDropDown] = useState([]);
    const [selectedBuilderNameByFilter, setSelectedBuilderNameByFilter] = useState([]);
    const [subdivisionListDropDown, setSubdivisionListDropDown] = useState([]);
    const [selectedSubdivisionNameByFilter, setSelectedSubdivisionNameByFilter] = useState([]);
    const [lenderList, setLenderList] = useState([]);
    const [seletctedLenderByFilter, setSelectedLenderByFilter] = useState([]);
    const [productTypeStatusByFilter, setProductTypeStatusByFilter] = useState([]);
    const [selectedAreaByFilter, setSelectedAreaByFilter] = useState([]);
    const [selectedMasterPlanByFilter, setSelectedMasterPlanByFilter] = useState([]);
    const [selectedAgeByFilter, setSelectedAgeByFilter] = useState([]);
    const [selectedSingleByFilter, setSelectedSingleByFilter] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState(false);
    const handlePopupClose = () => setShowPopup(false);
    const [filterQuery, setFilterQuery] = useState({
        from: localStorage.getItem("from_Closing") ? JSON.parse(localStorage.getItem("from_Closing")) : "",
        to: localStorage.getItem("to_Closing") ? JSON.parse(localStorage.getItem("to_Closing")) : "",
        closing_type: localStorage.getItem("closing_type_Closing") ? JSON.parse(localStorage.getItem("closing_type_Closing")) : "",
        document: localStorage.getItem("document_Closing") ? JSON.parse(localStorage.getItem("document_Closing")) : "",
        builder_name: localStorage.getItem("builder_name_Closing") ? JSON.parse(localStorage.getItem("builder_name_Closing")) : "",
        subdivision_name: localStorage.getItem("subdivision_name_Closing") ? JSON.parse(localStorage.getItem("subdivision_name_Closing")) : "",
        closingprice: localStorage.getItem("closingprice_Closing") ? JSON.parse(localStorage.getItem("closingprice_Closing")) : "",
        address: localStorage.getItem("address_Closing") ? JSON.parse(localStorage.getItem("address_Closing")) : "",
        parcel: localStorage.getItem("parcel_Closing") ? JSON.parse(localStorage.getItem("parcel_Closing")) : "",
        sellerleagal: localStorage.getItem("sellerleagal_Closing") ? JSON.parse(localStorage.getItem("sellerleagal_Closing")) : "",
        buyer: localStorage.getItem("buyer_Closing") ? JSON.parse(localStorage.getItem("buyer_Closing")) : "",
        lender_name: localStorage.getItem("lender_name_Closing") ? JSON.parse(localStorage.getItem("lender_name_Closing")) : "",
        loanamount: localStorage.getItem("loanamount_Closing") ? JSON.parse(localStorage.getItem("loanamount_Closing")) : "",
        product_type: localStorage.getItem("product_type_Closing") ? JSON.parse(localStorage.getItem("product_type_Closing")) : "",
        area: localStorage.getItem("area_Closing") ? JSON.parse(localStorage.getItem("area_Closing")) : "",
        masterplan_id: localStorage.getItem("masterplan_id_Closing") ? JSON.parse(localStorage.getItem("masterplan_id_Closing")) : "",
        zipcode: localStorage.getItem("zipcode_Closing") ? JSON.parse(localStorage.getItem("zipcode_Closing")) : "",
        lotwidth: localStorage.getItem("lotwidth_Closing") ? JSON.parse(localStorage.getItem("lotwidth_Closing")) : "",
        lotsize: localStorage.getItem("lotsize_Closing") ? JSON.parse(localStorage.getItem("lotsize_Closing")) : "",
        age: localStorage.getItem("age_Closing") ? JSON.parse(localStorage.getItem("age_Closing")) : "",
        single: localStorage.getItem("single_Closing") ? JSON.parse(localStorage.getItem("single_Closing")) : "",
    });

    useEffect(() => {
        if(localStorage.getItem("seletctedClosingTypeByFilter_Closing")) {
            const seletctedClosingType = JSON.parse(localStorage.getItem("seletctedClosingTypeByFilter_Closing"));
            handleSelectClosingTypeChange(seletctedClosingType);
        }
        if(localStorage.getItem("selectedBuilderNameByFilter_Closing")) {
            const selectedBuilderName = JSON.parse(localStorage.getItem("selectedBuilderNameByFilter_Closing"));
            handleSelectBuilderNameChange(selectedBuilderName);
        }
        if(localStorage.getItem("selectedSubdivisionNameByFilter_Closing")) {
          const selectedSubdivisionName = JSON.parse(localStorage.getItem("selectedSubdivisionNameByFilter_Closing"));
          handleSelectSubdivisionNameChange(selectedSubdivisionName);
        }
        if(localStorage.getItem("seletctedLenderByFilter_Closing")) {
            const seletctedLender = JSON.parse(localStorage.getItem("seletctedLenderByFilter_Closing"));
            handleSelectLenderChange(seletctedLender);
        }
        if(localStorage.getItem("productTypeStatusByFilter_Closing")) {
            const productTypeStatus = JSON.parse(localStorage.getItem("productTypeStatusByFilter_Closing"));
            handleSelectProductTypeChange(productTypeStatus);
        }
        if(localStorage.getItem("selectedAreaByFilter_Closing")) {
            const selectedArea = JSON.parse(localStorage.getItem("selectedAreaByFilter_Closing"));
            handleSelectAreaChange(selectedArea);
        }
        if(localStorage.getItem("selectedMasterPlanByFilter_Closing")) {
            const selectedMasterPlan = JSON.parse(localStorage.getItem("selectedMasterPlanByFilter_Closing"));
            handleSelectMasterPlanChange(selectedMasterPlan);
        }
        if(localStorage.getItem("selectedAgeByFilter_Closing")) {
            const selectedAge = JSON.parse(localStorage.getItem("selectedAgeByFilter_Closing"));
            handleSelectAgeChange(selectedAge);
        }
        if(localStorage.getItem("selectedSingleByFilter_Closing")) {
            const selectedSingle = JSON.parse(localStorage.getItem("selectedSingleByFilter_Closing"));
            handleSelectSingleChange(selectedSingle);
        }
    }, []);

    useEffect(() => {
        if (localStorage.getItem("usertoken")) {
            GetBuilderDropDownList();
            GetSubdivisionDropDownList();
            GetLenderList();
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

    const GetLenderList = async () => {
        try {
            let response = await AdminClosingService.lender()
            let responseData = await response.json()
            const formattedData = responseData.map((lender) => ({
                label: lender.lender,
                value: lender.lender,
            }));
            setLenderList(formattedData)
        } catch (error) {
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();
                console.log(errorJson.message);
            }
        }
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
                console.log(errorJson);
            }
        }
    };

    const GetSubdivisionDropDownList = async () => {
        try {
            const response = await AdminSubdevisionService.subdivisionDropDown();
            const responseData = await response.json();
            const formattedData = responseData.data.map((subdivision) => ({
                label: subdivision.name,
                value: subdivision.id,
            }));
            setSubdivisionListDropDown(formattedData);
        } catch (error) {
            console.log("Error fetching subdivision list:", error);
            if (error.name === "HTTPError") {
                const errorJson = await error.response.json();
                console.log(errorJson);
            }
        }
    };

    const HandlePopupDetailClick = (e) => {
        setShowPopup(true);
    };

    useEffect(() => {
        if (filterQuery.from == "" || filterQuery.to == "") {
            if(localStorage.getItem("setClosingFilter") == "true") {
                setShowPopup(true);
                setMessage("Please select date.");
                localStorage.removeItem("setClosingFilter");
                return;
            }
        } else {
            if(localStorage.getItem("setClosingFilter") == "true") {
                if((searchQuery == "") || (searchQuery == "&closing_type=&from=&to=&document=&builder_name=&subdivision_name=&closingprice=&address=&parcel=&sellerleagal=&buyer=&lender_name=&loanamount=&product_type=&area=&masterplan_id=&zipcode=&lotwidth=&lotsize=&age=&single=")){
                    return;
                } else {
                    let startDate = moment(filterQuery.from);
                    let endDate = moment(filterQuery.to);
                    let days = endDate.diff(startDate, 'days', true);
                    let totaldays = Math.ceil(days) + 1;
                    if (totaldays < 367) {
                        navigate("/closingsalelist");
                        localStorage.setItem("seletctedClosingTypeByFilter_Closing", JSON.stringify(seletctedClosingTypeByFilter));
                        localStorage.setItem("selectedBuilderNameByFilter_Closing", JSON.stringify(selectedBuilderNameByFilter));
                        localStorage.setItem("selectedSubdivisionNameByFilter_Closing", JSON.stringify(selectedSubdivisionNameByFilter));
                        localStorage.setItem("seletctedLenderByFilter_Closing", JSON.stringify(seletctedLenderByFilter));
                        localStorage.setItem("productTypeStatusByFilter_Closing", JSON.stringify(productTypeStatusByFilter));
                        localStorage.setItem("selectedAreaByFilter_Closing", JSON.stringify(selectedAreaByFilter));
                        localStorage.setItem("selectedMasterPlanByFilter_Closing", JSON.stringify(selectedMasterPlanByFilter));
                        localStorage.setItem("selectedAgeByFilter_Closing", JSON.stringify(selectedAgeByFilter));
                        localStorage.setItem("selectedSingleByFilter_Closing", JSON.stringify(selectedSingleByFilter));
                        localStorage.setItem("from_Closing", JSON.stringify(filterQuery.from));
                        localStorage.setItem("to_Closing", JSON.stringify(filterQuery.to));
                        localStorage.setItem("closing_type_Closing", JSON.stringify(filterQuery.closing_type));
                        localStorage.setItem("document_Closing", JSON.stringify(filterQuery.document));
                        localStorage.setItem("builder_name_Closing", JSON.stringify(filterQuery.builder_name));
                        localStorage.setItem("subdivision_name_Closing", JSON.stringify(filterQuery.subdivision_name));
                        localStorage.setItem("closingprice_Closing", JSON.stringify(filterQuery.closingprice));
                        localStorage.setItem("address_Closing", JSON.stringify(filterQuery.address));
                        localStorage.setItem("parcel_Closing", JSON.stringify(filterQuery.parcel));
                        localStorage.setItem("sellerleagal_Closing", JSON.stringify(filterQuery.sellerleagal));
                        localStorage.setItem("buyer_Closing", JSON.stringify(filterQuery.buyer));
                        localStorage.setItem("lender_name_Closing", JSON.stringify(filterQuery.lender_name));
                        localStorage.setItem("loanamount_Closing", JSON.stringify(filterQuery.loanamount));
                        localStorage.setItem("product_type_Closing", JSON.stringify(filterQuery.product_type));
                        localStorage.setItem("area_Closing", JSON.stringify(filterQuery.area));
                        localStorage.setItem("masterplan_id_Closing", JSON.stringify(filterQuery.masterplan_id));
                        localStorage.setItem("zipcode_Closing", JSON.stringify(filterQuery.zipcode));
                        localStorage.setItem("lotwidth_Closing", JSON.stringify(filterQuery.lotwidth));
                        localStorage.setItem("lotsize_Closing", JSON.stringify(filterQuery.lotsize));
                        localStorage.setItem("age_Closing", JSON.stringify(filterQuery.age));
                        localStorage.setItem("single_Closing", JSON.stringify(filterQuery.single));
                        localStorage.setItem("searchQueryByClosingsFilter", JSON.stringify(searchQuery.replace(/^"",|,""$/g, '')));
                    } else {
                        setShowPopup(true);
                        setMessage("Please select date between 366 days.");
                        localStorage.removeItem("setClosingFilter");
                        return;
                    }
                }
            }
        }
    }, [searchQuery]);

    const HandleFilterForm = (e) => {
        if (filterQuery.from == "" || filterQuery.to == "") {
            setShowPopup(true);
            if(filterQuery.from == "" && filterQuery.to == "") {
                setMessage("Please select from and to date.");
            } else if (filterQuery.from == "") {
                setMessage("Please select from date.");
            } else if (filterQuery.to == "") {
                setMessage("Please select to date.");
            }
            return;
        } else {
            let startDate = moment(filterQuery.from);
            let endDate = moment(filterQuery.to);
            let days = endDate.diff(startDate, 'days', true);
            let totaldays = Math.ceil(days) + 1;
            if (totaldays < 367) {
                e.preventDefault();
                navigate("/closingsalelist");
                localStorage.setItem("seletctedClosingTypeByFilter_Closing", JSON.stringify(seletctedClosingTypeByFilter));
                localStorage.setItem("selectedBuilderNameByFilter_Closing", JSON.stringify(selectedBuilderNameByFilter));
                localStorage.setItem("selectedSubdivisionNameByFilter_Closing", JSON.stringify(selectedSubdivisionNameByFilter));
                localStorage.setItem("seletctedLenderByFilter_Closing", JSON.stringify(seletctedLenderByFilter));
                localStorage.setItem("productTypeStatusByFilter_Closing", JSON.stringify(productTypeStatusByFilter));
                localStorage.setItem("selectedAreaByFilter_Closing", JSON.stringify(selectedAreaByFilter));
                localStorage.setItem("selectedMasterPlanByFilter_Closing", JSON.stringify(selectedMasterPlanByFilter));
                localStorage.setItem("selectedAgeByFilter_Closing", JSON.stringify(selectedAgeByFilter));
                localStorage.setItem("selectedSingleByFilter_Closing", JSON.stringify(selectedSingleByFilter));
                localStorage.setItem("from_Closing", JSON.stringify(filterQuery.from));
                localStorage.setItem("to_Closing", JSON.stringify(filterQuery.to));
                localStorage.setItem("closing_type_Closing", JSON.stringify(filterQuery.closing_type));
                localStorage.setItem("document_Closing", JSON.stringify(filterQuery.document));
                localStorage.setItem("builder_name_Closing", JSON.stringify(filterQuery.builder_name));
                localStorage.setItem("subdivision_name_Closing", JSON.stringify(filterQuery.subdivision_name));
                localStorage.setItem("closingprice_Closing", JSON.stringify(filterQuery.closingprice));
                localStorage.setItem("address_Closing", JSON.stringify(filterQuery.address));
                localStorage.setItem("parcel_Closing", JSON.stringify(filterQuery.parcel));
                localStorage.setItem("sellerleagal_Closing", JSON.stringify(filterQuery.sellerleagal));
                localStorage.setItem("buyer_Closing", JSON.stringify(filterQuery.buyer));
                localStorage.setItem("lender_name_Closing", JSON.stringify(filterQuery.lender_name));
                localStorage.setItem("loanamount_Closing", JSON.stringify(filterQuery.loanamount));
                localStorage.setItem("product_type_Closing", JSON.stringify(filterQuery.product_type));
                localStorage.setItem("area_Closing", JSON.stringify(filterQuery.area));
                localStorage.setItem("masterplan_id_Closing", JSON.stringify(filterQuery.masterplan_id));
                localStorage.setItem("zipcode_Closing", JSON.stringify(filterQuery.zipcode));
                localStorage.setItem("lotwidth_Closing", JSON.stringify(filterQuery.lotwidth));
                localStorage.setItem("lotsize_Closing", JSON.stringify(filterQuery.lotsize));
                localStorage.setItem("age_Closing", JSON.stringify(filterQuery.age));
                localStorage.setItem("single_Closing", JSON.stringify(filterQuery.single));
                localStorage.setItem("searchQueryByClosingsFilter", JSON.stringify(searchQuery.replace(/^"",|,""$/g, '')));
                localStorage.setItem("setClosingFilter", true);
            } else {
                setShowPopup(true);
                setMessage("Please select date between 366 days.");
                return;
            }
        }
    };

    const handleSelectClosingTypeChange = (selectedItems) => {
        const selectedNames = selectedItems.map(item => item.label).join(', ');

        setSelectedClosingTypeByFilter(selectedItems);
        setFilterQuery(prevState => ({
            ...prevState,
            closing_type: selectedNames
        }));
    };

    const handleFilterDateFrom = (date) => {
        if (date) {
            const formattedDate = date.toLocaleDateString('en-US');
            console.log(formattedDate)

            setFilterQuery((prevFilterQuery) => ({
                ...prevFilterQuery,
                from: formattedDate,
            }));
        } else {
            setFilterQuery((prevFilterQuery) => ({
                ...prevFilterQuery,
                from: '',
            }));
        }
    };

    const handleFilterDateTo = (date) => {
        if (date) {
            const formattedDate = date.toLocaleDateString('en-US');
            console.log(formattedDate)

            setFilterQuery((prevFilterQuery) => ({
                ...prevFilterQuery,
                to: formattedDate,
            }));
        } else {
            setFilterQuery((prevFilterQuery) => ({
                ...prevFilterQuery,
                to: '',
            }));
        }
    };

    const parseDate = (dateString) => {
        const [month, day, year] = dateString.split('/');
        return new Date(year, month - 1, day);
    };

    const HandleFilter = (e) => {
        const { name, value } = e.target;
        setFilterQuery((prevFilterQuery) => ({
            ...prevFilterQuery,
            [name]: value,
        }));
    };

    const handleSelectBuilderNameChange = (selectedItems) => {
        const selectedNames = selectedItems.map(item => item.label).join(', ');

        setSelectedBuilderNameByFilter(selectedItems);
        setFilterQuery(prevState => ({
            ...prevState,
            builder_name: selectedNames
        }));
    };

    const handleSelectSubdivisionNameChange = (selectedItems) => {
        const selectedNames = selectedItems.map(item => item.label).join(', ');

        setSelectedSubdivisionNameByFilter(selectedItems);
        setFilterQuery(prevState => ({
            ...prevState,
            subdivision_name: selectedNames
        }));
    };

    const handleSelectLenderChange = (selectedItems) => {
        const selectedValues = selectedItems.map(item => item.value).join(', ');

        setSelectedLenderByFilter(selectedItems);
        setFilterQuery(prevState => ({
            ...prevState,
            lender: selectedValues
        }));
    };

    const handleSelectProductTypeChange = (selectedItems) => {
        const selectedNames = selectedItems.map(item => item.value).join(', ');

        setProductTypeStatusByFilter(selectedItems);
        setFilterQuery(prevState => ({
            ...prevState,
            product_type: selectedNames
        }));
    };

    const handleSelectAreaChange = (selectedItems) => {
        const selectedValues = selectedItems.map(item => item.value).join(', ');

        setSelectedAreaByFilter(selectedItems);
        setFilterQuery(prevState => ({
            ...prevState,
            area: selectedValues
        }));
    };

    const handleSelectMasterPlanChange = (selectedItems) => {
        const selectedValues = selectedItems.map(item => item.value).join(', ');

        setSelectedMasterPlanByFilter(selectedItems);
        setFilterQuery(prevState => ({
            ...prevState,
            masterplan_id: selectedValues
        }));
    };

    const handleSelectAgeChange = (selectedItems) => {
        const selectedNames = selectedItems.map(item => item.value).join(', ');

        setSelectedAgeByFilter(selectedItems);
        setFilterQuery(prevState => ({
            ...prevState,
            age: selectedNames
        }));
    };

    const handleSelectSingleChange = (selectedItems) => {
        const selectedNames = selectedItems.map(item => item.value).join(', ');

        setSelectedSingleByFilter(selectedItems);
        setFilterQuery(prevState => ({
            ...prevState,
            single: selectedNames
        }));
    };

    const closingType = [
        { value: "NEW", label: "NEW" },
        { value: "RESALES", label: "RESALES" },
    ];

    const productTypeOptions = [
        { value: "DET", label: "DET" },
        { value: "ATT", label: "ATT" },
        { value: "HR", label: "HR" },
        { value: "AC", label: "AC" }
    ];

    const areaOption = [
        { value: "BC", label: "BC" },
        { value: "E", label: "E" },
        { value: "H", label: "H" },
        { value: "IS", label: "IS" },
        { value: "L", label: "DET" },
        { value: "MSQ", label: "MSQ" },
        { value: "MV", label: "MV" },
        { value: "NLV", label: "NLV" },
        { value: "NW", label: "NW" },
        { value: "P", label: "P" },
        { value: "SO", label: "SO" },
        { value: "SW", label: "SW" }
    ];

    const masterPlanOption = [
        { value: "ALIANTE", label: "ALIANTE" },
        { value: "ANTHEM", label: "ANTHEM" },
        { value: "ARLINGTON RANCH", label: "ARLINGTON RANCH" },
        { value: "ASCAYA", label: "ASCAYA" },
        { value: "BUFFALO RANCH", label: "BUFFALO RANCH" },
        { value: "CANYON CREST", label: "CANYON CREST" },
        { value: "CANYON GATE", label: "CANYON GATE" },
        { value: "CORONADO RANCH", label: "CORONADO RANCH" },
        { value: "ELDORADO", label: "ELDORADO" },
        { value: "GREEN VALLEY", label: "GREEN VALLEY" },
        { value: "HIGHLANDS RANCH", label: "HIGHLANDS RANCH" },
        { value: "INSPIRADA", label: "INSPIRADA" },
        { value: "LAKE LAS VEGAS", label: "LAKE LAS VEGAS" },
        { value: "THE LAKES", label: "THE LAKES" },
        { value: "LAS VEGAS COUNTRY CLUB", label: "LAS VEGAS COUNTRY CLUB" },
        { value: "LONE MOUNTAIN", label: "LONE MOUNTAIN" },
        { value: "MACDONALD RANCH", label: "MACDONALD RANCH" },
        { value: "MOUNTAINS EDGE", label: "MOUNTAINS EDGE" },
        { value: "MOUNTAIN FALLS", label: "MOUNTAIN FALLS" },
        { value: "NEVADA RANCH", label: "NEVADA RANCH" },
        { value: "NEVADA TRAILS", label: "NEVADA TRAILS" },
        { value: "PROVIDENCE", label: "PROVIDENCE" },
        { value: "QUEENSRIDGE", label: "QUEENSRIDGE" },
        { value: "RED ROCK CC", label: "RED ROCK CC" },
        { value: "RHODES RANCH", label: "RHODES RANCH" },
        { value: "SEDONA RANCH", label: "SEDONA RANCH" },
        { value: "SEVEN HILLS", label: "SEVEN HILLS" },
        { value: "SILVERADO RANCH", label: "SILVERADO RANCH" },
        { value: "SILVERSTONE RANCH", label: "SILVERSTONE RANCH" },
        { value: "SKYE CANYON", label: "SKYE CANYON" },
        { value: "SKYE HILLS", label: "SKYE HILLS" },
        { value: "SPANISH TRAIL", label: "SPANISH TRAIL" },
        { value: "SOUTHERN HIGHLANDS", label: "SOUTHERN HIGHLANDS" },
        { value: "SUMMERLIN", label: "SUMMERLIN" },
        { value: "SUNRISE HIGH", label: "SUNRISE HIGH" },
        { value: "SUNSTONE", label: "SUNSTONE" },
        { value: "TUSCANY", label: "TUSCANY" },
        { value: "VALLEY VISTA", label: "VALLEY VISTA" },
        { value: "VILLAGES AT TULE SPRING", label: "VILLAGES AT TULE SPRING" },
        { value: "VISTA VERDE", label: "VISTA VERDE" },
        { value: "WESTON HILLS", label: "WESTON HILLS" },
    ];

    const ageOptions = [
        { value: "1", label: "Yes" },
        { value: "0", label: "No" }
    ];

    const singleOptions = [
        { value: "1", label: "Yes" },
        { value: "0", label: "No" }
    ];

    const HandleCancelFilter = () => {
        setFilterQuery({
            closing_type: "",
            from: "",
            to: "",
            document: "",
            builder_name: "",
            subdivision_name: "",
            closingprice: "",
            address: "",
            parcel: "",
            sellerleagal: "",
            buyer: "",
            lender_name: "",
            loanamount: "",
            product_type: "",
            area: "",
            masterplan_id: "",
            zipcode: "",
            lotwidth: "",
            lotsize: "",
            age: "",
            single: ""
        });
        setSelectedClosingTypeByFilter([]);
        setSelectedBuilderNameByFilter([]);
        setSelectedSubdivisionNameByFilter([]);
        setSelectedLenderByFilter([]);
        setProductTypeStatusByFilter([]);
        setSelectedAreaByFilter([]);
        setSelectedMasterPlanByFilter([]);
        setSelectedAgeByFilter([]);
        setSelectedSingleByFilter([]);
    };

    return (
        <Fragment>
            <div className="container mt-5">
                <h2>Filter Closings</h2>
                <form onSubmit={HandleFilterForm}>
                    <div className="row">
                        <div className="col-md-3 mt-3">
                            <label className="form-label">From:{" "}
                                <span className="text-danger">*</span>
                            </label>
                            <DatePicker
                                name="from"
                                className="form-control"
                                selected={filterQuery.from ? parseDate(filterQuery.from) : null}
                                onChange={handleFilterDateFrom}
                                dateFormat="MM/dd/yyyy"
                                placeholderText="mm/dd/yyyy"
                            />
                        </div>
                        <div className="col-md-3 mt-3">
                            <label className="form-label">To:{" "}
                                <span className="text-danger">*</span>
                            </label>
                            <DatePicker
                                name="to"
                                className="form-control"
                                selected={filterQuery.to ? parseDate(filterQuery.to) : null}
                                onChange={handleFilterDateTo}
                                dateFormat="MM/dd/yyyy"
                                placeholderText="mm/dd/yyyy"
                            />
                        </div>
                        <div className="col-md-3 mt-3">
                            <label className="form-label">CLOSING TYPE:{" "}</label>
                            <Form.Group controlId="tournamentList">
                                <MultiSelect
                                    name="closing_type"
                                    options={closingType}
                                    value={seletctedClosingTypeByFilter}
                                    onChange={handleSelectClosingTypeChange}
                                    placeholder={"Select Closing Type"}
                                />
                            </Form.Group>
                        </div>
                        <div className="col-md-3 mt-3">
                            <label className="form-label">DOC:{" "}</label>
                            <input name="document" value={filterQuery.document} className="form-control" onChange={HandleFilter} />
                        </div>
                        <div className="col-md-3 mt-3">
                            <label className="form-label">BUILDER NAME:{" "}</label>
                            <Form.Group controlId="tournamentList">
                                <MultiSelect
                                    name="builder_name"
                                    options={builderListDropDown}
                                    value={selectedBuilderNameByFilter}
                                    onChange={handleSelectBuilderNameChange}
                                    placeholder={"Select Builder Name"}
                                />
                            </Form.Group>
                        </div>
                        <div className="col-md-3 mt-3">
                            <label className="form-label">SUBDIVISION NAME:{" "}</label>
                            <Form.Group controlId="tournamentList">
                                <MultiSelect
                                    name="subdivision_name"
                                    options={subdivisionListDropDown}
                                    value={selectedSubdivisionNameByFilter}
                                    onChange={handleSelectSubdivisionNameChange}
                                    placeholder={"Select Subdivision Name"}
                                />
                            </Form.Group>
                        </div>
                        <div className="col-md-3 mt-3">
                            <label className="form-label">CLOSING PRICE:{" "}</label>
                            <input name="closingprice" value={filterQuery.closingprice} className="form-control" onChange={HandleFilter} />
                        </div>
                        <div className="col-md-3 mt-3">
                            <label className="form-label">ADDRESS:{" "}</label>
                            <input name="address" value={filterQuery.address} className="form-control" onChange={HandleFilter} />
                        </div>
                        <div className="col-md-3 mt-3">
                            <label className="form-label">PARCEL NUMBER:{" "}</label>
                            <input value={filterQuery.parcel} name="parcel" className="form-control" onChange={HandleFilter} />
                        </div>
                        <div className="col-md-3 mt-3">
                            <label className="form-label">SELLER LEGAL NAME:{" "}</label>
                            <input value={filterQuery.sellerleagal} name="sellerleagal" className="form-control" onChange={HandleFilter} />
                        </div>
                        <div className="col-md-3 mt-3">
                            <label className="form-label">BUYER NAME:{" "}</label>
                            <input value={filterQuery.buyer} name="buyer" className="form-control" onChange={HandleFilter} />
                        </div>
                        <div className="col-md-3 mt-3">
                            <label className="form-label">LENDER:{" "}</label>
                            <Form.Group controlId="tournamentList">
                                <MultiSelect
                                    name="lender_name"
                                    options={lenderList}
                                    value={seletctedLenderByFilter}
                                    onChange={handleSelectLenderChange}
                                    placeholder={"Select Lender"}
                                />
                            </Form.Group>
                        </div>
                        <div className="col-md-3 mt-3">
                            <label className="form-label">LOAN AMOUNT:{" "}</label>
                            <input value={filterQuery.loanamount} name="loanamount" className="form-control" onChange={HandleFilter} />
                        </div>
                        <div className="col-md-3 mt-3 mb-3">
                            <label className="form-label">PRODUCT TYPE:{" "}</label>
                            <MultiSelect
                                name="product_type"
                                options={productTypeOptions}
                                value={productTypeStatusByFilter}
                                onChange={handleSelectProductTypeChange}
                                placeholder="Select Prodcut Type"
                            />
                        </div>
                        <div className="col-md-3 mt-3 mb-3">
                            <label className="form-label">AREA:{" "}</label>
                            <MultiSelect
                                name="area"
                                options={areaOption}
                                value={selectedAreaByFilter}
                                onChange={handleSelectAreaChange}
                                placeholder="Select Area"
                            />
                        </div>
                        <div className="col-md-3 mt-3 mb-3">
                            <label className="form-label">MASTERPLAN:{" "}</label>
                            <MultiSelect
                                name="masterplan_id"
                                options={masterPlanOption}
                                value={selectedMasterPlanByFilter}
                                onChange={handleSelectMasterPlanChange}
                                placeholder="Select Area"
                            />
                        </div>
                        <div className="col-md-3 mt-3 mb-3">
                            <label className="form-label">ZIP CODE:{" "}</label>
                            <input 
                                type="text" 
                                name="zipcode" 
                                value={filterQuery.zipcode} 
                                className="form-control" 
                                onChange={HandleFilter} 
                                pattern="[0-9, ]*"
                                onInput={(e) => {
                                    e.target.value = e.target.value.replace(/[^0-9, ]/g, '');
                                }}
                            />
                        </div>
                        <div className="col-md-3 mt-3">
                            <label className="form-label">LOT WIDTH:{" "}</label>
                            <input value={filterQuery.lotwidth} name="lotwidth" className="form-control" onChange={HandleFilter} />
                        </div>
                        <div className="col-md-3 mt-3">
                            <label className="form-label">LOT SIZE:{" "}</label>
                            <input value={filterQuery.lotsize} name="lotsize" className="form-control" onChange={HandleFilter} />
                        </div>
                        <div className="col-md-3 mt-3">
                            <label className="form-label">AGE RESTRICTED:{" "}</label>
                            <MultiSelect
                                name="age"
                                options={ageOptions}
                                value={selectedAgeByFilter}
                                onChange={handleSelectAgeChange}
                                placeholder={"Select Age"}
                            />
                        </div>
                        <div className="col-md-3 mt-3">
                            <label className="form-label">ALL SINGLE STORY:{" "}</label>
                            <MultiSelect
                                name="single"
                                options={singleOptions}
                                value={selectedSingleByFilter}
                                onChange={handleSelectSingleChange}
                                placeholder={"Select Single"}
                            />
                        </div>
                    </div>
                    <br />
                    <div className="d-flex justify-content-between">
                        <Button
                            className="btn-sm"
                            onClick={HandleCancelFilter}
                            variant="secondary"
                        >
                            Reset
                        </Button>
                        <Button
                            className="btn-sm"
                            onClick={HandleFilterForm}
                            variant="primary"
                        >
                            Filter
                        </Button>
                    </div>
                </form>
            </div>

            {/* Popup */}
            <Modal show={showPopup} onHide={HandlePopupDetailClick}>
                <Modal.Header handlePopupClose>
                    <Modal.Title>Alert</Modal.Title>
                    <button
                        className="btn-close"
                        aria-label="Close"
                        onClick={() => handlePopupClose()}
                    ></button>
                </Modal.Header>
                <Modal.Body>
                    {message}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handlePopupClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    );
};

export default FilterClosings;
