import { useState } from "react";
import { StarIcon } from "@heroicons/react/solid";
import { RadioGroup } from "@headlessui/react";
import {
  getSingleService,
  orderService,
} from "../../services/service.services";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { URL_BACKEND } from "../../config/constant";

const reviews = { href: "#", average: 4, totalCount: 117 };

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function SinglePage(props) {
  const [data, setData] = useState({
    image: "",
    description: "",
    title: "",
  });
  const handleNote = (e) => {
    setData({ ...data, note: e.target.value });
  };
  const handleOrder = async () => {
    const payload = { service: props?.match?.params?.id, notes: data.note };
    const [response, error] = await orderService(payload);
    if (response) {
      if (response.data.msg) {
        toast.success(response.data.msg);
      } else {
        toast.success("Service Order added successfully");
      }
      props.history.push("/");
    } else {
      toast.error(error.response.data.msg);
    }
  };

  const getSingleProduct = async () => {
    const [response] = await getSingleService(props?.match?.params?.id);
    console.log("response", response);
    if (response) {
      const iterate = response.data;
      console.log(iterate);
      setData({ ...data, ...iterate });
    } else {
      props.history.push("/");
    }
  };
  useEffect(() => {
    getSingleProduct();
  }, []);
  return (
    <div className="bg-white">
      <div className="pt-6">
        {/* Image gallery */}
        <div className="mt-6 max-w-2xl mx-auto sm:px-6 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-1 lg:gap-x-3">
          <div className=" w-full flex justify-center aspect-h-9 rounded-lg overflow-hidden ">
            <img
              src={
                data.image
                  ? `${URL_BACKEND}/${data.image}`
                  : "/photos/services/placeholder.jpg"
              }
              onError={(e) =>
                (e.target.src = "/photos/services/placeholder.jpg")
              }
              alt={"Service"}
              className="w-auto h-[550px] object-center object-cover"
            />
          </div>
        </div>

        {/* Product info */}
        <div className="max-w-2xl mx-auto pt-10 pb-16 px-4 sm:px-6 lg:max-w-7xl lg:pt-16 lg:pb-24 lg:px-8 lg:grid lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8">
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              {data.title}
            </h1>
          </div>

          {/* Options */}
          <div className="mt-4 lg:mt-0 lg:row-span-3">
            <label
              for="message"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              Your Order Message
            </label>
            <textarea
              id="message"
              rows="4"
              value={data.note}
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
              placeholder="Your contact details.... &#13;&#10;Your location details.... &#13;&#10;Your problem description...."
              onChange={(e) => handleNote(e)}
            ></textarea>

            <button
              onClick={() => handleOrder()}
              className="mt-10 w-full bg-accent border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Confirm Order
            </button>
          </div>

          <div className="py-10 lg:pt-6 lg:pb-16 lg:col-start-1 lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            {/* Description and details */}
            <div>
              <h3 className="sr-only">Description</h3>

              <div className="space-y-6">
                <p className="text-base text-gray-900">{data.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
