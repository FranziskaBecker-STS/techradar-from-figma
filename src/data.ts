import { screenshotArticles, type ArticleParagraph } from './screenshotArticles.ts';

export const categories = ['Techniques', 'Languages & Frameworks', 'Tools', 'Platforms'] as const;
export type Category = typeof categories[number];
export type QuadrantKey = 'techniques' | 'platforms' | 'tools' | 'languages-frameworks';
export const quadrantPages: Record<QuadrantKey, { category: Category; description: string; links: QuadrantKey[] }> = {
  techniques: { category: 'Techniques', description: 'Arbeitsweisen, Methoden und Best Practices.', links: ['tools', 'platforms', 'languages-frameworks'] },
  platforms: { category: 'Platforms', description: 'Infrastruktur und Umgebungen, auf denen Software läuft', links: ['tools', 'techniques', 'languages-frameworks'] },
  tools: { category: 'Tools', description: 'Konkrete Tools mit denen wir arbeiten.', links: ['platforms', 'techniques', 'languages-frameworks'] },
  'languages-frameworks': { category: 'Languages & Frameworks', description: 'Programmiersprachen und ihre Frameworks.', links: ['tools', 'techniques', 'platforms'] },
};
export const categoryPaths: Record<Category, string> = Object.fromEntries(
  Object.entries(quadrantPages).map(([key, page]) => [page.category, `/${key}`]),
) as Record<Category, string>;
export const rings = ['Adopt', 'Trial', 'Assess', 'Hold'] as const;
export type Ring = typeof rings[number];
export type Technology = { id: string; name: string; category: Category; ring: Ring; tags: string[]; topic: string; detail?: string };

// EXAMPLE DATA: names and texts from the Figma mockups; tags and topics are
// illustrative. No live SYZYGY technology assessment is implied.
const techniqueGroups: Record<Ring, string[]> = {
  Adopt: ['Automated Security Testing', 'CiCD', 'DevOps', 'IDaaS', 'Microservices', 'RDBMS', 'Serverless', 'Smart & Security Testing'],
  Trial: ['API-Gateway', 'DevSecOps', 'Game Days', 'Lambda Step Functions', 'Microfrontend', 'Monorepo', 'Shift Left'],
  Assess: ['Chaos Engineering', 'MACH', 'RAG'], Hold: [],
};
export const technologies: Technology[] = rings.flatMap(ring => techniqueGroups[ring].map(name => ({
  id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), name, category: 'Techniques' as Category, ring,
  tags: name === 'Microfrontend' ? ['React', 'Frontend'] : [name],
  topic: ['Microfrontend', 'Monorepo'].includes(name) ? 'Frontend & UX & Design' : 'DevOps & Security',
  detail: name === 'DevOps' ? '/techniques/devops' : undefined,
})));
technologies.push(
  { id:'react', name:'React', category:'Languages & Frameworks', ring:'Adopt', tags:['React','Frontend'], topic:'Frontend & UX & Design' },
  { id:'next-js', name:'Next.js', category:'Languages & Frameworks', ring:'Trial', tags:['React','Frontend'], topic:'Frontend & UX & Design' },
  { id:'gatsby', name:'Gatsby', category:'Languages & Frameworks', ring:'Assess', tags:['React','Frontend'], topic:'Frontend & UX & Design' },
  { id:'react-native', name:'React Native', category:'Languages & Frameworks', ring:'Trial', tags:['React','Mobile'], topic:'Frontend & UX & Design' },
  { id:'aws', name:'AWS', category:'Platforms', ring:'Adopt', tags:['Amazon','Cloud'], topic:'Cloud' },
  { id:'abstract', name:'Abstract', category:'Tools', ring:'Assess', tags:['Design'], topic:'Frontend & UX & Design' },
  { id:'adyen', name:'Adyen', category:'Platforms', ring:'Adopt', tags:['Payment'], topic:'Commerce' },
);
export const topics = ['Alle', 'Backend', 'Cloud', 'Commerce', 'CRM', 'CX Platforms', 'DevOps & Security', 'Digital Workplace', 'Frontend & UX & Design', 'Hosting & Operation'];
export const ringDescriptions: Record<Ring,string> = {
  Adopt:'Diese Technologien werden aktiv und produktiv eingesetzt.',
  Trial:'Diese Technologien sind vielversprechend und werden praktisch getestet.',
  Assess:'Diese Technologien beobachten und evaluieren wir.', Hold:'Diese Technologien werden zurückgestellt.',
};
export const devopsParagraphs = [
  'Wir nutzen den Begriff "DevOps" auch zweckfremd. Je nach Perspektive beschreiben wir damit ein Betriebsmodell, technisches Gebiet, eine Rolle.',
  'DevOps ist ein sehr erfolgreiches Betriebsmodell, bei dem im Sinne von "you build it, you run it" Entwicklung und Betrieb in einem selbstverwalteten Team ganzheitlich übernommen werden. Bei unseren großen Digitalisierungsprojekten ist ein klarer Trend in diese Richtung erkennbar, da auch unsere Kunden die strikte organisatorische Trennung von Entwicklung und IT stetig aufweichen.',
  'DevOps als Rolle oder technische Disziplin: Während wir früher Entwickler-Teams und unsere IT hatten, ergänzen wir diese mittlerweile durch dezidierte DevOps-Spezialisten: Das sind Kollegen, die für Schnittstellenaufgaben zwischen Entwicklung und Infrastruktur Verantwortung übernehmen. Das ist vor allem alles rund um CI/CD, Security, Konfigurationsmanagement und Bereitstellung von Runtime-Umgebungen im Sinne von Infrastructure as Code.',
];

export type TechnologyArticle = Technology & {
  detail: string;
  headline: string;
  teaser: string;
  paragraphs: ArticleParagraph[];
  relatedNames: string[];
  sourceScreenshot?: string;
};
export const technologyArticles: TechnologyArticle[] = [
  {
    ...technologies.find(item => item.id === 'devops')!,
    detail: '/techniques/devops',
    headline: 'DevOps ist unser Operations-Modell in agilen Kunden\u00adumfeldern',
    teaser: 'DevOps ist nicht mehr wegzudenken und wird seit Jahren immer wichtiger.',
    paragraphs: devopsParagraphs.map(text => ({ text })),
    relatedNames: technologies.filter(item => item.category === 'Techniques' && item.ring === 'Trial').map(item => item.name),
  },
  ...screenshotArticles.map(article => ({ ...article, detail: `${categoryPaths[article.category]}/${article.id}` })),
];
technologies.push(...technologyArticles.filter(article => article.id !== 'devops'));

export function relatedTopics(article: TechnologyArticle) {
  return article.relatedNames.map(name => ({
    name,
    detail: technologies.find(item => item.name.toLocaleLowerCase('de') === name.toLocaleLowerCase('de'))?.detail,
  }));
}

// Preserve the original Figma example cards and append the newly supplied
// articles in their matching category. Unknown related topics are not ratings.
export const quadrantPageExamples = Object.fromEntries(Object.values(quadrantPages).map(({category}) => [
  category, category === 'Techniques' ? technologies.filter(t => t.category === category)
    : [
      ...rings.flatMap(ring => techniqueGroups[ring].map(name => ({
        id: `${categoryPaths[category].slice(1)}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        name, category, ring, tags: [], topic: 'Alle',
      }))),
      ...technologies.filter(item => item.category === category && item.detail),
    ],
])) as Record<Category, Technology[]>;
export const explanationParagraphs = [
  'Im Rahmen von Technology- und Trend-Scouting beschäftigen wir uns bei SYZYGY Techsolutions täglich mit der Frage, welche Technologien für uns und unsere Kunden aktuell richtig sind und in Zukunft relevant sein werden. Wir identifizieren, selektieren und bewerten Themen nach Relevanz und Reifegrad für unsere Anwendungsfelder, um daran unsere Strategie auszurichten. Unser zentrales Tool hierfür ist das TechRadar. Es stellt Datenbasis, Kollaborations-Plattform und Visualisierung bereit.',
  'Das Radar verschafft einen komprimierten Überblick über aktuelle und aufkommende Technologien. Durch die kontinuierliche Betrachtung und Bewertung von Trends ist es für uns innovationstreibend und drückt unsere Haltung zum jeweiligen Thema aus. Es adressiert Kunden, Partner, Mitarbeiter und Bewerber.',
  'Das TechRadar reflektiert immer die Momentaufnahme unseres Technologie-Universums - es ist nie vollständig und stets subjektiv. Es stößt - zuweilen heiße - Diskussionen an und entwickelt sich weiter. Diskutieren Sie gerne mit: technology@syzygy.de',
];
export const explanationRings: Record<Ring,string> = {
  Adopt:'Technologien, die wir bereits erfolgreich in Projekten eingesetzt und dabei positive Erfahrungen gesammelt haben. Die Technologie ist belastbar und bringt einen Mehrwert. Wir bewerten, ob Sie es "ADOPT" schafft.',
  Trial:'Vielversprechende neue oder bei uns noch nicht in der Breite eingesetzte Technologien, die wir in ersten Projekten verwendet haben oder bei denen wir in Research und Prototypen investieren. Eine finale Meinung steht aus.',
  Assess:'Technologien, die wir für neue Projekte nicht nutzen würden. Dies können bekannte Technologien sein, die nicht mehr passen, oder Neue, die (noch) nicht passen. Das bedeutet nicht, daß Sie nicht weiter in bestehenden Projekten genutzt werden.',
  Hold:'Technologien, die wir für neue Projekte nicht nutzen würden. Dies können bekannte Technologien sein, die nicht mehr passen, oder Neue, die (noch) nicht passen. Das bedeutet nicht, daß Sie nicht weiter in bestehenden Projekten genutzt werden.',
};
