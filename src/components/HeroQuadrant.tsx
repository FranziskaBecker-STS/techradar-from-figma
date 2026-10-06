import { useId, useLayoutEffect, useRef, useState } from 'react';
import { TechniqueRadar } from './FigmaIllustrations';
import { FigmaAsset } from './FigmaAsset';
import { RadarTooltip } from './RadarTooltip';
import { useRadarHover } from './useRadarHover';
import { quadrantPages, type QuadrantKey } from '../data';
import { categoryQuadrantAssets } from './categoryQuadrantAssets';
import './radar.css';
import './heroQuadrant.css';

const techniqueWidth = 649.0112915039062;
const techniqueHeight = 673.9732055664062;
const logoSize = 57.6761360168457;
// The desktop instance scales the 34.82955 px logos of component 304:3046.
const tooltipScale = logoSize / 34.829551696777344;
const techniqueSourceLogos = [
  { id: 'alpine-lower', name: 'Alpine.js', position: 'unteres Logo', x: 440.625488, y: 525.734436, asset: '124ec', inset: true },
  { id: 'alpine-upper', name: 'Alpine.js', position: 'oberes Logo', x: 475.230957, y: 150.840332, asset: '5bbe9', inset: true },
  { id: 'kafka', name: 'Apache Kafka', position: 'Logo', x: 363.724121, y: 333.480438, asset: '03cdc', inset: false },
  { id: 'abstract-inner', name: 'Abstract', position: 'inneres Logo', x: 140.709473, y: 458.446747, asset: '8de6b', inset: false },
  { id: 'abstract-outer', name: 'Abstract', position: 'äußeres Logo', x: 259.907227, y: 154.684326, asset: '8659a', inset: false },
] as const;
type QuadrantLogo = {
  id: string; name: string; position?: string; x: number; y: number; width: number; height: number;
  asset: string; inset?: boolean; assetWidth?: number; assetHeight?: number; assetLeft?: number; assetTop?: number;
};
const techniqueLogos: readonly QuadrantLogo[] = techniqueSourceLogos.map(logo => ({
  ...logo, width: logoSize, height: logoSize, asset: `${logo.asset}.svg`,
}));

export function HeroQuadrant({ quadrant = 'techniques' }: { quadrant?: QuadrantKey }) {
  const artwork = quadrant === 'techniques' ? undefined : categoryQuadrantAssets[quadrant];
  const width = artwork?.width ?? techniqueWidth;
  const height = artwork?.height ?? techniqueHeight;
  const logos: readonly QuadrantLogo[] = artwork?.logos ?? techniqueLogos;
  const category = quadrantPages[quadrant].category;
  const region = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const { active, hover } = useRadarHover(quadrant);
  const tooltipId = useId();
  const selected = logos.find(logo => logo.id === active);
  useLayoutEffect(() => {
    const element = region.current!;
    const measure = () => setScale(Math.max(0, Math.min(1, element.clientWidth / width, element.clientHeight / height)));
    const observer = new ResizeObserver(measure);
    observer.observe(element); measure();
    return () => observer.disconnect();
  }, [width, height]);
  const tooltipBelow = !!selected && selected.y < 33.2607421875 * tooltipScale;

  return <div ref={region} className="hero-quadrant" role="group" aria-label={`${category}-Radar`}
    onKeyDown={event => { if (event.key === 'Escape') hover.dismiss(); }}>
    <div className="hero-quadrant-native" data-quadrant={quadrant} data-active-logo={active || ''}
      style={{ width, height, transform: `scale(${scale})` }}>
      <div aria-hidden="true">{artwork
        ? <FigmaAsset src={`/assets/${artwork.asset}`} style={{ position: 'absolute', left: 0, top: 0, width, height }} />
        : <TechniqueRadar highlightedLogo={active} />}</div>
      {logos.map((logo, index) => <button key={logo.id} type="button" tabIndex={-1} className="hero-quadrant-logo"
        data-logo={logo.id} data-active={active === logo.id}
        style={{ left: logo.x, top: logo.y, width: logo.width, height: logo.height,
          clipPath: logo.x < 0 || logo.y < 0 || logo.x + logo.width > width || logo.y + logo.height > height
            ? `inset(${Math.max(0, -logo.y)}px ${Math.max(0, logo.x + logo.width - width)}px ${Math.max(0, logo.y + logo.height - height)}px ${Math.max(0, -logo.x)}px)` : undefined,
        }}
        aria-label={`${logo.name}, ${logo.position ?? `Logo ${index + 1}`} im ${category}-Radar`}
        aria-describedby={active === logo.id ? tooltipId : undefined}
        onMouseEnter={() => hover.enter(logo.id)} onMouseLeave={() => hover.leave()}
        onFocus={() => hover.enter(logo.id, true)} onBlur={() => hover.leave(true)}
        onClick={() => hover.enter(logo.id, true)}>
        <span className="hero-quadrant-highlight" aria-hidden="true">
          <FigmaAsset src={`/assets/${logo.asset}`}
            style={logo.inset
              ? { position: 'absolute', inset: '18%', width: '64%', height: '64%' }
              : { position: 'absolute', left: logo.assetLeft ?? 0, top: logo.assetTop ?? 0, width: logo.assetWidth ?? logo.width, height: logo.assetHeight ?? logo.height }} />
        </span>
      </button>)}
      {selected && <RadarTooltip id={tooltipId} label={selected.name}
        left={selected.x + selected.width / 2}
        top={tooltipBelow ? selected.y + selected.height + 8 : selected.y - 33.2607421875 * tooltipScale}
        side={tooltipBelow ? 'below' : 'above'} scale={tooltipScale} />}
    </div>
  </div>;
}
