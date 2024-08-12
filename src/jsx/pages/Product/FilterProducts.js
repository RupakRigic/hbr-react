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
        status: localStorage.getItem("product_status") ? JSON.parse(localStorage.getItem("product_status")) : "",
        builder_name: localStorage.getItem("builder_name") ? JSON.parse(localStorage.getItem("builder_name")) : "",
        subdivision_name: localStorage.getItem("subdivision_name") ? JSON.parse(localStorage.getItem("subdivision_name")) : "",
        name: localStorage.getItem("product_name") ? JSON.parse(localStorage.getItem("product_name")) : "",
        sqft: localStorage.getItem("sqft") ? JSON.parse(localStorage.getItem("sqft")) : "",
        stories: localStorage.getItem("stories") ? JSON.parse(localStorage.getItem("stories")) : "",
        bedroom: localStorage.getItem("bedroom") ? JSON.parse(localStorage.getItem("bedroom")) : "",
        bathroom: localStorage.getItem("bathroom") ? JSON.parse(localStorage.getItem("bathroom")) : "",
        garage: localStorage.getItem("garage") ? JSON.parse(localStorage.getItem("garage")) : "",
        current_base_price: localStorage.getItem("current_base_price") ? JSON.parse(localStorage.getItem("current_base_price")) : "",
        product_type: localStorage.getItem("product_type") ? JSON.parse(localStorage.getItem("product_type")) : "",
        area: localStorage.getItem("area") ? JSON.parse(localStorage.getItem("area")) : "",
        masterplan_id: localStorage.getItem("masterplan_id") ? JSON.parse(localStorage.getItem("masterplan_id")) : "",
        zipcode: localStorage.getItem("zipcode") ? JSON.parse(localStorage.getItem("zipcode")) : "",
        lotwidth: localStorage.getItem("lotwidth") ? JSON.parse(localStorage.getItem("lotwidth")) : "",
        lotsize: localStorage.getItem("lotsize") ? JSON.parse(localStorage.getItem("lotsize")) : "",
        age: localStorage.getItem("age") ? JSON.parse(localStorage.getItem("age")) : "",
        single: localStorage.getItem("single") ? JSON.parse(localStorage.getItem("single")) : "",
    });

    useEffect(() => {
        if(localStorage.getItem("selectedStatusByProductFilter")) {
            const selectedStatus = JSON.parse(localStorage.getItem("selectedStatusByProductFilter"));
            handleSelectStatusChange(selectedStatus);
        }
        if(localStorage.getItem("selectedBuilderNameByFilter")) {
          const selectedBuilderName = JSON.parse(localStorage.getItem("selectedBuilderNameByFilter"));
          handleSelectBuilderNameChange(selectedBuilderName);
        }
        if(localStorage.getItem("selectedSubdivisionNameByFilter")) {
          const selectedSubdivisionName = JSON.parse(localStorage.getItem("selectedSubdivisionNameByFilter"));
          handleSelectSubdivisionNameChange(selectedSubdivisionName);
        }
        if(localStorage.getItem("selectedAgeByFilter")) {
            const selectedAge = JSON.parse(localStorage.getItem("selectedAgeByFilter"));
            handleSelectAgeChange(selectedAge);
        }
        if(localStorage.getItem("selectedSingleByFilter")) {
            const selectedSingle = JSON.parse(localStorage.getItem("selectedSingleByFilter"));
            handleSelectSingleChange(selectedSingle);
        }
    }, []);

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

    useEffect(() => {
        if(localStorage.getItem("firstTime") == "false") {
            if((searchQuery == "") || (searchQuery == "&status=&builder_name=&subdivision_name=&name=&sqft=&stories=&bedroom=&bathroom=&garage=&current_base_price=&product_type=&area=&masterplan_id=&zipcode=&lotwidth=&lotsize=&age=&single=")){
                return;
            } else {
                navigate("/productlist");
                localStorage.setItem("selectedStatusByProductFilter", JSON.stringify(selectedStatusByFilter));
                localStorage.setItem("selectedBuilderNameByFilter", JSON.stringify(selectedBuilderNameByFilter));
                localStorage.setItem("selectedSubdivisionNameByFilter", JSON.stringify(selectedSubdivisionNameByFilter));
                localStorage.setItem("selectedAgeByFilter", JSON.stringify(selectedAgeByFilter));
                localStorage.setItem("selectedSingleByFilter", JSON.stringify(selectedSingleByFilter));
                localStorage.setItem("product_status", JSON.stringify(filterQuery.status));
                localStorage.setItem("builder_name", JSON.stringify(filterQuery.builder_name));
                localStorage.setItem("subdivision_name", JSON.stringify(filterQuery.subdivision_name));
                localStorage.setItem("product_name", JSON.stringify(filterQuery.name));
                localStorage.setItem("sqft", JSON.stringify(filterQuery.sqft));
                localStorage.setItem("stories", JSON.stringify(filterQuery.stories));
                localStorage.setItem("bedroom", JSON.stringify(filterQuery.bedroom));
                localStorage.setItem("bathroom", JSON.stringify(filterQuery.bathroom));
                localStorage.setItem("garage", JSON.stringify(filterQuery.garage));
                localStorage.setItem("current_base_price", JSON.stringify(filterQuery.current_base_price));
                localStorage.setItem("product_type", JSON.stringify(filterQuery.product_type));
                localStorage.setItem("area", JSON.stringify(filterQuery.area));
                localStorage.setItem("masterplan_id", JSON.stringify(filterQuery.masterplan_id));
                localStorage.setItem("zipcode", JSON.stringify(filterQuery.zipcode));
                localStorage.setItem("lotwidth", JSON.stringify(filterQuery.lotwidth));
                localStorage.setItem("lotsize", JSON.stringify(filterQuery.lotsize));
                localStorage.setItem("age", JSON.stringify(filterQuery.age));
                localStorage.setItem("single", JSON.stringify(filterQuery.single));
                localStorage.setItem("searchQueryByProductFilter", JSON.stringify(searchQuery.replace(/^"",|,""$/g, '')));
            }
        }
        
    }, [searchQuery]);

    const HandleFilterForm = (e) => {
        e.preventDefault();
        navigate("/productlist");
        localStorage.setItem("selectedStatusByProductFilter", JSON.stringify(selectedStatusByFilter));
        localStorage.setItem("selectedBuilderNameByFilter", JSON.stringify(selectedBuilderNameByFilter));
        localStorage.setItem("selectedSubdivisionNameByFilter", JSON.stringify(selectedSubdivisionNameByFilter));
        localStorage.setItem("selectedAgeByFilter", JSON.stringify(selectedAgeByFilter));
        localStorage.setItem("selectedSingleByFilter", JSON.stringify(selectedSingleByFilter));
        localStorage.setItem("product_status", JSON.stringify(filterQuery.status));
        localStorage.setItem("builder_name", JSON.stringify(filterQuery.builder_name));
        localStorage.setItem("subdivision_name", JSON.stringify(filterQuery.subdivision_name));
        localStorage.setItem("product_name", JSON.stringify(filterQuery.name));
        localStorage.setItem("sqft", JSON.stringify(filterQuery.sqft));
        localStorage.setItem("stories", JSON.stringify(filterQuery.stories));
        localStorage.setItem("bedroom", JSON.stringify(filterQuery.bedroom));
        localStorage.setItem("bathroom", JSON.stringify(filterQuery.bathroom));
        localStorage.setItem("garage", JSON.stringify(filterQuery.garage));
        localStorage.setItem("current_base_price", JSON.stringify(filterQuery.current_base_price));
        localStorage.setItem("product_type", JSON.stringify(filterQuery.product_type));
        localStorage.setItem("area", JSON.stringify(filterQuery.area));
        localStorage.setItem("masterplan_id", JSON.stringify(filterQuery.masterplan_id));
        localStorage.setItem("zipcode", JSON.stringify(filterQuery.zipcode));
        localStorage.setItem("lotwidth", JSON.stringify(filterQuery.lotwidth));
        localStorage.setItem("lotsize", JSON.stringify(filterQuery.lotsize));
        localStorage.setItem("age", JSON.stringify(filterQuery.age));
        localStorage.setItem("single", JSON.stringify(filterQuery.single));
        localStorage.setItem("searchQueryByProductFilter", JSON.stringify(searchQuery.replace(/^"",|,""$/g, '')));
        localStorage.setItem("firstTime", false);
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
            single: ""
        });
        setSelectedStatusByFilter([]);
        setSelectedBuilderNameByFilter([]);
        setSelectedSubdivisionNameByFilter([]);
        setSelectedAgeByFilter([]);
        setSelectedSingleByFilter([]);
    };

    return (
        <div className="container mt-5">
            <h2>Filter Products</h2>
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
