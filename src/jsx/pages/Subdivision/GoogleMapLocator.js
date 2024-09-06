import React, { Fragment, useRef, useState } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow, DrawingManager  } from "@react-google-maps/api";
import PriceComponent from "../../components/Price/PriceComponent";
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
  const state = location.state || {};

  const [builderList, setBuilderList] = useState([]);
  const subdivisionList = state.subdivisionList;
  const subdivision = state.subdivision;
  const product = state.product;
  const closings = state.closings;
  const permits = state.permits;
  const landsales = state.landsales;

  const [selectedMarker, setSelectedMarker] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const [shapes, setShapes] = useState([]);
  console.log(shapes);
  const [redoStack, setRedoStack] = useState([]);
  console.log(redoStack);
  const mapRef = useRef(null);

  const onLoad = (map) => {
   mapRef.current = map;
 };

  const handleShapeComplete = (shape) => {
   setDrawing(true);
   setShapes((prevShapes) => [...prevShapes, shape]);
   setRedoStack([]);
 };

 const handleUndo = () => {
   setShapes((prevShapes) => {
     const newShapes = [...prevShapes];
     const shapeToRemove = newShapes.pop();
     if (shapeToRemove) {
       shapeToRemove.setMap(null);
       setRedoStack((prevRedoStack) => [shapeToRemove, ...prevRedoStack]);
     }
     return newShapes;
   });
 };

 const handleRedo = () => {
   setRedoStack((prevRedoStack) => {
     const newRedoStack = [...prevRedoStack];
     const shapeToRedo = newRedoStack.shift();
     if (shapeToRedo && mapRef.current) {
       shapeToRedo.setMap(mapRef.current);
       setShapes((prevShapes) => [...prevShapes, shapeToRedo]);
     }
     return newRedoStack;
   });
 };

  return ( 
   <Fragment>
      <LoadScript googleMapsApiKey="AIzaSyDY5Dsqd_6ZlAWwdohre3Fiz3K8hbRqcAE" libraries={['drawing']}>
         <div style={{height: "40px"}}>
            <Button
               className="btn btn-primary btn-sm me-1"
               style={{marginTop: "5px", marginLeft: "5px"}}
               onClick={() => {
                  if (subdivision) {
                     navigate('/subdivisionlist');
                  } else if (product) {
                     navigate('/productlist');
                  } else if (closings) {
                     navigate('/closingsalelist');
                  } else if (permits) {
                     navigate('/permitlist');
                  } else if (landsales) {
                     navigate('/landsalelist');
                  }
               }}
            >
            <i className="fa fa-arrow-left" aria-hidden="true" style={{marginRight: "10px"}}></i>
               Go Back
            </Button>
            {drawing && <Button className="btn btn-primary btn-sm me-1" title="Undo" style={{marginTop: "5px", marginLeft: "5px"}} onClick={handleUndo}><i class="fa fa-undo" aria-hidden="true"></i></Button>}
            {drawing && <Button className="btn btn-primary btn-sm me-1" title="Redo" style={{marginTop: "5px", marginLeft: "5px"}} onClick={handleRedo}><i class="fa fa-redo" aria-hidden="true"></i></Button>}
         </div>
         <GoogleMap mapContainerStyle={containerStyle} zoom={8} onLoad={onLoad} center={defaultCenter}
            options={{
               mapTypeId: "satellite",
            }}
         >
         
         {subdivisionList !== null && subdivisionList.length > 0 && ( subdivisionList.map((record, index) => (
            <Marker
               key={index}
               position={{ lat: parseFloat(record.lat), lng: parseFloat(record.lng) }}
               onClick={() => setSelectedMarker(record)}
            />
         )))}

         {selectedMarker && (
            <InfoWindow
              position={{ lat: parseFloat(selectedMarker.lat), lng: parseFloat(selectedMarker.lng) }}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div>
                <h4>{selectedMarker.builder.name || 'NA'}<br/>{selectedMarker.name || 'NA'}</h4>
                <hr style={{ borderWidth: "2px", borderStyle: "solid", borderColor: "black", marginTop: "0px" }} />

                <div>
                  Status : <span>
                     {selectedMarker.status === 1 && "Active"}
                     {selectedMarker.status === 0 && "Sold Out"}
                     {selectedMarker.status === 2 && "Future"}
                </span>
                </div>

                <div>
                  Product Type : <span>
                     {selectedMarker.product_type || 'NA'}
                </span>
                </div>

                <div>
                  Area : <span>
                     {selectedMarker.area || 'NA'}
                </span>
                </div>

               <div>
                  Masterplan : <span>
                     {selectedMarker.masterplan_id || 'NA'}
                </span>
               </div>

               <div>
                  Open Since : <span>
                     {selectedMarker.opensince || 'NA'}
                </span>
               </div>

               <div>
                  Total lots : <span>
                     {selectedMarker.totallots || 'NA'}
                </span>
               </div>

               <div>
                  Unsold Lots : <span>{selectedMarker.unsold_lots || 'NA'} </span>
               </div>

               <div>
                  Total Net Sales : <span>
                     {selectedMarker.total_net_sales || 'NA'}
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
                     {selectedMarker.total_permits  || 'NA'}
                </span>
             </div>

             <div>
               Total Closing : <span>
                     {selectedMarker.total_closings  || 'NA'}
                </span>
             </div>

             <div>
               Latest Lots Released : <span>{selectedMarker.latest_lots_released || 'NA'} </span>
             </div>

             <div>
               Latest Standing Inventory : <span>{selectedMarker.latest_standing_inventory || 'NA'} </span>
             </div>

             <div>
               Avg Sqft All : <span>{selectedMarker.avg_sqft_all || 'NA'} </span>
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

         <DrawingManager
            onCircleComplete={handleShapeComplete}
            onPolygonComplete={handleShapeComplete}
            onPolylineComplete={handleShapeComplete}
            onRectangleComplete={handleShapeComplete}
            options={{
               drawingControl: true,
               drawingControlOptions: {
                  position: 2,
                  drawingModes: ['circle', 'polygon', 'polyline', 'rectangle'],
               },
               circleOptions: {
                  fillColor: '#000000',
                  fillOpacity: 0.2,
                  strokeWeight: 4,
                  clickable: false,
                  editable: true,
                  zIndex: 1,
               },
            }}
         />
        </GoogleMap>
      </LoadScript>
   </Fragment>
  );
};

export default GoogleMapLocator;
