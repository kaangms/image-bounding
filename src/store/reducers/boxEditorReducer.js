import * as actionTypes from "../actions/boxEditorAction";

export const initialState = {
  scaleRatio: 1,
  offsetX0: 0,
  offsetY0: 0,
  offsetX1: 0,
  offsetY1: 0,
  x0: 0,
  y0: 0,
  x1: 0,
  y1: 0,
  id: null,
  ticket: "",
  isThereTicket: false,
  isEditing: false,
  data: null,
};

export default function boxEditorReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.IMAGE_RESIZED:
      return {
        ...state,
        scaleRatio: action.payload.scaleRatio,
        offsetX0: action.payload.offsetX0,
        offsetY0: action.payload.offsetY0,
        offsetX1: action.payload.offsetX1,
        offsetY1: action.payload.offsetY1,
      };

    case actionTypes.BOX_CREATION_STARTED:
      return {
        ...state,
        isEditing: true,
        id: action.payload.id,
        x0: action.payload.x - state.offsetX0,
        x1: action.payload.x - state.offsetX0,
        y0: action.payload.y - state.offsetY0,
        y1: action.payload.y - state.offsetY0,
      };

    case actionTypes.BOX_CREATION_UPDATED: {
      return {
        ...state,
        x1:
          Math.min(Math.max(action.payload.x, state.offsetX0), state.offsetX1) -
          state.offsetX0,
        y1:
          Math.min(Math.max(action.payload.y, state.offsetY0), state.offsetY1) -
          state.offsetY0,
      };
    }

    case actionTypes.BOX_CREATION_ENDED: {
      return {
        ...state,
        isEditing: initialState.isEditing,
        isThereTicket: true,
      };
    }
    case actionTypes.BOX_CREAT_TICKET: {
      return {
        ...state,
        scaleRatio: state.scaleRatio,
        offsetX0: state.offsetX0,
        offsetY0: state.offsetY0,
        offsetX1: state.offsetX1,
        offsetY1: state.offsetY1,
        ticket: action.payload,
      };
    }
    case actionTypes.BOX_CREAT_TICKET_SAVED: {
      return {
        ...initialState,
        scaleRatio: state.scaleRatio,
        offsetX0: state.offsetX0,
        offsetY0: state.offsetY0,
        offsetX1: state.offsetX1,
        offsetY1: state.offsetY1,
        ticket: state.ticket,
      };
    }

    default:
      return state;
  }
}
