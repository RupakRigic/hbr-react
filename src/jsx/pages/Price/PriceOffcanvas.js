import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Offcanvas, Form } from 'react-bootstrap';
import AdminBuilderService from '../../../API/Services/AdminService/AdminBuilderService';
import AdminProductService from '../../../API/Services/AdminService/AdminProductService';
import AdminSubdivisionService from '../../../API/Services/AdminService/AdminSubdevisionService';
import AdminPriceService from '../../../API/Services/AdminService/AdminPriceService';
import swal from "sweetalert";

const ProductOffcanvas = forwardRef((props, ref) => {
    const navigate = useNavigate();
    const [Error, setError] = useState('');
    const [addProduct, setAddProduct] = useState(false);
    const [ProductCode, setProductCode] = useState('');
    const [ProductList, setProductList] = useState([]);
    const [builderList, setBuilderList] = useState([]);
    const [BuilderCode, setBuilderCode] = useState('');
    const [subDivisionList, setSubDivisionList] = useState([]);
    const [SubDivisionCode, setDivisionCode] = useState('');

    useEffect(() => {
        GetBuilderDropDownList();
        GetProductDropDownList();
    }, []);

    useImperativeHandle(ref, () => ({
        showEmployeModal() {
            setAddProduct(true)
        }
    }));

    const GetBuilderDropDownList = async () => {
        try {
            const response = await AdminBuilderService.builderDropDown();
            const responseData = await response.json();
            const formattedData = responseData.map((builder) => ({
                label: builder.name,
                value: builder.id,
            }));
            setBuilderList(formattedData);
        } catch (error) {
            console.log("Error fetching builder list:", error);
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
        setProductCode(code.target.value);
    };

    const handleBuilderCode = async (event) => {
        setBuilderCode(event.target.value);
        try {
            const response = await AdminSubdivisionService.getByBuilderId(event.target.value)
            const responseData = await response.json();
            setSubDivisionList(responseData);
        } catch (error) {
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();
                setError(errorJson.message);
            }
        }
    };

    const handleSubDivisionCode = async (event) => {
        setDivisionCode(event.target.value);
        try {
            const response = await AdminProductService.getBySubDivisionId(event.target.value)
            const responseData = await response.json();
            setProductList(responseData.data);
        } catch (error) {
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();
                setError(errorJson.message);
            }
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            var userData = {
                "product_id": ProductCode,
                "baseprice": event.target.baseprice.value,
                "date": event.target.date.value,
            }
            const data = await AdminPriceService.store(userData).json();
            if (data.status === true) {
                swal("Product Price Create Succesfully").then((willDelete) => {
                    if (willDelete) {
                        setAddProduct(false);
                        props.parentCallback();
                        navigate('/priceList');
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

    return (
        <>
            <Offcanvas show={addProduct} onHide={setAddProduct} className="offcanvas-end customeoff" placement='end'>
                <div className="offcanvas-header">
                    <h5 className="modal-title" id="#gridSystemModal">{props.Title}</h5>
                    <button type="button" className="btn-close"
                        onClick={() => setAddProduct(false)}
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div className="offcanvas-body">
                    <div className="container-fluid">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-xl-4 mb-3">
                                    <label className="form-label">Builder<span className="text-danger">*</span></label>
                                    <Form.Group controlId="tournamentList">
                                        <Form.Select
                                            onChange={handleBuilderCode}
                                            value={BuilderCode}
                                            className="default-select form-control"
                                        >
                                            <option value=''>Select Builder</option>
                                            {builderList.map((element) => (
                                                <option value={element.value}>{element.label}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </div>
                                <div className="col-xl-4 mb-3">
                                    <label className="form-label">Sub Division<span className="text-danger">*</span></label>
                                    <Form.Group controlId="tournamentList">
                                        <Form.Select
                                            onChange={handleSubDivisionCode}
                                            value={SubDivisionCode}
                                            className="default-select form-control"
                                        >
                                            <option value=''>Select Sub Division</option>
                                            {subDivisionList.map((element) => (
                                                <option value={element.id}>{element.name}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </div>
                                <div className="col-xl-4 mb-3">
                                    <label className="form-label">Product<span className="text-danger">*</span></label>
                                    <Form.Group controlId="tournamentList">
                                        <Form.Select
                                            onChange={handleProductCode}
                                            value={ProductCode}
                                            className="default-select form-control"
                                        >
                                            <option value=''>Select Product</option>
                                            {ProductList.map((element) => (
                                                <option value={element.value}>{element.label}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput2" className="form-label"> Base Price: <span className="text-danger">*</span></label>
                                    <input type="number" name='baseprice' className="form-control" id="exampleFormControlInput2" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput9" className="form-label"> Date <span className="text-danger"></span></label>
                                    <input type="date" name='date' className="form-control" id="exampleFormControlInput9" placeholder="" />
                                </div>
                                <p className='text-danger fs-12'>{Error}</p>
                            </div>
                            <div>
                                <button type="submit" className="btn btn-primary me-1">Submit</button>
                                <Link to={"#"} onClick={() => setAddProduct(false)} className="btn btn-danger light ms-1">Cancel</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </Offcanvas>
        </>
    );
});

export default ProductOffcanvas;