import { useEffect, useRef } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { Hero, Brand, Breadcrumbs, DemoNote, ScaledArtwork, TechnologyGroups } from './components/Common';
import HomeContent from './components/HomeContent';
import { RingDiagram } from './components/FigmaIllustrations';
import { TechnologyDetail } from './components/TechnologyDetail';
import { explanationParagraphs, explanationRings, quadrantPages, quadrantPageExamples, rings, technologyArticles, type QuadrantKey } from './data';

function QuadrantPage({ quadrant }: { quadrant: QuadrantKey }) {
  const category = quadrantPages[quadrant].category;
  return <><Hero page={quadrant}/><main className="container techniques-content" id="content" tabIndex={-1}><h2>Alles in {category}</h2><TechnologyGroups items={quadrantPageExamples[category]}/></main></>;
}
function Explanation() {
  return <div className="explanation-page"><header className="explanation-header"><Brand dark/></header><main className="container" id="content" tabIndex={-1}><div className="explanation-breadcrumb"><Breadcrumbs dark/></div><article className="reading-column"><section className="explanation-section"><h1>Das Techradar</h1><div className="prose">{explanationParagraphs.map(p=><p key={p}>{p}</p>)}</div></section><section className="explanation-section"><h2>Quadranten</h2><p>Das TechRadar ist eine Liste von Technologien, die in "Quadranten" eingeteilt und in "Ringen" bewertet werden.</p></section><section className="explanation-section"><h3>Ringe</h3><ScaledArtwork width={339} height={358}><RingDiagram/></ScaledArtwork><div className="ring-explanations">{rings.map(ring=><section key={ring}><h4>{ring}</h4><p>{explanationRings[ring]}</p></section>)}</div></section><section className="explanation-section credits"><h2>Credits</h2><p>Inspiriert wurde unser TechRadar von den Kollegen von Thoughtworks, mit denen wir in verschiedenen Projekten zusammengearbeitet haben.</p></section></article></main></div>;
}
export default function App() {
  const {pathname}=useLocation();const previousPath=useRef(pathname);
  useEffect(()=>{
    const quadrant = quadrantPages[pathname.slice(1) as QuadrantKey];
    const article = technologyArticles.find(item => item.detail === pathname);
    document.title=`${article?.name || quadrant?.category || (pathname==='/techradar'?'Das Techradar':'Techradar')} · SYZYGY Techsolutions`;
    window.scrollTo(0,0);
    const heading=document.querySelector<HTMLHeadingElement>('h1');heading?.setAttribute('tabindex','-1');
    if(previousPath.current!==pathname)heading?.focus({preventScroll:true});
    previousPath.current=pathname;
  },[pathname]);
  return <><a className="skip-link" href="#content">Zum Inhalt springen</a><Routes><Route path="/" element={<><Hero page="home"/><HomeContent/></>}/>{(Object.keys(quadrantPages) as QuadrantKey[]).map(quadrant => <Route key={quadrant} path={`/${quadrant}`} element={<QuadrantPage quadrant={quadrant}/>}/>)}{technologyArticles.map(article => <Route key={article.id} path={article.detail} element={<TechnologyDetail key={article.id} article={article}/>}/>)}<Route path="/techradar" element={<Explanation/>}/><Route path="*" element={<><Hero page="home"/><main className="container fallback"><Link to="/">Zur Homepage</Link></main></>}/></Routes><DemoNote/></>;
}
