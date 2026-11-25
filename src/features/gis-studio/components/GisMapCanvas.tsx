import { useMemo, useRef } from 'react';
import { Circle, LineString, Point, Polygon } from 'ol/geom';
import type { Coordinate } from 'ol/coordinate';
import type { DrawEvent } from 'ol/interaction/Draw';
import type { ModifyEvent } from 'ol/interaction/Modify';
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style';
import type { FeatureLike } from 'ol/Feature';
import {
  RFeature,
  RInteraction,
  RLayerGraticule,
  RLayerVector,
  RMap,
  ROSM,
  RStyle,
} from 'rlayers';
import 'ol/ol.css';
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM, PARCEL_KINDS } from '@/features/gis-studio/data/gis.presets';
import type {
  DrawnAntenna,
  DrawnParcel,
  DrawMode,
  DroneTelemetry,
  LayerVisibility,
} from '@/features/gis-studio/types/gis.types';

interface GisMapCanvasProps {
  mode: DrawMode;
  layers: LayerVisibility;
  routeCoords: Coordinate[];
  antennas: DrawnAntenna[];
  parcels: DrawnParcel[];
  drone: DroneTelemetry | null;
  onRouteDrawn: (coords: Coordinate[]) => void;
  onAntennaDrawn: (center: Coordinate, radiusUnits: number) => void;
  onParcelDrawn: (ring: Coordinate[]) => void;
  onRouteModified: (coords: Coordinate[]) => void;
  onAntennaModified: (id: string, center: Coordinate, radiusUnits: number) => void;
  onParcelModified: (id: string, ring: Coordinate[]) => void;
}

const DRAW_TYPE_BY_MODE: Partial<Record<DrawMode, 'Circle' | 'Polygon'>> = {
  'draw-route': 'Polygon',
  'draw-antenna': 'Circle',
  'draw-parcel': 'Polygon',
};

const ROUTE_SKETCH_STROKE = new Style({
  stroke: new Stroke({
    color: '#E85D2A',
    width: 2.5,
    lineDash: [8, 5],
  }),
  fill: new Fill({
    color: 'rgba(232, 93, 42, 0.04)',
  }),
});

const ROUTE_CURSOR_STYLE = new Style({
  image: new CircleStyle({
    radius: 6,
    fill: new Fill({ color: '#E85D2A' }),
    stroke: new Stroke({ color: '#0B0D0F', width: 2 }),
  }),
});

function createWaypointBadgeStyle(coord: Coordinate, index: number): Style {
  return new Style({
    geometry: new Point(coord),
    image: new CircleStyle({
      radius: 9,
      fill: new Fill({ color: '#0B0D0F' }),
      stroke: new Stroke({ color: '#E85D2A', width: 2 }),
    }),
    text: new Text({
      text: String(index + 1),
      font: "700 10px 'JetBrains Mono', monospace",
      fill: new Fill({ color: '#F2F1EC' }),
    }),
  });
}

function routeDrawStyle(feature: FeatureLike): Style | Style[] {
  const geom = feature.getGeometry();
  if (!geom) return ROUTE_SKETCH_STROKE;

  if (geom instanceof Polygon) {
    const ring = geom.getCoordinates()[0] ?? [];
    // During OpenLayers Polygon draw, the last two coords are the live cursor and closing vertex
    const placed = ring.length > 2 ? ring.slice(0, -2) : ring.slice(0, 1);
    return [ROUTE_SKETCH_STROKE, ...placed.map((c, idx) => createWaypointBadgeStyle(c, idx))];
  }

  if (geom instanceof LineString) {
    const coords = geom.getCoordinates();
    const placed = coords.length > 1 ? coords.slice(0, -1) : coords;
    return [ROUTE_SKETCH_STROKE, ...placed.map((c, idx) => createWaypointBadgeStyle(c, idx))];
  }

  return ROUTE_CURSOR_STYLE;
}

export function GisMapCanvas({
  mode,
  layers,
  routeCoords,
  antennas,
  parcels,
  drone,
  onRouteDrawn,
  onAntennaDrawn,
  onParcelDrawn,
  onRouteModified,
  onAntennaModified,
  onParcelModified,
}: GisMapCanvasProps) {
  const drawLayerRef = useRef<RLayerVector>(null);
  const drawType = DRAW_TYPE_BY_MODE[mode];

  const routeGeometry = useMemo(
    () => (routeCoords.length >= 2 ? new LineString(routeCoords) : null),
    [routeCoords]
  );

  const parcelItems = useMemo(
    () =>
      parcels.map((parcel) => ({
        ...parcel,
        meta: PARCEL_KINDS[parcel.kind],
        geometry: new Polygon([parcel.ring]),
      })),
    [parcels]
  );

  const antennaItems = useMemo(
    () =>
      antennas.map((ant) => ({
        ...ant,
        circleGeom: new Circle(ant.center, ant.radiusUnits),
        pinGeom: new Point(ant.center),
      })),
    [antennas]
  );

  const droneGeometry = useMemo(
    () => (drone ? new Point(drone.coord) : null),
    [drone]
  );

  const handleDrawEnd = (e: DrawEvent) => {
    const geom = e.feature.getGeometry();
    if (!geom) return;

    if (mode === 'draw-route' && geom instanceof Polygon) {
      const ring = geom.getCoordinates()[0];
      if (ring && ring.length >= 4) onRouteDrawn(ring);
    } else if (mode === 'draw-antenna' && geom instanceof Circle) {
      const radius = Math.max(120, geom.getRadius());
      onAntennaDrawn(geom.getCenter(), radius);
    } else if (mode === 'draw-parcel' && geom instanceof Polygon) {
      const ring = geom.getCoordinates()[0];
      if (ring && ring.length >= 4) onParcelDrawn(ring);
    }

    // Remove the temporary sketch feature once React state owns the geometry
    window.setTimeout(() => {
      drawLayerRef.current?.source?.clear();
    }, 0);
  };

  const handleModifyRoute = (e: ModifyEvent) => {
    e.features.forEach((f) => {
      const g = f.getGeometry();
      if (g instanceof LineString) {
        onRouteModified(g.getCoordinates());
      }
    });
  };

  const handleModifyAntenna = (e: ModifyEvent) => {
    e.features.forEach((f) => {
      const id = f.get('entityId');
      const g = f.getGeometry();
      if (typeof id === 'string' && g instanceof Circle) {
        onAntennaModified(id, g.getCenter(), Math.max(120, g.getRadius()));
      }
    });
  };

  const handleModifyParcel = (e: ModifyEvent) => {
    e.features.forEach((f) => {
      const id = f.get('entityId');
      const g = f.getGeometry();
      if (typeof id === 'string' && g instanceof Polygon) {
        const ring = g.getCoordinates()[0];
        if (ring && ring.length >= 4) onParcelModified(id, ring);
      }
    });
  };

  const cursorClass =
    mode === 'pan'
      ? 'cursor-grab active:cursor-grabbing'
      : mode === 'modify'
        ? 'cursor-pointer'
        : 'cursor-crosshair';

  return (
    <div className="relative overflow-hidden rounded-xl border border-[#DFDDD5] bg-[#0B0D0F] dark:border-[#232830]">
      <RMap
        initial={{ center: DEFAULT_MAP_CENTER, zoom: DEFAULT_MAP_ZOOM }}
        className={`h-[440px] w-full sm:h-[500px] ${cursorClass}`}
      >
        <ROSM />

        <RLayerGraticule visible={layers.graticule} showLabels={false} />

        {/* Parcels layer */}
        <RLayerVector zIndex={5} visible={layers.parcels}>
          {parcelItems.map((parcel) => (
            <RFeature
              key={parcel.id}
              geometry={parcel.geometry}
              properties={{ entityId: parcel.id }}
            >
              <RStyle.RStyle>
                <RStyle.RFill color={parcel.meta.fill} />
                <RStyle.RStroke color={parcel.meta.stroke} width={2} lineDash={[6, 4]} />
                <RStyle.RText
                  text={`${parcel.label} · ${parcel.meta.label}`}
                  font="600 11px 'JetBrains Mono', monospace"
                >
                  <RStyle.RFill color={parcel.meta.stroke} />
                  <RStyle.RStroke color="#0B0D0F" width={3} />
                </RStyle.RText>
              </RStyle.RStyle>
            </RFeature>
          ))}
          {mode === 'modify' && <RInteraction.RModify onModifyEnd={handleModifyParcel} />}
        </RLayerVector>

        {/* Antennas coverage circles layer */}
        <RLayerVector zIndex={6} visible={layers.antennas}>
          {antennaItems.map((ant) => (
            <RFeature
              key={`cov-${ant.id}`}
              geometry={ant.circleGeom}
              properties={{ entityId: ant.id }}
            >
              <RStyle.RStyle>
                <RStyle.RFill color="rgba(232, 93, 42, 0.12)" />
                <RStyle.RStroke color="rgba(232, 93, 42, 0.8)" width={1.8} lineDash={[6, 4]} />
              </RStyle.RStyle>
            </RFeature>
          ))}
          {mode === 'modify' && <RInteraction.RModify onModifyEnd={handleModifyAntenna} />}
        </RLayerVector>

        {/* Antenna center pins */}
        <RLayerVector zIndex={7} visible={layers.antennas}>
          {antennaItems.map((ant) => (
            <RFeature key={`pin-${ant.id}`} geometry={ant.pinGeom}>
              <RStyle.RStyle>
                <RStyle.RCircle radius={6}>
                  <RStyle.RFill color="#E85D2A" />
                  <RStyle.RStroke color="#FFFFFF" width={2} />
                </RStyle.RCircle>
                <RStyle.RText
                  text={ant.label}
                  offsetY={-14}
                  font="600 11px 'JetBrains Mono', monospace"
                >
                  <RStyle.RFill color="#E85D2A" />
                  <RStyle.RStroke color="#0B0D0F" width={3} />
                </RStyle.RText>
              </RStyle.RStyle>
            </RFeature>
          ))}
        </RLayerVector>

        {/* Drone mission route layer */}
        <RLayerVector zIndex={9} visible={layers.route}>
          {routeGeometry && (
            <RFeature geometry={routeGeometry} properties={{ entityId: 'mission-route' }}>
              <RStyle.RStyle>
                <RStyle.RStroke color="#121417" width={4} />
              </RStyle.RStyle>
            </RFeature>
          )}
          {mode === 'modify' && <RInteraction.RModify onModifyEnd={handleModifyRoute} />}
        </RLayerVector>

        {/* Route accent stroke & waypoint badges */}
        <RLayerVector zIndex={10} visible={layers.route}>
          {routeGeometry && (
            <RFeature geometry={routeGeometry}>
              <RStyle.RStyle>
                <RStyle.RStroke color="#E85D2A" width={2.2} lineDash={[8, 5]} />
              </RStyle.RStyle>
            </RFeature>
          )}
          {routeCoords
            .filter((coord, idx, arr) => {
              if (idx !== arr.length - 1 || arr.length < 2) return true;
              return coord[0] !== arr[0][0] || coord[1] !== arr[0][1];
            })
            .map((coord, idx) => (
              <RFeature key={`wp-${idx}-${coord[0].toFixed(1)}`} geometry={new Point(coord)}>
                <RStyle.RStyle>
                  <RStyle.RCircle radius={9}>
                    <RStyle.RFill color="#0B0D0F" />
                    <RStyle.RStroke color="#E85D2A" width={2} />
                  </RStyle.RCircle>
                  <RStyle.RText text={String(idx + 1)} font="700 10px 'JetBrains Mono', monospace">
                    <RStyle.RFill color="#F2F1EC" />
                  </RStyle.RText>
                </RStyle.RStyle>
              </RFeature>
            ))}
        </RLayerVector>

        {/* Live animated drone marker */}
        <RLayerVector zIndex={12}>
          {droneGeometry && drone && (
            <RFeature geometry={droneGeometry}>
              <RStyle.RStyle>
                <RStyle.RRegularShape points={3} radius={12} rotation={drone.rotation}>
                  <RStyle.RFill color="#16A36E" />
                  <RStyle.RStroke color="#0B0D0F" width={2.2} />
                </RStyle.RRegularShape>
              </RStyle.RStyle>
            </RFeature>
          )}
        </RLayerVector>

        {/* Dedicated interactive drawing layer */}
        <RLayerVector ref={drawLayerRef} zIndex={15}>
          {drawType && (
            <RInteraction.RDraw
              key={mode}
              type={drawType}
              style={mode === 'draw-route' ? routeDrawStyle : undefined}
              onDrawEnd={handleDrawEnd}
            />
          )}
        </RLayerVector>
      </RMap>

      {/* Contextual drawing hint */}
      <div className="pointer-events-none absolute bottom-3 left-3 z-10 rounded-lg border border-[#F2F1EC]/15 bg-[#0B0D0F]/90 px-3 py-1.5 font-mono text-[11px] text-[#F2F1EC] backdrop-blur">
        {mode === 'pan' && 'Modalità Naviga · Trascina per spostarti, rotella per lo zoom'}
        {mode === 'draw-route' &&
          'Disegna Missione · Clicca i waypoint e aggancia il primo punto (o doppio click) per chiudere il circuito'}
        {mode === 'draw-antenna' &&
          'Disegna Antenna (Circle) · Clicca il centro e trascina per impostare il raggio'}
        {mode === 'draw-parcel' &&
          'Disegna Parcella (Polygon) · Clicca i vertici del poligono, doppio click per chiudere'}
        {mode === 'modify' &&
          'Modifica Geometrie (RModify) · Trascina i vertici di rotta, parcelle o cerchi antenne'}
      </div>
    </div>
  );
}
