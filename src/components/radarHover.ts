type Scheduler = {
  schedule: (callback: () => void, delay: number) => unknown;
  cancel: (handle: unknown) => void;
};
const browserScheduler: Scheduler = {
  schedule: (callback, delay) => setTimeout(callback, delay),
  cancel: handle => clearTimeout(handle as ReturnType<typeof setTimeout>),
};

/** Figma leave delay plus dwell time requested for switching connected groups. */
export class RadarHover {
  active: string | null = null;
  pointer: string | null = null;
  focused: string | null = null;
  private timer: unknown;
  private listeners = new Set<() => void>();
  private scheduler: Scheduler;

  constructor(scheduler: Scheduler = browserScheduler) { this.scheduler = scheduler; }
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; };
  snapshot = () => this.active;
  private show(id: string | null) {
    if (this.active === id) return;
    this.active = id;
    this.listeners.forEach(listener => listener());
  }
  dispose = () => {
    if (this.timer !== undefined) this.scheduler.cancel(this.timer);
    this.timer = undefined;
  };
  enter(id: string, keyboard = false) {
    if (keyboard) this.focused = id; else this.pointer = id;
    this.dispose();
    if (keyboard || !this.active || this.active === id) this.show(id);
    else this.timer = this.scheduler.schedule(() => {
      if (this.pointer === id || this.focused === id) this.show(id);
    }, 300);
  }
  leave(keyboard = false) {
    if (keyboard) this.focused = null; else this.pointer = null;
    this.dispose();
    if (this.focused) this.show(this.focused);
    else if (!this.pointer) this.timer = this.scheduler.schedule(() => this.show(null), 800);
  }
  dismiss() { this.dispose(); this.show(null); }
}
