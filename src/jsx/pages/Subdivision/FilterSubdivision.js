import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Form } from "react-bootstrap";
import { MultiSelect } from 'react-multi-select-component';
import DatePicker from "react-datepicker";
import AdminBuilderService from '../../../API/Services/AdminService/AdminBuilderService';
import { useNavigate } from 'react-router-dom';

const FilterSubdivision = () => {
    const navigate = useNavigate();
    const [selectedStatusByFilter, setSelectedStatusByFilter] = useState([]);
    const [selectedReportingByFilter, setSelectedReportingByFilter] = useState([]);
    const [builderListDropDown, setBuilderListDropDown] = useState([]);
    const [selectedBuilderNameByFilter, setSelectedBuilderNameByFilter] = useState([]);
    const [productTypeStatusByFilter, setProductTypeStatusByFilter] = useState([]);
    const [selectedAreaByFilter, setSelectedAreaByFilter] = useState([]);
    const [selectedMasterPlanByFilter, setSelectedMasterPlanByFilter] = useState([]);
    const [seletctedZipcodeByFilter, setSelectedZipcodeByFilter] = useState([]);
    const [selectedAgeByFilter, setSelectedAgeByFilter] = useState([]);
    const [selectedSingleByFilter, setSelectedSingleByFilter] = useState([]);
    const [selectedGatedByFilter, setSelectedGatedByFilter] = useState([]);
    const [selectedJurisdicitionByFilter, setSelectedJurisdictionByFilter] = useState([]);
    const [seletctedGasProviderByFilter, setSelectedGasProviderByFilter] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterQuery, setFilterQuery] = useState({
        status: "",
        reporting: "",
        name: "",
        builder_name: "",
        product_type: "",
        area: "",
        masterplan_id: "",
        zipcode: "",
        lotwidth: "",
        lotsize: "",
        age: "",
        single: "",
        gated: "",
        juridiction: "",
        gasprovider: "",
        from: "",
        to: "",
    });

    useEffect(() => {
        if (localStorage.getItem("usertoken")) {
            GetBuilderDropDownList();
        } else {
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
            console.log(error);
            if (error.name === "HTTPError") {
                const errorJson = await error.response.json();
            }
        }
    };

    const HandleFilterForm = (e) => {
        e.preventDefault();
        navigate("/subdivisionlist", {
            state: {
                searchQueryByFilter: searchQuery.replace(/^"",|,""$/g, ''),
                selectedStatusByFilter,
                selectedReportingByFilter,
                name: filterQuery.name,
                selectedBuilderNameByFilter,
                productTypeStatusByFilter,
                selectedAreaByFilter,
                selectedMasterPlanByFilter,
                seletctedZipcodeByFilter,
                lotwidth: filterQuery.lotwidth,
                lotsize: filterQuery.lotsize,
                selectedAgeByFilter,
                selectedSingleByFilter,
                selectedGatedByFilter,
                selectedJurisdicitionByFilter,
                seletctedGasProviderByFilter,
                from: filterQuery.from ? parseDate(filterQuery.from) : null,
                to: filterQuery.to ? parseDate(filterQuery.to) : null
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
    }

    const handleSelectReportingChange = (selectedItems) => {
        const selectedNames = selectedItems.map(item => item.value).join(', ');
        setSelectedReportingByFilter(selectedItems);
        setFilterQuery(prevState => ({
            ...prevState,
            reporting: selectedNames
        }));
    }

    const handleSelectBuilderNameChange = (selectedItems) => {
        const selectedNames = selectedItems.map(item => item.label).join(', ');
        setSelectedBuilderNameByFilter(selectedItems);
        setFilterQuery(prevState => ({
            ...prevState,
            builder_name: selectedNames
        }));
    }

    const handleSelectProductTypeChange = (selectedItems) => {
        const selectedNames = selectedItems.map(item => item.value).join(', ');
        setProductTypeStatusByFilter(selectedItems);
        setFilterQuery(prevState => ({
            ...prevState,
            product_type: selectedNames
        }));
    }

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

    const handleSelectZipcodeChange = (selectedItems) => {
        const selectedValues = selectedItems.map(item => item.value).join(', ');
        setSelectedZipcodeByFilter(selectedItems);
        setFilterQuery(prevState => ({
            ...prevState,
            zipcode: selectedValues
        }));
    };

    const handleSelectAgeChange = (selectedItems) => {
        const selectedNames = selectedItems.map(item => item.value).join(', ');
        setSelectedAgeByFilter(selectedItems);
        setFilterQuery(prevState => ({
            ...prevState,
            age: selectedNames
        }));
    }

    const handleSelectSingleChange = (selectedItems) => {
        const selectedNames = selectedItems.map(item => item.value).join(', ');
        setSelectedSingleByFilter(selectedItems);
        setFilterQuery(prevState => ({
            ...prevState,
            age: selectedNames
        }));
    }

    const handleSelectGatedChange = (selectedItems) => {
        const selectedNames = selectedItems.map(item => item.value).join(', ');
        setSelectedGatedByFilter(selectedItems);
        setFilterQuery(prevState => ({
            ...prevState,
            gated: selectedNames
        }));
    }

    const handleSelectJurisdictionChange = (selectedItems) => {
        const selectedValues = selectedItems.map(item => item.value).join(', ');
        setSelectedJurisdictionByFilter(selectedItems);
        setFilterQuery(prevState => ({
            ...prevState,
            juridiction: selectedValues
        }));
    };

    const handleGasProviderChange = (selectedItems) => {
        const selectedValues = selectedItems.map(item => item.value).join(', ');
        setSelectedGasProviderByFilter(selectedItems);
        setFilterQuery(prevState => ({
            ...prevState,
            gasprovider: selectedValues
        }));
    };

    const HandleFilter = (e) => {
        const { name, value } = e.target;
        setFilterQuery((prevFilterQuery) => ({
            ...prevFilterQuery,
            [name]: value,
        }));
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

    const HandleCancelFilter = (e) => {
        setFilterQuery({
            status: "",
            reporting: "",
            name: "",
            builder_name: "",
            product_type: "",
            area: "",
            masterplan_id: "",
            zipcode: "",
            lotwidth: "",
            lotsize: "",
            age: "",
            single: "",
            gated: "",
            juridiction: "",
            gasprovider: "",
            from: "",
            to: "",
        });
    };

    const statusOptions = [
        { value: "1", label: "Active" },
        { value: "0", label: "Sold Out" },
        { value: "2", label: "Future" }
    ];

    const reportingOptions = [
        { value: "1", label: "Yes" },
        { value: "0", label: "No" }
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

    const zipCodeOption = [
        { value: "89002", label: "89002" },
        { value: "89005", label: "89005" },
        { value: "89011", label: "89011" },
        { value: "89012", label: "89012" },
        { value: "89014", label: "89014" },
        { value: "89015", label: "89015" },
        { value: "89018", label: "89018" },
        { value: "89021", label: "89021" },
        { value: "89027", label: "89027" },
        { value: "89029", label: "89029" },
        { value: "89030", label: "89030" },
        { value: "89031", label: "89031" },
        { value: "89032", label: "89032" },
        { value: "89044", label: "89044" },
        { value: "89044", label: "89044" },
        { value: "89052", label: "89052" },
        { value: "89055", label: "89055" },
        { value: "89060", label: "89060" },
        { value: "89061", label: "89061" },
        { value: "89074", label: "89074" },
        { value: "89081", label: "89081" },
        { value: "89084", label: "89084" },
        { value: "89085", label: "89085" },
        { value: "89086", label: "89086" },
    ];

    const ageOptions = [
        { value: "1", label: "Yes" },
        { value: "0", label: "No" }
    ];

    const singleOptions = [
        { value: "1", label: "Yes" },
        { value: "0", label: "No" }
    ];

    const gatedOptions = [
        { value: "1", label: "Yes" },
        { value: "0", label: "No" }
    ];

    const jurisdictionOption = [
        { value: "Boulder City", label: "Boulder City" },
        { value: "CLV", label: "CLV" },
        { value: "CC Enterprise", label: "CC Enterprise" },
        { value: "CC Indian Springs", label: "CC Indian Springs" },
        { value: "CC Laughlin", label: "CC Laughlin" },
        { value: "Lone Mtn", label: "Lone Mtn" },
        { value: "Lower Kyle Canyon", label: "Lower Kyle Canyon" },
        { value: "CC Moapa Valley", label: "CC Moapa Valley" },
        { value: "CC Mt Charleston", label: "CC Mt Charleston" },
        { value: "CC Mtn Springs", label: "CC Mtn Springs" },
        { value: "CC Paradise", label: "CC Paradise" },
        { value: "CC Searchlight", label: "CC Searchlight" },
        { value: "CC Spring Valley", label: "CC Spring Valley" },
        { value: "CC Summerlin South", label: "CC Summerlin South" },
        { value: "CC Sunrise Manor", label: "CC Sunrise Manor" },
        { value: "CC Whiteney", label: "CC Whiteney" },
        { value: "CC Winchester", label: "CC Winchester" },
        { value: "CC Unincorporated", label: "CC Unincorporated" },
        { value: "Henderson", label: "Henderson" },
        { value: "Mesquite", label: "Mesquite" },
        { value: "NLV", label: "NLV" },
        { value: "NYE", label: "NYE" },
    ];

    const gasProviderOption = [
        { value: "SOUTHWEST GAS", label: "SOUTHWEST GAS" },
    ];

    return (
        <div className="container mt-5">
            <h2>Filter Subdivision</h2>
            <form onSubmit={HandleFilterForm}>
                <div className="row">
                    <div className="col-md-3 mt-3">
                        <label className="form-label">
                            STATUS:{" "}
                            <span className="text-danger"></span>
                        </label>
                        <MultiSelect
                            name="status"
                            options={statusOptions}
                            value={selectedStatusByFilter}
                            onChange={handleSelectStatusChange}
                            placeholder={"Select Status"}
                        />
                    </div>
                    <div className="col-md-3 mt-3">
                        <label className="form-label">
                            REPORTING:{" "}
                            <span className="text-danger"></span>
                        </label>
                        <MultiSelect
                            name="reporting"
                            options={reportingOptions}
                            value={selectedReportingByFilter}
                            onChange={handleSelectReportingChange}
                            placeholder={"Select Reporting"}
                        />
                    </div>
                    <div className="col-md-3 mt-3">
                        <label className="form-label">
                            NAME :{" "}
                            <span className="text-danger"></span>
                        </label>
                        <input value={filterQuery.name} name="name" className="form-control" onChange={HandleFilter} />
                    </div>
                    <div className="col-md-3 mt-3">
                        <label className="form-label">
                            BUILDER NAME :{" "}
                            <span className="text-danger"></span>
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
                        <label htmlFor="exampleFormControlInput6" className="form-label"> Product Type:<span className="text-danger"></span></label>
                        <MultiSelect
                            name="product_type"
                            options={productTypeOptions}
                            value={productTypeStatusByFilter}
                            onChange={handleSelectProductTypeChange}
                            placeholder="Select Status"
                        />
                    </div>
                    <div className="col-md-3 mt-3">
                        <label className="form-label">
                            AREA:{" "}
                            <span className="text-danger"></span>
                        </label>
                        <MultiSelect
                            name="area"
                            options={areaOption}
                            value={selectedAreaByFilter}
                            onChange={handleSelectAreaChange}
                            placeholder="Select Area"
                        />
                    </div>
                    <div className="col-md-3 mt-3">
                        <label className="form-label">
                            MASTER PLAN:{" "}
                            <span className="text-danger"></span>
                        </label>
                        <MultiSelect
                            name="masterplan_id"
                            options={masterPlanOption}
                            value={selectedMasterPlanByFilter}
                            onChange={handleSelectMasterPlanChange}
                            placeholder="Select Area"
                        />
                    </div>
                    <div className="col-md-3 mt-3">
                        <label className="form-label">
                            ZIP CODE:{" "}
                            <span className="text-danger"></span>
                        </label>
                        <MultiSelect
                            name="zipcode"
                            options={zipCodeOption}
                            value={seletctedZipcodeByFilter}
                            onChange={handleSelectZipcodeChange}
                            placeholder="Select Zipcode"
                        />
                    </div>
                    <div className="col-md-3 mt-3">
                        <label className="form-label">
                            LOT WIDTH:{" "}
                            <span className="text-danger"></span>
                        </label>
                        <input type="text" name="lotwidth" value={filterQuery.lotwidth} className="form-control" onChange={HandleFilter} />
                    </div>
                    <div className="col-md-3 mt-3">
                        <label className="form-label">
                            LOT SIZE:{" "}
                            <span className="text-danger"></span>
                        </label>
                        <input type="text" value={filterQuery.lotsize} name="lotsize" className="form-control" onChange={HandleFilter} />
                    </div>
                    <div className="col-md-3 mt-3">
                        <label htmlFor="exampleFormControlInput8" className="form-label">AGE RESTRICTED:{" "}</label>
                        <MultiSelect
                            name="age"
                            options={ageOptions}
                            value={selectedAgeByFilter}
                            onChange={handleSelectAgeChange}
                            placeholder={"Select Age"}
                        />
                    </div>
                    <div className="col-md-3 mt-3 ">
                        <label htmlFor="exampleFormControlInput8" className="form-label">All SINGLE STORY:{" "}</label>
                        <MultiSelect
                            name="single"
                            options={singleOptions}
                            value={selectedSingleByFilter}
                            onChange={handleSelectSingleChange}
                            placeholder={"Select Single"}
                        />
                    </div>
                    <div className="col-md-3 mt-3 mb-3">
                        <label htmlFor="exampleFormControlInput28" className="form-label">GATED:{" "}</label>
                        <MultiSelect
                            name="gated"
                            options={gatedOptions}
                            value={selectedGatedByFilter}
                            onChange={handleSelectGatedChange}
                            placeholder={"Select Gated"}
                        />
                    </div>
                    <div className="col-md-3 mt-3 mb-3">
                        <label className="form-label">
                            JURISDICTION:{" "}
                        </label>
                        <MultiSelect
                            name="juridiction"
                            options={jurisdictionOption}
                            value={selectedJurisdicitionByFilter}
                            onChange={handleSelectJurisdictionChange}
                            placeholder="Select Juridiction"
                        />
                    </div>
                    <div className="col-md-3 mt-3 mb-3">
                        <label className="form-label">
                            GAS PROVIDER:{" "}
                            <span className="text-danger"></span>
                        </label>
                        <MultiSelect
                            name="gasprovider"
                            options={gasProviderOption}
                            value={seletctedGasProviderByFilter}
                            onChange={handleGasProviderChange}
                            placeholder="Select Gas Provider"
                        />
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
                </div>
                <div className="row mt-4">
                    <div className="col-md-6">
                        <Button
                            className="btn-sm"
                            onClick={HandleCancelFilter}
                            variant="secondary"
                        >
                            Reset
                        </Button>
                    </div>
                    <div className="col-md-6 d-flex justify-content-end">
                        <Button
                            className="btn-sm"
                            type="submit"
                            variant="primary"
                            onClick={HandleFilterForm}
                        >
                            Filter
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default FilterSubdivision;