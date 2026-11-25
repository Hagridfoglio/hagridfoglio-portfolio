import type { Coordinate } from 'ol/coordinate';

export type DrawMode = 'pan' | 'draw-route' | 'draw-antenna' | 'draw-parcel' | 'modify';

export type ParcelKind = 'uliveto' | 'vigneto' | 'seminativo' | 'rischio';

export interface ParcelKindMeta {
  id: ParcelKind;
  label: string;
  stroke: string;
  fill: string;
}

export interface DrawnParcel {
  id: string;
  label: string;
  kind: ParcelKind;
  /** Exterior ring in EPSG:3857 coordinates */
  ring: Coordinate[];
}

export interface DrawnAntenna {
  id: string;
  label: string;
  /** Center in EPSG:3857 */
  center: Coordinate;
  /** Radius in map projection units (EPSG:3857) */
  radiusUnits: number;
}

export interface LayerVisibility {
  parcels: boolean;
  antennas: boolean;
  route: boolean;
  graticule: boolean;
}

export interface DroneTelemetry {
  coord: Coordinate;
  lon: number;
  lat: number;
  rotation: number;
  activeAntenna: string | null;
  activeParcel: { label: string; kindLabel: string } | null;
}
