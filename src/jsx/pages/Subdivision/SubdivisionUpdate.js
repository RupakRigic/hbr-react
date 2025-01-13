import React, { Fragment, useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";
import AdminSubdevisionService from "../../../API/Services/AdminService/AdminSubdevisionService";
import AdminBuilderService from "../../../API/Services/AdminService/AdminBuilderService";
import swal from "sweetalert";
import Select from "react-select";
import ClipLoader from "react-spinners/ClipLoader";
import MainPagetitle from "../../layouts/MainPagetitle";

const SubdivisionUpdate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [BuilderList, setBuilderList] = useState([]);
  const [options, setOptions] = useState([]);
  const [BuilderCode, setBuilderCode] = useState([]);
  const [Error, setError] = useState("");
  const [Subdivision, setSubdivision] = useState([]);
  const params = useParams();
  const [status, setStatus] = useState("1");
  const [productType, setProductType] = useState("DET");
  const [reporting, setReporting] = useState("1");
  const [single, setSingle] = useState("1");
  const [age, setAge] = useState("1");
  const [area, setArea] = useState("1");
  const [juridiction, setJuridiction] = useState("");
  const [masterplan, setMasterPlan] = useState("");
  const [gate, setGate] = useState('');
  const navigate = useNavigate();

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

  const GetSubdivision = async (id) => {
    setIsLoading(true);
    try {
      let responseData = await AdminSubdevisionService.show(id).json();
      setIsLoading(false);
      setSubdivision(responseData);

      if (responseData.builder) {
        const formattedBuilderCode = {
          value: responseData.builder.id,
          label: responseData.builder.name,
        };
        setBuilderCode(formattedBuilderCode);
      }

      setStatus(responseData.status);
      setProductType(responseData.product_type);
      setReporting(responseData.reporting);
      setProductType(responseData.product_type);
      setSingle(responseData.single);
      setAge(responseData.age);
      setArea(responseData.area);
      setJuridiction(responseData.juridiction);
      setMasterPlan(responseData.masterplan_id);
      setGate(responseData.gated);
    } catch (error) {
      setIsLoading(false);
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(errorJson.message);
      }
    }
  };

  const GetBuilderlist = async () => {
    try {
      const response = await AdminBuilderService.all_builder_list();
      const responseData = await response.json();
      setBuilderList(responseData);
    } catch (error) {
      console.log(error);
      if (error.name === 'HTTPError') {
        const errorJson = await error.response.json();
        setError(errorJson.message)
      }
    }
  };

  useEffect(() => {
    const formattedOptions = BuilderList
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(element => ({
        value: element.id,
        label: element.name
      }));
    setOptions(formattedOptions);
  }, [BuilderList]);

  useEffect(() => {
    if (localStorage.getItem("usertoken")) {
      GetBuilderlist();
      GetSubdivision(params.id);
    } else {
      navigate("/");
    }
  }, []);

  const handleBuilderCode = (code) => {
    setBuilderCode(code);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      var userData = {
        builder_id: BuilderCode.value ? BuilderCode.value : Subdivision.builder_id,
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
        masterplan_id: masterplan,
        lat: event.target.lat.value,
        lng: event.target.lng.value,
        area: area,
        juridiction: juridiction,
        zipcode: event.target.zipcode.value,
        parcel: event.target.parcel.value,
        crossstreet: event.target.crossstreet.value,
        totallots: event.target.totallots.value,
        lotwidth: event.target.lotwidth.value,
        lotsize: event.target.lotsize.value,
        gated: gate,
        masterplanfee: event.target.masterplanfee.value,
        zoning: event.target.zoning.value,
        gasprovider: event.target.gasprovider.value,
        website: event.target.website.value,
        unsoldlots: 0,
        lotreleased: 0,
        stadinginventory: 0,
        permits: 0,
        netsales: 0,
        closing: 0,
        monthsopen: 0,
      };

      const data = await AdminSubdevisionService.update(params.id, userData).json();

      if (data.status === true) {
        swal("Subdivision Update Succesfully").then((willDelete) => {
          if (willDelete) {
            navigate("/subdivisionlist");
          }
        });
      } else {
        var error;
        if (error.name === "HTTPError") {
          const errorJson = await error.response.json();
          setError(
            errorJson.message.substr(0, errorJson.message.lastIndexOf("."))
          );
        }
      }
    } catch (error) {
      console.log(error)
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(
          errorJson.message.substr(0, errorJson.message.lastIndexOf("."))
        );
      }
    }
  };

  return (
    <Fragment>
      <MainPagetitle mainTitle="Edit Subdivision" pageTitle="Edit Subdivision" parentTitle="Subdivisions" link="/subdivisionlist" />
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header">
                <h4 className="card-title">Edit Subdivision</h4>
              </div>
              {isLoading ? (
                <div className="d-flex justify-content-center align-items-center mb-5" style={{ marginTop: "200px" }}>
                  <ClipLoader color="#4474fc" />
                </div>
              ) : (
                <div className="card-body">
                  <div className="form-validation">
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-xl-6 mb-3">
                          <label className="form-label">Builder Code</label>
                          <Form.Group controlId="tournamentList">
                            <Select
                              options={options}
                              value={BuilderCode}
                              onChange={(selectedOption) => handleBuilderCode(selectedOption)}
                            ></Select>
                          </Form.Group>
                        </div>

                        <div className="col-xl-6 mb-3">
                          <label htmlFor="exampleFormControlInput2" className="form-label">Subdivision Code</label>
                          <input
                            type="text"
                            value={Subdivision.subdivision_code}
                            name="subdivision_code"
                            className="form-control"
                            id="exampleFormControlInput2"
                            placeholder=""
                            onkeydown="return false"
                            disabled
                            style={{ backgroundColor: "#e9ecef", cursor: "not-allowed" }}
                          />
                        </div>

                        <div className="col-xl-6 mb-3">
                          <label htmlFor="exampleFormControlInput3" className="form-label">Name <span className="text-danger">*</span></label>
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
                          <label htmlFor="exampleFormControlInput4" className="form-label">Status</label>
                          <select className="default-select form-control" onChange={handleStatus} value={status}>
                            <option value="1">Active</option>
                            <option value="0">Sold Out</option>
                            <option value="2">Future</option>
                          </select>
                        </div>

                        <div className="col-xl-6 mb-3">
                          <label htmlFor="exampleFormControlInput5" className="form-label">Reporting</label>
                          <select className="default-select form-control" onChange={handleReporting} value={reporting}>
                            <option value="1">Yes</option>
                            <option value="0">No</option>
                          </select>
                        </div>

                        <div className="col-xl-6 mb-3">
                          <label htmlFor="exampleFormControlInput6" className="form-label">Product Type</label>
                          <select className="default-select form-control" onChange={handleProductType} value={productType}>
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
                            defaultValue={Subdivision.phone}
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
                          <input
                            type="date"
                            defaultValue={Subdivision.opensince}
                            name="opensince"
                            className="form-control"
                          />
                        </div>

                        <div className="col-xl-6 mb-3">
                          <label className="form-label">Age Restricted</label>
                          <select className="default-select form-control" name="" onChange={handleAge} value={age}>
                            <option value="1">Yes</option>
                            <option value="0">No</option>
                          </select>
                        </div>

                        <div className="col-xl-6 mb-3">
                          <label htmlFor="exampleFormControlInput8" className="form-label">All Single Story</label>
                          <select className="default-select form-control" name="" onChange={handleSingle} value={single}>
                            <option value="1">Yes</option>
                            <option value="0">No</option>
                          </select>
                        </div>

                        <div className="col-xl-6 mb-3">
                          <label htmlFor="exampleFormControlInput9" className="form-label">First Permit Date</label>
                          <input
                            type="date"
                            defaultValue={Subdivision?.get_permits?.[0]?.date || ''}
                            name="firstpermitdate"
                            className="form-control"
                            id="exampleFormControlInput9"
                            placeholder=""
                            disabled
                          />
                        </div>

                        <div className="col-xl-6 mb-3">
                          <label htmlFor="exampleFormControlInput10" className="form-label">Masterplan</label>
                          <select className="default-select form-control" name="" onChange={handleMasterPlan} value={masterplan}>
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
                          <label htmlFor="exampleFormControlInput11" className="form-label">Latitude</label>
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
                          <label htmlFor="exampleFormControlInput12" className="form-label">Longitude</label>
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
                          <label htmlFor="exampleFormControlInput13" className="form-label">Area</label>
                          <select className="default-select form-control" name="" onChange={handleArea} value={area}>
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
                          <label htmlFor="exampleFormControlInput14" className="form-label">Juridiction</label>
                          <select className="default-select form-control" name="" onChange={handleJurisdiction} value={juridiction}>
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
                          <label htmlFor="exampleFormControlInput15" className="form-label">Zipcode</label>
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
                          <label htmlFor="exampleFormControlInput16" className="form-label">Parcel</label>
                          <input
                            type="text"
                            defaultValue={Subdivision.parcel}
                            name="parcel"
                            className="form-control"
                            id="exampleFormControlInput16"
                          />
                        </div>

                        <div className="col-xl-6 mb-3">
                          <label htmlFor="exampleFormControlInput17" className="form-label">Cross Street</label>
                          <input
                            type="text"
                            defaultValue={Subdivision.crossstreet}
                            name="crossstreet"
                            className="form-control"
                            id="exampleFormControlInput17"
                          />
                        </div>

                        <div className="col-xl-6 mb-3">
                          <label htmlFor="exampleFormControlInput18" className="form-label">Total Lots</label>
                          <input
                            type="number"
                            defaultValue={Subdivision.totallots}
                            name="totallots"
                            className="form-control"
                            id="exampleFormControlInput18"
                          />
                        </div>

                        <div className="col-xl-6 mb-3">
                          <label htmlFor="exampleFormControlInput21" className="form-label">Lot Width</label>
                          <input
                            type="number"
                            defaultValue={Subdivision.lotwidth}
                            name="lotwidth"
                            className="form-control"
                            id="exampleFormControlInput21"
                          />
                        </div>

                        <div className="col-xl-6 mb-3">
                          <label htmlFor="exampleFormControlInput23" className="form-label">Lot Size</label>
                          <input
                            type="number"
                            defaultValue={Subdivision.lotsize}
                            name="lotsize"
                            className="form-control"
                            id="exampleFormControlInput23"
                          />
                        </div>

                        <div className="col-xl-6 mb-3">
                          <label htmlFor="exampleFormControlInput28" className="form-label">Gated</label>
                          <select className="default-select form-control" onChange={handleGate} value={gate}>
                            <option value="">Select Gate</option>
                            <option value="1">Yes</option>
                            <option value="0">No</option>
                          </select>
                        </div>

                        <div className="col-xl-6 mb-3">
                          <label htmlFor="exampleFormControlInput31" className="form-label">Master Plan Fee</label>
                          <input
                            type="number"
                            defaultValue={Subdivision.masterplanfee}
                            name="masterplanfee"
                            className="form-control"
                            id="exampleFormControlInput31"
                          />
                        </div>

                        <div className="col-xl-6 mb-3">
                          <label htmlFor="exampleFormControlInput34" className="form-label">Zoning</label>
                          <input
                            type="text"
                            defaultValue={Subdivision.zoning}
                            name="zoning"
                            className="form-control"
                            id="exampleFormControlInput34"
                          />
                        </div>

                        <div className="col-xl-6 mb-3">
                          <label htmlFor="exampleFormControlInput35" className="form-label">Gas Provider</label>
                          <input
                            type="text"
                            defaultValue={Subdivision.gasprovider}
                            name="gasprovider"
                            className="form-control"
                            id="exampleFormControlInput35"
                          />
                        </div>
                        <div className="col-xl-6 mb-3">
                          <label htmlFor="exampleFormControlInput36" className="form-label">Website</label>
                          <input
                            type="text"
                            defaultValue={Subdivision.website}
                            name='website'
                            className="form-control"
                            id="exampleFormControlInput36"
                            placeholder=""
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
                          to={"/subdivisionlist"}
                          className="btn btn-danger light ms-1"
                        >
                          Cancel
                        </Link>
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

export default SubdivisionUpdate;