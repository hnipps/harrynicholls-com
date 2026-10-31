import {homedir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
const skill=process.env.DESIGN_TASTE_SKILL || join(homedir(),'.agents/skills/design-taste-frontend');
const client=await import(pathToFileURL(join(skill,'scripts/lib/cdp.mjs')).href);
export const {Browser,sleep}=client;
export async function scrollCurrentFrame(page,top=0) {
  await page.eval(y=>document.querySelector('.is-current').contentWindow.scrollTo(0,y),top);
  await sleep(100);
}
