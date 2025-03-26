import React, { Fragment, useEffect, useState } from 'react'
import AdminSubdevisionService from '../../../API/Services/AdminService/AdminSubdevisionService';
import AdminBuilderService from '../../../API/Services/AdminService/AdminBuilderService';
import { useNavigate } from 'react-router-dom';
import { MultiSelect } from 'react-multi-select-component';
import DatePicker from "react-datepicker";
import { Form } from "react-bootstrap";
import { Button } from 'react-bootstrap';
import moment from 'moment';
import Modal from "react-bootstrap/Modal";

const FilterLandSales = () => {
    const navigate = useNavigate();
    const [builderListDropDown, setBuilderListDropDown] = useState([]);
    const [subdivisionListDropDown, setSubdivisionListDropDown] = useState([]);
    const [selectedBuilderNameByFilter, setSelectedBuilderNameByFilter] = useState([]);
    const [selectedSubdivisionNameByFilter, setSelectedSubdivisionNameByFilter] = useState([]);
    const [selectedBuilderIDByFilter, setSelectedBuilderIDByFilter] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState(false);
    const handlePopupClose = () => setShowPopup(false);
    const [filterQuery, setFilterQuery] = useState({
        from: localStorage.getItem("from_LandSale") ? JSON.parse(localStorage.getItem("from_LandSale")) : "",
        to: localStorage.getItem("to_LandSale") ? JSON.parse(localStorage.getItem("to_LandSale")) : "",
        builder_name: localStorage.getItem("builder_name_LandSale") ? JSON.parse(localStorage.getItem("builder_name_LandSale")) : "",
        subdivision_name: localStorage.getItem("subdivision_name_LandSale") ? JSON.parse(localStorage.getItem("subdivision_name_LandSale")) : "",
        seller: localStorage.getItem("seller_LandSale") ? JSON.parse(localStorage.getItem("seller_LandSale")) : "",
        buyer: localStorage.getItem("buyer_LandSale") ? JSON.parse(localStorage.getItem("buyer_LandSale")) : "",
        location: localStorage.getItem("location_LandSale") ? JSON.parse(localStorage.getItem("location_LandSale")) : "",
        notes: localStorage.getItem("notes_LandSale") ? JSON.parse(localStorage.getItem("notes_LandSale")) : "",
        price: localStorage.getItem("price_LandSale") ? JSON.parse(localStorage.getItem("price_LandSale")) : "",
        priceperunit: localStorage.getItem("priceperunit_LandSale") ? JSON.parse(localStorage.getItem("priceperunit_LandSale")) : "",
        parcel: localStorage.getItem("parcel_LandSale") ? JSON.parse(localStorage.getItem("parcel_LandSale")) : "",
        doc: localStorage.getItem("document_LandSale") ? JSON.parse(localStorage.getItem("document_LandSale")) : "",
        noofunit: localStorage.getItem("noofunit_LandSale") ? JSON.parse(localStorage.getItem("noofunit_LandSale")) : "",
        typeofunit: localStorage.getItem("typeofunit_LandSale") ? JSON.parse(localStorage.getItem("typeofunit_LandSale")) : "",
    });

    useEffect(() => {
        if(localStorage.getItem("selectedBuilderNameByFilter_LandSale")) {
            const selectedBuilderName = JSON.parse(localStorage.getItem("selectedBuilderNameByFilter_LandSale"));
            handleSelectBuilderNameChange(selectedBuilderName);
        }
        if(localStorage.getItem("selectedSubdivisionNameByFilter_LandSale")) {
          const selectedSubdivisionName = JSON.parse(localStorage.getItem("selectedSubdivisionNameByFilter_LandSale"));
          handleSelectSubdivisionNameChange(selectedSubdivisionName);
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
            if(localStorage.getItem("setLansSaleFilter") == "true") {
                setShowPopup(true);
                setMessage("Please select date.");
                localStorage.removeItem("setLansSaleFilter");
                return;
            }
        } else {
            if(localStorage.getItem("setLansSaleFilter") == "true") {
                if((searchQuery == "") || (searchQuery == "&builder_name=&subdivision_name=&seller=&buyer=&location=&notes=&price=&from=&to=&priceperunit=&parcel=&doc=&noofunit=&typeofunit=")){
                    return;
                } else {
                    let startDate = moment(filterQuery.from);
                    let endDate = moment(filterQuery.to);
                    let days = endDate.diff(startDate, 'days', true);
                    let totaldays = Math.ceil(days) + 1;
                    if (totaldays < 367) {
                        navigate("/landsalelist");
                        localStorage.setItem("selectedBuilderNameByFilter_LandSale", JSON.stringify(selectedBuilderNameByFilter));
                        localStorage.setItem("selectedSubdivisionNameByFilter_LandSale", JSON.stringify(selectedSubdivisionNameByFilter));
                        localStorage.setItem("from_LandSale", JSON.stringify(filterQuery.from));
                        localStorage.setItem("to_LandSale", JSON.stringify(filterQuery.to));
                        localStorage.setItem("builder_name_LandSale", JSON.stringify(filterQuery.builder_name));
                        localStorage.setItem("subdivision_name_LandSale", JSON.stringify(filterQuery.subdivision_name));
                        localStorage.setItem("seller_LandSale", JSON.stringify(filterQuery.seller));
                        localStorage.setItem("buyer_LandSale", JSON.stringify(filterQuery.buyer));
                        localStorage.setItem("location_LandSale", JSON.stringify(filterQuery.location));
                        localStorage.setItem("notes_LandSale", JSON.stringify(filterQuery.notes));
                        localStorage.setItem("price_LandSale", JSON.stringify(filterQuery.price));
                        localStorage.setItem("priceperunit_LandSale", JSON.stringify(filterQuery.priceperunit));
                        localStorage.setItem("parcel_LandSale", JSON.stringify(filterQuery.parcel));
                        localStorage.setItem("document_LandSale", JSON.stringify(filterQuery.doc));
                        localStorage.setItem("noofunit_LandSale", JSON.stringify(filterQuery.noofunit));
                        localStorage.setItem("typeofunit_LandSale", JSON.stringify(filterQuery.typeofunit));
                        localStorage.setItem("searchQueryByLandSalesFilter", JSON.stringify(searchQuery.replace(/^"",|,""$/g, '')));
                    } else {
                        setShowPopup(true);
                        setMessage("Please select date between 366 days.");
                        localStorage.removeItem("setLansSaleFilter");
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
                navigate("/landsalelist");
                localStorage.setItem("selectedBuilderNameByFilter_LandSale", JSON.stringify(selectedBuilderNameByFilter));
                localStorage.setItem("selectedSubdivisionNameByFilter_LandSale", JSON.stringify(selectedSubdivisionNameByFilter));
                localStorage.setItem("from_LandSale", JSON.stringify(filterQuery.from));
                localStorage.setItem("to_LandSale", JSON.stringify(filterQuery.to));
                localStorage.setItem("builder_name_LandSale", JSON.stringify(filterQuery.builder_name));
                localStorage.setItem("subdivision_name_LandSale", JSON.stringify(filterQuery.subdivision_name));
                localStorage.setItem("seller_LandSale", JSON.stringify(filterQuery.seller));
                localStorage.setItem("buyer_LandSale", JSON.stringify(filterQuery.buyer));
                localStorage.setItem("location_LandSale", JSON.stringify(filterQuery.location));
                localStorage.setItem("notes_LandSale", JSON.stringify(filterQuery.notes));
                localStorage.setItem("price_LandSale", JSON.stringify(filterQuery.price));
                localStorage.setItem("priceperunit_LandSale", JSON.stringify(filterQuery.priceperunit));
                localStorage.setItem("parcel_LandSale", JSON.stringify(filterQuery.parcel));
                localStorage.setItem("document_LandSale", JSON.stringify(filterQuery.doc));
                localStorage.setItem("noofunit_LandSale", JSON.stringify(filterQuery.noofunit));
                localStorage.setItem("typeofunit_LandSale", JSON.stringify(filterQuery.typeofunit));
                localStorage.setItem("searchQueryByLandSalesFilter", JSON.stringify(searchQuery.replace(/^"",|,""$/g, '')));
                localStorage.setItem("setLansSaleFilter", true);
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

    const HandleCancelFilter = () => {
        setFilterQuery({
            builder_name: "",
            subdivision_name: "",
            seller: "",
            buyer: "",
            location: "",
            notes: "",
            price: "",
            from: "",
            to: "",
            priceperunit: "",
            parcel: "",
            doc: "",
            noofunit: "",
            typeofunit: "",
        });
        setSelectedBuilderNameByFilter([]);
        setSelectedSubdivisionNameByFilter([]);
        setSelectedBuilderIDByFilter([]);
    };

    return (
        <Fragment>
            <div className="container mt-5">
                <h2>Filter Land Sales</h2>
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
                            <label className="form-label">SELLER:{" "}</label>
                            <input name="seller" value={filterQuery.seller} className="form-control" onChange={HandleFilter} />
                        </div>
                        <div className="col-md-3 mt-3">
                            <label className="form-label">BUYER:{" "}</label>
                            <input name="buyer" value={filterQuery.buyer} className="form-control" onChange={HandleFilter} />
                        </div>
                        <div className="col-md-3 mt-3">
                            <label className="form-label">LOCATION:{" "}</label>
                            <input name="location" value={filterQuery.location} className="form-control" onChange={HandleFilter} />
                        </div>
                        <div className="col-md-3 mt-3">
                            <label className="form-label">Notes:{" "}</label>
                            <input name="notes" value={filterQuery.notes} className="form-control" onChange={HandleFilter} />
                        </div>
                        <div className="col-md-3 mt-3">
                            <label className="form-label">PRICE:{" "}</label>
                            <input name="price" value={filterQuery.price} className="form-control" onChange={HandleFilter} />
                        </div>
                        <div className="col-md-3 mt-3">
                            <label className="form-label">PRICE PER:{" "}</label>
                            <input name="priceperunit" value={filterQuery.priceperunit} className="form-control" onChange={HandleFilter} />
                        </div>
                        <div className="col-md-3 mt-3">
                            <label className="form-label">PARCEL:{" "}</label>
                            <input name="parcel" value={filterQuery.parcel} className="form-control" onChange={HandleFilter} />
                        </div>
                        <div className="col-md-3 mt-3">
                            <label className="form-label">DOC:{" "}</label>
                            <input name="doc" value={filterQuery.doc} className="form-control" onChange={HandleFilter} />
                        </div>
                        <div className="col-md-3 mt-3">
                            <label className="form-label">SIZE:{" "}</label>
                            <input name="noofunit" value={filterQuery.noofunit} className="form-control" onChange={HandleFilter} />
                        </div>
                        <div className="col-md-3 mt-3">
                            <label className="form-label">SIZE MS:{" "}</label>
                            <input name="typeofunit" value={filterQuery.typeofunit} className="form-control" onChange={HandleFilter} />
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

export default FilterLandSales;
