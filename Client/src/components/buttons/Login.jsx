import React, { Fragment } from "react";
import { useState } from "react";
import { forgotPassword, loginService } from "../../services/user.services";
import Cookies from "universal-cookie";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails } from "../../redux/actions/user.actions";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { toogleSpinner } from "../../redux/reducers/User";
const Login = (props) => {
  const { onClose, signUp } = props;
  const backdrop = () => {
    onClose(false);
  };
  const [data, setData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const dispatch = useDispatch();
  const router = useHistory();
  const spinner = useSelector((state) => state.user.spinner);

  const handleLogin = async () => {
    dispatch(toogleSpinner(true));
    const [response, error] = await loginService(data);
    if (response) {
      const cookies = new Cookies();
      cookies.set("token", response.data.token, { path: "/" });
      onClose(false);
      dispatch(getUserDetails()).then((response) => {
        const [res] = response.payload;
        if (res.data.role == "technician") {
          console.log("here1", res.data.role);
          // router.push("/technician/dashboard");
          router.push("/");
        }
        if (res.data.role.trim() == "admin") {
          console.log("here", res.data.role);
          // router.push("/admin/dashboard");
          router.push("/");
        }
        router.go(0);
      });
    } else {
      console.log(error);
      if (error.response.data.errors) {
        error.response.data.errors.forEach((msg) => {
          toast.error(msg.msg);
        });
      } else {
        toast.error(error.response.data.msg);
      }
    }

    dispatch(toogleSpinner(false));
  };

  const handleForgot = async () => {
    dispatch(toogleSpinner(true));
    if (!data.email) {
      toast.error("Email is required");

      dispatch(toogleSpinner(false));
    }
    const [response, error] = await forgotPassword({ email: data.email });
    if (response) {
      toast.success(response?.data);
      onClose(false);
    } else {
      console.log(error);
      dispatch(toogleSpinner(false));
      if (error?.response?.data?.errors) {
        error?.response?.data?.errors.forEach((msg) => {
          toast.error(msg.msg);
        });
      } else if (error?.response) {
        toast.error(error?.response?.data?.msg);
      } else {
        toast.error("Something went wrong");
      }
    }
    dispatch(toogleSpinner(false));
  };

  const handleInput = (e, type) => {
    if (type === "remember") {
      setData({ ...data, [type]: e.target.checked });
    } else {
      setData({ ...data, [type]: e.target.value });
    }
  };

  return (
    <div className="min-h-screen fixed top-[0%] left-[0%] w-[100vw]  z-[122200] flex flex-col justify-center items-center sm:py-12">
      <div
        onClick={() => backdrop()}
        className="w-full h-full absolute top-0 left-0 backdrop-blur-sm bg-black/50 z-[1]"
      ></div>
      <div className="bg-white pt-5 md:w-full md:max-w-md shadow w-full rounded-[20px] z-[22] flex flex-col justify-center items-center">
        <div className="bg-accent max-w-[150px] w-max px-4 py-4 rounded-[10px]">
          <img src="/photos/logo.png" alt="fixing"></img>
        </div>
        <div className="px-7 py-7 w-[80%]">
          <label className="font-semibold text-sm text-gray-600 pb-1 block">
            E-mail
          </label>
          <input
            type="text"
            value={data.email}
            onChange={(e) => handleInput(e, "email")}
            className="border rounded-lg px-3 py-2 mt-1 mb-4 text-sm w-full"
          />
          <label className="font-semibold text-sm text-gray-600 pb-1 block">
            Password
          </label>
          <input
            onChange={(e) => handleInput(e, "password")}
            type="password"
            value={data.password}
            className="border rounded-lg px-3 py-2 mt-1 mb-2 text-sm w-full"
          />
          <div className="flex flex-row my-4 items-center w-max">
            <input
              type="checkbox"
              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
              checked={data.remember}
              onChange={(e) => handleInput(e, "remember")}
            />
            <label
              for="comments"
              className="ml-2 text-sm font-normal text-gray-600"
            >
              Remember me
            </label>
          </div>
          <button
            type="button"
            className="transition duration-200 bg-accent hover:bg-secondary focus:bg-secondary focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
            onClick={handleLogin}
          >
            <span className="inline-block mr-2">Login</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-4 h-4 inline-block"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
        </div>
        <div className="flex items-center mb-6 justify-center border-t-[1px] border-t-slate-300 w-[80%] relative">
          <div className="-mt-1 font-bod bg-white px-5 absolute">Or</div>
        </div>
        <button
          type="button"
          className="transition mt-1 w-[50%] duration-200 shadow-none  focus:ring-opacity-50 text-accent w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-lg font-semibold text-center inline-block"
        >
          <span
            className="inline-block mr-2"
            onClick={() => {
              backdrop();
              signUp(true);
            }}
          >
            Sign up
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-4 h-4 inline-block"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </button>
        <div className="py-4">
          <div className="text-center sm:text-left whitespace-nowrap">
            <button className="transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-4 h-4 inline-block align-text-top"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                />
              </svg>
              <span className="inline-block ml-1" onClick={handleForgot}>
                Forgot Password
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
