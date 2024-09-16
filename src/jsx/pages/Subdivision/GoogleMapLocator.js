import React, { Fragment, useEffect, useRef, useState } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow, DrawingManager } from "@react-google-maps/api";
import PriceComponent from "../../components/Price/PriceComponent";
import Button from "react-bootstrap/Button";
import { useLocation, useNavigate } from 'react-router-dom';

const containerStyle = {
   width: "100%",
   height: "800px",
};

const haversineDistance = (lat1, lon1, lat2, lon2) => {
   const toRad = (value) => (value * Math.PI) / 180;

   const R = 6371;
   const dLat = toRad(lat2 - lat1);
   const dLon = toRad(lon2 - lon1);
   const lat1Rad = toRad(lat1);
   const lat2Rad = toRad(lat2);

   const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1Rad) * Math.cos(lat2Rad);
   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

   return R * c;
};

const calculateCentroid = (markers) => {
   const totalMarkers = markers.length;
   const sumCoords = markers.reduce((acc, marker) => {
      acc.lat += parseFloat(marker.lat);
      acc.lng += parseFloat(marker.lng);
      return acc;
   }, { lat: 0, lng: 0 });

   return {
      lat: sumCoords.lat / totalMarkers,
      lng: sumCoords.lng / totalMarkers,
   };
};

const findMaxDistance = (markers, centroid) => {
   let maxDistance = 0;

   markers.forEach((marker) => {
      const distance = haversineDistance(
         centroid.lat,
         centroid.lng,
         parseFloat(marker.lat),
         parseFloat(marker.lng)
      );
      if (distance > maxDistance) {
         maxDistance = distance;
      }
   });

   return maxDistance;
};

const GoogleMapLocator = () => {
   const navigate = useNavigate();
   const location = useLocation();
   const state = location.state || {};

   // const [builderList, setBuilderList] = useState([]);
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
   const [defaultCenter, setDefaultCenter] = useState({ lat: 0, lng: 0 });
   const [zoomLevel, setZoomLevel] = useState(8);

   const onLoad = (map) => {
      mapRef.current = map;
   };

   useEffect(() => {
      if (subdivisionList && subdivisionList.length > 0) {
         const centroid = calculateCentroid(subdivisionList);

         if(isNaN(centroid.lat) && isNaN(centroid.lng)) {
            setDefaultCenter({
               lat: 36.201946,
               lng: -115.120216,
            });
         } else {
            setDefaultCenter({
               lat: centroid.lat,
               lng: centroid.lng,
            });
         }

         const radiusInKm = findMaxDistance(subdivisionList, centroid).toFixed(0);

         console.log('Centroid:', centroid);
         console.log('Radius (in kilometers):', radiusInKm);

         if(!isNaN(centroid.lat) && !isNaN(centroid.lng)) {
            if (radiusInKm < 5) {
               setZoomLevel(14);
            } else if (radiusInKm < 10) {
               setZoomLevel(12);
            } else if (radiusInKm < 20) {
               setZoomLevel(11);
            } else if (radiusInKm < 30) {
               setZoomLevel(10);
            } else if (radiusInKm < 40) {
               setZoomLevel(9);
            } else {
               setZoomLevel(8);
            }
         } else {
            setZoomLevel(8);
         }
         
      }
   }, [subdivisionList]);

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
            <div style={{ height: "40px" }}>
               <Button
                  className="btn btn-primary btn-sm me-1"
                  style={{ marginTop: "5px", marginLeft: "5px" }}
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
                  <i className="fa fa-arrow-left" aria-hidden="true" style={{ marginRight: "10px" }}></i>
                  Go Back
               </Button>
               {drawing && <Button className="btn btn-primary btn-sm me-1" title="Undo" style={{ marginTop: "5px", marginLeft: "5px" }} onClick={handleUndo}><i class="fa fa-undo" aria-hidden="true"></i></Button>}
               {drawing && <Button className="btn btn-primary btn-sm me-1" title="Redo" style={{ marginTop: "5px", marginLeft: "5px" }} onClick={handleRedo}><i class="fa fa-redo" aria-hidden="true"></i></Button>}
            </div>
            <GoogleMap
               mapContainerStyle={containerStyle}
               center={selectedMarker ? { lat: parseFloat(selectedMarker.lat), lng: parseFloat(selectedMarker.lng) } : defaultCenter}
               zoom={zoomLevel}
               onLoad={onLoad}
               options={{
                  mapTypeId: "satellite",
               }}
            >

               {subdivisionList !== null && subdivisionList.length > 0 && (subdivisionList.map((record, index) => (
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
                        <h4>{selectedMarker.builder.name || 'NA'}<br />{selectedMarker.name || 'NA'}</h4>
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

                        <div style={{ marginTop: "20px" }}>
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
                              {selectedMarker.juridiction == '' ? 'NA' : selectedMarker.juridiction}
                           </span>
                        </div>

                        <div>
                           Zoning : <span>
                              {selectedMarker.zoning == '' ? 'NA' : selectedMarker.zoning}
                           </span>
                        </div>

                        <div>
                           Gas Provider : <span>
                              {selectedMarker.gasprovider == '' ? 'NA' : selectedMarker.gasprovider}
                           </span>
                        </div>

                        <div style={{ marginTop: "20px" }}>
                           Total Permits : <span>
                              {selectedMarker.total_permits || 'NA'}
                           </span>
                        </div>

                        <div>
                           Total Closing : <span>
                              {selectedMarker.total_closings || 'NA'}
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
