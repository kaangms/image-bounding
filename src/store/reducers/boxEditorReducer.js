import {
  BOX_CREATION_ENDED,
  BOX_CREATION_STARTED,
  BOX_CREATION_UPDATED,
  IMAGE_RESIZED,
} from "../actions/boxEditorAction";

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
  isEditing: false,
};

export default function boxEditorReducer(state = initialState, action) {
  switch (action.type) {
    case IMAGE_RESIZED:
      return {
        ...state,
        scaleRatio: action.payload.scaleRatio,
        offsetX0: action.payload.offsetX0,
        offsetY0: action.payload.offsetY0,
        offsetX1: action.payload.offsetX1,
        offsetY1: action.payload.offsetY1,
      };

    case BOX_CREATION_STARTED:
      return {
        ...state,
        isEditing: true,
        id: action.payload.id,
        x0: action.payload.x - state.offsetX0,
        x1: action.payload.x - state.offsetX0,
        y0: action.payload.y - state.offsetY0,
        y1: action.payload.y - state.offsetY0,
      };

    case BOX_CREATION_UPDATED: {
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

    case BOX_CREATION_ENDED: {
      return {
        ...initialState,
        scaleRatio: state.scaleRatio,
        offsetX0: state.offsetX0,
        offsetY0: state.offsetY0,
        offsetX1: state.offsetX1,
        offsetY1: state.offsetY1,
      };
    }

    default:
      return state;
  }
}
