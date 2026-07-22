import { LocateFixed } from 'lucide-react';
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, EmptyState, ErrorState, PageHeader, RiskBadge, SectionHeader, Skeleton } from '@/components/ui';
import { useCases } from '@/data/queries';
import { formatDate, inferRisk } from '@/lib/format';
import type { CaseRecord } from '@/types';

// Fix Leaflet's default icon path issues in Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// A hook to safely geocode location strings using a free API (Nominatim)
const STATIC_COORDINATES: Record<string, [number, number]> = {
  'Connaught Place, New Delhi': [28.6315, 77.2167],
  'Cyber City, Gurugram': [28.4950, 77.0895],
  'Bandra Kurla Complex, Mumbai': [19.0600, 72.8680],
  'MG Road, Bengaluru': [12.9756, 77.6066],
  'Sector 17, Chandigarh': [30.7398, 76.7827],
};

function useGeocodedCases(cases: CaseRecord[] | undefined) {
  const [geocoded, setGeocoded] = useState<Record<string, [number, number]>>(STATIC_COORDINATES);

  useEffect(() => {
    if (!cases) return;
    const fetchCoords = async () => {
      const newGeocoded = { ...geocoded };
      let changed = false;

      for (const item of cases) {
        if (!item.location) continue;
        if (newGeocoded[item.location]) continue;

        if (STATIC_COORDINATES[item.location]) {
          newGeocoded[item.location] = STATIC_COORDINATES[item.location];
          changed = true;
          continue;
        }

        const cached = sessionStorage.getItem(`geocode_${item.location}`);
        if (cached) {
          newGeocoded[item.location] = JSON.parse(cached);
          changed = true;
          continue;
        }

        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(item.location)}&limit=1`);
          const data = await res.json();
          if (data && data.length > 0) {
            const coords: [number, number] = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
            newGeocoded[item.location] = coords;
            sessionStorage.setItem(`geocode_${item.location}`, JSON.stringify(coords));
            changed = true;
          }
        } catch (err) {
          console.error("Geocoding failed for", item.location, err);
        }
        await new Promise(r => setTimeout(r, 1000));
      }

      if (changed) {
        setGeocoded(newGeocoded);
      }
    };

    fetchCoords();
  }, [cases]);

  return geocoded;
}

function MapUpdater({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 12, { animate: true });
    }
  }, [center, map]);
  return null;
}

export function HeatMapPage() {
  const query = useCases();
  const [risk, setRisk] = useState('ALL');
  const geocoded = useGeocodedCases(query.data);
  const [selectedCenter, setSelectedCenter] = useState<[number, number] | null>(null);

  const located = (query.data ?? []).filter(
    (item) => item.location && (risk === 'ALL' || inferRisk(item) === risk)
  );

  const defaultCenter: [number, number] = [28.6139, 77.2090]; // Default to New Delhi if no coords

  return <>
    <PageHeader
      eyebrow="Geospatial operations"
      title="Incident geography"
      description="Location context from case records, plotted using live geocoding."
      actions={
        <select value={risk} onChange={(event) => setRisk(event.target.value)} aria-label="Risk filter" className="map-filter">
          <option value="ALL">All risk</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      }
    />
    {query.isLoading ? <Skeleton rows={9} /> : query.isError ? (
      <ErrorState error={query.error} retry={() => void query.refetch()} />
    ) : (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="map-card lg:col-span-2">
          <MapContainer center={defaultCenter} zoom={4} style={{ height: '100%', width: '100%' }} className="operations-map">
            <MapUpdater center={selectedCenter} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {located.map((item) => {
              if (item.location && geocoded[item.location]) {
                const position = geocoded[item.location];
                return (
                  <Marker key={item.id} position={position}>
                    <Popup>
                      <div className="font-bold text-sm mb-1">{item.title}</div>
                      <div className="text-xs">{item.location}</div>
                      <div className="text-xs text-gray-500 mt-1">{formatDate(item.updatedAt)}</div>
                    </Popup>
                  </Marker>
                );
              }
              return null;
            })}
          </MapContainer>
          {Object.keys(geocoded).length === 0 && located.length > 0 && (
            <div className="map-geocoding-status">
              <span />
              Geocoding locations...
            </div>
          )}
        </Card>
        
        <Card className="map-location-list">
          <SectionHeader title="Reported locations" description="Select a location to zoom." />
          {located.length === 0 ? (
            <EmptyState title="No location labels" description="No cases in the selected risk band contain a location field." />
          ) : (
            <div className="map-location-items">
              {located.map((item) => {
                const hasCoords = item.location && geocoded[item.location];
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (hasCoords && item.location) {
                        setSelectedCenter(geocoded[item.location]);
                      }
                    }}
                    className={`map-location ${hasCoords ? 'map-location--available' : 'map-location--pending'}`}
                  >
                    <div>
                      <strong>
                        <LocateFixed size={14} className={hasCoords ? 'map-location__icon' : ''} /> 
                        {item.location}
                      </strong>
                      <span>{item.title}</span>
                    </div>
                    <RiskBadge value={inferRisk(item)} />
                  </div>
                )
              })}
            </div>
          )}
        </Card>
      </div>
    )}
  </>;
}
