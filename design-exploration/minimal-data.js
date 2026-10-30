const technologyNames = ['Go', 'TypeScript', 'Python', 'PostgreSQL', 'SQLite'];
const controls = [...document.querySelectorAll('[data-tech]')];
const rows = [...document.querySelectorAll('.atlas-table tbody tr')];

controls.forEach(button => button.addEventListener('click', () => {
  const selected = button.dataset.tech;
  controls.forEach(control => control.setAttribute('aria-pressed', String(control === button)));
  let count = 0;
  rows.forEach(row => {
    const matches = selected === 'all' || row.dataset.uses.split(',').includes(selected);
    if (matches) count += 1;
    row.classList.toggle('is-matched', selected !== 'all' && matches);
    row.classList.toggle('is-unmatched', !matches);
    row.querySelectorAll('[data-column]').forEach(cell => {
      cell.classList.toggle('is-selected', selected !== 'all' && cell.dataset.column === selected);
      cell.classList.toggle('is-unselected', selected !== 'all' && cell.dataset.column !== selected);
    });
  });
  const label = selected === 'all' ? 'projects' : `with ${technologyNames[Number(selected)]}`;
  document.querySelector('#atlas-count').textContent = `${count} ${label}`;
}));

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
if (!reducedMotion.matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, index) => {
      if (!entry.isIntersecting) return;
      entry.target.style.setProperty('--atlas-delay', `${index % 4 * 65}ms`);
      entry.target.classList.add('atlas-arrive');
      observer.unobserve(entry.target);
    });
  }, { threshold:.1 });
  document.querySelectorAll('h1,h2,.introduction,.current,.primary,.atlas-panel-heading,.atlas-table tbody tr,.atlas-interfaces a,.about p,.story summary,.email').forEach(element => observer.observe(element));
}
reducedMotion.addEventListener('change', event => {
  if (event.matches) document.getAnimations().forEach(animation => animation.cancel());
});
