import React, { Fragment, useState, useEffect } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { Form } from 'react-bootstrap';
import AdminTrafficsaleService from "../../../API/Services/AdminService/AdminTrafficsaleService";
import AdminSubdevisionService from "../../../API/Services/AdminService/AdminSubdevisionService";
import swal from "sweetalert";
import Select from "react-select";
import MainPagetitle from "../../layouts/MainPagetitle";
import ClipLoader from "react-spinners/ClipLoader";

const TrafficsaleUpdate = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const page = queryParams.get("page");

    const params = useParams();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [SubdivisionCode, setSubdivisionCode] = useState([]);
    const [Error, setError] = useState('');
    const [SubdivisionList, SetSubdivisionList] = useState([]);
    const [TrafficsaleList, SetTrafficsaleList] = useState([]);
    const [grossSale, setGrossSale] = useState(null);
    const [cancelation, setCancelation] = useState(null);

    useEffect(() => {
        if (localStorage.getItem('usertoken')) {
            GetSubdivision(params.id);
            GetSubdivisionDropDownList();
        }
        else {
            navigate('/');
        }
    }, []);

    useEffect(() => {
        if (TrafficsaleList.subdivision_id && SubdivisionList?.length > 0) {
            const SelectedSubdivision = SubdivisionList?.filter(data => data.value === TrafficsaleList?.subdivision_id);
            handleSubdivisionCode(SelectedSubdivision[0]);
        }

    }, [TrafficsaleList, SubdivisionList]);

    const GetSubdivision = async (id) => {
        setIsLoading(true);
        try {
            let responseData1 = await AdminTrafficsaleService.show(id).json();
            setIsLoading(false);
            SetTrafficsaleList(responseData1);
            setGrossSale(responseData1.grosssales);
            setCancelation(responseData1.cancelations);
        } catch (error) {
            setIsLoading(false);
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();
                setError(errorJson.message);
            }
        }
    };

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
                "subdivision_id": SubdivisionCode ? SubdivisionCode?.value : TrafficsaleList.subdivision_id,
                "weekending": event.target.weekending.value,
                "weeklytraffic": event.target.weeklytraffic.value,
                "grosssales": grossSale,
                "cancelations": cancelation,
                "netsales": grossSale - cancelation,
                "lotreleased": event.target.lotreleased.value,
                "unsoldinventory": event.target.unsoldinventory.value,
            }

            const data = await AdminTrafficsaleService.update(params.id, userData).json();
            
            if (data.status === true) {
                swal("Record Updated Successfully").then((willDelete) => {
                    if (willDelete) {
                        navigate(`/trafficsalelist?page=${page}`);
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
            <MainPagetitle mainTitle="Edit Weekly Traffic & Sale" pageTitle="Edit Weekly Traffic & Sale" parentTitle="Weekly Traffic & Sales" link={`/trafficsalelist?page=${page}`} />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Edit Weekly Traffic & Sale</h4>
                            </div>
                            {isLoading ? (
                                <div className="d-flex justify-content-center align-items-center mb-5 mt-5">
                                    <ClipLoader color="#4474fc" />
                                </div>
                            ) : (
                                <div className="card-body">
                                    <div className="form-validation">
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                <div className="col-xl-6 mb-3">
                                                    <label className="form-label">Subdivision <span className="text-danger">*</span></label>
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
                                                    <label htmlFor="exampleFormControlInput2" className="form-label">Week Ending <span className="text-danger">*</span></label>
                                                    <input type="date" defaultValue={TrafficsaleList.weekending} name='weekending' className="form-control" id="exampleFormControlInput2" placeholder="" />
                                                </div>
                                                <div className="col-xl-6 mb-3">
                                                    <label htmlFor="exampleFormControlInput3" className="form-label">Weekly Traffic <span className="text-danger">*</span></label>
                                                    <input type="number" defaultValue={TrafficsaleList.weeklytraffic} name='weeklytraffic' className="form-control" id="exampleFormControlInput3" placeholder="" />
                                                </div>
                                                <div className="col-xl-6 mb-3">
                                                    <label htmlFor="exampleFormControlInput4" className="form-label">Gross Sales <span className="text-danger">*</span></label>
                                                    <input type="number" value={grossSale} name='grosssales' className="form-control" id="exampleFormControlInput4" placeholder="" onChange={(e) => handleGrossSales(e)} />
                                                </div>
                                                <div className="col-xl-6 mb-3">
                                                    <label htmlFor="exampleFormControlInput5" className="form-label">Cancelations <span className="text-danger">*</span></label>
                                                    <input type="number" value={cancelation} name='cancelations' className="form-control" id="exampleFormControlInput5" placeholder="" onChange={(e) => handleCancelations(e)} />
                                                </div>
                                                <div className="col-xl-6 mb-3">
                                                    <label htmlFor="exampleFormControlInput6" className="form-label">Net Sales <span className="text-danger">*</span></label>
                                                    <input type="number" value={grossSale - cancelation} name='netsales' className="form-control" id="exampleFormControlInput6" placeholder="" disabled style={{ backgroundColor: "#e9ecef", cursor: "not-allowed" }} />
                                                </div>
                                                <div className="col-xl-6 mb-3">
                                                    <label htmlFor="exampleFormControlInput7" className="form-label">Lot Released <span className="text-danger">*</span></label>
                                                    <input type="number" defaultValue={TrafficsaleList.lotreleased} name='lotreleased' className="form-control" id="exampleFormControlInput7" placeholder="" />
                                                </div>
                                                <div className="col-xl-6 mb-3">
                                                    <label htmlFor="exampleFormControlInput10" className="form-label">Unsold Inventory <span className="text-danger">*</span></label>
                                                    <input type="number" defaultValue={TrafficsaleList.unsoldinventory} name='unsoldinventory' className="form-control" id="exampleFormControlInput10" placeholder="" />
                                                </div>
                                                <p className='text-danger fs-12'>{Error}</p>
                                            </div>
                                            <div>
                                                <button type="submit" className="btn btn-primary me-1">Submit</button>
                                                <Link type="reset" to={`/trafficsalelist?page=${page}`} className="btn btn-danger light ms-1">Cancel</Link>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div >
        </Fragment >
    );
};

export default TrafficsaleUpdate;