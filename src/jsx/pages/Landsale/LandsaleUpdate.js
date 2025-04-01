import React, { Fragment, useState, useEffect } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { Form } from 'react-bootstrap';
import AdminLandsaleService from "../../../API/Services/AdminService/AdminLandsaleService";
import AdminSubdevisionService from "../../../API/Services/AdminService/AdminSubdevisionService";
import swal from "sweetalert";
import Select from "react-select";
import MainPagetitle from "../../layouts/MainPagetitle";
import ClipLoader from "react-spinners/ClipLoader";
import AdminBuilderService from "../../../API/Services/AdminService/AdminBuilderService";

const LandsaleUpdate = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const page = queryParams.get("page");

    const params = useParams();
    const navigate = useNavigate();

    const [isLoadingLandSale, setIsLoadingLandSale] = useState(false);
    const [isLoadingBuilder, setIsLoadingBuilder] = useState(false);
    const [isLoadingSubdivision, setIsLoadingSubdivision] = useState(false);
    const [builderCode, setBuilderCode] = useState([]);
    const [SubdivisionCode, setSubdivisionCode] = useState([]);
    const [Error, setError] = useState('');
    const [subdivisionListDropDown, setSubdivisionListDropDown] = useState([]);
    const [builderListDropDown, setBuilderListDropDown] = useState([]);
    const [LandsaleList, SetLandsaleList] = useState([]);
    const [noOfUnit, setNoOfUnit] = useState(null);
    const [price, setPrice] = useState(null);

    useEffect(() => {
        if (localStorage.getItem('usertoken')) {
            ShowLandSales(params.id);
            GetBuilderDropDownList();
        }
        else {
            navigate('/');
        }
    }, []);

    useEffect(() => {
        if (LandsaleList?.builder_id && builderListDropDown?.length > 0) {
            const filter = builderListDropDown?.filter(data => data.value === LandsaleList?.builder_id);
            handleBuilderCode(filter[0]);
        }
    }, [LandsaleList, builderListDropDown]);

    useEffect(() => {
        if (LandsaleList?.id) {
            SubdivisionByBuilderIDList(builderCode);
        }
    }, [builderCode, LandsaleList]);

    const ShowLandSales = async (id) => {
        setIsLoadingLandSale(true);
        try {
            let responseData = await AdminLandsaleService.show(id).json();
            SetLandsaleList(responseData);
            setPrice(responseData.price);
            setNoOfUnit(responseData.noofunit);
            setIsLoadingLandSale(false);
        } catch (error) {
            setIsLoadingLandSale(false);
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();
                setError(errorJson.message);
            }
        }
    };

    const GetBuilderDropDownList = async () => {
        setIsLoadingBuilder(true);
        try {
            const response = await AdminBuilderService.builderDropDown();
            const responseData = await response.json();
            const formattedData = [
                { label: "Select Builder None", value: "" }, // Default option
                ...responseData.map((builder) => ({
                    label: builder.name,
                    value: builder.id,
                })),
            ];
            setIsLoadingBuilder(false);
            setBuilderListDropDown(formattedData);
        } catch (error) {
            setIsLoadingBuilder(false);
            console.log("Error fetching builder list:", error);
            if (error.name === "HTTPError") {
                const errorJson = await error.response.json();
                setError("Something went wrong!");
            }
        }
    };

    const SubdivisionByBuilderIDList = async (builderId) => {
        setIsLoadingSubdivision(true);
        try {

            var userData = {
                builder_ids: (builderId?.value === "" || builderId?.value === undefined || builderId?.value === null) ? [] : [builderId.value]
            }
            const response = await AdminSubdevisionService.subdivisionbybuilderidlist(userData);
            const responseData = await response.json();
            const formattedData = [
                { label: "Select Subdivision None", value: "" },
                ...responseData.data.map((subdivision) => ({
                    label: subdivision.name,
                    value: subdivision.id,
                })),
            ];
            const filter = formattedData?.filter(data => data.value === LandsaleList?.subdivision_id);
            handleSubdivisionCode(filter?.length > 0 ? filter[0] : formattedData[0]);
            setSubdivisionListDropDown(formattedData);
            setIsLoadingSubdivision(false);
        } catch (error) {
            setIsLoadingSubdivision(false);
            if (error.name === "HTTPError") {
                const errorJson = await error.response.json();
                setError(errorJson.message);
            }
        }
    };

    const handleBuilderCode = (code) => {
        setBuilderCode(code);
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
                "noofunit": event.target.noofunit.value,
                "notes": event.target.notes.value,
                "doc": event.target.doc.value,
                "zoning": event.target.zoning.value,
                "lat": event.target.lat.value,
                "lng": event.target.lng.value,
                "area": event.target.area.value,
                "zip": event.target.zip.value,
                "subdivision_id": (SubdivisionCode?.value === "" || SubdivisionCode?.value === undefined || SubdivisionCode?.value === null) ? "" : SubdivisionCode?.value,
                "builder_id": (builderCode?.value === "" || builderCode?.value === undefined || builderCode?.value === null) ? "" : builderCode?.value,
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
                            {(isLoadingLandSale || isLoadingBuilder || isLoadingSubdivision) ? (
                                <div className="d-flex justify-content-center align-items-center mb-5 mt-5">
                                    <ClipLoader color="#4474fc" />
                                </div>
                            ) : (
                                <div className="card-body">
                                    <div className="form-validation">
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                <div className="col-xl-6 mb-3">
                                                    <label className="form-label">Builder</label>
                                                    <Form.Group controlId="tournamentList">
                                                        <Select
                                                            name="builder_id"
                                                            options={builderListDropDown}
                                                            value={builderCode}
                                                            placeholder={"Select Builder..."}
                                                            onChange={(selectedOption) => handleBuilderCode(selectedOption)}
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
                                                    <label className="form-label">Subdivision</label>
                                                    <Form.Group controlId="tournamentList">
                                                        <Select
                                                            name="subdivision_id"
                                                            options={subdivisionListDropDown}
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
                                                    <label htmlFor="exampleFormControlInput2" className="form-label">Seller <span className="text-danger">*</span></label>
                                                    <input type="text" defaultValue={LandsaleList.seller} name='seller' className="form-control" id="exampleFormControlInput2" placeholder="" />
                                                </div>

                                                <div className="col-xl-6 mb-3">
                                                    <label htmlFor="exampleFormControlInput3" className="form-label">Buyer <span className="text-danger">*</span></label>
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
                                                    <input type="text" name='parcel' defaultValue={LandsaleList.parcel} className="form-control" id="exampleFormControlInput6" placeholder="" />
                                                </div>

                                                <div className="col-xl-6 mb-3">
                                                    <label htmlFor="exampleFormControlInput7" className="form-label">Price ($)</label>
                                                    <input type="number" defaultValue={LandsaleList.price} name='price' className="form-control" id="exampleFormControlInput7" placeholder="" onChange={(e) => setPrice(e.target.value)} />
                                                </div>

                                                <div className="col-xl-6 mb-3">
                                                    <label htmlFor="exampleFormControlInput10" className="form-label">Type of Unit</label>
                                                    <input type="text" name='typeofunit' defaultValue={LandsaleList.typeofunit} className="form-control" id="exampleFormControlInput10" placeholder="" />
                                                </div>

                                                <div className="col-xl-6 mb-3">
                                                    <label htmlFor="exampleFormControlInput11" className="form-label">Price Per Unit ($)</label>
                                                    <input type="number" value={noOfUnit ? Math.floor(price / noOfUnit) : 0} disabled style={{ backgroundColor: "#f0f0f0", cursor: "not-allowed" }} name='priceperunit' className="form-control" id="exampleFormControlInput11" placeholder="" />
                                                </div>

                                                <div className="col-xl-6 mb-3">
                                                    <label htmlFor="exampleFormControlInput12" className="form-label">No. Of Unit</label>
                                                    <input type="number" name='noofunit' defaultValue={LandsaleList.noofunit} className="form-control" id="exampleFormControlInput12" placeholder="" onChange={(e) => setNoOfUnit(e.target.value)} />
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
                                                    <label htmlFor="exampleFormControlInput17" className="form-label">Longitude</label>
                                                    <input type="text" name='lng' defaultValue={LandsaleList.lng} className="form-control" id="exampleFormControlInput17" placeholder="" />
                                                </div>

                                                <div className="col-xl-6 mb-3">
                                                    <label htmlFor="exampleFormControlInput17" className="form-label">Area</label>
                                                    <input type="text" defaultValue={LandsaleList.area} name='area' className="form-control" id="exampleFormControlInput17" placeholder="" />
                                                </div>

                                                <div className="col-xl-6 mb-3">
                                                    <label htmlFor="exampleFormControlInput17" className="form-label">ZIP Code</label>
                                                    <input type="text" name='zip' defaultValue={LandsaleList.zip} className="form-control" id="exampleFormControlInput17" placeholder="" />
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
