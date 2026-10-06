import { useEffect, useMemo, useSyncExternalStore } from 'react';
import { RadarHover } from './radarHover';

export function useRadarHover(key?: string) {
  const hover = useMemo(() => new RadarHover(), [key]);
  const active = useSyncExternalStore(hover.subscribe, hover.snapshot, hover.snapshot);
  useEffect(() => hover.dispose, [hover]);
  return { active, hover };
}
