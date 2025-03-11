import React, { useState, forwardRef, useImperativeHandle, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Offcanvas, Form } from 'react-bootstrap';
import AdminSubdevisionService from "../../../API/Services/AdminService/AdminSubdevisionService";
import swal from "sweetalert";
import Select from "react-select";
import AdminClosingService from "../../../API/Services/AdminService/AdminClosingService";

const BulkLandsaleUpdate = forwardRef((props, ref) => {
    const { selectedLandSales } = props;

    const [SubdivisionCode, setSubdivisionCode] = useState([]);
    const [Error, setError] = useState('');
    const [SubdivisionList, SetSubdivisionList] = useState([]);
    const [addProduct, setAddProduct] = useState(false);

    useImperativeHandle(ref, () => ({
        showEmployeModal() {
            setAddProduct(true)
        }
    }));

    const GetSubdivisionDropDownList = async () => {
        try {
            const response = await AdminSubdevisionService.subdivisionDropDown();
            const responseData = await response.json();
            const formattedData = responseData.data.map((subdivision) => ({
                label: subdivision.name,
                value: subdivision.id,
            }));
            SetSubdivisionList(formattedData);
        } catch (error) {
            console.log("Error fetching subdivision list:", error);
            if (error.name === "HTTPError") {
                const errorJson = await error.response.json();
                console.log(errorJson);
            }
        }
    };

    useEffect(() => {
        GetSubdivisionDropDownList();
    }, []);

    const handleSubdivisionCode = (selectedOption) => {
        setSubdivisionCode(selectedOption);
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
                        "subdivision_id": SubdivisionCode?.value,
                        "sellerleagal": event.target.sellerleagal.value,
                        "address": event.target.address.value,
                        "buyer": event.target.buyer.value,
                        "lender": event.target.lender.value,
                        "closingdate": event.target.closingdate.value,
                        "closingprice": event.target.closingprice.value,
                        "loanamount": event.target.loanamount.value,
                        "document": event.target.document.value,
                        "closing_type": event.target.closing_type.value,
                        "parcel": event.target.parcel.value,
                        "sublegal_name": event.target.sublegal_name.value,
                        "type": event.target.type.value
                    }
                    console.log(userData);
                    const data = await AdminClosingService.bulkupdate(selectedLandSales, userData).json();
                    if (data.status === true) {
                        swal("Records Updated Successfully").then((willDelete) => {
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
        setSubdivisionCode([]);
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
                                    <label className="form-label">Subdivision</label>
                                    <Form.Group controlId="tournamentList">
                                        <Select
                                            options={SubdivisionList}
                                            value={SubdivisionCode}
                                            placeholder={"Select Subdivision..."}
                                            onChange={(selectedOption) => handleSubdivisionCode(selectedOption)}
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
                                    <label htmlFor="exampleFormControlInput2" className="form-label">Seller Legal Name</label>
                                    <input type="text" name='sellerleagal' className="form-control" id="exampleFormControlInput2" placeholder="" />
                                </div>

                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput3" className="form-label">Address</label>
                                    <textarea rows="2" name='address' className="form-control"></textarea>
                                </div>

                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput4" className="form-label">Buyer Name</label>
                                    <input type="text" name='buyer' className="form-control" id="exampleFormControlInput4" placeholder="" />
                                </div>

                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput5" className="form-label">Lender</label>
                                    <input type="text" name='lender' className="form-control" id="exampleFormControlInput5" placeholder="" />
                                </div>

                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput6" className="form-label">Closing Date</label>
                                    <input type="date" name='closingdate' className="form-control" id="exampleFormControlInput6" placeholder="" />
                                </div>

                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput7" className="form-label">Closing Price</label>
                                    <input type="number" name='closingprice' className="form-control" id="exampleFormControlInput7" placeholder="" />
                                </div>

                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput10" className="form-label">Loan Amount</label>
                                    <input type="number" name='loanamount' className="form-control" id="exampleFormControlInput10" placeholder="" />
                                </div>

                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput10" className="form-label">Document</label>
                                    <input type="text" name='document' className="form-control" id="exampleFormControlInput10" placeholder="" />
                                </div>

                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput11" className="form-label">Closing Type</label>
                                    <input type="text" name='closing_type' className="form-control" id="exampleFormControlInput11" placeholder="" />
                                </div>

                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput12" className="form-label">Parcel Number</label>
                                    <input type="text" name='parcel' className="form-control" id="exampleFormControlInput12" placeholder="" />
                                </div>

                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput13" className="form-label">Sub Legal Name</label>
                                    <input type="text" name='sublegal_name' className="form-control" id="exampleFormControlInput13" placeholder="" />
                                </div>

                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput14" className="form-label">Type</label>
                                    <input type="text" name='type' className="form-control" id="exampleFormControlInput14" placeholder="" />
                                </div>

                                <p className='text-danger fs-12'>{Error}</p>

                            </div>

                            <div>
                                <button type="submit" className="btn btn-primary me-1">Submit</button>
                                <Link to={"#"} onClick={() => HandleUpdateCanvasClose()} className="btn btn-danger light ms-1">Cancel</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </Offcanvas>
        </Fragment>
    );
});

export default BulkLandsaleUpdate;