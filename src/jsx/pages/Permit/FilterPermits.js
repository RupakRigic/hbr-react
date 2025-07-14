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

const FilterPermits = () => {
    const navigate = useNavigate();
    const [builderListDropDown, setBuilderListDropDown] = useState([]);
    const [selectedBuilderNameByFilter, setSelectedBuilderNameByFilter] = useState([]);
    const [masterPlanDropDownList, setMasterPlanDropDownList] = useState([]);
    const [subdivisionListDropDown, setSubdivisionListDropDown] = useState([]);
    const [selectedBuilderIDByFilter, setSelectedBuilderIDByFilter] = useState([]);
    const [selectedSubdivisionNameByFilter, setSelectedSubdivisionNameByFilter] = useState([]);
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
        from: localStorage.getItem("from_Permit") ? JSON.parse(localStorage.getItem("from_Permit")) : "",
        to: localStorage.getItem("to_Permit") ? JSON.parse(localStorage.getItem("to_Permit")) : "",
        builder_name: localStorage.getItem("builder_name_Permit") ? JSON.parse(localStorage.getItem("builder_name_Permit")) : "",
        subdivision_name: localStorage.getItem("subdivision_name_Permit") ? JSON.parse(localStorage.getItem("subdivision_name_Permit")) : "",
        address2: localStorage.getItem("address2_Permit") ? JSON.parse(localStorage.getItem("address2_Permit")) : "",
        address1: localStorage.getItem("address1_Permit") ? JSON.parse(localStorage.getItem("address1_Permit")) : "",
        parcel: localStorage.getItem("parcel_Permit") ? JSON.parse(localStorage.getItem("parcel_Permit")) : "",
        sqft: localStorage.getItem("sqft_Permit") ? JSON.parse(localStorage.getItem("sqft_Permit")) : "",
        lotnumber: localStorage.getItem("lotnumber_Permit") ? JSON.parse(localStorage.getItem("lotnumber_Permit")) : "",
        permitnumber: localStorage.getItem("permitnumber_Permit") ? JSON.parse(localStorage.getItem("permitnumber_Permit")) : "",
        plan: localStorage.getItem("plan_Permit") ? JSON.parse(localStorage.getItem("plan_Permit")) : "",
        product_type: localStorage.getItem("product_type_Permit") ? JSON.parse(localStorage.getItem("product_type_Permit")) : "",
        area: localStorage.getItem("area_Permit") ? JSON.parse(localStorage.getItem("area_Permit")) : "",
        masterplan_id: localStorage.getItem("masterplan_id_Permit") ? JSON.parse(localStorage.getItem("masterplan_id_Permit")) : "",
        zipcode: localStorage.getItem("zipcode_Permit") ? JSON.parse(localStorage.getItem("zipcode_Permit")) : "",
        lotwidth: localStorage.getItem("lotwidth_Permit") ? JSON.parse(localStorage.getItem("lotwidth_Permit")) : "",
        lotsize: localStorage.getItem("lotsize_Permit") ? JSON.parse(localStorage.getItem("lotsize_Permit")) : "",
        age: localStorage.getItem("age_Permit") ? JSON.parse(localStorage.getItem("age_Permit")) : "",
        single: localStorage.getItem("single_Permit") ? JSON.parse(localStorage.getItem("single_Permit")) : "",
    });

    useEffect(() => {
        if(localStorage.getItem("selectedBuilderNameByFilter_Permit")) {
            const selectedBuilderName = JSON.parse(localStorage.getItem("selectedBuilderNameByFilter_Permit"));
            handleSelectBuilderNameChange(selectedBuilderName);
        }
        if(localStorage.getItem("selectedSubdivisionNameByFilter_Permit")) {
          const selectedSubdivisionName = JSON.parse(localStorage.getItem("selectedSubdivisionNameByFilter_Permit"));
          handleSelectSubdivisionNameChange(selectedSubdivisionName);
        }
        if(localStorage.getItem("productTypeStatusByFilter_Permit")) {
          const productTypeStatus = JSON.parse(localStorage.getItem("productTypeStatusByFilter_Permit"));
          handleSelectProductTypeChange(productTypeStatus);
        }
        if(localStorage.getItem("selectedAreaByFilter_Permit")) {
            const selectedArea = JSON.parse(localStorage.getItem("selectedAreaByFilter_Permit"));
            handleSelectAreaChange(selectedArea);
        }
        if(localStorage.getItem("selectedMasterPlanByFilter_Permit")) {
          const selectedMasterPlan = JSON.parse(localStorage.getItem("selectedMasterPlanByFilter_Permit"));
          handleSelectMasterPlanChange(selectedMasterPlan);
        }
        if(localStorage.getItem("selectedAgeByFilter_Permit")) {
            const selectedAge = JSON.parse(localStorage.getItem("selectedAgeByFilter_Permit"));
            handleSelectAgeChange(selectedAge);
        }
        if(localStorage.getItem("selectedSingleByFilter_Permit")) {
          const selectedSingle = JSON.parse(localStorage.getItem("selectedSingleByFilter_Permit"));
          handleSelectSingleChange(selectedSingle);
        }
    }, []);

    useEffect(() => {
        if (localStorage.getItem("usertoken")) {
            GetBuilderDropDownList();
            GetMasterPlanDropDownList();
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
            if (error.name === "HTTPError") {
                const errorJson = await error.response.json();
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
            if (error.name === "HTTPError") {
                const errorJson = await error.response.json();
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
            setMasterPlanDropDownList(formattedData);
        } catch (error) {
            if (error.name === "HTTPError") {
                const errorJson = await error.response.json();
            }
        }
    };

    const HandlePopupDetailClick = (e) => {
        setShowPopup(true);
    };

    useEffect(() => {
        if (filterQuery.from == "" || filterQuery.to == "") {
            if(localStorage.getItem("setPermitFilter") == "true") {
                setShowPopup(true);
                setMessage("Please select date.");
                localStorage.removeItem("setPermitFilter");
                return;
            }
        } else {
            if(localStorage.getItem("setPermitFilter") == "true") {
                if((searchQuery == "") || (searchQuery == "&from=&to=&builder_name=&subdivision_name=&address2=&address1=&parcel=&sqft=&lotnumber=&permitnumber=&plan=&product_type=&area=&masterplan_id=&zipcode=&lotwidth=&lotsize=&age=&single=")){
                    return;
                } else {
                    let startDate = moment(filterQuery.from);
                    let endDate = moment(filterQuery.to);
                    let days = endDate.diff(startDate, 'days', true);
                    let totaldays = Math.ceil(days) + 1;
                    if (totaldays < 367) {
                        navigate("/permitlist");
                        localStorage.setItem("selectedBuilderNameByFilter_Permit", JSON.stringify(selectedBuilderNameByFilter));
                        localStorage.setItem("selectedSubdivisionNameByFilter_Permit", JSON.stringify(selectedSubdivisionNameByFilter));
                        localStorage.setItem("productTypeStatusByFilter_Permit", JSON.stringify(productTypeStatusByFilter));
                        localStorage.setItem("selectedAreaByFilter_Permit", JSON.stringify(selectedAreaByFilter));
                        localStorage.setItem("selectedMasterPlanByFilter_Permit", JSON.stringify(selectedMasterPlanByFilter));
                        localStorage.setItem("selectedAgeByFilter_Permit", JSON.stringify(selectedAgeByFilter));
                        localStorage.setItem("selectedSingleByFilter_Permit", JSON.stringify(selectedSingleByFilter));
                        localStorage.setItem("from_Permit", JSON.stringify(filterQuery.from));
                        localStorage.setItem("to_Permit", JSON.stringify(filterQuery.to));
                        localStorage.setItem("builder_name_Permit", JSON.stringify(filterQuery.builder_name));
                        localStorage.setItem("subdivision_name_Permit", JSON.stringify(filterQuery.subdivision_name));
                        localStorage.setItem("address2_Permit", JSON.stringify(filterQuery.address2));
                        localStorage.setItem("address1_Permit", JSON.stringify(filterQuery.address1));
                        localStorage.setItem("parcel_Permit", JSON.stringify(filterQuery.parcel));
                        localStorage.setItem("sqft_Permit", JSON.stringify(filterQuery.sqft));
                        localStorage.setItem("lotnumber_Permit", JSON.stringify(filterQuery.lotnumber));
                        localStorage.setItem("permitnumber_Permit", JSON.stringify(filterQuery.permitnumber));
                        localStorage.setItem("plan_Permit", JSON.stringify(filterQuery.plan));
                        localStorage.setItem("product_type_Permit", JSON.stringify(filterQuery.product_type));
                        localStorage.setItem("area_Permit", JSON.stringify(filterQuery.area));
                        localStorage.setItem("masterplan_id_Permit", JSON.stringify(filterQuery.masterplan_id));
                        localStorage.setItem("zipcode_Permit", JSON.stringify(filterQuery.zipcode));
                        localStorage.setItem("lotwidth_Permit", JSON.stringify(filterQuery.lotwidth));
                        localStorage.setItem("lotsize_Permit", JSON.stringify(filterQuery.lotsize));
                        localStorage.setItem("age_Permit", JSON.stringify(filterQuery.age));
                        localStorage.setItem("single_Permit", JSON.stringify(filterQuery.single));
                        localStorage.setItem("searchQueryByPermitsFilter", JSON.stringify(searchQuery.replace(/^"",|,""$/g, '')));
                    } else {
                        setShowPopup(true);
                        setMessage("Please select date between 366 days.");
                        localStorage.removeItem("setPermitFilter");
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
                navigate("/permitlist");
                localStorage.setItem("selectedBuilderNameByFilter_Permit", JSON.stringify(selectedBuilderNameByFilter));
                localStorage.setItem("selectedSubdivisionNameByFilter_Permit", JSON.stringify(selectedSubdivisionNameByFilter));
                localStorage.setItem("productTypeStatusByFilter_Permit", JSON.stringify(productTypeStatusByFilter));
                localStorage.setItem("selectedAreaByFilter_Permit", JSON.stringify(selectedAreaByFilter));
                localStorage.setItem("selectedMasterPlanByFilter_Permit", JSON.stringify(selectedMasterPlanByFilter));
                localStorage.setItem("selectedAgeByFilter_Permit", JSON.stringify(selectedAgeByFilter));
                localStorage.setItem("selectedSingleByFilter_Permit", JSON.stringify(selectedSingleByFilter));
                localStorage.setItem("from_Permit", JSON.stringify(filterQuery.from));
                localStorage.setItem("to_Permit", JSON.stringify(filterQuery.to));
                localStorage.setItem("builder_name_Permit", JSON.stringify(filterQuery.builder_name));
                localStorage.setItem("subdivision_name_Permit", JSON.stringify(filterQuery.subdivision_name));
                localStorage.setItem("address2_Permit", JSON.stringify(filterQuery.address2));
                localStorage.setItem("address1_Permit", JSON.stringify(filterQuery.address1));
                localStorage.setItem("parcel_Permit", JSON.stringify(filterQuery.parcel));
                localStorage.setItem("sqft_Permit", JSON.stringify(filterQuery.sqft));
                localStorage.setItem("lotnumber_Permit", JSON.stringify(filterQuery.lotnumber));
                localStorage.setItem("permitnumber_Permit", JSON.stringify(filterQuery.permitnumber));
                localStorage.setItem("plan_Permit", JSON.stringify(filterQuery.plan));
                localStorage.setItem("product_type_Permit", JSON.stringify(filterQuery.product_type));
                localStorage.setItem("area_Permit", JSON.stringify(filterQuery.area));
                localStorage.setItem("masterplan_id_Permit", JSON.stringify(filterQuery.masterplan_id));
                localStorage.setItem("zipcode_Permit", JSON.stringify(filterQuery.zipcode));
                localStorage.setItem("lotwidth_Permit", JSON.stringify(filterQuery.lotwidth));
                localStorage.setItem("lotsize_Permit", JSON.stringify(filterQuery.lotsize));
                localStorage.setItem("age_Permit", JSON.stringify(filterQuery.age));
                localStorage.setItem("single_Permit", JSON.stringify(filterQuery.single));
                localStorage.setItem("searchQueryByPermitsFilter", JSON.stringify(searchQuery.replace(/^"",|,""$/g, '')));
                localStorage.setItem("setPermitFilter", true);
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
        setSelectedBuilderIDByFilter(selectedValues);
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
        { value: "L", label: "L" },
        { value: "MSQ", label: "MSQ" },
        { value: "MV", label: "MV" },
        { value: "NLV", label: "NLV" },
        { value: "NW", label: "NW" },
        { value: "P", label: "P" },
        { value: "SO", label: "SO" },
        { value: "SW", label: "SW" }
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
            from: "",
            to: "",
            builder_name: "",
            subdivision_name: "",
            address2: "",
            address1: "",
            parcel: "",
            sqft: "",
            lotnumber: "",
            permitnumber: "",
            plan: "",
            product_type: "",
            area: "",
            masterplan_id: "",
            zipcode: "",
            lotwidth: "",
            lotsize: "",
            age: "",
            single: ""
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
                <h2>Filter Permits</h2>
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
                            <label className="form-label">ADDRESS NUMBER:{" "}</label>
                            <input name="address2" value={filterQuery.address2} className="form-control" onChange={HandleFilter} />
                        </div>
                        <div className="col-md-3 mt-3">
                            <label className="form-label">ADDRESS NAME:{" "}</label>
                            <input name="address1" value={filterQuery.address1} className="form-control" onChange={HandleFilter} />
                        </div>
                        <div className="col-md-3 mt-3">
                            <label className="form-label">PARCEL NUMBER:{" "}</label>
                            <input value={filterQuery.parcel} name="parcel" className="form-control" onChange={HandleFilter} />
                        </div>
                        <div className="col-md-3 mt-3">
                            <label className="form-label">SQUARE FOOTAGE:{" "}</label>
                            <input type="text" value={filterQuery.sqft} name="sqft" className="form-control" onChange={HandleFilter} />
                        </div>
                        <div className="col-md-3 mt-3">
                            <label className="form-label">LOT NUMBER:{" "}</label>
                            <input value={filterQuery.lotnumber} name="lotnumber" className="form-control" onChange={HandleFilter} />
                        </div>
                        <div className="col-md-3 mt-3">
                            <label className="form-label">PERMIT NUMBER:{" "}</label>
                            <input value={filterQuery.permitnumber} name="permitnumber" className="form-control" onChange={HandleFilter} />
                        </div>
                        <div className="col-md-3 mt-3 ">
                            <label className="form-label">PLAN:{" "}</label>
                            <input value={filterQuery.plan} name="plan" className="form-control" onChange={HandleFilter} />
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
                                options={masterPlanDropDownList}
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

export default FilterPermits;
