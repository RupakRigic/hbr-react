import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Offcanvas, Form } from 'react-bootstrap';
import AdminPriceService from '../../../API/Services/AdminService/AdminPriceService';
import swal from "sweetalert";
import Select from "react-select";

const ProductOffcanvas = forwardRef((props, ref) => {
    const { productList } = props;

    const navigate = useNavigate();
    const [Error, setError] = useState('');
    const [addProduct, setAddProduct] = useState(false);
    const [ProductCode, setProductCode] = useState('');
    const [ProductList, setProductList] = useState([]);

    useImperativeHandle(ref, () => ({
        showEmployeModal() {
            setAddProduct(true)
        }
    }));

    useEffect(() => {
        setProductList(props.productList);
    }, [props.productList]);

    const handleProductCode = (code) => {
        setProductCode(code);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            var userData = {
                "product_id": ProductCode ? ProductCode.value : '',
                "baseprice": event.target.baseprice.value,
                "date": event.target.date.value,
            }
            const data = await AdminPriceService.store(userData).json();
            if (data.status === true) {
                swal("Product Price Create Succesfully").then((willDelete) => {
                    if (willDelete) {
                        setAddProduct(false);
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
                                    <label className="form-label">Product<span className="text-danger">*</span></label>
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
                                    <label htmlFor="exampleFormControlInput2" className="form-label"> Base Price: <span className="text-danger">*</span></label>
                                    <input type="number" name='baseprice' className="form-control" id="exampleFormControlInput2" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput9" className="form-label">Date</label>
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