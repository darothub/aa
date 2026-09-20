'use client';

import { useEffect, useRef, useState } from 'react';
import type { Map as LeafletMap } from 'leaflet';
import { css } from '@/lib/css';
import Reveal from '@/components/Reveal';
import { TRAVEL_REFERENCE, VENUE } from '@/content/wedding';

type TravelState = 'idle' | 'locating' | 'ok' | 'denied' | 'unsupported';

export default function Travel() {
  const mapElRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const [travelState, setTravelState] = useState<TravelState>('idle');
  const [travel, setTravel] = useState<{ km: number; mins: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import('leaflet')).default;
      if (cancelled || !mapElRef.current) return;
      const map = L.map(mapElRef.current, {
        scrollWheelZoom: false,
        zoomControl: true,
        attributionControl: false
      }).setView([VENUE.lat, VENUE.lng], 14);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);
      L.circleMarker([VENUE.lat, VENUE.lng], {
        radius: 9,
        color: '#9a6f4c',
        weight: 2,
        fillColor: '#9a6f4c',
        fillOpacity: 0.85
      })
        .addTo(map)
        .bindPopup(VENUE.mapPopupHtml);
      L.circle([VENUE.lat, VENUE.lng], { radius: 420, color: '#9a6f4c', weight: 1, opacity: 0.35, fillOpacity: 0.06 }).addTo(
        map
      );
      mapRef.current = map;
      setTimeout(() => map.invalidateSize(), 300);
    })();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  const locateMe = () => {
    if (!navigator.geolocation) {
      setTravelState('unsupported');
      return;
    }
    setTravelState('locating');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const R = 6371;
        const toRad = (x: number) => (x * Math.PI) / 180;
        const dLat = toRad(VENUE.lat - pos.coords.latitude);
        const dLng = toRad(VENUE.lng - pos.coords.longitude);
        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos(toRad(pos.coords.latitude)) * Math.cos(toRad(VENUE.lat)) * Math.sin(dLng / 2) ** 2;
        const km = 2 * R * Math.asin(Math.sqrt(a));
        const road = km * (km < 15 ? 1.35 : 1.22);
        const speed = km < 15 ? 26 : km < 120 ? 62 : 78;
        const mins = Math.max(3, Math.round((road / speed) * 60));
        setTravel({ km: road, mins });
        setTravelState('ok');

        const L = (await import('leaflet')).default;
        const map = mapRef.current;
        if (map) {
          const me: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          L.circleMarker(me, { radius: 6, color: '#3a352e', weight: 2, fillColor: '#faf7f1', fillOpacity: 1 })
            .addTo(map)
            .bindPopup('You are here');
          L.polyline([me, [VENUE.lat, VENUE.lng]], { color: '#9a6f4c', weight: 1.5, dashArray: '5 6', opacity: 0.7 }).addTo(
            map
          );
          map.invalidateSize();
          map.fitBounds([me, [VENUE.lat, VENUE.lng]], { padding: [44, 44], maxZoom: 15 });
        }
      },
      () => setTravelState('denied'),
      { enableHighAccuracy: false, timeout: 9000, maximumAge: 6e5 }
    );
  };

  let travelHeadline: string;
  let travelNote: string;
  let showLocateBtn = true;
  if (travelState === 'ok' && travel) {
    travelHeadline = `Approximately ${travel.mins} minutes by car`;
    travelNote = `About ${travel.km.toFixed(
      1
    )} km from where you are now — an estimate based on typical driving conditions. Tap through to Google or Apple Maps for live traffic.`;
    showLocateBtn = false;
  } else if (travelState === 'locating') {
    travelHeadline = 'Working out the distance…';
    travelNote = 'One moment while your device shares its position.';
    showLocateBtn = false;
  } else if (travelState === 'denied') {
    travelHeadline = `${TRAVEL_REFERENCE.cityCentre.minutes} minutes from the city centre`;
    travelNote = `No location shared — that is completely fine. ${VENUE.district} sits roughly ${TRAVEL_REFERENCE.cityCentre.minutes} minutes from ${TRAVEL_REFERENCE.cityCentre.label} and ${TRAVEL_REFERENCE.airport.minutes} minutes from ${TRAVEL_REFERENCE.airport.label}.`;
    showLocateBtn = false;
  } else if (travelState === 'unsupported') {
    travelHeadline = `${TRAVEL_REFERENCE.cityCentre.minutes} minutes from the city centre`;
    travelNote = `Roughly ${TRAVEL_REFERENCE.cityCentre.minutes} minutes from ${TRAVEL_REFERENCE.cityCentre.label}, ${TRAVEL_REFERENCE.airport.minutes} minutes from ${TRAVEL_REFERENCE.airport.label}.`;
    showLocateBtn = false;
  } else {
    travelHeadline = `How far are you from ${VENUE.district}?`;
    travelNote = 'Share your location and we will estimate the drive. Everything here works perfectly well if you would rather not.';
  }

  return (
    <section
      id="travel"
      style={css('scroll-margin-top:var(--header-h, 80px);padding:clamp(76px,12vw,150px) clamp(20px,5vw,72px);background:#f7f3ec')}
    >
      <div style={css('max-width:1160px;margin:0 auto;display:flex;flex-direction:column;gap:clamp(32px,5vw,56px)')}>
        <Reveal style={css('display:flex;flex-direction:column;gap:16px;max-width:44ch')}>
          <p style={css("margin:0;font:500 10px/1 'Jost',sans-serif;letter-spacing:.36em;text-transform:uppercase;color:#9a6f4c")}>
            Getting there
          </p>
          <h2 style={css("margin:0;font:300 clamp(36px,6.5vw,72px)/1.02 'Cormorant Garamond',serif;letter-spacing:-.015em")}>
            {VENUE.district}, and how far you are from it.
          </h2>
        </Reveal>

        <div style={css('display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:clamp(24px,4vw,48px);align-items:start')}>
          <Reveal style={css('display:flex;flex-direction:column;gap:22px')}>
            <div style={css('display:flex;flex-direction:column;gap:8px')}>
              <span style={css("font:500 9.5px/1 'Jost',sans-serif;letter-spacing:.28em;text-transform:uppercase;color:#9a6f4c")}>
                Address
              </span>
              <span style={css("font:300 clamp(17px,2vw,20px)/1.6 'Jost',sans-serif;color:#1f1c18")}>
                {VENUE.name},
                <br />
                {VENUE.fullAddress}
              </span>
            </div>

            <div style={css('padding:clamp(20px,3vw,28px);background:#efe8dd;display:flex;flex-direction:column;gap:14px')}>
              <span style={css("font:500 9.5px/1 'Jost',sans-serif;letter-spacing:.28em;text-transform:uppercase;color:#9a6f4c")}>
                Your journey
              </span>
              <p style={css("margin:0;font:300 clamp(20px,2.8vw,28px)/1.35 'Cormorant Garamond',serif;color:#1f1c18")}>
                {travelHeadline}
              </p>
              <p style={css("margin:0;font:300 13.5px/1.7 'Jost',sans-serif;color:#6b6259")}>{travelNote}</p>
              {showLocateBtn && (
                <button
                  type="button"
                  onClick={locateMe}
                  style={css(
                    "align-self:flex-start;appearance:none;cursor:pointer;border:1px solid #1f1c18;background:none;color:#1f1c18;padding:14px 26px;font:500 10.5px/1 'Jost',sans-serif;letter-spacing:.22em;text-transform:uppercase;transition:background .4s ease,color .4s ease"
                  )}
                >
                  Estimate my drive
                </button>
              )}
            </div>

            <div style={css('display:flex;flex-wrap:wrap;gap:12px')}>
              <a
                href={VENUE.googleMapsUrl}
                target="_blank"
                rel="noopener"
                style={css(
                  "padding:14px 24px;border:1px solid rgba(31,28,24,.26);font:500 10.5px/1 'Jost',sans-serif;letter-spacing:.2em;text-transform:uppercase;color:#1f1c18;transition:border-color .4s ease,color .4s ease"
                )}
              >
                Google Maps
              </a>
              <a
                href={VENUE.appleMapsUrl}
                target="_blank"
                rel="noopener"
                style={css(
                  "padding:14px 24px;border:1px solid rgba(31,28,24,.26);font:500 10.5px/1 'Jost',sans-serif;letter-spacing:.2em;text-transform:uppercase;color:#1f1c18;transition:border-color .4s ease,color .4s ease"
                )}
              >
                Apple Maps
              </a>
            </div>
          </Reveal>

          <Reveal>
            <div
              ref={mapElRef}
              role="img"
              aria-label={`Map of ${VENUE.name}, ${VENUE.shortAddress}`}
              // position+z-index give the map its own stacking context, which
              // is what keeps it under the fixed header. Leaflet's stylesheet
              // assigns its panes and controls z-indexes up to 1000; the header
              // sits at 60, so without a context here the map scrolls over the
              // navigation. Confining it costs nothing — nothing inside the map
              // needs to paint above the page.
              style={css(
                'position:relative;z-index:0;width:100%;height:clamp(300px,52vw,520px);background:#e8e1d6;border:1px solid rgba(31,28,24,.14)'
              )}
            />
            <p style={css("margin:10px 0 0;font:300 12px/1.6 'Jost',sans-serif;color:#a89d8f")}>
              Map data © OpenStreetMap contributors. Pin is approximate — tap through for turn-by-turn directions.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
