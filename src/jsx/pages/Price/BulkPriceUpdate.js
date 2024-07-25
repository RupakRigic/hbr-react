import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Offcanvas, Form } from 'react-bootstrap';
import swal from "sweetalert";
import AdminPriceService from '../../../API/Services/AdminService/AdminPriceService';


const BulkPriceUpdate = forwardRef((props, ref) => {
    const { selectedLandSales } = props;
    console.log("bulkselectedLandSales", selectedLandSales);
    const [Error, setError] = useState('');
    const [addProduct, setAddProduct] = useState(false);
    const [ProductList, setProductList] = useState([]);
    const [ProductCode, setProductCode] = useState("");
    const [PriceList, setPriceList] = useState("");

    useImperativeHandle(ref, () => ({
        showEmployeModal() {
            setAddProduct(true)
        }
    }));

    const handleProductCode = (code) => {
        setProductCode(code.target.value);
    };

    const navigate = useNavigate();

    useEffect(() => {
        setProductList(props.productList);
    }, [props.productList]);

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
                        product_id: ProductCode,
                        baseprice: event.target.baseprice.value,
                        date: event.target.date.value,
                    };
                    console.log(userData);
                    const data = await AdminPriceService.bulkupdate(selectedLandSales, userData).json();
                    if (data.status === true) {
                        swal("Closing Update Succesfully").then((willDelete) => {
                            if (willDelete) {
                                setAddProduct(false);
                                navigate('/priceList');
                            }
                        })
                        props.parentCallback();
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

    return (
        <>
            <Offcanvas show={addProduct} onHide={() => { setAddProduct(false); setError('') }} className="offcanvas-end customeoff" placement='end'>
                <div className="offcanvas-header">
                    <h5 className="modal-title" id="#gridSystemModal">{props.Title}</h5>
                    <button type="button" className="btn-close"
                        onClick={() => { setAddProduct(false); setError('') }}
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div className="offcanvas-body">
                    <div className="container-fluid">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-xl-6 mb-3">
                                    <label className="form-label">
                                        Product
                                    </label>
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
                                    <label
                                        htmlFor="exampleFormControlInput2"
                                        className="form-label"
                                    >
                                        {" "}
                                        Base Price:
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
                                        Date <span className="text-danger"></span>
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
                                <Link to={"#"} onClick={() => { setAddProduct(false); setError('') }} className="btn btn-danger light ms-1">
                                    Cancel
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </Offcanvas>
        </>
    );
});

export default BulkPriceUpdate;