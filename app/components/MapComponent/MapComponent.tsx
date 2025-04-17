"use client"; 
import { useState } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  ScaleControl,
  TileLayer,
  ZoomControl,
} from "react-leaflet";
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
import "leaflet/dist/leaflet.css";
import { iconPerson } from "../IconMarker";
import { LatLngExpression } from "leaflet";
//npm install --save leaflet react-leaflet
interface CoordinateData {
  coordinates: LatLngExpression[];
  currentLocation: LatLngExpression;
  centerCoordinates: LatLngExpression;
}
const MapComponent = ({coordinates, currentLocation, centerCoordinates}: CoordinateData) => {
    const [zoomInitial, setZoomInitial] = useState(8);

    const polyline:LatLngExpression[] = coordinates;
    const purpleOptions = { color: "#EC506A", weight: 3 };
  

    
    return (
      <>
      <div className="map-wrapper">
        <MapContainer
          //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
          className="full-height-map"
          center={centerCoordinates}
          zoom={zoomInitial}
          zoomControl={false}
          minZoom={1}
          maxZoom={18}
          maxBounds={[
            [-85.06, -180],
            [85.06, 180],
          ]}
          scrollWheelZoom={false}
         
        >
          <ZoomControl position="topleft"/>
  
          <TileLayer
            //attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
            // attribution='Imagery provided by services from the Global Imagery Browse Services (GIBS), operated by the NASA/GSFC/Earth Science Data and Information System (<a href="https://earthdata.nasa.gov">ESDIS</a>) with funding provided by NASA/HQ.'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          //url='https://map1.vis.earthdata.nasa.gov/wmts-webmerc/VIIRS_CityLights_2012/default//GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpg'
          />
          <Polyline
            pathOptions={purpleOptions}
            positions={polyline}
          />
          <Marker icon={iconPerson} position={currentLocation}>
            <Popup>I am here now</Popup>
          </Marker>
          <div className="label-on-map">Helloooo</div>
          <ScaleControl position="bottomleft" imperial={false}/>
        </MapContainer>

        </div>
      </>
    );  
}

export default MapComponent