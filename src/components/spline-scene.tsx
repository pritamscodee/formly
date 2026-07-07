"use client";

import dynamic from "next/dynamic";
import { ErrorBoundary } from "react-error-boundary";

const Spline = dynamic(
  () => import("@splinetool/react-spline").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-12 w-12 animate-pulse rounded-full bg-purple-200" />
      </div>
    ),
  }
);

interface SplineSceneProps {
  scene: string;
  className?: string;
}

function SplineInner({ scene }: { scene: string }) {
  return <Spline scene={scene} />;
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <div className={className}>
      <ErrorBoundary fallback={null}>
        <SplineInner scene={scene} />
      </ErrorBoundary>
    </div>
  );
}
