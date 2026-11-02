/** How a hand moves the stack. Any event a mode does not list is ignored. */
const moves = {
  rest:     { press:'drag', peel:'loading', select:'fetching' },
  drag:     { release:'rest', commit:'loading', cancel:'rest' },
  loading:  { ready:'peel', fail:'rest' },
  peel:     { done:'rest', fail:'rest' },
  fetching: { ready:'return', fail:'rest' },
  return:   { done:'rest', fail:'rest' }
};
export const modes = Object.keys(moves);
export const events = [...new Set(Object.values(moves).flatMap(Object.keys))];

export const resting = active => ({ mode:'rest', active, incoming:null });

export function step(state, event) {
  const mode = moves[state.mode][event.type];
  if (!mode) return state;
  if (mode === 'rest') return resting(event.type === 'done' ? state.incoming : state.active);
  if (['peel','commit','select'].includes(event.type)) return { mode, active:state.active, incoming:event.index };
  return { ...state, mode };
}

/**
 * A scroll gesture stays with whatever it first touched, momentum included.
 * So while a sheet is moving, the only thing that takes input is the page
 * being read when it lands, and the host's own controls take none.
 */
export function layers(state) {
  const moving = state.mode === 'peel' || state.mode === 'return';
  return {
    reading: moving ? state.incoming : state.active,
    turning: moving,
    returning: state.mode === 'return',
    cornerLive: state.mode === 'rest' || state.mode === 'drag'
  };
}
