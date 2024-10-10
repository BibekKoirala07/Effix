import React, { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import OrdersTable from "../../components/Table/OrdersTable";
import Table from "../../components/Table/Table";
import { acceptOrder, activeRequests } from "../../services/service.services";
import { getService } from "../../services/user.services";
import { Dialog } from "@headlessui/react";
import ModalCustom from "../../components/buttons/Modal";
import { toast } from "react-toastify";

const ActiveOrders = () => {
  const [list, setList] = useState([]);
  const [id, setId] = useState("");

  let [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.user);
  const [text, setText] = useState("");
  const handleSearch = (e) => {
    setText(e.target.value);
  };
  const router = useHistory();
  const titleArray = ["Service Title", "Note", "Order Date", "Client Name"];
  const fields = ["title", "notes", "orderDate", "client"];
  const serviceList = async () => {
    const [response] = await activeRequests({
      categories: user.user.categories,
    });
    console.log(response.data)
    if (response) {
      setList(
        response.data.map((val) => {
          return {
            ...val,
            title: val.service ? val.service.title : "Deleted Service",
            orderDate: new Date(val.updatedAt)?.toISOString().slice(0, 10),
            client: val.orderedBy.name,
          };
        })
      );
    }
  };
  const handleTrigger = (id) => {
    setIsOpen(true);
    setId(id);
  };
  const handleOrder = async () => {
    const [response, error] = await acceptOrder(id);
    if (response) {
      toast.success("Order Succesfully accepted");
      serviceList();
      setIsOpen(false);
    } else {
      toast.error(error.response.data.msg);
    }
  };
  useEffect(() => {
    console.log(user, "tesaaa");
    serviceList();
  }, [user]);

  return (
    <div>
      <OrdersTable
        titleArray={titleArray}
        fields={fields}
        handleSearch={handleSearch}
        list={list.filter((val) =>
          text ? val.title.toUpperCase().includes(text.toUpperCase()) : true
        )}
        trigger={handleTrigger}
      />
      <ModalCustom
        open={isOpen}
        setOpen={setIsOpen}
        title="Accept order?"
        handleSuccess={handleOrder}
        desc={"Are you sure you want to accept the order"}
        submitText={"Accept"}
      />
    </div>
  );
};

export default ActiveOrders;
