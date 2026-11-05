/**
 * Collapsible site navigation on small screens.
 *
 * Markup: <button data-menu-toggle aria-controls="<nav id>" aria-expanded="false">
 * The controlled element gets `is-open` while expanded. CSS keeps the menu
 * visible when JavaScript is unavailable.
 */
const OPEN_CLASS = 'is-open';

export function initMenuToggle(button: HTMLElement): void {
  const menuId = button.getAttribute('aria-controls');
  const menu = menuId ? document.getElementById(menuId) : null;
  if (!menu) return;

  const isOpen = (): boolean => button.getAttribute('aria-expanded') === 'true';

  const setOpen = (open: boolean): void => {
    button.setAttribute('aria-expanded', String(open));
    menu.classList.toggle(OPEN_CLASS, open);
  };

  button.addEventListener('click', () => setOpen(!isOpen()));

  // Close with Escape and return focus to the toggle.
  menu.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Escape' && isOpen()) {
      setOpen(false);
      button.focus();
    }
  });
}
