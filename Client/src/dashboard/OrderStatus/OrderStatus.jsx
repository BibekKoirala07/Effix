import React, { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import OrdersTable from "../../components/Table/OrdersTable";
import {
  acceptOrder,
  activeRequests,
  orderStatus,
  updateStatus,
  updateStatusToCompleted,
  withdrawOrder,
} from "../../services/service.services";
import ModalCustom, {
  ModalCustomWithInput,
} from "../../components/buttons/Modal";
import { toast } from "react-toastify";
import StatusOrdersTable from "../../components/Table/StatusTable";

const OrdersStatus = () => {
  const [list, setList] = useState([]);
  const [id, setId] = useState({ id: "", e: "" });

  let [isOpen, setIsOpen] = useState(false);

  let [completeModal, setCompleteModal] = useState(false);
  const user = useSelector((state) => state.user);
  const [text, setText] = useState("");
  const handleSearch = (e) => {
    setText(e.target.value);
  };
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
      setId({ id, e });
    } else {
      setIsOpen(true);
      setId({ id, e });
    }
  };

  const revokeOrder = async (id) => {
    const [response, error] = await withdrawOrder(id);
    if (response) {
      toast.success(`Order Succesfully withdrawn`);
      serviceList();
      setIsOpen(false);
    } else {
      toast.error(error.response.data.msg);
    }
  };

  const handleChange = () => {
    switch (id.e) {
      case "onProgress":
        handleOrder("onProgress", id.id);
        break;
      case "completed":
        handleOrder("complete", id.id);
        break;
      case "paid":
        handleOrder("paid", id.id);
        break;
      default:
        handleOrder("complete", id.id);
    }
  };
  const handleOrder = async (type, payload) => {
    const [response, error] = await updateStatus(type, payload);
    if (response) {
      toast.success(`Order Succesfully ${id.e}`);
      serviceList();
      setIsOpen(false);
    } else {
      toast.error(error.response.data.msg);
    }
  };
  const handleCompleted = async (payload) => {
    const [response, error] = await updateStatusToCompleted(id.id, payload);
    if (response) {
      toast.success(`Order Succesfully Completed`);
      serviceList();
      setCompleteModal(false);
    } else {
      toast.error(error.response.data.msg);
    }
  };

  useEffect(() => {
    serviceList();
  }, []);

  return (
    <div>
      <StatusOrdersTable
        titleArray={titleArray}
        fields={fields}
        handleSearch={handleSearch}
        list={list.filter((val) =>
          text ? val.title.toUpperCase().includes(text.toUpperCase()) : true
        )}
        trigger={handleTrigger}
        revokeOrder={revokeOrder}
      />
      <ModalCustom
        open={isOpen}
        setOpen={setIsOpen}
        title={`Are you sure this service is ${id.e.toLowerCase()}?`}
        handleSuccess={handleChange}
        desc={"Once updated this action cannot be undone"}
        submitText={"Submit"}
      />
      <ModalCustomWithInput
        open={completeModal}
        setOpen={setCompleteModal}
        title={``}
        handleSuccess={handleCompleted}
        desc={""}
        submitText={"Submit"}
      />
    </div>
  );
};

export default OrdersStatus;
