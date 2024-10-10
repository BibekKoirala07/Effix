import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { createAdmin, createService } from "../../services/user.services";

const CreateService = () => {
  const history = useHistory();
  const [file, setFile] = useState("");
  const [image, setImage] = useState("");
  const [data, setData] = useState({
    email: "",
    password: "",
    password2: "",
    phone: "",
    name: "",
  });
  const handleInput = (e, type) => {
    setData({ ...data, [type]: e.target.value });
  };

  const handleSubmit = async () => {
    if (data.password == data.password2) {
      const payload = { ...data };
      delete payload.password2;
      const [response] = await createAdmin(payload);
      if (response) {
        history.push("/dashboard");
        toast.success("Successfully created an Admin");
      } else {
        toast.error("Something went wrong");
      }
    } else {
      toast.error("Passwords do not match");
    }
  };
  return (
    <div>
      <div className="grid gap-6 mb-6 lg:grid-cols-2">
        <div>
          <label
            for="first_name"
            className="block mb-2 text-sm font-medium text-gray-900 "
          >
            Name
          </label>
          <input
            type="text"
            id="first_name"
            value={data.name}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            placeholder="John"
            required=""
            onChange={(e) => handleInput(e, "name")}
          />
        </div>
      </div>
      <div>
        <label
          for="phone"
          className="block mb-2 text-sm font-medium text-gray-900 "
        >
          Phone number
        </label>
        <input
          type="tel"
          id="phone"
          value={data.phone}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
          placeholder="123-45-678"
          pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
          required
          onChange={(e) => handleInput(e, "phone")}
        />
      </div>
      <div className="mb-6">
        <label
          for="email"
          className="block mb-2 text-sm font-medium text-gray-900 "
        >
          Email address
        </label>
        <input
          type="email"
          id="email"
          value={data.email}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
          placeholder="john.doe@company.com"
          required
          onChange={(e) => handleInput(e, "email")}
        />
      </div>
      <div className="mb-6">
        <label
          for="password"
          className="block mb-2 text-sm font-medium text-gray-900 "
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          value={data.password}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
          placeholder="•••••••••"
          required
          onChange={(e) => handleInput(e, "password")}
        />
      </div>
      <div className="mb-6">
        <label
          for="confirm_password"
          className="block mb-2 text-sm font-medium text-gray-900 "
        >
          Confirm password
        </label>
        <input
          type="password"
          id="confirm_password"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
          placeholder="•••••••••"
          required
          value={data.password2}
          onChange={(e) => handleInput(e, "password2")}
        />
      </div>

      <button
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center "
        onClick={() => handleSubmit()}
      >
        Submit
      </button>
    </div>
  );
};

export default CreateService;
