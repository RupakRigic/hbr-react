import React, { useState, forwardRef, useEffect, Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Offcanvas, Form } from 'react-bootstrap';
import AdminSubdevisionService from "../../../API/Services/AdminService/AdminSubdevisionService";
import swal from "sweetalert";
import Select from "react-select";
import AdminBuilderService from '../../../API/Services/AdminService/AdminBuilderService';
import ClipLoader from 'react-spinners/ClipLoader';

const BulkLandsaleUpdate = forwardRef((props) => {
  const { selectedLandSales, canvasShowEdit, seCanvasShowEdit } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [Error, setError] = useState("");
  const [BuilderCode, setBuilderCode] = useState([]);
  const [masterplan, setMasterPlan] = useState([]);
  const [area, setArea] = useState([]);
  const [juridiction, setJuridiction] = useState([]);
  const [status, setStatus] = useState("");
  const [productType, setProductType] = useState("");
  const [reporting, setReporting] = useState("");
  const [single, setSingle] = useState("");
  const [age, setAge] = useState("");
  const [gate, setGate] = useState("");
  const [options, setOptions] = useState([]);
  const [optionsMasterPlan, setOptionsMasterPlan] = useState([]);
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

  const handleArea = (selectedOption) => {
    setArea(selectedOption);
  };

  const handleJurisdiction = (selectedOption) => {
    setJuridiction(selectedOption);
  };

  const handleMasterPlan = (selectedOption) => {
    setMasterPlan(selectedOption);
  };

  const handleGate = (e) => {
    setGate(e.target.value);
  };

  useEffect(() => {
    if (localStorage.getItem("usertoken")) {
      if (selectedLandSales.length > 0 && canvasShowEdit) {
        GetBuilderlist();
        GetMasterPlanDropDownList();
      } else {
        return;
      }
    } else {
      navigate("/");
    }
  }, [selectedLandSales, canvasShowEdit]);

  const GetBuilderlist = async () => {
    setIsLoading(true);
    try {
      const response = await AdminBuilderService.all_builder_list();
      const responseData = await response.json();
      let options = responseData
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(element => ({
          value: element.id,
          label: element.name
        }));
      setOptions(options);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
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
      setOptionsMasterPlan(formattedData);
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
    if (selectedLandSales.length === 0) {
      setError('No selected records'); return false
    }
    swal({
      title: "Are you sure?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          var userData = {
            builder_id: BuilderCode?.value,
            name: event.target.name.value,
            status: status,
            reporting: reporting,
            product_type: productType,
            phone: event.target.phone.value,
            opensince: event.target.opensince.value,
            age: age,
            single: single,
            masterplan_id: masterplan?.value,
            lat: event.target.lat.value,
            lng: event.target.lng.value,
            area: area?.value,
            juridiction: juridiction?.value,
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
          const data = await AdminSubdevisionService.bulkupdate(selectedLandSales, userData).json();
          if (data.status === true) {
            swal("Records Updated Successfully").then((willDelete) => {
              if (willDelete) {
                HandleUpdateCanvasClose();
                props.parentCallback();
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
    })
  };

  const HandleUpdateCanvasClose = () => {
    seCanvasShowEdit(false); 
    setError('');
    setBuilderCode([]);
    setStatus("");
    setReporting("");
    setProductType("");
    setAge("");
    setSingle("");
    setMasterPlan([]);
    setArea([]);
    setJuridiction([]);
    setGate("");
};

  const optionsArea = [
    { value: "BC", label: "BC" },
    { value: "E", label: "E" },
    { value: "H", label: "H" },
    { value: "IS", label: "IS" },
    { value: "L", label: "L" },
    { value: "MSQ", label: "MSQ" },
    { value: "MV", label: "MV" },
    { value: "NLV", label: "NLV" },
    { value: "NW", label: "NW" },
    { value: "P", label: "P" },
    { value: "SO", label: "SO" },
    { value: "SW", label: "SW" },
  ];

  const optionsJuridiction = [
    { value: "Boulder City", label: "Boulder City" },
    { value: "CLV", label: "CLV" },
    { value: "CC Enterprise", label: "CC Enterprise" },
    { value: "CC Indian Springs", label: "CC Indian Springs" },
    { value: "CC Laughlin", label: "CC Laughlin" },
    { value: "Lone Mtn", label: "Lone Mtn" },
    { value: "Lower Kyle Canyon", label: "Lower Kyle Canyon" },
    { value: "CC Moapa Valley", label: "CC Moapa Valley" },
    { value: "CC Mt Charleston", label: "CC Mt Charleston" },
    { value: "CC Mtn Springs", label: "CC Mtn Springs" },
    { value: "CC Paradise", label: "CC Paradise" },
    { value: "CC Searchlight", label: "CC Searchlight" },
    { value: "CC Spring Valley", label: "CC Spring Valley" },
    { value: "CC Summerlin South", label: "CC Summerlin South" },
    { value: "CC Sunrise Manor", label: "CC Sunrise Manor" },
    { value: "CC Whiteney", label: "CC Whiteney" },
    { value: "CC Winchester", label: "CC Winchester" },
    { value: "CC Unincorporated", label: "CC Unincorporated" },
    { value: "Henderson", label: "Henderson" },
    { value: "Mesquite", label: "Mesquite" },
    { value: "NLV", label: "NLV" },
    { value: "NYE", label: "NYE" },
  ];

  return (
    <Fragment>
      <Offcanvas show={canvasShowEdit} onHide={() => HandleUpdateCanvasClose()} className="offcanvas-end customeoff" placement='end'>
        <div className="offcanvas-header">
          <h5 className="modal-title" id="#gridSystemModal">{props.Title}</h5>
          <button type="button" className="btn-close"
            onClick={() => HandleUpdateCanvasClose()}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        {isLoading ? (
          <div className="d-flex justify-content-center align-items-center mb-5" style={{ marginTop: "250px" }}>
            <ClipLoader color="#4474fc" />
          </div>
        ) : (
          <div className="offcanvas-body">
            <div className="container-fluid">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-xl-6 mb-3">
                    <label className="form-label">Builder Code</label>
                    <Form.Group controlId="tournamentList">
                      <Select
                        options={options}
                        value={BuilderCode}
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
                    <label htmlFor="exampleFormControlInput3" className="form-label">Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      id="exampleFormControlInput3"
                      placeholder=""
                    />
                  </div>

                  <div className="col-xl-6 mb-3">
                    <label htmlFor="exampleFormControlInput4" className="form-label">Status</label>
                    <select className="default-select form-control" onChange={handleStatus} value={status}>
                      <option value="" disabled>Select Status</option>
                      <option value="1">Active</option>
                      <option value="0">Sold Out</option>
                      <option value="2">Future</option>
                    </select>
                  </div>

                  <div className="col-xl-6 mb-3">
                    <label htmlFor="exampleFormControlInput5" className="form-label">Reporting</label>
                    <select className="default-select form-control" onChange={handleReporting} value={reporting}>
                      <option value="" disabled>Select Reporting</option>
                      <option value="1">Yes</option>
                      <option value="0">No</option>
                    </select>
                  </div>

                  <div className="col-xl-6 mb-3">
                    <label htmlFor="exampleFormControlInput6" className="form-label">Product Type</label>
                    <select className="default-select form-control" onChange={handleProductType} value={productType}>
                      <option value="" disabled>Select Product Type</option>
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
                    <input
                      type="date"
                      name="opensince"
                      className="form-control"
                    />
                  </div>

                  <div className="col-xl-6 mb-3">
                    <label className="form-label">Age Restricted</label>
                    <select className="default-select form-control" name="" onChange={handleAge} value={age}>
                      <option value="" disabled>Select Age Restricted</option>
                      <option value="1">Yes</option>
                      <option value="0">No</option>
                    </select>
                  </div>

                  <div className="col-xl-6 mb-3">
                    <label htmlFor="exampleFormControlInput8" className="form-label">All Single Story</label>
                    <select className="default-select form-control" name="" onChange={handleSingle} value={single}>
                      <option value="" disabled>Select All Single Story</option>
                      <option value="1">Yes</option>
                      <option value="0">No</option>
                    </select>
                  </div>

                  <div className="col-xl-6 mb-3">
                    <label htmlFor="exampleFormControlInput10" className="form-label">Master Plan</label>
                    <Form.Group controlId="tournamentList">
                      <Select
                        options={optionsMasterPlan}
                        value={masterplan}
                        placeholder={"Select Master Plan..."}
                        onChange={(selectedOption) => handleMasterPlan(selectedOption)}
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
                    <label htmlFor="exampleFormControlInput11" className="form-label">Latitude</label>
                    <input
                      type="text"
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
                      name="lng"
                      className="form-control"
                      id="exampleFormControlInput12"
                      placeholder=""
                    />
                  </div>

                  <div className="col-xl-6 mb-3">
                    <label htmlFor="exampleFormControlInput13" className="form-label">Area</label>
                    <Form.Group controlId="tournamentList">
                      <Select
                        options={optionsArea}
                        value={area}
                        placeholder={"Select Area..."}
                        onChange={(selectedOption) => handleArea(selectedOption)}
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
                    <label htmlFor="exampleFormControlInput14" className="form-label">Jurisdiction</label>
                    <Form.Group controlId="tournamentList">
                      <Select
                        options={optionsJuridiction}
                        value={juridiction}
                        placeholder={"Select Jurisdiction..."}
                        onChange={(selectedOption) => handleJurisdiction(selectedOption)}
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
                    <label htmlFor="exampleFormControlInput15" className="form-label">ZIP Code</label>
                    <input
                      type="number"
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
                      name="parcel"
                      className="form-control"
                      id="exampleFormControlInput16"
                    />
                  </div>

                  <div className="col-xl-6 mb-3">
                    <label htmlFor="exampleFormControlInput17" className="form-label">Cross Street</label>
                    <input
                      type="text"
                      name="crossstreet"
                      className="form-control"
                      id="exampleFormControlInput17"
                    />
                  </div>

                  <div className="col-xl-6 mb-3">
                    <label htmlFor="exampleFormControlInput18" className="form-label">Total Lots</label>
                    <input
                      type="number"
                      name="totallots"
                      className="form-control"
                      id="exampleFormControlInput18"
                    />
                  </div>

                  <div className="col-xl-6 mb-3">
                    <label htmlFor="exampleFormControlInput21" className="form-label">Lot Width</label>
                    <input
                      type="number"
                      name="lotwidth"
                      className="form-control"
                      id="exampleFormControlInput21"
                    />
                  </div>

                  <div className="col-xl-6 mb-3">
                    <label htmlFor="exampleFormControlInput23" className="form-label">Lot Size</label>
                    <input
                      type="number"
                      name="lotsize"
                      className="form-control"
                      id="exampleFormControlInput23"
                    />
                  </div>

                  <div className="col-xl-6 mb-3">
                    <label htmlFor="exampleFormControlInput28" className="form-label">Gated</label>
                    <select className="default-select form-control" onChange={handleGate} value={gate}>
                      <option value="" disabled>Select Gate</option>
                      <option value="1">Yes</option>
                      <option value="0">No</option>
                    </select>
                  </div>

                  <div className="col-xl-6 mb-3">
                    <label htmlFor="exampleFormControlInput31" className="form-label">Master Plan Fee</label>
                    <input
                      type="number"
                      name="masterplanfee"
                      className="form-control"
                      id="exampleFormControlInput31"
                    />
                  </div>

                  <div className="col-xl-6 mb-3">
                    <label htmlFor="exampleFormControlInput34" className="form-label">Zoning</label>
                    <input
                      type="text"
                      name="zoning"
                      className="form-control"
                      id="exampleFormControlInput34"
                    />
                  </div>

                  <div className="col-xl-6 mb-3">
                    <label htmlFor="exampleFormControlInput35" className="form-label">Gas Provider</label>
                    <input
                      type="text"
                      name="gasprovider"
                      className="form-control"
                      id="exampleFormControlInput35"
                    />
                  </div>

                  <div className="col-xl-6 mb-3">
                    <label htmlFor="exampleFormControlInput36" className="form-label">Website</label>
                    <input
                      type="text"
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
                    to={"#"}
                    className="btn btn-danger light ms-1"
                    onClick={() => HandleUpdateCanvasClose()}
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
          </div>)}
      </Offcanvas>
    </Fragment>
  );
});

export default BulkLandsaleUpdate;