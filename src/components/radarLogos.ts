import { currentRadarLogos } from './currentRadarLogos.ts';

export type RadarLogo = {
  id: string; name: string; x: number; y: number;
  asset?: string; symbol?: string; activeAsset?: string;
  activeX?: number; activeY?: number; inset?: number;
};

// Geometry and blue assets read from Figma 220:2520, 220:2875 and 220:2994.
const figmaLogos: RadarLogo[] = [
  { id: 'aws', name: 'AWS', x: 382, y: 269, asset: 'b6af4', activeAsset: 'ab552', activeX: 377, activeY: 262 },
  { id: 'abstract', name: 'Abstract', x: 420, y: 164, asset: 'a417b', activeAsset: '70202', activeX: 414, activeY: 158 },
  { id: 'adyen', name: 'Adyen', x: 416, y: 249, asset: '3dc24', activeAsset: '3dc24', activeX: 412, activeY: 244 },
  { id: 'ansible', name: 'Ansible', x: 232, y: 368, asset: 'b7e2d' },
  { id: 'kafka', name: 'Apache Kafka', x: 192, y: 178, asset: '1d616' },
  { id: 'api', name: 'API Gateway', x: 412, y: 368, asset: '1613b' },
  { id: 'abstract-outer', name: 'Abstract (äußerer Ring)', x: 138, y: 85, asset: '51399' },
  { id: 'alpine', name: 'Alpine.js', x: 250, y: 83, asset: '866bf', inset: 5.4 },
];
const figmaConnections: Record<string, string[]> = {
  aws: ['abstract', 'ansible', 'kafka'],
  abstract: ['aws', 'kafka', 'api', 'abstract-outer'],
  adyen: ['alpine'],
  ansible: ['aws'], kafka: ['aws', 'abstract'], api: ['abstract'],
  'abstract-outer': ['abstract'], alpine: ['adyen'],
};
export const radarLogos: RadarLogo[] = [...figmaLogos, ...currentRadarLogos];
const normalize = (name: string) => name.toLocaleLowerCase('de').replace(/[^a-z0-9]/g, '');
export const radarConnections: Record<string, string[]> = {
  ...figmaConnections,
  ...Object.fromEntries(currentRadarLogos.map(logo => [logo.id,
    radarLogos.filter(target => target.id !== logo.id && (
      logo.relatedNames.some(name => normalize(name) === normalize(target.name)) ||
      // Related topics connect both directions between newly imported logos.
      currentRadarLogos.find(item => item.id === target.id)?.relatedNames.some(name => normalize(name) === normalize(logo.name))
    )).map(target => target.id),
  ])),
};
