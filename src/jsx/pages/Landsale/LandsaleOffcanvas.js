import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Offcanvas, Form } from 'react-bootstrap';
import AdminSubdevisionService from "../../../API/Services/AdminService/AdminSubdevisionService";
import swal from "sweetalert";
import AdminLandsaleService from "../../../API/Services/AdminService/AdminLandsaleService";
import Select from "react-select";

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
    }, [])

    const handleSubdivisionCode = (code) => {
        setSubdivisionCode(code);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            var userData = {
                "seller": event.target.seller.value,
                "buyer": event.target.buyer.value,
                "location": event.target.location.value,
                "date": event.target.date.value,
                "parcel": event.target.parcel.value,
                "price": event.target.price.value,
                "typeofunit": event.target.typeofunit.value,
                "priceperunit": event.target.priceperunit.value,
                "noofunit": event.target.noofunit.value,
                "notes": event.target.notes.value,
                "doc": event.target.doc.value,
                "zoning": event.target.zoning.value,
                "lat": event.target.lat.value,
                "lng": event.target.lng.value,
                "area": event.target.area.value,
                "zip": event.target.zip.value,
                "subdivision_id": SubdivisionCode ? SubdivisionCode.value : '',
            }
            const data = await AdminLandsaleService.store(userData).json();
            if (data.status === true) {
                swal("Landsale Created Succesfully").then((willDelete) => {
                    if (willDelete) {
                        props.parentCallback();
                        setAddProduct(false);
                        navigate('/landsalelist');
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
                                    <label htmlFor="exampleFormControlInput2" className="form-label"> Seller <span className="text-danger">*</span></label>
                                    <input type="text" name='seller' className="form-control" id="exampleFormControlInput2" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput3" className="form-label"> Buyer <span className="text-danger">*</span></label>
                                    <input type="text" name='buyer' className="form-control" id="exampleFormControlInput3" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput4" className="form-label">Location <span className="text-danger">*</span></label>
                                    <input type="text" name='location' className="form-control" id="exampleFormControlInput4" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput5" className="form-label"> Date <span className="text-danger">*</span></label>
                                    <input type="date" name='date' className="form-control" id="exampleFormControlInput5" placeholder="" />
                                </div>

                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput6" className="form-label"> Parcel </label>
                                    <input type="number" name='parcel' className="form-control" id="exampleFormControlInput6" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput7" className="form-label"> Price </label>
                                    <input type="number" name='price' className="form-control" id="exampleFormControlInput7" placeholder="" />
                                </div>

                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput10" className="form-label">Type of Unit</label>
                                    <input type="text" name='typeofunit' className="form-control" id="exampleFormControlInput10" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput11" className="form-label">Price Per Unit</label>
                                    <input type="number" name='priceperunit' className="form-control" id="exampleFormControlInput11" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput12" className="form-label">No. Of Unit</label>
                                    <input type="number" name='noofunit' className="form-control" id="exampleFormControlInput12" placeholder="" />
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
                                    <input type="number" name='zip' className="form-control" id="exampleFormControlInput17" placeholder="" />
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