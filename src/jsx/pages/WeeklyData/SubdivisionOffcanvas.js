import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Offcanvas, Form } from 'react-bootstrap';
import AdminSubdevisionService from "../../../API/Services/AdminService/AdminSubdevisionService";
import AdminBuilderService from '../../../API/Services/AdminService/AdminBuilderService';

const SubdivisionOffcanvas = forwardRef((props, ref) => {

    const [BuilderCode, setBuilderCode] = useState(localStorage.getItem('builderId'));
    const [Error, setError] = useState('');
    const [addSubdivision, setAddSubdivision] = useState(false);
    const [BuilderList, setBuilderList] = useState([]);
    const [status, setStatus] = useState('1');
    const [productType, setProductType] = useState('');
    const [reporting, setReporting] = useState('1');
    const [single, setSingle] = useState('0');
    const [age, setAge] = useState('0');
    const [area, setArea] = useState('');
    const [juridiction, setJuridiction] = useState('');
    const [masterplan, setMasterPlan] = useState('');
    const [gate, setGate] = useState('0');

    const handleStatus = e => {
        setStatus(e.target.value);
    }

    const handleProductType = e => {
        setProductType(e.target.value);
    }
    const handleReporting = e => {
        setReporting(e.target.value);
    }
    const handleSingle = e => {
        setSingle(e.target.value);
    }
    const handleAge = e => {
        setAge(e.target.value);
    }
    const handleArea = e => {
        setArea(e.target.value);
    }
    const handleJurisdiction = e => {
        setJuridiction(e.target.value);
    }

    const handleMasterPlan = e => {
        setMasterPlan(e.target.value);
    }
    const handleGate = e => {
        setGate(e.target.value);
    }

    const getbuilderlist = async () => {

        try {
            const response = await AdminBuilderService.all_builder_list();
            const responseData = await response.json();
            setBuilderList(responseData)
        } catch (error) {
            console.log(error)
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();

                setError(errorJson.message)
            }
        }
    }
    useEffect(() => {
        getbuilderlist();
    }, [])

    useImperativeHandle(ref, () => ({
        showEmployeModal() {
            setAddSubdivision(true)
        }
    }));
    const nav = useNavigate();
    const handleBuilderCode = code => {
        
        setBuilderCode(code.target.value);

    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            var userData = {
                "builder_id": BuilderCode,
                // "subdivision_code": event.target.subdivision_code.value,
                "name": event.target.name.value,
                "status": status,
                "reporting": reporting,
                "product_type":productType,
                "phone": event.target.phone.value ? event.target.phone.value : '',
                "opensince": event.target.opensince.value ? event.target.opensince.value : '',
                "age":age,
                "single": single,
                "firstpermitdate": event.target.firstpermitdate.value ? event.target.firstpermitdate.value : '',
                "masterplan_id": masterplan,
                "lat": event.target.lat.value ? event.target.lat.value : '',
                "lng": event.target.lng.value ? event.target.lng.value : '',
                "area": area,
                "juridiction": juridiction,
                "zipcode": event.target.zipcode.value ? event.target.zipcode.value : '',
                "parcel": event.target.parcel.value ? event.target.parcel.value : '',
                "crossstreet": event.target.crossstreet.value ? event.target.crossstreet.value : '',
                "totallots": event.target.totallots.value ? event.target.totallots.value : 0,
                "unsoldlots": event.target.unsoldlots.value ? event.target.unsoldlots.value : 0,
                "lotreleased": event.target.lotreleased.value ? event.target.lotreleased.value : 0,
                "lotwidth": event.target.lotwidth.value ? event.target.lotwidth.value : 0,
                "stadinginventory": event.target.stadinginventory.value ? event.target.stadinginventory.value : 0,
                "lotsize": event.target.lotsize.value,
                "permits": event.target.permits.value ? event.target.permits.value : 0,
                "netsales": event.target.netsales.value ? event.target.netsales.value : 0,
                "closing": event.target.closing.value ? event.target.closing.value : 0,
                "monthsopen": event.target.monthsopen.value ? event.target.monthsopen.value : 0,
                "gated": gate,
                "sqftgroup": event.target.sqftgroup.value ? event.target.sqftgroup.value : '',
                "dollargroup": event.target.dollargroup.value ? event.target.dollargroup.value : '',
                "masterplanfee": event.target.masterplanfee.value ? event.target.masterplanfee.value : '',
                "lastweeklydata": event.target.lastweeklydata.value ? event.target.lastweeklydata.value : '',

                "dateadded": event.target.dateadded.value ? event.target.dateadded.value : '',

                "zoning": event.target.zoning.value ? event.target.zoning.value : '',
                "gasprovider": event.target.gasprovider.value ? event.target.gasprovider.value : '',




            }
            const data = await AdminSubdevisionService.store(userData).json();
            if (data.status === true) {
                setAddSubdivision(false)
                props.parentCallback();
            }
            else {
                var error;
                if (error.name === 'HTTPError') {
                    const errorJson = await error.response.json();

                    setError(errorJson.message.substr(0, errorJson.message.lastIndexOf(".")))
                }
            }
        }
        catch (error) {
            console.log(error);
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();

                setError(errorJson.message.substr(0, errorJson.message.lastIndexOf(".")))
            }




        }

        // nav("#");
    }
    return (
        <>
            <Offcanvas show={addSubdivision} onHide={setAddSubdivision} className="offcanvas-end customeoff" placement='end'>
                <div className="offcanvas-header">
                    <h5 className="modal-title" id="#gridSystemModal">{props.Title}</h5>
                    <button type="button" className="btn-close"
                        onClick={() => setAddSubdivision(false)}
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

                                        <Form.Select
                                            onChange={handleBuilderCode}
                                            value={BuilderCode}
                                            className="default-select form-control"
                                        >
                                            <option value=''>Select Builder</option>
                                            {
                                                BuilderList.map((element) => (
                                                    <option value={element.id}>{element.name}</option>
                                                ))
                                            }
                                        </Form.Select>
                                    </Form.Group>

                                </div>
                                {/* <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput2" className="form-label"> Subdivision Code <span className="text-danger">*</span></label>
                                    <input type="text" name='subdivision_code' className="form-control" id="exampleFormControlInput2" placeholder="" />
                                </div> */}
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput3" className="form-label"> Name <span className="text-danger">*</span></label>
                                    <input type="text" name='name' className="form-control" id="exampleFormControlInput3" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput4" className="form-label">Status <span className="text-danger">*</span></label>
                                    <select className="default-select form-control" onChange={handleStatus} >
                                        <option value="">Select Status</option>
                                        <option value="1">Active</option>
                                        <option value="0">Sold Out</option>
                                        <option value="2">Future</option>
                                    </select>
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput5" className="form-label"> Reporting <span className="text-danger">*</span></label>
                                    <select className="default-select form-control" onChange={handleReporting} >
                                        <option value="">Select Reporting</option>
                                        <option value="1">Yes</option>
                                        <option value="0">No</option>
                                    </select>             
                                 </div>

                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput6" className="form-label"> Product Type <span className="text-danger"></span></label>
                                    <select className="default-select form-control" onChange={handleProductType} >
                                        <option value="">Select Product Type</option>
                                         <option value="DET">DET</option>
                                        <option value="ATT">ATT</option>
                                        <option value="HR">HR</option>
                                        <option value="AC">AC</option>
                                    </select>                                
                                    </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput7" className="form-label"> Phone <span className="text-danger"></span></label>
                                    <input type="number" name='phone' className="form-control" id="exampleFormControlInput7" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label className="form-label">Open Since<span className="text-danger"></span></label>
                                    <input type="date" name='opensince' className="form-control" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label className="form-label">Age Restricted<span className="text-danger">*</span></label>
                                    <select className="default-select form-control" name="" onChange={handleAge} >
                                    <option value="">Select age Restricted</option>
                                        <option value="1">Yes</option>
                                        <option value="0">No</option>
                                    </select>                               
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput8" className="form-label">All Single Story<span className="text-danger">*</span></label>
                                    <select className="default-select form-control" name="" onChange={handleSingle} >
                                        <option value="">Select Story</option>
                                        <option value="1">Yes</option>
                                        <option value="0">No</option>
                                    </select>         
                                 </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput9" className="form-label"> First Permit Date <span className="text-danger"></span></label>
                                    <input type="date" name='firstpermitdate' className="form-control" id="exampleFormControlInput9" placeholder="" />
                                </div>


                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput10" className="form-label">Masterplan<span className="text-danger"></span></label>
                                    <select className="default-select form-control" name="" onChange={handleMasterPlan} >
                                        <option value="">Select Masterplan</option>
                                        <option value=""></option>
                                        <option value="ALIANTE">ALIANTE</option>
                                        <option value="ANTHEM">ANTHEM</option>
                                        <option value="ARLINGTON RANCH">ARLINGTON RANCH</option>
                                        <option value="ASCAYA">ASCAYA</option>
                                        <option value="BUFFALO RANCH">BUFFALO RANCH</option>
                                        <option value="CADENCE">CADENCE</option>
                                        <option value="CANYON CREST">CANYON CREST</option>
                                        <option value="CANYON GATE">CANYON GATE</option>
                                        <option value="CORONADO RANCH">CORONADO RANCH</option>
                                        <option value="ELDORADO">ELDORADO</option>
                                        <option value="GREEN VALLEY">GREEN VALLEY</option>
                                        <option value="HIGHLANDS RANCH">HIGHLANDS RANCH</option>
                                        <option value="INSPIRADA">INSPIRADA</option>
                                        <option value="LAKE LAS VEGAS">LAKE LAS VEGAS</option>
                                        <option value="THE LAKES">THE LAKES</option>
                                        <option value="LAS VEGAS COUNTRY CLUB">LAS VEGAS COUNTRY CLUB</option>
                                        <option value="LONE MOUNTAIN">LONE MOUNTAIN</option>
                                        <option value="MACDONALD RANCH">MACDONALD RANCH</option>
                                        <option value="MOUNTAINS EDGE">MOUNTAINS EDGE</option>
                                        <option value="MOUNTAIN FALLS">MOUNTAIN FALLS</option>
                                        <option value="NEVADA RANCH">NEVADA RANCH</option>
                                        <option value="NEVADA TRAILS">NEVADA TRAILS</option>
                                        <option value="PROVIDENCE">PROVIDENCE</option>
                                        <option value="QUEENSRIDGE">QUEENSRIDGE</option>
                                        <option value="RED ROCK CC">RED ROCK CC</option>
                                        <option value="RHODES RANCH">RHODES RANCH</option>
                                        <option value="SEDONA RANCH">SEDONA RANCH</option>
                                        <option value="SEVEN HILLS">SEVEN HILLS</option>
                                        <option value="SILVERADO RANCH">SILVERADO RANCH</option>
                                        <option value="SILVERSTONE RANCH">SILVERSTONE RANCH</option>
                                        <option value="SKYE CANYON">SKYE CANYON</option>
                                        <option value="SKYE HILLS">SKYE HILLS</option>
                                        <option value="SPANISH TRAIL">SPANISH TRAIL</option>
                                        <option value="SOUTHERN HIGHLANDS">SOUTHERN HIGHLANDS</option>
                                        <option value="SUMMERLIN">SUMMERLIN</option>
                                        <option value="SUNRISE HIGH">SUNRISE HIGH</option>
                                        <option value="SUNSTONE">SUNSTONE</option>
                                        <option value="TUSCANY">TUSCANY</option>
                                        <option value="VALLEY VISTA">VALLEY VISTA</option>
                                        <option value="VILLAGES AT TULE SPRING">VILLAGES AT TULE SPRINGS</option>
                                        <option value="VISTA VERDE">VISTA VERDE</option>
                                        <option value="WESTON HILLS">WESTON HILLS</option>
                                    </select>  
                                </div>

                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput11" className="form-label">Latitude <span className="text-danger"></span></label>
                                    <input type="text" name='lat' className="form-control" id="exampleFormControlInput11" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput12" className="form-label">Longitude<span className="text-danger"></span></label>
                                    <input type="text" name='lng' className="form-control" id="exampleFormControlInput12" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput13" className="form-label">Area<span className="text-danger"></span></label>
                                    <select className="default-select form-control" name="" onChange={handleArea} >
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
                                    <label htmlFor="exampleFormControlInput14" className="form-label">Juridiction<span className="text-danger"></span></label>
                                    <select className="default-select form-control" name="" onChange={handleJurisdiction} >
                                        <option value="">Select Juridiction</option>
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
                                    <label htmlFor="exampleFormControlInput15" className="form-label">Zipcode<span className="text-danger"></span></label>
                                    <input type="number" name='zipcode' className="form-control" id="exampleFormControlInput15" placeholder="" />
                                </div>

                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput16" className="form-label">Parcel <span className="text-danger"></span></label>
                                    <input type='text' name='parcel' className="form-control" id="exampleFormControlInput16" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput17" className="form-label">Cross Street <span className="text-danger"></span></label>
                                    <input type='text' name='crossstreet' className="form-control" id="exampleFormControlInput17" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput18" className="form-label">Total Lots <span className="text-danger">*</span></label>
                                    <input type='number' name='totallots' className="form-control" id="exampleFormControlInput18" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput19" className="form-label">Unsold Lots<span className="text-danger">*</span></label>
                                    <input type='number' name='unsoldlots' className="form-control" id="exampleFormControlInput19" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput20" className="form-label">Lots Released<span className="text-danger">*</span></label>
                                    <input type='number' name='lotreleased' className="form-control" id="exampleFormControlInput20" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput21" className="form-label">Lot width<span className="text-danger">*</span></label>
                                    <input type='number' name='lotwidth' className="form-control" id="exampleFormControlInput21" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput22" className="form-label">Stading Inventory<span className="text-danger">*</span></label>
                                    <input type='number' name='stadinginventory' className="form-control" id="exampleFormControlInput22" />
                                </div>

                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput23" className="form-label">Lot Size<span className="text-danger">*</span></label>
                                    <input type='number' name='lotsize' className="form-control" id="exampleFormControlInput23" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput24" className="form-label">Permits<span className="text-danger">*</span></label>
                                    <input type='number' name='permits' className="form-control" id="exampleFormControlInput24" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput25" className="form-label">Net Sales<span className="text-danger">*</span></label>
                                    <input type='number' name='netsales' className="form-control" id="exampleFormControlInput25" />
                                </div>

                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput26" className="form-label">Closing<span className="text-danger">*</span></label>
                                    <input type='number' name='closing' className="form-control" id="exampleFormControlInput26" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput27" className="form-label">Months Open<span className="text-danger">*</span></label>
                                    <input type='number' name='monthsopen' className="form-control" id="exampleFormControlInput27" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput28" className="form-label">Gated<span className="text-danger">*</span></label>
                                    <select className="default-select form-control" 
                                    onChange={handleGate} 
                                    value={gate}
                                    > 
                                        <option value="">Select Gate</option>
                                        <option value="1">Yes</option>
                                        <option value="0">No</option>
                                    </select>                               
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput29" className="form-label">Sqft Group<span className="text-danger"></span></label>
                                    <input type='text' name='sqftgroup' className="form-control" id="exampleFormControlInput29" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput30" className="form-label">Dollar Group<span className="text-danger"></span></label>
                                    <input type='text' name='dollargroup' className="form-control" id="exampleFormControlInput30" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput31" className="form-label">Master Plan Fee<span className="text-danger">*</span></label>
                                    <input type='number' name='masterplanfee' className="form-control" id="exampleFormControlInput31" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput32" className="form-label">Last weekly Data<span className="text-danger"></span></label>
                                    <input type='date' name='lastweeklydata' className="form-control" id="exampleFormControlInput32" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput33" className="form-label">Date Added<span className="text-danger"></span></label>
                                    <input type='date' name='dateadded' className="form-control" id="exampleFormControlInput33" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput34" className="form-label">Zoning<span className="text-danger"></span></label>
                                    <input type='text' name='zoning' className="form-control" id="exampleFormControlInput34" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput35" className="form-label">Gas Provider<span className="text-danger"></span></label>
                                    <input type='text' name='gasprovider' className="form-control" id="exampleFormControlInput35" />
                                </div>
                                <p className='text-danger fs-12'>{Error}</p>

                            </div>
                            <div>
                                <button type="submit" className="btn btn-primary me-1">Submit</button>
                                <Link to={"#"} onClick={() => setAddSubdivision(false)} className="btn btn-danger light ms-1">Cancel</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </Offcanvas>
        </>
    );
});

export default SubdivisionOffcanvas;