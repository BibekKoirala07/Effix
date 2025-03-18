import React, { useState } from "react";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  createService,
  editService,
  getService,
  getServiceById,
} from "../../services/user.services";

const CreateService = (props) => {
  const history = useHistory();
  const [file, setFile] = useState("");
  const [image, setImage] = useState("");
  const [data, setData] = useState({
    title: "",
    description: "",
  });
  const handleFile = (e) => {
    e.preventDefault();

    let reader = new FileReader();

    let file = e.target.files;
    setFile(file[0]);
    reader.onloadend = () => {
      setImage(reader.result);
    };
    if (file[0]) {
      reader.readAsDataURL(file[0]);
    }
  };
  const handleInput = (e, type) => {
    setData({ ...data, [type]: e.target.value });
  };
  const handleEdit = async () => {
    const formdata = new FormData();
    formdata.set("title", data.title);
    formdata.set("description", data.description);
    formdata.set("image", file);

    const [response] = await editService(formdata, props.match.params.id);
    if (response) {
      history.push("/admin/dashboard/services");
    }
  };

  const handleSubmit = async () => {
    if (props.match.params.id) {
      handleEdit();
    } else {
      console.log(file);
      const formdata = new FormData();
      formdata.set("title", data.title);
      formdata.set("description", data.description);
      formdata.set("image", file);

      console.log("file", file);

      const [response] = await createService(formdata);
      console.log("response in service create", response);
      if (response) {
        history.push("/admin/dashboard/services");
      }
    }
  };
  const getService = async () => {
    const [response, error] = await getServiceById(props.match.params.id);

    if (response) {
      console.log(response.data);
      setData(response?.data);
    }
  };
  useEffect(() => {
    if (props.match?.params?.id) {
      getService();
    }
  }, []);
  return (
    <div>
      <div className="grid gap-6 mb-6 lg:grid-cols-2">
        <div>
          <label
            for="first_name"
            className="block mb-2 text-sm font-medium text-gray-900 "
          >
            Title
          </label>
          <input
            type="text"
            id="first_name"
            value={data.title}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            placeholder="John"
            required=""
            onChange={(e) => handleInput(e, "title")}
          />
        </div>
      </div>
      <div className="mb-6">
        <label
          for="email"
          className="block mb-2 text-sm font-medium text-gray-900 "
        >
          Description
        </label>
        <textarea
          id="message"
          rows="4"
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
          placeholder="Your message..."
          value={data.description}
          onChange={(e) => handleInput(e, "description")}
        ></textarea>
      </div>
      {image ? (
        <img src={image} className="mb-4" />
      ) : (
        <div className="flex justify-center items-center w-full mb-4">
          <label
            for="dropzone-file"
            className="flex flex-col justify-center items-center w-full h-64 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer "
          >
            <div className="flex flex-col justify-center items-center pt-5 pb-6">
              <svg
                className="mb-3 w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                ></path>
              </svg>
              <p className="mb-2 text-sm text-gray-500 ">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500 ">
                SVG, PNG, JPG or GIF (MAX. 800x400px)
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              onChange={handleFile}
            />
          </label>
        </div>
      )}

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
