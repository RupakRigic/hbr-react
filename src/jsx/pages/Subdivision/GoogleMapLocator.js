import React, { Fragment, useEffect, useRef, useState } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow, DrawingManager } from "@react-google-maps/api";
import PriceComponent from "../../components/Price/PriceComponent";
import Button from "react-bootstrap/Button";
import { useLocation, useNavigate } from 'react-router-dom';
import '../../pages/Subdivision/subdivisionList.css';

const containerStyle = {
   width: "100%",
   height: "800px",
};

const haversineDistance = (lat1, lon1, lat2, lon2) => {
   const R = 6371; // Radius of the Earth in kilometers
   const dLat = (lat2 - lat1) * Math.PI / 180;
   const dLon = (lon2 - lon1) * Math.PI / 180;
   const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
   return R * c; // Distance in kilometers
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
   const [centerPoint, setCenterPoint] = useState({ lat: 0, lng: 0 });
   const [circleRadius, setCircleRadius] = useState(null);
   const [circleArea, setCircleArea] = useState(null);
   const [measurementPoints, setMeasurementPoints] = useState([]);
   const [showMeasurementPopup, setShowMeasurementPopup] = useState(false);
   const [showMeasurementPopupCircle, setShowMeasurementPopupCircle] = useState(false);
   const [showMeasurementPopupPolygon, setShowMeasurementPopupPolygon] = useState(false);
   const [showMeasurementPopupRectangle, setShowMeasurementPopupRectangle] = useState(false);
   const [drawingShape, setDrawingShape] = useState(null);
   const [polygonPerimeter, setPolygonPerimeter] = useState('');
   const [rectangleBounds, setRectangleBounds] = useState({ lat: 0, lng: 0 });
   const [rectangleMeasurements, setRectangleMeasurements] = useState({
      width: 0,
      height: 0,
      area: 0,
   });
   const [distance, setDistance] = useState("Feet");
   const [currentCircle, setCurrentCircle] = useState(null);
   const [currentPolyline, setCurrentPolyline] = useState(null);
   const [currentPolygon, setCurrentPolygon] = useState(null);
   const [currentRectangle, setCurrentRectangle] = useState(null);

   const onLoad = (map) => {
      mapRef.current = map;
   };

   useEffect(() => {
      if (subdivisionList && subdivisionList.length > 0) {
         const centroid = calculateCentroid(subdivisionList);

         if (isNaN(centroid.lat) && isNaN(centroid.lng)) {
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

         if (!isNaN(centroid.lat) && !isNaN(centroid.lng)) {
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

      if (shape instanceof window.google.maps.Circle) {
         if (currentCircle) {
            currentCircle.setMap(null);
         }

         setCurrentCircle(shape);
         setShapes((prevShapes) => [
            ...prevShapes.filter(s => !(s instanceof window.google.maps.Circle)),
            shape
         ]);
         setRedoStack([]);
         setDrawingShape(shape);
         updateCircleMeasurements(shape);
         setShowMeasurementPopupCircle(true);
         setMeasurementPoints([]);

         shape.addListener('radius_changed', () => updateCircleMeasurements(shape));
         shape.addListener('center_changed', () => updateCircleMeasurements(shape));
      }

      if (shape instanceof window.google.maps.Polyline) {
         if (currentPolyline) {
            currentPolyline.setMap(null);
         }

         setCurrentPolyline(shape);
         setShapes((prevShapes) => [
            ...prevShapes.filter(s => !(s instanceof window.google.maps.Polyline)),
            shape
         ]);
         setRedoStack([]);
         setDrawingShape(shape);
         setShowMeasurementPopup(true);
         const path = shape.getPath().getArray().map((latLng) => ({
            lat: latLng.lat(),
            lng: latLng.lng(),
         }));
         setMeasurementPoints(path);

         shape.getPath().addListener('set_at', () => updatePolylineInfo(shape));
         shape.getPath().addListener('insert_at', () => updatePolylineInfo(shape));
      }

      if (shape instanceof window.google.maps.Polygon) {
         if (currentPolygon) {
            currentPolygon.setMap(null);
         }

         setCurrentPolygon(shape);
         setShapes((prevShapes) => [
            ...prevShapes.filter(s => !(s instanceof window.google.maps.Polygon)),
            shape
         ]);
         setRedoStack([]);
         const firstVertex = shape.getPath().getAt(0);
         setDrawingShape(firstVertex);
         setShowMeasurementPopupPolygon(true);
         updatePolygonInfo(shape);

         shape.getPath().addListener('set_at', () => updatePolygonInfo(shape));
         shape.getPath().addListener('insert_at', () => updatePolygonInfo(shape));
      }

      if (shape instanceof window.google.maps.Rectangle) {
         if (currentRectangle) {
            currentRectangle.setMap(null);
         }

         setCurrentRectangle(shape);
         setShapes((prevShapes) => [
            ...prevShapes.filter(s => !(s instanceof window.google.maps.Rectangle)),
            shape
         ]);
         setRedoStack([]);
         setShowMeasurementPopupRectangle(true);
         updateRectangleMeasurements(shape);

         shape.addListener('bounds_changed', () => updateRectangleMeasurements(shape));
      }
   };

   const updateCircleMeasurements = (circle) => {
      const center = circle.getCenter();
      const radiusInMeters = circle.getRadius();
      const radiusInFeet = radiusInMeters * 3.28084;
      const areaInSquareFeet = Math.PI * Math.pow(radiusInFeet, 2);
      const areaInAcres = areaInSquareFeet / 43560;
      const radiusInDegrees = radiusInMeters / 111139;
      const upperPointLat = center.lat() + radiusInDegrees;
      const upperPointLng = center.lng();
      setCenterPoint({ lat: upperPointLat, lng: upperPointLng });
      setCircleRadius(radiusInFeet.toFixed(3));
      setCircleArea(areaInAcres.toFixed(3));
      setShowMeasurementPopupCircle(true);
   };

   const handleCloseInfoWindowCircle = () => {
      setShowMeasurementPopupCircle(false);
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

   const updatePolylineInfo = (polyline) => {
      const path = polyline.getPath().getArray().map((latLng) => ({
         lat: latLng.lat(),
         lng: latLng.lng(),
      }));
      setMeasurementPoints(path);
   };

   const handleCloseInfoWindowPolyLine = () => {
      setShowMeasurementPopup(false);
      setShapes((prevShapes) => {
         const newShapes = [...prevShapes];
         const shapeToRemove = newShapes.pop();
         if (shapeToRemove) {
            shapeToRemove.setMap(null);
            setRedoStack((prevRedoStack) => [shapeToRemove, ...prevRedoStack]);
         }
         return newShapes;
      });
   }

   const updatePolygonInfo = (polygon) => {
      const path = polygon.getPath();
      let distance = 0;

      for (let i = 0; i < path.getLength() - 1; i++) {
         distance += window.google.maps.geometry.spherical.computeDistanceBetween(
            path.getAt(i),
            path.getAt(i + 1)
         );
      }

      const distanceInFeet = distance * 3.28084;
      setPolygonPerimeter(distanceInFeet.toFixed(3));
   };

   const handleCloseInfoWindowPolygon = () => {
      setShowMeasurementPopupPolygon(false);
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

   const updateRectangleMeasurements = (rectangle) => {
      const bounds = rectangle.getBounds();

      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();
      const width = window.google.maps.geometry.spherical.computeDistanceBetween(
         new window.google.maps.LatLng(ne.lat(), sw.lng()),
         new window.google.maps.LatLng(ne.lat(), ne.lng())
      );
      const height = window.google.maps.geometry.spherical.computeDistanceBetween(
         new window.google.maps.LatLng(ne.lat(), sw.lng()),
         new window.google.maps.LatLng(sw.lat(), sw.lng())
      );
      const area = width * height;

      setRectangleMeasurements({
         width: (width * 3.28084).toFixed(2), // convert to feet
         height: (height * 3.28084).toFixed(2), // convert to feet
         area: (area * 10.7639).toFixed(2), // convert to square feet
      });

      const centerLat = (ne.lat() + sw.lat()) / 2;
      const centerLng = (ne.lng() + sw.lng()) / 2;
      const halfHeightInDegrees = (height / 2) / 111139;

      const upperSidePoint = {
         lat: centerLat + halfHeightInDegrees,
         lng: centerLng,
      };
      setRectangleBounds(upperSidePoint);
   };

   const handleCloseInfoWindowRectangle = () => {
      setShowMeasurementPopupRectangle(false);
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

   const handleUndo = () => {
      setShapes((prevShapes) => {
         const newShapes = [...prevShapes];
         const shapeToRemove = newShapes.pop();
         if (shapeToRemove) {
            shapeToRemove.setMap(null);
            setRedoStack((prevRedoStack) => [shapeToRemove, ...prevRedoStack]);

            if (shapeToRemove instanceof window.google.maps.Circle) {
               setShowMeasurementPopupCircle(false);
            } else if (shapeToRemove instanceof window.google.maps.Polygon) {
               setShowMeasurementPopupPolygon(false);
            } else if (shapeToRemove instanceof window.google.maps.Polyline) {
               const path = shapeToRemove.getPath().getArray().map((latLng) => ({
                  lat: latLng.lat(),
                  lng: latLng.lng(),
               }));
               setMeasurementPoints(path);
               setShowMeasurementPopup(false);
            } else if (shapeToRemove instanceof window.google.maps.Rectangle) {
               setShowMeasurementPopupRectangle(false);
            }
         }
         return newShapes;
      });
      setMeasurementPoints([]);
   };

   const handleRedo = () => {
      setRedoStack((prevRedoStack) => {
         const newRedoStack = [...prevRedoStack];
         const shapeToRedo = newRedoStack.shift();
         if (shapeToRedo && mapRef.current) {
            shapeToRedo.setMap(mapRef.current);
            setShapes((prevShapes) => [...prevShapes, shapeToRedo]);

            if (shapeToRedo instanceof window.google.maps.Circle) {
               setShowMeasurementPopupCircle(true);
            } else if (shapeToRedo instanceof window.google.maps.Polygon) {
               setShowMeasurementPopupPolygon(true);
            } else if (shapeToRedo instanceof window.google.maps.Polyline) {
               const path = shapeToRedo.getPath().getArray().map((latLng) => ({
                  lat: latLng.lat(),
                  lng: latLng.lng(),
               }));
               setMeasurementPoints(path);
               setShowMeasurementPopup(true);
            } else if (shapeToRedo instanceof window.google.maps.Rectangle) {
               setShowMeasurementPopupRectangle(true);
            }
         }
         return newRedoStack;
      });
   };

   const calculateTotalDistance = () => {
      let distance = 0;
      for (let i = 0; i < measurementPoints.length - 1; i++) {
         const point1 = measurementPoints[i];
         const point2 = measurementPoints[i + 1];
         distance += window.google.maps.geometry.spherical.computeDistanceBetween(
            new window.google.maps.LatLng(point1.lat, point1.lng),
            new window.google.maps.LatLng(point2.lat, point2.lng)
         );
      }
      return distance;
   };

   const calculateTotalDistanceInFeet = () => {
      const totalDistanceInKm = calculateTotalDistanceInKilometers();
      return totalDistanceInKm * 3280.84;
   };

   const calculateTotalDistanceInKilometers = () => {
      return calculateTotalDistance() / 1000;
   };

   const handleDistance = (e) => {
      setDistance(e.target.value);
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

               {showMeasurementPopup && measurementPoints.length > 1 && (
                  <InfoWindow
                     position={{
                        lat:
                           (measurementPoints[0].lat +
                              measurementPoints[measurementPoints.length - 1].lat) /
                           2,
                        lng:
                           (measurementPoints[0].lng +
                              measurementPoints[measurementPoints.length - 1].lng) /
                           2,
                     }}
                     onCloseClick={handleCloseInfoWindowPolyLine}
                  >
                     <div style={{ width: "230px" }}>
                        <h4 style={{ position: "relative", zIndex: "1", paddingTop: "15px" }}>PolyLine Measurements</h4>
                        <hr></hr>
                        <select onChange={handleDistance} value={distance} style={{ border: "1px solid #db7e2e" }}>
                           <option value="">Select Distance</option>
                           <option value="Meter">Meter</option>
                           <option value="Feet">Feet</option>
                           <option value="Kilometer">Kilometer</option>
                        </select>
                        <div style={{ marginTop: "10px" }}></div>
                        {distance === "Meter" && (
                           <h6 style={{ color: "black" }}>
                              Total Distance: {calculateTotalDistance().toFixed(2)} m
                           </h6>
                        )}
                        {distance === "Feet" && (
                           <h6 style={{ color: "black" }}>
                              Total Distance: {calculateTotalDistanceInFeet().toFixed(2)} ft
                           </h6>
                        )}
                        {distance === "Kilometer" && (
                           <h6 style={{ color: "black" }}>
                              Total Distance: {calculateTotalDistanceInKilometers().toFixed(2)} km
                           </h6>
                        )}
                     </div>
                  </InfoWindow>
               )}

               {showMeasurementPopupCircle && (
                  <InfoWindow
                     position={centerPoint}
                     onCloseClick={handleCloseInfoWindowCircle}
                  >
                     <div style={{ width: "230px" }}>
                        <h4 style={{ position: "relative", zIndex: "1", paddingTop: "15px" }}>Circle Measurements</h4>
                        <hr></hr>
                        <h6 style={{ color: "black" }}>Circle Radius: {circleRadius} ft</h6>
                        <h6 style={{ color: "black" }}>Circle Area: {circleArea} acres</h6>
                     </div>
                  </InfoWindow>
               )}

               {showMeasurementPopupPolygon && (
                  <InfoWindow
                     position={drawingShape}
                     onCloseClick={handleCloseInfoWindowPolygon}
                  >
                     <div style={{ width: "230px" }}>
                        <h4 style={{ position: "relative", zIndex: "1", paddingTop: "15px" }}>Polygon Measurements</h4>
                        <hr></hr>
                        <h6 style={{ color: "black" }}>Perimeter: {polygonPerimeter} ft</h6>
                     </div>
                  </InfoWindow>
               )}

               {showMeasurementPopupRectangle && (
                  <InfoWindow
                     position={rectangleBounds}
                     onCloseClick={handleCloseInfoWindowRectangle}
                  >
                     <div style={{ width: "230px" }}>
                        <h4 style={{ position: "relative", zIndex: "1", paddingTop: "15px" }}>Rectangle Measurements</h4>
                        <hr />
                        <h6 style={{ color: "black" }}>
                           Width: {rectangleMeasurements.width} ft
                        </h6>
                        <h6 style={{ color: "black" }}>
                           Height: {rectangleMeasurements.height} ft
                        </h6>
                        <h6 style={{ color: "black" }}>
                           Area: {rectangleMeasurements.area} sq ft
                        </h6>
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
