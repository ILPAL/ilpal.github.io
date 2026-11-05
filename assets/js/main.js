/**
 * Entry point. Each module enhances the elements that opt in through a
 * data attribute, so pages only pay for what they use and work without JS.
 */
import { initMenuToggle } from './modules/menu-toggle.js';
import { initProjectFilter } from './modules/project-filter.js';

/** @type {Array<[selector: string, init: (root: HTMLElement) => void]>} */
const MODULES = [
  ['[data-menu-toggle]', initMenuToggle],
  ['[data-project-filter]', initProjectFilter],
];

for (const [selector, init] of MODULES) {
  document.querySelectorAll(selector).forEach((element) => init(element));
}
