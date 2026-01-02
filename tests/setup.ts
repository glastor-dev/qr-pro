import { Window } from "npm:happy-dom";

const window = new Window();

type GlobalDomShim = {
  window?: Window;
  document?: Document;
  navigator?: Navigator;
  HTMLElement?: typeof HTMLElement;
  Node?: typeof Node;
  Event?: typeof Event;
  CustomEvent?: typeof CustomEvent;
  getComputedStyle?: typeof window.getComputedStyle;
  requestAnimationFrame?: (cb: (time: number) => void) => number;
  cancelAnimationFrame?: (id: number) => void;
};

const g = globalThis as unknown as GlobalDomShim;

g.window = window;
g.document = window.document;
g.navigator = window.navigator;

g.HTMLElement = window.HTMLElement;
g.Node = window.Node;
g.Event = window.Event;
g.CustomEvent = window.CustomEvent;

g.getComputedStyle = window.getComputedStyle.bind(window);

if (typeof g.requestAnimationFrame === "undefined") {
  g.requestAnimationFrame = (cb) => {
    cb(Date.now());
    return 0;
  };
}

if (typeof g.cancelAnimationFrame === "undefined") {
  g.cancelAnimationFrame = () => {
    // no-op (paired with synchronous requestAnimationFrame above)
  };
}
