import React, { useState, forwardRef, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Offcanvas, Form } from 'react-bootstrap';
import AdminSubdevisionService from "../../../API/Services/AdminService/AdminSubdevisionService";
import swal from "sweetalert";
import AdminTrafficsaleService from "../../../API/Services/AdminService/AdminTrafficsaleService";
import Select from "react-select";
import ClipLoader from 'react-spinners/ClipLoader';

const BulkTrafficUpdate = forwardRef((props, ref) => {
    const { selectedLandSales, canvasShowEdit, seCanvasShowEdit } = props;

    const [SubdivisionCode, setSubdivisionCode] = useState([]);
    const [Error, setError] = useState('');
    const [SubdivisionList, SetSubdivisionList] = useState([]);
    const [grossSale, setGrossSale] = useState(null);
    const [cancelation, setCancelation] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (canvasShowEdit) {
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
                        "weekending": event.target.weekending.value,
                        "weeklytraffic": event.target.weeklytraffic.value,
                        "grosssales": grossSale,
                        "cancelations": cancelation,
                        "netsales": grossSale - cancelation,
                        "lotreleased": event.target.lotreleased.value,
                        "unsoldinventory": event.target.unsoldinventory.value,
                    }

                    const data = await AdminTrafficsaleService.bulkupdate(selectedLandSales, userData).json();

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
    };

    const handleGrossSales = (e) => {
        setGrossSale(e.target.value);
    };

    const handleCancelations = (e) => {
        setCancelation(e.target.value);
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
                                            ></Select>
                                        </Form.Group>
                                    </div>

                                    <div className="col-xl-6 mb-3">
                                        <label htmlFor="exampleFormControlInput2" className="form-label">Week Ending</label>
                                        <input type="date" name='weekending' className="form-control" id="exampleFormControlInput2" placeholder="" />
                                    </div>

                                    <div className="col-xl-6 mb-3">
                                        <label htmlFor="exampleFormControlInput3" className="form-label">Weekly Traffic</label>
                                        <input type="number" name='weeklytraffic' className="form-control" id="exampleFormControlInput3" placeholder="" />
                                    </div>

                                    <div className="col-xl-6 mb-3">
                                        <label htmlFor="exampleFormControlInput4" className="form-label">Gross Sales</label>
                                        <input type="number" name='grosssales' className="form-control" id="exampleFormControlInput4" placeholder="" onChange={(e) => handleGrossSales(e)} />
                                    </div>

                                    <div className="col-xl-6 mb-3">
                                        <label htmlFor="exampleFormControlInput5" className="form-label">Cancelations</label>
                                        <input type="number" name='cancelations' className="form-control" id="exampleFormControlInput5" placeholder="" onChange={(e) => handleCancelations(e)} />
                                    </div>

                                    <div className="col-xl-6 mb-3">
                                        <label htmlFor="exampleFormControlInput6" className="form-label">Net Sales</label>
                                        <input type="number" name='netsales' value={grossSale - cancelation} className="form-control" id="exampleFormControlInput6" placeholder="" disabled style={{ cursor: "not-allowed", backgroundColor: "#e9ecef" }} />
                                    </div>

                                    <div className="col-xl-6 mb-3">
                                        <label htmlFor="exampleFormControlInput7" className="form-label">Lot Released</label>
                                        <input type="number" name='lotreleased' className="form-control" id="exampleFormControlInput7" placeholder="" />
                                    </div>

                                    <div className="col-xl-6 mb-3">
                                        <label htmlFor="exampleFormControlInput10" className="form-label">Unsold Inventory</label>
                                        <input type="number" name='unsoldinventory' className="form-control" id="exampleFormControlInput10" placeholder="" />
                                    </div>

                                    <p className='text-danger fs-12'>{Error}</p>
                                </div>

                                <div>
                                    <button type="submit" className="btn btn-primary me-1">Submit</button>
                                    <Link type="reset" to={"#"} onClick={() => HandleUpdateCanvasClose()} className="btn btn-danger light ms-1">Cancel</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </Offcanvas>
        </Fragment>
    );
});

export default BulkTrafficUpdate;