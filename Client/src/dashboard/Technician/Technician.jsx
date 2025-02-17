import React, { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import Table from "../../components/Table/Table";
import { getTechnicianList } from "../../services/service.services";
import { getActiveOrders } from "../../services/user.services";

const DashHome = () => {
  const [list, setList] = useState([]);
  const user = useSelector((state) => state.user);
  const [text, setText] = useState("");

  const handleSearch = (e) => {
    setText(e.target.value);
  };

  const titleArray = ["Name", "Phone", "Email", "Balance", "Experience"];
  const fields = ["name", "phone", "email", "balance", "experience"];

  const serviceList = async () => {
    const [response] = await getTechnicianList();
    if (response) {
      setList(
        response.data.map((val) => {
          return {
            ...val,
            balance: val.balance["$numberDecimal"],
            experience: val?.experience?.$numberDecimal || 0,
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
        text ? val.name.toUpperCase().includes(text.toUpperCase()) : true
      )}
      admin={true}
    />
  );
};

export default DashHome;
