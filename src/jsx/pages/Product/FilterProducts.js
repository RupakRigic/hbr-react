import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { MultiSelect } from 'react-multi-select-component';
import { Form } from "react-bootstrap";
import { Button } from 'react-bootstrap';
import AdminBuilderService from '../../../API/Services/AdminService/AdminBuilderService';
import AdminSubdevisionService from '../../../API/Services/AdminService/AdminSubdevisionService';

const FilterProducts = () => {
    const navigate = useNavigate();
    const [selectedStatusByFilter, setSelectedStatusByFilter] = useState([]);
    const [builderListDropDown, setBuilderListDropDown] = useState([]);
    const [selectedBuilderNameByFilter, setSelectedBuilderNameByFilter] = useState([]);
    const [subdivisionListDropDown, setSubdivisionListDropDown] = useState([]);
    const [selectedSubdivisionNameByFilter, setSelectedSubdivisionNameByFilter] = useState([]);
    const [selectedAgeByFilter, setSelectedAgeByFilter] = useState([]);
    const [selectedSingleByFilter, setSelectedSingleByFilter] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterQuery, setFilterQuery] = useState({
        status: "",
        builder_name: "",
        subdivision_name: "",
        name: "",
        sqft: "",
        stories: "",
        bedroom: "",
        bathroom: "",
        garage: "",
        current_base_price: "",
        product_type: "",
        area: "",
        masterplan_id: "",
        zipcode: "",
        lotwidth:"",
        lotsize: "",
        age: "",
        single: "",
        current_price_per_sqft: "",
        price_changes_since_open: "",
        price_changes_last_12_Month: "",
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

    const HandleFilterForm = (e) => {
        e.preventDefault();
        navigate("/productlist", {
            state: {
                searchQueryByFilter: searchQuery.replace(/^"",|,""$/g, ''),
                selectedStatusByFilter,
                selectedBuilderNameByFilter,
                selectedSubdivisionNameByFilter,
                nameByFilter: filterQuery.name,
                sqftByFilter: filterQuery.sqft,
                storiesByFilter: filterQuery.stories,
                bedroomByFilter: filterQuery.bedroom,
                bathroomByFilter: filterQuery.bathroom,
                garageByFilter: filterQuery.garage,
                current_base_priceByFilter: filterQuery.current_base_price,
                product_typeByFilter: filterQuery.product_type,
                areaByFilter: filterQuery.area,
                masterplan_idByFilter: filterQuery.masterplan_id,
                zipcodeByFilter: filterQuery.zipcode,
                lotwidthByFilter: filterQuery.lotwidth,
                lotsizeByFilter: filterQuery.lotsize,
                selectedAgeByFilter,
                selectedSingleByFilter
            }
        });
    };


    const handleSelectStatusChange = (selectedItems) => {
        const selectedNames = selectedItems.map(item => item.value).join(', ');
        setSelectedStatusByFilter(selectedItems);
        setFilterQuery(prevState => ({
            ...prevState,
            status: selectedNames
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

    const HandleFilter = (e) => {
        const { name, value } = e.target;
        setFilterQuery((prevFilterQuery) => ({
            ...prevFilterQuery,
            [name]: value,
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

    const statusOptions = [
        { value: "1", label: "Active" },
        { value: "0", label: "Sold Out" },
        { value: "2", label: "Future" }
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
            status: "",
            builder_name: "",
            subdivision_name: "",
            name: "",
            sqft: "",
            stories: "",
            bedroom: "",
            bathroom: "",
            garage: "",
            current_base_price: "",
            product_type: "",
            area: "",
            masterplan_id: "",
            zipcode: "",
            lotwidth:"",
            lotsize: "",
            age: "",
            single: "",
            current_price_per_sqft: "",
            price_changes_since_open: "",
            price_changes_last_12_Month: "",
        });
        setSelectedStatusByFilter([]);
        setSelectedBuilderNameByFilter([]);
        setSelectedSubdivisionNameByFilter([]);
        setSelectedAgeByFilter([]);
        setSelectedSingleByFilter([]);
    };

    return (
        <div className="container mt-5">
            <h2>Filter Base Price</h2>
            <form onSubmit={HandleFilterForm}>
                <div className="row">
                    <div className="col-md-3 mt-3">
                        <label className="form-label">PLAN STATUS:{" "}</label>
                        <MultiSelect
                            name="status"
                            options={statusOptions}
                            value={selectedStatusByFilter}
                            onChange={handleSelectStatusChange}
                            placeholder={"Select Plan Status"}
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
                        <label className="form-label">CURRENT BASE PRICE:{" "}</label>
                        <input type="text" value={filterQuery.current_base_price} name="current_base_price" className="form-control" onChange={HandleFilter} />
                    </div>
                    <div className="col-md-3 mt-3">
                        <label className="form-label">PRODUCT TYPE:{" "}</label>
                        <input value={filterQuery.product_type} name="product_type" className="form-control" onChange={HandleFilter} />
                    </div>
                    <div className="col-md-3 mt-3">
                        <label className="form-label">AREA:{" "}</label>
                        <input value={filterQuery.area} name="area" className="form-control" onChange={HandleFilter} />
                    </div>
                    <div className="col-md-3 mt-3 ">
                        <label className="form-label">MASTER PLAN:{" "}</label>
                        <input value={filterQuery.masterplan_id} name="masterplan_id" className="form-control" onChange={HandleFilter} />
                    </div>
                    <div className="col-md-3 mt-3 mb-3">
                        <label className="form-label">ZIP CODE:{" "}</label>
                        <input value={filterQuery.zipcode} name="zipcode" className="form-control" onChange={HandleFilter} />
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
    )
}

export default FilterProducts
