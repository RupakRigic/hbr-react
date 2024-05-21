import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import AdminBuilderService from "../../../API/Services/AdminService/AdminBuilderService";
import AdminGoogleMapService from "../../../API/Services/AdminService/AdminGoogleMapService";
import DateComponent from "../../components/date/DateFormat";
import PriceComponent from "../../components/Price/PriceComponent";
import { Form,Offcanvas } from "react-bootstrap";
import Select from "react-select";
import AdminSubdevisionService from "../../../API/Services/AdminService/AdminSubdevisionService";
import Button from "react-bootstrap/Button";


const containerStyle = {
  width: "100%",
  height: "550px",
};

const defaultCenter = {
  lat: 36.201946,
  lng: -115.120216,
};

const GoogleMapLocator = () => {

  const [manageFilterOffcanvas, setManageFilterOffcanvas] = useState(false);

  const [builderList, setBuilderList] = useState([]);
  const [subdivisionList, setSubdivisionList] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [builderId, setBuilderId] = useState('');
  const [searchQuery, setSearchQuery] = useState("");
  const [filterQuery, setFilterQuery] = useState({
    status: "",
    product_type: "",
    reporting: "",
    builder_name:"",
    name:"",
    product_type:"",
    area:"",
    masterplan_id:"",
    zipcode:"",
    lotwidth:"",
    lotsize:"",
    zoning:"",
    age:"",
    single:"",
    gated:"",
    juridiction:"",
    gasprovider:"",
    hoafee:"",
    masterplan_id:""
  });
  console.log(filterQuery)

  const filterString = () => {
    const queryString = Object.keys(filterQuery)
      .map(
        (key) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(filterQuery[key])}`
      )
      .join("&");

    return queryString ? `?${queryString}` : "";
  };

  useEffect(() => {
    setSearchQuery(filterString());
  }, [filterQuery]);

  
  const HandleFilterForm = (e) =>
    {
      e.preventDefault();
      console.log(filterQuery);
      fetchSubdivisionList(filterQuery);
    };

    const HandleFilter = (e) => {
      const { name, value } = e.target;
      setFilterQuery((prevFilterQuery) => ({
        ...prevFilterQuery,
        [name]: value,
      }));
    };
  
    const HandleSelectChange = (selectedOption) => {
      setFilterQuery((prevFilterQuery) => ({
        ...prevFilterQuery,
        builder_name: selectedOption.name,
      }));
    };

    const HandleCancelFilter = (e) => {
      setFilterQuery(
        {
          status: "",
          product_type: "",
          reporting: "",
          builder_name:"",
          name:"",
          product_type:"",
          area:"",
          masterplan_id:"",
          zipcode:"",
          lotwidth:"",
          lotsize:"",
          zoning:"",
          age:"",
          single:"",
          gated:"",
          juridiction:"",
          gasprovider:"",
          hoafee:"",
          masterplan_id:""
        });
        fetchSubdivisionList(searchQuery);
    };

  useEffect(() => {
    const fetchBuilderList = async () => {
      try {
        const response = await AdminBuilderService.builderDropDown();
        const data = await response.json();
        console.log(data)
        setBuilderList(data);
      } catch (error) {
        console.log("Error fetching builder list:", error);
      }
    };

    fetchBuilderList();
  }, []);

  const fetchSubdivisionList = async () => {

    try {
      const response = await AdminSubdevisionService.getByBuilderId(searchQuery);
      const data = await response.json();
      setSubdivisionList(data);
    } catch (error) {
      console.log("Error fetching subdivision list:", error);
    }
  };

  useEffect(() => {
    fetchSubdivisionList();
  }, [builderId]);

  const handleBuilderChange = (selectedOption) => {
    if (selectedOption) {
      setBuilderId(selectedOption.id);
      console.log(selectedOption.id);
    } else {
      setBuilderId("");
    }
  };

  return (
    <div className="container">
            <Offcanvas
        show={manageFilterOffcanvas}
        onHide={setManageFilterOffcanvas}
        className="offcanvas-end customeoff"
        placement="end"
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="modal-title" id="#gridSystemModal">
            Filter Subdivision{" "}
          </h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setManageFilterOffcanvas(false)}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="offcanvas-body">
          <div className="container-fluid">
          <div className="">
                            <form onSubmit={HandleFilterForm}>
                              <div className="row">
                              <div className="col-md-3 mt-3">
                                  <label className="form-label">
                                    STATUS:{" "}
                                    <span className="text-danger"></span>
                                  </label>
                                  <select
                                    className="default-select form-control"
                                    value={filterQuery.is_active}
                                    name="status"
                                    onChange={HandleFilter}
                                  >
                                    <option value="">All</option>
                                    <option value="1">Active</option>
                                    <option value="0">Sold Out</option>
                                    <option value="2">Future</option>
                                  </select>
                              </div>
                              <div className="col-md-3 mt-3">
                                  <label className="form-label">
                                    REPORTING:{" "}
                                    <span className="text-danger"></span>
                                  </label>
                                  <select
                                    className="default-select form-control"
                                    value={filterQuery.is_active}
                                    name="reporting"
                                    onChange={HandleFilter}
                                  >
                                    <option value="">All</option>
                                    <option value="1">Yes</option>
                                    <option value="0">No</option>
                                  </select>
                              </div>
                              <div className="col-md-3 mt-3">
                                {/* <label className="form-label">
                                  BUILDER NAME:{" "}
                                  <span className="text-danger"></span>
                                </label>

                                <input name="builder_name" className="form-control" value={filterQuery.builder_name} onChange={HandleFilter}/>
                              */}
                                <label className="form-label">
                                BUILDER NAME:{" "}
                                    <span className="text-danger"></span>
                                  </label>
                                  <Form.Group controlId="tournamentList">
                          <Select
                            options={builderList}
                            onChange={HandleSelectChange}
                            getOptionValue={(option) => option.name}
                            getOptionLabel={(option) => option.name}
                            value={builderList.name}
                            name="builder_name"
                          ></Select>
                        </Form.Group>
                             
                              </div>
                              <div className="col-md-3 mt-3">
                                <label className="form-label">
                                NAME :{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input  value={filterQuery.name} name="name" className="form-control"  onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3">
                              <label htmlFor="exampleFormControlInput6" className="form-label"> Product Type <span className="text-danger"></span></label>
                                    <select className="default-select form-control" name="product_type" onChange={HandleFilter} >
                                        <option value="">Select Product Type</option>
                                         <option value="DET">DET</option>
                                        <option value="ATT">ATT</option>
                                        <option value="HR">HR</option>
                                        <option value="AC">AC</option>
                                    </select> 
                              </div>
                              <div className="col-md-3 mt-3">
                                <label className="form-label">
                                AREA:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input name="area" value={filterQuery.area} className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3">
                                <label className="form-label">
                                MASTERPLAN:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input value={filterQuery.masterplan_id} name="masterplan_id" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3">
                                <label className="form-label">
                                ZIP CODE:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input value={filterQuery.zipcode} name="zipcode" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3">
                                <label className="form-label">
                                LOT WIDTH:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input type="text" name="lotwidth" value={filterQuery.lotwidth} className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3">
                                <label className="form-label">
                                LOT SIZE:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input type="text" value={filterQuery.lotsize} name="lotsize" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3">
                                <label className="form-label">
                                ZONING:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input  value={filterQuery.zoning} name="zoning" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3">
                              <label htmlFor="exampleFormControlInput8" className="form-label">AGE RESTRICTED</label>
                              <select className="default-select form-control" name="age" onChange={HandleFilter} >
                                    <option value="">Select age Restricted</option>
                                        <option value="1">Yes</option>
                                        <option value="0">No</option>
                              </select>    
                              </div>
                              <div className="col-md-3 mt-3 ">
                              <label htmlFor="exampleFormControlInput8" className="form-label">All SINGLE STORY</label>
                                    <select className="default-select form-control" name="single" onChange={HandleFilter} >
                                        <option value="">Select Story</option>
                                        <option value="1">Yes</option>
                                        <option value="0">No</option>
                                    </select>    
                              </div>
                              <div className="col-md-3 mt-3 mb-3">
                              <label htmlFor="exampleFormControlInput28" className="form-label">GATED</label>
                                    <select className="default-select form-control" 
                                    onChange={HandleFilter} 
                                    value={filterQuery.gated}
                                    name="gated"
                                    > 
                                        <option value="">Select Gate</option>
                                        <option value="1">Yes</option>
                                        <option value="0">No</option>
                                    </select>                                </div>
                              <div className="col-md-3 mt-3 mb-3">
                                <label className="form-label">
                                JURISDICTION:{" "}
                                </label>
                                <input value={filterQuery.juridiction} name="juridiction" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3 mb-3">
                                <label className="form-label">
                                GAS PROVIDER:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input value={filterQuery.gasprovider} name="gasprovider" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3 mb-3">
                                <label className="form-label">
                                HOA FEE:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input value={filterQuery.hoafee} name="hoafee" className="form-control" onChange={HandleFilter}/>
                              </div>
                              <div className="col-md-3 mt-3 mb-3">
                                <label className="form-label">
                                MASTERPLAN FEE:{" "}
                                  <span className="text-danger"></span>
                                </label>
                                <input value={filterQuery.masterplanfee} name="masterplanfee" className="form-control" onChange={HandleFilter}/>
                              </div>
                             </div>
                             </form>
                            </div>
                              <div className="d-flex justify-content-between">                 
                                <Button
                                  className="btn-sm"
                                  onClick={HandleCancelFilter}
                                  variant="secondary"
                                >
                                  Reset
                                </Button>    
                                <Button
                                  className="btn-sm"
                                  onClick={HandleFilterForm}
                                  variant="primary"
                                >
                                  Filter
                                </Button>       
                            </div>
          </div>
        </div>
      </Offcanvas>
      <div className="row mb-3">
        <div className="d-flex justify-content-end align-items-center">  


        <button className="btn btn-success btn-sm me-1" onClick={() => setManageFilterOffcanvas(true)}>
                      <i className="fa fa-filter" />
                      </button>   

          {/* <label className="form-label">Builder:</label>
  
          <Form.Group controlId="tournamentList">
                          <Select
                            options={builderList}
                            onChange={handleBuilderChange}
                            getOptionValue={(option) => option.name}
                            getOptionLabel={(option) => option.name}
                            value={builderList.builderId}
                          ></Select>
                        </Form.Group> */}
        </div>
      </div>
      
      <LoadScript googleMapsApiKey="AIzaSyDY5Dsqd_6ZlAWwdohre3Fiz3K8hbRqcAE">
        <GoogleMap mapContainerStyle={containerStyle} zoom={8} center={defaultCenter}
         options={{
            mapTypeId: "satellite",
          }}
        >
        {subdivisionList !== null && subdivisionList.length > 0 && (
            subdivisionList.map((record, index) => (
        <Marker
          key={index}
          position={{ lat: parseFloat(record.lat), lng: parseFloat(record.lng) }}
          onClick={() => setSelectedMarker(record)}
        />
     ))
    )}

          {selectedMarker && (
            <InfoWindow
              position={{ lat: parseFloat(selectedMarker.lat), lng: parseFloat(selectedMarker.lng) }}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div>
                <h4>{selectedMarker.name}</h4>
                <div>
                Reporting :<span>
                {selectedMarker.reporting === 1 && "Yes"}
                {selectedMarker.reporting === 0 && "No"}
                </span>
                </div>
                <div>
                Product Type :<span>
                     {selectedMarker.product_type}
                </span>
                </div>

                <div>
                Area :<span>
                     {selectedMarker.area}
                </span>
                </div>
            <div>
                Masterplan :<span>
                     {selectedMarker.masterplan_id == ''? 'NA' :selectedMarker.masterplan_id}
                </span>
             </div>
             <div>
                Zip Code :<span>
                     {selectedMarker.zipcode == ''? 'NA' :selectedMarker.zipcode}
                </span>
             </div>
             <div>
                Total lots :<span>
                     {selectedMarker.zipcode == ''? 'NA' :selectedMarker.totallots}
                </span>
             </div>
             <div>
                Total Width :<span>
                     {selectedMarker.lotwidth == ''? 'NA' :selectedMarker.lotwidth}
                </span>
             </div>
             <div>
                Total Size :<span>
                     {selectedMarker.lotsize == ''? 'NA' :selectedMarker.lotsize}
                </span>
             </div>
             <div>
                Zoning :<span>
                     {selectedMarker.zoning == ''? 'NA' :selectedMarker.zoning}
                </span>
             </div>
             <div>
                Age Restricted :<span>
                {selectedMarker.age === 1 && "Yes"}
                {selectedMarker.age === 0 && "No"}
                </span>
             </div>
             <div>
                All Single Story :<span>
                {selectedMarker.single === 1 && "Yes"}
                {selectedMarker.single === 0 && "No"}
                </span>
             </div>
             <div>
                Gated :<span>
                {selectedMarker.gated === 1 && "Yes"}
                {selectedMarker.gated === 0 && "No"}
                </span>
             </div> 
             <div>
                Juridiction :
                <span>
                     {selectedMarker.juridiction == ''? 'NA' :selectedMarker.juridiction}
                </span>
             </div> 
             <div>
                Longitude :
                <span>
                     {selectedMarker.lng == ''? 'NA' :selectedMarker.lng}
                </span>
             </div> 
             <div>
                Latitude :
                <span>
                     {selectedMarker.lat == ''? 'NA' :selectedMarker.lat}
                </span>
             </div> 
             <div>
                Gas Provider :
                <span>
                     {selectedMarker.gasprovider == ''? 'NA' :selectedMarker.gasprovider}
                </span>
             </div> 
             <div>
                HOA Fee :
                <span>
                     {selectedMarker.hoafee == ''? 'NA' :selectedMarker.hoafee}
                </span>
             </div> 
             <div>
                Masterplan Fee :
                <span>
                     {selectedMarker.masterplanfee == ''? 'NA' :selectedMarker.masterplanfee}
                </span>
             </div> 
             <div>
                Parcel Group :
                <span>
                     {selectedMarker.parcel == ''? 'NA' :selectedMarker.parcel}
                </span>
             </div> 
             <div>
                Phone :
                <span>
                     {selectedMarker.phone == ''? 'NA' :selectedMarker.phone}
                </span>
             </div>
             <div>
                Website :
                <span>
                     {selectedMarker.builder.website == ''? 'NA' :selectedMarker.builder.website}
                </span>
             </div>  
             <div>
             _fkBuilderID :
                <span>
                     {selectedMarker.builder.builder_code  == ''? 'NA' :selectedMarker.builder.builder_code}
                </span>
             </div>
             <div>
                Date Added :
                <span>
                <DateComponent date={selectedMarker.created_at} />
                </span>
             </div> 
             <div>
             Total Closing :
                <span>
                     {selectedMarker.total_closings  == ''? 'NA' :selectedMarker.total_closings}
                </span>
             </div>
             <div>
             Total Permits :
                <span>
                     {selectedMarker.total_permits  == ''? 'NA' :selectedMarker.total_permits}
                </span>
             </div>
             <div>
             Total Net Sales :
                <span>
                     {selectedMarker.total_net_sales  == ''? 'NA' :selectedMarker.total_net_sales}
                </span>
             </div>
             <div>
             Months Open :
                <span>
                     {selectedMarker.months_open  == ''? 'NA' :selectedMarker.months_open}
                </span>
             </div>
             <div>
             Latest Traffic/Sales Data :
               <DateComponent date={selectedMarker.latest_traffic_data} />
             </div>
             <div>
             Latest Lots Released :
            <span>{selectedMarker.latest_lots_released} </span>
             </div>
             <div>
             Latest Standing Inventory :
               <span>{selectedMarker.latest_standing_inventory} </span>
             </div>
             <div>
             Unsold Lots :
               <span>{selectedMarker.unsold_lots} </span>
             </div>
             <div>
             Avg Sqft All :
               <span>{selectedMarker.avg_sqft_all} </span>
             </div>
             <div>
             Avg Sqft Active :
               <span>{selectedMarker.avg_sqft_active} </span>
             </div>
             <div>
                Avg Base Price Active :
                <span>{<PriceComponent price={selectedMarker.avg_base_price_all} /> || "NA"} </span>
            </div>
            <div>
                Avg Base Price Active :
                <span>{<PriceComponent price={selectedMarker.avg_base_price_active} /> || "NA"} </span>
            </div>
            <div>
            Min Sqft All :
                <span>{selectedMarker.min_sqft_all || "NA"} </span>
            </div>
            <div>
            Min Sqft Active :
                <span>{selectedMarker.min_sqft_active || "NA"} </span>
            </div>
            <div>
            Max Sqft All :
                <span>{selectedMarker.max_sqft_all || "NA"} </span>
            </div>
            <div>
            Max Sqft Active :
                <span>{selectedMarker.max_sqft_active || "NA"} </span>
            </div>
            <div>
            Min Base Price All :
            {<PriceComponent price={selectedMarker.min_base_price_all} /> || "NA"}
            </div>
            <div>
            Min SQFT Active Current :
            <span>{selectedMarker.min_sqft_active_current || "NA"} </span>
            </div>
            <div>
            Max Base Price All :
            {<PriceComponent price={selectedMarker.max_base_price_all} /> || "NA"}        
            </div>
            <div>
            Min SQFT Active Current :
            <span>{selectedMarker.max_sqft_active_current || "NA"} </span>
            </div>
            <div>
            Min SQFT Active Current :
            <span>{selectedMarker.max_sqft_active_current || "NA"} </span>
            </div>
            <div>
            Avg Net Traffic Per Month This Year  :
            <span>{selectedMarker.avg_net_traffic_per_month_this_year || "NA"} </span>
            </div>

            <div>
            Avg Net Traffic Per Month This Year :
            <span>{selectedMarker.avg_net_traffic_per_month_this_year || "NA"} </span>
            </div>

            <div>
            Avg Net Sales Per Month This Year :
            <span>{selectedMarker.avg_net_sales_per_month_this_year || "NA"} </span>
            </div>

            <div>
            Avg Closings Per Month This Year :
            <span>{selectedMarker.avg_closings_per_month_this_year || "NA"} </span>
            </div>

            <div>
            Avg Net Sales Per Month Since Open :
            <span>{selectedMarker.avg_net_sales_per_month_since_open || "NA"} </span>
            </div>
            
            <div>
            Avg Net Sales Per Month Last Three Months :
            <span>{selectedMarker.avg_net_sales_per_month_last_three_months || "NA"} </span>
            </div>

            <div>
            Avg Net Sales Per Month Last Three Months :
            <span>{selectedMarker.avg_net_sales_per_month_last_three_months || "NA"} </span>
            </div>

            <div>
            Avg Net Sales Per Month Last Three Months :
            <span>{selectedMarker.avg_net_sales_per_month_last_three_months || "NA"} </span>
            </div>
            <div>
            Max Week Ending :
            {<DateComponent date={selectedMarker.max_week_ending} /> || "NA"}
            </div>

            <div>

            Min Week Ending :
        {<DateComponent date={selectedMarker.min_week_ending} /> || "NA"}
        </div>

            </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>  
  );
};

export default GoogleMapLocator;
