import { publicAsset } from '../assetUrls';
import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { topics } from '../data';
import { findOptionByPrefix, moveOption, type OptionKey } from './technologySelectKeyboard';
import './topicSelect.css';

export function TopicSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const id = useId();
  const labelId = `${id}-label`, valueId = `${id}-value`, listId = `${id}-list`;
  const selectedIndex = Math.max(0, topics.indexOf(value));
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(selectedIndex);
  const [keyboardMode, setKeyboardMode] = useState(false);
  const [placement, setPlacement] = useState<'above' | 'below'>('below');
  const [popupHeight, setPopupHeight] = useState(508);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const popup = useRef<HTMLDivElement>(null);
  const optionElements = useRef<(HTMLDivElement | null)[]>([]);
  const typeahead = useRef({ query: '', at: 0 });

  const measurePopup = useCallback(() => {
    const box = trigger.current?.getBoundingClientRect();
    if (!box) return;
    // The Figma menu overlaps the trigger's bottom edge by 3 px.
    const below = window.innerHeight - box.bottom + 3 - 12;
    const above = box.top + 3 - 12;
    const side = below < 240 && above > below ? 'above' : 'below';
    setPlacement(side);
    setPopupHeight(Math.max(0, side === 'above' ? above : below));
  }, []);

  function show(index = selectedIndex) {
    measurePopup();
    setActiveIndex(index);
    setKeyboardMode(false);
    typeahead.current = { query: '', at: 0 };
    setOpen(true);
  }

  function choose(index: number) {
    const topic = topics[index];
    if (!topic) return;
    onChange(topic);
    setOpen(false);
    trigger.current?.focus({ preventScroll: true });
  }

  useEffect(() => {
    if (!open) return;
    function outside(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    function resize() {
      if (window.innerWidth < 768) setOpen(false);
      else measurePopup();
    }
    function scroll(event: Event) {
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
    const panel = popup.current, option = optionElements.current[activeIndex];
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
      if (!open) show(key === 'Home' ? 0 : key === 'End' ? topics.length - 1 : selectedIndex);
      else setActiveIndex(index => moveOption(index, key as OptionKey, topics.length));
      setKeyboardMode(true);
    } else if (key === 'Enter' || (key === ' ' && !typingSpace)) {
      // Confirming a topic must not submit the keyword search form.
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
      setActiveIndex(findOptionByPrefix(topics, open ? activeIndex : selectedIndex, query));
      setKeyboardMode(true);
    }
  }

  return <div className="topic-field">
    <label id={labelId} htmlFor="topic">Thema</label>
    <div className="topic-select-control" ref={root} onBlur={event => {
      if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) setOpen(false);
    }}>
      <button id="topic" ref={trigger} type="button" role="combobox" className="topic-select-trigger"
        aria-labelledby={`${labelId} ${valueId}`} aria-haspopup="listbox" aria-controls={listId} aria-expanded={open}
        aria-activedescendant={open ? `${id}-option-${activeIndex}` : undefined}
        onClick={() => open ? setOpen(false) : show()} onKeyDown={keyboard}>
        <span className="topic-select-value" id={valueId} title={value}>{value}</span>
        <span className="topic-select-arrow" data-open={open} aria-hidden="true">
          <img src={publicAsset(open ? '/assets/topic-arrow-up.svg' : '/assets/topic-arrow-down.svg')} alt="" />
        </span>
      </button>
      <div ref={popup} id={listId} hidden={!open} className="topic-select-options" role="listbox" aria-labelledby={labelId}
        data-placement={placement} data-keyboard={keyboardMode} style={{ maxHeight: popupHeight }}>
        {topics.map((topic, index) => <div key={topic} id={`${id}-option-${index}`}
          ref={element => { optionElements.current[index] = element; }} className="topic-select-option" role="option"
          aria-selected={topic === value} data-active={index === activeIndex}
          onPointerDown={event => event.preventDefault()}
          onPointerMove={() => { setActiveIndex(index); setKeyboardMode(false); }} onClick={() => choose(index)}>
          {topic}
        </div>)}
      </div>
    </div>
  </div>;
}
