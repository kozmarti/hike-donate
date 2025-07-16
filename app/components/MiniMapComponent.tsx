import React from 'react'
import "leaflet/dist/leaflet.css";
import "react-leaflet-fullscreen/styles.css";

import { useState, useRef, useEffect } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  ScaleControl,
  TileLayer,
  ZoomControl,
  useMap,
  useMapEvent
} from "react-leaflet";
import Image from "next/image";
import { LatLngExpression } from "leaflet";

interface Props {
    id: string;
    coordinates?: LatLngExpression[];

}

const MiniMapComponent = ({ id, coordinates }: Props) => {
    const polyline: LatLngExpression[] = coordinates ?? [[42.848023, -0.490336]];
    const mapCenter: LatLngExpression = coordinates ? coordinates[0] : [42.848023, -0.490336] as LatLngExpression;

  return (
    <>
         <div className="map-wrapper" id="map-wrapper">
           <MapContainer
             className="full-height-map"
             id={id}
             center={mapCenter}
             zoom={12}
             zoomControl={false}
             minZoom={1}
             maxZoom={18}
             maxBounds={[
               [-85.06, -180],
               [85.06, 180],
             ]}
             scrollWheelZoom={false}   
   
           >
                      <ZoomControl position="topright" zoomInText="+" zoomOutText="-" />

             <TileLayer
               //attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
               // attribution='Imagery provided by services from the Global Imagery Browse Services (GIBS), operated by the NASA/GSFC/Earth Science Data and Information System (<a href="https://earthdata.nasa.gov">ESDIS</a>) with funding provided by NASA/HQ.'
               url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
             //url='https://map1.vis.earthdata.nasa.gov/wmts-webmerc/VIIRS_CityLights_2012/default//GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpg'
             />
             <Polyline
               pathOptions={{ color: "#EC506A", weight: 3 }}
               positions={polyline}
             />
   
             <ScaleControl position="bottomleft" />
           </MapContainer>
   
         </div>
       </>
  )
}

export default MiniMapComponent;