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
//npm install --save leaflet react-leaflet
const MapComponent = () => {
    const [zoomInitial, setZoomInitial] = useState(5);

    const polyline = [
      [43.247654, -1.524588],
      [43.239563, -1.607093],
      [43.26903, -1.648346],
    ];
    const purpleOptions = { color: "red", weight: 5 };
  

    
    return (
      <>
      <button >HI</button>
        <MapContainer
          //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
          className="full-height-map"
          center={[43.247654, -1.524588]}
          zoom={zoomInitial}
          zoomControl={false}
          minZoom={3}
          maxZoom={23}
          maxBounds={[
            [-85.06, -180],
            [85.06, 180],
          ]}
          scrollWheelZoom={false}
         
        >
          <ZoomControl position="topleft" zoomInText="🧐" zoomOutText="🗺️" />
  
          <TileLayer
            attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
            // attribution='Imagery provided by services from the Global Imagery Browse Services (GIBS), operated by the NASA/GSFC/Earth Science Data and Information System (<a href="https://earthdata.nasa.gov">ESDIS</a>) with funding provided by NASA/HQ.'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          //url='https://map1.vis.earthdata.nasa.gov/wmts-webmerc/VIIRS_CityLights_2012/default//GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpg'
          />
          <Polyline
            pathOptions={purpleOptions}
            positions={[
              [43.247654, -1.524588],
              [43.239563, -1.607093],
              [43.26903, -1.648346],
            ]}
          />
          <Marker icon={iconPerson} position={[43.26903, -1.648346]}>
            <Popup>We are here now</Popup>
          </Marker>
          <div className="test">Helloooo</div>
          <ScaleControl position="bottomleft" imperial={false}/>
        </MapContainer>
      </>
    );  
}

export default MapComponent