import React, { useState, forwardRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Offcanvas, Form } from 'react-bootstrap';
import AdminSubdevisionService from "../../../API/Services/AdminService/AdminSubdevisionService";
import AdminBuilderService from '../../../API/Services/AdminService/AdminBuilderService';
import Select from "react-select";
import swal from "sweetalert";

const SubdivisionOffcanvas = forwardRef((props) => {
    const { canvasShowAdd, seCanvasShowAdd } = props;

    const [BuilderCode, setBuilderCode] = useState(null);
    const [Error, setError] = useState('');
    const [status, setStatus] = useState('1');
    const [productType, setProductType] = useState('');
    const [reporting, setReporting] = useState('1');
    const [single, setSingle] = useState('0');
    const [age, setAge] = useState('0');
    const [area, setArea] = useState('');
    const [juridiction, setJuridiction] = useState('');
    const [gate, setGate] = useState('0');
    const [options, setOptions] = useState([]);
    const [masterPlanDropDownList, setMasterPlanDropDownList] = useState([]);
    const [selectedMasterPlan, setSelectedMasterPlan] = useState([]);

    useEffect(() => {
        if (canvasShowAdd) {
            GetBuilderList();
            GetMasterPlanDropDownList();
        }
    }, [canvasShowAdd]);

    const handleStatus = (e) => {
        setStatus(e.target.value);
        if (e.target.value == 1 ) {
            handleReporting(e);
        } else {
            setReporting(reporting);
        }
    };

    const handleReporting = (e) => {
        if(status == 1) {
            setReporting("1");
        } else {
            setReporting(e.target.value);
        }
    };

    const handleProductType = (e) => {
        setProductType(e.target.value);
    };

    const handleSingle = (e) => {
        setSingle(e.target.value);
    };

    const handleAge = (e) => {
        setAge(e.target.value);
    };

    const handleArea = (e) => {
        setArea(e.target.value);
    };

    const handleJurisdiction = (e) => {
        setJuridiction(e.target.value);
    };

    const handleGate = (e) => {
        setGate(e.target.value);
    };

    const GetBuilderList = async () => {
        try {
            const response = await AdminBuilderService.all_builder_list();
            const responseData = await response.json();

            const formattedOptions = responseData
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(element => ({
                    value: element.id,
                    label: element.name
                }));
            setOptions(formattedOptions);

            const builderId = localStorage.getItem('builderId');

            if (builderId) {
                const foundOption = formattedOptions.find(option => option.value === parseInt(builderId, 10));
                if (foundOption) {
                    setBuilderCode(foundOption);
                }
            }
        } catch (error) {
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();
                setError(errorJson.message);
            }
        }
    };

    const GetMasterPlanDropDownList = async () => {
        try {
            const response = await AdminBuilderService.masterPlanDropDown();
            const responseData = await response.json();
            const formattedData = responseData.map((masterPlan) => ({
                label: masterPlan.label,
                value: masterPlan.value,
            }));
            setMasterPlanDropDownList(formattedData);
        } catch (error) {
            if (error.name === "HTTPError") {
                const errorJson = await error.response.json();
            }
        }
    };

    const handleBuilderCode = (code) => {
        setBuilderCode(code);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            var userData = {
                "builder_id": BuilderCode ? BuilderCode.value : '',
                "name": event.target.name.value,
                "status": status,
                "reporting": reporting,
                "product_type": productType,
                "phone": event.target.phone.value ? event.target.phone.value : '',
                "opensince": event.target.opensince.value ? event.target.opensince.value : '',
                "age": age,
                "single": single,
                "masterplan_id": selectedMasterPlan?.value,
                "lat": event.target.lat.value ? event.target.lat.value : '',
                "lng": event.target.lng.value ? event.target.lng.value : '',
                "area": area,
                "juridiction": juridiction,
                "zipcode": event.target.zipcode.value ? event.target.zipcode.value : '',
                "parcel": event.target.parcel.value ? event.target.parcel.value : '',
                "crossstreet": event.target.crossstreet.value ? event.target.crossstreet.value : '',
                "totallots": event.target.totallots.value ? event.target.totallots.value : 0,
                "lotwidth": event.target.lotwidth.value ? event.target.lotwidth.value : 0,
                "lotsize": event.target.lotsize.value,
                "gated": gate,
                "masterplanfee": event.target.masterplanfee.value ? event.target.masterplanfee.value : '',
                "zoning": event.target.zoning.value ? event.target.zoning.value : '',
                "gasprovider": event.target.gasprovider.value ? event.target.gasprovider.value : '',
                "website": event.target.website.value ? event.target.website.value : '',
            }
            const data = await AdminSubdevisionService.store(userData).json();
            if (data.status === true) {
                swal("Subdivision Created Successfully").then((willDelete) => {
                if (willDelete) {
                    seCanvasShowAdd(false);
                    setSelectedMasterPlan([]);
                    props.parentCallback();
                }})
            }
            else {
                var error;
                if (error.name === 'HTTPError') {
                    const errorJson = await error.response.json();
                    setError(errorJson.message.substr(0, errorJson.message.lastIndexOf(".")));
                }
            }
        }
        catch (error) {
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();
                setError(errorJson.message.substr(0, errorJson.message.lastIndexOf(".")));
            }
        }
    };

    const handleSelectMasterPlanChange = (selectedOption) => {
        setSelectedMasterPlan(selectedOption);
    };

    return (
        <>
            <Offcanvas show={canvasShowAdd} onHide={seCanvasShowAdd} className="offcanvas-end customeoff" placement='end'>
                <div className="offcanvas-header">
                    <h5 className="modal-title" id="#gridSystemModal">{props.Title}</h5>
                    <button type="button" className="btn-close"
                        onClick={() => {seCanvasShowAdd(false); setSelectedMasterPlan([]);}}
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div className="offcanvas-body">
                    <div className="container-fluid">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-xl-6 mb-3">
                                    <label className="form-label">Builder Code <span className="text-danger">*</span></label>
                                    <Form.Group controlId="tournamentList">
                                        <Select
                                            options={options}
                                            value={BuilderCode}
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
                                    <label htmlFor="exampleFormControlInput3" className="form-label">Name <span className="text-danger">*</span></label>
                                    <input type="text" name='name' className="form-control" id="exampleFormControlInput3" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput4" className="form-label">Status</label>
                                    <select className="default-select form-control" value={status} onChange={handleStatus} >
                                        <option value="1">Active</option>
                                        <option value="0">Sold Out</option>
                                        <option value="2">Future</option>
                                    </select>
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput5" className="form-label">Reporting</label>
                                    <select className="default-select form-control" value={reporting} onChange={handleReporting} >
                                        <option value="1">Yes</option>
                                        <option value="0">No</option>
                                    </select>
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput6" className="form-label">Product Type</label>
                                    <select className="default-select form-control" onChange={handleProductType} >
                                        <option value="">Select Product Type</option>
                                        <option value="DET">DET</option>
                                        <option value="ATT">ATT</option>
                                        <option value="HR">HR</option>
                                        <option value="AC">AC</option>
                                    </select>
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput7" className="form-label">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        className="form-control"
                                        id="exampleFormControlInput7"
                                        placeholder=""
                                        maxLength="12"
                                        onInput={(e) => {
                                            let input = e.target.value.replace(/\D/g, '');
                                            if (input.length > 0) {
                                                input = input.substring(0, 10);
                                                if (input.length > 3 && input.length <= 6) {
                                                    input = `${input.substring(0, 3)}-${input.substring(3, 6)}`;
                                                } else if (input.length > 6) {
                                                    input = `${input.substring(0, 3)}-${input.substring(3, 6)}-${input.substring(6, 10)}`;
                                                } else {
                                                    input = input;
                                                }
                                            }
                                            e.target.value = input;
                                        }}
                                    />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label className="form-label">Open Since</label>
                                    <input type="date" name='opensince' className="form-control" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label className="form-label">Age Restricted</label>
                                    <select className="default-select form-control" onChange={handleAge} >
                                        <option value="0">No</option>
                                        <option value="1">Yes</option>
                                    </select>
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput8" className="form-label">All Single Story</label>
                                    <select className="default-select form-control" onChange={handleSingle} >
                                        <option value="0">No</option>
                                        <option value="1">Yes</option>
                                    </select>
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label className="form-label">Master Plan</label>
                                    <Select
                                        name="masterplan_id"
                                        options={masterPlanDropDownList}
                                        value={selectedMasterPlan}
                                        placeholder={"Select Master Plan..."}
                                        onChange={(selectedOption) => handleSelectMasterPlanChange(selectedOption)}
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
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput11" className="form-label">Latitude</label>
                                    <input type="text" name='lat' className="form-control" id="exampleFormControlInput11" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput12" className="form-label">Longitude</label>
                                    <input type="text" name='lng' className="form-control" id="exampleFormControlInput12" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput13" className="form-label">Area</label>
                                    <select className="default-select form-control" onChange={handleArea} >
                                        <option value="">Select Area</option>
                                        <option value="BC">BC</option>
                                        <option value="E">E</option>
                                        <option value="H">H</option>
                                        <option value="IS">IS</option>
                                        <option value="L">L</option>
                                        <option value="MSQ">MSQ</option>
                                        <option value="MV">MV</option>
                                        <option value="NLV">NLV</option>
                                        <option value="NW">NW</option>
                                        <option value="P">P</option>
                                        <option value="SO">SO</option>
                                        <option value="SW">SW</option>
                                    </select>
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput14" className="form-label">Jurisdiction</label>
                                    <select className="default-select form-control" onChange={handleJurisdiction} >
                                        <option value="">Select Jurisdiction</option>
                                        <option value="Boulder City">Boulder City</option>
                                        <option value="CLV">CLV</option>
                                        <option value="CC Enterprise">CC Enterprise</option>
                                        <option value="CC Indian Springs">CC Indian Springs</option>
                                        <option value="CC Laughlin">CC Laughlin</option>
                                        <option value="Lone Mtn">Lone Mtn</option>
                                        <option value="Lower Kyle Canyon">Lower Kyle Canyon</option>
                                        <option value="CC Moapa Valley">CC Moapa Valley</option>
                                        <option value="CC Mt Charleston">CC Mt Charleston</option>
                                        <option value="CC Mtn Springs">CC Mtn Springs</option>
                                        <option value="CC Paradise">CC Paradise</option>
                                        <option value="CC Searchlight">CC Searchlight</option>
                                        <option value="CC Spring Valley">CC Spring Valley</option>
                                        <option value="CC Summerlin South">CC Summerlin South</option>
                                        <option value="CC Sunrise Manor">CC Sunrise Manor</option>
                                        <option value="CC Whiteney">CC Whiteney</option>
                                        <option value="CC Winchester">CC Winchester</option>
                                        <option value="CC Unincorporated">CC Unincorporated</option>
                                        <option value="Henderson">Henderson</option>
                                        <option value="Mesquite">Mesquite</option>
                                        <option value="NLV">NLV</option>
                                        <option value="NYE">NYE</option>
                                    </select>
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput15" className="form-label">ZIP Code</label>
                                    <input type="text" name='zipcode' className="form-control" id="exampleFormControlInput15" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput16" className="form-label">Parcel</label>
                                    <input type='text' name='parcel' className="form-control" id="exampleFormControlInput16" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput17" className="form-label">Cross Street</label>
                                    <input type='text' name='crossstreet' className="form-control" id="exampleFormControlInput17" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput18" className="form-label">Total Lots</label>
                                    <input type='number' name='totallots' className="form-control" id="exampleFormControlInput18" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput21" className="form-label">Lot width</label>
                                    <input type='number' name='lotwidth' className="form-control" id="exampleFormControlInput21" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput23" className="form-label">Lot Size</label>
                                    <input type='number' name='lotsize' className="form-control" id="exampleFormControlInput23" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput28" className="form-label">Gated</label>
                                    <select className="default-select form-control" onChange={handleGate}>
                                        <option value="0">No</option>
                                        <option value="1">Yes</option>
                                    </select>
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput31" className="form-label">Master Plan Fee</label>
                                    <input type='number' name='masterplanfee' className="form-control" id="exampleFormControlInput31" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput34" className="form-label">Zoning</label>
                                    <input type='text' name='zoning' className="form-control" id="exampleFormControlInput34" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput35" className="form-label">Gas Provider</label>
                                    <input type='text' name='gasprovider' className="form-control" id="exampleFormControlInput35" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput36" className="form-label">Website</label>
                                    <input type="text" name='website' className="form-control" id="exampleFormControlInput36" placeholder="" />
                                </div>
                                <p className='text-danger fs-12'>{Error}</p>
                            </div>
                            <div>
                                <button type="submit" className="btn btn-primary me-1">Submit</button>
                                <Link to={"#"} onClick={() => {seCanvasShowAdd(false); setSelectedMasterPlan([]);}} className="btn btn-danger light ms-1">Cancel</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </Offcanvas>
        </>
    );
});

export default SubdivisionOffcanvas;