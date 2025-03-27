import React, { Fragment, useEffect, useState } from 'react';
import AdminSubdevisionService from '../../../API/Services/AdminService/AdminSubdevisionService';
import AdminBuilderService from '../../../API/Services/AdminService/AdminBuilderService';
import { useNavigate } from 'react-router-dom';
import { MultiSelect } from 'react-multi-select-component';
import DatePicker from "react-datepicker";
import { Form } from "react-bootstrap";
import { Button } from 'react-bootstrap';
import moment from 'moment';
import Modal from "react-bootstrap/Modal";

const FilterWeeklyTrafficAndSales = () => {
    const navigate = useNavigate();
    const [builderListDropDown, setBuilderListDropDown] = useState([]);
    const [selectedBuilderNameByFilter, setSelectedBuilderNameByFilter] = useState([]);
    const [subdivisionListDropDown, setSubdivisionListDropDown] = useState([]);
    const [selectedSubdivisionNameByFilter, setSelectedSubdivisionNameByFilter] = useState([]);
    const [selectedBuilderIDByFilter, setSelectedBuilderIDByFilter] = useState([]);
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
        from: localStorage.getItem("from_TrafficSale") ? JSON.parse(localStorage.getItem("from_TrafficSale")) : "",
        to: localStorage.getItem("to_TrafficSale") ? JSON.parse(localStorage.getItem("to_TrafficSale")) : "",
        builder_name: localStorage.getItem("builder_name_TrafficSale") ? JSON.parse(localStorage.getItem("builder_name_TrafficSale")) : "",
        subdivision_name: localStorage.getItem("subdivision_name_TrafficSale") ? JSON.parse(localStorage.getItem("subdivision_name_TrafficSale")) : "",
        weeklytraffic: localStorage.getItem("weeklytraffic_TrafficSale") ? JSON.parse(localStorage.getItem("weeklytraffic_TrafficSale")) : "",
        cancelations: localStorage.getItem("cancelations_TrafficSale") ? JSON.parse(localStorage.getItem("cancelations_TrafficSale")) : "",
        netsales: localStorage.getItem("netsales_TrafficSale") ? JSON.parse(localStorage.getItem("netsales_TrafficSale")) : "",
        totallots: localStorage.getItem("totallots_TrafficSale") ? JSON.parse(localStorage.getItem("totallots_TrafficSale")) : "",
        lotreleased: localStorage.getItem("lotreleased_TrafficSale") ? JSON.parse(localStorage.getItem("lotreleased_TrafficSale")) : "",
        unsoldinventory: localStorage.getItem("unsoldinventory_TrafficSale") ? JSON.parse(localStorage.getItem("unsoldinventory_TrafficSale")) : "",
        product_type: localStorage.getItem("product_type_TrafficSale") ? JSON.parse(localStorage.getItem("product_type_TrafficSale")) : "",
        area: localStorage.getItem("area_TrafficSale") ? JSON.parse(localStorage.getItem("area_TrafficSale")) : "",
        masterplan_id: localStorage.getItem("masterplan_id_TrafficSale") ? JSON.parse(localStorage.getItem("masterplan_id_TrafficSale")) : "",
        zipcode: localStorage.getItem("zipcode_TrafficSale") ? JSON.parse(localStorage.getItem("zipcode_TrafficSale")) : "",
        lotwidth: localStorage.getItem("lotwidth_TrafficSale") ? JSON.parse(localStorage.getItem("lotwidth_TrafficSale")) : "",
        lotsize: localStorage.getItem("lotsize_TrafficSale") ? JSON.parse(localStorage.getItem("lotsize_TrafficSale")) : "",
        zoning: localStorage.getItem("zoning_TrafficSale") ? JSON.parse(localStorage.getItem("zoning_TrafficSale")) : "",
        age: localStorage.getItem("age_TrafficSale") ? JSON.parse(localStorage.getItem("age_TrafficSale")) : "",
        single: localStorage.getItem("single_TrafficSale") ? JSON.parse(localStorage.getItem("single_TrafficSale")) : "",
    });

    useEffect(() => {
        if(localStorage.getItem("selectedBuilderNameByFilter_TrafficSale")) {
            const selectedBuilderName = JSON.parse(localStorage.getItem("selectedBuilderNameByFilter_TrafficSale"));
            handleSelectBuilderNameChange(selectedBuilderName);
        }
        if(localStorage.getItem("selectedSubdivisionNameByFilter_TrafficSale")) {
          const selectedSubdivisionName = JSON.parse(localStorage.getItem("selectedSubdivisionNameByFilter_TrafficSale"));
          handleSelectSubdivisionNameChange(selectedSubdivisionName);
        }
        if(localStorage.getItem("productTypeStatusByFilter_TrafficSale")) {
          const productTypeStatus = JSON.parse(localStorage.getItem("productTypeStatusByFilter_TrafficSale"));
          handleSelectProductTypeChange(productTypeStatus);
        }
        if(localStorage.getItem("selectedAreaByFilter_TrafficSale")) {
            const selectedArea = JSON.parse(localStorage.getItem("selectedAreaByFilter_TrafficSale"));
            handleSelectAreaChange(selectedArea);
        }
        if(localStorage.getItem("selectedMasterPlanByFilter_TrafficSale")) {
          const selectedMasterPlan = JSON.parse(localStorage.getItem("selectedMasterPlanByFilter_TrafficSale"));
          handleSelectMasterPlanChange(selectedMasterPlan);
        }
        if(localStorage.getItem("selectedAgeByFilter_TrafficSale")) {
            const selectedAge = JSON.parse(localStorage.getItem("selectedAgeByFilter_TrafficSale"));
            handleSelectAgeChange(selectedAge);
        }
        if(localStorage.getItem("selectedSingleByFilter_TrafficSale")) {
          const selectedSingle = JSON.parse(localStorage.getItem("selectedSingleByFilter_TrafficSale"));
          handleSelectSingleChange(selectedSingle);
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
        SubdivisionByBuilderIDList(selectedBuilderIDByFilter);
    }, [selectedBuilderIDByFilter]);

    useEffect(() => {
        if (selectedSubdivisionNameByFilter?.length === 0) {
            setFilterQuery(prevState => ({
                ...prevState,
                subdivision_name: ""
            }));
        }
    }, [selectedSubdivisionNameByFilter]);

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
            if(localStorage.getItem("setTrafficFilter") == "true") {
                setShowPopup(true);
                setMessage("Please select date.");
                localStorage.removeItem("setTrafficFilter");
                return;
            }
        } else {
            if(localStorage.getItem("setTrafficFilter") == "true") {
                if((searchQuery == "") || (searchQuery == "&from=&to=&builder_name=&subdivision_name=&weeklytraffic=&cancelations=&netsales=&totallots=&lotreleased=&unsoldinventory=&product_type=&area=&masterplan_id=&zipcode=&lotwidth=&lotsize=&zoning=&age=&single=")){
                    return;
                } else {
                    let startDate = moment(filterQuery.from);
                    let endDate = moment(filterQuery.to);
                    let days = endDate.diff(startDate, 'days', true);
                    let totaldays = Math.ceil(days) + 1;
                    if (totaldays < 367) {
                        navigate("/trafficsalelist");
                        localStorage.setItem("selectedBuilderNameByFilter_TrafficSale", JSON.stringify(selectedBuilderNameByFilter));
                        localStorage.setItem("selectedSubdivisionNameByFilter_TrafficSale", JSON.stringify(selectedSubdivisionNameByFilter));
                        localStorage.setItem("productTypeStatusByFilter_TrafficSale", JSON.stringify(productTypeStatusByFilter));
                        localStorage.setItem("selectedAreaByFilter_TrafficSale", JSON.stringify(selectedAreaByFilter));
                        localStorage.setItem("selectedMasterPlanByFilter_TrafficSale", JSON.stringify(selectedMasterPlanByFilter));
                        localStorage.setItem("selectedAgeByFilter_TrafficSale", JSON.stringify(selectedAgeByFilter));
                        localStorage.setItem("selectedSingleByFilter_TrafficSale", JSON.stringify(selectedSingleByFilter));
                        localStorage.setItem("from_TrafficSale", JSON.stringify(filterQuery.from));
                        localStorage.setItem("to_TrafficSale", JSON.stringify(filterQuery.to));
                        localStorage.setItem("builder_name_TrafficSale", JSON.stringify(filterQuery.builder_name));
                        localStorage.setItem("subdivision_name_TrafficSale", JSON.stringify(filterQuery.subdivision_name));
                        localStorage.setItem("weeklytraffic_TrafficSale", JSON.stringify(filterQuery.weeklytraffic));
                        localStorage.setItem("cancelations_TrafficSale", JSON.stringify(filterQuery.cancelations));
                        localStorage.setItem("netsales_TrafficSale", JSON.stringify(filterQuery.netsales));
                        localStorage.setItem("totallots_TrafficSale", JSON.stringify(filterQuery.totallots));
                        localStorage.setItem("lotreleased_TrafficSale", JSON.stringify(filterQuery.lotreleased));
                        localStorage.setItem("unsoldinventory_TrafficSale", JSON.stringify(filterQuery.unsoldinventory));
                        localStorage.setItem("product_type_TrafficSale", JSON.stringify(filterQuery.product_type));
                        localStorage.setItem("area_TrafficSale", JSON.stringify(filterQuery.area));
                        localStorage.setItem("masterplan_id_TrafficSale", JSON.stringify(filterQuery.masterplan_id));
                        localStorage.setItem("zipcode_TrafficSale", JSON.stringify(filterQuery.zipcode));
                        localStorage.setItem("lotwidth_TrafficSale", JSON.stringify(filterQuery.lotwidth));
                        localStorage.setItem("lotsize_TrafficSale", JSON.stringify(filterQuery.lotsize));
                        localStorage.setItem("zoning_TrafficSale", JSON.stringify(filterQuery.zoning));
                        localStorage.setItem("age_TrafficSale", JSON.stringify(filterQuery.age));
                        localStorage.setItem("single_TrafficSale", JSON.stringify(filterQuery.single));
                        localStorage.setItem("searchQueryByWeeklyTrafficFilter", JSON.stringify(searchQuery.replace(/^"",|,""$/g, '')));
                    } else {
                        setShowPopup(true);
                        setMessage("Please select date between 366 days.");
                        localStorage.removeItem("setTrafficFilter");
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
                navigate("/trafficsalelist");
                localStorage.setItem("selectedBuilderNameByFilter_TrafficSale", JSON.stringify(selectedBuilderNameByFilter));
                localStorage.setItem("selectedSubdivisionNameByFilter_TrafficSale", JSON.stringify(selectedSubdivisionNameByFilter));
                localStorage.setItem("productTypeStatusByFilter_TrafficSale", JSON.stringify(productTypeStatusByFilter));
                localStorage.setItem("selectedAreaByFilter_TrafficSale", JSON.stringify(selectedAreaByFilter));
                localStorage.setItem("selectedMasterPlanByFilter_TrafficSale", JSON.stringify(selectedMasterPlanByFilter));
                localStorage.setItem("selectedAgeByFilter_TrafficSale", JSON.stringify(selectedAgeByFilter));
                localStorage.setItem("selectedSingleByFilter_TrafficSale", JSON.stringify(selectedSingleByFilter));
                localStorage.setItem("from_TrafficSale", JSON.stringify(filterQuery.from));
                localStorage.setItem("to_TrafficSale", JSON.stringify(filterQuery.to));
                localStorage.setItem("builder_name_TrafficSale", JSON.stringify(filterQuery.builder_name));
                localStorage.setItem("subdivision_name_TrafficSale", JSON.stringify(filterQuery.subdivision_name));
                localStorage.setItem("weeklytraffic_TrafficSale", JSON.stringify(filterQuery.weeklytraffic));
                localStorage.setItem("cancelations_TrafficSale", JSON.stringify(filterQuery.cancelations));
                localStorage.setItem("netsales_TrafficSale", JSON.stringify(filterQuery.netsales));
                localStorage.setItem("totallots_TrafficSale", JSON.stringify(filterQuery.totallots));
                localStorage.setItem("lotreleased_TrafficSale", JSON.stringify(filterQuery.lotreleased));
                localStorage.setItem("unsoldinventory_TrafficSale", JSON.stringify(filterQuery.unsoldinventory));
                localStorage.setItem("product_type_TrafficSale", JSON.stringify(filterQuery.product_type));
                localStorage.setItem("area_TrafficSale", JSON.stringify(filterQuery.area));
                localStorage.setItem("masterplan_id_TrafficSale", JSON.stringify(filterQuery.masterplan_id));
                localStorage.setItem("zipcode_TrafficSale", JSON.stringify(filterQuery.zipcode));
                localStorage.setItem("lotwidth_TrafficSale", JSON.stringify(filterQuery.lotwidth));
                localStorage.setItem("lotsize_TrafficSale", JSON.stringify(filterQuery.lotsize));
                localStorage.setItem("zoning_TrafficSale", JSON.stringify(filterQuery.zoning));
                localStorage.setItem("age_TrafficSale", JSON.stringify(filterQuery.age));
                localStorage.setItem("single_TrafficSale", JSON.stringify(filterQuery.single));
                localStorage.setItem("searchQueryByWeeklyTrafficFilter", JSON.stringify(searchQuery.replace(/^"",|,""$/g, '')));
                localStorage.setItem("setTrafficFilter", true);
            } else {
                setShowPopup(true);
                setMessage("Please select date between 366 days.");
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

    const HandleCancelFilter = (e) => {
        setFilterQuery({
            from: "",
            to: "",
            builder_name: "",
            subdivision_name: "",
            weeklytraffic: "",
            cancelations: "",
            netsales: "",
            totallots: "",
            lotreleased: "",
            unsoldinventory: "",
            product_type: "",
            area: "",
            masterplan_id: "",
            zipcode: "",
            lotwidth: "",
            lotsize: "",
            zoning: "",
            age: "",
            single: "",
        });
        setSelectedBuilderNameByFilter([]);
        setSelectedSubdivisionNameByFilter([]);
        setProductTypeStatusByFilter([]);
        setSelectedAreaByFilter([]);
        setSelectedMasterPlanByFilter([]);
        setSelectedAgeByFilter([]);
        setSelectedSingleByFilter([]);
        setSelectedBuilderIDByFilter([]);
    };

    return (
        <Fragment>
            <div className="container mt-5">
                <h2>Filter Weekly Traffic & Sales</h2>
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
                            <label className="form-label">WEEKLY TRAFFIC :{" "}</label>
                            <input value={filterQuery.weeklytraffic} name="weeklytraffic" className="form-control" onChange={HandleFilter} />
                        </div>
                        <div className="col-md-3 mt-3">
                            <label className="form-label">WEEKLY CANCELLATIONS:{" "}</label>
                            <input name="cancelations" value={filterQuery.cancelations} className="form-control" onChange={HandleFilter} />
                        </div>
                        <div className="col-md-3 mt-3">
                            <label className="form-label">WEEKLY NET SALES:{" "}</label>
                            <input name="netsales" value={filterQuery.netsales} className="form-control" onChange={HandleFilter} />
                        </div>
                        <div className="col-md-3 mt-3">
                            <label className="form-label">TOTAL LOTS:{" "}</label>
                            <input value={filterQuery.totallots} name="totallots" className="form-control" onChange={HandleFilter} />
                        </div>
                        <div className="col-md-3 mt-3">
                            <label className="form-label">WEEKLY LOTS RELEASE FOR SALE:{" "}</label>
                            <input value={filterQuery.lotreleased} name="lotreleased" className="form-control" onChange={HandleFilter} />
                        </div>
                        <div className="col-md-3 mt-3">
                            <label className="form-label">WEEKLY UNSOLD STANDING INVENTORY:{" "}</label>
                            <input type="unsoldinventory" value={filterQuery.unsoldinventory} name="unsoldinventory" className="form-control" onChange={HandleFilter} />
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
                            <label className="form-label">ZONING:{" "}</label>
                            <input value={filterQuery.zoning} name="zoning" className="form-control" onChange={HandleFilter} />
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

export default FilterWeeklyTrafficAndSales;
