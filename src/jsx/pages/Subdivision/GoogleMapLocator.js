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
import { useLocation, useNavigate } from 'react-router-dom';


const containerStyle = {
  width: "100%",
  height: "800px",
};

const defaultCenter = {
  lat: 36.201946,
  lng: -115.120216,
};

const GoogleMapLocator = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {}; // Safely access state with fallback
  
  // React.useEffect(() => {
  //   console.log('Received state:', state); // This should log the state passed from Link
  // }, [state]);
  // const [manageFilterOffcanvas, setManageFilterOffcanvas] = useState(false);

  const [builderList, setBuilderList] = useState([]);
  const subdivisionList = state.subdivisionList;
console.log("subdivisionList",subdivisionList);

  const [selectedMarker, setSelectedMarker] = useState(null);
  // const [builderId, setBuilderId] = useState('');
  // const [searchQuery, setSearchQuery] = useState("");
  // const [filterQuery, setFilterQuery] = useState({
  //   status: "",
  //   product_type: "",
  //   reporting: "",
  //   builder_name:"",
  //   name:"",
  //   product_type:"",
  //   area:"",
  //   masterplan_id:"",
  //   zipcode:"",
  //   lotwidth:"",
  //   lotsize:"",
  //   zoning:"",
  //   age:"",
  //   single:"",
  //   gated:"",
  //   juridiction:"",
  //   gasprovider:"",
  //   hoafee:"",
  //   masterplan_id:""
  // });
  // console.log(filterQuery)

  // const filterString = () => {
  //   const queryString = Object.keys(filterQuery)
  //     .map(
  //       (key) =>
  //         `${encodeURIComponent(key)}=${encodeURIComponent(filterQuery[key])}`
  //     )
  //     .join("&");

  //   return queryString ? `?${queryString}` : "";
  // };

  // useEffect(() => {
  //   setSearchQuery(filterString());
  // }, [filterQuery]);

  
  // const HandleFilterForm = (e) =>
  //   {
  //     e.preventDefault();
  //     console.log(filterQuery);
  //     fetchSubdivisionList(filterQuery);
  //   };

  //   const HandleFilter = (e) => {
  //     const { name, value } = e.target;
  //     setFilterQuery((prevFilterQuery) => ({
  //       ...prevFilterQuery,
  //       [name]: value,
  //     }));
  //   };
  
  //   const HandleSelectChange = (selectedOption) => {
  //     setFilterQuery((prevFilterQuery) => ({
  //       ...prevFilterQuery,
  //       builder_name: selectedOption.name,
  //     }));
  //   };

  //   const HandleCancelFilter = (e) => {
  //     setFilterQuery(
  //       {
  //         status: "",
  //         product_type: "",
  //         reporting: "",
  //         builder_name:"",
  //         name:"",
  //         product_type:"",
  //         area:"",
  //         masterplan_id:"",
  //         zipcode:"",
  //         lotwidth:"",
  //         lotsize:"",
  //         zoning:"",
  //         age:"",
  //         single:"",
  //         gated:"",
  //         juridiction:"",
  //         gasprovider:"",
  //         hoafee:"",
  //         masterplan_id:""
  //       });
  //       fetchSubdivisionList(searchQuery);
  //   };

  // useEffect(() => {
  //   const fetchBuilderList = async () => {
  //     try {
  //       const response = await AdminBuilderService.builderDropDown();
  //       const data = await response.json();
  //       console.log(data)
  //       setBuilderList(data);
  //     } catch (error) {
  //       console.log("Error fetching builder list:", error);
  //     }
  //   };

  //   fetchBuilderList();
  // }, []);

  // const fetchSubdivisionList = async () => {

  //   try {
  //     const response = await AdminSubdevisionService.getByBuilderId(searchQuery);
  //     const data = await response.json();
  //     setSubdivisionList(data);
  //   } catch (error) {
  //     console.log("Error fetching subdivision list:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchSubdivisionList();
  // }, [builderId]);

  // const handleBuilderChange = (selectedOption) => {
  //   if (selectedOption) {
  //     setBuilderId(selectedOption.id);
  //     console.log(selectedOption.id);
  //   } else {
  //     setBuilderId("");
  //   }
  // };

  return ( 
      <LoadScript googleMapsApiKey="AIzaSyDY5Dsqd_6ZlAWwdohre3Fiz3K8hbRqcAE">
         <div style={{height: "40px"}}>
            <Button
               className="btn btn-primary btn-sm me-1"
               style={{marginTop: "5px", marginLeft: "5px"}}
               onClick={() => navigate('/subdivisionlist')}
            >
            <i className="fa fa-arrow-left" aria-hidden="true" style={{marginRight: "10px"}}></i>
            Go Back
            </Button>
         </div>
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
                <h4>{selectedMarker.builder.name}<br/>{selectedMarker.name}</h4>
                <hr style={{ borderWidth: "2px", borderStyle: "solid", borderColor: "black", marginTop: "0px" }} />

                <div>
                Status : <span>
                {selectedMarker.status === 1 && "Yes"}
                {selectedMarker.status === 0 && "No"}
                </span>
                </div>

                <div>
                Product Type : <span>
                     {selectedMarker.product_type}
                </span>
                </div>

                <div>
                Area : <span>
                     {selectedMarker.area}
                </span>
                </div>

               <div>
                Masterplan : <span>
                     {selectedMarker.masterplan_id == ''? 'NA' :selectedMarker.masterplan_id}
                </span>
               </div>

               <div>
                Open Since : <span>
                     {selectedMarker.opensince == ''? 'NA' :selectedMarker.opensince}
                </span>
               </div>

               <div>
                Total lots : <span>
                     {selectedMarker.zipcode == ''? 'NA' :selectedMarker.totallots}
                </span>
               </div>

               <div>
                  Unsold Lots : <span>{selectedMarker.unsold_lots} </span>
               </div>

               <div>
                  Total Net Sales : <span>
                     {selectedMarker.total_net_sales  == ''? 'NA' :selectedMarker.total_net_sales}
                  </span>
               </div>

               <div>
                  Avg Net Sales Per Month Since Open : <span>{selectedMarker.avg_net_sales_per_month_since_open || "NA"} </span>
               </div>

               <div style={{marginTop: "20px"}}>
                  Lot Width : <span>{selectedMarker.lotwidth || "NA"} </span>
               </div>

               <div>
                  Lot Size : <span>{selectedMarker.lotsize || "NA"} </span>
               </div>

               <div>
                  All Single Story : <span>
                     {selectedMarker.single === 1 && "Yes"}
                     {selectedMarker.single === 0 && "No"}
                  </span>
               </div>

               <div>
                  Gated : <span>
                     {selectedMarker.gated === 1 && "Yes"}
                     {selectedMarker.gated === 0 && "No"}
                  </span>
               </div> 

               <div>
                  Age Restricted : <span>
                     {selectedMarker.age === 1 && "Yes"}
                     {selectedMarker.age === 0 && "No"}
                  </span>
               </div>

               <div>
                Juridiction : <span>
                     {selectedMarker.juridiction == ''? 'NA' :selectedMarker.juridiction}
                </span>
             </div>

             <div>
                Zoning : <span>
                     {selectedMarker.zoning == ''? 'NA' :selectedMarker.zoning}
                </span>
             </div>

             <div>
                Gas Provider : <span>
                     {selectedMarker.gasprovider == ''? 'NA' :selectedMarker.gasprovider}
                </span>
             </div>

             <div style={{marginTop: "20px"}}>
             Total Permits : <span>
                     {selectedMarker.total_permits  == ''? 'NA' :selectedMarker.total_permits}
                </span>
             </div>

             <div>
             Total Closing : <span>
                     {selectedMarker.total_closings  == ''? 'NA' :selectedMarker.total_closings}
                </span>
             </div>

             <div>
             Latest Lots Released : <span>{selectedMarker.latest_lots_released} </span>
             </div>

             <div>
             Latest Standing Inventory : <span>{selectedMarker.latest_standing_inventory} </span>
             </div>

             <div>
             Avg Sqft All : <span>{selectedMarker.avg_sqft_all} </span>
             </div>

             <div>
                Avg Base Price All : <span>{<PriceComponent price={selectedMarker.avg_base_price_all} /> || "NA"} </span>
            </div>

            <div>
                Avg Closing Price : <span>{<PriceComponent price={selectedMarker.avg_closing_price} /> || "NA"} </span>
            </div>
            </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
  );
};

export default GoogleMapLocator;
