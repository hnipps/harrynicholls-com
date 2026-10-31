const projectSearch = document.querySelector('#project-search');
const emptySearch = document.querySelector('#empty-search');
const screenshots = [...document.querySelectorAll('.screen-strip a')];
function updateSearchPictures() {
  const results = [...document.querySelectorAll('.project-link:not([hidden])')];
  const destinations = new Set(results.map(link => link.hash));
  screenshots.forEach(link => { link.hidden = !destinations.has(link.hash); });
  emptySearch.hidden = results.length > 0;
}
projectSearch.addEventListener('input', updateSearchPictures);
document.querySelector('#clear-project-search').addEventListener('click', () => {
  projectSearch.value = '';
  projectSearch.dispatchEvent(new Event('input'));
  projectSearch.focus();
});
