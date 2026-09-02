"use client";

import dynamic from "next/dynamic";
import type { MapJob } from "./job-map";

const JobMap = dynamic(() => import("./job-map"), { ssr: false });

export function JobMapLoader({ jobs }: { jobs: MapJob[] }) {
  return <JobMap jobs={jobs} />;
}
