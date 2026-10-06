import { publicAsset } from '../assetUrls';
import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { rings, type Technology } from '../data';
import { FigmaAsset } from './FigmaAsset';
import { findOptionByPrefix, moveOption, type OptionKey } from './technologySelectKeyboard';
import './technologySelect.css';

export function TechnologySelect({ items, currentId, label = 'Techniques durchsuchen' }: { items: Technology[]; currentId: string; label?: string }) {
  const id = useId();
  const labelId = `${id}-label`, valueId = `${id}-value`, listId = `${id}-list`;
  const groups = rings.map(ring => ({ ring, items: items.filter(item => item.ring === ring) }));
  const options = groups.flatMap(group => group.items);
  const selectedIndex = options.findIndex(item => item.id === currentId);
  const selected = options[selectedIndex];
  const [open, setOpen] = useState(false);
  const [keyboardMode, setKeyboardMode] = useState(false);
  const [activeIndex, setActiveIndex] = useState(Math.max(0, selectedIndex));
  const [placement, setPlacement] = useState<'above' | 'below'>('below');
  const [popupHeight, setPopupHeight] = useState(480);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const popup = useRef<HTMLDivElement>(null);
  const optionElements = useRef<(HTMLDivElement | null)[]>([]);
  const typeahead = useRef({ query: '', at: 0 });
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const measurePopup = useCallback(() => {
    const box = trigger.current?.getBoundingClientRect();
    if (!box) return;
    const below = window.innerHeight - box.bottom - 12;
    const above = box.top - 12;
    const side = below < 240 && above > below ? 'above' : 'below';
    setPlacement(side);
    setPopupHeight(Math.max(0, Math.min(480, side === 'above' ? above : below)));
  }, []);

  function show(index = Math.max(0, selectedIndex)) {
    if (!options.length) return;
    measurePopup();
    setActiveIndex(index);
    setKeyboardMode(false);
    typeahead.current = { query: '', at: 0 };
    setOpen(true);
  }

  function choose(index: number) {
    const item = options[index];
    if (!item?.detail) return;
    setOpen(false);
    if (item.detail !== pathname) navigate(item.detail);
    else trigger.current?.focus({ preventScroll: true });
  }

  useEffect(() => {
    if (!open) return;
    function outside(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    function resize() {
      if (window.innerWidth >= 768) setOpen(false);
      else measurePopup();
    }
    function scroll(event: Event) {
      // Scrolling the list must not dismiss it; page scrolling does.
      if (!(event.target instanceof Node) || !popup.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('pointerdown', outside);
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', scroll, true);
    return () => {
      document.removeEventListener('pointerdown', outside);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', scroll, true);
    };
  }, [open, measurePopup]);

  useEffect(() => {
    const panel = popup.current;
    const option = optionElements.current[activeIndex];
    if (!open || !panel || !option) return;
    const top = option.offsetTop, bottom = top + option.offsetHeight;
    if (top < panel.scrollTop) panel.scrollTop = top;
    else if (bottom > panel.scrollTop + panel.clientHeight) panel.scrollTop = bottom - panel.clientHeight;
  }, [open, activeIndex]);

  function keyboard(event: KeyboardEvent<HTMLButtonElement>) {
    const { key } = event;
    const typingSpace = key === ' ' && open && typeahead.current.query && Date.now() - typeahead.current.at < 700;
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(key)) {
      event.preventDefault();
      typeahead.current = { query: '', at: 0 };
      if (!open) show(key === 'Home' ? 0 : key === 'End' ? options.length - 1 : Math.max(0, selectedIndex));
      else setActiveIndex(index => moveOption(index, key as OptionKey, options.length));
      setKeyboardMode(true);
    } else if (key === 'Enter' || (key === ' ' && !typingSpace)) {
      event.preventDefault();
      if (open) choose(activeIndex);
      else show();
    } else if (key === 'Escape' && open) {
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
    } else if (key === 'Tab') {
      setOpen(false);
    } else if (key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) {
      event.preventDefault();
      const now = Date.now();
      const previous = now - typeahead.current.at < 700 ? typeahead.current.query : '';
      const query = previous + key;
      if (!open) show();
      typeahead.current = { query, at: now };
      setActiveIndex(findOptionByPrefix(options.map(item => item.name), open ? activeIndex : Math.max(0, selectedIndex), query));
      setKeyboardMode(true);
    }
  }

  return <div className="mobile-detail-select">
    <label id={labelId} htmlFor="technique-select">{label}</label>
    <div className="detail-select-control" ref={root} onBlur={event => {
      if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) setOpen(false);
    }}>
      <button id="technique-select" ref={trigger} type="button" role="combobox" className="detail-select-trigger"
        aria-labelledby={`${labelId} ${valueId}`} aria-haspopup="listbox" aria-controls={listId} aria-expanded={open}
        aria-activedescendant={open ? `${id}-option-${activeIndex}` : undefined}
        onClick={() => open ? setOpen(false) : show()} onKeyDown={keyboard}>
        <span id={valueId}>{selected?.name ?? 'Thema auswählen'}</span>
        <span className="detail-select-arrow" aria-hidden="true"><img src={publicAsset('/assets/2a73c.svg')} alt="" /></span>
      </button>
      <div ref={popup} id={listId} hidden={!open} className="detail-select-options" role="listbox" aria-labelledby={labelId}
        data-placement={placement} data-keyboard={keyboardMode} style={{ maxHeight: popupHeight }}>
        {groups.map(({ ring, items: groupItems }) => <div key={ring} role="group" aria-labelledby={`${id}-group-${ring}`}>
          <div className="detail-select-group-label" id={`${id}-group-${ring}`}>{ring}</div>
          {groupItems.length ? groupItems.map(item => {
            const index = options.indexOf(item);
            const isSelected = item.id === currentId;
            return <div key={item.id} id={`${id}-option-${index}`} ref={el => { optionElements.current[index] = el; }}
              className="detail-select-option" role="option" aria-selected={isSelected} aria-disabled={!item.detail || undefined}
              data-active={index === activeIndex} data-selected={isSelected} title={item.detail ? undefined : 'Detailseite noch nicht verfügbar'}
              onPointerMove={() => { setActiveIndex(index); setKeyboardMode(false); }} onClick={() => choose(index)}>
              {isSelected && <span className="detail-select-check" aria-hidden="true"><FigmaAsset className="detail-select-check-asset" src="/assets/016a9.svg" /></span>}
              <span>{item.name}</span>
            </div>;
          }) : <div className="detail-select-empty">Aktuell keine Einträge vorhanden.</div>}
        </div>)}
      </div>
    </div>
  </div>;
}
