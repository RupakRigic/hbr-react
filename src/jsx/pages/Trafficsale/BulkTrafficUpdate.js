import React, { useState, forwardRef, useImperativeHandle, useEffect, Fragment } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Offcanvas, Form } from 'react-bootstrap';
import AdminSubdevisionService from "../../../API/Services/AdminService/AdminSubdevisionService";
import swal from "sweetalert";
import AdminTrafficsaleService from "../../../API/Services/AdminService/AdminTrafficsaleService";
import Select from "react-select";

const BulkLandsaleUpdate = forwardRef((props, ref) => {
    const { selectedLandSales } = props;

    const [SubdivisionCode, setSubdivisionCode] = useState('');
    const [Error, setError] = useState('');
    const [SubdivisionList, SetSubdivisionList] = useState([]);
    const [addProduct, setAddProduct] = useState(false);
    const [isActive, setIsActive] = useState([]);

    const isActiveData = [
        { value: '0', label: 'De-active' },
        { value: '1', label: 'Active' }
    ];

    const handleActive = (e) => {
        setIsActive(e);
    };

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
                        "grosssales": event.target.grosssales.value,
                        "cancelations": event.target.cancelations.value,
                        "netsales": event.target.netsales.value,
                        "lotreleased": event.target.lotreleased.value,
                        "unsoldinventory": event.target.unsoldinventory.value,
                        "status": isActive?.value,
                    }

                    const data = await AdminTrafficsaleService.bulkupdate(selectedLandSales, userData).json();

                    if (data.status === true) {
                        swal("Weekly Traffic & sale Update Succesfully").then((willDelete) => {
                            if (willDelete) {
                                setAddProduct(false);
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

    return (
        <Fragment>
            <Offcanvas show={addProduct} onHide={() => { setAddProduct(false); setError(''); setIsActive([]) }} className="offcanvas-end customeoff" placement='end'>
                <div className="offcanvas-header">
                    <h5 className="modal-title" id="#gridSystemModal">{props.Title}</h5>
                    <button type="button" className="btn-close"
                        onClick={() => { setAddProduct(false); setError(''); setIsActive([]) }}
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
                                            onChange={handleSubdivisionCode}
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
                                    <label htmlFor="exampleFormControlInput2" className="form-label"> Week Ending</label>
                                    <input type="date" name='weekending' className="form-control" id="exampleFormControlInput2" placeholder="" />
                                </div>

                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput3" className="form-label"> Weekly Traffic</label>
                                    <input type="number" name='weeklytraffic' className="form-control" id="exampleFormControlInput3" placeholder="" />
                                </div>

                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput4" className="form-label">Gross Sales</label>
                                    <input type="number" name='grosssales' className="form-control" id="exampleFormControlInput4" placeholder="" />
                                </div>

                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput5" className="form-label"> Cancelations</label>
                                    <input type="number" name='cancelations' className="form-control" id="exampleFormControlInput5" placeholder="" />
                                </div>

                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput6" className="form-label"> Net Sales</label>
                                    <input type="number" name='netsales' className="form-control" id="exampleFormControlInput6" placeholder="" />
                                </div>

                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput7" className="form-label"> Lot Released</label>
                                    <input type="number" name='lotreleased' className="form-control" id="exampleFormControlInput7" placeholder="" />
                                </div>

                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput10" className="form-label">Unsold Inventory</label>
                                    <input type="number" name='unsoldinventory' className="form-control" id="exampleFormControlInput10" placeholder="" />
                                </div>

                                <div className="col-xl-6 mb-3">
                                    <label className="form-label">Status</label>
                                    <Select
                                        options={isActiveData}
                                        className=" react-select-container"
                                        classNamePrefix="react-select"
                                        value={isActive}
                                        onChange={handleActive}
                                        placeholder={"Select Status"}
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
                                </div>

                                <p className='text-danger fs-12'>{Error}</p>

                            </div>

                            <div>
                                <button type="submit" className="btn btn-primary me-1">Submit</button>
                                <Link type="reset" to={"#"} onClick={() => { setAddProduct(false); setError('') }} className="btn btn-danger light ms-1">Cancel</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </Offcanvas>
        </Fragment>
    );
});

export default BulkLandsaleUpdate;