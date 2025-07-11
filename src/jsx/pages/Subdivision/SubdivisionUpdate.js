import React, { Fragment, useState, useEffect } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { Form } from "react-bootstrap";
import AdminSubdevisionService from "../../../API/Services/AdminService/AdminSubdevisionService";
import AdminBuilderService from "../../../API/Services/AdminService/AdminBuilderService";
import swal from "sweetalert";
import Select from "react-select";
import ClipLoader from "react-spinners/ClipLoader";
import MainPagetitle from "../../layouts/MainPagetitle";

const SubdivisionUpdate = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const page = queryParams.get("page");

  const [isLoading, setIsLoading] = useState(false);
  const [BuilderList, setBuilderList] = useState([]);
  const [options, setOptions] = useState([]);
  const [BuilderCode, setBuilderCode] = useState([]);
  const [Error, setError] = useState("");
  const [Subdivision, setSubdivision] = useState([]);
  const params = useParams();
  const [status, setStatus] = useState("");
  const [productType, setProductType] = useState("");
  const [reporting, setReporting] = useState("");
  const [single, setSingle] = useState("");
  const [age, setAge] = useState("");
  const [area, setArea] = useState("");
  const [juridiction, setJuridiction] = useState("");
  const [gate, setGate] = useState('');
  const [masterPlanDropDownList, setMasterPlanDropDownList] = useState([]);
  const [selectedMasterPlan, setSelectedMasterPlan] = useState([]);
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
      console.log("Error fetching master plan list:", error);
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        console.log(errorJson);
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
      GetMasterPlanDropDownList();
      GetSubdivision(params.id);
    } else {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    if(Subdivision?.masterplan_id && masterPlanDropDownList?.length > 0) {
      const masterPlan = masterPlanDropDownList?.filter((data => data.value === Subdivision?.masterplan_id));
      handleSelectMasterPlanChange(masterPlan);
    }
  }, [Subdivision, masterPlanDropDownList]);

  const handleBuilderCode = (code) => {
    setBuilderCode(code);
  };

  const handleSelectMasterPlanChange = (selectedOption) => {
    setSelectedMasterPlan(selectedOption);
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
        masterplan_id: selectedMasterPlan?.value,
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
      };

      const data = await AdminSubdevisionService.update(params.id, userData).json();

      if (data.status === true) {
        swal("Record Updated Successfully").then((willDelete) => {
          if (willDelete) {
            navigate(`/subdivisionlist?page=${page}`);
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
      <MainPagetitle mainTitle="Edit Subdivision" pageTitle="Edit Subdivision" parentTitle="Subdivisions" link={`/subdivisionlist?page=${page}`} />
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
                          <label className="form-label">Builder Code <span className="text-danger">*</span></label>
                          <Form.Group controlId="tournamentList">
                            <Select
                              options={options}
                              value={BuilderCode}
                              onChange={(selectedOption) => handleBuilderCode(selectedOption)}
                              placeholder={"Selecte Builder"}
                              styles={{
                                container: (provided) => ({
                                    ...provided,
                                    color: 'black'
                                }),
                                menu: (provided) => ({
                                    ...provided,
                                    color: 'black'
                                }),
                            }}
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

                        {/* <div className="col-xl-6 mb-3">
                          <label htmlFor="exampleFormControlInput9" className="form-label">First Permit Date</label>
                          <input
                            type="date"
                            defaultValue={Subdivision?.get_permits?.[0]?.date || ''}
                            name="firstpermitdate"
                            className="form-control"
                            placeholder=""
                            disabled
                            style={{ backgroundColor: "#e9ecef", cursor: "not-allowed" }}
                          />
                        </div> */}

                        <div className="col-xl-6 mb-3">
                          <label htmlFor="exampleFormControlInput10" className="form-label">Master Plan</label>
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
                          <label htmlFor="exampleFormControlInput14" className="form-label">Jurisdiction</label>
                          <select className="default-select form-control" name="" onChange={handleJurisdiction} value={juridiction}>
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
                          to={`/subdivisionlist?page=${page}`}
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