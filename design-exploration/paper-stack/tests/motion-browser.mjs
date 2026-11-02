import {Browser,sleep} from './browser-client.mjs';
import {exposedPaperTargets} from './paper-targets.mjs';
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';

const base=process.env.PAPER_STACK_URL || 'http://127.0.0.1:3033/';
const out='.taste-skill/paper-motion';
mkdirSync(out,{recursive:true});
const browser=await Browser.launch(),results=[];
try {
  for (const [width,height,label] of [[1440,1000,'desktop'],[390,844,'mobile']]) {
    const page=await browser.newPage({width,height});
    let mouseHeld=false;
    const mouse=(type,x,y)=>{
      if(type==='mousePressed')mouseHeld=true;
      if(type==='mouseReleased')mouseHeld=false;
      return page.send('Input.dispatchMouseEvent',{type,x,y,buttons:mouseHeld?1:0,button:mouseHeld||type!=='mouseMoved'?'left':'none',clickCount:1});
    };
    try {
      await page.goto(base+'?reset',{settleMs:1800});
      if(label==='desktop') {
        await mouse('mouseMoved',18,18);await sleep(450);
        await mouse('mousePressed',18,18);await mouse('mouseMoved',240,180);
      } else {
        await page.send('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});
        await page.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:18,y:18,id:1}]});
        await page.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:120,y:100,id:1}]});
      }
      assert.equal(await page.eval(()=>document.body.classList.contains('is-dragging')),true,'gesture reached the curl');
      await page.eval(()=>{
        window.releaseMotion=[];const started=performance.now();
        function sample() {
          const shade=document.querySelector('#paper-shade');
          releaseMotion.push({t:performance.now()-started,x:Number(shade.getAttribute('x2')),y:Number(shade.getAttribute('y2'))});
          if(performance.now()-started<1350)requestAnimationFrame(sample);
        }
        sample();
      });
      if(label==='desktop') await mouse('mouseReleased',240,180);
      else await page.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
      for(const [delay,phase] of [[320,'release'],[400,'settling'],[700,'rest']]) {
        await sleep(delay);
        await page.screenshot({path:`${out}/${label}-${phase}.jpg`,clip:{x:0,y:0,width:320,height:260}});
      }
      const samples=await page.eval(()=>releaseMotion);
      writeFileSync(`${out}/${label}-release.json`,JSON.stringify(samples));
      const rest=samples.at(-1),initial=samples[0],travel=initial.x-rest.x;
      const deepest=Math.min(...samples.map(sample=>sample.x));
      assert.ok(rest.x-deepest>travel*.01,'release springs a little past its crease');
      assert.ok(rest.x-deepest<travel*.12,'the overshoot stays small');
      const reversals=samples.slice(2).filter((sample,i)=>Math.sign(sample.x-samples[i+1].x)*Math.sign(samples[i+1].x-samples[i].x)<0&&Math.abs(sample.x-samples[i+1].x)>.05).length;
      assert.ok(reversals<=2,'one bounce, not a wobble');
      assert.ok(samples.find(sample=>sample.t>=250).x<rest.x+travel*.3,'most of the return happens early');
      assert.ok(samples.filter(sample=>Math.abs(sample.x-rest.x)>.5).at(-1).t<820,'the corner is at rest within 820ms');
      assert.equal(await page.eval(()=>document.body.dataset.theme),'personal-letter');
      if(label==='mobile')await page.send('Emulation.setTouchEmulationEnabled',{enabled:false});
      await page.eval(()=>{
        localStorage.setItem('harry-paper-stack-theme','bare-html');
        localStorage.setItem('harry-paper-stack-theme-deck',JSON.stringify(['bare-html']));
        localStorage.setItem('harry-paper-stack-theme-papers',JSON.stringify(['personal-letter','signal-press','symbols-pixels','minimal-data','working-index']));
      });
      await page.goto(base,{settleMs:100});
      await mouse('mouseMoved',width-20,height-20);await sleep(950);
      assert.equal((await page.eval(exposedPaperTargets,{thumb:true})).length,5,'all papers remain reachable after the fan opens');
      const fan=await page.eval(()=>[...document.querySelectorAll('.paper-tab')].map(button=>({slot:Number(button.style.getPropertyValue('--slot')),duration:parseFloat(getComputedStyle(button).transitionDuration)})));
      assert.ok(fan.every(paper=>paper.duration>=.35&&paper.duration<=.6),'the fan opens briskly');
      assert.ok(fan.find(p=>p.slot===4).duration>fan.find(p=>p.slot===0).duration,'longer travel gets more time');
      const target=(await page.eval(exposedPaperTargets,{thumb:true})).find(p=>p.index==='0');
      await mouse('mouseMoved',target.x,target.y);await sleep(500);
      assert.equal(await page.eval(({x,y})=>document.elementFromPoint(x,y)?.closest('[data-paper]')?.dataset.paper,target),'0','hover keeps its original hit target');
      await page.screenshot({path:`${out}/${label}-fan.jpg`});
      await mouse('mousePressed',target.x,target.y);await mouse('mouseReleased',target.x,target.y);
      for(let attempt=0;attempt<300;attempt++) {
        if(await page.eval(()=>!!document.querySelector('.paper-flex,.paper-return-back')))break;
        await sleep(10);
      }
      assert.equal(await page.eval(()=>!!document.querySelector('.paper-flex,.paper-return-back')),true);
      await sleep(1000);
      assert.equal(await page.eval(()=>document.body.classList.contains('is-returning')),true,'retrieval still unfolds through its middle');
      await page.screenshot({path:`${out}/${label}-retrieval.jpg`});
      await sleep(1300);
      assert.equal(await page.eval(()=>document.body.dataset.theme),'personal-letter');
      assert.equal(await page.eval(()=>!!document.querySelector('.paper-flex,.paper-return-back')),false);
      await page.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
      const nextTheme=await page.eval(()=>document.querySelector('.is-under').src.split('/').at(-1).replace('.html',''));
      await page.eval(()=>document.querySelector('#peel-corner').click());await sleep(100);
      assert.equal(await page.eval(()=>document.body.dataset.theme),nextTheme);
      assert.equal(await page.eval(()=>document.getAnimations().length),0);
      assert.deepEqual(page.consoleErrors,[]);
      results.push(`PASS ${label}: small damped bounce, quick settle, reachable fan, stable hover, slower retrieval and immediate reduced motion`);
      console.log(results.at(-1));
    } finally {await page.close();}
  }
} finally {await browser.close();writeFileSync(`${out}/checks.txt`,results.join('\n')+'\n');}
