import React, { Fragment, useState, useEffect } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { Form } from 'react-bootstrap';
import AdminClosingService from "../../../API/Services/AdminService/AdminClosingService";
import AdminSubdevisionService from "../../../API/Services/AdminService/AdminSubdevisionService";
import swal from "sweetalert";
import Select from "react-select";
import ClipLoader from "react-spinners/ClipLoader";
import MainPagetitle from "../../layouts/MainPagetitle";

const ClosingUpdate = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const page = queryParams.get("page");

    const [Error, setError] = useState('');
    const [SubdivisionCode, setSubdivisionCode] = useState([]);
    const [SubdivisionList, SetSubdivisionList] = useState([]);
    const [ClosingsaleList, SetClosingsaleList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedClosingType, setSelectedClosingType] = useState([]);

    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('usertoken')) {
            ShowClosings(params.id);
            GetSubdivisionDropDownList();
        }
        else {
            navigate('/');
        }
    }, []);

    const closingType = [
        { value: "NEW", label: "NEW" },
        { value: "RESALES", label: "RESALES" },
    ];

    useEffect(() => {
        if (ClosingsaleList?.subdivision_id && SubdivisionList?.length > 0) {
            const filter = SubdivisionList?.filter(data => data.value === ClosingsaleList?.subdivision_id);
            handleSubdivisionCode(filter);
        }
    }, [ClosingsaleList, SubdivisionList]);

    useEffect(() => {
        if(ClosingsaleList?.closing_type) {
            let ClosingType = closingType?.filter(data => data.value === ClosingsaleList?.closing_type);
            handleSelectClosingTypeChange(ClosingType);
        }
    }, [ClosingsaleList]);

    const ShowClosings = async (id) => {
        setIsLoading(true);
        try {
            let responseData = await AdminClosingService.show(id).json();
            setIsLoading(false);
            SetClosingsaleList(responseData);
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
                "subdivision_id": SubdivisionCode ? SubdivisionCode?.value : ClosingsaleList.subdivision_id,
                "sellerleagal": event.target.sellerleagal.value,
                "address": event.target.address.value,
                "buyer": event.target.buyer.value,
                "lender": event.target.lender.value,
                "closingdate": event.target.closingdate.value,
                "closingprice": event.target.closingprice.value,
                "loanamount": event.target.loanamount.value,
                "document": event.target.document.value,
                "closing_type": selectedClosingType?.value,
                "parcel": event.target.parcel.value
            }
            const data = await AdminClosingService.update(params.id, userData).json();
            if (data.status === true) {
                swal("Record Updated Successfully").then((willDelete) => {
                    if (willDelete) {
                        navigate(`/closingsaleList?page=${page}`);
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

    const handleSelectClosingTypeChange = (selectedOption) => {
        setSelectedClosingType(selectedOption);
    };

    return (
        <Fragment>
            <MainPagetitle mainTitle="Edit Closing" pageTitle="Edit Closing" parentTitle="Closings" link={`/closingsalelist?page=${page}`} />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Edit Closing</h4>
                            </div>
                            {isLoading ? (
                                <div className="d-flex justify-content-center align-items-center mt-5 h-50">
                                    <ClipLoader color="#4474fc" />
                                </div>
                            ) : (
                                <div className="card-body">
                                    <div className="form-validation">
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                <div className="col-xl-6 mb-3">
                                                    <label className="form-label">Subdivision</label>
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
                                                    <label htmlFor="exampleFormControlInput2" className="form-label">Seller Legal</label>
                                                    <input type="text" defaultValue={ClosingsaleList.sellerleagal} name='sellerleagal' className="form-control" id="exampleFormControlInput2" placeholder="" />
                                                </div>

                                                <div className="col-xl-6 mb-3">
                                                    <label htmlFor="exampleFormControlInput3" className="form-label">Address</label>
                                                    <textarea rows="2" defaultValue={ClosingsaleList.address || "NA"} name='address' className="form-control"></textarea>
                                                </div>

                                                <div className="col-xl-6 mb-3">
                                                    <label htmlFor="exampleFormControlInput4" className="form-label">Buyer</label>
                                                    <input type="text" defaultValue={ClosingsaleList.buyer || "NA"} name='buyer' className="form-control" id="exampleFormControlInput4" placeholder="" />
                                                </div>

                                                <div className="col-xl-6 mb-3">
                                                    <label htmlFor="exampleFormControlInput5" className="form-label">Lender</label>
                                                    <input type="text" defaultValue={ClosingsaleList.lender || "NA"} name='lender' className="form-control" id="exampleFormControlInput5" placeholder="" />
                                                </div>

                                                <div className="col-xl-6 mb-3">
                                                    <label htmlFor="exampleFormControlInput6" className="form-label">Closing Date <span className="text-danger">*</span></label>
                                                    <input type="date" defaultValue={ClosingsaleList.closingdate} name='closingdate' className="form-control" id="exampleFormControlInput6" placeholder="" />
                                                </div>

                                                <div className="col-xl-6 mb-3">
                                                    <label htmlFor="exampleFormControlInput7" className="form-label">Closing Price</label>
                                                    <input type="number" defaultValue={ClosingsaleList.closingprice} name='closingprice' className="form-control" id="exampleFormControlInput7" placeholder="" />
                                                </div>

                                                <div className="col-xl-6 mb-3">
                                                    <label htmlFor="exampleFormControlInput10" className="form-label">Loan Amount</label>
                                                    <input type="number" defaultValue={ClosingsaleList.loanamount} name='loanamount' className="form-control" id="exampleFormControlInput10" placeholder="" />
                                                </div>

                                                <div className="col-xl-6 mb-3">
                                                    <label htmlFor="exampleFormControlInput10" className="form-label">Document</label>
                                                    <input type="text" defaultValue={ClosingsaleList.document || "NA"} name='document' className="form-control" id="exampleFormControlInput10" placeholder="" />
                                                </div>

                                                <div className="col-xl-6 mb-3">
                                                    <label htmlFor="exampleFormControlInput10" className="form-label">Closing Type</label>
                                                    <Form.Group controlId="tournamentList">
                                                        <Select
                                                            name="closing_type"
                                                            options={closingType}
                                                            value={selectedClosingType}
                                                            placeholder={"Select Closing Type"}
                                                            onChange={(selectedOption) => handleSelectClosingTypeChange(selectedOption)}
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
                                                    <label htmlFor="exampleFormControlInput10" className="form-label">Parcel <span className="text-danger">*</span></label>
                                                    <input type="text" defaultValue={ClosingsaleList.parcel || "NA"} name='parcel' className="form-control" id="exampleFormControlInput10" placeholder="" />
                                                </div>

                                                <p className='text-danger fs-12'>{Error}</p>
                                            </div>
                                            <div>
                                                <button type="submit" className="btn btn-primary me-1">Submit</button>
                                                <Link type="reset" to={`/closingsalelist?page=${page}`} className="btn btn-danger light ms-1">Cancel</Link>
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

export default ClosingUpdate;