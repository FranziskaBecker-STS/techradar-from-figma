import { Hero, TechnologyCard } from './Common';
import { TechnologySelect } from './TechnologySelect';
import { relatedTopics, technologies, type TechnologyArticle } from '../data';
import type { ArticleParagraph } from '../screenshotArticles';

function Paragraph({ paragraph }: { paragraph: ArticleParagraph }) {
  const { text, strong = [] } = paragraph;
  if (!strong.length) return <p>{text}</p>;
  const pattern = new RegExp(`(${strong.map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g');
  return <p>{text.split(pattern).map((part, index) => strong.includes(part) ? <strong key={index}>{part}</strong> : part)}</p>;
}

export function TechnologyDetail({ article }: { article: TechnologyArticle }) {
  return <><Hero page="detail" article={article}/><main className="container detail-content" id="content" tabIndex={-1}>
    <article className="reading-column">
      <TechnologySelect key={article.id} items={technologies.filter(item => item.category === article.category)} currentId={article.id} label={`${article.category} durchsuchen`} />
      <div className="prose">{article.paragraphs.map((paragraph, index) => <Paragraph key={index} paragraph={paragraph}/>)}</div>
      <section className="related"><h2>Siehe auch / verwandte Themen:</h2><div className="card-grid">
        {relatedTopics(article).map(item => <TechnologyCard item={item} key={item.name}/>)}
      </div></section>
    </article>
  </main></>;
}
