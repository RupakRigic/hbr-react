import React, { useState, forwardRef, useImperativeHandle, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Offcanvas, Form } from 'react-bootstrap';
import AdminSubdevisionService from "../../../API/Services/AdminService/AdminSubdevisionService";
import swal from "sweetalert";
import AdminTrafficsaleService from "../../../API/Services/AdminService/AdminTrafficsaleService";
import Select from "react-select";
import ClipLoader from 'react-spinners/ClipLoader';

const TrafficsaleOffcanvas = forwardRef((props) => {
    const { canvasShowAdd, seCanvasShowAdd } = props;

    const [Error, setError] = useState('');
    const [SubdivisionCode, setSubdivisionCode] = useState('');
    const [SubdivisionList, SetSubdivisionList] = useState([]);
    const [grossSale, setGrossSale] = useState(null);
    const [cancelation, setCancelation] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (canvasShowAdd) {
            GetSubdivisionDropDownList();
        }
    }, [canvasShowAdd]);

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
        try {
            var userData = {
                "subdivision_id": SubdivisionCode ? SubdivisionCode.value : '',
                "weekending": event.target.weekending.value,
                "weeklytraffic": event.target.weeklytraffic.value,
                "grosssales": grossSale,
                "cancelations": cancelation,
                "netsales": grossSale - cancelation,
                "lotreleased": event.target.lotreleased.value,
                "unsoldinventory": event.target.unsoldinventory.value,
            }
            const data = await AdminTrafficsaleService.store(userData).json();
            if (data.status === true) {
                swal("Weekly Traffic & Sales Created Successfully").then((willDelete) => {
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
                setError(errorJson.message.substr(0, errorJson.message.lastIndexOf(".")))
            }
        }
    };

    const handleGrossSales = (e) => {
        setGrossSale(e.target.value);
    };

    const handleCancelations = (e) => {
        setCancelation(e.target.value);
    };

    return (
        <Fragment>
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
                                        <label className="form-label">Subdivision <span className="text-danger">*</span></label>
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
                                        <label htmlFor="exampleFormControlInput2" className="form-label">Week Ending <span className="text-danger">*</span></label>
                                        <input type="date" name='weekending' className="form-control" id="exampleFormControlInput2" placeholder="" />
                                    </div>
                                    <div className="col-xl-6 mb-3">
                                        <label htmlFor="exampleFormControlInput3" className="form-label">Weekly Traffic <span className="text-danger">*</span></label>
                                        <input type="number" name='weeklytraffic' className="form-control" id="exampleFormControlInput3" placeholder="" />
                                    </div>
                                    <div className="col-xl-6 mb-3">
                                        <label htmlFor="exampleFormControlInput4" className="form-label">Gross Sales <span className="text-danger">*</span></label>
                                        <input type="number" name='grosssales' className="form-control" id="exampleFormControlInput4" placeholder="" onChange={(e) => handleGrossSales(e)} />
                                    </div>
                                    <div className="col-xl-6 mb-3">
                                        <label htmlFor="exampleFormControlInput5" className="form-label">Cancelations <span className="text-danger">*</span></label>
                                        <input type="number" name='cancelations' className="form-control" id="exampleFormControlInput5" placeholder="" onChange={(e) => handleCancelations(e)} />
                                    </div>
                                    <div className="col-xl-6 mb-3">
                                        <label htmlFor="exampleFormControlInput6" className="form-label">Net Sales <span className="text-danger">*</span></label>
                                        <input type="number" name='netsales' value={grossSale - cancelation} className="form-control" id="exampleFormControlInput6" placeholder="" disabled style={{ backgroundColor: "#e9ecef", cursor: "not-allowed" }} />
                                    </div>
                                    <div className="col-xl-6 mb-3">
                                        <label htmlFor="exampleFormControlInput7" className="form-label">Lot Released <span className="text-danger">*</span></label>
                                        <input type="number" name='lotreleased' className="form-control" id="exampleFormControlInput7" placeholder="" />
                                    </div>
                                    <div className="col-xl-6 mb-3">
                                        <label htmlFor="exampleFormControlInput10" className="form-label">Unsold Inventory <span className="text-danger">*</span></label>
                                        <input type="number" name='unsoldinventory' className="form-control" id="exampleFormControlInput10" placeholder="" />
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
                )}
            </Offcanvas>
        </Fragment>
    );
});

export default TrafficsaleOffcanvas;