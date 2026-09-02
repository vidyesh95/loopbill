"use client";

import { useEffect } from "react";
import Link from "next/link";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export type MapJob = {
  id: number;
  customer: string;
  address: string;
  location: string;
  lat: string | null;
  lng: string | null;
};

function coords(job: MapJob) {
  const lat = Number(job.lat);
  const lng = Number(job.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }
  return [lat, lng] as [number, number];
}

function FitBounds({ points }: { points: Array<[number, number]> }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) {
      return;
    }
    if (points.length === 1) {
      map.setView(points[0], 13);
      return;
    }
    map.fitBounds(points, { padding: [32, 32] });
  }, [map, points]);
  return null;
}

export default function JobMap({ jobs }: { jobs: MapJob[] }) {
  const located = jobs
    .map((job) => ({ job, point: coords(job) }))
    .filter((item): item is { job: MapJob; point: [number, number] } => Boolean(item.point));
  const points = located.map((item) => item.point);
  const center = points[0] ?? [19.076, 72.8777];

  return (
    <MapContainer center={center} zoom={11} className="h-[480px] w-full rounded-md border">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds points={points} />
      {located.map(({ job, point }) => (
        <Marker key={job.id} position={point} icon={icon}>
          <Popup>
            <p className="font-medium">
              #{job.id} {job.customer}
            </p>
            <p>{job.address || job.location}</p>
            <Link href={`/agent/jobs/${job.id}`}>Open job</Link>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
