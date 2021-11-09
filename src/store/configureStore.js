import { createStore } from "redux";
import rootRedecure from "./index";

export default function configureStore() {
  return createStore(
    rootRedecure,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
}
