import * as actionTypes from "../actions/imageAction";

export const initialState = {
  selectedImg: null,
  images: {},
};
const initialImageState = {
  boxes: [],
  timelineIdx: 0,
};

export default function imageReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.IMAGE_RECEIVED:
      return {
        ...state,
        selectedImg: action.payload[action.payload.length - 1],
        images: action.payload.reduce((imagesDict, imgSrc) => {
          imagesDict[imgSrc] = initialImageState;
          return imagesDict;
        }, {}),
      };
    case actionTypes.IMAGE_CHANGED:
      return {
        ...state,
        selectedImg: action.payload,
        // images: action.payload.reduce((imagesDict, imgSrc) => {
        //   imagesDict[imgSrc] = initialImageState;
        //   return imagesDict;
        // }, {}),
      };

    case actionTypes.IMAGE_BOX_CREATED:
      // console.log(action.payload);

      const newBoxes = [
        ...state.images[state.selectedImg].boxes.slice(
          0,
          state.images[state.selectedImg].timelineIdx
        ),
        action.payload,
      ];
      // state.images.selectedImg.boxes.filter((b) => b.ticket);
      return {
        ...state,
        images: {
          ...state.images,
          [state.selectedImg]: {
            boxes: newBoxes,
            timelineIdx: newBoxes.length,
          },
        },
      };

    case actionTypes.IMAGE_BOX_TICKET_UPDATED:
      const newBoxes1 = [
        ...state.images[state.selectedImg].boxes.slice(
          0,
          state.images[state.selectedImg].timelineIdx
        ),
        action.payload,
      ];
      return {
        ...state,
        images: {
          ...state.images,
          [state.selectedImg]: {
            boxes: newBoxes1,
            timelineIdx: newBoxes1.length,
          },
        },
      };
    default:
      return state;
    // throw new Error(`Unknown action type "${action.type}"`);
  }
}
