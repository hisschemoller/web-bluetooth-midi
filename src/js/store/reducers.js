
const initialState = {
  data0: 0, 
  data1: 0, 
  data2: 0,
};

/**
 * 
 * @param {Object} state 
 * @param {Object} action 
 * @param {String} action.type
 */
export default function reduce(state = initialState, action, actions = {}) {
  switch (action.type) {

    case actions.HANDLE_MIDI_MESSAGE: {
      const { data0, data1, data2 } = action;
      return { ...state, data0, data1, data2 };
    }

    default:
      return state ? state : initialState;
  }
}
