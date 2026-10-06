import type { Technology } from './data';

export type ArticleParagraph = { text: string; strong?: string[] };
export type ScreenshotArticle = Omit<Technology, 'detail'> & {
  headline: string;
  teaser: string;
  paragraphs: ArticleParagraph[];
  relatedNames: string[];
  sourceScreenshot: string;
};

// Article content comes from user-provided Tech Radar screenshots, 06.10.2026.
// Categories and rings were explicitly confirmed by the user on the same date.
export const screenshotArticles: ScreenshotArticle[] = [
  {
    id: 'opentofu', name: 'OpenTofu', category: 'Languages & Frameworks', ring: 'Trial',
    tags: ['OpenTofu', 'Terraform', 'Infrastructure as Code', 'Open Source'], topic: 'Cloud',
    headline: 'OpenTofu: Open-Source-Fork von Terraform',
    teaser: 'Eine Community-getriebene Alternative für Infrastructure-as-Code.',
    paragraphs: [{
      text: 'OpenTofu ist der Open-Source-Fork von Terraform, der entstanden ist, nachdem HashiCorp auf eine kommerzielle Lizenz umgestellt hat. Voll kompatibel mit Terraform, bietet OpenTofu eine Community-getriebene Alternative für Infrastructure-as-Code. Getragen von der Linux Foundation bietet OpenTofu langfristige Stabilität und Transparenz. Wir beobachten die Entwicklung mit Interesse – insbesondere in Projekten, in denen Open-Source-Strategien, offene Standards und Lizenzfreiheit gefragt sind.',
      strong: ['OpenTofu'],
    }],
    relatedNames: ['DevOps', 'CICD', 'Serverless', 'Kubernetes', 'OpenShift', 'Azure', 'AWS', 'AWS ECS', 'Google Cloud', 'Ansible', 'Terraform', 'Trivy'],
    sourceScreenshot: 'content-screenshots/opentofu.png',
  },
  {
    id: 'figma', name: 'Figma', category: 'Languages & Frameworks', ring: 'Adopt',
    tags: ['Figma', 'Design', 'UI', 'UX', 'Dev Mode'], topic: 'Frontend & UX & Design',
    headline: 'Das Design Tool der Wahl',
    teaser: 'Unser Werkzeug für gemeinsames UI/UX-Design.',
    paragraphs: [{
      text: 'Figma ist ein leistungsstarkes Design-Tool, das die Art und Weise, wie Teams an digitalen Projekten zusammenarbeiten, stetig verbessert. Als cloudbasiertes Werkzeug ermöglicht Figma Echtzeit-Kollaboration, bei der mehrere Designer:innen gleichzeitig an einem Projekt arbeiten können, was den kreativen Prozess erheblich beschleunigt. Mit einer intuitiven Benutzeroberfläche, umfangreichen Design- und Prototyping-Funktionen sowie einer nahtlosen Integration in bestehende Workflows bietet Figma eine umfassende Lösung für UI/UX-Design. Auch unseren Entwickler:innen gefällt Figma mit dem neuen Dev Mode sehr gut.',
      strong: ['Figma'],
    }],
    relatedNames: ['Microfrontend', 'TypeScript', 'React', 'StyleX', 'Panda CSS', 'Tailwind CSS', 'Radix UI', 'Storybook', 'sitespeed.io'],
    sourceScreenshot: 'content-screenshots/figma.png',
  },
  {
    id: 'typescript', name: 'TypeScript', category: 'Languages & Frameworks', ring: 'Adopt',
    tags: ['TypeScript', 'JavaScript', 'Typisierung'], topic: 'Frontend & UX & Design',
    headline: 'JavaScript on Steroids',
    teaser: 'TypeScript gibt Sicherheit und eine bessere Dev Experience.',
    paragraphs: [{
      text: 'Mittlerweile ist TypeScript aus unserer Entwicklerwelt nicht mehr wegzudenken. Beliebt wie nie nutzen wir es in immer mehr Projekten. Die von Microsoft entwickelte Sprache, die sich wie modernes JavaScript schreibt aber mit nützlichen Features wie struktureller Typisierung, Dekoratoren, Interfaces und mehr kommt, gibt Sicherheit und eine bessere Dev Experience.',
      strong: ['TypeScript'],
    }],
    relatedNames: ['Next.js', 'React', 'Vitest', 'Playwright', 'Angular', 'sitespeed.io'],
    sourceScreenshot: 'content-screenshots/typescript.png',
  },
  {
    id: 'github-copilot', name: 'GitHub Copilot', category: 'Tools', ring: 'Adopt',
    tags: ['GitHub Copilot', 'GitHub', 'KI', 'AI', 'Codevervollständigung'], topic: 'DevOps & Security',
    headline: '1. Offizier, übernehmen Sie!',
    teaser: 'GitHub Copilot unterstützt unsere Entwickler bei der Codevervollständigung.',
    paragraphs: [
      { text: 'GitHub Copilot ist ein von GitHub und OpenAI entwickeltes KI-gestütztes Tool zur Codevervollständigung und hat sich mittlerweile als fester Bestandteil unserer Entwicklungsprozesse etabliert. Es wird von allen Entwicklern genutzt.' },
      { text: 'Anfangs hinterließen die Vorschläge von Copilot noch einen gemischten Eindruck, doch mittlerweile sind die Ergebnisse, die Integrationen in die von uns genutzten Code-Editoren (z. B. VS Code, IntelliJ, Visual Studio und Rider) und der Umgang mit dem Tool so gut, dass es aus unserem Arbeitsalltag nicht mehr wegzudenken ist.' },
    ],
    relatedNames: ['MCP', 'RAG', 'Vercel AI SDK', 'Azure OpenAI Services', 'n8n', 'Azure AI Foundry', 'Azure Search Service', 'Azure Cognitive Services', 'Optimizely Opal', 'ChatGPT'],
    sourceScreenshot: 'content-screenshots/github-copilot.png',
  },
  {
    id: 'gitlab', name: 'GitLab', category: 'Tools', ring: 'Adopt',
    tags: ['GitLab', 'Git', 'CI/CD', 'CICD', 'DevOps'], topic: 'DevOps & Security',
    headline: 'Unsere Lösung für Git und CICD',
    teaser: 'Unser Code-Repository mit integrierter Continuous Integration.',
    paragraphs: [{
      text: 'Mit dem vollständigen Wechsel von Subversion und Mercurial nach Git in 2014 haben wir Gitlab als unser Code-Repository eingeführt. Seitdem hat sich Gitlab stark weiterentwickelt. Insbesondere DevOps wird durch die Integration einer Continuous Integration Lösung gut bedient und GitLab CI hat Jenskins, TFS oder Teamcity bei uns fast vollständig verdrängt. Aktuell drängt sich aber verstärkt GitHub inklusive seiner Tools (Co-Pilot) in den Vordergrund. Wir werden sehen, wie sehr sich das auf unsere GitLab-Landschaft auswirken wird.',
      strong: ['GitLab'],
    }],
    relatedNames: ['DevOps', 'CICD', 'Short lived feature branches', 'DevSecOps', 'Trunk Based Development', 'Azure Pipelines', 'DependencyTrack', 'Trivy', 'Teamcity'],
    sourceScreenshot: 'content-screenshots/gitlab.png',
  },
];
