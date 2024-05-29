import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Offcanvas, Form } from 'react-bootstrap';
import AdminSubdevisionService from "../../../API/Services/AdminService/AdminSubdevisionService";
import swal from "sweetalert";
import AdminClosingService from "../../../API/Services/AdminService/AdminClosingService";
import { isEmptyArray } from 'formik';
import Select from "react-select";
import AdminBuilderService from "../../../API/Services/AdminService/AdminBuilderService";

const BulkLandsaleUpdate = forwardRef((props, ref) => {
    const { selectedLandSales } = props;
    // const [selectedLandSales, setSelectedLandSales] = useState(props.selectedLandSales);
    console.log("bulkselectedLandSales",selectedLandSales);
    const [SubdivisionCode, setSubdivisionCode] = useState('');
    const [SubdivisionList, SetSubdivisionList] = useState([]);
    const [ClosingList, SetClosingList] = useState([]);
    const [addProduct, setAddProduct] = useState(false);
    const [BuilderList, setBuilderList] = useState([]);
  const [BuilderCode, setBuilderCode] = useState([]);

  const [Error, setError] = useState("");
  const [Subdivision, setSubdivision] = useState([]);
  const [status, setStatus] = useState("1");
  const [productType, setProductType] = useState("DET");
  const [reporting, setReporting] = useState("1");
  const [single, setSingle] = useState("1");
  const [age, setAge] = useState("1");
  const [area, setArea] = useState("1");
  const [juridiction, setJuridiction] = useState("");
  const [masterplan, setMasterPlan] = useState("");
  const [gate, setGate] = useState('');
  const handleStatus = (e) => {
    setStatus(e.target.value);
  };
  const handleProductType = (e) => {
    setProductType(e.target.value);
  };
  const handleReporting = (e) => {
    setReporting(e.target.value);
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

  const handleMasterPlan = (e) => {
    setMasterPlan(e.target.value);
  };
  const handleGate = e => {
    setGate(e.target.value);
}

    const params = useParams();
    useImperativeHandle(ref, () => ({
        showEmployeModal() {
            setAddProduct(true)
        }
    }));
    const navigate = useNavigate();

    const GetSubdivision = async (id) => {
        try {
          let responseData = await AdminSubdevisionService.show(id).json();
          setSubdivision(responseData);
          const response = await AdminBuilderService.index();
          const responseData1 = await response.json();
          setBuilderList(responseData1.data);
    
          let builderdata = responseData1.filter(function (item) {
            return item.id === responseData.builder_id;
          });
    
          setStatus(responseData.status)
          setProductType(responseData.product_type)
          setReporting(responseData.reporting)
          setProductType(responseData.product_type)
          setSingle(responseData.single)
          setAge(responseData.age)
          setArea(responseData.area)
          setJuridiction(responseData.juridiction)
          setMasterPlan(responseData.masterplan_id)
          setBuilderCode(builderdata);
          setGate(responseData.gated);
        } catch (error) {
          if (error.name === "HTTPError") {
            const errorJson = await error.response.json();
    
            setError(errorJson.message);
          }
        }
      };
      useEffect(() => {
        if (localStorage.getItem("usertoken")) {
          GetSubdivision(params.id);
        } else {
          navigate("/");
        }
      }, []);

      const handleBuilderCode = (code) => {
        setBuilderCode(code);
      };

    // const GetSubdivision = async (id) => {
    //     try {
    //         let responseData1 = await AdminClosingService.show(id).json()
    //         SetClosingList(responseData1);
    //         const response = await AdminSubdevisionService.index()
    //         const responseData = await response.json()
    //         let getdata = responseData.filter(function (item) {
    //             return item.id === responseData1.subdivision_id;
    //         });
    //         setSubdivisionCode(getdata)
    //         SetSubdivisionList(responseData.data);
    //     } catch (error) {
    //         if (error.name === 'HTTPError') {
    //             const errorJson = await error.response.json();
    //             setError(errorJson.message)
    //         }
    //     }
    // }

    // useEffect(() => {
    //     if (localStorage.getItem('usertoken')) {
    //         GetSubdivision(selectedLandSales);
    //     }
    //     else {
    //         navigate('/');
    //     }
    // }, [])


    const handleSubmit = async (event) => {
        event.preventDefault();
        if(selectedLandSales.length === 0)
            {
                setError('No selected records'); return false
            } 
        try {
            var userData = {
                builder_id: BuilderCode.id ? BuilderCode.id : Subdivision.builder_id,
                subdivision_code: event.target.subdivision_code.value,
                name: event.target.name.value,
                status: status,
                reporting: reporting,
                product_type: productType,
                phone: event.target.phone.value,
                opensince: event.target.opensince.value,
                age: age,
                single: single,
                firstpermitdate: event.target.firstpermitdate.value,
                masterplan_id:masterplan,
                lat: event.target.lat.value,
                lng: event.target.lng.value,
                area:area,
                juridiction: juridiction,
                zipcode: event.target.zipcode.value,
                parcel: event.target.parcel.value,
                crossstreet: event.target.crossstreet.value,
                totallots: event.target.totallots.value,
                unsoldlots: event.target.unsoldlots.value,
                lotreleased: event.target.lotreleased.value,
                lotwidth: event.target.lotwidth.value,
                stadinginventory: event.target.stadinginventory.value,
                lotsize: event.target.lotsize.value,
                permits: event.target.permits.value,
                netsales: event.target.netsales.value,
                closing: event.target.closing.value,
                monthsopen: event.target.monthsopen.value,
                gated: gate,
                sqftgroup: event.target.sqftgroup.value,
                dollargroup: event.target.dollargroup.value,
                masterplanfee: event.target.masterplanfee.value,
                lastweeklydata: event.target.lastweeklydata.value,
                dateadded: event.target.dateadded.value,
                zoning: event.target.zoning.value,
                gasprovider: event.target.gasprovider.value,
                hoafee: event.target.hoafee.value
              };
            console.log(userData);
            const data = await AdminSubdevisionService.bulkupdate(selectedLandSales, userData).json();
            if (data.status === true) {
                swal("Subdivision Updated Succesfully").then((willDelete) => {
                    if (willDelete) {
                        setAddProduct(false);
                        navigate('/subdivisionlist');
                    }
                })
                props.parentCallback();

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
        <>
            <Offcanvas show={addProduct} onHide={() => {setAddProduct(false); setError('')}} className="offcanvas-end customeoff" placement='end'>
                <div className="offcanvas-header">
                    <h5 className="modal-title" id="#gridSystemModal">{props.Title}</h5>
                    <button type="button" className="btn-close"
                        onClick={() => {setAddProduct(false);setError('')}}
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div className="offcanvas-body">
                    <div className="container-fluid">

              
                    <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-xl-6 mb-3">
                        <label className="form-label">
                          Builder Code
                        </label>
                        <Form.Group controlId="tournamentList">
                          <Select
                            options={BuilderList}
                            onChange={handleBuilderCode}
                            getOptionValue={(option) => option.name}
                            getOptionLabel={(option) => option.name}
                            value={BuilderCode}
                          ></Select>
                        </Form.Group>
                      </div>
                      <div className="col-xl-6 mb-3">
                        <label
                          htmlFor="exampleFormControlInput2"
                          className="form-label"
                        >
                          {" "}
                          Subdivision Code{" "}
                         
                        </label>
                        <input
                          type="text"
                          defaultValue={Subdivision.subdivision_code}
                          name="subdivision_code"
                          className="form-control"
                          id="exampleFormControlInput2"
                          placeholder=""
                        />
                      </div>
                      <div className="col-xl-6 mb-3">
                        <label
                          htmlFor="exampleFormControlInput3"
                          className="form-label"
                        >
                          {" "}
                          Name
                        </label>
                        <input
                          type="text"
                          defaultValue={Subdivision.name}
                          name="name"
                          className="form-control"
                          id="exampleFormControlInput3"
                          placeholder=""
                        />
                      </div>
                      <div className="col-xl-6 mb-3">
                        <label
                          htmlFor="exampleFormControlInput4"
                          className="form-label"
                        >
                          Status
                        </label>
                        <select
                          className="default-select form-control"
                          onChange={handleStatus}
                          value={status}
                        >
                          <option value="1">Active</option>
                          <option value="0">Sold Out</option>
                          <option value="2">Future</option>
                        </select>{" "}
                      </div>
                      <div className="col-xl-6 mb-3">
                        <label
                          htmlFor="exampleFormControlInput5"
                          className="form-label"
                        >
                          {" "}
                          Reporting
                        </label>
                        <select
                          className="default-select form-control"
                          onChange={handleReporting}
                          value={reporting}
                        >
                          <option value="1">Yes</option>
                          <option value="0">No</option>
                        </select>
                      </div>

                      <div className="col-xl-6 mb-3">
                        <label
                          htmlFor="exampleFormControlInput6"
                          className="form-label"
                        >
                          {" "}
                          Product Type <span className="text-danger"></span>
                        </label>
                        <select
                          className="default-select form-control"
                          onChange={handleProductType}
                          value={productType}
                        >
                          <option value="DET">DET</option>
                          <option value="ATT">ATT</option>
                          <option value="HR">HR</option>
                          <option value="AC">AC</option>
                        </select>
                      </div>
                      <div className="col-xl-6 mb-3">
                        <label
                          htmlFor="exampleFormControlInput7"
                          className="form-label"
                        >
                          {" "}
                          Phone <span className="text-danger"></span>
                        </label>
                        <input
                          type="number"
                          defaultValue={Subdivision.phone}
                          name="phone"
                          className="form-control"
                          id="exampleFormControlInput7"
                          placeholder=""
                        />
                      </div>
                      <div className="col-xl-6 mb-3">
                        <label className="form-label">
                          Open Since<span className="text-danger"></span>
                        </label>
                        <input
                          type="date"
                          defaultValue={Subdivision.opensince}
                          name="opensince"
                          className="form-control"
                        />
                      </div>
                      <div className="col-xl-6 mb-3">
                        <label className="form-label">
                          Age Restricted
                        </label>
                        <select
                          className="default-select form-control"
                          name=""
                          onChange={handleAge}
                          value={age}
                        >
                          <option value="1">Yes</option>
                          <option value="0">No</option>
                        </select>
                      </div>
                      <div className="col-xl-6 mb-3">
                        <label
                          htmlFor="exampleFormControlInput8"
                          className="form-label"
                        >
                          {" "}
                          All Single Story{" "}
                          
                        </label>
                        <select
                          className="default-select form-control"
                          name=""
                          onChange={handleSingle}
                          value={single}
                        >
                          <option value="1">Yes</option>
                          <option value="0">No</option>
                        </select>
                      </div>
                      <div className="col-xl-6 mb-3">
                        <label
                          htmlFor="exampleFormControlInput9"
                          className="form-label"
                        >
                          {" "}
                          First Permit Date{" "}
                          <span className="text-danger"></span>
                        </label>
                        <input
                          type="date"
                          defaultValue={Subdivision.firstpermitdate}
                          name="firstpermitdate"
                          className="form-control"
                          id="exampleFormControlInput9"
                          placeholder=""
                        />
                      </div>

                      <div className="col-xl-6 mb-3">
                        <label
                          htmlFor="exampleFormControlInput10"
                          className="form-label"
                        >
                          Masterplan<span className="text-danger"></span>
                        </label>
                        <select
                          className="default-select form-control"
                          name=""
                          onChange={handleMasterPlan}
                          value={masterplan}
                        >
                          <option value="">Select Masterplan</option>
                          <option value=""></option>
                          <option value="ALIANTE">ALIANTE</option>
                          <option value="ANTHEM">ANTHEM</option>
                          <option value="ARLINGTON RANCH">
                            ARLINGTON RANCH
                          </option>
                          <option value="ASCAYA">ASCAYA</option>
                          <option value="BUFFALO RANCH">BUFFALO RANCH</option>
                          <option value="CADENCE">CADENCE</option>
                          <option value="CANYON CREST">CANYON CREST</option>
                          <option value="CANYON GATE">CANYON GATE</option>
                          <option value="CORONADO RANCH">CORONADO RANCH</option>
                          <option value="ELDORADO">ELDORADO</option>
                          <option value="GREEN VALLEY">GREEN VALLEY</option>
                          <option value="HIGHLANDS RANCH">
                            HIGHLANDS RANCH
                          </option>
                          <option value="INSPIRADA">INSPIRADA</option>
                          <option value="LAKE LAS VEGAS">LAKE LAS VEGAS</option>
                          <option value="THE LAKES">THE LAKES</option>
                          <option value="LAS VEGAS COUNTRY CLUB">
                            LAS VEGAS COUNTRY CLUB
                          </option>
                          <option value="LONE MOUNTAIN">LONE MOUNTAIN</option>
                          <option value="MACDONALD RANCH">
                            MACDONALD RANCH
                          </option>
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
                          <option value="SILVERADO RANCH">
                            SILVERADO RANCH
                          </option>
                          <option value="SILVERSTONE RANCH">
                            SILVERSTONE RANCH
                          </option>
                          <option value="SKYE CANYON">SKYE CANYON</option>
                          <option value="SKYE HILLS">SKYE HILLS</option>
                          <option value="SPANISH TRAIL">SPANISH TRAIL</option>
                          <option value="SOUTHERN HIGHLANDS">
                            SOUTHERN HIGHLANDS
                          </option>
                          <option value="SUMMERLIN">SUMMERLIN</option>
                          <option value="SUNRISE HIGH">SUNRISE HIGH</option>
                          <option value="SUNSTONE">SUNSTONE</option>
                          <option value="TUSCANY">TUSCANY</option>
                          <option value="VALLEY VISTA">VALLEY VISTA</option>
                          <option value="VILLAGES AT TULE SPRING">
                            VILLAGES AT TULE SPRINGS
                          </option>
                          <option value="VISTA VERDE">VISTA VERDE</option>
                          <option value="WESTON HILLS">WESTON HILLS</option>
                        </select>
                      </div>

                      <div className="col-xl-6 mb-3">
                        <label
                          htmlFor="exampleFormControlInput11"
                          className="form-label"
                        >
                          Latitude <span className="text-danger"></span>
                        </label>
                        <input
                          type="text"
                          defaultValue={Subdivision.lat}
                          name="lat"
                          className="form-control"
                          id="exampleFormControlInput11"
                          placeholder=""
                        />
                      </div>
                      <div className="col-xl-6 mb-3">
                        <label
                          htmlFor="exampleFormControlInput12"
                          className="form-label"
                        >
                          Longitude<span className="text-danger"></span>
                        </label>
                        <input
                          type="text"
                          defaultValue={Subdivision.lng}
                          name="lng"
                          className="form-control"
                          id="exampleFormControlInput12"
                          placeholder=""
                        />
                      </div>
                      <div className="col-xl-6 mb-3">
                        <label
                          htmlFor="exampleFormControlInput13"
                          className="form-label"
                        >
                          Area<span className="text-danger"></span>
                        </label>
                        <select
                          className="default-select form-control"
                          name=""
                          onChange={handleArea}
                          value={area}
                        >
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
                        <label
                          htmlFor="exampleFormControlInput14"
                          className="form-label"
                        >
                          Juridiction<span className="text-danger"></span>
                        </label>
                        <select
                          className="default-select form-control"
                          name=""
                          onChange={handleJurisdiction}
                          value={juridiction}
                        >
                          <option value="">Select Juridiction</option>
                          <option value="Boulder City">Boulder City</option>
                          <option value="CLV">CLV</option>
                          <option value="CC Enterprise">CC Enterprise</option>
                          <option value="CC Indian Springs">
                            CC Indian Springs
                          </option>
                          <option value="CC Laughlin">CC Laughlin</option>
                          <option value="Lone Mtn">Lone Mtn</option>
                          <option value="Lower Kyle Canyon">
                            Lower Kyle Canyon
                          </option>
                          <option value="CC Moapa Valley">
                            CC Moapa Valley
                          </option>
                          <option value="CC Mt Charleston">
                            CC Mt Charleston
                          </option>
                          <option value="CC Mtn Springs">CC Mtn Springs</option>
                          <option value="CC Paradise">CC Paradise</option>
                          <option value="CC Searchlight">CC Searchlight</option>
                          <option value="CC Spring Valley">
                            CC Spring Valley
                          </option>
                          <option value="CC Summerlin South">
                            CC Summerlin South
                          </option>
                          <option value="CC Sunrise Manor">
                            CC Sunrise Manor
                          </option>
                          <option value="CC Whiteney">CC Whiteney</option>
                          <option value="CC Winchester">CC Winchester</option>
                          <option value="CC Unincorporated">
                            CC Unincorporated
                          </option>
                          <option value="Henderson">Henderson</option>
                          <option value="Mesquite">Mesquite</option>
                                        <option value="NLV">NLV</option>
                                        <option value="NYE">NYE</option>
                        </select>
                      </div>
                      <div className="col-xl-6 mb-3">
                        <label
                          htmlFor="exampleFormControlInput15"
                          className="form-label"
                        >
                          Zipcode<span className="text-danger"></span>
                        </label>
                        <input
                          type="number"
                          defaultValue={Subdivision.zipcode}
                          name="zipcode"
                          className="form-control"
                          id="exampleFormControlInput15"
                          placeholder=""
                        />
                      </div>

                      <div className="col-xl-6 mb-3">
                        <label
                          htmlFor="exampleFormControlInput16"
                          className="form-label"
                        >
                          Parcel <span className="text-danger"></span>
                        </label>
                        <input
                          type="number"
                          defaultValue={Subdivision.parcel}
                          name="parcel"
                          className="form-control"
                          id="exampleFormControlInput16"
                        />
                      </div>
                      <div className="col-xl-6 mb-3">
                        <label
                          htmlFor="exampleFormControlInput17"
                          className="form-label"
                        >
                          Cross Street <span className="text-danger"></span>
                        </label>
                        <input
                          type="text"
                          defaultValue={Subdivision.crossstreet}
                          name="crossstreet"
                          className="form-control"
                          id="exampleFormControlInput17"
                        />
                      </div>
                      <div className="col-xl-6 mb-3">
                        <label
                          htmlFor="exampleFormControlInput18"
                          className="form-label"
                        >
                          Total Lots
                        </label>
                        <input
                          type="number"
                          defaultValue={Subdivision.totallots}
                          name="totallots"
                          className="form-control"
                          id="exampleFormControlInput18"
                        />
                      </div>
                      <div className="col-xl-6 mb-3">
                        <label
                          htmlFor="exampleFormControlInput19"
                          className="form-label"
                        >
                          Unsold Lots
                        </label>
                        <input
                          type="number"
                          defaultValue={Subdivision.unsoldlots}
                          name="unsoldlots"
                          className="form-control"
                          id="exampleFormControlInput19"
                        />
                      </div>
                      <div className="col-xl-6 mb-3">
                        <label
                          htmlFor="exampleFormControlInput20"
                          className="form-label"
                        >
                          Lot Released
                        </label>
                        <input
                          type="number"
                          defaultValue={Subdivision.lotreleased}
                          name="lotreleased"
                          className="form-control"
                          id="exampleFormControlInput20"
                        />
                      </div>
                      <div className="col-xl-6 mb-3">
                        <label
                          htmlFor="exampleFormControlInput21"
                          className="form-label"
                        >
                          Lot Width
                        </label>
                        <input
                          type="number"
                          defaultValue={Subdivision.lotwidth}
                          name="lotwidth"
                          className="form-control"
                          id="exampleFormControlInput21"
                        />
                      </div>
                      <div className="col-xl-6 mb-3">
                        <label
                          htmlFor="exampleFormControlInput22"
                          className="form-label"
                        >
                          Stading Inventory
                          
                        </label>
                        <input
                          type="number"
                          defaultValue={Subdivision.stadinginventory}
                          name="stadinginventory"
                          className="form-control"
                          id="exampleFormControlInput22"
                        />
                      </div>

                      <div className="col-xl-6 mb-3">
                        <label
                          htmlFor="exampleFormControlInput23"
                          className="form-label"
                        >
                          Lot Size
                        </label>
                        <input
                          type="number"
                          defaultValue={Subdivision.lotsize}
                          name="lotsize"
                          className="form-control"
                          id="exampleFormControlInput23"
                        />
                      </div>
                      <div className="col-xl-6 mb-3">
                        <label
                          htmlFor="exampleFormControlInput24"
                          className="form-label"
                        >
                          Permits
                        </label>
                        <input
                          type="number"
                          defaultValue={Subdivision.permits}
                          name="permits"
                          className="form-control"
                          id="exampleFormControlInput24"
                        />
                      </div>
                      <div className="col-xl-6 mb-3">
                        <label
                          htmlFor="exampleFormControlInput25"
                          className="form-label"
                        >
                          Net Sales
                        </label>
                        <input
                          type="number"
                          defaultValue={Subdivision.netsales}
                          name="netsales"
                          className="form-control"
                          id="exampleFormControlInput25"
                        />
                      </div>

                      <div className="col-xl-6 mb-3">
                        <label
                          htmlFor="exampleFormControlInput26"
                          className="form-label"
                        >
                          Closing
                        </label>
                        <input
                          type="number"
                          defaultValue={Subdivision.closing}
                          name="closing"
                          className="form-control"
                          id="exampleFormControlInput26"
                        />
                      </div>
                      <div className="col-xl-6 mb-3">
                        <label
                          htmlFor="exampleFormControlInput27"
                          className="form-label"
                        >
                          Months Open
                        </label>
                        <input
                          type="number"
                          defaultValue={Subdivision.monthsopen}
                          name="monthsopen"
                          className="form-control"
                          id="exampleFormControlInput27"
                        />
                      </div>
                      <div className="col-xl-6 mb-3">
                        <label
                          htmlFor="exampleFormControlInput28"
                          className="form-label"
                        >
                          Gated
                        </label>
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
                        <label
                          htmlFor="exampleFormControlInput29"
                          className="form-label"
                        >
                          Sqft Group<span className="text-danger"></span>
                        </label>
                        <input
                          type="text"
                          defaultValue={Subdivision.sqftgroup}
                          name="sqftgroup"
                          className="form-control"
                          id="exampleFormControlInput29"
                        />
                      </div>
                      <div className="col-xl-6 mb-3">
                        <label
                          htmlFor="exampleFormControlInput30"
                          className="form-label"
                        >
                          Dollar Group<span className="text-danger"></span>
                        </label>
                        <input
                          type="text"
                          defaultValue={Subdivision.dollargroup}
                          name="dollargroup"
                          className="form-control"
                          id="exampleFormControlInput30"
                        />
                      </div>
                      <div className="col-xl-6 mb-3">
                        <label
                          htmlFor="exampleFormControlInput31"
                          className="form-label"
                        >
                          Master Plan Fee
                        </label>
                        <input
                          type="number"
                          defaultValue={Subdivision.masterplanfee}
                          name="masterplanfee"
                          className="form-control"
                          id="exampleFormControlInput31"
                        />
                      </div>
                      <div className="col-xl-6 mb-3">
                        <label
                          htmlFor="exampleFormControlInput32"
                          className="form-label"
                        >
                          Last Weekly Data<span className="text-danger"></span>
                        </label>
                        <input
                          type="date"
                          defaultValue={Subdivision.lastweeklydata}
                          name="lastweeklydata"
                          className="form-control"
                          id="exampleFormControlInput32"
                        />
                      </div>
                      <div className="col-xl-6 mb-3">
                        <label
                          htmlFor="exampleFormControlInput33"
                          className="form-label"
                        >
                          Date Added<span className="text-danger"></span>
                        </label>
                        <input
                          type="date"
                          defaultValue={Subdivision.dateadded}
                          name="dateadded"
                          className="form-control"
                          id="exampleFormControlInput33"
                        />
                      </div>
                      <div className="col-xl-6 mb-3">
                        <label
                          htmlFor="exampleFormControlInput34"
                          className="form-label"
                        >
                          Zoning<span className="text-danger"></span>
                        </label>
                        <input
                          type="text"
                          defaultValue={Subdivision.zoning}
                          name="zoning"
                          className="form-control"
                          id="exampleFormControlInput34"
                        />
                      </div>
                      <div className="col-xl-6 mb-3">
                        <label
                          htmlFor="exampleFormControlInput35"
                          className="form-label"
                        >
                          Gas Provider<span className="text-danger"></span>
                        </label>
                        <input
                          type="text"
                          defaultValue={Subdivision.gasprovider}
                          name="gasprovider"
                          className="form-control"
                          id="exampleFormControlInput35"
                        />
                      </div>
                      <div className="col-xl-6 mb-3">
                        <label htmlFor="exampleFormControlInput36" className="form-label">HOA Fee</label>
                        <input
                          type="number"
                          defaultValue={Subdivision.hoafee}
                          name="hoafee"
                          className="form-control"
                          id="exampleFormControlInput36"
                        />
                      </div>
                      <p className="text-danger fs-12">{Error}</p>
                    </div>
                    <div>
                      <button type="submit" className="btn btn-primary me-1">
                        Submit
                      </button>
                      <Link
                        type="reset"
                        to={"#"}
                        onClick={() => {setAddProduct(false);setError('')}}
                        className="btn btn-danger light ms-1"
                      >
                        Cancel
                      </Link>
                    </div>
                  </form>
                    </div>
                </div>
            </Offcanvas>
        </>
    );
});

export default BulkLandsaleUpdate;