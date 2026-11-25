import { fromLonLat } from 'ol/proj';
import type { Coordinate } from 'ol/coordinate';
import type {
  DrawnAntenna,
  DrawnParcel,
  ParcelKind,
  ParcelKindMeta,
} from '@/features/gis-studio/types/gis.types';

export const DEFAULT_MAP_CENTER = fromLonLat([14.195, 40.928]);
export const DEFAULT_MAP_ZOOM = 14;

export const PARCEL_KINDS: Record<ParcelKind, ParcelKindMeta> = {
  uliveto: {
    id: 'uliveto',
    label: 'Uliveto',
    stroke: '#16A36E',
    fill: 'rgba(22, 163, 110, 0.22)',
  },
  vigneto: {
    id: 'vigneto',
    label: 'Vigneto',
    stroke: '#D97706',
    fill: 'rgba(217, 119, 6, 0.22)',
  },
  seminativo: {
    id: 'seminativo',
    label: 'Seminativo',
    stroke: '#0284C7',
    fill: 'rgba(2, 132, 199, 0.20)',
  },
  rischio: {
    id: 'rischio',
    label: 'Zona Rischio',
    stroke: '#DC2626',
    fill: 'rgba(220, 38, 38, 0.22)',
  },
};

export function createSampleRoute(): Coordinate[] {
  const start = fromLonLat([14.1835, 40.9245]);
  return [
    start,
    fromLonLat([14.1905, 40.9335]),
    fromLonLat([14.2015, 40.9325]),
    fromLonLat([14.2065, 40.924]),
    fromLonLat([14.1945, 40.9215]),
    start,
  ];
}

export function createSampleAntennas(): DrawnAntenna[] {
  return [
    {
      id: 'ant-1',
      label: 'ANT-01',
      center: fromLonLat([14.189, 40.929]),
      radiusUnits: 780,
    },
    {
      id: 'ant-2',
      label: 'ANT-02',
      center: fromLonLat([14.203, 40.927]),
      radiusUnits: 860,
    },
  ];
}

export function createSampleParcels(): DrawnParcel[] {
  return [
    {
      id: 'parc-1',
      label: 'P-104',
      kind: 'uliveto',
      ring: [
        fromLonLat([14.18, 40.934]),
        fromLonLat([14.188, 40.9355]),
        fromLonLat([14.19, 40.93]),
        fromLonLat([14.182, 40.9285]),
        fromLonLat([14.18, 40.934]),
      ],
    },
    {
      id: 'parc-2',
      label: 'P-209',
      kind: 'vigneto',
      ring: [
        fromLonLat([14.192, 40.9255]),
        fromLonLat([14.2005, 40.9265]),
        fromLonLat([14.202, 40.9205]),
        fromLonLat([14.193, 40.9195]),
        fromLonLat([14.192, 40.9255]),
      ],
    },
    {
      id: 'parc-3',
      label: 'Z-312',
      kind: 'rischio',
      ring: [
        fromLonLat([14.203, 40.935]),
        fromLonLat([14.211, 40.9335]),
        fromLonLat([14.2095, 40.9285]),
        fromLonLat([14.2035, 40.93]),
        fromLonLat([14.203, 40.935]),
      ],
    },
  ];
}
