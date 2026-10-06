import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { publicAsset } from '../assetUrls';

type Props = { src: string; alt?: string; className?: string; style?: CSSProperties; 'data-node-id'?: string; 'data-name'?: string; 'data-quadrant-logo'?: string };

// Preserve each original SVG's native dimensions. Scale its containing layer to
// the measured Figma slot instead of rewriting SVG width/height attributes.
export function FigmaAsset({ src, alt = '', ...props }: Props) {
  const slot = useRef<HTMLSpanElement>(null);
  const [native, setNative] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState({ x: 1, y: 1 });
  useEffect(() => {
    if (!slot.current || !native.width) return;
    const el = slot.current;
    const measure = () => {
      if (!el.isConnected) return;
      setScale({ x: el.clientWidth / native.width, y: el.clientHeight / native.height });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(slot.current); measure();
    return () => observer.disconnect();
  }, [native]);
  return <span {...props} ref={slot} data-asset={src}>
    <img src={publicAsset(src)} alt={alt} onLoad={e => setNative({ width: e.currentTarget.naturalWidth, height: e.currentTarget.naturalHeight })}
      style={{ display: 'block', width: native.width || undefined, height: native.height || undefined, maxWidth: 'none', transformOrigin: '0 0', transform: `scale(${scale.x},${scale.y})`, opacity: native.width ? 1 : 0 }} />
  </span>;
}
