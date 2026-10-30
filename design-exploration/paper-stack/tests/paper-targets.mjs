// Find actual exposed paper corners, rather than assuming every full sheet is onscreen.
export function exposedPaperTargets({ thumb=false }={}) {
  const found = new Map();
  const offsets = thumb ? [[0,0],[-22,-22],[22,-22],[-22,22],[22,22]] : [[0,0]];
  for (let y=Math.max(24,innerHeight-520); y<innerHeight-24; y+=8) {
    for (let x=Math.max(24,innerWidth-440); x<innerWidth-24; x+=8) {
      const paper = document.elementFromPoint(x,y)?.closest('[data-paper]');
      if (!paper || found.has(paper.dataset.paper)) continue;
      if (offsets.every(([dx,dy])=>document.elementFromPoint(x+dx,y+dy)?.closest('[data-paper]')===paper)) {
        found.set(paper.dataset.paper,{ index:paper.dataset.paper,x,y });
      }
    }
  }
  return [...found.values()];
}
