import { useMap } from "react-leaflet";
import { useEffect } from "react";
import { LatLngExpression, LatLngBoundsExpression } from "leaflet";

interface FitBoundsProps {
  coordinates: LatLngExpression[];
  padding?: [number, number];
}

const FitBounds = ({ coordinates, padding = [0, 0] }: FitBoundsProps) => {
  const map = useMap();

  useEffect(() => {
    if (!coordinates || coordinates.length === 0) return;

    let bounds: LatLngBoundsExpression;

    if (coordinates.length === 1) {
      const [lat, lng] = coordinates[0] as [number, number];
      bounds = [
        [lat - 0.0001, lng - 0.0001],
        [lat + 0.0001, lng + 0.0001],
      ];
    } else {
      bounds = coordinates as LatLngBoundsExpression;
    }

    map.fitBounds(bounds, { padding });
  }, [coordinates, map, padding]);

  return null;
};

export default FitBounds;