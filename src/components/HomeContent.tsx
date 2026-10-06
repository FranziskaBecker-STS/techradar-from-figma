import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { categories, categoryPaths, topics, technologies, type Category } from '../data';
import { TextLink, TechnologyGroups } from './Common';
import { InteractiveRadar } from './InteractiveRadar';
import { TopicSelect } from './TopicSelect';

const descriptions: Record<Category,{desktop:string; mobile:string}> = {
  Techniques:{ desktop:'Arbeitsweisen, Methoden und Best Practices.', mobile:'Generelle Themen rund um den Software Entwicklungsprozess, z.B. Agile Methoden, Architekturansätze etc.' },
  'Languages & Frameworks':{desktop:'Programmiersprachen und ihre Frameworks.', mobile:'Sprachen, Frameworks und Libraries, die zur Umsetzung von Anforderungen eingesetzt werden.'},
  Tools:{desktop:'Konkrete Tools mit denen wir arbeiten.', mobile:'Unterstützende Software, die wir zur Umsetzung von Anforderungen zur Hilfe nehmen.'},
  Platforms:{desktop:'Infrastruktur und Umgebungen, auf denen Software läuft.', mobile:'Umgebungen, auf oder in denen Software läuft, Services-Provider, Datenbanken oder Management Systeme.'},
};
function CategoryTeaser({ category }: { category: Category }) {
  return <section className={`category-teaser category-${categories.indexOf(category)}`}><h3>{category}</h3><p className="teaser-desktop">{descriptions[category].desktop}</p><p className="teaser-mobile">{descriptions[category].mobile}</p><TextLink to={categoryPaths[category]}><span className="teaser-desktop">Alle ansehen</span><span className="teaser-mobile">Zu {category}</span></TextLink></section>;
}
function CategoryCount({ count }: { count: number }) {
  return <span className="category-count" data-empty={count === 0}>{count}</span>;
}
export default function HomeContent() {
  const [params,setParams]=useSearchParams();
  const query=params.get('q')||'';const view=params.get('view')==='list'?'list':'radar';
  const [draftQuery,setDraftQuery]=useState(query);
  useEffect(()=>setDraftQuery(query),[query]);
  const topic=topics.includes(params.get('topic')||'')?params.get('topic')!:'Alle';
  const category=categories.includes(params.get('category') as Category)?params.get('category') as Category:'Techniques';
  const input=useRef<HTMLInputElement>(null);
  const set=(key:string,value:string)=>{setParams(previous=>{const next=new URLSearchParams(previous);value?next.set(key,value):next.delete(key);return next;},{replace:true});};
  const results=useMemo(()=>technologies.filter(t=>(topic==='Alle'||t.topic===topic)&&(!query||[t.name,...t.tags].join(' ').toLocaleLowerCase('de').includes(query.trim().toLocaleLowerCase('de')))),[query,topic]);
  const filtered=Boolean(query.trim())||topic!=='Alle';
  const allCategories=filtered&&(params.get('category')==='all'||!params.has('category'));
  const displayedItems=results.filter(t=>allCategories||t.category===category);
  return <main id="content" className="home-content container" tabIndex={-1}>
    <section className="intro"><h2>Unser TechRadar</h2><p>Das TechRadar ist ein strategisches Tool, mit dem wir Technologien und Trends nach Relevanz und Reifegrad bewerten und daraus Handlungsempfehlungen für uns und unsere Kunden ableiten.</p><TextLink to="/techradar">Weitere Details zum Techradar</TextLink></section>
    <div className="desktop-home-content">
      <form className="search-toolbar" role="search" onSubmit={e=>{e.preventDefault();const submitted=draftQuery.trim();setDraftQuery(submitted);set('q',submitted);}}>
        <div className="search-field"><label htmlFor="keyword">Schlagwortsuche</label><div className="search-input"><input id="keyword" ref={input} type="search" value={draftQuery} onChange={e=>setDraftQuery(e.target.value)} aria-describedby="search-hint search-status" autoComplete="off" enterKeyHint="search" />{(draftQuery||query) && <button className="clear-search" type="button" onClick={()=>{setDraftQuery('');set('q','');input.current?.focus();}} aria-label="Suchbegriff löschen">×</button>}</div><span id="search-hint" className="visually-hidden">Suchbegriff eingeben und mit Enter suchen.</span><p id="search-status" className="search-status" role="status" aria-live="polite">{filtered && <><strong>{results.length} {results.length===1?'Ergebnis':'Ergebnisse'}</strong>{query && <> für „{query}“</>}</>}</p></div>
        <fieldset className="view-field"><legend>Ansicht</legend><div className="view-toggle">{(['radar','list'] as const).map(value=><label key={value} className={view===value?'selected':''}><input type="radio" name="view" checked={view===value} onChange={()=>set('view',value)} value={value} /><span>{value==='radar'?'Radar':'List'}</span></label>)}</div></fieldset>
        <TopicSelect value={topic} onChange={value=>set('topic',value)} />
      </form>
      {view==='radar' ? <div className="radar-overview">{categories.map(c=><CategoryTeaser category={c} key={c}/>)}<InteractiveRadar key={String(filtered)} filtered={filtered}/></div>
        : <div className="list-overview"><div className="category-tabs" role="group" aria-label="Kategorie auswählen">{filtered && <button className={allCategories?'active':''} onClick={()=>set('category','all')} aria-pressed={allCategories}>Alle <CategoryCount count={results.length}/></button>}{categories.map(c=><button key={c} className={!allCategories&&category===c?'active':''} onClick={()=>set('category',c)} aria-pressed={!allCategories&&category===c}>{c}<CategoryCount count={results.filter(t=>t.category===c).length}/></button>)}</div>{!filtered && <div className="list-heading"><h3>{category}</h3><p>{descriptions[category].desktop}</p></div>}{displayedItems.length===0?<p className="no-results">Keine passenden Beispieleinträge gefunden.</p>:<TechnologyGroups items={displayedItems} compact={filtered} showCategory={filtered} headingLevel={filtered?3:4}/>}</div>}
    </div>
    <div className="mobile-category-list">{(['Techniques','Languages & Frameworks','Platforms','Tools'] as Category[]).map(c=><CategoryTeaser category={c} key={c}/>)}</div>
  </main>;
}
