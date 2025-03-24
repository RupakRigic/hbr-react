import React, { useState, forwardRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Offcanvas, Form } from 'react-bootstrap';
import AdminSubdevisionService from "../../../API/Services/AdminService/AdminSubdevisionService";
import swal from "sweetalert";
import AdminClosingService from "../../../API/Services/AdminService/AdminClosingService";
import Select from "react-select";

const ClosingOffcanvas = forwardRef((props) => {
    const { canvasShowAdd, seCanvasShowAdd } = props;

    const [Error, setError] = useState('');
    const [SubdivisionCode, setSubdivisionCode] = useState('');
    const [SubdivisionList, SetSubdivisionList] = useState([]);

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
                setError(errorJson);
            }
        }
    };

    useEffect(() => {
        if(canvasShowAdd){
            GetSubdivisionDropDownList();
        }
    }, [canvasShowAdd]);

    const handleSubdivisionCode = (code) => {
        setSubdivisionCode(code);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            var userData = {
                "subdivision_id": SubdivisionCode ? SubdivisionCode.value : '',
                "sellerleagal": event.target.sellerleagal.value,
                "address": event.target.address.value,
                "buyer": event.target.buyer.value,
                "lender": event.target.lender.value,
                "closingdate": event.target.closingdate.value,
                "closingprice": event.target.closingprice.value,
                "loanamount": event.target.loanamount.value,
                "document": event.target.document.value,
                "parcel": event.target.parcel.value
            }
            const data = await AdminClosingService.store(userData).json();
            if (data.status === true) {
                swal("Closingsale Created Succesfully").then((willDelete) => {
                    if (willDelete) {
                        props.parentCallback();
                        seCanvasShowAdd(false);
                    }
                })
            }
        }
        catch (error) {
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();
                setError(errorJson.message.substr(0, errorJson.message.lastIndexOf(".")));
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
                <div className="offcanvas-body">
                    <div className="container-fluid">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-xl-6 mb-3">
                                    <label className="form-label">Subdivision</label>
                                    <Form.Group controlId="tournamentList">
                                        <Select
                                            options={SubdivisionList}
                                            onChange={(selectedOption) => handleSubdivisionCode(selectedOption)}
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
                                    <label htmlFor="exampleFormControlInput2" className="form-label">Seller Legal</label>
                                    <input type="text" name='sellerleagal' className="form-control" id="exampleFormControlInput2" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput3" className="form-label">Address</label>
                                    <textarea rows="2" name='address' className="form-control"></textarea>
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput4" className="form-label">Buyer</label>
                                    <input type="text" name='buyer' className="form-control" id="exampleFormControlInput4" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput5" className="form-label">Lender</label>
                                    <input type="text" name='lender' className="form-control" id="exampleFormControlInput5" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput6" className="form-label">Closing Date <span className="text-danger">*</span></label>
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
                                    <label htmlFor="exampleFormControlInput10" className="form-label">Parcel <span className="text-danger">*</span></label>
                                    <input type="text" name='parcel' className="form-control" id="exampleFormControlInput10" placeholder="" />
                                </div>
                                <p className='text-danger fs-12'>{Error}</p>
                            </div>
                            <div>
                                <button type="submit" className="btn btn-primary me-1">Submit</button>
                                <Link to={"#"} onClick={() => seCanvasShowAdd(false)} className="btn btn-danger light ms-1">Cancel</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </Offcanvas>
        </>
    );
});

export default ClosingOffcanvas;