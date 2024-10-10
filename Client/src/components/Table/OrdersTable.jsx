import { CheckIcon } from "@heroicons/react/solid";
import React from "react";
import styles from "./Table.module.css";

const OrdersTable = ({ list, handleSearch, titleArray, fields, trigger }) => {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg" style={{ zIndex: 1 }}>
      <div className="p-4">
        <label for="table-search" className="sr-only">
          Search
        </label>
        <div className="relative mt-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-500 "
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </div>
          <input
            onChange={handleSearch}
            type="text"
            id="table-search"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 pl-10 p-2.5   "
            placeholder="Search for items"
          />
        </div>
      </div>
      <table className="w-full text-sm text-left text-gray-500 ">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
          <tr>
            {titleArray?.map((title) => (
              <th scope="col" className="px-6 py-3">
                {title}
              </th>
            ))}
            <th scope="col" className="px-6 py-3">
              <span className="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {list?.map((dat) => (
            <tr className="bg-white border-b ">
              {fields?.map((field, index) => (
                <td
                  className={`${index === 0
                    ? "font-medium text-gray-900  whitespace-nowrap"
                    : ""
                    } px-6 py-4`}
                >
                  {dat[field]}
                </td>
              ))}
              <td className="px-6 py-4 text-right">
                <div
                  className="font-sm  text-blue-600  hover:underline"
                  onClick={() => trigger(dat._id)}
                >
                  <CheckIcon color="green" className="h-[30px] cursor-pointer" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;
