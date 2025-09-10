"use client";
import React from 'react';
import "leaflet/dist/leaflet.css";
import "react-leaflet-fullscreen/styles.css";

import {
  LayersControl,
  MapContainer,
  Polyline,
  ScaleControl,
  TileLayer,
  ZoomControl,
} from "react-leaflet";
import { LatLngExpression } from "leaflet";
import DownloadGpxButton from './DownloadGPXButton';

interface Props {
    id: string;
    coordinates?: LatLngExpression[];

}
const { BaseLayer } = LayersControl;

const MiniMapComponent = ({ id, coordinates }: Props) => {
    const polyline: LatLngExpression[] = coordinates ?? [[42.848023, -0.490336]];
    const mapCenter: LatLngExpression = coordinates ? coordinates[Math.floor(coordinates.length / 2)] : [42.848023, -0.490336] as LatLngExpression;

  return (
    <>
         <div>
           <MapContainer
             className="full-height-map minimap"
             id={id}
             center={mapCenter}
             zoom={10}
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
             <LayersControl position="topright">
                   {/* Esri Satellite */}
                   <BaseLayer checked name="Esri World Imagery">
                   <TileLayer
                     url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                     // attribution="Tiles &copy; Esri &mdash; Source: Esri, USGS"
                   />
                 </BaseLayer>
                 {/* OpenStreetMap Default */}
                 <BaseLayer name="OpenStreetMap">
                   <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
                 </BaseLayer>
             
                 {/* OpenTopoMap */}
                 <BaseLayer name="OpenTopoMap">
                   <TileLayer url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png" attribution="&copy; OpenTopoMap" />
                 </BaseLayer>
             
             
               </LayersControl>
             <Polyline
               pathOptions={{ color: "#EC506A", weight: 3 }}
               positions={polyline}
             />
   
             <ScaleControl position="bottomleft" imperial={false} />
           </MapContainer>

   
         </div>
       </>
  )
}

export default MiniMapComponent;