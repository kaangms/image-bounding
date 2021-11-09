import { combineReducers } from "redux";
import boxEditorReducer from "./reducers/boxEditorReducer";
import imageReducer from "./reducers/imageReducer";

const rootReducer = combineReducers({
  imageReducer,
  boxEditorReducer,
});
export default rootReducer;
