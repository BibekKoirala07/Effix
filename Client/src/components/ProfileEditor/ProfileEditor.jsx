import { data } from "autoprefixer";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import {
  createUser,
  getService,
  updateUser,
} from "../../services/user.services";
import SelectMenu from "../MultiSelect/MultiSelect";

const ProfileEditor = ({ onClose }) => {
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    address: {
      state: "",
      city: "",
      street: "",
      postalCode: "",
      apartment: "",
    },
    role: "",
    categories: [],
    experience: "",
  });
  const backdrop = () => {
    onClose(false);
  };
  const user = useSelector((state) => state.user);
  const NUMBER = new RegExp("^[0-9]*$");
  const [list, setList] = useState([]);
  const history = useHistory();
  const handleInput = (e, type) => {
    if (type == "phone") {
      if (NUMBER.test(e.target.value))
        setData({ ...data, [type]: e.target.value });
    } else if (type == "categories") {
      setData({ ...data, [type]: data.categories.concat(e) });
    } else {
      setData({ ...data, [type]: e.target.value });
    }
  };
  const serviceList = async () => {
    const [response] = await getService();
    if (response) {
      setList(response?.data);
    }
  };
  const handleSubmit = async () => {
    const payload = { ...data };
    delete payload.password2;
    if (data.role == "user") {
      delete payload.categories;
      delete payload.experience;
    }
    const [response, error] = await updateUser(user.user._id, payload);
    if (response) {
      toast.success(response.data);
      history.push("/");
    } else {
      console.log(error);
      toast.error(error.response.data.msg);
    }
  };
  const handleRemove = (index) => {
    const temp = { ...data };
    console.log(index);
    const service = temp.categories.filter((item, iIndex) => iIndex !== index);
    setData({ ...temp, categories: service });
  };
  const handleAddress = (e, type) => {
    const temp = data;
    data.address[type] = e.target.value;
    setData({ ...temp });
  };
  useEffect(() => {
    const setInputValues = () => {
      const userVal = user?.user;
      console.log(userVal);

      setData({
        name: userVal.name,
        phone: userVal.phone,
        address: userVal.address,
        categories: userVal.categories,
        role: userVal.role,
      });
    };

    setInputValues();
    serviceList();
  }, [user]);

  return (
    <>
      {!user.isLoggedIn ? <Redirect to={"/"} /> : ""}
      <div className="min-w-screen min-h-[70vh] z-[12112]  flex items-center justify-center px-5 py-5">
        <div className="bg-gray-100 min-h-[50vh] max-w-[1080px] text-gray-500 rounded-3xl shadow-xl w-full overflow-hidden">
          <div className="min-h-[50vh] md:flex w-full ">
            <div className="w-full flex flex-col justify-center min-h-[50vh]  py-10 px-5 md:px-10">
              <div>
                <label
                  for="first_name"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="first_name"
                  value={data.name}
                  className="bg-gray-50 mb-3 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  placeholder="John"
                  required
                  onChange={(e) => handleInput(e, "name")}
                />
              </div>
              <div className="grid gap-6 mb-6 lg:grid-cols-2">
                <div>
                  <label
                    for="phone"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Phone number
                  </label>
                  <input
                    type="text"
                    id="phone"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    placeholder="123-45-678"
                    required
                    value={data.phone}
                    onChange={(e) => handleInput(e, "phone")}
                  />
                </div>
              </div>

              {/* <div>
                <label
                  for="countries"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Select Role
                </label>
                <select
                  id="countries"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 "
                  value={data.role}
                  onChange={(e) => handleInput(e, "role")}
                >
                  <option selected>Choose a Role</option>
                  <option value="user">User</option>
                  <option value="technician">Techician</option>
                </select>
              </div> */}
              <div>
                <label
                  for="website"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  State
                </label>
                <input
                  type="text"
                  id="website"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  placeholder="State"
                  required
                  value={data.address.state}
                  onChange={(e) => handleAddress(e, "state")}
                />
              </div>
              <div>
                <label
                  for="website"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  City
                </label>
                <input
                  type="text"
                  id="website"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 "
                  placeholder="City"
                  required
                  value={data.address.city}
                  onChange={(e) => handleAddress(e, "city")}
                />
              </div>
              <div>
                <label
                  for="website"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Street
                </label>
                <input
                  type="text"
                  id="website"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 "
                  placeholder="Street Address"
                  required
                  value={data.address.street}
                  onChange={(e) => handleAddress(e, "street")}
                />
              </div>
              <div>
                <label
                  for="website"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Postal Code
                </label>
                <input
                  type="text"
                  id="website"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 "
                  placeholder="Your Postal Code"
                  required
                  value={data.address.postalCode}
                  onChange={(e) => handleAddress(e, "postalCode")}
                />
              </div>
              <div>
                <label
                  for="website"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Apartment
                </label>
                <input
                  type="url"
                  id="website"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 "
                  placeholder="Apartment Name"
                  required
                  value={data.address.apartment}
                  onChange={(e) => handleAddress(e, "apartment")}
                />
              </div>

              {data.role === "technician" ? (
                <div>
                  <div>
                    <label
                      for="countries_multiple"
                      className="block mb-2 text-sm font-medium text-gray-900 "
                    >
                      Categories
                    </label>
                    <SelectMenu
                      list={list}
                      value={data.categories}
                      handleInput={handleInput}
                      removeCategory={handleRemove}
                    />
                  </div><div>
                    <label
                      for="website"
                      className="block mb-2 text-sm font-medium text-gray-900 "
                    >
                      Experience
                    </label>
                    <input
                      type="url"
                      id="website"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 "
                      placeholder="Experience(in years)"
                      required
                      value={data.experience}
                      onChange={(e) => handleInput(e, "experience")}
                    />
                  </div>
                </div>
              ) : (
                ""
              )}
              <button
                onClick={handleSubmit}
                className=" text-white bg-accent px-[5rem] flex flex-col w-max mt-[2em] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm  sm: py-2.5 text-center "
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileEditor;
