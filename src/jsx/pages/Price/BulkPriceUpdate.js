import React, { useState, forwardRef, useImperativeHandle, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Offcanvas, Form } from 'react-bootstrap';
import swal from "sweetalert";
import Select from "react-select";
import AdminPriceService from '../../../API/Services/AdminService/AdminPriceService';


const BulkPriceUpdate = forwardRef((props, ref) => {
    const { selectedLandSales } = props;

    const [Error, setError] = useState('');
    const [addProduct, setAddProduct] = useState(false);
    const [ProductCode, setProductCode] = useState([]);

    useImperativeHandle(ref, () => ({
        showEmployeModal() {
            setAddProduct(true)
        }
    }));

    const handleProductCode = (code) => {
        setProductCode(code);
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
                        product_id: ProductCode?.value,
                        baseprice: event.target.baseprice.value,
                        date: event.target.date.value,
                    };
                    console.log(userData);
                    const data = await AdminPriceService.bulkupdate(selectedLandSales, userData).json();
                    if (data.status === true) {
                        swal("Records Updated Succesfully.").then((willDelete) => {
                            if (willDelete) {
                                HandleUpdateCanvasClose();
                                props.parentCallback();
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
        setAddProduct(false); 
        setError('');
        setProductCode([]);
    };

    return (
        <Fragment>
            <Offcanvas show={addProduct} onHide={() => HandleUpdateCanvasClose()} className="offcanvas-end customeoff" placement='end'>
                <div className="offcanvas-header">
                    <h5 className="modal-title" id="#gridSystemModal">{props.Title}</h5>
                    <button type="button" className="btn-close"
                        onClick={() => HandleUpdateCanvasClose()}
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
                                        <Select
                                            options={props.productList}
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
                                    <label htmlFor="exampleFormControlInput2" className="form-label">Base Price:</label>
                                    <input type="number" name="baseprice" className="form-control" id="exampleFormControlInput2"/>
                                </div>

                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput9" className="form-label">Date</label>
                                    <input type="date" name="date" className="form-control" id="exampleFormControlInput9" placeholder=""/>
                                </div>
                                <p className="text-danger fs-12">{Error}</p>
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
            </Offcanvas>
        </Fragment>
    );
});

export default BulkPriceUpdate;