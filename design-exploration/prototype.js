const search = document.querySelector('#project-search');
const projectLinks = [...document.querySelectorAll('[data-search]')];
search?.addEventListener('input', () => {
  const query = search.value.trim().toLowerCase();
  projectLinks.forEach(link => { link.hidden = !link.dataset.search.includes(query); });
  const count = projectLinks.filter(link => !link.hidden).length;
  document.querySelector('#search-status').textContent = `${count} ${count === 1 ? 'project' : 'projects'}${query ? ' found' : ''}`;
});

const filters = [...document.querySelectorAll('[data-filter]')];
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
  const category = button.dataset.filter;
  const projects = [...document.querySelectorAll('.poster-project')];
  projects.forEach(project => {
    const home = project.dataset.category === 'At home';
    project.hidden = category === 'home' ? !home : category === 'tools' ? home : false;
  });
  const count = projects.filter(project => !project.hidden).length;
  document.querySelector('#filter-status').textContent = `${count} projects`;
}));

const exhibits = [...document.querySelectorAll('[data-exhibit]')];
exhibits.forEach(button => button.addEventListener('click', () => {
  exhibits.forEach(exhibit => exhibit.setAttribute('aria-pressed', String(exhibit === button)));
  const image = document.querySelector('#exhibit-image');
  image.src = `../src/assets/${button.dataset.exhibit}`;
  image.alt = `${button.dataset.title} interface`;
  document.querySelector('#exhibit-caption').textContent = `${button.dataset.title} — ${button.dataset.description}`;
}));

// Native case-study disclosures and links work without JavaScript.
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
if (!reducedMotion.matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, index) => {
      if (!entry.isIntersecting) return;
      entry.target.style.setProperty('--delay', `${index % 4 * 60}ms`);
      entry.target.classList.add('arrive');
      observer.unobserve(entry.target);
    });
  }, { threshold:.1 });
  document.querySelectorAll('h1,h2,.introduction,.current,.primary,.project-link,.work-tile,.poster-project,.screen-strip a,.about p,.exhibit,.story summary,.email').forEach(element => observer.observe(element));
}
reducedMotion.addEventListener('change', event => {
  if (event.matches) document.getAnimations().forEach(animation => animation.cancel());
});
