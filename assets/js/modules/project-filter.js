/**
 * Kind/status filters for the project list.
 *
 * Markup contract (see _layouts/projects.html and _includes/components/project-filter.html):
 *   [data-project-filter]                         root
 *     [data-filter-bar]                           filter UI, hidden until enhanced
 *       [data-filter-group="<field>"]             one per field, e.g. "kind"
 *         button[data-filter-value="<id>|all"]    toggle buttons using aria-pressed
 *     [data-filter-count]                         live count, data-count-one / data-count-other
 *     [data-project][data-<field>="<id>"]         one per project card
 *     [data-filter-empty]                         shown when nothing matches
 *       [data-filter-clear]                       resets every group
 */

const ALL = 'all';

/** @param {HTMLElement} root */
export function initProjectFilter(root) {
  const bar = root.querySelector('[data-filter-bar]');
  if (!bar) return; // Too few projects to need filtering.

  const groups = [...bar.querySelectorAll('[data-filter-group]')];
  const cards = [...root.querySelectorAll('[data-project]')];
  const count = root.querySelector('[data-filter-count]');
  const empty = root.querySelector('[data-filter-empty]');

  /** @type {Record<string, string>} field -> selected value */
  const selection = Object.fromEntries(groups.map((group) => [group.dataset.filterGroup, ALL]));

  const matches = (card) =>
    Object.entries(selection).every(([field, value]) => value === ALL || card.dataset[field] === value);

  const formatCount = (n) => {
    if (!count) return '';
    const template = n === 1 ? count.dataset.countOne : count.dataset.countOther;
    return (template ?? '').replace('%count%', String(n));
  };

  const render = () => {
    let visible = 0;
    for (const card of cards) {
      const show = matches(card);
      card.hidden = !show;
      if (show) visible += 1;
    }

    for (const group of groups) {
      const selected = selection[group.dataset.filterGroup];
      for (const button of group.querySelectorAll('[data-filter-value]')) {
        button.setAttribute('aria-pressed', String(button.dataset.filterValue === selected));
      }
    }

    if (count) count.textContent = formatCount(visible);
    if (empty) empty.hidden = visible > 0;
  };

  bar.addEventListener('click', (event) => {
    const button = event.target.closest('[data-filter-value]');
    const group = button?.closest('[data-filter-group]');
    if (!button || !group) return;
    selection[group.dataset.filterGroup] = button.dataset.filterValue;
    render();
  });

  root.querySelector('[data-filter-clear]')?.addEventListener('click', () => {
    for (const field of Object.keys(selection)) selection[field] = ALL;
    render();
  });

  bar.hidden = false;
  render();
}
