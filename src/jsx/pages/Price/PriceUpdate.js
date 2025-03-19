import React, { Fragment, useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";
import Select from "react-select";
import AdminProductService from "../../../API/Services/AdminService/AdminProductService";
import AdminPriceService from "../../../API/Services/AdminService/AdminPriceService";
import swal from "sweetalert";
import MainPagetitle from "../../layouts/MainPagetitle";
import ClipLoader from "react-spinners/ClipLoader";

const PriceUpdate = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [Error, setError] = useState("");
    const [ProductCode, setProductCode] = useState([]);
    const [PriceList, setPriceList] = useState([]);
    const [ProductList, setProductList] = useState([]);
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("usertoken")) {
            ShowPriceList(params.id);
            GetProductDropDownList();
        } else {
            navigate("/");
        }
    }, []);

    useEffect(() => {
        if (PriceList?.product_id && ProductList?.length > 0) {
            const filter = ProductList?.filter(data => data.value === PriceList?.product_id);
            handleProductCode(filter[0]);
        }
    }, [PriceList, ProductList]);

    const ShowPriceList = async (id) => {
        setIsLoading(true);
        try {
            let responseData1 = await AdminPriceService.show(id).json();
            setIsLoading(false);
            setPriceList(responseData1);
        } catch (error) {
            setIsLoading(false);
            if (error.name === "HTTPError") {
                const errorJson = await error.response.json();
                setError(errorJson.message);
            }
        }
    };

    const GetProductDropDownList = async () => {
        try {
            const response = await AdminProductService.productDropDown();
            const responseData = await response.json();
            const formattedData = responseData.map((product) => ({
                label: product.name,
                value: product.id,
            }));
            setProductList(formattedData);
        } catch (error) {
            console.log("Error fetching builder list:", error);
            if (error.name === "HTTPError") {
                const errorJson = await error.response.json();
                setError(errorJson.message);
            }
        }
    };

    const handleProductCode = (code) => {
        setProductCode(code);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            var userData = {
                product_id: ProductCode ? ProductCode?.value : PriceList?.product_id,
                baseprice: event.target.baseprice.value,
                date: event.target.date.value,
            };

            const data = await AdminPriceService.update(params.id, userData).json();
            
            if (data.status === true) {
                swal("Record Updated Successfully").then((willDelete) => {
                    if (willDelete) {
                        navigate("/pricelist");
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

    return (
        <Fragment>
            <MainPagetitle mainTitle="Edit Base Price" pageTitle="Edit Base Price" parentTitle="Base Prices" link="/priceList" />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Edit Base Price</h4>
                            </div>
                            {isLoading ? (
                                <div className="d-flex justify-content-center align-items-center mb-5 mt-5">
                                    <ClipLoader color="#4474fc" />
                                </div>
                            ) : (
                                <div className="card-body">
                                    <div className="form-validation">
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                <div className="col-xl-6 mb-3">
                                                    <label className="form-label">
                                                        Product <span className="text-danger">*</span>
                                                    </label>
                                                    <Form.Group controlId="tournamentList">
                                                        <Select
                                                            options={ProductList}
                                                            value={ProductCode}
                                                            placeholder={"Select Product..."}
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
                                                    <label htmlFor="exampleFormControlInput2" className="form-label">
                                                        Base Price <span className="text-danger">*</span>
                                                    </label>
                                                    <input
                                                        type="number"
                                                        name="baseprice"
                                                        className="form-control"
                                                        id="exampleFormControlInput2"
                                                        placeholder=""
                                                        defaultValue={PriceList.baseprice}
                                                    />
                                                </div>
                                                <div className="col-xl-6 mb-3">
                                                    <label htmlFor="exampleFormControlInput9" className="form-label">
                                                        Date
                                                    </label>
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
                                                <Link to={"/priceList"} className="btn btn-danger light ms-1">
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
