import React, { useState, forwardRef, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Offcanvas, Form } from 'react-bootstrap';
import AdminSubdevisionService from "../../../API/Services/AdminService/AdminSubdevisionService";
import swal from "sweetalert";
import Select from "react-select";
import AdminLandsaleService from "../../../API/Services/AdminService/AdminLandsaleService";
import ClipLoader from 'react-spinners/ClipLoader';
import AdminBuilderService from '../../../API/Services/AdminService/AdminBuilderService';

const BulkLandsaleUpdate = forwardRef((props) => {
    const { selectedLandSales, canvasShowEdit, seCanvasShowEdit } = props;

    const [SubdivisionCode, setSubdivisionCode] = useState([]);
    const [builderCode, setBuilderCode] = useState([]);
    const [Error, setError] = useState('');
    const [SubdivisionList, SetSubdivisionList] = useState([]);
    const [builderListDropDown, setBuilderListDropDown] = useState([]);
    const [noOfUnit, setNoOfUnit] = useState(null);
    const [price, setPrice] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (canvasShowEdit) {
            GetBuilderDropDownList();
            GetSubdivisionDropDownList();
        }
    }, [canvasShowEdit]);

    const GetSubdivisionDropDownList = async () => {
        setIsLoading(true);
        try {
            const response = await AdminSubdevisionService.subdivisionDropDown();
            const responseData = await response.json();
            const formattedData = responseData.data.map((subdivision) => ({
                label: subdivision.name,
                value: subdivision.id,
            }));
            setIsLoading(false);
            SetSubdivisionList(formattedData);
        } catch (error) {
            setIsLoading(false);
            console.log("Error fetching subdivision list:", error);
            if (error.name === "HTTPError") {
                const errorJson = await error.response.json();
                setError(errorJson.message);
            }
        }
    };

    const GetBuilderDropDownList = async () => {
        try {
            const response = await AdminBuilderService.builderDropDown();
            const responseData = await response.json();
            const formattedData = responseData.map((builder) => ({
                label: builder.name,
                value: builder.id,
            }));
            setBuilderListDropDown(formattedData);
        } catch (error) {
            console.log("Error fetching builder list:", error);
            if (error.name === "HTTPError") {
                const errorJson = await error.response.json();
                setError("Something went wrong!");
            }
        }
    };

    const handleBuilderCode = (code) => {
        setBuilderCode(code);
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
                        "seller": event.target.seller.value,
                        "buyer": event.target.buyer.value,
                        "location": event.target.location.value,
                        "date": event.target.date.value,
                        "parcel": event.target.parcel.value,
                        "price": event.target.price.value,
                        "typeofunit": event.target.typeofunit.value,
                        // "priceperunit": event.target.priceperunit.value,
                        "noofunit": event.target.noofunit.value,
                        "notes": event.target.notes.value,
                        "doc": event.target.doc.value,
                        "zoning": event.target.zoning.value,
                        "lat": event.target.lat.value,
                        "lng": event.target.lng.value,
                        "area": event.target.area.value,
                        "zip": event.target.zip.value,
                        "subdivision_id": SubdivisionCode ? SubdivisionCode?.value : "",
                        "builder_id": builderCode ? builderCode?.value : "",
                    }

                    const data = await AdminLandsaleService.bulkupdate(selectedLandSales, userData).json();

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
                        setError(errorJson.message.substr(0, errorJson.message.lastIndexOf(".")));
                    }
                }
            }
        })
    };

    const HandleUpdateCanvasClose = () => {
        seCanvasShowEdit(false);
        setError('');
        setSubdivisionCode([]);
        setPrice(null);
        setNoOfUnit(null);
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
                                                options={builderListDropDown}
                                                value={builderCode}
                                                placeholder={"Select Builder..."}
                                                onChange={(selectedOption) => handleBuilderCode(selectedOption)}
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
                                        <label htmlFor="exampleFormControlInput2" className="form-label">Seller</label>
                                        <input type="text" name='seller' className="form-control" id="exampleFormControlInput2" placeholder="" />
                                    </div>
                                    <div className="col-xl-6 mb-3">
                                        <label htmlFor="exampleFormControlInput3" className="form-label"> Buyer</label>
                                        <input type="text" name='buyer' className="form-control" id="exampleFormControlInput3" placeholder="" />
                                    </div>
                                    <div className="col-xl-6 mb-3">
                                        <label htmlFor="exampleFormControlInput4" className="form-label">Location</label>
                                        <input type="text" name='location' className="form-control" id="exampleFormControlInput4" placeholder="" />
                                    </div>
                                    <div className="col-xl-6 mb-3">
                                        <label htmlFor="exampleFormControlInput5" className="form-label">Date</label>
                                        <input type="date" name='date' className="form-control" id="exampleFormControlInput5" placeholder="" />
                                    </div>

                                    <div className="col-xl-6 mb-3">
                                        <label htmlFor="exampleFormControlInput6" className="form-label">Parcel</label>
                                        <input type="text" name='parcel' className="form-control" id="exampleFormControlInput6" placeholder="" />
                                    </div>
                                    <div className="col-xl-6 mb-3">
                                        <label htmlFor="exampleFormControlInput7" className="form-label">Price ($)</label>
                                        <input type="number" name='price' className="form-control" id="exampleFormControlInput7" placeholder="" onChange={(e) => setPrice(e.target.value)} />
                                    </div>

                                    <div className="col-xl-6 mb-3">
                                        <label htmlFor="exampleFormControlInput10" className="form-label">Type of Unit</label>
                                        <input type="text" name='typeofunit' className="form-control" id="exampleFormControlInput10" placeholder="" />
                                    </div>
                                    <div className="col-xl-6 mb-3">
                                        <label htmlFor="exampleFormControlInput11" className="form-label">Price Per Unit ($)</label>
                                        <input type="number" name='priceperunit' disabled style={{ backgroundColor: "#f0f0f0", cursor: "not-allowed" }} value={noOfUnit ? Math.floor(price / noOfUnit) : 0} className="form-control" id="exampleFormControlInput11" placeholder="" />
                                    </div>
                                    <div className="col-xl-6 mb-3">
                                        <label htmlFor="exampleFormControlInput12" className="form-label">No. Of Unit</label>
                                        <input type="number" name='noofunit' className="form-control" id="exampleFormControlInput12" placeholder="" onChange={(e) => setNoOfUnit(e.target.value)} />
                                    </div>

                                    <div className="col-xl-6 mb-3">
                                        <label htmlFor="exampleFormControlInput16" className="form-label">Notes</label>
                                        <input type="text" name='notes' className="form-control" id="exampleFormControlInput16" placeholder="" />
                                    </div>
                                    <div className="col-xl-6 mb-3">
                                        <label htmlFor="exampleFormControlInput17" className="form-label">Doc</label>
                                        <input type="text" name='doc' className="form-control" id="exampleFormControlInput17" placeholder="" />
                                    </div>
                                    <div className="col-xl-6 mb-3">
                                        <label htmlFor="exampleFormControlInput17" className="form-label">Zoning</label>
                                        <input type="text" name='zoning' className="form-control" id="exampleFormControlInput17" placeholder="" />
                                    </div>
                                    <div className="col-xl-6 mb-3">
                                        <label htmlFor="exampleFormControlInput17" className="form-label">Latitude</label>
                                        <input type="text" name='lat' className="form-control" id="exampleFormControlInput17" placeholder="" />
                                    </div>

                                    <div className="col-xl-6 mb-3">
                                        <label htmlFor="exampleFormControlInput17" className="form-label">Longitude </label>
                                        <input type="text" name='lng' className="form-control" id="exampleFormControlInput17" placeholder="" />
                                    </div>
                                    <div className="col-xl-6 mb-3">
                                        <label htmlFor="exampleFormControlInput17" className="form-label">Area </label>
                                        <input type="text" name='area' className="form-control" id="exampleFormControlInput17" placeholder="" />
                                    </div>
                                    <div className="col-xl-6 mb-3">
                                        <label htmlFor="exampleFormControlInput17" className="form-label">Zipcode </label>
                                        <input type="text" name='zip' className="form-control" id="exampleFormControlInput17" placeholder="" />
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
                )}
            </Offcanvas>
        </Fragment>
    );
});

export default BulkLandsaleUpdate;