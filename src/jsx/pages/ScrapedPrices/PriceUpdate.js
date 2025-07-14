import React, { Fragment, useState, useEffect } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { Form } from "react-bootstrap";
import Select from "react-select";
import AdminProductService from "../../../API/Services/AdminService/AdminProductService";
import AdminPriceService from "../../../API/Services/AdminService/AdminPriceService";
import swal from "sweetalert";
import MainPagetitle from "../../layouts/MainPagetitle";
import ClipLoader from "react-spinners/ClipLoader";
import AdminBuilderService from "../../../API/Services/AdminService/AdminBuilderService";
import AdminSubdevisionService from "../../../API/Services/AdminService/AdminSubdevisionService";

const PriceUpdate = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const page = queryParams.get("page");

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingDropDown, setIsLoadingDropDown] = useState(false);
    const [Error, setError] = useState("");
    const [PriceList, setPriceList] = useState([]);
    const [builderCode, setBuilderCode] = useState([]);
    const [builderListDropDown, setBuilderListDropDown] = useState([]);
    const [subdivisionCode, setSubdivisionCode] = useState([]);
    const [subdivisionListDropDown, setSubdivisionListDropDown] = useState([]);
    const [ProductList, setProductList] = useState([]);
    const [productCode, setProductCode] = useState([]);

    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("usertoken")) {
            ShowPriceList(params.id);
            GetBuilderDropDownList();
        } else {
            navigate("/");
        }
    }, []);

    useEffect(() => {
        if (builderCode?.value) {
            SubdivisionByBuilderIDList(builderCode);
        }
    }, [builderCode]);

    useEffect(() => {
        if (subdivisionListDropDown?.length > 0 && subdivisionCode?.value) {
            ProductBySubdivisionIDList(subdivisionCode?.value);
        } else {
            if (subdivisionCode?.value) {
                setProductCode(productCode);
            } else {
                setProductList([]);
                setProductCode([]);
            }
        }
    }, [subdivisionCode]);

    const ShowPriceList = async (id) => {
        setIsLoading(true);
        try {
            let responseData1 = await AdminPriceService.show(id).json();
            const builderId = {
                label: responseData1?.product?.subdivision?.builder?.name,
                value: responseData1?.product?.subdivision?.builder_id,
            }

            const subdivisionId = {
                label: responseData1?.product?.subdivision?.name,
                value: responseData1?.product?.subdivision_id,
            }

            const productId = {
                label: responseData1?.product?.name,
                value: responseData1?.product?.id,
            }
            setIsLoading(false);
            setPriceList(responseData1);
            setBuilderCode(builderId);
            setSubdivisionCode(subdivisionId);
            setProductCode(productId);
        } catch (error) {
            setIsLoading(false);
            if (error.name === "HTTPError") {
                const errorJson = await error.response.json();
                setError(errorJson.message);
            }
        }
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
                setError("Something went wrong!");
            }
        }
    };

    const SubdivisionByBuilderIDList = async (builderId) => {
        try {
            var userData = {
                builder_ids: (builderId?.value === "" || builderId?.value === undefined || builderId?.value === null) ? [] : [builderId.value]
            }
            const response = await AdminSubdevisionService.subdivisionbybuilderidlist(userData);
            const responseData = await response.json();
            const formattedData = responseData.data.map((subdivision) => ({
                label: subdivision.name,
                value: subdivision.id,
            }));
            const filter = formattedData?.filter(data => data.value === subdivisionCode?.value);
            handleSubdivisionCode(filter?.length > 0 ? filter[0] : filter?.length == 0 ? [] : formattedData[0]);
            setSubdivisionListDropDown(formattedData);
        } catch (error) {
            if (error.name === "HTTPError") {
                const errorJson = await error.response.json();
                setError(errorJson.message);
            }
        }
    };

    const ProductBySubdivisionIDList = async (subdivisionId) => {
        try {
            const response = await AdminProductService.productBySubdivision(subdivisionId);
            const responseData = await response.json();
            const formattedData = responseData?.map((product) => ({
                label: product.name,
                value: product.id,
            }));
            const filter = formattedData?.filter(data => data.value === productCode?.value);
            handleProductCode(filter?.length > 0 ? filter[0] : filter?.length == 0 ? [] : formattedData[0]);
            setProductList(formattedData);
        } catch (error) {
            if (error.name === "HTTPError") {
                const errorJson = await error.response.json();
                setError(errorJson.message);
            }
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!builderCode?.value || !subdivisionCode?.value) {
            if (!builderCode?.value) {
                setError("The builder id field is required");
                return;
            } else {
                setError("The subdivision id field is required");
                return;
            }
        }
        try {
            var userData = {
                product_id: productCode ? productCode?.value : PriceList?.product_id,
                baseprice: event.target.baseprice.value,
                date: event.target.date.value,
            };

            const data = await AdminPriceService.update(params.id, userData).json();

            if (data.status === true) {
                swal("Record Updated Successfully").then((willDelete) => {
                    if (willDelete) {
                        navigate(`/pricelist?page=${page}`);
                    }
                });
            }
        } catch (error) {
            if (error.name === "HTTPError") {
                const errorJson = await error.response.json();
                setError(errorJson.message.substr(0, errorJson.message.lastIndexOf(".")));
            }
        }
    };

    const handleSelectBuilderNameChange = (code) => {
        setBuilderCode(code);
    };

    const handleSubdivisionCode = (code) => {
        setSubdivisionCode(code);
    };

    const handleProductCode = (code) => {
        setProductCode(code);
    };

    return (
        <Fragment>
            <MainPagetitle mainTitle="Edit Base Price" pageTitle="Edit Base Price" parentTitle="Base Prices" link={`/priceList?page=${page}`} />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Edit Base Price</h4>
                            </div>
                            {(isLoading || isLoadingDropDown) ? (
                                <div className="d-flex justify-content-center align-items-center mb-5 mt-5">
                                    <ClipLoader color="#4474fc" />
                                </div>
                            ) : (
                                <div className="card-body">
                                    <div className="form-validation">
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                <div className="col-xl-6 mb-3">
                                                    <label className="form-label">Builder <span className="text-danger">*</span></label>
                                                    <Form.Group controlId="tournamentList">
                                                        <Select
                                                            name="builder_name"
                                                            options={builderListDropDown}
                                                            value={builderCode}
                                                            onChange={(selectedOption) => handleSelectBuilderNameChange(selectedOption)}
                                                            placeholder={"Search and select a builder..."}
                                                            styles={{
                                                                container: (provided) => ({
                                                                    ...provided,
                                                                    color: 'black'
                                                                }),
                                                                menu: (provided) => ({
                                                                    ...provided,
                                                                    color: 'black'
                                                                }),
                                                            }}
                                                        />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-xl-6 mb-3">
                                                    <label className="form-label">Subdivision <span className="text-danger">*</span></label>
                                                    <Form.Group controlId="tournamentList">
                                                        <Select
                                                            options={subdivisionListDropDown}
                                                            value={subdivisionCode}
                                                            onChange={(selectedOption) => handleSubdivisionCode(selectedOption)}
                                                            placeholder={"Search and select a subdivision..."}
                                                            styles={{
                                                                container: (provided) => ({
                                                                    ...provided,
                                                                    color: 'black'
                                                                }),
                                                                menu: (provided) => ({
                                                                    ...provided,
                                                                    color: 'black'
                                                                }),
                                                            }}
                                                        />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-xl-6 mb-3">
                                                    <label className="form-label">Product <span className="text-danger">*</span></label>
                                                    <Form.Group controlId="tournamentList">
                                                        <Select
                                                            options={ProductList}
                                                            value={productCode}
                                                            placeholder={"Search and select a product..."}
                                                            onChange={(selectedOption) => handleProductCode(selectedOption)}
                                                            styles={{
                                                                container: (provided) => ({
                                                                    ...provided,
                                                                    width: '100%',
                                                                    color: 'black'
                                                                }),
                                                                menu: (provided) => ({
                                                                    ...provided,
                                                                    width: '100%',
                                                                    color: 'black'
                                                                }),
                                                            }}
                                                        />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-xl-6 mb-3">
                                                    <label htmlFor="exampleFormControlInput2" className="form-label">Base Price <span className="text-danger">*</span></label>
                                                    <input
                                                        type="text"
                                                        name="baseprice"
                                                        className="form-control"
                                                        id="exampleFormControlInput2"
                                                        placeholder=""
                                                        defaultValue={PriceList.baseprice}
                                                    />
                                                </div>

                                                <div className="col-xl-6 mb-3">
                                                    <label htmlFor="exampleFormControlInput9" className="form-label">Date</label>
                                                    <input
                                                        type="date"
                                                        name="date"
                                                        className="form-control"
                                                        id="exampleFormControlInput9"
                                                        placeholder=""
                                                        defaultValue={PriceList.date}
                                                    />
                                                </div>

                                                <p className="text-danger fs-12">{Error}</p>
                                            </div>

                                            <div>
                                                <button type="submit" className="btn btn-primary me-1">
                                                    Submit
                                                </button>
                                                <Link to={`/priceList?page=${page}`} className="btn btn-danger light ms-1">
                                                    Cancel
                                                </Link>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default PriceUpdate;
