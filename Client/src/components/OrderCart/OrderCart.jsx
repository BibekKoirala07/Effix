/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { URL_BACKEND } from "../../config/constant";
import { toast } from "react-toastify";
import { paymentOption, deleteOrder } from "../../services/service.services";

export default function OrderCart({ open, setOpen, products, deleteOrder }) {


  const handlePay = async (id) => {
    const [response, error] = await paymentOption(id);
    if (response) {
      console.log(response);
      window.open(response.data);
    }
    if (error) {
      toast.error("Something Went wrong.Try Again");
    }
  };



  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-[12220]" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          {" "}
                          My Orders{" "}
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={() => setOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          <ul
                            role="list"
                            className="-my-6 divide-y divide-gray-200"
                          >
                            {products.map((product) => (
                              <li key={product.id} className="flex py-6">
                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">

                                  <img
                                    src={
                                      product.imageSrc
                                        ? `${URL_BACKEND}${product.imageSrc}`
                                        : "photos/services/placeholder.jpg"
                                    }
                                    onError={(e) => e.target.src = "/photos/services/placeholder.jpg"}

                                    alt={product.imageAlt}
                                    className="h-full w-full object-cover object-center"
                                  />
                                </div>

                                <div className="ml-4 flex flex-1 flex-col">
                                  <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                      <h3>
                                        <a href={product.href}>
                                          {" "}
                                          {product.name}{" "}
                                        </a>
                                      </h3>
                                      <p className="ml-4 font-bold">
                                        {product?.amount?.$numberDecimal &&
                                          "$ " +
                                          product?.amount?.$numberDecimal}
                                      </p>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">
                                      {product.date}
                                    </p>
                                  </div>
                                  <div className="flex mt-auto items-center justify-between text-sm">
                                    <div className="mt-1 text-[1.2em] text-green-500 uppercase">
                                      {product.status}
                                    </div>

                                    {product.status === "ordered" && (
                                      <div className="flex">
                                        <button
                                          onClick={() => deleteOrder(product._id)}
                                          type="button"
                                          className="font-medium px-4 bg-accent text-white rounded py-2 text-indigo-600 hover:text-indigo-500"
                                        >
                                          Delete Order
                                        </button>
                                      </div>
                                    )}

                                    {product.status === "completed" && (
                                      <div className="flex">
                                        <button
                                          onClick={() => handlePay(product._id)}
                                          type="button"
                                          className="font-medium px-4 bg-accent text-white rounded py-2 text-indigo-600 hover:text-indigo-500"
                                        >
                                          Pay
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
