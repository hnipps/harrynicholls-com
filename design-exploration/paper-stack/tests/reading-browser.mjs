import {Browser,sleep} from './browser-client.mjs';
import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';

const base=process.env.PAPER_VIEW_BASE_URL || 'http://127.0.0.1:3031/design-exploration/paper-stack/themes/';
const themes=['personal-letter','signal-press','symbols-pixels','minimal-data','working-index'];
const out='.taste-skill/paper-critique/final';
mkdirSync(out,{recursive:true});
const browser=await Browser.launch();
try {
  for (const theme of themes) {
    const page=await browser.newPage({width:1440,height:1000,reducedMotion:true});
    try {
      await page.goto(base+theme+'.html',{settleMs:100});
      for (const [width,height,label] of [[1440,1000,'desktop'],[768,1000,'tablet'],[390,844,'mobile'],[320,844,'narrow']]) {
        await page.setViewport({width,height});
        await page.eval(()=>window.scrollTo(0,0));
        assert.equal(await page.eval(()=>document.documentElement.scrollWidth>innerWidth),false,theme+' '+label+' overflow');
        if (label==='desktop'||label==='mobile') await page.screenshot({path:`${out}/${theme}-${label}.jpg`});
      }
      await page.setViewport({width:390,height:844});
      await page.eval(()=>document.querySelector('.skip-link').click());
      await sleep(50);
      assert.equal(await page.eval(()=>document.activeElement.id),'main',theme+' skip focus');
      const historyLength=await page.eval(()=>history.length);
      await page.eval(()=>document.querySelector('a[href="#crosscheck"]').click());
      await sleep(50);
      assert.equal(await page.eval(()=>document.activeElement.textContent),'Crosscheck');
      assert.equal(await page.eval(()=>document.querySelector('#crosscheck').closest('details')?.open ?? document.querySelector('#crosscheck details').open),true);
      assert.equal(await page.eval(()=>history.length),historyLength+1);
      await page.eval(()=>history.back());
      await sleep(80);
      assert.equal(await page.eval(()=>location.hash),'#main');
      assert.equal(await page.eval(()=>document.activeElement.id),'main');
      await page.eval(()=>document.querySelector('a[href="#gitrove-story"]').click());
      await sleep(80);
      assert.equal(await page.eval(()=>document.querySelector('#gitrove-story .story-image').closest('.story-content > div').querySelector('h3').textContent),'A daily digest');
      assert.equal(await page.eval(()=>document.querySelectorAll('.study-return').length),6);
      assert.equal(await page.eval(()=>[...document.querySelectorAll('.story-image')].every(a=>a.href===a.querySelector('img').src&&a.target==='_blank')),true);
      await page.screenshot({path:`${out}/${theme}-story-mobile.jpg`});
      await page.eval(()=>document.querySelector('#gitrove-story .study-return a').click());
      await sleep(50);
      assert.equal(await page.eval(()=>location.hash),theme==='minimal-data'?'#atlas':'#work');
      assert.equal(await page.eval(()=>document.documentElement.scrollWidth>innerWidth),false);
      assert.equal(await page.eval(()=>[...document.querySelectorAll('.footer-bottom a,.email')].every(a=>a.getBoundingClientRect().height>=44)),true);
      if (theme==='signal-press') {
        assert.equal(await page.eval(()=>{const b=document.querySelector('[data-filter="tools"]');b.click();return b.textContent;}),'Tools & writing');
        assert.equal(await page.eval(()=>document.querySelectorAll('.poster-project:not([hidden])').length),4);
      }
      if (theme==='symbols-pixels') {
        await page.eval(()=>document.querySelector('[data-reading-target]').click());
        await sleep(50);
        assert.equal(await page.eval(()=>document.body.dataset.treatment),'screen');
        assert.equal(await page.eval(()=>document.activeElement.textContent),'Software, in detail');
      }
      if (theme==='minimal-data') {
        assert.equal(await page.eval(()=>document.querySelector('.tech-short[title="SQLite"]')?.textContent||[...document.querySelectorAll('.tech-short')].at(-1).textContent),'SQLite');
        assert.equal(await page.eval(()=>getComputedStyle(document.querySelector('.atlas-abbreviations')).display),'block');
        assert.equal(await page.eval(()=>[...document.querySelectorAll('.atlas-table tbody th a')].every(a=>a.getBoundingClientRect().height>=44)),true);
        await page.eval(()=>document.querySelector('[data-tech="2"]').click());
        assert.equal(await page.eval(()=>document.querySelector('#atlas-count').textContent),'1 with Python');
      }
      if (theme==='working-index') {
        await page.eval(()=>{const input=document.querySelector('#project-search');input.value='nonsense';input.dispatchEvent(new Event('input'));});
        assert.equal(await page.eval(()=>document.querySelector('#empty-search').hidden),false);
        assert.equal(await page.eval(()=>document.querySelectorAll('.screen-strip a:not([hidden])').length),0);
        await page.screenshot({path:`${out}/working-index-empty.jpg`});
        await page.eval(()=>document.querySelector('#clear-project-search').click());
        assert.equal(await page.eval(()=>document.querySelectorAll('.project-link:not([hidden])').length),6);
        assert.equal(await page.eval(()=>document.querySelectorAll('.screen-strip a:not([hidden])').length),4);
        assert.equal(await page.eval(()=>document.activeElement.id),'project-search');
      }
      assert.deepEqual(page.consoleErrors,[]);
      console.log('PASS',theme,': reflow, focus, Back, reading path, targets and controls');
    } finally { await page.close(); }
  }
} finally { await browser.close(); }
