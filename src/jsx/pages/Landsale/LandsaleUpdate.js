import React, { Fragment, useState, useEffect } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { Form } from 'react-bootstrap';
import AdminLandsaleService from "../../../API/Services/AdminService/AdminLandsaleService";
import AdminSubdevisionService from "../../../API/Services/AdminService/AdminSubdevisionService";
import swal from "sweetalert";
import Select from "react-select";
import MainPagetitle from "../../layouts/MainPagetitle";
import ClipLoader from "react-spinners/ClipLoader";

const LandsaleUpdate = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const page = queryParams.get("page");

    const [isLoading, setIsLoading] = useState(false);
    const [SubdivisionCode, setSubdivisionCode] = useState([]);
    const [Error, setError] = useState('');
    const [SubdivisionList, SetSubdivisionList] = useState([]);
    const [LandsaleList, SetLandsaleList] = useState([]);
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('usertoken')) {
            ShowLandSales(params.id);
            GetSubdivisionDropDownList();
        }
        else {
            navigate('/');
        }
    }, []);

    useEffect(() => {
        if (LandsaleList?.subdivision_id && SubdivisionList?.length > 0) {
            const filter = SubdivisionList?.filter(data => data.value === LandsaleList?.subdivision_id);
            handleSubdivisionCode(filter);
        }
    }, [LandsaleList, SubdivisionList]);

    const ShowLandSales = async (id) => {
        setIsLoading(true);
        try {
            let responseData = await AdminLandsaleService.show(id).json();
            SetLandsaleList(responseData);
            setIsLoading(false);
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
            const formattedData = [
                { label: "Select Subdivision", value: null }, // Default option
                ...responseData.data.map((subdivision) => ({
                    label: subdivision.name,
                    value: subdivision.id,
                })),
            ];
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
                "seller": event.target.seller.value,
                "buyer": event.target.buyer.value,
                "location": event.target.location.value,
                "date": event.target.date.value,
                "parcel": event.target.parcel.value,
                "price": event.target.price.value,
                "typeofunit": event.target.typeofunit.value,
                "priceperunit": event.target.priceperunit.value,
                "noofunit": event.target.noofunit.value,
                "notes": event.target.notes.value,
                "doc": event.target.doc.value,
                "zoning": event.target.zoning.value,
                "lat": event.target.lat.value,
                "lng": event.target.lng.value,
                "area": event.target.area.value,
                "zip": event.target.zip.value,
                "subdivision_id": SubdivisionCode ? SubdivisionCode?.value : LandsaleList.subdivision_id,
            }

            const data = await AdminLandsaleService.update(params.id, userData).json();

            if (data.status === true) {
                swal("Record Updated Successfully").then((willDelete) => {
                    if (willDelete) {
                        navigate(`/landsalelist?page=${page}`);
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
            <MainPagetitle mainTitle="Edit Land Sale" pageTitle="Edit Land Sale" parentTitle="Land Sales" link={`/landsalelist?page=${page}`} />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Edit Land Sale</h4>
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
                                                    <label htmlFor="exampleFormControlInput2" className="form-label"> Seller <span className="text-danger">*</span></label>
                                                    <input type="text" defaultValue={LandsaleList.seller} name='seller' className="form-control" id="exampleFormControlInput2" placeholder="" />
                                                </div>

                                                <div className="col-xl-6 mb-3">
                                                    <label htmlFor="exampleFormControlInput3" className="form-label"> Buyer <span className="text-danger">*</span></label>
                                                    <input type="text" defaultValue={LandsaleList.buyer} name='buyer' className="form-control" id="exampleFormControlInput3" placeholder="" />
                                                </div>

                                                <div className="col-xl-6 mb-3">
                                                    <label htmlFor="exampleFormControlInput4" className="form-label">Location <span className="text-danger">*</span></label>
                                                    <input type="text" name='location' defaultValue={LandsaleList.location} className="form-control" id="exampleFormControlInput4" placeholder="" />
                                                </div>

                                                <div className="col-xl-6 mb-3">
                                                    <label htmlFor="exampleFormControlInput5" className="form-label">Date <span className="text-danger">*</span></label>
                                                    <input type="date" defaultValue={LandsaleList.date} name='date' className="form-control" id="exampleFormControlInput5" placeholder="" />
                                                </div>

                                                <div className="col-xl-6 mb-3">
                                                    <label htmlFor="exampleFormControlInput6" className="form-label">Parcel</label>
                                                    <input type="text" name='parcel' defaultValue={LandsaleList.parcel} className="form-control" id="exampleFormControlInput6" placeholder="" onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')} />
                                                </div>

                                                <div className="col-xl-6 mb-3">
                                                    <label htmlFor="exampleFormControlInput7" className="form-label">Price</label>
                                                    <input type="number" defaultValue={LandsaleList.price} name='price' className="form-control" id="exampleFormControlInput7" placeholder="" />
                                                </div>

                                                <div className="col-xl-6 mb-3">
                                                    <label htmlFor="exampleFormControlInput10" className="form-label">Type of Unit</label>
                                                    <input type="text" name='typeofunit' defaultValue={LandsaleList.typeofunit} className="form-control" id="exampleFormControlInput10" placeholder="" />
                                                </div>

                                                <div className="col-xl-6 mb-3">
                                                    <label htmlFor="exampleFormControlInput11" className="form-label">Price Per Unit</label>
                                                    <input type="number" defaultValue={LandsaleList.priceperunit} name='priceperunit' className="form-control" id="exampleFormControlInput11" placeholder="" />
                                                </div>

                                                <div className="col-xl-6 mb-3">
                                                    <label htmlFor="exampleFormControlInput12" className="form-label">No. Of Unit</label>
                                                    <input type="number" name='noofunit' defaultValue={LandsaleList.noofunit} className="form-control" id="exampleFormControlInput12" placeholder="" />
                                                </div>

                                                <div className="col-xl-6 mb-3">
                                                    <label htmlFor="exampleFormControlInput16" className="form-label">Notes</label>
                                                    <input type="text" name='notes' defaultValue={LandsaleList.notes} className="form-control" id="exampleFormControlInput16" placeholder="" />
                                                </div>

                                                <div className="col-xl-6 mb-3">
                                                    <label htmlFor="exampleFormControlInput17" className="form-label">Doc</label>
                                                    <input type="text" name='doc' defaultValue={LandsaleList.doc} className="form-control" id="exampleFormControlInput17" placeholder="" />
                                                </div>

                                                <div className="col-xl-6 mb-3">
                                                    <label htmlFor="exampleFormControlInput17" className="form-label">Zoning</label>
                                                    <input type="text" defaultValue={LandsaleList.zoning} name='zoning' className="form-control" id="exampleFormControlInput17" placeholder="" />
                                                </div>

                                                <div className="col-xl-6 mb-3">
                                                    <label htmlFor="exampleFormControlInput17" className="form-label">Latitude</label>
                                                    <input type="text" name='lat' defaultValue={LandsaleList.lat} className="form-control" id="exampleFormControlInput17" placeholder="" />
                                                </div>

                                                <div className="col-xl-6 mb-3">
                                                    <label htmlFor="exampleFormControlInput17" className="form-label">Longitude </label>
                                                    <input type="text" name='lng' defaultValue={LandsaleList.lng} className="form-control" id="exampleFormControlInput17" placeholder="" />
                                                </div>

                                                <div className="col-xl-6 mb-3">
                                                    <label htmlFor="exampleFormControlInput17" className="form-label">Area </label>
                                                    <input type="text" defaultValue={LandsaleList.area} name='area' className="form-control" id="exampleFormControlInput17" placeholder="" />
                                                </div>

                                                <div className="col-xl-6 mb-3">
                                                    <label htmlFor="exampleFormControlInput17" className="form-label">Zipcode </label>
                                                    <input type="text" name='zip' defaultValue={LandsaleList.zip} className="form-control" id="exampleFormControlInput17" placeholder="" onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')} />
                                                </div>

                                                <p className='text-danger fs-12'>{Error}</p>
                                            </div>
                                            <div>
                                                <button type="submit" className="btn btn-primary me-1">Submit</button>
                                                <Link to={`/landsalelist?page=${page}`} className="btn btn-danger light ms-1">Cancel</Link>
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

export default LandsaleUpdate;
