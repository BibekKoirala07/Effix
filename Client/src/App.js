import "./App.css";
import Footer from "./components/Footer";
import { useLocation } from "react-router-dom";
import Login from "./components/buttons/Login";
import { useDispatch, useSelector } from "react-redux";
import {
  toogleLogin,
  toogleRegister,
  tooglePassword,
  toogleEmail,
  toogleSpinner,
} from "./redux/reducers/User";
import NavBar from "./components/NavBar";
import "react-toastify/dist/ReactToastify.css";

import Layout from "./dashboard/Landing/Landing";
import DashHome from "./dashboard/Home/DashHome";
import routes, { renderRoutes } from "./routes";
import Signup from "./components/buttons/Signup";
import { useEffect, useState } from "react";
import { getUserDetails } from "./redux/actions/user.actions";
import Header from "./components/Header";
import { toast, ToastContainer } from "react-toastify";
import OrderCart from "./components/OrderCart/OrderCart";
import { getMyOrders } from "./services/user.services";
import Password from "./components/buttons/Password";
import Email from "./components/buttons/Email";
import Spinner from "./components/Spinner/Spinner";
import { deleteOrder } from "./services/service.services";
import { Route, Switch } from "react-router-dom/cjs/react-router-dom.min";
import Home from "./components/Home";
import Services from "./components/Services";
import Contact from "./components/Contact";
import ServicesDetail from "./components/ServicesDetail";
import Cart from "./components/Cart";
import About from "./components/About";
import Technician from "./components/Technician";

const App = () => {
  const loginPopup = useSelector((state) => state.user.loginpopup);
  const password = useSelector((state) => state.user.password);
  const emailPopup = useSelector((state) => state.user.emailPopup);
  const user = useSelector((state) => state.user.user);
  const spinner = useSelector((state) => state.user.spinner);

  const registerPopup = useSelector((state) => state.user.registerPopup);
  const [cart, setCart] = useState(false);
  const [orders, setOrders] = useState([]);
  const dispatch = useDispatch();

  const handleLoginClose = (value) => {
    dispatch(toogleLogin(value));
  };

  const handlePasswordClose = (value) => {
    dispatch(tooglePassword(value));
  };

  const handleEmailClose = (value) => {
    dispatch(toogleEmail(value));
  };

  const handleRegisterClose = (value) => {
    dispatch(toogleRegister(value));
  };

  const location = useLocation();

  const getOrders = async () => {
    dispatch(toogleSpinner(true));

    // const [response] = await getMyOrders();
    // if (response) {
    //   console.log(response.data);
    //   setOrders(
    //     response?.data?.map((value) => {
    //       return {
    //         ...value,
    //         name: value?.service?.title,
    //         date: value?.createdAt?.slice(0, 10),
    //         imageSrc: value?.service?.image || "",
    //       };
    //     })
    //   );
    //   dispatch(toogleSpinner(false));
    // } else {
    //   dispatch(toogleSpinner(false));
    // }
    try {
      const [response] = await getMyOrders();
      console.log("response in getOrders", response);
      if (response) {
        setOrders(
          response?.data?.map((value) => ({
            ...value,
            name: value?.service?.title,
            date: value?.createdAt?.slice(0, 10),
            imageSrc: value?.service?.image || "",
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      // console.log("dispatch toggleSpinner run bhayo");
      dispatch(toogleSpinner(false));
    }
  };

  const handleDeleteOrder = async (id) => {
    dispatch(toogleSpinner(true));
    const [response] = await deleteOrder(id);
    if (response) {
      toast.success("Order deleted successfully");
      dispatch(toogleSpinner(false));
      getOrders();
    } else {
      dispatch(toogleSpinner(false));
    }
  };

  // useEffect(() => {
  //   getOrders();
  // }, [user]);

  useEffect(() => {
    getOrders();
  }, []);

  useEffect(() => {
    let isMounted = true;
    dispatch(getUserDetails()).then((response) => {
      dispatch(toogleSpinner(false));
    });
    return () => {
      isMounted = false;
    };
  }, [location]);

  // useEffect(() => {
  //   let isMounted = true;
  //   dispatch(getUserDetails())
  //     .then(() => {
  //       if (isMounted) {
  //         dispatch(toogleSpinner(false));
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching user details:", error);
  //       if (isMounted) {
  //         dispatch(toogleSpinner(false));
  //       }
  //     });

  //   return () => {
  //     isMounted = false;
  //   };
  // }, [location]);

  return (
    <>
      <ToastContainer style={{ zIndex: 12312312321 }} />
      {location.pathname?.split("/")[1] != "admin" &&
      location.pathname?.split("/")[1] != "technician" ? (
        <Header
          toogleLogin={handleLoginClose}
          toogleRegister={handleRegisterClose}
          toogleOrder={setCart}
          count={orders.length}
        />
      ) : (
        ""
      )}
      <OrderCart
        open={cart}
        setOpen={setCart}
        products={orders}
        deleteOrder={handleDeleteOrder}
      />
      {loginPopup ? (
        <Login onClose={handleLoginClose} signUp={handleRegisterClose} />
      ) : (
        <div />
      )}
      {registerPopup ? <Signup onClose={handleRegisterClose} /> : <div />}
      {password ? <Password onClose={handlePasswordClose} /> : <div />}
      {emailPopup ? <Email onClose={handleEmailClose} /> : <div />}

      {renderRoutes(routes)}

      <Switch>
        {/* <Route exact path="/" component={Home} />
        <Route exact path="/services" component={Services} />
        <Route exact path="/services/:id" component={ServicesDetail} />
        <Route exact path="/cart" component={Cart} />
        <Route exact path="/about" component={About} />
        <Route exact path="/contact" component={Contact} />
        <Route exact path="/technician" component={Technician} /> */}
      </Switch>
      {spinner && <Spinner />}
      {/* {true && <Spinner />} */}
      <Footer />
    </>
  );
};

export default App;
