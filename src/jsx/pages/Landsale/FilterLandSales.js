import React, { useEffect, useState } from 'react'
import AdminSubdevisionService from '../../../API/Services/AdminService/AdminSubdevisionService';
import AdminBuilderService from '../../../API/Services/AdminService/AdminBuilderService';
import { useNavigate } from 'react-router-dom';
import { MultiSelect } from 'react-multi-select-component';
import DatePicker from "react-datepicker";
import { Form } from "react-bootstrap";
import { Button } from 'react-bootstrap';

const FilterLandSales = () => {
    const navigate = useNavigate();
    const [builderListDropDown, setBuilderListDropDown] = useState([]);
    const [subdivisionListDropDown, setSubdivisionListDropDown] = useState([]);
    const [selectedBuilderNameByFilter, setSelectedBuilderNameByFilter] = useState([]);
    const [selectedSubdivisionNameByFilter, setSelectedSubdivisionNameByFilter] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterQuery, setFilterQuery] = useState({
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

    useEffect(() => {
        if (localStorage.getItem("usertoken")) {
            GetBuilderDropDownList();
            GetSubdivisionDropDownList();
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
            }
        }
    };

    const HandleFilterForm = (e) => {
        e.preventDefault();
        navigate("/landsalelist", {
            state: {
                searchQueryByFilter: searchQuery.replace(/^"",|,""$/g, ''),
                selectedBuilderNameByFilter,
                selectedSubdivisionNameByFilter,
                sellerByFilter: filterQuery.seller,
                buyerByFilter: filterQuery.buyer,
                locationByFilter: filterQuery.location,
                notesByFilter: filterQuery.notes,
                priceByFilter: filterQuery.price,
                fromByFilter: filterQuery.from,
                toByFilter: filterQuery.to,
                priceperunitByFilter: filterQuery.priceperunit,
                parcelByFilter: filterQuery.parcel,
                docByFilter: filterQuery.doc,
                noofunitByFilter: filterQuery.noofunit,
                typeofunitByFilter: filterQuery.typeofunit,
            }
        });
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
      };

    return (
        <div className="container mt-5">
            <h2>Filter Land Sales</h2>
            <form onSubmit={HandleFilterForm}>
                <div className="row">
                    <div className="col-md-3 mt-3">
                        <label className="form-label">
                            BUILDER NAME:{" "}
                        </label>
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
                        <label className="form-label">
                            SUBDIVISION NAME:{" "}
                        </label>
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
                        <label className="form-label">
                            SELLER:{" "}
                        </label>
                        <input name="seller" value={filterQuery.seller} className="form-control" onChange={HandleFilter} />
                    </div>
                    <div className="col-md-3 mt-3">
                        <label className="form-label">
                            BUYER:{" "}
                        </label>
                        <input name="buyer" value={filterQuery.buyer} className="form-control" onChange={HandleFilter} />
                    </div>
                    <div className="col-md-3 mt-3">
                        <label className="form-label">
                            LOCATION:{" "}
                        </label>
                        <input name="location" value={filterQuery.location} className="form-control" onChange={HandleFilter} />
                    </div>
                    <div className="col-md-3 mt-3">
                        <label className="form-label">
                            Notes:{" "}
                        </label>
                        <input name="notes" value={filterQuery.notes} className="form-control" onChange={HandleFilter} />
                    </div>
                    <div className="col-md-3 mt-3">
                        <label className="form-label">
                            PRICE:{" "}
                        </label>
                        <input name="price" value={filterQuery.price} className="form-control" onChange={HandleFilter} />
                    </div>
                    <div className="col-md-3 mt-3">
                        <label className="form-label">From:{" "}</label>
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
                        <label className="form-label">To:{" "}</label>
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
                        <label className="form-label">
                            PRICE PER:{" "}
                        </label>
                        <input name="priceperunit" value={filterQuery.priceperunit} className="form-control" onChange={HandleFilter} />
                    </div>
                    <div className="col-md-3 mt-3">
                        <label className="form-label">
                            PARCEL:{" "}
                        </label>
                        <input name="parcel" value={filterQuery.parcel} className="form-control" onChange={HandleFilter} />
                    </div>
                    <div className="col-md-3 mt-3">
                        <label className="form-label">
                            DOC:{" "}
                        </label>
                        <input name="doc" value={filterQuery.doc} className="form-control" onChange={HandleFilter} />
                    </div>
                    <div className="col-md-3 mt-3">
                        <label className="form-label">
                            SIZE:{" "}
                        </label>
                        <input name="noofunit" value={filterQuery.noofunit} className="form-control" onChange={HandleFilter} />
                    </div>
                    <div className="col-md-3 mt-3">
                        <label className="form-label">
                            SIZE MS:{" "}
                        </label>
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
    )
}

export default FilterLandSales
