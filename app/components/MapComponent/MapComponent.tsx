"use client";
import "leaflet/dist/leaflet.css";
import "react-leaflet-fullscreen/styles.css";

import { useState, useRef, useEffect } from "react";
import {
  LayersControl,
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
import { createIconMarker } from "../IconMarkerComponent";
import DownloadGpxButton from "../DownloadGPXButton";


interface Props {
  coordinates?: LatLngExpression[];
  currentLocation?: LatLngExpression;
  centerCoordinates?: LatLngExpression;
  clickedLocationAbled?: boolean;
  onMapClick?: (latlng: LatLngExpression) => void;
  clickedLocation?: LatLngExpression | null;
  pinIconUrl?: string;
  startIconPinSize?: number[];
}
const { BaseLayer } = LayersControl;


const ResizeMap = () => {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 10);
  }, []);

  return null;
};
const ClickHandler = ({ onClick }: { onClick: (latlng: LatLngExpression) => void }) => {
  useMapEvent("click", (e) => {
    console.log("Clicked LatLng:", [e.latlng.lat, e.latlng.lng]);
    onClick([e.latlng.lat, e.latlng.lng]);
  });
  return null;
};

const MapComponent = ({ coordinates, currentLocation, centerCoordinates, clickedLocationAbled = false, onMapClick, pinIconUrl, clickedLocation, startIconPinSize }: Props) => {
  const zoomInitial = 5;
  const startIconPin = createIconMarker(pinIconUrl, startIconPinSize);
  const iconFinishPin = createIconMarker("./finish-point.png", [40, 40]);
  const polyline: LatLngExpression[] = coordinates ?? [[42.848023, -0.490336]];
  const centerCoords: LatLngExpression = centerCoordinates ?? coordinates?.slice(-1)[0] as [number, number] ?? [42.848023, -0.490336];

  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapRef = useRef<any>(null)

  const fakeFullscreen = () => {
    const el = document.getElementById("map-wrapper");
    el?.classList.toggle("fullscreen-sim");
    const map = document.getElementById("map");
    map?.classList.toggle("fullscreen-sim");
    setIsFullscreen((prev) => !prev);

    setTimeout(() => {
      mapRef.current?.invalidateSize();
      mapRef.current?.flyTo(centerCoordinates, zoomInitial, {
        duration: 2.0
      });
    }, 10);
  };

  return (
    <>
      <div className="map-wrapper" id="map-wrapper">
        <MapContainer
          className="full-height-map"
          id="map"
          center={centerCoords}
          zoom={zoomInitial}
          zoomControl={false}
          minZoom={1}
          maxZoom={18}
          maxBounds={[
            [-85.06, -180],
            [85.06, 180],
          ]}
          scrollWheelZoom={false}
          ref={mapRef}


        >
          {isFullscreen && <ResizeMap />}
          <ZoomControl position="topright" zoomInText="+" zoomOutText="-" />
          {/*<FullscreenControl position="topright" forcePseudoFullscreen={false} />*/}


          <TileLayer
            //attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
            // attribution='Imagery provided by services from the Global Imagery Browse Services (GIBS), operated by the NASA/GSFC/Earth Science Data and Information System (<a href="https://earthdata.nasa.gov">ESDIS</a>) with funding provided by NASA/HQ.'
            //url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          url='https://tile.openstreetmap.org/{z}/{x}/{y}.png'
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
          {currentLocation && (
            <Marker icon={startIconPin} position={currentLocation}>
            </Marker>
          )}
          <div onClick={fakeFullscreen} className="fullscreen-button">
            <Image
              src={isFullscreen ? "/full-screen-exit.png" : "/full-screen.png"}
              width={50}
              height={50}
              alt={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            /></div>

          <ScaleControl position="bottomleft" imperial={false} />
          {clickedLocationAbled && (
            <ClickHandler onClick={(latlng) => {
              onMapClick?.(latlng); // 👈 Call parent’s callback
            }} />
          )}

          {clickedLocation && (
            <Marker icon={iconFinishPin} position={clickedLocation}>
            </Marker>
          )}
        </MapContainer>

      </div>
      <DownloadGpxButton polyline={polyline} filename="hike-donate-track.gpx" />

    </>
  );
}

export default MapComponent