import { FigmaAsset } from './FigmaAsset';

export function RadarTooltip({ id, label, left, top, width, asset, scale = 1, side = 'above' }: {
  id: string; label: string; left: number; top: number; width?: number; asset?: string; scale?: number; side?: 'above' | 'below';
}) {
  return <div id={id} role="tooltip" className="radar-tooltip" data-original={!!asset} data-side={side}
    style={{ left, top, width, transform: `translateX(-50%) scale(${scale})`, transformOrigin: 'center top' }}>
    {asset && <FigmaAsset src={`/assets/${asset}.svg`}
      style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: 32.068 }} />}
    <span>{label}</span>
  </div>;
}
