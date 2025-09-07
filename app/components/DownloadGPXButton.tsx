"use client"; // if using Next.js 13+ app directory

import React from "react";
//@ts-ignore
import togpx from "togpx";
import { FaDownload } from "react-icons/fa6";
import { Fredoka } from 'next/font/google';

const fredoka = Fredoka({ subsets: ['latin'] });

//@ts-ignore
const DownloadGpxButton = ({ polyline, filename = "track.gpx" }) => {
  const downloadGpx = () => {
    if (!polyline || polyline.length === 0) {
      alert("No coordinates to export!");
      return;
    }

    // Convert coordinates to GeoJSON (LineString)
    const geoJson = {
      type: "Feature",
      geometry: {
        type: "LineString",
        //@ts-ignore
        coordinates: polyline.map(([lat, lng]) => [lng, lat]), // GeoJSON expects [lon, lat]
      },
      properties: {},
    };

    // Convert GeoJSON to GPX
    const gpxString = togpx(geoJson, {
      creator: "MyAppName", // optional metadata
    });

    // Create a Blob and trigger download
    const blob = new Blob([gpxString], { type: "application/gpx+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={downloadGpx}
      className="custom-button"
      style={{
        fontFamily: fredoka.style.fontFamily,
        marginTop: 5,

      }}
    >
     <FaDownload style={{display: "inline"}}/> Download GPX
    </button>
  );
};

export default DownloadGpxButton;