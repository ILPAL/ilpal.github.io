/**
 * Entry point. Each module enhances the elements that opt in through a
 * data attribute, so pages only pay for what they use and work without JS.
 */
import { initMenuToggle } from './modules/menu-toggle.js';
import { initProjectFilter } from './modules/project-filter.js';

type Enhancer = (root: HTMLElement) => void;

const MODULES: ReadonlyArray<readonly [selector: string, init: Enhancer]> = [
  ['[data-menu-toggle]', initMenuToggle],
  ['[data-project-filter]', initProjectFilter],
];

for (const [selector, init] of MODULES) {
  document.querySelectorAll<HTMLElement>(selector).forEach(init);
}
