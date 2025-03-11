    import React, { Fragment, useState, useEffect } from "react";
    import { Link, useParams, useNavigate } from "react-router-dom";
    import { Form } from "react-bootstrap";
    import Select from "react-select";
    import AdminProductService from "../../../API/Services/AdminService/AdminProductService";
    import AdminPriceService from "../../../API/Services/AdminService/AdminPriceService";
    import swal from "sweetalert";
import MainPagetitle from "../../layouts/MainPagetitle";

    const PriceUpdate = () => {
    const [Error, setError] = useState("");
    const [ProductCode, setProductCode] = useState("");
    const [PriceList, setPriceList] = useState("");

    const [ProductList, setProductList] = useState([]);
    const params = useParams();
    const navigate = useNavigate();

    const getPricelist = async (id) => {
        try {
          let responseData1 = await AdminPriceService.show(id).json();
          setPriceList(responseData1);
          console.log(responseData1);
        } catch (error) {
          if (error.name === "HTTPError") {
            const errorJson = await error.response.json();
    
            setError(errorJson.message);
          }
        }
      };
      useEffect(() => {
        if (localStorage.getItem("usertoken")) {
            getPricelist(params.id);
        } else {
          navigate("/");
        }
      }, []);

    const getProductList = async () => {
        try {
        let response = await AdminProductService.index();
        let responseData = await response.json();

        setProductList(responseData.data);
        console.log(responseData.data);
        } catch (error) {
        console.log(error);
        if (error.name === "HTTPError") {
            const errorJson = await error.response.json();

            setError(errorJson.message);
        }
        }
    };
    useEffect(() => {
        getProductList();
    }, []);
    const handleProductCode = (code) => {
        setProductCode(code.target.value);
    };
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
        var userData = {
            product_id: ProductCode,
            baseprice: event.target.baseprice.value,
            date: event.target.date.value,
        };
        const data = await AdminPriceService.update(params.id, userData).json();
        if (data.status === true) {
            swal("Record Updated Succesfully.").then((willDelete) => {
            if (willDelete) {
                navigate("/pricelist");
            }
            });
        }
        } catch (error) {
        if (error.name === "HTTPError") {
            const errorJson = await error.response.json();

            setError(
            errorJson.message.substr(0, errorJson.message.lastIndexOf("."))
            );
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
                <div className="card-body">
                    <div className="form-validation">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                        <div className="col-xl-6 mb-3">
                            <label className="form-label">
                            Product<span className="text-danger">*</span>
                            </label>
                            <Form.Group controlId="tournamentList">
                            <Form.Select
                                onChange={handleProductCode}
                                value={ProductCode}
                                className="default-select form-control"

                            >
                                <option>Select Product</option>
                                {ProductList.map((element) => (
                                <option 
                                value={element.id}>{element.name}</option>
                                ))}
                            </Form.Select>
                            </Form.Group>
                        </div>
                        <div className="col-xl-6 mb-3">
                            <label
                            htmlFor="exampleFormControlInput2"
                            className="form-label"
                            >
                            {" "}
                            Base Price: <span className="text-danger">*</span>
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
                            <label
                            htmlFor="exampleFormControlInput9"
                            className="form-label"
                            >
                            {" "}
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
                </div>
            </div>
            </div>
        </div>
        </Fragment>
    );
    };

    export default PriceUpdate;
