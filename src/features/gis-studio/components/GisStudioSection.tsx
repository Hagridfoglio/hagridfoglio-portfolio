import { useEffect, useMemo, useState } from 'react';
import {
  Compass,
  Download,
  Eraser,
  Hand,
  Layers,
  Pause,
  Pencil,
  Pentagon,
  Play,
  Radio,
  RotateCcw,
  Route,
  Trash2,
} from 'lucide-react';
import { Circle, Polygon } from 'ol/geom';
import { toLonLat } from 'ol/proj';
import type { Coordinate } from 'ol/coordinate';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { GisMapCanvas } from '@/features/gis-studio/components/GisMapCanvas';
import {
  createSampleAntennas,
  createSampleParcels,
  createSampleRoute,
  PARCEL_KINDS,
} from '@/features/gis-studio/data/gis.presets';
import type {
  DrawnAntenna,
  DrawnParcel,
  DrawMode,
  DroneTelemetry,
  LayerVisibility,
  ParcelKind,
} from '@/features/gis-studio/types/gis.types';
import {
  exportMissionGeoJSON,
  formatArea,
  formatDistance,
  getAntennaRadiusMeters,
  getParcelAreaSqm,
  getRouteLengthMeters,
} from '@/features/gis-studio/utils/geo.utils';

export function GisStudioSection() {
  const [mode, setMode] = useState<DrawMode>('pan');
  const [parcelKind, setParcelKind] = useState<ParcelKind>('uliveto');
  const [routeCoords, setRouteCoords] = useState<Coordinate[]>(() => createSampleRoute());
  const [antennas, setAntennas] = useState<DrawnAntenna[]>(() => createSampleAntennas());
  const [parcels, setParcels] = useState<DrawnParcel[]>(() => createSampleParcels());
  const [layers, setLayers] = useState<LayerVisibility>({
    parcels: true,
    antennas: true,
    route: true,
    graticule: false,
  });

  const [isFlying, setIsFlying] = useState(true);
  const [speed, setSpeed] = useState<1 | 2>(1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isFlying || routeCoords.length < 2) return;
    let rafId = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.max(0, Math.min((now - last) / 1000, 0.1));
      last = now;
      setProgress((prev) => {
        const segments = routeCoords.length - 1;
        const next = prev + dt * 0.4 * speed;
        return next >= segments ? next - segments : next;
      });
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isFlying, speed, routeCoords.length]);

  const routeLengthMeters = useMemo(() => getRouteLengthMeters(routeCoords), [routeCoords]);

  const drone: DroneTelemetry | null = useMemo(() => {
    if (routeCoords.length < 2) return null;
    const segments = routeCoords.length - 1;
    const safeProgress = ((progress % segments) + segments) % segments;
    const idx = Math.floor(safeProgress);
    const t = safeProgress - idx;
    const a = routeCoords[idx];
    const b = routeCoords[idx + 1];
    const coord: Coordinate = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
    const [lon, lat] = toLonLat(coord);
    const rotation = Math.atan2(b[0] - a[0], b[1] - a[1]);

    const matchedAntenna = antennas.find((ant) =>
      new Circle(ant.center, ant.radiusUnits).intersectsCoordinate(coord)
    );
    const matchedParcel = parcels.find((p) =>
      new Polygon([p.ring]).intersectsCoordinate(coord)
    );

    return {
      coord,
      lon,
      lat,
      rotation,
      activeAntenna: matchedAntenna ? matchedAntenna.label : null,
      activeParcel: matchedParcel
        ? { label: matchedParcel.label, kindLabel: PARCEL_KINDS[matchedParcel.kind].label }
        : null,
    };
  }, [progress, routeCoords, antennas, parcels]);

  const handleRouteDrawn = (coords: Coordinate[]) => {
    setRouteCoords(coords);
    setProgress(0);
    setIsFlying(true);
    setMode('pan');
  };

  const handleAntennaDrawn = (center: Coordinate, radiusUnits: number) => {
    setAntennas((prev) => [
      ...prev,
      {
        id: `ant-${Date.now()}`,
        label: `ANT-${String(prev.length + 1).padStart(2, '0')}`,
        center,
        radiusUnits,
      },
    ]);
  };

  const handleParcelDrawn = (ring: Coordinate[]) => {
    const prefix = parcelKind === 'rischio' ? 'Z' : 'P';
    setParcels((prev) => [
      ...prev,
      {
        id: `parc-${Date.now()}`,
        label: `${prefix}-${100 + prev.length + 1}`,
        kind: parcelKind,
        ring,
      },
    ]);
  };

  const handleClearAll = () => {
    setRouteCoords([]);
    setAntennas([]);
    setParcels([]);
    setProgress(0);
    setIsFlying(false);
    setMode('draw-route');
  };

  const handleLoadSample = () => {
    setRouteCoords(createSampleRoute());
    setAntennas(createSampleAntennas());
    setParcels(createSampleParcels());
    setProgress(0);
    setIsFlying(true);
    setMode('pan');
  };

  const handleExportGeoJSON = () => {
    const content = exportMissionGeoJSON(routeCoords, antennas, parcels);
    const blob = new Blob([content], { type: 'application/geo+json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'missione-openlayers.geojson';
    a.click();
    URL.revokeObjectURL(url);
  };

  const tools: { id: DrawMode; label: string; icon: typeof Hand }[] = [
    { id: 'pan', label: 'Naviga', icon: Hand },
    { id: 'draw-route', label: 'Disegna Missione', icon: Route },
    { id: 'draw-antenna', label: 'Disegna Antenna', icon: Radio },
    { id: 'draw-parcel', label: 'Disegna Parcella', icon: Pentagon },
    { id: 'modify', label: 'Modifica Vertici', icon: Pencil },
  ];

  return (
    <section id="gis-studio" className="scroll-mt-20 py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader
          eyebrow="02 · Cosa so fare"
          title="Workstation GIS con OpenLayers e rlayers"
          description="Svuota la mappa per partire da zero oppure modifica lo scenario di esempio: disegna una rotta missione, traccia coperture antenne e poligoni catastali con RDraw e RModify, verifica le intersezioni geodetiche in tempo reale ed esporta il GeoJSON."
        />

        {/* Primary Drawing Toolbar */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#DFDDD5] bg-white p-3 dark:border-[#232830] dark:bg-[#13161A]">
          <div className="flex flex-wrap items-center gap-1.5">
            {tools.map(({ id, label, icon: Icon }) => {
              const active = mode === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setMode(id)}
                  className={`inline-flex min-h-[40px] items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition active:scale-[0.98] ${
                    active
                      ? 'bg-[#E85D2A] text-[#0B0D0F]'
                      : 'border border-transparent text-[#5A616B] hover:bg-[#F6F5F0] hover:text-[#121417] dark:text-[#98A1AE] dark:hover:bg-[#1B2026] dark:hover:text-[#F2F1EC]'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleClearAll}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-[#DFDDD5] px-3 py-2 text-xs font-semibold text-[#121417] transition hover:border-[#E85D2A] active:scale-[0.98] dark:border-[#232830] dark:text-[#F2F1EC]"
            >
              <Eraser className="h-3.5 w-3.5 text-[#E85D2A]" />
              Nuova da zero
            </button>
            <button
              type="button"
              onClick={handleLoadSample}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-[#DFDDD5] px-3 py-2 text-xs font-semibold text-[#121417] transition hover:border-[#E85D2A] active:scale-[0.98] dark:border-[#232830] dark:text-[#F2F1EC]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Carica esempio
            </button>
            <button
              type="button"
              onClick={handleExportGeoJSON}
              disabled={routeCoords.length < 2 && antennas.length === 0 && parcels.length === 0}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-[#121417] px-3 py-2 text-xs font-semibold text-[#F6F5F0] transition hover:bg-[#E85D2A] hover:text-[#0B0D0F] disabled:opacity-40 dark:bg-[#F2F1EC] dark:text-[#0B0D0F] dark:hover:bg-[#E85D2A]"
            >
              <Download className="h-3.5 w-3.5" />
              Esporta GeoJSON
            </button>
          </div>
        </div>

        {/* Parcel Kind Selector (shown when drawing parcels) */}
        {mode === 'draw-parcel' && (
          <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-[#DFDDD5] bg-white px-4 py-2.5 text-xs dark:border-[#232830] dark:bg-[#13161A]">
            <span className="font-mono uppercase tracking-wider text-[#5A616B] dark:text-[#98A1AE]">
              Tipologia parcella:
            </span>
            {Object.values(PARCEL_KINDS).map((kind) => (
              <button
                key={kind.id}
                type="button"
                onClick={() => setParcelKind(kind.id)}
                className={`inline-flex items-center gap-2 rounded-md border px-2.5 py-1 font-medium transition ${
                  parcelKind === kind.id
                    ? 'border-[#E85D2A] bg-[#E85D2A]/10 text-[#121417] dark:text-[#F2F1EC]'
                    : 'border-[#DFDDD5] text-[#5A616B] dark:border-[#232830] dark:text-[#98A1AE]'
                }`}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: kind.stroke }}
                />
                {kind.label}
              </button>
            ))}
          </div>
        )}

        {/* Map + Inspector Panel */}
        <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
          <div className="space-y-3">
            <GisMapCanvas
              mode={mode}
              layers={layers}
              routeCoords={routeCoords}
              antennas={antennas}
              parcels={parcels}
              drone={drone}
              onRouteDrawn={handleRouteDrawn}
              onAntennaDrawn={handleAntennaDrawn}
              onParcelDrawn={handleParcelDrawn}
              onRouteModified={(coords) => setRouteCoords(coords)}
              onAntennaModified={(id, center, radiusUnits) =>
                setAntennas((prev) =>
                  prev.map((a) => (a.id === id ? { ...a, center, radiusUnits } : a))
                )
              }
              onParcelModified={(id, ring) =>
                setParcels((prev) => prev.map((p) => (p.id === id ? { ...p, ring } : p)))
              }
            />

            {/* Mission Flight Controls & Live Spatial Telemetry */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#DFDDD5] bg-white p-4 dark:border-[#232830] dark:bg-[#13161A]">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={routeCoords.length < 2}
                  onClick={() => setIsFlying((f) => !f)}
                  className="inline-flex min-h-[40px] items-center gap-2 rounded-lg bg-[#E85D2A] px-4 py-2 text-xs font-semibold text-[#0B0D0F] transition hover:bg-[#F26C3A] active:scale-[0.98] disabled:opacity-40"
                >
                  {isFlying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                  {isFlying ? 'Pausa volo' : 'Avvia missione'}
                </button>
                <button
                  type="button"
                  onClick={() => setSpeed((s) => (s === 1 ? 2 : 1))}
                  className="min-h-[40px] rounded-lg border border-[#DFDDD5] px-3 py-2 font-mono text-xs font-medium text-[#121417] transition hover:border-[#E85D2A] dark:border-[#232830] dark:text-[#F2F1EC]"
                >
                  {speed}x
                </button>
              </div>

              <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 font-mono text-xs sm:grid-cols-4">
                <div>
                  <span className="block text-[10px] uppercase text-[#5A616B] dark:text-[#98A1AE]">
                    Lunghezza rotta
                  </span>
                  <span className="font-semibold text-[#121417] dark:text-[#F2F1EC]">
                    {routeCoords.length >= 2 ? formatDistance(routeLengthMeters) : '—'}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase text-[#5A616B] dark:text-[#98A1AE]">
                    Coordinate GPS
                  </span>
                  <span className="font-semibold text-[#121417] dark:text-[#F2F1EC]">
                    {drone ? `${drone.lat.toFixed(4)}, ${drone.lon.toFixed(4)}` : '—'}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase text-[#5A616B] dark:text-[#98A1AE]">
                    Copertura
                  </span>
                  <span
                    className={`font-semibold ${
                      drone?.activeAntenna
                        ? 'text-[#16A36E]'
                        : 'text-[#5A616B] dark:text-[#98A1AE]'
                    }`}
                  >
                    {drone?.activeAntenna ?? 'Nessuna'}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase text-[#5A616B] dark:text-[#98A1AE]">
                    Sorvolo area
                  </span>
                  <span className="font-semibold text-[#121417] dark:text-[#F2F1EC]">
                    {drone?.activeParcel ? drone.activeParcel.label : 'Esterno'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Inspector: Layers + Drawn Geometries */}
          <aside className="flex flex-col gap-4 rounded-xl border border-[#DFDDD5] bg-white p-4 dark:border-[#232830] dark:bg-[#13161A]">
            <div>
              <h3 className="mb-2.5 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-[#5A616B] dark:text-[#98A1AE]">
                <Layers className="h-3.5 w-3.5 text-[#E85D2A]" />
                Layer Vettoriali
              </h3>
              <div className="space-y-1 text-sm">
                {(
                  [
                    ['parcels', 'Parcelle & Zone'],
                    ['antennas', 'Coperture Antenne'],
                    ['route', 'Rotta & Waypoint'],
                    ['graticule', 'Graticolo GPS'],
                  ] as const
                ).map(([key, label]) => (
                  <label
                    key={key}
                    className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 transition hover:bg-[#F6F5F0] dark:hover:bg-[#1B2026]"
                  >
                    <span className="text-xs font-medium text-[#121417] dark:text-[#F2F1EC]">
                      {label}
                    </span>
                    <input
                      type="checkbox"
                      checked={layers[key]}
                      onChange={() => setLayers((prev) => ({ ...prev, [key]: !prev[key] }))}
                      className="h-4 w-4 accent-[#E85D2A]"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t border-[#DFDDD5] pt-3 dark:border-[#232830]">
              <div className="mb-2 flex items-center justify-between font-mono text-xs uppercase tracking-wider text-[#5A616B] dark:text-[#98A1AE]">
                <span>Antenne ({antennas.length})</span>
                <Compass className="h-3.5 w-3.5 text-[#E85D2A]" />
              </div>
              {antennas.length === 0 ? (
                <p className="text-xs text-[#5A616B] dark:text-[#98A1AE]">
                  Nessuna antenna. Usa &ldquo;Disegna Antenna&rdquo;.
                </p>
              ) : (
                <ul className="max-h-32 space-y-1.5 overflow-y-auto pr-1 text-xs">
                  {antennas.map((ant) => (
                    <li
                      key={ant.id}
                      className="flex items-center justify-between rounded-lg border border-[#DFDDD5] px-2.5 py-1.5 dark:border-[#232830]"
                    >
                      <div>
                        <span className="font-mono font-semibold text-[#121417] dark:text-[#F2F1EC]">
                          {ant.label}
                        </span>
                        <span className="ml-2 font-mono text-[11px] text-[#5A616B] dark:text-[#98A1AE]">
                          r={formatDistance(getAntennaRadiusMeters(ant))}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAntennas((prev) => prev.filter((a) => a.id !== ant.id))}
                        className="rounded p-1 text-[#5A616B] hover:text-[#DC2626] dark:text-[#98A1AE]"
                        aria-label={`Elimina ${ant.label}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border-t border-[#DFDDD5] pt-3 dark:border-[#232830]">
              <div className="mb-2 font-mono text-xs uppercase tracking-wider text-[#5A616B] dark:text-[#98A1AE]">
                Parcelle ({parcels.length})
              </div>
              {parcels.length === 0 ? (
                <p className="text-xs text-[#5A616B] dark:text-[#98A1AE]">
                  Nessuna parcella. Usa &ldquo;Disegna Parcella&rdquo;.
                </p>
              ) : (
                <ul className="max-h-40 space-y-1.5 overflow-y-auto pr-1 text-xs">
                  {parcels.map((parcel) => {
                    const meta = PARCEL_KINDS[parcel.kind];
                    return (
                      <li
                        key={parcel.id}
                        className="flex items-center justify-between rounded-lg border border-[#DFDDD5] px-2.5 py-1.5 dark:border-[#232830]"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span
                              className="h-2 w-2 shrink-0 rounded-full"
                              style={{ backgroundColor: meta.stroke }}
                            />
                            <span className="font-mono font-semibold text-[#121417] dark:text-[#F2F1EC]">
                              {parcel.label}
                            </span>
                            <span className="truncate text-[11px] text-[#5A616B] dark:text-[#98A1AE]">
                              {meta.label}
                            </span>
                          </div>
                          <span className="font-mono text-[10px] text-[#5A616B] dark:text-[#98A1AE]">
                            Area: {formatArea(getParcelAreaSqm(parcel.ring))}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setParcels((prev) => prev.filter((p) => p.id !== parcel.id))}
                          className="rounded p-1 text-[#5A616B] hover:text-[#DC2626] dark:text-[#98A1AE]"
                          aria-label={`Elimina ${parcel.label}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
