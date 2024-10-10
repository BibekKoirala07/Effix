import addItem from "./additem";
import userSlice from "./User";
import { combineReducers } from "redux";

const rootReducers = combineReducers({
  addItem,
  user: userSlice,
});

export default rootReducers;
