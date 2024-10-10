import React, { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import Table from "../../components/Table/Table";
import { getActiveOrders } from "../../services/user.services";

const DashHome = () => {
  const [list, setList] = useState([]);
  const [text, setText] = useState("");
  const handleSearch = (e) => {
    setText(e.target.value);
  };
  const titleArray = ["Service Title", "Note", "Order Date", "Client Name"];
  const fields = ["title", "notes", "orderDate", "client"];
  const user = useSelector((state) => state.user);
  const serviceList = async () => {
    const [response] = await getActiveOrders();
    if (response) {
      setList(
        response.data.map((val) => {
          return {
            ...val,
            title: val.service ? val.service.title : "Deleted service",
            orderDate: new Date(val.updatedAt)?.toISOString().slice(0, 10),
            client: val.orderedBy.name ? val.orderedBy.name : "Deleted client",
          };
        })
      );
    }
  };

  useEffect(() => {
    serviceList();
  }, [user]);

  return (
    <Table
      titleArray={titleArray}
      fields={fields}
      handleSearch={handleSearch}
      list={list.filter((val) =>
        text ? val.title.toUpperCase().includes(text.toUpperCase()) : true
      )}
      admin={true}
    />
  );
};

export default DashHome;
