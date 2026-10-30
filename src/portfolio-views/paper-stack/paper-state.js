const last=5;
const order=[0,1,2,3,4];
const unique=values=>[...new Set(values)].filter(i=>Number.isInteger(i)&&i>=0&&i<last);

/** Every view has one physical location. HTML is permanently the bottom sheet. */
export function restorePapers(active=0,papers=[],savedDeck=null) {
  const current=Number.isInteger(active)&&active>=0&&active<=last ? active : 0;
  const discarded=unique(Array.isArray(papers)?papers:[]).filter(i=>i!==current);
  if(current===last) return {deck:[last],discarded:unique([...discarded,...order])};
  const behind=unique([...(Array.isArray(savedDeck)?savedDeck:[]),...order]).filter(i=>i!==current&&!discarded.includes(i));
  return {deck:[current,...behind,last],discarded};
}

export function peelPaper(state) {
  if(state.deck.length===1) return state;
  return {deck:state.deck.slice(1),discarded:[...state.discarded,state.deck[0]]};
}

export function retrievePaper(state,index) {
  if(!state.discarded.includes(index)||index===last) return state;
  return {deck:[index,...state.deck],discarded:state.discarded.filter(i=>i!==index)};
}
