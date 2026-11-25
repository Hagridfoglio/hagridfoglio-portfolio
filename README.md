# Gennaro Pianese — Portfolio & Workstation GIS

Portfolio personale costruito con **React**, **TypeScript**, **Tailwind CSS**, **OpenLayers (`ol`)** e **`rlayers`**, organizzato secondo un'architettura **feature-based**.

## Workstation GIS ("Cosa so fare")

Una sola demo reale, completa e 100% client-side basata su **OpenLayers + `rlayers`**:
- **Disegno da zero (`RInteraction.RDraw`)**: disegna rotte missione (`LineString`), antenne con raggio di copertura (`Circle`) e parcelle/zone (`Polygon` con tipologia assegnabile).
- **Modifica geometrie (`RInteraction.RModify`)**: trascina i vertici di rotta, parcelle e cerchi di copertura con ricalcolo immediato.
- **Calcoli geodetici reali (`ol/sphere`)**: lunghezza rotta, area parcelle in ettari/m², raggio antenne e verifica spaziale (`intersectsCoordinate`) di copertura e sorvolo in tempo reale.
- **Export GeoJSON (`ol/format/GeoJSON`)**: scarica la missione e tutte le geometrie disegnate in formato standard `.geojson`.

## Struttura del progetto

```text
src/
├── app/                     # Shell principale (App.tsx)
├── components/
│   ├── layout/              # Navbar, Footer
│   └── ui/                  # Componenti UI condivisi
├── features/
│   ├── gis-studio/          # Workstation OpenLayers + rlayers
│   │   ├── components/      # GisStudioSection, GisMapCanvas
│   │   ├── data/            # Preset e tipologie parcelle
│   │   ├── types/           # Tipi GIS
│   │   ├── utils/           # Calcoli geodetici & export GeoJSON
│   │   └── index.ts
│   └── profile/             # Chi sono, Conoscenze, Esperienze, Contatti
│       ├── components/
│       ├── data/
│       ├── types/
│       └── index.ts
├── hooks/                   # Custom hooks condivisi (useTheme)
├── styles/                  # CSS globale e Tailwind
└── main.tsx
```

## Comandi

```bash
npm install
npm run dev
npm run build
npm run preview
```