import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Offcanvas, Form } from 'react-bootstrap';
import AdminSubdevisionService from "../../../API/Services/AdminService/AdminSubdevisionService";
import swal from "sweetalert";
import AdminPermitService from '../../../API/Services/AdminService/AdminPermitService';

const PermitOffcanvas = forwardRef((props, ref) => {
    const navigate = useNavigate();
    const [Error, setError] = useState('');
    const [addProduct, setAddProduct] = useState(false);
    const [SubdivisionCode, setSubdivisionCode] = useState('');
    const [SubdivisionList, SetSubdivisionList] = useState([]);

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
                setError(errorJson.message);
            }
        }
    };

    useEffect(() => {
        GetSubdivisionDropDownList();
    }, []);

    const handleSubdivisionCode = (code) => {
        setSubdivisionCode(code);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            var userData = {
                "subdivision_id": SubdivisionCode.value,
                "parcel": event.target.parcel.value,
                "contractor": event.target.contractor.value,
                "description": event.target.description.value,
                "date": event.target.date.value,
                "dateadded": event.target.dateadded.value,
                "lotnumber": event.target.lotnumber.value,
                "owner": event.target.owner.value,
                "plan": event.target.plan.value,
                "sqft": event.target.sqft.value,
                "value": event.target.value.value,
                "permitnumber": event.target.permitnumber.value,
                "address1": event.target.address1.value,
                "address2": event.target.address2.value
            }
            const data = await AdminPermitService.store(userData).json();
            if (data.status === true) {
                swal("Permit Create Succesfully").then((willDelete) => {
                    if (willDelete) {
                        props.parentCallback();
                        setAddProduct(false);
                        navigate('/permitlist');
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
                                <div className="col-xl-6 mb-3">
                                    <label className="form-label">Subdivision<span className="text-danger">*</span></label>
                                    <Form.Group controlId="tournamentList">
                                        <Form.Select
                                            onChange={handleSubdivisionCode}
                                            value={SubdivisionCode}
                                            className="default-select form-control"
                                        >
                                            <option value=''>Select Subdivision</option>
                                            {SubdivisionList.map((element) => (
                                                <option value={element.value}>{element.label}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput2" className="form-label"> Parcel <span className="text-danger"></span></label>
                                    <input type="text" name='parcel' className="form-control" id="exampleFormControlInput2" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput3" className="form-label"> Contractor <span className="text-danger"></span></label>
                                    <input type="text" name='contractor' className="form-control" id="exampleFormControlInput3" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput4" className="form-label">Description <span className="text-danger"></span></label>
                                    <input type="text" name='description' className="form-control" id="exampleFormControlInput4" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput5" className="form-label"> date <span className="text-danger"></span></label>
                                    <input type="date" name='date' className="form-control" id="exampleFormControlInput5" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput6" className="form-label"> Date Added <span className="text-danger"></span></label>
                                    <input type="date" name='dateadded' className="form-control" id="exampleFormControlInput6" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput7" className="form-label"> Lot Number <span className="text-danger"></span></label>
                                    <input type="number" name='lotnumber' className="form-control" id="exampleFormControlInput7" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput10" className="form-label">Owner<span className="text-danger"></span></label>
                                    <input type="text" name='owner' className="form-control" id="exampleFormControlInput10" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput11" className="form-label">Plan<span className="text-danger"></span></label>
                                    <input type="text" name='plan' className="form-control" id="exampleFormControlInput11" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput12" className="form-label">SQFT<span className="text-danger"></span></label>
                                    <input type="number" name='sqft' className="form-control" id="exampleFormControlInput12" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput16" className="form-label">Value<span className="text-danger"></span></label>
                                    <input type="number" name='value' className="form-control" id="exampleFormControlInput16" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput17" className="form-label">Permit Number<span className="text-danger"></span></label>
                                    <input type="text" name='permitnumber' className="form-control" id="exampleFormControlInput17" placeholder="" />
                                </div>
                                <div className="col-xl-12 mb-3">
                                    <label className="form-label">Address 1 <span className="text-danger"></span></label>
                                    <textarea rows="2" name='address1' className="form-control"></textarea>
                                </div>
                                <div className="col-xl-12 mb-3">
                                    <label className="form-label">Address 2 <span className="text-danger"></span></label>
                                    <textarea rows="2" name='address2' className="form-control"></textarea>
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

export default PermitOffcanvas;