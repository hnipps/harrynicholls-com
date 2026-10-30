import { materialURL } from './paper-materials.js?v=scroll-20261030-1';

/** The discarded papers are navigation, with native buttons underneath their printed backs. */
export class PaperSheaf {
  constructor(root, themes, onSelect, onDismiss, reducedMotion) {
    this.root = root;
    this.themes = themes;
    this.onSelect = onSelect;
    this.onDismiss = onDismiss;
    this.reducedMotion = reducedMotion;
    this.list = root.querySelector('#discarded-papers');
    this.busy = false;
    this.touchOpened = false;
    root.addEventListener('pointerenter', event => {
      if (event.pointerType === 'mouse' && !this.busy) { root.classList.add('has-pointer-hover'); this.open(); }
    });
    root.addEventListener('pointerleave', () => {
      root.classList.remove('has-pointer-hover');
      clearTimeout(this.closeTimer);
      this.closeTimer = setTimeout(() => {
        if (!root.contains(document.activeElement)) this.close();
      },180);
    });
    root.addEventListener('focusin', event => {
      const keyboard = document.body.classList.contains('using-keyboard');
      if (keyboard) root.classList.remove('has-pointer-hover');
      this.open();
    });
    root.addEventListener('focusout', () => {
      setTimeout(() => {
        if (!root.contains(document.activeElement) && !root.matches(':hover')) this.close();
      },0);
    });
    root.addEventListener('pointerdown', event => {
      if (event.pointerType === 'touch') root.classList.remove('has-pointer-hover');
      this.touchOpened = event.pointerType === 'touch' && !this.expanded;
      if (this.touchOpened) this.open();
    },true);
    root.addEventListener('pointercancel',() => { this.touchOpened = false; });
    root.addEventListener('click', event => {
      const button = event.target.closest('[data-paper]');
      if (!button || this.busy) return;
      if (this.touchOpened) { this.touchOpened = false; this.open(); return; }
      onSelect(Number(button.dataset.paper));
    });
    root.addEventListener('keydown', event => this.onKey(event));
  }

  get expanded() { return this.root.classList.contains('is-expanded'); }

  open() {
    if (this.busy || this.root.hidden) return;
    clearTimeout(this.closeTimer);
    this.root.classList.add('is-expanded');
  }

  close() {
    clearTimeout(this.closeTimer);
    this.root.classList.remove('is-expanded');
  }

  setBusy(value) {
    this.busy = value;
    this.root.inert = value;
    if (value) this.close();
  }

  button(index) { return this.list.querySelector(`[data-paper="${index}"]`); }

  onKey(event) {
    document.body.classList.add('using-keyboard');
    this.root.classList.remove('has-pointer-hover');
    this.touchOpened = false;
    const buttons = [...this.list.querySelectorAll('button')];
    const index = buttons.indexOf(event.target);
    if (index < 0) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      this.close();
      this.onDismiss();
      return;
    }
    const directions = { ArrowRight:1, ArrowDown:1, ArrowLeft:-1, ArrowUp:-1 };
    let next = index;
    if (event.key in directions) next = (index + directions[event.key] + buttons.length) % buttons.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = buttons.length - 1;
    else return;
    event.preventDefault();
    buttons[next].focus();
  }

  render(history, arriving) {
    this.close();
    // Keep existing sheets alive so their slot changes use the CSS transition.
    const existing = new Map([...this.list.children].map(button=>[Number(button.dataset.paper),button]));
    existing.forEach((button,index)=>{if(!history.includes(index))button.remove();});
    this.root.hidden = history.length === 0;
    this.root.style.setProperty('--paper-count',history.length);
    history.forEach((index, position) => {
      const theme = this.themes[index];
      const button = existing.get(index) || document.createElement('button');
      button.type = 'button';
      button.className = 'paper-tab';
      button.dataset.paper = index;
      button.setAttribute('aria-label',`Bring back ${theme.name}`);
      button.setAttribute('aria-describedby','sheaf-help');
      button.style.setProperty('--slot',history.length - position - 1);
      button.style.setProperty('--layer',position + 1);
      button.style.setProperty('--sheet-ground',theme.paper);
      button.style.setProperty('--sheet-ink',theme.ink);
      button.style.setProperty('--sheet-print',materialURL(theme));
      button.style.setProperty('--print-opacity',theme.opacity);
      if (!existing.has(index)) {
        const face = document.createElement('span');
        face.className = 'paper-face';
        face.setAttribute('aria-hidden','true');
        const print = document.createElement('span');
        print.className = 'paper-print';
        print.setAttribute('aria-hidden','true');
        face.append(print);
        button.append(face);
      }
      if (this.list.children[position] !== button) this.list.insertBefore(button,this.list.children[position] || null);
    });
    const incoming = this.button(arriving);
    if (incoming && !this.reducedMotion.matches) {
      const resting = getComputedStyle(incoming).transform;
      incoming.animate([
        { transform:`${resting} translateY(190px) rotate(12deg)`, opacity:0 },
        { transform:resting, opacity:1 }
      ],{ duration:720,delay:160,easing:'cubic-bezier(.18,.8,.2,1)',fill:'backwards' });
    }
  }
}
