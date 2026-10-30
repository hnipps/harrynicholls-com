// Quiet reverse-side printing: each pattern comes from its existing portfolio direction.
export const themes = [
  { slug:'personal-letter', name:'A personal letter', paper:'#f6f2e7', ink:'#302f2a', print:'#a03932', unit:20, opacity:.22, mark:'<path d="M10 7v6m-3-3h6" fill="none" stroke-width=".9"/>', back:['#d3d0c4','#f0ece0','#fffdf5','#e0dccf'] },
  { slug:'signal-press', name:'Signal press', paper:'#ddf252', ink:'#172218', print:'#172218', unit:24, opacity:.12, mark:'<path d="M5 16l8-8m-3 11l8-8" fill="none" stroke-width="2"/>', back:['#889a29','#d6e94c','#effb9a','#bbce3e'] },
  { slug:'symbols-pixels', name:'Dot matrix', paper:'#f8f8f5', ink:'#151515', print:'#151515', unit:16, opacity:.17, mark:'<circle cx="8" cy="8" r="1.35" stroke="none"/>', back:['#cbcbc5','#efefeb','#ffffff','#deded8'] },
  { slug:'minimal-data', name:'Project atlas', paper:'#f4f5f3', ink:'#14211f', print:'#154ada', unit:22, opacity:.19, mark:'<path d="M7 7h7v7H7zm8 8h2v2h-2z" fill="none" stroke-width=".85"/>', back:['#bec8d8','#e6edf4','#ffffff','#d6e1eb'] },
  { slug:'working-index', name:'Working index', paper:'#f7f8f4', ink:'#222d25', print:'#386146', unit:22, opacity:.21, mark:'<path d="M6 8h10M6 13h6" fill="none" stroke-width=".9"/>', back:['#cbd0c6','#ecefe7','#ffffff','#dae0d4'] },
  { slug:'bare-html', name:'HTML, finally', paper:'#ffffff', ink:'#000000', print:'#0000ee', unit:26, opacity:.17, mark:'<path d="M9 9l-4 4 4 4m8-8l4 4-4 4" fill="none" stroke-width=".9"/>', back:['#d0d0d0','#f0f0f0','#ffffff','#e0e0e0'] }
];

export function materialSVG(theme) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${theme.unit}" height="${theme.unit}" viewBox="0 0 ${theme.unit} ${theme.unit}"><g fill="${theme.print}" stroke="${theme.print}">${theme.mark}</g></svg>`;
}

export function materialURL(theme) {
  return `url("data:image/svg+xml,${encodeURIComponent(materialSVG(theme))}")`;
}
