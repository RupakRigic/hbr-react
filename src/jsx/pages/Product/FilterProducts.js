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
        status: localStorage.getItem("product_status_Product") ? JSON.parse(localStorage.getItem("product_status_Product")) : "",
        builder_name: localStorage.getItem("builder_name_Product") ? JSON.parse(localStorage.getItem("builder_name_Product")) : "",
        subdivision_name: localStorage.getItem("subdivision_name_Product") ? JSON.parse(localStorage.getItem("subdivision_name_Product")) : "",
        name: localStorage.getItem("product_name_Product") ? JSON.parse(localStorage.getItem("product_name_Product")) : "",
        sqft: localStorage.getItem("sqft_Product") ? JSON.parse(localStorage.getItem("sqft_Product")) : "",
        stories: localStorage.getItem("stories_Product") ? JSON.parse(localStorage.getItem("stories_Product")) : "",
        bedroom: localStorage.getItem("bedroom_Product") ? JSON.parse(localStorage.getItem("bedroom_Product")) : "",
        bathroom: localStorage.getItem("bathroom_Product") ? JSON.parse(localStorage.getItem("bathroom_Product")) : "",
        garage: localStorage.getItem("garage_Product") ? JSON.parse(localStorage.getItem("garage_Product")) : "",
        current_base_price: localStorage.getItem("current_base_price_Product") ? JSON.parse(localStorage.getItem("current_base_price_Product")) : "",
        product_type: localStorage.getItem("product_type_Product") ? JSON.parse(localStorage.getItem("product_type_Product")) : "",
        area: localStorage.getItem("area_Product") ? JSON.parse(localStorage.getItem("area_Product")) : "",
        masterplan_id: localStorage.getItem("masterplan_id_Product") ? JSON.parse(localStorage.getItem("masterplan_id_Product")) : "",
        zipcode: localStorage.getItem("zipcode_Product") ? JSON.parse(localStorage.getItem("zipcode_Product")) : "",
        lotwidth: localStorage.getItem("lotwidth_Product") ? JSON.parse(localStorage.getItem("lotwidth_Product")) : "",
        lotsize: localStorage.getItem("lotsize_Product") ? JSON.parse(localStorage.getItem("lotsize_Product")) : "",
        age: localStorage.getItem("age_Product") ? JSON.parse(localStorage.getItem("age_Product")) : "",
        single: localStorage.getItem("single_Product") ? JSON.parse(localStorage.getItem("single_Product")) : "",
    });

    useEffect(() => {
        if(localStorage.getItem("selectedStatusByProductFilter_Product")) {
            const selectedStatus = JSON.parse(localStorage.getItem("selectedStatusByProductFilter_Product"));
            handleSelectStatusChange(selectedStatus);
        }
        if(localStorage.getItem("selectedBuilderNameByFilter_Product")) {
          const selectedBuilderName = JSON.parse(localStorage.getItem("selectedBuilderNameByFilter_Product"));
          handleSelectBuilderNameChange(selectedBuilderName);
        }
        if(localStorage.getItem("selectedSubdivisionNameByFilter_Product")) {
          const selectedSubdivisionName = JSON.parse(localStorage.getItem("selectedSubdivisionNameByFilter_Product"));
          handleSelectSubdivisionNameChange(selectedSubdivisionName);
        }
        if(localStorage.getItem("selectedAgeByFilter_Product")) {
            const selectedAge = JSON.parse(localStorage.getItem("selectedAgeByFilter_Product"));
            handleSelectAgeChange(selectedAge);
        }
        if(localStorage.getItem("selectedSingleByFilter_Product")) {
            const selectedSingle = JSON.parse(localStorage.getItem("selectedSingleByFilter_Product"));
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
        if(localStorage.getItem("setProductFilter") == "true") {
            if((searchQuery == "") || (searchQuery == "&status=&builder_name=&subdivision_name=&name=&sqft=&stories=&bedroom=&bathroom=&garage=&current_base_price=&product_type=&area=&masterplan_id=&zipcode=&lotwidth=&lotsize=&age=&single=")){
                return;
            } else {
                navigate("/productlist");
                localStorage.setItem("selectedStatusByProductFilter_Product", JSON.stringify(selectedStatusByFilter));
                localStorage.setItem("selectedBuilderNameByFilter_Product", JSON.stringify(selectedBuilderNameByFilter));
                localStorage.setItem("selectedSubdivisionNameByFilter_Product", JSON.stringify(selectedSubdivisionNameByFilter));
                localStorage.setItem("selectedAgeByFilter_Product", JSON.stringify(selectedAgeByFilter));
                localStorage.setItem("selectedSingleByFilter_Product", JSON.stringify(selectedSingleByFilter));
                localStorage.setItem("product_status_Product", JSON.stringify(filterQuery.status));
                localStorage.setItem("builder_name_Product", JSON.stringify(filterQuery.builder_name));
                localStorage.setItem("subdivision_name_Product", JSON.stringify(filterQuery.subdivision_name));
                localStorage.setItem("product_name_Product", JSON.stringify(filterQuery.name));
                localStorage.setItem("sqft_Product", JSON.stringify(filterQuery.sqft));
                localStorage.setItem("stories_Product", JSON.stringify(filterQuery.stories));
                localStorage.setItem("bedroom_Product", JSON.stringify(filterQuery.bedroom));
                localStorage.setItem("bathroom_Product", JSON.stringify(filterQuery.bathroom));
                localStorage.setItem("garage_Product", JSON.stringify(filterQuery.garage));
                localStorage.setItem("current_base_price_Product", JSON.stringify(filterQuery.current_base_price));
                localStorage.setItem("product_type_Product", JSON.stringify(filterQuery.product_type));
                localStorage.setItem("area_Product", JSON.stringify(filterQuery.area));
                localStorage.setItem("masterplan_id_Product", JSON.stringify(filterQuery.masterplan_id));
                localStorage.setItem("zipcode_Product", JSON.stringify(filterQuery.zipcode));
                localStorage.setItem("lotwidth_Product", JSON.stringify(filterQuery.lotwidth));
                localStorage.setItem("lotsize_Product", JSON.stringify(filterQuery.lotsize));
                localStorage.setItem("age_Product", JSON.stringify(filterQuery.age));
                localStorage.setItem("single_Product", JSON.stringify(filterQuery.single));
                localStorage.setItem("searchQueryByProductFilter_Product", JSON.stringify(searchQuery.replace(/^"",|,""$/g, '')));
            }
        }
        
    }, [searchQuery]);

    const HandleFilterForm = (e) => {
        e.preventDefault();
        navigate("/productlist");
        localStorage.setItem("selectedStatusByProductFilter_Product", JSON.stringify(selectedStatusByFilter));
        localStorage.setItem("selectedBuilderNameByFilter_Product", JSON.stringify(selectedBuilderNameByFilter));
        localStorage.setItem("selectedSubdivisionNameByFilter_Product", JSON.stringify(selectedSubdivisionNameByFilter));
        localStorage.setItem("selectedAgeByFilter_Product", JSON.stringify(selectedAgeByFilter));
        localStorage.setItem("selectedSingleByFilter_Product", JSON.stringify(selectedSingleByFilter));
        localStorage.setItem("product_status_Product", JSON.stringify(filterQuery.status));
        localStorage.setItem("builder_name_Product", JSON.stringify(filterQuery.builder_name));
        localStorage.setItem("subdivision_name_Product", JSON.stringify(filterQuery.subdivision_name));
        localStorage.setItem("product_name_Product", JSON.stringify(filterQuery.name));
        localStorage.setItem("sqft_Product", JSON.stringify(filterQuery.sqft));
        localStorage.setItem("stories_Product", JSON.stringify(filterQuery.stories));
        localStorage.setItem("bedroom_Product", JSON.stringify(filterQuery.bedroom));
        localStorage.setItem("bathroom_Product", JSON.stringify(filterQuery.bathroom));
        localStorage.setItem("garage_Product", JSON.stringify(filterQuery.garage));
        localStorage.setItem("current_base_price_Product", JSON.stringify(filterQuery.current_base_price));
        localStorage.setItem("product_type_Product", JSON.stringify(filterQuery.product_type));
        localStorage.setItem("area_Product", JSON.stringify(filterQuery.area));
        localStorage.setItem("masterplan_id_Product", JSON.stringify(filterQuery.masterplan_id));
        localStorage.setItem("zipcode_Product", JSON.stringify(filterQuery.zipcode));
        localStorage.setItem("lotwidth_Product", JSON.stringify(filterQuery.lotwidth));
        localStorage.setItem("lotsize_Product", JSON.stringify(filterQuery.lotsize));
        localStorage.setItem("age_Product", JSON.stringify(filterQuery.age));
        localStorage.setItem("single_Product", JSON.stringify(filterQuery.single));
        localStorage.setItem("searchQueryByProductFilter_Product", JSON.stringify(searchQuery.replace(/^"",|,""$/g, '')));
        localStorage.setItem("setProductFilter", true);
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
        { value: "2", label: "Future" },
        { value: "3", label: "Closed" }
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
    )
}

export default FilterProducts
