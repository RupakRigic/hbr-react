import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Offcanvas, Form } from 'react-bootstrap';

import AdminSubdevisionService from "../../../API/Services/AdminService/AdminSubdevisionService";

import swal from "sweetalert";
import AdminTrafficsaleService from "../../../API/Services/AdminService/AdminTrafficsaleService";
const PermitOffcanvas = forwardRef((props, ref) => {

    const [isActive, setIsActive] = useState('0');
    const [Error, setError] = useState('');
    const [addProduct, setAddProduct] = useState(false);
    const [SubdivisionCode, setSubdivisionCode] = useState('');
    const [SubdivisionList, SetSubdivisionList] = useState([]);
    useImperativeHandle(ref, () => ({
        showEmployeModal() {
            setAddProduct(true)
        }
    }));

    const navigate = useNavigate()
    const getSubdivisionList = async () => {

        try {

            const response = await AdminSubdevisionService.index()
            const responseData = await response.json()
            SetSubdivisionList(responseData.data)

        } catch (error) {
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();

                setError(errorJson.message)
            }
        }
    }
    useEffect(() => {
        if (localStorage.getItem('usertoken')) {

            getSubdivisionList();

        }
        else {
            navigate('/');
        }


    }, [])

    const handleSubdivisionCode = code => {

        setSubdivisionCode(code.target.value);

    }
    const handleActive = e => {

        setIsActive(e.target.value);

    }
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            var userData = {

                "subdivision_id": SubdivisionCode,
                "weekending": event.target.weekending.value,
                "weeklytraffic": event.target.weeklytraffic.value,
                "grosssales": event.target.grosssales.value,
                "cancelations": event.target.cancelations.value,
                "netsales": event.target.netsales.value,
                "lotreleased": event.target.lotreleased.value,
                "unsoldinventory": event.target.unsoldinventory.value,
                "status": isActive ? isActive : ''
            }
            const data = await AdminTrafficsaleService.store(userData).json();
            if (data.status === true) {

                swal("Weekly Traffic & sale Created Succesfully").then((willDelete) => {
                    if (willDelete) {
                        props.parentCallback();
                        setAddProduct(false)
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
                                    <label className="form-label">Subdivision<span className="text-danger">*</span></label>
                                    <Form.Group controlId="tournamentList">

                                        <Form.Select
                                            onChange={handleSubdivisionCode}
                                            value={SubdivisionCode}
                                            className="default-select form-control"
                                        >
                                            <option value=''>Select Subdivision</option>
                                            {
                                                SubdivisionList.map((element) => (
                                                    <option value={element.id}>{element.name}</option>
                                                ))
                                            }
                                        </Form.Select>
                                    </Form.Group>

                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput2" className="form-label"> Week Ending <span className="text-danger">*</span></label>
                                    <input type="date" name='weekending' className="form-control" id="exampleFormControlInput2" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput3" className="form-label"> Weekly Traffic <span className="text-danger">*</span></label>
                                    <input type="number" name='weeklytraffic' className="form-control" id="exampleFormControlInput3" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput4" className="form-label">Gross Sales <span className="text-danger">*</span></label>
                                    <input type="number" name='grosssales' className="form-control" id="exampleFormControlInput4" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput5" className="form-label"> Cancelations <span className="text-danger">*</span></label>
                                    <input type="number" name='cancelations' className="form-control" id="exampleFormControlInput5" placeholder="" />
                                </div>



                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput6" className="form-label"> Net Sales <span className="text-danger">*</span></label>
                                    <input type="number" name='netsales' className="form-control" id="exampleFormControlInput6" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput7" className="form-label"> Lot Released <span className="text-danger">*</span></label>
                                    <input type="number" name='lotreleased' className="form-control" id="exampleFormControlInput7" placeholder="" />
                                </div>



                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput10" className="form-label">Unsold Inventory<span className="text-danger">*</span></label>
                                    <input type="number" name='unsoldinventory' className="form-control" id="exampleFormControlInput10" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label className="form-label">Status<span className="text-danger"></span></label>
                                    <select className="default-select form-control" onChange={handleActive} >

                                        <option value="1">Active</option>
                                        <option value="0">De-active</option>

                                    </select>

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