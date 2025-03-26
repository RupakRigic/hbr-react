import React, { Fragment, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { MultiSelect } from 'react-multi-select-component';
import DatePicker from "react-datepicker";
import { Form } from "react-bootstrap";
import { Button } from 'react-bootstrap';
import AdminBuilderService from '../../../API/Services/AdminService/AdminBuilderService';
import AdminSubdevisionService from '../../../API/Services/AdminService/AdminSubdevisionService';
import moment from 'moment';
import Modal from "react-bootstrap/Modal";

const FilterBasePrice = () => {
    const navigate = useNavigate();
    const [builderListDropDown, setBuilderListDropDown] = useState([]);
    const [subdivisionListDropDown, setSubdivisionListDropDown] = useState([]);
    const [selectedBuilderNameByFilter, setSelectedBuilderNameByFilter] = useState([]);
    const [selectedSubdivisionNameByFilter, setSelectedSubdivisionNameByFilter] = useState([]);
    const [selectedBuilderIDByFilter, setSelectedBuilderIDByFilter] = useState([]);
    const [productTypeStatusByFilter, setProductTypeStatusByFilter] = useState([]);
    const [selectedAreaByFilter, setSelectedAreaByFilter] = useState([]);
    const [selectedMasterPlanByFilter, setSelectedMasterPlanByFilter] = useState([]);
    const [selectedAgeByFilter, setSelectedAgeByFilter] = useState([]);
    const [selectedSingleByFilter, setSelectedSingleByFilter] = useState([]);
    const [selectedSubdivisionStatusByFilter, setSelectedSubdivisionStatusByFilter] = useState([]);
    const [selectedProductStatusByFilter, setSelectedProductStatusByFilter] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState(false);
    const handlePopupClose = () => setShowPopup(false);
    const [filterQuery, setFilterQuery] = useState({
        from: localStorage.getItem("from_BasePrice") ? JSON.parse(localStorage.getItem("from_BasePrice")) : "",
        to: localStorage.getItem("to_BasePrice") ? JSON.parse(localStorage.getItem("to_BasePrice")) : "",
        builder_name: localStorage.getItem("builder_name_BasePrice") ? JSON.parse(localStorage.getItem("builder_name_BasePrice")) : "",
        subdivision_name: localStorage.getItem("subdivision_name_BasePrice") ? JSON.parse(localStorage.getItem("subdivision_name_BasePrice")) : "",
        name: localStorage.getItem("product_name_BasePrice") ? JSON.parse(localStorage.getItem("product_name_BasePrice")) : "",
        sqft: localStorage.getItem("sqft_BasePrice") ? JSON.parse(localStorage.getItem("sqft_BasePrice")) : "",
        stories: localStorage.getItem("stories_BasePrice") ? JSON.parse(localStorage.getItem("stories_BasePrice")) : "",
        bedroom: localStorage.getItem("bedroom_BasePrice") ? JSON.parse(localStorage.getItem("bedroom_BasePrice")) : "",
        bathroom: localStorage.getItem("bathroom_BasePrice") ? JSON.parse(localStorage.getItem("bathroom_BasePrice")) : "",
        garage: localStorage.getItem("garage_BasePrice") ? JSON.parse(localStorage.getItem("garage_BasePrice")) : "",
        baseprice: localStorage.getItem("baseprice_BasePrice") ? JSON.parse(localStorage.getItem("baseprice_BasePrice")) : "",
        product_type: localStorage.getItem("product_type_BasePrice") ? JSON.parse(localStorage.getItem("product_type_BasePrice")) : "",
        area: localStorage.getItem("area_BasePrice") ? JSON.parse(localStorage.getItem("area_BasePrice")) : "",
        masterplan_id: localStorage.getItem("masterplan_id_BasePrice") ? JSON.parse(localStorage.getItem("masterplan_id_BasePrice")) : "",
        zipcode: localStorage.getItem("zipcode_BasePrice") ? JSON.parse(localStorage.getItem("zipcode_BasePrice")) : "",
        lotwidth: localStorage.getItem("lotwidth_BasePrice") ? JSON.parse(localStorage.getItem("lotwidth_BasePrice")) : "",
        lotsize: localStorage.getItem("lotsize_BasePrice") ? JSON.parse(localStorage.getItem("lotsize_BasePrice")) : "",
        age: localStorage.getItem("age_BasePrice") ? JSON.parse(localStorage.getItem("age_BasePrice")) : "",
        single: localStorage.getItem("single_BasePrice") ? JSON.parse(localStorage.getItem("single_BasePrice")) : "",
        product_status: localStorage.getItem("product_status_BasePrice") ? JSON.parse(localStorage.getItem("product_status_BasePrice")) : "",
        subdivision_status: localStorage.getItem("subdivision_status_BasePrice") ? JSON.parse(localStorage.getItem("subdivision_status_BasePrice")) : "",
    });

    useEffect(() => {
        if(localStorage.getItem("selectedBuilderNameByFilter_BasePrice")) {
            const selectedBuilderName = JSON.parse(localStorage.getItem("selectedBuilderNameByFilter_BasePrice"));
            handleSelectBuilderNameChange(selectedBuilderName);
        }
        if(localStorage.getItem("selectedSubdivisionNameByFilter_BasePrice")) {
          const selectedSubdivisionName = JSON.parse(localStorage.getItem("selectedSubdivisionNameByFilter_BasePrice"));
          handleSelectSubdivisionNameChange(selectedSubdivisionName);
        }
        if(localStorage.getItem("productTypeStatusByFilter_BasePrice")) {
          const productTypeStatus = JSON.parse(localStorage.getItem("productTypeStatusByFilter_BasePrice"));
          handleSelectProductTypeChange(productTypeStatus);
        }
        if(localStorage.getItem("selectedAreaByFilter_BasePrice")) {
            const selectedArea = JSON.parse(localStorage.getItem("selectedAreaByFilter_BasePrice"));
            handleSelectAreaChange(selectedArea);
        }
        if(localStorage.getItem("selectedMasterPlanByFilter_BasePrice")) {
            const selectedMasterPlan = JSON.parse(localStorage.getItem("selectedMasterPlanByFilter_BasePrice"));
            handleSelectMasterPlanChange(selectedMasterPlan);
        }
        if(localStorage.getItem("selectedAgeByFilter_BasePrice")) {
            const selectedAge = JSON.parse(localStorage.getItem("selectedAgeByFilter_BasePrice"));
            handleSelectAgeChange(selectedAge);
        }
        if(localStorage.getItem("selectedSingleByFilter_BasePrice")) {
            const selectedSingle = JSON.parse(localStorage.getItem("selectedSingleByFilter_BasePrice"));
            handleSelectSingleChange(selectedSingle);
        }
        if(localStorage.getItem("selectedStatusByProductFilter_BasePrice")) {
            const selectedStatusByProduct = JSON.parse(localStorage.getItem("selectedStatusByProductFilter_BasePrice"));
            handleSelectProductStatusChange(selectedStatusByProduct);
        }
        if(localStorage.getItem("selectedStatusBySubdivisionFilter_BasePrice")) {
            const selectedStatusBySubdivision = JSON.parse(localStorage.getItem("selectedStatusBySubdivisionFilter_BasePrice"));
            handleSelectSubdivisionStatusChange(selectedStatusBySubdivision);
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
        if (selectedBuilderIDByFilter?.length > 0) {
            SubdivisionByBuilderIDList(selectedBuilderIDByFilter);
        } else {
            setSelectedSubdivisionNameByFilter([]);
            setSubdivisionListDropDown([]);
        }
    }, [selectedBuilderIDByFilter]);

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
            const validSubdivisionIds = formattedData.map(item => item.value);
            setSelectedSubdivisionNameByFilter(prevSelected => prevSelected.filter(selected => validSubdivisionIds.includes(selected.value)));
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
            if(localStorage.getItem("setBasePriceFilter") == "true") {
                setShowPopup(true);
                setMessage("Please select date.");
                localStorage.removeItem("setBasePriceFilter");
                return;
            }
        } else {
            if(localStorage.getItem("setBasePriceFilter") == "true") {
                if((searchQuery == "") || (searchQuery == "&from=&to=&builder_name=&subdivision_name=&name=&sqft=&stories=&bedroom=&bathroom=&garage=&baseprice=&product_type=&area=&masterplan_id=&zipcode=&lotwidth=&lotsize=&age=&single=&product_status=&subdivision_status=")){
                    return;
                } else {
                    let startDate = moment(filterQuery.from);
                    let endDate = moment(filterQuery.to);
                    let days = endDate.diff(startDate, 'days', true);
                    let totaldays = Math.ceil(days) + 1;
                    if (totaldays < 184) {
                        navigate("/priceList");
                        localStorage.setItem("selectedBuilderNameByFilter_BasePrice", JSON.stringify(selectedBuilderNameByFilter));
                        localStorage.setItem("selectedSubdivisionNameByFilter_BasePrice", JSON.stringify(selectedSubdivisionNameByFilter));
                        localStorage.setItem("productTypeStatusByFilter_BasePrice", JSON.stringify(productTypeStatusByFilter));
                        localStorage.setItem("selectedAreaByFilter_BasePrice", JSON.stringify(selectedAreaByFilter));
                        localStorage.setItem("selectedMasterPlanByFilter_BasePrice", JSON.stringify(selectedMasterPlanByFilter));
                        localStorage.setItem("selectedAgeByFilter_BasePrice", JSON.stringify(selectedAgeByFilter));
                        localStorage.setItem("selectedSingleByFilter_BasePrice", JSON.stringify(selectedSingleByFilter));
                        localStorage.setItem("selectedStatusBySubdivisionFilter_BasePrice", JSON.stringify(selectedSubdivisionStatusByFilter));
                        localStorage.setItem("selectedStatusByProductFilter_BasePrice", JSON.stringify(selectedProductStatusByFilter));
                        localStorage.setItem("from_BasePrice", JSON.stringify(filterQuery.from));
                        localStorage.setItem("to_BasePrice", JSON.stringify(filterQuery.to));
                        localStorage.setItem("builder_name_BasePrice", JSON.stringify(filterQuery.builder_name));
                        localStorage.setItem("subdivision_name_BasePrice", JSON.stringify(filterQuery.subdivision_name));
                        localStorage.setItem("product_name_BasePrice", JSON.stringify(filterQuery.name));
                        localStorage.setItem("sqft_BasePrice", JSON.stringify(filterQuery.sqft));
                        localStorage.setItem("stories_BasePrice", JSON.stringify(filterQuery.stories));
                        localStorage.setItem("bedroom_BasePrice", JSON.stringify(filterQuery.bedroom));
                        localStorage.setItem("bathroom_BasePrice", JSON.stringify(filterQuery.bathroom));
                        localStorage.setItem("garage_BasePrice", JSON.stringify(filterQuery.garage));
                        localStorage.setItem("baseprice_BasePrice", JSON.stringify(filterQuery.baseprice));
                        localStorage.setItem("product_type_BasePrice", JSON.stringify(filterQuery.product_type));
                        localStorage.setItem("area_BasePrice", JSON.stringify(filterQuery.area));
                        localStorage.setItem("masterplan_id_BasePrice", JSON.stringify(filterQuery.masterplan_id));
                        localStorage.setItem("zipcode_BasePrice", JSON.stringify(filterQuery.zipcode));
                        localStorage.setItem("lotwidth_BasePrice", JSON.stringify(filterQuery.lotwidth));
                        localStorage.setItem("lotsize_BasePrice", JSON.stringify(filterQuery.lotsize));
                        localStorage.setItem("age_BasePrice", JSON.stringify(filterQuery.age));
                        localStorage.setItem("single_BasePrice", JSON.stringify(filterQuery.single));
                        localStorage.setItem("product_status_BasePrice", JSON.stringify(filterQuery.product_status));
                        localStorage.setItem("subdivision_status_BasePrice", JSON.stringify(filterQuery.subdivision_status));
                        localStorage.setItem("searchQueryByBasePricesFilter", JSON.stringify(searchQuery.replace(/^"",|,""$/g, '')));
                    } else {
                        setShowPopup(true);
                        setMessage("Please select date between 183 days.");
                        localStorage.removeItem("setBasePriceFilter");
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
            if (totaldays < 184) {
                e.preventDefault();
                navigate("/priceList");
                localStorage.setItem("selectedBuilderNameByFilter_BasePrice", JSON.stringify(selectedBuilderNameByFilter));
                localStorage.setItem("selectedSubdivisionNameByFilter_BasePrice", JSON.stringify(selectedSubdivisionNameByFilter));
                localStorage.setItem("productTypeStatusByFilter_BasePrice", JSON.stringify(productTypeStatusByFilter));
                localStorage.setItem("selectedAreaByFilter_BasePrice", JSON.stringify(selectedAreaByFilter));
                localStorage.setItem("selectedMasterPlanByFilter_BasePrice", JSON.stringify(selectedMasterPlanByFilter));
                localStorage.setItem("selectedAgeByFilter_BasePrice", JSON.stringify(selectedAgeByFilter));
                localStorage.setItem("selectedSingleByFilter_BasePrice", JSON.stringify(selectedSingleByFilter));
                localStorage.setItem("selectedStatusBySubdivisionFilter_BasePrice", JSON.stringify(selectedSubdivisionStatusByFilter));
                localStorage.setItem("selectedStatusByProductFilter_BasePrice", JSON.stringify(selectedProductStatusByFilter));
                localStorage.setItem("from_BasePrice", JSON.stringify(filterQuery.from));
                localStorage.setItem("to_BasePrice", JSON.stringify(filterQuery.to));
                localStorage.setItem("builder_name_BasePrice", JSON.stringify(filterQuery.builder_name));
                localStorage.setItem("subdivision_name_BasePrice", JSON.stringify(filterQuery.subdivision_name));
                localStorage.setItem("product_name_BasePrice", JSON.stringify(filterQuery.name));
                localStorage.setItem("sqft_BasePrice", JSON.stringify(filterQuery.sqft));
                localStorage.setItem("stories_BasePrice", JSON.stringify(filterQuery.stories));
                localStorage.setItem("bedroom_BasePrice", JSON.stringify(filterQuery.bedroom));
                localStorage.setItem("bathroom_BasePrice", JSON.stringify(filterQuery.bathroom));
                localStorage.setItem("garage_BasePrice", JSON.stringify(filterQuery.garage));
                localStorage.setItem("baseprice_BasePrice", JSON.stringify(filterQuery.baseprice));
                localStorage.setItem("product_type_BasePrice", JSON.stringify(filterQuery.product_type));
                localStorage.setItem("area_BasePrice", JSON.stringify(filterQuery.area));
                localStorage.setItem("masterplan_id_BasePrice", JSON.stringify(filterQuery.masterplan_id));
                localStorage.setItem("zipcode_BasePrice", JSON.stringify(filterQuery.zipcode));
                localStorage.setItem("lotwidth_BasePrice", JSON.stringify(filterQuery.lotwidth));
                localStorage.setItem("lotsize_BasePrice", JSON.stringify(filterQuery.lotsize));
                localStorage.setItem("age_BasePrice", JSON.stringify(filterQuery.age));
                localStorage.setItem("single_BasePrice", JSON.stringify(filterQuery.single));
                localStorage.setItem("product_status_BasePrice", JSON.stringify(filterQuery.product_status));
                localStorage.setItem("subdivision_status_BasePrice", JSON.stringify(filterQuery.subdivision_status));
                localStorage.setItem("searchQueryByBasePricesFilter", JSON.stringify(searchQuery.replace(/^"",|,""$/g, '')));
                localStorage.setItem("setBasePriceFilter", true);
            } else {
                setShowPopup(true);
                setMessage("Please select date between 183 days.");
                return;
            }
        }
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

    const handleSelectBuilderNameChange = (selectedItems) => {
        const selectedNames = selectedItems.map(item => item.label).join(', ');
        const selectedValues = selectedItems.map(item => item.value);
        setSelectedBuilderNameByFilter(selectedItems);
        setSelectedBuilderIDByFilter(selectedValues);
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

    const HandleFilter = (e) => {
        const { name, value } = e.target;
        setFilterQuery((prevFilterQuery) => ({
            ...prevFilterQuery,
            [name]: value,
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
        setSelectedAgeByFilter(selectedItems);
        const selectedNames = selectedItems.map(item => item.value).join(', ');
        setFilterQuery(prevState => ({
            ...prevState,
            age: selectedNames
        }));
    };

    const handleSelectSingleChange = (selectedItems) => {
        setSelectedSingleByFilter(selectedItems);
        const selectedNames = selectedItems.map(item => item.value).join(', ');
        setFilterQuery(prevState => ({
            ...prevState,
            single: selectedNames
        }));
    };

    const handleSelectProductStatusChange = (selectedItems) => {
        const selectedNames = selectedItems.map(item => item.value).join(', ');
        setSelectedProductStatusByFilter(selectedItems);
        setFilterQuery(prevState => ({
            ...prevState,
            product_status: selectedNames
        }));
    }

    const handleSelectSubdivisionStatusChange = (selectedItems) => {
        const selectedNames = selectedItems.map(item => item.value).join(', ');
        setSelectedSubdivisionStatusByFilter(selectedItems);
        setFilterQuery(prevState => ({
            ...prevState,
            subdivision_status: selectedNames
        }));
    };

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

    const productStatusOptions = [
        { value: "1", label: "Active" },
        { value: "0", label: "Sold Out" },
        { value: "2", label: "Future" },
        { value: "3", label: "Closed" }
    ];

    const subdivisionStatusOptions = [
        { value: "1", label: "Active" },
        { value: "0", label: "Sold Out" },
        { value: "2", label: "Future" }
    ];

    const HandleCancelFilter = (e) => {
        setFilterQuery({
            from: "",
            to: "",
            builder_name: "",
            subdivision_name: "",
            name: "",
            sqft: "",
            stories: "",
            bedroom: "",
            bathroom: "",
            garage: "",
            baseprice: "",
            product_type: "",
            area: "",
            masterplan_id: "",
            zipcode: "",
            lotwidth: "",
            lotsize: "",
            age: "",
            single: "",
            product_status: "",
            subdivision_status: ""
        });
        setSelectedBuilderNameByFilter([]);
        setSelectedSubdivisionNameByFilter([]);
        setProductTypeStatusByFilter([]);
        setSelectedAreaByFilter([]);
        setSelectedMasterPlanByFilter([]);
        setSelectedAgeByFilter([]);
        setSelectedSingleByFilter([]);
        setSelectedProductStatusByFilter([]);
        setSelectedSubdivisionStatusByFilter([]);
        setSelectedBuilderIDByFilter([]);
    };

    return (
        <Fragment>
            <div className="container mt-5">
                <h2>Filter Base Prices</h2>
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
                            <label className="form-label">PRODUCT NAME :{" "}</label>
                            <input value={filterQuery.name} name="name" className="form-control" onChange={HandleFilter} />
                        </div>
                        <div className="col-md-3 mt-3">
                            <label className="form-label">SQUARE FOOTAGE:{" "}</label>
                            <input name="sqft" value={filterQuery.sqft} className="form-control" onChange={HandleFilter} />
                        </div>
                        <div className="col-md-3 mt-3">
                            <label className="form-label">STORIES:{" "}</label>
                            <input name="stories" value={filterQuery.stories} className="form-control" onChange={HandleFilter} />
                        </div>
                        <div className="col-md-3 mt-3">
                            <label className="form-label">BEDROOMS:{" "}</label>
                            <input value={filterQuery.bedroom} name="bedroom" className="form-control" onChange={HandleFilter} />
                        </div>
                        <div className="col-md-3 mt-3">
                            <label className="form-label">BATH ROOMS:{" "}</label>
                            <input value={filterQuery.bathroom} name="bathroom" className="form-control" onChange={HandleFilter} />
                        </div>
                        <div className="col-md-3 mt-3">
                            <label className="form-label">GARAGE:{" "}</label>
                            <input type="text" name="garage" value={filterQuery.garage} className="form-control" onChange={HandleFilter} />
                        </div>
                        <div className="col-md-3 mt-3">
                            <label className="form-label">BASE PRICE:{" "}</label>
                            <input name="baseprice" value={filterQuery.baseprice} className="form-control" onChange={HandleFilter} />
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
                        <div className="col-md-3 mt-3 mb-3">
                            <label className="form-label">LOT WIDTH:{" "}</label>
                            <input value={filterQuery.lotwidth} name="lotwidth" className="form-control" onChange={HandleFilter} />
                        </div>
                        <div className="col-md-3 mt-3 mb-3">
                            <label className="form-label">LOT SIZE:{" "}</label>
                            <input value={filterQuery.lotsize} name="lotsize" className="form-control" onChange={HandleFilter} />
                        </div>
                        <div className="col-md-3 mt-3 mb-3">
                            <label htmlFor="exampleFormControlInput8" className="form-label">AGE RESTRICTED:{" "}</label>
                            <MultiSelect
                                name="age"
                                options={ageOptions}
                                value={selectedAgeByFilter}
                                onChange={handleSelectAgeChange}
                                placeholder={"Select Age"}
                            />
                        </div>
                        <div className="col-md-3 mt-3 mb-3">
                            <label htmlFor="exampleFormControlInput8" className="form-label">All SINGLE STORY:{" "}</label>
                            <MultiSelect
                                name="single"
                                options={singleOptions}
                                value={selectedSingleByFilter}
                                onChange={handleSelectSingleChange}
                                placeholder={"Select Single"}
                            />
                        </div>
                        <div className="col-md-3 mt-3">
                            <label className="form-label">PRODUCT STATUS:{" "}</label>
                            <MultiSelect
                                name="status"
                                options={productStatusOptions}
                                value={selectedProductStatusByFilter}
                                onChange={handleSelectProductStatusChange}
                                placeholder={"Select Product Status"}
                            />
                        </div>
                        <div className="col-md-3 mt-3">
                            <label className="form-label">SUBDIVISION STATUS:{" "}</label>
                            <MultiSelect
                                name="status"
                                options={subdivisionStatusOptions}
                                value={selectedSubdivisionStatusByFilter}
                                onChange={handleSelectSubdivisionStatusChange}
                                placeholder={"Select Subdivision Status"}
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

export default FilterBasePrice;
