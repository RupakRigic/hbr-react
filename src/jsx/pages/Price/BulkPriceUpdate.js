import React, { useState, forwardRef, Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Offcanvas, Form } from 'react-bootstrap';
import swal from "sweetalert";
import Select from "react-select";
import AdminPriceService from '../../../API/Services/AdminService/AdminPriceService';
import AdminProductService from '../../../API/Services/AdminService/AdminProductService';
import ClipLoader from 'react-spinners/ClipLoader';
import AdminBuilderService from '../../../API/Services/AdminService/AdminBuilderService';
import AdminSubdevisionService from '../../../API/Services/AdminService/AdminSubdevisionService';

const BulkPriceUpdate = forwardRef((props) => {
    const { selectedLandSales, canvasShowEdit, seCanvasShowEdit } = props;

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [builderCode, setBuilderCode] = useState([]);
    const [builderListDropDown, setBuilderListDropDown] = useState([]);
    const [subdivisionCode, setSubdivisionCode] = useState([]);
    const [subdivisionListDropDown, setSubdivisionListDropDown] = useState([]);
    const [productList, setProductList] = useState([]);
    const [productCode, setProductCode] = useState([]);

    useEffect(() => {
        if (canvasShowEdit) {
            GetBuilderDropDownList();
        }
    }, [canvasShowEdit]);

    useEffect(() => {
        if (canvasShowEdit && builderCode?.value) {
            SubdivisionByBuilderIDList(builderCode);
        }
    }, [canvasShowEdit, builderCode]);

    useEffect(() => {
        if (canvasShowEdit && subdivisionCode?.value) {
            ProductBySubdivisionIDList(subdivisionCode?.value);
        } else {
            if (subdivisionCode?.value) {
                setProductCode(productCode);
            } else {
                setProductList([]);
                setProductCode([]);
            }
        }
    }, [canvasShowEdit, subdivisionCode]);

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
            console.log("Error fetching builder list:", error);
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
            console.log("Error fetching builder list:", error);
            if (error.name === "HTTPError") {
                const errorJson = await error.response.json();
                setError(errorJson.message);
            }
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (selectedLandSales.length === 0) {
            setError('No selected records'); return false
        }
        swal({
            title: "Are you sure?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(async (willDelete) => {
            if (willDelete) {
                try {
                    var userData = {
                        product_id: productCode?.value,
                        baseprice: event.target.baseprice.value,
                        date: event.target.date.value,
                    };
                    console.log(userData);
                    const data = await AdminPriceService.bulkupdate(selectedLandSales, userData).json();
                    if (data.status === true) {
                        swal("Records Updated Successfully").then((willDelete) => {
                            if (willDelete) {
                                HandleUpdateCanvasClose();
                                props.parentCallback();
                            }
                        })
                    } else {
                        swal(data.message).then((willDelete) => {
                            if (willDelete) {
                                HandleUpdateCanvasClose();
                            }
                        })
                    }
                }
                catch (error) {
                    if (error.name === 'HTTPError') {
                        const errorJson = await error.response.json();
                        setError(errorJson.message.substr(0, errorJson.message.lastIndexOf(".")))
                    }
                }
            }
        })
    };

    const HandleUpdateCanvasClose = () => {
        seCanvasShowEdit(false);
        setError('');
        setBuilderCode([]);
        setBuilderListDropDown([]);
        setSubdivisionCode([]);
        setSubdivisionListDropDown([]);
        setProductCode([]);
        setProductList([]);
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
            <Offcanvas show={canvasShowEdit} onHide={() => HandleUpdateCanvasClose()} className="offcanvas-end customeoff" placement='end'>
                <div className="offcanvas-header">
                    <h5 className="modal-title" id="#gridSystemModal">{props.Title}</h5>
                    <button type="button" className="btn-close"
                        onClick={() => HandleUpdateCanvasClose()}
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
                                        <label className="form-label">Builder</label>
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
                                        <label className="form-label">Subdivision</label>
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
                                        <label className="form-label">Product</label>
                                        <Form.Group controlId="tournamentList">
                                            <Select
                                                options={productList}
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
                                        <label htmlFor="exampleFormControlInput2" className="form-label">Base Price:</label>
                                        <input type="text" name="baseprice" className="form-control" id="exampleFormControlInput2" />
                                    </div>

                                    <div className="col-xl-6 mb-3">
                                        <label htmlFor="exampleFormControlInput9" className="form-label">Date</label>
                                        <input type="date" name="date" className="form-control" id="exampleFormControlInput9" placeholder="" />
                                    </div>
                                    <p className="text-danger fs-12">{error}</p>
                                </div>

                                <div>
                                    <button type="submit" className="btn btn-primary me-1">Submit</button>
                                    <Link
                                        to={"#"}
                                        onClick={() => HandleUpdateCanvasClose()}
                                        className="btn btn-danger light ms-1"
                                    >
                                        Cancel
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </Offcanvas>
        </Fragment>
    );
});

export default BulkPriceUpdate;