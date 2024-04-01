import React, { Fragment, useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Form } from 'react-bootstrap';

import AdminPermitService from '../../../API/Services/AdminService/AdminPermitService';
import AdminSubdevisionService from "../../../API/Services/AdminService/AdminSubdevisionService";
import swal from "sweetalert";
import Select from "react-select";
const PermitUpdate = () => {
    const [SubdivisionCode, setSubdivisionCode] = useState('');
    const [Error, setError] = useState('');
    const [SubdivisionList, SetSubdivisionList] = useState([]);
    const [PermitList, SetPermitList] = useState([]);
    const params = useParams();
    const navigate = useNavigate()
    const GetSubdivision = async (id) => {
        try {

            let responseData1 = await AdminPermitService.show(id).json()
            SetPermitList(responseData1);
            const response = await AdminSubdevisionService.index()
            const responseData = await response.json()
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
    }

    useEffect(() => {
        if (localStorage.getItem('usertoken')) {

            GetSubdivision(params.id);

        }
        else {
            navigate('/');
        }

    }, [])
    const handleSubdivisionCode = code => {

        setSubdivisionCode(code);

    }
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            var userData = {
                "subdivision_id": SubdivisionCode.id ? SubdivisionCode.id : PermitList.subdivision_id,
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

                swal("Permit Update Succesfully").then((willDelete) => {
                    if (willDelete) {
                        navigate('/permitlist')
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
        <Fragment>

            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Edit Permit</h4>
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
                                                <label htmlFor="exampleFormControlInput2" className="form-label"> Parcel <span className="text-danger"></span></label>
                                                <input type="text" defaultValue={PermitList.parcel} name='parcel' className="form-control" id="exampleFormControlInput2" placeholder="" />
                                            </div>
                                            <div className="col-xl-6 mb-3">
                                                <label htmlFor="exampleFormControlInput3" className="form-label"> Contractor <span className="text-danger"></span></label>
                                                <input type="text" defaultValue={PermitList.contractor} name='contractor' className="form-control" id="exampleFormControlInput3" placeholder="" />
                                            </div>
                                            <div className="col-xl-6 mb-3">
                                                <label htmlFor="exampleFormControlInput4" className="form-label">Description <span className="text-danger"></span></label>
                                                <input type="text" defaultValue={PermitList.description} name='description' className="form-control" id="exampleFormControlInput4" placeholder="" />
                                            </div>
                                            <div className="col-xl-6 mb-3">
                                                <label htmlFor="exampleFormControlInput5" className="form-label"> Date <span className="text-danger"></span></label>
                                                <input type="date" defaultValue={PermitList.date} name='date' className="form-control" id="exampleFormControlInput5" placeholder="" />
                                            </div>



                                            <div className="col-xl-6 mb-3">
                                                <label htmlFor="exampleFormControlInput6" className="form-label"> Date Added <span className="text-danger"></span></label>
                                                <input type="date" defaultValue={PermitList.dateadded} name='dateadded' className="form-control" id="exampleFormControlInput6" placeholder="" />
                                            </div>
                                            <div className="col-xl-6 mb-3">
                                                <label htmlFor="exampleFormControlInput7" className="form-label"> Lot Number <span className="text-danger"></span></label>
                                                <input type="number" defaultValue={PermitList.lotnumber} name='lotnumber' className="form-control" id="exampleFormControlInput7" placeholder="" />
                                            </div>



                                            <div className="col-xl-6 mb-3">
                                                <label htmlFor="exampleFormControlInput10" className="form-label">Owner<span className="text-danger"></span></label>
                                                <input type="text" defaultValue={PermitList.owner} name='owner' className="form-control" id="exampleFormControlInput10" placeholder="" />
                                            </div>
                                            <div className="col-xl-6 mb-3">
                                                <label htmlFor="exampleFormControlInput11" className="form-label">Plan<span className="text-danger"></span></label>
                                                <input type="text" name='plan' defaultValue={PermitList.plan} className="form-control" id="exampleFormControlInput11" placeholder="" />
                                            </div>
                                            <div className="col-xl-6 mb-3">
                                                <label htmlFor="exampleFormControlInput12" className="form-label">SQFT<span className="text-danger"></span></label>
                                                <input type="number" defaultValue={PermitList.sqft} name='sqft' className="form-control" id="exampleFormControlInput12" placeholder="" />
                                            </div>

                                            <div className="col-xl-6 mb-3">
                                                <label htmlFor="exampleFormControlInput16" className="form-label">Value<span className="text-danger"></span></label>
                                                <input type="number" defaultValue={PermitList.value} name='value' className="form-control" id="exampleFormControlInput16" placeholder="" />
                                            </div>
                                            <div className="col-xl-6 mb-3">
                                                <label htmlFor="exampleFormControlInput17" className="form-label">Permit Number<span className="text-danger"></span></label>
                                                <input type="text" defaultValue={PermitList.permitnumber} name='permitnumber' className="form-control" id="exampleFormControlInput17" placeholder="" />
                                            </div>
                                            <div className="col-xl-12 mb-3">
                                                <label className="form-label">Address 1 <span className="text-danger"></span></label>
                                                <textarea rows="2" defaultValue={PermitList.address1} name='address1' className="form-control"></textarea>
                                            </div>
                                            <div className="col-xl-12 mb-3">
                                                <label className="form-label">Address 2 <span className="text-danger"></span></label>
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
                        </div>
                    </div>


                </div>
            </div>
        </Fragment>
    );
};

export default PermitUpdate;
