import React, { useState, forwardRef, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Offcanvas, Form } from 'react-bootstrap';
import AdminPriceService from '../../../API/Services/AdminService/AdminPriceService';
import swal from "sweetalert";
import Select from "react-select";
import AdminProductService from '../../../API/Services/AdminService/AdminProductService';
import ClipLoader from 'react-spinners/ClipLoader';
import AdminBuilderService from '../../../API/Services/AdminService/AdminBuilderService';
import AdminSubdevisionService from '../../../API/Services/AdminService/AdminSubdevisionService';

const ProductOffcanvas = forwardRef((props) => {
    const { canvasShowAdd, seCanvasShowAdd } = props;

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [productCode, setProductCode] = useState([]);
    const [productList, setProductList] = useState([]);
    const [builderCode, setBuilderCode] = useState([]);
    const [builderListDropDown, setBuilderListDropDown] = useState([]);
    const [subdivisionCode, setSubdivisionCode] = useState([]);
    const [subdivisionListDropDown, setSubdivisionListDropDown] = useState([]);

    useEffect(() => {
        if (canvasShowAdd) {
            GetBuilderDropDownList();
        }
    }, [canvasShowAdd]);

    useEffect(() => {
        if (canvasShowAdd && builderCode?.value) {
            SubdivisionByBuilderIDList(builderCode);
        }
    }, [builderCode, canvasShowAdd]);

    useEffect(() => {
        if (canvasShowAdd && subdivisionCode?.value) {
            ProductBySubdivisionIDList(subdivisionCode?.value);
        } else {
            if (subdivisionCode?.value) {
                setProductCode(productCode);
            } else {
                setProductList([]);
                setProductCode([]);
            }
        }
    }, [subdivisionCode, canvasShowAdd]);

    const GetBuilderDropDownList = async () => {
        setIsLoading(true);
        try {
            const response = await AdminBuilderService.builderDropDown();
            const responseData = await response.json();
            const formattedData = responseData.map((builder) => ({
                label: builder.name,
                value: builder.id,
            }));
            setBuilderListDropDown(formattedData);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
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
                "product_id": productCode?.value,
                "baseprice": event.target.baseprice.value,
                "date": event.target.date.value,
            }
            const data = await AdminPriceService.store(userData).json();
            if (data.status === true) {
                swal("Product Price Created Succesfully").then((willDelete) => {
                    if (willDelete) {
                        props.parentCallback();
                        seCanvasShowAdd(false);
                    }
                })
                setError('');
            }
        }
        catch (error) {
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();
                setError(errorJson.message.substr(0, errorJson.message.lastIndexOf(".")))
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

    const HandleCancel = () => {
        seCanvasShowAdd(false);
        setBuilderCode([]);
        setSubdivisionCode([]);
        setProductCode([]);
        setError("");
    };

    return (
        <Fragment>
            <Offcanvas show={canvasShowAdd} onHide={seCanvasShowAdd} className="offcanvas-end customeoff" placement='end'>
                <div className="offcanvas-header">
                    <h5 className="modal-title" id="#gridSystemModal">{props.Title}</h5>
                    <button type="button" className="btn-close"
                        onClick={() => HandleCancel()}
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
                {isLoading ? (
                    <div className="d-flex justify-content-center align-items-center mb-5">
                        <ClipLoader color="#4474fc" />
                    </div>
                ) : (
                    <div className="offcanvas-body">
                        <div className="container-fluid">
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
                                                options={productList}
                                                value={productCode}
                                                onChange={(selectedOption) => handleProductCode(selectedOption)}
                                                placeholder="Search and select a product..."
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
                                        <label htmlFor="exampleFormControlInput2" className="form-label">Base Price <span className="text-danger">*</span></label>
                                        {/* <input type="text" name='baseprice' className="form-control" id="exampleFormControlInput2" value={basePrice} placeholder="" onChange={(e) => setBasePrice(e.target.value.replace(/[^0-9]/g, '')) } /> */}
                                        <input type="text" name='baseprice' className="form-control" id="exampleFormControlInput2" placeholder="" />
                                    </div>

                                    <div className="col-xl-6 mb-3">
                                        <label htmlFor="exampleFormControlInput9" className="form-label">Date</label>
                                        <input type="date" name='date' className="form-control" id="exampleFormControlInput9" placeholder="" />
                                    </div>

                                    <p className='text-danger fs-12'>{error}</p>
                                </div>

                                <div>
                                    <button type="submit" className="btn btn-primary me-1">Submit</button>
                                    <Link to={"#"} onClick={() => HandleCancel()} className="btn btn-danger light ms-1">Cancel</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </Offcanvas>
        </Fragment>
    );
});

export default ProductOffcanvas;