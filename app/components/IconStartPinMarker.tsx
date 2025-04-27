"use client";
import {icon} from 'leaflet';
import { use } from 'react';

const iconStartPinMarker = icon({
    iconUrl: "./map-pin.png",
    iconSize: [40, 40],
    className: 'leaflet-icon'
});

export { iconStartPinMarker };