import React, { useState, forwardRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Offcanvas, Form } from 'react-bootstrap';
import AdminPriceService from '../../../API/Services/AdminService/AdminPriceService';
import swal from "sweetalert";
import Swal from 'sweetalert2';
import Select from "react-select";
import AdminProductService from '../../../API/Services/AdminService/AdminProductService';
import ClipLoader from 'react-spinners/ClipLoader';

const ProductOffcanvas = forwardRef((props) => {
    const { canvasShowAdd, seCanvasShowAdd } = props;

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [productCode, setProductCode] = useState([]);
    const [productList, setProductList] = useState([]);
    const [productData, setProductData] = useState([]);
    // const [basePrice, setBasePrice] = useState(null);

    useEffect(() => {
        if (canvasShowAdd) {
            GetProductDropDownList();
        }
    }, [canvasShowAdd]);

    const GetProductDropDownList = async () => {
        setIsLoading(true);
        try {
            const response = await AdminProductService.productDropDown();
            const responseData = await response.json();
            setIsLoading(false);
            setProductData(responseData);
            const formattedData = responseData.map((product) => ({
                label: product.name,
                value: product.id,
            }));
            setProductList(formattedData);
        } catch (error) {
            setIsLoading(false);
            console.log("Error fetching builder list:", error);
            if (error.name === "HTTPError") {
                const errorJson = await error.response.json();
                setError(errorJson.message);
            }
        }
    };

    const handleProductCode = (code) => {
        let productSubandBuilder = productData?.filter(data => data.id == code.value);
        setProductCode(code);

        const builderName = `<strong>${productSubandBuilder[0]?.builder_name}</strong>`;
        const subdivisionName = `<strong>${productSubandBuilder[0]?.subdivision_name}</strong>`;
        const productName = `<strong>${productSubandBuilder[0]?.name}</strong>`;

        Swal.fire({
            html: `Please confirm that you are adding the price detail for the builder ${builderName} and subdivision ${subdivisionName} for the product ${productName}.`,
            icon: 'warning',
            confirmButtonText: 'OK',
            showCancelButton: false,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
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

    return (
        <>
            <Offcanvas show={canvasShowAdd} onHide={seCanvasShowAdd} className="offcanvas-end customeoff" placement='end'>
                <div className="offcanvas-header">
                    <h5 className="modal-title" id="#gridSystemModal">{props.Title}</h5>
                    <button type="button" className="btn-close"
                        onClick={() => seCanvasShowAdd(false)}
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
                                        <label className="form-label">Product <span className="text-danger">*</span></label>
                                        <Form.Group controlId="tournamentList">
                                            <Select
                                                options={productList}
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
                                    <Link to={"#"} onClick={() => seCanvasShowAdd(false)} className="btn btn-danger light ms-1">Cancel</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </Offcanvas>
        </>
    );
});

export default ProductOffcanvas;