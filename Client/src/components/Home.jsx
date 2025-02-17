import React from "react";
import { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import {
  activateUser,
  switchEmail,
  switchPassword,
} from "../services/user.services";
import MainBanner from "./Banner/Banner";
import ResetPassword from "./buttons/ResetPw";
import Category from "./Category/Category";
import ItemList from "./List/List";
import Services from "./Services";

const Home = (props) => {
  const activateAccount = async () => {
    const [response, error] = await activateUser({
      token: props.match.params.id,
    });
    console.log("response and error in activeAccount", response, error);
    if (response) {
      toast.success("Account activation successful");
      props.history.push("/");
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
  };

  const changeEmail = async () => {
    const [response, error] = await switchEmail({
      token: props.match.params.id,
    });
    if (response) {
      toast.success("Email updated successful");
      props.history.push("/");
    } else {
      if (error.response.data.errors) {
        error.response.data.errors.forEach((msg) => {
          toast.error(msg.msg);
        });
      } else {
        toast.error(error.response.data.msg);
      }
    }
  };
  useEffect(() => {
    if (props?.match?.path.split("/")[2] === "activation") {
      activateAccount();
    } else if (props?.match?.path.split("/")[2] === "email") {
      changeEmail();
    }
    console.log(props.match.path.split("/"));
  }, []);
  return (
    <div className="home" className="flex flex-col ">
      <MainBanner />

      <ItemList id="Services" />
      {/* <Category /> */}
      {props?.match?.path.split("/")[2] === "password" && (
        <ResetPassword {...props} />
      )}
    </div>
  );
};

export default Home;
