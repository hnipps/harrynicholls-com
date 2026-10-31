// Project stories use native disclosures; all content works without this script.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const revealTargets = document.querySelectorAll(
  '[data-reveal], .project-name, .project-description, .project-preview, .project-toggle',
);

if (!motionPreference.matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (!entry.isIntersecting) return;
      entry.target.style.setProperty('--reveal-delay', `${(index % 4) * 65}ms`);
      entry.target.classList.add('reveal-enter');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  revealTargets.forEach((element) => observer.observe(element));
  document.querySelector('h1 span')?.classList.add('title-enter');
}

// A link to a project opens its story, including on a direct page visit.
function openLinkedProject() {
  const id = window.location.hash.slice(1);
  const project = document.getElementById(id);
  if (project?.matches('details.project')) project.open = true;
}
window.addEventListener('hashchange', openLinkedProject);
openLinkedProject();

// Respect a motion preference changed while the page is open.
motionPreference.addEventListener('change', (event) => {
  if (event.matches) document.getAnimations().forEach((animation) => animation.cancel());
});
