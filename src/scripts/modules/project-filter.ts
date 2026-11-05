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
const COUNT_TOKEN = '%count%';

/** Field name (a data-* key on each card) mapped to the selected value or `all`. */
type Selection = Map<string, string>;

export function initProjectFilter(root: HTMLElement): void {
  const bar = root.querySelector<HTMLElement>('[data-filter-bar]');
  if (!bar) return; // Too few projects to need filtering.

  const groups = [...bar.querySelectorAll<HTMLElement>('[data-filter-group]')];
  const cards = [...root.querySelectorAll<HTMLElement>('[data-project]')];
  const count = root.querySelector<HTMLElement>('[data-filter-count]');
  const empty = root.querySelector<HTMLElement>('[data-filter-empty]');

  const fieldOf = (group: HTMLElement): string => group.dataset['filterGroup'] ?? '';
  const selection: Selection = new Map(groups.map((group) => [fieldOf(group), ALL]));

  const matches = (card: HTMLElement): boolean =>
    [...selection].every(([field, value]) => value === ALL || card.dataset[field] === value);

  const formatCount = (n: number, label: HTMLElement): string => {
    const template = n === 1 ? label.dataset['countOne'] : label.dataset['countOther'];
    return (template ?? String(n)).replace(COUNT_TOKEN, String(n));
  };

  const render = (): void => {
    let visible = 0;
    for (const card of cards) {
      const show = matches(card);
      card.hidden = !show;
      if (show) visible += 1;
    }

    for (const group of groups) {
      const selected = selection.get(fieldOf(group));
      for (const button of group.querySelectorAll<HTMLButtonElement>('[data-filter-value]')) {
        button.setAttribute('aria-pressed', String(button.dataset['filterValue'] === selected));
      }
    }

    if (count) count.textContent = formatCount(visible, count);
    if (empty) empty.hidden = visible > 0;
  };

  bar.addEventListener('click', (event: MouseEvent) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest<HTMLButtonElement>('[data-filter-value]');
    const group = button?.closest<HTMLElement>('[data-filter-group]');
    const value = button?.dataset['filterValue'];
    if (!group || value === undefined) return;
    selection.set(fieldOf(group), value);
    render();
  });

  root.querySelector<HTMLButtonElement>('[data-filter-clear]')?.addEventListener('click', () => {
    for (const field of selection.keys()) selection.set(field, ALL);
    render();
  });

  bar.hidden = false;
  render();
}
