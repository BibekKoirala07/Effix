// import addItem from "./additem";
import addItems from "./additem";
import userSlice from "./User";
import { combineReducers } from "redux";

const rootReducers = combineReducers({
  // addItem,
  addItems,
  user: userSlice,
});

export default rootReducers;
