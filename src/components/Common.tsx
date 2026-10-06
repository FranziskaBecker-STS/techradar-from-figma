import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { FigmaAsset } from './FigmaAsset';
import { HeroQuadrant } from './HeroQuadrant';
import { categoryPaths, quadrantPages, rings, ringDescriptions, technologyArticles, type Category, type QuadrantKey, type Technology, type TechnologyArticle } from '../data';

export function Arrow({ white = false }: { white?: boolean }) {
  return <span className="arrow" aria-hidden="true"><img src={`/assets/${white ? '6ace2' : '88924'}.svg`} alt="" /></span>;
}
export function TextLink({ to, children, white = false }: { to?: string; children: ReactNode; white?: boolean }) {
  const contents = <><Arrow white={white} /><span>{children}</span></>;
  return to ? <Link className="text-link" to={to}>{contents}</Link> : <span className="text-link unavailable" title="Dieses Ziel ist noch nicht Teil der Vorschau">{contents}</span>;
}
export function Brand({ dark = false }: { dark?: boolean }) {
  return <Link to="/" className="brand" aria-label="Techradar – zur Homepage">{dark
    ? <FigmaAsset className="brand-image brand-image-dark" src="/assets/46d60.png" alt="SYZYGY Techsolutions" />
    : <FigmaAsset className="brand-image brand-image-white" src="/assets/c929c.svg" alt="SYZYGY Techsolutions" />}</Link>;
}
export function Breadcrumbs({ detail = false, detailName = 'DevOps', dark = false, category = 'Techniques' }: { detail?: boolean; detailName?: string; dark?: boolean; category?: Category }) {
  return <nav aria-label="Brotkrümelnavigation" className={`breadcrumbs ${dark ? 'dark' : ''}`}><Link to="/">Techradar</Link><span aria-hidden="true"> / </span>{detail ? <Link to={categoryPaths[category]}>{category}</Link> : <span aria-current="page">{category}</span>}{detail && <><span aria-hidden="true"> / </span><span aria-current="page">{detailName}</span></>}</nav>;
}
type HeroProps = { page: 'home' | QuadrantKey; article?: never } | { page: 'detail'; article: TechnologyArticle };
export function Hero({ page, article }: HeroProps) {
  const home = page === 'home';
  const quadrant: QuadrantKey = home ? 'techniques' : page === 'detail' ? categoryPaths[article.category].slice(1) as QuadrantKey : page;
  const config = quadrantPages[quadrant];
  const categoryPage = !home && page !== 'detail';
  const staticDesktopArt = home || page === 'detail';
  return <header className={`hero hero-${page}${categoryPage ? ' hero-quadrant-page' : ''}`}>
    <div className="hero-container container">
      <div className="brand-row"><Brand /><button className="mobile-menu" disabled aria-label="Menü – noch nicht Teil der Vorschau" title="Menüinhalt noch nicht festgelegt"><img src="/assets/86f52.svg" alt="" /></button></div>
      {!home && <div className="hero-breadcrumb"><Breadcrumbs detail={page === 'detail'} detailName={article?.name} category={config.category} /></div>}
      <div className="hero-art-region" aria-hidden="true">
        <div className="hero-art hero-art-mobile hero-art-mobile-static">
          <img src="/assets/b4102.svg" alt="" />
        </div>
      </div>
      <div className="hero-copy">
        {home ? <><h1>Technologie komprimiert:<span>Updates, Trends,<br className="desktop-break" /> Entwicklungen</span></h1><img className="brand-slash" src="/assets/2d579.svg" alt="" /></>
          : categoryPage ? <><h1>{config.category}</h1><p>{config.description}</p><nav className="category-jumps" aria-label="Andere Quadranten">{config.links.map(key => <TextLink key={key} white to={categoryPaths[quadrantPages[key].category]}>Zu {quadrantPages[key].category}</TextLink>)}</nav></>
          : <><h1>{article?.headline}</h1><p>{article?.teaser}</p></>}
      </div>
      <a className="scroll-cue" href="#content" aria-label="Zum Inhalt"><span><img src="/assets/eb7c8.png" alt="" /></span></a>
    </div>
    <div className={`hero-art hero-art-desktop${staticDesktopArt ? '' : ' hero-quadrant-desktop'}`} aria-hidden={staticDesktopArt || undefined}>
      {staticDesktopArt ? <img src="/assets/7b448.svg" alt="" /> : <HeroQuadrant quadrant={quadrant} />}
    </div>
  </header>;
}
export function TechnologyCard({ item, showCategory = false }: { item: Pick<Technology, 'name' | 'detail'> & Partial<Pick<Technology, 'category'>>; showCategory?: boolean }) {
  const content = <><Arrow /><span className="card-text">{item.name === 'Smart & Security Testing' ? <>Smart &amp;<br className="desktop-card-break"/> Security Testing</> : item.name}{showCategory && <small>{item.category}</small>}</span></>;
  return item.detail ? <Link className="technology-card" to={item.detail}>{content}</Link> : <div className="technology-card unavailable" role="link" aria-disabled="true" tabIndex={0} title="Detailseite noch nicht verfügbar">{content}</div>;
}
export function TechnologyGroups({ items, compact = false, showCategory = false, headingLevel = 3 }: { items: Technology[]; compact?: boolean; showCategory?: boolean; headingLevel?: 3 | 4 }) {
  const RingHeading = headingLevel === 4 ? 'h4' : 'h3';
  return <div className={compact ? 'technology-groups compact' : 'technology-groups'}>{rings.map(ring => {
    const entries = items.filter(t => t.ring === ring);
    if (compact && !entries.length) return null;
    return <section className="ring-group" key={ring} aria-label={ring}><RingHeading className="ring-title">{ring}</RingHeading>{!compact && <p>{ringDescriptions[ring]}</p>}
      {entries.length ? <div className="card-grid">{entries.map(item => <TechnologyCard item={item} key={item.id} showCategory={showCategory} />)}</div> : <p className="empty-ring">Aktuell keine Einträge vorhanden.</p>}
    </section>;
  })}</div>;
}
export function ScaledArtwork({ width, height, children }: { width: number; height: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null); const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = ref.current!; const observer = new ResizeObserver(() => setScale(Math.min(1, el.clientWidth / width)));
    observer.observe(el); return () => observer.disconnect();
  }, [width]);
  return <div ref={ref} className="scaled-artwork" style={{ width: '100%', maxWidth: width, height: height * scale }}><div style={{ width, height, transform: `scale(${scale})`, transformOrigin: '0 0' }}>{children}</div></div>;
}
export function DemoNote() {
  return <footer className="demo-note container"><p><strong>Vorschau mit Beispieldaten.</strong> Artikeltexte ergänzend aus bereitgestellten Screenshots. Keine aktuelle Technologie-Bewertung. Detailseiten sind für {technologyArticles.length} ausgewählte Themen verfügbar; weitere Einträge und Menüzielseiten folgen nach Abstimmung.</p></footer>;
}

export { FigmaAsset };
