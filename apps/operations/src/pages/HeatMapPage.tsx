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
function useGeocodedCases(cases: CaseRecord[] | undefined) {
  const [geocoded, setGeocoded] = useState<Record<string, [number, number]>>({});

  useEffect(() => {
    if (!cases) return;
    const fetchCoords = async () => {
      const newGeocoded = { ...geocoded };
      let changed = false;

      for (const item of cases) {
        if (!item.location) continue;
        if (newGeocoded[item.location]) continue;

        // Check local cache first to avoid spamming the free API
        const cached = sessionStorage.getItem(`geocode_${item.location}`);
        if (cached) {
          newGeocoded[item.location] = JSON.parse(cached);
          changed = true;
          continue;
        }

        try {
          // OpenStreetMap Nominatim Free Geocoding API
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
        // Sleep to respect rate limit (1 req/sec for Nominatim)
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
        <select value={risk} onChange={(event) => setRisk(event.target.value)} aria-label="Risk filter" className="bg-[#0A0E17] border border-white/10 text-white rounded-md px-3 py-1.5 text-sm outline-none focus:border-[#00E5FF]">
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
        <Card className="lg:col-span-2 overflow-hidden border border-white/10 relative h-[600px] z-0 p-0">
          <MapContainer center={defaultCenter} zoom={4} style={{ height: '100%', width: '100%' }} className="bg-[#03050A]">
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
                    <Popup className="text-black">
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
            <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md border border-white/10 p-3 rounded-lg flex items-center gap-2 text-sm z-[1000] text-gray-300">
              <span className="w-4 h-4 rounded-full border-2 border-[#00E5FF] border-t-transparent animate-spin" />
              Geocoding locations...
            </div>
          )}
        </Card>
        
        <Card className="flex flex-col gap-4 border border-white/10 bg-[#0A0E17]/50 max-h-[600px] overflow-y-auto">
          <SectionHeader title="Reported locations" description="Select a location to zoom." />
          {located.length === 0 ? (
            <EmptyState title="No location labels" description="No cases in the selected risk band contain a location field." />
          ) : (
            <div className="flex flex-col gap-2">
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
                    className={`p-3 rounded-lg border border-white/5 bg-white/[0.02] transition-colors flex justify-between items-start ${hasCoords ? 'cursor-pointer hover:bg-white/[0.05] hover:border-white/10' : 'opacity-70'}`}
                  >
                    <div className="flex flex-col gap-1">
                      <strong className="text-sm flex items-center gap-1.5">
                        <LocateFixed size={14} className={hasCoords ? 'text-[#00E5FF]' : 'text-gray-500'} /> 
                        {item.location}
                      </strong>
                      <span className="text-xs text-gray-400">{item.title}</span>
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
