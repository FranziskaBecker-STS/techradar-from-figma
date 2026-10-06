import { type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { technologyArticles } from '../data';
import { FullRadar } from './FigmaIllustrations';
import { FigmaAsset, ScaledArtwork } from './Common';
import './radar.css';
import { useRadarHover } from './useRadarHover';
import { RadarTooltip } from './RadarTooltip';
import { currentRadarLogos } from './currentRadarLogos';
import { radarLogos as logos, radarConnections as connections } from './radarLogos';

function RadarSymbol({ symbol, className, style }: { symbol: string; className?: string; style?: CSSProperties }) {
  return <svg className={`radar-symbol${className ? ` ${className}` : ''}`} viewBox="0 0 50 50" aria-hidden="true" focusable="false" style={style}>
    <use href={`/assets/current-techradar-logos.svg#${symbol}`} />
  </svg>;
}
export function InteractiveRadar({ filtered }: { filtered: boolean }) {
  const { active, hover } = useRadarHover();
  const highlighted = active ? [active, ...connections[active]] : [];
  const selected = logos.find(logo => logo.id === active);
  const activeX = selected && (selected.activeX ?? selected.x - 5);
  const activeY = selected && (selected.activeY ?? selected.y - 5);

  return <div className="radar-stage">
    <ScaledArtwork width={661} height={677}>
      <div className="radar-native" data-active-logo={active || ''} onKeyDown={event => {
        if (event.key === 'Escape') hover.dismiss();
      }}>
        <div aria-hidden="true" className="radar-graphic"><FullRadar highlightedLogos={highlighted} />
          {currentRadarLogos.map(logo => <RadarSymbol key={logo.id} symbol={logo.symbol} className="radar-imported-base"
            style={{ left: logo.x, top: logo.y, opacity: highlighted.includes(logo.id) ? 0 : 1 }} />)}
        </div>
        {!filtered && logos.map(logo => {
          const isActive = active === logo.id;
          const isHighlighted = highlighted.includes(logo.id);
          const activeAsset = logo.activeAsset ?? logo.asset;
          const hasActiveAsset = activeAsset !== logo.asset;
          const assetStyle: CSSProperties = logo.inset !== undefined
            ? { position: 'absolute', inset: '18%', width: '64%', height: '64%' }
            : { position: 'absolute', inset: 0, width: '100%', height: '100%' };
          // Keep the target stationary while its artwork grows to the 40 px Figma state.
          const detail = technologyArticles.find(article => article.id === logo.id)?.detail;
          const props = { className: 'radar-logo', tabIndex: -1,
            'data-logo': logo.id, 'data-highlighted': isHighlighted, 'data-active': isActive,
            style: { left: logo.x - 5, top: logo.y - 5,
              '--radar-active-x': `${logo.activeX === undefined ? 0 : logo.activeX - logo.x + 5}px`,
              '--radar-active-y': `${logo.activeY === undefined ? 0 : logo.activeY - logo.y + 5}px`,
            } as CSSProperties,
            'aria-label': `${logo.name} im Radar`, 'aria-describedby': isActive ? 'radar-tooltip' : undefined,
            onMouseEnter: () => hover.enter(logo.id), onMouseLeave: () => hover.leave(),
            onFocus: () => hover.enter(logo.id, true), onBlur: () => hover.leave(true),
          };
          const artwork = <span className="radar-highlight" aria-hidden="true">
              {logo.symbol ? <RadarSymbol symbol={logo.symbol} /> : <>
                <FigmaAsset className={hasActiveAsset ? 'radar-asset-connected' : undefined}
                  src={`/assets/${logo.asset}.svg`} style={assetStyle} />
                {hasActiveAsset && <FigmaAsset className="radar-asset-active"
                  src={`/assets/${activeAsset}.svg`} style={assetStyle} />}
              </>}
            </span>;
          return detail ? <Link key={logo.id} to={detail} {...props}>{artwork}</Link>
            : <button key={logo.id} type="button" {...props} onClick={() => hover.enter(logo.id, true)}>{artwork}</button>;
        })}
        {selected && <RadarTooltip id="radar-tooltip" label={selected.name}
          left={activeX! + 20} top={activeY! - (active === 'aws' ? 39 : 37)}
          width={active === 'abstract' ? 83 : active === 'aws' || active === 'adyen' ? 61.815 : undefined}
          asset={active === 'abstract' ? '406a6' : active === 'aws' || active === 'adyen' ? '01386' : undefined} />}
      </div>
    </ScaledArtwork>
    {filtered && <p className="radar-filter-note">Statische Radarpositionen. Die gefilterten Suchtreffer findest du in der Listenansicht.</p>}
  </div>;
}
