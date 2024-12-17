import React, { Fragment, useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Form } from 'react-bootstrap';
import AdminTrafficsaleService from "../../../API/Services/AdminService/AdminTrafficsaleService";
import AdminSubdevisionService from "../../../API/Services/AdminService/AdminSubdevisionService";
import swal from "sweetalert";
import Select from "react-select";
import MainPagetitle from "../../layouts/MainPagetitle";

const TrafficsaleUpdate = () => {
    const [SubdivisionCode, setSubdivisionCode] = useState('');
    const [Error, setError] = useState('');
    const [isActive, setIsActive] = useState('');
    const [SubdivisionList, SetSubdivisionList] = useState([]);
    const [TrafficsaleList, SetTrafficsaleList] = useState([]);
    const [grossSale, setGrossSale] = useState(null);
    const [cancelation, setCancelation] = useState(null);
    const params = useParams();
    const navigate = useNavigate()
    const isActiveData = [
        { value: '0', label: 'De-active' },
        { value: '1', label: 'Active' }

    ]
    const GetSubdivision = async (id) => {
        try {
            let responseData1 = await AdminTrafficsaleService.show(id).json()
            SetTrafficsaleList(responseData1);
            setGrossSale(responseData1.grosssales);
            setCancelation(responseData1.cancelations);
            let Isactivedata = isActiveData.filter(function (item) {
                return item.value === responseData1.status.toString();
            });

            setIsActive(Isactivedata)
            let response = await AdminSubdevisionService.index()
            let responseData = await response.json()
            let getdata = responseData.filter(function (item) {
                return item.id === responseData1.subdivision_id;
            });
            setSubdivisionCode(getdata)
            SetSubdivisionList(responseData);
        } catch (error) {
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();
                setError(errorJson.message)
            }
        }
    };

    useEffect(() => {
        if (localStorage.getItem('usertoken')) {
            GetSubdivision(params.id);
        }
        else {
            navigate('/');
        }
    }, []);

    const handleSubdivisionCode = (code) => {
        setSubdivisionCode(code);
    };

    const handleActive = (e) => {
        setIsActive(e);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            var userData = {
                "subdivision_id": SubdivisionCode.id ? SubdivisionCode.id : TrafficsaleList.subdivision_id,
                "weekending": event.target.weekending.value,
                "weeklytraffic": event.target.weeklytraffic.value,
                "grosssales": grossSale,
                "cancelations": cancelation,
                "netsales": grossSale - cancelation,
                "lotreleased": event.target.lotreleased.value,
                "unsoldinventory": event.target.unsoldinventory.value,
                "status": isActive.value ? isActive.value : TrafficsaleList.status,
            }
            const data = await AdminTrafficsaleService.update(params.id, userData).json();
            if (data.status === true) {
                swal("Trafficsale Update Succesfully").then((willDelete) => {
                    if (willDelete) {
                        navigate('/trafficsalelist')
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
            <MainPagetitle mainTitle="Edit Weekly Traffic & sale" pageTitle="Edit Weekly Traffic & sale" parentTitle="Weekly Traffic & sales" link="/trafficsalelist" />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Edit Weekly Traffic & sale</h4>
                            </div>
                            <div className="card-body">
                                <div className="form-validation">
                                    <form onSubmit={handleSubmit}>
                                        <div className="row">
                                            <div className="col-xl-6 mb-3">
                                                <label className="form-label">Subdivision<span className="text-danger">*</span></label>
                                                <Form.Group controlId="tournamentList">
                                                    <Select
                                                        options={SubdivisionList}
                                                        onChange={handleSubdivisionCode}
                                                        getOptionValue={(option) => option.name}
                                                        getOptionLabel={(option) => option.name}
                                                        value={SubdivisionCode}
                                                    ></Select>
                                                </Form.Group>
                                            </div>
                                            <div className="col-xl-6 mb-3">
                                                <label htmlFor="exampleFormControlInput2" className="form-label"> Week Ending <span className="text-danger">*</span></label>
                                                <input type="date" defaultValue={TrafficsaleList.weekending} name='weekending' className="form-control" id="exampleFormControlInput2" placeholder="" />
                                            </div>
                                            <div className="col-xl-6 mb-3">
                                                <label htmlFor="exampleFormControlInput3" className="form-label"> Weekly Traffic <span className="text-danger">*</span></label>
                                                <input type="number" defaultValue={TrafficsaleList.weeklytraffic} name='weeklytraffic' className="form-control" id="exampleFormControlInput3" placeholder="" />
                                            </div>
                                            <div className="col-xl-6 mb-3">
                                                <label htmlFor="exampleFormControlInput4" className="form-label">Gross Sales <span className="text-danger">*</span></label>
                                                <input type="number" value={grossSale} name='grosssales' className="form-control" id="exampleFormControlInput4" placeholder="" onChange={(e) => handleGrossSales(e)} />
                                            </div>
                                            <div className="col-xl-6 mb-3">
                                                <label htmlFor="exampleFormControlInput5" className="form-label"> Cancelations <span className="text-danger">*</span></label>
                                                <input type="number" value={cancelation} name='cancelations' className="form-control" id="exampleFormControlInput5" placeholder="" onChange={(e) => handleCancelations(e)} />
                                            </div>
                                            <div className="col-xl-6 mb-3">
                                                <label htmlFor="exampleFormControlInput6" className="form-label"> Net Sales <span className="text-danger">*</span></label>
                                                <input type="number" value={grossSale - cancelation} name='netsales' className="form-control" id="exampleFormControlInput6" placeholder="" disabled style={{ cursor: "not-allowed" }} />
                                            </div>
                                            <div className="col-xl-6 mb-3">
                                                <label htmlFor="exampleFormControlInput7" className="form-label"> Lot Released <span className="text-danger">*</span></label>
                                                <input type="number" defaultValue={TrafficsaleList.lotreleased} name='lotreleased' className="form-control" id="exampleFormControlInput7" placeholder="" />
                                            </div>
                                            <div className="col-xl-6 mb-3">
                                                <label htmlFor="exampleFormControlInput10" className="form-label">Unsold Inventory<span className="text-danger">*</span></label>
                                                <input type="number" defaultValue={TrafficsaleList.unsoldinventory} name='unsoldinventory' className="form-control" id="exampleFormControlInput10" placeholder="" />
                                            </div>
                                            <div className="col-xl-6 mb-3">
                                                <label className="form-label">Status</label>
                                                <Select
                                                    options={isActiveData}
                                                    className=" react-select-container"
                                                    classNamePrefix="react-select"
                                                    value={isActive}
                                                    onChange={handleActive}
                                                />
                                            </div>
                                            <p className='text-danger fs-12'>{Error}</p>
                                        </div>
                                        <div>
                                            <button type="submit" className="btn btn-primary me-1">Submit</button>
                                            <Link type="reset" to={"/trafficsalelist"} className="btn btn-danger light ms-1">Cancel</Link>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </Fragment >
    );
};

export default TrafficsaleUpdate;