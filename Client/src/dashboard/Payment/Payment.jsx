import React, { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { orderStatus } from "../../services/service.services";

import DefaultTable from "../../components/Table/DefaultTable";
import PaymentEmail from "../../components/buttons/Payment";

const OrdersStatus = () => {
  const [list, setList] = useState([]);
  const [id, setId] = useState({ id: "", e: "" });
  const [email, setEmail] = useState(false);
  let [isOpen, setIsOpen] = useState(false);

  let [completeModal, setCompleteModal] = useState(false);
  const user = useSelector((state) => state.user);
  const handleSearch = (e) => { };
  const router = useHistory();
  const titleArray = ["Service Title", "Note", "Order Date", "Client Name"];
  const fields = ["title", "notes", "orderDate", "client"];
  const serviceList = async () => {
    const [response] = await orderStatus();
    if (response) {
      setList(
        response.data.map((val) => {
          return {
            ...val,
            title: val.service.title,
            orderDate: new Date(val.updatedAt)?.toISOString().slice(0, 10),
            client: val.orderedBy.name,
          };
        })
      );
    }
  };
  const handleTrigger = (id, e) => {
    if (e == "completed") {
      setCompleteModal(true);
    } else {
      setIsOpen(true);
      setId({ id, e });
    }
  };

  useEffect(() => {
    serviceList();
  }, []);

  return (
    <div>
      <div className="flex flex-row-reverse justify-end flex-wrap">
        <div className="p-4 mb-4 ml-8 max-w-sm w-max bg-white rounded-lg border shadow-md sm:p-8 ">
          <h5 className="mb-4 text-xl font-medium text-accent ">
            Available Efix Balance
          </h5>
          <div className="flex items-baseline text-accent ">
            <span className="text-3xl font-semibold">$</span>
            <span className="text-5xl font-extrabold tracking-tight">
              {Math.abs(user?.user?.balance?.$numberDecimal)}
            </span>
            <span className="ml-1 text-xl font-normal text-gray-500 ">
              {user?.user?.balance?.$numberDecimal ? "/Receivable" : "/Payable"}
            </span>
          </div>

          <button
            type="button"
            className="text-white mt-6 bg-secondary hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-200  font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center"
            onClick={() => setEmail(true)}
          >
            Redeem
          </button>
        </div>
        <div className="p-4 mb-4 max-w-sm w-max bg-white rounded-lg border shadow-md sm:p-8 ">
          <h5 className="mb-4 text-xl font-medium text-accent ">Commission</h5>
          <div className="flex items-baseline text-accent ">
            <span className="text-3xl font-semibold">$</span>
            <span className="text-5xl font-extrabold tracking-tight">
              {Math.abs(user?.user?.commissionToPay?.$numberDecimal).toFixed(2)}
            </span>
            {/* <span className="ml-1 text-xl font-normal text-gray-500 dark:text-gray-400">
              {user?.user?.balance?.$numberDecimal ? "/Receivable" : "/Payable"}
            </span> */}
          </div>
        </div>
      </div>
      {/* <DefaultTable
        titleArray={titleArray}
        fields={fields}
        handleSearch={handleSearch}
        list={list.filter((val) => val.status == "completed")}
      /> */}
      {email && <PaymentEmail onClose={() => setEmail(false)} />}
    </div>
  );
};

export default OrdersStatus;
