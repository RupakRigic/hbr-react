import React, { Fragment, useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Form } from 'react-bootstrap';
import AdminPermitService from '../../../API/Services/AdminService/AdminPermitService';
import AdminSubdevisionService from "../../../API/Services/AdminService/AdminSubdevisionService";
import swal from "sweetalert";
import Select from "react-select";
import MainPagetitle from "../../layouts/MainPagetitle";
import ClipLoader from "react-spinners/ClipLoader";

const PermitUpdate = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [SubdivisionCode, setSubdivisionCode] = useState([]);
    const [Error, setError] = useState('');
    const [SubdivisionList, SetSubdivisionList] = useState([]);
    const [PermitList, SetPermitList] = useState([]);
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('usertoken')) {
            ShowPermits(params.id);
            GetSubdivisionDropDownList();
        }
        else {
            navigate('/');
        }
    }, []);

    useEffect(() => {
        if (PermitList?.subdivision_id && SubdivisionList?.length > 0) {
            const filter = SubdivisionList?.filter(data => data.value === PermitList?.subdivision_id);
            handleSubdivisionCode(filter[0]);
        }
    }, [PermitList, SubdivisionList]);

    const ShowPermits = async (id) => {
        setIsLoading(true);
        try {
            let responseData = await AdminPermitService.show(id).json();
            setIsLoading(false);
            SetPermitList(responseData);
        } catch (error) {
            setIsLoading(false);
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();
                setError(errorJson.message);
            }
        }
    };

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

        try {
            var userData = {
                "subdivision_id": SubdivisionCode ? SubdivisionCode?.value : PermitList.subdivision_id,
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
            const data = await AdminPermitService.update(params.id, userData).json();
            if (data.status === true) {
                swal("Record Updated Successfully").then((willDelete) => {
                    if (willDelete) {
                        navigate('/permitlist');
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
    };

    return (
        <Fragment>
            <MainPagetitle mainTitle="Edit Permit" pageTitle="Edit Permit" parentTitle="Permits" link="/permitlist" />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Edit Permit</h4>
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
                                                    <label className="form-label">Subdivision<span className="text-danger">*</span></label>
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
                                                    <label htmlFor="exampleFormControlInput2" className="form-label">Parcel</label>
                                                    <input type="text" defaultValue={PermitList.parcel} name='parcel' className="form-control" id="exampleFormControlInput2" placeholder="" onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')} />
                                                </div>

                                                <div className="col-xl-6 mb-3">
                                                    <label htmlFor="exampleFormControlInput3" className="form-label">Contractor</label>
                                                    <input type="text" defaultValue={PermitList.contractor} name='contractor' className="form-control" id="exampleFormControlInput3" placeholder="" />
                                                </div>

                                                <div className="col-xl-6 mb-3">
                                                    <label htmlFor="exampleFormControlInput4" className="form-label">Description</label>
                                                    <input type="text" defaultValue={PermitList.description} name='description' className="form-control" id="exampleFormControlInput4" placeholder="" />
                                                </div>

                                                <div className="col-xl-6 mb-3">
                                                    <label htmlFor="exampleFormControlInput5" className="form-label"> Date</label>
                                                    <input type="date" defaultValue={PermitList.date} name='date' className="form-control" id="exampleFormControlInput5" placeholder="" />
                                                </div>

                                                <div className="col-xl-6 mb-3">
                                                    <label htmlFor="exampleFormControlInput6" className="form-label">Date Added</label>
                                                    <input type="date" defaultValue={PermitList.dateadded} name='dateadded' className="form-control" id="exampleFormControlInput6" placeholder="" />
                                                </div>

                                                <div className="col-xl-6 mb-3">
                                                    <label htmlFor="exampleFormControlInput7" className="form-label">Lot Number</label>
                                                    <input type="number" defaultValue={PermitList.lotnumber} name='lotnumber' className="form-control" id="exampleFormControlInput7" placeholder="" />
                                                </div>

                                                <div className="col-xl-6 mb-3">
                                                    <label htmlFor="exampleFormControlInput10" className="form-label">Owner</label>
                                                    <input type="text" defaultValue={PermitList.owner} name='owner' className="form-control" id="exampleFormControlInput10" placeholder="" />
                                                </div>

                                                <div className="col-xl-6 mb-3">
                                                    <label htmlFor="exampleFormControlInput11" className="form-label">Plan</label>
                                                    <input type="text" name='plan' defaultValue={PermitList.plan} className="form-control" id="exampleFormControlInput11" placeholder="" />
                                                </div>

                                                <div className="col-xl-6 mb-3">
                                                    <label htmlFor="exampleFormControlInput12" className="form-label">SQFT</label>
                                                    <input type="number" defaultValue={PermitList.sqft} name='sqft' className="form-control" id="exampleFormControlInput12" placeholder="" />
                                                </div>

                                                <div className="col-xl-6 mb-3">
                                                    <label htmlFor="exampleFormControlInput16" className="form-label">Value</label>
                                                    <input type="number" defaultValue={PermitList.value} name='value' className="form-control" id="exampleFormControlInput16" placeholder="" />
                                                </div>

                                                <div className="col-xl-6 mb-3">
                                                    <label htmlFor="exampleFormControlInput17" className="form-label">Permit Number</label>
                                                    <input type="text" defaultValue={PermitList.permitnumber} name='permitnumber' className="form-control" id="exampleFormControlInput17" placeholder="" />
                                                </div>

                                                <div className="col-xl-12 mb-3">
                                                    <label className="form-label">Address 1</label>
                                                    <textarea rows="2" defaultValue={PermitList.address1} name='address1' className="form-control"></textarea>
                                                </div>

                                                <div className="col-xl-12 mb-3">
                                                    <label className="form-label">Address 2</label>
                                                    <textarea rows="2" defaultValue={PermitList.address2} name='address2' className="form-control"></textarea>
                                                </div>

                                                <p className='text-danger fs-12'>{Error}</p>
                                            </div>
                                            <div>
                                                <button type="submit" className="btn btn-primary me-1">Submit</button>
                                                <Link to={"/permitlist"} className="btn btn-danger light ms-1">Cancel</Link>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default PermitUpdate;
