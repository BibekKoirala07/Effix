import React from "react";
import styles from "./Table.module.css";

const DefaultTable = ({ list, handleSearch, titleArray, fields, admin }) => {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500 ">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
          <tr>
            {titleArray?.map((title) => (
              <th scope="col" className="px-6 py-3">
                {title}
              </th>
            ))}
            {!admin && (
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Edit</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {list?.map((dat) => (
            <tr className="bg-white border-b ">
              {fields?.map((field, index) => (
                <td
                  className={`${index === 0 ? "font-medium text-gray-900 " : ""
                    } px-6 py-4`}
                >
                  {dat[field]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DefaultTable;
