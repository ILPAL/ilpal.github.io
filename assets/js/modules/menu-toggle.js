/**
 * Collapsible site navigation on small screens.
 *
 * Markup: <button data-menu-toggle aria-controls="<nav id>" aria-expanded="false">
 * The controlled element gets `is-open` while expanded. CSS keeps the menu
 * visible when JavaScript is unavailable.
 *
 * @param {HTMLButtonElement} button
 */
export function initMenuToggle(button) {
  const menu = document.getElementById(button.getAttribute('aria-controls') ?? '');
  if (!menu) return;

  const setOpen = (open) => {
    button.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
  };

  button.addEventListener('click', () => {
    setOpen(button.getAttribute('aria-expanded') !== 'true');
  });

  // Close with Escape and return focus to the toggle.
  menu.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      button.focus();
    }
  });
}
