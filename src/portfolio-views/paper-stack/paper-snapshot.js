/** A transient picture of the visible page; the original iframe stays alive underneath. */
export async function pagePicture(frame) {
  const doc=frame.contentDocument,win=frame.contentWindow;
  await doc.fonts.ready;
  const root=doc.documentElement.cloneNode(true);
  root.querySelectorAll('script,link,meta,base').forEach(node=>node.remove());
  const css=[...doc.styleSheets].map(sheet=>[...sheet.cssRules].map(rule=>rule.cssText).join('\n')).join('\n');
  const style=doc.createElement('style');
  style.textContent=css+'\n*{animation:none!important;transition:none!important;caret-color:transparent!important}';
  root.querySelector('head').replaceChildren(style);
  const computed=win.getComputedStyle(doc.documentElement);
  for(const name of computed) if(name.startsWith('--')) root.style.setProperty(name,computed.getPropertyValue(name));
  root.style.cssText+=`;width:${innerWidth}px;height:${innerHeight}px;overflow:hidden;`;
  root.querySelector('body').style.transform=`translateY(${-win.scrollY}px)`;
  const originals=[...doc.images],copies=[...root.querySelectorAll('img')];
  await Promise.all(copies.map(async(copy,index)=>{
    const original=originals[index],rect=original.getBoundingClientRect();
    copy.removeAttribute('srcset');copy.removeAttribute('loading');
    if(rect.bottom<0||rect.top>innerHeight||!rect.width||!rect.height) {
      copy.src='data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';return;
    }
    const blob=await (await fetch(original.currentSrc||original.src)).blob();
    copy.src=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(blob);});
  }));
  const xml=new XMLSerializer().serializeToString(root);
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${innerWidth}" height="${innerHeight}"><foreignObject width="100%" height="100%">${xml}</foreignObject></svg>`;
  const picture=new Image();
  picture.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
  await picture.decode();
  const ratio=Math.min(devicePixelRatio,1.5,2048/innerWidth,2048/innerHeight);
  const canvas=document.createElement('canvas');canvas.width=Math.round(innerWidth*ratio);canvas.height=Math.round(innerHeight*ratio);
  const ctx=canvas.getContext('2d');
  const ground=win.getComputedStyle(doc.body).backgroundColor;
  ctx.fillStyle=ground==='rgba(0, 0, 0, 0)' ? '#fff' : ground;
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.drawImage(picture,0,0,canvas.width,canvas.height);
  return canvas;
}
