import Feature from 'ol/Feature';
import { Circle, LineString, Polygon } from 'ol/geom';
import { fromCircle } from 'ol/geom/Polygon';
import GeoJSON from 'ol/format/GeoJSON';
import { getArea, getLength } from 'ol/sphere';
import { toLonLat } from 'ol/proj';
import type { Coordinate } from 'ol/coordinate';
import type { DrawnAntenna, DrawnParcel } from '@/features/gis-studio/types/gis.types';

export function getRouteLengthMeters(coords: Coordinate[]): number {
  if (coords.length < 2) return 0;
  return getLength(new LineString(coords));
}

export function getParcelAreaSqm(ring: Coordinate[]): number {
  if (ring.length < 4) return 0;
  return getArea(new Polygon([ring]));
}

export function getAntennaRadiusMeters(antenna: DrawnAntenna): number {
  const [, lat] = toLonLat(antenna.center);
  return Math.round(antenna.radiusUnits * Math.cos((lat * Math.PI) / 180));
}

export function formatDistance(meters: number): string {
  if (meters >= 1000) return `${(meters / 1000).toFixed(2)} km`;
  return `${Math.round(meters)} m`;
}

export function formatArea(sqm: number): string {
  if (sqm >= 10000) return `${(sqm / 10000).toFixed(2)} ha`;
  return `${Math.round(sqm)} m²`;
}

export function exportMissionGeoJSON(
  routeCoords: Coordinate[],
  antennas: DrawnAntenna[],
  parcels: DrawnParcel[]
): string {
  const features: Feature[] = [];

  if (routeCoords.length >= 2) {
    const routeFeature = new Feature({
      geometry: new LineString(routeCoords),
      type: 'drone_mission_route',
      length_meters: Math.round(getRouteLengthMeters(routeCoords)),
    });
    features.push(routeFeature);
  }

  antennas.forEach((ant) => {
    const circlePoly = fromCircle(new Circle(ant.center, ant.radiusUnits), 48);
    features.push(
      new Feature({
        geometry: circlePoly,
        type: 'antenna_coverage',
        label: ant.label,
        radius_meters: getAntennaRadiusMeters(ant),
      })
    );
  });

  parcels.forEach((parcel) => {
    features.push(
      new Feature({
        geometry: new Polygon([parcel.ring]),
        type: 'parcel',
        label: parcel.label,
        parcel_kind: parcel.kind,
        area_sqm: Math.round(getParcelAreaSqm(parcel.ring)),
      })
    );
  });

  const format = new GeoJSON();
  return format.writeFeatures(features, {
    featureProjection: 'EPSG:3857',
    dataProjection: 'EPSG:4326',
  });
}
