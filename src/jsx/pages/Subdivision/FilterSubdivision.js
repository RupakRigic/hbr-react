import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Form } from "react-bootstrap";
import { MultiSelect } from 'react-multi-select-component';
import DatePicker from "react-datepicker";
import AdminBuilderService from '../../../API/Services/AdminService/AdminBuilderService';
import { useNavigate } from 'react-router-dom';
import AdminSubdevisionService from '../../../API/Services/AdminService/AdminSubdevisionService';
import Modal from "react-bootstrap/Modal";

const FilterSubdivision = () => {
    const navigate = useNavigate();
    const [selectedStatusByFilter, setSelectedStatusByFilter] = useState([]);
    const [selectedReportingByFilter, setSelectedReportingByFilter] = useState([]);
    const [builderListDropDown, setBuilderListDropDown] = useState([]);
    const [zipCodeDropDown, setZipCodeDropDown] = useState([]);
    const [subdivisionListDropDown, setSubdivisionListDropDown] = useState([]);
    const [selectedBuilderNameByFilter, setSelectedBuilderNameByFilter] = useState([]);
    const [selectedBuilderIDByFilter, setSelectedBuilderIDByFilter] = useState([]);
    const [selectedSubdivisionNameByFilter, setSelectedSubdivisionNameByFilter] = useState([]);
    const [productTypeStatusByFilter, setProductTypeStatusByFilter] = useState([]);
    const [selectedAreaByFilter, setSelectedAreaByFilter] = useState([]);
    const [selectedZipCodeByFilter, setSelectedZipCodeByFilter] = useState([]);
    const [selectedMasterPlanByFilter, setSelectedMasterPlanByFilter] = useState([]);
    const [selectedAgeByFilter, setSelectedAgeByFilter] = useState([]);
    const [selectedSingleByFilter, setSelectedSingleByFilter] = useState([]);
    const [selectedGatedByFilter, setSelectedGatedByFilter] = useState([]);
    const [selectedJurisdicitionByFilter, setSelectedJurisdictionByFilter] = useState([]);
    const [seletctedGasProviderByFilter, setSelectedGasProviderByFilter] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterQuery, setFilterQuery] = useState({
        status: localStorage.getItem("subdivision_status_Subdivision") ? JSON.parse(localStorage.getItem("subdivision_status_Subdivision")) : "",
        reporting: localStorage.getItem("reporting_Subdivision") ? JSON.parse(localStorage.getItem("reporting_Subdivision")) : "",
        name: localStorage.getItem("subdivision_name_Subdivision") ? JSON.parse(localStorage.getItem("subdivision_name_Subdivision")) : "",
        builder_name: localStorage.getItem("builder_name_Subdivision") ? JSON.parse(localStorage.getItem("builder_name_Subdivision")) : "",
        product_type: localStorage.getItem("product_type_Subdivision") ? JSON.parse(localStorage.getItem("product_type_Subdivision")) : "",
        area: localStorage.getItem("area_Subdivision") ? JSON.parse(localStorage.getItem("area_Subdivision")) : "",
        masterplan_id: localStorage.getItem("masterplan_id_Subdivision") ? JSON.parse(localStorage.getItem("masterplan_id_Subdivision")) : "",
        zipcode: localStorage.getItem("zipcode_Subdivision") ? JSON.parse(localStorage.getItem("zipcode_Subdivision")) : "",
        lotwidth: localStorage.getItem("lotwidth_Subdivision") ? JSON.parse(localStorage.getItem("lotwidth_Subdivision")) : "",
        lotsize: localStorage.getItem("lotsize_Subdivision") ? JSON.parse(localStorage.getItem("lotsize_Subdivision")) : "",
        age: localStorage.getItem("age_Subdivision") ? JSON.parse(localStorage.getItem("age_Subdivision")) : "",
        single: localStorage.getItem("single_Subdivision") ? JSON.parse(localStorage.getItem("single_Subdivision")) : "",
        gated: localStorage.getItem("gated_Subdivision") ? JSON.parse(localStorage.getItem("gated_Subdivision")) : "",
        juridiction: localStorage.getItem("juridiction_Subdivision") ? JSON.parse(localStorage.getItem("juridiction_Subdivision")) : "",
        gasprovider: localStorage.getItem("gasprovider_Subdivision") ? JSON.parse(localStorage.getItem("gasprovider_Subdivision")) : "",
        from: localStorage.getItem("from_Subdivision") ? JSON.parse(localStorage.getItem("from_Subdivision")) : "",
        to: localStorage.getItem("to_Subdivision") ? JSON.parse(localStorage.getItem("to_Subdivision")) : "",
    });

    useEffect(() => {
        if (localStorage.getItem("selectedStatusBySubdivisionFilter_Subdivision")) {
            const selectedStatus = JSON.parse(localStorage.getItem("selectedStatusBySubdivisionFilter_Subdivision"));
            handleSelectStatusChange(selectedStatus);
        }
        if (localStorage.getItem("selectedReportingByFilter_Subdivision")) {
            const selectedReporting = JSON.parse(localStorage.getItem("selectedReportingByFilter_Subdivision"));
            handleSelectReportingChange(selectedReporting);
        }
        if (localStorage.getItem("selectedBuilderNameByFilter_Subdivision")) {
            const selectedBuilderName = JSON.parse(localStorage.getItem("selectedBuilderNameByFilter_Subdivision"));
            handleSelectBuilderNameChange(selectedBuilderName);
        }
        if (localStorage.getItem("selectedSubdivisionNameByFilter_Subdivision")) {
            const selectedSubdivisionName = JSON.parse(localStorage.getItem("selectedSubdivisionNameByFilter_Subdivision"));
            handleSelectSubdivisionNameChange(selectedSubdivisionName);
        }
        if (localStorage.getItem("productTypeStatusByFilter_Subdivision")) {
            const productTypeStatus = JSON.parse(localStorage.getItem("productTypeStatusByFilter_Subdivision"));
            handleSelectProductTypeChange(productTypeStatus);
        }
        if (localStorage.getItem("selectedAreaByFilter_Subdivision")) {
            const selectedArea = JSON.parse(localStorage.getItem("selectedAreaByFilter_Subdivision"));
            handleSelectAreaChange(selectedArea);
        }
        if (localStorage.getItem("selectedZipCodeByFilter_Subdivision")) {
            const selectedZipCode = JSON.parse(localStorage.getItem("selectedZipCodeByFilter_Subdivision"));
            handleSelectZipCodeChange(selectedZipCode);
        }
        if (localStorage.getItem("selectedMasterPlanByFilter_Subdivision")) {
            const selectedMasterPlan = JSON.parse(localStorage.getItem("selectedMasterPlanByFilter_Subdivision"));
            handleSelectMasterPlanChange(selectedMasterPlan);
        }
        if (localStorage.getItem("selectedAgeByFilter_Subdivision")) {
            const selectedAge = JSON.parse(localStorage.getItem("selectedAgeByFilter_Subdivision"));
            handleSelectAgeChange(selectedAge);
        }
        if (localStorage.getItem("selectedSingleByFilter_Subdivision")) {
            const selectedSingle = JSON.parse(localStorage.getItem("selectedSingleByFilter_Subdivision"));
            handleSelectSingleChange(selectedSingle);
        }
        if (localStorage.getItem("selectedGatedByFilter_Subdivision")) {
            const selectedGated = JSON.parse(localStorage.getItem("selectedGatedByFilter_Subdivision"));
            handleSelectGatedChange(selectedGated);
        }
        if (localStorage.getItem("selectedJurisdicitionByFilter_Subdivision")) {
            const selectedJurisdicition = JSON.parse(localStorage.getItem("selectedJurisdicitionByFilter_Subdivision"));
            handleSelectJurisdictionChange(selectedJurisdicition);
        }
        if (localStorage.getItem("seletctedGasProviderByFilter_Subdivision")) {
            const seletctedGasProvider = JSON.parse(localStorage.getItem("seletctedGasProviderByFilter_Subdivision"));
            handleGasProviderChange(seletctedGasProvider);
        }
    }, []);

    useEffect(() => {
        if (localStorage.getItem("usertoken")) {
            GetBuilderDropDownList();
            GetZipCodeList();
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
                name: ""
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
            console.log(error);
            if (error.name === "HTTPError") {
                const errorJson = await error.response.json();
                console.log(errorJson);
            }
        }
    };

    const GetZipCodeList = async () => {
        try {
            const responseData = await AdminSubdevisionService.get_zipcode_list().json();
            const formattedData = responseData.data.map((zipcode) => ({
                label: zipcode,
                value: zipcode,
            }));
            setZipCodeDropDown(formattedData);
        } catch (error) {
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

    useEffect(() => {
        if (localStorage.getItem("setSubdivisionFilter") == "true") {
            if ((searchQuery == "") || (searchQuery == "&status=&reporting=&name=&builder_name=&product_type=&area=&masterplan_id=&zipcode=&lotwidth=&lotsize=&age=&single=&gated=&juridiction=&gasprovider=&from=&to=")) {
                return;
            } else {
                navigate("/subdivisionlist");
                localStorage.setItem("selectedStatusBySubdivisionFilter_Subdivision", JSON.stringify(selectedStatusByFilter));
                localStorage.setItem("selectedReportingByFilter_Subdivision", JSON.stringify(selectedReportingByFilter));
                localStorage.setItem("selectedBuilderNameByFilter_Subdivision", JSON.stringify(selectedBuilderNameByFilter));
                localStorage.setItem("selectedSubdivisionNameByFilter_Subdivision", JSON.stringify(selectedSubdivisionNameByFilter));
                localStorage.setItem("productTypeStatusByFilter_Subdivision", JSON.stringify(productTypeStatusByFilter));
                localStorage.setItem("selectedAreaByFilter_Subdivision", JSON.stringify(selectedAreaByFilter));
                localStorage.setItem("selectedZipCodeByFilter_Subdivision", JSON.stringify(selectedZipCodeByFilter));
                localStorage.setItem("selectedMasterPlanByFilter_Subdivision", JSON.stringify(selectedMasterPlanByFilter));
                localStorage.setItem("selectedAgeByFilter_Subdivision", JSON.stringify(selectedAgeByFilter));
                localStorage.setItem("selectedSingleByFilter_Subdivision", JSON.stringify(selectedSingleByFilter));
                localStorage.setItem("selectedGatedByFilter_Subdivision", JSON.stringify(selectedGatedByFilter));
                localStorage.setItem("selectedJurisdicitionByFilter_Subdivision", JSON.stringify(selectedJurisdicitionByFilter));
                localStorage.setItem("seletctedGasProviderByFilter_Subdivision", JSON.stringify(seletctedGasProviderByFilter));
                localStorage.setItem("subdivision_status_Subdivision", JSON.stringify(filterQuery.status));
                localStorage.setItem("reporting_Subdivision", JSON.stringify(filterQuery.reporting));
                localStorage.setItem("subdivision_name_Subdivision", JSON.stringify(filterQuery.name));
                localStorage.setItem("builder_name_Subdivision", JSON.stringify(filterQuery.builder_name));
                localStorage.setItem("product_type_Subdivision", JSON.stringify(filterQuery.product_type));
                localStorage.setItem("area_Subdivision", JSON.stringify(filterQuery.area));
                localStorage.setItem("masterplan_id_Subdivision", JSON.stringify(filterQuery.masterplan_id));
                localStorage.setItem("zipcode_Subdivision", JSON.stringify(filterQuery.zipcode));
                localStorage.setItem("lotwidth_Subdivision", JSON.stringify(filterQuery.lotwidth));
                localStorage.setItem("lotsize_Subdivision", JSON.stringify(filterQuery.lotsize));
                localStorage.setItem("age_Subdivision", JSON.stringify(filterQuery.age));
                localStorage.setItem("single_Subdivision", JSON.stringify(filterQuery.single));
                localStorage.setItem("gated_Subdivision", JSON.stringify(filterQuery.gated));
                localStorage.setItem("juridiction_Subdivision", JSON.stringify(filterQuery.juridiction));
                localStorage.setItem("gasprovider_Subdivision", JSON.stringify(filterQuery.gasprovider));
                localStorage.setItem("from_Subdivision", JSON.stringify(filterQuery.from));
                localStorage.setItem("to_Subdivision", JSON.stringify(filterQuery.to));
                localStorage.setItem("searchQueryBySubdivisionFilter_Subdivision", JSON.stringify(searchQuery.replace(/^"",|,""$/g, '')));
            }
        }

    }, [searchQuery]);
  const [message, setMessage] = useState(false);
      const [showPopup, setShowPopup] = useState(false);
          const handlePopupClose = () => setShowPopup(false);
    const HandlePopupDetailClick = (e) => {
    setShowPopup(true);
  };

    const HandleFilterForm = (e) => {
        e.preventDefault();
                if (filterQuery.status == "") {
          setShowPopup(true);
           setMessage("Please select status.");

      return;
    } 
        navigate("/subdivisionlist");
        localStorage.setItem("selectedStatusBySubdivisionFilter_Subdivision", JSON.stringify(selectedStatusByFilter));
        localStorage.setItem("selectedReportingByFilter_Subdivision", JSON.stringify(selectedReportingByFilter));
        localStorage.setItem("selectedBuilderNameByFilter_Subdivision", JSON.stringify(selectedBuilderNameByFilter));
        localStorage.setItem("selectedSubdivisionNameByFilter_Subdivision", JSON.stringify(selectedSubdivisionNameByFilter));
        localStorage.setItem("productTypeStatusByFilter_Subdivision", JSON.stringify(productTypeStatusByFilter));
        localStorage.setItem("selectedAreaByFilter_Subdivision", JSON.stringify(selectedAreaByFilter));
        localStorage.setItem("selectedZipCodeByFilter_Subdivision", JSON.stringify(selectedZipCodeByFilter));
        localStorage.setItem("selectedMasterPlanByFilter_Subdivision", JSON.stringify(selectedMasterPlanByFilter));
        localStorage.setItem("selectedAgeByFilter_Subdivision", JSON.stringify(selectedAgeByFilter));
        localStorage.setItem("selectedSingleByFilter_Subdivision", JSON.stringify(selectedSingleByFilter));
        localStorage.setItem("selectedGatedByFilter_Subdivision", JSON.stringify(selectedGatedByFilter));
        localStorage.setItem("selectedJurisdicitionByFilter_Subdivision", JSON.stringify(selectedJurisdicitionByFilter));
        localStorage.setItem("seletctedGasProviderByFilter_Subdivision", JSON.stringify(seletctedGasProviderByFilter));
        localStorage.setItem("subdivision_status_Subdivision", JSON.stringify(filterQuery.status));
        localStorage.setItem("reporting_Subdivision", JSON.stringify(filterQuery.reporting));
        localStorage.setItem("subdivision_name_Subdivision", JSON.stringify(filterQuery.name));
        localStorage.setItem("builder_name_Subdivision", JSON.stringify(filterQuery.builder_name));
        localStorage.setItem("product_type_Subdivision", JSON.stringify(filterQuery.product_type));
        localStorage.setItem("area_Subdivision", JSON.stringify(filterQuery.area));
        localStorage.setItem("masterplan_id_Subdivision", JSON.stringify(filterQuery.masterplan_id));
        localStorage.setItem("zipcode_Subdivision", JSON.stringify(filterQuery.zipcode));
        localStorage.setItem("lotwidth_Subdivision", JSON.stringify(filterQuery.lotwidth));
        localStorage.setItem("lotsize_Subdivision", JSON.stringify(filterQuery.lotsize));
        localStorage.setItem("age_Subdivision", JSON.stringify(filterQuery.age));
        localStorage.setItem("single_Subdivision", JSON.stringify(filterQuery.single));
        localStorage.setItem("gated_Subdivision", JSON.stringify(filterQuery.gated));
        localStorage.setItem("juridiction_Subdivision", JSON.stringify(filterQuery.juridiction));
        localStorage.setItem("gasprovider_Subdivision", JSON.stringify(filterQuery.gasprovider));
        localStorage.setItem("from_Subdivision", JSON.stringify(filterQuery.from));
        localStorage.setItem("to_Subdivision", JSON.stringify(filterQuery.to));
        localStorage.setItem("searchQueryBySubdivisionFilter_Subdivision", JSON.stringify(searchQuery.replace(/^"",|,""$/g, '')));
        localStorage.setItem("setSubdivisionFilter", true);
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
            name: selectedNames
        }));
    };

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

    const handleSelectZipCodeChange = (selectedItems) => {
        const selectedValues = selectedItems.map(item => item.value).join(', ');
        setSelectedZipCodeByFilter(selectedItems);
        setFilterQuery(prevState => ({
            ...prevState,
            zipcode: selectedValues
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
        setSelectedStatusByFilter([]);
        setSelectedReportingByFilter([]);
        setSelectedBuilderNameByFilter([]);
        setProductTypeStatusByFilter([]);
        setSelectedAreaByFilter([]);
        setSelectedZipCodeByFilter([]);
        setSelectedMasterPlanByFilter([]);
        setSelectedAgeByFilter([]);
        setSelectedSingleByFilter([]);
        setSelectedGatedByFilter([]);
        setSelectedJurisdictionByFilter([]);
        setSelectedGasProviderByFilter([]);
        setSelectedBuilderIDByFilter([]);
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
            <h2>Filter Subdivisions</h2>
            <form onSubmit={HandleFilterForm}>
                <div className="row">
                    <div className="col-md-3 mt-3">
                        <label className="form-label">STATUS:{" "}
                                <span className="text-danger">*</span>

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
                        <label className="form-label">REPORTING:</label>
                        <MultiSelect
                            name="reporting"
                            options={reportingOptions}
                            value={selectedReportingByFilter}
                            onChange={handleSelectReportingChange}
                            placeholder={"Select Reporting"}
                        />
                    </div>
                    <div className="col-md-3 mt-3">
                        <label className="form-label">BUILDER NAME:</label>
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
                        <label className="form-label">NAME:</label>
                        <Form.Group controlId="tournamentList">
                            <MultiSelect
                                name="name"
                                options={subdivisionListDropDown}
                                value={selectedSubdivisionNameByFilter}
                                onChange={handleSelectSubdivisionNameChange}
                                placeholder={"Select Subdivision Name"}
                            />
                        </Form.Group>
                    </div>
                    <div className="col-md-3 mt-3">
                        <label htmlFor="exampleFormControlInput6" className="form-label">PRODUCT TYPE:</label>
                        <MultiSelect
                            name="product_type"
                            options={productTypeOptions}
                            value={productTypeStatusByFilter}
                            onChange={handleSelectProductTypeChange}
                            placeholder="Select Product Type"
                        />
                    </div>
                    <div className="col-md-3 mt-3">
                        <label className="form-label">AREA:</label>
                        <MultiSelect
                            name="area"
                            options={areaOption}
                            value={selectedAreaByFilter}
                            onChange={handleSelectAreaChange}
                            placeholder="Select Area"
                        />
                    </div>
                    <div className="col-md-3 mt-3">
                        <label className="form-label">MASTER PLAN:</label>
                        <MultiSelect
                            name="masterplan_id"
                            options={masterPlanOption}
                            value={selectedMasterPlanByFilter}
                            onChange={handleSelectMasterPlanChange}
                            placeholder="Select Master Plan"
                        />
                    </div>
                    <div className="col-md-3 mt-3">
                        <label className="form-label">ZIP CODE:</label>
                        <MultiSelect
                            name="zipcode"
                            options={zipCodeDropDown}
                            value={selectedZipCodeByFilter}
                            onChange={handleSelectZipCodeChange}
                            placeholder="Select ZipCode"
                        />
                    </div>
                    <div className="col-md-3 mt-3">
                        <label className="form-label">LOT WIDTH:</label>
                        <input type="text" name="lotwidth" value={filterQuery.lotwidth} className="form-control" onChange={HandleFilter} />
                    </div>
                    <div className="col-md-3 mt-3">
                        <label className="form-label">LOT SIZE:</label>
                        <input type="text" value={filterQuery.lotsize} name="lotsize" className="form-control" onChange={HandleFilter} />
                    </div>
                    <div className="col-md-3 mt-3">
                        <label htmlFor="exampleFormControlInput8" className="form-label">AGE RESTRICTED:</label>
                        <MultiSelect
                            name="age"
                            options={ageOptions}
                            value={selectedAgeByFilter}
                            onChange={handleSelectAgeChange}
                            placeholder={"Select Age"}
                        />
                    </div>
                    <div className="col-md-3 mt-3 ">
                        <label htmlFor="exampleFormControlInput8" className="form-label">All SINGLE STORY:</label>
                        <MultiSelect
                            name="single"
                            options={singleOptions}
                            value={selectedSingleByFilter}
                            onChange={handleSelectSingleChange}
                            placeholder={"Select Single"}
                        />
                    </div>
                    <div className="col-md-3 mt-3 mb-3">
                        <label htmlFor="exampleFormControlInput28" className="form-label">GATED:</label>
                        <MultiSelect
                            name="gated"
                            options={gatedOptions}
                            value={selectedGatedByFilter}
                            onChange={handleSelectGatedChange}
                            placeholder={"Select Gated"}
                        />
                    </div>
                    <div className="col-md-3 mt-3 mb-3">
                        <label className="form-label">JURISDICTION:</label>
                        <MultiSelect
                            name="juridiction"
                            options={jurisdictionOption}
                            value={selectedJurisdicitionByFilter}
                            onChange={handleSelectJurisdictionChange}
                            placeholder="Select Juridiction"
                        />
                    </div>
                    <div className="col-md-3 mt-3 mb-3">
                        <label className="form-label">GAS PROVIDER:</label>
                        <MultiSelect
                            name="gasprovider"
                            options={gasProviderOption}
                            value={seletctedGasProviderByFilter}
                            onChange={handleGasProviderChange}
                            placeholder="Select Gas Provider"
                        />
                    </div>
                    <div className="d-flex flex-column mb-3" style={{ border: "1px solid #cccccc", borderRadius: "0.375rem", marginLeft: "12px", width: "48%" }}>
                        <label className="form-label" style={{ marginTop: "10px" }}>OPEN SINCE</label>
                        <hr style={{ marginTop: "0px" }} />
                        <div className="d-flex gap-4 col-md-11 mb-3" style={{ width: "100%" }}>
                            <div style={{ width: "100%" }}>
                                <label className="form-label">FROM:</label>
                                <DatePicker
                                    name="from"
                                    className="form-control"
                                    selected={filterQuery.from ? parseDate(filterQuery.from) : null}
                                    onChange={handleFilterDateFrom}
                                    dateFormat="MM/dd/yyyy"
                                    placeholderText="mm/dd/yyyy"
                                />
                            </div>
                            <div style={{ width: "100%" }}>
                                <label className="form-label">TO:</label>
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
                          <Modal.Body>{message}</Modal.Body>
                          <Modal.Footer>
                            <Button variant="secondary" onClick={handlePopupClose}>Close</Button>
                          </Modal.Footer>
                        </Modal>
        </div>

        
    )
}

export default FilterSubdivision;