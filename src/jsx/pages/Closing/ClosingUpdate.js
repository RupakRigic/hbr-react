import React, { Fragment, useState, useEffect } from "react";
import { useParams, useNavigate,Link } from "react-router-dom";
import { Form } from 'react-bootstrap';

import AdminClosingService from "../../../API/Services/AdminService/AdminClosingService";
import AdminSubdevisionService from "../../../API/Services/AdminService/AdminSubdevisionService";
import swal from "sweetalert";
import Select from "react-select";
const ClosingUpdate = () => {
    const [SubdivisionCode, setSubdivisionCode] = useState('');
    const [Error, setError] = useState('');

    const [SubdivisionList, SetSubdivisionList] = useState([]);
    const [ClosingsaleList, SetClosingsaleList] = useState([]);
    const params = useParams();
    const navigate = useNavigate()

    const GetSubdivision = async (id) => {
        try {

            let responseData1 = await AdminClosingService.show(id).json()
            SetClosingsaleList(responseData1);

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
                "subdivision_id": SubdivisionCode.id ? SubdivisionCode.id : ClosingsaleList.subdivision_id,
                "sellerleagal": event.target.sellerleagal.value,
                "address": event.target.address.value,
                "buyer": event.target.buyer.value,
                "lender": event.target.lender.value,
                "closingdate": event.target.closingdate.value,
                "closingprice": event.target.closingprice.value,
                "loanamount": event.target.loanamount.value,
                "document": event.target.document.value
            }
            const data = await AdminClosingService.update(params.id, userData).json();
            if (data.status === true) {

                swal("Closing Sale Update Succesfully").then((willDelete) => {
                    if (willDelete) {
                        navigate('/closingsaleList')
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
                                <h4 className="card-title">Edit Closing</h4>
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
                                                <label htmlFor="exampleFormControlInput2" className="form-label"> Seller Leagal <span className="text-danger">*</span></label>
                                                <input type="text" defaultValue={ClosingsaleList.sellerleagal} name='sellerleagal' className="form-control" id="exampleFormControlInput2" placeholder="" />
                                            </div>
                                            <div className="col-xl-6 mb-3">
                                                <label htmlFor="exampleFormControlInput3" className="form-label"> Address <span className="text-danger">*</span></label>
                                                <textarea rows="2" defaultValue={ClosingsaleList.address} name='address' className="form-control"></textarea>
                                            </div>
                                            <div className="col-xl-6 mb-3">
                                                <label htmlFor="exampleFormControlInput4" className="form-label">Buyer <span className="text-danger"></span></label>
                                                <input type="text" defaultValue={ClosingsaleList.buyer} name='buyer' className="form-control" id="exampleFormControlInput4" placeholder="" />
                                            </div>
                                            <div className="col-xl-6 mb-3">
                                                <label htmlFor="exampleFormControlInput5" className="form-label"> Lender <span className="text-danger"></span></label>
                                                <input type="text" defaultValue={ClosingsaleList.lender} name='lender' className="form-control" id="exampleFormControlInput5" placeholder="" />
                                            </div>



                                            <div className="col-xl-6 mb-3">
                                                <label htmlFor="exampleFormControlInput6" className="form-label"> Closing Date <span className="text-danger">*</span></label>
                                                <input type="date" defaultValue={ClosingsaleList.closingdate} name='closingdate' className="form-control" id="exampleFormControlInput6" placeholder="" />
                                            </div>
                                            <div className="col-xl-6 mb-3">
                                                <label htmlFor="exampleFormControlInput7" className="form-label"> Closing Price <span className="text-danger">*</span></label>
                                                <input type="number" defaultValue={ClosingsaleList.closingprice} name='closingprice' className="form-control" id="exampleFormControlInput7" placeholder="" />
                                            </div>



                                            <div className="col-xl-6 mb-3">
                                                <label htmlFor="exampleFormControlInput10" className="form-label">Loan Amount<span className="text-danger">*</span></label>
                                                <input type="number" defaultValue={ClosingsaleList.loanamount} name='loanamount' className="form-control" id="exampleFormControlInput10" placeholder="" />
                                            </div>


                                            <div className="col-xl-6 mb-3">
                                                <label htmlFor="exampleFormControlInput10" className="form-label">Document<span className="text-danger"></span></label>
                                                <input type="text" defaultValue={ClosingsaleList.document} name='document' className="form-control" id="exampleFormControlInput10" placeholder="" />
                                            </div>



                                            <p className='text-danger fs-12'>{Error}</p>

                                        </div>
                                        <div>
                                            <button type="submit" className="btn btn-primary me-1">Submit</button>
                                            <Link type="reset" to={"/closingsalelist"} className="btn btn-danger light ms-1">Cancel</Link>

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

export default ClosingUpdate;
