import React, { useState, forwardRef, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Offcanvas, Form } from 'react-bootstrap';
import AdminSubdevisionService from "../../../API/Services/AdminService/AdminSubdevisionService";
import swal from "sweetalert";
import AdminPermitService from "../../../API/Services/AdminService/AdminPermitService";
import Select from "react-select";

const BulkLandsaleUpdate = forwardRef((props) => {
    const { selectedLandSales, canvasShowEdit, seCanvasShowEdit } = props;

    const [SubdivisionCode, setSubdivisionCode] = useState([]);
    const [Error, setError] = useState('');
    const [SubdivisionList, SetSubdivisionList] = useState([]);

    useEffect(() => {
        if (canvasShowEdit) {
            GetSubdivisionDropDownList();
        }
    }, [canvasShowEdit]);

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

    const handleSubdivisionCode = (code) => {
        setSubdivisionCode(code);
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
                    console.log(userData);
                    const data = await AdminPermitService.bulkupdate(selectedLandSales, userData).json();
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
        seCanvasShowEdit(false); 
        setError('');
        setSubdivisionCode([]);
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
                                            placeholder={"Select Subdivision..."}
                                            getOptionValue={(option) => option.name}
                                            getOptionLabel={(option) => option.label}
                                            value={SubdivisionCode}
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
                                    <label htmlFor="exampleFormControlInput2" className="form-label">Parcel</label>
                                    <input type="text" name='parcel' className="form-control" id="exampleFormControlInput2" placeholder="" />
                                </div>

                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput3" className="form-label">Contractor</label>
                                    <input type="text" name='contractor' className="form-control" id="exampleFormControlInput3" placeholder="" />
                                </div>

                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput4" className="form-label">Description</label>
                                    <input type="text" name='description' className="form-control" id="exampleFormControlInput4" placeholder="" />
                                </div>

                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput5" className="form-label">Date</label>
                                    <input type="date" name='date' className="form-control" id="exampleFormControlInput5" placeholder="" />
                                </div>

                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput6" className="form-label">Date Added</label>
                                    <input type="date" name='dateadded' className="form-control" id="exampleFormControlInput6" placeholder="" />
                                </div>

                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput7" className="form-label">Lot Number</label>
                                    <input type="number" name='lotnumber' className="form-control" id="exampleFormControlInput7" placeholder="" />
                                </div>

                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput10" className="form-label">Owner</label>
                                    <input type="text" name='owner' className="form-control" id="exampleFormControlInput10" placeholder="" />
                                </div>

                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput11" className="form-label">Plan</label>
                                    <input type="text" name='plan' className="form-control" id="exampleFormControlInput11" placeholder="" />
                                </div>

                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput12" className="form-label">SQFT</label>
                                    <input type="number" name='sqft' className="form-control" id="exampleFormControlInput12" placeholder="" />
                                </div>

                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput16" className="form-label">Value</label>
                                    <input type="number" name='value' className="form-control" id="exampleFormControlInput16" placeholder="" />
                                </div>

                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput17" className="form-label">Permit Number</label>
                                    <input type="text" name='permitnumber' className="form-control" id="exampleFormControlInput17" placeholder="" />
                                </div>

                                <div className="col-xl-12 mb-3">
                                    <label className="form-label">Address 1</label>
                                    <textarea rows="2" name='address1' className="form-control"></textarea>
                                </div>

                                <div className="col-xl-12 mb-3">
                                    <label className="form-label">Address 2</label>
                                    <textarea rows="2" name='address2' className="form-control"></textarea>
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