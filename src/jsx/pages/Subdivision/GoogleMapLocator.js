import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import AdminBuilderService from "../../../API/Services/AdminService/AdminBuilderService";
import AdminGoogleMapService from "../../../API/Services/AdminService/AdminGoogleMapService";
import DateComponent from "../../components/date/DateFormat";
import PriceComponent from "../../components/Price/PriceComponent";
import { Form } from "react-bootstrap";
import Select from "react-select";


const containerStyle = {
  width: "100%",
  height: "550px",
};

const defaultCenter = {
  lat: 36.201946,
  lng: -115.120216,
};

const GoogleMapLocator = () => {
  const [builderList, setBuilderList] = useState([]);
  const [subdivisionList, setSubdivisionList] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [builderId, setBuilderId] = useState('');

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

  useEffect(() => {
    const fetchSubdivisionList = async () => {
      if (!builderId) return;

      try {
        const response = await AdminGoogleMapService.showbybuilderid(builderId);
        const data = await response.json();
        setSubdivisionList(data);
      } catch (error) {
        console.log("Error fetching subdivision list:", error);
      }
    };

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
      <div className="row mb-3">
        <div className="col-md-4">  
          <label className="form-label">Builder:</label>
  
          <Form.Group controlId="tournamentList">
                          <Select
                            options={builderList}
                            onChange={handleBuilderChange}
                            getOptionValue={(option) => option.name}
                            getOptionLabel={(option) => option.name}
                            value={builderList.builderId}
                          ></Select>
                        </Form.Group>
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
