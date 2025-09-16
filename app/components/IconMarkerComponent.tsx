import { icon } from 'leaflet';

export function createIconMarker(url: string = "/here.gif", size: number[] = [66, 99]) {
    return icon({
        iconUrl: url,
        // @ts-ignore
        iconSize: size,
        className: 'leaflet-icon',
    });
}