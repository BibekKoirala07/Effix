import { createSlice } from "@reduxjs/toolkit";
import { getUserDetails } from "../actions/user.actions";

const initialState = {
  loginpopup: false,
  registerPopup: false,

  password: false,
  emailPopup: false,
  isLoggedIn: false,
  user: {},
  loading: true,
  spinner: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    toogleLogin(state, action) {
      state.loginpopup = action.payload;
    },

    toogleRegister(state, action) {
      state.registerPopup = action.payload;
    },
    tooglePassword(state, action) {
      state.password = action.payload;
    },
    toogleEmail(state, action) {
      state.emailPopup = action.payload;
    },

    toogleSpinner(state, action) {
      state.spinner = action.payload;
    },
  },
  extraReducers: {
    [getUserDetails.pending.toString()]: (state, action) => {
      state.loading = true;
    },
    [getUserDetails.fulfilled.toString()]: (state, action) => {
      state.loginpopup = false;
      state.registerPopup = false;
      // console.log(action.payload);
      const [response] = action.payload;

      if (response) {
        state.isLoggedIn = true;

        state.user = response.data;
      } else {
        state.isLoggedIn = false;
        state.user = {};
      }
      state.loading = false;
    },
    [getUserDetails.rejected.toString()]: (state) => {
      state.loading = false;
      state.isLoggedIn = false;
    },
  },
});

const { actions, reducer } = userSlice;
export const {
  toogleLogin,
  toogleRegister,
  toogleEmail,
  tooglePassword,
  toogleSpinner,
} = actions;

export default reducer;
